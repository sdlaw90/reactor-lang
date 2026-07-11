import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { cleanEmail, looksLikeEmail } from "../../../lib/emailUtils";
import { brandedEmail, detailRows, escapeHtml } from "../../../lib/emailTemplate";
import { isValidQuestionKey, normalizeAnswer, REQUIRED_QUESTION_COUNT } from "../../../lib/securityQuestions";
import { hashAnswer } from "../../../lib/securityAnswerHash";

// Public beta application submissions, moved server-side (previously a
// direct client insert from lib/db.js). Server-side gives us three things a
// client insert never could: (1) email cleanup/validation BEFORE bad strings
// enter the database, (2) a safe place to send the admin a notification
// email via Resend (the API key must never reach the browser), and (3) a
// home for the rate limiting below (#47).

// ---------------------------------------------------------------------------
// INTERIM AUTO-APPROVE (until #65 domain/SMTP chain is done)
//
// While Supabase's shared email service can't deliver invites to external
// addresses (the /auth/v1/invite 500, confirmed 2026-07-10), applications
// are auto-approved on submit: the account is created directly with
// email_confirm: true (no email ever sent) and the generated password is
// returned ONCE in the response for the applicant to save.
//
// Flip this to false when #65 completes (step 9 of that checklist) to
// restore the manual review + Supabase invite flow. Nothing else needs to
// change — the review path below is untouched.
// ---------------------------------------------------------------------------
const AUTO_APPROVE_BETA = true;

// --- Rate limiting (#47 down payment) --------------------------------------
// In-memory, per-IP, per-serverless-instance. Not bulletproof (each warm
// Vercel instance has its own map, and a cold start clears it) but it stops
// casual abuse of an unauthenticated endpoint that now creates accounts.
// Revisit with a durable store (DB count or Upstash) when #33 ships.
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5; // submissions per IP per window
const rateBuckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  // Opportunistic prune so the map can't grow unbounded on a warm instance.
  if (rateBuckets.size > 500) {
    for (const [k, v] of rateBuckets) {
      if (now - v.start > RATE_WINDOW_MS) rateBuckets.delete(k);
    }
  }
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_MAX;
}

// --- Password generation ----------------------------------------------------
// crypto-random, ambiguity-free charset (no 0/O, 1/l/I), 14 chars ≈ 80 bits.
// Rejection sampling keeps the distribution uniform (no modulo bias).
const PASSWORD_CHARSET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
// RETIRED (beta.8): the applicant now chooses their own password. Kept only
// in case a generated-credential fallback is ever needed again.
// eslint-disable-next-line no-unused-vars
function generatePassword(length = 14) {
  const out = [];
  while (out.length < length) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < PASSWORD_CHARSET.length * Math.floor(256 / PASSWORD_CHARSET.length)) {
      out.push(PASSWORD_CHARSET[byte % PASSWORD_CHARSET.length]);
    }
  }
  return out.join("");
}

async function notifyAdminOfApplication(application, autoApproved) {
  // Fire-and-forget in spirit, but awaited in practice: on Vercel the
  // function can freeze the moment the response is sent, so an un-awaited
  // fetch may silently never happen. Awaited inside its own try/catch so a
  // Resend failure can NEVER fail the application itself.
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!resendKey || !adminEmail) {
      console.warn("Beta application notification skipped (RESEND_API_KEY or admin email not set).");
      return;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const statusLine = autoApproved
      ? "AUTO-APPROVED — account created on submit (interim flow, #65)"
      : "Pending review";

    const lines = [
      `New beta application from ${application.name} <${application.email}>`,
      `Status: ${statusLine}`,
      "",
      `Native language: ${application.native_language || "—"}`,
      `Wants to learn: ${application.languages_interested || "—"}`,
      `Level: ${application.current_level || "—"}`,
      `Devices: ${(application.details?.devices || []).join(", ") || "—"}`,
      "",
      `Review it here: ${siteUrl}/admin?tab=applications`,
    ];

    const bodyHtml =
      detailRows([
        ["From", `${application.name} <${application.email}>`],
        ["Status", statusLine],
        ["Native language", application.native_language],
        ["Wants to learn", application.languages_interested],
        ["Level", application.current_level],
        ["Devices", (application.details?.devices || []).join(", ")],
      ]) +
      (application.reason
        ? `<p style="margin: 14px 0 6px;"><strong style="color: #F3F0FA;">Why they want in:</strong></p>
           <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(application.reason)}</p>`
        : "");

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: adminEmail,
        subject: `SquirreLingo beta application: ${application.name}`,
        html: brandedEmail({
          heading: "🌰 New beta application",
          bodyHtml,
          cta: { label: "Review application", url: `${siteUrl}/admin?tab=applications` },
        }),
        text: lines.join("\n"),
      }),
    });
    if (!resp.ok) {
      console.error("Beta application notification failed", await resp.text());
    }
  } catch (e) {
    console.error("Beta application notification failed", e);
  }
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { name, email, reason, languagesInterested, nativeLanguage, currentLevel, details, username, password, passwordHint, securityQuestions } = body;

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many applications from this connection — please try again in an hour." },
      { status: 429 }
    );
  }

  const cleanedEmail = cleanEmail(email);
  if (!name?.trim() || !cleanedEmail) {
    return Response.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!looksLikeEmail(cleanedEmail)) {
    return Response.json({ error: "That email address doesn't look valid — double-check it for typos." }, { status: 400 });
  }

  // Account fields for the auto-approve flow: the applicant chooses their own
  // username + password and is signed in immediately client-side (no more
  // one-time generated-password screen). Validated up front so a rejection
  // never leaves an orphaned application row behind. The password is used
  // ONLY for createUser below — it must never be stored in the application
  // row or logged.
  const chosenUsername = typeof username === "string" ? username.trim() : "";
  const chosenPassword = typeof password === "string" ? password : "";
  if (details && typeof details === "object") {
    delete details.password;
    delete details.username;
  }

  // Password recovery (#79) — optional, all-or-nothing, validated up front
  // like the credentials above. Answers are credentials: hashed below,
  // never stored in the application row or logged.
  const chosenHint = typeof passwordHint === "string" ? passwordHint.trim().slice(0, 200) : "";
  let chosenQuestions = null;
  if (Array.isArray(securityQuestions) && securityQuestions.length > 0) {
    if (securityQuestions.length !== REQUIRED_QUESTION_COUNT) {
      return Response.json(
        { error: `Security questions: exactly ${REQUIRED_QUESTION_COUNT} are required (or none at all).` },
        { status: 400 }
      );
    }
    const keys = securityQuestions.map((q) => q?.key);
    if (new Set(keys).size !== keys.length || !keys.every(isValidQuestionKey)) {
      return Response.json({ error: "Security questions: pick three different questions from the list." }, { status: 400 });
    }
    if (!securityQuestions.every((q) => normalizeAnswer(q?.answer).length > 0)) {
      return Response.json({ error: "Security questions: every chosen question needs an answer." }, { status: 400 });
    }
    chosenQuestions = securityQuestions.map((q) => ({ key: q.key, answer: q.answer }));
  }
  if (details && typeof details === "object") {
    delete details.passwordHint;
    delete details.securityQuestions;
  }
  if (AUTO_APPROVE_BETA) {
    if (chosenUsername.length < 3 || !/^[A-Za-z0-9_]+$/.test(chosenUsername)) {
      return Response.json({ error: "Username must be at least 3 characters (letters, numbers, and _ only)." }, { status: 400 });
    }
    if (chosenPassword.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
  }

  try {
    // Prefer the service role key; fall back to the anon key (the table's
    // RLS policy allows anon inserts) so a missing env var degrades
    // gracefully instead of breaking public applications entirely.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const autoApproving = AUTO_APPROVE_BETA && Boolean(serviceKey);

    const row = {
      name: name.trim(),
      email: cleanedEmail,
      reason: reason?.trim() || null,
      languages_interested: languagesInterested?.trim() || null,
      native_language: nativeLanguage?.trim() || null,
      current_level: currentLevel || null,
      // auto_approved lives inside details (JSON) rather than a new column,
      // so no migration is needed for the interim flow.
      details: { ...(details || {}), auto_approved: autoApproving },
    };

    // With the service key, .select() returns the row id — the auto-approve
    // path below flips that row to 'approved' once the account actually
    // exists (before this, auto-approved rows stayed 'pending' forever and
    // the admin list showed them wrong; migration 010 backfills historical
    // ones). On the anon-key fallback the .select() is skipped: the table
    // has an INSERT policy but deliberately no SELECT policy, so RETURNING
    // would fail the whole insert — and the fallback never auto-approves
    // anyway, so the id isn't needed.
    let insertedId = null;
    if (serviceKey) {
      const { data: inserted, error } = await supabase.from("beta_applications").insert(row).select("id").single();
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
      insertedId = inserted?.id ?? null;
    } else {
      const { error } = await supabase.from("beta_applications").insert(row);
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // --- Interim auto-approve: create the account directly, no email -------
    // The applicant's own password is used; the response carries no secrets.
    let accountCreated = false;
    if (autoApproving) {
      // Server-side availability check (client checks too, but this is the
      // authoritative one). Same RPC the rest of the app uses.
      try {
        const { data: taken } = await supabase.rpc("is_username_taken", { p_username: chosenUsername });
        if (taken) {
          return Response.json({ error: "That username is already taken — go back a step and pick another." }, { status: 409 });
        }
      } catch (e) {
        console.error("username availability check failed; proceeding (gate will catch collisions)", e);
      }

      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: cleanedEmail,
        password: chosenPassword,
        email_confirm: true, // marks the address confirmed WITHOUT sending anything
        user_metadata: { pending_username: chosenUsername },
      });

      if (createError) {
        const isDuplicate =
          createError.code === "email_exists" ||
          /already.*(registered|exists)/i.test(createError.message || "");
        if (isDuplicate) {
          return Response.json(
            {
              error:
                "An account with this email already exists. Try signing in — or if you've lost access, contact us and we'll sort it out.",
            },
            { status: 409 }
          );
        }
        // Any other failure: the application row is saved, so degrade to the
        // old pending flow rather than erroring the whole submission.
        console.error("Auto-approve createUser failed; application left pending", createError);
      } else {
        accountCreated = true;
        // Claim the username right away (service role bypasses RLS). If this
        // races or fails, pending_username stays set and RequireUsernameGate
        // catches it on first login — same fallback the auth page relies on.
        try {
          const userId = created?.user?.id;
          if (userId) {
            await supabase
              .from("profiles")
              .upsert({ user_id: userId, username: chosenUsername, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
          }
        } catch (e) {
          console.error("profile username claim failed; RequireUsernameGate will handle it", e);
        }

        // Store password recovery (#79) if the applicant set it up. Failure
        // is non-fatal — they can redo it in Settings → Password recovery —
        // but log it, since a silent miss here strands them on the admin
        // reset path without knowing it.
        try {
          const userId = created?.user?.id;
          if (userId && (chosenHint || chosenQuestions)) {
            if (chosenHint) {
              await supabase
                .from("profiles")
                .upsert(
                  { user_id: userId, password_hint: chosenHint, updated_at: new Date().toISOString() },
                  { onConflict: "user_id" }
                );
            }
            if (chosenQuestions) {
              await supabase.from("security_questions").insert(
                chosenQuestions.map((q) => ({
                  user_id: userId,
                  question_key: q.key,
                  answer_hash: hashAnswer(normalizeAnswer(q.answer)),
                }))
              );
            }
          }
        } catch (e) {
          console.error("password recovery setup during beta-apply failed (user can redo in Settings)", e);
        }

        // Reflect reality in the application row: the account exists, so
        // this application is approved, not pending. Service-role client,
        // so RLS isn't in the way. Failure here is cosmetic (admin list
        // shows it as pending) — never fail the submission over it.
        if (insertedId != null) {
          try {
            await supabase
              .from("beta_applications")
              .update({ status: "approved", reviewed_at: new Date().toISOString() })
              .eq("id", insertedId);
          } catch (e) {
            console.error("auto-approve status update failed (cosmetic)", e);
          }
        }
      }
    }

    await notifyAdminOfApplication(row, accountCreated);

    return Response.json({ ok: true, autoApproved: accountCreated });
  } catch (e) {
    console.error("beta-apply POST failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

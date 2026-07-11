import { createClient } from "@supabase/supabase-js";
import { cleanEmail, looksLikeEmail } from "../../../lib/emailUtils";
import {
  REQUIRED_CORRECT_ANSWERS,
  questionLabel,
  normalizeAnswer,
} from "../../../lib/securityQuestions";
import { verifyAnswer, generateResetToken, hashResetToken } from "../../../lib/securityAnswerHash";

// Self-serve password reset via security questions (#79) — works without
// email delivery, which the #65 chain doesn't provide yet. PERMANENT
// (decision 2026-07-12): stays as the fallback after email reset becomes
// primary at #65.
//
// Pre-auth by nature, so hardened accordingly:
//   * Per-IP in-memory rate limit (same trade-offs as beta-apply's — see
//     that route), tighter window here because this endpoint is an oracle.
//   * Per-ACCOUNT durable lockout (profiles.sq_failed_attempts /
//     sq_locked_until): 5 failed verify attempts locks answer verification
//     for 1 hour, across all IPs and serverless instances.
//   * Anti-enumeration: "no such account" and "account without questions"
//     return the exact same shape; request_admin always reports success.
//     (An account WITH questions is confirmable by design — that's inherent
//     to showing its questions; the lockout bounds what that's worth.)
//   * Reset tokens: 32 random bytes, sha256-hashed at rest, 15-minute
//     expiry, single-use (password_reset_tokens, migration 011).
//
// Actions (POST { action, ... }):
//   lookup        { email }                  → { hasQuestions, questions?, hint }
//   verify        { email, answers: {key: answer} } → { token } | 401
//   reset         { token, newPassword }     → { ok }
//   request_admin { email }                  → { ok } (always)

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 15; // covers a legitimate lookup→verify(×few)→reset sequence
const rateBuckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
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

const ACCOUNT_LOCK_THRESHOLD = 5;
const ACCOUNT_LOCK_MS = 60 * 60 * 1000;
const TOKEN_TTL_MS = 15 * 60 * 1000;

function serviceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — password reset requires it.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Look an auth user up by email via the admin API. listUsers-with-filter
// isn't available on this SDK version, so page through — same closed-beta
// scale trade-off the admin routes make.
async function findUserByEmail(db, email) {
  const target = email.toLowerCase();
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return (data?.users || []).find((u) => u.email?.toLowerCase() === target) || null;
}

// The shape returned for "nothing self-serve available" — identical whether
// the account doesn't exist, or exists without questions (hint may differ,
// but a null hint is indistinguishable from no account).
function noQuestionsShape(hint) {
  return Response.json({ hasQuestions: false, hint: hint || null });
}

export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many reset attempts from this connection — please try again in an hour." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  try {
    const db = serviceClient();

    // ---- lookup -----------------------------------------------------------
    if (action === "lookup") {
      const email = cleanEmail(body.email);
      if (!email || !looksLikeEmail(email)) {
        return Response.json({ error: "Enter a valid email address." }, { status: 400 });
      }
      const user = await findUserByEmail(db, email);
      if (!user) return noQuestionsShape(null);

      const [{ data: profile }, { data: questions }] = await Promise.all([
        db.from("profiles").select("password_hint, sq_locked_until").eq("user_id", user.id).maybeSingle(),
        db.from("security_questions").select("question_key").eq("user_id", user.id),
      ]);

      if (!questions || questions.length === 0) {
        return noQuestionsShape(profile?.password_hint);
      }

      const lockedUntil = profile?.sq_locked_until ? new Date(profile.sq_locked_until).getTime() : 0;
      if (lockedUntil > Date.now()) {
        return Response.json(
          { error: "Too many incorrect answers — this account's questions are locked for a while. Try again later, or request an admin reset." },
          { status: 429 }
        );
      }

      return Response.json({
        hasQuestions: true,
        hint: profile?.password_hint || null,
        questions: questions.map((q) => ({ key: q.question_key, label: questionLabel(q.question_key) })),
      });
    }

    // ---- verify -----------------------------------------------------------
    if (action === "verify") {
      const email = cleanEmail(body.email);
      const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
      if (!email || !looksLikeEmail(email)) {
        return Response.json({ error: "Enter a valid email address." }, { status: 400 });
      }
      const user = await findUserByEmail(db, email);
      // Generic failure for a nonexistent account — same message as wrong answers.
      const genericFail = () =>
        Response.json({ error: "Those answers don't match what's on file." }, { status: 401 });
      if (!user) return genericFail();

      const [{ data: profile }, { data: questions }] = await Promise.all([
        db.from("profiles").select("sq_failed_attempts, sq_locked_until").eq("user_id", user.id).maybeSingle(),
        db.from("security_questions").select("question_key, answer_hash").eq("user_id", user.id),
      ]);
      if (!questions || questions.length === 0) return genericFail();

      const lockedUntil = profile?.sq_locked_until ? new Date(profile.sq_locked_until).getTime() : 0;
      if (lockedUntil > Date.now()) {
        return Response.json(
          { error: "Too many incorrect answers — this account's questions are locked for a while. Try again later, or request an admin reset." },
          { status: 429 }
        );
      }

      let correct = 0;
      for (const q of questions) {
        const given = normalizeAnswer(answers[q.question_key]);
        if (given && verifyAnswer(given, q.answer_hash)) correct += 1;
      }

      if (correct < REQUIRED_CORRECT_ANSWERS) {
        const failed = (profile?.sq_failed_attempts || 0) + 1;
        const update = { sq_failed_attempts: failed };
        if (failed >= ACCOUNT_LOCK_THRESHOLD) {
          update.sq_locked_until = new Date(Date.now() + ACCOUNT_LOCK_MS).toISOString();
          update.sq_failed_attempts = 0; // counter restarts after the lock expires
        }
        await db.from("profiles").update(update).eq("user_id", user.id);
        return genericFail();
      }

      // Success: clear lockout state, issue a one-time token.
      await db.from("profiles").update({ sq_failed_attempts: 0, sq_locked_until: null }).eq("user_id", user.id);

      const rawToken = generateResetToken();
      const { error: tokenError } = await db.from("password_reset_tokens").insert({
        user_id: user.id,
        token_hash: hashResetToken(rawToken),
        expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
      });
      if (tokenError) return Response.json({ error: tokenError.message }, { status: 500 });

      return Response.json({ token: rawToken });
    }

    // ---- reset ------------------------------------------------------------
    if (action === "reset") {
      const rawToken = typeof body.token === "string" ? body.token : "";
      const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
      if (!rawToken) {
        return Response.json({ error: "Missing reset token — start over from the reset page." }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }

      const { data: tokenRow } = await db
        .from("password_reset_tokens")
        .select("id, user_id, expires_at, used_at")
        .eq("token_hash", hashResetToken(rawToken))
        .maybeSingle();

      const expired = !tokenRow || tokenRow.used_at || new Date(tokenRow.expires_at).getTime() < Date.now();
      if (expired) {
        return Response.json(
          { error: "This reset session has expired — start over and answer your questions again." },
          { status: 401 }
        );
      }

      // Mark used BEFORE the password change and only proceed if this call
      // won the race (used_at was still null) — a replayed token can't
      // trigger a second password set.
      const { data: claimed } = await db
        .from("password_reset_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenRow.id)
        .is("used_at", null)
        .select("id");
      if (!claimed || claimed.length === 0) {
        return Response.json(
          { error: "This reset session has expired — start over and answer your questions again." },
          { status: 401 }
        );
      }

      const { error: pwError } = await db.auth.admin.updateUserById(tokenRow.user_id, {
        password: newPassword,
      });
      if (pwError) return Response.json({ error: pwError.message }, { status: 500 });

      return Response.json({ ok: true });
    }

    // ---- request_admin ----------------------------------------------------
    if (action === "request_admin") {
      const email = cleanEmail(body.email);
      if (!email || !looksLikeEmail(email)) {
        return Response.json({ error: "Enter a valid email address." }, { status: 400 });
      }
      const user = await findUserByEmail(db, email);
      if (user) {
        // Skip duplicates: one pending request per account is enough.
        const { data: existing } = await db
          .from("password_reset_requests")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .limit(1);
        if (!existing || existing.length === 0) {
          await db.from("password_reset_requests").insert({ user_id: user.id });
        }
      }
      // Always report success — never confirm whether the account exists.
      return Response.json({ ok: true });
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    console.error("password-reset action failed", e);
    return Response.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}

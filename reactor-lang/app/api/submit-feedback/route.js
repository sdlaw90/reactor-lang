import { createClient } from "@supabase/supabase-js";
import { brandedEmail, detailRows, escapeHtml } from "../../../lib/emailTemplate";

// Bug reports + feature requests, server-side (same reasoning as beta-apply):
// (1) identity comes from the caller's session token, never from typed form
//     fields -- tamper-proof and zero friction for the tester,
// (2) screenshot uploads go into the private bug-screenshots bucket,
// (3) the admin notification email (with a signed screenshot link) is sent
//     from here, where the Resend key is safe.
//
// Expects multipart/form-data:
//   type        "bug" | "feature"                (required)
//   message     main description                 (required)
//   extra       steps-to-reproduce / problem     (optional)
//   errorCode   e.g. SQ-M3K7X2                   (optional)
//   pageContext page the report came from        (optional)
//   userAgent   captured automatically client-side (optional)
//   screenshot  image file <= 5 MB               (optional, bug only)
// Auth: Authorization: Bearer <supabase access token> (required)

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export async function POST(req) {
  try {
    // --- authenticate the caller from their session token ---
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return Response.json({ error: "You need to be signed in to send this." }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

    // Client acting AS the user (RLS applies) -- used to verify the token.
    const asUser = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await asUser.auth.getUser(token);
    if (userErr || !userData?.user) {
      return Response.json({ error: "Your session has expired — sign in again and retry." }, { status: 401 });
    }
    const user = userData.user;

    // Privileged client if available; otherwise fall back to acting as the
    // user (works for table insert + storage upload via the RLS policies,
    // but not for signed URLs -- handled below).
    const admin = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : null;
    const db = admin || asUser;

    // --- parse + validate the form ---
    const form = await req.formData();
    const type = form.get("type");
    const message = (form.get("message") || "").toString().trim();
    const extra = (form.get("extra") || "").toString().trim();
    const errorCode = (form.get("errorCode") || "").toString().trim().toUpperCase().slice(0, 20);
    const pageContext = (form.get("pageContext") || "").toString().slice(0, 500);
    const userAgent = (form.get("userAgent") || "").toString().slice(0, 500);
    const screenshot = form.get("screenshot");

    if (type !== "bug" && type !== "feature") {
      return Response.json({ error: "Unknown submission type." }, { status: 400 });
    }
    if (!message) {
      return Response.json({ error: "A description is required." }, { status: 400 });
    }

    // --- username snapshot (nice for the admin email; failure is fine) ---
    let username = null;
    try {
      const { data: profile } = await db.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
      username = profile?.username || null;
    } catch {
      /* snapshot only */
    }

    // --- optional screenshot upload ---
    let screenshotPath = null;
    let screenshotNote = null;
    if (screenshot && typeof screenshot === "object" && typeof screenshot.arrayBuffer === "function" && screenshot.size > 0) {
      if (!String(screenshot.type).startsWith("image/")) {
        return Response.json({ error: "Screenshots must be an image file." }, { status: 400 });
      }
      if (screenshot.size > MAX_SCREENSHOT_BYTES) {
        return Response.json({ error: "Screenshots must be 5 MB or smaller." }, { status: 400 });
      }
      const ext = (screenshot.name?.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const bytes = Buffer.from(await screenshot.arrayBuffer());
      const { error: upErr } = await db.storage
        .from("bug-screenshots")
        .upload(path, bytes, { contentType: screenshot.type, upsert: false });
      if (upErr) {
        // Don't lose the report over an attachment problem.
        console.error("screenshot upload failed", upErr);
        screenshotNote = `screenshot upload failed: ${upErr.message}`;
      } else {
        screenshotPath = path;
      }
    }

    // --- insert the submission ---
    const details = {};
    if (extra) details[type === "bug" ? "steps_to_reproduce" : "problem_it_solves"] = extra;
    if (userAgent) details.user_agent = userAgent;
    if (screenshotNote) details.screenshot_note = screenshotNote;

    const { error: insErr } = await db.from("feedback_submissions").insert({
      user_id: user.id,
      type,
      message,
      page_context: pageContext || null,
      username,
      email: user.email || null,
      error_code: errorCode || null,
      screenshot_path: screenshotPath,
      details: Object.keys(details).length ? details : null,
    });
    if (insErr) {
      return Response.json({ error: insErr.message }, { status: 500 });
    }

    await notifyAdmin({ admin, type, message, extra, errorCode, pageContext, username, email: user.email, screenshotPath });

    return Response.json({ ok: true });
  } catch (e) {
    console.error("submit-feedback POST failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

async function notifyAdmin({ admin, type, message, extra, errorCode, pageContext, username, email, screenshotPath }) {
  // Awaited but isolated, same as beta-apply: a Resend failure can never
  // fail the submission itself.
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!resendKey || !adminEmail) {
      console.warn("Feedback notification skipped (RESEND_API_KEY or admin email not set).");
      return;
    }
    const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const isBug = type === "bug";
    const who = [username, email].filter(Boolean).join(" · ") || "unknown user";

    // Signed URL for the private screenshot (needs the service role).
    let screenshotUrl = null;
    if (screenshotPath && admin) {
      const { data } = await admin.storage.from("bug-screenshots").createSignedUrl(screenshotPath, 60 * 60 * 24 * 7);
      screenshotUrl = data?.signedUrl || null;
    }

    const heading = isBug ? "🐞 New bug report" : "💡 New feature request";
    const bodyHtml =
      detailRows([
        ["From", who],
        ["Error code", errorCode || null],
        ["Page", pageContext || null],
      ]) +
      `<p style="margin: 14px 0 6px;"><strong style="color: #F3F0FA;">${isBug ? "What happened" : "The idea"}:</strong></p>
       <p style="margin: 0 0 10px; white-space: pre-wrap;">${escapeHtml(message)}</p>` +
      (extra
        ? `<p style="margin: 14px 0 6px;"><strong style="color: #F3F0FA;">${isBug ? "Steps to reproduce" : "Problem it solves"}:</strong></p>
           <p style="margin: 0 0 10px; white-space: pre-wrap;">${escapeHtml(extra)}</p>`
        : "") +
      (screenshotUrl
        ? `<p style="margin: 14px 0 0;"><a href="${screenshotUrl}" style="color: #FF8FB1;">View attached screenshot</a> (link valid 7 days)</p>`
        : screenshotPath
          ? `<p style="margin: 14px 0 0; color: #7C7395;">Screenshot attached at <code>${escapeHtml(screenshotPath)}</code> (no service key — open via the Supabase dashboard).</p>`
          : "");

    const textLines = [
      `${isBug ? "Bug report" : "Feature request"} from ${who}`,
      errorCode ? `Error code: ${errorCode}` : null,
      pageContext ? `Page: ${pageContext}` : null,
      "",
      message,
      extra ? `\n${isBug ? "Steps" : "Problem it solves"}: ${extra}` : null,
      screenshotUrl ? `\nScreenshot: ${screenshotUrl}` : null,
    ].filter((l) => l !== null);

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress,
        to: adminEmail,
        subject: `SquirreLingo ${isBug ? "bug report" : "feature request"}${errorCode ? ` [${errorCode}]` : ""}: ${message.slice(0, 60)}`,
        html: brandedEmail({ heading, bodyHtml }),
        text: textLines.join("\n"),
      }),
    });
    if (!resp.ok) console.error("Feedback notification failed", await resp.text());
  } catch (e) {
    console.error("Feedback notification failed", e);
  }
}

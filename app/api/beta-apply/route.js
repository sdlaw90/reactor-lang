import { createClient } from "@supabase/supabase-js";
import { cleanEmail, looksLikeEmail } from "../../../lib/emailUtils";

// Public beta application submissions, moved server-side (previously a
// direct client insert from lib/db.js). Server-side gives us three things a
// client insert never could: (1) email cleanup/validation BEFORE bad strings
// enter the database, (2) a safe place to send the admin a notification
// email via Resend (the API key must never reach the browser), and (3) a
// future home for rate limiting (#47) once payments make abuse a real
// concern.

async function notifyAdminOfApplication(application) {
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

    const lines = [
      `New beta application from ${application.name} <${application.email}>`,
      "",
      `Native language: ${application.native_language || "—"}`,
      `Wants to learn: ${application.languages_interested || "—"}`,
      `Level: ${application.current_level || "—"}`,
      `Devices: ${(application.details?.devices || []).join(", ") || "—"}`,
      "",
      `Review it here: ${siteUrl}/admin/beta-applications`,
    ];

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
  const { name, email, reason, languagesInterested, nativeLanguage, currentLevel, details } = body;

  const cleanedEmail = cleanEmail(email);
  if (!name?.trim() || !cleanedEmail) {
    return Response.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!looksLikeEmail(cleanedEmail)) {
    return Response.json({ error: "That email address doesn't look valid — double-check it for typos." }, { status: 400 });
  }

  try {
    // Prefer the service role key; fall back to the anon key (the table's
    // RLS policy allows anon inserts) so a missing env var degrades
    // gracefully instead of breaking public applications entirely.
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const row = {
      name: name.trim(),
      email: cleanedEmail,
      reason: reason?.trim() || null,
      languages_interested: languagesInterested?.trim() || null,
      native_language: nativeLanguage?.trim() || null,
      current_level: currentLevel || null,
      details: details || null,
    };

    const { error } = await supabase.from("beta_applications").insert(row);
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    await notifyAdminOfApplication(row);

    return Response.json({ ok: true });
  } catch (e) {
    console.error("beta-apply POST failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

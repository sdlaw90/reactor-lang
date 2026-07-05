import { createClient } from "@supabase/supabase-js";

// Requires a valid Supabase access token so this can't be used as an open
// spam-relay — only genuinely signed-in users can trigger a notification.
async function getRequestingUser(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

function messageFor(type, meta) {
  switch (type) {
    case "email_changed":
      return {
        subject: "Your Reactor Lang email is being changed",
        text: `Someone (hopefully you) requested to change the email on your Reactor Lang account to ${meta?.newEmail || "a new address"}. If this wasn't you, your password may be compromised — sign in and change it immediately.`,
      };
    case "password_changed":
      return {
        subject: "Your Reactor Lang password was changed",
        text: "Your Reactor Lang account password was just changed. If this wasn't you, someone else may have access to your account — reset your password immediately using 'Forgot password' on the sign-in screen.",
      };
    case "username_changed":
      return {
        subject: "Your Reactor Lang username was changed",
        text: `Your Reactor Lang username was just changed to "${meta?.newUsername || "a new username"}". If this wasn't you, your account may be compromised — sign in and change your password immediately.`,
      };
    default:
      return { subject: "Reactor Lang account change", text: "A change was made to your Reactor Lang account." };
  }
}

export async function POST(req) {
  const user = await getRequestingUser(req);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { type, toEmail, meta } = body;
  const targetEmail = toEmail || user.email;
  if (!targetEmail) {
    return Response.json({ error: "No destination email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Not configured yet — fail quietly rather than blocking the account change itself.
    console.warn("RESEND_API_KEY not set; skipping notification email.");
    return Response.json({ ok: true, skipped: true });
  }

  const { subject, text } = messageFor(type, meta);
  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress, to: targetEmail, subject, text }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Resend error", errText);
      return Response.json({ ok: false, error: errText }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("notify-change failed", e);
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

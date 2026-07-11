import { supabase } from "./supabaseClient";

// Fire-and-forget: a failure here should never block the actual account
// change from succeeding, so callers don't need to await/handle errors.
export async function notifyAccountChange(type, toEmail, meta) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    await fetch("/api/notify-change", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, toEmail, meta }),
    });
  } catch (e) {
    console.error("notifyAccountChange failed", e);
  }
}

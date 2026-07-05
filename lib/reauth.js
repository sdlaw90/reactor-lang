import { supabase } from "./supabaseClient";

// Confirms the person actually knows their current password before allowing a
// sensitive change (email/password). Also refreshes the session as a side effect,
// which is harmless here.
export async function verifyCurrentPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

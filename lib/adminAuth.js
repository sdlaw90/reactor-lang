import { createClient } from "@supabase/supabase-js";

// Server-side only. Verifies that the request carries a valid session token
// AND that the user is an admin. "Admin" means either:
//   (a) profiles.is_admin = true (migration 010), or
//   (b) their email matches ADMIN_EMAIL / NEXT_PUBLIC_ADMIN_EMAIL — the
//       env-var bootstrap that gated /admin before the column existed, kept
//       so nothing breaks on deploy and a fresh environment needs no seed.
//
// Every /api/admin/* route MUST call this first: they all use the service
// role key (full DB access, bypasses RLS) and must never be reachable by
// anyone else. The break-glass password tool (/api/admin-set-password) is
// deliberately NOT on this helper — it's secret-gated so it works when the
// admin is locked out of their own account.
//
// Returns { user, supabaseAdmin } on success, or null (caller returns 401).
// Throws only for server misconfiguration (missing service key) — callers
// surface that as a 500 with a real message.

// #76 Owner role: the env-bootstrap account (ADMIN_EMAIL /
// NEXT_PUBLIC_ADMIN_EMAIL) is the OWNER — a tier above admin. Server-side
// rules enforced in the admin routes:
//   * No admin may target the owner account with any action (ban, delete,
//     password set, role change...) — the owner is undemotable and untouchable.
//   * Role management (set_admin) is owner-only.
// The owner is identified by email match against the env var, so ownership
// can't be granted or revoked through the app at all — only by changing the
// environment variable.
export function ownerEmail() {
  return (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
}

export function isOwnerEmail(email) {
  const owner = ownerEmail();
  return Boolean(owner) && (email || "").toLowerCase() === owner;
}

export async function requireAdmin(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await anonClient.auth.getUser(token);
  if (error || !data?.user) return null;
  const user = data.user;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    const err = new Error("SUPABASE_SERVICE_ROLE_KEY is not set — the admin panel requires it.");
    err.isConfig = true;
    throw err;
  }
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const adminEmail = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
  const emailMatches = Boolean(adminEmail) && user.email?.toLowerCase() === adminEmail;

  let flagged = false;
  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();
    flagged = profile?.is_admin === true;
  } catch {
    // Column may not exist yet if the migration hasn't run — fall back to
    // the email check alone rather than locking the admin out.
  }

  if (!emailMatches && !flagged) return null;
  return { user, supabaseAdmin };
}

// Small wrapper for routes: returns a ready-made 401/500 Response, or null
// if the caller is a verified admin (in which case `out.ctx` is populated).
export async function adminGate(req) {
  try {
    const ctx = await requireAdmin(req);
    if (!ctx) return { response: Response.json({ error: "Unauthorized" }, { status: 401 }), ctx: null };
    return { response: null, ctx };
  } catch (e) {
    return {
      response: Response.json({ error: e?.message || "Admin auth failed" }, { status: 500 }),
      ctx: null,
    };
  }
}

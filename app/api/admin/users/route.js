import { adminGate } from "../../../../lib/adminAuth";

// GET: every account, joined with profile (username, avatar, is_admin) and
// a per-user progress rollup (total XP, best streak, tracks started, last
// played). listUsers at perPage 1000 is the same closed-beta-scale trade-off
// the approve route already makes — paginate when that stops being true.
export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { data: usersPage, error: listError } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) return Response.json({ error: listError.message }, { status: 500 });
  const authUsers = usersPage?.users || [];

  const [{ data: profiles }, { data: progressRows }] = await Promise.all([
    db.from("profiles").select("user_id, username, avatar_type, avatar_value, is_admin"),
    db.from("progress").select("user_id, track_id, xp, streak, last_played"),
  ]);

  const profileById = new Map((profiles || []).map((p) => [p.user_id, p]));
  const progressById = new Map();
  for (const row of progressRows || []) {
    const agg = progressById.get(row.user_id) || { totalXp: 0, bestStreak: 0, tracks: 0, lastPlayed: null };
    agg.totalXp += row.xp || 0;
    agg.bestStreak = Math.max(agg.bestStreak, row.streak || 0);
    agg.tracks += 1;
    if (row.last_played && (!agg.lastPlayed || row.last_played > agg.lastPlayed)) agg.lastPlayed = row.last_played;
    progressById.set(row.user_id, agg);
  }

  const users = authUsers
    .map((u) => {
      const profile = profileById.get(u.id) || {};
      const progress = progressById.get(u.id) || { totalXp: 0, bestStreak: 0, tracks: 0, lastPlayed: null };
      const banned = Boolean(u.banned_until && new Date(u.banned_until).getTime() > Date.now());
      return {
        id: u.id,
        email: u.email,
        username: profile.username || null,
        isAdmin: profile.is_admin === true,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at || null,
        banned,
        bannedUntil: banned ? u.banned_until : null,
        totalXp: progress.totalXp,
        bestStreak: progress.bestStreak,
        tracksStarted: progress.tracks,
        lastPlayed: progress.lastPlayed,
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return Response.json({ users, requesterId: ctx.user.id });
}

// POST: one action per call, always on a userId (never an email — emails
// can be re-registered after deletion; ids can't be confused).
//   set_password { newPassword }  — replaces the break-glass flow for the
//                                   normal signed-in-admin case
//   ban / unban                   — ban uses a ~100-year duration (Supabase
//                                   models bans as a timestamp, not a flag)
//   delete                        — permanent; FK cascades wipe profile,
//                                   progress, explanations, etc.
//   set_admin { value }           — grant/revoke the is_admin flag
// Self-protection: you can't ban, delete, or de-admin your own account.
export async function POST(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const { userId, action, newPassword, value } = await req.json().catch(() => ({}));
  if (!userId || !action) {
    return Response.json({ error: "Missing userId or action" }, { status: 400 });
  }

  const isSelf = userId === ctx.user.id;
  if (isSelf && (action === "ban" || action === "delete" || (action === "set_admin" && value !== true))) {
    return Response.json({ error: "You can't do that to your own account (self-lockout protection)." }, { status: 400 });
  }

  try {
    if (action === "set_password") {
      if (!newPassword || newPassword.length < 6) {
        return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      const { error } = await db.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ ok: true });
    }

    if (action === "ban" || action === "unban") {
      const { error } = await db.auth.admin.updateUserById(userId, {
        ban_duration: action === "ban" ? "876000h" : "none",
      });
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ ok: true });
    }

    if (action === "delete") {
      const { error } = await db.auth.admin.deleteUser(userId);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ ok: true });
    }

    if (action === "set_admin") {
      if (typeof value !== "boolean") {
        return Response.json({ error: "set_admin needs a boolean value" }, { status: 400 });
      }
      // Upsert so it works even for accounts that somehow have no profile
      // row yet (e.g. created before the profiles table existed).
      const { error } = await db
        .from("profiles")
        .upsert({ user_id: userId, is_admin: value, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ ok: true });
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    console.error("admin user action failed", e);
    return Response.json({ error: `Unexpected error: ${e?.message || String(e)}` }, { status: 500 });
  }
}

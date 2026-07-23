import { adminGate } from "../../../../../lib/adminAuth";

// GET /api/admin/progress/users
// The user-first entry point for Admin → Progress → Learners: one summary row
// per learner who has answered anything, joined with their username (profiles)
// and email (auth). Sorting/searching happens client-side on this list.
// adminGate first → service-role reads (RLS bypassed); failure-isolated.

export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const safe = async (fn) => {
    try {
      return await fn();
    } catch (e) {
      console.error("admin progress users sub-query failed", e);
      return null;
    }
  };

  const activity = await safe(async () => {
    const { data, error } = await db.from("admin_progress_user_activity").select("*");
    if (error) throw error;
    return data || [];
  });

  if (!activity) return Response.json({ error: "Could not load learner activity" }, { status: 500 });

  const ids = activity.map((a) => a.user_id);

  // Usernames (one query for the ids involved) + emails (auth listUsers, the
  // same closed-beta-scale trade-off the Users tab already makes).
  const [profiles, authUsers] = await Promise.all([
    safe(async () => {
      if (!ids.length) return [];
      const { data, error } = await db.from("profiles").select("user_id, username, is_admin").in("user_id", ids);
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      return data?.users || [];
    }),
  ]);

  const profById = new Map((profiles || []).map((p) => [p.user_id, p]));
  const authById = new Map((authUsers || []).map((u) => [u.id, u]));

  const learners = activity
    .map((a) => {
      const prof = profById.get(a.user_id) || {};
      const acc = authById.get(a.user_id) || {};
      return {
        userId: a.user_id,
        username: prof.username || null,
        email: acc.email || null,
        isAdmin: prof.is_admin === true,
        answers: Number(a.answers || 0),
        accuracyPct: a.accuracy_pct === null ? null : Number(a.accuracy_pct),
        tracksPlayed: Number(a.tracks_played || 0),
        lastActive: a.last_active || null,
      };
    })
    .sort((x, y) => y.answers - x.answers);

  return Response.json({ learners });
}

import { adminGate } from "../../../../../lib/adminAuth";
import { trackLabel, trackTotalItems, categoryTotalItems } from "../../../../../lib/trackItemCounts";

// GET /api/admin/progress/user?userId=<uuid>
// One learner's full progress: identity, per-track metrics (with coverage), and
// their per-(track, category) accuracy so weak spots are visible. Reads the
// analytics views via the service role; failure-isolated per sub-query.

export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return Response.json({ error: "Missing userId" }, { status: 400 });

  const safe = async (fn) => {
    try {
      return await fn();
    } catch (e) {
      console.error("admin progress user sub-query failed", e);
      return null;
    }
  };

  const [account, profile, trackRows, catRows] = await Promise.all([
    safe(async () => {
      const { data, error } = await db.auth.admin.getUserById(userId);
      if (error) throw error;
      return data?.user || null;
    }),
    safe(async () => {
      const { data, error } = await db.from("profiles").select("username, is_admin").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      return data || null;
    }),
    safe(async () => {
      const { data, error } = await db.from("admin_progress_user_track_stats").select("*").eq("user_id", userId);
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db.from("admin_progress_user_category_stats").select("*").eq("user_id", userId);
      if (error) throw error;
      return data || [];
    }),
  ]);

  // Per-category accuracy grouped by track, so the UI can nest it under each track.
  const catsByTrack = {};
  for (const r of catRows || []) {
    (catsByTrack[r.track_id] ||= []).push({
      cat: r.cat,
      answers: Number(r.answers || 0),
      accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
      totalItems: categoryTotalItems(r.track_id, r.cat),
    });
  }
  for (const k of Object.keys(catsByTrack)) {
    catsByTrack[k].sort((a, b) => (a.accuracyPct ?? 101) - (b.accuracyPct ?? 101));
  }

  const tracks = (trackRows || [])
    .map((r) => {
      const total = trackTotalItems(r.track_id);
      return {
        trackId: r.track_id,
        label: trackLabel(r.track_id),
        totalItems: total,
        xp: Number(r.xp || 0),
        level: Number(r.level || 1),
        streak: Number(r.streak || 0),
        bestCombo: Number(r.best_combo || 0),
        roundsCompleted: Number(r.rounds_completed || 0),
        skillLevel: r.skill_level || "none",
        answers: Number(r.answers || 0),
        accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
        levelCorrect: Number(r.level_correct_count || 0),
        levelTotal: Number(r.level_total_count || 0),
        itemsSeen: Number(r.items_seen || 0),
        itemsMissed: Number(r.items_missed || 0),
        coveragePct: total ? Math.min(100, Math.round((1000 * Number(r.items_seen || 0)) / total) / 10) : null,
        lastPlayed: r.last_played || null,
        lastActivity: r.last_activity || null,
        categories: catsByTrack[r.track_id] || [],
      };
    })
    .sort((a, b) => b.answers - a.answers);

  const totals = tracks.reduce(
    (acc, t) => {
      acc.xp += t.xp;
      acc.answers += t.answers;
      acc.bestStreak = Math.max(acc.bestStreak, t.streak);
      return acc;
    },
    { xp: 0, answers: 0, bestStreak: 0 }
  );

  return Response.json({
    userId,
    email: account?.email || null,
    username: profile?.username || null,
    isAdmin: profile?.is_admin === true,
    createdAt: account?.created_at || null,
    lastSignInAt: account?.last_sign_in_at || null,
    totals,
    tracks,
  });
}

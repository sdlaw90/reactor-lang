import { adminGate } from "../../../../../lib/adminAuth";
import { trackLabel, trackTotalItems } from "../../../../../lib/trackItemCounts";

// GET /api/admin/progress/overview
// Global progress insight: headline tiles, a "needs attention" list (weakest
// categories + lowest-accuracy items app-wide — the content-bug finder), a
// per-track table, and a 30-day activity trend. Reads the migration-015
// analytics views through the service role (RLS bypassed). Every sub-query is
// failure-isolated the same way /api/admin/overview is: one broken query comes
// back null instead of taking the whole page down.

// Minimum sample sizes before a category/item is trustworthy enough to flag.
const MIN_CATEGORY_ANSWERS = 10;
const MIN_ITEM_ANSWERS = 5;
const TREND_DAYS = 30;
const ACTIVE_WINDOWS = { d7: 7, d30: 30 };

export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const safe = async (fn) => {
    try {
      return await fn();
    } catch (e) {
      console.error("admin progress overview sub-query failed", e);
      return null;
    }
  };

  const trendCutoff = new Date(Date.now() - TREND_DAYS * 86400000).toISOString().slice(0, 10);

  const [trackRows, worstCategories, worstItems, userActivity, activityDaily] = await Promise.all([
    safe(async () => {
      const { data, error } = await db.from("admin_progress_track_stats").select("*");
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_category_stats")
        .select("*")
        .gte("answers", MIN_CATEGORY_ANSWERS)
        .order("accuracy_pct", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_item_stats")
        .select("*")
        .gte("answers", MIN_ITEM_ANSWERS)
        .order("accuracy_pct", { ascending: true })
        .order("answers", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db.from("admin_progress_user_activity").select("*");
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_activity_daily")
        .select("*")
        .gte("day", trendCutoff)
        .order("day", { ascending: true });
      if (error) throw error;
      return data || [];
    }),
  ]);

  // Headline tiles from the per-user activity view (one row per learner).
  let tiles = null;
  if (userActivity) {
    const now = Date.now();
    const totalAnswers = userActivity.reduce((s, u) => s + Number(u.answers || 0), 0);
    const totalCorrect = userActivity.reduce((s, u) => s + Number(u.correct || 0), 0);
    const activeIn = (days) =>
      userActivity.filter((u) => u.last_active && now - new Date(u.last_active).getTime() <= days * 86400000).length;
    tiles = {
      learners: userActivity.length,
      totalAnswers,
      overallAccuracy: totalAnswers ? Math.round((1000 * totalCorrect) / totalAnswers) / 10 : null,
      activeLast7Days: activeIn(ACTIVE_WINDOWS.d7),
      activeLast30Days: activeIn(ACTIVE_WINDOWS.d30),
    };
  }

  const tracks = (trackRows || [])
    .map((r) => ({
      trackId: r.track_id,
      label: trackLabel(r.track_id),
      totalItems: trackTotalItems(r.track_id),
      answers: Number(r.answers || 0),
      accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
      learners: Number(r.learners || 0),
      lastActivity: r.last_activity || null,
    }))
    .sort((a, b) => b.answers - a.answers);

  const needsAttention = {
    categories: (worstCategories || []).map((r) => ({
      trackId: r.track_id,
      label: trackLabel(r.track_id),
      cat: r.cat,
      answers: Number(r.answers || 0),
      accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
      learners: Number(r.learners || 0),
    })),
    items: (worstItems || []).map((r) => ({
      trackId: r.track_id,
      label: trackLabel(r.track_id),
      cat: r.cat,
      prompt: r.prompt,
      answers: Number(r.answers || 0),
      accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
      learners: Number(r.learners || 0),
    })),
  };

  const trend = (activityDaily || []).map((r) => ({
    day: r.day,
    answers: Number(r.answers || 0),
    correct: Number(r.correct || 0),
    activeUsers: Number(r.active_users || 0),
  }));

  return Response.json({
    tiles,
    tracks,
    needsAttention,
    trend,
    thresholds: { minCategoryAnswers: MIN_CATEGORY_ANSWERS, minItemAnswers: MIN_ITEM_ANSWERS, trendDays: TREND_DAYS },
  });
}

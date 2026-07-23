import { adminGate } from "../../../../../lib/adminAuth";
import { trackLabel, trackTotalItems, categoryTotalItems } from "../../../../../lib/trackItemCounts";

// GET /api/admin/progress/track?trackId=<id>
// One track's breakdown: per-category accuracy, its lowest-accuracy items, and
// the learners on it (username + their per-track metrics). Reads the analytics
// views via the service role; failure-isolated per sub-query.

const MIN_ITEM_ANSWERS = 5;

export async function GET(req) {
  const { response, ctx } = await adminGate(req);
  if (response) return response;
  const db = ctx.supabaseAdmin;

  const trackId = new URL(req.url).searchParams.get("trackId");
  if (!trackId) return Response.json({ error: "Missing trackId" }, { status: 400 });

  const safe = async (fn) => {
    try {
      return await fn();
    } catch (e) {
      console.error("admin progress track sub-query failed", e);
      return null;
    }
  };

  const [categories, worstItems, learnerRows] = await Promise.all([
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_category_stats")
        .select("*")
        .eq("track_id", trackId)
        .order("answers", { ascending: false });
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_item_stats")
        .select("*")
        .eq("track_id", trackId)
        .gte("answers", MIN_ITEM_ANSWERS)
        .order("accuracy_pct", { ascending: true })
        .order("answers", { ascending: false })
        .limit(40);
      if (error) throw error;
      return data || [];
    }),
    safe(async () => {
      const { data, error } = await db
        .from("admin_progress_user_track_stats")
        .select("*")
        .eq("track_id", trackId);
      if (error) throw error;
      return data || [];
    }),
  ]);

  // Attach usernames to learners (single profiles query for the ids involved).
  let learners = [];
  if (learnerRows) {
    const ids = learnerRows.map((r) => r.user_id);
    let usernameById = new Map();
    if (ids.length) {
      const { data: profs } = await db.from("profiles").select("user_id, username").in("user_id", ids);
      usernameById = new Map((profs || []).map((p) => [p.user_id, p.username]));
    }
    const total = trackTotalItems(trackId);
    learners = learnerRows
      .map((r) => ({
        userId: r.user_id,
        username: usernameById.get(r.user_id) || null,
        answers: Number(r.answers || 0),
        accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
        streak: Number(r.streak || 0),
        xp: Number(r.xp || 0),
        skillLevel: r.skill_level || "none",
        itemsSeen: Number(r.items_seen || 0),
        itemsMissed: Number(r.items_missed || 0),
        coveragePct: total ? Math.min(100, Math.round((1000 * Number(r.items_seen || 0)) / total) / 10) : null,
        lastActivity: r.last_activity || null,
        lastPlayed: r.last_played || null,
      }))
      .sort((a, b) => b.answers - a.answers);
  }

  const cats = (categories || []).map((r) => ({
    cat: r.cat,
    answers: Number(r.answers || 0),
    accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
    learners: Number(r.learners || 0),
    totalItems: categoryTotalItems(trackId, r.cat),
  }));

  const items = (worstItems || []).map((r) => ({
    cat: r.cat,
    prompt: r.prompt,
    answers: Number(r.answers || 0),
    accuracyPct: r.accuracy_pct === null ? null : Number(r.accuracy_pct),
    learners: Number(r.learners || 0),
  }));

  return Response.json({
    trackId,
    label: trackLabel(trackId),
    totalItems: trackTotalItems(trackId),
    categories: cats,
    worstItems: items,
    learners,
    thresholds: { minItemAnswers: MIN_ITEM_ANSWERS },
  });
}

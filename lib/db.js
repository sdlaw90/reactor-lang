import { supabase } from "./supabaseClient";

const RECENT_EXPLANATIONS_LIMIT = 150;

// ---------- profile / username ----------

export async function isUsernameTaken(username) {
  const { data, error } = await supabase.rpc("is_username_taken", { p_username: username });
  if (error) throw error;
  return !!data;
}

export async function emailForUsername(username) {
  const { data, error } = await supabase.rpc("email_for_username", { p_username: username });
  if (error) throw error;
  return data || null;
}

export async function loadProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function setUsername(userId, username) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, username, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function saveAvatar(userId, avatarType, avatarValue) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { user_id: userId, avatar_type: avatarType, avatar_value: avatarValue, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) throw error;
}

// ---------- progress ----------

export async function loadProgress(userId, trackId) {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .maybeSingle();
  if (error) throw error;
  return (
    data || {
      user_id: userId,
      track_id: trackId,
      xp: 0,
      level: 1,
      streak: 0,
      best_combo: 0,
      last_played: null,
      rounds_completed: 0,
      skill_level: "none",
      level_correct_count: 0,
      level_total_count: 0,
    }
  );
}

export async function loadAllProgress(userId) {
  const { data, error } = await supabase.from("progress").select("*").eq("user_id", userId);
  if (error) throw error;
  return data || [];
}

export async function saveProgress(userId, trackId, fields) {
  const { error } = await supabase
    .from("progress")
    .upsert(
      { user_id: userId, track_id: trackId, ...fields, updated_at: new Date().toISOString() },
      { onConflict: "user_id,track_id" }
    );
  if (error) throw error;
}

// ---------- missed questions ----------

export async function loadMissedIds(userId, trackId) {
  const { data, error } = await supabase
    .from("missed_questions")
    .select("question_id")
    .eq("user_id", userId)
    .eq("track_id", trackId);
  if (error) throw error;
  return (data || []).map((r) => r.question_id);
}

export async function addMissed(userId, trackId, questionId) {
  const { error } = await supabase
    .from("missed_questions")
    .upsert({ user_id: userId, track_id: trackId, question_id: questionId }, { onConflict: "user_id,track_id,question_id" });
  if (error) throw error;
}

export async function resolveMissed(userId, trackId, questionId) {
  const { error } = await supabase
    .from("missed_questions")
    .delete()
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("question_id", questionId);
  if (error) throw error;
}

// ---------- freshness ("don't repeat too soon") ----------

export async function loadSeenAt(userId, trackId) {
  const { data, error } = await supabase
    .from("seen_questions")
    .select("question_id, seen_at")
    .eq("user_id", userId)
    .eq("track_id", trackId);
  if (error) throw error;
  const map = {};
  (data || []).forEach((r) => {
    map[r.question_id] = new Date(r.seen_at).getTime();
  });
  return map;
}

export async function markSeen(userId, trackId, questionIds) {
  const now = new Date().toISOString();
  const rows = questionIds.map((question_id) => ({ user_id: userId, track_id: trackId, question_id, seen_at: now }));
  const { error } = await supabase.from("seen_questions").upsert(rows, { onConflict: "user_id,track_id,question_id" });
  if (error) throw error;
}

// ---------- explanations (recent + archive, via pagination over one table) ----------

export async function insertExplanations(userId, trackId, entries) {
  if (!entries || entries.length === 0) return;
  const rows = entries.map((e) => ({
    user_id: userId,
    track_id: trackId,
    cat: e.cat,
    prompt: e.prompt,
    options: e.options,
    correct_idx: e.correctIdx,
    selected_idx: e.selectedIdx,
    is_correct: e.isCorrect,
    sound: e.sound || null,
    explain_en: e.explain?.en || null,
    explain_es: e.explain?.es || null,
  }));
  const { error } = await supabase.from("explanations").insert(rows);
  if (error) throw error;
}

export async function fetchRecentExplanations(userId, trackId) {
  const { data, error } = await supabase
    .from("explanations")
    .select("*")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .order("created_at", { ascending: false })
    .range(0, RECENT_EXPLANATIONS_LIMIT - 1);
  if (error) throw error;
  return data || [];
}

export async function fetchArchivedExplanations(userId, trackId, offset = 0, pageSize = 50) {
  const { data, error } = await supabase
    .from("explanations")
    .select("*")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .order("created_at", { ascending: false })
    .range(RECENT_EXPLANATIONS_LIMIT + offset, RECENT_EXPLANATIONS_LIMIT + offset + pageSize - 1);
  if (error) throw error;
  return data || [];
}

export async function countArchivedExplanations(userId, trackId) {
  const { count, error } = await supabase
    .from("explanations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("track_id", trackId);
  if (error) throw error;
  const total = count || 0;
  return Math.max(0, total - RECENT_EXPLANATIONS_LIMIT);
}

export async function clearExplanations(userId, trackId) {
  const { error } = await supabase.from("explanations").delete().eq("user_id", userId).eq("track_id", trackId);
  if (error) throw error;
}

export async function submitFeedback(userId, type, message, pageContext, extra = {}) {
  const { error } = await supabase.from("feedback_submissions").insert({
    user_id: userId,
    type,
    message,
    page_context: pageContext || null,
    sessions_completed: extra.sessionsCompleted || null,
    continued_use_likelihood: extra.continuedUseLikelihood ?? null,
    recommend_likelihood: extra.recommendLikelihood ?? null,
    details: extra.details || null,
  });
  if (error) throw error;
}

export async function submitBetaApplication(name, email, reason, languagesInterested, extra = {}) {
  // Goes through a server route (not a direct insert) so the server can
  // clean/validate the email before it enters the database and notify the
  // admin that a new application arrived -- see app/api/beta-apply/route.js.
  const res = await fetch("/api/beta-apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      reason,
      languagesInterested,
      nativeLanguage: extra.nativeLanguage,
      currentLevel: extra.currentLevel,
      details: extra.details,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Application failed (HTTP ${res.status})`);
}

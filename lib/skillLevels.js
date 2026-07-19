// CEFR (Common European Framework of Reference) is the real-world standard
// used by actual language certifications (DELE for Spanish, Cambridge/IELTS
// for English) — A1/A2 = beginner, B1/B2 = intermediate, C1/C2 = advanced.
// We use it under the hood and show friendlier labels on the surface.

export const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const SKILL_LEVELS = [
  // #73: `description` is the one-line plain-language explainer shown under
  // each option in the level picker — what picking it actually means for the
  // questions you'll see. English-only for now, like the labels; both go
  // native-language in the #72 string sweep.
  { id: "none", label: "No experience", cefr: null, description: "Brand new — questions start from absolute basics." },
  { id: "beginner", label: "Beginner", cefr: ["A1", "A2"], description: "You know a little — rounds lean toward everyday words and simple sentences." },
  { id: "intermediate", label: "Intermediate", cefr: ["B1", "B2"], description: "You can hold a conversation — rounds lean toward richer grammar and phrasing." },
  { id: "expert", label: "Advanced", cefr: ["C1", "C2"], description: "You're comfortable — rounds lean toward nuance, idioms, and tricky details." },
  { id: "native", label: "Native / fluent", cefr: null, description: "No difficulty bias — everything in the track is fair game." },
];

export function skillLevelInfo(id) {
  return SKILL_LEVELS.find((s) => s.id === id) || SKILL_LEVELS[0];
}

// The CEFR bands that count toward the VISIBLE per-category mastery bar at a
// given skill level. Cumulative up to and including the player's own band:
// a Beginner's bar fills over A1-A2, an Intermediate's over A1-B2, an
// Advanced/Native's over the whole A1-C2 range. This keeps every level's bar
// attainable even when a category holds 150+ items, and makes the harder
// content surface as the next goal once you level up. Unknown level -> show
// everything (never hide earned progress).
const MASTERY_MAX_IDX = { none: 1, beginner: 1, intermediate: 3, expert: 5, native: 5 };
export function masteryBandsForSkillLevel(id) {
  const maxIdx = MASTERY_MAX_IDX[id] ?? CEFR_ORDER.length - 1;
  return CEFR_ORDER.slice(0, maxIdx + 1);
}

// The CEFR codes a round should be biased toward for a given skill level.
// null means "no bias" (either they haven't picked a level, or they're
// native/fluent and don't need difficulty-scaffolding).
export function cefrSetForSkillLevel(id) {
  return skillLevelInfo(id).cefr;
}

// The next tier up, or null if already at the top (or an ungraded tier).
export function nextSkillLevel(id) {
  const gradedIds = ["beginner", "intermediate", "expert"];
  const idx = gradedIds.indexOf(id);
  if (idx === -1 || idx === gradedIds.length - 1) return null;
  return gradedIds[idx + 1];
}

// Thresholds for suggesting "ready to advance?"
export const ADVANCE_MIN_ANSWERED = 30;
export const ADVANCE_MIN_ACCURACY = 0.85;

export function readyToAdvance(correctCount, totalCount) {
  if (totalCount < ADVANCE_MIN_ANSWERED) return false;
  return correctCount / totalCount >= ADVANCE_MIN_ACCURACY;
}

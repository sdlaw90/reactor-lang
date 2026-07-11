// CEFR (Common European Framework of Reference) is the real-world standard
// used by actual language certifications (DELE for Spanish, Cambridge/IELTS
// for English) — A1/A2 = beginner, B1/B2 = intermediate, C1/C2 = advanced.
// We use it under the hood and show friendlier labels on the surface.

export const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const SKILL_LEVELS = [
  { id: "none", label: "No experience", cefr: null },
  { id: "beginner", label: "Beginner", cefr: ["A1", "A2"] },
  { id: "intermediate", label: "Intermediate", cefr: ["B1", "B2"] },
  { id: "expert", label: "Advanced", cefr: ["C1", "C2"] },
  { id: "native", label: "Native / fluent", cefr: null }, // no bias — everything's fair game
];

export function skillLevelInfo(id) {
  return SKILL_LEVELS.find((s) => s.id === id) || SKILL_LEVELS[0];
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

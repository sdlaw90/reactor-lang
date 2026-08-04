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

// #72: native-language skill-level labels. `skillLevelInfo().label` stays English
// (unchanged for any consumer not yet converted); pass a `lang` here to render
// the label in the person's own language. es/en now; the other source-language
// families ride the #72 sweep.
const LEVEL_LABELS = {
  none: { en: "No experience", es: "Sin experiencia", pt: "Sem experiência", fr: "Aucune expérience", it: "Nessuna esperienza" },
  beginner: { en: "Beginner", es: "Principiante", pt: "Iniciante", fr: "Débutant", it: "Principiante" },
  intermediate: { en: "Intermediate", es: "Intermedio", pt: "Intermediário", fr: "Intermédiaire", it: "Intermedio" },
  expert: { en: "Advanced", es: "Avanzado", pt: "Avançado", fr: "Avancé", it: "Avanzato" },
  native: { en: "Native / fluent", es: "Nativo / fluido", pt: "Nativo / fluente", fr: "Natif / courant", it: "Madrelingua / fluente" },
};
export function skillLevelLabel(id, lang) {
  const entry = LEVEL_LABELS[id] || LEVEL_LABELS.none;
  return entry[lang] || entry.en;
}
const LEVEL_DESCRIPTIONS = {
  none: { en: "Brand new — questions start from absolute basics.", es: "Empiezas de cero — las preguntas parten de lo más básico.", pt: "Totalmente novo — as perguntas começam do zero absoluto.", fr: "Tu pars de zéro — les questions commencent par les bases absolues.", it: "Parti da zero — le domande iniziano dalle basi assolute." },
  beginner: { en: "You know a little — rounds lean toward everyday words and simple sentences.", es: "Sabes un poco — las rondas se inclinan hacia palabras cotidianas y frases sencillas.", pt: "Você sabe um pouco — as rodadas priorizam palavras do dia a dia e frases simples.", fr: "Tu en sais un peu — les manches privilégient les mots du quotidien et les phrases simples.", it: "Sai già qualcosa — i turni privilegiano parole di tutti i giorni e frasi semplici." },
  intermediate: { en: "You can hold a conversation — rounds lean toward richer grammar and phrasing.", es: "Puedes mantener una conversación — las rondas se inclinan hacia gramática y expresiones más ricas.", pt: "Você consegue conversar — as rodadas priorizam gramática e expressões mais ricas.", fr: "Tu peux tenir une conversation — les manches privilégient une grammaire et des tournures plus riches.", it: "Riesci a sostenere una conversazione — i turni privilegiano grammatica ed espressioni più ricche." },
  expert: { en: "You're comfortable — rounds lean toward nuance, idioms, and tricky details.", es: "Te sientes cómodo — las rondas se inclinan hacia matices, modismos y detalles difíciles.", pt: "Você se sente à vontade — as rodadas priorizam nuances, expressões idiomáticas e detalhes mais complicados.", fr: "Tu es à l'aise — les manches privilégient les nuances, les expressions idiomatiques et les détails délicats.", it: "Te la cavi bene — i turni privilegiano sfumature, modi di dire e dettagli complicati." },
  native: { en: "No difficulty bias — everything in the track is fair game.", es: "Sin sesgo de dificultad — todo el contenido del idioma entra en juego.", pt: "Sem viés de dificuldade — todo o conteúdo do idioma pode aparecer.", fr: "Aucun biais de difficulté — tout le contenu de la langue peut apparaître.", it: "Nessuna preferenza di difficoltà — può uscire qualsiasi contenuto della lingua." },
};
export function skillLevelDescription(id, lang) {
  const entry = LEVEL_DESCRIPTIONS[id] || LEVEL_DESCRIPTIONS.none;
  return entry[lang] || entry.en;
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

// Curated security questions (#79). Questions come from THIS list only —
// never free-text — so answers stay short, memorable, and consistent.
// Answers ARE free-text, normalized via normalizeAnswer before hashing and
// before comparison, so "  Fluffy " and "fluffy" match.
//
// This is long-term surface (decision 2026-07-12: security-question reset is
// permanent, staying as the fallback after #65 makes email reset primary) —
// extend by APPENDING new keys. Never remove or re-key an existing entry:
// stored rows reference these keys, and a missing key would strand an
// account's recovery path.
//
// Question-writing bar for additions: answers should be (a) stable over a
// lifetime, (b) not publicly discoverable from social media, (c) one or two
// words. Avoid favorites (they change) and anything on a typical profile.

// `label` is the canonical English question text and is consumed server-side
// (it's what /api/password-reset returns to the client), so it must NOT change
// shape. `label_es` is an ADDITIVE es-LatAm (informal "tú") translation used
// only for client-side rendering via questionLabel(key, "es").
export const SECURITY_QUESTIONS = [
  { key: "first_pet", label: "What was the name of your first pet?", label_es: "¿Cómo se llamaba tu primera mascota?" },
  { key: "childhood_street", label: "What street did you live on as a child?", label_es: "¿En qué calle viviste de niño?" },
  { key: "mother_maiden", label: "What is your mother's maiden name?", label_es: "¿Cuál es el apellido de soltera de tu madre?" },
  { key: "first_school", label: "What was the name of your first school?", label_es: "¿Cómo se llamaba tu primera escuela?" },
  { key: "childhood_nickname", label: "What was your childhood nickname?", label_es: "¿Cuál era tu apodo de la infancia?" },
  { key: "first_car", label: "What was the make of your first car?", label_es: "¿De qué marca fue tu primer auto?" },
  { key: "birth_city", label: "In what city were you born?", label_es: "¿En qué ciudad naciste?" },
  { key: "best_friend", label: "What is the first name of your oldest friend?", label_es: "¿Cuál es el nombre de tu amistad más antigua?" },
  { key: "first_job", label: "What was your first job?", label_es: "¿Cuál fue tu primer trabajo?" },
  { key: "grandmother_name", label: "What was your maternal grandmother's first name?", label_es: "¿Cómo se llamaba tu abuela materna?" },
];

export const REQUIRED_QUESTION_COUNT = 3;
export const REQUIRED_CORRECT_ANSWERS = 2;

const byKey = new Map(SECURITY_QUESTIONS.map((q) => [q.key, q]));

// Backward compatible: questionLabel(key) still returns the English `label`.
// Pass lang === "es" to get `label_es` when present (client-side rendering only
// — the API contract keeps using the English `label`).
export function questionLabel(key, lang) {
  const q = byKey.get(key);
  if (!q) return key;
  if (lang === "es" && q.label_es) return q.label_es;
  return q.label || key;
}

export function isValidQuestionKey(key) {
  return byKey.has(key);
}

// Normalization is part of the credential: applied before hashing at save
// time and before comparison at verify time. Trim, lowercase, collapse
// internal whitespace. Deliberately does NOT strip accents/punctuation —
// "O'Brien" and "obrien" are different answers; the save UI tells the user
// answers are case-insensitive but otherwise exact.
export function normalizeAnswer(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

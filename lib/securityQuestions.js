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

export const SECURITY_QUESTIONS = [
  { key: "first_pet", label: "What was the name of your first pet?" },
  { key: "childhood_street", label: "What street did you live on as a child?" },
  { key: "mother_maiden", label: "What is your mother's maiden name?" },
  { key: "first_school", label: "What was the name of your first school?" },
  { key: "childhood_nickname", label: "What was your childhood nickname?" },
  { key: "first_car", label: "What was the make of your first car?" },
  { key: "birth_city", label: "In what city were you born?" },
  { key: "best_friend", label: "What is the first name of your oldest friend?" },
  { key: "first_job", label: "What was your first job?" },
  { key: "grandmother_name", label: "What was your maternal grandmother's first name?" },
];

export const REQUIRED_QUESTION_COUNT = 3;
export const REQUIRED_CORRECT_ANSWERS = 2;

const byKey = new Map(SECURITY_QUESTIONS.map((q) => [q.key, q]));

export function questionLabel(key) {
  return byKey.get(key)?.label || key;
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

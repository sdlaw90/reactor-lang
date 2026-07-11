// Shared email cleanup used everywhere an email string crosses a trust
// boundary (form submission, admin approval). Plain trim() is not enough:
// mobile paste/autocomplete can smuggle in invisible characters (zero-width
// spaces, non-breaking spaces) that make an email LOOK identical to a valid
// one while Supabase Auth rejects it as invalid format.

export function cleanEmail(raw) {
  if (typeof raw !== "string") return "";
  return raw
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .trim()
    .toLowerCase();
}

// Deliberately simple: same effective bar Supabase Auth applies. The goal is
// catching genuinely broken strings with an actionable message, not
// re-implementing the RFC.
export function looksLikeEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

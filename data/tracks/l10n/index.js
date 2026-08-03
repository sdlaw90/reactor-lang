// v3.1 — per-source LOCALIZED-SURFACE side tables ("one track, many sources").
//
// Each side file `<trackCamel>.<source>.js` default-exports a map keyed by item
// id ("cat-i", e.g. "vocab-3") →
//   { prompt?, promptNative?, options?, explain?, wrongNote?, distractorNotes? }
// carrying the SOURCE-language surface: answer options, trad prompts, subtitles,
// the post-answer explanation and wrong-answer notes, and distractorNotes keyed
// by the localized option text. `options` stays aligned to the base item's
// option indices so correctIdx is unchanged; any omitted field falls back to the
// base (English) content.
//
// The engine merges these in round/lesson/placement building
// (lib/gameEngine.js `flattenBank`, via `getL10n`). Kept OUT of the giant track
// banks so the bulk machine-generated localization stays in clean,
// independently-verifiable files.
//
// es (Spanish) surfaces for the 10 reused tracks were AI-generated 2026-07-23
// (v3.1 workflow). pt (Brazilian Portuguese) surfaces added 2026-07-26 (v3.2):
// the 8 shared reused tracks were translated es→pt in place (vocab/gram/trad/
// fvocab), and the two Spanish-target tables (es-latam / es-spain) are net-new
// for pt natives (es never needed them). All flagged for #41 native review.
// A missing entry → base English surface (safe).
//
// fr (French) surfaces added 2026-07-29 (v3.3): all 10 tables were translated in
// place from their `.es` sibling (or `.pt` where no `.es` exists — the two
// Spanish-target tables), which carries the Word Bank (fvocab-*) for free. French
// natives are never offered the French-target tracks, so fr-for-en / fr-ca-for-en
// deliberately have no `fr` sibling.
//
// ── v3.4 (#60): LOADED PER SOURCE, ON DEMAND ────────────────────────────────
// Until v3.4 every table was a static `import`, so all 32 of them landed in ONE
// client chunk — 4.8 MB raw / 877 KB gzipped, attached to /play, /learn and
// /placement. Opening a lesson downloaded every source language's tables for
// every track, however few of them the learner could ever read.
//
// That was already wasteful, and the #60 explanation backfill would have made it
// untenable: the payload measures 2.78 MB raw / 449 KB gzipped PER SOURCE
// (13,554 explanations + 6,270 wrong-notes + 15,453 distractor notes), so pt+fr
// alone would have added ~900 KB gz to that chunk, and ~2.7 MB more once v4.0
// completes the matrix.
//
// So the registry now holds `() => import(...)` thunks: the bundler emits one
// chunk per table, and the browser fetches only the table for the track being
// opened, in the learner's own source language — ~31-35 KB gz today. An English
// native downloads none of them.
//
// (The separate ~14 MB raw / 2.5 MB gz chunk on `/`, `/dashboard`, `/onboarding`
// and the learning routes is the base track BANKS, statically imported from
// data/tracks/index.js. Same problem, different file, not addressed here.)
//
//   loadL10n(trackId, sourceLang) → Promise<map|null>   — fetch + memoize
//   getL10n(trackId, sourceLang)  → map|null            — synchronous cache read
//
// `getL10n` keeps its old signature and returns null until the chunk has landed.
// null is the same value it already returned for "no side table for this pair",
// and the engine's response to null is the base English surface — so a render
// that beats the fetch degrades exactly the way an unlocalized track does: never
// blank, never broken. Callers that must not race it await `loadL10n` first;
// all three (play, learn, placement) do, in the effect that loads the session.

const L10N = {
  "fr-for-en": {
    es: () => import("./frForEn.es"),
    pt: () => import("./frForEn.pt"),
  },
  "fr-ca-for-en": {
    es: () => import("./frCaForEn.es"),
    pt: () => import("./frCaForEn.pt"),
  },
  "it-for-en": {
    es: () => import("./itForEn.es"),
    pt: () => import("./itForEn.pt"),
    fr: () => import("./itForEn.fr"),
  },
  "pt-br-for-en": {
    es: () => import("./ptBrForEn.es"),
    fr: () => import("./ptBrForEn.fr"),
  },
  "pt-pt-for-en": {
    es: () => import("./ptPtForEn.es"),
    fr: () => import("./ptPtForEn.fr"),
  },
  "de-for-en": {
    es: () => import("./deForEn.es"),
    pt: () => import("./deForEn.pt"),
    fr: () => import("./deForEn.fr"),
  },
  "ru-for-en": {
    es: () => import("./ruForEn.es"),
    pt: () => import("./ruForEn.pt"),
    fr: () => import("./ruForEn.fr"),
  },
  "ja-for-en": {
    es: () => import("./jaForEn.es"),
    pt: () => import("./jaForEn.pt"),
    fr: () => import("./jaForEn.fr"),
  },
  "ko-for-en": {
    es: () => import("./koForEn.es"),
    pt: () => import("./koForEn.pt"),
    fr: () => import("./koForEn.fr"),
  },
  "zh-for-en": {
    es: () => import("./zhForEn.es"),
    pt: () => import("./zhForEn.pt"),
    fr: () => import("./zhForEn.fr"),
  },
  // Spanish-target tables. es natives never learn Spanish, so these have no `es`
  // sibling — pt and fr natives are the only consumers.
  "es-latam-for-en": {
    pt: () => import("./esForEn.pt"),
    fr: () => import("./esForEn.fr"),
  },
  "es-spain-for-en": {
    pt: () => import("./esSpainForEn.pt"),
    fr: () => import("./esSpainForEn.fr"),
  },
};

// Resolved tables, keyed "trackId|sourceLang". A resolved entry may be null
// (no table registered for the pair) — that is cached too, so a repeat lookup
// never re-enters the loader.
const cache = new Map();
// In-flight promises, so two components mounting at once share one fetch.
const inflight = new Map();

const keyOf = (trackId, sourceLang) => `${trackId}|${sourceLang}`;

export function hasL10n(trackId, sourceLang) {
  return !!(L10N[trackId] && L10N[trackId][sourceLang]);
}

// Fetch (once) the localized-surface map for a track + source language.
// Resolves to null when no table is registered, or when the chunk fails to load
// — a failed fetch must never take the lesson down with it, and the base English
// surface is a working lesson.
export function loadL10n(trackId, sourceLang) {
  if (!trackId || !sourceLang) return Promise.resolve(null);
  const key = keyOf(trackId, sourceLang);
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (inflight.has(key)) return inflight.get(key);

  const thunk = L10N[trackId] && L10N[trackId][sourceLang];
  if (!thunk) {
    cache.set(key, null);
    return Promise.resolve(null);
  }
  const p = thunk()
    .then((m) => {
      const map = (m && m.default) || null;
      cache.set(key, map);
      inflight.delete(key);
      return map;
    })
    .catch(() => {
      // Do NOT cache the failure: a later attempt (better connection, or simply
      // the next lesson) should still be allowed to succeed.
      inflight.delete(key);
      return null;
    });
  inflight.set(key, p);
  return p;
}

// Synchronous read of the already-loaded table, or null. Same contract as
// pre-v3.4 for every caller that has awaited `loadL10n` for the same pair.
export function getL10n(trackId, sourceLang) {
  if (!trackId || !sourceLang) return null;
  return cache.get(keyOf(trackId, sourceLang)) || null;
}

// Test/audit seam: drop the memo so a harness can measure a cold load.
export function __resetL10nCache() {
  cache.clear();
  inflight.clear();
}

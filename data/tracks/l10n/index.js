// v3.1 — per-source LOCALIZED-SURFACE side tables ("one track, many sources").
//
// Each side file `<trackCamel>.<source>.js` default-exports a map keyed by item
// id ("cat-i", e.g. "vocab-3") →
//   { prompt?, promptNative?, options?, wrongNote?, distractorNotes? }
// carrying the SOURCE-language interactive surface (Spanish answer options for
// vocab/fvocab, Spanish source-phrases for trad prompts, Spanish subtitles, and
// distractorNotes keyed by the localized option text). `options` stays aligned
// to the base item's option indices so correctIdx is unchanged; any omitted
// field falls back to the base (English) content.
//
// The engine merges these in round-building (lib/gameEngine.js `flattenBank`,
// via `getL10n`). Kept OUT of the giant track banks so the bulk machine-generated
// localization writes clean, independently-verifiable files instead of editing
// 1–2 MB banks in place.
//
// Empty until the v3.1 Spanish-source pass generates side files; each generated
// file is imported + registered below. A missing entry → base English surface
// (no localization), so this is safe to ship empty.

// (generated imports land here, e.g.:)
// import frForEn_es from "./frForEn.es";

const L10N = {
  // "fr-for-en": { es: frForEn_es },
};

// Localized-surface map for a track + source language, or null. Synchronous +
// statically registered (like the track banks) so round-building stays instant.
export function getL10n(trackId, sourceLang) {
  const entry = L10N[trackId];
  return (entry && entry[sourceLang]) || null;
}

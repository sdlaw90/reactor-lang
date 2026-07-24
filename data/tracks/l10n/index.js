// v3.1 — per-source LOCALIZED-SURFACE side tables ("one track, many sources").
//
// Each side file `<trackCamel>.<source>.js` default-exports a map keyed by item
// id ("cat-i", e.g. "vocab-3") →
//   { prompt?, promptNative?, options?, wrongNote?, distractorNotes? }
// carrying the SOURCE-language interactive surface (Spanish answer options for
// vocab, Spanish source-phrases for trad prompts, Spanish subtitles, and
// distractorNotes keyed by the localized option text). `options` stays aligned
// to the base item's option indices so correctIdx is unchanged; any omitted
// field falls back to the base (English) content.
//
// The engine merges these in round/lesson/placement building
// (lib/gameEngine.js `flattenBank`, via `getL10n`). Kept OUT of the giant track
// banks so the bulk machine-generated localization stays in clean,
// independently-verifiable files.
//
// es (Spanish) surfaces for the 10 reused tracks were AI-generated 2026-07-23
// (v3.1 workflow) — vocab/verbo(gram)/trad only; fono (extraBank) and fvocab
// (generated Word Bank) are localized separately. All flagged for #41 native
// review. A missing entry → base English surface (safe).

import frForEn_es from "./frForEn.es";
import frCaForEn_es from "./frCaForEn.es";
import itForEn_es from "./itForEn.es";
import ptBrForEn_es from "./ptBrForEn.es";
import ptPtForEn_es from "./ptPtForEn.es";
import deForEn_es from "./deForEn.es";
import ruForEn_es from "./ruForEn.es";
import jaForEn_es from "./jaForEn.es";
import koForEn_es from "./koForEn.es";
import zhForEn_es from "./zhForEn.es";

const L10N = {
  "fr-for-en": { es: frForEn_es },
  "fr-ca-for-en": { es: frCaForEn_es },
  "it-for-en": { es: itForEn_es },
  "pt-br-for-en": { es: ptBrForEn_es },
  "pt-pt-for-en": { es: ptPtForEn_es },
  "de-for-en": { es: deForEn_es },
  "ru-for-en": { es: ruForEn_es },
  "ja-for-en": { es: jaForEn_es },
  "ko-for-en": { es: koForEn_es },
  "zh-for-en": { es: zhForEn_es },
};

// Localized-surface map for a track + source language, or null. Synchronous +
// statically registered (like the track banks) so round-building stays instant.
export function getL10n(trackId, sourceLang) {
  const entry = L10N[trackId];
  return (entry && entry[sourceLang]) || null;
}

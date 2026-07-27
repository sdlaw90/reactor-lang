// v3.1 — per-source LOCALIZED-SURFACE side tables ("one track, many sources").
//
// Each side file `<trackCamel>.<source>.js` default-exports a map keyed by item
// id ("cat-i", e.g. "vocab-3") →
//   { prompt?, promptNative?, options?, wrongNote?, distractorNotes? }
// carrying the SOURCE-language interactive surface (Spanish/Portuguese answer
// options for vocab, source-phrases for trad prompts, subtitles, and
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
// (v3.1 workflow). pt (Brazilian Portuguese) surfaces added 2026-07-26 (v3.2):
// the 8 shared reused tracks were translated es→pt in place (vocab/gram/trad/
// fvocab), and the two Spanish-target tables (es-latam / es-spain) are net-new
// for pt natives (es never needed them). All flagged for #41 native review.
// A missing entry → base English surface (safe).

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

// v3.2 pt side tables. es-latam/es-spain are Spanish-target tables that only pt
// natives use (es natives don't learn Spanish), so they have no `es` sibling.
import frForEn_pt from "./frForEn.pt";
import frCaForEn_pt from "./frCaForEn.pt";
import itForEn_pt from "./itForEn.pt";
import deForEn_pt from "./deForEn.pt";
import ruForEn_pt from "./ruForEn.pt";
import jaForEn_pt from "./jaForEn.pt";
import koForEn_pt from "./koForEn.pt";
import zhForEn_pt from "./zhForEn.pt";
import esForEn_pt from "./esForEn.pt";
import esSpainForEn_pt from "./esSpainForEn.pt";

const L10N = {
  "fr-for-en": { es: frForEn_es, pt: frForEn_pt },
  "fr-ca-for-en": { es: frCaForEn_es, pt: frCaForEn_pt },
  "it-for-en": { es: itForEn_es, pt: itForEn_pt },
  "pt-br-for-en": { es: ptBrForEn_es },
  "pt-pt-for-en": { es: ptPtForEn_es },
  "de-for-en": { es: deForEn_es, pt: deForEn_pt },
  "ru-for-en": { es: ruForEn_es, pt: ruForEn_pt },
  "ja-for-en": { es: jaForEn_es, pt: jaForEn_pt },
  "ko-for-en": { es: koForEn_es, pt: koForEn_pt },
  "zh-for-en": { es: zhForEn_es, pt: zhForEn_pt },
  "es-latam-for-en": { pt: esForEn_pt },
  "es-spain-for-en": { pt: esSpainForEn_pt },
};

// Localized-surface map for a track + source language, or null. Synchronous +
// statically registered (like the track banks) so round-building stays instant.
export function getL10n(trackId, sourceLang) {
  const entry = L10N[trackId];
  return (entry && entry[sourceLang]) || null;
}

// #90: grammar-gym module registry. Keyed by track.id. Only tracks with a
// standalone conjugation module appear here (Spanish/Romance first); every
// other track returns null and the page/toggle simply doesn't surface a
// grammar option.

import esForEnGrammar from "./esForEn";
import esSpainForEnGrammar from "./esSpainForEn";
import frForEnGrammar from "./frForEn";
import frCaForEnGrammar from "./frCaForEn";
import itForEnGrammar from "./itForEn";
import ptBrForEnGrammar from "./ptBrForEn";
import ptPtForEnGrammar from "./ptPtForEn";
import jaForEnGrammar from "./jaForEn";
import koForEnGrammar from "./koForEn";

const MODULES = {
  "es-latam-for-en": esForEnGrammar,
  "es-spain-for-en": esSpainForEnGrammar,
  "fr-for-en": frForEnGrammar,
  "fr-ca-for-en": frCaForEnGrammar,
  "it-for-en": itForEnGrammar,
  "pt-br-for-en": ptBrForEnGrammar,
  "pt-pt-for-en": ptPtForEnGrammar,
  // #3 (2026-07-20): CJK gyms. ja/ko use the person axis repurposed as a
  // politeness/speech-level axis (see each module's SCHEMA NOTE). Mandarin has
  // no conjugation, so zh-for-en is intentionally absent → no gym toggle.
  "ja-for-en": jaForEnGrammar,
  "ko-for-en": koForEnGrammar,
};

export function grammarForTrack(trackId) {
  return MODULES[trackId] || null;
}

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

const MODULES = {
  "es-latam-for-en": esForEnGrammar,
  "es-spain-for-en": esSpainForEnGrammar,
  "fr-for-en": frForEnGrammar,
  "fr-ca-for-en": frCaForEnGrammar,
  "it-for-en": itForEnGrammar,
  "pt-br-for-en": ptBrForEnGrammar,
  "pt-pt-for-en": ptPtForEnGrammar,
};

export function grammarForTrack(trackId) {
  return MODULES[trackId] || null;
}

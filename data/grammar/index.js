// #90: grammar-gym module registry. Keyed by track.id. Only tracks with a
// standalone conjugation module appear here (Spanish/Romance first); every
// other track returns null and the page/toggle simply doesn't surface a
// grammar option.

import esForEnGrammar from "./esForEn";

const MODULES = {
  "es-latam-for-en": esForEnGrammar,
};

export function grammarForTrack(trackId) {
  return MODULES[trackId] || null;
}

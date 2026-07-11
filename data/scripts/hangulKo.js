// Hangul — the Korean writing-system definition for #62 script practice.
// Same data contract as kanaJa.js (the pilot); consumed by the generic
// /script/[trackId] page with zero page changes.
//
// Romanization: Revised Romanization of Korean (the official standard).
// Consonants whose sound shifts by position show both (e.g. "g (k)").
//
// The "Syllable blocks (sampler)" group gives a first taste of hangul's
// defining trick — jamo stack into square syllable blocks — as pure data.
// The full block-COMPOSITION teaching mechanic (build 한 from ㅎ+ㅏ+ㄴ) is a
// deliberate follow-up layer, tracked as #83, not squeezed in here.

const HANGUL_GROUPS = [
  {
    id: "hg-cons",
    title: "Basic consonants",
    glyphs: [
      ["ㄱ", "g (k)"], ["ㄴ", "n"], ["ㄷ", "d (t)"], ["ㄹ", "r (l)"], ["ㅁ", "m"],
      ["ㅂ", "b (p)"], ["ㅅ", "s"], ["ㅇ", "ng (silent at start)"], ["ㅈ", "j"],
      ["ㅊ", "ch"], ["ㅋ", "k"], ["ㅌ", "t"], ["ㅍ", "p"], ["ㅎ", "h"],
    ],
  },
  {
    id: "hg-vowels",
    title: "Basic vowels",
    glyphs: [
      ["ㅏ", "a"], ["ㅑ", "ya"], ["ㅓ", "eo"], ["ㅕ", "yeo"], ["ㅗ", "o"],
      ["ㅛ", "yo"], ["ㅜ", "u"], ["ㅠ", "yu"], ["ㅡ", "eu"], ["ㅣ", "i"],
    ],
  },
  {
    id: "hg-tense",
    title: "Tense consonants",
    glyphs: [["ㄲ", "kk"], ["ㄸ", "tt"], ["ㅃ", "pp"], ["ㅆ", "ss"], ["ㅉ", "jj"]],
  },
  {
    id: "hg-compound",
    title: "Compound vowels",
    glyphs: [
      ["ㅐ", "ae"], ["ㅒ", "yae"], ["ㅔ", "e"], ["ㅖ", "ye"], ["ㅘ", "wa"],
      ["ㅙ", "wae"], ["ㅚ", "oe"], ["ㅝ", "wo"], ["ㅞ", "we"], ["ㅟ", "wi"], ["ㅢ", "ui"],
    ],
  },
  {
    id: "hg-blocks",
    title: "Syllable blocks (sampler)",
    glyphs: [
      ["가", "ga"], ["나", "na"], ["다", "da"], ["마", "ma"], ["바", "ba"],
      ["사", "sa"], ["아", "a"], ["자", "ja"], ["하", "ha"],
      ["한", "han"], ["국", "guk"], ["밥", "bap"], ["물", "mul"], ["집", "jip"],
    ],
  },
];

export const HANGUL_KO = {
  id: "hangul-ko",
  forTracks: ["ko-for-en"],
  name: "Hangul",
  intro: {
    en: "Hangul is famously learnable — it was designed in the 1400s to be easy. Each symbol (jamo) is one sound, and jamo stack together into square syllable blocks: ㅎ + ㅏ + ㄴ = 한 (han). Learn the jamo here, get a taste of reading blocks in the sampler, and you can sound out any Korean word.",
    es: "El hangul es famosamente fácil de aprender — fue diseñado en el siglo XV para serlo. Cada símbolo (jamo) es un sonido, y los jamo se apilan en bloques silábicos cuadrados: ㅎ + ㅏ + ㄴ = 한 (han). Aprende los jamo aquí, prueba a leer bloques en el muestrario, y podrás pronunciar cualquier palabra coreana.",
  },
  systems: [
    {
      id: "hangul",
      name: "Hangul 한글",
      blurb: {
        en: "All 40 jamo — consonants, vowels, tense consonants, and compound vowels — plus a sampler of real syllable blocks to read.",
        es: "Los 40 jamo — consonantes, vocales, consonantes tensas y vocales compuestas — más un muestrario de bloques silábicos reales para leer.",
      },
      groups: HANGUL_GROUPS,
    },
  ],
};

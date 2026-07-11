// Mandarin foundational characters — the #62 definition for zh-for-en.
// Same data contract as kanaJa.js; generic page, zero page changes.
//
// Mandarin has no phonetic alphabet to teach, so this is deliberately a
// CURATED FOUNDATIONAL SAMPLER (decision: v1 scope is "a curated
// foundational set", not comprehensive hanzi coverage — expanded tiers are
// part of the #83 depth-layers item). The "romanization" slot carries
// pinyin + a one-word gloss ("yī — one"), because for hanzi the meaning is
// half the point and it makes practice options self-explanatory.
//
// Selection: numbers (immediately useful, famously regular), people words,
// nature/place characters (many double as common radicals), and everyday
// high-frequency characters a beginner meets in week one.

const MANDARIN_GROUPS = [
  {
    id: "zh-numbers",
    title: "Numbers",
    glyphs: [
      ["一", "yī — one"], ["二", "èr — two"], ["三", "sān — three"], ["四", "sì — four"], ["五", "wǔ — five"],
      ["六", "liù — six"], ["七", "qī — seven"], ["八", "bā — eight"], ["九", "jiǔ — nine"], ["十", "shí — ten"],
    ],
  },
  {
    id: "zh-people",
    title: "People & pronouns",
    glyphs: [
      ["人", "rén — person"], ["我", "wǒ — I / me"], ["你", "nǐ — you"], ["他", "tā — he"], ["她", "tā — she"],
      ["们", "men — (plural)"], ["女", "nǚ — woman"], ["男", "nán — man"], ["子", "zǐ — child"], ["好", "hǎo — good"],
    ],
  },
  {
    id: "zh-nature",
    title: "Nature & places",
    glyphs: [
      ["水", "shuǐ — water"], ["火", "huǒ — fire"], ["山", "shān — mountain"], ["日", "rì — sun / day"],
      ["月", "yuè — moon / month"], ["天", "tiān — sky / day"], ["土", "tǔ — earth"], ["木", "mù — tree / wood"],
      ["中", "zhōng — middle"], ["国", "guó — country"], ["上", "shàng — up / above"], ["下", "xià — down / below"],
    ],
  },
  {
    id: "zh-everyday",
    title: "Everyday characters",
    glyphs: [
      ["口", "kǒu — mouth"], ["手", "shǒu — hand"], ["心", "xīn — heart"], ["门", "mén — door"],
      ["车", "chē — car / vehicle"], ["家", "jiā — home / family"], ["学", "xué — to study"], ["生", "shēng — to be born / life"],
      ["吃", "chī — to eat"], ["喝", "hē — to drink"], ["大", "dà — big"], ["小", "xiǎo — small"],
      ["不", "bù — not"], ["是", "shì — to be"],
    ],
  },
];

export const MANDARIN_ZH = {
  id: "hanzi-zh",
  forTracks: ["zh-for-en"],
  name: "Characters",
  intro: {
    en: "Mandarin doesn't have an alphabet — each character is a word or word-part, learned with its pinyin (the official romanization, with tone marks: ī í ǐ ì). Nobody learns thousands at once: everyone starts with a foundational set like this one — numbers, people, nature, everyday words — and many of these double as building blocks inside bigger characters. The app always shows pinyin alongside characters, so this is a head start, never a wall.",
    es: "El mandarín no tiene alfabeto — cada carácter es una palabra o parte de una, aprendida con su pinyin (la romanización oficial, con marcas de tono: ī í ǐ ì). Nadie aprende miles de golpe: todos empiezan con un conjunto básico como este — números, personas, naturaleza, palabras cotidianas — y muchos de estos funcionan como piezas dentro de caracteres mayores. La app siempre muestra pinyin junto a los caracteres, así que esto es una ventaja inicial, nunca un muro.",
  },
  systems: [
    {
      id: "hanzi",
      name: "Foundational 汉字",
      blurb: {
        en: "46 high-frequency characters with pinyin and meaning — the numbers, people, nature, and everyday words a beginner meets first.",
        es: "46 caracteres de alta frecuencia con pinyin y significado — los números, personas, naturaleza y palabras cotidianas que un principiante encuentra primero.",
      },
      groups: MANDARIN_GROUPS,
    },
  ],
};

// Kana — the Japanese writing-system definition for the #62 script practice
// mode (kana pilots the generic model; hangul, Cyrillic, and the Mandarin
// curated set follow as data files with this same shape).
//
// Shape contract (what the generic /script page consumes):
//   { id, forTracks: [trackIds], name, intro,
//     systems: [ { id, name, blurb, groups: [ { id, title, glyphs: [[glyph, roman], ...] } ] } ] }
//
// KANJI IS DELIBERATELY OUT OF v1 (decision 2026-07-11) — kana is the entry
// blocker for a Japanese beginner; kanji is a multi-thousand-character
// literacy system and a possible curated v2 lane, not a prerequisite.
//
// Romanization follows Hepburn (shi/chi/tsu/fu/ji), matching how the jaForEn
// track romanizes, per the CJK native-script+romanization convention.

const HIRAGANA_GROUPS = [
  { id: "h-vowels", title: "Vowels", glyphs: [["あ", "a"], ["い", "i"], ["う", "u"], ["え", "e"], ["お", "o"]] },
  { id: "h-k", title: "K row", glyphs: [["か", "ka"], ["き", "ki"], ["く", "ku"], ["け", "ke"], ["こ", "ko"]] },
  { id: "h-s", title: "S row", glyphs: [["さ", "sa"], ["し", "shi"], ["す", "su"], ["せ", "se"], ["そ", "so"]] },
  { id: "h-t", title: "T row", glyphs: [["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"]] },
  { id: "h-n", title: "N row", glyphs: [["な", "na"], ["に", "ni"], ["ぬ", "nu"], ["ね", "ne"], ["の", "no"]] },
  { id: "h-h", title: "H row", glyphs: [["は", "ha"], ["ひ", "hi"], ["ふ", "fu"], ["へ", "he"], ["ほ", "ho"]] },
  { id: "h-m", title: "M row", glyphs: [["ま", "ma"], ["み", "mi"], ["む", "mu"], ["め", "me"], ["も", "mo"]] },
  { id: "h-y", title: "Y row", glyphs: [["や", "ya"], ["ゆ", "yu"], ["よ", "yo"]] },
  { id: "h-r", title: "R row", glyphs: [["ら", "ra"], ["り", "ri"], ["る", "ru"], ["れ", "re"], ["ろ", "ro"]] },
  { id: "h-w", title: "W row + ん", glyphs: [["わ", "wa"], ["を", "wo"], ["ん", "n"]] },
  {
    id: "h-daku",
    title: "Dakuten (゛)",
    glyphs: [
      ["が", "ga"], ["ぎ", "gi"], ["ぐ", "gu"], ["げ", "ge"], ["ご", "go"],
      ["ざ", "za"], ["じ", "ji"], ["ず", "zu"], ["ぜ", "ze"], ["ぞ", "zo"],
      ["だ", "da"], ["ぢ", "ji (di)"], ["づ", "zu (du)"], ["で", "de"], ["ど", "do"],
      ["ば", "ba"], ["び", "bi"], ["ぶ", "bu"], ["べ", "be"], ["ぼ", "bo"],
    ],
  },
  { id: "h-handaku", title: "Handakuten (゜)", glyphs: [["ぱ", "pa"], ["ぴ", "pi"], ["ぷ", "pu"], ["ぺ", "pe"], ["ぽ", "po"]] },
  {
    id: "h-yoon",
    title: "Combos (ゃゅょ)",
    glyphs: [
      ["きゃ", "kya"], ["きゅ", "kyu"], ["きょ", "kyo"],
      ["しゃ", "sha"], ["しゅ", "shu"], ["しょ", "sho"],
      ["ちゃ", "cha"], ["ちゅ", "chu"], ["ちょ", "cho"],
      ["にゃ", "nya"], ["にゅ", "nyu"], ["にょ", "nyo"],
      ["ひゃ", "hya"], ["ひゅ", "hyu"], ["ひょ", "hyo"],
      ["みゃ", "mya"], ["みゅ", "myu"], ["みょ", "myo"],
      ["りゃ", "rya"], ["りゅ", "ryu"], ["りょ", "ryo"],
      ["ぎゃ", "gya"], ["ぎゅ", "gyu"], ["ぎょ", "gyo"],
      ["じゃ", "ja"], ["じゅ", "ju"], ["じょ", "jo"],
      ["びゃ", "bya"], ["びゅ", "byu"], ["びょ", "byo"],
      ["ぴゃ", "pya"], ["ぴゅ", "pyu"], ["ぴょ", "pyo"],
    ],
  },
];

const KATAKANA_GROUPS = [
  { id: "k-vowels", title: "Vowels", glyphs: [["ア", "a"], ["イ", "i"], ["ウ", "u"], ["エ", "e"], ["オ", "o"]] },
  { id: "k-k", title: "K row", glyphs: [["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["ケ", "ke"], ["コ", "ko"]] },
  { id: "k-s", title: "S row", glyphs: [["サ", "sa"], ["シ", "shi"], ["ス", "su"], ["セ", "se"], ["ソ", "so"]] },
  { id: "k-t", title: "T row", glyphs: [["タ", "ta"], ["チ", "chi"], ["ツ", "tsu"], ["テ", "te"], ["ト", "to"]] },
  { id: "k-n", title: "N row", glyphs: [["ナ", "na"], ["ニ", "ni"], ["ヌ", "nu"], ["ネ", "ne"], ["ノ", "no"]] },
  { id: "k-h", title: "H row", glyphs: [["ハ", "ha"], ["ヒ", "hi"], ["フ", "fu"], ["ヘ", "he"], ["ホ", "ho"]] },
  { id: "k-m", title: "M row", glyphs: [["マ", "ma"], ["ミ", "mi"], ["ム", "mu"], ["メ", "me"], ["モ", "mo"]] },
  { id: "k-y", title: "Y row", glyphs: [["ヤ", "ya"], ["ユ", "yu"], ["ヨ", "yo"]] },
  { id: "k-r", title: "R row", glyphs: [["ラ", "ra"], ["リ", "ri"], ["ル", "ru"], ["レ", "re"], ["ロ", "ro"]] },
  { id: "k-w", title: "W row + ン", glyphs: [["ワ", "wa"], ["ヲ", "wo"], ["ン", "n"]] },
  {
    id: "k-daku",
    title: "Dakuten (゛)",
    glyphs: [
      ["ガ", "ga"], ["ギ", "gi"], ["グ", "gu"], ["ゲ", "ge"], ["ゴ", "go"],
      ["ザ", "za"], ["ジ", "ji"], ["ズ", "zu"], ["ゼ", "ze"], ["ゾ", "zo"],
      ["ダ", "da"], ["ヂ", "ji (di)"], ["ヅ", "zu (du)"], ["デ", "de"], ["ド", "do"],
      ["バ", "ba"], ["ビ", "bi"], ["ブ", "bu"], ["ベ", "be"], ["ボ", "bo"],
    ],
  },
  { id: "k-handaku", title: "Handakuten (゜)", glyphs: [["パ", "pa"], ["ピ", "pi"], ["プ", "pu"], ["ペ", "pe"], ["ポ", "po"]] },
  {
    id: "k-yoon",
    title: "Combos (ャュョ)",
    glyphs: [
      ["キャ", "kya"], ["キュ", "kyu"], ["キョ", "kyo"],
      ["シャ", "sha"], ["シュ", "shu"], ["ショ", "sho"],
      ["チャ", "cha"], ["チュ", "chu"], ["チョ", "cho"],
      ["ニャ", "nya"], ["ニュ", "nyu"], ["ニョ", "nyo"],
      ["ヒャ", "hya"], ["ヒュ", "hyu"], ["ヒョ", "hyo"],
      ["ミャ", "mya"], ["ミュ", "myu"], ["ミョ", "myo"],
      ["リャ", "rya"], ["リュ", "ryu"], ["リョ", "ryo"],
      ["ギャ", "gya"], ["ギュ", "gyu"], ["ギョ", "gyo"],
      ["ジャ", "ja"], ["ジュ", "ju"], ["ジョ", "jo"],
      ["ビャ", "bya"], ["ビュ", "byu"], ["ビョ", "byo"],
      ["ピャ", "pya"], ["ピュ", "pyu"], ["ピョ", "pyo"],
    ],
  },
];

export const KANA_JA = {
  id: "kana-ja",
  forTracks: ["ja-for-en"],
  name: "Kana",
  intro: {
    en: "Japanese uses two phonetic alphabets side by side: hiragana (for native words and grammar) and katakana (for foreign words and emphasis). Each symbol is one syllable, and every symbol always sounds the same — learn these and you can read the pronunciation of anything. Kanji (the borrowed Chinese characters) come much later; the app always shows romanized readings alongside, so kana is all you need to get going.",
    es: "El japonés usa dos alfabetos fonéticos en paralelo: hiragana (para palabras nativas y gramática) y katakana (para palabras extranjeras y énfasis). Cada símbolo es una sílaba y siempre suena igual — apréndelos y podrás leer la pronunciación de cualquier cosa. Los kanji (caracteres de origen chino) llegan mucho después; la app siempre muestra lecturas romanizadas al lado, así que con los kana tienes lo necesario para empezar.",
  },
  systems: [
    {
      id: "hiragana",
      name: "Hiragana ひらがな",
      blurb: {
        en: "The rounded, flowing set — used for native Japanese words, word endings, and grammar glue. Learn this one first.",
        es: "El conjunto redondeado y fluido — para palabras japonesas nativas, terminaciones y la gramática. Aprende este primero.",
      },
      groups: HIRAGANA_GROUPS,
    },
    {
      id: "katakana",
      name: "Katakana カタカナ",
      blurb: {
        en: "The sharp, angular set — used for foreign loanwords (コーヒー = coffee), names, and emphasis. Same sounds as hiragana, different shapes.",
        es: "El conjunto anguloso — para préstamos extranjeros (コーヒー = coffee), nombres y énfasis. Los mismos sonidos que hiragana, con otras formas.",
      },
      groups: KATAKANA_GROUPS,
    },
  ],
};

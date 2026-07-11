// Cyrillic (Russian) — writing-system definition for #62 script practice.
// Same data contract as kanaJa.js; generic page, zero page changes.
//
// Grouping follows the standard pedagogy for Latin-alphabet readers: start
// with letters that look AND sound familiar, then defuse the false friends
// (the letters that look Latin but sound different — the #1 source of
// beginner misreadings), then new shapes, then new sounds, then the signs.
// Each cell shows uppercase + lowercase together since several pairs differ
// (Б/б, Е/е…).

const CYRILLIC_GROUPS = [
  {
    id: "cy-friends",
    title: "Look & sound familiar",
    glyphs: [["А а", "a"], ["Е е", "ye"], ["К к", "k"], ["М м", "m"], ["О о", "o"], ["Т т", "t"]],
  },
  {
    id: "cy-false",
    title: "False friends",
    glyphs: [["В в", "v"], ["Н н", "n"], ["Р р", "r"], ["С с", "s"], ["У у", "u"], ["Х х", "kh"]],
  },
  {
    id: "cy-newshapes",
    title: "New shapes, familiar sounds",
    glyphs: [
      ["Б б", "b"], ["Г г", "g"], ["Д д", "d"], ["З з", "z"], ["И и", "i"],
      ["Й й", "y (short i)"], ["Л л", "l"], ["П п", "p"], ["Ф ф", "f"], ["Э э", "e"],
    ],
  },
  {
    id: "cy-newsounds",
    title: "New sounds",
    glyphs: [["Ж ж", "zh"], ["Ц ц", "ts"], ["Ч ч", "ch"], ["Ш ш", "sh"], ["Щ щ", "shch"], ["Ы ы", "y (hard i)"]],
  },
  {
    id: "cy-signs",
    title: "Signs & the yo-yu-ya set",
    glyphs: [["Ё ё", "yo"], ["Ю ю", "yu"], ["Я я", "ya"], ["Ъ ъ", "(hard sign)"], ["Ь ь", "(soft sign)"]],
  },
];

export const CYRILLIC_RU = {
  id: "cyrillic-ru",
  forTracks: ["ru-for-en"],
  name: "Cyrillic",
  intro: {
    en: "Russian's alphabet has 33 letters, and it's closer than it looks — a third of it is basically Latin. The catch is the false friends: В sounds like v, Н like n, Р like r. Sort those out, add a handful of genuinely new shapes and sounds, and Russian words stop being wallpaper. The two 'signs' (Ъ, Ь) have no sound of their own — they modify the consonant before them.",
    es: "El alfabeto ruso tiene 33 letras y es más cercano de lo que parece — un tercio es básicamente latino. La trampa son los falsos amigos: В suena como v, Н como n, Р como r. Acláralos, añade unas cuantas formas y sonidos nuevos, y las palabras rusas dejan de ser papel pintado. Los dos 'signos' (Ъ, Ь) no tienen sonido propio — modifican la consonante anterior.",
  },
  systems: [
    {
      id: "cyrillic",
      name: "Cyrillic Кириллица",
      blurb: {
        en: "All 33 letters, grouped by how they relate to the Latin alphabet — friends first, false friends defused early.",
        es: "Las 33 letras, agrupadas según su relación con el alfabeto latino — primero las amigas, y los falsos amigos desactivados pronto.",
      },
      groups: CYRILLIC_GROUPS,
    },
  ],
};

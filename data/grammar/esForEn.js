// #90: Grammar gym content for esForEn (Spanish for English speakers, Latin
// American — no vosotros). This is the ACTIVE-PRODUCTION companion to #89's
// in-quiz tense transparency: it teaches how tenses drive conjugations
// (regular patterns vs. irregulars/stem-changers) and drives deliberate
// conjugation practice.
//
// WALLED OFF (same own-lane rule as the Word Bank #77): the grammar gym has its
// own progress tracker (localStorage, see the page) and NEVER feeds the main
// XP/level/mastery tracker or the mix-and-match picker. That keeps the main
// tracker unfragmented AND avoids manufacturing false deficits across languages
// that don't have this module (never-punish, applied across languages).
//
// SCOPE: Spanish/Romance conjugation. Do NOT assume it generalizes to CJK
// tracks (zh doesn't conjugate). Content is AI-authored; accuracy of forms is
// the risk surface — FLAG for the LatAm-Spanish reviewer (#41) before public.
//
// Person order is fixed across every verb/tense (Latin American set, 5 slots):
//   [ yo, tú, él/ella, nosotros, ellos/ellas ]

export const PERSONS = [
  { id: "yo", es: "yo", en: "I" },
  { id: "tu", es: "tú", en: "you" },
  { id: "el", es: "él / ella", en: "he / she" },
  { id: "nos", es: "nosotros", en: "we" },
  { id: "ellos", es: "ellos / ellas", en: "they" },
];

export const TENSES = [
  { id: "present", en: "Present", es: "Presente", why: { en: "Habitual or current actions.", es: "Acciones habituales o actuales." } },
  { id: "preterite", en: "Preterite", es: "Pretérito", why: { en: "A completed action at a specific point in the past.", es: "Una acción completada en un momento concreto del pasado." } },
  { id: "imperfect", en: "Imperfect", es: "Imperfecto", why: { en: "Ongoing, habitual, or background past actions.", es: "Acciones pasadas en curso, habituales o de fondo." } },
  { id: "future", en: "Future", es: "Futuro", why: { en: "What will happen.", es: "Lo que ocurrirá." } },
  { id: "conditional", en: "Conditional", es: "Condicional", why: { en: "What would happen.", es: "Lo que ocurriría." } },
  { id: "presSubj", en: "Present subjunctive", es: "Presente de subjuntivo", why: { en: "After wishes, doubt, emotion, or 'cuando' about the future.", es: "Tras deseos, dudas, emociones o 'cuando' sobre el futuro." } },
];

// forms[tenseId] = [yo, tú, él, nosotros, ellos]
const VERBS = [
  {
    inf: "hablar", gloss: { en: "to speak", es: "hablar" }, group: "regular",
    forms: {
      present: ["hablo", "hablas", "habla", "hablamos", "hablan"],
      preterite: ["hablé", "hablaste", "habló", "hablamos", "hablaron"],
      imperfect: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"],
      future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"],
      conditional: ["hablaría", "hablarías", "hablaría", "hablaríamos", "hablarían"],
      presSubj: ["hable", "hables", "hable", "hablemos", "hablen"],
    },
  },
  {
    inf: "comer", gloss: { en: "to eat", es: "comer" }, group: "regular",
    forms: {
      present: ["como", "comes", "come", "comemos", "comen"],
      preterite: ["comí", "comiste", "comió", "comimos", "comieron"],
      imperfect: ["comía", "comías", "comía", "comíamos", "comían"],
      future: ["comeré", "comerás", "comerá", "comeremos", "comerán"],
      conditional: ["comería", "comerías", "comería", "comeríamos", "comerían"],
      presSubj: ["coma", "comas", "coma", "comamos", "coman"],
    },
  },
  {
    inf: "vivir", gloss: { en: "to live", es: "vivir" }, group: "regular",
    forms: {
      present: ["vivo", "vives", "vive", "vivimos", "viven"],
      preterite: ["viví", "viviste", "vivió", "vivimos", "vivieron"],
      imperfect: ["vivía", "vivías", "vivía", "vivíamos", "vivían"],
      future: ["viviré", "vivirás", "vivirá", "viviremos", "vivirán"],
      conditional: ["viviría", "vivirías", "viviría", "viviríamos", "vivirían"],
      presSubj: ["viva", "vivas", "viva", "vivamos", "vivan"],
    },
  },
  {
    inf: "ser", gloss: { en: "to be (permanent)", es: "ser" }, group: "serestar",
    forms: {
      present: ["soy", "eres", "es", "somos", "son"],
      preterite: ["fui", "fuiste", "fue", "fuimos", "fueron"],
      imperfect: ["era", "eras", "era", "éramos", "eran"],
      future: ["seré", "serás", "será", "seremos", "serán"],
      conditional: ["sería", "serías", "sería", "seríamos", "serían"],
      presSubj: ["sea", "seas", "sea", "seamos", "sean"],
    },
  },
  {
    inf: "estar", gloss: { en: "to be (state/location)", es: "estar" }, group: "serestar",
    forms: {
      present: ["estoy", "estás", "está", "estamos", "están"],
      preterite: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"],
      imperfect: ["estaba", "estabas", "estaba", "estábamos", "estaban"],
      future: ["estaré", "estarás", "estará", "estaremos", "estarán"],
      conditional: ["estaría", "estarías", "estaría", "estaríamos", "estarían"],
      presSubj: ["esté", "estés", "esté", "estemos", "estén"],
    },
  },
  {
    inf: "ir", gloss: { en: "to go", es: "ir" }, group: "irregular",
    forms: {
      present: ["voy", "vas", "va", "vamos", "van"],
      preterite: ["fui", "fuiste", "fue", "fuimos", "fueron"],
      imperfect: ["iba", "ibas", "iba", "íbamos", "iban"],
      future: ["iré", "irás", "irá", "iremos", "irán"],
      conditional: ["iría", "irías", "iría", "iríamos", "irían"],
      presSubj: ["vaya", "vayas", "vaya", "vayamos", "vayan"],
    },
  },
  {
    inf: "tener", gloss: { en: "to have", es: "tener" }, group: "irregular",
    forms: {
      present: ["tengo", "tienes", "tiene", "tenemos", "tienen"],
      preterite: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"],
      imperfect: ["tenía", "tenías", "tenía", "teníamos", "tenían"],
      future: ["tendré", "tendrás", "tendrá", "tendremos", "tendrán"],
      conditional: ["tendría", "tendrías", "tendría", "tendríamos", "tendrían"],
      presSubj: ["tenga", "tengas", "tenga", "tengamos", "tengan"],
    },
  },
  {
    inf: "hacer", gloss: { en: "to do / make", es: "hacer" }, group: "irregular",
    forms: {
      present: ["hago", "haces", "hace", "hacemos", "hacen"],
      preterite: ["hice", "hiciste", "hizo", "hicimos", "hicieron"],
      imperfect: ["hacía", "hacías", "hacía", "hacíamos", "hacían"],
      future: ["haré", "harás", "hará", "haremos", "harán"],
      conditional: ["haría", "harías", "haría", "haríamos", "harían"],
      presSubj: ["haga", "hagas", "haga", "hagamos", "hagan"],
    },
  },
  {
    inf: "querer", gloss: { en: "to want (e→ie)", es: "querer" }, group: "stem",
    forms: {
      present: ["quiero", "quieres", "quiere", "queremos", "quieren"],
      preterite: ["quise", "quisiste", "quiso", "quisimos", "quisieron"],
      imperfect: ["quería", "querías", "quería", "queríamos", "querían"],
      future: ["querré", "querrás", "querrá", "querremos", "querrán"],
      conditional: ["querría", "querrías", "querría", "querríamos", "querrían"],
      presSubj: ["quiera", "quieras", "quiera", "queramos", "quieran"],
    },
  },
  {
    inf: "poder", gloss: { en: "to be able (o→ue)", es: "poder" }, group: "stem",
    forms: {
      present: ["puedo", "puedes", "puede", "podemos", "pueden"],
      preterite: ["pude", "pudiste", "pudo", "pudimos", "pudieron"],
      imperfect: ["podía", "podías", "podía", "podíamos", "podían"],
      future: ["podré", "podrás", "podrá", "podremos", "podrán"],
      conditional: ["podría", "podrías", "podría", "podríamos", "podrían"],
      presSubj: ["pueda", "puedas", "pueda", "podamos", "puedan"],
    },
  },
  {
    inf: "pedir", gloss: { en: "to ask for (e→i)", es: "pedir" }, group: "stem",
    forms: {
      present: ["pido", "pides", "pide", "pedimos", "piden"],
      preterite: ["pedí", "pediste", "pidió", "pedimos", "pidieron"],
      imperfect: ["pedía", "pedías", "pedía", "pedíamos", "pedían"],
      future: ["pediré", "pedirás", "pedirá", "pediremos", "pedirán"],
      conditional: ["pediría", "pedirías", "pediría", "pediríamos", "pedirían"],
      presSubj: ["pida", "pidas", "pida", "pidamos", "pidan"],
    },
  },
];

// Learn-view groupings, each with a plain-language pattern note.
export const GROUPS = [
  {
    id: "regular",
    title: { en: "Regular verbs (-ar / -er / -ir)", es: "Verbos regulares (-ar / -er / -ir)" },
    note: {
      en: "Drop the ending, add the pattern for its type. -er and -ir share almost every ending — the main split is -ar vs. the other two.",
      es: "Quita la terminación y agrega el patrón según su tipo. -er e -ir comparten casi todas las terminaciones — la división principal es -ar frente a las otras dos.",
    },
  },
  {
    id: "serestar",
    title: { en: "The two \"to be\": ser vs. estar", es: "Los dos \"to be\": ser vs. estar" },
    note: {
      en: "ser = identity and permanent traits; estar = states, feelings, and location. Both are irregular — worth memorizing cold.",
      es: "ser = identidad y rasgos permanentes; estar = estados, sentimientos y ubicación. Ambos son irregulares — vale la pena memorizarlos.",
    },
  },
  {
    id: "irregular",
    title: { en: "Common irregulars", es: "Irregulares comunes" },
    note: {
      en: "High-frequency verbs that break the rules — often with a \"g\" that appears in the yo form (tengo, hago) and irregular preterite stems (tuve, hice).",
      es: "Verbos muy frecuentes que rompen las reglas — a menudo con una \"g\" en la forma yo (tengo, hago) y raíces irregulares en el pretérito (tuve, hice).",
    },
  },
  {
    id: "stem",
    title: { en: "Stem-changers (boot verbs)", es: "Verbos con cambio de raíz" },
    note: {
      en: "The stressed vowel changes in every person EXCEPT nosotros — draw a boot around yo/tú/él/ellos and it changes there (e→ie, o→ue, e→i), but nosotros stays regular.",
      es: "La vocal acentuada cambia en todas las personas EXCEPTO nosotros — dibuja una bota alrededor de yo/tú/él/ellos y cambia ahí (e→ie, o→ue, e→i), pero nosotros se queda regular.",
    },
  },
];

const esForEnGrammar = {
  trackId: "es-latam-for-en",
  targetLang: "es",
  nativeLang: "en",
  intro: {
    en: "Deliberate conjugation practice — the tense drills that Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.",
    es: "Práctica deliberada de conjugación — los ejercicios de tiempos que el Quiz Rápido solo prueba de pasada. Tu progreso aquí se lleva por separado y nunca afecta tu nivel ni tu racha principal.",
  },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default esForEnGrammar;

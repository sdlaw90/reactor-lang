// #90: Grammar gym content for esSpainForEn — generated (verbecc forms) +
// authored framing. Same schema as data/grammar/esForEn.js; walled off from
// the main tracker (own localStorage progress). AI-generated forms — FLAG for
// native review before public.

export const PERSONS = [
  { id: "yo", es: "yo", en: "I" },
  { id: "tu", es: "tú", en: "you" },
  { id: "el", es: "él / ella", en: "he / she" },
  { id: "nos", es: "nosotros", en: "we" },
  { id: "vos", es: "vosotros", en: "you all" },
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

const VERBS = [
  {
    inf: "hablar", gloss: { en: "to speak", es: "hablar" }, group: "regular",
    forms: {
      present: ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"],
      preterite: ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"],
      imperfect: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"],
      future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"],
      conditional: ["hablaría", "hablarías", "hablaría", "hablaríamos", "hablaríais", "hablarían"],
      presSubj: ["hable", "hables", "hable", "hablemos", "habléis", "hablen"],
    },
  },
  {
    inf: "comer", gloss: { en: "to eat", es: "comer" }, group: "regular",
    forms: {
      present: ["como", "comes", "come", "comemos", "coméis", "comen"],
      preterite: ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"],
      imperfect: ["comía", "comías", "comía", "comíamos", "comíais", "comían"],
      future: ["comeré", "comerás", "comerá", "comeremos", "comeréis", "comerán"],
      conditional: ["comería", "comerías", "comería", "comeríamos", "comeríais", "comerían"],
      presSubj: ["coma", "comas", "coma", "comamos", "comáis", "coman"],
    },
  },
  {
    inf: "vivir", gloss: { en: "to live", es: "vivir" }, group: "regular",
    forms: {
      present: ["vivo", "vives", "vive", "vivimos", "vivís", "viven"],
      preterite: ["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"],
      imperfect: ["vivía", "vivías", "vivía", "vivíamos", "vivíais", "vivían"],
      future: ["viviré", "vivirás", "vivirá", "viviremos", "viviréis", "vivirán"],
      conditional: ["viviría", "vivirías", "viviría", "viviríamos", "viviríais", "vivirían"],
      presSubj: ["viva", "vivas", "viva", "vivamos", "viváis", "vivan"],
    },
  },
  {
    inf: "ser", gloss: { en: "to be (permanent)", es: "ser" }, group: "serestar",
    forms: {
      present: ["soy", "eres", "es", "somos", "sois", "son"],
      preterite: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfect: ["era", "eras", "era", "éramos", "erais", "eran"],
      future: ["seré", "serás", "será", "seremos", "seréis", "serán"],
      conditional: ["sería", "serías", "sería", "seríamos", "seríais", "serían"],
      presSubj: ["sea", "seas", "sea", "seamos", "seáis", "sean"],
    },
  },
  {
    inf: "estar", gloss: { en: "to be (state/location)", es: "estar" }, group: "serestar",
    forms: {
      present: ["estoy", "estás", "está", "estamos", "estáis", "están"],
      preterite: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
      imperfect: ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"],
      future: ["estaré", "estarás", "estará", "estaremos", "estaréis", "estarán"],
      conditional: ["estaría", "estarías", "estaría", "estaríamos", "estaríais", "estarían"],
      presSubj: ["esté", "estés", "esté", "estemos", "estéis", "estén"],
    },
  },
  {
    inf: "ir", gloss: { en: "to go", es: "ir" }, group: "irregular",
    forms: {
      present: ["voy", "vas", "va", "vamos", "vais", "van"],
      preterite: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfect: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
      future: ["iré", "irás", "irá", "iremos", "iréis", "irán"],
      conditional: ["iría", "irías", "iría", "iríamos", "iríais", "irían"],
      presSubj: ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"],
    },
  },
  {
    inf: "tener", gloss: { en: "to have", es: "tener" }, group: "irregular",
    forms: {
      present: ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
      preterite: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
      imperfect: ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"],
      future: ["tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán"],
      conditional: ["tendría", "tendrías", "tendría", "tendríamos", "tendríais", "tendrían"],
      presSubj: ["tenga", "tengas", "tenga", "tengamos", "tengáis", "tengan"],
    },
  },
  {
    inf: "hacer", gloss: { en: "to do / make", es: "hacer" }, group: "irregular",
    forms: {
      present: ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
      preterite: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
      imperfect: ["hacía", "hacías", "hacía", "hacíamos", "hacíais", "hacían"],
      future: ["haré", "harás", "hará", "haremos", "haréis", "harán"],
      conditional: ["haría", "harías", "haría", "haríamos", "haríais", "harían"],
      presSubj: ["haga", "hagas", "haga", "hagamos", "hagáis", "hagan"],
    },
  },
  {
    inf: "querer", gloss: { en: "to want (e→ie)", es: "querer" }, group: "stem",
    forms: {
      present: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
      preterite: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
      imperfect: ["quería", "querías", "quería", "queríamos", "queríais", "querían"],
      future: ["querré", "querrás", "querrá", "querremos", "querréis", "querrán"],
      conditional: ["querría", "querrías", "querría", "querríamos", "querríais", "querrían"],
      presSubj: ["quiera", "quieras", "quiera", "queramos", "queráis", "quieran"],
    },
  },
  {
    inf: "poder", gloss: { en: "to be able (o→ue)", es: "poder" }, group: "stem",
    forms: {
      present: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
      preterite: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
      imperfect: ["podía", "podías", "podía", "podíamos", "podíais", "podían"],
      future: ["podré", "podrás", "podrá", "podremos", "podréis", "podrán"],
      conditional: ["podría", "podrías", "podría", "podríamos", "podríais", "podrían"],
      presSubj: ["pueda", "puedas", "pueda", "podamos", "podáis", "puedan"],
    },
  },
  {
    inf: "pedir", gloss: { en: "to ask for (e→i)", es: "pedir" }, group: "stem",
    forms: {
      present: ["pido", "pides", "pide", "pedimos", "pedís", "piden"],
      preterite: ["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"],
      imperfect: ["pedía", "pedías", "pedía", "pedíamos", "pedíais", "pedían"],
      future: ["pediré", "pedirás", "pedirá", "pediremos", "pediréis", "pedirán"],
      conditional: ["pediría", "pedirías", "pediría", "pediríamos", "pediríais", "pedirían"],
      presSubj: ["pida", "pidas", "pida", "pidamos", "pidáis", "pidan"],
    },
  },
];

export const GROUPS = [
  { id: "regular", title: { en: "Regular verbs (-ar / -er / -ir)", es: "Verbos regulares (-ar / -er / -ir)" }, note: { en: "Drop the ending, add the pattern for its type. -er and -ir share almost every ending — the main split is -ar vs. the other two.", es: "Quita la terminación y agrega el patrón según su tipo. -er e -ir comparten casi todas las terminaciones — la división principal es -ar frente a las otras dos." } },
  { id: "serestar", title: { en: "The two \"to be\": ser vs. estar", es: "Los dos \"to be\": ser vs. estar" }, note: { en: "ser = identity and permanent traits; estar = states, feelings, and location. Both are irregular — worth memorizing cold.", es: "ser = identidad y rasgos permanentes; estar = estados, sentimientos y ubicación. Ambos son irregulares — vale la pena memorizarlos." } },
  { id: "irregular", title: { en: "Common irregulars", es: "Irregulares comunes" }, note: { en: "High-frequency verbs that break the rules — often with a \"g\" in the yo form (tengo, hago) and irregular preterite stems (tuve, hice).", es: "Verbos muy frecuentes que rompen las reglas — a menudo con una \"g\" en la forma yo (tengo, hago) y raíces irregulares en el pretérito (tuve, hice)." } },
  { id: "stem", title: { en: "Stem-changers (boot verbs)", es: "Verbos con cambio de raíz" }, note: { en: "The stressed vowel changes in every person EXCEPT nosotros and vosotros — draw a boot around yo/tú/él/ellos (e→ie, o→ue, e→i); nosotros and vosotros stay regular.", es: "La vocal acentuada cambia en todas las personas EXCEPTO nosotros y vosotros — dibuja una bota alrededor de yo/tú/él/ellos (e→ie, o→ue, e→i); nosotros y vosotros se quedan regulares." } },
];

const esSpainForEnGrammar = {
  trackId: "es-spain-for-en",
  targetLang: "es",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.", es: "Práctica deliberada de conjugación — los ejercicios de tiempos que el Quiz Rápido solo prueba de pasada. Tu progreso aquí se lleva por separado y nunca afecta tu nivel ni tu racha principal." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default esSpainForEnGrammar;

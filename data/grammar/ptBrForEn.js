// #90: Grammar gym content for ptBrForEn — generated (verbecc forms) +
// authored framing. Same schema as data/grammar/esForEn.js; walled off from
// the main tracker (own localStorage progress). AI-generated forms — FLAG for
// native review before public.

export const PERSONS = [
  { id: "eu", pt: "eu", en: "I" },
  { id: "voce", pt: "você", en: "you" },
  { id: "ele", pt: "ele / ela", en: "he / she" },
  { id: "nos", pt: "nós", en: "we" },
  { id: "eles", pt: "eles / elas", en: "they" },
];

export const TENSES = [
  { id: "presente", en: "Present", pt: "Presente", why: { en: "Habitual or current actions.", pt: "Ações habituais ou atuais." } },
  { id: "pretPerfeito", en: "Preterite", pt: "Pretérito perfeito", why: { en: "A completed past action (\"did\").", pt: "Uma ação passada concluída." } },
  { id: "imperfeito", en: "Imperfect", pt: "Pretérito imperfeito", why: { en: "Ongoing, habitual, or background past.", pt: "Passado em curso, habitual ou de fundo." } },
  { id: "futuro", en: "Future", pt: "Futuro", why: { en: "What will happen.", pt: "O que vai acontecer." } },
  { id: "condicional", en: "Conditional", pt: "Condicional", why: { en: "What would happen, and polite requests.", pt: "O que aconteceria, e pedidos corteses." } },
  { id: "presSubj", en: "Present subjunctive", pt: "Presente do subjuntivo", why: { en: "After wish, doubt, emotion (espero que, talvez, embora).", pt: "Após desejo, dúvida, emoção (espero que…)." } },
];

const VERBS = [
  {
    inf: "falar", gloss: { en: "to speak", pt: "falar" }, group: "regular",
    forms: {
      presente: ["falo", "fala", "fala", "falamos", "falam"],
      pretPerfeito: ["falei", "falou", "falou", "falamos", "falaram"],
      imperfeito: ["falava", "falava", "falava", "falávamos", "falavam"],
      futuro: ["falarei", "falará", "falará", "falaremos", "falarão"],
      condicional: ["falaria", "falaria", "falaria", "falaríamos", "falariam"],
      presSubj: ["fale", "fale", "fale", "falemos", "falem"],
    },
  },
  {
    inf: "comer", gloss: { en: "to eat", pt: "comer" }, group: "regular",
    forms: {
      presente: ["como", "come", "come", "comemos", "comem"],
      pretPerfeito: ["comi", "comeu", "comeu", "comemos", "comeram"],
      imperfeito: ["comia", "comia", "comia", "comíamos", "comiam"],
      futuro: ["comerei", "comerá", "comerá", "comeremos", "comerão"],
      condicional: ["comeria", "comeria", "comeria", "comeríamos", "comeriam"],
      presSubj: ["coma", "coma", "coma", "comamos", "comam"],
    },
  },
  {
    inf: "partir", gloss: { en: "to leave", pt: "partir" }, group: "regular",
    forms: {
      presente: ["parto", "parte", "parte", "partimos", "partem"],
      pretPerfeito: ["parti", "partiu", "partiu", "partimos", "partiram"],
      imperfeito: ["partia", "partia", "partia", "partíamos", "partiam"],
      futuro: ["partirei", "partirá", "partirá", "partiremos", "partirão"],
      condicional: ["partiria", "partiria", "partiria", "partiríamos", "partiriam"],
      presSubj: ["parta", "parta", "parta", "partamos", "partam"],
    },
  },
  {
    inf: "ser", gloss: { en: "to be (permanent)", pt: "ser" }, group: "serestar",
    forms: {
      presente: ["sou", "é", "é", "somos", "são"],
      pretPerfeito: ["fui", "foi", "foi", "fomos", "foram"],
      imperfeito: ["era", "era", "era", "éramos", "eram"],
      futuro: ["serei", "será", "será", "seremos", "serão"],
      condicional: ["seria", "seria", "seria", "seríamos", "seriam"],
      presSubj: ["seja", "seja", "seja", "sejamos", "sejam"],
    },
  },
  {
    inf: "estar", gloss: { en: "to be (state/location)", pt: "estar" }, group: "serestar",
    forms: {
      presente: ["estou", "está", "está", "estamos", "estão"],
      pretPerfeito: ["estive", "esteve", "esteve", "estivemos", "estiveram"],
      imperfeito: ["estava", "estava", "estava", "estávamos", "estavam"],
      futuro: ["estarei", "estará", "estará", "estaremos", "estarão"],
      condicional: ["estaria", "estaria", "estaria", "estaríamos", "estariam"],
      presSubj: ["esteja", "esteja", "esteja", "estejamos", "estejam"],
    },
  },
  {
    inf: "ir", gloss: { en: "to go", pt: "ir" }, group: "irregular",
    forms: {
      presente: ["vou", "vai", "vai", "vamos", "vão"],
      pretPerfeito: ["fui", "foi", "foi", "fomos", "foram"],
      imperfeito: ["ia", "ia", "ia", "íamos", "iam"],
      futuro: ["irei", "irá", "irá", "iremos", "irão"],
      condicional: ["iria", "iria", "iria", "iríamos", "iriam"],
      presSubj: ["vá", "vá", "vá", "vamos", "vão"],
    },
  },
  {
    inf: "ter", gloss: { en: "to have", pt: "ter" }, group: "irregular",
    forms: {
      presente: ["tenho", "tem", "tem", "temos", "têm"],
      pretPerfeito: ["tive", "teve", "teve", "tivemos", "tiveram"],
      imperfeito: ["tinha", "tinha", "tinha", "tínhamos", "tinham"],
      futuro: ["terei", "terá", "terá", "teremos", "terão"],
      condicional: ["teria", "teria", "teria", "teríamos", "teriam"],
      presSubj: ["tenha", "tenha", "tenha", "tenhamos", "tenham"],
    },
  },
  {
    inf: "fazer", gloss: { en: "to do / make", pt: "fazer" }, group: "irregular",
    forms: {
      presente: ["faço", "faz", "faz", "fazemos", "fazem"],
      pretPerfeito: ["fiz", "fez", "fez", "fizemos", "fizeram"],
      imperfeito: ["fazia", "fazia", "fazia", "fazíamos", "faziam"],
      futuro: ["farei", "fará", "fará", "faremos", "farão"],
      condicional: ["faria", "faria", "faria", "faríamos", "fariam"],
      presSubj: ["faça", "faça", "faça", "façamos", "façam"],
    },
  },
  {
    inf: "ver", gloss: { en: "to see", pt: "ver" }, group: "irregular",
    forms: {
      presente: ["vejo", "vê", "vê", "vemos", "veem"],
      pretPerfeito: ["vi", "viu", "viu", "vimos", "viram"],
      imperfeito: ["via", "via", "via", "víamos", "viam"],
      futuro: ["verei", "verá", "verá", "veremos", "verão"],
      condicional: ["veria", "veria", "veria", "veríamos", "veriam"],
      presSubj: ["veja", "veja", "veja", "vejamos", "vejam"],
    },
  },
  {
    inf: "poder", gloss: { en: "to be able / can", pt: "poder" }, group: "modal",
    forms: {
      presente: ["posso", "pode", "pode", "podemos", "podem"],
      pretPerfeito: ["pude", "pôde", "pôde", "pudemos", "puderam"],
      imperfeito: ["podia", "podia", "podia", "podíamos", "podiam"],
      futuro: ["poderei", "poderá", "poderá", "poderemos", "poderão"],
      condicional: ["poderia", "poderia", "poderia", "poderíamos", "poderiam"],
      presSubj: ["possa", "possa", "possa", "possamos", "possam"],
    },
  },
  {
    inf: "querer", gloss: { en: "to want", pt: "querer" }, group: "modal",
    forms: {
      presente: ["quero", "quer", "quer", "queremos", "querem"],
      pretPerfeito: ["quis", "quis", "quis", "quisemos", "quiseram"],
      imperfeito: ["queria", "queria", "queria", "queríamos", "queriam"],
      futuro: ["quererei", "quererá", "quererá", "quereremos", "quererão"],
      condicional: ["quereria", "quereria", "quereria", "quereríamos", "quereriam"],
      presSubj: ["queira", "queira", "queira", "queiramos", "queiram"],
    },
  },
];

export const GROUPS = [
  { id: "regular", title: { en: "Regular verbs (-ar / -er / -ir)", pt: "Verbos regulares" }, note: { en: "Drop the ending and add the pattern for its type. -er and -ir share almost every ending; the main split is -ar vs. the other two.", pt: "Tira a terminação e junta o padrão do tipo." } },
  { id: "serestar", title: { en: "The two \"to be\": ser vs. estar", pt: "Os dois \"to be\": ser vs. estar" }, note: { en: "ser = identity and permanent traits; estar = states, feelings, and location. Both irregular — worth memorizing.", pt: "ser = identidade e traços permanentes; estar = estados e localização." } },
  { id: "irregular", title: { en: "Common irregulars", pt: "Irregulares comuns" }, note: { en: "High-frequency verbs that break the rules — ir, ter, fazer, ver — often with irregular preterite stems (fui, tive, fiz).", pt: "Verbos muito frequentes que fogem à regra." } },
  { id: "modal", title: { en: "Modal-type verbs", pt: "Verbos modais" }, note: { en: "poder and querer take an infinitive after them (posso sair) and have irregular preterites (pude, quis).", pt: "poder e querer são seguidos de um infinitivo." } },
];

const ptBrForEnGrammar = {
  trackId: "pt-br-for-en",
  targetLang: "pt",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.", pt: "Prática deliberada de conjugação. O teu progresso é registado à parte e nunca afeta o teu nível principal." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default ptBrForEnGrammar;

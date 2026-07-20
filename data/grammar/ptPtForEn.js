// #90: Grammar gym content for ptPtForEn — generated (verbecc forms) +
// authored framing. Same schema as data/grammar/esForEn.js; walled off from
// the main tracker (own localStorage progress). AI-generated forms — FLAG for
// native review before public.

export const PERSONS = [
  { id: "eu", pt: "eu", en: "I" },
  { id: "tu", pt: "tu", en: "you" },
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
      presente: ["falo", "falas", "fala", "falamos", "falam"],
      pretPerfeito: ["falei", "falaste", "falou", "falámos", "falaram"],
      imperfeito: ["falava", "falavas", "falava", "falávamos", "falavam"],
      futuro: ["falarei", "falarás", "falará", "falaremos", "falarão"],
      condicional: ["falaria", "falarias", "falaria", "falaríamos", "falariam"],
      presSubj: ["fale", "fales", "fale", "falemos", "falem"],
    },
  },
  {
    inf: "comer", gloss: { en: "to eat", pt: "comer" }, group: "regular",
    forms: {
      presente: ["como", "comes", "come", "comemos", "comem"],
      pretPerfeito: ["comi", "comeste", "comeu", "comemos", "comeram"],
      imperfeito: ["comia", "comias", "comia", "comíamos", "comiam"],
      futuro: ["comerei", "comerás", "comerá", "comeremos", "comerão"],
      condicional: ["comeria", "comerias", "comeria", "comeríamos", "comeriam"],
      presSubj: ["coma", "comas", "coma", "comamos", "comam"],
    },
  },
  {
    inf: "partir", gloss: { en: "to leave", pt: "partir" }, group: "regular",
    forms: {
      presente: ["parto", "partes", "parte", "partimos", "partem"],
      pretPerfeito: ["parti", "partiste", "partiu", "partimos", "partiram"],
      imperfeito: ["partia", "partias", "partia", "partíamos", "partiam"],
      futuro: ["partirei", "partirás", "partirá", "partiremos", "partirão"],
      condicional: ["partiria", "partirias", "partiria", "partiríamos", "partiriam"],
      presSubj: ["parta", "partas", "parta", "partamos", "partam"],
    },
  },
  {
    inf: "ser", gloss: { en: "to be (permanent)", pt: "ser" }, group: "serestar",
    forms: {
      presente: ["sou", "és", "é", "somos", "são"],
      pretPerfeito: ["fui", "foste", "foi", "fomos", "foram"],
      imperfeito: ["era", "eras", "era", "éramos", "eram"],
      futuro: ["serei", "serás", "será", "seremos", "serão"],
      condicional: ["seria", "serias", "seria", "seríamos", "seriam"],
      presSubj: ["seja", "sejas", "seja", "sejamos", "sejam"],
    },
  },
  {
    inf: "estar", gloss: { en: "to be (state/location)", pt: "estar" }, group: "serestar",
    forms: {
      presente: ["estou", "estás", "está", "estamos", "estão"],
      pretPerfeito: ["estive", "estiveste", "esteve", "estivemos", "estiveram"],
      imperfeito: ["estava", "estavas", "estava", "estávamos", "estavam"],
      futuro: ["estarei", "estarás", "estará", "estaremos", "estarão"],
      condicional: ["estaria", "estarias", "estaria", "estaríamos", "estariam"],
      presSubj: ["esteja", "estejas", "esteja", "estejamos", "estejam"],
    },
  },
  {
    inf: "ir", gloss: { en: "to go", pt: "ir" }, group: "irregular",
    forms: {
      presente: ["vou", "vais", "vai", "vamos", "vão"],
      pretPerfeito: ["fui", "foste", "foi", "fomos", "foram"],
      imperfeito: ["ia", "ias", "ia", "íamos", "iam"],
      futuro: ["irei", "irás", "irá", "iremos", "irão"],
      condicional: ["iria", "irias", "iria", "iríamos", "iriam"],
      presSubj: ["vá", "vás", "vá", "vamos", "vão"],
    },
  },
  {
    inf: "ter", gloss: { en: "to have", pt: "ter" }, group: "irregular",
    forms: {
      presente: ["tenho", "tens", "tem", "temos", "têm"],
      pretPerfeito: ["tive", "tiveste", "teve", "tivemos", "tiveram"],
      imperfeito: ["tinha", "tinhas", "tinha", "tínhamos", "tinham"],
      futuro: ["terei", "terás", "terá", "teremos", "terão"],
      condicional: ["teria", "terias", "teria", "teríamos", "teriam"],
      presSubj: ["tenha", "tenhas", "tenha", "tenhamos", "tenham"],
    },
  },
  {
    inf: "fazer", gloss: { en: "to do / make", pt: "fazer" }, group: "irregular",
    forms: {
      presente: ["faço", "fazes", "faz", "fazemos", "fazem"],
      pretPerfeito: ["fiz", "fizeste", "fez", "fizemos", "fizeram"],
      imperfeito: ["fazia", "fazias", "fazia", "fazíamos", "faziam"],
      futuro: ["farei", "farás", "fará", "faremos", "farão"],
      condicional: ["faria", "farias", "faria", "faríamos", "fariam"],
      presSubj: ["faça", "faças", "faça", "façamos", "façam"],
    },
  },
  {
    inf: "ver", gloss: { en: "to see", pt: "ver" }, group: "irregular",
    forms: {
      presente: ["vejo", "vês", "vê", "vemos", "veem"],
      pretPerfeito: ["vi", "viste", "viu", "vimos", "viram"],
      imperfeito: ["via", "vias", "via", "víamos", "viam"],
      futuro: ["verei", "verás", "verá", "veremos", "verão"],
      condicional: ["veria", "verias", "veria", "veríamos", "veriam"],
      presSubj: ["veja", "vejas", "veja", "vejamos", "vejam"],
    },
  },
  {
    inf: "poder", gloss: { en: "to be able / can", pt: "poder" }, group: "modal",
    forms: {
      presente: ["posso", "podes", "pode", "podemos", "podem"],
      pretPerfeito: ["pude", "pudeste", "pôde", "pudemos", "puderam"],
      imperfeito: ["podia", "podias", "podia", "podíamos", "podiam"],
      futuro: ["poderei", "poderás", "poderá", "poderemos", "poderão"],
      condicional: ["poderia", "poderias", "poderia", "poderíamos", "poderiam"],
      presSubj: ["possa", "possas", "possa", "possamos", "possam"],
    },
  },
  {
    inf: "querer", gloss: { en: "to want", pt: "querer" }, group: "modal",
    forms: {
      presente: ["quero", "queres", "quer", "queremos", "querem"],
      pretPerfeito: ["quis", "quiseste", "quis", "quisemos", "quiseram"],
      imperfeito: ["queria", "querias", "queria", "queríamos", "queriam"],
      futuro: ["quererei", "quererás", "quererá", "quereremos", "quererão"],
      condicional: ["quereria", "quererias", "quereria", "quereríamos", "quereriam"],
      presSubj: ["queira", "queiras", "queira", "queiramos", "queiram"],
    },
  },
];

export const GROUPS = [
  { id: "regular", title: { en: "Regular verbs (-ar / -er / -ir)", pt: "Verbos regulares" }, note: { en: "Drop the ending and add the pattern for its type. -er and -ir share almost every ending; the main split is -ar vs. the other two.", pt: "Tira a terminação e junta o padrão do tipo." } },
  { id: "serestar", title: { en: "The two \"to be\": ser vs. estar", pt: "Os dois \"to be\": ser vs. estar" }, note: { en: "ser = identity and permanent traits; estar = states, feelings, and location. Both irregular — worth memorizing.", pt: "ser = identidade e traços permanentes; estar = estados e localização." } },
  { id: "irregular", title: { en: "Common irregulars", pt: "Irregulares comuns" }, note: { en: "High-frequency verbs that break the rules — ir, ter, fazer, ver — often with irregular preterite stems (fui, tive, fiz).", pt: "Verbos muito frequentes que fogem à regra." } },
  { id: "modal", title: { en: "Modal-type verbs", pt: "Verbos modais" }, note: { en: "poder and querer take an infinitive after them (posso sair) and have irregular preterites (pude, quis).", pt: "poder e querer são seguidos de um infinitivo." } },
];

const ptPtForEnGrammar = {
  trackId: "pt-pt-for-en",
  targetLang: "pt",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.", pt: "Prática deliberada de conjugação. O teu progresso é registado à parte e nunca afeta o teu nível principal." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default ptPtForEnGrammar;

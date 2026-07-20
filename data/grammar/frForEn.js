// #90: Grammar gym content for frForEn — generated (verbecc forms) +
// authored framing. Same schema as data/grammar/esForEn.js; walled off from
// the main tracker (own localStorage progress). AI-generated forms — FLAG for
// native review before public.

export const PERSONS = [
  { id: "je", fr: "je", en: "I" },
  { id: "tu", fr: "tu", en: "you" },
  { id: "il", fr: "il / elle", en: "he / she" },
  { id: "nous", fr: "nous", en: "we" },
  { id: "vous", fr: "vous", en: "you (pl/formal)" },
  { id: "ils", fr: "ils / elles", en: "they" },
];

export const TENSES = [
  { id: "present", en: "Present", fr: "Présent", why: { en: "Habitual or current actions.", fr: "Actions habituelles ou actuelles." } },
  { id: "passeCompose", en: "Passé composé", fr: "Passé composé", why: { en: "The everyday past — a completed action (\"did / have done\").", fr: "Le passé courant — une action achevée." } },
  { id: "imparfait", en: "Imperfect", fr: "Imparfait", why: { en: "Ongoing, habitual, or background past.", fr: "Passé en cours, habituel ou de fond." } },
  { id: "futur", en: "Future", fr: "Futur simple", why: { en: "What will happen.", fr: "Ce qui arrivera." } },
  { id: "conditionnel", en: "Conditional", fr: "Conditionnel", why: { en: "What would happen — often after a hypothetical 'si'.", fr: "Ce qui arriverait — souvent après un 'si'." } },
  { id: "subjPresent", en: "Present subjunctive", fr: "Subjonctif présent", why: { en: "After necessity, wish, doubt or emotion (il faut que, vouloir que).", fr: "Après la nécessité, le souhait, le doute (il faut que…)." } },
];

const VERBS = [
  {
    inf: "parler", gloss: { en: "to speak", fr: "parler" }, group: "regular",
    forms: {
      present: ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
      passeCompose: ["ai parlé", "as parlé", "a parlé", "avons parlé", "avez parlé", "ont parlé"],
      imparfait: ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
      futur: ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
      conditionnel: ["parlerais", "parlerais", "parlerait", "parlerions", "parleriez", "parleraient"],
      subjPresent: ["parle", "parles", "parle", "parlions", "parliez", "parlent"],
    },
  },
  {
    inf: "finir", gloss: { en: "to finish", fr: "finir" }, group: "regular",
    forms: {
      present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
      passeCompose: ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"],
      imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
      futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
      conditionnel: ["finirais", "finirais", "finirait", "finirions", "finiriez", "finiraient"],
      subjPresent: ["finisse", "finisses", "finisse", "finissions", "finissiez", "finissent"],
    },
  },
  {
    inf: "vendre", gloss: { en: "to sell", fr: "vendre" }, group: "regular",
    forms: {
      present: ["vends", "vends", "vend", "vendons", "vendez", "vendent"],
      passeCompose: ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"],
      imparfait: ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"],
      futur: ["vendrai", "vendras", "vendra", "vendrons", "vendrez", "vendront"],
      conditionnel: ["vendrais", "vendrais", "vendrait", "vendrions", "vendriez", "vendraient"],
      subjPresent: ["vende", "vendes", "vende", "vendions", "vendiez", "vendent"],
    },
  },
  {
    inf: "être", gloss: { en: "to be", fr: "être" }, group: "aux",
    forms: {
      present: ["suis", "es", "est", "sommes", "êtes", "sont"],
      passeCompose: ["ai été", "as été", "a été", "avons été", "avez été", "ont été"],
      imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
      futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
      conditionnel: ["serais", "serais", "serait", "serions", "seriez", "seraient"],
      subjPresent: ["sois", "sois", "soit", "soyons", "soyez", "soient"],
    },
  },
  {
    inf: "avoir", gloss: { en: "to have", fr: "avoir" }, group: "aux",
    forms: {
      present: ["ai", "as", "a", "avons", "avez", "ont"],
      passeCompose: ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"],
      imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
      futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
      conditionnel: ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
      subjPresent: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
    },
  },
  {
    inf: "aller", gloss: { en: "to go", fr: "aller" }, group: "irregular",
    forms: {
      present: ["vais", "vas", "va", "allons", "allez", "vont"],
      passeCompose: ["suis allé", "es allé", "est allé", "sommes allés", "êtes allés", "sont allés"],
      imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
      futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
      conditionnel: ["irais", "irais", "irait", "irions", "iriez", "iraient"],
      subjPresent: ["aille", "ailles", "aille", "allions", "alliez", "aillent"],
    },
  },
  {
    inf: "faire", gloss: { en: "to do / make", fr: "faire" }, group: "irregular",
    forms: {
      present: ["fais", "fais", "fait", "faisons", "faites", "font"],
      passeCompose: ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"],
      imparfait: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
      futur: ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
      conditionnel: ["ferais", "ferais", "ferait", "ferions", "feriez", "feraient"],
      subjPresent: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"],
    },
  },
  {
    inf: "venir", gloss: { en: "to come", fr: "venir" }, group: "irregular",
    forms: {
      present: ["viens", "viens", "vient", "venons", "venez", "viennent"],
      passeCompose: ["suis venu", "es venu", "est venu", "sommes venus", "êtes venus", "sont venus"],
      imparfait: ["venais", "venais", "venait", "venions", "veniez", "venaient"],
      futur: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
      conditionnel: ["viendrais", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient"],
      subjPresent: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"],
    },
  },
  {
    inf: "prendre", gloss: { en: "to take", fr: "prendre" }, group: "irregular",
    forms: {
      present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
      passeCompose: ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"],
      imparfait: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
      futur: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
      conditionnel: ["prendrais", "prendrais", "prendrait", "prendrions", "prendriez", "prendraient"],
      subjPresent: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"],
    },
  },
  {
    inf: "pouvoir", gloss: { en: "to be able / can", fr: "pouvoir" }, group: "modal",
    forms: {
      present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
      passeCompose: ["ai pu", "as pu", "a pu", "avons pu", "avez pu", "ont pu"],
      imparfait: ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
      futur: ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
      conditionnel: ["pourrais", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient"],
      subjPresent: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"],
    },
  },
  {
    inf: "vouloir", gloss: { en: "to want", fr: "vouloir" }, group: "modal",
    forms: {
      present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
      passeCompose: ["ai voulu", "as voulu", "a voulu", "avons voulu", "avez voulu", "ont voulu"],
      imparfait: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
      futur: ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
      conditionnel: ["voudrais", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient"],
      subjPresent: ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"],
    },
  },
];

export const GROUPS = [
  { id: "regular", title: { en: "Regular verbs (-er / -ir / -re)", fr: "Verbes réguliers" }, note: { en: "Drop the ending and add the pattern for its type. -er is the biggest family; -ir and -re are smaller and share many endings.", fr: "Enlève la terminaison et ajoute le motif du type." } },
  { id: "aux", title: { en: "The two helpers: être & avoir", fr: "Les deux auxiliaires : être & avoir" }, note: { en: "Both are highly irregular and both build the passé composé (most verbs take avoir; movement/state verbs take être). Memorize them cold.", fr: "Les deux sont irréguliers et forment le passé composé." } },
  { id: "irregular", title: { en: "Common irregulars", fr: "Irréguliers courants" }, note: { en: "High-frequency verbs that rewrite their stem — aller, faire, venir, prendre. Worth learning one at a time.", fr: "Verbes très fréquents à radical irrégulier." } },
  { id: "modal", title: { en: "Modal-type verbs", fr: "Verbes modaux" }, note: { en: "pouvoir and vouloir take an infinitive after them (je peux partir) and have irregular stems in the future/conditional (pourr-, voudr-).", fr: "pouvoir et vouloir sont suivis d'un infinitif." } },
];

const frForEnGrammar = {
  trackId: "fr-for-en",
  targetLang: "fr",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.", fr: "Pratique délibérée de la conjugaison. Ta progression est suivie à part et n'affecte jamais ton niveau principal." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default frForEnGrammar;

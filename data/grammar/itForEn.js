// #90: Grammar gym content for itForEn — generated (verbecc forms) +
// authored framing. Same schema as data/grammar/esForEn.js; walled off from
// the main tracker (own localStorage progress). AI-generated forms — FLAG for
// native review before public.

export const PERSONS = [
  { id: "io", it: "io", en: "I" },
  { id: "tu", it: "tu", en: "you" },
  { id: "lui", it: "lui / lei", en: "he / she" },
  { id: "noi", it: "noi", en: "we" },
  { id: "voi", it: "voi", en: "you all" },
  { id: "loro", it: "loro", en: "they" },
];

export const TENSES = [
  { id: "presente", en: "Present", it: "Presente", why: { en: "Habitual or current actions.", it: "Azioni abituali o attuali." } },
  { id: "passatoProssimo", en: "Passato prossimo", it: "Passato prossimo", why: { en: "The everyday past — a completed action (\"did / have done\").", it: "Il passato corrente — un'azione compiuta." } },
  { id: "imperfetto", en: "Imperfect", it: "Imperfetto", why: { en: "Ongoing, habitual, or background past.", it: "Passato in corso, abituale o di sfondo." } },
  { id: "futuro", en: "Future", it: "Futuro semplice", why: { en: "What will happen.", it: "Ciò che accadrà." } },
  { id: "condizionale", en: "Conditional", it: "Condizionale", why: { en: "What would happen, and polite requests (vorrei).", it: "Ciò che accadrebbe, e richieste cortesi." } },
  { id: "congPresente", en: "Present subjunctive", it: "Congiuntivo presente", why: { en: "After opinion, doubt, wish or emotion (penso che, voglio che).", it: "Dopo opinione, dubbio, desiderio (penso che…)." } },
];

const VERBS = [
  {
    inf: "parlare", gloss: { en: "to speak", it: "parlare" }, group: "regular",
    forms: {
      presente: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"],
      passatoProssimo: ["ho parlato", "hai parlato", "ha parlato", "abbiamo parlato", "avete parlato", "hanno parlato"],
      imperfetto: ["parlavo", "parlavi", "parlava", "parlavamo", "parlavate", "parlavano"],
      futuro: ["parlerò", "parlerai", "parlerà", "parleremo", "parlerete", "parleranno"],
      condizionale: ["parlerei", "parleresti", "parlerebbe", "parleremmo", "parlereste", "parlerebbero"],
      congPresente: ["parli", "parli", "parli", "parliamo", "parliate", "parlino"],
    },
  },
  {
    inf: "credere", gloss: { en: "to believe", it: "credere" }, group: "regular",
    forms: {
      presente: ["credo", "credi", "crede", "crediamo", "credete", "credono"],
      passatoProssimo: ["ho creduto", "hai creduto", "ha creduto", "abbiamo creduto", "avete creduto", "hanno creduto"],
      imperfetto: ["credevo", "credevi", "credeva", "credevamo", "credevate", "credevano"],
      futuro: ["crederò", "crederai", "crederà", "crederemo", "crederete", "crederanno"],
      condizionale: ["crederei", "crederesti", "crederebbe", "crederemmo", "credereste", "crederebbero"],
      congPresente: ["creda", "creda", "creda", "crediamo", "crediate", "credano"],
    },
  },
  {
    inf: "dormire", gloss: { en: "to sleep", it: "dormire" }, group: "regular",
    forms: {
      presente: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"],
      passatoProssimo: ["ho dormito", "hai dormito", "ha dormito", "abbiamo dormito", "avete dormito", "hanno dormito"],
      imperfetto: ["dormivo", "dormivi", "dormiva", "dormivamo", "dormivate", "dormivano"],
      futuro: ["dormirò", "dormirai", "dormirà", "dormiremo", "dormirete", "dormiranno"],
      condizionale: ["dormirei", "dormiresti", "dormirebbe", "dormiremmo", "dormireste", "dormirebbero"],
      congPresente: ["dorma", "dorma", "dorma", "dormiamo", "dormiate", "dormano"],
    },
  },
  {
    inf: "essere", gloss: { en: "to be", it: "essere" }, group: "aux",
    forms: {
      presente: ["sono", "sei", "è", "siamo", "siete", "sono"],
      passatoProssimo: ["sono stato", "sei stato", "è stato", "siamo stati", "siete stati", "sono stati"],
      imperfetto: ["ero", "eri", "era", "eravamo", "eravate", "erano"],
      futuro: ["sarò", "sarai", "sarà", "saremo", "sarete", "saranno"],
      condizionale: ["sarei", "saresti", "sarebbe", "saremmo", "sareste", "sarebbero"],
      congPresente: ["sia", "sia", "sia", "siamo", "siate", "siano"],
    },
  },
  {
    inf: "avere", gloss: { en: "to have", it: "avere" }, group: "aux",
    forms: {
      presente: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
      passatoProssimo: ["ho avuto", "hai avuto", "ha avuto", "abbiamo avuto", "avete avuto", "hanno avuto"],
      imperfetto: ["avevo", "avevi", "aveva", "avevamo", "avevate", "avevano"],
      futuro: ["avrò", "avrai", "avrà", "avremo", "avrete", "avranno"],
      condizionale: ["avrei", "avresti", "avrebbe", "avremmo", "avreste", "avrebbero"],
      congPresente: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"],
    },
  },
  {
    inf: "andare", gloss: { en: "to go", it: "andare" }, group: "irregular",
    forms: {
      presente: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
      passatoProssimo: ["sono andato", "sei andato", "è andato", "siamo andati", "siete andati", "sono andati"],
      imperfetto: ["andavo", "andavi", "andava", "andavamo", "andavate", "andavano"],
      futuro: ["andrò", "andrai", "andrà", "andremo", "andrete", "andranno"],
      condizionale: ["andrei", "andresti", "andrebbe", "andremmo", "andreste", "andrebbero"],
      congPresente: ["vada", "vada", "vada", "andiamo", "andiate", "vadano"],
    },
  },
  {
    inf: "fare", gloss: { en: "to do / make", it: "fare" }, group: "irregular",
    forms: {
      presente: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
      passatoProssimo: ["ho fatto", "hai fatto", "ha fatto", "abbiamo fatto", "avete fatto", "hanno fatto"],
      imperfetto: ["facevo", "facevi", "faceva", "facevamo", "facevate", "facevano"],
      futuro: ["farò", "farai", "farà", "faremo", "farete", "faranno"],
      condizionale: ["farei", "faresti", "farebbe", "faremmo", "fareste", "farebbero"],
      congPresente: ["faccia", "faccia", "faccia", "facciamo", "facciate", "facciano"],
    },
  },
  {
    inf: "venire", gloss: { en: "to come", it: "venire" }, group: "irregular",
    forms: {
      presente: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"],
      passatoProssimo: ["sono venuto", "sei venuto", "è venuto", "siamo venuti", "siete venuti", "sono venuti"],
      imperfetto: ["venivo", "venivi", "veniva", "venivamo", "venivate", "venivano"],
      futuro: ["verrò", "verrai", "verrà", "verremo", "verrete", "verranno"],
      condizionale: ["verrei", "verresti", "verrebbe", "verremmo", "verreste", "verrebbero"],
      congPresente: ["venga", "venga", "venga", "veniamo", "veniate", "vengano"],
    },
  },
  {
    inf: "stare", gloss: { en: "to stay / be", it: "stare" }, group: "irregular",
    forms: {
      presente: ["sto", "stai", "sta", "stiamo", "state", "stanno"],
      passatoProssimo: ["sono stato", "sei stato", "è stato", "siamo stati", "siete stati", "sono stati"],
      imperfetto: ["stavo", "stavi", "stava", "stavamo", "stavate", "stavano"],
      futuro: ["starò", "starai", "starà", "staremo", "starete", "staranno"],
      condizionale: ["starei", "staresti", "starebbe", "staremmo", "stareste", "starebbero"],
      congPresente: ["stia", "stia", "stia", "stiamo", "stiate", "stiano"],
    },
  },
  {
    inf: "potere", gloss: { en: "to be able / can", it: "potere" }, group: "modal",
    forms: {
      presente: ["posso", "puoi", "può", "possiamo", "potete", "possono"],
      passatoProssimo: ["ho potuto", "hai potuto", "ha potuto", "abbiamo potuto", "avete potuto", "hanno potuto"],
      imperfetto: ["potevo", "potevi", "poteva", "potevamo", "potevate", "potevano"],
      futuro: ["potrò", "potrai", "potrà", "potremo", "potrete", "potranno"],
      condizionale: ["potrei", "potresti", "potrebbe", "potremmo", "potreste", "potrebbero"],
      congPresente: ["possa", "possa", "possa", "possiamo", "possiate", "possano"],
    },
  },
  {
    inf: "volere", gloss: { en: "to want", it: "volere" }, group: "modal",
    forms: {
      presente: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
      passatoProssimo: ["ho voluto", "hai voluto", "ha voluto", "abbiamo voluto", "avete voluto", "hanno voluto"],
      imperfetto: ["volevo", "volevi", "voleva", "volevamo", "volevate", "volevano"],
      futuro: ["vorrò", "vorrai", "vorrà", "vorremo", "vorrete", "vorranno"],
      condizionale: ["vorrei", "vorresti", "vorrebbe", "vorremmo", "vorreste", "vorrebbero"],
      congPresente: ["voglia", "voglia", "voglia", "vogliamo", "vogliate", "vogliano"],
    },
  },
];

export const GROUPS = [
  { id: "regular", title: { en: "Regular verbs (-are / -ere / -ire)", it: "Verbi regolari" }, note: { en: "Drop the ending and add the pattern for its type. -are is the biggest family; some -ire verbs add -isc- (finisco) — not shown here.", it: "Togli la desinenza e aggiungi il modello del tipo." } },
  { id: "aux", title: { en: "The two helpers: essere & avere", it: "I due ausiliari: essere & avere" }, note: { en: "Both build the passato prossimo (most verbs take avere; movement/state verbs take essere, and then the participle agrees: è andata). Memorize them.", it: "Entrambi formano il passato prossimo." } },
  { id: "irregular", title: { en: "Common irregulars", it: "Irregolari comuni" }, note: { en: "High-frequency verbs that rewrite their stem — andare, fare, venire, stare. stare also drives the progressive (sto parlando).", it: "Verbi molto frequenti a radice irregolare." } },
  { id: "modal", title: { en: "Modal-type verbs", it: "Verbi modali" }, note: { en: "potere and volere take an infinitive after them (posso partire) and are irregular throughout.", it: "potere e volere sono seguiti da un infinito." } },
];

const itForEnGrammar = {
  trackId: "it-for-en",
  targetLang: "it",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples. Your progress here is tracked on its own and never touches your main level or streak.", it: "Pratica deliberata della coniugazione. I tuoi progressi sono tracciati a parte e non toccano il livello principale." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default itForEnGrammar;

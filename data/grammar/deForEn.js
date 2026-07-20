// #90/#3: Grammar gym content for de-for-en (German for English speakers).
// Companion to the #89 in-quiz training-wheel chips: deliberate practice of the
// conjugation grid. WALLED OFF like the Romance/CJK gyms — its own localStorage
// progress, never feeds the main XP/level/mastery tracker.
//
// SCHEMA NOTE: German verbs DO inflect for person, so the engine's "persons"
// axis is used straight (ich…sie/Sie), exactly like the Romance gyms. The six
// tenses cover the everyday spread an English speaker most confuses: Präsens,
// the spoken-past Perfekt (with its sein/haben split), the written Präteritum,
// the Plusquamperfekt, Futur I, and Konjunktiv II. Perfekt/Plusquamperfekt and
// Futur are periphrastic, so the "form" is the full auxiliary+participle /
// werden+infinitive string a learner must produce. Konjunktiv II shows the
// synthetic one-word form where German actually prefers it (aux + modals +
// high-frequency strong verbs: wäre, hätte, würde, könnte, ginge, spräche,
// führe); weak verbs, whose synthetic K II collapses onto the Präteritum
// (machte = machte), take the standard würde-periphrasis instead.
//
// AI-authored; PENDING human native review before public (participle/aux choice
// and Konjunktiv II usage especially). Same schema as data/grammar/esForEn.js.

export const PERSONS = [
  { id: "ich", de: "ich", en: "I" },
  { id: "du", de: "du", en: "you" },
  { id: "er", de: "er / sie / es", en: "he / she / it" },
  { id: "wir", de: "wir", en: "we" },
  { id: "ihr", de: "ihr", en: "you all" },
  { id: "sie", de: "sie / Sie", en: "they / you (formal)" },
];

export const TENSES = [
  { id: "praesens", en: "Present", de: "Präsens", why: { en: "Habitual or current actions — and, with a time word, the near future (Ich komme morgen).", de: "Gewohnte oder aktuelle Handlungen." } },
  { id: "perfekt", en: "Perfect", de: "Perfekt", why: { en: "The everyday spoken past. Built with haben or sein + past participle — movement/change-of-state verbs take sein (ich bin gegangen).", de: "Die gesprochene Vergangenheit — haben/sein + Partizip II." } },
  { id: "praeteritum", en: "Simple past", de: "Präteritum", why: { en: "The narrative/written past, plus the everyday past of sein, haben and the modals (ich war, ich hatte, ich konnte).", de: "Die geschriebene Erzählvergangenheit; bei sein/haben/Modalverben auch gesprochen." } },
  { id: "plusquam", en: "Past perfect", de: "Plusquamperfekt", why: { en: "The past-before-the-past ('had done'). Same aux as the Perfekt, but in the Präteritum: hatte/war + participle.", de: "Die Vorvergangenheit — hatte/war + Partizip II." } },
  { id: "futur1", en: "Future", de: "Futur I", why: { en: "What will happen — werden + infinitive at the end of the clause.", de: "Was geschehen wird — werden + Infinitiv." } },
  { id: "konj2", en: "Konjunktiv II", de: "Konjunktiv II", why: { en: "Hypotheticals, polite requests and wishes ('would / were'): würde + infinitive, or the one-word form for aux, modals and common strong verbs (wäre, hätte, könnte, ginge).", de: "Irreales, höfliche Bitten und Wünsche — würde + Infinitiv oder die synthetische Form." } },
];

const VERBS = [
  {
    inf: "machen", gloss: { en: "to do / make", de: "machen" }, group: "weak",
    forms: {
      praesens: ["mache", "machst", "macht", "machen", "macht", "machen"],
      perfekt: ["habe gemacht", "hast gemacht", "hat gemacht", "haben gemacht", "habt gemacht", "haben gemacht"],
      praeteritum: ["machte", "machtest", "machte", "machten", "machtet", "machten"],
      plusquam: ["hatte gemacht", "hattest gemacht", "hatte gemacht", "hatten gemacht", "hattet gemacht", "hatten gemacht"],
      futur1: ["werde machen", "wirst machen", "wird machen", "werden machen", "werdet machen", "werden machen"],
      konj2: ["würde machen", "würdest machen", "würde machen", "würden machen", "würdet machen", "würden machen"],
    },
  },
  {
    inf: "spielen", gloss: { en: "to play", de: "spielen" }, group: "weak",
    forms: {
      praesens: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"],
      perfekt: ["habe gespielt", "hast gespielt", "hat gespielt", "haben gespielt", "habt gespielt", "haben gespielt"],
      praeteritum: ["spielte", "spieltest", "spielte", "spielten", "spieltet", "spielten"],
      plusquam: ["hatte gespielt", "hattest gespielt", "hatte gespielt", "hatten gespielt", "hattet gespielt", "hatten gespielt"],
      futur1: ["werde spielen", "wirst spielen", "wird spielen", "werden spielen", "werdet spielen", "werden spielen"],
      konj2: ["würde spielen", "würdest spielen", "würde spielen", "würden spielen", "würdet spielen", "würden spielen"],
    },
  },
  {
    inf: "arbeiten", gloss: { en: "to work", de: "arbeiten" }, group: "weak",
    forms: {
      praesens: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"],
      perfekt: ["habe gearbeitet", "hast gearbeitet", "hat gearbeitet", "haben gearbeitet", "habt gearbeitet", "haben gearbeitet"],
      praeteritum: ["arbeitete", "arbeitetest", "arbeitete", "arbeiteten", "arbeitetet", "arbeiteten"],
      plusquam: ["hatte gearbeitet", "hattest gearbeitet", "hatte gearbeitet", "hatten gearbeitet", "hattet gearbeitet", "hatten gearbeitet"],
      futur1: ["werde arbeiten", "wirst arbeiten", "wird arbeiten", "werden arbeiten", "werdet arbeiten", "werden arbeiten"],
      konj2: ["würde arbeiten", "würdest arbeiten", "würde arbeiten", "würden arbeiten", "würdet arbeiten", "würden arbeiten"],
    },
  },
  {
    inf: "gehen", gloss: { en: "to go", de: "gehen" }, group: "strong",
    forms: {
      praesens: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
      perfekt: ["bin gegangen", "bist gegangen", "ist gegangen", "sind gegangen", "seid gegangen", "sind gegangen"],
      praeteritum: ["ging", "gingst", "ging", "gingen", "gingt", "gingen"],
      plusquam: ["war gegangen", "warst gegangen", "war gegangen", "waren gegangen", "wart gegangen", "waren gegangen"],
      futur1: ["werde gehen", "wirst gehen", "wird gehen", "werden gehen", "werdet gehen", "werden gehen"],
      konj2: ["ginge", "gingest", "ginge", "gingen", "ginget", "gingen"],
    },
  },
  {
    inf: "sprechen", gloss: { en: "to speak", de: "sprechen" }, group: "strong",
    forms: {
      praesens: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"],
      perfekt: ["habe gesprochen", "hast gesprochen", "hat gesprochen", "haben gesprochen", "habt gesprochen", "haben gesprochen"],
      praeteritum: ["sprach", "sprachst", "sprach", "sprachen", "spracht", "sprachen"],
      plusquam: ["hatte gesprochen", "hattest gesprochen", "hatte gesprochen", "hatten gesprochen", "hattet gesprochen", "hatten gesprochen"],
      futur1: ["werde sprechen", "wirst sprechen", "wird sprechen", "werden sprechen", "werdet sprechen", "werden sprechen"],
      konj2: ["spräche", "sprächest", "spräche", "sprächen", "sprächet", "sprächen"],
    },
  },
  {
    inf: "fahren", gloss: { en: "to drive / travel", de: "fahren" }, group: "strong",
    forms: {
      praesens: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
      perfekt: ["bin gefahren", "bist gefahren", "ist gefahren", "sind gefahren", "seid gefahren", "sind gefahren"],
      praeteritum: ["fuhr", "fuhrst", "fuhr", "fuhren", "fuhrt", "fuhren"],
      plusquam: ["war gefahren", "warst gefahren", "war gefahren", "waren gefahren", "wart gefahren", "waren gefahren"],
      futur1: ["werde fahren", "wirst fahren", "wird fahren", "werden fahren", "werdet fahren", "werden fahren"],
      konj2: ["führe", "führest", "führe", "führen", "führet", "führen"],
    },
  },
  {
    inf: "sein", gloss: { en: "to be", de: "sein" }, group: "aux",
    forms: {
      praesens: ["bin", "bist", "ist", "sind", "seid", "sind"],
      perfekt: ["bin gewesen", "bist gewesen", "ist gewesen", "sind gewesen", "seid gewesen", "sind gewesen"],
      praeteritum: ["war", "warst", "war", "waren", "wart", "waren"],
      plusquam: ["war gewesen", "warst gewesen", "war gewesen", "waren gewesen", "wart gewesen", "waren gewesen"],
      futur1: ["werde sein", "wirst sein", "wird sein", "werden sein", "werdet sein", "werden sein"],
      konj2: ["wäre", "wärest", "wäre", "wären", "wäret", "wären"],
    },
  },
  {
    inf: "haben", gloss: { en: "to have", de: "haben" }, group: "aux",
    forms: {
      praesens: ["habe", "hast", "hat", "haben", "habt", "haben"],
      perfekt: ["habe gehabt", "hast gehabt", "hat gehabt", "haben gehabt", "habt gehabt", "haben gehabt"],
      praeteritum: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
      plusquam: ["hatte gehabt", "hattest gehabt", "hatte gehabt", "hatten gehabt", "hattet gehabt", "hatten gehabt"],
      futur1: ["werde haben", "wirst haben", "wird haben", "werden haben", "werdet haben", "werden haben"],
      konj2: ["hätte", "hättest", "hätte", "hätten", "hättet", "hätten"],
    },
  },
  {
    inf: "werden", gloss: { en: "to become", de: "werden" }, group: "aux",
    forms: {
      praesens: ["werde", "wirst", "wird", "werden", "werdet", "werden"],
      perfekt: ["bin geworden", "bist geworden", "ist geworden", "sind geworden", "seid geworden", "sind geworden"],
      praeteritum: ["wurde", "wurdest", "wurde", "wurden", "wurdet", "wurden"],
      plusquam: ["war geworden", "warst geworden", "war geworden", "waren geworden", "wart geworden", "waren geworden"],
      futur1: ["werde werden", "wirst werden", "wird werden", "werden werden", "werdet werden", "werden werden"],
      konj2: ["würde", "würdest", "würde", "würden", "würdet", "würden"],
    },
  },
  {
    inf: "können", gloss: { en: "can / to be able to", de: "können" }, group: "modal",
    forms: {
      praesens: ["kann", "kannst", "kann", "können", "könnt", "können"],
      perfekt: ["habe gekonnt", "hast gekonnt", "hat gekonnt", "haben gekonnt", "habt gekonnt", "haben gekonnt"],
      praeteritum: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
      plusquam: ["hatte gekonnt", "hattest gekonnt", "hatte gekonnt", "hatten gekonnt", "hattet gekonnt", "hatten gekonnt"],
      futur1: ["werde können", "wirst können", "wird können", "werden können", "werdet können", "werden können"],
      konj2: ["könnte", "könntest", "könnte", "könnten", "könntet", "könnten"],
    },
  },
  {
    inf: "wollen", gloss: { en: "to want", de: "wollen" }, group: "modal",
    forms: {
      praesens: ["will", "willst", "will", "wollen", "wollt", "wollen"],
      perfekt: ["habe gewollt", "hast gewollt", "hat gewollt", "haben gewollt", "habt gewollt", "haben gewollt"],
      praeteritum: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
      plusquam: ["hatte gewollt", "hattest gewollt", "hatte gewollt", "hatten gewollt", "hattet gewollt", "hatten gewollt"],
      futur1: ["werde wollen", "wirst wollen", "wird wollen", "werden wollen", "werdet wollen", "werden wollen"],
      konj2: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
    },
  },
];

export const GROUPS = [
  { id: "weak", title: { en: "Weak (regular) verbs", de: "Schwache Verben" }, note: { en: "The default pattern: a stable stem + regular endings. The Präteritum inserts -te- (machte), the participle is ge-…-t (gemacht). Stems ending in -t/-d add an extra -e- (arbeitest, arbeitete). Their synthetic Konjunktiv II is identical to the Präteritum, so German uses würde + infinitive instead.", de: "Der Standard: fester Stamm + regelmäßige Endungen; Präteritum mit -te-, Partizip ge-…-t." } },
  { id: "strong", title: { en: "Strong (irregular) verbs", de: "Starke Verben" }, note: { en: "The stem vowel changes: often already in the du/er present (sprechen → sprichst, fahren → fährst), and again in the Präteritum (ging, sprach, fuhr) and participle (-en: gegangen, gesprochen). Movement verbs like gehen/fahren build the Perfekt with sein. Their Konjunktiv II is a one-word umlauted form (ginge, spräche, führe).", de: "Der Stammvokal wechselt (Ablaut); Bewegungsverben bilden das Perfekt mit sein." } },
  { id: "aux", title: { en: "The auxiliaries: sein, haben & werden", de: "Die Hilfsverben: sein, haben & werden" }, note: { en: "The three engine verbs. haben/sein build the Perfekt and Plusquamperfekt; werden builds Futur I and the passive. All three are highly irregular and have one-word Konjunktiv II forms (wäre, hätte, würde) you'll use constantly — würde is itself the K II of werden.", de: "Die drei Trägerverben — haben/sein fürs Perfekt, werden fürs Futur und Passiv." } },
  { id: "modal", title: { en: "Modal verbs", de: "Modalverben" }, note: { en: "können, wollen and their kin take a bare infinitive at the end of the clause (Ich kann schwimmen). No umlaut in the singular present (ich kann, not *ich känn), and the Konjunktiv II mirrors the Präteritum vowel (konnte → könnte, but wollte = wollte).", de: "Modalverben stehen mit einem Infinitiv am Satzende; kein Umlaut im Präsens Singular." } },
];

const deForEnGrammar = {
  trackId: "de-for-en",
  targetLang: "de",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the tense drills Quick Quiz only samples, across German's six everyday tenses and the sein/haben split. Your progress here is tracked on its own and never touches your main level or streak.", de: "Gezieltes Konjugationstraining. Dein Fortschritt wird separat erfasst und berührt weder dein Hauptlevel noch deine Serie." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default deForEnGrammar;

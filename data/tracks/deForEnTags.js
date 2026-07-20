// Tag layer for deForEn (SquirreLingo de/ru tag pass, 2026-07-20, beta.15).
// Mirrors the Romance/CJK *Tags.js model (see esForEnTags.js / jaForEnTags.js):
// every item keeps its ONE home category; `themes` is a many-to-many filter
// layer the practice picker uses (category ∩ theme), and results still record to
// the home category (no separate theme mastery).
//
// `grammar`/`person` are the #89 training-wheel chips. German inflects for
// person for real (unlike ja/ko, where the second pill was repurposed as a
// politeness register), so `person` names the actual subject (ich…sie/Sie) and
// `grammar.tense` names the tense/mood being tested. Chips ride ONLY on items
// whose tested answer is a conjugated VERB form (Präsens, Perfekt, Konjunktiv,
// passive, modal+infinitive); case/article/adjective-ending items get themes
// only or nothing, since a person/tense chip doesn't apply to them.
//
// Keyed by PROMPT TEXT (whitespace-normalized), not positional id, so a future
// content splice that shifts indices does not orphan a tag. AI-authored;
// PENDING native review.

export const THEMES = [
  { id: "numbers-time", en: "Numbers, dates & time", de: "Zahlen & Zeit" },
  { id: "directions", en: "Directions", de: "Wegbeschreibung" },
  { id: "shopping", en: "Shopping", de: "Einkaufen" },
  { id: "restaurant", en: "Restaurant & food", de: "Essen & Restaurant" },
  { id: "travel", en: "Travel", de: "Reisen" },
  { id: "medical", en: "Medical & doctor", de: "Gesundheit" },
  { id: "small-talk", en: "Small talk", de: "Small Talk" },
  { id: "work", en: "Work & office", de: "Arbeit & Büro" },
  { id: "emotions", en: "Emotions", de: "Gefühle" },
];

// key (prompt text) -> { themes?: [id], grammar?: {tense,why}, person?: {en,de} }
const RAW = {
  // — vocab: theme tags —
  "'Hallo' bedeutet...": { themes: ["small-talk"] },
  "'Danke' bedeutet...": { themes: ["small-talk"] },
  "'Freund/Freundin' bedeutet...": { themes: ["small-talk"] },
  "'Arbeit' bedeutet...": { themes: ["work"] },
  "'Chef' bedeutet...": { themes: ["work"] },
  "'Wasser' bedeutet...": { themes: ["restaurant"] },
  "'Bitte' bedeutet...": { themes: ["small-talk"] },
  "'der Termin' bedeutet...": { themes: ["work"] },
  "'das Rathaus' bedeutet...": { themes: ["directions"] },
  "'der Feierabend' bedeutet...": { themes: ["work"] },
  "'die Schadenfreude' bedeutet...": { themes: ["emotions"] },
  "'sich fremdschämen' bedeutet...": { themes: ["emotions"] },
  "'Ja' bedeutet...": { themes: ["small-talk"] },
  "'Nein' bedeutet...": { themes: ["small-talk"] },
  "'das Brot' bedeutet...": { themes: ["restaurant"] },
  "'die Milch' bedeutet...": { themes: ["restaurant"] },
  "'der Tag' bedeutet...": { themes: ["numbers-time"] },
  "'die Zeit' bedeutet...": { themes: ["numbers-time"] },
  "'das Geld' bedeutet...": { themes: ["shopping"] },
  "'die Stadt' bedeutet...": { themes: ["travel"] },
  "'kaufen' bedeutet...": { themes: ["shopping"] },
  "'essen' bedeutet...": { themes: ["restaurant"] },
  "'müde' bedeutet...": { themes: ["emotions"] },
  "'die Straße' bedeutet...": { themes: ["directions"] },
  "'die Notiz' bedeutet...": { themes: ["work"] },
  "'die Marmelade' bedeutet...": { themes: ["restaurant"] },
  "'die Rente' bedeutet...": { themes: ["work"] },
  "'lustig' bedeutet...": { themes: ["emotions"] },
  "'bezahlen' bedeutet...": { themes: ["restaurant", "shopping"] },
  "'der Ausweis' bedeutet...": { themes: ["travel"] },
  "'die Krankenkasse' bedeutet...": { themes: ["medical"] },
  "'die Reise' bedeutet...": { themes: ["travel"] },
  "'sensibel' bedeutet...": { themes: ["emotions"] },
  "'blamieren' bedeutet...": { themes: ["emotions"] },
  "'das Fernweh' bedeutet...": { themes: ["travel", "emotions"] },
  "'die Torschlusspanik' bedeutet...": { themes: ["emotions"] },
  "'gemütlich' bedeutet...": { themes: ["emotions"] },
  "'der Kummerspeck' bedeutet...": { themes: ["emotions"] },
  "'das Sitzfleisch' bedeutet...": { themes: ["work"] },
  "'das Kopfkino' bedeutet...": { themes: ["emotions"] },
  "'die Geborgenheit' bedeutet...": { themes: ["emotions"] },
  "'der Weltschmerz' bedeutet...": { themes: ["emotions"] },
  "'die Sehnsucht' bedeutet...": { themes: ["emotions"] },
  "'die Panne' bedeutet...": { themes: ["travel"] },

  // — gram: #89 tense/person chips on conjugated-verb items —
  "Ich ___ Anna.": { grammar: { tense: { en: "Present", de: "Präsens" }, why: { en: "conjugating sein (to be) in the present", de: "Präsens von 'sein'" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Du ___ mein Freund.": { grammar: { tense: { en: "Present", de: "Präsens" }, why: { en: "the 'du' form of irregular sein", de: "die 'du'-Form von 'sein'" } }, person: { en: "du (2nd sing.)", de: "du" } },
  "Ich ___ ein Auto.": { grammar: { tense: { en: "Present", de: "Präsens" }, why: { en: "conjugating haben (to have) in the present", de: "Präsens von 'haben'" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Ich ___ heute arbeiten.": { grammar: { tense: { en: "Present (modal)", de: "Präsens (Modalverb)" }, why: { en: "the modal müssen sends the main verb to the end as an infinitive", de: "das Modalverb 'müssen'; Vollverb im Infinitiv am Ende" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Wir ___ nach Berlin.": { themes: ["travel"], grammar: { tense: { en: "Present", de: "Präsens" }, why: { en: "conjugating fahren (to travel by vehicle) in the present", de: "Präsens von 'fahren'" } }, person: { en: "wir (1st plur.)", de: "wir" } },
  "Ich habe das Buch ___.": { grammar: { tense: { en: "Perfect", de: "Perfekt" }, why: { en: "the past participle that closes a haben-Perfekt", de: "Partizip II im Perfekt mit 'haben'" } } },
  "Ich ___ gestern nach Berlin gefahren.": { themes: ["travel"], grammar: { tense: { en: "Perfect", de: "Perfekt" }, why: { en: "movement verbs build the Perfekt with sein, not haben", de: "Bewegungsverben bilden das Perfekt mit 'sein'" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Ich bleibe zu Hause, weil ich krank ___.": { grammar: { tense: { en: "Present (subordinate)", de: "Präsens (Nebensatz)" }, why: { en: "'weil' sends the conjugated verb to the very end", de: "'weil' schickt das finite Verb ans Satzende" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Wenn ich Zeit hätte, ___ ich kommen.": { grammar: { tense: { en: "Konjunktiv II", de: "Konjunktiv II" }, why: { en: "hypothetical main clause — würde + infinitive", de: "irrealer Hauptsatz: würde + Infinitiv" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Ich wünschte, ich ___ mehr Zeit.": { grammar: { tense: { en: "Konjunktiv II", de: "Konjunktiv II" }, why: { en: "unreal wish — haben's one-word subjunctive 'hätte'", de: "irrealer Wunsch: Einwortform 'hätte'" } }, person: { en: "ich (1st sing.)", de: "ich" } },
  "Der Brief wurde gestern ___.": { grammar: { tense: { en: "Passive (past)", de: "Passiv (Präteritum)" }, why: { en: "werden + past participle forms the passive", de: "Vorgangspassiv: werden + Partizip II" } } },
  "Das neue Haus ___ gerade gebaut.": { grammar: { tense: { en: "Passive (present)", de: "Passiv (Präsens)" }, why: { en: "present passive: wird + past participle", de: "Präsens-Passiv: wird + Partizip II" } } },
  "Er sagte, er ___ krank.": { grammar: { tense: { en: "Konjunktiv I", de: "Konjunktiv I" }, why: { en: "reported speech flags the claim as someone else's words", de: "indirekte Rede markiert fremde Aussage" } }, person: { en: "er (3rd sing.)", de: "er" } },
  "Er tut so, als ___ er reich.": { grammar: { tense: { en: "Konjunktiv II", de: "Konjunktiv II" }, why: { en: "'als' ('as if') takes Konjunktiv II right after it", de: "'als' (als ob) verlangt Konjunktiv II" } }, person: { en: "er (3rd sing.)", de: "er" } },
  "___ er das gewusst, wäre er nicht gekommen.": { grammar: { tense: { en: "Konjunktiv II (past)", de: "Konjunktiv II (Vergangenheit)" }, why: { en: "verb-first conditional dropping 'wenn' — Hätte er...", de: "uneingeleiteter Bedingungssatz mit Spitzenstellung" } }, person: { en: "er (3rd sing.)", de: "er" } },
  "Ich kann gut Deutsch ___.": { grammar: { tense: { en: "Modal + infinitive", de: "Modalverb + Infinitiv" }, why: { en: "after a modal the main verb stays an infinitive at the end", de: "nach Modalverb bleibt das Vollverb Infinitiv am Ende" } } },
  "___ du einen Kaffee?": { themes: ["restaurant"], grammar: { tense: { en: "Konjunktiv II (polite)", de: "Konjunktiv II (höflich)" }, why: { en: "'möchten' is the polite would-like form", de: "'möchten' als höfliche Wunschform" } }, person: { en: "du (2nd sing.)", de: "du" } },

  // — gram: topical case items get themes only —
  "Ich fahre mit ___ Bus.": { themes: ["travel"] },
  "Ich gehe in ___ Park.": { themes: ["directions"] },
  "Der Kaffee ist ___ als der Tee.": { themes: ["restaurant"] },

  // — trad: theme tags —
  "Translate: 'I'll keep my fingers crossed for you.'": { themes: ["emotions"] },
  "Translate: 'I don't understand a word of this.'": { themes: ["small-talk"] },
  "Translate: 'I don't care at all.'": { themes: ["emotions"] },
  "Translate: 'Don't buy a pig in a poke.'": { themes: ["shopping"] },
  "Translate: 'He kicked the bucket.' (informal, died)": { themes: ["medical"] },
  "Translate: 'Good morning.'": { themes: ["small-talk"] },
  "Translate: 'How are you?' (informal)": { themes: ["small-talk"] },
  "Translate: 'See you later!'": { themes: ["small-talk"] },
  "Translate: 'That's none of my business.'": { themes: ["small-talk"] },
  "Translate: 'You're pulling my leg.'": { themes: ["small-talk"] },
  "Translate: 'I have to overcome my weaker self.'": { themes: ["emotions"] },
  "Translate: 'That's the last straw!'": { themes: ["emotions"] },
  "Translate: 'Well, now we're in a fine mess.'": { themes: ["emotions"] },
  "Translate: 'Thank you very much.'": { themes: ["small-talk"] },
  "Translate: 'Excuse me.'": { themes: ["small-talk"] },
  "Translate: 'See you tomorrow!'": { themes: ["small-talk"] },
  "Translate: 'I'm sorry.' (apology)": { themes: ["small-talk"] },
  "Translate: 'What's your name?' (informal)": { themes: ["small-talk"] },
  "Translate: 'I don't know.'": { themes: ["small-talk"] },
  "Translate: 'Have a nice day!'": { themes: ["small-talk"] },
  "Translate: 'to have a lot on one's plate'": { themes: ["work"] },
  "Translate: 'to have money to burn'": { themes: ["shopping"] },
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes?, grammar?, person? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

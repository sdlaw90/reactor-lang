// #90/#3: Grammar gym content for ru-for-en (Russian for English speakers).
// Companion to the #89 in-quiz training-wheel chips: deliberate practice of the
// conjugation grid. WALLED OFF like the Romance/CJK gyms — its own localStorage
// progress, never feeds the main XP/level/mastery tracker.
//
// SCHEMA NOTE: Russian conjugates for person in the present and future but NOT
// in the PAST (the past inflects for gender/number instead: пошёл/пошла/пошли),
// so — like ja/ko excluding the te-form from their grids — the past tense is
// deliberately left OUT of this person-based grid; gender-in-the-past is drilled
// in the main gram deck. What IS person-based is the aspect system, which is the
// real heart of Russian verb morphology, so the three "tenses" here are the
// three person-conjugated paradigms: the imperfective PRESENT, the perfective
// SIMPLE FUTURE (a perfective verb's present-tense endings carry future meaning),
// and the imperfective COMPOUND FUTURE (буду + imperfective infinitive). Each
// verb is an aspect PAIR; the headword is the imperfective, and the perfective
// partner (often a prefix, sometimes suppletive) supplies the future-perfective
// row. Cyrillic-only, no romanization parenthetical — matching ruForEn.js, since
// Russian spelling is phonetic.
//
// AI-authored; PENDING human native review before public (aspect-partner choice
// and stress especially). Same engine schema as data/grammar/esForEn.js.

export const PERSONS = [
  { id: "ya", ru: "я", en: "I" },
  { id: "ty", ru: "ты", en: "you" },
  { id: "on", ru: "он / она", en: "he / she" },
  { id: "my", ru: "мы", en: "we" },
  { id: "vy", ru: "вы", en: "you all" },
  { id: "oni", ru: "они", en: "they" },
];

export const TENSES = [
  { id: "present", en: "Present (imperfective)", ru: "Настоящее", why: { en: "An action happening now, habitually, or repeatedly — only imperfective verbs have a present tense.", ru: "Действие сейчас, обычно или повторно — настоящее время есть только у несовершенного вида." } },
  { id: "futurePfv", en: "Future (perfective)", ru: "Будущее (соверш. вид)", why: { en: "A single, completed future action. A perfective verb's present-tense endings already mean the future (прочитаю = 'I will read [it through]').", ru: "Одно завершённое действие в будущем: настоящие окончания совершенного вида дают будущее значение." } },
  { id: "futureImpf", en: "Future (imperfective)", ru: "Будущее (несоверш. вид)", why: { en: "An ongoing or repeated future action — the compound future: conjugate буду and add the imperfective infinitive (буду читать = 'I will be reading').", ru: "Длительное или повторяющееся действие в будущем — сложное будущее: буду + инфинитив несовершенного вида." } },
];

const VERBS = [
  {
    inf: "читать / прочитать", gloss: { en: "to read", ru: "читать" }, group: "conj1",
    forms: {
      present: ["читаю", "читаешь", "читает", "читаем", "читаете", "читают"],
      futurePfv: ["прочитаю", "прочитаешь", "прочитает", "прочитаем", "прочитаете", "прочитают"],
      futureImpf: ["буду читать", "будешь читать", "будет читать", "будем читать", "будете читать", "будут читать"],
    },
  },
  {
    inf: "делать / сделать", gloss: { en: "to do / make", ru: "делать" }, group: "conj1",
    forms: {
      present: ["делаю", "делаешь", "делает", "делаем", "делаете", "делают"],
      futurePfv: ["сделаю", "сделаешь", "сделает", "сделаем", "сделаете", "сделают"],
      futureImpf: ["буду делать", "будешь делать", "будет делать", "будем делать", "будете делать", "будут делать"],
    },
  },
  {
    inf: "работать / поработать", gloss: { en: "to work", ru: "работать" }, group: "conj1",
    forms: {
      present: ["работаю", "работаешь", "работает", "работаем", "работаете", "работают"],
      futurePfv: ["поработаю", "поработаешь", "поработает", "поработаем", "поработаете", "поработают"],
      futureImpf: ["буду работать", "будешь работать", "будет работать", "будем работать", "будете работать", "будут работать"],
    },
  },
  {
    inf: "говорить / сказать", gloss: { en: "to speak / say", ru: "говорить" }, group: "conj2",
    forms: {
      present: ["говорю", "говоришь", "говорит", "говорим", "говорите", "говорят"],
      futurePfv: ["скажу", "скажешь", "скажет", "скажем", "скажете", "скажут"],
      futureImpf: ["буду говорить", "будешь говорить", "будет говорить", "будем говорить", "будете говорить", "будут говорить"],
    },
  },
  {
    inf: "смотреть / посмотреть", gloss: { en: "to watch / look", ru: "смотреть" }, group: "conj2",
    forms: {
      present: ["смотрю", "смотришь", "смотрит", "смотрим", "смотрите", "смотрят"],
      futurePfv: ["посмотрю", "посмотришь", "посмотрит", "посмотрим", "посмотрите", "посмотрят"],
      futureImpf: ["буду смотреть", "будешь смотреть", "будет смотреть", "будем смотреть", "будете смотреть", "будут смотреть"],
    },
  },
  {
    inf: "писать / написать", gloss: { en: "to write", ru: "писать" }, group: "mutation",
    forms: {
      present: ["пишу", "пишешь", "пишет", "пишем", "пишете", "пишут"],
      futurePfv: ["напишу", "напишешь", "напишет", "напишем", "напишете", "напишут"],
      futureImpf: ["буду писать", "будешь писать", "будет писать", "будем писать", "будете писать", "будут писать"],
    },
  },
  {
    inf: "покупать / купить", gloss: { en: "to buy", ru: "покупать" }, group: "mutation",
    forms: {
      present: ["покупаю", "покупаешь", "покупает", "покупаем", "покупаете", "покупают"],
      futurePfv: ["куплю", "купишь", "купит", "купим", "купите", "купят"],
      futureImpf: ["буду покупать", "будешь покупать", "будет покупать", "будем покупать", "будете покупать", "будут покупать"],
    },
  },
  {
    inf: "идти / пойти", gloss: { en: "to go (on foot)", ru: "идти" }, group: "irregular",
    forms: {
      present: ["иду", "идёшь", "идёт", "идём", "идёте", "идут"],
      futurePfv: ["пойду", "пойдёшь", "пойдёт", "пойдём", "пойдёте", "пойдут"],
      futureImpf: ["буду идти", "будешь идти", "будет идти", "будем идти", "будете идти", "будут идти"],
    },
  },
  {
    inf: "давать / дать", gloss: { en: "to give", ru: "давать" }, group: "irregular",
    forms: {
      present: ["даю", "даёшь", "даёт", "даём", "даёте", "дают"],
      futurePfv: ["дам", "дашь", "даст", "дадим", "дадите", "дадут"],
      futureImpf: ["буду давать", "будешь давать", "будет давать", "будем давать", "будете давать", "будут давать"],
    },
  },
];

export const GROUPS = [
  { id: "conj1", title: { en: "First conjugation (-ю / -ешь)", ru: "Первое спряжение" }, note: { en: "The big regular family: present endings -ю/-ешь/-ет/-ем/-ете/-ют on an unchanging stem (читаю, читаешь…). The perfective partner is usually a prefix (про-, с-, по-) added to the same stem, conjugating the same way for the future.", ru: "Регулярные глаголы на -ю/-ешь; совершенный вид обычно образуется приставкой." } },
  { id: "conj2", title: { en: "Second conjugation (-ю / -ишь)", ru: "Второе спряжение" }, note: { en: "The -и- family: endings -ю/-ишь/-ит/-им/-ите/-ят (говорю, говоришь…). говорить's perfective partner is the suppletive сказать (скажу) — a very common aspect pair to memorize whole.", ru: "Глаголы на -ишь; вид иногда образуется другим корнем (говорить — сказать)." } },
  { id: "mutation", title: { en: "Stem-changing verbs", ru: "Глаголы с чередованием" }, note: { en: "A consonant shifts in conjugation: писать → пишу (с→ш), and the perfective купить → куплю (an inserted -л- after labials, п→пл). The change is regular once you spot it, but it's a classic learner trap.", ru: "Согласная чередуется при спряжении: писать → пишу; купить → куплю." } },
  { id: "irregular", title: { en: "Irregular / suppletive", ru: "Неправильные глаголы" }, note: { en: "High-frequency verbs that rewrite their stem: идти → иду (perfective пойти → пойду), and дать with its unique endings (дам, дашь, даст, дадим, дадите, дадут). Learn these whole — they're everywhere.", ru: "Частотные глаголы с особым спряжением: идти → иду, дать → дам, дашь, даст…" } },
];

const ruForEnGrammar = {
  trackId: "ru-for-en",
  targetLang: "ru",
  nativeLang: "en",
  intro: { en: "Deliberate conjugation practice — the imperfective present against both futures, so the aspect pair sits side by side. Your progress here is tracked on its own and never touches your main level or streak.", ru: "Целенаправленная практика спряжения. Прогресс отслеживается отдельно и не влияет на основной уровень или серию." },
  persons: PERSONS,
  tenses: TENSES,
  groups: GROUPS,
  verbs: VERBS,
};

export default ruForEnGrammar;

// Tag layer for ruForEn (SquirreLingo de/ru tag pass, 2026-07-20, beta.15).
// Mirrors the Romance/CJK *Tags.js model (see esForEnTags.js / jaForEnTags.js):
// every item keeps its ONE home category; `themes` is a many-to-many filter
// layer the practice picker uses (category ∩ theme), and results still record to
// the home category (no separate theme mastery).
//
// `grammar`/`person` are the #89 training-wheel chips. Russian inflects for
// person in the present/future (unlike ja/ko's repurposed politeness pill), so
// `person` names the actual subject and `grammar.tense` names the tense, aspect
// or mood tested. Past-tense items instead agree by GENDER/NUMBER, so their
// `person` names the agreement target (она fem., они plur.) and `grammar`
// flags the past. Chips ride ONLY on items whose tested answer is a conjugated
// verb form, an aspect choice, or a mood particle; pure case/agreement drills
// get themes only or nothing. Cyrillic-only, no romanization, matching ruForEn.js.
//
// Keyed by PROMPT TEXT (whitespace-normalized), not positional id, so a future
// content splice that shifts indices does not orphan a tag. AI-authored;
// PENDING native review.

export const THEMES = [
  { id: "numbers-time", en: "Numbers, dates & time", ru: "Числа и время" },
  { id: "directions", en: "Directions", ru: "Направления" },
  { id: "shopping", en: "Shopping", ru: "Покупки" },
  { id: "restaurant", en: "Restaurant & food", ru: "Еда" },
  { id: "travel", en: "Travel", ru: "Путешествия" },
  { id: "medical", en: "Medical & doctor", ru: "Здоровье" },
  { id: "small-talk", en: "Small talk", ru: "Разговор" },
  { id: "work", en: "Work & office", ru: "Работа" },
  { id: "emotions", en: "Emotions", ru: "Эмоции" },
];

// key (prompt text) -> { themes?: [id], grammar?: {tense,why}, person?: {en,ru} }
const RAW = {
  // — vocab: theme tags —
  "'Привет' значит...": { themes: ["small-talk"] },
  "'Спасибо' значит...": { themes: ["small-talk"] },
  "'Вода' значит...": { themes: ["restaurant"] },
  "'Хлеб' значит...": { themes: ["restaurant"] },
  "'Друг/Подруга' значит...": { themes: ["small-talk"] },
  "'Работа' значит...": { themes: ["work"] },
  "'Магазин' значит...": { themes: ["shopping"] },
  "'Город' значит...": { themes: ["travel"] },
  "'Деньги' значит...": { themes: ["shopping"] },
  "'Часы' значит...": { themes: ["numbers-time"] },
  "'Неделя' значит...": { themes: ["numbers-time"] },
  "'Вокзал' значит...": { themes: ["travel"] },
  "'Душа' значит...": { themes: ["emotions"] },
  "'Успеть' значит...": { themes: ["numbers-time"] },
  "'Сутки' значит...": { themes: ["numbers-time"] },
  "'Тоска' значит...": { themes: ["emotions"] },
  "'молоко' значит...": { themes: ["restaurant"] },
  "'чай' значит...": { themes: ["restaurant"] },
  "'хорошо' значит...": { themes: ["small-talk"] },
  "'кабинет' значит...": { themes: ["work"] },
  "'улица' значит...": { themes: ["directions"] },
  "'погода' значит...": { themes: ["small-talk"] },
  "'машина' значит...": { themes: ["travel"] },
  "'завтрак' значит...": { themes: ["restaurant"] },
  "'врач' значит...": { themes: ["medical"] },
  "'оператор' значит...": { themes: ["work"] },
  "'кипяток' значит...": { themes: ["restaurant"] },
  "'успевать' значит...": { themes: ["numbers-time"] },
  "'родина' значит...": { themes: ["emotions"] },
  "'продукты' значит...": { themes: ["shopping"] },
  "'судьба' значит...": { themes: ["emotions"] },
  "'разлюбить' значит...": { themes: ["emotions"] },
  "'хамство' значит...": { themes: ["emotions"] },
  "'простор' значит...": { themes: ["emotions"] },
  "'воля' значит...": { themes: ["emotions"] },
  "'переживать' значит...": { themes: ["emotions"] },
  "'обида' значит...": { themes: ["emotions"] },
  "'терпеть' значит...": { themes: ["emotions"] },
  "'пробка' значит...": { themes: ["travel"] },
  "'надрыв' значит...": { themes: ["emotions"] },
  "'стушеваться' значит...": { themes: ["emotions"] },
  "'обломовщина' значит...": { themes: ["emotions"] },
  "'кураж' значит...": { themes: ["emotions"] },

  // — gram: #89 tense/aspect/person chips —
  "Я ___ по-русски. (speak)": { grammar: { tense: { en: "Present", ru: "Настоящее" }, why: { en: "conjugating говорить (2nd conj.) in the present", ru: "настоящее время глагола 'говорить'" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Она ___ домой.": { grammar: { tense: { en: "Past", ru: "Прошедшее" }, why: { en: "the past tense agrees with the subject's GENDER, not person (она → -ла)", ru: "прошедшее согласуется по роду: она → пошла" } }, person: { en: "она (fem.)", ru: "она" } },
  "Дети ___ домой. (went)": { grammar: { tense: { en: "Past", ru: "Прошедшее" }, why: { en: "the past tense agrees in NUMBER — a plural subject takes -и", ru: "прошедшее во множественном числе: -и" } }, person: { en: "они (plur.)", ru: "они" } },
  "Я ___ книгу вчера и закончил её.": { grammar: { tense: { en: "Perfective past", ru: "Прошедшее (сов. вид)" }, why: { en: "a finished action needs the perfective, not the imperfective past", ru: "завершённое действие — совершенный вид" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Завтра я ___ это письмо и отправлю его. (will write)": { grammar: { tense: { en: "Perfective future", ru: "Будущее (сов. вид)" }, why: { en: "a single completed future action — perfective present-form", ru: "одно завершённое действие в будущем" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Вчера я весь день ___ письма. (was writing)": { grammar: { tense: { en: "Imperfective past", ru: "Прошедшее (несов. вид)" }, why: { en: "an ongoing, unfinished process takes the imperfective past", ru: "длительный процесс — несовершенный вид" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Я ___.": { grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)" }, why: { en: "the -ся suffix turns the action back on the doer ('wash oneself')", ru: "суффикс -ся: действие на себя" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Урок ___ в девять часов. (begins)": { themes: ["numbers-time"], grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)" }, why: { en: "-ся makes it intransitive: the lesson begins on its own", ru: "-ся: непереходное 'начинается'" } } },
  "Дверь автоматически ___. (opens)": { grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)" }, why: { en: "no external agent → the reflexive -ся form", ru: "без деятеля — возвратная форма на -ся" } } },
  "Не ___ окно, на улице холодно! (don't open)": { grammar: { tense: { en: "Imperative (imperfective)", ru: "Повелительное (несов.)" }, why: { en: "negative commands normally take the imperfective imperative", ru: "запрет — несовершенный вид повелительного" } }, person: { en: "ты (2nd sing.)", ru: "ты" } },
  "Он начал ___ эту книгу вчера. (to read)": { grammar: { tense: { en: "Aspect (infinitive)", ru: "Вид (инфинитив)" }, why: { en: "phase verbs like начать require an imperfective infinitive", ru: "после 'начать' — инфинитив несовершенного вида" } } },
  "Я хочу, чтобы ты ___ домой пораньше. (would come)": { grammar: { tense: { en: "Subjunctive (чтобы)", ru: "Сослагательное (чтобы)" }, why: { en: "чтобы + a wish about someone else takes the past-tense (subjunctive) form", ru: "чтобы + желание о другом — форма прошедшего" } }, person: { en: "ты (2nd sing.)", ru: "ты" } },
  "Если бы у меня было время, я ___ пришёл.": { grammar: { tense: { en: "Conditional (бы)", ru: "Условное (бы)" }, why: { en: "the particle бы + past-tense verb builds the whole conditional", ru: "частица бы + прошедшее = условное наклонение" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Я обычно ___ на работу пешком.": { themes: ["work"], grammar: { tense: { en: "Motion verb (habitual)", ru: "Глагол движения (многокр.)" }, why: { en: "a habitual, repeated trip takes the multidirectional ходить", ru: "привычное движение — разнонаправленный 'ходить'" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Я обычно ___ на работу на машине. (go — by vehicle)": { themes: ["work", "travel"], grammar: { tense: { en: "Motion verb (by vehicle)", ru: "Глагол движения (транспорт)" }, why: { en: "going by vehicle uses ехать/ездить, not on-foot идти/ходить", ru: "на транспорте — 'ездить', не 'ходить'" } }, person: { en: "я (1st sing.)", ru: "я" } },
  "Поезд ___ в шесть часов. (arrives)": { themes: ["travel", "numbers-time"], grammar: { tense: { en: "Motion prefix (present)", ru: "Приставка движения" }, why: { en: "the prefix при- carries the meaning 'arrival'", ru: "приставка при- = прибытие" } } },

  // — gram: topical case items get themes only —
  "Я живу ___.": { themes: ["directions"] },
  "Я работаю на ___. (factory)": { themes: ["work"] },
  "Я иду в ___. (school — direction)": { themes: ["directions"] },
  "Я приехал из ___. (Russia)": { themes: ["travel"] },
  "Я родился в ___. (May)": { themes: ["numbers-time"] },
  "Мы говорим о ___. (the weather)": { themes: ["small-talk"] },
  "Я пью чай с ___. (sugar)": { themes: ["restaurant"] },
  "Мы встретимся через ___. (a week)": { themes: ["numbers-time"] },
  "Он хочет стать ___. (a doctor)": { themes: ["work"] },

  // — trad: theme tags —
  "Translate: 'Bon appétit!' (said before eating)": { themes: ["restaurant"] },
  "Translate: 'Good luck!' (lit. 'neither fluff nor feather')": { themes: ["small-talk"] },
  "Translate: 'Never mind / it's nothing serious.'": { themes: ["small-talk"] },
  "Translate: 'He made a fool of himself.'": { themes: ["emotions"] },
  "Translate: 'You're making a mountain out of a molehill.'": { themes: ["emotions"] },
  "Translate: 'I was scared stiff.'": { themes: ["emotions"] },
  "Translate: 'to do a job carelessly / half-heartedly'": { themes: ["work"] },
  "Translate: 'Starting is the scary part.' (proverb)": { themes: ["emotions"] },
  "Translate: 'to reinvent the wheel'": { themes: ["work"] },
  "Translate: 'Out of sight, out of mind.'": { themes: ["emotions"] },
  "Translate: 'Good morning!'": { themes: ["small-talk"] },
  "Translate: 'Happy birthday!'": { themes: ["small-talk"] },
  "Translate: 'Get well soon!'": { themes: ["medical"] },
  "Translate: 'Make yourself at home.'": { themes: ["small-talk"] },
  "Translate: 'Help yourself!' (to the food)": { themes: ["restaurant"] },
  "Translate: 'Cheers! / To your health!' (a toast)": { themes: ["restaurant"] },
  "Translate: 'Congratulations!'": { themes: ["small-talk"] },
  "Translate: 'Better late than never.'": { themes: ["numbers-time"] },
  "Translate: 'to make ends meet'": { themes: ["shopping"] },
  "Translate: 'to throw money down the drain'": { themes: ["shopping"] },
  "Translate: 'a storm in a teacup'": { themes: ["emotions"] },

  // ---- #88 theme coverage pass (2026-07-22, L4/E2 standardization; AI-authored, flag #41) ----
  "'фамилия' значит...": { themes: ["small-talk"] },
  "'нога' значит...": { themes: ["medical"] },
  "'рука' значит...": { themes: ["medical"] },
  "'яблоко' значит...": { themes: ["shopping"] },
  "'кофе' значит...": { themes: ["restaurant"] },
  "'ночь' значит...": { themes: ["numbers-time"] },
  "'голова' значит...": { themes: ["medical"] },
  "'рубашка' значит...": { themes: ["shopping"] },
  "'сыр' значит...": { themes: ["restaurant"] },
  "'кухня' значит...": { themes: ["restaurant"] },
  "'парк' значит...": { themes: ["directions"] },
  "'месяц' значит...": { themes: ["numbers-time"] },
  "'поезд' значит...": { themes: ["travel"] },
  "'больница' значит...": { themes: ["medical"] },
  "'цена' значит...": { themes: ["shopping"] },
  "'покупать' значит...": { themes: ["shopping"] },
  "'овощи' значит...": { themes: ["restaurant"] },
  "'самолёт' значит...": { themes: ["travel"] },
  "'здоровье' значит...": { themes: ["medical"] },
  "'скидка' значит...": { themes: ["shopping"] },
  "'перекрёсток' значит...": { themes: ["directions"] },
  "'упрямый' значит...": { themes: ["emotions"] },
  "'уют' значит...": { themes: ["emotions"] },
  "Translate: 'When pigs fly.' (i.e., never)": { themes: ["numbers-time"] },
  "Translate: 'to kill two birds with one stone'": { themes: ["work"] },
  "Translate: 'Speak of the devil.'": { themes: ["small-talk"] },
  "Translate: 'The early bird catches the worm.'": { themes: ["work"] },
  "Translate: 'to add fuel to the fire'": { themes: ["emotions"] },
  "Translate: 'Every cloud has a silver lining.'": { themes: ["emotions"] },
  "Translate: 'Long time no see!'": { themes: ["small-talk"] },
  "Translate: 'Have a good trip! / Bon voyage!'": { themes: ["travel"] },
  "Translate: 'Welcome!' (greeting a guest at the door)": { themes: ["small-talk"] },
  "Translate: 'Take care of yourself!'": { themes: ["small-talk"] },
  "Translate: 'Happy New Year!'": { themes: ["small-talk"] },
  "Translate: 'Have a nice day!'": { themes: ["small-talk"] },
  "Translate: 'You've got the wrong number.' (on the phone)": { themes: ["emotions", "small-talk"] },
  "Translate: 'No pain, no gain.' (you can't even pull a fish from a pond without effort)": { themes: ["work"] },
  "Translate: 'See you soon!'": { themes: ["small-talk"] },
  "Translate: 'Nice to meet you.'": { themes: ["small-talk"] },
  "Translate: 'Sorry to bother you.'": { themes: ["small-talk"] },
  "Translate: 'to be head over heels in love'": { themes: ["emotions"] },
  "Translate: 'hungry as a wolf'": { themes: ["restaurant"] },
  "Translate: 'to work like a horse' (to toil endlessly)": { themes: ["work"] },
  "Translate: 'to be rolling in money' (the hens won't peck it all)": { themes: ["shopping"] },
  "Translate: 'That's the crux of it!' (that's where the real reason lies)": { themes: ["emotions"] },
  "Translate: 'reluctantly / grudgingly' (with a heavy, gritted heart)": { themes: ["emotions"] },
};

const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const MAP = new Map(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

// Returns { themes?, grammar?, person? } for a prompt, or null if untagged.
export function tagFor(prompt) {
  if (!prompt) return null;
  return MAP.get(norm(prompt)) || null;
}

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
  { id: "numbers-time", en: "Numbers, dates & time", ru: "Числа и время", pt: "Números e tempo", fr: "Nombres, dates et heures", es: "Números y tiempo" },
  { id: "directions", en: "Directions", ru: "Направления", pt: "Direções", fr: "Directions", es: "Direcciones" },
  { id: "shopping", en: "Shopping", ru: "Покупки", pt: "Compras", fr: "Achats", es: "Compras" },
  { id: "restaurant", en: "Restaurant & food", ru: "Еда", pt: "Restaurante", fr: "Restaurant", es: "Restaurante" },
  { id: "travel", en: "Travel", ru: "Путешествия", pt: "Viagens", fr: "Voyages", es: "Viajes" },
  { id: "medical", en: "Medical & doctor", ru: "Здоровье", pt: "Saúde", fr: "Santé", es: "Salud" },
  { id: "small-talk", en: "Small talk", ru: "Разговор", pt: "Conversa", fr: "Conversation", es: "Conversación" },
  { id: "work", en: "Work & office", ru: "Работа", pt: "Trabalho", fr: "Travail", es: "Trabajo" },
  { id: "emotions", en: "Emotions", ru: "Эмоции", pt: "Emoções", fr: "Émotions", es: "Emociones" },
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
  "Я ___ по-русски. (speak)": { grammar: { tense: { en: "Present", ru: "Настоящее", es: "Presente", pt: "Presente", fr: "Présent" }, why: { en: "conjugating говорить (2nd conj.) in the present", ru: "настоящее время глагола 'говорить'", es: "conjugar говорить (2.ª conj.) en presente", pt: "conjugar говорить (2.ª conj.) no presente", fr: "conjuguer говорить (2e conj.) au présent" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Она ___ домой.": { grammar: { tense: { en: "Past", ru: "Прошедшее", es: "Pasado", pt: "Passado", fr: "Passé" }, why: { en: "the past tense agrees with the subject's GENDER, not person (она → -ла)", ru: "прошедшее согласуется по роду: она → пошла", es: "el pasado concuerda en GÉNERO con el sujeto, no en persona (она → -ла)", pt: "o passado concorda em GÊNERO com o sujeito, não em pessoa (она → -ла)", fr: "le passé s’accorde en GENRE avec le sujet, pas en personne (она → -ла)" } }, person: { en: "она (fem.)", ru: "она", es: "она (fem.)", pt: "она (fem.)", fr: "она (fém.)" } },
  "Дети ___ домой. (went)": { grammar: { tense: { en: "Past", ru: "Прошедшее", es: "Pasado", pt: "Passado", fr: "Passé" }, why: { en: "the past tense agrees in NUMBER — a plural subject takes -и", ru: "прошедшее во множественном числе: -и", es: "el pasado concuerda en NÚMERO — un sujeto plural lleva -и", pt: "o passado concorda em NÚMERO — um sujeito plural leva -и", fr: "le passé s’accorde en NOMBRE — un sujet pluriel prend -и" } }, person: { en: "они (plur.)", ru: "они", es: "они (plur.)", pt: "они (plur.)", fr: "они (plur.)" } },
  "Я ___ книгу вчера и закончил её.": { grammar: { tense: { en: "Perfective past", ru: "Прошедшее (сов. вид)", es: "Pasado perfectivo", pt: "Passado perfectivo", fr: "Passé perfectif" }, why: { en: "a finished action needs the perfective, not the imperfective past", ru: "завершённое действие — совершенный вид", es: "una acción acabada exige el perfectivo, no el pasado imperfectivo", pt: "uma ação concluída exige o perfectivo, não o passado imperfectivo", fr: "une action achevée exige le perfectif, pas le passé imperfectif" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Завтра я ___ это письмо и отправлю его. (will write)": { grammar: { tense: { en: "Perfective future", ru: "Будущее (сов. вид)", es: "Futuro perfectivo", pt: "Futuro perfectivo", fr: "Futur perfectif" }, why: { en: "a single completed future action — perfective present-form", ru: "одно завершённое действие в будущем", es: "una sola acción futura acabada — forma de presente perfectiva", pt: "uma única ação futura concluída — forma de presente perfectiva", fr: "une seule action future achevée — forme de présent perfective" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Вчера я весь день ___ письма. (was writing)": { grammar: { tense: { en: "Imperfective past", ru: "Прошедшее (несов. вид)", es: "Pasado imperfectivo", pt: "Passado imperfectivo", fr: "Passé imperfectif" }, why: { en: "an ongoing, unfinished process takes the imperfective past", ru: "длительный процесс — несовершенный вид", es: "un proceso en curso, inacabado, lleva el pasado imperfectivo", pt: "um processo em curso, inacabado, leva o passado imperfectivo", fr: "une action en cours, inachevée, prend le passé imperfectif" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Я ___.": { grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)", es: "Presente (reflexivo)", pt: "Presente (reflexivo)", fr: "Présent (pronominal)" }, why: { en: "the -ся suffix turns the action back on the doer ('wash oneself')", ru: "суффикс -ся: действие на себя", es: "el sufijo -ся devuelve la acción sobre el agente ('lavarse')", pt: "o sufixo -ся devolve a ação sobre o agente ('lavar-se')", fr: "le suffixe -ся ramène l’action sur l’agent (« se laver »)" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Урок ___ в девять часов. (begins)": { themes: ["numbers-time"], grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)", es: "Presente (reflexivo)", pt: "Presente (reflexivo)", fr: "Présent (pronominal)" }, why: { en: "-ся makes it intransitive: the lesson begins on its own", ru: "-ся: непереходное 'начинается'", es: "-ся lo vuelve intransitivo: la lección empieza sola", pt: "-ся torna-o intransitivo: a aula começa sozinha", fr: "-ся le rend intransitif : la leçon commence d’elle-même" } } },
  "Дверь автоматически ___. (opens)": { grammar: { tense: { en: "Present (reflexive)", ru: "Настоящее (возвратный)", es: "Presente (reflexivo)", pt: "Presente (reflexivo)", fr: "Présent (pronominal)" }, why: { en: "no external agent → the reflexive -ся form", ru: "без деятеля — возвратная форма на -ся", es: "sin agente externo → forma reflexiva en -ся", pt: "sem agente externo → forma reflexiva em -ся", fr: "sans agent externe → forme pronominale en -ся" } } },
  "Не ___ окно, на улице холодно! (don't open)": { grammar: { tense: { en: "Imperative (imperfective)", ru: "Повелительное (несов.)", es: "Imperativo (imperfectivo)", pt: "Imperativo (imperfectivo)", fr: "Impératif (imperfectif)" }, why: { en: "negative commands normally take the imperfective imperative", ru: "запрет — несовершенный вид повелительного", es: "las órdenes negativas llevan normalmente el imperativo imperfectivo", pt: "as ordens negativas levam normalmente o imperativo imperfectivo", fr: "les ordres négatifs prennent normalement l’impératif imperfectif" } }, person: { en: "ты (2nd sing.)", ru: "ты", es: "ты (2.ª pers. sing.)", pt: "ты (2.ª pess. sing.)", fr: "ты (2e pers. sing.)" } },
  "Он начал ___ эту книгу вчера. (to read)": { grammar: { tense: { en: "Aspect (infinitive)", ru: "Вид (инфинитив)", es: "Aspecto (infinitivo)", pt: "Aspecto (infinitivo)", fr: "Aspect (infinitif)" }, why: { en: "phase verbs like начать require an imperfective infinitive", ru: "после 'начать' — инфинитив несовершенного вида", es: "los verbos de fase como начать exigen un infinitivo imperfectivo", pt: "os verbos de fase como начать exigem um infinitivo imperfectivo", fr: "les verbes de phase comme начать exigent un infinitif imperfectif" } } },
  "Я хочу, чтобы ты ___ домой пораньше. (would come)": { grammar: { tense: { en: "Subjunctive (чтобы)", ru: "Сослагательное (чтобы)", es: "Subjuntivo (чтобы)", pt: "Subjuntivo (чтобы)", fr: "Subjonctif (чтобы)" }, why: { en: "чтобы + a wish about someone else takes the past-tense (subjunctive) form", ru: "чтобы + желание о другом — форма прошедшего", es: "чтобы + deseo sobre otra persona lleva la forma de pasado (subjuntiva)", pt: "чтобы + desejo sobre outra pessoa leva a forma de passado (subjuntiva)", fr: "чтобы + souhait à propos d’autrui prend la forme du passé (subjonctif)" } }, person: { en: "ты (2nd sing.)", ru: "ты", es: "ты (2.ª pers. sing.)", pt: "ты (2.ª pess. sing.)", fr: "ты (2e pers. sing.)" } },
  "Если бы у меня было время, я ___ пришёл.": { grammar: { tense: { en: "Conditional (бы)", ru: "Условное (бы)", es: "Condicional (бы)", pt: "Condicional (бы)", fr: "Conditionnel (бы)" }, why: { en: "the particle бы + past-tense verb builds the whole conditional", ru: "частица бы + прошедшее = условное наклонение", es: "la partícula бы + verbo en pasado forma todo el condicional", pt: "a partícula бы + verbo no passado forma todo o condicional", fr: "la particule бы + verbe au passé forme à elle seule le conditionnel" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Я обычно ___ на работу пешком.": { themes: ["work"], grammar: { tense: { en: "Motion verb (habitual)", ru: "Глагол движения (многокр.)", es: "Verbo de movimiento (habitual)", pt: "Verbo de movimento (habitual)", fr: "Verbe de mouvement (habituel)" }, why: { en: "a habitual, repeated trip takes the multidirectional ходить", ru: "привычное движение — разнонаправленный 'ходить'", es: "un trayecto habitual y repetido lleva el multidireccional ходить", pt: "um trajeto habitual e repetido leva o multidirecional ходить", fr: "un trajet habituel et répété prend le multidirectionnel ходить" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Я обычно ___ на работу на машине. (go — by vehicle)": { themes: ["work", "travel"], grammar: { tense: { en: "Motion verb (by vehicle)", ru: "Глагол движения (транспорт)", es: "Verbo de movimiento (en vehículo)", pt: "Verbo de movimento (de veículo)", fr: "Verbe de mouvement (en véhicule)" }, why: { en: "going by vehicle uses ехать/ездить, not on-foot идти/ходить", ru: "на транспорте — 'ездить', не 'ходить'", es: "ir en vehículo usa ехать/ездить, no идти/ходить a pie", pt: "ir de veículo usa ехать/ездить, não идти/ходить a pé", fr: "aller en véhicule emploie ехать/ездить, pas идти/ходить à pied" } }, person: { en: "я (1st sing.)", ru: "я", es: "я (1.ª pers. sing.)", pt: "я (1.ª pess. sing.)", fr: "я (1re pers. sing.)" } },
  "Поезд ___ в шесть часов. (arrives)": { themes: ["travel", "numbers-time"], grammar: { tense: { en: "Motion prefix (present)", ru: "Приставка движения", es: "Prefijo de movimiento (presente)", pt: "Prefixo de movimento (presente)", fr: "Préfixe de mouvement (présent)" }, why: { en: "the prefix при- carries the meaning 'arrival'", ru: "приставка при- = прибытие", es: "el prefijo при- aporta el sentido de 'llegada'", pt: "o prefixo при- traz o sentido de 'chegada'", fr: "le préfixe при- porte le sens de « arrivée »" } } },

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

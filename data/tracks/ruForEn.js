// Track: Russian, for an English speaker. Deepened 2026-07-14 (#38 pass):
// roughly doubled the curated deck across every category, extended to C1 and
// the track's first C2 content, added the promptNative English subtitle (slot
// 7) to every Russian-language vocab/gram prompt, and expanded the fono deck.
// Cyrillic is one symbol per sound (no multi-script juggling, no tones), so
// this needed zero architecture changes — same 7-slot pattern as every other
// track, just Cyrillic strings.
// Categories: vocab, gram (no articles, the 6-case system, verb aspect,
// gender in the past tense, number-case agreement, motion verbs), trad
// (idioms/proverbs), fono (akanye/vowel reduction, palatalization, final
// devoicing, stress), and the fvocab Word Bank.
// Word Bank (fvocab): built here from ../vocab/ruWords (188 words, A1–C2) via
// buildFrequencyBank + RU_FORMULAS (2026-07-14). ruWords excludes the curated
// vocab headwords. LOWERCASE headwords by design — ru teaches true
// orthography, so RU_FORMULAS does NOT capitalize (divergence from the es/fr
// default cap()). Cyrillic is phonetic → no romanization parenthetical and, at
// the TTS pass, no subReading (the ko pattern transfers; run voices:list for
// ru-RU FIRST and add ruForEn to VOICE_KEYED_TRACKS, voice-keyed from day one).

import { buildFrequencyBank } from "../../lib/frequencyVocab";
import WORDS from "../vocab/ruWords";

// Word Bank prompt formulas for the generator. Like KO/JA_FORMULAS, no
// auto-capitalization: the word is presented as-is (lowercase for common
// nouns). Recognition quotes the Russian word ('...' значит...); production
// quotes the English gloss (Как сказать '...' по-русски?).
const RU_FORMULAS = {
  recognitionPrompt: (w) => `'${w}' значит...`,
  recognitionNative: (w) => ({ en: `'${w}' means...` }),
  recognitionExplain: (w, g, noteEn) => ({
    en: `'${w}' means ${g}.${noteEn}`,
    es: `'${w}' significa ${g}.`,
  }),
  productionPrompt: (g) => `Как сказать '${g}' по-русски?`,
  productionNative: (g) => ({ en: `How do you say '${g}' in Russian?` }),
  productionExplain: (w, g, noteEn) => ({
    en: `'${g}' is '${w}'.${noteEn}`,
    es: `'${g}' se dice '${w}'.`,
  }),
};

const CATS = {
  vocab: { label: "Словарь", color: "#3DDBFF" },
  gram: { label: "Грамматика", color: "#FFB84D" },
  trad: { label: "Выражения", color: "#FF3D7F" },
  fono: { label: "Фонетика", color: "#B98EFF" },
  fvocab: { label: "Лексика", color: "#7BE495" },
};

const BANK = {
  vocab: [
    // — A1 —
    ["'Привет' значит...", ["hi/hello (informal)", "goodbye", "please", "sorry"], 0,
      { en: "'Привет' is the standard informal greeting among friends — more formal situations use 'Здравствуйте' instead.", es: "'Привет' es el saludo informal estándar entre amigos — en situaciones más formales se usa 'Здравствуйте'." }, "A1", null,
      { en: "'Привет' means..." }],
    ["'Спасибо' значит...", ["thank you", "please", "you're welcome", "excuse me"], 0,
      { en: "'Спасибо' is thank you — one of the most essential words to know. It contracts from an old phrase 'спаси Бог' (God save [you]).", es: "'Спасибо' significa gracias — una de las palabras más esenciales. Viene de la antigua frase 'спаси Бог' (Dios [te] salve)." }, "A1", null,
      { en: "'Спасибо' means..." }],
    ["'Стол' значит...", ["table", "chair", "floor", "wall"], 0,
      { en: "'Стол' means table — a common everyday noun.", es: "'Стол' significa mesa — un sustantivo cotidiano común." }, "A1", null,
      { en: "'Стол' means..." }],
    ["'Вода' значит...", ["water", "fire", "air", "earth"], 0,
      { en: "'Вода' means water — note the stress is on the final syllable (va-DA), and the unstressed 'о' reduces to an \"ah\" sound.", es: "'Вода' significa agua — nota que el acento está en la última sílaba (va-DA), y la 'о' átona se reduce a un sonido \"ah\"." }, "A1", null,
      { en: "'Вода' means..." }],
    ["'Хлеб' значит...", ["bread", "milk", "salt", "meat"], 0,
      { en: "'Хлеб' means bread — culturally central enough that 'хлеб-соль' (bread and salt) is the traditional Russian gesture of hospitality to guests.", es: "'Хлеб' significa pan — tan central culturalmente que 'хлеб-соль' (pan y sal) es el gesto tradicional ruso de hospitalidad hacia los invitados." }, "A1", null,
      { en: "'Хлеб' means..." }],
    ["'Дом' значит...", ["house/home", "room", "street", "city"], 0,
      { en: "'Дом' covers both \"house\" (the building) and \"home\" — 'дома' means \"at home,\" and 'домой' means \"(to) home.\"", es: "'Дом' cubre tanto \"casa\" (el edificio) como \"hogar\" — 'дома' significa \"en casa,\" y 'домой' significa \"(hacia) casa.\"" }, "A1", null,
      { en: "'Дом' means..." }],
    ["'Друг/Подруга' значит...", ["friend (m/f)", "enemy", "stranger", "coworker"], 0,
      { en: "'Друг' (masculine)/'подруга' (feminine) means friend — 'друг' implies a genuinely close friend, closer than the casual English \"friend.\"", es: "'Друг' (masculino)/'подруга' (femenino) significa amigo/a — 'друг' implica un amigo genuinamente cercano, más que el casual \"friend\" del inglés." }, "A1", null,
      { en: "'Друг/Подруга' means..." }],
    // — A2 —
    ["'Окно' значит...", ["window", "door", "roof", "floor"], 0,
      { en: "'Окно' means window — it shares a root with 'око' (an archaic/poetic word for eye).", es: "'Окно' significa ventana — comparte raíz con 'око' (una palabra arcaica/poética para ojo)." }, "A2", null,
      { en: "'Окно' means..." }],
    ["'Семья' значит...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'Семья' means family.", es: "'Семья' significa familia." }, "A2", null,
      { en: "'Семья' means..." }],
    ["'Работа' значит...", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'Работа' means work or job (the noun); 'работать' is the verb \"to work.\" It shares a root with 'раб' (slave).", es: "'Работа' significa trabajo (el sustantivo); 'работать' es el verbo \"trabajar\". Comparte raíz con 'раб' (esclavo)." }, "A2", null,
      { en: "'Работа' means..." }],
    ["'Магазин' значит...", ["store/shop", "magazine", "market only", "warehouse"], 0,
      { en: "'Магазин' means a store or shop — interestingly, it and the French 'magasin' (also \"store\") both trace back to the same Arabic root, even though English \"magazine\" (the publication) went a different direction.", es: "'Магазин' significa tienda — curiosamente, esta palabra y el francés 'magasin' (también \"tienda\") vienen de la misma raíz árabe, aunque el inglés \"magazine\" (la publicación) tomó un camino distinto." }, "A2", null,
      { en: "'Магазин' means..." }],
    ["'Город' значит...", ["city/town", "country", "village", "region"], 0,
      { en: "'Город' means city or town — its old root '-град' survives in place names like Волгоград and Ленинград.", es: "'Город' significa ciudad — su antigua raíz '-град' sobrevive en topónimos como Волгоград y Ленинград." }, "A2", null,
      { en: "'Город' means..." }],
    ["'Деньги' значит...", ["money", "coins only", "wallet", "price"], 0,
      { en: "'Деньги' means money — like 'часы' (clock), it's grammatically plural-only, with no everyday singular form.", es: "'Деньги' significa dinero — como 'часы' (reloj), es gramaticalmente solo plural, sin forma singular cotidiana." }, "A2", null,
      { en: "'Деньги' means..." }],
    // — B1 —
    ["'Часы' значит...", ["clock/watch", "hour (singular)", "minute", "calendar"], 0,
      { en: "'Часы' (literally related to 'hours') is the everyday word for a clock or watch — it's grammatically plural-only, even referring to just one clock.", es: "'Часы' (literalmente relacionado con \"horas\") es la palabra cotidiana para reloj — es gramaticalmente solo plural, incluso al referirse a un solo reloj." }, "B1", null,
      { en: "'Часы' means..." }],
    ["'Неделя' значит...", ["week", "Sunday only", "weekend", "month"], 0,
      { en: "'Неделя' means week — its root historically relates to \"not doing\" (a day of rest), but the word now just means the whole week.", es: "'Неделя' significa semana — su raíz históricamente se relaciona con \"no hacer\" (un día de descanso), pero la palabra ahora simplemente significa toda la semana." }, "B1", null,
      { en: "'Неделя' means..." }],
    ["'Бабушка' значит...", ["grandmother", "a headscarf", "old woman (rude)", "mother"], 0,
      { en: "'Бабушка' simply means grandmother in Russian. English borrowed it as \"babushka\" to mean a headscarf (from the way grandmothers traditionally wore one) — a meaning that doesn't exist in Russian itself.", es: "'Бабушка' simplemente significa abuela en ruso. El inglés lo tomó prestado como \"babushka\" para referirse a un pañuelo de cabeza — un significado que no existe en el ruso mismo." }, "B1", null,
      { en: "'Бабушка' means..." }],
    ["'Вокзал' значит...", ["main railway terminal", "any bus stop", "airport", "harbor"], 0,
      { en: "'Вокзал' is a major railway terminal (a small stop is 'станция'). By a popular account the word traces to London's Vauxhall station, which a Russian delegation visited in the 19th century.", es: "'Вокзал' es una terminal ferroviaria principal (una parada pequeña es 'станция'). Según un relato popular, la palabra viene de la estación Vauxhall de Londres, que una delegación rusa visitó en el siglo XIX." }, "B1", null,
      { en: "'Вокзал' means..." }],
    ["'Душа' значит...", ["soul", "shower", "body", "breath"], 0,
      { en: "'Душа' means soul — culturally central to Russian (as in 'русская душа', the Russian soul). Careful: with the stress shifted, 'душ' means a shower.", es: "'Душа' significa alma — central en la cultura rusa (como en 'русская душа', el alma rusa). Cuidado: con el acento cambiado, 'душ' significa ducha." }, "B1", null,
      { en: "'Душа' means..." }],
    // — B2 —
    ["'Мир' значит...", ["world AND peace (same word)", "war", "country", "planet only"], 0,
      { en: "A genuinely interesting case: 'мир' means both \"world\" and \"peace\" — the exact same word, with context deciding which sense applies.", es: "Un caso genuinamente interesante: 'мир' significa tanto \"mundo\" como \"paz\" — exactamente la misma palabra, y el contexto decide cuál sentido aplica." }, "B2", null,
      { en: "'Мир' means..." }],
    ["'Успеть' значит...", ["to make it in time", "to fail", "to hurry pointlessly", "to be late"], 0,
      { en: "'Успеть' means to manage to do something in time — a single perfective verb English needs a whole phrase for. 'Я успел на поезд' = \"I made it to the train (in time).\"", es: "'Успеть' significa lograr hacer algo a tiempo — un solo verbo perfectivo para el que el inglés necesita toda una frase. 'Я успел на поезд' = \"llegué al tren (a tiempo)\"." }, "B2", null,
      { en: "'Успеть' means..." }],
    ["'Сутки' значит...", ["a full 24-hour day", "daytime only", "midnight", "a work shift"], 0,
      { en: "'Сутки' is a full day-and-night, a 24-hour period — one word for a concept English splits into \"day and night.\" It's plural-only, so \"two days\" of this kind is 'двое суток'.", es: "'Сутки' es un día completo (día y noche), un período de 24 horas — una palabra para un concepto que el inglés divide en \"día y noche\". Es solo plural, así que \"dos días\" de este tipo es 'двое суток'." }, "B2", null,
      { en: "'Сутки' means..." }],
    ["'Подвиг' значит...", ["a heroic feat", "a small favor", "a mistake", "a journey"], 0,
      { en: "'Подвиг' is a heroic deed or feat of self-sacrifice — a weightier word than English \"achievement,\" carrying a sense of moral courage.", es: "'Подвиг' es una hazaña heroica o acto de autosacrificio — una palabra de más peso que \"logro\" en inglés, con un sentido de coraje moral." }, "B2", null,
      { en: "'Подвиг' means..." }],
    // — C1 —
    ["'Тоска' значит...", ["deep melancholic yearning", "boredom (mild)", "anger", "tiredness"], 0,
      { en: "'Тоска' is a deep spiritual anguish or aching yearning, often without a specific cause — famously called untranslatable (Nabokov spent a paragraph on it). \"Melancholy\" and \"yearning\" each catch only part of it.", es: "'Тоска' es una angustia espiritual profunda o un anhelo doloroso, a menudo sin causa específica — famosamente llamada intraducible (Nabokov le dedicó un párrafo). \"Melancolía\" y \"anhelo\" captan cada uno solo una parte." }, "C1", null,
      { en: "'Тоска' means..." }],
    ["'Авось' значит...", ["on the off-chance it works out", "definitely", "never", "carefully"], 0,
      { en: "'Авось' is a culturally loaded particle meaning \"maybe it'll work out\" — acting on hope rather than planning. 'Надеяться на авось' is to trust to luck instead of preparing.", es: "'Авось' es una partícula cargada culturalmente que significa \"quizás salga bien\" — actuar por esperanza en vez de planear. 'Надеяться на авось' es confiar en la suerte en lugar de prepararse." }, "C1", null,
      { en: "'Авось' means..." }],
    // — C2 —
    ["'Пошлость' значит...", ["self-satisfied vulgarity/banality", "politeness", "shyness", "honesty"], 0,
      { en: "'Пошлость' is a specific blend of vulgarity, triteness, and smug bad taste — banality that thinks itself refined. Nabokov held it up as essentially untranslatable; English \"vulgarity\" misses the self-satisfied pretension it implies.", es: "'Пошлость' es una mezcla específica de vulgaridad, trivialidad y mal gusto presumido — banalidad que se cree refinada. Nabokov la presentó como esencialmente intraducible; \"vulgaridad\" en inglés no capta la pretensión autocomplaciente que implica." }, "C2", null,
      { en: "'Пошлость' means..." }],
  ],
  gram: [
    // — A1 —
    ["Я студент. (\"I am a student.\")", ["✓ correct — Russian drops \"to be\" in the present", "missing the verb 'есть'", "missing 'быть'", "needs 'это'"], 0,
      { en: "Russian has no present-tense \"am/is/are\" — 'Я студент' is literally \"I student.\" The verb быть (to be) simply isn't used in the present.", es: "El ruso no tiene \"soy/es/son\" en presente — 'Я студент' es literalmente \"yo estudiante.\" El verbo быть (ser) simplemente no se usa en presente." }, "A1", null,
      { en: "I am a student. (Is anything missing?)" }],
    // — A2 —
    ["Книга на столе.", ["✓ correct — no article needed", "missing \"the\"", "missing \"a\"", "wrong preposition"], 0,
      { en: "Russian has no articles at all — no \"a/an/the.\" The same sentence can mean \"The book is on the table\" or \"A book is on the table\" depending purely on context.", es: "El ruso no tiene artículos en absoluto — no hay \"a/an/the.\" La misma oración puede significar \"El libro está en la mesa\" o \"Un libro está en la mesa\" según el contexto." }, "A2", null,
      { en: "The book is on the table. (Is anything missing?)" }],
    ["'Стол' — какого рода?", ["мужской — ends in a consonant", "женский (feminine)", "средний (neuter)", "нет рода (no gender)"], 0,
      { en: "Gender is usually readable from the ending: a consonant ending is normally masculine, '-а/-я' feminine, '-о/-е' neuter. 'Стол' ends in a consonant, so it's masculine.", es: "El género suele leerse por la terminación: consonante = normalmente masculino, '-а/-я' femenino, '-о/-е' neutro. 'Стол' termina en consonante, así que es masculino." }, "A2", null,
      { en: "What gender is 'стол' (table)?" }],
    // — B1 —
    ["Я читаю ___.", ["книгу", "книга", "книге", "книги"], 0,
      { en: "The direct object takes the accusative case — feminine 'книга' (nominative) becomes 'книгу' when it's the thing being read.", es: "El objeto directo lleva el caso acusativo — el femenino 'книга' (nominativo) se convierte en 'книгу' cuando es lo que se está leyendo." }, "B1", null,
      { en: "I'm reading a ___. (book)" }],
    ["Она ___ домой.", ["пошла", "пошёл", "пошли", "пойду"], 0,
      { en: "Past-tense verbs agree with the subject's gender — feminine 'она' (she) takes the '-ла' ending, 'пошла', not the masculine '-л' ending.", es: "Los verbos en pasado concuerdan con el género del sujeto — el femenino 'она' (ella) lleva la terminación '-ла', 'пошла', no la masculina '-л'." }, "B1", null,
      { en: "She ___ home. (went)" }],
    ["Я живу ___.", ["в Москве", "в Москва", "на Москве", "у Москвы"], 0,
      { en: "Location \"in\" a place uses 'в' plus the prepositional case — 'Москва' becomes 'Москве'.", es: "La ubicación \"en\" un lugar usa 'в' más el caso preposicional — 'Москва' se convierte en 'Москве'." }, "B1", null,
      { en: "I live ___. (in Moscow)" }],
    ["Я ___.", ["умываюсь", "умываю", "умывать", "умыл"], 0,
      { en: "The reflexive suffix '-ся' (attached to the verb) shows the action is done to oneself — \"I wash myself.\"", es: "El sufijo reflexivo '-ся' (unido al verbo) muestra que la acción se hace a uno mismo — \"me lavo\"." }, "B1", null,
      { en: "I wash myself." }],
    ["Я звоню ___ каждый день.", ["брату", "брата", "брат", "братом"], 0,
      { en: "The verb 'звонить' (to call) takes the dative — the indirect recipient of the call. Masculine 'брат' becomes 'брату'.", es: "El verbo 'звонить' (llamar) rige el dativo — el receptor indirecto de la llamada. El masculino 'брат' se convierte en 'брату'." }, "B1", null,
      { en: "I call my ___ every day. (brother — dative)" }],
    ["___ нравится этот город.", ["Мне", "Я", "Меня", "Мной"], 0,
      { en: "'Нравится' works backwards from English: the thing liked is the subject, and the person who likes it goes in the dative — 'Мне нравится' is literally \"to-me is-pleasing.\"", es: "'Нравится' funciona al revés del inglés: lo que gusta es el sujeto, y quien gusta va en dativo — 'Мне нравится' es literalmente \"a-mí es-agradable.\"" }, "B1", null,
      { en: "I like this city. (lit. 'to me this city is pleasing')" }],
    // — B2 —
    ["У меня нет ___.", ["денег", "деньги", "деньгам", "деньгами"], 0,
      { en: "Negation with 'нет' (there isn't/there's no) requires the genitive case — 'деньги' (money) becomes 'денег'.", es: "La negación con 'нет' (no hay) requiere el caso genitivo — 'деньги' (dinero) se convierte en 'денег'." }, "B2", null,
      { en: "I have no ___. (money)" }],
    ["Я ___ книгу вчера и закончил её.", ["прочитал", "читал", "читаю", "буду читать"], 0,
      { en: "Russian verbs come in aspect pairs: perfective (a completed action) vs. imperfective (an ongoing/repeated one). Since the reading was finished, the perfective 'прочитал' is needed, not the imperfective 'читал'.", es: "Los verbos rusos vienen en pares de aspecto: perfectivo (acción completada) vs. imperfectivo (en curso/repetida). Como la lectura terminó, se necesita el perfectivo 'прочитал', no el imperfectivo 'читал'." }, "B2", null,
      { en: "I ___ the book yesterday and finished it. (read)" }],
    ["Я пишу ___.", ["ручкой", "ручка", "ручку", "ручке"], 0,
      { en: "\"Writing with a pen\" uses the instrumental case, with no preposition needed — 'ручка' (pen) becomes 'ручкой'.", es: "\"Escribir con un bolígrafo\" usa el caso instrumental, sin preposición — 'ручка' (bolígrafo) se convierte en 'ручкой'." }, "B2", null,
      { en: "I write with a ___. (pen)" }],
    ["Книгу читает Анна.", ["✓ correct — still means \"Anna reads the book\"", "means something different", "grammatically incorrect", "means \"the book reads Anna\""], 0,
      { en: "Because Russian's case endings mark grammatical role directly, word order is much more flexible than in English — putting the object first doesn't change who's doing what to whom.", es: "Como las terminaciones de caso marcan directamente el papel gramatical, el orden de las palabras es mucho más flexible que en inglés — poner el objeto primero no cambia quién le hace qué a quién." }, "B2", null,
      { en: "Anna reads the book. (Does fronting the object change the meaning?)" }],
    ["У меня два ___.", ["брата", "брат", "братья", "братьев"], 0,
      { en: "The numbers 2, 3, and 4 are followed by the genitive SINGULAR — 'два брата', not 'два брат' or 'два братья'. It's one of Russian's most notorious number-agreement quirks.", es: "Los números 2, 3 y 4 van seguidos del genitivo SINGULAR — 'два брата', no 'два брат' ni 'два братья'. Es una de las rarezas de concordancia numérica más notorias del ruso." }, "B2", null,
      { en: "I have two ___. (brothers)" }],
    ["У меня пять ___.", ["братьев", "брата", "братья", "брат"], 0,
      { en: "From 5 upward, the number is followed by the genitive PLURAL — 'пять братьев'. So 2–4 take genitive singular but 5+ flips to genitive plural, the mirror-image trap to the previous item.", es: "Desde el 5 en adelante, el número va seguido del genitivo PLURAL — 'пять братьев'. Así, 2–4 llevan genitivo singular pero 5+ cambia a genitivo plural, la trampa espejo del ítem anterior." }, "B2", null,
      { en: "I have five ___. (brothers)" }],
    // — C1 —
    ["Я обычно ___ на работу пешком.", ["хожу", "иду", "шёл", "пойду"], 0,
      { en: "Russian splits \"to go\" into unidirectional 'идти' (one specific trip, now) and multidirectional 'ходить' (habitual/repeated). \"Usually\" signals a habit, so it's 'хожу', not the one-trip 'иду'.", es: "El ruso divide \"ir\" en unidireccional 'идти' (un viaje concreto, ahora) y multidireccional 'ходить' (habitual/repetido). \"Usualmente\" marca hábito, así que es 'хожу', no el 'иду' de un solo viaje." }, "C1", null,
      { en: "I usually ___ to work on foot. (habitual)" }],
    ["Я вижу ___.", ["студента", "студент", "студенту", "студентом"], 0,
      { en: "For masculine animate nouns, the accusative borrows the genitive form — 'студент' becomes 'студента' as a direct object. Inanimate masculines (стол → стол) don't change, which is why animacy matters grammatically here.", es: "Para sustantivos masculinos animados, el acusativo toma la forma del genitivo — 'студент' se vuelve 'студента' como objeto directo. Los masculinos inanimados (стол → стол) no cambian, por eso la animacidad importa gramaticalmente." }, "C1", null,
      { en: "I see the ___. (student — animate)" }],
    ["Если бы у меня было время, я ___ пришёл.", ["бы", "был", "буду", "же"], 0,
      { en: "The conditional/subjunctive is built with the particle 'бы' plus a past-tense verb — 'я бы пришёл' = \"I would come/have come.\" 'Бы' is the whole machinery; there's no separate conditional verb form.", es: "El condicional/subjuntivo se forma con la partícula 'бы' más un verbo en pasado — 'я бы пришёл' = \"yo vendría/habría venido.\" 'Бы' es toda la maquinaria; no hay una forma verbal condicional aparte." }, "C1", null,
      { en: "If I had time, I ___ come. (would)" }],
    // — C2 —
    ["___ книгу, он делал заметки.", ["Читая", "Читать", "Читал", "Прочитав"], 0,
      { en: "A деепричастие (verbal adverb/gerund) compresses a simultaneous action: imperfective 'читая' = \"while reading.\" The perfective 'прочитав' (\"having read\") would wrongly imply he finished before taking notes, not during.", es: "Un деепричастие (adverbio verbal/gerundio) comprime una acción simultánea: el imperfectivo 'читая' = \"mientras leía.\" El perfectivo 'прочитав' (\"habiendo leído\") implicaría erróneamente que terminó antes de tomar notas, no durante." }, "C2", null,
      { en: "___ the book, he took notes. (While reading)" }],
  ],
  trad: [
    // — A2 —
    ["Translate: 'Bon appétit!' (said before eating)", ["Приятного аппетита!", "Спасибо за еду!", "Очень вкусно было!", "Я хочу есть!"], 0,
      { en: "'Приятного аппетита!' is the standard set phrase said before a meal — literally \"of pleasant appetite,\" in the genitive, as a wish.", es: "'Приятного аппетита!' es la frase fija estándar que se dice antes de comer — literalmente \"de agradable apetito,\" en genitivo, como un deseo." }, "A2"],
    // — B1 —
    ["Translate: 'Good luck!' (lit. 'neither fluff nor feather')", ["Ни пуха ни пера!", "Желаю тебе удачи!", "Всего самого лучшего!", "Пусть всё получится!"], 0,
      { en: "'Ни пуха ни пера!' (literally \"neither down nor feather\") is the classic Russian good-luck wish — originally a hunters' charm. The traditional reply is the mock-rude 'К чёрту!' (\"to the devil!\").", es: "'Ни пуха ни пера!' (literalmente \"ni plumón ni pluma\") es el clásico deseo ruso de buena suerte — originalmente un amuleto de cazadores. La respuesta tradicional es el burlón 'К чёрту!' (\"¡al diablo!\")." }, "B1"],
    ["Translate: 'Never mind / it's nothing serious.'", ["Ничего страшного.", "Это большая беда.", "Всё очень плохо.", "Какой кошмар сейчас."], 0,
      { en: "'Ничего страшного' (literally \"nothing scary\") is the everyday way to brush off a mistake or apology — the Russian equivalent of \"no worries.\"", es: "'Ничего страшного' (literalmente \"nada aterrible\") es la forma cotidiana de restar importancia a un error o disculpa — el equivalente ruso de \"no pasa nada.\"" }, "B1"],
    ["Translate: 'He made a fool of himself.'", ["Он сел в лужу.", "Он выглядел глупо.", "Он опозорился полностью.", "Он смутился ужасно."], 0,
      { en: "\"Сесть в лужу\" (literally \"to sit in a puddle\") is the everyday Russian idiom for embarrassing yourself.", es: "\"Сесть в лужу\" (literalmente \"sentarse en un charco\") es el modismo ruso cotidiano para hacer el ridículo." }, "B1"],
    ["Translate: 'They're identical, like two peas in a pod.'", ["Они похожи как две капли воды.", "Они совсем одинаковые точно.", "Они близнецы почти полностью.", "Они выглядят идентично."], 0,
      { en: "Where English says \"two peas in a pod,\" Russian says \"two drops of water\" — \"как две капли воды\" is the standard idiom for being identical.", es: "Donde el inglés dice \"dos guisantes en una vaina,\" el ruso dice \"dos gotas de agua\" — \"как две капли воды\" es el modismo estándar para ser idénticos." }, "B1"],
    // — B2 —
    ["Translate: 'He's totally bullshitting/lying.'", ["Он вешает лапшу на уши.", "Он говорит неправду полностью.", "Он обманывает сильно.", "Он врёт постоянно."], 0,
      { en: "\"Вешать лапшу на уши\" (literally \"to hang noodles on someone's ears\") is a very common, colorful Russian idiom for deceiving someone.", es: "\"Вешать лапшу на уши\" (literalmente \"colgar fideos en las orejas\") es un modismo ruso muy común y colorido para engañar a alguien." }, "B2"],
    ["Translate: 'When pigs fly.' (i.e., never)", ["Когда рак на горе свистнет.", "Когда свиньи полетят.", "Никогда в жизни точно.", "Это невозможно совсем."], 0,
      { en: "Where English imagines flying pigs, Russian imagines a whistling crawfish on a mountain — \"когда рак на горе свистнет\" means the same \"that'll never happen.\"", es: "Donde el inglés imagina cerdos volando, el ruso imagina un cangrejo de río silbando en una montaña — \"когда рак на горе свистнет\" significa lo mismo, \"eso nunca pasará\"." }, "B2"],
    ["Translate: 'You're making a mountain out of a molehill.'", ["Ты делаешь из мухи слона.", "Ты преувеличиваешь сильно.", "Ты делаешь много шума.", "Ты слишком драматизируешь."], 0,
      { en: "Russian's version swaps a molehill for a fly and a mountain for an elephant — \"делать из мухи слона\" (to make an elephant out of a fly) means exaggerating something small.", es: "La versión rusa cambia el montículo por una mosca y la montaña por un elefante — \"делать из мухи слона\" (hacer un elefante de una mosca) significa exagerar algo pequeño." }, "B2"],
    ["Translate: 'I was scared stiff.'", ["Душа в пятки ушла.", "Я очень испугался сильно.", "Мне стало страшно жутко.", "Я весь задрожал сразу."], 0,
      { en: "\"Душа в пятки ушла\" (literally \"the soul went into the heels\") is a vivid Russian idiom for being scared stiff.", es: "\"Душа в пятки ушла\" (literalmente \"el alma se fue a los talones\") es un modismo ruso vívido para estar muerto de miedo." }, "B2"],
    ["Translate: 'He's just sitting around doing nothing.'", ["Он бьёт баклуши.", "Он ничего не делает совсем.", "Он сидит без дела.", "Он расслабляется полностью."], 0,
      { en: "\"Бить баклуши\" (literally \"to beat wooden blanks,\" from an old craft term) is the standard Russian idiom for being idle or twiddling one's thumbs.", es: "\"Бить баклуши\" (literalmente \"golpear tarugos de madera,\" de un antiguo término artesanal) es el modismo ruso estándar para estar ocioso." }, "B2"],
    ["Translate: 'to do a job carelessly / half-heartedly'", ["спустя рукава", "очень медленно всегда", "без всякого интереса", "кое-как и наспех"], 0,
      { en: "\"Спустя рукава\" (literally \"with sleeves rolled down\") means doing something sloppily — from the days of long sleeves that had to be rolled up to work properly. Its opposite is 'засучив рукава' (sleeves rolled up).", es: "\"Спустя рукава\" (literalmente \"con las mangas bajadas\") significa hacer algo con descuido — de la época de las mangas largas que había que subir para trabajar bien. Su opuesto es 'засучив рукава' (con las mangas subidas)." }, "B2"],
    ["Translate: 'Starting is the scary part.' (proverb)", ["Глаза боятся, а руки делают.", "Начало всегда самое трудное.", "Страх мешает начать дело.", "Труд всё в жизни побеждает."], 0,
      { en: "\"Глаза боятся, а руки делают\" (literally \"the eyes are afraid, but the hands do it\") is a much-loved proverb: a task looks daunting until you simply begin.", es: "\"Глаза боятся, а руки делают\" (literalmente \"los ojos temen, pero las manos lo hacen\") es un proverbio muy querido: una tarea parece abrumadora hasta que simplemente empiezas." }, "B2"],
    // — C1 —
    ["Translate: 'to reinvent the wheel'", ["изобретать велосипед", "делать лишнюю работу", "повторять старые ошибки", "тратить время впустую"], 0,
      { en: "Russian \"reinvents the bicycle\" rather than the wheel — 'изобретать велосипед' means wasting effort on something already solved.", es: "El ruso \"reinventa la bicicleta\" en vez de la rueda — 'изобретать велосипед' significa gastar esfuerzo en algo ya resuelto." }, "C1"],
    ["Translate: 'Out of sight, out of mind.'", ["С глаз долой — из сердца вон.", "Кого не видно, того забыл.", "Далеко от глаз, далеко от дум.", "Что не видишь, то не помнишь."], 0,
      { en: "\"С глаз долой — из сердца вон\" (literally \"out of the eyes — out of the heart\") is the fixed Russian proverb; note it locates forgetting in the heart, not the mind.", es: "\"С глаз долой — из сердца вон\" (literalmente \"fuera de los ojos — fuera del corazón\") es el proverbio ruso fijo; nota que ubica el olvido en el corazón, no en la mente." }, "C1"],
  ],
};

const FONO_BANK = [
  { text: "Как дела?", sound: "kahk dee-LAH?", difficulty: "A2",
    identify: { options: ["Как дела?", "Как тебя зовут?", "Как дома?", "Куда идёшь?"], correctIdx: 0,
      explain: { en: "A simple, extremely common everyday greeting phrase — \"how are things?\"", es: "Una frase de saludo cotidiana, simple y extremadamente común — \"¿cómo van las cosas?\"" } },
    respond: { options: ["Хорошо, спасибо!", "Это стоит дорого.", "Я не знаю точно.", "Он далеко живёт."], correctIdx: 0,
      explain: { en: "A question about how you're doing calls for a simple, friendly reply, like \"good, thanks!\"", es: "Una pregunta sobre cómo estás pide una respuesta simple y amistosa, como \"¡bien, gracias!\"" } } },
  { text: "Спасибо большое.", sound: "spa-SEE-buh bahl-SHOH-yeh", difficulty: "A2",
    identify: { options: ["Спасибо большое.", "Спасибо огромное.", "Пожалуйста большое.", "Спасибо тебе большое."], correctIdx: 0,
      explain: { en: "Notice the unstressed 'o' in 'большое' reduces toward an \"ah\" sound (\"bahl-SHOH-yeh\") — this vowel reduction, called akanye, is one of the most distinctive features of standard Russian pronunciation.", es: "Nota que la 'o' átona en 'большое' se reduce hacia un sonido \"ah\" (\"bahl-SHOH-yeh\") — esta reducción vocálica, llamada akanye, es uno de los rasgos más distintivos de la pronunciación rusa estándar." } },
    respond: { options: ["Пожалуйста!", "Это очень дорого.", "Не за что вовсе.", "Хорошо, договорились."], correctIdx: 0,
      explain: { en: "Being thanked warmly calls for the standard, simple \"you're welcome\" response.", es: "Que te agradezcan calurosamente pide la respuesta estándar y simple de \"de nada\"." } } },
  { text: "Очень приятно.", sound: "OH-chin' pree-YAHT-nuh", difficulty: "A2",
    identify: { options: ["Очень приятно.", "Очень интересно.", "Очень хорошо.", "Очень приятный."], correctIdx: 0,
      explain: { en: "The final unstressed 'о' in 'приятно' reduces toward a schwa-like \"uh\" sound, following the same vowel-reduction pattern (akanye) as 'большое'.", es: "La 'о' final átona en 'приятно' se reduce hacia un sonido tipo schwa \"uh\", siguiendo el mismo patrón de reducción vocálica (akanye) que 'большое'." } },
    respond: { options: ["Мне тоже очень приятно!", "Это стоит недорого.", "Я живу далеко отсюда.", "Спасибо, не надо."], correctIdx: 0,
      explain: { en: "Responding to \"nice to meet you\" calls for the natural mirrored reply, \"nice to meet you too!\"", es: "Responder a \"mucho gusto\" pide la respuesta natural reflejada, \"¡el gusto es mío también!\"" } } },
  { text: "Меня зовут Анна.", sound: "min-YAH zah-VOOT AH-nah", difficulty: "B1",
    identify: { options: ["Меня зовут Анна.", "Тебя зовут Анна.", "Меня зовут Анной.", "Меня зовут Анне."], correctIdx: 0,
      explain: { en: "Notice the soft, palatalized quality in 'меня' (\"min-YAH\") — many Russian consonants come in hard/soft pairs, and the soft versions have a subtle 'y'-like quality English consonants don't have.", es: "Nota la cualidad suave y palatalizada en 'меня' (\"min-YAH\") — muchas consonantes rusas vienen en pares duro/suave, y las versiones suaves tienen una cualidad sutil tipo 'y' que las inglesas no tienen." } },
    respond: { options: ["Очень приятно!", "Это очень далеко.", "Сколько это стоит?", "Я не понимаю тебя."], correctIdx: 0,
      explain: { en: "An introduction calls for the standard polite response, \"nice to meet you!\"", es: "Una presentación pide la respuesta estándar y cortés, \"¡mucho gusto!\"" } } },
  { text: "Что это?", sound: "SHTOH EH-tuh?", difficulty: "B1",
    identify: { options: ["Что это?", "Кто это?", "Где это?", "Чей это?"], correctIdx: 0,
      explain: { en: "'Что' is pronounced \"shto,\" NOT \"chto\" — the 'ч' is irregularly said as 'ш' here. It's one of the most common words in the language with a spelling-pronunciation mismatch (also in 'что-то', 'потому что').", es: "'Что' se pronuncia \"shto,\" NO \"chto\" — la 'ч' se dice irregularmente como 'ш' aquí. Es una de las palabras más comunes con desajuste entre ortografía y pronunciación (también en 'что-то', 'потому что')." } },
    respond: { options: ["Это книга.", "Меня зовут Иван.", "Мне очень приятно.", "Я живу здесь."], correctIdx: 0,
      explain: { en: "\"What is this?\" is answered by naming the thing — \"it's a book.\"", es: "\"¿Qué es esto?\" se responde nombrando la cosa — \"es un libro.\"" } } },
  { text: "Его зовут Иван.", sound: "yi-VOH zah-VOOT ee-VAHN", difficulty: "B2",
    identify: { options: ["Его зовут Иван.", "Его зовут Иваном.", "Её зовут Иван.", "Его звали Иван."], correctIdx: 0,
      explain: { en: "'Его' is pronounced \"yevo\" — the '-его/-ого' ending is systematically said with a 'v' sound despite the spelled 'г' (same in 'сегодня' → \"sevodnya,\" 'нового' → \"novovo\").", es: "'Его' se pronuncia \"yevo\" — la terminación '-его/-ого' se dice sistemáticamente con sonido 'v' pese a la 'г' escrita (igual en 'сегодня' → \"sevodnya,\" 'нового' → \"novovo\")." } },
    respond: { options: ["Очень приятно!", "Это очень дорого.", "Я не знаю адрес.", "Мне пора идти."], correctIdx: 0,
      explain: { en: "Being introduced to someone by name calls for the standard \"nice to meet you!\"", es: "Que te presenten a alguien por su nombre pide el estándar \"¡mucho gusto!\"" } } },
  { text: "Ты был там?", sound: "TY bill tahm?", difficulty: "B2",
    identify: { options: ["Ты был там?", "Ты бил там?", "Ти был там?", "Ты быль там?"], correctIdx: 0,
      explain: { en: "The vowel 'ы' in 'ты' is a hard, back unrounded vowel with no English equivalent — the tongue pulls back and down. It contrasts sharply with the soft, front 'и'; mixing them up changes words ('быть' to be vs 'бить' to hit).", es: "La vocal 'ы' en 'ты' es una vocal posterior, dura y no redondeada, sin equivalente en inglés — la lengua se retrae. Contrasta claramente con la 'и' suave y anterior; confundirlas cambia palabras ('быть' ser vs 'бить' golpear)." } },
    respond: { options: ["Да, был.", "Это очень вкусно.", "Спасибо большое.", "Мне всё равно."], correctIdx: 0,
      explain: { en: "A yes/no question (\"were you there?\") is naturally answered \"yes, I was.\"", es: "Una pregunta de sí/no (\"¿estuviste ahí?\") se responde naturalmente \"sí, estuve.\"" } } },
  { text: "Хлеб на столе.", sound: "khlyep na sta-LYEH", difficulty: "B2",
    identify: { options: ["Хлеб на столе.", "Хлеб на стуле.", "Хлеба на столе.", "Хлеб на полу."], correctIdx: 0,
      explain: { en: "The final 'б' of 'хлеб' devoices to \"p\" (\"khlyep\") — voiced consonants at the end of a word are always pronounced as their voiceless partners ('друг' → \"druk,\" 'город' → \"gorat\").", es: "La 'б' final de 'хлеб' se ensordece a \"p\" (\"khlyep\") — las consonantes sonoras al final de palabra siempre se pronuncian como sus pares sordas ('друг' → \"druk,\" 'город' → \"gorat\")." } },
    respond: { options: ["Да, свежий.", "Он очень занят.", "Сколько времени?", "Я тебя понимаю."], correctIdx: 0,
      explain: { en: "\"The bread is on the table\" is naturally met with a comment on the bread — \"yes, it's fresh.\"", es: "\"El pan está en la mesa\" recibe naturalmente un comentario sobre el pan — \"sí, está fresco.\"" } } },
  { text: "Я ищу работу.", sound: "ya ee-SHCHOO ra-BOH-tu", difficulty: "C1",
    identify: { options: ["Я ищу работу.", "Я ишу работу.", "Я исшу работу.", "Я ищю работу."], correctIdx: 0,
      explain: { en: "'Щ' is a long, soft \"shsh\" sound, clearly distinct from the hard 'ш'. Note the spelling 'ищу' is never 'ищю' — 'щ' is inherently soft, so the softening 'ю' would be redundant (the ЖИ/ШИ, ЧА/ЩА, ЧУ/ЩУ spelling rule).", es: "'Щ' es un sonido largo y suave \"shsh,\" claramente distinto de la 'ш' dura. Nota que 'ищу' nunca se escribe 'ищю' — 'щ' es intrínsecamente suave, así que la 'ю' suavizadora sería redundante (regla ortográfica ЖИ/ШИ, ЧА/ЩА, ЧУ/ЩУ)." } },
    respond: { options: ["Удачи в поиске!", "Это очень дёшево.", "Я живу в Москве.", "Спасибо, не хочу."], correctIdx: 0,
      explain: { en: "\"I'm looking for a job\" is naturally met with encouragement — \"good luck with the search!\"", es: "\"Estoy buscando trabajo\" recibe naturalmente ánimo — \"¡suerte con la búsqueda!\"" } } },
];

const ruForEn = {
  id: "ru-for-en",
  label: "Русский",
  nameEn: "Russian",
  nameEs: "Ruso",
  sublabel: "For English speakers · Russian",
  nativeLang: "en",
  targetLang: "ru",
  theme: "russia-frost",
  cats: CATS,
  bank: { ...BANK, fvocab: buildFrequencyBank(WORDS, { seed: 20260714, formulas: RU_FORMULAS }) },
  wbCatId: "fvocab",
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Прочитайте приблизительное произношение. Что это значит?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — какой ответ подходит?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default ruForEn;

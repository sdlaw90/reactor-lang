// Track: Russian, for an English speaker. Full depth (36 items). Cyrillic
// is just a different alphabet (one symbol per sound, no multi-script
// juggling, no tone system), so this needed zero architecture changes —
// same pattern as every Latin-script track, just Cyrillic strings.
// Categories: vocab (basics + interesting semantic points), gram (no
// articles at all, the 6-case system, verb aspect (perfective/imperfective),
// gender affecting past-tense agreement — the biggest structural features
// for an English speaker), trad (idioms), and fono (vowel reduction/akanye,
// palatalization, stress).

const CATS = {
  vocab: { label: "Словарь", color: "#3DDBFF" },
  gram: { label: "Грамматика", color: "#FFB84D" },
  trad: { label: "Выражения", color: "#FF3D7F" },
  fono: { label: "Фонетика", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Привет' значит...", ["hi/hello (informal)", "goodbye", "please", "sorry"], 0,
      { en: "'Привет' is the standard informal greeting among friends — more formal situations use 'Здравствуйте' instead.", es: "'Привет' es el saludo informal estándar entre amigos — en situaciones más formales se usa 'Здравствуйте'." }, "A1"],
    ["'Спасибо' значит...", ["thank you", "please", "you're welcome", "excuse me"], 0,
      { en: "'Спасибо' is thank you — one of the most essential words to know.", es: "'Спасибо' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'Стол' значит...", ["table", "chair", "floor", "wall"], 0,
      { en: "'Стол' means table — a common everyday noun.", es: "'Стол' significa mesa — un sustantivo cotidiano común." }, "A1"],
    ["'Окно' значит...", ["window", "door", "roof", "floor"], 0,
      { en: "'Окно' means window.", es: "'Окно' significa ventana." }, "A2"],
    ["'Семья' значит...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'Семья' means family.", es: "'Семья' significa familia." }, "A2"],
    ["'Работа' значит...", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'Работа' means work or job (the noun); 'работать' is the verb \"to work.\"", es: "'Работа' significa trabajo (el sustantivo); 'работать' es el verbo \"trabajar\"." }, "A2"],
    ["'Магазин' значит...", ["store/shop", "magazine", "market only", "warehouse"], 0,
      { en: "'Магазин' means a store or shop — interestingly, it and the French word 'magasin' (also \"store\") both trace back to the same Arabic root, even though English \"magazine\" (the publication) went a different direction.", es: "'Магазин' significa tienda — curiosamente, esta palabra y el francés 'magasin' (también \"tienda\") vienen de la misma raíz árabe, aunque el inglés \"magazine\" (la publicación) tomó un camino distinto." }, "A2"],
    ["'Часы' значит...", ["clock/watch", "hour (singular)", "minute", "calendar"], 0,
      { en: "'Часы' (literally related to 'hours') is the everyday word for a clock or watch — it's grammatically plural-only, even referring to just one clock.", es: "'Часы' (literalmente relacionado con \"horas\") es la palabra cotidiana para reloj — es gramaticalmente solo plural, incluso al referirse a un solo reloj." }, "B1"],
    ["'Неделя' значит...", ["week", "Sunday only", "weekend", "month"], 0,
      { en: "'Неделя' means week — its root historically relates to \"not doing\" (a day of rest), but the word now just means the whole week.", es: "'Неделя' significa semana — su raíz históricamente se relaciona con \"no hacer\" (un día de descanso), pero la palabra ahora simplemente significa toda la semana." }, "B1"],
    ["'Мир' значит...", ["world AND peace (same word)", "war", "country", "planet only"], 0,
      { en: "A genuinely interesting case: 'мир' means both \"world\" and \"peace\" — the exact same word, with context deciding which sense applies.", es: "Un caso genuinamente interesante: 'мир' significa tanto \"mundo\" como \"paz\" — exactamente la misma palabra, y el contexto decide cuál sentido aplica." }, "B2"],
    ["'Бабушка' значит...", ["grandmother", "a headscarf", "old woman (rude)", "mother"], 0,
      { en: "'Бабушка' simply means grandmother in Russian. English borrowed it as \"babushka\" to mean a headscarf (from the way grandmothers traditionally wore one) — a meaning that doesn't exist in Russian itself.", es: "'Бабушка' simplemente significa abuela en ruso. El inglés lo tomó prestado como \"babushka\" para referirse a un pañuelo de cabeza (por cómo las abuelas tradicionalmente lo usaban) — un significado que no existe en el ruso mismo." }, "B1"],
    ["'Друг/Подруга' значит...", ["friend (m/f)", "enemy", "stranger", "coworker"], 0,
      { en: "'Друг' (masculine)/'подруга' (feminine) means friend.", es: "'Друг' (masculino)/'подруга' (femenino) significa amigo/a." }, "A1"],
  ],
  gram: [
    ["Книга на столе.", ["✓ correct — no article needed", "missing \"the\"", "missing \"a\"", "wrong preposition"], 0,
      { en: "Russian has no articles at all — no \"a/an/the.\" The same sentence can mean \"The book is on the table\" or \"A book is on the table\" depending purely on context.", es: "El ruso no tiene artículos en absoluto — no hay \"a/an/the.\" La misma oración puede significar \"El libro está en la mesa\" o \"Un libro está en la mesa\" según el contexto." }, "A2"],
    ["Я читаю ___.", ["книгу", "книга", "книге", "книги"], 0,
      { en: "The direct object takes the accusative case — feminine 'книга' (nominative) becomes 'книгу' when it's the thing being read.", es: "El objeto directo lleva el caso acusativo — el femenino 'книга' (nominativo) se convierte en 'книгу' cuando es lo que se está leyendo." }, "B1"],
    ["У меня нет ___.", ["денег", "деньги", "деньгам", "деньгами"], 0,
      { en: "Negation with 'нет' (there isn't/there's no) requires the genitive case — 'деньги' (money) becomes 'денег'.", es: "La negación con 'нет' (no hay) requiere el caso genitivo — 'деньги' (dinero) se convierte en 'денег'." }, "B2"],
    ["Я ___ книгу вчера и закончил её.", ["прочитал", "читал", "читаю", "буду читать"], 0,
      { en: "Russian verbs come in aspect pairs: perfective (a completed action) vs. imperfective (an ongoing/repeated one). Since the reading was finished, the perfective 'прочитал' is needed, not the imperfective 'читал'.", es: "Los verbos rusos vienen en pares de aspecto: perfectivo (una acción completada) vs. imperfectivo (una en curso/repetida). Como la lectura terminó, se necesita el perfectivo 'прочитал', no el imperfectivo 'читал'." }, "B2"],
    ["Она ___ домой.", ["пошла", "пошёл", "пошли", "пойду"], 0,
      { en: "Past-tense verbs agree with the subject's gender — feminine 'она' (she) takes the '-ла' ending, 'пошла', not the masculine '-л' ending.", es: "Los verbos en pasado concuerdan con el género del sujeto — el femenino 'она' (ella) lleva la terminación '-ла', 'пошла', no la terminación masculina '-л'." }, "B1"],
    ["Я пишу ___.", ["ручкой", "ручка", "ручку", "ручке"], 0,
      { en: "\"Writing with a pen\" uses the instrumental case, with no preposition needed — 'ручка' (pen) becomes 'ручкой'.", es: "\"Escribir con un bolígrafo\" usa el caso instrumental, sin necesidad de preposición — 'ручка' (bolígrafo) se convierte en 'ручкой'." }, "B2"],
    ["Я живу ___.", ["в Москве", "в Москва", "на Москве", "у Москвы"], 0,
      { en: "Location \"in\" a place uses 'в' plus the prepositional case — 'Москва' becomes 'Москве'.", es: "La ubicación \"en\" un lugar usa 'в' más el caso preposicional — 'Москва' se convierte en 'Москве'." }, "B1"],
    ["Книгу читает Анна.", ["✓ correct — still means \"Anna reads the book\"", "means something different", "grammatically incorrect", "means \"the book reads Anna\""], 0,
      { en: "Because Russian's case endings mark grammatical role directly, word order is much more flexible than in English — putting the object first doesn't change who's doing what to whom.", es: "Como las terminaciones de caso del ruso marcan directamente el papel gramatical, el orden de las palabras es mucho más flexible que en inglés — poner el objeto primero no cambia quién le hace qué a quién." }, "B2"],
    ["Я ___.", ["умываюсь", "умываю", "умывать", "умыл"], 0,
      { en: "The reflexive suffix '-ся' (attached to the verb) shows the action is done to oneself — \"I wash myself.\"", es: "El sufijo reflexivo '-ся' (unido al verbo) muestra que la acción se hace a uno mismo — \"me lavo\"." }, "B1"],
  ],
  trad: [
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
    ["Translate: 'He made a fool of himself.'", ["Он сел в лужу.", "Он выглядел глупо.", "Он опозорился полностью.", "Он смутился ужасно."], 0,
      { en: "\"Сесть в лужу\" (literally \"to sit in a puddle\") is the everyday Russian idiom for embarrassing yourself.", es: "\"Сесть в лужу\" (literalmente \"sentarse en un charco\") es el modismo ruso cotidiano para hacer el ridículo." }, "B1"],
    ["Translate: 'They're identical, like two peas in a pod.'", ["Они похожи как две капли воды.", "Они совсем одинаковые точно.", "Они близнецы почти полностью.", "Они выглядят идентично."], 0,
      { en: "Where English says \"two peas in a pod,\" Russian says \"two drops of water\" — \"как две капли воды\" is the standard idiom for being identical.", es: "Donde el inglés dice \"dos guisantes en una vaina,\" el ruso dice \"dos gotas de agua\" — \"как две капли воды\" es el modismo estándar para ser idénticos." }, "B1"],
  ],
};

// Russian phonetics: unstressed 'o' reduces toward an "ah" sound (called
// akanye — one of the most distinctive features of standard Russian
// pronunciation), consonants can be "soft" (palatalized) or "hard", and
// stress is unpredictable and heavily shapes vowel quality. CAPS = stress.
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
  { text: "Меня зовут Анна.", sound: "min-YAH zah-VOOT AH-nah", difficulty: "B1",
    identify: { options: ["Меня зовут Анна.", "Тебя зовут Анна.", "Меня зовут Анной.", "Меня зовут Анне."], correctIdx: 0,
      explain: { en: "Notice the soft, palatalized quality in 'меня' (\"min-YAH\") — many Russian consonants come in hard/soft pairs, and the soft versions have a subtle 'y'-like quality English consonants don't have.", es: "Nota la cualidad suave y palatalizada en 'меня' (\"min-YAH\") — muchas consonantes rusas vienen en pares duro/suave, y las versiones suaves tienen una cualidad sutil tipo 'y' que las consonantes inglesas no tienen." } },
    respond: { options: ["Очень приятно!", "Это очень далеко.", "Сколько это стоит?", "Я не понимаю тебя."], correctIdx: 0,
      explain: { en: "An introduction calls for the standard polite response, \"nice to meet you!\"", es: "Una presentación pide la respuesta estándar y cortés, \"¡mucho gusto!\"" } } },
  { text: "Очень приятно.", sound: "OH-chin' pree-YAHT-nuh", difficulty: "A2",
    identify: { options: ["Очень приятно.", "Очень интересно.", "Очень хорошо.", "Очень приятный."], correctIdx: 0,
      explain: { en: "The final unstressed 'о' in 'приятно' also reduces (toward a schwa-like \"uh\" sound), following the same vowel-reduction pattern as 'большое' earlier.", es: "La 'о' final átona en 'приятно' también se reduce (hacia un sonido tipo schwa \"uh\"), siguiendo el mismo patrón de reducción vocálica que 'большое' antes." } },
    respond: { options: ["Мне тоже очень приятно!", "Это стоит недорого.", "Я живу далеко отсюда.", "Спасибо, не надо."], correctIdx: 0,
      explain: { en: "Responding to \"nice to meet you\" calls for the natural mirrored reply, \"nice to meet you too!\"", es: "Responder a \"mucho gusto\" pide la respuesta natural reflejada, \"¡el gusto es mío también!\"" } } },
];

const ruForEn = {
  id: "ru-for-en",
  label: "Русский",
  sublabel: "For English speakers · Russian",
  nativeLang: "en",
  targetLang: "ru",
  theme: "russia-frost",
  cats: CATS,
  bank: BANK,
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

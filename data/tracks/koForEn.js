// Track: Korean, for an English speaker. Full depth (36 items). Hangul +
// romanization shown together, per explicit design decision. Categories:
// vocab (basics + famous homophones + culturally rich words), gram (SOV
// order, particles marking grammatical role, adjectives conjugating like
// verbs with no linking "to be", elaborate honorific speech levels, no
// person/number conjugation), trad (idioms), and fono (batchim/final-
// consonant linking, consonant assimilation, tensification).

const CATS = {
  vocab: { label: "단어 (Daneo)", color: "#3DDBFF" },
  gram: { label: "문법 (Munbeop)", color: "#FFB84D" },
  trad: { label: "관용구 (Gwanyonggu)", color: "#FF3D7F" },
  fono: { label: "발음 (Bareum)", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'안녕하세요 (annyeonghaseyo)' means...", ["hello (polite)", "goodbye", "thank you", "please"], 0,
      { en: "'안녕하세요' is the standard polite greeting, usable any time of day.", es: "'안녕하세요' es el saludo cortés estándar, usable en cualquier momento del día." }, "A1"],
    ["'감사합니다 (gamsahamnida)' means...", ["thank you (formal)", "please", "sorry", "you're welcome"], 0,
      { en: "'감사합니다' is a formal thank you — one of the most essential phrases to know.", es: "'감사합니다' es un agradecimiento formal — una de las frases más esenciales." }, "A1"],
    ["'친구 (chingu)' means...", ["friend", "enemy", "neighbor", "coworker"], 0,
      { en: "'친구' means friend.", es: "'친구' significa amigo." }, "A1"],
    ["'창문 (changmun)' means...", ["window", "door", "wall", "floor"], 0,
      { en: "'창문' means window.", es: "'창문' significa ventana." }, "A2"],
    ["'가족 (gajok)' means...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'가족' means family.", es: "'가족' significa familia." }, "A2"],
    ["'일 (il)' means...", ["work/job", "vacation", "meeting", "salary"], 0,
      { en: "'일' means work or job — and, as a fun bit of trivia, the same word (from Sino-Korean roots) also means \"one\" and \"day\" depending on context.", es: "'일' significa trabajo — y, como dato curioso, la misma palabra (de raíces sino-coreanas) también significa \"uno\" y \"día\" según el contexto." }, "A2"],
    ["'눈치 (nunchi)' means...", ["social awareness/reading the room", "eyesight", "curiosity", "shyness"], 0,
      { en: "'눈치' (literally close to \"eye-measure\") is a culturally rich word for the social skill of reading a room and picking up on unspoken cues — no single clean English word covers it.", es: "'눈치' (literalmente cerca de \"medida del ojo\") es una palabra culturalmente rica para la habilidad social de leer una situación y captar señales no dichas — ninguna palabra única en inglés lo cubre bien." }, "B2"],
    ["'답답하다 (dapdaphada)' means...", ["to feel frustrated/stifled", "to feel excited", "to feel sleepy", "to feel hungry"], 0,
      { en: "'답답하다' describes that stifled, frustrated feeling when something (or someone) won't budge or make sense — a very commonly used everyday feeling word.", es: "'답답하다' describe esa sensación sofocante y frustrante cuando algo (o alguien) no cede o no tiene sentido — una palabra de sentimiento cotidiana muy usada." }, "B1"],
    ["'화이팅 (hwaiting)' means...", ["\"go for it!/you can do it!\"", "\"goodbye\"", "\"congratulations\"", "\"I'm sorry\""], 0,
      { en: "Borrowed from English \"fighting,\" '화이팅' is a common cheer of encouragement — shouted before an exam or exciting event, similar in spirit to Mandarin's '加油'.", es: "Prestado del inglés \"fighting,\" '화이팅' es una porra común de ánimo — se grita antes de un examen o evento emocionante, similar en espíritu al '加油' del mandarín." }, "B1"],
    ["'눈 (nun)' means...", ["eye OR snow (two different words, same sound)", "only eye", "only snow", "ear"], 0,
      { en: "A famous Korean homophone: '눈' can mean \"eye\" or \"snow\" — two completely unrelated words that happen to sound and even spell identically, with context sorting out which is meant.", es: "Un homófono coreano famoso: '눈' puede significar \"ojo\" o \"nieve\" — dos palabras completamente no relacionadas que suenan e incluso se escriben idénticamente, con el contexto aclarando cuál se quiere decir." }, "B1"],
    ["'배 (bae)' means...", ["stomach, boat, OR pear (three different words!)", "only stomach", "only boat", "only pear"], 0,
      { en: "An even more famous case: '배' covers three completely unrelated words — belly/stomach, boat/ship, and pear — all pronounced and spelled the same way.", es: "Un caso aún más famoso: '배' cubre tres palabras completamente no relacionadas — vientre/estómago, barco, y pera — todas pronunciadas y escritas de la misma manera." }, "B2"],
    ["'선생님 (seonsaengnim)' means...", ["teacher (respectful)", "student", "classmate", "principal"], 0,
      { en: "'선생님' means teacher, with the honorific suffix '님' attached — used respectfully in a way similar to Japanese 'sensei' or Mandarin 'lǎoshī'.", es: "'선생님' significa maestro/a, con el sufijo honorífico '님' añadido — usado respetuosamente de manera similar al 'sensei' japonés o 'lǎoshī' del mandarín." }, "B1"],
  ],
  gram: [
    ["저는 사과를 먹어요. (Jeoneun sagwareul meogeoyo.)", ["✓ correct — Subject-Object-Verb order", "incorrect word order", "wrong particle usage", "missing a word"], 0,
      { en: "Korean, like Japanese, is a Subject-Object-Verb (SOV) language — the verb always comes last.", es: "El coreano, como el japonés, es un idioma Sujeto-Objeto-Verbo (SOV) — el verbo siempre va al final." }, "A2"],
    ["저___ 학생이에요. (Jeo ___ hagsaeng-ieyo.)", ["는 (neun)", "이 (i)", "을 (eul)", "가 (ga)"], 0,
      { en: "'는' marks the topic of the sentence, attached after a vowel-ending word — one of Korean's grammatical particles showing a word's role, since word order alone doesn't.", es: "'는' marca el tema de la oración, unido después de una palabra terminada en vocal — una de las partículas gramaticales del coreano que muestran el papel de una palabra, ya que el orden por sí solo no lo hace." }, "A2"],
    ["사과___ 먹어요. (Sagwa ___ meogeoyo.)", ["를 (reul)", "는 (neun)", "이 (i)", "가 (ga)"], 0,
      { en: "'를' marks the direct object after a vowel-ending word — the thing being eaten.", es: "'를' marca el objeto directo después de una palabra terminada en vocal — la cosa que se está comiendo." }, "A2"],
    ["날씨___ 좋아요. (Nalssi ___ joayo.)", ["가 (ga)", "를 (reul)", "는 (neun)", "을 (eul)"], 0,
      { en: "'가' marks the grammatical subject after a vowel-ending word — here, the weather is what's good.", es: "'가' marca el sujeto gramatical después de una palabra terminada en vocal — aquí, el clima es lo que está bueno." }, "B1"],
    ["예뻐요. (Yeppeoyo.)", ["✓ correct — adjectives conjugate directly, no separate \"to be\" needed", "missing a linking verb", "wrong tense", "incomplete sentence"], 0,
      { en: "Korean adjectives (\"descriptive verbs\") conjugate directly on their own, without needing a separate \"to be\" verb the way English does — '예쁘다' (to be pretty) inflects just like an action verb would.", es: "Los adjetivos coreanos (\"verbos descriptivos\") se conjugan directamente por sí solos, sin necesitar un verbo \"ser/estar\" separado como en inglés — '예쁘다' (ser bonito) se flexiona igual que lo haría un verbo de acción." }, "B1"],
    ["드세요 (deuseyo) is the ___ form of 'to eat'.", ["polite/honorific", "casual/plain", "past tense", "negative"], 0,
      { en: "Korean has an elaborate system of speech levels built into verb endings — '드세요' is a respectful, honorific way to say \"eat,\" quite different from the plain '먹어'.", es: "El coreano tiene un sistema elaborado de niveles de habla integrado en las terminaciones verbales — '드세요' es una forma respetuosa y honorífica de decir \"comer,\" bastante distinta del llano '먹어'." }, "B2"],
    ["가요 (gayo) means...", ["✓ correct for I/you/he/she/we/they go (same form)", "only \"I go\"", "only \"they go\"", "only \"we go\""], 0,
      { en: "Like Japanese, Korean verbs don't conjugate for person or number at all — '가요' means \"go\" regardless of who's doing it.", es: "Como el japonés, los verbos coreanos no se conjugan en absoluto por persona o número — '가요' significa \"ir\" sin importar quién lo hace." }, "B1"],
    ["___ 가요. (___ gayo.)", ["안 (an)", "못 (mot)", "지 (ji)", "말 (mal)"], 0,
      { en: "'안' placed directly before the verb is the standard simple negation — \"don't go.\"", es: "'안' colocado directamente antes del verbo es la negación simple estándar — \"no voy\"." }, "B1"],
    ["가요? vs. 가요.", ["✓ correct — rising intonation alone can mark a question in casual speech", "these are always identical", "the question needs a different particle always", "this is grammatically impossible"], 0,
      { en: "In casual spoken Korean, a statement and a question can look identical in writing, with only rising intonation in speech distinguishing \"I'm going\" from \"are you going?\"", es: "En el coreano hablado casual, una afirmación y una pregunta pueden verse idénticas por escrito, con solo la entonación ascendente en el habla distinguiendo \"voy\" de \"¿vas?\"" }, "B2"],
  ],
  trad: [
    ["Translate: 'He knows a lot of people/is well-connected.'", ["그는 발이 넓어요.", "그는 사람이 많아요.", "그는 유명해요.", "그는 인기가 많아요."], 0,
      { en: "\"발이 넓다\" (literally \"to have wide feet\") is the standard Korean idiom for being well-connected socially.", es: "\"발이 넓다\" (literalmente \"tener pies anchos\") es el modismo coreano estándar para estar bien conectado socialmente." }, "B2"],
    ["Translate: 'She's very generous (with food/portions).'", ["그녀는 손이 커요.", "그녀는 마음이 좋아요.", "그녀는 착해요.", "그녀는 인심이 좋아요."], 0,
      { en: "\"손이 크다\" (literally \"to have big hands\") describes someone who's generous, especially known for serving big portions or giving generously.", es: "\"손이 크다\" (literalmente \"tener manos grandes\") describe a alguien generoso, especialmente conocido por servir porciones grandes o dar generosamente." }, "B2"],
    ["Translate: \"Don't count your chickens before they hatch.\"", ["김치국부터 마시지 마세요.", "너무 일찍 기대하지 마세요.", "미리 축하하지 마세요.", "확실하지 않은데 기대하지 마세요."], 0,
      { en: "\"김치국부터 마신다\" (literally \"to drink kimchi soup first,\" before the main dish even arrives) is the Korean idiom for assuming an outcome before it's certain.", es: "\"김치국부터 마신다\" (literalmente \"beber sopa de kimchi primero,\" antes de que llegue el plato principal) es el modismo coreano para asumir un resultado antes de que sea seguro." }, "B2"],
    ["Translate: 'That's an impossible task.'", ["하늘의 별 따기예요.", "너무 어려운 일이에요.", "불가능한 일이에요.", "정말 힘든 일이에요."], 0,
      { en: "\"하늘의 별 따기\" (literally \"picking a star from the sky\") is the standard Korean idiom for something impossibly difficult.", es: "\"하늘의 별 따기\" (literalmente \"recoger una estrella del cielo\") es el modismo coreano estándar para algo imposiblemente difícil." }, "B1"],
    ["Translate: 'I failed the exam.'", ["시험에서 미역국을 먹었어요.", "시험에서 떨어졌어요.", "시험을 잘 못 봤어요.", "시험 결과가 안 좋아요."], 0,
      { en: "\"미역국을 먹다\" (literally \"to eat seaweed soup\") is a colorful, distinctly Korean idiom for failing an exam.", es: "\"미역국을 먹다\" (literalmente \"comer sopa de algas\") es un modismo coreano colorido y distintivo para reprobar un examen." }, "B2"],
    ["Translate: 'He has high standards.'", ["그는 눈이 높아요.", "그는 까다로워요.", "그는 기준이 높아요.", "그는 완벽주의자예요."], 0,
      { en: "\"눈이 높다\" (literally \"to have high eyes\") is the everyday Korean idiom for having high standards, especially about people or things one chooses.", es: "\"눈이 높다\" (literalmente \"tener ojos altos\") es el modismo coreano cotidiano para tener estándares altos, especialmente sobre personas o cosas que uno elige." }, "B1"],
    ["Translate: 'He's blinded by love.'", ["콩깍지가 씌었어요.", "사랑에 눈이 멀었어요.", "너무 사랑에 빠졌어요.", "사랑 때문에 안 보여요."], 0,
      { en: "\"콩깍지가 씌었다\" (literally \"to have a bean pod shell over one's eyes\") is a vivid, distinctly Korean idiom for being blinded by love or infatuation.", es: "\"콩깍지가 씌었다\" (literalmente \"tener una vaina de frijol cubriendo los ojos\") es un modismo coreano vívido y distintivo para estar cegado por el amor." }, "B2"],
  ],
};

// Korean phonetics: batchim (a syllable's final consonant) links over onto
// the next syllable when it starts with a vowel (resyllabification),
// neighboring consonants can assimilate/tense each other, and syllable-final
// ㅎ often weakens or disappears before a vowel.
const FONO_BANK = [
  { text: "있어요. (Isseoyo.)", sound: "ee-SSEO-yo (not \"it-seo-yo\")", difficulty: "B1",
    identify: { options: ["있어요.", "없어요.", "이거예요.", "있었어요."], correctIdx: 0,
      explain: { en: "The batchim (final consonant) ㅆ of '있' links over to the vowel-starting syllable '어' that follows, producing \"ee-SSEO-yo\" rather than a choppy \"it-seo-yo.\"", es: "El batchim (consonante final) ㅆ de '있' se enlaza con la sílaba siguiente que empieza en vocal '어', produciendo \"ee-SSEO-yo\" en vez de un \"it-seo-yo\" entrecortado." } },
    respond: { options: ["다행이에요!", "얼마예요?", "어디예요?", "몇 시예요?"], correctIdx: 0,
      explain: { en: "Hearing something is available/exists calls for a relieved reaction, like \"what a relief!\"", es: "Escuchar que algo está disponible/existe pide una reacción de alivio, como \"¡qué alivio!\"" } } },
  { text: "한국어. (Hangugeo.)", sound: "han-GU-geo (batchim ㄱ links forward)", difficulty: "B1",
    identify: { options: ["한국어.", "한국인.", "한국말.", "한국사람."], correctIdx: 0,
      explain: { en: "The batchim ㄱ at the end of '국' links onto the following vowel-starting syllable '어', the same resyllabification pattern as '있어요'.", es: "El batchim ㄱ al final de '국' se enlaza con la siguiente sílaba que empieza en vocal '어', el mismo patrón de resilabificación que '있어요'." } },
    respond: { options: ["저도 배우고 있어요!", "그거 얼마예요?", "몇 시예요?", "어디에서 왔어요?"], correctIdx: 0,
      explain: { en: "A comment about the Korean language calls for a relatable response, like \"I'm learning it too!\"", es: "Un comentario sobre el idioma coreano pide una respuesta cercana, como \"¡yo también lo estoy aprendiendo!\"" } } },
  { text: "학교. (Hakgyo.)", sound: "hak-KYO (tensed consonant)", difficulty: "B2",
    identify: { options: ["학교.", "학생.", "학원.", "하교."], correctIdx: 0,
      explain: { en: "The ㄱ+ㄱ consonant cluster tenses into a harder, sharper sound (\"kk\") — a common pattern where neighboring consonants influence each other's pronunciation.", es: "El grupo consonántico ㄱ+ㄱ se tensa en un sonido más duro y agudo (\"kk\") — un patrón común donde las consonantes vecinas influyen en la pronunciación de la otra." } },
    respond: { options: ["몇 시에 가요?", "얼마나 걸려요?", "재미있어요?", "선생님은 어때요?"], correctIdx: 0,
      explain: { en: "Mentioning school naturally invites a practical follow-up question, like \"what time do you go?\"", es: "Mencionar la escuela invita naturalmente a una pregunta práctica de seguimiento, como \"¿a qué hora vas?\"" } } },
  { text: "좋아요. (Joayo.)", sound: "JOH-ah-yo (ㅎ weakens before the vowel)", difficulty: "A2",
    identify: { options: ["좋아요.", "좋아해요.", "조아요.", "좋았어요."], correctIdx: 0,
      explain: { en: "The batchim ㅎ in '좋' tends to weaken or disappear before the following vowel-starting syllable, softening the pronunciation rather than keeping a hard 'h' sound.", es: "El batchim ㅎ en '좋' tiende a debilitarse o desaparecer antes de la siguiente sílaba que empieza en vocal, suavizando la pronunciación en vez de mantener un sonido 'h' duro." } },
    respond: { options: ["저도 좋아해요!", "얼마예요?", "언제예요?", "누구예요?"], correctIdx: 0,
      explain: { en: "Someone saying they like something calls for a relatable, friendly response, like \"I like it too!\"", es: "Que alguien diga que le gusta algo pide una respuesta cercana y amistosa, como \"¡a mí también me gusta!\"" } } },
];

const koForEn = {
  id: "ko-for-en",
  label: "한국어",
  sublabel: "For English speakers · Korean",
  nativeLang: "en",
  targetLang: "ko",
  theme: "korea-hanbok",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Read the approximate pronunciation. What does it say?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — which response fits?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 35,
  extraQuestionTime: 35,
};

export default koForEn;

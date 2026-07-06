// Track: Japanese, for an English speaker. Full depth (36 items). Per
// explicit design decision: native script (kanji/hiragana) and romanization
// are shown TOGETHER in every prompt/option — embedded directly in the
// content strings, same as how every other track embeds parenthetical
// glosses. No engine changes needed. Categories: vocab (basics + versatile
// words with no clean English equivalent), gram (SOV word order, particles
// marking grammatical role, no person/number conjugation, i-adjectives vs.
// na-adjectives, politeness levels — the biggest structural departure of any
// track so far), trad (idioms), and fono (pitch accent, vowel devoicing,
// mora-timing).

const CATS = {
  vocab: { label: "単語 (Tango)", color: "#3DDBFF" },
  gram: { label: "文法 (Bunpou)", color: "#FFB84D" },
  trad: { label: "慣用句 (Kan'youku)", color: "#FF3D7F" },
  fono: { label: "発音 (Hatsuon)", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'こんにちは (konnichiwa)' means...", ["hello/good afternoon", "goodnight", "goodbye", "thank you"], 0,
      { en: "'こんにちは' is the standard daytime greeting, roughly \"good afternoon,\" used from late morning into the evening.", es: "'こんにちは' es el saludo diurno estándar, aproximadamente \"buenas tardes,\" usado desde media mañana hasta la noche." }, "A1"],
    ["'ありがとう (arigatou)' means...", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'ありがとう' is thank you — one of the most essential words to know.", es: "'ありがとう' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'友達 (tomodachi)' means...", ["friend", "enemy", "neighbor", "teacher"], 0,
      { en: "'友達' means friend.", es: "'友達' significa amigo." }, "A1"],
    ["'窓 (mado)' means...", ["window", "door", "wall", "floor"], 0,
      { en: "'窓' means window.", es: "'窓' significa ventana." }, "A2"],
    ["'家族 (kazoku)' means...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'家族' means family.", es: "'家族' significa familia." }, "A2"],
    ["'仕事 (shigoto)' means...", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'仕事' means work or job.", es: "'仕事' significa trabajo." }, "A2"],
    ["'先生 (sensei)' means...", ["teacher (also: doctor, master of a craft)", "student", "classmate", "principal"], 0,
      { en: "'先生' means teacher, but is used much more broadly than in English — doctors, lawyers, and masters of traditional arts are all addressed as 'sensei' too, as a term of respect.", es: "'先生' significa maestro/a, pero se usa mucho más ampliamente que en inglés — a médicos, abogados y maestros de artes tradicionales también se les llama 'sensei', como término de respeto." }, "B1"],
    ["'大丈夫 (daijoubu)' means...", ["\"it's okay/fine/no problem\"", "\"absolutely not\"", "\"I'm confused\"", "\"please wait\""], 0,
      { en: "'大丈夫' is an extremely common, versatile word with no single clean English equivalent — it covers \"I'm fine,\" \"that's okay,\" and \"no problem\" depending on context.", es: "'大丈夫' es una palabra extremadamente común y versátil sin un equivalente único claro en inglés — cubre \"estoy bien,\" \"está bien,\" y \"no hay problema\" según el contexto." }, "B1"],
    ["'高い (takai)' means...", ["expensive AND tall/high (same word)", "cheap", "short", "heavy"], 0,
      { en: "A genuinely interesting case: '高い' means both \"expensive\" and \"tall/high\" — the exact same word, with context deciding which sense applies.", es: "Un caso genuinamente interesante: '高い' significa tanto \"caro\" como \"alto\" — exactamente la misma palabra, y el contexto decide cuál sentido aplica." }, "B1"],
    ["'元気 (genki)' means...", ["healthy/energetic/well", "tired", "sick", "sleepy"], 0,
      { en: "'元気' means healthy, energetic, or well — used constantly in the common greeting \"元気ですか (genki desu ka)?\" (\"How are you?\").", es: "'元気' significa saludable, enérgico, o bien — usado constantemente en el saludo común \"元気ですか (genki desu ka)?\" (\"¿Cómo estás?\")." }, "B1"],
    ["'すみません (sumimasen)' means...", ["excuse me/sorry/thank you (all three)", "hello only", "goodbye only", "please only"], 0,
      { en: "Remarkably versatile: 'すみません' is used to apologize, to get someone's attention, AND to thank someone for their trouble — all with the same word.", es: "Notablemente versátil: 'すみません' se usa para disculparse, para llamar la atención de alguien, Y para agradecer a alguien por sus molestias — todo con la misma palabra." }, "B2"],
    ["'邪魔 (jama)' means...", ["in the way/a hindrance", "helpful", "quiet", "polite"], 0,
      { en: "'邪魔' means being in the way or a hindrance — used in the common phrase \"邪魔しないで\" (don't get in the way/don't bother me).", es: "'邪魔' significa estar en el camino o ser un estorbo — usado en la frase común \"邪魔しないで\" (no estorbes/no me molestes)." }, "B2"],
  ],
  gram: [
    ["私はりんごを食べます。(Watashi wa ringo wo tabemasu.)", ["✓ correct — Subject-Object-Verb order", "incorrect word order", "wrong particle usage", "missing a word"], 0,
      { en: "Japanese is a Subject-Object-Verb (SOV) language — the verb always comes last, a fundamentally different order than English's Subject-Verb-Object.", es: "El japonés es un idioma Sujeto-Objeto-Verbo (SOV) — el verbo siempre va al final, un orden fundamentalmente distinto al Sujeto-Verbo-Objeto del inglés." }, "A2"],
    ["私___学生です。(Watashi ___ gakusei desu.)", ["は (wa)", "が (ga)", "を (wo)", "に (ni)"], 0,
      { en: "'は' marks the topic of the sentence (\"as for me...\") — one of Japanese's grammatical particles that show a word's role, since word order alone doesn't.", es: "'は' marca el tema de la oración (\"en cuanto a mí...\") — una de las partículas gramaticales del japonés que muestran el papel de una palabra, ya que el orden de las palabras por sí solo no lo hace." }, "A2"],
    ["りんご___食べます。(Ringo ___ tabemasu.)", ["を (wo)", "は (wa)", "が (ga)", "に (ni)"], 0,
      { en: "'を' marks the direct object — the thing being eaten.", es: "'を' marca el objeto directo — la cosa que se está comiendo." }, "A2"],
    ["猫___好きです。(Neko ___ suki desu.)", ["が (ga)", "を (wo)", "は (wa)", "の (no)"], 0,
      { en: "A subtle but important point: '好き' (like) grammatically behaves like an adjective (\"likeable/pleasing\"), not a transitive verb — so the thing liked takes 'が', not 'を' as English speakers often expect.", es: "Un punto sutil pero importante: '好き' (gustar) gramaticalmente se comporta como un adjetivo (\"agradable\"), no un verbo transitivo — así que lo que gusta lleva 'が', no 'を' como los angloparlantes suelen esperar." }, "B1"],
    ["食べます (tabemasu) means...", ["✓ correct for I/you/he/she/we/they eat (same form)", "only \"I eat\"", "only \"they eat\"", "only \"we eat\""], 0,
      { en: "Japanese verbs don't conjugate for person or number at all — '食べます' means \"eat\" regardless of who's doing it; context and topic markers show who the subject is.", es: "Los verbos japoneses no se conjugan en absoluto por persona o número — '食べます' significa \"comer\" sin importar quién lo hace; el contexto y los marcadores de tema muestran quién es el sujeto." }, "B1"],
    ["きれい___花です。(Kirei ___ hana desu.)", ["な (na)", "い (i)", "の (no)", "だ (da)"], 0,
      { en: "'きれい' (pretty) is a \"na-adjective\" — this class of adjectives needs 'な' before a noun, unlike \"i-adjectives\" which attach directly.", es: "'きれい' (bonito) es un \"adjetivo-na\" — esta clase de adjetivos necesita 'な' antes de un sustantivo, a diferencia de los \"adjetivos-i\" que se unen directamente." }, "B2"],
    ["食べます (tabemasu) is the ___ form of 食べる (taberu).", ["polite", "plain/casual", "past tense", "negative"], 0,
      { en: "Japanese has distinct politeness levels built into verb conjugation itself — '食べます' is the polite form, '食べる' is the plain/casual dictionary form.", es: "El japonés tiene niveles de cortesía distintos integrados en la conjugación verbal misma — '食べます' es la forma cortés, '食べる' es la forma llana/casual de diccionario." }, "B1"],
    ["本 (hon) can mean...", ["\"book\" or \"books\" (no separate plural form)", "only \"book\" (singular)", "only \"books\" (plural)", "\"bookshelf\""], 0,
      { en: "Japanese nouns don't mark plural the way English does — '本' can mean one book or many, with context (or an optional counter word) clarifying quantity.", es: "Los sustantivos japoneses no marcan el plural como el inglés — '本' puede significar un libro o muchos, con el contexto (o una palabra contadora opcional) aclarando la cantidad." }, "B1"],
    ["元気です___? (Genki desu ___?)", ["か (ka)", "ね (ne)", "よ (yo)", "の (no)"], 0,
      { en: "The particle 'か' at the end of a sentence turns a statement into a question — Japanese doesn't need to invert word order like English does.", es: "La partícula 'か' al final de una oración convierte una afirmación en una pregunta — el japonés no necesita invertir el orden de las palabras como el inglés." }, "A2"],
  ],
  trad: [
    ["Translate: 'I'm swamped/extremely busy.'", ["猫の手も借りたい (Neko no te mo karitai)", "犬と遊びたい (Inu to asobitai)", "とても忙しいです (Totemo isogashii desu)", "時間がないです (Jikan ga nai desu)"], 0,
      { en: "\"猫の手も借りたい\" (literally \"I'd even want to borrow a cat's paws\") is a vivid Japanese idiom for being so busy you'd accept help from anyone, even a cat.", es: "\"猫の手も借りたい\" (literalmente \"querría pedir prestadas hasta las patas de un gato\") es un modismo japonés vívido para estar tan ocupado que aceptarías ayuda de cualquiera, incluso de un gato." }, "B2"],
    ["Translate: 'Even experts make mistakes.'", ["猿も木から落ちる (Saru mo ki kara ochiru)", "誰でも間違えます (Dare demo machigaemasu)", "完璧な人はいません (Kanpeki na hito wa imasen)", "失敗は誰にでもある (Shippai wa dare nidemo aru)"], 0,
      { en: "\"猿も木から落ちる\" (literally \"even monkeys fall from trees\") is the standard Japanese idiom for saying even experts can make mistakes.", es: "\"猿も木から落ちる\" (literalmente \"hasta los monos se caen de los árboles\") es el modismo japonés estándar para decir que hasta los expertos cometen errores." }, "B2"],
    ["Translate: 'He's really stubborn/inflexible.'", ["頭が固いです (Atama ga katai desu)", "考えが変わらないです (Kangae ga kawaranai desu)", "とても頑固です (Totemo ganko desu)", "意見を曲げないです (Iken wo magenai desu)"], 0,
      { en: "\"頭が固い\" (literally \"hard-headed\") is the everyday Japanese idiom for being stubborn or inflexible in one's thinking.", es: "\"頭が固い\" (literalmente \"cabeza dura\") es el modismo japonés cotidiano para ser terco o inflexible en el pensamiento." }, "B1"],
    ["Translate: 'Practicality over aesthetics.'", ["花より団子 (Hana yori dango)", "美しさより実用性 (Utsukushisa yori jitsuyousei)", "見た目より中身 (Mitame yori nakami)", "形より機能 (Katachi yori kinou)"], 0,
      { en: "\"花より団子\" (literally \"dumplings over flowers\") is a classic Japanese idiom for preferring substance and practicality over mere appearance.", es: "\"花より団子\" (literalmente \"bolas de arroz antes que flores\") es un modismo japonés clásico para preferir la sustancia y lo práctico sobre la mera apariencia." }, "B2"],
    ["Translate: 'Patience and perseverance pay off.'", ["石の上にも三年 (Ishi no ue nimo sannen)", "我慢すれば報われる (Gaman sureba mukuwareru)", "努力はいつか実る (Doryoku wa itsuka minoru)", "頑張れば成功する (Ganbareba seikou suru)"], 0,
      { en: "\"石の上にも三年\" (literally \"three years sitting on a stone\") — the idea being that even a cold stone will eventually warm up if you sit on it long enough — is the standard Japanese idiom for patience paying off.", es: "\"石の上にも三年\" (literalmente \"tres años sentado en una piedra\") — la idea es que hasta una piedra fría eventualmente se calienta si te sientas en ella lo suficiente — es el modismo japonés estándar para que la paciencia dé frutos." }, "B2"],
    ["Translate: 'To kill two birds with one stone.'", ["一石二鳥 (Isseki nichou)", "二羽の鳥を一度に (Niwa no tori wo ichido ni)", "一度に二つ達成 (Ichido ni futatsu tassei)", "同時に二つ解決 (Douji ni futatsu kaiketsu)"], 0,
      { en: "\"一石二鳥\" (literally \"one stone, two birds\") is the exact same idiom concept as English, likely borrowed from the same shared source.", es: "\"一石二鳥\" (literalmente \"una piedra, dos pájaros\") es exactamente el mismo concepto de modismo que en inglés, probablemente prestado de la misma fuente compartida." }, "B1"],
    ["Translate: 'Let bygones be bygones.'", ["水に流す (Mizu ni nagasu)", "過去を忘れる (Kako wo wasureru)", "水に流れる (Mizu ni nagareru)", "昔のことです (Mukashi no koto desu)"], 0,
      { en: "\"水に流す\" (literally \"to let it flow away into water\") is the standard Japanese idiom for forgiving and forgetting past conflicts.", es: "\"水に流す\" (literalmente \"dejar que fluya al agua\") es el modismo japonés estándar para perdonar y olvidar conflictos pasados." }, "B2"],
  ],
};

// Japanese phonetics: pitch accent (otherwise-identical words distinguished
// purely by a high/low pitch pattern — English has nothing like this), vowel
// devoicing (i/u often become nearly silent between voiceless consonants or
// at the end of an utterance), and mora-timing (each mora/beat gets roughly
// equal length, unlike English's uneven stress-timed rhythm).
const FONO_BANK = [
  { text: "これは箸です。(Kore wa hashi desu.)", sound: "koh-reh wah HA-shi(low) des", difficulty: "B2",
    identify: { options: ["これは箸です。(chopsticks, HL pitch)", "これは橋です。(bridge, LH pitch)", "これは端です。(edge, different pitch)", "これは走です。(not a real word)"], correctIdx: 0,
      explain: { en: "箸 (chopsticks), 橋 (bridge), and 端 (edge) are all pronounced \"hashi\" — pitch accent (which syllable is high vs. low) is the ONLY thing distinguishing them, a feature English has no real equivalent of.", es: "箸 (palillos), 橋 (puente), y 端 (borde) se pronuncian todos \"hashi\" — el acento tonal (qué sílaba es alta o baja) es lo ÚNICO que los distingue, una característica sin equivalente real en inglés." } },
    respond: { options: ["ありがとうございます。", "とても高いです。", "美味しくないです。", "分かりません。"], correctIdx: 0,
      explain: { en: "Being handed chopsticks calls for a simple, polite thank-you.", es: "Que te entreguen palillos pide un simple y cortés agradecimiento." } } },
  { text: "はい、そうです。(Hai, sou desu.)", sound: "hi, soh des", difficulty: "A2",
    identify: { options: ["はい、そうです。", "はい、そうでした。", "いいえ、違います。", "はい、そうですね。"], correctIdx: 0,
      explain: { en: "Notice 'です' sounds almost like just \"des\" — Japanese devoices the final 'u' vowel after voiceless consonants like 's', especially at the end of an utterance.", es: "Nota que 'です' suena casi como solo \"des\" — el japonés ensordece la vocal final 'u' después de consonantes sordas como 's', especialmente al final de una expresión." } },
    respond: { options: ["よかったです!", "残念ですね。", "本当ですか?", "そうですか。"], correctIdx: 0,
      explain: { en: "Confirming something positive calls for an enthusiastic reaction, like \"that's great!\"", es: "Confirmar algo positivo pide una reacción entusiasta, como \"¡qué bien!\"" } } },
  { text: "こんにちは。(Konnichiwa.)", sound: "ko-n-ni-chi-wa (each beat roughly equal length)", difficulty: "A2",
    identify: { options: ["こんにちは。", "こんばんは。", "おはよう。", "さようなら。"], correctIdx: 0,
      explain: { en: "Japanese rhythm is mora-timed — each mora (roughly each kana symbol) gets about equal length, unlike English's stress-timed rhythm where some syllables are held longer and others rushed.", es: "El ritmo japonés está basado en moras — cada mora (aproximadamente cada símbolo kana) recibe una duración aproximadamente igual, a diferencia del ritmo del inglés basado en el acento, donde algunas sílabas se alargan y otras se apresuran." } },
    respond: { options: ["こんにちは!元気ですか?", "さようなら。", "おやすみなさい。", "いただきます。"], correctIdx: 0,
      explain: { en: "A greeting calls for a greeting back, often followed by a friendly \"how are you?\"", es: "Un saludo pide un saludo de vuelta, a menudo seguido de un amistoso \"¿cómo estás?\"" } } },
  { text: "すみません、駅はどこですか?(Sumimasen, eki wa doko desu ka?)", sound: "soo-mi-ma-sen, EH-ki wa DOH-ko des ka?", difficulty: "B1",
    identify: { options: ["すみません、駅はどこですか?", "すみません、今何時ですか?", "すみません、これは何ですか?", "すみません、お手洗いはどこですか?"], correctIdx: 0,
      explain: { en: "'すみません' at the start softens the question into a polite one — and again, 'です' at the end tends toward that devoiced \"des\" sound.", es: "'すみません' al principio suaviza la pregunta y la vuelve cortés — y de nuevo, 'です' al final tiende hacia ese sonido ensordecido \"des\"." } },
    respond: { options: ["あそこです。", "三時です。", "猫です。", "はい、そうです。"], correctIdx: 0,
      explain: { en: "Asking where the station is calls for a direction, like \"it's over there.\"", es: "Preguntar dónde está la estación pide una dirección, como \"está por ahí\"." } } },
];

const jaForEn = {
  id: "ja-for-en",
  label: "日本語",
  nameEn: "Japanese",
  nameEs: "Japonés",
  sublabel: "For English speakers · Japanese",
  nativeLang: "en",
  targetLang: "ja",
  theme: "japan-sakura",
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

export default jaForEn;

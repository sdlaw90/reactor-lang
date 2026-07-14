// Track: Japanese, for an English speaker. Deepened 2026-07-13 (36 → 78
// curated) + Word Bank. Per explicit design decision: native script
// (kanji/hiragana) and romanization are shown TOGETHER in every
// prompt/option — embedded directly in the content strings. Romaji style is
// macron-free wapuro Hepburn (arigatou, not arigatō) — locked as the track
// standard 2026-07-13. Prompt frames converge on the target-language
// convention (は…どういう意味ですか / 日本語で何と言いますか), matching
// significa/bedeutet on the Romance/German tracks; the English frame lives
// in the promptNative subtitle. ASCII quotes around headwords, not 「」 —
// matches every other track and the TTS quote rules. Categories: vocab
// (basics + versatile words with no clean English equivalent), gram (SOV
// word order, particles, no person/number conjugation, i- vs na-adjectives,
// politeness levels, keigo — the biggest structural departure of any track
// so far), trad (idioms), fono (pitch accent, vowel devoicing, long vowels,
// gemination, mora-timing), plus the generated Word Bank.
//
// TTS note (for the ja TTS pass, NOT handled here): the romaji
// parenthetical doubles as the intended-reading record for heteronym kanji
// (明日, 行く). Spoken-text derivation strips parentheticals; the reading is
// there when kana substitution is needed.

import { buildFrequencyBank } from "../../lib/frequencyVocab";
import WORDS from "../vocab/jaWords";

// Japanese prompt formulas for the Word Bank generator. Like DE_FORMULAS,
// no auto-capitalization — the word field is "漢字 (romaji)" and is presented
// as-is; cap() would be a no-op on the script and wrong on the romaji.
// The 'X は日本語で...' production rule will need its own SSML analogue
// (English gloss in a native <lang> span) at this track's TTS pass — same
// class as ¿Cómo se dice...? / Wie sagt man...?. Run voices:list for ja-JP
// FIRST at the TTS pass (2026-07-13 voice-refresh finding).
const JA_FORMULAS = {
  recognitionPrompt: (w) => `'${w}' はどういう意味ですか？(wa dou iu imi desu ka?)`,
  recognitionNative: (w) => ({ en: `'${w}' means...` }),
  recognitionExplain: (w, g, noteEn) => ({
    en: `'${w}' means ${g}.${noteEn}`,
    es: `'${w}' significa ${g}.`,
  }),
  productionPrompt: (g) => `'${g}' は日本語で何と言いますか？(wa nihongo de nan to iimasu ka?)`,
  productionNative: (g) => ({ en: `How do you say '${g}' in Japanese?` }),
  productionExplain: (w, g, noteEn) => ({
    en: `'${g}' is '${w}'.${noteEn}`,
    es: `'${g}' se dice '${w}'.`,
  }),
};

const CATS = {
  vocab: { label: "単語 (Tango)", color: "#3DDBFF" },
  gram: { label: "文法 (Bunpou)", color: "#FFB84D" },
  trad: { label: "慣用句 (Kan'youku)", color: "#FF3D7F" },
  fono: { label: "発音 (Hatsuon)", color: "#B98EFF" },
  fvocab: { label: "言葉 (Kotoba)", color: "#7BE495" },
};

const BANK = {
  vocab: [
    // — A1 —
    ["'こんにちは (konnichiwa)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["hello/good afternoon", "goodnight", "goodbye", "thank you"], 0,
      { en: "'こんにちは' is the standard daytime greeting, roughly \"good afternoon,\" used from late morning into the evening.", es: "'こんにちは' es el saludo diurno estándar, aproximadamente \"buenas tardes,\" usado desde media mañana hasta la noche." }, "A1", null,
      { en: "'こんにちは (konnichiwa)' means..." }],
    ["'ありがとう (arigatou)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'ありがとう' is thank you — one of the most essential words to know.", es: "'ありがとう' significa gracias — una de las palabras más esenciales." }, "A1", null,
      { en: "'ありがとう (arigatou)' means..." }],
    ["'友達 (tomodachi)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["friend", "enemy", "neighbor", "teacher"], 0,
      { en: "'友達' means friend.", es: "'友達' significa amigo." }, "A1", null,
      { en: "'友達 (tomodachi)' means..." }],
    ["'水 (mizu)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["water", "fire", "tea", "rice"], 0,
      { en: "'水' means water — specifically cold water; hot water has its own word, 'お湯 (oyu)', a distinction English doesn't make.", es: "'水' significa agua — específicamente agua fría; el agua caliente tiene su propia palabra, 'お湯 (oyu)', una distinción que el inglés no hace." }, "A1", null,
      { en: "'水 (mizu)' means..." }],
    ["'おはよう (ohayou)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["good morning", "good night", "good evening", "see you later"], 0,
      { en: "'おはよう' is the morning greeting — 'おはようございます (ohayou gozaimasu)' is its polite form, used with anyone you'd be respectful to.", es: "'おはよう' es el saludo matutino — 'おはようございます (ohayou gozaimasu)' es su forma cortés, usada con cualquier persona a quien tratarías con respeto." }, "A1", null,
      { en: "'おはよう (ohayou)' means..." }],
    // — A2 —
    ["'窓 (mado)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["window", "door", "wall", "floor"], 0,
      { en: "'窓' means window.", es: "'窓' significa ventana." }, "A2", null,
      { en: "'窓 (mado)' means..." }],
    ["'家族 (kazoku)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'家族' means family.", es: "'家族' significa familia." }, "A2", null,
      { en: "'家族 (kazoku)' means..." }],
    ["'仕事 (shigoto)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'仕事' means work or job.", es: "'仕事' significa trabajo." }, "A2", null,
      { en: "'仕事 (shigoto)' means..." }],
    ["'駅 (eki)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["train station", "airport", "bus stop", "hotel"], 0,
      { en: "'駅' means train station — one of the most useful words in a country organized around rail travel.", es: "'駅' significa estación de tren — una de las palabras más útiles en un país organizado alrededor del tren." }, "A2", null,
      { en: "'駅 (eki)' means..." }],
    ["'美味しい (oishii)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["delicious", "expensive", "spicy", "fresh"], 0,
      { en: "'美味しい' means delicious — said constantly at meals, where complimenting the food is basic good manners.", es: "'美味しい' significa delicioso — se dice constantemente en las comidas, donde elogiar la comida es cortesía básica." }, "A2", null,
      { en: "'美味しい (oishii)' means..." }],
    // — B1 —
    ["'先生 (sensei)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["teacher (also: doctor, master of a craft)", "student", "classmate", "principal"], 0,
      { en: "'先生' means teacher, but is used much more broadly than in English — doctors, lawyers, and masters of traditional arts are all addressed as 'sensei' too, as a term of respect.", es: "'先生' significa maestro/a, pero se usa mucho más ampliamente que en inglés — a médicos, abogados y maestros de artes tradicionales también se les llama 'sensei', como término de respeto." }, "B1", null,
      { en: "'先生 (sensei)' means..." }],
    ["'大丈夫 (daijoubu)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["\"it's okay/fine/no problem\"", "\"absolutely not\"", "\"I'm confused\"", "\"please wait\""], 0,
      { en: "'大丈夫' is an extremely common, versatile word with no single clean English equivalent — it covers \"I'm fine,\" \"that's okay,\" and \"no problem\" depending on context.", es: "'大丈夫' es una palabra extremadamente común y versátil sin un equivalente único claro en inglés — cubre \"estoy bien,\" \"está bien,\" y \"no hay problema\" según el contexto." }, "B1", null,
      { en: "'大丈夫 (daijoubu)' means..." }],
    ["'高い (takai)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["expensive AND tall/high (same word)", "cheap", "short", "heavy"], 0,
      { en: "A genuinely interesting case: '高い' means both \"expensive\" and \"tall/high\" — the exact same word, with context deciding which sense applies.", es: "Un caso genuinamente interesante: '高い' significa tanto \"caro\" como \"alto\" — exactamente la misma palabra, y el contexto decide cuál sentido aplica." }, "B1", null,
      { en: "'高い (takai)' means..." }],
    ["'元気 (genki)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["healthy/energetic/well", "tired", "sick", "sleepy"], 0,
      { en: "'元気' means healthy, energetic, or well — used constantly in the common greeting \"元気ですか (genki desu ka)?\" (\"How are you?\").", es: "'元気' significa saludable, enérgico, o bien — usado constantemente en el saludo común \"元気ですか (genki desu ka)?\" (\"¿Cómo estás?\")." }, "B1", null,
      { en: "'元気 (genki)' means..." }],
    ["'面倒くさい (mendoukusai)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["\"a pain/such a hassle\"", "\"very exciting\"", "\"quite simple\"", "\"delicious-smelling\""], 0,
      { en: "'面倒くさい' means \"a pain / such a hassle\" — an everyday complaint word (literally \"reeking of bother\") you'll hear constantly in casual speech.", es: "'面倒くさい' significa \"qué lata / qué fastidio\" — una palabra cotidiana de queja (literalmente \"que apesta a molestia\") que oirás constantemente en el habla casual." }, "B1", null,
      { en: "'面倒くさい (mendoukusai)' means..." }],
    ["'懐かしい (natsukashii)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["nostalgic/fondly remembered", "brand new", "forgettable", "old and broken"], 0,
      { en: "'懐かしい' is the warm feeling of nostalgia — said in the moment something reminds you of the past (\"ah, this takes me back\"), where English needs a whole sentence.", es: "'懐かしい' es el sentimiento cálido de nostalgia — se dice en el momento en que algo te recuerda al pasado (\"ah, qué recuerdos\"), donde el inglés necesita una oración entera." }, "B1", null,
      { en: "'懐かしい (natsukashii)' means..." }],
    // — B2 —
    ["'すみません (sumimasen)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["excuse me/sorry/thank you (all three)", "hello only", "goodbye only", "please only"], 0,
      { en: "Remarkably versatile: 'すみません' is used to apologize, to get someone's attention, AND to thank someone for their trouble — all with the same word.", es: "Notablemente versátil: 'すみません' se usa para disculparse, para llamar la atención de alguien, Y para agradecer a alguien por sus molestias — todo con la misma palabra." }, "B2", null,
      { en: "'すみません (sumimasen)' means..." }],
    ["'邪魔 (jama)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["in the way/a hindrance", "helpful", "quiet", "polite"], 0,
      { en: "'邪魔' means being in the way or a hindrance — used in the common phrase \"邪魔しないで\" (don't get in the way/don't bother me). Its polite twist: 'お邪魔します (ojama shimasu)' — \"I'm intruding\" — is the set phrase for entering someone's home.", es: "'邪魔' significa estar en el camino o ser un estorbo — usado en la frase común \"邪魔しないで\" (no estorbes/no me molestes). Su giro cortés: 'お邪魔します (ojama shimasu)' — \"estoy molestando\" — es la frase fija al entrar en casa de alguien." }, "B2", null,
      { en: "'邪魔 (jama)' means..." }],
    ["'わざわざ (wazawaza)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["going out of one's way (deliberately taking the trouble)", "accidentally", "quickly", "reluctantly"], 0,
      { en: "'わざわざ' means deliberately going out of one's way to do something — used to thank someone for trouble they didn't have to take ('わざわざありがとう'), or, pointedly, to imply the trouble was unnecessary.", es: "'わざわざ' significa tomarse la molestia deliberadamente de hacer algo — se usa para agradecer a alguien un esfuerzo que no tenía que hacer ('わざわざありがとう'), o, con intención, para insinuar que la molestia era innecesaria." }, "B2", null,
      { en: "'わざわざ (wazawaza)' means..." }],
    ["'遠慮 (enryo)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["polite restraint/holding back", "enthusiasm", "rudeness", "distance in kilometers"], 0,
      { en: "'遠慮' is polite restraint — declining something offered, or holding back so as not to impose. '遠慮しないで (enryo shinaide)' (\"don't hold back\") is what hosts say to guests; 'ご遠慮ください' on signs means \"please refrain.\"", es: "'遠慮' es la contención cortés — rechazar algo ofrecido, o contenerse para no imponer. '遠慮しないで (enryo shinaide)' (\"no te contengas\") es lo que los anfitriones dicen a los invitados; 'ご遠慮ください' en letreros significa \"absténgase por favor.\"" }, "B2", null,
      { en: "'遠慮 (enryo)' means..." }],
    ["'曖昧 (aimai)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["vague/ambiguous", "crystal clear", "loud", "honest"], 0,
      { en: "'曖昧' means vague or ambiguous — worth learning early because deliberate ambiguity is a polite strategy in Japanese: a vague answer often IS the refusal.", es: "'曖昧' significa vago o ambiguo — vale la pena aprenderla pronto porque la ambigüedad deliberada es una estrategia de cortesía en japonés: una respuesta vaga a menudo ES el rechazo." }, "B2", null,
      { en: "'曖昧 (aimai)' means..." }],
    // — C1 —
    ["'本音 (honne)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["one's true feelings (vs. one's public stance)", "a loud voice", "the main idea of a text", "a formal apology"], 0,
      { en: "'本音' is what you really think — paired culturally with '建前 (tatemae)', the socially appropriate face you present. The honne/tatemae distinction is one of the most-discussed concepts in Japanese social life.", es: "'本音' es lo que realmente piensas — culturalmente emparejado con '建前 (tatemae)', la fachada socialmente apropiada que presentas. La distinción honne/tatemae es uno de los conceptos más comentados de la vida social japonesa." }, "C1", null,
      { en: "'本音 (honne)' means..." }],
    ["'建前 (tatemae)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["one's public stance/social facade", "a building's front door", "one's true feelings", "a written contract"], 0,
      { en: "'建前' (literally \"the built front\") is the socially expected position you present in public — the counterpart of '本音 (honne)', your true feelings. Neither is \"lying\"; the pairing is a social lubricant.", es: "'建前' (literalmente \"el frente construido\") es la postura socialmente esperada que presentas en público — la contraparte de '本音 (honne)', tus verdaderos sentimientos. Ninguno es \"mentir\"; el par es un lubricante social." }, "C1", null,
      { en: "'建前 (tatemae)' means..." }],
    ["'空気を読む (kuuki wo yomu)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["\"to read the room\" (literally: read the air)", "\"to breathe deeply\"", "\"to read aloud\"", "\"to check the weather\""], 0,
      { en: "'空気を読む' — literally \"to read the air\" — means sensing the unspoken mood and acting accordingly. Someone who can't is 'KY' ('kuuki yomenai'), a genuine slang abbreviation.", es: "'空気を読む' — literalmente \"leer el aire\" — significa percibir el ambiente no dicho y actuar en consecuencia. Quien no puede es 'KY' ('kuuki yomenai'), una abreviatura real del argot." }, "C1", null,
      { en: "'空気を読む (kuuki wo yomu)' means..." }],
    // — C2 —
    ["'木漏れ日 (komorebi)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["sunlight filtering through leaves", "a wooden house", "morning fog", "a forest path"], 0,
      { en: "'木漏れ日' is the famous \"untranslatable\": sunlight filtering through tree leaves — a single everyday word for something English can only describe.", es: "'木漏れ日' es la famosa \"intraducible\": la luz del sol filtrándose entre las hojas de los árboles — una sola palabra cotidiana para algo que el inglés solo puede describir." }, "C2", null,
      { en: "'木漏れ日 (komorebi)' means..." }],
    ["'生きがい (ikigai)' はどういう意味ですか？(wa dou iu imi desu ka?)", ["one's reason for living/what makes life worth it", "a long life", "a healthy diet", "a career plan"], 0,
      { en: "'生きがい' is the thing that makes your life feel worth living — in everyday Japanese it's often something modest ('my grandkids are my ikigai'), not the elaborate four-circle diagram the word picked up abroad.", es: "'生きがい' es aquello que hace que tu vida valga la pena — en el japonés cotidiano suele ser algo modesto ('mis nietos son mi ikigai'), no el elaborado diagrama de cuatro círculos que la palabra adquirió en el extranjero." }, "C2", null,
      { en: "'生きがい (ikigai)' means..." }],
  ],
  gram: [
    // — A1 —
    ["私は学生___。(Watashi wa gakusei ___.)", ["です (desu)", "ます (masu)", "か (ka)", "の (no)"], 0,
      { en: "'です' is the polite copula — \"am/is/are.\" 'X です' is the first sentence pattern to learn: 私は学生です = \"I am a student.\"", es: "'です' es la cópula cortés — \"soy/es/son.\" 'X です' es el primer patrón de oración que se aprende: 私は学生です = \"soy estudiante.\"" }, "A1", null,
      { en: "I am a student. (Which word completes the sentence?)" }],
    ["___は何ですか？(___ wa nan desu ka?) — pointing at something near YOU, the speaker", ["これ (kore)", "それ (sore)", "あれ (are)", "どれ (dore)"], 0,
      { en: "Japanese splits \"this/that\" three ways by distance: これ (near me), それ (near you), あれ (away from both) — plus どれ (\"which one?\").", es: "El japonés divide \"esto/eso\" en tres según la distancia: これ (cerca de mí), それ (cerca de ti), あれ (lejos de ambos) — más どれ (\"¿cuál?\")." }, "A1", null,
      { en: "What is this? (Which word for something near the speaker?)" }],
    // — A2 —
    ["私はりんごを食べます。(Watashi wa ringo wo tabemasu.)", ["✓ correct — Subject-Object-Verb order", "incorrect word order", "wrong particle usage", "missing a word"], 0,
      { en: "Japanese is a Subject-Object-Verb (SOV) language — the verb always comes last, a fundamentally different order than English's Subject-Verb-Object.", es: "El japonés es un idioma Sujeto-Objeto-Verbo (SOV) — el verbo siempre va al final, un orden fundamentalmente distinto al Sujeto-Verbo-Objeto del inglés." }, "A2", null,
      { en: "I eat an apple. (Is this sentence correct?)" }],
    ["私___学生です。(Watashi ___ gakusei desu.)", ["は (wa)", "が (ga)", "を (wo)", "に (ni)"], 0,
      { en: "'は' marks the topic of the sentence (\"as for me...\") — one of Japanese's grammatical particles that show a word's role, since word order alone doesn't.", es: "'は' marca el tema de la oración (\"en cuanto a mí...\") — una de las partículas gramaticales del japonés que muestran el papel de una palabra, ya que el orden de las palabras por sí solo no lo hace." }, "A2", null,
      { en: "I am a student. (Which particle marks the topic?)" }],
    ["りんご___食べます。(Ringo ___ tabemasu.)", ["を (wo)", "は (wa)", "が (ga)", "に (ni)"], 0,
      { en: "'を' marks the direct object — the thing being eaten.", es: "'を' marca el objeto directo — la cosa que se está comiendo." }, "A2", null,
      { en: "(I) eat an apple. (Which particle marks the object?)" }],
    ["元気です___? (Genki desu ___?)", ["か (ka)", "ね (ne)", "よ (yo)", "の (no)"], 0,
      { en: "The particle 'か' at the end of a sentence turns a statement into a question — Japanese doesn't need to invert word order like English does.", es: "La partícula 'か' al final de una oración convierte una afirmación en una pregunta — el japonés no necesita invertir el orden de las palabras como el inglés." }, "A2", null,
      { en: "Are (you) well? (Which particle makes it a question?)" }],
    ["これは私___本です。(Kore wa watashi ___ hon desu.)", ["の (no)", "は (wa)", "が (ga)", "と (to)"], 0,
      { en: "'の' links two nouns like English \"'s\" — 私の本 = \"my book,\" 日本の車 = \"a car of Japan / a Japanese car.\" One tiny particle does all the possessive work.", es: "'の' une dos sustantivos como el \"de\" español — 私の本 = \"mi libro,\" 日本の車 = \"un coche de Japón.\" Una partícula diminuta hace todo el trabajo posesivo." }, "A2", null,
      { en: "This is my book. (Which particle shows possession?)" }],
    ["昨日、寿司を食べ___。(Kinou, sushi wo tabe___.)", ["ました (mashita)", "ます (masu)", "ません (masen)", "ましょう (mashou)"], 0,
      { en: "'ました' is the polite past tense — 食べます (I eat) becomes 食べました (I ate). '昨日 (kinou)' means yesterday, so past tense is required.", es: "'ました' es el pasado cortés — 食べます (como) se convierte en 食べました (comí). '昨日 (kinou)' significa ayer, así que se requiere el pasado." }, "A2", null,
      { en: "Yesterday, (I) ate sushi. (Which verb ending fits?)" }],
    // — B1 —
    ["猫___好きです。(Neko ___ suki desu.)", ["が (ga)", "を (wo)", "は (wa)", "の (no)"], 0,
      { en: "A subtle but important point: '好き' (like) grammatically behaves like an adjective (\"likeable/pleasing\"), not a transitive verb — so the thing liked takes 'が', not 'を' as English speakers often expect.", es: "Un punto sutil pero importante: '好き' (gustar) gramaticalmente se comporta como un adjetivo (\"agradable\"), no un verbo transitivo — así que lo que gusta lleva 'が', no 'を' como los angloparlantes suelen esperar." }, "B1", null,
      { en: "(I) like cats. (Which particle does 'suki' take?)" }],
    ["食べます (tabemasu) means...", ["✓ correct for I/you/he/she/we/they eat (same form)", "only \"I eat\"", "only \"they eat\"", "only \"we eat\""], 0,
      { en: "Japanese verbs don't conjugate for person or number at all — '食べます' means \"eat\" regardless of who's doing it; context and topic markers show who the subject is.", es: "Los verbos japoneses no se conjugan en absoluto por persona o número — '食べます' significa \"comer\" sin importar quién lo hace; el contexto y los marcadores de tema muestran quién es el sujeto." }, "B1", null,
      { en: "Who can 'tabemasu' refer to?" }],
    ["食べます (tabemasu) is the ___ form of 食べる (taberu).", ["polite", "plain/casual", "past tense", "negative"], 0,
      { en: "Japanese has distinct politeness levels built into verb conjugation itself — '食べます' is the polite form, '食べる' is the plain/casual dictionary form.", es: "El japonés tiene niveles de cortesía distintos integrados en la conjugación verbal misma — '食べます' es la forma cortés, '食べる' es la forma llana/casual de diccionario." }, "B1", null,
      { en: "What's the relationship between 'tabemasu' and 'taberu'?" }],
    ["本 (hon) can mean...", ["\"book\" or \"books\" (no separate plural form)", "only \"book\" (singular)", "only \"books\" (plural)", "\"bookshelf\""], 0,
      { en: "Japanese nouns don't mark plural the way English does — '本' can mean one book or many, with context (or an optional counter word) clarifying quantity.", es: "Los sustantivos japoneses no marcan el plural como el inglés — '本' puede significar un libro o muchos, con el contexto (o una palabra contadora opcional) aclarando la cantidad." }, "B1", null,
      { en: "Singular or plural?" }],
    ["ちょっと待って___。(Chotto matte ___.) — making it a polite request", ["ください (kudasai)", "です (desu)", "ます (masu)", "ませんか (masenka)"], 0,
      { en: "'てください' (te-form + kudasai) is the standard polite request: 待ってください = \"please wait.\" The te-form is the connector form that huge amounts of Japanese grammar build on.", es: "'てください' (forma-te + kudasai) es la petición cortés estándar: 待ってください = \"espera, por favor.\" La forma-te es la forma conectora sobre la que se construye muchísima gramática japonesa." }, "B1", null,
      { en: "Please wait a moment. (Which word makes it a polite request?)" }],
    ["りんごを二___ください。(Ringo wo futa___ kudasai.) — \"two apples, please\"", ["つ (tsu)", "人 (ri)", "本 (hon)", "枚 (mai)"], 0,
      { en: "Japanese counts things with counter words matched to their shape or type — つ is the general-purpose counter (一つ、二つ), 人 counts people, 本 counts long thin things, 枚 counts flat things. Yes, 本 the counter is unrelated to 本 \"book.\"", es: "El japonés cuenta las cosas con palabras contadoras según su forma o tipo — つ es el contador de uso general (一つ、二つ), 人 cuenta personas, 本 cuenta cosas largas y delgadas, 枚 cuenta cosas planas. Sí, el contador 本 no tiene relación con 本 \"libro.\"" }, "B1", null,
      { en: "Two apples, please. (Which counter word fits?)" }],
    ["私___行きます。(Watashi ___ ikimasu.) — \"I'll go TOO\"", ["も (mo)", "は (wa)", "が (ga)", "で (de)"], 0,
      { en: "'も' means \"also/too\" and REPLACES は or が rather than adding to them: 私も行きます = \"I'll go too.\"", es: "'も' significa \"también\" y REEMPLAZA a は o が en lugar de sumarse a ellas: 私も行きます = \"yo también voy.\"" }, "B1", null,
      { en: "I'll go too. (Which particle means 'also'?)" }],
    // — B2 —
    ["きれい___花です。(Kirei ___ hana desu.)", ["な (na)", "い (i)", "の (no)", "だ (da)"], 0,
      { en: "'きれい' (pretty) is a \"na-adjective\" — this class of adjectives needs 'な' before a noun, unlike \"i-adjectives\" which attach directly. Trap: きれい ends in -i but is NOT an i-adjective.", es: "'きれい' (bonito) es un \"adjetivo-na\" — esta clase de adjetivos necesita 'な' antes de un sustantivo, a diferencia de los \"adjetivos-i\" que se unen directamente. Trampa: きれい termina en -i pero NO es un adjetivo-i." }, "B2", null,
      { en: "(It) is a pretty flower. (Which connector does 'kirei' need?)" }],
    ["図書館___勉強します。(Toshokan ___ benkyou shimasu.) — \"I study AT the library\"", ["で (de)", "に (ni)", "を (wo)", "へ (e)"], 0,
      { en: "'で' marks where an ACTION happens (study at the library); 'に' marks where something EXISTS or a destination. English \"at/in\" maps to both, so this pair trips up English speakers constantly.", es: "'で' marca dónde OCURRE una acción (estudiar en la biblioteca); 'に' marca dónde EXISTE algo o un destino. El \"en\" español corresponde a ambas, así que este par confunde constantemente." }, "B2", null,
      { en: "I study at the library. (Action location: which particle?)" }],
    ["雨が降っ___、行きません。(Ame ga fut___, ikimasen.) — \"IF it rains, I won't go\"", ["たら (tara)", "ても (temo)", "たり (tari)", "たとき (ta toki)"], 0,
      { en: "'たら' is the most versatile \"if/when\" conditional: 降ったら = \"if it rains.\" (Japanese has four conditionals — と, ば, たら, なら — but たら is the safest default.)", es: "'たら' es el condicional \"si/cuando\" más versátil: 降ったら = \"si llueve.\" (El japonés tiene cuatro condicionales — と, ば, たら, なら — pero たら es el más seguro por defecto.)" }, "B2", null,
      { en: "If it rains, I won't go. (Which conditional ending?)" }],
    ["忙しい___、行けません。(Isogashii ___, ikemasen.) — politely: \"because I'm busy, I can't go\"", ["ので (node)", "から (kara)", "けど (kedo)", "のに (noni)"], 0,
      { en: "Both 'から' and 'ので' mean \"because,\" but 'ので' is softer and more polite — it presents the reason as objective circumstance rather than personal assertion, so it's preferred in polite refusals.", es: "Tanto 'から' como 'ので' significan \"porque,\" pero 'ので' es más suave y cortés — presenta la razón como circunstancia objetiva más que como afirmación personal, así que se prefiere en rechazos corteses." }, "B2", null,
      { en: "Because I'm busy, I can't go. (Which 'because' is more polite?)" }],
    // — C1 —
    ["Your boss's boss enters the room. \"Mr. Tanaka is here\" — the respectful verb for 'is here':", ["いらっしゃいます (irasshaimasu)", "います (imasu)", "おります (orimasu)", "ある (aru)"], 0,
      { en: "Keigo (honorific speech) swaps entire verbs: いらっしゃる is the HONORIFIC \"to be/come/go\" (elevating the other person), while おる is its HUMBLE mirror (lowering yourself). Plain います is neutral — grammatical, but tone-deaf here.", es: "El keigo (habla honorífica) cambia verbos enteros: いらっしゃる es el \"estar/venir/ir\" HONORÍFICO (elevando a la otra persona), mientras que おる es su espejo HUMILDE (rebajándote a ti mismo). El neutro います es gramatical, pero fuera de tono aquí." }, "C1", null,
      { en: "Which verb form shows respect to Mr. Tanaka?" }],
    ["ケーキを弟に食べ___。(Keeki wo otouto ni tabe___.) — \"my cake was eaten by my little brother\" (and I'm annoyed)", ["られた (rareta)", "た (ta)", "させた (saseta)", "ている (te iru)"], 0,
      { en: "'られる' is the passive — but Japanese has a special \"suffering passive\" English lacks: 食べられた here doesn't just report the event, it frames it as done TO you, carrying the annoyance grammatically.", es: "'られる' es la pasiva — pero el japonés tiene una \"pasiva de sufrimiento\" que no existe en inglés ni español: 食べられた aquí no solo reporta el evento, lo enmarca como hecho EN TU CONTRA, cargando la molestia gramaticalmente." }, "C1", null,
      { en: "My cake got eaten by my brother. (Which ending carries the 'done to me' nuance?)" }],
    // — C2 —
    ["子供の時、野菜を食べ___。(Kodomo no toki, yasai wo tabe___.) — \"as a kid, I was MADE to eat vegetables\"", ["させられた (saserareta)", "られた (rareta)", "させた (saseta)", "たかった (takatta)"], 0,
      { en: "'させられる' is the causative-passive — causative させる (make someone do) + passive られる (done to me) stacked into one verb form meaning \"to be made to do.\" The stacking of meanings inside a single verb is Japanese grammar at its most agglutinative.", es: "'させられる' es la causativa-pasiva — la causativa させる (hacer que alguien haga) + la pasiva られる (hecho a mí) apiladas en una sola forma verbal que significa \"ser obligado a hacer.\" Ese apilamiento de significados dentro de un solo verbo es la gramática japonesa en su forma más aglutinante." }, "C2", null,
      { en: "As a kid, I was made to eat vegetables. (Which stacked verb form?)" }],
    ["月がきれいです___、私___好きです。Which is true of は vs. が?", ["は marks known/contrast topics; が marks new info or picks out WHO/WHAT", "they are freely interchangeable", "は is polite, が is casual", "が is only for questions"], 0,
      { en: "The は/が distinction is famously the deepest rabbit hole in Japanese grammar: は flags the topic (already-known, or contrasted) while が marks new information or singles out the subject (\"it's THIS one\"). Whole books exist on this — the one-line version here is the working rule.", es: "La distinción は/が es famosa por ser el agujero más profundo de la gramática japonesa: は señala el tema (ya conocido, o contrastado) mientras が marca información nueva o singulariza al sujeto (\"es ESTE\"). Existen libros enteros sobre esto — la versión de una línea aquí es la regla práctica." }, "C2", null,
      { en: "What's the real difference between 'wa' and 'ga'?" }],
  ],
  trad: [
    // — A2 —
    ["Translate: 'Thanks for the meal.' (said before eating)", ["いただきます (Itadakimasu)", "ごちそうさま (Gochisousama)", "おいしいです (Oishii desu)", "たべましょう (Tabemashou)"], 0,
      { en: "\"いただきます\" (literally \"I humbly receive\") is the set phrase said before every meal — its after-meal partner is \"ごちそうさまでした (gochisousama deshita)\". There's no real English equivalent; both are near-universal table ritual.", es: "\"いただきます\" (literalmente \"recibo humildemente\") es la frase fija dicha antes de cada comida — su pareja de después es \"ごちそうさまでした (gochisousama deshita)\". No hay equivalente real en español; ambas son ritual de mesa casi universal." }, "A2"],
    ["Translate: 'Thanks for your hard work.' (to a colleague, leaving the office)", ["お疲れ様でした (Otsukaresama deshita)", "さようなら (Sayounara)", "頑張って (Ganbatte)", "よくできました (Yoku dekimashita)"], 0,
      { en: "\"お疲れ様でした\" (literally \"you must be tired\") is the all-purpose workplace phrase — a greeting, a goodbye, and a thank-you-for-your-effort rolled into one. Coworkers say it dozens of times a day; plain さようなら at the office would sound oddly final.", es: "\"お疲れ様でした\" (literalmente \"debes estar cansado\") es la frase laboral multiusos — saludo, despedida y agradecimiento por el esfuerzo en uno. Los colegas la dicen decenas de veces al día; un simple さようなら en la oficina sonaría extrañamente definitivo." }, "A2"],
    // — B1 —
    ["Translate: 'He's really stubborn/inflexible.'", ["頭が固いです (Atama ga katai desu)", "考えが変わらないです (Kangae ga kawaranai desu)", "とても頑固です (Totemo ganko desu)", "意見を曲げないです (Iken wo magenai desu)"], 0,
      { en: "\"頭が固い\" (literally \"hard-headed\") is the everyday Japanese idiom for being stubborn or inflexible in one's thinking.", es: "\"頭が固い\" (literalmente \"cabeza dura\") es el modismo japonés cotidiano para ser terco o inflexible en el pensamiento." }, "B1"],
    ["Translate: 'To kill two birds with one stone.'", ["一石二鳥 (Isseki nichou)", "二羽の鳥を一度に (Niwa no tori wo ichido ni)", "一度に二つ達成 (Ichido ni futatsu tassei)", "同時に二つ解決 (Douji ni futatsu kaiketsu)"], 0,
      { en: "\"一石二鳥\" (literally \"one stone, two birds\") is the exact same idiom concept as English, likely borrowed from the same shared source.", es: "\"一石二鳥\" (literalmente \"una piedra, dos pájaros\") es exactamente el mismo concepto de modismo que en inglés, probablemente prestado de la misma fuente compartida." }, "B1"],
    ["Translate: 'Fall down seven times, get up eight.'", ["七転び八起き (Nana korobi ya oki)", "何度も立ち上がる (Nando mo tachiagaru)", "諦めないでください (Akiramenaide kudasai)", "八回勝つ (Hakkai katsu)"], 0,
      { en: "\"七転び八起き\" (literally \"seven falls, eight rises\") is THE Japanese proverb of resilience — embodied by the daruma doll, weighted to right itself when knocked over.", es: "\"七転び八起き\" (literalmente \"siete caídas, ocho levantadas\") es EL proverbio japonés de la resiliencia — encarnado por el muñeco daruma, lastrado para enderezarse al ser derribado." }, "B1"],
    ["Translate: 'He knows everyone/is well-connected.'", ["顔が広いです (Kao ga hiroi desu)", "頭が広いです (Atama ga hiroi desu)", "友達が多いです (Tomodachi ga ooi desu)", "有名な人です (Yuumei na hito desu)"], 0,
      { en: "\"顔が広い\" (literally \"has a wide face\") means being well-connected — one of many Japanese body-part idioms (hard head, wide face, light mouth) that map personality onto anatomy.", es: "\"顔が広い\" (literalmente \"tiene la cara ancha\") significa estar bien conectado — uno de muchos modismos japoneses de partes del cuerpo (cabeza dura, cara ancha, boca ligera) que proyectan la personalidad sobre la anatomía." }, "B1"],
    ["Translate: 'She can't keep a secret.'", ["口が軽いです (Kuchi ga karui desu)", "口が重いです (Kuchi ga omoi desu)", "秘密が嫌いです (Himitsu ga kirai desu)", "よく話します (Yoku hanashimasu)"], 0,
      { en: "\"口が軽い\" (literally \"light-mouthed\") describes someone who blabs secrets; its opposite, \"口が固い\" (\"firm-mouthed\"), is someone you can trust with one.", es: "\"口が軽い\" (literalmente \"de boca ligera\") describe a quien suelta secretos; su opuesto, \"口が固い\" (\"de boca firme\"), es alguien de confianza." }, "B1"],
    // — B2 —
    ["Translate: 'I'm swamped/extremely busy.'", ["猫の手も借りたい (Neko no te mo karitai)", "犬と遊びたい (Inu to asobitai)", "とても忙しいです (Totemo isogashii desu)", "時間がないです (Jikan ga nai desu)"], 0,
      { en: "\"猫の手も借りたい\" (literally \"I'd even want to borrow a cat's paws\") is a vivid Japanese idiom for being so busy you'd accept help from anyone, even a cat.", es: "\"猫の手も借りたい\" (literalmente \"querría pedir prestadas hasta las patas de un gato\") es un modismo japonés vívido para estar tan ocupado que aceptarías ayuda de cualquiera, incluso de un gato." }, "B2"],
    ["Translate: 'Even experts make mistakes.'", ["猿も木から落ちる (Saru mo ki kara ochiru)", "誰でも間違えます (Dare demo machigaemasu)", "完璧な人はいません (Kanpeki na hito wa imasen)", "失敗は誰にでもある (Shippai wa dare nidemo aru)"], 0,
      { en: "\"猿も木から落ちる\" (literally \"even monkeys fall from trees\") is the standard Japanese idiom for saying even experts can make mistakes.", es: "\"猿も木から落ちる\" (literalmente \"hasta los monos se caen de los árboles\") es el modismo japonés estándar para decir que hasta los expertos cometen errores." }, "B2"],
    ["Translate: 'Practicality over aesthetics.'", ["花より団子 (Hana yori dango)", "美しさより実用性 (Utsukushisa yori jitsuyousei)", "見た目より中身 (Mitame yori nakami)", "形より機能 (Katachi yori kinou)"], 0,
      { en: "\"花より団子\" (literally \"dumplings over flowers\") is a classic Japanese idiom for preferring substance and practicality over mere appearance.", es: "\"花より団子\" (literalmente \"bolas de arroz antes que flores\") es un modismo japonés clásico para preferir la sustancia y lo práctico sobre la mera apariencia." }, "B2"],
    ["Translate: 'Patience and perseverance pay off.'", ["石の上にも三年 (Ishi no ue nimo sannen)", "我慢すれば報われる (Gaman sureba mukuwareru)", "努力はいつか実る (Doryoku wa itsuka minoru)", "頑張れば成功する (Ganbareba seikou suru)"], 0,
      { en: "\"石の上にも三年\" (literally \"three years sitting on a stone\") — the idea being that even a cold stone will eventually warm up if you sit on it long enough — is the standard Japanese idiom for patience paying off.", es: "\"石の上にも三年\" (literalmente \"tres años sentado en una piedra\") — la idea es que hasta una piedra fría eventualmente se calienta si te sientas en ella lo suficiente — es el modismo japonés estándar para que la paciencia dé frutos." }, "B2"],
    ["Translate: 'Let bygones be bygones.'", ["水に流す (Mizu ni nagasu)", "過去を忘れる (Kako wo wasureru)", "水に流れる (Mizu ni nagareru)", "昔のことです (Mukashi no koto desu)"], 0,
      { en: "\"水に流す\" (literally \"to let it flow away into water\") is the standard Japanese idiom for forgiving and forgetting past conflicts.", es: "\"水に流す\" (literalmente \"dejar que fluya al agua\") es el modismo japonés estándar para perdonar y olvidar conflictos pasados." }, "B2"],
    ["Translate: 'Little by little, it adds up.'", ["塵も積もれば山となる (Chiri mo tsumoreba yama to naru)", "少しずつやりましょう (Sukoshi zutsu yarimashou)", "山を作りましょう (Yama wo tsukurimashou)", "毎日続けます (Mainichi tsuzukemasu)"], 0,
      { en: "\"塵も積もれば山となる\" (literally \"even dust, piled up, becomes a mountain\") is the classic proverb for small efforts compounding — the Japanese cousin of \"many a little makes a mickle.\"", es: "\"塵も積もれば山となる\" (literalmente \"hasta el polvo, acumulado, se vuelve montaña\") es el proverbio clásico de los pequeños esfuerzos que se acumulan — el primo japonés de \"un grano no hace granero, pero ayuda al compañero.\"" }, "B2"],
    ["Translate: 'The nail that sticks out gets hammered down.'", ["出る杭は打たれる (Deru kui wa utareru)", "釘を打ちます (Kugi wo uchimasu)", "目立つ人は人気です (Medatsu hito wa ninki desu)", "高い木は倒れる (Takai ki wa taoreru)"], 0,
      { en: "\"出る杭は打たれる\" (literally \"the stake that sticks out gets hammered down\") — the famous proverb about conformity pressure, quoted constantly in discussions of Japanese social dynamics.", es: "\"出る杭は打たれる\" (literalmente \"la estaca que sobresale recibe el martillazo\") — el famoso proverbio sobre la presión de conformidad, citado constantemente al hablar de la dinámica social japonesa." }, "B2"],
    // — C1 —
    ["Translate: 'Treasure every encounter — it may not come again.'", ["一期一会 (Ichigo ichie)", "また会いましょう (Mata aimashou)", "友達は宝物 (Tomodachi wa takaramono)", "毎日が大切 (Mainichi ga taisetsu)"], 0,
      { en: "\"一期一会\" (literally \"one lifetime, one meeting\") comes from the tea ceremony: treat every gathering as unrepeatable. It's a four-character idiom (yojijukugo) — a whole class of compressed classical expressions.", es: "\"一期一会\" (literalmente \"una vida, un encuentro\") proviene de la ceremonia del té: trata cada reunión como irrepetible. Es un modismo de cuatro caracteres (yojijukugo) — toda una clase de expresiones clásicas comprimidas." }, "C1"],
    ["Translate: 'A frog in a well knows nothing of the sea.' (narrow worldview)", ["井の中の蛙 (I no naka no kawazu)", "海を知らない魚 (Umi wo shiranai sakana)", "小さい世界の人 (Chiisai sekai no hito)", "蛙は海が嫌い (Kaeru wa umi ga kirai)"], 0,
      { en: "\"井の中の蛙 (大海を知らず)\" — \"a frog in a well (knows not the great ocean)\" — is the standard idiom for a person whose small world convinces them they've seen it all. Usually just the first half is said; the rest is understood.", es: "\"井の中の蛙 (大海を知らず)\" — \"una rana en un pozo (no conoce el gran océano)\" — es el modismo estándar para quien cree haberlo visto todo desde su mundo pequeño. Normalmente solo se dice la primera mitad; el resto se sobreentiende." }, "C1"],
    ["Translate: 'Doing it is easier than worrying about it.'", ["案ずるより産むが易し (Anzuru yori umu ga yasushi)", "心配しないでください (Shinpai shinaide kudasai)", "行動は言葉より強い (Koudou wa kotoba yori tsuyoi)", "早くやりましょう (Hayaku yarimashou)"], 0,
      { en: "\"案ずるより産むが易し\" (literally \"giving birth is easier than worrying about it\") — the go-to proverb for telling someone the dreaded task will be easier than the dread itself.", es: "\"案ずるより産むが易し\" (literalmente \"dar a luz es más fácil que preocuparse por ello\") — el proverbio predilecto para decirle a alguien que la tarea temida será más fácil que el propio temor." }, "C1"],
    // — C2 —
    ["Translate: 'Ten people, ten colors.' (everyone's different)", ["十人十色 (Juunin toiro)", "みんな違います (Minna chigaimasu)", "色々な人がいます (Iroiro na hito ga imasu)", "十色の絵 (Toiro no e)"], 0,
      { en: "\"十人十色\" (literally \"ten people, ten colors\") — a yojijukugo meaning everyone has their own tastes and ways; the elegant compressed form of \"to each their own.\" Note the reading: 十色 here is 'toiro', not the expected 'juusshoku' — yojijukugo readings often have to be learned whole.", es: "\"十人十色\" (literalmente \"diez personas, diez colores\") — un yojijukugo que significa que cada quien tiene sus gustos y maneras; la forma comprimida y elegante de \"cada loco con su tema.\" Nota la lectura: 十色 aquí es 'toiro', no el esperado 'juusshoku' — las lecturas de los yojijukugo a menudo se aprenden enteras." }, "C2"],
  ],
};

// Japanese phonetics: pitch accent (otherwise-identical words distinguished
// purely by a high/low pitch pattern — English has nothing like this), vowel
// devoicing (i/u often become nearly silent between voiceless consonants or
// at the end of an utterance), long vs. short vowels and single vs. double
// consonants (both phonemic — get the length wrong and it's a different
// word), the Japanese r (between English r/l/d), and mora-timing (each
// mora/beat gets roughly equal length, unlike English's uneven
// stress-timed rhythm).
const FONO_BANK = [
  // — A1/A2: the sounds you meet on day one —
  { text: "こんにちは。(Konnichiwa.)", sound: "ko-n-ni-chi-wa (each beat roughly equal length)", difficulty: "A2",
    identify: { options: ["こんにちは。", "こんばんは。", "おはよう。", "さようなら。"], correctIdx: 0,
      explain: { en: "Japanese rhythm is mora-timed — each mora (roughly each kana symbol) gets about equal length, unlike English's stress-timed rhythm where some syllables are held longer and others rushed.", es: "El ritmo japonés está basado en moras — cada mora (aproximadamente cada símbolo kana) recibe una duración aproximadamente igual, a diferencia del ritmo del inglés basado en el acento, donde algunas sílabas se alargan y otras se apresuran." } },
    respond: { options: ["こんにちは!元気ですか?", "さようなら。", "おやすみなさい。", "いただきます。"], correctIdx: 0,
      explain: { en: "A greeting calls for a greeting back, often followed by a friendly \"how are you?\"", es: "Un saludo pide un saludo de vuelta, a menudo seguido de un amistoso \"¿cómo estás?\"" } } },
  { text: "はい、そうです。(Hai, sou desu.)", sound: "hi, soh des", difficulty: "A2",
    identify: { options: ["はい、そうです。", "はい、そうでした。", "いいえ、違います。", "はい、そうですね。"], correctIdx: 0,
      explain: { en: "Notice 'です' sounds almost like just \"des\" — Japanese devoices the final 'u' vowel after voiceless consonants like 's', especially at the end of an utterance.", es: "Nota que 'です' suena casi como solo \"des\" — el japonés ensordece la vocal final 'u' después de consonantes sordas como 's', especialmente al final de una expresión." } },
    respond: { options: ["よかったです!", "残念ですね。", "本当ですか?", "そうですか。"], correctIdx: 0,
      explain: { en: "Confirming something positive calls for an enthusiastic reaction, like \"that's great!\"", es: "Confirmar algo positivo pide una reacción entusiasta, como \"¡qué bien!\"" } } },
  { text: "ありがとう。(Arigatou.)", sound: "a-ri-ga-toh (the 'r' is a light tap — between r, l, and d)", difficulty: "A2",
    identify: { options: ["ありがとう。", "ありがどう。", "アリゲーター。", "あにがとう。"], correctIdx: 0,
      explain: { en: "The Japanese r (ら行) is a single light tap of the tongue — closer to the quick 'dd' in American \"ladder\" than to an English r or l. It's one sound, and it's neither r nor l; that's also why r/l get merged going the other way.", es: "La r japonesa (ら行) es un solo toque ligero de la lengua — más cercana a la 'r' simple del español en \"pero\" que a la r o l inglesas. Es un solo sonido, ni r ni l; por eso también r/l se funden en el otro sentido." } },
    respond: { options: ["どういたしまして。", "ありがとう。", "すみません。", "おはよう。"], correctIdx: 0,
      explain: { en: "A thank-you calls for \"どういたしまして (dou itashimashite)\" — you're welcome.", es: "Un agradecimiento pide \"どういたしまして (dou itashimashite)\" — de nada." } } },
  // — B1: length becomes meaning —
  { text: "おばあさんです。(Obaasan desu.)", sound: "o-BAA-san (hold the 'aa' for two full beats)", difficulty: "B1",
    identify: { options: ["おばあさん (grandmother — long aa)", "おばさん (aunt — short a)", "おびあさん (not a real word)", "おばあし (not a real word)"], correctIdx: 0,
      explain: { en: "Vowel length is phonemic in Japanese: おばさん (obasan, aunt) vs. おばあさん (obaasan, grandmother) differ ONLY in how long you hold the 'a' — one beat vs. two. Same trap: おじさん (uncle) vs. おじいさん (grandfather). Get the length wrong and you've changed the family tree.", es: "La longitud vocálica es fonémica en japonés: おばさん (obasan, tía) vs. おばあさん (obaasan, abuela) difieren SOLO en cuánto sostienes la 'a' — un tiempo vs. dos. Misma trampa: おじさん (tío) vs. おじいさん (abuelo). Equivócate en la longitud y cambiaste el árbol genealógico." } },
    respond: { options: ["おいくつですか?", "何歳の車ですか?", "どこで買いましたか?", "美味しいですか?"], correctIdx: 0,
      explain: { en: "Meeting someone's grandmother politely invites \"おいくつですか (how old is she?)\" — the respectful way to ask age.", es: "Conocer a la abuela de alguien invita cortésmente a \"おいくつですか (¿cuántos años tiene?)\" — la forma respetuosa de preguntar la edad." } } },
  { text: "切手をください。(Kitte wo kudasai.)", sound: "kit-te (a tiny silent pause on the doubled 't')", difficulty: "B1",
    identify: { options: ["切手 (kitte, stamp — doubled t)", "来て (kite, come — single t)", "着て (kite, wear — single t)", "きって means nothing"], correctIdx: 0,
      explain: { en: "The small っ (sokuon) is a one-beat pause before the next consonant: 来て (kite, \"come\") vs. 切手 (kitte, \"stamp\"). The doubled consonant takes its own mora — skip the pause and you've said a different word.", es: "La っ pequeña (sokuon) es una pausa de un tiempo antes de la siguiente consonante: 来て (kite, \"ven\") vs. 切手 (kitte, \"estampilla\"). La consonante doblada tiene su propia mora — sáltate la pausa y dijiste otra palabra." } },
    respond: { options: ["はい、何枚ですか?", "はい、すぐ行きます。", "はい、着てください。", "いいえ、切りません。"], correctIdx: 0,
      explain: { en: "A stamp request at the counter gets \"はい、何枚ですか (yes — how many?)\", counted with 枚, the flat-things counter.", es: "Pedir estampillas en el mostrador recibe \"はい、何枚ですか (sí — ¿cuántas?)\", contadas con 枚, el contador de cosas planas." } } },
  { text: "すみません、駅はどこですか?(Sumimasen, eki wa doko desu ka?)", sound: "soo-mi-ma-sen, EH-ki wa DOH-ko des ka?", difficulty: "B1",
    identify: { options: ["すみません、駅はどこですか?", "すみません、今何時ですか?", "すみません、これは何ですか?", "すみません、お手洗いはどこですか?"], correctIdx: 0,
      explain: { en: "'すみません' at the start softens the question into a polite one — and again, 'です' at the end tends toward that devoiced \"des\" sound.", es: "'すみません' al principio suaviza la pregunta y la vuelve cortés — y de nuevo, 'です' al final tiende hacia ese sonido ensordecido \"des\"." } },
    respond: { options: ["あそこです。", "三時です。", "猫です。", "はい、そうです。"], correctIdx: 0,
      explain: { en: "Asking where the station is calls for a direction, like \"it's over there.\"", es: "Preguntar dónde está la estación pide una dirección, como \"está por ahí\"." } } },
  { text: "寿司が好きです。(Sushi ga suki desu.)", sound: "s'ki des (the 'u' in suki nearly vanishes)", difficulty: "B1",
    identify: { options: ["好き (suki → \"ski\", devoiced u)", "すき said as \"soo-kee\" (two clear vowels)", "空き (aki, empty)", "隙 (suki, gap — different word entirely)"], correctIdx: 0,
      explain: { en: "Devoicing strikes mid-word too: in 好き the 'u' sits between two voiceless consonants (s, k) and all but disappears — natives say \"ski,\" not \"soo-kee.\" Over-pronouncing every vowel is the classic beginner accent.", es: "El ensordecimiento también ocurre en medio de palabra: en 好き la 'u' está entre dos consonantes sordas (s, k) y casi desaparece — los nativos dicen \"ski,\" no \"soo-kee.\" Pronunciar cada vocal por completo es el clásico acento de principiante." } },
    respond: { options: ["私もです!何の寿司が一番好きですか?", "スキーは冬にします。", "隙がありません。", "空いていません。"], correctIdx: 0,
      explain: { en: "Shared tastes invite follow-up — \"me too! what's your favorite kind?\"", es: "Los gustos compartidos invitan a seguir — \"¡yo también! ¿cuál es tu favorito?\"" } } },
  // — B2: pitch accent enters —
  { text: "これは箸です。(Kore wa hashi desu.)", sound: "koh-reh wah HA-shi(low) des", difficulty: "B2",
    identify: { options: ["これは箸です。(chopsticks, HL pitch)", "これは橋です。(bridge, LH pitch)", "これは端です。(edge, different pitch)", "これは走です。(not a real word)"], correctIdx: 0,
      explain: { en: "箸 (chopsticks), 橋 (bridge), and 端 (edge) are all pronounced \"hashi\" — pitch accent (which syllable is high vs. low) is the ONLY thing distinguishing them, a feature English has no real equivalent of.", es: "箸 (palillos), 橋 (puente), y 端 (borde) se pronuncian todos \"hashi\" — el acento tonal (qué sílaba es alta o baja) es lo ÚNICO que los distingue, una característica sin equivalente real en inglés." } },
    respond: { options: ["ありがとうございます。", "とても高いです。", "美味しくないです。", "分かりません。"], correctIdx: 0,
      explain: { en: "Being handed chopsticks calls for a simple, polite thank-you.", es: "Que te entreguen palillos pide un simple y cortés agradecimiento." } } },
  { text: "雨ですね。(Ame desu ne.)", sound: "A-me(HL) — high then low", difficulty: "B2",
    identify: { options: ["雨 (rain — Áme, high-low)", "飴 (candy — amé, low-high)", "編め (knit! — a command)", "亜目 (a taxonomy term)"], correctIdx: 0,
      explain: { en: "雨 (rain) is A-me (high-low); 飴 (candy) is a-ME (low-high). Same kana, same consonants and vowels — pitch alone separates the weather from the sweets. This pair and hashi are the two classic pitch-accent demos.", es: "雨 (lluvia) es A-me (alto-bajo); 飴 (caramelo) es a-ME (bajo-alto). Mismos kana, mismas consonantes y vocales — solo el tono separa el clima de los dulces. Este par y hashi son las dos demostraciones clásicas del acento tonal." } },
    respond: { options: ["そうですね。傘がありますか?", "甘くて美味しいですね。", "編み物が上手ですね。", "分類が難しいですね。"], correctIdx: 0,
      explain: { en: "Small talk about rain invites agreement plus the practical question — \"got an umbrella?\"", es: "La charla sobre la lluvia invita a asentir más la pregunta práctica — \"¿tienes paraguas?\"" } } },
  { text: "ふじさんが見えます。(Fuji-san ga miemasu.)", sound: "FOO-ji (the 'f' is soft — blown between the lips, no teeth)", difficulty: "B2",
    identify: { options: ["富士山 (Fuji — soft bilabial 'f')", "藤さん (Mr./Ms. Fuji — a surname)", "武士さん (a samurai)", "ふちさん (not a name)"], correctIdx: 0,
      explain: { en: "Japanese ふ is not an English f: no teeth touch the lip — it's blown between both lips, halfway to an h. It only appears before 'u'; that's why 'coffee' becomes コーヒー (koohii), with ヒ stepping in where English wants 'fee'.", es: "La ふ japonesa no es una f inglesa ni española: los dientes no tocan el labio — se sopla entre ambos labios, a medio camino de una h. Solo aparece ante 'u'; por eso 'coffee' se vuelve コーヒー (koohii), con ヒ entrando donde el inglés quiere 'fee'." } },
    respond: { options: ["本当だ!きれいですね。", "お名前は藤さんですか。", "侍は強いです。", "見えません、目が悪いです。"], correctIdx: 0,
      explain: { en: "Spotting Mt. Fuji deserves shared awe — \"you're right! beautiful, isn't it?\"", es: "Avistar el monte Fuji merece asombro compartido — \"¡es verdad! qué hermoso, ¿no?\"" } } },
  // — C1/C2: the subtle machinery —
  { text: "こんにちは。(Kon-ni-chi-wa.)", sound: "ko-N-ni-chi-wa — the ん is its OWN beat: 5 moras, not 4", difficulty: "C1",
    identify: { options: ["こんにちは (5 moras — ん counts as one)", "こにちは (4 moras — missing the ん)", "こんにちわ (misspelled final kana)", "こんんにちは (too many ん)"], correctIdx: 0,
      explain: { en: "The syllabic ん is a full mora with its own beat — こんにちは is ko-n-ni-chi-wa, five beats. English speakers compress it to \"ko-nee-chee-wah\" (four); giving ん its own beat is one of the quickest upgrades to a natural rhythm. (Bonus: the final は is read 'wa' — it's the topic particle fossilized into the greeting.)", es: "La ん silábica es una mora completa con su propio tiempo — こんにちは es ko-n-ni-chi-wa, cinco tiempos. Se tiende a comprimirla en \"ko-ni-chi-wa\" (cuatro); darle a ん su propio tiempo es una de las mejoras más rápidas hacia un ritmo natural. (Extra: la は final se lee 'wa' — es la partícula de tema fosilizada en el saludo.)" } },
    respond: { options: ["こんにちは。いい天気ですね。", "五拍です。", "文法が正しいです。", "はい、moraです。"], correctIdx: 0,
      explain: { en: "However deep the phonetics, a greeting still just wants a greeting back — plus the eternal weather remark.", es: "Por profunda que sea la fonética, un saludo solo quiere otro saludo — más el eterno comentario del clima." } } },
  { text: "ええ、そうかもしれませんね。(Ee, sou kamoshiremasen ne.)", sound: "eh-eh, soh kah-mo-shi-re-ma-sen neh (flat, even contour — no big stress peaks)", difficulty: "C2",
    identify: { options: ["ええ、そうかもしれませんね。(hedged: \"well, that may be so...\")", "はい、そうです!(emphatic agreement)", "いいえ、違います。(disagreement)", "ええ?そうですか?(surprised question)"], correctIdx: 0,
      explain: { en: "Advanced listening is contour listening: the drawn-out ええ, the hedge かもしれません (\"maybe\"), and a flat, even delivery signal polite non-commitment — often a soft \"no.\" The same words with a rising contour become surprise. At C2, HOW it's said outweighs what's said.", es: "La escucha avanzada es escucha de contorno: el ええ alargado, el atenuante かもしれません (\"quizás\"), y una entrega plana y uniforme señalan una no-compromiso cortés — a menudo un \"no\" suave. Las mismas palabras con contorno ascendente se vuelven sorpresa. En C2, CÓMO se dice pesa más que lo dicho." } },
    respond: { options: ["では、別の案も考えましょうか。", "賛成してくれてありがとう!", "どうして違うんですか?", "びっくりしましたか?"], correctIdx: 0,
      explain: { en: "Reading the hedge correctly means offering an out — \"shall we consider another option, then?\" That's 空気を読む in action.", es: "Leer bien la evasiva significa ofrecer una salida — \"¿consideramos otra opción, entonces?\" Eso es 空気を読む en acción." } } },
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
  bank: { ...BANK, fvocab: buildFrequencyBank(WORDS, { seed: 20260713, formulas: JA_FORMULAS }) },
  // #78: Word Bank category — the round-draw engine caps its share of mixed
  // rounds instead of letting the frequency bank dominate the draw.
  wbCatId: "fvocab",
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "発音の目安を読んでください。何と言っていますか？(Hatsuon no meyasu wo yonde kudasai. Nan to itte imasu ka?)",
    identifyPromptNative: { en: "Read the approximate pronunciation. What does it say?" },
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — どの返事が合いますか？(dono henji ga aimasu ka?)`,
    respondPromptNative: (i) => ({ en: `"${i.text}" — what's the appropriate reply?` }),
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 35,
  extraQuestionTime: 35,
};

export default jaForEn;

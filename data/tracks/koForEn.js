// Track: Korean, for an English speaker. Deepened 2026-07-14 (36 → 78
// curated). Per explicit design decision: native script (hangul) and
// romanization are shown TOGETHER in every prompt/option — embedded directly
// in the content strings. Romanization is Revised Romanization of Korean
// (RR) — annyeonghaseyo, not the McCune-Reischauer annyŏnghaseyo — locked as
// the track standard 2026-07-14. Headwords carry RR spelling; the fono
// category uses pronunciation hints (JOH-ah-yo) instead, deliberately, to
// teach the sound changes RR spelling hides. Prompt frames converge on the
// target-language convention ('X'은/는 무슨 뜻이에요? / 한국어로 뭐라고 해요?),
// matching significa/bedeutet on the Romance/German tracks and どういう意味
// on ja; the English frame lives in the promptNative subtitle. The 은/는
// (topic particle) on the recognition frame agrees with the headword's final
// batchim: consonant-ending → 은, vowel-ending → 는 (quietly reinforces the
// particle rule). ASCII quotes around headwords, not 「」 — matches every
// other track and the TTS quote rules. Categories: vocab (basics + famous
// homophones + culturally untranslatable words), gram (SOV order, particles
// marking grammatical role, adjectives conjugating like verbs with no linking
// "to be", elaborate honorific speech levels, no person/number conjugation),
// trad (idioms), fono (batchim/final-consonant linking, tensification,
// assimilation, nasalization, palatalization, aspiration).
//
// Word Bank (fvocab): built here from ../vocab/koWords (610 words, A1–C2) via
// buildFrequencyBank + KO_FORMULAS (2026-07-14). koWords excludes the curated
// vocab headwords so no word appears in two categories.
//
// TTS note (for the ko TTS pass, NOT handled here): the RR parenthetical is
// the intended-reading record for TTS text derivation. Run voices:list for
// ko-KR FIRST (standing rule), voice-keyed schema from day one — add koForEn
// to VOICE_KEYED_TRACKS.

import { buildFrequencyBank } from "../../lib/frequencyVocab";
import WORDS from "../vocab/koWords";

// Word Bank prompt formulas for the generator. Like JA/DE_FORMULAS, no
// auto-capitalization — the word field is "한글 (RR)", presented as-is; cap()
// would be a no-op on hangul and wrong on the RR. The recognition frame's
// topic particle agrees with the headword's final batchim (consonant → 은,
// vowel → 는), computed from the last hangul syllable block: a block has a
// final consonant iff (code − 0xAC00) % 28 ≠ 0. This mirrors the curated
// vocab deck's converged prompt. Production quotes an ENGLISH gloss, so it
// takes no particle (comma frame) — and at this track's TTS pass that English
// gloss needs a native <lang> SSML span (same class as ja's は日本語で and
// ¿Cómo se dice...?).
const koTopicParticle = (word) => {
  const hangul = word.split(" (")[0];
  const last = hangul.charCodeAt(hangul.length - 1);
  const hasBatchim = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
  return hasBatchim ? ["은", "eun"] : ["는", "neun"];
};

const KO_FORMULAS = {
  recognitionPrompt: (w) => {
    const [p, r] = koTopicParticle(w);
    return `'${w}'${p} 무슨 뜻이에요? (${r} museun tteusieyo?)`;
  },
  recognitionNative: (w) => ({ en: `'${w}' means...` }),
  recognitionExplain: (w, g, noteEn) => ({
    en: `'${w}' means ${g}.${noteEn}`,
    es: `'${w}' significa ${g}.`,
  }),
  productionPrompt: (g) => `'${g}', 한국어로 뭐라고 해요? (hangugeoro mworago haeyo?)`,
  productionNative: (g) => ({ en: `How do you say '${g}' in Korean?` }),
  productionExplain: (w, g, noteEn) => ({
    en: `'${g}' is '${w}'.${noteEn}`,
    es: `'${g}' se dice '${w}'.`,
  }),
};

const CATS = {
  vocab: { label: "단어 (Daneo)", color: "#3DDBFF" },
  gram: { label: "문법 (Munbeop)", color: "#FFB84D" },
  trad: { label: "관용구 (Gwanyonggu)", color: "#FF3D7F" },
  fono: { label: "발음 (Bareum)", color: "#B98EFF" },
  fvocab: { label: "낱말 (Natmal)", color: "#7BE495" },
};

const BANK = {
  vocab: [
    // — A1 —
    ["'안녕하세요 (annyeonghaseyo)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["hello (polite)", "goodbye", "thank you", "please"], 0,
      { en: "'안녕하세요' is the standard polite greeting, usable any time of day. Literally it asks whether you're at peace (안녕 = peace/well-being).", es: "'안녕하세요' es el saludo cortés estándar, usable a cualquier hora. Literalmente pregunta si estás en paz (안녕 = paz/bienestar)." }, "A1", null,
      { en: "'안녕하세요 (annyeonghaseyo)' means..." }],
    ["'감사합니다 (gamsahamnida)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["thank you (formal)", "please", "sorry", "you're welcome"], 0,
      { en: "'감사합니다' is a formal thank you — one of the most essential phrases to know. The casual '고마워요 (gomawoyo)' is its everyday counterpart.", es: "'감사합니다' es un agradecimiento formal — una de las frases más esenciales. El casual '고마워요 (gomawoyo)' es su equivalente cotidiano." }, "A1", null,
      { en: "'감사합니다 (gamsahamnida)' means..." }],
    ["'친구 (chingu)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["friend", "enemy", "neighbor", "coworker"], 0,
      { en: "'친구' means friend — but note it implies a same-age peer; Korean's age-based social structure means you don't usually call an older person 친구.", es: "'친구' significa amigo — pero implica un par de la misma edad; la estructura social coreana basada en la edad hace que normalmente no llames 친구 a alguien mayor." }, "A1", null,
      { en: "'친구 (chingu)' means..." }],
    ["'물 (mul)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["water", "fire", "tea", "rice"], 0,
      { en: "'물' means water.", es: "'물' significa agua." }, "A1", null,
      { en: "'물 (mul)' means..." }],
    ["'네 (ne)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["yes", "no", "maybe", "please"], 0,
      { en: "'네' means yes — it's also used constantly as a soft \"mm-hm / I'm listening\" backchannel, more than English \"yes.\" The blunter '예 (ye)' is its more formal twin.", es: "'네' significa sí — también se usa constantemente como un suave \"ajá / te escucho,\" más que el \"sí\" del español. El más tajante '예 (ye)' es su gemelo formal." }, "A1", null,
      { en: "'네 (ne)' means..." }],
    // — A2 —
    ["'창문 (changmun)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["window", "door", "wall", "floor"], 0,
      { en: "'창문' means window.", es: "'창문' significa ventana." }, "A2", null,
      { en: "'창문 (changmun)' means..." }],
    ["'가족 (gajok)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'가족' means family.", es: "'가족' significa familia." }, "A2", null,
      { en: "'가족 (gajok)' means..." }],
    ["'일 (il)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["work/job", "vacation", "meeting", "salary"], 0,
      { en: "'일' means work or job — and, as a fun bit of trivia, the same sound (from Sino-Korean roots) also means \"one\" and \"day\" depending on context.", es: "'일' significa trabajo — y, como dato curioso, el mismo sonido (de raíces sino-coreanas) también significa \"uno\" y \"día\" según el contexto." }, "A2", null,
      { en: "'일 (il)' means..." }],
    ["'밥 (bap)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["cooked rice / a meal (both)", "only uncooked rice", "bread", "soup"], 0,
      { en: "'밥' means cooked rice — but by extension it means \"a meal\" generally. \"밥 먹었어요? (Have you eaten?)\" is a stock greeting expressing care, not a literal question about rice.", es: "'밥' significa arroz cocido — pero por extensión significa \"una comida\" en general. \"밥 먹었어요? (¿Has comido?)\" es un saludo hecho que expresa cariño, no una pregunta literal sobre el arroz." }, "A2", null,
      { en: "'밥 (bap)' means..." }],
    ["'사랑 (sarang)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["love", "friendship", "kindness", "luck"], 0,
      { en: "'사랑' means love. '사랑해요 (saranghaeyo)' — \"I love you\" — is one of the first phrases most learners want.", es: "'사랑' significa amor. '사랑해요 (saranghaeyo)' — \"te amo\" — es una de las primeras frases que la mayoría de los estudiantes quieren." }, "A2", null,
      { en: "'사랑 (sarang)' means..." }],
    // — B1 —
    ["'답답하다 (dapdaphada)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["to feel frustrated/stifled", "to feel excited", "to feel sleepy", "to feel hungry"], 0,
      { en: "'답답하다' describes that stifled, frustrated feeling when something (or someone) won't budge or make sense — a very commonly used everyday feeling word.", es: "'답답하다' describe esa sensación sofocante y frustrante cuando algo (o alguien) no cede o no tiene sentido — una palabra de sentimiento cotidiana muy usada." }, "B1", null,
      { en: "'답답하다 (dapdaphada)' means..." }],
    ["'화이팅 (hwaiting)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["\"go for it!/you can do it!\"", "\"goodbye\"", "\"congratulations\"", "\"I'm sorry\""], 0,
      { en: "Borrowed from English \"fighting,\" '화이팅' is a common cheer of encouragement — shouted before an exam or event, similar in spirit to Mandarin's '加油'. Also spelled '파이팅 (paiting)'.", es: "Prestado del inglés \"fighting,\" '화이팅' es una porra común de ánimo — se grita antes de un examen o evento, similar en espíritu al '加油' del mandarín. También se escribe '파이팅 (paiting)'." }, "B1", null,
      { en: "'화이팅 (hwaiting)' means..." }],
    ["'눈 (nun)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["eye OR snow (two different words, same sound)", "only eye", "only snow", "ear"], 0,
      { en: "A famous Korean homophone: '눈' can mean \"eye\" or \"snow\" — two unrelated words that sound and even spell identically, with context sorting out which is meant (though in careful speech, \"snow\" is held slightly longer).", es: "Un homófono coreano famoso: '눈' puede significar \"ojo\" o \"nieve\" — dos palabras no relacionadas que suenan e incluso se escriben idénticamente, con el contexto aclarando cuál (aunque en habla cuidada, \"nieve\" se alarga un poco)." }, "B1", null,
      { en: "'눈 (nun)' means..." }],
    ["'선생님 (seonsaengnim)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["teacher (respectful)", "student", "classmate", "principal"], 0,
      { en: "'선생님' means teacher, with the honorific suffix '님' attached — used respectfully like Japanese 'sensei' or Mandarin 'lǎoshī', and extended to anyone you'd show that respect to.", es: "'선생님' significa maestro/a, con el sufijo honorífico '님' añadido — usado respetuosamente como el 'sensei' japonés o 'lǎoshī' del mandarín, y extendido a cualquiera a quien mostrarías ese respeto." }, "B1", null,
      { en: "'선생님 (seonsaengnim)' means..." }],
    ["'정 (jeong)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["deep bond/affection built over time", "a fixed appointment", "cleanliness", "silence"], 0,
      { en: "'정' is the slow-building emotional attachment between people (or to places, even objects) — a warm, sticky loyalty that grows with shared time. It's considered a defining Korean feeling, with no clean English word.", es: "'정' es el apego emocional que se construye lentamente entre personas (o hacia lugares, incluso objetos) — una lealtad cálida y pegajosa que crece con el tiempo compartido. Se considera un sentimiento coreano definitorio, sin palabra clara en inglés." }, "B1", null,
      { en: "'정 (jeong)' means..." }],
    // — B2 —
    ["'눈치 (nunchi)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["social awareness/reading the room", "eyesight", "curiosity", "shyness"], 0,
      { en: "'눈치' (literally close to \"eye-measure\") is the social skill of reading a room and picking up unspoken cues — no single clean English word covers it. Someone slow at it is '눈치가 없다' (has no nunchi).", es: "'눈치' (literalmente cerca de \"medida del ojo\") es la habilidad social de leer una situación y captar señales no dichas — ninguna palabra única en inglés lo cubre. Alguien lento para esto es '눈치가 없다' (no tiene nunchi)." }, "B2", null,
      { en: "'눈치 (nunchi)' means..." }],
    ["'배 (bae)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["stomach, boat, OR pear (three different words!)", "only stomach", "only boat", "only pear"], 0,
      { en: "An even more famous case than 눈: '배' covers three unrelated words — belly/stomach, boat/ship, and pear — all pronounced and spelled the same, distinguished only by context.", es: "Un caso aún más famoso que 눈: '배' cubre tres palabras no relacionadas — vientre/estómago, barco, y pera — todas pronunciadas y escritas igual, distinguidas solo por el contexto." }, "B2", null,
      { en: "'배 (bae)' means..." }],
    ["'대박 (daebak)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["\"awesome!/jackpot!/huge hit\"", "\"disaster\"", "\"maybe\"", "\"goodbye\""], 0,
      { en: "'대박' is an all-purpose exclamation — \"awesome!\", \"jackpot!\", \"no way!\" — originally meaning a huge commercial success (a hit film is a '대박'). Its opposite, a flop, is '쪽박 (jjokbak)'.", es: "'대박' es una exclamación multiusos — \"¡increíble!\", \"¡jackpot!\", \"¡no puede ser!\" — originalmente un enorme éxito comercial (una película taquillera es un '대박'). Su opuesto, un fracaso, es '쪽박 (jjokbak)'." }, "B2", null,
      { en: "'대박 (daebak)' means..." }],
    ["'시원하다 (siwonhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["refreshing — even for HOT soup (same word)", "only \"cold\"", "only \"warm\"", "only \"spicy\""], 0,
      { en: "'시원하다' means refreshing/cool — but Koreans famously call a piping-hot soup '시원하다' too, when it hits the spot. It also covers relief (a good back-crack, resolving a problem). Context, not temperature, is the point.", es: "'시원하다' significa refrescante/fresco — pero los coreanos famosamente también llaman '시원하다' a una sopa hirviendo cuando les cae bien. También cubre el alivio (un buen crujido de espalda, resolver un problema). El punto es el contexto, no la temperatura." }, "B2", null,
      { en: "'시원하다 (siwonhada)' means..." }],
    ["'억울하다 (eogulhada)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["to feel wronged/unfairly treated", "to feel proud", "to feel bored", "to feel grateful"], 0,
      { en: "'억울하다' is the specific, sharp feeling of being unjustly blamed or treated unfairly — the burning sense that \"this isn't fair and I didn't deserve it.\" English needs a whole phrase for it.", es: "'억울하다' es el sentimiento específico y agudo de ser culpado injustamente o tratado de forma injusta — la sensación ardiente de que \"esto no es justo y no me lo merecía.\" El inglés necesita una frase entera." }, "B2", null,
      { en: "'억울하다 (eogulhada)' means..." }],
    // — C1 —
    ["'체면 (chemyeon)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["social face/dignity (to be kept or lost)", "a physical mask", "a facial expression", "makeup"], 0,
      { en: "'체면' is one's social face — the public dignity you maintain and can \"lose\" ('체면을 잃다') or \"save\" in front of others. Like Japanese 建前/keigo culture, it shapes a great deal of everyday politeness and indirectness.", es: "'체면' es el rostro social — la dignidad pública que mantienes y puedes \"perder\" ('체면을 잃다') o \"salvar\" ante otros. Como la cultura del 建前/keigo japonés, moldea gran parte de la cortesía y la indirecta cotidianas." }, "C1", null,
      { en: "'체면 (chemyeon)' means..." }],
    ["'시치미 (sichimi)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["feigned innocence (in '시치미를 떼다')", "a strong spice", "a small lie about age", "a type of hat"], 0,
      { en: "'시치미' lives in the set phrase '시치미(를) 떼다' — to play dumb, feign total ignorance of something you clearly know. It originally named the name-tag on a hunting falcon; \"removing the tag\" meant pretending the bird wasn't yours.", es: "'시치미' vive en la frase fija '시치미(를) 떼다' — hacerse el tonto, fingir ignorancia total de algo que claramente sabes. Originalmente nombraba la etiqueta de un halcón de caza; \"quitar la etiqueta\" significaba fingir que el ave no era tuya." }, "C1", null,
      { en: "'시치미 (sichimi)' means..." }],
    ["'답정너 (dapjeongneo)'는 무슨 뜻이에요? (neun museun tteusieyo?)", ["\"the answer's decided, you just say it\" (slang)", "a wrong answer", "a quiz app", "a polite refusal"], 0,
      { en: "'답정너' is a modern slang contraction of '답은 정해져 있고 너는 대답만 하면 돼' — \"the answer's already set; you just have to say it.\" It labels someone who asks for your opinion but only wants the one they've decided on.", es: "'답정너' es una contracción de argot moderno de '답은 정해져 있고 너는 대답만 하면 돼' — \"la respuesta ya está decidida; tú solo tienes que decirla.\" Etiqueta a quien pide tu opinión pero solo quiere la que ya decidió." }, "C1", null,
      { en: "'답정너 (dapjeongneo)' means..." }],
    // — C2 —
    ["'한 (han)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["deep, long-held sorrow/grief-resentment", "a Korean surname only", "the number one", "a season"], 0,
      { en: "'한' is the famous \"untranslatable\": a deep, accumulated sorrow and unresolved resentment — historical, collective, and personal at once — often cited as a core thread in Korean art, music, and identity. Its emotional counterpart is '흥 (heung)', spontaneous joy.", es: "'한' es la famosa \"intraducible\": una tristeza profunda y acumulada y un resentimiento no resuelto — histórico, colectivo y personal a la vez — citada a menudo como hilo central del arte, la música y la identidad coreanos. Su contraparte emocional es '흥 (heung)', la alegría espontánea." }, "C2", null,
      { en: "'한 (han)' means..." }],
    ["'흥 (heung)'은 무슨 뜻이에요? (eun museun tteusieyo?)", ["spontaneous joy/excitement/groove", "boredom", "anger", "exhaustion"], 0,
      { en: "'흥' is the bubbling-up of spontaneous joy and rhythm — the impulse to sing, dance, get swept up. '흥이 나다' is to catch that spark. Culturally paired as the bright twin of '한 (han)': one people is said to hold both deep sorrow and irrepressible groove.", es: "'흥' es el burbujeo de alegría y ritmo espontáneos — el impulso de cantar, bailar, dejarse llevar. '흥이 나다' es captar esa chispa. Culturalmente emparejado como el gemelo luminoso de '한 (han)': se dice que un mismo pueblo alberga tanto la tristeza profunda como el ritmo incontenible." }, "C2", null,
      { en: "'흥 (heung)' means..." }],
  ],
  gram: [
    // — A1 —
    ["저는 학생___. (Jeoneun haksaeng___.)", ["이에요 (ieyo)", "예요 (yeyo)", "이가 (iga)", "은 (eun)"], 0,
      { en: "'이에요' is the polite copula \"am/is/are,\" used after a consonant (학생 ends in ㅇ); after a vowel it contracts to '예요'. 'X는 …이에요' is the first sentence pattern to learn.", es: "'이에요' es la cópula cortés \"soy/es/son,\" usada tras consonante (학생 termina en ㅇ); tras vocal se contrae a '예요'. 'X는 …이에요' es el primer patrón de oración que se aprende." }, "A1", null,
      { en: "I am a student. (Which word completes the sentence?)" }],
    ["___ 뭐예요? — pointing at something near YOU, the speaker (___ mwoyeyo?)", ["이거 (igeo)", "그거 (geugeo)", "저거 (jeogeo)", "어느 거 (eoneu geo)"], 0,
      { en: "Korean splits \"this/that\" three ways by distance: 이거 (near me), 그거 (near you), 저거 (away from both) — plus 어느 거 (\"which one?\").", es: "El coreano divide \"esto/eso\" en tres según la distancia: 이거 (cerca de mí), 그거 (cerca de ti), 저거 (lejos de ambos) — más 어느 거 (\"¿cuál?\")." }, "A1", null,
      { en: "What is this? (Which word for something near the speaker?)" }],
    // — A2 —
    ["저는 사과를 먹어요. (Jeoneun sagwareul meogeoyo.)", ["✓ correct — Subject-Object-Verb order", "incorrect word order", "wrong particle usage", "missing a word"], 0,
      { en: "Korean, like Japanese, is a Subject-Object-Verb (SOV) language — the verb always comes last, a fundamentally different order from English's Subject-Verb-Object.", es: "El coreano, como el japonés, es un idioma Sujeto-Objeto-Verbo (SOV) — el verbo siempre va al final, un orden fundamentalmente distinto al Sujeto-Verbo-Objeto del inglés." }, "A2", null,
      { en: "I eat an apple. (Is the word order correct?)" }],
    ["저___ 학생이에요. (Jeo___ haksaeng-ieyo.)", ["는 (neun)", "이 (i)", "을 (eul)", "가 (ga)"], 0,
      { en: "'는' marks the topic of the sentence (\"as for me…\"), attached after a vowel-ending word — one of Korean's grammatical particles showing a word's role, since word order alone doesn't.", es: "'는' marca el tema de la oración (\"en cuanto a mí…\"), unido tras una palabra terminada en vocal — una de las partículas gramaticales del coreano que muestran el papel de una palabra, ya que el orden por sí solo no lo hace." }, "A2", null,
      { en: "I am a student. (Which particle marks the topic?)" }],
    ["사과___ 먹어요. (Sagwa___ meogeoyo.)", ["를 (reul)", "는 (neun)", "이 (i)", "가 (ga)"], 0,
      { en: "'를' marks the direct object after a vowel-ending word — the thing being eaten. After a consonant it's '을 (eul)'.", es: "'를' marca el objeto directo tras una palabra terminada en vocal — la cosa que se come. Tras consonante es '을 (eul)'." }, "A2", null,
      { en: "(I) eat an apple. (Which particle marks the object?)" }],
    ["학교___ 가요. — \"I go TO school\" (Hakgyo___ gayo.)", ["에 (e)", "에서 (eseo)", "를 (reul)", "가 (ga)"], 0,
      { en: "'에' marks a destination or a point in time; '에서' marks where an action happens or a starting point. English \"to/at\" maps onto both, so this pair trips learners up constantly.", es: "'에' marca un destino o un momento en el tiempo; '에서' marca dónde ocurre una acción o un punto de partida. El \"a/en\" mapea sobre ambas, así que este par confunde constantemente." }, "A2", null,
      { en: "I go to school. (Which particle marks the destination?)" }],
    ["어제 밥을 먹___. — \"yesterday\" (Eoje bapeul meog___.)", ["었어요 (eosseoyo)", "어요 (eoyo)", "을 거예요 (eul geoyeyo)", "고 있어요 (go isseoyo)"], 0,
      { en: "'았/었어요' is the polite past tense — 먹어요 (eat) becomes 먹었어요 (ate). '어제 (eoje)' means yesterday, so past is required. Vowel harmony picks 았 after ㅏ/ㅗ stems, 었 otherwise.", es: "'았/었어요' es el pasado cortés — 먹어요 (como) se vuelve 먹었어요 (comí). '어제 (eoje)' significa ayer, así que se requiere el pasado. La armonía vocálica elige 았 tras raíces con ㅏ/ㅗ, 었 en los demás casos." }, "A2", null,
      { en: "Yesterday, (I) ate rice. (Which verb ending fits?)" }],
    ["이것은 제 친구___ 책이에요. — \"my friend's book\" (Igeoseun je chingu___ chaegieyo.)", ["의 (ui)", "은 (eun)", "가 (ga)", "도 (do)"], 0,
      { en: "'의' links two nouns like English's possessive 's — 친구의 책 = \"a friend's book,\" 한국의 문화 = \"Korea's culture.\" In casual speech it's often reduced or dropped, but it's the possessive particle.", es: "'의' une dos sustantivos como el \"de\" español — 친구의 책 = \"el libro de un amigo,\" 한국의 문화 = \"la cultura de Corea.\" En el habla casual se reduce o se omite, pero es la partícula posesiva." }, "A2", null,
      { en: "This is my friend's book. (Which particle shows possession?)" }],
    // — B1 —
    ["날씨___ 좋아요. (Nalssi___ joayo.)", ["가 (ga)", "를 (reul)", "는 (neun)", "을 (eul)"], 0,
      { en: "'가' marks the grammatical subject after a vowel-ending word — here, the weather is what's good. After a consonant it's '이 (i)'.", es: "'가' marca el sujeto gramatical tras una palabra terminada en vocal — aquí, el clima es lo que está bueno. Tras consonante es '이 (i)'." }, "B1", null,
      { en: "The weather is nice. (Which particle marks the subject?)" }],
    ["예뻐요. (Yeppeoyo.)", ["✓ correct — adjectives conjugate directly, no separate \"to be\" needed", "missing a linking verb", "wrong tense", "incomplete sentence"], 0,
      { en: "Korean adjectives (\"descriptive verbs\") conjugate directly on their own, without a separate \"to be\" verb — '예쁘다' (to be pretty) inflects just like an action verb would.", es: "Los adjetivos coreanos (\"verbos descriptivos\") se conjugan directamente por sí solos, sin un verbo \"ser/estar\" aparte — '예쁘다' (ser bonito) se flexiona igual que un verbo de acción." }, "B1", null,
      { en: "(It's) pretty. (Is a linking verb missing?)" }],
    ["가요 (gayo) means...", ["✓ correct for I/you/he/she/we/they go (same form)", "only \"I go\"", "only \"they go\"", "only \"we go\""], 0,
      { en: "Like Japanese, Korean verbs don't conjugate for person or number at all — '가요' means \"go\" regardless of who's doing it; context and topic markers show the subject.", es: "Como el japonés, los verbos coreanos no se conjugan en absoluto por persona o número — '가요' significa \"ir\" sin importar quién lo hace; el contexto y los marcadores de tema muestran el sujeto." }, "B1", null,
      { en: "Who can 'gayo' refer to?" }],
    ["___ 가요. — simple \"don't go\" (___ gayo.)", ["안 (an)", "못 (mot)", "지 (ji)", "말 (mal)"], 0,
      { en: "'안' placed directly before the verb is the standard simple negation — a chosen \"don't/won't.\" (Its partner 못 is for inability — see the next question.)", es: "'안' colocado justo antes del verbo es la negación simple estándar — un \"no (quiero)\" elegido. (Su pareja 못 es para la incapacidad — ver la siguiente pregunta.)" }, "B1", null,
      { en: "(I) don't go. (Which word negates it?)" }],
    ["다쳐서 ___ 걸어요. — \"can't walk\" (unable) (Dachyeoseo ___ georeoyo.)", ["못 (mot)", "안 (an)", "말 (mal)", "없 (eop)"], 0,
      { en: "'못' before a verb is inability — \"can't,\" as opposed to 안's chosen \"won't.\" 다쳐서 (because I'm hurt) → 못 걸어요 (can't walk). The 안/못 split maps to English won't/can't.", es: "'못' antes de un verbo es incapacidad — \"no puedo,\" frente al \"no quiero\" elegido de 안. 다쳐서 (porque me lastimé) → 못 걸어요 (no puedo caminar). El par 안/못 corresponde a won't/can't del inglés." }, "B1", null,
      { en: "Because I'm hurt, I can't walk. (Which word means 'cannot'?)" }],
    ["사과 두 ___ 주세요. — \"two apples\" (Sagwa du ___ juseyo.)", ["개 (gae)", "명 (myeong)", "마리 (mari)", "병 (byeong)"], 0,
      { en: "Korean counts with counter words matched to the thing — 개 for general objects, 명 for people, 마리 for animals, 병 for bottles. Note the native number changes shape before a counter: 둘 → 두.", es: "El coreano cuenta con palabras contadoras según el objeto — 개 para cosas generales, 명 para personas, 마리 para animales, 병 para botellas. El número nativo cambia de forma ante el contador: 둘 → 두." }, "B1", null,
      { en: "Two apples, please. (Which counter word fits?)" }],
    ["저는 물을 마시___ 싶어요. — \"I want to drink water\" (Jeoneun mureul masi___ sipeoyo.)", ["고 (go)", "서 (seo)", "면 (myeon)", "지 (ji)"], 0,
      { en: "Verb stem + '고 싶다' expresses \"want to (do)\": 마시고 싶어요 = \"I want to drink.\" For someone ELSE's want, Korean switches the verb to 고 싶어하다 — you can only directly claim your own desires.", es: "Raíz verbal + '고 싶다' expresa \"querer (hacer)\": 마시고 싶어요 = \"quiero beber.\" Para el deseo de OTRA persona, el coreano cambia a 고 싶어하다 — solo puedes afirmar directamente tus propios deseos." }, "B1", null,
      { en: "I want to drink water. (Which ending means 'want to'?)" }],
    // — B2 —
    ["드세요 (deuseyo) is the ___ form of 'to eat'.", ["polite/honorific", "casual/plain", "past tense", "negative"], 0,
      { en: "Korean has an elaborate system of speech levels built into verb endings — '드세요' is a respectful, honorific way to say \"eat,\" quite different from the plain '먹어'.", es: "El coreano tiene un sistema elaborado de niveles de habla integrado en las terminaciones verbales — '드세요' es una forma respetuosa y honorífica de decir \"comer,\" muy distinta del llano '먹어'." }, "B2", null,
      { en: "Which form of 'to eat' is 'deuseyo'?" }],
    ["가요? vs. 가요.", ["✓ correct — rising intonation alone can mark a question in casual speech", "these are always identical", "the question needs a different particle always", "this is grammatically impossible"], 0,
      { en: "In casual spoken Korean, a statement and a question can look identical in writing, with only rising intonation distinguishing \"I'm going\" from \"are you going?\" Formal speech does mark it (갑니다 vs. 갑니까).", es: "En el coreano hablado casual, una afirmación y una pregunta pueden verse idénticas por escrito, con solo la entonación ascendente distinguiendo \"voy\" de \"¿vas?\" El habla formal sí lo marca (갑니다 vs. 갑니까)." }, "B2", null,
      { en: "Can a question and a statement look identical?" }],
    ["'갑니다 (gamnida)' vs. '가요 (gayo)': 갑니다 is the more ___ register.", ["formal/deferential (하십시오체)", "casual", "past tense", "questioning"], 0,
      { en: "Korean has two polite registers: the 요-ending 해요체 (everyday polite) and the ㅂ니다/습니다 하십시오체 (formal-deferential) used in news, presentations, the military, and service. Same meaning, different formality — you switch by audience.", es: "El coreano tiene dos registros corteses: el 해요체 terminado en 요 (cortesía cotidiana) y el 하십시오체 en ㅂ니다/습니다 (formal-deferente) usado en noticias, presentaciones, el ejército y el servicio. Mismo significado, distinta formalidad — cambias según el interlocutor." }, "B2", null,
      { en: "How does '갑니다' differ from '가요'?" }],
    ["'춥다 (chupda, to be cold)' in polite present becomes ___. (\"it's cold\")", ["추워요 (chuwoyo)", "춥어요 (chubeoyo)", "추어요 (chueoyo)", "춥아요 (chubayo)"], 0,
      { en: "'춥다' is a ㅂ-irregular verb — the final ㅂ turns into 우 before an ending: 춥 + 어요 → 추워요, not the regular-looking 춥어요. Many descriptive verbs follow suit: 덥다→더워요, 쉽다→쉬워요, 맵다→매워요.", es: "'춥다' es un verbo irregular en ㅂ — la ㅂ final se vuelve 우 ante una terminación: 춥 + 어요 → 추워요, no el aparentemente regular 춥어요. Muchos adjetivos-verbo hacen lo mismo: 덥다→더워요, 쉽다→쉬워요, 맵다→매워요." }, "B2", null,
      { en: "'It's cold.' (Which is the correct polite form of 춥다?)" }],
    ["Saying '밥 먹었어?' to a close friend (instead of '밥 먹었어요?') is ___.", ["반말 — casual speech (요 dropped)", "존댓말 — polite speech", "a grammatical error", "formal writing"], 0,
      { en: "Dropping the 요 gives 반말 (casual speech), used with close friends, younger people, or clear juniors. Using it with the wrong person — or before you've agreed to — is a real social misstep, the flip side of Korean's honorific care.", es: "Quitar el 요 da 반말 (habla casual), usado con amigos cercanos, personas más jóvenes o claramente subordinadas. Usarlo con la persona equivocada — o antes de acordarlo — es un desliz social real, la otra cara del cuidado honorífico coreano." }, "B2", null,
      { en: "Saying '밥 먹었어?' to a close friend is what kind of speech?" }],
    // — C1 —
    ["할아버지___ 진지를 드세요. — \"grandfather is eating\" (honorific) (Harabeoji___ jinjireul deuseyo.)", ["께서 (kkeseo)", "가 (ga)", "은 (eun)", "도 (do)"], 0,
      { en: "'께서' is the HONORIFIC replacement for the subject particle 이/가, elevating the subject — and it comes coordinated with the honorific verb 드시다 AND the honorific noun 진지 (for 밥). Korean honorifics move particle, verb, and vocabulary together.", es: "'께서' es el reemplazo HONORÍFICO de la partícula de sujeto 이/가, elevando al sujeto — y viene coordinado con el verbo honorífico 드시다 Y el sustantivo honorífico 진지 (por 밥). Los honoríficos coreanos mueven partícula, verbo y vocabulario a la vez." }, "C1", null,
      { en: "Grandfather is eating. (Which honorific subject particle?)" }],
    ["To respectfully say an elder \"is sleeping,\" 자다 (to sleep) becomes ___.", ["주무시다 (jumusida)", "자시다 (jasida)", "자세요 (jaseyo)", "잠자다 (jamjada)"], 0,
      { en: "Korean swaps entire verbs for honorifics, like Japanese keigo: 자다 (sleep) → 주무시다, 먹다 (eat) → 드시다/잡수시다, 있다 (be/exist) → 계시다, 말하다 (speak) → 말씀하시다. These suppletive forms are learned one by one — the regular 시 infix alone won't produce them.", es: "El coreano cambia verbos enteros por honoríficos, como el keigo japonés: 자다 (dormir) → 주무시다, 먹다 (comer) → 드시다/잡수시다, 있다 (estar) → 계시다, 말하다 (hablar) → 말씀하시다. Estas formas supletivas se aprenden una por una — el infijo regular 시 por sí solo no las produce." }, "C1", null,
      { en: "Which is the honorific verb for '(an elder) sleeps'?" }],
    // — C2 —
    ["'은/는' vs. '이/가' — which statement is true?", ["은/는 marks the topic (known/contrast); 이/가 marks the subject / new info", "they are freely interchangeable", "은/는 is polite, 이/가 is casual", "이/가 is only used in questions"], 0,
      { en: "The deepest rabbit hole in Korean grammar, twin to Japanese は/が: 은/는 flags the TOPIC — already-known, or contrasted — while 이/가 marks the grammatical subject or introduces NEW information (\"it's THIS one\"). Whole books exist on this; the one-line version here is the working rule.", es: "El agujero más profundo de la gramática coreana, gemelo del は/が japonés: 은/는 señala el TEMA — ya conocido, o contrastado — mientras que 이/가 marca el sujeto gramatical o introduce información NUEVA (\"es ESTE\"). Existen libros enteros sobre esto; la versión de una línea aquí es la regla práctica." }, "C2", null,
      { en: "What's the real difference between 'eun/neun' and 'i/ga'?" }],
    ["코끼리는 코가 길어요. (\"Elephants have long noses.\") — the structure is:", ["a double-subject: 는 sets the topic, 가 marks the inner subject", "a grammatical error", "two separate sentences joined wrongly", "코 is the object here"], 0,
      { en: "Korean (like Japanese) allows a topic-comment \"double subject\": 코끼리는 (as for elephants) 코가 길어요 (noses are long). 는 sets the overall topic; 가 marks the subject of the comment. There's no single English structure for it — literally \"elephants, (their) noses are long.\"", es: "El coreano (como el japonés) permite un \"doble sujeto\" de tema-comentario: 코끼리는 (en cuanto a los elefantes) 코가 길어요 (las narices son largas). 는 fija el tema global; 가 marca el sujeto del comentario. No hay una estructura única en inglés — literalmente \"los elefantes, (sus) narices son largas.\"" }, "C2", null,
      { en: "Why does this sentence seem to have two subjects?" }],
  ],
  trad: [
    // — A2 —
    ["Translate: 'I'll enjoy this meal.' (set phrase, said before eating)", ["잘 먹겠습니다.", "맛있게 드세요.", "배고파요.", "밥 주세요."], 0,
      { en: "\"잘 먹겠습니다\" (literally \"I will eat well\") is the set phrase said before a meal — the Korean cousin of Japanese いただきます. The host's answering line is \"맛있게 드세요\" (\"eat well/enjoy\").", es: "\"잘 먹겠습니다\" (literalmente \"comeré bien\") es la frase fija que se dice antes de comer — el primo coreano del いただきます japonés. La respuesta del anfitrión es \"맛있게 드세요\" (\"come bien/disfruta\")." }, "A2"],
    ["Translate: 'Thank you for the meal.' (set phrase, said after eating)", ["잘 먹었습니다.", "잘 먹겠습니다.", "배불러요.", "고맙습니다."], 0,
      { en: "\"잘 먹었습니다\" (literally \"I ate well\") is the after-meal partner of 잘 먹겠습니다 — the fixed thank-you at the end of a meal, like Japanese ごちそうさまでした. Note the only change is 겠 (will) → 었 (did).", es: "\"잘 먹었습니다\" (literalmente \"comí bien\") es la pareja de después de 잘 먹겠습니다 — el agradecimiento fijo al terminar de comer, como el ごちそうさまでした japonés. Nota que lo único que cambia es 겠 (futuro) → 었 (pasado)." }, "A2"],
    // — B1 —
    ["Translate: 'He knows a lot of people/is well-connected.'", ["그는 발이 넓어요.", "그는 사람이 많아요.", "그는 유명해요.", "그는 인기가 많아요."], 0,
      { en: "\"발이 넓다\" (literally \"to have wide feet\") is the standard Korean idiom for being well-connected socially — one of many body-part idioms mapping character onto anatomy.", es: "\"발이 넓다\" (literalmente \"tener pies anchos\") es el modismo coreano estándar para estar bien conectado socialmente — uno de muchos modismos de partes del cuerpo que proyectan el carácter sobre la anatomía." }, "B1"],
    ["Translate: 'He has high standards.'", ["그는 눈이 높아요.", "그는 까다로워요.", "그는 기준이 높아요.", "그는 완벽주의자예요."], 0,
      { en: "\"눈이 높다\" (literally \"to have high eyes\") is the everyday Korean idiom for having high standards, especially about people or things one chooses.", es: "\"눈이 높다\" (literalmente \"tener ojos altos\") es el modismo coreano cotidiano para tener estándares altos, especialmente sobre las personas o cosas que uno elige." }, "B1"],
    ["Translate: 'That's an impossible task.'", ["하늘의 별 따기예요.", "너무 어려운 일이에요.", "불가능한 일이에요.", "정말 힘든 일이에요."], 0,
      { en: "\"하늘의 별 따기\" (literally \"picking a star from the sky\") is the standard Korean idiom for something impossibly difficult.", es: "\"하늘의 별 따기\" (literalmente \"recoger una estrella del cielo\") es el modismo coreano estándar para algo imposiblemente difícil." }, "B1"],
    ["Translate: 'Speak of the devil.' (the person you were discussing appears)", ["호랑이도 제 말 하면 온다.", "소문이 빨라요.", "그 사람이 왔어요.", "우연이에요."], 0,
      { en: "\"호랑이도 제 말 하면 온다\" (literally \"even a tiger comes when you talk about it\") is the Korean equivalent of \"speak of the devil\" — the tiger standing in for the English devil.", es: "\"호랑이도 제 말 하면 온다\" (literalmente \"hasta el tigre viene cuando hablas de él\") es el equivalente coreano de \"hablando del rey de Roma\" — el tigre en el lugar del rey." }, "B1"],
    ["Translate: 'The right words can work wonders.'", ["말 한마디에 천 냥 빚도 갚는다.", "말이 너무 많아요.", "돈을 다 갚았어요.", "말은 정말 중요해요."], 0,
      { en: "\"말 한마디에 천 냥 빚도 갚는다\" (literally \"with one word you can repay even a thousand-nyang debt\") is the classic Korean proverb for the power of the right words — a well-chosen phrase can settle what money can't.", es: "\"말 한마디에 천 냥 빚도 갚는다\" (literalmente \"con una sola palabra puedes saldar hasta una deuda de mil nyang\") es el proverbio coreano clásico sobre el poder de las palabras justas — una frase bien elegida puede resolver lo que el dinero no puede." }, "B1"],
    // — B2 —
    ["Translate: 'She's very generous (with food/portions).'", ["그녀는 손이 커요.", "그녀는 마음이 좋아요.", "그녀는 착해요.", "그녀는 인심이 좋아요."], 0,
      { en: "\"손이 크다\" (literally \"to have big hands\") describes someone generous, especially known for serving big portions or giving freely.", es: "\"손이 크다\" (literalmente \"tener manos grandes\") describe a alguien generoso, especialmente conocido por servir porciones grandes o dar sin reparos." }, "B2"],
    ["Translate: \"Don't count your chickens before they hatch.\"", ["김치국부터 마시지 마세요.", "너무 일찍 기대하지 마세요.", "미리 축하하지 마세요.", "확실하지 않은데 기대하지 마세요."], 0,
      { en: "\"김칫국부터 마신다\" (literally \"to drink the kimchi soup first,\" before the main dish arrives) is the Korean idiom for assuming an outcome before it's certain.", es: "\"김칫국부터 마신다\" (literalmente \"beber primero la sopa de kimchi,\" antes de que llegue el plato principal) es el modismo coreano para dar por hecho un resultado antes de que sea seguro." }, "B2"],
    ["Translate: 'I failed the exam.'", ["시험에서 미역국을 먹었어요.", "시험에서 떨어졌어요.", "시험을 잘 못 봤어요.", "시험 결과가 안 좋아요."], 0,
      { en: "\"미역국을 먹다\" (literally \"to eat seaweed soup\") is a colorful, distinctly Korean idiom for failing an exam — the slippery seaweed evoking \"slipping\" on the test.", es: "\"미역국을 먹다\" (literalmente \"comer sopa de algas\") es un modismo coreano colorido y distintivo para reprobar un examen — las algas resbaladizas evocando \"resbalar\" en la prueba." }, "B2"],
    ["Translate: 'He's blinded by love.'", ["콩깍지가 씌었어요.", "사랑에 눈이 멀었어요.", "너무 사랑에 빠졌어요.", "사랑 때문에 안 보여요."], 0,
      { en: "\"콩깍지가 씌었다\" (literally \"to have a bean-pod shell over one's eyes\") is a vivid, distinctly Korean idiom for being blinded by love or infatuation.", es: "\"콩깍지가 씌었다\" (literalmente \"tener una vaina de frijol sobre los ojos\") es un modismo coreano vívido y distintivo para estar cegado por el amor o el enamoramiento." }, "B2"],
    ["Translate: 'Well begun is half done.'", ["시작이 반이다.", "반쯤 끝났어요.", "빨리 시작하세요.", "시작이 중요해요."], 0,
      { en: "\"시작이 반이다\" (literally \"the beginning is half\") is the go-to Korean proverb for encouraging someone to just start — the hardest part is often getting going.", es: "\"시작이 반이다\" (literalmente \"el comienzo es la mitad\") es el proverbio coreano predilecto para animar a alguien a simplemente empezar — lo más difícil suele ser arrancar." }, "B2"],
    ["Translate: 'It's out of my reach / a pie in the sky.'", ["그림의 떡이에요.", "너무 비싸요.", "살 수 없어요.", "꿈일 뿐이에요."], 0,
      { en: "\"그림의 떡\" (literally \"a rice cake in a painting\") is the Korean idiom for something desirable but unattainable — you can see it, but never taste it.", es: "\"그림의 떡\" (literalmente \"un pastel de arroz en un cuadro\") es el modismo coreano para algo deseable pero inalcanzable — puedes verlo, pero nunca probarlo." }, "B2"],
    // — C1 —
    ["Translate: 'After hardship comes reward.' (four-character idiom)", ["고진감래 (苦盡甘來).", "힘든 후에 좋아져요.", "참으면 복이 와요.", "노력하면 성공해요."], 0,
      { en: "\"고진감래\" (literally \"bitterness ends, sweetness comes\") is a 사자성어 — a four-character Sino-Korean idiom, the Korean analogue of Japanese yojijukugo. This whole class of compressed classical expressions is a C1+ literacy marker.", es: "\"고진감래\" (literalmente \"acaba lo amargo, llega lo dulce\") es un 사자성어 — un modismo sino-coreano de cuatro caracteres, el análogo coreano del yojijukugo japonés. Toda esta clase de expresiones clásicas comprimidas es un marcador de dominio C1+." }, "C1"],
    ["Translate: 'A blessing in disguise / you never know your luck.'", ["새옹지마 (塞翁之馬).", "운이 나빠요.", "나중에 좋아질 거예요.", "걱정하지 마세요."], 0,
      { en: "\"새옹지마\" (literally \"the old man of the frontier's horse\") is a 사자성어 from the classic parable where each turn of fortune, good or bad, flips into its opposite — good luck and bad luck can't be judged in the moment.", es: "\"새옹지마\" (literalmente \"el caballo del anciano de la frontera\") es un 사자성어 de la parábola clásica donde cada giro de la fortuna, bueno o malo, se convierte en su opuesto — la buena y la mala suerte no pueden juzgarse en el momento." }, "C1"],
    ["Translate: 'A rule can be twisted to mean whatever suits you.'", ["귀에 걸면 귀걸이, 코에 걸면 코걸이.", "규칙이 애매해요.", "마음대로 해석해요.", "상황에 따라 달라요."], 0,
      { en: "\"귀에 걸면 귀걸이, 코에 걸면 코걸이\" (literally \"hang it on the ear, it's an earring; hang it on the nose, it's a nose ring\") is the Korean idiom for a rule or statement so vague it can be bent to mean anything.", es: "\"귀에 걸면 귀걸이, 코에 걸면 코걸이\" (literalmente \"cuélgalo en la oreja, es un arete; cuélgalo en la nariz, es un aro nasal\") es el modismo coreano para una regla o afirmación tan vaga que puede torcerse para significar cualquier cosa." }, "C1"],
    // — C2 —
    ["Translate: 'A frog in a well knows nothing of the sea.' (narrow worldview)", ["우물 안 개구리예요.", "세상을 잘 몰라요.", "시야가 좁아요.", "경험이 없어요."], 0,
      { en: "\"우물 안 개구리\" (literally \"a frog in a well\") is the standard idiom for someone whose small world convinces them they've seen it all — shared with Japanese 井の中の蛙 and the same classical Chinese source.", es: "\"우물 안 개구리\" (literalmente \"una rana en un pozo\") es el modismo estándar para quien cree haberlo visto todo desde su mundo pequeño — compartido con el 井の中の蛙 japonés y la misma fuente clásica china." }, "C2"],
    ["Translate: 'We overlook what's right under our nose.'", ["등잔 밑이 어둡다.", "가까운 것을 놓쳐요.", "잘 안 보여요.", "멀리 봐야 해요."], 0,
      { en: "\"등잔 밑이 어둡다\" (literally \"it's dark beneath the lamp\") is the vivid Korean proverb for missing what's closest to you — an oil lamp lights the whole room but casts a shadow directly below itself.", es: "\"등잔 밑이 어둡다\" (literalmente \"debajo de la lámpara está oscuro\") es el vívido proverbio coreano para pasar por alto lo que tienes más cerca — una lámpara de aceite ilumina toda la sala pero deja sombra justo debajo de sí misma." }, "C2"],
  ],
};

// Korean phonetics: batchim (a syllable's final consonant) links onto a
// following vowel (resyllabification); neighboring consonants assimilate,
// tense, and nasalize each other; ㅎ weakens before vowels but aspirates a
// following stop; ㄷ/ㅌ palatalize before 이; and ㄴ can be inserted at
// compound boundaries. Almost none of this shows in the hangul spelling —
// which is exactly why it's its own category.
const FONO_BANK = [
  // — A2: the sounds you meet on day one —
  { text: "좋아요. (Joayo.)", sound: "JOH-ah-yo (the ㅎ weakens before the vowel)", difficulty: "A2",
    identify: { options: ["좋아요.", "좋아해요.", "조아요.", "좋았어요."], correctIdx: 0,
      explain: { en: "The batchim ㅎ in '좋' weakens or disappears before the following vowel-starting syllable, softening the pronunciation rather than keeping a hard 'h' sound — 좋아요 comes out close to \"joayo.\"", es: "El batchim ㅎ en '좋' se debilita o desaparece ante la siguiente sílaba que empieza en vocal, suavizando la pronunciación en vez de mantener una 'h' dura — 좋아요 sale cercano a \"joayo.\"" } },
    respond: { options: ["저도 좋아해요!", "얼마예요?", "언제예요?", "누구예요?"], correctIdx: 0,
      explain: { en: "Someone saying they like something invites a friendly \"저도 좋아해요! (I like it too!)\".", es: "Que alguien diga que le gusta algo invita a un amistoso \"저도 좋아해요! (¡a mí también me gusta!)\"." } } },
  { text: "안녕히 가세요. (Annyeonghi gaseyo.)", sound: "an-nyeong-hi GA-se-yo (said to someone LEAVING)", difficulty: "A2",
    identify: { options: ["안녕히 가세요. (to someone leaving — \"go in peace\")", "안녕히 계세요. (to someone staying — \"stay in peace\")", "안녕하세요. (hello)", "어서 오세요. (welcome)"], correctIdx: 0,
      explain: { en: "Korean has two goodbyes depending on who moves: 안녕히 가세요 (\"go well\") to the person leaving, 안녕히 계세요 (\"stay well\") to the person staying. Say the wrong one and you've told the host to leave their own home.", es: "El coreano tiene dos despedidas según quién se mueve: 안녕히 가세요 (\"ve bien\") a quien se va, 안녕히 계세요 (\"quédate bien\") a quien se queda. Di la equivocada y le has dicho al anfitrión que se vaya de su propia casa." } },
    respond: { options: ["네, 안녕히 계세요!", "처음 뵙겠습니다.", "얼마예요?", "잘 먹겠습니다."], correctIdx: 0,
      explain: { en: "If they tell you \"go well,\" you answer with the stay-well form back: \"안녕히 계세요!\"", es: "Si te dicen \"ve bien,\" respondes con la forma de quedarse bien: \"안녕히 계세요!\"" } } },
  // — B1: batchim links forward —
  { text: "있어요. (Isseoyo.)", sound: "ee-SSEO-yo (not \"it-seo-yo\")", difficulty: "B1",
    identify: { options: ["있어요.", "없어요.", "이거예요.", "있었어요."], correctIdx: 0,
      explain: { en: "The batchim ㅆ of '있' links over onto the vowel-starting syllable '어' that follows, producing \"ee-SSEO-yo\" rather than a choppy \"it-seo-yo.\"", es: "El batchim ㅆ de '있' se enlaza con la siguiente sílaba que empieza en vocal '어', produciendo \"ee-SSEO-yo\" en vez de un \"it-seo-yo\" entrecortado." } },
    respond: { options: ["다행이에요!", "얼마예요?", "어디예요?", "몇 시예요?"], correctIdx: 0,
      explain: { en: "Hearing that something is available/exists invites a relieved \"다행이에요! (what a relief!)\".", es: "Oír que algo está disponible/existe invita a un aliviado \"다행이에요! (¡qué alivio!)\"." } } },
  { text: "한국어. (Hangugeo.)", sound: "han-GU-geo (batchim ㄱ links forward)", difficulty: "B1",
    identify: { options: ["한국어.", "한국인.", "한국말.", "한국 사람."], correctIdx: 0,
      explain: { en: "The batchim ㄱ at the end of '국' links onto the following vowel-starting syllable '어', the same resyllabification pattern as 있어요 — han-gu-geo, not \"han-guk-eo.\"", es: "El batchim ㄱ al final de '국' se enlaza con la siguiente sílaba que empieza en vocal '어', el mismo patrón de resilabificación que 있어요 — han-gu-geo, no \"han-guk-eo.\"" } },
    respond: { options: ["저도 배우고 있어요!", "그거 얼마예요?", "몇 시예요?", "어디에서 왔어요?"], correctIdx: 0,
      explain: { en: "A comment about the Korean language invites a relatable \"저도 배우고 있어요! (I'm learning it too!)\".", es: "Un comentario sobre el idioma coreano invita a un cercano \"저도 배우고 있어요! (¡yo también lo estoy aprendiendo!)\"." } } },
  // — B2: consonants reshape each other —
  { text: "학교. (Hakgyo.)", sound: "hak-KYO (tensed consonant)", difficulty: "B2",
    identify: { options: ["학교.", "학생.", "학원.", "하교."], correctIdx: 0,
      explain: { en: "The ㄱ+ㄱ cluster tenses into a harder, sharper sound (\"kk\") — a common pattern where neighboring consonants tighten each other's pronunciation.", es: "El grupo ㄱ+ㄱ se tensa en un sonido más duro y agudo (\"kk\") — un patrón común donde las consonantes vecinas tensan la pronunciación de la otra." } },
    respond: { options: ["몇 시에 가요?", "얼마나 걸려요?", "재미있어요?", "선생님은 어때요?"], correctIdx: 0,
      explain: { en: "Mentioning school invites a practical follow-up, like \"몇 시에 가요? (what time do you go?)\".", es: "Mencionar la escuela invita a un seguimiento práctico, como \"몇 시에 가요? (¿a qué hora vas?)\"." } } },
  { text: "값이 얼마예요? (Gapsi eolmayeyo?)", sound: "GAP-shi (the ㅄ cluster: ㅅ links onto 이 → \"gap-shi\")", difficulty: "B2",
    identify: { options: ["값이 (gapsi, \"the price\" — ㅄ double batchim)", "가비 (not a word)", "갑시 spelled as said", "갑이 (a misspelling)"], correctIdx: 0,
      explain: { en: "값 has a double batchim (겹받침) ㅄ. Alone it simplifies to just ㅂ (값 → \"gap\"), but before the particle 이 the trailing ㅅ links onto the vowel and even tenses: 값이 → \"gap-shi.\" Double batchim behave differently depending on what follows.", es: "값 tiene un batchim doble (겹받침) ㅄ. Solo se simplifica a ㅂ (값 → \"gap\"), pero ante la partícula 이 la ㅅ final se enlaza con la vocal e incluso se tensa: 값이 → \"gap-shi.\" Los batchim dobles se comportan distinto según lo que siga." } },
    respond: { options: ["만 원이에요.", "제 이름이에요.", "저기 있어요.", "내일 가요."], correctIdx: 0,
      explain: { en: "\"How much is it?\" wants a price back — \"만 원이에요 (it's 10,000 won).\"", es: "\"¿Cuánto cuesta?\" pide un precio de vuelta — \"만 원이에요 (son 10.000 wones).\"" } } },
  { text: "딸이에요. (Ttarieyo.)", sound: "TTAL (tense ㄸ — throat tight, no puff of air)", difficulty: "B2",
    identify: { options: ["딸 (ttal, daughter — tense ㄸ)", "탈 (tal, mask — aspirated ㅌ)", "달 (dal, moon — plain ㄷ)", "딸기 (ttalgi, strawberry)"], correctIdx: 0,
      explain: { en: "Korean stops come in a three-way set English lacks: plain 달 (dal, moon), aspirated 탈 (tal, mask — a puff of air), and tense 딸 (ttal, daughter — throat tightened, no puff). This ㄷ/ㅌ/ㄸ contrast (and its ㅂ/ㅍ/ㅃ, ㄱ/ㅋ/ㄲ, ㅈ/ㅊ/ㅉ cousins) is the single hardest thing for English ears.", es: "Las oclusivas coreanas vienen en un juego triple que el inglés no tiene: simple 달 (dal, luna), aspirada 탈 (tal, máscara — un soplo de aire), y tensa 딸 (ttal, hija — garganta tensa, sin soplo). Este contraste ㄷ/ㅌ/ㄸ (y sus primos ㅂ/ㅍ/ㅃ, ㄱ/ㅋ/ㄲ, ㅈ/ㅊ/ㅉ) es lo más difícil para el oído angloparlante." } },
    respond: { options: ["몇 살이에요?", "무슨 색이에요?", "얼마예요?", "어디에 있어요?"], correctIdx: 0,
      explain: { en: "Being introduced to someone's daughter invites a warm \"몇 살이에요? (how old is she?)\".", es: "Que te presenten a la hija de alguien invita a un cálido \"몇 살이에요? (¿cuántos años tiene?)\"." } } },
  { text: "국물이 맛있어요. (Gungmuri masisseoyo.)", sound: "GUNG-mul (ㄱ becomes 'ng' before ㅁ)", difficulty: "B2",
    identify: { options: ["국물 — pronounced 궁물 (gungmul), \"broth\"", "국물 — pronounced letter-by-letter as \"guk-mul\"", "군물 (a different word)", "국무 (state affairs)"], correctIdx: 0,
      explain: { en: "Obstruent nasalization: a ㄱ before ㅁ or ㄴ turns into ㅇ (ng). 국물 → 궁물, 한국말 → 한궁말, 십만 → 심만. Reading it stiffly as \"guk-mul\" is a classic learner tell — the spelling won't warn you.", es: "Nasalización de obstruyentes: una ㄱ ante ㅁ o ㄴ se vuelve ㅇ (ng). 국물 → 궁물, 한국말 → 한궁말, 십만 → 심만. Leerlo rígido como \"guk-mul\" delata al principiante — la ortografía no te avisa." } },
    respond: { options: ["정말 시원하네요!", "얼마예요?", "몇 개예요?", "어디에서 샀어요?"], correctIdx: 0,
      explain: { en: "Praising a broth invites agreement — and 시원하다 is exactly the word Koreans use for a good hot soup: \"정말 시원하네요! (so refreshing!)\".", es: "Elogiar un caldo invita a coincidir — y 시원하다 es justo la palabra que los coreanos usan para una buena sopa caliente: \"정말 시원하네요! (¡qué reconfortante!)\"." } } },
  // — C1: cross-syllable assimilation —
  { text: "신라 시대. (Silla sidae.)", sound: "SIL-la (신라 is said \"Silla,\" not \"Sin-ra\")", difficulty: "C1",
    identify: { options: ["신라 — pronounced 실라 (Silla)", "신라 — pronounced 신라 (Sin-ra), each letter", "실라 (already respelled)", "신나 (sinna, thinner)"], correctIdx: 0,
      explain: { en: "Lateralization: ㄴ next to ㄹ becomes ㄹ, giving a doubled ㄹㄹ. 신라 → 실라 (Silla), 연락 → 열락, 설날 → 설랄. This is exactly why the dynasty is romanized \"Silla,\" never \"Sinra.\"", es: "Lateralización: ㄴ junto a ㄹ se vuelve ㄹ, dando un ㄹㄹ doble. 신라 → 실라 (Silla), 연락 → 열락, 설날 → 설랄. Por eso mismo la dinastía se romaniza \"Silla,\" nunca \"Sinra.\"" } },
    respond: { options: ["역사에 관심이 많으시네요.", "몇 시예요?", "얼마예요?", "저도 신나요!"], correctIdx: 0,
      explain: { en: "A mention of the Silla era invites \"역사에 관심이 많으시네요 (you must be into history).\" The 신나요 option is a trap — it only sounds similar.", es: "Mencionar la era Silla invita a \"역사에 관심이 많으시네요 (te interesa mucho la historia).\" La opción 신나요 es una trampa — solo suena parecido." } } },
  { text: "같이 가요. (Gachi gayo.)", sound: "GA-chi (같이 is said \"gachi,\" not \"gat-i\")", difficulty: "C1",
    identify: { options: ["같이 — pronounced 가치 (gachi), \"together\"", "같이 — pronounced 가티 (gati)", "가치 (gachi, \"value\" — different word, same sound)", "가지 (gaji, eggplant)"], correctIdx: 0,
      explain: { en: "Palatalization: ㄷ/ㅌ before the vowel 이 shift to ㅈ/ㅊ. 같이 → 가치, 굳이 → 구지, 해돋이 → 해도지. A side effect: 같이 (together) and 가치 (value) become perfect homophones — context alone tells them apart.", es: "Palatalización: ㄷ/ㅌ ante la vocal 이 pasan a ㅈ/ㅊ. 같이 → 가치, 굳이 → 구지, 해돋이 → 해도지. Efecto secundario: 같이 (juntos) y 가치 (valor) se vuelven homófonos perfectos — solo el contexto los separa." } },
    respond: { options: ["네, 좋아요! 같이 가요.", "혼자 가세요.", "가치가 높아요.", "가지를 사요."], correctIdx: 0,
      explain: { en: "\"Let's go together\" invites an eager \"네, 좋아요! (yes, great!)\". The 가치/가지 options are homophone/near-homophone traps.", es: "\"Vamos juntos\" invita a un entusiasta \"네, 좋아요! (¡sí, genial!)\". Las opciones 가치/가지 son trampas homófonas/casi homófonas." } } },
  // — C2: the most opaque changes —
  { text: "좋다. (Jota.)", sound: "JO-ta (ㅎ + ㄷ merge into an aspirated ㅌ)", difficulty: "C2",
    identify: { options: ["좋다 — pronounced 조타 (jota)", "좋다 — pronounced 졷다 (jot-da)", "조타 (already respelled)", "좋아 (joa)"], correctIdx: 0,
      explain: { en: "ㅎ-aspiration: a ㅎ batchim doesn't vanish before a plain stop — it fuses with it into the aspirated version. 좋다 → 조타, 축하 → 추카, 백화점 → 배콰점, 급히 → 그피. The ㅎ 'spends itself' aspirating the next consonant.", es: "Aspiración de ㅎ: un batchim ㅎ no desaparece ante una oclusiva simple — se fusiona con ella en su versión aspirada. 좋다 → 조타, 축하 → 추카, 백화점 → 배콰점, 급히 → 그피. La ㅎ 'se gasta' aspirando la consonante siguiente." } },
    respond: { options: ["다행이네요!", "얼마예요?", "몇 명이에요?", "언제 가요?"], correctIdx: 0,
      explain: { en: "Someone saying \"좋다 (it's good)\" invites a shared \"다행이네요! (that's a relief / good to hear!)\".", es: "Que alguien diga \"좋다 (está bien)\" invita a un compartido \"다행이네요! (¡qué alivio / me alegro!)\"." } } },
  { text: "색연필. (Saengnyeonpil.)", sound: "saeng-NYEON-pil (an extra ㄴ appears, then nasalizes)", difficulty: "C2",
    identify: { options: ["색연필 — pronounced 생년필 (saengnyeonpil)", "색연필 — pronounced 새견필 (saegyeonpil)", "생연필 (already respelled)", "색년필 (partial respelling)"], correctIdx: 0,
      explain: { en: "ㄴ-insertion: at a compound boundary before 이/야/여/요/유, an extra ㄴ appears — 색 + 연필 → 색년필 — and the ㄱ then nasalizes to ㅇ: 생년필. Also 나뭇잎 → 나문닙, 한여름 → 한녀름, 담요 → 담뇨. The most opaque common change; spelling gives almost no hint.", es: "Inserción de ㄴ: en un límite de compuesto ante 이/야/여/요/유, aparece una ㄴ extra — 색 + 연필 → 색년필 — y la ㄱ luego se nasaliza a ㅇ: 생년필. También 나뭇잎 → 나문닙, 한여름 → 한녀름, 담요 → 담뇨. El cambio común más opaco; la ortografía casi no da pista." } },
    respond: { options: ["몇 자루 필요해요?", "무슨 색이에요?", "얼마나 커요?", "누구 거예요?"], correctIdx: 0,
      explain: { en: "Colored pencils invite \"몇 자루 필요해요? (how many do you need?)\", counted with 자루, the counter for pen-like things.", es: "Los lápices de colores invitan a \"몇 자루 필요해요? (¿cuántos necesitas?)\", contados con 자루, el contador de objetos tipo lápiz." } } },
];

const koForEn = {
  id: "ko-for-en",
  label: "한국어",
  nameEn: "Korean",
  nameEs: "Coreano",
  sublabel: "For English speakers · Korean",
  nativeLang: "en",
  targetLang: "ko",
  theme: "korea-hanbok",
  cats: CATS,
  bank: { ...BANK, fvocab: buildFrequencyBank(WORDS, { seed: 20260714, formulas: KO_FORMULAS }) },
  wbCatId: "fvocab",
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "발음의 목표를 읽어 보세요. 뭐라고 하는 거예요? (Bareumui mokpyoreul ilgeo boseyo. Mworago haneun geoyeyo?)",
    identifyPromptNative: { en: "Read the approximate pronunciation. What does it say?" },
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — 어떤 대답이 어울려요? (eotteon daedabi eoullyeoyo?)`,
    respondPromptNative: (i) => ({ en: `"${i.text}" — which response fits?` }),
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 35,
  extraQuestionTime: 35,
};

export default koForEn;

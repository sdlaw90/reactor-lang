// Track: Mandarin Chinese, for an English speaker. Full depth (36 items).
// Native script (hanzi) + pinyin shown together, per explicit design
// decision. Tones are represented with standard pinyin diacritics (ā á ǎ à)
// — the normal, established way to write tones in pinyin, so no new
// phonetic system was needed. Categories: vocab (basics + culturally rich
// words), gram (no verb conjugation at all, aspect particles instead of
// tense, required measure words/classifiers, topic-comment structure, tone
// sandhi as a grammar-adjacent rule), trad (idioms/chengyu), and fono (tone
// sandhi in context, neutral tone, retroflex consonants).

const CATS = {
  vocab: { label: "词汇 (Cíhuì)", color: "#3DDBFF" },
  gram: { label: "语法 (Yǔfǎ)", color: "#FFB84D" },
  trad: { label: "成语 (Chéngyǔ)", color: "#FF3D7F" },
  fono: { label: "发音 (Fāyīn)", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'你好 (nǐ hǎo)' means...", ["hello", "goodbye", "thank you", "please"], 0,
      { en: "'你好' (literally \"you good\") is the standard everyday greeting.", es: "'你好' (literalmente \"tú bien\") es el saludo cotidiano estándar." }, "A1"],
    ["'谢谢 (xièxiè)' means...", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'谢谢' is thank you — one of the most essential words to know.", es: "'谢谢' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'朋友 (péngyǒu)' means...", ["friend", "enemy", "neighbor", "coworker"], 0,
      { en: "'朋友' means friend.", es: "'朋友' significa amigo." }, "A1"],
    ["'窗户 (chuānghù)' means...", ["window", "door", "wall", "floor"], 0,
      { en: "'窗户' means window.", es: "'窗户' significa ventana." }, "A2"],
    ["'家庭 (jiātíng)' means...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'家庭' means family (as a household unit).", es: "'家庭' significa familia (como unidad doméstica)." }, "A2"],
    ["'工作 (gōngzuò)' means...", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'工作' means work or job — used as both a noun and a verb.", es: "'工作' significa trabajo — se usa tanto como sustantivo como verbo." }, "A2"],
    ["'老师 (lǎoshī)' means...", ["teacher", "student", "classmate", "principal"], 0,
      { en: "'老师' means teacher — also used respectfully to address someone knowledgeable, somewhat similar to (though less broadly applied than) Japanese 'sensei'.", es: "'老师' significa maestro/a — también se usa respetuosamente para dirigirse a alguien con conocimiento, algo similar a (aunque menos aplicado ampliamente que) el 'sensei' japonés." }, "B1"],
    ["'没关系 (méi guānxi)' means...", ["\"it's okay/no problem/never mind\"", "\"absolutely not\"", "\"I don't understand\"", "\"please wait\""], 0,
      { en: "'没关系' is an extremely common, versatile phrase (literally \"no relation/connection\") used to say something doesn't matter or isn't a problem.", es: "'没关系' es una frase extremadamente común y versátil (literalmente \"sin relación\") usada para decir que algo no importa o no es un problema." }, "B1"],
    ["'麻烦 (máfan)' means...", ["trouble/troublesome (noun, adjective, or verb)", "easy/simple", "expensive", "urgent"], 0,
      { en: "'麻烦' means trouble or troublesome, and can also work as a verb meaning \"to bother/trouble someone\" — quite flexible in how it's used.", es: "'麻烦' significa problema o problemático, y también puede funcionar como verbo con el significado de \"molestar a alguien\" — bastante flexible en su uso." }, "B1"],
    ["'关系 (guānxi)' means...", ["relationship/connections (with real social weight)", "family only", "coincidence", "distance"], 0,
      { en: "'关系' literally means \"relationship,\" but carries real cultural weight in Chinese business and social life — having good 'guānxi' with someone implies mutual obligation and trust that goes beyond the literal English translation.", es: "'关系' literalmente significa \"relación,\" pero conlleva un peso cultural real en la vida social y de negocios china — tener buen 'guānxi' con alguien implica obligación mutua y confianza que va más allá de la traducción literal al inglés." }, "B2"],
    ["'加油 (jiāyóu)' means...", ["\"go for it!/you can do it!\"", "\"add fuel (literal only)\"", "\"good luck\" (formal)", "\"congratulations\""], 0,
      { en: "Literally \"add oil/fuel,\" '加油' is an extremely common everyday cheer of encouragement, shouted at sports events, before exams, or just to root for a friend.", es: "Literalmente \"añadir aceite/combustible,\" '加油' es una porra de ánimo extremadamente común y cotidiana, gritada en eventos deportivos, antes de exámenes, o simplemente para apoyar a un amigo." }, "B1"],
    ["'马马虎虎 (mǎmǎhūhū)' means...", ["so-so/mediocre", "excellent", "terrible", "confusing"], 0,
      { en: "Literally \"horse horse tiger tiger,\" this playful reduplicated expression means \"so-so\" or \"just okay\" — a fun example of how Chinese sometimes builds meaning through repetition and unrelated-sounding word pairs.", es: "Literalmente \"caballo caballo tigre tigre,\" esta expresión reduplicada juguetona significa \"así así\" o \"apenas bien\" — un ejemplo divertido de cómo el chino a veces construye significado mediante la repetición y pares de palabras de sonido no relacionado." }, "B2"],
  ],
  gram: [
    ["我吃苹果。(Wǒ chī píngguǒ.)", ["✓ correct — same verb form for any tense/person", "wrong tense", "wrong person", "missing a word"], 0,
      { en: "Mandarin verbs never conjugate — '吃' (eat) looks exactly the same whether it's \"I eat,\" \"she eats,\" \"we ate,\" or \"they will eat.\" Time and context (or particles) carry that information instead.", es: "Los verbos del mandarín nunca se conjugan — '吃' (comer) se ve exactamente igual sea \"como,\" \"ella come,\" \"comimos,\" o \"comerán.\" El tiempo y el contexto (o partículas) llevan esa información en su lugar." }, "A2"],
    ["我吃___苹果了。(Wǒ chī ___ píngguǒ le.)", ["了 (le)", "过 (guo)", "在 (zài)", "着 (zhe)"], 0,
      { en: "'了' marks a completed action — since English verb tense doesn't exist in Mandarin, particles like this carry that meaning instead.", es: "'了' marca una acción completada — como el tiempo verbal en inglés no existe en mandarín, partículas como esta llevan ese significado en su lugar." }, "B1"],
    ["我去___中国。(Wǒ qù ___ Zhōngguó.)", ["过 (guo)", "了 (le)", "在 (zài)", "着 (zhe)"], 0,
      { en: "'过' specifically marks past experience (\"I have been to China [before], at some point\") — a distinct aspect from simple completion marked by '了'.", es: "'过' marca específicamente experiencia pasada (\"he estado en China [antes], en algún momento\") — un aspecto distinto de la simple finalización marcada por '了'." }, "B2"],
    ["我有三___书。(Wǒ yǒu sān ___ shū.)", ["本 (běn)", "个 (gè)", "只 (zhī)", "张 (zhāng)"], 0,
      { en: "Mandarin requires a measure word (classifier) between a number and a noun — '本' specifically classifies bound volumes like books, a grammatical category English doesn't have at all.", es: "El mandarín requiere una palabra medida (clasificador) entre un número y un sustantivo — '本' clasifica específicamente volúmenes encuadernados como libros, una categoría gramatical que el inglés no tiene en absoluto." }, "B1"],
    ["这个电影,我看过了。(Zhège diànyǐng, wǒ kànguò le.)", ["✓ correct — topic-comment structure", "incorrect word order", "wrong particle", "missing a word"], 0,
      { en: "Mandarin often fronts the topic of a sentence (\"this movie...\") before commenting on it (\"...I've already seen it\") — a structure called topic-comment, distinct from English's more rigid subject-first order.", es: "El mandarín a menudo antepone el tema de una oración (\"esta película...\") antes de comentar sobre él (\"...ya la he visto\") — una estructura llamada tema-comentario, distinta del orden más rígido de sujeto primero del inglés." }, "B2"],
    ["你好___? (Nǐ hǎo ___?)", ["吗 (ma)", "呢 (ne)", "吧 (ba)", "啊 (a)"], 0,
      { en: "The particle '吗' at the end turns a statement into a yes/no question — Mandarin doesn't need to invert word order like English does.", es: "La partícula '吗' al final convierte una afirmación en una pregunta de sí/no — el mandarín no necesita invertir el orden de las palabras como el inglés." }, "A2"],
    ["我___吃早饭。(Wǒ ___ chī zǎofàn.)", ["没 (méi)", "不 (bù)", "别 (bié)", "无 (wú)"], 0,
      { en: "Mandarin has two different negation words depending on aspect: '没' negates a completed/past action (\"haven't eaten yet\"), while '不' negates general states or habitual/future actions — a distinction English's single \"not\" doesn't make.", es: "El mandarín tiene dos palabras de negación distintas según el aspecto: '没' niega una acción completada/pasada (\"no he comido todavía\"), mientras que '不' niega estados generales o acciones habituales/futuras — una distinción que el \"not\" único del inglés no hace." }, "B2"],
    ["你好 (nǐ hǎo) is actually pronounced...", ["ní hǎo (2nd tone + 3rd tone)", "nǐ hǎo (as written, 3rd + 3rd)", "nī hǎo (1st tone + 3rd tone)", "nì hǎo (4th tone + 3rd tone)"], 0,
      { en: "Tone sandhi: when two 3rd-tone syllables occur in a row, the first one automatically changes to a 2nd tone in actual speech — so 'nǐ hǎo' as written is really pronounced 'ní hǎo'.", es: "Sandhi tonal: cuando dos sílabas de 3er tono ocurren seguidas, la primera cambia automáticamente a 2do tono en el habla real — así que 'nǐ hǎo' como se escribe en realidad se pronuncia 'ní hǎo'." }, "B2"],
    ["我有一___朋友。(Wǒ yǒu yí ___ péngyǒu.)", ["个 (gè)", "本 (běn)", "只 (zhī)", "张 (zhāng)"], 0,
      { en: "'个' is the general, default measure word usable for a huge range of nouns (including people) when a more specific classifier doesn't apply or isn't known.", es: "'个' es la palabra medida general y predeterminada, utilizable para una gran variedad de sustantivos (incluidas personas) cuando no aplica o no se conoce un clasificador más específico." }, "A2"],
  ],
  trad: [
    ["Translate: 'To overdo/ruin something by adding unnecessary detail.'", ["画蛇添足 (Huàshétiānzú)", "做得太多了 (Zuò de tài duō le)", "过分装饰 (Guòfèn zhuāngshì)", "多此一举 (Duōcǐyìjǔ, similar meaning)"], 0,
      { en: "\"画蛇添足\" (literally \"to draw a snake and add feet\") is a classic chengyu (four-character idiom) for ruining something by adding unnecessary, excessive detail.", es: "\"画蛇添足\" (literalmente \"dibujar una serpiente y añadirle patas\") es un chengyu clásico (modismo de cuatro caracteres) para arruinar algo al añadir detalles innecesarios y excesivos." }, "B2"],
    ["Translate: 'Talking to a wall/wasting your breath on someone who won't get it.'", ["对牛弹琴 (Duìniútánqín)", "浪费时间说话 (Làngfèi shíjiān shuōhuà)", "没人听我的 (Méi rén tīng wǒ de)", "说了也没用 (Shuōle yě méiyòng)"], 0,
      { en: "\"对牛弹琴\" (literally \"to play the lute to a cow\") is the standard chengyu for wasting effort explaining something to someone who fundamentally won't understand.", es: "\"对牛弹琴\" (literalmente \"tocar el laúd para una vaca\") es el chengyu estándar para desperdiciar esfuerzo explicando algo a alguien que fundamentalmente no lo entenderá." }, "B2"],
    ["Translate: 'A blessing in disguise.'", ["塞翁失马 (Sàiwēngshīmǎ)", "因祸得福 (Yīnhuòdéfú, similar meaning)", "坏事变好事 (Huàishì biàn hǎoshì)", "转祸为福 (Zhuǎnhuòwéifú, similar meaning)"], 0,
      { en: "\"塞翁失马\" (literally \"the old man at the frontier loses his horse\") references a famous parable where an apparent misfortune eventually leads to good luck — the standard chengyu for \"a blessing in disguise.\"", es: "\"塞翁失马\" (literalmente \"el viejo de la frontera pierde su caballo\") hace referencia a una fábula famosa donde una aparente desgracia eventualmente trae buena suerte — el chengyu estándar para \"una bendición disfrazada\"." }, "B2"],
    ["Translate: 'When in Rome, do as the Romans do.'", ["入乡随俗 (Rùxiāngsuísú)", "跟着大家做 (Gēnzhe dàjiā zuò)", "适应当地文化 (Shìyìng dāngdì wénhuà)", "做当地人做的 (Zuò dāngdìrén zuò de)"], 0,
      { en: "\"入乡随俗\" (literally \"enter the village, follow its customs\") is the Chinese equivalent of \"when in Rome.\"", es: "\"入乡随俗\" (literalmente \"entra al pueblo, sigue sus costumbres\") es el equivalente chino de \"a donde fueres, haz lo que vieres\"." }, "B1"],
    ["Translate: 'To kill two birds with one stone.'", ["一举两得 (Yìjǔliǎngdé)", "一次做两件事 (Yícì zuò liǎng jiàn shì)", "两个一起完成 (Liǎng gè yìqǐ wánchéng)", "同时解决两个 (Tóngshí jiějué liǎng gè)"], 0,
      { en: "\"一举两得\" (literally \"one action, two gains\") is the standard chengyu for accomplishing two things with a single effort.", es: "\"一举两得\" (literalmente \"una acción, dos ganancias\") es el chengyu estándar para lograr dos cosas con un solo esfuerzo." }, "B1"],
    ["Translate: 'The tip of the iceberg.'", ["冰山一角 (Bīngshānyìjiǎo)", "问题的开始 (Wèntí de kāishǐ)", "只是一部分 (Zhǐshì yí bùfèn)", "表面的问题 (Biǎomiàn de wèntí)"], 0,
      { en: "\"冰山一角\" (literally \"one corner of an iceberg\") is used exactly like the English idiom, for a small visible part of a much bigger hidden issue.", es: "\"冰山一角\" (literalmente \"una esquina de un iceberg\") se usa exactamente como el modismo inglés, para una pequeña parte visible de un problema oculto mucho mayor." }, "B1"],
    ["Translate: 'May your wishes come true.' (common blessing)", ["心想事成 (Xīnxiǎngshìchéng)", "祝你好运 (Zhù nǐ hǎoyùn)", "希望你成功 (Xīwàng nǐ chénggōng)", "一切顺利 (Yíqiè shùnlì)"], 0,
      { en: "\"心想事成\" (literally \"heart thinks, matter becomes\") is a common well-wish phrase, especially popular around holidays and birthdays.", es: "\"心想事成\" (literalmente \"el corazón piensa, el asunto se convierte\") es una frase común de buenos deseos, especialmente popular en festividades y cumpleaños." }, "B1"],
  ],
};

// Mandarin phonetics: tone sandhi (two 3rd tones in a row — the first
// becomes 2nd tone), the neutral tone (some syllables lose their tone
// entirely and become light/unstressed), and retroflex consonants (zh/ch/sh,
// tongue curled back) which sound distinctly different from z/c/s.
const FONO_BANK = [
  { text: "你好吗?(Nǐ hǎo ma?)", sound: "actually pronounced: NÍ hǎo ma? (tone sandhi)", difficulty: "B2",
    identify: { options: ["你好吗?", "你很好吗?", "你还好吗?", "你今天好吗?"], correctIdx: 0,
      explain: { en: "Both '你' and '好' are 3rd tone as written, but tone sandhi automatically shifts the first one to 2nd tone in actual speech — 'ní hǎo ma', not 'nǐ hǎo ma'.", es: "Tanto '你' como '好' son 3er tono como se escriben, pero el sandhi tonal cambia automáticamente el primero a 2do tono en el habla real — 'ní hǎo ma', no 'nǐ hǎo ma'." } },
    respond: { options: ["我很好,谢谢!", "多少钱?", "在哪里?", "几点了?"], correctIdx: 0,
      explain: { en: "A question about how you're doing calls for a simple, friendly reply, like \"I'm good, thanks!\"", es: "Una pregunta sobre cómo estás pide una respuesta simple y amistosa, como \"¡estoy bien, gracias!\"" } } },
  { text: "谢谢你。(Xièxiè nǐ.)", sound: "syeh-syeh(neutral) nee", difficulty: "A2",
    identify: { options: ["谢谢你。", "谢谢您。", "谢谢大家。", "谢谢啦。"], correctIdx: 0,
      explain: { en: "The second '谢' loses its full tone and becomes a light, neutral-tone syllable — very common with repeated syllables in casual speech.", es: "El segundo '谢' pierde su tono completo y se vuelve una sílaba ligera de tono neutro — muy común con sílabas repetidas en el habla casual." } },
    respond: { options: ["不客气!", "多少钱?", "对不起。", "再见。"], correctIdx: 0,
      explain: { en: "Being thanked calls for the standard, simple \"you're welcome\" response.", es: "Que te agradezcan pide la respuesta estándar y simple de \"de nada\"." } } },
  { text: "这是什么?(Zhè shì shénme?)", sound: "jer(retroflex) shr(retroflex) shummuh?", difficulty: "B1",
    identify: { options: ["这是什么?", "那是什么?", "这是谁?", "这是哪里?"], correctIdx: 0,
      explain: { en: "'Zh' and 'sh' are retroflex sounds — the tongue curls back further than for English 'j' or 'sh', a distinct consonant series from the flatter z/c/s sounds.", es: "'Zh' y 'sh' son sonidos retroflejos — la lengua se curva más hacia atrás que para la 'j' o 'sh' del inglés, una serie de consonantes distinta de los sonidos más planos z/c/s." } },
    respond: { options: ["这是一本书。", "在那边。", "他是我朋友。", "五块钱。"], correctIdx: 0,
      explain: { en: "Asking what something is calls for a simple identification, like \"it's a book.\"", es: "Preguntar qué es algo pide una identificación simple, como \"es un libro\"." } } },
  { text: "我很好,谢谢。(Wǒ hěn hǎo, xièxiè.)", sound: "wǒ HÉN(sandhi) hǎo, syeh-syeh", difficulty: "B2",
    identify: { options: ["我很好,谢谢。", "我不好,谢谢。", "我很累,谢谢。", "我很忙,谢谢。"], correctIdx: 0,
      explain: { en: "Tone sandhi strikes again: '很' and '好' are both written as 3rd tone, but '很' shifts to 2nd tone in speech since it's followed by another 3rd tone — the same rule as 'nǐ hǎo'.", es: "El sandhi tonal aparece de nuevo: '很' y '好' se escriben ambos como 3er tono, pero '很' cambia a 2do tono en el habla ya que le sigue otro 3er tono — la misma regla que 'nǐ hǎo'." } },
    respond: { options: ["太好了!", "真的吗?", "为什么?", "在哪里?"], correctIdx: 0,
      explain: { en: "Hearing someone's doing well calls for a warm, positive reaction, like \"that's great!\"", es: "Escuchar que alguien está bien pide una reacción cálida y positiva, como \"¡qué bien!\"" } } },
];

const zhForEn = {
  id: "zh-for-en",
  label: "中文",
  nameEn: "Mandarin Chinese",
  nameEs: "Chino Mandarín",
  sublabel: "For English speakers · Mandarin Chinese",
  nativeLang: "en",
  targetLang: "zh",
  theme: "china-lantern",
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

export default zhForEn;

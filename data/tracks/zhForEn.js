// Track: Mandarin Chinese, for an English speaker. Deepened 2026-07-15
// (32 → 78 curated) + Word Bank. Per explicit design decision: native script
// (hanzi) and pinyin are shown TOGETHER in every prompt/option — embedded
// directly in the content strings as "汉字 (pīnyīn)". Tones use standard
// pinyin diacritics (ā á ǎ à) — the established way to write tones, so no new
// phonetic system was needed. Headword pinyin uses CITATION tones; tone
// sandhi (3rd+3rd, 一, 不, half-third, neutral) is taught only in the fono and
// grammar-adjacent items, never silently applied to a headword. Prompt frames
// converge on the target-language convention ('X' 是什么意思？ / 用中文怎么说？),
// matching significa/bedeutet/どういう意味 on the other tracks; the English
// frame lives in the promptNative subtitle. ASCII quotes around headwords, not
// 「」 or 《》 — matches every other track and the TTS quote rules. Categories:
// vocab (basics + culturally weighty words with no clean English equivalent —
// 面子, 缘分, 江湖), gram (no verb conjugation at all, aspect particles instead
// of tense, required measure words, topic-comment, 把/被 constructions,
// complements — the structural heart of the language), trad (chengyu/idioms),
// fono (tone sandhi in context, neutral tone, retroflex consonants, 儿化,
// meaning-bearing tone minimal pairs), plus the generated Word Bank.
//
// TTS note (for the zh TTS pass, NOT handled here): the pinyin parenthetical
// doubles as the intended-reading record for 多音字 heteronyms (行 háng/xíng,
// 觉 jué/jiào, 得 de/dé/děi). Spoken-text derivation strips parentheticals; the
// reading is there when needed. Run `npm run voices:list -- --locale zh-CN`
// FIRST at the TTS pass — expect a different voice-family picture than ru
// (zh likely has Neural2 + Wavenet; watch tone rendering and the en<->zh
// <lang> handoff in the 用中文怎么说 production prompts).

import { buildFrequencyBank } from "../../lib/frequencyVocab";
import WORDS from "../vocab/zhWords";

// Mandarin prompt formulas for the Word Bank generator. Like DE_FORMULAS and
// JA_FORMULAS, no auto-capitalization — the word field is "汉字 (pīnyīn)" and is
// presented as-is; cap() would be a no-op on the script and would wrongly
// uppercase the pinyin. The '用中文怎么说' production rule will need its own SSML
// analogue (English gloss in an en-US <lang> span) at this track's TTS pass —
// same class as ¿Cómo se dice...? / Wie sagt man...? / 何と言いますか.
const ZH_FORMULAS = {
  recognitionPrompt: (w) => `'${w}' 是什么意思？(shì shénme yìsi?)`,
  recognitionNative: (w) => ({ en: `'${w}' means...` }),
  recognitionExplain: (w, g, noteEn) => ({
    en: `'${w}' means ${g}.${noteEn}`,
    es: `'${w}' significa ${g}.`,
  }),
  productionPrompt: (g) => `'${g}' 用中文怎么说？(yòng zhōngwén zěnme shuō?)`,
  productionNative: (g) => ({ en: `How do you say '${g}' in Chinese?` }),
  productionExplain: (w, g, noteEn) => ({
    en: `'${g}' is '${w}'.${noteEn}`,
    es: `'${g}' se dice '${w}'.`,
  }),
};

const CATS = {
  vocab: { label: "词汇 (Cíhuì)", color: "#3DDBFF" },
  gram: { label: "语法 (Yǔfǎ)", color: "#FFB84D" },
  trad: { label: "成语 (Chéngyǔ)", color: "#FF3D7F" },
  fono: { label: "发音 (Fāyīn)", color: "#B98EFF" },
  fvocab: { label: "词库 (Cíkù)", color: "#7BE495" },
};

const BANK = {
  vocab: [
    // — A1 —
    ["'你好 (nǐ hǎo)' 是什么意思？(shì shénme yìsi?)", ["hello", "goodbye", "thank you", "please"], 0,
      { en: "'你好' (literally \"you good\") is the standard everyday greeting.", es: "'你好' (literalmente \"tú bien\") es el saludo cotidiano estándar." }, "A1", null,
      { en: "'你好 (nǐ hǎo)' means..." }],
    ["'谢谢 (xièxiè)' 是什么意思？(shì shénme yìsi?)", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'谢谢' is thank you — one of the most essential words to know.", es: "'谢谢' significa gracias — una de las palabras más esenciales." }, "A1", null,
      { en: "'谢谢 (xièxiè)' means..." }],
    ["'朋友 (péngyǒu)' 是什么意思？(shì shénme yìsi?)", ["friend", "enemy", "neighbor", "coworker"], 0,
      { en: "'朋友' means friend.", es: "'朋友' significa amigo." }, "A1", null,
      { en: "'朋友 (péngyǒu)' means..." }],
    ["'水 (shuǐ)' 是什么意思？(shì shénme yìsi?)", ["water", "fire", "tea", "rice"], 0,
      { en: "'水' means water — a first-day word, and a building block in dozens of compounds (果汁 juice is literally \"fruit water,\" 口水 is saliva).", es: "'水' significa agua — una palabra del primer día, y un bloque de construcción en decenas de compuestos." }, "A1", null,
      { en: "'水 (shuǐ)' means..." }],
    ["'再见 (zàijiàn)' 是什么意思？(shì shénme yìsi?)", ["goodbye", "hello", "welcome", "see you never"], 0,
      { en: "'再见' means goodbye — literally \"again see,\" i.e. \"see you again.\"", es: "'再见' significa adiós — literalmente \"otra vez ver,\" es decir \"nos vemos de nuevo.\"" }, "A1", null,
      { en: "'再见 (zàijiàn)' means..." }],
    // — A2 —
    ["'窗户 (chuānghù)' 是什么意思？(shì shénme yìsi?)", ["window", "door", "wall", "floor"], 0,
      { en: "'窗户' means window.", es: "'窗户' significa ventana." }, "A2", null,
      { en: "'窗户 (chuānghù)' means..." }],
    ["'家庭 (jiātíng)' 是什么意思？(shì shénme yìsi?)", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'家庭' means family, as a household unit — '家 (jiā)' alone means both \"home\" and \"family.\"", es: "'家庭' significa familia, como unidad doméstica — '家 (jiā)' por sí solo significa tanto \"hogar\" como \"familia.\"" }, "A2", null,
      { en: "'家庭 (jiātíng)' means..." }],
    ["'工作 (gōngzuò)' 是什么意思？(shì shénme yìsi?)", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'工作' means work or job — used as both a noun and a verb, with no form change between them.", es: "'工作' significa trabajo — se usa tanto como sustantivo como verbo, sin cambio de forma." }, "A2", null,
      { en: "'工作 (gōngzuò)' means..." }],
    ["'米饭 (mǐfàn)' 是什么意思？(shì shénme yìsi?)", ["cooked rice", "raw rice grain", "noodles", "bread"], 0,
      { en: "'米饭' is cooked rice on the plate; '米 (mǐ)' alone is the uncooked grain and '饭 (fàn)' means a meal — so 吃饭 (\"eat rice\") just means \"to eat a meal.\"", es: "'米饭' es el arroz cocido en el plato; '米 (mǐ)' solo es el grano crudo y '饭 (fàn)' significa comida — así que 吃饭 (\"comer arroz\") solo significa \"comer.\"" }, "A2", null,
      { en: "'米饭 (mǐfàn)' means..." }],
    // — B1 —
    ["'老师 (lǎoshī)' 是什么意思？(shì shénme yìsi?)", ["teacher", "student", "classmate", "principal"], 0,
      { en: "'老师' means teacher — also used respectfully to address anyone knowledgeable, somewhat like Japanese 'sensei' though less broadly.", es: "'老师' significa maestro/a — también se usa respetuosamente para dirigirse a alguien con conocimiento, algo como el 'sensei' japonés aunque menos ampliamente." }, "B1", null,
      { en: "'老师 (lǎoshī)' means..." }],
    ["'没关系 (méi guānxi)' 是什么意思？(shì shénme yìsi?)", ["\"it's okay/no problem/never mind\"", "\"absolutely not\"", "\"I don't understand\"", "\"please wait\""], 0,
      { en: "'没关系' (literally \"no relation\") is the everyday way to say something doesn't matter or isn't a problem — the natural reply to an apology.", es: "'没关系' (literalmente \"sin relación\") es la forma cotidiana de decir que algo no importa o no es problema — la respuesta natural a una disculpa." }, "B1", null,
      { en: "'没关系 (méi guānxi)' means..." }],
    ["'麻烦 (máfan)' 是什么意思？(shì shénme yìsi?)", ["trouble/troublesome (noun, adj, or verb)", "easy/simple", "expensive", "urgent"], 0,
      { en: "'麻烦' means trouble or troublesome, and also works as a verb — \"麻烦你 (máfan nǐ)\" is a polite \"could I trouble you to...\"", es: "'麻烦' significa problema o problemático, y también funciona como verbo — \"麻烦你 (máfan nǐ)\" es un cortés \"¿podría molestarte para...?\"" }, "B1", null,
      { en: "'麻烦 (máfan)' means..." }],
    ["'加油 (jiāyóu)' 是什么意思？(shì shénme yìsi?)", ["\"go for it!/you can do it!\"", "\"add fuel\" (literal only)", "\"good luck\" (formal)", "\"congratulations\""], 0,
      { en: "Literally \"add oil,\" '加油' is the everyday cheer of encouragement — shouted at games, before exams, or to root for a friend.", es: "Literalmente \"añadir aceite,\" '加油' es la porra de ánimo cotidiana — gritada en partidos, antes de exámenes, o para apoyar a un amigo." }, "B1", null,
      { en: "'加油 (jiāyóu)' means..." }],
    ["'热闹 (rènao)' 是什么意思？(shì shénme yìsi?)", ["lively/bustling (in a good way)", "quiet and empty", "hot in temperature", "angry"], 0,
      { en: "'热闹' describes a place or event that's lively, bustling, and full of happy energy — a positive word (a good party, a crowded festival), not mere noise.", es: "'热闹' describe un lugar o evento animado, bullicioso y lleno de energía alegre — una palabra positiva (una buena fiesta, un festival concurrido), no simple ruido." }, "B1", null,
      { en: "'热闹 (rènao)' means..." }],
    // — B2 —
    ["'关系 (guānxi)' 是什么意思？(shì shénme yìsi?)", ["relationship/connections (with social weight)", "family only", "coincidence", "distance"], 0,
      { en: "'关系' literally means \"relationship,\" but carries real cultural weight — good 'guānxi' implies a web of mutual obligation and trust beyond the literal translation.", es: "'关系' literalmente significa \"relación,\" pero conlleva un peso cultural real — un buen 'guānxi' implica una red de obligación mutua y confianza más allá de la traducción literal." }, "B2", null,
      { en: "'关系 (guānxi)' means..." }],
    ["'马马虎虎 (mǎmǎhūhū)' 是什么意思？(shì shénme yìsi?)", ["so-so/mediocre", "excellent", "terrible", "confusing"], 0,
      { en: "Literally \"horse horse tiger tiger,\" this playful reduplicated expression means \"so-so\" — a nice example of meaning built from repetition and unrelated-sounding pairs.", es: "Literalmente \"caballo caballo tigre tigre,\" esta expresión reduplicada juguetona significa \"así así\" — un buen ejemplo de significado construido con repetición y pares de sonido no relacionado." }, "B2", null,
      { en: "'马马虎虎 (mǎmǎhūhū)' means..." }],
    ["'面子 (miànzi)' 是什么意思？(shì shénme yìsi?)", ["face/social standing/dignity", "a physical mask", "the front of a building", "a flat noodle"], 0,
      { en: "'面子' is social face — reputation and dignity in others' eyes. You can 给面子 (give someone face), 丢面子 (lose face), or 有面子 (have face); managing it is central to social life.", es: "'面子' es la cara social — reputación y dignidad ante los demás. Puedes 给面子 (dar cara), 丢面子 (perder cara), o 有面子 (tener cara); gestionarla es central en la vida social." }, "B2", null,
      { en: "'面子 (miànzi)' means..." }],
    ["'热情 (rèqíng)' 是什么意思？(shì shénme yìsi?)", ["warm/enthusiastic/hospitable", "hot-tempered", "cold and distant", "shy"], 0,
      { en: "'热情' (literally \"hot feeling\") describes someone warm, enthusiastic, and generously welcoming — the quality a good host shows a guest.", es: "'热情' (literalmente \"sentimiento caliente\") describe a alguien cálido, entusiasta y acogedor — la cualidad que un buen anfitrión muestra a un invitado." }, "B2", null,
      { en: "'热情 (rèqíng)' means..." }],
    // — C1 —
    ["'客气 (kèqi)' 是什么意思？(shì shénme yìsi?)", ["polite/courteous (sometimes overly so)", "rude", "generous with money", "talkative"], 0,
      { en: "'客气' is polite courtesy — but note the twist: \"不客气 (bú kèqi)\" (\"don't be polite\") is how you say \"you're welcome,\" and telling a friend 别客气 means \"don't stand on ceremony.\"", es: "'客气' es la cortesía educada — pero ojo con el giro: \"不客气 (bú kèqi)\" (\"no seas cortés\") es cómo se dice \"de nada,\" y decirle a un amigo 别客气 significa \"no hagas ceremonias.\"" }, "C1", null,
      { en: "'客气 (kèqi)' means..." }],
    ["'委屈 (wěiqu)' 是什么意思？(shì shénme yìsi?)", ["feeling wronged/hard done by", "feeling proud", "physically twisted", "feeling curious"], 0,
      { en: "'委屈' is the specific feeling of having been treated unfairly and swallowing it — the quiet, aggrieved hurt of being wronged and not (yet) able to protest. English has no single word for it.", es: "'委屈' es el sentimiento específico de haber sido tratado injustamente y tragárselo — el dolor callado y agraviado de ser perjudicado sin poder (aún) protestar. El inglés no tiene una sola palabra para esto." }, "C1", null,
      { en: "'委屈 (wěiqu)' means..." }],
    ["'舍不得 (shěbude)' 是什么意思？(shì shénme yìsi?)", ["reluctant to part with/give up", "unable to afford", "unwilling to help", "forgetful"], 0,
      { en: "'舍不得' is the reluctance to let something go — too attached to part with it, whether a keepsake, some money, or a person leaving. Its opposite is 舍得 (willing to part with).", es: "'舍不得' es la renuencia a soltar algo — demasiado apegado para desprenderse, sea un recuerdo, algo de dinero, o alguien que se va. Su opuesto es 舍得 (dispuesto a desprenderse)." }, "C1", null,
      { en: "'舍不得 (shěbude)' means..." }],
    // — C2 —
    ["'缘分 (yuánfèn)' 是什么意思？(shì shénme yìsi?)", ["a fated connection between people", "good luck with money", "a family bloodline", "a business contract"], 0,
      { en: "'缘分' is the fateful affinity that brings people together — the sense that a meeting, friendship, or love was meant to be. \"我们有缘\" (\"we have yuánfèn\") credits chance meetings to destiny; there's no clean English equivalent.", es: "'缘分' es la afinidad del destino que une a las personas — la sensación de que un encuentro, amistad o amor estaba destinado. \"我们有缘\" (\"tenemos yuánfèn\") atribuye los encuentros casuales al destino; no hay equivalente claro en inglés." }, "C2", null,
      { en: "'缘分 (yuánfèn)' means..." }],
    ["'意境 (yìjìng)' 是什么意思？(shì shénme yìsi?)", ["the mood/artistic atmosphere of a work", "the plot of a story", "a person's opinion", "the price of art"], 0,
      { en: "'意境' is the evoked mood or artistic realm of a poem, painting, or scene — the atmosphere and feeling beyond the literal content. A core term in Chinese aesthetics, essentially untranslatable in one word.", es: "'意境' es el ambiente evocado o reino artístico de un poema, pintura o escena — la atmósfera y el sentimiento más allá del contenido literal. Un término central de la estética china, intraducible en una palabra." }, "C2", null,
      { en: "'意境 (yìjìng)' means..." }],
    ["'江湖 (jiānghú)' 是什么意思？(shì shénme yìsi?)", ["the \"rivers and lakes\" — society beyond officialdom", "a large freshwater lake", "the shipping industry", "a government office"], 0,
      { en: "'江湖' (literally \"rivers and lakes\") is the world of wanderers, martial artists, and outsiders operating by their own code, outside official society — the setting of wuxia fiction and a metaphor for any cutthroat, unwritten-rules milieu (\"人在江湖，身不由己\").", es: "'江湖' (literalmente \"ríos y lagos\") es el mundo de vagabundos, artistas marciales y forasteros que se rigen por su propio código, fuera de la sociedad oficial — el escenario de la ficción wuxia y una metáfora de cualquier entorno despiadado de reglas no escritas." }, "C2", null,
      { en: "'江湖 (jiānghú)' means..." }],
  ],
  gram: [
    // — A1 —
    ["我___中国人。(Wǒ ___ Zhōngguórén.)", ["是 (shì)", "有 (yǒu)", "在 (zài)", "很 (hěn)"], 0,
      { en: "'是' is the copula — \"am/is/are.\" 'X 是 Y' is the first sentence pattern to learn: 我是中国人 = \"I am Chinese.\" One form for every person, always.", es: "'是' es la cópula — \"soy/es/son.\" 'X 是 Y' es el primer patrón que se aprende: 我是中国人 = \"soy chino.\" Una sola forma para toda persona, siempre." }, "A1", null,
      { en: "I am Chinese. (Which word completes the sentence?)" }],
    ["这是我___书。(Zhè shì wǒ ___ shū.)", ["的 (de)", "是 (shì)", "了 (le)", "吗 (ma)"], 0,
      { en: "'的' marks possession and modification — 我的书 = \"my book,\" 红的车 = \"red car.\" It's one of the most frequent characters in the language.", es: "'的' marca posesión y modificación — 我的书 = \"mi libro,\" 红的车 = \"auto rojo.\" Es uno de los caracteres más frecuentes del idioma." }, "A1", null,
      { en: "This is my book. (Which word completes the sentence?)" }],
    // — A2 —
    ["我吃苹果。(Wǒ chī píngguǒ.)", ["✓ correct — same verb form for any tense/person", "wrong tense", "wrong person", "missing a word"], 0,
      { en: "Mandarin verbs never conjugate — '吃' (eat) is identical whether it's \"I eat,\" \"she eats,\" \"we ate,\" or \"they will eat.\" Time and context (or particles) carry that instead.", es: "Los verbos del mandarín nunca se conjugan — '吃' (comer) es idéntico sea \"como,\" \"ella come,\" \"comimos,\" o \"comerán.\" El tiempo y el contexto (o partículas) lo llevan en su lugar." }, "A2", null,
      { en: "I eat an apple. (Is this sentence correct?)" }],
    ["你好___? (Nǐ hǎo ___?)", ["吗 (ma)", "呢 (ne)", "吧 (ba)", "啊 (a)"], 0,
      { en: "The particle '吗' at the end turns a statement into a yes/no question — Mandarin doesn't invert word order like English does.", es: "La partícula '吗' al final convierte una afirmación en una pregunta de sí/no — el mandarín no invierte el orden de las palabras como el inglés." }, "A2", null,
      { en: "Are you well? (Which particle makes it a question?)" }],
    ["我有一___朋友。(Wǒ yǒu yí ___ péngyǒu.)", ["个 (gè)", "本 (běn)", "只 (zhī)", "张 (zhāng)"], 0,
      { en: "'个' is the general, default measure word, usable for a huge range of nouns (including people) when a more specific classifier doesn't apply or isn't known.", es: "'个' es la palabra medida general y predeterminada, usable para una gran variedad de sustantivos (incluidas personas) cuando no aplica o no se conoce un clasificador más específico." }, "A2", null,
      { en: "I have a friend. (Which measure word fits?)" }],
    ["我___喜欢咖啡。(Wǒ ___ xǐhuan kāfēi.)", ["不 (bù)", "没 (méi)", "别 (bié)", "无 (wú)"], 0,
      { en: "'不' negates general states, preferences, and habitual or future actions — \"I don't like coffee.\" (For negating a completed action you'd use '没' instead.)", es: "'不' niega estados generales, preferencias y acciones habituales o futuras — \"no me gusta el café.\" (Para negar una acción completada se usa '没' en su lugar.)" }, "A2", null,
      { en: "I don't like coffee. (Which negation word fits?)" }],
    ["我___看书。(Wǒ ___ kàn shū.) — right now, in progress", ["在 (zài)", "了 (le)", "过 (guo)", "的 (de)"], 0,
      { en: "'在' before the verb marks an action in progress — 我在看书 = \"I am reading (right now).\" It's the closest thing Mandarin has to English's \"-ing,\" done with a particle, not a verb change.", es: "'在' antes del verbo marca una acción en curso — 我在看书 = \"estoy leyendo (ahora mismo).\" Es lo más parecido al \"-ing\" del inglés, hecho con una partícula, no con un cambio del verbo." }, "A2", null,
      { en: "I am reading (right now). (Which word marks the ongoing action?)" }],
    // — B1 —
    ["我买___一本书。(Wǒ mǎi ___ yì běn shū.)", ["了 (le)", "过 (guo)", "在 (zài)", "着 (zhe)"], 0,
      { en: "'了' after the verb marks a completed action — 我买了一本书 = \"I bought a book.\" Since tense doesn't exist in Mandarin, particles like this carry the \"it happened\" meaning.", es: "'了' después del verbo marca una acción completada — 我买了一本书 = \"compré un libro.\" Como el tiempo verbal no existe en mandarín, partículas como esta llevan el significado de \"ya ocurrió.\"" }, "B1", null,
      { en: "I bought a book. (Which particle marks completion?)" }],
    ["我有三___书。(Wǒ yǒu sān ___ shū.)", ["本 (běn)", "个 (gè)", "只 (zhī)", "张 (zhāng)"], 0,
      { en: "Mandarin requires a measure word between a number and a noun — '本' specifically classifies bound volumes like books, a grammatical category English simply doesn't have.", es: "El mandarín requiere una palabra medida entre un número y un sustantivo — '本' clasifica específicamente volúmenes encuadernados como libros, una categoría gramatical que el inglés simplemente no tiene." }, "B1", null,
      { en: "I have three books. (Which measure word fits books?)" }],
    ["我___去中国。(Wǒ ___ qù Zhōngguó.) — I want to go", ["想 (xiǎng)", "在 (zài)", "了 (le)", "过 (guo)"], 0,
      { en: "'想' before a verb is the modal \"want to / would like to\" — 我想去中国 = \"I want to go to China.\" (On its own 想 also means \"to miss/think of\" someone.)", es: "'想' antes de un verbo es el modal \"querer / tener ganas de\" — 我想去中国 = \"quiero ir a China.\" (Por sí solo 想 también significa \"extrañar/pensar en\" alguien.)" }, "B1", null,
      { en: "I want to go to China. (Which word means 'want to'?)" }],
    ["我___你高。(Wǒ ___ nǐ gāo.) — I am taller than you", ["比 (bǐ)", "很 (hěn)", "跟 (gēn)", "和 (hé)"], 0,
      { en: "Comparisons use '比': A 比 B + adjective = \"A is more ___ than B.\" 我比你高 = \"I am taller than you.\" No \"-er\" ending or \"more\" — the structure does all the work.", es: "Las comparaciones usan '比': A 比 B + adjetivo = \"A es más ___ que B.\" 我比你高 = \"soy más alto que tú.\" Sin terminación \"-er\" ni \"más\" — la estructura hace todo el trabajo." }, "B1", null,
      { en: "I am taller than you. (Which word marks the comparison?)" }],
    // — B2 —
    ["我去___中国。(Wǒ qù ___ Zhōngguó.) — I've been (at some point)", ["过 (guo)", "了 (le)", "在 (zài)", "着 (zhe)"], 0,
      { en: "'过' marks past experience — \"I have been to China [before], at some point.\" A distinct aspect from the simple completion marked by '了'.", es: "'过' marca experiencia pasada — \"he estado en China [antes], en algún momento.\" Un aspecto distinto de la simple finalización marcada por '了'." }, "B2", null,
      { en: "I have been to China. (Which particle marks past experience?)" }],
    ["这个电影,我看过了。(Zhège diànyǐng, wǒ kànguò le.)", ["✓ correct — topic-comment structure", "incorrect word order", "wrong particle", "missing a word"], 0,
      { en: "Mandarin often fronts the topic (\"this movie...\") before commenting on it (\"...I've seen it\") — topic-comment structure, distinct from English's rigid subject-first order.", es: "El mandarín a menudo antepone el tema (\"esta película...\") antes de comentar (\"...ya la vi\") — estructura tema-comentario, distinta del orden rígido de sujeto primero del inglés." }, "B2", null,
      { en: "This movie, I've seen it. (Is this word order correct?)" }],
    ["我___吃早饭。(Wǒ ___ chī zǎofàn.) — haven't eaten (yet)", ["没 (méi)", "不 (bù)", "别 (bié)", "无 (wú)"], 0,
      { en: "'没' negates a completed action — \"(I) haven't eaten breakfast (yet).\" '不' negates general states or habits instead; the split by aspect is a distinction English's single \"not\" doesn't make.", es: "'没' niega una acción completada — \"(yo) no he desayunado (todavía).\" '不' niega estados generales o hábitos; la división por aspecto es una distinción que el \"not\" único del inglés no hace." }, "B2", null,
      { en: "I haven't eaten breakfast. (Which negation word fits?)" }],
    ["请___门关上。(Qǐng ___ mén guānshàng.) — please close the door", ["把 (bǎ)", "被 (bèi)", "在 (zài)", "给 (gěi)"], 0,
      { en: "The 把-construction moves the object in front of the verb to focus on what's DONE to it: 把门关上 = \"take the door and close it.\" It's used for disposing of / affecting a specific object — a structure with no English parallel.", es: "La construcción 把 mueve el objeto delante del verbo para enfocar lo que se le HACE: 把门关上 = \"toma la puerta y ciérrala.\" Se usa para disponer de / afectar un objeto específico — una estructura sin paralelo en inglés." }, "B2", null,
      { en: "Please close the door. (Which word sets up the 把-construction?)" }],
    // — C1 —
    ["我的自行车___偷了。(Wǒ de zìxíngchē ___ tōu le.) — my bike got stolen", ["被 (bèi)", "把 (bǎ)", "让 (ràng)", "得 (de)"], 0,
      { en: "'被' marks the passive — 我的自行车被偷了 = \"my bike was stolen.\" It often carries an adverse nuance (something bad done to you), the mirror image of the 把-construction's active focus.", es: "'被' marca la voz pasiva — 我的自行车被偷了 = \"me robaron la bicicleta.\" A menudo lleva un matiz adverso (algo malo hecho a ti), la imagen especular del enfoque activo de la construcción 把." }, "C1", null,
      { en: "My bike got stolen. (Which word marks the passive?)" }],
    ["他跑___很快。(Tā pǎo ___ hěn kuài.) — he runs very fast", ["得 (de)", "的 (de)", "地 (de)", "了 (le)"], 0,
      { en: "The complement '得' links a verb to a description of how it's done: 跑得很快 = \"runs (in a way that is) very fast.\" It's one of three homophone 'de' particles (的/地/得) — this one attaches manner/degree after the verb.", es: "El complemento '得' une un verbo a una descripción de cómo se hace: 跑得很快 = \"corre (de un modo que es) muy rápido.\" Es una de tres partículas homófonas 'de' (的/地/得) — esta adjunta modo/grado después del verbo." }, "C1", null,
      { en: "He runs very fast. (Which 'de' attaches the manner?)" }],
    // — C2 —
    ["我是昨天来的。(Wǒ shì zuótiān lái de.) — What does the 是...的 frame do here?", ["emphasizes a detail (WHEN/HOW/WHERE) of a known past action", "makes the sentence future tense", "negates the sentence", "turns it into a yes/no question"], 0,
      { en: "The 是...的 construction spotlights a circumstance of an action already known to have happened: 我是昨天来的 stresses that it was YESTERDAY (not the fact of coming) that I came. Drop 是...的 and 我昨天来了 just reports the event flatly. It's how Mandarin does the work of English stress or a cleft (\"it was yesterday that...\").", es: "La construcción 是...的 resalta una circunstancia de una acción que ya se sabe ocurrida: 我是昨天来的 enfatiza que fue AYER (no el hecho de venir) cuando vine. Sin 是...的, 我昨天来了 solo reporta el evento de forma plana. Es cómo el mandarín hace el trabajo del énfasis inglés o de una oración hendida (\"fue ayer cuando...\")." }, "C2", null,
      { en: "It was yesterday that I came. (What does the 是...的 frame do?)" }],
  ],
  trad: [
    // — A2 —
    ["Translate: 'Congratulations!'", ["恭喜 (Gōngxǐ)", "谢谢 (Xièxiè)", "对不起 (Duìbùqǐ)", "没关系 (Méi guānxi)"], 0,
      { en: "\"恭喜\" is the everyday \"congratulations,\" doubled to \"恭喜恭喜\" for extra warmth and famous in the New Year greeting \"恭喜发财\" (wishing you prosperity).", es: "\"恭喜\" es el \"felicidades\" cotidiano, duplicado a \"恭喜恭喜\" para más calidez y famoso en el saludo de Año Nuevo \"恭喜发财\" (deseándote prosperidad)." }, "A2"],
    ["Translate: 'Take care.' (said to a departing guest)", ["慢走 (Màn zǒu)", "快走 (Kuài zǒu)", "再见 (Zàijiàn)", "你好 (Nǐ hǎo)"], 0,
      { en: "\"慢走\" (literally \"walk slowly\") is the set phrase a host says as a guest leaves — an affectionate \"take care,\" not a comment on speed. Saying just 再见 would feel colder.", es: "\"慢走\" (literalmente \"camina despacio\") es la frase fija que un anfitrión dice cuando un invitado se va — un cariñoso \"cuídate,\" no un comentario sobre la velocidad. Decir solo 再见 se sentiría más frío." }, "A2"],
    // — B1 —
    ["Translate: 'When in Rome, do as the Romans do.'", ["入乡随俗 (Rùxiāngsuísú)", "跟着大家做 (Gēnzhe dàjiā zuò)", "适应当地文化 (Shìyìng dāngdì wénhuà)", "做当地人做的 (Zuò dāngdìrén zuò de)"], 0,
      { en: "\"入乡随俗\" (literally \"enter the village, follow its customs\") is the Chinese equivalent of \"when in Rome.\"", es: "\"入乡随俗\" (literalmente \"entra al pueblo, sigue sus costumbres\") es el equivalente chino de \"a donde fueres, haz lo que vieres\"." }, "B1"],
    ["Translate: 'To kill two birds with one stone.'", ["一举两得 (Yìjǔliǎngdé)", "一次做两件事 (Yícì zuò liǎng jiàn shì)", "两个一起完成 (Liǎng gè yìqǐ wánchéng)", "同时解决两个 (Tóngshí jiějué liǎng gè)"], 0,
      { en: "\"一举两得\" (literally \"one action, two gains\") is the standard chengyu for accomplishing two things with a single effort.", es: "\"一举两得\" (literalmente \"una acción, dos ganancias\") es el chengyu estándar para lograr dos cosas con un solo esfuerzo." }, "B1"],
    ["Translate: 'The tip of the iceberg.'", ["冰山一角 (Bīngshānyìjiǎo)", "问题的开始 (Wèntí de kāishǐ)", "只是一部分 (Zhǐshì yí bùfèn)", "表面的问题 (Biǎomiàn de wèntí)"], 0,
      { en: "\"冰山一角\" (literally \"one corner of an iceberg\") is used exactly like the English idiom, for a small visible part of a much bigger hidden issue.", es: "\"冰山一角\" (literalmente \"una esquina de un iceberg\") se usa exactamente como el modismo inglés, para una pequeña parte visible de un problema oculto mucho mayor." }, "B1"],
    ["Translate: 'May your wishes come true.' (common blessing)", ["心想事成 (Xīnxiǎngshìchéng)", "祝你好运 (Zhù nǐ hǎoyùn)", "希望你成功 (Xīwàng nǐ chénggōng)", "一切顺利 (Yíqiè shùnlì)"], 0,
      { en: "\"心想事成\" (literally \"heart thinks, matter becomes\") is a common well-wish, especially popular around holidays and birthdays.", es: "\"心想事成\" (literalmente \"el corazón piensa, el asunto se cumple\") es un deseo común, especialmente popular en festividades y cumpleaños." }, "B1"],
    ["Translate: 'To give up halfway.'", ["半途而废 (Bàntú'érfèi)", "从头开始 (Cóngtóu kāishǐ)", "坚持到底 (Jiānchí dàodǐ)", "慢慢来吧 (Mànman lái ba)"], 0,
      { en: "\"半途而废\" (literally \"stop halfway and abandon\") is the standard chengyu for quitting a task before it's finished — often said as a warning not to.", es: "\"半途而废\" (literalmente \"detenerse a mitad de camino y abandonar\") es el chengyu estándar para dejar una tarea antes de terminarla — a menudo dicho como advertencia de no hacerlo." }, "B1"],
    // — B2 —
    ["Translate: 'To overdo/ruin something by adding unnecessary detail.'", ["画蛇添足 (Huàshétiānzú)", "做得太多了 (Zuò de tài duō le)", "过分装饰 (Guòfèn zhuāngshì)", "多此一举 (Duōcǐyìjǔ, similar meaning)"], 0,
      { en: "\"画蛇添足\" (literally \"to draw a snake and add feet\") is a classic chengyu for ruining something by adding excessive, unnecessary detail.", es: "\"画蛇添足\" (literalmente \"dibujar una serpiente y añadirle patas\") es un chengyu clásico para arruinar algo al añadir detalles innecesarios y excesivos." }, "B2"],
    ["Translate: 'Talking to a wall/wasting your breath on someone who won't get it.'", ["对牛弹琴 (Duìniútánqín)", "浪费时间说话 (Làngfèi shíjiān shuōhuà)", "没人听我的 (Méi rén tīng wǒ de)", "说了也没用 (Shuōle yě méiyòng)"], 0,
      { en: "\"对牛弹琴\" (literally \"to play the lute to a cow\") is the standard chengyu for wasting effort explaining something to someone who fundamentally won't understand.", es: "\"对牛弹琴\" (literalmente \"tocar el laúd para una vaca\") es el chengyu estándar para desperdiciar esfuerzo explicando algo a alguien que no lo entenderá." }, "B2"],
    ["Translate: 'A blessing in disguise.'", ["塞翁失马 (Sàiwēngshīmǎ)", "因祸得福 (Yīnhuòdéfú, similar meaning)", "坏事变好事 (Huàishì biàn hǎoshì)", "转祸为福 (Zhuǎnhuòwéifú, similar meaning)"], 0,
      { en: "\"塞翁失马\" (literally \"the old man at the frontier loses his horse\") references a parable where apparent misfortune leads to good luck — the standard chengyu for \"a blessing in disguise.\"", es: "\"塞翁失马\" (literalmente \"el viejo de la frontera pierde su caballo\") alude a una fábula donde una desgracia aparente trae buena suerte — el chengyu estándar para \"una bendición disfrazada\"." }, "B2"],
    ["Translate: 'Better late than never.' (fix it after the loss)", ["亡羊补牢 (Wángyángbǔláo)", "太晚了没用 (Tài wǎn le méiyòng)", "从来不晚 (Cónglái bù wǎn)", "早点行动 (Zǎodiǎn xíngdòng)"], 0,
      { en: "\"亡羊补牢\" (literally \"mend the pen after the sheep are lost\") — it's not too late to fix things and prevent further loss even after damage is done.", es: "\"亡羊补牢\" (literalmente \"reparar el corral después de perder las ovejas\") — no es demasiado tarde para arreglar las cosas y evitar más pérdidas aun después del daño." }, "B2"],
    ["Translate: 'A narrow, limited view of the world.'", ["井底之蛙 (Jǐngdǐzhīwā)", "看得不远 (Kàn de bù yuǎn)", "见识很少 (Jiànshì hěn shǎo)", "眼光短浅 (Yǎnguāng duǎnqiǎn)"], 0,
      { en: "\"井底之蛙\" (literally \"a frog at the bottom of a well\") describes someone whose tiny vantage point convinces them they've seen the whole sky — the Chinese cousin of a narrow worldview.", es: "\"井底之蛙\" (literalmente \"una rana en el fondo de un pozo\") describe a quien, desde su punto de vista diminuto, cree haber visto todo el cielo — el primo chino de una visión estrecha del mundo." }, "B2"],
    // — C1 —
    ["Translate: 'It's a long story / hard to explain in a word.'", ["一言难尽 (Yìyánnánjìn)", "很快说完 (Hěn kuài shuō wán)", "不想说话 (Bù xiǎng shuōhuà)", "简单来说 (Jiǎndān lái shuō)"], 0,
      { en: "\"一言难尽\" (literally \"one word cannot exhaust it\") is the set answer when a situation is too tangled or painful to sum up quickly — \"it's complicated / a long story.\"", es: "\"一言难尽\" (literalmente \"una palabra no puede agotarlo\") es la respuesta fija cuando una situación es demasiado enredada o dolorosa para resumir rápido — \"es complicado / es una larga historia\"." }, "C1"],
    ["Translate: 'Stuck in a situation you can't back out of.'", ["骑虎难下 (Qíhǔnánxià)", "进退两难 (Jìntuìliǎngnán, similar meaning)", "没有办法了 (Méiyǒu bànfǎ le)", "很难决定 (Hěn nán juédìng)"], 0,
      { en: "\"骑虎难下\" (literally \"riding a tiger, hard to get off\") — once committed, stopping is as dangerous as continuing, so you're trapped in the course you started.", es: "\"骑虎难下\" (literalmente \"montado en un tigre, difícil bajar\") — una vez comprometido, detenerse es tan peligroso como continuar, así que quedas atrapado en el camino que empezaste." }, "C1"],
    ["Translate: 'To commit fully, with no retreat.'", ["破釜沉舟 (Pòfǔchénzhōu)", "全力以赴 (Quánlìyǐfù, similar meaning)", "决不放弃 (Jué bù fàngqì)", "冒很大险 (Mào hěn dà xiǎn)"], 0,
      { en: "\"破釜沉舟\" (literally \"smash the cauldrons, sink the boats\") comes from a general who destroyed his army's own means of retreat to force total commitment — burn your bridges, win or perish.", es: "\"破釜沉舟\" (literalmente \"romper los calderos, hundir los barcos\") viene de un general que destruyó los medios de retirada de su propio ejército para forzar el compromiso total — quema tus naves, vencer o perecer." }, "C1"],
    // — C2 —
    ["Translate: 'Highbrow art appreciated by only a few.'", ["阳春白雪 (Yángchūnbáixuě)", "下里巴人 (Xiàlǐbārén, its opposite)", "很难懂的艺术 (Hěn nán dǒng de yìshù)", "高级的文化 (Gāojí de wénhuà)"], 0,
      { en: "\"阳春白雪\" (literally \"spring snow\") names refined, elite art that the general public can't fully appreciate — its classical counterpart is \"下里巴人\" (popular, common art). The paired terms come from an ancient anecdote about a song too sophisticated for the crowd to join.", es: "\"阳春白雪\" (literalmente \"nieve de primavera\") nombra el arte refinado y elitista que el público general no llega a apreciar del todo — su contraparte clásica es \"下里巴人\" (arte popular y común). El par proviene de una anécdota antigua sobre una canción demasiado sofisticada para que la multitud la acompañara." }, "C2"],
  ],
};

// Mandarin phonetics: tone sandhi (3rd+3rd → 2nd+3rd; the special 一 and 不
// tone changes; the "half-third" tone before a non-3rd), the neutral tone
// (some syllables lose their tone and go light — sometimes changing meaning),
// retroflex consonants (zh/ch/sh vs. flat z/c/s), and 儿化 (the rhotic -r
// suffix that reshapes a syllable's ending).
const FONO_BANK = [
  // — A2: first sounds and the neutral tone —
  { text: "谢谢你。(Xièxiè nǐ.)", sound: "syeh-syeh(2nd is light/neutral) nee", difficulty: "A2",
    identify: { options: ["谢谢你。", "谢谢您。", "谢谢大家。", "谢谢啦。"], correctIdx: 0,
      explain: { en: "The second '谢' loses its full 4th tone and becomes a light, neutral-tone syllable — very common with repeated syllables in casual speech.", es: "El segundo '谢' pierde su 4to tono completo y se vuelve una sílaba ligera de tono neutro — muy común con sílabas repetidas en el habla casual." } },
    respond: { options: ["不客气!", "多少钱?", "对不起。", "再见。"], correctIdx: 0,
      explain: { en: "Being thanked calls for the standard \"you're welcome\" — 不客气 (literally \"don't be polite\").", es: "Que te agradezcan pide el estándar \"de nada\" — 不客气 (literalmente \"no seas cortés\")." } } },
  { text: "买 vs 卖 (mǎi vs mài)", sound: "mǎi (3rd, dips down-up) = buy; mài (4th, sharp fall) = sell", difficulty: "A2",
    identify: { options: ["买 (mǎi, 3rd tone) = to buy", "卖 (mài, 4th tone) = to sell", "麦 (mài, wheat)", "迈 (mài, to stride)"], correctIdx: 0,
      explain: { en: "买 (buy) and 卖 (sell) are the same syllable 'mai' with opposite tones — 3rd (dipping) vs. 4th (falling). Two near-opposite meanings ride entirely on the tone; getting it wrong flips buyer and seller.", es: "买 (comprar) y 卖 (vender) son la misma sílaba 'mai' con tonos opuestos — 3er (que baja y sube) vs. 4to (que cae). Dos significados casi opuestos dependen enteramente del tono; equivocarse invierte comprador y vendedor." } },
    respond: { options: ["我想买这个。", "太贵了,不买。", "这是什么?", "谢谢你。"], correctIdx: 0,
      explain: { en: "A word-pair drill invites you to use it — \"I'd like to buy this one\" puts 买 to work.", es: "Un ejercicio de par de palabras invita a usarlo — \"quiero comprar este\" pone a trabajar 买." } } },
  // — B1: sandhi rules and the retroflex series —
  { text: "这是什么?(Zhè shì shénme?)", sound: "jer(retroflex) shr(retroflex) shummuh?", difficulty: "B1",
    identify: { options: ["这是什么?", "那是什么?", "这是谁?", "这是哪里?"], correctIdx: 0,
      explain: { en: "'Zh' and 'sh' are retroflex — the tongue curls back further than for English 'j' or 'sh', a distinct series from the flatter z/c/s sounds.", es: "'Zh' y 'sh' son retroflejos — la lengua se curva más hacia atrás que para la 'j' o 'sh' inglesas, una serie distinta de los sonidos más planos z/c/s." } },
    respond: { options: ["这是一本书。", "在那边。", "他是我朋友。", "五块钱。"], correctIdx: 0,
      explain: { en: "Asking what something is calls for a simple identification, like \"it's a book.\"", es: "Preguntar qué es algo pide una identificación simple, como \"es un libro\"." } } },
  { text: "一个 vs 一天 (yí ge vs yì tiān)", sound: "yí ge (2nd before 4th) but yì tiān (4th before 1st)", difficulty: "B1",
    identify: { options: ["一 changes tone based on the next syllable's tone", "一 is always 1st tone (yī)", "一 is always 4th tone (yì)", "一 is silent before a measure word"], correctIdx: 0,
      explain: { en: "'一' is yī in isolation, but shifts in context: it becomes 2nd tone (yí) before a 4th tone (一个 yí ge), and 4th tone (yì) before 1st/2nd/3rd (一天 yì tiān). This 一-sandhi is automatic and never written with the changed tone.", es: "'一' es yī aislado, pero cambia en contexto: se vuelve 2do tono (yí) ante un 4to tono (一个 yí ge), y 4to tono (yì) ante 1er/2do/3er (一天 yì tiān). Este sandhi de 一 es automático y nunca se escribe con el tono cambiado." } },
    respond: { options: ["我懂了,谢谢!", "一是第一声。", "没有一。", "再见。"], correctIdx: 0,
      explain: { en: "A pronunciation tip lands with a simple \"got it, thanks!\"", es: "Un consejo de pronunciación aterriza con un simple \"entendido, ¡gracias!\"" } } },
  { text: "你们好。(Nǐmen hǎo.)", sound: "the 你 is a HALF-third here — just the low dip, no rise", difficulty: "B1",
    identify: { options: ["你们 (nǐmen — 你 is a half-third: low, no rise)", "你们 (both syllables fully dip and rise)", "您们 (not standard)", "你门 (wrong character)"], correctIdx: 0,
      explain: { en: "A full 3rd tone dips down AND rises back up, but that only happens before a pause or at the end. Mid-phrase, before a non-3rd-tone syllable, it's a 'half-third' — just the low dip, no rise. Over-rising every 3rd tone is a classic learner giveaway.", es: "Un 3er tono completo baja Y vuelve a subir, pero eso solo ocurre antes de una pausa o al final. A mitad de frase, ante una sílaba que no es de 3er tono, es un 'medio-tercero' — solo la caída baja, sin subida. Hacer subir cada 3er tono es una delación clásica del principiante." } },
    respond: { options: ["你好!认识你们很高兴。", "你们是谁?", "再见!", "半三声很难。"], correctIdx: 0,
      explain: { en: "A group greeting invites a warm \"hello — nice to meet you all.\"", es: "Un saludo grupal invita a un cálido \"hola — encantado de conoceros\"." } } },
  // — B2: the 3rd+3rd and 不 sandhi rules —
  { text: "你好吗?(Nǐ hǎo ma?)", sound: "actually: NÍ hǎo ma? (3rd+3rd → 2nd+3rd)", difficulty: "B2",
    identify: { options: ["你好吗? (你 shifts to 2nd tone before 好)", "你好吗? (both stay 3rd, as written)", "你很好吗?", "你还好吗?"], correctIdx: 0,
      explain: { en: "The core sandhi rule: when two 3rd-tone syllables collide, the first becomes a 2nd tone in speech — 'nǐ hǎo' as written is really said 'ní hǎo'. The tone marks in text never change; the shift is a spoken rule you apply on the fly.", es: "La regla central del sandhi: cuando dos sílabas de 3er tono chocan, la primera se vuelve 2do tono en el habla — 'nǐ hǎo' escrito se dice en realidad 'ní hǎo'. Las marcas de tono en el texto nunca cambian; el cambio es una regla hablada que aplicas al vuelo." } },
    respond: { options: ["我很好,谢谢!", "多少钱?", "在哪里?", "几点了?"], correctIdx: 0,
      explain: { en: "\"How are you?\" wants a friendly \"I'm good, thanks!\"", es: "\"¿Cómo estás?\" pide un amistoso \"¡estoy bien, gracias!\"" } } },
  { text: "我很好,谢谢。(Wǒ hěn hǎo, xièxiè.)", sound: "wǒ HÉN(sandhi) hǎo, syeh-syeh", difficulty: "B2",
    identify: { options: ["我很好 (很 shifts to 2nd tone before 好)", "我很好 (很 stays 3rd)", "我不好,谢谢。", "我很累,谢谢。"], correctIdx: 0,
      explain: { en: "The same 3rd+3rd rule again: '很' and '好' are both 3rd tone, so '很' shifts up to 2nd in speech. And in a RUN of three 3rd tones (你想买 → ní xiáng mǎi), the first two both shift — the last one keeps its dip.", es: "La misma regla 3er+3er otra vez: '很' y '好' son ambos 3er tono, así que '很' sube a 2do en el habla. Y en una SERIE de tres terceros tonos (你想买 → ní xiáng mǎi), los dos primeros suben — el último conserva su caída." } },
    respond: { options: ["太好了!", "真的吗?", "为什么?", "在哪里?"], correctIdx: 0,
      explain: { en: "Hearing someone's well calls for a warm \"that's great!\"", es: "Escuchar que alguien está bien pide un cálido \"¡qué bien!\"" } } },
  { text: "不对!(Bú duì!)", sound: "bú (2nd) duì — 不 flips to 2nd tone before a 4th tone", difficulty: "B2",
    identify: { options: ["不对 (不 becomes 2nd tone before 4th-tone 对)", "不对 (不 stays 4th tone)", "不错 (búcuò, not bad)", "不队 (wrong character)"], correctIdx: 0,
      explain: { en: "'不' is normally 4th tone (bù), but before another 4th-tone syllable it flips to 2nd tone: 不对 → bú duì, 不是 → bú shì, 不去 → bú qù. Before 1st/2nd/3rd tones it stays bù. Like 一, it's spoken sandhi never shown in writing.", es: "'不' normalmente es 4to tono (bù), pero ante otra sílaba de 4to tono cambia a 2do tono: 不对 → bú duì, 不是 → bú shì, 不去 → bú qù. Ante 1er/2do/3er tonos se queda bù. Como 一, es sandhi hablado que nunca se muestra por escrito." } },
    respond: { options: ["那正确答案是什么?", "对不起。", "谢谢你。", "我也不去。"], correctIdx: 0,
      explain: { en: "A flat \"that's wrong!\" naturally invites \"then what's the right answer?\"", es: "Un rotundo \"¡incorrecto!\" invita naturalmente a \"¿entonces cuál es la respuesta correcta?\"" } } },
  // — C1: 儿化, the Beijing rhotic —
  { text: "一点儿。(Yìdiǎnr.)", sound: "yì-diǎr — the 儿 fuses into the syllable, dropping the -n", difficulty: "C1",
    identify: { options: ["一点儿 (diǎn + 儿 → 'diǎr', the -n absorbed)", "一点二 (yìdiǎn èr, 'one point two')", "一点人 (not a phrase)", "一点儿 said as two clear syllables 'diǎn-er'"], correctIdx: 0,
      explain: { en: "儿化 (erhua) is the rhotic -r suffix, strongest in Beijing speech: it fuses with the syllable rather than adding a beat, often swallowing a final -n or -i. 点 + 儿 becomes one syllable 'diǎr', not 'diǎn-er'. It softens the word and is a hallmark of northern Mandarin.", es: "儿化 (erhua) es el sufijo rótico -r, más fuerte en el habla de Pekín: se fusiona con la sílaba en vez de añadir un tiempo, a menudo tragándose una -n o -i final. 点 + 儿 se vuelve una sílaba 'diǎr', no 'diǎn-er'. Suaviza la palabra y es un sello del mandarín del norte." } },
    respond: { options: ["好的,给我一点儿。", "一共多少?", "北京话很有意思。", "儿化很难。"], correctIdx: 0,
      explain: { en: "\"A little bit\" fits an order — \"okay, give me a little.\"", es: "\"Un poquito\" encaja en un pedido — \"vale, dame un poco\"." } } },
  // — C2: neutral tone as meaning —
  { text: "东西 (dōngxī vs dōngxi)", sound: "dōngxī (both full 1st tones) vs dōngxi (2nd syllable neutral)", difficulty: "C2",
    identify: { options: ["东西 (dōngxi, neutral 2nd syllable) = a thing/object", "东西 (dōngxī, both 1st tone) = east-and-west (directions)", "the two readings are interchangeable", "东西 is always dōngxī"], correctIdx: 0,
      explain: { en: "Same two characters, meaning set by the tone alone: 东西 with both full 1st tones (dōngxī) means the compass directions east and west; with the second syllable dropped to neutral tone (dōngxi) it means \"a thing/object.\" The neutral tone isn't just lighter here — it selects the meaning, the way 雨/飴 does with pitch in Japanese.", es: "Los mismos dos caracteres, con el significado fijado solo por el tono: 东西 con ambos 1eros tonos completos (dōngxī) significa las direcciones este y oeste; con la segunda sílaba en tono neutro (dōngxi) significa \"una cosa/objeto.\" El tono neutro aquí no solo es más ligero — selecciona el significado, como 雨/飴 lo hacen con el tono en japonés." } },
    respond: { options: ["对,买东西的东西是轻声。", "东和西是方向。", "我不懂。", "再说一遍?"], correctIdx: 0,
      explain: { en: "A subtle tone-meaning point earns an \"aha\" — \"right, the 东西 in 'go shopping' is the neutral-tone one.\"", es: "Un punto sutil de tono-significado gana un \"ajá\" — \"cierto, el 东西 de 'ir de compras' es el de tono neutro\"." } } },
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
  bank: { ...BANK, fvocab: buildFrequencyBank(WORDS, { seed: 20260715, formulas: ZH_FORMULAS }) },
  // #78: Word Bank category — the round-draw engine caps its share of mixed
  // rounds instead of letting the frequency bank dominate the draw.
  wbCatId: "fvocab",
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "读一下大概的发音。这是什么?(Dú yíxià dàgài de fāyīn. Zhè shì shénme?)",
    identifyPromptNative: { en: "Read the approximate pronunciation. What does it say?" },
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — 哪个回答合适?(nǎge huídá héshì?)`,
    respondPromptNative: (i) => ({ en: `"${i.text}" — which response fits?` }),
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 35,
  extraQuestionTime: 35,
};

export default zhForEn;

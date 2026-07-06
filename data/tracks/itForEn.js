// Track: Italian, for an English speaker. Expanded depth (not just a starter
// set) — closer to esForEn.js's level. Categories: vocab (basics + classic
// false friends), gram (gendered articles, essere/avere auxiliary choice,
// required possessive articles, subjunctive trigger phrases — genuine
// trip-ups for English speakers), trad (idioms), and fono (vowel
// consistency, double consonants, elision — the things that actually trip up
// English speakers reading Italian aloud).

const CATS = {
  vocab: { label: "Vocabolario", color: "#3DDBFF" },
  gram: { label: "Grammatica", color: "#FFB84D" },
  trad: { label: "Frasi", color: "#FF3D7F" },
  fono: { label: "Fonetica", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Buongiorno' significa...", ["good morning/hello", "good night", "goodbye", "please"], 0,
      { en: "'Buongiorno' is the standard daytime greeting, literally \"good day\" — used from morning until early evening.", es: "'Buongiorno' es el saludo diurno estándar, literalmente \"buen día\" — se usa desde la mañana hasta el atardecer." }, "A1"],
    ["'Grazie' significa...", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'Grazie' is thank you — one of the most essential words to know.", es: "'Grazie' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'Amico' significa...", ["friend", "enemy", "neighbor", "teacher"], 0,
      { en: "'Amico' (masculine)/'amica' (feminine) means friend.", es: "'Amico' (masculino)/'amica' (femenino) significa amigo/a." }, "A1"],
    ["'Finestra' significa...", ["window", "door", "wall", "floor"], 0,
      { en: "'Finestra' means window — one of the most common everyday nouns.", es: "'Finestra' significa window — uno de los sustantivos cotidianos más comunes." }, "A2"],
    ["'Famiglia' significa...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'Famiglia' means family — the double 'g' doesn't change the pronunciation much but is a common spelling trap.", es: "'Famiglia' significa familia — la doble 'g' no cambia mucho la pronunciación pero es un error ortográfico común." }, "A2"],
    ["'Lavoro' significa...", ["work/job", "worker", "factory", "working (gerund)"], 0,
      { en: "'Lavoro' means work or job (the noun); 'lavorare' is the verb \"to work.\"", es: "'Lavoro' significa trabajo (el sustantivo); 'lavorare' es el verbo \"trabajar\"." }, "A2"],
    ["'Camera' significa...", ["room", "camera (photography)", "meeting room", "car"], 0,
      { en: "Classic false friend: 'camera' means room (especially bedroom) — a photography camera is 'macchina fotografica'.", es: "Falso amigo clásico: 'camera' significa habitación (sobre todo dormitorio) — una cámara fotográfica es 'macchina fotografica'." }, "B1"],
    ["'Parenti' significa...", ["relatives", "parents", "friends", "neighbors"], 0,
      { en: "Another false friend: 'parenti' means relatives in general. 'Parents' specifically is 'genitori'.", es: "Otro falso amigo: 'parenti' significa parientes en general. 'Parents' específicamente es 'genitori'." }, "B1"],
    ["'Fattoria' significa...", ["farm", "factory", "fabric", "fortune"], 0,
      { en: "False friend — 'fattoria' means farm. \"Factory\" is actually 'fabbrica' in Italian.", es: "Falso amigo — 'fattoria' significa granja. \"Factory\" en italiano es en realidad 'fabbrica'." }, "B1"],
    ["'Libreria' significa...", ["bookstore", "library", "bookshelf", "librarian"], 0,
      { en: "False friend — 'libreria' means bookstore (or bookshelf). The place you borrow books is 'biblioteca'.", es: "Falso amigo — 'libreria' significa librería (tienda) o estantería. El lugar donde se prestan libros es 'biblioteca'." }, "B1"],
    ["'Firma' significa...", ["signature", "firm/company", "confirmation", "name"], 0,
      { en: "False friend — 'firma' means signature. A company/firm is 'azienda' or 'ditta'.", es: "Falso amigo — 'firma' significa firma (de un documento). Una empresa es 'azienda' o 'ditta'." }, "B2"],
    ["'Sensibile' significa...", ["sensitive", "sensible/reasonable", "sensory", "senseless"], 0,
      { en: "False friend — 'sensibile' means emotionally sensitive. \"Sensible/reasonable\" is 'ragionevole' in Italian.", es: "Falso amigo — 'sensibile' significa sensible emocionalmente. \"Sensato/razonable\" es 'ragionevole' en italiano." }, "B2"],
  ],
  gram: [
    ["___ ragazza è simpatica.", ["La", "Il", "Lo", "Le"], 0,
      { en: "Italian nouns have grammatical gender — 'ragazza' (girl) is feminine, so it takes 'la', not the masculine 'il'.", es: "Los sustantivos italianos tienen género gramatical — 'ragazza' (chica) es femenino, así que lleva 'la', no el masculino 'il'." }, "A2"],
    ["Ho letto due ___.", ["libri", "libro", "libre", "libra"], 0,
      { en: "Masculine nouns ending in -o become -i in the plural (\"libro\" → \"libri\").", es: "Los sustantivos masculinos terminados en -o se vuelven -i en plural (\"libro\" → \"libri\")." }, "A2"],
    ["___ lavo le mani prima di mangiare.", ["Mi", "Mio", "Io", "Le"], 0,
      { en: "Reflexive verbs need a reflexive pronoun ('mi' = myself) — you're washing your OWN hands.", es: "Los verbos reflexivos necesitan un pronombre reflexivo ('mi' = a mí mismo) — te lavas tus propias manos." }, "A2"],
    ["Le case sono ___.", ["grandi", "grande", "grando", "grandes"], 0,
      { en: "Adjectives must agree in number and gender — the plural \"case\" needs the plural adjective form 'grandi'.", es: "Los adjetivos deben concordar en número y género — el plural \"case\" necesita la forma plural 'grandi'." }, "A2"],
    ["Sono nato ___ Roma.", ["a", "in", "di", "da"], 0,
      { en: "Italian uses 'a' for cities and 'in' for countries/regions ('vivo a Roma' vs. 'vivo in Italia') — a common trip-up for English speakers, who just use \"in\" for both.", es: "El italiano usa 'a' para ciudades e 'in' para países/regiones ('vivo a Roma' vs. 'vivo in Italia') — un error común para hablantes de inglés, que usan \"in\" para ambos." }, "B1"],
    ["Non ho visto nessuno.", ["✓ correct Italian usage", "double negative error", "wrong verb", "missing article"], 0,
      { en: "Unlike English (which avoids double negatives), Italian requires them — \"non...nessuno/niente/mai\" is standard, grammatically correct usage, not a mistake.", es: "A diferencia del inglés (que evita las dobles negaciones), el italiano las requiere — \"non...nessuno/niente/mai\" es un uso estándar y correcto, no un error." }, "B1"],
    ["___ andato al mercato.", ["Sono", "Ho", "Sto", "Ero"], 0,
      { en: "Verbs of movement/state (like 'andare') use 'essere' as the auxiliary in the perfect tense, not 'avere' like most other verbs.", es: "Los verbos de movimiento/estado (como 'andare') usan 'essere' como auxiliar en el pretérito perfecto, no 'avere' como la mayoría de los verbos." }, "B1"],
    ["Ecco ___ mio libro.", ["il", "— (no article)", "un", "del"], 0,
      { en: "Unlike English, Italian usually keeps the definite article with possessives ('il mio libro' = \"my book,\" literally \"the my book\").", es: "A diferencia del inglés, el italiano normalmente mantiene el artículo definido con los posesivos ('il mio libro' = \"mi libro,\" literalmente \"el mi libro\")." }, "B1"],
    ["Penso che lui ___ ragione.", ["abbia", "ha", "avere", "aveva"], 0,
      { en: "\"Penso che\" (\"I think that\") triggers the subjunctive mood in the following clause — 'abbia', not the indicative 'ha'.", es: "\"Penso che\" desencadena el modo subjuntivo en la cláusula siguiente — 'abbia', no el indicativo 'ha'." }, "B2"],
  ],
  trad: [
    ["Translate: 'Good luck!'", ["In bocca al lupo!", "Buona fortuna letterale!", "Nella bocca!", "Auguri lupo!"], 0,
      { en: "Literally \"in the wolf's mouth\" — the standard Italian way to wish someone luck, similar in spirit to \"break a leg.\"", es: "Literalmente \"en la boca del lobo\" — la forma estándar italiana de desear suerte, similar en espíritu a \"break a leg\" en inglés." }, "B1"],
    ["Translate: 'She's really sharp/on the ball.'", ["È molto in gamba.", "È molto in braccio.", "È molto in testa.", "È molto in piede."], 0,
      { en: "\"In gamba\" (literally \"in leg\") is an everyday idiom for being sharp, capable, or on the ball.", es: "\"In gamba\" (literalmente \"en pierna\") es un modismo cotidiano para alguien capaz o espabilado." }, "B2"],
    ["Translate: 'Keep it a secret!'", ["Acqua in bocca!", "Silenzio totale!", "Bocca chiusa!", "Segreto assoluto!"], 0,
      { en: "\"Acqua in bocca\" (literally \"water in mouth\") is the real, natural Italian idiom for keeping quiet about something.", es: "\"Acqua in bocca\" (literalmente \"agua en la boca\") es el modismo real y natural en italiano para guardar un secreto." }, "B2"],
    ["Translate: 'I can't wait!'", ["Non vedo l'ora!", "Non vedo niente!", "Aspetto con calma!", "Non ho tempo!"], 0,
      { en: "\"Non vedo l'ora\" (literally \"I don't see the hour\") is the standard way to say you can't wait for something.", es: "\"Non vedo l'ora\" (literalmente \"no veo la hora\") es la forma estándar de decir que no puedes esperar algo." }, "B1"],
    ["Translate: 'He's just teasing you.'", ["Ti sta solo prendendo in giro.", "Ti sta solo prendendo in cerchio.", "Ti sta solo burlando.", "Ti sta solo ridendo."], 0,
      { en: "\"Prendere in giro\" (literally \"to take in a circle/turn\") is the everyday idiom for teasing or making fun of someone.", es: "\"Prendere in giro\" (literalmente \"tomar en círculo\") es el modismo cotidiano para tomarle el pelo a alguien." }, "B2"],
    ["Translate: 'I'm totally broke right now.'", ["Sono al verde in questo momento.", "Sono al rosso in questo momento.", "Non ho soldi verdi.", "Sono senza verde."], 0,
      { en: "\"Essere al verde\" (literally \"to be at the green\") means to be broke — nobody's entirely sure why green, but it's the standard expression.", es: "\"Essere al verde\" (literalmente \"estar en el verde\") significa estar sin dinero — nadie está del todo seguro de por qué \"verde\", pero es la expresión estándar." }, "B2"],
    ["Translate: 'We stayed up really late.'", ["Abbiamo fatto le ore piccole.", "Abbiamo fatto le ore grandi.", "Siamo stati svegli piccoli.", "Abbiamo dormito poco tempo."], 0,
      { en: "\"Fare le ore piccole\" (literally \"to make the small hours\") means to stay up very late, into the small hours of the morning.", es: "\"Fare le ore piccole\" (literalmente \"hacer las horas pequeñas\") significa quedarse despierto hasta muy tarde, hasta la madrugada." }, "B2"],
  ],
};

// Italian phonetics: vowels are always the same five sounds (unlike English's
// many vowel sounds per letter), double consonants genuinely change word
// meaning/length, and "lo" elides to "l'" before a vowel. CAPS = stress.
const FONO_BANK = [
  { text: "Sono le tre in punto.", sound: "SOH-noh leh treh in POON-toh", difficulty: "B1",
    identify: { options: ["Sono le tre in punto.", "Sono le tre e un po'.", "Sono le due in punto.", "Sono le tre di notte."], correctIdx: 0,
      explain: { en: "Italian vowels stay consistent (the 'o' in 'sono' and 'punto' always sounds the same), unlike English where vowel sounds shift constantly.", es: "Las vocales italianas se mantienen consistentes (la 'o' en 'sono' y 'punto' siempre suena igual), a diferencia del inglés donde los sonidos vocálicos cambian constantemente." } },
    respond: { options: ["Perfetto, andiamo!", "Sono cinque euro.", "Mi piace molto.", "Non lo so."], correctIdx: 0,
      explain: { en: "A statement about the time calls for an acknowledgment/reaction, like \"perfect, let's go!\"", es: "Un comentario sobre la hora pide un reconocimiento o reacción, como \"¡perfecto, vamos!\"" } } },
  { text: "Mi piacerebbe un caffè, per favore.", sound: "mee pyah-cheh-REHB-beh oon kah-FEH, pehr fah-VOH-reh", difficulty: "B2",
    identify: { options: ["Mi piacerebbe un caffè, per favore.", "Mi piace il caffè, per favore.", "Vorrei un tè, per favore.", "Mi piacerebbe un caffè, grazie."], correctIdx: 0,
      explain: { en: "\"Piacerebbe\" (conditional \"would like\") has a double-B sound held slightly longer than a single B — a real, audible difference in Italian that English speakers often miss.", es: "\"Piacerebbe\" (condicional de \"gustar\") tiene un sonido de doble B que se mantiene un poco más que una B simple — una diferencia real y audible en italiano que los angloparlantes suelen pasar por alto." } },
    respond: { options: ["Subito, signore!", "Costa dieci euro.", "Non c'è problema.", "Mi dispiace tanto."], correctIdx: 0,
      explain: { en: "A polite request for coffee calls for a quick, service-style acknowledgment, like \"right away, sir!\"", es: "Una petición cortés de café pide un reconocimiento rápido y de servicio, como \"¡enseguida, señor!\"" } } },
  { text: "Vado a casa adesso.", sound: "VAH-doh ah KAH-zah ah-DEH-soh", difficulty: "A2",
    identify: { options: ["Vado a casa adesso.", "Vado in casa adesso.", "Vado a casa domani.", "Vado da casa adesso."], correctIdx: 0,
      explain: { en: "\"A casa\" (to/at home) doesn't take an article, unlike most destinations — a small but common exception worth just memorizing.", es: "\"A casa\" (a/en casa) no lleva artículo, a diferencia de la mayoría de los destinos — una excepción pequeña pero común que hay que memorizar." } },
    respond: { options: ["Va bene, a dopo!", "Costa dieci euro.", "Mi piace molto.", "Non lo so."], correctIdx: 0,
      explain: { en: "Someone saying they're heading home calls for a casual send-off, like \"okay, see you later!\"", es: "Alguien que dice que se va a casa espera una despedida casual, como \"¡vale, hasta luego!\"" } } },
  { text: "L'amico di Marco è simpatico.", sound: "lah-MEE-koh dee MAR-koh EH seem-PAH-tee-koh", difficulty: "B1",
    identify: { options: ["L'amico di Marco è simpatico.", "Lo amico di Marco è simpatico.", "L'amica di Marco è simpatico.", "L'amico di Marco è simpatica."], correctIdx: 0,
      explain: { en: "\"Lo\" elides to \"l'\" before a vowel (\"lo amico\" becomes \"l'amico\") — this elision is standard and required, not optional.", es: "\"Lo\" se convierte en \"l'\" antes de vocal (\"lo amico\" se convierte en \"l'amico\") — esta elisión es estándar y obligatoria, no opcional." } },
    respond: { options: ["Sì, è molto gentile.", "Costa cinque euro.", "Non ho tempo.", "È lontano da qui."], correctIdx: 0,
      explain: { en: "A comment about someone being nice calls for agreement, like \"yes, he's very kind.\"", es: "Un comentario sobre que alguien es simpático pide estar de acuerdo, como \"sí, es muy amable.\"" } } },
];

const itForEn = {
  id: "it-for-en",
  label: "Italiano",
  nameEn: "Italian",
  nameEs: "Italiano",
  sublabel: "For English speakers · Italian",
  nativeLang: "en",
  targetLang: "it",
  theme: "italy-fresca",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Leggi la pronuncia approssimativa. Cosa dice?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — quale risposta è appropriata?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default itForEn;

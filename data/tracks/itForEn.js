// Track: Italian, for an English speaker. Same shape as the other tracks —
// this is a STARTER SET, expand following the same pattern. Categories:
// vocab (basic vocab + classic false friends), gram (gendered articles,
// city/country prepositions, required double negatives — genuine trip-ups
// for English speakers), trad (idioms), and fono (vowel consistency, double
// consonants, and stress patterns — the things that actually trip up
// English speakers reading Italian aloud).

const CATS = {
  vocab: { label: "Vocabolario", color: "#3DDBFF" },
  gram: { label: "Grammatica", color: "#FFB84D" },
  trad: { label: "Frasi", color: "#FF3D7F" },
  fono: { label: "Fonetica", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Finestra' significa...", ["window", "door", "wall", "floor"], 0,
      { en: "'Finestra' means window — one of the most common everyday nouns.", es: "'Finestra' significa window — uno de los sustantivos cotidianos más comunes." }, "A2"],
    ["'Camera' significa...", ["room", "camera (photography)", "meeting room", "car"], 0,
      { en: "Classic false friend: 'camera' means room (especially bedroom) — a photography camera is 'macchina fotografica'.", es: "Falso amigo clásico: 'camera' significa habitación (sobre todo dormitorio) — una cámara fotográfica es 'macchina fotografica'." }, "B1"],
    ["'Parenti' significa...", ["relatives", "parents", "friends", "neighbors"], 0,
      { en: "Another false friend: 'parenti' means relatives in general. 'Parents' specifically is 'genitori'.", es: "Otro falso amigo: 'parenti' significa parientes en general. 'Parents' específicamente es 'genitori'." }, "B1"],
  ],
  gram: [
    ["___ ragazza è simpatica.", ["La", "Il", "Lo", "Le"], 0,
      { en: "Italian nouns have grammatical gender — 'ragazza' (girl) is feminine, so it takes 'la', not the masculine 'il'.", es: "Los sustantivos italianos tienen género gramatical — 'ragazza' (chica) es femenino, así que lleva 'la', no el masculino 'il'." }, "A2"],
    ["Sono nato ___ Roma.", ["a", "in", "di", "da"], 0,
      { en: "Italian uses 'a' for cities and 'in' for countries/regions ('vivo a Roma' vs. 'vivo in Italia') — a common trip-up for English speakers, who just use \"in\" for both.", es: "El italiano usa 'a' para ciudades e 'in' para países/regiones ('vivo a Roma' vs. 'vivo in Italia') — un error común para hablantes de inglés, que usan \"in\" para ambos." }, "B1"],
    ["Non ho visto nessuno.", ["✓ correct Italian usage", "double negative error", "wrong verb", "missing article"], 0,
      { en: "Unlike English (which avoids double negatives), Italian requires them — \"non...nessuno/niente/mai\" is standard, grammatically correct usage, not a mistake.", es: "A diferencia del inglés (que evita las dobles negaciones), el italiano las requiere — \"non...nessuno/niente/mai\" es un uso estándar y correcto, no un error." }, "B1"],
  ],
  trad: [
    ["Translate: 'Good luck!'", ["In bocca al lupo!", "Buona fortuna letterale!", "Nella bocca!", "Auguri lupo!"], 0,
      { en: "Literally \"in the wolf's mouth\" — the standard Italian way to wish someone luck, similar in spirit to \"break a leg.\"", es: "Literalmente \"en la boca del lobo\" — la forma estándar italiana de desear suerte, similar en espíritu a \"break a leg\" en inglés." }, "B1"],
    ["Translate: 'She's really sharp/on the ball.'", ["È molto in gamba.", "È molto in braccio.", "È molto in testa.", "È molto in piede."], 0,
      { en: "\"In gamba\" (literally \"in leg\") is an everyday idiom for being sharp, capable, or on the ball.", es: "\"In gamba\" (literalmente \"en pierna\") es un modismo cotidiano para alguien capaz o espabilado." }, "B2"],
    ["Translate: 'Keep it a secret!'", ["Acqua in bocca!", "Silenzio totale!", "Bocca chiusa!", "Segreto assoluto!"], 0,
      { en: "\"Acqua in bocca\" (literally \"water in mouth\") is the real, natural Italian idiom for keeping quiet about something — the other options are plausible-sounding but not the actual expression.", es: "\"Acqua in bocca\" (literalmente \"agua en la boca\") es el modismo real y natural en italiano para guardar un secreto — las otras opciones suenan plausibles pero no son la expresión real." }, "B2"],
  ],
};

// Italian phonetics: vowels are always the same five sounds (unlike English's
// many vowel sounds per letter), double consonants genuinely change word
// meaning/length, and stress is usually — but not always — on the
// second-to-last syllable. CAPS = stress.
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
];

const itForEn = {
  id: "it-for-en",
  label: "Italiano",
  sublabel: "For English speakers · Italian · starter content",
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
  extraPairsPerRound: 1,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default itForEn;

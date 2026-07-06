// Track: Spanish (Spain / Castilian), for an English speaker. Distinct from
// es-latam-for-en.js — this one uses vosotros forms, distinción (c/z pronounced
// like English "th"), and peninsular vocabulary/slang. STARTER SET — expand
// following the same pattern as the other tracks.

const CATS = {
  vocab: { label: "Vocabulario", color: "#3DDBFF" },
  verbo: { label: "Verbos", color: "#FFB84D" },
  trad: { label: "Traducción", color: "#FF3D7F" },
  fono: { label: "Fonética", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["¿Cómo se dice 'computer' en español (España)?", ["el ordenador", "la computadora", "el celular", "el ratón"], 0,
      { en: "In Spain, 'computer' is 'el ordenador'. Latin America uses 'la computadora' instead — same meaning, different region.", es: "En España, 'computer' es 'el ordenador'. En Latinoamérica se dice 'la computadora' — mismo significado, distinta región."}, "B1"],
    ["¿Cómo se dice 'cell phone' en español (España)?", ["el móvil", "el celular", "el teléfono grande", "la pantalla"], 0,
      { en: "Spain says 'el móvil'; Latin America says 'el celular'. Both mean cell phone.", es: "España dice 'el móvil'; Latinoamérica dice 'el celular'. Ambos significan cell phone."}, "B1"],
    ["¿Cómo se dice 'juice' en español (España)?", ["el zumo", "el jugo", "el agua", "la leche"], 0,
      { en: "'El zumo' is the Spain word for juice. 'El jugo' is the Latin American equivalent.", es: "'El zumo' es la palabra de España para juice. 'El jugo' es el equivalente latinoamericano."}, "B1"],
  ],
  verbo: [
    ["Vosotros _____ (tener) razón.", ["tenéis", "tienen", "tenemos", "tienes"], 0,
      { en: "'Vosotros' is the informal plural 'you all' used only in Spain — Latin America uses 'ustedes' instead, even informally.", es: "'Vosotros' es la forma informal de 'ustedes' que se usa solo en España — Latinoamérica usa 'ustedes' incluso en contextos informales."}, "B1"],
    ["¿Vosotros _____ (querer) venir a la fiesta?", ["queréis", "quieren", "queremos", "quieres"], 0,
      { en: "Vosotros pairs with the '-áis/-éis' verb ending — a form that doesn't exist at all in Latin American Spanish.", es: "Vosotros va con la terminación '-áis/-éis' — una forma que no existe en el español latinoamericano."}, "B1"],
    ["Vosotras _____ (ir) a la fiesta esta noche.", ["vais", "van", "vamos", "vas"], 0,
      { en: "'Vosotras' (feminine 'you all') takes 'vais'. Recognizing this form is essential for understanding Spain Spanish speech and media.", es: "'Vosotras' usa 'vais'. Reconocer esta forma es clave para entender el habla y los medios de España."}, "B1"],
  ],
  trad: [
    ["Translate: 'Okay, sounds good.'", ["Vale, genial.", "Bueno, está caro.", "Sí, es verdad.", "No, gracias."], 0,
      { en: "'Vale' is the extremely common Spain word for 'okay' — rarely used this way in Latin America.", es: "'Vale' es la palabra muy común en España para decir 'okay' — poco usada así en Latinoamérica."}, "B1"],
    ["Translate: 'Dude, look at this.'", ["Tío, mira esto.", "Señor, mire esto.", "Amigo, compra esto.", "Chico, vende esto."], 0,
      { en: "'Tío/tía' is Spain slang for 'dude/mate' among friends — not literally 'uncle/aunt' in this context.", es: "'Tío/tía' es jerga de España para 'dude/mate' entre amigos — no significa literalmente 'uncle/aunt' aquí."}, "B1"],
  ],
};

// Phonetics: distinción — 'c' (before e/i) and 'z' sound like English "th" in
// Spain, unlike the "s" sound used in Latin America. CAPS = stress, ‿ = linking.
const FONO_BANK = [
  { text: "Gracias por todo.", sound: "GRAH-thyahs pohr TOH-doh", difficulty: "A2",
    identify: { options: ["Gracias por todo.", "Gracias por toro.", "Gracias, no todo.", "Gracia, es todo."], correctIdx: 0,
      explain: { en: "The 'ci' in 'gracias' sounds like 'th' (as in 'think') in Spain — distinct from the 's' sound used in Latin America.", es: "El 'ci' en 'gracias' suena como 'th' en España — distinto del sonido 's' que se usa en Latinoamérica." } },
    respond: { options: ["De nada.", "Sí, claro.", "No, gracias.", "Está bien."], correctIdx: 0,
      explain: { en: "'De nada' (you're welcome) is the natural reply to thanks.", es: "'De nada' es la respuesta natural a un agradecimiento." } } },
  { text: "¿Vosotros venís también?", sound: "boh-SOH-trohs beh-NEES tahm-BYEHN", difficulty: "B1",
    identify: { options: ["¿Vosotros venís también?", "¿Vosotros venden también?", "¿Nosotros venimos también?", "¿Ustedes vienen también?"], correctIdx: 0,
      explain: { en: "'Venís' is the vosotros form of 'venir' — a conjugation pattern unique to Spain.", es: "'Venís' es la forma de vosotros de 'venir' — una conjugación exclusiva de España." } },
    respond: { options: ["Sí, vamos enseguida.", "No, lo vendo.", "Sí, venimos de allí.", "No, ustedes vienen."], correctIdx: 0,
      explain: { en: "A yes/no question about coming along needs a yes/no answer about coming along.", es: "Una pregunta de sí/no sobre venir necesita una respuesta de sí/no sobre venir." } } },
];

const esSpainForEn = {
  id: "es-spain-for-en",
  label: "Español (España)",
  sublabel: "For English speakers · Castilian Spanish · vosotros, distinción",
  nativeLang: "en",
  targetLang: "es",
  theme: "spain-warm",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Lee la pronunciación aproximada. ¿Qué dice?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — ¿cuál es la respuesta apropiada?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 1,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default esSpainForEn;

// Track: American English, for a Spanish speaker. Same shape as esForEn.js —
// this is a STARTER SET, not the full thing. Add more entries to BANK/FONO_BANK
// following the exact same pattern and the app automatically picks them up (no
// other code changes needed). Categories here: vocab, gram (grammar/prepositions
// — the traditional trouble spot for Spanish speakers), trad (idioms), and
// fono (reduced/connected English speech: "gonna", "wanna", flapped T, etc.)
// See enGbForEs.js for the British English counterpart.

const CATS = {
  vocab: { label: "Vocabulario", color: "#3DDBFF" },
  gram: { label: "Gramática", color: "#FFB84D" },
  trad: { label: "Frases", color: "#FF3D7F" },
  fono: { label: "Fonética", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Actually' se traduce como...", ["en realidad", "actualmente", "realmente rápido", "de hecho ahora"], 0,
      { en: "'Actually' is a false friend — it means 'en realidad', not 'actualmente' (currently).", es: "'Actually' es un falso amigo — significa 'en realidad', no 'actualmente'."}, "B1"],
    ["'Embarrassed' se traduce como...", ["avergonzado", "embarazada", "embargado", "abrumado"], 0,
      { en: "Classic false-friend trap: 'embarrassed' means avergonzado, not 'embarazada' (pregnant).", es: "Trampa clásica de falso amigo: 'embarrassed' significa avergonzado, no 'embarazada'."}, "B1"],
    ["'Library' se traduce como...", ["biblioteca", "librería", "libro grande", "estantería"], 0,
      { en: "Another false friend: 'library' is biblioteca. 'Librería' (bookstore) is a different word: 'bookstore'.", es: "Otro falso amigo: 'library' es biblioteca. 'Librería' en inglés se dice 'bookstore'."}, "B1"],
  ],
  gram: [
    ["I have lived here _____ five years.", ["for", "since", "during", "at"], 0,
      { en: "'For' pairs with a duration (five years); 'since' pairs with a starting point (2019, June).", es: "'For' va con una duración (cinco años); 'since' va con un punto de partida (2019, junio)."}, "B1"],
    ["She is interested _____ learning English.", ["in", "on", "for", "at"], 0,
      { en: "'Interested in' is the fixed preposition pairing — Spanish 'interesado en' matches, but many other verb+preposition pairs don't translate directly.", es: "'Interested in' es la pareja fija; 'interesado en' coincide, pero muchas otras combinaciones verbo+preposición no se traducen igual."}, "A2"],
    ["He _____ to the store yesterday.", ["went", "goed", "gone", "go"], 0,
      { en: "'Go' is irregular: went (past), not 'goed'.", es: "'Go' es irregular: went (pasado), no 'goed'."}, "A2"],
  ],
  trad: [
    ["Translate: 'Ya lo tengo controlado.'", ["I've got it handled.", "I have it controlled.", "I already have control.", "I got the control."], 0,
      { en: "'I've got it handled' is the natural English idiom — a literal word-for-word translation sounds off.", es: "'I've got it handled' es la expresión natural en inglés; la traducción literal suena rara."}, "B2"],
    ["Translate: 'No es para tanto.'", ["It's not a big deal.", "It's not for so much.", "It isn't too much.", "It's not that much."], 0,
      { en: "'It's not a big deal' is the natural equivalent — not a literal translation.", es: "'It's not a big deal' es el equivalente natural, no una traducción literal."}, "B2"],
  ],
};

// Phonetics for English: reduced/connected speech, the exact thing that makes
// fast native English hard to parse (contractions, flapped T, linking).
const FONO_BANK = [
  { text: "What are you going to do?", sound: "wuh-DUH-yuh GUH-nuh doo", difficulty: "A2",
    identify: { options: ["What are you going to do?", "What are you doing today?", "Where are you going to?", "What do you want to do?"], correctIdx: 0,
      explain: { en: "'Going to' reduces to 'gonna' in fast speech, and 'what are you' often blurs into 'whaddya'.", es: "'Going to' se reduce a 'gonna' al hablar rápido, y 'what are you' suele sonar como 'whaddya'." } },
    respond: { options: ["I'm going to finish this first.", "Yes, I am.", "It's over there.", "About three o'clock."], correctIdx: 0,
      explain: { en: "A 'what are you going to do' question needs a plan/action answer.", es: "Una pregunta de 'qué vas a hacer' necesita una respuesta con un plan o acción." } } },
  { text: "Did you eat yet?", sound: "DID-juh EET yet", difficulty: "A2",
    identify: { options: ["Did you eat yet?", "Did you meet yet?", "Do you eat a lot?", "Did she eat yet?"], correctIdx: 0,
      explain: { en: "'Did you' commonly blends into 'didja' in casual speech.", es: "'Did you' suele fusionarse en 'didja' en el habla casual." } },
    respond: { options: ["Not yet, I'm starving.", "She's over there.", "It's five dollars.", "Yes, I met him."], correctIdx: 0,
      explain: { en: "This needs a yes/no about eating, not an unrelated answer.", es: "Se necesita un sí/no sobre comer, no una respuesta sin relación." } } },
];

const enForEs = {
  id: "en-us-for-es",
  label: "English (US)",
  sublabel: "Para hispanohablantes · American English · starter content",
  nativeLang: "es",
  theme: "english-us",
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

export default enForEs;

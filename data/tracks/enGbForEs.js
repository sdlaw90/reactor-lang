// Track: British English, for a Spanish speaker. Same shape as enUsForEs.js,
// but with genuinely distinct content — not just a reskin: different everyday
// vocabulary, different idioms, and non-rhotic (dropped R) phonetics that
// American English doesn't have. STARTER SET — expand following the same
// pattern as the other tracks.

const CATS = {
  vocab: { label: "Vocabulario", color: "#3DDBFF" },
  gram: { label: "Gramática", color: "#FFB84D" },
  trad: { label: "Frases", color: "#FF3D7F" },
  fono: { label: "Fonética", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Flat' (en inglés británico) significa...", ["apartment", "flat surface", "tire", "floor"], 0,
      { en: "In British English, 'flat' means apartment. Americans would say 'apartment' instead — 'flat' to them usually means something else (like a flat tire).", es: "En inglés británico, 'flat' significa apartment. Los estadounidenses dirían 'apartment' — para ellos 'flat' suele significar otra cosa." }],
    ["'Lift' (en inglés británico) significa...", ["elevator", "to lift weights", "a ride/favor", "upstairs"], 0,
      { en: "British 'lift' = American 'elevator'. Confusingly, British English also uses 'lift' for giving someone a ride, same as American English.", es: "'Lift' en inglés británico equivale a 'elevator' en inglés americano. También significa dar un aventón, igual en ambos." }],
    ["'Rubbish' significa...", ["garbage/trash", "expensive", "delicious", "boring"], 0,
      { en: "'Rubbish' is the British word for garbage/trash — Americans would just say 'trash' or 'garbage'.", es: "'Rubbish' es la palabra británica para basura — los estadounidenses dirían 'trash' o 'garbage'." }],
  ],
  gram: [
    ["I've just eaten, _____?", ["haven't I", "didn't I", "have I", "don't I"], 0,
      { en: "Tag questions ('haven't I', 'isn't it', 'won't you') are far more common and varied in British English than American English, which tends to just say 'right?'.", es: "Las 'tag questions' ('haven't I', 'isn't it') son mucho más comunes y variadas en inglés británico; el americano suele decir simplemente 'right?'." }],
    ["He's in hospital.", ["✓ correct British usage", "missing 'the'", "wrong tense", "wrong preposition"], 0,
      { en: "British English drops 'the' with 'hospital' ('in hospital'); American English requires it ('in the hospital'). Both are grammatically standard in their own dialect.", es: "El inglés británico omite 'the' con 'hospital' ('in hospital'); el americano lo requiere ('in the hospital'). Ambos son correctos en su propio dialecto." }],
    ["Have you got a pen?", ["✓ correct British usage", "should be 'Do you have'", "missing 'got'", "wrong word order"], 0,
      { en: "'Have you got...?' is the everyday British way to ask if someone has something. American English favors 'Do you have...?' instead — both are correct, just regional.", es: "'Have you got...?' es la forma cotidiana británica de preguntar si alguien tiene algo. El inglés americano prefiere 'Do you have...?' — ambos correctos, solo regionales." }],
  ],
  trad: [
    ["Translate: 'Thanks a lot.'", ["Cheers.", "Brilliant.", "Fancy that.", "Bloody hell."], 0,
      { en: "'Cheers' in British English is used casually to mean 'thanks', not just for toasting drinks.", es: "'Cheers' en inglés británico se usa casualmente para decir 'gracias', no solo para brindar." }],
    ["Translate: 'I'm exhausted.'", ["I'm knackered.", "I'm fancy.", "I'm chuffed.", "I'm gutted."], 0,
      { en: "'Knackered' is a very common British way to say exhausted — not used in American English.", es: "'Knackered' es una forma muy común en Reino Unido de decir agotado — no se usa en inglés americano." }],
    ["Translate: 'That's great news!'", ["Brilliant!", "Rubbish!", "Knackered!", "Fancy!"], 0,
      { en: "'Brilliant' is a very common British exclamation for 'great/excellent' — used far more casually than in American English.", es: "'Brilliant' es una exclamación británica muy común para decir 'genial/excelente' — mucho más casual que en inglés americano." }],
  ],
};

// Non-rhotic phonetics: British English drops the 'r' sound after vowels
// (unlike American English, which pronounces it clearly). CAPS = stress.
const FONO_BANK = [
  { text: "Can't find my car keys.", sound: "KAHNT fyned my KAH keez",
    identify: { options: ["Can't find my car keys.", "Can't find my card keys.", "Can't remind my car keys.", "Can't find my far keys."], correctIdx: 0,
      explain: { en: "British 'car' drops the r-sound entirely ('KAH'), unlike American English which pronounces it clearly ('kar'). Also note the broad 'a' in 'can't' (KAHNT vs American KANT).", es: "El 'car' británico no pronuncia la 'r' ('KAH'), a diferencia del inglés americano que sí la pronuncia ('kar'). También nota la 'a' abierta en 'can't' (KAHNT vs. americano KANT)." } },
    respond: { options: ["Did you check your pockets?", "It's five dollars.", "Turn left at the light.", "I'm not hungry either."], correctIdx: 0,
      explain: { en: "Someone who can't find their keys needs a helpful suggestion, not an unrelated reply.", es: "Alguien que no encuentra sus llaves necesita una sugerencia útil, no una respuesta sin relación." } } },
  { text: "It's rather warm today, isn't it?", sound: "its RAH-thuh wawm tuh-DAY, IZ-uhnt it",
    identify: { options: ["It's rather warm today, isn't it?", "It's rather cold today, isn't it?", "It's rather warm today, is it?", "It's a rather warm day, wasn't it?"], correctIdx: 0,
      explain: { en: "'Rather' as 'quite/somewhat' is distinctly British (Americans would say 'pretty warm'), and note the tag question 'isn't it?' tacked on the end.", es: "'Rather' con el sentido de 'bastante' es típicamente británico (los americanos dirían 'pretty warm'), y nota la 'tag question' 'isn't it?' al final." } },
    respond: { options: ["Yes, quite warm indeed.", "No, I don't have any.", "It's over there.", "I finished it already."], correctIdx: 0,
      explain: { en: "A tag-question comment about the weather calls for agreement or disagreement about the weather.", es: "Un comentario con 'tag question' sobre el clima pide estar de acuerdo o no sobre el clima." } } },
];

const enGbForEs = {
  id: "en-gb-for-es",
  label: "English (UK)",
  sublabel: "Para hispanohablantes · British English · starter content",
  nativeLang: "es",
  theme: "english-uk",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
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

export default enGbForEs;

// Track: English, for an Italian speaker. First installment of the
// native-language track system (Tier 1 extension) — pairs with the
// existing itForEn.js (Italian for English speakers) to form a genuine
// bidirectional pair. Full depth (36 items). Content focuses on what's
// actually useful for an Italian speaker specifically: Italian-English
// false friends (a rich, well-documented category given how many Latin
// roots the two languages share but have drifted apart on), English
// grammar structures that don't map cleanly onto Italian, and English
// phonetics that are genuinely difficult for Italian speakers (TH sounds,
// schwa, English's less predictable word stress).

const CATS = {
  vocab: { label: "Vocabolario", color: "#3DDBFF" },
  gram: { label: "Grammatica", color: "#FFB84D" },
  trad: { label: "Modi di dire", color: "#FF3D7F" },
  fono: { label: "Fonetica", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Actually' significa...", ["in realtà/davvero", "attualmente", "eventualmente", "effettivamente (nel senso di sforzo)"], 0,
      { en: "Falso amico — 'actually' means \"in fact/really,\" not \"attualmente\" (currently). That sense is 'currently' in English.", es: "Falso amigo — 'actually' significa \"en realidad,\" no \"actualmente.\" Ese sentido es 'currently' en inglés." }, "A2"],
    ["'Eventually' significa...", ["alla fine/finalmente", "eventualmente/possibilmente", "casualmente", "occasionalmente"], 0,
      { en: "Falso amico — 'eventually' means \"in the end/finally,\" not \"eventualmente\" (possibly). That sense is 'possibly' or 'maybe' in English.", es: "Falso amigo — 'eventually' significa \"al final,\" no \"eventualmente\" (posiblemente). Ese sentido es 'possibly' o 'maybe' en inglés." }, "B1"],
    ["'Sensible' significa...", ["assennato/ragionevole", "sensibile (emotivamente)", "sensoriale", "delicato"], 0,
      { en: "Falso amico — 'sensible' means reasonable/level-headed, not \"sensibile\" (emotionally sensitive). That sense is 'sensitive' in English.", es: "Falso amigo — 'sensible' significa razonable, no \"sensible\" emocionalmente. Ese sentido es 'sensitive' en inglés." }, "B2"],
    ["'Library' significa...", ["biblioteca", "libreria (negozio)", "libro", "scaffale"], 0,
      { en: "Falso amico — 'library' means biblioteca (a place to borrow books), not \"libreria\" (a shop that sells them). That's 'bookshop/bookstore' in English.", es: "Falso amigo — 'library' significa biblioteca, no \"librería\" (tienda). Eso es 'bookshop/bookstore' en inglés." }, "B1"],
    ["'Parents' significa...", ["genitori", "parenti (in generale)", "nonni", "cugini"], 0,
      { en: "Falso amico — 'parents' means specifically mom and dad, not \"parenti\" (relatives in general). That broader sense is 'relatives' in English.", es: "Falso amigo — 'parents' significa específicamente mamá y papá, no \"parientes\" en general. Ese sentido más amplio es 'relatives' en inglés." }, "A2"],
    ["'Camera' significa...", ["macchina fotografica", "stanza/camera da letto", "cameriere", "corridoio"], 0,
      { en: "Falso amico diretto — in English 'camera' is a device for taking photos, not a room. \"Room/bedroom\" is 'room/bedroom' in English.", es: "Falso amigo directo — en inglés 'camera' es un dispositivo para tomar fotos, no una habitación. Eso es 'room/bedroom' en inglés." }, "A2"],
    ["'Factory' significa...", ["fabbrica", "fattoria", "fabbricante", "operaio"], 0,
      { en: "Falso amico — 'factory' means fabbrica, not \"fattoria\" (farm). \"Farm\" is 'farm' in English.", es: "Falso amigo — 'factory' significa fábrica, no \"granja\". \"Granja\" es 'farm' en inglés." }, "B1"],
    ["'Pretend' significa...", ["fingere", "pretendere/esigere", "aspettarsi", "sostenere (un'opinione)"], 0,
      { en: "Falso amico — 'pretend' means to fake/make believe, not \"pretendere\" (to demand/expect). That sense is 'demand' or 'expect' in English.", es: "Falso amigo — 'pretend' significa fingir, no \"pretender\" (exigir). Ese sentido es 'demand' o 'expect' en inglés." }, "B2"],
    ["'Fabric' significa...", ["tessuto/stoffa", "fabbrica", "tessitore", "cucitura"], 0,
      { en: "Falso amico — 'fabric' means cloth/textile, not \"fabbrica\" (factory). \"Factory\" is 'factory' in English.", es: "Falso amigo — 'fabric' significa tela, no \"fábrica\". \"Fábrica\" es 'factory' en inglés." }, "B1"],
    ["'Confetti' significa...", ["coriandoli di carta", "confetti (mandorle zuccherate)", "caramelle in generale", "decorazioni natalizie"], 0,
      { en: "Falso amico culturale — in English, 'confetti' is thrown paper decoration, not the sugared almonds Italians know as confetti. Those are 'sugared almonds' in English.", es: "Falso amigo cultural — en inglés, 'confetti' es papel decorativo que se lanza, no las almendras garrapiñadas. Esas son 'sugared almonds' en inglés." }, "B2"],
    ["'Bravo' in inglese...", ["è invariabile (non cambia con genere/numero)", "si accorda come in italiano (bravo/brava/bravi/brave)", "si usa solo al maschile singolare", "non si usa mai come esclamazione"], 0,
      { en: "Unlike Italian, English 'Bravo!' never changes form — no bravo/brava/bravi/brave distinction, it's always just \"Bravo!\" regardless of who or how many.", es: "A diferencia del italiano, el inglés 'Bravo!' nunca cambia de forma — sin distinción de género o número, siempre es \"Bravo!\"" }, "A2"],
    ["'Terrific' significa...", ["fantastico/eccezionale", "terrificante/spaventoso", "terribile", "mediocre"], 0,
      { en: "Despite sounding like \"terrifying,\" 'terrific' actually means wonderful/great — a genuinely surprising positive word.", es: "A pesar de sonar como \"terrifying,\" 'terrific' en realidad significa maravilloso — una palabra positiva genuinamente sorprendente." }, "B1"],
  ],
  gram: [
    ["Do you like coffee?", ["✓ corretto — 'do' è obbligatorio nelle domande", "manca un verbo", "ordine delle parole sbagliato", "'do' non serve qui"], 0,
      { en: "Italian doesn't need a dummy auxiliary for questions (\"Ti piace il caffè?\"), but English requires 'do/does' in most present-tense questions without another auxiliary verb.", es: "El italiano no necesita un auxiliar vacío para preguntas (\"Ti piace il caffè?\"), pero el inglés requiere 'do/does' en la mayoría de las preguntas en presente sin otro verbo auxiliar." }, "A2"],
    ["I like ___ music. (in generale)", ["(nessun articolo)", "the", "a", "some"], 0,
      { en: "English drops the article for general/abstract statements — \"I like music,\" not \"I like the music\" — unlike Italian's \"Mi piace LA musica,\" which requires the article.", es: "El inglés omite el artículo en afirmaciones generales — \"I like music,\" no \"I like the music\" — a diferencia del italiano \"Mi piace LA musica,\" que requiere el artículo." }, "B1"],
    ["I ___ here for 10 years. (e vivo ancora qui)", ["have lived", "lived", "am living", "live"], 0,
      { en: "A classic pain point: Italian's passato prossimo covers both \"I have lived\" (ongoing relevance) and \"I lived\" (finished) with one form, but English distinguishes present perfect (still true now) from simple past (finished, disconnected from now).", es: "Un punto clásico de confusión: el passato prossimo italiano cubre tanto \"he vivido\" (relevancia continua) como \"viví\" (terminado) con una forma, pero el inglés distingue el presente perfecto (aún cierto) del pasado simple (terminado)." }, "B2"],
    ["a beautiful old Italian car", ["✓ corretto — ordine: opinione-età-origine-nome", "old beautiful Italian car", "Italian old beautiful car", "car beautiful old Italian"], 0,
      { en: "English adjectives before a noun follow a fairly fixed order (opinion, age, origin...) that doesn't map onto Italian's more flexible, often post-noun adjective placement.", es: "Los adjetivos en inglés antes de un sustantivo siguen un orden bastante fijo (opinión, edad, origen...) que no se corresponde con la colocación más flexible del italiano, a menudo después del sustantivo." }, "B2"],
    ["I don't want ___.", ["anything", "nothing", "something", "everything"], 0,
      { en: "Standard English grammar forbids double negatives — \"I don't want anything,\" not \"I don't want nothing\" — while Italian happily uses them (\"Non voglio niente\").", es: "La gramática inglesa estándar prohíbe la doble negación — \"I don't want anything,\" no \"I don't want nothing\" — mientras que el italiano los usa con gusto (\"Non voglio niente\")." }, "B1"],
    ["___ eat breakfast every day. (io)", ["I", "(niente, si può omettere)", "Me", "My"], 0,
      { en: "Italian can drop the subject pronoun since verb conjugation already shows who's doing the action (\"Mangio\"), but English always requires an explicit subject pronoun — \"I eat,\" not just \"Eat.\"", es: "El italiano puede omitir el pronombre sujeto ya que la conjugación verbal ya muestra quién actúa (\"Mangio\"), pero el inglés siempre requiere un pronombre sujeto explícito." }, "B1"],
    ["___ book (il libro di Maria)", ["Maria's", "Of Maria", "Maria of", "The Maria"], 0,
      { en: "English's possessive 's (\"Maria's book\") has no direct structural equivalent in Italian, which uses \"il libro di Maria\" instead — a genuinely different construction, not just a different word order.", es: "El posesivo 's del inglés (\"Maria's book\") no tiene un equivalente estructural directo en italiano, que usa \"il libro di Maria\" — una construcción genuinamente diferente, no solo un orden de palabras distinto." }, "A2"],
    ["I ___ right now. (in questo momento)", ["am eating", "eat", "ate", "have eaten"], 0,
      { en: "English uses the continuous/progressive tense (\"I am eating\") far more obligatorily than Italian's \"stare + gerundio,\" which is optional in many contexts where English requires the -ing form.", es: "El inglés usa el tiempo continuo (\"I am eating\") de forma mucho más obligatoria que el \"stare + gerundio\" italiano, que es opcional en muchos contextos donde el inglés requiere la forma -ing." }, "B1"],
    ["I'm interested ___ learning English.", ["in", "to", "for", "on"], 0,
      { en: "Certain English verbs/adjectives require preposition + gerund (\"interested IN learning,\" not \"interested to learn\") — a pattern that doesn't translate predictably from Italian and has to be learned case by case.", es: "Ciertos verbos/adjetivos en inglés requieren preposición + gerundio (\"interested IN learning,\" no \"interested to learn\") — un patrón que no se traduce de forma predecible desde el italiano y hay que aprenderlo caso por caso." }, "B2"],
  ],
  trad: [
    ["Traduci: 'Sta piovendo a catinelle.'", ["It's raining cats and dogs.", "It's raining buckets and pots.", "It's raining hard water.", "It's a heavy rain storm."], 0,
      { en: "Both languages have a vivid idiom for heavy rain, but with completely different imagery — Italian buckets, English cats and dogs.", es: "Ambos idiomas tienen un modismo vívido para la lluvia intensa, pero con imágenes completamente distintas — cubetas en italiano, gatos y perros en inglés." }, "B1"],
    ["Traduci: 'In bocca al lupo!'", ["Break a leg!", "In the wolf's mouth!", "Good fortune to you!", "May luck find you!"], 0,
      { en: "Both \"in bocca al lupo\" and \"break a leg\" are good-luck idioms with surprisingly violent literal imagery — a fun coincidence across two unrelated traditions.", es: "Tanto \"in bocca al lupo\" como \"break a leg\" son modismos de buena suerte con una imaginería literal sorprendentemente violenta." }, "B1"],
    ["Traduci: 'La palla è nel tuo campo.'", ["The ball is in your court.", "The ball is in your field.", "It's your turn to play.", "The game is yours now."], 0,
      { en: "\"The ball is in your court\" (from tennis) means it's someone else's turn to act or decide — used the same way in both languages, just with a tennis rather than generic sports image.", es: "\"The ball is in your court\" (del tenis) significa que es el turno de otra persona para actuar o decidir — se usa igual en ambos idiomas, solo con una imagen de tenis en vez de deportes en general." }, "B2"],
    ["Traduci: 'Ogni morte di papa.'", ["Once in a blue moon.", "Every death of a pope.", "Very rarely happens.", "Almost never occurs."], 0,
      { en: "Both \"ogni morte di papa\" and \"once in a blue moon\" mean something rare — again, completely different imagery (papal deaths vs. an astronomical rarity) for the same underlying idea.", es: "Tanto \"ogni morte di papa\" como \"once in a blue moon\" significan algo raro — de nuevo, imaginería completamente distinta para la misma idea." }, "B2"],
    ["Traduci: 'Facile come bere un bicchier d'acqua.'", ["Piece of cake.", "Easy as drinking a glass of water.", "Simple as breathing.", "No effort at all."], 0,
      { en: "Where Italian says \"easy as drinking a glass of water,\" English says \"piece of cake\" — same underlying idea (something effortless), completely different image.", es: "Donde el italiano dice \"fácil como beber un vaso de agua,\" el inglés dice \"piece of cake\" (pedazo de pastel) — la misma idea, imagen completamente distinta." }, "B1"],
    ["Traduci: 'Mi sento un po' giù.'", ["I'm feeling a bit under the weather.", "I'm feeling a bit down the weather.", "I'm under a bad mood.", "I'm below normal today."], 0,
      { en: "\"Under the weather\" means feeling slightly unwell — a common English idiom with no obvious literal logic, just worth memorizing as a fixed phrase.", es: "\"Under the weather\" significa sentirse ligeramente mal — un modismo inglés común sin lógica literal obvia, solo hay que memorizarlo como frase fija." }, "B1"],
    ["Traduci: 'Bisogna avere il coraggio di affrontarlo.'", ["You have to bite the bullet.", "You have to bite the metal.", "You must face the fire.", "You need to swallow it whole."], 0,
      { en: "\"Bite the bullet\" means to face something difficult or painful with courage, supposedly from biting on a bullet during surgery before anesthesia existed.", es: "\"Bite the bullet\" significa afrontar algo difícil con valentía, supuestamente de morder una bala durante cirugías antes de que existiera la anestesia." }, "B2"],
  ],
};

// English phonetics genuinely difficult for Italian speakers: TH sounds
// (voiceless θ and voiced ð don't exist in Italian, commonly replaced with
// T/D or S/Z), the schwa/unstressed vowel (Italian vowels stay "pure"
// regardless of stress, English reduces unstressed vowels heavily), and
// English's less predictable, syllable-swallowing word stress patterns.
const FONO_BANK = [
  { text: "Think about this.", sound: "think(TH sorda) uh-BOWT this(TH sonora)", difficulty: "A2",
    identify: { options: ["Think about this.", "Sink about this.", "Tink about dis.", "Fink about zis."], correctIdx: 0,
      explain: { en: "The TH sounds (voiceless in 'think,' voiced in 'this') don't exist in Italian at all — commonly approximated with T/D or S/Z by Italian speakers, but genuinely distinct sounds worth practicing.", es: "Los sonidos TH (sordo en 'think,' sonoro en 'this') no existen en italiano en absoluto — comúnmente aproximados con T/D o S/Z por hablantes de italiano, pero son sonidos genuinamente distintos que vale la pena practicar." } },
    respond: { options: ["Yes, that makes sense.", "Grazie mille.", "Alla prossima.", "Non lo so."], correctIdx: 0,
      explain: { en: "Being asked to consider something calls for a simple acknowledgment in English.", es: "Que te pidan considerar algo pide un simple reconocimiento en inglés." } } },
  { text: "I'm about to leave.", sound: "uhm uh-BOWT tuh leev (schwa everywhere unstressed)", difficulty: "B1",
    identify: { options: ["I'm about to leave.", "I'm a boat to leave.", "I am about two leaves.", "I'm a bout to leave."], correctIdx: 0,
      explain: { en: "English heavily reduces unstressed vowels to a neutral \"schwa\" sound (uh) — 'about' becomes closer to \"uh-BOWT.\" Italian vowels stay full/\"pure\" regardless of stress, which is why this takes real practice.", es: "El inglés reduce mucho las vocales átonas a un sonido neutro \"schwa\" (uh) — 'about' se acerca a \"uh-BOWT.\" Las vocales italianas se mantienen completas sin importar el acento, por eso esto requiere práctica real." } },
    respond: { options: ["Okay, see you soon!", "Che peccato.", "Non importa.", "Come stai?"], correctIdx: 0,
      explain: { en: "Someone announcing they're leaving calls for a simple, friendly send-off.", es: "Que alguien anuncie que se va pide una despedida simple y amistosa." } } },
  { text: "That's comfortable.", sound: "KUMF-ter-bul (NOT com-for-ta-ble)", difficulty: "B2",
    identify: { options: ["That's comfortable.", "That's confortable.", "That's comfort-able.", "That's comfertable."], correctIdx: 0,
      explain: { en: "English word stress can dramatically swallow syllables — 'comfortable' compresses to roughly \"KUMF-ter-bul,\" not the evenly-timed four syllables Italian's own rhythm would suggest.", es: "El acento en inglés puede reducir drásticamente las sílabas — 'comfortable' se comprime a \"KUMF-ter-bul,\" no las cuatro sílabas uniformes que sugeriría el ritmo propio del italiano." } },
    respond: { options: ["I'm glad you like it.", "Mi dispiace.", "Non c'è di che.", "Speriamo bene."], correctIdx: 0,
      explain: { en: "Someone saying something is comfortable calls for a pleased response.", es: "Que alguien diga que algo es cómodo pide una respuesta complacida." } } },
  { text: "Around the world.", sound: "uh-ROWND thuh wurld (English R + consonant cluster)", difficulty: "B2",
    identify: { options: ["Around the world.", "Around the word.", "A round the world.", "Around the whirled."], correctIdx: 0,
      explain: { en: "The English R (an approximant) plus the \"rld\" consonant cluster in 'world' is genuinely difficult for Italian speakers, whose R is trilled or tapped, a fundamentally different sound.", es: "La R inglesa (una aproximante) más el grupo consonántico \"rld\" en 'world' es genuinamente difícil para hablantes de italiano, cuya R es vibrante o vibrante simple, un sonido fundamentalmente distinto." } },
    respond: { options: ["That sounds amazing!", "Che bello!", "Non ci credo.", "Davvero?"], correctIdx: 0,
      explain: { en: "Hearing about traveling around the world calls for an enthusiastic reaction.", es: "Escuchar sobre viajar por el mundo pide una reacción entusiasta." } } },
];

const enForIt = {
  id: "en-for-it",
  label: "English",
  nameEn: "English",
  nameEs: "Inglés",
  sublabel: "Per madrelingua italiani · Inglese",
  nativeLang: "it",
  targetLang: "en",
  theme: "english-us",
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

export default enForIt;

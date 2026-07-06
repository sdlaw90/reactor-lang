// Track: French (France), for an English speaker. Built at full depth from
// the start (not a starter set — Italian taught us starter sets feel too
// thin against the mastery tracker). Categories: vocab (basics + classic
// false friends), gram (gendered articles, être/avoir auxiliary choice,
// required ne...pas negation, subjunctive trigger phrases, y/en pronouns —
// genuine trip-ups for English speakers), trad (idioms), and fono (liaison,
// nasal vowels, silent letters — the things that actually trip up English
// speakers reading French aloud).

const CATS = {
  vocab: { label: "Vocabulaire", color: "#3DDBFF" },
  gram: { label: "Grammaire", color: "#FFB84D" },
  trad: { label: "Expressions", color: "#FF3D7F" },
  fono: { label: "Phonétique", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Bonjour' signifie...", ["hello/good day", "good night", "goodbye", "please"], 0,
      { en: "'Bonjour' is the standard daytime greeting, used from morning until early evening.", es: "'Bonjour' es el saludo diurno estándar, usado desde la mañana hasta el atardecer." }, "A1"],
    ["'Merci' signifie...", ["thank you", "please", "sorry", "you're welcome"], 0,
      { en: "'Merci' is thank you — one of the most essential words to know.", es: "'Merci' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'Ami/Amie' signifie...", ["friend", "enemy", "neighbor", "teacher"], 0,
      { en: "'Ami' (masculine)/'amie' (feminine) means friend.", es: "'Ami' (masculino)/'amie' (femenino) significa amigo/a." }, "A1"],
    ["'Fenêtre' signifie...", ["window", "door", "wall", "floor"], 0,
      { en: "'Fenêtre' means window — the circumflex (^) often marks a letter that used to be there historically (here, an 's': 'fenestre' in Old French).", es: "'Fenêtre' significa ventana — el circunflejo (^) suele marcar una letra que existía antes históricamente (aquí, una 's': 'fenestre' en francés antiguo)." }, "A2"],
    ["'Famille' signifie...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'Famille' means family — pronounced \"fah-MEE\" (the double 'll' after 'i' sounds like a 'y', not an 'l').", es: "'Famille' significa familia — se pronuncia \"fah-MEE\" (la doble 'll' después de 'i' suena como 'y', no como 'l')." }, "A2"],
    ["'Travail' signifie...", ["work/job", "worker", "factory", "working (gerund)"], 0,
      { en: "'Travail' means work or job (the noun); 'travailler' is the verb \"to work.\"", es: "'Travail' significa trabajo (el sustantivo); 'travailler' es el verbo \"trabajar\"." }, "A2"],
    ["'Librairie' signifie...", ["bookstore", "library", "bookshelf", "librarian"], 0,
      { en: "Classic false friend: 'librairie' means bookstore. The place you borrow books is 'bibliothèque'.", es: "Falso amigo clásico: 'librairie' significa librería (tienda). El lugar donde se prestan libros es 'bibliothèque'." }, "B1"],
    ["'Coin' signifie...", ["corner", "coin (money)", "corner store", "edge"], 0,
      { en: "False friend — 'coin' means corner. A coin (money) is 'pièce' in French.", es: "Falso amigo — 'coin' significa esquina. Una moneda es 'pièce' en francés." }, "B1"],
    ["'Demander' signifie...", ["to ask", "to demand", "to require", "to order"], 0,
      { en: "False friend — 'demander' just means to ask (a question or for something), not the forceful \"demand.\" To demand is 'exiger'.", es: "Falso amigo — 'demander' simplemente significa pedir o preguntar, no \"exigir\" con fuerza. \"Exigir\" es 'exiger'." }, "B1"],
    ["'Actuellement' signifie...", ["currently/right now", "actually/in fact", "eventually", "usually"], 0,
      { en: "False friend — 'actuellement' means \"currently,\" not \"actually.\" \"Actually/in fact\" is 'en fait'.", es: "Falso amigo — 'actuellement' significa \"actualmente,\" no \"actually.\" \"En realidad\" es 'en fait'." }, "B2"],
    ["'Assister à' signifie...", ["to attend", "to assist/help", "to watch on TV", "to organize"], 0,
      { en: "False friend — 'assister à' means to attend (an event). \"To assist/help\" is 'aider'.", es: "Falso amigo — 'assister à' significa asistir a (un evento). \"Ayudar\" es 'aider'." }, "B2"],
    ["'Sensible' signifie...", ["sensitive", "sensible/reasonable", "sensory", "senseless"], 0,
      { en: "False friend — 'sensible' means emotionally sensitive. \"Sensible/reasonable\" is 'raisonnable' in French.", es: "Falso amigo — 'sensible' significa sensible emocionalmente. \"Sensato/razonable\" es 'raisonnable' en francés." }, "B2"],
  ],
  gram: [
    ["___ maison est grande.", ["La", "Le", "Un", "Du"], 0,
      { en: "French nouns have grammatical gender — 'maison' (house) is feminine, so it takes 'la', not the masculine 'le'.", es: "Los sustantivos franceses tienen género gramatical — 'maison' (casa) es femenino, así que lleva 'la', no el masculino 'le'." }, "A2"],
    ["Les maisons sont ___.", ["grandes", "grande", "grands", "grand"], 0,
      { en: "Adjectives must agree in both number and gender — feminine plural 'maisons' needs 'grandes', with both the feminine -e and the plural -s.", es: "Los adjetivos deben concordar en número y género — el femenino plural 'maisons' necesita 'grandes', con la -e femenina y la -s plural." }, "A2"],
    ["Je ___ sais pas.", ["ne", "pas", "non", "n'"], 0,
      { en: "French negation is formally two-part: 'ne...pas' surrounds the verb. In casual spoken French the 'ne' is often dropped, but it's required in writing and formal speech.", es: "La negación francesa es formalmente de dos partes: 'ne...pas' rodea el verbo. En francés hablado casual el 'ne' se omite a menudo, pero es obligatorio por escrito y en el habla formal." }, "A2"],
    ["J'ai lu deux ___.", ["journaux", "journals", "journal", "journeaux"], 0,
      { en: "Nouns ending in -al usually become -aux in the plural (\"journal\" → \"journaux\") — an irregular pattern that trips up English speakers expecting a simple -s.", es: "Los sustantivos terminados en -al suelen volverse -aux en plural (\"journal\" → \"journaux\") — un patrón irregular que confunde a los angloparlantes que esperan una simple -s." }, "B1"],
    ["Je suis allé au marché.", ["✓ correct — être as auxiliary", "should use avoir", "wrong tense entirely", "missing preposition"], 0,
      { en: "Verbs of movement/state (like 'aller') use 'être' as the auxiliary in the past tense (passé composé), not 'avoir' like most other verbs.", es: "Los verbos de movimiento/estado (como 'aller') usan 'être' como auxiliar en el pretérito compuesto, no 'avoir' como la mayoría de los verbos." }, "B1"],
    ["Je me lave ___ mains.", ["les", "mes", "ma", "ses"], 0,
      { en: "With reflexive actions on body parts, French uses the definite article ('les mains'), not the possessive like English \"my hands\" — the reflexive pronoun already shows whose hands they are.", es: "Con acciones reflexivas sobre partes del cuerpo, el francés usa el artículo definido ('les mains'), no el posesivo como en inglés \"my hands\" — el pronombre reflexivo ya indica de quién son." }, "B1"],
    ["Je vis ___ Paris, ___ France.", ["à / en", "en / à", "à / à", "de / de"], 0,
      { en: "French uses 'à' for cities and 'en' for feminine countries ('vis à Paris' vs. 'vis en France') — a common trip-up for English speakers, who just use \"in\" for both.", es: "El francés usa 'à' para ciudades y 'en' para países femeninos ('vis à Paris' vs. 'vis en France') — un error común para hablantes de inglés, que usan \"in\" para ambos." }, "B1"],
    ["Il faut que tu ___ tes devoirs.", ["fasses", "fais", "faisais", "feras"], 0,
      { en: "\"Il faut que\" (\"it's necessary that\") triggers the subjunctive mood in the following clause — 'fasses', not the indicative 'fais'.", es: "\"Il faut que\" (\"es necesario que\") desencadena el modo subjuntivo en la cláusula siguiente — 'fasses', no el indicativo 'fais'." }, "B2"],
    ["Tu vas à Paris? Oui, j'___ vais.", ["y", "en", "le", "la"], 0,
      { en: "The pronoun 'y' replaces \"à + a place\" already mentioned — here, standing in for \"à Paris\" so you don't have to repeat it.", es: "El pronombre 'y' reemplaza \"à + un lugar\" ya mencionado — aquí, sustituye \"à Paris\" para no repetirlo." }, "B2"],
  ],
  trad: [
    ["Translate: 'That costs an arm and a leg!'", ["Ça coûte les yeux de la tête!", "Ça coûte un bras et une jambe!", "Ça coûte trop d'argent!", "Ça coûte une fortune totale!"], 0,
      { en: "French doesn't literally translate \"arm and leg\" — it says \"the eyes of the head\" instead, for the same meaning.", es: "El francés no traduce literalmente \"brazo y pierna\" — dice \"los ojos de la cabeza\" en su lugar, con el mismo significado." }, "B2"],
    ["Translate: 'I'm feeling really down today.'", ["J'ai le cafard aujourd'hui.", "J'ai l'insecte aujourd'hui.", "Je suis triste totalement.", "J'ai le blues complet."], 0,
      { en: "\"Avoir le cafard\" (literally \"to have the cockroach\") is the everyday idiom for feeling down or blue.", es: "\"Avoir le cafard\" (literalmente \"tener la cucaracha\") es el modismo cotidiano para sentirse triste o decaído." }, "B2"],
    ["Translate: 'He stood me up!'", ["Il m'a posé un lapin!", "Il m'a laissé seul!", "Il n'est pas venu du tout!", "Il m'a oublié complètement!"], 0,
      { en: "\"Poser un lapin à quelqu'un\" (literally \"to put a rabbit on someone\") is the standard French way to say someone stood you up.", es: "\"Poser un lapin à quelqu'un\" (literalmente \"poner un conejo a alguien\") es la forma estándar francesa de decir que alguien te dejó plantado." }, "B2"],
    ["Translate: 'Sounds good!' (casual agreement)", ["Ça marche!", "Ça fonctionne!", "Ça travaille!", "Ça va bien!"], 0,
      { en: "\"Ça marche\" (literally \"that walks/works\") is the everyday casual way to say \"sounds good\" or \"that works for me.\"", es: "\"Ça marche\" (literalmente \"eso camina/funciona\") es la forma cotidiana casual de decir \"suena bien\" o \"me funciona\"." }, "B1"],
    ["Translate: 'It's raining cats and dogs.'", ["Il pleut des cordes.", "Il pleut des chats et des chiens.", "Il pleut énormément fort.", "Il pleut de partout."], 0,
      { en: "French has its own version of this idiom — \"il pleut des cordes\" (literally \"it's raining ropes\"), not a literal translation of the English animals.", es: "El francés tiene su propia versión de este modismo — \"il pleut des cordes\" (literalmente \"llueven cuerdas\"), no una traducción literal de los animales en inglés." }, "B1"],
    ["Translate: 'I have a frog in my throat.'", ["J'ai un chat dans la gorge.", "J'ai une grenouille dans la gorge.", "J'ai la gorge sèche.", "Je ne peux pas parler."], 0,
      { en: "Where English says \"frog,\" French says \"cat\" — \"avoir un chat dans la gorge\" is the real French version of this exact idiom.", es: "Donde el inglés dice \"rana,\" el francés dice \"gato\" — \"avoir un chat dans la gorge\" es la versión francesa real de este mismo modismo." }, "B1"],
    ["Translate: 'She's totally daydreaming.'", ["Elle est dans la lune.", "Elle rêve dans les nuages.", "Elle pense à rien.", "Elle est très distraite."], 0,
      { en: "\"Être dans la lune\" (literally \"to be in the moon\") is the everyday idiom for daydreaming or being spaced out — English's \"head in the clouds\" lands in a different place, the moon.", es: "\"Être dans la lune\" (literalmente \"estar en la luna\") es el modismo cotidiano para estar distraído o soñando despierto — el inglés dice \"cabeza en las nubes,\" el francés va más lejos, hasta la luna." }, "B2"],
  ],
};

// French phonetics: liaison (a normally-silent final consonant is pronounced
// when the next word starts with a vowel), nasal vowels (no equivalent in
// English), and silent final letters. CAPS = stress (French stress is
// generally even, but falls a bit more heavily on the final syllable).
const FONO_BANK = [
  { text: "Nous avons deux enfants.", sound: "noo-za-VOHN duh-zahn-FAHN", difficulty: "B1",
    identify: { options: ["Nous avons deux enfants.", "Nous avons des enfants.", "Nous avions deux enfants.", "Vous avez deux enfants."], correctIdx: 0,
      explain: { en: "Liaison: the normally-silent 's' at the end of 'nous' and 'deux' gets pronounced as a 'z' sound because the next word starts with a vowel — 'nous_avons', 'deux_enfants'.", es: "Liaison: la 's' normalmente muda al final de 'nous' y 'deux' se pronuncia como sonido 'z' porque la siguiente palabra empieza con vocal — 'nous_avons', 'deux_enfants'." } },
    respond: { options: ["Ah, félicitations!", "Ça coûte cher.", "Je ne sais pas.", "C'est loin d'ici."], correctIdx: 0,
      explain: { en: "A statement about having children calls for a warm reaction, like \"oh, congratulations!\"", es: "Un comentario sobre tener hijos pide una reacción cálida, como \"¡ah, felicidades!\"" } } },
  { text: "C'est un grand arbre.", sound: "seh-tuhn grahn-TARbr", difficulty: "B1",
    identify: { options: ["C'est un grand arbre.", "C'est un grand arbre là-bas.", "C'est un petit arbre.", "C'est un grand arbuste."], correctIdx: 0,
      explain: { en: "Liaison again: 'grand' normally ends in a silent 'd', but before the vowel-starting 'arbre' it's pronounced as a 't' sound — 'grand_arbre'.", es: "Liaison otra vez: 'grand' normalmente termina en 'd' muda, pero antes de 'arbre' (que empieza con vocal) se pronuncia como sonido 't' — 'grand_arbre'." } },
    respond: { options: ["Oui, il est magnifique.", "Non, c'est trop petit.", "Ça coûte combien?", "Je ne le vois pas."], correctIdx: 0,
      explain: { en: "A comment about a big tree invites agreement/admiration, like \"yes, it's magnificent.\"", es: "Un comentario sobre un árbol grande invita a estar de acuerdo/admirar, como \"sí, es magnífico\"." } } },
  { text: "Le pain est bon.", sound: "luh PAN eh BOHN", difficulty: "A2",
    identify: { options: ["Le pain est bon.", "Le pain est blanc.", "Le vin est bon.", "Le pain est bien."], correctIdx: 0,
      explain: { en: "'Pain' (bread) has a nasal vowel sound with no real English equivalent — the 'n' isn't pronounced as a consonant, it nasalizes the vowel before it.", es: "'Pain' (pan) tiene un sonido vocálico nasal sin equivalente real en inglés — la 'n' no se pronuncia como consonante, nasaliza la vocal anterior." } },
    respond: { options: ["Oui, il est délicieux.", "Non, il coûte trop.", "Je n'aime pas ça.", "Il est fermé aujourd'hui."], correctIdx: 0,
      explain: { en: "A comment about bread being good calls for agreement, like \"yes, it's delicious.\"", es: "Un comentario sobre que el pan está bueno pide estar de acuerdo, como \"sí, está delicioso\"." } } },
  { text: "Il fait beaucoup de vent.", sound: "eel feh boh-KOO duh VAHN", difficulty: "B1",
    identify: { options: ["Il fait beaucoup de vent.", "Il fait beaucoup de temps.", "Il fait un peu de vent.", "Il fait beaucoup de bruit."], correctIdx: 0,
      explain: { en: "Both 'beaucoup' and 'vent' end in letters that are silent here (the 'p' in 'beaucoup', the 't' in 'vent') — French drops a lot of final consonants that English speakers instinctively want to pronounce.", es: "Tanto 'beaucoup' como 'vent' terminan en letras mudas aquí (la 'p' de 'beaucoup', la 't' de 'vent') — el francés omite muchas consonantes finales que los angloparlantes tienden a pronunciar por instinto." } },
    respond: { options: ["Oui, prends une veste.", "Non, il fait chaud.", "Ça sent bon.", "C'est très calme."], correctIdx: 0,
      explain: { en: "A comment about windy weather calls for practical advice, like \"yes, bring a jacket.\"", es: "Un comentario sobre el viento pide un consejo práctico, como \"sí, lleva una chaqueta\"." } } },
];

const frForEn = {
  id: "fr-for-en",
  label: "Français",
  sublabel: "For English speakers · French (France)",
  nativeLang: "en",
  targetLang: "fr",
  theme: "france-bleu",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Lisez la prononciation approximative. Que dit-elle?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — quelle réponse convient?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default frForEn;

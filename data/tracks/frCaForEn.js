// Track: French (Canada/Québécois), for an English speaker. Deliberately NOT
// a reskin of frForEn.js — meal names shift entirely (déjeuner/dîner/souper
// mean different meals in Quebec vs. France), several words are false
// friends WITHIN French itself (char, liqueur), and the grammar/phonetics
// include genuinely Quebec-specific features (the -tu question particle,
// "chu" contraction, t/d affrication) that don't exist in France French.
// Built at full depth from the start, matching itForEn.js/frForEn.js.

const CATS = {
  vocab: { label: "Vocabulaire", color: "#3DDBFF" },
  gram: { label: "Grammaire", color: "#FFB84D" },
  trad: { label: "Expressions", color: "#FF3D7F" },
  fono: { label: "Phonétique", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Magasiner' signifie...", ["to shop/go shopping", "to shop online", "to store away", "to organize"], 0,
      { en: "A distinctly Québécois verb for shopping — in France, people say \"faire du shopping\" or \"faire les courses\" instead.", es: "Un verbo típicamente quebequense para ir de compras — en Francia se dice \"faire du shopping\" o \"faire les courses\"." }, "A2"],
    ["'Char' signifie (au Québec)...", ["car", "tank (military)", "cart", "wagon"], 0,
      { en: "A false friend WITHIN French: in Quebec, 'char' casually means car. In France, 'char' means a military tank — French speakers from different regions can genuinely confuse each other with this one.", es: "Un falso amigo DENTRO del francés mismo: en Quebec, 'char' significa auto casualmente. En Francia, 'char' significa tanque militar — hablantes de francés de distintas regiones pueden confundirse genuinamente con esta palabra." }, "B1"],
    ["'Déjeuner' signifie (au Québec)...", ["breakfast", "lunch", "dinner", "a snack"], 0,
      { en: "The most famous Quebec/France difference: in Quebec, 'déjeuner' is breakfast. In France, 'déjeuner' is LUNCH (breakfast there is 'petit-déjeuner'). All three meal names shift by one between the two dialects.", es: "La diferencia más famosa entre Quebec y Francia: en Quebec, 'déjeuner' es el desayuno. En Francia, 'déjeuner' es el ALMUERZO (el desayuno allí es 'petit-déjeuner'). Los tres nombres de comidas se desplazan entre los dos dialectos." }, "B1"],
    ["'Dîner' signifie (au Québec)...", ["lunch", "breakfast", "a late-night snack", "dinner"], 0,
      { en: "Following the same shift: Quebec's 'dîner' is lunch, while in France 'dîner' means dinner (the evening meal).", es: "Siguiendo el mismo desplazamiento: 'dîner' en Quebec es el almuerzo, mientras que en Francia 'dîner' significa la cena." }, "B1"],
    ["'Souper' signifie (au Québec)...", ["dinner/supper", "breakfast", "lunch", "a midnight snack"], 0,
      { en: "Completing the shift: Quebec's main evening meal is 'souper'. In France, 'souper' exists but usually refers specifically to a late-night meal, not the standard dinner.", es: "Completando el desplazamiento: la comida principal de la noche en Quebec es 'souper'. En Francia, 'souper' existe pero suele referirse específicamente a una comida tardía de la noche, no a la cena estándar." }, "A2"],
    ["'Blonde/Chum' signifie...", ["girlfriend/boyfriend", "sister/brother", "coworker", "roommate"], 0,
      { en: "Everyday Québécois terms for girlfriend ('ma blonde')/boyfriend ('mon chum'). In France, people say 'copine/copain' or 'petite amie/petit ami' instead.", es: "Términos cotidianos quebequenses para novia ('ma blonde')/novio ('mon chum'). En Francia se dice 'copine/copain' o 'petite amie/petit ami'." }, "B1"],
    ["'Fin de semaine' signifie...", ["weekend", "end of the month", "vacation", "a long weekend specifically"], 0,
      { en: "Quebec French prefers this native term over France's borrowed English \"le week-end\" — part of Quebec's broader tendency to avoid English loanwords where France has adopted them.", es: "El francés quebequense prefiere este término nativo en vez del préstamo inglés de Francia \"le week-end\" — parte de la tendencia más amplia de Quebec a evitar préstamos del inglés donde Francia sí los adopta." }, "A2"],
    ["'Cellulaire' signifie...", ["cell phone", "cell (biology)", "basement", "phone booth"], 0,
      { en: "Quebec's everyday word for cell phone. France instead uses 'portable' for the same thing.", es: "La palabra cotidiana quebequense para celular. Francia en cambio usa 'portable' para lo mismo." }, "A2"],
    ["'Espadrilles' signifie...", ["sneakers/running shoes", "sandals", "boots", "slippers"], 0,
      { en: "Quebec's everyday word for sneakers. France instead uses 'baskets' for the same shoes.", es: "La palabra cotidiana quebequense para tenis/zapatillas deportivas. Francia en cambio usa 'baskets' para el mismo calzado." }, "A2"],
    ["'Liqueur' signifie (au Québec)...", ["soft drink/soda/pop", "alcoholic liqueur", "juice", "sparkling water"], 0,
      { en: "Another false friend within French: in Quebec, 'liqueur' casually means soda/pop. In France, 'liqueur' specifically means an alcoholic liqueur — asking for 'de la liqueur' means very different things depending on where you are.", es: "Otro falso amigo dentro del francés: en Quebec, 'liqueur' significa casualmente refresco. En Francia, 'liqueur' significa específicamente un licor alcohólico — pedir 'de la liqueur' significa algo muy distinto según dónde estés." }, "B2"],
    ["'Bienvenue' comme réponse à 'merci' signifie...", ["you're welcome", "welcome (greeting)", "come in", "no problem, literally"], 0,
      { en: "Influenced by English, Quebec French uses 'bienvenue' to mean \"you're welcome\" after being thanked. In France, 'bienvenue' ONLY means \"welcome\" (as a greeting) — \"you're welcome\" there is 'de rien' or 'je t'en prie'.", es: "Influenciado por el inglés, el francés de Quebec usa 'bienvenue' para decir \"de nada\" tras un agradecimiento. En Francia, 'bienvenue' SOLO significa \"bienvenido\" (como saludo) — \"de nada\" allí es 'de rien' o 'je t'en prie'." }, "B2"],
    ["'Achaler' signifie...", ["to bother/annoy", "to warm up", "to hurry", "to greet"], 0,
      { en: "A distinctly Québécois verb for bothering or pestering someone — not really used in France French.", es: "Un verbo típicamente quebequense para molestar o fastidiar a alguien — no muy usado en el francés de Francia." }, "B2"],
  ],
  gram: [
    ["___ maison est grande.", ["La", "Le", "Un", "Du"], 0,
      { en: "French nouns have grammatical gender regardless of dialect — 'maison' (house) is feminine, so it takes 'la'.", es: "Los sustantivos franceses tienen género gramatical sin importar el dialecto — 'maison' (casa) es femenino, así que lleva 'la'." }, "A2"],
    ["Chu fatigué.", ["✓ correct — casual contraction of 'Je suis'", "grammatically incorrect", "means something else entirely", "formal register"], 0,
      { en: "\"Chu\" is a very common casual Québécois contraction of \"Je suis\" — extremely frequent in everyday speech, though it wouldn't appear in formal writing.", es: "\"Chu\" es una contracción quebequense casual muy común de \"Je suis\" — extremadamente frecuente en el habla cotidiana, aunque no aparecería en la escritura formal." }, "B1"],
    ["Les maisons sont ___.", ["grandes", "grande", "grands", "grand"], 0,
      { en: "Adjectives agree in number and gender regardless of dialect — feminine plural 'maisons' needs 'grandes'.", es: "Los adjetivos concuerdan en número y género sin importar el dialecto — el femenino plural 'maisons' necesita 'grandes'." }, "A2"],
    ["T'as-tu fini tes devoirs?", ["✓ correct — Québécois \"-tu\" question particle", "grammatically incorrect", "means \"you, finish\"", "formal question form"], 0,
      { en: "Adding \"-tu\" after the verb is a genuinely distinctive Québécois way to form a casual yes/no question — it doesn't mean \"you\" here, it's just a question marker. Not used in France French at all.", es: "Añadir \"-tu\" después del verbo es una forma genuinamente distintiva quebequense de hacer una pregunta casual de sí/no — aquí no significa \"tú\", es solo un marcador de pregunta. No se usa en absoluto en el francés de Francia." }, "B2"],
    ["Je suis allé au marché.", ["✓ correct — être as auxiliary", "should use avoir", "wrong tense entirely", "missing preposition"], 0,
      { en: "Verbs of movement/state (like 'aller') use 'être' as the auxiliary in the passé composé, the same rule as in France French.", es: "Los verbos de movimiento/estado (como 'aller') usan 'être' como auxiliar en el pretérito compuesto, la misma regla que en el francés de Francia." }, "B1"],
    ["Où c'est que tu vas?", ["✓ correct — casual Québécois question structure", "grammatically incorrect", "overly formal", "means \"where is it\""], 0,
      { en: "Inserting \"c'est que\" into a question is a common casual Québécois pattern, alongside the more standard \"Où vas-tu?\" or \"Où est-ce que tu vas?\"", es: "Insertar \"c'est que\" en una pregunta es un patrón casual quebequense común, junto con el más estándar \"Où vas-tu?\" o \"Où est-ce que tu vas?\"" }, "B2"],
    ["Je ___ sais pas.", ["ne", "pas", "non", "n'"], 0,
      { en: "Formal negation is still 'ne...pas' in Quebec French too — though 'ne' gets dropped even more readily in casual Québécois speech than in France French.", es: "La negación formal sigue siendo 'ne...pas' también en el francés de Quebec — aunque 'ne' se omite todavía más fácilmente en el habla casual quebequense que en el francés de Francia." }, "A2"],
    ["C'est right bon, ça!", ["✓ correct — \"right\" as a Québécois intensifier", "grammatically incorrect", "means \"that's correct\"", "formal register"], 0,
      { en: "Quebec French has absorbed English \"right\" as a casual intensifier meaning \"really/very\" — a genuinely different anglicism pattern than France French, which absorbed different English words instead (like 'le week-end').", es: "El francés de Quebec ha absorbido el \"right\" del inglés como un intensificador casual que significa \"muy/realmente\" — un patrón de anglicismo genuinamente distinto al del francés de Francia, que absorbió otras palabras inglesas en su lugar (como 'le week-end')." }, "B2"],
    ["Il faut que tu ___ tes devoirs.", ["fasses", "fais", "faisais", "feras"], 0,
      { en: "\"Il faut que\" triggers the subjunctive mood regardless of dialect — 'fasses', not the indicative 'fais'.", es: "\"Il faut que\" desencadena el modo subjuntivo sin importar el dialecto — 'fasses', no el indicativo 'fais'." }, "B2"],
  ],
  trad: [
    ["Translate: 'I'm completely overwhelmed/swamped.'", ["J'ai de la broue dans le toupet.", "J'ai de la mousse dans les cheveux.", "Je suis très occupé aujourd'hui.", "J'ai trop de travail."], 0,
      { en: "Literally \"to have foam in one's forelock,\" like an overworked, sweaty horse — a colorful, distinctly Québécois idiom for being overwhelmed.", es: "Literalmente \"tener espuma en el flequillo,\" como un caballo agotado y sudoroso — un modismo colorido y típicamente quebequense para estar abrumado." }, "B2"],
    ["Translate: 'It's really cold out.'", ["Il fait frette.", "Il fait froid dehors.", "Il fait glacial.", "Il gèle fort."], 0,
      { en: "\"Frette\" is Quebec's colloquial, more emphatic variant of \"froid\" (cold) — you'll hear it constantly in Quebec winters, rarely in France.", es: "\"Frette\" es la variante coloquial y más enfática de \"froid\" (frío) en Quebec — se escucha constantemente en los inviernos quebequenses, raramente en Francia." }, "B1"],
    ["Translate: 'Not at all!'", ["Pantoute!", "Pas du tout!", "Absolument pas!", "Jamais!"], 0,
      { en: "\"Pantoute\" (from \"pas en tout\") is a distinctly Québécois way to say \"not at all\" — the standard \"pas du tout\" also works everywhere, but \"pantoute\" is the local flavor.", es: "\"Pantoute\" (de \"pas en tout\") es una forma típicamente quebequense de decir \"para nada\" — el estándar \"pas du tout\" también funciona en todas partes, pero \"pantoute\" es el sabor local." }, "B1"],
    ["Translate: 'That's too bad/that's a bummer.'", ["C'est plate.", "C'est plat.", "C'est dommage total.", "C'est ennuyant fort."], 0,
      { en: "Quebec uses \"plate\" (normally \"flat\") to mean boring or disappointing — a meaning France French doesn't share.", es: "Quebec usa \"plate\" (normalmente \"plano\") para decir aburrido o decepcionante — un significado que el francés de Francia no comparte." }, "B1"],
    ["Translate: 'I'm so fed up with this.'", ["Je suis tanné de ça.", "Je suis fatigué de ça.", "J'en ai marre complet.", "Je suis épuisé total."], 0,
      { en: "\"Tanné\" (literally related to tanning leather) is the everyday Québécois way to say \"fed up\" — a distinctly local usage.", es: "\"Tanné\" (literalmente relacionado con curtir cuero) es la forma cotidiana quebequense de decir \"harto\" — un uso típicamente local." }, "B2"],
    ["Translate: 'I'm really scared.'", ["J'ai la chienne.", "J'ai peur beaucoup.", "Je suis terrifié total.", "J'ai la trouille grande."], 0,
      { en: "\"Avoir la chienne\" (literally \"to have the female dog\") is a colorful Québécois idiom for being scared.", es: "\"Avoir la chienne\" (literalmente \"tener la perra\") es un modismo quebequense colorido para tener miedo." }, "B2"],
    ["Translate: 'That's totally fine.'", ["C'est ben correct.", "C'est bien correct total.", "Ça va parfaitement bien.", "C'est absolument parfait."], 0,
      { en: "\"Ben\" is Quebec's casual contraction of \"bien,\" used constantly in everyday speech — \"c'est ben correct\" is a very typical, relaxed way to say something's fine.", es: "\"Ben\" es la contracción casual quebequense de \"bien,\" usada constantemente en el habla cotidiana — \"c'est ben correct\" es una forma muy típica y relajada de decir que algo está bien." }, "B1"],
  ],
};

// Québécois phonetics: t/d affricate (become "ts"/"dz" sounds) before the
// high front vowels i/u — "tu" sounds like "tsu", not the Parisian "tu".
// Vowels are also more diphthongized (gliding) in stressed syllables, and
// "ben" (bien) and "frette" (froid) show up constantly in casual speech.
const FONO_BANK = [
  { text: "T'es-tu prêt?", sound: "tseh-tsu preh?", difficulty: "B2",
    identify: { options: ["T'es-tu prêt?", "Tu es prêt?", "T'es-tu prête?", "Es-tu prêt?"], correctIdx: 0,
      explain: { en: "Notice the 'ts' sound where Parisian French would have a plain 't' before 'u' — this affrication is one of the most recognizable features of Québécois pronunciation.", es: "Nota el sonido 'ts' donde el francés parisino tendría una 't' simple antes de 'u' — esta africación es uno de los rasgos más reconocibles de la pronunciación quebequense." } },
    respond: { options: ["Oui, chu prêt!", "Non, je fatigue.", "Ça coûte cher.", "Il fait beau."], correctIdx: 0,
      explain: { en: "A casual question calls for an equally casual answer — \"chu prêt\" (I'm ready) using the same contraction pattern as the question.", es: "Una pregunta casual pide una respuesta igualmente casual — \"chu prêt\" (estoy listo) usando el mismo patrón de contracción que la pregunta." } } },
  { text: "Il fait frette dehors.", sound: "eel feh FRET duh-OR", difficulty: "B1",
    identify: { options: ["Il fait frette dehors.", "Il fait froid dedans.", "Il fait beau dehors.", "Il fait frais dehors."], correctIdx: 0,
      explain: { en: "\"Frette\" gets a distinctly Québécois vowel quality — more open and emphatic than the Parisian \"froid\" it's related to.", es: "\"Frette\" tiene una calidad vocálica típicamente quebequense — más abierta y enfática que el \"froid\" parisino con el que se relaciona." } },
    respond: { options: ["Ouin, mets ta tuque!", "Non, il fait chaud.", "Ça sent bon dehors.", "C'est bien tranquille."], correctIdx: 0,
      explain: { en: "A comment about cold weather calls for practical Québécois advice — \"mets ta tuque\" (put on your winter hat), using another distinctly local word (tuque).", es: "Un comentario sobre el frío pide un consejo práctico quebequense — \"mets ta tuque\" (ponte tu gorro de invierno), usando otra palabra típicamente local (tuque)." } } },
  { text: "Je vais chercher mon char.", sound: "juh veh chair-SHAY mohn SHAR", difficulty: "B1",
    identify: { options: ["Je vais chercher mon char.", "Je vais chercher mon chat.", "Je vais chercher ma charge.", "Je vais chercher mon chandail."], correctIdx: 0,
      explain: { en: "\"Char\" (car) and \"chat\" (cat) sound close enough that context matters — in Quebec, going to \"chercher son char\" means getting your car, not your cat.", es: "\"Char\" (auto) y \"chat\" (gato) suenan lo bastante parecido como para que el contexto importe — en Quebec, ir a \"chercher son char\" significa buscar el auto, no el gato." } },
    respond: { options: ["Ok, on se voit là-bas!", "Il est où, ton chat?", "Ça coûte cher, ça.", "Je ne savais pas."], correctIdx: 0,
      explain: { en: "A statement about getting the car calls for a practical logistics response, like \"okay, see you there!\"", es: "Un comentario sobre ir a buscar el auto pide una respuesta práctica de logística, como \"¡ok, nos vemos allá!\"" } } },
  { text: "C'est ben correct, prends ton temps.", sound: "seh ben coh-REKT, pran tohn TAHN", difficulty: "B1",
    identify: { options: ["C'est ben correct, prends ton temps.", "C'est bien vrai, prends ton temps.", "C'est ben pire, prends ton temps.", "C'est ben correct, perds pas ton temps."], correctIdx: 0,
      explain: { en: "\"Ben\" (from \"bien\") shows up constantly in casual Québécois speech — much more frequently than its Parisian equivalent appears in everyday France French.", es: "\"Ben\" (de \"bien\") aparece constantemente en el habla quebequense casual — con mucha más frecuencia que su equivalente parisino en el francés cotidiano de Francia." } },
    respond: { options: ["Merci, t'es fin!", "Non, dépêche-toi!", "Ça me dérange pas.", "J'ai pas le temps."], correctIdx: 0,
      explain: { en: "Being told to take your time calls for a warm thank-you — \"t'es fin\" (you're kind/nice) is a common, friendly Québécois compliment.", es: "Que te digan que te tomes tu tiempo pide un agradecimiento cálido — \"t'es fin\" (eres amable) es un cumplido quebequense común y amistoso." } } },
];

const frCaForEn = {
  id: "fr-ca-for-en",
  label: "Français (Québec)",
  nameEn: "French (Canada)",
  nameEs: "Francés (Canadá)",
  sublabel: "For English speakers · Canadian French",
  nativeLang: "en",
  targetLang: "fr",
  theme: "canada-maple",
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

export default frCaForEn;

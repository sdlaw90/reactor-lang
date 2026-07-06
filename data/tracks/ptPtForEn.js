// Track: Portuguese (Portugal), for an English speaker. Deliberately NOT a
// reskin of ptBrForEn.js — vocabulary for everyday things differs almost
// entirely (autocarro/comboio/telemóvel vs. Brazil's ônibus/trem/celular),
// the infinitive construction ("estar a + infinitive") replaces Brazil's
// gerund preference, "tu" replaces "você" as the default informal address,
// and the phonetics are strikingly different — European Portuguese reduces
// unstressed vowels heavily and turns syllable-final 's' into a "sh" sound.

const CATS = {
  vocab: { label: "Vocabulário", color: "#3DDBFF" },
  gram: { label: "Gramática", color: "#FFB84D" },
  trad: { label: "Expressões", color: "#FF3D7F" },
  fono: { label: "Fonética", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Autocarro' significa...", ["bus", "car", "train", "truck"], 0,
      { en: "Portugal's everyday word for bus. Brazilian Portuguese instead uses 'ônibus' for the same vehicle.", es: "La palabra cotidiana portuguesa para autobús. El portugués brasileño usa en cambio 'ônibus' para el mismo vehículo." }, "A2"],
    ["'Comboio' significa...", ["train", "convoy only", "subway", "tram"], 0,
      { en: "Portugal's word for train. Brazilian Portuguese instead uses 'trem'.", es: "La palabra portuguesa para tren. El portugués brasileño usa en cambio 'trem'." }, "A2"],
    ["'Casa de banho' significa...", ["bathroom", "guest house", "bedroom", "laundry room"], 0,
      { en: "Portugal's phrase for bathroom (literally \"bath house\"). Brazilian Portuguese instead uses the single word 'banheiro'.", es: "La frase portuguesa para baño (literalmente \"casa de baño\"). El portugués brasileño usa en cambio la palabra 'banheiro'." }, "A2"],
    ["'Telemóvel' significa...", ["cell phone", "TV remote", "landline", "walkie-talkie"], 0,
      { en: "Portugal's word for cell phone. Brazilian Portuguese instead uses 'celular'.", es: "La palabra portuguesa para celular. El portugués brasileño usa en cambio 'celular'." }, "A2"],
    ["'Gelado' significa...", ["ice cream", "frozen/cold (adjective only)", "slush drink", "popsicle only"], 0,
      { en: "Portugal's everyday word for ice cream. Brazilian Portuguese instead uses 'sorvete'.", es: "La palabra cotidiana portuguesa para helado. El portugués brasileño usa en cambio 'sorvete'." }, "A1"],
    ["'Pequeno-almoço' significa...", ["breakfast", "small lunch", "afternoon snack", "brunch"], 0,
      { en: "Portugal's phrase for breakfast (literally \"little lunch\"). Brazilian Portuguese instead says 'café da manhã' (\"morning coffee\").", es: "La frase portuguesa para desayuno (literalmente \"pequeño almuerzo\"). El portugués brasileño dice en cambio 'café da manhã' (\"café de la mañana\")." }, "A2"],
    ["'Frigorífico' significa...", ["refrigerator", "freezer only", "cooler for a picnic", "ice machine"], 0,
      { en: "Portugal's everyday word for the fridge. Brazilian Portuguese instead uses 'geladeira'.", es: "La palabra cotidiana portuguesa para el refrigerador. El portugués brasileño usa en cambio 'geladeira'." }, "B1"],
    ["'Chávena' significa...", ["cup (for coffee/tea)", "plate", "kettle", "saucer only"], 0,
      { en: "Portugal's word for a cup. Brazilian Portuguese instead uses 'xícara'.", es: "La palabra portuguesa para taza. El portugués brasileño usa en cambio 'xícara'." }, "B1"],
    ["'Equipa' significa...", ["team", "equipment", "staff room", "uniform"], 0,
      { en: "Portugal's word for a sports/work team. Brazilian Portuguese instead uses 'time' (borrowed from English \"team\").", es: "La palabra portuguesa para un equipo deportivo/de trabajo. El portugués brasileño usa en cambio 'time' (prestado del inglés \"team\")." }, "B2"],
    ["'Fixe' (informalmente) significa...", ["cool/great", "fixed/repaired", "formal", "expensive"], 0,
      { en: "Portugal's everyday informal word for \"cool\" or \"great.\" Brazilian Portuguese instead uses 'legal' for the same casual meaning.", es: "La palabra informal cotidiana portuguesa para \"genial\" o \"increíble.\" El portugués brasileño usa en cambio 'legal' para el mismo significado casual." }, "B1"],
    ["'Miúdo/Miúda' significa...", ["kid/child (informal)", "small amount", "adult", "elderly person"], 0,
      { en: "Portugal's everyday informal word for a kid. Brazilian Portuguese more commonly uses 'criança' or, informally, 'moleque'.", es: "La palabra informal cotidiana portuguesa para un niño/a. El portugués brasileño usa más comúnmente 'criança' o, informalmente, 'moleque'." }, "B2"],
    ["'Sandes' significa...", ["sandwich", "sand (plural)", "snack tray", "toast"], 0,
      { en: "Portugal's word for sandwich. Brazilian Portuguese instead uses 'sanduíche'.", es: "La palabra portuguesa para sándwich. El portugués brasileño usa en cambio 'sanduíche'." }, "A2"],
  ],
  gram: [
    ["___ casa é grande.", ["A", "O", "Um", "Do"], 0,
      { en: "Portuguese nouns have grammatical gender regardless of dialect — 'casa' (house) is feminine, so it takes 'a'.", es: "Los sustantivos portugueses tienen género gramatical sin importar el dialecto — 'casa' es femenino, así que lleva 'a'." }, "A2"],
    ["Estou ___ um e-mail agora.", ["a escrever", "escrevendo", "escrever", "escrito"], 0,
      { en: "European Portuguese strongly prefers the infinitive construction for ongoing actions ('estou a escrever'). Brazilian Portuguese instead typically uses the gerund ('estou escrevendo') — a major, well-known split between the two variants.", es: "El portugués europeo prefiere fuertemente la construcción de infinitivo para acciones en curso ('estou a escrever'). El portugués brasileño típicamente usa en cambio el gerundio ('estou escrevendo') — una división gramatical importante entre las dos variantes." }, "B1"],
    ["___ vais à festa hoje?", ["Tu", "Você", "Vós", "Ele"], 0,
      { en: "European Portuguese uses 'tu' (with distinct second-person verb forms) as the default informal \"you.\" Brazilian Portuguese predominantly uses 'você' with third-person forms instead — another major split.", es: "El portugués europeo usa 'tu' (con formas verbales distintas de segunda persona) como el \"tú\" informal predeterminado. El portugués brasileño usa predominantemente 'você' con formas de tercera persona en su lugar — otra división importante." }, "B1"],
    ["Eu ___.", ["amo-te", "te amo", "-te amo", "amo te-"], 0,
      { en: "European Portuguese places the object pronoun AFTER the verb with a hyphen ('amo-te'). Brazilian Portuguese more often places it before ('eu te amo') — a real syntactic difference between the two variants.", es: "El portugués europeo coloca el pronombre de objeto DESPUÉS del verbo con un guion ('amo-te'). El portugués brasileño lo coloca más a menudo antes ('eu te amo') — una diferencia sintáctica real entre las dos variantes." }, "B2"],
    ["Eu comprei dois ___.", ["pães", "pãos", "pães", "paos"], 0,
      { en: "Nouns ending in -ão have irregular, unpredictable plurals regardless of dialect — 'pão' (bread) becomes 'pães'.", es: "Los sustantivos terminados en -ão tienen plurales irregulares e impredecibles sin importar el dialecto — 'pão' (pan) se vuelve 'pães'." }, "B1"],
    ["Eu ___ cansado hoje.", ["estou", "sou", "está", "é"], 0,
      { en: "Portuguese has two \"to be\" verbs regardless of dialect — 'estar' for temporary states, 'ser' for permanent characteristics. Being tired today is temporary, so 'estou'.", es: "El portugués tiene dos verbos \"ser/estar\" sin importar el dialecto — 'estar' para estados temporales, 'ser' para características permanentes. Estar cansado hoy es temporal, así que 'estou'." }, "B1"],
    ["Vou ___ escola agora.", ["à", "a o", "em a", "para"], 0,
      { en: "The preposition 'a' contracts with the feminine article 'a' to form 'à' — a required contraction regardless of dialect.", es: "La preposición 'a' se contrae con el artículo femenino 'a' para formar 'à' — una contracción obligatoria sin importar el dialecto." }, "B1"],
    ["Espero que tu ___ bem.", ["estejas", "estás", "estar", "estavas"], 0,
      { en: "\"Espero que\" triggers the subjunctive regardless of dialect — but note the 'tu' form 'estejas', different from Brazilian Portuguese's 'você'-based 'esteja'.", es: "\"Espero que\" desencadena el subjuntivo sin importar el dialecto — pero nota la forma 'tu' 'estejas', distinta de la forma basada en 'você' del portugués brasileño 'esteja'." }, "B2"],
    ["Não tenho a certeza ___ isso.", ["sobre", "de", "com", "em"], 0,
      { en: "\"Não ter a certeza sobre algo\" (to not be sure about something) is the standard European Portuguese phrasing — a common everyday construction.", es: "\"Não ter a certeza sobre algo\" (no estar seguro de algo) es la construcción estándar cotidiana del portugués europeo." }, "B1"],
  ],
  trad: [
    ["Translate: 'She's full of energy today.'", ["Ela está com a corda toda.", "Ela está muito energética.", "Ela está bastante ativa.", "Ela está com muita força."], 0,
      { en: "\"Estar com a corda toda\" (literally \"to have all the rope,\" like a fully wound-up toy) is a very Portuguese idiom for being full of energy.", es: "\"Estar com a corda toda\" (literalmente \"tener toda la cuerda,\" como un juguete completamente cargado) es un modismo muy portugués para estar lleno de energía." }, "B2"],
    ["Translate: 'That's a piece of cake.'", ["Isso é canja.", "Isso é bolo.", "Isso é fácil total.", "Isso é simples muito."], 0,
      { en: "\"Isso é canja\" (literally \"that's chicken soup\") is the standard European Portuguese way to say something is easy — a completely different image than Brazilian Portuguese's \"moleza.\"", es: "\"Isso é canja\" (literalmente \"eso es sopa de pollo\") es la forma estándar europea de decir que algo es fácil — una imagen completamente distinta a la \"moleza\" del portugués brasileño." }, "B1"],
    ["Translate: 'I'm completely broke.'", ["Estou nas lonas.", "Estou sem dinheiro nenhum.", "Estou muito pobre agora.", "Não tenho fundos."], 0,
      { en: "\"Estar nas lonas\" (literally \"to be on the tarps/canvases\") is a distinctly Portuguese idiom for being broke.", es: "\"Estar nas lonas\" (literalmente \"estar en las lonas\") es un modismo típicamente portugués para estar sin dinero." }, "B2"],
    ["Translate: 'Let's hit the road.'", ["Vamos fazer-nos ao caminho.", "Vamos começar a viagem.", "Vamos sair agora mesmo.", "Vamos partir depressa."], 0,
      { en: "\"Fazer-se ao caminho\" (literally \"to make oneself to the road\") is the everyday Portuguese way to say you're setting off on a journey.", es: "\"Fazer-se ao caminho\" (literalmente \"hacerse al camino\") es la forma cotidiana portuguesa de decir que emprendes un viaje." }, "B1"],
    ["Translate: 'He's a bit crazy/eccentric.'", ["Ele tem macaquinhos no sótão.", "Ele é um pouco louco.", "Ele é muito estranho.", "Ele age de forma esquisita."], 0,
      { en: "\"Ter macaquinhos no sótão\" (literally \"to have little monkeys in the attic\") is a playful Portuguese idiom for being a bit eccentric or crazy.", es: "\"Ter macaquinhos no sótão\" (literalmente \"tener monitos en el desván\") es un modismo portugués juguetón para ser un poco excéntrico o loco." }, "B2"],
    ["Translate: 'He really messed that up.'", ["Ele meteu os pés pelas mãos.", "Ele estragou tudo completo.", "Ele fez tudo errado.", "Ele confundiu tudo total."], 0,
      { en: "\"Meter os pés pelas mãos\" (literally \"to put the feet through the hands\") is a vivid Portuguese idiom for fumbling or messing something up badly.", es: "\"Meter os pés pelas mãos\" (literalmente \"meter los pies por las manos\") es un modismo portugués vívido para arruinar algo por completo." }, "B2"],
    ["Translate: 'She speaks her mind bluntly.'", ["Ela não tem papas na língua.", "Ela fala muito diretamente.", "Ela é muito honesta.", "Ela diz tudo o que pensa."], 0,
      { en: "\"Não ter papas na língua\" (literally \"to not have porridge on the tongue\") is the standard Portuguese idiom for speaking bluntly, without softening things.", es: "\"Não ter papas na língua\" (literalmente \"no tener papilla en la lengua\") es el modismo portugués estándar para hablar sin rodeos." }, "B1"],
  ],
};

// European Portuguese phonetics: unstressed vowels reduce heavily (much more
// than in Brazilian Portuguese), and syllable-final 's' sounds like English
// "sh" rather than a clear "s" — "gostas" sounds like "GOSH-tush". CAPS =
// stress.
const FONO_BANK = [
  { text: "Gostas de café?", sound: "GOSH-tush duh kuh-FEH?", difficulty: "B1",
    identify: { options: ["Gostas de café?", "Gostas de chá?", "Gosta de café?", "Gostas do café?"], correctIdx: 0,
      explain: { en: "Notice 'gostas' sounds like \"GOSH-tush\" — European Portuguese turns syllable-final 's' into an English-style \"sh\" sound, unlike Brazilian Portuguese's clearer 's'.", es: "Nota que 'gostas' suena como \"GOSH-tush\" — el portugués europeo convierte la 's' final de sílaba en un sonido tipo \"sh\" del inglés, a diferencia del 's' más claro del portugués brasileño." } },
    respond: { options: ["Gosto, sim, bastante!", "Não sei onde fica.", "Custa muito caro.", "É muito longe."], correctIdx: 0,
      explain: { en: "A question about liking coffee calls for a direct answer, like \"yes, quite a lot!\"", es: "Una pregunta sobre si te gusta el café pide una respuesta directa, como \"¡sí, bastante!\"" } } },
  { text: "Está muito frio hoje.", sound: "shTAH mween-too FREE-oo OZH", difficulty: "B1",
    identify: { options: ["Está muito frio hoje.", "Está muito calor hoje.", "Esteve frio ontem.", "Está um pouco frio hoje."], correctIdx: 0,
      explain: { en: "European Portuguese reduces unstressed vowels so heavily that 'está' can sound almost like just \"shtah\" — a real challenge for English speakers expecting every vowel to be clearly pronounced.", es: "El portugués europeo reduce tanto las vocales átonas que 'está' puede sonar casi como solo \"shtah\" — un verdadero reto para angloparlantes que esperan que cada vocal se pronuncie con claridad." } },
    respond: { options: ["Sim, vou vestir um casaco.", "Não, está calor.", "Vou à praia então.", "Está muito bonito lá fora."], correctIdx: 0,
      explain: { en: "A comment about cold weather calls for practical advice, like \"yes, I'm going to put on a coat.\"", es: "Un comentario sobre el frío pide un consejo práctico, como \"sí, voy a ponerme un abrigo\"." } } },
  { text: "Isto é fixe.", sound: "EESH-too eh FEE-shuh", difficulty: "B2",
    identify: { options: ["Isto é fixe.", "Isto é grande.", "Isso é fixe.", "Isto é fixo."], correctIdx: 0,
      explain: { en: "'Isto' shows the same s-to-\"sh\" pattern ('EESH-too'), and 'fixe' (cool) is pronounced \"FEE-shuh\" — a word Brazilian Portuguese doesn't use this way at all.", es: "'Isto' muestra el mismo patrón de s a \"sh\" ('EESH-too'), y 'fixe' (genial) se pronuncia \"FEE-shuh\" — una palabra que el portugués brasileño no usa así en absoluto." } },
    respond: { options: ["Concordo, adorei!", "Não gostei nada.", "Custa quanto isso?", "Onde compraste isso?"], correctIdx: 0,
      explain: { en: "Agreeing that something's cool calls for an enthusiastic response, like \"I agree, loved it!\"", es: "Estar de acuerdo en que algo es genial pide una respuesta entusiasta, como \"¡concuerdo, me encantó!\"" } } },
  { text: "Boa tarde a todos.", sound: "BOH-uh TARD uh TOH-doosh", difficulty: "A2",
    identify: { options: ["Boa tarde a todos.", "Bom dia a todos.", "Boa noite a todos.", "Boa tarde a todas."], correctIdx: 0,
      explain: { en: "'Todos' ends with the same final-s-to-\"sh\" pattern, sounding like \"TOH-doosh\" rather than a clear final 's'.", es: "'Todos' termina con el mismo patrón de s final a \"sh\", sonando como \"TOH-doosh\" en vez de una 's' final clara." } },
    respond: { options: ["Boa tarde! Como estás?", "Obrigado, até logo.", "Está muito calor.", "Vemo-nos amanhã."], correctIdx: 0,
      explain: { en: "A greeting to a group calls for a friendly reply back, like \"good afternoon! How are you?\"", es: "Un saludo a un grupo pide una respuesta amistosa de vuelta, como \"¡buenas tardes! ¿Cómo estás?\"" } } },
];

const ptPtForEn = {
  id: "pt-pt-for-en",
  label: "Português (Portugal)",
  nameEn: "Portuguese (Portugal)",
  nameEs: "Portugués (Portugal)",
  sublabel: "For English speakers · European Portuguese",
  nativeLang: "en",
  targetLang: "pt",
  theme: "portugal-verde",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Leia a pronúncia aproximada. O que ela diz?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — qual resposta é apropriada?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default ptPtForEn;

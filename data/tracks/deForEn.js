// Track: German, for an English speaker. Full depth (36 items). Categories:
// vocab (basics + classic false friends), gram (three-gender articles, the
// case system, verb-second word order, separable verbs, modal-verb clause
// structure, subordinate-clause verb-final order — genuinely the biggest
// structural leap of any track so far for an English speaker), trad
// (idioms), and fono (umlauts, ich-laut/ach-laut, final devoicing).

const CATS = {
  vocab: { label: "Vokabular", color: "#3DDBFF" },
  gram: { label: "Grammatik", color: "#FFB84D" },
  trad: { label: "Redewendungen", color: "#FF3D7F" },
  fono: { label: "Phonetik", color: "#B98EFF" },
};

const BANK = {
  vocab: [
    ["'Hallo' bedeutet...", ["hello", "goodbye", "please", "sorry"], 0,
      { en: "'Hallo' is the standard everyday greeting.", es: "'Hallo' es el saludo cotidiano estándar." }, "A1"],
    ["'Danke' bedeutet...", ["thank you", "please", "you're welcome", "sorry"], 0,
      { en: "'Danke' is thank you — one of the most essential words to know.", es: "'Danke' significa gracias — una de las palabras más esenciales." }, "A1"],
    ["'Freund/Freundin' bedeutet...", ["friend", "enemy", "neighbor", "coworker"], 0,
      { en: "'Freund' (masculine)/'Freundin' (feminine) means friend — context or a possessive usually clarifies whether it means \"friend\" or \"boyfriend/girlfriend.\"", es: "'Freund' (masculino)/'Freundin' (femenino) significa amigo/a — el contexto o un posesivo suele aclarar si significa \"amigo\" o \"novio/a\"." }, "A1"],
    ["'Fenster' bedeutet...", ["window", "door", "wall", "floor"], 0,
      { en: "'Fenster' means window — a common everyday noun.", es: "'Fenster' significa ventana — un sustantivo cotidiano común." }, "A2"],
    ["'Familie' bedeutet...", ["family", "friend group", "neighborhood", "team"], 0,
      { en: "'Familie' means family, pronounced close to how it looks.", es: "'Familie' significa familia, se pronuncia cerca de cómo se escribe." }, "A2"],
    ["'Arbeit' bedeutet...", ["work/job", "worker", "factory", "schedule"], 0,
      { en: "'Arbeit' means work or job (the noun); 'arbeiten' is the verb \"to work.\"", es: "'Arbeit' significa trabajo (el sustantivo); 'arbeiten' es el verbo \"trabajar\"." }, "A2"],
    ["'Gift' bedeutet...", ["poison", "a present/gift", "talent", "medicine"], 0,
      { en: "Famous false friend: 'Gift' means poison in German. A present/gift is 'Geschenk'.", es: "Falso amigo famoso: 'Gift' significa veneno en alemán. Un regalo es 'Geschenk'." }, "B1"],
    ["'Rat' bedeutet...", ["advice", "a rat (animal)", "rate/speed", "opinion"], 0,
      { en: "False friend — 'Rat' means advice. The animal is 'Ratte'.", es: "Falso amigo — 'Rat' significa consejo. El animal es 'Ratte'." }, "B1"],
    ["'Handy' bedeutet...", ["cell phone", "handy/useful", "handshake", "handle"], 0,
      { en: "False friend — 'Handy' is the everyday German word for cell phone (not used this way in English at all). \"Handy/useful\" is 'praktisch' in German.", es: "Falso amigo — 'Handy' es la palabra alemana cotidiana para celular (no se usa así en inglés en absoluto). \"Práctico/útil\" es 'praktisch' en alemán." }, "B1"],
    ["'Chef' bedeutet...", ["boss", "chef/cook", "leader (informal)", "expert"], 0,
      { en: "False friend — 'Chef' means boss/manager in German. A cook/chef is 'Koch'.", es: "Falso amigo — 'Chef' significa jefe en alemán. Un cocinero/chef es 'Koch'." }, "B2"],
    ["'Also' bedeutet...", ["so/therefore", "also/too", "already", "always"], 0,
      { en: "False friend — 'also' means \"so/therefore\" in German, not \"also/too\" (which is 'auch').", es: "Falso amigo — 'also' significa \"entonces/por lo tanto\" en alemán, no \"también\" (que es 'auch')." }, "B2"],
    ["'Aktuell' bedeutet...", ["current/up-to-date", "actually/in fact", "eventually", "urgent"], 0,
      { en: "False friend — 'aktuell' means current or up-to-date, not \"actually\" (which is 'eigentlich').", es: "Falso amigo — 'aktuell' significa actual/al día, no \"actually\" (que es 'eigentlich')." }, "B2"],
  ],
  gram: [
    ["___ Mann ist hier.", ["Der", "Die", "Das", "Den"], 0,
      { en: "German has three grammatical genders — 'Mann' (man) is masculine, taking 'der' in the nominative case.", es: "El alemán tiene tres géneros gramaticales — 'Mann' (hombre) es masculino, lleva 'der' en caso nominativo." }, "A2"],
    ["Ich sehe ___ Mann.", ["den", "der", "dem", "des"], 0,
      { en: "This is German's case system in action: as the direct object (accusative case), masculine 'der' changes to 'den' — a change English doesn't make to its articles at all.", es: "Esto es el sistema de casos del alemán en acción: como objeto directo (caso acusativo), el masculino 'der' cambia a 'den' — un cambio que el inglés no hace en absoluto a sus artículos." }, "B1"],
    ["Ich gebe ___ Mann das Buch.", ["dem", "den", "der", "des"], 0,
      { en: "The indirect object (dative case) changes masculine 'der' to 'dem' — yet another case form for the same underlying word.", es: "El objeto indirecto (caso dativo) cambia el masculino 'der' a 'dem' — otra forma más de caso para la misma palabra subyacente." }, "B1"],
    ["Heute gehe ich ins Kino.", ["✓ correct — verb in second position", "incorrect word order", "wrong verb", "missing preposition"], 0,
      { en: "German main clauses require the verb in the second position, no matter what comes first. Since 'heute' (today) took the first slot, the verb 'gehe' must come next, before the subject 'ich'.", es: "Las oraciones principales alemanas requieren el verbo en segunda posición, sin importar qué vaya primero. Como 'heute' (hoy) ocupó el primer lugar, el verbo 'gehe' debe ir después, antes del sujeto 'ich'." }, "B1"],
    ["Ich stehe um sechs Uhr ___.", ["auf", "aufstehen", "stehe", "ab"], 0,
      { en: "'Aufstehen' (to get up) is a separable verb — the prefix 'auf' splits off and moves to the end of the clause, a structure with no real English equivalent.", es: "'Aufstehen' (levantarse) es un verbo separable — el prefijo 'auf' se separa y se mueve al final de la cláusula, una estructura sin equivalente real en inglés." }, "B2"],
    ["Ich kann gut Deutsch ___.", ["sprechen", "spreche", "gesprochen", "sprach"], 0,
      { en: "With modal verbs like 'kann' (can), the main verb goes to the end of the clause in its infinitive form — 'sprechen', not a conjugated form.", es: "Con verbos modales como 'kann' (poder), el verbo principal va al final de la cláusula en su forma infinitiva — 'sprechen', no una forma conjugada." }, "B1"],
    ["'Handschuh' bedeutet wörtlich \"hand shoe\", aber wirklich...", ["glove", "sock", "sandal", "sleeve"], 0,
      { en: "German loves productive compounding — 'Handschuh' (literally \"hand shoe\") actually means glove, a great example of how German builds new words by stacking existing ones.", es: "Al alemán le encanta la composición productiva — 'Handschuh' (literalmente \"zapato de mano\") en realidad significa guante, un gran ejemplo de cómo el alemán forma palabras nuevas apilando otras existentes." }, "B2"],
    ["Das ist ein gut___ Buch.", ["es", "er", "e", "en"], 0,
      { en: "Adjective endings shift based on gender, case, and whether an article is present — neuter 'Buch' after 'ein' takes the ending '-es' here.", es: "Las terminaciones de los adjetivos cambian según el género, el caso y si hay un artículo presente — el neutro 'Buch' después de 'ein' lleva la terminación '-es' aquí." }, "B2"],
    ["Ich weiß, dass er heute ___.", ["kommt", "er kommt", "kommt er", "kommen"], 0,
      { en: "In subordinate clauses introduced by words like 'dass' (that), the conjugated verb moves all the way to the end of the clause — a structure that takes real practice for English speakers.", es: "En las cláusulas subordinadas introducidas por palabras como 'dass' (que), el verbo conjugado se mueve hasta el final de la cláusula — una estructura que requiere práctica real para los angloparlantes." }, "B2"],
  ],
  trad: [
    ["Translate: 'I'll keep my fingers crossed for you.'", ["Ich drücke dir die Daumen.", "Ich kreuze meine Finger.", "Ich halte die Daumen fest.", "Ich wünsche dir Glück sehr."], 0,
      { en: "\"Die Daumen drücken\" (literally \"to press the thumbs\") is the German equivalent of crossing your fingers for luck.", es: "\"Die Daumen drücken\" (literalmente \"presionar los pulgares\") es el equivalente alemán de cruzar los dedos por suerte." }, "B1"],
    ["Translate: 'I don't understand a word of this.'", ["Ich verstehe nur Bahnhof.", "Ich verstehe gar nichts.", "Ich kapiere nichts total.", "Das ergibt keinen Sinn."], 0,
      { en: "\"Ich verstehe nur Bahnhof\" (literally \"I only understand train station\") is a colorful, very common way to say you don't understand anything at all.", es: "\"Ich verstehe nur Bahnhof\" (literalmente \"solo entiendo estación de tren\") es una forma colorida y muy común de decir que no entiendes absolutamente nada." }, "B2"],
    ["Translate: 'I don't care at all.'", ["Das ist mir Wurst.", "Das ist mir egal.", "Das kümmert mich nicht.", "Das interessiert mich nicht."], 0,
      { en: "\"Das ist mir Wurst\" (literally \"that is sausage to me\") is a very casual, colorful way to say you don't care — 'Das ist mir egal' is the more neutral standard phrase.", es: "\"Das ist mir Wurst\" (literalmente \"eso es salchicha para mí\") es una forma casual y colorida de decir que no te importa — 'Das ist mir egal' es la frase estándar más neutral." }, "B2"],
    ["Translate: 'Don't buy a pig in a poke.'", ["Kauf nicht die Katze im Sack.", "Kauf nicht das Schwein blind.", "Kauf nichts ungesehen total.", "Vertraue niemals blind."], 0,
      { en: "Where English says \"pig,\" German says \"cat\" — \"die Katze im Sack kaufen\" (to buy the cat in the sack) means buying something without inspecting it first.", es: "Donde el inglés dice \"cerdo,\" el alemán dice \"gato\" — \"die Katze im Sack kaufen\" (comprar el gato en el saco) significa comprar algo sin revisarlo antes." }, "B2"],
    ["Translate: 'That's the heart of the matter.'", ["Da liegt der Hund begraben.", "Das ist der Kern der Sache.", "Das ist das Herz davon.", "Da liegt das Problem."], 0,
      { en: "\"Da liegt der Hund begraben\" (literally \"that's where the dog is buried\") is a vivid German idiom for identifying the real crux of an issue.", es: "\"Da liegt der Hund begraben\" (literalmente \"ahí está enterrado el perro\") es un modismo alemán vívido para señalar el verdadero meollo de un asunto." }, "B2"],
    ["Translate: 'He's completely oblivious to it.'", ["Er hat Tomaten auf den Augen.", "Er sieht das gar nicht.", "Er bemerkt nichts davon.", "Er ist völlig blind dafür."], 0,
      { en: "\"Tomaten auf den Augen haben\" (literally \"to have tomatoes on the eyes\") is the everyday German idiom for being oblivious to something obvious right in front of you.", es: "\"Tomaten auf den Augen haben\" (literalmente \"tener tomates en los ojos\") es el modismo alemán cotidiano para no ver algo obvio justo delante." }, "B1"],
    ["Translate: 'He kicked the bucket.' (informal, died)", ["Er hat ins Gras gebissen.", "Er ist gestorben plötzlich.", "Er hat den Löffel fallen lassen.", "Er ist von uns gegangen."], 0,
      { en: "\"Ins Gras beißen\" (literally \"to bite into the grass\") is the informal German equivalent of \"to kick the bucket.\"", es: "\"Ins Gras beißen\" (literalmente \"morder el pasto\") es el equivalente alemán informal de \"estirar la pata\"." }, "B2"],
  ],
};

// German phonetics: umlauts (ä/ö/ü) shift vowel quality with no direct
// English equivalent, "ch" sounds two different ways depending on the
// preceding vowel (ich-laut after front vowels, ach-laut after back vowels),
// and final b/d/g devoice to sound like p/t/k. CAPS = stress.
const FONO_BANK = [
  { text: "Ich möchte ein Bier, bitte.", sound: "ish MERSH-tuh ayn beer, BIT-tuh", difficulty: "B1",
    identify: { options: ["Ich möchte ein Bier, bitte.", "Ich mochte ein Bier, bitte.", "Ich möchte einen Bier, bitte.", "Ich möchte ein Wasser, bitte."], correctIdx: 0,
      explain: { en: "'Möchte' has the ö umlaut (a rounded front vowel with no English equivalent) plus the soft \"ich-laut\" ch sound, since it follows a front vowel.", es: "'Möchte' tiene la diéresis ö (una vocal anterior redondeada sin equivalente en inglés) más el sonido suave \"ich-laut\" de la ch, ya que sigue a una vocal anterior." } },
    respond: { options: ["Kommt sofort!", "Das kostet zehn Euro.", "Ich weiß nicht.", "Es ist weit weg."], correctIdx: 0,
      explain: { en: "A polite drink order calls for a quick service-style acknowledgment, like \"coming right up!\"", es: "Un pedido cortés de bebida pide un reconocimiento rápido de servicio, como \"¡enseguida!\"" } } },
  { text: "Das Buch ist gut.", sound: "dahs bookh ist goot", difficulty: "A2",
    identify: { options: ["Das Buch ist gut.", "Das Buch ist neu.", "Das Buch ist gut geschrieben.", "Der Buch ist gut."], correctIdx: 0,
      explain: { en: "'Buch' ends in the hard \"ach-laut\" ch sound (since it follows the back vowel 'u') — very different from the soft ch in 'ich' or 'möchte'.", es: "'Buch' termina en el sonido duro \"ach-laut\" de la ch (ya que sigue a la vocal posterior 'u') — muy diferente del ch suave en 'ich' o 'möchte'." } },
    respond: { options: ["Ja, ich habe es gelesen.", "Nein, es ist teuer.", "Wo hast du es gekauft?", "Das interessiert mich nicht."], correctIdx: 0,
      explain: { en: "A comment about a book being good calls for a relatable response, like \"yes, I've read it.\"", es: "Un comentario sobre que un libro es bueno pide una respuesta cercana, como \"sí, lo he leído\"." } } },
  { text: "Er hat einen Hund.", sound: "air haht EYE-nen hoont", difficulty: "B1",
    identify: { options: ["Er hat einen Hund.", "Er hat einen Hut.", "Er hat eine Hand.", "Er hatte einen Hund."], correctIdx: 0,
      explain: { en: "'Hund' ends in a 'd' that's actually pronounced like a 't' — German devoices b/d/g to p/t/k at the end of a word, a rule with no equivalent in English spelling.", es: "'Hund' termina en una 'd' que en realidad se pronuncia como una 't' — el alemán ensordece b/d/g a p/t/k al final de una palabra, una regla sin equivalente en la ortografía inglesa." } },
    respond: { options: ["Wie heißt er denn?", "Das ist sehr teuer.", "Ich mag das nicht.", "Wo ist er jetzt?"], correctIdx: 0,
      explain: { en: "Hearing someone has a dog naturally invites a friendly follow-up question, like \"what's his name?\"", es: "Escuchar que alguien tiene un perro invita naturalmente a una pregunta amistosa, como \"¿cómo se llama?\"" } } },
  { text: "Die Übung ist schwer.", sound: "dee EWE-boong ist shvair", difficulty: "B2",
    identify: { options: ["Die Übung ist schwer.", "Die Übung ist leicht.", "Die Prüfung ist schwer.", "Die Übung war schwer."], correctIdx: 0,
      explain: { en: "'Übung' has the ü umlaut, a rounded high front vowel with no true English equivalent — and 'schwer' shows the German 'sch' sound, close to English \"sh.\"", es: "'Übung' tiene la diéresis ü, una vocal anterior alta redondeada sin equivalente real en inglés — y 'schwer' muestra el sonido alemán 'sch', cercano al \"sh\" del inglés." } },
    respond: { options: ["Ja, ich übe jeden Tag.", "Nein, das kostet nichts.", "Es ist schon spät.", "Ich habe keine Zeit."], correctIdx: 0,
      explain: { en: "A comment about an exercise being hard calls for a relatable response about practicing, like \"yes, I practice every day.\"", es: "Un comentario sobre que un ejercicio es difícil pide una respuesta cercana sobre practicar, como \"sí, practico todos los días\"." } } },
];

const deForEn = {
  id: "de-for-en",
  label: "Deutsch",
  sublabel: "For English speakers · German",
  nativeLang: "en",
  targetLang: "de",
  theme: "germany-stahl",
  cats: CATS,
  bank: BANK,
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Lies die ungefähre Aussprache. Was sagt sie?",
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — welche Antwort passt?`,
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default deForEn;

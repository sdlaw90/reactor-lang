// Track: French (Canada/Québécois), for an English speaker. Deliberately NOT
// a reskin of frForEn.js — meal names shift entirely (déjeuner/dîner/souper
// mean different meals in Quebec vs. France), several words are false
// friends WITHIN French itself (char, liqueur), and the grammar/phonetics
// include genuinely Quebec-specific features (the -tu question particle,
// "chu" contraction, t/d affrication) that don't exist in France French.
// Built at full depth from the start, matching itForEn.js/frForEn.js.
// Deepening pass 2026-07-12: A1/C1/C2 tier coverage, promptNative subtitles
// (slot 6) on every French-language prompt, five new fono pairs, and the
// track's Word Bank (fvocab) — the second track through the WB assembly line
// after the esForEn pilot. French prompt formulas live below; the generator
// itself is language-neutral as of this pass.

import { buildFrequencyBank } from "../../lib/frequencyVocab";
import WORDS from "../vocab/frCaWords";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// French prompt formulas for the Word Bank generator. The ¿Cómo se dice...?
// SSML rule in scripts/generate-tts.mjs will need a Comment dit-on...?
// analogue (English word in a native <lang> span) at this track's TTS pass.
const FR_FORMULAS = {
  recognitionPrompt: (w) => `'${cap(w)}' signifie...`,
  recognitionNative: (w) => ({ en: `'${cap(w)}' means...` }),
  recognitionExplain: (w, g, noteEn) => ({
    en: `'${cap(w)}' means ${g}.${noteEn}`,
    es: `'${cap(w)}' significa ${g}.`,
  }),
  productionPrompt: (g) => `Comment dit-on '${g}' en français?`,
  productionNative: (g) => ({ en: `How do you say '${g}' in French?` }),
  productionExplain: (w, g, noteEn) => ({
    en: `'${g}' is '${w}'.${noteEn}`,
    es: `'${g}' se dice '${w}'.`,
  }),
};

const CATS = {
  vocab: { label: "Vocabulaire", color: "#3DDBFF" },
  gram: { label: "Grammaire", color: "#FFB84D" },
  trad: { label: "Expressions", color: "#FF3D7F" },
  fono: { label: "Phonétique", color: "#B98EFF" },
  fvocab: { label: "Mots", color: "#7BE495" },
};

const BANK = {
  vocab: [
    ["'Magasiner' signifie...", ["to shop/go shopping", "to shop online", "to store away", "to organize"], 0,
      { en: "A distinctly Québécois verb for shopping — in France, people say \"faire du shopping\" or \"faire les courses\" instead.", es: "Un verbo típicamente quebequense para ir de compras — en Francia se dice \"faire du shopping\" o \"faire les courses\"." }, "A2", null, { en: "'Magasiner' means..." }],
    ["'Char' signifie (au Québec)...", ["car", "tank (military)", "cart", "wagon"], 0,
      { en: "A false friend WITHIN French: in Quebec, 'char' casually means car. In France, 'char' means a military tank — French speakers from different regions can genuinely confuse each other with this one.", es: "Un falso amigo DENTRO del francés mismo: en Quebec, 'char' significa auto casualmente. En Francia, 'char' significa tanque militar — hablantes de francés de distintas regiones pueden confundirse genuinamente con esta palabra." }, "B1", null, { en: "'Char' means (in Quebec)..." }],
    ["'Déjeuner' signifie (au Québec)...", ["breakfast", "lunch", "dinner", "a snack"], 0,
      { en: "The most famous Quebec/France difference: in Quebec, 'déjeuner' is breakfast. In France, 'déjeuner' is LUNCH (breakfast there is 'petit-déjeuner'). All three meal names shift by one between the two dialects.", es: "La diferencia más famosa entre Quebec y Francia: en Quebec, 'déjeuner' es el desayuno. En Francia, 'déjeuner' es el ALMUERZO (el desayuno allí es 'petit-déjeuner'). Los tres nombres de comidas se desplazan entre los dos dialectos." }, "B1", null, { en: "'Déjeuner' means (in Quebec)..." }],
    ["'Dîner' signifie (au Québec)...", ["lunch", "breakfast", "a late-night snack", "dinner"], 0,
      { en: "Following the same shift: Quebec's 'dîner' is lunch, while in France 'dîner' means dinner (the evening meal).", es: "Siguiendo el mismo desplazamiento: 'dîner' en Quebec es el almuerzo, mientras que en Francia 'dîner' significa la cena." }, "B1", null, { en: "'Dîner' means (in Quebec)..." }],
    ["'Souper' signifie (au Québec)...", ["dinner/supper", "breakfast", "lunch", "a midnight snack"], 0,
      { en: "Completing the shift: Quebec's main evening meal is 'souper'. In France, 'souper' exists but usually refers specifically to a late-night meal, not the standard dinner.", es: "Completando el desplazamiento: la comida principal de la noche en Quebec es 'souper'. En Francia, 'souper' existe pero suele referirse específicamente a una comida tardía de la noche, no a la cena estándar." }, "A2", null, { en: "'Souper' means (in Quebec)..." }],
    ["'Blonde/Chum' signifie...", ["girlfriend/boyfriend", "sister/brother", "coworker", "roommate"], 0,
      { en: "Everyday Québécois terms for girlfriend ('ma blonde')/boyfriend ('mon chum'). In France, people say 'copine/copain' or 'petite amie/petit ami' instead.", es: "Términos cotidianos quebequenses para novia ('ma blonde')/novio ('mon chum'). En Francia se dice 'copine/copain' o 'petite amie/petit ami'." }, "B1", null, { en: "'Blonde/Chum' means..." }],
    ["'Fin de semaine' signifie...", ["weekend", "end of the month", "vacation", "a long weekend specifically"], 0,
      { en: "Quebec French prefers this native term over France's borrowed English \"le week-end\" — part of Quebec's broader tendency to avoid English loanwords where France has adopted them.", es: "El francés quebequense prefiere este término nativo en vez del préstamo inglés de Francia \"le week-end\" — parte de la tendencia más amplia de Quebec a evitar préstamos del inglés donde Francia sí los adopta." }, "A2", null, { en: "'Fin de semaine' means..." }],
    ["'Cellulaire' signifie...", ["cell phone", "cell (biology)", "basement", "phone booth"], 0,
      { en: "Quebec's everyday word for cell phone. France instead uses 'portable' for the same thing.", es: "La palabra cotidiana quebequense para celular. Francia en cambio usa 'portable' para lo mismo." }, "A2", null, { en: "'Cellulaire' means..." }],
    ["'Espadrilles' signifie...", ["sneakers/running shoes", "sandals", "boots", "slippers"], 0,
      { en: "Quebec's everyday word for sneakers. France instead uses 'baskets' for the same shoes.", es: "La palabra cotidiana quebequense para tenis/zapatillas deportivas. Francia en cambio usa 'baskets' para el mismo calzado." }, "A2", null, { en: "'Espadrilles' means..." }],
    ["'Liqueur' signifie (au Québec)...", ["soft drink/soda/pop", "alcoholic liqueur", "juice", "sparkling water"], 0,
      { en: "Another false friend within French: in Quebec, 'liqueur' casually means soda/pop. In France, 'liqueur' specifically means an alcoholic liqueur — asking for 'de la liqueur' means very different things depending on where you are.", es: "Otro falso amigo dentro del francés: en Quebec, 'liqueur' significa casualmente refresco. En Francia, 'liqueur' significa específicamente un licor alcohólico — pedir 'de la liqueur' significa algo muy distinto según dónde estés." }, "B2", null, { en: "'Liqueur' means (in Quebec)..." }],
    ["'Bienvenue' comme réponse à 'merci' signifie...", ["you're welcome", "welcome (greeting)", "come in", "no problem, literally"], 0,
      { en: "Influenced by English, Quebec French uses 'bienvenue' to mean \"you're welcome\" after being thanked. In France, 'bienvenue' ONLY means \"welcome\" (as a greeting) — \"you're welcome\" there is 'de rien' or 'je t'en prie'.", es: "Influenciado por el inglés, el francés de Quebec usa 'bienvenue' para decir \"de nada\" tras un agradecimiento. En Francia, 'bienvenue' SOLO significa \"bienvenido\" (como saludo) — \"de nada\" allí es 'de rien' o 'je t'en prie'." }, "B2", null, { en: "'Bienvenue' as a reply to 'merci' means..." }],
    ["'Achaler' signifie...", ["to bother/annoy", "to warm up", "to hurry", "to greet"], 0,
      { en: "A distinctly Québécois verb for bothering or pestering someone — not really used in France French.", es: "Un verbo típicamente quebequense para molestar o fastidiar a alguien — no muy usado en el francés de Francia." }, "B2", null, { en: "'Achaler' means..." }],
    // Deepening pass 2026-07-12: A1/C1 coverage + more QC-specific vocabulary.
    ["'Bonjour' signifie...", ["hello/good day", "good night", "see you tomorrow", "please"], 0,
      { en: "The standard greeting — with a Quebec twist: Quebecers also say 'Bonjour!' when LEAVING a store, where France would only say 'au revoir'.", es: "El saludo estándar — con un giro quebequense: los quebequenses también dicen '¡Bonjour!' al SALIR de una tienda, donde en Francia solo se diría 'au revoir'." }, "A1", null, { en: "'Bonjour' means..." }],
    ["'Allô' signifie...", ["hi/hello", "hello (phone only)", "goodbye", "listen up"], 0,
      { en: "In Quebec, 'allô' is an everyday in-person greeting, like \"hi!\" In France, 'allô' is ONLY used when answering the phone — greeting someone with it face-to-face marks you instantly.", es: "En Quebec, 'allô' es un saludo cotidiano en persona, como \"¡hola!\". En Francia, 'allô' SOLO se usa al contestar el teléfono — saludar así cara a cara te delata al instante." }, "A1", null, { en: "'Allô' means..." }],
    ["'Le chien' signifie...", ["the dog", "the cat", "the wolf", "the fox"], 0,
      { en: "'Chien' means dog — and note the related Québécois idiom 'avoir la chienne' (to be scared).", es: "'Chien' significa perro — y nota el modismo quebequense relacionado 'avoir la chienne' (tener miedo)." }, "A1", null, { en: "'Le chien' means..." }],
    ["'Le courriel' signifie...", ["email", "mail (paper)", "courier service", "text message"], 0,
      { en: "Quebec invented this word (courrier + électronique) and made it official — it's now accepted French everywhere, though France still mostly says 'mail' or 'e-mail'. A rare case of Quebec exporting vocabulary to France.", es: "Quebec inventó esta palabra (courrier + électronique) y la hizo oficial — hoy es francés aceptado en todas partes, aunque Francia sigue diciendo sobre todo 'mail' o 'e-mail'. Un caso raro de Quebec exportando vocabulario a Francia." }, "A2", null, { en: "'Le courriel' means..." }],
    ["'Le stationnement' signifie...", ["parking lot; parking", "train station", "standing room", "bus stop"], 0,
      { en: "Quebec's word for parking — France just borrowed English and says 'le parking'. Another example of Quebec preferring a French coinage where France adopted the anglicism.", es: "La palabra quebequense para estacionamiento — Francia simplemente tomó el inglés y dice 'le parking'. Otro ejemplo de Quebec prefiriendo una creación francesa donde Francia adoptó el anglicismo." }, "A2", null, { en: "'Le stationnement' means..." }],
    ["'La tuque' signifie...", ["winter hat/beanie", "scarf", "glove", "winter boot"], 0,
      { en: "The knitted winter hat — an essential Quebec word for an essential Quebec object. France says 'bonnet'.", es: "El gorro tejido de invierno — una palabra quebequense esencial para un objeto quebequense esencial. Francia dice 'bonnet'." }, "A2", null, { en: "'La tuque' means..." }],
    ["'Le dépanneur' signifie (au Québec)...", ["corner store/convenience store", "repairman", "tow truck", "helper"], 0,
      { en: "A famous false friend within French: in Quebec, 'le dépanneur' (or 'le dep') is the corner store. In France, a 'dépanneur' is a repairman or tow-truck operator — the literal sense of 'dépanner' (to help out of a jam).", es: "Un falso amigo famoso dentro del francés: en Quebec, 'le dépanneur' (o 'le dep') es la tienda de la esquina. En Francia, un 'dépanneur' es un técnico o grúa — el sentido literal de 'dépanner' (sacar de un apuro)." }, "B1", null, { en: "'Le dépanneur' means (in Quebec)..." }],
    ["'Jaser' signifie...", ["to chat", "to shout", "to gossip maliciously", "to whisper"], 0,
      { en: "Quebec's everyday verb for chatting: 'on a jasé un peu' (we chatted a bit). In France the word survives mainly with a negative gossip sense — in Quebec it's friendly.", es: "El verbo cotidiano quebequense para charlar: 'on a jasé un peu' (charlamos un poco). En Francia la palabra sobrevive sobre todo con un sentido negativo de chisme — en Quebec es amistoso." }, "B1", null, { en: "'Jaser' means..." }],
    ["'Barrer la porte' signifie (au Québec)...", ["to lock the door", "to block the door", "to cross out", "to slam the door"], 0,
      { en: "In Quebec, 'barrer' means to lock — 'barre la porte!' (lock the door!). France says 'verrouiller' or 'fermer à clé'; there, 'barrer' mostly means to cross out or to block. Quebec kept the older sense from the days of literal door bars.", es: "En Quebec, 'barrer' significa cerrar con llave — '¡barre la porte!'. Francia dice 'verrouiller' o 'fermer à clé'; allá, 'barrer' significa sobre todo tachar o bloquear. Quebec conservó el sentido antiguo de las barras de puerta literales." }, "B1", null, { en: "'Barrer la porte' means (in Quebec)..." }],
    ["'Niaiser' signifie...", ["to kid around/mess with someone", "to be silent", "to daydream", "to insult seriously"], 0,
      { en: "Core casual Québécois: 'niaiser quelqu'un' is to pull someone's leg, and 'arrête de niaiser!' is \"quit messing around!\" France French barely uses it.", es: "Quebequense casual esencial: 'niaiser quelqu'un' es tomarle el pelo a alguien, y 'arrête de niaiser!' es \"¡deja de vacilar!\". El francés de Francia apenas lo usa." }, "B2", null, { en: "'Niaiser' means..." }],
    ["'Pogner' signifie...", ["to catch/grab/get", "to hit", "to lose", "to push"], 0,
      { en: "One of the most versatile Québécois verbs: catch a cold ('pogner un rhume'), get stuck ('se faire pogner'), grab something, even 'to be popular' ('ça pogne!'). Unknown in France French.", es: "Uno de los verbos quebequenses más versátiles: pescar un resfriado ('pogner un rhume'), quedar atrapado ('se faire pogner'), agarrar algo, incluso 'tener éxito' ('ça pogne!'). Desconocido en el francés de Francia." }, "C1", null, { en: "'Pogner' means..." }],
    ["'Quétaine' signifie...", ["tacky/cheesy", "elegant", "expensive", "old-fashioned but charming"], 0,
      { en: "Quebec's word for tacky or kitschy — 'c'est don' ben quétaine!' (that's SO cheesy!). France says 'ringard' or 'kitsch' instead; 'quétaine' is pure Québécois.", es: "La palabra quebequense para cursi o kitsch — 'c'est don' ben quétaine!' (¡qué cursi!). Francia dice 'ringard' o 'kitsch'; 'quétaine' es puro quebequense." }, "C1", null, { en: "'Quétaine' means..." }],
  ],
  gram: [
    ["___ maison est grande.", ["La", "Le", "Un", "Du"], 0,
      { en: "French nouns have grammatical gender regardless of dialect — 'maison' (house) is feminine, so it takes 'la'.", es: "Los sustantivos franceses tienen género gramatical sin importar el dialecto — 'maison' (casa) es femenino, así que lleva 'la'." }, "A2", null, { en: "___ house is big." }],
    ["Chu fatigué.", ["✓ correct — casual contraction of 'Je suis'", "grammatically incorrect", "means something else entirely", "formal register"], 0,
      { en: "\"Chu\" is a very common casual Québécois contraction of \"Je suis\" — extremely frequent in everyday speech, though it wouldn't appear in formal writing.", es: "\"Chu\" es una contracción quebequense casual muy común de \"Je suis\" — extremadamente frecuente en el habla cotidiana, aunque no aparecería en la escritura formal." }, "B1", null, { en: "I'm tired. (casual)" }],
    ["Les maisons sont ___.", ["grandes", "grande", "grands", "grand"], 0,
      { en: "Adjectives agree in number and gender regardless of dialect — feminine plural 'maisons' needs 'grandes'.", es: "Los adjetivos concuerdan en número y género sin importar el dialecto — el femenino plural 'maisons' necesita 'grandes'." }, "A2", null, { en: "The houses are ___ (big)." }],
    ["T'as-tu fini tes devoirs?", ["✓ correct — Québécois \"-tu\" question particle", "grammatically incorrect", "means \"you, finish\"", "formal question form"], 0,
      { en: "Adding \"-tu\" after the verb is a genuinely distinctive Québécois way to form a casual yes/no question — it doesn't mean \"you\" here, it's just a question marker. Not used in France French at all.", es: "Añadir \"-tu\" después del verbo es una forma genuinamente distintiva quebequense de hacer una pregunta casual de sí/no — aquí no significa \"tú\", es solo un marcador de pregunta. No se usa en absoluto en el francés de Francia." }, "B2", null, { en: "Have you finished your homework?" }],
    ["Je suis allé au marché.", ["✓ correct — être as auxiliary", "should use avoir", "wrong tense entirely", "missing preposition"], 0,
      { en: "Verbs of movement/state (like 'aller') use 'être' as the auxiliary in the passé composé, the same rule as in France French.", es: "Los verbos de movimiento/estado (como 'aller') usan 'être' como auxiliar en el pretérito compuesto, la misma regla que en el francés de Francia." }, "B1", null, { en: "I went to the market." }],
    ["Où c'est que tu vas?", ["✓ correct — casual Québécois question structure", "grammatically incorrect", "overly formal", "means \"where is it\""], 0,
      { en: "Inserting \"c'est que\" into a question is a common casual Québécois pattern, alongside the more standard \"Où vas-tu?\" or \"Où est-ce que tu vas?\"", es: "Insertar \"c'est que\" en una pregunta es un patrón casual quebequense común, junto con el más estándar \"Où vas-tu?\" o \"Où est-ce que tu vas?\"" }, "B2", null, { en: "Where are you going? (casual)" }],
    ["Je ___ sais pas.", ["ne", "pas", "non", "n'"], 0,
      { en: "Formal negation is still 'ne...pas' in Quebec French too — though 'ne' gets dropped even more readily in casual Québécois speech than in France French.", es: "La negación formal sigue siendo 'ne...pas' también en el francés de Quebec — aunque 'ne' se omite todavía más fácilmente en el habla casual quebequense que en el francés de Francia." }, "A2", null, { en: "I don't know." }],
    ["C'est right bon, ça!", ["✓ correct — \"right\" as a Québécois intensifier", "grammatically incorrect", "means \"that's correct\"", "formal register"], 0,
      { en: "Quebec French has absorbed English \"right\" as a casual intensifier meaning \"really/very\" — a genuinely different anglicism pattern than France French, which absorbed different English words instead (like 'le week-end').", es: "El francés de Quebec ha absorbido el \"right\" del inglés como un intensificador casual que significa \"muy/realmente\" — un patrón de anglicismo genuinamente distinto al del francés de Francia, que absorbió otras palabras inglesas en su lugar (como 'le week-end')." }, "B2", null, { en: "That's really good!" }],
    ["Il faut que tu ___ tes devoirs.", ["fasses", "fais", "faisais", "feras"], 0,
      { en: "\"Il faut que\" triggers the subjunctive mood regardless of dialect — 'fasses', not the indicative 'fais'.", es: "\"Il faut que\" desencadena el modo subjuntivo sin importar el dialecto — 'fasses', no el indicativo 'fais'." }, "B2", null, { en: "You have to ___ (do) your homework." }],
    // Deepening pass 2026-07-12: A1/C1/C2 coverage + more genuinely QC structures.
    ["___ chien est petit.", ["Le", "La", "Les", "De"], 0,
      { en: "'Chien' (dog) is masculine, so it takes 'le' — grammatical gender applies in every French dialect.", es: "'Chien' (perro) es masculino, así que lleva 'le' — el género gramatical aplica en todos los dialectos del francés." }, "A1", null, { en: "___ dog is small." }],
    ["Je ___ de Montréal.", ["suis", "es", "est", "sont"], 0,
      { en: "'Être' conjugates as 'je suis' (I am) — though in casual Québécois speech you'll constantly hear it compressed to 'chu': 'chu de Montréal'.", es: "'Être' se conjuga como 'je suis' (yo soy) — aunque en el habla casual quebequense lo oirás constantemente comprimido a 'chu': 'chu de Montréal'." }, "A1", null, { en: "I ___ (am) from Montreal." }],
    ["J'ai acheté ___ pommes.", ["des", "un", "du", "de la"], 0,
      { en: "Plural indefinite quantities take 'des' — 'some apples'. The partitive system works the same in Quebec and France.", es: "Las cantidades indefinidas en plural llevan 'des' — 'unas manzanas'. El sistema partitivo funciona igual en Quebec y Francia." }, "A2", null, { en: "I bought ___ (some) apples." }],
    ["Je vas au magasin.", ["✓ correct — common casual Québécois for 'je vais'", "grammatically incorrect everywhere", "means \"I was going\"", "formal register"], 0,
      { en: "\"Je vas\" is extremely common casual Québécois where standard French has 'je vais' — you'll also hear the even more compressed 'm'as' for 'je vais' + infinitive ('m'as y aller' = I'm gonna go).", es: "\"Je vas\" es quebequense casual extremadamente común donde el francés estándar tiene 'je vais' — también oirás el aún más comprimido 'm'as' para 'je vais' + infinitivo ('m'as y aller' = voy a ir)." }, "B1", null, { en: "I'm going to the store. (casual)" }],
    ["Elle est ___ grande que sa sœur.", ["plus", "très", "trop", "si"], 0,
      { en: "Comparatives use 'plus...que' (more...than): 'plus grande que' = taller than. 'Très', 'trop', and 'si' can't pair with 'que' this way.", es: "Los comparativos usan 'plus...que' (más...que): 'plus grande que' = más alta que. 'Très', 'trop' y 'si' no pueden combinarse con 'que' así." }, "B1", null, { en: "She is ___ (taller) than her sister." }],
    ["A veut pas venir.", ["✓ correct — casual Québécois 'a' for 'elle'", "grammatically incorrect", "means \"one doesn't want to come\"", "means \"go, don't come\""], 0,
      { en: "In casual Québécois speech, 'elle' reduces to 'a': 'a veut pas' = elle ne veut pas. Its partner: 'il' reduces to 'y' ('y veut pas'). Purely spoken forms — never written formally.", es: "En el habla casual quebequense, 'elle' se reduce a 'a': 'a veut pas' = elle ne veut pas. Su pareja: 'il' se reduce a 'y' ('y veut pas'). Formas puramente orales — nunca se escriben formalmente." }, "B2", null, { en: "She doesn't want to come. (casual)" }],
    ["Vous autres, vous venez-tu?", ["✓ correct — Québécois 'vous autres' + '-tu' question", "grammatically incorrect", "means \"you others, are you alone?\"", "formal register"], 0,
      { en: "Québécois reinforces plural pronouns with 'autres': 'nous autres', 'vous autres', 'eux autres' — and stacks the '-tu' question particle on top. France French uses neither pattern.", es: "El quebequense refuerza los pronombres plurales con 'autres': 'nous autres', 'vous autres', 'eux autres' — y encima añade la partícula interrogativa '-tu'. El francés de Francia no usa ninguno de los dos patrones." }, "B2", null, { en: "Are you (all) coming? (casual)" }],
    ["Faque, on fait quoi?", ["✓ correct — 'faque' means \"so\" in casual Québécois", "grammatically incorrect", "means \"fake, what do we do?\"", "means \"because, what do we do?\""], 0,
      { en: "'Faque' (from 'ça fait que') is Quebec's all-purpose \"so\" — it opens sentences constantly in casual speech. Sometimes spelled 'fak' or 'fait que'.", es: "'Faque' (de 'ça fait que') es el \"entonces\" para todo de Quebec — abre frases constantemente en el habla casual. A veces se escribe 'fak' o 'fait que'." }, "C1", null, { en: "So, what do we do? (casual)" }],
    ["Il faudrait que tu ___ là avant midi.", ["sois", "es", "seras", "étais"], 0,
      { en: "'Il faudrait que' (you'd need to) triggers the subjunctive: 'sois'. The conditional softens the demand, but the subjunctive rule holds in every dialect.", es: "'Il faudrait que' (haría falta que) exige el subjuntivo: 'sois'. El condicional suaviza la exigencia, pero la regla del subjuntivo se mantiene en todos los dialectos." }, "C1", null, { en: "You'd need to ___ (be) there before noon." }],
    ["J'y ai donné le livre.", ["✓ correct casual Québécois — 'y' for 'lui'", "grammatically incorrect", "means \"I gave the book there\"", "means \"I gave it the book\" (object)"], 0,
      { en: "In casual Québécois, the indirect-object pronoun 'lui' becomes 'y': 'j'y ai donné' = je lui ai donné (I gave him/her). A deeply rooted spoken feature that surprises France-trained ears.", es: "En quebequense casual, el pronombre de objeto indirecto 'lui' se vuelve 'y': 'j'y ai donné' = je lui ai donné (le di). Un rasgo oral muy arraigado que sorprende a oídos entrenados en Francia." }, "C2", null, { en: "I gave him/her the book. (casual)" }],
    ["Quand qu'il va arriver, on va souper.", ["✓ correct casual Québécois — 'que' after 'quand'", "grammatically incorrect", "means \"whenever he might arrive\"", "formal register"], 0,
      { en: "Casual Québécois inserts 'que' after conjunctions: 'quand que', 'comment que', 'où que'. Standard French drops it ('quand il va arriver') — recognizing the pattern is key to understanding fast QC speech.", es: "El quebequense casual inserta 'que' tras las conjunciones: 'quand que', 'comment que', 'où que'. El francés estándar lo omite ('quand il va arriver') — reconocer el patrón es clave para entender el habla rápida de Quebec." }, "C2", null, { en: "When he arrives, we'll have dinner. (casual)" }],
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
    // Deepening pass 2026-07-12: A1/A2/C1/C2 coverage.
    ["Translate: 'Thank you very much.'", ["Merci beaucoup.", "Beaucoup merci.", "Très merci.", "Merci bien trop."], 0,
      { en: "'Merci beaucoup' works identically in Quebec and France — and remember the Quebec twist on the REPLY: 'bienvenue' means \"you're welcome\" there.", es: "'Merci beaucoup' funciona igual en Quebec y Francia — y recuerda el giro quebequense en la RESPUESTA: 'bienvenue' significa \"de nada\" allá." }, "A1"],
    ["Translate: 'See you later today!'", ["À tantôt!", "À l'an prochain!", "Au plus tard!", "À tout jamais!"], 0,
      { en: "'Tantôt' is a precise Quebec time word: later (or earlier) the SAME day. 'À tantôt!' promises you'll see them before the day is out — a nuance France's 'à bientôt' doesn't carry.", es: "'Tantôt' es una palabra de tiempo quebequense precisa: más tarde (o más temprano) el MISMO día. '¡À tantôt!' promete verse antes de que acabe el día — un matiz que el 'à bientôt' de Francia no tiene." }, "A2"],
    ["Translate: 'My car broke down.'", ["Mon char est brisé.", "Mon char est fini là.", "Ma voiture est fatiguée.", "Mon char est tombé net."], 0,
      { en: "Quebec says a broken machine is 'brisé' — France would say 'en panne' ('mon auto est en panne'). Add 'char' and the sentence becomes doubly Québécois.", es: "En Quebec una máquina descompuesta está 'brisé' — Francia diría 'en panne' ('mon auto est en panne'). Añade 'char' y la frase se vuelve doblemente quebequense." }, "B1"],
    ["Translate: 'That makes no sense.'", ["Ça a pas d'allure.", "Ça a pas de direction.", "Ça fait pas de chemin.", "Ça marche pas fort."], 0,
      { en: "'Avoir de l'allure' in Quebec means to make sense / be reasonable — so 'ça a pas d'allure' (often heard as \"ç'a pas d'allure\") is the classic way to call something absurd.", es: "'Avoir de l'allure' en Quebec significa tener sentido / ser razonable — así que 'ça a pas d'allure' (a menudo oído como \"ç'a pas d'allure\") es la forma clásica de llamar absurdo a algo." }, "B2"],
    ["Translate: 'We had a blast.'", ["On a eu du fun.", "On a eu de la joie.", "On a fait la fête totale.", "On a pris du plaisir fou."], 0,
      { en: "'Avoir du fun' is a fully absorbed Quebec anglicism — 'le fun' even works as an adjective: 'c'est le fun!' (it's fun!). France says 's'amuser' or 'se marrer' instead.", es: "'Avoir du fun' es un anglicismo quebequense totalmente absorbido — 'le fun' incluso funciona como adjetivo: 'c'est le fun!' (¡qué divertido!). Francia dice 's'amuser' o 'se marrer'." }, "C1"],
    ["Translate: 'He's really mad/angry.'", ["Il est en maudit.", "Il est en peine.", "Il a le maudit.", "Il est au diable."], 0,
      { en: "'Être en maudit' = to be furious, one of Quebec's mild religion-derived expressions. Bonus: 'en maudit' also works as an intensifier — 'il fait frette en maudit' (it's REALLY cold).", es: "'Être en maudit' = estar furioso, una de las expresiones suaves de Quebec derivadas de la religión. Bono: 'en maudit' también funciona como intensificador — 'il fait frette en maudit' (hace MUCHO frío)." }, "C1"],
    ["Translate: 'Pull up a chair / have a seat.'", ["Tire-toi une bûche.", "Prends-toi un arbre.", "Assois-toi sur le feu.", "Tire une chaise fort."], 0,
      { en: "Literally \"pull yourself a log\" — from colonial days when logs were the seating. Still a warm, familiar Quebec invitation to join the table.", es: "Literalmente \"jálate un tronco\" — de la época colonial cuando los troncos eran los asientos. Sigue siendo una invitación quebequense cálida y familiar a sentarse a la mesa." }, "C2"],
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
  // Deepening pass 2026-07-12: five more pairs — moé/toé, icitte, il→y, diphthongs, en titi.
  { text: "Y fait beau à matin.", sound: "ee feh BOH ah mah-TEN", difficulty: "A2",
    identify: { options: ["Y fait beau à matin.", "Il fait beau ce matin.", "Y fait chaud à matin.", "Y faisait beau à matin."], correctIdx: 0,
      explain: { en: "Two casual QC features at once: 'il' reduces to 'y' (\"ee\"), and 'à matin' replaces 'ce matin'. The standard sentence 'il fait beau ce matin' means the same — but it isn't what was said.", es: "Dos rasgos casuales quebequenses a la vez: 'il' se reduce a 'y' (\"ee\"), y 'à matin' reemplaza 'ce matin'. La frase estándar 'il fait beau ce matin' significa lo mismo — pero no es lo que se dijo." } },
    respond: { options: ["Ouin, on va marcher?", "Non, il pleut demain.", "Le matin est fini.", "Y fait noir dehors."], correctIdx: 0,
      explain: { en: "Nice weather this morning invites a plan — \"ouin, on va marcher?\" (yeah, wanna go for a walk?). 'Ouin' is the QC casual 'ouais'.", es: "El buen tiempo matinal invita a un plan — \"ouin, on va marcher?\" (¿sí, vamos a caminar?). 'Ouin' es el 'ouais' casual quebequense." } } },
  { text: "Icitte, c'est chez nous.", sound: "ee-SIT, seh shay NOO", difficulty: "B1",
    identify: { options: ["Icitte, c'est chez nous.", "Ici, c'est chez vous.", "Icitte, c'est des choux.", "Il quitte, c'est chez nous."], correctIdx: 0,
      explain: { en: "'Icitte' is the famous QC stretch of 'ici' (here), with a crisp final -t sound. 'Chez nous' in Quebec can mean 'my place' even when you live alone — it's about home, not headcount.", es: "'Icitte' es el famoso alargamiento quebequense de 'ici' (aquí), con una -t final nítida. 'Chez nous' en Quebec puede significar 'mi casa' aunque vivas solo — se trata del hogar, no del número de personas." } },
    respond: { options: ["C'est ben beau chez vous!", "Où est-ce que tu quittes?", "Les choux sont bons.", "Chez qui, déjà?"], correctIdx: 0,
      explain: { en: "Someone proudly showing you their home calls for a compliment — \"c'est ben beau chez vous!\" (your place is really nice!).", es: "Alguien que te muestra su casa con orgullo merece un cumplido — \"c'est ben beau chez vous!\" (¡qué linda tu casa!)." } } },
  { text: "Moé pis toé, on va au parc.", sound: "mweh pee tweh, on VAH oh PARK", difficulty: "B2",
    identify: { options: ["Moé pis toé, on va au parc.", "Moi et toi, on va au parc.", "Moé pis toé, on va au lac.", "Mon p'tit à moé va au parc."], correctIdx: 0,
      explain: { en: "Two signature QC sounds: 'moi/toi' become 'moé/toé' (the pronunciation French had in the 1600s — Quebec kept it), and 'puis' compresses to 'pis', the everyday QC \"and\".", es: "Dos sonidos quebequenses distintivos: 'moi/toi' se vuelven 'moé/toé' (la pronunciación que el francés tenía en el siglo XVII — Quebec la conservó), y 'puis' se comprime en 'pis', el \"y\" cotidiano de Quebec." } },
    respond: { options: ["Dac, on part-tu là?", "Le lac est gelé.", "Moi, je reste au parc.", "Ton p'tit est fin."], correctIdx: 0,
      explain: { en: "A let's-go proposal gets a let's-go answer — \"dac, on part-tu là?\" (okay, we leaving now?): 'dac' from 'd'accord', plus the '-tu' question particle.", es: "Una propuesta de salir recibe una respuesta de salir — \"dac, on part-tu là?\" (¿ok, nos vamos ya?): 'dac' de 'd'accord', más la partícula interrogativa '-tu'." } } },
  { text: "Mon père arrive à soir.", sound: "mon paèRE ah-REEV ah SWÈRE", difficulty: "B2",
    identify: { options: ["Mon père arrive à soir.", "Mon père arrive ce soir.", "Ma paire arrive à soir.", "Mon frère arrive à soir."], correctIdx: 0,
      explain: { en: "Québécois diphthongizes long vowels in stressed syllables: 'père' glides toward \"paère\" and 'soir' toward \"swère\" — plus 'à soir' where France says 'ce soir'.", es: "El quebequense diptonga las vocales largas en sílabas acentuadas: 'père' se desliza hacia \"paère\" y 'soir' hacia \"swère\" — además de 'à soir' donde Francia dice 'ce soir'." } },
    respond: { options: ["Ah oui? Y reste à coucher?", "Ta paire de quoi?", "Mon frère aussi part.", "Le soir est déjà fini."], correctIdx: 0,
      explain: { en: "News of a parent arriving tonight calls for a practical follow-up — \"y reste à coucher?\" (is he staying over?), with the casual 'y' for 'il'.", es: "La noticia de un padre que llega esta noche pide una pregunta práctica — \"y reste à coucher?\" (¿se queda a dormir?), con el 'y' casual por 'il'." } } },
  { text: "J'aime ça en titi!", sound: "jem SAH on tsi-TSI", difficulty: "C1",
    identify: { options: ["J'aime ça en titi!", "J'aime ça, mon titi!", "J'ai mangé en titi!", "J'aime tant, en titi!"], correctIdx: 0,
      explain: { en: "'En titi' is a QC intensifier — \"a LOT\". And hear the affrication doing double duty: 'titi' comes out \"tsi-tsi\", the t-before-i rule applied twice in one word.", es: "'En titi' es un intensificador quebequense — \"MUCHO\". Y nota la africación por partida doble: 'titi' suena \"tsi-tsi\", la regla de t antes de i aplicada dos veces en una palabra." } },
    respond: { options: ["Contente que t'aimes ça!", "T'as mangé quoi?", "Titi, c'est qui?", "Tant que ça, hein?"], correctIdx: 0,
      explain: { en: "Enthusiasm invites shared enthusiasm — \"contente que t'aimes ça!\" (glad you like it!). The other options all misheard something.", es: "El entusiasmo invita a compartirlo — \"contente que t'aimes ça!\" (¡me alegra que te guste!). Las otras opciones oyeron mal algo." } } },
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
  bank: { ...BANK, fvocab: buildFrequencyBank(WORDS, { seed: 20260712, formulas: FR_FORMULAS }) },
  // #78: Word Bank category — the round-draw engine caps its share of mixed
  // rounds instead of letting a 636-item bank dominate the draw.
  wbCatId: "fvocab",
  extraCatId: "fono",
  extraBank: FONO_BANK.map((item) => ({
    sound: item.sound,
    difficulty: item.difficulty,
    identifyPrompt: "Lisez la prononciation approximative. Que dit-elle?",
    identifyPromptNative: { en: "Read the approximate pronunciation. What does it say?" },
    identify: item.identify,
    respondPrompt: (i) => `"${i.text}" — quelle réponse convient?`,
    respondPromptNative: (i) => ({ en: `"${i.text}" — what's the appropriate reply?` }),
    respond: item.respond,
    text: item.text,
  })),
  extraPairsPerRound: 2,
  perCat: 2,
  questionTime: 30,
  extraQuestionTime: 30,
};

export default frCaForEn;

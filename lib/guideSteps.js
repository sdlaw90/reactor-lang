// The intro tour content — a short, sequential "how to get around" walkthrough,
// deliberately lighter than the full Help reference (/help). Single source of
// truth for both the standalone page (/guide) and the first-run overlay
// (lib/GuideOverlay.js). Keep each body to a sentence or two: this is the
// 60-second tour, not the manual.
//
// Each step: { emoji, demo, title:{lang}, body:{lang} }.
//   emoji – fallback badge shown when a step has no demo
//   demo  – id of the animated CSS demo in lib/GuideDemo.js (shared across langs)
//   title/body – localized copy keyed by UI language. English is the base; the
//   es copy is AI-authored pending native review (#41). Use guideSteps(lang) to
//   get the resolved array (English fallback per field). Order is the tour order.

const STEPS = [
  {
    emoji: "🐿️",
    demo: "welcome",
    title: { en: "Welcome to SquirreLingo!", es: "¡Te damos la bienvenida a SquirreLingo!", it: "Ti diamo il benvenuto su SquirreLingo!", pt: "Boas-vindas ao SquirreLingo!", fr: "Bienvenue sur SquirreLingo !" },
    body: {
      en: "Language practice built for short, low-pressure bursts — answer a handful of questions, see how you did, stop whenever you like. Here's a quick 60-second tour of how to get around.",
      es: "Práctica de idiomas hecha para ratitos cortos y sin presión: responde un puñado de preguntas, mira cómo te fue y para cuando quieras. Aquí tienes un recorrido rápido de 60 segundos para ubicarte.",
      it: "Pratica linguistica pensata per sessioni brevi e senza pressione — rispondi a una manciata di domande, guarda com'è andata, smetti quando vuoi. Ecco un giro veloce di 60 secondi per orientarti.",
      pt: "Prática de idiomas feita para momentos curtos e sem pressão — responda a algumas perguntas, veja como foi, pare quando quiser. Aqui vai um tour rápido de 60 segundos para você se localizar.",
      fr: "De l’entraînement en langues pensé pour des sessions courtes et sans pression — réponds à quelques questions, regarde ce que ça donne, arrête quand tu veux. Voici un petit tour de 60 secondes pour t’y retrouver.",
    },
  },
  {
    emoji: "🌍",
    demo: "pick",
    title: { en: "Pick a language", es: "Elige un idioma", it: "Scegli una lingua", pt: "Escolha um idioma", fr: "Choisis une langue" },
    body: {
      en: "Tap any language bubble on the home screen to start practicing it. Each bubble shows your current level and progress, and every language is tracked separately — so you can dabble in a few without losing your place in any.",
      es: "Toca cualquier burbuja de idioma en la pantalla de inicio para empezar a practicarlo. Cada burbuja muestra tu nivel y tu progreso, y cada idioma se registra por separado, así que puedes probar varios sin perder tu lugar en ninguno.",
      it: "Tocca una qualsiasi bolla di lingua nella schermata iniziale per iniziare a praticarla. Ogni bolla mostra il tuo livello e i tuoi progressi, e ogni lingua viene registrata separatamente — così puoi provarne diverse senza perdere il segno in nessuna.",
      pt: "Toque em qualquer bolha de idioma na tela inicial para começar a praticar. Cada bolha mostra seu nível e seu progresso, e cada idioma é registrado separadamente — assim você pode experimentar vários sem perder seu lugar em nenhum.",
      fr: "Touche n’importe quelle bulle de langue sur l’écran d’accueil pour commencer à la pratiquer. Chaque bulle affiche ton niveau et ta progression, et chaque langue est suivie séparément — tu peux donc en essayer plusieurs sans perdre ta place dans aucune.",
    },
  },
  {
    emoji: "🎯",
    demo: "level",
    title: { en: "Find your level", es: "Encuentra tu nivel", it: "Trova il tuo livello", pt: "Descubra seu nível", fr: "Trouve ton niveau" },
    body: {
      en: "New to a language? Take its short, untimed placement quiz from the start screen — it samples every difficulty tier and sets you at the right one. Not sure? Just start playing; you'll be offered a level-up once you're answering well.",
      es: "¿Apenas empiezas con un idioma? Haz su prueba de nivel, corta y sin cronómetro, desde la pantalla de inicio: toma preguntas de todos los niveles y te ubica en el correcto. ¿Tienes dudas? Solo empieza a jugar; te ofreceremos subir de nivel cuando estés respondiendo bien.",
      it: "Sei alle prime armi con una lingua? Fai il test di livello, breve e senza cronometro, dalla schermata iniziale — prende domande da ogni fascia di difficoltà e ti colloca in quella giusta. Hai dei dubbi? Inizia semplicemente a giocare; ti proporremo un salto di livello quando risponderai bene.",
      pt: "Está começando um idioma? Faça o teste de nível, curto e sem cronômetro, na tela inicial — ele pega perguntas de todas as faixas de dificuldade e coloca você na certa. Na dúvida? É só começar a jogar; vamos oferecer um aumento de nível quando você estiver respondendo bem.",
      fr: "Tu débutes dans une langue ? Fais son test de niveau, court et sans chrono, depuis l’écran d’accueil — il pioche des questions dans chaque palier de difficulté et te place au bon. Pas sûr ? Commence simplement à jouer ; on te proposera de monter de niveau dès que tu répondras bien.",
    },
  },
  {
    emoji: "⚡",
    demo: "modes",
    title: { en: "Two ways to practice", es: "Dos formas de practicar", it: "Due modi per esercitarti", pt: "Duas formas de praticar", fr: "Deux façons de t’entraîner" },
    body: {
      en: "Quick Quiz is fast and game-style — a timer, a combo counter, and streaks. Lessons is calmer — no timer, one topic at a time, with the explanation right after each answer. Switch between them anytime; both build the same progress.",
      es: "El Quiz Rápido es veloz y con estilo de juego: cronómetro, contador de combos y rachas. Las Lecciones son más tranquilas: sin cronómetro, un tema a la vez y con la explicación justo después de cada respuesta. Cambia entre ellos cuando quieras; ambos suman el mismo progreso.",
      it: "Il Quiz Rapido è veloce e in stile gioco — cronometro, contatore di combo e serie. Le Lezioni sono più tranquille — niente cronometro, un argomento alla volta e la spiegazione subito dopo ogni risposta. Passa dall'uno all'altro quando vuoi; entrambi fanno crescere lo stesso progresso.",
      pt: "O Quiz Rápido é veloz e no estilo jogo — cronômetro, contador de combo e sequências. As Lições são mais tranquilas — sem cronômetro, um assunto de cada vez, com a explicação logo depois de cada resposta. Alterne entre eles quando quiser; os dois somam o mesmo progresso.",
      fr: "Le Quiz Rapide est rapide et façon jeu — un chrono, un compteur de combos et des séries. Les Leçons sont plus calmes — pas de chrono, un sujet à la fois, avec l’explication juste après chaque réponse. Passe de l’un à l’autre quand tu veux ; les deux font avancer la même progression.",
    },
  },
  {
    emoji: "▶️",
    demo: "play",
    title: { en: "Play a round", es: "Juega una ronda", it: "Gioca un round", pt: "Jogue uma rodada", fr: "Joue une manche" },
    body: {
      en: "Each round mixes a few question types — a colored tag shows which is which. There's no penalty for a wrong answer, and a combo (⚡) builds as you chain correct ones. Where audio exists, tap the speaker to hear the question read aloud.",
      es: "Cada ronda mezcla varios tipos de pregunta; una etiqueta de color indica cuál es cuál. No hay penalización por una respuesta incorrecta, y el combo (⚡) crece a medida que encadenas respuestas correctas. Donde haya audio, toca el altavoz para escuchar la pregunta en voz alta.",
      it: "Ogni round mescola vari tipi di domanda — un'etichetta colorata indica quale è quale. Non c'è nessuna penalità per una risposta sbagliata, e la combo (⚡) cresce man mano che ne incateni di corrette. Dove c'è l'audio, tocca l'altoparlante per ascoltare la domanda ad alta voce.",
      pt: "Cada rodada mistura vários tipos de pergunta — uma etiqueta colorida mostra qual é qual. Não há penalidade por uma resposta errada, e o combo (⚡) cresce conforme você emenda as certas. Onde houver áudio, toque no alto-falante para ouvir a pergunta em voz alta.",
      fr: "Chaque manche mélange plusieurs types de question — une étiquette colorée indique lequel est lequel. Il n’y a aucune pénalité en cas de mauvaise réponse, et le combo (⚡) grimpe quand tu enchaînes les bonnes. Là où l’audio existe, touche le haut-parleur pour écouter la question à voix haute.",
    },
  },
  {
    emoji: "💡",
    demo: "heads",
    title: { en: "Wrong answers teach you", es: "Las respuestas incorrectas te enseñan", it: "Le risposte sbagliate ti insegnano", pt: "As respostas erradas ensinam você", fr: "Les mauvaises réponses t’apprennent" },
    body: {
      en: "Miss one and you get a quick “Heads up” — the rule, plus which form you actually picked — so a wrong tap becomes a mini-lesson instead of just a red mark. Turn on Review mode in Settings to pause on each explanation.",
      es: "Si fallas una, recibes un rápido «Ojo»: la regla y la forma que elegiste, para que un toque equivocado se convierta en una mini-lección en vez de solo una marca roja. Activa el Modo repaso en Ajustes para hacer una pausa en cada explicación.",
      it: "Se ne sbagli una, ricevi un rapido «Attenzione» — la regola e la forma che hai scelto davvero — così un tocco sbagliato diventa una mini-lezione invece di un semplice segno rosso. Attiva la Modalità ripasso nelle Impostazioni per fermarti su ogni spiegazione.",
      pt: "Se errar uma, você recebe um rápido “Atenção” — a regra e a forma que você escolheu — assim um toque errado vira uma mini-lição em vez de só uma marca vermelha. Ative o Modo revisão nas Configurações para pausar em cada explicação.",
      fr: "Si tu en rates une, tu reçois un rapide « Attention » — la règle, et la forme que tu as choisie — pour qu’une erreur devienne une mini-leçon au lieu d’une simple croix rouge. Active le Mode révision dans les Réglages pour faire une pause sur chaque explication.",
    },
  },
  {
    emoji: "🗂️",
    demo: "theme",
    title: { en: "Focus by theme, or drill verbs", es: "Enfócate por tema o practica verbos", it: "Concentrati su un tema o allena i verbi", pt: "Foque em um tema ou treine verbos", fr: "Cible un thème, ou entraîne tes verbes" },
    body: {
      en: "Use the Theme filter to practice one topic — travel, food, work — across every category at once. Languages that conjugate also have the Grammar Gym: a standalone verb trainer that keeps its own progress and never touches your level or streak.",
      es: "Usa el filtro de temas para practicar un solo tema —viajes, comida, trabajo— en todas las categorías a la vez. Los idiomas que conjugan también tienen el Gimnasio de Gramática: un entrenador de verbos independiente que guarda su propio progreso y nunca afecta tu nivel ni tu racha.",
      it: "Usa il filtro Tema per esercitarti su un solo argomento — viaggi, cibo, lavoro — in tutte le categorie insieme. Le lingue che coniugano hanno anche la Palestra di Grammatica: un allenatore di verbi a sé stante, che tiene i propri progressi e non tocca mai il tuo livello né la tua serie.",
      pt: "Use o filtro de Tema para praticar um assunto só — viagem, comida, trabalho — em todas as categorias de uma vez. Os idiomas que conjugam também têm a Academia de Gramática: um treinador de verbos independente, que guarda o próprio progresso e nunca mexe no seu nível nem na sua sequência.",
      fr: "Utilise le filtre Thème pour travailler un seul sujet — voyage, nourriture, travail — dans toutes les catégories à la fois. Les langues qui se conjuguent ont aussi le Gymnase de Grammaire : un entraîneur de verbes indépendant, qui garde sa propre progression et ne touche jamais à ton niveau ni à ta série.",
    },
  },
  {
    emoji: "✍️",
    demo: "script",
    title: { en: "Learn a new script", es: "Aprende una nueva escritura", it: "Impara una nuova scrittura", pt: "Aprenda uma nova escrita", fr: "Apprends une nouvelle écriture" },
    body: {
      en: "Languages with their own writing system — Japanese, Korean, Russian, Mandarin — have an Alphabet mode sitting right next to Quick Quiz and Lessons: reference charts plus no-pressure practice, with letters glowing green as you nail them.",
      es: "Los idiomas con su propio sistema de escritura —japonés, coreano, ruso, mandarín— tienen un modo Alfabeto junto al Quiz Rápido y las Lecciones: tablas de referencia y práctica sin presión, con las letras iluminándose en verde a medida que las dominas.",
      it: "Le lingue con un proprio sistema di scrittura — giapponese, coreano, russo, mandarino — hanno una modalità Alfabeto proprio accanto al Quiz Rapido e alle Lezioni: tabelle di riferimento e pratica senza pressione, con le lettere che si illuminano di verde man mano che le impari.",
      pt: "Os idiomas com sistema de escrita próprio — japonês, coreano, russo, mandarim — têm um modo Alfabeto bem ao lado do Quiz Rápido e das Lições: tabelas de referência e prática sem pressão, com as letras acendendo em verde conforme você domina cada uma.",
      fr: "Les langues qui ont leur propre système d’écriture — japonais, coréen, russe, mandarin — ont un mode Alphabet juste à côté du Quiz Rapide et des Leçons : des tableaux de référence et de l’entraînement sans pression, avec des lettres qui passent au vert à mesure que tu les maîtrises.",
    },
  },
  {
    emoji: "📊",
    demo: "progress",
    title: { en: "Track your progress", es: "Sigue tu progreso", it: "Segui i tuoi progressi", pt: "Acompanhe seu progresso", fr: "Suis ta progression" },
    body: {
      en: "The Dashboard (in the menu behind your profile picture) shows your XP, streak, and rounds across every language, and each track has a mastery tracker by category. Your streak never breaks on a missed day — milestones just add bonus XP. Tap the ? on the home screen for full Help anytime, and you can reopen this tour from the menu. Now — pick your next quick win!",
      es: "El Panel (en el menú detrás de tu foto de perfil) muestra tu XP, tu racha y tus rondas en todos los idiomas, y cada idioma tiene un seguimiento de dominio por categoría. Tu racha nunca se rompe por un día perdido: los hitos solo suman XP extra. Toca el ? en la pantalla de inicio para ver la Ayuda completa cuando quieras, y puedes volver a abrir este recorrido desde el menú. Ahora… ¡elige tu próxima victoria!",
      it: "La Dashboard (nel menu dietro la tua foto profilo) mostra i tuoi XP, la tua serie e i tuoi round in tutte le lingue, e ogni lingua ha un indicatore di padronanza per categoria. La tua serie non si interrompe mai per un giorno saltato — i traguardi aggiungono solo XP bonus. Tocca il ? nella schermata iniziale per aprire la Guida completa quando vuoi, e puoi riaprire questo giro dal menu. Ora — scegli la tua prossima piccola vittoria!",
      pt: "O Painel (no menu atrás da sua foto de perfil) mostra seu XP, sua sequência e suas rodadas em todos os idiomas, e cada idioma tem um acompanhamento de domínio por categoria. Sua sequência nunca quebra por um dia perdido — os marcos só somam XP de bônus. Toque no ? na tela inicial para ver a Ajuda completa quando quiser, e você pode reabrir este tour pelo menu. Agora — escolha sua próxima vitória rápida!",
      fr: "Le Tableau de bord (dans le menu derrière ta photo de profil) affiche tes XP, ta série et tes manches dans toutes les langues, et chaque langue a un suivi de maîtrise par catégorie. Ta série ne se casse jamais si tu sautes un jour — les paliers ajoutent juste des XP bonus. Touche le ? sur l’écran d’accueil pour ouvrir l’Aide complète quand tu veux, et tu peux rouvrir ce tour depuis le menu. Allez — choisis ta prochaine petite victoire !",
    },
  },
];

// Resolve the tour steps in the given UI language (English fallback per field).
export function guideSteps(lang = "en") {
  return STEPS.map((s) => ({
    emoji: s.emoji,
    demo: s.demo,
    title: s.title[lang] || s.title.en,
    body: s.body[lang] || s.body.en,
  }));
}

// Back-compat: the English-resolved array (legacy default import path).
export const GUIDE_STEPS = guideSteps("en");

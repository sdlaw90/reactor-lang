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
    title: { en: "Welcome to SquirreLingo!", es: "¡Te damos la bienvenida a SquirreLingo!" },
    body: {
      en: "Language practice built for short, low-pressure bursts — answer a handful of questions, see how you did, stop whenever you like. Here's a quick 60-second tour of how to get around.",
      es: "Práctica de idiomas hecha para ratitos cortos y sin presión: responde un puñado de preguntas, mira cómo te fue y para cuando quieras. Aquí tienes un recorrido rápido de 60 segundos para ubicarte.",
    },
  },
  {
    emoji: "🌍",
    demo: "pick",
    title: { en: "Pick a language", es: "Elige un idioma" },
    body: {
      en: "Tap any language bubble on the home screen to start practicing it. Each bubble shows your current level and progress, and every language is tracked separately — so you can dabble in a few without losing your place in any.",
      es: "Toca cualquier burbuja de idioma en la pantalla de inicio para empezar a practicarlo. Cada burbuja muestra tu nivel y tu progreso, y cada idioma se registra por separado, así que puedes probar varios sin perder tu lugar en ninguno.",
    },
  },
  {
    emoji: "🎯",
    demo: "level",
    title: { en: "Find your level", es: "Encuentra tu nivel" },
    body: {
      en: "New to a language? Take its short, untimed placement quiz from the start screen — it samples every difficulty tier and sets you at the right one. Not sure? Just start playing; you'll be offered a level-up once you're answering well.",
      es: "¿Apenas empiezas con un idioma? Haz su prueba de nivel, corta y sin cronómetro, desde la pantalla de inicio: toma preguntas de todos los niveles y te ubica en el correcto. ¿Tienes dudas? Solo empieza a jugar; te ofreceremos subir de nivel cuando estés respondiendo bien.",
    },
  },
  {
    emoji: "⚡",
    demo: "modes",
    title: { en: "Two ways to practice", es: "Dos formas de practicar" },
    body: {
      en: "Quick Quiz is fast and game-style — a timer, a combo counter, and streaks. Lessons is calmer — no timer, one topic at a time, with the explanation right after each answer. Switch between them anytime; both build the same progress.",
      es: "El Quiz Rápido es veloz y con estilo de juego: cronómetro, contador de combos y rachas. Las Lecciones son más tranquilas: sin cronómetro, un tema a la vez y con la explicación justo después de cada respuesta. Cambia entre ellos cuando quieras; ambos suman el mismo progreso.",
    },
  },
  {
    emoji: "▶️",
    demo: "play",
    title: { en: "Play a round", es: "Juega una ronda" },
    body: {
      en: "Each round mixes a few question types — a colored tag shows which is which. There's no penalty for a wrong answer, and a combo (⚡) builds as you chain correct ones. Where audio exists, tap the speaker to hear the question read aloud.",
      es: "Cada ronda mezcla varios tipos de pregunta; una etiqueta de color indica cuál es cuál. No hay penalización por una respuesta incorrecta, y el combo (⚡) crece a medida que encadenas respuestas correctas. Donde haya audio, toca el altavoz para escuchar la pregunta en voz alta.",
    },
  },
  {
    emoji: "💡",
    demo: "heads",
    title: { en: "Wrong answers teach you", es: "Las respuestas incorrectas te enseñan" },
    body: {
      en: "Miss one and you get a quick “Heads up” — the rule, plus which form you actually picked — so a wrong tap becomes a mini-lesson instead of just a red mark. Turn on Review mode in Settings to pause on each explanation.",
      es: "Si fallas una, recibes un rápido «Ojo»: la regla y la forma que elegiste, para que un toque equivocado se convierta en una mini-lección en vez de solo una marca roja. Activa el Modo repaso en Ajustes para hacer una pausa en cada explicación.",
    },
  },
  {
    emoji: "🗂️",
    demo: "theme",
    title: { en: "Focus by theme, or drill verbs", es: "Enfócate por tema o practica verbos" },
    body: {
      en: "Use the Theme filter to practice one topic — travel, food, work — across every category at once. Languages that conjugate also have the Grammar Gym: a standalone verb trainer that keeps its own progress and never touches your level or streak.",
      es: "Usa el filtro de temas para practicar un solo tema —viajes, comida, trabajo— en todas las categorías a la vez. Los idiomas que conjugan también tienen el Gimnasio de Gramática: un entrenador de verbos independiente que guarda su propio progreso y nunca afecta tu nivel ni tu racha.",
    },
  },
  {
    emoji: "✍️",
    demo: "script",
    title: { en: "Learn a new script", es: "Aprende una nueva escritura" },
    body: {
      en: "Languages with their own writing system — Japanese, Korean, Russian, Mandarin — have an Alphabet mode sitting right next to Quick Quiz and Lessons: reference charts plus no-pressure practice, with letters glowing green as you nail them.",
      es: "Los idiomas con su propio sistema de escritura —japonés, coreano, ruso, mandarín— tienen un modo Alfabeto junto al Quiz Rápido y las Lecciones: tablas de referencia y práctica sin presión, con las letras iluminándose en verde a medida que las dominas.",
    },
  },
  {
    emoji: "📊",
    demo: "progress",
    title: { en: "Track your progress", es: "Sigue tu progreso" },
    body: {
      en: "The Dashboard (in the menu behind your profile picture) shows your XP, streak, and rounds across every language, and each track has a mastery tracker by category. Your streak never breaks on a missed day — milestones just add bonus XP. Tap the ? on the home screen for full Help anytime, and you can reopen this tour from the menu. Now — pick your next quick win!",
      es: "El Panel (en el menú detrás de tu foto de perfil) muestra tu XP, tu racha y tus rondas en todos los idiomas, y cada idioma tiene un seguimiento de dominio por categoría. Tu racha nunca se rompe por un día perdido: los hitos solo suman XP extra. Toca el ? en la pantalla de inicio para ver la Ayuda completa cuando quieras, y puedes volver a abrir este recorrido desde el menú. Ahora… ¡elige tu próxima victoria!",
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

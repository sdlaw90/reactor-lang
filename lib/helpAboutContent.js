// Co-located bilingual copy for the Help and About pages (#72 UI localization).
//
// These two pages are long-form prose with lots of inline emphasis and a few
// links, so the strings live here as data (keyed by UI language) rather than as
// ~100 flat playStrings keys. The pages resolve the reader's language
// (profile native_lang, falling back to the pre-login bootstrap) and render
// straight from this module — only the text comes from here; all layout,
// styling and behaviour stay in the pages.
//
// Lightweight inline markup understood by the page renderer:
//   *bold*            -> <b>bold</b>
//   _italic_          -> <i>italic</i>
//   {{key|label}}     -> a link; key is one of:
//                          about | help | feedback | beta  (internal routes)
//                          fb                              (Facebook group URL)
//
// Copy is language-agnostic about the UI-adaptation feature (never names a
// specific language); language names that DO appear are the catalogue of
// learnable languages and per-track feature descriptions, which is correct.

export const HELP_CONTENT = {
  en: {
    title: "How SquirreLingo works",
    crossref: "Looking for the bigger picture instead? See the {{about|About page}}.",
    sections: [
      {
        title: "Finding Help and the menu",
        body: [
          "The *?* button in the top-right corner of the home screen opens this Help page anytime — it’s right there so you never have to go hunting for it.",
          "Next to it, your *profile picture* opens a slide-out menu with everything else: *What’s New* (a dot appears when there’s a release you haven’t seen yet), *How to use SquirreLingo* (the same quick animated tour you got on your first sign-in — reopen it anytime), and *About* (what the app is, how the modes work, and what’s planned next). Below a divider, the full *Settings* section sits right there too — username, email, password, native language/country, profile picture, gameplay preferences — no extra tap needed to open it. This whole menu and every Settings label appear in your native language.",
        ],
      },
      {
        title: "SquirreLingo in your language",
        body: [
          "SquirreLingo doesn’t just teach in your language — *the app itself adapts to it*. Wherever your native language is supported, the whole interface follows it: the sign-in and sign-up screens, password recovery, the first-run onboarding, the slide-out menu and every Settings label, the beta-application form, and everything inside a round — subtitles, answer choices, explanations and the Word Bank.",
          "The app *picks your language automatically* from your browser the first time you arrive, so there’s nothing to set up. Prefer a different one? A small *🌐 language pill* sits in the corner of every screen before you sign in — tap it to switch anytime, and your choice sticks.",
          "More interface languages are being added over time, and coverage keeps widening as native-language content fills in. A few corners are still English for everyone — the *Grammar Gym* page and some status and error screens — and they’re next on the list. The *How to use SquirreLingo* tour is no longer one of them: it now follows your language too.",
        ],
      },
      {
        title: "Choosing what to learn",
        body: [
          "Your *native language* (set in Settings) decides which languages show up as bubbles to learn — you’ll see the languages available to learn from your own, and more language pairs keep getting added over time. Each bubble’s name shows in your native language too (e.g. you’d see “German” rather than “Deutsch”) — no need to recognize a language from its flag or name in its own script. Your *native country* is separate — it just personalizes the badge in the top icon row.",
          "Each language bubble shows your current skill level and XP progress toward the next one. Tap any bubble to start practicing that language — progress is tracked independently per language.",
        ],
      },
      {
        title: "Ways to practice: Quick Quiz, Lessons & more",
        body: [
          "*Quick Quiz* is the original game-style mode — short, randomly mixed rounds with a timer, combo scoring, and streaks. *Lessons* is a calmer alternative — no timer, no combo pressure, walking through one topic at a time (easiest items first), showing the explanation right after each answer. A segmented switch near the top of either mode’s start screen flips between them — both count toward the same XP, level, and mastery progress, so nothing is lost by switching.",
          "On tracks that support them, that same switch carries two more segments: an *Alphabet* mode for languages with their own writing system, and *Grammar Gym*, a standalone conjugation trainer. Both are described in their own sections below, and each keeps its own separate progress.",
        ],
      },
      {
        title: "Listen & Speak (coming soon)",
        body: [
          "Above the Quick Quiz / Lessons toggle you’ll also see a *Practice / Listen / Speak* switch. Practice is everything the app does today. Listening and speaking practice aren’t built yet — those two tabs are marked “Soon” and open a short Coming Soon page for now, so you can see where the app is headed. The About page has a fuller “What’s next” list.",
        ],
      },
      {
        title: "Category picker (Quick Quiz mode)",
        body: [
          "Before starting a round, mix and match any combination of categories to focus on (vocabulary, grammar, translation, phonetics — any subset), or leave it on the “Mixed” option for the default blend of everything (its label shows in whichever language your other buttons are currently in). Picking it clears any specific selections back to the full mix. In Lessons mode, you pick one topic at a time instead — see the mode explanation above.",
          "Some tracks also carry a *Word Bank* category — a large layer of the language’s most frequent words. It joins the mix like any other category, but the default blend caps how much of a round it can take up, so it never crowds out grammar, expressions, or phonetics.",
        ],
      },
      {
        title: "Practice by theme",
        body: [
          "Alongside the category picker, a *Focus by theme* row lets you drill a single topic — travel, food, work, and so on — pulled from every category at once. Leave it on *All themes* for the usual blend.",
          "A theme and a category focus *combine* when you pick both — say, just the grammar questions inside the “travel” theme. If that particular combination is too thin to fill a full round, the app tells you up front instead of quietly serving a one-item round.",
        ],
      },
      {
        title: "Language switches with your skill level",
        body: [
          "On each language’s play page, the on-screen buttons/labels/stats show in your *native language* while you’re at No experience, Beginner, or Intermediate — no need to read instructions in a language you don’t know yet. Once you reach Advanced or Native, that same chrome switches to the *language you’re learning*, since by then reading it is good practice.",
          "Questions themselves follow the same rule where available: the question appears in the language you’re learning, with a small *translation in your native language* right underneath while you’re at the lower skill levels — so you always know what’s being asked without the translation ever giving away the answer. At Advanced/Native the subtitle disappears along with the rest of the native-language chrome. This whole layer — the subtitles, the on-screen chrome, the answer choices and the Word Bank — adapts to your native language wherever that content exists, and more native languages keep filling in over time.",
        ],
      },
      {
        title: "Regional variations",
        body: [
          "On some tracks, an answer may show a small card noting how that word changes from country to country and region to region — it highlights the form used where you’re from and shows how it’s said elsewhere. It’s a bonus note, never a change to the right answer.",
        ],
      },
      {
        title: "Playing a round",
        body: [
          "Each round mixes several question types — you’ll see a colored tag on each question card showing which type it is.",
          "You get a set number of seconds per question (adjustable in Settings → Gameplay), no penalty for wrong answers — just answer and move on. A combo counter (⚡) builds as you chain correct answers in a row, and resets on a miss with no other penalty.",
          "*Phonetics questions* show a written respelling of how a phrase sounds (CAPS = stressed syllable, ‿ = words that blend together in fast speech) instead of real audio, so it works everywhere without needing sound.",
          "*Question audio*: on the tracks where audio has been recorded so far, a speaker button appears beside the question — tap to hear it read aloud in the track’s own dialect, tap again to stop. It never plays on its own, and the timer keeps running while it plays. All speaker buttons can be turned off in Settings → Gameplay.",
          "Right and wrong answers are deliberately hard to miss — a green pulse for correct, a red shake for wrong.",
        ],
      },
      {
        title: "The “Heads up” when you miss one",
        body: [
          "Miss a question and, on top of the explanation, you get a quick *💡 Heads up* that does two things: it names the rule the question was testing, _and_ it speaks to the specific option *you* picked — why that form is wrong, or what it actually means — so a wrong tap becomes a mini-lesson instead of just a red mark. It shows most fully in *Review mode* (below), where the card waits for you before moving on.",
        ],
      },
      {
        title: "Tense hints on verb questions",
        body: [
          "On conjugation questions, a small *🎯 target chip* names the tense and person the answer needs, with a one-line reason why — training wheels so you can focus on getting the form right while you’re still learning it. They’re on by default. Once you reach an advanced level the chip offers a dismiss button, and you can also turn them off in Settings → Gameplay.",
          "For German, Russian, Japanese, Korean, and Mandarin, the verb questions themselves are generated by in-house grammar engines, so the forms are correct by construction rather than hand-typed.",
        ],
      },
      {
        title: "Review mode",
        body: [
          "Turn this on in Settings → Gameplay to pause after each answer, read the explanation right there on the card, and tap “Next” whenever you’re ready — instead of auto-advancing after less than a second.",
        ],
      },
      {
        title: "Missed questions & review",
        body: [
          "Anything you get wrong gets added to a “Review mistakes” pile, shown on the start screen. Practicing that pile removes each question once you get it right — no time pressure, since it’s about closing gaps, not speed.",
        ],
      },
      {
        title: "Explanations & archive",
        body: [
          "Every question you’ve ever answered — right or wrong — gets logged with an explanation of the correct answer, viewable anytime from the round-result screen. Explanations show in your native language (falling back to English where a translation isn’t written yet), and while you’re at No experience, Beginner, or Intermediate you also get the explanation in the language you’re learning — so you pick up the phrasing in context. Target-language explanations are being added track by track. Older entries move to an “Archive” section automatically so the main list stays fast to scroll — nothing is ever deleted unless you choose to clear it.",
        ],
      },
      {
        title: "Mastery tracker",
        body: [
          "Each language’s start screen has a “Progress by category” card — tap “View details” to see how many items you’ve learned vs. the total that exist for each category, plus a breakdown by difficulty level so progress shows in smaller chunks instead of one big number. “Learned” means you’ve seen it and it’s not currently sitting in your missed-questions pile. Note: the total is based on this app’s own content for that track, not an external word-frequency list — starter-set tracks will show smaller totals until more content gets added.",
        ],
      },
      {
        title: "Skill levels & placement quiz",
        body: [
          "Each language track has its own skill level: No experience, Beginner, Intermediate, Advanced, or Native — based on the real CEFR framework used by actual language certifications. Rounds are biased toward questions matching your level, without ever running short on content.",
          "Answer consistently well at your current level and you’ll be offered a chance to advance. Not sure where you stand? Take the short, untimed *placement quiz* from that language’s start screen — it samples questions across all six CEFR tiers (A1 through C2) that the track has content for, so it can place true beginners and advanced learners accurately, not just people in the middle.",
        ],
      },
      {
        title: "Grammar Gym",
        body: [
          "Tracks with a conjugation module get a *Grammar Gym* segment in the mode switch — a standalone place to drill verbs. It has two parts: a *Learn* view with reference charts (each verb laid out across its tenses and forms) and a *Practice* view that quizzes you on those forms in short 10-question drills. You can narrow to a single verb group to focus on one pattern at a time.",
          "It’s deliberately walled off from the rest of the app: its progress is kept on its own and never touches your level, XP, streak, or mastery — so drill as much (or as little) as you like, with nothing to lose either way.",
        ],
      },
      {
        title: "Alphabet / writing-system mode",
        body: [
          "Tracks whose language uses a different writing system get an *Alphabet* mode in the switch next to Quick Quiz and Lessons. Japanese gets hiragana and katakana, Korean gets hangul (with a sampler of real syllable blocks), Russian gets Cyrillic (grouped by how letters relate to the Latin alphabet — false friends defused early), and Mandarin gets a foundational character set with pinyin and meanings. Each offers full reference charts plus short practice quizzes in both directions (see the symbol, pick the sound — and vice versa). It’s entirely optional and never required: no timer, no XP, nothing to lose. Symbols you’ve answered correctly show green in the charts so you can watch the unfamiliar ones shrink. Japanese kanji isn’t part of this (that’s a much longer journey) — every question in the app shows romanized readings alongside, so these basics are all you need to play.",
        ],
      },
      {
        title: "Gameplay settings",
        body: [
          "In Settings → Gameplay: turn review mode on/off, adjust how many questions come from each category per round, how many phonetics pairs appear, and the per-question timer — either one shared time limit or separate limits for regular questions vs. phonetics — turn question audio on or off, and switch off the tense hints on verb questions once you’ve outgrown them.",
        ],
      },
      {
        title: "“Community review in progress” notes",
        body: [
          "A lot of content was built quickly, and some tracks are still waiting on a native-speaker check. Rather than hide that, a small *Community review in progress* badge appears on those language bubbles (and their start screens), so you always know which tracks have been human-reviewed and which haven’t yet. The badge quietly disappears once a track’s review is logged.",
        ],
      },
      {
        title: "Feedback",
        body: [
          "Found a bug? Settings → “Report a bug” — a quick one-box form where you can also attach a screenshot and an error code (if something crashes, the error screen shows a code like SQ-XXXXXX; the form fills it in for you automatically). Have an idea instead? Settings → “Suggest a feature”. Both go straight to the developer, no external site required. Know someone who’d like to help test? They can apply at /beta-apply (about 3 minutes), no account needed.",
          "There’s also a {{fb|SquirreLingo Facebook group}} for release news and community chat — private during the beta, so request to join and you’ll be approved.",
        ],
      },
      {
        title: "Account & security",
        body: [
          "Sign in with either your email or username. Changing your email or password requires re-entering your current password first, and changing your password automatically signs out any other devices you’re logged into, for security. You’ll also get an email notification whenever your username, email, or password changes.",
          "Forgot your password? The reset page walks you through your security questions — answer 2 of 3 correctly and you can set a new password on the spot. Set them up (plus an optional password hint) in Settings → Password recovery, or when you first apply for the beta. Without questions on file, resets go through an admin request instead, which can take a while — setting up the questions is strongly recommended.",
        ],
      },
    ],
  },
  es: {
    title: "Cómo funciona SquirreLingo",
    crossref: "¿Buscas una visión más general? Mira la {{about|página Acerca de}}.",
    sections: [
      {
        title: "Encontrar la Ayuda y el menú",
        body: [
          "El botón *?* en la esquina superior derecha de la pantalla de inicio abre esta página de Ayuda cuando quieras — está ahí a la vista para que nunca tengas que salir a buscarla.",
          "Al lado, tu *foto de perfil* abre un menú lateral con todo lo demás: *Novedades* (aparece un punto cuando hay una versión nueva que aún no has visto), *Cómo usar SquirreLingo* (el mismo recorrido animado que viste la primera vez que entraste — ábrelo cuando quieras) y *Acerca de* (qué es la app, cómo funcionan los modos y qué viene después). Debajo de un divisor está también toda la sección de *Ajustes* — nombre de usuario, correo, contraseña, idioma y país nativo, foto de perfil, preferencias de juego — sin ningún toque extra para abrirla. Todo este menú y cada etiqueta de Ajustes aparecen en tu idioma nativo.",
        ],
      },
      {
        title: "SquirreLingo en tu idioma",
        body: [
          "SquirreLingo no solo enseña en tu idioma — *la app misma se adapta a él*. Donde tu idioma nativo esté disponible, toda la interfaz lo sigue: las pantallas de iniciar sesión y registrarse, la recuperación de contraseña, la configuración inicial la primera vez, el menú lateral y cada etiqueta de Ajustes, el formulario para la beta y todo lo que pasa dentro de una ronda — subtítulos, opciones de respuesta, explicaciones y el Banco de Palabras.",
          "La app *elige tu idioma automáticamente* desde tu navegador la primera vez que entras, así que no tienes que configurar nada. ¿Prefieres otro? Una pequeña *pastilla 🌐 de idioma* está en la esquina de cada pantalla antes de iniciar sesión — tócala para cambiar cuando quieras, y tu elección se guarda.",
          "Con el tiempo se irán agregando más idiomas de interfaz, y la cobertura se amplía a medida que se completa el contenido en cada idioma nativo. Algunos rincones siguen en inglés para todo el mundo — la página del *Grammar Gym* y algunas pantallas de estado y de error — y son lo siguiente en la lista. El recorrido *Cómo usar SquirreLingo* ya no es uno de ellos: ahora también sigue tu idioma.",
        ],
      },
      {
        title: "Elegir qué aprender",
        body: [
          "Tu *idioma nativo* (que defines en Ajustes) decide qué idiomas aparecen como burbujas para aprender — verás los idiomas que puedes aprender desde el tuyo, y con el tiempo se agregan más pares de idiomas. El nombre de cada burbuja también aparece en tu idioma nativo (por ejemplo, verías “Alemán” y no “Deutsch”) — no hace falta reconocer un idioma por su bandera o por su nombre en su propia escritura. Tu *país de origen* es aparte — solo personaliza la insignia en la fila de íconos de arriba.",
          "Cada burbuja de idioma muestra tu nivel actual y tu progreso de XP hacia el siguiente. Toca cualquier burbuja para empezar a practicar ese idioma — el progreso se guarda por separado para cada idioma.",
        ],
      },
      {
        title: "Formas de practicar: Quiz Rápido, Lecciones y más",
        body: [
          "*Quiz Rápido* es el modo original tipo juego — rondas cortas y mezcladas al azar, con cronómetro, puntos por combo y rachas. *Lecciones* es una alternativa más tranquila — sin cronómetro ni presión de combo, avanzando por un tema a la vez (lo más fácil primero) y mostrando la explicación justo después de cada respuesta. Un interruptor segmentado cerca de la parte de arriba de la pantalla de inicio de cualquiera de los dos modos te deja alternar entre ellos — ambos suman al mismo XP, nivel y progreso de dominio, así que no pierdes nada al cambiar.",
          "En los cursos que los tienen, ese mismo interruptor incluye dos segmentos más: un modo *Alfabeto* para idiomas con su propia escritura, y el *Gimnasio de Gramática*, un entrenador de conjugación independiente. Ambos se explican en sus propias secciones más abajo, y cada uno guarda su progreso por separado.",
        ],
      },
      {
        title: "Escuchar y Hablar (próximamente)",
        body: [
          "Encima del selector Quiz Rápido / Lecciones también verás un interruptor *Practicar / Escuchar / Hablar*. Practicar es todo lo que la app hace hoy. La práctica de escuchar y hablar aún no está lista — esas dos pestañas dicen “Pronto” y por ahora abren una breve página de Próximamente, para que veas hacia dónde va la app. La página Acerca de tiene una lista más completa de “Qué viene”.",
        ],
      },
      {
        title: "Selector de categorías (modo Quiz Rápido)",
        body: [
          "Antes de empezar una ronda, combina las categorías que quieras para enfocarte (vocabulario, gramática, traducción, fonética — el subconjunto que sea), o déjalo en la opción “Mixto” para la mezcla predeterminada de todo (su etiqueta aparece en el idioma en el que estén tus otros botones en ese momento). Elegirla borra cualquier selección específica y vuelve a la mezcla completa. En el modo Lecciones eliges un tema a la vez — mira la explicación de los modos más arriba.",
          "Algunos cursos también incluyen una categoría de *Banco de Palabras* — una gran capa de las palabras más frecuentes del idioma. Se une a la mezcla como cualquier otra categoría, pero la mezcla predeterminada limita cuánto de una ronda puede ocupar, para que nunca les quite espacio a la gramática, las expresiones o la fonética.",
        ],
      },
      {
        title: "Practicar por tema",
        body: [
          "Junto al selector de categorías, una fila de *Enfocar por tema* te deja practicar un solo tema — viajes, comida, trabajo, etc. — tomado de todas las categorías a la vez. Déjalo en *Todos los temas* para la mezcla de siempre.",
          "Un tema y un enfoque de categoría se *combinan* cuando eliges los dos — por ejemplo, solo las preguntas de gramática dentro del tema “viajes”. Si esa combinación en particular tiene muy pocos elementos para llenar una ronda completa, la app te avisa de una vez en lugar de darte a escondidas una ronda de un solo elemento.",
        ],
      },
      {
        title: "La interfaz cambia según tu nivel",
        body: [
          "En la página de juego de cada idioma, los botones, etiquetas y estadísticas en pantalla aparecen en tu *idioma nativo* mientras estás en Sin experiencia, Principiante o Intermedio — no hace falta leer instrucciones en un idioma que todavía no dominas. Cuando llegas a Avanzado o Nativo, esa misma interfaz cambia al *idioma que estás aprendiendo*, porque para entonces leerlo ya es buena práctica.",
          "Las preguntas mismas siguen la misma regla donde está disponible: la pregunta aparece en el idioma que estás aprendiendo, con una pequeña *traducción en tu idioma nativo* justo debajo mientras estás en los niveles más bajos — así siempre sabes qué se te pregunta sin que la traducción te delate la respuesta. En Avanzado/Nativo el subtítulo desaparece junto con el resto de la interfaz en tu idioma. Toda esta capa — los subtítulos, la interfaz en pantalla, las opciones de respuesta y el Banco de Palabras — se adapta a tu idioma nativo donde ese contenido existe, y se van sumando más idiomas nativos con el tiempo.",
        ],
      },
      {
        title: "Variaciones regionales",
        body: [
          "En algunos cursos, una respuesta puede mostrar una pequeña tarjeta que describe cómo cambia esa palabra de país a país y de región a región — resalta la forma que se usa donde tú estás y muestra cómo se dice en otros lados. Es una nota extra, nunca un cambio en la respuesta correcta.",
        ],
      },
      {
        title: "Jugar una ronda",
        body: [
          "Cada ronda mezcla varios tipos de pregunta — verás una etiqueta de color en cada tarjeta de pregunta que indica de qué tipo es.",
          "Tienes un número fijo de segundos por pregunta (ajustable en Ajustes → Juego), sin penalización por respuestas incorrectas — solo responde y sigue. Un contador de combo (⚡) va subiendo mientras encadenas respuestas correctas seguidas, y se reinicia al fallar, sin ninguna otra penalización.",
          "Las *preguntas de fonética* muestran una reescritura de cómo suena una frase (MAYÚSCULAS = sílaba con más fuerza, ‿ = palabras que se unen al hablar rápido) en lugar de audio real, así funcionan en cualquier lado sin necesidad de sonido.",
          "*Audio de las preguntas*: en los cursos donde se ha grabado audio hasta ahora, aparece un botón de altavoz junto a la pregunta — tócalo para escucharla en voz alta en el propio dialecto del curso, tócalo de nuevo para detenerla. Nunca se reproduce solo, y el cronómetro sigue corriendo mientras suena. Todos los botones de altavoz se pueden desactivar en Ajustes → Juego.",
          "Las respuestas correctas e incorrectas son a propósito difíciles de pasar por alto — un pulso verde si aciertas, una sacudida roja si fallas.",
        ],
      },
      {
        title: "El “Ojo” cuando fallas una",
        body: [
          "Cuando fallas una pregunta, además de la explicación recibes un breve *💡 Ojo* que hace dos cosas: nombra la regla que la pregunta estaba evaluando _y_ habla de la opción específica que *tú* elegiste — por qué esa forma está mal, o qué significa en realidad — así un toque equivocado se vuelve una mini lección en lugar de solo una marca roja. Se muestra de forma más completa en el *modo Repaso* (abajo), donde la tarjeta te espera antes de seguir.",
        ],
      },
      {
        title: "Pistas de tiempo verbal en las preguntas de verbos",
        body: [
          "En las preguntas de conjugación, una pequeña *ficha 🎯* indica el tiempo y la persona que necesita la respuesta, con una razón de una línea — unas rueditas de apoyo para que te concentres en acertar la forma mientras todavía la estás aprendiendo. Vienen activadas por defecto. Cuando llegas a un nivel avanzado, la ficha te ofrece un botón para descartarla, y también puedes desactivarlas en Ajustes → Juego.",
          "Para alemán, ruso, japonés, coreano y mandarín, las preguntas de verbos las generan motores de gramática propios, así que las formas son correctas por construcción y no escritas a mano.",
        ],
      },
      {
        title: "Modo Repaso",
        body: [
          "Actívalo en Ajustes → Juego para pausar después de cada respuesta, leer la explicación ahí mismo en la tarjeta y tocar “Siguiente” cuando estés listo — en lugar de avanzar solo en menos de un segundo.",
        ],
      },
      {
        title: "Preguntas falladas y repaso",
        body: [
          "Todo lo que fallas se agrega a una pila de “Repasar fallos”, que aparece en la pantalla de inicio. Al practicar esa pila, cada pregunta se elimina en cuanto la aciertas — sin presión de tiempo, porque se trata de cerrar brechas, no de velocidad.",
        ],
      },
      {
        title: "Explicaciones y archivo",
        body: [
          "Cada pregunta que has respondido — bien o mal — queda registrada con una explicación de la respuesta correcta, que puedes ver cuando quieras desde la pantalla de resultados de la ronda. Las explicaciones aparecen en tu idioma nativo (y en inglés donde aún no hay traducción escrita), y mientras estás en Sin experiencia, Principiante o Intermedio también recibes la explicación en el idioma que estás aprendiendo — así captas la forma de decir las cosas en contexto. Las explicaciones en el idioma que aprendes se van agregando curso por curso. Las entradas más antiguas pasan solas a una sección de “Archivo” para que la lista principal siga siendo rápida de recorrer — nunca se borra nada a menos que tú decidas limpiarlo.",
        ],
      },
      {
        title: "Medidor de dominio",
        body: [
          "La pantalla de inicio de cada idioma tiene una tarjeta de “Progreso por categoría” — toca “Ver detalles” para ver cuántos elementos has aprendido frente al total que existe en cada categoría, además de un desglose por nivel de dificultad para que el progreso se vea en trozos más pequeños en lugar de un solo número grande. “Aprendido” significa que ya lo viste y que no está en tu pila de preguntas falladas. Nota: el total se basa en el propio contenido de esta app para ese curso, no en una lista externa de frecuencia de palabras — los cursos que recién empiezan mostrarán totales más pequeños hasta que se agregue más contenido.",
        ],
      },
      {
        title: "Niveles y prueba de nivel",
        body: [
          "Cada curso de idioma tiene su propio nivel: Sin experiencia, Principiante, Intermedio, Avanzado o Nativo — basado en el marco real MCER que usan las certificaciones de idiomas de verdad. Las rondas se inclinan hacia preguntas acordes a tu nivel, sin quedarse nunca sin contenido.",
          "Responde bien de forma constante en tu nivel actual y se te ofrecerá la oportunidad de subir. ¿No sabes en qué nivel estás? Haz la *prueba de nivel*, corta y sin cronómetro, desde la pantalla de inicio de ese idioma — toma preguntas de los seis niveles del MCER (de A1 a C2) para los que el curso tiene contenido, así puede ubicar bien tanto a principiantes de verdad como a estudiantes avanzados, y no solo a quienes están en el medio.",
        ],
      },
      {
        title: "Gimnasio de Gramática",
        body: [
          "Los cursos con módulo de conjugación tienen un segmento de *Gimnasio de Gramática* en el selector de modos — un lugar aparte para practicar verbos. Tiene dos partes: una vista de *Aprender* con tablas de referencia (cada verbo desplegado en sus tiempos y formas) y una vista de *Practicar* que te evalúa esas formas en ejercicios cortos de 10 preguntas. Puedes limitarlo a un solo grupo de verbos para concentrarte en un patrón a la vez.",
          "Está separado a propósito del resto de la app: su progreso se guarda por su cuenta y nunca afecta tu nivel, XP, racha ni dominio — así practica todo lo que quieras (o lo poco que quieras), sin nada que perder en ningún caso.",
        ],
      },
      {
        title: "Modo Alfabeto / sistema de escritura",
        body: [
          "Los cursos cuyo idioma usa una escritura diferente tienen un modo *Alfabeto* en el selector, junto a Quiz Rápido y Lecciones. El japonés trae hiragana y katakana, el coreano trae hangul (con una muestra de bloques silábicos reales), el ruso trae cirílico (agrupado según cómo se relacionan las letras con el alfabeto latino — los falsos amigos se desactivan desde temprano), y el mandarín trae un conjunto básico de caracteres con pinyin y significados. Cada uno ofrece tablas de referencia completas más ejercicios cortos en ambos sentidos (ves el símbolo, eliges el sonido — y al revés). Es totalmente opcional y nunca obligatorio: sin cronómetro, sin XP, nada que perder. Los símbolos que has acertado se ven verdes en las tablas, así ves cómo se van reduciendo los que aún no conoces. El kanji japonés no entra aquí (ese es un camino mucho más largo) — cada pregunta en la app muestra al lado las lecturas romanizadas, así que con estas bases te alcanza para jugar.",
        ],
      },
      {
        title: "Ajustes de juego",
        body: [
          "En Ajustes → Juego: activa o desactiva el modo Repaso, ajusta cuántas preguntas salen de cada categoría por ronda, cuántos pares de fonética aparecen y el cronómetro por pregunta — ya sea un solo límite de tiempo compartido o límites separados para las preguntas normales y las de fonética — activa o desactiva el audio de las preguntas, y quita las pistas de tiempo verbal en las preguntas de verbos cuando ya no las necesites.",
        ],
      },
      {
        title: "Avisos de “Revisión comunitaria en curso”",
        body: [
          "Mucho contenido se creó rápido, y algunos cursos todavía esperan la revisión de un hablante nativo. En lugar de ocultarlo, aparece una pequeña insignia de *Revisión comunitaria en curso* en esas burbujas de idioma (y en sus pantallas de inicio), así siempre sabes qué cursos ya revisó una persona y cuáles todavía no. La insignia desaparece discretamente en cuanto se registra la revisión de un curso.",
        ],
      },
      {
        title: "Comentarios",
        body: [
          "¿Encontraste un error? Ajustes → “Reportar un error” — un formulario rápido de una sola casilla donde también puedes adjuntar una captura y un código de error (si algo falla, la pantalla de error muestra un código como SQ-XXXXXX; el formulario lo completa por ti automáticamente). ¿Tienes una idea? Ajustes → “Sugerir una función”. Ambos llegan directo al desarrollador, sin necesidad de ningún sitio externo. ¿Conoces a alguien que quiera ayudar a probar? Puede postularse en /beta-apply (unos 3 minutos), sin necesidad de cuenta.",
          "También hay un {{fb|grupo de SquirreLingo en Facebook}} para noticias de versiones y charla de la comunidad — es privado durante la beta, así que pide unirte y te aprobarán.",
        ],
      },
      {
        title: "Cuenta y seguridad",
        body: [
          "Inicia sesión con tu correo o con tu nombre de usuario. Para cambiar tu correo o tu contraseña primero tienes que volver a ingresar tu contraseña actual, y al cambiar la contraseña se cierra sesión automáticamente en cualquier otro dispositivo donde estés conectado, por seguridad. También recibirás un aviso por correo cada vez que cambien tu nombre de usuario, tu correo o tu contraseña.",
          "¿Olvidaste tu contraseña? La página de restablecimiento te guía por tus preguntas de seguridad — responde 2 de 3 correctamente y puedes poner una contraseña nueva al instante. Configúralas (más una pista de contraseña opcional) en Ajustes → Recuperación de contraseña, o cuando te postulas por primera vez a la beta. Sin preguntas guardadas, los restablecimientos pasan por una solicitud al administrador, lo que puede tardar — se recomienda mucho configurar las preguntas.",
        ],
      },
    ],
  },
  pt: {
    title: "Como o SquirreLingo funciona",
    crossref: "Procurando uma visão mais geral? Veja a {{about|página Sobre}}.",
    sections: [
      {
        title: "Encontrar a Ajuda e o menu",
        body: [
          "O botão *?* no canto superior direito da tela inicial abre esta página de Ajuda quando você quiser — está bem à vista, para você nunca precisar sair procurando por ela.",
          "Ao lado, sua *foto de perfil* abre um menu lateral com todo o resto: *Novidades* (aparece um ponto quando há uma versão nova que você ainda não viu), *Como usar o SquirreLingo* (o mesmo tour animado que você viu na primeira vez que entrou — abra quando quiser) e *Sobre* (o que é o app, como os modos funcionam e o que vem a seguir). Abaixo de um divisor está também toda a seção de *Configurações* — nome de usuário, e-mail, senha, idioma e país nativo, foto de perfil, preferências de jogo — sem nenhum toque extra para abrir. Todo esse menu e cada rótulo das Configurações aparecem no seu idioma nativo.",
        ],
      },
      {
        title: "O SquirreLingo no seu idioma",
        body: [
          "O SquirreLingo não só ensina no seu idioma — *o próprio app se adapta a ele*. Onde o seu idioma nativo estiver disponível, toda a interface o segue: as telas de entrar e cadastrar, a recuperação de senha, a configuração inicial na primeira vez, o menu lateral e cada rótulo das Configurações, o formulário da beta e tudo o que acontece dentro de uma rodada — legendas, opções de resposta, explicações e o Banco de Palavras.",
          "O app *escolhe o seu idioma automaticamente* a partir do seu navegador na primeira vez que você entra, então não há nada para configurar. Prefere outro? Uma pequena *pílula 🌐 de idioma* fica no canto de cada tela antes de você entrar — toque nela para trocar quando quiser, e a sua escolha fica salva.",
          "Com o tempo, mais idiomas de interface vão sendo adicionados, e a cobertura se amplia à medida que o conteúdo em cada idioma nativo vai sendo preenchido. Alguns cantos ainda estão em inglês para todo mundo — a página do *Grammar Gym* e algumas telas de status e de erro — e são os próximos da lista. O tour *Como usar o SquirreLingo* já não é um deles: agora ele também segue o seu idioma.",
        ],
      },
      {
        title: "Escolher o que aprender",
        body: [
          "Seu *idioma nativo* (definido nas Configurações) decide quais idiomas aparecem como bolhas para aprender — você verá os idiomas que pode aprender a partir do seu, e com o tempo mais pares de idiomas vão sendo adicionados. O nome de cada bolha também aparece no seu idioma nativo (por exemplo, você veria “Alemão” e não “Deutsch”) — não precisa reconhecer um idioma pela bandeira ou pelo nome na própria escrita. Seu *país de origem* é à parte — só personaliza a insígnia na fileira de ícones de cima.",
          "Cada bolha de idioma mostra o seu nível atual e o seu progresso de XP rumo ao próximo. Toque em qualquer bolha para começar a praticar aquele idioma — o progresso é salvo separadamente para cada idioma.",
        ],
      },
      {
        title: "Formas de praticar: Quiz Rápido, Lições e mais",
        body: [
          "*Quiz Rápido* é o modo original, estilo jogo — rodadas curtas e misturadas ao acaso, com cronômetro, pontos por combo e sequências. *Lições* é uma alternativa mais tranquila — sem cronômetro nem pressão de combo, avançando por um tema de cada vez (o mais fácil primeiro) e mostrando a explicação logo depois de cada resposta. Um seletor segmentado perto do topo da tela inicial de qualquer um dos modos deixa você alternar entre eles — os dois somam para o mesmo XP, nível e progresso de domínio, então você não perde nada ao trocar.",
          "Nos cursos que os têm, esse mesmo seletor inclui mais dois segmentos: um modo *Alfabeto* para idiomas com a própria escrita, e a *Academia de Gramática*, um treinador de conjugação independente. Os dois são explicados nas próprias seções mais abaixo, e cada um guarda o seu progresso separadamente.",
        ],
      },
      {
        title: "Ouvir e Falar (em breve)",
        body: [
          "Acima do seletor Quiz Rápido / Lições você também verá um interruptor *Praticar / Ouvir / Falar*. Praticar é tudo o que o app faz hoje. A prática de ouvir e falar ainda não está pronta — essas duas abas dizem “Em breve” e por ora abrem uma breve página de Em breve, para você ver para onde o app está indo. A página Sobre tem uma lista mais completa de “O que vem a seguir”.",
        ],
      },
      {
        title: "Seletor de categorias (modo Quiz Rápido)",
        body: [
          "Antes de começar uma rodada, combine as categorias que quiser para focar (vocabulário, gramática, tradução, fonética — o subconjunto que for), ou deixe na opção “Misto” para a mistura padrão de tudo (o rótulo dela aparece no idioma em que os seus outros botões estiverem no momento). Escolhê-la apaga qualquer seleção específica e volta para a mistura completa. No modo Lições você escolhe um tema de cada vez — veja a explicação dos modos mais acima.",
          "Alguns cursos também incluem uma categoria de *Banco de Palavras* — uma grande camada das palavras mais frequentes do idioma. Ela entra na mistura como qualquer outra categoria, mas a mistura padrão limita quanto de uma rodada ela pode ocupar, para nunca tirar espaço da gramática, das expressões ou da fonética.",
        ],
      },
      {
        title: "Praticar por tema",
        body: [
          "Ao lado do seletor de categorias, uma fileira de *Focar por tema* deixa você praticar um único tema — viagens, comida, trabalho, etc. — puxado de todas as categorias ao mesmo tempo. Deixe em *Todos os temas* para a mistura de sempre.",
          "Um tema e um foco de categoria se *combinam* quando você escolhe os dois — por exemplo, só as perguntas de gramática dentro do tema “viagens”. Se essa combinação em particular tiver poucos itens para preencher uma rodada completa, o app avisa você de cara, em vez de servir sem avisar uma rodada de um único item.",
        ],
      },
      {
        title: "A interface muda conforme o seu nível",
        body: [
          "Na página de jogo de cada idioma, os botões, rótulos e estatísticas na tela aparecem no seu *idioma nativo* enquanto você está em Sem experiência, Iniciante ou Intermediário — não precisa ler instruções em um idioma que você ainda não domina. Quando você chega a Avançado ou Nativo, essa mesma interface muda para o *idioma que você está aprendendo*, porque a essa altura lê-lo já é uma boa prática.",
          "As próprias perguntas seguem a mesma regra onde isso está disponível: a pergunta aparece no idioma que você está aprendendo, com uma pequena *tradução no seu idioma nativo* logo abaixo enquanto você está nos níveis mais baixos — assim você sempre sabe o que está sendo perguntado sem que a tradução entregue a resposta. Em Avançado/Nativo a legenda desaparece junto com o resto da interface no seu idioma. Toda essa camada — as legendas, a interface na tela, as opções de resposta e o Banco de Palavras — se adapta ao seu idioma nativo onde esse conteúdo existe, e mais idiomas nativos vão sendo somados com o tempo.",
        ],
      },
      {
        title: "Variações regionais",
        body: [
          "Em alguns cursos, uma resposta pode mostrar um pequeno cartão que descreve como aquela palavra muda de país para país e de região para região — ele destaca a forma usada de onde você é e mostra como se diz em outros lugares. É uma nota extra, nunca uma mudança na resposta correta.",
        ],
      },
      {
        title: "Jogar uma rodada",
        body: [
          "Cada rodada mistura vários tipos de pergunta — você verá uma etiqueta colorida em cada cartão de pergunta indicando de que tipo ela é.",
          "Você tem um número fixo de segundos por pergunta (ajustável em Configurações → Jogo), sem punição por respostas erradas — é só responder e seguir. Um contador de combo (⚡) vai subindo enquanto você encadeia respostas certas em seguida, e reinicia ao errar, sem nenhuma outra punição.",
          "As *perguntas de fonética* mostram uma reescrita de como uma frase soa (MAIÚSCULAS = sílaba mais forte, ‿ = palavras que se juntam ao falar rápido) em vez de áudio de verdade, então funcionam em qualquer lugar sem precisar de som.",
          "*Áudio das perguntas*: nos cursos em que o áudio já foi gravado até agora, aparece um botão de alto-falante ao lado da pergunta — toque para ouvi-la em voz alta no próprio dialeto do curso, toque de novo para parar. Ele nunca toca sozinho, e o cronômetro continua correndo enquanto o áudio toca. Todos os botões de alto-falante podem ser desativados em Configurações → Jogo.",
          "As respostas certas e erradas são de propósito difíceis de não notar — um pulso verde quando você acerta, um tremor vermelho quando erra.",
        ],
      },
      {
        title: "O “Fica ligado” quando você erra uma",
        body: [
          "Quando você erra uma pergunta, além da explicação você recebe um breve *💡 Fica ligado* que faz duas coisas: nomeia a regra que a pergunta estava avaliando _e_ fala da opção específica que *você* escolheu — por que aquela forma está errada, ou o que ela significa de verdade — assim um toque errado vira uma miniaula em vez de só uma marca vermelha. Ele aparece de forma mais completa no *modo Revisão* (abaixo), onde o cartão espera por você antes de seguir.",
        ],
      },
      {
        title: "Dicas de tempo verbal nas perguntas de verbos",
        body: [
          "Nas perguntas de conjugação, uma pequena *ficha 🎯* indica o tempo e a pessoa que a resposta precisa, com um motivo de uma linha — umas rodinhas de apoio para você se concentrar em acertar a forma enquanto ainda está aprendendo. Vêm ativadas por padrão. Quando você chega a um nível avançado, a ficha oferece um botão para descartá-la, e você também pode desativá-las em Configurações → Jogo.",
          "Para alemão, russo, japonês, coreano e mandarim, as perguntas de verbos são geradas por motores de gramática próprios, então as formas são corretas por construção e não digitadas à mão.",
        ],
      },
      {
        title: "Modo Revisão",
        body: [
          "Ative-o em Configurações → Jogo para pausar depois de cada resposta, ler a explicação ali mesmo no cartão e tocar “Próxima” quando estiver pronto — em vez de avançar sozinho em menos de um segundo.",
        ],
      },
      {
        title: "Perguntas erradas e revisão",
        body: [
          "Tudo o que você erra é adicionado a uma pilha de “Revisar erros”, que aparece na tela inicial. Ao praticar essa pilha, cada pergunta é removida assim que você acerta — sem pressão de tempo, porque o objetivo é fechar lacunas, não velocidade.",
        ],
      },
      {
        title: "Explicações e arquivo",
        body: [
          "Cada pergunta que você respondeu — certa ou errada — fica registrada com uma explicação da resposta correta, que você pode ver quando quiser na tela de resultados da rodada. As explicações aparecem no seu idioma nativo (e em inglês onde ainda não há tradução escrita), e enquanto você está em Sem experiência, Iniciante ou Intermediário você também recebe a explicação no idioma que está aprendendo — assim você capta o jeito de dizer as coisas no contexto. As explicações no idioma que você aprende vão sendo adicionadas curso por curso. As entradas mais antigas passam sozinhas para uma seção de “Arquivo” para a lista principal continuar rápida de percorrer — nada é apagado a menos que você decida limpar.",
        ],
      },
      {
        title: "Medidor de domínio",
        body: [
          "A tela inicial de cada idioma tem um cartão de “Progresso por categoria” — toque em “Ver detalhes” para ver quantos itens você já aprendeu em relação ao total que existe em cada categoria, além de um detalhamento por nível de dificuldade, para o progresso aparecer em pedaços menores em vez de um único número grande. “Aprendido” significa que você já viu e que não está na sua pilha de perguntas erradas. Observação: o total se baseia no próprio conteúdo deste app para aquele curso, não em uma lista externa de frequência de palavras — os cursos que estão começando mostrarão totais menores até que mais conteúdo seja adicionado.",
        ],
      },
      {
        title: "Níveis e teste de nivelamento",
        body: [
          "Cada curso de idioma tem o próprio nível: Sem experiência, Iniciante, Intermediário, Avançado ou Nativo — baseado no verdadeiro quadro QECR usado pelas certificações de idiomas de verdade. As rodadas pendem para perguntas de acordo com o seu nível, sem nunca ficar sem conteúdo.",
          "Responda bem de forma constante no seu nível atual e você receberá a chance de subir. Não sabe em que nível está? Faça o *teste de nivelamento*, curto e sem cronômetro, na tela inicial daquele idioma — ele pega perguntas dos seis níveis do QECR (de A1 a C2) para os quais o curso tem conteúdo, assim consegue posicionar bem tanto iniciantes de verdade quanto estudantes avançados, e não só quem está no meio.",
        ],
      },
      {
        title: "Academia de Gramática",
        body: [
          "Os cursos com módulo de conjugação ganham um segmento de *Academia de Gramática* no seletor de modos — um lugar à parte para praticar verbos. Tem duas partes: uma visão de *Aprender* com tabelas de referência (cada verbo distribuído nos seus tempos e formas) e uma visão de *Praticar* que testa você nessas formas em exercícios curtos de 10 perguntas. Você pode restringir a um único grupo de verbos para se concentrar em um padrão de cada vez.",
          "Ele fica separado de propósito do resto do app: o progresso dele é guardado por conta própria e nunca afeta o seu nível, XP, sequência nem domínio — então pratique o quanto quiser (ou o pouco que quiser), sem nada a perder de qualquer jeito.",
        ],
      },
      {
        title: "Modo Alfabeto / sistema de escrita",
        body: [
          "Os cursos cujo idioma usa uma escrita diferente ganham um modo *Alfabeto* no seletor, ao lado do Quiz Rápido e das Lições. O japonês traz hiragana e katakana, o coreano traz hangul (com uma amostra de blocos silábicos reais), o russo traz o cirílico (agrupado conforme as letras se relacionam com o alfabeto latino — os falsos amigos são neutralizados cedo), e o mandarim traz um conjunto básico de caracteres com pinyin e significados. Cada um oferece tabelas de referência completas mais exercícios curtos nos dois sentidos (você vê o símbolo, escolhe o som — e ao contrário). É totalmente opcional e nunca obrigatório: sem cronômetro, sem XP, nada a perder. Os símbolos que você acertou ficam verdes nas tabelas, assim você vê os que ainda não conhece irem diminuindo. O kanji japonês não entra aqui (esse é um caminho bem mais longo) — cada pergunta no app mostra ao lado as leituras romanizadas, então com essas bases já dá para jogar.",
        ],
      },
      {
        title: "Configurações de jogo",
        body: [
          "Em Configurações → Jogo: ative ou desative o modo Revisão, ajuste quantas perguntas saem de cada categoria por rodada, quantos pares de fonética aparecem e o cronômetro por pergunta — seja um único limite de tempo compartilhado ou limites separados para as perguntas normais e as de fonética — ative ou desative o áudio das perguntas, e tire as dicas de tempo verbal nas perguntas de verbos quando você já não precisar delas.",
        ],
      },
      {
        title: "Avisos de “Revisão comunitária em andamento”",
        body: [
          "Muito conteúdo foi criado rápido, e alguns cursos ainda esperam a revisão de um falante nativo. Em vez de esconder isso, aparece uma pequena insígnia de *Revisão comunitária em andamento* nessas bolhas de idioma (e nas telas iniciais delas), assim você sempre sabe quais cursos já foram revisados por uma pessoa e quais ainda não. A insígnia some discretamente assim que a revisão de um curso é registrada.",
        ],
      },
      {
        title: "Comentários",
        body: [
          "Encontrou um erro? Configurações → “Relatar um erro” — um formulário rápido de uma única caixa onde você também pode anexar uma captura de tela e um código de erro (se algo travar, a tela de erro mostra um código como SQ-XXXXXX; o formulário o preenche por você automaticamente). Tem uma ideia? Configurações → “Sugerir uma funcionalidade”. Os dois vão direto para o desenvolvedor, sem precisar de nenhum site externo. Conhece alguém que gostaria de ajudar a testar? A pessoa pode se candidatar em /beta-apply (uns 3 minutos), sem precisar de conta.",
          "Também há um {{fb|grupo do SquirreLingo no Facebook}} para novidades de versões e conversa da comunidade — é privado durante a beta, então peça para entrar e você será aprovado.",
        ],
      },
      {
        title: "Conta e segurança",
        body: [
          "Entre com o seu e-mail ou com o seu nome de usuário. Para mudar o seu e-mail ou a sua senha, primeiro você precisa digitar de novo a sua senha atual, e ao mudar a senha a sessão é encerrada automaticamente em qualquer outro dispositivo em que você esteja conectado, por segurança. Você também receberá um aviso por e-mail sempre que o seu nome de usuário, e-mail ou senha mudarem.",
          "Esqueceu a sua senha? A página de redefinição guia você pelas suas perguntas de segurança — responda 2 de 3 corretamente e você pode definir uma senha nova na hora. Configure-as (mais uma dica de senha opcional) em Configurações → Recuperação de senha, ou quando você se candidata pela primeira vez à beta. Sem perguntas salvas, as redefinições passam por uma solicitação ao administrador, o que pode demorar — recomenda-se muito configurar as perguntas.",
        ],
      },
    ],
  },
  fr: {
    title: "Comment fonctionne SquirreLingo",
    crossref: "Tu cherches plutôt une vue d’ensemble ? Va voir la {{about|page À propos}}.",
    sections: [
      {
        title: "Trouver l’aide et le menu",
        body: [
          "Le bouton *?* dans le coin supérieur droit de l’écran d’accueil ouvre cette page d’aide quand tu veux — il est bien en vue, pour que tu n’aies jamais à partir à sa recherche.",
          "Juste à côté, ta *photo de profil* ouvre un menu latéral avec tout le reste : *Nouveautés* (un point apparaît quand une version que tu n’as pas encore vue est sortie), *Comment utiliser SquirreLingo* (le même petit tour animé que tu as eu à ta première connexion — rouvre-le quand tu veux) et *À propos* (ce qu’est l’appli, comment marchent les modes, et ce qui est prévu ensuite). Sous un séparateur se trouve aussi toute la section *Réglages* — nom d’utilisateur, e-mail, mot de passe, langue et pays d’origine, photo de profil, préférences de jeu — sans aucun clic supplémentaire pour l’ouvrir. Tout ce menu et chaque libellé des Réglages s’affichent dans ta langue maternelle.",
        ],
      },
      {
        title: "SquirreLingo dans ta langue",
        body: [
          "SquirreLingo n’enseigne pas seulement dans ta langue — *l’appli elle-même s’y adapte*. Partout où ta langue maternelle est prise en charge, toute l’interface la suit : les écrans de connexion et d’inscription, la récupération de mot de passe, la première prise en main, le menu latéral et chaque libellé des Réglages, le formulaire de candidature à la bêta, et tout ce qui se passe pendant une manche — sous-titres, options de réponse, explications et Banque de mots.",
          "L’appli *choisit ta langue automatiquement* d’après ton navigateur la première fois que tu arrives, il n’y a donc rien à configurer. Tu en préfères une autre ? Une petite *pastille 🌐* se trouve dans le coin de chaque écran avant la connexion — touche-la pour changer quand tu veux, et ton choix est conservé.",
          "D’autres langues d’interface sont ajoutées au fil du temps, et la couverture s’élargit à mesure que le contenu en langue maternelle se remplit. Quelques recoins restent en anglais pour tout le monde — la page du *Grammar Gym* et certains écrans d’état ou d’erreur — et ils sont les prochains sur la liste. La visite *Comment utiliser SquirreLingo* n’en fait plus partie : elle suit ta langue elle aussi.",
        ],
      },
      {
        title: "Choisir ce que tu apprends",
        body: [
          "Ta *langue maternelle* (définie dans les Réglages) détermine quelles langues apparaissent sous forme de bulles à apprendre — tu verras les langues disponibles à partir de la tienne, et de nouvelles paires de langues s’ajoutent régulièrement. Le nom de chaque bulle s’affiche aussi dans ta langue maternelle (par exemple tu verras « Allemand » plutôt que « Deutsch ») — pas besoin de reconnaître une langue à son drapeau ou à son nom dans sa propre écriture. Ton *pays d’origine* est séparé — il ne sert qu’à personnaliser le badge dans la rangée d’icônes du haut.",
          "Chaque bulle de langue affiche ton niveau actuel et ta progression en XP vers le suivant. Touche une bulle pour commencer à t’entraîner dans cette langue — la progression est suivie séparément pour chaque langue.",
        ],
      },
      {
        title: "Façons de s’entraîner : Quiz Rapide, Leçons et plus",
        body: [
          "*Quiz Rapide* est le mode d’origine, façon jeu — des manches courtes et mélangées au hasard, avec un chrono, des combos et des séries. *Leçons* est une alternative plus calme — sans chrono, sans pression de combo, qui avance un sujet à la fois (les éléments les plus faciles d’abord) et montre l’explication juste après chaque réponse. Un sélecteur segmenté en haut de l’écran de départ de chaque mode permet de passer de l’un à l’autre — les deux comptent pour les mêmes XP, le même niveau et la même maîtrise, donc changer de mode ne fait rien perdre.",
          "Sur les langues qui les proposent, ce même sélecteur porte deux segments de plus : un mode *Alphabet* pour les langues qui ont leur propre système d’écriture, et le *Gym de grammaire*, un entraîneur de conjugaison indépendant. Les deux sont décrits dans leurs propres sections plus bas, et chacun garde sa progression à part.",
        ],
      },
      {
        title: "Écouter et Parler (bientôt)",
        body: [
          "Au-dessus du sélecteur Quiz Rapide / Leçons, tu verras aussi un sélecteur *S’entraîner / Écouter / Parler*. « S’entraîner » regroupe tout ce que l’appli sait faire aujourd’hui. L’entraînement à l’écoute et à l’expression orale n’est pas encore construit — ces deux onglets portent la mention « bientôt » et ouvrent pour l’instant une courte page d’annonce, pour que tu voies où va l’appli. La page À propos contient une liste « Et ensuite » plus complète.",
        ],
      },
      {
        title: "Le sélecteur de catégories (mode Quiz Rapide)",
        body: [
          "Avant de lancer une manche, tu peux combiner les catégories sur lesquelles te concentrer (vocabulaire, grammaire, traduction, phonétique — n’importe quel sous-ensemble), ou laisser l’option « Mixte » pour le mélange par défaut de tout (son libellé s’affiche dans la langue où sont tes autres boutons à ce moment-là). La choisir efface toute sélection précise et revient au mélange complet. En mode Leçons, tu choisis plutôt un sujet à la fois — voir l’explication des modes ci-dessus.",
          "Certaines langues proposent aussi une catégorie *Banque de mots* — une grande couche des mots les plus fréquents de la langue. Elle rejoint le mélange comme n’importe quelle autre catégorie, mais le mélange par défaut plafonne la place qu’elle peut prendre dans une manche, pour qu’elle n’étouffe jamais la grammaire, les expressions ou la phonétique.",
        ],
      },
      {
        title: "S’entraîner par thème",
        body: [
          "À côté du sélecteur de catégories, une rangée *Focus par thème* te permet de travailler un seul sujet — voyages, nourriture, travail, etc. — en piochant dans toutes les catégories à la fois. Laisse-la sur *Tous les thèmes* pour le mélange habituel.",
          "Un thème et une catégorie *se combinent* quand tu choisis les deux — par exemple seulement les questions de grammaire du thème « voyages ». Si cette combinaison précise est trop mince pour remplir une manche entière, l’appli te le dit d’emblée au lieu de te servir discrètement une manche d’un seul élément.",
        ],
      },
      {
        title: "La langue change selon ton niveau",
        body: [
          "Sur la page de jeu de chaque langue, les boutons, libellés et statistiques à l’écran s’affichent dans ta *langue maternelle* tant que tu es en Aucune expérience, Débutant ou Intermédiaire — pas besoin de lire des consignes dans une langue que tu ne connais pas encore. Une fois arrivé à Avancé ou Natif, cette même interface bascule dans la *langue que tu apprends*, puisqu’à ce stade la lire est un bon entraînement.",
          "Les questions elles-mêmes suivent la même règle quand c’est disponible : la question apparaît dans la langue que tu apprends, avec une petite *traduction dans ta langue maternelle* juste en dessous tant que tu es aux niveaux inférieurs — pour que tu saches toujours ce qui est demandé sans que la traduction ne donne jamais la réponse. Aux niveaux Avancé et Natif, le sous-titre disparaît en même temps que le reste de l’interface en langue maternelle. Toute cette couche — les sous-titres, l’interface à l’écran, les options de réponse et la Banque de mots — s’adapte à ta langue maternelle partout où ce contenu existe, et d’autres langues maternelles se remplissent au fil du temps.",
        ],
      },
      {
        title: "Variations régionales",
        body: [
          "Sur certaines langues, une réponse peut afficher une petite carte indiquant comment ce mot change d’un pays et d’une région à l’autre — elle met en avant la forme employée là d’où tu viens et montre comment on le dit ailleurs. C’est une note bonus, jamais un changement de la bonne réponse.",
        ],
      },
      {
        title: "Jouer une manche",
        body: [
          "Chaque manche mélange plusieurs types de questions — une étiquette colorée sur chaque carte t’indique de quel type il s’agit.",
          "Tu disposes d’un nombre de secondes défini par question (réglable dans Réglages → Jeu), sans pénalité en cas d’erreur — réponds et passe à la suite. Un compteur de combo (⚡) grimpe quand tu enchaînes les bonnes réponses et retombe à zéro en cas d’erreur, sans autre pénalité.",
          "Les *questions de phonétique* montrent une transcription écrite de la façon dont une expression se prononce (MAJUSCULES = syllabe accentuée, ‿ = mots qui se lient quand on parle vite) au lieu d’un vrai son, pour que ça marche partout sans avoir besoin d’audio.",
          "*Audio des questions* : sur les langues où l’audio a déjà été enregistré, un bouton haut-parleur apparaît à côté de la question — touche-le pour l’entendre lue à voix haute dans l’accent de la langue concernée, touche à nouveau pour arrêter. Il ne se lance jamais tout seul, et le chrono continue pendant la lecture. Tous les boutons haut-parleur peuvent être désactivés dans Réglages → Jeu.",
          "Les bonnes et les mauvaises réponses sont volontairement impossibles à rater — une pulsation verte si c’est juste, une secousse rouge si c’est faux.",
        ],
      },
      {
        title: "Le « Attention » quand tu te trompes",
        body: [
          "Rate une question et, en plus de l’explication, tu reçois un rapide *💡 Attention* qui fait deux choses : il nomme la règle que la question testait, _et_ il parle de l’option précise que *tu* as choisie — pourquoi cette forme est fausse, ou ce qu’elle veut dire en réalité — pour qu’un mauvais choix devienne une mini-leçon plutôt qu’une simple marque rouge. Il s’affiche le plus complètement en *mode révision* (ci-dessous), où la carte t’attend avant de passer à la suite.",
        ],
      },
      {
        title: "Les indices de temps sur les questions de conjugaison",
        body: [
          "Sur les questions de conjugaison, une petite *pastille 🎯* nomme le temps et la personne attendus, avec une raison en une ligne — des roues d’appoint pour que tu puisses te concentrer sur la forme pendant que tu l’apprends encore. Elles sont activées par défaut. Une fois arrivé à un niveau avancé, la pastille propose un bouton pour la masquer, et tu peux aussi les désactiver dans Réglages → Jeu.",
          "Pour l’allemand, le russe, le japonais, le coréen et le mandarin, les questions de conjugaison sont générées par des moteurs de grammaire maison, donc les formes sont correctes par construction plutôt que saisies à la main.",
        ],
      },
      {
        title: "Le mode révision",
        body: [
          "Active-le dans Réglages → Jeu pour marquer une pause après chaque réponse, lire l’explication directement sur la carte et toucher « Suivant » quand tu es prêt — au lieu d’un passage automatique en moins d’une seconde.",
        ],
      },
      {
        title: "Questions ratées et révision",
        body: [
          "Tout ce que tu rates est ajouté à une pile « Revoir les erreurs », affichée sur l’écran de départ. En travaillant cette pile, chaque question en sort dès que tu la réussis — sans pression de temps, puisqu’il s’agit de combler des lacunes, pas d’aller vite.",
        ],
      },
      {
        title: "Explications et archives",
        body: [
          "Chaque question à laquelle tu as répondu — juste ou fausse — est consignée avec une explication de la bonne réponse, consultable à tout moment depuis l’écran de résultats. Les explications s’affichent dans ta langue maternelle (avec un repli sur l’anglais là où la traduction n’est pas encore écrite), et tant que tu es en Aucune expérience, Débutant ou Intermédiaire, tu reçois aussi l’explication dans la langue que tu apprends — pour t’imprégner des tournures en contexte. Les explications en langue cible sont ajoutées langue par langue. Les entrées plus anciennes passent automatiquement dans une section « Archives » pour que la liste principale reste rapide à parcourir — rien n’est jamais supprimé, sauf si tu choisis de tout effacer.",
        ],
      },
      {
        title: "Le suivi de maîtrise",
        body: [
          "L’écran de départ de chaque langue comporte une carte « Progression par catégorie » — touche « Voir les détails » pour voir combien d’éléments tu as appris par rapport au total existant dans chaque catégorie, plus une répartition par niveau de difficulté, pour que la progression apparaisse par petits blocs plutôt qu’en un seul gros chiffre. « Appris » veut dire que tu l’as vu et qu’il ne se trouve pas actuellement dans ta pile de questions ratées. À noter : le total repose sur le contenu propre de cette appli pour cette langue, pas sur une liste externe de fréquence des mots — les langues encore en phase de démarrage afficheront des totaux plus petits jusqu’à ce que du contenu s’ajoute.",
        ],
      },
      {
        title: "Niveaux et test de niveau",
        body: [
          "Chaque langue a son propre niveau : Aucune expérience, Débutant, Intermédiaire, Avancé ou Natif — d’après le vrai cadre CECR utilisé par les certifications de langues officielles. Les manches privilégient les questions correspondant à ton niveau, sans jamais manquer de contenu.",
          "Réponds régulièrement bien à ton niveau actuel et on te proposera de passer au suivant. Tu ne sais pas où tu en es ? Fais le court *test de niveau*, sans chrono, depuis l’écran de départ de la langue — il pioche des questions dans les six paliers du CECR (de A1 à C2) pour lesquels la langue a du contenu, ce qui lui permet de situer aussi bien les vrais débutants que les apprenants avancés, et pas seulement ceux du milieu.",
        ],
      },
      {
        title: "Le Gym de grammaire",
        body: [
          "Les langues dotées d’un module de conjugaison reçoivent un segment *Gym de grammaire* dans le sélecteur de mode — un espace indépendant pour travailler les verbes. Il a deux parties : une vue *Apprendre* avec des tableaux de référence (chaque verbe déployé sur ses temps et ses formes) et une vue *S’entraîner* qui t’interroge sur ces formes en séries courtes de 10 questions. Tu peux te limiter à un seul groupe de verbes pour travailler un schéma à la fois.",
          "Il est volontairement cloisonné du reste de l’appli : sa progression est gardée à part et ne touche jamais ton niveau, tes XP, ta série ou ta maîtrise — travaille donc autant (ou aussi peu) que tu veux, il n’y a rien à perdre dans un sens comme dans l’autre.",
        ],
      },
      {
        title: "Le mode Alphabet / système d’écriture",
        body: [
          "Les langues qui utilisent un système d’écriture différent reçoivent un mode *Alphabet* dans le sélecteur, à côté de Quiz Rapide et Leçons. Le japonais a les hiragana et les katakana, le coréen a le hangeul (avec un échantillon de vrais blocs syllabiques), le russe a le cyrillique (regroupé selon la façon dont les lettres se rapportent à l’alphabet latin — les faux amis désamorcés dès le début), et le mandarin a un jeu de caractères fondamentaux avec pinyin et sens. Chacun propose des tableaux de référence complets ainsi que de courts quiz d’entraînement dans les deux sens (voir le symbole, choisir le son — et inversement). C’est entièrement facultatif et jamais obligatoire : pas de chrono, pas d’XP, rien à perdre. Les symboles auxquels tu as bien répondu s’affichent en vert dans les tableaux, pour que tu voies fondre ceux que tu ne connais pas encore. Les kanji japonais n’en font pas partie (c’est un bien plus long chemin) — chaque question de l’appli affiche les lectures romanisées à côté, donc ces bases suffisent pour jouer.",
        ],
      },
      {
        title: "Les réglages de jeu",
        body: [
          "Dans Réglages → Jeu : active ou désactive le mode révision, ajuste combien de questions viennent de chaque catégorie par manche, combien de paires de phonétique apparaissent, et le chrono par question — soit une seule limite partagée, soit des limites distinctes pour les questions normales et pour la phonétique — active ou désactive l’audio des questions, et coupe les indices de temps sur les questions de conjugaison quand tu n’en as plus besoin.",
        ],
      },
      {
        title: "Les mentions « Relecture par la communauté en cours »",
        body: [
          "Une grande partie du contenu a été construite vite, et certaines langues attendent encore une vérification par un locuteur natif. Plutôt que de le cacher, un petit badge *Relecture par la communauté en cours* apparaît sur ces bulles de langue (et sur leurs écrans de départ), pour que tu saches toujours quelles langues ont été relues par un humain et lesquelles ne le sont pas encore. Le badge disparaît discrètement une fois la relecture d’une langue enregistrée.",
        ],
      },
      {
        title: "Commentaires",
        body: [
          "Tu as trouvé un bug ? Réglages → « Signaler un bug » — un formulaire rapide d’une seule case où tu peux aussi joindre une capture d’écran et un code d’erreur (si quelque chose plante, l’écran d’erreur affiche un code du type SQ-XXXXXX ; le formulaire le remplit automatiquement pour toi). Tu as plutôt une idée ? Réglages → « Suggérer une fonctionnalité ». Les deux vont directement au développeur, sans passer par un site externe. Tu connais quelqu’un qui aimerait aider à tester ? Cette personne peut postuler sur /beta-apply (environ 3 minutes), sans avoir besoin d’un compte.",
          "Il y a aussi un {{fb|groupe Facebook de SquirreLingo}} pour les nouvelles de versions et les échanges entre membres — il est privé pendant la bêta, alors demande à le rejoindre et tu seras accepté.",
        ],
      },
      {
        title: "Compte et sécurité",
        body: [
          "Connecte-toi avec ton e-mail ou ton nom d’utilisateur. Changer ton e-mail ou ton mot de passe demande d’abord de ressaisir ton mot de passe actuel, et changer ton mot de passe déconnecte automatiquement tous les autres appareils sur lesquels tu es connecté, par sécurité. Tu reçois aussi une notification par e-mail chaque fois que ton nom d’utilisateur, ton e-mail ou ton mot de passe change.",
          "Mot de passe oublié ? La page de réinitialisation te guide à travers tes questions de sécurité — réponds correctement à 2 sur 3 et tu peux définir un nouveau mot de passe sur place. Configure-les (avec un indice de mot de passe facultatif) dans Réglages → Récupération du mot de passe, ou au moment de ta candidature à la bêta. Sans questions enregistrées, les réinitialisations passent par une demande à un administrateur, ce qui peut prendre du temps — configurer les questions est vivement recommandé.",
        ],
      },
    ],
  },
  it: {
    title: "Come funziona SquirreLingo",
    crossref: "Cerchi invece un quadro d’insieme? Guarda la {{about|pagina Informazioni}}.",
    sections: [
      {
        title: "Trovare l’Aiuto e il menu",
        body: [
          "Il pulsante *?* nell’angolo in alto a destra della schermata iniziale apre questa pagina di Aiuto quando vuoi — è lì in bella vista, così non devi mai andare a cercarla.",
          "Accanto, la tua *foto del profilo* apre un menu laterale con tutto il resto: *Novità* (compare un puntino quando c’è una versione che non hai ancora visto), *Come usare SquirreLingo* (lo stesso breve tour animato che hai visto al primo accesso — riaprilo quando vuoi) e *Informazioni* (che cos’è l’app, come funzionano le modalità e che cosa è previsto dopo). Sotto un separatore c’è anche l’intera sezione *Impostazioni* — nome utente, email, password, lingua e paese di origine, foto del profilo, preferenze di gioco — senza nessun tocco in più per aprirla. Tutto questo menu e ogni voce delle Impostazioni compaiono nella tua lingua madre.",
        ],
      },
      {
        title: "SquirreLingo nella tua lingua",
        body: [
          "SquirreLingo non insegna soltanto nella tua lingua — *è l’app stessa ad adattarsi a essa*. Ovunque la tua lingua madre sia supportata, tutta l’interfaccia la segue: le schermate di accesso e di registrazione, il recupero della password, la configurazione iniziale al primo avvio, il menu laterale e ogni voce delle Impostazioni, il modulo di candidatura alla beta e tutto ciò che succede dentro un round — sottotitoli, opzioni di risposta, spiegazioni e Banca delle parole.",
          "L’app *sceglie la tua lingua automaticamente* dal browser la prima volta che arrivi, quindi non devi impostare nulla. Ne preferisci un’altra? Una piccola *pastiglia 🌐* si trova nell’angolo di ogni schermata prima dell’accesso — toccala per cambiare quando vuoi, e la tua scelta viene mantenuta.",
          "Col tempo vengono aggiunte altre lingue dell’interfaccia, e la copertura si allarga man mano che i contenuti in lingua madre si completano. Qualche angolo resta in inglese per tutti — la pagina del *Grammar Gym* e alcune schermate di stato o di errore — e sono i prossimi della lista. Il tour *Come usare SquirreLingo* non è più tra questi: ora segue anche lui la tua lingua.",
        ],
      },
      {
        title: "Scegliere che cosa imparare",
        body: [
          "La tua *lingua madre* (impostata nelle Impostazioni) decide quali lingue compaiono come bolle da imparare — vedrai le lingue disponibili a partire dalla tua, e nuove coppie di lingue si aggiungono col tempo. Anche il nome di ogni bolla compare nella tua lingua madre (per esempio vedrai “Tedesco” invece di “Deutsch”) — non serve riconoscere una lingua dalla bandiera o dal nome nella sua scrittura. Il tuo *paese di origine* è una cosa a parte — serve solo a personalizzare il badge nella fila di icone in alto.",
          "Ogni bolla di lingua mostra il tuo livello attuale e i progressi in XP verso il successivo. Tocca una bolla per iniziare a esercitarti in quella lingua — i progressi vengono seguiti separatamente per ogni lingua.",
        ],
      },
      {
        title: "Modi per esercitarsi: Quiz Rapido, Lezioni e altro",
        body: [
          "*Quiz Rapido* è la modalità originale, in stile gioco — round brevi e mescolati a caso, con cronometro, punti combo e serie. *Lezioni* è un’alternativa più tranquilla — niente cronometro, niente pressione da combo: avanza un argomento alla volta (prima gli elementi più facili) e mostra la spiegazione subito dopo ogni risposta. Un selettore a segmenti in alto nella schermata di avvio di entrambe le modalità permette di passare dall’una all’altra — contano entrambe per gli stessi XP, lo stesso livello e la stessa padronanza, quindi cambiando non perdi nulla.",
          "Nei corsi che le prevedono, quello stesso selettore porta altri due segmenti: una modalità *Alfabeto* per le lingue con una propria scrittura, e la *Palestra di grammatica*, un allenatore di coniugazione indipendente. Entrambe sono descritte nelle sezioni dedicate più sotto, e ognuna tiene i propri progressi separati.",
        ],
      },
      {
        title: "Ascoltare e Parlare (in arrivo)",
        body: [
          "Sopra il selettore Quiz Rapido / Lezioni vedrai anche un selettore *Esercitati / Ascolta / Parla*. “Esercitati” è tutto quello che l’app sa fare oggi. L’allenamento all’ascolto e alla conversazione non è ancora stato costruito — quelle due schede portano la scritta “Presto” e per ora aprono una breve pagina di anteprima, così vedi dove sta andando l’app. La pagina Informazioni contiene un elenco “Che cosa arriva” più completo.",
        ],
      },
      {
        title: "Il selettore di categorie (modalità Quiz Rapido)",
        body: [
          "Prima di lanciare un round puoi combinare le categorie su cui concentrarti (vocabolario, grammatica, traduzione, fonetica — qualsiasi sottoinsieme), oppure lasciare l’opzione “Misto” per la miscela predefinita di tutto (la sua etichetta compare nella lingua in cui si trovano in quel momento gli altri pulsanti). Sceglierla cancella ogni selezione specifica e torna alla miscela completa. In modalità Lezioni scegli invece un argomento alla volta — vedi la spiegazione delle modalità qui sopra.",
          "Alcuni corsi hanno anche una categoria *Banca delle parole* — un grande strato con le parole più frequenti della lingua. Entra nella miscela come qualsiasi altra categoria, ma la miscela predefinita limita quanto spazio può prendersi in un round, così non soffoca mai la grammatica, le espressioni o la fonetica.",
        ],
      },
      {
        title: "Esercitarsi per tema",
        body: [
          "Accanto al selettore di categorie, una fila *Focus per tema* ti permette di allenare un solo argomento — viaggi, cibo, lavoro e così via — pescando da tutte le categorie insieme. Lasciala su *Tutti i temi* per la miscela abituale.",
          "Un tema e una categoria *si combinano* quando li scegli entrambi — per esempio solo le domande di grammatica del tema “viaggi”. Se quella combinazione precisa è troppo scarna per riempire un round intero, l’app te lo dice subito invece di servirti in silenzio un round con un solo elemento.",
        ],
      },
      {
        title: "La lingua cambia con il tuo livello",
        body: [
          "Nella pagina di gioco di ogni lingua, i pulsanti, le etichette e le statistiche sullo schermo compaiono nella tua *lingua madre* finché sei a Nessuna esperienza, Principiante o Intermedio — non devi leggere istruzioni in una lingua che ancora non conosci. Una volta arrivato ad Avanzato o Madrelingua, quella stessa interfaccia passa alla *lingua che stai imparando*, perché a quel punto leggerla è un buon esercizio.",
          "Anche le domande seguono la stessa regola dove è disponibile: la domanda compare nella lingua che stai imparando, con una piccola *traduzione nella tua lingua madre* subito sotto finché sei ai livelli più bassi — così sai sempre che cosa ti viene chiesto senza che la traduzione riveli mai la risposta. Ad Avanzato e Madrelingua il sottotitolo sparisce insieme al resto dell’interfaccia in lingua madre. Tutto questo strato — i sottotitoli, l’interfaccia sullo schermo, le opzioni di risposta e la Banca delle parole — si adatta alla tua lingua madre ovunque quel contenuto esista, e altre lingue madri si aggiungono col tempo.",
        ],
      },
      {
        title: "Variazioni regionali",
        body: [
          "In alcuni corsi, una risposta può mostrare una piccola scheda che segnala come quella parola cambia da paese a paese e da regione a regione — mette in evidenza la forma usata dalle tue parti e mostra come si dice altrove. È una nota in più, mai un cambiamento della risposta corretta.",
        ],
      },
      {
        title: "Giocare un round",
        body: [
          "Ogni round mescola diversi tipi di domande — un’etichetta colorata su ogni scheda ti dice di che tipo si tratta.",
          "Hai un numero fisso di secondi per domanda (regolabile in Impostazioni → Gioco), senza penalità per le risposte sbagliate — rispondi e vai avanti. Un contatore combo (⚡) sale quando incateni risposte corrette una dopo l’altra e si azzera con un errore, senza altre penalità.",
          "Le *domande di fonetica* mostrano una trascrizione scritta di come suona una frase (MAIUSCOLE = sillaba accentata, ‿ = parole che si legano quando si parla in fretta) invece dell’audio vero, così funzionano ovunque senza bisogno di suono.",
          "*Audio delle domande*: nei corsi in cui l’audio è già stato registrato, accanto alla domanda compare un pulsante altoparlante — toccalo per sentirla letta ad alta voce nell’accento proprio di quel corso, toccalo di nuovo per fermarla. Non parte mai da solo, e il cronometro continua a scorrere durante la riproduzione. Tutti i pulsanti altoparlante si possono disattivare in Impostazioni → Gioco.",
          "Le risposte giuste e quelle sbagliate sono volutamente impossibili da non notare — un impulso verde se è giusta, una scossa rossa se è sbagliata.",
        ],
      },
      {
        title: "L’“Attenzione” quando sbagli",
        body: [
          "Sbaglia una domanda e, oltre alla spiegazione, ricevi un rapido *💡 Attenzione* che fa due cose: nomina la regola che la domanda stava mettendo alla prova, _e_ parla dell’opzione precisa che hai scelto *tu* — perché quella forma è sbagliata, o che cosa significa davvero — così un tocco sbagliato diventa una mini-lezione invece di un semplice segno rosso. Si vede al meglio in *modalità Ripasso* (qui sotto), dove la scheda ti aspetta prima di andare avanti.",
        ],
      },
      {
        title: "Gli indizi sul tempo verbale nelle domande di coniugazione",
        body: [
          "Nelle domande di coniugazione, una piccola *pastiglia 🎯* nomina il tempo e la persona che la risposta richiede, con un motivo in una riga — rotelle di supporto, per farti concentrare sulla forma mentre la stai ancora imparando. Sono attive per impostazione predefinita. Una volta arrivato a un livello avanzato la pastiglia offre un pulsante per chiuderla, e puoi anche disattivarle in Impostazioni → Gioco.",
          "Per tedesco, russo, giapponese, coreano e mandarino le domande di coniugazione sono generate da motori grammaticali interni, quindi le forme sono corrette per costruzione invece che scritte a mano.",
        ],
      },
      {
        title: "La modalità Ripasso",
        body: [
          "Attivala in Impostazioni → Gioco per fermarti dopo ogni risposta, leggere la spiegazione direttamente sulla scheda e toccare “Avanti” quando sei pronto — invece di passare oltre in automatico in meno di un secondo.",
        ],
      },
      {
        title: "Domande sbagliate e ripasso",
        body: [
          "Tutto quello che sbagli finisce in una pila “Rivedi gli errori”, mostrata nella schermata di avvio. Esercitandoti su quella pila, ogni domanda ne esce appena la indovini — senza pressione di tempo, perché qui si tratta di colmare lacune, non di andare veloce.",
        ],
      },
      {
        title: "Spiegazioni e archivio",
        body: [
          "Ogni domanda a cui hai risposto — giusta o sbagliata — viene registrata con una spiegazione della risposta corretta, consultabile in qualsiasi momento dalla schermata dei risultati del round. Le spiegazioni compaiono nella tua lingua madre (con un ripiego sull’inglese dove la traduzione non è ancora stata scritta), e finché sei a Nessuna esperienza, Principiante o Intermedio ricevi anche la spiegazione nella lingua che stai imparando — così assorbi le espressioni nel contesto. Le spiegazioni nella lingua di studio vengono aggiunte corso per corso. Le voci più vecchie passano automaticamente in una sezione “Archivio”, così l’elenco principale resta veloce da scorrere — niente viene mai cancellato, a meno che tu non scelga di svuotarlo.",
        ],
      },
      {
        title: "Il monitoraggio della padronanza",
        body: [
          "La schermata di avvio di ogni lingua ha una scheda “Progressi per categoria” — tocca “Vedi i dettagli” per vedere quanti elementi hai imparato rispetto al totale esistente in ogni categoria, più una suddivisione per livello di difficoltà, così i progressi si vedono a piccoli blocchi invece che in un unico numerone. “Imparato” vuol dire che l’hai visto e che al momento non si trova nella tua pila di domande sbagliate. Nota: il totale si basa sui contenuti propri di questa app per quel corso, non su un elenco esterno di frequenza delle parole — i corsi ancora agli inizi mostreranno totali più piccoli finché non si aggiungono altri contenuti.",
        ],
      },
      {
        title: "Livelli e test di livello",
        body: [
          "Ogni corso di lingua ha il suo livello: Nessuna esperienza, Principiante, Intermedio, Avanzato o Madrelingua — basato sul vero quadro QCER usato dalle certificazioni linguistiche ufficiali. I round privilegiano le domande adatte al tuo livello, senza mai restare a corto di contenuti.",
          "Rispondi bene con costanza al tuo livello attuale e ti verrà proposto di passare al successivo. Non sai a che punto sei? Fai il breve *test di livello*, senza cronometro, dalla schermata di avvio di quella lingua — pesca domande da tutti e sei i gradini del QCER (da A1 a C2) per cui il corso ha contenuti, così riesce a collocare con precisione sia i veri principianti sia chi è già avanzato, non solo chi sta nel mezzo.",
        ],
      },
      {
        title: "La Palestra di grammatica",
        body: [
          "I corsi con un modulo di coniugazione ricevono un segmento *Palestra di grammatica* nel selettore delle modalità — uno spazio a sé per allenare i verbi. Ha due parti: una vista *Impara* con tabelle di riferimento (ogni verbo disteso su tutti i suoi tempi e le sue forme) e una vista *Esercitati* che ti interroga su quelle forme in serie brevi da 10 domande. Puoi restringere a un solo gruppo di verbi per lavorare su uno schema alla volta.",
          "È volutamente separata dal resto dell’app: i suoi progressi sono tenuti a parte e non toccano mai il tuo livello, i tuoi XP, la tua serie o la tua padronanza — quindi allenati quanto vuoi (o quanto poco vuoi), non c’è nulla da perdere in nessun caso.",
        ],
      },
      {
        title: "La modalità Alfabeto / sistema di scrittura",
        body: [
          "I corsi di lingue che usano un sistema di scrittura diverso ricevono una modalità *Alfabeto* nel selettore, accanto a Quiz Rapido e Lezioni. Il giapponese ha hiragana e katakana, il coreano ha l’hangul (con un assaggio di veri blocchi sillabici), il russo ha il cirillico (raggruppato in base a come le lettere si rapportano all’alfabeto latino — i falsi amici disinnescati subito) e il mandarino ha un insieme di caratteri di base con pinyin e significati. Ognuna offre tabelle di riferimento complete e brevi quiz di allenamento in entrambe le direzioni (vedi il simbolo, scegli il suono — e viceversa). È del tutto facoltativa e mai obbligatoria: niente cronometro, niente XP, niente da perdere. I simboli a cui hai risposto correttamente diventano verdi nelle tabelle, così vedi assottigliarsi quelli che ancora non conosci. I kanji giapponesi non ne fanno parte (quello è un cammino molto più lungo) — ogni domanda dell’app mostra accanto le letture romanizzate, quindi queste basi bastano per giocare.",
        ],
      },
      {
        title: "Le impostazioni di gioco",
        body: [
          "In Impostazioni → Gioco: attiva o disattiva la modalità Ripasso, regola quante domande arrivano da ogni categoria per round, quante coppie di fonetica compaiono e il cronometro per domanda — un unico limite condiviso oppure limiti separati per le domande normali e per la fonetica — attiva o disattiva l’audio delle domande, e spegni gli indizi sul tempo verbale nelle domande di coniugazione quando non ti servono più.",
        ],
      },
      {
        title: "Le note “Revisione della community in corso”",
        body: [
          "Buona parte dei contenuti è stata costruita in fretta, e alcuni corsi aspettano ancora un controllo da parte di un madrelingua. Invece di nasconderlo, su quelle bolle di lingua (e sulle loro schermate di avvio) compare un piccolo badge *Revisione della community in corso*, così sai sempre quali corsi sono stati riletti da una persona e quali non ancora. Il badge sparisce in silenzio una volta registrata la revisione di un corso.",
        ],
      },
      {
        title: "Feedback",
        body: [
          "Hai trovato un bug? Impostazioni → “Segnala un bug” — un modulo rapido con una sola casella, dove puoi anche allegare uno screenshot e un codice di errore (se qualcosa va in crash, la schermata di errore mostra un codice tipo SQ-XXXXXX; il modulo lo compila in automatico per te). Hai invece un’idea? Impostazioni → “Suggerisci una funzione”. Entrambi arrivano direttamente allo sviluppatore, senza passare da un sito esterno. Conosci qualcuno a cui piacerebbe aiutare a testare? Può candidarsi su /beta-apply (circa 3 minuti), senza bisogno di un account.",
          "C’è anche un {{fb|gruppo Facebook di SquirreLingo}} per le novità sulle versioni e per chiacchierare con gli altri — è privato durante la beta, quindi chiedi di entrare e verrai accettato.",
        ],
      },
      {
        title: "Account e sicurezza",
        body: [
          "Accedi con la tua email oppure con il tuo nome utente. Per cambiare email o password devi prima reinserire la password attuale, e cambiando la password vengono disconnessi automaticamente tutti gli altri dispositivi su cui hai fatto l’accesso, per sicurezza. Ricevi anche una notifica via email ogni volta che il tuo nome utente, la tua email o la tua password cambiano.",
          "Password dimenticata? La pagina di reimpostazione ti guida attraverso le tue domande di sicurezza — rispondi correttamente a 2 su 3 e puoi impostare subito una nuova password. Configurale (insieme a un suggerimento facoltativo per la password) in Impostazioni → Recupero della password, oppure quando ti candidi alla beta. Senza domande registrate, le reimpostazioni passano da una richiesta a un amministratore, e può volerci parecchio — configurare le domande è vivamente consigliato.",
        ],
      },
    ],
  },
};

export const ABOUT_CONTENT = {
  en: {
    title: "About SquirreLingo",
    tagline: "Fast, ADHD-friendly language practice — with a more traditional option too.",
    sections: [
      {
        title: "What this app is",
        body: [
          "SquirreLingo is a language-practice app built around short, low-pressure rounds of questions — vocabulary, grammar, idioms, and pronunciation — rather than long, rigid lesson paths. Pick a language, answer a handful of questions, see how you did, and stop whenever you want. There’s no requirement to finish a full “lesson” in one sitting. It’s a progressive web app, so it runs right in your browser on your phone or computer — nothing to download.",
        ],
      },
      {
        title: "Ways to practice",
        body: [
          "*Quick Quiz* is the original, game-style mode — short, randomly mixed rounds with a timer, combo scoring, and streaks. Built for quick, low-friction practice in small bursts.",
          "*Lessons* is a calmer, step-by-step mode — no timer, no combo pressure. It walks you through one topic at a time, easiest first, showing the explanation right after each answer so you can actually absorb it before moving on. A better fit if you’d rather work through material methodically than in quick random bursts. Both modes track the same overall progress, so switching between them never resets anything.",
          "On top of those, most tracks add two focused trainers reachable from the same mode switch: *Grammar Gym*, a standalone conjugation drill that keeps its own progress and never touches your level or streak, and an *Alphabet* mode for learning a new writing system — kana, hangul, Cyrillic, or Chinese characters — from scratch.",
        ],
      },
      {
        title: "Skill levels & the placement quiz",
        body: [
          "Every track uses the real CEFR framework that actual language certifications use, with skill levels running from No experience through Beginner, Intermediate, Advanced, and Native (A1–C2). Not sure where you stand? Each language has a short, untimed placement quiz that samples every tier the track has content for, so it can place true beginners and advanced learners alike.",
        ],
      },
      {
        title: "Tracking your progress",
        body: [
          "Each language’s own screen has a mastery tracker showing how much of that language’s content you’ve actually learned, category by category, along with your XP and streak as you play.",
        ],
      },
      {
        title: "Multiple languages, real dialect differences",
        body: [
          "For English speakers, SquirreLingo teaches nine languages — Spanish, French, Portuguese, Italian, German, Russian, Japanese, Mandarin Chinese, and Korean — several with genuinely different regional versions (Latin American vs. European Spanish, France vs. Québécois French, Brazilian vs. European Portuguese), for twelve distinct tracks in all. Where a language has real regional differences, this app treats them as separate tracks with different content, not the same material behind a different flag.",
          "The app now works in your own language, not just English — it detects your language from your browser automatically, with a language switcher in the corner of every sign-in screen if you’d rather change it. The whole app then follows your native language, end to end: signing in, onboarding, the menu and Settings, and every subtitle, answer choice, explanation and the Word Bank while you’re learning any of the languages on offer. On some tracks, a bonus card also shows how a word changes from country to country and region to region. More native-language pairings are on the way.",
          "Languages with their own writing system always show native script and its romanization together — kanji with romaji, hangul, Chinese characters with pinyin. And for German, Russian, Japanese, Korean, and Mandarin, the grammar questions are built by in-house engines, so every verb form is machine-verified for correctness rather than hand-typed.",
        ],
      },
      {
        title: "Honest about what’s human-checked",
        body: [
          "Building this much content quickly means some of it is still awaiting a native-speaker review. Rather than hide that, tracks still in that queue carry a small “Community review in progress” note, so you always know which languages have been human-reviewed and which haven’t yet. The note disappears once a track’s review is logged.",
        ],
      },
      {
        title: "What’s next",
        anchor: "whats-next",
        roadmap: {
          intro: "A peek at what we’re working on. No dates, no promises — things ship when they’re ready.",
          buckets: [
            {
              label: "In progress",
              items: [
                { title: "SquirreLingo in more languages", badge: "Now available", badgeType: "done", desc: "Most of the interface now adapts to your native language — auto-detected, with a switcher. A few screens are still English-only, and more native languages are rolling out." },
                { title: "Translations under questions", badge: "Rolling out", badgeType: "rolling", desc: "See what a question means in your language while you’re still learning — expanding track by track." },
                { title: "Explanations in your language", badge: "Rolling out", badgeType: "rolling", desc: "Now in your native language, not just English — with the language you’re learning too, rolling out track by track." },
              ],
            },
            {
              label: "Coming soon",
              items: [
                { title: "Mastery quizzes and star rankings", desc: "Prove you’ve truly mastered a category and earn stars for it." },
              ],
            },
            {
              label: "Down the road",
              items: [
                { title: "Listening and speaking practice", desc: "Hear it, say it — a whole new way to practice." },
                { title: "App store apps", desc: "SquirreLingo on Google Play and the App Store." },
              ],
            },
          ],
        },
      },
      {
        title: "Join the community",
        body: [
          "SquirreLingo has a Facebook group — release news, tips, and a place to talk with other beta testers (and the developer) directly. It’s a private group during the beta, so hit {{fb|Join Group}} and you’ll be approved.",
        ],
      },
    ],
    footer: "Questions about how something specific works? The {{help|Help page}} has a full walkthrough of every screen and icon. Found a bug, or have an idea? There’s a {{feedback|feedback form}} for that too. Know someone who’d like to {{beta|apply to beta test}}?",
  },
  es: {
    title: "Acerca de SquirreLingo",
    tagline: "Práctica de idiomas rápida y amigable con el TDAH — con una opción más tradicional también.",
    sections: [
      {
        title: "Qué es esta app",
        body: [
          "SquirreLingo es una app para practicar idiomas armada en torno a rondas cortas de preguntas y sin presión — vocabulario, gramática, modismos y pronunciación — en lugar de caminos de lecciones largos y rígidos. Elige un idioma, responde un puñado de preguntas, mira cómo te fue y para cuando quieras. No hay que terminar una “lección” completa de una sola vez. Es una app web progresiva, así que corre directo en tu navegador, en tu teléfono o tu computadora — sin nada que descargar.",
        ],
      },
      {
        title: "Formas de practicar",
        body: [
          "*Quiz Rápido* es el modo original, tipo juego — rondas cortas y mezcladas al azar, con cronómetro, puntos por combo y rachas. Hecho para practicar rápido y sin fricción, en ratitos cortos.",
          "*Lecciones* es un modo más tranquilo y paso a paso — sin cronómetro ni presión de combo. Te lleva por un tema a la vez, lo más fácil primero, mostrando la explicación justo después de cada respuesta para que de verdad la asimiles antes de seguir. Encaja mejor si prefieres avanzar por el material de forma metódica que en ratitos rápidos al azar. Los dos modos guardan el mismo progreso general, así que cambiar entre ellos nunca reinicia nada.",
          "Además de eso, la mayoría de los cursos suman dos entrenadores enfocados a los que se llega desde el mismo selector de modos: el *Gimnasio de Gramática*, un ejercicio de conjugación independiente que guarda su propio progreso y nunca afecta tu nivel ni tu racha, y un modo *Alfabeto* para aprender una escritura nueva — kana, hangul, cirílico o caracteres chinos — desde cero.",
        ],
      },
      {
        title: "Niveles y la prueba de nivel",
        body: [
          "Cada curso usa el marco real MCER que usan las certificaciones de idiomas de verdad, con niveles que van desde Sin experiencia hasta Principiante, Intermedio, Avanzado y Nativo (A1–C2). ¿No sabes en qué nivel estás? Cada idioma tiene una prueba de nivel corta y sin cronómetro que toma preguntas de todos los niveles para los que el curso tiene contenido, así puede ubicar por igual a principiantes de verdad y a estudiantes avanzados.",
        ],
      },
      {
        title: "Seguir tu progreso",
        body: [
          "La pantalla de cada idioma tiene un medidor de dominio que muestra cuánto del contenido de ese idioma has aprendido de verdad, categoría por categoría, junto con tu XP y tu racha mientras juegas.",
        ],
      },
      {
        title: "Varios idiomas, diferencias reales de dialecto",
        body: [
          "Para quienes hablan inglés, SquirreLingo enseña nueve idiomas — español, francés, portugués, italiano, alemán, ruso, japonés, chino mandarín y coreano — varios con versiones regionales realmente distintas (español latinoamericano vs. europeo, francés de Francia vs. de Quebec, portugués de Brasil vs. europeo), para doce cursos distintos en total. Donde un idioma tiene diferencias regionales reales, esta app las trata como cursos separados con contenido diferente, no el mismo material detrás de otra bandera.",
          "Ahora la app funciona en tu propio idioma, no solo en inglés — detecta tu idioma automáticamente desde tu navegador, con un selector de idioma en la esquina de cada pantalla de inicio de sesión por si prefieres cambiarlo. Después, toda la app sigue tu idioma nativo, de principio a fin: iniciar sesión, la configuración inicial, el menú y los Ajustes, y cada subtítulo, opción de respuesta, explicación y el Banco de Palabras mientras aprendes cualquiera de los idiomas disponibles. En algunos cursos, una tarjeta extra también muestra cómo cambia una palabra de país a país y de región a región. Vienen en camino más combinaciones de idioma nativo.",
          "Los idiomas con su propia escritura siempre muestran juntas la escritura nativa y su romanización — kanji con romaji, hangul, caracteres chinos con pinyin. Y para alemán, ruso, japonés, coreano y mandarín, las preguntas de gramática las construyen motores propios, así que cada forma verbal está verificada por máquina en lugar de escrita a mano.",
        ],
      },
      {
        title: "Honestos sobre lo revisado por personas",
        body: [
          "Crear tanto contenido en poco tiempo significa que una parte todavía espera la revisión de un hablante nativo. En lugar de ocultarlo, los cursos que siguen en esa fila llevan una pequeña nota de “Revisión comunitaria en curso”, así siempre sabes qué idiomas ya revisó una persona y cuáles todavía no. La nota desaparece en cuanto se registra la revisión de un curso.",
        ],
      },
      {
        title: "Qué viene",
        anchor: "whats-next",
        roadmap: {
          intro: "Un vistazo a lo que estamos trabajando. Sin fechas, sin promesas — las cosas salen cuando están listas.",
          buckets: [
            {
              label: "En proceso",
              items: [
                { title: "SquirreLingo en más idiomas", badge: "Ya disponible", badgeType: "done", desc: "Ahora casi toda la interfaz se adapta a tu idioma nativo — con detección automática y un selector. Algunas pantallas siguen solo en inglés, y vienen en camino más idiomas nativos." },
                { title: "Traducciones debajo de las preguntas", badge: "En despliegue", badgeType: "rolling", desc: "Mira qué significa una pregunta en tu idioma mientras aún aprendes — se amplía curso por curso." },
                { title: "Explicaciones en tu idioma", badge: "En despliegue", badgeType: "rolling", desc: "Ahora en tu idioma nativo, no solo en inglés — con el idioma que estás aprendiendo también, desplegándose curso por curso." },
              ],
            },
            {
              label: "Pronto",
              items: [
                { title: "Pruebas de dominio y rankings con estrellas", desc: "Demuestra que de verdad dominas una categoría y gana estrellas por ello." },
              ],
            },
            {
              label: "Más adelante",
              items: [
                { title: "Práctica de escuchar y hablar", desc: "Escúchalo, dilo — una forma totalmente nueva de practicar." },
                { title: "Apps en las tiendas", desc: "SquirreLingo en Google Play y la App Store." },
              ],
            },
          ],
        },
      },
      {
        title: "Únete a la comunidad",
        body: [
          "SquirreLingo tiene un grupo de Facebook — noticias de versiones, consejos y un lugar para hablar directo con otros beta testers (y con el desarrollador). Es un grupo privado durante la beta, así que toca {{fb|Unirte al grupo}} y te aprobarán.",
        ],
      },
    ],
    footer: "¿Dudas sobre cómo funciona algo específico? La {{help|página de Ayuda}} tiene un recorrido completo por cada pantalla e ícono. ¿Encontraste un error o tienes una idea? También hay un {{feedback|formulario de comentarios}} para eso. ¿Conoces a alguien que quiera {{beta|postularse como beta tester}}?",
  },
  pt: {
    title: "Sobre o SquirreLingo",
    tagline: "Prática de idiomas rápida e amigável para o TDAH — com uma opção mais tradicional também.",
    sections: [
      {
        title: "O que é este app",
        body: [
          "O SquirreLingo é um app para praticar idiomas montado em torno de rodadas curtas de perguntas e sem pressão — vocabulário, gramática, expressões idiomáticas e pronúncia — em vez de caminhos de lições longos e rígidos. Escolha um idioma, responda um punhado de perguntas, veja como foi e pare quando quiser. Não é preciso terminar uma “lição” completa de uma só vez. É um app web progressivo, então roda direto no seu navegador, no seu celular ou computador — sem nada para baixar.",
        ],
      },
      {
        title: "Formas de praticar",
        body: [
          "*Quiz Rápido* é o modo original, estilo jogo — rodadas curtas e misturadas ao acaso, com cronômetro, pontos por combo e sequências. Feito para praticar rápido e sem atrito, em intervalos curtinhos.",
          "*Lições* é um modo mais tranquilo e passo a passo — sem cronômetro nem pressão de combo. Ele leva você por um tema de cada vez, o mais fácil primeiro, mostrando a explicação logo depois de cada resposta para você de fato absorver antes de seguir. Encaixa melhor se você prefere avançar pelo material de forma metódica do que em intervalos rápidos ao acaso. Os dois modos guardam o mesmo progresso geral, então trocar entre eles nunca reinicia nada.",
          "Além disso, a maioria dos cursos soma dois treinadores focados que se acessam pelo mesmo seletor de modos: a *Academia de Gramática*, um exercício de conjugação independente que guarda o próprio progresso e nunca afeta o seu nível nem a sua sequência, e um modo *Alfabeto* para aprender uma escrita nova — kana, hangul, cirílico ou caracteres chineses — do zero.",
        ],
      },
      {
        title: "Níveis e o teste de nivelamento",
        body: [
          "Cada curso usa o verdadeiro quadro QECR que as certificações de idiomas de verdade usam, com níveis que vão de Sem experiência a Iniciante, Intermediário, Avançado e Nativo (A1–C2). Não sabe em que nível está? Cada idioma tem um teste de nivelamento curto e sem cronômetro que pega perguntas de todos os níveis para os quais o curso tem conteúdo, assim consegue posicionar por igual tanto iniciantes de verdade quanto estudantes avançados.",
        ],
      },
      {
        title: "Acompanhar o seu progresso",
        body: [
          "A tela de cada idioma tem um medidor de domínio que mostra quanto do conteúdo daquele idioma você realmente aprendeu, categoria por categoria, junto com o seu XP e a sua sequência enquanto você joga.",
        ],
      },
      {
        title: "Vários idiomas, diferenças reais de dialeto",
        body: [
          "Para quem fala inglês, o SquirreLingo ensina nove idiomas — espanhol, francês, português, italiano, alemão, russo, japonês, chinês mandarim e coreano — vários com versões regionais realmente distintas (espanhol latino-americano vs. europeu, francês da França vs. de Quebec, português do Brasil vs. europeu), para doze cursos distintos no total. Onde um idioma tem diferenças regionais reais, este app as trata como cursos separados com conteúdo diferente, não o mesmo material atrás de outra bandeira.",
          "Agora o app funciona no seu próprio idioma, não só em inglês — ele detecta o seu idioma automaticamente a partir do seu navegador, com um seletor de idioma no canto de cada tela de login, caso você prefira mudar. Depois, todo o app segue o seu idioma nativo, do início ao fim: entrar, a configuração inicial, o menu e as Configurações, e cada legenda, opção de resposta, explicação e o Banco de Palavras enquanto você aprende qualquer um dos idiomas disponíveis. Em alguns cursos, um cartão extra também mostra como uma palavra muda de país para país e de região para região. Mais combinações de idioma nativo estão a caminho.",
          "Os idiomas com a própria escrita sempre mostram juntas a escrita nativa e a sua romanização — kanji com romaji, hangul, caracteres chineses com pinyin. E para alemão, russo, japonês, coreano e mandarim, as perguntas de gramática são construídas por motores próprios, então cada forma verbal é verificada por máquina em vez de digitada à mão.",
        ],
      },
      {
        title: "Honestos sobre o que foi checado por pessoas",
        body: [
          "Criar tanto conteúdo em pouco tempo significa que uma parte ainda espera a revisão de um falante nativo. Em vez de esconder isso, os cursos que ainda estão nessa fila levam uma pequena nota de “Revisão comunitária em andamento”, assim você sempre sabe quais idiomas já foram revisados por uma pessoa e quais ainda não. A nota desaparece assim que a revisão de um curso é registrada.",
        ],
      },
      {
        title: "O que vem a seguir",
        anchor: "whats-next",
        roadmap: {
          intro: "Uma espiada no que estamos trabalhando. Sem datas, sem promessas — as coisas saem quando estão prontas.",
          buckets: [
            {
              label: "Em andamento",
              items: [
                { title: "O SquirreLingo em mais idiomas", badge: "Já disponível", badgeType: "done", desc: "Agora quase toda a interface se adapta ao seu idioma nativo — com detecção automática e um seletor. Algumas telas ainda estão só em inglês, e mais idiomas nativos estão a caminho." },
                { title: "Traduções abaixo das perguntas", badge: "Em implantação", badgeType: "rolling", desc: "Veja o que uma pergunta significa no seu idioma enquanto você ainda está aprendendo — expandindo curso por curso." },
                { title: "Explicações no seu idioma", badge: "Em implantação", badgeType: "rolling", desc: "Agora no seu idioma nativo, não só em inglês — com o idioma que você está aprendendo também, sendo implantado curso por curso." },
              ],
            },
            {
              label: "Em breve",
              items: [
                { title: "Testes de domínio e rankings com estrelas", desc: "Prove que você realmente domina uma categoria e ganhe estrelas por isso." },
              ],
            },
            {
              label: "Mais adiante",
              items: [
                { title: "Prática de ouvir e falar", desc: "Ouça, fale — uma forma totalmente nova de praticar." },
                { title: "Apps nas lojas", desc: "O SquirreLingo no Google Play e na App Store." },
              ],
            },
          ],
        },
      },
      {
        title: "Junte-se à comunidade",
        body: [
          "O SquirreLingo tem um grupo no Facebook — novidades de versões, dicas e um lugar para conversar direto com outros beta testers (e com o desenvolvedor). É um grupo privado durante a beta, então toque em {{fb|Entrar no grupo}} e você será aprovado.",
        ],
      },
    ],
    footer: "Dúvidas sobre como algo específico funciona? A {{help|página de Ajuda}} tem um passo a passo completo por cada tela e ícone. Encontrou um erro ou tem uma ideia? Também há um {{feedback|formulário de comentários}} para isso. Conhece alguém que gostaria de {{beta|se candidatar como beta tester}}?",
  },
  fr: {
    title: "À propos de SquirreLingo",
    tagline: "Un entraînement aux langues rapide et adapté au TDAH — avec aussi une option plus classique.",
    sections: [
      {
        title: "Ce qu’est cette appli",
        body: [
          "SquirreLingo est une appli d’entraînement aux langues bâtie autour de manches de questions courtes et sans pression — vocabulaire, grammaire, expressions et prononciation — plutôt qu’autour de longs parcours de leçons rigides. Choisis une langue, réponds à quelques questions, vois où tu en es, et arrête quand tu veux. Rien ne t’oblige à finir une « leçon » entière d’un coup. C’est une application web progressive, elle tourne donc directement dans ton navigateur, sur ton téléphone ou ton ordinateur — rien à télécharger.",
        ],
      },
      {
        title: "Façons de s’entraîner",
        body: [
          "*Quiz Rapide* est le mode d’origine, façon jeu — des manches courtes et mélangées au hasard, avec un chrono, des combos et des séries. Conçu pour un entraînement rapide et sans friction, par petites doses.",
          "*Leçons* est un mode plus calme, pas à pas — sans chrono, sans pression de combo. Il t’accompagne sujet par sujet, du plus facile au plus difficile, en montrant l’explication juste après chaque réponse pour que tu puisses vraiment l’assimiler avant de continuer. Un meilleur choix si tu préfères avancer méthodiquement plutôt que par salves aléatoires. Les deux modes suivent la même progression globale, donc passer de l’un à l’autre ne réinitialise jamais rien.",
          "En plus de ça, la plupart des langues ajoutent deux entraîneurs ciblés accessibles depuis le même sélecteur de mode : le *Gym de grammaire*, un exercice de conjugaison indépendant qui garde sa propre progression et ne touche jamais ton niveau ni ta série, et un mode *Alphabet* pour apprendre un nouveau système d’écriture — kana, hangeul, cyrillique ou caractères chinois — en partant de zéro.",
        ],
      },
      {
        title: "Les niveaux et le test de niveau",
        body: [
          "Chaque langue utilise le vrai cadre CECR employé par les certifications de langues officielles, avec des niveaux allant d’Aucune expérience à Natif, en passant par Débutant, Intermédiaire et Avancé (A1–C2). Tu ne sais pas où tu en es ? Chaque langue propose un court test de niveau, sans chrono, qui pioche dans tous les paliers pour lesquels elle a du contenu, ce qui lui permet de situer aussi bien les vrais débutants que les apprenants avancés.",
        ],
      },
      {
        title: "Suivre ta progression",
        body: [
          "L’écran propre à chaque langue comporte un suivi de maîtrise qui montre quelle part du contenu de cette langue tu as réellement apprise, catégorie par catégorie, avec tes XP et ta série au fil des parties.",
        ],
      },
      {
        title: "Plusieurs langues, de vraies différences régionales",
        body: [
          "Pour les anglophones, SquirreLingo enseigne neuf langues — espagnol, français, portugais, italien, allemand, russe, japonais, chinois mandarin et coréen — dont plusieurs avec des versions régionales réellement différentes (espagnol d’Amérique latine ou d’Espagne, français de France ou du Québec, portugais du Brésil ou du Portugal), soit douze parcours distincts au total. Là où une langue présente de vraies différences régionales, cette appli les traite comme des parcours séparés avec du contenu différent, et non comme le même matériel derrière un autre drapeau.",
          "L’appli fonctionne désormais dans ta propre langue, et pas seulement en anglais — elle détecte automatiquement ta langue d’après ton navigateur, avec un sélecteur de langue dans le coin de chaque écran de connexion si tu préfères la changer. Toute l’appli suit ensuite ta langue maternelle de bout en bout : connexion, première prise en main, menu et Réglages, et chaque sous-titre, option de réponse, explication et la Banque de mots pendant que tu apprends n’importe laquelle des langues proposées. Sur certaines langues, une carte bonus montre aussi comment un mot change d’un pays et d’une région à l’autre. D’autres combinaisons de langue maternelle arrivent.",
          "Les langues qui ont leur propre système d’écriture affichent toujours l’écriture native et sa romanisation ensemble — les kanji avec les romaji, le hangeul, les caractères chinois avec le pinyin. Et pour l’allemand, le russe, le japonais, le coréen et le mandarin, les questions de grammaire sont construites par des moteurs maison, donc chaque forme verbale est vérifiée par la machine plutôt que saisie à la main.",
        ],
      },
      {
        title: "Transparents sur ce qui a été vérifié par un humain",
        body: [
          "Construire autant de contenu aussi vite veut dire qu’une partie attend encore une relecture par un locuteur natif. Plutôt que de le cacher, les langues encore dans cette file portent une petite mention « Relecture par la communauté en cours », pour que tu saches toujours lesquelles ont été relues par un humain et lesquelles ne le sont pas encore. La mention disparaît une fois la relecture d’une langue enregistrée.",
        ],
      },
      {
        title: "Et ensuite",
        anchor: "whats-next",
        roadmap: {
          intro: "Un aperçu de ce sur quoi nous travaillons. Pas de dates, pas de promesses — les choses sortent quand elles sont prêtes.",
          buckets: [
            {
              label: "En cours",
              items: [
                { title: "SquirreLingo dans plus de langues", badge: "Disponible", badgeType: "done", desc: "Presque toute l’interface s’adapte désormais à ta langue maternelle — détectée automatiquement, avec un sélecteur. Quelques écrans restent uniquement en anglais, et d’autres langues maternelles arrivent progressivement." },
                { title: "Traductions sous les questions", badge: "Déploiement en cours", badgeType: "rolling", desc: "Vois ce que veut dire une question dans ta langue pendant que tu apprends encore — étendu langue par langue." },
                { title: "Explications dans ta langue", badge: "Déploiement en cours", badgeType: "rolling", desc: "Désormais dans ta langue maternelle, pas seulement en anglais — et aussi dans la langue que tu apprends, déployé langue par langue." },
              ],
            },
            {
              label: "Bientôt",
              items: [
                { title: "Quiz de maîtrise et classement par étoiles", desc: "Prouve que tu maîtrises vraiment une catégorie et gagne des étoiles pour ça." },
              ],
            },
            {
              label: "Plus tard",
              items: [
                { title: "Entraînement à l’écoute et à l’expression orale", desc: "L’entendre, le dire — une toute nouvelle façon de s’entraîner." },
                { title: "Applications sur les magasins", desc: "SquirreLingo sur Google Play et l’App Store." },
              ],
            },
          ],
        },
      },
      {
        title: "Rejoins la communauté",
        body: [
          "SquirreLingo a un groupe Facebook — nouvelles de versions, astuces, et un endroit pour discuter directement avec les autres bêta-testeurs (et avec le développeur). C’est un groupe privé pendant la bêta, alors touche {{fb|Rejoindre le groupe}} et tu seras accepté.",
        ],
      },
    ],
    footer: "Des questions sur le fonctionnement précis de quelque chose ? La {{help|page d’Aide}} contient un guide complet de chaque écran et de chaque icône. Tu as trouvé un bug ou tu as une idée ? Il y a aussi un {{feedback|formulaire de commentaires}} pour ça. Tu connais quelqu’un qui aimerait {{beta|postuler comme bêta-testeur}} ?",
  },
  it: {
    title: "Informazioni su SquirreLingo",
    tagline: "Allenamento linguistico rapido e adatto all’ADHD — con anche un’opzione più tradizionale.",
    sections: [
      {
        title: "Che cos’è questa app",
        body: [
          "SquirreLingo è un’app per allenarsi con le lingue costruita attorno a round di domande brevi e senza pressione — vocabolario, grammatica, modi di dire e pronuncia — invece che attorno a lunghi percorsi di lezioni rigidi. Scegli una lingua, rispondi a una manciata di domande, vedi come è andata e smetti quando vuoi. Niente ti obbliga a finire un’intera “lezione” in una volta sola. È un’applicazione web progressiva, quindi gira direttamente nel tuo browser, sul telefono o sul computer — non c’è nulla da scaricare.",
        ],
      },
      {
        title: "Modi per esercitarsi",
        body: [
          "*Quiz Rapido* è la modalità originale, in stile gioco — round brevi e mescolati a caso, con cronometro, punti combo e serie. Pensata per un allenamento rapido e senza attriti, a piccole dosi.",
          "*Lezioni* è una modalità più tranquilla, passo dopo passo — niente cronometro, niente pressione da combo. Ti accompagna un argomento alla volta, dal più facile in poi, mostrando la spiegazione subito dopo ogni risposta così puoi davvero assimilarla prima di continuare. È la scelta migliore se preferisci procedere con metodo invece che a raffiche casuali. Entrambe le modalità seguono gli stessi progressi complessivi, quindi passare dall’una all’altra non azzera mai nulla.",
          "Oltre a queste, la maggior parte dei corsi aggiunge due allenatori mirati raggiungibili dallo stesso selettore di modalità: la *Palestra di grammatica*, un esercizio di coniugazione indipendente che tiene i propri progressi e non tocca mai il tuo livello o la tua serie, e una modalità *Alfabeto* per imparare da zero un nuovo sistema di scrittura — kana, hangul, cirillico o caratteri cinesi.",
        ],
      },
      {
        title: "I livelli e il test di livello",
        body: [
          "Ogni corso usa il vero quadro QCER impiegato dalle certificazioni linguistiche ufficiali, con livelli che vanno da Nessuna esperienza a Madrelingua, passando per Principiante, Intermedio e Avanzato (A1–C2). Non sai a che punto sei? Ogni lingua propone un breve test di livello, senza cronometro, che pesca da tutti i gradini per cui il corso ha contenuti, così riesce a collocare sia i veri principianti sia chi è già avanzato.",
        ],
      },
      {
        title: "Seguire i tuoi progressi",
        body: [
          "La schermata dedicata a ogni lingua ha un monitoraggio della padronanza che mostra quanta parte dei contenuti di quella lingua hai davvero imparato, categoria per categoria, insieme ai tuoi XP e alla tua serie mentre giochi.",
        ],
      },
      {
        title: "Tante lingue, differenze regionali vere",
        body: [
          "Per chi parla inglese, SquirreLingo insegna nove lingue — spagnolo, francese, portoghese, italiano, tedesco, russo, giapponese, cinese mandarino e coreano — diverse delle quali con versioni regionali davvero differenti (spagnolo latinoamericano o europeo, francese di Francia o del Québec, portoghese brasiliano o europeo), per un totale di dodici corsi distinti. Dove una lingua ha differenze regionali reali, questa app le tratta come corsi separati con contenuti diversi, non come lo stesso materiale dietro un’altra bandiera.",
          "Ora l’app funziona nella tua lingua, non solo in inglese — rileva automaticamente la tua lingua dal browser, con un selettore di lingua nell’angolo di ogni schermata di accesso se preferisci cambiarla. Poi tutta l’app segue la tua lingua madre dall’inizio alla fine: l’accesso, la configurazione iniziale, il menu e le Impostazioni, e ogni sottotitolo, opzione di risposta, spiegazione e la Banca delle parole mentre impari una qualsiasi delle lingue disponibili. In alcuni corsi, una scheda bonus mostra anche come una parola cambia da paese a paese e da regione a regione. Altre combinazioni di lingua madre sono in arrivo.",
          "Le lingue con un proprio sistema di scrittura mostrano sempre insieme la scrittura originale e la sua romanizzazione — i kanji con i romaji, l’hangul, i caratteri cinesi con il pinyin. E per tedesco, russo, giapponese, coreano e mandarino le domande di grammatica sono costruite da motori interni, quindi ogni forma verbale è verificata dalla macchina invece che scritta a mano.",
        ],
      },
      {
        title: "Trasparenti su ciò che è stato controllato da una persona",
        body: [
          "Costruire così tanti contenuti in fretta significa che una parte aspetta ancora una revisione da parte di un madrelingua. Invece di nasconderlo, i corsi ancora in quella coda portano una piccola nota “Revisione della community in corso”, così sai sempre quali lingue sono state rilette da una persona e quali non ancora. La nota sparisce una volta registrata la revisione di un corso.",
        ],
      },
      {
        title: "Che cosa arriva",
        anchor: "whats-next",
        roadmap: {
          intro: "Un assaggio di ciò a cui stiamo lavorando. Niente date, niente promesse — le cose escono quando sono pronte.",
          buckets: [
            {
              label: "In corso",
              items: [
                { title: "SquirreLingo in più lingue", badge: "Già disponibile", badgeType: "done", desc: "Quasi tutta l’interfaccia si adatta ora alla tua lingua madre — rilevata automaticamente, con un selettore. Qualche schermata è ancora solo in inglese, e altre lingue madri stanno arrivando." },
                { title: "Traduzioni sotto le domande", badge: "In distribuzione", badgeType: "rolling", desc: "Vedi che cosa significa una domanda nella tua lingua mentre la stai ancora imparando — estese corso per corso." },
                { title: "Spiegazioni nella tua lingua", badge: "In distribuzione", badgeType: "rolling", desc: "Ora nella tua lingua madre, non solo in inglese — e anche nella lingua che stai imparando, in arrivo corso per corso." },
              ],
            },
            {
              label: "Presto",
              items: [
                { title: "Quiz di padronanza e classifiche a stelle", desc: "Dimostra di aver davvero padroneggiato una categoria e guadagna stelle per questo." },
              ],
            },
            {
              label: "Più avanti",
              items: [
                { title: "Allenamento di ascolto e conversazione", desc: "Sentilo, dillo — un modo di esercitarsi tutto nuovo." },
                { title: "App negli store", desc: "SquirreLingo su Google Play e sull’App Store." },
              ],
            },
          ],
        },
      },
      {
        title: "Unisciti alla community",
        body: [
          "SquirreLingo ha un gruppo Facebook — novità sulle versioni, consigli e un posto dove parlare direttamente con gli altri beta tester (e con lo sviluppatore). Durante la beta è un gruppo privato, quindi tocca {{fb|Unisciti al gruppo}} e verrai accettato.",
        ],
      },
    ],
    footer: "Domande su come funziona qualcosa di preciso? La {{help|pagina Aiuto}} contiene una guida completa di ogni schermata e di ogni icona. Hai trovato un bug o hai un’idea? C’è anche un {{feedback|modulo di feedback}} per questo. Conosci qualcuno a cui piacerebbe {{beta|candidarsi come beta tester}}?",
  },
};

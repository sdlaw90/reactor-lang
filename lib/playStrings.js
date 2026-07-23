const STRINGS = {
  loading: { en: "Loading…", es: "Cargando…" },
  statXpTotal: { en: "Total XP", es: "XP total" },
  statBestCombo: { en: "Best combo", es: "Mejor combo" },
  statRounds: { en: "Rounds", es: "Rondas" },
  levelLabel: { en: "Level:", es: "Nivel:" },
  levelAbbrev: { en: "Lvl.", es: "Nv." },
  change: { en: "Change", es: "Cambiar" },
  close: { en: "Close", es: "Cerrar" },
  notSureTakeQuiz: { en: "Not sure? Take the placement quiz", es: "¿No estás seguro? Hacer prueba de nivel" },
  readyToAdvance: { en: "Ready to advance to {level}?", es: "¿Listo para subir a {level}?" },
  yesAdvance: { en: "Yes, advance", es: "Sí, avanzar" },
  notYet: { en: "Not yet", es: "Todavía no" },
  roundFocus: { en: "Round focus:", es: "Enfoque de la ronda:" },
  mixed: { en: "Mixed", es: "Mixto" },
  // #88: theme filter (tag layer across categories)
  themeFocus: { en: "Theme (optional):", es: "Tema (opcional):" },
  allThemes: { en: "All themes", es: "Todos los temas" },
  // #88 combined focus (category ∩ theme) viability note
  comboReady: { en: "{n} items match your focus + theme.", es: "{n} elementos coinciden con tu enfoque + tema." },
  comboThin: { en: "Too few items match focus + theme ({n}) — the round will use the whole theme instead.", es: "Muy pocos elementos coinciden con enfoque + tema ({n}) — la ronda usará todo el tema en su lugar." },
  masteryLabel: { en: "Progress by category:", es: "Progreso por categoría:" },
  viewDetails: { en: "View details", es: "Ver detalles" },
  learnedOf: { en: "{learned}/{total} learned", es: "{learned}/{total} aprendidos" },
  startRound: { en: "START ROUND", es: "EMPEZAR RONDA" },
  reviewMistakes: { en: "REVIEW MISTAKES", es: "REPASAR FALLOS" },
  viewExplanations: { en: "View explanations ({n})", es: "Ver explicaciones ({n})" },
  exit: { en: "Exit", es: "Salir" },
  timeUp: { en: "Time's up — no answer was recorded.", es: "Se acabó el tiempo — no se registró ninguna respuesta." },
  noAnswer: { en: "No answer given", es: "No respondiste" },
  next: { en: "Next", es: "Siguiente" },
  wrongNoteHeader: { en: "Heads up", es: "Ojo" },
  reviewComplete: { en: "REVIEW COMPLETE", es: "REPASO COMPLETO" },
  roundComplete: { en: "ROUND COMPLETE", es: "RONDA COMPLETA" },
  statCorrect: { en: "Correct", es: "Correctas" },
  statXpEarned: { en: "XP earned", es: "XP ganado" },
  statMistakesResolved: { en: "Mistakes resolved", es: "Fallos resueltos" },
  statDailyStreak: { en: "Daily streak", es: "Racha diaria" },
  anotherRound: { en: "ANOTHER ROUND", es: "OTRA RONDA" },
  backToStart: { en: "Back to start", es: "Volver al inicio" },
  explanationsTitle: { en: "EXPLANATIONS", es: "EXPLICACIONES" },
  explanationsSubtitle: {
    en: "Your recent history — builds up with every round. No timer.",
    es: "Tu historial reciente — se acumula con cada ronda. Sin cronómetro.",
  },
  noExplanationsYet: { en: "No explanations yet — play a round first.", es: "Aún no hay explicaciones — juega una ronda primero." },
  viewArchive: { en: "View archive ({n})", es: "Ver archivo ({n})" },
  clearAll: { en: "Clear everything (history + archive)", es: "Limpiar todo (historial + archivo)" },
  archiveTitle: { en: "ARCHIVE", es: "ARCHIVO" },
  archiveSubtitle: { en: "Older explanations.", es: "Explicaciones más antiguas." },
  archiveEmpty: { en: "The archive is empty.", es: "El archivo está vacío." },
  loadMore: { en: "Load more", es: "Cargar más" },
  backToHistory: { en: "Back to history", es: "Volver al historial" },
  soundLegend: {
    en: "CAPS = the stressed syllable · ‿ = words blend together in fast speech",
    es: "MAYÚSCULAS = sílaba con más fuerza · ‿ = las palabras se unen al hablar rápido",
  },
  yourAnswer: { en: "— your answer", es: "— tu respuesta" },
  chooseLesson: { en: "Choose a topic to work through:", es: "Elige un tema para repasar:" },
  startLesson: { en: "START LESSON", es: "EMPEZAR LECCIÓN" },
  lessonComplete: { en: "LESSON COMPLETE", es: "LECCIÓN COMPLETA" },
  backToLessons: { en: "Back to topics", es: "Volver a los temas" },
  itemProgress: { en: "Item {current} of {total}", es: "Elemento {current} de {total}" },
  switchToQuickQuiz: { en: "Prefer quick, game-style rounds instead?", es: "¿Prefieres rondas rápidas y con puntos?" },
  switchToLessons: { en: "Prefer a calmer, step-by-step approach?", es: "¿Prefieres un enfoque más tranquilo, paso a paso?" },
  tryLessonsMode: { en: "Try Lessons mode", es: "Prueba el modo Lecciones" },
  tryQuickQuiz: { en: "Try Quick Quiz mode", es: "Prueba el modo Quiz Rápido" },
  modeQuickQuiz: { en: "Quick Quiz", es: "Quiz Rápido" },
  modeLessons: { en: "Lessons", es: "Lecciones" },
  modeGrammar: { en: "Grammar", es: "Gramática" },
  // Placement flow (#72 partial / tester bug 2026-07-11): the entire
  // placement flow renders in the person's NATIVE language, always — it's
  // where true beginners land, so target-language chrome is exactly wrong.
  // en/es coverage now (matching the rest of this table); the other eight
  // families ride the #72 sweep.
  placementNoTimer: { en: "no timer", es: "sin cronómetro" },
  placementResult: { en: "Result", es: "Resultado" },
  placementRecommended: { en: "Recommended level:", es: "Nivel recomendado:" },
  placementUseLevel: { en: "USE THIS LEVEL", es: "USAR ESTE NIVEL" },
  placementBackNoSave: { en: "Go back without saving", es: "Volver sin guardar" },
  placementNotEnough: {
    en: "This track doesn't have enough difficulty-tagged content yet for a placement quiz. Pick a level manually instead.",
    es: "Este idioma aún no tiene suficiente contenido etiquetado por dificultad para una prueba de nivel. Elige un nivel manualmente.",
  },
  placementBack: { en: "Back", es: "Volver" },
  // #U1 (2026-07-22): resume-in-progress prompt. en/es now (matching the rest of
  // the placement chrome); the other eight families ride the #72 sweep.
  placementResumeTitle: { en: "Welcome back", es: "¡Hola de nuevo!" },
  placementResumeBody: {
    en: "You already started this placement test — you were on question {current} of {total}. Pick up where you left off, or start fresh. Either way, nothing is lost.",
    es: "Ya empezaste esta prueba de nivel — ibas por la pregunta {current} de {total}. Continúa donde lo dejaste o empieza de nuevo. En ambos casos no se pierde nada.",
  },
  placementResumeContinue: { en: "Continue where I left off", es: "Continuar donde lo dejé" },
  placementResumeRestart: { en: "Start fresh", es: "Empezar de nuevo" },
  // #62 script practice mode (kana pilot). Chrome is native-language by
  // nature — the audience is people who can't read the target script yet.
  modeScript: { en: "Alphabet", es: "Alfabeto" },
  scriptLearnTab: { en: "Learn", es: "Aprender" },
  scriptPracticeTab: { en: "Practice", es: "Practicar" },
  scriptFamiliar: { en: "{n}/{total} familiar", es: "{n}/{total} conocidos" },
  scriptWhichSound: { en: "Which sound is this?", es: "¿Qué sonido es este?" },
  scriptWhichGlyph: { en: "Which symbol makes this sound?", es: "¿Qué símbolo hace este sonido?" },
  scriptCheckAnswers: { en: "Practice these groups", es: "Practicar estos grupos" },
  scriptRoundDone: { en: "NICE PRACTICE!", es: "¡BUENA PRÁCTICA!" },
  scriptGoAgain: { en: "PRACTICE AGAIN", es: "PRACTICAR OTRA VEZ" },
  scriptBackToLearn: { en: "Back to the charts", es: "Volver a las tablas" },
  scriptAllGroups: { en: "All groups", es: "Todos los grupos" },
  scriptNoticeTitle: { en: "New to {script}?", es: "¿Nuevo con {script}?" },
  scriptNotice: {
    en: "Learning the writing system first makes everything else easier — there's a whole practice mode for it, whenever you want it.",
    es: "Aprender primero el sistema de escritura facilita todo lo demás — hay un modo de práctica dedicado, cuando quieras.",
  },
  scriptNoticeCta: { en: "Check it out", es: "Ver el modo" },
  scriptNoticeDismiss: { en: "Maybe later", es: "Quizás luego" },
};

// Skill levels at which UI chrome shows in the person's native language rather
// than the language they're learning — early on, reading instructions in a
// language you don't know yet would just add friction.
const NATIVE_LANG_SKILL_LEVELS = ["none", "beginner", "intermediate"];

// The 4 category concepts every track uses (vocab/grammar/idioms/phonetics)
// mean the same thing regardless of which track they're attached to, so one
// shared translation table covers all 14 tracks at once -- no need for
// per-track native-language category labels.
const CATEGORY_NAMES = {
  vocab: {
    en: "Vocabulary", es: "Vocabulario", it: "Vocabolario", fr: "Vocabulaire", de: "Wortschatz",
    pt: "Vocabulário", ru: "Словарь", ja: "単語", zh: "词汇", ko: "단어",
  },
  gram: {
    en: "Grammar", es: "Gramática", it: "Grammatica", fr: "Grammaire", de: "Grammatik",
    pt: "Gramática", ru: "Грамматика", ja: "文法", zh: "语法", ko: "문법",
  },
  verbo: { en: "Grammar", es: "Verbos" }, // esForEn/esSpainForEn's legacy key for the same concept
  trad: {
    en: "Idioms", es: "Modismos", it: "Modi di dire", fr: "Expressions", de: "Redewendungen",
    pt: "Expressões", ru: "Идиомы", ja: "慣用句", zh: "成语", ko: "관용구",
  },
  fono: {
    en: "Phonetics", es: "Fonética", it: "Fonetica", fr: "Phonétique", de: "Phonetik",
    pt: "Fonética", ru: "Фонетика", ja: "発音", zh: "发音", ko: "발음",
  },
  // Frequency word bank (pilot: esForEn, 2026-07-10). Generated from a
  // frequency-ranked word list — see lib/frequencyVocab.js.
  fvocab: {
    en: "Word Bank", es: "Palabras", it: "Parole", fr: "Mots courants", de: "Wortbank",
    pt: "Palavras", ru: "Слова", ja: "頻出単語", zh: "常用词", ko: "빈출 단어",
  },
};

export function uiLangForSkill(skillLevel, viewerNativeLang, track) {
  if (NATIVE_LANG_SKILL_LEVELS.includes(skillLevel)) {
    return viewerNativeLang || track.nativeLang || "en";
  }
  // track.targetLang should always be set; "en" is just a safe universal
  // fallback if it's ever missing, not an assumption nativeLang is en/es.
  return track.targetLang || "en";
}

export function t(lang, key, vars) {
  const entry = STRINGS[key];
  if (!entry) return key;
  let str = entry[lang] || entry.en;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(`{${k}}`, vars[k]);
    });
  }
  return str;
}

// Category names (Vocabulary/Grammar/Idioms/Phonetics) previously only
// switched language for the narrow English-US/UK cross-dialect case
// (track.cats[catId].labelEn), never for the general skill-level-based
// native-language chrome everything else already respects. This fixes that:
// low-skill viewers see the category name in their own native language;
// higher-skill viewers still see the track's own target-language name
// (immersive, as originally designed).
export function categoryDisplayName(uiLang, viewerNativeLang, track, catId) {
  if (uiLang === viewerNativeLang && CATEGORY_NAMES[catId]) {
    return CATEGORY_NAMES[catId][uiLang] || track.cats[catId].label;
  }
  return track.cats[catId].labelEn && uiLang === "en" ? track.cats[catId].labelEn : track.cats[catId].label;
}

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
  masteryLabel: { en: "Progress by category:", es: "Progreso por categoría:" },
  viewDetails: { en: "View details", es: "Ver detalles" },
  learnedOf: { en: "{learned}/{total} learned", es: "{learned}/{total} aprendidos" },
  startRound: { en: "START ROUND", es: "EMPEZAR RONDA" },
  reviewMistakes: { en: "REVIEW MISTAKES", es: "REPASAR FALLOS" },
  viewExplanations: { en: "View explanations ({n})", es: "Ver explicaciones ({n})" },
  exit: { en: "Exit", es: "Salir" },
  next: { en: "Next", es: "Siguiente" },
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
  vocab: { en: "Vocabulary", es: "Vocabulario" },
  gram: { en: "Grammar", es: "Gramática" },
  verbo: { en: "Grammar", es: "Verbos" }, // esForEn/esSpainForEn's legacy key for the same concept
  trad: { en: "Idioms", es: "Modismos" },
  fono: { en: "Phonetics", es: "Fonética" },
};

export function uiLangForSkill(skillLevel, viewerNativeLang, track) {
  if (NATIVE_LANG_SKILL_LEVELS.includes(skillLevel)) {
    return viewerNativeLang || track.nativeLang || "en";
  }
  return track.targetLang || (track.nativeLang === "en" ? "es" : "en");
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

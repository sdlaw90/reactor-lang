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
};

// Skill levels at which UI chrome shows in the person's native language rather
// than the language they're learning — early on, reading instructions in a
// language you don't know yet would just add friction.
const NATIVE_LANG_SKILL_LEVELS = ["none", "beginner", "intermediate"];

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

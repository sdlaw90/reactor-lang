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
  // Home hub — the hub always renders in the person's own native language (it's
  // pre-track, before any immersion level applies). es/en now; other source
  // families ride the #72 sweep.
  quickWin: { en: "Pick your next quick win ⚡", es: "Elige tu próxima victoria ⚡" },
  trackNotStarted: { en: "Not started", es: "Sin empezar" },
  trackLevelChip: { en: "Level {level} · {skill}", es: "Nivel {level} · {skill}" },
  homeNoNativeHint: {
    en: "Showing every track for now — set your native language in Settings to personalize this list.",
    es: "Mostrando todos los idiomas por ahora — configura tu idioma nativo en Ajustes para personalizar esta lista.",
  },
  // #72: nav / settings drawer chrome
  navWhatsNew: { en: "What's New", es: "Novedades" },
  navHowToUse: { en: "How to use SquirreLingo", es: "Cómo usar SquirreLingo" },
  navAbout: { en: "About", es: "Acerca de" },
  navAdmin: { en: "Admin", es: "Administración" },
  navSettingsHeader: { en: "SETTINGS", es: "AJUSTES" },
  navMenu: { en: "Menu", es: "Menú" },
  navOpenMenu: { en: "Open menu", es: "Abrir menú" },
  navCloseMenu: { en: "Close menu", es: "Cerrar menú" },
  // #92 shared Back / Home chrome (BackHome), localized across all pages.
  navBack: { en: "Back", es: "Volver" },
  navHome: { en: "Home", es: "Inicio" },

  // #72 pre-login flow (auth / forgot / reset / onboarding). These render
  // before native_lang exists, so they use the bootstrap uiLang (lib/uiLang.js).
  // --- auth ---
  authSubSignin: { en: "Sign in to continue", es: "Inicia sesión para continuar" },
  authSubSignup: { en: "Create an account", es: "Crea una cuenta" },
  authIdentifier: { en: "Email or username", es: "Correo o nombre de usuario" },
  authPassword: { en: "Password", es: "Contraseña" },
  authUsername: { en: "Username", es: "Nombre de usuario" },
  authEmail: { en: "Email", es: "Correo electrónico" },
  authConfirmEmail: { en: "Confirm email", es: "Confirmar correo" },
  authConfirmPassword: { en: "Confirm password", es: "Confirmar contraseña" },
  authBtnSignin: { en: "SIGN IN", es: "INICIAR SESIÓN" },
  authBtnSignup: { en: "SIGN UP", es: "REGISTRARSE" },
  authForgot: { en: "Forgot password?", es: "¿Olvidaste tu contraseña?" },
  authSigninHint: {
    en: "You can sign in with either your username or your email — either works.",
    es: "Puedes iniciar sesión con tu nombre de usuario o tu correo — cualquiera funciona.",
  },
  authAgreePre: { en: "I agree to the ", es: "Acepto los " },
  authAgreeTos: { en: "Terms of Service", es: "Términos del servicio" },
  authAgreeMid: { en: " and ", es: " y la " },
  authAgreePp: { en: "Privacy Policy", es: "Política de privacidad" },
  authNeedAccount: { en: "Need an account? Sign up", es: "¿Necesitas una cuenta? Regístrate" },
  authHaveAccount: { en: "Already have an account? Sign in", es: "¿Ya tienes una cuenta? Inicia sesión" },
  authBetaPre: { en: "Don't have an invite yet? ", es: "¿Aún no tienes invitación? " },
  authBetaLink: { en: "Apply to beta test", es: "Solicita ser beta tester" },
  authErrEmailMismatch: { en: "Email addresses don't match.", es: "Los correos no coinciden." },
  authErrPwMismatch: { en: "Passwords don't match.", es: "Las contraseñas no coinciden." },
  authErrPwLen: { en: "Password must be at least 6 characters.", es: "La contraseña debe tener al menos 6 caracteres." },
  authErrUserRequired: { en: "Username is required.", es: "El nombre de usuario es obligatorio." },
  authErrUserLen: { en: "Username must be at least 3 characters.", es: "El nombre de usuario debe tener al menos 3 caracteres." },
  authErrAgree: {
    en: "You need to agree to the Terms of Service and Privacy Policy to continue.",
    es: "Debes aceptar los Términos del servicio y la Política de privacidad para continuar.",
  },
  authErrUserTaken: {
    en: "That username is already taken — try Verify above for some available alternatives.",
    es: "Ese nombre de usuario ya está en uso — prueba «Verificar» arriba para ver alternativas disponibles.",
  },
  authErrEmailExists: {
    en: "An account with that email already exists. Try signing in, or use 'Forgot password' if you don't remember your password.",
    es: "Ya existe una cuenta con ese correo. Intenta iniciar sesión, o usa «¿Olvidaste tu contraseña?» si no la recuerdas.",
  },
  authErrEmailExistsShort: {
    en: "An account with that email already exists. Try signing in instead.",
    es: "Ya existe una cuenta con ese correo. Mejor intenta iniciar sesión.",
  },
  authErrInvalidCreds: { en: "Invalid login credentials.", es: "Credenciales incorrectas." },
  authErrGeneric: { en: "Something went wrong.", es: "Algo salió mal." },
  authInfoConfirm: {
    en: "Check your email to confirm your account, then sign in.",
    es: "Revisa tu correo para confirmar tu cuenta y luego inicia sesión.",
  },
  // --- onboarding ---
  obLangTitle: { en: "What's your native language?", es: "¿Cuál es tu idioma nativo?" },
  obLangSub: { en: "This decides which languages show up for you to learn.", es: "Esto define qué idiomas aparecen para que aprendas." },
  obSearchLang: { en: "Search languages…", es: "Buscar idiomas…" },
  obContinue: { en: "Continue", es: "Continuar" },
  obCountryTitle: { en: "What's your native country?", es: "¿Cuál es tu país de origen?" },
  obCountrySub: {
    en: "Optional — personalizes a little flag/region tag on your home screen.",
    es: "Opcional — personaliza una pequeña etiqueta de bandera/región en tu pantalla de inicio.",
  },
  obSearchCountry: { en: "Search countries…", es: "Buscar países…" },
  obSkip: { en: "Skip", es: "Omitir" },
  obPicTitle: { en: "Pick a profile picture", es: "Elige una foto de perfil" },
  obPicSub: {
    en: "Optional — a photo, a fun icon, or a flag. You can change this anytime in Settings.",
    es: "Opcional — una foto, un ícono divertido o una bandera. Puedes cambiarlo cuando quieras en Ajustes.",
  },
  obTabPhoto: { en: "Photo", es: "Foto" },
  obTabIcon: { en: "Icon", es: "Ícono" },
  obTabFlag: { en: "Flag", es: "Bandera" },
  obChooseFile: { en: "Choose file…", es: "Elegir archivo…" },
  obFinish: { en: "Finish", es: "Finalizar" },
  // --- forgot / reset password ---
  fpResetTitle: { en: "Reset your password", es: "Restablece tu contraseña" },
  fpEmailSub: {
    en: "Enter your account email. If security questions are set up for the account, they'll appear next.",
    es: "Ingresa el correo de tu cuenta. Si hay preguntas de seguridad configuradas, aparecerán a continuación.",
  },
  fpEmailPh: { en: "Your email", es: "Tu correo" },
  fpContinue: { en: "CONTINUE", es: "CONTINUAR" },
  fpBackToSignin: { en: "Back to sign in", es: "Volver a iniciar sesión" },
  fpQuestionsSub: {
    en: "Answer your security questions — at least 2 of 3 must match. Answers aren't case-sensitive.",
    es: "Responde tus preguntas de seguridad — al menos 2 de 3 deben coincidir. Las respuestas no distinguen mayúsculas.",
  },
  fpHintLabel: { en: "Your password hint:", es: "Tu pista de contraseña:" },
  fpRememberedPre: { en: "(Remembered it? ", es: "(¿La recordaste? " },
  fpGoSignin: { en: "Go sign in", es: "Inicia sesión" },
  fpRememberedPost: { en: " instead.)", es: " en su lugar.)" },
  fpCheckAnswers: { en: "CHECK ANSWERS", es: "VERIFICAR RESPUESTAS" },
  fpCantRemember: { en: "Can't remember? Request an admin reset", es: "¿No la recuerdas? Solicita un restablecimiento por un administrador" },
  fpNoQuestions: {
    en: "This account doesn't have security questions set up, so it can't self-serve a reset.",
    es: "Esta cuenta no tiene preguntas de seguridad configuradas, así que no puede restablecerse por sí sola.",
  },
  fpAdminPre: {
    en: "If the hint doesn't help, an admin can set a temporary password for you — request one below, then check back by trying to sign in later.",
    es: "Si la pista no ayuda, un administrador puede crear una contraseña temporal — solicítala abajo y vuelve a intentar iniciar sesión más tarde.",
  },
  fpAdminPreNoHint: {
    en: "An admin can set a temporary password for you — request one below, then check back by trying to sign in later.",
    es: "Un administrador puede crear una contraseña temporal — solicítala abajo y vuelve a intentar iniciar sesión más tarde.",
  },
  fpRequestAdmin: { en: "REQUEST ADMIN RESET", es: "SOLICITAR RESTABLECIMIENTO" },
  fpNewPwSub: { en: "Answers matched — set your new password.", es: "Las respuestas coinciden — define tu nueva contraseña." },
  fpNewPw: { en: "New password", es: "Nueva contraseña" },
  fpConfirmNewPw: { en: "Confirm new password", es: "Confirmar nueva contraseña" },
  fpUpdatePassword: { en: "UPDATE PASSWORD", es: "ACTUALIZAR CONTRASEÑA" },
  fpDone: { en: "Password updated — taking you to sign in…", es: "Contraseña actualizada — te llevamos a iniciar sesión…" },
  fpRequested: {
    en: "Request sent. An admin will set a temporary password for the account if one exists — try signing in again later, and change the temporary password in Settings once you're in.",
    es: "Solicitud enviada. Un administrador creará una contraseña temporal para la cuenta si existe — vuelve a intentar iniciar sesión más tarde y cambia la contraseña temporal en Ajustes cuando entres.",
  },
  fpErrExpired: {
    en: "Something went wrong. The reset link may have expired — request a new one.",
    es: "Algo salió mal. Es posible que el enlace de restablecimiento haya caducado — solicita uno nuevo.",
  },
  rpSetTitle: { en: "Set a new password", es: "Define una nueva contraseña" },

  // #72 settings drawer (post-login SettingsPanel). Rendered in the person's
  // native language (session.user.user_metadata.native_lang). es/en now;
  // other source families ride the #72 sweep. Spanish is the #41-approved
  // es-LatAm map from the settings-drawer i18n preview.
  // --- group headers / titles ---
  setDrawerTitle: { en: "Settings", es: "Ajustes" },
  setGroupProfile: { en: "Profile", es: "Perfil" },
  setGroupAccount: { en: "Account", es: "Cuenta" },
  setGroupLang: { en: "Language & Learning", es: "Idioma y aprendizaje" },
  setGroupSub: { en: "Subscription", es: "Suscripción" },
  setGroupFeedback: { en: "Feedback", es: "Comentarios" },
  setTitlePic: { en: "Profile picture", es: "Foto de perfil" },
  setTitleUsername: { en: "Username", es: "Nombre de usuario" },
  setTitleEmail: { en: "Email", es: "Correo electrónico" },
  setTitlePassword: { en: "Password", es: "Contraseña" },
  setTitleRecovery: { en: "Password recovery", es: "Recuperación de contraseña" },
  setTitleNative: { en: "Native / base language", es: "Idioma nativo / base" },
  setTitleCountry: { en: "Native country", es: "País de origen" },
  setTitleGameplay: { en: "Gameplay", es: "Juego" },
  // --- buttons / generic ---
  setBtnEdit: { en: "Edit", es: "Editar" },
  setBtnSave: { en: "Save", es: "Guardar" },
  setBtnCancel: { en: "Cancel", es: "Cancelar" },
  setBtnBusy: { en: "...", es: "..." },
  setSaved: { en: "Saved.", es: "Guardado." },
  setNotSet: { en: "(not set)", es: "(sin configurar)" },
  // --- profile picture ---
  setTabPhoto: { en: "Photo", es: "Foto" },
  setTabIcon: { en: "Icon", es: "Ícono" },
  setTabFlag: { en: "Flag", es: "Bandera" },
  setBtnChooseFile: { en: "Choose file…", es: "Elegir archivo…" },
  setPhSearchCountry: { en: "Search countries…", es: "Buscar países…" },
  setPhUsername: { en: "Username", es: "Nombre de usuario" },
  setAvatarPhoto: { en: "Custom photo", es: "Foto personalizada" },
  setAvatarFlag: { en: "Flag", es: "Bandera" },
  setAvatarIcon: { en: "Icon", es: "Ícono" },
  setErrPhotoSize: { en: "Photo must be under 3MB.", es: "La foto debe pesar menos de 3 MB." },
  setErrPickIcon: { en: "Pick an icon.", es: "Elige un ícono." },
  setErrPickFlag: { en: "Pick a flag.", es: "Elige una bandera." },
  setErrChoosePhoto: { en: "Choose a photo to upload.", es: "Elige una foto para subir." },
  setErrGeneric: { en: "Something went wrong.", es: "Algo salió mal." },
  // --- username ---
  setErrUsernameEmpty: { en: "Username can't be empty.", es: "El nombre de usuario no puede estar vacío." },
  setErrUsernameTaken: { en: "That username is already taken.", es: "Ese nombre de usuario ya está en uso." },
  // --- email ---
  setPhNewEmail: { en: "New email", es: "Nuevo correo" },
  setPhConfirmEmail: { en: "Confirm new email", es: "Confirmar nuevo correo" },
  setPhCurPwConfirm: { en: "Current password (to confirm it's you)", es: "Contraseña actual (para confirmar que eres tú)" },
  setNoteEmailSaved: { en: "Check your new email to confirm the change.", es: "Revisa tu nuevo correo para confirmar el cambio." },
  setErrEmailsMismatch: { en: "Emails don't match.", es: "Los correos no coinciden." },
  setErrCurPwRequired: { en: "Enter your current password to confirm this change.", es: "Ingresa tu contraseña actual para confirmar este cambio." },
  setErrCurPwWrong: { en: "Current password is incorrect.", es: "La contraseña actual es incorrecta." },
  // --- password ---
  setPhCurPw: { en: "Current password", es: "Contraseña actual" },
  setPhNewPw: { en: "New password", es: "Nueva contraseña" },
  setPhConfirmPw: { en: "Confirm new password", es: "Confirmar nueva contraseña" },
  setNotePwSaved: { en: "Other signed-in devices have been logged out for security.", es: "Se cerró la sesión en los demás dispositivos por seguridad." },
  setErrPwLen: { en: "New password must be at least 6 characters.", es: "La nueva contraseña debe tener al menos 6 caracteres." },
  setErrPwMismatch: { en: "New passwords don't match.", es: "Las nuevas contraseñas no coinciden." },
  // --- password recovery ---
  setRecNotSetUp: { en: "Not set up", es: "Sin configurar" },
  setRecStatusQuestions: { en: "{n} security questions on file", es: "{n} preguntas de seguridad guardadas" },
  setRecHintSuffix: { en: " · hint set", es: " · pista configurada" },
  setRecStatusHintOnly: { en: "Hint set · no security questions yet", es: "Pista configurada · aún sin preguntas de seguridad" },
  setRecNoteNone: {
    en: "Without security questions, a forgotten password means waiting on an admin reset — setting them up takes a minute and lets you reset it yourself.",
    es: "Sin preguntas de seguridad, si olvidas tu contraseña tendrás que esperar a que un administrador la restablezca — configurarlas toma un minuto y te permite restablecerla tú mismo.",
  },
  setRecNoteEdit: {
    en: "The hint shows to anyone who enters your email on the reset page — make it useful to you, useless to others. Answers aren't case-sensitive, but spelling counts. For your security, saved answers are never shown again — re-entering all three replaces the old set; leaving all three empty changes only the hint.",
    es: "La pista se muestra a cualquiera que ingrese tu correo en la página de restablecimiento — hazla útil para ti e inútil para los demás. Las respuestas no distinguen mayúsculas, pero la ortografía cuenta. Por tu seguridad, las respuestas guardadas no se vuelven a mostrar — volver a ingresar las tres reemplaza el conjunto anterior; dejar las tres vacías cambia solo la pista.",
  },
  setErrRecoveryIncomplete: {
    en: "Fill in all three questions and answers, or leave all three empty to keep your questions as they are.",
    es: "Completa las tres preguntas y respuestas, o deja las tres vacías para mantener tus preguntas como están.",
  },
  setErrRecoveryDupes: { en: "Pick three different questions.", es: "Elige tres preguntas diferentes." },
  setPhHint: { en: "Password hint (optional)", es: "Pista de contraseña (opcional)" },
  setPhAnswer: { en: "Answer", es: "Respuesta" },
  setOptQuestion: { en: "— Question {n} —", es: "— Pregunta {n} —" },
  setAriaHint: { en: "Password hint", es: "Pista de contraseña" },
  setAriaSecurityQuestion: { en: "Security question {n}", es: "Pregunta de seguridad {n}" },
  setAriaAnswer: { en: "Answer to security question {n}", es: "Respuesta a la pregunta de seguridad {n}" },
  // --- native language / country ---
  setPhSearchLang: { en: "Search languages…", es: "Buscar idiomas…" },
  setNativeNote: {
    en: "Changing this only changes which languages show up to learn — progress in tracks you've already played is kept.",
    es: "Cambiar esto solo cambia qué idiomas aparecen para aprender — se conserva tu progreso en los idiomas que ya jugaste.",
  },
  setNeedNativeFirst: { en: "Set your native language above first.", es: "Primero define tu idioma nativo arriba." },
  setCountryNote: {
    en: "Combined with your native language, this determines the regional label shown on the home screen (e.g. Spanish + Venezuela → \"Español (Latinoamérica)\").",
    es: "Junto con tu idioma nativo, esto determina la etiqueta regional que se muestra en la pantalla de inicio (p. ej. español + Venezuela → \"Español (Latinoamérica)\").",
  },
  // --- gameplay ---
  setGpReviewOn: { en: "Review mode: on", es: "Modo repaso: activado" },
  setGpReviewOff: { en: "Review mode: off", es: "Modo repaso: desactivado" },
  setGpSummary: {
    en: "{perCat} questions/category · {pairs} phonetics pairs · question audio {qAudio} · answer-choice audio {cAudio} · tense hints {tHints} · {time}s{phon} per question",
    es: "{perCat} preguntas/categoría · {pairs} pares de fonética · audio de pregunta {qAudio} · audio de opciones {cAudio} · pistas de tiempo verbal {tHints} · {time}s{phon} por pregunta",
  },
  setGpOn: { en: "on", es: "activado" },
  setGpOff: { en: "off", es: "desactivado" },
  setGpOnF: { en: "on", es: "activadas" },
  setGpOffF: { en: "off", es: "desactivadas" },
  setGpSummaryPhon: { en: " ({time}s phonetics)", es: " ({time}s fonética)" },
  setGpTogReview: {
    en: "Pause after each answer to review the explanation (tap \"Next\" to continue)",
    es: "Pausar después de cada respuesta para repasar la explicación (toca \"Siguiente\" para continuar)",
  },
  setGpTogQaudio: {
    en: "Show a speaker button on questions that have audio (tap to hear the prompt read aloud — never plays automatically)",
    es: "Mostrar un botón de altavoz en las preguntas que tienen audio (toca para escuchar la consigna en voz alta — nunca se reproduce solo)",
  },
  setGpTogCaudio: {
    en: "Show a speaker button on the answer choices too — only after you've answered (in review/pause), tap to hear an option read aloud. Rolling out per track; appears where option audio exists.",
    es: "Mostrar un botón de altavoz también en las opciones de respuesta — solo después de responder (en repaso/pausa), toca para escuchar una opción en voz alta. Se habilita por pista; aparece donde hay audio de opciones.",
  },
  setGpTogTense: {
    en: "Tense training-wheels: on verb-conjugation questions, name the tense being asked for and why. On by default; you can also dismiss it in-round once you reach an advanced level.",
    es: "Rueditas de apoyo para tiempos verbales: en las preguntas de conjugación, indica qué tiempo se pide y por qué. Activado por defecto; también puedes ocultarlo durante la ronda al llegar a un nivel avanzado.",
  },
  setGpPerCat: { en: "Questions per category (mixed rounds)", es: "Preguntas por categoría (rondas mixtas)" },
  setGpPairs: { en: "Phonetics pairs per round", es: "Pares de fonética por ronda" },
  setGpSameTimer: { en: "Same time limit for every question type", es: "Mismo límite de tiempo para todos los tipos de pregunta" },
  setGpSecSame: { en: "Seconds per question", es: "Segundos por pregunta" },
  setGpSecRegular: { en: "Seconds (regular)", es: "Segundos (normal)" },
  setGpSecPhon: { en: "Seconds (phonetics)", es: "Segundos (fonética)" },
  // --- subscription / feedback / footer ---
  setComingSoon: { en: "Coming soon.", es: "Próximamente." },
  setFbBug: { en: "🐞 Report a bug", es: "🐞 Reportar un error" },
  setFbFeature: { en: "💡 Suggest a feature", es: "💡 Sugerir una función" },
  setSignOut: { en: "Sign out", es: "Cerrar sesión" },
  setTos: { en: "Terms of Service", es: "Términos del servicio" },
  setPrivacy: { en: "Privacy Policy", es: "Política de privacidad" },

  // #72 beta-apply (pre-login flow; renders before native_lang exists, so it
  // uses the bootstrap uiLang — lib/uiLang.js). Spanish is AI-authored, written
  // gender-neutral (no "/a" forms), pending #41 native review. Option-set values
  // stay English canonical (the stored/POSTed value); only the label is localized.
  baTitle: { en: "Apply to beta test", es: "Solicita ser beta tester" },
  baSubtitle: {
    en: "Takes about 3 minutes. Tell us about you and how you like to practice.",
    es: "Toma unos 3 minutos. Cuéntanos sobre ti y cómo te gusta practicar.",
  },
  baStepAboutYou: { en: "About You", es: "Sobre ti" },
  baStepLangBg: { en: "Language Background", es: "Tu experiencia con idiomas" },
  baStepHabits: { en: "Practice Habits & Fit", es: "Hábitos de práctica y afinidad" },
  baStepCommitment: { en: "Beta Commitment", es: "Compromiso con la beta" },
  baStepAccount: { en: "Your Account", es: "Tu cuenta" },
  baBack: { en: "Back", es: "Atrás" },
  baNext: { en: "Next", es: "Siguiente" },
  baSubmit: { en: "Submit application", es: "Enviar solicitud" },
  baSending: { en: "Sending...", es: "Enviando..." },
  baFooterPre: { en: "Already have an account? ", es: "¿Ya tienes una cuenta? " },
  baFooterLink: { en: "Sign in instead", es: "Inicia sesión" },
  // --- step 0: About You ---
  baFieldName: { en: "Name or nickname", es: "Nombre o apodo" },
  baFieldEmail: { en: "Email", es: "Correo electrónico" },
  baFieldAge: { en: "How old are you?", es: "¿Qué edad tienes?" },
  baAgeUnder18: { en: "Under 18", es: "Menos de 18" },
  baAge18_24: { en: "18–24", es: "18–24" },
  baAge25_34: { en: "25–34", es: "25–34" },
  baAge35_44: { en: "35–44", es: "35–44" },
  baAge45_54: { en: "45–54", es: "45–54" },
  baAge55plus: { en: "55+", es: "55+" },
  baFieldDevices: { en: "What device(s) would you test SquirreLingo on?", es: "¿En qué dispositivo(s) probarías SquirreLingo?" },
  baDevAndroid: { en: "Android phone", es: "Teléfono Android" },
  baDevIphone: { en: "iPhone", es: "iPhone" },
  baDevTablet: { en: "Tablet (Android or iPad)", es: "Tablet (Android o iPad)" },
  baDevDesktop: { en: "Desktop/laptop browser (Windows or Mac)", es: "Navegador de computadora o laptop (Windows o Mac)" },
  baDevChromebook: { en: "Chromebook", es: "Chromebook" },
  baFieldBrowser: { en: "Which browser do you use most on that device?", es: "¿Qué navegador usas más en ese dispositivo?" },
  baBrowChrome: { en: "Chrome", es: "Chrome" },
  baBrowSafari: { en: "Safari", es: "Safari" },
  baBrowFirefox: { en: "Firefox", es: "Firefox" },
  baBrowEdge: { en: "Edge", es: "Edge" },
  baBrowSamsung: { en: "Samsung Internet", es: "Samsung Internet" },
  baBrowOther: { en: "Other", es: "Otro" },
  // --- step 1: Language Background ---
  baFieldNative: { en: "What is your native language (or strongest language)?", es: "¿Cuál es tu idioma nativo (o el idioma que dominas mejor)?" },
  baFieldTarget: { en: "Which language(s) do you want to practice with SquirreLingo?", es: "¿Qué idioma(s) quieres practicar con SquirreLingo?" },
  baFieldLevel: { en: "How would you rate your current level in that language?", es: "¿Cómo calificarías tu nivel actual en ese idioma?" },
  baLvlComplete: { en: "Complete beginner (a few words at most)", es: "Principiante total (unas pocas palabras, como mucho)" },
  baLvlBeginner: { en: "Beginner (basic phrases, simple vocabulary)", es: "Principiante (frases básicas, vocabulario simple)" },
  baLvlIntermediate: { en: "Intermediate (can hold simple conversations)", es: "Intermedio (puedo mantener conversaciones sencillas)" },
  baLvlAdvanced: { en: "Advanced (comfortable in most conversations)", es: "Avanzado (me desenvuelvo bien en la mayoría de las conversaciones)" },
  baLvlNative: { en: "Native/fluent", es: "Nativo/fluido" },
  baFieldDialect: {
    en: "Any preference for a specific regional variety or dialect (e.g. Latin American vs. European Spanish)?",
    es: "¿Tienes preferencia por alguna variedad regional o dialecto en específico (por ejemplo, español latinoamericano vs. europeo)?",
  },
  baFieldApps: { en: "Which language-learning apps or methods have you used before?", es: "¿Qué apps o métodos para aprender idiomas has usado antes?" },
  baAppDuolingo: { en: "Duolingo", es: "Duolingo" },
  baAppBabbel: { en: "Babbel", es: "Babbel" },
  baAppRosetta: { en: "Rosetta Stone", es: "Rosetta Stone" },
  baAppAnki: { en: "Anki / flashcards", es: "Anki / tarjetas de memoria" },
  baAppClasses: { en: "Classes or tutoring", es: "Clases o tutorías" },
  baAppImmersion: { en: "Immersion (family, friends, travel, work)", es: "Inmersión (familia, amistades, viajes, trabajo)" },
  baAppNone: { en: "None — this would be my first", es: "Ninguno — esta sería mi primera vez" },
  baFieldFrustration: { en: "What's your biggest frustration with the language apps you've tried?", es: "¿Cuál es tu mayor frustración con las apps de idiomas que has probado?" },
  // --- step 2: Practice Habits & Fit ---
  baFieldFrequency: { en: "How often do you realistically see yourself practicing?", es: "Siendo realista, ¿con qué frecuencia te ves practicando?" },
  baFreqMulti: { en: "Multiple times a day", es: "Varias veces al día" },
  baFreqDaily: { en: "Once a day", es: "Una vez al día" },
  baFreqFewWeek: { en: "A few times a week", es: "Unas cuantas veces por semana" },
  baFreqWeekly: { en: "Once a week", es: "Una vez por semana" },
  baFreqSporadic: { en: "Sporadically", es: "De vez en cuando" },
  baFieldSessionLen: { en: "How long is your ideal practice session?", es: "¿Cuánto dura tu sesión de práctica ideal?" },
  baSlenUnder5: { en: "Under 5 minutes", es: "Menos de 5 minutos" },
  baSlen5_10: { en: "5–10 minutes", es: "5–10 minutos" },
  baSlen10_20: { en: "10–20 minutes", es: "10–20 minutos" },
  baSlen20plus: { en: "20+ minutes", es: "Más de 20 minutos" },
  baFieldAppeal: {
    en: "SquirreLingo uses short rounds, instant feedback, and streak/combo mechanics instead of penalties (plus a calmer no-timer mode). How appealing does that sound?",
    es: "SquirreLingo usa rondas cortas, retroalimentación al instante y mecánicas de rachas y combos en lugar de castigos (además de un modo más tranquilo, sin cronómetro). ¿Qué tan atractivo te suena eso?",
  },
  baAppealLow: { en: "Not my style", es: "No es mi estilo" },
  baAppealHigh: { en: "Exactly what I want", es: "Justo lo que busco" },
  baFieldFocus: { en: "Do you find it hard to stay focused or consistent with traditional study methods?", es: "¿Se te dificulta mantener la concentración o la constancia con los métodos de estudio tradicionales?" },
  baFocusVery: { en: "Yes, very much", es: "Sí, muchísimo" },
  baFocusSomewhat: { en: "Somewhat", es: "Un poco" },
  baFocusNotReally: { en: "Not really", es: "La verdad no" },
  baFocusNotSure: { en: "Not sure", es: "No sabría decir" },
  // --- step 3: Beta Commitment ---
  baFieldCommit: { en: "During the beta period (about 2–4 weeks), how much time could you commit to testing?", es: "Durante el periodo de la beta (unas 2–4 semanas), ¿cuánto tiempo podrías dedicar a las pruebas?" },
  baCommitDaily: { en: "15+ minutes most days", es: "15+ minutos casi todos los días" },
  baCommitFew: { en: "A few sessions per week", es: "Unas cuantas sesiones por semana" },
  baCommitOneTwo: { en: "One or two sessions per week", es: "Una o dos sesiones por semana" },
  baCommitOccasional: { en: "Only occasional use", es: "Solo uso ocasional" },
  baFieldPrior: { en: "Have you beta tested apps or software before?", es: "¿Has probado apps o software en beta antes?" },
  baPriorSeveral: { en: "Yes, several times", es: "Sí, varias veces" },
  baPriorOnceTwice: { en: "Once or twice", es: "Una o dos veces" },
  baPriorFirst: { en: "No, this would be my first", es: "No, esta sería mi primera vez" },
  baFieldBugComfort: { en: "How comfortable are you reporting bugs with details (what you did, what happened, screenshots)?", es: "¿Qué tan a gusto te sientes reportando errores con detalles (qué hiciste, qué pasó, capturas de pantalla)?" },
  baBugLow: { en: "Not comfortable", es: "Nada a gusto" },
  baBugHigh: { en: "Very comfortable", es: "Muy a gusto" },
  baFieldReason: { en: "Why do you want to beta test SquirreLingo?", es: "¿Por qué quieres ser beta tester de SquirreLingo?" },
  baFieldAnything: { en: "Anything else we should know about you?", es: "¿Algo más que debamos saber sobre ti?" },
  // --- step 4: Your Account ---
  baAcctIntro: {
    en: "Last step — set up your login. Your account is created the moment you submit, and you'll be signed in right away.",
    es: "Último paso — configura tu inicio de sesión. Tu cuenta se crea en el momento en que envías la solicitud, y tu sesión se inicia de inmediato.",
  },
  baFieldUsername: { en: "Pick a username", es: "Elige un nombre de usuario" },
  baUsernameHint: { en: "At least 3 characters — letters, numbers, and _ only.", es: "Al menos 3 caracteres — solo letras, números y _." },
  baFieldPassword: { en: "Choose a password", es: "Elige una contraseña" },
  baPhPassword: { en: "Password (min 6 characters)", es: "Contraseña (mínimo 6 caracteres)" },
  baFieldConfirm: { en: "Confirm password", es: "Confirma la contraseña" },
  baPhConfirm: { en: "Repeat password", es: "Repite la contraseña" },
  baPwNoMatch: { en: "Passwords don't match yet.", es: "Las contraseñas aún no coinciden." },
  baPwMatch: { en: "Passwords match ✓", es: "Las contraseñas coinciden ✓" },
  baRecoveryLead: { en: "Password recovery (optional, recommended):", es: "Recuperación de contraseña (opcional, recomendada):" },
  baRecoveryBody: {
    en: " we can't email reset links during the beta, so a password hint and three security questions are the only way to reset a forgotten password yourself. Skip them and you'd have to request an admin reset instead. You can also set these up later in Settings.",
    es: " durante la beta no podemos enviar enlaces de restablecimiento por correo, así que una pista de contraseña y tres preguntas de seguridad son la única forma de restablecer por tu cuenta una contraseña olvidada. Si las omites, tendrías que pedirle a un administrador que la restablezca. También puedes configurarlas más adelante en Ajustes.",
  },
  baFieldHint: { en: "Password hint", es: "Pista de contraseña" },
  baPhHint: { en: "A hint only you understand (shown on the reset page)", es: "Una pista que solo tú entiendas (se muestra en la página de restablecimiento)" },
  baSecQLabel: { en: "Security question {n}", es: "Pregunta de seguridad {n}" },
  baAriaAnswer: { en: "Answer to security question {n}", es: "Respuesta a la pregunta de seguridad {n}" },
  baSecQChoose: { en: "— Choose a question —", es: "— Elige una pregunta —" },
  baPhAnswer: { en: "Answer (not case-sensitive)", es: "Respuesta (no distingue mayúsculas de minúsculas)" },
  // --- validation ---
  baErrStep0: { en: "Name, email, and at least one device are needed to move on.", es: "Necesitamos tu nombre, tu correo y al menos un dispositivo para continuar." },
  baErrStep1: { en: "Your native language, target language(s), and current level are needed to move on.", es: "Necesitamos tu idioma nativo, el/los idioma(s) que quieres practicar y tu nivel actual para continuar." },
  baErrStep2: { en: "Practice frequency and session length are needed to move on.", es: "Necesitamos tu frecuencia de práctica y la duración de la sesión para continuar." },
  baErrStep3: { en: "How much time you could commit is needed to move on.", es: "Necesitamos saber cuánto tiempo podrías dedicar para continuar." },
  baErrUsername: { en: "Username must be at least 3 characters (letters, numbers, and _ only).", es: "El nombre de usuario debe tener al menos 3 caracteres (solo letras, números y _)." },
  baErrPwLen: { en: "Password must be at least 6 characters.", es: "La contraseña debe tener al menos 6 caracteres." },
  baErrPwMismatch: { en: "Passwords don't match.", es: "Las contraseñas no coinciden." },
  baErrSqPartial: { en: "Security questions: fill in all three questions and answers, or leave all three empty to skip.", es: "Preguntas de seguridad: completa las tres preguntas y respuestas, o deja las tres vacías para omitirlas." },
  baErrSqDistinct: { en: "Security questions: pick three different questions.", es: "Preguntas de seguridad: elige tres preguntas diferentes." },
  baErrUserTaken: { en: "That username is already taken — try Verify above for available alternatives.", es: "Ese nombre de usuario ya está en uso — prueba «Verificar» arriba para ver alternativas disponibles." },
  baErrGeneric: { en: "Something went wrong submitting your application — please try again.", es: "Algo salió mal al enviar tu solicitud — inténtalo de nuevo, por favor." },
  // --- success screens ---
  baOkTitle: { en: "You're in! 🐿️", es: "¡Estás dentro! 🐿️" },
  baOkBody1: { en: "Your beta account is ready — sign in with the email and password you just chose.", es: "Tu cuenta de beta está lista — inicia sesión con el correo y la contraseña que acabas de elegir." },
  baOkBtn: { en: "Go to sign in", es: "Ir a iniciar sesión" },
  baThanksTitle: { en: "Thanks for applying! 🐿️", es: "¡Gracias por postularte! 🐿️" },
  baThanksBody1: { en: "Your application was received. If you're a good fit for the current round of testing, you'll hear back at the email you provided.", es: "Recibimos tu solicitud. Si encajas bien con la ronda de pruebas actual, te contactaremos al correo que nos diste." },
  baThanksBtn: { en: "Already have an invite? Sign in", es: "¿Ya tienes una invitación? Inicia sesión" },
  baFbPre: { en: "While you're at it: the ", es: "Y de paso: el " },
  baFbLink: { en: "SquirreLingo Facebook group", es: "grupo de SquirreLingo en Facebook" },
  baFbPost: {
    en: " is where release news and tester chat happen — it's private during the beta, so request to join and you'll be approved.",
    es: " es donde se comparten las novedades de cada versión y se conversa entre testers — es privado durante la beta, así que solicita unirte y te aprobaremos.",
  },
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

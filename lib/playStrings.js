const STRINGS = {
  loading: { en: "Loading…", es: "Cargando…", pt: "Carregando…" },
  statXpTotal: { en: "Total XP", es: "XP total", pt: "XP total" },
  statBestCombo: { en: "Best combo", es: "Mejor combo", pt: "Melhor combo" },
  statRounds: { en: "Rounds", es: "Rondas", pt: "Rodadas" },
  levelLabel: { en: "Level:", es: "Nivel:", pt: "Nível:" },
  levelAbbrev: { en: "Lvl.", es: "Nv.", pt: "Nv." },
  change: { en: "Change", es: "Cambiar", pt: "Mudar" },
  close: { en: "Close", es: "Cerrar", pt: "Fechar" },
  notSureTakeQuiz: { en: "Not sure? Take the placement quiz", es: "¿No estás seguro? Hacer prueba de nivel", pt: "Não tem certeza? Faça o teste de nível" },
  readyToAdvance: { en: "Ready to advance to {level}?", es: "¿Listo para subir a {level}?", pt: "Pronto para avançar para {level}?" },
  yesAdvance: { en: "Yes, advance", es: "Sí, avanzar", pt: "Sim, avançar" },
  notYet: { en: "Not yet", es: "Todavía no", pt: "Ainda não" },
  roundFocus: { en: "Round focus:", es: "Enfoque de la ronda:", pt: "Foco da rodada:" },
  mixed: { en: "Mixed", es: "Mixto", pt: "Misto" },
  // #88: theme filter (tag layer across categories)
  themeFocus: { en: "Theme (optional):", es: "Tema (opcional):", pt: "Tema (opcional):" },
  allThemes: { en: "All themes", es: "Todos los temas", pt: "Todos os temas" },
  // #88 combined focus (category ∩ theme) viability note
  comboReady: { en: "{n} items match your focus + theme.", es: "{n} elementos coinciden con tu enfoque + tema.", pt: "{n} itens combinam com seu foco + tema." },
  comboThin: { en: "Too few items match focus + theme ({n}) — the round will use the whole theme instead.", es: "Muy pocos elementos coinciden con enfoque + tema ({n}) — la ronda usará todo el tema en su lugar.", pt: "Poucos itens combinam com foco + tema ({n}) — a rodada vai usar o tema inteiro em vez disso." },
  masteryLabel: { en: "Progress by category:", es: "Progreso por categoría:", pt: "Progresso por categoria:" },
  viewDetails: { en: "View details", es: "Ver detalles", pt: "Ver detalhes" },
  learnedOf: { en: "{learned}/{total} learned", es: "{learned}/{total} aprendidos", pt: "{learned}/{total} aprendidos" },
  startRound: { en: "START ROUND", es: "EMPEZAR RONDA", pt: "COMEÇAR RODADA" },
  reviewMistakes: { en: "REVIEW MISTAKES", es: "REPASAR FALLOS", pt: "REVISAR ERROS" },
  viewExplanations: { en: "View explanations ({n})", es: "Ver explicaciones ({n})", pt: "Ver explicações ({n})" },
  exit: { en: "Exit", es: "Salir", pt: "Sair" },
  timeUp: { en: "Time's up — no answer was recorded.", es: "Se acabó el tiempo — no se registró ninguna respuesta.", pt: "O tempo acabou — nenhuma resposta foi registrada." },
  noAnswer: { en: "No answer given", es: "No respondiste", pt: "Sem resposta" },
  next: { en: "Next", es: "Siguiente", pt: "Próximo" },
  wrongNoteHeader: { en: "Heads up", es: "Ojo", pt: "Atenção" },
  reviewComplete: { en: "REVIEW COMPLETE", es: "REPASO COMPLETO", pt: "REVISÃO CONCLUÍDA" },
  roundComplete: { en: "ROUND COMPLETE", es: "RONDA COMPLETA", pt: "RODADA CONCLUÍDA" },
  statCorrect: { en: "Correct", es: "Correctas", pt: "Corretas" },
  statXpEarned: { en: "XP earned", es: "XP ganado", pt: "XP ganho" },
  statMistakesResolved: { en: "Mistakes resolved", es: "Fallos resueltos", pt: "Erros resolvidos" },
  statDailyStreak: { en: "Daily streak", es: "Racha diaria", pt: "Sequência diária" },
  anotherRound: { en: "ANOTHER ROUND", es: "OTRA RONDA", pt: "OUTRA RODADA" },
  backToStart: { en: "Back to start", es: "Volver al inicio", pt: "Voltar ao início" },
  explanationsTitle: { en: "EXPLANATIONS", es: "EXPLICACIONES", pt: "EXPLICAÇÕES" },
  explanationsSubtitle: {
    en: "Your recent history — builds up with every round. No timer.",
    es: "Tu historial reciente — se acumula con cada ronda. Sin cronómetro.",
    pt: "Seu histórico recente — cresce a cada rodada. Sem cronômetro.",
  },
  noExplanationsYet: { en: "No explanations yet — play a round first.", es: "Aún no hay explicaciones — juega una ronda primero.", pt: "Ainda não há explicações — jogue uma rodada primeiro." },
  viewArchive: { en: "View archive ({n})", es: "Ver archivo ({n})", pt: "Ver arquivo ({n})" },
  clearAll: { en: "Clear everything (history + archive)", es: "Limpiar todo (historial + archivo)", pt: "Limpar tudo (histórico + arquivo)" },
  archiveTitle: { en: "ARCHIVE", es: "ARCHIVO", pt: "ARQUIVO" },
  archiveSubtitle: { en: "Older explanations.", es: "Explicaciones más antiguas.", pt: "Explicações mais antigas." },
  archiveEmpty: { en: "The archive is empty.", es: "El archivo está vacío.", pt: "O arquivo está vazio." },
  loadMore: { en: "Load more", es: "Cargar más", pt: "Carregar mais" },
  backToHistory: { en: "Back to history", es: "Volver al historial", pt: "Voltar ao histórico" },
  soundLegend: {
    en: "CAPS = the stressed syllable · ‿ = words blend together in fast speech",
    es: "MAYÚSCULAS = sílaba con más fuerza · ‿ = las palabras se unen al hablar rápido",
    pt: "MAIÚSCULAS = a sílaba tônica · ‿ = as palavras se juntam na fala rápida",
  },
  yourAnswer: { en: "— your answer", es: "— tu respuesta", pt: "— sua resposta" },
  chooseLesson: { en: "Choose a topic to work through:", es: "Elige un tema para repasar:", pt: "Escolha um tópico para trabalhar:" },
  startLesson: { en: "START LESSON", es: "EMPEZAR LECCIÓN", pt: "COMEÇAR LIÇÃO" },
  lessonComplete: { en: "LESSON COMPLETE", es: "LECCIÓN COMPLETA", pt: "LIÇÃO CONCLUÍDA" },
  backToLessons: { en: "Back to topics", es: "Volver a los temas", pt: "Voltar aos tópicos" },
  itemProgress: { en: "Item {current} of {total}", es: "Elemento {current} de {total}", pt: "Item {current} de {total}" },
  switchToQuickQuiz: { en: "Prefer quick, game-style rounds instead?", es: "¿Prefieres rondas rápidas y con puntos?", pt: "Prefere rodadas rápidas, estilo jogo?" },
  switchToLessons: { en: "Prefer a calmer, step-by-step approach?", es: "¿Prefieres un enfoque más tranquilo, paso a paso?", pt: "Prefere uma abordagem mais tranquila, passo a passo?" },
  tryLessonsMode: { en: "Try Lessons mode", es: "Prueba el modo Lecciones", pt: "Experimente o modo Lições" },
  tryQuickQuiz: { en: "Try Quick Quiz mode", es: "Prueba el modo Quiz Rápido", pt: "Experimente o modo Quiz Rápido" },
  modeQuickQuiz: { en: "Quick Quiz", es: "Quiz Rápido", pt: "Quiz Rápido" },
  modeLessons: { en: "Lessons", es: "Lecciones", pt: "Lições" },
  modeGrammar: { en: "Grammar", es: "Gramática", pt: "Gramática" },
  // Placement flow (#72 partial / tester bug 2026-07-11): the entire
  // placement flow renders in the person's NATIVE language, always — it's
  // where true beginners land, so target-language chrome is exactly wrong.
  // en/es coverage now (matching the rest of this table); the other eight
  // families ride the #72 sweep.
  placementNoTimer: { en: "no timer", es: "sin cronómetro", pt: "sem cronômetro" },
  placementResult: { en: "Result", es: "Resultado", pt: "Resultado" },
  placementRecommended: { en: "Recommended level:", es: "Nivel recomendado:", pt: "Nível recomendado:" },
  placementUseLevel: { en: "USE THIS LEVEL", es: "USAR ESTE NIVEL", pt: "USAR ESTE NÍVEL" },
  placementBackNoSave: { en: "Go back without saving", es: "Volver sin guardar", pt: "Voltar sem salvar" },
  placementNotEnough: {
    en: "This track doesn't have enough difficulty-tagged content yet for a placement quiz. Pick a level manually instead.",
    es: "Este idioma aún no tiene suficiente contenido etiquetado por dificultad para una prueba de nivel. Elige un nivel manualmente.",
    pt: "Este idioma ainda não tem conteúdo suficiente marcado por dificuldade para um teste de nível. Escolha um nível manualmente.",
  },
  placementBack: { en: "Back", es: "Volver", pt: "Voltar" },
  // #U1 (2026-07-22): resume-in-progress prompt. en/es now (matching the rest of
  // the placement chrome); the other eight families ride the #72 sweep.
  placementResumeTitle: { en: "Welcome back", es: "¡Hola de nuevo!", pt: "Bem-vindo de volta" },
  placementResumeBody: {
    en: "You already started this placement test — you were on question {current} of {total}. Pick up where you left off, or start fresh. Either way, nothing is lost.",
    es: "Ya empezaste esta prueba de nivel — ibas por la pregunta {current} de {total}. Continúa donde lo dejaste o empieza de nuevo. En ambos casos no se pierde nada.",
    pt: "Você já começou este teste de nível — estava na pergunta {current} de {total}. Continue de onde parou ou recomece. De qualquer forma, nada se perde.",
  },
  placementResumeContinue: { en: "Continue where I left off", es: "Continuar donde lo dejé", pt: "Continuar de onde parei" },
  placementResumeRestart: { en: "Start fresh", es: "Empezar de nuevo", pt: "Recomeçar" },
  // #62 script practice mode (kana pilot). Chrome is native-language by
  // nature — the audience is people who can't read the target script yet.
  modeScript: { en: "Alphabet", es: "Alfabeto", pt: "Alfabeto" },
  scriptLearnTab: { en: "Learn", es: "Aprender", pt: "Aprender" },
  scriptPracticeTab: { en: "Practice", es: "Practicar", pt: "Praticar" },
  scriptFamiliar: { en: "{n}/{total} familiar", es: "{n}/{total} conocidos", pt: "{n}/{total} conhecidos" },
  scriptWhichSound: { en: "Which sound is this?", es: "¿Qué sonido es este?", pt: "Que som é este?" },
  scriptWhichGlyph: { en: "Which symbol makes this sound?", es: "¿Qué símbolo hace este sonido?", pt: "Qual símbolo faz este som?" },
  scriptCheckAnswers: { en: "Practice these groups", es: "Practicar estos grupos", pt: "Praticar estes grupos" },
  scriptRoundDone: { en: "NICE PRACTICE!", es: "¡BUENA PRÁCTICA!", pt: "BOA PRÁTICA!" },
  scriptGoAgain: { en: "PRACTICE AGAIN", es: "PRACTICAR OTRA VEZ", pt: "PRATICAR DE NOVO" },
  scriptBackToLearn: { en: "Back to the charts", es: "Volver a las tablas", pt: "Voltar às tabelas" },
  scriptAllGroups: { en: "All groups", es: "Todos los grupos", pt: "Todos os grupos" },
  scriptNoticeTitle: { en: "New to {script}?", es: "¿Nuevo con {script}?", pt: "Novo em {script}?" },
  scriptNotice: {
    en: "Learning the writing system first makes everything else easier — there's a whole practice mode for it, whenever you want it.",
    es: "Aprender primero el sistema de escritura facilita todo lo demás — hay un modo de práctica dedicado, cuando quieras.",
    pt: "Aprender o sistema de escrita primeiro facilita todo o resto — há um modo de prática só para isso, quando você quiser.",
  },
  scriptNoticeCta: { en: "Check it out", es: "Ver el modo", pt: "Dar uma olhada" },
  scriptNoticeDismiss: { en: "Maybe later", es: "Quizás luego", pt: "Talvez depois" },
  // Home hub — the hub always renders in the person's own native language (it's
  // pre-track, before any immersion level applies). es/en now; other source
  // families ride the #72 sweep.
  quickWin: { en: "Pick your next quick win ⚡", es: "Elige tu próxima victoria ⚡", pt: "Escolha sua próxima vitória rápida ⚡" },
  trackNotStarted: { en: "Not started", es: "Sin empezar", pt: "Não iniciado" },
  trackLevelChip: { en: "Level {level} · {skill}", es: "Nivel {level} · {skill}", pt: "Nível {level} · {skill}" },
  homeNoNativeHint: {
    en: "Showing every track for now — set your native language in Settings to personalize this list.",
    es: "Mostrando todos los idiomas por ahora — configura tu idioma nativo en Ajustes para personalizar esta lista.",
    pt: "Mostrando todos os idiomas por enquanto — defina seu idioma nativo em Configurações para personalizar esta lista.",
  },
  // #72: nav / settings drawer chrome
  navWhatsNew: { en: "What's New", es: "Novedades", pt: "Novidades" },
  navHowToUse: { en: "How to use SquirreLingo", es: "Cómo usar SquirreLingo", pt: "Como usar o SquirreLingo" },
  navAbout: { en: "About", es: "Acerca de", pt: "Sobre" },
  navAdmin: { en: "Admin", es: "Administración", pt: "Administração" },
  navSettingsHeader: { en: "SETTINGS", es: "AJUSTES", pt: "CONFIGURAÇÕES" },
  navMenu: { en: "Menu", es: "Menú", pt: "Menu" },
  navOpenMenu: { en: "Open menu", es: "Abrir menú", pt: "Abrir menu" },
  navCloseMenu: { en: "Close menu", es: "Cerrar menú", pt: "Fechar menu" },
  // #92 shared Back / Home chrome (BackHome), localized across all pages.
  navBack: { en: "Back", es: "Volver", pt: "Voltar" },
  navHome: { en: "Home", es: "Inicio", pt: "Início" },
  // #72 changelog / what's new
  clTitle: { en: "Changelog", es: "Registro de cambios", pt: "Registro de mudanças" },
  clCurrentlyPublished: { en: "Currently published:", es: "Versión actual:", pt: "Versão atual:" },
  wnTitle: { en: "What's new", es: "Novedades", pt: "Novidades" },
  wnSeeFullChangelog: { en: "See full changelog", es: "Ver el registro completo", pt: "Ver registro completo" },

  // #72 pre-login flow (auth / forgot / reset / onboarding). These render
  // before native_lang exists, so they use the bootstrap uiLang (lib/uiLang.js).
  // --- auth ---
  authSubSignin: { en: "Sign in to continue", es: "Inicia sesión para continuar", pt: "Entre para continuar" },
  authSubSignup: { en: "Create an account", es: "Crea una cuenta", pt: "Crie uma conta" },
  authIdentifier: { en: "Email or username", es: "Correo o nombre de usuario", pt: "E-mail ou nome de usuário" },
  authPassword: { en: "Password", es: "Contraseña", pt: "Senha" },
  authUsername: { en: "Username", es: "Nombre de usuario", pt: "Nome de usuário" },
  authEmail: { en: "Email", es: "Correo electrónico", pt: "E-mail" },
  authConfirmEmail: { en: "Confirm email", es: "Confirmar correo", pt: "Confirmar e-mail" },
  authConfirmPassword: { en: "Confirm password", es: "Confirmar contraseña", pt: "Confirmar senha" },
  authBtnSignin: { en: "SIGN IN", es: "INICIAR SESIÓN", pt: "ENTRAR" },
  authBtnSignup: { en: "SIGN UP", es: "REGISTRARSE", pt: "CRIAR CONTA" },
  authForgot: { en: "Forgot password?", es: "¿Olvidaste tu contraseña?", pt: "Esqueceu a senha?" },
  authSigninHint: {
    en: "You can sign in with either your username or your email — either works.",
    es: "Puedes iniciar sesión con tu nombre de usuario o tu correo — cualquiera funciona.",
    pt: "Você pode entrar com seu nome de usuário ou seu e-mail — qualquer um funciona.",
  },
  authAgreePre: { en: "I agree to the ", es: "Acepto los ", pt: "Concordo com os " },
  authAgreeTos: { en: "Terms of Service", es: "Términos del servicio", pt: "Termos de Serviço" },
  authAgreeMid: { en: " and ", es: " y la ", pt: " e a " },
  authAgreePp: { en: "Privacy Policy", es: "Política de privacidad", pt: "Política de Privacidade" },
  authNeedAccount: { en: "Need an account? Sign up", es: "¿Necesitas una cuenta? Regístrate", pt: "Precisa de uma conta? Cadastre-se" },
  authHaveAccount: { en: "Already have an account? Sign in", es: "¿Ya tienes una cuenta? Inicia sesión", pt: "Já tem uma conta? Entre" },
  authBetaPre: { en: "Don't have an invite yet? ", es: "¿Aún no tienes invitación? ", pt: "Ainda não tem convite? " },
  authBetaLink: { en: "Apply to beta test", es: "Solicita ser beta tester", pt: "Candidate-se para testar a beta" },
  authErrEmailMismatch: { en: "Email addresses don't match.", es: "Los correos no coinciden.", pt: "Os e-mails não coincidem." },
  authErrPwMismatch: { en: "Passwords don't match.", es: "Las contraseñas no coinciden.", pt: "As senhas não coincidem." },
  authErrPwLen: { en: "Password must be at least 6 characters.", es: "La contraseña debe tener al menos 6 caracteres.", pt: "A senha deve ter pelo menos 6 caracteres." },
  authErrUserRequired: { en: "Username is required.", es: "El nombre de usuario es obligatorio.", pt: "O nome de usuário é obrigatório." },
  authErrUserLen: { en: "Username must be at least 3 characters.", es: "El nombre de usuario debe tener al menos 3 caracteres.", pt: "O nome de usuário deve ter pelo menos 3 caracteres." },
  authErrAgree: {
    en: "You need to agree to the Terms of Service and Privacy Policy to continue.",
    es: "Debes aceptar los Términos del servicio y la Política de privacidad para continuar.",
    pt: "Você precisa concordar com os Termos de Serviço e a Política de Privacidade para continuar.",
  },
  authErrUserTaken: {
    en: "That username is already taken — try Verify above for some available alternatives.",
    es: "Ese nombre de usuario ya está en uso — prueba «Verificar» arriba para ver alternativas disponibles.",
    pt: "Esse nome de usuário já está em uso — use «Verificar» acima para ver algumas alternativas disponíveis.",
  },
  authErrEmailExists: {
    en: "An account with that email already exists. Try signing in, or use 'Forgot password' if you don't remember your password.",
    es: "Ya existe una cuenta con ese correo. Intenta iniciar sesión, o usa «¿Olvidaste tu contraseña?» si no la recuerdas.",
    pt: "Já existe uma conta com esse e-mail. Tente entrar, ou use 'Esqueceu a senha?' se não lembrar da sua senha.",
  },
  authErrEmailExistsShort: {
    en: "An account with that email already exists. Try signing in instead.",
    es: "Ya existe una cuenta con ese correo. Mejor intenta iniciar sesión.",
    pt: "Já existe uma conta com esse e-mail. Tente entrar em vez disso.",
  },
  authErrInvalidCreds: { en: "Invalid login credentials.", es: "Credenciales incorrectas.", pt: "Credenciais inválidas." },
  authErrGeneric: { en: "Something went wrong.", es: "Algo salió mal.", pt: "Algo deu errado." },
  authInfoConfirm: {
    en: "Check your email to confirm your account, then sign in.",
    es: "Revisa tu correo para confirmar tu cuenta y luego inicia sesión.",
    pt: "Verifique seu e-mail para confirmar sua conta e depois entre.",
  },
  // --- onboarding ---
  obLangTitle: { en: "What's your native language?", es: "¿Cuál es tu idioma nativo?", pt: "Qual é o seu idioma nativo?" },
  obLangSub: { en: "This decides which languages show up for you to learn.", es: "Esto define qué idiomas aparecen para que aprendas.", pt: "Isso define quais idiomas aparecem para você aprender." },
  obSearchLang: { en: "Search languages…", es: "Buscar idiomas…", pt: "Buscar idiomas…" },
  obContinue: { en: "Continue", es: "Continuar", pt: "Continuar" },
  obCountryTitle: { en: "What's your native country?", es: "¿Cuál es tu país de origen?", pt: "Qual é o seu país de origem?" },
  obCountrySub: {
    en: "Optional — personalizes a little flag/region tag on your home screen.",
    es: "Opcional — personaliza una pequeña etiqueta de bandera/región en tu pantalla de inicio.",
    pt: "Opcional — personaliza uma pequena etiqueta de bandeira/região na sua tela inicial.",
  },
  obSearchCountry: { en: "Search countries…", es: "Buscar países…", pt: "Buscar países…" },
  obSkip: { en: "Skip", es: "Omitir", pt: "Pular" },
  obPicTitle: { en: "Pick a profile picture", es: "Elige una foto de perfil", pt: "Escolha uma foto de perfil" },
  obPicSub: {
    en: "Optional — a photo, a fun icon, or a flag. You can change this anytime in Settings.",
    es: "Opcional — una foto, un ícono divertido o una bandera. Puedes cambiarlo cuando quieras en Ajustes.",
    pt: "Opcional — uma foto, um ícone divertido ou uma bandeira. Você pode mudar isso quando quiser em Configurações.",
  },
  obTabPhoto: { en: "Photo", es: "Foto", pt: "Foto" },
  obTabIcon: { en: "Icon", es: "Ícono", pt: "Ícone" },
  obTabFlag: { en: "Flag", es: "Bandera", pt: "Bandeira" },
  obChooseFile: { en: "Choose file…", es: "Elegir archivo…", pt: "Escolher arquivo…" },
  obFinish: { en: "Finish", es: "Finalizar", pt: "Concluir" },
  // --- forgot / reset password ---
  fpResetTitle: { en: "Reset your password", es: "Restablece tu contraseña", pt: "Redefina sua senha" },
  fpEmailSub: {
    en: "Enter your account email. If security questions are set up for the account, they'll appear next.",
    es: "Ingresa el correo de tu cuenta. Si hay preguntas de seguridad configuradas, aparecerán a continuación.",
    pt: "Digite o e-mail da sua conta. Se houver perguntas de segurança configuradas, elas aparecerão em seguida.",
  },
  fpEmailPh: { en: "Your email", es: "Tu correo", pt: "Seu e-mail" },
  fpContinue: { en: "CONTINUE", es: "CONTINUAR", pt: "CONTINUAR" },
  fpBackToSignin: { en: "Back to sign in", es: "Volver a iniciar sesión", pt: "Voltar para entrar" },
  fpQuestionsSub: {
    en: "Answer your security questions — at least 2 of 3 must match. Answers aren't case-sensitive.",
    es: "Responde tus preguntas de seguridad — al menos 2 de 3 deben coincidir. Las respuestas no distinguen mayúsculas.",
    pt: "Responda suas perguntas de segurança — pelo menos 2 de 3 devem coincidir. As respostas não diferenciam maiúsculas de minúsculas.",
  },
  fpHintLabel: { en: "Your password hint:", es: "Tu pista de contraseña:", pt: "Sua dica de senha:" },
  fpRememberedPre: { en: "(Remembered it? ", es: "(¿La recordaste? ", pt: "(Lembrou? " },
  fpGoSignin: { en: "Go sign in", es: "Inicia sesión", pt: "Entrar" },
  fpRememberedPost: { en: " instead.)", es: " en su lugar.)", pt: " em vez disso.)" },
  fpCheckAnswers: { en: "CHECK ANSWERS", es: "VERIFICAR RESPUESTAS", pt: "VERIFICAR RESPOSTAS" },
  fpCantRemember: { en: "Can't remember? Request an admin reset", es: "¿No la recuerdas? Solicita un restablecimiento por un administrador", pt: "Não lembra? Solicite uma redefinição por um administrador" },
  fpNoQuestions: {
    en: "This account doesn't have security questions set up, so it can't self-serve a reset.",
    es: "Esta cuenta no tiene preguntas de seguridad configuradas, así que no puede restablecerse por sí sola.",
    pt: "Esta conta não tem perguntas de segurança configuradas, então não é possível redefinir por conta própria.",
  },
  fpAdminPre: {
    en: "If the hint doesn't help, an admin can set a temporary password for you — request one below, then check back by trying to sign in later.",
    es: "Si la pista no ayuda, un administrador puede crear una contraseña temporal — solicítala abajo y vuelve a intentar iniciar sesión más tarde.",
    pt: "Se a dica não ajudar, um administrador pode criar uma senha temporária para você — solicite uma abaixo e depois tente entrar novamente mais tarde.",
  },
  fpAdminPreNoHint: {
    en: "An admin can set a temporary password for you — request one below, then check back by trying to sign in later.",
    es: "Un administrador puede crear una contraseña temporal — solicítala abajo y vuelve a intentar iniciar sesión más tarde.",
    pt: "Um administrador pode criar uma senha temporária para você — solicite uma abaixo e depois tente entrar novamente mais tarde.",
  },
  fpRequestAdmin: { en: "REQUEST ADMIN RESET", es: "SOLICITAR RESTABLECIMIENTO", pt: "SOLICITAR REDEFINIÇÃO" },
  fpNewPwSub: { en: "Answers matched — set your new password.", es: "Las respuestas coinciden — define tu nueva contraseña.", pt: "As respostas coincidiram — defina sua nova senha." },
  fpNewPw: { en: "New password", es: "Nueva contraseña", pt: "Nova senha" },
  fpConfirmNewPw: { en: "Confirm new password", es: "Confirmar nueva contraseña", pt: "Confirmar nova senha" },
  fpUpdatePassword: { en: "UPDATE PASSWORD", es: "ACTUALIZAR CONTRASEÑA", pt: "ATUALIZAR SENHA" },
  fpDone: { en: "Password updated — taking you to sign in…", es: "Contraseña actualizada — te llevamos a iniciar sesión…", pt: "Senha atualizada — levando você para entrar…" },
  fpRequested: {
    en: "Request sent. An admin will set a temporary password for the account if one exists — try signing in again later, and change the temporary password in Settings once you're in.",
    es: "Solicitud enviada. Un administrador creará una contraseña temporal para la cuenta si existe — vuelve a intentar iniciar sesión más tarde y cambia la contraseña temporal en Ajustes cuando entres.",
    pt: "Solicitação enviada. Um administrador criará uma senha temporária para a conta, se ela existir — tente entrar novamente mais tarde e mude a senha temporária em Configurações assim que entrar.",
  },
  fpErrExpired: {
    en: "Something went wrong. The reset link may have expired — request a new one.",
    es: "Algo salió mal. Es posible que el enlace de restablecimiento haya caducado — solicita uno nuevo.",
    pt: "Algo deu errado. O link de redefinição pode ter expirado — solicite um novo.",
  },
  rpSetTitle: { en: "Set a new password", es: "Define una nueva contraseña", pt: "Defina uma nova senha" },

  // #72 settings drawer (post-login SettingsPanel). Rendered in the person's
  // native language (session.user.user_metadata.native_lang). es/en now;
  // other source families ride the #72 sweep. Spanish is the #41-approved
  // es-LatAm map from the settings-drawer i18n preview.
  // --- group headers / titles ---
  setDrawerTitle: { en: "Settings", es: "Ajustes", pt: "Configurações" },
  setGroupProfile: { en: "Profile", es: "Perfil", pt: "Perfil" },
  setGroupAccount: { en: "Account", es: "Cuenta", pt: "Conta" },
  setGroupLang: { en: "Language & Learning", es: "Idioma y aprendizaje", pt: "Idioma e aprendizado" },
  setGroupSub: { en: "Subscription", es: "Suscripción", pt: "Assinatura" },
  setGroupFeedback: { en: "Feedback", es: "Comentarios", pt: "Comentários" },
  setTitlePic: { en: "Profile picture", es: "Foto de perfil", pt: "Foto de perfil" },
  setTitleUsername: { en: "Username", es: "Nombre de usuario", pt: "Nome de usuário" },
  setTitleEmail: { en: "Email", es: "Correo electrónico", pt: "E-mail" },
  setTitlePassword: { en: "Password", es: "Contraseña", pt: "Senha" },
  setTitleRecovery: { en: "Password recovery", es: "Recuperación de contraseña", pt: "Recuperação de senha" },
  setTitleNative: { en: "Native / base language", es: "Idioma nativo / base", pt: "Idioma nativo / base" },
  setTitleCountry: { en: "Native country", es: "País de origen", pt: "País de origem" },
  setTitleGameplay: { en: "Gameplay", es: "Juego", pt: "Jogabilidade" },
  // --- buttons / generic ---
  setBtnEdit: { en: "Edit", es: "Editar", pt: "Editar" },
  setBtnSave: { en: "Save", es: "Guardar", pt: "Salvar" },
  setBtnCancel: { en: "Cancel", es: "Cancelar", pt: "Cancelar" },
  setBtnBusy: { en: "...", es: "...", pt: "..." },
  setSaved: { en: "Saved.", es: "Guardado.", pt: "Salvo." },
  setNotSet: { en: "(not set)", es: "(sin configurar)", pt: "(não definido)" },
  // --- profile picture ---
  setTabPhoto: { en: "Photo", es: "Foto", pt: "Foto" },
  setTabIcon: { en: "Icon", es: "Ícono", pt: "Ícone" },
  setTabFlag: { en: "Flag", es: "Bandera", pt: "Bandeira" },
  setBtnChooseFile: { en: "Choose file…", es: "Elegir archivo…", pt: "Escolher arquivo…" },
  setPhSearchCountry: { en: "Search countries…", es: "Buscar países…", pt: "Buscar países…" },
  setPhUsername: { en: "Username", es: "Nombre de usuario", pt: "Nome de usuário" },
  setAvatarPhoto: { en: "Custom photo", es: "Foto personalizada", pt: "Foto personalizada" },
  setAvatarFlag: { en: "Flag", es: "Bandera", pt: "Bandeira" },
  setAvatarIcon: { en: "Icon", es: "Ícono", pt: "Ícone" },
  setErrPhotoSize: { en: "Photo must be under 3MB.", es: "La foto debe pesar menos de 3 MB.", pt: "A foto deve ter menos de 3 MB." },
  setErrPickIcon: { en: "Pick an icon.", es: "Elige un ícono.", pt: "Escolha um ícone." },
  setErrPickFlag: { en: "Pick a flag.", es: "Elige una bandera.", pt: "Escolha uma bandeira." },
  setErrChoosePhoto: { en: "Choose a photo to upload.", es: "Elige una foto para subir.", pt: "Escolha uma foto para enviar." },
  setErrGeneric: { en: "Something went wrong.", es: "Algo salió mal.", pt: "Algo deu errado." },
  // --- username ---
  setErrUsernameEmpty: { en: "Username can't be empty.", es: "El nombre de usuario no puede estar vacío.", pt: "O nome de usuário não pode ficar vazio." },
  setErrUsernameTaken: { en: "That username is already taken.", es: "Ese nombre de usuario ya está en uso.", pt: "Esse nome de usuário já está em uso." },
  // --- email ---
  setPhNewEmail: { en: "New email", es: "Nuevo correo", pt: "Novo e-mail" },
  setPhConfirmEmail: { en: "Confirm new email", es: "Confirmar nuevo correo", pt: "Confirmar novo e-mail" },
  setPhCurPwConfirm: { en: "Current password (to confirm it's you)", es: "Contraseña actual (para confirmar que eres tú)", pt: "Senha atual (para confirmar que é você)" },
  setNoteEmailSaved: { en: "Check your new email to confirm the change.", es: "Revisa tu nuevo correo para confirmar el cambio.", pt: "Verifique seu novo e-mail para confirmar a mudança." },
  setErrEmailsMismatch: { en: "Emails don't match.", es: "Los correos no coinciden.", pt: "Os e-mails não coincidem." },
  setErrCurPwRequired: { en: "Enter your current password to confirm this change.", es: "Ingresa tu contraseña actual para confirmar este cambio.", pt: "Digite sua senha atual para confirmar esta mudança." },
  setErrCurPwWrong: { en: "Current password is incorrect.", es: "La contraseña actual es incorrecta.", pt: "A senha atual está incorreta." },
  // --- password ---
  setPhCurPw: { en: "Current password", es: "Contraseña actual", pt: "Senha atual" },
  setPhNewPw: { en: "New password", es: "Nueva contraseña", pt: "Nova senha" },
  setPhConfirmPw: { en: "Confirm new password", es: "Confirmar nueva contraseña", pt: "Confirmar nova senha" },
  setNotePwSaved: { en: "Other signed-in devices have been logged out for security.", es: "Se cerró la sesión en los demás dispositivos por seguridad.", pt: "Os outros dispositivos conectados foram desconectados por segurança." },
  setErrPwLen: { en: "New password must be at least 6 characters.", es: "La nueva contraseña debe tener al menos 6 caracteres.", pt: "A nova senha deve ter pelo menos 6 caracteres." },
  setErrPwMismatch: { en: "New passwords don't match.", es: "Las nuevas contraseñas no coinciden.", pt: "As novas senhas não coincidem." },
  // --- password recovery ---
  setRecNotSetUp: { en: "Not set up", es: "Sin configurar", pt: "Não configurado" },
  setRecStatusQuestions: { en: "{n} security questions on file", es: "{n} preguntas de seguridad guardadas", pt: "{n} perguntas de segurança salvas" },
  setRecHintSuffix: { en: " · hint set", es: " · pista configurada", pt: " · dica configurada" },
  setRecStatusHintOnly: { en: "Hint set · no security questions yet", es: "Pista configurada · aún sin preguntas de seguridad", pt: "Dica configurada · ainda sem perguntas de segurança" },
  setRecNoteNone: {
    en: "Without security questions, a forgotten password means waiting on an admin reset — setting them up takes a minute and lets you reset it yourself.",
    es: "Sin preguntas de seguridad, si olvidas tu contraseña tendrás que esperar a que un administrador la restablezca — configurarlas toma un minuto y te permite restablecerla tú mismo.",
    pt: "Sem perguntas de segurança, esquecer a senha significa esperar por uma redefinição do administrador — configurá-las leva um minuto e permite que você mesmo a redefina.",
  },
  setRecNoteEdit: {
    en: "The hint shows to anyone who enters your email on the reset page — make it useful to you, useless to others. Answers aren't case-sensitive, but spelling counts. For your security, saved answers are never shown again — re-entering all three replaces the old set; leaving all three empty changes only the hint.",
    es: "La pista se muestra a cualquiera que ingrese tu correo en la página de restablecimiento — hazla útil para ti e inútil para los demás. Las respuestas no distinguen mayúsculas, pero la ortografía cuenta. Por tu seguridad, las respuestas guardadas no se vuelven a mostrar — volver a ingresar las tres reemplaza el conjunto anterior; dejar las tres vacías cambia solo la pista.",
    pt: "A dica aparece para qualquer pessoa que digite seu e-mail na página de redefinição — faça-a útil para você e inútil para os outros. As respostas não diferenciam maiúsculas de minúsculas, mas a ortografia conta. Por sua segurança, as respostas salvas nunca são mostradas de novo — digitar as três novamente substitui o conjunto anterior; deixar as três vazias muda apenas a dica.",
  },
  setErrRecoveryIncomplete: {
    en: "Fill in all three questions and answers, or leave all three empty to keep your questions as they are.",
    es: "Completa las tres preguntas y respuestas, o deja las tres vacías para mantener tus preguntas como están.",
    pt: "Preencha as três perguntas e respostas, ou deixe as três vazias para manter suas perguntas como estão.",
  },
  setErrRecoveryDupes: { en: "Pick three different questions.", es: "Elige tres preguntas diferentes.", pt: "Escolha três perguntas diferentes." },
  setPhHint: { en: "Password hint (optional)", es: "Pista de contraseña (opcional)", pt: "Dica de senha (opcional)" },
  setPhAnswer: { en: "Answer", es: "Respuesta", pt: "Resposta" },
  setOptQuestion: { en: "— Question {n} —", es: "— Pregunta {n} —", pt: "— Pergunta {n} —" },
  setAriaHint: { en: "Password hint", es: "Pista de contraseña", pt: "Dica de senha" },
  setAriaSecurityQuestion: { en: "Security question {n}", es: "Pregunta de seguridad {n}", pt: "Pergunta de segurança {n}" },
  setAriaAnswer: { en: "Answer to security question {n}", es: "Respuesta a la pregunta de seguridad {n}", pt: "Resposta à pergunta de segurança {n}" },
  // --- native language / country ---
  setPhSearchLang: { en: "Search languages…", es: "Buscar idiomas…", pt: "Buscar idiomas…" },
  setNativeNote: {
    en: "Changing this only changes which languages show up to learn — progress in tracks you've already played is kept.",
    es: "Cambiar esto solo cambia qué idiomas aparecen para aprender — se conserva tu progreso en los idiomas que ya jugaste.",
    pt: "Mudar isso só muda quais idiomas aparecem para aprender — seu progresso nos idiomas que você já jogou é mantido.",
  },
  setNeedNativeFirst: { en: "Set your native language above first.", es: "Primero define tu idioma nativo arriba.", pt: "Defina seu idioma nativo acima primeiro." },
  setCountryNote: {
    en: "Combined with your native language, this determines the regional label shown on the home screen (e.g. Spanish + Venezuela → \"Español (Latinoamérica)\").",
    es: "Junto con tu idioma nativo, esto determina la etiqueta regional que se muestra en la pantalla de inicio (p. ej. español + Venezuela → \"Español (Latinoamérica)\").",
    pt: "Combinado com seu idioma nativo, isso determina a etiqueta regional mostrada na tela inicial (ex.: espanhol + Venezuela → \"Español (Latinoamérica)\").",
  },
  // --- gameplay ---
  setGpReviewOn: { en: "Review mode: on", es: "Modo repaso: activado", pt: "Modo revisão: ativado" },
  setGpReviewOff: { en: "Review mode: off", es: "Modo repaso: desactivado", pt: "Modo revisão: desativado" },
  setGpSummary: {
    en: "{perCat} questions/category · {pairs} phonetics pairs · question audio {qAudio} · answer-choice audio {cAudio} · tense hints {tHints} · {time}s{phon} per question",
    es: "{perCat} preguntas/categoría · {pairs} pares de fonética · audio de pregunta {qAudio} · audio de opciones {cAudio} · pistas de tiempo verbal {tHints} · {time}s{phon} por pregunta",
    pt: "{perCat} perguntas/categoria · {pairs} pares de fonética · áudio da pergunta {qAudio} · áudio das opções {cAudio} · dicas de tempo verbal {tHints} · {time}s{phon} por pergunta",
  },
  setGpOn: { en: "on", es: "activado", pt: "ativado" },
  setGpOff: { en: "off", es: "desactivado", pt: "desativado" },
  setGpOnF: { en: "on", es: "activadas", pt: "ativadas" },
  setGpOffF: { en: "off", es: "desactivadas", pt: "desativadas" },
  setGpSummaryPhon: { en: " ({time}s phonetics)", es: " ({time}s fonética)", pt: " ({time}s fonética)" },
  setGpTogReview: {
    en: "Pause after each answer to review the explanation (tap \"Next\" to continue)",
    es: "Pausar después de cada respuesta para repasar la explicación (toca \"Siguiente\" para continuar)",
    pt: "Pausar após cada resposta para revisar a explicação (toque em \"Próximo\" para continuar)",
  },
  setGpTogQaudio: {
    en: "Show a speaker button on questions that have audio (tap to hear the prompt read aloud — never plays automatically)",
    es: "Mostrar un botón de altavoz en las preguntas que tienen audio (toca para escuchar la consigna en voz alta — nunca se reproduce solo)",
    pt: "Mostrar um botão de alto-falante nas perguntas que têm áudio (toque para ouvir o enunciado em voz alta — nunca toca sozinho)",
  },
  setGpTogCaudio: {
    en: "Show a speaker button on the answer choices too — only after you've answered (in review/pause), tap to hear an option read aloud. Rolling out per track; appears where option audio exists.",
    es: "Mostrar un botón de altavoz también en las opciones de respuesta — solo después de responder (en repaso/pausa), toca para escuchar una opción en voz alta. Se habilita por pista; aparece donde hay audio de opciones.",
    pt: "Mostrar um botão de alto-falante também nas opções de resposta — só depois de responder (na revisão/pausa), toque para ouvir uma opção em voz alta. Sendo liberado por idioma; aparece onde há áudio das opções.",
  },
  setGpTogTense: {
    en: "Tense training-wheels: on verb-conjugation questions, name the tense being asked for and why. On by default; you can also dismiss it in-round once you reach an advanced level.",
    es: "Rueditas de apoyo para tiempos verbales: en las preguntas de conjugación, indica qué tiempo se pide y por qué. Activado por defecto; también puedes ocultarlo durante la ronda al llegar a un nivel avanzado.",
    pt: "Rodinhas de apoio para tempos verbais: nas perguntas de conjugação, indica qual tempo está sendo pedido e por quê. Ativado por padrão; você também pode dispensá-lo durante a rodada ao chegar a um nível avançado.",
  },
  setGpPerCat: { en: "Questions per category (mixed rounds)", es: "Preguntas por categoría (rondas mixtas)", pt: "Perguntas por categoria (rodadas mistas)" },
  setGpPairs: { en: "Phonetics pairs per round", es: "Pares de fonética por ronda", pt: "Pares de fonética por rodada" },
  setGpSameTimer: { en: "Same time limit for every question type", es: "Mismo límite de tiempo para todos los tipos de pregunta", pt: "Mesmo limite de tempo para todos os tipos de pergunta" },
  setGpSecSame: { en: "Seconds per question", es: "Segundos por pregunta", pt: "Segundos por pergunta" },
  setGpSecRegular: { en: "Seconds (regular)", es: "Segundos (normal)", pt: "Segundos (normal)" },
  setGpSecPhon: { en: "Seconds (phonetics)", es: "Segundos (fonética)", pt: "Segundos (fonética)" },
  // --- subscription / feedback / footer ---
  setComingSoon: { en: "Coming soon.", es: "Próximamente.", pt: "Em breve." },
  setFbBug: { en: "🐞 Report a bug", es: "🐞 Reportar un error", pt: "🐞 Relatar um erro" },
  setFbFeature: { en: "💡 Suggest a feature", es: "💡 Sugerir una función", pt: "💡 Sugerir um recurso" },
  setSignOut: { en: "Sign out", es: "Cerrar sesión", pt: "Sair" },
  setTos: { en: "Terms of Service", es: "Términos del servicio", pt: "Termos de Serviço" },
  setPrivacy: { en: "Privacy Policy", es: "Política de privacidad", pt: "Política de Privacidade" },

  // #72 beta-apply (pre-login flow; renders before native_lang exists, so it
  // uses the bootstrap uiLang — lib/uiLang.js). Spanish is AI-authored, written
  // gender-neutral (no "/a" forms), pending #41 native review. Option-set values
  // stay English canonical (the stored/POSTed value); only the label is localized.
  baTitle: { en: "Apply to beta test", es: "Solicita ser beta tester", pt: "Candidate-se para testar a beta" },
  baSubtitle: {
    en: "Takes about 3 minutes. Tell us about you and how you like to practice.",
    es: "Toma unos 3 minutos. Cuéntanos sobre ti y cómo te gusta practicar.",
    pt: "Leva cerca de 3 minutos. Conte-nos sobre você e como gosta de praticar.",
  },
  baStepAboutYou: { en: "About You", es: "Sobre ti", pt: "Sobre você" },
  baStepLangBg: { en: "Language Background", es: "Tu experiencia con idiomas", pt: "Sua experiência com idiomas" },
  baStepHabits: { en: "Practice Habits & Fit", es: "Hábitos de práctica y afinidad", pt: "Hábitos de prática e afinidade" },
  baStepCommitment: { en: "Beta Commitment", es: "Compromiso con la beta", pt: "Compromisso com a beta" },
  baStepAccount: { en: "Your Account", es: "Tu cuenta", pt: "Sua conta" },
  baBack: { en: "Back", es: "Atrás", pt: "Voltar" },
  baNext: { en: "Next", es: "Siguiente", pt: "Próximo" },
  baSubmit: { en: "Submit application", es: "Enviar solicitud", pt: "Enviar candidatura" },
  baSending: { en: "Sending...", es: "Enviando...", pt: "Enviando..." },
  baFooterPre: { en: "Already have an account? ", es: "¿Ya tienes una cuenta? ", pt: "Já tem uma conta? " },
  baFooterLink: { en: "Sign in instead", es: "Inicia sesión", pt: "Entre em vez disso" },
  // --- step 0: About You ---
  baFieldName: { en: "Name or nickname", es: "Nombre o apodo", pt: "Nome ou apelido" },
  baFieldEmail: { en: "Email", es: "Correo electrónico", pt: "E-mail" },
  baFieldAge: { en: "How old are you?", es: "¿Qué edad tienes?", pt: "Quantos anos você tem?" },
  baAgeUnder18: { en: "Under 18", es: "Menos de 18", pt: "Menos de 18" },
  baAge18_24: { en: "18–24", es: "18–24", pt: "18–24" },
  baAge25_34: { en: "25–34", es: "25–34", pt: "25–34" },
  baAge35_44: { en: "35–44", es: "35–44", pt: "35–44" },
  baAge45_54: { en: "45–54", es: "45–54", pt: "45–54" },
  baAge55plus: { en: "55+", es: "55+", pt: "55+" },
  baFieldDevices: { en: "What device(s) would you test SquirreLingo on?", es: "¿En qué dispositivo(s) probarías SquirreLingo?", pt: "Em qual(is) dispositivo(s) você testaria o SquirreLingo?" },
  baDevAndroid: { en: "Android phone", es: "Teléfono Android", pt: "Celular Android" },
  baDevIphone: { en: "iPhone", es: "iPhone", pt: "iPhone" },
  baDevTablet: { en: "Tablet (Android or iPad)", es: "Tablet (Android o iPad)", pt: "Tablet (Android ou iPad)" },
  baDevDesktop: { en: "Desktop/laptop browser (Windows or Mac)", es: "Navegador de computadora o laptop (Windows o Mac)", pt: "Navegador de computador ou notebook (Windows ou Mac)" },
  baDevChromebook: { en: "Chromebook", es: "Chromebook", pt: "Chromebook" },
  baFieldBrowser: { en: "Which browser do you use most on that device?", es: "¿Qué navegador usas más en ese dispositivo?", pt: "Qual navegador você mais usa nesse dispositivo?" },
  baBrowChrome: { en: "Chrome", es: "Chrome", pt: "Chrome" },
  baBrowSafari: { en: "Safari", es: "Safari", pt: "Safari" },
  baBrowFirefox: { en: "Firefox", es: "Firefox", pt: "Firefox" },
  baBrowEdge: { en: "Edge", es: "Edge", pt: "Edge" },
  baBrowSamsung: { en: "Samsung Internet", es: "Samsung Internet", pt: "Samsung Internet" },
  baBrowOther: { en: "Other", es: "Otro", pt: "Outro" },
  // --- step 1: Language Background ---
  baFieldNative: { en: "What is your native language (or strongest language)?", es: "¿Cuál es tu idioma nativo (o el idioma que dominas mejor)?", pt: "Qual é o seu idioma nativo (ou o idioma que você domina melhor)?" },
  baFieldTarget: { en: "Which language(s) do you want to practice with SquirreLingo?", es: "¿Qué idioma(s) quieres practicar con SquirreLingo?", pt: "Qual(is) idioma(s) você quer praticar com o SquirreLingo?" },
  baFieldLevel: { en: "How would you rate your current level in that language?", es: "¿Cómo calificarías tu nivel actual en ese idioma?", pt: "Como você avaliaria seu nível atual nesse idioma?" },
  baLvlComplete: { en: "Complete beginner (a few words at most)", es: "Principiante total (unas pocas palabras, como mucho)", pt: "Iniciante total (poucas palavras, no máximo)" },
  baLvlBeginner: { en: "Beginner (basic phrases, simple vocabulary)", es: "Principiante (frases básicas, vocabulario simple)", pt: "Iniciante (frases básicas, vocabulário simples)" },
  baLvlIntermediate: { en: "Intermediate (can hold simple conversations)", es: "Intermedio (puedo mantener conversaciones sencillas)", pt: "Intermediário (consigo manter conversas simples)" },
  baLvlAdvanced: { en: "Advanced (comfortable in most conversations)", es: "Avanzado (me desenvuelvo bien en la mayoría de las conversaciones)", pt: "Avançado (me viro bem na maioria das conversas)" },
  baLvlNative: { en: "Native/fluent", es: "Nativo/fluido", pt: "Nativo/fluente" },
  baFieldDialect: {
    en: "Any preference for a specific regional variety or dialect (e.g. Latin American vs. European Spanish)?",
    es: "¿Tienes preferencia por alguna variedad regional o dialecto en específico (por ejemplo, español latinoamericano vs. europeo)?",
    pt: "Você tem preferência por alguma variedade regional ou dialeto específico (por exemplo, espanhol latino-americano vs. europeu)?",
  },
  baFieldApps: { en: "Which language-learning apps or methods have you used before?", es: "¿Qué apps o métodos para aprender idiomas has usado antes?", pt: "Quais apps ou métodos para aprender idiomas você já usou antes?" },
  baAppDuolingo: { en: "Duolingo", es: "Duolingo", pt: "Duolingo" },
  baAppBabbel: { en: "Babbel", es: "Babbel", pt: "Babbel" },
  baAppRosetta: { en: "Rosetta Stone", es: "Rosetta Stone", pt: "Rosetta Stone" },
  baAppAnki: { en: "Anki / flashcards", es: "Anki / tarjetas de memoria", pt: "Anki / cartões de memória" },
  baAppClasses: { en: "Classes or tutoring", es: "Clases o tutorías", pt: "Aulas ou tutoria" },
  baAppImmersion: { en: "Immersion (family, friends, travel, work)", es: "Inmersión (familia, amistades, viajes, trabajo)", pt: "Imersão (família, amigos, viagens, trabalho)" },
  baAppNone: { en: "None — this would be my first", es: "Ninguno — esta sería mi primera vez", pt: "Nenhum — esta seria minha primeira vez" },
  baFieldFrustration: { en: "What's your biggest frustration with the language apps you've tried?", es: "¿Cuál es tu mayor frustración con las apps de idiomas que has probado?", pt: "Qual é a sua maior frustração com os apps de idiomas que você já experimentou?" },
  // --- step 2: Practice Habits & Fit ---
  baFieldFrequency: { en: "How often do you realistically see yourself practicing?", es: "Siendo realista, ¿con qué frecuencia te ves practicando?", pt: "Sendo realista, com que frequência você se vê praticando?" },
  baFreqMulti: { en: "Multiple times a day", es: "Varias veces al día", pt: "Várias vezes por dia" },
  baFreqDaily: { en: "Once a day", es: "Una vez al día", pt: "Uma vez por dia" },
  baFreqFewWeek: { en: "A few times a week", es: "Unas cuantas veces por semana", pt: "Algumas vezes por semana" },
  baFreqWeekly: { en: "Once a week", es: "Una vez por semana", pt: "Uma vez por semana" },
  baFreqSporadic: { en: "Sporadically", es: "De vez en cuando", pt: "De vez em quando" },
  baFieldSessionLen: { en: "How long is your ideal practice session?", es: "¿Cuánto dura tu sesión de práctica ideal?", pt: "Qual é a duração da sua sessão de prática ideal?" },
  baSlenUnder5: { en: "Under 5 minutes", es: "Menos de 5 minutos", pt: "Menos de 5 minutos" },
  baSlen5_10: { en: "5–10 minutes", es: "5–10 minutos", pt: "5–10 minutos" },
  baSlen10_20: { en: "10–20 minutes", es: "10–20 minutos", pt: "10–20 minutos" },
  baSlen20plus: { en: "20+ minutes", es: "Más de 20 minutos", pt: "Mais de 20 minutos" },
  baFieldAppeal: {
    en: "SquirreLingo uses short rounds, instant feedback, and streak/combo mechanics instead of penalties (plus a calmer no-timer mode). How appealing does that sound?",
    es: "SquirreLingo usa rondas cortas, retroalimentación al instante y mecánicas de rachas y combos en lugar de castigos (además de un modo más tranquilo, sin cronómetro). ¿Qué tan atractivo te suena eso?",
    pt: "O SquirreLingo usa rodadas curtas, feedback instantâneo e mecânicas de sequência e combo em vez de punições (além de um modo mais tranquilo, sem cronômetro). O quão atraente isso soa para você?",
  },
  baAppealLow: { en: "Not my style", es: "No es mi estilo", pt: "Não é meu estilo" },
  baAppealHigh: { en: "Exactly what I want", es: "Justo lo que busco", pt: "Exatamente o que eu quero" },
  baFieldFocus: { en: "Do you find it hard to stay focused or consistent with traditional study methods?", es: "¿Se te dificulta mantener la concentración o la constancia con los métodos de estudio tradicionales?", pt: "Você tem dificuldade de manter o foco ou a consistência com métodos de estudo tradicionais?" },
  baFocusVery: { en: "Yes, very much", es: "Sí, muchísimo", pt: "Sim, muito" },
  baFocusSomewhat: { en: "Somewhat", es: "Un poco", pt: "Um pouco" },
  baFocusNotReally: { en: "Not really", es: "La verdad no", pt: "Nem tanto" },
  baFocusNotSure: { en: "Not sure", es: "No sabría decir", pt: "Não sei dizer" },
  // --- step 3: Beta Commitment ---
  baFieldCommit: { en: "During the beta period (about 2–4 weeks), how much time could you commit to testing?", es: "Durante el periodo de la beta (unas 2–4 semanas), ¿cuánto tiempo podrías dedicar a las pruebas?", pt: "Durante o período da beta (cerca de 2–4 semanas), quanto tempo você poderia dedicar aos testes?" },
  baCommitDaily: { en: "15+ minutes most days", es: "15+ minutos casi todos los días", pt: "15+ minutos quase todos os dias" },
  baCommitFew: { en: "A few sessions per week", es: "Unas cuantas sesiones por semana", pt: "Algumas sessões por semana" },
  baCommitOneTwo: { en: "One or two sessions per week", es: "Una o dos sesiones por semana", pt: "Uma ou duas sessões por semana" },
  baCommitOccasional: { en: "Only occasional use", es: "Solo uso ocasional", pt: "Apenas uso ocasional" },
  baFieldPrior: { en: "Have you beta tested apps or software before?", es: "¿Has probado apps o software en beta antes?", pt: "Você já testou apps ou software em beta antes?" },
  baPriorSeveral: { en: "Yes, several times", es: "Sí, varias veces", pt: "Sim, várias vezes" },
  baPriorOnceTwice: { en: "Once or twice", es: "Una o dos veces", pt: "Uma ou duas vezes" },
  baPriorFirst: { en: "No, this would be my first", es: "No, esta sería mi primera vez", pt: "Não, esta seria minha primeira vez" },
  baFieldBugComfort: { en: "How comfortable are you reporting bugs with details (what you did, what happened, screenshots)?", es: "¿Qué tan a gusto te sientes reportando errores con detalles (qué hiciste, qué pasó, capturas de pantalla)?", pt: "O quão à vontade você se sente relatando erros com detalhes (o que fez, o que aconteceu, capturas de tela)?" },
  baBugLow: { en: "Not comfortable", es: "Nada a gusto", pt: "Nada à vontade" },
  baBugHigh: { en: "Very comfortable", es: "Muy a gusto", pt: "Muito à vontade" },
  baFieldReason: { en: "Why do you want to beta test SquirreLingo?", es: "¿Por qué quieres ser beta tester de SquirreLingo?", pt: "Por que você quer ser beta tester do SquirreLingo?" },
  baFieldAnything: { en: "Anything else we should know about you?", es: "¿Algo más que debamos saber sobre ti?", pt: "Mais alguma coisa que devemos saber sobre você?" },
  // --- step 4: Your Account ---
  baAcctIntro: {
    en: "Last step — set up your login. Your account is created the moment you submit, and you'll be signed in right away.",
    es: "Último paso — configura tu inicio de sesión. Tu cuenta se crea en el momento en que envías la solicitud, y tu sesión se inicia de inmediato.",
    pt: "Último passo — configure seu login. Sua conta é criada no momento em que você envia, e você entra na hora.",
  },
  baFieldUsername: { en: "Pick a username", es: "Elige un nombre de usuario", pt: "Escolha um nome de usuário" },
  baUsernameHint: { en: "At least 3 characters — letters, numbers, and _ only.", es: "Al menos 3 caracteres — solo letras, números y _.", pt: "Pelo menos 3 caracteres — apenas letras, números e _." },
  baFieldPassword: { en: "Choose a password", es: "Elige una contraseña", pt: "Escolha uma senha" },
  baPhPassword: { en: "Password (min 6 characters)", es: "Contraseña (mínimo 6 caracteres)", pt: "Senha (mínimo 6 caracteres)" },
  baFieldConfirm: { en: "Confirm password", es: "Confirma la contraseña", pt: "Confirme a senha" },
  baPhConfirm: { en: "Repeat password", es: "Repite la contraseña", pt: "Repita a senha" },
  baPwNoMatch: { en: "Passwords don't match yet.", es: "Las contraseñas aún no coinciden.", pt: "As senhas ainda não coincidem." },
  baPwMatch: { en: "Passwords match ✓", es: "Las contraseñas coinciden ✓", pt: "As senhas coincidem ✓" },
  baRecoveryLead: { en: "Password recovery (optional, recommended):", es: "Recuperación de contraseña (opcional, recomendada):", pt: "Recuperação de senha (opcional, recomendada):" },
  baRecoveryBody: {
    en: " we can't email reset links during the beta, so a password hint and three security questions are the only way to reset a forgotten password yourself. Skip them and you'd have to request an admin reset instead. You can also set these up later in Settings.",
    es: " durante la beta no podemos enviar enlaces de restablecimiento por correo, así que una pista de contraseña y tres preguntas de seguridad son la única forma de restablecer por tu cuenta una contraseña olvidada. Si las omites, tendrías que pedirle a un administrador que la restablezca. También puedes configurarlas más adelante en Ajustes.",
    pt: " durante a beta não podemos enviar links de redefinição por e-mail, então uma dica de senha e três perguntas de segurança são a única forma de você mesmo redefinir uma senha esquecida. Se pular, você teria que pedir uma redefinição a um administrador. Você também pode configurá-las depois em Configurações.",
  },
  baFieldHint: { en: "Password hint", es: "Pista de contraseña", pt: "Dica de senha" },
  baPhHint: { en: "A hint only you understand (shown on the reset page)", es: "Una pista que solo tú entiendas (se muestra en la página de restablecimiento)", pt: "Uma dica que só você entende (mostrada na página de redefinição)" },
  baSecQLabel: { en: "Security question {n}", es: "Pregunta de seguridad {n}", pt: "Pergunta de segurança {n}" },
  baAriaAnswer: { en: "Answer to security question {n}", es: "Respuesta a la pregunta de seguridad {n}", pt: "Resposta à pergunta de segurança {n}" },
  baSecQChoose: { en: "— Choose a question —", es: "— Elige una pregunta —", pt: "— Escolha uma pergunta —" },
  baPhAnswer: { en: "Answer (not case-sensitive)", es: "Respuesta (no distingue mayúsculas de minúsculas)", pt: "Resposta (não diferencia maiúsculas de minúsculas)" },
  // --- validation ---
  baErrStep0: { en: "Name, email, and at least one device are needed to move on.", es: "Necesitamos tu nombre, tu correo y al menos un dispositivo para continuar.", pt: "Precisamos do seu nome, e-mail e pelo menos um dispositivo para continuar." },
  baErrStep1: { en: "Your native language, target language(s), and current level are needed to move on.", es: "Necesitamos tu idioma nativo, el/los idioma(s) que quieres practicar y tu nivel actual para continuar.", pt: "Precisamos do seu idioma nativo, do(s) idioma(s) que quer praticar e do seu nível atual para continuar." },
  baErrStep2: { en: "Practice frequency and session length are needed to move on.", es: "Necesitamos tu frecuencia de práctica y la duración de la sesión para continuar.", pt: "Precisamos da sua frequência de prática e da duração da sessão para continuar." },
  baErrStep3: { en: "How much time you could commit is needed to move on.", es: "Necesitamos saber cuánto tiempo podrías dedicar para continuar.", pt: "Precisamos saber quanto tempo você poderia dedicar para continuar." },
  baErrUsername: { en: "Username must be at least 3 characters (letters, numbers, and _ only).", es: "El nombre de usuario debe tener al menos 3 caracteres (solo letras, números y _).", pt: "O nome de usuário deve ter pelo menos 3 caracteres (apenas letras, números e _)." },
  baErrPwLen: { en: "Password must be at least 6 characters.", es: "La contraseña debe tener al menos 6 caracteres.", pt: "A senha deve ter pelo menos 6 caracteres." },
  baErrPwMismatch: { en: "Passwords don't match.", es: "Las contraseñas no coinciden.", pt: "As senhas não coincidem." },
  baErrSqPartial: { en: "Security questions: fill in all three questions and answers, or leave all three empty to skip.", es: "Preguntas de seguridad: completa las tres preguntas y respuestas, o deja las tres vacías para omitirlas.", pt: "Perguntas de segurança: preencha as três perguntas e respostas, ou deixe as três vazias para pular." },
  baErrSqDistinct: { en: "Security questions: pick three different questions.", es: "Preguntas de seguridad: elige tres preguntas diferentes.", pt: "Perguntas de segurança: escolha três perguntas diferentes." },
  baErrUserTaken: { en: "That username is already taken — try Verify above for available alternatives.", es: "Ese nombre de usuario ya está en uso — prueba «Verificar» arriba para ver alternativas disponibles.", pt: "Esse nome de usuário já está em uso — use «Verificar» acima para ver alternativas disponíveis." },
  baErrGeneric: { en: "Something went wrong submitting your application — please try again.", es: "Algo salió mal al enviar tu solicitud — inténtalo de nuevo, por favor.", pt: "Algo deu errado ao enviar sua candidatura — tente novamente, por favor." },
  // --- success screens ---
  baOkTitle: { en: "You're in! 🐿️", es: "¡Estás dentro! 🐿️", pt: "Você está dentro! 🐿️" },
  baOkBody1: { en: "Your beta account is ready — sign in with the email and password you just chose.", es: "Tu cuenta de beta está lista — inicia sesión con el correo y la contraseña que acabas de elegir.", pt: "Sua conta beta está pronta — entre com o e-mail e a senha que você acabou de escolher." },
  baOkBtn: { en: "Go to sign in", es: "Ir a iniciar sesión", pt: "Ir para entrar" },
  baThanksTitle: { en: "Thanks for applying! 🐿️", es: "¡Gracias por postularte! 🐿️", pt: "Obrigado por se candidatar! 🐿️" },
  baThanksBody1: { en: "Your application was received. If you're a good fit for the current round of testing, you'll hear back at the email you provided.", es: "Recibimos tu solicitud. Si encajas bien con la ronda de pruebas actual, te contactaremos al correo que nos diste.", pt: "Recebemos sua candidatura. Se você se encaixar bem na rodada de testes atual, entraremos em contato pelo e-mail que você forneceu." },
  baThanksBtn: { en: "Already have an invite? Sign in", es: "¿Ya tienes una invitación? Inicia sesión", pt: "Já tem um convite? Entre" },
  baFbPre: { en: "While you're at it: the ", es: "Y de paso: el ", pt: "E já que está por aqui: o " },
  baFbLink: { en: "SquirreLingo Facebook group", es: "grupo de SquirreLingo en Facebook", pt: "grupo do SquirreLingo no Facebook" },
  baFbPost: {
    en: " is where release news and tester chat happen — it's private during the beta, so request to join and you'll be approved.",
    es: " es donde se comparten las novedades de cada versión y se conversa entre testers — es privado durante la beta, así que solicita unirte y te aprobaremos.",
    pt: " é onde as novidades de cada versão e a conversa entre testers acontecem — é privado durante a beta, então solicite para entrar e você será aprovado.",
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
  verbo: { en: "Grammar", es: "Verbos", pt: "Verbos" }, // esForEn/esSpainForEn's legacy key for the same concept
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

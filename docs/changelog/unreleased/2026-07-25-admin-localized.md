# 2026-07-25 — Admin panel localized

## User-facing
- The **admin panel** now follows the admin's native language — the hub, all
  seven tabs (Panel, Progreso, Solicitudes, Comentarios, Usuarios,
  Restablecimientos, Registros de errores), every section (dashboard counts, the
  Progress dashboard, applications, feedback triage, user management, reset
  requests, error logs) and the break-glass set-password page appear in Spanish
  for a Spanish-native admin, English otherwise. Admin-only, and it automatically
  covers any future language the moment it's added.

## Internal
- Localized 8 admin components + the standalone set-password page (~196
  user-visible strings) via inline `{en,es}` maps + a `lang` prop threaded from
  the hub: `app/admin/page.js` resolves the language once (native_lang →
  bootstrap uiLang → English) and passes it to every section; the set-password
  route resolves its own. `beta-applications/page.js` is a pure redirect —
  untouched.
- Only user-visible strings translated; API action values, data keys, routes,
  developer-log strings, and the "admin" role word left in English. es copy is
  AI-authored → pending native review (#41). No dependencies changed; esbuild
  JSX-parse clean on all files; per-file CRLF/LF preserved.
- No version bump here — folds under **3.1.1** (ledger chat owns `version.js`).

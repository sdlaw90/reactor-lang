# 2026-07-25 — Guide/tour localized + video card moved above the steps

## User-facing
- The **"How to use SquirreLingo"** page (menu → the intro tour) now follows your
  native language — the 9-step walkthrough, the tour controls, and the video card
  all appear in your language (Spanish now; more as they're added). The first-run
  welcome tour is localized the same way.
- The **video tour card now sits above** the step-by-step carousel (the quick
  30-second option first), with a short "or step through it" divider. Same order
  in every language.
- The tutorial video itself is still the English cut for now (the card says
  "Español próximamente"); only the surrounding text is translated.

## Internal
- **Localized** (native_lang → bootstrap uiLang → English, same pattern as
  /about, /help, /whats-new):
  - `lib/guideSteps.js` — the 9 steps are now `{en,es}` per title/body, resolved
    via `guideSteps(lang)` (emoji/demo shared); `GUIDE_STEPS` kept as the
    English-resolved back-compat export.
  - `lib/GuideTour.js` — new `lang` prop drives its own chrome (Step X of Y /
    Back / Next / Skip / dot aria); step content still arrives via `steps`.
  - `lib/GuideVideoCard.js` — `lang` localizes the card chrome; the video path is
    pinned to `en` (only cut that exists) with the "Español próximamente" badge.
    Narrator-mode toggle stays omitted (co-host only) by decision.
  - `lib/GuideOverlay.js` — first-run overlay passes the user's `native_lang`
    through to the tour + localized "Let's go!".
  - `app/guide/page.js` — resolves the reader's language, renders
    `<GuideVideoCard/>` **above** `<GuideTour/>` with the divider, localized
    heading / subtitle / "Done".
- es copy AI-authored → pending native review (#41). No dependencies changed.
  esbuild JSX-parse clean on all five files; per-file CRLF/LF preserved.
- No version bump here — folds under **3.1.1** (ledger chat owns `version.js`).

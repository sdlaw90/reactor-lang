# 2026-07-29 — Language-table sweep: switcher label + Spanish theme names

_Folds into the **3.3.0** release entry._ Two user-visible localization gaps found by the v3.3
French Phase 1 gate, both in already-shipped content. Deliberately kept to the two fixes that
need no new native review.

> **Retargeted 2026-08-02 (was 3.2.1).** The standalone 3.2.1 Z was dropped — Sean's call — so
> both cosmetic localization fixes ride with the French milestone instead. The
> security-question fix in `2026-08-02-security-question-localization.md` is the same class of
> bug and ships alongside these.

## User-facing
- Fixed: the language switcher on the sign-in and sign-up screens showed a raw language code
  instead of the language's name for Portuguese — it now reads Português.
- Fixed: the practice-theme filters (Travel, Shopping, Health…) showed in English on the German,
  Russian, Japanese, Korean and Mandarin tracks for Spanish speakers. They now show in Spanish,
  matching every other track.

## Internal
- **`lib/LangSwitcher.js` — the actual bug.** `LANG_LABELS` was `{ en, es }` while
  `SUPPORTED_UI_LANGS` (`lib/uiLang.js`) was `["en","es","pt"]`. The component renders
  `LANG_LABELS[uiLang] || uiLang` for the pill and `LANG_LABELS[lang] || lang` for each dropdown
  row, so Portuguese fell through to the literal string `pt` — on every pre-login screen (auth,
  forgot/reset password, beta-apply, onboarding), for the whole of v3.2.0.
  - Same *class* as the v3.1.1 nav-drawer bug: a language added to one table and not its sibling.
    It shipped for the same reason — nothing swept the sibling tables at the offering flip.
  - **`fr: "Français"` added at the same time, ahead of the French flip.** It is inert (the pill
    and dropdown only iterate `SUPPORTED_UI_LANGS`, which does not contain `fr`), and it means the
    v3.3 flip cannot reintroduce the same bug. The reasoning is left in a comment above the table.
- **`THEMES` Spanish backfill — 45 rows across 5 files.** `deForEnTags.js`, `ruForEnTags.js`,
  `jaForEnTags.js`, `koForEnTags.js`, `zhForEnTags.js` carried `en` + the target language + `pt`,
  but no `es`; the Romance-target tag files had `es` because there the target language *is*
  Spanish. So Spanish natives saw English theme chips on five tracks. Values reused verbatim from
  `esForEnTags.js` so the label is identical everywhere it appears. Renderer is
  `th[uiLang] || th.en` (`app/play/[trackId]/page.js`), so this was a silent English fallback, not
  a raw key.
- **All 12 `*Tags.js` `THEMES` arrays are now complete for en/es/pt/fr** — verified by re-sweep.
- **How both were found, and the standing rule that came out of it:** a repo-wide AST sweep for
  object literals carrying `en` plus another language code but missing a shipped language. Written
  up as `claude/squirrelingo_offering_flip_checklist.md` and now part of every offering flip. The
  same sweep found further gaps that are deliberately NOT in this release, because they need new
  translation and native review rather than a missing-value fix:
  - **38 user-facing strings with `es` but no `pt`** — the first-run guided tour and `/guide`
    (`lib/guideSteps.js` 18, `lib/GuideTour.js` 6, `lib/GuideVideoCard.js` 6,
    `lib/GuideOverlay.js` 1, `app/guide/page.js` 6).
  - **~60 user-facing strings never localized into any source language** — the Grammar Gym page
    (12; it calls `t()` for its four mode-toggle labels and hardcodes everything else, so it looks
    localized to a grep), the dashboard, all three feedback pages, the welcome popup, the update
    prompt, both error pages, and the legal/username gates.
  - **237 admin strings with `es` but no `pt`** — Sean-facing only, lowest priority.
  - Queued as their own scoped release; tracked in the state-of-the-app doc.
- **No new native review needed for this release.** The Portuguese label is the language's endonym
  and the Spanish theme names are copied verbatim from an existing reviewed-lane file — neither is
  newly authored content.
- **Verification:** esbuild JSX-parse clean on all 6 touched files (with a negative control to
  prove the check can fail); line endings unchanged (all CRLF before and after); re-sweep confirms
  no remaining `THEMES` gaps.

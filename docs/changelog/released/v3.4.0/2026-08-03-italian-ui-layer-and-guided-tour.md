# 2026-08-03 — Italian interface, and the guided tour in every source language (v3.4 work-beat)

_Folds into the **3.4.0** release entry._

## User-facing
- **The guided tour now speaks your language.** The 60-second tour a new account sees first
  has only ever existed in English and Spanish, so Portuguese and French speakers were greeted
  in English on their very first screen. It is now in Portuguese, French and Italian too.
- **Italian interface groundwork.** The app's interface strings, the skill-level names, the
  Help and About pages and the on-card grammar chips are all now written in Italian. Italian
  courses themselves are still being built — this is the layer they sit on.

## Internal
- **Italiano was already selectable, and that is a live defect, not a future one.**
  `listNativeLanguages()` derives the picker from `new Set(listTracks().map(t => t.nativeLang))`,
  and `enForIt` has been registered with `nativeLang: "it"` since before v3.0. Verified against
  the built tree: the picker returns `en · es · pt · it · fr` today, and
  `tracksForNativeLang("it")` returns **exactly one track** — `en-for-it`, a 36-item stub — with
  an entirely English interface. So this beat is not inert groundwork; it upgrades something
  users can already reach. v3.4's remaining work turns that 1 into 13.
- **#72 columns added** (`scripts/l10n-backfill/lang-column.mjs`, AST splice at the last
  property's byte offset — formatting and comments outside the insertion are untouched):

  | file | added |
  |---|---|
  | `lib/playStrings.js` | `it` × 398 — the central `t(lang, key)` table + `CATEGORY_NAMES` |
  | `lib/guideSteps.js` | `it`, `pt`, `fr` × 18 each — the guided tour |
  | `lib/skillLevels.js` | `it` × 10 |
  | `lib/helpAboutContent.js` | full `it` blocks in `HELP_CONTENT` and `ABOUT_CONTENT` |
  | 11 `data/tracks/*Tags.js` | `it` × 1,023 — the #89 chips and theme labels |

- **The chips deduped 1,023 → 412 distinct strings** before translation and were applied by
  key, the same 60%+ cut v3.3 got on the non-Romance chips. `itForEnTags.js` is deliberately
  **not** given an `it` column: an Italian native is never offered the Italian track. Same
  reason `fr` is still absent from `frForEnTags`/`frCaForEnTags` and `pt` from
  `ptBrForEnTags`/`ptPtForEnTags` — those are not gaps.
- **The Help/About Italian blocks were structurally verified, not eyeballed**: a recursive
  key-and-array-length comparison against the `fr` block (113 nodes in Help, 76 in About,
  identical), plus a check that every `{{route|label}}` cross-reference keeps its route key
  and translates only the label.
- **`lib/frequencyVocab.js` was deliberately left alone.** Its two `{en, es}` objects are
  Word Bank explanation *formulas*, and the `gloss` they interpolate is an English string — a
  `pt`/`fr`/`it` formula would render a native frame around an English word. Those surfaces
  are localized through the side tables instead, which is why fvocab reads 100% for pt and fr.
- **`lib/version.js` is the one remaining #72 gap**: 190 changelog entries have no `it` and 180
  have no `pt`. It is the in-app changelog, read rarely and by choice. Logged, not done.
- **New: `scripts/audit-i18n-columns.mjs`** — parses `lib`, `app`, `data/tracks` and `e2e`, finds
  every object literal carrying `en` plus at least one source language, and reports what each
  is missing. This is the §4a "grep every touched surface" check generalized into something
  that can be run rather than remembered. It is a report, not a gate: the expected gaps above
  are real and permanent.
- **Verified:** `npx eslint .` 0 errors / 70 warnings (unchanged) · full `next build` green ·
  `node --check` clean on all 16 edited files · `audit-i18n-columns.mjs` shows no unexpected
  `it` gap outside `version.js`.
- All Italian strings are AI-authored and flagged for #41 native review. **No Italian reviewer
  is recruited.** The guided-tour `pt` and `fr` strings join the existing pt/fr piles.
- **Not inert, by design:** the `pt` and `fr` guided-tour strings go live to those natives on
  deploy, like the #60 backfill and for the same reason — each is an independent upgrade from
  an English fallback. Deployment plan §5c.
- No dependency change; `package.json` gains one entry in the `verify:l10n` chain.

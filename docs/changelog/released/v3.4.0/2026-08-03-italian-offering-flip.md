# 2026-08-03 — The Italian offering flip (v3.4 work-beat)

_Folds into the **3.4.0** release entry._

## User-facing
- **Italian is live.** Choosing Italiano as your native language now gives you thirteen full
  courses and an Italian interface, instead of the single 36-item English course and an
  English interface it gave before.

## Internal
- **The flip, applied** (`docs/_it-offering-flip.md`): `enUsForIt` + `enGbForIt` registered in
  place of the `enForIt` stub, `RELEASED_SOURCE_LANGS += "it"`,
  `SUPPORTED_UI_LANGS += "it"`, and `git rm data/tracks/enForIt.js`.
- **`verify-l10n-coverage.mjs` picked Italian up by itself**, exactly as designed — it reads
  `RELEASED_SOURCE_LANGS` off the module rather than restating it, so `it` moved from an
  ungated `note` row to a gated **PASS** row the moment the flip landed. 13 tracks · 100% /
  100% / 100%.
- **`_it-parity-audit.mjs` is now state-aware.** It was written pre-flip and simulated the
  registry by concatenating the two English tracks onto `listTracks()`. Post-flip those tracks
  are *in* `listTracks()`, so it produced 15 tracks with two duplicates — and its own
  "13 tracks" assertion caught that. It now detects which side of the flip it is on and
  asserts against the real registry when there is one, plus five new post-flip checks (the
  stub is deregistered; en/es/pt/fr unregressed at 13/12/12/12). 22 assertions, all green.

### Four live references the flip doc's "verified unreferenced" claim missed

The doc said `enForIt` was unreferenced outside historical prose. Removing it proved otherwise,
and the sweep that found the rest turned up three more gaps that had nothing to do with the stub:

- **`lib/LangSwitcher.js` had no `it`** — and this is the v3.2.0 bug, verbatim. The map is
  keyed independently of `SUPPORTED_UI_LANGS`, so the flip would have shipped a pill and a
  dropdown row reading a literal `it` instead of `Italiano`. The file's own comment said `fr`
  was listed early "so the flip cannot reintroduce the same bug" — and the next flip
  reintroduced it anyway, because *list the next language early* is a habit, not a check.
  **Every remaining roadmap language (de, ru, ja, zh, ko) is now listed too**, so the next five
  flips cannot repeat it.
- **`lib/trackItemCounts.js` still carried `en-for-it`** and had no entry for either new track,
  so the admin progress dashboard would have shown "—" coverage for both Italian English
  courses and a dead row for the stub. The generator's label map is fixed and the file
  regenerated (20 tracks).
- **`lib/trackSublabels.js` had no `it` column at all** — 11 entries. An Italian learner would
  have seen every track's English sublabel. **The earlier #72 sweep missed this because those
  objects have no `en` key**, and the sweep required one.
- **The guided tour's chrome was still English+Spanish only.** v3.4 localized the tour's
  *steps* into pt/fr/it, but the buttons, counters and headings around them
  (`GuideTour`, `GuideVideoCard`, `GuideOverlay`, `app/guide/page.js`) were untouched — so the
  changelog's "the guided tour now speaks your language" would have overclaimed. Now localized
  in all three. The video itself is still English and its badge still says so.

### The audit that found them was itself broken

`scripts/audit-i18n-columns.mjs` shipped earlier in v3.4 with
`try { parse(...) } catch { continue }`. **acorn cannot parse JSX, so every component in
`app/` and `lib/` was silently skipped** and the audit reported a clean bill of health for
files it had never opened. It now strips JSX with esbuild first, and a parse failure is
reported loudly and sets a non-zero exit instead of vanishing. That single change is what
surfaced `LangSwitcher`, the guide chrome and the admin sections.

**The general rule: a `catch { continue }` in a checking tool converts "I found nothing" into
"I looked nowhere," and the two read identically in the output.**

- **Help/About corrected in all five languages.** The copy listed the *How to use SquirreLingo*
  tour among the corners still English for everyone. That stopped being true this release, so
  the sentence now names only the *Grammar Gym* page and the status/error screens, and says the
  tour follows your language. Standing rule: a change a user would notice updates Help in the
  same pass.
- **Still open, logged not fixed:** the nine `app/admin/*` section files carry `{en, es}` UI maps
  with no pt/fr/it. Admin-only surfaces, seen by one person; the audit lists them every run.
- **Verified post-flip:** `npm run verify:l10n` green with `it` as a gated PASS row ·
  `_it-parity-audit.mjs` 22/22 · a full offering probe (picker, 13 tracks, icons, sublabels,
  item counts, and en/es/pt/fr unregressed) · `audit-i18n-columns.mjs` reporting every file
  parsed · `npx eslint .` 0 errors / 81 warnings, unchanged by the flip · full `next build` green.

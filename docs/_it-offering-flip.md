# v3.4 — the Italian offering flip

_Written 2026-08-03. **APPLIED 2026-08-03** (Sean's go). Kept as the record of what was
decided and why, exactly as `docs/_fr-offering-flip.md` was for v3.3._

> ## ⚠️ What this document got wrong
>
> It claimed `enForIt` was "verified unregistered and unreferenced" apart from historical
> prose. **Removing it proved otherwise**, and the sweep that cleaned up after it found three
> further gaps unrelated to the stub:
>
> | | |
> |---|---|
> | `lib/trackItemCounts.js` | still carried `en-for-it`, and had no entry for either new track — the admin progress dashboard would have shown "—" coverage for both. Generator label map fixed, file regenerated. |
> | `lib/LangSwitcher.js` | **no `it` key** — the flip would have shipped a language pill reading a literal `it`. This is the v3.2.0 `pt` bug, verbatim, one release after this file's own comment said listing a language early prevents it. All remaining roadmap languages are now listed. |
> | `lib/trackSublabels.js` | **no `it` column** (11 entries). The earlier #72 sweep missed it because those objects carry no `en` key and the sweep required one. |
> | the guided-tour chrome | `GuideTour` / `GuideVideoCard` / `GuideOverlay` / `app/guide/page.js` were still en+es only, so the tour's steps were in five languages and its buttons in two. |
>
> All four are fixed. **The lesson is about the checking, not the list:**
> `scripts/audit-i18n-columns.mjs` had `try { parse(...) } catch { continue }`, and acorn
> cannot parse JSX — so every component in `app/` and `lib/` was silently skipped and the
> audit reported clean for files it never opened. Hardened to strip JSX first and to fail
> loudly on an unparsable file. **A `catch { continue }` in a checking tool turns "I found
> nothing" into "I looked nowhere," and the two read identically.**
>
> Run `node scripts/audit-i18n-columns.mjs` before the next flip. It ends with either
> `every file parsed — nothing skipped` or a list of what it could not read.

## What is different about this flip

**Italiano is already in the picker, and it is already broken.** Every previous source
language was genuinely inert before its flip: `fr` could not be selected until `enUsForFr`
was registered. Italian is not in that position and never has been.

`listNativeLanguages()` derives the picker from `new Set(listTracks().map(t => t.nativeLang))`,
and `enForIt` has carried `nativeLang: "it"` since before v3.0. Verified against the built
tree: the picker returns `en · es · pt · it · fr` **today**, and an Italian native who selects
it gets **one track** — `en-for-it`, 36 items — with an English interface.

So this flip is not "make Italian reachable". It is **"make the thing that is already
reachable correct"**. Two consequences:

1. The usual §5c reasoning ("in-flight source work is inert until the flip, so a Z can cut
   over it") did not apply to the Italian work in this release. It was all a live-facing
   repair.
2. Not applying this patch is not the safe option. It leaves the broken state in place.

## The patch

### 1. `data/tracks/index.js` — swap the stub for the two real tracks

```diff
-import enForIt from "./enForIt";
+import enUsForIt from "./enUsForIt";
+import enGbForIt from "./enGbForIt";
 import enUsForFr from "./enUsForFr";
 import enGbForFr from "./enGbForFr";
```

```diff
-  [enForIt.id]: enForIt,
+  [enUsForIt.id]: enUsForIt,
+  [enGbForIt.id]: enGbForIt,
   [enUsForFr.id]: enUsForFr,
   [enGbForFr.id]: enGbForFr,
```

```diff
-const RELEASED_SOURCE_LANGS = new Set(["en", "es", "pt", "fr"]);
+const RELEASED_SOURCE_LANGS = new Set(["en", "es", "pt", "fr", "it"]);
```

And the comment on line ~88 that names the sourceSpecific tracks:

```diff
-//    tracks enForIt/enUsForEs/enGbForEs) carry content authored for one native
+//    tracks enUsForIt/enGbForIt/enUsForEs/enGbForEs) carry content authored for one native
```

### 2. `lib/uiLang.js` — let the interface resolve to Italian

```diff
-export const SUPPORTED_UI_LANGS = ["en", "es", "pt", "fr"];
+export const SUPPORTED_UI_LANGS = ["en", "es", "pt", "fr", "it"];
```

### 3. Retire the stub — **a command for Sean, the bridge cannot delete**

```
git rm data/tracks/enForIt.js
```

`enForIt.js` is git-tracked, so history keeps it; `_to_delete/` is gitignored and is the wrong
route for a tracked file. Run this **after** step 1, or the build breaks on a missing import.

**Verified unregistered-after-step-1 and unreferenced:** the only mentions of `enForIt`
anywhere else in the repo are the comment on index.js line ~88 (fixed above) and historical
prose in `lib/version.js` changelog entries and `docs/`, which is correct — that is history,
not a live reference.

**Why retire rather than keep both.** `en-for-it` is `sourceSpecific` with `nativeLang: "it"`,
so after the flip an Italian native would be offered it *alongside* `en-us-for-it` and
`en-gb-for-it` — 14 tracks, two of them teaching American English, one of them a 36-item stub
that fails every depth floor (12 vocab / 9 gram / 7 trad / 4 fono). Its content is a subset of
what `enUsForIt` now covers: the false-friend material was folded in during authoring.

## What the flip does NOT need

- **No `lib/languageNames.js` change** — it already carries a full `it` column for every
  language, and `VARIANT_NAMES`/`ICONS_BY_TRACK_ID` are target-keyed, so Italian inherits
  every language name and track icon for free (the v3.2 fix).
- **No `data/tracks/l10n/index.js` change** — the 11 `it` side tables are already registered.
  That registration is safe pre-flip: `getL10n(trackId, "it")` is only reachable when
  `sourceLang === "it"`.
- **No `lib/playStrings.js` / `guideSteps.js` / `skillLevels.js` / `helpAboutContent.js`
  change** — the Italian columns landed earlier in v3.4 and are already live for the (broken)
  Italian users.
- **No `regionalVariants.js` change** — Italian's `records` stay empty by decision, and
  `indexRegionalTerms` stays off. See the comment in that file.

## Pre-flip verification — all green as of 2026-08-03

Run `node scripts/_it-parity-audit.mjs`. It builds the post-flip registry in memory and
asserts against it, so none of this depends on applying the patch first:

| check | result |
|---|---|
| tracks offered to an Italian native | **13** |
| no Italian-target track offered | pass |
| the `enForIt` stub excluded | pass |
| both English variants present | pass |
| no stub track (≥300 bank items each) | pass |
| every reused track has an `it` side table | pass |
| no item with duplicate localized options | pass |
| `en-us-for-it` / `en-gb-for-it` explanations carry `it` | 778/778 · 774/774 |
| `correctIdx` is 0 throughout both | pass |
| fono explanations carry `it` on every offered track | pass |

**#60 coverage, measured on the simulated offering through the real render path:**

| native | tracks | explanations | wrong notes | distractor notes |
|---|---|---|---|---|
| it | 13 | 16,700 / 16,700 — 100% | 7,220 / 7,220 — 100% | 19,464 / 19,464 — 100% |

Matching `es`, which is the §4 step 2 bar. After the flip, `npm run verify:l10n` picks Italian
up automatically — `verify-l10n-coverage.mjs` reads `RELEASED_SOURCE_LANGS` off the module
rather than restating it, so `it` starts being gated the moment this patch lands.

## After applying

1. `npm run verify:l10n` — expect `it` to appear as a **PASS** row, not a `note` row.
2. `npx eslint .` — expect 0 errors.
3. `npx next build` — expect green.
4. `node scripts/_it-parity-audit.mjs` still passes (it excludes `en-for-it` explicitly; once
   the stub is gone the exclusion is a no-op).
5. Onboarding + Settings: pick Italiano, confirm 13 tracks and an Italian interface.

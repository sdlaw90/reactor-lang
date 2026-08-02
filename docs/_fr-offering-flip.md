# The French offering flip — the exact patch, NOT applied

_Written 2026-07-29 by the v3.3 Phase 2 run. **This is the artifact Sean signs off on.**
Nothing in this file has been applied to the repo. Until it is, French is unreachable._

Authority: `claude/squirrelingo_offering_flip_checklist.md` ("The flip is a reviewed diff,
not an edit") and deployment plan §5c (a Z release can cut safely over a half-built Y **only
because the offering flip goes last**).

---

## 1. Why the flip is a separate, signed-off step

`listNativeLanguages()` (`data/tracks/index.js`) derives the onboarding and Settings
native-language picker from `new Set(listTracks().map(t => t.nativeLang))`. The moment
`enUsForFr` / `enGbForFr` appear in `TRACKS`, **Français appears in the picker and a user can
select it** — `tracksForNativeLang` lets a `sourceSpecific` track bypass
`RELEASED_SOURCE_LANGS` entirely. So *track registration IS the flip*, not part of the build.

That is why Phase 2 authored `data/tracks/enUsForFr.js` and `data/tracks/enGbForFr.js` but
**did not import or register them**, and why `data/tracks/index.js` and `lib/uiLang.js` were
left untouched.

Registering the ten **side tables** in `data/tracks/l10n/index.js` (which Phase 2 did do) is
inert by contrast: `getL10n(trackId, "fr")` is only ever called with `sourceLang === "fr"`,
and no code path can produce that value while `fr` is absent from both the picker and
`RELEASED_SOURCE_LANGS`.

---

## 2. The patch

### 2a. `data/tracks/index.js` — imports

```diff
 import koForEn from "./koForEn";
 import enForIt from "./enForIt";
+import enUsForFr from "./enUsForFr";
+import enGbForFr from "./enGbForFr";
```

### 2b. `data/tracks/index.js` — `TRACKS`

```diff
   [koForEn.id]: koForEn,
   [enForIt.id]: enForIt,
+  [enUsForFr.id]: enUsForFr,
+  [enGbForFr.id]: enGbForFr,
 };
```

### 2c. `data/tracks/index.js` — `RELEASED_SOURCE_LANGS`

```diff
-const RELEASED_SOURCE_LANGS = new Set(["en", "es", "pt"]);
+const RELEASED_SOURCE_LANGS = new Set(["en", "es", "pt", "fr"]);
```

Also update the comment immediately above it, which enumerates the roadmap:

```diff
-// v3.0 English · v3.1 Spanish · v3.2 Portuguese · … (see
+// v3.0 English · v3.1 Spanish · v3.2 Portuguese · v3.3 French · … (see
```

### 2d. `lib/uiLang.js` — `SUPPORTED_UI_LANGS`

```diff
-export const SUPPORTED_UI_LANGS = ["en", "es", "pt"];
+export const SUPPORTED_UI_LANGS = ["en", "es", "pt", "fr"];
```

**Read this one twice.** `detectUiLang()` matches `navigator.language` against this list, so
adding `"fr"` does not merely *permit* French on the pre-login screens — it **auto-selects**
French for every visitor whose browser locale is `fr-*`, instantly, with no user action. Any
gap in the pre-login French copy becomes visible to those visitors the moment this line lands.

**And it is not only a pre-login gate.** Nine post-login surfaces gate on it too, all with the
same `if (nl && SUPPORTED_UI_LANGS.includes(nl)) setLang(nl)` shape:
`app/help/page.js`, `app/about/page.js`, `app/guide/page.js`, `app/changelog/page.js`,
`app/whats-new/page.js`, `app/admin/page.js`, `app/admin/set-password/page.js`,
`lib/BackHome.js`, `lib/GuideOverlay.js`. So **2c without 2d ships a half-French app**: a
French native would get French play/learn (those resolve through `uiLangForSkill`, which does
not consult this list) but **English Help, About, Guide, Changelog and What's-New**.

### 2e. Nothing else

- `lib/LangSwitcher.js` already carries `fr: "Français"` — added deliberately ahead of the
  flip in the 3.2.1 work so the flip cannot reintroduce the v3.2 raw-`pt` bug.
- `NATIVE_LANG_LABELS` in `data/tracks/index.js` already carries `fr: "Français"`.
- `lib/languageNames.js` `LANGUAGE_NAMES` / `VARIANT_NAMES` and `lib/trackIcons.js`
  `ICONS_BY_TRACK_ID` are **target-keyed**; French inherits every language name, variant name
  and track icon for free. Verified against the files, not assumed.
- `lib/trackSublabels.js` needs **no** entry for `en-us-for-fr` / `en-gb-for-fr`: that file's
  own contract is that source-specific tracks carry their sublabel on the track object, and
  both new tracks do (`"Pour les francophones · American English"` / `"… · British English"`).

---

## 3. What the flip produces — `tracksForNativeLang("fr")`

**Machine-verified** by `scripts/_fr-parity-harness.mjs` (Phase 3 of this run): it reads the
shipped `data/tracks/index.js`, adds the two unregistered tracks to a copy of `TRACKS`, adds
`"fr"` to a copy of `RELEASED_SOURCE_LANGS`, reimplements `tracksForNativeLang`'s filter
verbatim and asserts on the result. **117 assertions, 0 failures**, including a negative
control proving the regression check can fail. Full output in `docs/_run-log-v3.3.md`.

| # | Track id | Kind | Depth |
|---|---|---|---|
| 1 | `es-latam-for-en` | reusable | full |
| 2 | `es-spain-for-en` | reusable | full |
| 3 | `pt-br-for-en` | reusable | full |
| 4 | `pt-pt-for-en` | reusable | full |
| 5 | `it-for-en` | reusable | full |
| 6 | `de-for-en` | reusable | full |
| 7 | `ru-for-en` | reusable | full |
| 8 | `ja-for-en` | reusable | full |
| 9 | `ko-for-en` | reusable | full |
| 10 | `zh-for-en` | reusable | full |
| 11 | `en-us-for-fr` | source-specific | full |
| 12 | `en-gb-for-fr` | source-specific | full |

**12 tracks, both English variants present, no stubs.** Matches pt's 12 exactly. The two
French-target tracks (`fr-for-en`, `fr-ca-for-en`) are correctly excluded
(`t.targetLang !== nativeLang`).

"No stubs" here means something specific and testable, because the first version of this
check did **not**. It originally asserted only "≥ 3 categories, none empty, has a grammar
category, has a fono bank" — and the repo's own half-shipped `enForIt` (12 vocab / 9 gram /
7 trad / 4 fono) passes all four. That assertion could not fail. It now asserts a hard floor
per category (vocab ≥ 100, grammar ≥ 200, trad ≥ 80, fono ≥ 50) **and** a frozen per-track
baseline measured 2026-07-29, so counts may grow but never shrink; a negative control in the
harness confirms `enForIt` fails the floors. Two further holes were closed the same way: the
fr side tables are now checked to be *French* (not a byte-copy of their es/pt sibling — that
would have satisfied every shape check while giving a French native a Spanish surface), and
the #89 chips are now asserted per file. All three were mutation-tested.

**Depth is not the same as chip coverage.** Read this alongside §5.2: the 12 tracks are at
full content depth, and 721 training-wheel chips on the de/ru/ja/ko tracks still render in
English for a French native — as they do for a Spanish or Portuguese native today.

---

## 4. The offering-flip checklist, run against this patch

`claude/squirrelingo_offering_flip_checklist.md`, five steps.

### Step 1 — AST sweep for incomplete language maps

Ran over `lib/`, `app/`, `data/tracks/*Tags.js`, `data/tracks/l10n/regionalVariants.js` with
acorn + acorn-jsx and a permissive recursive walker (acorn-walk ships no JSX visitors).
108 files parsed, 0 parse failures. Every object literal carrying `en` **plus at least one
other language code** but no `fr`:

| Count | Shape | Where | Audience | Verdict at the flip |
|---:|---|---|---|---|
| 931 / 929 | `[en/pt]` | `data/tracks/enUsForPt.js`, `enGbForPt.js` | pt natives only | **Not a French gap.** French speakers get `enUsForFr`/`enGbForFr` instead. |
| 515 | `[en/de]` | `deForEnTags.js` | every non-en source | Pre-existing, all sources. See §5. |
| 184 | `[en/es]` ×180 + `[en/es/pt]` ×4 | `lib/version.js` | user-facing | Changelog bullets. **Phase 6.** |
| 84 / 78 / 44 | `[en/ja]` `[en/ko]` `[en/ru]` | `jaForEnTags.js`, `koForEnTags.js`, `ruForEnTags.js` | every non-en source | Pre-existing, all sources. See §5. |
| 42 / 41 / 29 / 29 / 27 | `[en/es]` | `esSpainForEnTags.js`, `esForEnTags.js`, `ptBrForEnTags.js`, `ptPtForEnTags.js`, `itForEnTags.js` | **French natives** | **#89 training-wheel chips — CLOSED in Phase 3 of this run.** `fr` added to all five; `pt` added to the three a pt native is also offered (es-latam, es-spain, it). These five files: **168 chip objects, 278 new keys**. Across all seven tag files touched: 230 objects, 340 keys, and the diff is verified purely additive — 775 pre-existing language values (chips + `THEMES`) byte-identical, line counts and CRLF unchanged, with a negative control proving the comparison detects a mutated value. |
| 31 / 31 | `[en/es]` | `frForEnTags.js`, `frCaForEnTags.js` | pt natives | French natives are never offered a French target, so no `fr` is needed here — **deliberate omission, verified against `data/tracks/index.js:92` (`t.targetLang !== nativeLang`)**. `pt` **CLOSED in Phase 3**. |
| 36 | `[en/es]` | `data/tracks/enForIt.js` | it natives | The half-shipped Italian source. Pre-existing, **v3.4**. |
| 22 | `[en/es]` | `lib/guideSteps.js` (18), `GuideTour.js`, `GuideVideoCard.js`, `GuideOverlay.js`, `app/guide/page.js` | **user-facing** | **BLOCKS the flip's honesty claim.** Same 38-string set that is already missing `pt`. |
| 9 | `[en/es]` | 9 files under `app/admin/` | admin only | Does not block. |
| 2 | `[en/es]` | `lib/frequencyVocab.js` | not copy | Word-frequency data. Confirmed non-user-facing. |
| 1 | `[en/es]` | `app/play/[trackId]/page.js` | **user-facing** | One component-local `T` map on the play screen. Must be closed before the flip. |

One thing in the Phase 3 chip output looks like a register violation and is not:
`esForEnTags.js` `P.usted` now reads `fr: "usted (vous, formel)"`. That `vous` is the French
**gloss of the Spanish polite pronoun `usted`** — it is naming a target-language form, not
addressing the learner. The `tu` house rule governs app voice; it does not forbid the word
`vous` where `vous` is the thing being taught. Do not "fix" it.

### Step 2 — hardcoded English with no language map at all

Not re-derived this run; the v3.3 Phase-1 sweep already enumerated it and nothing this run
touched changes it. **~60 user-facing strings are localized into no source language at all**,
led by the entire Grammar Gym page (which calls `t()` for its four mode-toggle labels and
hardcodes everything else, so it looks localized to a grep). French inherits all of them.

### Step 3 — split by audience before scoping

- **User-facing and French-visible at the flip: ~83** — 22 guided-tour/guide strings + 1 play
  page + ~60 never-localized.
- **Admin-only: 237** (9 `T` maps). Does not block.
- **Not user copy: 2.**

### Step 4 — add the new language's key to guard tables while it is inert

Done. `lib/LangSwitcher.js` `LANG_LABELS.fr` and `NATIVE_LANG_LABELS.fr` are already present
and unreachable. Phase 1 filled `playStrings`, `helpAboutContent`, `skillLevels`,
`trackSublabels` and all 12 `THEMES` tables. Phase 2 filled the 10 side tables and the two
English-target tracks. Phase 3 filled the #89 chips.

### Step 5 — what Help and About claim

Both say the whole interface follows your native language. With the ~83 user-facing gaps
above still open, **that sentence would be false in French on the day of the flip** — and it
is already false in Portuguese today. The claim is itself translated copy, so shipping the
flip over it makes the app overclaim in four languages at once.

---

## 5. Recommendation — two conditions before applying this patch

1. **Close the ~83 user-facing gaps in es + pt + fr together.** They are one release's worth
   of work, they are already owed to Portuguese, and doing them after the flip means doing
   them under a live French audience. This is the "localization-completeness release" already
   on the open-items list.
2. **Decide on the non-Romance training-wheel chips** (`de` 515, `ja` 84, `ko` 78, `ru` 44 =
   **721 objects**). These carry `en` + the TARGET language and have never been localized into
   any source language, so a French native sees them in English — but so does a Spanish or
   Portuguese native **today**. This is a pre-existing, source-agnostic gap, not a French
   regression, and it is roughly 4× the size of the Romance chip fix Phase 3 just did. It does
   not block the flip; it does need a decision rather than silence.

Neither condition is a bug in the French build. Both are pre-existing debt that the flip would
newly make visible.

---

## 6. If you apply it anyway

**Apply 2c and 2d together, not in sequence.** An earlier draft of this file recommended
landing 2a–2c first and 2d "last", on the mistaken premise that `SUPPORTED_UI_LANGS` only
governs pre-login screens. It does not (see 2d): leaving it behind for even one deploy gives a
French native French gameplay and an English Help/About/Guide/Changelog/What's-New. Either
land the whole patch in one commit, or accept and state that consequence deliberately.

Then: verify `tracksForNativeLang("fr")` returns the 12 tracks in §3, re-run the sweep, run
`npm run build`, and re-read §5 of the checklist before deploying.

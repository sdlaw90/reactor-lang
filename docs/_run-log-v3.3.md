# v3.3.0 French — overnight run log

Run started 2026-07-28 (evening, unattended). Operator asleep; gated-phase protocol.
**Outcome: Phase 1 complete and gate-passed. Run STOPPED after Phase 1** — not at the
Phase 3.5 cap — because a pre-existing production bug was found (see §Stop reason).

---

## Setup

- Device folder access to `C:\Users\sean\Documents\reactor-lang` requested and granted.
- Read once, not re-read: state-of-the-app, deployment plan (§3, §4, §4a–4c, §5a–5e),
  native-source build playbook, native-review handoff strategy (§0, §2).
- All work done in the cloud sandbox against staged copies; finished files written back
  through the device bridge.

### Tooling built for this run (sandbox-only, not committed)

Three small AST tools, because hand-editing ~640 rows across 16 files is exactly how the
v3.1.1 miss happened:

- `extract.mjs` — walks a file with acorn, emits every object literal carrying an anchor key
  (`en` by default, `ANCHOR_KEY` to override) but **not** `fr`, with source offsets.
- `inject.mjs` — inserts the `fr` key back at those exact offsets. Preserves the file's EOL,
  the last property's indentation, quoted-vs-bare key style, and the key/value and
  inter-property separators, so the diff is purely additive. Refuses to run if the extract
  and inject passes disagree on object count. `__SKIP__` marks a deliberate omission.
- `sweep.mjs` — the gate's AST sweep: reports every object still carrying `en`/`es`/`pt`
  without `fr`, grouped by key shape so a deliberate skip is distinguishable from a miss.

---

## Phase 1 — fr source foundation

### What was written (all 16 files, uncommitted, on `dev`)

**Modified (16) — no new files this phase:**

| File | fr rows added |
|---|---|
| `lib/playStrings.js` | 398 (397 `STRINGS` keys + `CATEGORY_NAMES.verbo`) |
| `lib/skillLevels.js` | 10 (5 `LEVEL_LABELS` + 5 `LEVEL_DESCRIPTIONS`) |
| `lib/trackSublabels.js` | 10 of 12 (see assumption A2) |
| `lib/helpAboutContent.js` | 2 blocks — `HELP_CONTENT.fr` (23 sections) + `ABOUT_CONTENT.fr` (8 sections incl. the roadmap) |
| `data/tracks/deForEnTags.js` | 9 `THEMES` |
| `data/tracks/esForEnTags.js` | 9 |
| `data/tracks/esSpainForEnTags.js` | 9 |
| `data/tracks/frCaForEnTags.js` | 9 |
| `data/tracks/frForEnTags.js` | 9 |
| `data/tracks/itForEnTags.js` | 9 |
| `data/tracks/jaForEnTags.js` | 9 |
| `data/tracks/koForEnTags.js` | 9 |
| `data/tracks/ptBrForEnTags.js` | 9 |
| `data/tracks/ptPtForEnTags.js` | 9 |
| `data/tracks/ruForEnTags.js` | 9 |
| `data/tracks/zhForEnTags.js` | 9 |

108 theme rows exactly, matching the phase spec's own count.

`lib/languageNames.js` was **not** modified — `LANGUAGE_NAMES` (10 rows) and `VARIANT_NAMES`
(7 rows) already carry a complete `fr` column, and the v3.2 target-keyed
`VARIANT_NAMES_BY_TARGET` derivation means French inherits every variant name for free.
Verified, not assumed.

### GATE 1 — Part A (mechanical)

| # | Check | Result |
|---|---|---|
| 1 | esbuild JSX-parse every touched file | **PASS** — 16/16 clean. Negative control (deliberately broken file) failed as expected, so the check can fail. |
| 2 | `node scripts/rollup-changelog.mjs --check` | **N/A + NOT RUNNABLE** — no v3.3 changelog fragment exists yet (that's Phase 6, next run), and this session had no shell on the Windows machine (see §Deviation). |
| 3 | `grep -rn "profile?.native_lang\|profile.native_lang"` on touched files | **PASS** — zero hits. |
| 4 | AST-sweep for objects carrying `en` but not `fr` | **PASS with two documented gap classes** — see below. |
| 5 | Line endings unchanged | **PASS** — all 16 files were pure CRLF before and are pure CRLF after (CR count == line count on every file, both sides). |
| 6 | `git status` clean / branch `dev` | **NOT RUNNABLE** — see §Deviation. Exact file list above; verify manually. |

**Check 4, the two surviving gap classes (both deliberate, both verified against the originals):**

- `[en/<target>]` × ~500 across the tag files — the #89 `grammar.tense` / `grammar.why` /
  `person` training-wheel chips. **Not** localized to `fr`. See finding G3 — this is a real
  parity gap and the framing in this log was corrected after the gate.
- `[es/pt]` × 2 — `SUBLABELS["fr-for-en"]` and `SUBLABELS["fr-ca-for-en"]`. Deliberate: a
  French native is never offered a French-target track (`data/tracks/index.js:92`,
  `t.targetLang !== nativeLang`).

### GATE 1 — Part B (independent subagent review)

A fresh `general-purpose` subagent with no inherited reasoning was given the phase spec
verbatim, all 16 unified diffs, both the original and proposed files, and the relevant
§4a/§4b context. Its verdict, **verbatim**:

> **PASS — conditional on fixing F1 and F2 (two one-line copy edits) before these files are
> written to `dev`.** Nothing in this phase is reachable by a user, the v3.1.1 raw-key failure
> mode is fully prevented, and the mechanical parity is clean; but two confirmed French copy
> defects and one factually false justification need correcting.

Its findings, verbatim (abridged only where it repeats evidence given elsewhere in this log):

> **F1 · MEDIUM · `lib/trackSublabels.js:28` — untranslated Spanish word in a French string.**
> `fr: "Pour les francophones · Espagnol d'Espagne · vosotros, distinción"`. The `pt` sibling on
> line 27 translates the same token (`vosotros, distinção`), which establishes that `vosotros` is
> deliberately kept (it's the Spanish pronoun being referenced) but `distinción` is *copy*. The
> French row copied the Spanish word verbatim. A French user studying Spanish (Spain) sees a
> Spanish word mid-sentence. **Fix:** `… · vosotros, distinction`.

> **F2 · MEDIUM · `lib/playStrings.js:428` + `432` — gender-agreement error in the gameplay
> summary.** `SettingsPanel.js:932` passes `t(uiLang, currentTenseHints ? "setGpOnF" : "setGpOffF")`
> into `{tHints}`. The `…F` variants exist specifically because the es/pt nouns are **feminine
> plural**. The French translation chose a **masculine plural** noun. Rendered: **"indices de temps
> verbal activées"** — feminine ending on a masculine noun.

> **F3 · MEDIUM · Author's justification for the untranslated chips is factually false.** The
> claim: *"those chips carry only `en` + the TARGET language and have never been localized to any
> source language — neither `es` (v3.1) nor `pt` (v3.2) localized them."* I enumerated the language
> keys on the `T` and `P` declarations in all 12 original tag files. Seven files have them, and
> **every one carries `en` + `es`** … `es` values like `"Imperfecto"` / `"Acciones pasadas en curso,
> habituales o de fondo."` are unambiguously **source-language Spanish prose**, not target-language
> terms. **Spanish (v3.1) did localize these chips.** Portuguese (v3.2) did not — *that* is the
> pre-existing gap. So the accurate framing is: French matches the **pt** precedent, not "no source
> has ever done this." The consequence is real — post-flip, a French native gets ~102 chip entries
> in English (24 + 25 + 17 + 18 + 18 across the five tracks they'd be offered) where a Spanish
> native gets Spanish. That's a French-vs-Spanish parity regression, not a universal gap. **Not a
> blocker for Phase 1** (it's §4b target-parity territory), and the renderer *does* degrade
> gracefully — `app/play/[trackId]/page.js:803/805/807` use `chip[uiLang] || chip.en`, confirmed, so
> no raw keys. **But the assumption log must be corrected**, or Phase 3 will inherit a wrong premise
> about what "parity" means.

> **F4 · LOW-MEDIUM · `lib/helpAboutContent.js` — the NBSP convention was applied in one file and
> not the other.** In `lib/playStrings.js` this is **perfectly executed**: 62/62 qualifying
> punctuation occurrences across 60 French strings are NBSP-preceded (control: the Spanish column
> has 61 occurrences with ordinary spaces, so the detector works), and zero NBSP leaked into
> placeholders, object keys, markup keys, or non-`fr` strings. In `lib/helpAboutContent.js` the
> French block contains **zero** U+00A0 (and zero U+202F) … across 47 sites and all 19 `«`/`»`
> pairs. These are long prose paragraphs on a PWA-first, mobile-first app: an ordinary space before
> `»` or `?` **will** strand the punctuation at the start of a wrapped line. Same file, related: the
> French block uses 191 straight apostrophes `'` while the `en` block uses 76 typographic `’`.

> **F5 · LOW · `lib/playStrings.js:419, 439` — quote-style inconsistency.** Three French strings use
> guillemets, matching the es/pt precedent. Two use ASCII double quotes. **Fix:**
> `« Français (Canada) »` and `« Suivant »`.

> **F6 · LOW (out of scope, flip-time trap — and a live pt bug today) · `lib/LangSwitcher.js:11`**
> `const LANG_LABELS = { en: "English", es: "Español" };` The dropdown renders
> `LANG_LABELS[lang] || lang` over `SUPPORTED_UI_LANGS`, which is `["en","es","pt"]`. **Portuguese
> already renders as the literal string `pt` in the pre-login language pill today** — a live v3.2
> miss, exactly the class of bug this gate exists to catch. When `fr` is added to
> `SUPPORTED_UI_LANGS` at the flip, French inherits the same defect. Add `pt: "Português"` now and
> `fr: "Français"` at flip time.

> **F7 · LOW · French copy nits.** `baFieldFrequency` — *"Réalistement…"* is at best a rare
> non-standard adverb; it reads as a machine coinage. · All 12 tag files, `numbers-time` →
> `"Nombres et dates"`: English is *"Numbers, dates & time"*; both es and pt keep **time**, French
> dropped it. · `HELP_CONTENT.fr.sections[10].title` reads awkwardly. · `trackSublabels.js:44, 47`
> — the `fr` values were appended on the **same line** as `es:`, unlike the other 8 entries.

> **On reachability (Q3): No. Double-gated, proven.** The only two writes of `native_lang` anywhere
> in the checkout are `app/onboarding/page.js:77` and `lib/SettingsPanel.js:729`. Both feed from
> `listNativeLanguages()` (`data/tracks/index.js:60`), which derives its list from
> `new Set(listTracks().map(t => t.nativeLang))`. Across the 17 registered tracks, `nativeLang` takes
> exactly four values — `en`, `es`, `pt`, `it`. **There is no UI path that can set `native_lang` to
> `"fr"`.** Second gate: `app/help/page.js:24` and `app/about/page.js` both do
> `if (nl && SUPPORTED_UI_LANGS.includes(nl)) setLang(nl)`, and `lib/uiLang.js:17` still reads
> `["en","es","pt"]`. Third: `RELEASED_SOURCE_LANGS` unchanged. Fourth … I grepped every touched file
> for `Object.keys`/`entries`/`values` over a language map. There are none … **Adding an `fr` key
> cannot alter behaviour for any en/es/pt/it user.** The work is genuinely inert.

> **On `SUPPORTED_UI_LANGS` (the author's deliberate omission): CORRECT CALL, and stronger than the
> author argued.** `lib/uiLang.js:22` `detectUiLang()` matches `navigator.language`'s base tag
> against `SUPPORTED_UI_LANGS`. Adding `"fr"` would not merely *permit* French — it would
> **auto-select** it for every visitor with an `fr-*` browser locale on the pre-login screens,
> instantly and without any user action.

> **Checked and clean:** Placeholder-token parity across all 397 strings — every French string's
> sorted placeholder multiset equals its English sibling's. **0 mismatches.** · Leading/trailing
> whitespace on all 397 — 0 mismatches … `authAgreePre` `"J'accepte les "` + `authAgreeTos` +
> `authAgreeMid` `" et la "` + `authAgreePp` composes to grammatical French with correct article
> gender. · Inline markup — all 6 links across en/es/pt/fr use valid keys; **no key was translated**,
> every label was. · Contract values — `badgeType` and `anchor` byte-identical to en/es/pt. ·
> Structural parity — recursive type-shape hash of en vs fr **identical** for both blocks. · No
> regressions to existing languages — every en/es/pt value unchanged. · Line endings 16/16 CRLF. ·
> No duplicate object keys introduced. · Foreign-language leakage — heuristic scan of all **641**
> French strings surfaced exactly one true positive (F1).

### GATE 1 — Part C (decide)

All Part A checks green (except two that were not runnable — §Deviation). Part B: PASS
conditional on F1 + F2. **Fixed in-phase, then the entire pipeline was re-run from the
pristine originals and re-verified:**

- **F1** fixed — `distinción` → `distinction`.
- **F2** fixed — noun changed to the feminine `indications de temps verbal`, so
  `{tHints}` = `activées` / `désactivées` now agrees. (`setGpOnF`/`setGpOffF` left alone;
  changing them would have broken the key's whole reason for existing.)
- **F4** fixed — root cause found: `splice-helpabout.mjs` had its `NBSP` constant written as a
  literal ordinary space instead of `\u00A0`, so the transform silently ran and did nothing.
  Now `\u00A0`; 65 NBSP present, and apostrophes normalised to `’` to match the sibling blocks
  (0 straight apostrophes left in the fr blocks).
- **F5** fixed — `« Français (Canada) »` and `« Suivant »`.
- **F7** fixed — `"Nombres, dates et heures"` (all 12 files); `"Concrètement, à quelle
  fréquence…"`; `trackSublabels` line-style bug root-caused (multi-line detection looked at the
  span between the *first and last property*, so a one-property object read as single-line) and
  fixed, so all 10 entries now match the file's own formatting.
- **F3** — no code change (correctly out of Phase 1 scope); the false claim is retracted here
  and carried into the handoff as the top Phase 3 input.
- **F6** — no code change. This is the stop trigger; see below.

Post-fix re-verification: esbuild 16/16 clean · all files pure CRLF · `native_lang` grep zero
hits · AST sweep unchanged except the two documented classes · fix landing confirmed
string-by-string.

**GATE 1 PASSED.** Files written to the repo: 16 written, `rejected: []`.

---

## Stop reason — FULL STOP after Phase 1

The run's FULL STOP list includes: *"You find an existing production bug — write it up and
stop. Don't fix it in a milestone branch."*

Gate 1's subagent found one (F6), and it was independently re-verified against
`lib/LangSwitcher.js` before acting:

**`lib/LangSwitcher.js:11` — the pre-login 🌐 language pill renders the literal string `pt`
for Portuguese users.**

```js
const LANG_LABELS = { en: "English", es: "Español" };   // no pt
```
…while `lib/uiLang.js:17` is `SUPPORTED_UI_LANGS = ["en","es","pt"]`, and the component renders
`LANG_LABELS[uiLang] || uiLang` for the pill and `LANG_LABELS[lang] || lang` for each dropdown
row. Portuguese has no entry, so both fall through to the raw code.

- **Live on `main`** (v3.2.0, released 2026-07-27) — not a `dev`-only regression.
- **User-visible** on every pre-login screen: auth, forgot/reset password, beta-apply,
  onboarding.
- Same *class* as the v3.1.1 bug (a language added to one table and not its sibling), and it
  shipped through the v3.2 release for the same reason: nothing swept the sibling table.
- **Z-sized, one line.** Deliberately NOT fixed here — it belongs in its own Z release off
  `dev`, not folded into a half-built Y milestone.

Per the rule, the run ended here rather than continuing to Phase 2. Phases 2, 3 and 3.5 were
not started; nothing from them is half-written in the repo.

---

## Deviation from the gate protocol (unavoidable, flagged rather than papered over)

This session had **no shell on the Windows machine** — the device bridge exposed only
file listing, staging and writing, not command execution. So gate checks 2 and 6 could not be
executed:

- `node scripts/rollup-changelog.mjs --check` — not run. Moot for now (no v3.3 fragment
  exists), but it must be run before the release cut.
- `git status` / branch confirmation — not run. **The 16-file list above is the complete set
  of intended writes**; every one returned success with `rejected: []`. Confirm manually.

`npm ci` and `npm run build` were likewise not run. Per the working conventions, full build
verification is reserved for dependency/lockfile changes and release zips; this phase changed
neither, and every touched file was esbuild-JSX-parsed instead. **A real `npm run build` is
still owed before the v3.3 cut.**

---

## Assumptions made (operator asleep, could not ask)

- **A1 — "Register the 12 fr-source tracks" cannot be done inertly, so Phase 2 was scoped
  around it.** `listNativeLanguages()` derives the onboarding/Settings native-language picker
  straight from `listTracks().map(t => t.nativeLang)`. Registering `enUsForFr`/`enGbForFr` in
  `data/tracks/index.js` would therefore put **Français** in the picker immediately — French
  reachable, autonomy rule violated. The plan was: author the two English-target track files
  and all 10 side tables, register the *side tables* (inert — `getL10n(id, "fr")` is only
  reachable when `sourceLang === "fr"`), leave `data/tracks/index.js` untouched, and verify
  §4b parity against a simulated registry in a harness rather than the shipped file. The run
  stopped before Phase 2, so none of this was built — but the constraint is real and Phase 2
  must be planned around it.
- **A2 — `trackSublabels.js` gets `fr` on 10 of 12 tracks**, skipping `fr-for-en` and
  `fr-ca-for-en`. Justification is `data/tracks/index.js:92` (`t.targetLang !== nativeLang`),
  not precedent — the reviewer correctly noted the `es` block *does* carry dead `es` entries
  for its own targets, so precedent cuts both ways.
- **A3 — Tag files get `fr` on `THEMES` only** (9 × 12 = 108, the spec's own number), not on
  the #89 chips. Correct for the phase spec; see G3 for what it costs.
- **A4 — French typographic spacing (U+00A0 before `: ; ? !`, inside `« »`) is applied**, and
  guillemets are used where en used curly quotes. A French native reviewer would expect this;
  it is invisible in a diff, so it is called out in the review packet.
- **A5 — Informal `tu` throughout**, matching the es/pt register (`tú`/`você`).
- **A6 — CEFR → CECR** (the standard French abbreviation), paralleling pt's QECR.
- **A7 — "Grammar Gym" translated as "Gym de grammaire"**, following pt's precedent of
  translating it ("Academia de Gramática") rather than keeping the English product name.
  Flagged in the packet as a judgment call.
- **A8 — `CATEGORY_NAMES.verbo` → "Verbes"**, following the es/pt precedent ("Verbos") rather
  than the `en` value ("Grammar"). `verbo` is the legacy grammar key on the two Spanish-target
  tracks, which a French native *will* be offered, so this row matters.
- **A9 — `SUPPORTED_UI_LANGS` deliberately NOT extended to include `fr`.** It belongs to the
  offering flip. The reviewer confirmed this is stronger than it looks: `detectUiLang()` would
  have *auto-selected* French for every `fr-*` browser locale the moment it was added.

---

## Other things worth knowing (found, not fixed)

- **G3 (the corrected version of the chip claim).** The #89 training-wheel chips (`T`/`P`
  declarations, `grammar.tense` / `grammar.why` / `person`) carry `en` + `es` in the seven
  Romance-target tag files and `en` + `<target>` in the rest. **Spanish localized them in
  v3.1; Portuguese did not in v3.2.** French now matches Portuguese. Post-flip a French native
  sees ~102 chip entries in English on the five tracks they're offered
  (es-latam, es-spain, it, pt-br, pt-pt) where a Spanish native sees Spanish. Renderer
  degrades gracefully (`chip[uiLang] || chip.en`), so no raw keys — this is a parity gap, not
  a crash. **This is Phase 3's first input**, and it applies to Portuguese too.
- **THEMES carry no `es` on the non-Romance tag files** (de/ru/ja/ko/zh have `en` +
  `<target>` + `pt`, no `es`). Spanish natives see English theme labels on those five tracks
  today. Pre-existing, graceful fallback, same family as G3.
- **`enForIt` puts Italian in the native-language picker today.** `enForIt.nativeLang === "it"`
  and it is registered in `TRACKS`, so `listNativeLanguages()` offers **Italiano** — but `it`
  is not in `RELEASED_SOURCE_LANGS`, so an Italian native gets exactly one track (English) and
  an otherwise-English app. Pre-existing since before this arc, not touched. Worth a decision
  before v3.4 Italian, since v3.4 will collide with it.
- **The device staging cache did not misbehave this run.** No file was staged twice, which is
  probably why. The rule still stands for Phase 2.

---

## Content produced (all AI-authored, zero native review)

| Surface | Rows | French words |
|---|---|---|
| `playStrings.js` — `STRINGS` + `CATEGORY_NAMES.verbo` | 398 | ~2,460 |
| `helpAboutContent.js` — `HELP_CONTENT.fr` | 65 strings / 23 sections | ~2,840 |
| `helpAboutContent.js` — `ABOUT_CONTENT.fr` | 45 strings / 8 sections | ~1,010 |
| `skillLevels.js` | 10 | ~120 |
| `trackSublabels.js` | 10 | ~60 |
| `*Tags.js` `THEMES` | 108 rows (9 distinct strings ×12 files) | ~30 distinct |
| **Total** | **~636 rows / ~537 distinct strings** | **~6,500 words** |

Packet: `claude/squirrelingo_fr_review_packet.md`.

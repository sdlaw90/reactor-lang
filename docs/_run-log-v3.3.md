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

---
---

# v3.3.0 French — run 2 (Phases 2, 3, 3.5)

Run started 2026-07-28, unattended. Continues the log above; the Phase 1 sections are unchanged.

**Outcome: Phases 2, 3 and 3.5 all completed and gate-passed. Run stopped at the Phase 3.5 cap
as instructed — and independently hit the "found an existing production bug" FULL STOP trigger
during Phase 3.5 extraction (see §Stop reason).**

## Mode

**No shell on the Windows machine**, same as run 1 — the device bridge exposed folder listing,
staging and writing only. Gate checks **2** (`node scripts/rollup-changelog.mjs --check`) and
**6** (`git status` / branch confirmation) are therefore **NOT RUN** at every gate below, and are
handed to Sean in the state-of-the-app doc. They were never reported as passed.

Everything else ran in the cloud sandbox against staged copies: esbuild JSX-parsing, acorn AST
extraction/injection/sweeps, the greps, the register check, the parity harness, the review
pipeline, and one independent subagent per gate.

## Tooling built for this run (sandbox-only, not committed)

- **A batched translation pipeline.** 127 input batches → 127 agent runs → mechanical
  reassembly. Agents wrote JSON to disk and returned one line, so ~1.4 M characters of French
  never passed through the orchestrator's context. A shared `STYLE.md` (register, typography,
  the source-vs-target rule, the structural contract) was pinned into every agent.
- **`validate.py`** — per-batch structural validation: id set, field set, option-array length,
  placeholder parity, edge whitespace.
- **`verify.mjs`** — post-assembly parity against the pristine originals, via acorn.
- **`postfix.py`** — the terminology + typography normalisation pass, with **residual counts
  asserted to zero** afterwards (the Phase 1 F4 lesson).
- **`register_check.py`** — the scoped register assertion, with a negative control.
- **`chips_extract.mjs` / `chips_inject.mjs` / `chips_verify.mjs`** — the #89 chip pass. Inject
  refuses to run if extract and inject disagree on object count or offsets.
- **`sweep.mjs` / `perfile.mjs`** — the offering-flip AST sweep, per-shape and per-file.

---

## Phase 2 — directed tracks + side tables

### Scope, measured before anything was written

| Deliverable | Volume |
|---|---|
| `enUsForFr.js` + `enGbForFr.js` | 1,548 bank items + 156 fono items |
| 10 × `data/tracks/l10n/<track>.fr.js` | 13,554 entries / 18,077 unique source strings |
| **Total French authored** | **~920,000 characters ≈ 150,000 words** |

Roughly **20× Phase 1's** content volume.

### What was written (14 files, uncommitted, on `dev`)

**New (13):**

| File | Content |
|---|---|
| `data/tracks/enUsForFr.js` | 777 bank items (vocab 133 / gram 519 / trad 125) + 77 fono |
| `data/tracks/enGbForFr.js` | 771 bank items (vocab 131 / gram 518 / trad 122) + 79 fono |
| `data/tracks/l10n/esForEn.fr.js` | 1,274 entries — translated from the `.pt` sibling |
| `data/tracks/l10n/esSpainForEn.fr.js` | 1,380 — from `.pt` |
| `data/tracks/l10n/ptBrForEn.fr.js` | 1,603 — from `.es` |
| `data/tracks/l10n/ptPtForEn.fr.js` | 1,529 — from `.es` |
| `data/tracks/l10n/itForEn.fr.js` | 1,480 — from `.es` |
| `data/tracks/l10n/deForEn.fr.js` | 1,400 — from `.es` |
| `data/tracks/l10n/ruForEn.fr.js` | 937 — from `.es` |
| `data/tracks/l10n/jaForEn.fr.js` | 1,456 — from `.es` |
| `data/tracks/l10n/koForEn.fr.js` | 1,364 — from `.es` |
| `data/tracks/l10n/zhForEn.fr.js` | 1,131 — from `.es` |
| `docs/_fr-offering-flip.md` | the flip patch + the checklist run against it |

**Modified (1):** `data/tracks/l10n/index.js` — 10 `fr` imports + 10 `fr` registrations.

**Source choice:** es-latam and es-spain have only a `.pt` sibling; pt-br and pt-pt have only
`.es`. For the other six, `.es` was chosen over `.pt` deliberately — the pt tables were
themselves translated es→pt, so going from `.es` avoids a double-translation.

**`data/tracks/index.js` and `lib/uiLang.js` untouched.** French is not reachable.

### GATE 2 — Part A (mechanical)

| # | Check | Result |
|---|---|---|
| 1 | esbuild JSX-parse every written file | **PASS** — 13/13. Three negative controls (unterminated string, dangling array, corrupted object) all failed as required. The first version of this check was passing for the wrong reason (a bad `--loader` flag made *everything* fail, including the control); caught and fixed. |
| 2 | `rollup-changelog --check` | **NOT RUN** — no shell. No v3.3 fragment exists yet either. |
| 3 | `profile?.native_lang` grep | **PASS** — zero hits. |
| 4 | AST sweep for objects with `en` but no `fr` | **PASS** — 1,860 language-map objects across the written files, 1,860 carry `fr`, 0 missing. |
| 5 | Line endings | **PASS** — all 13 pure CRLF, matching the `data/` convention. |
| 6 | `git status` / branch `dev` | **NOT RUN** — no shell. |
| 7 | Invisible-transform output counts | **PASS after a fix** — 41,242 NBSP · 31,688 guillemets · 5,792 typographic apostrophes, every count non-zero. See F3 below: the first run of this check reported "non-zero" while 163 sites were still wrong, because it counted presence and not residual. |
| 8 | Offering-flip sweep | **PASS** — no new incomplete language map introduced. |

Structural verification beyond the gate's own list: every side table has the **same item ids in
the same order**, the **same field set per id**, and **option arrays of the same length**, so
`correctIdx` never moves; both track files keep `explain.en` **byte-identical** (777/777 and
771/771), `correctIdx`, CEFR level and the enGb 6th element unchanged, and no `pt` key survives.

### GATE 2 — Part B (independent subagent), verdict verbatim

> **PASS-conditional** — the mechanical contract holds and nothing is reachable, but claim 5
> (typography) is false in three countable ways, the `tu`-only rule was applied so literally that
> ~250 French subtitles are ungrammatical or not French, and `_fr-offering-flip.md` reports
> Phase-3 work as already closed when it isn't. Fix F1–F4 before this is signed off.

Seven findings. All addressed in-phase.

- **F1 · HIGH · the `vous` ban produced subtitles that aren't French.** Four dodges across ~250
  strings: a raw Spanish pronoun left inside a French sentence (`"Hier, vosotros _____"`),
  `"Toi et les autres"` as a bare subject (French needs the resumptive *vous* to agree),
  `"2e pers. pl. ___"` as an abbreviation, and plural imperatives paired with `s'il te plaît`.
  **This one changes a rule** — see §Assumptions A11.
- **F2 · MEDIUM · the sign-off artifact reported unshipped work as closed.** `_fr-offering-flip.md`
  marked the #89 chips "CLOSED in Phase 3" and cited a harness that did not yet exist.
- **F3 · MEDIUM · claim 5 is false in three countable ways; the transform silently no-op'd.**
  18 strings with a plain space inside `« »` (one contiguous `fono-59`…`fono-76` block the pass
  skipped), 48 with U+0020 immediately followed by U+00A0 (a visible double gap), 34 with a plain
  space before `;`. *"The spec says: if a transform's whole job is invisible, assert on its output
  count. That assertion was not written; had it been, all three would have surfaced."*
- **F4 · LOW/MED · `_fr-offering-flip.md` was LF** where `docs/*.md` is CRLF.
- **F5 · LOW/MED · the flip doc's apply-order produces a half-French app** —
  `SUPPORTED_UI_LANGS` is also a **post-login** gate in nine places.
- **F6 · LOW · independent batches left terminology inconsistent** — `sería` rendered "se dit"
  for items 0–18, "se dirait" for 19–100, "se dit" again for 101–126 (clean batch boundaries);
  `baño` → "bain"; `salle de bain` vs `salle de bains`.
- **F7 · LOW · every new file pointed at a review lane that didn't exist yet.**

Its own control work is worth recording: it re-derived the id/order/option-length checks
independently with negative controls, confirmed **0 orphan `distractorNotes` keys** and **0 new
duplicate-option collisions** (a French merge of two distinct options would make an item
unanswerable), and confirmed kana/hangul/hanzi/Cyrillic byte-identical across all 3,165 strings
carrying them.

### GATE 2 — Part C (decide)

All Part A green (2 and 6 not runnable). Part B conditional. **Fixed in-phase, then re-assembled
from the batch outputs and re-verified end to end:**

- **F1** — 371 entries re-rendered with proper plural agreement by a dedicated repair pass.
  The gate check was replaced (see A11).
- **F3** — root-caused and fixed with counted assertions: 48 double-gaps collapsed, 34
  space-before-`;` converted, 81 + 81 guillemet spaces converted. **Residuals asserted to 0.**
- **F6** — 135 `se dit` → `se dirait` (keyed on the source containing `sería`, not on the French,
  so the rewrite cannot over-reach), 7 `salle de bain` → `salle de bains`, 1 `bain` → `salle de
  bains`, 3 `aburrido` person-state glosses corrected.
- **F2, F4, F5** — the flip doc corrected: chips restated as OPEN-pending-Phase-3, the harness
  claim removed until it existed, the nine post-login `SUPPORTED_UI_LANGS` consumers listed, the
  apply-order recommendation reversed to "2c and 2d together", CRLF restored.
- **F7** — deferred to Phase 3.5, which creates the lane; the paths were corrected then.

Post-fix: 13/13 esbuild clean · 0 structural failures · 0 placeholder mismatches · CRLF intact.

**GATE 2 PASSED.** 14 files written, `rejected: []`.

---

## Phase 3 — target-parity audit (§4b)

### The simulated-registry harness — `scripts/_fr-parity-harness.mjs` (NEW, one-off)

`tracksForNativeLang("fr")` cannot be called for real, because registering the two new tracks
*is* the flip. The harness reads the shipped `data/tracks/index.js` as **text** (never imports —
the track modules use extensionless specifiers only Next resolves, and this has to run with Node
alone and zero deps, same rule as `check_freshness.mjs`), adds the two unregistered tracks to a
copy of `TRACKS`, adds `"fr"` to a copy of `RELEASED_SOURCE_LANGS`, reimplements the filter
verbatim, and asserts.

**Result: 232 assertions, 0 failures.** `tracksForNativeLang("fr")` returns exactly the expected
12 — es-latam, es-spain, pt-br, pt-pt, it, de, ru, ja, ko, zh, en-us-for-fr, en-gb-for-fr — both
English variants present, no French-target track leaking to a French native, and no change to
what `en`/`es`/`pt`/`it` natives are offered.

Two things it got wrong first and how:

- It asserted `tracksForNativeLang("en")` returns **12**. It returns **13** — `tracksForNativeLang`
  pushes `en-gb-for-es` for non-GB English natives on top of the 12 reusable targets. The
  hardcoded baseline was an assertion about the author's memory, not about the code. Replaced
  with a **derived** pre-flip/post-flip comparison that cannot be wrong about a magic number.
- Its negative control popped the **last** registered track, which is `enForIt` —
  `sourceSpecific`/`it`, therefore invisible to an `es` native, so the control passed while
  proving nothing. Now it removes a track that is genuinely in the result set.

### The #89 training-wheel chips

230 chip objects across 7 tag files, extracted by acorn with source offsets, translated, and
injected back at exact byte offsets preserving each object's key style, key/value separator and
inter-property separator.

| File | Objects | Keys added |
|---|---:|---|
| `esForEnTags.js` | 41 | `fr` + `pt` |
| `esSpainForEnTags.js` | 42 | `fr` + `pt` |
| `itForEnTags.js` | 27 | `fr` + `pt` |
| `ptBrForEnTags.js` | 29 | `fr` |
| `ptPtForEnTags.js` | 29 | `fr` |
| `frForEnTags.js` | 31 | `pt` |
| `frCaForEnTags.js` | 31 | `pt` |
| **Total** | **230** | **340 keys** |

Matches the phase spec's own counts exactly. `fr` where a French native is offered the track;
`pt` where a Portuguese native is; neither on a track whose target is the reader's own language.

**Diff proven purely additive:** 775 pre-existing language values byte-identical, 340 new keys,
line counts and CRLF unchanged, with a negative control confirming the comparison detects a
mutated value.

### GATE 3 — Part A (mechanical)

esbuild 7/7 + harness clean, with a negative control · `profile?.native_lang` zero hits · CRLF
preserved on all 7 (463/433/854/996/905/939/839 lines, unchanged) · new-key counts asserted
(466 `fr:`/`pt:` sites) · AST sweep: 0 objects still missing a required language in any of the 7.
**Checks 2 and 6 NOT RUN.**

### GATE 3 — Part B (independent subagent), verdict verbatim

> **VERDICT: PASS-conditional** — on fixing ~24 chip strings (12 of which ship live to Portuguese
> users today) and on closing two provable holes in the harness. The mechanical work is sound and
> byte-exact; the *verification* is weaker than it reports, and the copy has real errors.

Twelve findings. All addressed in-phase. The two that matter most were **proved by mutation, not
argued**:

- **F1 · HIGH · the "no stubs / full grammar depth" assertion was vacuous.** It checked
  "≥ 3 categories, none empty, has a grammar category, has a fono bank". The reviewer spliced the
  repo's own half-shipped `enForIt` bank (12 vocab / 9 gram / 7 trad / 4 fono) into `zhForEn` and
  the harness reported **232 assertions, 0 failures**. *"A 28-item track passes as full grammar
  depth… this one was born unable to fail."*
  **Fixed:** hard floors (vocab ≥ 100, grammar ≥ 200, trad ≥ 80, fono ≥ 50) **and** a frozen
  per-track baseline measured 2026-07-29 — counts may grow, never shrink — plus a built-in
  negative control asserting `enForIt` fails the floors. Re-mutated: now goes red.
- **F2 · HIGH · the harness could not detect a silent no-op localization transform.** The
  reviewer replaced all ten `*.fr.js` with **byte-identical copies of their es/pt siblings** — a
  French native getting a wholly Spanish surface — and the harness still reported 0 failures.
  **Fixed:** assert the fr file is not a byte-copy of its sibling, and assert a French-marker
  ratio **against the sibling file** (comparing markers *within* one file fails, because the
  `prompt` field is target-language by design). Re-mutated: now goes red on all ten.
- **F3 · MEDIUM · the chip fix had zero automated coverage.** Added a chip block to the harness;
  mutation-tested by stripping one key from the `T` block and one from the `P` block — both
  detected.
- **F4 · MEDIUM · wrong-language example glosses**, 16 strings: the convention is
  *reader*-language examples (proved from `frForEnTags`'s own pre-existing `es` row), but
  `esForEnTags`/`esSpainForEnTags` got Spanish forms inside French and Portuguese sentences.
  Fixed to `« j'ai fait »` / `'tenho feito / fiz'` etc.
- **F5 · MEDIUM · `fr: "Prétérit parfait"` is not a French grammatical term** (2 strings) → `Passé composé`.
- **F6 · MEDIUM · French words shipped as Portuguese, live-facing** (4 strings): `pt: "Présent"`
  and `pt: "Passé composé"` on the two French-target tag files, copied from the already-anomalous
  `es` value → `Presente` / `Pretérito perfeito composto`.
- **F7 · MEDIUM · `você (vous, politesse)` inverts Brazilian register** — in pt-BR `você` is the
  *default familiar* form → `você (vous/tu — usuel au Brésil)`, and ptPt made consistent.
- **F8 · LOW/MED · two distinct conjugation slots got byte-identical chips** (`vosotros` and
  `ustedes` both "(vous, pluriel)") → informel / formel.
- **F9 · LOW · column alignment broken.** The injector reused each line's *leading* alignment
  padding as a *trailing* pad. Fixed: multi-line separators kept verbatim, single-line alignment
  padding collapsed to `", "`.
- **F10–F12 · LOW · doc figures mis-scoped, §3 overstated on the strength of F1, and the
  harness's pre-flip asserts contradicted the doc's post-flip instruction** — all corrected; the
  harness now takes `--post-flip` and inverts those two assertions rather than silently becoming
  wrong.

**The framing worth carrying:** *"What breaks first? Not French — French is provably inert.
**Portuguese.** 172 new `pt` chip strings go live to existing pt-BR/pt-PT beta users the moment
these seven files land, none of them through the #41 review lane."*

**GATE 3 PASSED** after those fixes. 9 files written, `rejected: []`.

---

## Phase 3.5 — the French review lanes

### Lane naming — a deviation from the prompt, on purpose

The prompt asked for `fr-france` / `fr-quebec`. The repo's own `LANES` registry in
`pipeline/extract.mjs` — which is what `--lane` resolves against — **already contained `fr-fr`
and `fr-ca`**, and `docs/language-review/README.md` sketches the tree the same way. Lane codes
follow the repo. Used `fr-fr` / `fr-ca`; no change to the lane registry was needed.

### What was built

- `docs/language-review/fr-fr/` — `STATUS.md` + `template/` with **three** generated packets
  (`.xlsx` + `.md` twin + `.sources.json` each) + empty `submitted/`, `changesets/`, `implemented/`.
- `docs/language-review/fr-ca/` — `STATUS.md` scaffold recording exactly what it waits on, and
  the empty subfolders.
- `docs/language-review/pipeline/i18n/fr-fr.json` — the reviewer-facing copy, ~600 strings.
- `pipeline/extract.mjs` — `CONTENT["fr-fr"].explanation.tracks` now lists `enUsForFr` /
  `enGbForFr`, which did not exist before Phase 2.
- `pipeline/build_workbook.py` — two defect fixes (below).

| Scope | fr-fr rows | es-latam | why they differ |
|---|---:|---:|---|
| `interface` | **785** | 1,208 | French has 6 variant rows / 15 card-config rows vs Spanish's 325 / 117 — the `fr` block is a 2-concept seed |
| `taught` | **1,623** | 1,353 | `frForEn.js` is the bigger track |
| `explanation` | **2,104** | 4,872 | Spanish contributes 2,768 glossary rows from `data/vocab/*.es.js`; French has none |

`check_freshness.mjs`: **3 fresh · 0 stale · 0 unverifiable**, and it correctly reports
`fr-ca: no packets built`.

### Pipeline defects found by the French lane and fixed

1. **`build_workbook.py` crashed on a zero-row section.** The `explanation` packet has an empty
   Word Bank sheet (French has no `data/vocab/<x>Words.fr.js`), and the data-validation range is
   built as `<col>2:<col><nrows+1>` — `"D2:D1"` when `nrows` is 0 →
   `ValueError: 1 must be greater than 2`. Guarded. **Every non-Spanish lane would have hit this.**
2. **The thousands separator was hardcoded Spanish.** `f"{n:,}".replace(",", ".")` renders
   **"13.554"**, which a French reader parses as a decimal. Now lane-aware.
3. **The summary sheet emitted a reversed range** for the zero-row sheet
   (`COUNTIF('3-Banque-de-mots'!$G$2:$G$1,…)`). Excel normalises it and counts the header — right
   answer, wrong reason, and a repair-prompt risk in stricter readers. Now emits literal zeros.

### GATE 3.5 — Part A (mechanical)

`node --check` / `py_compile` / JSON parse all clean with a negative control · zero
`profile?.native_lang` · CRLF correct on all changed files (one FAIL caught and fixed:
`i18n/fr-fr.json` was written LF where `es-latam.json` is CRLF — the same per-extension blind
spot as Gate 2's F4) · all 9 packet artifacts non-empty, 1.87 MB total · freshness green.
**Checks 2 and 6 NOT RUN.**

### GATE 3.5 — Part B (independent subagent), verdict verbatim

> **VERDICT: REJECT** — the pipeline plumbing is genuinely correct and reproducible, but the
> reviewer-facing content is a mechanical translation of the Spanish lane: the variant-scope
> instruction is inverted, and ~9 of 16 "team notes" plus at least 8 decision rows describe
> French strings that do not exist in this repo. Sending this burns the engagement it exists to
> protect.

Fourteen findings. What it verified as sound first: the packets **regenerate byte-identically**
(all three `.md` twins and `.sources.json` identical; `.xlsx` differ only in the openpyxl
creation timestamp); row counts exact; `check_freshness.mjs` proven able to go stale, and to
scope correctly (mutating `playStrings.js` staled only `interface`; mutating `frForEn.js` staled
only `taught`); the `build_workbook.py` change inert for non-empty sections (es-latam rebuilt
before and after — identical); `i18n/fr-fr.json` structurally identical to `es-latam.json`;
typography flawless across 599 strings; the lane-naming justification factually true; nothing
reachable.

The findings, and what was done:

- **F1 · HIGH · 9 of 16 team notes quote text that isn't in the cell they annotate** — and
  `build_workbook.py` forces `Priorité = Haute` on any row carrying a note, so these are the rows
  the reviewer is steered to first. Several were written against the **pre-fix Phase-1 draft**:
  `Petites roues`, `Tu te sens confiant`, straight quotes — exactly the strings the Phase-1 gate's
  own F2/F5/F7 fixes removed. **Fixed:** all 16 re-derived from the current `lib/*.js` values.
- **F2 · HIGH · the variant-scope instruction is inverted.** `fr-fr` is `variantScope:
  "reference"`, the mirror image of `es-latam` — so the **RÉFÉRENCE (France) rows are the only
  ones this lane owns**, and the grey italic advisory rows are the Québec ones. The readme and
  DEC-10 told the reviewer the opposite. Traced through `ingest.py`: everything they did on the
  sheet the packet itself calls *"LE PLUS IMPORTANT — commencez par là"* would have been filed
  under "Advisory — outside this lane's scope", and the packet would have returned **zero**
  sign-off on the France side. **Fixed**, along with DEC-09.
- **F3 · HIGH · the decision sheet was a 1:1 translation with invented French specifics** —
  « piste » (0 occurrences in the French column), « Paramètres » (the app says **« Réglages »**,
  5× + 11×), « Petites roues », « Deviens beta tester », `pain au chocolat / chocolatine` in a
  packet containing two concepts, and *"le concept 69"* in a registry with two. **Fixed:** all 28
  decisions across the three scopes re-derived from the French repo; the dead ones replaced with
  real French questions rather than deleted.
- **F4 · HIGH · the superseded doc was never marked historical** — the one instruction the spec
  spelled out. `claude/squirrelingo_fr_review_packet.md` still opened *"It will be extended as
  those phases land."* **Fixed:** replaced with a historical stub pointing at the lane, carrying
  the full 16-term glossary, the tense-naming rationale, the eight divergence terms and the
  excluded-tail boundary (the carry-forward into `STATUS.md` had kept only 5 of 16 glossary terms
  and dropped the tense-naming split — also fixed).
- **F5 · HIGH · "named here and on the packets' decision sheets" was false** — none of the
  recorded defects appeared anywhere in the deliverable. **Fixed:** a "what we already know"
  block folded into each scope's readme.
- **F6 · MEDIUM · four unrecorded extraction-surfaced defects.** All 959 `taught` "Explication en
  français" cells contain **English**; all 76 `taught` pronunciation rows have empty French
  explanation **and** empty minimal pairs (root cause: `extract.mjs:398` has no `.en` fallback,
  unlike the questions path one line up); all 156 `explanation` minimal-pair cells empty; zero
  option notes in either content packet. **Recorded in `STATUS.md` and explained in the packets.**
- **F7 · MEDIUM · a Spanish corpus fact presented as a French one** ("environ 400 notes d'options
  … contiennent du texte anglais" — the French packet has zero notes). **Fixed.**
- **F8 · MEDIUM · 12 dangling `fr-france` references** in the Phase 2 file headers — the naming
  decision was defended in `STATUS.md` but the references it invalidated weren't swept. **Fixed**
  in all 12; files re-parsed and re-verified afterwards.
- **F9 · MEDIUM · `STATUS.md` misattributed the v3.3 stop reason.** **Fixed** — and the reviewer
  surfaced the *worse half* of that defect, now recorded (below).
- **F10 · MEDIUM · theme labels and #89 chips are in NO packet.** `extract.mjs` reads no
  `*Tags.js`, and its drift sweep walks only `lib/` and `app/`, never `data/`. The 108 theme rows
  and 168 chip objects are invisible to the lane. **Recorded as defect 7 in `STATUS.md`; not
  fixed** — it needs a new extractor section, which is beyond this phase.
- **F11 · MEDIUM · accents stripped from Excel tab names** (`Decisions`, `securite`,
  `Nouveautes`, and `regionales`, which is the *Spanish* spelling) while `SYNTHÈSE` two tabs over
  carries its accent. **Fixed.**
- **F12–F13 · MEDIUM/LOW · the `{corpus}` separator and the reversed summary range.** **Fixed**
  (see pipeline defects above).
- **F14 · LOW · assorted** — `extract.mjs:376` still hardcodes the Spanish literal
  `"(respuesta incorrecta) → "`; `README.md` says es-latam interface = 1,207 where the measurement
  is 1,208; the `soffice` recalc step was not run, so summary formulas ship without cached values.
  **Recorded, not fixed.**

Its closing judgment of the French prose is worth keeping verbatim, because it separates the two
halves cleanly:

> **As prose: good — better than good in places.** … `une espace insécable` is correctly feminine
> … these are written, not translated. Typography is flawless across 599 strings. …
> **As a document a paid native opens: it fails on the first sheet**, and for reasons a French
> reader spots immediately and cannot un-see.

### GATE 3.5 — Part C (decide)

Part A green (2 and 6 not runnable). Part B **REJECT**. Eleven of the fourteen findings were
fixed in-phase and the packets rebuilt from the corrected copy; F10 and F14 are recorded as open;
**the re-derivation has not itself been independently reviewed**, and `fr-fr/STATUS.md` now
carries a *BUILT, NOT CLEARED TO SEND* banner saying so. That is the honest state.

---

## Stop reason — the Phase 3.5 cap, and a production bug

The run reached its instructed cap (*"STOP HERE. Phases 4–6 are NOT part of this run."*).

It also hit the FULL STOP trigger independently, during Phase 3.5 extraction:

**`lib/securityQuestions.js` — Portuguese users see the ten security questions in English, and
the resolver cannot be fixed by adding data.**

```js
export function questionLabel(key, lang) {
  const q = byKey.get(key);
  if (!q) return key;
  if (lang === "es" && q.label_es) return q.label_es;   // hardcoded to Spanish
  return q.label || key;                                 // English
}
```

All ten questions carry `label_es` and nothing else — no `label_pt`, no `label_fr` — and even if
`label_pt` were added, the function would ignore it.

- **Live on `main`** (v3.2.0, released 2026-07-27). Rendered at `lib/SettingsPanel.js:681` and
  `app/beta-apply/page.js:488`, both called with the viewer's `uiLang`, and `pt` is reachable on
  both paths.
- **Severity: cosmetic.** Answers are stored and compared by `key`, so account recovery is
  unaffected. No raw keys, no crash. Graceful English fallback — which is why it has been
  invisible.
- **The worse half, found by the Gate 3.5 reviewer and not recorded anywhere before now:**
  `app/forgot-password/page.js:164` renders `q.label` straight from the API, so the **reset flow
  shows the question in English to everyone** — including Spanish users who chose it in Spanish.
- **Why the standing sweep missed it:** the offering-flip AST sweep flags objects carrying `en`
  plus another language code. These keys are `label_es`, `label_pt` — **prefixed**, so the sweep
  cannot see them. That is a blind spot in the standing checklist, not a one-off.

Same family as the v3.1.1 nav-drawer bug and the v3.2 LangSwitcher bug: a language added to the
tables everyone remembers and not to a sibling. Worse than both in one respect — here the
*resolver* is hardcoded, so it is a code fix rather than a data fix.

**Deliberately NOT fixed here.** It is Z-sized and belongs in its own release off `dev`, not
folded into a half-built Y milestone.

---

## Assumptions made (operator asleep)

- **A11 (NEW, and it amends A5) — the `tu` rule governs APP VOICE, not grammatical number.**
  A5 and the run prompt both say `tu`, settled, with a gate check expecting **zero**
  `vous`/`votre`/`vos`. Applied literally to exercise content, that produced ungrammatical
  French in ~370 drill items whose drilled sentence has a genuine 2nd-person-**plural** subject
  (Spanish `vosotros`/`ustedes`, Portuguese `vocês`, German `ihr`). Those now use `vous` with
  proper agreement. **App voice is still `tu` everywhere, with zero exceptions.**
  The gate check was replaced with a scoped one that can still fail: *every* `vous` in a French
  string must sit in an item whose **source** carries a 2nd-person-plural marker. Result:
  **345 sanctioned, 0 leaks**, in the track files **0** (zero tolerance there — they are app
  voice), and a negative control confirms an injected `vous` in an unmarked item is caught.
  **This is the assumption most worth Sean's explicit confirmation.** Reversing it is one
  re-run of the repair pass over the same 371 entries.
- **A12 — six of the ten side tables were translated from the `.es` sibling, not `.pt`.** The pt
  tables were themselves translated es→pt, so going from `.es` avoids a double-translation.
  es-latam/es-spain had only `.pt`; pt-br/pt-pt had only `.es`.
- **A13 — lane codes are `fr-fr` / `fr-ca`, not the prompt's `fr-france` / `fr-quebec`**, because
  the repo's `LANES` registry and README already said so. Recorded in `fr-fr/STATUS.md`.
- **A14 — three pipeline defects were fixed rather than only recorded.** The prompt says record
  extraction-surfaced defects in `STATUS.md` rather than fixing them mid-run; that guidance is
  about *content* defects a reviewer would re-report. A crash in the packet generator blocks the
  deliverable, so it was fixed, minimally, and recorded.
- **A15 — the `_fr-parity-harness.mjs` baselines are frozen at 2026-07-29 counts.** It asserts
  content may grow but never shrink. It is a one-off; delete it when v3.3 ships.

## Deviations from the gate protocol

Unchanged from run 1: **no shell**, so gate checks 2 and 6 could not be executed at any gate.
`npm ci` and `npm run build` likewise not run — every touched file was esbuild-JSX-parsed
instead, and no dependency or lockfile changed. **A real `npm run build` is still owed before the
v3.3 cut.**

One additional note: the es-latam packets were rebuilt **in the sandbox mirror only**, to prove
the `build_workbook.py` change is inert for a non-empty section. They were **not** written back
to the repo; the `es-latam/template/` files on disk are untouched.

## Content produced this run (all AI-authored, zero native review)

| Surface | Volume |
|---|---|
| 10 × `l10n/*.fr.js` side tables | 13,554 entries |
| `enUsForFr.js` + `enGbForFr.js` | 1,548 questions + 156 fono items |
| `#89` chips — `fr` | 168 objects across 5 files |
| `#89` chips — `pt` | 172 objects across 5 files (**live-facing**) |
| `pipeline/i18n/fr-fr.json` | ~600 reviewer-facing strings |
| **Total French** | **≈ 920,000 characters ≈ 150,000 words** |

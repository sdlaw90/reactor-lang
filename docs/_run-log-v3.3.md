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

---

# Phase 4 — fono in French orthography (#71) — 2026-08-02

**Scope decision (Sean, this session):** match the v3.2 Portuguese precedent — localize the fono
**explanations and subtitles**, leave the `sound` respelling string alone. The deployment plan
defines #71 as "respellings in the source language's orthography," but no source has ever done
that: `sound` is byte-identical across en/es/pt/fr, written for an English reader
(`eye NEED-uh GLASS-uh WAH-der`). Logged as a cross-source item alongside the ~83 unlocalized
strings and the 721 non-Romance `#89` chips; **not** a French-specific gap.

**Volume:** 795 FONO_BANK items across the 10 reused tracks → **1,590 explanations** + 20
promptNative subtitles = **1,610 insertions**. `frForEn` / `frCaForEn` correctly excluded
(target == source).

**Translation source: the English original, not the Spanish sibling.** A12 says translate from
`.es` rather than `.pt` to avoid a double translation; applied to fono, `en` is the original and
`es` is already one hop away, so `en` wins and `es` served only as a Romance register reference.

## The L1 anchor pass — the finding worth remembering

61 of the 1,590 explanations anchored a target sound to **English**, because that is who the
English original was written for. Translated faithfully, a francophone is told that German `ö`
— which is the *eu* of « peur » — has "no equivalent in English." True, useless, and
slightly absurd to the reader.

**54 re-anchored to French. 7 kept**, because English is the content rather than an L1 crutch:

| Track | Item | Why it stays |
|---|---|---|
| `esSpainForEn` | 26:respond | the drill *is* "do you speak English" |
| `jaForEn` | 24:respond | the answer content is "I teach English" |
| `jaForEn` | 44:identify | teaches the English loanword テレビ ← *television* |
| `jaForEn` | 66:identify | teaches the English loanword ベッド ← *bed* |
| `ptBrForEn` | 15:respond | the drill is a child studying English |
| `ptPtForEn` | 22:respond | the drill is speaking-English ability |
| `zhForEn` | 45:identify | unaspirated k is already French-anchored (« car »); aspirated k has no French counterpart, so « key » adds real information |

Where French has no counterpart either, the explanation now describes the articulation instead of
naming a language (Spanish/Peninsular `d`/`ci`, the Japanese tap and pitch accent, the German
glottal stop, Korean ㅡ, Italian *gli*).

**Three places where the French trap differs from the English one** and the explanation was
rewritten to the French trap rather than translated: German final `-e` (a francophone drops it →
"LAMP", not "LAM-pay"), German final devoicing (anchored to the *d→t* of « grand » in liaison),
and pinyin `-ong` (a francophone reads it as the nasal « on »).

**This generalizes.** Every later source — v3.4 Italian onward — needs the same pass, and the
**pt layer inherited the English anchors untouched** because it was translated es→pt from
explanations that already carried them. Recorded, not fixed here.

## Verification

Per track, all green (`_frfono/verify.mjs`):

| Check | Result |
|---|---|
| `extraBank` deep-equal to the original once `fr` is stripped | 0 mismatches, 10/10 tracks |
| every `fr` byte-equal to its translated source | 1,590 / 1,590 |
| both promptNative strings equal the expected **rendered** value, `respondPromptNative(i)` interpolation included | 10/10 |
| comment count unchanged · line count unchanged · CRLF preserved | 10/10 |
| residual assertions (8 of them, counting offenders — never presence) | all zero |
| `scripts/_fr-parity-harness.mjs` | 232 assertions, 0 failures |
| ESLint on the 10 files · `npm run build` on Next 16 / React 19 / Node 24 | clean |

**All 12 checks were mutation-tested** and each went red on its own check.

### The mutation test earned its keep — twice

1. **The verifier's own NBSP constant was a plain space (U+0020).** The identical trap as Phase 1.
   Two checks passed while comparing the wrong character. Caught only because the numbers looked
   wrong, then locked shut by defining the constant as `' '` rather than a literal.
2. **An NBSP written as a doubled `\\u00A0` escape renders as literal text**, and the first
   version of the promptNative check — `fr.includes(NBSP)` — passed it, because JS interprets a
   single-backslash ` ` inside a string literal. The check now asserts the exact rendered
   string. **A presence check would have shipped `dit ?` to every French user.**

## Still open after Phase 4

- **Phase 5** — the `fr` regional-variant registry is still a 2-record seed against es 71 / pt 64.
- **Phase 6** — offering flip, straggler sweep, changelog, Help/About.
- **`sound` respellings** are English-oriented for every source. Cross-source, needs a decision.
- **`scripts/_fr-parity-harness.mjs` is still the one-off from A15** — delete it when v3.3 ships.

---

# Phase 5 — the French regional-variant registry (§4c) — 2026-08-02

**2 → 80 records** (es 71 · pt 64). 31 fire on content that already exists; 73 answer slots across
the 12 French tracks. Domain-grouped in the file: table/cuisine/courses · transport/ville/argent ·
maison/vêtements/technologie · gens/travail/école/temps et nombres.

## How the scope was chosen — measure, don't guess

Before authoring anything, the whole answer surface a French native can meet was harvested:
`flattenBank()` over the 10 reused tracks with their `.fr.js` side tables **plus** the two
unregistered English-target tracks, giving **9,804 distinct normalised correct-answer strings**
across 15,102 answer slots (`_frvar/fr-answer-index.json`). Every candidate record was then checked
against it, so "high-frequency ceiling" is a measured claim per record rather than a vibe.

The check also settled a prior worry: the card *does* fire for a source language, because the l10n
side tables localise recognition **options** into the learner's language. A pt-source learner
studying Spanish answers `travesseiro`, and the pt record fires. Confirmed by measurement — es 123
fires, pt 71 — before a single French record was written.

## Two defects in the data model, both found by replaying the component

**1. `default` was the wrong shape for French.** `default` is the term shown when the learner's
country isn't in `regional`. Spanish uses it as a catch-all across twenty Latin American countries.
French's regional group is Québec alone and BE/CH mostly follow France — so a Québec-term default
showed a Belgian `fin de semaine` tagged **"dans ta région (Belgique)"**.

Fixed by mirroring `reference` and listing each divergent variety explicitly — which is exactly what
the original 2-record seed did. **The seed was right and the brief written for the authoring pass
was wrong**; 75 records were rewritten mechanically at merge.

Related and worth knowing: `RegionalVariantCard`'s `isRef` branches are **unreachable**. The
component computes `mineTerm = isRef ? reference : …` and then returns null when
`mineTerm === reference`, so a reference-region learner is always suppressed before the branch that
renders "Au Québec: …" can run. The `default` field is therefore never displayed — it only decides
whether the card appears at all. Not a bug; worth a comment before someone "fixes" it.

**2. The index keyed on the other variety's word.** New per-language flag `indexRegionalTerms`,
`true` for es/pt, off for fr.

es/pt reusable tracks are authored in the regional variety (es-LatAm, pt-BR) as well as the
reference one, so both words legitimately appear as answers. French tracks are authored in France
French only, so indexing the Québec word fires the card on a homograph. **Measured, not argued:**
`bas` is socks in Québec, and both corpus items answering `bas` are the adjective *low*
(`'Bajo' significa…` / `'Baixo' significa…`). Same class for `arrêt` (`die Haltestelle` — France
says `arrêt` too), `bienvenue` (only ever the "welcome to the shop" sense in the corpus), and
latently `fête`, `trafic`, `gomme`, `job`.

**Reference-only keying is the correct default for a single-variety corpus — v3.4 Italian onward
should leave the flag off.** A pleasant side effect: the three meal records no longer collide, so
the load-bearing `dinner → lunch → breakfast` ordering the authoring pass had to rely on is gone.

## Dropped on purpose

| What | Why |
|---|---|
| `de rien` / `bienvenue` ("you're welcome") | `norm()` strips a leading `de`, so the reference indexes as the bare key **`rien`**. Certain false positive. Needs a normalisation change or a multi-word guard — recorded, not bodged. |
| 4 cross-domain duplicates | convenience store · supermarket · grocery shopping · the restaurant bill |
| ~30 authoring candidates | vulgar or offensive in one variety, archaic, spelling-only, or no stable France-side reference (`breuvage`, `liqueur`, `pistolet`, `poêle`, `comptoir`, `gosse`, `cartable`, `kot`) |
| `octante` | archaic. Belgium says `quatre-vingts` like France; only Switzerland diverges (`huitante`). |

## Verification

| Check | Result |
|---|---|
| es / pt card fires, before → after | **123 → 123** · **71 → 71** |
| `default === reference` on every fr record | 80/80 |
| every `regional` entry has ≥1 country from CA/BE/CH and a label; no term equals its reference | 80/80 |
| index keys are the France term only — no Québec/Belgian/Swiss word is a key | 80 keys, 0 stray |
| **card resolution replayed, 80 records × {FR, CA, BE, CH, no country}** | France never sees a card · no-country never sees a card · BE and CH never shown a term not listed for them |
| fires on real content | 73 slots, 31 distinct records |
| ESLint · parity harness · `npm run build` (Next 16) | clean · 232/232 · green |

**All 7 checks mutation-tested; each goes red on its own check.**

### The mutation pass caught the harness again

The first run reported `esUnregressed` and `recordCount` **green while the failure list was
non-empty**. `checks.x = cond || fail(...)` assigned `fail()`'s `undefined`, and the normalisation
line `if (checks[k] !== false) checks[k] = true` then flipped it to `true`. `fail()` now returns
`false`. That is the third instance this session, across two phases, of a check that could not fail
— and the third time the mutation pass is what found it.

## Still open after Phase 5

- **Phase 6** — the offering flip, straggler sweep, changelog, Help/About. **Only phase left.**
- **`norm()` strips a leading `de`/`le`/`la`**, which makes any two-word French reference beginning
  with an article unusable as a key. Blocks the `de rien` record and anything shaped like it.
- **The `isRef` branches of `RegionalVariantCard` are dead code.** Either make reference-region
  learners see the card or delete the branches — don't leave it ambiguous.
- **`fr-ca` review lane** is now unblocked on the data side: the registry is no longer a seed.
- `scripts/_fr-parity-harness.mjs` is still the A15 one-off — delete it when v3.3 ships.

---

# Phase 6 — the offering flip and the release cut — 2026-08-02

**Both flip conditions were put to Sean and decided, which is what §5 of `docs/_fr-offering-flip.md`
asked for.**

| Condition | Decision |
|---|---|
| ~83 user-facing strings localized into no source language | **Flip, and stop overclaiming.** Reword the Help/About interface-language sentence in all four languages rather than hold the milestone for a release's worth of string work already owed to Portuguese. The completeness release stays its own roadmapped beat. |
| 721 non-Romance `#89` chips (de 515, ja 84, ko 78, ru 44) | **Do them now, in v3.3.** Closes the gap for every released source at once instead of leaving es and pt behind. |

## 1. The 721 chips → es, pt, fr

**721 chip objects, 2,163 new keys**, across `deForEnTags` 515 · `jaForEnTags` 84 · `koForEnTags`
78 · `ruForEnTags` 44. Every one carried `en` + the target language only.

**The work was 313 strings, not 2,163.** The chips are three kinds — `tense` (the tense/mood
label), `why` (one clause on what's being tested) and `person` (the subject, repurposed as a
**politeness register** for Japanese and Korean) — and the same English text repeats heavily
across items. Deduping to distinct `(lang, kind, en)` triples cut the authoring job by 85%:
de 155 · ja 70 · ko 55 · ru 33. Translation was applied back by triple, so identical English
always yields identical output.

Grammatical terminology follows each source language's own tradition, except where the label names
a target-language category with an established name (German `Perfekt`/`Konjunktiv II`, Japanese
非過去, Korean 해요체, Russian aspect) — those keep their own name. Subject pronouns stay in the
target language; only the parenthetical person/number gloss is translated.

**Verified per file:** `tagFor()` replayed over **every** prompt key (304 · 141 · 118 · 135) and
deep-equal to the original once es/pt/fr are stripped · every chip carries all three · `THEMES`
untouched · comment count, line count and CRLF unchanged · 5 French residual assertions zero.
**All 7 checks mutation-tested.**

## 2. The flip

`data/tracks/index.js` 2a–2c and `lib/uiLang.js` 2d applied **in one commit**, as §6 of the flip
doc requires — 2c without 2d would have given a French native French gameplay and an English
Help/About/Guide/Changelog/What's-New.

`tracksForNativeLang("fr")` returns **exactly the 12 tracks §3 predicted**, French-target tracks
correctly excluded, en/es/pt unregressed at 13/12/12. Thinnest French-reachable track is
`es-spain-for-en` at 127 vocab / 517 gram / 127 trad / 79 fono — comfortably over the floors, with
the `enForIt` stub still failing them as the negative control.

## 3. The honesty fix — 8 strings

Help's "the whole interface follows it" bullet and About's roadmap card now name what is still
English for everyone: the **How to use SquirreLingo** tour, the **Grammar Gym** page, and some
status and error screens. Changed in en/es/pt/fr; nothing else on either page moves. UI preview
was built and signed off before the write.

This is the smallest honest change available. It does not close the ~83 gaps — it stops the app
asserting they're closed, in four languages instead of making it false in a fourth.

## 4. Changelog and the version bump

- **184 user-facing changelog bullets given `fr`** (~5,200 words), translated from the English with
  the Spanish column as a register reference, `*emphasis*` markers preserved and asserted per
  bullet.
- **New `CHANGELOG` v3.3.0 entry**, five bullets in en/es/pt/fr: French as a native language; the
  France↔Québec card and its Belgian/Swiss awareness; security questions in your own language; the
  🌐 pill's raw `pt`; and the catch-all line.
- **New `INTERNAL_CHANGELOG` v3.3.0 entry** — 174 notes rolled up from the nine fragments plus a
  release-rollup header. `internalNotesByVersion()` re-checked: 254 raw notes → 271 after merge,
  nothing lost (it concatenates rather than assigning — the trap from #91).
- `CURRENT_VERSION` **3.2.0 → 3.3.0**. `npm run changelog:check` → 9 fragments, all well-formed,
  all v3.3.0.

**Two of this session's own fragments failed `changelog:check`** (`missing "## Internal" section`)
and were fixed before the rollup. The checker earned its keep.

## 5. Straggler sweep — a sign-off list, not a fait accompli

Candidates are **unregistered AND unreferenced**, verified by grep against code, `package.json`
and `.github/workflows/`. Four apparent orphans were false positives (`generate-version-json`,
`publish-ready`, `smoke-check`, `voices-list`, `sync-tutorial-video` are all live via
`package.json` scripts or a workflow).

| File | Why it can go |
|---|---|
| `scripts/_fr-parity-harness.mjs` | The **A15 one-off**. It simulates the *pre-flip* world, so now that the flip is applied its two PRE-FLIP assertions fail by design and it double-counts the two registered tracks. Its job is done; `_flip/verify.mjs`'s post-flip equivalent replaces it. |
| `lib/WelcomePopup.js` | Superseded by `lib/GuideOverlay.js` in v3.2 — `app/layout.js` renders GuideOverlay **in its place**, and nothing imports WelcomePopup any more. |
| the 9 `fr-fr-*-review-v3.2.0.*` packet files | Superseded by the v3.3.0 regeneration below. |

**Nothing was moved or deleted.** Move them to `_to_delete/` yourself if you agree.

## 6. Review packets regenerated

All three fr-fr packets rebuilt at v3.3.0 and recalculated so the summary tallies carry cached
values: **interface 1,036 rows** (was 785 — the extra rows are Phase 5's 80 variant records and
this phase's Help/About and changelog changes), **taught 1,623**, **explanation 2,104**.
`check_freshness.mjs`: all three fresh, 0 warnings on extract.

The lane is still marked **not cleared to send** for the Gate 3.5 reason (the reviewer-facing copy
was re-derived and never independently checked), and no French reviewer is recruited — so nothing
is blocked on this today.

## 7. Verification

| Check | Result |
|---|---|
| `tracksForNativeLang` — fr / en / es / pt | **12** (exact set) / 13 / 12 / 12 |
| French-reachable tracks at full depth (floors vocab ≥100, gram ≥200, trad ≥80, fono ≥50) | 12/12, with the `enForIt` stub failing as the negative control |
| every changelog bullet carries `fr` | 189/189 |
| the carve-out present in all four languages; roadmap no longer says "the whole interface" | pass |
| chips: `tagFor()` additive-only across every prompt | 4/4 files |
| ESLint | 0 errors (67 known React-Compiler warnings, #98) |
| `npm run build` on Next 16 / React 19 / Node 24 | green |
| `npm run changelog:check` | 9 fragments, all v3.3.0 |

**All 17 flip checks and all 7 chip checks mutation-tested; each goes red on its own check.**

### The NBSP trap, fourth occurrence — and this one nearly shipped

`const NB = ' '` in the chip injector was **U+0020, not U+00A0**, so every French chip that needed
a non-breaking space silently got an ordinary one — 2,163 strings written through a transform that
looked correct. The residual check caught it only because a *different* check (plain space before
French punctuation) fired on five strings and the numbers didn't add up; the guillemet check, which
also compared against the bad constant, passed happily.

**Both constants now assert their own codepoint at load:**
`if (NB.codePointAt(0) !== 0xA0) throw`. Do this in every future pass — the character is invisible,
so no amount of reading catches it, and it degrades differently in different files (Phase 4's
injector kept a real NBSP while Phase 6's didn't).

## What's left after v3.3.0

- **The completeness release** — the ~83 user-facing strings localized into no source language, in
  es + pt + fr. The Help/About carve-out names exactly what it has to close.
- **The L1 anchor pass is owed to Portuguese**, and to v3.4 Italian onward.
- **`norm()` in `regionalVariants.js` strips a leading article**, blocking `de rien` and anything
  shaped like it.
- **`RegionalVariantCard`'s `isRef` branches are dead code.**
- **`CATEGORY_NAMES.fvocab.fr` is "Mots courants" while the French Help prose calls it "Banque de
  mots"** — the same feature under two names. Found by the changelog translators.
- **Fono `sound` respellings are English-oriented for every source.**

---

# Phase 6 addendum — pre-release adversarial audit — 2026-08-02

Run at Sean's request before the deploy: not a re-run of the phase checks, but a hunt for what
those checks would miss **by construction**. Two real defects, both introduced by this milestone,
both fixed before the cut.

## Fixed

**1. `bonnet`/`tuque` — a homograph collision arriving from the TARGET side.** The Phase 5 record
`winter hat` keys on the France term `bonnet`, which is also a correct **English** answer in
`en-gb-for-fr` vocab-115 (« En anglais britannique, « le capot » d'une voiture se dit… »). A Québec
learner answering that car question correctly got a card teaching them `tuque`.

Same class as `bas` (socks / *low*), but `indexRegionalTerms: false` cannot catch it: that flag
stops the *Québec* word being a key, and here the collision is on the *France* word against a
*target-language* answer. Swept all 15,102 correct answers across the 12 French tracks — this was
the only one, and it was the record's **only** fire. **Record dropped, 80 → 79.**

**New standing guard** (`_audit/collide.mjs`): every regional-card fire inside a source-specific
English-target track, frozen at a 13-entry baseline across es/pt/fr. Those tracks are the only
place a correct answer can be a target-language word, so the set is small enough to eyeball and any
new entry is a prompt to check by hand. All 13 current entries verified to be source-language
answers. Mutation-tested: restoring the dropped record takes it to 14 and names `bonnet` as new.

**2. The expanded regional panel filed Belgian and Swiss terms under "🇨🇦 Québec".**
`app/play/[trackId]/page.js` hardcoded a single group header from `regionalGroupLabel`. French is
the **first source language whose regional set spans more than one region** — es was LatAm-only, pt
BR-only — and all 7 multi-variant French records mix Québec with BE/CH, so a Belgian expanding
*cell phone* saw their own `GSM` under a Canadian flag. The card's top line was always right; only
the expansion was wrong.

Now renders **one row per region**, grouped by each entry's own `label`, with a per-region flag from
a new optional `regionFlags` field on the language block. es/pt have no `regionFlags` and fall back
to the existing single flag, so they render exactly as before. UI-previewed across Québec, Belgium
and Switzerland before the write.

**3. Three comments asserted the opposite of reality.** `enUsForFr.js`, `enGbForFr.js` and
`l10n/index.js` all still said French was unregistered and the flip unapplied. They were written as
deliberate safety gates, so an inverted one is worse than merely stale. Corrected.

**4. The v3.3.0 changelog bullet overclaimed.** It listed "the explanations" as following into
French; only the **phonetics** explanations do — bank explanations still fall back to English, as
they do for Portuguese today (10.3% coverage, `gameEngine.js:75` reads `explain` from the base bank,
which the l10n side tables do not overlay). Tightened to "pronunciation explanations" in all four
languages. Shipping an overclaim in the release note days after an honesty pass on Help/About would
have been a poor look.

## Confirmed clean

`git add -A` in `scripts/deploy.js` would sweep untracked scratch into the commit — **checked and
not a risk here**: the audit harnesses live only in the cloud sandbox, and Sean's `git status` shows
no untracked `_*` directories. Worth remembering for any future session that works directly on the
Windows tree.

Also verified with nothing found: no crash path from missing French copy (every lang-indexed lookup
in `app/` and `lib/` has an `|| .en` fallback, checked by AST sweep, including the nine
`SUPPORTED_UI_LANGS` gates beyond Help/About); no persisted state keyed on the version string
(`WELCOME_VERSION` and `GUIDE_VERSION` both still `1.0`, so no popup or tour re-fires — only the
What's-New dot, which is meant to); no `INTERNAL_CHANGELOG` entry without a `CHANGELOG` counterpart
(the #91 trap); chip injection structurally clean (0 stray keys, 0 `grammar` objects missing
`tense`/`why` — either would throw at `page.js:804`); `promptNative` answer-leakage lower for fr
(191) than for pt (363) or es (509).

## Recorded, not fixed

| Finding | Why it can wait |
|---|---|
| **6 items with two identical answer options** in `frCaForEn.pt.js` (×3), `jaForEn.pt.js`, `koForEn.pt.js`, `jaForEn.es.js` — picking the second is scored wrong | Pre-existing v3.1/v3.2, not French. The 10 fr side tables are clean: 0 duplicates, 0 option-count mismatches, 0 out-of-range `correctIdx`, 0 orphan ids. Its own Z. |
| **`lib/NavDrawer.js:16` reads `profile?.native_lang`** — the §4a trap shape | Dead in practice: `app/page.js:113` threads `nativeLang` from `session.user.user_metadata`. One-line cleanup, no user impact. |
| **The French card is invisible unless `native_country ∈ {CA, BE, CH}`** | By design — all 79 records have `default === reference`, so France (and an unset country) suppress. A behavioural divergence from es/pt worth knowing, not a defect. |
| **`e2e/authenticated-flow.spec.js:194`** asserts `/explanations\|explicaciones\|explicações/i` — no French | Passes today; the test account is English-native. The spec's own comment predicted this. |
| **`app/layout.js:38` hardcodes `<html lang="en">`** while French copy is now auto-served to `fr-*` browsers | Pre-existing for es and pt. Accessibility nit, own Z. |
| **No question audio for `en-us-for-fr` / `en-gb-for-fr`** — absent from `AUDIO_TRACKS` in `scripts/tts-on-deploy.mjs` | Degrades cleanly; `AudioButton` renders nothing on a manifest miss. |
| **The guided tour is the first screen a French account sees, and it is English** | Known, decided, and now disclosed in Help — but it is the first impression, so worth prioritising inside the completeness release. |

## Re-verified after the fixes

All 17 flip checks · all 7 chip checks · the regional-variant suite · the full audit ·
`npm run build` green · ESLint 0 errors. fr records 79, index keys 79, `bonnet` no longer a key.

---

# Pre-existing fixes, cleared before the cut — 2026-08-02

Sean: *"fix the pre-existing items so they don't compound later."* Nine fixes, none of them French,
all of them things the audit surfaced and the milestone would otherwise have carried forward.

## Content — 6 items shipped two identical answer buttons

Every one is a **translation collapse**: two distinct English options rendered to the same word in
the source language, so the learner saw the same string twice and picking the second was scored
wrong. All six are in localized side tables; the base English is correct in every case.

| Item | English options | Was | Now |
|---|---|---|---|
| `ja-for-en fvocab-6` **es** | tomorrow / **morning** / midday / yesterday | `mañana` ×2 | `la mañana` for *morning* |
| `ja-for-en fvocab-6` **pt** | tomorrow / **morning** / midday / **yesterday** | `amanhã` ×2, and *yesterday* rendered `avião` (**airplane**) | `manhã`, `ontem` |
| `fr-ca-for-en vocab-20` **pt** | lock / **block** / cross out / slam | `trancar a porta` ×2 | `bloquear a porta` |
| `fr-ca-for-en vocab-60` **pt** | boots / low shoes / **tights** / socks | `meias` ×2 | `meia-calça` for *tights* |
| `fr-ca-for-en fvocab-172` **pt** | a lot / **very** / never / tomorrow | `muito` ×2 | `bem` for *very* |
| `ko-for-en fvocab-196` **pt** | **song** / music / cellphone / side dish | `música` ×2 | `canção` for *song* |

**Two `distractorNotes` keys had to move with them** (`vocab-20`, `vocab-60`). The note's outer key
must equal the option string character for character or it silently stops rendering — the standing
trap — and in both cases the note was keyed to the *collided* text, so fixing the option without
rekeying would have orphaned it.

`bem` for Portuguese *very* is the one judgement call: `muito` genuinely covers both senses, so
there is no clean one-word split the way Spanish has `mucho`/`muy`. Flagged for the pt #41 lane.

**New standing guard:** a sweep asserting every `distractorNotes` key still matches an option string
in its own item — **4,302 keys checked, 0 orphaned** — and a duplicate-option sweep across all four
source languages, now **0**.

## Code

| Fix | Why it mattered |
|---|---|
| **#95 — `/play/<unknown-track>` returned 500.** Four top-level `track.*` reads and one loader effect ran above the `if (!track)` guard; hooks can't early-return, so they are optional-chained and the effect bails. | A real 500 on a malformed URL, pre-existing and confirmed identical on a Next 14 baseline. |
| **`<html lang>` stayed `en`.** `useUiLang` now syncs `document.documentElement.lang` on resolve. | The flip auto-selects French for `fr-*` browsers, so screen readers and Chrome's translate prompt were being told English on a French page. Pre-existing for es/pt. |
| **`lib/NavDrawer.js` read `profile?.native_lang`.** Removed; the session-resolved `nativeLang` prop is now the only source, with the §4a reasoning in a comment. | The exact shape of the v3.1.1 drawer bug. Dead in practice, but it is the line the offering-flip checklist tells you to grep for. |
| **`e2e/authenticated-flow.spec.js:194`** asserted `/explanations\|explicaciones\|explicações/i`. Added `explications`. | The spec's own comment predicted it would break the moment the suite ran under a different native language. |
| **`extract.mjs` hardcoded `(respuesta incorrecta)`** into every lane's packet. Now a per-lane label with an English fallback. | Reviewer-facing copy in the wrong language: invisible while Spanish was the only live lane, wrong for every lane after — 665 rows for es, inert for fr until content lands. |

## Two audit checks were themselves wrong

Both reported findings that were not real, which is how a check earns being ignored:

- the `profile.native_lang` sweep matched **comments and changelog prose** — it now strips comments
  and skips `lib/version.js`, which is changelog data rather than a surface;
- the track-icon probe called an export that does not exist (`trackIcons.js` exports a
  `<TrackIcon>` component, not a lookup), so it reported "no icon" for all 12 tracks while every one
  of them renders. It now renders the component and treats a blank as a **blocker**.

**The audit is now 0 blockers, 1 informational note.**

## Not fixed, deliberately

- **`norm()` in `regionalVariants.js` strips a leading article.** Changing normalisation would move
  es/pt card firing, which is not a change to make at a release gate. Still blocks `de rien`.
- **`RegionalVariantCard`'s `isRef` branches are dead code.** Whether a France-based learner should
  see the card at all is a product call, not a cleanup.
- **`CATEGORY_NAMES.fvocab` short chips diverge from the Help prose in every language**
  (`Palabras`/`Palavras`/`Mots courants` vs *Word Bank*). Checked: en is the only one that matches,
  and the pattern is consistent across es/pt/fr — a naming choice, not a French defect.
- **`es-latam-interface-review-v3.2.0.xlsx` is stale** (as it was before this session) — it is on the
  retire list, superseded whenever the es lane is next regenerated.

## Re-verified after all nine

All 17 flip checks · 7 chip checks · the regional-variant suite · the collision baseline (13/13) ·
duplicate options 0 · orphaned distractorNotes 0 · the full audit at **0 blockers** ·
`npm run build` green · ESLint 0 errors · fr-fr interface packet regenerated (1,033 rows) and all
three fr-fr packets fresh.

---

# Post-deploy catch — the NBSP trap, FIFTH occurrence — 2026-08-02

Caught by re-cloning `origin/dev` after the deploy and re-running the audit against **exactly what
shipped**, rather than against the sandbox the files were built in.

**The bullet announcing the duplicate-answer fix had plain spaces where French needs U+00A0.**
`Corrigé : six questions…` with U+0020 before the colon, and every `« … »` in it likewise. Written
minutes after documenting the trap four times over, in the copy announcing that other bugs were
fixed.

**Two process failures, and the second is the more important one:**

1. The `NB` constant in the fix script was a **pasted character** rather than the `' '` escape.
   Same root cause as Phase 6's chip injector. The rule is not "be careful" — it is **never type the
   character, always write the escape, and assert `ord(NB) == 0xA0` before using it.** That assert is
   now in the script.
2. **The French typography scan was reporting the defect and the audit still said "0 blockers."**
   It was an `ok.push()` printing a count — `{"marker":0,"plainSpaceBeforePunct":1,"guillemetNoNbsp":1}`
   — sitting in the PASSED section. A check that reports a non-zero defect count under a green
   headline is worse than no check: it trains you to skim past it. **Promoted to a BLOCKER.**

**Also learned:** verifying in the sandbox where the work was done is not the same as verifying what
shipped. `_chips/verify.mjs` restores the pre-injection originals in its `finally` block, so the
sandbox tree no longer matched what was written to the repo. **Re-clone `origin/dev` and run the
audit there before the `dev → main` cut** — that is what found this.

Fixed, packet regenerated (1,034 rows), audit back to 0 blockers with the typography check now able
to fail. **`lib/version.js` and the three interface-packet files need one more `npm run deploy dev`
before the release.**

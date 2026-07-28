# es-latam — review ledger

**Lane:** Latin American Spanish. Source-language code `es`; owns the shared `es`
localization (there is only one `es` block in `lib/playStrings.js`, and it is written
LatAm). Counterpart lane: [`es-spain`](../es-spain/STATUS.md).

**Reviewer:** confirmed available, not yet engaged. No packet has been sent.

## Packets

| Scope | Rows | Built | Fresh? | Sent | Returned | Applied |
|---|---:|---|---|---|---|---|
| `interface` — how the app reads | 1,207 | v3.2.0 | ⚠️ **STALE** | ⬜ | ⬜ | ⬜ |
| `taught` — the Spanish it teaches | 1,353 | v3.2.0 | ✅ | ⬜ | ⬜ | ⬜ |
| `explanation` — Spanish explaining other languages | 4,872 | v3.2.0 | ✅ | ⬜ | ⬜ | ⬜ |

> **⚠️ Regenerate `interface` before sending it.** It was built 2026-07-28 from a snapshot
> taken at 14:41Z the previous day; the v3.3 work-beat then rewrote its sources mid-session:
> `lib/playStrings.js` 64,523 → 83,237 bytes, `lib/helpAboutContent.js` 76,524 → 104,449,
> `lib/skillLevels.js` 5,604 → 6,204, `lib/trackSublabels.js` 3,305 → 3,845. Roughly 47 KB of
> new user-facing copy is missing from that packet. `taught` and `explanation` read
> `data/tracks/` and `data/vocab/`, which v3.3 has not touched, so they are unaffected.
>
> This is why `check_freshness.py` now exists — a packet is a snapshot of a moving `dev`, and
> the version number in its filename cannot tell you whether a release beat landed underneath
> it. Regenerate after v3.3 settles, then run the check before sending:
>
> ```
> node docs/language-review/pipeline/extract.mjs --lane es-latam --scope interface
> python docs/language-review/pipeline/build_workbook.py --lane es-latam --scope interface
> python docs/language-review/pipeline/check_freshness.py --lane es-latam
> ```

**Send order: `interface` first.** It is the smallest, it carries the decisions sheet whose
answers pre-resolve rows in the other two, and the packet format has never been used by a
real reviewer — a format problem caught here costs one correction instead of three. This is
the calibration sample the handoff strategy §4 has been owing since Spanish shipped.

## What each packet covers

**interface** (1,207) — `playStrings` (403) · Help/About prose (110) · component string maps
(58) · security questions (10) · regional variants (325, of which 71 are peninsular terms
carried as advisory context) · card config (117) · changelog (184).

**taught** (1,353) — `data/tracks/esForEn.js`: 665 questions + 79 pronunciation items ·
`data/vocab/esLatAmWords.js`: 609 Word Bank entries. One row per *question*, not per string:
the reviewer's job is "is the keyed answer right and is every distractor genuinely wrong",
which can only be judged with the question whole.

**explanation** (4,872) — `enUsForEs.js` + `enGbForEs.js`: 1,548 questions + 156 pronunciation
items · Spanish glosses for the German, Japanese, Korean, Russian and Chinese Word Banks:
2,768 entries · a 400-row stratified sample of the `l10n/*.es.js` overlays (2.9% of ~13,974).

## Known defects — found during extraction, not by a reviewer

These are ours to fix; they are named on the packets' decision sheets so the reviewer does
not spend attention re-reporting them.

- **402 of 2,660 distractor notes in `data/tracks/esForEn.js` have `es` byte-identical to
  `en`** — untranslated. A Spanish-native learner at Advanced level sees English.
- **Circular Spanish explanations** in the same file, from translating the English gloss
  rather than writing a Spanish one: `"'La puerta' es puerta, 'el techo' es techo"`. Same
  generation pass, same fix.
- Gendered / slash forms still live in `dev`: `homeGreeting` = `"¡Bienvenido/a"`,
  `securityQuestions.childhood_street` = `"…de niño"`, `setRecNoteNone` = `"…tú mismo"`,
  `skillLevels.LEVEL_DESCRIPTIONS.expert` = `"Te sientes cómodo"`, `notSureTakeQuiz` =
  `"¿No estás seguro?"`. These need a house decision, not a reviewer verdict — DEC-02 asks
  for the preferred neutral form once.

## Not localized at all

Out of scope for review because there is nothing to review yet, but a Spanish user meets
them in English: `app/terms/page.js`, `app/privacy/page.js`, `lib/emailTemplate.js`.

## Submissions

_None yet._ When one arrives:

| File | Reviewer | Scope | Received | Changeset | Applied |
|---|---|---|---|---|---|

Name returns `YYYY-MM-DD-<reviewer>-<scope>-v<version>.xlsx` — `ingest.py` reads the scope
back out of the filename.

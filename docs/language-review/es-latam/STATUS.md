# es-latam — review ledger

**Lane:** Latin American Spanish. Source-language code `es`; owns the shared `es`
localization (there is only one `es` block in `lib/playStrings.js`, and it is written
LatAm). Counterpart lane: [`es-spain`](../es-spain/STATUS.md).

**Reviewer:** confirmed available, not yet engaged. No packet has been sent.

## Packets

| Scope | Rows | Built from | Verified |
|---|---:|---|---|
| `interface` — how the app reads | 1,208 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh |
| `taught` — the Spanish it teaches | 1,353 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh |
| `explanation` — Spanish explaining other languages | 4,872 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh |

None sent yet. **Send `interface` first** — smallest, it carries the decisions sheet whose
answers pre-resolve rows in the other two, and the packet format has never been used by a real
reviewer. A format problem caught there costs one correction instead of three. This is the
calibration sample the handoff strategy §4 has been owing since Spanish shipped.

Run both checks before sending:

```
python docs/language-review/pipeline/check_freshness.py --lane es-latam
python docs/language-review/pipeline/check_example.py
```

### On the v3.3 rebuild (2026-07-28)

The packets were regenerated after the v3.3 beat landed. Worth recording what that beat did
and did not do, because the first read of it was wrong:

- **v3.3 added the French column**, not new Spanish. `lib/playStrings.js` grew 64,523 → 82,530
  bytes and `lib/helpAboutContent.js` 76,524 → 103,448 — but **zero Spanish values changed and
  no keys were added or removed**. The regenerated `.xlsx` cell content is byte-identical to
  the pre-v3.3 build.
- **That is why the freshness check is content-based, not source-based.** A check keyed on
  source size, mtime or file hash calls a French build a stale Spanish packet. A check that
  fires on non-events gets ignored, and an ignored check is worse than none. Each packet now
  carries a `contentHash` over the rows it contains; `check_freshness.py` re-extracts and
  compares that.
- **One string really was missing**, and the drift sweep found it once it could see the whole
  repo: `lib/GuideOverlay.js` → `OVERLAY_DONE` = `"¡Vamos!"`. Now extracted; `interface` went
  1,207 → 1,208 rows.
- **The earlier drift sweep could not be trusted.** It walks `lib/` and `app/` on disk, and it
  had been running against a partial copy of the repo — so files it never saw could not be
  reported. Regenerating from a full clone of `dev` is what surfaced `GuideOverlay.js`. Always
  build packets from a complete checkout.

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

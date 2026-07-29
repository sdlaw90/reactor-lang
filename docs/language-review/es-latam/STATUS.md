# es-latam — review ledger

**Lane:** Latin American Spanish. Source-language code `es`; owns the shared `es`
localization (there is only one `es` block in `lib/playStrings.js`, and it is written
LatAm). Counterpart lane: [`es-spain`](../es-spain/STATUS.md).

**Reviewer:** engaged. All three packets sent 2026-07-29 — the first real use of this format by a native reviewer.

## Packets

| Scope | Rows | Built from | Verified |
|---|---:|---|---|
| `interface` — how the app reads | 1,208 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh · **corrected + resent 2026-07-29** |
| `taught` — the Spanish it teaches | 1,353 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh |
| `explanation` — Spanish explaining other languages | 4,872 | `dev` @ 01e90e6 (v3.2.0) | ✅ fresh |

All three sent 2026-07-29. The covering email asks the reviewer to complete `interface`
and return it **before opening the other two** — it carries the decisions sheet whose answers
pre-resolve rows in the other two, and the format had never been used by a real reviewer. This
is the calibration sample the handoff strategy §4 has been owing since Spanish shipped, and the
sequencing preserves most of its value even though all three files went out together.

Render the covering email rather than writing one:

```
node docs/language-review/pipeline/render_email.mjs --lane es-latam --name <reviewer>
```

Its row counts come from each packet's `sources.json`, so they cannot drift from the workbooks.
It deliberately does not restate anything the LÉEME sheet already says.

Before sending, run:

```
node docs/language-review/pipeline/check_freshness.mjs --lane es-latam
```

Node only, no dependencies — it has to work on send day regardless of toolchain.
`check_example.py` is the other check, but it needs Python + `openpyxl` and only matters when
`ingest.py` or a sheet layout changes.

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

### The stale tab-reference correction (2026-07-29)

The `interface` packet went out with instructions pointing at a tab it does not contain, and
had to be corrected and resent. Three symptoms, one cause:

- The LÉEME sheet read *"tab 8-Muestra-contenido is a SAMPLE (about 40 questions per language,
  of about **0** in total)"*. There is no sample tab in the interface packet, and the count
  rendered as literal zero.
- `DEC-16` asked for a verdict on that same absent tab. The 400-of-13,974 sample it describes
  is real, but it lives in the `explanation` packet as `4-Muestra-explicaciones`.
- `DEC-15` cited "tab 9". The changelog tab in this scope is 8.

**Cause: scope tab-renumbering that the copy never followed.** The base `sheets` map numbers
the sample tab 8 and the changelog 9. The `interface` scope overrides `changelog` to 8 and
drops the sample entirely — but `readme` and `decisions` had been written against the base
numbering. `{corpus}` compounded it by defaulting to `0` when the extract carried no
`corpusSize`, so a missing number rendered as a confident wrong one.

**Fixed in the generator, not just the copy.** `build_workbook.py` now fails the build when a
scope's `readme`, `decisions` or `example` names a tab that scope does not build, and `{corpus}`
hard-stops instead of rendering `0`. Copy that must name a tab should use `{sheet:KEY}`, which
resolves to whatever the scope numbered it. The three es-latam strings were rewritten and every
tab reference in the interface scope tokenized.

**Only `interface` was affected** — `taught` and `explanation` pass the new lint unchanged, and
`fr-fr` had already corrected all three by hand, which is what identified the fix.

**The reviewer lost no work.** The rebuilt packet's `contentHash` is `568bee502067…`, identical
to the one already sent, and a cell-by-cell diff of every content sheet showed zero differences.
Only the LÉEME sheet and decision rows 16–17 changed.

**Two things this near-miss confirmed about the checks:**

- `data/tracks/esForEn.js` has grown 2,658 bytes since the `taught` packet was built, but that
  packet's `contentHash` is unchanged — nothing reviewable moved. Second time the byte-level
  signal would have sent someone chasing a non-problem, and the reason the freshness check is
  content-based.
- A first `explanation` extract run without the base Word Bank files (`data/vocab/deWords.js`
  and its siblings) still produced 4,872 rows and a plausible packet — with 15 ENOENT warnings
  and a *different* `contentHash`. Unread, it would have shipped with an empty reference column,
  the column a reviewer needs to judge a Japanese or Russian gloss at all. **Incomplete
  checkouts fail quietly and convincingly. Read the warning count.**

## What each packet covers

**interface** (1,208) — `playStrings` (403) · Help/About prose (110) · component string maps
(59) · security questions (10) · regional variants (325, of which 71 are peninsular terms
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

# language-review/pipeline

Generates a reviewer packet from the repo, and turns a returned packet back into a
changeset. Reusable across every lane — standing up a new language is a config entry and a
translated copy file, not a new script.

## Requirements

- Node (already required to build the app) — no extra npm dependencies. `extract.mjs`
  deliberately avoids a parser dependency; see the note in its header.
- Python with `openpyxl` (`pip install openpyxl`) for the workbook steps.
- LibreOffice (`soffice`), optional, to cache the summary formulas after generating.

## Scopes

Every lane produces up to three packets, because a reviewer brings different attention to
each and the volumes differ by an order of magnitude:

| `--scope` | Reads | The reviewer's question |
|---|---|---|
| `interface` | `playStrings`, `helpAboutContent`, component maps, `securityQuestions`, `regionalVariants`, `version.js` | Does the app read naturally? |
| `taught` | `data/tracks/<lang>ForEn.js`, `data/vocab/<lang>Words.js` | Is the language it teaches correct, and is every distractor genuinely wrong? |
| `explanation` | `data/tracks/enUsFor<Lang>.js`, `data/vocab/*.<lang>.js`, `data/tracks/l10n/*.<lang>.js` | Is this language's explanation of another language accurate? |

`CONTENT` in `extract.mjs` maps lane → scope → which track and vocab files belong to it.

## Generate a packet

```bash
node docs/language-review/pipeline/extract.mjs      --lane es-latam --scope interface
python docs/language-review/pipeline/build_workbook.py --lane es-latam --scope interface
soffice --headless --convert-to xlsx \
  --outdir docs/language-review/es-latam/template \
  docs/language-review/es-latam/template/es-latam-interface-review-v3.2.0.xlsx
```

`extract.mjs` writes `pipeline/.cache/<lane>-<scope>-review-data.json` (gitignored — it is
reproducible from the repo at any time). `build_workbook.py` turns that into the `.xlsx`
plus the `.md` mirror in the lane's `template/`.

The LibreOffice step is not cosmetic: openpyxl writes formulas with no cached values, so
until the file is recalculated the summary tallies read as blank to anything that isn't
Excel. Skip it and a reviewer opening the file in Google Sheets or Numbers sees an empty
summary.

## Ingest a return

```bash
python docs/language-review/pipeline/ingest.py \
  docs/language-review/es-latam/submitted/2026-08-04-maria-interface-v3.2.0.xlsx
```

The scope is read out of the filename, so keep it there (`--scope` overrides).

Writes `changesets/<same-stem>.md`: the decision answers first, then corrections grouped by
the source file that has to change, then open questions, then advisory rows belonging to
the counterpart lane. The submission itself is never touched.

## Adding a lane

1. Add it to `LANES` in `extract.mjs` — source language, whether it owns that language's
   localization, and which side of the regional-variant card it's the authority for.
2. Add its content files to `CONTENT` — which tracks and word lists belong to `taught` and
   which to `explanation`.
3. Write `i18n/<lane>.json`, the reviewer-facing copy: shared headers and verdict words, then
   a `scopes` block per scope carrying its instructions sheet, decisions list and worked
   example. Copy `i18n/es-latam.json` for the shape.
4. Run the commands above, once per scope. `build_workbook.py` **hard-stops** if the i18n file is
   missing rather than falling back to English — handing a native reviewer instructions in
   a language you're hiring them for fluency in is worse than not sending the packet.

## Freshness check — run before sending anything

```bash
python docs/language-review/pipeline/check_freshness.py
```

Every packet ships a `<stem>.sources.json` fingerprinting the repo files it was built from.
This compares that against the repo now. A packet is a snapshot of a moving `dev`, and the
version in its filename is not enough — a whole release beat can land inside one version, and
a packet built before it silently omits every string that beat added.

That is the most expensive failure this lane has, because a reviewer who works through a
stale packet has spent their whole pass on the wrong file, and reviewer attention is the
scarce resource. It has already happened once: the first `es-latam` `interface` packet was
built minutes before the v3.3 beat rewrote `playStrings.js` and `helpAboutContent.js`
underneath it.

## Regression check

`example/` holds a fabricated but complete filled-in submission and the changeset it produces.
`check_example.py` re-runs `ingest.py` over it and diffs, so a change to how a return is read
or rendered announces itself:

```bash
python docs/language-review/pipeline/check_example.py
```

It guards the quiet failure — a moved column or an unmatched verdict word making a reviewer's
corrections silently vanish. See `example/README.md` before regenerating the fixture.

## Drift protection

After extracting the surfaces it knows, `extract.mjs` sweeps `app/` and `lib/` for any
*other* file containing a bilingual `{ en: …, <lang>: … }` map and warns about ones missing
from its `KNOWN` list. A newly localized component therefore announces itself instead of
being silently left out of the next packet. When that warning fires, either wire the file
into a section of the extractor or add it to `KNOWN` with a reason.

`lib/frequencyVocab.js` currently trips it. It holds word-frequency data rather than
user-facing copy — confirm and add it to `KNOWN` if that stays true.

## What the extractor reads

| Source | Becomes |
|---|---|
| `lib/playStrings.js` (`STRINGS`, `CATEGORY_NAMES`) | the interface sheet |
| `lib/helpAboutContent.js` | the Help / About prose sheet |
| `lib/guideSteps.js`, `languageNames.js`, `skillLevels.js`, `LangSwitcher.js`, `trackSublabels.js` | the other-strings sheet |
| `lib/securityQuestions.js` (`label_<lang>`) | the security-questions sheet |
| `data/tracks/l10n/regionalVariants.js` | the variants sheet + the card-config sheet |
| `lib/version.js` (`CHANGELOG`) | the release-notes sheet |
| `data/tracks/l10n/*.<lang>.js` | a stratified sample sheet (`explanation`) |
| `data/tracks/<lang>ForEn.js` `BANK` / `FONO_BANK` | the questions + pronunciation sheets (`taught`) |
| `data/vocab/<lang>Words.js` | the Word Bank sheet (`taught`) |
| `data/vocab/<x>Words.<lang>.js` | the glossary sheet (`explanation`), paired positionally with `<x>Words.js` so the reviewer sees the source word |

Several of those tables are module-private and reached through accessor functions. Rather
than edit app source to suit a docs tool, `extract.mjs` lifts the literals out of the file
text and evaluates them — they are pure data, so this is exact, and it throws loudly rather
than returning a short table.

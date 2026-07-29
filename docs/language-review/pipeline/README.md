# language-review/pipeline

Generates a reviewer packet from the repo, and turns a returned packet back into a
changeset. Reusable across every lane — standing up a new language is a config entry and a
translated copy file, not a new script.

## Requirements — what needs what

| Script | Needs | Who runs it |
|---|---|---|
| `extract.mjs` | Node only, zero npm deps | whoever builds a packet |
| **`check_freshness.mjs`** | **Node only, zero deps** | **whoever SENDS a packet — run it every time** |
| `build_workbook.py` | Python 3 + `openpyxl` | whoever builds a packet |
| `ingest.py` | Python 3 + `openpyxl` | whoever processes a return |
| `check_example.py` | Python 3 + `openpyxl` | whoever edits `ingest.py` or a sheet layout |
| **`render_email.mjs`** | **Node only, zero deps** | **whoever SENDS a packet — the covering email** |

Anything that reads or writes a workbook needs Python and `openpyxl` (`pip install openpyxl`).
Everything on the send path deliberately does not — the freshness check is the one thing that
has to work at the moment a packet goes out, and it must not depend on a toolchain the sender
may not have.

LibreOffice (`soffice`) is optional, to cache the summary formulas after generating.

Today the Python steps run wherever the packets are built rather than on the maintainer's
machine. If you want to build or ingest locally, install Python 3 and `openpyxl` first.

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
5. Add a `dispatchEmail` block to `i18n/<lane>.json` — the covering email that goes out *with*
   the packets, in the reviewer's language. `render_email.mjs` **hard-stops** without it, for
   the same reason step 4 does. A lane can carry `dispatchEmail` before it has any `scopes`
   (see `i18n/es-spain.json`): the email is useful to draft early, and the packet build will
   keep hard-stopping until the packet copy is written.

## The covering email — render it, don't retype it

```bash
node docs/language-review/pipeline/render_email.mjs --lane es-latam --name Ana --out email.md
```

The packets explain themselves: every workbook opens on an instructions sheet covering the
variety, the register, the verdict columns and how to return the file. The covering email
exists only for what a workbook cannot know about itself — how the three relate, which one to
do first, and roughly how long each takes. Anything the instructions sheet already says is
left out on purpose: restating it in slightly different words is how an email and a workbook
come to contradict each other, and the reviewer then has to guess which one is authoritative.

It reads `dispatchEmail` from `i18n/<lane>.json`, so the email is reviewer-facing copy sitting
beside every other reviewer-facing word rather than in a document that drifts. Row counts come
from each packet's `sources.json`, never typed by hand — a hand-typed count goes stale the
moment a packet is regenerated, and the reviewer plans against a number that is not what they
received. A scope with no built packet renders as a placeholder and is reported on stderr, so
an unbuilt scope is visible rather than quietly missing.

Warnings go to stderr, so `--out` (or a plain redirect) gives a clean email either way.

## Freshness check — run before sending anything

```bash
node docs/language-review/pipeline/check_freshness.mjs --lane es-latam
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

(This one needs Python + `openpyxl`, because it has to read a workbook. It only matters when
someone edits `ingest.py` or a sheet layout — pipeline work, not send-day work.)

It guards the quiet failure — a moved column or an unmatched verdict word making a reviewer's
corrections silently vanish. See `example/README.md` before regenerating the fixture.

## Drift protection

**Stale tab references.** Scopes renumber their tabs — `interface` drops the sample sheet and
moves the changelog from 9 to 8 — but the reviewer copy in `i18n/<lane>.json` is written once
and drifts behind. `build_workbook.py` fails the build if a scope's `readme`, `decisions` or
`example` names a tab that scope does not build. Prefer `{sheet:KEY}` in copy that has to name
a tab: it resolves to whatever the scope numbered it, so the sentence follows the layout.

This is not hypothetical. The shipped `es-latam` `interface` packet told reviewers that
"tab 8-Muestra-contenido is a SAMPLE (about 40 questions per language, of about **0** in
total)" — a tab that packet has never contained, with a corpus count that resolved to zero
because `{corpus}` silently defaulted to `0` when the extract carried no `corpusSize`. A second
decision row asked for a verdict on that same absent tab, and a third pointed at "tab 9" when
the tab in question is 8. `{corpus}` now hard-stops instead of rendering `0`.


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

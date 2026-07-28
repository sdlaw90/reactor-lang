# pipeline/example — a worked submission

**Everything in this folder is fabricated.** "María Rodríguez" is not a real reviewer and her
answers are invented. It lives here, and deliberately *not* in `es-latam/submitted/`, because
that folder holds real reviewer testimony and must never contain a made-up file.

## What it's for

**Documentation.** It shows what a returned packet actually looks like when filled in —
which cells carry what, how a reviewer cross-references a decision from an individual row,
what a partial return looks like (she left the changelog and Help/About sheets blank, which
is normal and fine).

**A regression check.** `check_example.py` re-runs `ingest.py` over the fixture and diffs the
result against the committed changeset. If reading or rendering a submission ever changes, it
says so. The failure mode this guards against is the quiet one: a moved column or an unmatched
verdict word making a reviewer's corrections silently disappear.

```bash
python docs/language-review/pipeline/check_example.py
```

## The files

| File | What it is |
|---|---|
| `2026-08-14-maria-r-interface-v3.2.0.xlsx` | The `es-latam` / `interface` packet, filled in |
| `2026-08-14-maria-r-interface-v3.2.0.changeset.md` | What `ingest.py` produces from it |

## What the fixture deliberately exercises

- **A partial return** — ~450 of 1,207 rows verdicted. Two sheets untouched. A reviewer sending
  back what they got through is the expected case, not an error.
- **A systematic answer plus its individual rows** — DEC-05 answers "«por curso»", and
  `setGpTogCaudio` is separately corrected. Both appear, the decision first, because applying
  the single row without the rule leaves every other occurrence wrong.
- **Cross-references between sheets** — "Ver DEC-11" written in a variant note survives into
  the changeset, so the reasoning stays attached to the correction.
- **A multi-field correction** — a variant row with both a corrected term and a corrected
  country list, which renders labelled rather than as a bare `banano | CO`.
- **An advisory row** — a DUDA on a peninsular reference term, routed to its own section and
  explicitly *not* treated as sign-off. It belongs in the `es-spain` lane.
- **Grouping by target file** — corrections come out under `lib/playStrings.js`,
  `lib/securityQuestions.js`, `lib/skillLevels.js`, not under the sheet the reviewer worked in.

## Regenerating it

Only if you have deliberately changed how changesets render:

```bash
python docs/language-review/pipeline/ingest.py \
    docs/language-review/pipeline/example/2026-08-14-maria-r-interface-v3.2.0.xlsx \
    --lane es-latam --scope interface \
    --out docs/language-review/pipeline/example/2026-08-14-maria-r-interface-v3.2.0.changeset.md
```

Read the diff before committing it. A fixture updated without being read is a test that
asserts whatever the code currently does.

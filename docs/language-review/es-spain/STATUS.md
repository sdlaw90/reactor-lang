# es-spain — review ledger

**Lane:** Peninsular Spanish. Source-language code `es`; does **not** own the `es`
localization — that is written LatAm and belongs to [`es-latam`](../es-latam/STATUS.md).

**Reviewer: none. This lane is unstaffed, and that is the point of this file existing.**

## Why the lane exists before the reviewer does

Two surfaces make claims about peninsular Spanish that nobody from Spain has verified:

1. **The reference side of the regional-variant card.** Every one of the 71 concepts in
   `data/tracks/l10n/regionalVariants.js` asserts a Spain term — *coche*, *ordenador*,
   *pajita*, *bombilla*, *zumo* — shown to users as fact. They ride along in the es-latam
   interface packet as read-only context so the LatAm reviewer can judge their own side by
   contrast, and any verdict they give is recorded as **advisory**, never as sign-off.
2. **`data/tracks/esSpainForEn.js`** — 771 questions + 79 pronunciation items, plus
   `data/vocab/esSpainWords.js` (609 Word Bank entries). A whole course teaching peninsular
   Spanish, with no native-of-Spain review.

Without this file, "Spanish is reviewed" would quietly mean "the LatAm half is reviewed."

## Packets

| Scope | Rows | Built | Sent | Returned | Applied |
|---|---:|---|---|---|---|
| `interface` | n/a | — | — | — | — |
| `taught` | ~1,459 | ⬜ | ⬜ | ⬜ | ⬜ |
| `explanation` | n/a | — | — | — | — |

`interface` is n/a because this lane doesn't own the localization. `explanation` is n/a
because no course is taught *in* peninsular Spanish as a distinct voice.

## To stand this lane up

1. Write `docs/language-review/pipeline/i18n/es-spain.json` — the reviewer-facing copy.
   `build_workbook.py` hard-stops without it rather than shipping Spanish instructions
   written for a LatAm audience to a reviewer in Madrid.
2. `node docs/language-review/pipeline/extract.mjs --lane es-spain --scope taught`
3. `python docs/language-review/pipeline/build_workbook.py --lane es-spain --scope taught`

The variants rows invert automatically: run with `--scope interface` and the 254 LatAm rows
become the advisory context and the 71 Spain rows become this lane's responsibility.

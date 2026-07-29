# fr-ca — review ledger

**Lane:** Québec French. Source-language code `fr`; does **not** own the `fr` localization —
that is written in metropolitan French and belongs to [`fr-fr`](../fr-fr/STATUS.md).

**Reviewer: none. This lane is unstaffed, and that is the point of this file existing.**

**Scaffolded 2026-07-29** by the v3.3 Phase 3.5 run. **No packet has been built.** This file
records what it is waiting on, so the gap reads as a decision rather than an oversight.

## Why the lane exists before the packet does

Two surfaces make claims about Québec French that nobody from Québec has verified:

1. **The regional side of the variant card.** `data/tracks/l10n/regionalVariants.js` is the
   registry that asserts, per concept, what France says and what Québec says. Once built, every
   one of those records is shown to users as fact, and only a Québécois native can verify their
   own side — exactly the argument that makes `es-spain` a separate lane from `es-latam`.
2. **`data/tracks/frCaForEn.js`** — a whole course teaching Québec French (plus
   `data/vocab/frCaWords.js`), with no native-of-Québec review. It is a *target* the app already
   teaches today, to English and Spanish and Portuguese natives.

Without this file, "French is reviewed" would quietly mean "the metropolitan half is reviewed."

## Packets

| Scope | Rows | Built | Sent | Returned | Applied |
|---|---:|---|---|---|---|
| `interface` | n/a | — | — | — | — |
| `taught` | ~1,600 (est.) | ⬜ | ⬜ | ⬜ | ⬜ |
| `explanation` | n/a | — | — | — | — |

`interface` is n/a because this lane doesn't own the localization — the shared `fr` UI copy is
metropolitan and belongs to `fr-fr`. `explanation` is n/a because no course is taught *in*
Québec French as a distinct voice: `CONTENT["fr-ca"].explanation` is empty in
`pipeline/extract.mjs`, deliberately.

## ⛔ What this lane is waiting on

**1. The French regional-variant registry (`regionalVariants.js` `fr` block) — the blocker.**
It currently holds **2 seed records** against Spanish's 71 and Portuguese's 64. Deployment plan
§4c is explicit: extend a variant registry to its **high-frequency ceiling BEFORE** handing it
to a native reviewer, so the reviewer clears it in one pass and you never have to re-hire per
release. Sending a 2-record card to a Québécois reviewer would burn the engagement on nothing.

That build-out is **Phase 5 of the v3.3 arc** and has not been done. Known seed content and
candidates: *char/voiture*, *blonde/copine*, *magasiner*, *courriel*, *bogue*, *fin de semaine*,
*déjeuner/dîner/souper*, plus the Belgian/Swiss numeral split (*septante/nonante*) which belongs
on the same card but is a third side, not a second.

**2. `pipeline/i18n/fr-ca.json`.** `build_workbook.py` **hard-stops** without it rather than
falling back to English or to the `fr-fr` copy. That refusal is correct and should not be
worked around: `fr-fr.json` addresses the reviewer in metropolitan French and its decision sheet
tells them the register question is settled — a Québécois reviewer needs their own framing,
starting with the eight France↔Québec divergence terms listed in `fr-fr/STATUS.md`, which for
this lane are the *subject* of the review rather than context.

**3. A decision on whether this lane reviews `frCaForEn.js` now or waits.** The `taught` scope
is buildable today — `CONTENT["fr-ca"].taught` is already `{ tracks: ["frCaForEn"], vocab:
["frCaWords"] }` and the track exists at full depth. It does **not** depend on the variant
registry. If a Québécois reviewer becomes available before Phase 5, send `taught` on its own
rather than waiting for the card.

## To stand this lane up

1. Extend the `fr` block in `data/tracks/l10n/regionalVariants.js` to its high-frequency ceiling
   (§4c). This is Phase 5 of v3.3.
2. Write `docs/language-review/pipeline/i18n/fr-ca.json` — the reviewer-facing copy, framed for
   a Québécois native. Copy `i18n/fr-fr.json` for the shape; rewrite the decision sheet.
3. Build:
   ```
   node docs/language-review/pipeline/extract.mjs      --lane fr-ca --scope taught
   python docs/language-review/pipeline/build_workbook.py --lane fr-ca --scope taught
   ```
4. Run `--scope interface` **only if** the variant-card orientation is confirmed first. The
   Spanish precedent is that running interface on the counterpart lane inverts the variant rows
   — the regional rows become this lane's responsibility and the reference (France) rows become
   advisory context. Confirm that inversion behaves for `fr` before relying on it: the
   `variantScope` values in `pipeline/extract.mjs` (`fr-fr` = `reference`, `fr-ca` = `regional`)
   were seed data, and the extractor's own comment warns not to assume the seed's orientation is
   the product decision.

## Submissions

_None yet._

| File | Reviewer | Scope | Received | Changeset | Applied |
|---|---|---|---|---|---|

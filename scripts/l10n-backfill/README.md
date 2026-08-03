# l10n backfill pipeline

Built for v3.4's #60 backfill (72,306 pt + fr strings). **Reused verbatim by every later
source language**, so it lives here rather than being thrown away — v3.5 German and everything
after it runs the same seven steps.

## What problem it solves

Localizing an explanation is not translating a sentence. Roughly two thirds of every
explanation is *target-language material* — a conjugated verb form, a vocabulary word, an
idiom in the language being learned — and that material must survive byte-identical. A
translation pass over the whole string will sooner or later "improve" one of those, and in
35,000 rows nobody will find it.

So the pipeline never shows a translator the target-language material. It splits each source
string into a **frame** (the framing prose, with `{1}`, `{2}` placeholders) and **slots** (the
quoted spans), translates only frames, and re-substitutes the slots. A verb form cannot be
paraphrased because it is never in the text being translated.

It also collapses the volume: 35,868 pt rows reduce to 13,389 distinct frames.

## The steps

| | | |
|---|---|---|
| 1 | `extract.mjs` | For each source language, dump every item that lacks `explain` / `wrongNote` / `distractorNotes` in that language, with the base English + Spanish strings and the item's already-localized surface. Writes `need.<lang>.json`. |
| 2 | `frames.py` | Split every source string into frame + slots. Writes `rows.<lang>.json` and `frames.<lang>.json`. |
| 3 | `roundtrip.py` | **Refill every frame with its own slots and assert it reproduces the source byte-for-byte.** Includes a mutation that must go red. Run this before translating anything — a split that silently drops text is otherwise invisible until it ships. |
| 4 | `batch.py` | Chunk the frames into ~3,200-word batches, sorted by track/category/field so each batch is coherent. |
| 5 | *(translate)* | One subagent per one or two batches, following `TRANSLATE.md`. Each writes a JSON `{frameId: translated}`. |
| 6 | `validate.py` | Reject any batch whose placeholder set does not match its source exactly, or that is missing//has extra ids. Re-run the rejected batches. |
| 7 | `inject.mjs` | Merge into the side tables, preserving each file's header comment, key order, indent and line endings. Refuses on an unresolved `{n}`. |

`repair.py` is step 2.5, and exists because of a real bug: the first split treated every `'` as
a quote delimiter, so a quoted English idiom containing a contraction (`'I'm running late'`)
split on the wrong apostrophes and captured a Spanish connective as a verbatim slot. It
re-splits with an apostrophe-aware rule and emits **only the rows whose split changed** as a
fresh batch, so a repair costs one small run rather than a re-translation.

**How that bug was found is the reusable part:** sweep for slots with leading or trailing
whitespace. A legitimately quoted term never has any. Run that sweep on every new source.

## `lang-column.mjs`

Separate, smaller tool for the #72 UI surface: extract / inject one language key into every
`{ en, es, … }` object literal in a source file. Insertion is an AST splice at the last
existing property's byte offset, deriving the separator from the gap between the last two
properties and copying that property's key quoting and colon spacing — so formatting and
comments outside the inserted text are never touched. It refuses to inject if a fresh extract
disagrees with the payload's length, or if any value is missing.

Brief for its translators: `LANG-COLUMN-BRIEF.md`. Dedupe before translating — v3.4's chips
were 1,023 objects and 412 distinct strings.

## The gate

None of this is done until `node scripts/verify-l10n-coverage.mjs` shows the new source at
100% on all three surfaces, alongside `es`. That script is wired into `npm run verify:l10n`
and fails the run for any **released** source below the bar. Deployment plan §4 step 2.

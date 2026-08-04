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

## Standing up a NEW source language (`new-source-*`)

v3.4 Italian was the first source built this way, and every later one (v3.5 German onward)
runs the same seven steps. The difference from the backfill is that a new source needs **two**
surfaces, and they must be built in one pass:

- **A. the localized surface** — `prompt` / `promptNative` / `options`, translated from an
  existing sibling table (`.es` where one exists, `.fr` for the Spanish-target tracks).
  Translating a sibling in place is what carries the Word Bank (`fvocab-*`) across for free,
  with no `buildFrequencyBank` replay.
- **B. the explanation surface** — `explain` / `wrongNote` / `distractorNotes`, from the base
  bank's `es` value.

B's `distractorNotes` are keyed by the **localized** option text, so A has to exist first.
`new-source-extract.mjs` emits both in one file so nobody has to remember that.

| | | |
|---|---|---|
| 1 | `new-source-extract.mjs <lang>` | both surfaces, per track, with the English original alongside every string |
| 2 | `new-source-frames.py <lang>` | frame/slot split; frames carry their own source language, since a track can draw A from `fr` and B from `es` |
| 3 | `new-source-roundtrip.py <lang>` | **refill and compare byte-for-byte, with a mutation that must go red.** Run before translating anything |
| 4 | `new-source-batch.py <lang>` | batches sorted by track → field → category, so a batch is coherent |
| 5 | *(translate)* | subagents, following `NEW-SOURCE-BRIEF.md` |
| 6 | `new-source-validate.py <lang>` | placeholder-set and id-set parity; rejects a batch rather than letting it through |
| 6.5 | `new-source-disambiguate.py <lang>` | **the sense-collapse pass — see below.** Then translate `b800+` and re-validate |
| 7 | `new-source-assemble.py <lang> <repo>` | writes the side tables; refuses on any of five conditions |

### The sense-collapse trap — run step 6.5 every time

Frames are deduped on the **source** string, and the source is Spanish or French, not English.
A polysemous source word collapses two meanings into one frame, which then gets one
translation. In Italian: `tarde` (afternoon / evening / late) → `pomeriggio` everywhere,
`probar` (to prove / to taste / to try) → `dimostrare`, `esperar` (to wait / to hope) →
`aspettare`, `mañana` (tomorrow / morning) → `mattina`, `techo` (ceiling / roof) → `tetto`.

Every one is a real word in the target language and simply the wrong meaning. Nothing about
the output looks broken.

`new-source-disambiguate.py` re-keys the affected rows by *(frame, source language, English
original)* and re-emits them with the English as the disambiguator. It is **scoped to frames
that carry their own meaning** — an `options` word, or a short frame with no placeholder.
Prose frames with slots differ between senses only in the slot, which is substituted verbatim.
Without that scope the pass goes from 300 frames to 26,391.

### What the assembler refuses to write

An unresolved `{n}`; an `options` array whose length does not match the sibling's; **two
identical option strings inside one item** (ambiguous question, and two `distractorNotes` keys
collapse into one — v3.0 shipped six items with exactly that); a `distractorNotes` key that is
not one of the item's localized options; any frame with no translation.

The duplicate-option refusal earns its keep: in Italian it caught three items, two of which
were genuine mistranslations rather than mere collisions. Where two source words legitimately
map to one target word, the fix is a per-item override in `overrides.<lang>.json` — the answer
set has to be re-chosen as a whole, and no automatic pass can do that.

### Don't forget the surfaces that are NOT side tables

- **fono explanations live in the track files** (`extraBank`), not the side tables. Use
  `lang-column.mjs ... --after='const FONO_BANK'` to scope the column to that region — without
  the scope it would add a redundant column to every item in the base bank.
- **The L1 anchor pass goes with them.** Those explanations were written for an English
  speaker and anchor sounds to English; for a new source many are wrong and some are false.
  v3.3 re-anchored 54 of 1,590 for French; v3.4 re-anchored **224 of 1,756** for Italian,
  because Italian's phonology gives much better anchors. Tell the translator to do this
  explicitly — it does not happen by itself.
- **`respondPromptNative` is a template literal inside an arrow function.** `lang-column.mjs`
  injects a value raw when it starts with a backtick; anything else would turn `${i.text}`
  into dead text.
- **#72 UI columns** (`playStrings`, `guideSteps`, `skillLevels`, `helpAboutContent`, the
  `*Tags.js` chips) are `lang-column.mjs` work, not this pipeline. Dedupe the chips first —
  v3.4's were 1,023 objects and 412 distinct strings.

### And the audit

`scripts/_it-parity-audit.mjs` is the §4b template: build the post-flip registry **in memory**
and assert against it, so the audit passes before the offering flip rather than after it.
Copy it per source. Derive depth floors from what the previous source actually ships rather
than inventing numbers.

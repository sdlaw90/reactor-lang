# 2026-08-02 — French fono layer across the 10 reused tracks (v3.3 Phase 4)

_Folds into the **3.3.0** release entry._

## User-facing

- None yet. French is still deliberately unreachable — `fr` is absent from `RELEASED_SOURCE_LANGS`
  and `SUPPORTED_UI_LANGS`, and the offering flip is Phase 6. This beat is inert in prod, so a Z
  release can cut over it safely (deployment plan §5c).
- Once the flip lands, a French-native learner sees every phonetics card in French: the
  "read the sound, what does it say?" subtitle, the reply subtitle, and both post-answer
  explanations.

## Content — #71 fono in the source language

- **`fr` added to all 795 FONO_BANK items across the 10 tracks a French native reaches**
  (`deForEn` 79 · `esForEn` 79 · `esSpainForEn` 79 · `itForEn` 80 · `jaForEn` 79 · `koForEn` 79 ·
  `ptBrForEn` 81 · `ptPtForEn` 81 · `ruForEn` 79 · `zhForEn` 79) — **1,590 explanations**
  (`identify.explain` + `respond.explain`), plus `fr` on each track's `identifyPromptNative` and
  `respondPromptNative` (20 subtitles). 1,610 insertions total.
- `frForEn` / `frCaForEn` are correctly untouched — target equals source there, the same way
  `esForEn` carries no `es` subtitle and `ptBrForEn` carries no `pt`.
- **Translated from the English original, not from the Spanish sibling.** `es` was used only as a
  Romance register reference. The pt layer went es→pt; going en→fr here avoids compounding a
  double translation (assumption A12 applied to fono).
- **Respellings, IPA and target-script tokens are preserved character-for-character** — every
  kana, kanji, Hangul syllable, Cyrillic letter, tone-marked pinyin syllable and readable
  respelling (`WAH-der`, `thehr-BEH-thahs`, `EOP-sseo-yo`) is byte-identical to the English.
- **French typography matches the Phase 2 convention:** `« … »` guillemets, typographic
  apostrophe `’`, NBSP before `? ! : ;`, `tu` throughout. The two promptNative strings reuse the
  exact `enUsForFr` / `enGbForFr` wording so every French fono surface reads the same.

### The L1 anchor pass — the part that is not translation

The English explanations were written for an English-speaking learner, so 61 of them anchored a
target sound to English: *"ö — a rounded front vowel with no English equivalent"*. Translated
faithfully, a francophone reads that a sound they already own (the *eu* of « peur »)
has no equivalent. **54 were re-anchored to French**; 7 were kept because English is the content,
not an L1 crutch (the drill teaches an English loanword, or the exchange is literally about
speaking English). Where French has no counterpart either, the explanation now describes the
articulation instead of naming a language.

This is the difference between translating the fono layer and localizing it, and it is worth
noting for v3.4 Italian onward: **every later source needs the same pass.** The pt layer inherited
the English anchors untouched — logged as a cross-source item, not fixed here.

## How it was built and verified

- Surgical acorn AST injection: `fr` inserted after the last existing property of each `explain`
  object at exact byte offsets, copying that object's separator, key quoting and colon spacing.
  The pass refuses to run if the extract and the translation set disagree on count.
- **Per track:** `extraBank` re-evaluated after injection and deep-equal to the original once `fr`
  is stripped (0 mismatches) · every `fr` byte-equal to its translated source · both promptNative
  strings equal to the expected rendered value, `respondPromptNative(i)` interpolation included ·
  comment count unchanged · line count and CRLF endings unchanged.
- **Residual assertions, not presence checks:** unresolved NBSP markers, plain space before French
  punctuation, straight apostrophes not present in the English source, NBSP before a comma or full
  stop, unbalanced guillemets, guillemets missing their NBSP, `vous` addressed at the learner
  outside a citation, stray whitespace. All zero.
- **All 12 checks were mutation-tested** (`_frfono/mutate.mjs`): each was fed a broken input and
  confirmed to go red on its own check, including the one that actually bit during the build — an
  NBSP written as a doubled `\\u00A0` escape renders as literal text, and the first version of the
  promptNative check passed it. A presence check would not have caught it.
- `scripts/_fr-parity-harness.mjs` 232 assertions pass. ESLint clean on all 10 files.
  `npm run build` succeeds on Next 16 / React 19 / Node 24.

## Native review

All 1,590 explanations and the 20 subtitles are AI-authored → **#41 French lane**. The 54
re-anchored explanations deserve a reviewer's attention first: they assert facts about French
phonology (that German *ö* is the *eu* of « peur », that Spanish *j* sits near the French
*r*, that Korean ㅟ is the French « oui ») that a translation pass would never have
introduced. The 7 kept English anchors are listed in the run log.

# 2026-08-03 — Portuguese and French explanations, in Portuguese and French (v3.4 work-beat)

_Folds into the **3.4.0** release entry._

## User-facing
- **Portuguese and French speakers now get their explanations in their own language.** Every
  card's explanation, its "heads up" note on a wrong answer, and the per-option note saying
  what the option you picked actually was — across all twelve courses, not just the two
  English ones. Until now roughly nine cards in ten explained themselves in English.
- Nothing else about those courses changed: the questions, the answer options and your
  progress are exactly where you left them.

## Internal
- **The #60 arrears from v3.2 and v3.3 are cleared.** Measured through the real path
  (`flattenBank` + the play screen's own `resolveExplainText`), which is the bar deployment
  plan §4 step 2 now sets:

  | native | explanations in native lang | wrong notes | distractor notes | fono |
  |---|---|---|---|---|
  | en | 17,399 / 17,399 — 100% | 8,120 / 8,120 — 100% | 22,164 / 22,164 — 100% | 100% |
  | es | 15,522 / 15,522 — 100% | 6,938 / 6,938 — 100% | 18,618 / 18,618 — 100% | 100% |
  | **pt** | **15,044 / 15,044 — 100%** | **6,142 / 6,142 — 100%** | **16,230 / 16,230 — 100%** | 100% |
  | **fr** | **15,102 / 15,102 — 100%** | **6,270 / 6,270 — 100%** | **16,614 / 16,614 — 100%** | 100% |

  Both rows now match `es`. Before this beat they read 10% / 0% / 7%.
- **72,306 strings landed** — 35,868 pt rows and 36,438 fr rows across the twenty side tables.
- **Method: frame-and-slot, not free translation.** Every source string was split into a
  *frame* (the framing prose) and *slots* (the spans in quotes, which are target-language
  material by construction — a conjugated form, a vocabulary word, an idiom). Only the frames
  were translated; the slots are carried through byte-for-byte from the Spanish surface and
  re-substituted. **A verb form or a quoted term therefore cannot be paraphrased, dropped or
  "corrected" by a translation pass** — the failure mode that would be hardest to detect in
  35,000 rows is structurally impossible.
  - It is also what made the volume tractable: 35,868 pt rows reduce to 13,389 distinct
    frames, 36,438 fr rows to 11,804. ~350k words translated instead of ~900k.
  - **Round-trip verified before anything was translated**: refilling every frame with its own
    slots reproduces all 72,306 source strings byte-identically, and a deliberately corrupted
    frame turns that check red. A split that silently lost text would otherwise have been
    invisible until it shipped.
  - Every batch was mechanically rejected unless its placeholder set matched the source
    exactly — same numbers, same count, none added, none dropped. 114/114 batches passed.
- **The Spanish pass left English glosses untranslated in places** (`'{1}' significa room.` —
  the word `room` was never translated) and the backfill does **not** copy that: the English
  original was carried alongside every frame as the authority on meaning, so pt/fr read
  `quarto` / `chambre` where es still reads `room`. Worth a cleanup pass on `es` on its own beat.
- **The apostrophe trap, caught by its own audit.** The first split treated every `'` as a
  quote delimiter, so a quoted English idiom containing a contraction — `'I'm running late'`,
  `'one's own'` — split on the wrong apostrophes and captured a Spanish connective (`' se dice '`)
  as a verbatim slot. 768 pt rows and 306 fr rows. Found by sweeping for slots with leading or
  trailing whitespace, which a real quoted term can never have; re-split with an
  apostrophe-aware rule (a `'` opens a span only when not preceded by a word character and
  closes only when not followed by one) and re-translated as a repair batch.
- **A check went red because the work succeeded** — `verify-l10n-explain.mjs` check 3 asserted
  the English fallback by finding a real item the side table had not reached, and after the
  backfill there are none. The guarantee is still load-bearing (every later source lands
  incrementally), so it is now probed **synthetically**: strip `explain` from one item's overlay
  entry and assert that item resolves `en` **while its unstripped twin resolves `fr`**. Asserting
  both halves is deliberate — a fallback-only assertion would pass vacuously the day the overlay
  stops being applied at all.
- **`distractorNotes` are emitted as a complete localized key set per item.** The engine's
  `mergeDistractorNotes` *replaces* the base map when a side table supplies one (localized
  options re-key it, so base keys no longer correspond), which means a partial map would
  silently drop notes for the distractors it omitted. The injector therefore writes every base
  distractor key, translated where a translation exists and carrying the base English note where
  it does not. Today that fallback branch is unused — coverage is 100% — but it is what keeps a
  future partial pass safe.
- **Bundle impact, as designed.** The side tables were split per track and per source in the
  preceding beat precisely so this content could land: the largest table is now **~97 KB gz**
  (was 31–35 KB gz), and a learner opening a lesson fetches exactly one of them. Had the tables
  still been statically imported, this beat would have added ~900 KB gz to a chunk every learner
  already pulls. English natives still download none.
- **Verified:** `npm run verify:l10n` green with both mutations red · `npx eslint .` 0 errors /
  70 warnings (unchanged) · full `next build` green · `node --check` clean on all 20 rewritten
  tables · coverage table above regenerated from the built tree.
- **All 72,306 strings are AI-authored framing and are flagged for #41 native review** — the pt
  and fr piles each grow by ~36,000 rows. The slots are not review surface (they are unchanged
  target-language content); the frames are.
- No dependency or lockfile change.

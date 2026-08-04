# 2026-08-03 — Italian, the full source build (v3.4 work-beat)

_Folds into the **3.4.0** release entry._

## User-facing
- **SquirreLingo now speaks Italian.** Thirteen courses for Italian speakers — Spanish (Latin
  American and Spain), Portuguese (Brazil and Portugal), French (France and Québec), German,
  Russian, Japanese, Korean, Mandarin, and both American and British English — with the
  questions, answer choices, subtitles, explanations and phonetics all in Italian.
- **The two English courses were written for Italian speakers specifically**, not translated
  from another language's course: Italian↔English false friends (*attualmente*, *libreria*,
  *parenti*, *camera*, *pretendere*), the grammar Italian does not prepare you for (one past
  tense becoming two, sentences that need a subject, *do* in questions), and the sounds that
  are genuinely hard from Italian — the two TH's, the schwa, *ship* vs *sheep*, and not adding
  a vowel after a final consonant.
- **The phonetics explanations were rewritten for an Italian ear.** They used to explain a
  sound by what English does with it. Japanese has the same five pure vowels as Italian, the
  same long consonants, and nearly the same tapped *r* — an Italian starts several steps ahead
  there, and now the app says so.

## Internal
- **The Italian source is built to full parity — 13 tracks, no stubs.** `#60` measured
  through the real render path on the simulated post-flip offering:

  | native | tracks | explanations | wrong notes | distractor notes |
  |---|---|---|---|---|
  | it | 13 | 16,700 / 16,700 — 100% | 7,220 / 7,220 — 100% | 19,464 / 19,464 — 100% |

  Matching `es`. **Italian is the first source to meet the §4 step 2 bar on the day it is
  built rather than as a backfill two releases later.**
- **79,861 strings** across 11 new side tables, plus two authored English-target tracks, plus
  1,756 fono explanations.
- **Both surfaces went through the frame-and-slot pipeline** (`scripts/l10n-backfill/`), so
  the localized surface and the explanation surface were built in one pass rather than the
  explanation layer arriving later — which is the mistake v3.2 and v3.3 made.
  `new-source-extract.mjs` emits both, and orders them so `distractorNotes` can be keyed by
  the localized option text.
- **Round-trip verified before any translation ran**: refilling all 26,800 frames with their
  own slots reproduced all 79,861 source strings byte-identically, with a mutation that turns
  the check red. 67/67 batches passed placeholder validation.
- **NEW FAILURE MODE FOUND — sense-collapse.** Frames are deduped on the *source* string, and
  the source is Spanish or French. When the source word is polysemous the dedupe collapses two
  meanings into one frame, and the frame gets one translation. `tarde` (afternoon / evening /
  late) came out `pomeriggio` everywhere; `probar` (to prove / to taste / to try) came out
  `dimostrare`; `esperar` (to wait / to hope) came out `aspettare`; `mañana` (tomorrow /
  morning) came out `mattina`; `techo` (ceiling / roof) came out `tetto`. **Every one is a
  real Italian word and simply the wrong meaning** — the kind of error that survives any
  amount of proofreading a word list.
  - Fixed by `new-source-disambiguate.py`: re-key the affected rows by *(frame, source
    language, English original)* and re-translate with the English as the disambiguator.
  - **Scoped to frames that CARRY their meaning** — an `options` word, or a short frame with
    no placeholder. Prose frames with slots differ between senses only in the slot, which is
    substituted verbatim, so one translation serves all of them. Without that scope the pass
    explodes from 300 frames to 26,391, because an `explain` row's English original is
    near-unique. 300 → 686 sense frames, ~900 words.
  - **Run this for every future source.** The English column exists in the extract for
    exactly this reason.
- **Three option collisions caught by a refusal, not by review.** The assembler will not write
  an item whose localized options are not all distinct — a duplicate makes the question
  ambiguous *and* collapses two `distractorNotes` keys into one (v3.0 shipped six items with
  that bug). Two of the three turned out to be genuine mistranslations (`techo`→`tetto` for
  *ceiling*, `cálido`→`caldo` for *warm*); the third was `accurate` and `exact` both landing
  on `preciso`, where no disambiguation helps and the answer set has to be re-chosen as a
  whole. Recorded explicitly in `scripts/l10n-backfill/overrides.it.json`.
- **The L1 anchor pass, at four times v3.3's rate.** v3.3 re-anchored 54 of 1,590 French fono
  explanations; Italian re-anchored **224 of 1,756**, because Italian's phonology gives far
  better anchors than English does: Japanese's five pure vowels and geminates *are* Italian's,
  `gn`/`gli` are direct anchors for Portuguese `nh`/`lh` and Russian `нь`/`ль`, `z` di *pizza*
  for German `tz` and Japanese `つ`, the Italian tap for Korean and Japanese `r`. Several
  source explanations were not merely English-centric but **false for an Italian** — calling a
  sound hard that Italian already has.
- **Two English-target tracks authored at French parity**: `enUsForIt` (vocab 133 / gram 520 /
  trad 125 / fono 77) and `enGbForIt` (131 / 521 / 122 / 79). Both structurally verified — four
  distinct options, `correctIdx === 0`, `{en, it}` explanations, valid CEFR, no duplicate
  prompts, Italian typography (no French spacing before `?`/`!`).
- **`enForIt.js` is superseded.** The 36-item stub fails every depth floor and its false-friend
  content was folded into `enUsForIt`. Retiring it is one `git rm` in the flip.
- **Italian regional variants stay empty, and that is now a decision rather than a TODO.**
  Italy↔Switzerland divergence is thin and Italian's real variation is dialectal, not a clean
  national binary — forcing entries would fire the card on differences a learner never meets.
  `indexRegionalTerms` stays off (the v3.3 rule for every source after es/pt).
- **`scripts/_it-parity-audit.mjs`** runs §4b against a **simulated** registry, so the audit
  passes before the flip rather than after it. 16 assertions, all green; depth floors are
  derived from what the French source actually ships rather than invented.
- **The flip is written and NOT applied** — `docs/_it-offering-flip.md`, the artifact for
  sign-off. It notes the thing that makes this flip unlike the others: **Italiano was already
  in the picker and already broken**, so not applying the patch is not the safe option.
- **Verified:** `npm run verify:l10n` green (3 scripts, mutations red) · `npx eslint .` 0
  errors / 81 warnings — 70 baseline plus 11 new side tables each hitting the same
  pre-existing `import/no-anonymous-default-export` that all 30 existing tables hit ·
  full `next build` green · `node --check` clean on all 27 written/edited files ·
  `_it-parity-audit.mjs` 16/16.
- **Found in passing, not fixed:** `enGbForFr.js` has a duplicate `trad` prompt (item 60
  repeats item 33, *« Il pleut des cordes. »*) and `enGbForPt.js` almost certainly inherits it;
  and seven `en:` explanations in the same file still reference *Spanish* rather than French, an
  artifact of the es→pt→fr chain. The Italian equivalents are correct. Both are one-line fixes
  on their own beat.
- All Italian content is AI-authored and flagged for #41 native review. **No Italian reviewer
  is recruited.**
- No dependency or lockfile change.

# deForEn deepening + Word Bank (2026-07-12)

## User-facing
- German goes deep: the German track grows from 36 to 715 questions, with all six difficulty tiers covered, English subtitles under every German prompt, five new pronunciation pairs (final devoicing, the heiße/hasse trap, and the Eichhörnchen final boss), and its own 637-word Word Bank in the new "Wörter" category

## Internal
- Curated pass 36 → 78: vocab 12→25, gram 9→20, trad 7→15, fono 4→9 pairs; A1–C2 coverage in every category; 7-slot format with `promptNative` (slot 6) on every German-language prompt, incl. fono identify/respond prompt natives in the track mapping
- Word Bank: `data/vocab/deWords.js` (637 words, tiers A1 178 / A2 158 / B1 148 / B2 93 / C1 60 — matches the frCa assembly-line profile), generated via `buildFrequencyBank` seed 20260712, `wbCatId: "fvocab"` (#78 round-draw cap applies); end-to-end verified: 637 questions, zero thin-question skips, no duplicate options/prompts
- Deliberate formula deviation, documented in the track header: DE_FORMULAS do NOT auto-capitalize the headword (German casing is grammatically meaningful); deWords stores dictionary casing, nouns carry their article so production questions teach gender
- TTS pass prep flagged in track header: `Wie sagt man '...'?` needs the ¿Cómo se dice...?/Comment dit-on...? SSML analogue (English word in native `<lang>` span); de-DE Neural2-A (F) / Neural2-B (M) confirmed to exist
- #41: German native reviewer needed for deWords.js + curated deck (queued, like frCaWords' Québécois reviewer)
- Version 2.30.0-beta.2 (ledger updated in this chat)

# Italian (itForEn) — Content-Depth Pass Reference

_Ran 2026-07-19. Brings itForEn to the Spanish depth standard; new dedicated
`verbo` ("Verbi") category._

## Result
- Vocab +106, Verbs +117 depth (+24 migrated variants/base),
  Idioms +90, Phonetics +71. Tags: 253.
- Dropped in QA: {"vocab": 14, "trad": 29, "verbo": 16, "fono": 1} (dups + verbecc conjugation mismatches).

## Method
Per-(category × CEFR band) workflow (~44 agents) + native-speaker adversarial
verify; verbo forms verbecc-verified; deduped vs existing bank; new
`itForEnTags.js` (themes + per-verb tense/person). `gameEngine.js` unchanged
(category-agnostic). AI-authored → beta pre-review; native review gates real-prod.

## Deliverables
- `review-packets/it-depth-review.xlsx` — native-review packet.
- `generated/it_depth_generated.json` — round-trip data (IDs join to track).

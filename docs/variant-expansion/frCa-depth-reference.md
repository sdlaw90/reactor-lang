# French (Québec) (frCaForEn) — Content-Depth Pass Reference

_Ran 2026-07-19. Brings frCaForEn to the Spanish depth standard; new dedicated
`verbo` ("Verbes") category._

## Result
- Vocab +92, Verbs +133 depth (+18 migrated variants/base),
  Idioms +104, Phonetics +67. Tags: 266.
- Dropped in QA: {"vocab": 28, "trad": 8, "verbo": 10, "fono": 3} (dups + verbecc conjugation mismatches).

## Method
Per-(category × CEFR band) workflow (~44 agents) + native-speaker adversarial
verify; verbo forms verbecc-verified; deduped vs existing bank; new
`frCaForEnTags.js` (themes + per-verb tense/person). `gameEngine.js` unchanged
(category-agnostic). AI-authored → beta pre-review; native review gates real-prod.

## Deliverables
- `review-packets/frCa-depth-review.xlsx` — native-review packet.
- `generated/frCa_depth_generated.json` — round-trip data (IDs join to track).

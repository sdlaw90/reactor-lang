# Portuguese (Brazil) (ptBrForEn) — Content-Depth Pass Reference

_Ran 2026-07-19. Brings ptBrForEn to the Spanish depth standard; new dedicated
`verbo` ("Verbos") category._

## Result
- Vocab +103, Verbs +141 depth (+38 migrated variants/base),
  Idioms +97, Phonetics +72. Tags: 306.
- Dropped in QA: {"vocab": 14, "trad": 16} (dups + verbecc conjugation mismatches).

## Method
Per-(category × CEFR band) workflow (~44 agents) + native-speaker adversarial
verify; verbo forms verbecc-verified; deduped vs existing bank; new
`ptBrForEnTags.js` (themes + per-verb tense/person). `gameEngine.js` unchanged
(category-agnostic). AI-authored → beta pre-review; native review gates real-prod.

## Deliverables
- `review-packets/ptBr-depth-review.xlsx` — native-review packet.
- `generated/ptBr_depth_generated.json` — round-trip data (IDs join to track).

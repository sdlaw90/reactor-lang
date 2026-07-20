# Portuguese (Portugal) (ptPtForEn) — Content-Depth Pass Reference

_Ran 2026-07-19. Brings ptPtForEn to the Spanish depth standard; new dedicated
`verbo` ("Verbos") category._

## Result
- Vocab +105, Verbs +138 depth (+42 migrated variants/base),
  Idioms +94, Phonetics +72. Tags: 307.
- Dropped in QA: {"vocab": 9, "trad": 18} (dups + verbecc conjugation mismatches).

## Method
Per-(category × CEFR band) workflow (~44 agents) + native-speaker adversarial
verify; verbo forms verbecc-verified; deduped vs existing bank; new
`ptPtForEnTags.js` (themes + per-verb tense/person). `gameEngine.js` unchanged
(category-agnostic). AI-authored → beta pre-review; native review gates real-prod.

## Deliverables
- `review-packets/ptPt-depth-review.xlsx` — native-review packet.
- `generated/ptPt_depth_generated.json` — round-trip data (IDs join to track).

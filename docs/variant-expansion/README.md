# variant-expansion

Reworking existing SquirreLingo questions into other grammatical forms (person, tense, mood,
politeness) to grow the question bank **without** letting learners memorize fixed answers.
Design by Sean + Claude; **correctness gated by native-speaker review** — see *Release strategy*
below for where that gate sits (it is moving from "before load" to "before full production").

## Contents
- `00-methodology.md` — master playbook. **Read first.** Language-agnostic pipeline + the
  per-language axis reference table that lets Claude run a new language without re-confirming.
- `01-spanish-reference.md` — the worked Spanish example the method is derived from.
- `review-packets/<lang>-verb-variants.xlsx` — the file handed to a native reviewer.
- `generated/<lang>_generated.json` — machine-readable variants with IDs, for round-trip.

## Workflow
inventory → classify → generate (engine) → package → **native review** → round-trip into
`data/tracks/<lang>ForEn.js`. See methodology §1.

## Status tracker

| Lang | Track | Reviewer | Inventory | Generated (person / tense) | Packet | Reviewed | Loaded |
|---|---|---|---|---|---|---|---|
| Spanish (LatAm) | esForEn | ✅ confirmed | ✅ 157 | ✅ 358 / (tense held) | ✅ | ⬜ | ✅ shipped beta v2.33.0-beta.3 |
| French | frForEn / frCaForEn | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Italian | itForEn | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Portuguese | ptBrForEn / ptPtForEn | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| German | deForEn | ⬜ | ⬜ | ⬜ (no verbecc) | ⬜ | ⬜ | ⬜ |
| Russian | ruForEn | ⬜ | ⬜ | ⬜ (+aspect axis) | ⬜ | ⬜ | ⬜ |
| Japanese | jaForEn | ⬜ | ⬜ | ⬜ (politeness axis, not person) | ⬜ | ⬜ | ⬜ |
| Korean | koForEn | ⬜ | ⬜ | ⬜ (speech-level axis, not person) | ⬜ | ⬜ | ⬜ |
| Chinese | zhForEn | ⬜ | ⬜ | ⬜ (aspect axis, no conjugation) | ⬜ | ⬜ | ⬜ |

Legend: ✅ done · ⬜ pending. "Loaded" = variants merged into the track file (dev branch).

> **Note (Spanish):** the 358 person-swaps were shipped to the **closed beta** *before* native
> review — a deliberate call to move fast in beta, with the reviewer packet as the correction
> pass. The #41 review is still owed; corrections round-trip via the `// es-v-…` IDs. For every
> other language, keep the normal order: review **before** loading.

## Release strategy — CONTEMPLATED, NOT COMMITTED

> ⚠️ This is a direction Sean is leaning toward, **not a decided plan.** Do not build
> tooling or branch changes around it yet, and do not treat it as fact in other docs. It
> needs to be fully thought through first. Captured here so a future session understands the
> intent behind shipping unreviewed content to beta.

The likely (but unconfirmed) future shape is a **three-tier, ring-based rollout**:

`dev → beta testers → full production`

with the native-review gate **moved to the final hop**. That is: content flows into dev and
out to beta testers freely (keeps momentum, avoids project staleness), and native review
becomes a **promotion gate** — only reviewed items are promoted to full production for the
general user base. Beta testers get updates early (an intentional perk) and double as a
first error-sweep that surfaces the clunky auto-generated items before formal review.

Why this fits what's already built: every variant carries a stable `// es-v-NNN` ID and lives
in a reviewer packet, so "what's reviewed" is a concrete ledger — promotion to prod becomes a
**filter on reviewed IDs**, not a guess. That traceability is the load-bearing piece if this
model is adopted.

Branch mechanics (undecided): today `main` ≈ production. The contemplated model inserts a tier
— either `main` becomes the beta tier with a new production branch added, or a `beta` branch
is inserted between `dev` and `main`. To be decided when the strategy is actually planned out.

**Until this is committed:** the standing rule still holds for every language *except* the
Spanish beta exception already taken — **review before loading**.

## Roadmap
1. **Now:** Spanish template (this folder). Sean reacts to the packet format.
2. **Next:** roll fr / it / pt (verbecc transfers) autonomously per the methodology.
3. **Then:** de / ru (adapt axes).
4. **Last:** ja / ko / zh (redefine the axis entirely — politeness / aspect, native review is
   load-bearing).

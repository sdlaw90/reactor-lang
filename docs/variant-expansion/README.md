# variant-expansion

Reworking existing SquirreLingo questions into other grammatical forms (person, tense, mood,
politeness) to grow the question bank **without** letting learners memorize fixed answers.
Design by Sean + Claude. **The native-review gate sits before REAL (non-beta) production — not
before beta.** Generated content ships to beta-prod *pre-review by standard* (fast momentum for
beta testers); native review is what gates promotion to the real live app. See *Release strategy*.

## Contents
- `00-methodology.md` — master playbook. **Read first.** Language-agnostic pipeline + the
  per-language axis reference table that lets Claude run a new language without re-confirming.
- `01-spanish-reference.md` — the worked Spanish example the method is derived from.
- `review-packets/<lang>-verb-variants.xlsx` — the file handed to a native reviewer.
- `generated/<lang>_generated.json` — machine-readable variants with IDs, for round-trip.

## Workflow
inventory → classify → generate (engine) → package → **load into
`data/tracks/<lang>ForEn.js` and ship to beta-prod** → native review (in parallel) →
corrections round-trip via IDs → review gates promotion to real prod. See methodology §1.

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

> **Note (Spanish → the standard):** the 358 person-swaps were loaded and shipped to beta-prod
> *before* native review, with the reviewer packet as the correction pass. This is **not a
> one-off — it's the standard for every language going to beta.** Generate → package → load →
> ship to beta; the #41-style native review runs in parallel and gates only the eventual
> real-prod promotion. Corrections round-trip via the `// <lang>-v-…` IDs.

## Release strategy

The shape is a **three-tier, ring-based rollout**: `dev → beta-prod → real production`, with
the native-review gate on the **final hop only**.

**The gate policy is DECIDED (this is how we operate now):**
- Generated content is loaded and shipped to **beta-prod without waiting for review** — every
  language, by standard. This keeps momentum and gives beta testers early updates; they also
  act as a first error-sweep on the auto-generated items.
- **Native review gates promotion to real (non-beta) production only.** Nothing reaches the
  general live app unreviewed.
- This works because every variant carries a stable `// <lang>-v-NNN` ID and lives in a
  reviewer packet, so "what's reviewed" is a concrete ledger — real-prod promotion is a
  **filter on reviewed IDs**, not a guess.

**Branch mechanics are STILL BEING PLANNED (contemplated, not committed):**
- Today `main` **is** the beta-prod tier (`npm run deploy beta`); `npm run deploy prod` is
  reserved and errors until the real-prod branch exists.
- The real-prod branch (the third tier) hasn't been stood up yet — Sean wants to plan it out
  properly first. Don't build branch tooling around it until then.

> So: apply the gate **policy** now (ship every language to beta pre-review). Do **not** invent
> the real-prod **branch** mechanics — that's Sean's to design when ready.

## Roadmap
1. **Now:** Spanish template (this folder). Sean reacts to the packet format.
2. **Next:** roll fr / it / pt (verbecc transfers) autonomously per the methodology.
3. **Then:** de / ru (adapt axes).
4. **Last:** ja / ko / zh (redefine the axis entirely — politeness / aspect, native review is
   load-bearing).

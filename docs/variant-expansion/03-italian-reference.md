# Italian (itForEn) — Variant-Expansion Reference

Phase 1 person-swap, run per `00-methodology.md`. Direct Romance transfer;
`verbecc('it')` supplies the forms. Native reviewer: **pending** (it-IT).

## Where the conjugation drills live

Like French, itForEn has **no `verbo` category** — the conjugation drills sit in
the mixed `gram` category and were found by structure (`___` blank + lemma gloss).

## Person set
`io · tu · lui/lei · noi · voi · loro` (6 cells).

## Output — SHIPPED to closed beta as v2.33.0-beta.4 (2026-07-19)

**4 base items → 20 person variants** (all Medium):
`essere` (present, "Io sono italiano"), `avere` (present, "Noi abbiamo fame"),
`andare` (future, "Domani andrò al mare"), `volere` (present subjunctive, "Che tu
voglia o no…").

**Predicate agreement:** copular "Io sono italiano" pluralizes the predicate for
plural subjects (`italiano → italiani` for noi/voi/loro) — handled at authoring
time so the swapped sentences are grammatical.

**Phase 2 — tense-swap:** not generated this pass.

## Not transformed (documented in the packet)
- `mangiare` "Ieri ho mangiato…" — auxiliary-choice drill, implied subject.
- `dormire` "Ieri Maria…" — noun subject (Maria) → 3rd-person locked.
- `viaggiare` "Se avessi tempo, viaggerei…" and `sapere` "Se lo sapessi…" —
  hypothetical periods where the blank's clause and the fixed clause would
  disagree in person if only the blank changed.
- `essere` "Benché fosse tardi…" — impersonal subject ("it was late").

## Decisions
Same as the French reference: unambiguous-person only; sibling-form distractors
deduped to 4 and shuffled; provisional until it-IT review; round-trip via the
`// it-v-…` IDs.

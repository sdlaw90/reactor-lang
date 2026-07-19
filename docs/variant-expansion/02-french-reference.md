# French (frForEn / frCaForEn) — Variant-Expansion Reference

Phase 1 person-swap, run per `00-methodology.md`. French is a direct Romance
transfer of the Spanish model (person × tense × mood); `verbecc('fr')` supplies
the forms. Two tracks share this reference: **frForEn** (France) and
**frCaForEn** (Québec). Native reviewers: **pending** (fr-FR and fr-CA).

## Where the conjugation drills live (differs from Spanish)

These tracks have **no dedicated `verbo` category**. The verb-conjugation drills
sit inside the mixed **`gram`** category and were located by structure — a `___`
blank plus a lemma gloss (either inline `(lemma)` or `(lemma = to …)` in the
English subtitle) — exactly as §2 of the methodology instructs when a track
names its verb category differently. Article/agreement/negation/pronoun items in
`gram` are not conjugation drills and are out of scope.

## Person set

`je · tu · il/elle · nous · vous · ils/elles` (6 cells; standard French uses
`vous`). One 3rd-singular (`il`) and one 3rd-plural (`ils`) stand in for their
feminine twins, whose verb forms are identical. Prompts are authored per person
so elision is correct (`que je → que je`, `qu'il`, `qu'ils`) and possessives
agree (`tes → mes/ses/nos/vos/leurs`).

## Output — SHIPPED to closed beta as v2.33.0-beta.4 (2026-07-19)

Loaded into the `gram` bank of each track *before* review (the standard gate
policy); the packets are the parallel correction pass.

**frForEn — 4 base items → 17 person variants:** `faire` (present subjunctive,
"Il faut que…"), `fermer` (imperative — nous/vous), `vouloir` (polite
conditional), `partir` (future). 2 High (imperative), 15 Medium.

**frCaForEn — 3 base items → 15 person variants:** `faire` (present subjunctive),
`être` (present, "Je suis de Montréal"), `être` (present subjunctive, "Il
faudrait que…"). All 15 Medium. Only standard-grammar drills were transformed —
the track's casual Québécois-usage judgment items (Chu fatigué, T'as-tu, Je vas,
A veut pas…) were left alone (see "Not transformed").

**Phase 2 — tense-swap:** not generated this pass (held per methodology §6).

## Not transformed (documented in each packet)
- Auxiliary-choice judgments (être vs avoir; reflexive s'est levée).
- Comparatives, articles, pronouns, negation — not verb drills.
- Québécois casual-usage judgment items (frCaForEn).

## Decisions (inherited from Spanish unless noted)
1. Person-swap only where the drill's person is unambiguous — explicit pronoun
   or an explicit `(lemma, person)` hint.
2. Distractors reuse sibling person-forms, deduped to 4, shuffled.
3. Imperative person-swap kept to its valid persons (tu/nous/vous), flagged High.
4. Everything provisional until fr-FR / fr-CA review; corrections round-trip via
   the `// fr-v-…` / `// frCa-v-…` IDs.

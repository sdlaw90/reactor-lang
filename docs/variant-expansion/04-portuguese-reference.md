# Portuguese (ptBrForEn / ptPtForEn) — Variant-Expansion Reference

Phase 1 person-swap, run per `00-methodology.md`. `verbecc('pt')` supplies the
forms. Two tracks: **ptBrForEn** (Brazil) and **ptPtForEn** (Portugal). Native
reviewers: **pending** (pt-BR and pt-PT). Portuguese is the richest Romance case
because it adds axes the others don't have.

## Where the conjugation drills live
No `verbo` category — drills sit in the mixed `gram` category, found by structure
(`___` blank + `(lemma)` or `(lemma, person)` hint).

## Person sets (regional)
- **ptBr:** `eu · você · ele/ela · nós · eles/elas` (Brazilian — `você` for 2sg;
  `a gente` colloquial "we" treated as 3sg base).
- **ptPt:** `eu · tu · ele/ela · nós · eles/elas` (European — `tu` for 2sg; `vós`
  is historical and only appears as a base to convert *away from*).

## Portuguese-specific axes (flagged High-risk for review)
- **Future subjunctive** after `quando`/`se` ("Quando você chegar…") —
  chegar/chegares/chegarmos/chegarem.
- **Personal (inflected) infinitive** ("É importante fazermos isso") — the
  `(lemma, person)` hint carries the person; ir/ires/irmos/irem, fazer/fazeres/
  fazermos/fazerem. The bare 1sg/3sg form collapses to the plain infinitive, so
  the hint is what disambiguates the drill — a point worth the reviewer's eye.
- **Imperative** person-swap (ptPt "Faz → Faça/Façamos/Façam") — authored to the
  modern forms (verbecc emits an archaic "faze" + trailing pronoun).

## Regional orthography honored
- Preterite `nós`: ptBr **falamos** (no acute) vs ptPt **falámos** (acute).
- Present `nós` of `ir`: forced to **vamos** (verbecc's rule-based output is the
  archaic **imos**).

## Predicate agreement
Copular items pluralize/singularize the predicate with the subject:
`brasileiro → brasileiros`, `português → portugueses`, `bem-vindo ↔ bem-vindos`.

## Coreferential subjunctive
"Espero que você/tu … " excludes the **eu** cell — "Espero que eu esteja bem" is
coreferential with the 1sg main verb, where Portuguese prefers the infinitive
("Espero estar bem"). Same exclusion Spanish applied.

## Output — SHIPPED to closed beta as v2.33.0-beta.4 (2026-07-19)

- **ptBrForEn — 8 base items → 30 variants** (8 Low / 15 Medium / 7 High):
  estar (pres. subj), ser (copular), ter (present), falar (preterite), ir
  ("a gente"), morar (present), chegar (future subj), fazer (personal infinitive).
- **ptPtForEn — 9 base items → 33 variants** (3 Low / 20 Medium / 10 High):
  estar (pres. subj), ser (copular), ter (present), falar (preterite & present),
  fazer (imperative), chegar (future subj), ir (personal infinitive), ser
  ("Vós sois bem-vindos" → modern persons).

**Phase 2 — tense-swap:** not generated this pass.

## Not transformed (documented in each packet)
- Progressive (`estar` + gerund, "Ela está comendo") — auxiliary axis, separate rule.
- Two-clause hypotheticals ("Se eu tivesse dinheiro, viajaria…", "Se nós
  pudermos, vamos…") — blank is a subordinate verb, main clause fixed → mismatch.
- "Moro aqui há dois anos" — the blank is the impersonal duration marker `há`,
  not a conjugation of the subject.

## Decisions
Unambiguous-person only (explicit pronoun or `(lemma, person)` hint); sibling
person-forms as distractors, deduped to 4 and shuffled; provisional until
pt-BR / pt-PT review; round-trip via the `// ptBr-v-…` / `// ptPt-v-…` IDs.

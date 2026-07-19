# Spanish (esForEn) — Reference Implementation

The worked example the methodology is derived from. Latin American Spanish
(seseo, yeísmo, **no vosotros**; `ustedes` = plural you). Native reviewer: **confirmed**
(LatAm Spanish, esForEn only).

Track file: `data/tracks/esForEn.js` · verb category: `verbo` · **157 base questions**.

## Item schema (verbo)
```
[ prompt, [options], correctIndex, {en, es} explanation, CEFR, null, {en} subtitle ]
```
e.g. `["Yo _____ (tener) mucha hambre ahora mismo.", ["tengo","tienes","tiene","tenemos"], 0,
{en:"'Tener' is irregular in the yo-form: yo tengo.", es:"…"}, "A1", null,
{en:"I _____ (tener = to have) am really hungry right now."}]`

## Classification results (157 items)

**Structure:** standard 135 · reflexive 7 · progressive 5 · gustar-type 6 · impersonal-se 2 ·
infinitive-slot 2.

**Tense spread (from the author's own explanations — authoritative):** present ~36 ·
present-subjunctive 50 · imperfect-subjunctive 15 · preterite 14 · imperfect 9 ·
present-perfect 7 · pluperfect 7 · conditional 5 · future 4 · imperative 6.

**Lock status:** flexible 45 · marker-locked 31 · mood-locked 65 · imperative 6 · special 10.

**Irregular verbs:** 74 of 157 base items (⚠). Conjugation done with `verbecc` (reliable on
these), but every generated form still goes to review.

## Generation output — SHIPPED to closed beta as `v2.33.0-beta.3` (2026-07-19)

Sean's call: ship Phase 1 to the closed beta now, use the reviewer packet as the correction
pass (native review still owed under #41). Loaded into `data/tracks/esForEn.js`; verbo bank
**157 → 515**.

**Phase 1 — person-swap (SHIPPED):** **91** pronoun-subject standard/reflexive base items
yielded **358 person variants** (~3.9 per base). 180 involve an irregular verb, 28 are
reflexive (pronoun agreement applied: yo→me, tú→te, él→se, nos→nos, ellos→se). Each entry
carries an inline `// es-v-NNN-p-<person>` ID + a block marker so review fixes round-trip.
Options deduped (yo=él share forms in imperfect/conditional/subjunctive) and shuffled so the
answer isn't always first.

**Phase 2 — tense-swap (NOT shipped):** a 13-row sample exists in the JSON for format only;
intentionally held back (each needs a time-marker rewrite). Full tense generation waits until
Phase 1 review returns.

**Not transformed — 58 items**, all documented in the packet:
- 41 — noun/implied subject → 3rd-person locked (person-swap would change meaning).
- 6 — gustar-type (needs indirect-object rule, not subject-person swap).
- 5 — progressive (vary the `estar` auxiliary, separate rule).
- 2 — impersonal/passive `se` (no personal subject).
- 2 — infinitive slot (blank isn't conjugated).
- 2 — impersonal weather verbs (llover/nevar — no personal subject).

Also **dropped, not shipped:** coreferential subjunctive variants — swapping the subordinate
subject to match a 1st-person trigger ("Quiero que **yo** estudie") is wrong Spanish (needs the
infinitive), so those specific person cells were excluded.

## Deliverables
- `review-packets/es-verb-variants.xlsx` — **358 review rows** (278 Medium / 80 Low) + 58
  not-transformed. Mirrors exactly what is live in the beta. Sorted by priority.
- `generated/es_generated.json` — machine-readable, with IDs (`es-v-NNN`, `…-p-<person>`) for
  round-trip corrections back into `esForEn.js`.

## Decisions locked for Spanish (and inherited by fr/it/pt unless noted)
1. Person cells = **5** (LatAm, no vosotros): yo · tú · él/ella · nosotros · ellos/ellas.
2. Person-swap only on **pronoun-subject** items; noun-subject stays 3rd person.
3. Distractors reuse the sibling person-forms (matches source style), 4 options per item.
4. Reflexives get pronoun-agreement; gustar/progressive/impersonal/infinitive are **not**
   naive-person-swapped.
5. Tense-swap is Phase 2, sample-only until validated, always reviewer-confirmed.
6. Everything provisional until the LatAm reviewer signs off; then round-trip into `esForEn.js`.

## Open questions for review (Sean / reviewer)
- Confirm the 4-option distractor style is what we want, vs. drawing distractors from other
  *tenses* (harder, more discriminating).
- After the reviewer returns Phase 1, green-light full Phase-2 tense generation?
- Whether to also mine the `trad` idioms for the handful that are literally conjugatable.

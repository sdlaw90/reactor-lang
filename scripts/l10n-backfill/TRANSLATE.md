# SquirreLingo v3.4 — #60 explanation backfill: translation brief

You are translating **explanation framing** for a language-learning app. These strings are
shown to a learner right after they answer a question: the explanation of the right answer
(`explain`), a general "heads up" on a wrong pick (`wrongNote`), and a short per-option note
saying what a specific wrong option actually is (`distractorNotes`).

## The unit you are translating

Each item is a **frame**: a sentence with numbered placeholders `{1}`, `{2}`, … standing in
for spans that must NOT be translated. Those spans are target-language material — a
conjugated verb form, a vocabulary word, an idiom in the language being learned. They get
substituted back in verbatim after you are done.

```json
{"id": 9172, "track": "de-for-en", "cat": "fvocab", "field": "explain",
 "es": "'{1}' significa room.", "en": "'das Zimmer' means room.", "n": 3,
 "slots_example": ["das Zimmer"]}
```

- `es` — the Spanish rendering. **This is your source text.** It is already complete and
  shipped, so matching its register and length keeps the app consistent.
- `en` — the English original. Use it as the **authority on meaning**, especially where the
  Spanish left an English word untranslated (the Spanish pass did that in places — see the
  example above, where `room` was never translated). Do not copy the Spanish mistake.
- `slots_example` — one real set of values for the placeholders, so you can see what the
  sentence actually reads like. Do not put these values in your output.
- `track` — which course. `de-for-en` = German is the **target** language being taught,
  `ja-for-en` = Japanese, and so on. `cat`: `vocab` words · `verbo` conjugation drills ·
  `gram` grammar points · `trad` idioms/translation · `fvocab` Word Bank.

## Hard rules

1. **Every placeholder in `es` must appear exactly once in your output, unchanged.** Same
   set, same spelling: `{1}`, `{2}`. Never add one, never drop one, never renumber. This is
   checked mechanically and a mismatch rejects the whole batch.
2. **Never translate the content the placeholders stand for** — you cannot see most of it,
   and it is target-language material by construction.
3. **Keep target-language words that appear unquoted in the frame verbatim** — grammatical
   term names in the target language (`passato prossimo`, `congiuntivo`, `imparfait`,
   `Konjunktiv II`, `batchim`, particles like `を`/`-습니다`), and any target-language
   example. Translate only the framing around them.
4. **Translate grammatical vocabulary that is in English or Spanish**: "the nosotros form",
   "present subjunctive", "right subject, wrong tense", "the nominative form", "isn't the
   idiomatic expression". Use the standard grammatical terminology of your language.
5. **Keep the punctuation shape**: leading/trailing spaces, the em dash `—`, ellipses `…`,
   final period or its absence, capitalisation of the first word. Several of these are
   sentence fragments on purpose (a `distractorNotes` note is a fragment) — keep them
   fragments.
6. **Preserve quote marks as they appear**, except where your language's typography says
   otherwise (rule 8).
7. Output **only** the translation for each id. No commentary, no explanation of choices.

## Register and typography

**Portuguese (`pt`) — Brazilian Portuguese.** Address the learner as **você** (implicitly;
prefer impersonal phrasing where the Spanish is impersonal). Straight quotes `'…'` and
`"…"`, as in the source. Brazilian spelling and vocabulary throughout.

**French (`fr`) — France French.** Address the learner as **tu**, never *vous* (settled
convention for this app). French typography is enforced:

- A **non-breaking space (U+00A0)** before `?`, `!`, `:` and `;`, and inside `« »`.
- Convert quoted spans to guillemets where the source used `'…'` or `"…"` around
  target-language material: `'{1}'` becomes `« {1} »` — that is, `«`, U+00A0,
  `{1}`, U+00A0, `»`. Write the real U+00A0 character, not the escape.
- Typographic apostrophe `’`, not `'`, inside French words (l’imparfait, n’est).

## How to run

1. Read your batch file. It is a JSON array.
2. Write your output to the path you are given: a **single JSON object** mapping the item's
   `id` (as a string key) to the translated frame string. Every id in the batch must be
   present exactly once.
3. Write the file with a script (python/node) rather than by hand, so the JSON is valid and
   the U+00A0 characters survive.
4. Reply with only: `<count> ids written`. Nothing else.

## Quality bar

These are read by learners mid-round, so they must be short, plain and immediately clear.
Do not expand a five-word Spanish fragment into a full sentence. Do not add teaching that
is not in the source. When the Spanish is terser than the English, follow the Spanish
length and the English meaning.

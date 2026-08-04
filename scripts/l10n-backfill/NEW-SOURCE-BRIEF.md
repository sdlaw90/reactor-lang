# SquirreLingo — standing up a new source language

You are localizing a language-learning app for speakers of a **source language** who are
studying some **target language**. The app shows the question in the target language and
carries the source language underneath — as a subtitle, as the answer choices, and in the
explanation after the answer.

## The unit you are translating

Each item is a **frame**: text with numbered placeholders `{1}`, `{2}` standing in for spans
that must NOT be translated. Those spans are target-language material — a conjugated verb
form, a vocabulary word, an idiom in the language being learned. They are substituted back
verbatim after you are done.

```json
{"id": 18356, "from": "es", "track": "de-for-en", "cat": "fvocab", "field": "options",
 "src": "maestro", "en": "teacher", "n": 9, "slots_example": []}
```

- `src` — **your source text**, in the language named by `from` (`es` Spanish or `fr` French).
  Both are already shipped and reviewed-in-shape, so matching their register and length keeps
  the app consistent.
- `en` — the English original. Use it as the **authority on meaning**, especially where `src`
  is terse or left an English word untranslated. Do not copy a mistake.
- `track` — `de-for-en` means German is the **target** being taught, `ja-for-en` Japanese, and
  so on. `cat`: `vocab` words · `verbo` conjugation drills · `gram` grammar points ·
  `trad` idioms/translation · `fvocab` Word Bank.
- `slots_example` — one real set of placeholder values, so you can see the sentence as it
  actually reads. Never put these in your output.
- `n` — how many places reuse this frame. Ignore it.

## The six fields, and what each one has to be

| `field` | what it is | how to translate it |
|---|---|---|
| `options` | **an answer choice on a multiple-choice question** | A word or short phrase, not a sentence. Same length and register as `src`. **This is the one a learner taps** — it must read as a plausible answer, and it must stay *different* from the other choices on its question. |
| `promptNative` | the subtitle under the question | Short. Usually `'<target word>' means…` shape. |
| `prompt` | the question itself, for translation-category items | Keep it a question/instruction, same shape. |
| `distractorNotes` | a note on one specific wrong choice | A **fragment**, not a sentence — "the nosotros form", "close, but the fixed idiom ends…". Keep it a fragment. |
| `wrongNote` | the general "heads up" on any wrong answer | One clause or one short sentence. |
| `explain` | the explanation of the right answer | Follow `src` for length. Do not add teaching that is not there. |

## Hard rules

1. **Every placeholder in `src` appears exactly once in your output, unchanged.** Same set,
   same spelling: `{1}`, `{2}`. Never add, drop or renumber one. Checked mechanically; a
   mismatch rejects the whole batch.
2. **Never translate what a placeholder stands for.** It is target-language material.
3. **Keep target-language words that appear unquoted in the frame verbatim** — grammatical
   term names in the target language (`passato prossimo`, `Konjunktiv II`, `batchim`),
   particles (`を`, `-습니다`), and target-language examples. Translate only the framing.
4. **Translate grammatical vocabulary that is in Spanish, French or English** — "la forma de
   nosotros", "présent du subjonctif", "the nominative form" — using the standard grammatical
   terminology of your language.
5. **Keep the punctuation and capitalisation shape**: leading/trailing spaces, `—`, `…`, the
   final period or its absence. Fragments stay fragments.
6. Output **only** the translation. No commentary.

## Register and typography

**Italian (`it`) — standard Italian, Italy.** Address the learner as **tu**, never *Lei*.
Straight quotes `'…'` and `"…"` as in the source; Italian does not take a space before `?`
or `!`, so **strip the non-breaking space** if you are translating from French. Use the
typographic apostrophe `’` inside Italian words (dell’, l’, un’). Warm and plain — this app
is built for people who get overwhelmed by dense text, so short beats clever.

Grammar terms to use consistently: *presente · passato prossimo · imperfetto · trapassato
prossimo · futuro semplice · condizionale · congiuntivo · imperativo · participio · gerundio ·
infinito*; persons *io · tu · lui/lei · noi · voi · loro*; cases *nominativo · accusativo ·
dativo · genitivo*; *maschile / femminile / neutro*, *singolare / plurale*.

## Product vocabulary — keep consistent

`SquirreLingo` (never translated) · **corso** for a track/course · **round** (invariable) for
one short set of questions · **serie** for a streak · **Banca delle parole** for the Word Bank ·
**Palestra di grammatica** for the Grammar Gym · **fonetica** for the phonetics category ·
**test di livello** for placement.

## How to run

1. Read your batch file (a JSON array).
2. Write a **single JSON object** mapping each item's `id` (as a string key) to its translated
   string. Every id in the batch, exactly once.
3. Write it with a script, not by hand, so the JSON is valid and any special characters
   survive.
4. Reply with only `<count> ids written`.

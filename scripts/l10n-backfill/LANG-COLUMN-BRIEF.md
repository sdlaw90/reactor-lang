# SquirreLingo v3.4 — #72 UI string column

You are adding one language column to SquirreLingo's UI strings. These are **interface**
strings a learner reads inside the app: buttons, headings, the guided tour, skill-level
names, category labels, toasts.

## Input / output

Your input file is a JSON array. Each entry looks like:

```json
{ "i": 3, "line": 28, "en": "Pick a language", "es": "Elige un idioma" }
```

Write an output JSON array of **the same length, in the same order**, where each entry has
its `"i"` plus your language key and nothing else is required:

```json
[ { "i": 3, "it": "Scegli una lingua" }, ... ]
```

`en` is the authority on meaning; the other languages present show the register and length
the app already uses. Match them.

## Rules

1. **Same length, same order, every `i` present.** The injector matches by position and
   refuses the whole file on a count mismatch.
2. **Never translate tokens that are contracts**: role words (`admin`), API action values
   (`set_password`, `ban`), object/data/field keys, route paths, CSS values, developer-log
   strings. Translate only what a user sees on screen. If an entry is clearly one of these,
   return it unchanged.
3. **Preserve placeholders and markup exactly** — `{count}`, `{name}`, `%s`, `*emphasis*`,
   `\n`, and any HTML-ish tags. Same set, same spelling.
4. **Preserve the punctuation and capitalisation shape** of the source, including a trailing
   `…` or `!` or its absence.
5. If a value in the input is wrapped in `«NON-LITERAL: …»`, it is a template literal or
   expression rather than a plain string — **skip that entry**: return it with the language
   key set to the English text unchanged, and mention its `i` in your reply.

## Register per language

- **Italian (`it`)** — address the learner as **tu**. Standard Italian (Italy). Warm and
  plain; this app is built for people who get overwhelmed by dense UI, so short beats clever.
- **Brazilian Portuguese (`pt`)** — **você**, Brazilian spelling and vocabulary.
- **French (`fr`)** — **tu**, never *vous*. French typography is enforced: a **non-breaking
  space (U+00A0)** before `?`, `!`, `:` and `;`, guillemets `«` U+00A0 … U+00A0 `»` for
  quoted text, and the typographic apostrophe `’`. Write the real U+00A0 character.

## Product vocabulary — keep these consistent

`SquirreLingo` (never translated) · a **track** is a course/language you study · a **round**
is one short set of questions · **streak** · **Word Bank** · **Grammar Gym** · **fono** is the
phonetics category · **placement** is the level-check quiz.

Write the output file with a script so the JSON is valid and U+00A0 survives. Reply with only
`<count> entries written`.

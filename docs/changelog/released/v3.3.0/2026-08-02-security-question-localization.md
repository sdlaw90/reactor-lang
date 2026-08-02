# 2026-08-02 — Security questions render in the user's own language

_Folds into the **3.3.0** release entry._

## User-facing
- **Portuguese users were choosing their security questions from ten English sentences.** The
  picker sat inside an otherwise-Portuguese form on both the beta-apply flow and Settings. All
  ten questions now render in Portuguese, and in French ahead of the v3.3 flip.
- **The password-reset flow showed the questions in English to everyone** — including Spanish
  users who had picked them in Spanish. It now renders in the viewer's language.
- No effect on account recovery. Answers are stored and compared by `key`, never by label, so
  nobody was ever locked out by this. Existing answers keep working untouched.

## Internal

### The bug
`questionLabel(key, lang)` in `lib/securityQuestions.js` was hardcoded to a single language:

```js
if (lang === "es" && q.label_es) return q.label_es;   // Spanish or English. Nothing else.
return q.label || key;
```

Every row carried `label_es` and nothing else, so adding `label_pt` would have done nothing —
the resolver ignored any key it wasn't literally spelled to look for. Live on `main` since
2026-07-27 via `lib/SettingsPanel.js:681` and `app/beta-apply/page.js:488`.

The reset flow was a separate, wider failure: `app/forgot-password/page.js` rendered `q.label`
straight off the API response, bypassing the resolver entirely, so it was English for **all**
users regardless of language.

### The fix
- **Resolver is now generic:** `q["label_" + lang] || q.label || key`. Adding a source language
  is adding rows — no resolver change, and no repeat of this bug shape.
- **`label_pt` + `label_fr` added to all ten rows.**
- **`app/forgot-password/page.js`** renders `questionLabel(q.key, uiLang)`. **The API contract is
  unchanged** — `/api/password-reset` already returned `key` alongside `label`, so the client had
  everything it needed. The English `label` is still sent and still what the server reasons about.

### Translation notes
- **Portuguese is written to work either side of the Atlantic.** `uiLang` is a single `"pt"`
  covering pt-BR and pt-PT, so the strings avoid constructions that split:
  - "In what city were you born?" → *"Qual é a sua cidade de nascimento?"* — a noun phrase,
    dodging `nasceu` (BR) vs `nasceste` (PT).
  - "What street did you live on as a child?" drops the subject pronoun entirely.
  - **"Childhood nickname" avoids `apelido`**, which means *nickname* in Brazil but *surname* in
    Portugal (where it's `alcunha`). Rendered as *"Que nome usavam para te chamar na infância?"*
    — unambiguous in both. Decision: Sean, 2026-08-02.
- **French avoids gender agreement.** "Oldest friend" is *"ta plus ancienne amitié"*, mirroring
  the Spanish *"tu amistad más antigua"*, rather than `ton ami(e) le/la plus ancien(ne)`.
  Register is `tu` throughout, per the standing app-voice rule.
- **French uses NBSP (U+00A0) before `?`**, matching the repo convention — verified 28/28 in
  `lib/playStrings.js`.

### Why the standing sweep missed it — process gap, not just a code gap
The offering-flip AST sweep flags objects carrying `en` **plus another language code**. These are
**prefixed** keys — `label_es`, `label_pt` — so the sweep is structurally blind to them. That is
how this survived two releases and a standing checklist.
`claude/squirrelingo_offering_flip_checklist.md` still needs a step for `<key>_<lang>` shapes;
adding it is tracked separately.

### Review status
**The pt and fr strings are AI-authored and have NOT been through the #41 lane.** Twenty strings
total; they belong in the pt and fr review piles. The English originals are unchanged.

### Verification
`npm run build` compiles · `npm run lint` 0 errors · all four touched files JSX-parse under
esbuild · `questionLabel()` exercised across `en`/`es`/`pt`/`fr` plus undefined-lang,
unknown-lang and unknown-key paths — 0 unexpected English fallbacks, English fallback intact
where it should be.

# 2026-07-25 — English course built out to full depth (US + UK, for Spanish speakers)

## User-facing
- **English is now a full course, not a starter set.** If your native language is
  Spanish, both **American English** and **British English** now have hundreds of
  questions across vocabulary, grammar, phrases and pronunciation — up from the
  handful of starter items before. It covers what actually trips Spanish speakers
  up: false friends (*embarrassed* isn't *embarazada*, *library* isn't *librería*),
  the prepositions and tenses that don't map from Spanish (*for* vs. *since*,
  present perfect vs. past), real idioms, and the fast reduced/connected speech
  ("gonna", "whaddya", the dropped British R) that makes native English hard to
  follow. British English gets genuinely distinct content (flat/lift/lorry, "in
  hospital", cheers/knackered, non-rhotic sound), not an American reskin.

## Internal
- **Rebuilt (data-only — no code, schema, or migration change):**
  - `data/tracks/enUsForEs.js` — American-English-for-Spanish-speakers, now **~854
    items** (vocab 133 / gram 519 / trad 125 / fono 77), up from ~10. arity-5 bank
    items, `{en,es}` explanations, `correctIdx` 0, full A1–C2 spread.
  - `data/tracks/enGbForEs.js` — British-English-for-Spanish-speakers, now **~850
    items** (vocab 131 / gram 518 / trad 122 / fono 79). arity-6 bank items — the
    English-facing `promptEn` is present on every item, since this track is also
    surfaced to English natives as a US/UK comparison.
  - Both keep their exact track-object shape (`sourceSpecific: true`, CATS,
    `extraBank` fono map, config); the app auto-picks-up the enlarged
    `BANK`/`FONO_BANK`, so **no registration or resolver change**. `node --check`
    clean; both track objects load + validate at runtime (0 shape problems, 0
    `correctIdx`≠0, all UK `promptEn` present).
- **How it was built:** a 58-agent fan-out (US+UK × vocab/grammar/trad/fono ×
  CEFR-banded topic chunks) → deterministic dedup + shape/CEFR validation →
  spliced into the two files by a generator. Grammar was pushed to the full
  ~515/track per decision; English isn't inflection-heavy, so that count leans on
  broad grammar-point coverage × instantiations, not padding.
- **Native review owed (#41):** all AI-authored for Latin American Spanish
  speakers → route to the LatAm reviewer (Spanish framing + English pedagogy). The
  two file headers carry the pending-review note.
- No new dependencies, no lockfile change. Data-only; no build/deps verification
  needed beyond `node --check` + runtime load (done).
- No version bump here — folds under the **3.1.1** release per the ledger/roll-up
  plan (`lib/version.js` stays owned by the ledger chat).

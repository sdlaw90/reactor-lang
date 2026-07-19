# 2026-07-14 — Korean track Word Bank (koForEn fvocab)

## User-facing
- The Korean course now has a **낱말 (Natmal)** Word Bank category: 609
  frequency-ranked words spanning A1–C2, each drilled both ways (recognize the
  Korean → pick the meaning, and produce the Korean from an English prompt).
- Every entry shows hangul with Revised-Romanization alongside it, matching the
  rest of the Korean course.

## Internal
- New `data/vocab/koWords.js` — 609-word curated frequency list, tuple
  `[word, gloss, pos, tier, note?]`, mirroring `jaWords.js` conventions (hangul
  + RR packed in the word field, English-only glosses/notes, `adj` = descriptive
  verbs in dictionary `-다` form, `x` = pronouns/counters/particles/set phrases).
  Tier spread A1:67 A2:117 B1:161 B2:123 C1:95 C2:46. ~50% of entries carry a
  teaching note (irregular conjugations, honorific alternates, Sino-vs-native
  numbers, homophones, counters).
- `koForEn.js` wired to build `fvocab` via `buildFrequencyBank(WORDS, { seed:
  20260714, formulas: KO_FORMULAS })`; added `CATS.fvocab` (낱말, #7BE495) and
  `wbCatId: "fvocab"`.
- `KO_FORMULAS` recognition frame `'X'은/는 무슨 뜻이에요?` computes the topic
  particle from the headword's final batchim ((code − 0xAC00) % 28 ≠ 0 →
  consonant → 은, else 는), matching the curated vocab deck's converged prompt.
  Production frame quotes the English gloss with a comma (no particle);
  flagged for a native `<lang>` SSML span at the ko TTS pass.
- Curated vocab headwords deliberately excluded from koWords so no word appears
  in two categories (removed Sino-number 일 during wiring — it collided with the
  curated 일 "work"; the Sino series is preserved in the 이 note).
- Validated against the real generator: 0 words skipped (every word resolves 3
  same-pos distractors), no duplicate options anywhere in the bank, all
  correctIdx 0, all 4-option, no cross-category leak.

## Downstream (not in this delta)
- ko TTS pass (separate chat): run `voices:list` for ko-KR first; add `koForEn`
  to `VOICE_KEYED_TRACKS`; the production frame's English gloss needs a native
  `<lang>` span. Then `ru` deepening is next in the track queue.

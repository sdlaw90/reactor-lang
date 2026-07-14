# 2026-07-13 — Japanese (jaForEn) deepening pass + Word Bank

## User-facing
- Japanese track deepened 36 → 792 questions: 79 curated (vocab 26, gram 23,
  trad 18, fono 12 pairs) + 713-word Word Bank in the new 「言葉 (Kotoba)」
  category.
- All six CEFR tiers covered in vocab/gram and the Word Bank; trad and fono
  span A2–C2 (idioms and pitch-accent pairs aren't A1 material — A1
  placement sampling is carried by vocab, gram, and the 60 A1 bank words).
- English subtitles (promptNative) under every Japanese-language prompt,
  including the fono identify/respond prompts.
- Eight new pronunciation pairs: long vowels (obaasan/obasan), gemination
  (kitte/kite), devoiced 好き, the tapped r, ame/áme and hashi pitch pairs,
  bilabial ふ, syllabic ん mora counting, and a C2 hedged-contour
  listening item.
- New curated C1/C2 material: honne/tatemae, 空気を読む, keigo verb swaps,
  the suffering passive, causative-passive, は/が.

## Internal
- Prompt frames converged to the target-language convention
  (はどういう意味ですか / 日本語で何と言いますか), matching
  significa/bedeutet. The old English frames live on as promptNative
  subtitles. No shipped TTS for ja, so no clip-key impact.
- Conventions locked: word field packs "漢字 (romaji)"; macron-free wapuro
  Hepburn (arigatou, not arigatō); ASCII quotes around headwords, not 「」;
  kanji at every tier with romaji always present. The romaji parenthetical
  is the intended-reading record for the TTS pass (heteronyms: 今日, 明日,
  空, 十人十色's toiro).
- JA_FORMULAS in the track file per DE_FORMULAS precedent; no
  capitalization pass. Word Bank seed 20260713; wbCatId "fvocab", label
  「言葉 (Kotoba)」, color #7BE495 (de/fr parity).
- jaWords.js: 713 tuples (A1 60 / A2 123 / B1 184 / B2 188 / C1 111 /
  C2 47), 0 skipped by the thin-distractor guard, deterministic rebuild
  verified, 0 duplicate-option questions. Near-synonym pairs (急に/突然,
  ちゃんと/しっかり, つまり/要するに, 意外と/案外, だんだん/徐々に)
  deliberately share a gloss token so the overlap filter keeps them out of
  each other's distractor pools.
- questionTime stays 35s (vs de's 30s) — script-reading headroom,
  deliberate.
- TTS pass reminders (fresh chat): run voices:list for ja-JP FIRST;
  'X は日本語で…' production rule needs the native <lang>-span SSML
  analogue of ¿Cómo se dice…? / Wie sagt man…?; prod upload rides the
  sync job only.

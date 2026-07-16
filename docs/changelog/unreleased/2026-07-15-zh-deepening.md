# zh deepening + Word Bank (2026-07-15)

## User-facing
Mandarin goes deep: the Mandarin Chinese track grows from 36 to 699 questions, with all six difficulty tiers covered — C1 and C2 are brand new to the track — English subtitles under every Chinese prompt, and its own 621-word Word Bank in the new 「词库 (Cíkù)」 category, every word carrying hanzi, pinyin, and teaching notes on the tricky readings. Pronunciation practice is much deeper too: tone sandhi (the 3rd+3rd shift plus the special 一 and 不 tone changes and the half-third tone), retroflex initials, 儿化, and neutral-tone minimal pairs where the tone alone changes the meaning (东西 = "east-west" vs. "a thing").

## Internal
- **New file `data/vocab/zhWords.js`** — 621 frequency-ranked tuples `[word, gloss, pos, tier, note?]`, word field = `汉字 (pīnyīn)` with citation tones (sandhi never pre-applied). Excludes pure particles, bare measure words, and the 24 curated headwords. Tier split: A1 111 / A2 149 / B1 141 / B2 120 / C1 65 / C2 35.
- **WB wired** via `buildFrequencyBank(WORDS, { seed: 20260715, formulas: ZH_FORMULAS })` → `fvocab` category; `wbCatId: "fvocab"`. `ZH_FORMULAS` is no-cap (word field is script + pinyin) with target-language prompt frames (`是什么意思` / `用中文怎么说`), English in `promptNative`.
- **Curated reframed** to the target-language convention: recognition prompts moved to `'X (pinyin)' 是什么意思？` with the English "means…" frame relocated to the `promptNative` subtitle; vocab/gram entries converted 5-slot → 7-slot. trad stays 5-slot (English "Translate:" prompt). fono extras gained `identifyPromptNative`/`respondPromptNative`.
- **Curated volume:** vocab 12→24, gram 9→18, trad 7→16, fono 4→10 pairs = 78 curated across all six tiers (C1/C2 were previously absent).
- **Cleanups:** dropped the redundant grammar-adjacent sandhi item (covered far better in the deepened fono set); fixed the awkward double-了 completed-action item → `我买了一本书`.
- **Smoke-tested** through the real generator: 0/621 words dropped, 0 duplicate-option questions, 4 options with answer at index 0 throughout, all tiers represented.
- **No version bump / no version files** — dev-bound deepening delta. `lib/version.js` bumps at the next batched ledger release (which now carries ru + ko + zh). TTS is a separate later pass: run `npm run voices:list -- --locale zh-CN` FIRST; watch tone rendering and the en↔zh `<lang>` handoff in the `用中文怎么说` production prompts.

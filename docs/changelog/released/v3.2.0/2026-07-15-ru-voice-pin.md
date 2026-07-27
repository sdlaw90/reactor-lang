# ru voice pinned — ru-RU-Wavenet-A

## User-facing
None yet (dev-only until the ru track's audio ships to prod).

## Internal
- `TRACK_VOICES.ruForEn` pinned to `ru-RU-Wavenet-A` (female), replacing the
  hard-fail placeholder.
- **ru is the first track NOT on Neural2.** `voices:list ru-RU` (2026-07-15)
  returns only Chirp3-HD (no SSML/rate — unusable), Standard, and Wavenet —
  Google ships no ru-RU Neural2. Wavenet is the best SSML-compatible family and
  honors the pipeline's `<lang>`/`<break>`/`<sub>` + `speakingRate` (0.92).
  Females A/C/E, males B/D; A chosen to match the cross-track female-A default.
  Audition-swappable via `--voice`.
- Extraction validated against the live track + generated WB: **246 unique
  clips** (vocab 25, gram 19, trad 14, fvocab 188), no key collisions. Branch
  split: 137 target-voice as-is, 94 production (ru frame + en-US gloss span),
  14 native (trad `Translate:` → en-US), 1 benign review flag
  (`gram-2 'Стол' — какого рода?`). All 94 WB production prompts matched the ru
  `production` regex — no fall-through.

## Next
- `--track ruForEn --dry-run` on your machine to see the same counts, then
  `--track ruForEn --upload` against dev. Prod rides `sync-tts` at the ledger
  release (bump `lib/version.js`, roll up the ru fragments).

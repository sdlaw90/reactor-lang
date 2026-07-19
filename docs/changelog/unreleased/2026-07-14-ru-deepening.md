## User-facing
- The Russian track is now much deeper. Vocabulary, grammar, and idiom/proverb
  practice have all roughly doubled, content now spans the full A1–C2 range, and
  a new Word Bank adds 188 frequency-ranked words to learn.
- Every Russian prompt now shows an English subtitle at lower skill levels.

## Internal
- ruForEn.js #38 deepening pass. Curated deck 36 → 58 standard items
  (vocab 12→25, gram 9→19, trad 7→14), extended to C1 + first C2 content,
  promptNative (slot 7) added to all vocab/gram items (trad stays 5-slot per
  the ko convention — English prompt needs no native subtitle). FONO_BANK 4→9
  (added что→"shto", -его→"yevo", ы/и contrast, final devoicing, щ).
- New Word Bank: data/vocab/ruWords.js (188 words, A1–C2, tuple
  [word, gloss, pos, tier, note?]), wired via buildFrequencyBank + RU_FORMULAS
  (seed 20260714). fvocab category added to CATS; wbCatId: "fvocab".
- ru WB convention: LOWERCASE headwords (RU_FORMULAS does NOT cap() — teaches
  true orthography; deliberate divergence from the es/fr default). Cyrillic is
  phonetic → no romanization parenthetical; ruWords excludes curated headwords.
- Verified: ESM parse OK on both files; WB generates 188/188 questions
  (0 skipped, 0 dup-option, 0 malformed). Full npm ci + Next build NOT run here
  (only the track/vocab files were in scope, not the repo) — run at integration.
- TTS pass pending (fresh chat): run voices:list for ru-RU FIRST, add ruForEn
  to VOICE_KEYED_TRACKS (voice-keyed from day one), expect the ko no-subReading
  pattern (Cyrillic phonetic like hangul). Prod rides sync-tts; no manual upload.

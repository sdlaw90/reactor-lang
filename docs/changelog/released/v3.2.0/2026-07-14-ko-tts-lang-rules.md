# ko TTS pass — LANG_RULES + generator wiring

## User-facing
- Korean (koForEn) question prompts can now be spoken aloud (speaker button /
  Settings → Gameplay audio toggle), once the ko clips are generated and
  synced. Hangul is read by a native ko-KR voice at learner-friendly speed;
  the romanization stays on-screen only and is never read aloud.

## Internal
- `scripts/generate-tts.mjs`: added the `ko` entry to `LANG_RULES` (keyed by
  `track.targetLang`), registered `koForEn` in `VOICE_KEYED_TRACKS` (voice-
  keyed from day one), and added a provisional `TRACK_VOICES.koForEn`
  (`ko-KR-Neural2-A`).
- New `stripKoreanReadingParens`: two-pass Revised-Romanization strip. Pass (a)
  removes parens whose preceding substantive char is hangul (headword
  readings, RR trailing hangul directly); pass (b) removes a final paren when
  hangul appears earlier in the prompt — catches the gram shape that places an
  English em-dash hint between the hangul and its trailing RR paren
  (`학교___ 가요. — "I go TO school" (Hakgyo___ gayo.)`), which pass (a) misses.
  trad `Translate: '...' (note)` prompts carry no hangul, so their English note
  survives and is spoken native — matching ja.
- No `subReading` (deliberate divergence from ja): hangul is phonetic, so
  ko-KR TTS reads headwords correctly, including standard batchim
  liaison/assimilation. The fono category that teaches those changes is
  `extraBank` and already excluded from synthesis.
- Recognition `'X'은/는 무슨 뜻이에요?` → target voice, spoken as-is (particle
  sits flush against the closing quote, so quoteDetect reads false and it
  never review-flags). Production `'X', 한국어로 뭐라고 해요?` → the English
  gloss gets a native `<lang>` span.
- es/fr/de/ja rules untouched — additive change only, so existing tracks need
  no `--force` re-synthesis.
- Provisional voice: `ko-KR-Neural2-A` is a placeholder pending `voices:list`
  for ko-KR (standing rule). `verifyVoices` hard-fails before any paid
  synthesis if the voice isn't live; override with `--voice` and update
  `TRACK_VOICES` once the variant is auditioned.

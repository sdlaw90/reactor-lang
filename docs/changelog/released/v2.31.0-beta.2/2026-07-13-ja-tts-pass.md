# Japanese TTS pass (pipeline support)

## User-facing

(None yet — Japanese audio rides the release that deploys it, same as the
pending German audio entry.)

## Internal

- `scripts/generate-tts.mjs`: Japanese language rules added.
  - `ja-JP-Neural2-B` default voice (Neural2 confirmed live 2026-07-13;
    Chirp3-HD incompatible per standing rule).
  - Spoken-text derivation strips romaji reading parentheticals (CJK-context
    rule); keys still hash the raw prompt — client key derivation unchanged.
  - Universal heteronym handling: quoted kanji headwords get an SSML
    `<sub alias="hiragana">` converted from the romaji parenthetical;
    wapuro-Hepburn→hiragana converter hard-fails the run on any
    unconvertible reading (658/658 bank readings verified).
  - English hint tails on gram cloze prompts get native `<lang>` spans;
    CJK-free prompts (keigo scenarios) synthesize whole with the native
    voice.
- **Voice-keyed filename schema debuts** (`{hash}-{voiceName}.mp3`), gated
  to jaForEn via `VOICE_KEYED_TRACKS`; es/frCa/de stay plain-keyed until
  the sync-job session re-keys them. Manifest gains top-level `keySchema`
  and per-clip `f` (filename).
- `lib/AudioButton.js`: clip URLs now resolve through the manifest's `f`
  field (fallback `{key}.mp3` for pre-`f` manifests) — filenames are never
  constructed client-side, so plain and voice-keyed schemas both play and
  the sync-job re-key of es/frCa/de needs no further client change.
- es/fr/de SSML output verified byte-identical old-vs-new (snapshot
  harness) — no `--force` needed for esForEn, frCaForEn, or deForEn.
- `scripts/sweep-tts.mjs` (new): orphan sweep — deletes bucket clips not
  claimed by the local manifest (report-only by default, `--delete` to
  act). Added after an accidental stale upload; also the runbook's
  promised occasional-sweep tool, and keeps the sync-job parity
  smoke-check honest.
- `docs/tts-pipeline.md`: Japanese section added; sweep documented.
- Prod deploy of ja audio rides the TTS sync job only — no manual prod
  upload.

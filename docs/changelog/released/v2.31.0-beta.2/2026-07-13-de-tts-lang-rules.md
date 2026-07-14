## User-facing
None. (Speaker button appears on deForEn questions once clips are uploaded and audio playback UI covers the track — verify in dev like frCa.)

## Internal
- TTS pipeline: German `LANG_RULES` entry (`'X' bedeutet...` recognition incl. offset variants; `Wie sagt man 'X' auf Deutsch?` production with native `<lang>` span; fr-style greedy/boundary-aware quote handling so articles-in-headwords and `one's`-style glosses neither truncate nor flag).
- `TRACK_VOICES`: `deForEn → de-DE-Neural2-G` (female; Neural2-A/B retired in a Google voice refresh — preflight caught it). Runbook now warns per-track voice re-verification is mandatory and that Chirp/Chirp3-HD voices are pipeline-incompatible (no SSML/speakingRate support).
- es/fr rules untouched — additive-only diff + snapshot harness verified; no `--force` needed for esForEn/frCaForEn.
- `docs/tts-pipeline.md`: German specifics section.
- deForEn audio generated and uploaded to the dev bucket (run locally per runbook). Prod deploy deferred to the TTS sync CI job per the zero-manual-effort release rule.

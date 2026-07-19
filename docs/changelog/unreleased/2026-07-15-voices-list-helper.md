# voices:list — real command for the TTS voice-preflight step

## User-facing
None (developer tooling).

## Internal
- `scripts/voices-list.mjs` (new) + `package.json` script `voices:list`. Until
  now "run voices:list for <locale> FIRST" was a documented step name with no
  implementation — the only voice query lived inside `generate-tts.mjs`'s
  `verifyVoices()` preflight, so listing voices meant triggering a deliberate
  preflight failure or curling the endpoint by hand. This makes it a command:
  - `npm run voices:list -- --locale ru-RU`
  - `--ssml-only` filters to SSML-compatible families; `--json` for scripting;
    comma-separated locales supported (`--locale es-US,fr-CA`).
  - Prints name, gender, sample rate, sorted, and flags Chirp/Chirp3-HD voices
    as unsuitable (they ignore SSML + speakingRate, which this pipeline emits —
    same reason jaForEn skipped Chirp3-HD).
  - Reuses generate-tts's `.env.local` loader and the same
    `/v1/voices?languageCode=` endpoint; reads `GOOGLE_TTS_API_KEY`. Read-only,
    no synthesis, no cost. Exits non-zero if no locale could be listed.
- No dependency change (node builtins + global fetch), so no lockfile regen.
- Unblocks the ru voice pin, and reusable for zh next + demoting the koForEn
  provisional.

# TTS pipeline runbook (esForEn pilot + frCaForEn)

Pre-generated audio clips per question prompt, synthesized once via Google
Cloud TTS, stored in the Supabase `tts-audio` bucket. Decided 2026-07-11
(TTS spike): batch pre-generation beats browser SpeechSynthesis (no dialect
control) and per-play APIs (unpredictable cost, latency, breaks offline).

## One-time setup

1. **GCP**: create a project → enable the Cloud Text-to-Speech API → create
   an **API key restricted to the TTS API only**. Free tier (1M chars/mo for
   Neural2/WaveNet, renews monthly) covers the entire catalog; the esForEn
   pilot is ~22K chars ≈ $0.
2. **Supabase**: apply migration `00000000000014_tts_audio_bucket.sql`
   (public-read bucket; writes are service-role-only — no client policies).
3. **`.env.local`** (never committed, never in Vercel env — the app itself
   never talks to GCP, and the service role key is script-only):

   ```
   GOOGLE_TTS_API_KEY=...
   NEXT_PUBLIC_SUPABASE_URL=...        # already present
   SUPABASE_SERVICE_ROLE_KEY=...       # from Supabase dashboard → API
   ```

## Generating

```
node scripts/generate-tts.mjs --track esForEn --dry-run   # counts + review flags, no spend
node scripts/generate-tts.mjs --track esForEn --limit 10  # audition a small batch first
node scripts/generate-tts.mjs --track esForEn             # full local generation
node scripts/generate-tts.mjs --track esForEn --upload    # generate missing + push to bucket
```

Flags: `--voice` (default comes from the per-track `TRACK_VOICES` map in the
script — `es-US-Neural2-A` for esForEn, `fr-CA-Neural2-A` for frCaForEn),
`--native-voice` (default `en-US-Neural2-C`), `--rate` (default `0.92`,
slightly slow for learners), `--limit N`, `--force`, `--dry-run`, `--upload`.

Before any paid synthesis the script verifies both configured voices exist
for their exact locales (voices-list preflight) and hard-fails otherwise —
it will never quietly substitute a neighboring dialect (fr-CA falling back
to fr-FR would defeat the dialect positioning). New tracks: add their
default voice to `TRACK_VOICES` once the audition picks a variant.

Output: `tts-output/<track.id>/<key>.mp3` (gitignored) plus `manifest.json`
(every key → spoken text + voice kind). Bucket layout mirrors it:
`tts-audio/<track.id>/<key>.mp3`.

## How clips are identified

`lib/audioKey.js` hashes the normalized spoken text (cyrb53 → base36).
Question ids are positional and shift when content is inserted; text hashes
don't, dedupe identical prompts, and make re-runs idempotent (only new or
changed prompts are synthesized). After a content pass, just re-run with
`--upload` — new prompts get clips, unchanged ones are skipped, and clips
orphaned by removed questions are harmless leftovers (sweep occasionally).

**--force is required when:** SSML rendering logic changes (pauses, lang
spans), a prompt's voice classification changes, or the voice/rate flags
change — keys hash the raw text only, so idempotent runs won't refresh
those clips.

## Language handling

Prompt-shape rules are per-language (`LANG_RULES` in the script, keyed by
`track.targetLang`; tracks without one fall back to the es pilot rules).
Shared rules, all tracks:

- Prompt-only. Options, explanations, and `promptNative` are not spoken.
- Production prompts (`¿Cómo se dice 'X' ...?` / `Comment dit-on 'X' en
  français?`) → X wrapped in a native-locale SSML `<lang>` span.
- `Translate: '...'` (trad) → whole prompt synthesized with the native voice.
  Known wart: a target-language parenthetical like `(coloquial)` inside one
  comes out English-accented — one word, accepted.
- Cloze gaps `___`/`_____` → 500ms pause.
- Any other prompt with a true quoted span → generated as-is with the target
  voice AND listed in `tts-output/<id>/review.txt` for a manual look.
- **fono extraBank is excluded**: speaking `item.text` would answer the
  identify question. Real listening exercises are the separate
  listening-module roadmap item.

French specifics (added at the frCaForEn pass, apply to frForEn too):

- Recognition shape is `'X' signifie...`, incl. multi-span variants like
  `'Bienvenue' comme réponse à 'merci' signifie...` — all quoted spans are
  French, spoken as-is, not flagged.
- Elision apostrophes (`t'as`, `c'est`, `l'école`) are orthography, not
  quotes: the review flag only fires on true `'...'` spans with word
  boundaries, and quoted-span matches are greedy so words/glosses with
  internal apostrophes (`l'école`, `one's`) parse correctly. The es pilot
  rules were left byte-identical — **esForEn needs no `--force` after this
  change** (verified by harness at the frCa pass).

## Per-track rollout checklist (when extending past the pilot)

1. Audit voice availability for the track's locale (Neural2 tiers vary by
   dialect; some locales may only have Standard/WaveNet voices) and pick
   `--voice` / `--native-voice`.
2. `--dry-run`, clear `review.txt` (add formulas to `toSSML` if a track
   introduces new prompt shapes).
3. `--limit 10`, listen, adjust `--rate`/voice.
4. Full run with `--upload`.

## Cost reality (from the spike — full detail in the cost estimator)

Generation: ~$0 (free tier renews monthly; whole 15-track catalog ≈
600–800K chars one-time). Storage: ~250–400MB across all tracks. Egress is
the only user-scaling number; clips ship with a 1-year immutable
cache-control so repeat plays hit browser cache.

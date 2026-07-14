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
orphaned by removed questions are harmless leftovers. Sweep them with
`node scripts/sweep-tts.mjs --track <name>` (report) then `--delete` —
it removes every bucket clip the local manifest doesn't claim, so run it
only after a fresh, complete generate run. Sweep BEFORE the sync job's
bucket-parity smoke-check exists in CI, or orphans will trip it.

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

German specifics (added at the deForEn pass):

- Recognition shape is `'X' bedeutet...`, and the match tolerates words
  between the quoted span and `bedeutet` (`'Doch!' als Antwort bedeutet...`,
  `'Handschuh' bedeutet wörtlich "hand shoe", aber wirklich...`) — everything
  before `bedeutet` in those shapes is German, spoken as-is, not flagged.
- Production shape is `Wie sagt man 'X' auf Deutsch?` — X is the English
  gloss, wrapped in a native `<lang>` span like the es/fr formulas.
- Quoted-span handling reuses the fr greedy + boundary-aware rules: German
  headwords are stored in dictionary casing **with their article**
  (`'der Termin'`) per the track's capitalization convention, and glosses can
  carry internal apostrophes (`one's`) — neither truncates a match or trips
  the review flag. Casing is passed through untouched (it's grammatically
  meaningful in German); TTS pronunciation is unaffected either way.
- Embedded double-quoted English inside a German prompt (`"hand shoe"`)
  comes out German-accented — same accepted wart class as the trad
  `(coloquial)` case.
- Default voice: `de-DE-Neural2-G` (female; `-H` is male). The Neural2-A/B
  voices previously noted as confirmed were **retired in a Google voice
  refresh** — the preflight caught it, exactly as designed. Standing caution
  for every future track: re-run the voices-list check at the track's own
  TTS pass; "confirmed at deepening time" can go stale.
- **Chirp / Chirp3-HD voices are incompatible with this pipeline**: they do
  not support SSML input or the speakingRate parameter, and the pipeline
  depends on both (`<lang>` spans, cloze `<break>` pauses, rate 0.92). If a
  future locale offers only Chirp-tier voices, that's a pipeline rework
  decision, not a voice-flag choice. Multi-voice support (e.g. adding
  Neural2-H) remains a deliberately deferred, separate work item.
- es and fr rules were untouched (verified additive-only diff + snapshot
  harness at this pass) — **no `--force` needed for esForEn or frCaForEn.**

Japanese specifics (added at the jaForEn pass):

- **Voice: `ja-JP-Neural2-B`** (female), rate 0.92. Neural2 B/C/D confirmed
  live 2026-07-13. The 30 ja-JP Chirp3-HD voices are ignored per the
  standing Chirp incompatibility (no SSML, no speakingRate).
- **Voice-keyed filename schema debuts here:** ja clips are named
  `{hash}-{voiceName}.mp3` (e.g. `abc123-ja-JP-Neural2-B.mp3`), gated by
  `VOICE_KEYED_TRACKS` in the script. es/frCa/de stay `{hash}.mp3` until
  the TTS sync-job session re-keys them and flips the set to all-tracks.
  The manifest carries `keySchema` plus a per-clip `f` (filename) field —
  **the client must resolve clip URLs via `f` and never construct
  filenames** (old manifests without `f` fall back to `{key}.mp3`). Hash
  derivation is unchanged: keys still hash the raw normalized prompt the
  client has, NOT the ja-transformed spoken text.
- **Romaji parentheticals are stripped from spoken text**: any ASCII
  `(...)` whose preceding non-space character (walking back past ASCII
  `?!._…` and cloze underscores) is CJK is a reading aid, not content —
  `'友達 (tomodachi)' はどういう意味ですか？(wa dou iu imi desu ka?)`
  speaks as `'友達' はどういう意味ですか？`. English content parens
  survive because they follow Latin text (`(said before eating)` in trad,
  `(duration)` inside a production gloss).
- **Heteronym kanji get an SSML `<sub>`**: every quoted recognition
  headword containing kanji is substituted with its intended reading —
  hiragana converted from the romaji parenthetical (`今日` speaks as きょう,
  never こんにち). Substitution is universal rather than list-curated: TTS
  guesses readings on isolated words, and the parenthetical is already the
  authoritative record. The wapuro-Hepburn→hiragana converter **hard-fails
  the entire run** on any romaji it can't fully convert (all 658
  kanji-bearing bank readings verified converting at this pass). The
  wapuro `n'` convention is load-bearing: ん before a vowel/y must be
  written `n'` (kan'youku) or it converts as な行/にゃ行.
- Recognition shape is `'X' はどういう意味ですか？` — the quoted span is
  target-language, spoken as-is (with the `<sub>` above), not flagged.
- Production shape is `'X' は日本語で何と言いますか？` — X is the English
  gloss, wrapped in a native `<lang>` span (¿Cómo se dice…? class).
- **English hint tails on gram cloze prompts** (`… — "IF it rains, I
  won't go"`) get a native `<lang>` span when the tail is CJK-free.
  Prompts with **no CJK at all** (the keigo scenario questions) are
  synthesized whole with the native voice, like trad.
- Accepted warts, same class as de's "hand shoe": short English embedded
  in a CJK prompt without an em-dash tail (`食べます means...`, `Which is
  true of は vs. が?`) comes out ja-accented.
- es, fr, and de rules and SSML output were untouched (verified by
  old-vs-new snapshot harness at this pass) — **no `--force` needed for
  esForEn, frCaForEn, or deForEn.**

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

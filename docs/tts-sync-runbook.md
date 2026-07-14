# TTS sync + smoke-check runbook

The final surface of the zero-manual-effort release chain. Merging **dev → main**
makes prod = dev across code (Vercel), DB schema (migrations), and storage/TTS
(the sync job). After the one-time setup below, prod audio needs no manual
touch ever again.

## The CI chain (on every `main` push)

`migrate-production` → `sync-tts` → `smoke-check`, wired in
`.github/workflows/supabase-migrations.yml`.

- **sync-tts** (`scripts/sync-tts.mjs`) — copy-only mirror, dev bucket → prod.
  Copies every `.mp3` prod is missing (filenames are content hashes, so a
  name that exists is byte-identical and skipped) and always re-copies each
  `manifest.json`. **Never deletes from prod.** Unreferenced clips are inert
  because the client resolves URLs through the manifest's per-clip `f` field
  and never builds filenames.
- **smoke-check** (`scripts/smoke-check.mjs`, checks 1-3 + workflow shell
  step for 4):
  1. prod `/version.json` is served (Vercel-lag miss is a warning, not a fail);
  2. **manifest-`f` parity** — every clip a dev manifest claims exists in prod
     (superset: prod orphans are ignored by design), and each prod
     `manifest.json` byte-matches dev's;
  3. a canary clip's **public** URL returns 200 audio;
  4. prod migrations match repo files (dry-run push reports nothing pending).

Parity is deliberately superset, not equality — that's what lets the mirror be
copy-only and keeps CI from ever needing delete rights on production. Orphans
never turn the workflow red.

## One-time setup (do once, in order)

### 1. Add the new Production-environment secrets (GitHub → repo → Settings → Environments → Production)

These are **GitHub Actions** secrets, separate from Vercel's env — Vercel
already holding a service-role key does **not** satisfy CI. Without these the
sync and smoke-check jobs fail on missing env.

- `DEV_SUPABASE_URL` — dev project API URL
- `DEV_SUPABASE_SERVICE_ROLE_KEY` — dev service-role key
- `SUPABASE_SERVICE_ROLE_KEY` — **prod** service-role key (only the anon key
  existed here before)

(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_ACCESS_TOKEN`,
`SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID` already exist and are reused.)

### 2. Re-key es/frCa/de to voice-keyed in DEV

`VOICE_KEYED_TRACKS` now includes all four tracks. Regenerate the three that
were plain-keyed, against dev (`.env.local` → dev project):

```
node scripts/generate-tts.mjs --track esForEn   --upload
node scripts/generate-tts.mjs --track frCaForEn --upload
node scripts/generate-tts.mjs --track deForEn   --upload
```

Each run synthesizes under the new `{hash}-{voice}.mp3` names (≈ $0) and
uploads them. The old plain `{hash}.mp3` clips remain as orphans locally and
in the dev bucket.

### 3. Sweep the old plain clips from DEV

```
node scripts/sweep-tts.mjs --track esForEn   --delete
node scripts/sweep-tts.mjs --track frCaForEn --delete
node scripts/sweep-tts.mjs --track deForEn   --delete
```

Target matches `DEV_SUPABASE_URL` → dev confirmed, deletes proceed. Dev bucket
is now voice-keyed only for all four tracks.

### 4. One-time PROD cleanup (the historical mess)

Prod holds: old plain-keyed es/frCa (from the manual uploads) and a stray
plain-keyed de upload. None of it breaks anything — it's inert and parity
ignores it — but clear it so prod mirrors dev cleanly.

The sweep compares the bucket against your **local** voice-keyed manifests
(produced in step 2), so pointing it at prod deletes exactly the plain-keyed
orphans. Point `.env.local` at the **prod** project, then:

```
node scripts/sweep-tts.mjs --track esForEn   --delete --confirm-nondev
node scripts/sweep-tts.mjs --track frCaForEn --delete --confirm-nondev
node scripts/sweep-tts.mjs --track deForEn   --delete --confirm-nondev
```

`--confirm-nondev` is required because the target isn't dev; the script prints
the target URL first — eyeball it before each run. Do a report-only pass
(drop `--delete`) first if you want to see the orphan list.

> This step is optional for correctness and can also just be left to happen
> naturally: once the sync job runs, the plain clips stay as inert orphans and
> harm nothing. Doing the sweep only keeps prod tidy.

### 5. Merge dev → main

The chain runs: migrations → sync-tts (mirrors the voice-keyed clips + updated
manifests into prod) → smoke-check (parity, canary, migrations). de and ja
audio go live in prod with no manual upload.

## Ongoing

- New track at its TTS pass: add it to `VOICE_KEYED_TRACKS`, generate + upload
  to dev, sweep dev. On the next main merge it mirrors to prod automatically.
- Removed-question orphans in prod are inert and don't fail parity, so no CI
  sweep is needed. If prod tidiness is ever wanted, run the guarded prod sweep
  (step 4 pattern) — never given to CI, kept a deliberate manual action.

# TTS sync CI chain + release smoke checks + release-ready gating

> Consolidated at the v2.31.0-beta.2 prod rollup from two unreleased
> fragments (2026-07-13 spec/first-cut + 2026-07-14 shipped implementation).
> This file describes the chain as actually merged; where the two differed
> (smoke-check scope, job count, publish-ready gating), the shipped form wins.

## User-facing
- The "update available" prompt now waits until a release is fully live —
  code, database, and audio all deployed — before it appears, instead of
  showing the moment new code ships.

## Internal

### The chain (5 jobs on every `main` push)
`migrate-production → sync-tts → smoke-check → publish-ready`, plus the
`dev`-push staging-migrate job.

- **`scripts/sync-tts.mjs`** — copy-only dev→prod mirror of the `tts-audio`
  bucket, runs after `migrate-production`. Skips clips already present in prod
  (content-addressed, immutable), always re-copies manifests, never deletes
  from prod, refuses a same-project source/target. Permanently replaces the
  manual `generate-tts.mjs --upload`-against-prod release step — prod merges
  now require zero manual effort across code, DB schema, and storage.
- **`scripts/smoke-check.mjs`** — checks 1–3, post-`sync-tts`: prod
  `/version.json` is served and matches the merged `lib/version.js` (polls
  while the Vercel deploy lands); manifest-`f` bucket parity as a superset
  check with prod-manifest byte-match; one canary clip public URL returns 200
  audio. **Check 4 (migration alignment vs. the repo, Supabase CLI dry-run)
  stays a workflow shell step, not part of smoke-check.mjs.**
- **`scripts/publish-ready.mjs` + `publish-ready` job** (`needs: smoke-check`)
  — writes `tts-audio/release-ready.json` (version + timestamp) as the final
  chain step, only if the whole chain passed. Marker lives at bucket root,
  untouched by sync/parity/sweep.

### Client half (shipped together — fails closed)
- **`lib/VersionWatcher.js`** — the update-check component (polls a version
  endpoint ~every 60s + on focus; blocking on the sign-in screen, soft prompt
  elsewhere) now ANDs the release-ready marker with the app version, showing
  the prompt only when `marker.version === latestVersion && latestVersion !==
  current`. Fails closed on a missing/unreadable marker (no prompt) — safe
  because `publish-ready` is a required, smoke-gated step. Marker URL:
  `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tts-audio/release-ready.json`.
  This is why both halves ship in the same release: if `publish-ready` doesn't
  go green, testers get no update prompt even on a "successful" Vercel deploy.

### Voice-keying + sweep
- **`VOICE_KEYED_TRACKS`** flipped to all four tracks (esForEn, frCaForEn,
  deForEn, jaForEn). es/frCa/de re-key is a manifest-only change on the client
  side (filenames resolve through the manifest `f` field), already regenerated
  and uploaded to dev with the old plain clips swept.
- **`scripts/sweep-tts.mjs`** — write-target logging + a `--confirm-nondev`
  guard: a `--delete` against anything other than `DEV_SUPABASE_URL` now
  requires the explicit flag. Authorizes the optional one-time prod cleanup.
  Track-id resolution fix included.

### Workflow (`supabase-migrations.yml`)
- Restructured to trigger on `main` (prod chain above) and `dev` (staging
  migrate). The `paths: supabase/migrations/**` filter was removed so
  no-migration releases still run sync + smoke; staging migrate is now an
  idempotent no-op on migration-free dev pushes.
- Parity is a manifest-`f` superset (not a raw count × voices multiplier), so
  inert prod orphans never fail the workflow — this is what keeps the mirror
  copy-only and means CI never needs prod delete rights.
- The two public `NEXT_PUBLIC_*` refs use `vars.X || secrets.X` so they
  resolve whether they live under GitHub variables or secrets.
- Three one-time Production-environment secrets required: `DEV_SUPABASE_URL`,
  `DEV_SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (prod service
  role). Listed in the workflow header and the runbook.

### Docs
- New `docs/tts-sync-runbook.md` (one-time setup incl. the three new secrets,
  the re-key + dev sweep, and the guarded prod cleanup).
- `docs/manual-runbook.md` §6 rewritten: release = version bump + fragment
  rollup → merge `dev→main` (`--no-ff`) → watch for green checks. Manual prod
  TTS upload steps and env-swap instructions deleted; §5 dev TTS sequence
  unchanged but now explicitly dev-only. §8 lists the new secrets.

### Follow-ups (post-merge, optional)
- Guarded one-time prod sweep to clear the old plain-keyed orphans left in
  prod (`sweep-tts --delete --confirm-nondev`). Inert — parity ignores them —
  tidiness only.

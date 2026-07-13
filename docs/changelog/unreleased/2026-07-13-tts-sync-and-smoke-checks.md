# 2026-07-13 — TTS sync job + release smoke checks

## User-facing

None.

## Internal

- New `scripts/sync-tts.mjs`: CI job that mirrors the dev `tts-audio`
  bucket into prod on every `main` push (copy-only, idempotent, never
  deletes). Permanently replaces the manual
  `generate-tts.mjs --upload`-against-prod release step; prod merges now
  require zero manual effort across code, DB schema, and storage.
- New `scripts/smoke-check.mjs` + workflow job: post-release verification
  on every `main` push — prod version endpoint matches the merged
  `lib/version.js` (polls while the Vercel deploy lands), prod
  `tts-audio` key count ≥ dev's, one canary audio URL returns 200, and
  prod's applied migrations match the repo (Supabase CLI dry-run).
- `supabase-migrations.yml` restructured: triggers on `main` (prod chain:
  migrate → sync-tts → smoke-check) and `dev` (staging migrate). The
  `paths: supabase/migrations/**` filter removed so no-migration releases
  still run sync + smoke; staging migrate is now an idempotent no-op on
  migration-free dev pushes.
- Three one-time Production-environment secrets required:
  `DEV_SUPABASE_URL`, `DEV_SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (prod service role). Listed in the workflow
  header and runbook §8.
- Runbook §6 rewritten: release = version bump + rollup → merge dev→main
  (`--no-ff`) → watch for green checks. Manual prod TTS upload steps and
  env-swap instructions deleted; §5 dev TTS sequence unchanged but now
  explicitly dev-only.

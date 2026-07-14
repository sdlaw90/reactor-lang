# TTS sync CI job + smoke-check

## User-facing
- (none directly — this is release infrastructure. The de and ja audio it
  unblocks in prod ride their own changelog entries on the release that
  deploys them.)

## Internal
- New `scripts/sync-tts.mjs`: copy-only dev→prod mirror of the `tts-audio`
  bucket. Runs after `migrate-production` on every main push. Skips clips
  already present in prod (content-addressed, immutable), always re-copies
  manifests, never deletes from prod. Same-project source/target is refused.
- New `scripts/smoke-check.mjs`: checks 1-3 (prod `/version.json` served;
  manifest-`f` bucket parity as a superset check with prod-manifest byte-match;
  canary clip public URL 200 audio). Check 4 (migration alignment) stays the
  workflow shell step.
- `VOICE_KEYED_TRACKS` flipped to all four tracks (esForEn, frCaForEn, deForEn,
  jaForEn). es/frCa/de re-key is a manifest-only change on the client side.
- `scripts/sweep-tts.mjs`: added write-target logging + `--confirm-nondev`
  guard — a `--delete` against anything other than `DEV_SUPABASE_URL` now
  requires the explicit flag. Authorizes the one-time prod cleanup.
- Parity is a manifest-`f` superset (not a raw count × voices multiplier);
  inert prod orphans never fail the workflow, which is what lets the mirror
  stay copy-only and keeps CI without prod delete rights.
- Runbook: `docs/tts-sync-runbook.md` (one-time setup incl. the three new
  Production-environment secrets, re-key + dev sweep, guarded prod cleanup).

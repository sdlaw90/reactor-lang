# TTS sync CI job + smoke-check + release-ready gating

## User-facing
- The "update available" prompt now waits until a release is fully live —
  code, database, and audio — before appearing, instead of showing the moment
  new code deploys. (Depends on the client-side half; see Internal.)

## Internal
- New `scripts/sync-tts.mjs`: copy-only dev->prod mirror of the `tts-audio`
  bucket. Runs after `migrate-production` on every main push. Skips clips
  already present in prod (content-addressed, immutable), always re-copies
  manifests, never deletes from prod. Same-project source/target is refused.
- New `scripts/smoke-check.mjs`: checks 1-3 (prod `/version.json` served;
  manifest-`f` bucket parity as a superset check with prod-manifest byte-match;
  canary clip public URL 200 audio). Check 4 (migration alignment) stays the
  workflow shell step.
- New `scripts/publish-ready.mjs` + `publish-ready` job (`needs: smoke-check`):
  writes `tts-audio/release-ready.json` (version + timestamp) as the final
  chain step, only if the whole chain passed. The client ANDs this marker with
  the app version.json so the update prompt gates on the full release, not just
  Vercel's deploy. Marker lives at bucket root, untouched by sync/parity/sweep.
- `VOICE_KEYED_TRACKS` flipped to all four tracks (esForEn, frCaForEn, deForEn,
  jaForEn). es/frCa/de re-key is a manifest-only change on the client side.
- `scripts/sweep-tts.mjs`: added write-target logging + `--confirm-nondev`
  guard -- a `--delete` against anything other than `DEV_SUPABASE_URL` now
  requires the explicit flag. Authorizes the one-time prod cleanup.
- Workflow: the two public `NEXT_PUBLIC_*` refs use `vars.X || secrets.X` so
  they resolve whether they live under GitHub variables or secrets.
- Parity is a manifest-`f` superset (not a raw count x voices multiplier);
  inert prod orphans never fail the workflow, which is what lets the mirror
  stay copy-only and keeps CI without prod delete rights.
- Runbook: `docs/tts-sync-runbook.md` (one-time setup incl. the three new
  Production-environment secrets, re-key + dev sweep, guarded prod cleanup).

## CLIENT-SIDE HALF STILL TO DO (separate change, once the file is located)
The update-check component (polls a version endpoint every ~60s + on focus,
compares to CURRENT_VERSION; blocking on the sign-in screen, soft prompt
elsewhere) must fetch the marker and only show the prompt when
`marker.version === latestVersion && latestVersion !== current`. Marker URL:
`${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tts-audio/release-ready.json`.
Fail-closed on a missing/unreadable marker (no prompt) -- acceptable because
publish-ready is a required, smoke-gated step.

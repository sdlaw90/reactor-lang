## User-facing
- None

## Internal
- Added docs/manual-runbook.md — standing reference for all manual
  commands (delta extraction, verification, dev deploy, TTS sequence,
  release cut); build notes now reference sections instead of restating
- Finalized production merge command: `git merge dev --no-ff -m "Release
  vX.Y.Z-beta.N"`
- Release order corrected: merge to main first, verify migrations
  workflow, then prod TTS uploads (bucket doesn't exist in prod until
  the workflow runs)
- Added docs/changelog/ fragment system: one fragment per delta in
  unreleased/, rolled up into release notes at each prod push

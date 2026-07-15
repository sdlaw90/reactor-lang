# Repo file manifest generator

## User-facing
_None — internal developer tooling._

## Internal
- Added `scripts/gen-repo-tree.mjs` + `npm run gen-tree`: writes
  `docs/repo-tree.md`, a flat sorted manifest of every git-tracked file from
  `git ls-files`. Mechanical, always-current companion to the hand-authored
  `docs/codebase-reference.md` (annotations) and `architecture.md` (systems
  view). Tracked-only output (no `node_modules`/build/gitignored); surfaces
  stray committed scratch state (e.g. `supabase/.temp/`) as a drift signal.
- Regenerate on any file add / move / delete — fold into the existing
  changelog-fragment step. Code-only delta; no version files touched.

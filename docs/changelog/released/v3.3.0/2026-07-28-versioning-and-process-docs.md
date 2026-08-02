# 2026-07-28 — X.Y.Z versioning convention + release-process doc updates

_Folds into the **3.3.0** release entry (internal-only — rides with whatever ships first)._

## User-facing
- None — process and documentation only. No app code, content, or dependency changes.

## Internal
- **New versioning convention (Sean, 2026-07-28)** — supersedes the 2026-07-26 "Z is for
  post-release fixes only, planned build-out never gets its own patch" rule:
  - **X** — the roadmapped release plan completing (v4.0.0 = matrix complete).
  - **Y** — a major part of that roadmapped plan (in v3.x: one native/source language).
  - **Z** — minor bug, UI, and feature fixes, plus native-review corrections to shipped content.
  - **Releases are kept as small as they safely can be.** A finished, verified Z-sized change
    now ships on its own instead of waiting to fold into the next Y. Y milestones still
    accumulate across work-beats with no per-beat version bump.
- **Consequence handled — `unreleased/` can now hold fragments for two pending versions at
  once** (a Z shipping while a Y is mid-build). Every fragment must therefore **name its target
  version**, and a release rolls up **only the fragments naming the version being cut** rather
  than sweeping the folder. Old wholesale-concatenation rule retired.
- **Consequence flagged — cutting a Z merges all of `dev`, including half-built Y work.** This is
  safe only because **the offering flip goes last**: a source's content/tracks/localization land
  while nothing in the UI can reach them. Written into the runbook as a pre-cut check; a beat that
  can't be made inert must not land on `dev` until its Y is ready.
- **`-beta.N` suffix formally retired.** Runbook §6a said to bump a new `-beta.N` at every release,
  which had been stale since v3.1.1 and v3.2.0 both shipped as plain versions. `main` remains the
  *beta-prod tier* — a tier name, not a version suffix.
- **Changed files:**
  - `docs/manual-runbook.md` — §3 prereq corrected (do NOT bump `lib/version.js` at dev-deploy
    time; dev commits carrying the previous version's label is expected). §4 rewritten for
    per-version fragments. **§6a rewritten** — plain `X.Y.Z`, digit-selection table, per-version
    rollup. §6b gained the cut-a-Z-mid-milestone safety note; release commit message dropped its
    `-beta.N`.
  - `docs/changelog/README.md` — fragment format now requires a target-version line; rollup
    procedure selects by version instead of concatenating the folder; internal-only fragments
    documented as riding with the next release.
  - `.gitignore` — added `_to_delete/`. The straggler-sweep retirement folder was **tracked**,
    so files moved there for deletion stayed in history and round-tripped through commits,
    defeating its purpose (`_to_delete/enForEs.js` was still being carried as of `c4d9645`).
- Project-knowledge counterparts updated in the same pass: deployment plan §5 (the authority for
  this convention) and the state-of-the-app versioning callout.
- No dependency/lockfile change; no version bump.

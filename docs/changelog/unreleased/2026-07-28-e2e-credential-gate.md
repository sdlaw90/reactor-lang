# 2026-07-28 — E2E authenticated suite fails loudly + changelog rollup selects by version

_Folds into the **3.3.0** release entry (internal-only — rides with whatever ships first)._

## User-facing
- None — test infrastructure and release tooling. No app code, content, or dependency changes.

## Internal
- **The authenticated E2E suite has been skipping silently in CI for months.**
  `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` were never set, and both the spec and the workflow
  treated that as fine, so 6 of the suite's 20 tests never ran while the board stayed green.
  The v3.1.1 production bug (raw string keys rendered to every user in every language) shipped
  under exactly that green-looking board.
  - `e2e/authenticated-flow.spec.js` — now **asymmetric by design**: missing credentials still
    SKIP locally (so the public suite runs without an account), but in CI they register a named
    failing test, `authenticated-suite credentials are configured`, whose message states which
    var is missing and where it goes. Implemented as a real test rather than a throw at
    collection time so it appears in the report instead of crashing the run.
  - `.github/workflows/e2e-tests.yml` — the "Optional -- tests skip cleanly" comment is gone;
    the vars are documented as required, with the reasoning. Wiring unchanged and verified:
    `environment: Production` is declared, and both vars are on the `Run E2E tests` step.
  - `.env.local.example` — `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, `E2E_BASE_URL` added, blank,
    with a warning that the account must be dedicated (the suite writes real history rows to
    whatever Supabase project the build points at — prod, for this workflow).
  - `docs/manual-runbook.md` **§9 (new)** — account creation, the Production-environment secrets,
    and verification. §2's Playwright command corrected to `npm run test:e2e` (closes a §8
    pending item). §8 gained the secrets item and the `tts-probe/` decision.
- **`scripts/rollup-changelog.mjs` would have broken today's small-release convention.** It
  swept *all* of `unreleased/` and archived everything under `CURRENT_VERSION`, so cutting a Z
  mid-milestone would have published half-built Y work in the release notes and filed those
  fragments under the wrong version — with nothing left in `unreleased/` to show it happened.
  The convention shipped this morning as documentation only; the tooling contradicted it.
  - Fragments now declare a target version; every mode operates only on the fragments matching
    the version being cut. Parser is tolerant (`Folds into … 3.3.0`, or `Target: 3.3.0`).
  - `--check` **fails** on a fragment with no target version, and prints a per-version count.
    That's the enforcement — otherwise the declaration rots.
  - New `--version X.Y.Z` flag to target a version other than `CURRENT_VERSION`.
  - **Held-back fragments are always printed**, and `--archive` says outright that a non-empty
    `unreleased/` is expected rather than a leftover. No silent drops.
  - `docs/changelog/README.md` — corrected: it still said "Manual rollup for now. Add
    `scripts/rollup-changelog.mjs` only if…", but the script has existed since #91.
- **Two pre-existing parser bugs in the same script, both surfaced by testing the above:**
  - **"None" was matched exactly** (`/^none\.?$/`), but people write `None — internal only, no
    app changes`. That explanation was being promoted into the user-facing release notes as a
    real bullet. Now `/^none\b/`.
  - **Only column-0 bullets were recognised.** Indented sub-bullets fell through to the
    continuation branch, so a nested list collapsed into one paragraph-long entry — the internal
    rollup for a fragment with a "Changed files:" sub-list was effectively unreadable. Nested
    bullets are now their own entries, flattened with a `· ` prefix (the target is a flat array
    of strings in `lib/version.js`, so depth can't survive, but subordination stays visible).
- **Verified:** esbuild parse of the spec; `node --check` on the rollup script; YAML parse of the
  workflow asserting `environment: Production` and both vars on the right step; and the rollup
  script exercised against a scratch repo across six cases — check-pass, check-fail on a missing
  target, mixed-version partition, per-version assembly, archive isolation (only the targeted
  fragment moved, the other two stayed), and bad `--version` input.
- No dependency/lockfile change; no version bump.

# 2026-08-04 — The release refuses when the prep didn't happen

_Folds into the **3.5.0** release entry._

## User-facing
- None — release tooling.

## Internal
- **The problem this fixes.** v3.4.0 shipped with its announcement art stranded on `dev`. The
  square and the regenerated forest cover were written **after** the last `deploy dev`;
  `deploy beta` refuses a dirty tree, so its guard passed before those files existed and they
  never reached `main`. **Nothing failed** — the release was green, CI was green, and the art
  was simply absent. `main` still said Italian wasn't in native mode while Italian shipped.
- **The fix is not "add a script that does the prep."** A step you can forget is a step you
  will forget, and a script you can forget to run is just a longer runbook. So the release
  now **refuses** when the prep didn't happen.

### New: `npm run deploy <tier>-pre-release <version>`

Asserts, then acts, then pushes:

| | |
|---|---|
| **asserts** | every `unreleased/` fragment declares a target version and none targets an older one · `lib/version.js` has a `CHANGELOG` **and** `INTERNAL_CHANGELOG` entry for the version, and **every user-facing bullet carries every released source language** · the release square exists, and a release that adds a source language has that language's acorn `full` and a regenerated cover PNG · `verify:l10n` · `eslint` 0 errors · `audit-i18n-columns` reporting *nothing skipped* · full `next build` |
| **does** | bumps `CURRENT_VERSION` · `rollup-changelog --archive` · writes `docs/changelog/released/v<version>/release-receipt.json` |
| **then** | runs the **existing** dev push — one code path, so the release push can never drift from the one exercised daily |
| **prints** | REMAINING MANUAL STEPS (post the announcement, set the FB cover) — what can't be automated is at least never invisible |

**Ending with the push is the actual fix.** It closes the window entirely: the release commit
is the last thing written, by construction, so nothing can be authored into the gap
afterwards. `--dry-run` shows every check without writing, archiving or pushing.

### `deploy <tier>` is now gated

- **Demands a receipt** matching `CURRENT_VERSION`. Skip the prep and the release will not
  merge.
- **Re-runs the cheap structural checks** — catches anything that landed on `dev` after the
  prep, which the receipt alone wouldn't.
- **Demands green CI for the exact commit being merged** (`scripts/check-ci.mjs`, unauthenticated
  GitHub Actions API — public repo, no token, no `gh`). Red, still-running **and**
  couldn't-reach-the-API all stop the release: *"I could not check" is not "it passed."*
  This replaces reading the Actions page by eye, which is not reliable — during the v3.4
  release the run-list page showed a finished duration for a run whose conclusion it never
  rendered, and only filtering `is:success` **and** `is:failure` gave a straight answer.

### Design notes

- **Whether art is owed is derived, not declared.** The script diffs `RELEASED_SOURCE_LANGS`
  between the worktree and the live branch. Adds a source language → square + regenerated
  cover required. Minor/major bump → square required. Pure patch → neither. Nobody has to
  remember to tell it what kind of release this is.
- **Tiers are config, not copies.** `TIERS` in `scripts/deploy.js` holds source/target/label
  and the known-safe conflict list. `live` / `live-pre-release` are scaffolded and error
  until the branch exists; standing it up is one entry, not a second copy of the merge logic.
- **The changelog language check is parsed with acorn, not regex** — v3.4's own #72 sweep
  missed `lib/trackSublabels.js` precisely because it pattern-matched. It would have caught a
  v3.4 bullet shipped without its `it` column.
- **Verification of the gate itself:** the art check was mutation-tested against the real
  failure — run against `main` as it stood *before* v3.4.0 (`e4e4fec`), with the marketing
  files stashed, it correctly reports **RELEASE REFUSED** on all three art assertions; with
  them present it passes. `check-ci.mjs --self-test` covers the verdict logic offline
  (7 cases: none / pending / green / failed / mixed-skipped / cancelled / queued).
  - **The first version of that test was vacuous** — it compared against `main` *after* the
    release, so "added source languages" was empty and the check was never exercised. Same
    trap as everything else this release: a test that can't fail reads exactly like one that
    passes. Fixed by pinning the comparison to the pre-release ref.
- **The cover-PNG-changed assertion is secondary and says so in a comment** — it compares
  against the live branch, so it can pass for an unrelated reason. The acorn-state assertion
  is the load-bearing one.
- **Re-running the pre-release is safe and idempotent**, which is also the escape hatch if a
  receipt is ever lost. There is deliberately **no `--force`** on the release gate.
- `docs/manual-runbook.md` §6 rewritten around the two commands.
- No dependency change.

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
- **Two more ways this suite was blind, both found by actually running it:**
  - **The report artifact never uploaded.** `playwright.config.js` set
    `reporter: "github"` in CI, but only the `html` reporter writes
    `playwright-report/` — so the upload step found nothing on every run and said so
    in a warning nobody read. A CI failure left no screenshot, no trace, no
    `error-context.md`. Reporter is now `[["github"], ["html", { open: "never" }]]`,
    and a second artifact uploads `test-results/` (per-failure screenshot, trace.zip,
    error-context.md) with `if-no-files-found` set explicitly on both.
  - **`.env.local` credentials never reached the tests.** Playwright runs as its own
    Node process and does not inherit Next.js's env loading, so the documented local
    setup could not have worked: the app under test saw the vars, the spec that needed
    them did not, and the authenticated tests skipped regardless of what was in the
    file. `playwright.config.js` now parses `.env.local` itself (~10 lines, no dotenv
    dependency); existing env vars win, so CI is unaffected.
  - Runbook §9b corrected and **§9d added** — which artifact to grab and what's in it.
- **First real run of the authenticated suite: 38/40, and the failure was the test,
  not the app.** `explanations view opens without crashing after a completed round`
  failed on both browser projects. The `error-context.md` accessibility snapshot —
  available only because of the reporter fix above — showed the page sitting on the
  **Help page**, not on a round. Diagnosis:
  - The spec picked answer options with `locator("button.rj").first()`. **`.rj` is on
    every styled button in the app** — the HUD home arrow, the help toggle, the exit
    button. It also fired immediately after clicking Start Round, before the round
    screen had rendered, so `.first()` matched the HUD home arrow (which only renders
    while `screen !== "playing"`), navigated to `/`, and spent its 40 iterations
    wandering home → help → back.
  - The symptom ("ROUND COMPLETE never appeared") pointed at the round; the cause was
    the selector. Worth remembering as a class of bug: a too-broad locator fails by
    *doing something else successfully*.
  - **Fix, `app/play/[trackId]/page.js`:** added `data-testid` to the five elements the
    suite drives — `answer-option`, `next-question`, `round-complete`, `start-round`,
    `view-explanations`. Attributes only; no visible surface, so no UI preview needed.
    `start-round` and `view-explanations` appear twice each (start screen and result
    screen) and resolve uniquely at runtime since only one screen mounts at a time.
  - **Fix, `e2e/authenticated-flow.spec.js`:** the test now drives entirely off those
    testids, waits for `answer-option` to be visible before looping, clicks only
    enabled options, raises the bound to 60 iterations and the test timeout to 60s
    (a full round plus sign-in genuinely does not fit in the default 30s).
  - **Also removes a latent v3.3 break:** the old loop matched on English/Spanish copy
    (`/round complete|ronda completa/`). That would have failed the moment the suite
    ran under a French — or Portuguese — native account. Testids are language-agnostic.
- **A second test was vacuous — and passing.** `Quick Quiz mode: start a round and answer
  without a crash` did `page.locator("button").filter({ hasText: /.+/ }).nth(0).click()`
  immediately after Start Round: the first button carrying any text, with no wait for the round
  to render. That's the HUD back arrow ("←") on the start screen, or the exit button ("← Exit")
  if the round had rendered — so it never answered anything, and its only assertion (no
  `pageerror`) is trivially true on the home page it had navigated to. Same bug class as the
  explanations failure, but green, which is worse: it reported coverage it did not have.
  Rewritten to drive off `start-round` / `answer-option`, assert at least two real options are
  on screen, assert answering does not navigate away, and assert the round then either advanced
  or completed. Written as an either/or rather than asserting the post-answer disabled state,
  since default pacing auto-advances in under a second and that would flake.
- **Verified:** esbuild parse of the spec; `node --check` on the rollup script; YAML parse of the
  workflow asserting `environment: Production` and both vars on the right step; and the rollup
  script exercised against a scratch repo across six cases — check-pass, check-fail on a missing
  target, mixed-version partition, per-version assembly, archive isolation (only the targeted
  fragment moved, the other two stayed), and bad `--version` input.
- No dependency/lockfile change; no version bump.

# SquirreLingo — Manual Commands Runbook

> Standing reference for every manual step in the dev → release loop.
> Build notes in session handoffs reference this doc instead of restating
> commands. Update here when a step changes.

---

## 1. Receiving a delta zip (start of applying a session's work)

Delta zips contain a root `reactor-lang/` folder. Extract at the **parent
directory of the repo** — files merge into place.

```
# from the directory that CONTAINS reactor-lang/
tar -xf delta.zip        # or Windows: right-click → Extract Here
```

Then, **only if `package-lock.json` changed** in the delta:

```
cd reactor-lang
npm ci
```

Never `npm install`.

---

## 2. Local verification (only when deps/lockfile changed or cutting a release)

```
npm ci
npm run build        # includes ESLint (no-undef catches the undefined-component bug class)
npm run test:e2e     # E2E (= `playwright test`); needs the §9 test-account env vars
                     # for the authenticated half, or those 6 tests skip locally
```

Skip for copy tweaks and script-only changes (those are verified in-session
via `node --check` + dry-runs).

---

## 3. Commit & deploy to dev

Prereq: you're on `dev` and the changelog fragment (§4) is present.
**Do NOT bump `lib/version.js` here** — `CURRENT_VERSION` moves once, at the
release (§6a). Day-to-day dev commits carry the *previous* version's label on
purpose; that's expected, not a mistake. Then:

```
npm run deploy dev
```

`scripts/deploy.js` does the whole dance and refuses to run off `dev`: it
stages everything, regenerates `docs/repo-tree.md`, commits as
`v<CURRENT_VERSION>` (skips the commit if nothing changed), `git pull --rebase`,
`git push`, then auto-synths + uploads any genuinely-new TTS clips to the
**dev** bucket (non-blocking — a TTS hiccup never aborts the push). You no
longer run the git commands or the §5 TTS sequence by hand. `public/version.json`
is regenerated from `lib/version.js` at build, so it needs no hand-editing.

> Bare `npm run deploy` (no target) errors on purpose — you must name the tier
> (`dev` / `beta` / `prod`) so a wrong-branch push can't happen by reflex.

Pushing `dev` triggers: Vercel Preview deploy + migrations workflow →
**staging** Supabase. (The old `paths` filter is gone, so the staging
migration job runs on every dev push — an idempotent no-op when there are no
new migration files.)

---

## 4. Changelog fragments (every delta)

One fragment per delta at `docs/changelog/unreleased/YYYY-MM-DD-slug.md`.
Format, rules, and the rollup procedure live in `docs/changelog/README.md`.
Unique filenames = no collisions between parallel sessions.

**Every fragment names the version it belongs to** in its subtitle line, because
`unreleased/` can now hold fragments for more than one pending version at a time
(a Z release can ship while a Y milestone is still being built — deployment plan
§5). A release rolls up only the fragments naming the version being cut.

`lib/version.js` is bumped only at the release (§6a). If two sessions are ever
in flight at once, whichever one cuts the release owns that edit — but the
normal case now is one session carrying a release end to end.

---

## 5. TTS per-track sequence (dev)

Requires `.env.local` with the GCP API key and Supabase service role key
(**dev values — prod is never touched manually; see §6**).

```
node scripts/generate-tts.mjs --track <trackId> --dry-run     # review counts + review.txt flags
node scripts/generate-tts.mjs --track <trackId> --limit 10    # audition clips → tts-output/<trackId>/ (LOCAL only)
# listen to the clips, approve voice/rate
node scripts/generate-tts.mjs --track <trackId> --upload      # only this step touches the DEV Supabase bucket
```

Flags:
- `--voice <name>` — override the `TRACK_VOICES` default for auditioning alternatives
- `--force` — regenerate existing clips; only needed if an SSML rule change alters output for an already-uploaded track
- New track = add its entry to `TRACK_VOICES` after the audition verdict.
  Voice preflight hard-fails if a configured voice doesn't exist for its
  exact locale — intentional, never bypass it.

Prod gets this audio automatically at release time: the `sync-tts` CI job
mirrors the dev bucket into prod on every `main` push (copy-only, never
deletes). There is no manual prod upload step anymore.

**Deploy-time auto-sync (added 2026-07-19):** `npm run deploy dev` now runs
`scripts/tts-on-deploy.mjs` after the push — it detects which audio tracks'
content changed in the deploy, dry-run-gates for genuinely-new clips, and
synth+uploads only those to the **dev** bucket. So for ordinary content passes
you no longer have to run the §5 sequence by hand; it's non-blocking (a TTS
hiccup never aborts the code push) and needs your `.env.local` dev keys. The
manual §5 flow is still the tool for auditioning voices/rates on a new track or
after an SSML-rule change (`--force`), and for a one-time upload of clips that
were generated locally but never pushed. See `docs/tts-pipeline.md` §"Automatic
sync on deploy" for the full behavior.

---

## 6. Cutting a release (beta-prod = `main`)

The entire release is **two commands**:

```
npm run deploy beta-pre-release <version>     # checks + archive + receipt, then pushes dev
npm run deploy beta                           # dev → main, then back-merge
```

Everything §6a used to ask you to do by hand is now inside the first one, and the
second **refuses to run** unless the first one passed for that exact version.

> Tier naming: `main` is the **beta-prod** tier (your beta testers). The real
> live-prod branch isn't stood up yet — `npm run deploy live` and
> `live-pre-release` are reserved and error until it is. Adding that tier is a
> `TIERS` entry in `scripts/deploy.js`, not a second copy of the release logic.

### Why there are two stages (added after v3.4.0)

v3.4.0 shipped with its announcement art stranded on `dev`. The square and the
regenerated forest cover were written **after** the last `deploy dev`; `deploy beta`
refuses a dirty tree, so its guard passed before those files existed and they never
reached `main`. Nothing failed — the release was green and the art was simply gone.

The fix isn't "remember to do the prep." A step you can forget is a step you will
forget, and adding a script you can forget to run is just a longer runbook. So
`beta-pre-release` **ends by pushing dev** — the release commit is the last thing
written, by construction — and writes a **receipt** that `deploy beta` demands.

### 6a. `npm run deploy beta-pre-release <version>`

Pass the version as an argument — `npm run deploy beta-pre-release 3.5.0`. **Which
digit moves is a judgement call about what the release contains, so the script
never guesses it**; it only refuses a version that isn't ahead of what's on `main`.

Add `--dry-run` to see every check without writing, archiving or pushing anything.

**What it asserts** (all must pass, or nothing is written):

| | |
|---|---|
| changelog | every fragment in `unreleased/` declares a target version, and none targets a version older than this release |
| `lib/version.js` | has a `CHANGELOG` **and** `INTERNAL_CHANGELOG` entry for the version, and **every user-facing bullet carries every released source language** (parsed with acorn, not regex) |
| art | the release square exists, and when the release **adds a source language**, that language's acorn is `full` in `forest-cover.html` and the cover PNG changed |
| build | `npm run verify:l10n` · `eslint` 0 errors · `audit-i18n-columns` reporting *nothing skipped* · a full `next build` |

**What it does:** bumps `CURRENT_VERSION`, runs `rollup-changelog --archive` for
that version, writes `docs/changelog/released/v<version>/release-receipt.json`, then
runs the normal dev push.

**What it prints and cannot do:** the announcement post and the Facebook page cover.
Those are listed as REMAINING MANUAL STEPS on every run, so what can't be automated
is at least never invisible.

Re-running it is safe and idempotent — that's also the escape hatch if a receipt
ever gets lost.

**Whether art is owed is derived, not declared:** the script diffs
`RELEASED_SOURCE_LANGS` between your tree and `main`. A release that adds a source
language owes a square *and* a regenerated cover; a minor/major bump owes a square;
a pure patch owes neither.

### 6a-bis. Reference — the version digits

**`CURRENT_VERSION` is a plain `X.Y.Z`, no suffix.** The `-beta.N` scheme is **retired**; v3.1.1 and v3.2.0 both
shipped as plain versions. `main` is still the *beta-prod tier* — that's a tier
name for who's on the other end, not a version suffix.

Which digit moves is set by the versioning convention (deployment plan §5 is the
authority):

| Digit | Moves when | Example |
|---|---|---|
| **Z** | minor bug / UI / feature fix, or a native-review correction to shipped content | 3.2.0 → 3.2.1 |
| **Y** | a major part of the roadmapped plan lands | 3.2.x → 3.3.0 (French) |
| **X** | the roadmapped arc itself completes | 3.9.x → 4.0.0 (matrix complete) |

Releases are kept **as small as they safely can be** — a finished, verified
Z-sized change ships on its own rather than waiting for whatever Y it happens to
sit next to.

**Rollup:** per `docs/changelog/README.md`, take **only the fragments naming the
version being cut**, fold their user-facing bullets into the release notes
(regrouped by feature area), and move **those** fragments to `released/vX.Y.Z/`.
Fragments targeting a later version stay in `unreleased/` — do not sweep the
folder wholesale.

### 6b. Release to main

Prereqs are now **checked, not remembered**. `npm run deploy beta` refuses unless:

- the working tree is clean and local `dev` == `origin/dev`;
- the version isn't already on `main`;
- **a receipt exists for this exact version** (i.e. §6a ran);
- the structural checks still pass — catches anything that landed on `dev` *after*
  the prep;
- **CI is green for the exact commit being merged**, via the public GitHub Actions
  API (`scripts/check-ci.mjs`). Red, still-running, and "couldn't reach the API" all
  stop the release — *"I could not check" is not "it passed."*

Then, from a clean tree:

> **Cutting a Z while a Y is half-built on `dev`.** This is allowed and expected —
> it's the whole point of small releases — but it merges *all* of `dev` to `main`,
> including in-progress milestone work. It's only safe because **the offering flip
> goes last**: a source's content, tracks and localization land while nothing in the
> UI can reach them, and the flip that makes them visible is the final beat. Before
> cutting a Z mid-milestone, confirm the in-flight work is still unreachable in the
> UI. If a beat can't be made inert, it must not land on `dev` until its Y is ready.

```
npm run deploy beta
```

`deploy beta` guards, then automates the whole merge: it refuses on a dirty
tree, unless local `dev` matches `origin/dev`, or if `v<version>` is already on
`main` (bump first). Then it checks out main → pulls → `merge dev --no-ff` →
auto-resolves the one known-safe recurring conflict
(`.github/workflows/supabase-migrations.yml`, take dev's) → pushes main →
**back-merges main into dev** (this is what stops the conflicts recurring) →
leaves you back on `dev`. It finishes by printing the watch-for-green reminder.

**If the merge hits any *other* conflict, the script STOPS** and prints exactly
what to do — it never auto-resolves anything unexpected on a release. Resolve by
hand: keep BOTH sides where they're different topics, and never use
`--ours`/`--theirs` on `docs/manual-runbook.md` (either silently drops a side).
Then finish as the script instructs:

```
git add <files>
git commit -m "Release vX.Y.Z"
git push origin main
git checkout dev && git merge main && git push origin dev   # back-merge — don't skip
```

Pushing `main` triggers the chain:
    migrate-production → sync-tts → smoke-check → publish-ready
`publish-ready` going green is the real success gate — VersionWatcher fails
closed on a missing release-ready marker, so a green Vercel deploy alone is NOT
enough. Chain internals + the three one-time Production secrets live in
`docs/tts-sync-runbook.md`.

### 6c. Watch for green checks (Actions tab)
The release is done when the workflow run on the `main` push is fully
green. The smoke-check job is the release verdict — it fails red on any
of:

| Failing check | Meaning | First move |
|---|---|---|
| 1. Version endpoint | Prod isn't serving the merged version | Usually a slow/failed Vercel deploy — check Vercel dashboard, re-run the job after the deploy lands |
| 2. Bucket key parity (prod ≥ dev) | Storage sync gap | Check the `sync-tts` job log for copy failures; re-run the workflow (sync is idempotent) |
| 3. Canary audio 200 | Uploaded audio isn't publicly reachable | Bucket/policy problem — check the bucket's public-access policy in prod |
| 4. Migration alignment | Prod DB schema ≠ repo migration files | Check the `migrate-production` job log; if the push failed, migrations are self-sufficient (explicit grants) — SQL-editor paste works as the manual fallback, then fix the workflow |

Re-running a red workflow is always safe: migrations and the TTS sync are
both idempotent.

---

## 7. Env var changes (either environment)

After changing any Vercel env var: **redeploy with build cache UNCHECKED**,
or the old value bakes in. `NEXT_PUBLIC_SUPABASE_URL` must be the API URL
(`https://<ref>.supabase.co`), never the dashboard URL.

---

## 8. One-time cleanups still pending

- **One-time secret adds for the release workflow (Production
  environment):** `DEV_SUPABASE_URL`, `DEV_SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (prod service role). Details in the
  workflow file header. The workflow is inert-but-red without them.
- **`E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` (Production environment) — see §9.**
  Until these exist the E2E workflow now fails red by design.
- Delete stale nested `reactor-lang/reactor-lang/` directory **before the
  next full-repo zip upload** for a release session.
- Exclude `node_modules` from future repo-zip uploads.
- ~~Verify §2 Playwright command against the actual package.json script
  name.~~ Done 2026-07-28 — it's `npm run test:e2e`; §2 corrected.
- Decide keep-or-gitignore on `tts-probe/` (~30 mp3s + `_manifest.json` +
  `scripts/tts-chirp-probe.mjs`, currently tracked; `tts-output/` is ignored).

---

## 9. E2E test account (authenticated suite)

`e2e/authenticated-flow.spec.js` covers 6 of the suite's 20 tests — sign-in,
the profile drawer, a Quick Quiz round, Lessons chrome, the dashboard, and the
explanations view. All 6 need a real account to sign in as.

**Why this is worth doing properly.** These 6 skipped silently in every CI run
for months. The workflow reported green while testing only the public pages —
and the v3.1.1 production bug (raw string keys rendered to every user in every
language) shipped under exactly that green-looking board. **As of 2026-07-28 the
spec FAILS in CI when the credentials are absent**, so the gap can't hide again.
Locally it still skips, so you can run the public suite without an account.

### 9a. Create the account (one time)

Use a **dedicated throwaway account** — never a personal or beta-tester one.
The suite plays rounds to completion and writes real history rows to whichever
Supabase project the build points at, which for this workflow is **prod**.

> **Do NOT flip `SIGNUPS_ENABLED` for this.** It reads like an env toggle but
> it is a hardcoded `const SIGNUPS_ENABLED = false` at the top of
> `app/auth/page.js`, and all it does is show/hide the "need an account?" link.
> Changing it means editing source, committing, and **deploying to `main`** —
> because the E2E workflow builds with the Production secrets, so the account
> has to exist in the **prod** Supabase project. That's two releases to the live
> beta branch, with public self-serve sign-up open on the real site in between,
> to create one test user. (Earlier versions of this doc and of the spec header
> said to flip it; that advice predates the flag becoming a compile-time const.)

**Create the user directly in Supabase instead** — no code change, no deploy,
nothing exposed publicly:

1. Supabase dashboard (**prod project**) → Authentication → Users → **Add user**.
   Use a plus-addressed email you control, e.g. `you+e2etest@example.com`, and a
   long random password. Tick **auto-confirm** so there's no email round-trip.
2. **Nothing to seed in user metadata** — the app gates for this itself:
   - `lib/RequireUsernameGate.js` loads the profile, and when there's no
     `username` it renders an inline form to set one. It never reads the
     `pending_username` that the sign-up form writes; that value is just how the
     sign-up path carries a chosen name across email confirmation.
   - `lib/RequireLegalGate.js` compares `user_metadata.legal_accepted_version`
     against `LEGAL_VERSION` and shows an accept form when they differ.

   Both are self-service, so a dashboard-created user with empty metadata simply
   gets prompted for the missing pieces on first sign-in.
3. **Sign in as the account once, by hand, in a browser**, and clear every gate —
   username, legal acceptance, then native language and at least one language via
   `/onboarding`. Both gates suppress themselves on `/auth`, `/onboarding`,
   `/terms` and `/privacy` and render as overlays everywhere else, so work
   through them starting from `/`.

   **This is the step that decides whether the suite works.** The gates render
   over `/` without changing the URL, so `beforeEach`'s `toHaveURL(/\/$/)` passes
   on a half-configured account — it looks signed in while an overlay silently
   eats every click the other five tests make. A fully cleared account is the
   difference between six passing tests and six confusing failures.
4. Play one round manually if you want the explanations test on solid ground —
   it seeds its own history, but an account with some history is closer to what
   that test assumes.

Nothing needs flipping back afterwards, because nothing was flipped.

**Alternative, if you'd rather use the app's own machinery:**
`/admin/beta-applications` approval calls `supabaseAdmin.auth.admin.inviteUserByEmail`,
which creates the account and sends an invite whose acceptance sets a password.
It needs a `beta_applications` row to approve and an email round-trip, so it's
more steps for the same result — but it exercises a path you actually ship.

### 9b. Wire it up

- **CI:** add `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` as **Environment
  secrets under `Production`** (Settings → Environments → Production →
  Environment secrets) — not repository-level secrets. `e2e-tests.yml`
  declares `environment: Production`, and repo-level secrets won't resolve.
- **Locally:** the same two vars in `.env.local` (both are listed, blank, in
  `.env.local.example`). Leave them blank to skip the authenticated half.
  `playwright.config.js` parses `.env.local` itself. It has to: Playwright runs
  as its own Node process and does **not** inherit Next.js's env loading, so
  before 2026-07-28 putting credentials in that file did nothing whatsoever —
  the app under test could see them, the spec that needed them could not, and
  the authenticated tests skipped regardless. A real shell env var still wins
  over the file.

### 9c. Verify

Push to `dev` and watch the **E2E tests** workflow. Green with 20 tests run per
browser project (not 14 run / 6 skipped) means it's wired. If the credentials are
missing you now get a named failing check, `authenticated-suite credentials are
configured`, whose message says exactly what to add and where.

**Watch this workflow on every release.** It was red and unnoticed before the
v3.2.0 session; a test suite nobody looks at is a suite that isn't running.

### 9d. Diagnosing a CI-only failure

A failed run uploads two artifacts (Actions → the run → Artifacts):

| Artifact | Contains | Use it for |
|---|---|---|
| `playwright-report` | the browsable HTML report | reading the run like a human |
| `playwright-test-results` | per-failure `test-failed-1.png`, `trace.zip`, `error-context.md` | working out *why* |

**`error-context.md` is usually the fastest answer** — it's an accessibility
snapshot of the page at the moment the assertion gave up, so it tells you which
screen the test was actually looking at. `npx playwright show-trace <trace.zip>`
gives a step-by-step replay when the snapshot isn't enough.

Neither existed before 2026-07-28: the config set `reporter: "github"` in CI,
and only the `html` reporter writes `playwright-report/`, so the upload step
found nothing on every single run and said so in a warning nobody read. The
reporter is now `[["github"], ["html"]]` and `test-results/` uploads too.

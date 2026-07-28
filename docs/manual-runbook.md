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

The entire release is: bump + rollup (§6a) → `npm run deploy beta` (§6b) →
watch for green (§6c). No manual merge, no manual prod uploads, no env swapping.

> Tier naming: `main` is the **beta-prod** tier (your beta testers). The real
> live-prod branch isn't stood up yet — `npm run deploy prod` is reserved and
> errors until it is.

### 6a. Version bump + changelog rollup

**Set `CURRENT_VERSION` in `lib/version.js` to the version being cut — a plain
`X.Y.Z`, no suffix.** The `-beta.N` scheme is **retired**; v3.1.1 and v3.2.0 both
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

Prereqs: `lib/version.js` bumped, the cut version's `unreleased/` fragments rolled
up, everything committed **and pushed** on `dev` (via §3). Then, from a clean tree:

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

1. Temporarily flip `SIGNUPS_ENABLED` to `true`.
2. Sign up through the normal flow with a plus-addressed email you control,
   e.g. `you+e2etest@example.com`. Use a long random password.
3. **Complete onboarding fully** — username, native language, at least one
   language selected. The suite asserts it lands on `/` right after sign-in, so
   an account still sitting behind an onboarding gate fails `beforeEach`.
4. Flip `SIGNUPS_ENABLED` back to `false`.

### 9b. Wire it up

- **CI:** add `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` as **Environment
  secrets under `Production`** (Settings → Environments → Production →
  Environment secrets) — not repository-level secrets. `e2e-tests.yml`
  declares `environment: Production`, and repo-level secrets won't resolve.
- **Locally:** the same two vars in `.env.local` (both are listed, blank, in
  `.env.local.example`). Leave them blank to skip the authenticated half.

### 9c. Verify

Push to `dev` and watch the **E2E tests** workflow. Green with 20 tests run
(not 14 run / 6 skipped) means it's wired. If the credentials are missing you
now get a named failing check, `authenticated-suite credentials are configured`,
whose message says exactly what to add and where.

**Watch this workflow on every release.** It was red and unnoticed before the
v3.2.0 session; a test suite nobody looks at is a suite that isn't running.

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
npx playwright test  # E2E — verify this matches the actual script name in package.json
```

Skip for copy tweaks and script-only changes (those are verified in-session
via `node --check` + dry-runs).

---

## 3. Commit & deploy to dev

Every delta must include a changelog fragment (§4) — check it's present
before committing.

```
git checkout dev
git add -A
git commit -m "short description of the session's work"
git push
```

Pushing `dev` triggers: Vercel Preview deploy + migrations workflow →
**staging** Supabase. Note: the workflow's old `paths` filter is gone, so
the staging migration job now runs on *every* dev push — an idempotent
no-op when no new migration files exist. This is deliberate (the filter
would have skipped the release sync/smoke jobs on no-migration releases).

---

## 4. Changelog fragments (every delta)

One fragment per delta at `docs/changelog/unreleased/YYYY-MM-DD-slug.md`.
Format, rules, and the rollup procedure live in `docs/changelog/README.md`.
Unique filenames = no parallel-chat collisions; `lib/version.js` remains
solely owned by the deepening/ledger chat.

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

---

## 6. Cutting a release (prod)

The entire release is: bump + rollup → merge → watch for green. No manual
prod uploads, no env swapping.

### 6a. Version bump + changelog rollup (deepening/ledger chat)
- New `-beta.N` in `lib/version.js` (any change to a built deliverable =
  new increment, never repackage)
- Roll up `docs/changelog/unreleased/` per `docs/changelog/README.md`:
  fragments → release notes (regrouped by feature area) → move fragments
  to `released/vX.Y.Z-beta.N/`

### 6b. Merge to main

```
git checkout main
git pull
git merge dev --no-ff -m "Release vX.Y.Z-beta.N"
git push
git checkout dev
```

Edit the version in `-m` to match `lib/version.js`. `--no-ff` guarantees a
merge commit exists to carry the message (a fast-forward would silently
drop it). Forgot to edit before pushing? `git commit --amend -m "..."` —
but only before push.

Pushing `main` triggers, in order:
- Vercel Production deploy (parallel, outside Actions)
- "Deploy Supabase migrations" workflow: `migrate-production` →
  `sync-tts` (mirrors dev `tts-audio` bucket to prod) → `smoke-check`

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
- Delete stale nested `reactor-lang/reactor-lang/` directory **before the
  next full-repo zip upload** for a release session.
- Exclude `node_modules` from future repo-zip uploads.
- Verify §2 Playwright command against the actual package.json script name.

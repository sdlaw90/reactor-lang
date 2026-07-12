# SquirreLingo — Manual Commands Runbook

> Standing reference for every manual step in the dev → release loop.
> Build notes in session handoffs will reference this doc instead of
> restating commands. Update here when a step changes.

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

```
git checkout dev
git add -A
git commit -m "short description of the session's work"
git push
```

Pushing `dev` triggers: Vercel Preview deploy + migrations workflow →
**staging** Supabase (workflow watches `main` + `dev`).

---

## 4. TTS per-track sequence (dev)

Requires `.env.local` with the GCP API key and Supabase service role key
(dev/staging values).

```
node scripts/generate-tts.mjs --track <trackId> --dry-run     # review counts + review.txt flags
node scripts/generate-tts.mjs --track <trackId> --limit 10    # audition clips → tts-output/<trackId>/ (LOCAL only)
# listen to the clips, approve voice/rate
node scripts/generate-tts.mjs --track <trackId> --upload      # only this step touches the Supabase bucket
```

Flags:
- `--voice <name>` — override the `TRACK_VOICES` default for auditioning alternatives
- `--force` — regenerate existing clips; only needed if an SSML rule change alters output for an already-uploaded track (es/frCa currently do NOT need it)

New track = add its entry to `TRACK_VOICES` after the audition verdict.
Voice preflight hard-fails if a configured voice doesn't exist for its
exact locale — that's intentional, never bypass it.

---

## 5. Cutting a release (prod)

Order matters — DB and audio before the code that expects them.

### 5a. Version bump
Handled in the deepening/ledger chat (`lib/version.js`, new `-beta.N`).
Any change to an already-built deliverable = new increment, never repackage.

### 5b. Apply pending migrations to prod Supabase
Whatever migrations shipped since last release (currently pending:
`00000000000014_tts_audio_bucket.sql`). Via SQL editor paste or CLI —
migrations are self-sufficient (explicit grants), so either works.

### 5c. Prod TTS uploads (when a release includes new track audio)
Run with **prod** env values in `.env.local`:

```
node scripts/generate-tts.mjs --track esForEn --upload
node scripts/generate-tts.mjs --track frCaForEn --upload
```

(Neither needs `--force`.) Restore dev env values afterward.

### 5d. Merge to main

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

Pushing `main` triggers: Vercel Production deploy + migrations workflow
against prod.

---

## 6. Env var changes (either environment)

After changing any Vercel env var: **redeploy with build cache UNCHECKED**,
or the old value bakes in. `NEXT_PUBLIC_SUPABASE_URL` must be the API URL
(`https://<ref>.supabase.co`), never the dashboard URL.

---

## 7. One-time cleanups still pending

- Delete stale nested `reactor-lang/reactor-lang/` directory **before the
  next full-repo zip upload** for a release session.
- Exclude `node_modules` from future repo-zip uploads.

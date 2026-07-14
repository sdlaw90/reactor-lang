# SquirreLingo — Technical Architecture

> Orientation + handoff reference for the whole codebase. Written against the
> repo state at **v2.31.0-beta.2** (2026-07-14). This is the "how it all fits
> together" doc; the operational how-to lives in `manual-runbook.md`,
> `tts-pipeline.md`, and `tts-sync-runbook.md`, and the current work state
> lives in `squirrelingo-state-of-the-app.md`. This doc explains structure and
> intent, not step-by-step commands.

---

## 1. One-screen orientation

SquirreLingo is a **Next.js 14 App Router** app on **Supabase** (Postgres +
Auth + Storage), hosted on **Vercel**, with **GitHub Actions** running
migrations, TTS sync, and the release smoke-check. It's a client-heavy PWA: the
learning content ships in the JS bundle (`data/tracks/*`), a small generic
engine (`lib/gameEngine.js`) turns that content into rounds, and Supabase only
stores per-user *state* (progress, missed/seen questions, answer history,
profile). Audio is pre-generated MP3s in a Supabase Storage bucket.

The mental model in three layers:

- **Content** (`data/`) — plain JS data: tracks, word lists, writing systems. Zero user state, zero engine logic. Adding a language is mostly a data-file job.
- **Engine + UI** (`lib/`, `app/`) — the language-agnostic machinery (round building, mastery, streaks, placement) plus the React pages that render it.
- **Platform** (`supabase/`, `scripts/`, `.github/`) — persistence, the audio pipeline, and the automated dev→prod release chain.

The load-bearing architectural rule everything else serves: **merging `dev → main`
must make prod equal dev across every surface with zero manual effort** — code
(Vercel), DB schema (migrations), and audio (sync-tts). See §9.

---

## 2. Tech stack & environment topology

| Concern | Tool | Notes |
|---|---|---|
| Framework | Next.js 14.2.x (App Router) | React 18, `reactStrictMode`. No TypeScript. |
| UI | React + inline styles + `lucide-react` icons | No component framework; theme via `lib/theme.js` + `styles/globals.css`. |
| Auth / DB / Storage | Supabase (`@supabase/supabase-js` v2) | Postgres with RLS, GoTrue auth, Storage buckets (`avatars`, `tts-audio`). |
| Hosting | Vercel | Deploys on git push. Free/Hobby now; **Pro is mandatory the day it monetizes** (Hobby bars commercial use). |
| CI | GitHub Actions | Migrations, TTS sync, smoke-check, E2E. Secrets under the **Production** environment. |
| Email | Resend | Transactional + Supabase custom SMTP (separate keys). Gated on domain setup (#65). |
| TTS | Google Cloud TTS REST (API-key auth, no SDK) | Pre-generated MP3s, content-hash keyed. |
| Tests | Playwright (E2E) | `e2e/*.spec.js`; runs in CI (the dev sandbox can't download a browser). |

**Two Supabase projects, mapped to two branches:**

- `main` → **Production** project (Production-environment secrets)
- `dev` → **Staging** project (Staging-environment secrets; jobs fail fast if that env/project doesn't exist yet)

Vercel has its own Preview/Production scoping for env vars. The `beta` branch
still exists in the E2E trigger list but the live release flow is `dev → main`.

**Env vars** (`.env.local.example` is the canonical list): public Supabase URL +
anon key (client), `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypasses RLS —
never `NEXT_PUBLIC_`), `NEXT_PUBLIC_ADMIN_EMAIL` (owner bootstrap),
`NEXT_PUBLIC_SITE_URL`, `ADMIN_API_SECRET` (break-glass password tool),
`GOOGLE_TTS_API_KEY` (generation only), and Resend keys.

---

## 3. Repository map

Annotated to directory level, with notable files called out. Build/vendor dirs
(`node_modules/`, `.next/`, `.git/`, `tts-output/`, `supabase/.temp/`) omitted.

```
reactor-lang/
├── app/                      # Next.js App Router — every route is a folder
│   ├── layout.js             # Root layout; mounts the 5 global client widgets (§11)
│   ├── page.js               # Home / track picker (grouped by language family)
│   ├── error.js              # Route-level error boundary
│   ├── global-error.js       # Whole-app error boundary (last resort)
│   ├── icon.svg              # App icon
│   ├── play/[trackId]/       # ★ Core gameplay loop (Quick Quiz + Lessons), 1053 lines
│   ├── learn/[trackId]/      # Lessons-mode entry / lesson picker
│   ├── listen/[trackId]/     # Listening module surface (roadmap; audio-excluded from aggregates)
│   ├── speak/[trackId]/      # Speaking module surface (roadmap)
│   ├── placement/[trackId]/  # CEFR placement quiz (A1–C2 sampler)
│   ├── script/[trackId]/     # Generic writing-system trainer (kana/hangul/cyrillic/hanzi)
│   ├── dashboard/            # Aggregate stats (slated for retirement, #84)
│   ├── onboarding/           # First-run native-language + placement flow
│   ├── auth/                 # Sign in / sign up
│   ├── forgot-password/  reset-password/  # Self-serve recovery (security-question path)
│   ├── settings/             # Renders lib/SettingsPanel.js
│   ├── about/  help/  changelog/  whats-new/  terms/  privacy/   # Static-ish content pages
│   ├── beta-apply/           # Public beta application (auto-approve interim)
│   ├── feedback/             # bug/ + feature/ report forms (+ index)
│   ├── admin/                # Admin hub — dashboard, users, applications, feedback, errors, reset-requests
│   │   ├── page.js           # Hub shell + section switcher
│   │   ├── *Section.js       # One component per admin tab
│   │   ├── adminApi.js       # Client helpers that call /api/admin/* with the session token
│   │   ├── beta-applications/ set-password/   # Standalone admin sub-pages
│   └── api/                  # Route handlers (server-side; see §7, §10)
│       ├── admin/            # overview, users, feedback, errors, reset-requests, me (all gated)
│       ├── admin-set-password/   # Break-glass, secret-gated (works when locked out)
│       ├── beta-apply/  approve-beta-application/
│       ├── submit-feedback/  log-error/  notify-change/  account-security/  password-reset/
│
├── data/                     # ★ All learning content — pure data, no state
│   ├── tracks/               # One file per track (15 tracks) + index.js registry
│   │   ├── index.js          # TRACKS map, getTrack(), listTracks(), tracksForNativeLang()
│   │   ├── esForEn.js …       # Curated banks + Word Bank wiring per track
│   ├── vocab/                # Frequency word lists feeding the Word Bank generator
│   │   ├── esLatAmWords.js  frCaWords.js  deWords.js  jaWords.js
│   └── scripts/              # Writing-system definitions for the /script trainer
│       ├── index.js          # SCRIPTS registry, scriptForTrack(), glyphPracticeId()
│       ├── kanaJa.js  hangulKo.js  cyrillicRu.js  mandarinZh.js
│
├── lib/                      # ★ Engine + shared UI + client services
│   ├── gameEngine.js         # Round building, freshness, mastery, streaks, placement (language-agnostic)
│   ├── frequencyVocab.js     # Word Bank generator: word list → standard bank entries
│   ├── audioKey.js           # cyrb53 content-hash keying for TTS clips (shared Node + client)
│   ├── skillLevels.js        # CEFR ordering + skill-level → CEFR-bias mapping
│   ├── db.js                 # All Supabase reads/writes (profile, progress, missed, seen, explanations)
│   ├── supabaseClient.js     # Browser Supabase client (anon key)
│   ├── adminAuth.js          # Server-side admin/owner gate for /api/admin/*
│   ├── AudioButton.js        # Speaker button; resolves clips via per-track manifest.json
│   ├── SettingsPanel.js      # The entire settings surface (1207 lines; lives in nav drawer)
│   ├── VersionWatcher.js     # Polls version.json + release-ready marker → "update available"
│   ├── theme.js              # Base palette + per-track animated gradient themes
│   ├── playStrings.js        # UI-string table + native/target language chrome switching
│   ├── version.js            # ★ Version ledger: CURRENT_VERSION + full CHANGELOG (single source of truth)
│   └── … (gates, avatar, password, security-questions, error reporting, misc UI)
│
├── scripts/                  # ★ Build + release + TTS tooling (Node)
│   ├── generate-tts.mjs      # Synthesize clips via Google TTS → tts-output/ → (optional) upload
│   ├── sync-tts.mjs          # Mirror dev tts-audio bucket → prod (copy-only, CI)
│   ├── smoke-check.mjs       # Post-release checks 1–3 (version, parity, canary audio)
│   ├── publish-ready.mjs     # Writes release-ready.json marker (gates the update prompt)
│   ├── sweep-tts.mjs         # Guarded orphan-clip cleanup (defaults to dev; --delete opt-in)
│   ├── generate-version-json.js  # Pre-build: mirrors CURRENT_VERSION → public/version.json
│   └── deploy.js             # deploy helper
│
├── supabase/
│   ├── migrations/           # ★ Source of truth for schema (00000000000000–14)
│   ├── schema.sql            # Full snapshot — MANUAL FALLBACK ONLY (paste-into-SQL-editor)
│   └── migrations.zip        # packaged copy
│
├── docs/                     # Runbooks + changelog fragments + email templates
│   ├── manual-runbook.md  tts-pipeline.md  tts-sync-runbook.md  INTEGRATION-NOTES.md
│   ├── supabase-*-email.html # Auth email templates
│   └── changelog/            # unreleased/ fragments → released/vX.Y.Z-beta.N/ at ship time
│
├── e2e/                      # Playwright: public-pages.spec.js + authenticated-flow.spec.js
├── styles/globals.css        # Global CSS (animations, base layout)
├── public/version.json       # Build-generated; polled by VersionWatcher (may be stale in-repo)
├── .github/workflows/        # supabase-migrations.yml (release chain) + e2e-tests.yml
├── next.config.mjs  playwright.config.js  .eslintrc.json  package.json
```

**★ = the files you'll touch or reason about most.** If you read only five to
re-orient: `gameEngine.js`, a track file (`esForEn.js`), `db.js`,
`sync-tts.mjs`, and `.github/workflows/supabase-migrations.yml`.

---

## 4. The content model

### Tracks

A **track** is a plain object (see any `data/tracks/*.js`) registered in
`data/tracks/index.js`. There are 15: 14 target-language tracks for English or
Spanish speakers, plus the first native-language track (`enForIt`, English for
Italian speakers). Key fields:

- `id`, `label`, `nameEn`/`nameEs`, `sublabel`, `theme`
- `nativeLang` / `targetLang` — drive placement and which tracks a learner is offered (`tracksForNativeLang`)
- `cats` — category id → `{ label, color }` (e.g. `vocab`, `verbo`, `trad`, `fono`, `fvocab`)
- `bank` — the curated question banks, keyed by category
- `wbCatId` — marks the Word Bank category so the engine caps its round share
- `extraCatId` / `extraBank` — the phonetics "pair" category (identify + respond)
- `perCat`, `extraPairsPerRound`, `questionTime`, `extraQuestionTime` — round tuning

### The 7-slot question tuple

Curated questions are terse arrays, flattened by `gameEngine.flattenBank` into
objects with stable positional ids (`vocab-3`):

```
[ prompt, options[], correctIdx, explain{en,es}, difficulty, promptEn?, promptNative? ]
   0        1          2          3               4           5         6
```

- **slot 4** `difficulty` — CEFR tier (`A1`–`C2`), drives skill-bias and placement.
- **slot 5** `promptEn` — *replaces* the prompt for cross-native viewers.
- **slot 6** `promptNative` — a small native-language subtitle *under* the prompt (`{ en: "..." }`), hidden at advanced levels and never shown on placement.

**Positional ids are load-bearing**: they key `seen_questions` / `missed_questions`
and mastery. Inserting a question mid-bank shifts every later id — hence audio is
keyed by content hash, not id (§8), and why bank edits touch user state carefully.

### Word Bank (frequency vocab)

`lib/frequencyVocab.js` turns a compact word list into standard 7-slot entries
**at module load**, so rounds/mastery/freshness/placement need zero engine
changes. Word tuple: `[word, gloss, pos, tier, note?]`. It alternates
recognition (even index) and production (odd) questions, and picks 3
deterministic distractors from the same part-of-speech (seeded PRNG + a
gloss-overlap filter so near-synonyms can't yield two right answers).

Language strings are **formulas** a track overrides (`SPANISH_FORMULAS` default;
German passes `DE_FORMULAS` and deliberately does *not* auto-capitalize
headwords, since German capitalization is grammatical). **Invariant:** the seed
and Spanish defaults must stay byte-identical — shipped mastery/seen state and
TTS clip keys depend on an identical generated bank.

### Writing systems

`data/scripts/*` define non-Latin scripts (kana, hangul, cyrillic, mandarin),
consumed by the single generic `/script/[trackId]` page. Adding a script = a
data file + one registry line. Script practice **never gates** regular content;
tracks without a script simply hide the third mode toggle.

---

## 5. The game engine (`lib/gameEngine.js`)

Entirely language-agnostic — it only knows the track *shape*. Core functions:

- **`buildRound(track, mode, missedIds, seenAt, cefrSet, options)`** — the heart. Mixed mode pulls `perCat` from each curated category, adds phonetics pairs, and mixes in a *capped share* (default 30%, `wbShareCap`) of Word Bank items that **replace** rather than inflate the round. `categoryFilter` restricts to a chosen subset (mix-and-match). `review` mode draws only from the missed pile.
- **`pickForLevelAndFreshness`** — three-group sort: at-level first, then above (a slight stretch beats rehashing), then below (de-weighted hardest), with freshness breaking ties. Falls back gracefully if a level is thin.
- **`pickFreshest`** — least-recently-seen bias, drawing from the fresher half so repeats spread out without hard-blocking anything.
- **`computeMastery(track, seenAt, missedIds)`** — per-category, per-CEFR "learned vs total," where *learned* = seen at least once AND not currently missed. Uses only data the app already tracks.
- **`computeStreakUpdate(progress, today)`** — the **never-punish streak**: a missed day holds the streak steady (never resets to 1), and only genuinely consecutive days climb it. Returns any crossed `STREAK_MILESTONES` for a celebration. Escalating milestone XP is the dopamine mechanic *instead of* loss-aversion.
- **`buildPlacementQuiz`** — samples a few items per CEFR tier across the full A1–C2 range so both true beginners and fluent speakers place correctly.
- **`buildLessonSequence`** — ordered easiest-first walk through one category for Lessons mode (vs. the randomized sample Quick Quiz uses).

The play page (`app/play/[trackId]/page.js`, 1053 lines) is the stateful shell:
a `screen` state machine (`start | playing | result | explain | archive`) plus
two modes (Quick Quiz timed/combo, Lessons calm/untimed) sharing this engine.

---

## 6. Data & persistence (`supabase/` + `lib/db.js`)

**All DB access funnels through `lib/db.js`** (client-side, anon key, RLS-enforced).
Tables (from `schema.sql` / migrations):

| Table | Shape | Purpose |
|---|---|---|
| `progress` | PK `(user_id, track_id)` | xp, level, streak, best_combo, last_played, rounds_completed, skill_level, level counts |
| `missed_questions` | PK `(user_id, track_id, question_id)` | Row present = in the missed pile; delete = resolved |
| `seen_questions` | same PK + `seen_at` | Freshness ("don't repeat too soon") |
| `explanations` | `bigint identity` PK | One row per answered question ever; "recent" vs "archive" is just pagination over this one table |
| `profiles` | per user | username, avatar, native lang/country, skill, `is_admin` |
| `feedback_submissions`, `beta_applications`, `error_logs` | — | Bug/feature reports, beta apps, client error capture |
| `security_questions`, `password_reset_tokens`, `password_reset_requests` | — | Self-serve recovery (email-independent, since #65 isn't done) |

**RLS everywhere**: every user-data table is locked so `auth.uid() = user_id` —
enforced by Postgres, not just app code. Convention: PKs use
`bigint generated always as identity`, **never** `gen_random_uuid()` (migration
004 failed on that — pgcrypto isn't enabled). Migrations must be idempotent and
self-contained (a clean `db push` onto a fresh project can't assume default
grants — hence migrations 012/013).

`schema.sql` is a **manual fallback snapshot only**; `supabase/migrations/` is
the automated source of truth.

---

## 7. Auth, admin, and the owner tier

- **Auth** is Supabase GoTrue. The browser client (`supabaseClient.js`) carries the anon key; the session token authorizes RLS.
- **Server routes** that need elevated access use the **service role key** (bypasses RLS) and live under `app/api/`. Every `/api/admin/*` route calls `requireAdmin` / `adminGate` (`lib/adminAuth.js`) first.
- **"Admin"** = `profiles.is_admin = true` OR email matches `ADMIN_EMAIL`/`NEXT_PUBLIC_ADMIN_EMAIL` (the env bootstrap that works before the column exists).
- **Owner tier (#76)**: the env-bootstrap email is the *owner* — undemotable, untouchable by any admin action, and the only one who can grant/revoke admin. Ownership is defined purely by the env var, so it can't be changed through the app.
- **Break-glass** (`/api/admin-set-password`, `ADMIN_API_SECRET`) is deliberately *not* behind `requireAdmin` — it must work when you're locked out of your own account.

Feedback/bug flows also route through the server (`/api/submit-feedback`) so the
sender's identity comes from their session token (never typed, never spoofable)
and screenshots land in a private bucket.

---

## 8. The TTS pipeline

Four scripts, one bucket (`tts-audio`), content-hash clip identity.

**Clip keying (`lib/audioKey.js`, shared by Node + client):** clips are keyed by
`cyrb53(normalizeSpokenText(text))` — a hash of the *spoken text*, not the
question id. This survives content reordering, dedupes identical prompts, and
makes regeneration idempotent. Path convention: `tts-audio/<trackId>/<key>.mp3`
(or voice-keyed `<key>-<voice>.mp3` for tracks in `VOICE_KEYED_TRACKS`).

1. **`generate-tts.mjs`** — extracts spoken prompts, synthesizes each once via Google TTS REST, writes to `tts-output/<id>/`, optionally uploads to dev. Prompt-only (options/explanations/`promptNative` not spoken). Phonetics `extraBank` is **excluded** (speaking `item.text` would answer the identify question). Per-language `LANG_RULES` handle SSML quirks (production prompts wrap the embedded English word in a `<lang>` span; French elision-aware). **Voice preflight hard-fails** on a missing voice rather than silently substituting a neighboring dialect (never fr-FR for fr-CA — dialect fidelity is the product). Per-track voices in `TRACK_VOICES`.
2. **`sync-tts.mjs`** — mirrors the dev bucket → prod in CI. **Copy-only, never deletes.** MP3s are content-addressed so an existing name is byte-identical and skipped; `manifest.json` isn't content-addressed so it's always re-copied. Refuses to run if source URL == target URL.
3. **`smoke-check.mjs`** — checks 1–3: prod serves valid `/version.json`; **manifest-`f` parity** (every clip a dev manifest claims exists in prod — a *superset* check, inert prod orphans are fine); a canary clip's public URL returns 200 audio. (Check 4, migration alignment, is a shell step in the workflow.)
4. **`publish-ready.mjs`** — writes `release-ready.json` to the bucket root as the *last* chain step (§9).
5. **`sweep-tts.mjs`** — guarded orphan cleanup; defaults to dev, needs `--delete` + non-dev guard to touch prod. Used out-of-band, never in the release chain.

**Playback (`lib/AudioButton.js`):** the client fetches each track's
`manifest.json` once per session (module-cached) and resolves clip filenames
from the manifest's per-clip `f` field — **it never constructs filenames**, so
plain and voice-keyed schemas both work. The button renders only if a clip
exists for the exact displayed text (so `promptEn` substitutions and unsynth'd
phonetics simply show no button — no 404 probing). Never autoplays, one clip at
a time, and touches **no progress aggregates** (standing rule until the
listening module exists).

---

## 9. Release architecture & CI

**The standing requirement:** `dev → main` alone makes prod = dev everywhere,
with zero manual steps. Three surfaces stay in sync automatically:

| Surface | Mechanism |
|---|---|
| Code | Vercel deploys on git push |
| DB schema | `migrate-production` (`supabase db push`) in CI |
| Audio | `sync-tts` mirrors the bucket in CI |

**`.github/workflows/supabase-migrations.yml`** fires on push to `main` or `dev`:

- `main` → `migrate-production` → `sync-tts` → `smoke-check` → `publish-ready`
- `dev` → `migrate-staging` (idempotent no-op when nothing's pending)

The old `paths:` filter was **removed on purpose** — with it, a release with no
new migrations would skip the whole workflow and silently not run sync/smoke.

**The update-prompt gate:** Vercel finishes before CI, so the app could serve
new `version.json` while audio is still syncing. The client ANDs *two* signals —
app `version.json` (Vercel) **and** `release-ready.json` (written last by
`publish-ready` only if the whole chain passed). A broken release never advances
the marker, so it never prompts.

**Branch discipline:** nothing merges to `dev` unless releasable; experimental
work stays in feature branches. **Version ledger** (`lib/version.js`,
`CURRENT_VERSION` + `CHANGELOG`) has a single owner (the deepening/ledger chat);
parallel chats ship code-only, no version files. `public/version.json` is
build-generated by `generate-version-json.js` (so the in-repo copy can lag
`version.js` — that's expected). **Post-release back-merge** `main → dev` keeps
conflict resolutions from re-colliding.

**Changelog fragments:** each change drops
`docs/changelog/unreleased/YYYY-MM-DD-slug.md`; at ship time they roll up into
`released/vX.Y.Z-beta.N/`. Unique filenames prevent parallel-chat collisions.

Migrations are idempotent; **destructive ops (drops, data rewrites) stay
manual** and are never merged as migration files for CI to pick up.

---

## 10. Routing surface

**Pages** (App Router, `app/*/page.js`): home/track-picker, `play`/`learn`/
`listen`/`speak`/`placement`/`script` (all `[trackId]`), `onboarding`, `auth`,
`forgot-password`/`reset-password`, `settings`, `dashboard`, content pages
(`about`/`help`/`changelog`/`whats-new`/`terms`/`privacy`), `beta-apply`,
`feedback` (bug/feature), and the `admin` hub.

**API route handlers** (`app/api/*/route.js`):

| Route | Purpose |
|---|---|
| `admin/{overview,users,feedback,errors,reset-requests,me}` | Admin data, all `adminGate`-protected |
| `admin-set-password` | Break-glass, `ADMIN_API_SECRET`-gated |
| `beta-apply` / `approve-beta-application` | Application intake (server-validates email) + approval |
| `submit-feedback` | Bug/feature reports (identity from session token, screenshot to private bucket) |
| `log-error` | Global client-error capture → `error_logs` |
| `account-security` | Security-question hashing (answers hashed server-side, never returned) |
| `password-reset` | Self-serve reset (email-independent path) |
| `notify-change` | Account-change notification emails (Resend) |

---

## 11. Client-side systems

Five global widgets mount once in `app/layout.js`:

- **`VersionWatcher`** — polls `version.json` + the release-ready marker; surfaces "update available" only when both agree (§9).
- **`RequireUsernameGate`** / **`RequireLegalGate`** — force username + ToS/PP acceptance before use.
- **`WelcomePopup`** — versioned first-run welcome (`welcomeVersion.js`).
- **`GlobalErrorLogger`** — captures crashes/unhandled errors into the same pipeline as bug reports (`errorReporting.js` → `/api/log-error`).

Other notable client pieces: **`SettingsPanel.js`** (the whole settings surface —
profile picture, username, email, password, recovery, native language/country,
gameplay; lives in the nav drawer, not a page), **`theme.js`** (per-track
animated CSS gradients, no images/flags), **`playStrings.js`** (UI-string table +
native↔target chrome switching by skill level), and the CEFR/skill-level UI in
`skillLevels.js`.

---

## 12. Conventions & invariants (the load-bearing rules)

- **Never-punish, broadly.** No progress wipes, no visible decrements; wrong answers affect mastery *eligibility* only. Streaks hold on a missed day. Applies to every mechanic, not just streaks.
- **Positional question ids are state keys.** Bank edits shift ids → handle seen/missed/mastery carefully. Audio dodges this via content-hash keys.
- **Word Bank determinism.** Same seed + identical generated bank, always (mastery ids and TTS keys depend on it). Spanish default formulas stay byte-identical.
- **Voice preflight hard-fails**; never substitute a neighboring dialect.
- **TTS sync is copy-only**; CI never gets prod delete rights. Orphans are inert.
- **Migrations:** idempotent, self-contained, `bigint identity` (not uuid), no assumed grants. Destructive ops stay manual.
- **Secrets** live under the GitHub **Production** environment; any job using them declares `environment: Production`.
- **Service role key is server-only** — never `NEXT_PUBLIC_`, never in the Vercel client bundle.
- **Audio excluded from all aggregates** until the listening module exists.
- **CJK:** native script + romanization together.
- **Settings** live in the nav drawer, not a separate page.
- **One chat = one task/release**; orient from the state-of-app doc, produce an updated one at session end.
- **Zip delivery:** package inside a root `reactor-lang/` folder; code-only overlay zips carry no version files.

---

## 13. Known stale/backlog items visible in the code

Surfaced while mapping — small, non-urgent, fix-at-next-touch:

- `data/tracks/deForEn.js` header comment still cites Neural2-A/B, but `TRACK_VOICES` uses `de-DE-Neural2-G`. Comment-only drift.
- `lib/audioKey.js` ~line 46 comment says `<key>.mp3` — stale vs. the voice-keyed schema. Comment-only.
- `lib/db.js` `submitFeedback` and `submitBetaApplication` are marked RETIRED with no remaining callers — safe to delete once confirmed unused.
- `public/version.json` in-repo shows `2.30.0-beta.1` while `CURRENT_VERSION` is `2.31.0-beta.2` — expected (build-generated), but worth knowing it's not authoritative.
- Structural content validator described in the business plan is still absent from the repo (handled ad hoc).
- Runbook §2 has a Playwright command vs. `package.json` script-name mismatch.
- Optional prod orphan sweep deliberately deferred (old plain-keyed clips are inert).

---

## 14. Where to look for X

| I want to… | Go to |
|---|---|
| Add/deepen a language | `data/tracks/<track>.js` (+ `data/vocab/` for Word Bank), register in `data/tracks/index.js` |
| Change how rounds are built | `lib/gameEngine.js` |
| Change mastery/streak/placement logic | `lib/gameEngine.js` + `lib/skillLevels.js` |
| Touch persistence / add a table | `lib/db.js` + `supabase/migrations/` (and mirror into `schema.sql`) |
| Work on audio generation | `scripts/generate-tts.mjs` + `docs/tts-pipeline.md` |
| Work on the release chain | `.github/workflows/supabase-migrations.yml` + `scripts/{sync-tts,smoke-check,publish-ready}.mjs` + `docs/tts-sync-runbook.md` |
| Change settings UI | `lib/SettingsPanel.js` |
| Change admin/permissions | `lib/adminAuth.js` + `app/api/admin/*` + `app/admin/*` |
| Bump the version / changelog | `lib/version.js` (ledger-chat-owned) |
| Run through manual steps | `docs/manual-runbook.md` |
| Check current state / next task | `squirrelingo-state-of-the-app.md` |
```

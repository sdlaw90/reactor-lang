# SquirreLingo — Codebase Reference (file-by-file)

> The exhaustive companion to `architecture.md`. Where that doc explains *how
> the systems fit together*, this one annotates *every file* so a new
> contributor (or future-you on a cold start) can find and understand any file
> without opening it first. Written against **v2.33.0-beta.2** (2026-07-19).
>
> Read `architecture.md` first for the mental model; use this as the index.
> `★` marks the files you'll touch or reason about most.

---

## 0. Fast local setup (onboarding walkthrough)

1. **Supabase project** — create one (free tier). In the SQL Editor, paste and run `supabase/schema.sql` (creates every table + RLS). This is the manual path; CI uses `supabase/migrations/` instead.
2. **Env** — copy `.env.local.example` → `.env.local`, fill in the Supabase URL + anon key, `NEXT_PUBLIC_ADMIN_EMAIL` (your email = the owner account), and `SUPABASE_SERVICE_ROLE_KEY` (server-only). TTS + Resend keys are optional until you need audio/email.
3. **Install & run** — `npm ci` (never `npm install`), then `npm run dev`. `predev`/`prebuild` auto-run `generate-version-json.js` first.
4. **Sign in** — public sign-up is flag-gated off in closed beta (`app/auth/page.js`); create your account via the beta-apply flow or Supabase dashboard. Your admin/owner status comes from the `NEXT_PUBLIC_ADMIN_EMAIL` match.
5. **Where things live** — content in `data/`, engine + UI in `lib/` and `app/`, platform in `supabase/`/`scripts/`/`.github/`. Adding a language is mostly a `data/tracks/` + `data/vocab/` job.
6. **Tests** — `npm run test:e2e` (Playwright). The public-page suite needs no account; the authenticated suite skips cleanly without `E2E_TEST_*` creds.

Conventions that will bite if ignored: `npm ci` not `install`; `bigint identity` PKs not uuid; secrets under the GitHub **Production** environment; service role key never `NEXT_PUBLIC_`; one chat = one task/release; delivered zips packaged inside a root `reactor-lang/` folder.

---

## 1. Root

| File | What it is |
|---|---|
| `package.json` | Deps (Next 14.2.x, React 18, `@supabase/supabase-js`, `lucide-react`) + scripts (`dev`/`build` prepend version-json gen; `deploy`, `test:e2e`). Name is `squirrelingo`. |
| `package-lock.json` | Lockfile — always `npm ci` against it; regenerate + verify when deps change. |
| `next.config.mjs` | Minimal: `reactStrictMode: true`. Nothing else. |
| `playwright.config.js` | E2E test config. |
| `.eslintrc.json` | `eslint-config-next`. |
| `README.md` | Setup guide (Supabase → env → deploy). Slightly stale on track list (says "four tracks"). |
| `.env.local.example` | ★ Canonical env-var list with inline explanations. The reference for what every secret is. |
| `.env.local` | Local secrets (gitignored in practice; present in this zip — don't commit real values). |
| `.gitignore` | Ignore rules. |

---

## 2. `app/` — routes (Next.js App Router)

Every folder with a `page.js` is a route. `[trackId]` folders are dynamic.

### Shell & error handling

| File | What it does |
|---|---|
| `layout.js` | ★ Root layout. Imports global CSS and mounts the 6 always-on client widgets: `VersionWatcher`, `RequireUsernameGate`, `RequireLegalGate`, `WelcomePopup`, `GlobalErrorLogger`, `NavDepthTracker` (#92). |
| `page.js` | ★ Home / track picker. Handles the loading/signed-out/signed-in states; groups tracks by language family with "Your languages" pinned. |
| `error.js` | Route-level error boundary — branded crash screen with a reload/home escape and a short `SQ-XXXXXX` code logged to `error_logs`. |
| `global-error.js` | Last-resort boundary for crashes in the root layout itself; renders its own `<html>/<body>` and depends on nothing (CSS/fonts may not have loaded). |
| `icon.svg` | App icon. |

### Core learning flow (all `[trackId]`)

| File | What it does |
|---|---|
| `play/[trackId]/page.js` | ★ The gameplay loop. `screen` state machine (`start/playing/result/explain/archive`), Quick Quiz (timed, combo) + shares the engine. Also defines `ExplanationCard`, `StatChip`, `TimerRing`. Uses the new gameEngine combined-focus exports; category and theme filters are no longer mutually exclusive and a live combo-viability note (`combinedPoolSize`/`COMBINED_MIN`) tells the player when a category∩theme round can be built. |
| `grammar/[trackId]/page.js` | Grammar Gym (#90) — targeted grammar drills backed by `data/grammar` + `lib/grammarGym.js`. |
| `learn/[trackId]/page.js` | Lessons mode (calm, untimed, flat `XP_PER_CORRECT=10`, no combo). `screen`: `start/lesson/complete`. Uses `buildLessonSequence`. |
| `placement/[trackId]/page.js` | CEFR placement quiz. Highest tier passed (≥60%) sets the recommendation; `beginner` is the floor; empty tiers are skipped. |
| `script/[trackId]/page.js` | Generic writing-system trainer (#62). One page serves kana/hangul/cyrillic/hanzi via `data/scripts`. Never gates regular content. |
| `listen/[trackId]/page.js` | One-liner that renders `ComingSoonSection` with `section="listen"` (#67 roadmap). |
| `speak/[trackId]/page.js` | Same, `section="speak"`. |

### Account, onboarding, recovery

| File | What it does |
|---|---|
| `onboarding/page.js` | First-run: native language/country + optional placement. |
| `auth/page.js` | Sign in / sign up. **Public sign-up is flag-gated off** for closed beta (flip one boolean to open it — the form itself is intact). |
| `forgot-password/page.js` | Security-question reset (#79) — the email-independent recovery path until #65 lands. |
| `reset-password/page.js` | Sets a new password after a valid reset. |
| `settings/page.js` | Just a redirect home — real settings live in `lib/SettingsPanel.js` inside the nav drawer. |
| `dashboard/page.js` | Aggregate stats. Slated for retirement (#84: redirect home, relocate 3 aggregates). |

### Content pages

| File | What it does |
|---|---|
| `about/page.js` | About + roadmap ("What's next") + community links. |
| `help/page.js` | Help/FAQ. Standing rule: keep it in sync with `lib/version.js` changes. |
| `changelog/page.js` | Renders the full `CHANGELOG` from `lib/version.js`. |
| `whats-new/page.js` | Highlights the latest release; marks it seen (drives the nav "unseen" dot). |
| `terms/page.js` / `privacy/page.js` | ToS / Privacy Policy (shipped v2.8.0; lawyer review is the remaining gate). |

### Feedback & beta

| File | What it does |
|---|---|
| `beta-apply/page.js` | Public beta application (685 lines). **Auto-approve interim** (#65 workaround): applicant picks username + password on the last step and is signed in immediately. |
| `feedback/page.js` | Chooser between bug/feature (the old in-app survey wizard was retired; it now goes out by email). |
| `feedback/bug/page.js` | Single-screen bug report (one required field; ADHD-friendly, not a wizard). Prefills the last error code. |
| `feedback/feature/page.js` | Single-screen feature request. |

### Admin hub

| File | What it does |
|---|---|
| `admin/page.js` | Hub shell + section switcher. Gates on `/api/admin/me` (never ships admin identity client-side). |
| `admin/DashboardSection.js` | At-a-glance counts; each card deep-links; a failed query shows as an em dash. |
| `admin/UsersSection.js` | Every account + profile + progress rollup, plus admin actions (ban/delete/set-password/role) with owner protections. |
| `admin/ApplicationsSection.js` | Beta applications (auto-approved rows flagged); ported from the old standalone page. |
| `admin/FeedbackSection.js` | Bug/feature/survey triage with status + private admin notes. |
| `admin/ErrorsSection.js` | Browse `error_logs` by `SQ-XXXXXX` code / reviewed state — the server side of the crash codes. |
| `admin/ResetRequestsSection.js` | Password-reset requests from accounts with no security questions on file. |
| `admin/adminApi.js` | Authorized client fetch: attaches session token, turns non-JSON error pages into readable errors. |
| `admin/beta-applications/page.js` | Redirect stub → hub (keeps old email links working). |
| `admin/set-password/page.js` | Break-glass UI: enter `ADMIN_API_SECRET` + email + new password. Works when locked out. |

### API route handlers (`app/api/*/route.js`)

| Route | What it does |
|---|---|
| `account-security` | Manage security questions; answers hashed server-side (scrypt) and never returned — UI only learns *which* questions are set. |
| `admin-set-password` | Break-glass password set. Secret-gated (header), **not** admin-session-gated — that's the point. |
| `approve-beta-application` | Admin-gated approval; service role key; cleans email before use. |
| `beta-apply` | Public application intake (365 lines); server validates/cleans email; notifies admin. |
| `log-error` | Records client crashes from the boundaries. Always returns 200 (logging must never cause a second error). Service key with anon-insert fallback. Field length caps. |
| `notify-change` | Account-change notification emails via Resend. Requires a valid session token so it can't be a spam relay. |
| `password-reset` | Verifies security answers (needs `REQUIRED_CORRECT_ANSWERS`), issues reset. |
| `submit-feedback` | Bug/feature intake: identity from session token, screenshot → private bucket, admin email with signed link. |
| `admin/overview` | At-a-glance counts; each count failure-isolated (null, not a full crash). |
| `admin/users` | Every account + profile + progress rollup (`perPage 1000`, closed-beta trade-off). |
| `admin/feedback` | List/triage submissions; screenshot paths → short-lived signed URLs. |
| `admin/errors` | Browse `error_logs` (exact code / reviewed filter, capped 200). |
| `admin/reset-requests` | Admin view/action for reset requests. |
| `admin/me` | Answers "is this session an admin?" so the client never compares emails. |

---

## 3. `data/` — content (pure data, no state)

### `data/tracks/` — 15 registered tracks + 1 unregistered

| File | Track id | Notes |
|---|---|---|
| `index.js` | — | ★ Registry: `TRACKS` map, `getTrack`, `listTracks`, `listNativeLanguages`, `tracksForNativeLang` (offers UK English to non-GB English speakers). |
| `esForEn.js` | `es-latam-for-en` | ★ Reference track (447 lines). Fullest content; Word Bank pilot (`fvocab`, 609 words). All other tracks follow this shape. |
| `esSpainForEn.js` | `es-spain-for-en` | Peninsular Spanish (vosotros/distinción). |
| `frForEn.js` | `fr-for-en` | France French. |
| `frCaForEn.js` | `fr-ca-for-en` | Québécois; 2nd Word Bank track; TTS live. |
| `itForEn.js` | `it-for-en` | Italian. |
| `ptBrForEn.js` | `pt-br-for-en` | Brazilian Portuguese. |
| `ptPtForEn.js` | `pt-pt-for-en` | European Portuguese. |
| `deForEn.js` | `de-for-en` | German; 3rd Word Bank track; TTS live. **Does not** auto-capitalize headwords (grammatically meaningful). |
| `ruForEn.js` | `ru-for-en` | Russian (Cyrillic script). |
| `jaForEn.js` | `ja-for-en` | Japanese (371 lines); Word Bank + TTS live; kana script. |
| `zhForEn.js` | `zh-for-en` | Mandarin (hanzi script). |
| `koForEn.js` | `ko-for-en` | Korean (hangul script). **Next up** for deepening. |
| `enUsForEs.js` | `en-us-for-es` | English (US) for Spanish speakers. |
| `enGbForEs.js` | `en-gb-for-es` | English (UK) for Spanish speakers (distinct vocab/idioms/phonetics). |
| `enForIt.js` | `en-for-it` | First native-language track (English for Italian speakers). |
| `enForEs.js` | `en-for-es` | ⚠️ **Unregistered** — not imported by `index.js` (superseded by the US/UK split). A starter-set legacy file; safe to delete once confirmed dead, or wire up if intended. |
| `esForEnTags.js` | — | Tense/theme tag layer for esForEn (#88): `tagFor` + the theme/tense model. Coverage pass: 157/157 verbs tense-tagged (was 35), tense defs incl. Pluperfect/Future perfect/Conditional perfect; 255/418 curated items themed. Feeds category∩theme combined rounds. |

*Track object shape* (see any file's tail): `id`, `label`, `nameEn/nameEs`, `sublabel`, `nativeLang`, `targetLang`, `theme`, `cats`, `bank`, `wbCatId`, `extraCatId`/`extraBank`, `perCat`, `extraPairsPerRound`, `questionTime`, `extraQuestionTime`. Questions are 7-slot tuples (see `architecture.md` §4).

### `data/vocab/` — frequency word lists (feed the Word Bank generator)

| File | Entries | Notes |
|---|---|---|
| `esLatAmWords.js` | 609 | Tuples `[word, gloss, pos, tier, note?]`; excludes words already in the curated deck. |
| `frCaWords.js` | 636 | |
| `deWords.js` | 637 | German casing preserved per-word (no auto-cap). |
| `jaWords.js` | 713 | Kanji + romaji + reading notes. |

### `data/grammar/` — grammar-gym content (#90)

| File | What it does |
|---|---|
| `index.js` | Grammar-set registry (`grammarForTrack` / set lookup) consumed by `lib/grammarGym.js`. |
| `esForEn.js` | esForEn grammar drill content — the pilot set. |

### `data/scripts/` — writing-system definitions

| File | What it does |
|---|---|
| `index.js` | `SCRIPTS` registry, `scriptForTrack`, `glyphPracticeId` (namespaced ids that ride the seen/missed tables). |
| `kanaJa.js` | Japanese kana — the pilot; defines the data contract every other script copies. |
| `hangulKo.js` | Korean hangul. |
| `cyrillicRu.js` | Russian Cyrillic (grouped for Latin-alphabet readers). |
| `mandarinZh.js` | Mandarin foundational characters (no phonetic alphabet — a curated character set). |

---

## 4. `lib/` — engine, shared UI, client services

### Engine & content logic

| File | What it does |
|---|---|
| `gameEngine.js` | ★ Language-agnostic engine: `buildRound`, `pickFreshest`, `pickForLevelAndFreshness`, `computeMastery`, `computeStreakUpdate` (never-punish), `buildPlacementQuiz`, `buildLessonSequence`, `STREAK_MILESTONES`, plus `flattenBank`/`shuffleOptions`/`seenIdsForRound`. `buildRound` now supports COMBINED round focus (category ∩ theme intersection) when both filters are set, gated by exported `COMBINED_MIN=4` with theme-only fallback. New exports: `themeCoverage(track)` → `{catId:{themeId:count}}`, `combinedPoolSize(coverage, categoryFilter, themeFilter)`, `COMBINED_MIN`. |
| `frequencyVocab.js` | ★ Word Bank generator: word list → 7-slot bank entries at load. Seeded PRNG + gloss-overlap distractor filter. `SPANISH_FORMULAS` default; tracks override (`DE_FORMULAS` etc.). Determinism is load-bearing. |
| `skillLevels.js` | CEFR ordering (`CEFR_ORDER`), `SKILL_LEVELS`, skill→CEFR-bias mapping, advance thresholds (`readyToAdvance`), `masteryBandsForSkillLevel` (CEFR-banded mastery, #89). |
| `grammarGym.js` | Grammar-gym round builder (#90): turns `data/grammar` sets into drill rounds; backs `app/grammar/[trackId]/page.js`. |
| `audioKey.js` | ★ `cyrb53` content-hash keying for TTS clips (`audioKey`, `audioPath`, `normalizeSpokenText`). Shared by the Node generator and the client. Dependency-free by design. |
| `playStrings.js` | UI-string table (`STRINGS`) + `uiLangForSkill`, `t`, `categoryDisplayName` — the native↔target chrome switching. Includes combo-viability strings `comboReady`/`comboThin`. |
| `languageNames.js` | `LANGUAGE_NAMES` matrix + `trackDisplayName` — "what language X is called by a speaker of Y," so tracks don't need per-language name fields. |

### Data access & platform

| File | What it does |
|---|---|
| `db.js` | ★ Every Supabase read/write (profile, progress, missed, seen, explanations pagination, feedback/bug/feature submitters). Contains two RETIRED exports (`submitFeedback`, `submitBetaApplication`) with no callers. |
| `supabaseClient.js` | Browser client (anon key); fails loudly in console if env is missing. |
| `adminAuth.js` | ★ Server-side `requireAdmin`/`adminGate`; owner tier (`ownerEmail`, `isOwnerEmail`). Every `/api/admin/*` calls this. |

### Global client widgets (mounted in `layout.js`)

| File | What it does |
|---|---|
| `VersionWatcher.js` | Polls `version.json` + the CI `release-ready` marker every 60s / on focus; shows "update available" only when both agree. |
| `RequireUsernameGate.js` | Forces a username before use (excludes auth/onboarding/legal routes). |
| `RequireLegalGate.js` | Forces ToS/PP acceptance when `LEGAL_VERSION` changes. |
| `WelcomePopup.js` | Versioned first-run welcome (`WELCOME_VERSION`). |
| `GlobalErrorLogger.js` | Logs errors that never hit a boundary (event handlers, unhandled rejections). Session cap 5 + dedupe. |
| `NavDepthTracker.js` | ★ Mounted nav-depth tracker (#92): watches route changes and maintains the in-app back/home depth state via `navDepth.js`. |

### Reusable UI components

| File | What it does |
|---|---|
| `SettingsPanel.js` | ★ The entire settings surface (1207 lines): profile picture, username, email, password, recovery, native language/country, gameplay. Lives in the nav drawer. |
| `NavDrawer.js` | The slide-out drawer (avatar, links, admin link for admins, hosts `SettingsPanel`). |
| `AudioButton.js` | ★ Speaker button; resolves clip filenames from the per-track `manifest.json` (never constructs them). No autoplay, one clip at a time, no aggregates. |
| `ModeToggle.js` | Quick Quiz / Lessons segmented control (+ optional Script segment). |
| `SectionToggle.js` | Practice / Listen / Speak toggle above `ModeToggle`. |
| `Avatar.js` | Renders emoji/flag/photo avatar. |
| `Logo.js` | Inline SVG squirrel logo. |
| `TrackIcon` (`trackIcons.js`) | Per-track inline SVG landmark icons (Statue of Liberty, Big Ben, …). |
| `StreakMilestoneCelebration.js` | The milestone celebration overlay (Escape to close). |
| `ComingSoonSection.js` | Shared "coming soon" page for Listen/Speak (auth-guarded, loads progress for chrome). |
| `SearchableSelect.js` | Filterable dropdown (used for country/language pickers). |
| `PasswordInput.js` | Password field with show/hide toggle. |
| `PasswordStrengthMeter.js` | Strength bar (renders `passwordStrength` output). |
| `UsernameAvailabilityField.js` | Live username availability + suggestions (`generateCandidate`). |
| `VersionFooter.js` | Footer version tag (BETA-aware) linking to changelog. |
| `BackHome.js` | Back/home affordance (#92) — reads nav-depth state to decide back-vs-home behavior. |

### Small services & helpers

| File | What it does |
|---|---|
| `theme.js` | `BASE` palette + `TRACK_THEMES` (per-track animated CSS gradients) + `animatedBackgroundStyle`. No images/flags. |
| `trackIcons.js` | The landmark-icon SVGs + `TrackIcon` dispatcher. |
| `countries.js` | `COUNTRIES` (ISO 3166-1), `flagImageUrl` (flagcdn SVGs — Windows lacks flag emoji), `countryName`, `regionalLanguageLabel`. |
| `avatarUpload.js` | `AVATAR_EMOJIS` + `uploadAvatarPhoto` (to the `avatars` bucket, cache-busted). |
| `emailTemplate.js` | `brandedEmail`/`detailRows`/`escapeHtml` — table-based HTML wrapper for Resend emails. |
| `emailUtils.js` | `cleanEmail` (strips zero-width/nbsp that break Supabase auth) + `looksLikeEmail`. |
| `notify.js` | `notifyAccountChange` — fire-and-forget POST to `/api/notify-change`. |
| `errorReporting.js` | `generateErrorCode` (`SQ-` codes, no lookalike chars), `logClientError`, and localStorage helpers so the bug form can prefill the last code. |
| `passwordStrength.js` | `getPasswordStrength` (length + character-class scoring). |
| `securityAnswerHash.js` | Server-only scrypt hashing/verify for security answers + reset-token hashing. `scrypt$N$salt$hash` format. |
| `securityQuestions.js` | Curated `SECURITY_QUESTIONS` (append-only), `REQUIRED_QUESTION_COUNT=3`, `REQUIRED_CORRECT_ANSWERS=2`, `normalizeAnswer`. |
| `reauth.js` | `verifyCurrentPassword` before sensitive changes. |
| `community.js` | `FACEBOOK_GROUP_URL` (single source; private during beta). |
| `navDepth.js` | Nav-depth state helper (#92): tracks how deep the user is in the route stack so `BackHome`/`NavDepthTracker` can choose back-vs-home. |
| `legalVersions.js` | `LEGAL_VERSION` (bump to force re-acceptance). |
| `welcomeVersion.js` | `WELCOME_VERSION` (bump to re-show the welcome). |
| `version.js` | ★ `CURRENT_VERSION` + full `CHANGELOG`. Single source of truth; ledger-chat-owned. Also `INTERNAL_CHANGELOG` + `isNonProdEnv()` / `internalNotesByVersion()` for non-prod-only internal notes (#91). |

---

## 5. `scripts/` — build, release & TTS tooling (Node)

| File | What it does |
|---|---|
| `generate-tts.mjs` | ★ Synthesize clips via Google TTS REST → `tts-output/<id>/` → optional upload. Idempotent (content-hash keys), `--force`/`--dry-run`/`--upload`/`--voice`/`--limit`. `TRACK_VOICES`, per-language `LANG_RULES`, voice preflight hard-fail. Covers esForEn answer-choice audio (#87). |
| `sync-tts.mjs` | ★ Mirror dev `tts-audio` bucket → prod in CI. Copy-only (never deletes); skips byte-identical MP3s; always re-copies manifests; refuses same-project source==target. |
| `smoke-check.mjs` | ★ Post-release checks 1–3: prod `/version.json` valid, manifest-`f` parity (superset), canary clip public 200. Check 4 (migration alignment) is in the workflow. |
| `publish-ready.mjs` | Writes `release-ready.json` to the bucket root as the last chain step — the second signal the update prompt gates on. |
| `sweep-tts.mjs` | Guarded orphan-clip cleanup. Defaults to dev; `--delete` + non-dev guard needed for prod. Out-of-band only, never in CI. |
| `generate-version-json.js` | Pre-build: regex-reads `CURRENT_VERSION` → writes `public/version.json`. Runs before `dev`/`build`. |
| `deploy.js` | `npm run deploy`: stages, commits with the version number as message, pulls, pushes, then fires `tts-on-deploy.mjs` (non-blocking) after the push. |
| `tts-on-deploy.mjs` | Post-deploy TTS auto-sync: maps changed content files → audio tracks, dry-run gate, then synth + upload to the dev bucket. Invoked non-blocking by `deploy.js` after push. |

---

## 6. `supabase/` — schema & migrations

| File | What it does |
|---|---|
| `migrations/00000000000000_baseline.sql` | Baseline: core tables (`progress`, `missed_questions`, `seen_questions`, `explanations`, `profiles`) + RLS. |
| `…001_avatars_storage.sql` | `avatars` storage bucket (public read). |
| `…002_profile_avatar_columns.sql` | Avatar fields on `profiles`. |
| `…003_skill_levels.sql` | Per-(user,track) CEFR skill-level tracking. |
| `…004_feedback_submissions.sql` | In-app feedback table (replaced Google Forms). |
| `…005_beta_applications.sql` | Beta applications table. |
| `…006_expand_forms.sql` | Extra fields on both form tables. |
| `…007_repair_forms_tables.sql` | Idempotent rebuild/repair of the two form tables. |
| `…008_beta_application_status.sql` | Approval-status tracking. |
| `…009_feedback_rework_and_error_logs.sql` | Bug/feature rework + `error_logs` + screenshot storage. |
| `…010_admin_hub.sql` | `/admin` hub support (incl. `profiles.is_admin`). |
| `…011_security_questions.sql` | Security-question reset (#79) — works without email. |
| `…012_client_grants.sql` | Explicit client grants (self-sufficiency; first staging catch — clean project didn't inherit grants). |
| `…013_upsert_grant_fix.sql` | Follow-up: profiles/avatar upsert grants (second staging catch). |
| `…014_tts_audio_bucket.sql` | `tts-audio` storage bucket (public read) for pre-generated clips. |
| `schema.sql` | ★ Full snapshot — **manual fallback only** (paste into SQL Editor). Migrations are the automated source of truth. |
| `migrations.zip` | Packaged copy of the migrations. |
| `.temp/*` | Supabase CLI local state (linked-project.json, versions, pooler-url). Not source. |

---

## 7. `docs/`, `e2e/`, `styles/`, `public/`, `.github/`

### `docs/`

| File | What it is |
|---|---|
| `manual-runbook.md` | Every manual step in the dev→release loop. |
| `tts-pipeline.md` | TTS generation runbook (es/frCa pilot). |
| `tts-sync-runbook.md` | The sync + smoke-check chain runbook. |
| `INTEGRATION-NOTES.md` | Feedback-rework + error-codes + email-theming integration notes. |
| `beta-feedback-email-draft.md` | The retired in-app survey, repurposed as an end-of-round email. |
| `supabase-*-email.html` (×4) | Auth email templates: confirm-signup, invite, reset-password, change-email. |
| `changelog/unreleased/.gitkeep` | Keeps the fragment inbox present when empty. |
| `changelog/released/v2.31.0-beta.2/*.md` | Rolled-up fragments for the current release (deforen-deepening, de-tts-lang-rules, ja-deepening-wordbank, ja-tts-pass, tts-sync-ci). |

### `e2e/`

| File | What it does |
|---|---|
| `public-pages.spec.js` | Public-page smoke tests (no account): catches JS errors, hydration mismatches, broken interactions that a 200-check can't. |
| `authenticated-flow.spec.js` | Signed-in flows; needs a dedicated test account (`E2E_TEST_*`) — skips cleanly if absent. |

### Other

| File | What it does |
|---|---|
| `styles/globals.css` | Global CSS: imports Rajdhani + JetBrains Mono, base layout, animations. |
| `public/version.json` | Build-generated version marker the client polls. In-repo copy can lag `lib/version.js` — not authoritative. |
| `.github/workflows/supabase-migrations.yml` | ★ The release chain: migrate → sync-tts → smoke-check → publish-ready (main), migrate-staging (dev). |
| `.github/workflows/e2e-tests.yml` | Runs Playwright on push/PR to main/beta/dev (the dev sandbox can't download a browser; this is the real run). |

---

## 8. Cross-cutting notes & loose ends

Found while mapping — none urgent, all fix-at-next-touch:

- **`data/tracks/enForEs.js` is unregistered** — a legacy English-for-Spanish starter set, superseded by `enUsForEs`/`enGbForEs`, not in the `TRACKS` map. Delete or wire up.
- **`lib/db.js`** — `submitFeedback` and `submitBetaApplication` are marked RETIRED with no callers.
- **`data/tracks/deForEn.js`** header comment cites Neural2-A/B; `TRACK_VOICES` actually uses `de-DE-Neural2-G`. Comment-only.
- **`lib/audioKey.js`** ~line 46 comment says `<key>.mp3` — stale vs. the voice-keyed schema. Comment-only.
- **`public/version.json`** in-repo trails `CURRENT_VERSION` (`2.33.0-beta.2`) — expected (build-generated).
- **Structural content validator** described in the business plan is absent from the repo (handled ad hoc). Worth building.
- **`docs/manual-runbook.md` §2** has a Playwright command vs. `package.json` script-name mismatch.
- **`supabase/.temp/`** is CLI scratch state, not source — fine to ignore/exclude from zips.

For the systems view of any of the above — how the TTS chain, engine, or release flow actually behave — see `architecture.md`.

# SquirreLingo — Shipped Archive

> Full technical shipped history, split out of the to-do list on 2026-07-09 to keep project knowledge lean. **Keep this file OUT of project knowledge** — upload it into a chat only if a session genuinely needs deep history. Append new releases at the top. The app's own user-facing changelog (lib/version.js) intentionally stays less detailed than this.

## v3.0.0 — 2026-07-23
First release to `main` since v2.24.0-beta.3. Consolidates the entire closed-beta content-depth arc — dev betas **2.24.0-beta.4 → 2.33.0-beta.15** — into one major release. Those betas were dev-only and never shipped to prod, so the in-app changelog (lib/version.js CHANGELOG) collapses them into a single 3.0.0 "what's available" entry; full per-beta user-facing bullets remain in git history, and full internal/technical detail remains in `lib/version.js` INTERNAL_CHANGELOG (items A–R under the beta.15 ledger) and `docs/changelog/`.

### What v3.0.0 delivered (by area)
- **Content depth:** every track built from ~36-item starter sets to full A1–C2 depth (hundreds of questions each) — Romance (es-LatAm/es-Spain, fr/fr-CA, it, pt-BR/pt-PT) + de/ru/ja/ko/zh.
- **Grammar engines (in-house, machine-verified):** ru (pymorphy3), ja + ko (conjugators; ko later re-done as a permissive clean-room rule-table), de (rule-table), zh (capped template generator). Spain Spanish gained a full verbecc-verified verb deck (~515).
- **Word Banks:** frequency-ranked bank per track (es 609, ja 713, de 637, fr/it/pt ~570–590, ko 609, ru 188, zh 621, es-Spain ~600).
- **Grammar Gym:** standalone conjugation trainer beyond Spanish to fr/it/pt/de/ru; ja/ko built around politeness/form; zh none (no conjugation).
- **Alphabet mode:** ja kana, then ko hangul / ru Cyrillic / zh characters.
- **Theme tagging (#88) + tense/form hint chips (#89)** across all tracks; **#69 "Heads up" wrong-answer notes** across the engine grammar tracks + full Romance verb/vocab/trad.
- **Pronunciation** to 79 items/track; **idioms** batches (JA/KO/ZH full, DE/RU near); **native-language subtitles**; **question audio** (es-LatAm/fr-CA/de/ja live; ru/zh/ko pipeline wired) + **answer-choice audio** (esForEn).
- **Progress/motivation:** level-aware mastery bars, placement quiz across all tiers, never-break streaks + milestones, dashboard.
- **Onboarding & help:** the animated **intro tour** (auto-once + menu "How to use SquirreLingo"), community-review flags (#41), instant beta approval + one-step account setup, security-question password recovery, bug/feature forms, Facebook group.
- **Cohesion:** app-wide WCAG contrast fix (#63), BackHome nav on 13 pages (#92), Alphabet↔Grammar reachability, token-driven theme, visual/layout consistency pass.

### Beta run consolidated into this release
- **2.24.0-beta.4/5** — explanations-screen crash fix, streak-milestone fix, bug/feature forms + error screen; feedback sign-in gate.
- **2.25.0-beta.1–9** — first depth pass + native subtitles: es-LatAm 65→139 (first C1/C2), fr/it/es-Spain/pt-BR/pt-PT to parity; instant beta approval + one-step account setup; es-LatAm Word Bank pilot (609) → 748.
- **2.26.0-beta.1–3** — auto error logging, admin tooling, version reconciliation.
- **2.27.0-beta.1–2** — security-question password recovery; Facebook group.
- **2.28.0-beta.1** — skill-level descriptions, cleaner progress display, round-focus from complete screen, smarter round variety, localized placement.
- **2.29.0-beta.1–2 / 2.29.1-beta.1–2** — Alphabet mode (ja kana, then ko/ru/zh); beta-application polish.
- **2.30.0-beta.1–2** — question audio (es-LatAm); fr-CA 32→712 + Word Bank; de 36→715 + Word Bank; time's-up pause + clearer exit.
- **2.31.0-beta.1–2** — ja 36→792 + Word Bank; question audio de+ja; update prompt waits for full deploy.
- **2.32.0-beta.1** — "?" help button, Home button, es-LatAm theme filter, tense hints, Spanish Grammar Gym.
- **2.33.0-beta.1–13** — es-LatAm category expansions + theme/verb-form work; fr/it/pt-BR/pt-PT/fr-CA big expansions + Word Banks + Grammar Gym; es-Spain Word Bank + Grammar Gym + full depth.
- **2.33.0-beta.14–15** — ja/ko/zh content depth + Alphabet restyle; ja/ko/de/ru/zh grammar engines + Grammar Gym; #69 Heads-up; pronunciation to 79; idiom + vocab batches; theme tagging; answer-choice audio; community-review flags; #93 TTS quoted-span cleanup; the intro tour.

## v2.24.0-beta.3 — 2026-07-09
- Fixed a latent E2E spec bug that had never been reachable: the two beta-apply form specs selected inputs via getByPlaceholder, but those inputs never had placeholder attributes — every prior CI run died at the build step (missing secrets), so the specs had never actually executed. Switched selectors to getByLabel.
- Programmatically associated all 8 beta-apply text fields with their visible labels (htmlFor/id) — a real screen-reader gap #46's placeholder-derived pass structurally couldn't catch (these fields had neither placeholder nor linked label).
- Verified: label/id pairing audited programmatically; production build clean; fresh npm-ci-verified lockfile. Playwright couldn't run in the sandbox (browser CDN blocked) — CI is the proof run.

## v2.24.0-beta.2 — 2026-07-09
- Beta application submissions moved server-side (new app/api/beta-apply/route.js): shared email cleanup (NFKC normalize, strip zero-width/invisible chars, trim, lowercase — lib/emailUtils.js) + format validation before insert; admin notification email via Resend on each new application (awaited but isolated so a Resend failure can never fail the submission; includes applicant summary + admin review link; recipient ADMIN_NOTIFY_EMAIL falling back to NEXT_PUBLIC_ADMIN_EMAIL). lib/db.js submitBetaApplication now POSTs to the route; anon-insert RLS policy retained as graceful fallback.
- Approve route (approve-beta-application) fixed: cleans the stored email before inviting; detects already-registered accounts via listUsers and approves WITHOUT re-inviting (returns alreadyRegistered + note, rendered green on the admin page). Root cause of the "invalid email on a known-good address" incident — the invite flow assumed every applicant was brand-new; a pre-beta tester's existing account broke it.
- beta.2's CI run confirmed both prior E2E blockers fixed: secrets masked *** (present + resolving), npm ci + build green, 20 tests passed. Only the latent spec failures above remained.

## v2.24.0-beta.1 — 2026-07-08
- Streak never breaks + milestone celebrations (#42): shared computeStreakUpdate helper (lib/gameEngine.js) used by both Quick Quiz and Lessons so the rule can't drift. Missed day holds the streak; STREAK_MILESTONES (3/7/14/30/60/100/180/365) award escalating bonus XP via StreakMilestoneCelebration overlay. Verified across 6 scenarios before wiring in.
- Accessibility pass (#46): :focus-visible indicators app-wide (didn't exist before); Escape handling on nav drawer, welcome popup, streak celebration; all 28 placeholder-only inputs fixed (shared components auto-derive aria-label, or direct fixes). Computed real WCAG ratios; #7C7395 fails AA at 4.09:1 — logged as #63 rather than blind-recolored.
- Native-language system first installment (#40): en-for-it shipped. Two architecture gaps fixed: CATEGORY_NAMES expanded to all 10 families; per-track nameEn/nameEs replaced by lib/languageNames.js trackDisplayName matrix. Native-language picker upgraded to SearchableSelect. Help page corrected re: explanations still hardcoding en/es (#60).
- GitHub Actions: (1) E2E npm ci failed on a stale delivered lockfile — convention now: always include a freshly generated, npm-ci-verified lockfile; (2) E2E build failed everywhere ("supabaseUrl is required") because NEXT_PUBLIC_SUPABASE_URL/ANON_KEY were never added as Environment secrets (blank vs masked in logs) — added by user.

## v2.23.0-beta.2 — 2026-07-08
- Changelog philosophy overhaul: only UI/gameplay fixes, new features, and feature updates get descriptive bullets; everything else folds into "Other general bug fixes and code changes." All 52 entries retroactively rewritten; internal:true flag replaced with per-bullet genericization so versions never vanish from the log.
- This tracking record deliberately keeps full technical detail — the two diverge intentionally.

## v2.23.0-beta.1 — 2026-07-08
- Version-suffix convention (-beta.N) + dedicated beta branch; BETA badge shows when a build carries the suffix.
- Real browser-based E2E suite (Playwright): sign-in page, beta application multi-step navigation, and the exact selection-highlighting behavior a tester flagged — closing the "build succeeds and pages return 200" verification gap.

## v2.22.5 — 2026-07-08
- Real cause of the break-glass tool's 500: createClient() calls outside try/catch in both admin API routes crashed uncaught. Wrapped everything that can throw; hardened admin pages' fetch handling. Confirmed with a real reproduction.

## v2.22.4 — 2026-07-08
- Removed the "open to a follow-up chat or video call" question from the beta application.

## v2.22.3 — 2026-07-08
- Feedback + beta-application forms now show the real underlying error instead of a generic "something went wrong" (a real tester hit this blind).

## v2.22.2 — 2026-07-08
- Break-glass password tool no longer swallows the real error when the API returns HTML instead of JSON (404 most commonly) — surfaces actual status + response preview. Confirmed against a real repro.

## v2.22.1 — 2026-07-08
- Break-glass tool added (app/admin/set-password): sets a user's password directly via admin API, gated by ADMIN_API_SECRET (works while locked out). Built after Supabase Site URL/Redirect URL misconfiguration made email resets unreliable.

## v2.22.0 — 2026-07-07
- Real bug: Lessons mode never shuffled answer options (correct answer nearly always position 0 — confirmed empirically before/after).
- Closed beta: self-serve sign-up disabled; sign-in page shows "Apply to beta test" for newcomers.
- Admin page for reviewing/approving/rejecting applications; approval creates the account + sends Supabase's invite (forces password set, uses applicant's exact email — both handled by Supabase's built-in flow).

## v2.21.2 — 2026-07-07
- Root cause of migration workflow failure: secrets lived under the "Production" Environment but the job never declared it. Added environment: Production to the migrate job.

## v2.21.1 — 2026-07-07
- Fully self-contained, idempotent repair migration for feedback_submissions/beta_applications (editing an already-attempted migration in place may have caused the CLI to skip it, silently never creating the table). Safe to run regardless of prior state.

## v2.21.0 — 2026-07-07
- Beta application + feedback forms rebuilt with the full Google-Forms-era question set as short multi-step wizards (3–4 questions per step).

## v2.20.0 — 2026-07-07
- Public beta-test application page (/beta-apply), no account needed — the dropped half of #48, caught via direct user feedback. Linked from sign-in + About.
- Fixed: home screen briefly flashed email before username (now waits for session AND profile).
- Audited codebase for leftover "Reactor Lang" branding/stale URLs — clean except one intentional historical changelog mention.

## v2.19.1 — 2026-07-07
- Settings always visible in the drawer below a divider (no click-to-expand).

## v2.19.0 — 2026-07-07
- Settings moved into the profile-picture drawer (old /settings redirects home).
- Fixed: Lessons mode background theme never rendered (wrong value passed).
- Fixed: esForEn/esSpainForEn "Verbos" category didn't switch to native-language chrome (legacy "verbo" key; audited all 14 tracks — only gap).
- "What's on this page?" now a full-width bordered button with an icon.
- Placement quiz link moved above the skill-level list.

## v2.18.0 — 2026-07-07
- Fixed: Lessons mode now saves XP/streak after every answer (stopping partway no longer loses progress).
- Fixed: category names switch to native language at low skill levels across all tracks.
- Fixed: Help page no longer hardcodes "Mixto".
- Quick Quiz ↔ Lessons switching is a proper toggle at the top; collapsible "What's on this page?" on both start screens.
- Top icon row replaced with a slide-out profile menu; What's New dot moved to the profile picture; language badge dropped.
- In-app feedback form (Settings → Feedback) replaces external Google Forms; responses go straight to the database.

## v2.17.0 — 2026-07-07
- Lessons mode shipped: calmer, no timer/combo, one topic at a time, explanation after each answer; shares XP/level/mastery with Quick Quiz.
- About the App page + one-time welcome popup — direct response to user testing showing the game-style design wasn't self-explanatory.

## v2.16.0 — 2026-07-06
- Language bubble names show in YOUR native language (e.g. "Italian" not "Italiano").
- First deep-content installment: French (France) 36 → 69 items, first C1 content ('manquer' reversed-subject construction). Start of the multi-session deepening effort (#38).

## v2.15.0 — 2026-07-06
- Japanese, Mandarin, Korean at full depth (36 each) — completes the original 8-language expansion. Native script + romanization together (zero engine changes). Pinyin diacritics for tones. JP: SOV, particles, i/na-adjectives, politeness, pitch accent. Mandarin: no conjugation, aspect particles, measure words, topic-comment, tone sandhi. Korean: SOV, particles, verb-like adjectives, honorific levels, batchim linking. 14 tracks / 10 families.

## v2.14.0 — 2026-07-06
- German + Russian at full depth. German: 3 genders, case system, V2 order, separable verbs, false friends (Gift, Handy, Rat). Russian: Cyrillic needed no architecture changes; zero articles, 6 cases, verb aspect, gendered past, akanye. 11 tracks / 7 families.

## v2.13.0 — 2026-07-06
- Canadian French, Brazilian Portuguese, European Portuguese — all genuinely distinct content (meal-name shift, -tu particle, affrication; ônibus/autocarro, você/tu, palatalization vs vowel reduction). 9 tracks / 5 families.

## v2.12.0 — 2026-07-06
- French (France) at full depth from the start (36 items): false friends, agreement, ne...pas, être/avoir, subjunctive triggers, y/en, 7 idioms, liaison/nasal/silent-letter phonetics.

## v2.11.1 — 2026-07-06
- Italian nearly tripled (13 → 36) after the mastery tracker exposed starter-set thinness; A1–B2 across all categories.

## v2.11.0 — 2026-07-06
- Italian shipped (starter set) — first of the new-language expansion.

## v2.10.x — 2026-07-06
- 2.10.2: Help page cleanup. 2.10.1: placement quiz samples all six CEFR tiers, 3 q/tier, 60% pass threshold. 2.10.0: per-category mastery tracker (learned vs total + difficulty breakdown); Settings spacing fix.

## v2.9.0 — 2026-07-06
- ToS/Privacy links in Settings footer. Play page chrome switches language by skill level. Category picker is genuine mix-and-match ("Mixto" clears others).

## v2.8.x — 2026-07-06
- 2.8.2/2.8.1: profile picture ring genuinely fixed (asymmetric padding → ellipse; then zero padding). Language bubbles: country icon as background, 2-column grid. Squirrel logo redesigned. 2.8.0: ToS + Privacy Policy pages with required sign-up acknowledgement + one-time re-ack popup; English (UK) opened to native English speakers with comparative content.

## v2.7.0 — 2026-07-06
- Native badge stale-data fix (Home re-fetches session). Greeting hierarchy + wave/shimmer. Borderless top icons. Logo next to wordmark.

## v2.6.0 — 2026-07-06
- Native badge moved to top row; version tag fixed to viewport bottom; Help page fully revisited; standing practice: keep Help in sync with every user-facing change (reminder comment above CHANGELOG).

## v2.5.0 — 2026-07-06
- Username required at sign-up; availability field with Verify + auto-generated alternatives; Settings reorganized into sections.

## v2.4.0 — 2026-07-06
- Mandatory username popup for accounts without one. Settings icon = profile picture. Localized centered greeting. "Pick your next quick win ⚡". Higher-contrast back buttons.

## v2.3.0 — 2026-07-06
- Sign out moved to Settings. Pre-round category picker. Review mode (pause + inline explanation). Configurable questions/pairs/timer. Guided onboarding wizard (native language/country/profile picture).

## v2.2.0 — 2026-07-06
- What's New page (! icon) + unseen-version notification dot.

## v2.1.x — 2026-07-06
- 2.1.1: stacked region/version tags; Help generalized beyond EN/ES. 2.1.0: stronger right/wrong feedback (pulse/shake); Help page; searchable country/flag pickers; simplified language cards; favicon.

## v2.0.x — 2026-07-05/06
- 2.0.1: sign-up works with email confirmation on or off; README clarifies Supabase's built-in email only delivers to team members by default. 2.0.0: renamed Reactor Lang → SquirreLingo.

## v1.x — 2026-07-05
- 1.9.x: soft-prompt update popup (mandatory on sign-in screen only); auto-generated version.json; "Reload" wording. 1.8.x: progress dashboard; CEFR skill levels + tagging (~90 questions); rounds bias toward skill level; accuracy tracking + advance prompt; placement quiz; real flag images (Windows emoji gap); searchable country dropdowns (~195). 1.7.0: username display; profile pictures (upload/icon/flag); native country + regional label; English split into US/UK. 1.6.0: npm run deploy. 1.5.0: migrations history + auto-deploy via GitHub Action. 1.4.0: re-auth before email/password change; show/hide toggles; strength meter; sign-out-other-devices. 1.3.0: warm plum/pink palette; animated per-track backgrounds; Settings behind gear; version log. 1.2.0: username sign-in; forgot password; existing-email detection; editable account settings; security notification emails via Resend. 1.1.0: native language on first load; bubble picker; Spain Spanish track. 1.0.0: initial release — accounts + sync (Supabase), full LatAm Spanish track, starter English-for-Spanish track, mixed rounds, review mode, explanation archive, freshness rotation.

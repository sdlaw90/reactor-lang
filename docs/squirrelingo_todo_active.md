# SquirreLingo — Active To-Do

> **⚠️ Branch rule (standing — read first):** Always work from the **`dev`** branch. Never commit directly to **`main`** — `main` is the release/live branch only. A release is a **`dev → main`** merge + version bump. `dev` always holds the latest work, even when it hasn't been pushed to live yet, so orient from `dev`. **There is no `beta` branch** — `-beta.N` is a version *suffix* only (see #82). **Authoritative source for this rule = the Project Instructions (auto-loaded every session); this callout is backup reinforcement — keep the two in sync.**

> Current as of **v2.33.0-beta.2** (2026-07-19, on `dev`). Reconciled 2026-07-18 against `docs/changelog/released/v2.31.0-beta.2/` + `lib/version.js`. The prior snapshot here was v2.29.1-beta.2 (2026-07-12); migrations 012+013 grants repair and the release-train maiden voyage have since shipped, plus migration 014 (tts_audio_bucket). Shipped history lives in `squirrelingo_shipped_archive.md` (STILL owed to repo `docs/` — archive file wasn't in the release zip; bring it to the next release session). Full cost/pricing/IP analysis lives in the Cost Estimator + Business Plan v1.6.
>
> **Added 2026-07-18:** feature items **#87–#90** (answer-choice audio, thematic tag/filter learning, tense training-wheels toggle, grammar/conjugation module) — captured from a design discussion; see table rows, Tiers note, and backlog notes below.
>
> **Reconciled 2026-07-18:** version + shipped-item status brought current to v2.31.0-beta.2 — see the updated **#37** (audio playback shipped), **#38** (frCa/de/ja deepened), and the Deploy-now line. New item **#91** (dev/internal changelog gap) added.
>
> **Reconciled 2026-07-19:** shipped to `dev` since this doc last changed — **v2.32.0-beta.1** (#85/#91/#92 + esForEn #87–#90), **v2.33.0-beta.1** (esForEn content depth #38 + CEFR-banded mastery), and **v2.33.0-beta.2** (combined round-focus [category ∩ theme, extends #88] + esForEn tag-coverage pass: tense 35→157 of 157 verbs, themes 90→255 of 418 curated). See the updated **#88**, **#89**, and **#41** below. All on `dev`, pending a dev→main promotion to prod.

## Priority overview

> Sort rule (keep it this way): table is in plain # order — priority grouping lives in the Tiers section below, not in this table.

| # | Item | Effort | Importance |
|---|------|--------|------------|
| 2 | App store publishing (PWA → TWA → Capacitor) | High | Low-Med |
| 32 | US-specific content, UK-native direction | Med | Low |
| 33 | Subscription/per-language locking | High | Med-High |
| 35 | Trademark registration (name/logo) | Low | Med-High |
| 36 | Listening/speaking practice module | High | Med-High |
| 37 | Audio playback (SHIPPED es/frCa/de/ja via TTS sync CI) + delayed-quiz mode (still pending); remaining audio: ko/ru/zh (ledger) | Med | Med (playback largely done) |
| 38 | Deepen remaining tracks at curated+WB standard (~12 of 15 done; native-direction tracks remain) | High | High |
| 40 | Native-language tracks (1 of ~13 shipped) | High | Med-High |
| 41 | Native-speaker content review pass | Med | High |
| 44 | Data export for users | Low | Low-Med |
| 45 | Database backup/DR plan (confirm Supabase PITR) | Low | Med |
| 47 | Rate limiting / abuse prevention (down payments shipped: 5/hr beta-apply, 15/hr + account lockout password-reset) | Low-Med | Low (Med-High once #33 ships) |
| 57 | Demo video(s) of the app | Med | Med |
| 59 | Re-enable public sign-up before wide launch | Low | Med-High (gated on #65) |
| 60 | Explanations in native + target language — **FOUNDATION SHIPPED v3.1 S1** (resolver + native+target render); target-language TEXT authoring = separate workstream | High | High |
| ~~62~~ | ~~Writing-system block v1~~ **SHIPPED — kana (2.29.0-beta.1) + hangul/Cyrillic/Mandarin (2.29.0-beta.2)**; depth layers → #83 | — | — |
| 63 | Fix #7C7395 muted-text WCAG contrast (4.09:1 → 4.5:1) | Med | Med |
| 64 | Push release notes to social (FB, Discord…) | Low manual / Med automated | Low-Med, rises at launch |
| 65 | Domain + Resend verification + Supabase SMTP (email chain) | Low | Med-High (hard gate for #59) |
| 66 | Mastery quiz system + medal layer (Bronze→Platinum, curated-only) | High | High |
| 68 | About page "What's next" roadmap section | Low | Med |
| 69 | Wrong-answer notes — hybrid wrongNote/distractorNotes schema (decided) | Med (engine Low; content rides #38/#60) | Med-High |
| 83 | Script depth layers — hangul block-composition teaching, kanji curated starter lane, expanded hanzi tiers, (maybe) stroke order | Med-High per layer | Med (post-#38, demand-driven) |
| 84 | Retire dashboard (option 1): redirect /dashboard home, relocate 3 aggregates, fix enForIt "English" display-name context | Low | Med |
| 85 | ~~Move Help (only) out of the nav drawer to the home top bar~~ **SHIPPED v2.32.0-beta.1** | — | — |
| 86 | Home screen grouping: "Your languages" pinned + family-grouped explore (NOT continental) | Med | Med (rises with #40 rollout) |
| 87 | Answer-choice voice playback (tap-to-play, review/pause mode only) — code SHIPPED v2.32.0-beta.1 (esForEn); **gated on TTS clip upload + deferred changelog line** | Low-Med | Med |
| 88 | Thematic learning via tag/filter layer — **filter SHIPPED v2.32.0-beta.1; combined focus (category ∩ theme) + esForEn tag pass (themes 90→255) SHIPPED v2.33.0-beta.2** (esForEn); other tracks await deepen+tag | Med (content) | Med-High |
| 89 | Tense "training-wheels" toggle — **engine/toggle SHIPPED v2.32.0-beta.1; esForEn tense tags 35→157 of 157 SHIPPED v2.33.0-beta.2 (PENDING #41 review)**; other tracks await tagging | Med (engine Low; content) | Med-High |
| 90 | Grammar/conjugation teaching module ("grammar gym") — **SHIPPED v2.32.0-beta.1** (esForEn; walled-off tracker). Other Romance tracks pending | High | Med |
| 91 | Dev changelog serves user-cleaned entries, not full internal detail — **SHIPPED v2.32.0-beta.1** (INTERNAL_CHANGELOG + non-prod/admin gating); release-time rollup automation still owed | Med | Med (dev tooling) |
| 92 | Home button beside Back — **SHIPPED v2.32.0-beta.1** (shared BackHome + nav-depth stack; Home at depth 2+) | Low-Med | Med (ADHD friction cut) |
| ~~70~~ | ~~Re-roll round focus~~ **SHIPPED v2.28.0-beta.1** | — | — |
| 71 | Fono respellings per learner's native orthography (native-language tracks) | Med | High (blocks #40 credibility) |
| 72 | UI string coverage sweep — all chrome strings translated across 10 families | Med | High (prereq for #40 rollout; includes placement-flow strings) |
| ~~73~~ | ~~Skill-level descriptions~~ **SHIPPED v2.28.0-beta.1** | — | — |
| ~~74~~ | ~~Level headline + fill-only XP bar~~ **SHIPPED v2.28.0-beta.1** | — | — |
| 75 | Tier promotion system — per-track per-tier level ladders + advancement offer | Med | Med |
| ~~76~~ | ~~Owner role~~ **SHIPPED v2.28.0-beta.1** | — | — |
| 77 | Word Bank progression lane (own tracker/milestones, separate from medals) | Med | Med-High |
| ~~78~~ | ~~Round draw pacing~~ **SHIPPED v2.28.0-beta.1** (#38 unblocked) | — | — |
| ~~80~~ | ~~Migrations in CI~~ **DONE** (workflow fixed v2.28.0-beta.1; secrets pre-existed) | — | — |
| 81 | Sign-in lockout on repeated wrong passwords (+ reset pointer) | Med | Med |
| ~~82~~ | ~~Release-train architecture~~ **DONE 2026-07-12** (staging live + verified; workflow fixed to main+dev; convention active: work→dev, release=dev→main) | — | — |
| ~~79~~ | ~~Security-question password reset~~ **SHIPPED + DEPLOYED v2.27.0-beta.1** (archive entry once the archive lands in `docs/`) | — | — |

## Tiers

- **Deploy now:** **v2.33.0-beta.2 is on `dev`** (combined focus + esForEn tag pass) on top of **v2.33.0-beta.1** (esForEn content depth) — both pending a dev→main promotion to prod. Then the **ru + ko + zh ledger** (gated on zh audition + `--upload`; see state-of-app doc), and #38 continues into the native-language-direction tracks.
- **Tier 0 (pre-public-launch, quick):** #35 trademark, #65 domain/SMTP chain — do together
- **Tier 1 (current priority — content depth over new languages):** #38 (native-direction tracks remain), #60, #69 content; #40 alongside #38; #71 + #72 gate the next #40 track; #66 gated per-track on #38; #77 rides mastery work. **NEW rider:** fold the #88/#89 theme+tense tagging step INTO the #38 depth-generation workflow so each deepen emits tags from day one (see state-of-app doc).
- **Tier 4 (major, schedule deliberately):** #36, #37, #2, #59, #33, #75
- **Tier 5:** #32
- **Tier 6 (quality pass before wider launch):** #41, #63, #47, #45, #44, #68, #81, #84
- **Tier 7 (marketing/media):** #57, #64
- **New feature batch (2026-07-18) — MOSTLY SHIPPED:** #85/#91/#92 shipped v2.32.0-beta.1; #87 code shipped (gated on TTS upload); #88/#89/#90 esForEn shipped (v2.32.0-beta.1 base + v2.33.0-beta.2 coverage for #88/#89). Remaining: extend #88/#89 tagging to other tracks (rides #38); #90 to other Romance tracks; #87 TTS upload. #2 (video questions) still parked — see the note at the end.

## Backlog notes (essentials only)

- **38:** **RECONCILED 2026-07-18:** frCa (v2.30.0-beta.1), German (v2.30.0-beta.2) and Japanese (v2.31.0-beta.1) DEEPENED + SHIPPED; ko/ru/zh deepened (in dev, riding the ledger); esForEn content depth SHIPPED v2.33.0-beta.1 — leaving **~12 of 15** — only the native-language-direction tracks (enUsForEs, enGbForEs, enForIt) remain. Standard per pass: ~doubled curated + full A1–C2 (≥3/tier) + `promptNative` + `wrongNote`s (#69) + WB layer (~600 tuples). **NEW rider (2026-07-19):** emit #88 theme tags + #89 tense/grammatical-form tags during the pass (one shared tag model) so we never repeat the esForEn separate-tagging backlog on a new language. Backfill pile: WB for FR/esSpain/IT/PT×2; `wrongNote`s for all deepened.
- **60:** **RESOLVER SHIPPED (v3.1 S1, 2026-07-23)** — `resolveExplainText`/`explainRows` in `app/play/[trackId]/page.js` render source-language explanations (English fallback) + a target-language row below Advanced (immersive/target-only above). Data model = keyed map `{en, es, …}`, no migration. **REMAINING = the target-language explanation TEXT** — only Spanish authored today; ~6k strings across 10 targets (Romance first), tracked as its own workstream: `claude/squirrelingo_target_language_explanation_layer.md`. Native-SOURCE Spanish build = v3.1 (`squirrelingo_v3.1_spanish_source_kickoff.md`).
- **62:** v1 COMPLETE (2.29.0-beta.2): generic model + all four scripts live — kana (104×2), hangul (40 jamo + 14-block sampler), Cyrillic (33, Latin-similarity grouping), Mandarin foundational set (46 chars, pinyin+gloss in the roman slot). XP-less own lane; never a blocker. Depth work moved to #83.

- **66:** AT BUILD: revisit placement interplay (decision 2026-07-12) — placement never grants XP/levels, but consider whether it should pre-unlock mastery-quiz GATES for the placed tier. N=5 clean non-consecutive runs (N=3 A1/A2); failed quiz re-locks weakest categories only; result always recorded. Medals Bronze=A1+A2 / Silver=B1+B2 / Gold=C1+C2 / Platinum=all six; permanent; curated-only (WB has own lane #77). Gated per-track on #38.
- **69:** HYBRID schema decided — required `wrongNote`, optional `distractorNotes`; WB auto-generates; add `wrongNote` to build validator once shipped. Authoring rides #38/#60.
- **71:** respellings use the LEARNER's orthography; enForIt needs a repair pass. On checklist 41a + #40 new-track checklist.
- **72:** audit every user-facing string across 10 families; includes the placement-flow chrome fix. Hard prereq before next #40 track. Native-mode playthrough per track = cheapest gap-finder.
- **75:** AT BUILD: same placement-interplay revisit as #66 (gates maybe, XP never). Per-track per-tier ladders; prestige framing; permanent badges; offer declinable forever; Advanced 100 terminal; post-cap → #66 handoff. Depends on #74.
- **77:** WB progression lane — own tracker/milestones per track; never CEFR-gated; never blocks. Design TBD; rides mastery work.
- **81:** durable lockout on failed SIGN-IN attempts, mirroring #79's pattern (per-account counter + locked_until columns; e.g. 5 fails → 15-min lock with backoff), lock message points to /forgot-password. Requires moving sign-in from client `signInWithPassword` to a server route so failures can be counted server-side — that's the bulk of the effort; keep username-or-email sign-in intact. Design decisions at build: (1) anti-DoS — a pure per-account lock lets an attacker lock out a real user by spamming wrong passwords; prefer per-IP+account keying or short locks with escalating backoff over long hard locks; (2) check what Supabase auth rate limiting already provides before building, to avoid duplicating; (3) never-punish is a PROGRESS principle — security friction is fine, but message kindly. Fits any release; no migration if columns ride an existing pass, otherwise small migration.
- **82:** code side SHIPPED v2.28.0-beta.1 (migrations workflow dual-targets beta→prod / dev→staging; E2E covers dev). REMAINING (Sean, manual — checklist in state doc): dev branch, staging Supabase project + migrations, GitHub "Staging" environment secrets, Vercel Preview-scoped env vars. Convention once live: work merges to dev (auto-migrates staging), release = merge dev→MAIN + version bump (auto-migrates prod; there is no beta branch — suffix-only convention). Trade-offs accepted: fake staging data, two-sided secrets rotation. UNCHANGED: single version ledger, `-beta.N`, one-chat-one-task, release-session zips. **UPDATE 2026-07-18:** the full prod chain (sync-tts → smoke-check → publish-ready) + the release-ready update-prompt gating shipped in v2.31.0-beta.2; migration 014 (tts_audio_bucket) is live — convention now operational end-to-end.

- **83:** the "complex layers" on top of #62 v1, demand-driven and ordered by likely value: (1) hangul block-COMPOSITION teaching (build 한 from ㅎ+ㅏ+ㄴ — interactive, needs a small quiz-generator extension, the one #62 layer that isn't pure data); (2) kanji curated starter lane for jaForEn (mirrors the Mandarin foundational-set approach — numbers, days, common kanji with readings; explicitly NOT comprehensive); (3) expanded hanzi tiers beyond the 46-char set; (4) stroke order — big lift (animation data), only if testers ask. Never a blocker, same lane rules as #62. Sequence after #38 momentum, or when the Japanese/Korean testers hit the ceiling.
- **86:** DIRECTION DECIDED 2026-07-12: language-FAMILY grouping (one tile per family, opens into variants — showcases the dialect pairs instead of splitting them) + "Your languages" (has-progress) pinned above an "Explore" catalog. Explicitly NOT continental grouping (splits every dialect pair across buckets; native-direction tracks don't map). No data model changes — derive from track metadata. Loosely gated on track count: current 15 is fine on the bubble grid; build before/alongside the #40 rollout (~13 more tracks) breaks it. Candidate language pipeline lives in `squirrelingo-language-wishlist.md`.
- **85:** SHIPPED v2.32.0-beta.1 — Help is a "?" icon on the home top bar; removed from the nav drawer (About/Settings stay). Help-page copy updated.

- **84:** DECIDED 2026-07-12 (option 1 — retire now, rebuild later): dashboard is redundant post-#74 (home bubbles carry level/skill/bar; play start screen has per-track stats). Work: (1) `/dashboard` redirects home; (2) relocate the three cross-track aggregates (Total XP, best streak, total rounds) somewhere small — nav drawer footer or a one-line home strip; (3) remove the nav drawer Dashboard entry; (4) fix the bug found here: enForIt renders as bare "English" on the dashboard/anywhere trackDisplayName lacks native-direction context — show the full "English (for Italian speakers)"-style name for native-direction tracks when the viewer isn't that native language (feeds #72 patterns). Future: #66 medals / #75 badges / #77 WB lane build a purpose-made progress/trophy page from scratch — NOT a resurrection of this one. Fits any release; one small session.
- **41:** NOT a launch gate (decided 2026-07-12) — unreviewed tracks ship flagged ("community review in progress"), reviewed incrementally, dialect pairs first; no authenticity marketing and no #33 charging for a track pre-review (lawyer confirms angle at ToS review). Flag UI is a small #59-adjacent build item. Checklist 41a (+respellings-for-learner's-orthography); esForEn via friend ($0), rest via italki/Preply (~$130–390 total) or subreddits. **esForEn OWED PILE (all AI-authored, send together):** (1) 2.33.0-beta.1 content-depth items (~300 new, inline PENDING markers in `data/tracks/esForEn.js`); (2) **NEW 2.33.0-beta.2 — per-verb tense labels (157) + extended theme tags (255) in `data/tracks/esForEnTags.js`** — the advanced subjunctive / `como si` / polite-conditional tense calls especially; (3) grammar-gym conjugation tables (`data/grammar/esForEn.js`). The earlier 74-curated + subtitles + 609 WB personal-testing pass (DONE 2026-07-12) can go in the same handoff.
- **40:** enForIt shipped; ~12 remain; #71 + #72 hard prereqs before the next one.
- **36:** distinct optional mode; needs TTS/recordings + speech input. Genuinely large.
- **37:** **RECONCILED 2026-07-18 — largely SHIPPED.** Question-audio playback is live on es (v2.30.0-beta.1), frCa, de + ja (v2.31.0-beta.2), delivered via the new TTS sync CI chain (sync-tts → smoke-check → publish-ready; zero manual prod audio) plus the voice-keyed filename schema + AudioButton manifest resolution. REMAINING under #37: (a) ko/ru/zh audio — rides the ledger release; (b) **delayed-quiz mode** — no evidence it shipped; treat as pending. **#87 (answer-choice audio) code shipped v2.32.0-beta.1 but gated on the esForEn TTS clip upload (`--upload`) + the deferred user-facing changelog line — do that before advertising it.**
- **35:** USPTO $350/class; $500–1,500 all-in. Coordinate with #65 domain pick.
- **65:** 9-step chain (domain → Resend DNS → Supabase SMTP → templates from `docs/` → verify → step 9 retire auto-approve). Hard gate for #59. **Post-#79 note: at completion, email reset becomes PRIMARY on /forgot-password (add the email option to that page); security questions stay as the permanent fallback — do NOT remove them (decision 2026-07-12).**
- **2:** PWA → TWA → Capacitor; lawyer review is the remaining gate.
- **59:** flip `SIGNUPS_ENABLED = true`; gated on #65. Rider: per-track "community review in progress" flag UI for unreviewed tracks (decision 2026-07-12). **Sign-up page will need the same recovery-setup fields beta-apply now has** — fold into the #59 flip.
- **33:** $3.99/mo, $29.99/yr, $3.99 one-time/language; Stripe; gated on lawyer review; breakeven 17 subs. Upgrade rate limiting (#47) to durable store at ship — password-reset lockout columns are already durable; the per-IP maps are the in-memory part.
- **57:** video production; link from About + welcome popup.
- **63:** #7C7395 fails AA; deliberate visual pass; new UI keeps using #9B93B8 (admin + #79 UI comply).
- **47:** down payments live on beta-apply AND password-reset; durable per-IP store at #33.
- **45:** confirm Supabase Pro PITR rather than assuming.
- **44:** progress export; trust at scale.
- **64:** manual-but-templated from user-facing changelog; automate later.
- **32:** needs genuinely American-specific content vs. British usage.

### Feature notes (captured 2026-07-18; #85/#87–#92 status updated 2026-07-19)

- **87:** Answer-choice voice playback. **CODE SHIPPED v2.32.0-beta.1 (esForEn)** — tap-to-play only, review/pause mode only, excluded from aggregates; `choice_audio` setting (default off); `generate-tts.mjs` emits target-language option clips for `trad` + `verbo`. **STILL OWED:** run the esForEn TTS generation + `--upload`, THEN add the deferred user-facing #87 changelog line on the next `-beta.N`. Until upload, the choice-audio buttons don't render (graceful). Downstream of #37's pipeline.

- **88:** Thematic learning as a **TAG/FILTER LAYER, not new categories**. **SHIPPED (esForEn):** filter + tag model v2.32.0-beta.1; **combined focus (category ∩ theme)** + coverage pass v2.33.0-beta.2. Model: every item keeps ONE **home category** (mastery counts there) plus **many-to-many theme tags**; the picker's theme filter pulls tagged items, and a Round focus + a theme now COMBINE (intersect, `COMBINED_MIN=4` gate with theme-only fallback below it). Starter set of 9 themes (numbers-time, directions, shopping, restaurant, travel, medical, small-talk, work, emotions). esForEn coverage now: themes 90→255 of 418 curated; 20/27 category×theme cells viable. **REMAINING:** extend tagging to other tracks — rides #38 (emit tags during each deepen). Grow the theme set later (airport/hotel/pharmacy/IT/etc.) as content warrants. Cost = a content **TAGGING PASS** sharing one tag model with #89.

- **89:** Tense **"training-wheels" toggle**. **SHIPPED (esForEn):** engine + toggle v2.32.0-beta.1; **full tense tagging (35→157 of 157 verbo items)** v2.33.0-beta.2. Surfaces the tense + a one-line "why," ON by default, DISMISSABLE at advanced levels. **VERIFIED:** esForEn verbo items give the infinitive and test producing the tense-correct form → tense is genuinely invisible (real scaffolding, not labeling). **PENDING #41 review** on the AI-authored tense labels. **REMAINING:** other tracks await their own tagging (rides #38). **Cross-language caveat:** "grammatical form" differs — es = tense + mood; ja/ko = form + politeness; zh = aspect (了/过/着), no conjugation. Shares the tag model with #88.

- **90:** Grammar/conjugation **teaching module ("grammar gym")**. **SHIPPED (esForEn) v2.32.0-beta.1:** `data/grammar/esForEn.js` (11 verbs × 6 tenses × 5 LatAm persons), `lib/grammarGym.js` (drill generator + localStorage progress), `app/grammar/[trackId]/page.js` (Learn tables + Practice MCQ). **Walled off:** own localStorage tracker; never feeds main XP/level/streak/mastery or the picker. Entry: optional "Grammar" segment in `ModeToggle`. **PENDING #41 review** on the conjugation tables. **REMAINING:** other Romance tracks; do NOT assume it generalizes to CJK (zh doesn't conjugate). Effort High per language.

- **91:** Dev/internal changelog gap. **SHIPPED v2.32.0-beta.1:** `INTERNAL_CHANGELOG` array in `lib/version.js` + `isNonProdEnv()` + `internalNotesByVersion()`; `app/changelog/page.js` renders internal detail additively on non-prod deploys OR for admins (prod non-admins see only the cleaned `CHANGELOG`). **STILL OWED:** wire a release-time rollup so `docs/changelog/**` fragments populate `INTERNAL_CHANGELOG` automatically (currently hand-maintained — kept in sync manually at each release, including v2.33.0-beta.1/beta.2).

- **92:** Home button next to Back. **SHIPPED v2.32.0-beta.1:** `lib/navDepth.js` (sessionStorage breadcrumb stack) + `lib/NavDepthTracker.js` (in `app/layout.js`) + shared `lib/BackHome.js`; Home shows right of Back only at depth 2+. Migrated changelog / what's-new / about / help / grammar pages. Game pages left as-is (special Back semantics, depth-1).

- **(unnumbered) Video questions — PARKED as exploration (not a committed item).** Origin: proposed alongside #87–#90 on 2026-07-18. A new content modality (new question type + video player, video hosting/bandwidth heavier than the current text+mp3 model, affects the PWA/CDN story). The AI-generation angle is the shaky part — currently expensive per clip, hard to control precisely, poor consistency across a lesson set. **De-risk before committing:** prototype with a handful of curated REAL clips first; only weigh generative video if the idea proves out. ADHD lens: engaging but the most distraction-prone modality — short, single-focus clips only. Promote to a numbered item only if a prototype earns it.

// Bump CURRENT_VERSION and add an entry here whenever you ship a meaningful
// change. Shown as a small tag in the footer, linking to the full changelog.
//
// STANDING PRACTICE: whenever a change here affects anything a person would
// notice or need explained (a new setting, a new page, a changed icon/label,
// a changed flow), also update app/help/page.js in the same pass. The Help
// page fell out of sync with reality once already (see the 2026-07-06 "Help
// page revisit" entry below) — treat keeping it current as part of shipping
// the feature, not a follow-up task.

export const CURRENT_VERSION = "2.22.3";

// Bump CURRENT_VERSION and add an entry here whenever you ship a meaningful
// change. STANDING PRACTICE: mark an entry `internal: true` if it's purely
// backend/infra/deployment (CI workflow fixes, migration tooling issues,
// etc.) with zero user-visible effect -- users don't need to know about a
// GitHub Actions secret misconfiguration. Both app/whats-new/page.js and
// app/changelog/page.js filter these out automatically. CURRENT_VERSION
// still bumps for these (so version numbers stay technically accurate to
// what's actually deployed), but the public-facing changelog skips them.

export const CHANGELOG = [
  {
    version: "2.22.3",
    date: "2026-07-08",
    changes: [
      "Fixed the feedback and beta-application forms showing the same generic \"something went wrong\" message no matter what actually failed — a real beta tester hit this with no way to tell either of us what actually happened. Both now show the real underlying error.",
    ],
  },
  {
    version: "2.22.2",
    date: "2026-07-08",
    internal: true,
    changes: [
      "Fixed the break-glass password tool (app/admin/set-password) swallowing the real error when the API route returns HTML instead of JSON (a 404 page, most commonly) — it now surfaces the actual HTTP status and a preview of the response instead of a generic 'Network error'. Confirmed the fix against a real reproduction (a genuine 404 returns exactly the '<!DOCTYPE html>...' text that was reported).",
    ],
  },
  {
    version: "2.22.1",
    date: "2026-07-08",
    internal: true,
    changes: [
      "Added a break-glass tool (app/admin/set-password) for directly setting a user's password via the admin API, bypassing the email-based reset flow entirely. Gated by a separate ADMIN_API_SECRET rather than requiring an active app session, since the whole point is to work even when locked out of your own account. Built after real Supabase Site URL/Redirect URL misconfiguration made the email-based reset flow unreliable.",
    ],
  },
  {
    version: "2.22.0",
    date: "2026-07-07",
    changes: [
      "Fixed a real bug: Lessons mode never shuffled answer options, so the correct answer was in the first position on nearly every question — confirmed empirically (all answers landing on position 0 before the fix, spread naturally across all positions after)",
      "Closed beta: self-serve sign-up is temporarily disabled — the sign-in page now only shows an \"Apply to beta test\" link for newcomers, alongside sign-in for people who already have an invite",
      "New: an admin page for reviewing beta applications and approving or rejecting them. Approving creates the account and sends an invite email automatically — accepting it requires setting a password, and the account is created with the applicant's exact application email, so both of those \"force a password\" and \"same email\" requirements are handled by Supabase's own built-in invite flow, not custom code.",
    ],
  },
  {
    version: "2.21.2",
    date: "2026-07-07",
    internal: true,
    changes: [
      "Fixed the actual root cause of the migration workflow failing: the secrets were correctly configured, but under a GitHub \"Environment\" (Production) rather than plain repository secrets — and the workflow file never told GitHub the job belongs to that environment, so those secrets were never handed to it. Added environment: Production to the migrate job in .github/workflows/supabase-migrations.yml.",
    ],
  },
  {
    version: "2.21.1",
    date: "2026-07-07",
    internal: true,
    changes: [
      "Added a fully self-contained, idempotent repair migration for feedback_submissions/beta_applications, since editing an already-attempted migration file in place (the earlier gen_random_uuid fix) may have caused Supabase's CLI to skip re-applying it, silently leaving the table never actually created. This one doesn't depend on diagnosing that precisely — every statement is safe to run whether or not earlier migrations actually succeeded.",
    ],
  },
  {
    version: "2.21.0",
    date: "2026-07-07",
    changes: [
      "Both the beta application and feedback forms were rebuilt with a much fuller question set, based on the original Google Forms design (device/browser, native language and current level, practice habits, time commitment, session-by-session experience, bugs, NPS-style likelihood-to-recommend, and more) — presented as short multi-step wizards (3-4 questions per step) rather than one long scrolling form",
    ],
  },
  {
    version: "2.20.0",
    date: "2026-07-07",
    changes: [
      "New: a public beta-test application page (/beta-apply) — no account needed, since applicants don't have one yet. This is the other half of #48 (\"in-app application/feedback forms\") that got dropped along the way when only the feedback half was built; caught via direct user feedback. Linked from the sign-in page and the About page.",
      "Fixed a real bug: the home screen briefly showed your email address before your username loaded, because the page only waited for the session to resolve, not the profile — now it waits for both, so there's no flash of the wrong name",
      "Audited the whole codebase for leftover \"Reactor Lang\" branding or stale URLs — package.json was already correctly \"squirrelingo\", no hardcoded old URLs exist anywhere; the only remaining \"Reactor Lang\" mention is a historical changelog entry documenting the actual rename, kept intentionally for accuracy",
    ],
  },
  {
    version: "2.19.1",
    date: "2026-07-07",
    changes: [
      "Settings is now always visible in the drawer, right below a divider under Dashboard — no extra tap needed to reveal it, replacing the previous click-to-expand sub-view",
    ],
  },
  {
    version: "2.19.0",
    date: "2026-07-07",
    changes: [
      "Settings now lives inside the profile-picture drawer itself, not as a separate page — tap Settings in the menu to see it right there, with a back arrow to return to the menu. The old /settings link still works and redirects home.",
      "Fixed a real bug: Lessons mode was passing the wrong value to its background theme, so the colorful animated background never rendered — the whole page looked flat and overly dark compared to Quick Quiz mode",
      "Fixed: esForEn and esSpainForEn's grammar category (\"Verbos\") wasn't switching to native-language chrome for beginners, since those two tracks use a legacy \"verbo\" category key instead of \"gram\" — added the missing translation entry after auditing all 14 tracks to confirm this was the only gap",
      "\"What's on this page?\" is now a full-width, bordered, higher-contrast button with a real icon, not small subtle text — more noticeable, and a better touch target for accessibility too",
      "Moved the placement quiz link to appear before the skill-level list (not after), so it's not missed at the bottom, especially on mobile",
    ],
  },
  {
    version: "2.18.0",
    date: "2026-07-07",
    changes: [
      "Fixed a real bug: Lessons mode now saves XP and streak progress after every answer, not just at full lesson completion — stopping partway through a lesson no longer silently loses earned XP",
      "Fixed: category names (Vocabulary/Grammar/Idioms/Phonetics) now correctly switch to your native language at low skill levels, matching the rest of the play page's chrome — previously only worked for the English US/UK cross-dialect case",
      "Fixed: Help page no longer hardcodes \"Mixto\" as if that's always the literal button text",
      "Quick Quiz ↔ Lessons switching is now a proper toggle at the top of each mode's screen, not a small link at the bottom",
      "Added collapsible \"What's on this page?\" instructions directly on both the Quick Quiz and Lessons start screens",
      "Replaced the top icon row (language badge, What's New, Help, Dashboard, Settings) with a single slide-out menu from the profile picture — much less cluttered, especially on mobile. The What's New notification dot now lives on the profile picture itself; the language badge was dropped entirely since Settings (right there in the menu) already covers it.",
      "New: an in-app feedback form (Settings → Feedback) — replaces external Google Forms, which weren't importing/styling well. Responses go straight into the database.",
    ],
  },
  {
    version: "2.17.0",
    date: "2026-07-07",
    changes: [
      "New: Lessons mode — a calmer alternative to Quick Quiz, with no timer and no combo pressure. Walks through one topic at a time, easiest items first, showing the explanation right after each answer. Switch between Quick Quiz and Lessons any time from either mode's start screen — both share the same XP, level, and mastery progress.",
      "New: an About the App page explaining what SquirreLingo is and how both modes work, linked from Help",
      "New: a one-time welcome popup on first login after onboarding, introducing both modes and linking to the About page",
      "Direct response to real user-testing feedback: the app's game-style design wasn't self-explanatory to a first-time user unfamiliar with gamified apps",
    ],
  },
  {
    version: "2.16.0",
    date: "2026-07-06",
    changes: [
      "Language bubble names now show in YOUR native language instead of the target language's own name for itself — e.g. an English speaker sees \"Italian\" instead of \"Italiano\", a Spanish speaker sees \"Inglés (Reino Unido)\" instead of \"English (UK)\". Applies on the home screen, dashboard, and the play page title.",
      "First installment of a deeper-content pass: French (France) nearly doubled from 36 to 69 items, including the first C1-tier content of any track (the reversed-subject 'manquer' construction — 'tu me manques')",
      "This is the start of a multi-session effort to substantially deepen all 14 existing tracks rather than adding more languages — see the to-do list",
    ],
  },
  {
    version: "2.15.0",
    date: "2026-07-06",
    changes: [
      "Three new languages, all at full depth (36 items each): Japanese, Mandarin Chinese, and Korean — completing the original 8-language expansion list",
      "Native script (kanji/hanzi/hangul) shown together with romanization in every question, per explicit design decision — required zero engine changes, just careful content authoring",
      "Mandarin's tones are represented with standard pinyin diacritics (ā á ǎ à) — the established way to write tones, so no new phonetic system was needed",
      "Japanese covers SOV word order, grammatical particles, no person/number verb conjugation, i- vs. na-adjectives, politeness levels, and pitch accent (見た目上 identical words distinguished only by pitch)",
      "Mandarin covers zero verb conjugation at all, aspect particles instead of tense, required measure words/classifiers, topic-comment structure, and tone sandhi (the nǐhǎo → níhǎo rule)",
      "Korean covers SOV order, particles, adjectives that conjugate like verbs with no linking \"to be\", elaborate honorific speech levels, and batchim (final-consonant) linking",
      "14 tracks now, across 10 language families — completes the original new-language backlog item",
    ],
  },
  {
    version: "2.14.0",
    date: "2026-07-06",
    changes: [
      "Two new languages, both at full depth (36 items each): German and Russian",
      "German: the biggest grammatical leap of any track so far — three genders, the full case system (nominative/accusative/dative), verb-second word order, separable verbs, modal-verb clause structure, and subordinate-clause verb-final order, plus classic false friends (Gift, Handy, Rat)",
      "Russian: no architecture changes needed for Cyrillic (just a different alphabet, no tone system) — covers zero articles at all, the 6-case system, verb aspect (perfective/imperfective), gender-agreeing past tense, and vowel-reduction phonetics (akanye)",
      "11 tracks now, across 7 language families",
    ],
  },
  {
    version: "2.13.0",
    date: "2026-07-06",
    changes: [
      "Four new languages, all at full depth (36 items each, matching Italian/France French): Canadian French, Brazilian Portuguese, and European Portuguese",
      "Canadian French is genuinely distinct from France French — the déjeuner/dîner/souper meal-name shift, false-friends-within-French (char, liqueur), the -tu question particle, \"chu\" contraction, and t/d affrication phonetics",
      "Brazilian and European Portuguese are genuinely distinct from each other — different everyday vocabulary almost across the board (ônibus/autocarro, celular/telemóvel), gerund vs. infinitive construction, você vs. tu, object pronoun placement, and very different phonetics (Brazilian palatalizes d/t before i; European Portuguese reduces vowels heavily and turns final 's' into \"sh\")",
      "The language roster now covers 9 tracks across 5 language families",
    ],
  },
  {
    version: "2.12.0",
    date: "2026-07-06",
    changes: [
      "New language: French — France French, for English speakers. Built at full depth from the start this time (36 items — same bar as Italian's expanded content, not a starter set): false friends (librairie, actuellement, coin), gendered/plural agreement, required ne...pas negation, être/avoir auxiliary choice, subjunctive triggers, y/en pronouns, 7 idioms, and liaison/nasal-vowel/silent-letter phonetics.",
    ],
  },
  {
    version: "2.11.1",
    date: "2026-07-06",
    changes: [
      "Italian content nearly tripled (13 → 36 items) after the mastery tracker made the starter-set depth feel too thin — now spans A1 through B2 across all categories, including 6 false-friend traps, 9 grammar points (essere/avere auxiliary choice, required possessive articles, subjunctive trigger phrases), and 7 idioms",
    ],
  },
  {
    version: "2.11.0",
    date: "2026-07-06",
    changes: [
      "New language: Italian (for English speakers) — starter-set content covering false friends (camera, parenti), gendered articles, city/country prepositions, required double negatives, idioms, and vowel/double-consonant phonetics. First of the new-language expansion — French (France/Canada) and Portuguese (Brazil/Portugal) are next.",
    ],
  },
  {
    version: "2.10.2",
    date: "2026-07-06",
    changes: [
      "Help page cleanup: added the missing icons for the native language badge and What's New in the icon list; removed the \"Signing up & usernames\" and \"Settings, organized\" sections as unnecessary reference detail",
    ],
  },
  {
    version: "2.10.1",
    date: "2026-07-06",
    changes: [
      "Placement quiz is now much more comprehensive: samples all six CEFR tiers (A1-C2) instead of just the middle four, with 3 questions per tier instead of 2 — should place true beginners and advanced learners more accurately, not just people in the B1-C1 middle",
      "Tightened the pass threshold per tier (60% instead of 50%) to reduce noise from a single lucky or unlucky guess now that there are more questions per tier",
    ],
  },
  {
    version: "2.10.0",
    date: "2026-07-06",
    changes: [
      "Added breathing room between the Sign out button and the fixed footer at the bottom of Settings, so they don't feel clumped together",
      "New per-category mastery tracker on each language's start screen: learned vs. total items per category, plus a breakdown by difficulty level for smaller, less-daunting progress chunks",
    ],
  },
  {
    version: "2.9.0",
    date: "2026-07-06",
    changes: [
      "Terms of Service and Privacy Policy links added to the Settings footer, anchored just above the version tag",
      "Play page UI now switches language based on skill level: No experience/Beginner/Intermediate shows all chrome (buttons, labels, stats) in your native language; Advanced/Native shows it in the language you're learning",
      "Category picker is now genuine mix-and-match — select any combination of categories to focus a round on, and picking \"Mixto\" clears other selections back to the full blend",
    ],
  },
  {
    version: "2.8.2",
    date: "2026-07-06",
    changes: [
      "Actually fixed the profile picture ring this time — the previous fix addressed an ellipse/circle mismatch, but the button's 8px padding around the smaller avatar was still leaving a visible ring of background behind it. The avatar now fills its button completely (zero padding, exact same footprint as the other top-row icons), so there's nothing left to show through.",
    ],
  },
  {
    version: "2.8.1",
    date: "2026-07-06",
    changes: [
      "Fixed the profile picture's remaining border — traced to the surrounding button using asymmetric padding, making its round shape an ellipse that peeked out around the perfectly circular avatar inside it",
      "Language bubbles now use their country icon as a large background element instead of a small side icon, and are laid out in an equal-size 2-column grid instead of variable-width flex wrapping",
      "Redesigned the squirrel logo/favicon with a proper body, two-tone ears, a more natural curled tail, and a little paw — replacing the simpler head-and-tail-only version",
      "Welcome greeting is now clearly bigger (30px) than \"Pick your next quick win\" (22px)",
    ],
  },
  {
    version: "2.8.0",
    date: "2026-07-06",
    changes: [
      "Profile picture is now a clean full circle everywhere — removed the extra border ring",
      "New: Terms of Service and Privacy Policy pages, with a required acknowledgement checkbox at sign-up and a one-time re-acknowledgement popup for existing accounts (mirrors how the required-username gate works)",
      "Language bubbles are more compact and denser, each now showing a small illustrated icon for its country/region (Statue of Liberty for US, Big Ben for UK, Spain's flag, a sun motif for Latin America)",
      "Native English speakers (not based in the UK) can now also learn English (UK) — its content is genuinely comparative (British vs. American), so prompts, category labels, and the sublabel automatically switch to English-native phrasing instead of the Spanish-learner phrasing used for the track's original audience",
    ],
  },
  {
    version: "2.7.0",
    date: "2026-07-06",
    changes: [
      "Fixed: the native language/country badge could show stale data after changing it in Settings — Home now re-fetches your session whenever you land back on it, instead of only on first load",
      "Welcome greeting is now bigger than \"Pick your next quick win\" (was backwards), with a waving-hand animation and a one-time shimmer sweep across your username on load",
      "Removed the boxy borders around the top-row icons — softer, borderless circles/pills instead",
      "Added the SquirreLingo logo (matching the favicon) next to the wordmark on the home screen and sign-in page",
    ],
  },
  {
    version: "2.6.0",
    date: "2026-07-06",
    changes: [
      "Native language/country moved from a bottom footer tag to a compact badge (country code + flag) in the top icon row — resolves the earlier alignment issue by removing it from the bottom entirely",
      "Version tag is now fixed to the bottom of the viewport at all times, instead of sitting in normal page flow",
      "Removed the redundant large avatar from the welcome header (profile picture already shows via the Settings icon)",
      "\"Pick your next quick win\" is now noticeably bigger and bolder",
      "Help page revisited top to bottom: now covers the category picker, review mode, configurable rounds/timer, required usernames + verify/alternatives, onboarding, and the grouped Settings sections — all previously undocumented",
      "New standing practice: a reminder comment above CHANGELOG in lib/version.js to keep the Help page in sync with every user-facing change going forward",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-07-06",
    changes: [
      "Username is now required at sign-up (previously optional)",
      "New username availability field with an explicit \"Verify\" button — if taken, shows a few auto-generated available alternatives to pick from with one tap. Used at sign-up, in Settings, and in the forced-username popup",
      "Settings page reorganized into clear sections: Profile, Account, Language & Learning, and Subscription (placeholder for later)",
    ],
  },
  {
    version: "2.4.0",
    date: "2026-07-06",
    changes: [
      "New: any signed-in account without a username now gets a mandatory popup to create one before continuing — covers both existing accounts and anyone who skipped it at sign-up",
      "Home screen: the Settings icon is now your actual profile picture; hover text changed to \"User Settings\"",
      "Centered welcome greeting with your username, localized by native language (\"Welcome\" / \"¡Bienvenido/a\"), with a little pop-in animation and a wave",
      "\"What do you want to learn?\" replaced with \"Pick your next quick win ⚡\"",
      "Back buttons across every page (play, Settings, Dashboard, Help, Changelog, What's New) are now higher-contrast and more noticeable, not just a faint gray outline",
      "Help page updated to describe the new profile-picture icon and \"User Settings\" label",
    ],
  },
  {
    version: "2.3.0",
    date: "2026-07-06",
    changes: [
      "Sign out moved from the home screen to the bottom of Settings; remaining home-screen icons shift right",
      "New pre-round category picker — practice vocab-only, verbs/grammar-only, translation-only, or phonetics-only, instead of always mixed",
      "New \"review mode\" setting (Settings → Gameplay): pause after each answer, read the bilingual explanation inline, tap \"Next\" to continue — for anyone who'd rather review immediately than wait",
      "Questions-per-category, phonetics-pairs-per-round, and per-question timer are now all configurable in Settings → Gameplay, with the option to use one timer for everything or set phonetics separately",
      "New guided onboarding flow right after first sign-up: native language (required), native country (optional), and profile picture (optional) in one short wizard, replacing the old \"just show every track\" fallback for brand-new accounts",
    ],
  },
  {
    version: "2.2.0",
    date: "2026-07-06",
    changes: [
      "New \"What's New\" page (! icon, home screen) — shows just the latest release's notes; the version tag at the bottom still opens the full changelog",
      "A small red notification dot appears on the ! icon whenever there's a version you haven't seen yet — clears once you open the page",
    ],
  },
  {
    version: "2.1.1",
    date: "2026-07-06",
    changes: [
      "Fixed: the region/flag tag and version tag were sitting side-by-side instead of stacked — switched to a flex-column layout so they reliably stack and center regardless of their own width",
      "Help page wording generalized beyond English/Spanish, since more language pairs keep getting added",
      "Removed the redundant \"Help\" entry from the Help page's own icon list",
      "Removed the \"Updates\" section from the Help page",
    ],
  },
  {
    version: "2.1.0",
    date: "2026-07-06",
    changes: [
      "Right/wrong answer feedback is now much more noticeable: a green pulse-glow on correct, a red shake on wrong, thicker borders, bolder colors, and bigger check/X icons",
      "New Help page (? icon on home screen) — a full walkthrough covering icons, language selection, rounds, missed-question review, explanations/archive, skill levels, profile pictures, and account security",
      "Native country and flag-avatar pickers are now searchable dropdowns — full list shown by default, filters live as you type",
      "Simplified language cards on the home screen: just skill level + XP progress now, no more sublabel text clutter",
      "Fixed alignment between the region/flag tag and the version tag at the bottom of the home screen — both now use the same centering approach",
      "Added a proper favicon — a little squirrel mascot icon for the browser tab",
    ],
  },
  {
    version: "2.0.1",
    date: "2026-07-06",
    changes: [
      "Fixed: sign-up now works correctly whether email confirmation is on or off in Supabase — previously always showed \"check your email,\" even when confirmation was disabled and a session came back immediately",
      "README: clarified that Supabase's built-in email service only delivers to your own account's team members by default (not the public), which is the real cause behind both \"can't sign up\" and \"email rate limit exceeded\" — fix is turning off email confirmation for sign-up, and optionally configuring custom SMTP (via your existing Resend account) for password-reset emails too",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-05",
    changes: [
      "Renamed the app from Reactor Lang to SquirreLingo — fun, memorable, and honest about who it's built for",
    ],
  },
  {
    version: "1.9.2",
    date: "2026-07-05",
    changes: [
      "Renamed \"Update\" to \"Reload\" throughout the version-check popup — more accurate wording for a website",
      "Removed \"Signed in as\" prefix on the home screen — just your username now, styled with a bit more personality",
    ],
  },
  {
    version: "1.9.1",
    date: "2026-07-05",
    changes: [
      "Update popup now forces a mandatory update on the sign-in screen specifically (blocking, no 'Wait' option) — same idea as a mobile app requiring an update before launch",
      "Everywhere else (already inside the app), it stays a dismissible soft prompt, exactly as before",
    ],
  },
  {
    version: "1.9.0",
    date: "2026-07-05",
    changes: [
      "New: soft-prompt update popup — checks for a newer deployed version every minute (and whenever the tab regains focus), showing an \"Update now / Wait\" popup rather than forcing a reload",
      "Nothing is interrupted if you pick 'Wait' — finish your round, come back to it whenever",
      "public/version.json is now auto-generated from CURRENT_VERSION on every build — one source of truth, no manual step",
    ],
  },
  {
    version: "1.8.1",
    date: "2026-07-05",
    changes: [
      "Fixed: flags now render as real images (via a flag CDN) instead of emoji — Windows doesn't ship flag emoji glyphs, so they were showing as plain two-letter codes",
      "Native country changed from a button grid to a searchable dropdown, now listing all ~195 countries instead of just Spanish/English-speaking ones",
      "Same for the flag-avatar picker in Profile picture settings — full country list, real flag image preview",
    ],
  },
  {
    version: "1.8.0",
    date: "2026-07-05",
    changes: [
      "Progress dashboard: total XP/streak/rounds across all languages, plus a per-language breakdown (bar-chart icon on home screen)",
      "Skill levels added to every track (No experience/Beginner/Intermediate/Advanced/Native), based on the real CEFR framework (A1-C2)",
      "Every existing question (~90 across all 4 tracks) tagged with a CEFR difficulty level",
      "Rounds now bias toward your current skill level without ever leaving a round short on content",
      "Accuracy tracking + a \"ready to advance?\" prompt once you're consistently doing well at your level",
      "New placement quiz (per track) for anyone unsure where they fall — untimed, samples across difficulty tiers",
    ],
  },
  {
    version: "1.7.0",
    date: "2026-07-05",
    changes: [
      "\"Signed in as\" now shows your username if you've set one, otherwise your email",
      "Profile pictures: upload a photo, pick a generic icon, or use a country flag as your avatar (Settings → Profile picture)",
      "Added a Native country setting; combined with native language, infers a regional label + flag (e.g. Spanish + Venezuela → \"Español (Latinoamérica)\" 🇻🇪) shown on the home screen just above the version tag",
      "Split the English track into English (US) and English (UK) — genuinely distinct content: different everyday vocabulary, idioms, and non-rhotic phonetics for UK",
    ],
  },
  {
    version: "1.6.0",
    date: "2026-07-05",
    internal: true,
    changes: [
      "Added `npm run deploy` — stages, commits (using the current version as the commit message), pulls, and pushes in one command, to avoid forgetting a step",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-07-05",
    internal: true,
    changes: [
      "Database schema changes can now deploy automatically on git push (GitHub Action + Supabase CLI), instead of manual copy-paste into the SQL Editor",
      "Converted the schema into a proper migrations history (supabase/migrations/) — schema.sql kept as a manual-fallback reference",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-07-05",
    changes: [
      "Current-password re-entry required before changing email or password in Settings",
      "Show/hide toggle (eye icon) on every password field, app-wide",
      "Password strength meter while typing a new password",
      "Changing your password now signs out any other devices you're logged in on elsewhere, for security",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-05",
    changes: [
      "Friendlier color palette (warm plum/pink instead of the original near-black HUD look)",
      "Animated per-track background themes; home screen cycles seamlessly through all of them",
      "Settings moved behind a gear icon on the home screen (with hover tooltip)",
      "Added a version log and version tag (this page!)",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-05",
    changes: [
      "Optional username sign-up/sign-in (alongside email) — usernames never expose emails",
      "Forgot password flow (email reset link)",
      "Existing-email detection on sign-up, with a clear error instead of a silent no-op",
      "All account settings (username, email, password, native language) editable via an Edit/Save/Cancel pattern",
      "Security notification emails on username/email/password changes, via Resend",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-07-05",
    changes: [
      "Native/base language selection moved out of sign-up, chosen on first home-screen load instead",
      "Bubble-style picker for target language, filtered by native language",
      "Added Spain (Castilian) Spanish as its own track — vosotros, distinción, peninsular vocabulary",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-05",
    changes: [
      "Initial release: real accounts + database sync across devices (Supabase)",
      "Full Latin American Spanish track, ported from the original prototype",
      "Starter English (for Spanish speakers) track",
      "Mixed rounds: vocab, verbs, translation, phonetics (readable respelling, not IPA)",
      "Missed-question review mode, with bilingual explanations",
      "Explanation history + archive (paginated, never silently deleted)",
      "\"Don't repeat too soon\" freshness rotation across questions",
    ],
  },
];

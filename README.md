# SquirreLingo

A fast, ADHD-friendly language practice app with real accounts and a real database —
your progress syncs across every device. Currently has four tracks:

- **Spanish (Latin America)** — full content
- **Spanish (Spain / Castilian)** — starter content, distinct vosotros/distinción grammar
- **English (US)** (for Spanish speakers) — starter content
- **English (UK)** (for Spanish speakers) — starter content, distinct vocabulary/idioms/non-rhotic phonetics from American English

## Stack

- **Next.js** (React) — the app itself
- **Supabase** — auth (sign up/sign in) + Postgres database, free tier is plenty for personal use
- **Vercel** — free hosting, deploys straight from GitHub

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is fine)
2. Once it's created, go to **SQL Editor** → New query
3. Paste the entire contents of `supabase/schema.sql` and run it — this creates all the
   tables and locks them down so each user can only ever see their own data
4. Click the **Connect** button near the top of your project page — it shows your
   Project URL and anon/publishable key together in one place. (If you don't see it
   there, the URL is under **Project Settings → Data API**, and the key is under
   **Project Settings → API Keys**.)

## 2. Configure the app locally

```bash
cp .env.local.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` — sign up with an email/password, and you're playing.

**Important — turn off email confirmation** (this is the fix for both "new users can't
sign up" and "email rate limit exceeded" errors): by default, Supabase's built-in email
service only delivers to email addresses on your own Supabase account team, and is
capped at ~2 emails/hour regardless. That means anyone who isn't you literally cannot
receive a confirmation email — signups for anyone else will fail or hang.

Turn it off: **Authentication → Sign In / Providers → Email → "Confirm email" → off**.
With this off, `signUp()` logs someone in immediately — no email step at all, no rate
limit involved for sign-up. The app already handles this automatically (see
`app/auth/page.js`) — it checks whether a session came back from sign-up and skips
straight into the app if so.

**Note:** this only fixes sign-up. Password-reset emails still go through Supabase's
built-in sender and are still capped at ~2/hour, since those emails have to prove
account ownership and can't just be skipped. If you want those unrestricted too (and to
support real password resets for more than a couple of people), configure **Custom
SMTP** — reuse the Resend account you already set up for security notifications:
**Authentication → Emails → SMTP Settings**, host `smtp.resend.com`, port `465`,
username `resend`, password = your Resend API key.

## 3. Deploy it for real (so it works from any device)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → import that repo
3. In the deployment settings, add the two environment variables from your `.env.local`
   (plus `RESEND_API_KEY` if you're using the security notification emails below)
4. Deploy

**Tip:** if you add environment variables *after* the fact via Project → Settings →
Environment Variables, make sure they're checked for the **Production** environment
specifically (not just a custom one you might create) — and you'll need to trigger a
**Redeploy** afterward, since env var changes don't apply retroactively.

That's it — you'll get a real URL (e.g. `squirrelingo.vercel.app`) that works identically
on your phone, your Windows machine, or your friend's phone. Everyone signs in with their
own account, and everyone's progress is private to them (enforced at the database level,
not just in the app).

## Automating database migrations on push (optional but recommended)

Instead of copy-pasting SQL into the dashboard every time something changes, schema
changes can now deploy automatically whenever you push to `main` — same idea as
Vercel auto-deploying your app code, but for the database.

**One-time setup:**

1. Install the Supabase CLI locally (`npm install -g supabase` or see
   [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli))
2. Get three values and add them as **GitHub repo secrets**
   (your repo → Settings → Secrets and variables → Actions → New repository secret):
   - `SUPABASE_ACCESS_TOKEN` — Supabase Dashboard → your account icon → **Access Tokens** → generate one
   - `SUPABASE_PROJECT_ID` — Project Settings → General → **Reference ID** (also visible in your project's URL)
   - `SUPABASE_DB_PASSWORD` — the database password you set when creating the project
     (reset it under Project Settings → Database if you don't remember it)
3. That's it — the workflow file (`.github/workflows/supabase-migrations.yml`) is already
   included and will run automatically.

**Going forward**, don't hand-edit `supabase/schema.sql` for new changes — instead:
```bash
supabase link --project-ref <your-project-ref>   # one-time, per machine
supabase migration new some_short_description
```
That creates a new timestamped file under `supabase/migrations/`. Put your SQL in it,
commit, and push to `main` — the GitHub Action applies it automatically. `schema.sql`
stays around as a manual-fallback reference (kept in sync by hand), in case you ever
want to paste the whole thing into the SQL Editor directly instead.

The current migrations already include everything from previous updates (accounts,
profiles/usernames, etc.) as one baseline file, so this is safe to set up at any point
— it won't try to re-create anything that already exists.

## Security notification emails (optional but recommended)

Changing your username, email, or password now sends a heads-up email — this is a
security measure so you'd notice if someone else changed something on your account.
This uses **Resend** (a transactional email API, free tier: 100/day, 3,000/month).

1. Create a free account at [resend.com](https://resend.com)
2. Create an API key
3. Add it as an environment variable (both locally in `.env.local` and in Vercel):
   ```
   RESEND_API_KEY=re_your_key_here
   ```

**Important real-world limitation:** without verifying your own domain in Resend, you
can only send emails to the address you signed up to Resend with — not to your friend's
address. For two people to actually receive these notifications, verify a domain in
Resend's dashboard (any domain you control) and set:
```
RESEND_FROM_EMAIL=notifications@yourdomain.com
```
If you skip this whole section, the app still works fine — it just silently skips
sending the notification email rather than failing the actual account change.

## Password reset — one extra Supabase setting

For "Forgot password" to redirect correctly, add your reset-password URL to Supabase's
allowlist: **Authentication → URL Configuration → Redirect URLs**, add both:
```
http://localhost:3000/reset-password
https://your-deployed-url.vercel.app/reset-password
```

## If you already deployed this before these changes

Either re-run the (updated) `supabase/schema.sql` in the SQL Editor by hand — it's
safe to re-run in full — or set up the automated migrations workflow above, which
will apply the same changes on your next push to `main`.

## One-command deploy

Instead of `git add` / `git commit` / `git push` by hand (and forgetting a step — like
last time), run:

```bash
npm run deploy
```

This stages everything, commits using your current version number from `lib/version.js`
as the commit message (e.g. `v1.5.0`), pulls, then pushes. If you bump `CURRENT_VERSION`
before running it, that becomes the commit message automatically — one less thing to
remember. If there's nothing new to commit, it just pulls/pushes and skips the commit step.

## Update popup (new version detection)

The app checks for a newer deployed version every minute (and whenever you switch
back to the tab). Behavior depends on where the person is:

- **On the sign-in screen:** a **mandatory** update popup — no "Wait" option, sign-in
  is blocked until they update. Same idea as a mobile app requiring an update before
  it'll launch.
- **Anywhere else (already inside the app):** a **dismissible** popup — "Update now"
  reloads immediately, "Wait" lets them finish what they're doing. Won't nag again for
  that same version, but reappears if an even newer version ships before they update.

This works via `public/version.json`, which is **auto-generated from
`CURRENT_VERSION`** every time you run `npm run build` (or `npm run dev`) — bump the
version in `lib/version.js` as usual, nothing else to remember.

## Version tag & changelog

The small `vX.Y.Z` tag is fixed to the bottom of the viewport at all times (on the home
screen and Settings) and links to a full changelog. To ship a new version: bump
`CURRENT_VERSION` and add an entry at the top of `CHANGELOG` in `lib/version.js`.

**Standing practice:** whenever a change is user-facing enough to belong in the
changelog, also check whether `app/help/page.js` needs updating in the same pass —
new settings, new pages, changed icons/labels, changed flows. There's a reminder
comment directly above `CHANGELOG` in `lib/version.js` for exactly this. The Help page
fell noticeably out of date once already before this practice was written down.

There's also a **"What's New" page** (the `!` icon on the home screen) that shows just
the most recent entry — the version tag still opens the full history. A small red dot
appears on the `!` icon whenever someone hasn't seen the current version's notes yet
(tracked per-account via `last_seen_version`), and clears once they open the page.

## Skill levels & progress dashboard

Every track now has a **skill level** (No experience / Beginner / Intermediate /
Advanced / Native), based on the real-world CEFR framework (A1–C2) under the hood —
the same scale used by actual language certifications like DELE and Cambridge/IELTS.

- Every question is tagged with a CEFR difficulty. Rounds bias toward your current
  level (without hard-excluding anything, so a round is never short on content)
- Answer consistently well (85%+ over 30+ questions) at your current level and a
  "ready to advance?" prompt appears — accept it or dismiss it, your choice
- Not sure where you stand? Take the **placement quiz** (per track) — a short,
  untimed sample across difficulty tiers that recommends a starting level
- The **dashboard** (bar-chart icon, home screen) shows total XP/streak/rounds
  across every track, plus a per-language breakdown

## Profile pictures & native country/flag

Settings now has a **Profile picture** section — upload a photo, pick a generic fun
icon, or use a country flag as your avatar. Uploaded photos go through Supabase
Storage (a new `avatars` bucket, set up automatically by the migrations) — public
read, but only you can upload/replace your own.

There's also a **Native country** setting (separate from native language) — a full
searchable dropdown of ~195 countries. Combined with native language, it infers a
regional label + flag shown on the home screen — e.g. Spanish + Venezuela shows
"Español (Latinoamérica)" plus the Venezuelan flag; English + United Kingdom shows
"English (UK)" plus the UK flag. No separate "region" picker needed — it's inferred
from the country you pick. Flags render as real images (via a flag CDN), not emoji —
Windows in particular doesn't ship flag emoji glyphs in its default font, so relying
on emoji would've shown plain two-letter codes there instead of actual flags.

## Two practice modes: Quick Quiz + Lessons

Direct response to real user-testing feedback (a first-time tester, 50+, no
language-learning background, found the game-style format not self-
explanatory). **Lessons mode** (`app/learn/[trackId]/page.js`) is a calmer
alternative to the original **Quick Quiz** mode: no timer, no combo scoring,
walks through every item in one category at a time in a fixed order
(easiest CEFR tier first, via `buildLessonSequence` in `lib/gameEngine.js`),
showing the bilingual explanation immediately after each answer rather than
only in Review mode.

Both modes write to the exact same `progress`/`seen_questions`/
`missed_questions` data via the same `lib/db.js` functions Quick Quiz already
used — switching modes never resets or fragments progress, and the mastery
tracker reflects activity from both. Each mode's start screen links to the
other (`switchToLessons`/`switchToQuickQuiz` in `lib/playStrings.js`).

**About page** (`app/about/page.js`) explains what the app is and how both
modes work, linked from Help. A one-time **welcome popup**
(`lib/WelcomePopup.js`, versioned via `lib/welcomeVersion.js` the same way
`RequireLegalGate` versions ToS acceptance) introduces both modes right after
onboarding completes, with a link to the full About page.

## Real-user-testing fixes (v2.18.0)

Beta testers surfaced two genuine bugs, fixed here:
- **Lessons mode wasn't saving XP incrementally** — it only called `saveProgress`
  once, at full lesson completion, unlike Quick Quiz mode which saves after
  every answer. Stopping partway through a lesson (which the app is explicitly
  designed to allow) silently lost any XP already earned. Fixed by saving
  incrementally in `handleAnswer`, matching Quick Quiz mode's pattern —
  streak/`last_played` now also apply on the first answer of a session rather
  than waiting for full completion.
- **Category names ignored skill-level-based native-language chrome** — they
  only switched language for the narrow English US/UK cross-dialect case
  (`track.cats[catId].labelEn`), never for the general `uiLangForSkill` system
  everything else respects. Fixed with a shared `CATEGORY_NAMES` table in
  `lib/playStrings.js` (`categoryDisplayName`) — the 4 category concepts mean
  the same thing regardless of which of the 14 tracks they're attached to, so
  one shared en/es table covers all of them, rather than per-track labels.

Also: the Quick Quiz ↔ Lessons switch is now a real toggle
(`lib/ModeToggle.js`) at the top of each screen instead of a small link at the
bottom; both start screens have a collapsible "What's on this page?" section;
and the Help page no longer hardcodes "Mixto" as if that's always the literal
button text.

## Navigation drawer replaces the top icon row

The language badge, What's New, Help, Dashboard, and Settings icons were
cluttering the top of the home screen, especially on mobile. Replaced with a
single slide-out drawer (`lib/NavDrawer.js`) triggered by tapping the profile
picture — a real full-height drawer, not a compact dropdown. The What's New
notification dot now lives on the profile picture itself. The language badge
was dropped entirely (not migrated into the drawer) since Settings, already
one tap away in the drawer, covers the same thing.

## In-app feedback form

Settings → Feedback (`app/feedback/page.js`) replaces external Google Forms,
which weren't importing/styling well. Responses write directly to a new
`feedback_submissions` table (`supabase/migrations/00000000000004_feedback_submissions.sql`)
via `submitFeedback` in `lib/db.js` — no external tool, no import step, styled
consistently with the rest of the app.

## Track names shown in your native language

Every track has `nameEn`/`nameEs` fields (in addition to `label`, its own
name for itself in the target language) — the home screen, dashboard, and
play page title all pick whichever matches the viewer's native language,
falling back to `label` if neither is set. Someone might not recognize a
language from its flag or its self-name, so this shows "Italian" to an
English speaker rather than assuming they'll recognize "Italiano."

## Content-depth pass (in progress)

Started deepening existing tracks well beyond the initial 36-item bar,
rather than continuing to add new languages — more languages with thin
content isn't as useful as fewer languages covered thoroughly. **French
(France)** is the first track taken through this pass: 36 → 69 items,
including the first C1-tier content of any track. The rest of the 14 tracks
are queued for the same treatment across future sessions — see the to-do
list for current status.

## New language expansion — complete

Shipped: **Italian**, **French (France)**, **French (Canada/Québécois)**,
**Portuguese (Brazil)**, **Portuguese (Portugal)**, **German**, **Russian**,
**Japanese**, **Mandarin Chinese**, and **Korean** — all for English
speakers, all at full depth (36 items each — vocab, grammar, idioms,
phonetics, spanning CEFR A1-B2). This completes the original 8-language
backlog item.

German was the first track needing real grammatical departure from the
Romance-language pattern (three genders, full case system, verb-second word
order). Russian needed zero architecture changes despite Cyrillic — just a
different single alphabet, no tone system.

**Japanese, Mandarin, and Korean** raised a genuine design question before
any content was written: how to show non-Latin script. Decision (confirmed
directly rather than guessed): **native script + romanization together**,
in every prompt and option. This needed zero engine changes — both are just
embedded in the same content strings every other track already uses for
parenthetical glosses. Mandarin's tones are written with standard pinyin
diacritics (ā á ǎ à), the normal way tones are represented in pinyin, so no
new phonetic system was needed either.

Each of these three covers what's structurally distinctive about it:
Japanese (SOV order, particles, no person/number conjugation, pitch accent),
Mandarin (zero verb conjugation, aspect particles instead of tense, required
measure words, tone sandhi), and Korean (SOV order, particles, adjectives
that conjugate like verbs, honorific speech levels, batchim linking).

All fourteen tracks follow the same shape — `nativeLang`, `targetLang`,
CEFR-tagged bank items, a phonetics extraBank — so every one of them needed
zero game-engine changes, just a content file, a registration line in
`data/tracks/index.js`, a theme gradient (`lib/theme.js`), and an icon
(`lib/trackIcons.js`).

## Gameplay customization & onboarding

- **Category picker** — before starting a round, choose a single category to focus on
  (vocab-only, grammar-only, etc.) or leave it on "Mixto" for the default blend
- **Review mode** (Settings → Gameplay) — pauses after each answer to show the bilingual
  explanation inline, with a "Next" button, instead of auto-advancing after 750ms
- **Configurable round shape** (Settings → Gameplay) — questions-per-category, phonetics
  pairs per round, and the per-question timer (same for everything, or set phonetics
  separately) are all adjustable per account
- **Guided onboarding** — first-time sign-ups now go through a short wizard (native
  language → native country → profile picture) instead of landing on a "showing every
  track" fallback. Native language is the only required step; country and picture can be
  skipped and set later in Settings

Sign out lives at the bottom of Settings now, not on the home screen.

## Required usernames

Usernames are required at sign-up, and any pre-existing account without one gets a
mandatory, non-dismissible popup (`lib/RequireUsernameGate.js`, mounted globally in
the root layout) prompting them to pick one before continuing anywhere in the app —
so this is covered both going forward and retroactively, no separate migration script
needed. Excluded from the gate: `/auth`, `/forgot-password`, `/reset-password`,
`/onboarding` (no session yet, or already mid-flow).

Everywhere a username gets entered (sign-up, Settings, the forced popup) uses the same
`lib/UsernameAvailabilityField.js` — type a name, tap **Verify**, and if it's taken
you'll see a few genuinely-available alternatives to pick from with one tap, rather
than guessing and resubmitting.

## Play-page language switches with skill level

The play page's UI chrome (buttons, labels, stats — not the actual question
content) is bilingual and picks automatically via `lib/playStrings.js`:
**No experience/Beginner/Intermediate** shows everything in the person's native
language; **Advanced/Native** shows it in the language they're learning instead.
Each track declares an explicit `targetLang` field (rather than inferring it from
`nativeLang`) specifically so this stays correct even in edge cases like the
English (US)/(UK) cross-dialect track, where "native" and "target" can end up
being the same language.

## Per-category mastery tracker

Each language's start screen has a "Progress by category" card (`computeMastery`
in `lib/gameEngine.js`) showing learned-vs-total items per category, broken down by
CEFR difficulty too. "Learned" = seen at least once and not currently in the
missed-questions pool — reusing data the app already tracks (`seen_questions` /
`missed_questions`), rather than an external word-frequency list, which the app
doesn't have access to. This means totals reflect the app's own content depth per
track — starter-set tracks will show smaller numbers until more content is added
(see backlog item #1).

## Mix-and-match category picker

The category picker (play page start screen) now supports selecting any
combination of categories, not just one at a time. Picking "Mixto" clears
whatever specific categories were selected, back to the full default blend.

## Terms of Service & Privacy Policy

`app/terms/page.js` and `app/privacy/page.js` are standard boilerplate — genuinely
useful as a starting point, but not a substitute for legal review, especially once
there's a real user base. Bracketed placeholders (`[YOUR NAME/COMPANY]`, `[DATE]`,
etc.) need filling in before relying on these for real.

Acceptance works the same way as required usernames: a checkbox at sign-up
(`agreed_to_terms` gate in the sign-up form), tracked per-account via
`legal_accepted_version` in `lib/legalVersions.js`. Bump `LEGAL_VERSION` whenever the
documents change enough to require re-acceptance — existing accounts get a mandatory
(but not app-breaking) popup the next time they use the app, mirroring
`RequireUsernameGate.js`.

## Compact bubbles & track icons

Language bubbles are smaller and denser now, each with a small illustrated icon
(`lib/trackIcons.js`) representing its country/region — hand-drawn flat SVG icons
rather than real photos, to avoid licensing questions entirely.

## English (US) ↔ English (UK) cross-learning

Native English speakers who aren't UK-based can also learn English (UK) — it shows up
as a bonus bubble automatically. This only goes one direction on purpose: the English
(UK) track's content (tag questions, "have got" vs. "do you have", non-rhotic
pronunciation, British slang) is genuinely comparative between the two dialects, so it
works well for a US-native learner. The English (US) track's content, by contrast, is
Spanish-learner-specific (false friends, generic prepositions) and doesn't actually
teach anything US-specific — enabling the reverse direction with that content as-is
would just be confusing, not useful. A proper reverse direction would need dedicated
Americanism-specific content, which is a real content-authoring task, not a quick fix.

Where prompts, category labels, and the track sublabel needed to differ for an
English-native audience vs. the track's original Spanish-learner audience, each
question in `data/tracks/enGbForEs.js` carries an optional English-native variant
(6th tuple element for bank questions, `identifyPromptEn`/`respondPromptEn` for
phonetics, `labelEn` per category, `sublabelEn` on the track) that the play and
placement pages pick automatically based on the viewer's native language.

## Account features

- **Sign in with email or username** — username is optional at sign-up; leave it
  blank to just use email. Add or change it anytime in Settings.
- **Forgot password** — link on the sign-in screen, standard email reset flow.
- **Existing-email detection** — signing up with an email that's already registered
  gives a clear message instead of silently "succeeding."
- **Security notification emails** — changing your username, email, or password
  sends a heads-up (see the Resend setup section above).

## How language selection works

Sign-up only grants access — no language questions there. Native/base language and
every other account setting live in **Settings** (the gear icon, top-right of the
home screen). The home screen shows bubble-style options for what to learn, filtered
by whichever native language you've set — until you set one, it just shows every
track so the app is still usable. Spanish is split into two separate tracks —
**Latin American** and **Spain (Castilian)** — since they differ enough (vosotros,
distinción, vocabulary) to warrant separate content rather than being treated as one
language.

## Adding more content

Each track is one file in `data/tracks/`. To add questions, follow the existing pattern —
each array entry is `[prompt, options, correctIndexInOptions, explain]`. No other code
needs to change; the app reads the bank directly.

To add a whole new track (e.g. a third target language, or a new native-language
audience), copy `data/tracks/enForEs.js` as a template, set its `nativeLang` field
(who the track is *for*), then register it in `data/tracks/index.js`. The home screen's
bubble picker and the Settings page both update automatically — nothing else to wire up.

The **English track is intentionally a starter set** — a few examples in each category to
show the pattern. Worth expanding before your friend leans on it heavily. Good categories
to grow: false friends (embarrassed/embarazada, actually/actualmente), preposition pairs
(interested in, afraid of), phrasal verbs, and reduced/connected speech (gonna, wanna,
flapped T) for the phonetics category.

## How the "don't repeat too soon" filter works

Every question tracks a `seen_at` timestamp per user. Each round draws from whichever
half of the question pool has gone longest without appearing — never-seen questions
always sort first. This spreads out repeats naturally across many rounds in the same day
without a hard cooldown that could run the pool dry mid-session.

## Notes on the explanations feature

Every answered question is stored as its own row in the `explanations` table. "Recent"
history is just the newest 150 rows; the "archive" is everything older, reached via
pagination — nothing is ever silently deleted unless you tap "Limpiar todo."

# Reactor Lang

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

By default Supabase requires email confirmation for new sign-ups. For personal/friend use,
you can turn this off: **Authentication → Providers → Email → "Confirm email" → off**.
That way you and your friend can sign up and start playing immediately without a
confirmation email step.

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

That's it — you'll get a real URL (e.g. `reactor-lang.vercel.app`) that works identically
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
back to the tab). If one's found, a popup appears — **"Update now"** reloads
immediately, **"Wait"** dismisses it so you can finish what you're doing; it won't
nag again for that same version, but will reappear if an even newer version ships
before you've updated.

This works via `public/version.json`, which is **auto-generated from
`CURRENT_VERSION`** every time you run `npm run build` (or `npm run dev`) — bump the
version in `lib/version.js` as usual, nothing else to remember.

## Version tag & changelog

The small `vX.Y.Z` tag at the bottom of the home screen and Settings links to a full
changelog. To ship a new version: bump `CURRENT_VERSION` and add an entry at the top
of `CHANGELOG` in `lib/version.js` — that's the only file that needs touching.

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

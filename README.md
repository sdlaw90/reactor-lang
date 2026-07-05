# Reactor Lang

A fast, ADHD-friendly language practice app with real accounts and a real database —
your progress syncs across every device. Currently has two tracks:

- **Spanish, for you** (Latin American Spanish — full content, ported from the original prototype)
- **English, for your friend** (starter content — see "Adding content" below)

## Stack

- **Next.js** (React) — the app itself
- **Supabase** — auth (sign up/sign in) + Postgres database, free tier is plenty for personal use
- **Vercel** — free hosting, deploys straight from GitHub

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is fine)
2. Once it's created, go to **SQL Editor** → New query
3. Paste the entire contents of `supabase/schema.sql` and run it — this creates all the
   tables and locks them down so each user can only ever see their own data
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon` `public` key

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
4. Deploy

That's it — you'll get a real URL (e.g. `reactor-lang.vercel.app`) that works identically
on your phone, your Windows machine, or your friend's phone. Everyone signs in with their
own account, and everyone's progress is private to them (enforced at the database level,
not just in the app).

## How language selection works

Sign-up only grants access — no language questions there. The first time someone
lands on the home screen after signing in, they pick their **native/base language**
(stored on their account, changeable anytime from **Settings**). Based on that choice,
the home screen shows bubble-style options for what to learn. Spanish is split into
two separate tracks — **Latin American** and **Spain (Castilian)** — since they differ
enough (vosotros, distinción, vocabulary) to warrant separate content rather than
being treated as one language.

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

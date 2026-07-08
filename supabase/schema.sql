-- Reactor Lang schema — MANUAL FALLBACK REFERENCE ONLY.
-- The source of truth for automated deploys is supabase/migrations/ (see the
-- GitHub Action). This file is kept as a full up-to-date snapshot in case you
-- ever need to paste the whole schema into the SQL Editor by hand.
-- Safe to re-run: uses "if not exists" / "or replace" everywhere.

-- One row per (user, track): xp, level, streak, etc.
create table if not exists progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  track_id text not null,
  xp int not null default 0,
  level int not null default 1,
  streak int not null default 0,
  best_combo int not null default 0,
  last_played date,
  rounds_completed int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

-- Presence of a row = this question is currently in the person's "missed" pile.
-- Deleting the row = resolved.
create table if not exists missed_questions (
  user_id uuid references auth.users(id) on delete cascade not null,
  track_id text not null,
  question_id text not null,
  missed_at timestamptz not null default now(),
  primary key (user_id, track_id, question_id)
);

-- Tracks when each question was last seen, so rounds can favor whatever's gone
-- longest without appearing (the "don't repeat too soon" filter).
create table if not exists seen_questions (
  user_id uuid references auth.users(id) on delete cascade not null,
  track_id text not null,
  question_id text not null,
  seen_at timestamptz not null default now(),
  primary key (user_id, track_id, question_id)
);

-- One row per answered question, ever. "Recent" = latest N rows;
-- "archive" = everything past that. No separate archive table needed —
-- it's just pagination over the same history, which Postgres handles natively.
create table if not exists explanations (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  track_id text not null,
  cat text not null,
  prompt text not null,
  options jsonb not null,
  correct_idx int not null,
  selected_idx int not null,
  is_correct boolean not null,
  sound text,
  explain_en text,
  explain_es text,
  created_at timestamptz not null default now()
);

create index if not exists explanations_user_track_created_idx
  on explanations (user_id, track_id, created_at desc);

-- Row Level Security: every table is locked down so a user can only ever
-- read/write their own rows, enforced by Postgres itself (not just app code).
alter table progress enable row level security;
alter table missed_questions enable row level security;
alter table seen_questions enable row level security;
alter table explanations enable row level security;

drop policy if exists "own progress" on progress;
create policy "own progress" on progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own missed" on missed_questions;
create policy "own missed" on missed_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own seen" on seen_questions;
create policy "own seen" on seen_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own explanations" on explanations;
create policy "own explanations" on explanations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Usernames (optional alternative to signing in with email)
-- ---------------------------------------------------------------

-- One row per user, holding their chosen username (nullable — not everyone sets one).
create table if not exists profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Anyone signed in can check if a username is free (needed at signup time),
-- but the table itself is never broadly readable — only via the functions below,
-- which return the minimum needed and nothing else (no emails, no other users' data).
drop policy if exists "own profile read" on profiles;
create policy "own profile read" on profiles
  for select using (auth.uid() = user_id);

drop policy if exists "own profile write" on profiles;
create policy "own profile write" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Returns true/false only — never exposes who owns a username or their email.
create or replace function is_username_taken(p_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from profiles where username = p_username);
$$;

-- Resolves a username to its email ONLY for the purpose of signing in.
-- Returns null if the username doesn't exist — callers should show a generic
-- "invalid credentials" message either way, so this never confirms whether a
-- given username exists (same anti-enumeration principle as Supabase's own
-- sign-in error messages).
create or replace function email_for_username(p_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select u.email
  from profiles p
  join auth.users u on u.id = p.user_id
  where p.username = p_username
  limit 1;
$$;

-- Only ever callable by logged-in users or the anon key doing a sign-in attempt —
-- not exposed as a general-purpose data API.
grant execute on function is_username_taken(text) to anon, authenticated;
grant execute on function email_for_username(text) to anon, authenticated;
-- Storage bucket for uploaded profile photos. Public read (so avatars display
-- for everyone), but write access is locked to each user's own folder
-- (path convention: "<user_id>/avatar.<ext>").

-- ---------------------------------------------------------------
-- Profile photo storage
-- ---------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------
-- Profile picture fields
-- ---------------------------------------------------------------

alter table profiles add column if not exists avatar_type text;
alter table profiles add column if not exists avatar_value text;

-- ---------------------------------------------------------------
-- Skill levels (CEFR-based) and rolling accuracy tracking
-- ---------------------------------------------------------------

alter table progress add column if not exists skill_level text not null default 'none';
alter table progress add column if not exists level_correct_count int not null default 0;
alter table progress add column if not exists level_total_count int not null default 0;

-- ---------------------------------------------------------------
-- In-app feedback (Settings -> Feedback, existing users only)
-- ---------------------------------------------------------------

create table if not exists feedback_submissions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null default 'general', -- 'bug' | 'feedback' | 'feature_request' | 'general' | 'beta_survey'
  message text not null,
  page_context text,
  sessions_completed text,
  continued_use_likelihood int,
  recommend_likelihood int,
  details jsonb, -- device_browser, signup_ease, categories_used[], bugs_encountered, etc. -- see app/feedback/page.js
  created_at timestamptz not null default now()
);

alter table feedback_submissions enable row level security;

drop policy if exists "own feedback inserts" on feedback_submissions;
create policy "own feedback inserts"
  on feedback_submissions for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Public beta-test applications (/beta-apply, no account needed)
-- ---------------------------------------------------------------

create table if not exists beta_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  reason text,
  languages_interested text,
  native_language text,
  current_level text,
  details jsonb, -- age_range, devices[], apps_used[], practice_frequency, etc. -- see app/beta-apply/page.js
  created_at timestamptz not null default now()
);

alter table beta_applications enable row level security;

-- Public insert (anon role, no auth) since applicants don't have accounts.
drop policy if exists "anyone can apply" on beta_applications;
create policy "anyone can apply"
  on beta_applications for insert
  to anon, authenticated
  with check (true);

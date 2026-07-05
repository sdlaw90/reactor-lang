-- Reactor Lang schema
-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).
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

-- Repair migration: rebuilds feedback_submissions and beta_applications from
-- scratch, fully idempotent (every statement uses IF NOT EXISTS / OR
-- REPLACE / DROP IF EXISTS), so it's safe to run regardless of whether
-- migrations 00000000000004-00000000000006 actually succeeded on the
-- remote database or not.
--
-- Context: migration 004 originally failed (used gen_random_uuid(), which
-- needs the pgcrypto extension explicitly enabled) and was edited in place
-- to fix it, rather than creating a new migration file. Supabase's CLI
-- tracks applied migrations by filename -- if the broken version got
-- recorded as "applied" despite failing, the corrected version may have
-- been silently skipped on the next push, meaning feedback_submissions was
-- never actually created. Migration 006 then failed trying to ALTER a table
-- that doesn't exist. This migration doesn't rely on diagnosing that
-- precisely -- it just (re)creates everything needed, safely, either way.

create table if not exists feedback_submissions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null default 'general',
  message text not null,
  page_context text,
  sessions_completed text,
  continued_use_likelihood int,
  recommend_likelihood int,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table feedback_submissions add column if not exists sessions_completed text;
alter table feedback_submissions add column if not exists continued_use_likelihood int;
alter table feedback_submissions add column if not exists recommend_likelihood int;
alter table feedback_submissions add column if not exists details jsonb;

alter table feedback_submissions enable row level security;

drop policy if exists "own feedback inserts" on feedback_submissions;
create policy "own feedback inserts"
  on feedback_submissions for insert
  with check (auth.uid() = user_id);

create table if not exists beta_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  reason text,
  languages_interested text,
  native_language text,
  current_level text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table beta_applications add column if not exists native_language text;
alter table beta_applications add column if not exists current_level text;
alter table beta_applications add column if not exists details jsonb;

alter table beta_applications enable row level security;

drop policy if exists "anyone can apply" on beta_applications;
create policy "anyone can apply"
  on beta_applications for insert
  to anon, authenticated
  with check (true);

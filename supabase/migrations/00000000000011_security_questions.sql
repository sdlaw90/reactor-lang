-- ---------------------------------------------------------------------------
-- Migration 011 — Security-question password reset (#79)
--
-- Self-serve password recovery that works WITHOUT email delivery (the #65
-- domain/SMTP chain isn't done; Supabase shared email can't reach external
-- addresses). Decision 2026-07-12: this is PERMANENT, not interim — at #65,
-- email reset becomes primary and this remains the fallback.
--
-- Design notes:
--   * Security answers are credentials: normalized (trim + lowercase +
--     collapsed whitespace) then scrypt-hashed server-side. NEVER plaintext.
--   * All three tables are service-role-only: RLS enabled with NO policies,
--     so anon/authenticated can't touch them. Every read/write goes through
--     server routes (/api/account-security, /api/password-reset,
--     /api/admin/reset-requests).
--   * profiles gains three server-written columns. The column-level UPDATE
--     grant from migration 010 is deliberately NOT extended — these columns
--     must not be client-writable (see the NOTE in migration 010).
--   * PKs: bigint generated always as identity (standing rule — no
--     gen_random_uuid; pgcrypto is not enabled).
-- ---------------------------------------------------------------------------

-- 1. Security questions: up to 3 per user, question from a curated key list
--    (lib/securityQuestions.js), answer stored as a scrypt hash.
create table if not exists public.security_questions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_key text not null,
  answer_hash text not null,
  created_at timestamptz not null default now(),
  unique (user_id, question_key)
);

alter table public.security_questions enable row level security;
-- No policies on purpose: service-role only.

create index if not exists security_questions_user_idx
  on public.security_questions (user_id);

-- 2. One-time reset tokens, issued after a successful 2-of-3 answer check.
--    The raw token never touches the database — only its sha256 hash.
--    Durable (DB-backed) so verify and reset can land on different
--    serverless instances; single-use via used_at.
create table if not exists public.password_reset_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.password_reset_tokens enable row level security;
-- No policies on purpose: service-role only.

create index if not exists password_reset_tokens_user_idx
  on public.password_reset_tokens (user_id);

-- 3. Admin reset requests: the path for accounts with no security questions
--    on file. Surfaced in the admin panel (Reset Requests tab); an admin
--    sets a temporary password via the existing users set_password action.
--    status: 'pending' | 'resolved' | 'rejected'
create table if not exists public.password_reset_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id),
  note text
);

alter table public.password_reset_requests enable row level security;
-- No policies on purpose: service-role only.

create index if not exists password_reset_requests_pending_idx
  on public.password_reset_requests (requested_at desc)
  where status = 'pending';

-- 4. profiles additions — ALL server-written (service role); the migration
--    010 column-level grant list is intentionally unchanged.
--    * password_hint: shown pre-auth on the reset page (it's a hint by
--      design — the user is warned it's visible to anyone with their email).
--    * sq_failed_attempts / sq_locked_until: per-account brute-force lockout
--      for the answer-verification endpoint (durable across serverless
--      instances, unlike the per-IP in-memory limiter).
alter table public.profiles
  add column if not exists password_hint text,
  add column if not exists sq_failed_attempts integer not null default 0,
  add column if not exists sq_locked_until timestamptz;

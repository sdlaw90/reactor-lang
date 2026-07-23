-- Migration 016: admin_settings — a small key/value store for admin-tunable
-- settings that should persist in the DB and be shared across all admins and
-- devices (rather than living in code or one browser's localStorage).
--
-- First consumer: the Progress dashboard's "needs a nudge" thresholds
-- (key = 'progress_nudge', value = { minAnswers, quietDays }). Reusable for any
-- future admin setting — add a new key rather than a new table.
--
-- SECURITY: service-role only. RLS is ON with NO policies, so anon/authenticated
-- can never read or write it; the admin API (service role, which bypasses RLS)
-- is the only path in. Conventions: idempotent, no gen_random_uuid.

create table if not exists admin_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table admin_settings enable row level security;

-- No policies on purpose (deny-all to normal roles). Explicit grants keep the
-- service role working even where platform default privileges aren't assumed
-- (same self-sufficiency principle as migration 012).
revoke all on admin_settings from anon, authenticated;
grant select, insert, update, delete on admin_settings to service_role;

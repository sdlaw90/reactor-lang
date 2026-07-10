-- 00000000000009: Feedback rework (bug reports / feature requests) + error logging + screenshot storage
-- Follows 00000000000008_beta_application_status.
-- Conventions: bigint generated always as identity PKs (no gen_random_uuid); idempotent/self-contained.

-- ---------------------------------------------------------------------------
-- 1. feedback_submissions: additive columns for the new bug/feature flows.
--    type gains two new values ('bug', 'feature'); existing 'beta_survey'
--    rows are untouched. Identity is snapshotted into username/email by the
--    server route (derived from the session, never typed by the user).
-- ---------------------------------------------------------------------------
alter table public.feedback_submissions
  add column if not exists username text,
  add column if not exists email text,
  add column if not exists error_code text,
  add column if not exists screenshot_path text;

create index if not exists feedback_submissions_error_code_idx
  on public.feedback_submissions (error_code)
  where error_code is not null;

create index if not exists feedback_submissions_type_idx
  on public.feedback_submissions (type);

-- ---------------------------------------------------------------------------
-- 2. error_logs: every client-side crash caught by the new error boundaries
--    logs here with a short searchable code (shown to the user on the error
--    screen, e.g. SQ-M3K7X2). Inserts go through /api/log-error.
-- ---------------------------------------------------------------------------
create table if not exists public.error_logs (
  id bigint generated always as identity primary key,
  error_code text not null,
  message text,
  stack text,
  url text,
  user_agent text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists error_logs_error_code_idx on public.error_logs (error_code);
create index if not exists error_logs_created_at_idx on public.error_logs (created_at desc);

alter table public.error_logs enable row level security;

-- The /api/log-error route prefers the service role key (bypasses RLS) but
-- falls back to the anon key, mirroring the beta-apply pattern -- so allow
-- anon/authenticated INSERT only. No select/update/delete policies: reading
-- error logs is admin-only via service role or the Supabase dashboard.
drop policy if exists error_logs_insert_any on public.error_logs;
create policy error_logs_insert_any
  on public.error_logs
  for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- 3. Storage bucket for bug-report screenshots. Private (no public reads);
--    5 MB cap and images only, enforced by the bucket itself as well as the
--    server route. Authenticated users may upload; nobody but the service
--    role can read (admin notification emails use short-lived signed URLs).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bug-screenshots', 'bug-screenshots', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types,
      public = excluded.public;

drop policy if exists bug_screenshots_authenticated_insert on storage.objects;
create policy bug_screenshots_authenticated_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'bug-screenshots');

-- Deliberately no SELECT policy on this bucket: uploads are write-only for
-- users. The admin reads via signed URLs generated with the service role.

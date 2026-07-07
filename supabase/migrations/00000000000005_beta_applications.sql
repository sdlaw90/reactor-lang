-- Beta-test applications, distinct from feedback_submissions: this form is
-- PUBLIC, reachable by people who don't have an account yet (that's the
-- whole point — they're applying for access). No user_id/auth requirement,
-- unlike feedback_submissions which is for people already using the app.
--
-- Uses "bigint generated always as identity" for the id column, matching
-- the rest of the schema's convention (not gen_random_uuid(), which needs
-- the pgcrypto extension explicitly enabled).

create table if not exists beta_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  reason text,
  languages_interested text,
  created_at timestamptz not null default now()
);

alter table beta_applications enable row level security;

-- Public insert (anon role, no auth) since applicants don't have accounts.
drop policy if exists "anyone can apply" on beta_applications;
create policy "anyone can apply"
  on beta_applications for insert
  to anon, authenticated
  with check (true);

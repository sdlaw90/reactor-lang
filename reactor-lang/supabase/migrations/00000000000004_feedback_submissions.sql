-- In-app application/feedback forms (replaces external Google Forms, which
-- imported looking broken/default-styled). Users can insert their own
-- feedback; no read policy for regular users since review happens directly
-- via the Supabase dashboard, not through the app.
--
-- Uses "bigint generated always as identity" for the id column, matching the
-- existing explanations table's convention (baseline migration) -- NOT
-- gen_random_uuid(), which requires the pgcrypto extension to be explicitly
-- enabled and was the likely cause of this migration failing to apply.

create table if not exists feedback_submissions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null default 'general', -- 'bug' | 'feedback' | 'feature_request' | 'general'
  message text not null,
  page_context text, -- e.g. which page/track they were on when submitting, optional
  created_at timestamptz not null default now()
);

alter table feedback_submissions enable row level security;

drop policy if exists "own feedback inserts" on feedback_submissions;
create policy "own feedback inserts"
  on feedback_submissions for insert
  with check (auth.uid() = user_id);

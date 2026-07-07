-- In-app application/feedback forms (replaces external Google Forms, which
-- imported looking broken/default-styled). Users can insert their own
-- feedback; no read policy for regular users since review happens directly
-- via the Supabase dashboard, not through the app.

create table if not exists feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'general', -- 'bug' | 'feedback' | 'feature_request' | 'general'
  message text not null,
  page_context text, -- e.g. which page/track they were on when submitting, optional
  created_at timestamptz not null default now()
);

alter table feedback_submissions enable row level security;

create policy "Users can submit their own feedback"
  on feedback_submissions for insert
  with check (auth.uid() = user_id);

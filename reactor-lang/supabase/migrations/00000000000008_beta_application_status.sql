-- Status tracking for the admin beta-application approval flow.
-- 'pending' (default) | 'approved' | 'rejected'

alter table beta_applications add column if not exists status text not null default 'pending';
alter table beta_applications add column if not exists reviewed_at timestamptz;

-- No new RLS policy needed for reading/updating -- that only happens via the
-- server-side admin API route using the service role key, which bypasses
-- RLS entirely. The existing "anyone can apply" insert policy is unaffected.

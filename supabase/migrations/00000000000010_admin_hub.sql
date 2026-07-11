-- 00000000000010: Admin hub — one-stop admin panel at /admin.
-- Follows 00000000000009_feedback_rework_and_error_logs.
-- Conventions: bigint generated always as identity PKs (no gen_random_uuid); idempotent/self-contained.

-- ---------------------------------------------------------------------------
-- 1. profiles.is_admin: session-based admin flag. The server-side admin
--    helper (lib/adminAuth.js) treats a user as admin if this is true OR
--    their email matches ADMIN_EMAIL/NEXT_PUBLIC_ADMIN_EMAIL (the env-var
--    bootstrap that already gates /admin today — so this migration needs no
--    manual seeding step to keep the current admin working). To add a second
--    admin later:  update profiles set is_admin = true where username = '...';
--    RLS note: the existing "own profile read" policy lets a user see their
--    OWN is_admin (used by the nav drawer); writes still go through the
--    own-profile policy, but a user setting is_admin=true on their own row
--    gains nothing — the server helper re-checks via service role, and this
--    column is only trusted server-side. Defense in depth below narrows the
--    UPDATE grant so a user can't even cosmetically flip their own flag.
alter table public.profiles add column if not exists is_admin boolean not null default false;

do $$
begin
  -- Narrow the table-level UPDATE grant so authenticated users can update
  -- their own profile columns (the app's two upserts touch exactly these)
  -- but never is_admin, even through the own-profile RLS policy.
  -- NOTE for future migrations: adding a client-writable profiles column
  -- means extending this column list too.
  revoke update on public.profiles from anon, authenticated;
  grant update (username, avatar_type, avatar_value, updated_at) on public.profiles to authenticated;
exception when others then
  raise notice 'profiles column-level grant adjustment skipped: %', sqlerrm;
end $$;

-- ---------------------------------------------------------------------------
-- 2. feedback_submissions triage: status + admin notes, managed only from
--    the admin panel (service role — no new RLS policies needed).
--    status: 'new' (default) | 'in_progress' | 'resolved' | 'wont_fix'
-- ---------------------------------------------------------------------------
alter table public.feedback_submissions
  add column if not exists status text not null default 'new',
  add column if not exists admin_notes text,
  add column if not exists reviewed_at timestamptz;

create index if not exists feedback_submissions_status_idx
  on public.feedback_submissions (status);

-- ---------------------------------------------------------------------------
-- 3. error_logs review flag, so the admin panel can separate "seen it"
--    from "new". Service-role-only writes; no RLS changes.
-- ---------------------------------------------------------------------------
alter table public.error_logs
  add column if not exists reviewed boolean not null default false;

create index if not exists error_logs_unreviewed_idx
  on public.error_logs (created_at desc)
  where reviewed = false;

-- ---------------------------------------------------------------------------
-- 4. Backfill: auto-approved beta applications (interim flow, #65) were
--    inserted with status 'pending' and auto_approved=true inside details,
--    so the admin list showed them as pending. Mark them approved. The
--    beta-apply route now sets status directly going forward; this catches
--    the rows created before this release. Idempotent (re-running matches
--    zero rows).
-- ---------------------------------------------------------------------------
update public.beta_applications
   set status = 'approved',
       reviewed_at = coalesce(reviewed_at, now())
 where status = 'pending'
   and (details ->> 'auto_approved') = 'true';

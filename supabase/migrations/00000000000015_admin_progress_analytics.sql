-- Migration 015: admin progress analytics.
--
-- Read-only aggregate VIEWS that power the admin dashboard's per-user /
-- per-language progress insight (Admin → Progress). They do the heavy GROUP BY
-- inside Postgres over the indexed `explanations` table (one row per answered
-- question) plus `progress` / `seen_questions` / `missed_questions`, so the
-- admin API never pulls the full answer history into Node.
--
-- SECURITY: every view is SECURITY INVOKER, so a normal (authenticated) role
-- selecting it still hits row-level security and only ever sees its own rows.
-- The admin API reads these through the SERVICE ROLE (which bypasses RLS), the
-- same trust boundary the rest of /api/admin/* already relies on. As defense in
-- depth we also REVOKE all access from anon/authenticated and GRANT select only
-- to service_role.
--
-- Conventions: no new tables, no gen_random_uuid, fully idempotent (safe to
-- re-run). Requires Postgres 15+ for `security_invoker` (Supabase default).

-- ---------------------------------------------------------------
-- Supporting indexes for cross-user rollups. The existing composite index on
-- explanations is (user_id, track_id, created_at desc) — user-first — which
-- doesn't help track/category aggregates that scan across all users.
-- ---------------------------------------------------------------
create index if not exists explanations_track_created_idx on explanations (track_id, created_at desc);
create index if not exists explanations_track_cat_idx on explanations (track_id, cat);

-- ---------------------------------------------------------------
-- 1) Per-track rollup (all users): volume, accuracy, learners, last activity.
-- ---------------------------------------------------------------
create or replace view admin_progress_track_stats
with (security_invoker = true) as
select
  e.track_id,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  round(100.0 * count(*) filter (where e.is_correct) / nullif(count(*), 0), 1) as accuracy_pct,
  count(distinct e.user_id)::bigint                           as learners,
  max(e.created_at)                                           as last_activity
from explanations e
group by e.track_id;

-- ---------------------------------------------------------------
-- 2) Per (track, category) rollup — surfaces weak categories app-wide.
-- ---------------------------------------------------------------
create or replace view admin_progress_category_stats
with (security_invoker = true) as
select
  e.track_id,
  e.cat,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  round(100.0 * count(*) filter (where e.is_correct) / nullif(count(*), 0), 1) as accuracy_pct,
  count(distinct e.user_id)::bigint                           as learners
from explanations e
group by e.track_id, e.cat;

-- ---------------------------------------------------------------
-- 3) Per-item rollup (keyed by prompt within a track) — the hotspot finder.
--    The API filters to items with enough answers and orders by accuracy asc
--    to float likely-broken / confusing items to the top.
-- ---------------------------------------------------------------
create or replace view admin_progress_item_stats
with (security_invoker = true) as
select
  e.track_id,
  e.cat,
  e.prompt,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  round(100.0 * count(*) filter (where e.is_correct) / nullif(count(*), 0), 1) as accuracy_pct,
  count(distinct e.user_id)::bigint                           as learners
from explanations e
group by e.track_id, e.cat, e.prompt;

-- ---------------------------------------------------------------
-- 4) Per-user activity rollup (one row per user) — powers the global tiles
--    (active learners, overall accuracy) and cheap active-window counts.
-- ---------------------------------------------------------------
create or replace view admin_progress_user_activity
with (security_invoker = true) as
select
  e.user_id,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  round(100.0 * count(*) filter (where e.is_correct) / nullif(count(*), 0), 1) as accuracy_pct,
  count(distinct e.track_id)::bigint                          as tracks_played,
  max(e.created_at)                                           as last_active
from explanations e
group by e.user_id;

-- ---------------------------------------------------------------
-- 5) Per (user, track) rollup — the drilldown core: progress state joined with
--    answer accuracy, coverage (distinct items seen) and the current missed pile.
--    Base is `progress` (upserted whenever someone plays a track).
-- ---------------------------------------------------------------
create or replace view admin_progress_user_track_stats
with (security_invoker = true) as
select
  p.user_id,
  p.track_id,
  p.xp,
  p.level,
  p.streak,
  p.best_combo,
  p.last_played,
  p.rounds_completed,
  p.skill_level,
  p.level_correct_count,
  p.level_total_count,
  p.updated_at,
  coalesce(e.answers, 0)::bigint                              as answers,
  coalesce(e.correct, 0)::bigint                              as correct,
  round(100.0 * coalesce(e.correct, 0) / nullif(e.answers, 0), 1) as accuracy_pct,
  e.last_activity,
  coalesce(s.items_seen, 0)::bigint                           as items_seen,
  coalesce(m.items_missed, 0)::bigint                         as items_missed
from progress p
left join (
  select user_id, track_id,
         count(*) as answers,
         count(*) filter (where is_correct) as correct,
         max(created_at) as last_activity
  from explanations
  group by user_id, track_id
) e on e.user_id = p.user_id and e.track_id = p.track_id
left join (
  select user_id, track_id, count(*) as items_seen
  from seen_questions
  group by user_id, track_id
) s on s.user_id = p.user_id and s.track_id = p.track_id
left join (
  select user_id, track_id, count(*) as items_missed
  from missed_questions
  group by user_id, track_id
) m on m.user_id = p.user_id and m.track_id = p.track_id;

-- ---------------------------------------------------------------
-- 6) Per (user, track, category) rollup — the per-user weak-spot breakdown
--    shown on the user drilldown. Filtered by user_id in the API (the predicate
--    pushes down through the GROUP BY onto the user-first index).
-- ---------------------------------------------------------------
create or replace view admin_progress_user_category_stats
with (security_invoker = true) as
select
  e.user_id,
  e.track_id,
  e.cat,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  round(100.0 * count(*) filter (where e.is_correct) / nullif(count(*), 0), 1) as accuracy_pct
from explanations e
group by e.user_id, e.track_id, e.cat;

-- ---------------------------------------------------------------
-- 7) Daily activity (global) — the overview trend line.
-- ---------------------------------------------------------------
create or replace view admin_progress_activity_daily
with (security_invoker = true) as
select
  (e.created_at at time zone 'UTC')::date                     as day,
  count(*)::bigint                                             as answers,
  count(*) filter (where e.is_correct)::bigint                as correct,
  count(distinct e.user_id)::bigint                           as active_users
from explanations e
group by 1;

-- ---------------------------------------------------------------
-- Lock the views down: never readable by anon/authenticated (defense in depth
-- on top of security_invoker); the admin API reads them via the service role.
-- ---------------------------------------------------------------
do $$
declare v text;
begin
  foreach v in array array[
    'admin_progress_track_stats',
    'admin_progress_category_stats',
    'admin_progress_item_stats',
    'admin_progress_user_activity',
    'admin_progress_user_track_stats',
    'admin_progress_user_category_stats',
    'admin_progress_activity_daily'
  ]
  loop
    execute format('revoke all on public.%I from anon, authenticated', v);
    execute format('grant select on public.%I to service_role', v);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Migration 012 — Explicit client grants (self-sufficiency repair)
--
-- DISCOVERED ON STAGING (2026-07-12, first #82 staging catch): applying
-- migrations 000–011 to a FRESH Supabase project left the `authenticated`
-- role without table privileges on the client-touched tables — avatar save
-- failed with "permission denied for table profiles". Production never hit
-- this because its tables were created interactively, where the platform's
-- default privileges covered them; a clean `db push` reproduction did not
-- get the same treatment.
--
-- Principle going forward: migrations must be SELF-SUFFICIENT — every
-- privilege the app relies on is granted explicitly here, never assumed
-- from platform defaults. Idempotent and safe to run on prod (grants that
-- already exist are no-ops).
--
-- Scope: ONLY what the client actually does (RLS policies from migration
-- 000 still constrain every row to auth.uid()):
--   * profiles: SELECT (loadProfile) + INSERT (upsert path) + column-level
--     UPDATE re-asserted exactly as migration 010 narrowed it. The 011
--     server-only columns (password_hint, sq_*) stay out of the grant.
--   * progress / seen_questions / missed_questions / explanations: full
--     CRUD for the signed-in player's own rows.
--   * Sequences: identity-column INSERTs need USAGE on their sequences.
--   * anon gets nothing here — its surface is the two security-definer
--     functions from migration 000 (already granted there).

grant usage on schema public to authenticated;

-- profiles: read own row, insert own row; UPDATE stays column-narrowed
-- (re-stating migration 010's grant is idempotent and makes this file the
-- complete story of profiles privileges).
grant select, insert on public.profiles to authenticated;
grant update (username, avatar_type, avatar_value, updated_at)
  on public.profiles to authenticated;

-- Player-owned gameplay tables.
grant select, insert, update, delete on public.progress to authenticated;
grant select, insert, update, delete on public.seen_questions to authenticated;
grant select, insert, update, delete on public.missed_questions to authenticated;
grant select, insert, update, delete on public.explanations to authenticated;

-- Identity PK sequences (bigint generated always as identity): INSERT needs
-- sequence USAGE. Blanket grant on current sequences keeps this idempotent
-- and future-proof for the tables above.
grant usage, select on all sequences in schema public to authenticated;

-- NOT granted (deliberate): feedback_submissions, beta_applications,
-- error_logs, security_questions, password_reset_tokens,
-- password_reset_requests — all service-role-only via server routes.

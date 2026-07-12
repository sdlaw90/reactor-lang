-- ---------------------------------------------------------------------------
-- Migration 013 — profiles upsert grant fix (second staging catch, 2026-07-12)
--
-- Migration 012's grants were still not enough: the client saves avatars and
-- usernames via supabase-js UPSERT, which compiles to
--   INSERT ... ON CONFLICT (user_id) DO UPDATE SET <every payload column>
-- and the payload necessarily includes user_id — so the UPDATE arm requires
-- UPDATE privilege on user_id, which migration 010's column list omitted.
-- Result: "permission denied for table profiles" on avatar/username saves
-- against a cleanly-migrated database.
--
-- Granting UPDATE on user_id is safe: RLS ("own profile write",
-- WITH CHECK auth.uid() = user_id) makes any value other than the caller's
-- own id impossible — the grant only permits the self-assignment no-op the
-- upsert performs.
--
-- (Prod note: 010's grant block swallows errors with a notice, so prod may
-- be running on the ORIGINAL broad UPDATE grant — meaning this bug was
-- latent there. This migration converges both environments on the same
-- explicit, narrow-but-sufficient grant.)

grant update (user_id, username, avatar_type, avatar_value, updated_at)
  on public.profiles to authenticated;

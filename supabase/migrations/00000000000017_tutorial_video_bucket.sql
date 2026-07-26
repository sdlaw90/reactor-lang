-- Storage bucket for pre-rendered tutorial videos (Ch0 co-host, 2026-07-25).
-- Public read (Ch0 is the public-facing chapter — meant to be shared with no
-- login, and the in-app /guide player streams from here too). NO client write
-- policies on purpose: videos are uploaded only by service-role tooling
-- (scripts/sync-tutorial-video.mjs and manual dev uploads), which bypasses RLS.
-- Path convention: "<lang>/<chapter>/<mode>.mp4" (e.g. en/ch0/co.mp4).
-- Mirrors migration 014 (tts-audio). Idempotent: a manually-created bucket of
-- the same id is left as-is.

insert into storage.buckets (id, name, public)
values ('tutorial-video', 'tutorial-video', true)
on conflict (id) do nothing;

drop policy if exists "Public read tutorial video" on storage.objects;
create policy "Public read tutorial video" on storage.objects
  for select using (bucket_id = 'tutorial-video');

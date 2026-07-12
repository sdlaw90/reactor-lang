-- Storage bucket for pre-generated TTS audio clips (pilot: esForEn, 2026-07-11).
-- Public read (clips are course content, same visibility as the questions
-- themselves). NO client write policies on purpose: clips are uploaded only
-- by scripts/generate-tts.mjs using the service role key, which bypasses RLS.
-- Path convention: "<track.id>/<audioKey>.mp3" plus one manifest.json per track.

insert into storage.buckets (id, name, public)
values ('tts-audio', 'tts-audio', true)
on conflict (id) do nothing;

drop policy if exists "Public read tts audio" on storage.objects;
create policy "Public read tts audio" on storage.objects
  for select using (bucket_id = 'tts-audio');

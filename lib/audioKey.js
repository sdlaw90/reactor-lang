// Audio clip identity (TTS pipeline, 2026-07-11).
//
// Clips are keyed by a hash of the SPOKEN TEXT, not by question id.
// Question ids ("vocab-3") are positional — inserting a question during a
// content pass would shift every id after it and silently mismatch audio.
// A content hash is immune to reordering, dedupes identical prompts for
// free, and makes regeneration idempotent (the script skips keys that
// already exist in the bucket).
//
// Used by BOTH scripts/generate-tts.mjs (Node) and the client playback
// component — keep this file dependency-free and side-effect-free.
//
// NOTE: keys hash the raw prompt text, not the rendered SSML. If SSML
// rendering logic changes (pauses, lang spans), keys stay the same and an
// idempotent run will NOT refresh clips — regenerate with --force.

// cyrb53 — tiny, fast, well-distributed 53-bit string hash (public domain).
// Not cryptographic; collision odds across a few thousand short prompts
// are negligible, and a collision would be caught by the script's
// duplicate-text check anyway.
export function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// Normalize before hashing so cosmetic whitespace edits don't orphan clips.
export function normalizeSpokenText(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

// The canonical clip key for a piece of spoken text: 11-ish base36 chars.
export function audioKey(text) {
  return cyrb53(normalizeSpokenText(text)).toString(36);
}

// Bucket path convention: <track.id>/<key>.mp3 inside the "tts-audio" bucket.
export function audioPath(trackId, text) {
  return `${trackId}/${audioKey(text)}.mp3`;
}

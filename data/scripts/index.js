import { KANA_JA } from "./kanaJa";

// Registry for #62 writing-system definitions. One data file per script,
// all consumed by the single generic /script/[trackId] page — adding a new
// script (hangul next, then Cyrillic, then the Mandarin curated set) is a
// data file + a registry line, zero page code.
//
// #62 is NEVER a blocker (decision 2026-07-11): tracks without a script here
// simply don't show the third mode toggle, and regular content never gates
// on script practice.

const SCRIPTS = [KANA_JA];

export function scriptForTrack(trackId) {
  return SCRIPTS.find((s) => s.forTracks.includes(trackId)) || null;
}

// Stable per-glyph practice id, namespaced so it can ride the existing
// seen/missed tables alongside bank question ids without collision
// (bank ids look like "vocab-3"; these look like "script-hiragana-h-k-1").
export function glyphPracticeId(systemId, groupId, glyphIndex) {
  return `script-${systemId}-${groupId}-${glyphIndex}`;
}

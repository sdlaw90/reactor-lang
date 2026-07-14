"use client";

// Question-audio speaker button (TTS playback pass, 2026-07-12).
//
// Renders a small play/stop button next to a question prompt IF a
// pre-generated clip exists for the exact displayed text. Clip existence
// AND the clip's filename come from the track's manifest.json in the
// tts-audio bucket (fetched once per track per session, cached
// module-level) — filenames are never constructed client-side, so the
// plain and voice-keyed bucket schemas both resolve.
//
// Keying off the DISPLAYED text is deliberate: promptEn substitutions
// (cross-native viewers) and fono extraBank prompts were never synthesized,
// so their manifest lookup fails and the button simply doesn't render —
// no special-casing, and no 404 probing per question.
//
// Rules honored here:
// - Never autoplays; playback is always a deliberate tap.
// - One clip plays at a time app-wide; changing questions stops playback.
// - Playback touches NO progress aggregates (standing rule: audio stays
//   out of all aggregates until the listening module exists).

import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { supabase } from "./supabaseClient";
import { audioKey } from "./audioKey";

const manifestCache = new Map(); // trackId -> Promise<Map<clipKey, filename> | null>

function loadManifestClips(trackId) {
  if (!manifestCache.has(trackId)) {
    const { data } = supabase.storage.from("tts-audio").getPublicUrl(`${trackId}/manifest.json`);
    const promise = fetch(data.publicUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m || !m.clips) return null;
        // Filenames come from the manifest's per-clip `f` field — the client
        // never constructs them, so the plain ({key}.mp3) and voice-keyed
        // ({key}-{voice}.mp3) schemas both work. Older manifests predate `f`;
        // those tracks are all plain-keyed, hence the fallback.
        return new Map(Object.entries(m.clips).map(([k, c]) => [k, (c && c.f) || `${k}.mp3`]));
      })
      .catch(() => null); // no manifest = track has no audio yet; cache the miss
    manifestCache.set(trackId, promise);
  }
  return manifestCache.get(trackId);
}

// One shared element so two clips can never overlap.
let currentAudio = null;
let currentStopCallback = null;

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (currentStopCallback) {
    const cb = currentStopCallback;
    currentStopCallback = null;
    cb();
  }
}

// align="center": renders an invisible twin spacer (flex order -1) so the
// prompt stays truly centered (Lessons — centered column). align="left":
// no spacer, the button just follows the text (Quick Quiz — the card is
// left-aligned by design, so centering compensation would be wrong).
export default function AudioButton({ trackId, text, enabled = true, size = 16, align = "center" }) {
  const [clipFile, setClipFile] = useState(null); // resolved filename, or null = unavailable
  const [playing, setPlaying] = useState(false);
  const key = audioKey(text || "");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Resolve availability whenever the question (text) changes; also stop any
  // clip left over from the previous question.
  useEffect(() => {
    setClipFile(null);
    setPlaying(false);
    stopCurrent();
    if (!enabled || !trackId || !text) return;
    let cancelled = false;
    loadManifestClips(trackId).then((clips) => {
      if (!cancelled && mounted.current) setClipFile((clips && clips.get(key)) || null);
    });
    return () => {
      cancelled = true;
    };
  }, [trackId, text, key, enabled]);

  if (!enabled || !clipFile) return null;

  const toggle = () => {
    if (playing) {
      stopCurrent();
      return;
    }
    stopCurrent();
    const { data } = supabase.storage.from("tts-audio").getPublicUrl(`${trackId}/${clipFile}`);
    const audio = new Audio(data.publicUrl);
    currentAudio = audio;
    currentStopCallback = () => {
      if (mounted.current) setPlaying(false);
    };
    audio.onended = stopCurrent;
    audio.onerror = stopCurrent;
    audio
      .play()
      .then(() => {
        if (mounted.current) setPlaying(true);
      })
      .catch(stopCurrent); // e.g. browser blocks before first interaction
  };

  const btnStyle = {
    background: "none",
    border: "1px solid #3A3452",
    borderRadius: 8,
    color: playing ? "#5EE0A0" : "#9B93B8",
    cursor: "pointer",
    padding: "4px 6px",
    lineHeight: 0,
    flexShrink: 0,
  };

  // The invisible twin balances the real button on the other side of the
  // prompt (flex order -1), so the prompt text stays truly centered in the
  // card — otherwise the subtitle below (which centers on full width) would
  // sit visibly off-axis from the prompt. Rendered only when the real
  // button is, so audio-less questions are untouched.
  return (
    <>
      {align === "center" && (
        <span aria-hidden="true" style={{ ...btnStyle, visibility: "hidden", order: -1 }}>
          <Volume2 size={size} />
        </span>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Stop question audio" : "Play question audio"}
        title={playing ? "Stop audio" : "Hear this question"}
        style={btnStyle}
      >
        {playing ? <Square size={size} /> : <Volume2 size={size} />}
      </button>
    </>
  );
}

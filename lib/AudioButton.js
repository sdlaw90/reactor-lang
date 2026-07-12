"use client";

// Question-audio speaker button (TTS playback pass, 2026-07-12).
//
// Renders a small play/stop button next to a question prompt IF a
// pre-generated clip exists for the exact displayed text. Clip existence
// comes from the track's manifest.json in the tts-audio bucket (fetched
// once per track per session, cached module-level).
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

const manifestCache = new Map(); // trackId -> Promise<Set<clipKey> | null>

function loadManifestKeys(trackId) {
  if (!manifestCache.has(trackId)) {
    const { data } = supabase.storage.from("tts-audio").getPublicUrl(`${trackId}/manifest.json`);
    const promise = fetch(data.publicUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => (m && m.clips ? new Set(Object.keys(m.clips)) : null))
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

export default function AudioButton({ trackId, text, enabled = true, size = 16 }) {
  const [available, setAvailable] = useState(false);
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
    setAvailable(false);
    setPlaying(false);
    stopCurrent();
    if (!enabled || !trackId || !text) return;
    let cancelled = false;
    loadManifestKeys(trackId).then((keys) => {
      if (!cancelled && mounted.current) setAvailable(!!keys && keys.has(key));
    });
    return () => {
      cancelled = true;
    };
  }, [trackId, text, key, enabled]);

  if (!enabled || !available) return null;

  const toggle = () => {
    if (playing) {
      stopCurrent();
      return;
    }
    stopCurrent();
    const { data } = supabase.storage.from("tts-audio").getPublicUrl(`${trackId}/${key}.mp3`);
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

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Stop question audio" : "Play question audio"}
      title={playing ? "Stop audio" : "Hear this question"}
      style={{
        background: "none",
        border: "1px solid #3A3452",
        borderRadius: 8,
        color: playing ? "#5EE0A0" : "#9B93B8",
        cursor: "pointer",
        padding: "4px 6px",
        lineHeight: 0,
        flexShrink: 0,
      }}
    >
      {playing ? <Square size={size} /> : <Volume2 size={size} />}
    </button>
  );
}

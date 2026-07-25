"use client";

import { useState, useEffect } from "react";

// Bootstrap UI language for PRE-LOGIN screens (auth, forgot/reset password,
// beta-apply, onboarding pickers) — the screens that render before a user has
// told us their native language, so `profile.native_lang` doesn't exist yet.
//
// Resolution order: explicit stored choice (the language switcher) → browser
// locale (navigator.language) → English. Once onboarding sets native_lang,
// that becomes the source of truth for the rest of the app; this only governs
// the pre-native_lang surfaces.
//
// Supported set is intentionally small (the UI languages we actually ship);
// extend as new source languages land. Everything else falls back to English.

export const SUPPORTED_UI_LANGS = ["en", "es"];
const STORAGE_KEY = "sl.uiLang";
const CHANGE_EVENT = "sl-uilang-change";

// Map a browser locale tag (e.g. "es-MX", "en-GB") to a supported base lang.
export function detectUiLang() {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages || [])];
  for (const c of candidates) {
    if (!c) continue;
    const base = String(c).toLowerCase().split("-")[0];
    if (SUPPORTED_UI_LANGS.includes(base)) return base;
  }
  return "en";
}

export function getStoredUiLang() {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_UI_LANGS.includes(v) ? v : null;
  } catch {
    return null;
  }
}

// The resolved bootstrap language: user override, else browser, else English.
export function resolveUiLang() {
  return getStoredUiLang() || detectUiLang();
}

// Persist an explicit choice from the language switcher and notify listeners
// so every mounted pre-login screen re-renders in the new language at once.
export function setStoredUiLang(lang) {
  if (!SUPPORTED_UI_LANGS.includes(lang) || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable (private mode etc.) — fall back to in-session only */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: lang }));
}

// React hook. SSR-safe: renders "en" on the server and the first client paint
// (so no hydration mismatch), then resolves the real language after mount and
// stays in sync with the switcher via the change event.
export function useUiLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    setLang(resolveUiLang());
    const onChange = (e) => setLang(e?.detail || resolveUiLang());
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);
  return [lang, setStoredUiLang];
}

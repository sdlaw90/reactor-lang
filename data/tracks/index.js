import esForEn from "./esForEn";
import esSpainForEn from "./esSpainForEn";
import enUsForEs from "./enUsForEs";
import enGbForEs from "./enGbForEs";
import itForEn from "./itForEn";
import frForEn from "./frForEn";
import frCaForEn from "./frCaForEn";
import ptBrForEn from "./ptBrForEn";
import ptPtForEn from "./ptPtForEn";
import deForEn from "./deForEn";
import ruForEn from "./ruForEn";
import jaForEn from "./jaForEn";
import zhForEn from "./zhForEn";
import koForEn from "./koForEn";
import enForIt from "./enForIt";

export const TRACKS = {
  [esForEn.id]: esForEn,
  [esSpainForEn.id]: esSpainForEn,
  [enUsForEs.id]: enUsForEs,
  [enGbForEs.id]: enGbForEs,
  [itForEn.id]: itForEn,
  [frForEn.id]: frForEn,
  [frCaForEn.id]: frCaForEn,
  [ptBrForEn.id]: ptBrForEn,
  [ptPtForEn.id]: ptPtForEn,
  [deForEn.id]: deForEn,
  [ruForEn.id]: ruForEn,
  [jaForEn.id]: jaForEn,
  [zhForEn.id]: zhForEn,
  [koForEn.id]: koForEn,
  [enForIt.id]: enForIt,
};

const NATIVE_LANG_LABELS = {
  en: "English",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
};

export function getTrack(trackId) {
  return TRACKS[trackId] || null;
}

export function listTracks() {
  return Object.values(TRACKS);
}

// Unique native languages across all tracks, e.g. [{ code: 'en', label: 'English' }, ...]
export function listNativeLanguages() {
  const codes = Array.from(new Set(listTracks().map((t) => t.nativeLang)));
  return codes.map((code) => ({ code, label: NATIVE_LANG_LABELS[code] || code }));
}

// #40/v3.1 — "one track, many sources." Source languages whose localization
// layer is released (or being released on `dev`). A reusable immersion track
// (any non-English target) is offered to a native speaker only when their
// source language is in this set — so unready sources never see a half-localized
// experience. This grows by ONE per v3.x minor, matching the release roadmap:
// v3.0 English · v3.1 Spanish · v3.2 Portuguese · … (see
// claude/squirrelingo_v3.x_to_v4.0.0_deployment_plan.md).
const RELEASED_SOURCE_LANGS = new Set(["en", "es"]);

// Tracks available to learn, given the person's native language.
//
// Two kinds of track:
//  • REUSABLE immersion tracks (target ≠ English) teach a non-English language
//    with target-language prompts + a localizable native layer, so ONE track
//    serves every source. Offered to any native whose source language is
//    released (RELEASED_SOURCE_LANGS) and whose base language differs from the
//    target — you don't learn your own language.
//  • SOURCE-SPECIFIC tracks (`sourceSpecific: true`, the bespoke English-teaching
//    tracks enForIt/enUsForEs/enGbForEs) carry content authored for one native
//    audience and stay locked to that `nativeLang`.
//
// English speakers additionally get English (UK) as a genuinely comparative
// (British vs. American) track, unless they're already in the UK.
export function tracksForNativeLang(nativeLang, nativeCountry) {
  const offered = listTracks().filter((t) => {
    if (t.sourceSpecific) return t.nativeLang === nativeLang;
    return RELEASED_SOURCE_LANGS.has(nativeLang) && t.targetLang !== nativeLang;
  });
  if (nativeLang === "en" && nativeCountry !== "GB") {
    const ukTrack = getTrack("en-gb-for-es");
    if (ukTrack && !offered.includes(ukTrack)) offered.push(ukTrack);
  }
  return offered;
}

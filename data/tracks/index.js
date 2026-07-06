import esForEn from "./esForEn";
import esSpainForEn from "./esSpainForEn";
import enUsForEs from "./enUsForEs";
import enGbForEs from "./enGbForEs";

export const TRACKS = {
  [esForEn.id]: esForEn,
  [esSpainForEn.id]: esSpainForEn,
  [enUsForEs.id]: enUsForEs,
  [enGbForEs.id]: enGbForEs,
};

const NATIVE_LANG_LABELS = {
  en: "English",
  es: "Español",
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

// Tracks available to learn, given the person's native language. For English
// speakers specifically, also offers English (UK) as a learnable track — its
// content is genuinely comparative (British vs. American), unlike the other
// English track's Spanish-learner-specific false-friend content, which
// wouldn't make sense for someone who's already a native English speaker.
export function tracksForNativeLang(nativeLang, nativeCountry) {
  const primary = listTracks().filter((t) => t.nativeLang === nativeLang);
  if (nativeLang === "en" && nativeCountry !== "GB") {
    const ukTrack = getTrack("en-gb-for-es");
    if (ukTrack && !primary.includes(ukTrack)) {
      return [...primary, ukTrack];
    }
  }
  return primary;
}

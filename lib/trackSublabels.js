// #72: native-language track sublabels.
//
// A track's `sublabel` ("For English speakers · Latin American Spanish") describes who
// the track is FOR, so it has to read in the viewer's own native language. But the
// sublabel lives on the track object, and under the "one track, many sources" model a
// single track is shared by every source language — es-latam-for-en is studied by
// English AND Portuguese natives from the same file. Adding per-source fields to the
// track objects would mean editing megabyte-scale data files for every new source.
//
// So the localized copy lives here instead, keyed by track id, exactly like
// lib/languageNames.js. A missing entry falls back to the track's own `sublabel`, so
// this is additive and safe: nothing breaks if a track is absent.
//
// Tracks authored FOR a specific source (en-us-for-es, en-us-for-pt, en-for-it) already
// carry a sublabel in that source's language and are deliberately not listed here.
//
// AI-authored → #41 native review (es reviewed alongside the v3.1 packet; pt pending).

const SUBLABELS = {
  "es-latam-for-en": {
    es: "Para hispanohablantes · Español latinoamericano",
    pt: "Para falantes de português · Espanhol latino-americano",
    fr: "Pour les francophones · Espagnol d'Amérique latine",
  },
  "es-spain-for-en": {
    es: "Para hispanohablantes · Español de España · vosotros, distinción",
    pt: "Para falantes de português · Espanhol da Espanha · vosotros, distinção",
    fr: "Pour les francophones · Espagnol d'Espagne · vosotros, distinction",
  },
  "it-for-en": {
    es: "Para hispanohablantes · Italiano",
    pt: "Para falantes de português · Italiano",
    fr: "Pour les francophones · Italien",
  },
  "fr-for-en": {
    es: "Para hispanohablantes · Francés (Francia)",
    pt: "Para falantes de português · Francês (França)",
  },
  "fr-ca-for-en": {
    es: "Para hispanohablantes · Francés canadiense",
    pt: "Para falantes de português · Francês canadense",
  },
  "pt-br-for-en": {
    es: "Para hispanohablantes · Portugués brasileño",
    fr: "Pour les francophones · Portugais brésilien",
  },
  "pt-pt-for-en": {
    es: "Para hispanohablantes · Portugués europeo",
    fr: "Pour les francophones · Portugais européen",
  },
  "de-for-en": {
    es: "Para hispanohablantes · Alemán",
    pt: "Para falantes de português · Alemão",
    fr: "Pour les francophones · Allemand",
  },
  "ru-for-en": {
    es: "Para hispanohablantes · Ruso",
    pt: "Para falantes de português · Russo",
    fr: "Pour les francophones · Russe",
  },
  "ja-for-en": {
    es: "Para hispanohablantes · Japonés",
    pt: "Para falantes de português · Japonês",
    fr: "Pour les francophones · Japonais",
  },
  "zh-for-en": {
    es: "Para hispanohablantes · Chino mandarín",
    pt: "Para falantes de português · Chinês mandarim",
    fr: "Pour les francophones · Chinois mandarin",
  },
  "ko-for-en": {
    es: "Para hispanohablantes · Coreano",
    pt: "Para falantes de português · Coreano",
    fr: "Pour les francophones · Coréen",
  },
};

// The sublabel to show under a track's title.
//
// `useAltPrompt` is the existing English-native-studying-English case (the track was
// authored for a non-English audience, so it carries an English-native rewrite in
// `sublabelEn`). That branch is checked first and is unchanged.
export function trackSublabel(track, viewerNativeLang, useAltPrompt) {
  if (useAltPrompt && track.sublabelEn) return track.sublabelEn;
  const localized = SUBLABELS[track.id];
  if (localized && viewerNativeLang && localized[viewerNativeLang]) {
    return localized[viewerNativeLang];
  }
  return track.sublabel;
}

export default SUBLABELS;

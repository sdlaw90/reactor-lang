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
// Tracks authored FOR a specific source (en-us-for-es, en-us-for-pt, en-us-for-it,
// en-gb-for-it) already carry a sublabel in that source's language and are deliberately
// not listed here.
//
// A track is also deliberately missing the column for its own target language's natives:
// `it-for-en` has no `it`, `fr-for-en` no `fr`, `pt-br-for-en` no `pt`. You don't learn
// your own language, so that entry can never be read. Those are not gaps.
//
// AI-authored → #41 native review (es reviewed alongside the v3.1 packet; pt pending).

const SUBLABELS = {
  "es-latam-for-en": {
    es: "Para hispanohablantes · Español latinoamericano",
    pt: "Para falantes de português · Espanhol latino-americano",
    fr: "Pour les francophones · Espagnol d'Amérique latine",
    it: "Per chi parla italiano · Spagnolo latinoamericano",
  },
  "es-spain-for-en": {
    es: "Para hispanohablantes · Español de España · vosotros, distinción",
    pt: "Para falantes de português · Espanhol da Espanha · vosotros, distinção",
    fr: "Pour les francophones · Espagnol d'Espagne · vosotros, distinction",
    it: "Per chi parla italiano · Spagnolo di Spagna · vosotros, distinzione",
  },
  "it-for-en": {
    es: "Para hispanohablantes · Italiano",
    pt: "Para falantes de português · Italiano",
    fr: "Pour les francophones · Italien",
  },
  "fr-for-en": {
    es: "Para hispanohablantes · Francés (Francia)",
    pt: "Para falantes de português · Francês (França)",
    it: "Per chi parla italiano · Francese (Francia)",
  },
  "fr-ca-for-en": {
    es: "Para hispanohablantes · Francés canadiense",
    pt: "Para falantes de português · Francês canadense",
    it: "Per chi parla italiano · Francese canadese",
  },
  "pt-br-for-en": {
    es: "Para hispanohablantes · Portugués brasileño",
    fr: "Pour les francophones · Portugais brésilien",
    it: "Per chi parla italiano · Portoghese brasiliano",
  },
  "pt-pt-for-en": {
    es: "Para hispanohablantes · Portugués europeo",
    fr: "Pour les francophones · Portugais européen",
    it: "Per chi parla italiano · Portoghese europeo",
  },
  "de-for-en": {
    es: "Para hispanohablantes · Alemán",
    pt: "Para falantes de português · Alemão",
    fr: "Pour les francophones · Allemand",
    it: "Per chi parla italiano · Tedesco",
  },
  "ru-for-en": {
    es: "Para hispanohablantes · Ruso",
    pt: "Para falantes de português · Russo",
    fr: "Pour les francophones · Russe",
    it: "Per chi parla italiano · Russo",
  },
  "ja-for-en": {
    es: "Para hispanohablantes · Japonés",
    pt: "Para falantes de português · Japonês",
    fr: "Pour les francophones · Japonais",
    it: "Per chi parla italiano · Giapponese",
  },
  "zh-for-en": {
    es: "Para hispanohablantes · Chino mandarín",
    pt: "Para falantes de português · Chinês mandarim",
    fr: "Pour les francophones · Chinois mandarin",
    it: "Per chi parla italiano · Cinese mandarino",
  },
  "ko-for-en": {
    es: "Para hispanohablantes · Coreano",
    pt: "Para falantes de português · Coreano",
    fr: "Pour les francophones · Coréen",
    it: "Per chi parla italiano · Coreano",
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

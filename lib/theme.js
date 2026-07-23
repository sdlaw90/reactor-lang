// Friendlier, warmer base palette than the original neon-HUD look, plus a
// distinct animated gradient "mood" per track. Backgrounds are CSS gradients
// (not photos) — reliable, fast, no copyright/hotlink concerns, and they
// animate smoothly with pure CSS.

export const BASE = {
  bg: "#171423", // warm dark plum instead of near-black
  panel: "#221E33",
  panelBorder: "#3A3452",
  text: "#F3F0FA",
  textDim: "#B4ABC9",
  textFaint: "#9B93B8",
  good: "#5EE0A0",
  bad: "#FF7B8A",
  accent: "#FF8FB1", // softer pink instead of hot magenta
};

// Canonical secondary-text ramp. Collapse ad-hoc grays to these two.
// NOTE: #7C7395 was removed app-wide (WCAG-AA failure, #63) in favor of `faint`.
export const GRAY = {
  dim: "#B4ABC9", // default secondary text
  faint: "#9B93B8", // quietest readable text — AA-safe on the dark surfaces
};

// Radius scale — prefer these over ad-hoc values (8/10/12/16/pill).
export const RADIUS = { sm: 8, md: 10, lg: 12, xl: 16, pill: 999 };

// Shared surface tokens for cards/inputs so pages stop hardcoding them.
export const SURFACE = {
  card: "#221E33",
  cardBorder: "#3A3452",
  inset: "#171423",
  optionDefault: "#1D212B", // quiz option — resting
  optionCorrect: "#1E4A32", // quiz option — correct
  optionWrong: "#4A1E24", // quiz option — wrong
};

// Each track can reference one of these by id (see data/tracks/*.js "theme" field).
// Colors chosen as warm, inviting gradients evocative of each region without
// using literal flags/stereotyped imagery.
export const TRACK_THEMES = {
  "latam-sun": {
    label: "Latin America",
    gradient: "linear-gradient(120deg, #FF6B6B, #FFB84D, #4ADE80, #3DDBFF)",
  },
  "spain-warm": {
    label: "Spain",
    gradient: "linear-gradient(120deg, #FF5C5C, #FFB020, #E8483A, #FFD866)",
  },
  "english-us": {
    label: "United States",
    gradient: "linear-gradient(120deg, #3DDBFF, #6C7BFF, #5EE0A0, #B98EFF)",
  },
  "english-uk": {
    label: "United Kingdom",
    gradient: "linear-gradient(120deg, #2E4372, #7A1F3D, #B8894A, #E8D9B5)",
  },
  "italy-fresca": {
    label: "Italy",
    gradient: "linear-gradient(120deg, #4ADE80, #F3F0FA, #E8483A, #FFD866)",
  },
  "france-bleu": {
    label: "France",
    gradient: "linear-gradient(120deg, #2E4372, #F3F0FA, #C8393B, #E8D9B5)",
  },
  "canada-maple": {
    label: "Canada",
    gradient: "linear-gradient(120deg, #D80621, #F3F0FA, #A8C9E8, #E8D9B5)",
  },
  "brazil-verde": {
    label: "Brazil",
    gradient: "linear-gradient(120deg, #009739, #FEDD00, #002776, #4ADE80)",
  },
  "portugal-verde": {
    label: "Portugal",
    gradient: "linear-gradient(120deg, #046A38, #DA291C, #FFCC00, #F3F0FA)",
  },
  "germany-stahl": {
    label: "Germany",
    gradient: "linear-gradient(120deg, #171423, #C8393B, #FFCE00, #3A3452)",
  },
  "russia-frost": {
    label: "Russia",
    gradient: "linear-gradient(120deg, #FFFFFF, #0039A6, #D52B1E, #A8C9E8)",
  },
  "japan-sakura": {
    label: "Japan",
    gradient: "linear-gradient(120deg, #FFFFFF, #FFB7C5, #BC002D, #F3F0FA)",
  },
  "china-lantern": {
    label: "China",
    gradient: "linear-gradient(120deg, #DE2910, #FFDE00, #B71C1C, #FFB84D)",
  },
  "korea-hanbok": {
    label: "Korea",
    gradient: "linear-gradient(120deg, #FFFFFF, #CD2E3A, #0047A0, #F3F0FA)",
  },
};

// Home screen background: all the mood colors woven into one big gradient
// that slowly animates, so it feels like it's gently cycling through every
// language rather than sitting on any single one.
export const HOME_GRADIENT =
  "linear-gradient(120deg, #FF6B6B, #FFB84D, #4ADE80, #3DDBFF, #6C7BFF, #B98EFF, #FF8FB1, #FFD866)";

export function animatedBackgroundStyle(gradient) {
  return {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background: gradient,
    backgroundSize: "400% 400%",
    animation: "gradientShift 22s ease infinite",
    opacity: 0.35,
  };
}

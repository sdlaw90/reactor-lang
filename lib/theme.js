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
  textFaint: "#7C7395",
  good: "#5EE0A0",
  bad: "#FF7B8A",
  accent: "#FF8FB1", // softer pink instead of hot magenta
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

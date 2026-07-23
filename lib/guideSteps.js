// The intro tour content — a short, sequential "how to get around" walkthrough,
// deliberately lighter than the full Help reference (/help). Single source of
// truth for both the standalone page (/guide) and the first-run overlay
// (lib/GuideOverlay.js). Keep each body to a sentence or two: this is the
// 60-second tour, not the manual.
//
// Each step: { emoji, demo, title, body }.
//   emoji – fallback badge shown when a step has no demo
//   demo  – id of the animated CSS demo in lib/GuideDemo.js (+ .gd-* CSS in
//           styles/globals.css); omit for a text-only step
// Order is the tour order.

export const GUIDE_STEPS = [
  {
    emoji: "🐿️",
    demo: "welcome",
    title: "Welcome to SquirreLingo!",
    body:
      "Language practice built for short, low-pressure bursts — answer a handful of questions, see how you did, stop whenever you like. Here's a quick 60-second tour of how to get around.",
  },
  {
    emoji: "🌍",
    demo: "pick",
    title: "Pick a language",
    body:
      "Tap any language bubble on the home screen to start practicing it. Each bubble shows your current level and progress, and every language is tracked separately — so you can dabble in a few without losing your place in any.",
  },
  {
    emoji: "🎯",
    demo: "level",
    title: "Find your level",
    body:
      "New to a language? Take its short, untimed placement quiz from the start screen — it samples every difficulty tier and sets you at the right one. Not sure? Just start playing; you'll be offered a level-up once you're answering well.",
  },
  {
    emoji: "⚡",
    demo: "modes",
    title: "Two ways to practice",
    body:
      "Quick Quiz is fast and game-style — a timer, a combo counter, and streaks. Lessons is calmer — no timer, one topic at a time, with the explanation right after each answer. Switch between them anytime; both build the same progress.",
  },
  {
    emoji: "▶️",
    demo: "play",
    title: "Play a round",
    body:
      "Each round mixes a few question types — a colored tag shows which is which. There's no penalty for a wrong answer, and a combo (⚡) builds as you chain correct ones. Where audio exists, tap the speaker to hear the question read aloud.",
  },
  {
    emoji: "💡",
    demo: "heads",
    title: "Wrong answers teach you",
    body:
      "Miss one and you get a quick “Heads up” — the rule, plus which form you actually picked — so a wrong tap becomes a mini-lesson instead of just a red mark. Turn on Review mode in Settings to pause on each explanation.",
  },
  {
    emoji: "🗂️",
    demo: "theme",
    title: "Focus by theme, or drill verbs",
    body:
      "Use the Theme filter to practice one topic — travel, food, work — across every category at once. Languages that conjugate also have the Grammar Gym: a standalone verb trainer that keeps its own progress and never touches your level or streak.",
  },
  {
    emoji: "✍️",
    demo: "script",
    title: "Learn a new script",
    body:
      "Languages with their own writing system — Japanese, Korean, Russian, Mandarin — have an Alphabet mode sitting right next to Quick Quiz and Lessons: reference charts plus no-pressure practice, with letters glowing green as you nail them.",
  },
  {
    emoji: "📊",
    demo: "progress",
    title: "Track your progress",
    body:
      "The Dashboard (in the menu behind your profile picture) shows your XP, streak, and rounds across every language, and each track has a mastery tracker by category. Your streak never breaks on a missed day — milestones just add bonus XP. Tap the ? on the home screen for full Help anytime, and you can reopen this tour from the menu. Now — pick your next quick win!",
  },
];

# 2026-07-23 — Intro tour / onboarding walkthrough

## User-facing
- New: a quick visual tour of how the app works. New accounts get a short,
  swipeable walkthrough right after setup — nine steps, each with a little
  animated example: picking a language, finding your level with the placement
  quiz, Quick Quiz vs. Lessons, playing a round, how a wrong answer gives you a
  "Heads up", practicing by theme, the Alphabet mode, and tracking your
  progress. It shows only once and is fully skippable, and you can reopen it
  anytime from the menu under "How to use SquirreLingo" — the full Help page is
  still there whenever you want the details.

## Internal
- 9-step swipeable card carousel with a per-step animated **CSS/SVG** demo (no
  images/GIFs — tiny, offline, `prefers-reduced-motion`-safe). Demos reuse the
  real app pieces: `TrackIcon` SVGs, the `ModeToggle` fill-toggle, the
  play-screen `Zap` combo + Round/Theme `catChip`s, a placement ladder, an
  alphabet-glow, and a home-bubble XP-fill/level-up.
- **New files:** `lib/guideVersion.js` (`GUIDE_VERSION` seen-gate),
  `lib/guideSteps.js` (step content — single source of truth), `lib/GuideTour.js`
  (carousel: counter + clickable dots, Back/Next, arrow-key nav, Skip),
  `lib/GuideDemo.js` (the demos), `lib/GuideOverlay.js` (first-run auto-show,
  gated on `user_metadata.guide_seen_version` like `WelcomePopup`),
  `app/guide/page.js` (drawer-reachable standalone page).
- **Modified:** `app/layout.js` swaps the `WelcomePopup` mount → `GuideOverlay`
  so new users get one first-run experience, not two stacked overlays
  (`WelcomePopup.js` left on disk, unmounted, trivially revertible);
  `lib/NavDrawer.js` adds a "How to use SquirreLingo" item (Compass icon) →
  `/guide`; `styles/globals.css` gains a self-contained `.gd-*` demo block
  (keyframes + reduced-motion end-states).
- No new dependencies (`Compass` already in `lucide-react`; `guide_seen_version`
  is schemaless Supabase `user_metadata` → no migration, no lockfile change).
  esbuild JSX-parse clean on all JS; `globals.css` esbuild-clean. Existing beta
  users also see the tour once (fresh `guide_seen_version`).
- No version bump — folds under the `2.33.0-beta.15` label per the v3.0.0
  roll-up plan.

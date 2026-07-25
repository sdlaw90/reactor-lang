# 2026-07-25 — "Watch the video tour" on /guide + tutorial-video hosting

## User-facing
- New: **Watch the video tour.** The "How to use SquirreLingo" page (menu →
  "How to use SquirreLingo") now has a short 30-second animated video that walks
  you through the app, sitting just below the step-by-step tour. It's optional —
  click to play, close anytime — and stars the same friendly co-host squirrels.
  The swipeable walkthrough and the full Help page are unchanged; the video is
  the quick middle option between them.

## Internal
- **New files:** `lib/GuideVideoCard.js` — the "Watch the video tour" card +
  inline player on `/guide`. Builds the clip URL from `NEXT_PUBLIC_SUPABASE_URL`
  (no hardcoded host), bucket layout `lang/chapter/mode` → Chapter 0 co-host =
  `en/ch0/co.mp4`. English is served as the fallback until other locales are
  localized. The 3-mode narrator toggle (Puck/Aoede solo) is intentionally
  **hidden** until those tracks lock — drop them in by swapping `co` in the path.
- **Modified:** `app/guide/page.js` renders `<GuideVideoCard/>` **below** the
  existing `<GuideTour/>` carousel (both stay).
- **Hosting-as-code (tutorial videos, mirrors the tts-audio stack):**
  - `supabase/migrations/00000000000017_tutorial_video_bucket.sql` — public
    `tutorial-video` bucket + public-read policy; twin of migration 014,
    idempotent (`on conflict do nothing`, `drop policy if exists`).
  - `scripts/sync-tutorial-video.mjs` — dev→prod bucket mirror, twin of
    `sync-tts.mjs`: plain Storage REST, copy-only (never deletes from prod).
    Differs in that it **always upserts** every object (video paths are semantic
    like `en/ch0/co.mp4`, not content-hashed) and walks the tree recursively.
  - `.github/workflows/supabase-migrations.yml` — new `sync-tutorial-video` job
    (main only, `needs: migrate-production`, `environment: Production`);
    `smoke-check` now also `needs` it, so a release gates on the video mirror.
- Ch0 co-host master (`ch0_cohost_ANIM3.mp4`, 1080×1920 / 29.9s) uploaded to the
  prod `tutorial-video` bucket at `en/ch0/co.mp4` this release (manual); future
  videos mirror automatically via the sync job. Its public URL doubles as the
  shareable link for out-of-app promotion (Facebook group, etc.).
- **Decision:** the earlier idea to embed the tour on `/beta-apply` was **dropped**
  — a public share link that lands on a signup form reads as pushy. Public
  distribution is the raw bucket URL instead; in-app lives on `/guide`.
- No new dependencies, no lockfile change. Verified: esbuild JSX-parse clean on
  `GuideVideoCard.js` + `app/guide/page.js`; `node --check` clean on
  `sync-tutorial-video.mjs`; workflow YAML parses with the new job graph.
- No version bump here — folds under the **3.1.1** release per the ledger/roll-up
  plan (`lib/version.js` stays owned by the ledger chat).

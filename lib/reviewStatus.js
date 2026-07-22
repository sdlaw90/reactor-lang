// #41: per-track "community review in progress" flag.
//
// SquirreLingo ships AI-authored content that awaits a native-speaker review
// pass (see the #41 native-review pile). Every track therefore DEFAULTS to
// "in-progress" so learners always know the content hasn't been human-verified
// yet. When a native review is logged for a track, set its id to "reviewed"
// here and the badge disappears for that track automatically — no other code
// changes needed.
//
// Keys are track ids (the `id` field in data/tracks/*.js, e.g. "ja-for-en",
// "es-latam-for-en"). This is the single source of truth for the flag; keep it
// tiny. If per-track review ever moves into a DB/metadata source, swap the body
// of reviewStatusFor() and leave its signature intact.

export const REVIEW_STATUS = {
  // Flip a track to reviewed once a native-speaker review has been logged, e.g.
  //   "es-latam-for-en": "reviewed",
  // Anything not listed here is treated as "in-progress".
};

export function reviewStatusFor(trackId) {
  return REVIEW_STATUS[trackId] || "in-progress";
}

// True while the track still shows the "community review in progress" badge.
export function isUnderReview(trackId) {
  return reviewStatusFor(trackId) === "in-progress";
}

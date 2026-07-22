"use client";

// #41: subtle, non-intrusive marker that a track's content is AI-authored and
// still awaiting a native-speaker review. Renders nothing once the track is
// marked "reviewed" in lib/reviewStatus.js.
//
// Variants:
//   - "bubble": icon-only micro-pill for the cramped home track bubbles. The
//     full wording rides on the title/aria-label; the play start screen shows
//     the words in full, so the meaning stays discoverable.
//   - "full":   a small labeled pill for the play start screen / track header.
//
// Styling uses the shared theme tokens (purple "notice" family, AA-safe dim
// text) so it stays consistent with the rest of the app and reads as an
// informational marker rather than a warning.

import { Users } from "lucide-react";
import { isUnderReview } from "./reviewStatus";
import { GRAY, RADIUS } from "./theme";

const PURPLE = "#B98EFF";
const LABEL = "Community review in progress";

export default function ReviewBadge({ trackId, variant = "full", style }) {
  if (!isUnderReview(trackId)) return null;

  if (variant === "bubble") {
    return (
      <span title={LABEL} aria-label={LABEL} style={{ ...styles.bubble, ...style }}>
        <Users size={11} color={PURPLE} />
      </span>
    );
  }

  return (
    <span title={LABEL} style={{ ...styles.full, ...style }}>
      <Users size={12} color={PURPLE} />
      <span style={styles.fullText}>{LABEL}</span>
    </span>
  );
}

const styles = {
  bubble: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: RADIUS.pill,
    background: "rgba(185,142,255,0.15)",
    border: "1px solid rgba(185,142,255,0.45)",
  },
  full: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: "rgba(185,142,255,0.12)",
    border: "1px solid rgba(185,142,255,0.4)",
    fontSize: 11,
    fontWeight: 600,
    color: GRAY.dim,
  },
  fullText: { lineHeight: 1.2 },
};

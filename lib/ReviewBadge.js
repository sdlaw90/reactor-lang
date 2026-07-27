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
import { t } from "./playStrings";

const PURPLE = "#D3B0BF";

export default function ReviewBadge({ trackId, variant = "full", style, lang }) {
  if (!isUnderReview(trackId)) return null;
  // #72: the label was a module-level English constant, so it stayed English on every
  // non-English source. Callers pass the viewer's native language.
  const LABEL = t(lang || "en", "reviewBadgeLabel");

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
    background: "rgba(211,176,191,0.15)",
    border: "1px solid rgba(211,176,191,0.45)",
  },
  full: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: RADIUS.pill,
    background: "rgba(211,176,191,0.12)",
    border: "1px solid rgba(211,176,191,0.4)",
    fontSize: 11,
    fontWeight: 600,
    color: GRAY.dim,
  },
  fullText: { lineHeight: 1.2 },
};

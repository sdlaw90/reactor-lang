"use client";

import { useRouter } from "next/navigation";
import { BASE, GRAY, RADIUS } from "./theme";

// A real segmented-control toggle, not a small text link -- meant to be
// placed near the TOP of each mode's start screen so switching modes is
// obvious at a glance, not something you have to scroll to discover.
// #62: `scriptLabel` renders an optional third segment linking to the
// writing-system practice page — pass it only for tracks that have a script
// definition (data/scripts). Tracks without one see the original two-segment
// toggle, untouched.
export default function ModeToggle({ trackId, active, quickQuizLabel = "Quick Quiz", lessonsLabel = "Lessons", scriptLabel = null, grammarLabel = null }) {
  const router = useRouter();

  return (
    <div style={styles.wrap}>
      <button
        className="rj"
        style={{ ...styles.segment, ...(active === "quiz" ? styles.segmentActive : {}) }}
        onClick={() => router.push(`/play/${trackId}`)}
      >
        {quickQuizLabel}
      </button>
      <button
        className="rj"
        style={{ ...styles.segment, ...(active === "lessons" ? styles.segmentActive : {}) }}
        onClick={() => router.push(`/learn/${trackId}`)}
      >
        {lessonsLabel}
      </button>
      {scriptLabel && (
        <button
          className="rj"
          style={{ ...styles.segment, ...(active === "script" ? styles.segmentActive : {}) }}
          onClick={() => router.push(`/script/${trackId}`)}
        >
          {scriptLabel}
        </button>
      )}
      {/* #90: grammar-gym segment — only for tracks with a conjugation module.
          A sibling module like Alphabet, walled off from Quick Quiz/Lessons. */}
      {grammarLabel && (
        <button
          className="rj"
          style={{ ...styles.segment, ...(active === "grammar" ? styles.segmentActive : {}) }}
          onClick={() => router.push(`/grammar/${trackId}`)}
        >
          {grammarLabel}
        </button>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    width: "100%",
    background: BASE.bg,
    border: `1px solid ${BASE.panelBorder}`,
    borderRadius: RADIUS.pill,
    padding: 4,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    background: "transparent",
    color: GRAY.faint,
    border: "none",
    borderRadius: RADIUS.pill,
    padding: "10px 12px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  segmentActive: {
    background: BASE.accent,
    color: BASE.bg,
  },
};

"use client";

import { useRouter } from "next/navigation";

// A real segmented-control toggle, not a small text link -- meant to be
// placed near the TOP of each mode's start screen so switching modes is
// obvious at a glance, not something you have to scroll to discover.
export default function ModeToggle({ trackId, active, quickQuizLabel = "Quick Quiz", lessonsLabel = "Lessons" }) {
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
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    width: "100%",
    background: "#171423",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: 4,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    background: "transparent",
    color: "#7C7395",
    border: "none",
    borderRadius: 999,
    padding: "10px 12px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  segmentActive: {
    background: "#FF8FB1",
    color: "#171423",
  },
};

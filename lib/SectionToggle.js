"use client";

import { useRouter } from "next/navigation";
import { BASE, GRAY, RADIUS } from "./theme";

// Section-level toggle (Practice | Listen | Speak), sitting ABOVE the
// Quick Quiz / Lessons ModeToggle. Listen and Speak are the planned audio
// practice sections (#36/#37) -- until those ship, both route to a
// "Coming soon" page so the nav structure is honest about what's planned
// without faking functionality. Styled deliberately lighter/smaller than
// ModeToggle so the two stacked pills read as section vs. mode, not two
// competing controls.
export default function SectionToggle({
  trackId,
  active,
  practiceLabel = "Practice",
  listenLabel = "Listen",
  speakLabel = "Speak",
  soonLabel = "Soon",
}) {
  const router = useRouter();

  const seg = (key, label, path, soon) => (
    <button
      className="rj"
      style={{ ...styles.segment, ...(active === key ? styles.segmentActive : {}) }}
      onClick={() => router.push(path)}
    >
      {label}
      {soon && <span style={{ ...styles.soonTag, ...(active === key ? styles.soonTagActive : {}) }}>{soonLabel}</span>}
    </button>
  );

  return (
    <div style={styles.wrap}>
      {seg("practice", practiceLabel, `/play/${trackId}`, false)}
      {seg("listen", listenLabel, `/listen/${trackId}`, true)}
      {seg("speak", speakLabel, `/speak/${trackId}`, true)}
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
    padding: 3,
    marginBottom: 10,
  },
  segment: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "transparent",
    color: GRAY.faint,
    border: "none",
    borderRadius: RADIUS.pill,
    padding: "7px 8px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  // #U2 (2026-07-22): match ModeToggle's accent-filled active segment so the two
  // stacked pills on the play screen read as one system (was the subtler
  // panelBorder/text style). The "coming soon" chip stays as the listen/speak
  // indicator; on an accent-filled active segment it inverts to a dark chip so
  // the cyan label keeps its contrast.
  segmentActive: {
    background: BASE.accent,
    color: BASE.bg,
  },
  soonTag: {
    background: "rgba(61,219,255,0.12)",
    color: "#3DDBFF",
    border: "1px solid rgba(61,219,255,0.35)",
    borderRadius: 999,
    padding: "1px 7px",
    fontSize: 9.5,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  soonTagActive: {
    background: "rgba(23,20,35,0.85)",
    borderColor: "rgba(23,20,35,0.9)",
  },
};

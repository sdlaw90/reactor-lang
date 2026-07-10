"use client";

import { useRouter } from "next/navigation";

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
    background: "#171423",
    border: "1px solid #2B2740",
    borderRadius: 999,
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
    color: "#9B93B8",
    border: "none",
    borderRadius: 999,
    padding: "7px 8px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  segmentActive: {
    background: "#2B2740",
    color: "#F3F0FA",
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
    background: "rgba(61,219,255,0.18)",
  },
};

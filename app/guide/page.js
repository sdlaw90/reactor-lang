"use client";

// Standalone intro tour, reachable from the nav drawer ("How to use
// SquirreLingo"). Same GuideTour carousel as the first-run overlay, hosted as a
// normal page with a Back/Home control. Finishing or skipping returns home.

import { useRouter } from "next/navigation";
import BackHome from "../../lib/BackHome";
import GuideTour from "../../lib/GuideTour";
import { GUIDE_STEPS } from "../../lib/guideSteps";

export default function GuidePage() {
  const router = useRouter();
  const goHome = () => router.push("/");

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <BackHome />
        <h1 className="rj" style={styles.heading}>
          How to use SquirreLingo
        </h1>
        <p style={styles.sub}>
          The quick tour. Want every detail instead? See the{" "}
          <a href="/help" style={styles.link}>
            full Help page
          </a>
          .
        </p>
        <GuideTour steps={GUIDE_STEPS} onDone={goHome} doneLabel="Done" />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#171423",
  },
  heading: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px" },
  sub: { color: "#9B93B8", fontSize: 12.5, lineHeight: 1.5, margin: "0 0 18px" },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

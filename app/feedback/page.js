"use client";

import { useRouter } from "next/navigation";

// The old beta-survey wizard that lived here has been retired from the app;
// that questionnaire now goes out as an email at the end of each beta round
// (docs/beta-feedback-email-draft.md). This route stays as a chooser so
// existing links and habits still land somewhere useful.
export default function FeedbackChooserPage() {
  const router = useRouter();

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>Feedback</h1>
        <p style={styles.subtitle}>What would you like to send?</p>

        <button className="rj" style={styles.choiceCard} onClick={() => router.push("/feedback/bug")}>
          <span style={styles.choiceEmoji}>🐞</span>
          <span style={{ flex: 1, textAlign: "left" }}>
            <span style={styles.choiceTitle}>Report a bug</span>
            <span style={styles.choiceDesc}>Something broke, looked wrong, or got stuck</span>
          </span>
        </button>

        <button className="rj" style={styles.choiceCard} onClick={() => router.push("/feedback/feature")}>
          <span style={styles.choiceEmoji}>💡</span>
          <span style={{ flex: 1, textAlign: "left" }}>
            <span style={styles.choiceTitle}>Suggest a feature</span>
            <span style={styles.choiceDesc}>An idea, improvement, or wild wish</span>
          </span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginBottom: 24, textAlign: "center" },
  choiceCard: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 14,
    padding: "18px 16px",
    cursor: "pointer",
    marginBottom: 12,
  },
  choiceEmoji: { fontSize: 26 },
  choiceTitle: { display: "block", color: "#F3F0FA", fontSize: 15.5, fontWeight: 700, marginBottom: 3 },
  choiceDesc: { display: "block", color: "#7C7395", fontSize: 12.5, lineHeight: 1.4 },
};

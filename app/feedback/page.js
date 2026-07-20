"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import BackHome from "../../lib/BackHome";

// The old beta-survey wizard that lived here has been retired from the app;
// that questionnaire now goes out as an email at the end of each beta round
// (docs/beta-feedback-email-draft.md). This route stays as a chooser so
// existing links and habits still land somewhere useful.
//
// Guarded like /feedback/bug and /feedback/feature: signed-out visitors are
// sent to /auth (the beta.4 rework moved the old survey's guard into the two
// destination pages and left this chooser unguarded -- regression fix).
export default function FeedbackChooserPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
    })();
  }, [router]);

  if (!session) return null;

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <BackHome />
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
  choiceDesc: { display: "block", color: "#9B93B8", fontSize: 12.5, lineHeight: 1.4 },
};

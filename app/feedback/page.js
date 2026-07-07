"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { submitFeedback } from "../../lib/db";

const TYPES = [
  { id: "bug", label: "Report a bug" },
  { id: "feedback", label: "General feedback" },
  { id: "feature_request", label: "Feature request" },
  { id: "general", label: "Something else" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUserId(data.session.user.id);
    })();
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Mind adding a bit of detail before sending?");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitFeedback(userId, type, message.trim(), typeof window !== "undefined" ? document.referrer : null);
      setSubmitted(true);
    } catch (e) {
      console.error("submitFeedback failed", e);
      setError("Something went wrong sending that — mind trying again?");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <h1 className="rj" style={styles.title}>
            Thank you! 🐿️
          </h1>
          <p style={styles.body}>Your feedback was sent. It really does help shape what gets built next.</p>
          <button className="rj" style={styles.primaryBtn} onClick={() => router.push("/")}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Feedback
        </h1>
        <p style={styles.subtitle}>Bugs, ideas, or anything else — this goes straight to the developer.</p>

        <form onSubmit={submit}>
          <label style={styles.label}>What's this about?</label>
          <div style={styles.typeRow}>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className="rj"
                style={{ ...styles.typeChip, ...(type === t.id ? styles.typeChipActive : {}) }}
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label style={styles.label}>Details</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What happened, or what's on your mind?"
            rows={6}
            style={styles.textarea}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
            {busy ? "Sending..." : "Send feedback"}
          </button>
        </form>
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
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px" },
  subtitle: { color: "#7C7395", fontSize: 13, marginBottom: 24 },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" },
  label: { display: "block", color: "#7C7395", fontSize: 12.5, fontWeight: 600, marginBottom: 8, marginTop: 4 },
  typeRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  typeChip: {
    background: "#221E33",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  typeChipActive: { background: "#FF8FB1", color: "#171423", borderColor: "#FF8FB1" },
  textarea: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: 16,
    resize: "vertical",
    fontFamily: "inherit",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginBottom: 14 },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};

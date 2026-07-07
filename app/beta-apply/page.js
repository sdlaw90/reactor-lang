"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { submitBetaApplication } from "../../lib/db";
import Logo from "../../lib/Logo";

export default function BetaApplyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [languages, setLanguages] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are both needed so we know who to invite.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitBetaApplication(name.trim(), email.trim(), reason.trim(), languages.trim());
      setSubmitted(true);
    } catch (e) {
      console.error("submitBetaApplication failed", e);
      setError("Something went wrong sending that — mind trying again?");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <Logo size={44} />
          <h1 className="rj" style={styles.title}>
            Thanks for applying! 🐿️
          </h1>
          <p style={styles.body}>
            Your application was received. If you're a good fit for the current round of testing, you'll hear
            back at the email you provided.
          </p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/auth")}>
            Already have an invite? Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Logo size={40} />
        </div>
        <h1 className="rj" style={styles.title}>
          Apply to beta test
        </h1>
        <p style={styles.subtitle}>
          SquirreLingo is in active beta testing. Tell us a bit about yourself, and we'll reach out if there's
          a spot for you in the current round.
        </p>

        <form onSubmit={submit}>
          <label style={styles.label}>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} placeholder="Jane Doe" />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
          />

          <label style={styles.label}>Which language(s) are you most interested in? (optional)</label>
          <input
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            style={styles.input}
            placeholder="e.g. Italian, Japanese"
          />

          <label style={styles.label}>Anything else we should know? (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why you're interested, your experience with language learning, device you'd test on, etc."
            rows={5}
            style={styles.textarea}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
            {busy ? "Sending..." : "Submit application"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <a href="/auth" style={styles.link}>Sign in instead</a>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "50px 20px", background: "#171423" },
  title: { fontSize: 23, fontWeight: 700, color: "#F3F0FA", margin: "0 0 8px", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24, textAlign: "center" },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px" },
  label: { display: "block", color: "#7C7395", fontSize: 12.5, fontWeight: 600, marginBottom: 6, marginTop: 14 },
  input: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#F3F0FA",
    fontSize: 14,
    lineHeight: 1.5,
    resize: "vertical",
    fontFamily: "inherit",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 14 },
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
    marginTop: 22,
  },
  secondaryBtn: {
    width: "100%",
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 12,
    padding: "12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  footer: { color: "#7C7395", fontSize: 12.5, textAlign: "center", marginTop: 20 },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

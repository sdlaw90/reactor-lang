"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { submitFeatureRequest } from "../../../lib/db";

// Single-screen feature request / suggestion form. One required field.
// Identity is derived from the signed-in session server-side.
export default function FeatureRequestPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        if (profile?.username) setUsername(profile.username);
      } catch {
        /* display nicety only */
      }
    })();
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("A description of your idea is needed.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await submitFeatureRequest({ message: message.trim(), problem: problem.trim() });
      setSubmitted(true);
    } catch (err) {
      console.error("submitFeatureRequest failed", err);
      setError(`Something went wrong sending that: ${err?.message || "unknown error"} — mind trying again?`);
    } finally {
      setBusy(false);
    }
  };

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <h1 className="rj" style={styles.title}>Idea received — thank you! 🐿️</h1>
          <p style={styles.body}>Suggestions like this genuinely shape what gets built next.</p>
          <button className="rj" style={styles.secondaryBtn} onClick={() => router.push("/")}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const identity = [username, session?.user?.email].filter(Boolean).join(" · ");

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>Suggest a feature</h1>
        <p style={styles.subtitle}>Big or small, polished or half-formed — all ideas welcome.</p>
        {identity && <p style={styles.identity}>Submitting as {identity}</p>}

        <form onSubmit={submit}>
          <Field label="What's your idea?" required>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.textarea}
              rows={4}
              placeholder="e.g. A daily 2-minute warm-up round that mixes my weakest categories"
              aria-label="What's your idea?"
            />
          </Field>

          <Field label="What problem would it solve for you? (optional)">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              style={styles.textarea}
              rows={3}
              aria-label="What problem would it solve for you?"
            />
          </Field>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="rj" style={styles.primaryBtn} disabled={busy}>
            {busy ? "Sending..." : "Send suggestion"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: "#FF7B8A" }}>*</span>}
      </label>
      {children}
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
  subtitle: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginBottom: 8, textAlign: "center" },
  identity: { color: "#7C7395", fontSize: 12, textAlign: "center", marginBottom: 20 },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px" },
  label: { display: "block", color: "#B4ABC9", fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
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
    marginTop: 6,
  },
  secondaryBtn: {
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 12,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      // Deliberately vague — don't confirm/deny whether the email exists.
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 className="rj" style={styles.title}>
          Reset your password
        </h1>

        {sent ? (
          <>
            <p style={styles.subtitle}>
              If an account exists for that email, a reset link is on its way. Check your inbox (and spam folder).
            </p>
            <button className="rj" style={styles.primaryBtn} onClick={() => router.push("/auth")}>
              Back to sign in
            </button>
          </>
        ) : (
          <form onSubmit={submit} style={{ width: "100%" }}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : "SEND RESET LINK"}
            </button>
            <button type="button" className="rj" style={styles.linkBtn} onClick={() => router.push("/auth")}>
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#171423" },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: "#F3F0FA", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 14, marginBottom: 20, textAlign: "center", lineHeight: 1.5 },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 12,
  },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  linkBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "none",
    fontSize: 13,
    marginTop: 14,
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4 },
};

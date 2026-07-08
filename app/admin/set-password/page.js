"use client";

import { useState } from "react";

export default function AdminSetPasswordPage() {
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok: true } | { error: string }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin-set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Secret": secret },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      });
      const rawText = await res.text();
      let body;
      try {
        body = JSON.parse(rawText);
      } catch {
        // Response wasn't JSON at all -- most commonly a 404 (route not
        // deployed yet) or a platform error page. Surface the real status
        // instead of a generic "network error" that hides what happened.
        setResult({
          error: `Server returned an unexpected response (HTTP ${res.status}). This usually means the API route isn't deployed yet, or crashed before it could respond. First 120 characters of the response: ${rawText.slice(0, 120)}`,
        });
        return;
      }
      if (!res.ok) {
        setResult({ error: body.error || `Failed to set password (HTTP ${res.status})` });
      } else {
        setResult({ ok: true });
      }
    } catch (e) {
      setResult({ error: "Network error (request never reached the server) — check your connection and try again" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 className="rj" style={styles.title}>
          Set a user's password
        </h1>
        <p style={styles.subtitle}>
          Break-glass tool — bypasses the email reset flow entirely. Requires the admin secret, not an app
          sign-in.
        </p>

        <form onSubmit={submit} style={{ width: "100%" }}>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New password (6+ characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />

          {result?.error && <p style={styles.error}>{result.error}</p>}
          {result?.ok && <p style={styles.success}>Password updated. Sign in with the new password now.</p>}

          <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
            {busy ? "..." : "SET PASSWORD"}
          </button>
        </form>
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
  title: { fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#F3F0FA", textAlign: "center" },
  subtitle: { color: "#7C7395", fontSize: 12.5, textAlign: "center", marginBottom: 20, lineHeight: 1.5 },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 12,
    boxSizing: "border-box",
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
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4, marginBottom: 8 },
  success: { color: "#5EE0A0", fontSize: 13, marginTop: 4, marginBottom: 8 },
};

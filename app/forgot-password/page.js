"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";

// Security-question password reset (#79). Email-link reset can't reach
// external addresses until the #65 domain/SMTP chain is done, so recovery
// runs on security questions set up at sign-up or in Settings. Permanent
// (decision 2026-07-12): when #65 lands, an email option joins this page as
// the primary path and this flow stays as the fallback.
//
// Steps: email → answer 2 of 3 questions → new password → done.
// Accounts without questions on file see their password hint (if set) and a
// "request an admin reset" button instead.

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // email | questions | noQuestions | newPassword | done | requested
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const call = async (payload) => {
    const resp = await fetch("/api/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || "Something went wrong — please try again.");
    return data;
  };

  const lookup = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await call({ action: "lookup", email });
      setHint(data.hint || null);
      if (data.hasQuestions) {
        setQuestions(data.questions || []);
        setAnswers({});
        setStep("questions");
      } else {
        setStep("noQuestions");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await call({ action: "verify", email, answers });
      setToken(data.token);
      setStep("newPassword");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await call({ action: "reset", token, newPassword: password });
      setStep("done");
      setTimeout(() => router.push("/auth"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const requestAdmin = async () => {
    setError("");
    setBusy(true);
    try {
      await call({ action: "request_admin", email });
      setStep("requested");
    } catch (err) {
      setError(err.message);
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

        {step === "email" && (
          <form onSubmit={lookup} style={{ width: "100%" }}>
            <p style={styles.subtitle}>
              Enter your account email. If security questions are set up for the account, they&apos;ll appear next.
            </p>
            <input
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : "CONTINUE"}
            </button>
            <button type="button" className="rj" style={styles.linkBtn} onClick={() => router.push("/auth")}>
              Back to sign in
            </button>
          </form>
        )}

        {step === "questions" && (
          <form onSubmit={verify} style={{ width: "100%" }}>
            <p style={styles.subtitle}>
              Answer your security questions — at least 2 of 3 must match. Answers aren&apos;t case-sensitive.
            </p>
            {hint && (
              <p style={styles.hintBox}>
                <strong>Your password hint:</strong> {hint}
                <br />
                <span style={{ fontSize: 12 }}>(Remembered it? <a href="/auth" style={styles.link}>Go sign in</a> instead.)</span>
              </p>
            )}
            {questions.map((q) => (
              <label key={q.key} style={styles.qLabel}>
                <span style={styles.qText}>{q.label}</span>
                <input
                  type="text"
                  aria-label={q.label}
                  value={answers[q.key] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                  style={styles.input}
                  autoComplete="off"
                />
              </label>
            ))}
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : "CHECK ANSWERS"}
            </button>
            <button type="button" className="rj" style={styles.linkBtn} onClick={requestAdmin} disabled={busy}>
              Can&apos;t remember? Request an admin reset
            </button>
          </form>
        )}

        {step === "noQuestions" && (
          <div style={{ width: "100%", textAlign: "center" }}>
            {hint ? (
              <p style={styles.hintBox}>
                <strong>Your password hint:</strong> {hint}
              </p>
            ) : (
              <p style={styles.subtitle}>
                This account doesn&apos;t have security questions set up, so it can&apos;t self-serve a reset.
              </p>
            )}
            <p style={styles.subtitle}>
              {hint ? "If the hint doesn't help, an" : "An"} admin can set a temporary password for you — request one below,
              then check back by trying to sign in later.
            </p>
            {error && <p style={styles.error}>{error}</p>}
            <button className="rj" style={styles.primaryBtn} onClick={requestAdmin} disabled={busy}>
              {busy ? "..." : "REQUEST ADMIN RESET"}
            </button>
            <button type="button" className="rj" style={styles.linkBtn} onClick={() => router.push("/auth")}>
              Back to sign in
            </button>
          </div>
        )}

        {step === "newPassword" && (
          <form onSubmit={reset} style={{ width: "100%" }}>
            <p style={styles.subtitle}>Answers matched — set your new password.</p>
            <PasswordInput
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <PasswordStrengthMeter password={password} />
            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : "UPDATE PASSWORD"}
            </button>
          </form>
        )}

        {step === "done" && (
          <p style={styles.subtitle}>Password updated — taking you to sign in…</p>
        )}

        {step === "requested" && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <p style={styles.subtitle}>
              Request sent. An admin will set a temporary password for the account if one exists — try signing in again
              later, and change the temporary password in Settings once you&apos;re in.
            </p>
            <button className="rj" style={styles.primaryBtn} onClick={() => router.push("/auth")}>
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#171423" },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: "#F3F0FA", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 14, marginBottom: 16, textAlign: "center", lineHeight: 1.5 },
  hintBox: {
    width: "100%",
    background: "#171423",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#F3F0FA",
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: 14,
    boxSizing: "border-box",
  },
  qLabel: { display: "block", width: "100%", marginBottom: 4 },
  qText: { display: "block", color: "#F3F0FA", fontSize: 14, marginBottom: 6 },
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
  linkBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "none",
    fontSize: 13,
    marginTop: 14,
    cursor: "pointer",
    textDecoration: "underline",
    width: "100%",
  },
  link: { color: "#FF8FB1" },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4, marginBottom: 4 },
};

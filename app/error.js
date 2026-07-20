"use client";

import { useEffect, useState } from "react";
import { logClientError } from "../lib/errorReporting";

// Route-level error boundary. Replaces Next.js's raw "Application error: a
// client-side exception has occurred" dead-end with a branded screen that
// (1) gives the user a one-tap way OUT (reload / home), and (2) shows a
// short error code that is also logged to error_logs so a report like
// "I got SQ-M3K7X2" is instantly searchable.
export default function Error({ error, reset }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    const c = logClientError(error);
    setCode(c);
  }, [error]);

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>🐿️</div>
        <h1 className="rj" style={styles.title}>Something went wrong</h1>
        <p style={styles.body}>
          This page hit a snag. Reloading usually fixes it — your progress is safe.
        </p>
        {code && (
          <div style={styles.codeBox}>
            <span style={styles.codeLabel}>Error code</span>
            <span style={styles.code}>{code}</span>
          </div>
        )}
        <p style={styles.hint}>
          If this keeps happening, send a bug report from Settings and include the code above.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="rj"
            style={styles.primaryBtn}
            onClick={() => (typeof reset === "function" ? reset() : window.location.reload())}
          >
            Try again
          </button>
          <button className="rj" style={styles.secondaryBtn} onClick={() => (window.location.href = "/")}>
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#171423",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "32px 26px",
    textAlign: "center",
  },
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" },
  body: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" },
  codeBox: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    background: "#171423",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 14,
  },
  codeLabel: { color: "#9B93B8", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  code: { color: "#FF8FB1", fontSize: 18, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 },
  hint: { color: "#9B93B8", fontSize: 12, lineHeight: 1.5, margin: "0 0 20px" },
  primaryBtn: {
    flex: 1,
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "13px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: "12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};

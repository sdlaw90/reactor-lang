"use client";

import { useEffect, useState } from "react";
import { logClientError } from "../lib/errorReporting";

// Catches crashes in the root layout itself (the case app/error.js can't).
// Must render its own <html>/<body> and depend on nothing else -- when this
// fires, global CSS and fonts may not have loaded.
export default function GlobalError({ error }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    const c = logClientError(error);
    setCode(c);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#171423",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#221E33",
              border: "1px solid #3A3452",
              borderRadius: 16,
              padding: "32px 26px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 6 }}>🐿️</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" }}>Something went wrong</h1>
            <p style={{ color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>
              The app hit a snag. Reloading usually fixes it — your progress is safe.
            </p>
            {code && (
              <div
                style={{
                  background: "#171423",
                  border: "1px solid #3A3452",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 14,
                }}
              >
                <div style={{ color: "#9B93B8", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  Error code
                </div>
                <div style={{ color: "#FF8FB1", fontSize: 18, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}>{code}</div>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                background: "#FF8FB1",
                color: "#171423",
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

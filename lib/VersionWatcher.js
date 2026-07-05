"use client";

import { useEffect, useState, useRef } from "react";
import { CURRENT_VERSION } from "./version";

const POLL_INTERVAL_MS = 60_000; // check every minute, plus whenever the tab regains focus

export default function VersionWatcher() {
  const [availableVersion, setAvailableVersion] = useState(null);
  const [dismissedVersion, setDismissedVersion] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.version && data.version !== CURRENT_VERSION) {
          setAvailableVersion(data.version);
        }
      } catch (e) {
        // Network hiccup or offline — just try again on the next poll, no need to alarm anyone.
      }
    };

    checkVersion();
    intervalRef.current = setInterval(checkVersion, POLL_INTERVAL_MS);

    const onFocus = () => checkVersion();
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Show the popup only if there's a newer version AND the person hasn't
  // already dismissed this exact version — if an even newer one shows up
  // later, it reappears, since that's genuinely new information.
  const shouldShow = availableVersion && availableVersion !== dismissedVersion;

  if (!shouldShow) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="fadein">
        <h3 className="rj" style={styles.title}>
          Update available
        </h3>
        <p style={styles.body}>
          A new version (v{availableVersion}) is ready. Finish what you're doing, or update now — nothing you're working
          on will be lost either way.
        </p>
        <div style={styles.btnRow}>
          <button className="rj" style={styles.updateBtn} onClick={() => window.location.reload()}>
            Update now
          </button>
          <button className="rj" style={styles.waitBtn} onClick={() => setDismissedVersion(availableVersion)}>
            Wait
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    padding: "16px",
    pointerEvents: "none",
  },
  card: {
    pointerEvents: "auto",
    width: "100%",
    maxWidth: 420,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 14,
    padding: "16px 18px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  title: { color: "#F3F0FA", fontSize: 15, fontWeight: 700, margin: "0 0 6px" },
  body: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, margin: "0 0 14px" },
  btnRow: { display: "flex", gap: 10 },
  updateBtn: {
    flex: 1,
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 8,
    padding: "9px 0",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  waitBtn: {
    flex: 1,
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "9px 0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};

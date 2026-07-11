"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { CURRENT_VERSION } from "./version";

const POLL_INTERVAL_MS = 60_000; // check every minute, plus whenever the tab regains focus

export default function VersionWatcher() {
  const pathname = usePathname();
  const [availableVersion, setAvailableVersion] = useState(null);
  const [dismissedVersion, setDismissedVersion] = useState(null);
  const intervalRef = useRef(null);

  // On the sign-in/sign-up screen specifically, a new version blocks entry —
  // same idea as a mobile app forcing an update before launch. Anywhere else
  // (already inside the app), it's a dismissible soft prompt instead.
  const forceMode = pathname === "/auth";

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

  if (!availableVersion) return null;

  // Force mode: always shows if a newer version exists — no dismiss option,
  // and a full backdrop that blocks interaction with the sign-in form behind it.
  if (forceMode) {
    return (
      <div style={styles.blockingOverlay}>
        <div style={styles.card} className="fadein">
          <h3 className="rj" style={styles.title}>
            Reload required
          </h3>
          <p style={styles.body}>
            A new version (v{availableVersion}) is available. Please reload before signing in.
          </p>
          <button className="rj" style={styles.updateBtn} onClick={() => window.location.reload()}>
            Reload now
          </button>
        </div>
      </div>
    );
  }

  // Soft mode: dismissible, doesn't block anything. Reappears only if an even
  // newer version shows up after being dismissed.
  const shouldShow = availableVersion !== dismissedVersion;
  if (!shouldShow) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="fadein">
        <h3 className="rj" style={styles.title}>
          New version available
        </h3>
        <p style={styles.body}>
          A new version (v{availableVersion}) is ready. Finish what you're doing, or reload now — nothing you're
          working on will be lost either way.
        </p>
        <div style={styles.btnRow}>
          <button className="rj" style={styles.updateBtn} onClick={() => window.location.reload()}>
            Reload now
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
  blockingOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(14,12,20,0.85)",
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

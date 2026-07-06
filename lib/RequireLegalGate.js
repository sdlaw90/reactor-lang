"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";
import { LEGAL_VERSION } from "./legalVersions";

const EXCLUDED_PATHS = ["/auth", "/forgot-password", "/reset-password", "/onboarding", "/terms", "/privacy"];

export default function RequireLegalGate() {
  const pathname = usePathname();
  const [needsAcceptance, setNeedsAcceptance] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (EXCLUDED_PATHS.includes(pathname)) {
      setNeedsAcceptance(false);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        const accepted = data.session.user.user_metadata?.legal_accepted_version;
        setNeedsAcceptance(accepted !== LEGAL_VERSION);
      } catch (e) {
        console.error("legal acceptance check failed", e);
      }
    })();
  }, [pathname]);

  if (!needsAcceptance) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { legal_accepted_version: LEGAL_VERSION } });
      if (error) throw error;
      window.location.reload();
    } catch (e) {
      console.error("failed to save legal acceptance", e);
      setBusy(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="fadein">
        <h2 className="rj" style={styles.title}>
          Updated Terms & Privacy Policy
        </h2>
        <p style={styles.body}>Please review and accept our updated Terms of Service and Privacy Policy to continue.</p>
        <form onSubmit={submit}>
          <label style={styles.agreeRow}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>
                Privacy Policy
              </a>
            </span>
          </label>
          <button type="submit" className="rj" style={styles.saveBtn} disabled={!agreed || busy}>
            {busy ? "..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(14,12,20,0.9)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  title: { color: "#F3F0FA", fontSize: 19, fontWeight: 700, margin: "0 0 8px" },
  body: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, margin: "0 0 16px" },
  agreeRow: { display: "flex", alignItems: "flex-start", gap: 8, color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.4, marginBottom: 16, cursor: "pointer" },
  legalLink: { color: "#3DDBFF", textDecoration: "underline" },
  saveBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};

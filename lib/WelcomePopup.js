"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";
import { WELCOME_VERSION } from "./welcomeVersion";
import Logo from "./Logo";

const EXCLUDED_PATHS = ["/auth", "/forgot-password", "/reset-password", "/onboarding", "/terms", "/privacy", "/about"];

export default function WelcomePopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (EXCLUDED_PATHS.includes(pathname)) {
      setVisible(false);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        const meta = data.session.user.user_metadata;
        // Only show once someone's finished onboarding (has a native language
        // set) — otherwise this would show on top of/before the onboarding
        // wizard, which is confusing ordering.
        if (!meta?.native_lang) return;
        setVisible((meta?.welcome_seen_version || null) !== WELCOME_VERSION);
      } catch (e) {
        console.error("welcome popup check failed", e);
      }
    })();
  }, [pathname]);

  const dismiss = async () => {
    setBusy(true);
    try {
      await supabase.auth.updateUser({ data: { welcome_seen_version: WELCOME_VERSION } });
    } catch (e) {
      console.error("failed to save welcome-seen state", e);
    } finally {
      setVisible(false);
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={styles.overlay} onClick={dismiss}>
      <div style={styles.card} className="fadein" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Logo size={44} />
        </div>
        <h2 className="rj" style={styles.title}>
          Welcome to SquirreLingo!
        </h2>
        <p style={styles.body}>
          Quick heads up on how this works: pick a language, and try a short, low-pressure round of questions.
          There's also a calmer, step-by-step <b>Lessons</b> mode if you'd rather work through things
          methodically instead of quick game-style rounds — you'll see the choice on each language's screen.
        </p>
        <button className="rj" style={styles.aboutBtn} onClick={() => router.push("/about")}>
          Read the full About page
        </button>
        <button className="rj" style={styles.dismissBtn} onClick={dismiss} disabled={busy}>
          {busy ? "..." : "Got it, let's go!"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1800,
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
    padding: "28px 22px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  title: { color: "#F3F0FA", fontSize: 21, fontWeight: 700, margin: "0 0 12px" },
  body: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 20px", textAlign: "left" },
  aboutBtn: {
    width: "100%",
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 10,
    padding: "10px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 10,
  },
  dismissBtn: {
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

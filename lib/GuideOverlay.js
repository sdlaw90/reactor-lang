"use client";

// First-run intro tour, shown once per account. Mirrors WelcomePopup's gating
// (only after onboarding, gated on a per-account "seen version"), but instead
// of a single message it runs the full GuideTour carousel. Mounted globally in
// app/layout.js in place of WelcomePopup so new users get one first-run
// experience, not two stacked overlays.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";
import { GUIDE_VERSION } from "./guideVersion";
import { GUIDE_STEPS } from "./guideSteps";
import GuideTour from "./GuideTour";

// Don't pop the overlay on auth/onboarding/legal flows, or on the standalone
// /guide page itself (opening the tour from the menu shouldn't also overlay it).
const EXCLUDED_PATHS = [
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/terms",
  "/privacy",
  "/about",
  "/guide",
];

export default function GuideOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

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
        // Wait until onboarding is done (native language set) so this never
        // stacks on top of the onboarding wizard.
        if (!meta?.native_lang) return;
        setVisible((meta?.guide_seen_version || null) !== GUIDE_VERSION);
      } catch (e) {
        console.error("guide overlay check failed", e);
      }
    })();
  }, [pathname]);

  const markSeen = async () => {
    setVisible(false);
    try {
      await supabase.auth.updateUser({ data: { guide_seen_version: GUIDE_VERSION } });
    } catch (e) {
      console.error("failed to save guide-seen state", e);
    }
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <GuideTour steps={GUIDE_STEPS} onDone={markSeen} onSkip={markSeen} />
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
    padding: 16,
    background: "rgba(14,12,20,0.9)",
  },
};

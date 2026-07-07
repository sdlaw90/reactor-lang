"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Settings now lives inside the profile-picture drawer (lib/NavDrawer.js),
// not as its own page -- this route just redirects home for anyone with an
// old bookmark or direct link. Real content lives in lib/SettingsPanel.js.
export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}

"use client";

// #92: shared Back / Home control.
//
// - Back is always shown. When you're 2+ pages deep it steps back one page
//   (router.back()); at depth 1 (or on a cold deep-link with no in-app
//   history) it goes straight home, which is where Back would land anyway.
// - Home appears immediately to the RIGHT of Back ONLY when you're 2+ pages
//   deep. At depth 1 Back already lands on home, so a Home button would be
//   redundant — hiding it there keeps the chrome quiet (and is the exact
//   behavior #92 specifies).
//
// Depth comes from the maintained breadcrumb stack (lib/navDepth.js), kept
// current by <NavDepthTracker/> in the root layout. Depth is read after mount
// to avoid a server/client hydration mismatch (sessionStorage is client-only).
//
// `label` overrides the Back text (defaults to "Back"); pass a translated
// string on localized pages.

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { recordNav } from "./navDepth";

export default function BackHome({ label = "Back", style }) {
  const router = useRouter();
  const pathname = usePathname();
  const [depth, setDepth] = useState(0);

  // Record this page ourselves (recordNav is idempotent) before reading depth.
  // React runs child effects before the layout's <NavDepthTracker/> parent
  // effect, so relying on the tracker alone could read a stale depth here.
  useEffect(() => {
    setDepth(recordNav(pathname));
  }, [pathname]);

  const deep = depth >= 2;

  const goBack = () => {
    if (deep) router.back();
    else router.push("/");
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, ...style }}>
      <button className="rj" style={styles.backBtn} onClick={goBack}>
        ← {label}
      </button>
      {deep && (
        <button
          className="rj"
          style={styles.homeBtn}
          onClick={() => router.push("/")}
          title="Home"
          aria-label="Home"
        >
          <Home size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
          Home
        </button>
      )}
    </div>
  );
}

const styles = {
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  homeBtn: {
    background: "rgba(185,142,255,0.12)",
    color: "#B98EFF",
    border: "1px solid #B98EFF",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
};

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
// Localized across the board (#72): the Back / Home labels follow the person's
// language automatically — the signed-in user's native_lang when available,
// otherwise the pre-login bootstrap (browser locale / switcher choice). Pages
// don't need to pass anything. `label` still overrides the Back text if a page
// wants a page-specific string (e.g. "Back to sign in").

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { recordNav } from "./navDepth";
import { supabase } from "./supabaseClient";
import { useUiLang, SUPPORTED_UI_LANGS } from "./uiLang";
import { t } from "./playStrings";

export default function BackHome({ label, style }) {
  const router = useRouter();
  const pathname = usePathname();
  const [depth, setDepth] = useState(0);

  // Resolve the display language: bootstrap (browser/switcher, SSR-safe + live)
  // as the base, upgraded to the signed-in user's native_lang when present.
  const [bootstrapLang] = useUiLang();
  const [nativeLang, setNativeLang] = useState(null);
  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const nl = data?.session?.user?.user_metadata?.native_lang;
        if (active && nl && SUPPORTED_UI_LANGS.includes(nl)) setNativeLang(nl);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const uiLang = nativeLang || bootstrapLang;
  const backText = label || t(uiLang, "navBack");
  const homeText = t(uiLang, "navHome");

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
        ← {backText}
      </button>
      {deep && (
        <button
          className="rj"
          style={styles.homeBtn}
          onClick={() => router.push("/")}
          title={homeText}
          aria-label={homeText}
        >
          <Home size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
          {homeText}
        </button>
      )}
    </div>
  );
}

const styles = {
  backBtn: {
    background: "rgba(255,166,190,0.12)",
    color: "#FFA6BE",
    border: "1px solid #FFA6BE",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  homeBtn: {
    background: "rgba(211,176,191,0.12)",
    color: "#D3B0BF",
    border: "1px solid #D3B0BF",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
};

"use client";

// Standalone intro tour, reachable from the nav drawer ("How to use
// SquirreLingo"). Same GuideTour carousel as the first-run overlay, hosted as a
// normal page with a Back/Home control. Finishing or skipping returns home.
// The "Watch the video tour" card sits ABOVE the carousel — the quick 30-second
// option before the step-by-step tour (same order in every language).
//
// #72: localized to the reader's language — the signed-in user's native language
// (native_lang) when supported, else the pre-login bootstrap resolveUiLang()
// (switcher → browser → English). es copy is AI-authored pending review (#41).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackHome from "../../lib/BackHome";
import GuideTour from "../../lib/GuideTour";
import GuideVideoCard from "../../lib/GuideVideoCard";
import { guideSteps } from "../../lib/guideSteps";
import { supabase } from "../../lib/supabaseClient";
import { resolveUiLang, SUPPORTED_UI_LANGS } from "../../lib/uiLang";

const UI = {
  en: {
    heading: "How to use SquirreLingo",
    subPre: "The quick tour. Want every detail instead? See the ",
    subLink: "full Help page",
    subPost: ".",
    divider: "or step through it",
    done: "Done",
  },
  es: {
    heading: "Cómo usar SquirreLingo",
    subPre: "El recorrido rápido. ¿Quieres todos los detalles? Consulta la ",
    subLink: "página de Ayuda completa",
    subPost: ".",
    divider: "o recórrelo paso a paso",
    done: "Listo",
  },
};

// Paint immediately with the bootstrap language, then upgrade once the session
// resolves — no loading gate, no jarring flash. (Same pattern as /about, /help.)
function useResolvedUiLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    let active = true;
    setLang(resolveUiLang());
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const nl = data?.session?.user?.user_metadata?.native_lang;
      if (nl && SUPPORTED_UI_LANGS.includes(nl)) setLang(nl);
    });
    return () => {
      active = false;
    };
  }, []);
  return lang;
}

export default function GuidePage() {
  const router = useRouter();
  const uiLang = useResolvedUiLang();
  const t = UI[uiLang] || UI.en;
  const goHome = () => router.push("/");

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <BackHome />
        <h1 className="rj" style={styles.heading}>
          {t.heading}
        </h1>
        <p style={styles.sub}>
          {t.subPre}
          <a href="/help" style={styles.link}>
            {t.subLink}
          </a>
          {t.subPost}
        </p>

        <GuideVideoCard lang={uiLang} />

        <div style={styles.dividerRow}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>{t.divider}</span>
          <span style={styles.dividerLine} />
        </div>

        <GuideTour steps={guideSteps(uiLang)} lang={uiLang} onDone={goHome} doneLabel={t.done} />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#171423",
  },
  heading: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px" },
  sub: { color: "#9B93B8", fontSize: 12.5, lineHeight: 1.5, margin: "0 0 18px" },
  link: { color: "#3DDBFF", textDecoration: "underline" },
  dividerRow: { display: "flex", alignItems: "center", gap: 10, margin: "16px 0" },
  dividerLine: { flex: 1, height: 1, background: "#3A3452" },
  dividerText: { color: "#9B93B8", fontSize: 12, flexShrink: 0 },
};

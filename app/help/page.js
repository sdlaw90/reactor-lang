"use client";

import { useEffect, useState } from "react";
import BackHome from "../../lib/BackHome";
import { FACEBOOK_GROUP_URL } from "../../lib/community";
import { supabase } from "../../lib/supabaseClient";
import { resolveUiLang, SUPPORTED_UI_LANGS } from "../../lib/uiLang";
import { HELP_CONTENT } from "../../lib/helpAboutContent";

// #72: Help renders from the co-located bilingual content module in the reader's
// language. Language source: the signed-in user's native language
// (session.user.user_metadata.native_lang) when present and supported, else the
// pre-login bootstrap resolveUiLang() (switcher choice → browser → English).
// We paint immediately with the bootstrap language, then upgrade once the
// session resolves — no loading gate, no jarring flash.
function useResolvedUiLang() {
  const [lang, setLang] = useState("en"); // SSR-safe first paint
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

export default function HelpPage() {
  const uiLang = useResolvedUiLang();
  const content = HELP_CONTENT[uiLang] || HELP_CONTENT.en;

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <BackHome />
        <h1 className="rj" style={styles.title}>
          {content.title}
        </h1>
        <p style={{ color: "#9B93B8", fontSize: 12.5, marginTop: -8, marginBottom: 20 }}>
          {renderRich(content.crossref)}
        </p>

        {content.sections.map((section, i) => (
          <Section key={i} title={section.title}>
            {section.body.map((para, j) => (
              <P key={j}>{renderRich(para)}</P>
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
}

// Inline markup renderer: *bold*, _italic_, {{key|label}} links.
function renderRich(str) {
  const re = /\*([^*]+)\*|_([^_]+)_|\{\{(\w+)\|([^}]+)\}\}/g;
  const out = [];
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(str.slice(last, m.index));
    if (m[1] != null) out.push(<b key={k++}>{m[1]}</b>);
    else if (m[2] != null) out.push(<i key={k++}>{m[2]}</i>);
    else out.push(renderLink(m[3], m[4], k++));
    last = re.lastIndex;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

function renderLink(key, label, k) {
  if (key === "fb") {
    return (
      <a key={k} href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FF8FB1" }}>
        {label}
      </a>
    );
  }
  const to =
    key === "about" ? "/about" : key === "help" ? "/help" : key === "feedback" ? "/feedback" : key === "beta" ? "/beta-apply" : "/";
  return (
    <a key={k} href={to} style={{ color: "#3DDBFF", textDecoration: "underline" }}>
      {label}
    </a>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={styles.p}>{children}</p>;
}

function IconRow({ icon, label, text }) {
  return (
    <div style={styles.iconRow}>
      {icon && <div style={styles.iconBadge}>{icon}</div>}
      <div>
        <span style={{ fontWeight: 700, color: "#F3F0FA" }}>{label}</span>
        <p style={{ ...styles.p, marginTop: 2 }}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 20px" },
  section: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "16px 18px", marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#FF8FB1", margin: "0 0 10px" },
  p: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 8px" },
  iconRow: { display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#171423",
    border: "1px solid #3A3452",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#F3F0FA",
    flexShrink: 0,
  },
};

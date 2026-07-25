"use client";

import { useEffect, useState } from "react";
import BackHome from "../../lib/BackHome";
import { FACEBOOK_GROUP_URL } from "../../lib/community";
import { supabase } from "../../lib/supabaseClient";
import { resolveUiLang, SUPPORTED_UI_LANGS } from "../../lib/uiLang";
import { ABOUT_CONTENT } from "../../lib/helpAboutContent";

// #72: About renders from the co-located bilingual content module in the
// reader's language. Language source: the signed-in user's native language
// (session.user.user_metadata.native_lang) when present and supported, else the
// pre-login bootstrap resolveUiLang() (switcher choice → browser → English).
// Paint immediately with the bootstrap language, then upgrade once the session
// resolves — no loading gate, no jarring flash.
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

export default function AboutPage() {
  const uiLang = useResolvedUiLang();
  const content = ABOUT_CONTENT[uiLang] || ABOUT_CONTENT.en;

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <BackHome />
        <h1 className="rj" style={styles.title}>
          {content.title}
        </h1>
        <p style={styles.tagline}>{content.tagline}</p>

        {content.sections.map((section, i) => {
          const rendered = (
            <Section key={i} title={section.title}>
              {section.roadmap ? (
                <Roadmap roadmap={section.roadmap} />
              ) : (
                section.body.map((para, j) => <P key={j}>{renderRich(para)}</P>)
              )}
            </Section>
          );
          return section.anchor ? (
            <div id={section.anchor} key={i}>
              {rendered}
            </div>
          ) : (
            rendered
          );
        })}

        <p style={styles.footer}>{renderRich(content.footer)}</p>
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
      <a key={k} href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={styles.link}>
        {label}
      </a>
    );
  }
  const to =
    key === "about" ? "/about" : key === "help" ? "/help" : key === "feedback" ? "/feedback" : key === "beta" ? "/beta-apply" : "/";
  return (
    <a key={k} href={to} style={styles.link}>
      {label}
    </a>
  );
}

function Roadmap({ roadmap }) {
  return (
    <>
      <P>{renderRich(roadmap.intro)}</P>
      {roadmap.buckets.map((bucket, bi) => (
        <div key={bi}>
          <p style={styles.bucketLabel}>{bucket.label}</p>
          {bucket.items.map((item, ii) => (
            <RoadmapItem key={ii} title={item.title} badge={item.badge} badgeType={item.badgeType}>
              {renderRich(item.desc)}
            </RoadmapItem>
          ))}
        </div>
      ))}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
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

function RoadmapItem({ title, badge, badgeType, children }) {
  return (
    <div style={styles.roadmapItem}>
      <p style={styles.roadmapTitle}>
        {title}
        {badge && <span style={badgeType === "done" ? styles.doneBadge : styles.rollingOutBadge}>{badge}</span>}
      </p>
      <p style={styles.roadmapDesc}>{children}</p>
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
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px" },
  tagline: { color: "#B98EFF", fontSize: 13.5, fontWeight: 600, marginBottom: 24 },
  sectionTitle: { fontSize: 15.5, fontWeight: 700, color: "#FF8FB1", margin: "0 0 8px" },
  p: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 8px" },
  bucketLabel: { color: "#B98EFF", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, margin: "14px 0 6px" },
  roadmapItem: {
    background: "#1F1B30",
    border: "1px solid #2B2740",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 8,
  },
  roadmapTitle: { color: "#F3F0FA", fontSize: 13.5, fontWeight: 700, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rollingOutBadge: {
    background: "rgba(61,219,255,0.12)",
    color: "#3DDBFF",
    border: "1px solid rgba(61,219,255,0.35)",
    borderRadius: 999,
    padding: "1px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  doneBadge: {
    background: "rgba(94,224,160,0.14)",
    color: "#5EE0A0",
    border: "1px solid rgba(94,224,160,0.4)",
    borderRadius: 999,
    padding: "1px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  roadmapDesc: { color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.5, margin: 0 },
  footer: { color: "#9B93B8", fontSize: 12.5, lineHeight: 1.6, marginTop: 8 },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

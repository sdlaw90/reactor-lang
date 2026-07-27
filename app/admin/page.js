"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, TrendingUp, ClipboardList, MessageSquareWarning, Users, Bug, KeyRound } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { resolveUiLang, SUPPORTED_UI_LANGS } from "../../lib/uiLang";
import { adminFetch, adminColors as c } from "./adminApi";
import DashboardSection from "./DashboardSection";
import ProgressSection from "./ProgressSection";
import ApplicationsSection from "./ApplicationsSection";
import FeedbackSection from "./FeedbackSection";
import UsersSection from "./UsersSection";
import ErrorsSection from "./ErrorsSection";
import ResetRequestsSection from "./ResetRequestsSection";

// The admin hub: one page for everything administrative — dashboard counts,
// beta applications, feedback triage, user management, and error logs.
// Auth-guarded (session required) AND admin-gated: the server decides who's
// an admin via /api/admin/me (profiles.is_admin or the ADMIN_EMAIL
// bootstrap) — no admin identity is ever compared in the browser.
//
// #72: the hub resolves the viewer's language once (native_lang → bootstrap
// uiLang → English) and passes `lang` down to every section, so admins see the
// panel in their own language. es copy is AI-authored pending review (#41).

const TAB_DEFS = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "progress", icon: TrendingUp },
  { key: "applications", icon: ClipboardList },
  { key: "feedback", icon: MessageSquareWarning },
  { key: "users", icon: Users },
  { key: "resets", icon: KeyRound },
  { key: "errors", icon: Bug },
];

const T = {
  en: {
    admin: "Admin",
    back: "← Back",
    loading: "Loading…",
    ariaSections: "Admin sections",
    tabs: {
      dashboard: "Dashboard",
      progress: "Progress",
      applications: "Applications",
      feedback: "Feedback",
      users: "Users",
      resets: "Reset Requests",
      errors: "Error Logs",
    },
  },
  es: {
    admin: "Administración",
    back: "← Volver",
    loading: "Cargando…",
    ariaSections: "Secciones de administración",
    tabs: {
      dashboard: "Panel",
      progress: "Progreso",
      applications: "Solicitudes",
      feedback: "Comentarios",
      users: "Usuarios",
      resets: "Restablecimientos",
      errors: "Registros de errores",
    },
  },
};

function AdminHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [gateError, setGateError] = useState("");
  const [lang, setLang] = useState("en");

  const urlTab = searchParams.get("tab");
  const tab = TAB_DEFS.some((t) => t.key === urlTab) ? urlTab : "dashboard";
  const t = T[lang] || T.en;

  useEffect(() => {
    setLang(resolveUiLang());
    (async () => {
      // Standing practice: this page is auth-guarded — signed out goes to
      // /auth, signed in but not admin goes home. Server-verified.
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      const nl = data.session.user?.user_metadata?.native_lang;
      if (nl && SUPPORTED_UI_LANGS.includes(nl)) setLang(nl);
      try {
        await adminFetch("/api/admin/me");
        setReady(true);
      } catch (e) {
        if (/unauthorized/i.test(e.message)) {
          router.push("/");
        } else {
          setGateError(e.message);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = (key) => {
    router.replace(key === "dashboard" ? "/admin" : `/admin?tab=${key}`);
  };

  if (gateError) {
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 860 }}>
          <p style={{ color: c.red, fontSize: 13.5 }}>{gateError}</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: c.body }}>{t.loading}</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 860 }}>
        <div style={styles.headerRow}>
          <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
            {t.back}
          </button>
          <h1 className="rj" style={styles.title}>
            {t.admin}
          </h1>
        </div>

        <div style={styles.tabRow} role="tablist" aria-label={t.ariaSections}>
          {TAB_DEFS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              className="rj"
              role="tab"
              aria-selected={tab === key}
              style={{ ...styles.tabBtn, ...(tab === key ? styles.tabBtnActive : {}) }}
              onClick={() => setTab(key)}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {t.tabs[key]}
            </button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardSection onNavigate={setTab} lang={lang} />}
        {tab === "progress" && <ProgressSection lang={lang} />}
        {tab === "applications" && <ApplicationsSection lang={lang} />}
        {tab === "feedback" && <FeedbackSection lang={lang} />}
        {tab === "users" && <UsersSection lang={lang} />}
        {tab === "resets" && <ResetRequestsSection lang={lang} />}
        {tab === "errors" && <ErrorsSection lang={lang} />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense
      fallback={
        <div style={styles.wrap}>
          <p style={{ color: c.body }}>Loading…</p>
        </div>
      }
    >
      <AdminHub />
    </Suspense>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: c.bg },
  headerRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  backBtn: {
    background: "rgba(255,166,190,0.12)",
    color: c.pink,
    border: `1px solid ${c.pink}`,
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  title: { fontSize: 22, fontWeight: 700, color: c.text, margin: 0 },
  tabRow: { display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: c.card,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 999,
    padding: "8px 15px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  tabBtnActive: { background: c.pink, color: c.bg, borderColor: c.pink },
};

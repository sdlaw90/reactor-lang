"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, TrendingUp, ClipboardList, MessageSquareWarning, Users, Bug, KeyRound } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
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

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "applications", label: "Applications", icon: ClipboardList },
  { key: "feedback", label: "Feedback", icon: MessageSquareWarning },
  { key: "users", label: "Users", icon: Users },
  { key: "resets", label: "Reset Requests", icon: KeyRound },
  { key: "errors", label: "Error Logs", icon: Bug },
];

function AdminHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [gateError, setGateError] = useState("");

  const urlTab = searchParams.get("tab");
  const tab = TABS.some((t) => t.key === urlTab) ? urlTab : "dashboard";

  useEffect(() => {
    (async () => {
      // Standing practice: this page is auth-guarded — signed out goes to
      // /auth, signed in but not admin goes home. Server-verified.
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
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
        <p style={{ color: c.body }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 860 }}>
        <div style={styles.headerRow}>
          <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
            ← Back
          </button>
          <h1 className="rj" style={styles.title}>
            Admin
          </h1>
        </div>

        <div style={styles.tabRow} role="tablist" aria-label="Admin sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className="rj"
              role="tab"
              aria-selected={tab === key}
              style={{ ...styles.tabBtn, ...(tab === key ? styles.tabBtnActive : {}) }}
              onClick={() => setTab(key)}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardSection onNavigate={setTab} />}
        {tab === "progress" && <ProgressSection />}
        {tab === "applications" && <ApplicationsSection />}
        {tab === "feedback" && <FeedbackSection />}
        {tab === "users" && <UsersSection />}
        {tab === "resets" && <ResetRequestsSection />}
        {tab === "errors" && <ErrorsSection />}
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
    background: "rgba(255,143,177,0.12)",
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

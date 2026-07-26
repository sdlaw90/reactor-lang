"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

const T = {
  en: {
    loading: "Loading…",
    pendingApplications: "Pending applications",
    totalApplications: "Applications, total",
    newBugs: "New bug reports",
    newFeatures: "New feature requests",
    otherNewFeedback: "Other new feedback",
    unreviewedErrors: "Unreviewed error logs",
    totalUsers: "Total users",
    activeLast7Days: "Active in last 7 days",
    bannedUsers: "Banned users",
    note1: "Tap any card to open its section. The break-glass password tool (secret-gated, works even if this",
    note2: "account is locked out) still lives at ",
  },
  es: {
    loading: "Cargando…",
    pendingApplications: "Solicitudes pendientes",
    totalApplications: "Solicitudes, total",
    newBugs: "Nuevos reportes de error",
    newFeatures: "Nuevas sugerencias de función",
    otherNewFeedback: "Otros comentarios nuevos",
    unreviewedErrors: "Registros de errores sin revisar",
    totalUsers: "Total de usuarios",
    activeLast7Days: "Activos en los últimos 7 días",
    bannedUsers: "Usuarios bloqueados",
    note1: "Toca cualquier tarjeta para abrir su sección. La herramienta de contraseña de emergencia (protegida por secreto, funciona incluso si esta",
    note2: "cuenta está bloqueada) sigue disponible en ",
  },
};

// At-a-glance counts. Each card deep-links into its section. A null count
// means that one query failed server-side (shown as an em dash) without
// taking the rest of the dashboard down.
export default function DashboardSection({ onNavigate, lang = "en" }) {
  const t = T[lang] || T.en;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/overview")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: c.red, fontSize: 13.5 }}>{error}</p>;
  if (!data) return <p style={{ color: c.body }}>{t.loading}</p>;

  const fmt = (n) => (n === null || n === undefined ? "—" : n);

  const cards = [
    { label: t.pendingApplications, value: fmt(data.pendingApplications), tab: "applications", accent: c.pink },
    { label: t.totalApplications, value: fmt(data.totalApplications), tab: "applications", accent: c.purple },
    { label: t.newBugs, value: fmt(data.newBugs), tab: "feedback", accent: c.red },
    { label: t.newFeatures, value: fmt(data.newFeatures), tab: "feedback", accent: c.amber },
    { label: t.otherNewFeedback, value: fmt(data.otherNewFeedback), tab: "feedback", accent: c.purple },
    { label: t.unreviewedErrors, value: fmt(data.unreviewedErrors), tab: "errors", accent: c.red },
    { label: t.totalUsers, value: fmt(data.totalUsers), tab: "users", accent: c.green },
    { label: t.activeLast7Days, value: fmt(data.activeLast7Days), tab: "users", accent: c.green },
    { label: t.bannedUsers, value: fmt(data.bannedUsers), tab: "users", accent: c.amber },
  ];

  return (
    <div>
      <div style={styles.grid}>
        {cards.map((card) => (
          <button key={card.label} className="rj" style={styles.card} onClick={() => onNavigate(card.tab)}>
            <div style={{ ...styles.value, color: card.accent }}>{card.value}</div>
            <div style={styles.label}>{card.label}</div>
          </button>
        ))}
      </div>
      <p style={styles.note}>
        {t.note1} {t.note2}<span style={{ color: c.body }}>/admin/set-password</span>.
      </p>
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 },
  card: {
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: 14,
    padding: "18px 16px",
    textAlign: "left",
    cursor: "pointer",
  },
  value: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  label: { color: c.body, fontSize: 12.5, marginTop: 8 },
  note: { color: c.muted, fontSize: 12, marginTop: 18, lineHeight: 1.5 },
};

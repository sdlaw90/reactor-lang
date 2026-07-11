"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

// At-a-glance counts. Each card deep-links into its section. A null count
// means that one query failed server-side (shown as an em dash) without
// taking the rest of the dashboard down.
export default function DashboardSection({ onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/overview")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: c.red, fontSize: 13.5 }}>{error}</p>;
  if (!data) return <p style={{ color: c.body }}>Loading…</p>;

  const fmt = (n) => (n === null || n === undefined ? "—" : n);

  const cards = [
    { label: "Pending applications", value: fmt(data.pendingApplications), tab: "applications", accent: c.pink },
    { label: "Applications, total", value: fmt(data.totalApplications), tab: "applications", accent: c.purple },
    { label: "New bug reports", value: fmt(data.newBugs), tab: "feedback", accent: c.red },
    { label: "New feature requests", value: fmt(data.newFeatures), tab: "feedback", accent: c.amber },
    { label: "Other new feedback", value: fmt(data.otherNewFeedback), tab: "feedback", accent: c.purple },
    { label: "Unreviewed error logs", value: fmt(data.unreviewedErrors), tab: "errors", accent: c.red },
    { label: "Total users", value: fmt(data.totalUsers), tab: "users", accent: c.green },
    { label: "Active in last 7 days", value: fmt(data.activeLast7Days), tab: "users", accent: c.green },
    { label: "Banned users", value: fmt(data.bannedUsers), tab: "users", accent: c.amber },
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
        Tap any card to open its section. The break-glass password tool (secret-gated, works even if this
        account is locked out) still lives at <span style={{ color: c.body }}>/admin/set-password</span>.
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

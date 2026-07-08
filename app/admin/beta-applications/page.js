"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

export default function BetaApplicationsAdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      if (data.session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      setSession(data.session);
      await loadApplications(data.session.access_token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseResponse = async (res) => {
    const rawText = await res.text();
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(`Server returned HTTP ${res.status} with a non-JSON response (likely a route/deployment issue): ${rawText.slice(0, 120)}`);
    }
  };

  const loadApplications = async (token) => {
    try {
      const res = await fetch("/api/approve-beta-application", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await parseResponse(res);
      if (!res.ok) throw new Error(body.error || `Failed to load applications (HTTP ${res.status})`);
      setApplications(body.applications);
    } catch (e) {
      setError(e.message);
    }
  };

  const act = async (app, action) => {
    setBusyId(app.id);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch("/api/approve-beta-application", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ applicationId: app.id, email: app.email, action }),
      });
      const body = await parseResponse(res);
      if (!res.ok) throw new Error(body.error || `Failed to ${action} (HTTP ${res.status})`);
      await loadApplications(data.session.access_token);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (session === undefined || applications === null) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  const filtered = applications.filter((a) => filter === "all" || a.status === filter);

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 700 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Beta Applications
        </h1>

        <div style={styles.filterRow}>
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              className="rj"
              style={{ ...styles.filterChip, ...(filter === f ? styles.filterChipActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f} {f !== "all" && `(${applications.filter((a) => a.status === f).length})`}
            </button>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {filtered.length === 0 && <p style={{ color: "#7C7395" }}>No applications here.</p>}

        {filtered.map((app) => (
          <div key={app.id} style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={styles.name}>{app.name}</div>
                <div style={styles.email}>{app.email}</div>
              </div>
              <span style={{ ...styles.statusTag, ...statusColor(app.status) }}>{app.status}</span>
            </div>

            <div style={styles.metaGrid}>
              <Meta label="Native language" value={app.native_language} />
              <Meta label="Wants to learn" value={app.languages_interested} />
              <Meta label="Current level" value={app.current_level} />
              {app.details?.time_commitment && <Meta label="Time commitment" value={app.details.time_commitment} />}
              {app.details?.devices && <Meta label="Devices" value={(app.details.devices || []).join(", ")} />}
              {app.details?.practice_frequency && <Meta label="Practice frequency" value={app.details.practice_frequency} />}
            </div>

            {app.reason && (
              <p style={styles.reason}>
                <b>Why they want to test:</b> {app.reason}
              </p>
            )}
            {app.details?.anything_else && (
              <p style={styles.reason}>
                <b>Anything else:</b> {app.details.anything_else}
              </p>
            )}

            {app.status === "pending" && (
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button className="rj" style={styles.approveBtn} disabled={busyId === app.id} onClick={() => act(app, "approve")}>
                  {busyId === app.id ? "..." : "Approve & invite"}
                </button>
                <button className="rj" style={styles.rejectBtn} disabled={busyId === app.id} onClick={() => act(app, "reject")}>
                  {busyId === app.id ? "..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div style={styles.metaLabel}>{label}</div>
      <div style={styles.metaValue}>{value}</div>
    </div>
  );
}

function statusColor(status) {
  if (status === "approved") return { background: "rgba(94,224,160,0.15)", color: "#5EE0A0" };
  if (status === "rejected") return { background: "rgba(255,123,138,0.15)", color: "#FF7B8A" };
  return { background: "rgba(255,143,177,0.15)", color: "#FF8FB1" };
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
  title: { fontSize: 22, fontWeight: 700, color: "#F3F0FA", margin: "0 0 16px" },
  filterRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  filterChip: {
    background: "#221E33",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "7px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "capitalize",
  },
  filterChipActive: { background: "#FF8FB1", color: "#171423", borderColor: "#FF8FB1" },
  error: { color: "#FF7B8A", fontSize: 13, marginBottom: 14 },
  card: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 14, padding: 18, marginBottom: 14 },
  name: { color: "#F3F0FA", fontWeight: 700, fontSize: 15 },
  email: { color: "#7C7395", fontSize: 12.5 },
  statusTag: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 },
  metaLabel: { color: "#7C7395", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { color: "#B4ABC9", fontSize: 13, marginTop: 2 },
  reason: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, marginTop: 12 },
  approveBtn: {
    flex: 1,
    background: "#5EE0A0",
    color: "#0F3324",
    border: "none",
    borderRadius: 10,
    padding: "11px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  rejectBtn: {
    flex: 1,
    background: "transparent",
    color: "#FF7B8A",
    border: "1px solid #FF7B8A",
    borderRadius: 10,
    padding: "11px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
};

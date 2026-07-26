"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

const T = {
  en: {
    loading: "Loading…",
    banner: (
      <>
        Heads-up: until the #65 domain/SMTP chain is done, “Approve &amp; invite” fails for external email
        addresses (the Supabase invite call 500s). Auto-approve is active, so new applications normally arrive
        already approved with an account — this list is mostly for triage and history right now.
      </>
    ),
    filters: { pending: "pending", approved: "approved", rejected: "rejected", all: "all" },
    statuses: { pending: "pending", approved: "approved", rejected: "rejected" },
    autoTag: "auto",
    noApplications: "No applications here.",
    metaNativeLanguage: "Native language",
    metaWantsToLearn: "Wants to learn",
    metaCurrentLevel: "Current level",
    metaApplied: "Applied",
    metaTimeCommitment: "Time commitment",
    metaDevices: "Devices",
    metaPracticeFrequency: "Practice frequency",
    whyTest: "Why they want to test:",
    anythingElse: "Anything else:",
    approveInvite: "Approve & invite",
    reject: "Reject",
  },
  es: {
    loading: "Cargando…",
    banner: (
      <>
        Aviso: hasta que se complete la cadena de dominio/SMTP del #65, “Aprobar e invitar” falla para
        direcciones de correo externas (la llamada de invitación de Supabase da error 500). La aprobación
        automática está activa, así que las nuevas solicitudes normalmente llegan ya aprobadas con una cuenta
        — por ahora esta lista es principalmente para clasificación e historial.
      </>
    ),
    filters: { pending: "pendiente", approved: "aprobada", rejected: "rechazada", all: "todas" },
    statuses: { pending: "pendiente", approved: "aprobada", rejected: "rechazada" },
    autoTag: "auto",
    noApplications: "No hay solicitudes aquí.",
    metaNativeLanguage: "Idioma nativo",
    metaWantsToLearn: "Quiere aprender",
    metaCurrentLevel: "Nivel actual",
    metaApplied: "Solicitó",
    metaTimeCommitment: "Tiempo disponible",
    metaDevices: "Dispositivos",
    metaPracticeFrequency: "Frecuencia de práctica",
    whyTest: "Por qué quieren probar:",
    anythingElse: "Algo más:",
    approveInvite: "Aprobar e invitar",
    reject: "Rechazar",
  },
};

// Beta applications — ported from the old standalone /admin/beta-applications
// page (which now redirects here). Auto-approved rows (interim flow, #65)
// arrive with status 'approved' and an AUTO chip; migration 010 backfilled
// the ones created while they were still stored as 'pending'.
export default function ApplicationsSection({ lang = "en" }) {
  const t = T[lang] || T.en;
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("pending");

  const load = async () => {
    try {
      const body = await adminFetch("/api/approve-beta-application");
      setApplications(body.applications);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (app, action) => {
    setBusyId(app.id);
    setError("");
    setInfo("");
    try {
      const body = await adminFetch("/api/approve-beta-application", {
        method: "POST",
        body: { applicationId: app.id, email: app.email, action },
      });
      if (body.note) setInfo(body.note);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (applications === null && !error) return <p style={{ color: c.body }}>{t.loading}</p>;

  const filtered = (applications || []).filter((a) => filter === "all" || a.status === filter);

  return (
    <div>
      <p style={styles.banner}>{t.banner}</p>

      <div style={styles.filterRow}>
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            className="rj"
            style={{ ...styles.filterChip, ...(filter === f ? styles.filterChipActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {t.filters[f]} {f !== "all" && `(${(applications || []).filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {info && <p style={styles.info}>{info}</p>}

      {filtered.length === 0 && <p style={{ color: c.muted }}>{t.noApplications}</p>}

      {filtered.map((app) => (
        <div key={app.id} style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <div style={styles.name}>{app.name}</div>
              <div style={styles.email}>{app.email}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {app.details?.auto_approved && <span style={{ ...styles.statusTag, ...styles.autoTag }}>{t.autoTag}</span>}
              <span style={{ ...styles.statusTag, ...statusColor(app.status) }}>{t.statuses[app.status] || app.status}</span>
            </div>
          </div>

          <div style={styles.metaGrid}>
            <Meta label={t.metaNativeLanguage} value={app.native_language} />
            <Meta label={t.metaWantsToLearn} value={app.languages_interested} />
            <Meta label={t.metaCurrentLevel} value={app.current_level} />
            <Meta label={t.metaApplied} value={app.created_at ? new Date(app.created_at).toLocaleString() : null} />
            {app.details?.time_commitment && <Meta label={t.metaTimeCommitment} value={app.details.time_commitment} />}
            {app.details?.devices && <Meta label={t.metaDevices} value={(app.details.devices || []).join(", ")} />}
            {app.details?.practice_frequency && <Meta label={t.metaPracticeFrequency} value={app.details.practice_frequency} />}
          </div>

          {app.reason && (
            <p style={styles.reason}>
              <b>{t.whyTest}</b> {app.reason}
            </p>
          )}
          {app.details?.anything_else && (
            <p style={styles.reason}>
              <b>{t.anythingElse}</b> {app.details.anything_else}
            </p>
          )}

          {app.status === "pending" && (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="rj" style={styles.approveBtn} disabled={busyId === app.id} onClick={() => act(app, "approve")}>
                {busyId === app.id ? "..." : t.approveInvite}
              </button>
              <button className="rj" style={styles.rejectBtn} disabled={busyId === app.id} onClick={() => act(app, "reject")}>
                {busyId === app.id ? "..." : t.reject}
              </button>
            </div>
          )}
        </div>
      ))}
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
  if (status === "approved") return { background: "rgba(94,224,160,0.15)", color: c.green };
  if (status === "rejected") return { background: "rgba(255,123,138,0.15)", color: c.red };
  return { background: "rgba(255,143,177,0.15)", color: c.pink };
}

const styles = {
  banner: {
    background: "rgba(255,196,107,0.08)",
    border: "1px solid rgba(255,196,107,0.35)",
    color: c.amber,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 12.5,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  filterRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  filterChip: {
    background: c.card,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 999,
    padding: "7px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "capitalize",
  },
  filterChipActive: { background: c.pink, color: c.bg, borderColor: c.pink },
  info: { color: c.green, fontSize: 13, marginBottom: 14 },
  error: { color: c.red, fontSize: 13, marginBottom: 14 },
  card: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 18, marginBottom: 14 },
  name: { color: c.text, fontWeight: 700, fontSize: 15 },
  email: { color: c.muted, fontSize: 12.5 },
  statusTag: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase" },
  autoTag: { background: "rgba(185,142,255,0.15)", color: c.purple },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 },
  metaLabel: { color: c.muted, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { color: c.body, fontSize: 13, marginTop: 2 },
  reason: { color: c.body, fontSize: 13, lineHeight: 1.5, marginTop: 12 },
  approveBtn: {
    flex: 1,
    background: c.green,
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
    color: c.red,
    border: `1px solid ${c.red}`,
    borderRadius: 10,
    padding: "11px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },
};

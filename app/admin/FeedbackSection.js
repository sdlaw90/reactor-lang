"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

// Feedback triage: bug reports, feature requests, and the older survey
// submissions, with a workflow status + private admin notes per row.
// Screenshots come through as 1-hour signed URLs (private bucket).

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  // Label is generic across bugs AND features; the stored value stays
  // 'wont_fix' (no migration, existing rows unaffected).
  { value: "wont_fix", label: "Won't do" },
];

const TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "bug", label: "Bugs" },
  { value: "feature", label: "Features" },
  { value: "beta_survey", label: "Surveys" },
  { value: "general", label: "General" },
];

export default function FeedbackSection() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notesDraft, setNotesDraft] = useState({});

  const load = async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      const body = await adminFetch(`/api/admin/feedback${params.toString() ? `?${params}` : ""}`);
      setRows(body.feedback);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter]);

  const update = async (row, patch) => {
    setBusyId(row.id);
    setError("");
    try {
      await adminFetch("/api/admin/feedback", { method: "PATCH", body: { id: row.id, ...patch } });
      await load();
      // Status chips save the moment they're clicked (no separate save
      // button) — say so on screen instead of leaving it to be guessed.
      setSavedId(row.id);
      setTimeout(() => setSavedId((current) => (current === row.id ? null : current)), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (rows === null && !error) return <p style={{ color: c.body }}>Loading…</p>;

  return (
    <div>
      <div style={styles.filterRow}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            className="rj"
            style={{ ...styles.filterChip, ...(typeFilter === f.value ? styles.filterChipActive : {}) }}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div style={styles.filterRow}>
        <button
          className="rj"
          style={{ ...styles.filterChip, ...(statusFilter === "" ? styles.filterChipActive : {}) }}
          onClick={() => setStatusFilter("")}
        >
          Any status
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            className="rj"
            style={{ ...styles.filterChip, ...(statusFilter === s.value ? styles.filterChipActive : {}) }}
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {rows && rows.length === 0 && <p style={{ color: c.muted }}>No feedback here.</p>}

      {(rows || []).map((row) => {
        const expanded = expandedId === row.id;
        const who = [row.username, row.email].filter(Boolean).join(" · ") || "unknown user";
        return (
          <div key={row.id} style={styles.card}>
            <button className="rj" style={styles.cardHeader} onClick={() => setExpandedId(expanded ? null : row.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ ...styles.typeTag, ...typeColor(row.type) }}>{row.type}</span>
                  <span style={{ ...styles.typeTag, ...statusStyle(row.status) }}>
                    {STATUS_OPTIONS.find((s) => s.value === row.status)?.label || row.status}
                  </span>
                  {row.error_code && <span style={{ ...styles.typeTag, ...styles.codeTag }}>{row.error_code}</span>}
                </div>
                <div style={styles.messagePreview}>{row.message}</div>
                <div style={styles.metaLine}>
                  {who} · {new Date(row.created_at).toLocaleString()}
                </div>
              </div>
              <span style={{ color: c.muted, fontSize: 18, lineHeight: 1 }}>{expanded ? "−" : "+"}</span>
            </button>

            {expanded && (
              <div style={styles.expandBody}>
                <p style={styles.fullMessage}>{row.message}</p>

                {row.page_context && <Detail label="Page" value={row.page_context} />}
                {row.sessions_completed && <Detail label="Sessions completed" value={row.sessions_completed} />}
                {row.continued_use_likelihood != null && (
                  <Detail label="Continued-use likelihood" value={String(row.continued_use_likelihood)} />
                )}
                {row.recommend_likelihood != null && (
                  <Detail label="Recommend likelihood" value={String(row.recommend_likelihood)} />
                )}
                {row.details && Object.keys(row.details).length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {Object.entries(row.details).map(([key, value]) => (
                      <Detail key={key} label={prettifyKey(key)} value={prettifyValue(value)} />
                    ))}
                  </div>
                )}
                {row.screenshotUrl && (
                  <a href={row.screenshotUrl} target="_blank" rel="noreferrer" style={styles.screenshotLink}>
                    Open screenshot (link valid ~1 hour)
                  </a>
                )}

                <div style={styles.triageRow}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      className="rj"
                      disabled={busyId === row.id || row.status === s.value}
                      style={{
                        ...styles.statusBtn,
                        ...(row.status === s.value ? styles.statusBtnCurrent : {}),
                      }}
                      onClick={() => update(row, { status: s.value })}
                    >
                      {s.label}
                    </button>
                  ))}
                  {savedId === row.id && <span style={styles.savedFlash}>Saved ✓</span>}
                </div>
                <p style={styles.autosaveHint}>Status saves instantly when clicked — only notes need the button.</p>

                <label style={styles.notesLabel} htmlFor={`notes-${row.id}`}>
                  Admin notes (private)
                </label>
                <textarea
                  id={`notes-${row.id}`}
                  style={styles.notesInput}
                  rows={2}
                  value={notesDraft[row.id] ?? row.admin_notes ?? ""}
                  onChange={(e) => setNotesDraft((d) => ({ ...d, [row.id]: e.target.value }))}
                />
                <button
                  className="rj"
                  style={styles.saveNotesBtn}
                  disabled={busyId === row.id || (notesDraft[row.id] ?? row.admin_notes ?? "") === (row.admin_notes ?? "")}
                  onClick={() => update(row, { adminNotes: notesDraft[row.id] ?? "" })}
                >
                  {busyId === row.id ? "..." : "Save notes"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={styles.metaLabel}>{label}</div>
      <div style={{ color: c.body, fontSize: 13, marginTop: 2, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

// details is free-form jsonb captured by the bug/feature forms — keys vary
// by form version. Render every key as a labeled row (snake_case → words)
// instead of the raw JSON dump the first version showed.
function prettifyKey(key) {
  const label = String(key).replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function prettifyValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(prettifyValue).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function typeColor(type) {
  if (type === "bug") return { background: "rgba(255,123,138,0.15)", color: c.red };
  if (type === "feature") return { background: "rgba(255,196,107,0.15)", color: c.amber };
  return { background: "rgba(185,142,255,0.15)", color: c.purple };
}

function statusStyle(status) {
  if (status === "resolved") return { background: "rgba(94,224,160,0.15)", color: c.green };
  if (status === "in_progress") return { background: "rgba(255,196,107,0.15)", color: c.amber };
  if (status === "wont_fix") return { background: "rgba(155,147,184,0.15)", color: c.muted };
  return { background: "rgba(255,143,177,0.15)", color: c.pink };
}

const styles = {
  filterRow: { display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  filterChip: {
    background: c.card,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  filterChipActive: { background: c.pink, color: c.bg, borderColor: c.pink },
  error: { color: c.red, fontSize: 13, margin: "10px 0" },
  card: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, marginTop: 12, overflow: "hidden" },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
    background: "transparent",
    border: "none",
    padding: 16,
    cursor: "pointer",
    textAlign: "left",
  },
  typeTag: { fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase" },
  codeTag: { background: "rgba(185,142,255,0.15)", color: c.purple, textTransform: "none", fontFamily: "monospace" },
  messagePreview: {
    color: c.text,
    fontSize: 13.5,
    marginTop: 8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  metaLine: { color: c.muted, fontSize: 11.5, marginTop: 5 },
  expandBody: { padding: "0 16px 16px", borderTop: `1px solid ${c.border}` },
  fullMessage: { color: c.body, fontSize: 13.5, lineHeight: 1.55, whiteSpace: "pre-wrap", margin: "14px 0" },
  metaLabel: { color: c.muted, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5 },
  screenshotLink: { color: c.purple, fontSize: 13, display: "inline-block", margin: "6px 0" },
  triageRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", margin: "14px 0 4px" },
  savedFlash: { color: c.green, fontSize: 12.5, fontWeight: 700 },
  autosaveHint: { color: c.muted, fontSize: 11, margin: "4px 0 0" },
  statusBtn: {
    background: c.cardInner,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  statusBtnCurrent: { background: c.pink, color: c.bg, borderColor: c.pink, cursor: "default" },
  notesLabel: { display: "block", color: c.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 12 },
  notesInput: {
    width: "100%",
    boxSizing: "border-box",
    background: c.cardInner,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    color: c.text,
    fontSize: 13,
    padding: 10,
    marginTop: 6,
    resize: "vertical",
  },
  saveNotesBtn: {
    marginTop: 8,
    background: "rgba(255,143,177,0.12)",
    color: c.pink,
    border: `1px solid ${c.pink}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
};

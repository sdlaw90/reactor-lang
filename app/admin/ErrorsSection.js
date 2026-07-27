"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

const T = {
  en: {
    loading: "Loading…",
    searchAria: "Search by error code",
    searchCode: "Search code",
    clear: (code) => `Clear (${code})`,
    filterUnreviewed: "Unreviewed",
    filterReviewed: "Reviewed",
    filterAll: "All",
    empty: "No error logs here. 🎉",
    noMessage: "(no message)",
    reviewedTag: "reviewed",
    markUnreviewed: "Mark unreviewed",
    markReviewed: "Mark reviewed",
    markAllReviewed: (code) => `Mark all “${code}” reviewed`,
  },
  es: {
    loading: "Cargando…",
    searchAria: "Buscar por código de error",
    searchCode: "Buscar código",
    clear: (code) => `Borrar (${code})`,
    filterUnreviewed: "Sin revisar",
    filterReviewed: "Revisado",
    filterAll: "Todos",
    empty: "No hay registros de errores aquí. 🎉",
    noMessage: "(sin mensaje)",
    reviewedTag: "revisado",
    markUnreviewed: "Marcar sin revisar",
    markReviewed: "Marcar como revisado",
    markAllReviewed: (code) => `Marcar todos los “${code}” como revisados`,
  },
};

// Error log browser: the server side of the SQ-XXXXXX codes users see on
// the crash screen (and can prefill into bug reports). Search by exact
// code, filter by reviewed state, expand for stack traces, mark reviewed
// per-row or per-code (one crash usually logs several identical rows).
export default function ErrorsSection({ lang = "en" }) {
  const t = T[lang] || T.en;
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [reviewedFilter, setReviewedFilter] = useState("false");
  const [codeSearch, setCodeSearch] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (reviewedFilter) params.set("reviewed", reviewedFilter);
      if (activeCode) params.set("code", activeCode);
      const body = await adminFetch(`/api/admin/errors${params.toString() ? `?${params}` : ""}`);
      setRows(body.errors);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewedFilter, activeCode]);

  const mark = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await adminFetch("/api/admin/errors", { method: "PATCH", body: payload });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (rows === null && !error) return <p style={{ color: c.body }}>{t.loading}</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={styles.codeInput}
          placeholder="SQ-XXXXXX"
          aria-label={t.searchAria}
          value={codeSearch}
          onChange={(e) => setCodeSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setActiveCode(codeSearch.trim());
          }}
        />
        <button className="rj" style={styles.searchBtn} onClick={() => setActiveCode(codeSearch.trim())}>
          {t.searchCode}
        </button>
        {activeCode && (
          <button
            className="rj"
            style={styles.clearBtn}
            onClick={() => {
              setActiveCode("");
              setCodeSearch("");
            }}
          >
            {t.clear(activeCode)}
          </button>
        )}
      </div>

      <div style={styles.filterRow}>
        {[
          { value: "false", label: t.filterUnreviewed },
          { value: "true", label: t.filterReviewed },
          { value: "", label: t.filterAll },
        ].map((f) => (
          <button
            key={f.value}
            className="rj"
            style={{ ...styles.filterChip, ...(reviewedFilter === f.value ? styles.filterChipActive : {}) }}
            onClick={() => setReviewedFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {rows && rows.length === 0 && <p style={{ color: c.muted }}>{t.empty}</p>}

      {(rows || []).map((row) => {
        const expanded = expandedId === row.id;
        return (
          <div key={row.id} style={styles.card}>
            <button className="rj" style={styles.cardHeader} onClick={() => setExpandedId(expanded ? null : row.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={styles.codeTag}>{row.error_code}</span>
                  {row.reviewed && <span style={styles.reviewedTag}>{t.reviewedTag}</span>}
                </div>
                <div style={styles.messagePreview}>{row.message || t.noMessage}</div>
                <div style={styles.metaLine}>
                  {new Date(row.created_at).toLocaleString()}
                  {row.url ? ` · ${row.url}` : ""}
                </div>
              </div>
              <span style={{ color: c.muted, fontSize: 18, lineHeight: 1 }}>{expanded ? "−" : "+"}</span>
            </button>

            {expanded && (
              <div style={styles.expandBody}>
                {row.user_agent && <p style={styles.uaLine}>{row.user_agent}</p>}
                {row.stack && <pre style={styles.stack}>{row.stack}</pre>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  <button
                    className="rj"
                    style={styles.actionBtn}
                    disabled={busy}
                    onClick={() => mark({ id: row.id, reviewed: !row.reviewed })}
                  >
                    {row.reviewed ? t.markUnreviewed : t.markReviewed}
                  </button>
                  {!row.reviewed && (
                    <button
                      className="rj"
                      style={styles.actionBtn}
                      disabled={busy}
                      onClick={() => mark({ errorCode: row.error_code, reviewed: true })}
                    >
                      {t.markAllReviewed(row.error_code)}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  codeInput: {
    boxSizing: "border-box",
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    color: c.text,
    fontSize: 13.5,
    fontFamily: "monospace",
    padding: "10px 13px",
    width: 150,
  },
  searchBtn: {
    background: c.pink,
    color: c.bg,
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  clearBtn: {
    background: "transparent",
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  filterRow: { display: "flex", gap: 8, margin: "12px 0 6px", flexWrap: "wrap" },
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
  codeTag: {
    fontSize: 11.5,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 999,
    background: "rgba(211,176,191,0.15)",
    color: c.purple,
    fontFamily: "monospace",
  },
  reviewedTag: {
    fontSize: 10.5,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 999,
    background: "rgba(94,224,160,0.15)",
    color: c.green,
    textTransform: "uppercase",
  },
  messagePreview: {
    color: c.text,
    fontSize: 13,
    marginTop: 8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  metaLine: { color: c.muted, fontSize: 11.5, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  expandBody: { padding: "0 16px 16px", borderTop: `1px solid ${c.border}` },
  uaLine: { color: c.muted, fontSize: 11.5, margin: "12px 0 0", wordBreak: "break-all" },
  stack: {
    background: c.cardInner,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    color: c.body,
    fontSize: 11,
    padding: 10,
    overflowX: "auto",
    marginTop: 12,
    maxHeight: 260,
  },
  actionBtn: {
    background: c.cardInner,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};

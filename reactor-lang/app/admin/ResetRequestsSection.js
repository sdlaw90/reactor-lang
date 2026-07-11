"use client";

import { useEffect, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

// Password reset requests (#79): filed from /forgot-password by accounts
// with no security questions on file. Workflow: set a temporary password
// (same set_password action the Users tab uses), tell the person out of
// band if a channel exists, then mark the request resolved. Reject spam.

export default function ResetRequestsSection() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [pwDraft, setPwDraft] = useState({});
  const [pwSetId, setPwSetId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  const load = async () => {
    setError("");
    try {
      const body = await adminFetch("/api/admin/reset-requests");
      setRows(body.requests);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setTempPassword = async (row) => {
    const newPassword = (pwDraft[row.id] || "").trim();
    if (newPassword.length < 6) {
      setError("Temporary password must be at least 6 characters.");
      return;
    }
    setBusyId(row.id);
    setError("");
    try {
      await adminFetch("/api/admin/users", {
        method: "POST",
        body: { userId: row.user_id, action: "set_password", newPassword },
      });
      setPwSetId(row.id);
      setTimeout(() => setPwSetId(null), 4000);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const updateStatus = async (row, action) => {
    setBusyId(row.id);
    setError("");
    try {
      await adminFetch("/api/admin/reset-requests", {
        method: "POST",
        body: { requestId: row.id, action },
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (rows === null && !error) return <p style={{ color: c.muted }}>Loading…</p>;

  const pending = (rows || []).filter((r) => r.status === "pending");
  const settled = (rows || []).filter((r) => r.status !== "pending");
  const visible = showResolved ? [...pending, ...settled] : pending;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ color: c.muted, margin: 0, fontSize: 14 }}>
          {pending.length} pending request{pending.length === 1 ? "" : "s"}
        </p>
        <label style={{ color: c.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />
          Show settled
        </label>
      </div>

      {error && <p style={{ color: c.red, fontSize: 13 }}>{error}</p>}

      {visible.length === 0 && (
        <p style={{ color: c.muted, fontSize: 14 }}>
          {showResolved ? "No reset requests yet." : "No pending requests — all clear. 🐿️"}
        </p>
      )}

      {visible.map((row) => (
        <div key={row.id} style={styles.card(row.status)}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ color: c.text, fontWeight: 600, fontSize: 15 }}>
                {row.username ? `${row.username} — ` : ""}{row.email}
              </div>
              <div style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>
                Requested {new Date(row.requested_at).toLocaleString()}
                {row.status !== "pending" && ` · ${row.status}${row.resolved_at ? ` ${new Date(row.resolved_at).toLocaleString()}` : ""}`}
              </div>
            </div>
          </div>

          {row.status === "pending" && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Temporary password (min 6 chars)"
                  aria-label={`Temporary password for ${row.email}`}
                  value={pwDraft[row.id] || ""}
                  onChange={(e) => setPwDraft((d) => ({ ...d, [row.id]: e.target.value }))}
                  style={styles.input}
                  autoComplete="off"
                />
                <button
                  style={styles.btn}
                  disabled={busyId === row.id}
                  onClick={() => setTempPassword(row)}
                >
                  {pwSetId === row.id ? "Password set ✓" : "Set temp password"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={styles.btnGood} disabled={busyId === row.id} onClick={() => updateStatus(row, "resolve")}>
                  Mark resolved
                </button>
                <button style={styles.btnDanger} disabled={busyId === row.id} onClick={() => updateStatus(row, "reject")}>
                  Reject
                </button>
              </div>
              <p style={{ color: c.muted, fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                Set the temporary password, share it with the person through whatever channel you have, then mark
                resolved. They should change it in Settings after signing in.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: (status) => ({
    background: c.card,
    border: `1px solid ${status === "pending" ? c.pink : c.border}`,
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 12,
    opacity: status === "pending" ? 1 : 0.65,
  }),
  input: {
    flex: 1,
    minWidth: 220,
    background: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
  },
  btn: {
    background: c.pink,
    color: c.bg,
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnGood: {
    background: "transparent",
    color: c.green,
    border: `1px solid ${c.green}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  btnDanger: {
    background: "transparent",
    color: c.red,
    border: `1px solid ${c.red}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
};

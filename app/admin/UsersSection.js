"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, adminColors as c } from "./adminApi";

const T = {
  en: {
    loading: "Loading…",
    searchPlaceholder: "Search by email or username…",
    searchAria: "Search users by email or username",
    noUsers: "No users match.",
    noUsername: "(no username)",
    you: "you",
    owner: "owner",
    admin: "admin",
    banned: "banned",
    statsLine: (u) =>
      `${u.totalXp} XP · best streak ${u.bestStreak} · ${u.tracksStarted} ${u.tracksStarted === 1 ? "track" : "tracks"}${u.lastPlayed ? ` · last played ${u.lastPlayed}` : " · never played"}`,
    created: "Created",
    lastSignIn: "Last sign-in",
    never: "never",
    ownerLocked: "This is the owner account — it can't be modified by other admins.",
    setNewPassword: "Set a new password",
    newPasswordPlaceholder: "New password (min 6 chars)",
    newPasswordAria: (email) => `New password for ${email}`,
    setPassword: "Set password",
    unban: "Unban",
    ban: "Ban",
    banSelf: "You can't ban yourself",
    removeAdmin: "Remove admin",
    removeAdminSelf: "You can't remove your own admin access",
    makeAdmin: "Make admin",
    deleteTitle: "Delete account (permanent — wipes all their data)",
    deletePlaceholder: "Type their email to confirm",
    deleteAria: (email) => `Type ${email} to confirm deletion`,
    deleteForever: "Delete forever",
    done: {
      set_password: (who) => `Password updated for ${who}.`,
      ban: (who) => `${who} is banned.`,
      unban: (who) => `${who} is unbanned.`,
      delete: (who) => `${who} deleted.`,
      set_admin: (who) => `Admin access updated for ${who}.`,
      default: "Done.",
    },
  },
  es: {
    loading: "Cargando…",
    searchPlaceholder: "Buscar por correo o nombre de usuario…",
    searchAria: "Buscar usuarios por correo o nombre de usuario",
    noUsers: "Ningún usuario coincide.",
    noUsername: "(sin nombre de usuario)",
    you: "tú",
    owner: "propietario",
    admin: "admin",
    banned: "bloqueado",
    statsLine: (u) =>
      `${u.totalXp} XP · mejor racha ${u.bestStreak} · ${u.tracksStarted} ${u.tracksStarted === 1 ? "recorrido" : "recorridos"}${u.lastPlayed ? ` · jugado por última vez ${u.lastPlayed}` : " · nunca jugó"}`,
    created: "Creado",
    lastSignIn: "Último inicio de sesión",
    never: "nunca",
    ownerLocked: "Esta es la cuenta del propietario: otros admins no pueden modificarla.",
    setNewPassword: "Establecer una nueva contraseña",
    newPasswordPlaceholder: "Nueva contraseña (mín. 6 caracteres)",
    newPasswordAria: (email) => `Nueva contraseña para ${email}`,
    setPassword: "Establecer contraseña",
    unban: "Desbloquear",
    ban: "Bloquear",
    banSelf: "No puedes bloquearte a ti mismo",
    removeAdmin: "Quitar admin",
    removeAdminSelf: "No puedes quitar tu propio acceso de admin",
    makeAdmin: "Hacer admin",
    deleteTitle: "Eliminar cuenta (permanente: borra todos sus datos)",
    deletePlaceholder: "Escribe su correo para confirmar",
    deleteAria: (email) => `Escribe ${email} para confirmar la eliminación`,
    deleteForever: "Eliminar para siempre",
    done: {
      set_password: (who) => `Contraseña actualizada para ${who}.`,
      ban: (who) => `${who} está bloqueado.`,
      unban: (who) => `${who} está desbloqueado.`,
      delete: (who) => `${who} eliminado.`,
      set_admin: (who) => `Acceso de admin actualizado para ${who}.`,
      default: "Listo.",
    },
  },
};

// User management: every account with profile + progress rollup, and the
// actions that used to require the Supabase dashboard or the break-glass
// tool — set password, ban/unban, delete, grant/revoke admin. Delete is
// permanent (FK cascades wipe all their data) and gated by type-to-confirm.
export default function UsersSection({ lang = "en" }) {
  const t = T[lang] || T.en;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pwDraft, setPwDraft] = useState("");
  const [deleteDraft, setDeleteDraft] = useState("");

  const load = async () => {
    try {
      const body = await adminFetch("/api/admin/users");
      setData(body);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requesterId = data?.requesterId;
  const requesterIsOwner = data?.requesterIsOwner === true;

  const filtered = useMemo(() => {
    const users = data?.users || [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q));
  }, [data, search]);

  const act = async (user, action, extra = {}) => {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await adminFetch("/api/admin/users", { method: "POST", body: { userId: user.id, action, ...extra } });
      setInfo(actionDoneMessage(action, user, lang));
      setPwDraft("");
      setDeleteDraft("");
      if (action === "delete") setExpandedId(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (data === null && !error) return <p style={{ color: c.body }}>{t.loading}</p>;

  return (
    <div>
      <input
        style={styles.search}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAria}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={styles.error}>{error}</p>}
      {info && <p style={styles.info}>{info}</p>}
      {filtered.length === 0 && <p style={{ color: c.muted }}>{t.noUsers}</p>}

      {filtered.map((user) => {
        const expanded = expandedId === user.id;
        const isSelf = user.id === requesterId;
        // #76: owner rows are locked for everyone but the owner; the server
        // enforces this too — hiding the buttons just keeps the UI honest.
        const ownerLocked = user.isOwner && !requesterIsOwner;
        return (
          <div key={user.id} style={styles.card}>
            <button
              className="rj"
              style={styles.cardHeader}
              onClick={() => {
                setExpandedId(expanded ? null : user.id);
                setPwDraft("");
                setDeleteDraft("");
                setInfo("");
                setError("");
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={styles.username}>{user.username || t.noUsername}</span>
                  {isSelf && <span style={{ ...styles.tag, ...styles.youTag }}>{t.you}</span>}
                  {user.isOwner && <span style={{ ...styles.tag, ...styles.ownerTag }}>{t.owner}</span>}
                  {user.isAdmin && !user.isOwner && <span style={{ ...styles.tag, ...styles.adminTag }}>{t.admin}</span>}
                  {user.banned && <span style={{ ...styles.tag, ...styles.bannedTag }}>{t.banned}</span>}
                </div>
                <div style={styles.email}>{user.email}</div>
                <div style={styles.statsLine}>
                  {t.statsLine(user)}
                </div>
              </div>
              <span style={{ color: c.muted, fontSize: 18, lineHeight: 1 }}>{expanded ? "−" : "+"}</span>
            </button>

            {expanded && (
              <div style={styles.expandBody}>
                <div style={styles.metaGrid}>
                  <Detail label={t.created} value={new Date(user.createdAt).toLocaleString()} />
                  <Detail label={t.lastSignIn} value={user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : t.never} />
                </div>

                {ownerLocked && (
                  <p style={{ color: c.muted, fontSize: 12, marginTop: 12 }}>
                    {t.ownerLocked}
                  </p>
                )}

                {/* Set password */}
                {!ownerLocked && (
                <div style={styles.actionBlock}>
                  <div style={styles.actionTitle}>{t.setNewPassword}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input
                      type="password"
                      style={{ ...styles.textInput, flex: 1, minWidth: 160 }}
                      placeholder={t.newPasswordPlaceholder}
                      aria-label={t.newPasswordAria(user.email)}
                      value={pwDraft}
                      onChange={(e) => setPwDraft(e.target.value)}
                    />
                    <button
                      className="rj"
                      style={styles.primaryBtn}
                      disabled={busy || pwDraft.length < 6}
                      onClick={() => act(user, "set_password", { newPassword: pwDraft })}
                    >
                      {t.setPassword}
                    </button>
                  </div>
                </div>
                )}

                {/* Ban / unban + admin toggle */}
                {!ownerLocked && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {user.banned ? (
                    <button className="rj" style={styles.secondaryBtn} disabled={busy} onClick={() => act(user, "unban")}>
                      {t.unban}
                    </button>
                  ) : (
                    <button
                      className="rj"
                      style={styles.warnBtn}
                      disabled={busy || isSelf}
                      title={isSelf ? t.banSelf : undefined}
                      onClick={() => act(user, "ban")}
                    >
                      {t.ban}
                    </button>
                  )}
                  {requesterIsOwner && !user.isOwner && (user.isAdmin ? (
                    <button
                      className="rj"
                      style={styles.secondaryBtn}
                      disabled={busy || isSelf}
                      title={isSelf ? t.removeAdminSelf : undefined}
                      onClick={() => act(user, "set_admin", { value: false })}
                    >
                      {t.removeAdmin}
                    </button>
                  ) : (
                    <button className="rj" style={styles.secondaryBtn} disabled={busy} onClick={() => act(user, "set_admin", { value: true })}>
                      {t.makeAdmin}
                    </button>
                  ))}
                </div>
                )}

                {/* Delete, type-to-confirm */}
                {!isSelf && !ownerLocked && (
                  <div style={styles.dangerBlock}>
                    <div style={styles.actionTitle}>{t.deleteTitle}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        style={{ ...styles.textInput, flex: 1, minWidth: 160 }}
                        placeholder={t.deletePlaceholder}
                        aria-label={t.deleteAria(user.email)}
                        value={deleteDraft}
                        onChange={(e) => setDeleteDraft(e.target.value)}
                      />
                      <button
                        className="rj"
                        style={styles.dangerBtn}
                        disabled={busy || deleteDraft.trim().toLowerCase() !== user.email?.toLowerCase()}
                        onClick={() => act(user, "delete")}
                      >
                        {t.deleteForever}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function actionDoneMessage(action, user, lang = "en") {
  const t = T[lang] || T.en;
  const who = user.username || user.email;
  const done = t.done;
  if (action === "set_password") return done.set_password(who);
  if (action === "ban") return done.ban(who);
  if (action === "unban") return done.unban(who);
  if (action === "delete") return done.delete(who);
  if (action === "set_admin") return done.set_admin(who);
  return done.default;
}

function Detail({ label, value }) {
  return (
    <div>
      <div style={styles.metaLabel}>{label}</div>
      <div style={{ color: c.body, fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const styles = {
  search: {
    width: "100%",
    boxSizing: "border-box",
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    color: c.text,
    fontSize: 14,
    padding: "11px 14px",
  },
  error: { color: c.red, fontSize: 13, margin: "12px 0 0" },
  info: { color: c.green, fontSize: 13, margin: "12px 0 0" },
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
  username: { color: c.text, fontWeight: 700, fontSize: 15 },
  tag: { fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase" },
  youTag: { background: "rgba(94,224,160,0.15)", color: c.green },
  adminTag: { background: "rgba(185,142,255,0.15)", color: c.purple },
  ownerTag: { background: "rgba(255,196,107,0.15)", color: c.amber },
  bannedTag: { background: "rgba(255,123,138,0.15)", color: c.red },
  email: { color: c.muted, fontSize: 12.5, marginTop: 3 },
  statsLine: { color: c.body, fontSize: 12, marginTop: 6 },
  expandBody: { padding: "0 16px 16px", borderTop: `1px solid ${c.border}` },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" },
  metaLabel: { color: c.muted, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5 },
  actionBlock: { marginTop: 4 },
  actionTitle: { color: c.body, fontSize: 12.5, fontWeight: 700, marginBottom: 8 },
  textInput: {
    boxSizing: "border-box",
    background: c.cardInner,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    color: c.text,
    fontSize: 13,
    padding: "9px 12px",
  },
  primaryBtn: {
    background: c.pink,
    color: c.bg,
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: c.cardInner,
    color: c.body,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  warnBtn: {
    background: "rgba(255,196,107,0.1)",
    color: c.amber,
    border: `1px solid ${c.amber}`,
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerBlock: {
    marginTop: 18,
    paddingTop: 14,
    borderTop: `1px dashed rgba(255,123,138,0.35)`,
  },
  dangerBtn: {
    background: "transparent",
    color: c.red,
    border: `1px solid ${c.red}`,
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
};

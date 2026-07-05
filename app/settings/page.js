"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { listNativeLanguages } from "../../data/tracks";
import { loadProfile, isUsernameTaken, setUsername as saveUsername } from "../../lib/db";
import { notifyAccountChange } from "../../lib/notify";
import { verifyCurrentPassword } from "../../lib/reauth";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import VersionFooter from "../../lib/VersionFooter";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      try {
        const p = await loadProfile(data.session.user.id);
        setProfile(p);
      } catch (e) {
        console.error("failed to load profile", e);
      }
    })();
  }, [router]);

  if (session === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Settings
        </h1>

        <UsernameSection session={session} profile={profile} setProfile={setProfile} />
        <EmailSection session={session} setSession={setSession} />
        <PasswordSection session={session} />
        <NativeLanguageSection session={session} setSession={setSession} />
        <VersionFooter />
      </div>
    </div>
  );
}

// ---------------- Username ----------------

function UsernameSection({ session, profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setValue(profile?.username || "");
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Username can't be empty.");
      return;
    }
    if (trimmed === profile?.username) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const taken = await isUsernameTaken(trimmed);
      if (taken) {
        setError("That username is already taken.");
        setBusy(false);
        return;
      }
      await saveUsername(session.user.id, trimmed);
      setProfile((p) => ({ ...(p || {}), username: trimmed }));
      notifyAccountChange("username_changed", session.user.email, { newUsername: trimmed });
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Username" saved={saved}>
      {!editing ? (
        <Row value={profile?.username || "(not set)"} onEdit={startEdit} />
      ) : (
        <>
          <input className="jm" style={styles.input} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Username" />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Email ----------------

function EmailSection({ session, setSession }) {
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setCurrentPassword("");
    setNewEmail("");
    setConfirmNewEmail("");
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    if (!newEmail || newEmail !== confirmNewEmail) {
      setError("Emails don't match.");
      return;
    }
    if (newEmail === session.user.email) {
      setEditing(false);
      return;
    }
    if (!currentPassword) {
      setError("Enter your current password to confirm this change.");
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError("Current password is incorrect.");
        setBusy(false);
        return;
      }
      const oldEmail = session.user.email;
      const { data, error: err } = await supabase.auth.updateUser({ email: newEmail });
      if (err) throw err;
      setSession((s) => ({ ...s, user: data.user }));
      notifyAccountChange("email_changed", oldEmail, { newEmail });
      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Email" saved={saved} savedNote="Check your new email to confirm the change.">
      {!editing ? (
        <Row value={session.user.email} onEdit={startEdit} />
      ) : (
        <>
          <input className="jm" style={styles.input} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email" type="email" />
          <input
            className="jm"
            style={styles.input}
            value={confirmNewEmail}
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            placeholder="Confirm new email"
            type="email"
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password (to confirm it's you)"
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Password ----------------

function PasswordSection({ session }) {
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  const startEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSaved(false);
    setSignedOutOthers(false);
    setEditing(true);
  };

  const save = async () => {
    setError("");
    if (!currentPassword) {
      setError("Enter your current password to confirm this change.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const ok = await verifyCurrentPassword(session.user.email, currentPassword);
      if (!ok) {
        setError("Current password is incorrect.");
        setBusy(false);
        return;
      }
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) throw err;
      notifyAccountChange("password_changed", session.user.email);

      // Security nicety: kick out any other signed-in devices/browsers now
      // that the password has changed, without logging out this session.
      try {
        await supabase.auth.signOut({ scope: "others" });
        setSignedOutOthers(true);
      } catch (e) {
        console.error("sign-out-others failed", e);
      }

      setSaved(true);
      setEditing(false);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Password" saved={saved} savedNote={signedOutOthers ? "Other signed-in devices have been logged out for security." : ""}>
      {!editing ? (
        <Row value="••••••••" onEdit={startEdit} />
      ) : (
        <>
          <PasswordInput
            className="jm"
            style={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            minLength={6}
          />
          <PasswordStrengthMeter password={newPassword} />
          <PasswordInput
            className="jm"
            style={styles.input}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            minLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
    </Section>
  );
}

// ---------------- Native language ----------------

function NativeLanguageSection({ session, setSession }) {
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const options = listNativeLanguages();
  const current = session.user.user_metadata?.native_lang ?? null;
  const currentLabel = options.find((o) => o.code === current)?.label || "(not set)";

  const startEdit = () => {
    setChoice(current);
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    if (!choice) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_lang: choice } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setSaved(true);
      setEditing(false);
    } catch (e) {
      console.error("failed to save native language", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Native / base language" saved={saved}>
      {!editing ? (
        <Row value={currentLabel} onEdit={startEdit} />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {options.map((o) => (
              <label key={o.code} style={{ ...styles.radioOption, borderColor: choice === o.code ? "#FF8FB1" : "#3A3452" }}>
                <input type="radio" name="nativeLang" checked={choice === o.code} onChange={() => setChoice(o.code)} style={{ marginRight: 10 }} />
                {o.label}
              </label>
            ))}
          </div>
          <EditActions busy={busy} onSave={save} onCancel={() => setEditing(false)} />
        </>
      )}
      <p style={{ color: "#7C7395", fontSize: 12, marginTop: 8 }}>
        Changing this only changes which languages show up to learn — progress in tracks you've already played is kept.
      </p>
    </Section>
  );
}

// ---------------- shared bits ----------------

function Section({ title, children, saved, savedNote }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      {children}
      {saved && <p style={styles.saved}>Saved.{savedNote ? ` ${savedNote}` : ""}</p>}
    </div>
  );
}

function Row({ value, onEdit }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowValue}>{value}</span>
      <button className="rj" style={styles.editBtn} onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

function EditActions({ busy, onSave, onCancel }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button className="rj" style={styles.saveBtn} onClick={onSave} disabled={busy}>
        {busy ? "..." : "Save"}
      </button>
      <button className="rj" style={styles.cancelBtn} onClick={onCancel} disabled={busy}>
        Cancel
      </button>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 20px" },
  section: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "16px 18px", marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  rowValue: { color: "#F3F0FA", fontSize: 15 },
  editBtn: {
    background: "transparent",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    marginBottom: 10,
  },
  saveBtn: {
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  radioOption: {
    display: "flex",
    alignItems: "center",
    background: "#171423",
    border: "1px solid",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#F3F0FA",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginBottom: 8 },
  saved: { color: "#5EE0A0", fontSize: 12, marginTop: 8 },
};

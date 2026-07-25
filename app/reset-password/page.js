"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import { t } from "../../lib/playStrings";
import { useUiLang } from "../../lib/uiLang";
import LangSwitcher from "../../lib/LangSwitcher";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [uiLang] = useUiLang();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t(uiLang, "authErrPwMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t(uiLang, "authErrPwLen"));
      return;
    }
    setBusy(true);
    try {
      // Supabase automatically establishes a temporary "recovery" session from
      // the URL when this page loads (via the emailed link), so updateUser
      // here applies to the right account.
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err) {
      setError(err.message || t(uiLang, "fpErrExpired"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <LangSwitcher />
      <div style={styles.card}>
        <h1 className="rj" style={styles.title}>
          {t(uiLang, "rpSetTitle")}
        </h1>
        {done ? (
          <p style={styles.subtitle}>{t(uiLang, "fpDone")}</p>
        ) : (
          <form onSubmit={submit} style={{ width: "100%" }}>
            <PasswordInput
              placeholder={t(uiLang, "fpNewPw")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <PasswordStrengthMeter password={password} />
            <PasswordInput
              placeholder={t(uiLang, "fpConfirmNewPw")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : t(uiLang, "fpUpdatePassword")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#171423" },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: "#F3F0FA", textAlign: "center" },
  subtitle: { color: "#B4ABC9", fontSize: 14, textAlign: "center" },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 12,
  },
  primaryBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4 },
};

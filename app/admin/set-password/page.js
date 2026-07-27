"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { resolveUiLang, SUPPORTED_UI_LANGS } from "../../../lib/uiLang";

function useResolvedUiLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    let active = true;
    setLang(resolveUiLang());
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const nl = data?.session?.user?.user_metadata?.native_lang;
      if (nl && SUPPORTED_UI_LANGS.includes(nl)) setLang(nl);
    });
    return () => {
      active = false;
    };
  }, []);
  return lang;
}

const T = {
  en: {
    title: "Set a user's password",
    subtitle:
      "Break-glass tool — bypasses the email reset flow entirely. Requires the admin secret, not an app sign-in.",
    adminSecret: "Admin secret",
    accountEmail: "Account email",
    newPasswordPlaceholder: "New password (6+ characters)",
    newPasswordAria: "New password, minimum 6 characters",
    unexpectedResponse: (status, snippet) =>
      `Server returned an unexpected response (HTTP ${status}). This usually means the API route isn't deployed yet, or crashed before it could respond. First 120 characters of the response: ${snippet}`,
    setFailed: (status) => `Failed to set password (HTTP ${status})`,
    networkError:
      "Network error (request never reached the server) — check your connection and try again",
    success: "Password updated. Sign in with the new password now.",
    busy: "...",
    setPassword: "SET PASSWORD",
  },
  es: {
    title: "Establecer la contraseña de un usuario",
    subtitle:
      "Herramienta de emergencia — omite por completo el flujo de restablecimiento por correo. Requiere el admin secret, no un inicio de sesión de la app.",
    adminSecret: "Admin secret",
    accountEmail: "Correo de la cuenta",
    newPasswordPlaceholder: "Nueva contraseña (6+ caracteres)",
    newPasswordAria: "Nueva contraseña, mínimo 6 caracteres",
    unexpectedResponse: (status, snippet) =>
      `El servidor devolvió una respuesta inesperada (HTTP ${status}). Esto normalmente significa que la ruta de la API aún no está desplegada, o que falló antes de poder responder. Primeros 120 caracteres de la respuesta: ${snippet}`,
    setFailed: (status) => `No se pudo establecer la contraseña (HTTP ${status})`,
    networkError:
      "Error de red (la solicitud nunca llegó al servidor) — revisa tu conexión e inténtalo de nuevo",
    success: "Contraseña actualizada. Inicia sesión con la nueva contraseña ahora.",
    busy: "...",
    setPassword: "ESTABLECER CONTRASEÑA",
  },
};

export default function AdminSetPasswordPage() {
  const lang = useResolvedUiLang();
  const t = T[lang] || T.en;

  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok: true } | { error: string }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin-set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Secret": secret },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      });
      const rawText = await res.text();
      let body;
      try {
        body = JSON.parse(rawText);
      } catch {
        // Response wasn't JSON at all -- most commonly a 404 (route not
        // deployed yet) or a platform error page. Surface the real status
        // instead of a generic "network error" that hides what happened.
        setResult({
          error: t.unexpectedResponse(res.status, rawText.slice(0, 120)),
        });
        return;
      }
      if (!res.ok) {
        setResult({ error: body.error || t.setFailed(res.status) });
      } else {
        setResult({ ok: true });
      }
    } catch (e) {
      setResult({ error: t.networkError });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 className="rj" style={styles.title}>
          {t.title}
        </h1>
        <p style={styles.subtitle}>
          {t.subtitle}
        </p>

        <form onSubmit={submit} style={{ width: "100%" }}>
          <input
            type="password"
            placeholder={t.adminSecret}
            aria-label={t.adminSecret}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder={t.accountEmail}
            aria-label={t.accountEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder={t.newPasswordPlaceholder}
            aria-label={t.newPasswordAria}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />

          {result?.error && <p style={styles.error}>{result.error}</p>}
          {result?.ok && <p style={styles.success}>{t.success}</p>}

          <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
            {busy ? t.busy : t.setPassword}
          </button>
        </form>
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
  title: { fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#F3F0FA", textAlign: "center" },
  subtitle: { color: "#7C7395", fontSize: 12.5, textAlign: "center", marginBottom: 20, lineHeight: 1.5 },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    background: "#FFA6BE",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4, marginBottom: 8 },
  success: { color: "#5EE0A0", fontSize: 13, marginTop: 4, marginBottom: 8 },
};

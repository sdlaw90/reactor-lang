"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { isUsernameTaken, emailForUsername, setUsername as saveUsername } from "../../lib/db";
import UsernameAvailabilityField from "../../lib/UsernameAvailabilityField";
import PasswordInput from "../../lib/PasswordInput";
import PasswordStrengthMeter from "../../lib/PasswordStrengthMeter";
import Logo from "../../lib/Logo";
import { LEGAL_VERSION } from "../../lib/legalVersions";
import { t } from "../../lib/playStrings";
import { useUiLang } from "../../lib/uiLang";
import LangSwitcher from "../../lib/LangSwitcher";

// Closed beta: public self-serve sign-up is disabled until launch. Flip this
// back to true once ready to open sign-ups to everyone -- the sign-up form
// itself is untouched, just not reachable while this is false.
const SIGNUPS_ENABLED = false;

export default function AuthPage() {
  const router = useRouter();
  const [uiLang] = useUiLang();
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'

  // sign-in
  const [identifier, setIdentifier] = useState(""); // email or username
  const [signinPassword, setSigninPassword] = useState("");

  // sign-up
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const resetMessages = () => {
    setError("");
    setInfo("");
  };

  const submitSignUp = async (e) => {
    e.preventDefault();
    resetMessages();

    if (email !== confirmEmail) {
      setError(t(uiLang, "authErrEmailMismatch"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t(uiLang, "authErrPwMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t(uiLang, "authErrPwLen"));
      return;
    }
    if (!username.trim()) {
      setError(t(uiLang, "authErrUserRequired"));
      return;
    }
    if (username.trim().length < 3) {
      setError(t(uiLang, "authErrUserLen"));
      return;
    }
    if (!agreedToTerms) {
      setError(t(uiLang, "authErrAgree"));
      return;
    }

    setBusy(true);
    try {
      const taken = await isUsernameTaken(username.trim());
      if (taken) {
        setError(t(uiLang, "authErrUserTaken"));
        setBusy(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { pending_username: username.trim(), legal_accepted_version: LEGAL_VERSION } },
      });
      if (signUpError) throw signUpError;

      // Supabase doesn't return a hard error for a pre-existing confirmed email
      // (to avoid confirming to a stranger whether an email is registered) —
      // instead the returned user has no identities. This is the standard way
      // to detect it client-side.
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError(t(uiLang, "authErrEmailExists"));
        setBusy(false);
        return;
      }

      // If email confirmation is turned OFF in Supabase, signUp() returns an
      // active session immediately — no need to make them sign in separately.
      if (data?.session) {
        // First login right here at sign-up: claim a pending username the same
        // way the sign-in flow does.
        if (username.trim()) {
          try {
            const taken = await isUsernameTaken(username.trim());
            if (!taken) await saveUsername(data.user.id, username.trim());
            await supabase.auth.updateUser({ data: { pending_username: null } });
          } catch (e) {
            console.error("failed to claim username at sign-up", e);
          }
        }
        router.push("/");
        return;
      }

      setInfo(t(uiLang, "authInfoConfirm"));
      setMode("signin");
    } catch (err) {
      const msg = err.message || t(uiLang, "authErrGeneric");
      if (/already registered/i.test(msg)) {
        setError(t(uiLang, "authErrEmailExistsShort"));
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const submitSignIn = async (e) => {
    e.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      let resolvedEmail = identifier;
      if (!identifier.includes("@")) {
        // Treat as a username — resolve to an email without ever confirming
        // to the caller whether the username exists (same generic error either way).
        const resolved = await emailForUsername(identifier.trim());
        if (!resolved) {
          setError(t(uiLang, "authErrInvalidCreds"));
          setBusy(false);
          return;
        }
        resolvedEmail = resolved;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password: signinPassword });
      if (signInError) throw signInError;

      // First login after a username was chosen at sign-up: claim it now that
      // we actually have an authenticated session (required by RLS).
      const { data: sessionData } = await supabase.auth.getSession();
      const pending = sessionData.session?.user?.user_metadata?.pending_username;
      if (pending) {
        try {
          const taken = await isUsernameTaken(pending);
          if (!taken) {
            await saveUsername(sessionData.session.user.id, pending);
          }
          await supabase.auth.updateUser({ data: { pending_username: null } });
        } catch (e) {
          console.error("failed to claim pending username", e);
        }
      }

      router.push("/");
    } catch (err) {
      setError(t(uiLang, "authErrInvalidCreds"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <LangSwitcher />
      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Logo size={30} />
          <h1 className="rj" style={{ ...styles.title, marginBottom: 0 }}>
            Squirre<span style={{ color: "#FF8FB1" }}>L</span>ingo
          </h1>
        </div>
        <p style={styles.subtitle}>{mode === "signin" ? t(uiLang, "authSubSignin") : t(uiLang, "authSubSignup")}</p>

        {mode === "signin" ? (
          <form onSubmit={submitSignIn} style={{ width: "100%" }}>
            <input
              type="text"
              placeholder={t(uiLang, "authIdentifier")}
              aria-label={t(uiLang, "authIdentifier")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={styles.input}
            />
            <PasswordInput
              placeholder={t(uiLang, "authPassword")}
              value={signinPassword}
              onChange={(e) => setSigninPassword(e.target.value)}
              required
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            {info && <p style={styles.info}>{info}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : t(uiLang, "authBtnSignin")}
            </button>
            <button type="button" className="rj" style={styles.linkBtn} onClick={() => router.push("/forgot-password")}>
              {t(uiLang, "authForgot")}
            </button>
          </form>
        ) : (
          <form onSubmit={submitSignUp} style={{ width: "100%" }}>
            <UsernameAvailabilityField value={username} onChange={setUsername} placeholder={t(uiLang, "authUsername")} />
            <input
              type="email"
              placeholder={t(uiLang, "authEmail")}
              aria-label={t(uiLang, "authEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder={t(uiLang, "authConfirmEmail")}
              aria-label={t(uiLang, "authConfirmEmail")}
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              style={styles.input}
            />
            <PasswordInput
              placeholder={t(uiLang, "authPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <PasswordStrengthMeter password={password} />
            <PasswordInput
              placeholder={t(uiLang, "authConfirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <p style={styles.hint}>{t(uiLang, "authSigninHint")}</p>
            <label style={styles.agreeRow}>
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
              <span>
                {t(uiLang, "authAgreePre")}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>
                  {t(uiLang, "authAgreeTos")}
                </a>
                {t(uiLang, "authAgreeMid")}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>
                  {t(uiLang, "authAgreePp")}
                </a>
              </span>
            </label>
            {error && <p style={styles.error}>{error}</p>}
            {info && <p style={styles.info}>{info}</p>}
            <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
              {busy ? "..." : t(uiLang, "authBtnSignup")}
            </button>
          </form>
        )}

        {SIGNUPS_ENABLED && (
          <button
            className="rj"
            style={styles.linkBtn}
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              resetMessages();
            }}
          >
            {mode === "signin" ? t(uiLang, "authNeedAccount") : t(uiLang, "authHaveAccount")}
          </button>
        )}

        <p style={styles.betaApplyRow}>
          {t(uiLang, "authBetaPre")}<a href="/beta-apply" style={styles.betaApplyLink}>{t(uiLang, "authBetaLink")}</a>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  betaApplyRow: { textAlign: "center", color: "#9B93B8", fontSize: 12.5, marginTop: 18 },
  betaApplyLink: { color: "#3DDBFF", textDecoration: "underline" },
  agreeRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    color: "#B4ABC9",
    fontSize: 12.5,
    lineHeight: 1.4,
    margin: "10px 0",
    cursor: "pointer",
  },
  legalLink: { color: "#3DDBFF", textDecoration: "underline" },
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
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 4px", color: "#F3F0FA" },
  subtitle: { color: "#B4ABC9", fontSize: 14, marginBottom: 24 },
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
  hint: { color: "#9B93B8", fontSize: 12, marginTop: -4, marginBottom: 12, lineHeight: 1.4 },
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
  linkBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "none",
    fontSize: 13,
    marginTop: 14,
    cursor: "pointer",
    textDecoration: "underline",
    display: "block",
  },
  error: { color: "#FF7B8A", fontSize: 13, marginTop: 4 },
  info: { color: "#5EE0A0", fontSize: 13, marginTop: 4 },
};

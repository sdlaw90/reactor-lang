"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 className="rj" style={styles.title}>
          REACTOR<span style={{ color: "#FF3D7F" }}>.</span>LANG
        </h1>
        <p style={styles.subtitle}>{mode === "signin" ? "Sign in to continue" : "Create an account"}</p>

        <form onSubmit={submit} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          {info && <p style={styles.info}>{info}</p>}
          <button type="submit" disabled={busy} className="rj" style={styles.primaryBtn}>
            {busy ? "..." : mode === "signin" ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>

        <button
          className="rj"
          style={styles.linkBtn}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setInfo("");
          }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#171B24",
    border: "1px solid #2A2F3B",
    borderRadius: 16,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 4px" },
  subtitle: { color: "#9BA0AD", fontSize: 14, marginBottom: 24 },
  input: {
    width: "100%",
    background: "#0E1016",
    color: "#EDEDF2",
    border: "1px solid #2A2F3B",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 12,
  },
  primaryBtn: {
    width: "100%",
    background: "#FF3D7F",
    color: "#0E1016",
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
    color: "#7A7F8C",
    border: "none",
    fontSize: 13,
    marginTop: 18,
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: { color: "#FF5C5C", fontSize: 13, marginTop: 4 },
  info: { color: "#4ADE80", fontSize: 13, marginTop: 4 },
};

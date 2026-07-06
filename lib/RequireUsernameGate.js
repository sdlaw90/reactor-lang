"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";
import { loadProfile, isUsernameTaken, setUsername as saveUsername } from "./db";
import UsernameAvailabilityField from "./UsernameAvailabilityField";

// Routes where we deliberately don't force this — either there's no session yet,
// or the person is already mid-way through a dedicated flow of their own.
const EXCLUDED_PATHS = ["/auth", "/forgot-password", "/reset-password", "/onboarding"];

export default function RequireUsernameGate() {
  const pathname = usePathname();
  const [needsUsername, setNeedsUsername] = useState(false);
  const [userId, setUserId] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (EXCLUDED_PATHS.includes(pathname)) {
      setNeedsUsername(false);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        setUserId(data.session.user.id);
        const profile = await loadProfile(data.session.user.id);
        setNeedsUsername(!profile?.username);
      } catch (e) {
        console.error("username gate check failed", e);
      }
    })();
  }, [pathname]);

  if (!needsUsername) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter a username.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    setBusy(true);
    try {
      const taken = await isUsernameTaken(trimmed);
      if (taken) {
        setError("That username is already taken — try another.");
        setBusy(false);
        return;
      }
      await saveUsername(userId, trimmed);
      // Simplest way to make sure every already-mounted page picks up the new
      // username cleanly, rather than trying to sync state across components.
      window.location.reload();
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card} className="fadein">
        <h2 className="rj" style={styles.title}>
          Pick a username
        </h2>
        <p style={styles.body}>Usernames are now required — this only takes a second, and you can change it anytime in Settings.</p>
        <form onSubmit={submit}>
          <UsernameAvailabilityField value={value} onChange={setValue} placeholder="Username" />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" className="rj" style={styles.saveBtn} disabled={busy}>
            {busy ? "..." : "Save & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(14,12,20,0.9)",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  title: { color: "#F3F0FA", fontSize: 20, fontWeight: 700, margin: "0 0 8px" },
  body: { color: "#B4ABC9", fontSize: 13, lineHeight: 1.5, margin: "0 0 16px" },
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 15,
    marginBottom: 8,
  },
  error: { color: "#FF7B8A", fontSize: 13, marginBottom: 8 },
  saveBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
};

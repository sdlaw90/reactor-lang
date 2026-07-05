"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { listNativeLanguages, tracksForNativeLang } from "../data/tracks";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [nativeLang, setNativeLang] = useState(undefined); // undefined = loading, null = not set yet
  const [savingLang, setSavingLang] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    } else if (session) {
      setNativeLang(session.user.user_metadata?.native_lang ?? null);
    }
  }, [session, router]);

  const chooseNativeLang = async (code) => {
    setSavingLang(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { native_lang: code } });
      if (error) throw error;
      setSession((s) => ({ ...s, user: data.user }));
      setNativeLang(code);
    } catch (e) {
      console.error("failed to save native language", e);
    } finally {
      setSavingLang(false);
    }
  };

  if (session === undefined || session === null || nativeLang === undefined) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#7A7F8C" }}>Loading…</p>
      </div>
    );
  }

  // ---- first load: choose native/base language ----
  if (nativeLang === null) {
    const options = listNativeLanguages();
    return (
      <div style={styles.wrap}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <h1 className="rj" style={styles.title}>
            REACTOR<span style={{ color: "#FF3D7F" }}>.</span>LANG
          </h1>
          <p style={styles.subtitle}>What's your native/base language?</p>
          <p style={{ ...styles.subtitle, fontSize: 12 }}>You can change this later in Settings.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            {options.map((o) => (
              <button
                key={o.code}
                className="rj"
                style={styles.nativeLangCard}
                disabled={savingLang}
                onClick={() => chooseNativeLang(o.code)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- normal state: bubble picker for what to learn ----
  const options = listNativeLanguages();
  const currentLabel = options.find((o) => o.code === nativeLang)?.label || nativeLang;
  const tracks = tracksForNativeLang(nativeLang);

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={styles.topRow}>
          <h1 className="rj" style={styles.title}>
            REACTOR<span style={{ color: "#FF3D7F" }}>.</span>LANG
          </h1>
          <button
            className="rj"
            style={styles.signOutBtn}
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            Sign out
          </button>
        </div>
        <p style={styles.subtitle}>Signed in as {session.user.email}</p>

        <div style={styles.baseLangRow}>
          <span style={{ color: "#7A7F8C", fontSize: 13 }}>
            Native language: <strong style={{ color: "#EDEDF2" }}>{currentLabel}</strong>
          </span>
          <button className="rj" style={styles.settingsLink} onClick={() => router.push("/settings")}>
            Change
          </button>
        </div>

        <p className="rj" style={{ ...styles.subtitle, marginTop: 22, marginBottom: 10 }}>
          What do you want to learn?
        </p>
        <div style={styles.bubbleWrap}>
          {tracks.length === 0 && (
            <p style={{ color: "#7A7F8C", fontSize: 14 }}>No tracks available yet for this native language.</p>
          )}
          {tracks.map((t) => (
            <button key={t.id} className="rj" style={styles.bubble} onClick={() => router.push(`/play/${t.id}`)}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "#9BA0AD", marginTop: 3 }}>{t.sublabel}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#0E1016" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: 700, margin: 0, color: "#EDEDF2" },
  subtitle: { color: "#7A7F8C", fontSize: 13, marginTop: 4 },
  signOutBtn: {
    background: "transparent",
    color: "#7A7F8C",
    border: "1px solid #2A2F3B",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    cursor: "pointer",
  },
  nativeLangCard: {
    textAlign: "left",
    background: "#171B24",
    border: "1px solid #2A2F3B",
    borderRadius: 14,
    padding: "18px 20px",
    color: "#EDEDF2",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },
  baseLangRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#171B24",
    border: "1px solid #2A2F3B",
    borderRadius: 10,
    padding: "10px 14px",
    marginTop: 16,
  },
  settingsLink: {
    background: "transparent",
    color: "#3DDBFF",
    border: "1px solid #3DDBFF",
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  // "Bubble" pill-style buttons for picking the target language.
  bubbleWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
  bubble: {
    textAlign: "left",
    background: "#171B24",
    border: "1px solid #2A2F3B",
    borderRadius: 999,
    padding: "14px 22px",
    color: "#EDEDF2",
    cursor: "pointer",
    flex: "1 1 auto",
    minWidth: 160,
  },
};

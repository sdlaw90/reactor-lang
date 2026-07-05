"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { listNativeLanguages, tracksForNativeLang, listTracks } from "../data/tracks";
import { HOME_GRADIENT, animatedBackgroundStyle } from "../lib/theme";
import VersionFooter from "../lib/VersionFooter";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) router.push("/auth");
  }, [session, router]);

  if (session === undefined || session === null) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  const nativeLang = session.user.user_metadata?.native_lang ?? null;
  const options = listNativeLanguages();
  const currentLabel = options.find((o) => o.code === nativeLang)?.label;
  // Until a native language is set, show every track so the app is still usable.
  const tracks = nativeLang ? tracksForNativeLang(nativeLang) : listTracks();

  return (
    <div style={styles.wrap}>
      <div style={animatedBackgroundStyle(HOME_GRADIENT)} />
      <div style={styles.content}>
        <div style={styles.topRow}>
          <h1 className="rj" style={styles.title}>
            REACTOR<span style={{ color: "#FF8FB1" }}>.</span>LANG
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="rj"
              style={styles.iconBtn}
              title="Settings"
              aria-label="Settings"
              onClick={() => router.push("/settings")}
            >
              <Settings size={18} />
            </button>
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
        </div>
        <p style={styles.subtitle}>Signed in as {session.user.email}</p>

        {!nativeLang && (
          <p style={styles.hintBanner}>
            Showing every track for now — set your native language in Settings to personalize this list.
          </p>
        )}
        {nativeLang && (
          <p style={{ color: "#7C7395", fontSize: 12, marginTop: 6 }}>Learning as a {currentLabel} speaker</p>
        )}

        <p className="rj" style={{ ...styles.subtitle, marginTop: 22, marginBottom: 10, color: "#F3F0FA", fontWeight: 700 }}>
          What do you want to learn?
        </p>
        <div style={styles.bubbleWrap}>
          {tracks.map((t) => (
            <button key={t.id} className="rj" style={styles.bubble} onClick={() => router.push(`/play/${t.id}`)}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "#B4ABC9", marginTop: 3 }}>{t.sublabel}</div>
            </button>
          ))}
        </div>
        <VersionFooter />
      </div>
    </div>
  );
}

const styles = {
  wrap: { position: "relative", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423", overflow: "hidden" },
  content: { position: "relative", zIndex: 1, width: "100%", maxWidth: 460 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: 700, margin: 0, color: "#F3F0FA" },
  subtitle: { color: "#B4ABC9", fontSize: 13, marginTop: 4 },
  hintBanner: {
    color: "#F3F0FA",
    fontSize: 12,
    background: "rgba(34,30,51,0.85)",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "8px 12px",
    marginTop: 12,
  },
  iconBtn: {
    background: "rgba(34,30,51,0.85)",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "7px 9px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  signOutBtn: {
    background: "rgba(34,30,51,0.85)",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    cursor: "pointer",
  },
  bubbleWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
  bubble: {
    textAlign: "left",
    background: "rgba(34,30,51,0.9)",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "14px 22px",
    color: "#F3F0FA",
    cursor: "pointer",
    flex: "1 1 auto",
    minWidth: 160,
  },
};

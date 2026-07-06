"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, BarChart2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { tracksForNativeLang, listTracks } from "../data/tracks";
import { HOME_GRADIENT, animatedBackgroundStyle } from "../lib/theme";
import { flagImageUrl, regionalLanguageLabel } from "../lib/countries";
import { loadProfile } from "../lib/db";
import Avatar from "../lib/Avatar";
import VersionFooter from "../lib/VersionFooter";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    } else if (session) {
      loadProfile(session.user.id)
        .then(setProfile)
        .catch((e) => console.error("failed to load profile", e));
    }
  }, [session, router]);

  if (session === undefined || session === null) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  const nativeLang = session.user.user_metadata?.native_lang ?? null;
  const nativeCountry = session.user.user_metadata?.native_country ?? null;
  // Until a native language is set, show every track so the app is still usable.
  const tracks = nativeLang ? tracksForNativeLang(nativeLang) : listTracks();
  const displayName = profile?.username || session.user.email;
  const regionLabel = nativeLang ? regionalLanguageLabel(nativeLang, nativeCountry) : null;

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
              title="Progress dashboard"
              aria-label="Progress dashboard"
              onClick={() => router.push("/dashboard")}
            >
              <BarChart2 size={18} />
            </button>
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

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={displayName} size={36} />
          <p className="rj" style={styles.usernameDisplay}>
            {displayName}
          </p>
        </div>

        {!nativeLang && (
          <p style={styles.hintBanner}>
            Showing every track for now — set your native language in Settings to personalize this list.
          </p>
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

        {regionLabel && (
          <div style={styles.identityTag}>
            {regionLabel}
            {nativeCountry && (
              <img
                src={flagImageUrl(nativeCountry)}
                alt={nativeCountry}
                style={{ width: 18, height: 13, objectFit: "cover", borderRadius: 2, marginLeft: 6, verticalAlign: "middle" }}
              />
            )}
          </div>
        )}
        <VersionFooter />
      </div>
    </div>
  );
}

const styles = {
  usernameDisplay: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#F3F0FA",
    letterSpacing: 0.3,
    background: "linear-gradient(90deg, #FF8FB1, #B98EFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
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
  identityTag: {
    marginTop: 26,
    textAlign: "center",
    color: "#B4ABC9",
    fontSize: 12,
    background: "rgba(34,30,51,0.7)",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "6px 14px",
    display: "inline-block",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
  },
};

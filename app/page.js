"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BarChart2, HelpCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { tracksForNativeLang, listTracks } from "../data/tracks";
import { HOME_GRADIENT, animatedBackgroundStyle } from "../lib/theme";
import { flagImageUrl } from "../lib/countries";
import { loadProfile, loadAllProgress } from "../lib/db";
import { skillLevelInfo } from "../lib/skillLevels";
import { CURRENT_VERSION } from "../lib/version";
import Avatar from "../lib/Avatar";
import VersionFooter from "../lib/VersionFooter";
import Logo from "../lib/Logo";

const GREETINGS = {
  es: "¡Bienvenido/a",
  en: "Welcome",
};

function welcomeGreeting(nativeLang) {
  return GREETINGS[nativeLang] || "Welcome";
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);
  const [progressByTrack, setProgressByTrack] = useState({});

  useEffect(() => {
    const refetch = () => supabase.auth.getSession().then(({ data }) => setSession(data.session));
    refetch();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    // Next.js's client-side navigation cache can restore a cached Home page
    // without re-running this effect, so a change made on another page (like
    // native country in Settings) wouldn't otherwise show up here until a hard
    // refresh. Re-fetching whenever we land back on "/" or the tab regains
    // focus covers that gap.
    window.addEventListener("focus", refetch);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("focus", refetch);
    };
  }, [pathname]);

  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    } else if (session) {
      if (!session.user.user_metadata?.native_lang) {
        router.push("/onboarding");
        return;
      }
      loadProfile(session.user.id)
        .then(setProfile)
        .catch((e) => console.error("failed to load profile", e));
      loadAllProgress(session.user.id)
        .then((rows) => {
          const map = {};
          rows.forEach((r) => (map[r.track_id] = r));
          setProgressByTrack(map);
        })
        .catch((e) => console.error("failed to load progress", e));
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
  const hasUnseenWhatsNew = (session.user.user_metadata?.last_seen_version ?? null) !== CURRENT_VERSION;

  return (
    <div style={styles.wrap}>
      <div style={animatedBackgroundStyle(HOME_GRADIENT)} />
      <div style={styles.content}>
        <div style={styles.topRow}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={28} />
            <h1 className="rj" style={styles.title}>
              Squirre<span style={{ color: "#FF8FB1" }}>L</span>ingo
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {nativeCountry && (
              <button
                className="rj jm"
                style={styles.langBadge}
                title="Native language & country (change in Settings)"
                aria-label="Native language and country"
                onClick={() => router.push("/settings")}
              >
                {nativeCountry}
                <img
                  src={flagImageUrl(nativeCountry)}
                  alt={nativeCountry}
                  style={{ width: 16, height: 11, objectFit: "cover", borderRadius: 2, marginLeft: 5 }}
                />
              </button>
            )}
            <button
              className="rj"
              style={{ ...styles.iconBtn, position: "relative", fontSize: 18, fontWeight: 800, lineHeight: 1, justifyContent: "center", minWidth: 34 }}
              title="What's new"
              aria-label="What's new"
              onClick={() => router.push("/whats-new")}
            >
              !
              {hasUnseenWhatsNew && <span style={styles.notifDot} />}
            </button>
            <button
              className="rj"
              style={styles.iconBtn}
              title="Help"
              aria-label="Help"
              onClick={() => router.push("/help")}
            >
              <HelpCircle size={18} />
            </button>
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
              title="User Settings"
              aria-label="User Settings"
              onClick={() => router.push("/settings")}
            >
              <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={displayName} size={22} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 10 }}>
          <p className="rj greeting-flair" style={styles.welcomeText}>
            {welcomeGreeting(nativeLang)}, <span className="shimmer-text" style={styles.usernameDisplay}>{displayName}</span>!
            <span className="wave-emoji" style={{ marginLeft: 6, display: "inline-block" }}>
              👋
            </span>
          </p>
        </div>

        {!nativeLang && (
          <p style={styles.hintBanner}>
            Showing every track for now — set your native language in Settings to personalize this list.
          </p>
        )}

        <p className="rj" style={styles.quickWinPrompt}>
          Pick your next quick win ⚡
        </p>
        <div style={styles.bubbleWrap}>
          {tracks.map((t) => {
            const p = progressByTrack[t.id];
            const xpInLevel = p ? p.xp % 100 : 0;
            const skillLabel = skillLevelInfo(p?.skill_level || "none").label;
            return (
              <button key={t.id} className="rj" style={styles.bubble} onClick={() => router.push(`/play/${t.id}`)}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{t.label}</div>
                <div className="jm" style={{ fontSize: 11, color: "#B4ABC9", marginTop: 3 }}>
                  {p ? `${skillLabel} · ${xpInLevel}/100 XP` : "Not started"}
                </div>
              </button>
            );
          })}
        </div>

        <VersionFooter />
      </div>
    </div>
  );
}

const styles = {
  welcomeText: {
    marginTop: 10,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#F3F0FA",
    textAlign: "center",
  },
  usernameDisplay: {
    fontWeight: 800,
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
    border: "none",
    borderRadius: "50%",
    padding: "8px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#FF3D7F",
    border: "2px solid #171423",
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
  quickWinPrompt: {
    fontSize: 22,
    fontWeight: 800,
    color: "#F3F0FA",
    textAlign: "center",
    marginTop: 26,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  langBadge: {
    display: "flex",
    alignItems: "center",
    background: "rgba(34,30,51,0.85)",
    color: "#F3F0FA",
    border: "none",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
};

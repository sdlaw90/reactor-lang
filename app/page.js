"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { tracksForNativeLang, listTracks } from "../data/tracks";
import { HOME_GRADIENT, animatedBackgroundStyle } from "../lib/theme";
import { loadProfile, loadAllProgress } from "../lib/db";
import { skillLevelInfo } from "../lib/skillLevels";
import { CURRENT_VERSION } from "../lib/version";
import VersionFooter from "../lib/VersionFooter";
import Logo from "../lib/Logo";
import TrackIcon from "../lib/trackIcons";
import NavDrawer from "../lib/NavDrawer";
import { trackDisplayName } from "../lib/languageNames";

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
  const [profileLoaded, setProfileLoaded] = useState(false);
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
        setProfileLoaded(true);
        router.push("/onboarding");
        return;
      }
      loadProfile(session.user.id)
        .then(setProfile)
        .catch((e) => console.error("failed to load profile", e))
        .finally(() => setProfileLoaded(true));
      loadAllProgress(session.user.id)
        .then((rows) => {
          const map = {};
          rows.forEach((r) => (map[r.track_id] = r));
          setProgressByTrack(map);
        })
        .catch((e) => console.error("failed to load progress", e));
    }
  }, [session, router]);

  if (session === undefined || session === null || !profileLoaded) {
    return (
      <div style={styles.wrap}>
        <p style={{ color: "#B4ABC9" }}>Loading…</p>
      </div>
    );
  }

  const nativeLang = session.user.user_metadata?.native_lang ?? null;
  const nativeCountry = session.user.user_metadata?.native_country ?? null;
  // Until a native language is set, show every track so the app is still usable.
  const tracks = nativeLang ? tracksForNativeLang(nativeLang, nativeCountry) : listTracks();
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
            <NavDrawer profile={profile} displayName={displayName} hasUnseenWhatsNew={hasUnseenWhatsNew} userEmail={session?.user?.email} />
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
            // #74: level is the headline; progress toward the next level is a
            // fill-only bar — no "x/100" style numbers anywhere (flat 100
            // XP/level stays permanent under the hood, so the fill is xp % 100).
            const xpFillPct = p ? p.xp % 100 : 0;
            const skillLabel = skillLevelInfo(p?.skill_level || "none").label;
            return (
              <button key={t.id} className="rj" style={styles.bubble} onClick={() => router.push(`/play/${t.id}`)}>
                <div style={styles.bubbleIconBg}>
                  <TrackIcon trackId={t.id} size={64} />
                </div>
                <div style={styles.bubbleContent}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{trackDisplayName(t, nativeLang)}</div>
                  <div className="jm" style={{ fontSize: 10.5, color: "#B4ABC9", marginTop: 2 }}>
                    {p ? `Level ${p.level || 1} · ${skillLabel}` : "Not started"}
                  </div>
                  {p && (
                    <div style={styles.bubbleXpBarOuter}>
                      <div style={{ ...styles.bubbleXpBarInner, width: `${xpFillPct}%` }} />
                    </div>
                  )}
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
    fontSize: 30,
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
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  bubbleWrap: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 },
  bubble: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    background: "rgba(34,30,51,0.9)",
    border: "1px solid #3A3452",
    borderRadius: 14,
    padding: "12px 14px",
    height: 64,
    color: "#F3F0FA",
    cursor: "pointer",
  },
  bubbleIconBg: {
    position: "absolute",
    top: "50%",
    right: -6,
    transform: "translateY(-50%)",
    opacity: 0.22,
    pointerEvents: "none",
  },
  bubbleContent: {
    position: "relative",
    zIndex: 1,
  },
  bubbleXpBarOuter: { width: "100%", height: 5, background: "#171423", borderRadius: 3, marginTop: 6, overflow: "hidden" },
  bubbleXpBarInner: { height: "100%", background: "linear-gradient(90deg, #FF8FB1, #B98EFF)", borderRadius: 3, transition: "width 0.3s" },
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

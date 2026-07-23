"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";
import { getTrack } from "../data/tracks";
import { loadProgress } from "./db";
import { uiLangForSkill, t } from "./playStrings";
import { trackDisplayName } from "./languageNames";
import SectionToggle from "./SectionToggle";

// Shared "Coming soon" page for the Listen and Speak sections (#67).
// Auth-guarded like every other track page (standing practice: any page on
// an auth-guarded route inherits the guard). Loads progress only to drive
// the skill-level native-language chrome rule, same as play/learn.
export default function ComingSoonSection({ trackId, section }) {
  const router = useRouter();
  const track = getTrack(trackId);

  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth");
        return;
      }
      if (!track) {
        router.push("/");
        return;
      }
      setSession(data.session);
      const p = await loadProgress(data.session.user.id, trackId);
      setProgress(p);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  if (!track) return null;

  const viewerNativeLang = session?.user?.user_metadata?.native_lang;

  if (!loaded || !progress) {
    return (
      <div style={{ ...styles.wrap, alignItems: "center" }}>
        <p style={{ color: "#9B93B8", fontSize: 14 }}>{t(viewerNativeLang || "en", "loading")}</p>
      </div>
    );
  }

  const uiLang = uiLangForSkill(progress.skill_level, viewerNativeLang, track);
  const T = (key, vars) => t(uiLang, key, vars);

  return (
    <div style={styles.wrap}>
      <div style={styles.col} className="fadein">
        <h1 className="rj" style={styles.title}>
          {trackDisplayName(track, viewerNativeLang)}
        </h1>

        <SectionToggle
          trackId={track.id}
          active={section}
          practiceLabel={T("sectionPractice")}
          listenLabel={T("sectionListen")}
          speakLabel={T("sectionSpeak")}
          soonLabel={T("soonTag")}
        />

        <div style={styles.card}>
          <p className="rj" style={styles.comingSoon}>
            {T("comingSoonTitle")}
          </p>
          <p style={styles.body}>{T(section === "listen" ? "comingSoonListenBody" : "comingSoonSpeakBody")}</p>
          <p style={styles.disclaimer}>{T("comingSoonDisclaimer")}</p>
          <a href="/about#whats-next" style={styles.link}>
            {T("seeWhatsPlanned")}
          </a>
        </div>

        <button className="rj" style={styles.backBtn} onClick={() => router.push(`/play/${track.id}`)}>
          {T("backToPractice")}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#171423",
  },
  col: { width: "100%", maxWidth: 480, display: "flex", flexDirection: "column" },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 14px", textAlign: "center" },
  card: {
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "26px 20px",
    textAlign: "center",
    marginTop: 8,
  },
  comingSoon: { fontSize: 20, fontWeight: 700, color: "#FF8FB1", margin: "0 0 10px" },
  body: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 12px" },
  disclaimer: { color: "#9B93B8", fontSize: 12, lineHeight: 1.5, margin: "0 0 14px" },
  link: { color: "#3DDBFF", textDecoration: "underline", fontSize: 12.5, fontWeight: 600 },
  backBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 16,
    alignSelf: "center",
  },
};

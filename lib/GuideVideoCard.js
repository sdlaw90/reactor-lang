"use client";

import { useState } from "react";

// "Watch the video tour" entry on /guide. Plays the Chapter 0 tutorial from the
// public `tutorial-video` Supabase bucket — same public-URL shape as tts-audio,
// derived from NEXT_PUBLIC_SUPABASE_URL so there's no hardcoded host.
//
// Bucket layout is lang/chapter/mode. Only the English co-host cut
// (`en/ch0/co.mp4`) is live today, so the VIDEO is always served in English for
// now; the `lang` prop localizes only the card CHROME (viewer's native_lang),
// with the badge saying "Español próximamente". Swap the video path to `lang`
// once localized cuts exist. es chrome strings pending native review (#41).
//
// The narrator-mode toggle (Co-hosts / Puck / Aoede solo) is intentionally
// omitted until those tracks lock (co-host is the only cut for every chapter
// today); when they do, add a mode switch here and swap `co` in the path.

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");

const VC_UI = {
  en: {
    kicker: "▶ 30-second tour",
    title: "Watch the video tour",
    sub: "Meet the app in half a minute — the fastest way in.",
    badge: "🔊 In English · Español next",
    close: "Close video",
    aria: "Watch the video tour",
  },
  es: {
    kicker: "▶ recorrido de 30 segundos",
    title: "Mira el video del recorrido",
    sub: "Conoce la app en medio minuto: la forma más rápida de empezar.",
    badge: "🔊 En inglés · Español próximamente",
    close: "Cerrar video",
    aria: "Mira el video del recorrido",
  },
  pt: {
    kicker: "▶ tour de 30 segundos",
    title: "Assista ao vídeo do tour",
    sub: "Conheça o app em meio minuto: o jeito mais rápido de começar.",
    badge: "🔊 Em inglês · Español em breve",
    close: "Fechar vídeo",
    aria: "Assista ao vídeo do tour",
  },
  fr: {
    kicker: "▶ visite de 30 secondes",
    title: "Regarde la vidéo de présentation",
    sub: "Découvre l’appli en trente secondes : le moyen le plus rapide de démarrer.",
    badge: "🔊 En anglais · Español bientôt",
    close: "Fermer la vidéo",
    aria: "Regarde la vidéo de présentation",
  },
  it: {
    kicker: "▶ tour di 30 secondi",
    title: "Guarda il video del tour",
    sub: "Scopri l’app in mezzo minuto: il modo più veloce per iniziare.",
    badge: "🔊 In inglese · Español in arrivo",
    close: "Chiudi il video",
    aria: "Guarda il video del tour",
  },
};

// Video path. Only the English cut exists today, so this is fixed to "en"
// regardless of UI language (the badge tells the user Spanish is coming).
function tourUrl(videoLang = "en") {
  if (!SUPABASE_URL) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/tutorial-video/${videoLang}/ch0/co.mp4`;
}

export default function GuideVideoCard({ lang = "en" }) {
  const [open, setOpen] = useState(false);
  const url = tourUrl("en"); // video stays English until localized cuts land
  const ui = VC_UI[lang] || VC_UI.en;
  if (!url) return null;

  return (
    <div style={styles.card}>
      {!open && (
        <button
          type="button"
          className="rj"
          style={styles.head}
          onClick={() => setOpen(true)}
          aria-label={ui.aria}
        >
          <span style={styles.thumb} aria-hidden="true">
            <span style={styles.play}>▶</span>
          </span>
          <span style={styles.headText}>
            <span style={styles.kicker}>{ui.kicker}</span>
            <span style={styles.title}>{ui.title}</span>
            <span style={styles.sub}>{ui.sub}</span>
            <span style={styles.badge}>{ui.badge}</span>
          </span>
        </button>
      )}

      {open && (
        <div style={styles.player}>
          <video
            src={url}
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={styles.video}
          />
          <button type="button" className="rj" style={styles.close} onClick={() => setOpen(false)}>
            {ui.close}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    marginTop: 16,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
  },
  head: {
    display: "flex",
    gap: 13,
    alignItems: "center",
    width: "100%",
    background: "transparent",
    border: "none",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
  },
  thumb: {
    position: "relative",
    width: 76,
    height: 135,
    flex: "0 0 auto",
    borderRadius: 10,
    border: "1px solid #3A3452",
    background: "radial-gradient(120% 90% at 50% 40%, #3a2650 0%, #221E33 60%, #171423 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  play: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(23,20,35,0.72)",
    border: "1.5px solid #FFA6BE",
    color: "#FFA6BE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    paddingLeft: 2,
  },
  headText: { display: "flex", flexDirection: "column", minWidth: 0 },
  kicker: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#3DDBFF",
    marginBottom: 5,
  },
  title: { fontSize: 16, fontWeight: 700, color: "#F3F0FA", marginBottom: 5, lineHeight: 1.2 },
  sub: { fontSize: 12.5, color: "#9B93B8", lineHeight: 1.45 },
  badge: {
    alignSelf: "flex-start",
    marginTop: 8,
    fontSize: 11,
    color: "#B4ABC9",
    background: "#171423",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "3px 9px",
  },
  player: { display: "flex", flexDirection: "column", alignItems: "center" },
  video: {
    width: 250,
    maxWidth: "82%",
    borderRadius: 14,
    border: "1px solid #3A3452",
    background: "#000",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  close: {
    marginTop: 12,
    background: "transparent",
    color: "#9B93B8",
    border: "1px solid #3A3452",
    borderRadius: 999,
    padding: "5px 14px",
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
  },
};

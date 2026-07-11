"use client";

import { useEffect } from "react";
import { Flame } from "lucide-react";

export default function StreakMilestoneCelebration({ milestone, onClose }) {
  useEffect(() => {
    if (!milestone) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} className="fadein" onClick={(e) => e.stopPropagation()}>
        <div style={styles.flameWrap}>
          <Flame size={56} color="#FF8FB1" strokeWidth={2.2} />
        </div>
        <h2 className="rj" style={styles.title}>
          {milestone.days}-Day Streak!
        </h2>
        <p style={styles.body}>You've practiced {milestone.days} days in a row. That's genuinely impressive — keep it going.</p>
        <div style={styles.xpPill}>+{milestone.bonusXP} bonus XP</div>
        <button className="rj" style={styles.closeBtn} onClick={onClose}>
          Nice!
        </button>
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
    padding: 20,
    background: "rgba(14,12,20,0.88)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    background: "#221E33",
    border: "1px solid #FF8FB1",
    borderRadius: 20,
    padding: "32px 26px",
    textAlign: "center",
    boxShadow: "0 0 50px rgba(255,143,177,0.25)",
  },
  flameWrap: { display: "flex", justifyContent: "center", marginBottom: 14 },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 10px" },
  body: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 18px" },
  xpPill: {
    display: "inline-block",
    background: "rgba(94,224,160,0.15)",
    color: "#5EE0A0",
    fontWeight: 800,
    fontSize: 15,
    padding: "8px 18px",
    borderRadius: 999,
    marginBottom: 22,
  },
  closeBtn: {
    width: "100%",
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 12,
    padding: "13px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};

"use client";

// Reusable step-card carousel for the intro tour. Renders one step at a time
// with a progress row (counter + clickable dots), a big emoji badge, title and
// body, and Back / Next controls. Used by both the standalone page (/guide) and
// the first-run overlay (lib/GuideOverlay.js) — the host supplies the
// background/framing; this component owns only the card and its controls.
//
// Props:
//   steps       – array of { emoji, title, body }
//   onDone      – called when the user finishes the last step (or taps the
//                 primary button on it)
//   onSkip      – called when the user skips out early; omit to hide Skip
//   doneLabel   – primary-button text on the final step (default "Let's go!")

import { useEffect, useState } from "react";
import GuideDemo from "./GuideDemo";

export default function GuideTour({ steps, onDone, onSkip, doneLabel = "Let's go!" }) {
  const [i, setI] = useState(0);
  const last = i === steps.length - 1;
  const step = steps[i];

  const next = () => (last ? onDone?.() : setI((n) => Math.min(steps.length - 1, n + 1)));
  const prev = () => setI((n) => Math.max(0, n - 1));

  // Keyboard: arrows to move, Escape to skip (when skipping is offered).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape" && onSkip) onSkip();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, steps.length]);

  return (
    <div style={styles.card}>
      <div style={styles.progressRow}>
        <span style={styles.counter}>
          Step {i + 1} of {steps.length}
        </span>
        <div style={styles.dots}>
          {steps.map((s, idx) => (
            <button
              key={idx}
              aria-label={`Go to step ${idx + 1}`}
              onClick={() => setI(idx)}
              style={{
                ...styles.dot,
                background: idx === i ? "#FF8FB1" : idx < i ? "#7E5C86" : "#3A3452",
                transform: idx === i ? "scale(1.35)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* key={i} re-mounts the body so the fade-in replays on every step */}
      <div key={i} className="fadein" style={styles.body}>
        {step.demo ? (
          <div style={styles.demoWrap}>
            <GuideDemo id={step.demo} />
          </div>
        ) : (
          <div style={styles.emojiBadge} aria-hidden="true">
            {step.emoji}
          </div>
        )}
        <h2 className="rj" style={styles.title}>
          {step.title}
        </h2>
        <p style={styles.text}>{step.body}</p>
      </div>

      <div style={styles.controls}>
        <button
          className="rj"
          style={{ ...styles.backBtn, visibility: i === 0 ? "hidden" : "visible" }}
          onClick={prev}
          aria-label="Previous step"
        >
          ← Back
        </button>
        <button className="rj" style={styles.nextBtn} onClick={next}>
          {last ? doneLabel + " →" : "Next →"}
        </button>
      </div>

      {onSkip && !last && (
        <button className="rj" style={styles.skipBtn} onClick={onSkip}>
          Skip the tour
        </button>
      )}
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 16,
    padding: "20px 22px 22px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 12,
  },
  counter: { color: "#9B93B8", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  dots: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "transform 0.15s, background 0.15s",
  },
  body: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  demoWrap: { width: "100%", marginBottom: 16 },
  emojiBadge: {
    width: 68,
    height: 68,
    borderRadius: "50%",
    background: "#171423",
    border: "1px solid #3A3452",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    lineHeight: 1,
    marginBottom: 16,
    flexShrink: 0,
  },
  title: { color: "#F3F0FA", fontSize: 20, fontWeight: 700, margin: "0 0 10px" },
  text: { color: "#B4ABC9", fontSize: 14, lineHeight: 1.6, margin: 0 },
  controls: { display: "flex", gap: 10, marginTop: 20 },
  backBtn: {
    background: "rgba(185,142,255,0.12)",
    color: "#B98EFF",
    border: "1px solid #B98EFF",
    borderRadius: 10,
    padding: "12px 18px",
    fontSize: 14.5,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  },
  nextBtn: {
    flex: 1,
    background: "#FF8FB1",
    color: "#171423",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  skipBtn: {
    display: "block",
    width: "100%",
    background: "transparent",
    color: "#9B93B8",
    border: "none",
    fontSize: 13,
    cursor: "pointer",
    marginTop: 12,
    textDecoration: "underline",
  },
};

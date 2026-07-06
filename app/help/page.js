"use client";

import { useRouter } from "next/navigation";
import { Settings, BarChart2, HelpCircle } from "lucide-react";

export default function HelpPage() {
  const router = useRouter();

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          How SquirreLingo works
        </h1>

        <Section title="Home screen icons">
          <IconRow icon={<BarChart2 size={16} />} label="Dashboard" text="Your total XP, streak, and rounds across every language, plus a breakdown per language." />
          <IconRow icon={<Settings size={16} />} label="Settings" text="Change your username, email, password, native language, native country, and profile picture." />
          <IconRow icon={<HelpCircle size={16} />} label="Help" text="This page." />
        </Section>

        <Section title="Choosing what to learn">
          <P>
            Your <b>native language</b> (set in Settings) decides which languages show up as bubbles to learn — English
            speakers see Spanish tracks, Spanish speakers see English tracks. Your <b>native country</b> is separate: it
            just personalizes the little flag/region tag shown on the home screen (e.g. Spanish + Venezuela shows
            "Español (Latinoamérica)").
          </P>
          <P>Tap any bubble to start practicing that language. Each language tracks its own progress independently.</P>
        </Section>

        <Section title="Playing a round">
          <P>Each round mixes several question types — you'll see a colored tag on each question card showing which type it is (vocabulary, verbs/grammar, translation, or phonetics).</P>
          <P>You get 30 seconds per question, no penalty for wrong answers — just answer and move on. A combo counter (⚡) builds as you chain correct answers in a row, and resets on a miss (with no other penalty).</P>
          <P><b>Phonetics questions</b> show a written respelling of how a phrase sounds (CAPS = stressed syllable, ‿ = words that blend together in fast speech) instead of real audio, so it works everywhere without needing sound.</P>
        </Section>

        <Section title="Missed questions & review">
          <P>Anything you get wrong gets added to a "Repasar fallos" (review missed) pile, shown on the start screen. Practicing that pile removes each question once you get it right — no time pressure, since it's about closing gaps, not speed.</P>
        </Section>

        <Section title="Explanations & archive">
          <P>Every question you've ever answered — right or wrong — gets logged with a bilingual (EN/ES) explanation of the correct answer, viewable anytime from the round-result screen. Older entries move to an "Archivo" section automatically so the main list stays fast to scroll — nothing is ever deleted unless you choose to clear it.</P>
        </Section>

        <Section title="Skill levels & placement quiz">
          <P>
            Each language track has its own skill level: No experience, Beginner, Intermediate, Advanced, or Native. This
            is based on the real CEFR framework used by actual language certifications — rounds are biased toward
            questions matching your level, without ever running short on content.
          </P>
          <P>Answer consistently well at your current level and you'll be offered a chance to advance. Not sure where you stand? Take the short, untimed <b>placement quiz</b> from that language's start screen.</P>
        </Section>

        <Section title="Profile picture & identity">
          <P>In Settings → Profile picture, choose a photo upload, a generic fun icon, or a country flag as your avatar. Your username (if you've set one) shows on the home screen instead of your email.</P>
        </Section>

        <Section title="Account & security">
          <P>You can sign in with either your email or a username. Changing your email or password requires re-entering your current password first, and changing your password automatically signs out any other devices you're logged into, for security. You'll also get an email notification whenever your username, email, or password changes.</P>
        </Section>

        <Section title="Updates">
          <P>A small "v1.x.x" tag at the bottom of the home screen links to the full changelog. If a new version is deployed while you're using the app, you'll see a popup — you can reload right away or finish what you're doing first.</P>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={styles.p}>{children}</p>;
}

function IconRow({ icon, label, text }) {
  return (
    <div style={styles.iconRow}>
      <div style={styles.iconBadge}>{icon}</div>
      <div>
        <span style={{ fontWeight: 700, color: "#F3F0FA" }}>{label}</span>
        <p style={{ ...styles.p, marginTop: 2 }}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", justifyContent: "center", padding: "40px 20px", background: "#171423" },
  backBtn: {
    background: "transparent",
    color: "#B4ABC9",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 20px" },
  section: { background: "#221E33", border: "1px solid #3A3452", borderRadius: 12, padding: "16px 18px", marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#FF8FB1", margin: "0 0 10px" },
  p: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 8px" },
  iconRow: { display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#171423",
    border: "1px solid #3A3452",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#F3F0FA",
    flexShrink: 0,
  },
};

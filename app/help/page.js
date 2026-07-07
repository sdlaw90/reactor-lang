"use client";

import { useRouter } from "next/navigation";

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
        <p style={{ color: "#7C7395", fontSize: 12.5, marginTop: -8, marginBottom: 20 }}>
          Looking for the bigger picture instead? See the{" "}
          <a href="/about" style={{ color: "#3DDBFF", textDecoration: "underline" }}>
            About page
          </a>
          .
        </p>

        <Section title="The menu (tap your profile picture)">
          <P>
            Your profile picture, top-right of the home screen, opens a slide-out menu with everything that
            used to be spread across separate icons: <b>What's New</b> (a dot appears when there's a release
            you haven't seen yet), <b>Help</b> (this page), and <b>Dashboard</b> (your total XP, streak, and
            rounds across every language). Below a divider, the full <b>Settings</b> section sits right there
            too — username, email, password, native language/country, profile picture, gameplay preferences —
            no extra tap needed to open it.
          </P>
        </Section>

        <Section title="Choosing what to learn">
          <P>
            Your <b>native language</b> (set in Settings) decides which languages show up as bubbles to learn — for
            example, English speakers see Spanish tracks, Spanish speakers see English tracks, and more language pairs
            keep getting added over time. Each bubble's name shows in your native language too (e.g. "Italian" rather
            than "Italiano") — no need to recognize a language from its flag or name in its own script. Your
            <b> native country</b> is separate — it just personalizes the badge in the top icon row.
          </P>
          <P>Each language bubble shows your current skill level and XP progress toward the next one. Tap any bubble to start practicing that language — progress is tracked independently per language.</P>
        </Section>

        <Section title="Two ways to practice: Quick Quiz vs. Lessons">
          <P>
            <b>Quick Quiz</b> is the original game-style mode — short, randomly mixed rounds with a timer,
            combo scoring, and streaks. <b>Lessons</b> is a calmer alternative — no timer, no combo pressure,
            walking through one topic at a time (easiest items first), showing the explanation right after
            each answer. Switch between them any time using the link at the bottom of either mode's start
            screen — both count toward the same XP, level, and mastery progress, so nothing is lost by
            switching.
          </P>
        </Section>

        <Section title="Category picker (Quick Quiz mode)">
          <P>Before starting a round, mix and match any combination of categories to focus on (vocabulary, grammar, translation, phonetics — any subset), or leave it on the "Mixed" option for the default blend of everything (its label shows in whichever language your other buttons are currently in). Picking it clears any specific selections back to the full mix. In Lessons mode, you pick one topic at a time instead — see the mode explanation above.</P>
        </Section>

        <Section title="Language switches with your skill level">
          <P>On each language's play page, the on-screen buttons/labels/stats show in your <b>native language</b> while you're at No experience, Beginner, or Intermediate — no need to read instructions in a language you don't know yet. Once you reach Advanced or Native, that same chrome switches to the <b>language you're learning</b>, since by then reading it is good practice.</P>
        </Section>

        <Section title="Playing a round">
          <P>Each round mixes several question types — you'll see a colored tag on each question card showing which type it is.</P>
          <P>You get a set number of seconds per question (adjustable in Settings → Gameplay), no penalty for wrong answers — just answer and move on. A combo counter (⚡) builds as you chain correct answers in a row, and resets on a miss with no other penalty.</P>
          <P><b>Phonetics questions</b> show a written respelling of how a phrase sounds (CAPS = stressed syllable, ‿ = words that blend together in fast speech) instead of real audio, so it works everywhere without needing sound.</P>
          <P>Right and wrong answers are deliberately hard to miss — a green pulse for correct, a red shake for wrong.</P>
        </Section>

        <Section title="Review mode">
          <P>Turn this on in Settings → Gameplay to pause after each answer, read the bilingual explanation right there on the card, and tap "Next" whenever you're ready — instead of auto-advancing after less than a second.</P>
        </Section>

        <Section title="Missed questions & review">
          <P>Anything you get wrong gets added to a "Repasar fallos" (review missed) pile, shown on the start screen. Practicing that pile removes each question once you get it right — no time pressure, since it's about closing gaps, not speed.</P>
        </Section>

        <Section title="Explanations & archive">
          <P>Every question you've ever answered — right or wrong — gets logged with an explanation of the correct answer in both your native language and the language you're learning, viewable anytime from the round-result screen. Older entries move to an "Archivo" section automatically so the main list stays fast to scroll — nothing is ever deleted unless you choose to clear it.</P>
        </Section>

        <Section title="Mastery tracker">
          <P>Each language's start screen has a "Progress by category" card — tap "View details" to see how many items you've learned vs. the total that exist for each category, plus a breakdown by difficulty level so progress shows in smaller chunks instead of one big number. "Learned" means you've seen it and it's not currently sitting in your missed-questions pile. Note: the total is based on this app's own content for that track, not an external word-frequency list — starter-set tracks will show smaller totals until more content gets added.</P>
        </Section>

        <Section title="Skill levels & placement quiz">
          <P>
            Each language track has its own skill level: No experience, Beginner, Intermediate, Advanced, or Native —
            based on the real CEFR framework used by actual language certifications. Rounds are biased toward
            questions matching your level, without ever running short on content.
          </P>
          <P>Answer consistently well at your current level and you'll be offered a chance to advance. Not sure where you stand? Take the short, untimed <b>placement quiz</b> from that language's start screen — it samples questions across all six CEFR tiers (A1 through C2) that the track has content for, so it can place true beginners and advanced learners accurately, not just people in the middle.</P>
        </Section>

        <Section title="Gameplay settings">
          <P>In Settings → Gameplay: turn review mode on/off, adjust how many questions come from each category per round, how many phonetics pairs appear, and the per-question timer — either one shared time limit or separate limits for regular questions vs. phonetics.</P>
        </Section>

        <Section title="Feedback">
          <P>Found a bug, or have an idea? Settings → Feedback has a short in-app form — it goes straight to the developer, no external site required.</P>
        </Section>

        <Section title="Account & security">
          <P>Sign in with either your email or username. Changing your email or password requires re-entering your current password first, and changing your password automatically signs out any other devices you're logged into, for security. You'll also get an email notification whenever your username, email, or password changes.</P>
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
      {icon && <div style={styles.iconBadge}>{icon}</div>}
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
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
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

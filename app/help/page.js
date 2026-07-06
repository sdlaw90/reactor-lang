"use client";

import { useRouter } from "next/navigation";
import { Settings, BarChart2 } from "lucide-react";

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
          <IconRow label="Native language badge" text='A small pill (top-left of the icon row) showing your native country code and flag — e.g. "US 🇺🇸". Tap it to change your native language/country in Settings.' />
          <IconRow label="What's New (!)" text="Shows the latest release's notes. A red dot appears whenever there's a version you haven't seen yet, and clears once you open it." />
          <IconRow icon={<BarChart2 size={16} />} label="Dashboard" text="Your total XP, streak, and rounds across every language, plus a breakdown per language." />
          <IconRow label="User Settings" text="Your profile picture opens Settings — username, email, password, native language/country, profile picture, and gameplay preferences." icon={<Settings size={16} />} />
        </Section>

        <Section title="Signing up & usernames">
          <P>
            Usernames are required — type one and tap <b>Verify</b>; if it's taken, you'll see a few genuinely-available
            alternatives to pick from with one tap. If you ever end up signed in without a username (an older account,
            for instance), you'll get a one-time popup requiring you to set one before continuing anywhere else.
          </P>
          <P>First time signing up? A short guided setup walks you through native language (required), native country, and profile picture (both optional, changeable later in Settings).</P>
        </Section>

        <Section title="Choosing what to learn">
          <P>
            Your <b>native language</b> (set in Settings) decides which languages show up as bubbles to learn — for
            example, English speakers see Spanish tracks, Spanish speakers see English tracks, and more language pairs
            keep getting added over time. Your <b>native country</b> is separate — it just personalizes the badge in
            the top icon row.
          </P>
          <P>Each language bubble shows your current skill level and XP progress toward the next one. Tap any bubble to start practicing that language — progress is tracked independently per language.</P>
        </Section>

        <Section title="Category picker">
          <P>Before starting a round, mix and match any combination of categories to focus on (vocabulary, grammar, translation, phonetics — any subset), or leave it on "Mixto" for the default blend of everything. Picking "Mixto" clears any specific selections back to the full mix.</P>
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
          <P>Answer consistently well at your current level and you'll be offered a chance to advance. Not sure where you stand? Take the short, untimed <b>placement quiz</b> from that language's start screen.</P>
        </Section>

        <Section title="Gameplay settings">
          <P>In Settings → Gameplay: turn review mode on/off, adjust how many questions come from each category per round, how many phonetics pairs appear, and the per-question timer — either one shared time limit or separate limits for regular questions vs. phonetics.</P>
        </Section>

        <Section title="Settings, organized">
          <P>Settings is grouped into <b>Profile</b> (picture, username), <b>Account</b> (email, password), <b>Language & Learning</b> (native language/country, gameplay preferences), and <b>Subscription</b> (reserved for later). Terms of Service and Privacy Policy links live in the Settings footer, just above the version tag, if you need to re-review either.</P>
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

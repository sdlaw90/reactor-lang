"use client";

import BackHome from "../../lib/BackHome";
import { FACEBOOK_GROUP_URL } from "../../lib/community";

export default function HelpPage() {
  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <BackHome />
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

        <Section title="Finding Help and the menu">
          <P>
            The <b>?</b> button in the top-right corner of the home screen opens this Help page anytime —
            it's right there so you never have to go hunting for it.
          </P>
          <P>
            Next to it, your <b>profile picture</b> opens a slide-out menu with everything else: <b>What's New</b>
            (a dot appears when there's a release you haven't seen yet), <b>About</b> (what the app is, how both
            modes work, and what's planned next), and <b>Dashboard</b> (your total XP, streak, and rounds across
            every language). Below a divider, the full <b>Settings</b> section sits right there too — username,
            email, password, native language/country, profile picture, gameplay preferences — no extra tap
            needed to open it.
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

        <Section title="Listen & Speak (coming soon)">
          <P>
            Above the Quick Quiz / Lessons toggle you'll also see a <b>Practice / Listen / Speak</b> switch.
            Practice is everything the app does today. Listening and speaking practice aren't built yet — those
            two tabs are marked "Soon" and open a short Coming Soon page for now, so you can see where the app
            is headed. The About page has a fuller "What's next" list.
          </P>
        </Section>

        <Section title="Category picker (Quick Quiz mode)">
          <P>Before starting a round, mix and match any combination of categories to focus on (vocabulary, grammar, translation, phonetics — any subset), or leave it on the "Mixed" option for the default blend of everything (its label shows in whichever language your other buttons are currently in). Picking it clears any specific selections back to the full mix. In Lessons mode, you pick one topic at a time instead — see the mode explanation above.</P>
          <P>Some tracks also carry a <b>Word Bank</b> category ("Palabras" / "Mots") — a large layer of the language's most frequent words. It joins the mix like any other category, but the default blend caps how much of a round it can take up, so it never crowds out grammar, expressions, or phonetics.</P>
        </Section>

        <Section title="Language switches with your skill level">
          <P>On each language's play page, the on-screen buttons/labels/stats show in your <b>native language</b> while you're at No experience, Beginner, or Intermediate — no need to read instructions in a language you don't know yet. Once you reach Advanced or Native, that same chrome switches to the <b>language you're learning</b>, since by then reading it is good practice.</P>
          <P>Questions themselves follow the same rule where available: the question appears in the language you're learning, with a small <b>translation in your native language</b> right underneath while you're at the lower skill levels — so you always know what's being asked without the translation ever giving away the answer. At Advanced/Native the subtitle disappears along with the rest of the native-language chrome. Translations are being added track by track alongside the deeper-content passes, starting with Latin American Spanish.</P>
        </Section>

        <Section title="Playing a round">
          <P>Each round mixes several question types — you'll see a colored tag on each question card showing which type it is.</P>
          <P>You get a set number of seconds per question (adjustable in Settings → Gameplay), no penalty for wrong answers — just answer and move on. A combo counter (⚡) builds as you chain correct answers in a row, and resets on a miss with no other penalty.</P>
          <P><b>Phonetics questions</b> show a written respelling of how a phrase sounds (CAPS = stressed syllable, ‿ = words that blend together in fast speech) instead of real audio, so it works everywhere without needing sound.</P>
          <P><b>Question audio</b>: on tracks where audio has been recorded (Latin American Spanish so far), a speaker button appears beside the question — tap to hear it read aloud in the track's own dialect, tap again to stop. It never plays on its own, and the timer keeps running while it plays. All speaker buttons can be turned off in Settings → Gameplay.</P>
          <P>Right and wrong answers are deliberately hard to miss — a green pulse for correct, a red shake for wrong.</P>
        </Section>

        <Section title="Review mode">
          <P>Turn this on in Settings → Gameplay to pause after each answer, read the bilingual explanation right there on the card, and tap "Next" whenever you're ready — instead of auto-advancing after less than a second.</P>
        </Section>

        <Section title="Missed questions & review">
          <P>Anything you get wrong gets added to a "Repasar fallos" (review missed) pile, shown on the start screen. Practicing that pile removes each question once you get it right — no time pressure, since it's about closing gaps, not speed.</P>
        </Section>

        <Section title="Explanations & archive">
          <P>Every question you've ever answered — right or wrong — gets logged with an explanation of the correct answer, viewable anytime from the round-result screen. Explanations currently show in English and Spanish specifically (not yet your actual native + target language for tracks outside that pair — a known limitation, on the roadmap to fix). Older entries move to an "Archivo" section automatically so the main list stays fast to scroll — nothing is ever deleted unless you choose to clear it.</P>
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

        <Section title="Alphabet / writing-system mode">
          <P>Tracks whose language uses a different writing system have a third mode next to Quick Quiz and Lessons. Japanese gets hiragana and katakana, Korean gets hangul (with a sampler of real syllable blocks), Russian gets Cyrillic (grouped by how letters relate to the Latin alphabet — false friends defused early), and Mandarin gets a foundational character set with pinyin and meanings. Each offers full reference charts plus short practice quizzes in both directions (see the symbol, pick the sound — and vice versa). It's entirely optional and never required: no timer, no XP, nothing to lose. Symbols you've answered correctly show green in the charts so you can watch the unfamiliar ones shrink. Japanese kanji isn't part of this (that's a much longer journey) — every question in the app shows romanized readings alongside, so these basics are all you need to play.</P>
        </Section>

        <Section title="Gameplay settings">
          <P>In Settings → Gameplay: turn review mode on/off, adjust how many questions come from each category per round, how many phonetics pairs appear, and the per-question timer — either one shared time limit or separate limits for regular questions vs. phonetics — and turn question audio on or off.</P>
        </Section>

        <Section title="Feedback">
          <P>Found a bug? Settings → "Report a bug" — a quick one-box form where you can also attach a screenshot and an error code (if something crashes, the error screen shows a code like SQ-XXXXXX; the form fills it in for you automatically). Have an idea instead? Settings → "Suggest a feature". Both go straight to the developer, no external site required. Know someone who'd like to help test? They can apply at /beta-apply (about 3 minutes), no account needed.</P>
          <P>There's also a <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#FF8FB1" }}>SquirreLingo Facebook group</a> for release news and community chat — private during the beta, so request to join and you'll be approved.</P>
        </Section>

        <Section title="Account & security">
          <P>Sign in with either your email or username. Changing your email or password requires re-entering your current password first, and changing your password automatically signs out any other devices you're logged into, for security. You'll also get an email notification whenever your username, email, or password changes.</P>
          <P>Forgot your password? The reset page walks you through your security questions — answer 2 of 3 correctly and you can set a new password on the spot. Set them up (plus an optional password hint) in Settings → Password recovery, or when you first apply for the beta. Without questions on file, resets go through an admin request instead, which can take a while — setting up the questions is strongly recommended.</P>
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

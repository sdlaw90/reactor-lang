"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          About SquirreLingo
        </h1>
        <p style={styles.tagline}>Fast, ADHD-friendly language practice — with a more traditional option too.</p>

        <Section title="What this app is">
          <P>
            SquirreLingo is a language-practice app built around short, low-pressure rounds of questions —
            vocabulary, grammar, idioms, and pronunciation — rather than long, rigid lesson paths. Pick a
            language, answer a handful of questions, see how you did, and stop whenever you want. There's no
            requirement to finish a full "lesson" in one sitting.
          </P>
        </Section>

        <Section title="Two ways to practice">
          <P>
            <b>Quick Quiz</b> is the original, game-style mode — short, randomly mixed rounds with a timer,
            combo scoring, and streaks. Built for quick, low-friction practice in small bursts.
          </P>
          <P>
            <b>Lessons</b> is a calmer, step-by-step mode — no timer, no combo pressure. It walks you through
            one topic at a time, easiest first, showing the explanation right after each answer so you can
            actually absorb it before moving on. A better fit if you'd rather work through material
            methodically than in quick random bursts.
          </P>
          <P>Both modes track the same overall progress, so switching between them never resets anything.</P>
        </Section>

        <Section title="Skill levels & the placement quiz">
          <P>
            Content is tagged by difficulty (beginner through advanced). If you're not sure where you stand,
            each language has a short placement quiz that recommends a starting level for you.
          </P>
        </Section>

        <Section title="Tracking your progress">
          <P>
            The Dashboard shows your XP, streak, and rounds across every language. Each language's own screen
            also has a mastery tracker showing how much of that language's content you've actually learned,
            category by category.
          </P>
        </Section>

        <Section title="Multiple languages, real dialect differences">
          <P>
            Where a language has genuinely different regional versions — Latin American vs. European
            Spanish, US vs. UK English, France vs. Canadian French, Brazilian vs. European Portuguese — this
            app treats them as separate tracks with real content differences, not the same material with a
            different flag.
          </P>
        </Section>

        <div id="whats-next">
          <Section title="What's next">
            <P>
              A peek at what we're working on. No dates, no promises — things ship when they're ready.
            </P>

            <p style={styles.bucketLabel}>In progress</p>
            <RoadmapItem badge title="Way more questions per language">
              Deeper content for every track, all the way up to advanced levels.
            </RoadmapItem>
            <RoadmapItem badge title="Translations under questions">
              See what a question means in your language while you're still learning.
            </RoadmapItem>

            <p style={styles.bucketLabel}>Coming soon</p>
            <RoadmapItem title="Mastery quizzes and star rankings">
              Prove you've truly mastered a category and earn stars for it.
            </RoadmapItem>
            <RoadmapItem title="Alphabet and writing-system lessons">
              Learn kana, hangul, Cyrillic, and Chinese characters from scratch.
            </RoadmapItem>
            <RoadmapItem title="Explanations in your language">
              Answer explanations in both your native and target language.
            </RoadmapItem>

            <p style={styles.bucketLabel}>Down the road</p>
            <RoadmapItem title="Listening and speaking practice">
              Hear it, say it — a whole new way to practice.
            </RoadmapItem>
            <RoadmapItem title="SquirreLingo in more languages">
              Learn from your native language, not just English.
            </RoadmapItem>
            <RoadmapItem title="App store apps">
              SquirreLingo on Google Play and the App Store.
            </RoadmapItem>
          </Section>
        </div>

        <p style={styles.footer}>
          Questions about how something specific works? The <a href="/help" style={styles.link}>Help page</a>{" "}
          has a full walkthrough of every screen and icon. Found a bug, or have an idea? There's a{" "}
          <a href="/feedback" style={styles.link}>feedback form</a> for that too. Know someone who'd like to{" "}
          <a href="/beta-apply" style={styles.link}>apply to beta test</a>?
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
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

function RoadmapItem({ title, badge, children }) {
  return (
    <div style={styles.roadmapItem}>
      <p style={styles.roadmapTitle}>
        {title}
        {badge && <span style={styles.rollingOutBadge}>Rolling out</span>}
      </p>
      <p style={styles.roadmapDesc}>{children}</p>
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
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 6px" },
  tagline: { color: "#B98EFF", fontSize: 13.5, fontWeight: 600, marginBottom: 24 },
  sectionTitle: { fontSize: 15.5, fontWeight: 700, color: "#FF8FB1", margin: "0 0 8px" },
  p: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 8px" },
  bucketLabel: { color: "#B98EFF", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, margin: "14px 0 6px" },
  roadmapItem: {
    background: "#1F1B30",
    border: "1px solid #2B2740",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 8,
  },
  roadmapTitle: { color: "#F3F0FA", fontSize: 13.5, fontWeight: 700, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rollingOutBadge: {
    background: "rgba(61,219,255,0.12)",
    color: "#3DDBFF",
    border: "1px solid rgba(61,219,255,0.35)",
    borderRadius: 999,
    padding: "1px 8px",
    fontSize: 10,
    fontWeight: 700,
  },
  roadmapDesc: { color: "#B4ABC9", fontSize: 12.5, lineHeight: 1.5, margin: 0 },
  footer: { color: "#7C7395", fontSize: 12.5, lineHeight: 1.6, marginTop: 8 },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

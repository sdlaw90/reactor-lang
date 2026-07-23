"use client";

import BackHome from "../../lib/BackHome";
import { FACEBOOK_GROUP_URL } from "../../lib/community";

export default function AboutPage() {
  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <BackHome />
        <h1 className="rj" style={styles.title}>
          About SquirreLingo
        </h1>
        <p style={styles.tagline}>Fast, ADHD-friendly language practice — with a more traditional option too.</p>

        <Section title="What this app is">
          <P>
            SquirreLingo is a language-practice app built around short, low-pressure rounds of questions —
            vocabulary, grammar, idioms, and pronunciation — rather than long, rigid lesson paths. Pick a
            language, answer a handful of questions, see how you did, and stop whenever you want. There's no
            requirement to finish a full "lesson" in one sitting. It's a progressive web app, so it runs right
            in your browser on your phone or computer — nothing to download.
          </P>
        </Section>

        <Section title="Ways to practice">
          <P>
            <b>Quick Quiz</b> is the original, game-style mode — short, randomly mixed rounds with a timer,
            combo scoring, and streaks. Built for quick, low-friction practice in small bursts.
          </P>
          <P>
            <b>Lessons</b> is a calmer, step-by-step mode — no timer, no combo pressure. It walks you through
            one topic at a time, easiest first, showing the explanation right after each answer so you can
            actually absorb it before moving on. A better fit if you'd rather work through material
            methodically than in quick random bursts. Both modes track the same overall progress, so switching
            between them never resets anything.
          </P>
          <P>
            On top of those, most tracks add two focused trainers reachable from the same mode switch:
            <b> Grammar Gym</b>, a standalone conjugation drill that keeps its own progress and never touches
            your level or streak, and an <b>Alphabet</b> mode for learning a new writing system — kana, hangul,
            Cyrillic, or Chinese characters — from scratch.
          </P>
        </Section>

        <Section title="Skill levels & the placement quiz">
          <P>
            Every track uses the real CEFR framework that actual language certifications use, with skill levels
            running from No experience through Beginner, Intermediate, Advanced, and Native (A1–C2). Not sure
            where you stand? Each language has a short, untimed placement quiz that samples every tier the track
            has content for, so it can place true beginners and advanced learners alike.
          </P>
        </Section>

        <Section title="Tracking your progress">
          <P>
            Each language's own screen has a mastery tracker showing how much of that language's content
            you've actually learned, category by category, along with your XP and streak as you play.
          </P>
        </Section>

        <Section title="Multiple languages, real dialect differences">
          <P>
            For English speakers, SquirreLingo teaches nine languages — Spanish, French, Portuguese, Italian,
            German, Russian, Japanese, Mandarin Chinese, and Korean — several with genuinely different regional
            versions (Latin American vs. European Spanish, France vs. Québécois French, Brazilian vs. European
            Portuguese), for twelve distinct tracks in all. Where a language has real regional differences, this
            app treats them as separate tracks with different content, not the same material behind a different
            flag. Learning English is available too, for Spanish- and Italian-speaking users, with more
            native-language pairings on the way.
          </P>
          <P>
            Languages with their own writing system always show native script and its romanization together —
            kanji with romaji, hangul, Chinese characters with pinyin. And for German, Russian, Japanese,
            Korean, and Mandarin, the grammar questions are built by in-house engines, so every verb form is
            machine-verified for correctness rather than hand-typed.
          </P>
        </Section>

        <Section title="Honest about what's human-checked">
          <P>
            Building this much content quickly means some of it is still awaiting a native-speaker review.
            Rather than hide that, tracks still in that queue carry a small "Community review in progress" note,
            so you always know which languages have been human-reviewed and which haven't yet. The note
            disappears once a track's review is logged.
          </P>
        </Section>

        <div id="whats-next">
          <Section title="What's next">
            <P>
              A peek at what we're working on. No dates, no promises — things ship when they're ready.
            </P>

            <p style={styles.bucketLabel}>In progress</p>
            <RoadmapItem badge title="Translations under questions">
              See what a question means in your language while you're still learning — expanding track by track.
            </RoadmapItem>
            <RoadmapItem badge title="SquirreLingo in more languages">
              Learn from your native language, not just English — more source languages are rolling out.
            </RoadmapItem>

            <p style={styles.bucketLabel}>Coming soon</p>
            <RoadmapItem title="Mastery quizzes and star rankings">
              Prove you've truly mastered a category and earn stars for it.
            </RoadmapItem>
            <RoadmapItem title="Explanations in your language">
              Answer explanations in both your native and target language, not just English and Spanish.
            </RoadmapItem>

            <p style={styles.bucketLabel}>Down the road</p>
            <RoadmapItem title="Listening and speaking practice">
              Hear it, say it — a whole new way to practice.
            </RoadmapItem>
            <RoadmapItem title="App store apps">
              SquirreLingo on Google Play and the App Store.
            </RoadmapItem>
          </Section>
        </div>

        <Section title="Join the community">
          <P>
            SquirreLingo has a Facebook group — release news, tips, and a place to talk with other beta testers{" "}
            (and the developer) directly. It&apos;s a private group during the beta, so hit{" "}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Join Group
            </a>{" "}
            and you&apos;ll be approved.
          </P>
        </Section>

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
  footer: { color: "#9B93B8", fontSize: 12.5, lineHeight: 1.6, marginTop: 8 },
  link: { color: "#3DDBFF", textDecoration: "underline" },
};

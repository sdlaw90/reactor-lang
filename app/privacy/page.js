"use client";

import { useRouter } from "next/navigation";
import { LEGAL_VERSION } from "../../lib/legalVersions";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <button className="rj" style={styles.backBtn} onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="rj" style={styles.title}>
          Privacy Policy
        </h1>
        <p style={styles.meta}>Version {LEGAL_VERSION} — Last updated: [DATE]</p>

        <Notice />

        <Section title="1. What we collect">
          Account info (email, username, password — stored securely, never in plain text), profile picture (if
          you upload one), your native language and country (if set), and your learning activity (answers,
          scores, streaks, skill level) so the app can track your progress.
        </Section>

        <Section title="2. How we use it">
          To run your account, track and personalize your learning progress, send you security notifications
          (password/email changes), and — only if you've explicitly enabled email notifications for
          them — let you know about account changes.
        </Section>

        <Section title="3. Third-party services we use">
          <b>Supabase</b> for account authentication and data storage. <b>Vercel</b> for hosting. <b>Resend</b>{" "}
          (if configured) for sending security notification emails. <b>flagcdn.com</b> for flag images shown
          in the app. We don't sell your data, and we don't share it with advertisers.
        </Section>

        <Section title="4. Data retention">
          We keep your account data for as long as your account is active. If you request account deletion,
          we'll remove your personal data within a reasonable time, except where we're required to retain it
          by law.
        </Section>

        <Section title="5. Your rights">
          You can access, correct, or delete most of your account information yourself in Settings. To request
          full account deletion or a copy of your data, contact [YOUR CONTACT EMAIL].
        </Section>

        <Section title="6. Children's privacy">
          The Service isn't directed at children under [MINIMUM AGE, e.g. 13], and we don't knowingly collect
          data from children under that age.
        </Section>

        <Section title="7. Security">
          We use industry-standard practices (via our infrastructure provider) to protect your data, but no
          method of storage or transmission is 100% secure.
        </Section>

        <Section title="8. Changes to this policy">
          We may update this policy from time to time. Material changes will require you to re-acknowledge
          the updated policy before continuing to use the Service.
        </Section>

        <Section title="9. Contact">
          Questions about this policy? Contact [YOUR CONTACT EMAIL].
        </Section>
      </div>
    </div>
  );
}

function Notice() {
  return (
    <div style={styles.notice}>
      This is standard template language, not a substitute for legal advice. Review and customize the
      bracketed placeholders — and have a lawyer review this before relying on it with real users.
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 className="rj" style={styles.sectionTitle}>
        {title}
      </h2>
      <p style={styles.p}>{children}</p>
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
  title: { fontSize: 24, fontWeight: 700, color: "#F3F0FA", margin: "0 0 4px" },
  meta: { color: "#7C7395", fontSize: 12, marginBottom: 16 },
  notice: {
    background: "#241B36",
    border: "1px solid #B98EFF",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#E4D6FF",
    fontSize: 12.5,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 14.5, fontWeight: 700, color: "#FF8FB1", margin: "0 0 6px" },
  p: { color: "#B4ABC9", fontSize: 13.5, lineHeight: 1.6, margin: 0 },
};

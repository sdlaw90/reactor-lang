"use client";

import { LEGAL_VERSION } from "../../lib/legalVersions";
import BackHome from "../../lib/BackHome";

export default function TermsPage() {
  return (
    <div style={styles.wrap}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <BackHome />
        <h1 className="rj" style={styles.title}>
          Terms of Service
        </h1>
        <p style={styles.meta}>Version {LEGAL_VERSION} — Last updated: [DATE]</p>

        <Notice />

        <Section title="1. Acceptance of terms">
          By creating an account or using SquirreLingo ("the Service"), you agree to these Terms of Service and
          our Privacy Policy. If you don't agree, please don't use the Service.
        </Section>

        <Section title="2. Description of service">
          SquirreLingo is a language-learning application. Features, content, and languages offered may change,
          be added, or be removed at any time without notice.
        </Section>

        <Section title="3. Accounts">
          You must provide accurate information when creating an account, including a unique username and a
          valid email address. You're responsible for keeping your password secure and for all activity under
          your account. You must be at least [MINIMUM AGE, e.g. 13] years old to use the Service, or the
          applicable minimum age in your country if higher.
        </Section>

        <Section title="4. Acceptable use">
          You agree not to: use the Service for any unlawful purpose; attempt to gain unauthorized access to
          any part of the Service or other users' accounts; upload profile pictures or content that is
          abusive, obscene, or infringes on someone else's rights; or interfere with the normal operation of
          the Service.
        </Section>

        <Section title="5. Your content">
          You retain ownership of any content you upload (such as a profile photo). By uploading it, you grant
          us a limited license to store and display it back to you within the Service. You're responsible for
          making sure you have the right to upload whatever you upload.
        </Section>

        <Section title="6. Intellectual property">
          The Service's design, code, and learning content are owned by [YOUR NAME/COMPANY] unless otherwise
          noted. You may not copy, redistribute, or create derivative works from the Service without
          permission.
        </Section>

        <Section title="7. Disclaimer of warranty">
          The Service is provided "as is" without warranties of any kind, express or implied. We don't
          guarantee the Service will be uninterrupted, error-free, or that any learning outcome will be
          achieved.
        </Section>

        <Section title="8. Limitation of liability">
          To the fullest extent permitted by law, [YOUR NAME/COMPANY] will not be liable for any indirect,
          incidental, or consequential damages arising from your use of the Service.
        </Section>

        <Section title="9. Termination">
          We may suspend or terminate your access to the Service at any time, for any reason, including
          violation of these terms. You may stop using the Service and request account deletion at any time.
        </Section>

        <Section title="10. Changes to these terms">
          We may update these Terms from time to time. Material changes will require you to re-accept the
          updated terms before continuing to use the Service.
        </Section>

        <Section title="11. Governing law">
          These Terms are governed by the laws of [YOUR JURISDICTION], without regard to conflict-of-law
          principles.
        </Section>

        <Section title="12. Contact">
          Questions about these Terms? Contact [YOUR CONTACT EMAIL].
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
  meta: { color: "#9B93B8", fontSize: 12, marginBottom: 16 },
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

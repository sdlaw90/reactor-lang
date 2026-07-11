// Shared branded HTML wrapper for every email SquirreLingo sends via Resend.
// Table-based layout + inline styles for email-client compatibility.
// Colors match the app: bg #171423, card #221E33, pink #FF8FB1, purple #B98EFF.
//
// Usage:
//   const html = brandedEmail({
//     heading: "New bug report",
//     bodyHtml: "<p>...</p>",
//     cta: { label: "Review it", url: "https://..." },   // optional
//   });
//
// Keep a plain-text version alongside every HTML email (Resend accepts both).

const COLORS = {
  bg: "#171423",
  card: "#221E33",
  border: "#3A3452",
  text: "#F3F0FA",
  muted: "#B4ABC9",
  pink: "#FF8FB1",
  purple: "#B98EFF",
  dark: "#171423",
};

export function brandedEmail({ heading, bodyHtml, cta }) {
  const ctaHtml = cta
    ? `
      <tr>
        <td align="center" style="padding: 8px 0 24px;">
          <a href="${cta.url}"
             style="display: inline-block; background: ${COLORS.pink}; color: ${COLORS.dark};
                    font-weight: 700; font-size: 15px; text-decoration: none;
                    padding: 13px 28px; border-radius: 12px;">
            ${cta.label}
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background: ${COLORS.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${COLORS.bg}; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">

          <!-- Header / wordmark -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <span style="font-family: Arial, Helvetica, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">
                <span style="color: ${COLORS.pink};">Squirre</span><span style="color: ${COLORS.purple};">Lingo</span>
                <span style="font-size: 22px;">&#128063;</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 28px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: Arial, Helvetica, sans-serif; color: ${COLORS.text}; font-size: 19px; font-weight: 700; padding-bottom: 14px;">
                    ${heading}
                  </td>
                </tr>
                <tr>
                  <td style="font-family: Arial, Helvetica, sans-serif; color: ${COLORS.muted}; font-size: 14px; line-height: 1.6;">
                    ${bodyHtml}
                  </td>
                </tr>
                ${ctaHtml}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 20px; font-family: Arial, Helvetica, sans-serif; color: #7C7395; font-size: 12px; line-height: 1.5;">
              SquirreLingo &middot; Fast, ADHD-friendly language practice<br/>
              You're receiving this because of activity in the SquirreLingo beta.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Small helper for label/value detail rows inside bodyHtml.
export function detailRows(pairs) {
  return pairs
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([label, value]) =>
        `<p style="margin: 0 0 8px;"><strong style="color: ${COLORS.text};">${label}:</strong> ${escapeHtml(String(value))}</p>`
    )
    .join("");
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

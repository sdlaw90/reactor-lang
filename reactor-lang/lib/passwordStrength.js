export function getPasswordStrength(pw) {
  if (!pw) return { label: "", pct: 0, color: "#3A3452" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", pct: 30, color: "#FF7B8A" };
  if (score <= 3) return { label: "Okay", pct: 65, color: "#FFB84D" };
  return { label: "Strong", pct: 100, color: "#5EE0A0" };
}

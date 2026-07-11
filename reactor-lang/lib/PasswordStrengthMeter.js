"use client";

import { getPasswordStrength } from "./passwordStrength";

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { label, pct, color } = getPasswordStrength(password);
  return (
    <div style={{ marginTop: -4, marginBottom: 12 }}>
      <div style={{ height: 4, background: "#3A3452", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.2s ease" }} />
      </div>
      <span style={{ fontSize: 11, color, marginTop: 3, display: "block" }}>{label}</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { isUsernameTaken } from "./db";

export function generateCandidate(base) {
  const clean = base.replace(/[^a-zA-Z0-9_]/g, "") || "user";
  const suffix = Math.floor(Math.random() * 9000 + 100);
  return `${clean}${suffix}`;
}

export default function UsernameAvailabilityField({ value, onChange, placeholder = "Username" }) {
  const [status, setStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const [alternatives, setAlternatives] = useState([]);

  const verify = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setStatus("checking");
    setAlternatives([]);
    try {
      const taken = await isUsernameTaken(trimmed);
      if (!taken) {
        setStatus("available");
        return;
      }
      setStatus("taken");
      // Generate a few genuinely-available alternatives, not just random guesses.
      const found = [];
      const tried = new Set();
      let attempts = 0;
      while (found.length < 3 && attempts < 15) {
        attempts++;
        const candidate = generateCandidate(trimmed);
        if (tried.has(candidate)) continue;
        tried.add(candidate);
        const candidateTaken = await isUsernameTaken(candidate);
        if (!candidateTaken) found.push(candidate);
      }
      setAlternatives(found);
    } catch (e) {
      console.error("username verify failed", e);
      setStatus(null);
    }
  };

  const pickAlternative = (alt) => {
    onChange(alt);
    setStatus("available");
    setAlternatives([]);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="jm"
          style={styles.input}
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setStatus(null);
            setAlternatives([]);
          }}
        />
        <button type="button" className="rj" style={styles.verifyBtn} onClick={verify} disabled={!value.trim() || status === "checking"}>
          {status === "checking" ? "…" : "Verify"}
        </button>
      </div>
      {status === "available" && <p style={styles.available}>✓ Available</p>}
      {status === "taken" && (
        <div>
          <p style={styles.taken}>That username is taken.</p>
          {alternatives.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {alternatives.map((alt) => (
                <button key={alt} type="button" className="jm" style={styles.altChip} onClick={() => pickAlternative(alt)}>
                  {alt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  input: { flex: 1, background: "#171423", color: "#F3F0FA", border: "1px solid #3A3452", borderRadius: 8, padding: "10px 12px", fontSize: 14 },
  verifyBtn: { background: "transparent", color: "#3DDBFF", border: "1px solid #3DDBFF", borderRadius: 8, padding: "0 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  available: { color: "#5EE0A0", fontSize: 12, marginTop: 6 },
  taken: { color: "#FF7B8A", fontSize: 12, marginTop: 6 },
  altChip: { background: "#171423", border: "1px solid #3A3452", borderRadius: 999, padding: "5px 12px", fontSize: 12, color: "#F3F0FA", cursor: "pointer" },
};

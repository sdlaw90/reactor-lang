"use client";

import { flagImageUrl } from "./countries";

export default function Avatar({ type, value, fallbackText, size = 36 }) {
  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "#3A3452",
    flexShrink: 0,
  };

  if (type === "photo" && value) {
    return (
      <div style={base}>
        <img src={value} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  if (type === "emoji" && value) {
    return (
      <div style={{ ...base, fontSize: size * 0.55 }}>
        <span>{value}</span>
      </div>
    );
  }
  if (type === "flag" && value) {
    return (
      <div style={base}>
        <img src={flagImageUrl(value)} alt={value} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{ ...base, fontSize: size * 0.4, color: "#F3F0FA", fontWeight: 700 }}>
      {(fallbackText || "?").charAt(0).toUpperCase()}
    </div>
  );
}

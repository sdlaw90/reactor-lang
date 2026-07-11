"use client";

import { useRouter } from "next/navigation";
import { CURRENT_VERSION } from "../lib/version";

const IS_BETA = CURRENT_VERSION.includes("-beta");

export default function VersionFooter() {
  const router = useRouter();
  return (
    <button
      className="jm"
      onClick={() => router.push("/changelog")}
      title="View changelog"
      style={{
        position: "fixed",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(34,30,51,0.9)",
        border: "1px solid #3A3452",
        borderRadius: 999,
        padding: "4px 12px",
        color: "#7C7395",
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {IS_BETA && (
        <span
          style={{
            background: "#FF8FB1",
            color: "#171423",
            borderRadius: 999,
            padding: "1px 7px",
            fontWeight: 800,
            fontSize: 9.5,
            letterSpacing: 0.5,
          }}
        >
          BETA
        </span>
      )}
      <span style={{ textDecoration: "underline" }}>v{CURRENT_VERSION}</span>
    </button>
  );
}

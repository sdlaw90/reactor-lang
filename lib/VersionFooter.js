"use client";

import { useRouter } from "next/navigation";
import { CURRENT_VERSION } from "../lib/version";

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
        background: "rgba(34,30,51,0.9)",
        border: "1px solid #3A3452",
        borderRadius: 999,
        padding: "4px 12px",
        color: "#7C7395",
        fontSize: 11,
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      v{CURRENT_VERSION}
    </button>
  );
}

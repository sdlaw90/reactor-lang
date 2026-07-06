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
        position: "relative",
        zIndex: 1,
        display: "inline-block",
        marginTop: 12,
        background: "transparent",
        border: "none",
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

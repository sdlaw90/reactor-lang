"use client";

import ComingSoonSection from "../../../lib/ComingSoonSection";

export default function SpeakPage({ params }) {
  return <ComingSoonSection trackId={params.trackId} section="speak" />;
}

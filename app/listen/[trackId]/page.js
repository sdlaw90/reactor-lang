"use client";

import ComingSoonSection from "../../../lib/ComingSoonSection";

export default function ListenPage({ params }) {
  return <ComingSoonSection trackId={params.trackId} section="listen" />;
}

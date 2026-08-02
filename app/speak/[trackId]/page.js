"use client";

import { use } from "react";

import ComingSoonSection from "../../../lib/ComingSoonSection";

export default function SpeakPage(props) {
  const params = use(props.params);
  return <ComingSoonSection trackId={params.trackId} section="speak" />;
}

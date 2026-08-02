"use client";

import { use } from "react";

import ComingSoonSection from "../../../lib/ComingSoonSection";

export default function ListenPage(props) {
  const params = use(props.params);
  return <ComingSoonSection trackId={params.trackId} section="listen" />;
}

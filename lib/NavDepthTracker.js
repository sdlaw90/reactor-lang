"use client";

// #92: mounted once in the root layout. Records every client-side navigation
// into the nav-depth breadcrumb stack (see lib/navDepth.js) so the shared
// Back/Home control can tell how many pages deep the person is. Renders
// nothing.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordNav } from "./navDepth";

export default function NavDepthTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordNav(pathname);
  }, [pathname]);
  return null;
}

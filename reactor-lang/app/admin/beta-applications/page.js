"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The standalone beta-applications page moved into the admin hub. This
// redirect keeps old links working (admin notification emails linked here
// for weeks). Guard note (standing practice): no auth check needed on a
// pure redirect — /admin itself is auth-guarded and admin-gated, so a
// signed-out visitor still ends up at /auth, never at admin content.
export default function BetaApplicationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin?tab=applications");
  }, [router]);
  return null;
}

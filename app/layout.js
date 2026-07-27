import "../styles/globals.css";
import NavDepthTracker from "../lib/NavDepthTracker";
import VersionWatcher from "../lib/VersionWatcher";
import RequireUsernameGate from "../lib/RequireUsernameGate";
import RequireLegalGate from "../lib/RequireLegalGate";
import GuideOverlay from "../lib/GuideOverlay";
import GlobalErrorLogger from "../lib/GlobalErrorLogger";

export const metadata = {
  metadataBase: new URL("https://squirrelingo.vercel.app"),
  title: "SquirreLingo",
  description: "Fast, ADHD-friendly language practice",
  applicationName: "SquirreLingo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SquirreLingo",
  },
  openGraph: {
    title: "SquirreLingo",
    description: "Fast, ADHD-friendly language practice",
    siteName: "SquirreLingo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SquirreLingo",
    description: "Fast, ADHD-friendly language practice",
  },
};

export const viewport = {
  themeColor: "#241a39",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <NavDepthTracker />
        <VersionWatcher />
        <RequireUsernameGate />
        <RequireLegalGate />
        <GuideOverlay />
        <GlobalErrorLogger />
      </body>
    </html>
  );
}

import "../styles/globals.css";
import NavDepthTracker from "../lib/NavDepthTracker";
import VersionWatcher from "../lib/VersionWatcher";
import RequireUsernameGate from "../lib/RequireUsernameGate";
import RequireLegalGate from "../lib/RequireLegalGate";
import GuideOverlay from "../lib/GuideOverlay";
import GlobalErrorLogger from "../lib/GlobalErrorLogger";

export const metadata = {
  title: "SquirreLingo",
  description: "Fast, ADHD-friendly language practice",
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

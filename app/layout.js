import "../styles/globals.css";
import VersionWatcher from "../lib/VersionWatcher";
import RequireUsernameGate from "../lib/RequireUsernameGate";
import RequireLegalGate from "../lib/RequireLegalGate";
import WelcomePopup from "../lib/WelcomePopup";
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
        <VersionWatcher />
        <RequireUsernameGate />
        <RequireLegalGate />
        <WelcomePopup />
        <GlobalErrorLogger />
      </body>
    </html>
  );
}

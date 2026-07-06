import "../styles/globals.css";
import VersionWatcher from "../lib/VersionWatcher";
import RequireUsernameGate from "../lib/RequireUsernameGate";

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
      </body>
    </html>
  );
}

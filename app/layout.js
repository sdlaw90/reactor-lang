import "../styles/globals.css";
import VersionWatcher from "../lib/VersionWatcher";

export const metadata = {
  title: "Reactor Lang",
  description: "Fast, ADHD-friendly language practice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VersionWatcher />
      </body>
    </html>
  );
}

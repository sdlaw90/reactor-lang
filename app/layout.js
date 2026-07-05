import "../styles/globals.css";

export const metadata = {
  title: "Reactor Lang",
  description: "Fast, ADHD-friendly language practice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

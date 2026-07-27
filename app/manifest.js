export default function manifest() {
  return {
    name: "SquirreLingo",
    short_name: "SquirreLingo",
    description: "Fast, ADHD-friendly language practice",
    start_url: "/",
    display: "standalone",
    background_color: "#241a39",
    theme_color: "#241a39",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

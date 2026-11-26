import type { MetadataRoute } from "next";

// Installable-app manifest — same app-readiness layer as thedjcares.com,
// stepinthering.com, and idontcry.com.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open Mirror LLC",
    short_name: "Open Mirror",
    // 2026-11-24 (owner): the same plain studio line as the homepage.
    description: "We make things. We help people make things. A Christian-owned company.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    icons: [
      { src: "/icons/om-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/om-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/om-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/om-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

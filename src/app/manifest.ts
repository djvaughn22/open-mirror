import type { MetadataRoute } from "next";

// Installable-app manifest — same app-readiness layer as thedjcares.com,
// stepinthering.com, and idontcry.com.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open Mirror LLC",
    short_name: "Open Mirror",
    description:
      "An independent creative studio building useful, original products across faith, family, creativity, and play — all made to help people create.",
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

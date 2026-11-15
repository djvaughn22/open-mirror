import type { MetadataRoute } from "next";
import { STUDIO } from "../lib/products";

// 2026-11-14: the hub had no robots.txt or sitemap (Nov 14 audit).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${STUDIO.url}/sitemap.xml`,
  };
}

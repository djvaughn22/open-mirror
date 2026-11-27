import type { MetadataRoute } from "next";
import { STUDIO } from "../lib/products";
import { SUBJECTS } from "../lib/learning/taxonomy";

// The hub's own public pages. The old sports wire (/sports/*) and the
// /sports-desk demo are left out on purpose: iDontCry's Sports Desk replaced
// them, and they carry noindex.
// Nov 26-27 2026: Open Mirror Learning (every subject page) and the Marketplace.
const PAGES = ["", "/about-open-mirror", "/contact", "/disclaimer", "/learn", "/learn/work", "/marketplace", ...SUBJECTS.map((s) => `/learn/${s.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${STUDIO.url}${path}` }));
}

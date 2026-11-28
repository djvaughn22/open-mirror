import type { MetadataRoute } from "next";
import { STUDIO } from "../lib/products";
import { SUBJECTS } from "../lib/learning/taxonomy";
import { PATHS } from "../lib/learning/paths";
import { AREAS } from "../lib/learning/areas";

// The hub's own public pages. The old sports wire (/sports/*) and the
// /sports-desk demo are left out on purpose: iDontCry's Sports Desk replaced
// them, and they carry noindex.
// Nov 26-27 2026: Open Mirror Learning (every subject page) and the Marketplace.
// Nov 28 2026: learning paths and the nine subject areas.
const PAGES = [
  "", "/about-open-mirror", "/contact", "/disclaimer", "/learn", "/learn/work", "/learn/paths", "/marketplace",
  ...AREAS.map((a) => `/learn/area/${a.slug}`),
  ...PATHS.map((p) => `/learn/paths/${p.slug}`),
  ...SUBJECTS.map((s) => `/learn/${s.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${STUDIO.url}${path}` }));
}

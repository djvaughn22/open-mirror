import type { MetadataRoute } from "next";
import { STUDIO } from "../lib/products";

// The hub's own public pages. The old sports wire (/sports/*) and the
// /sports-desk demo are left out on purpose: iDontCry's Sports Desk replaced
// them, and they carry noindex.
const PAGES = ["", "/about-open-mirror", "/contact", "/disclaimer"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${STUDIO.url}${path}` }));
}

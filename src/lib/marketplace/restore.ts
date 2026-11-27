// ─────────────────────────────────────────────────────────────────────────────
// Marketplace › Restore: where to find experienced craftspeople today
// (owner direction, Nov 26-27 2026). These are independent professional
// associations' own directories. Open Mirror isn't affiliated with them, earns
// nothing from them and doesn't vouch for anyone they list. Each link was
// opened on the date below (scripts/check-links.ts keeps checking).
// ─────────────────────────────────────────────────────────────────────────────

export type RestoreDirectory = {
  id: string;
  /** What you'd bring to them, in plain words. */
  what: string;
  title: string;
  by: string;
  url: string;
  checked: string;
};

export const RESTORE_DIRECTORIES: RestoreDirectory[] = [
  { id: "awci", what: "Watches and clocks", title: "Find a Professional", by: "American Watchmakers-Clockmakers Institute", url: "https://awci.memberclicks.net/find-a-professional", checked: "2026-11-27" },
  { id: "nawcc", what: "Clocks and watches", title: "Business Directory", by: "National Association of Watch and Clock Collectors", url: "https://nawcc.org/business-directory", checked: "2026-11-27" },
  { id: "aic", what: "Furniture, paintings, books, photographs, textiles and other heirlooms", title: "Find a Conservator", by: "American Institute for Conservation", url: "https://www.culturalheritage.org/about-conservation/find-a-conservator", checked: "2026-11-27" },
  { id: "ptg", what: "Pianos", title: "Find a Technician", by: "Piano Technicians Guild", url: "https://my.ptg.org/find-a-technician", checked: "2026-11-27" },
  { id: "ja", what: "Jewelry", title: "Find a Jeweler", by: "Jewelers of America", url: "https://www.jewelers.org/find-a-jeweler/", checked: "2026-11-27" },
];

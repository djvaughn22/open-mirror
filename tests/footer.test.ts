// ─────────────────────────────────────────────────────────────────────────────
// Family footer standard guard — locks the centered three-line footer
// (owner, 2026-08-02):
//   OpenMirrorLLC.com · About · ✝️ ❤️ 🙏
//   Contact · Disclaimer          (anchors into THIS site's own About page)
//   Open Mirror LLC is a small independent company.
// The canonical component is the single source every satellite syncs from, so
// these checks protect the whole portfolio, not just the hub.
//
//   npm test
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const repoRoot = join(import.meta.dirname, "..");
const src = readFileSync(
  join(repoRoot, "packages/openmirror-ui/OpenMirrorFooter.tsx"),
  "utf8",
);
const about = readFileSync(
  join(repoRoot, "src/app/about-open-mirror/page.tsx"),
  "utf8",
);
const layout = readFileSync(join(repoRoot, "src/app/layout.tsx"), "utf8");

test("line one: OpenMirrorLLC.com · own About · CrossHeartPray icons", () => {
  assert.ok(src.includes(">OpenMirrorLLC.com</a>"), "brand label");
  assert.ok(src.includes('"https://openmirrorllc.com"'), "brand → hub homepage");
  assert.ok(src.includes("{aboutHref}"), "About → this site's own About page");
  assert.ok(
    src.includes('"https://crossheartpray.com"'),
    "icons → CrossHeartPray homepage",
  );
  assert.ok(
    src.includes('aria-label="Visit CrossHeartPray"'),
    "icons are ONE labeled link",
  );
  assert.ok(
    src.includes('<span aria-hidden="true">✝️ ❤️ 🙏</span>'),
    "emoji are hidden from screen readers; the label speaks",
  );
});

test("line two: Contact · Disclaimer anchor into the site's own About", () => {
  assert.ok(src.includes("`${aboutHref}#contact`"), "Contact → About#contact");
  assert.ok(
    src.includes("`${aboutHref}#disclaimer`"),
    "Disclaimer → About#disclaimer",
  );
  assert.ok(!src.includes("mailto:"), "the footer never opens email directly");
});

test("line three: the plain ownership sentence", () => {
  assert.ok(
    src.includes("Open Mirror LLC is a small independent company."),
    "supporting text, not a link",
  );
});

test("the old clutter never returns", () => {
  for (const banned of [
    "©", // copyright row
    "About Open Mirror", // old duplicate label — now just "About"
    ">CrossHeartPray</a>", // written link — the icons carry it
    "tagline", // per-site slogan prop
    "siteName", // per-site identity line
    'target="_blank"', // family links navigate in the same tab
  ]) {
    assert.ok(!src.includes(banned), `footer must not contain: ${banned}`);
  }
});

test("footer is semantic, compact, and safe-area aware", () => {
  assert.ok(src.includes("<footer"), "uses <footer>");
  assert.ok(src.includes('aria-label="Open Mirror LLC"'), "labeled nav region");
  assert.ok(src.includes("focus-visible"), "visible focus states");
  assert.ok(src.includes("safe-area-inset-bottom"), "iPhone safe-area padding");
  assert.ok(src.includes("prefers-reduced-motion"), "respects reduced motion");
});

test("the hub wires the footer to its own About route", () => {
  assert.ok(
    layout.includes('<OpenMirrorFooter aboutHref="/about-open-mirror" />'),
    "hub layout passes its About route",
  );
});

test("the hub About page carries the two footer landing sections", () => {
  assert.ok(about.includes('id="contact"'), "labeled Contact section");
  assert.ok(about.includes('id="disclaimer"'), "labeled Disclaimer section");
  assert.ok(about.includes("scroll-mt-24"), "anchors clear the sticky header");
});

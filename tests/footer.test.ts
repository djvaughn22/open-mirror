// ─────────────────────────────────────────────────────────────────────────────
// Family footer standard guard — locks the compact two-row footer
// (owner, 2026-08-02):
//   OpenMirrorLLC.com · About · ✝️ ❤️ 🙏
//   Disclaimer · Contact (mailto — never a contact page)
// The canonical component is the single source every satellite syncs from, so
// these checks protect the whole portfolio, not just the hub.
//
//   npm test
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const src = readFileSync(
  join(import.meta.dirname, "../packages/openmirror-ui/OpenMirrorFooter.tsx"),
  "utf8",
);

test("row one: OpenMirrorLLC.com · About · CrossHeartPray icons", () => {
  assert.ok(src.includes(">OpenMirrorLLC.com</a>"), "brand label");
  assert.ok(src.includes('"https://openmirrorllc.com"'), "brand → hub homepage");
  assert.ok(src.includes("/about-open-mirror"), "About → hub About page");
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

test("row two: Disclaimer · Contact, and Contact is a mailto", () => {
  assert.ok(src.includes("/disclaimer"), "Disclaimer → hub Disclaimer page");
  assert.ok(
    src.includes(
      '"mailto:ask@openmirrorllc.com?subject=Open%20Mirror%20Inquiry"',
    ),
    "Contact opens email to the verified address",
  );
  assert.ok(!src.includes("/contact"), "Contact never points at a webpage");
});

test("the old clutter never returns", () => {
  for (const banned of [
    "©", // copyright/ownership line
    "small independent company",
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
  const rows = src.match(/om-footer-row/g) ?? [];
  assert.ok(src.includes("om-footer-main") && src.includes("om-footer-sub"), "exactly two rows: main + sub");
});

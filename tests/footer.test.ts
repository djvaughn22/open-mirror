// ─────────────────────────────────────────────────────────────────────────────
// Family footer standard guard — locks the two-band footer (owner, 2026-08-02).
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

test("footer links to the five locked destinations and nothing is guessed", () => {
  assert.ok(src.includes('"https://openmirrorllc.com"'), "brand → hub homepage");
  assert.ok(src.includes('"https://crossheartpray.com"'), "CrossHeartPray link");
  for (const route of ["/about-open-mirror", "/contact", "/disclaimer"]) {
    assert.ok(src.includes(`\`\${base}${route}\``), `hub route ${route}`);
  }
});

test("ownership line is the locked sentence with a dynamic year", () => {
  assert.ok(src.includes("new Date().getFullYear()"), "year is computed");
  assert.ok(
    src.includes("Open Mirror LLC. A small independent") &&
      src.includes("company."),
    "locked ownership sentence",
  );
});

test("the old three-line clutter never returns", () => {
  for (const banned of [
    "✝️", // emoji CrossHeartPray row
    "About Open Mirror", // old duplicate label — now just "About"
    "tagline", // per-site tagline prop
    "siteName", // per-site identity line
    'target="_blank"', // family links navigate in the same tab
  ]) {
    assert.ok(!src.includes(banned), `footer must not contain: ${banned}`);
  }
});

test("footer is semantic and labeled", () => {
  assert.ok(src.includes("<footer"), "uses <footer>");
  assert.ok(src.includes('aria-label="Open Mirror LLC"'), "labeled nav region");
  assert.ok(src.includes("focus-visible"), "visible focus states");
  assert.ok(src.includes("safe-area-inset-bottom"), "iPhone safe-area padding");
});

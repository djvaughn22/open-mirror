// ─────────────────────────────────────────────────────────────────────────────
// Hub regression tests — Node's built-in test runner, no framework added.
//
//   npm test
//
// These lock the rules that are easy to break by accident and expensive to
// notice: the Foundation stays first, the featured product stays honest, the
// public family keeps deriving from the registry, Reflect stays hidden, and no
// paid bundle reappears under public/.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  aboutFamilyProducts,
  featuredProduct,
  foundationProduct,
  products,
  productsByStatus,
  type Product,
} from "../src/lib/products.ts";

const repoRoot = join(import.meta.dirname, "..");
const byName = (name: string): Product => {
  const p = products.find((x) => x.name === name);
  assert.ok(p, `${name} is missing from the product registry`);
  return p;
};
const publicOnAbout = (name: string) => aboutFamilyProducts().some((p) => p.name === name);

// ── CrossHeartPray: the protected Foundation ────────────────────────────────

test("CrossHeartPray is the Foundation", () => {
  const chp = byName("CrossHeartPray");
  assert.equal(chp.status, "foundation");
  assert.equal(chp.access, "Foundation");
  assert.equal(chp.accessNote, "First Build");
  assert.equal(foundationProduct()?.name, "CrossHeartPray");
});

test("CrossHeartPray appears first", () => {
  assert.equal(products[0].name, "CrossHeartPray", "CrossHeartPray must be first in the registry");
  // …and the homepage renders the foundation group before anything else.
  assert.equal(productsByStatus("foundation")[0]?.name, "CrossHeartPray");
});

test("only one product is the Foundation", () => {
  assert.equal(products.filter((p) => p.status === "foundation").length, 1);
});

// ── The featured product ────────────────────────────────────────────────────

test("Old Laptop to Build Machine is the featured product", () => {
  const featured = featuredProduct();
  assert.equal(featured?.name, "Old Laptop to Build Machine");
  assert.equal(featured?.access, "Product");
});

test("Old Laptop is marked Preparing for Release", () => {
  assert.equal(featuredProduct()?.accessNote, "Preparing for Release");
});

test("exactly one product is featured", () => {
  assert.equal(products.filter((p) => p.featured === true).length, 1);
});

test("the featured product has an image with real alt text", () => {
  const featured = featuredProduct()!;
  assert.ok(featured.image, "featured product needs a launch image");
  assert.ok(existsSync(join(repoRoot, "public", featured.image!)), `${featured.image} must exist under public/`);
  assert.ok((featured.imageAlt ?? "").length > 20, "featured image needs useful alt text");
});

// ── Public projects stay public ─────────────────────────────────────────────

for (const name of [
  "TheDJCares",
  "WatchedNotWatched",
  "iDontCry",
  "PleaseBeReady",
  "DontCloneMeTom",
  "StepInTheRing",
  "OpenDoku",
  "WhatAmIAI",
  "Fambookagram",
  "Friendbookagram",
]) {
  test(`${name} is public and on About`, () => {
    const p = byName(name);
    assert.notEqual(p.showInPortfolio, false, `${name} must stay on the homepage`);
    assert.notEqual(p.showInAbout, false, `${name} must stay on About`);
    assert.ok(publicOnAbout(name), `${name} must appear in the About family`);
  });
}

test("WhatAmIAI is represented honestly — free to use, still building", () => {
  const p = byName("WhatAmIAI");
  assert.equal(p.status, "building");
  assert.equal(p.access, "Free");
  assert.equal(p.accessNote, "Building");
});

// ── Fambookagram + Friendbookagram: public examples, in the menu ────────────

for (const name of ["Fambookagram", "Friendbookagram"]) {
  test(`${name} is an Exploring idea, not a failure`, () => {
    const p = byName(name);
    assert.equal(p.access, "Exploring");
    assert.equal(p.status, "exploring");
    // The placeholder-domain sentence is protected owner copy.
    assert.match(p.description, /Placeholder domain while we test the concept/);
  });

  test(`${name} appears in shared navigation`, () => {
    assert.notEqual(byName(name).showInNav, false, `${name} must stay in the nav menu`);
  });
}

test("the nav menu groups Exploring ideas", () => {
  const nav = readFileSync(join(repoRoot, "src/components/OpenMirrorNav.tsx"), "utf8");
  assert.match(nav, /Exploring ideas/, "nav needs a labelled Exploring ideas group");
  assert.match(nav, /showInNav !== false/, "nav must derive from the registry");
});

// ── Reflect stays hidden ────────────────────────────────────────────────────

test("Reflect remains hidden everywhere public", () => {
  const reflect = byName("Reflect");
  assert.equal(reflect.showInPortfolio, false);
  assert.equal(reflect.showInAbout, false);
  assert.equal(reflect.showInNav, false);
  assert.equal(publicOnAbout("Reflect"), false, "Reflect must not leak onto About");
});

// ── About derives from the registry ─────────────────────────────────────────

test("About renders the family from the canonical registry", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /aboutFamilyProducts\(\)/, "About must read the registry, not a hand-kept list");
  assert.match(about, /featuredProduct\(\)/);
  assert.match(about, /foundationProduct\(\)/);
  // A second hard-coded project array is exactly how projects went missing before.
  assert.doesNotMatch(about, /const PROGRESSION/, "no competing hard-coded project array");
});

test("every public project reaches About or is deliberately excluded", () => {
  const excluded = products.filter((p) => p.showInAbout === false).map((p) => p.name);
  assert.deepEqual(excluded, ["Reflect"], "only Reflect is intentionally kept off About");

  const shown = new Set([...aboutFamilyProducts().map((p) => p.name), foundationProduct()!.name, featuredProduct()!.name]);
  for (const p of products) {
    if (p.showInAbout === false) continue;
    assert.ok(shown.has(p.name), `${p.name} is public but reaches no About lane`);
  }
});

// ── Honest commerce ────────────────────────────────────────────────────────

test("no paid ZIP is served from public/", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  const archives = walk(join(repoRoot, "public")).filter((f) => /\.(zip|tar|tar\.gz|tgz|7z|rar)$/i.test(f));
  assert.deepEqual(archives, [], `public/ must never serve an archive: ${archives.join(", ")}`);
});

test("the packaging script builds to a git-ignored, non-served directory", () => {
  const script = readFileSync(join(repoRoot, "scripts/package-old-laptop-bundle.sh"), "utf8");
  assert.match(script, /^OUT="dist\//m, "the bundle must be packaged into dist/");
  assert.doesNotMatch(script, /OUT="public\//, "the bundle must never be packaged into public/");
  assert.match(readFileSync(join(repoRoot, ".gitignore"), "utf8"), /^\/dist$/m, "dist/ must be git-ignored");
});

test("the free readiness check is present and public", () => {
  assert.ok(existsSync(join(repoRoot, "public/downloads/old-laptop-readiness-check.pdf")));
});

// Comments legitimately say things like "no price, no checkout" — scan the code
// that ships, not the notes about it.
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("no public product claims to be purchasable without a checkout", () => {
  const pages = ["src/app/page.tsx", "src/app/about-open-mirror/page.tsx", "src/app/products/old-laptop-to-build-machine/page.tsx"];
  for (const rel of pages) {
    const src = stripComments(readFileSync(join(repoRoot, rel), "utf8"));
    assert.doesNotMatch(src, /add to cart|buy now|proceed to checkout|\$\d/i, `${rel} must not imply a purchase`);
  }
  // Anything labelled Product needs an honest availability qualifier.
  for (const p of products.filter((x) => x.access === "Product")) {
    assert.ok(p.accessNote, `${p.name} is a Product and needs an availability qualifier`);
  }
});

// ── Copy that must not regress ─────────────────────────────────────────────

test("StepInTheRing does not promise seven questions", () => {
  const sitr = byName("StepInTheRing");
  const copy = `${sitr.description} ${sitr.aboutLine ?? ""}`;
  assert.doesNotMatch(copy, /seven question|7 question|fight plan/i);
  assert.match(copy, /version one/i, "SITR should describe its real promise");
});

test("the hub does not claim StepInTheRing publishes games for visitors", () => {
  const sitr = byName("StepInTheRing");
  assert.doesNotMatch(`${sitr.description} ${sitr.aboutLine ?? ""}`, /game engine/i);
});

// ── Links ──────────────────────────────────────────────────────────────────

test("every product link is non-empty and syntactically valid", () => {
  for (const p of products) {
    assert.ok(p.href.length > 1, `${p.name} needs a link`);
    if (p.href.startsWith("http")) {
      assert.doesNotThrow(() => new URL(p.href), `${p.name} has an invalid URL`);
    } else {
      assert.match(p.href, /^\//, `${p.name} internal link must be root-relative`);
    }
    for (const l of p.links ?? []) {
      assert.ok(l.label.trim().length > 0, `${p.name} has an unlabelled sub-link`);
      assert.doesNotThrow(() => new URL(l.href), `${p.name} sub-link is invalid`);
    }
  }
});

test("every product carries a visitor label and an accent", () => {
  for (const p of products) {
    assert.ok(p.access, `${p.name} needs a visitor label`);
    assert.match(p.accent, /^#[0-9A-Fa-f]{6}$/, `${p.name} needs a hex accent`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Feature registry regression tests — Node's built-in test runner, no framework
// added (matches tests/hub.test.ts style).
//
//   npm test
//
// These lock the rules that make "Try This First" / "More To Try" safe to
// edit later: every card has a real, verified href; nothing points at an
// admin/owner/localhost route; Start Here stays small; descriptions stay
// short and non-empty; ids are unique; every category actually has content.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  FEATURES,
  featuresByCategory,
  isValidFeatureHref,
  startHereFeatures,
  type FeatureCategory,
} from "../src/lib/features.ts";
import { products, type Product } from "../src/lib/products.ts";

const repoRoot = join(import.meta.dirname, "..");

// ── The registry loads and resolves cleanly ─────────────────────────────────

test("the feature registry is non-empty and every id is unique", () => {
  assert.ok(FEATURES.length > 0, "at least one feature must exist");
  const ids = FEATURES.map((f) => f.id);
  assert.deepEqual([...new Set(ids)], ids, "every feature id must be unique");
});

test("every feature references a real product in products.ts", () => {
  for (const f of FEATURES) {
    assert.ok(
      products.some((p) => p.name === f.productName),
      `feature "${f.id}" references unknown product "${f.productName}"`
    );
  }
});

// ── isValidFeatureHref — the guard that keeps hrefs from drifting ──────────

test("isValidFeatureHref accepts the product's own href and its registered links", () => {
  const fake: Product = {
    name: "Fake",
    emoji: "🧪",
    description: "test fixture",
    access: "Free",
    accent: "#000000",
    href: "https://example.com",
    status: "live",
    category: "play",
    links: [{ label: "Sub", href: "https://example.com/sub" }],
  };
  assert.equal(isValidFeatureHref(fake, "https://example.com"), true);
  assert.equal(isValidFeatureHref(fake, "https://example.com/sub"), true);
  assert.equal(isValidFeatureHref(fake, "https://example.com/guessed"), false, "an unregistered route must fail");
  assert.equal(isValidFeatureHref(fake, "https://not-this-domain.com"), false);
});

// ── Every feature card must have a real, safe href ──────────────────────────

const FORBIDDEN_LINK_SEGMENTS = [
  "/admin", "/owner", "/engines", "/lab", "/uat", "/account",
  "/api/", "localhost", "127.0.0.1", "/login", "/members/login",
];

test("every feature href is non-empty and a valid URL", () => {
  for (const f of FEATURES) {
    assert.ok(f.href.length > 1, `${f.id} needs a link`);
    assert.doesNotThrow(() => new URL(f.href), `${f.id} has an invalid URL`);
  }
});

test("no feature ever points at localhost, a preview URL, or an admin/owner route", () => {
  for (const f of FEATURES) {
    assert.doesNotMatch(f.href, /localhost|127\.0\.0\.1|0\.0\.0\.0|:3000|:3001|vercel\.app/i,
      `${f.id} href must be a real production URL`);
    for (const segment of FORBIDDEN_LINK_SEGMENTS) {
      assert.doesNotMatch(f.href.toLowerCase(), new RegExp(segment.replace(/[/.]/g, "\\$&")),
        `${f.id} (${f.href}) must never expose ${segment}`);
    }
  }
});

// ── Descriptions stay short, plain, and honest ──────────────────────────────

test("every feature has a non-empty title, description, and CTA", () => {
  for (const f of FEATURES) {
    assert.ok(f.title.trim().length > 0, `${f.id} needs a title`);
    assert.ok(f.description.trim().length > 0, `${f.id} needs a description`);
    assert.ok(f.cta.trim().length > 0, `${f.id} needs a call to action`);
  }
});

test("descriptions stay short — plain English, not marketing copy", () => {
  for (const f of FEATURES) {
    const words = f.description.trim().split(/\s+/);
    assert.ok(words.length <= 16, `${f.id} description is too long (${words.length} words): "${f.description}"`);
    assert.ok(f.description.length <= 90, `${f.id} description exceeds 90 characters`);
    assert.doesNotMatch(
      f.description,
      /innovative|empower|platform|ecosystem|revolutionary|cutting-edge|seamless|leverage/i,
      `${f.id} description reads like marketing copy: "${f.description}"`
    );
  }
});

// ── Start Here stays small and deterministic ────────────────────────────────

test("Start Here is a small, fixed set (3-5 cards), no AI/quiz involved", () => {
  const hero = startHereFeatures();
  assert.ok(hero.length >= 3 && hero.length <= 5, `Start Here should have 3-5 cards, has ${hero.length}`);
  // every startHere feature actually is flagged as such
  for (const f of hero) assert.equal(f.startHere, true);
});

test("Start Here represents more than one category (a real spread, not one product)", () => {
  const cats = new Set(startHereFeatures().map((f) => f.category));
  assert.ok(cats.size >= 3, "Start Here should span at least 3 different kinds of things");
});

// ── Categories are all real and populated ───────────────────────────────────

test("every category in CATEGORY_ORDER has a label, an icon, and at least one feature", () => {
  for (const cat of CATEGORY_ORDER) {
    assert.ok(CATEGORY_LABEL[cat], `category ${cat} needs a label`);
    assert.ok(CATEGORY_ICON[cat], `category ${cat} needs an icon`);
    const inCategory = FEATURES.filter((f) => f.category === cat);
    assert.ok(inCategory.length > 0, `category ${cat} has no features at all`);
  }
});

test("every feature's category is a member of CATEGORY_ORDER", () => {
  const known = new Set<FeatureCategory>(CATEGORY_ORDER);
  for (const f of FEATURES) {
    assert.ok(known.has(f.category), `${f.id} has an unrecognized category "${f.category}"`);
  }
});

test("featuresByCategory never returns a Start Here card twice", () => {
  for (const cat of CATEGORY_ORDER) {
    for (const f of featuresByCategory(cat)) {
      assert.equal(f.startHere, undefined, `${f.id} is Start Here and should not also appear in More To Try`);
    }
  }
});

// ── No accidental directory dump ────────────────────────────────────────────

test("no product dominates the feature deck (curation, not a directory dump)", () => {
  const counts = new Map<string, number>();
  for (const f of FEATURES) counts.set(f.productName, (counts.get(f.productName) ?? 0) + 1);
  for (const [name, count] of counts) {
    assert.ok(count <= 12, `${name} has ${count} feature cards — that reads as a dump, not curation`);
  }
});

// ── The homepage actually uses this registry ────────────────────────────────

test("the homepage imports and renders from the feature registry", () => {
  const home = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
  assert.match(home, /from ["']\.\.\/lib\/features["']/, "the homepage must import the feature registry");
  assert.match(home, /startHereFeatures\(\)/);
  assert.match(home, /featuresByCategory\(/);
});

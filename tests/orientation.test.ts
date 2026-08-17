// ─────────────────────────────────────────────────────────────────────────────
// Homepage orientation tests.
//
// The homepage's job is to answer a first-time visitor's two questions —
// "what should I try?" and "where do I look?" — without turning into a
// directory dump and without ever pointing at a route the registry doesn't
// vouch for. These lock exactly that.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  assertOrientationRoutes,
  knownRoutes,
  SHELF_ORDER,
  shelfProducts,
  shelves,
  START_HERE,
} from "../src/lib/orientation.ts";
import { products } from "../src/lib/products.ts";

const repoRoot = join(import.meta.dirname, "..");

test("orientation never invents a destination and never drops a product", () => {
  assert.deepEqual(assertOrientationRoutes(), []);
});

test("Try This First stays an invitation, not a directory", () => {
  assert.ok(START_HERE.length >= 3 && START_HERE.length <= 5,
    `Start Here has ${START_HERE.length} items — 3 to 5 is the rule`);
  const known = knownRoutes();
  for (const s of START_HERE) {
    assert.ok(known.has(s.href), `${s.title} → ${s.href} is not a registry-verified route`);
    // The experience is the headline; the product is the small label.
    assert.ok(s.title.length > 0 && !s.title.includes(".com"),
      `${s.title} reads like a domain — Start Here names the experience`);
    assert.ok(s.doing.length > 20, `${s.title} must say what happens when you tap it`);
  }
});

test("Try This First covers more than one product", () => {
  // Five links into one site is a menu, not an orientation.
  const owners = new Set(START_HERE.map((s) => s.product));
  assert.ok(owners.size >= 3, `Start Here draws from only ${owners.size} products`);
});

test("shelves are few, named for the visitor, and none is empty", () => {
  const list = shelves();
  assert.ok(list.length <= SHELF_ORDER.length);
  assert.ok(list.length >= 4, "a homepage with fewer than 4 shelves is not organized, it is a list");
  for (const s of list) {
    assert.ok(s.items.length > 0, `${s.label} is an empty shelf`);
  }
});

test("every public product is reachable from the homepage exactly once", () => {
  const seen = new Map<string, number>();
  for (const s of shelves()) {
    for (const p of s.items) seen.set(p.name, (seen.get(p.name) ?? 0) + 1);
  }
  for (const [name, count] of seen) {
    assert.equal(count, 1, `${name} appears on ${count} shelves`);
  }
  const publicNames = products
    .filter((p) => p.showInPortfolio !== false && p.featured !== true && p.pinBottom !== true)
    .map((p) => p.name);
  assert.deepEqual([...seen.keys()].sort(), [...publicNames].sort());
});

test("CircuitSwitchGame is represented as one playable family, not five modes", () => {
  const idc = products.find((p) => p.name === "iDontCry");
  assert.ok(idc);
  const circuitLinks = (idc.links ?? []).filter((l) => l.href.includes("/games/circuit"));
  assert.equal(circuitLinks.length, 1,
    "Open Mirror lists ONE CircuitSwitchGame door — you switch circuits inside the game");
  assert.equal(circuitLinks[0].href, "https://idontcry.com/games/circuit");
  assert.ok(circuitLinks[0].label.includes("CircuitSwitchGame"));
  assert.ok(START_HERE.some((s) => s.href === "https://idontcry.com/games/circuit"),
    "the arcade is strong enough to belong in Try This First");
});

test("the homepage no longer groups the family by internal development stage", () => {
  const page = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
  assert.ok(!page.includes("STATUS_ORDER"),
    "status groups tell the visitor which things are finished — that is a studio question");
  assert.ok(page.includes("START_HERE"));
  assert.ok(page.includes("shelves()"));
});

test("iDontCry links point at canonical routes, never a retired one", () => {
  const idc = products.find((p) => p.name === "iDontCry");
  for (const l of idc?.links ?? []) {
    assert.ok(!l.href.includes("/games/circuit/football"), `${l.href} is a legacy sport route`);
    assert.ok(!l.href.includes("/games/circuit/classic/ring"), `${l.href} is a retired menu route`);
    assert.ok(!l.href.endsWith("/games/circuit/surge"), `${l.href} is a retired menu route`);
  }
});

test("a shelf never claims a product the registry hides", () => {
  for (const key of SHELF_ORDER) {
    for (const p of shelfProducts(key)) {
      assert.notEqual(p.showInPortfolio, false, `${p.name} is hidden but shelved on ${key}`);
    }
  }
});

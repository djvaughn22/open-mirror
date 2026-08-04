// ─────────────────────────────────────────────────────────────────────────────
// Build Machine expansion guards (2026-08-04).
//
// The offering became a three-door refurbished-computer business:
// Buy a Build Machine · Build Your Own · Sell or Donate. These tests lock
// the honesty rules: no fake inventory, no serials or costs in public data,
// the DIY path preserved, and the interest form collecting only what's
// necessary through the safest mechanism (mailto).
// ─────────────────────────────────────────────────────────────────────────────

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  BUILD_MACHINE_CATEGORIES,
  INVENTORY,
  availableListings,
  isListable,
  toPublicListing,
  type BuildMachineInventoryRecord,
} from "../src/lib/buildMachineInventory.ts";
import {
  INTEREST_TYPES,
  buildInterestEmailBody,
  buildInterestMailto,
} from "../src/lib/buildMachineInterest.ts";

const repoRoot = join(import.meta.dirname, "..");
const PAGE = readFileSync(
  join(repoRoot, "src/app/products/old-laptop-to-build-machine/page.tsx"),
  "utf8"
);
const FORM = readFileSync(
  join(
    repoRoot,
    "src/app/products/old-laptop-to-build-machine/BuildMachineInterestForm.tsx"
  ),
  "utf8"
);

const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// ── Inventory honesty ───────────────────────────────────────────────────────

const SAMPLE: BuildMachineInventoryRecord = {
  id: "BM-TEST",
  category: "Build Machine Mini",
  manufacturer: "Example",
  model: "Model",
  formFactor: "Mini PC",
  processor: "Intel Core i5-6500T",
  ram: "16 GB",
  storage: "256 GB SSD",
  graphics: "Integrated",
  displaySize: "",
  batteryHealth: "",
  chargerIncluded: true,
  cosmeticGrade: "B",
  functionalTestStatus: "passed",
  sanitizationStatus: "sanitized",
  managementLockStatus: "none-found",
  availabilityStatus: "available",
  targetPriceUsd: 249,
  warrantyPeriod: "See listing",
  photos: ["/products/test.jpg"],
  publicConditionNotes: "Light scratches on the lid.",
  workPerformed: ["New SSD"],
  knownLimitations: [],
  privateIntake: {
    serialNumber: "SN-SECRET-123",
    acquisitionCostUsd: 25,
    partsCostUsd: 30,
    laborHours: 2,
    totalLandedCostUsd: 80,
    finalSalePriceUsd: null,
    intakeNotes: "confidential",
  },
};

test("inventory starts empty — no fabricated listings", () => {
  assert.equal(INVENTORY.length, 0, "INVENTORY must stay empty until real tested machines exist");
  assert.deepEqual(availableListings(), []);
});

test("the public projection never leaks serials, costs, or intake notes", () => {
  const pub = toPublicListing(SAMPLE) as unknown as Record<string, unknown>;
  const json = JSON.stringify(pub);
  assert.doesNotMatch(json, /SN-SECRET|confidential/, "private intake data leaked");
  assert.equal(pub.privateIntake, undefined);
  assert.equal(pub.serialNumber, undefined);
  for (const key of Object.keys(pub)) {
    assert.doesNotMatch(key, /serial|cost|labor|intake/i, `suspicious public field: ${key}`);
  }
});

test("a machine is listable only after every gate passes", () => {
  assert.equal(isListable(SAMPLE), true);
  assert.equal(isListable({ ...SAMPLE, functionalTestStatus: "not-tested" }), false, "untested machines are never advertised");
  assert.equal(isListable({ ...SAMPLE, sanitizationStatus: "pending" }), false, "unsanitized machines are never advertised");
  assert.equal(isListable({ ...SAMPLE, managementLockStatus: "locked" }), false);
  assert.equal(isListable({ ...SAMPLE, managementLockStatus: "unknown" }), false);
  assert.equal(isListable({ ...SAMPLE, targetPriceUsd: null }), false, "no listing without an exact price");
  assert.equal(isListable({ ...SAMPLE, photos: [] }), false, "no listing without real photographs");
  assert.equal(isListable({ ...SAMPLE, publicConditionNotes: " " }), false, "no listing without condition notes");
  assert.equal(isListable({ ...SAMPLE, availabilityStatus: "in-preparation" }), false);
});

test("the five build machine categories are exactly the locked lineup", () => {
  assert.deepEqual([...BUILD_MACHINE_CATEGORIES], [
    "Build Machine Laptop",
    "Build Machine Desktop",
    "Build Machine Mini",
    "Build Machine Workstation",
    "Build Machine Mac",
  ]);
});

// ── Interest form ───────────────────────────────────────────────────────────

test("the interest types are exactly the five owner-approved lanes", () => {
  assert.deepEqual([...INTEREST_TYPES], [
    "I want to buy a Build Machine",
    "I want to transform my own computer",
    "My business has retired computers",
    "I have computers to sell or donate",
    "I want first-batch availability updates",
  ]);
});

test("the interest email composes safely and asks for no private data", () => {
  const body = buildInterestEmailBody({
    name: "A <b>Name</b>",
    email: "a@example.com",
    interestType: "I have computers to sell or donate",
    approximateQuantity: "12",
    computerType: "Mini PC",
    manufacturerModel: "Dell OptiPlex",
    cityState: "St. Louis, MO",
    message: "Retired\n\noffice machines",
  });
  assert.doesNotMatch(body, /[<>]/, "angle brackets are sanitized out");
  assert.match(body, /sell or donate/);
  assert.match(body, /do not include serial numbers, passwords/i);
  const mailto = buildInterestMailto("ask@example.com", {
    name: "A",
    email: "a@example.com",
    interestType: INTEREST_TYPES[0],
    approximateQuantity: "",
    computerType: "",
    manufacturerModel: "",
    cityState: "",
    message: "",
  });
  assert.match(mailto, /^mailto:ask@example\.com\?subject=/);
});

test("the interest form is mailto-only and never collects secrets", () => {
  const shipped = stripComments(FORM);
  assert.doesNotMatch(shipped, /fetch\(|\/api\//, "the interest form must not grow a backend without owner approval");
  assert.doesNotMatch(shipped, /type="password"/i);
  assert.doesNotMatch(shipped, /serial number(?!s, passwords)/i, "never a serial-number field");
  assert.doesNotMatch(shipped, /card number|cvv|routing|social security|\bssn\b/i);
  assert.match(FORM, /buildInterestMailto/, "submission composes the mailto");
});

// ── Page structure and honesty ──────────────────────────────────────────────

test("the page carries all three doors", () => {
  assert.match(PAGE, /id="buy"/, "Buy a Build Machine door");
  assert.match(PAGE, /id="build-your-own"/, "Build Your Own door — the DIY path is never removed");
  assert.match(PAGE, /id="sell-or-donate"/, "Sell or Donate door");
  assert.match(PAGE, /id="interest"/, "interest form anchor");
  assert.match(PAGE, /Buy a Build Machine/);
  assert.match(PAGE, /Build Your Own/);
  assert.match(PAGE, /Sell or Donate Computers/i);
});

test("the DIY and conversion paths survive the expansion", () => {
  assert.match(PAGE, /Build It Yourself/, "the self-service playbook card stays");
  assert.match(PAGE, /Join the release list/);
  assert.match(PAGE, /Start a device request/, "the conversion request stays");
  assert.match(PAGE, /old-laptop-readiness-check\.pdf/, "the free readiness download stays");
});

test("the buy door stays honest until real inventory exists", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /Inventory coming soon/, "the empty state must be labeled honestly");
  assert.match(shipped, /individually tested inventory/i);
  assert.match(shipped, /availableListings\(\)/, "listings render only from the inventory module");
  assert.doesNotMatch(shipped, /\d+\s+(machines|units|computers)\s+(in stock|available|sold)/i, "no fabricated counts");
  assert.doesNotMatch(shipped, /(?<!\w)review(ed)? by \d|customer review|★|⭐/i, "no fabricated reviews");
  assert.doesNotMatch(shipped, /original(ly)? priced|percent off|% off|discount/i, "no fake discounts");
  assert.doesNotMatch(shipped, /10[-–]20x|markup/i, "internal margin targets never reach customer copy");
});

test("the buy door never overpromises and never claims certification", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /not promised to run large AI models locally/i);
  assert.doesNotMatch(shipped, /certified data destruction[^,.]*(included|guaranteed|performed)/i, "no certification claim");
  assert.match(shipped, /intended to follow documented media-sanitization practices/i);
  assert.doesNotMatch(shipped, /\bmagical\b|\brevolutionary\b|guaranteed to (create|launch) a business/i);
});

test("the sell-or-donate door protects employers and sourcing privacy", () => {
  assert.match(PAGE, /authorized asset-disposition process/i);
  const shipped = stripComments(PAGE);
  assert.doesNotMatch(shipped, /\bemployer'?s? of\b|workplace sourcing|my employer/i, "no workplace sourcing details");
});

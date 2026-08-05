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

// ─────────────────────────────────────────────────────────────────────────────
// Ecosystem correction locks (2026-08-04, owner brief): the Build Machine is
// the physical entrance into iDontCry → Step In The Ring → local tools →
// MVP1 — never a generic refurbished Linux computer with a random list of
// free developer applications.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SOFTWARE_MANIFEST,
  TIER_PROFILES,
  IDONTCRY_ROUTES,
  SITR_ROUTES,
} from "../src/lib/buildMachineSoftware.ts";
import {
  FEATURED_IDONTCRY,
  FEATURED_ENGINES,
  JOURNEY_STEPS,
} from "../src/lib/buildMachineEcosystem.ts";

// Engine ids verified in step-in-the-ring/app/engines/engines.ts on
// 2026-08-04, with their honest activation. Re-verify against the SITR repo
// before changing this list.
const VERIFIED_PUBLIC_ENGINES = new Set([
  "idea", "build", "sell", "launch", "fix", "grow", "plan", "etsy",
  "design-shop", "howto", "music",
]);
const OWNER_ONLY_ENGINES = new Set(["game", "story"]);

test("every featured engine exists publicly and no owner-only engine is advertised", () => {
  for (const e of FEATURED_ENGINES) {
    assert.ok(VERIFIED_PUBLIC_ENGINES.has(e.id), `${e.id} is not a verified public engine`);
    assert.ok(!OWNER_ONLY_ENGINES.has(e.id), `${e.id} is owner-only and must never be advertised`);
    assert.match(e.url, /^https:\/\/stepinthering\.com\/engines\?engine=/, "engines deep-link via query param on the real domain");
    assert.ok(e.status === "Works" || e.status === "Beta", "status mirrors SITR's honest labels");
  }
  const featuredIds = FEATURED_ENGINES.map((e) => e.id);
  assert.ok(featuredIds.includes("idea"), "the Idea Engine anchors the progression");
});

test("every featured iDontCry experience uses a verified route on the real domain", () => {
  const verified = new Set(Object.values(IDONTCRY_ROUTES).filter((v) => typeof v === "string"));
  for (const x of FEATURED_IDONTCRY) {
    assert.ok(verified.has(x.url), `${x.name} links to unverified route ${x.url}`);
    assert.match(x.url, /^https:\/\/idontcry\.com/, "iDontCry links go to the real product, never hub copies");
  }
});

test("the journey runs playground → choice → build → local → iterate → MVP1", () => {
  assert.equal(JOURNEY_STEPS.length, 6);
  assert.match(JOURNEY_STEPS[0].where, /iDontCry/);
  assert.match(JOURNEY_STEPS[2].where, /Step In The Ring/);
  assert.match(JOURNEY_STEPS[3].where, /Build Machine/i);
  assert.equal(JOURNEY_STEPS[5].title, "MVP1");
  assert.match(PAGE, /id="the-journey"/);
  assert.match(PAGE, /JOURNEY_STEPS\.map/, "the page renders the journey from the shared data");
  assert.match(PAGE, /physical entrance into the Open Mirror\s+ecosystem/i);
});

test("iDontCry is the starting playground and SITR the deeper building environment", () => {
  assert.match(PAGE, /Start in iDontCry/);
  assert.match(PAGE, /games, creative\s+tools, and ideas worth trying/i);
  assert.match(PAGE, /family playground/i, "iDontCry stays a real product, not a funnel");
  assert.match(PAGE, /promising idea becomes a real first\s+build/i);
  assert.match(PAGE, /FEATURED_IDONTCRY\.map/);
  assert.match(PAGE, /FEATURED_ENGINES\.map/);
});

test("every installed tool maps to the ecosystem — no random developer catalog", () => {
  for (const s of SOFTWARE_MANIFEST) {
    assert.ok(
      s.relatedIDontCry.length + s.relatedSITR.length > 0,
      `${s.id} answers no ecosystem question — it does not belong in the manifest`
    );
    for (const engineId of s.relatedSITR) {
      assert.ok(VERIFIED_PUBLIC_ENGINES.has(engineId), `${s.id} references unknown engine ${engineId}`);
    }
    for (const routeKey of s.relatedIDontCry) {
      assert.ok(routeKey in IDONTCRY_ROUTES, `${s.id} references unknown iDontCry route ${routeKey}`);
    }
    assert.equal(s.freeToUseLocally, true, `${s.id} must be free to use locally`);
    assert.equal(s.requiresOpenMirrorAccount, false, `${s.id} must not require an Open Mirror account`);
    assert.ok(s.publicExplanation.length > 20 && s.verifyCommand.length > 0);
  }
  assert.match(PAGE, /softwareByCategory\(\)\.map/, "the page derives software from the canonical manifest");
});

test("heavy services never default onto the entry tier", () => {
  for (const s of SOFTWARE_MANIFEST.filter((x) => x.category === "Advanced building")) {
    assert.ok(!s.tiers.includes("Start"), `${s.id} must not ship on Build Machine Start`);
  }
  assert.equal(TIER_PROFILES.map((t) => t.tier).join(","), "Start,Standard,Pro");
});

test("subscription honesty: nothing included, nothing locked, nothing preconfigured", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /No subscription, account, or paid entitlement is included/i);
  assert.match(shipped, /terms[^.]*shown before you sign up/i);
  assert.match(shipped, /remains a fully working Linux computer/i, "the machine must stay usable without subscribing");
  assert.match(shipped, /No account of any kind is preconfigured/i);
  assert.match(shipped, /no payment information is ever stored/i);
  assert.doesNotMatch(shipped, /includes? (a |your )?(free |lifetime )?subscription/i, "never claim an included subscription");
  assert.doesNotMatch(shipped, /lifetime (subscription|access)/i);
  assert.match(shipped, /accounts you create and own/i, "outside accounts are clearly the customer's own");
});

test("no automatic cross-product synchronization is claimed", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /No\s+automatic transfer or synchronization between the products is\s+claimed/i);
  assert.doesNotMatch(shipped, /automatically (syncs?|transfers?|moves?)/i);
  assert.doesNotMatch(shipped, /seamless(ly)?/i, "no seamless-integration language");
});

test("the page never uses pressure-sales actions", () => {
  const shipped = stripComments(PAGE);
  assert.doesNotMatch(shipped, /order now|buy now|reserve yours|limited quantit|shop machines|only \d+ left/i);
});

test("customer ownership language stays visible", () => {
  assert.match(PAGE, /You own your original\s+ideas/i);
  assert.match(PAGE, /ideas,\s+projects, and output remain yours/i);
});

test("the first-run guide exists and creates no Open Mirror login", () => {
  const guide = readFileSync(
    join(repoRoot, "content/products/old-laptop-to-build-machine/first-run/FIRST-RUN-GUIDE.md"),
    "utf8"
  );
  assert.match(guide, /no\s+Open Mirror, DJ, or service login anywhere on this machine/i);
  assert.match(guide, /No payment information is ever stored/i);
  assert.match(guide, /idontcry\.com/);
  assert.match(guide, /stepinthering\.com\/engines/);
  assert.match(guide, /Nothing transfers automatically/i);
  assert.match(guide, /MVP1/);
});

// ─────────────────────────────────────────────────────────────────────────────
// Membership-era corrections (2026-08-04, second owner brief).
// ─────────────────────────────────────────────────────────────────────────────

test("Fambookagram is not featured anywhere on the Build Machine page", () => {
  assert.ok(
    !FEATURED_IDONTCRY.some((x) => /fambookagram|friendbookagram/i.test(x.name + x.url)),
    "the retired playground pages must never be featured"
  );
  assert.doesNotMatch(stripComments(PAGE), /fambookagram|friendbookagram/i);
  assert.ok(
    FEATURED_IDONTCRY.some((x) => x.url === "https://idontcry.com/welcome"),
    "the family welcome replaced Fambookagram"
  );
});

test("installed-software claims are planned, not definitive", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /planned free software setup/i);
  assert.match(shipped, /planned to include these free\s+tools/i);
  assert.match(shipped, /confirmed after the pilot machines pass\s+installation and hardware testing/i);
  assert.match(shipped, /planned to contain/i, "the finished-machine list is planned, not promised");
  assert.doesNotMatch(shipped, /comes installed|installed on every machine|every build machine includes/i);
  assert.match(shipped, /self-service materials[\s\S]{0,120}real today/i, "existing self-service materials stay honestly available");
});

test("the ecosystem actions lead with free start and honest membership", () => {
  const shipped = stripComments(PAGE);
  assert.match(shipped, /Start Free in iDontCry/);
  assert.match(shipped, /See Step In The Ring Membership/);
  assert.match(shipped, /See the Planned Free Software Setup/);
  assert.match(shipped, /PRICING\.sitrMembershipMonthly/, "the membership price renders only from the central PRICING config");
  assert.match(shipped, /billed monthly, cancel any time/i);
});

test("the membership link carries only the privacy-safe source label", () => {
  assert.equal(SITR_ROUTES.membership, "https://stepinthering.com/membership?source=build-machine");
});

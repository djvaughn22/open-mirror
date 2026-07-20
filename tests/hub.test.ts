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
  navGroups,
  navProductOrder,
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

// 2026-07-19: the packaged product broadened from laptops to old computers
// (laptops, mini PCs, small desktops, selected towers). The route keeps its
// original /products/old-laptop-to-build-machine URL.
test("Old Computer to Build Machine is the featured product", () => {
  const featured = featuredProduct();
  assert.equal(featured?.name, "Old Computer to Build Machine");
  assert.equal(featured?.access, "Product");
  assert.equal(featured?.href, "/products/old-laptop-to-build-machine", "the original URL must never break");
});

test("Old Computer is marked Preparing for Release", () => {
  assert.equal(featuredProduct()?.accessNote, "Preparing for Release");
});

test("exactly one product is featured", () => {
  assert.equal(products.filter((p) => p.featured === true).length, 1);
});

test("Old Computer does NOT appear on the homepage (featured products are About-only)", () => {
  // The homepage only shows groups filtered by status and showInPortfolio.
  // A featured product should not be in the status groups on the homepage.
  const featured = featuredProduct();
  assert.ok(featured, "featured product exists");
  const homepageItems = products.filter(
    (p) => p.status !== "archived" && p.showInPortfolio !== false && p.pinBottom !== true && p.featured !== true
  );
  assert.ok(!homepageItems.some((p) => p.name === "Old Computer to Build Machine"), "Old Computer must not appear on homepage");
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
  const exploring = navGroups().find((g) => g.key === "exploring");
  assert.equal(exploring?.heading, "Exploring ideas", "nav needs a labelled Exploring ideas group");
  assert.deepEqual(
    exploring?.items.map((p) => p.name),
    ["Fambookagram", "Friendbookagram"],
    "both exploring ideas belong in the menu"
  );
});

// ── Shared navigation order ────────────────────────────────────────────────
//
// Owner rule: the Foundation opens the menu and the packaged product closes
// it. These lock the order itself, not one component's markup.

test("the nav derives its order from the registry, not a hard-coded list", () => {
  const nav = readFileSync(join(repoRoot, "src/components/OpenMirrorNav.tsx"), "utf8");
  // Compact menu (2026-07-19): the homepage is the directory, so the menu
  // carries only Home, the Foundation, About, Contact, pinned resources, and
  // the packaged product — every product row still pulled from the registry.
  assert.match(nav, /foundationProduct\(\)/, "the Foundation row must come from the registry");
  assert.match(nav, /bottomPinnedProducts\(\)/, "pinned resources must come from the registry");
  assert.match(nav, /featuredProduct\(\)/, "the packaged product row must come from the registry");
  // A second hand-kept array of names is how ordering silently drifted before.
  assert.doesNotMatch(nav, /const FAMILY\b/, "no competing hard-coded menu array");
  for (const p of products) {
    assert.doesNotMatch(
      nav,
      new RegExp(`["']${p.name}["']`),
      `${p.name} must not be named directly in the nav component`
    );
  }
});

test("CrossHeartPray is first in shared navigation", () => {
  assert.equal(navProductOrder()[0]?.name, "CrossHeartPray");
  assert.equal(navGroups()[0]?.key, "foundation", "the Foundation group opens the menu");
});

test("Old Computer to Build Machine is last in shared navigation", () => {
  const order = navProductOrder();
  assert.equal(
    order.at(-1)?.name,
    "Old Computer to Build Machine",
    "the packaged product must close the menu"
  );
  assert.equal(navGroups().at(-1)?.key, "product", "the product group is the final group");
});

test("Old Computer sits below PleaseBeReady and every free project", () => {
  const names = navProductOrder().map((p) => p.name);
  const laptop = names.indexOf("Old Computer to Build Machine");
  assert.ok(laptop > names.indexOf("PleaseBeReady"), "Old Computer must follow PleaseBeReady");
  for (const name of ["TheDJCares", "iDontCry", "OpenDoku", "WhatAmIAI", "Fambookagram", "Friendbookagram"]) {
    assert.ok(laptop > names.indexOf(name), `Old Computer must follow ${name}`);
  }
});

test("shared navigation follows the owner's group order", () => {
  assert.deepEqual(
    navGroups().map((g) => g.key),
    ["foundation", "free", "inProgress", "exploring", "resources", "product"],
    "Foundation → public → building → exploring → resources → product"
  );
});

test("Old Computer stays in shared navigation, labelled honestly", () => {
  const laptop = byName("Old Computer to Build Machine");
  assert.notEqual(laptop.showInNav, false, "Old Computer must stay reachable from the menu");
  assert.ok(
    navProductOrder().some((p) => p.name === laptop.name),
    "Old Computer must appear in the shared menu"
  );
  assert.equal(`${laptop.access} · ${laptop.accessNote}`, "Product · Preparing for Release");
});

test("shared navigation shows every public product exactly once", () => {
  const names = navProductOrder().map((p) => p.name);
  assert.deepEqual([...new Set(names)], names, "no product may appear in two menu groups");
  for (const p of products) {
    if (p.showInNav === false) continue;
    assert.ok(names.includes(p.name), `${p.name} is public but reaches no menu group`);
  }
});

test("Reflect never reaches the shared menu", () => {
  assert.ok(!navProductOrder().some((p) => p.name === "Reflect"));
});

// ── Reflect stays hidden ────────────────────────────────────────────────────

test("Reflect remains hidden everywhere public", () => {
  const reflect = byName("Reflect");
  assert.equal(reflect.showInPortfolio, false);
  assert.equal(reflect.showInAbout, false);
  assert.equal(reflect.showInNav, false);
  assert.equal(publicOnAbout("Reflect"), false, "Reflect must not leak onto About");
});

// ── About is the origin story, not a second homepage ───────────────────────
//
// Owner rule (2026-07-19): the About page tells the origin and purpose story
// only. The project directory lives on the homepage; credits, resources, and
// products live on their own pages. These lock the catalog out of About and
// keep the closing action pointed at the real directory.

test("About carries no project directory, product panel, resources, or credits", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.doesNotMatch(about, /aboutFamilyProducts\(/, "the project directory lives on the homepage, not About");
  assert.doesNotMatch(about, /featuredProduct\(|FeaturedPanel/, "no product promotion on About");
  assert.doesNotMatch(about, /Free resources/, "resources belong on their own pages");
  assert.doesNotMatch(about, /Credits and sources/, "the credits directory lives off About (src/lib/credits.ts)");
  assert.doesNotMatch(about, /readiness-check/, "no product downloads promoted from About");
});

test("About keeps its one registry-derived CrossHeartPray link and closes into the directory", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /foundationProduct\(\)/, "the CrossHeartPray link must come from the registry");
  assert.match(about, /See what is live/, "About must close with the quiet path home");
  assert.match(about, /href="\/"/, "the closing action must land on the homepage directory");
  // The disclaimer anchor keeps old deep links working.
  assert.match(about, /id="disclaimer"/, "existing #disclaimer deep links must still land");
});

// ── The locked haikus ────────────────────────────────────────────────────────
// Owner rule (2026-07-19): these three haikus are LOCKED, word for word,
// heading for heading. They were once silently replaced; this test makes any
// rewrite fail loudly. Never "improve" them. They left the About page the
// same day (About became the origin story) but the words stay preserved in
// src/lib/haikus.ts for wherever they appear next.

const LOCKED_HAIKUS: { title: string; lines: string[] }[] = [
  {
    title: "Start",
    lines: ["Pick one thing to build", "Start before the plan is done", "Make the first version."],
  },
  {
    title: "Improve",
    lines: ["Build it, test it, learn", "Keep what works and cut the rest", "Then build it better."],
  },
  {
    title: "Get it live",
    lines: ["Bring me what you built", "I will find the real next step", "Then ship something real."],
  },
];

test("the locked haikus are preserved exactly as the owner wrote them", () => {
  const src = readFileSync(join(repoRoot, "src/lib/haikus.ts"), "utf8");
  for (const haiku of LOCKED_HAIKUS) {
    assert.ok(src.includes(`"${haiku.title}"`), `haiku heading "${haiku.title}" is missing`);
    for (const line of haiku.lines) {
      assert.ok(src.includes(`"${line}"`), `haiku line "${line}" was changed or removed`);
    }
  }
  for (const retired of ["Cross Heart Pray came first", "One build led to more", "Build what feels alive"]) {
    assert.ok(!src.includes(retired), `retired haiku line "${retired}" must not come back`);
  }
});

test("only Reflect is deliberately excluded from the public registry surfaces", () => {
  const excluded = products.filter((p) => p.showInAbout === false).map((p) => p.name);
  assert.deepEqual(excluded, ["Reflect"], "only Reflect is intentionally hidden");
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
  // The homepage and About stay entirely price-free.
  for (const rel of ["src/app/page.tsx", "src/app/about-open-mirror/page.tsx"]) {
    const src = stripComments(readFileSync(join(repoRoot, rel), "utf8"));
    assert.doesNotMatch(src, /add to cart|buy now|proceed to checkout|\$\d/i, `${rel} must not imply a purchase`);
  }
  // The product page (2026-07-19) may show PILOT prices, but never checkout
  // language — its only actions are a release-list email and the
  // compatibility-check email.
  const productPage = "src/app/products/old-laptop-to-build-machine/page.tsx";
  const page = stripComments(readFileSync(join(repoRoot, productPage), "utf8"));
  assert.doesNotMatch(page, /add to cart|buy now|proceed to checkout|purchase now|order now|payment/i,
    `${productPage} must not imply an active checkout`);
  assert.match(page, /pilot pricing/i, "any price shown must be framed as pilot pricing");
  assert.match(page, /Join the release list/, "the playbook action is the release list, not a purchase");
  assert.match(page, /Nothing is purchasable yet/, "the page must say nothing is purchasable yet");
  // Anything labelled Product needs an honest availability qualifier.
  for (const p of products.filter((x) => x.access === "Product")) {
    assert.ok(p.accessNote, `${p.name} is a Product and needs an availability qualifier`);
  }
});

// ── The conversion pilot stays honest ───────────────────────────────────────
//
// 2026-07-19: the page carries a two-path offer (playbook + conversion
// pilot). These lock the safety copy that must never regress.

test("the conversion pilot page keeps its shipping and data-erasure warnings", () => {
  const page = readFileSync(
    join(repoRoot, "src/app/products/old-laptop-to-build-machine/page.tsx"),
    "utf8"
  );
  assert.match(page, /Do not ship anything until Open Mirror has reviewed/i,
    "customers must be told not to ship before explicit acceptance");
  assert.match(page, /internal drive will be erased/i, "the erasure warning must stay visible");
  assert.match(page, /does not include backup,\s*recovery, or transfer of personal files/i,
    "no-backup scope must stay explicit");
  assert.match(page, /desktop/i, "the offer covers desktops");
  assert.match(page, /laptop/i, "the offer covers laptops");
  assert.doesNotMatch(page, /certified data destruction[^,.]*(included|guaranteed)/i,
    "never claim certified data destruction");
  assert.doesNotMatch(page, /\bfounder\b/i, "'owner' only — never 'founder'");
});

test("the compatibility form is mailto-only and never asks for passwords", () => {
  const form = readFileSync(
    join(repoRoot, "src/app/products/old-laptop-to-build-machine/CheckMyComputerForm.tsx"),
    "utf8"
  );
  assert.match(form, /mailto:\$\{SERVICE_EMAIL\}/, "submission composes an email — no backend");
  assert.doesNotMatch(form, /fetch\(|axios|\/api\//, "the form must not post to any endpoint");
  assert.doesNotMatch(stripComments(form), /type="password"/i, "never collect a password");
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

// ── Homepage: no featured product panel ─────────────────────────────────────
//
// The homepage must never render the Old Laptop featured panel or any of its
// pieces. It reads the registry by status only; a FeaturedPanel or the launch
// image reappearing here is the exact regression these lock.

test("the homepage renders no featured-product panel", () => {
  const home = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
  assert.doesNotMatch(home, /FeaturedPanel/, "homepage must not render a featured panel");
  assert.doesNotMatch(home, /featuredProduct\(/, "homepage must not pull the featured product");
  assert.doesNotMatch(home, /old-laptop-to-build-machine/i, "homepage must not reference the laptop product image or page");
  assert.doesNotMatch(home, /Preparing for Release/, "homepage must not carry the product's release label");
});

// The old About-ordering locks (family before product, resources above the
// panel) retired with the catalog itself — "About carries no project
// directory" above is the lock that replaced them.

// ── Contact copy ────────────────────────────────────────────────────────────
// Owner brief (2026-07-19, work-with rewrite): Contact says plainly that
// people can hire or collaborate with Open Mirror. These locks replaced the
// earlier say-less locks at the owner's direction.

test("Contact carries the work-with structure", () => {
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.match(services, /Work with Open Mirror/, "the eyebrow announces working with Open Mirror");
  assert.match(services, /Let’s build something real\./, "the headline is the owner's line");
  assert.match(services, /Shape the idea/, "card one: shape the idea");
  assert.match(services, /Improve the build/, "card two: improve the build");
  assert.match(services, /Find the next step/, "card three: find the next step");
  assert.match(services, /Start a conversation/, "the CTA section is present");
  assert.match(services, /Tell me what you’re building/, "the primary button label");
});

test("Contact action is a mailto with the inquiry subject", () => {
  const contact = readFileSync(join(repoRoot, "src/app/contact/page.tsx"), "utf8");
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.match(contact, /mailto:\$\{SERVICE_EMAIL\}\?subject=/, "the action is a mailto with a subject");
  assert.match(services, /Open Mirror project inquiry/, "the subject line is locked");
  assert.match(contact, /\{SERVICE_EMAIL\}/, "the address stays visible on the page");
});

test("Contact availability note is confident, not apologetic", () => {
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.match(services, /built outside my full-time work/, "the availability note names the reality plainly");
  assert.match(services, /reply personally during evenings and weekends/, "and says when replies come");
  assert.doesNotMatch(services, /sorry|apolog|unfortunately|please note|be patient/i,
    "no apologetic or warning language around availability");
});

test("Contact makes no forbidden promises and collects nothing", () => {
  const contact = readFileSync(join(repoRoot, "src/app/contact/page.tsx"), "utf8");
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.doesNotMatch(contact, /ContactForm/, "the intake form stays retired");
  assert.ok(!existsSync(join(repoRoot, "src/components/ContactForm.tsx")), "ContactForm.tsx stays deleted");
  assert.ok(!existsSync(join(repoRoot, "src/app/api/intake/route.ts")), "the intake route stays deleted");
  assert.doesNotMatch(contact + services, /guarantee|turnaround|response time|24 hours|48 hours/i,
    "no promises about turnaround or results");
  assert.doesNotMatch(contact + services, /\$\d|pricing|per hour|hourly|book a call|calendar|calendly|phone/i,
    "no pricing, booking, or phone numbers");
  assert.doesNotMatch(contact + services, /founder/i, "'owner', never 'founder'");
});

// ── Disclaimer copy ─────────────────────────────────────────────────────────
// Owner brief (2026-07-19): the full ten-section disclaimer replaced the
// three-sentence version at the owner's direction.

test("Disclaimer carries all ten sections and the dateline", () => {
  const disclaimer = readFileSync(join(repoRoot, "src/app/disclaimer/page.tsx"), "utf8");
  const headings = [
    "General information",
    "Provided as-is",
    "Not professional advice",
    "Artificial intelligence",
    "Third-party services",
    "Names and trademarks",
    "Your responsibility",
    "Limitation of responsibility",
    "Independent ownership",
    "Questions",
  ];
  for (const heading of headings) {
    assert.ok(disclaimer.includes(heading), `Disclaimer section present: ${heading}`);
  }
  assert.match(disclaimer, /Last updated: July 2026/, "the small-print dateline is present");
  assert.match(disclaimer, /owner’s full-time employer/, "the employer is referenced, never named");
  assert.doesNotMatch(disclaimer, /founder/i, "'owner', never 'founder'");
});

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
// services.ts imports ./products without an extension (fine for Next, not for
// the strip-types test runner), so its locks below scan the source instead.
import { BE_PREPARED_CARD, OPEN_MIRROR_RESALE_CARD, liveDestinations } from "../src/lib/destinations.ts";

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

// ── Fambookagram + Friendbookagram: retired 2026-08-02 ──────────────────────
// Both concepts now live inside iDontCry (idontcry.com/fambookagram and
// idontcry.com/friendbookagram). They must not reappear in the registry.

for (const name of ["Fambookagram", "Friendbookagram"]) {
  test(`${name} stays retired from the portfolio`, () => {
    assert.ok(
      !products.some((p) => p.name === name),
      `${name} was retired into iDontCry on 2026-08-02 — do not re-add it to the registry`
    );
  });
}

// ── Shared navigation order ────────────────────────────────────────────────
//
// Owner rule: the Foundation opens the menu and the packaged product closes
// it. These lock the order itself, not one component's markup.

test("the nav derives its order from the registry, not a hard-coded list", () => {
  const nav = readFileSync(join(repoRoot, "src/components/OpenMirrorNav.tsx"), "utf8");
  // Compact menu (2026-07-30): the homepage is the directory, so the menu
  // carries only Home, About, Contact, pinned resources, and the packaged
  // product — every product row still pulled from the registry. The
  // Foundation (CrossHeartPray) moved to the shared footer's ✝️ ❤️ 🙏 link;
  // it must NOT come back as a menu row.
  assert.doesNotMatch(nav, /foundationProduct\(\)/, "the Foundation belongs to the footer, not the menu");
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

// 2026-07-20 (owner): PleaseBeReady AND Old Computer both left the persistent
// menu — low-key by design, discovered through the directory, About, and their
// own pages. Their nav groups are empty and drop out of the rendered order.
test("shared navigation follows the owner's group order", () => {
  assert.deepEqual(
    navGroups().map((g) => g.key),
    ["foundation", "free", "inProgress"],
    "Foundation → public → building; resources and product stay low-key"
  );
});

test("Old Computer stays out of shared navigation but present on About, labelled honestly", () => {
  const laptop = byName("Old Computer to Build Machine");
  assert.equal(laptop.showInNav, false, "Old Computer must stay out of persistent navigation");
  assert.ok(
    !navProductOrder().some((p) => p.name === laptop.name),
    "Old Computer must not reach any menu group"
  );
  assert.equal(laptop.featured, true, "…while keeping its About featured panel");
  assert.notEqual(laptop.showInAbout, false, "…and staying discoverable on About");
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

// ── The quiet business layer (2026-07-20) ───────────────────────────────────
//
// PleaseBeReady stays discoverable — homepage directory, About reminder card,
// direct visits — but never as a persistent menu row on every page. These
// locks stop it from quietly returning to shared navigation, and stop the
// reminder card from drifting into sales copy or a dead link.

test("PleaseBeReady left the shared menu but stays in the directory", () => {
  const p = byName("PleaseBeReady");
  assert.equal(p.showInNav, false, "PleaseBeReady must stay out of persistent navigation");
  assert.notEqual(p.showInPortfolio, false, "…while staying in the homepage directory");
  assert.notEqual(p.showInAbout, false, "…and in the About family");
  assert.ok(
    !navProductOrder().some((x) => x.name === "PleaseBeReady"),
    "PleaseBeReady must not reach any menu group"
  );
  const nav = readFileSync(join(repoRoot, "src/components/OpenMirrorNav.tsx"), "utf8");
  assert.match(nav, /showInNav !== false/, "the nav must respect showInNav for pinned resources");
});

test("the Be Prepared card keeps its exact destination and message", () => {
  const live = liveDestinations(BE_PREPARED_CARD.destinations);
  assert.equal(live[0]?.href, "https://pleasebeready.com", "the destination URL is locked");
  assert.equal(live[0]?.label, "Visit PleaseBeReady.com");
  assert.equal(BE_PREPARED_CARD.heading, "Be prepared. Nothing dramatic.");
  assert.match(BE_PREPARED_CARD.closing ?? "", /ready to help/, "the closing line stays");
  const share = BE_PREPARED_CARD.share;
  assert.ok(share, "the reminder stays shareable");
  assert.equal(share.url, "https://pleasebeready.com");
  assert.equal(share.title, "Be prepared. Nothing dramatic.");
  assert.ok(share.text.trim().length > 40, "share text must never go empty");
  assert.equal(share.label, "Share this reminder");
  const copy = `${BE_PREPARED_CARD.body.join(" ")} ${share.text}`;
  assert.doesNotMatch(copy, /disaster|too late|protect your family|survival|bunker|when.*strikes/i,
    "the reminder never becomes fear copy");
});

test("Open Mirror Resale stays a gated eBay shop card, never a dead link", () => {
  assert.equal(OPEN_MIRROR_RESALE_CARD.heading, "Open Mirror Resale");
  assert.match(OPEN_MIRROR_RESALE_CARD.body.join(" "), /Real items, clearly listed, through the Open Mirror eBay Store\./,
    "the plain supporting copy is locked");
  assert.match(OPEN_MIRROR_RESALE_CARD.body.join(" "), /checkout happen(s)? on eBay/i,
    "the card must say checkout happens on eBay");

  const entry = OPEN_MIRROR_RESALE_CARD.destinations[0];
  assert.ok(entry, "the shop destination entry exists");
  assert.equal(entry.label, "Shop on eBay");
  assert.equal(entry.kind, "store");
  assert.equal(entry.external, true, "the store opens in a new tab with safe attributes");

  if (entry.enabled === false || entry.href.trim() === "") {
    // Not yet live: nothing may render — no dead links, no placeholder store.
    assert.equal(liveDestinations(OPEN_MIRROR_RESALE_CARD.destinations).length, 0,
      "the resale card stays hidden until the real eBay Store URL exists");
  } else {
    // Once enabled it must point at a real public eBay Store, never the
    // private Store Engine and never a guessed placeholder.
    assert.match(entry.href, /^https:\/\/(www\.)?ebay\.com\//, "the shop link must be a public ebay.com URL");
    assert.doesNotMatch(entry.href, /store-engine|vercel\.app|example|placeholder/i);
  }

  const copy = JSON.stringify(OPEN_MIRROR_RESALE_CARD);
  assert.doesNotMatch(copy, /treasure|rare finds|curated luxury|prepper|scarcity|sustainab/i,
    "resale copy stays grounded — no hype");
});

test("the About page renders the resale card beside PleaseBeReady in the Shops area", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /OPEN_MIRROR_RESALE_CARD/, "the resale card content comes from the destination config");
  assert.match(about, /aria-label="Shops"/, "the two shop cards share one quiet Shops area");
  assert.ok(
    about.indexOf("OPEN_MIRROR_RESALE_CARD") > about.indexOf("BE_PREPARED_CARD"),
    "PleaseBeReady stays first; the resale card sits beside/after it"
  );
});

test("the destination card component stays generic and safe", () => {
  const src = readFileSync(join(repoRoot, "src/components/AboutDestinationCard.tsx"), "utf8");
  assert.doesNotMatch(src, /PleaseBeReady|consulting|store|prepared/i,
    "no destination-specific wording inside the reusable component");
  assert.match(src, /rel(=|: )"noopener noreferrer"/, "external destinations get safe attributes");
  assert.match(src, /isShareCancel/, "share cancellation must stay quiet");
  assert.match(src, /aria-live/, "copy and share results are announced");
  assert.match(src, /enabled !== false|liveDestinations/, "disabled destinations must not render");
});

test("only enabled, labelled, linked destinations render", () => {
  const rendered = liveDestinations([
    { label: "Real", href: "https://pleasebeready.com", kind: "resource", enabled: true },
    { label: "Disabled", href: "https://example.com", kind: "store", enabled: false },
    { label: "", href: "https://example.com", kind: "etsy" },
    { label: "No link", href: "", kind: "amazon" },
  ]);
  assert.deepEqual(rendered.map((d) => d.label), ["Real"], "disabled and empty destinations stay hidden");
});

test("About renders the reminder card from its config, below the projects", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /AboutDestinationCard/, "About uses the reusable card");
  assert.match(about, /BE_PREPARED_CARD/, "the card content comes from the destination config");
  // (2026-08-02: the availability switch renders on /contact only — About
  // offers no services, just the contact and disclaimer landing sections.)
  assert.ok(
    about.indexOf("AboutDestinationCard card=") > about.indexOf('aria-label="Projects"'),
    "the reminder card sits below the projects, never above the page's own story"
  );
});

test("consulting availability is one switch with calm public lines", () => {
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.match(services, /export const AVAILABILITY: ConsultingAvailability =/,
    "the one availability switch exists");
  assert.match(services, /AVAILABILITY_LINE = AVAILABILITY_LINES\[AVAILABILITY\]/,
    "the public line derives from the switch");
  assert.match(services, /one outside project at a time/, "the one-project language is present");
  assert.doesNotMatch(services, /only one spot|\bapply now\b|accepting clients|limited spots|\bact now\b|discovery call/i,
    "availability is never an urgency tactic");
  const contact = readFileSync(join(repoRoot, "src/app/contact/page.tsx"), "utf8");
  assert.match(contact, /\{AVAILABILITY_LINE\}/, "Contact renders the availability switch");
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
// Owner brief (2026-07-20, plain-voice fix — replaces the 2026-07-19
// studio-story locks at the owner's direction): About is about Open Mirror
// and its projects, nothing else. No slogans, no manifesto sections, no
// personal names, projects straight after four opening paragraphs.

test("About is the plain business page in the owner's structure", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /Open Mirror LLC is the business behind the projects collected here\./,
    "the owner's plain opening");
  assert.match(about, /Some projects are finished\. Some are still being tested\./,
    "the honest status paragraph");
  assert.match(about, /CrossHeartPray came first and remains its own faith-based project\./,
    "CrossHeartPray named once, plainly, in the opening");
  assert.match(about, /Here is what Open Mirror is working on\./, "the Projects intro");
  // Footer landing sections (family standard, 2026-08-02): Contact and
  // Disclaimer live ON About — no services pitch, no availability line.
  assert.match(about, /id="contact"/, "the footer's Contact link must land here");
  assert.match(about, /Email me/, "the contact button label is the plain email action");
  assert.match(about, /mailto:\$\{SERVICE_EMAIL\}/, "the contact action is a direct email");
  assert.doesNotMatch(about, /AVAILABILITY_LINE/, "About offers no services — just contact");
  assert.match(about, /id="disclaimer"/, "the footer's Disclaimer link must land here");
  assert.match(about, /independently owned and operated/, "the approved independence wording");
  // Retired copy that must never come back (owner, 2026-07-20).
  assert.doesNotMatch(about, /Travis/, "no personal names on About, ever");
  assert.doesNotMatch(about, /Ideas are better|One studio|What grew from it|Built by starting|sales funnel|starting points/,
    "the studio-story slogans stay retired");
});

test("About derives every project from the registry", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /foundationProduct\(\)/, "the CrossHeartPray link must come from the registry");
  assert.match(about, /aboutFamilyProducts\(\)/, "the family list must come from the registry");
  assert.match(about, /bottomPinnedProducts\(\)/, "pinned resources must come from the registry");
  assert.match(about, /featuredProduct\(\)/, "the packaged product must come from the registry");
  for (const p of products) {
    if (p.name === "CrossHeartPray") continue; // named in the owner's copy
    assert.doesNotMatch(
      about,
      new RegExp(`["']${p.name}["']`),
      `${p.name} must not be hard-coded on About`
    );
  }
});

test("About renders the locked haikus from their single source", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.match(about, /MISSION_HAIKUS/, "haikus must be imported from src/lib/haikus.ts");
  assert.doesNotMatch(about, /Pick one thing to build/, "haiku lines are never copied inline");
});

test("About public copy stays clean", () => {
  const about = readFileSync(join(repoRoot, "src/app/about-open-mirror/page.tsx"), "utf8");
  assert.doesNotMatch(about, /\bfounder\b/i, "'owner', never 'founder'");
  assert.doesNotMatch(about, /\bAI\b|ChatGPT|Claude|artificial intelligence|\bprompt/i,
    "About never mentions AI or build tooling");
  assert.doesNotMatch(about, /ecosystem|revolutionary|disruptive|visionary|cutting-edge|powered by|\bmagic\b/i,
    "no startup language");
  // Owner's banned-phrase list (2026-07-20) — brand-copy tells stay out.
  assert.doesNotMatch(about,
    /reimagine|empower|\bmeaningful\b|innovation|\bjourney\b|born from|grew from|more than|at its heart|where ideas|worth sharing|make it real|built around|shared purpose|common home/i,
    "no AI-style brand phrases on About");
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
  // The homepage and About stay entirely price-free. The homepage's card
  // markup lives in the ProductCard client component, not page.tsx itself.
  for (const rel of ["src/app/page.tsx", "src/components/ProductCard.tsx", "src/app/about-open-mirror/page.tsx"]) {
    const src = stripComments(readFileSync(join(repoRoot, rel), "utf8"));
    assert.doesNotMatch(src, /add to cart|buy now|proceed to checkout|\$\d/i, `${rel} must not imply a purchase`);
  }
  // The product page (2026-07-19) may show PILOT prices and explain the
  // manual Novo invoice workflow, but never checkout language — its actions
  // are a release-list email and the device request form. Payment happens on
  // the hosted invoice, never on this site.
  const productPage = "src/app/products/old-laptop-to-build-machine/page.tsx";
  const page = stripComments(readFileSync(join(repoRoot, productPage), "utf8"));
  assert.doesNotMatch(page, /add to cart|buy now|proceed to checkout|purchase now|order now|pay now/i,
    `${productPage} must not imply an active checkout`);
  assert.match(page, /no payment is taken on\s+this website/i,
    "the page must say no payment is taken on this website");
  assert.doesNotMatch(page, /paypal\.me|friends and family|venmo\.com|@[a-z0-9_]+\s*on venmo/i,
    "never a personal payment handle or Friends-and-Family instruction");
  assert.doesNotMatch(page, /\$\d/, "dollar amounts come only from the centralized PRICING config");
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

// 2026-07-19 (later the same day): the mailto-only compatibility check grew
// into the real device-request workflow — server endpoint, owner review,
// manual Novo invoice. The locks below replace the old mailto-only rule.
test("the device request form posts to the request endpoint and never asks for secrets", () => {
  const form = readFileSync(
    join(repoRoot, "src/app/products/old-laptop-to-build-machine/DeviceRequestForm.tsx"),
    "utf8"
  );
  assert.match(form, /fetch\("\/api\/device-request"/, "submission posts to the server endpoint");
  assert.match(form, /mailto:\$\{SERVICE_EMAIL\}/, "the email fallback must exist for the disabled state");
  const shipped = stripComments(form);
  assert.doesNotMatch(shipped, /type="password"/i, "never collect a password");
  assert.doesNotMatch(shipped, /card number|cvv|routing number|social security|\bssn\b/i, "never collect payment or identity credentials");
  assert.doesNotMatch(shipped, /process\.env/, "no server env leaks into the client form");
  assert.match(form, /name="website"/, "the honeypot field must stay");
  assert.doesNotMatch(shipped, /OM-DEV-[A-Z2-9]/, "request numbers are server-generated, never client-side");
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

// ── Feature-level direct links (2026-08-11: click the thing, open the thing)
//
// Owner rule: selecting a named game/engine/feature from the hub must open
// THAT exact experience, never just the parent domain's homepage. These lock
// the verified direct routes in place and stop admin/owner-only tooling from
// ever leaking into a public card.

const FORBIDDEN_LINK_SEGMENTS = [
  "/admin", "/owner", "/engines", "/lab", "/uat", "/account",
  "/api/", "localhost", "127.0.0.1", "/login",
];

test("no product or sub-link ever points at localhost or a test URL", () => {
  for (const p of products) {
    assert.doesNotMatch(p.href, /localhost|127\.0\.0\.1|0\.0\.0\.0|:3000|:3001|vercel\.app/i,
      `${p.name} href must be a real production URL`);
    for (const l of p.links ?? []) {
      assert.doesNotMatch(l.href, /localhost|127\.0\.0\.1|0\.0\.0\.0|:3000|:3001|vercel\.app/i,
        `${p.name} sub-link "${l.label}" must be a real production URL`);
    }
  }
});

test("no sub-link ever exposes an admin/owner/internal route", () => {
  for (const p of products) {
    for (const l of p.links ?? []) {
      for (const segment of FORBIDDEN_LINK_SEGMENTS) {
        assert.doesNotMatch(l.href.toLowerCase(), new RegExp(segment.replace(/[/.]/g, "\\$&")),
          `${p.name} sub-link "${l.label}" (${l.href}) must never expose ${segment}`);
      }
    }
  }
});

test("every feature sub-link stays on its own product's domain", () => {
  for (const p of products) {
    if (!p.links?.length || !p.href.startsWith("http")) continue;
    const parentHost = new URL(p.href).host;
    for (const l of p.links) {
      assert.equal(new URL(l.href).host, parentHost,
        `${p.name} sub-link "${l.label}" must stay on ${parentHost}, not link out to another domain`);
    }
  }
});

test("a sub-link is never identical to its own product's bare homepage", () => {
  for (const p of products) {
    for (const l of p.links ?? []) {
      assert.notEqual(l.href.replace(/\/$/, ""), p.href.replace(/\/$/, ""),
        `${p.name} sub-link "${l.label}" must be a specific feature route, not the bare homepage`);
    }
  }
});

// The exact verified routes, so a future edit can't silently regress a named
// feature back to a homepage link or a guessed/renamed path.
const EXPECTED_FEATURE_LINKS: Record<string, string[]> = {
  CrossHeartPray: [
    "https://crossheartpray.com/daily-hope",
    "https://crossheartpray.com/bible-reading-plan",
    "https://crossheartpray.com/life-essentials",
    "https://crossheartpray.com/explorebible",
  ],
  // 2026-08-16: CircuitSwitchGame is ONE door — its five circuits are one
  // tap from each other INSIDE the game, so listing them separately here
  // would rebuild the pile of prototypes the platform replaced. The four
  // sports use the canonical roots from the Aug 2026 IA correction.
  iDontCry: [
    "https://idontcry.com/games/circuit",
    "https://idontcry.com/games/football",
    "https://idontcry.com/games/baseball",
    "https://idontcry.com/games/skiing",
    "https://idontcry.com/games/track-and-field",
    "https://idontcry.com/piano",
  ],
  StepInTheRing: [
    "https://stepinthering.com/build",
    "https://stepinthering.com/how",
    "https://stepinthering.com/build-machine",
  ],
  OpenDoku: [
    "https://opendoku.com/slopedoku/",
    "https://opendoku.com/surfdoku/",
    "https://opendoku.com/minedoku/",
  ],
};

for (const [name, hrefs] of Object.entries(EXPECTED_FEATURE_LINKS)) {
  test(`${name} exposes its verified direct feature routes, not just its homepage`, () => {
    const p = byName(name);
    assert.ok(p.links && p.links.length > 0, `${name} must carry direct feature links`);
    assert.deepEqual((p.links ?? []).map((l) => l.href), hrefs,
      `${name}'s exposed routes changed — confirm the new route is real and public before updating this lock`);
  });
}

test("the homepage renders each product's direct feature sub-links, not just its main card link", () => {
  // The card markup (including each product's expandable feature list)
  // lives in the ProductCard client component; page.tsx just maps the
  // registry into it.
  const productCard = readFileSync(join(repoRoot, "src/components/ProductCard.tsx"), "utf8");
  assert.match(productCard, /p\.links\.map/, "ProductCard must render a product's sub-links as direct destinations");
  assert.match(productCard, /href=\{l\.href\}/, "each sub-link must point at its own href, not the parent card's href");
});

// ── Expandable feature cards (2026-08-12) ───────────────────────────────────
//
// Feature lists collapse by default so the branded intro stays scannable.
// The toggle must be a real, keyboard-accessible button wired to the panel
// it controls — not a link, not a div with a click handler, and not nested
// inside the sub-link anchors it reveals.

test("the feature-list toggle is a real, accessible expand/collapse control", () => {
  const productCard = readFileSync(join(repoRoot, "src/components/ProductCard.tsx"), "utf8");
  assert.match(productCard, /"use client"/, "the interactive card must be a client component");
  assert.match(productCard, /useState\(false\)/, "feature lists default to collapsed on load");
  assert.match(productCard, /<button[^>]*type="button"[^>]*aria-expanded=\{open\}[^>]*aria-controls=\{panelId\}/,
    "the toggle is a real button carrying both aria-expanded and aria-controls");
  assert.match(productCard, /id=\{panelId\}/, "the controlled panel's id matches aria-controls");
  // The whole card navigates, so the toggle stops propagation before it
  // flips the panel — otherwise opening the features would leave the page.
  assert.match(productCard, /setOpen\(\(v\) => !v\)/, "the toggle actually flips the open state");
  assert.match(productCard, /e\.stopPropagation\(\)/, "the toggle must not also trigger the card's navigation");
  // The toggle button and the sub-link/CTA anchors must be siblings, not one
  // inside the other — no nested interactive elements.
  const buttonBlock = productCard.match(/<button[\s\S]*?<\/button>/)?.[0] ?? "";
  assert.doesNotMatch(buttonBlock, /<a\s/, "the expand button must not contain a nested link");
});

// ── Homepage: no featured product panel ─────────────────────────────────────
//
// The homepage must never render the Old Laptop featured panel or any of its
// pieces. It reads the registry by status only; a FeaturedPanel or the launch
// image reappearing here is the exact regression these lock.

test("the homepage renders no featured-product panel", () => {
  const home = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8")
    + readFileSync(join(repoRoot, "src/components/ProductCard.tsx"), "utf8");
  assert.doesNotMatch(home, /FeaturedPanel/, "homepage must not render a featured panel");
  assert.doesNotMatch(home, /featuredProduct\(/, "homepage must not pull the featured product");
  assert.doesNotMatch(home, /old-laptop-to-build-machine/i, "homepage must not reference the laptop product image or page");
  assert.doesNotMatch(home, /Preparing for Release/, "homepage must not carry the product's release label");
});

// The old About-ordering locks (family before product, resources above the
// panel) retired with the catalog itself — "About carries no project
// directory" above is the lock that replaced them.

// ── Contact copy ────────────────────────────────────────────────────────────
// Owner brief (2026-07-20, say-less rewrite — replaces the 2026-07-19
// work-with locks at the owner's direction): Contact is a simple "email me
// and we'll talk" page. No pitch, no service cards, no questionnaire, no
// personal-reply promises. The retired copy below must never come back.

test("Contact is the simple email-me page", () => {
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  const contact = readFileSync(join(repoRoot, "src/app/contact/page.tsx"), "utf8");
  assert.match(services, /Contact Open Mirror/, "the plain headline");
  assert.match(services, /Email me and we'll talk\./, "the one-line message");
  assert.match(services, /EMAIL_BUTTON = "Email me"/, "the plain button label");
  // Retired 2026-07-20 (owner: too much, too personal-salesy). Never restore.
  const retired = [
    /Bring me what you’re building/,
    /Tell me what you’re working on/,
    /read it personally/,
    /Start the conversation/,
    /A practical way forward/,
    /Shape the idea/,
    /Improve what exists/,
    /Find the next step/,
    /What are you building\?/,
    /No pitch deck/,
  ];
  for (const pattern of retired) {
    assert.doesNotMatch(services + contact, pattern, `retired contact copy must stay gone: ${pattern}`);
  }
});

test("Contact action is a plain mailto, address visible, no pre-filled questionnaire", () => {
  const contact = readFileSync(join(repoRoot, "src/app/contact/page.tsx"), "utf8");
  assert.match(contact, /mailto:\$\{SERVICE_EMAIL\}\?subject=/, "the action is a mailto with a subject");
  assert.doesNotMatch(contact, /&body=/, "no pre-filled note body");
  assert.match(contact, /\{SERVICE_EMAIL\}/, "the address stays visible on the page");
  assert.match(contact, /\{AVAILABILITY_NOTE\}/, "the evenings-and-weekends fact stays");
});

test("Contact availability note is plain, not apologetic", () => {
  const services = readFileSync(join(repoRoot, "src/lib/services.ts"), "utf8");
  assert.match(services, /alongside a full-time job/, "the availability note names the reality plainly");
  assert.match(services, /reply during evenings and weekends/, "and says when replies come");
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

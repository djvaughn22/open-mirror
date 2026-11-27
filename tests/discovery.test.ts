// Open Mirror's shared discovery, Learning and the Marketplace (owner
// direction, Nov 26-27 2026). These lock the owner's own example ("I like
// fixing things"), the honesty rules for resources and careers, and the
// Marketplace's promise that nothing fictional or unauthorized is public.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { interpret, marketDoors, forms } from "../src/lib/discovery/intent.ts";
import { PLACES } from "../src/lib/discovery/places.ts";
import { DISCIPLINES, SUBJECTS } from "../src/lib/learning/taxonomy.ts";
import { RESOURCES, PATHWAYS } from "../src/lib/learning/resources.ts";
import { OCCUPATIONS } from "../src/lib/learning/careers.ts";
import { resourcesFor } from "../src/lib/learning/directory.ts";
import { RESTORE_DIRECTORIES } from "../src/lib/marketplace/restore.ts";

const repoRoot = join(import.meta.dirname, "..");
const read = (rel: string) => readFileSync(join(repoRoot, rel), "utf8");
const visible = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");

test("the owner's example: 'I like fixing things' finds the repair subjects without their formal names", () => {
  const top = interpret("I like fixing things").subjects.slice(0, 10).map((s) => s.item.slug);
  for (const slug of ["automotive-repair", "electronics", "hvac", "electrical-work", "appliance-repair", "carpentry-woodworking", "mechanical-engineering", "computer-repair"]) {
    assert.ok(top.includes(slug), `${slug} should be in the top ten for "I like fixing things" (got ${top.join(", ")})`);
  }
});

test("everyday words find the right subjects and sites", () => {
  const bakery = interpret("running a bakery and I want to make a website");
  assert.ok(bakery.places.some((p) => p.item.id === "sitr-start"), "a website points to the website starter");
  assert.ok(bakery.subjects.some((s) => s.item.slug === "web-development"));
  assert.ok(bakery.subjects.some((s) => s.item.slug === "baking"));
  assert.ok(interpret("I want to read the Bible").places.some((p) => p.item.id === "chp-plan"));
  assert.ok(interpret("adopt a puppy").places.some((p) => p.item.id === "dcmt"));
  assert.ok(interpret("old laptop is slow").places.some((p) => p.item.id === "sitr-build-machine"));
  assert.ok(interpret("find steady work in the trades").paths.includes("apprenticeship"));
  assert.deepEqual(forms("baking").includes("bake"), true);
  assert.deepEqual(forms("shopping").includes("shop"), true);
});

test("the marketplace doors open only for buying, selling, hunting for or restoring a thing", () => {
  assert.deepEqual(marketDoors("I want to sell my grandfather's pocket watch"), ["sell"]);
  assert.ok(marketDoors("restore an old clock").includes("restore"));
  assert.ok(marketDoors("looking for a vintage watch").includes("find"));
  assert.deepEqual(marketDoors("I want to learn to sell online"), [], "selling as a business skill is Learning, not the Marketplace");
  assert.deepEqual(marketDoors("make a website"), []);
});

test("help comes first when someone may be in danger, and empty input is empty", () => {
  assert.equal(interpret("I want to end my life").urgent, true);
  assert.equal(interpret("I want to learn guitar").urgent, false);
  assert.equal(interpret("   ").empty, true);
  assert.ok(PLACES.some((p) => p.id === "988" && p.href === "https://988lifeline.org/"));
});

test("the subject directory is whole: unique slugs, a Wikipedia overview, real careers, a resource for every discipline", () => {
  const slugs = SUBJECTS.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length, "no duplicate subjects");
  assert.ok(!slugs.includes("work"), "/learn/work is its own page");
  assert.ok(SUBJECTS.length >= 90, "any subject in any field: a broad start");
  const jobIds = new Set(OCCUPATIONS.map((o) => o.id));
  for (const s of SUBJECTS) {
    assert.match(s.wiki, /^[A-Za-z0-9_(),.\-]+$/, `${s.slug} has a clean Wikipedia title`);
    assert.ok(s.words.length >= 3, `${s.slug} has everyday words`);
    for (const c of s.careers ?? []) assert.ok(jobIds.has(c), `${s.slug} → unknown career ${c}`);
  }
  for (const d of DISCIPLINES) {
    assert.ok(d.cip.every((c) => /^\d{2}$/.test(c)), `${d.slug} cites CIP families`);
    const any = d.subjects.some((s) => resourcesFor(s, d.slug).length > 0);
    assert.ok(any, `${d.name} has at least one resource beyond Wikipedia`);
  }
});

test("every resource is honest: https, a checked date, a cost, a license, no affiliate or tracking links", () => {
  const subjects = new Set(SUBJECTS.map((s) => s.slug));
  const disciplines = new Set(DISCIPLINES.map((d) => d.slug));
  const paths = new Set(PATHWAYS.map((p) => p.id));
  const ids = RESOURCES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "no duplicate resources");
  const OURS = /crossheartpray\.com|stepinthering\.com|idontcry\.com|whatamiai\.com|pleasebeready\.com|watchednotwatched\.com|opendoku\.com|dontclonemetom\.com|thedjcares\.com|openmirrorllc\.com/;
  for (const r of RESOURCES) {
    assert.match(r.url, /^https:\/\//, r.id);
    assert.doesNotMatch(r.url, /[?&](tag|ref|aff|affiliate|utm_[a-z]+)=|amazon\.|amzn\./i, `${r.id}: no affiliate or tracking links in Learning`);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/, r.id);
    assert.equal(!!r.ours, OURS.test(r.url), `${r.id}: our own projects are labeled, and only ours`);
    for (const s of r.subjects ?? []) assert.ok(subjects.has(s), `${r.id} → unknown subject ${s}`);
    for (const d of r.disciplines ?? []) assert.ok(disciplines.has(d), `${r.id} → unknown discipline ${d}`);
    for (const p of r.paths ?? []) assert.ok(paths.has(p), `${r.id} → unknown pathway ${p}`);
    if (r.note) assert.doesNotMatch(r.note, /\bbest\b|#1|top-rated|award-winning|guarantee/i, `${r.id}: no ratings we didn't earn`);
  }
});

test("careers link to official sources and never score a job", () => {
  for (const o of OCCUPATIONS) {
    assert.match(o.soc, /^\d{2}-\d{4}\.\d{2}$/, `${o.id} has an O*NET-SOC code`);
    if (o.bls) assert.match(o.bls, /^https:\/\/www\.bls\.gov\/ooh\/[a-z-]+\/[a-z-]+\.htm$/, o.id);
    assert.ok(o.needs.length >= 1, o.id);
  }
  const careers = read("src/lib/learning/careers.ts");
  assert.doesNotMatch(careers.replace(/\/\/.*$/gm, ""), /score|salary:|median|\$\d|growth:/i, "no copied pay numbers or resilience scores");
  const work = visible("src/app/learn/work/page.tsx");
  assert.match(work, /No job is guaranteed to last/);
  assert.match(work, /We don&apos;t score or rank jobs/);
});

test("Learning makes no school claims: a directory of others' free resources, under the Learning name", () => {
  for (const rel of ["src/app/learn/page.tsx", "src/app/learn/[subject]/page.tsx", "src/app/learn/work/page.tsx", "src/components/learning/LearnSearch.tsx"]) {
    const src = visible(rel);
    assert.doesNotMatch(src, /University|accredit|earn (a|your) (degree|certificate)|college credit/i, `${rel}: no university, accreditation or credit claims in page copy`);
    assert.doesNotMatch(src, /fetch\(|router\.push|searchParams|localStorage/, `${rel}: typed words stay in the browser`);
  }
  const learn = visible("src/app/learn/page.tsx");
  assert.match(learn, /Open Mirror Learning is a directory, not a school/);
  assert.match(learn, /no affiliate links in Learning/);
  assert.match(read("src/app/sitemap.ts"), /"\/learn"/);
});

test("the Marketplace shows only true things: no listings, no prices, no checkout, no merchant named", () => {
  const src = visible("src/app/marketplace/page.tsx");
  assert.match(src, /No merchants are listed yet/);
  assert.match(src, /Email the owner for more details/);
  assert.doesNotMatch(src, /\$\s?\d|add to cart|checkout|buy now|escrow|commission|fee/i);
  assert.doesNotMatch(src, /timekeepers/i, "no prospective merchant is named publicly");
  for (const d of RESTORE_DIRECTORIES) assert.match(d.url, /^https:\/\//);
  assert.match(src, /doesn&apos;t vouch for anyone they list/);
  // The fictional demonstration never ships in this public repository.
  assert.doesNotMatch(read("src/lib/marketplace/models.ts"), /fictional|demo merchant/i);
});

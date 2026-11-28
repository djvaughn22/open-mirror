// Open Mirror Learning, Nov 27-28 2026 (owner direction): learning paths,
// the area → discipline → subject structure, search that finds a path from
// everyday words, progress saved only on the device, and measurement that
// never carries what someone typed.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { interpret } from "../src/lib/discovery/intent.ts";
import { AREAS, areaOfDiscipline } from "../src/lib/learning/areas.ts";
import { OCCUPATIONS } from "../src/lib/learning/careers.ts";
import { FEATURED_PATHS, PATHS, pathsForSubject } from "../src/lib/learning/paths.ts";
import { COST_LABEL, RESOURCES } from "../src/lib/learning/resources.ts";
import { DISCIPLINES, SUBJECTS } from "../src/lib/learning/taxonomy.ts";
import {
  EMPTY, continueList, pathStatus, resetPath, sanitize, startPath, toggleSaved, toggleStep, visitSubject,
} from "../src/lib/learning/progress.ts";
import { MEASURE_ENABLED, measure, send } from "../src/lib/measure.ts";

const repoRoot = join(import.meta.dirname, "..");
const read = (rel: string) => readFileSync(join(repoRoot, rel), "utf8");
const visible = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
const RID = new Set(RESOURCES.map((r) => r.id));

test("every path is complete and every link it uses is a checked resource", () => {
  assert.ok(PATHS.length >= 16, "a representative set of paths");
  const slugs = new Set<string>();
  for (const p of PATHS) {
    assert.ok(!slugs.has(p.slug), `${p.slug} is unique`);
    slugs.add(p.slug);
    assert.match(p.slug, /^[a-z0-9-]+$/);
    assert.ok(AREAS.some((a) => a.slug === p.area), `${p.slug}: known area`);
    for (const s of p.subjects) assert.ok(SUBJECTS.some((x) => x.slug === s), `${p.slug}: subject ${s}`);
    assert.ok(p.steps.length >= 5 && p.steps.length <= 8, `${p.slug}: five to eight steps`);
    assert.equal(p.steps[0].level, "beginner", `${p.slug}: starts with a beginner step`);
    assert.equal(new Set(p.steps.map((s) => s.id)).size, p.steps.length, `${p.slug}: step ids are unique`);
    for (const st of p.steps) {
      assert.ok(st.learn && st.practice && st.done, `${p.slug}/${st.id}: learn, practice and done are all written`);
      assert.ok(st.res.length >= 1, `${p.slug}/${st.id}: at least one resource`);
      for (const r of st.res) assert.ok(RID.has(r), `${p.slug}/${st.id}: unknown resource ${r}`);
      for (const s of st.see ?? []) assert.match(s.href, /^\/[a-z]/, `${p.slug}/${st.id}: "see" links stay on this site`);
    }
    for (const n of [...p.people, ...(p.safety ? [p.safety] : [])]) if (n.res) assert.ok(RID.has(n.res), `${p.slug}: note resource ${n.res}`);
    for (const rt of p.routes ?? []) for (const r of rt.res) assert.ok(RID.has(r), `${p.slug}: route resource ${r}`);
    for (const w of p.work) assert.ok(OCCUPATIONS.some((o) => o.id === w), `${p.slug}: occupation ${w}`);
    for (const r of p.related) assert.ok(PATHS.some((x) => x.slug === r) && r !== p.slug, `${p.slug}: related ${r}`);
    assert.ok(p.need.length && p.little.length && p.make.length && p.cost, `${p.slug}: need, little, make and cost are written`);
  }
  for (const f of FEATURED_PATHS) assert.ok(slugs.has(f), `featured ${f}`);
});

test("paths make no promises: no prices, no 'best', no school or credential claims", () => {
  for (const p of PATHS) {
    const text = JSON.stringify(p);
    assert.doesNotMatch(text, /\$\s?\d|\bUSD\b|\d+\s?dollars/i, `${p.slug}: no dollar amounts (teach people to check what they have instead)`);
    assert.doesNotMatch(text, /\bbest\b|#1|award-winning|guarantee|University|accredit|degree from|certified by Open Mirror/i, `${p.slug}: no claims we can't back`);
    assert.doesNotMatch(text, /amazon\.|amzn|[?&](tag|utm_[a-z]+|ref)=/i, `${p.slug}: no affiliate or tracking links`);
  }
});

test("work that can hurt someone carries a safety note", () => {
  for (const slug of ["car-repair", "small-engines", "food-preservation", "electricity", "home-maintenance", "restore-old-computer"]) {
    const p = PATHS.find((x) => x.slug === slug);
    assert.ok(p?.safety?.text, `${slug} has a safety note`);
  }
  const canning = PATHS.find((x) => x.slug === "food-preservation")!;
  assert.match(canning.safety!.text, /tested recipes/);
  assert.match(canning.safety!.text, /pressure canned/);
});

test("the old-computer path teaches people to check parts, not to spend", () => {
  const p = PATHS.find((x) => x.slug === "restore-old-computer")!;
  const little = p.little.join(" ");
  assert.match(little, /Don't buy anything until/);
  assert.match(little, /by its parts, not its price/);
  assert.match(little, /64-bit processor/);
});

test("resources say what they cost, where they apply, and link to the original https source", () => {
  for (const r of RESOURCES) {
    assert.match(r.url, /^https:\/\//, `${r.id}: https`);
    assert.doesNotMatch(r.url, /[?&](tag|utm_[a-z]+|affiliate|aff)=/i, `${r.id}: no tracking or affiliate parameters`);
    assert.ok(COST_LABEL[r.cost], `${r.id}: a cost label`);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/, `${r.id}: a checked date`);
    if (r.region) assert.match(r.region, /^[A-Z][A-Za-z ,.]+$/, `${r.id}: region is a place name`);
  }
  // Moved sources (found Nov 27): GCFGlobal is now LearnFree; SBA's guide moved under /counseling.
  assert.ok(!RESOURCES.some((r) => r.url.includes("edu.gcfglobal.org")), "no links through GCFGlobal's old domain");
  assert.ok(!RESOURCES.some((r) => /sba\.gov\/(business-guide|sba-learning-platform)/.test(r.url)), "no links to SBA's old guide addresses");
  assert.equal(COST_LABEL["free-limited"], "Free to start; full access costs money");
});

test("nine areas hold every discipline exactly once, so the first screen never grows", () => {
  assert.equal(AREAS.length, 9);
  for (const d of DISCIPLINES) {
    assert.equal(AREAS.filter((a) => a.disciplines.includes(d.slug)).length, 1, `${d.slug} is in one area`);
    assert.ok(areaOfDiscipline(d.slug));
  }
  for (const a of AREAS) for (const d of a.disciplines) assert.ok(DISCIPLINES.some((x) => x.slug === d), `${a.slug}: ${d}`);
});

test("the owner's example searches find the right path first", () => {
  const cases: [string, string][] = [
    ["I want to fix cars.", "car-repair"],
    ["I want to learn piano.", "piano"],
    ["I want to build a website.", "build-a-website"],
    ["I want to understand electricity.", "electricity"],
    ["I want to restore an old watch.", "watch-clock"],
    ["I want to grow my own food.", "grow-food"],
    ["I want to learn calculus.", "math-to-calculus"],
    ["I want to find a career that helps people.", "find-work"],
    ["I have an old computer and no money.", "restore-old-computer"],
    ["my mower won't start", "small-engines"],
    ["canning tomatoes", "food-preservation"],
    ["start a business", "start-small-business"],
  ];
  for (const [q, slug] of cases) {
    const top = interpret(q).learningPaths[0]?.item.slug;
    assert.equal(top, slug, `"${q}" should lead with ${slug} (got ${top})`);
  }
  assert.equal(interpret("I have an old computer and no money").lowCost, true, "money is tight: lead with the low-cost way in");
  assert.equal(interpret("I want to learn piano").lowCost, false);
  // A broad interest opens paths too, not only subjects.
  const fixing = interpret("I like fixing things").learningPaths.map((p) => p.item.slug);
  for (const slug of ["car-repair", "small-engines", "home-maintenance"]) assert.ok(fixing.includes(slug), `"I like fixing things" offers ${slug}`);
  // Named paths put their own subjects first ("build a website" before woodworking).
  assert.equal(interpret("I want to build a website").subjects[0].item.slug, "web-development");
  // Safety still comes first.
  assert.equal(interpret("I want to die").urgent, true);
});

test("every subject with a path points to it", () => {
  for (const p of PATHS) assert.ok(pathsForSubject(p.subjects[0]).some((x) => x.slug === p.slug), p.slug);
});

test("progress keeps only ids from our own lists, never anything typed", () => {
  const dirty = sanitize({
    v: 1,
    paths: { "restore-old-computer": { started: "2026-11-28", done: ["s2", "s1", "nope", "s1"], touched: "2026-11-28" }, "made-up": { done: ["s1"] } },
    saved: ["piano", "my secret note", "piano"],
    recent: ["linux", "<script>", 42],
  });
  assert.deepEqual(Object.keys(dirty.paths), ["restore-old-computer"]);
  assert.deepEqual(dirty.paths["restore-old-computer"].done, ["s2", "s1"]);
  assert.deepEqual(dirty.saved, ["piano"]);
  assert.deepEqual(dirty.recent, ["linux"]);
  assert.deepEqual(sanitize("not json at all"), EMPTY);
  assert.deepEqual(sanitize(null), EMPTY);
});

test("progress: start, check off in any order, see the next step, start over", () => {
  const now = new Date("2026-11-28T12:00:00Z");
  let s = startPath(EMPTY, "piano", now);
  assert.equal(pathStatus(s, "piano")?.next?.id, "s1");
  s = toggleStep(s, "piano", "s3", now);
  s = toggleStep(s, "piano", "s1", now);
  assert.deepEqual(s.paths.piano.done, ["s1", "s3"], "kept in path order");
  assert.equal(pathStatus(s, "piano")?.next?.id, "s2", "the next step is the first one not done");
  s = toggleStep(s, "piano", "s3", now);
  assert.deepEqual(s.paths.piano.done, ["s1"], "a second tap undoes");
  assert.equal(toggleStep(s, "piano", "s99", now), s, "unknown steps change nothing");
  assert.equal(continueList(s)[0].path.slug, "piano");
  s = resetPath(s, "piano");
  assert.equal(pathStatus(s, "piano"), undefined);
});

test("saved and recent subjects are capped and de-duplicated", () => {
  let s = EMPTY;
  for (const sub of SUBJECTS.slice(0, 10)) s = visitSubject(s, sub.slug);
  assert.equal(s.recent.length, 6);
  assert.equal(s.recent[0], SUBJECTS[9].slug, "most recent first");
  s = toggleSaved(s, "piano");
  s = toggleSaved(s, "piano");
  assert.deepEqual(s.saved, []);
  assert.equal(toggleSaved(s, "anything typed"), s);
});

test("measurement is off pending approval, and when on sends only fixed names and our own ids", () => {
  const sent: unknown[][] = [];
  const g = globalThis as unknown as { window?: unknown };
  const fakeWindow = { navigator: {} as Record<string, unknown>, gtag: (...args: unknown[]) => sent.push(args) };
  g.window = fakeWindow;
  try {
    // Off until the owner approves: the pages' calls send nothing.
    assert.equal(MEASURE_ENABLED, false, "search measurement stays off pending the owner's approval");
    measure("path_start", { path: "piano" });
    assert.deepEqual(sent, []);
    // When it's turned on, only safe values go out.
    send("path_start", { path: "piano" });
    send("om_result", { where: "home", kind: "subject", id: "I typed my address here" as string });
    send("om_search", { where: "learn", found: "yes" });
    fakeWindow.navigator.doNotTrack = "1";
    send("path_start", { path: "linux" });
  } finally {
    delete g.window;
  }
  assert.deepEqual(sent, [["event", "path_start", { path: "piano" }], ["event", "om_search", { where: "learn", found: "yes" }]]);
});

test("the homepage and Learning never put typed words into measurement, storage or a URL", () => {
  for (const rel of ["src/components/AskOpenMirror.tsx", "src/components/learning/LearnSearch.tsx"]) {
    const src = visible(rel);
    assert.doesNotMatch(src, /fetch\(|router\.push|searchParams|localStorage|gtag\(|sendBeacon/, rel);
    for (const call of src.match(/measure\([^)]*\)/g) ?? []) {
      assert.doesNotMatch(call, /\b(doing|want|text|deferred|t|d|w|idea|ex)\b(?!:)/, `${rel}: ${call} carries no typed text`);
    }
  }
  for (const rel of ["src/lib/learning/progress.ts", "src/components/learning/useLearning.ts"]) {
    assert.doesNotMatch(visible(rel), /fetch\(|sendBeacon|gtag\(/, `${rel}: progress never leaves the device`);
  }
});

test("new Learning pages keep the directory's honesty and are in the sitemap", () => {
  for (const rel of ["src/app/learn/paths/page.tsx", "src/app/learn/paths/[slug]/page.tsx", "src/app/learn/area/[slug]/page.tsx", "src/components/learning/PathSteps.tsx"]) {
    assert.doesNotMatch(visible(rel), /University|accredit|college credit|earn (a|your) (degree|certificate)/i, rel);
  }
  assert.match(visible("src/app/learn/paths/[slug]/page.tsx"), /Open Mirror Learning is a directory, not a school/);
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /\/learn\/paths\/\$\{p\.slug\}/);
  assert.match(sitemap, /\/learn\/area\/\$\{a\.slug\}/);
});

test("everyday phrasing lands on a useful start, and broken things aren't job searches", () => {
  const top = (q: string) => interpret(q).learningPaths[0]?.item.slug;
  assert.equal(top("I got an old dell from my uncle"), "restore-old-computer");
  assert.equal(top("I want to start a lawn care business"), "start-small-business");
  assert.equal(top("I bake cakes and want to sell them"), "start-small-business");
  assert.equal(top("how do I can green beans"), "food-preservation");
  assert.equal(top("I'm 16 and want a good job someday"), "find-work");
  const watch = interpret("my grandpa's pocket watch stopped working");
  assert.equal(watch.learningPaths[0]?.item.slug, "watch-clock");
  assert.ok(!watch.paths.includes("job"), "'stopped working' is a repair, not a job search");
  assert.ok(watch.market.includes("restore"), "and the Marketplace's Restore door opens");
  assert.ok(!interpret("how the stock market works").paths.includes("job"), "'how it works' isn't a job search");
  assert.ok(interpret("I want to become a nurse").paths.includes("job"), "'become a nurse' is a career question");
  assert.ok(!interpret("I'm in high school and don't know what job I want").places.some((p) => p.item.id === "idc-sports"), "high school alone isn't a sports question");
  assert.ok(interpret("power went out").places.some((p) => p.item.id === "pbr"), "a power outage finds the household planning site");
});

// Opens every outside link that Open Mirror Learning and the Marketplace show,
// and reports what answered. Run: npm run links:check   (add --json for a file)
//
// A link passes when it answers 2xx after redirects. Some government sites
// refuse automated requests (403) to stop bots; they're reported as
// "blocked" and checked in a real browser instead, by hand.

import { RESOURCES } from "../src/lib/learning/resources.ts";
import { SUBJECTS, wikiUrl } from "../src/lib/learning/taxonomy.ts";
import { OCCUPATIONS, onetUrl } from "../src/lib/learning/careers.ts";
import { RESTORE_DIRECTORIES } from "../src/lib/marketplace/restore.ts";
import { PLACES } from "../src/lib/discovery/places.ts";

// These sites refuse or throttle automated checks (403, 503 or no answer) but
// open in a browser. They're reported as "blocked": click through by hand.
const BLOCKS_BOTS = ["bls.gov", "careeronestop.org", "onetonline.org", "congress.gov", "loc.gov", "si.edu", "score.org", "foodsafety.gov", "cambridgeincolour.com", "linuxjourney.com", "gutenberg.org", "ubuntu.com", "sba.gov", "epa.gov", "myplate.gov", "purdue.edu"];
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36 OpenMirrorLinkCheck";

type Row = { url: string; from: string; status: number | string; final?: string; verdict: "ok" | "blocked" | "broken" };

const links = new Map<string, string>();
const add = (url: string, from: string) => { if (url.startsWith("http") && !links.has(url)) links.set(url, from); };
for (const r of RESOURCES) add(r.url, `resource:${r.id}`);
for (const o of OCCUPATIONS) { add(onetUrl(o), `onet:${o.id}`); if (o.bls) add(o.bls, `bls:${o.id}`); }
for (const d of RESTORE_DIRECTORIES) add(d.url, `restore:${d.id}`);
for (const p of PLACES) add(p.href, `place:${p.id}`);

import { execFile } from "node:child_process";

// curl, not fetch: it behaves like a browser on redirects and TLS, and it
// releases every connection. One request per link, six at a time.
function curl(url: string): Promise<{ code: number; final: string }> {
  return new Promise((resolve) => {
    execFile("curl", ["-s", "-o", "/dev/null", "-L", "--max-time", "30", "-A", UA, "-w", "%{http_code} %{url_effective}", url], (_err, out) => {
      const [code, final] = String(out ?? "").trim().split(" ");
      resolve({ code: Number(code) || 0, final: final ?? url });
    });
  });
}

async function check(url: string, from: string): Promise<Row> {
  const host = new URL(url).hostname;
  const { code, final } = await curl(url);
  const blocked = (code === 403 || code === 503 || code === 0) && BLOCKS_BOTS.some((h) => host.endsWith(h));
  const ok = code >= 200 && code < 300;
  return { url, from, status: code || "no answer", final: final !== url ? final : undefined, verdict: ok ? "ok" : blocked ? "blocked" : "broken" };
}

// Wikipedia: ask its API whether each article exists (50 titles a request),
// instead of loading 100 pages and getting rate-limited.
async function checkWikipedia(): Promise<Row[]> {
  const rows: Row[] = [];
  for (let i = 0; i < SUBJECTS.length; i += 50) {
    const batch = SUBJECTS.slice(i, i + 50);
    const titles = batch.map((s) => decodeURIComponent(s.wiki).replace(/_/g, " "));
    const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(titles.join("|"))}`;
    const out: string = await new Promise((res) => execFile("curl", ["-s", "--max-time", "30", "-A", UA, api], (_e, o) => res(String(o ?? ""))));
    type WikiPage = { title: string; missing?: string; invalid?: string };
    type WikiQuery = { pages?: Record<string, WikiPage>; redirects?: { from: string; to: string }[]; normalized?: { from: string; to: string }[] };
    const q: WikiQuery = JSON.parse(out || "{}").query ?? {};
    const missing = new Set<string>(Object.values(q.pages ?? {}).filter((p) => "missing" in p || "invalid" in p).map((p) => p.title));
    const redirected = new Map<string, string>((q.redirects ?? []).map((r) => [r.from, r.to]));
    const normalized = new Map<string, string>((q.normalized ?? []).map((n) => [n.from, n.to]));
    batch.forEach((s, j) => {
      const t0 = titles[j];
      const t1 = normalized.get(t0) ?? t0;
      const t2 = redirected.get(t1) ?? t1;
      const ok = !!q.pages && !missing.has(t2);
      rows.push({ url: wikiUrl(s), from: `wiki:${s.slug}`, status: ok ? 200 : 404, final: t2 !== t1 ? `redirects to "${t2}"` : undefined, verdict: ok ? "ok" : "broken" });
    });
  }
  return rows;
}

const queue = [...links.entries()];
const rows: Row[] = await checkWikipedia();
await Promise.all(Array.from({ length: 6 }, async () => {
  for (let next = queue.shift(); next; next = queue.shift()) {
    rows.push(await check(next[0], next[1]));
  }
}));
rows.sort((a, b) => a.verdict.localeCompare(b.verdict) || a.from.localeCompare(b.from));
const count = (v: Row["verdict"]) => rows.filter((r) => r.verdict === v).length;
for (const r of rows) if (r.verdict !== "ok") console.log(`${r.verdict.padEnd(7)} ${String(r.status).padEnd(5)} ${r.from}  ${r.url}`);
for (const r of rows) if (r.verdict === "ok" && r.final) console.log(`moved   ${r.from}  ${r.url} -> ${r.final}`);
console.log(`\n${rows.length} links: ${count("ok")} ok, ${count("blocked")} blocked (check in a browser), ${count("broken")} broken. ${new Date().toISOString()}`);
if (process.argv.includes("--json")) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync("link-check.json", JSON.stringify(rows, null, 2));
}
process.exit(count("broken") ? 1 : 0);

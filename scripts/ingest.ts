// ─────────────────────────────────────────────────────────────────────────────
// The unattended wire job.
//
//   npm run wire              — yesterday and today
//   npm run wire -- --days 7  — the last week
//   npm run wire -- --dry     — run everything, write nothing
//
// Cron-compatible: it takes no input, prints a report, and exits non-zero only
// when every source failed. A night where one school's site is down is a
// partial wire, not a broken one, and the report says which.
// ─────────────────────────────────────────────────────────────────────────────

import { formatReport, ingestMetro } from "../src/lib/sports/ingest.ts";
import { ST_LOUIS } from "../src/lib/sports/metros/stLouis.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

/** Today in the metro's timezone — a game played Friday night is Friday's. */
function todayInMetro(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, dateStyle: "short" }).format(new Date());
}

async function main() {
  const days = Number(arg("days") ?? 2);
  const dry = process.argv.includes("--dry");
  const today = todayInMetro(ST_LOUIS.timezone);
  const since = new Date(Date.parse(`${today}T00:00:00Z`) - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  // Scheduled games a little ahead of today feed the "Next up" rail.
  const until = new Date(Date.parse(`${today}T00:00:00Z`) + 7 * 86_400_000).toISOString().slice(0, 10);

  console.log(`Running the St. Louis wire: results since ${since}, schedule through ${until}${dry ? " (dry run)" : ""}`);

  const { report, events, briefs } = await ingestMetro({
    metro: ST_LOUIS,
    since,
    until,
    persist: !dry,
  });

  console.log(`\n${formatReport(report)}\n`);

  const published = events.filter((e) => e.publishable).sort((a, b) => b.date.localeCompare(a.date));
  if (published.length > 0) {
    console.log("Published briefs:");
    for (const e of published) {
      const brief = briefs.get(e.id);
      if (!brief) continue;
      console.log(`\n  ${brief.headline}   [${e.confidence}, ${e.scoreSourceIds.length} score src / ${e.sourceIds.length} total, ${brief.wordCount} words]`);
      console.log(`  ${brief.body}`);
    }
    console.log("");
  }

  const everyRunFailed = report.sources.length > 0 && report.sources.every((s) => s.succeeded === 0);
  if (everyRunFailed) {
    console.error("Every source failed. Nothing was published.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

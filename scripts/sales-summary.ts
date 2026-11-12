// Owner's tracker: reads private/commerce/sales.csv (+ optional traffic.csv) and prints real totals.
// Usage: npm run sales:summary
import { readFileSync, existsSync } from "node:fs";
import { parseSalesCsv, summarize, summarizeBy, weekStart, remainingToGoal } from "../src/lib/commerce/metrics.ts";

const dir = "private/commerce";
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
// Optional: npm run sales:summary -- --file path/to.csv  (used for synthetic tests; never the real file)
const fileArg = process.argv.indexOf("--file");
const salesFile = fileArg > 0 ? process.argv[fileArg + 1] : `${dir}/sales.csv`;
if (!existsSync(salesFile)) { console.error(`No ${salesFile}`); process.exit(2); }
const sales = parseSalesCsv(readFileSync(salesFile, "utf8"));
const s = summarize(sales);
console.log(`Orders ${s.orders} | Gross ${usd(s.grossCents)} | Fees ${usd(s.feesCents)} | Fulfillment ${usd(s.fulfillmentCents)} | Refunds ${usd(s.refundsCents)}`);
console.log(`NET ${usd(s.netCents)} | to $400 goal: ${usd(remainingToGoal(s.netCents))} | repeat buyers ${s.repeatCustomers} | support min ${s.supportMinutes}`);
for (const k of [...new Set(sales.map((x) => x.productKey))]) {
  const p = summarize(sales.filter((x) => x.productKey === k));
  console.log(`  ${k}: ${p.orders} orders, net ${usd(p.netCents)}`);
}
const line = (label: string, x: ReturnType<typeof summarize>) =>
  console.log(`  ${label}: ${x.orders} orders, gross ${usd(x.grossCents)}, fees ${usd(x.feesCents)}, refunds ${usd(x.refundsCents)}, net ${usd(x.netCents)}`);
console.log("By channel:"); for (const [k, v] of summarizeBy(sales, (r) => r.channel ?? "unknown")) line(k, v);
console.log("By week (Monday start):"); for (const [k, v] of summarizeBy(sales, (r) => weekStart(r.date))) line(k, v);
if (fileArg < 0 && existsSync(`${dir}/traffic.csv`)) {
  const rows = readFileSync(`${dir}/traffic.csv`, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("#")).slice(1)
    .map((l) => l.split(",").map((x) => x.trim()));
  const sum = (i: number) => rows.reduce((a, r) => a + (Number(r[i]) || 0), 0);
  console.log(`Traffic (${rows.length} weekly rows): impressions ${sum(2)} | visits ${sum(3)} | favorites ${sum(4)} | orders ${s.orders}` +
    (sum(3) ? ` | visit-to-order ${((100 * s.orders) / sum(3)).toFixed(1)}%` : ""));
}

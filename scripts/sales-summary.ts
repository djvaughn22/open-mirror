// Owner's tracker: reads private/commerce/sales.csv (+ optional traffic.csv) and prints real totals.
// Usage: npm run sales:summary
import { readFileSync, existsSync } from "node:fs";
import { parseSalesCsv, summarize, remainingToGoal } from "../src/lib/commerce/metrics.ts";

const dir = "private/commerce";
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
if (!existsSync(`${dir}/sales.csv`)) { console.error(`No ${dir}/sales.csv`); process.exit(2); }
const sales = parseSalesCsv(readFileSync(`${dir}/sales.csv`, "utf8"));
const s = summarize(sales);
console.log(`Orders ${s.orders} | Gross ${usd(s.grossCents)} | Fees ${usd(s.feesCents)} | Fulfillment ${usd(s.fulfillmentCents)} | Refunds ${usd(s.refundsCents)}`);
console.log(`NET ${usd(s.netCents)} | to $400 goal: ${usd(remainingToGoal(s.netCents))} | repeat buyers ${s.repeatCustomers} | support min ${s.supportMinutes}`);
for (const k of [...new Set(sales.map((x) => x.productKey))]) {
  const p = summarize(sales.filter((x) => x.productKey === k));
  console.log(`  ${k}: ${p.orders} orders, net ${usd(p.netCents)}`);
}
if (existsSync(`${dir}/traffic.csv`)) {
  const rows = readFileSync(`${dir}/traffic.csv`, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("#")).slice(1)
    .map((l) => l.split(",").map((x) => x.trim()));
  const sum = (i: number) => rows.reduce((a, r) => a + (Number(r[i]) || 0), 0);
  console.log(`Traffic (${rows.length} weekly rows): impressions ${sum(2)} | visits ${sum(3)} | favorites ${sum(4)} | orders ${s.orders}` +
    (sum(3) ? ` | visit-to-order ${((100 * s.orders) / sum(3)).toFixed(1)}%` : ""));
}

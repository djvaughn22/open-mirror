// Measurement vocabulary and arithmetic. Only records what a platform or our own
// analytics actually reported; unknown values stay undefined, never estimated.

export const EVENTS = {
  page_view: "product_page_view",          // visitors to a product page
  referral_click: "referral_click",        // outbound click to a retailer/affiliate
  checkout_start: "checkout_start",        // only where the platform exposes it
} as const;

export type SaleRecord = {
  productKey: string;
  date?: string;             // YYYY-MM-DD, as shown on the platform
  channel?: string;          // e.g. etsy, payhip, direct
  grossCents: number;
  feeCents: number;          // marketplace + processor fees, as reported
  fulfillmentCents: number;  // print/ship costs, 0 for downloads
  refundedCents: number;
  customerRef?: string;      // opaque; never an email or name
  supportMinutes?: number;
};

export type Summary = {
  orders: number; grossCents: number; feesCents: number; fulfillmentCents: number;
  refundsCents: number; netCents: number; repeatCustomers: number; supportMinutes: number;
};

export function summarize(sales: SaleRecord[]): Summary {
  const s: Summary = { orders: 0, grossCents: 0, feesCents: 0, fulfillmentCents: 0,
    refundsCents: 0, netCents: 0, repeatCustomers: 0, supportMinutes: 0 };
  const seen = new Map<string, number>();
  for (const r of sales) {
    s.orders++;
    s.grossCents += r.grossCents;
    s.feesCents += r.feeCents;
    s.fulfillmentCents += r.fulfillmentCents;
    s.refundsCents += r.refundedCents;
    s.supportMinutes += r.supportMinutes ?? 0;
    if (r.customerRef) seen.set(r.customerRef, (seen.get(r.customerRef) ?? 0) + 1);
  }
  s.repeatCustomers = [...seen.values()].filter((n) => n > 1).length;
  s.netCents = s.grossCents - s.feesCents - s.fulfillmentCents - s.refundsCents;
  return s;
}

/** Net proceeds still needed to reach a goal; never negative. */
export const remainingToGoal = (netCents: number, goalCents = 40000) => Math.max(0, goalCents - netCents);

/** Parse the owner's sales.csv (header: date,productKey,channel,gross,fees,fulfillment,refunded,customerRef,supportMinutes).
 *  Money columns are dollars as typed from the platform; returned as integer cents. Throws on a bad row. */
export function parseSalesCsv(text: string): SaleRecord[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const head = lines.shift()?.split(",").map((h) => h.trim());
  if (!head || head[0] !== "date" || head[1] !== "productKey") throw new Error("sales.csv: bad header");
  const money = (v: string, row: number, name: string) => {
    if (!v) return 0;
    if (!/^-?\d+(\.\d{1,2})?$/.test(v)) throw new Error(`sales.csv row ${row}: ${name} "${v}" is not dollars`);
    return Math.round(parseFloat(v) * 100);
  };
  return lines.map((line, i) => {
    const c = line.split(",").map((x) => x.trim());
    const get = (n: string) => (head.indexOf(n) >= 0 ? c[head.indexOf(n)] ?? "" : "");
    if (!get("productKey")) throw new Error(`sales.csv row ${i + 1}: productKey missing`);
    return {
      productKey: get("productKey"),
      date: get("date") || undefined,
      channel: get("channel") || undefined,
      grossCents: money(get("gross"), i + 1, "gross"),
      feeCents: money(get("fees"), i + 1, "fees"),
      fulfillmentCents: money(get("fulfillment"), i + 1, "fulfillment"),
      refundedCents: money(get("refunded"), i + 1, "refunded"),
      customerRef: get("customerRef") || undefined,
      supportMinutes: get("supportMinutes") ? Number(get("supportMinutes")) : undefined,
    };
  });
}

/** Monday (UTC) of the week a YYYY-MM-DD date falls in, as YYYY-MM-DD. "unknown" if the date is missing or malformed. */
export function weekStart(date?: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "unknown";
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "unknown";
  const back = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}

/** Summaries grouped by any key (product, channel, week). A refund counts in the row it was typed on. */
export function summarizeBy(sales: SaleRecord[], key: (s: SaleRecord) => string): Map<string, Summary> {
  const groups = new Map<string, SaleRecord[]>();
  for (const s of sales) { const k = key(s); groups.set(k, [...(groups.get(k) ?? []), s]); }
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, summarize(v)]));
}

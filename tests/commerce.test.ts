import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCatalog, channelOf, CHECKLIST_KEYS, type CatalogProduct } from "../src/lib/commerce/catalog.ts";
import { summarize, remainingToGoal } from "../src/lib/commerce/metrics.ts";

const passed = Object.fromEntries(CHECKLIST_KEYS.map((k) => [k, { passed: true, on: "2026-11-11" }]));
const good = (o: Partial<CatalogProduct> = {}): CatalogProduct => ({
  id: "sample-pack", brand: "idontcry", type: "original_download", title: "Sample", description: "Fixture",
  images: [], priceCents: 400, currency: "USD", available: true, status: "published", channels: [{ provider: "etsy", checkoutUrl: "https://example.com/x", delivery: "platform_download" }],
  rights: { owner: "Open Mirror LLC", verified: true, thirdPartyAssets: [], license: "personal use" },
  refundPolicy: "30 days", supportContact: "support@example.com", analytics: { productKey: "sample-pack" },
  holds: [], checklist: passed, reviewOn: "2027-01-15", ...o,
});
const aff = (o: Partial<CatalogProduct> = {}): CatalogProduct => good({
  id: "gear-x", type: "affiliate", channels: [{ provider: "amazon_associates", checkoutUrl: "https://example.com/a", delivery: "external_retailer" }],
  priceCents: undefined, currency: undefined, refundPolicy: undefined, supportContact: undefined,
  disclosureKey: "amazon-associates", analytics: { productKey: "gear-x" }, ...o,
});

test("a complete direct product validates", () => assert.deepEqual(validateCatalog([good()]), []));
test("a complete affiliate referral validates and is a referral", () => {
  assert.deepEqual(validateCatalog([aff()]), []);
  assert.equal(channelOf("affiliate", { provider: "amazon_associates" }), "referral");
  assert.equal(channelOf("original_download", { provider: "etsy" }), "direct");
});
test("duplicate ids and analytics keys are rejected", () => {
  const e = validateCatalog([good(), good()]).join("|");
  assert.match(e, /duplicate id/); assert.match(e, /duplicate analytics/);
});
test("published needs every checklist item", () => {
  const rest = { ...good().checklist };
  delete rest.rights;
  const e = validateCatalog([good({ checklist: rest })]);
  assert.ok(e.some((x) => x.includes('"rights" not passed')));
});
test("open holds block publishing", () =>
  assert.match(validateCatalog([good({ holds: ["employment review"] })]).join(), /open holds/));
test("unverified rights block ready and published", () =>
  assert.match(validateCatalog([good({ status: "ready", rights: { ...good().rights, verified: false } })]).join(), /rights not verified/));
test("direct sales need price, refund policy and support", () => {
  const e = validateCatalog([good({ priceCents: undefined, refundPolicy: "", supportContact: "" })]).join();
  assert.match(e, /priceCents/); assert.match(e, /refundPolicy/); assert.match(e, /supportContact/);
});
test("referrals cannot carry a price, need a disclosure, cannot self-deliver", () => {
  const e = validateCatalog([aff({ priceCents: 999, disclosureKey: undefined, channels: [{ provider: "amazon_associates", delivery: "platform_download" }] })]).join();
  assert.match(e, /no price/); assert.match(e, /disclosureKey/); assert.match(e, /cannot be delivered/);
});
test("noncommercial brands stay draft", () => {
  assert.match(validateCatalog([good({ brand: "crossheartpray" })]).join(), /noncommercial/);
  assert.deepEqual(validateCatalog([good({ brand: "thedjcares", status: "draft" })]), []);
});
test("checkout URLs must be https and prices positive integers", () => {
  const e = validateCatalog([good({ channels: [{ provider: "etsy", checkoutUrl: "http://x.com", delivery: "platform_download" }], priceCents: 4.5 })]).join();
  assert.match(e, /https/); assert.match(e, /positive integer/);
});
test("drafts may be incomplete", () =>
  assert.deepEqual(validateCatalog([good({ status: "draft", refundPolicy: undefined, checklist: {}, reviewOn: undefined, rights: { ...good().rights, verified: false } })]), []));

test("summarize nets fees, fulfillment and refunds, counts repeat buyers", () => {
  const s = summarize([
    { productKey: "a", grossCents: 1400, feeCents: 300, fulfillmentCents: 0, refundedCents: 0, customerRef: "u1" },
    { productKey: "a", grossCents: 400, feeCents: 90, fulfillmentCents: 0, refundedCents: 400, customerRef: "u1", supportMinutes: 10 },
    { productKey: "b", grossCents: 700, feeCents: 120, fulfillmentCents: 0, refundedCents: 0, customerRef: "u2" },
  ]);
  assert.equal(s.grossCents, 2500); assert.equal(s.netCents, 2500 - 510 - 400);
  assert.equal(s.repeatCustomers, 1); assert.equal(s.supportMinutes, 10);
  assert.equal(summarize([]).netCents, 0);
});
test("remainingToGoal never goes negative", () => {
  assert.equal(remainingToGoal(0), 40000); assert.equal(remainingToGoal(50000), 0);
});

test("one product can sell on several channels; each needs delivery and https", () => {
  const two = good({ channels: [
    { provider: "etsy", checkoutUrl: "https://example.com/e", delivery: "platform_download" },
    { provider: "payhip", checkoutUrl: "https://example.com/p", delivery: "platform_download", priceCents: 500 }] });
  assert.deepEqual(validateCatalog([two]), []);
  assert.match(validateCatalog([good({ channels: [{ provider: "payhip", delivery: "none" }] })]).join(), /delivery method/);
});
test("a ready product needs a real channel; mixing referral and direct is rejected", () => {
  assert.match(validateCatalog([good({ status: "ready", channels: [] })]).join(), /real sales channel/);
  const mixed = good({ channels: [{ provider: "etsy", delivery: "platform_download" }, { provider: "amazon_associates", delivery: "external_retailer" }] });
  assert.match(validateCatalog([mixed]).join(), /mixes referral and direct/);
});

import { parseSalesCsv } from "../src/lib/commerce/metrics.ts";
test("parseSalesCsv reads dollars into cents and rejects bad rows", () => {
  const rows = parseSalesCsv("date,productKey,channel,gross,fees,fulfillment,refunded,customerRef,supportMinutes\n# note\n2026-12-01,pbr-just-in-case,etsy,12.00,1.59,0,0,u1,5\n2026-12-02,pbr-just-in-case,etsy,12,1.59,,12,u2,\n");
  assert.equal(rows.length, 2);
  assert.equal(rows[0].grossCents, 1200); assert.equal(rows[0].feeCents, 159); assert.equal(rows[0].supportMinutes, 5);
  assert.equal(rows[1].refundedCents, 1200);
  assert.equal(summarize(rows).netCents, 1200 - 159 + 1200 - 159 - 1200);
  assert.throws(() => parseSalesCsv("date,productKey,gross\n2026-12-01,x,twelve"), /not dollars/);
  assert.throws(() => parseSalesCsv("a,b\n1,2"), /bad header/);
});

// SYNTHETIC orders (fixture strings only; never written to private/commerce/sales.csv)
import { summarizeBy, weekStart } from "../src/lib/commerce/metrics.ts";
const SYNTHETIC = [
  "date,productKey,channel,gross,fees,fulfillment,refunded,customerRef,supportMinutes",
  "2026-12-01,book,etsy,12.00,1.59,0,0,a,2",       // first sale (Tuesday)
  "2026-12-03,book,payhip,12.00,1.25,0,0,b,0",     // second channel, same week
  "2026-12-08,plan,etsy,6.00,1.07,0,0,a,0",        // next week, repeat buyer, other product
  "2026-12-09,book,etsy,12.00,1.59,0,12.00,c,10",  // full refund, fees not returned
  "2026-12-13,book,etsy,12.00,1.59,0,0,d,0",       // Sunday belongs to the week of Dec 7
].join("\n");
test("synthetic orders: first sale, channels, fees, refunds, weeks, products", () => {
  const rows = parseSalesCsv(SYNTHETIC);
  assert.equal(summarize(rows.slice(0, 1)).netCents, 1200 - 159);               // first sale net
  const total = summarize(rows);
  assert.equal(total.orders, 5);
  assert.equal(total.grossCents, 5400); assert.equal(total.feesCents, 159 + 125 + 107 + 159 + 159);
  assert.equal(total.refundsCents, 1200);
  assert.equal(total.netCents, 5400 - 709 - 1200);
  assert.equal(total.repeatCustomers, 1);
  const ch = summarizeBy(rows, (r) => r.channel ?? "unknown");
  assert.deepEqual([...ch.keys()], ["etsy", "payhip"]);
  assert.equal(ch.get("payhip")!.netCents, 1200 - 125);
  assert.equal(ch.get("etsy")!.netCents, total.netCents - (1200 - 125));
  const pr = summarizeBy(rows, (r) => r.productKey);
  assert.equal(pr.get("plan")!.netCents, 600 - 107);
  const wk = summarizeBy(rows, (r) => weekStart(r.date));
  assert.deepEqual([...wk.keys()], ["2026-11-30", "2026-12-07"]);
  assert.equal(wk.get("2026-11-30")!.orders, 2);
  assert.equal(wk.get("2026-12-07")!.orders, 3);
  assert.equal(wk.get("2026-12-07")!.refundsCents, 1200);
  assert.equal(remainingToGoal(total.netCents), 40000 - total.netCents);
});
test("weekStart handles Mondays, Sundays and bad dates", () => {
  assert.equal(weekStart("2026-12-07"), "2026-12-07"); assert.equal(weekStart("2026-12-13"), "2026-12-07");
  assert.equal(weekStart("garbage"), "unknown"); assert.equal(weekStart(undefined), "unknown");
});

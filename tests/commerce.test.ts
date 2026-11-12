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

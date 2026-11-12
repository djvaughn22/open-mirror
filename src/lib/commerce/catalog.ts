// Open Mirror shared commerce catalog: schema + validator only.
//
// This file holds NO real products. Real catalog data lives in the git-ignored
// private/commerce/catalog.json (this repo is public) and is checked with
// `npm run catalog:check`. Nothing here renders on a page, takes a payment,
// or contacts any service. Rules are enforced by validateCatalog().

export const BRANDS = [
  "openmirror", "stepinthering", "idontcry", "pleasebeready", "whatamiai",
  "watchednotwatched", "animalsalwaysknew", "crossheartpray", "thedjcares",
] as const;
export type Brand = (typeof BRANDS)[number];

/** Mission-first brands: no sales funnels, no listings of any kind. */
export const NONCOMMERCIAL: readonly Brand[] = ["crossheartpray", "thedjcares"];

export const PRODUCT_TYPES = [
  "original_download", "book", "print_on_demand", "affiliate", "subscription", "service",
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export type Status = "draft" | "ready" | "published" | "retired";

export const PROVIDERS = [
  "none", "etsy", "stripe", "gumroad", "payhip", "kdp", "ingramspark",
  "printful", "printify", "amazon_associates", "other_affiliate",
] as const;
export type Provider = (typeof PROVIDERS)[number];

export const DELIVERY = [
  "none", "platform_download", "email_link", "partner_ships", "external_retailer",
] as const;
export type Delivery = (typeof DELIVERY)[number];

export const CHECKLIST_KEYS = [
  "rights", "quality", "value", "pricing_fulfillment", "purchase_path",
  "disclosures", "mobile_accessibility", "analytics", "support_refund", "review_scheduled",
] as const;
export type ChecklistKey = (typeof CHECKLIST_KEYS)[number];
export type Checklist = Partial<Record<ChecklistKey, { passed: boolean; on: string; note?: string }>>;

export type CatalogProduct = {
  id: string;                    // lowercase slug, unique across the portfolio
  brand: Brand;                  // owning brand
  type: ProductType;
  title: string;
  description: string;
  images: string[];              // paths or https URLs
  priceCents?: number;           // direct sales only; absent for affiliate
  currency?: "USD";
  available: boolean;
  status: Status;
  provider: Provider;
  checkoutUrl?: string;          // https only
  delivery: Delivery;
  rights: { owner: string; verified: boolean; thirdPartyAssets: string[]; license: string };
  refundPolicy?: string;         // required for direct sales
  supportContact?: string;       // required for direct sales
  disclosureKey?: string;        // required for affiliate (maps to a site disclosure)
  analytics: { productKey: string }; // opaque key used in events; never PII
  holds: string[];               // open approvals; any hold blocks "published"
  checklist: Checklist;
  reviewOn?: string;             // post-launch review date YYYY-MM-DD
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Affiliate and external-retailer links are referrals; everything else is a direct purchase. */
export function channelOf(p: Pick<CatalogProduct, "type" | "provider" | "delivery">): "referral" | "direct" {
  if (p.type === "affiliate") return "referral";
  if (p.provider === "amazon_associates" || p.provider === "other_affiliate") return "referral";
  return "direct";
}

export function validateCatalog(products: CatalogProduct[]): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  const keys = new Set<string>();
  for (const p of products) {
    const at = `[${p.id}]`;
    if (!SLUG.test(p.id)) errs.push(`${at} id must be a lowercase slug`);
    if (ids.has(p.id)) errs.push(`${at} duplicate id`);
    ids.add(p.id);
    if (keys.has(p.analytics?.productKey)) errs.push(`${at} duplicate analytics productKey`);
    keys.add(p.analytics?.productKey);
    if (!BRANDS.includes(p.brand)) errs.push(`${at} unknown brand`);
    if (!PRODUCT_TYPES.includes(p.type)) errs.push(`${at} unknown type`);
    if (!PROVIDERS.includes(p.provider)) errs.push(`${at} unknown provider`);
    if (!DELIVERY.includes(p.delivery)) errs.push(`${at} unknown delivery`);
    if (!p.title?.trim() || !p.description?.trim()) errs.push(`${at} title and description required`);
    if (!SLUG.test(p.analytics?.productKey ?? "")) errs.push(`${at} analytics.productKey must be a slug`);
    if (p.checkoutUrl && !/^https:\/\//.test(p.checkoutUrl)) errs.push(`${at} checkoutUrl must be https`);
    if (p.priceCents !== undefined && (!Number.isInteger(p.priceCents) || p.priceCents <= 0))
      errs.push(`${at} priceCents must be a positive integer`);
    if (p.reviewOn && !DATE.test(p.reviewOn)) errs.push(`${at} reviewOn must be YYYY-MM-DD`);

    const channel = channelOf(p);
    if (channel === "referral") {
      if (p.priceCents !== undefined) errs.push(`${at} referral items carry no price (the retailer sets it)`);
      if (!p.disclosureKey) errs.push(`${at} referral items need a disclosureKey`);
      if (p.delivery === "platform_download" || p.delivery === "email_link")
        errs.push(`${at} referral items cannot be delivered by us`);
    }
    if (NONCOMMERCIAL.includes(p.brand) && p.status !== "draft")
      errs.push(`${at} ${p.brand} is noncommercial; no listings allowed`);

    const live = p.status === "ready" || p.status === "published";
    if (!live) continue;
    if (channel === "direct") {
      if (p.priceCents === undefined) errs.push(`${at} direct products need priceCents`);
      if (p.currency !== "USD") errs.push(`${at} currency must be USD`);
      if (!p.refundPolicy?.trim()) errs.push(`${at} refundPolicy required`);
      if (!p.supportContact?.trim()) errs.push(`${at} supportContact required`);
      if (p.provider === "none" || p.delivery === "none") errs.push(`${at} provider and delivery required`);
    }
    if (!p.rights?.verified) errs.push(`${at} rights not verified`);
    if (!p.rights?.owner || !p.rights?.license) errs.push(`${at} rights owner and license required`);
    if (!p.reviewOn) errs.push(`${at} post-launch reviewOn date required`);
    if (p.status === "published") {
      if (!p.available) errs.push(`${at} published but not available`);
      if (p.holds.length) errs.push(`${at} published with open holds: ${p.holds.join("; ")}`);
      if (!p.checkoutUrl) errs.push(`${at} published without checkoutUrl`);
      for (const k of CHECKLIST_KEYS) if (!p.checklist[k]?.passed) errs.push(`${at} checklist item "${k}" not passed`);
    }
  }
  return errs;
}

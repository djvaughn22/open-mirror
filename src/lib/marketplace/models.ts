// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Marketplace: data shapes (owner direction, Nov 26-27 2026).
// Types only. No merchant participates yet; nothing is listed, bought, held,
// paid out or attributed. These shapes exist so the first real merchant, with
// a signed agreement, can be onboarded without rebuilding anything.
//
// Rules the shapes enforce by design:
// - Category-specific details live in `attributes` (a watch's movement, a
//   chair's wood), never as watch-only fields on every item.
// - An asking price is never confused with a completed sale.
// - Valuations are labeled by source; an AI estimate is never an appraisal.
// - Images carry their usage permission.
// - Merchants own their listings, customers and transactions; Open Mirror
//   facilitates discovery, inquiries and referrals under a written agreement.
// - No payment custody, escrow or payouts: those fields don't exist on purpose.
// ─────────────────────────────────────────────────────────────────────────────

export type Id = string;
export type IsoDate = string;
export type Money = { amount: number; currency: string };

export type MerchantStatus = "prospect" | "agreement-pending" | "active" | "paused" | "ended";

export type Merchant = {
  id: Id;
  name: string;
  /** Prospects are private notes, never public. Only "active" merchants are ever shown. */
  status: MerchantStatus;
  categories: Id[];
  locations: { city: string; state: string; country: string; public: boolean }[];
  services: ("sell" | "buy" | "consign" | "restore" | "appraise" | "source")[];
  website?: string;
  /** The signed agreement, by reference; terms live in the agreement, not here. */
  agreement?: Id;
  /** Explicit permission to show the name, logo, images and contact details. */
  publicationConsent?: { at: IsoDate; scope: ("name" | "logo" | "images" | "contact" | "inventory")[] };
  approvedBy?: Id;
};

export type Category = {
  id: Id;
  name: string;
  parent?: Id;
  /** The attribute keys that matter for this kind of item (e.g. "movement", "case-material"). */
  attributeKeys: string[];
  restricted?: boolean;
};

export type Condition = "new" | "excellent" | "good" | "fair" | "for-parts" | "restored" | "unknown";

export type ImageRef = {
  url: string;
  /** Who may use it, where. */
  permission: "merchant-owned-granted" | "licensed" | "public-domain";
  credit?: string;
};

export type Provenance = { note: string; documents: Id[]; providedBy: "merchant" | "seller" | "third-party" };

export type Authenticity = {
  status: "merchant-stated" | "documented" | "third-party-verified" | "unknown";
  documents: Id[];
  /** Open Mirror never guarantees authenticity. */
  disclaimer: string;
};

export type Valuation = {
  amount: Money;
  source: "merchant-asking" | "completed-sale" | "professional-appraisal" | "ai-estimate";
  at: IsoDate;
  /** Required for an ai-estimate: it is not an appraisal. */
  caveat?: string;
};

export type InventoryItem = {
  id: Id;
  merchant: Id;
  sku?: string;
  category: Id;
  title: string;
  /** Only from merchant-provided facts. */
  description: string;
  attributes: Record<string, string>;
  condition: Condition;
  provenance?: Provenance;
  authenticity: Authenticity;
  images: ImageRef[];
  askingPrice?: Money;
  availability: "available" | "on-hold" | "sold" | "withdrawn";
  /** A public listing needs the merchant's approval of this exact text. */
  approvedForPublicAt?: IsoDate;
  restoration?: { offered: boolean; note?: string };
};

export type BuyerRequest = {
  id: Id;
  /** What they want, in their words; kept private. */
  description: string;
  category?: Id;
  budget?: Money;
  contact: { email: string; consentToShareWithMerchants: boolean };
  createdAt: IsoDate;
  status: "open" | "matched" | "closed";
};

export type SellerInquiry = {
  id: Id;
  description: string;
  category?: Id;
  /** Photos only by the seller's upload, never scraped. */
  images: ImageRef[];
  contact: { email: string; consentToShareWithMerchants: boolean };
  createdAt: IsoDate;
  status: "new" | "referred" | "declined" | "closed";
};

export type ProcurementOpportunity = {
  id: Id;
  merchant: Id;
  /** Where it was seen: an authorized feed, a public listing link, or a person. */
  source: { kind: "buyer-request" | "seller-inquiry" | "estate-sale-listing" | "auction-listing" | "supplier"; url?: string };
  note: string;
  /** Never an automatic bid or purchase. */
  action: "notify-merchant-only";
};

/** One referral: who introduced whom, when, under which agreement. */
export type Referral = {
  id: Id;
  merchant: Id;
  kind: "buyer" | "seller" | "restoration" | "procurement" | "wholesale";
  inquiry: Id;
  introducedAt: IsoDate;
  /** Which written agreement governs attribution and any fee. */
  agreement: Id;
};

/** Terms are negotiated in writing; nothing here assumes a percentage. */
export type CommissionAgreement = {
  id: Id;
  merchant: Id;
  signedAt?: IsoDate;
  kinds: Referral["kind"][];
  /** Plain-language summary; the signed document governs. */
  summary: string;
  attributionWindowDays?: number;
  documents: Id[];
};

/** Reported by the merchant (Open Mirror holds no money). */
export type TransactionReference = {
  id: Id;
  referral: Id;
  reportedBy: Id;
  reportedAt: IsoDate;
  completedSalePrice?: Money;
  status: "reported" | "confirmed" | "disputed";
};

export type AuditEvent = {
  at: IsoDate;
  actor: Id;
  action: string;
  subject: { kind: "merchant" | "item" | "inquiry" | "referral" | "agreement"; id: Id };
  note?: string;
};

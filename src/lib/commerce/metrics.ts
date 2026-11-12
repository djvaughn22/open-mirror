// Measurement vocabulary and arithmetic. Only records what a platform or our own
// analytics actually reported; unknown values stay undefined, never estimated.

export const EVENTS = {
  page_view: "product_page_view",          // visitors to a product page
  referral_click: "referral_click",        // outbound click to a retailer/affiliate
  checkout_start: "checkout_start",        // only where the platform exposes it
} as const;

export type SaleRecord = {
  productKey: string;
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

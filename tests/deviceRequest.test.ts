// ─────────────────────────────────────────────────────────────────────────────
// Device request system tests — validation, the server pipeline, and the
// honesty locks for the request/confirmation/terms pages.
//
//   npm test
//
// No real email is ever sent here: the sender is injected, so every path —
// success, delivery failure, unconfigured, honeypot, rate limit — runs
// against a recorder.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  ACKNOWLEDGEMENTS,
  buildRequestSummaryText,
  LIMITS,
  TERMS_VERSION,
  validateDeviceRequest,
} from "../src/lib/deviceRequest.ts";
import {
  buildCustomerEmailText,
  buildOwnerEmailText,
  makeRequestNumber,
  missingConfig,
  processDeviceRequest,
  RateStore,
  readDeviceRequestConfig,
  REQUEST_NUMBER_RE,
  type DeviceRequestConfig,
  type OutboundEmail,
} from "../src/lib/deviceRequestServer.ts";

const repoRoot = join(import.meta.dirname, "..");
const read = (rel: string) => readFileSync(join(repoRoot, rel), "utf8");
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const allAcks = () =>
  Object.fromEntries(ACKNOWLEDGEMENTS.map((a) => [a.key, true]));

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    firstName: "Dana",
    lastName: "Whitfield",
    email: "dana@example.com",
    phone: "",
    deviceType: "Laptop",
    manufacturer: "Dell",
    model: "Latitude 5400",
    approximateAge: "about 6 years",
    powersOn: "Yes",
    operatingSystem: "Windows 10",
    sizeOrWeight: "",
    condition: "Good — works, normal wear",
    intendedUse: "Learning to build a website for my bakery.",
    notes: "",
    zip: "63101",
    preferredContact: "Email",
    acknowledgements: allAcks(),
    website: "",
    ...overrides,
  };
}

const fullConfig: DeviceRequestConfig = {
  notifyEmail: "owner@example.com",
  fromEmail: "Open Mirror <requests@example.com>",
  providerKeyPresent: true,
  formEnabled: true,
};

function makeCtx(overrides: Partial<Parameters<typeof processDeviceRequest>[1]> = {}) {
  const sent: OutboundEmail[] = [];
  const ctx = {
    now: () => new Date("2026-07-19T18:00:00.000Z"),
    ip: "203.0.113.7",
    config: { ...fullConfig },
    sender: async (email: OutboundEmail) => {
      sent.push(email);
      return { ok: true };
    },
    store: new RateStore(),
    ...overrides,
  };
  return { ctx, sent };
}

const submit = (body: unknown, ctx: Parameters<typeof processDeviceRequest>[1]) =>
  processDeviceRequest(JSON.stringify(body), ctx);

// ── Validation ───────────────────────────────────────────────────────────────

test("a complete laptop request validates", () => {
  const result = validateDeviceRequest(validBody());
  assert.ok(result.ok, JSON.stringify(!result.ok && result.fieldErrors));
  assert.equal(result.data.deviceType, "Laptop");
});

test("a complete desktop request validates", () => {
  const result = validateDeviceRequest(
    validBody({
      deviceType: "Desktop",
      sizeOrWeight: "Mid tower, maybe 25 lbs",
    })
  );
  assert.ok(result.ok);
  assert.equal(result.data.deviceType, "Desktop");
  assert.equal(result.data.sizeOrWeight, "Mid tower, maybe 25 lbs");
});

test("missing names are individual field errors", () => {
  const result = validateDeviceRequest(validBody({ firstName: "", lastName: "  " }));
  assert.ok(!result.ok);
  assert.match(result.fieldErrors.firstName, /required/i);
  assert.match(result.fieldErrors.lastName, /required/i);
});

test("an invalid email is rejected", () => {
  for (const email of ["not-an-email", "a@b", "a b@c.com", ""]) {
    const result = validateDeviceRequest(validBody({ email }));
    assert.ok(!result.ok, `"${email}" should fail`);
    assert.ok(result.fieldErrors.email);
  }
});

test("enum values are allowlisted — anything else fails", () => {
  for (const [key, value] of [
    ["deviceType", "Toaster"],
    ["powersOn", "Mostly"],
    ["condition", "Mint"],
    ["preferredContact", "Carrier pigeon"],
  ] as const) {
    const result = validateDeviceRequest(validBody({ [key]: value }));
    assert.ok(!result.ok, `${key}=${value} should fail`);
    assert.ok(result.fieldErrors[key], `${key} should carry the error`);
  }
});

test("phone becomes required when phone is the preferred contact", () => {
  const result = validateDeviceRequest(
    validBody({ preferredContact: "Phone", phone: "" })
  );
  assert.ok(!result.ok);
  assert.match(result.fieldErrors.phone, /required/i);
});

test("every acknowledgement is enforced individually", () => {
  const none = validateDeviceRequest(validBody({ acknowledgements: {} }));
  assert.ok(!none.ok);
  for (const a of ACKNOWLEDGEMENTS) {
    assert.ok(none.fieldErrors[`ack-${a.key}`], `${a.key} must be individually required`);
  }
  for (const a of ACKNOWLEDGEMENTS) {
    const acks = allAcks();
    delete (acks as Record<string, unknown>)[a.key];
    const result = validateDeviceRequest(validBody({ acknowledgements: acks }));
    assert.ok(!result.ok, `missing ${a.key} must fail alone`);
    assert.deepEqual(Object.keys(result.fieldErrors), [`ack-${a.key}`]);
  }
  // "true"-ish strings do not count — only boolean true.
  const stringy = validateDeviceRequest(
    validBody({ acknowledgements: { ...allAcks(), ownership: "true" } })
  );
  assert.ok(!stringy.ok);
});

test("oversized input is an error, not a silent truncation", () => {
  const result = validateDeviceRequest(
    validBody({ manufacturer: "x".repeat(LIMITS.short + 1), notes: "y".repeat(LIMITS.long + 1) })
  );
  assert.ok(!result.ok);
  assert.ok(result.fieldErrors.manufacturer);
  assert.ok(result.fieldErrors.notes);
});

test("HTML and script input is stripped before it can reach an email", () => {
  const result = validateDeviceRequest(
    validBody({
      firstName: '<script>alert("x")</script>Dana',
      notes: "Line one\n<img src=x onerror=alert(1)>\nLine two",
    })
  );
  assert.ok(result.ok);
  assert.ok(!result.data.firstName.includes("<"));
  assert.ok(!result.data.notes.includes("<"));
  const owner = buildOwnerEmailText(result.data, {
    requestNumber: "OM-DEV-TESTAA",
    submittedAtIso: "2026-07-19T18:00:00.000Z",
  });
  assert.ok(!owner.includes("<script"));
});

// ── Request numbers ──────────────────────────────────────────────────────────

test("request numbers are readable, non-sequential, and well-formed", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const id = makeRequestNumber();
    assert.match(id, REQUEST_NUMBER_RE, `${id} must match the public format`);
    assert.doesNotMatch(id.slice("OM-DEV-".length), /[ILO01]/, "no ambiguous characters");
    seen.add(id);
  }
  assert.ok(seen.size > 190, "ids must not repeat like a sequence");
});

// ── The pipeline ─────────────────────────────────────────────────────────────

test("a valid submission sends owner + customer email and returns server-made identity", async () => {
  const { ctx, sent } = makeCtx();
  const result = await submit(
    validBody({
      // Anything the client claims about identity is ignored.
      requestNumber: "OM-DEV-HACKED",
      submittedAt: "1999-01-01T00:00:00.000Z",
    }),
    ctx
  );
  assert.equal(result.status, 200);
  assert.ok(result.body.ok);
  assert.match(result.body.requestNumber, REQUEST_NUMBER_RE);
  assert.notEqual(result.body.requestNumber, "OM-DEV-HACKED");
  assert.equal(result.body.submittedAt, "2026-07-19T18:00:00.000Z");
  assert.equal(result.body.termsVersion, TERMS_VERSION);
  assert.equal(result.body.customerEmailSent, true);

  assert.equal(sent.length, 2);
  const [owner, customer] = sent;
  assert.equal(owner.to, "owner@example.com");
  assert.equal(owner.replyTo, "dana@example.com");
  assert.match(owner.subject, /\[Device request\] OM-DEV-[A-Z2-9]{6} — Laptop — Dell/);
  assert.match(owner.text, /Copy-ready Novo invoice block/);
  assert.match(owner.text, /Terms version: /);
  assert.match(owner.text, /Source page: \/products\/old-laptop-to-build-machine/);
  assert.doesNotMatch(owner.text, /password/i, "owner email never mentions or carries passwords");

  assert.equal(customer.to, "dana@example.com");
  assert.match(customer.subject, /do not ship yet/i);
  assert.match(customer.text, /DO NOT SHIP/i);
  assert.match(customer.text, /No payment is taken on the Open Mirror website/i);
  assert.doesNotMatch(customer.text, /accepted your request|request (is|was|has been) accepted/i,
    "the confirmation email must never claim acceptance");
});

test("a desktop submission carries the desktop through to both emails", async () => {
  const { ctx, sent } = makeCtx();
  const result = await submit(
    validBody({ deviceType: "Desktop", manufacturer: "HP", model: "EliteDesk 800" }),
    ctx
  );
  assert.ok(result.body.ok);
  assert.match(sent[0].subject, /Desktop — HP EliteDesk 800/);
  assert.match(sent[1].text, /Device type: Desktop/);
});

test("server-side validation failures return structured field errors", async () => {
  const { ctx, sent } = makeCtx();
  const result = await submit(validBody({ email: "nope", deviceType: "Toaster" }), ctx);
  assert.equal(result.status, 422);
  assert.ok(!result.body.ok);
  assert.equal(result.body.error.code, "validation");
  assert.ok(result.body.error.fieldErrors?.email);
  assert.ok(result.body.error.fieldErrors?.deviceType);
  assert.equal(sent.length, 0, "nothing may be sent for an invalid request");
});

test("the honeypot swallows bot submissions without sending anything", async () => {
  const { ctx, sent } = makeCtx();
  const result = await submit(validBody({ website: "https://spam.example" }), ctx);
  assert.equal(result.status, 200, "bots learn nothing from the response");
  assert.ok(result.body.ok);
  assert.equal(sent.length, 0, "no email for honeypot submissions");
});

test("duplicate rapid submissions are refused politely", async () => {
  const { ctx, sent } = makeCtx();
  const first = await submit(validBody(), ctx);
  assert.ok(first.body.ok);
  const second = await submit(validBody(), ctx);
  assert.equal(second.status, 409);
  assert.ok(!second.body.ok);
  assert.equal(second.body.error.code, "duplicate");
  assert.equal(sent.length, 2, "the duplicate must not send again");
});

test("per-connection rate limiting kicks in", async () => {
  const { ctx } = makeCtx();
  for (let i = 0; i < 5; i++) {
    const result = await submit(validBody({ email: `person${i}@example.com` }), ctx);
    assert.ok(result.body.ok, `submission ${i} should pass`);
  }
  const sixth = await submit(validBody({ email: "person6@example.com" }), ctx);
  assert.equal(sixth.status, 429);
  assert.ok(!sixth.body.ok);
  assert.equal(sixth.body.error.code, "rate_limited");
});

test("delivery failure is reported honestly — never a fake success", async () => {
  const { ctx } = makeCtx({ sender: async () => ({ ok: false }) });
  const result = await submit(validBody(), ctx);
  assert.equal(result.status, 502);
  assert.ok(!result.body.ok);
  assert.equal(result.body.error.code, "delivery_failed");
  assert.match(result.body.error.message, /not lost/i, "the customer is told their answers survive");
});

test("a failed customer confirmation does not fail the request", async () => {
  let calls = 0;
  const { ctx } = makeCtx({
    sender: async () => {
      calls += 1;
      return { ok: calls === 1 }; // owner email succeeds, customer email bounces
    },
  });
  const result = await submit(validBody(), ctx);
  assert.equal(result.status, 200);
  assert.ok(result.body.ok);
  assert.equal(result.body.customerEmailSent, false);
});

test("missing configuration disables submission with a structured error", async () => {
  const { ctx, sent } = makeCtx({
    config: { ...fullConfig, providerKeyPresent: false },
  });
  const result = await submit(validBody(), ctx);
  assert.equal(result.status, 503);
  assert.ok(!result.body.ok);
  assert.equal(result.body.error.code, "unconfigured");
  assert.doesNotMatch(result.body.error.message, /RESEND|env|variable/i,
    "the public error never names internal configuration");
  assert.equal(sent.length, 0);
});

test("the form kill switch works", async () => {
  const { ctx } = makeCtx({ config: { ...fullConfig, formEnabled: false } });
  const result = await submit(validBody(), ctx);
  assert.equal(result.status, 503);
  assert.ok(!result.body.ok && result.body.error.code === "unconfigured");
});

test("oversized raw bodies and unreadable bodies return structured errors", async () => {
  const { ctx } = makeCtx();
  const big = await processDeviceRequest("x".repeat(LIMITS.maxBodyBytes + 1), ctx);
  assert.equal(big.status, 413);
  assert.ok(!big.body.ok && big.body.error.code === "too_large");

  const { ctx: ctx2 } = makeCtx();
  const garbled = await processDeviceRequest("{not json", ctx2);
  assert.equal(garbled.status, 400);
  assert.ok(!garbled.body.ok && garbled.body.error.code === "bad_request");
});

test("config reading maps env names correctly and reports what is missing", () => {
  const config = readDeviceRequestConfig({
    RESEND_API_KEY: "k",
    DEVICE_REQUEST_NOTIFY_EMAIL: "owner@example.com",
    DEVICE_REQUEST_FROM_EMAIL: "from@example.com",
  });
  assert.deepEqual(missingConfig(config), []);
  assert.equal(config.formEnabled, true);

  const empty = readDeviceRequestConfig({});
  assert.deepEqual(missingConfig(empty), [
    "RESEND_API_KEY",
    "DEVICE_REQUEST_NOTIFY_EMAIL",
    "DEVICE_REQUEST_FROM_EMAIL",
  ]);
  assert.equal(
    readDeviceRequestConfig({ DEVICE_REQUEST_FORM_ENABLED: "0" }).formEnabled,
    false
  );
});

// ── Page and copy locks ──────────────────────────────────────────────────────

const FORM_PATH = "src/app/products/old-laptop-to-build-machine/DeviceRequestForm.tsx";
const PAGE_PATH = "src/app/products/old-laptop-to-build-machine/page.tsx";
const CONFIRM_PATH = "src/app/products/old-laptop-to-build-machine/request-received/RequestReceived.tsx";

test("the request flow pages exist", () => {
  for (const rel of [
    PAGE_PATH,
    FORM_PATH,
    CONFIRM_PATH,
    "src/app/products/old-laptop-to-build-machine/request-received/page.tsx",
    "src/app/products/old-laptop-to-build-machine/service-terms/page.tsx",
    "src/app/products/old-laptop-to-build-machine/privacy/page.tsx",
    "src/app/api/device-request/route.ts",
  ]) {
    assert.ok(existsSync(join(repoRoot, rel)), `${rel} must exist`);
  }
});

// 2026-08-04: the hero became the three-door chooser (Buy · Build Your Own ·
// Sell or Donate) per the owner's refurbished-business brief. The device
// request must stay reachable and both device families named.
test("the hero offers the three doors and the device request stays reachable", () => {
  const page = stripComments(read(PAGE_PATH));
  assert.match(page, /Start a device request/);
  assert.match(page, /Buy a Build Machine/);
  assert.match(page, /Sell or Donate/i);
  assert.doesNotMatch(page, /buy now/i);
  assert.match(page, /laptop/i);
  assert.match(page, /desktop/i);
});

test("the form never collects credentials and warns against them visibly", () => {
  const form = read(FORM_PATH);
  assert.match(
    form,
    /Never enter a password, PIN, encryption key, financial information, or\s+private file contents in this form\./
  );
  const shipped = stripComments(form);
  assert.doesNotMatch(shipped, /type="password"|type="file"/i, "no password or upload fields, ever");
  assert.match(form, /Submit device request/, "the primary action is the request, not a purchase");
});

test("submission UX never implies acceptance, invoice, payment, or permission to ship", () => {
  const form = stripComments(read(FORM_PATH));
  assert.match(form, /does not accept the\s+request, send an invoice, take a payment/);
  const confirm = stripComments(read(CONFIRM_PATH));
  assert.match(confirm, /Request received\. Please do not ship your device yet\./);
  assert.match(confirm, /Submitted for review/);
  assert.doesNotMatch(confirm, /your request (is|was|has been) accepted/i);
});

test("the confirmation page renders exactly one completed step", () => {
  const confirm = read(CONFIRM_PATH);
  assert.match(confirm, /"Request submitted",\s*"Open Mirror review",\s*"Invoice and payment",\s*"Shipping instructions",\s*"Device received",/);
  assert.match(confirm, /i === 0/, "only the first status step may show as complete");
  assert.match(confirm, /No request confirmation found/, "the missing-confirmation state must exist");
});

test("terms and privacy stand on their own with a version and effective date", () => {
  const terms = read("src/app/products/old-laptop-to-build-machine/service-terms/page.tsx");
  assert.match(terms, /TERMS_VERSION/);
  assert.match(terms, /TERMS_EFFECTIVE_DATE/);
  assert.match(stripComments(terms), /erasing the device|intentionally erasing/i);
  assert.doesNotMatch(stripComments(terms), /attorney|abandoned property|lien|nonrefundable/i,
    "no invented legal or forfeiture policy");
  const privacy = read("src/app/products/old-laptop-to-build-machine/privacy/page.tsx");
  assert.match(stripComments(privacy), /no\s+customer\s+database\s+behind\s+this\s+form/i,
    "the privacy notice stays honest about retention");
  assert.doesNotMatch(stripComments(privacy), /perfect security|fully secure|guaranteed secure/i);
});

test("no payment credential or provider secret reaches client components", () => {
  for (const rel of [FORM_PATH, CONFIRM_PATH]) {
    const src = read(rel);
    assert.match(src, /^"use client";/, `${rel} is a client component`);
    assert.doesNotMatch(src, /RESEND|API_KEY|process\.env/i, `${rel} must not touch server secrets`);
  }
});

test("operations and setup documentation exists and contains no secrets", () => {
  for (const rel of ["DEVICE_REQUEST_OPERATIONS.md", "PAYPAL_NOVO_MANUAL_SETUP.md", ".env.example"]) {
    assert.ok(existsSync(join(repoRoot, rel)), `${rel} must exist`);
    const doc = read(rel);
    assert.doesNotMatch(doc, /re_[A-Za-z0-9]{16,}|sk-[A-Za-z0-9]{16,}/, `${rel} must not contain a credential`);
  }
  const envExample = read(".env.example");
  for (const name of ["RESEND_API_KEY", "DEVICE_REQUEST_NOTIFY_EMAIL", "DEVICE_REQUEST_FROM_EMAIL"]) {
    assert.match(envExample, new RegExp(`^${name}=$`, "m"), `${name} must be listed with no value`);
  }
});

test("the request summary text never includes fields the form must not collect", () => {
  const validated = validateDeviceRequest(validBody());
  assert.ok(validated.ok);
  const summary = buildRequestSummaryText(validated.data);
  assert.doesNotMatch(summary, /password|credit|card number|ssn/i);
  const customer = buildCustomerEmailText(validated.data, {
    requestNumber: "OM-DEV-TESTAA",
    submittedAtIso: "2026-07-19T18:00:00.000Z",
  });
  assert.match(customer, /Never send passwords/);
});

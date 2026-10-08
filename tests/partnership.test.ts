// ─────────────────────────────────────────────────────────────────────────────
// Partnership inquiry tests — validation, real code verification, limits, and
// the honesty locks for /partnership.
//
//   npm test
//
// No real email is ever sent: the sender is injected and records every
// message, so the code a visitor would receive is read from the recorder —
// the same way a person reads it from their inbox. Nothing is bypassed.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildInquirySummaryText,
  normalizeProfileUrl,
  stepErrors,
  validatePartnershipInquiry,
  WAYS,
} from "../src/lib/partnership.ts";
import {
  confirmAndSend,
  issueFormStamp,
  makeFormStamp,
  MAX_ATTEMPTS_PER_CODE,
  missingPartnershipConfig,
  partnershipConfigured,
  RateStore,
  readPartnershipConfig,
  readVerificationToken,
  REFERENCE_RE,
  startVerification,
  type OutboundEmail,
  type PartnershipConfig,
} from "../src/lib/partnershipServer.ts";
import { STUDIO } from "../src/lib/products.ts";

const repoRoot = join(import.meta.dirname, "..");
const read = (rel: string) => readFileSync(join(repoRoot, rel), "utf8");
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ruth Calloway",
    email: "ruth@harborstone.example",
    role: "Operating Partner",
    firm: "Harborstone Partners",
    profileUrl: "harborstone.example/team/ruth",
    experience: "Twelve years backing and running small consumer software companies.",
    ways: ["Operating partnership", "Strategic advice"],
    otherWay: "",
    resonates: "Building slowly and honestly, with faith at the center.",
    website: "",
    ...overrides,
  };
}

const T0 = Date.parse("2026-10-08T18:00:00.000Z");
const env = {
  RESEND_API_KEY: "test-provider-key",
  PARTNERSHIP_FROM_EMAIL: "Open Mirror <hello@example.com>",
  PARTNERSHIP_NOTIFY_EMAIL: "owner-inbox@example.com",
};

function makeCtx(overrides: { config?: Partial<PartnershipConfig>; ip?: string; ok?: boolean } = {}) {
  const sent: OutboundEmail[] = [];
  let clock = T0;
  const config = { ...readPartnershipConfig(env), ...overrides.config };
  const ctx = {
    now: () => new Date(clock),
    ip: overrides.ip ?? "203.0.113.9",
    config,
    sender: async (email: OutboundEmail) => {
      sent.push(email);
      return { ok: overrides.ok ?? true };
    },
    store: new RateStore(),
  };
  const advance = (ms: number) => {
    clock += ms;
  };
  // A stamp from a page opened two minutes before "now".
  const stamp = () => makeFormStamp(config.tokenKey!, clock - 120_000);
  return { ctx, sent, advance, stamp };
}

const codeFrom = (email: OutboundEmail) => /(\d{6})$/.exec(email.subject)?.[1] ?? "";

async function startOk(h: ReturnType<typeof makeCtx>, overrides: Record<string, unknown> = {}) {
  const res = await startVerification(
    JSON.stringify({ action: "start", ...validBody(overrides), stamp: h.stamp() }),
    h.ctx
  );
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.ok(res.body.ok && res.body.stage === "code_sent");
  const token = (res.body as { token: string }).token;
  return { token, code: codeFrom(h.sent.at(-1)!) };
}

const verify = (h: ReturnType<typeof makeCtx>, token: string, code: string, overrides: Record<string, unknown> = {}) =>
  confirmAndSend(JSON.stringify({ action: "verify", ...validBody(overrides), token, code }), h.ctx);

// ── Validation ───────────────────────────────────────────────────────────────

test("a complete inquiry validates and normalizes the profile link", () => {
  const result = validatePartnershipInquiry(validBody());
  assert.ok(result.ok, JSON.stringify(!result.ok && result.fieldErrors));
  assert.equal(result.data.profileUrl, "https://harborstone.example/team/ruth");
  assert.deepEqual(result.data.ways, ["Operating partnership", "Strategic advice"]);
});

test("each step reports only its own missing answers", () => {
  const empty = validBody({ name: "", email: "", role: "", firm: "", profileUrl: "", experience: "", ways: [], resonates: "" });
  assert.deepEqual(Object.keys(stepErrors(0, empty)).sort(), ["email", "firm", "name", "role"]);
  assert.deepEqual(Object.keys(stepErrors(1, empty)).sort(), ["experience", "profileUrl"]);
  assert.deepEqual(Object.keys(stepErrors(2, empty)).sort(), ["resonates", "ways"]);
  assert.deepEqual(stepErrors(0, validBody()), {});
});

test("emails and profile links must be real-looking", () => {
  const r = validatePartnershipInquiry(validBody({ email: "ruth@", profileUrl: "javascript:alert(1)" }));
  assert.ok(!r.ok);
  assert.match(r.fieldErrors.email!, /doesn't look complete/);
  assert.match(r.fieldErrors.profileUrl!, /doesn't look right/);
  assert.equal(normalizeProfileUrl("linkedin.com/in/ruth"), "https://linkedin.com/in/ruth");
  assert.equal(normalizeProfileUrl("https://user:pw@firm.example"), "");
  assert.equal(normalizeProfileUrl("localhost"), "");
});

test("ways are allowlisted, and Other needs a few words", () => {
  const bad = validatePartnershipInquiry(validBody({ ways: ["Capital", "Wire me money"] }));
  assert.ok(!bad.ok);
  assert.match(bad.fieldErrors.ways!, /options shown/);
  const other = validatePartnershipInquiry(validBody({ ways: ["Other"], otherWay: "" }));
  assert.ok(!other.ok);
  assert.ok(other.fieldErrors.otherWay);
  const ok = validatePartnershipInquiry(validBody({ ways: ["Capital"], otherWay: "ignored when Other is not chosen" }));
  assert.ok(ok.ok);
  assert.equal(ok.data.otherWay, "");
  assert.deepEqual(WAYS.map((w) => w.value), ["Capital", "Operating partnership", "Distribution", "Strategic advice", "Other"]);
});

test("account, card, and ID numbers are turned away — phone numbers and years are not", () => {
  const card = validatePartnershipInquiry(validBody({ experience: "My account is 4111 1111 1111 1111 if useful." }));
  assert.ok(!card.ok);
  assert.match(card.fieldErrors.experience!, /account, card, or ID numbers/);
  const ssn = validatePartnershipInquiry(validBody({ resonates: "SSN 123-45-6789 for your records." }));
  assert.ok(!ssn.ok);
  const fine = validatePartnershipInquiry(
    validBody({ experience: "Call 314-555-0142. Operator 2008–2015, investor since 2016 across 9 companies." })
  );
  assert.ok(fine.ok, JSON.stringify(!fine.ok && fine.fieldErrors));
});

test("markup and control characters are stripped, never rendered", () => {
  const r = validatePartnershipInquiry(validBody({ name: "Ruth <script>x</script>\u0007Calloway" }));
  assert.ok(r.ok);
  assert.doesNotMatch(r.data.name, /[<>\u0007]/);
});

// ── Config ───────────────────────────────────────────────────────────────────

test("one sender address is the only thing missing when the provider key exists", () => {
  const config = readPartnershipConfig({ RESEND_API_KEY: "k" });
  assert.deepEqual(missingPartnershipConfig(config), ["PARTNERSHIP_FROM_EMAIL"]);
  assert.equal(config.notifyEmail, STUDIO.email, "inquiries default to the existing contact inbox");
  assert.ok(config.tokenKey && config.tokenKey.length === 32, "the signing key is derived, no extra secret needed");
  assert.equal(partnershipConfigured({ RESEND_API_KEY: "k" }), false);
  assert.equal(partnershipConfigured({ RESEND_API_KEY: "k", PARTNERSHIP_FROM_EMAIL: "a@b.example" }), true);
  assert.equal(partnershipConfigured({ ...env, PARTNERSHIP_FORM_ENABLED: "0" }), false, "kill switch");
  assert.deepEqual(missingPartnershipConfig(readPartnershipConfig({})), ["RESEND_API_KEY", "PARTNERSHIP_FROM_EMAIL"]);
});

test("unconfigured: no stamp, no code, no email — and an honest 503", async () => {
  const config = readPartnershipConfig({ RESEND_API_KEY: "k" });
  assert.equal(issueFormStamp({ now: () => new Date(T0), config }), null);
  const h = makeCtx({ config });
  const res = await startVerification(JSON.stringify({ action: "start", ...validBody(), stamp: "x" }), h.ctx);
  assert.equal(res.status, 503);
  assert.ok(!res.body.ok && res.body.error.code === "unconfigured");
  assert.doesNotMatch(JSON.stringify(res.body), /PARTNERSHIP_FROM_EMAIL|RESEND/, "variable names stay in logs");
  assert.equal(h.sent.length, 0);
});

// ── Step one: the code ───────────────────────────────────────────────────────

test("start emails a code to the visitor only — never the owner yet", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);
  assert.equal(h.sent.length, 1);
  assert.equal(h.sent[0].to, "ruth@harborstone.example");
  assert.match(h.sent[0].text, new RegExp(`\\n${code}\\n`));
  assert.match(code, /^\d{6}$/);
  const payload = readVerificationToken(h.ctx.config.tokenKey!, token)!;
  assert.equal(payload.e, "ruth@harborstone.example");
  assert.ok(!token.includes(code) && !JSON.stringify(payload).includes(code), "the token never carries the code");
});

test("the response never reveals the owner's inbox", async () => {
  const h = makeCtx();
  const res = await startVerification(JSON.stringify({ action: "start", ...validBody(), stamp: h.stamp() }), h.ctx);
  assert.doesNotMatch(JSON.stringify(res.body), /owner-inbox/);
});

test("honeypot: looks like success, sends nothing", async () => {
  const h = makeCtx();
  const res = await startVerification(
    JSON.stringify({ action: "start", ...validBody({ website: "http://spam.example" }), stamp: h.stamp() }),
    h.ctx
  );
  assert.equal(res.status, 200);
  assert.equal(h.sent.length, 0);
});

test("a missing, forged, or instant stamp sends nothing", async () => {
  const h = makeCtx();
  const missing = await startVerification(JSON.stringify({ action: "start", ...validBody() }), h.ctx);
  assert.ok(!missing.body.ok && missing.body.error.code === "stale_page");
  const forged = await startVerification(
    JSON.stringify({ action: "start", ...validBody(), stamp: `${T0 - 120_000}.AAAA` }),
    h.ctx
  );
  assert.ok(!forged.body.ok && forged.body.error.code === "stale_page");
  const instant = await startVerification(
    JSON.stringify({ action: "start", ...validBody(), stamp: makeFormStamp(h.ctx.config.tokenKey!, T0 - 1000) }),
    h.ctx
  );
  assert.ok(!instant.body.ok && instant.body.error.code === "too_fast");
  assert.equal(h.sent.length, 0);
});

test("invalid answers get field errors and no email", async () => {
  const h = makeCtx();
  const res = await startVerification(
    JSON.stringify({ action: "start", ...validBody({ email: "nope" }), stamp: h.stamp() }),
    h.ctx
  );
  assert.equal(res.status, 422);
  assert.ok(!res.body.ok && res.body.error.fieldErrors?.email);
  assert.equal(h.sent.length, 0);
});

test("codes have a cooldown and an hourly cap per address", async () => {
  const h = makeCtx();
  await startOk(h);
  const again = await startVerification(JSON.stringify({ action: "start", ...validBody(), stamp: h.stamp() }), h.ctx);
  assert.ok(!again.body.ok && again.body.error.code === "cooldown");
  h.advance(31_000);
  await startOk(h);
  h.advance(31_000);
  await startOk(h);
  h.advance(31_000);
  const capped = await startVerification(JSON.stringify({ action: "start", ...validBody(), stamp: h.stamp() }), h.ctx);
  assert.ok(!capped.body.ok && capped.body.error.code === "rate_limited");
  assert.equal(h.sent.length, 3);
});

test("a code that can't be delivered is reported, not faked", async () => {
  const h = makeCtx({ ok: false });
  const res = await startVerification(JSON.stringify({ action: "start", ...validBody(), stamp: h.stamp() }), h.ctx);
  assert.equal(res.status, 502);
  assert.ok(!res.body.ok && res.body.error.code === "delivery_failed");
});

// ── Step two: verify, then send ──────────────────────────────────────────────

test("the right code sends the inquiry to the owner, reply-to the visitor", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);
  const res = await verify(h, token, code);
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.ok(res.body.ok && res.body.stage === "sent");
  assert.match((res.body as { reference: string }).reference, REFERENCE_RE);
  const owner = h.sent.at(-1)!;
  assert.equal(owner.to, "owner-inbox@example.com");
  assert.equal(owner.replyTo, "ruth@harborstone.example");
  assert.match(owner.subject, /^\[Partnership\] OM-PTR-\w{6} — Ruth Calloway, Harborstone Partners$/);
  assert.match(owner.text, /Email verified: yes/);
  assert.match(owner.text, /Interested in: Operating partnership, Strategic advice/);
  assert.match(owner.text, /https:\/\/harborstone\.example\/team\/ruth/);
});

test("a wrong code sends nothing and counts down", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);
  const wrong = code === "000000" ? "111111" : "000000";
  const res = await verify(h, token, wrong);
  assert.equal(res.status, 422);
  assert.ok(!res.body.ok && res.body.error.code === "wrong_code");
  assert.equal(res.body.error.attemptsLeft, MAX_ATTEMPTS_PER_CODE - 1);
  assert.equal(h.sent.length, 1, "only the code email exists");
});

test("after too many wrong tries even the right code is refused", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);
  const wrong = code === "000000" ? "111111" : "000000";
  for (let i = 0; i < MAX_ATTEMPTS_PER_CODE; i++) await verify(h, token, wrong);
  const res = await verify(h, token, code);
  assert.ok(!res.body.ok && res.body.error.code === "too_many_attempts");
  assert.equal(h.sent.length, 1);
});

test("expired, tampered, or re-addressed tokens send nothing", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);

  const changed = await verify(h, token, code, { email: "someone-else@example.com" });
  assert.ok(!changed.body.ok && changed.body.error.code === "email_changed");

  const [body, sig] = token.split(".");
  const tampered = Buffer.from(body, "base64url").toString().replace("ruth@harborstone.example", "x@evil.example");
  const forged = await verify(h, `${Buffer.from(tampered).toString("base64url")}.${sig}`, code, { email: "x@evil.example" });
  assert.ok(!forged.body.ok && forged.body.error.code === "code_expired");

  h.advance(16 * 60 * 1000);
  const expired = await verify(h, token, code);
  assert.ok(!expired.body.ok && expired.body.error.code === "code_expired");
  assert.equal(h.sent.length, 1);
});

test("a code works once", async () => {
  const h = makeCtx();
  const { token, code } = await startOk(h);
  assert.ok((await verify(h, token, code)).body.ok);
  const again = await verify(h, token, code);
  assert.ok(!again.body.ok && again.body.error.code === "already_sent");
  assert.equal(h.sent.length, 2, "one code email, one inquiry");
});

test("a failed delivery to the owner is honest and keeps the code usable", async () => {
  let fail = true;
  const h = makeCtx();
  const { token, code } = await startOk(h);
  h.ctx.sender = async (email: OutboundEmail) => {
    h.sent.push(email);
    return { ok: !fail };
  };
  const res = await verify(h, token, code);
  assert.equal(res.status, 502);
  assert.ok(!res.body.ok && res.body.error.code === "delivery_failed");
  fail = false;
  const retry = await verify(h, token, code);
  assert.ok(retry.body.ok, "the same code works once delivery recovers");
});

test("the plain-text summary carries every answer", () => {
  const r = validatePartnershipInquiry(validBody({ ways: ["Capital", "Other"], otherWay: "Board seat" }));
  assert.ok(r.ok);
  const text = buildInquirySummaryText(r.data);
  for (const s of ["Ruth Calloway", "ruth@harborstone.example", "Operating Partner", "Harborstone Partners", "Capital, Other: Board seat"])
    assert.ok(text.includes(s), s);
});

// ── Page honesty locks ───────────────────────────────────────────────────────

const page = read("src/app/partnership/page.tsx");
const form = read("src/app/partnership/PartnershipForm.tsx");
const route = read("src/app/api/partnership/route.ts");
const publicCopy = stripComments(page) + stripComments(form);

test("the page invites a conversation, never an offering", () => {
  assert.match(page, /not an offer to sell, or a request for an\s+offer to buy, any security/);
  assert.match(page, /nothing on it promises or implies a return/);
  assert.doesNotMatch(publicCopy, /invest now|guarantee|returns? of|\bROI\b|\d+%|minimum investment|accredited|limited time|act now|don't miss/i);
});

test("the form never asks for money details", () => {
  assert.doesNotMatch(form, /name: "(amount|checkSize|netWorth|fund(Size)?|proofOfFunds|accredited)"/i);
  assert.doesNotMatch(publicCopy, /how much (would|could) you invest|check size|net worth|proof of funds will/i);
  assert.match(page, /no proof of funds/i);
});

test("no private address in page source, and verification is never faked", () => {
  assert.doesNotMatch(publicCopy, /[\w.+-]+@[\w-]+\.[\w.]+/, "no hard-coded address in the page or form");
  assert.doesNotMatch(publicCopy, /NOTIFY_EMAIL|notifyEmail/);
  assert.match(form, /action: "verify"/, "sending goes through the code check");
  assert.doesNotMatch(form, /skipVerif|bypass|demoCode|testCode/i);
  assert.doesNotMatch(route, /console\.(log|error)\([^)]*(code|body|raw|email\.to)/, "never logs codes or contents");
});

test("the page is quiet: faceless, out of search, one entry from About", () => {
  assert.match(page, /robots: \{ index: false, follow: true \}/);
  assert.doesNotMatch(publicCopy, /\bfounder\b|\bCEO\b|visionary/i);
  assert.doesNotMatch(publicCopy, /\bAI\b|artificial intelligence/);
  assert.doesNotMatch(publicCopy, /reimagine|empower|\bmeaningful\b|innovation|\bjourney\b|ecosystem|disruptive/i);
  const about = read("src/app/about-open-mirror/page.tsx");
  assert.match(about, /href="\/partnership"/);
  assert.match(about, /Explore a partnership/);
  for (const rel of ["src/app/page.tsx", "src/components/OpenMirrorNav.tsx", "src/app/contact/page.tsx"])
    assert.doesNotMatch(read(rel), /\/partnership/, `${rel} stays free of the partnership link`);
});

test("the form keeps its accessibility and back/edit controls", () => {
  assert.match(form, /aria-current=\{i === step \? "step" : undefined\}/, "progress marks the current step");
  assert.equal(form.match(/aria-live="polite"/g)?.length, 1,
    "one live region, outside the views — React once reused it and leaked announcements into visible text");
  assert.match(form, /htmlFor=\{`f-\$\{key\}`\}/, "every text field has a label");
  assert.match(form, /autoComplete="one-time-code"/);
  assert.match(form, />\s*Back\s*</);
  assert.match(form, /Edit: \$\{s\.title\}/);
});

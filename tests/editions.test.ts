import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { checkEdition, looksAutomated, EDITION_PROPERTIES, ownerMailText } from "../src/lib/editions.ts";

const good = { property: "opendoku", name: "Pat", email: "pat@example.com", business: "", message: "A puzzle page for our school fair." };

test("a complete request passes and is cleaned", () => {
  const r = checkEdition({ ...good, email: " PAT@Example.com " });
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.value.email, "pat@example.com");
});

test("missing or bad fields are named", () => {
  const r = checkEdition({ property: "nope", name: "", email: "x", message: "hi" });
  assert.ok(!r.ok);
  if (!r.ok) assert.deepEqual(Object.keys(r.fields).sort(), ["email", "message", "name", "property"]);
});

test("long digit runs (card / account / ID shaped) are turned away", () => {
  const r = checkEdition({ ...good, message: "Card 4111 1111 1111 1111 please charge it" });
  assert.ok(!r.ok);
});

test("honeypot and too-fast submissions look automated", () => {
  const now = 1_000_000_000;
  assert.equal(looksAutomated({ website: "x", stamp: now - 60_000 }, now), true);
  assert.equal(looksAutomated({ stamp: now - 1000 }, now), true);
  assert.equal(looksAutomated({ stamp: undefined }, now), true);
  assert.equal(looksAutomated({ stamp: now - 60_000 }, now), false);
});

test("protected and discontinued properties are never offered", () => {
  const text = JSON.stringify(EDITION_PROPERTIES).toLowerCase();
  for (const banned of ["crossheartpray", "djcares", "fambookagram", "friendbookagram"]) assert.ok(!text.includes(banned), banned);
  const page = readFileSync(join(import.meta.dirname, "../src/app/editions/page.tsx"), "utf8").toLowerCase();
  for (const banned of ["crossheartpray", "djcares", "checkout url", "buy now"]) assert.ok(!page.includes(banned), banned);
});

test("no property claims verified licensing rights yet", () => {
  assert.ok(EDITION_PROPERTIES.every((p) => p.rightsVerified === false));
});

test("owner email says nothing was approved", () => {
  const r = checkEdition(good);
  assert.ok(r.ok);
  if (r.ok) assert.match(ownerMailText(r.value, "ED-123456").text, /Nothing has been approved/);
});

test("API only answers ok after delivery is accepted", () => {
  const route = readFileSync(join(import.meta.dirname, "../src/app/api/editions/route.ts"), "utf8");
  assert.match(route, /if \(!result\.accepted\)/);
  assert.ok(!/console\.(log|error)\(.*body/.test(route), "never log what people typed");
});

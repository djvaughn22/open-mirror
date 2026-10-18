import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { COPIED_MESSAGE, copySiteLink } from "../src/lib/copyLink.ts";

const repoRoot = join(import.meta.dirname, "..");
const URL_ = "https://opendoku.com/";

// The homepage share icon must tell the truth: "Link copied" only after the
// clipboard write succeeds, and the address itself whenever it doesn't.

test("a successful clipboard write reports Link copied, with the exact address", async () => {
  const written: string[] = [];
  const result = await copySiteLink(URL_, { writeText: async (t) => { written.push(t); } });
  assert.deepEqual(written, [URL_]);
  assert.deepEqual(result, { copied: true, message: COPIED_MESSAGE });
});

test("Link copied is not reported until the write has actually resolved", async () => {
  let resolveWrite!: () => void;
  let settled = false;
  const pending = copySiteLink(URL_, { writeText: () => new Promise<void>((r) => { resolveWrite = r; }) })
    .then((r) => { settled = true; return r; });
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(settled, false, "no result while the write is still pending");
  resolveWrite();
  assert.deepEqual(await pending, { copied: true, message: COPIED_MESSAGE });
});

test("a rejected clipboard write shows the address instead", async () => {
  const result = await copySiteLink(URL_, { writeText: () => Promise.reject(new DOMException("Write permission denied.", "NotAllowedError")) });
  assert.deepEqual(result, { copied: false, message: URL_ });
});

test("a clipboard that throws synchronously shows the address instead", async () => {
  const result = await copySiteLink(URL_, { writeText: () => { throw new TypeError("boom"); } });
  assert.deepEqual(result, { copied: false, message: URL_ });
});

test("no clipboard at all (insecure page, old browser) shows the address instead", async () => {
  assert.deepEqual(await copySiteLink(URL_, undefined), { copied: false, message: URL_ });
  assert.deepEqual(await copySiteLink(URL_, null), { copied: false, message: URL_ });
  assert.deepEqual(await copySiteLink(URL_, {} as never), { copied: false, message: URL_ });
});

test("the card uses this helper, shows its message, and only fades a real copy", () => {
  const card = readFileSync(join(repoRoot, "src/components/ProductCard.tsx"), "utf8");
  assert.match(card, /copySiteLink\(url, typeof navigator === "undefined" \? undefined : navigator\.clipboard\)/);
  assert.match(card, /setCopyStatus\(result\.message\)/);
  assert.match(card, /if \(result\.copied\) clearTimer\.current = window\.setTimeout/, "the fallback address never fades away");
  assert.match(card, /window\.clearTimeout\(clearTimer\.current\);\s*const url/, "each click cancels the previous fade");
});

import fs from "node:fs";

const data = JSON.parse(
  fs.readFileSync("src/data/original-word-study/john.json", "utf8"),
);

function normalizeReference(reference) {
  const clean = reference.trim().replace(/\s+/g, " ");
  const match = clean.match(/^(john|jhn|jn)\s+(\d+)\s*[:.]\s*(\d+)$/i);
  if (!match) return clean;
  return `John ${Number(match[2])}:${Number(match[3])}`;
}

function normalizeEnglish(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[“”"'.?!,;:()[\]{}]/g, "")
    .replace(/\s+/g, " ");
}

function lookup(referenceInput, englishInput) {
  const reference = normalizeReference(referenceInput);
  const query = englishInput.trim();
  const normalizedQuery = normalizeEnglish(query);

  const matches = data.filter(
    (record) =>
      record.reference === reference &&
      normalizeEnglish(record.english) === normalizedQuery,
  );

  return { reference, query, matches };
}

const good = lookup("John 1:14", "Word");
const empty = lookup("John 1:14", "banana");

console.log("=== EXACT MATCH TEST ===");
console.log(good);

if (good.matches.length !== 1) {
  throw new Error("Expected exactly one match for John 1:14 + Word.");
}

const match = good.matches[0];

if (
  match.original !== "λόγος" ||
  match.lemma !== "λόγος" ||
  match.strong !== "G3056" ||
  match.morph !== "Gr,N,,,,,NMS,"
) {
  throw new Error("John 1:14 + Word did not return expected original-language data.");
}

console.log();
console.log("=== NOT LOADED TEST ===");
console.log(empty);

if (empty.matches.length !== 0) {
  throw new Error("Expected zero matches for John 1:14 + banana.");
}

console.log();
console.log("Proof passed.");

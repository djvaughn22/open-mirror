import fs from "node:fs";

const inputPath = "research/original-word-study/source-proof/en_ult_44-JHN_v87.usfm";
const outputPath = "src/data/original-word-study/john.json";

const text = fs.readFileSync(inputPath, "utf8");

function getAttr(attrs, name) {
  const match = attrs.match(new RegExp(`${name}="([^"]+)"`));
  return match ? match[1] : "";
}

function cleanStrong(strong) {
  return strong.replace(/0$/, "");
}

const results = [];
let currentChapter = "";
let currentVerse = "";

for (const rawLine of text.split("\n")) {
  const chapterMatch = rawLine.match(/\\c\s+(\d+)/);
  if (chapterMatch) currentChapter = chapterMatch[1];

  const verseMatch = rawLine.match(/\\v\s+(\d+)/);
  if (verseMatch) currentVerse = verseMatch[1];

  if (!currentChapter || !currentVerse) continue;

  const pattern =
    /\\zaln-s \|(?<attrs>[^\\]+)\\\*(?<words>.*?)\\zaln-e\\\*/gs;

  for (const match of rawLine.matchAll(pattern)) {
    const attrs = match.groups.attrs;
    const words = match.groups.words;

    const englishWords = [...words.matchAll(/\\w\s+([^|\\]+)\|/g)].map(
      (wordMatch) => wordMatch[1],
    );

    if (englishWords.length === 0) continue;

    results.push({
      reference: `John ${currentChapter}:${currentVerse}`,
      book: "John",
      chapter: Number(currentChapter),
      verse: Number(currentVerse),
      english: englishWords.join(" "),
      original: getAttr(attrs, "x-content"),
      lemma: getAttr(attrs, "x-lemma"),
      strong: cleanStrong(getAttr(attrs, "x-strong")),
      strongRaw: getAttr(attrs, "x-strong"),
      morph: getAttr(attrs, "x-morph"),
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2) + "\n");

console.log(`Wrote ${results.length} aligned word records to ${outputPath}`);

const proof = results.find(
  (item) => item.reference === "John 1:14" && item.english === "Word",
);

if (!proof) {
  throw new Error("Proof failed: John 1:14 + Word was not found.");
}

console.log("Proof:");
console.log(proof);

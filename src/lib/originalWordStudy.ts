import johnRecords from "../data/original-word-study/john.json";

export type OriginalWordStudyRecord = {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  english: string;
  original: string;
  lemma: string;
  strong: string;
  strongRaw: string;
  morph: string;
};

export type OriginalWordStudyResult =
  | {
      status: "found";
      reference: string;
      query: string;
      matches: OriginalWordStudyRecord[];
    }
  | {
      status: "not_loaded";
      reference: string;
      query: string;
      message: string;
    };

const records = johnRecords as OriginalWordStudyRecord[];

function normalizeReference(reference: string) {
  const clean = reference.trim().replace(/\s+/g, " ");
  const match = clean.match(/^(john|jhn|jn)\s+(\d+)\s*[:.]\s*(\d+)$/i);

  if (!match) return clean;

  return `John ${Number(match[2])}:${Number(match[3])}`;
}

function normalizeEnglish(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[“”"'.?!,;:()[\]{}]/g, "")
    .replace(/\s+/g, " ");
}

export function lookupOriginalWord(
  referenceInput: string,
  englishInput: string,
): OriginalWordStudyResult {
  const reference = normalizeReference(referenceInput);
  const query = englishInput.trim();
  const normalizedQuery = normalizeEnglish(query);

  if (!reference || !normalizedQuery) {
    return {
      status: "not_loaded",
      reference,
      query,
      message: "Enter a verse reference and an English word from that verse.",
    };
  }

  const matches = records.filter(
    (record) =>
      record.reference === reference &&
      normalizeEnglish(record.english) === normalizedQuery,
  );

  if (matches.length === 0) {
    return {
      status: "not_loaded",
      reference,
      query,
      message: "No exact original-language match loaded for this word.",
    };
  }

  return {
    status: "found",
    reference,
    query,
    matches,
  };
}

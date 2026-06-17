import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { VerifiedWordStudy } from "../../../lib/originalLanguageWordStudy";

export const runtime = "nodejs";

type DeepDiveBookData = Record<string, VerifiedWordStudy[]>;

const bookCache = new Map<string, DeepDiveBookData>();

function cleanBookCode(value: string | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");
}

function cleanNumber(value: string | null) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return "";
  }

  return String(number);
}

async function loadBookData(code: string) {
  const cached = bookCache.get(code);

  if (cached) {
    return cached;
  }

  const filePath = path.join(process.cwd(), "data", "deep-dive", `${code}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as DeepDiveBookData;
    bookCache.set(code, parsed);
    return parsed;
  } catch {
    bookCache.set(code, {});
    return {};
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = cleanBookCode(url.searchParams.get("code"));
  const chapter = cleanNumber(url.searchParams.get("chapter"));
  const verse = cleanNumber(url.searchParams.get("verse"));

  if (!code || !chapter || !verse) {
    return NextResponse.json(
      { error: "Missing valid code, chapter, or verse.", wordStudies: [] },
      { status: 400 },
    );
  }

  const bookData = await loadBookData(code);
  const wordStudies = bookData[`${chapter}:${verse}`] ?? [];

  return NextResponse.json({
    code,
    chapter,
    verse,
    wordStudies,
  });
}

"use client";

import { useState } from "react";

type TranslateResponse = {
  status?: string;
  input?: string;
  greek?: string;
  message?: string;
};

export default function GreekTranslator() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TranslateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function translate() {
    const cleanText = text.trim();

    if (!cleanText) {
      setResult({ status: "error", message: "Enter a word to translate." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/translate-greek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanText }),
      });

      const data = (await response.json()) as TranslateResponse;
      setResult(data);
    } catch {
      setResult({
        status: "error",
        message: "Translation failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
          Greek Translator
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Simple English to Greek
        </h2>
        <p className="text-sm leading-6 text-zinc-300">
          Type a simple English word and see the Greek translation.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              translate();
            }
          }}
          placeholder="love"
          maxLength={80}
          className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none placeholder:text-zinc-500 focus:border-sky-400"
        />

        <button
          type="button"
          onClick={translate}
          disabled={loading}
          className="min-h-12 rounded-2xl bg-sky-400 px-5 font-semibold text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>

      {result ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-5 text-center">
          {result.status === "translated" ? (
            <>
              <p className="text-sm text-zinc-400">{result.input}</p>
              <p className="mt-2 text-4xl font-bold text-white">
                {result.greek}
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-300">
              {result.message ?? "Translation failed."}
            </p>
          )}
        </div>
      ) : null}

      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
        Simple Google translation. Not a Bible or Koine Greek word study.
      </p>
    </section>
  );
}

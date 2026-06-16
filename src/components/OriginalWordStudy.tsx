"use client";

import { useState } from "react";

type Match = {
  reference: string;
  english: string;
  original: string;
  lemma: string;
  strong: string;
  strongRaw: string;
  morph: string;
};

type ApiResult =
  | {
      status: "found";
      reference: string;
      query: string;
      matches: Match[];
    }
  | {
      status: "not_loaded";
      reference: string;
      query: string;
      message: string;
    }
  | {
      status: "error";
      message: string;
    };

export default function OriginalWordStudy() {
  const [reference, setReference] = useState("John 1:14");
  const [word, setWord] = useState("Word");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookUpWord() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/original-word-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference, word }),
      });

      const data = (await response.json()) as ApiResult;
      setResult(data);
    } catch {
      setResult({
        status: "error",
        message: "Original word study lookup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-3xl px-6 pb-12 text-center sm:pb-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-slate-100 shadow-2xl shadow-black/20 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Original Word Study
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Find the exact original word
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Enter a verse reference and an English word from that verse. If exact
          aligned data is loaded, this shows the original Greek or Hebrew word.
          If not, it says not loaded.
        </p>

        <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-slate-500">
          Loaded right now: John.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Verse reference
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="John 1:14"
              className="mt-2 w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-center text-base normal-case tracking-normal text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/30"
            />
          </label>

          <label className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            English word
            <input
              value={word}
              onChange={(event) => setWord(event.target.value)}
              placeholder="Word"
              className="mt-2 w-full rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-center text-base normal-case tracking-normal text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/30"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={lookUpWord}
          disabled={loading}
          className="mt-5 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:text-slate-500"
        >
          {loading ? "Looking up..." : "Find Original Word"}
        </button>

        {result?.status === "found" && (
          <div className="mt-6 space-y-4 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5 text-left">
            <p className="text-sm font-bold text-emerald-100">
              Exact alignment found.
            </p>

            {result.matches.map((match, index) => (
              <div
                key={`${match.reference}-${match.english}-${match.original}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {match.reference} · {match.english}
                </p>

                <p className="mt-3 text-3xl font-bold text-white">
                  {match.original}
                </p>

                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Lemma</dt>
                    <dd className="font-semibold text-slate-100">
                      {match.lemma}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Strong&apos;s</dt>
                    <dd className="font-semibold text-slate-100">
                      {match.strong}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Morphology</dt>
                    <dd className="font-semibold text-slate-100">
                      {match.morph}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        )}

        {result?.status === "not_loaded" && (
          <div className="mt-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/[0.06] p-5 text-sm font-semibold leading-6 text-amber-100">
            {result.message}
          </div>
        )}

        {result?.status === "error" && (
          <div className="mt-6 rounded-[1.5rem] border border-red-300/20 bg-red-300/[0.06] p-5 text-sm font-semibold leading-6 text-red-100">
            {result.message}
          </div>
        )}
      </div>
    </section>
  );
}

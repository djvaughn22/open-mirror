"use client";

import { type ReactNode } from "react";

type PageNucleusHeroProps = {
  title: string;
  subhead: string;
  body?: string;
  children?: ReactNode;
};

export default function PageNucleusHero({
  title,
  subhead,
  body,
  children,
}: PageNucleusHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-slate-950/45 px-3 py-2.5 shadow-lg shadow-black/15 print:border-black print:bg-white sm:rounded-[1.35rem] sm:px-4 sm:py-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_14rem),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.10),transparent_14rem)]" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white sm:text-[0.66rem]"
            aria-hidden="true"
          >
            <span className="inline-flex items-center gap-1">
              <span className="text-lg tracking-normal sm:text-xl">✝️</span>
              <span>Cross</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-lg tracking-normal sm:text-xl">❤️</span>
              <span>Heart</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-lg tracking-normal sm:text-xl">🙏</span>
              <span>Pray</span>
            </span>
          </div>

          <h1 className="mt-1 max-w-3xl text-2xl font-black leading-none tracking-tight text-white print:text-black sm:text-3xl">
            {title}
          </h1>

          <p className="mt-1 max-w-3xl text-xs font-black leading-snug text-emerald-100 print:text-black sm:text-sm">
            {subhead}
          </p>

          {body ? (
            <p className="mt-1 max-w-3xl text-[0.72rem] font-semibold leading-4 text-slate-300 print:text-black sm:text-xs">
              {body}
            </p>
          ) : null}
        </div>

        {children ? (
          <div className="shrink-0 print:hidden sm:ml-4 sm:flex sm:min-w-[20rem] sm:justify-end">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

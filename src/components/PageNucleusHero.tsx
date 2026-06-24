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
    <section className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-3 shadow-xl shadow-black/20 print:border-black print:bg-white sm:rounded-[1.6rem] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_18rem),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.12),transparent_18rem)]" />

      <div className="relative">
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-white sm:text-xs"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="text-xl tracking-normal sm:text-2xl">✝️</span>
            <span>Cross</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-xl tracking-normal sm:text-2xl">❤️</span>
            <span>Heart</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-xl tracking-normal sm:text-2xl">🙏</span>
            <span>Pray</span>
          </span>
        </div>

        <h1 className="mt-2 max-w-3xl text-3xl font-black leading-none tracking-tight text-white print:text-black sm:text-4xl">
          {title}
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm font-black leading-snug text-emerald-100 print:text-black sm:text-base">
          {subhead}
        </p>

        {body ? (
          <p className="mt-1.5 max-w-2xl text-xs font-semibold leading-5 text-slate-300 print:text-black sm:text-sm">
            {body}
          </p>
        ) : null}

        {children ? <div className="mt-2 print:hidden">{children}</div> : null}
      </div>
    </section>
  );
}

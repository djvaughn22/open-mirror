// The public fallback. Anyone can send a score; nothing here publishes itself.

import type { Metadata } from "next";
import Link from "next/link";

import ReportFinal from "@/components/sports/ReportFinal";
import ReportUnavailable from "@/components/sports/ReportUnavailable";
import { opponentOptions, schoolOptions, sportOptionsFor } from "@/lib/sports/submit/reportOptions";
import { sportsRepository } from "@/lib/sports/repo";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Report a score",
  description: "Send a St. Louis high school result to the Open Mirror sports wire.",
  alternates: { canonical: "/sports/report" },
};

export default async function PublicReportPage() {
  const repo = sportsRepository();
  const writable = await repo.writable();
  const events = await repo.listEvents();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ST_LOUIS.timezone, dateStyle: "short" }).format(new Date());

  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[30rem] px-5 pb-24 pt-10">
        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] hover:underline">
          ← St. Louis sports
        </Link>
        <h1 className="m-0 mt-6 text-[2rem] font-black leading-[1.05] tracking-tight">Report a score</h1>
        <p className="m-0 mb-8 mt-3 text-[0.95rem] font-semibold leading-6 text-[#94a3b8]">
          Know a final we are missing? Send it. A person checks community reports before they publish — if you run a
          team and want your results to go straight up,{" "}
          <Link href="/sports/for-schools" className="text-[#7dd3fc] underline underline-offset-2">
            get your team a link
          </Link>
          .
        </p>

        {writable ? (
        <ReportFinal
            schoolChoices={schoolOptions()}
            sports={sportOptionsFor("", events)}
            opponents={opponentOptions()}
            today={today}
            publicMode
          />
        ) : (
          <ReportUnavailable />
        )}
      </div>
    </main>
  );
}

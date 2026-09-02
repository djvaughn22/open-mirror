// The school's own reporting link. One tap from a text message to a filed final.

import type { Metadata } from "next";
import Link from "next/link";

import ReportFinal from "@/components/sports/ReportFinal";
import ReportUnavailable from "@/components/sports/ReportUnavailable";
import { opponentOptions, sportOptionsFor } from "@/lib/sports/submit/reportOptions";
import { sportsRepository } from "@/lib/sports/repo";
import { verifyToken } from "@/lib/sports/submit/credentials";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";

export const dynamic = "force-dynamic";

// A reporting link must never be indexed, previewed, or referred onward.
export const metadata: Metadata = {
  title: "Report a final",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const repo = sportsRepository();
  const check = await verifyToken(repo, token);

  if (!check.ok) {
    return (
      <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
        <div className="mx-auto w-full max-w-[30rem] px-5 pb-24 pt-16">
          <h1 className="m-0 text-[1.6rem] font-black leading-tight">This reporting link is not active.</h1>
          <p className="m-0 mt-3 text-[0.95rem] font-semibold leading-6 text-[#94a3b8]">
            It may have been replaced. Ask whoever set it up for a current one — or report the score on the public form
            and our desk will pick it up.
          </p>
          <Link href="/sports/report" className="mt-6 inline-block text-[0.95rem] font-black text-[#7dd3fc] hover:underline">
            Use the public form →
          </Link>
        </div>
      </main>
    );
  }

  const school = ST_LOUIS.schools.find((s) => s.id === check.credential.schoolId);
  if (!school) {
    return (
      <main className="min-h-screen bg-[#0b0e14] px-5 py-16 text-[#e8edf5]">
        <p className="mx-auto max-w-[30rem] text-[1rem] font-semibold">
          This link points at a school we no longer track. Please tell us and we will reissue it.
        </p>
      </main>
    );
  }

  const writable = await repo.writable();
  const events = await repo.listEvents();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ST_LOUIS.timezone, dateStyle: "short" }).format(new Date());

  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[30rem] px-5 pb-24 pt-10">
        <p className="m-0 text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">Open Mirror · St. Louis</p>
        <h1 className="m-0 mt-2 text-[2rem] font-black leading-[1.05] tracking-tight">Report a final</h1>
        <p className="m-0 mb-8 mt-3 text-[0.95rem] font-semibold leading-6 text-[#94a3b8]">
          Send the score. We write the story, build the graphic, update {school.shortName}&rsquo;s page and put it on
          the St. Louis feed.
        </p>

        {writable ? (
        <ReportFinal
            token={token}
            school={{ id: school.id, label: school.name }}
            sports={sportOptionsFor(school.id, events)}
            opponents={opponentOptions(school.id)}
            today={today}
            publicMode={false}
          />
        ) : (
          <ReportUnavailable />
        )}
      </div>
    </main>
  );
}

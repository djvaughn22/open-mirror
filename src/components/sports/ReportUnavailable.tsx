// Shown when this deployment cannot store a report.
//
// The alternative — letting someone type a score and fail on submit — wastes a
// coach's only 15 seconds and teaches them the tool is broken. If we cannot
// keep it, we say so before they start.

import Link from "next/link";

import { SERVICE_EMAIL } from "@/lib/services";

export default function ReportUnavailable() {
  return (
    <div className="rounded-2xl border border-[#33291a] bg-[#161208] p-5">
      <p className="m-0 text-[11px] font-black uppercase tracking-[0.16em] text-[#fcd34d]">Reporting is not live yet</p>
      <p className="m-0 mt-2.5 text-[0.95rem] font-semibold leading-6 text-[#e8edf5]">
        This site cannot store reports right now, so we are not going to let you type one and lose it.
      </p>
      <p className="m-0 mt-3 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
        Send the score to{" "}
        <a href={`mailto:${SERVICE_EMAIL}`} className="text-[#7dd3fc] underline underline-offset-2">
          {SERVICE_EMAIL}
        </a>{" "}
        and it will go up the same way.
      </p>
      <Link href="/sports" className="mt-4 inline-block text-[0.9rem] font-black text-[#7dd3fc] hover:underline">
        ← Back to St. Louis sports
      </Link>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { NEEDS_ORDER, NEED_LABEL, OCCUPATIONS, onetUrl } from "../../../lib/learning/careers";
import { SUBJECTS } from "../../../lib/learning/taxonomy";
import { STUDIO } from "../../../lib/products";

// Work that lasts (owner direction, Nov 26-27 2026): kinds of work that meet
// lasting human needs, linked to the official profiles. No scores, no
// predictions, no copied pay numbers. Method below and in the private
// blueprint.

export const metadata: Metadata = {
  title: "Work that lasts",
  description: "Kinds of work that meet lasting needs like food, water, shelter, health and repair, with official pay, outlook and training information.",
  alternates: { canonical: "/learn/work" },
};

const subjectsFor = (id: string) => SUBJECTS.filter((s) => s.careers?.includes(id));

export default function WorkPage() {
  return (
    <main className="ol-page">
      <nav className="ol-crumbs" aria-label="Breadcrumb"><Link href="/learn">Learning</Link> › Work that lasts</nav>
      <h1 className="ol-title">Work that lasts</h1>
      <p className="ol-lede">
        Some needs don&apos;t go away: food, clean water, a safe home, health, things that need fixing. These are kinds of work that meet them.
        Each links to the official description of the work, its pay and outlook, and how people train for it.
      </p>
      <p className="ol-p">
        No job is guaranteed to last, and AI will change parts of most jobs. Work done in person, with your hands, for people who trust you,
        tends to change differently than work done only on a screen. That&apos;s a description, not a promise. <a href="#method">How we describe it</a>.
      </p>
      <p className="ol-p">
        Not sure what fits you? The <a href="https://www.mynextmove.org/explore/ip" target="_blank" rel="noopener noreferrer">O*NET Interest Profiler</a> asks
        what you like to do and suggests real occupations. To earn while you learn, search the{" "}
        <a href="https://www.apprenticeship.gov/apprenticeship-job-finder" target="_blank" rel="noopener noreferrer">Apprenticeship Finder</a>.
      </p>

      {NEEDS_ORDER.map((need) => {
        const jobs = OCCUPATIONS.filter((o) => o.needs[0] === need);
        if (!jobs.length) return null;
        return (
          <section key={need} className="ol-section" aria-labelledby={`need-${need}`}>
            <h2 id={`need-${need}`} className="ol-h2">{NEED_LABEL[need]}</h2>
            <ul className="ol-res-list">
              {jobs.map((o) => {
                const subs = subjectsFor(o.id);
                return (
                  <li key={o.id} id={o.id} className="ol-res">
                    <a href={o.bls ?? onetUrl(o)} target="_blank" rel="noopener noreferrer">{o.title}</a>
                    <span className="ol-meta">
                      {o.bls ? "Pay, outlook, training: BLS · " : ""}
                      <a href={onetUrl(o)} target="_blank" rel="noopener noreferrer">Tasks and skills: O*NET</a>
                      {o.handsOn ? " · Hands-on" : ""}
                      {o.apprenticeship ? " · Apprenticeships common" : ""}
                    </span>
                    {o.needs.length > 1 && <span className="ol-note">Also: {o.needs.slice(1).map((n) => NEED_LABEL[n].toLowerCase()).join(", ")}.</span>}
                    {subs.length > 0 && (
                      <span className="ol-note">
                        Learn it: {subs.map((s, i) => <span key={s.slug}>{i > 0 ? ", " : ""}<Link href={`/learn/${s.slug}`}>{s.name}</Link></span>)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section id="method" className="ol-section ol-about" aria-labelledby="method-h">
        <h2 id="method-h" className="ol-h2">How we describe it</h2>
        <ul>
          <li>Each kind of work is grouped by the lasting need it mainly serves. The need is a plain description of what the work is for.</li>
          <li><strong>Hands-on</strong> means most of the work happens in person: repairing, building, caring, teaching. That kind of work depends on physical presence and trust, so AI tends to assist it more than replace it. It still changes.</li>
          <li>We copy no pay, growth or job numbers. They change every year, and the U.S. Bureau of Labor Statistics (BLS) and O*NET publish them with their dates, places and methods. Follow the links for current figures.</li>
          <li>Licensing and training rules vary by state and change over time. The official pages and your state&apos;s licensing board are the source.</li>
          <li>We don&apos;t score or rank jobs for &quot;AI-proofness.&quot; No one can honestly promise that.</li>
          <li>Questions or a correction: <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent("Work that lasts")}`}>{STUDIO.email}</a></li>
        </ul>
      </section>
    </main>
  );
}

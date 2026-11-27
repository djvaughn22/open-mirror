import Link from "next/link";
import type { Metadata } from "next";
import LearnSearch from "../../components/learning/LearnSearch";
import { DISCIPLINES } from "../../lib/learning/taxonomy";
import { COST_LABEL, PATHWAYS } from "../../lib/learning/resources";
import { resourcesForPath, subjectCount } from "../../lib/learning/directory";
import { STUDIO } from "../../lib/products";

// Open Mirror Learning (owner direction, Nov 26-27 2026; working title "Open
// Mirror University", public name "Open Mirror Learning" until the naming
// question is reviewed). Think Craigslist for education: search first, then
// every subject as plain text links. We link to free resources made by
// others; we don't teach courses, give credit or issue certificates.

export const metadata: Metadata = {
  title: "Open Mirror Learning",
  description: "Free courses, books and videos on almost any subject, from trusted sources. Say what you want to learn in your own words.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return (
    <main className="ol-page">
      <header className="ol-head">
        <h1 className="ol-title">Open Mirror Learning</h1>
        <LearnSearch />
      </header>

      <section aria-labelledby="ol-all" className="ol-section">
        <h2 id="ol-all" className="ol-h2">Every subject <span className="ol-count">({subjectCount()})</span></h2>
        <div className="ol-dir">
          {DISCIPLINES.map((d) => (
            <div key={d.slug} className="ol-dir-group" id={`d-${d.slug}`}>
              <h3>{d.name}</h3>
              <ul>
                {d.subjects.map((s) => (
                  <li key={s.slug}><Link href={`/learn/${s.slug}`}>{s.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ol-work" className="ol-section">
        <h2 id="ol-work" className="ol-h2">Work that lasts</h2>
        <p className="ol-p">
          Food, water, shelter, health, repair: some needs don&apos;t go away. <Link href="/learn/work">See the kinds of work that meet them</Link>, with
          official pay, outlook and training information.
        </p>
      </section>

      <section aria-labelledby="ol-why" className="ol-section">
        <h2 id="ol-why" className="ol-h2">Why are you learning?</h2>
        <p className="ol-p">There&apos;s no wrong reason. Pick one and start with these.</p>
        <div className="ol-why-list">
          {PATHWAYS.map((p) => {
            const picks = resourcesForPath(p.id).slice(0, 4);
            return (
              <div key={p.id} id={`why-${p.id}`} className="ol-why">
                <h3>{p.label}</h3>
                <p>{p.line}</p>
                <ul>
                  {picks.map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a> <span className="ol-meta">{r.by} · {COST_LABEL[r.cost]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="ol-about" className="ol-section ol-about">
        <h2 id="ol-about" className="ol-h2">About these links</h2>
        <ul>
          <li>Every link goes to the original source. We don&apos;t copy courses, books or videos, and nothing here is ranked by money: there are no affiliate links in Learning.</li>
          <li><strong>Open license</strong> means you may reuse it under its license. <strong>Free to access</strong> means free to read or watch, with rights kept by the publisher. <strong>U.S. government</strong> pages are generally free of copyright in the U.S.</li>
          <li>Where a certificate, exam or license costs money, the entry says so.</li>
          <li>Open Mirror Learning is a directory, not a school. We don&apos;t teach classes or give credit, degrees or certificates, and the sources listed aren&apos;t affiliated with us.</li>
          <li>Links were checked on November 27, 2026. Found a broken one, or a free resource we should add? <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent("Open Mirror Learning")}`}>{STUDIO.email}</a></li>
        </ul>
      </section>
    </main>
  );
}

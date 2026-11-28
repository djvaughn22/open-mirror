import Link from "next/link";
import type { Metadata } from "next";
import ContinueLearning from "../../components/learning/ContinueLearning";
import LearnSearch from "../../components/learning/LearnSearch";
import PathRow from "../../components/learning/PathRow";
import { AREAS, areaSubjectCount } from "../../lib/learning/areas";
import { COST_LABEL, PATHWAYS } from "../../lib/learning/resources";
import { FEATURED_PATHS, PATHS, pathBySlug } from "../../lib/learning/paths";
import { CHECKED_ON, resourcesForPath, subjectCount } from "../../lib/learning/directory";
import { STUDIO } from "../../lib/products";

// Open Mirror Learning (owner direction, Nov 26-28 2026; working title "Open
// Mirror University", public name "Open Mirror Learning" until the naming
// question is reviewed). Search first; then learning paths (an order to
// follow); then nine areas that open to every subject, so the page stays
// short however many subjects are added. We link to free resources made by
// others; we don't teach courses, give credit or issue certificates.

export const metadata: Metadata = {
  title: "Open Mirror Learning",
  description: "Free courses, books and videos on almost any subject, from trusted sources, with step-by-step learning paths. Say what you want to learn in your own words.",
  alternates: { canonical: "/learn" },
};


export default function LearnPage() {
  const featured = FEATURED_PATHS.map((s) => pathBySlug(s)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <main className="ol-page">
      <header className="ol-head">
        <h1 className="ol-title">Open Mirror Learning</h1>
        <p className="ol-sub">Free courses, books and videos from trusted sources, in an order that makes sense.</p>
        <LearnSearch />
      </header>

      <ContinueLearning where="learn" />

      <section aria-labelledby="ol-paths" className="ol-section" id="paths">
        <div className="om-sec-head">
          <h2 id="ol-paths" className="om-sec-title">Learning paths</h2>
          <Link href="/learn/paths" className="om-sec-more">All {PATHS.length}</Link>
        </div>
        <p className="ol-p-sm">What you need, what to learn first, what to practice, and how to know you&apos;re ready for the next step.</p>
        <ul className="om-items">
          {featured.map((p) => <PathRow key={p.slug} p={p} />)}
        </ul>
      </section>

      <section aria-labelledby="ol-all" className="ol-section" id="subjects">
        <div className="om-sec-head">
          <h2 id="ol-all" className="om-sec-title">Browse {subjectCount()} subjects</h2>
        </div>
        <ul className="om-items">
          {AREAS.map((a) => (
            <li key={a.slug}>
              <Link className="om-item" href={`/learn/area/${a.slug}`}>
                <span className="om-item-icon" aria-hidden>{a.icon}</span>
                <span className="om-item-body">
                  <span className="om-item-title">{a.name}</span>
                  <span className="om-item-line">{a.line}</span>
                </span>
                <span className="om-item-meta"><span className="om-item-steps">{areaSubjectCount(a)}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ol-work" className="ol-section">
        <h2 id="ol-work" className="om-sec-title">Work that lasts</h2>
        <ul className="om-items">
          <li>
            <Link className="om-item" href="/learn/work">
              <span className="om-item-icon" aria-hidden>🛠️</span>
              <span className="om-item-body">
                <span className="om-item-title">Jobs that meet lasting needs</span>
                <span className="om-item-line">Food, water, shelter, health and repair, with official pay, outlook and training.</span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="ol-why" className="ol-section" id="why">
        <h2 id="ol-why" className="om-sec-title">Why are you learning?</h2>
        <p className="ol-p-sm">There&apos;s no wrong reason. Open one for places to start.</p>
        <div className="ol-why-list">
          {PATHWAYS.map((p) => {
            const picks = resourcesForPath(p.id).slice(0, 4);
            return (
              <details key={p.id} id={`why-${p.id}`} className="ol-why">
                <summary>
                  <span className="ol-why-label">{p.label}</span>
                  <span className="ol-why-line">{p.line}</span>
                </summary>
                <ul>
                  {picks.map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a> <span className="ol-meta">{r.by} · {COST_LABEL[r.cost]}</span>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>

      <details className="ol-section ol-about" id="about-links">
        <summary><h2 className="om-sec-title">About these links</h2></summary>
        <ul>
          <li>Every link goes to the original source. We don&apos;t copy courses, books or videos, and nothing here is ranked by money: there are no affiliate links in Learning.</li>
          <li><strong>Open license</strong> means you may reuse it under its license. <strong>Free to access</strong> means free to read or watch, with rights kept by the publisher. <strong>U.S. government</strong> pages are generally free of copyright in the U.S.</li>
          <li>Where a certificate, exam, membership or full version costs money, the entry says so. Where a program only serves one country or state, the entry names it.</li>
          <li>Open Mirror Learning is a directory, not a school. We don&apos;t teach classes or give credit, degrees or certificates, and the sources listed aren&apos;t affiliated with us.</li>
          <li>Learning paths are our suggested order. They&apos;re written by us and link to the sources; progress you mark stays on your device.</li>
          <li>Links were checked on {CHECKED_ON}. Found a broken one, or a free resource we should add? <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent("Open Mirror Learning")}`}>{STUDIO.email}</a></li>
        </ul>
      </details>
    </main>
  );
}

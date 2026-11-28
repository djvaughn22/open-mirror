import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUBJECTS, disciplineBySlug, subjectBySlug, wikiUrl } from "../../../lib/learning/taxonomy";
import { COST_LABEL, KIND_LABEL, LICENSE_LABEL, RESOURCES, type Resource } from "../../../lib/learning/resources";
import { NEED_LABEL, occupationById, onetUrl } from "../../../lib/learning/careers";
import { CHECKED_ON, resourcesFor } from "../../../lib/learning/directory";
import { areaOfDiscipline } from "../../../lib/learning/areas";
import { pathsForSubject } from "../../../lib/learning/paths";
import { STUDIO } from "../../../lib/products";
import PathRow from "../../../components/learning/PathRow";
import SaveSubject from "../../../components/learning/SaveSubject";

// One subject: free ways to learn it, the work it leads to, and related
// subjects. Static pages, plain text links, fast on a phone.

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.slug }));
}

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = subjectBySlug((await params).subject);
  if (!s) return {};
  return {
    title: `${s.name}: free ways to learn`,
    description: `${s.line} Free courses, books and videos from trusted sources.`,
    alternates: { canonical: `/learn/${s.slug}` },
  };
}

// Disciplines where people often turn a skill into their own small business.
const BUSINESS_FRIENDLY = new Set(["trades", "agriculture", "culinary", "art", "media", "music", "computing", "business", "home", "communication"]);

function ResourceLine({ r }: { r: Resource }) {
  return (
    <li className="ol-res">
      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
      <span className="ol-meta">
        {r.by} · {KIND_LABEL[r.kind]} · {COST_LABEL[r.cost]} · {r.licenseName ? `${LICENSE_LABEL[r.license]} (${r.licenseName})` : LICENSE_LABEL[r.license]}
        {r.region ? ` · ${r.region}` : ""}
        {r.ours ? " · An Open Mirror project" : ""}
      </span>
      {r.note && <span className="ol-note">{r.note}</span>}
    </li>
  );
}

export default async function SubjectPage({ params }: Props) {
  const s = subjectBySlug((await params).subject);
  if (!s) notFound();
  const d = disciplineBySlug(s.discipline)!;
  const list = resourcesFor(s, s.discipline);
  const start = list.filter((r) => r.level === "start");
  const further = list.filter((r) => r.level !== "start");
  const jobs = (s.careers ?? []).map((id) => occupationById(id)).filter((o): o is NonNullable<typeof o> => !!o);
  const apprenticeship = jobs.some((o) => o.apprenticeship);
  const related = d.subjects.filter((x) => x.slug !== s.slug);
  const pick = (id: string) => RESOURCES.find((r) => r.id === id);
  const business = BUSINESS_FRIENDLY.has(d.slug) ? ["sba-guide", "score", "sitr-engines"].map(pick).filter((r): r is Resource => !!r) : [];
  const area = areaOfDiscipline(d.slug);
  const paths = pathsForSubject(s.slug).slice(0, 3);

  return (
    <main className="ol-page">
      <nav className="ol-crumbs" aria-label="Breadcrumb">
        <Link href="/learn">Learning</Link> › {area ? <Link href={`/learn/area/${area.slug}#d-${d.slug}`}>{area.name}</Link> : d.name}
      </nav>
      <div className="ol-subject-head">
        <h1 className="ol-title">{s.name}</h1>
        <SaveSubject slug={s.slug} name={s.name} />
      </div>
      <p className="ol-lede">{s.line}</p>

      {paths.length > 0 && (
        <section className="ol-section ol-section-tight" aria-labelledby="path-h">
          <h2 id="path-h" className="om-sec-title">Follow a path</h2>
          <ul className="om-items">{paths.map((p) => <PathRow key={p.slug} p={p} />)}</ul>
        </section>
      )}

      <section className="ol-section" aria-labelledby="start-h">
        <h2 id="start-h" className="ol-h2">Start here</h2>
        <ul className="ol-res-list">
          <li className="ol-res">
            <a href={wikiUrl(s)} target="_blank" rel="noopener noreferrer">Wikipedia overview</a>
            <span className="ol-meta">Wikimedia Foundation · Reference · Free · {LICENSE_LABEL.open} (CC BY-SA 4.0)</span>
            <span className="ol-note">An overview to get your bearings. Follow its sources for more.</span>
          </li>
          {start.map((r) => <ResourceLine key={r.id} r={r} />)}
        </ul>
      </section>

      {further.length > 0 && (
        <section className="ol-section" aria-labelledby="further-h">
          <h2 id="further-h" className="ol-h2">Go further</h2>
          <ul className="ol-res-list">{further.map((r) => <ResourceLine key={r.id} r={r} />)}</ul>
        </section>
      )}

      {jobs.length > 0 && (
        <section className="ol-section" id="work" aria-labelledby="work-h">
          <h2 id="work-h" className="ol-h2">Work in this field</h2>
          <ul className="ol-res-list">
            {jobs.map((o) => (
              <li key={o.id} className="ol-res">
                <a href={o.bls ?? onetUrl(o)} target="_blank" rel="noopener noreferrer">{o.title}</a>
                <span className="ol-meta">
                  {o.bls ? <>Pay, outlook and how to start: U.S. Bureau of Labor Statistics · </> : null}
                  <a href={onetUrl(o)} target="_blank" rel="noopener noreferrer">What the work involves (O*NET)</a>
                </span>
                <span className="ol-note">
                  Meets a lasting need: {o.needs.map((n) => NEED_LABEL[n].toLowerCase()).join(", ")}.{o.handsOn ? " Mostly hands-on, in-person work." : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="ol-p">
            {apprenticeship && <><a href="https://www.apprenticeship.gov/apprenticeship-job-finder" target="_blank" rel="noopener noreferrer">Find a Registered Apprenticeship</a> (earn while you learn). </>}
            <Link href="/learn/work">More work that lasts</Link>, and how we describe it.
          </p>
        </section>
      )}

      {business.length > 0 && (
        <section className="ol-section" aria-labelledby="biz-h">
          <h2 id="biz-h" className="ol-h2">Turn it into a small business</h2>
          <p className="ol-p">Not everyone wants to. If you do, start with the official steps and free mentors.</p>
          <ul className="ol-res-list">{business.map((r) => <ResourceLine key={r.id} r={r} />)}</ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="ol-section" aria-labelledby="rel-h">
          <h2 id="rel-h" className="ol-h2">Related subjects</h2>
          <p className="ol-related">
            {related.map((x, i) => (
              <span key={x.slug}>{i > 0 ? " · " : ""}<Link href={`/learn/${x.slug}`}>{x.name}</Link></span>
            ))}
          </p>
        </section>
      )}

      <p className="ol-foot">
        Free resources made by others, linked to the original source and checked on {CHECKED_ON}. Open Mirror Learning is a directory, not a
        school, and these sources aren&apos;t affiliated with us. Suggest a resource or report a broken link:{" "}
        <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent(`Open Mirror Learning: ${s.name}`)}`}>{STUDIO.email}</a>
      </p>
    </main>
  );
}

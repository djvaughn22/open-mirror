import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PathSteps, { PathProgress, type StepView } from "../../../../components/learning/PathSteps";
import PathRow from "../../../../components/learning/PathRow";
import { areaBySlug } from "../../../../lib/learning/areas";
import { NEED_LABEL, occupationById, onetUrl } from "../../../../lib/learning/careers";
import { CHECKED_ON } from "../../../../lib/learning/directory";
import { LEVEL_LABEL, PATHS, pathBySlug } from "../../../../lib/learning/paths";
import { COST_LABEL, KIND_LABEL, LICENSE_LABEL, RESOURCES, type Resource } from "../../../../lib/learning/resources";
import { subjectBySlug } from "../../../../lib/learning/taxonomy";
import { STUDIO } from "../../../../lib/products";

// One learning path: what it is, what you need, what it costs, the steps
// (progress saved on this device), who to learn with, where it can lead.
// Static page; the steps' checkmarks are the only part that needs JavaScript.

export const dynamicParams = false;

export function generateStaticParams() {
  return PATHS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = pathBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title}: a step-by-step learning path`,
    description: `${p.line} ${p.steps.length} steps, with free resources from trusted sources.`,
    alternates: { canonical: `/learn/paths/${p.slug}` },
  };
}

const res = (id: string): Resource | undefined => RESOURCES.find((r) => r.id === id);

function meta(r: Resource): string {
  return [r.by, KIND_LABEL[r.kind], COST_LABEL[r.cost], r.licenseName ? `${LICENSE_LABEL[r.license]} (${r.licenseName})` : LICENSE_LABEL[r.license], r.region].filter(Boolean).join(" · ");
}

function NoteLink({ id }: { id?: string }) {
  const r = id ? res(id) : undefined;
  if (!r) return null;
  return <> <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></>;
}

export default async function PathPage({ params }: Props) {
  const p = pathBySlug((await params).slug);
  if (!p) notFound();
  const area = areaBySlug(p.area);
  const order = ["beginner", "intermediate", "advanced"] as const;
  const levels = order.filter((l) => p.steps.some((s) => s.level === l));
  const steps: StepView[] = p.steps.map((s) => ({
    id: s.id,
    title: s.title,
    level: LEVEL_LABEL[s.level],
    learn: s.learn,
    practice: s.practice,
    done: s.done,
    links: s.res.map(res).filter((r): r is Resource => !!r).map((r) => ({ title: r.title, url: r.url, meta: meta(r), ours: r.ours })),
    see: s.see ?? [],
  }));
  const jobs = p.work.map((id) => occupationById(id)).filter((o): o is NonNullable<typeof o> => !!o);
  const apprenticeship = jobs.some((o) => o.apprenticeship);
  const related = p.related.map((slug) => pathBySlug(slug)).filter((x): x is NonNullable<typeof x> => !!x);
  const subjects = p.subjects.map((s) => subjectBySlug(s)).filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <main className="ol-page ol-path">
      <nav className="ol-crumbs" aria-label="Breadcrumb">
        <Link href="/learn">Learning</Link> › <Link href="/learn/paths">Paths</Link>
        {area ? <> › <Link href={`/learn/area/${area.slug}`}>{area.name}</Link></> : null}
      </nav>
      <div className="ol-path-head">
        <span className="ol-path-icon" aria-hidden>{p.icon}</span>
        <h1 className="ol-title">{p.title}</h1>
      </div>
      <p className="ol-lede">{p.line}</p>

      <PathProgress slug={p.slug} total={p.steps.length} firstStep={p.steps[0].id} />

      <dl className="ol-facts">
        <div><dt>Steps</dt><dd>{p.steps.length}, {levels.length > 1 ? `${LEVEL_LABEL[levels[0]].toLowerCase()} to ${LEVEL_LABEL[levels[levels.length - 1]].toLowerCase()}` : LEVEL_LABEL[levels[0]].toLowerCase()}</dd></div>
        <div><dt>Cost</dt><dd>{p.cost}</dd></div>
      </dl>

      <section className="ol-section" aria-labelledby="about-h">
        <h2 id="about-h" className="ol-h2">What it is</h2>
        <p className="ol-p">{p.about}</p>
      </section>

      <section className="ol-section" aria-labelledby="need-h">
        <h2 id="need-h" className="ol-h2">What you need to begin</h2>
        <ul className="ol-list">{p.need.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>

      <section className="ol-section" aria-labelledby="little-h">
        <h2 id="little-h" className="ol-h2">Starting with very little</h2>
        <ul className="ol-list">{p.little.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>

      {p.safety && (
        <aside className="ol-safety" aria-label="Safety">
          <strong>Safety first.</strong> {p.safety.text}<NoteLink id={p.safety.res} />
        </aside>
      )}

      <section className="ol-section" aria-labelledby="steps-h">
        <h2 id="steps-h" className="ol-h2">The steps</h2>
        <p className="ol-p-sm">Open a step to see what to learn and try. Already know it? Mark it done and move on.</p>
        <PathSteps slug={p.slug} steps={steps} />
      </section>

      <section className="ol-section" aria-labelledby="make-h">
        <h2 id="make-h" className="ol-h2">What you can make</h2>
        <ul className="ol-list">{p.make.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>

      <section className="ol-section" aria-labelledby="people-h">
        <h2 id="people-h" className="ol-h2">Learn with other people</h2>
        <ul className="ol-list">{p.people.map((n) => <li key={n.text}>{n.text}<NoteLink id={n.res} /></li>)}</ul>
      </section>

      {p.routes && (
        <section className="ol-section" aria-labelledby="routes-h">
          <h2 id="routes-h" className="ol-h2">Start from where you are</h2>
          <ul className="ol-res-list">
            {p.routes.map((rt) => (
              <li key={rt.label} className="ol-res">
                <span className="ol-route-label">{rt.label}</span>
                <span className="ol-note">{rt.text}</span>
                <span className="ol-meta">
                  {rt.res.map(res).filter((r): r is Resource => !!r).map((r, i) => (
                    <span key={r.id}>{i > 0 ? " · " : ""}<a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(jobs.length > 0 || p.business) && (
        <section className="ol-section" aria-labelledby="work-h">
          <h2 id="work-h" className="ol-h2">Where it can lead</h2>
          {jobs.length > 0 && (
            <ul className="ol-res-list">
              {jobs.map((o) => (
                <li key={o.id} className="ol-res">
                  <a href={o.bls ?? onetUrl(o)} target="_blank" rel="noopener noreferrer">{o.title}</a>
                  <span className="ol-meta">
                    {o.bls ? <>Pay, outlook and training: U.S. Bureau of Labor Statistics · </> : null}
                    <a href={onetUrl(o)} target="_blank" rel="noopener noreferrer">What the work involves (O*NET)</a>
                  </span>
                  <span className="ol-note">Meets a lasting need: {o.needs.map((n) => NEED_LABEL[n].toLowerCase()).join(", ")}.</span>
                </li>
              ))}
            </ul>
          )}
          {apprenticeship && (
            <p className="ol-p-sm">
              <a href="https://www.apprenticeship.gov/apprenticeship-job-finder" target="_blank" rel="noopener noreferrer">Find a Registered Apprenticeship</a>: earn while you learn.
            </p>
          )}
          {p.business && <p className="ol-p-sm"><strong>As a small business:</strong> {p.business}</p>}
          <p className="ol-p-sm"><Link href="/learn/work">More work that lasts</Link></p>
        </section>
      )}

      <section className="ol-section" aria-labelledby="next-h">
        <h2 id="next-h" className="ol-h2">Keep going</h2>
        {related.length > 0 && <ul className="om-items">{related.map((r) => <PathRow key={r.slug} p={r} />)}</ul>}
        <p className="ol-related">
          Subjects: {subjects.map((s, i) => <span key={s.slug}>{i > 0 ? " · " : ""}<Link href={`/learn/${s.slug}`}>{s.name}</Link></span>)}
        </p>
      </section>

      <p className="ol-foot">
        A suggested order, written by Open Mirror, through free resources made by others. Links were checked on {CHECKED_ON}; the sources aren&apos;t
        affiliated with us, and Open Mirror Learning is a directory, not a school. Suggest a change or report a broken link:{" "}
        <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent(`Learning path: ${p.title}`)}`}>{STUDIO.email}</a>
      </p>
    </main>
  );
}

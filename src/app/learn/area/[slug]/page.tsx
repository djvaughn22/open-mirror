import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PathRow from "../../../../components/learning/PathRow";
import { AREAS, areaBySlug, areaDisciplines, areaSubjectCount } from "../../../../lib/learning/areas";
import { pathsInArea } from "../../../../lib/learning/paths";

// One area of Open Mirror Learning: its learning paths, then every subject in
// it, grouped by discipline. The middle level of area → discipline → subject.

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = areaBySlug((await params).slug);
  if (!a) return {};
  return {
    title: `${a.name}: free ways to learn`,
    description: `${a.line}. Free courses, books and videos from trusted sources, and step-by-step learning paths.`,
    alternates: { canonical: `/learn/area/${a.slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const a = areaBySlug((await params).slug);
  if (!a) notFound();
  const paths = pathsInArea(a.slug);
  const disciplines = areaDisciplines(a);

  return (
    <main className="ol-page">
      <nav className="ol-crumbs" aria-label="Breadcrumb"><Link href="/learn">Learning</Link> › {a.name}</nav>
      <div className="ol-path-head">
        <span className="ol-path-icon" aria-hidden>{a.icon}</span>
        <h1 className="ol-title">{a.name}</h1>
      </div>
      <p className="ol-sub">{areaSubjectCount(a)} subjects: {a.line.toLowerCase()}.</p>

      {paths.length > 0 && (
        <section className="ol-section" aria-labelledby="area-paths">
          <h2 id="area-paths" className="om-sec-title">Learning paths</h2>
          <ul className="om-items">{paths.map((p) => <PathRow key={p.slug} p={p} />)}</ul>
        </section>
      )}

      {disciplines.map((d) => (
        <section key={d.slug} id={`d-${d.slug}`} className="ol-section" aria-labelledby={`h-${d.slug}`}>
          <h2 id={`h-${d.slug}`} className="om-sec-title">{d.name}</h2>
          <ul className="ol-subjects">
            {d.subjects.map((s) => (
              <li key={s.slug}>
                <Link href={`/learn/${s.slug}`}>
                  <span className="ol-subject-name">{s.name}</span>
                  <span className="ol-subject-line">{s.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="ol-foot">
        Other areas: {AREAS.filter((x) => x.slug !== a.slug).map((x, i) => (
          <span key={x.slug}>{i > 0 ? " · " : ""}<Link href={`/learn/area/${x.slug}`}>{x.name}</Link></span>
        ))}
      </p>
    </main>
  );
}

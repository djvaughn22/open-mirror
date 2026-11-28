import Link from "next/link";
import type { Metadata } from "next";
import ContinueLearning from "../../../components/learning/ContinueLearning";
import PathRow from "../../../components/learning/PathRow";
import { AREAS } from "../../../lib/learning/areas";
import { PATHS, pathsInArea } from "../../../lib/learning/paths";

// Every learning path, grouped by area. A path is our suggested order through
// free resources made by others (lib/learning/paths.ts).

export const metadata: Metadata = {
  title: "Learning paths",
  description: "Step-by-step ways to learn a practical skill with free resources: fix up an old computer, make a website, grow food, fix a car, learn piano and more.",
  alternates: { canonical: "/learn/paths" },
};

export default function PathsPage() {
  return (
    <main className="ol-page">
      <nav className="ol-crumbs" aria-label="Breadcrumb"><Link href="/learn">Learning</Link> › Paths</nav>
      <h1 className="ol-title">Learning paths</h1>
      <p className="ol-sub">
        {PATHS.length} skills, each in steps: what you need, what to learn first, what to practice, and how to know you&apos;re ready to move on.
        Beginners start at step 1; if you know the basics, mark steps done and skip ahead.
      </p>

      <ContinueLearning where="learn" />

      {AREAS.map((a) => {
        const list = pathsInArea(a.slug);
        if (!list.length) return null;
        return (
          <section key={a.slug} className="ol-section" aria-labelledby={`paths-${a.slug}`}>
            <h2 id={`paths-${a.slug}`} className="om-sec-title">{a.name}</h2>
            <ul className="om-items">{list.map((p) => <PathRow key={p.slug} p={p} />)}</ul>
          </section>
        );
      })}

      <p className="ol-foot">
        Don&apos;t see what you want to learn? <Link href="/learn">Search every subject</Link>. More paths are on the way.
      </p>
    </main>
  );
}

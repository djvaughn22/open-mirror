import type { Metadata } from "next";
import Link from "next/link";
import AskOpenMirror from "../components/AskOpenMirror";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import ContinueLearning from "../components/learning/ContinueLearning";
import PathRow from "../components/learning/PathRow";
import { AREAS } from "../lib/learning/areas";
import { FEATURED_PATHS, PATHS, pathBySlug } from "../lib/learning/paths";
import { subjectCount } from "../lib/learning/directory";
import { homeSections, siteKey, STUDIO } from "../lib/products";

export const metadata: Metadata = {
  description: STUDIO.welcome,
  alternates: { canonical: "/" },
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="om-group-label">{children}</p>;
}

// The homepage (owner direction, Nov 26-28 2026). The owner's four lines stay
// at the top, as two quick, optional questions (AskOpenMirror). Everything
// below works without answering: learning paths, subjects, work, and the
// apps. Classes in globals.css ("Homepage, Nov 28").
export default function OpenMirrorHub() {
  const sections = homeSections();
  const { hero } = STUDIO;
  const featured = FEATURED_PATHS.slice(0, 6).map((s) => pathBySlug(s)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <main className="om-home">
      <AskOpenMirror />

      <div className="om-home-body">
        <ContinueLearning where="home" />

        <section className="om-sec" aria-labelledby="home-paths">
          <div className="om-sec-head">
            <h2 id="home-paths" className="om-sec-title">Learn something, step by step</h2>
            <Link href="/learn/paths" className="om-sec-more">All {PATHS.length}</Link>
          </div>
          <ul className="om-items">
            {featured.map((p) => <PathRow key={p.slug} p={p} lineless />)}
          </ul>
        </section>

        <section className="om-sec" aria-labelledby="home-subjects">
          <div className="om-sec-head">
            <h2 id="home-subjects" className="om-sec-title">Browse {subjectCount()} subjects</h2>
            <Link href="/learn" className="om-sec-more">Learning</Link>
          </div>
          <ul className="om-area-grid">
            {AREAS.map((a) => (
              <li key={a.slug}>
                <Link className="om-area" href={`/learn/area/${a.slug}`}>
                  <span className="om-item-icon" aria-hidden>{a.icon}</span>
                  <span className="om-area-name">{a.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="om-sec" aria-labelledby="home-work">
          <h2 id="home-work" className="om-sec-title">Find work</h2>
          <ul className="om-items">
            <li>
              <Link className="om-item" href="/learn/paths/find-work">
                <span className="om-item-icon" aria-hidden>🧭</span>
                <span className="om-item-body">
                  <span className="om-item-title">Find work that fits you</span>
                  <span className="om-item-line">What you care about, the careers that use it, and real help getting hired.</span>
                </span>
              </Link>
            </li>
            <li>
              <Link className="om-item" href="/learn/work">
                <span className="om-item-icon" aria-hidden>🛠️</span>
                <span className="om-item-body">
                  <span className="om-item-title">Work that lasts</span>
                  <span className="om-item-line">Jobs that meet needs like food, shelter, health and repair, with official pay and training.</span>
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* The directory: every public site, in its own section below the
            learning. The header is the heading, the owner's one identity
            line and a pointer to About. */}
        <section className="om-sec om-apps" aria-labelledby="projects-title">
          <header id="projects" className="om-projects-head">
            <h2 id="projects-title" className="om-projects-title">The apps</h2>
            <p className="om-projects-intro">
              {hero.note} Each site has its own name and purpose.{" "}
              <a href="/about-open-mirror" className="om-quiet-link">About the studio</a>
            </p>
          </header>

          {/* Four groups named for what a visitor comes to do. CrossHeartPray
              leads the first group, as it always has. */}
          <DoorMeasure />
          {sections.map((s, i) => (
            <section key={s.key} aria-label={s.label} className={i === 0 ? "om-group om-group-first" : "om-group"}>
              <GroupLabel>{s.label}</GroupLabel>
              <div className="om-cards">
                {s.items.map((p) => <ProductCard key={p.name} p={p} doorKey={siteKey(p)} />)}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}

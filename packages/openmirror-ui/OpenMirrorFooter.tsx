// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SOURCE — shared Open Mirror footer (adopted by all 9 satellites).
// Edit ONLY here: hub repo → packages/openmirror-ui/OpenMirrorFooter.tsx
// Then run scripts/sync-ui.sh — never edit the copies in site repos.
//
// Say-less redesign (owner, 2026-07-19), so far shipped on the HUB ONLY
// (sync-ui.sh not run): © line, About · Contact · Disclaimer, email. No
// tagline, no independence sentence, no CrossHeartPray icons. Satellites
// still pass `siteName`/`tagline` for their own identity line; the hub
// passes nothing.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  /** e.g. "iDontCry.com" — omitted (the hub) renders just the Open Mirror lines */
  siteName?: string;
  /** the site's own one-liner, e.g. "The Family's Digital Playground" */
  tagline?: string;
  /** the site's canonical accent — colors the ".com" in siteName */
  accent?: string;
};

// Phrases render as inline-blocks so lines break BETWEEN phrases on phones
// and tablets, never mid-sentence; on desktop each line stays whole.
const phrase = { display: "inline-block" } as const;

const linkStyle = { color: "#94a3b8", textDecoration: "none" } as const;

export default function OpenMirrorFooter({ siteName, tagline, accent }: Props) {
  const baseName =
    siteName && siteName.endsWith(".com") ? siteName.slice(0, -4) : siteName;
  const hasCom = Boolean(siteName && siteName.endsWith(".com"));

  return (
    <footer className="om-footer" style={{ marginTop: 60, textAlign: "center", borderTop: "1px solid #26324c", padding: "28px 20px 36px" }}>
      {siteName && (
        <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700, lineHeight: 1.7, margin: "0 0 6px" }}>
          <span style={phrase}>
            © {new Date().getFullYear()} {baseName}
            {hasCom ? <span style={{ color: accent ?? "#94a3b8" }}>.com</span> : null}
          </span>
          {tagline ? (
            <>
              {" · "}
              <span style={phrase}>{tagline}</span>
            </>
          ) : null}
        </p>
      )}
      <p style={{ fontSize: 13, color: "#e8edf5", fontWeight: 700, lineHeight: 1.8, margin: 0 }}>
        © {new Date().getFullYear()} Open Mirror LLC
      </p>
      <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, lineHeight: 1.9, margin: "6px 0 0" }}>
        <a href="https://openmirrorllc.com/about-open-mirror" style={{ ...phrase, ...linkStyle }}>About</a>
        {" · "}
        <a href="https://openmirrorllc.com/contact" style={{ ...phrase, ...linkStyle }}>Contact</a>
        {" · "}
        <a href="https://openmirrorllc.com/disclaimer" style={{ ...phrase, ...linkStyle }}>Disclaimer</a>
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.8, margin: "6px 0 0" }}>
        <a href="mailto:ask@openmirrorllc.com" style={{ ...phrase, color: "#94a3b8", textDecoration: "underline" }}>
          ask@openmirrorllc.com
        </a>
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SOURCE — shared Open Mirror footer (optional, not yet adopted).
// Edit ONLY here: hub repo → packages/openmirror-ui/OpenMirrorFooter.tsx
// When a site adopts it, add this file to FILES in scripts/sync-ui.sh.
//
// Each site currently keeps its own footer tagline on purpose — adopt this
// per site (with DJ's okay on the copy), passing that site's line as `tagline`.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  /** e.g. "iDontCry.com" — omitted renders just the Open Mirror line */
  siteName?: string;
  /** the site's own one-liner, e.g. "The Family's Digital Playground" */
  tagline?: string;
};

export default function OpenMirrorFooter({ siteName, tagline }: Props) {
  return (
    <footer style={{ marginTop: 60, textAlign: "center", borderTop: "1px solid #26324c", padding: "28px 20px 36px" }}>
      {siteName && (
        <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700, margin: "0 0 6px" }}>
          © {new Date().getFullYear()} {siteName}
          {tagline ? ` · ${tagline}` : ""}
        </p>
      )}
      <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", margin: 0 }}>
        <a href="https://openmirrorllc.com" style={{ color: "#e8edf5", textDecoration: "none" }}>Open Mirror LLC</a>
        {" · "}
        <a href="https://openmirrorllc.com/about-open-mirror" style={{ color: "#94a3b8", textDecoration: "none" }}>About</a>
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SOURCE — shared Open Mirror footer (adopted by all satellites).
// Edit ONLY here: hub repo → packages/openmirror-ui/OpenMirrorFooter.tsx
// Then run scripts/sync-ui.sh — never edit the copies in site repos.
//
// Family footer standard (owner, 2026-08-02). Exactly two compact rows:
//   1. OpenMirrorLLC.com · About · ✝️ ❤️ 🙏
//      (the three icons are ONE link to CrossHeartPray, labeled for a11y)
//   2. Disclaimer · Contact
//      (Contact is a mailto to the verified address — never a contact page)
// Nothing else: no site identity line, no per-site slogans, no ownership
// sentence, no duplicate legal copy. Self-contained: handles its own
// light/dark theming for BOTH theme attributes (data-om-theme and
// data-chp-visual-theme) and pins itself to the bottom of short pages via
// the body flex column below.
// ─────────────────────────────────────────────────────────────────────────────

const OM = "https://openmirrorllc.com";

// The verified Open Mirror contact address (hub: STUDIO.email in products.ts).
const CONTACT_MAILTO =
  "mailto:ask@openmirrorllc.com?subject=Open%20Mirror%20Inquiry";

const css = `
body{min-height:100vh;min-height:100svh;display:flex;flex-direction:column}
.om-footer{margin-top:auto;width:100%;padding-top:44px}
.om-footer-rule{border-top:1px solid #26324c}
.om-footer-in{max-width:1120px;margin:0 auto;padding:8px 20px calc(18px + env(safe-area-inset-bottom,0px))}
.om-footer-row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;column-gap:10px;margin:0}
.om-footer-row a{white-space:nowrap;text-decoration:none;padding:7px 2px}
.om-footer-main a{font-size:13px;font-weight:600;color:#cbd5e1}
.om-footer-sub a{font-size:12px;font-weight:500;color:#94a3b8}
.om-footer-row a:hover{text-decoration:underline;text-underline-offset:4px}
.om-footer-row a:focus-visible{outline:2px solid #94a3b8;outline-offset:2px;border-radius:2px}
.om-footer-dot{color:#475569;font-size:12px;user-select:none}
html[data-om-theme="light"] .om-footer-rule,html[data-chp-visual-theme="light"] .om-footer-rule{border-top-color:#dbe2ea}
html[data-om-theme="light"] .om-footer-main a,html[data-chp-visual-theme="light"] .om-footer-main a{color:#334155}
html[data-om-theme="light"] .om-footer-sub a,html[data-chp-visual-theme="light"] .om-footer-sub a{color:#64748b}
html[data-om-theme="light"] .om-footer-dot,html[data-chp-visual-theme="light"] .om-footer-dot{color:#b6c2d4}
html[data-om-theme="light"] .om-footer-row a:focus-visible,html[data-chp-visual-theme="light"] .om-footer-row a:focus-visible{outline-color:#475569}
`;

const Dot = () => (
  <span className="om-footer-dot" aria-hidden="true">
    ·
  </span>
);

type Props = {
  /** true only on the Open Mirror hub itself — its own links stay relative */
  hub?: boolean;
};

export default function OpenMirrorFooter({ hub = false }: Props) {
  const base = hub ? "" : OM;

  return (
    <footer className="om-footer">
      <style>{css}</style>
      <div className="om-footer-rule">
        <nav aria-label="Open Mirror LLC" className="om-footer-in">
          <p className="om-footer-row om-footer-main">
            <a href={hub ? "/" : OM}>OpenMirrorLLC.com</a>
            <Dot />
            <a href={`${base}/about-open-mirror`}>About</a>
            <Dot />
            <a
              href="https://crossheartpray.com"
              aria-label="Visit CrossHeartPray"
            >
              <span aria-hidden="true">✝️ ❤️ 🙏</span>
            </a>
          </p>
          <p className="om-footer-row om-footer-sub">
            <a href={`${base}/disclaimer`}>Disclaimer</a>
            <Dot />
            <a href={CONTACT_MAILTO}>Contact</a>
          </p>
        </nav>
      </div>
    </footer>
  );
}

type ShopBrand = { name: string; emoji: string; accent: string; tagline: string };

const brands: ShopBrand[] = [
  { name: "CrossHeartPray", emoji: "✝️", accent: "#C4B5FD", tagline: "Prayer cards, Bible study aids, printables." },
  { name: "TheDJCares", emoji: "🎵", accent: "#A78BFA", tagline: "Encouragement cards, playlist bundles, digital downloads." },
  { name: "DontCloneMeTom", emoji: "🐶", accent: "#2DD4BF", tagline: "Dog rescue merchandise, adoption-focused apparel." },
  { name: "iDontCry", emoji: "😂", accent: "#38BDF8", tagline: "Dad jokes, family games, funny stickers." },
  { name: "StepInTheRing", emoji: "🥊", accent: "#60A5FA", tagline: "Build guides, idea templates, digital tools." },
  { name: "Digital Downloads", emoji: "📥", accent: "#7DD3FC", tagline: "Printables, wallpapers, journals, templates." },
  { name: "Funny Ideas", emoji: "💡", accent: "#FBBF24", tagline: "Original humor, unexpected gifts, surprises." },
];

const bg = "#0b1220";
const card = "#141d2e";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";

export default function ShopPage() {
  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 900, color: text, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Open Mirror Shop
          </h1>
          <p style={{ fontSize: 16, color: sub, margin: "0 0 8px" }}>
            Original products from the Open Mirror family.
          </p>
          <p style={{ fontSize: 14, color: sub, margin: 0 }}>
            Shop links will appear as products go live.
          </p>
        </div>

        {/* Brands grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 40 }}>
          {brands.map((brand) => (
            <div
              key={brand.name}
              style={{
                background: card,
                border: `1px solid ${border}`,
                borderLeft: `5px solid ${brand.accent}`,
                borderRadius: 18,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    flexShrink: 0,
                    height: 46,
                    width: 46,
                    borderRadius: 14,
                    background: brand.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {brand.emoji}
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: text, margin: 0 }}>
                  {brand.name}
                </h2>
              </div>
              <p style={{ fontSize: 14, color: sub, margin: 0, lineHeight: 1.5 }}>
                {brand.tagline}
              </p>
              <p style={{ fontSize: 13, color: `${brand.accent}99`, margin: 0, fontWeight: 600 }}>
                Shop links coming soon.
              </p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 18, padding: "28px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: sub, margin: 0, lineHeight: 1.6 }}>
            Each brand will have its own curated products — from prayer cards to funny stickers to dog rescue merchandise. Follow <a href="https://openmirrorllc.com" style={{ color: "#A78BFA", textDecoration: "none", fontWeight: 700 }}>Open Mirror</a> for launch announcements.
          </p>
        </div>
      </div>
    </main>
  );
}

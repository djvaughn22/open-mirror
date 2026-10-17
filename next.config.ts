import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Sports Desk archive is plain JSON on disk. Trace it into the server
  // bundle so the deployed routes can read the games the repo ships with.
  outputFileTracingIncludes: {
    "/sports": ["./data/sports/**"],
    "/sports/[gameId]": ["./data/sports/**"],
    "/sports/[gameId]/card": ["./data/sports/**"],
    "/sports-desk": ["./data/sports/**"],
    "/api/sports/games": ["./data/sports/**"],
    "/api/sports/games/[gameId]": ["./data/sports/**"],
  },
  async redirects() {
    // The hub is the portfolio directory. Pages that predate the split into
    // standalone sites live on permanently as redirects — no saved URL breaks.
    const toCrossHeartPray = [
      ["/crossheartpray", ""],
      ["/cross", ""],
      ["/heart", ""],
      ["/pray", ""],
      ["/daily-hope", "/daily-hope"],
      ["/bible-reading-plan", "/bible-reading-plan"],
      ["/explorebible", "/explorebible"],
      ["/bible-bingo/:boardId", "/bible-bingo/:boardId"],
      // Oldest generation of paths (previously handled by middleware.ts).
      ["/cross-heart-pray", ""],
      ["/cross-heart-pray/cross", ""],
      ["/cross-heart-pray/heart", ""],
      ["/cross-heart-pray/pray", ""],
      ["/bible-explorer", "/explorebible"],
    ].map(([source, path]) => ({
      source,
      destination: `https://crossheartpray.com${path}`,
      permanent: true,
    }));

    const toStandaloneSites = [
      ["/thedjcares", "https://thedjcares.com"],
      ["/dj-cares", "https://thedjcares.com"],
      ["/the-dj-cares", "https://thedjcares.com"],
      ["/dont-clone-me-tom", "https://dontclonemetom.com"],
      ["/idontcry", "https://idontcry.com"],
      ["/step-in-the-ring", "https://stepinthering.com"],
      ["/watched-not-watched", "https://watchednotwatched.com"],
      ["/whatamiai", "https://whatamiai.com"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));

    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/welcome", destination: "/", permanent: true },
      { source: "/open-mirror-platform", destination: "/", permanent: true },
      { source: "/cross-heart-pray/reflect", destination: "/reflect", permanent: true },
      { source: "/about", destination: "/about-open-mirror", permanent: true },
      { source: "/work-with-the-founder", destination: "/contact", permanent: true },
      { source: "/talk-with-the-owner", destination: "/contact", permanent: true },
      // 2026-10-17 (owner): selling and investor pages are the wrong direction
      // for now. Their URLs land somewhere useful instead of serving that copy:
      // the partnership invitation goes to About, and the Build Machine product
      // pages and readiness PDF go to StepInTheRing's Ready to Build guide,
      // which covers turning a computer you already have into one that builds.
      { source: "/partnership", destination: "/about-open-mirror", permanent: false },
      { source: "/products/old-laptop-to-build-machine/:path*", destination: "https://stepinthering.com/products/ready-to-build", permanent: false },
      { source: "/downloads/old-laptop-readiness-check.pdf", destination: "https://stepinthering.com/products/ready-to-build", permanent: false },
      ...toCrossHeartPray,
      ...toStandaloneSites,
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;

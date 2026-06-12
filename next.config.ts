import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "openmirrorllc.com" }],
        destination: "https://crossheartpray.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.openmirrorllc.com" }],
        destination: "https://crossheartpray.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

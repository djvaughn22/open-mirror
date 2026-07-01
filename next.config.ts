import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/__force-routing-update",
        destination: "https://example.com",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;

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

      {
        source: "/the-dj-cares",
        has: [{ type: "host", value: "crossheartpray.com" }],
        destination: "https://thedjcares.com",
        permanent: false,
      },
      {
        source: "/the-dj-cares",
        has: [{ type: "host", value: "www.crossheartpray.com" }],
        destination: "https://thedjcares.com",
        permanent: false,
      },
      {
        source: "/what-am-i-ai",
        has: [{ type: "host", value: "crossheartpray.com" }],
        destination: "https://whatamiai.com",
        permanent: false,
      },
      {
        source: "/what-am-i-ai",
        has: [{ type: "host", value: "www.crossheartpray.com" }],
        destination: "https://whatamiai.com",
        permanent: false,
      },

      {
        source: "/home",
        has: [{ type: "host", value: "thedjcares.com" }],
        destination: "https://crossheartpray.com/home",
        permanent: false,
      },
      {
        source: "/home",
        has: [{ type: "host", value: "www.thedjcares.com" }],
        destination: "https://crossheartpray.com/home",
        permanent: false,
      },
      {
        source: "/home",
        has: [{ type: "host", value: "whatamiai.com" }],
        destination: "https://crossheartpray.com/home",
        permanent: false,
      },
      {
        source: "/home",
        has: [{ type: "host", value: "www.whatamiai.com" }],
        destination: "https://crossheartpray.com/home",
        permanent: false,
      },

      {
        source: "/explorebible",
        has: [{ type: "host", value: "thedjcares.com" }],
        destination: "https://crossheartpray.com/explorebible",
        permanent: false,
      },
      {
        source: "/explorebible",
        has: [{ type: "host", value: "www.thedjcares.com" }],
        destination: "https://crossheartpray.com/explorebible",
        permanent: false,
      },
      {
        source: "/explorebible",
        has: [{ type: "host", value: "whatamiai.com" }],
        destination: "https://crossheartpray.com/explorebible",
        permanent: false,
      },
      {
        source: "/explorebible",
        has: [{ type: "host", value: "www.whatamiai.com" }],
        destination: "https://crossheartpray.com/explorebible",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "thedjcares.com" }],
          destination: "/the-dj-cares",
        },
        {
          source: "/",
          has: [{ type: "host", value: "www.thedjcares.com" }],
          destination: "/the-dj-cares",
        },
        {
          source: "/",
          has: [{ type: "host", value: "whatamiai.com" }],
          destination: "/what-am-i-ai",
        },
        {
          source: "/",
          has: [{ type: "host", value: "www.whatamiai.com" }],
          destination: "/what-am-i-ai",
        },
      ],
    };
  },
};

export default nextConfig;

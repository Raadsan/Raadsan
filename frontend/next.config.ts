import type { NextConfig } from "next"

const API_BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  `http://localhost:${process.env.NEXT_PUBLIC_API_PORT || "8006"}`

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "radsanuploads.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy /api/* to the Express backend so the browser never calls port 8006 directly
      {
        source: "/api/:path*",
        destination: `${API_BACKEND}/api/:path*`,
      },
      {
        source: "/management",
        destination: "/dashboard/management",
      },
      {
        source: "/management/:path*",
        destination: "/dashboard/management/:path*",
      },
      {
        source: "/configuration",
        destination: "/dashboard/configuration",
      },
      {
        source: "/configuration/:path*",
        destination: "/dashboard/configuration/:path*",
      },
    ]
  },
}

export default nextConfig

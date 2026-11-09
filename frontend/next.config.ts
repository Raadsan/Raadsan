import type { NextConfig } from "next"

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

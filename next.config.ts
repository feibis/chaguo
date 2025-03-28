import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,

  experimental: {
    ppr: true,
    useCache: true,

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  images: {
    remotePatterns: [
      { hostname: "*.google.com" }, // Used for seed data, can be removed
      { hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` },
    ],
  },

  async rewrites() {
    const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST

    return [
      // PostHog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogUrl?.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogUrl}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogUrl}/decide`,
      },
    ]
  },
}

export default withContentCollections(nextConfig)

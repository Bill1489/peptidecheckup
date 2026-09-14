import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted on any static host (GitHub Pages,
 * Netlify, Vercel, Cloudflare Pages). basePath is injected at build time for
 * sub-path hosting (e.g. https://user.github.io/peptidecheckup).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;

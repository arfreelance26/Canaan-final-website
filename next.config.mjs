import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy directives
// - script-src keeps 'unsafe-inline' because Next.js App Router inlines hydration scripts
// - img-src allows 'https:' broadly because API-served images may come from unknown CDNs
// - connect-src is locked to the known API domain and CDN used by react-globe.gl
const CSP = [
  "default-src 'self'",
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  [
    "connect-src 'self'",
    "https://api.canaanglobalinternational.com",
    "https://unpkg.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    isDev ? "http://localhost:8000 http://127.0.0.1:8000 ws://localhost:3000" : "",
  ].filter(Boolean).join(" "),
  "media-src 'self'",
  "worker-src 'self' blob:",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  isDev ? "" : "upgrade-insecure-requests",
].filter(Boolean).join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy",       value: CSP },
  { key: "X-Frame-Options",               value: "DENY" },
  { key: "X-Content-Type-Options",        value: "nosniff" },
  { key: "X-DNS-Prefetch-Control",        value: "on" },
  { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // 2-year HSTS with preload — only set in production
    key: "Strict-Transport-Security",
    value: isDev ? "" : "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy",    value: "same-origin-allow-popups" },
].filter((h) => h.value !== "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strip the X-Powered-By: Next.js response header
  poweredByHeader: false,

  devIndicators: false,
  transpilePackages: ["three", "react-globe.gl", "three-globe", "globe.gl"],
  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  images: {
    remotePatterns: [
      // Production API — images served by the backend or its CDN
      {
        protocol: "https",
        hostname: "api.canaanglobalinternational.com",
      },
      // Unsplash — used as fallback images in AboutEmbed
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // AWS S3 / CloudFront — common CDN for Django media uploads
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      // Local development API
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "http", hostname: "localhost",  port: "8000" },
    ],
  },
};

export default nextConfig;

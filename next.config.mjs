import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy directives
// NOTE: script-src retains 'unsafe-inline' because Next.js 15+ App Router inlines
// hydration scripts at build time without nonce injection support in the open-source
// runtime. Nonce-based CSP requires a custom server or Next.js Enterprise features.
// All other directives are locked as tightly as the dependencies allow.
const CSP = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  // style-src: unsafe-inline needed for Tailwind's runtime style injection & AOS
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // img-src: locked to self + data URIs + known CDN hostnames (not wildcard https:)
  "img-src 'self' data: blob: https://api.canaanglobalinternational.com https://images.unsplash.com https://*.amazonaws.com https://*.cloudfront.net",
  "font-src 'self' data: https://fonts.gstatic.com",
  [
    "connect-src 'self'",
    "https://api.canaanglobalinternational.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    isDev ? "http://localhost:8000 http://127.0.0.1:8000 ws://localhost:3000" : "",
  ].filter(Boolean).join(" "),
  "media-src 'self' https://api.canaanglobalinternational.com",
  "worker-src 'self' blob:",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  // form-action: only allow submissions to own origin and the API
  "form-action 'self' https://api.canaanglobalinternational.com",
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
  output:"export",
  trailingSlash:true,
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
    // Static export has no server, so the Image Optimization API isn't available.
    // next/image falls back to serving the original file unresized/unoptimized.
    unoptimized: true,
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

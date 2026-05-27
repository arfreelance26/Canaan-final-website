import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: ["three", "react-globe.gl", "three-globe", "globe.gl"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: ["three", "react-globe.gl", "three-globe", "globe.gl"],
};

export default nextConfig;

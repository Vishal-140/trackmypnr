/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [],
  },
  // API routes are same-origin — no rewrites needed.
};

export default nextConfig;

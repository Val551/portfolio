import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No server, no API, no runtime — the site is fully static.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

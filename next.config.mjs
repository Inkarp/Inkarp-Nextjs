import { legacyRedirects } from "./src/data/legacyRedirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  // A verification build can be sent elsewhere with NEXT_DIST_DIR so it never
  // overwrites the .next directory a running `next dev` is serving from.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),

  // Old inkarp.co.in addresses -> their pages on this site (permanent).
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;

import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const nextConfig: NextConfig = {
  transpilePackages: [
    "@shandapha/core",
    "@shandapha/entitlements",
    "@shandapha/layouts",
    "@shandapha/packs",
    "@shandapha/react",
    "@shandapha/registry",
    "@shandapha/templates",
    "@shandapha/tokens",
  ],
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;

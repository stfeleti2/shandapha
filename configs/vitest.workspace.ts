import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "services/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "packages/registry/src/index.test.ts",
      "packages/generator/src/index.test.ts",
    ],
  },
});

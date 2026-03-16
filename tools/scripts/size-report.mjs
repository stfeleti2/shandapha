import { gzipSync } from "node:zlib";

const budgets = [
  {
    name: "runtime",
    entry: "packages/runtime/src/index.ts",
    platform: "browser",
    limit: 20_000,
  },
  {
    name: "wc",
    entry: "packages/wc/src/index.ts",
    platform: "browser",
    limit: 35_000,
  },
  {
    name: "core",
    entry: "packages/core/src/index.tsx",
    platform: "browser",
    limit: 260_000,
  },
  {
    name: "react",
    entry: "packages/react/src/index.tsx",
    platform: "browser",
    limit: 220_000,
  },
  {
    name: "module-datatable",
    entry: "packages/modules/datatable/src/index.ts",
    platform: "browser",
    limit: 140_000,
  },
];

let esbuild;

try {
  esbuild = await import("esbuild");
} catch {
  throw new Error(
    "esbuild is required for real bundle-size checks. Install it in the workspace before running `pnpm size`.",
  );
}

const report = [];

for (const budget of budgets) {
  const result = await esbuild.build({
    entryPoints: [budget.entry],
    bundle: true,
    write: false,
    format: "esm",
    jsx: "automatic",
    target: ["es2022"],
    platform: budget.platform,
    minify: true,
    treeShaking: true,
    legalComments: "none",
    metafile: true,
  });
  const output = result.outputFiles[0];

  if (!output) {
    throw new Error(`No bundled output was produced for ${budget.entry}.`);
  }

  const bytes = output.contents.byteLength;
  const gzip = gzipSync(output.contents).byteLength;

  report.push({
    name: budget.name,
    entry: budget.entry,
    bytes,
    gzip,
    limit: budget.limit,
    status: bytes <= budget.limit ? "pass" : "fail",
  });
}

const failures = report.filter((item) => item.status === "fail");

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  throw new Error(
    `Bundle budget failures:\n- ${failures
      .map((item) => `${item.name}: ${item.bytes} > ${item.limit}`)
      .join("\n- ")}`,
  );
}

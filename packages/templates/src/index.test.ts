import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  getTemplateAssetBundle,
  getTemplateFrameworkFiles,
  listTemplateAssetBundles,
  templates,
} from "./index";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

describe("templates", () => {
  it("loads template manifests from asset folders", () => {
    expect(templates.length).toBeGreaterThanOrEqual(20);
    expect(getTemplateAssetBundle("dashboard-home")).toBeDefined();
    expect(
      getTemplateFrameworkFiles("dashboard-home", "next-app-router"),
    ).toEqual(["catalog/dashboard-home/files/next-app-router/page.tsx"]);
  });

  it("keeps required template asset files present on disk", async () => {
    const bundles = listTemplateAssetBundles();

    await Promise.all(
      bundles.flatMap((bundle) => [
        access(join(packageRoot, bundle.rootDir, "template.json")),
        access(join(packageRoot, bundle.readmePath)),
        access(join(packageRoot, bundle.previewPath)),
        ...bundle.states.map((statePath) =>
          access(join(packageRoot, statePath)),
        ),
        ...bundle.variants.map((variantPath) =>
          access(join(packageRoot, variantPath)),
        ),
        ...bundle.samples.map((samplePath) =>
          access(join(packageRoot, samplePath)),
        ),
        ...Object.values(bundle.files).flatMap((paths) =>
          paths.map((path) => access(join(packageRoot, path))),
        ),
      ]),
    );
  });
});

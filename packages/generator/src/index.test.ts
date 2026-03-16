import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineGenerationInput } from "@shandapha/contracts";
import { afterEach, describe, expect, it } from "vitest";
import {
  createGenerationPlan,
  generatePatch,
  generateStarter,
  generateThemeOnly,
  generateUninstall,
} from "./index";

const tempRoots: string[] = [];

async function createTempRoot(prefix: string) {
  const root = await mkdtemp(join(tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) =>
      rm(root, {
        force: true,
        recursive: true,
      }),
    ),
  );
});

describe("generator", () => {
  it("creates a reversible plan", () => {
    const plan = createGenerationPlan(
      defineGenerationInput({
        framework: "next-app-router",
        intent: "existing-project",
        packId: "normal",
        planId: "free",
        templates: ["dashboard-home"],
        modules: [],
      }),
    );

    expect(plan.uninstallManifest.length).toBeGreaterThan(0);
    expect(plan.version).toBe(1);
    expect(plan.patchOperations.length).toBeGreaterThan(0);
  });

  it("writes a starter with verification output", async () => {
    const targetRoot = await createTempRoot("shandapha-starter-");
    const result = await generateStarter(
      defineGenerationInput({
        framework: "react-vite",
        intent: "new-project",
        packId: "normal",
        planId: "free",
        templates: ["dashboard-home"],
        modules: [],
      }),
      {
        projectName: "starter-proof",
        targetRoot,
      },
    );

    expect(result.doctor.status).toBe("pass");
    expect(result.writtenPaths).toContain(
      "src/pages/generated/shandapha-verification.tsx",
    );
    expect(
      await readFile(
        join(targetRoot, "src/pages/generated/shandapha-verification.tsx"),
        "utf8",
      ),
    ).toContain("Verification");
  });

  it("creates a reversible patch manifest and uninstall restores the project", async () => {
    const targetRoot = await createTempRoot("shandapha-patch-");

    await mkdir(join(targetRoot, "src"), {
      recursive: true,
    });
    await writeFile(
      join(targetRoot, "package.json"),
      JSON.stringify(
        {
          name: "patch-target",
          private: true,
          version: "0.1.0",
          dependencies: {
            react: "^19.2.4",
          },
        },
        null,
        2,
      ),
    );
    await writeFile(
      join(targetRoot, "src/main.tsx"),
      [
        'import { StrictMode } from "react";',
        'import { createRoot } from "react-dom/client";',
        'import App from "./App";',
        "",
        'const root = document.getElementById("root");',
        "",
        "if (root) {",
        "  createRoot(root).render(",
        "    <StrictMode>",
        "      <App />",
        "    </StrictMode>,",
        "  );",
        "}",
        "",
      ].join("\n"),
    );
    await writeFile(
      join(targetRoot, "src/App.tsx"),
      "export default function App() { return <main>Existing app</main>; }\n",
    );

    const patchResult = await generatePatch(
      defineGenerationInput({
        framework: "react-vite",
        intent: "existing-project",
        packId: "glass",
        planId: "free",
        templates: ["dashboard-home"],
        modules: [],
      }),
      {
        projectName: "patch-proof",
        targetRoot,
      },
    );

    expect(patchResult.manifestPath).toBe(".shandapha/patch-manifest.json");
    expect(
      await readFile(
        join(targetRoot, ".shandapha/patch-manifest.json"),
        "utf8",
      ),
    ).toContain('"framework": "react-vite"');
    expect(await readFile(join(targetRoot, "src/theme.css"), "utf8")).toContain(
      "--sh-",
    );

    const uninstallResult = await generateUninstall({
      targetRoot,
    });

    expect(uninstallResult.removedPaths).toContain(
      ".shandapha/patch-manifest.json",
    );
    expect(
      await readFile(join(targetRoot, "package.json"), "utf8"),
    ).not.toContain("@shandapha/");
  });

  it("exports theme-only assets without starter app files", async () => {
    const targetRoot = await createTempRoot("shandapha-theme-");
    const result = await generateThemeOnly(
      {
        framework: "wc-universal",
        packId: "neon",
        planId: "free",
      },
      {
        projectName: "theme-proof",
        targetRoot,
      },
    );

    expect(result.writtenPaths).toHaveLength(3);
    expect(result.writtenPaths).toEqual(
      expect.arrayContaining([
        "theme.css",
        "tokens.json",
        "theme-gallery.html",
      ]),
    );
    expect(
      await readFile(join(targetRoot, "theme-gallery.html"), "utf8"),
    ).toContain("theme-proof");
  });

  it("resolves org catalog templates by stable registry id when workspace context is provided", () => {
    const plan = createGenerationPlan(
      defineGenerationInput({
        framework: "react-vite",
        intent: "new-project",
        packId: "normal",
        planId: "free",
        templates: [],
        modules: [],
        templateRegistryIds: ["org/acme::template::workspace-review-hub"],
        catalogConfigPath: "shandapha.catalog.json",
        catalogWorkspaceId: "acme",
      }),
    );

    expect(plan.selectedTemplates[0]?.registryId).toBe(
      "org/acme::template::workspace-review-hub",
    );
    expect(plan.starterRecipe.requiredRoutes).toContain("/workspace-review-hub");
  });

  it("rejects community catalog items when enforce policies block them", () => {
    expect(() =>
      createGenerationPlan(
        defineGenerationInput({
          framework: "react-vite",
          intent: "existing-project",
          packId: "normal",
          planId: "free",
          templates: ["dashboard-home"],
          modules: [],
          moduleRegistryIds: ["community/demo-labs::module::release-notes"],
          catalogConfigPath: "shandapha.catalog.json",
        }),
      ),
    ).toThrow(/Catalog policy check failed/i);
  });
});

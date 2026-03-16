import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { FrameworkAdapterId, GenerationInput } from "@shandapha/contracts";
import { type GeneratedOutputFile, writeGeneratedFiles } from "./files";

export const PATCH_MANIFEST_PATH = ".shandapha/patch-manifest.json";

export interface PersistedPatchManifest {
  version: 1;
  framework: FrameworkAdapterId;
  input: GenerationInput;
  files: Array<{
    checksum: string;
    existedBefore: boolean;
    operation: GeneratedOutputFile["operation"];
    ownerPackage: string;
    path: string;
    previousContent?: string;
    reason: string;
    sourcePath?: string;
  }>;
}

export function createPersistedPatchManifest(options: {
  files: GeneratedOutputFile[];
  framework: FrameworkAdapterId;
  input: GenerationInput;
}): PersistedPatchManifest {
  return {
    version: 1,
    framework: options.framework,
    input: options.input,
    files: options.files.map((file) => ({
      checksum: file.checksum,
      existedBefore: file.existedBefore,
      operation: file.operation,
      ownerPackage: file.ownerPackage,
      path: file.path,
      previousContent: file.previousContent,
      reason: file.reason,
      sourcePath: file.sourcePath,
    })),
  };
}

export async function applyPersistedPatchUninstall(
  targetRoot: string,
  options: {
    dryRun?: boolean;
    manifestPath?: string;
  } = {},
) {
  const manifestPath = options.manifestPath ?? PATCH_MANIFEST_PATH;
  const manifest = JSON.parse(
    await readFile(join(targetRoot, manifestPath), "utf8"),
  ) as PersistedPatchManifest;
  const uninstallFiles: GeneratedOutputFile[] = [
    ...manifest.files.map((file) => {
      if (file.existedBefore) {
        return {
          path: file.path,
          operation: "patch",
          ownerPackage: "@shandapha/generator",
          reason: `Restore ${file.path}`,
          content: file.previousContent ?? "",
          existedBefore: true,
          previousContent: file.previousContent,
          checksum: file.checksum,
        } satisfies GeneratedOutputFile;
      }

      return {
        path: file.path,
        operation: "remove",
        ownerPackage: "@shandapha/generator",
        reason: `Remove ${file.path}`,
        existedBefore: false,
        checksum: file.checksum,
      } satisfies GeneratedOutputFile;
    }),
    {
      path: manifestPath,
      operation: "remove",
      ownerPackage: "@shandapha/generator",
      reason: `Remove ${manifestPath}`,
      existedBefore: true,
      checksum: manifest.version.toString(),
    },
  ];

  return {
    manifest,
    ...(await writeGeneratedFiles(targetRoot, uninstallFiles, {
      dryRun: options.dryRun,
    })),
  };
}

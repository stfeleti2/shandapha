import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { PatchOperationKind } from "@shandapha/contracts";

export interface GeneratedOutputFile {
  path: string;
  operation: PatchOperationKind;
  ownerPackage: string;
  reason: string;
  content?: string;
  sourcePath?: string;
  existedBefore: boolean;
  previousContent?: string;
  checksum: string;
}

export interface FileWriteResult {
  removedPaths: string[];
  writtenPaths: string[];
}

export function createChecksum(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export async function readOptionalText(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return undefined;
    }

    throw error;
  }
}

export function sortGeneratedFiles(files: GeneratedOutputFile[]) {
  return [...files].sort((left, right) => {
    if (left.path === right.path) {
      return left.operation.localeCompare(right.operation);
    }

    return left.path.localeCompare(right.path);
  });
}

export async function writeGeneratedFiles(
  targetRoot: string,
  files: GeneratedOutputFile[],
  options: {
    dryRun?: boolean;
  } = {},
): Promise<FileWriteResult> {
  const removedPaths: string[] = [];
  const writtenPaths: string[] = [];

  for (const file of sortGeneratedFiles(files)) {
    const absolutePath = join(targetRoot, file.path);

    if (file.operation === "remove") {
      removedPaths.push(file.path);

      if (!options.dryRun) {
        await rm(absolutePath, {
          force: true,
        });
      }

      continue;
    }

    writtenPaths.push(file.path);

    if (options.dryRun) {
      continue;
    }

    await mkdir(dirname(absolutePath), {
      recursive: true,
    });
    await writeFile(absolutePath, file.content ?? "", "utf8");
  }

  return {
    removedPaths,
    writtenPaths,
  };
}

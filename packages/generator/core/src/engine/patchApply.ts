import {
  createChecksum,
  type GeneratedOutputFile,
  readOptionalText,
} from "./files";

function sortObject<T>(value: Record<string, T>) {
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right)),
  );
}

export async function createPackageJsonPatch(options: {
  absolutePath: string;
  dependencies: Record<string, string>;
  reason: string;
  targetPath: string;
}) {
  const previousContent = await readOptionalText(options.absolutePath);
  const existingPackageJson = previousContent
    ? JSON.parse(previousContent)
    : {
        name: "shandapha-generated",
        private: true,
        version: "0.1.0",
      };
  const nextDependencies = sortObject({
    ...(existingPackageJson.dependencies ?? {}),
    ...options.dependencies,
  });
  const nextPackageJson = JSON.stringify(
    {
      ...existingPackageJson,
      dependencies: nextDependencies,
    },
    null,
    2,
  );

  return {
    path: options.targetPath,
    operation: previousContent ? "patch" : "create",
    ownerPackage: "@shandapha/generator",
    reason: options.reason,
    content: `${nextPackageJson}\n`,
    existedBefore: Boolean(previousContent),
    previousContent,
    checksum: createChecksum(nextPackageJson),
  } satisfies GeneratedOutputFile;
}

export async function createImportPatch(options: {
  absolutePath: string;
  targetPath: string;
  importStatement: string;
  reason: string;
}) {
  const previousContent = await readOptionalText(options.absolutePath);

  if (!previousContent) {
    return undefined;
  }

  if (previousContent.includes(options.importStatement)) {
    return undefined;
  }

  const nextContent = `${options.importStatement}\n${previousContent}`;

  return {
    path: options.targetPath,
    operation: "patch",
    ownerPackage: "@shandapha/generator",
    reason: options.reason,
    content: nextContent,
    existedBefore: true,
    previousContent,
    checksum: createChecksum(nextContent),
  } satisfies GeneratedOutputFile;
}

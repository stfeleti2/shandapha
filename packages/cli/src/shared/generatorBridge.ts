import { access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import {
  defineGenerationInput,
  FRAMEWORK_ADAPTER_IDS,
  type FrameworkAdapterId,
  type GenerationInput,
  type PackId,
  type PlanId,
  THEME_MODES,
  type ThemeMode,
} from "@shandapha/contracts";
import type {
  GenerationExecutionOptions,
  GenerationExecutionResult,
  ThemeOnlyInput,
} from "@shandapha/generator-core";
import { evaluateCatalogPolicies } from "@shandapha/registry";
import type {
  RegistryBridgeOptions,
  registryBridge,
} from "./registryBridge";

const DEFAULT_PACK: PackId = "normal";
const DEFAULT_PLAN: PlanId = "free";
const DEFAULT_FRAMEWORK: FrameworkAdapterId = "react-vite";

interface ParsedArgs {
  command: string;
  flags: Map<string, string[]>;
  positionals: string[];
}

interface CommandDependencies {
  doctorProject: (options: {
    framework: FrameworkAdapterId;
    targetRoot: string;
  }) => Promise<unknown>;
  generatePatch: (
    input: GenerationInput,
    options: GenerationExecutionOptions,
  ) => Promise<GenerationExecutionResult>;
  generateStarter: (
    input: GenerationInput,
    options: GenerationExecutionOptions,
  ) => Promise<GenerationExecutionResult>;
  generateThemeOnly: (
    input: ThemeOnlyInput,
    options: GenerationExecutionOptions,
  ) => Promise<GenerationExecutionResult>;
  registry: ReturnType<typeof registryBridge>;
}

export interface CommandRunResult {
  exitCode: number;
  showDiff: boolean;
  value: unknown;
  writeJson: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "init", ...rest] = argv;
  const flags = new Map<string, string[]>();
  const positionals: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];

    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const [rawKey, inlineValue] = token.split("=", 2);
    const key = rawKey.slice(2);

    if (inlineValue !== undefined) {
      flags.set(key, [...(flags.get(key) ?? []), inlineValue]);
      continue;
    }

    const next = rest[index + 1];

    if (next && !next.startsWith("--")) {
      flags.set(key, [...(flags.get(key) ?? []), next]);
      index += 1;
      continue;
    }

    flags.set(key, [...(flags.get(key) ?? []), "true"]);
  }

  return {
    command,
    flags,
    positionals,
  };
}

function hasFlag(parsed: ParsedArgs, key: string) {
  return parsed.flags.has(key);
}

function readSingleFlag(parsed: ParsedArgs, ...keys: string[]) {
  for (const key of keys) {
    const values = parsed.flags.get(key);

    if (values?.[0]) {
      return values[0];
    }
  }

  return undefined;
}

function readListFlag(parsed: ParsedArgs, ...keys: string[]) {
  return keys.flatMap((key) =>
    (parsed.flags.get(key) ?? []).flatMap((value) =>
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

function readRegistryIdsForKind(
  parsed: ParsedArgs,
  kind: "module" | "pack" | "template",
) {
  return readListFlag(parsed, "id", "ids").filter((value) =>
    value.includes(`::${kind}::`),
  );
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function normalizeFramework(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  switch (value) {
    case "react":
    case "react-vite":
      return "react-vite" satisfies FrameworkAdapterId;
    case "next":
    case "next-app-router":
      return "next-app-router" satisfies FrameworkAdapterId;
    case "wc":
    case "wc-universal":
      return "wc-universal" satisfies FrameworkAdapterId;
    case "blazor":
    case "blazor-wc":
      return "blazor-wc" satisfies FrameworkAdapterId;
    default:
      return FRAMEWORK_ADAPTER_IDS.includes(value as FrameworkAdapterId)
        ? (value as FrameworkAdapterId)
        : undefined;
  }
}

function normalizeThemeMode(value: string | undefined): ThemeMode | undefined {
  if (!value) {
    return undefined;
  }

  return THEME_MODES.includes(value as ThemeMode)
    ? (value as ThemeMode)
    : undefined;
}

function resolveRegistryOptions(parsed: ParsedArgs): RegistryBridgeOptions {
  return {
    catalogConfigPath: readSingleFlag(parsed, "catalog-config"),
    workspaceId: readSingleFlag(parsed, "workspace"),
  };
}

function resolvePackSelection(
  bridge: ReturnType<typeof registryBridge>,
  rawPack: string | undefined,
  options?: RegistryBridgeOptions,
) {
  const value = rawPack ?? DEFAULT_PACK;
  const match = bridge.find("pack", value, options);

  if (!match) {
    throw new Error(
      `Unknown pack "${value}". Available packs: ${bridge.list("pack", options).join(", ")}.`,
    );
  }

  return {
    packId: ("id" in match.manifest ? match.manifest.id : DEFAULT_PACK) as PackId,
    packRegistryId: match.registryId,
  };
}

function resolveTemplateSelection(
  bridge: ReturnType<typeof registryBridge>,
  requestedTemplates: string[],
  options?: RegistryBridgeOptions,
) {
  const templateRegistryIds: string[] = [];
  const templates: string[] = [];

  unique(requestedTemplates).forEach((slug) => {
    const match = bridge.find("template", slug, options);

    if (!match) {
      throw new Error(
        `Unknown template "${slug}". Available templates: ${bridge
          .list("template", options)
          .join(", ")}.`,
      );
    }

    if (slug.includes("::")) {
      templateRegistryIds.push(match.registryId);
      return;
    }

    templates.push(match.slug);
  });

  return {
    templateRegistryIds,
    templates,
  };
}

function resolveModuleSelection(
  bridge: ReturnType<typeof registryBridge>,
  requestedModules: string[],
  options?: RegistryBridgeOptions,
) {
  const moduleRegistryIds: string[] = [];
  const modules: string[] = [];

  unique(requestedModules).forEach((moduleId) => {
    const match = bridge.find("module", moduleId, options);

    if (!match) {
      throw new Error(
        `Unknown module "${moduleId}". Available modules: ${bridge
          .list("module", options)
          .join(", ")}.`,
      );
    }

    if (moduleId.includes("::")) {
      moduleRegistryIds.push(match.registryId);
      return;
    }

    modules.push(match.slug);
  });

  return {
    moduleRegistryIds,
    modules,
  };
}

function resolvePlanId(parsed: ParsedArgs): PlanId {
  const explicit = readSingleFlag(parsed, "plan");

  if (
    explicit === "premium" ||
    explicit === "business" ||
    explicit === "free"
  ) {
    return explicit;
  }

  if (hasFlag(parsed, "business")) {
    return "business";
  }

  if (hasFlag(parsed, "premium")) {
    return "premium";
  }

  return DEFAULT_PLAN;
}

function createExecutionOptions(
  parsed: ParsedArgs,
  targetRoot: string,
): GenerationExecutionOptions {
  return {
    dryRun: hasFlag(parsed, "dry-run"),
    projectName: readSingleFlag(parsed, "project-name"),
    targetRoot,
    themeMode: normalizeThemeMode(readSingleFlag(parsed, "theme-mode")),
  };
}

function createGenerationInput(options: {
  catalogConfigPath?: string;
  catalogWorkspaceId?: string;
  framework: FrameworkAdapterId;
  intent: GenerationInput["intent"];
  modules: string[];
  moduleRegistryIds?: string[];
  packId: PackId;
  packRegistryId?: string;
  planId: PlanId;
  templates: string[];
  templateRegistryIds?: string[];
}): GenerationInput {
  return defineGenerationInput({
    catalogConfigPath: options.catalogConfigPath,
    catalogWorkspaceId: options.catalogWorkspaceId,
    framework: options.framework,
    intent: options.intent,
    packId: options.packId,
    packRegistryId: options.packRegistryId,
    planId: options.planId,
    templates: options.templates,
    modules: options.modules,
    templateRegistryIds: options.templateRegistryIds,
    moduleRegistryIds: options.moduleRegistryIds,
  });
}

async function pathExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function detectFramework(targetRoot: string) {
  if (
    (await pathExists(resolve(targetRoot, "Components/App.razor"))) ||
    (await hasCsproj(targetRoot))
  ) {
    return "blazor-wc" satisfies FrameworkAdapterId;
  }

  if (
    (await pathExists(resolve(targetRoot, "app/layout.tsx"))) ||
    (await pathExists(resolve(targetRoot, "app/page.tsx")))
  ) {
    return "next-app-router" satisfies FrameworkAdapterId;
  }

  if (await pathExists(resolve(targetRoot, "src/main.tsx"))) {
    return "react-vite" satisfies FrameworkAdapterId;
  }

  if (await pathExists(resolve(targetRoot, "src/main.ts"))) {
    return "wc-universal" satisfies FrameworkAdapterId;
  }

  return undefined;
}

async function hasCsproj(targetRoot: string) {
  const entries = await readdir(targetRoot, {
    recursive: false,
    withFileTypes: true,
  });

  return entries.some(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".csproj"),
  );
}

async function promptForValue(options: {
  available?: string[];
  defaultValue?: string;
  enabled: boolean;
  label: string;
}) {
  if (!options.enabled) {
    return undefined;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const suffix =
    options.available && options.available.length > 0
      ? ` (${options.available.join(", ")})`
      : "";
  const defaultText = options.defaultValue ? ` [${options.defaultValue}]` : "";

  try {
    const answer = await rl.question(
      `${options.label}${suffix}${defaultText}: `,
    );
    return answer.trim() || options.defaultValue;
  } finally {
    rl.close();
  }
}

async function resolveFramework(
  parsed: ParsedArgs,
  command: string,
  targetRoot: string,
) {
  const explicit = normalizeFramework(readSingleFlag(parsed, "framework"));

  if (explicit) {
    return explicit;
  }

  if (command === "init") {
    const prompted = normalizeFramework(
      await promptForValue({
        available: [...FRAMEWORK_ADAPTER_IDS],
        defaultValue: DEFAULT_FRAMEWORK,
        enabled:
          process.stdin.isTTY &&
          process.stdout.isTTY &&
          !hasFlag(parsed, "json"),
        label: "Framework",
      }),
    );

    return prompted ?? DEFAULT_FRAMEWORK;
  }

  const detected = await detectFramework(targetRoot);

  if (detected) {
    return detected;
  }

  const prompted = normalizeFramework(
    await promptForValue({
      available: [...FRAMEWORK_ADAPTER_IDS],
      defaultValue: undefined,
      enabled:
        process.stdin.isTTY && process.stdout.isTTY && !hasFlag(parsed, "json"),
      label: "Framework",
    }),
  );

  if (prompted) {
    return prompted;
  }

  throw new Error(
    'Could not detect the framework for this project. Pass "--framework=react-vite", "--framework=next-app-router", "--framework=wc-universal", or "--framework=blazor-wc".',
  );
}

async function resolvePrimarySelection(
  parsed: ParsedArgs,
  options: {
    command: "add-module" | "add-pack" | "add-template";
    defaultValue?: string;
    kind: "module" | "pack" | "template";
  },
) {
  const explicit =
    parsed.positionals[0] ??
    readRegistryIdsForKind(parsed, options.kind)[0] ??
    readSingleFlag(
      parsed,
      options.kind,
      `${options.kind}s`,
      options.command === "add-template" ? "template" : options.kind,
    );

  if (explicit) {
    return explicit;
  }

  return promptForValue({
    available:
      options.kind === "pack"
        ? options.defaultValue
          ? [options.defaultValue]
          : undefined
        : undefined,
    defaultValue: options.defaultValue,
    enabled:
      process.stdin.isTTY && process.stdout.isTTY && !hasFlag(parsed, "json"),
    label:
      options.kind === "pack"
        ? "Pack"
        : options.kind === "module"
          ? "Module"
          : "Template",
  });
}

function buildCommandHelp(
  bridge: ReturnType<typeof registryBridge>,
  options?: RegistryBridgeOptions,
) {
  return {
    availableCommands: [
      "init",
      "catalog",
      "add-template",
      "add-component",
      "add-module",
      "add-pack",
      "policy",
      "theme",
      "doctor",
    ],
    packs: bridge.list("pack", options),
    templates: bridge.list("template", options).slice(0, 12),
    modules: bridge.list("module", options),
  };
}

export async function runCommand(
  argv: string[],
  deps: CommandDependencies,
): Promise<CommandRunResult> {
  const parsed = parseArgs(argv);
  const targetRoot = resolve(readSingleFlag(parsed, "cwd") ?? process.cwd());
  const writeJson = hasFlag(parsed, "json");
  const showDiff = hasFlag(parsed, "diff");
  const registryOptions = resolveRegistryOptions(parsed);

  try {
    switch (parsed.command) {
      case "catalog": {
        const action = parsed.positionals[0] ?? "list";

        if (action === "validate") {
          return {
            exitCode: 0,
            showDiff,
            value: deps.registry.validateConfig(registryOptions),
            writeJson,
          };
        }

        const catalog = deps.registry.catalog(registryOptions);

        if (action === "show") {
          const registryId =
            parsed.positionals[1] ?? readSingleFlag(parsed, "id");

          if (!registryId) {
            throw new Error('Pass a registry id to "catalog show".');
          }

          const item =
            deps.registry.find("pack", registryId, registryOptions) ??
            deps.registry.find("template", registryId, registryOptions) ??
            deps.registry.find("module", registryId, registryOptions) ??
            catalog.itemsById[registryId];

          if (!item) {
            throw new Error(`Unknown catalog item "${registryId}".`);
          }

          return {
            exitCode: 0,
            showDiff,
            value: item,
            writeJson,
          };
        }

        const kind = readSingleFlag(parsed, "kind");
        const filteredItems = kind
          ? catalog.items.filter((item) => item.kind === kind)
          : catalog.items;

        return {
          exitCode: 0,
          showDiff,
          value: {
            sources: catalog.sources,
            warnings: catalog.warnings,
            items: filteredItems.map((item) => ({
              registryId: item.registryId,
              kind: item.kind,
              title: item.title,
              namespace: item.namespace,
              supportLevel: item.supportLevel,
              trustLevel: item.trustLevel,
              stability: item.stability,
              installable: item.installability.installable,
            })),
          },
          writeJson,
        };
      }
      case "policy": {
        const action = parsed.positionals[0] ?? "check";

        if (action !== "check") {
          throw new Error(`Unknown policy action "${action}".`);
        }

        const validated = deps.registry.validateConfig(
          registryOptions,
        );
        const selectedRegistryIds = readListFlag(parsed, "id", "ids");

        return {
          exitCode: 0,
          showDiff,
          value: evaluateCatalogPolicies({
            catalog: validated.catalog,
            policies: validated.config.policies,
            selectedRegistryIds:
              selectedRegistryIds.length > 0 ? selectedRegistryIds : undefined,
          }),
          writeJson,
        };
      }
      case "init": {
        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );
        const templateSelection = resolveTemplateSelection(
          deps.registry,
          [
            ...readListFlag(parsed, "template", "templates"),
            ...readRegistryIdsForKind(parsed, "template"),
          ],
          registryOptions,
        );
        const moduleSelection = resolveModuleSelection(
          deps.registry,
          [
            ...readListFlag(parsed, "module", "modules"),
            ...readRegistryIdsForKind(parsed, "module"),
          ],
          registryOptions,
        );
        const rawPackSelection =
          readSingleFlag(parsed, "pack") ?? readRegistryIdsForKind(parsed, "pack")[0];
        const packSelection = resolvePackSelection(
          deps.registry,
          rawPackSelection,
          registryOptions,
        );
        const input = createGenerationInput({
          catalogConfigPath: registryOptions.catalogConfigPath,
          catalogWorkspaceId: registryOptions.workspaceId,
          framework,
          intent: "new-project",
          modules: moduleSelection.modules,
          moduleRegistryIds: moduleSelection.moduleRegistryIds,
          packId: packSelection.packId,
          packRegistryId:
            rawPackSelection?.includes("::pack::")
              ? packSelection.packRegistryId
              : undefined,
          planId: resolvePlanId(parsed),
          templates: templateSelection.templates,
          templateRegistryIds: templateSelection.templateRegistryIds,
        });

        return {
          exitCode: 0,
          showDiff,
          value: await deps.generateStarter(
            input,
            createExecutionOptions(parsed, targetRoot),
          ),
          writeJson,
        };
      }
      case "add-template": {
        const primarySelection = await resolvePrimarySelection(parsed, {
          command: "add-template",
          defaultValue: "dashboard-home",
          kind: "template",
        });
        const templateSelection = resolveTemplateSelection(
          deps.registry,
          primarySelection
            ? [
                primarySelection,
                ...readListFlag(parsed, "template", "templates"),
                ...readRegistryIdsForKind(parsed, "template"),
              ]
            : [
                ...readListFlag(parsed, "template", "templates"),
                ...readRegistryIdsForKind(parsed, "template"),
              ],
          registryOptions,
        );

        if (
          templateSelection.templates.length === 0 &&
          templateSelection.templateRegistryIds.length === 0
        ) {
          throw new Error(
            "At least one template is required for add-template.",
          );
        }

        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );
        const packSelection = resolvePackSelection(
          deps.registry,
          readSingleFlag(parsed, "pack"),
          registryOptions,
        );
        const input = createGenerationInput({
          catalogConfigPath: registryOptions.catalogConfigPath,
          catalogWorkspaceId: registryOptions.workspaceId,
          framework,
          intent: "existing-project",
          modules: [],
          packId: packSelection.packId,
          planId: resolvePlanId(parsed),
          templates: templateSelection.templates,
          templateRegistryIds: templateSelection.templateRegistryIds,
        });

        return {
          exitCode: 0,
          showDiff,
          value: await deps.generatePatch(
            input,
            createExecutionOptions(parsed, targetRoot),
          ),
          writeJson,
        };
      }
      case "add-module": {
        const primarySelection = await resolvePrimarySelection(parsed, {
          command: "add-module",
          defaultValue: "datatable",
          kind: "module",
        });
        const moduleSelection = resolveModuleSelection(
          deps.registry,
          primarySelection
            ? [
                primarySelection,
                ...readListFlag(parsed, "module", "modules"),
                ...readRegistryIdsForKind(parsed, "module"),
              ]
            : [
                ...readListFlag(parsed, "module", "modules"),
                ...readRegistryIdsForKind(parsed, "module"),
              ],
          registryOptions,
        );

        if (
          moduleSelection.modules.length === 0 &&
          moduleSelection.moduleRegistryIds.length === 0
        ) {
          throw new Error("At least one module is required for add-module.");
        }

        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );
        const packSelection = resolvePackSelection(
          deps.registry,
          readSingleFlag(parsed, "pack"),
          registryOptions,
        );
        const input = createGenerationInput({
          catalogConfigPath: registryOptions.catalogConfigPath,
          catalogWorkspaceId: registryOptions.workspaceId,
          framework,
          intent: "existing-project",
          modules: moduleSelection.modules,
          moduleRegistryIds: moduleSelection.moduleRegistryIds,
          packId: packSelection.packId,
          planId: resolvePlanId(parsed),
          templates: [],
        });

        return {
          exitCode: 0,
          showDiff,
          value: await deps.generatePatch(
            input,
            createExecutionOptions(parsed, targetRoot),
          ),
          writeJson,
        };
      }
      case "add-pack": {
        const primarySelection = await resolvePrimarySelection(parsed, {
          command: "add-pack",
          defaultValue: DEFAULT_PACK,
          kind: "pack",
        });
        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );
        const packSelection = resolvePackSelection(
          deps.registry,
          primarySelection,
          registryOptions,
        );
        const input = createGenerationInput({
          catalogConfigPath: registryOptions.catalogConfigPath,
          catalogWorkspaceId: registryOptions.workspaceId,
          framework,
          intent: "existing-project",
          modules: [],
          packId: packSelection.packId,
          packRegistryId:
            primarySelection?.includes("::") ?? false
              ? packSelection.packRegistryId
              : undefined,
          planId: resolvePlanId(parsed),
          templates: [],
        });

        return {
          exitCode: 0,
          showDiff,
          value: await deps.generatePatch(
            input,
            createExecutionOptions(parsed, targetRoot),
          ),
          writeJson,
        };
      }
      case "theme": {
        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );

        return {
          exitCode: 0,
          showDiff,
          value: await deps.generateThemeOnly(
            {
              framework,
              packId: resolvePackSelection(
                deps.registry,
                readSingleFlag(parsed, "pack"),
                registryOptions,
              ).packId,
              planId: resolvePlanId(parsed),
            },
            createExecutionOptions(parsed, targetRoot),
          ),
          writeJson,
        };
      }
      case "doctor": {
        const framework = await resolveFramework(
          parsed,
          parsed.command,
          targetRoot,
        );

        return {
          exitCode: 0,
          showDiff,
          value: await deps.doctorProject({
            framework,
            targetRoot,
          }),
          writeJson,
        };
      }
      case "add-component":
        return {
          exitCode: 1,
          showDiff,
          value: {
            ...buildCommandHelp(deps.registry, registryOptions),
            message:
              '"add-component" is intentionally blocked until registry component installs are backed by real generator output. Use "add-template", "add-module", "add-pack", "theme", or "doctor" for Phase 1 workflows.',
          },
          writeJson,
        };
      default:
        return {
          exitCode: 1,
          showDiff,
          value: {
            ...buildCommandHelp(deps.registry, registryOptions),
            message: `Unknown command: ${parsed.command}`,
          },
          writeJson,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      exitCode: 1,
      showDiff,
      value: {
        command: parsed.command,
        message,
        targetRoot,
      },
      writeJson,
    };
  }
}

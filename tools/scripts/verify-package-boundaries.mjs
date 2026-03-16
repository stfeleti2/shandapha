import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function collectFiles(base, predicate) {
  const files = [];

  async function walk(current) {
    let entries;

    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".turbo" ||
        entry.name === "dist"
      ) {
        continue;
      }

      const fullPath = join(current, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && predicate(entry.name, fullPath)) {
        files.push(fullPath);
      }
    }
  }

  await walk(base);
  return files;
}

function collectImports(source) {
  const imports = new Set();
  const patterns = [
    /from\s+["']([^"']+)["']/g,
    /import\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    match = pattern.exec(source);
    while (match !== null) {
      imports.add(match[1]);
      match = pattern.exec(source);
    }
  }

  return [...imports];
}

const packageFiles = [
  ...(await collectFiles("apps", (name) => name === "package.json")),
  ...(await collectFiles("services", (name) => name === "package.json")),
  ...(await collectFiles("packages", (name) => name === "package.json")),
  ...(await collectFiles("examples", (name) => name === "package.json")),
];

for (const file of packageFiles) {
  const data = JSON.parse(await readFile(file, "utf8"));
  const dependencies = Object.keys(data.dependencies ?? {});

  if (
    dependencies.some(
      (dep) =>
        dep.startsWith("@shandapha/web") || dep.startsWith("@shandapha/studio"),
    )
  ) {
    throw new Error(
      `Package boundary violation in ${file}: packages cannot depend on app packages.`,
    );
  }
}

const sourceFiles = [
  ...(await collectFiles("packages", (name) =>
    /\.(ts|tsx|js|mjs)$/.test(name),
  )),
  ...(await collectFiles("apps", (name) => /\.(ts|tsx|js|mjs)$/.test(name))),
  ...(await collectFiles("services", (name) =>
    /\.(ts|tsx|js|mjs)$/.test(name),
  )),
];

const importRules = [
  {
    label: "core cannot import advanced modules or heavy optional data libs",
    matches: (file) => file.startsWith("packages/core/src/"),
    forbidden: [
      /^@shandapha\/module-/,
      /^@shandapha\/business$/,
      /^@shandapha\/sdk$/,
      /^@shandapha\/platform-api$/,
      /^@tanstack\/react-table$/,
      /^react-resizable-panels$/,
      /^recharts$/,
    ],
  },
  {
    label: "runtime cannot import UI or adapter packages",
    matches: (file) => file.startsWith("packages/runtime/src/"),
    forbidden: [
      /^@shandapha\/core$/,
      /^@shandapha\/react$/,
      /^@shandapha\/layouts$/,
      /^@shandapha\/wc$/,
      /^@shandapha\/module-/,
      /^react$/,
      /^radix-ui$/,
    ],
  },
  {
    label: "wc cannot depend on React adapters",
    matches: (file) => file.startsWith("packages/wc/src/"),
    forbidden: [/^react$/, /^@shandapha\/react$/],
  },
  {
    label: "free critical path cannot depend on business or billing surfaces",
    matches: (file) =>
      /^(packages\/(core|runtime|wc|layouts|packs|tokens|templates|generator|cli)\/src\/)/.test(
        file,
      ),
    forbidden: [/^@shandapha\/business$/, /^@shandapha\/sdk$/, /stripe/i],
  },
];

const templateRules = [
  {
    label: "templates cannot bypass layout primitives with raw Tailwind grids",
    matches: (file) =>
      file.startsWith("packages/templates/catalog/") &&
      /\.(ts|tsx|html|razor)$/.test(file),
    forbidden: [/grid-cols-/, /display:\s*grid/i],
  },
];

const violations = [];

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  const imports = collectImports(source);

  for (const rule of importRules) {
    if (!rule.matches(file)) {
      continue;
    }

    for (const entry of imports) {
      if (rule.forbidden.some((pattern) => pattern.test(entry))) {
        violations.push(`${file}: ${rule.label} (${entry})`);
      }
    }
  }

  for (const rule of templateRules) {
    if (!rule.matches(file)) {
      continue;
    }

    for (const pattern of rule.forbidden) {
      if (pattern.test(source)) {
        violations.push(`${file}: ${rule.label}`);
        break;
      }
    }
  }
}

if (violations.length > 0) {
  throw new Error(
    `Package boundary violations found:\n- ${violations.join("\n- ")}`,
  );
}

console.log("Package boundaries verified.");

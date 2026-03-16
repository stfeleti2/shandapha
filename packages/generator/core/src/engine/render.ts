import { relative } from "node:path";
import type {
  FrameworkAdapterId,
  GenerationPlan,
  ThemeMode,
} from "@shandapha/contracts";
import type { TokenSet } from "@shandapha/tokens";

function toKebabCase(value: string) {
  return value
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/(\d+)/g, "-$1");
}

export function renderThemeCss(
  cssVariables: Record<string, string>,
  tokens: TokenSet,
) {
  const variableLines = Object.entries(cssVariables)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  const semanticKeys = Object.keys(tokens.light);
  const lightMappings = semanticKeys
    .map(
      (key) =>
        `  --color-${toKebabCase(key)}: var(--sh-${toKebabCase(key)}-light);`,
    )
    .join("\n");
  const darkMappings = semanticKeys
    .map(
      (key) =>
        `  --color-${toKebabCase(key)}: var(--sh-${toKebabCase(key)}-dark);`,
    )
    .join("\n");

  return [
    ":root {",
    variableLines,
    lightMappings,
    "  color-scheme: light;",
    "  font-family: var(--sh-font-body);",
    "}",
    "",
    '.dark, [data-theme-mode="dark"] {',
    darkMappings,
    "  color-scheme: dark;",
    "}",
    "",
    "html, body {",
    "  margin: 0;",
    "  min-height: 100%;",
    "  background: var(--color-background);",
    "  color: var(--color-foreground);",
    "  font-family: var(--sh-font-body);",
    "}",
    "",
    "body {",
    "  padding: 24px;",
    "}",
    "",
    "main {",
    "  max-width: 1120px;",
    "  margin: 0 auto;",
    "}",
    "",
    ".sh-shell {",
    "  display: grid;",
    "  gap: 24px;",
    "}",
    "",
    ".sh-card {",
    "  border: 1px solid var(--color-border);",
    "  border-radius: var(--sh-radius-lg);",
    "  background: var(--color-card);",
    "  color: var(--color-card-foreground);",
    "  padding: 24px;",
    "}",
    "",
    "a {",
    "  color: inherit;",
    "}",
    "",
    "button, a, input, select, textarea {",
    "  font: inherit;",
    "}",
    "",
    "*:focus-visible {",
    "  outline: 2px solid var(--color-ring);",
    "  outline-offset: 2px;",
    "}",
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "  *, *::before, *::after {",
    "    animation-duration: 0ms !important;",
    "    transition-duration: 0ms !important;",
    "    scroll-behavior: auto !important;",
    "  }",
    "}",
    "",
  ].join("\n");
}

export function renderThemeGalleryHtml(options: {
  packName: string;
  projectName: string;
  templateSlugs: string[];
  themeMode: ThemeMode;
}) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${options.projectName} theme preview</title>`,
    '    <link rel="stylesheet" href="./theme.css" />',
    "  </head>",
    `  <body data-theme-mode="${options.themeMode === "system" ? "light" : options.themeMode}">`,
    '    <main class="sh-shell">',
    '      <section class="sh-card">',
    `        <h1>${options.projectName}</h1>`,
    `        <p>Pack: ${options.packName}</p>`,
    `        <p>Templates: ${options.templateSlugs.join(", ") || "theme-only"}</p>`,
    "      </section>",
    '      <section class="sh-card">',
    "        <h2>Sample controls</h2>",
    '        <p><button type="button">Primary action</button></p>',
    '        <p><a href="#preview">Focusable link</a></p>',
    '        <p><input aria-label="Sample input" placeholder="Shandapha" /></p>',
    "      </section>",
    "    </main>",
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function renderReactVitePackageJson(projectName: string) {
  return JSON.stringify(
    {
      name: projectName,
      private: true,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.2.4",
        "react-dom": "^19.2.4",
      },
      devDependencies: {
        typescript: "^5.9.3",
        vite: "^7.3.1",
      },
    },
    null,
    2,
  );
}

export function renderNextPackageJson(projectName: string) {
  return JSON.stringify(
    {
      name: projectName,
      private: true,
      version: "0.1.0",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "^16.1.6",
        react: "^19.2.4",
        "react-dom": "^19.2.4",
      },
      devDependencies: {
        typescript: "^5.9.3",
      },
    },
    null,
    2,
  );
}

export function renderVanillaPackageJson(projectName: string) {
  return JSON.stringify(
    {
      name: projectName,
      private: true,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      devDependencies: {
        typescript: "^5.9.3",
        vite: "^7.3.1",
      },
    },
    null,
    2,
  );
}

export function renderBaseTsconfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        resolveJsonModule: true,
      },
      include: ["src/**/*", "app/**/*"],
    },
    null,
    2,
  );
}

export function renderNextTsconfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        resolveJsonModule: true,
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        incremental: true,
        esModuleInterop: true,
        isolatedModules: true,
        plugins: [{ name: "next" }],
      },
      include: [
        "src/**/*",
        "app/**/*",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts",
      ],
      exclude: ["node_modules"],
    },
    null,
    2,
  );
}

export function renderReactViteIndexHtml(projectName: string) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${projectName}</title>`,
    "  </head>",
    "  <body>",
    '    <div id="root"></div>',
    '    <script type="module" src="/src/main.tsx"></script>',
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function renderReactViteMain() {
  return [
    'import { StrictMode } from "react";',
    'import { createRoot } from "react-dom/client";',
    'import App from "./App";',
    'import "./theme.css";',
    "",
    'const root = document.getElementById("root");',
    "",
    "if (!root) {",
    '  throw new Error("Missing #root mount.");',
    "}",
    "",
    "createRoot(root).render(",
    "  <StrictMode>",
    "    <App />",
    "  </StrictMode>,",
    ");",
    "",
  ].join("\n");
}

export function renderReactViteApp(
  generatedFiles: Array<{ path: string; slug: string }>,
  verificationPath: string,
) {
  const imports = generatedFiles
    .map((file, index) => {
      const importPath = relativeImport("src/App.tsx", file.path);
      return `import Template${index + 1} from "${importPath}";`;
    })
    .join("\n");
  const sections = generatedFiles
    .map((file, index) =>
      [
        '      <section className="sh-card">',
        `        <h2>${file.slug}</h2>`,
        `        <Template${index + 1} />`,
        "      </section>",
      ].join("\n"),
    )
    .join("\n");

  return [
    imports,
    `import VerificationPage from "${relativeImport("src/App.tsx", verificationPath)}";`,
    "",
    "export default function App() {",
    "  return (",
    '    <main className="sh-shell">',
    '      <section className="sh-card">',
    "        <h1>Shandapha starter</h1>",
    "        <p>Generated from the shared template asset catalog.</p>",
    "      </section>",
    sections,
    '      <section className="sh-card">',
    "        <VerificationPage />",
    "      </section>",
    "    </main>",
    "  );",
    "}",
    "",
  ].join("\n");
}

export function renderNextLayout(projectName: string) {
  return [
    'import "./theme.css";',
    'import type { ReactNode } from "react";',
    "",
    "export default function RootLayout(props: { children: ReactNode }) {",
    "  return (",
    '    <html lang="en">',
    "      <body>",
    "        {props.children}",
    "      </body>",
    "    </html>",
    "  );",
    "}",
    "",
    `export const metadata = { title: "${projectName}" };`,
    "",
  ].join("\n");
}

export function renderNextHomePage(
  templateSlugs: string[],
  verificationPath: string,
) {
  return [
    "export default function HomePage() {",
    "  return (",
    '    <main className="sh-shell">',
    '      <section className="sh-card">',
    "        <h1>Shandapha starter</h1>",
    "        <ul>",
    ...templateSlugs.map(
      (slug) => `          <li><a href="/generated/${slug}">${slug}</a></li>`,
    ),
    `          <li><a href="/${verificationPath.replace(/^app\//, "").replace(/\/page\.tsx$/, "")}">verification</a></li>`,
    "        </ul>",
    "      </section>",
    "    </main>",
    "  );",
    "}",
    "",
  ].join("\n");
}

export function renderWcIndexHtml(projectName: string) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${projectName}</title>`,
    '    <link rel="stylesheet" href="/src/theme/theme.css" />',
    "  </head>",
    "  <body>",
    '    <main id="app" class="sh-shell"></main>',
    '    <script type="module" src="/src/main.ts"></script>',
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function renderWcMain(
  templateImports: Array<{ exportName: string; path: string; slug: string }>,
  verificationPath: string,
) {
  const imports = templateImports
    .map((template) => {
      const importPath = relativeImport("src/main.ts", template.path);
      return `import { ${template.exportName} } from "${importPath}";`;
    })
    .join("\n");
  const wrappers = templateImports
    .map((template, index) =>
      [
        `  const section${index + 1} = document.createElement("section");`,
        `  section${index + 1}.className = "sh-card";`,
        `  app.appendChild(section${index + 1});`,
        `  ${template.exportName}(section${index + 1});`,
      ].join("\n"),
    )
    .join("\n\n");

  return [
    imports,
    `import { renderVerificationPanel } from "${relativeImport("src/main.ts", verificationPath)}";`,
    "",
    'const app = document.getElementById("app");',
    "",
    "if (!app) {",
    '  throw new Error("Missing #app mount.");',
    "}",
    "",
    "app.innerHTML = '<section class=\"sh-card\"><h1>Shandapha starter</h1><p>Generated from the shared template asset catalog.</p></section>';",
    wrappers,
    "",
    'const verification = document.createElement("section");',
    'verification.className = "sh-card";',
    "app.appendChild(verification);",
    "renderVerificationPanel(verification);",
    "",
  ].join("\n");
}

export function renderBlazorProject(_projectName: string) {
  return [
    '<Project Sdk="Microsoft.NET.Sdk.Web">',
    "  <PropertyGroup>",
    "    <TargetFramework>net9.0</TargetFramework>",
    "    <Nullable>enable</Nullable>",
    "    <ImplicitUsings>enable</ImplicitUsings>",
    "    <RootNamespace>Shandapha.Generated</RootNamespace>",
    "  </PropertyGroup>",
    "</Project>",
    "",
  ].join("\n");
}

export function renderBlazorProgram() {
  return [
    "var builder = WebApplication.CreateBuilder(args);",
    "var app = builder.Build();",
    "",
    'app.MapFallbackToFile("index.html");',
    "app.Run();",
    "",
  ].join("\n");
}

export function renderBlazorApp(projectName: string) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${projectName}</title>`,
    '    <link rel="stylesheet" href="theme/theme.css" />',
    "  </head>",
    "  <body>",
    '    <main class="sh-shell">',
    '      <component type="typeof(App)" render-mode="Static" />',
    "    </main>",
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

export function renderBlazorRoot(
  generatedFiles: Array<{ path: string; slug: string }>,
  verificationPath: string,
) {
  return [
    '@page "/"',
    "",
    '<section class="sh-card">',
    "  <h1>Shandapha starter</h1>",
    "  <ul>",
    ...generatedFiles.map(
      (file) => `    <li><a href="/${file.slug}">${file.slug}</a></li>`,
    ),
    `    <li><a href="/${verificationPath.replace(/^Components\//, "").replace(/\.razor$/, "")}">verification</a></li>`,
    "  </ul>",
    "</section>",
    "",
  ].join("\n");
}

export function renderVerificationFile(
  framework: FrameworkAdapterId,
  plan: GenerationPlan,
) {
  const summary = plan.selectedTemplates
    .map((template) => template.slug)
    .join(", ");

  if (framework === "next-app-router") {
    return [
      "export default function VerificationPage() {",
      "  return (",
      '    <main className="sh-card">',
      "      <h1>Verification</h1>",
      `      <p>Templates installed: ${summary || "none"}</p>`,
      "    </main>",
      "  );",
      "}",
      "",
    ].join("\n");
  }

  if (framework === "blazor-wc") {
    return [
      '@page "/generated/verification"',
      "",
      '<section class="sh-card">',
      "  <h1>Verification</h1>",
      `  <p>Templates installed: ${summary || "none"}</p>`,
      "</section>",
      "",
    ].join("\n");
  }

  if (framework === "wc-universal") {
    return [
      "export function renderVerificationPanel(target: HTMLElement) {",
      `  target.innerHTML = '<h1>Verification</h1><p>Templates installed: ${summary || "none"}</p>';`,
      "}",
      "",
    ].join("\n");
  }

  return [
    "export default function VerificationPage() {",
    "  return (",
    "    <>",
    "      <h1>Verification</h1>",
    `      <p>Templates installed: ${summary || "none"}</p>`,
    "    </>",
    "  );",
    "}",
    "",
  ].join("\n");
}

function relativeImport(fromPath: string, toPath: string) {
  const resolved = relative(fromPath.replace(/[^/]+$/, ""), toPath)
    .replace(/\\/g, "/")
    .replace(/\.(tsx|ts|razor)$/, "");

  return resolved.startsWith(".") ? resolved : `./${resolved}`;
}

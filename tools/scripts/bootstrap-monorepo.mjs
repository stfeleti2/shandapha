#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..");

const versions = {
  biome: "^2.4.6",
  changesets: "^2.30.0",
  next: "^16.1.6",
  playwright: "^1.58.2",
  react: "^19.2.4",
  reactDom: "^19.2.4",
  tsx: "^4.21.0",
  turbo: "^2.8.16",
  typesNode: "^25.5.0",
  typesReact: "^19.2.14",
  typesReactDom: "^19.2.3",
  typescript: "^5.9.3",
  vitest: "^4.1.0",
};

const packCatalog = [
  {
    id: "normal",
    slug: "normal",
    name: "Normal",
    tier: "free",
    tagline:
      "Clean depth, calm surfaces, and a premium default that stays trusted.",
    description:
      "Normal is the default premium baseline for teams that want semantic tokens, balanced contrast, and minimal visual noise.",
    knobs: ["contrast-safe palette", "steady motion", "balanced radii"],
  },
  {
    id: "glass",
    slug: "glass",
    name: "Glass",
    tier: "premium",
    tagline:
      "Translucent layers, softer edges, and tasteful motion that stays opt-in.",
    description:
      "Glass layers blur, translucency, and subtle sheen on top of the same component contracts without forking the runtime.",
    knobs: ["frost intensity", "shadow softness", "sheen level"],
  },
  {
    id: "neon",
    slug: "neon",
    name: "Neon",
    tier: "premium",
    tagline:
      "High-energy accents, editorial type contrast, and bold presentation.",
    description:
      "Neon pushes the token system toward expressive product launches and dashboards while preserving accessibility and reduced-motion fallbacks.",
    knobs: ["glow strength", "headline contrast", "accent saturation"],
  },
];

const templateGroups = {
  shells: ["AdminShell", "MarketingShell", "DocsShell"],
  blocks: [
    "hero",
    "pricing",
    "faq",
    "testimonials",
    "logos",
    "stats",
    "footer",
  ],
  saas: [
    "dashboard-home",
    "list-filters",
    "detail-tabs-timeline",
    "form-create-edit",
    "settings-sectioned",
    "team-roles-starter",
    "billing-plans-starter",
    "onboarding-3-step",
    "auth/sign-in",
    "auth/sign-up",
    "auth/forgot",
    "auth/reset",
  ],
  marketing: [
    "landing-section-based",
    "pricing-basic",
    "faq",
    "contact",
    "legal-layout",
  ],
  docs: [
    "docs-home",
    "docs-article",
    "blog-index",
    "blog-article",
    "changelog",
  ],
};

const templateCatalog = [
  {
    slug: "dashboard-home",
    name: "Dashboard Home",
    group: "saas",
    summary: "Overview shell with KPI rails, activity cards, and action slots.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["executive", "ops", "support"],
  },
  {
    slug: "list-filters",
    name: "List Filters",
    group: "saas",
    summary:
      "Index page with dense filters, table slot, and saved-view affordances.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["simple", "advanced"],
  },
  {
    slug: "detail-tabs-timeline",
    name: "Detail Tabs Timeline",
    group: "saas",
    summary: "Entity detail screen with tabs, timeline, and related activity.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["client-service", "b2b account"],
  },
  {
    slug: "form-create-edit",
    name: "Form Create Edit",
    group: "saas",
    summary: "Structured create/edit flows with helper copy and action rails.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["single column", "sectioned"],
  },
  {
    slug: "settings-sectioned",
    name: "Settings Sectioned",
    group: "saas",
    summary: "Settings shell with grouped controls and policy messaging.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["workspace", "account"],
  },
  {
    slug: "team-roles-starter",
    name: "Team Roles Starter",
    group: "saas",
    summary: "Membership management starter with roles, invites, and states.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["internal team", "customer admin"],
  },
  {
    slug: "billing-plans-starter",
    name: "Billing Plans Starter",
    group: "saas",
    summary:
      "Pricing and usage starter with entitlements framing and trust copy.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["founder", "enterprise"],
  },
  {
    slug: "onboarding-3-step",
    name: "Onboarding 3 Step",
    group: "saas",
    summary: "Three-step activation flow that leads into the wizard or export.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["self-serve", "team"],
  },
  {
    slug: "auth/sign-in",
    name: "Auth Sign In",
    group: "saas",
    summary:
      "Sign in screen with trust copy, social placeholders, and help states.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["email-first"],
  },
  {
    slug: "auth/sign-up",
    name: "Auth Sign Up",
    group: "saas",
    summary: "Sign up flow with value framing and workspace defaults.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["invite", "self-serve"],
  },
  {
    slug: "auth/forgot",
    name: "Auth Forgot Password",
    group: "saas",
    summary: "Recovery flow with email feedback and reassurance copy.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["email-only"],
  },
  {
    slug: "auth/reset",
    name: "Auth Reset Password",
    group: "saas",
    summary: "Reset form with inline validation and success state.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["single-step"],
  },
  {
    slug: "landing-section-based",
    name: "Landing Section Based",
    group: "marketing",
    summary: "Modular marketing shell for hero-to-CTA launches.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["product launch", "enterprise"],
  },
  {
    slug: "pricing-basic",
    name: "Pricing Basic",
    group: "marketing",
    summary: "Simple pricing surface with trust copy and FAQ handoff.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["self-serve", "hybrid"],
  },
  {
    slug: "faq",
    name: "FAQ",
    group: "marketing",
    summary: "FAQ accordion with conversion support slots.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["product", "security"],
  },
  {
    slug: "contact",
    name: "Contact",
    group: "marketing",
    summary: "Contact page with sales paths and trust framing.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["sales", "support"],
  },
  {
    slug: "legal-layout",
    name: "Legal Layout",
    group: "marketing",
    summary: "Legal content layout with side navigation and trust accents.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["privacy", "terms", "security"],
  },
  {
    slug: "docs-home",
    name: "Docs Home",
    group: "docs",
    summary: "Documentation landing page with category rails and quickstarts.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["product", "developer"],
  },
  {
    slug: "docs-article",
    name: "Docs Article",
    group: "docs",
    summary: "Article layout with metadata, code samples, and sibling nav.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["api", "concept"],
  },
  {
    slug: "blog-index",
    name: "Blog Index",
    group: "docs",
    summary: "Journal index for product updates and launch stories.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["product", "culture"],
  },
  {
    slug: "blog-article",
    name: "Blog Article",
    group: "docs",
    summary: "Editorial article template with pull quotes and metadata.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["announcement", "essay"],
  },
  {
    slug: "changelog",
    name: "Changelog",
    group: "docs",
    summary:
      "Release note stream with upgrade guidance and issue tracking hooks.",
    states: ["loading", "empty", "error", "success", "no access"],
    variants: ["product", "package"],
  },
];

const moduleCatalog = [
  {
    id: "datatable",
    name: "Advanced DataTable",
    packageName: "@shandapha/module-datatable",
    description:
      "Client/server table workflows with saved views, pinning, resizing, and export.",
    premium: true,
  },
  {
    id: "charts",
    name: "Charts",
    packageName: "@shandapha/module-charts",
    description:
      "Scaffolded charting module seam for future opt-in visualizations.",
    premium: true,
  },
  {
    id: "richtext",
    name: "Rich Text",
    packageName: "@shandapha/module-richtext",
    description:
      "Scaffolded rich text editing seam for future content workflows.",
    premium: true,
  },
  {
    id: "seo",
    name: "SEO",
    packageName: "@shandapha/module-seo",
    description:
      "Scaffolded SEO helpers for metadata, sitemap, and schema support.",
    premium: false,
  },
];

const docsPages = {
  index: {
    title: "Docs home",
    category: "overview",
    body: "Start with the wizard, reuse the same generator core in the CLI, and adopt templates or packs without lock-in.",
  },
  "components/button": {
    title: "Button",
    category: "components",
    body: "Buttons stay semantic-token driven and keep focus rings visible across Normal, Glass, and Neon.",
  },
  "templates/dashboard-home": {
    title: "Dashboard home",
    category: "templates",
    body: "Dashboard Home is the reference SaaS overview template with all state variants and registry metadata.",
  },
  "packs/normal": {
    title: "Normal pack",
    category: "packs",
    body: "Normal is the trusted default: premium feel, low cognitive load, and no grid drift.",
  },
  "cli/init": {
    title: "CLI init",
    category: "cli",
    body: "The CLI mirrors the wizard. `shandapha init` and Studio both call the same generator planning functions.",
  },
};

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    summary:
      "Shippable baseline for founders and teams evaluating the platform.",
    includes: [
      "semantic tokens and theming",
      "accessibility behaviors",
      "core components",
      "basic templates",
      "basic table",
      "docs and playground",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49/mo",
    summary:
      "Faster shipping through polished packs, richer variants, and convenience flows.",
    includes: [
      "Glass and Neon packs",
      "advanced presets",
      "starter exports",
      "patch install recipes",
      "richer template bundles",
      "priority upgrades",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$299/mo",
    summary:
      "Enterprise boundaries without enterprise sprawl: governance, scale, and confidence.",
    includes: [
      "governance defaults",
      "policy reports",
      "token approvals",
      "advanced data workflows",
      "audit exports",
      "support and compliance guidance",
    ],
  },
];

const wizardSteps = [
  {
    id: "intent",
    route: "/wizard",
    title: "Intent",
    description: "Start new, patch an existing app, or preview only.",
  },
  {
    id: "framework",
    route: "/wizard/framework",
    title: "Framework",
    description: "React (Vite), Next.js, Web Components, or Blazor.",
  },
  {
    id: "product-type",
    route: "/wizard/product-type",
    title: "Product type",
    description: "SaaS dashboard, internal tool, marketing + docs, or mixed.",
  },
  {
    id: "style-pack",
    route: "/wizard/style-pack",
    title: "Style pack",
    description: "Normal, Glass, Neon, plus light/dark, density, and motion.",
  },
  {
    id: "brand-kit",
    route: "/wizard/brand-kit",
    title: "Brand kit",
    description:
      "Quick brand or import tokens, CSS vars, Tailwind, and future Figma tokens.",
  },
  {
    id: "pages",
    route: "/wizard/pages",
    title: "Pages",
    description:
      "Choose templates first: dashboard, list/detail, auth, docs, pricing, contact.",
  },
  {
    id: "features",
    route: "/wizard/features",
    title: "Features",
    description: "Basic table vs pro data workflows, upload, and SEO.",
  },
  {
    id: "export",
    route: "/wizard/export",
    title: "Export",
    description: "Starter zip, patch install, or theme-only.",
  },
  {
    id: "done",
    route: "/wizard/done",
    title: "Done",
    description: "Checklist, doctor results, and next actions.",
  },
];

const workspaceSections = [
  "overview",
  "themes",
  "templates",
  "exports",
  "billing",
  "usage",
  "members",
  "api-keys",
  "policies",
  "audit",
];

const apiModules = [
  {
    id: "auth",
    summary: "Identity, session, and workspace membership handoff.",
  },
  {
    id: "workspaces",
    summary: "Workspace lifecycle, saved themes, exports, and members.",
  },
  {
    id: "billing",
    summary:
      "Pricing, subscriptions, invoices, and founder-friendly upgrade moments.",
  },
  {
    id: "entitlements",
    summary: "Typed feature gating for free, premium, and business tiers.",
  },
  {
    id: "registry",
    summary: "Templates, packs, and modules for web, studio, CLI, and docs.",
  },
  {
    id: "exports",
    summary:
      "Starter zip, patch install, theme-only output, and uninstall manifests.",
  },
  {
    id: "audit",
    summary: "Audit timelines, policy surfaces, and retention seams.",
  },
  {
    id: "telemetry",
    summary: "Privacy-safe usage and doctor telemetry.",
  },
  {
    id: "notifications",
    summary: "Email, product notifications, and async export status.",
  },
];

function dedent(value) {
  const lines = value.replace(/^\n/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const depth = indents.length > 0 ? Math.min(...indents) : 0;
  return `${lines
    .map((line) => line.slice(depth))
    .join("\n")
    .replace(/\s+$/, "")}\n`;
}

function addFile(files, filePath, content) {
  files.push([filePath, dedent(content)]);
}

function addJson(files, filePath, data) {
  files.push([filePath, `${JSON.stringify(data, null, 2)}\n`]);
}

function tsconfig(extendsPath, extra = {}) {
  return `${JSON.stringify(
    {
      extends: extendsPath,
      compilerOptions: extra.compilerOptions ?? {},
      include: extra.include ?? ["src/**/*", "next-env.d.ts"],
      exclude: extra.exclude ?? ["node_modules"],
    },
    null,
    2,
  )}\n`;
}

function packageJson({
  name,
  description,
  privatePackage = true,
  scripts = {},
  dependencies = {},
  devDependencies = {},
  bin,
}) {
  return `${JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: privatePackage,
      type: "module",
      description,
      sideEffects: false,
      scripts,
      ...(bin ? { bin } : {}),
      dependencies,
      devDependencies,
      exports: privatePackage
        ? {
            ".": "./src/index.ts",
          }
        : undefined,
    },
    null,
    2,
  )}\n`;
}

function makeIndexRoute(routeId, libPath, fnName) {
  return dedent(`
    import { ${fnName} } from "${libPath}";

    export default function Page() {
      return ${fnName}("${routeId}");
    }
  `);
}

function routePathLabel(id) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderMonetizationMarkdown() {
  return dedent(`
    # Monetization

    Shandapha monetizes through ethical leverage, not fake blockers.

    ## Free
    ${pricingPlans[0].includes.map((item) => `- ${item}`).join("\n")}

    ## Premium
    ${pricingPlans[1].includes.map((item) => `- ${item}`).join("\n")}

    ## Business
    ${pricingPlans[2].includes.map((item) => `- ${item}`).join("\n")}
  `);
}

function renderTiersMarkdown() {
  return dedent(`
    # Tiers

    ${pricingPlans
      .map(
        (plan) => `## ${plan.name}

    - Price: ${plan.price}
    - Summary: ${plan.summary}
    - Includes:
    ${plan.includes.map((item) => `  - ${item}`).join("\n")}`,
      )
      .join("\n\n")}
  `);
}

async function main() {
  const files = [];

  const workspaceYaml = `
packages:
  - "apps/*"
  - "services/*"
  - "packages/*"
  - "packages/modules/*"
  - "examples/*"
`;

  const turboConfig = {
    $schema: "https://turbo.build/schema.json",
    tasks: {
      dev: {
        cache: false,
        persistent: true,
      },
      build: {
        dependsOn: ["^build"],
        outputs: [".next/**", "storybook-static/**", "coverage/**"],
      },
      typecheck: {
        dependsOn: ["^typecheck"],
        outputs: [],
      },
      lint: {
        dependsOn: ["^lint"],
        outputs: [],
      },
      test: {
        dependsOn: ["^test"],
        outputs: ["coverage/**"],
      },
    },
  };

  addFile(
    files,
    ".gitignore",
    `
      node_modules/
      .next/
      .turbo/
      coverage/
      dist/
      build/
      storybook-static/
      playwright-report/
      test-results/
      .source/
      .contentlayer/
      *.tsbuildinfo
      .DS_Store
    `,
  );

  addFile(
    files,
    "README.md",
    `
      # Shandapha

      Shandapha is a UI platform built around enterprise boundaries and founder economics:
      two apps, one modular API, and moat-heavy shared packages.

      ## Workspace shape

      - \`apps/web\`: marketing site, docs, catalog, playground, changelog
      - \`apps/studio\`: wizard, exports, workspaces, billing, usage, members
      - \`services/platform-api\`: modular monolith backend
      - \`packages/*\`: tokens, runtime, layouts, core, packs, templates, registry, generator, CLI, entitlements, business, SDK

      ## Quick start

      1. \`pnpm install\`
      2. \`pnpm dev\`
      3. Open \`http://localhost:3000\`, \`http://localhost:3001\`, and \`http://localhost:4000/health\`
    `,
  );

  addFile(
    files,
    "ARCHITECTURE.md",
    `
      # Architecture

      ## Decision

      Shandapha uses a modular monolith with two product-facing apps and one backend service.
      The moat stays in packages so the web site, studio, CLI, and future registry surfaces all share the same contracts.

      ## Why this shape

      - Founder economics: one API deploy, one auth model, one billing surface
      - Enterprise boundaries: internal domains stay isolated by module and package exports
      - Performance: tree-shakeable packages, lean runtime, heavy modules kept opt-in
      - Scale later: each backend domain can split only when heat justifies the operational cost

      ## Protected performance seams

      - Semantic tokens and CSS variables remain the runtime source of truth
      - Generator logic is centralized in \`packages/generator\`
      - The registry is data-first so website, studio, CLI, and docs stay in sync
      - Heavy capabilities live under \`packages/modules/*\` and are never forced into core
    `,
  );

  addFile(
    files,
    "PRINCIPLES.md",
    `
      # Principles

      - Enterprise boundaries, founder economics
      - Modular monolith over microservices
      - Wizard and CLI share one generator core
      - Templates matter more than blocks
      - Semantic tokens only
      - Web Components are the universal baseline; adapters, not rewrites
      - Free stays shippable; premium and business monetize polish and governance
      - Existing-project patch install is first-class, minimal, and reversible
      - No grid drift
      - No dark patterns
    `,
  );

  addFile(
    files,
    "POSITIONING.md",
    `
      # Positioning

      Shandapha is a UI platform, not only a component library.

      The core journey is:
      \`preview -> brand -> template -> export / patch existing app\`

      The moat is the contract and generator stack:
      tokens, runtime, templates, registry, packs, generator, CLI, and wizard.
    `,
  );

  addFile(files, "MONETIZATION.md", renderMonetizationMarkdown());
  addFile(files, "TIERS.md", renderTiersMarkdown());

  addFile(
    files,
    "SECURITY.md",
    `
      # Security

      Security starts with clear boundaries and minimal moving parts.

      - One backend service with modular domains
      - Package contracts for tokens, entitlements, and policies
      - Audit and telemetry seams exist from v1 without microservice overhead
      - CI includes contracts, size, visual regression, and security workflows
    `,
  );

  addFile(
    files,
    "PRIVACY.md",
    `
      # Privacy

      Shandapha favors privacy-safe telemetry, user-owned tokens, and opt-in data workflows.

      - Tokens belong to the customer
      - Telemetry hooks stay privacy-aware by default
      - Existing-project installs remain reversible
      - Billing and governance data are scoped to workspaces and entitlements
    `,
  );

  addFile(
    files,
    "CONTRIBUTING.md",
    `
      # Contributing

      ## Workflow

      - Use pnpm workspaces
      - Keep new logic inside the relevant package before reaching for app-local duplication
      - Add a changeset for user-facing package changes
      - Prefer template and generator updates over one-off app behavior

      ## Quality gates

      - \`pnpm lint\`
      - \`pnpm typecheck\`
      - \`pnpm test\`
      - \`pnpm build\`
    `,
  );

  addFile(
    files,
    "LICENSE",
    `
      Apache License
      Version 2.0, January 2004
      http://www.apache.org/licenses/

      Copyright 2026 Shandapha

      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.
      You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    `,
  );

  addFile(
    files,
    ".github/PULL_REQUEST_TEMPLATE.md",
    `
      ## Summary

      ## Testing

      ## Risk
    `,
  );

  addFile(
    files,
    ".github/CODEOWNERS",
    `
      * @shandapha/founders
    `,
  );

  addFile(
    files,
    ".github/ISSUE_TEMPLATE/bug-report.md",
    `
      ---
      name: Bug report
      about: Report a regression or broken flow
      ---

      ## What happened

      ## Expected

      ## Reproduction
    `,
  );

  const workflowNames = [
    "ci",
    "release",
    "docs",
    "visual-regression",
    "size-budgets",
    "contracts",
    "security",
  ];

  for (const workflow of workflowNames) {
    addFile(
      files,
      `.github/workflows/${workflow}.yml`,
      `
        name: ${workflow}

        on:
          push:
            branches: [main]
          pull_request:

        jobs:
          ${workflow.replace(/-/g, "_")}:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
              - uses: pnpm/action-setup@v4
                with:
                  version: 10.30.3
              - uses: actions/setup-node@v4
                with:
                  node-version: 24
                  cache: pnpm
              - run: pnpm install --frozen-lockfile=false
              - run: pnpm ${workflow === "release" ? "release:health" : workflow === "contracts" ? "contracts" : workflow === "visual-regression" ? "test:e2e" : workflow === "size-budgets" ? "size" : workflow === "security" ? "lint" : workflow === "docs" ? "build --filter=@shandapha/web" : "build"}
      `,
    );
  }

  addJson(files, ".changeset/config.json", {
    $schema: "https://unpkg.com/@changesets/config@3.1.1/schema.json",
    changelog: [
      "@changesets/changelog-github",
      {
        repo: "shandapha/shandapha",
      },
    ],
    commit: false,
    fixed: [],
    linked: [],
    access: "public",
    baseBranch: "main",
    updateInternalDependencies: "patch",
    ignore: [],
  });

  addFile(
    files,
    ".changeset/README.md",
    `
      # Changesets

      Use Changesets for workspace versioning and release notes.

      - \`pnpm changeset\`
      - \`pnpm version\`
      - \`pnpm release\`
    `,
  );

  addFile(files, "pnpm-workspace.yaml", workspaceYaml);
  addFile(files, "configs/pnpm-workspace.yaml", workspaceYaml);
  addJson(files, "turbo.json", turboConfig);
  addJson(files, "configs/turbo.json", turboConfig);

  addJson(files, "configs/tsconfig.base.json", {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "Bundler",
      lib: ["ES2023", "DOM", "DOM.Iterable"],
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      resolveJsonModule: true,
      isolatedModules: true,
      skipLibCheck: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      moduleDetection: "force",
      forceConsistentCasingInFileNames: true,
      types: ["node"],
    },
  });

  addJson(files, "configs/biome.json", {
    $schema: "https://biomejs.dev/schemas/2.0.5/schema.json",
    formatter: {
      enabled: true,
      indentStyle: "space",
      indentWidth: 2,
    },
    linter: {
      enabled: true,
      rules: {
        recommended: true,
      },
    },
    files: {
      ignoreUnknown: true,
      includes: ["**", "!**/.next/**", "!**/coverage/**"],
    },
  });

  addFile(
    files,
    "configs/eslint.config.js",
    `
      export default [
        {
          ignores: [".next/**", "coverage/**", "dist/**", "storybook-static/**"],
        },
      ];
    `,
  );

  addFile(
    files,
    "configs/prettier.config.cjs",
    `
      module.exports = {
        semi: true,
        singleQuote: false,
        trailingComma: "all",
      };
    `,
  );

  addFile(
    files,
    "configs/vitest.workspace.ts",
    `
      import { defineConfig } from "vitest/config";

      export default defineConfig({
        test: {
          globals: true,
          environment: "node",
          include: ["packages/**/*.test.ts", "services/**/*.test.ts"],
        },
      });
    `,
  );

  addFile(
    files,
    "configs/playwright.config.ts",
    `
      import { defineConfig } from "@playwright/test";

      export default defineConfig({
        testDir: "./tools/test/fixtures",
        retries: 0,
        use: {
          baseURL: "http://localhost:3000",
          headless: true,
        },
      });
    `,
  );

  addJson(files, "package.json", {
    name: "shandapha",
    version: "0.1.0",
    private: true,
    packageManager: "pnpm@10.30.3",
    scripts: {
      dev: "turbo run dev --parallel --filter=@shandapha/web --filter=@shandapha/studio --filter=@shandapha/platform-api",
      build: "turbo run build",
      lint: "biome check --config-path ./configs/biome.json apps packages services tools data README.md ARCHITECTURE.md PRINCIPLES.md POSITIONING.md MONETIZATION.md TIERS.md SECURITY.md PRIVACY.md CONTRIBUTING.md package.json pnpm-workspace.yaml turbo.json && node ./tools/scripts/verify-package-boundaries.mjs",
      typecheck: "turbo run typecheck",
      test: "vitest --config ./configs/vitest.workspace.ts run",
      "test:watch": "vitest --config ./configs/vitest.workspace.ts",
      "test:e2e": "playwright test --config ./configs/playwright.config.ts",
      contracts: "node ./tools/scripts/lint-contracts.mjs",
      tokens: "node ./tools/scripts/lint-tokens.mjs",
      drift: "node ./tools/scripts/drift-check.mjs",
      size: "node ./tools/scripts/size-report.mjs",
      "release:health": "node ./tools/scripts/release-health.mjs",
      changeset: "changeset",
      version: "changeset version",
      release: "changeset publish",
    },
    devDependencies: {
      "@biomejs/biome": versions.biome,
      "@changesets/cli": versions.changesets,
      "@playwright/test": versions.playwright,
      "@types/node": versions.typesNode,
      "@types/react": versions.typesReact,
      "@types/react-dom": versions.typesReactDom,
      tsx: versions.tsx,
      turbo: versions.turbo,
      typescript: versions.typescript,
      vitest: versions.vitest,
    },
  });

  const contractPackageJson = packageJson({
    name: "@shandapha/contracts",
    description: "Typed truth for Shandapha contracts and manifests.",
    scripts: {
      build: "tsc --project tsconfig.json",
      typecheck: "tsc --project tsconfig.json",
      lint: "biome check --config-path ../../configs/biome.json src",
      test: "vitest run",
    },
  });

  const sharedPackageTsconfig = tsconfig("../../configs/tsconfig.base.json", {
    include: ["src/**/*"],
  });

  addFile(files, "packages/contracts/package.json", contractPackageJson);
  addFile(files, "packages/contracts/tsconfig.json", sharedPackageTsconfig);
  addFile(
    files,
    "packages/contracts/src/index.ts",
    `
      export type DensityMode = "comfortable" | "compact";
      export type MotionMode = "full" | "reduced";
      export type PackId = "normal" | "glass" | "neon";
      export type PlanId = "free" | "premium" | "business";

      export interface BrandKit {
        primary: string;
        accent: string;
        font: string;
        radius: string;
        density: DensityMode;
      }

      export interface PackManifest {
        id: PackId;
        slug: string;
        name: string;
        tier: PlanId;
        tagline: string;
        description: string;
        knobs: string[];
      }

      export interface TemplateManifest {
        slug: string;
        name: string;
        group: string;
        summary: string;
        states: string[];
        variants: string[];
      }

      export interface ModuleManifest {
        id: string;
        name: string;
        packageName: string;
        description: string;
        premium: boolean;
      }

      export interface RegistryManifest {
        packs: PackManifest[];
        templates: TemplateManifest[];
        modules: ModuleManifest[];
      }

      export interface EntitlementPlan {
        id: PlanId;
        name: string;
        price: string;
        summary: string;
        includes: string[];
      }

      export interface GenerationInput {
        framework: "react-vite" | "next-app-router" | "wc-universal" | "blazor-wc";
        intent: "new-project" | "existing-project" | "preview-only";
        packId: PackId;
        planId: PlanId;
        templates: string[];
        modules: string[];
      }

      export interface DoctorCheck {
        id: string;
        label: string;
        status: "pass" | "warn";
        detail: string;
      }

      export interface GenerationPlan {
        input: GenerationInput;
        selectedPack: PackManifest;
        selectedTemplates: TemplateManifest[];
        selectedModules: ModuleManifest[];
        checklist: string[];
        diffReport: string[];
        uninstallManifest: string[];
        doctorChecks: DoctorCheck[];
      }
    `,
  );

  addJson(files, "packages/contracts/src/tokens/tokens.schema.json", {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Shandapha tokens",
    type: "object",
    properties: {
      color: { type: "object" },
      surface: { type: "object" },
      typography: { type: "object" },
      radius: { type: "object" },
      motion: { type: "object" },
      density: { type: "string" },
    },
    required: ["color", "surface", "typography", "radius", "motion", "density"],
  });
  addFile(
    files,
    "packages/contracts/src/tokens/tokens.types.ts",
    `export type TokenSchemaVersion = "1.0.0";\n`,
  );
  addFile(
    files,
    "packages/contracts/src/tokens/rules.ts",
    `export const semanticTokenRule = "semantic-tokens-only";\n`,
  );
  addFile(
    files,
    "packages/contracts/src/components/component.contract.ts",
    `export const componentContract = { focusRing: true, semanticTokensOnly: true } as const;\n`,
  );
  addFile(
    files,
    "packages/contracts/src/components/events.contract.ts",
    `export const eventsContract = ["change", "open", "close", "select"] as const;\n`,
  );
  addFile(
    files,
    "packages/contracts/src/components/slots.contract.ts",
    `export const slotsContract = ["default", "prefix", "suffix", "footer"] as const;\n`,
  );
  addFile(
    files,
    "packages/contracts/src/components/a11y.contract.ts",
    `export const a11yContract = { keyboard: true, visibleFocus: true, reducedMotion: true } as const;\n`,
  );
  addJson(
    files,
    "packages/contracts/src/templates/template.manifest.schema.json",
    {
      type: "object",
      required: ["slug", "name", "group", "summary"],
      properties: {
        slug: { type: "string" },
        name: { type: "string" },
        group: { type: "string" },
        summary: { type: "string" },
        states: { type: "array", items: { type: "string" } },
        variants: { type: "array", items: { type: "string" } },
      },
    },
  );
  addFile(
    files,
    "packages/contracts/src/templates/template.types.ts",
    `export interface TemplateSampleData { schema: string; file: string; }\n`,
  );
  addJson(files, "packages/contracts/src/packs/pack.manifest.schema.json", {
    type: "object",
    required: ["id", "slug", "name", "tier"],
    properties: {
      id: { type: "string" },
      slug: { type: "string" },
      name: { type: "string" },
      tier: { type: "string" },
      knobs: { type: "array", items: { type: "string" } },
    },
  });
  addFile(
    files,
    "packages/contracts/src/packs/pack.types.ts",
    `export interface PackKnob { id: string; label: string; }\n`,
  );
  addJson(files, "packages/contracts/src/registry/registry.schema.json", {
    type: "object",
    required: ["packs", "templates", "modules"],
    properties: {
      packs: { type: "array" },
      templates: { type: "array" },
      modules: { type: "array" },
    },
  });
  addFile(
    files,
    "packages/contracts/src/registry/registry.types.ts",
    `export interface RegistryCounts { packs: number; templates: number; modules: number; }\n`,
  );
  addJson(files, "packages/contracts/src/billing/entitlements.schema.json", {
    type: "object",
    required: ["id", "name", "price", "includes"],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      price: { type: "string" },
      includes: { type: "array", items: { type: "string" } },
    },
  });
  addJson(files, "packages/contracts/src/billing/limits.schema.json", {
    type: "object",
    properties: {
      templatesPerExport: { type: "number" },
      workspaces: { type: "number" },
      apiKeys: { type: "number" },
    },
  });
  addJson(files, "packages/contracts/src/governance/policy.schema.json", {
    type: "object",
    properties: {
      approvalsRequired: { type: "boolean" },
      retentionDays: { type: "number" },
      exportReview: { type: "boolean" },
    },
  });

  const basePackages = [
    {
      name: "@shandapha/tokens",
      path: "packages/tokens",
      description: "Semantic token engine for Shandapha.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { BrandKit, PackId } from "@shandapha/contracts";

        export interface TokenSet {
          color: Record<string, string>;
          surface: Record<string, string>;
          typography: Record<string, string>;
          radius: Record<string, string>;
          motion: Record<string, string>;
          density: string;
        }

        export const defaultBrandKit: BrandKit = {
          primary: "#0f766e",
          accent: "#f97316",
          font: "Space Grotesk",
          radius: "18px",
          density: "comfortable",
        };

        export function createTokenSet(brand: BrandKit = defaultBrandKit, packId: PackId = "normal"): TokenSet {
          return {
            color: {
              primary: brand.primary,
              accent: brand.accent,
              text: "#0f172a",
              textMuted: "#475569",
              background: packId === "neon" ? "#04111f" : "#f5f2e9",
            },
            surface: {
              canvas: packId === "glass" ? "rgba(255,255,255,0.72)" : "#fffdf7",
              raised: packId === "neon" ? "#09203a" : "#ffffff",
              border: packId === "glass" ? "rgba(15, 23, 42, 0.18)" : "#d6d3d1",
            },
            typography: {
              body: brand.font,
              display: packId === "neon" ? "'IBM Plex Sans', sans-serif" : "'Space Grotesk', sans-serif",
            },
            radius: {
              md: brand.radius,
              lg: "24px",
            },
            motion: {
              duration: packId === "normal" ? "140ms" : "180ms",
            },
            density: brand.density,
          };
        }

        export function toCssVariables(tokens: TokenSet): Record<string, string> {
          return {
            "--sh-color-primary": tokens.color.primary,
            "--sh-color-accent": tokens.color.accent,
            "--sh-color-text": tokens.color.text,
            "--sh-color-text-muted": tokens.color.textMuted,
            "--sh-surface-canvas": tokens.surface.canvas,
            "--sh-surface-raised": tokens.surface.raised,
            "--sh-border-default": tokens.surface.border,
            "--sh-font-body": tokens.typography.body,
            "--sh-font-display": tokens.typography.display,
            "--sh-radius-md": tokens.radius.md,
            "--sh-radius-lg": tokens.radius.lg,
            "--sh-motion-duration": tokens.motion.duration,
            "--sh-density": tokens.density,
          };
        }

        export function toTokensJson(tokens: TokenSet): string {
          return JSON.stringify(tokens, null, 2);
        }

        export function checkContrast(tokens: TokenSet): string[] {
          const warnings: string[] = [];
          if (tokens.color.primary.toLowerCase() === tokens.color.background?.toLowerCase()) {
            warnings.push("Primary color is too close to the background.");
          }
          return warnings;
        }
      `,
    },
    {
      name: "@shandapha/runtime",
      path: "packages/runtime",
      description:
        "Portable runtime helpers for theme, focus, motion, and telemetry.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/tokens": "workspace:*",
      },
      source: `
        import type { BrandKit, PackId } from "@shandapha/contracts";
        import { createTokenSet, toCssVariables } from "@shandapha/tokens";

        export function createThemeAttributes(packId: PackId, density: BrandKit["density"]) {
          return {
            "data-theme": packId,
            "data-density": density,
          };
        }

        export function applyTheme(packId: PackId, brandKit: BrandKit, target: HTMLElement | null = typeof document !== "undefined" ? document.documentElement : null) {
          if (!target) {
            return;
          }

          const tokens = createTokenSet(brandKit, packId);
          const vars = toCssVariables(tokens);

          for (const [key, value] of Object.entries(vars)) {
            target.style.setProperty(key, value);
          }

          const attributes = createThemeAttributes(packId, brandKit.density);
          Object.entries(attributes).forEach(([key, value]) => target.setAttribute(key, value));
        }

        export function shouldReduceMotion(mode: "full" | "reduced") {
          return mode === "reduced";
        }

        export function getFocusRingStyle() {
          return {
            outline: "2px solid var(--sh-color-accent, #f97316)",
            outlineOffset: "2px",
          };
        }

        export function createTelemetryEvent(event: string, detail: Record<string, string>) {
          return {
            event,
            detail,
            mode: "privacy-safe",
            emittedAt: new Date().toISOString(),
          };
        }
      `,
    },
    {
      name: "@shandapha/packs",
      path: "packages/packs",
      description: "Pack definitions and pack-driven token transforms.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/tokens": "workspace:*",
      },
      source: `
        import type { BrandKit, PackId, PackManifest } from "@shandapha/contracts";
        import { createTokenSet, defaultBrandKit, toCssVariables } from "@shandapha/tokens";

        export const packs: PackManifest[] = ${JSON.stringify(packCatalog, null, 2)} as PackManifest[];

        export function getPackBySlug(slug: string) {
          return packs.find((pack) => pack.slug === slug);
        }

        export function getPackById(packId: PackId) {
          return packs.find((pack) => pack.id === packId);
        }

        export function createPackTheme(packId: PackId, brandKit: BrandKit = defaultBrandKit) {
          const pack = getPackById(packId) ?? packs[0];
          const tokens = createTokenSet(brandKit, pack.id);
          return {
            pack,
            tokens,
            cssVariables: toCssVariables(tokens),
          };
        }

        export function validatePack(packId: string) {
          return packs.some((pack) => pack.id === packId);
        }
      `,
    },
    {
      name: "@shandapha/templates",
      path: "packages/templates",
      description: "Template manifests, states, and sample-data seams.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { TemplateManifest } from "@shandapha/contracts";

        export const templateGroups = ${JSON.stringify(templateGroups, null, 2)} as const;
        export const templates: TemplateManifest[] = ${JSON.stringify(templateCatalog, null, 2)} as TemplateManifest[];

        export function listTemplates(group?: string) {
          return group ? templates.filter((template) => template.group === group) : templates;
        }

        export function getTemplateBySlug(slug: string) {
          return templates.find((template) => template.slug === slug);
        }

        export function listTemplateStates(slug: string) {
          return getTemplateBySlug(slug)?.states ?? [];
        }
      `,
    },
    {
      name: "@shandapha/module-datatable",
      path: "packages/modules/datatable",
      description: "Opt-in advanced table workflows.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { ModuleManifest } from "@shandapha/contracts";

        export const datatableManifest: ModuleManifest = ${JSON.stringify(moduleCatalog[0], null, 2)} as ModuleManifest;
        export const datatableFeatures = [
          "client mode",
          "server mode",
          "filtering",
          "sorting",
          "virtualization",
          "pinning",
          "resizing",
          "export-csv",
          "saved-views",
          "DataToolbar",
          "ColumnPicker",
        ] as const;
      `,
    },
    {
      name: "@shandapha/module-charts",
      path: "packages/modules/charts",
      description: "Scaffold seam for future charting support.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { ModuleManifest } from "@shandapha/contracts";

        export const chartsManifest: ModuleManifest = ${JSON.stringify(moduleCatalog[1], null, 2)} as ModuleManifest;
      `,
    },
    {
      name: "@shandapha/module-richtext",
      path: "packages/modules/richtext",
      description: "Scaffold seam for future rich text workflows.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { ModuleManifest } from "@shandapha/contracts";

        export const richtextManifest: ModuleManifest = ${JSON.stringify(moduleCatalog[2], null, 2)} as ModuleManifest;
      `,
    },
    {
      name: "@shandapha/module-seo",
      path: "packages/modules/seo",
      description: "Scaffold seam for metadata and SEO helpers.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { ModuleManifest } from "@shandapha/contracts";

        export const seoManifest: ModuleManifest = ${JSON.stringify(moduleCatalog[3], null, 2)} as ModuleManifest;
      `,
    },
    {
      name: "@shandapha/registry",
      path: "packages/registry",
      description: "Registry data source for web, studio, CLI, and docs.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/module-charts": "workspace:*",
        "@shandapha/module-datatable": "workspace:*",
        "@shandapha/module-richtext": "workspace:*",
        "@shandapha/module-seo": "workspace:*",
        "@shandapha/packs": "workspace:*",
        "@shandapha/templates": "workspace:*",
      },
      source: `
        import type { RegistryManifest } from "@shandapha/contracts";
        import { chartsManifest } from "@shandapha/module-charts";
        import { datatableManifest } from "@shandapha/module-datatable";
        import { richtextManifest } from "@shandapha/module-richtext";
        import { seoManifest } from "@shandapha/module-seo";
        import { packs, getPackBySlug } from "@shandapha/packs";
        import { templates, getTemplateBySlug } from "@shandapha/templates";

        export function buildRegistry(): RegistryManifest {
          return {
            packs,
            templates,
            modules: [datatableManifest, chartsManifest, richtextManifest, seoManifest],
          };
        }

        export function getRegistryJson() {
          return JSON.stringify(buildRegistry(), null, 2);
        }

        export { getPackBySlug, getTemplateBySlug };
      `,
    },
    {
      name: "@shandapha/entitlements",
      path: "packages/entitlements",
      description: "Typed feature gating and upgrade copy.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
      },
      source: `
        import type { EntitlementPlan, PackId, PlanId } from "@shandapha/contracts";

        export const plans: EntitlementPlan[] = ${JSON.stringify(pricingPlans, null, 2)} as EntitlementPlan[];

        export const featureMap: Record<PlanId, string[]> = {
          free: ["normal", "core-components", "basic-templates", "basic-table", "docs"],
          premium: ["normal", "glass", "neon", "patch-install", "starter-export", "advanced-templates", "datatable"],
          business: ["normal", "glass", "neon", "patch-install", "starter-export", "advanced-templates", "datatable", "governance", "audit", "policy-reports"],
        };

        export function resolveEntitlements(planId: PlanId) {
          return {
            plan: plans.find((plan) => plan.id === planId) ?? plans[0],
            features: featureMap[planId],
          };
        }

        export function requireFeature(planId: PlanId, feature: string) {
          return featureMap[planId].includes(feature);
        }

        export function requirePack(planId: PlanId, packId: PackId) {
          return packId === "normal" ? true : featureMap[planId].includes(packId);
        }

        export function upgradeCopy(planId: PlanId) {
          return planId === "free"
            ? "Upgrade when you want more polish, not because the free tier is artificially crippled."
            : planId === "premium"
              ? "Business adds governance, policy reports, and scale confidence."
              : "You already have the full governance surface.";
        }
      `,
    },
    {
      name: "@shandapha/generator",
      path: "packages/generator",
      description: "Shared generation core used by the wizard and CLI.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/registry": "workspace:*",
      },
      source: `
        import type { DoctorCheck, GenerationInput, GenerationPlan } from "@shandapha/contracts";
        import { resolveEntitlements } from "@shandapha/entitlements";
        import { buildRegistry } from "@shandapha/registry";

        export const recipes = [
          "react-vite",
          "next-app-router",
          "wc-universal",
          "blazor-wc",
        ] as const;

        export function createGenerationPlan(input: GenerationInput): GenerationPlan {
          const registry = buildRegistry();
          const selectedPack = registry.packs.find((pack) => pack.id === input.packId) ?? registry.packs[0];
          const selectedTemplates = registry.templates.filter((template) => input.templates.includes(template.slug));
          const selectedModules = registry.modules.filter((module) => input.modules.includes(module.id));
          const entitlements = resolveEntitlements(input.planId);
          const checklist = [
            "Install dependencies",
            "Confirm theme.css and tokens.json are present",
            "Wrap the app with ThemeProvider where applicable",
            "Run doctor and verify starter routes",
          ];
          const diffReport = [
            \`Add \${selectedTemplates.length} template files\`,
            \`Enable pack: \${selectedPack.name}\`,
            input.intent === "existing-project" ? "Apply minimal, reversible patch install" : "Create starter structure",
          ];
          const uninstallManifest = [
            "remove theme.css",
            "remove tokens.json",
            "remove generated template folder",
            "revert provider wrapper changes",
          ];

          return {
            input,
            selectedPack,
            selectedTemplates,
            selectedModules,
            checklist,
            diffReport,
            uninstallManifest,
            doctorChecks: runDoctor({
              hasProvider: input.framework !== "wc-universal" && input.framework !== "blazor-wc",
              hasStyles: true,
              hasTokens: true,
              packLocked: !entitlements.features.includes(selectedPack.id) ? false : true,
            }),
          };
        }

        export function runDoctor(input: {
          hasProvider: boolean;
          hasStyles: boolean;
          hasTokens: boolean;
          packLocked: boolean;
        }): DoctorCheck[] {
          return [
            {
              id: "theme-loaded",
              label: "Theme loaded",
              status: input.hasTokens ? "pass" : "warn",
              detail: input.hasTokens ? "tokens.json and theme variables are present." : "tokens.json is missing.",
            },
            {
              id: "provider-wrapped",
              label: "Provider wrapped",
              status: input.hasProvider ? "pass" : "warn",
              detail: input.hasProvider ? "React/Next provider detected." : "Web Components mode can skip the provider.",
            },
            {
              id: "styles-present",
              label: "Styles present",
              status: input.hasStyles ? "pass" : "warn",
              detail: input.hasStyles ? "Theme CSS is available." : "Theme CSS is missing.",
            },
            {
              id: "drift-clean",
              label: "Drift clean",
              status: input.packLocked ? "pass" : "warn",
              detail: input.packLocked ? "Pack and entitlements stay aligned." : "Selected pack exceeds the current plan.",
            },
          ];
        }
      `,
    },
    {
      name: "@shandapha/business",
      path: "packages/business",
      description:
        "Governance and approval scaffolding for business tier workflows.",
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
      },
      source: `
        export const orgDefaults = {
          approvalsRequired: true,
          retentionDays: 90,
          exportReview: true,
        } as const;

        export const policyReports = [
          "token approvals",
          "template approvals",
          "drift detection",
          "audit export",
        ] as const;
      `,
    },
    {
      name: "@shandapha/sdk",
      path: "packages/sdk",
      description:
        "Minimal SDK clients for Studio, Registry, and Billing APIs.",
      dependencies: {},
      source: `
        export async function createClient<T>(url: string): Promise<T> {
          const response = await fetch(url);
          return response.json() as Promise<T>;
        }

        export const studioClient = (baseUrl: string) => ({
          workspaces: () => createClient(\`\${baseUrl}/api/workspaces/summary\`),
        });

        export const registryClient = (baseUrl: string) => ({
          catalog: () => createClient(\`\${baseUrl}/api/registry/catalog\`),
        });

        export const billingClient = (baseUrl: string) => ({
          plans: () => createClient(\`\${baseUrl}/api/billing/summary\`),
        });
      `,
    },
    {
      name: "@shandapha/testing",
      path: "packages/testing",
      description: "Cross-repo quality helpers.",
      dependencies: {},
      source: `
        export function expectTruthy(value: unknown, label: string) {
          if (!value) {
            throw new Error(\`\${label} was expected to be truthy.\`);
          }
        }

        export function visualBaselineName(scope: string, id: string) {
          return \`\${scope}::\${id}\`;
        }
      `,
    },
  ];

  for (const pkg of basePackages) {
    addFile(
      files,
      `${pkg.path}/package.json`,
      packageJson({
        name: pkg.name,
        description: pkg.description,
        scripts: {
          build: "tsc --project tsconfig.json",
          typecheck: "tsc --project tsconfig.json",
          lint: `biome check --config-path ${pkg.path.includes("packages/modules") ? "../../../configs" : "../../configs"}/biome.json src`,
          test: "vitest run",
        },
        dependencies: pkg.dependencies,
      }),
    );
    addFile(
      files,
      `${pkg.path}/tsconfig.json`,
      tsconfig(
        pkg.path.includes("packages/modules")
          ? "../../../configs/tsconfig.base.json"
          : "../../configs/tsconfig.base.json",
        {
          include: ["src/**/*"],
        },
      ),
    );
    addFile(files, `${pkg.path}/src/index.ts`, pkg.source);
  }

  addJson(files, "packages/registry/src/data/templates.json", templateCatalog);
  addJson(files, "packages/registry/src/data/packs.json", packCatalog);
  addJson(files, "packages/registry/src/data/modules.json", moduleCatalog);
  addFile(
    files,
    "packages/registry/src/build/buildRegistry.ts",
    `export { buildRegistry } from "../index";\n`,
  );
  addFile(
    files,
    "packages/registry/src/loaders/templates.ts",
    `export { listTemplates, getTemplateBySlug } from "@shandapha/templates";\n`,
  );
  addFile(
    files,
    "packages/registry/src/loaders/packs.ts",
    `export { packs, getPackBySlug } from "@shandapha/packs";\n`,
  );
  addFile(
    files,
    "packages/registry/src/loaders/modules.ts",
    `export { datatableManifest } from "@shandapha/module-datatable";\n`,
  );

  addFile(
    files,
    "packages/tokens/src/builders/deriveSemanticTokens.ts",
    `export { createTokenSet as deriveSemanticTokens } from "../index";\n`,
  );
  addFile(
    files,
    "packages/tokens/src/builders/density.ts",
    `export const densityModes = ["comfortable", "compact"] as const;\n`,
  );
  addFile(
    files,
    "packages/tokens/src/builders/darkMode.ts",
    `export const darkModePreset = { background: "#04111f", text: "#e2e8f0" } as const;\n`,
  );
  addFile(
    files,
    "packages/tokens/src/builders/contrastChecks.ts",
    `export { checkContrast } from "../index";\n`,
  );
  addFile(
    files,
    "packages/tokens/src/exporters/toCssVars.ts",
    `export { toCssVariables as toCssVars } from "../index";\n`,
  );
  addFile(
    files,
    "packages/tokens/src/exporters/toTokensJson.ts",
    `export { toTokensJson } from "../index";\n`,
  );
  addFile(
    files,
    "packages/tokens/src/presets/normal/README.md",
    `# Normal preset\n\nNormal is the trusted baseline pack preset: balanced surfaces, calm contrast, and a premium default that belongs in the free tier.\n`,
  );
  addFile(
    files,
    "packages/tokens/src/presets/glass-lite/README.md",
    `# Glass lite preset\n\nGlass lite previews the translucent premium direction without changing the component contract. Use it to validate blur, sheen, and surface layering in a safe baseline.\n`,
  );
  addFile(
    files,
    "packages/tokens/src/presets/neon-lite/README.md",
    `# Neon lite preset\n\nNeon lite previews the expressive premium direction with stronger accent energy and headline contrast while staying accessible.\n`,
  );
  addFile(
    files,
    "packages/tokens/tests/tokens.test.ts",
    `import { describe, expect, it } from "vitest";\nimport { createTokenSet } from "../src/index";\n\ndescribe("tokens", () => {\n  it("creates semantic tokens", () => {\n    expect(createTokenSet().color.primary).toBeTruthy();\n  });\n});\n`,
  );

  addFile(
    files,
    "packages/runtime/src/theme/applyTheme.ts",
    `export { applyTheme } from "../index";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/theme/setDataThemeAttr.ts",
    `export { createThemeAttributes } from "../index";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/theme/density.ts",
    `export const densityAttr = "data-density";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/a11y/focusRing.ts",
    `export { getFocusRingStyle } from "../index";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/a11y/rovingTabIndex.ts",
    `export function nextRovingIndex(current: number, total: number) { return (current + 1) % total; }\n`,
  );
  addFile(
    files,
    "packages/runtime/src/a11y/ariaHelpers.ts",
    `export function withAriaLabel(label: string) { return { "aria-label": label }; }\n`,
  );
  addFile(
    files,
    "packages/runtime/src/motion/prefersReducedMotion.ts",
    `export { shouldReduceMotion as prefersReducedMotion } from "../index";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/telemetry/events.ts",
    `export { createTelemetryEvent } from "../index";\n`,
  );
  addFile(
    files,
    "packages/runtime/src/telemetry/privacy.ts",
    `export const telemetryPrivacyMode = "privacy-safe";\n`,
  );

  addFile(
    files,
    "packages/layouts/package.json",
    packageJson({
      name: "@shandapha/layouts",
      description: "Layout primitives and anti-drift helpers.",
      scripts: {
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        react: versions.react,
        "@shandapha/contracts": "workspace:*",
      },
    }),
  );
  addFile(files, "packages/layouts/tsconfig.json", sharedPackageTsconfig);
  addJson(files, "packages/layouts/package.json", {
    ...JSON.parse(
      packageJson({
        name: "@shandapha/layouts",
        description: "Layout primitives and anti-drift helpers.",
        scripts: {
          build: "tsc --project tsconfig.json",
          typecheck: "tsc --project tsconfig.json",
          lint: "biome check --config-path ../../configs/biome.json src",
          test: "vitest run",
        },
        dependencies: {
          react: versions.react,
          "@shandapha/contracts": "workspace:*",
        },
      }),
    ),
    exports: {
      ".": "./src/index.tsx",
    },
  });
  addFile(
    files,
    "packages/layouts/src/index.tsx",
    `
      import type { PropsWithChildren, ReactNode } from "react";

      interface BoxProps extends PropsWithChildren {
        title?: string;
        gap?: number;
        maxWidth?: number;
      }

      export function Container({ children, maxWidth = 1200 }: BoxProps) {
        return <div style={{ width: "min(100% - 2rem, 100%)", maxWidth, margin: "0 auto" }}>{children}</div>;
      }

      export function Section({ children, title }: BoxProps) {
        return (
          <section style={{ padding: "4rem 0" }}>
            {title ? <p style={{ margin: "0 0 1rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sh-color-accent)" }}>{title}</p> : null}
            {children}
          </section>
        );
      }

      export function Surface({ children, title }: BoxProps) {
        return (
          <div
            style={{
              border: "1px solid var(--sh-border-default, #d6d3d1)",
              background: "var(--sh-surface-raised, rgba(255,255,255,0.88))",
              borderRadius: "var(--sh-radius-lg, 24px)",
              padding: "1.25rem",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
            }}
          >
            {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
            {children}
          </div>
        );
      }

      export function Stack({ children, gap = 16 }: PropsWithChildren<{ gap?: number }>) {
        return <div style={{ display: "grid", gap }}>{children}</div>;
      }

      export function Inline({ children, gap = 16 }: PropsWithChildren<{ gap?: number }>) {
        return <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>{children}</div>;
      }

      export function PageHeader({ title, eyebrow, actions }: { title: string; eyebrow?: string; actions?: ReactNode }) {
        return (
          <div style={{ display: "grid", gap: 12 }}>
            {eyebrow ? <span style={{ textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--sh-color-accent)" }}>{eyebrow}</span> : null}
            <Inline gap={16}>
              <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 4rem)" }}>{title}</h1>
              <div style={{ marginLeft: "auto" }}>{actions}</div>
            </Inline>
          </div>
        );
      }

      export const gridPresets = {
        dashboard: { columns: "repeat(12, minmax(0, 1fr))", gap: 24 },
        list: { columns: "minmax(220px, 280px) minmax(0, 1fr)", gap: 24 },
        detail: { columns: "minmax(0, 2fr) minmax(280px, 1fr)", gap: 24 },
        form: { columns: "minmax(0, 740px)", gap: 20 },
        marketing: { columns: "minmax(0, 1fr)", gap: 32 },
      } as const;

      export function GridPreset({ preset, children }: PropsWithChildren<{ preset: keyof typeof gridPresets }>) {
        return <div style={{ display: "grid", ...gridPresets[preset] }}>{children}</div>;
      }

      export function driftCheck(spacing: number) {
        return spacing <= 32 && spacing % 4 === 0;
      }
    `,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/Stack.tsx",
    `export { Stack } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/Inline.tsx",
    `export { Inline } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/Section.tsx",
    `export { Section } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/Container.tsx",
    `export { Container } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/Surface.tsx",
    `export { Surface } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/PageHeader.tsx",
    `export { PageHeader } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/primitives/GridPreset.tsx",
    `export { GridPreset } from "../index";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/presets/dashboard.ts",
    `export const dashboardPreset = "dashboard";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/presets/list.ts",
    `export const listPreset = "list";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/presets/detail.ts",
    `export const detailPreset = "detail";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/presets/form.ts",
    `export const formPreset = "form";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/presets/marketing.ts",
    `export const marketingPreset = "marketing";\n`,
  );
  addFile(
    files,
    "packages/layouts/src/drift/spacingConstraints.ts",
    `export const spacingConstraints = [4, 8, 12, 16, 20, 24, 32] as const;\n`,
  );
  addFile(
    files,
    "packages/layouts/src/drift/allowedPresets.ts",
    `export const allowedPresets = ["dashboard", "list", "detail", "form", "marketing"] as const;\n`,
  );
  addFile(
    files,
    "packages/layouts/src/drift/forbiddenPatterns.ts",
    `export const forbiddenPatterns = ["nested-12-column-grid", "ad-hoc-pt-37"]; \n`,
  );
  addFile(
    files,
    "packages/layouts/src/drift/driftCheck.ts",
    `export { driftCheck } from "../index";\n`,
  );

  addFile(
    files,
    "packages/core/package.json",
    packageJson({
      name: "@shandapha/core",
      description: "Free shippable UI foundations.",
      scripts: {
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        react: versions.react,
        "@shandapha/runtime": "workspace:*",
      },
    }),
  );
  addFile(files, "packages/core/tsconfig.json", sharedPackageTsconfig);
  addJson(files, "packages/core/package.json", {
    ...JSON.parse(
      packageJson({
        name: "@shandapha/core",
        description: "Free shippable UI foundations.",
        scripts: {
          build: "tsc --project tsconfig.json",
          typecheck: "tsc --project tsconfig.json",
          lint: "biome check --config-path ../../configs/biome.json src",
          test: "vitest run",
        },
        dependencies: {
          react: versions.react,
          "@shandapha/runtime": "workspace:*",
        },
      }),
    ),
    exports: {
      ".": "./src/index.tsx",
    },
  });
  addFile(
    files,
    "packages/core/src/index.tsx",
    `
      import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
      import { getFocusRingStyle } from "@shandapha/runtime";

      export const coreComponentCatalog = [
        "button",
        "input",
        "select",
        "checkbox",
        "radio",
        "textarea",
        "tabs",
        "dropdown",
        "modal",
        "drawer",
        "tooltip",
        "toast",
        "badge",
        "avatar",
        "breadcrumb",
        "nav",
        "skeleton",
        "empty-state",
        "error-state",
        "success-state",
        "dropzone",
        "table-basic",
      ] as const;

      export function Button(props: ComponentPropsWithoutRef<"button">) {
        return (
          <button
            {...props}
            style={{
              border: "1px solid var(--sh-border-default, #d6d3d1)",
              background: "linear-gradient(135deg, var(--sh-color-primary, #0f766e), var(--sh-color-accent, #f97316))",
              color: "#fff",
              borderRadius: "999px",
              padding: "0.85rem 1.2rem",
              fontWeight: 700,
              cursor: "pointer",
              ...getFocusRingStyle(),
            }}
          />
        );
      }

      export function Badge({ children }: PropsWithChildren) {
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: "999px", padding: "0.35rem 0.7rem", background: "rgba(15, 118, 110, 0.12)", color: "var(--sh-color-primary, #0f766e)", fontWeight: 700 }}>
            {children}
          </span>
        );
      }

      export function Input(props: ComponentPropsWithoutRef<"input">) {
        return <input {...props} style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: "16px", border: "1px solid var(--sh-border-default, #d6d3d1)", background: "var(--sh-surface-raised, #fff)" }} />;
      }

      export function Select(props: ComponentPropsWithoutRef<"select">) {
        return <select {...props} style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: "16px", border: "1px solid var(--sh-border-default, #d6d3d1)", background: "var(--sh-surface-raised, #fff)" }} />;
      }

      export function Checkbox(props: ComponentPropsWithoutRef<"input">) {
        return <input {...props} type="checkbox" style={{ width: 18, height: 18 }} />;
      }

      export function Textarea(props: ComponentPropsWithoutRef<"textarea">) {
        return <textarea {...props} style={{ width: "100%", minHeight: 120, padding: "0.9rem 1rem", borderRadius: "16px", border: "1px solid var(--sh-border-default, #d6d3d1)", background: "var(--sh-surface-raised, #fff)" }} />;
      }

      export function StatePanel({ title, body }: { title: string; body: string }) {
        return (
          <div style={{ display: "grid", gap: 8, borderRadius: 20, border: "1px solid var(--sh-border-default, #d6d3d1)", padding: 20 }}>
            <strong>{title}</strong>
            <span style={{ color: "var(--sh-color-text-muted, #475569)" }}>{body}</span>
          </div>
        );
      }

      export function TableBasic({ rows }: { rows: Array<Record<string, string>> }) {
        const columns = rows[0] ? Object.keys(rows[0]) : [];
        return (
          <div style={{ overflowX: "auto", border: "1px solid var(--sh-border-default, #d6d3d1)", borderRadius: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} style={{ textAlign: "left", padding: "0.85rem 1rem", borderBottom: "1px solid var(--sh-border-default, #d6d3d1)" }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(214, 211, 209, 0.6)" }}>
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    `,
  );
  addFile(
    files,
    "packages/core/src/styles/index.css",
    `:root { --sh-shadow-soft: 0 24px 80px rgba(15, 23, 42, 0.08); }\n`,
  );
  addFile(
    files,
    "packages/core/src/styles/component.cssvars.css",
    `:root { --sh-component-radius: 16px; }\n`,
  );
  addFile(
    files,
    "packages/core/src/utils/cx.ts",
    `export function cx(...values: Array<string | false | null | undefined>) { return values.filter(Boolean).join(" "); }\n`,
  );
  addFile(
    files,
    "packages/core/src/utils/events.ts",
    `export function createComponentEvent<T>(name: string, detail: T) { return new CustomEvent<T>(name, { detail }); }\n`,
  );
  addFile(
    files,
    "packages/core/src/utils/slotting.ts",
    `export const defaultSlots = ["default", "prefix", "suffix"] as const;\n`,
  );
  addFile(files, "packages/core/src/components/button/README.md", `# Button\n`);
  addFile(files, "packages/core/src/components/input/README.md", `# Input\n`);
  addFile(files, "packages/core/src/components/select/README.md", `# Select\n`);
  addFile(
    files,
    "packages/core/src/components/checkbox/README.md",
    `# Checkbox\n`,
  );
  addFile(files, "packages/core/src/components/radio/README.md", `# Radio\n`);
  addFile(
    files,
    "packages/core/src/components/textarea/README.md",
    `# Textarea\n`,
  );
  addFile(files, "packages/core/src/components/tabs/README.md", `# Tabs\n`);
  addFile(
    files,
    "packages/core/src/components/dropdown/README.md",
    `# Dropdown\n`,
  );
  addFile(files, "packages/core/src/components/modal/README.md", `# Modal\n`);
  addFile(files, "packages/core/src/components/drawer/README.md", `# Drawer\n`);
  addFile(
    files,
    "packages/core/src/components/tooltip/README.md",
    `# Tooltip\n`,
  );
  addFile(files, "packages/core/src/components/toast/README.md", `# Toast\n`);
  addFile(files, "packages/core/src/components/badge/README.md", `# Badge\n`);
  addFile(files, "packages/core/src/components/avatar/README.md", `# Avatar\n`);
  addFile(
    files,
    "packages/core/src/components/breadcrumb/README.md",
    `# Breadcrumb\n`,
  );
  addFile(files, "packages/core/src/components/nav/README.md", `# Nav\n`);
  addFile(
    files,
    "packages/core/src/components/skeleton/README.md",
    `# Skeleton\n`,
  );
  addFile(
    files,
    "packages/core/src/components/empty-state/README.md",
    `# Empty State\n`,
  );
  addFile(
    files,
    "packages/core/src/components/error-state/README.md",
    `# Error State\n`,
  );
  addFile(
    files,
    "packages/core/src/components/success-state/README.md",
    `# Success State\n`,
  );
  addFile(
    files,
    "packages/core/src/components/dropzone/README.md",
    `# Dropzone\n`,
  );
  addFile(
    files,
    "packages/core/src/components/table-basic/README.md",
    `# Basic Table\n`,
  );

  addFile(
    files,
    "packages/wc/package.json",
    packageJson({
      name: "@shandapha/wc",
      description: "Web Components baseline.",
      scripts: {
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        "@shandapha/runtime": "workspace:*",
      },
    }),
  );
  addFile(files, "packages/wc/tsconfig.json", sharedPackageTsconfig);
  addFile(
    files,
    "packages/wc/src/index.ts",
    `
      import { createThemeAttributes } from "@shandapha/runtime";

      class ShandaphaSurfaceElement extends HTMLElement {
        connectedCallback() {
          this.style.display = "block";
          this.style.border = "1px solid var(--sh-border-default, #d6d3d1)";
          this.style.borderRadius = "var(--sh-radius-lg, 24px)";
          this.style.padding = "1rem";
          this.style.background = "var(--sh-surface-raised, #fff)";
        }
      }

      class ShandaphaButtonElement extends HTMLElement {
        connectedCallback() {
          this.style.display = "inline-flex";
          this.style.alignItems = "center";
          this.style.justifyContent = "center";
          this.style.border = "1px solid var(--sh-border-default, #d6d3d1)";
          this.style.borderRadius = "999px";
          this.style.padding = "0.8rem 1.1rem";
          this.style.background = "var(--sh-color-primary, #0f766e)";
          this.style.color = "#fff";
          const theme = this.getAttribute("pack") ?? "normal";
          Object.entries(createThemeAttributes(theme as never, "comfortable")).forEach(([key, value]) => this.setAttribute(key, value));
        }
      }

      export function defineAll() {
        if (!customElements.get("shandapha-surface")) {
          customElements.define("shandapha-surface", ShandaphaSurfaceElement);
        }
        if (!customElements.get("shandapha-button")) {
          customElements.define("shandapha-button", ShandaphaButtonElement);
        }
      }
    `,
  );
  addFile(
    files,
    "packages/wc/src/defineAll.ts",
    `export { defineAll } from "./index";\n`,
  );
  addFile(
    files,
    "packages/wc/src/define/defineButton.ts",
    `export const buttonTagName = "shandapha-button";\n`,
  );
  addFile(
    files,
    "packages/wc/src/define/defineInput.ts",
    `export const inputTagName = "shandapha-input";\n`,
  );
  addFile(
    files,
    "packages/wc/src/define/defineModal.ts",
    `export const modalTagName = "shandapha-modal";\n`,
  );
  addFile(
    files,
    "packages/wc/src/define/defineToast.ts",
    `export const toastTagName = "shandapha-toast";\n`,
  );
  addFile(
    files,
    "packages/wc/src/runtime/emit.ts",
    `export function emit<T>(element: HTMLElement, name: string, detail: T) { element.dispatchEvent(new CustomEvent<T>(name, { detail })); }\n`,
  );
  addFile(
    files,
    "packages/wc/src/runtime/props.ts",
    `export function getBooleanAttribute(element: HTMLElement, key: string) { return element.hasAttribute(key); }\n`,
  );
  addFile(
    files,
    "packages/wc/src/runtime/slots.ts",
    `export function slotNames(element: HTMLElement) { return Array.from(element.querySelectorAll("[slot]")).map((node) => node.getAttribute("slot") ?? "default"); }\n`,
  );
  addFile(
    files,
    "packages/wc/src/runtime/hydrateSafe.ts",
    `export function hydrateSafe() { return typeof window !== "undefined"; }\n`,
  );

  addFile(
    files,
    "packages/react/package.json",
    packageJson({
      name: "@shandapha/react",
      description: "React adapter and theme provider.",
      scripts: {
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        react: versions.react,
        "@shandapha/contracts": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/runtime": "workspace:*",
        "@shandapha/tokens": "workspace:*",
      },
    }),
  );
  addFile(files, "packages/react/tsconfig.json", sharedPackageTsconfig);
  addJson(files, "packages/react/package.json", {
    ...JSON.parse(
      packageJson({
        name: "@shandapha/react",
        description: "React adapter and theme provider.",
        scripts: {
          build: "tsc --project tsconfig.json",
          typecheck: "tsc --project tsconfig.json",
          lint: "biome check --config-path ../../configs/biome.json src",
          test: "vitest run",
        },
        dependencies: {
          react: versions.react,
          "@shandapha/contracts": "workspace:*",
          "@shandapha/entitlements": "workspace:*",
          "@shandapha/runtime": "workspace:*",
          "@shandapha/tokens": "workspace:*",
        },
      }),
    ),
    exports: {
      ".": "./src/index.tsx",
    },
  });
  addFile(
    files,
    "packages/react/src/index.tsx",
    `
      import { createContext, startTransition, useContext, useEffect, useEffectEvent, useState, type PropsWithChildren } from "react";
        import type { BrandKit, PackId, PlanId } from "@shandapha/contracts";
        import { resolveEntitlements } from "@shandapha/entitlements";
        import { applyTheme } from "@shandapha/runtime";
        import { defaultBrandKit } from "@shandapha/tokens";

        interface ThemeContextValue {
          brandKit: BrandKit;
          packId: PackId;
          planId: PlanId;
          setPackId: (packId: PackId) => void;
        }

        const ThemeContext = createContext<ThemeContextValue | null>(null);

        export function ThemeProvider({
          brandKit = defaultBrandKit,
          initialPack = "normal",
          planId = "free",
          children,
        }: PropsWithChildren<{ brandKit?: BrandKit; initialPack?: PackId; planId?: PlanId }>) {
          const [packId, setPackIdState] = useState<PackId>(initialPack);
          const apply = useEffectEvent((nextPackId: PackId) => {
            applyTheme(nextPackId, brandKit);
          });

          useEffect(() => {
            apply(packId);
          }, [apply, packId]);

          return (
            <ThemeContext.Provider
              value={{
                brandKit,
                packId,
                planId,
                setPackId: (nextPackId) => startTransition(() => setPackIdState(nextPackId)),
              }}
            >
              {children}
            </ThemeContext.Provider>
          );
        }

        export function ShandaphaProvider(props: PropsWithChildren<{ brandKit?: BrandKit; initialPack?: PackId; planId?: PlanId }>) {
          return <ThemeProvider {...props} />;
        }

        export function useTheme() {
          const value = useContext(ThemeContext);
          if (!value) {
            throw new Error("useTheme must be used inside ThemeProvider");
          }
          return value;
        }

        export function useReducedMotion() {
          return false;
        }

        export function useEntitlements() {
          const value = useContext(ThemeContext);
          if (!value) {
            throw new Error("useEntitlements must be used inside ThemeProvider");
          }
          return resolveEntitlements(value.planId);
        }

        export function useLimits() {
          const entitlements = useEntitlements();
          return {
            exportsPerMonth: entitlements.plan.id === "free" ? 3 : entitlements.plan.id === "premium" ? 25 : 100,
          };
        }
      `,
  );
  addFile(
    files,
    "packages/react/src/providers/ShandaphaProvider.tsx",
    `export { ShandaphaProvider } from "../index";\n`,
  );
  addFile(
    files,
    "packages/react/src/providers/ThemeProvider.tsx",
    `export { ThemeProvider } from "../index";\n`,
  );
  addFile(
    files,
    "packages/react/src/adapters/wc/createReactWrapper.tsx",
    `export function createReactWrapper(tagName: string) { return tagName; }\n`,
  );
  addFile(
    files,
    "packages/react/src/adapters/wc/events.ts",
    `export const wcEventBridge = ["change", "open", "close"] as const;\n`,
  );
  addFile(
    files,
    "packages/react/src/hooks/useTheme.ts",
    `export { useTheme } from "../index";\n`,
  );
  addFile(
    files,
    "packages/react/src/hooks/useReducedMotion.ts",
    `export { useReducedMotion } from "../index";\n`,
  );
  addFile(
    files,
    "packages/react/src/hooks/useEntitlements.ts",
    `export { useEntitlements } from "../index";\n`,
  );
  addFile(
    files,
    "packages/react/src/hooks/useLimits.ts",
    `export { useLimits } from "../index";\n`,
  );

  addFile(
    files,
    "packages/cli/package.json",
    packageJson({
      name: "@shandapha/cli",
      description: "Shandapha CLI scaffold using the shared generator core.",
      scripts: {
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src bin",
        test: "vitest run",
        cli: "node ./bin/shandapha.mjs",
      },
      dependencies: {
        "@shandapha/contracts": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/generator": "workspace:*",
        "@shandapha/registry": "workspace:*",
      },
      bin: {
        shandapha: "./bin/shandapha.mjs",
      },
    }),
  );
  addFile(files, "packages/cli/tsconfig.json", sharedPackageTsconfig);
  addFile(
    files,
    "packages/cli/bin/shandapha.mjs",
    `
      #!/usr/bin/env node
      import { spawnSync } from "node:child_process";
      import { fileURLToPath } from "node:url";

      const file = fileURLToPath(new URL("../src/index.ts", import.meta.url));
      const result = spawnSync(process.execPath, ["--import", "tsx", file, ...process.argv.slice(2)], { stdio: "inherit" });
      process.exit(result.status ?? 1);
    `,
  );
  addFile(
    files,
    "packages/cli/src/index.ts",
    `
      import { createGenerationPlan, runDoctor } from "@shandapha/generator";
      import { buildRegistry } from "@shandapha/registry";
      import { resolveEntitlements } from "@shandapha/entitlements";
      import { runCommand } from "./shared/generatorBridge";

      const [command = "init", ...args] = process.argv.slice(2);

      const output = runCommand(command, args, {
        createGenerationPlan,
        runDoctor,
        buildRegistry,
        resolveEntitlements,
      });

      if (typeof output === "string") {
        console.log(output);
      } else {
        console.log(JSON.stringify(output, null, 2));
      }
    `,
  );
  addFile(
    files,
    "packages/cli/src/shared/generatorBridge.ts",
    `
      export function runCommand(
        command: string,
        args: string[],
        deps: Record<string, (...commandArgs: any[]) => unknown>,
      ) {
        switch (command) {
          case "init":
            return deps.createGenerationPlan({
              framework: args.includes("--framework=react") ? "react-vite" : "next-app-router",
              intent: args.includes("--existing") ? "existing-project" : "new-project",
              packId: args.includes("--pack=glass") ? "glass" : "normal",
              planId: args.includes("--business") ? "business" : args.includes("--premium") ? "premium" : "free",
              templates: ["dashboard-home", "pricing-basic"],
              modules: args.includes("--datatable") ? ["datatable"] : [],
            });
          case "add-template":
            return { added: args[0] ?? "dashboard-home" };
          case "add-pack":
            return { added: args[0] ?? "normal" };
          case "add-module":
            return { added: args[0] ?? "datatable" };
          case "doctor":
            return deps.runDoctor({ hasProvider: true, hasStyles: true, hasTokens: true, packLocked: true });
          case "upgrade":
            return deps.resolveEntitlements("premium");
          default:
            return \`Unknown command: \${command}\`;
        }
      }
    `,
  );
  addFile(
    files,
    "packages/cli/src/shared/registryBridge.ts",
    `export function registryBridge() { return "registry-ready"; }\n`,
  );
  addFile(
    files,
    "packages/cli/src/ui/prompts.ts",
    `export const cliPrompts = ["framework", "pack", "templates", "modules"] as const;\n`,
  );
  addFile(
    files,
    "packages/cli/src/ui/output.ts",
    `export function formatOutput(value: unknown) { return JSON.stringify(value, null, 2); }\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/init.ts",
    `export const initCommand = "shandapha init";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/add-component.ts",
    `export const addComponentCommand = "shandapha add-component";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/add-template.ts",
    `export const addTemplateCommand = "shandapha add-template";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/add-pack.ts",
    `export const addPackCommand = "shandapha add-pack";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/add-module.ts",
    `export const addModuleCommand = "shandapha add-module";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/theme.ts",
    `export const themeCommand = "shandapha theme";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/doctor.ts",
    `export const doctorCommand = "shandapha doctor";\n`,
  );
  addFile(
    files,
    "packages/cli/src/commands/upgrade.ts",
    `export const upgradeCommand = "shandapha upgrade";\n`,
  );

  addFile(
    files,
    "packages/generator/src/engine/plan.ts",
    `export { createGenerationPlan } from "../index";\n`,
  );
  addFile(
    files,
    "packages/generator/src/engine/render.ts",
    `export function renderPlanSummary(plan: { checklist: string[] }) { return plan.checklist.join("\\n"); }\n`,
  );
  addFile(
    files,
    "packages/generator/src/engine/deterministic.ts",
    `export function deterministicId(input: string) { return input.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }\n`,
  );
  addFile(
    files,
    "packages/generator/src/engine/files.ts",
    `export const fileOperations = ["create", "patch", "remove"] as const;\n`,
  );
  addFile(
    files,
    "packages/generator/src/engine/patchApply.ts",
    `export function patchApply() { return "minimal-and-reversible"; }\n`,
  );
  addFile(
    files,
    "packages/generator/src/engine/uninstall.ts",
    `export function uninstall() { return ["remove tokens.json", "remove theme.css"]; }\n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/starters/react-vite.ts",
    `export const reactViteRecipe = "react-vite";\n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/starters/next-app-router.ts",
    `export const nextAppRouterRecipe = "next-app-router";\n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/starters/wc-universal.ts",
    `export const wcUniversalRecipe = "wc-universal";\n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/starters/blazor-wc.ts",
    `export const blazorWcRecipe = "blazor-wc";\n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/patches/existing-react.ts",
    `export const existingReactPatch = ["add packages", "add ThemeProvider wrapper"]; \n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/patches/existing-next.ts",
    `export const existingNextPatch = ["add theme.css", "add verification page"]; \n`,
  );
  addFile(
    files,
    "packages/generator/src/recipes/patches/existing-other-framework.ts",
    `export const existingOtherFrameworkPatch = ["import WC bundle", "import theme asset", "custom event mapping"]; \n`,
  );
  addFile(
    files,
    "packages/generator/src/steps/brandKit.ts",
    `export const brandKitStep = "brand-kit";\n`,
  );
  addFile(
    files,
    "packages/generator/src/steps/stylePack.ts",
    `export const stylePackStep = "style-pack";\n`,
  );
  addFile(
    files,
    "packages/generator/src/steps/templates.ts",
    `export const templatesStep = "templates";\n`,
  );
  addFile(
    files,
    "packages/generator/src/steps/modules.ts",
    `export const modulesStep = "modules";\n`,
  );
  addFile(
    files,
    "packages/generator/src/steps/entitlements.ts",
    `export const entitlementsStep = "entitlements";\n`,
  );
  addFile(
    files,
    "packages/generator/src/output/manifests/diffReport.ts",
    `export const diffReportManifest = "diff-report";\n`,
  );
  addFile(
    files,
    "packages/generator/src/output/manifests/checklist.ts",
    `export const checklistManifest = "checklist";\n`,
  );
  addFile(
    files,
    "packages/generator/src/output/manifests/uninstall.ts",
    `export const uninstallManifestName = "uninstall";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/themeLoaded.ts",
    `export const themeLoadedCheck = "theme-loaded";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/providerWrapped.ts",
    `export const providerWrappedCheck = "provider-wrapped";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/stylesPresent.ts",
    `export const stylesPresentCheck = "styles-present";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/wcImported.ts",
    `export const wcImportedCheck = "wc-imported";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/a11ySanity.ts",
    `export const a11ySanityCheck = "a11y-sanity";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/checks/driftClean.ts",
    `export const driftCleanCheck = "drift-clean";\n`,
  );
  addFile(
    files,
    "packages/generator/src/doctor/runDoctor.ts",
    `export { runDoctor } from "../index";\n`,
  );

  addFile(
    files,
    "packages/entitlements/src/resolveEntitlements.ts",
    `export { resolveEntitlements } from "./index";\n`,
  );
  addFile(
    files,
    "packages/entitlements/src/featureMap.ts",
    `export { featureMap } from "./index";\n`,
  );
  addFile(
    files,
    "packages/entitlements/src/gates/requireFeature.ts",
    `export { requireFeature } from "../index";\n`,
  );
  addFile(
    files,
    "packages/entitlements/src/gates/requirePack.ts",
    `export { requirePack } from "../index";\n`,
  );
  addFile(
    files,
    "packages/entitlements/src/copy/upgradeMoments.ts",
    `export { upgradeCopy as upgradeMoments } from "../index";\n`,
  );
  addFile(
    files,
    "packages/entitlements/src/copy/nudgeTone.ts",
    `export const nudgeTone = "supportive";\n`,
  );

  addFile(
    files,
    "packages/business/src/governance/orgDefaults.ts",
    `export { orgDefaults } from "../index";\n`,
  );
  addFile(
    files,
    "packages/business/src/governance/presetRegistry.ts",
    `export const presetRegistry = ["brand-safe", "team-safe"] as const;\n`,
  );
  addFile(
    files,
    "packages/business/src/governance/tokenApprovals.ts",
    `export const tokenApprovals = true;\n`,
  );
  addFile(
    files,
    "packages/business/src/governance/templateApprovals.ts",
    `export const templateApprovals = true;\n`,
  );
  addFile(
    files,
    "packages/business/src/audit/auditTrail.ts",
    `export const auditTrail = "workspace-audit-trail";\n`,
  );
  addFile(
    files,
    "packages/business/src/audit/retention.ts",
    `export const retention = 90;\n`,
  );
  addFile(
    files,
    "packages/business/src/audit/exports.ts",
    `export const auditExport = "csv";\n`,
  );
  addFile(
    files,
    "packages/business/src/enforcement/driftDetection.ts",
    `export const driftDetection = "enabled";\n`,
  );
  addFile(
    files,
    "packages/business/src/enforcement/policyReports.ts",
    `export { policyReports } from "../index";\n`,
  );

  addFile(
    files,
    "packages/sdk/src/studio-client/index.ts",
    `export { studioClient } from "../index";\n`,
  );
  addFile(
    files,
    "packages/sdk/src/registry-client/index.ts",
    `export { registryClient } from "../index";\n`,
  );
  addFile(
    files,
    "packages/sdk/src/billing-client/index.ts",
    `export { billingClient } from "../index";\n`,
  );

  addFile(
    files,
    "packages/testing/src/a11y/axe.ts",
    `export const axeProfile = "wc-and-react";\n`,
  );
  addFile(
    files,
    "packages/testing/src/visual/playwright.ts",
    `export const playwrightProfile = "visual-regression";\n`,
  );
  addFile(
    files,
    "packages/testing/src/contracts/schemaTests.ts",
    `export const schemaTests = ["tokens", "templates", "packs", "registry"] as const;\n`,
  );
  addFile(
    files,
    "packages/testing/src/contracts/typeTests.ts",
    `export const typeTests = ["generation-plan", "entitlements"] as const;\n`,
  );
  addFile(
    files,
    "packages/testing/src/generator/snapshotTests.ts",
    `export const snapshotTests = ["starter-export", "patch-install"] as const;\n`,
  );
  addFile(
    files,
    "packages/testing/src/generator/patchTests.ts",
    `export const patchTests = ["existing-react", "existing-next", "blazor-wc"] as const;\n`,
  );

  addFile(
    files,
    "packages/registry/src/index.test.ts",
    `import { describe, expect, it } from "vitest";\nimport { buildRegistry } from "./index";\n\ndescribe("registry", () => {\n  it("builds pack and template data", () => {\n    const registry = buildRegistry();\n    expect(registry.packs.length).toBeGreaterThanOrEqual(3);\n    expect(registry.templates.length).toBeGreaterThan(0);\n  });\n});\n`,
  );
  addFile(
    files,
    "packages/generator/src/index.test.ts",
    `import { describe, expect, it } from "vitest";\nimport { createGenerationPlan } from "./index";\n\ndescribe("generator", () => {\n  it("creates a reversible plan", () => {\n    const plan = createGenerationPlan({ framework: "next-app-router", intent: "existing-project", packId: "normal", planId: "free", templates: ["dashboard-home"], modules: [] });\n    expect(plan.uninstallManifest.length).toBeGreaterThan(0);\n  });\n});\n`,
  );

  addFile(
    files,
    "apps/web/package.json",
    packageJson({
      name: "@shandapha/web",
      description: "Marketing, docs, catalog, and playground app.",
      scripts: {
        dev: "next dev --port 3000",
        build: "next build",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        next: versions.next,
        react: versions.react,
        "react-dom": versions.reactDom,
        "@shandapha/core": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/layouts": "workspace:*",
        "@shandapha/packs": "workspace:*",
        "@shandapha/react": "workspace:*",
        "@shandapha/registry": "workspace:*",
        "@shandapha/templates": "workspace:*",
        "@shandapha/tokens": "workspace:*",
      },
    }),
  );
  addFile(
    files,
    "apps/web/tsconfig.json",
    tsconfig("../../configs/tsconfig.base.json", {
      compilerOptions: {
        jsx: "preserve",
        plugins: [{ name: "next" }],
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["next-env.d.ts", "src/**/*", ".next/types/**/*.ts"],
    }),
  );
  addFile(
    files,
    "apps/web/next-env.d.ts",
    `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`,
  );
  addFile(
    files,
    "apps/web/next.config.ts",
    `
      import type { NextConfig } from "next";

      const nextConfig: NextConfig = {
        transpilePackages: [
          "@shandapha/core",
          "@shandapha/entitlements",
          "@shandapha/layouts",
          "@shandapha/packs",
          "@shandapha/react",
          "@shandapha/registry",
          "@shandapha/templates",
          "@shandapha/tokens",
        ],
      };

      export default nextConfig;
    `,
  );
  addFile(
    files,
    "apps/web/src/app/layout.tsx",
    `
      import type { Metadata } from "next";
      import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
      import { ShandaphaProvider } from "@shandapha/react";
      import "@/styles/globals.css";

      const bodyFont = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
      const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "700"] });

      export const metadata: Metadata = {
        title: "Shandapha",
        description: "UI platform with semantic tokens, packs, templates, wizard, CLI, and reversible patch install.",
      };

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en" className={\`\${bodyFont.variable} \${displayFont.variable}\`}>
            <body>
              <ShandaphaProvider>{children}</ShandaphaProvider>
            </body>
          </html>
        );
      }
    `,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/layout.tsx",
    `export default function MarketingLayout({ children }: { children: React.ReactNode }) { return children; }\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/page.tsx",
    makeIndexRoute("home", "@/lib/site-content", "renderMarketingPage"),
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/pricing/page.tsx",
    makeIndexRoute("pricing", "@/lib/site-content", "renderMarketingPage"),
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/templates/page.tsx",
    `import { renderTemplatesIndexPage } from "@/lib/site-content";\n\nexport default function TemplatesPage() {\n  return renderTemplatesIndexPage();\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/templates/[slug]/page.tsx",
    `import { renderTemplateDetailPage } from "@/lib/site-content";\n\nexport default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {\n  const resolved = await params;\n  return renderTemplateDetailPage(resolved.slug);\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/packs/page.tsx",
    `import { renderPacksIndexPage } from "@/lib/site-content";\n\nexport default function PacksPage() {\n  return renderPacksIndexPage();\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/packs/[slug]/page.tsx",
    `import { renderPackDetailPage } from "@/lib/site-content";\n\nexport default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {\n  const resolved = await params;\n  return renderPackDetailPage(resolved.slug);\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/enterprise/page.tsx",
    makeIndexRoute("enterprise", "@/lib/site-content", "renderMarketingPage"),
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/changelog/page.tsx",
    makeIndexRoute("changelog", "@/lib/site-content", "renderMarketingPage"),
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/trust/security/page.tsx",
    `import { renderTrustPage } from "@/lib/site-content";\n\nexport default function SecurityPage() {\n  return renderTrustPage("security");\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/trust/privacy/page.tsx",
    `import { renderTrustPage } from "@/lib/site-content";\n\nexport default function PrivacyPage() {\n  return renderTrustPage("privacy");\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/(marketing)/trust/terms/page.tsx",
    `import { renderTrustPage } from "@/lib/site-content";\n\nexport default function TermsPage() {\n  return renderTrustPage("terms");\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/docs/[[...slug]]/page.tsx",
    `import { renderDocsPage } from "@/lib/site-content";\n\nexport default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {\n  const resolved = await params;\n  return renderDocsPage(resolved.slug ?? []);\n}\n`,
  );
  addFile(
    files,
    "apps/web/src/app/playground/page.tsx",
    `import { ThemePlayground } from "@/components/site/theme-playground";\n\nexport default function PlaygroundPage() {\n  return <ThemePlayground />;\n}\n`,
  );

  addFile(
    files,
    "apps/web/src/lib/site-content.tsx",
    `
      import Link from "next/link";
      import { Badge, Button, StatePanel } from "@shandapha/core";
      import { Container, GridPreset, Inline, PageHeader, Section, Stack, Surface } from "@shandapha/layouts";
      import { plans } from "@shandapha/entitlements";
      import { packs, getPackBySlug } from "@shandapha/packs";
      import { buildRegistry, getTemplateBySlug } from "@shandapha/registry";

      const registry = buildRegistry();

      const marketingPages = {
        home: {
          eyebrow: "UI platform",
          title: "Two apps. One modular API. Moat in packages.",
          summary: "Shandapha keeps the expensive complexity centralized while the token contract, runtime, templates, packs, registry, and generator stay reusable across every surface.",
        },
        pricing: {
          eyebrow: "Pricing",
          title: "Free stays shippable. Paid speeds teams up without fake blockers.",
          summary: "Premium monetizes polish and convenience. Business monetizes governance and confidence.",
        },
        enterprise: {
          eyebrow: "Enterprise boundaries",
          title: "Clear seams now, expensive splits only when traffic justifies them.",
          summary: "Governance, audit, and policy reporting live inside the same API until real heat demands isolation.",
        },
        changelog: {
          eyebrow: "Changelog",
          title: "Registry-first releases across packs, templates, and generator recipes.",
          summary: "The website, Studio, and CLI all read the same source-of-truth manifests.",
        },
      } as const;

      function Shell({ children }: { children: React.ReactNode }) {
        return (
          <main style={{ background: "radial-gradient(circle at top, rgba(15,118,110,0.12), transparent 40%), linear-gradient(180deg, #f6f1e8 0%, #fcfbf8 100%)", color: "#0f172a", minHeight: "100vh" }}>
            <Container>
              <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0 0.75rem" }}>
                <Link href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Shandapha</Link>
                <Inline gap={12}>
                  <Link href="/templates">Templates</Link>
                  <Link href="/packs">Packs</Link>
                  <Link href="/docs">Docs</Link>
                  <Link href="/playground">Playground</Link>
                </Inline>
              </header>
              {children}
            </Container>
          </main>
        );
      }

      export function renderMarketingPage(id: keyof typeof marketingPages) {
        const page = marketingPages[id];
        return (
          <Shell>
            <Section title={page.eyebrow}>
              <Stack gap={24}>
                <PageHeader
                  title={page.title}
                  eyebrow={page.eyebrow}
                  actions={<Button type="button">Open Studio</Button>}
                />
                <p style={{ maxWidth: 720, fontSize: "1.15rem", lineHeight: 1.7, color: "var(--sh-color-text-muted, #475569)" }}>{page.summary}</p>
                <GridPreset preset="marketing">
                  <Surface title="Why this architecture">
                    <Stack gap={12}>
                      <Badge>Enterprise boundaries, founder economics</Badge>
                      <span>Wizard + CLI share the generator core.</span>
                      <span>Templates and packs stay first-class.</span>
                      <span>Heavy modules remain opt-in.</span>
                    </Stack>
                  </Surface>
                  <Surface title="What ships first">
                    <Stack gap={12}>
                      <span>Landing, docs, catalog, and playground.</span>
                      <span>Studio wizard, exports, workspaces, billing, and usage.</span>
                      <span>One modular API with room to split later.</span>
                    </Stack>
                  </Surface>
                </GridPreset>
              </Stack>
            </Section>

            <Section title="How it works">
              <GridPreset preset="dashboard">
                <Surface title="1. Preview">
                  <p>Pick a pack, tune the brand kit, and inspect templates before spending engineering time.</p>
                </Surface>
                <Surface title="2. Brand">
                  <p>Semantic tokens stay portable and user-owned across light/dark, density, and motion modes.</p>
                </Surface>
                <Surface title="3. Template">
                  <p>Templates drive serious productivity: shells, blocks, auth, billing, docs, and list/detail flows.</p>
                </Surface>
                <Surface title="4. Export or patch">
                  <p>New starter or reversible existing-project patch install, powered by the same generator core.</p>
                </Surface>
              </GridPreset>
            </Section>

            <Section title="Packs preview">
              <GridPreset preset="dashboard">
                {packs.map((pack) => (
                  <Surface key={pack.id} title={pack.name}>
                    <Stack gap={8}>
                      <Badge>{pack.tier}</Badge>
                      <p>{pack.tagline}</p>
                      <Link href={\`/packs/\${pack.slug}\`}>Open pack</Link>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>

            <Section title="Templates preview">
              <GridPreset preset="dashboard">
                {registry.templates.slice(0, 6).map((template) => (
                  <Surface key={template.slug} title={template.name}>
                    <Stack gap={8}>
                      <span>{template.summary}</span>
                      <Link href={\`/templates/\${template.slug}\`}>Open template</Link>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>

            <Section title="Pricing">
              <GridPreset preset="dashboard">
                {plans.map((plan) => (
                  <Surface key={plan.id} title={plan.name}>
                    <Stack gap={8}>
                      <strong>{plan.price}</strong>
                      <p>{plan.summary}</p>
                      <ul>
                        {plan.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>
          </Shell>
        );
      }

      export function renderTemplatesIndexPage() {
        return (
          <Shell>
            <Section title="Templates">
              <PageHeader title="Templates are first-class, not decoration." eyebrow="Catalog" />
              <GridPreset preset="dashboard">
                {registry.templates.map((template) => (
                  <Surface key={template.slug} title={template.name}>
                    <Stack gap={12}>
                      <span>{template.summary}</span>
                      <Badge>{template.group}</Badge>
                      <Link href={\`/templates/\${template.slug}\`}>View template</Link>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>
          </Shell>
        );
      }

      export function renderTemplateDetailPage(slug: string) {
        const template = getTemplateBySlug(slug);
        if (!template) {
          return renderTrustPage("terms");
        }

        return (
          <Shell>
            <Section title="Template detail">
              <PageHeader title={template.name} eyebrow={template.group} />
              <GridPreset preset="detail">
                <Surface title="Summary">
                  <Stack gap={12}>
                    <p>{template.summary}</p>
                    <StatePanel title="States" body={template.states.join(", ")} />
                    <StatePanel title="Variants" body={template.variants.join(", ")} />
                  </Stack>
                </Surface>
                <Surface title="Manifest">
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(template, null, 2)}</pre>
                </Surface>
              </GridPreset>
            </Section>
          </Shell>
        );
      }

      export function renderPacksIndexPage() {
        return (
          <Shell>
            <Section title="Packs">
              <PageHeader title="Packs transform the UI without forking components." eyebrow="Catalog" />
              <GridPreset preset="dashboard">
                {packs.map((pack) => (
                  <Surface key={pack.id} title={pack.name}>
                    <Stack gap={8}>
                      <p>{pack.description}</p>
                      <Badge>{pack.tier}</Badge>
                      <Link href={\`/packs/\${pack.slug}\`}>View pack</Link>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>
          </Shell>
        );
      }

      export function renderPackDetailPage(slug: string) {
        const pack = getPackBySlug(slug);
        if (!pack) {
          return renderTrustPage("security");
        }

        return (
          <Shell>
            <Section title="Pack detail">
              <PageHeader title={pack.name} eyebrow={pack.tier} />
              <GridPreset preset="detail">
                <Surface title="Description">
                  <p>{pack.description}</p>
                </Surface>
                <Surface title="Knobs">
                  <ul>
                    {pack.knobs.map((knob) => (
                      <li key={knob}>{knob}</li>
                    ))}
                  </ul>
                </Surface>
              </GridPreset>
            </Section>
          </Shell>
        );
      }

      export function renderTrustPage(kind: "security" | "privacy" | "terms") {
        return (
          <Shell>
            <Section title={routePathLabel(kind)}>
              <PageHeader title={routePathLabel(kind)} eyebrow="Trust" />
              <Surface title="Policy">
                <p>
                  {kind === "security"
                    ? "One backend, clear modules, and early audit seams keep the system understandable and cheaper to run."
                    : kind === "privacy"
                      ? "Tokens stay user-owned, telemetry remains privacy-safe, and patch installs are reversible."
                      : "Free stays trustworthy. Premium and business monetize speed and governance without fake blockers."}
                </p>
              </Surface>
            </Section>
          </Shell>
        );
      }

      export function renderDocsPage(slug: string[]) {
        const key = slug.length === 0 ? "index" : slug.join("/");
        const doc = ${JSON.stringify(docsPages, null, 2)}[key as keyof typeof ${JSON.stringify(docsPages, null, 2)}] ?? ${JSON.stringify(docsPages, null, 2)}["index"];

        return (
          <Shell>
            <Section title={doc.category}>
              <PageHeader title={doc.title} eyebrow="Docs" />
              <Surface title="Article">
                <Stack gap={12}>
                  <p>{doc.body}</p>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(doc, null, 2)}</pre>
                </Stack>
              </Surface>
            </Section>
          </Shell>
        );
      }
    `,
  );
  addFile(
    files,
    "apps/web/src/components/site/theme-playground.tsx",
    `
      "use client";

      import { startTransition, useDeferredValue, useState } from "react";
      import { Badge, Button, Input, Select } from "@shandapha/core";
      import { Container, GridPreset, Inline, PageHeader, Section, Stack, Surface } from "@shandapha/layouts";
      import { createPackTheme, packs } from "@shandapha/packs";
      import { defaultBrandKit } from "@shandapha/tokens";

      export function ThemePlayground() {
        const [packId, setPackId] = useState<"normal" | "glass" | "neon">("normal");
        const [primary, setPrimary] = useState(defaultBrandKit.primary);
        const deferredPrimary = useDeferredValue(primary);

        const theme = createPackTheme(packId, { ...defaultBrandKit, primary: deferredPrimary });

        return (
          <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f6f1e8 0%, #fffdf8 100%)", color: "#0f172a" }}>
            <Container>
              <Section title="Playground">
                <PageHeader title="Live theme editing with pack-aware previews." eyebrow="Playground" />
                <GridPreset preset="detail">
                  <Surface title="Controls">
                    <Stack gap={16}>
                      <label>
                        <strong>Pack</strong>
                        <Select value={packId} onChange={(event) => startTransition(() => setPackId(event.target.value as typeof packId))}>
                          {packs.map((pack) => (
                            <option key={pack.id} value={pack.id}>
                              {pack.name}
                            </option>
                          ))}
                        </Select>
                      </label>
                      <label>
                        <strong>Primary</strong>
                        <Input value={primary} onChange={(event) => setPrimary(event.target.value)} />
                      </label>
                      <Badge>{theme.pack.tagline}</Badge>
                    </Stack>
                  </Surface>
                  <Surface title="Preview">
                    <div
                      style={{
                        display: "grid",
                        gap: 16,
                        padding: 16,
                        borderRadius: 24,
                        background: theme.cssVariables["--sh-surface-canvas"],
                        color: theme.cssVariables["--sh-color-text"],
                      }}
                    >
                      <Inline gap={12}>
                        <Badge>{theme.pack.name}</Badge>
                        <Badge>{packId}</Badge>
                      </Inline>
                      <h2 style={{ margin: 0 }}>Preview -> brand -> template -> export</h2>
                      <p style={{ color: "var(--sh-color-text-muted, #475569)" }}>
                        The runtime stays small, packs transform surfaces, and the generator stays shared between the wizard and CLI.
                      </p>
                      <Button type="button">Try export</Button>
                    </div>
                  </Surface>
                </GridPreset>
              </Section>
            </Container>
          </main>
        );
      }
    `,
  );
  addFile(
    files,
    "apps/web/src/components/site/section-heading.tsx",
    `export function SectionHeading({ title }: { title: string }) { return <h2>{title}</h2>; }\n`,
  );
  addFile(
    files,
    "apps/web/src/components/marketing/hero-card.tsx",
    `export function HeroCard({ title }: { title: string }) { return <div>{title}</div>; }\n`,
  );
  addFile(
    files,
    "apps/web/src/components/seo/metadata.ts",
    `export const defaultSeo = { openGraphType: "website" } as const;\n`,
  );
  addFile(
    files,
    "apps/web/src/lib/registry/index.ts",
    `export { buildRegistry } from "@shandapha/registry";\n`,
  );
  addFile(
    files,
    "apps/web/src/lib/pricing/index.ts",
    `export const pricingPath = "/pricing";\n`,
  );
  addFile(
    files,
    "apps/web/src/lib/analytics/index.ts",
    `export const analyticsMode = "privacy-safe";\n`,
  );
  addFile(
    files,
    "apps/web/src/lib/mdx/index.ts",
    `export const mdxMode = "registry-backed";\n`,
  );
  addFile(
    files,
    "apps/web/src/styles/globals.css",
    `
      :root {
        --sh-color-primary: #0f766e;
        --sh-color-accent: #f97316;
        --sh-color-text: #0f172a;
        --sh-color-text-muted: #475569;
        --sh-surface-canvas: rgba(255, 253, 247, 0.86);
        --sh-surface-raised: rgba(255, 255, 255, 0.88);
        --sh-border-default: rgba(15, 23, 42, 0.12);
        --sh-radius-md: 18px;
        --sh-radius-lg: 26px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        font-family: var(--font-body), sans-serif;
      }

      body {
        margin: 0;
        font-family: var(--font-body), sans-serif;
      }

      h1,
      h2,
      h3,
      h4 {
        font-family: var(--font-display), sans-serif;
      }

      a {
        color: inherit;
      }
    `,
  );
  addFile(
    files,
    "apps/web/src/styles/marketing.css",
    `.marketing-grid { display: grid; gap: 24px; }\n`,
  );
  addFile(
    files,
    "apps/web/src/content/docs/getting-started.md",
    `# Getting started\n\nShandapha is a UI platform, not just a component pack. Start in Studio, choose a runtime, tune the brand kit, select templates, and export either a starter or a reversible patch install.\n`,
  );
  addFile(
    files,
    "apps/web/src/content/blog/launch.md",
    `# Launch\n\nShandapha launches with two apps, one modular API, and the real moat in packages. That keeps operating cost low while tokens, packs, templates, registry, and generator logic keep compounding.\n`,
  );
  addFile(files, "apps/web/public/images/.gitkeep", ``);
  addFile(files, "apps/web/public/og/.gitkeep", ``);
  addFile(files, "apps/web/public/icons/.gitkeep", ``);
  addFile(files, "apps/web/public/fonts/.gitkeep", ``);
  addFile(
    files,
    "apps/web/src/marketing/landing/variants/default.ts",
    `export const landingVariant = "default";\n`,
  );
  addFile(
    files,
    "apps/web/src/marketing/landing/variants/dev-first.ts",
    `export const landingVariant = "dev-first";\n`,
  );
  addFile(
    files,
    "apps/web/src/marketing/landing/variants/team-first.ts",
    `export const landingVariant = "team-first";\n`,
  );
  for (const section of [
    "hero",
    "logos",
    "value-prop",
    "templates-preview",
    "packs-preview",
    "how-it-works",
    "upgrade-moments",
    "pricing",
    "faq",
    "final-cta",
  ]) {
    addFile(
      files,
      `apps/web/src/marketing/landing/sections/${section}/README.md`,
      `# ${section}\n\nDocument the purpose, trust goals, and success criteria for this landing section so the marketing surface stays intentional instead of turning into placeholder copy.\n`,
    );
  }

  addFile(
    files,
    "apps/studio/package.json",
    packageJson({
      name: "@shandapha/studio",
      description: "Wizard and control-plane product app.",
      scripts: {
        dev: "next dev --port 3001",
        build: "next build",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
      },
      dependencies: {
        next: versions.next,
        react: versions.react,
        "react-dom": versions.reactDom,
        "@shandapha/core": "workspace:*",
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/generator": "workspace:*",
        "@shandapha/layouts": "workspace:*",
        "@shandapha/packs": "workspace:*",
        "@shandapha/react": "workspace:*",
        "@shandapha/registry": "workspace:*",
        "@shandapha/templates": "workspace:*",
      },
    }),
  );
  addFile(
    files,
    "apps/studio/tsconfig.json",
    tsconfig("../../configs/tsconfig.base.json", {
      compilerOptions: {
        jsx: "preserve",
        plugins: [{ name: "next" }],
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["next-env.d.ts", "src/**/*", ".next/types/**/*.ts"],
    }),
  );
  addFile(
    files,
    "apps/studio/next-env.d.ts",
    `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`,
  );
  addFile(
    files,
    "apps/studio/next.config.ts",
    `
      import type { NextConfig } from "next";

      const nextConfig: NextConfig = {
        transpilePackages: [
          "@shandapha/core",
          "@shandapha/entitlements",
          "@shandapha/generator",
          "@shandapha/layouts",
          "@shandapha/packs",
          "@shandapha/react",
          "@shandapha/registry",
          "@shandapha/templates",
        ],
      };

      export default nextConfig;
    `,
  );
  addFile(
    files,
    "apps/studio/src/app/layout.tsx",
    `
      import type { Metadata } from "next";
      import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
      import { ShandaphaProvider } from "@shandapha/react";
      import "@/styles/globals.css";

      const bodyFont = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
      const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "700"] });

      export const metadata: Metadata = {
        title: "Shandapha Studio",
        description: "Wizard, exports, workspaces, billing, and usage on a shared generator core.",
      };

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en" className={\`\${bodyFont.variable} \${displayFont.variable}\`}>
            <body>
              <ShandaphaProvider initialPack="normal" planId="premium">{children}</ShandaphaProvider>
            </body>
          </html>
        );
      }
    `,
  );
  addFile(
    files,
    "apps/studio/src/app/(product)/layout.tsx",
    `export default function ProductLayout({ children }: { children: React.ReactNode }) { return children; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/app/(public)/sign-in/page.tsx",
    `import { renderPublicPage } from "@/lib/studio-content";\n\nexport default function SignInPage() {\n  return renderPublicPage("sign-in");\n}\n`,
  );
  addFile(
    files,
    "apps/studio/src/app/(public)/sign-up/page.tsx",
    `import { renderPublicPage } from "@/lib/studio-content";\n\nexport default function SignUpPage() {\n  return renderPublicPage("sign-up");\n}\n`,
  );
  addFile(
    files,
    "apps/studio/src/app/(product)/wizard/page.tsx",
    `import { renderWizardPage } from "@/lib/studio-content";\n\nexport default function WizardIntentPage() {\n  return renderWizardPage("intent");\n}\n`,
  );
  for (const step of wizardSteps.slice(1)) {
    addFile(
      files,
      `apps/studio/src/app/(product)${step.route}/page.tsx`,
      `import { renderWizardPage } from "@/lib/studio-content";\n\nexport default function ${routePathLabel(step.id).replace(/ /g, "")}Page() {\n  return renderWizardPage("${step.id}");\n}\n`,
    );
  }
  addFile(
    files,
    "apps/studio/src/app/(product)/workspaces/page.tsx",
    `import { renderWorkspaceLandingPage } from "@/lib/studio-content";\n\nexport default function WorkspacesPage() {\n  return renderWorkspaceLandingPage();\n}\n`,
  );
  for (const section of workspaceSections) {
    addFile(
      files,
      `apps/studio/src/app/(product)/workspaces/[workspaceId]/${section}/page.tsx`,
      `import { renderWorkspacePage } from "@/lib/studio-content";\n\nexport default async function ${routePathLabel(section).replace(/ /g, "")}Page({ params }: { params: Promise<{ workspaceId: string }> }) {\n  const resolved = await params;\n  return renderWorkspacePage("${section}", resolved.workspaceId);\n}\n`,
    );
  }

  addFile(
    files,
    "apps/studio/src/lib/studio-content.tsx",
    `
      import Link from "next/link";
      import { Badge, Button, StatePanel, TableBasic } from "@shandapha/core";
      import { createGenerationPlan } from "@shandapha/generator";
      import { Container, GridPreset, Inline, PageHeader, Section, Stack, Surface } from "@shandapha/layouts";
      import { plans } from "@shandapha/entitlements";
      import { packs } from "@shandapha/packs";
      import { buildRegistry } from "@shandapha/registry";

      const registry = buildRegistry();
      const wizardSteps = ${JSON.stringify(wizardSteps, null, 2)} as const;

      function StudioShell({ children }: { children: React.ReactNode }) {
        return (
          <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0b1524 0%, #102542 100%)", color: "#f8fafc" }}>
            <Container>
              <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0 0.75rem" }}>
                <Link href="/wizard" style={{ textDecoration: "none", color: "inherit", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Studio</Link>
                <Inline gap={12}>
                  <Link href="/wizard">Wizard</Link>
                  <Link href="/workspaces">Workspaces</Link>
                </Inline>
              </header>
              {children}
            </Container>
          </main>
        );
      }

      export function renderPublicPage(kind: "sign-in" | "sign-up") {
        return (
          <StudioShell>
            <Section title="Access">
              <GridPreset preset="form">
                <Surface title={kind === "sign-in" ? "Sign in" : "Create account"}>
                  <Stack gap={16}>
                    <p>{kind === "sign-in" ? "Resume the wizard, exports, and workspace control plane." : "Start with a premium-feeling default and grow into governance later."}</p>
                    <Button type="button">{kind === "sign-in" ? "Continue" : "Create workspace"}</Button>
                  </Stack>
                </Surface>
              </GridPreset>
            </Section>
          </StudioShell>
        );
      }

      export function renderWizardPage(stepId: string) {
        const step = wizardSteps.find((entry) => entry.id === stepId) ?? wizardSteps[0];
        const plan = createGenerationPlan({
          framework: stepId === "framework" ? "react-vite" : "next-app-router",
          intent: stepId === "intent" ? "preview-only" : "existing-project",
          packId: stepId === "style-pack" ? "glass" : "normal",
          planId: stepId === "features" || stepId === "export" ? "premium" : "free",
          templates: ["dashboard-home", "pricing-basic", "docs-home"],
          modules: stepId === "features" ? ["datatable"] : [],
        });

        return (
          <StudioShell>
            <Section title="Wizard">
              <Stack gap={24}>
                <PageHeader title={step.title} eyebrow="Primary product surface" actions={<Button type="button">Save step</Button>} />
                <GridPreset preset="detail">
                  <Surface title="Step detail">
                    <Stack gap={12}>
                      <p>{step.description}</p>
                      <Badge>{step.route}</Badge>
                      <Inline gap={8}>
                        {wizardSteps.map((entry) => (
                          <Link key={entry.id} href={entry.route} style={{ color: entry.id === step.id ? "#fdba74" : "inherit" }}>
                            {entry.title}
                          </Link>
                        ))}
                      </Inline>
                    </Stack>
                  </Surface>
                  <Surface title="Shared generator preview">
                    <Stack gap={12}>
                      <StatePanel title="Selected pack" body={plan.selectedPack.name} />
                      <StatePanel title="Templates" body={plan.selectedTemplates.map((template) => template.name).join(", ")} />
                      <StatePanel title="Doctor" body={plan.doctorChecks.map((check) => \`\${check.label}: \${check.status}\`).join(" | ")} />
                    </Stack>
                  </Surface>
                </GridPreset>
              </Stack>
            </Section>
          </StudioShell>
        );
      }

      export function renderWorkspaceLandingPage() {
        return (
          <StudioShell>
            <Section title="Workspaces">
              <PageHeader title="Workspaces keep the wizard, exports, billing, and governance in one product app." eyebrow="Control plane" />
              <GridPreset preset="dashboard">
                {["Acme", "Nova", "Helio"].map((workspace) => (
                  <Surface key={workspace} title={workspace}>
                    <Stack gap={8}>
                      <p>Saved themes, export history, usage, members, API keys, and policy surfaces all stay local to one workspace.</p>
                      <Link href={\`/workspaces/\${workspace.toLowerCase()}/overview\`}>Open workspace</Link>
                    </Stack>
                  </Surface>
                ))}
              </GridPreset>
            </Section>
          </StudioShell>
        );
      }

      export function renderWorkspacePage(section: string, workspaceId: string) {
        const planRows = plans.map((plan) => ({ plan: plan.name, price: plan.price, focus: plan.summary }));
        return (
          <StudioShell>
            <Section title="Workspace">
              <Stack gap={24}>
                <PageHeader title={\`\${workspaceId} / \${section}\`} eyebrow="Workspace surface" />
                <GridPreset preset="detail">
                  <Surface title="Navigation">
                    <Stack gap={10}>
                      ${workspaceSections.map((entry) => `<Link href={\`/workspaces/\${workspaceId}/${entry}\`}>${entry}</Link>`).join("\n                      ")}
                    </Stack>
                  </Surface>
                  <Surface title="Section summary">
                    <Stack gap={12}>
                      <p>This section is scaffolded inside the Studio app instead of being split into a separate ops product.</p>
                      <Badge>{section}</Badge>
                      <TableBasic rows={planRows} />
                      <p>Registry packages available: {registry.modules.map((module) => module.name).join(", ")}</p>
                    </Stack>
                  </Surface>
                </GridPreset>
              </Stack>
            </Section>
          </StudioShell>
        );
      }
    `,
  );
  addFile(
    files,
    "apps/studio/src/components/shell/product-shell.tsx",
    `export function ProductShell({ children }: { children: React.ReactNode }) { return children; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/components/wizard/step-card.tsx",
    `export function StepCard({ title }: { title: string }) { return <div>{title}</div>; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/components/billing/billing-summary.tsx",
    `export function BillingSummary() { return <div>Billing summary</div>; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/components/usage/usage-summary.tsx",
    `export function UsageSummary() { return <div>Usage summary</div>; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/components/governance/policy-panel.tsx",
    `export function PolicyPanel() { return <div>Policy panel</div>; }\n`,
  );
  addFile(
    files,
    "apps/studio/src/lib/api/index.ts",
    `export const apiBaseUrl = "http://localhost:4000";\n`,
  );
  addFile(
    files,
    "apps/studio/src/lib/auth/index.ts",
    `export const authMode = "workspace-scoped";\n`,
  );
  addFile(
    files,
    "apps/studio/src/lib/session/index.ts",
    `export const sessionStrategy = "cookie";\n`,
  );
  addFile(
    files,
    "apps/studio/src/lib/telemetry/index.ts",
    `export const telemetryStrategy = "privacy-safe";\n`,
  );
  addFile(
    files,
    "apps/studio/src/lib/registry/index.ts",
    `export { buildRegistry } from "@shandapha/registry";\n`,
  );
  addFile(
    files,
    "apps/studio/src/state/wizard.store.ts",
    `export const wizardStore = { currentStep: "intent", framework: "next-app-router" } as const;\n`,
  );
  addFile(
    files,
    "apps/studio/src/state/workspace.store.ts",
    `export const workspaceStore = { selectedWorkspace: "acme" } as const;\n`,
  );
  addFile(
    files,
    "apps/studio/src/styles/globals.css",
    `
      :root {
        --sh-color-primary: #2dd4bf;
        --sh-color-accent: #fdba74;
        --sh-border-default: rgba(148, 163, 184, 0.28);
        --sh-surface-raised: rgba(11, 21, 36, 0.68);
      }

      * {
        box-sizing: border-box;
      }

      html {
        font-family: var(--font-body), sans-serif;
      }

      body {
        margin: 0;
        font-family: var(--font-body), sans-serif;
      }

      h1,
      h2,
      h3,
      h4 {
        font-family: var(--font-display), sans-serif;
      }

      a {
        color: inherit;
      }
    `,
  );

  addFile(
    files,
    "apps/storybook/package.json",
    packageJson({
      name: "@shandapha/storybook",
      description:
        "Story catalog workspace for foundations, templates, modules, and packs.",
      scripts: {
        dev: "node --import tsx ./src/dev.ts",
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src .storybook",
        test: "vitest run",
      },
      dependencies: {
        "@shandapha/core": "workspace:*",
        "@shandapha/layouts": "workspace:*",
        "@shandapha/module-datatable": "workspace:*",
        "@shandapha/packs": "workspace:*",
        "@shandapha/templates": "workspace:*",
      },
    }),
  );
  addFile(
    files,
    "apps/storybook/tsconfig.json",
    tsconfig("../../configs/tsconfig.base.json", {
      include: ["src/**/*", ".storybook/**/*"],
    }),
  );
  addFile(
    files,
    "apps/storybook/.storybook/main.ts",
    `const config = {\n  stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.@(ts|tsx)"],\n  docs: { autodocs: "tag" },\n  core: { disableTelemetry: true },\n};\n\nexport default config;\n`,
  );
  addFile(
    files,
    "apps/storybook/.storybook/preview.ts",
    `const preview = {\n  parameters: {\n    layout: "fullscreen",\n    controls: { expanded: true, sort: "requiredFirst" },\n  },\n};\n\nexport default preview;\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/foundations/README.md",
    `# Foundations stories\n\nUse this group to review semantic tokens, density, motion, and visible focus rules before looking at component-level polish.\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/core/README.md",
    `# Core stories\n\nCore stories cover the free shippable baseline: form controls, feedback states, and table basics.\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/layouts/README.md",
    `# Layout stories\n\nLayout stories exercise the anti-grid-drift layer so spacing and shell structure stay disciplined.\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/templates/README.md",
    `# Template stories\n\nTemplate stories prove that pages are first-class product assets and should cover their major state variants.\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/modules/README.md",
    `# Module stories\n\nModule stories are for opt-in heavy features that should stay isolated from the free core.\n`,
  );
  addFile(
    files,
    "apps/storybook/src/stories/packs/README.md",
    `# Pack stories\n\nPack stories compare how the same UI contract shifts under Normal, Glass, and Neon.\n`,
  );

  addFile(
    files,
    "services/platform-api/package.json",
    packageJson({
      name: "@shandapha/platform-api",
      description:
        "Modular monolith API for auth, workspaces, billing, entitlements, registry, exports, audit, telemetry, and notifications.",
      scripts: {
        dev: "tsx watch src/index.ts",
        build: "tsc --project tsconfig.json",
        typecheck: "tsc --project tsconfig.json",
        lint: "biome check --config-path ../../configs/biome.json src",
        test: "vitest run",
        start: "node --import tsx src/index.ts",
      },
      dependencies: {
        "@shandapha/entitlements": "workspace:*",
        "@shandapha/generator": "workspace:*",
        "@shandapha/registry": "workspace:*",
      },
    }),
  );
  addFile(
    files,
    "services/platform-api/tsconfig.json",
    tsconfig("../../configs/tsconfig.base.json", { include: ["src/**/*"] }),
  );
  addFile(
    files,
    "services/platform-api/src/index.ts",
    `
      import { createServer } from "./server/app";

      const port = Number(process.env.PORT ?? 4000);
      const server = createServer();

      server.listen(port, () => {
        console.log(\`Shandapha platform-api listening on http://localhost:\${port}\`);
      });
    `,
  );
  addFile(
    files,
    "services/platform-api/src/server/app.ts",
    `
      import { createServer as createNodeServer } from "node:http";
      import { createRoutes } from "./routes";

      export function createServer() {
        const routes = createRoutes();

        return createNodeServer(async (request, response) => {
          const route = routes.find((entry) => entry.method === request.method && entry.path === (request.url ?? "/"));

          if (!route) {
            response.writeHead(404, { "content-type": "application/json" });
            response.end(JSON.stringify({ error: "not-found" }));
            return;
          }

          const payload = await route.handler();
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(payload, null, 2));
        });
      }
    `,
  );
  addFile(
    files,
    "services/platform-api/src/server/routes.ts",
    `
      import { createGenerationPlan } from "@shandapha/generator";
      import { buildRegistry } from "@shandapha/registry";
      import { resolveEntitlements } from "@shandapha/entitlements";
      ${apiModules.map((module) => `import { ${module.id}Routes } from "../modules/${module.id}/api/${module.id}.routes";`).join("\n      ")}

      export interface PlatformRoute {
        method: "GET";
        path: string;
        handler: () => Promise<unknown> | unknown;
      }

      export function createRoutes(): PlatformRoute[] {
        return [
          {
            method: "GET",
            path: "/health",
            handler: () => ({ ok: true, service: "platform-api", modules: ${apiModules.length} }),
          },
          {
            method: "GET",
            path: "/api/registry/catalog",
            handler: () => buildRegistry(),
          },
          {
            method: "GET",
            path: "/api/exports/plan",
            handler: () => createGenerationPlan({
              framework: "next-app-router",
              intent: "existing-project",
              packId: "normal",
              planId: "premium",
              templates: ["dashboard-home", "pricing-basic"],
              modules: ["datatable"],
            }),
          },
          {
            method: "GET",
            path: "/api/billing/plans",
            handler: () => resolveEntitlements("premium"),
          },
          ${apiModules.map((module) => `...${module.id}Routes,`).join("\n          ")}
        ];
      }
    `,
  );
  addFile(
    files,
    "services/platform-api/src/server/middleware/auth.ts",
    `export const authMiddleware = "workspace-cookie";\n`,
  );
  addFile(
    files,
    "services/platform-api/src/server/middleware/errors.ts",
    `export function toErrorResponse(error: Error) { return { message: error.message }; }\n`,
  );
  addFile(
    files,
    "services/platform-api/src/server/middleware/rate-limit.ts",
    `export const rateLimit = { requestsPerMinute: 120 } as const;\n`,
  );
  addFile(
    files,
    "services/platform-api/src/server/middleware/request-id.ts",
    `export function createRequestId() { return crypto.randomUUID(); }\n`,
  );
  addFile(
    files,
    "services/platform-api/src/tests/routes.test.ts",
    `import { describe, expect, it } from "vitest";\nimport { createRoutes } from "../server/routes";\n\ndescribe("platform routes", () => {\n  it("includes health and registry routes", () => {\n    const routes = createRoutes();\n    expect(routes.some((route) => route.path === "/health")).toBe(true);\n    expect(routes.some((route) => route.path === "/api/registry/catalog")).toBe(true);\n  });\n});\n`,
  );
  addFile(
    files,
    "services/platform-api/src/db/schema/README.md",
    `# Database schema\n\nAdd schema definitions here once persistence moves beyond in-memory scaffolding. Keep tables aligned to the modular monolith boundaries instead of inventing service-specific schemas too early.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/db/migrations/README.md",
    `# Migrations\n\nStore ordered, replayable migrations here. Keep changes scoped to one domain concern where practical and make them reversible when possible.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/db/seeds/README.md",
    `# Seeds\n\nSeed starter workspaces, entitlement fixtures, registry snapshots, and brand kits here so API and generator tests stay deterministic.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/jobs/export-builds/README.md",
    `# Export build jobs\n\nUse this directory for asynchronous starter exports, patch packaging, and uninstall manifest generation. Jobs should stay idempotent.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/jobs/emails/README.md",
    `# Email jobs\n\nPut transactional notifications here, such as export-ready messages, invites, and billing reminders. Copy should follow the same trust rules as the product.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/jobs/registry-sync/README.md",
    `# Registry sync jobs\n\nRegistry sync keeps the website, Studio, docs, and CLI aligned on the same metadata. Prefer snapshot generation over ad hoc mutation.\n`,
  );
  addFile(
    files,
    "services/platform-api/src/openapi/spec.yaml",
    `openapi: 3.1.0\ninfo:\n  title: Shandapha Platform API\n  version: 0.1.0\npaths: {}\n`,
  );

  for (const module of apiModules) {
    addFile(
      files,
      `services/platform-api/src/modules/${module.id}/domain/${module.id}.entity.ts`,
      `export const ${module.id}Entity = { module: "${module.id}", layer: "domain" } as const;\n`,
    );
    addFile(
      files,
      `services/platform-api/src/modules/${module.id}/application/${module.id}.service.ts`,
      `export function get${routePathLabel(module.id).replace(/ /g, "")}Summary() { return "${module.summary}"; }\n`,
    );
    addFile(
      files,
      `services/platform-api/src/modules/${module.id}/infrastructure/${module.id}.repository.ts`,
      `export function ${module.id}Repository() { return { storage: "module-local" }; }\n`,
    );
    addFile(
      files,
      `services/platform-api/src/modules/${module.id}/api/${module.id}.routes.ts`,
      `
        import type { PlatformRoute } from "../../../server/routes";

        export const ${module.id}Routes: PlatformRoute[] = [
          {
            method: "GET",
            path: "/api/${module.id}/summary",
            handler: () => ({
              module: "${module.id}",
              summary: "${module.summary}",
              layers: ["domain", "application", "infrastructure", "api"],
            }),
          },
        ];
      `,
    );
  }

  const exampleReadmes = [
    "next-app-router-starter",
    "react-vite-starter",
    "wc-vanilla",
    "blazor-wc-demo",
  ];
  for (const example of exampleReadmes) {
    addFile(
      files,
      `examples/${example}/README.md`,
      `# ${example}\n\nReference notes for the ${example} example. Document the runtime wiring, theme asset loading, and the generator checks this example is meant to validate.\n`,
    );
  }

  addFile(
    files,
    "infra/docker/web.Dockerfile",
    `FROM node:24-alpine\nWORKDIR /app\nCOPY . .\nRUN corepack enable && pnpm install && pnpm --filter @shandapha/web build\nCMD ["pnpm", "--filter", "@shandapha/web", "dev"]\n`,
  );
  addFile(
    files,
    "infra/docker/studio.Dockerfile",
    `FROM node:24-alpine\nWORKDIR /app\nCOPY . .\nRUN corepack enable && pnpm install && pnpm --filter @shandapha/studio build\nCMD ["pnpm", "--filter", "@shandapha/studio", "dev"]\n`,
  );
  addFile(
    files,
    "infra/docker/api.Dockerfile",
    `FROM node:24-alpine\nWORKDIR /app\nCOPY . .\nRUN corepack enable && pnpm install && pnpm --filter @shandapha/platform-api build\nCMD ["pnpm", "--filter", "@shandapha/platform-api", "start"]\n`,
  );
  addFile(
    files,
    "infra/fly/README.md",
    `# Fly deployment notes\n\nUse Fly for small-footprint regional deployments of web, studio, and platform-api when you want low ops burden and simple health checks.\n`,
  );
  addFile(
    files,
    "infra/railway/README.md",
    `# Railway deployment notes\n\nRailway is a good founder-default when the priority is shipping speed over custom infrastructure.\n`,
  );
  addFile(
    files,
    "infra/render/README.md",
    `# Render deployment notes\n\nRender works well for conservative hosted deployments with managed web services and background jobs.\n`,
  );
  addFile(
    files,
    "infra/github/environments/README.md",
    `# GitHub environments\n\nRecommended environment names are preview, staging, and production. Keep secrets minimal and use environment protection rules for deploy safety.\n`,
  );
  addFile(
    files,
    "infra/github/branch-protection/README.md",
    `# Branch protection\n\nProtect the default branch with required lint, typecheck, test, and build checks plus pull-request review.\n`,
  );

  addJson(files, "data/seed/registry/catalog.json", {
    packs: packCatalog,
    templates: templateCatalog,
    modules: moduleCatalog,
  });
  addJson(files, "data/seed/demo-workspaces/default-workspace.json", {
    id: "acme",
    name: "Acme",
    plan: "premium",
  });
  addJson(files, "data/seed/starter-brands/founder.json", {
    primary: "#0f766e",
    accent: "#f97316",
    font: "Space Grotesk",
    radius: "18px",
    density: "comfortable",
  });

  addFile(
    files,
    "tools/scripts/build-all.mjs",
    `
      import { spawnSync } from "node:child_process";

      const result = spawnSync("pnpm", ["build"], { stdio: "inherit" });
      process.exit(result.status ?? 1);
    `,
  );
  addFile(
    files,
    "tools/scripts/lint-tokens.mjs",
    `
      import { access } from "node:fs/promises";

      const required = [
        "packages/tokens/src/presets/normal/README.md",
        "packages/tokens/src/presets/glass-lite/README.md",
        "packages/tokens/src/presets/neon-lite/README.md",
      ];

      await Promise.all(required.map((file) => access(file)));
      console.log("Token presets verified.");
    `,
  );
  addFile(
    files,
    "tools/scripts/lint-contracts.mjs",
    `
      import { access } from "node:fs/promises";

      const required = [
        "packages/contracts/src/tokens/tokens.schema.json",
        "packages/contracts/src/templates/template.manifest.schema.json",
        "packages/contracts/src/packs/pack.manifest.schema.json",
        "packages/contracts/src/registry/registry.schema.json",
      ];

      await Promise.all(required.map((file) => access(file)));
      console.log("Contracts verified.");
    `,
  );
  addFile(
    files,
    "tools/scripts/drift-check.mjs",
    `
      import { readFile } from "node:fs/promises";

      const file = await readFile("packages/layouts/src/drift/allowedPresets.ts", "utf8");
      if (!file.includes("dashboard")) {
        throw new Error("Allowed presets are missing dashboard.");
      }
      console.log("Drift constraints verified.");
    `,
  );
  addFile(
    files,
    "tools/scripts/generate-registry.mjs",
    `
      import { readFile, writeFile } from "node:fs/promises";

      const registry = await readFile("data/seed/registry/catalog.json", "utf8");
      await writeFile("data/seed/registry/catalog.generated.json", registry);
      console.log("Generated registry snapshot.");
    `,
  );
  addFile(
    files,
    "tools/scripts/generate-sitemap.mjs",
    `
      import { writeFile } from "node:fs/promises";

      const routes = ["/", "/pricing", "/templates", "/packs", "/enterprise", "/changelog", "/docs", "/playground"];
      await writeFile("data/seed/registry/sitemap.txt", routes.join("\\n"));
      console.log("Generated sitemap.");
    `,
  );
  addFile(
    files,
    "tools/scripts/verify-package-boundaries.mjs",
    `
      import { readdir, readFile } from "node:fs/promises";
      import { join } from "node:path";

      async function collectPackages(base) {
        try {
          const entries = await readdir(base, { withFileTypes: true });
          return entries.filter((entry) => entry.isDirectory()).map((entry) => join(base, entry.name, "package.json"));
        } catch {
          return [];
        }
      }

      const packageFiles = [
        ...(await collectPackages("apps")),
        ...(await collectPackages("services")),
        ...(await collectPackages("packages")),
      ];

      for (const file of packageFiles) {
        try {
          const data = JSON.parse(await readFile(file, "utf8"));
          const dependencies = Object.keys(data.dependencies ?? {});
          if (dependencies.some((dep) => dep.startsWith("@shandapha/web") || dep.startsWith("@shandapha/studio"))) {
            throw new Error(\`Package boundary violation in \${file}\`);
          }
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw error;
          }
          if ((error).message?.includes("ENOENT")) {
            continue;
          }
          throw error;
        }
      }

      console.log("Package boundaries verified.");
    `,
  );
  addFile(
    files,
    "tools/scripts/size-report.mjs",
    `
      import { readFile, readdir, stat } from "node:fs/promises";
      import { join } from "node:path";

      const roots = ["packages/core/src/index.tsx", "packages/layouts/src/index.tsx", "packages/generator/src/index.ts"];
      const sizes = await Promise.all(roots.map(async (file) => ({ file, size: (await stat(file)).size })));
      console.log(JSON.stringify(sizes, null, 2));
    `,
  );
  addFile(
    files,
    "tools/scripts/release-health.mjs",
    `
      import { access } from "node:fs/promises";

      const required = [
        "README.md",
        "ARCHITECTURE.md",
        ".github/workflows/ci.yml",
        ".changeset/config.json",
      ];

      await Promise.all(required.map((file) => access(file)));
      console.log("Release health looks good.");
    `,
  );

  addFile(files, "tools/codemods/v1-to-v2/README.md", `# v1 to v2 codemods\n`);
  addFile(files, "tools/codemods/v2-to-v3/README.md", `# v2 to v3 codemods\n`);
  addFile(
    files,
    "tools/test/fixtures/projects/next-app-router/README.md",
    `# next-app-router fixture\n`,
  );
  addFile(
    files,
    "tools/test/fixtures/projects/react-vite/README.md",
    `# react-vite fixture\n`,
  );
  addFile(
    files,
    "tools/test/fixtures/projects/wc-vanilla/README.md",
    `# wc-vanilla fixture\n`,
  );
  addFile(
    files,
    "tools/test/fixtures/projects/blazor-wc/README.md",
    `# blazor-wc fixture\n`,
  );

  for (const [filePath, content] of files) {
    const absolutePath = join(repoRoot, filePath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }

  console.log(`Scaffolded ${files.length} files for the Shandapha monorepo.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

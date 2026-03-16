export interface SiteLink {
  href: string;
  label: string;
  description?: string;
}

export interface FeaturedAsset {
  slug: string;
  title: string;
  description: string;
  owner: string;
}

export const primaryNavItems: SiteLink[] = [
  {
    href: "/docs",
    label: "Docs",
    description: "Installation, theming, registry, and monorepo guidance.",
  },
  {
    href: "/components",
    label: "Components",
    description: "Browse the full practical primitive surface.",
  },
  {
    href: "/blocks",
    label: "Blocks",
    description: "Auth, dashboard, docs, and marketing composition patterns.",
  },
  {
    href: "/directory",
    label: "Directory",
    description: "Registry-style browse surface for installable items.",
  },
  {
    href: "/create",
    label: "Create",
    description: "Project start paths, install flows, and runtime controls.",
  },
] as const;

export const secondaryNavItems: SiteLink[] = [
  { href: "/examples", label: "Examples" },
  { href: "/packs", label: "Packs" },
  { href: "/templates", label: "Templates" },
  { href: "/playground", label: "Playground" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
] as const;

export const baselineMetrics = [
  {
    label: "Docs coverage",
    value: "215",
    detail:
      "Installation, theming, registry, and workflow guidance now live in the owned docs surface.",
  },
  {
    label: "UI primitives",
    value: "57",
    detail:
      "Shared primitives, form controls, navigation, overlays, and data display live in the core package.",
  },
  {
    label: "Blocks",
    value: "104",
    detail:
      "Auth, dashboard, docs, and marketing compositions are represented through owned shells and block metadata.",
  },
  {
    label: "Catalog sources",
    value: "3",
    detail:
      "First-party, org, and community catalogs are layered through one resolved registry spine.",
  },
  {
    label: "Examples",
    value: "235",
    detail:
      "Reference examples inform Studio workflows, public playgrounds, and shared support surfaces.",
  },
  {
    label: "Registry items",
    value: "536",
    detail:
      "Components, blocks, templates, packs, modules, and workspaces are indexed through owned metadata.",
  },
] as const;

export const featuredComponents = [
  {
    name: "button",
    title: "Button",
    description:
      "Action hierarchy, icon spacing, and neutral emphasis now line up with the shared baseline.",
    owner: "packages/core",
  },
  {
    name: "input-group",
    title: "Input Group",
    description:
      "Inline addons, search inputs, and compact actions now share one field grammar across the product.",
    owner: "packages/core",
  },
  {
    name: "tabs",
    title: "Tabs",
    description:
      "Preview/code switching and settings navigation now use the same understated line treatment as the shared system.",
    owner: "packages/core",
  },
  {
    name: "field",
    title: "Field",
    description:
      "Modern form composition now lives in owned primitives instead of custom label-and-input stacks.",
    owner: "packages/core",
  },
  {
    name: "command",
    title: "Command",
    description:
      "Searchable command surfaces now look and behave like first-class members of the shared baseline.",
    owner: "packages/core",
  },
  {
    name: "empty",
    title: "Empty",
    description:
      "Empty, success, and no-access surfaces now follow the same neutral baseline framing.",
    owner: "packages/core",
  },
] as const;

export const featuredBlocks: FeaturedAsset[] = [
  {
    slug: "dashboard-01",
    title: "Dashboard 01",
    description:
      "Dashboard framing that now informs analytics, overview, and status surfaces across web and Studio.",
    owner: "apps/web + packages/react",
  },
  {
    slug: "sidebar-07",
    title: "Sidebar 07",
    description:
      "A canonical sidebar/dashboard composition pattern that informed the shared AdminShell and SidebarShell.",
    owner: "packages/layouts + packages/core",
  },
  {
    slug: "login-03",
    title: "Login 03",
    description:
      "Auth block framing that informs sign-in and sign-up composition without changing product behavior.",
    owner: "apps/studio + packages/layouts",
  },
  {
    slug: "login-04",
    title: "Login 04",
    description:
      "Alternate auth shell treatment used as a reference for card rhythm, spacing, and supporting copy.",
    owner: "apps/studio + packages/layouts",
  },
] as const;

export const chartFamilies = [
  {
    type: "deferred",
    title: "Deferred until installable",
    description:
      "Charts stay visible as a future seam, but remain intentionally non-installable until a real module path and proof exist.",
    count: 0,
    owner: "Deferred",
  },
  {
    type: "policy",
    title: "Registry truth first",
    description:
      "The registry now marks chart work as deferred instead of pretending that wrappers are a shipped module surface.",
    count: 0,
    owner: "packages/registry",
  },
  {
    type: "return",
    title: "Return path",
    description:
      "Charting comes back only when it has installability metadata, examples, and policy-safe registry support.",
    count: 0,
    owner: "Future module path",
  },
] as const;

export const examplePages = [
  {
    slug: "dashboard",
    title: "Dashboard",
    description:
      "Sidebar, metrics, charts, and table composition now inform workspace and analytics surfaces.",
    owner: "apps/studio + packages/react",
  },
  {
    slug: "tasks",
    title: "Tasks",
    description:
      "Data-table headers, filters, pagination, row actions, and toolbar patterns informed the Shandapha data baseline.",
    owner: "packages/core + packages/react",
  },
  {
    slug: "playground",
    title: "Playground",
    description:
      "Prompt-tool style controls, selectors, and presets informed the design-system playground and runtime controls.",
    owner: "apps/web + packages/react",
  },
  {
    slug: "authentication",
    title: "Authentication",
    description:
      "Compact auth forms and value framing were ported into Studio public routes.",
    owner: "apps/studio public routes",
  },
  {
    slug: "rtl",
    title: "RTL",
    description:
      "Right-to-left support remains part of the owned baseline and future docs/platform coverage.",
    owner: "docs + future i18n support",
  },
] as const;

export const docsHighlights = [
  {
    title: "Installation",
    description:
      "Set up the shared UI system with local ownership, install targets, and patch-safe flows.",
    href: "/docs",
  },
  {
    title: "Directory",
    description:
      "The directory/registry browse model now maps to Shandapha-owned metadata and package targets.",
    href: "/directory",
  },
  {
    title: "Theming",
    description:
      "Theme toggling, CSS variables, neutral defaults, and semantic ownership all run through one runtime.",
    href: "/themes",
  },
  {
    title: "Monorepo",
    description:
      "CLI-aware workspace ownership and `components.json` style patterns were folded into the existing monorepo seams.",
    href: "/docs/cli/monorepo",
  },
] as const;

export const createHighlights = [
  {
    title: "New project",
    description:
      "Start from templates, registry metadata, and owned packages without leaving the shared baseline.",
    href: "/templates",
  },
  {
    title: "Existing project",
    description:
      "Patch-install and reversible diff workflows stay Shandapha-owned and are exposed as first-class install paths.",
    href: "/docs/registry/installability",
  },
  {
    title: "CLI parity",
    description:
      "Generator and CLI flows stay aligned with the same install targets and package ownership.",
    href: "/docs/cli/monorepo",
  },
  {
    title: "Wizard handoff",
    description:
      "Studio stays the product workflow while inheriting the same visual and component model.",
    href: "/playground",
  },
] as const;

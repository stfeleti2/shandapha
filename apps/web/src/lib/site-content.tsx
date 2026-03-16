import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shandapha/core";
import { plans } from "@shandapha/entitlements";
import {
  DocsShell,
  GridPreset,
  Inline,
  MarketingShell,
  Section,
  SidebarShell,
  Stack,
  Surface,
} from "@shandapha/layouts";
import { createPackTheme, getPackBySlug, packs } from "@shandapha/packs";
import { buildRegistry } from "@shandapha/registry";
import {
  ChartSurfaceCard,
  ChecklistPanel,
  ContrastWarningPanel,
  EntitlementBadge,
  ProductReadinessCard,
  RegistryMindsetCard,
  RelatedTemplatesStrip,
  SectionSignal,
  TemplateCard,
  TemplateDataContractPanel,
  TemplateStateGallery,
  ThemeFoundationCard,
  ThemePackCard,
  TokenRuntimeNote,
  TokenSlotCard,
} from "@shandapha/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const registry = buildRegistry();

const navItems = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/packs", label: "Packs" },
  { href: "/docs", label: "Docs" },
  { href: "/playground", label: "Playground" },
] as const;

const adoptionTimeline = [
  { label: "Inspect", adoption: 12, normalization: 8 },
  { label: "Map", adoption: 34, normalization: 20 },
  { label: "Core", adoption: 62, normalization: 48 },
  { label: "Apps", adoption: 84, normalization: 72 },
  { label: "Registry", adoption: 96, normalization: 92 },
] as const;

const releaseEntries = [
  {
    date: "March 13, 2026",
    title: "Full shared baseline adopted into Shandapha-owned packages",
    detail:
      "Core primitives, shells, charts, registry metadata, and app-facing support surfaces now share one visible baseline.",
  },
  {
    date: "March 13, 2026",
    title: "Registry mindset normalized for monorepo ownership",
    detail:
      "Components, blocks, charts, shells, and workspaces now publish installable metadata without flattening the platform architecture.",
  },
  {
    date: "March 13, 2026",
    title: "Theme runtime aligned to shared-system ergonomics",
    detail:
      "CSS variables, light/dark handling, density, motion, and pack readiness now flow through the same Shandapha provider contract.",
  },
] as const;

const docsArticles = {
  index: {
    title: "Adoption map",
    eyebrow: "Docs",
    summary:
      "How the shared UI foundation is organized inside Shandapha, where it lives, and what remains intentionally product-owned.",
    sections: [
      {
        title: "Shared foundation",
        items: [
          "Shared primitives, form controls, navigation, overlays, charts, and data display live in `packages/core`.",
          "Shells, sections, containers, and sidebar-aware layouts live in `packages/layouts`.",
          "Theme runtime, semantic CSS variables, and pack-aware token output live in `packages/tokens` and `packages/runtime`.",
          "Registry metadata, install targets, and workspace ownership live in `packages/registry`.",
        ],
      },
      {
        title: "Shandapha-owned extensions",
        items: [
          "Support surfaces such as ThemePackCard, ExportOptionCard, TokenMapperTable, and TemplateCard live in `packages/react`.",
          "Public docs, directory, create flows, and marketing surfaces live in `apps/web`.",
          "Auth, wizard, workspaces, billing, usage, and governance surfaces live in `apps/studio`.",
        ],
      },
      {
        title: "Deliberate boundaries",
        items: [
          "Framework bootstraps and vendor folder structures are not part of the runtime architecture.",
          "The backend, generator, wizard, packs, CLI, and business rules remain Shandapha-owned seams.",
          "Installability stays local and editable instead of hidden behind vendor-specific wrappers.",
        ],
      },
    ],
  },
  installation: {
    title: "Installation baseline",
    eyebrow: "Docs",
    summary:
      "Installation is routed through Shandapha-owned web, generator, CLI, and patch-install seams while keeping the UI layer locally editable.",
    sections: [
      {
        title: "What you install",
        items: [
          "Templates, shared UI packages, registry metadata, and workspace-level CSS entrypoints.",
          "Install targets that resolve to local owner packages instead of vendor folders.",
        ],
      },
      {
        title: "How ownership stays local",
        items: [
          "New project flows now point at templates, registry metadata, and shared packages instead of a raw vendor starter.",
          "Existing-project install remains Shandapha-owned through reversible patch-install and generator planning.",
          "Workspace `components.json` files and package-owned CSS entrypoints keep install ergonomics predictable across apps.",
        ],
      },
    ],
  },
  components: {
    title: "Component surface",
    eyebrow: "Docs",
    summary:
      "The full practical component baseline now lives in Shandapha-owned packages, with registry metadata exposing the owned install targets.",
    sections: [
      {
        title: "Broad surface now represented",
        items: [
          "Forms, overlays, navigation, data display, sidebar, chart, feedback, and typography primitives live in `packages/core`.",
          "Product-facing extensions such as ThemePackCard, ExportOptionCard, TokenMapperTable, and TemplateCard live in `packages/react`.",
        ],
      },
      {
        title: "How it was normalized",
        items: [
          "Composition patterns were preserved where useful, but owner paths were remapped to `@shandapha/*` packages.",
          "Semantic token slots and runtime theming remain the only styling contract used by the shared layer.",
        ],
      },
    ],
  },
  blocks: {
    title: "Blocks and page patterns",
    eyebrow: "Docs",
    summary:
      "Block and page-pattern coverage spans dashboard, sidebar, auth, docs, and marketing references inside one owned layout system.",
    sections: [
      {
        title: "Covered block families",
        items: [
          "Auth, dashboard, sidebar, docs/article, and marketing compositions.",
          "Featured previews, block browse patterns, and registry metadata for reusable sections.",
        ],
      },
      {
        title: "Where it landed",
        items: [
          "`packages/layouts` now owns the shell/page frame pieces.",
          "`packages/react` now owns the support blocks and product-facing block surfaces.",
          "`apps/web` now exposes a dedicated Blocks route while Templates and Packs remain extra Shandapha extensions.",
        ],
      },
    ],
  },
  charts: {
    title: "Charts baseline",
    eyebrow: "Docs",
    summary:
      "Chart family organization, wrappers, and tooltip/container conventions are normalized into shared wrappers.",
    sections: [
      {
        title: "Chart families",
        items: [
          "Area, bar, line, pie, radar, radial, and tooltip coverage.",
          "Shared tooltip, legend, and token-aware chart container defaults.",
        ],
      },
      {
        title: "Result in Shandapha",
        items: [
          "`packages/core` owns the chart container and primitives.",
          "`packages/react` exposes chart-friendly product cards and wrappers.",
          "Web and Studio now share the same chart defaults, tooltip styling, and token-compatible color rules.",
        ],
      },
    ],
  },
  directory: {
    title: "Directory and registry",
    eyebrow: "Docs",
    summary:
      "The directory and registry surface points at Shandapha-owned components, blocks, charts, shells, templates, packs, and workspaces.",
    sections: [
      {
        title: "Browse model",
        items: [
          "Registry-style browse surfaces for installable components, blocks, charts, shells, and templates.",
          "Installable-item metadata that can be shared across web, Studio, CLI, docs, and generator flows.",
        ],
      },
      {
        title: "Shandapha mapping",
        items: [
          "Registry remains the shared brain across web, Studio, CLI, docs, and generator flows.",
          "Install targets resolve to local owner packages instead of foreign registry paths.",
        ],
      },
    ],
  },
  create: {
    title: "Create flow",
    eyebrow: "Docs",
    summary:
      "The create surface is linked to templates, registry metadata, generator seams, and the Studio wizard while staying fully owned in-project.",
    sections: [
      {
        title: "Surface behavior",
        items: [
          "New project framing, create-style page composition, and theme/runtime control surfaces.",
          "A create surface that feels native to the rest of the system instead of a separate funnel.",
        ],
      },
      {
        title: "Preserved ownership",
        items: [
          "Generator core, CLI parity, wizard, packs, and patch-install logic remain Shandapha-owned.",
          "The create surface now routes users into those existing product/platform seams instead of replacing them.",
        ],
      },
    ],
  },
  theming: {
    title: "Theme ergonomics",
    eyebrow: "Docs",
    summary:
      "CSS-variable theming, light/dark support, and neutral defaults run through the shared baseline while keeping Shandapha’s token runtime alive.",
    sections: [
      {
        title: "Visible behavior",
        items: [
          "Theme toggle feel, neutral palette behavior, and CSS variable architecture shared across web and Studio.",
          "A public-site layout that behaves like the same baseline as the product app instead of a separate branded shell.",
        ],
      },
      {
        title: "Preserved token model",
        items: [
          "Semantic token contract remains exportable and pack-compatible.",
          "Normal, Glass, and Neon remain future-supported without hardcoding raw colors into business logic.",
        ],
      },
    ],
  },
  examples: {
    title: "Examples and demos",
    eyebrow: "Docs",
    summary:
      "Dashboard, tasks, playground, authentication, and RTL examples now inform both the public web app and Studio product surfaces.",
    sections: [
      {
        title: "Example families",
        items: [
          "Dashboard and workspace overview patterns.",
          "Data table, filters, pagination, and row-action patterns.",
          "Playground and configuration patterns.",
          "Authentication and compact public entry surfaces.",
          "RTL-ready surface behavior for future i18n work.",
        ],
      },
      {
        title: "Where the patterns landed",
        items: [
          "Dashboard and data-table patterns informed Studio overview, usage, billing, and governance surfaces.",
          "Playground and configuration patterns informed the public theme playground and create/runtime controls.",
        ],
      },
    ],
  },
  monorepo: {
    title: "Monorepo placement",
    eyebrow: "Docs",
    summary:
      "The shared baseline sits inside the existing Shandapha monorepo instead of flattening the repo into a generic UI site clone.",
    sections: [
      {
        title: "Architecture preserved",
        items: [
          "`apps/web` remains the public distribution engine.",
          "`apps/studio` remains the product application.",
          "`services/platform-api` remains the modular backend.",
          "Packages remain the moat and ownership boundary.",
        ],
      },
      {
        title: "System placement",
        items: [
          "`packages/core` owns the primitive and component baseline.",
          "`packages/react` owns Shandapha-facing adapters and support surfaces.",
          "`packages/layouts` owns shell and page primitives aligned to the shared site feel.",
          "`packages/registry` carries the directory/installability mindset.",
        ],
      },
    ],
  },
  "components/button": {
    title: "Button baseline",
    eyebrow: "Components",
    summary:
      "Buttons now inherit shared-system sizing, variants, and focus behavior through `packages/core` while remaining semantic-token driven.",
    sections: [
      {
        title: "Where it lives",
        items: [
          "`packages/core/src/foundation.tsx` owns the base button implementation.",
          "`packages/react` consumes the same button in pack cards, template cards, registry messaging, and export flows.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "The same action hierarchy now reads consistently across web, studio, docs, and the wizard.",
          "Focus rings, sizes, and variants are no longer app-local inventions.",
        ],
      },
    ],
  },
  "components/sidebar": {
    title: "Sidebar model",
    eyebrow: "Components",
    summary:
      "The full sidebar pattern now anchors the shared shell baseline for Studio and admin-style screens.",
    sections: [
      {
        title: "Adopted surface",
        items: [
          "Provider, trigger, header, groups, menu items, nested buttons, and mobile sheet behavior.",
          "The sidebar is now a first-class primitive rather than app-local layout markup.",
        ],
      },
      {
        title: "Shandapha normalization",
        items: [
          "It still respects anti-grid-drift layout rules and the package ownership model.",
          "It remains compatible with future wizard/generator flows instead of being a one-off app shell.",
        ],
      },
    ],
  },
  "registry/installability": {
    title: "Registry and installability",
    eyebrow: "Registry",
    summary:
      "The repo mirrors a registry-first installability model without abandoning Shandapha’s shared-brain registry architecture.",
    sections: [
      {
        title: "Now tracked centrally",
        items: [
          "Component manifests.",
          "Block manifests.",
          "Chart manifests.",
          "Shell manifests.",
          "Workspace install targets and alias metadata.",
        ],
      },
      {
        title: "Still Shandapha-owned",
        items: [
          "Registry remains a shared brain across web, studio, CLI, docs, and generator flows.",
          "Install targets point at Shandapha packages rather than imported vendor folders.",
        ],
      },
    ],
  },
  "templates/dashboard-home": {
    title: "Template baseline",
    eyebrow: "Templates",
    summary:
      "Template manifests now carry shell, block, state, surface, and data-contract metadata that align with the adopted shared system.",
    sections: [
      {
        title: "New coverage",
        items: [
          "Dashboard templates now point at chart, data table, sidebar, and section card surfaces.",
          "Related templates and featured packs are explicit metadata, not hidden page assumptions.",
        ],
      },
      {
        title: "Why it matters",
        items: [
          "The wizard, docs, catalog, and future CLI flows can all reason over the same template structure.",
          "State completeness remains part of the template contract.",
        ],
      },
    ],
  },
  "cli/monorepo": {
    title: "Monorepo pattern",
    eyebrow: "CLI",
    summary:
      "Monorepo-friendly install patterns inform how Shandapha exposes workspace-level CSS and aliases.",
    sections: [
      {
        title: "Aligned pieces",
        items: [
          "Shared `components.json` ownership model.",
          "Workspace-level CSS entrypoints.",
          "Registry workspace metadata for core, web, and studio.",
        ],
      },
      {
        title: "Preserved seams",
        items: [
          "Apps remain `apps/web` and `apps/studio`.",
          "The backend remains `services/platform-api`.",
          "Packages remain the moat and the primary ownership boundary.",
        ],
      },
    ],
  },
} as const;

const trustPages = {
  security: {
    title: "Security posture",
    eyebrow: "Trust",
    summary:
      "Shared ownership matters here too: one token runtime, one registry brain, and reviewable patch installs reduce hidden risk.",
    bullets: [
      "Semantic tokens remain explicit and exportable.",
      "Patch installs stay reversible and reviewable.",
      "Registry metadata is centralized instead of scattered through page code.",
    ],
  },
  privacy: {
    title: "Privacy posture",
    eyebrow: "Trust",
    summary:
      "The platform keeps scope tight: two apps, one modular API, and minimal hidden duplication.",
    bullets: [
      "No vendor UI islands that obscure what code runs in the product.",
      "Studio and web share the same owned runtime and component layer.",
      "Registry data can be audited centrally.",
    ],
  },
  terms: {
    title: "Terms and boundaries",
    eyebrow: "Trust",
    summary:
      "The architecture remains stable while the UI baseline gets stronger: shared packages stay the moat and app shells stay thin.",
    bullets: [
      "Architecture remains intact across apps, service, and packages.",
      "Packs, templates, generator, wizard, and business rules stay Shandapha-owned.",
      "The UI system is adopted, not pasted in raw.",
    ],
  },
} as const;

function getNav(currentHref: string) {
  return navItems.map((item) => ({
    ...item,
    active: item.href === currentHref,
  }));
}

function docsNav(currentKey: string) {
  return Object.entries(docsArticles).map(([key, article]) => ({
    href: key === "index" ? "/docs" : `/docs/${key}`,
    label: article.title,
    active: key === currentKey,
  }));
}

function renderPlanCards() {
  return (
    <GridPreset preset="dashboard">
      {plans.map((plan) => (
        <div key={plan.id} className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-2">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.summary}</CardDescription>
                </div>
                <EntitlementBadge planId={plan.id} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="text-3xl font-semibold">{plan.price}</div>
              <ItemGroup className="gap-2">
                {plan.includes.map((item) => (
                  <Item key={item} variant="outline" size="sm">
                    <ItemContent>
                      <ItemDescription className="line-clamp-none">
                        {item}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </div>
      ))}
    </GridPreset>
  );
}

function renderPlanComparison() {
  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.includes)),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan comparison</CardTitle>
        <CardDescription>
          Free stays useful, premium accelerates polish, and business adds confidence and governance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.id}>{plan.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFeatures.map((feature) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">{feature}</TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.id}-${feature}`}>
                    {plan.includes.includes(feature) ? "Included" : "Later"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function renderHomePage() {
  return (
    <MarketingShell
      title="Shandapha platform."
      eyebrow="Shandapha"
      summary="The UI system now adopts the full practical baseline across components, blocks, charts, shells, theming, and installability while the platform architecture stays intact."
      navItems={getNav("/")}
      actions={
        <Inline gap={12}>
          <Button asChild type="button">
            <Link href="/playground">Open playground</Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/docs">Read adoption map</Link>
          </Button>
        </Inline>
      }
    >
      <Section title="Coverage">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-8">
            <ChartSurfaceCard
              title="Adoption vs normalization"
              description="Useful baseline surface area was brought in first, then normalized back into Shandapha ownership."
              data={[...adoptionTimeline]}
              labelKey="label"
              valueKey="adoption"
              secondaryKey="normalization"
            />
          </div>
          <div className="lg:col-span-4">
            <RegistryMindsetCard />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Components"
              value={`${registry.components.length}`}
              detail="Core component breadth now matches the full practical baseline instead of a selective subset."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Blocks"
              value={`${registry.blocks.length}`}
              detail="Auth, dashboard, docs, pricing, FAQ, legal, and template gallery patterns are now explicit block inventory."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Charts"
              value={`${registry.charts.length}`}
              detail="Chart containers, defaults, and token-compatible wrappers are shared rather than page-local."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Shells"
              value={`${registry.shells.length}`}
              detail="Marketing, docs, sidebar, admin, and auth shells now live in owned layout packages."
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Theme layer">
        <GridPreset preset="detail" className="items-start">
          <Stack gap={16}>
            <ThemeFoundationCard />
            <ContrastWarningPanel />
          </Stack>
          <Stack gap={16}>
            <TokenRuntimeNote />
            <TokenSlotCard
              slot="--primary"
              value={createPackTheme("normal").scale.primary}
              description="Primary action tone"
              usage="Drives buttons, focus highlights, chart emphasis, and active shell moments through a single semantic slot."
            />
            <TokenSlotCard
              slot="--surface"
              value={createPackTheme("normal").scale.surface}
              description="Shared secondary surface"
              usage="Provides the neutral raised canvas behind dashboards, docs sidebars, and supporting product cards."
            />
          </Stack>
        </GridPreset>
      </Section>

      <Section title="Packs">
        <GridPreset preset="dashboard">
          {packs.map((pack) => (
            <div key={pack.id} className="lg:col-span-4">
              <ThemePackCard packId={pack.id} />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Template gallery">
        <GridPreset preset="dashboard">
          {registry.templates.slice(0, 6).map((template) => (
            <div key={template.slug} className="lg:col-span-6">
              <TemplateCard
                template={template}
                href={`/templates/${template.slug}`}
                ctaLabel="Open template"
              />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Coverage report">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Theme model absorbed"
              points={[
                "CSS variable runtime.",
                "Light/dark/system handling.",
                "Density and motion controls.",
                "Pack-friendly semantic token mapping.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Component surface absorbed"
              points={[
                "Forms, overlays, menus, tables, charts, and sidebar primitives now live in `packages/core`.",
                "Product-facing cards, panels, and wizard helpers now live in `packages/react`.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Architecture preserved"
              points={[
                "`apps/web` remains the distribution engine.",
                "`apps/studio` remains the control-plane product.",
                "`services/platform-api` remains the modular backend.",
                "Packages remain the moat and ownership boundary.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Pricing">
        {renderPlanCards()}
      </Section>
    </MarketingShell>
  );
}

function renderPricingPage() {
  return (
    <MarketingShell
      title="Pricing stays honest while the baseline gets stronger."
      eyebrow="Pricing"
      summary="Free remains useful, premium unlocks more polish and convenience, and business adds governance and confidence without extra app sprawl."
      navItems={getNav("/pricing")}
      actions={
        <Button asChild type="button">
          <Link href="/templates">Browse templates</Link>
        </Button>
      }
    >
      <Section title="Plans">{renderPlanCards()}</Section>
      <Section title="Comparison">{renderPlanComparison()}</Section>
      <Section title="Why this model">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Free stays shippable"
              points={[
                "Normal pack and core primitives remain available.",
                "Docs, playground, and baseline templates stay useful.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Premium sells acceleration"
              points={[
                "Extra packs, richer templates, and patch-install convenience.",
                "No artificial breakage of the shared runtime or token model.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Business sells confidence"
              points={[
                "Governance, audit framing, and stronger multi-team posture.",
                "Still within the same platform seams until real traffic demands more splits.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

function renderEnterprisePage() {
  return (
    <MarketingShell
      title="The platform architecture stayed intact."
      eyebrow="Enterprise boundaries"
      summary="The UI adoption is broad, but Shandapha still behaves as two apps, one modular backend, and a moat of owned packages."
      navItems={getNav("/enterprise")}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/docs/cli/monorepo">Open monorepo docs</Link>
        </Button>
      }
    >
      <Section title="Preservation map">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Apps preserved"
              points={[
                "`apps/web` keeps catalog, docs, trust, and playground responsibilities.",
                "`apps/studio` keeps auth, wizard, workspaces, billing, usage, and governance.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Backend preserved"
              points={[
                "`services/platform-api` remains the modular backend.",
                "No generic demo server code was introduced.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Packages preserved"
              points={[
                "Tokens, runtime, generator, CLI, registry, packs, entitlements, and business packages remain the moat.",
                "The UI adoption feeds those packages instead of replacing them.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Normalization">
        <ChecklistPanel
          items={[
            {
              label: "Semantic token contract kept intact",
              done: true,
              detail:
                "The visible baseline changed, but the exportable token contract still belongs to Shandapha.",
            },
            {
              label: "Normal, Glass, and Neon remain supported",
              done: true,
              detail:
                "The adopted baseline was mapped back into pack-compatible scales instead of hardcoded raw colors.",
            },
            {
              label: "Registry remains shared brain",
              done: true,
              detail:
                "Metadata now covers components, blocks, charts, shells, and workspaces for all product surfaces.",
            },
            {
              label: "Wizard and generator compatibility preserved",
              done: true,
              detail:
                "The component system was adopted in package-owned form so future generation stays feasible.",
            },
          ]}
        />
      </Section>
    </MarketingShell>
  );
}

function renderChangelogPage() {
  return (
    <MarketingShell
      title="Adoption milestones shipped on March 13, 2026."
      eyebrow="Changelog"
      summary="The release story is no longer about isolated components. It now covers theming, blocks, charts, shells, registry metadata, and monorepo-aware installability."
      navItems={getNav("/changelog")}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/docs">Browse docs</Link>
        </Button>
      }
    >
      <Section title="Release notes">
        <GridPreset preset="dashboard">
          {releaseEntries.map((entry) => (
            <div key={entry.title} className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader>
                  <Badge variant="outline">{entry.date}</Badge>
                  <CardTitle>{entry.title}</CardTitle>
                  <CardDescription>{entry.detail}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </GridPreset>
      </Section>
      <Section title="What shipped">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <SectionSignal
              title="Registry items"
              value={`${registry.components.length + registry.blocks.length + registry.charts.length + registry.shells.length}`}
              detail="Installable metadata now spans primitives, blocks, charts, and shells."
            />
          </div>
          <div className="lg:col-span-4">
            <SectionSignal
              title="Workspaces"
              value={`${registry.workspaces.length}`}
              detail="Core, web, and studio now expose workspace-level install metadata."
            />
          </div>
          <div className="lg:col-span-4">
            <SectionSignal
              title="Template manifests"
              value={`${registry.templates.length}`}
              detail="Templates now describe shells, states, surfaces, blocks, and data contracts."
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderMarketingPage(
  id: "home" | "pricing" | "enterprise" | "changelog",
) {
  if (id === "pricing") {
    return renderPricingPage();
  }

  if (id === "enterprise") {
    return renderEnterprisePage();
  }

  if (id === "changelog") {
    return renderChangelogPage();
  }

  return renderHomePage();
}

export function renderTemplatesIndexPage() {
  return (
    <MarketingShell
      title="Template catalog with shared-system shells, Shandapha-owned metadata."
      eyebrow="Templates"
      summary="Templates now read like a real registry surface: clear shells, blocks, states, data contracts, related items, and featured packs."
      navItems={getNav("/templates")}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/docs/templates/dashboard-home">Template docs</Link>
        </Button>
      }
    >
      <Section title="Catalog">
        <GridPreset preset="dashboard">
          {registry.templates.map((template) => (
            <div key={template.slug} className="lg:col-span-6">
              <TemplateCard
                template={template}
                href={`/templates/${template.slug}`}
                ctaLabel="Open template"
              />
            </div>
          ))}
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderTemplateDetailPage(slug: string) {
  const template = registry.templates.find((entry) => entry.slug === slug);

  if (!template) {
    notFound();
  }

  return (
    <SidebarShell
      title={template.name}
      eyebrow={template.group}
      summary={template.summary}
      actions={
        <Inline gap={12}>
          <Button asChild type="button">
            <Link href="/playground">Preview theme</Link>
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/templates">Back to catalog</Link>
          </Button>
        </Inline>
      }
      sidebar={
        <>
          <TemplateStateGallery states={template.states} />
          <TemplateDataContractPanel contract={template.dataContract} />
        </>
      }
    >
      <GridPreset preset="dashboard">
        <div className="lg:col-span-7">
          <TemplateCard template={template} />
        </div>
        <div className="lg:col-span-5">
          <ChecklistPanel
            title="Included surfaces"
            items={template.surfaces.map((surface) => ({
              label: surface,
              done: true,
              detail: `Covered through the adopted ${template.shell} visual baseline.`,
            }))}
          />
        </div>
      </GridPreset>

      <div className="mt-6">
        <RelatedTemplatesStrip slugs={template.related} />
      </div>
    </SidebarShell>
  );
}

export function renderPacksIndexPage() {
  return (
    <MarketingShell
      title="Pack catalog on top of the adopted baseline."
      eyebrow="Packs"
      summary="The pack system remains intact and compatible with the new baseline, but the catalog now reads like a real registry surface with clear metadata and install targets instead of a grab-bag of demos."
      navItems={getNav("/packs")}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/playground">Open pack playground</Link>
        </Button>
      }
    >
      <Section title="Pack catalog">
        <GridPreset preset="dashboard">
          {packs.map((pack) => (
            <div key={pack.id} className="lg:col-span-4">
              <ThemePackCard packId={pack.id} />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Pack guarantees">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Normal"
              points={[
                "Closest fit to the neutral shared baseline.",
                "Best default for docs, catalog, and SaaS surfaces.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Glass"
              points={[
                "Softer surface contrast without changing component contracts.",
                "Uses the same semantic slots and registry metadata.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Neon"
              points={[
                "Higher-contrast chart and CTA treatment on the same token contract.",
                "Still exportable and compatible with future brand kits.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderPackDetailPage(slug: string) {
  const pack = getPackBySlug(slug);

  if (!pack) {
    notFound();
  }

  const preview = createPackTheme(pack.id);

  return (
    <SidebarShell
      title={pack.name}
      eyebrow="Pack detail"
      summary={pack.description}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/packs">Back to packs</Link>
        </Button>
      }
      sidebar={
        <>
          <ThemePackCard packId={pack.id} />
          <ContrastWarningPanel />
        </>
      }
    >
      <GridPreset preset="dashboard">
        <div className="lg:col-span-7">
          <ChartSurfaceCard
            title={`${pack.name} chart defaults`}
            description="Chart styling now sits inside the same visual language as cards, sidebars, and table surfaces."
            data={[
              { label: "Week 1", usage: 24 },
              { label: "Week 2", usage: 38 },
              { label: "Week 3", usage: 46 },
              { label: "Week 4", usage: 61 },
            ]}
            valueKey="usage"
          />
        </div>
        <div className="lg:col-span-5">
          <ProductReadinessCard
            title="What this pack changes"
            points={[
              "It changes the presentation layer, not the component ownership model.",
              "It keeps charts, shells, and support surfaces aligned through shared semantic slots.",
              "It stays compatible with wizard, generator, and existing-project patch installs.",
            ]}
          />
        </div>
      </GridPreset>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <TokenSlotCard
          slot="--primary"
          value={preview.scale.primary}
          description="Primary action"
          usage="Buttons, active nav, emphasis text, and chart highlights."
        />
        <TokenSlotCard
          slot="--background"
          value={preview.scale.background}
          description="Canvas background"
          usage="Base page surface for shells and app canvas areas."
        />
        <TokenSlotCard
          slot="--sidebar"
          value={preview.scale.sidebar}
          description="Sidebar canvas"
          usage="Admin shell and docs-side navigation background."
        />
      </div>
    </SidebarShell>
  );
}

export function renderTrustPage(kind: "security" | "privacy" | "terms") {
  const page = trustPages[kind];

  return (
    <DocsShell
      title={page.title}
      eyebrow={page.eyebrow}
      summary={page.summary}
      sidebarTitle="Trust pages"
      navItems={[
        { href: "/trust/security", label: "Security", active: kind === "security" },
        { href: "/trust/privacy", label: "Privacy", active: kind === "privacy" },
        { href: "/trust/terms", label: "Terms", active: kind === "terms" },
      ]}
      breadcrumbs={["Trust", page.title]}
    >
      <GridPreset preset="dashboard">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup className="gap-3">
              {page.bullets.map((bullet) => (
                <Item key={bullet} variant="outline" size="sm">
                  <ItemContent>
                    <ItemDescription className="line-clamp-none">
                      {bullet}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <RegistryMindsetCard />
        </div>
      </GridPreset>
    </DocsShell>
  );
}

export function renderDocsPage(slug: string[]) {
  const key = slug.length ? slug.join("/") : "index";
  const article = docsArticles[key as keyof typeof docsArticles] ?? docsArticles.index;

  return (
    <DocsShell
      title={article.title}
      eyebrow={article.eyebrow}
      summary={article.summary}
      sidebarTitle="Adoption docs"
      navItems={docsNav(key)}
      breadcrumbs={["Docs", article.title]}
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/playground">Open playground</Link>
        </Button>
      }
    >
      <GridPreset preset="dashboard">
        {article.sections.map((section) => (
          <div key={section.title} className="lg:col-span-6">
            <Surface title={section.title}>
              <ItemGroup className="gap-3">
                {section.items.map((item) => (
                  <Item key={item} variant="outline" size="sm">
                    <ItemContent>
                      <ItemDescription className="line-clamp-none">
                        {item}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </Surface>
          </div>
        ))}
      </GridPreset>
    </DocsShell>
  );
}

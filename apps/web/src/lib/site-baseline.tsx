import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shandapha/core";
import { buildRegistry } from "@shandapha/registry";
import {
  ContrastWarningPanel,
  DensityToggle,
  MotionToggle,
  PackPreviewSwitcher,
  ProductReadinessCard,
  RegistryMindsetCard,
  SectionSignal,
  ThemeFoundationCard,
  ThemeModeToggle,
  ThemePackCard,
  TokenSlotCard,
  ChartSurfaceCard,
} from "@shandapha/react";
import { createPackTheme, packs } from "@shandapha/packs";
import { GridPreset, Inline, MarketingShell, Section, Stack } from "@shandapha/layouts";
import Link from "next/link";
import type { ReactNode } from "react";
import { ComponentShowcaseGrid } from "@/components/site/component-showcases";
import {
  baselineMetrics,
  chartFamilies,
  createHighlights,
  docsHighlights,
  examplePages,
  featuredBlocks,
  featuredComponents,
  primaryNavItems,
  secondaryNavItems,
} from "@/lib/site-navigation";

const registry = buildRegistry();
const themeScale = createPackTheme("normal").scale;

function CenteredHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="border-b border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-4xl gap-4">
          <Inline gap={8} className="justify-center">
            <Badge variant="outline">{eyebrow}</Badge>
            <Badge variant="secondary">Shandapha-owned</Badge>
          </Inline>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <Inline gap={10} className="justify-center pt-2">
            <Button asChild size="sm" className="rounded-lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="rounded-lg">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </Inline>
        </div>
      </div>
    </section>
  );
}

function SecondaryLinkRow() {
  return (
    <div className="border-b border-border/70">
      <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-4 py-3 lg:px-8">
        {secondaryNavItems.map((item) => (
          <Button key={item.href} asChild variant="ghost" size="sm" className="rounded-lg">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

function CatalogCard({
  title,
  description,
  owner,
  href,
  hrefLabel = "Open",
  footer,
}: {
  title: string;
  description: string;
  owner: string;
  href?: string;
  hrefLabel?: string;
  footer?: ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Owned in <code>{owner}</code>
        </div>
        {footer}
        {href ? (
          <div>
            <Button asChild variant="outline" size="sm">
              <Link href={href}>{hrefLabel}</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DirectoryTable({
  rows,
}: {
  rows: Array<{
    name: string;
    title: string;
    categories: string[];
    installTarget: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry-style browse</CardTitle>
        <CardDescription>
          The directory points at Shandapha-owned install targets instead of vendor paths.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Install target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.categories.join(", ")}
                </TableCell>
                <TableCell>
                  <code className="text-xs text-muted-foreground">{row.installTarget}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PreviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function WebsitePreviewCanvas() {
  return (
    <div className="grid gap-4 bg-muted/20 p-4 md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
      <div className="rounded-xl border bg-card p-3">
        <div className="mb-4 text-sm font-semibold">Shandapha</div>
        <div className="grid gap-2">
          {["Overview", "Templates", "Packs", "Exports", "Members"].map((item, index) => (
            <div
              key={item}
              className={`rounded-lg px-3 py-2 text-sm ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-2">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-8 w-64 rounded bg-muted/70" />
              <div className="h-3 w-80 max-w-full rounded bg-muted" />
            </div>
            <Inline gap={8}>
              <Badge variant="outline">Docs</Badge>
              <Badge variant="outline">Directory</Badge>
              <Badge>Studio</Badge>
            </Inline>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <PreviewStat label="Exports" value="148" />
          <PreviewStat label="Templates" value="32" />
          <PreviewStat label="Checks" value="96%" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-5 w-40 rounded bg-muted/70" />
              </div>
              <Badge variant="outline">Live</Badge>
            </div>
            <div className="flex h-44 items-end gap-3">
              {[30, 52, 44, 68, 82, 74, 96].map((height, index) => (
                <div
                  key={height}
                  className={`flex-1 rounded-t-md ${index === 6 ? "bg-primary" : "bg-muted-foreground/25"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="grid gap-3">
              <div className="h-5 w-32 rounded bg-muted/70" />
              {[
                ["Theme pack", "Normal"],
                ["Density", "Comfortable"],
                ["Motion", "Full"],
                ["Registry", "Synced"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockPatternPreview({
  slug,
}: {
  slug: string;
}) {
  if (slug === "dashboard-01") {
    return (
      <div className="grid gap-4 bg-muted/20 p-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="rounded-xl border bg-card p-3">
          <div className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </div>
          <div className="grid gap-2">
            {["Overview", "Usage", "Billing", "Policies"].map((item, index) => (
              <div
                key={item}
                className={`rounded-lg px-3 py-2 text-sm ${
                  index === 0 ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <PreviewStat label="Exports" value="24" />
            <PreviewStat label="Audits" value="12" />
            <PreviewStat label="Members" value="8" />
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-4 h-5 w-40 rounded bg-muted/70" />
            <div className="flex h-32 items-end gap-3">
              {[44, 36, 62, 58, 84, 72].map((height) => (
                <div key={height} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "sidebar-07") {
    return (
      <div className="grid gap-4 bg-muted/20 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-xl border bg-card p-3">
          <div className="mb-4 h-6 w-28 rounded bg-muted/70" />
          <div className="grid gap-2">
            {["Search", "Projects", "Templates", "Members", "Settings", "Audit"].map((item) => (
              <div key={item} className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-40 rounded bg-muted/70" />
            <Badge variant="outline">Sidebar shell</Badge>
          </div>
          <div className="grid gap-3">
            {["Active workspace", "Template library", "Policy review", "Export queue"].map((row) => (
              <div key={row} className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                {row}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slug === "login-03") {
    return (
      <div className="grid gap-4 bg-muted/20 p-4 md:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.8fr)]">
        <div className="rounded-xl border bg-card p-6">
          <div className="grid gap-3">
            <Badge variant="outline">Studio access</Badge>
            <div className="h-8 w-48 rounded bg-muted/70" />
            <div className="h-3 w-full max-w-sm rounded bg-muted" />
            <div className="h-3 w-72 max-w-full rounded bg-muted" />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="grid gap-4">
            <div className="h-6 w-32 rounded bg-muted/70" />
            <div className="grid gap-3">
              <div className="h-10 rounded-md border bg-muted/20" />
              <div className="h-10 rounded-md border bg-muted/20" />
              <div className="h-10 rounded-md bg-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 bg-muted/20 p-4 md:grid-cols-[minmax(0,0.85fr)_minmax(300px,0.9fr)]">
      <div className="rounded-xl border bg-card p-6">
        <div className="grid gap-3">
          <Badge variant="outline">Account</Badge>
          <div className="h-7 w-40 rounded bg-muted/70" />
          <div className="h-3 w-full max-w-sm rounded bg-muted" />
          <div className="h-3 w-64 max-w-full rounded bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="grid gap-3">
          {["Email", "Password", "Workspace"].map((field) => (
            <div key={field} className="grid gap-2">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-10 rounded-md border bg-muted/20" />
            </div>
          ))}
          <div className="mt-2 h-10 rounded-md bg-primary" />
        </div>
      </div>
    </div>
  );
}

export function renderBaselineHomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <CenteredHero
        eyebrow="One baseline across web and studio"
        title="The foundation for Shandapha’s public UI system."
        description="Shandapha now runs on one shared UI foundation across the public site, docs, create flows, and Studio surfaces while keeping app, package, and product ownership intact."
        primaryHref="/create"
        primaryLabel="New Project"
        secondaryHref="/components"
        secondaryLabel="View Components"
      />
      <SecondaryLinkRow />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pb-8 lg:px-8">
        <Section title="Website feel">
          <Card className="overflow-hidden border-border/70">
            <CardContent className="p-0">
              <WebsitePreviewCanvas />
            </CardContent>
          </Card>
        </Section>

        <Section title="Shared surface">
          <GridPreset preset="dashboard">
            {baselineMetrics.map((metric) => (
              <div key={metric.label} className="lg:col-span-4">
                <SectionSignal
                  title={metric.label}
                  value={metric.value}
                  detail={metric.detail}
                />
              </div>
            ))}
          </GridPreset>
        </Section>

        <Section title="Full practical baseline">
          <GridPreset preset="dashboard">
            <div className="lg:col-span-4">
              <ProductReadinessCard
                title="Website feel"
                points={[
                  "Home, docs, directory, create, charts, blocks, and examples now use one shared page framing system.",
                  "Current Shandapha-only pages stay present as extra links instead of a second site system.",
                ]}
              />
            </div>
            <div className="lg:col-span-4">
              <ProductReadinessCard
                title="Practical component breadth"
                points={[
                  "The broad component surface is represented in `packages/core` and registry metadata.",
                  "Support components remain Shandapha-owned but now look native to the shared baseline.",
                ]}
              />
            </div>
            <div className="lg:col-span-4">
              <ProductReadinessCard
                title="Architecture preserved"
                points={[
                  "`apps/web`, `apps/studio`, `services/platform-api`, and packages stay exactly where they belong.",
                  "The shared UI system lives inside the monorepo instead of as a foreign website clone.",
                ]}
              />
            </div>
          </GridPreset>
        </Section>

        <Section title="Where to look next">
          <GridPreset preset="dashboard">
            {primaryNavItems.map((item) => (
              <div key={item.href} className="lg:col-span-4">
                <CatalogCard
                  title={item.label}
                  description={item.description ?? "Part of the shared UI foundation and fully owned inside Shandapha."}
                  owner="apps/web"
                  href={item.href}
                  hrefLabel={`Open ${item.label}`}
                />
              </div>
            ))}
          </GridPreset>
        </Section>

        <Section title="Docs and ownership">
          <GridPreset preset="dashboard">
            <div className="lg:col-span-8">
              <GridPreset preset="dashboard">
                {docsHighlights.map((item) => (
                  <div key={item.title} className="lg:col-span-6">
                    <CatalogCard
                      title={item.title}
                      description={item.description}
                      owner="apps/web docs"
                      href={item.href}
                      hrefLabel="Open docs"
                    />
                  </div>
                ))}
              </GridPreset>
            </div>
            <div className="lg:col-span-4">
              <RegistryMindsetCard />
            </div>
          </GridPreset>
        </Section>
      </div>
    </div>
  );
}

export function renderComponentsDirectoryPage() {
  const featuredRows = registry.components.filter((component) =>
    featuredComponents.some((entry) => entry.name === component.name),
  );

  return (
    <MarketingShell
      title="Component previews and source in Shandapha-owned packages."
      eyebrow="Components"
      summary="The shared primitive layer now shows up in preview and source surfaces instead of a metadata-only catalog, while install targets stay fully owned inside the monorepo."
      actions={
        <Inline gap={10}>
          <Button asChild size="sm">
            <Link href="/directory">Open directory</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/docs">Browse docs</Link>
          </Button>
        </Inline>
      }
    >
      <Section title="Live preview and code">
        <ComponentShowcaseGrid />
      </Section>

      <Section title="Owned directory">
        <DirectoryTable
          rows={featuredRows.concat(
            registry.components.filter(
              (component) =>
                !featuredRows.some((featured) => featured.name === component.name),
            ),
          )}
        />
      </Section>

      <Section title="Shandapha extensions on the same baseline">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Support surfaces"
              points={[
                "ThemePackCard, TemplateCard, TokenMapperTable, PatchDiffPreview, and ExportOptionCard stay local and editable.",
                "They inherit the same card, border, spacing, and form grammar as the shared baseline.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="React-facing ownership"
              points={[
                "`packages/react` exposes the shared baseline in Shandapha form.",
                "Hooks, providers, and entitlements/limits adapters stay where the platform expects them.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="No hidden vendor layer"
              points={[
                "Install targets point at `packages/core`, `packages/react`, and `packages/layouts`.",
                "There is no giant vendor website subtree inside the monorepo runtime.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderBlocksGalleryPage() {
  return (
    <MarketingShell
      title="Blocks and page patterns follow the shared baseline."
      eyebrow="Blocks"
      summary="Auth, dashboard, sidebar, and marketing compositions now live through Shandapha-owned shells, blocks, and support surfaces."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/templates">Open templates</Link>
        </Button>
      }
    >
      <Section title="Featured block patterns">
        <GridPreset preset="dashboard">
          {featuredBlocks.map((block) => (
            <div key={block.slug} className="lg:col-span-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b">
                    <BlockPatternPreview slug={block.slug} />
                  </div>
                  <div className="grid gap-3 p-6">
                    <div className="grid gap-1">
                      <CardTitle>{block.title}</CardTitle>
                      <CardDescription className="leading-6">
                        {block.description}
                      </CardDescription>
                    </div>
                    <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
                      Owned in <code>{block.owner}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Owned block registry">
        <DirectoryTable
          rows={registry.blocks.map((block) => ({
            name: block.name,
            title: block.title,
            categories: block.categories,
            installTarget: block.installTarget,
          }))}
        />
      </Section>

      <Section title="What this enables">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Auth blocks"
              points={[
                "Sign-in and sign-up routes use the same card, spacing, and field rhythm as the rest of the system.",
                "Trust copy and support content remain Shandapha-owned, not pasted from the source site.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Sidebar/dashboard blocks"
              points={[
                "Sidebar-driven dashboards inherit the shared admin shell and block feel.",
                "Metrics, charts, tables, and supporting rails share one visual baseline.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Marketing/legal/docs blocks"
              points={[
                "Pricing, FAQ, contact, trust, and docs/article shells now behave like natural members of the same family.",
                "Extra Shandapha pages are integrated as extensions, not redesign experiments.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderChartsGalleryPage() {
  return (
    <MarketingShell
      title="Chart families, wrappers, and defaults in the shared layer."
      eyebrow="Charts"
      summary="Shandapha owns the chart container, tooltip, legend, and token rules behind the full chart family used across web and Studio."
      actions={
        <Inline gap={10}>
          <Button asChild size="sm">
            <Link href="/directory">Browse chart registry</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/playground">Open playground</Link>
          </Button>
        </Inline>
      }
    >
      <Section title="Chart families">
        <GridPreset preset="dashboard">
          {chartFamilies.map((family) => (
            <div key={family.type} className="lg:col-span-4">
              <CatalogCard
                title={`${family.title} charts`}
                description={`${family.description} ${family.count} reference examples are represented.`}
                owner={family.owner}
              />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Live Shandapha-owned wrappers">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-6">
            <ChartSurfaceCard
              title="Adoption trend"
              description="Area/line defaults now read like part of the same neutral system as docs, cards, and sidebars."
              data={[
                { label: "Week 1", adoption: 18, normalization: 12 },
                { label: "Week 2", adoption: 32, normalization: 24 },
                { label: "Week 3", adoption: 48, normalization: 40 },
                { label: "Week 4", adoption: 64, normalization: 58 },
              ]}
              labelKey="label"
              valueKey="adoption"
              secondaryKey="normalization"
            />
          </div>
          <div className="lg:col-span-6">
            <ChartSurfaceCard
              title="Usage health"
              description="The same chart wrapper powers operations, billing, and marketing signal surfaces."
              data={[
                { label: "Exports", value: 31 },
                { label: "Themes", value: 19 },
                { label: "Templates", value: 27 },
                { label: "Patches", value: 14 },
              ]}
              labelKey="label"
              valueKey="value"
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Rules enforced">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Container conventions"
              points={[
                "Charts live inside shared cards and inherit semantic surface tokens.",
                "Tooltips and legends follow the same border, radius, and typography rules as the rest of the UI.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Token compatibility"
              points={[
                "Chart colors map through semantic CSS variables instead of one-off page styles.",
                "The runtime can still support future pack variations without forking chart code.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Ownership"
              points={[
                "Chart wrappers live in the shared component layer, not inside app pages.",
                "The chart surface informs both web and Studio dashboards.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderExamplesPage() {
  return (
    <MarketingShell
      title="Examples and demos frame the same baseline."
      eyebrow="Examples"
      summary="Dashboard, tasks, playground, authentication, and RTL references now inform Shandapha-owned examples, docs, and product surfaces."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/playground">Open playground</Link>
        </Button>
      }
    >
      <Section title="Example families">
        <GridPreset preset="dashboard">
          {examplePages.map((example) => (
            <div key={example.slug} className="lg:col-span-4">
              <CatalogCard
                title={example.title}
                description={example.description}
                owner={example.owner}
              />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Current Shandapha extras linked into the same system">
        <GridPreset preset="dashboard">
          {secondaryNavItems
            .filter((item) => item.href !== "/examples")
            .map((item) => (
              <div key={item.href} className="lg:col-span-4">
                <CatalogCard
                  title={item.label}
                  description="Existing Shandapha surface kept in place and integrated as a clean extension of the shared baseline."
                  owner="Shandapha route"
                  href={item.href}
                  hrefLabel={`Open ${item.label}`}
                />
              </div>
            ))}
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderThemesPage() {
  return (
    <MarketingShell
      title="Theme ergonomics shared across the system, token runtime preserved by Shandapha."
      eyebrow="Themes"
      summary="Theme toggling, neutral defaults, CSS-variable ownership, and local customizability now follow one shared baseline while the semantic token contract remains intact."
    >
      <Section title="Runtime controls">
        <GridPreset preset="detail" className="items-start">
          <Card>
            <CardHeader>
              <CardTitle>Active controls</CardTitle>
              <CardDescription>
                These are the same shared controls used by the public site and Studio.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pack
                </span>
                <PackPreviewSwitcher />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Mode
                </span>
                <ThemeModeToggle />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Density
                </span>
                <DensityToggle />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Motion
                </span>
                <MotionToggle />
              </div>
            </CardContent>
          </Card>
          <Stack gap={16}>
            <ThemeFoundationCard />
            <ContrastWarningPanel />
          </Stack>
        </GridPreset>
      </Section>

      <Section title="Pack catalog">
        <GridPreset preset="dashboard">
          {packs.map((pack) => (
            <div key={pack.id} className="lg:col-span-4">
              <ThemePackCard packId={pack.id} />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Semantic slots">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <TokenSlotCard
              slot="--background"
              value={themeScale.background}
              description="Base canvas"
              usage="Provides the neutral site and app canvas that keeps everything inside the shared baseline."
            />
          </div>
          <div className="lg:col-span-4">
            <TokenSlotCard
              slot="--surface"
              value={themeScale.surface}
              description="Raised surface"
              usage="Used for cards, docs rails, examples, and support panels."
            />
          </div>
          <div className="lg:col-span-4">
            <TokenSlotCard
              slot="--primary"
              value={themeScale.primary}
              description="Action emphasis"
              usage="Buttons, active states, highlights, and chart emphasis."
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderColorsPage() {
  return (
    <MarketingShell
      title="The baseline still runs on semantic colors."
      eyebrow="Colors"
      summary="The shared visual baseline still runs on the same semantic token contract defined in `packages/core` and used across the registry, generator, and Studio, while the runtime is owned and controlled inside Shandapha."
    >
      <Section title="Core slots">
        <GridPreset preset="dashboard">
          {[
            ["--background", themeScale.background, "Base page canvas"],
            ["--foreground", themeScale.foreground, "Primary text and icon color"],
            ["--card", themeScale.card, "Card and popover surfaces"],
            ["--muted", themeScale.muted, "Muted rails, code blocks, and support fills"],
            ["--border", themeScale.border, "Dividers and outline surfaces"],
            ["--chart-1", themeScale.chart1, "Primary chart color"],
          ].map(([slot, value, usage]) => (
            <div key={slot} className="lg:col-span-4">
              <TokenSlotCard
                slot={slot}
                value={value}
                description={usage}
                usage="Semantic runtime output"
              />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Why this matters">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="No raw-color business logic"
              points={[
                "Generator, packs, and registry flows still work through named slots.",
                "The visual baseline does not leak hardcoded colors into platform logic.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Pack ready"
              points={[
                "Normal, Glass, and Neon can still branch later without forking the UI system.",
                "Brand kits and token mapping remain future-compatible.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Cross-app consistency"
              points={[
                "Web and Studio share the same token runtime and visible baseline.",
                "Shared shells and components can remain locally owned and editable.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderDirectoryPage() {
  return (
    <MarketingShell
      title="A registry-style directory in Shandapha ownership."
      eyebrow="Directory"
      summary="The directory maps to components, blocks, charts, shells, templates, packs, and workspaces owned by the existing monorepo."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/docs">Read docs</Link>
        </Button>
      }
    >
      <Section title="Directory coverage">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-3">
            <SectionSignal
              title="Components"
              value={`${registry.components.length}`}
              detail="Broad primitive surface aligned to the shared baseline."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Blocks"
              value={`${registry.blocks.length}`}
              detail="Auth, dashboard, docs, and marketing composition units."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Charts"
              value={`${registry.charts.length}`}
              detail="Chart wrappers and live visualization surfaces."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Shells"
              value={`${registry.shells.length}`}
              detail="Marketing, docs, sidebar, admin, and auth shells."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Templates"
              value={`${registry.templates.length}`}
              detail="Template manifests with states, shells, and related items."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Packs"
              value={`${registry.packs.length}`}
              detail="Shandapha-owned aesthetic branches on the same runtime."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Workspaces"
              value={`${registry.workspaces.length}`}
              detail="Monorepo-aware install targets and alias ownership."
            />
          </div>
          <div className="lg:col-span-3">
            <SectionSignal
              title="Modules"
              value={`${registry.modules.length}`}
              detail="Feature modules that stay separated from the core baseline."
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Installability model">
        <GridPreset preset="detail" className="items-start">
          <RegistryMindsetCard />
          <DirectoryTable
            rows={[
              ...registry.components.slice(0, 8),
              ...registry.blocks.slice(0, 4),
              ...registry.charts.slice(0, 3),
            ].map((item) => ({
              name: item.name,
              title: item.title,
              categories: item.categories,
              installTarget: item.installTarget,
            }))}
          />
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

export function renderCreatePage() {
  return (
    <MarketingShell
      title="Create and install flows mapped to Shandapha seams."
      eyebrow="Create"
      summary="Packages own the UI, registry owns metadata, generator and CLI own install flows, and Studio owns guided product setup."
      actions={
        <Inline gap={10}>
          <Button asChild size="sm">
            <Link href="/templates">Browse templates</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/playground">Open playground</Link>
          </Button>
        </Inline>
      }
    >
      <Section title="Start path">
        <GridPreset preset="dashboard">
          {createHighlights.map((item) => (
            <div key={item.title} className="lg:col-span-6">
              <CatalogCard
                title={item.title}
                description={item.description}
                owner="apps/web + packages/registry + packages/generator"
                href={item.href}
                hrefLabel="Open"
              />
            </div>
          ))}
        </GridPreset>
      </Section>

      <Section title="Shared runtime controls">
        <GridPreset preset="detail" className="items-start">
          <Card>
            <CardHeader>
              <CardTitle>Preview the shared baseline</CardTitle>
              <CardDescription>
                These controls prove that the public site and Studio now share the same owned runtime.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Pack
                </span>
                <PackPreviewSwitcher />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Mode
                </span>
                <ThemeModeToggle />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Density
                </span>
                <DensityToggle />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Motion
                </span>
                <MotionToggle />
              </div>
            </CardContent>
          </Card>
          <Stack gap={16}>
            <ThemePackCard packId="normal" />
            <ThemeFoundationCard />
          </Stack>
        </GridPreset>
      </Section>

      <Section title="How the baseline lands in Shandapha">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Web"
              points={[
                "Acts as the public catalog, docs, directory, and create/distribution surface.",
                "Now mirrors the shared page and nav feel.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Studio"
              points={[
                "Keeps auth, wizard, workspaces, exports, billing, usage, and governance.",
                "Now reads like it belongs to the same baseline instead of a parallel visual system.",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ProductReadinessCard
              title="Packages"
              points={[
                "Core, react, layouts, templates, runtime, tokens, registry, generator, and CLI stay the ownership boundaries.",
                "That is where the shared baseline lives.",
              ]}
            />
          </div>
        </GridPreset>
      </Section>
    </MarketingShell>
  );
}

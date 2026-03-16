import {
  createAuditEntry,
  exportAuditTrailMarkdown,
  summarizeAuditTrail,
} from "@shandapha/business";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shandapha/core";
import { plans } from "@shandapha/entitlements";
import { createGenerationPreview } from "@shandapha/generator-manifests";
import { evaluateCatalogPolicies, loadCatalogConfig } from "@shandapha/registry";
import {
  AdminShell,
  AuthShell,
  GridPreset,
  Inline,
  Section,
  Stack,
} from "@shandapha/layouts";
import { packs } from "@shandapha/packs";
import {
  BrandSafetyNotice,
  ChartSurfaceCard,
  ChecklistPanel,
  CodeBlock,
  ContrastWarningPanel,
  DataToolbar,
  DensityToggle,
  DoctorStatusList,
  EntitlementBadge,
  ExportOptionCard,
  FocusVisibilityPreview,
  MotionToggle,
  PackLimitsSummary,
  PackPreviewSwitcher,
  PatchDiffPreview,
  RegistryMindsetCard,
  RelatedTemplatesStrip,
  TemplateCard,
  TemplateDataContractPanel,
  TemplateStateGallery,
  ThemeModeToggle,
  ThemePackCard,
  TokenMapperTable,
  VerificationSteps,
  WizardStepShell,
  WorkspaceLaunchCard,
} from "@shandapha/react";
import Link from "next/link";
import { getStudioCatalog } from "@/lib/registry";

const catalog = getStudioCatalog("acme");
const registry = catalog.manifest;
const catalogConfig = loadCatalogConfig();
const generationPreview = createGenerationPreview({
  version: 1,
  framework: "next-app-router",
  intent: "existing-project",
  packId: "glass",
  planId: "premium",
  templates: ["dashboard-home", "billing-plans-starter", "auth/sign-in"],
  modules: ["datatable", "seo"],
  catalogWorkspaceId: "acme",
});
const generationPolicyResult = evaluateCatalogPolicies({
  catalog,
  policies: catalogConfig.policies,
  selectedRegistryIds: [
    generationPreview.selectedPack.registryId,
    ...generationPreview.selectedTemplates.map((template) => template.registryId),
    ...generationPreview.selectedModules.map((module) => module.registryId),
  ],
});

const wizardSteps = [
  { id: "intent", title: "Intent" },
  { id: "framework", title: "Framework" },
  { id: "product-type", title: "Product type" },
  { id: "style-pack", title: "Style pack" },
  { id: "brand-kit", title: "Brand kit" },
  { id: "pages", title: "Pages" },
  { id: "features", title: "Features" },
  { id: "export", title: "Export" },
  { id: "done", title: "Done" },
] as const;

const usageTrend = [
  { label: "Week 1", exports: 4, checks: 10 },
  { label: "Week 2", exports: 9, checks: 16 },
  { label: "Week 3", exports: 14, checks: 21 },
  { label: "Week 4", exports: 18, checks: 27 },
] as const;

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function studioNavGroups(active: "wizard" | "workspaces") {
  return [
    {
      label: "Studio",
      items: [
        { href: "/wizard", label: "Wizard", active: active === "wizard" },
        {
          href: "/workspaces",
          label: "Workspaces",
          active: active === "workspaces",
        },
      ],
    },
    {
      label: "Shortcuts",
      items: [
        { href: "/wizard/style-pack", label: "Theme setup" },
        { href: "/wizard/export", label: "Export path" },
      ],
    },
  ];
}

function workspaceNavGroups(workspaceId: string, activeSection: string) {
  return [
    {
      label: "Workspace",
      items: [
        {
          href: `/workspaces/${workspaceId}/overview`,
          label: "Overview",
          active: activeSection === "overview",
        },
        {
          href: `/workspaces/${workspaceId}/themes`,
          label: "Themes",
          active: activeSection === "themes",
        },
        {
          href: `/workspaces/${workspaceId}/templates`,
          label: "Templates",
          active: activeSection === "templates",
        },
        {
          href: `/workspaces/${workspaceId}/exports`,
          label: "Exports",
          active: activeSection === "exports",
        },
        {
          href: `/workspaces/${workspaceId}/billing`,
          label: "Billing",
          active: activeSection === "billing",
        },
        {
          href: `/workspaces/${workspaceId}/usage`,
          label: "Usage",
          active: activeSection === "usage",
        },
      ],
    },
    {
      label: "Governance",
      items: [
        {
          href: `/workspaces/${workspaceId}/members`,
          label: "Members",
          active: activeSection === "members",
        },
        {
          href: `/workspaces/${workspaceId}/api-keys`,
          label: "API keys",
          active: activeSection === "api-keys",
        },
        {
          href: `/workspaces/${workspaceId}/policies`,
          label: "Policies",
          active: activeSection === "policies",
        },
        {
          href: `/workspaces/${workspaceId}/audit`,
          label: "Audit",
          active: activeSection === "audit",
        },
      ],
    },
  ];
}

function currentStepLabel(stepId: string) {
  const stepIndex = wizardSteps.findIndex((step) => step.id === stepId);
  const index = stepIndex === -1 ? 0 : stepIndex;
  return `${index + 1} / ${wizardSteps.length}`;
}

function renderAuthForm(kind: "sign-in" | "sign-up") {
  const isSignIn = kind === "sign-in";

  return (
    <AuthShell
      title={
        isSignIn ? "Welcome back to Studio" : "Create your Studio workspace"
      }
      eyebrow="Access"
      summary={
        isSignIn
          ? "Resume wizard progress, exports, billing, usage, and governance from the shared product shell."
          : "Start with the shared UI foundation now and keep the architecture flexible as the product grows."
      }
      aside={
        <Stack gap={16}>
          <ThemePackCard packId="normal" />
          <ChecklistPanel
            title="Why teams adopt here"
            items={[
              {
                label: "Same baseline as the public site",
                done: true,
                detail:
                  "Docs, marketing, and Studio now share one visual and implementation model.",
              },
              {
                label: "Local ownership stays intact",
                done: true,
                detail:
                  "The UI system is editable inside project packages, not hidden behind a vendor boundary.",
              },
              {
                label: "Wizard, CLI, and registry stay aligned",
                done: true,
                detail:
                  "Metadata and generation semantics still belong to Shandapha.",
              },
            ]}
          />
        </Stack>
      }
    >
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-2">
              <CardTitle>{isSignIn ? "Sign in" : "Create account"}</CardTitle>
              <CardDescription>
                {isSignIn
                  ? "Use the same workspace identity that controls packs, templates, exports, and governance."
                  : "Start a workspace that already understands packs, templates, registry metadata, and exports."}
              </CardDescription>
            </div>
            <EntitlementBadge planId="premium" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <FieldGroup>
            {!isSignIn ? (
              <Field>
                <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                <Input id="workspace-name" placeholder="Atlas Health" />
                <FieldDescription>
                  This name carries through Studio, exports, and registry
                  metadata.
                </FieldDescription>
              </Field>
            ) : null}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="team@company.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" />
            </Field>
          </FieldGroup>
          <Inline gap={12}>
            <Button asChild type="button">
              <Link href={isSignIn ? "/workspaces" : "/wizard"}>
                {isSignIn ? "Continue" : "Create workspace"}
              </Link>
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                {isSignIn ? "Need an account?" : "Already have an account?"}
              </Link>
            </Button>
          </Inline>
        </CardContent>
      </Card>
    </AuthShell>
  );
}

function renderWizardBody(stepId: string) {
  const dashboardTemplate =
    registry.templates.find((template) => template.slug === "dashboard-home") ??
    registry.templates[0];
  const docsTemplate =
    registry.templates.find((template) => template.slug === "docs-home") ??
    registry.templates[1];
  const marketingTemplate =
    registry.templates.find(
      (template) => template.slug === "landing-section-based",
    ) ?? registry.templates[2];

  if (stepId === "framework") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Choose the target framework"
        description="Framework choice still feeds the same generator core; the adopted UI baseline simply changes what the generated surfaces look and feel like."
        aside={
          <>
            <ChecklistPanel
              items={[
                {
                  label: "Next.js App Router",
                  done: true,
                  detail:
                    "Best current fit for Shandapha’s web and Studio apps.",
                },
                {
                  label: "React Vite",
                  done: true,
                  detail:
                    "Still available for starter exports and lightweight adoption.",
                },
                {
                  label: "Web Components and Blazor",
                  done: true,
                  detail:
                    "Remain future-compatible because the token contract and generator seams were preserved.",
                },
              ]}
            />
            <RegistryMindsetCard />
          </>
        }
      >
        <GridPreset preset="dashboard">
          {[
            {
              label: "Next.js",
              description:
                "Closest match to the current monorepo and block-rich app surfaces.",
            },
            {
              label: "React Vite",
              description:
                "Fast starter for teams adopting templates outside the current repo.",
            },
            {
              label: "Web Components",
              description:
                "Keeps portability baseline intact for future exports.",
            },
            {
              label: "Blazor WC",
              description:
                "Retains the portable Web Components path without forking the design system.",
            },
          ].map((option) => (
            <div key={option.label} className="lg:col-span-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{option.label}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </GridPreset>
      </WizardStepShell>
    );
  }

  if (stepId === "product-type") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Pick the product shape"
        description="Studio now previews the same shared shells and blocks that the public catalog documents."
        aside={
          <>
            <TemplateStateGallery states={dashboardTemplate.states} />
            <TemplateDataContractPanel
              contract={dashboardTemplate.dataContract}
            />
          </>
        }
      >
        <GridPreset preset="dashboard">
          {[dashboardTemplate, marketingTemplate, docsTemplate].map(
            (template) => (
              <div key={template.slug} className="lg:col-span-4">
                <TemplateCard template={template} />
              </div>
            ),
          )}
        </GridPreset>
      </WizardStepShell>
    );
  }

  if (stepId === "style-pack") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Tune the visual pack"
        description="Packs now sit on top of the adopted component baseline instead of requiring a separate visual system."
        aside={
          <>
            <ContrastWarningPanel />
            <PackLimitsSummary />
          </>
        }
      >
        <Stack gap={24}>
          <Inline gap={12}>
            <PackPreviewSwitcher />
            <ThemeModeToggle />
          </Inline>
          <Inline gap={12}>
            <DensityToggle />
            <MotionToggle />
          </Inline>
          <GridPreset preset="dashboard">
            {packs.map((pack) => (
              <div key={pack.id} className="lg:col-span-4">
                <ThemePackCard packId={pack.id} />
              </div>
            ))}
          </GridPreset>
        </Stack>
      </WizardStepShell>
    );
  }

  if (stepId === "brand-kit") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Map the brand inputs"
        description="Brand input remains constrained by semantic slots so packs, templates, and future brand kits can stay compatible."
        aside={
          <>
            <BrandSafetyNotice />
            <FocusVisibilityPreview />
          </>
        }
      >
        <TokenMapperTable
          rows={[
            {
              slot: "primary",
              source: "brand kit primary",
              exportTarget: "--sh-primary-light / --sh-primary-dark",
              note: "Feeds buttons, links, shell active states, and emphasis surfaces.",
            },
            {
              slot: "accent",
              source: "brand kit accent",
              exportTarget: "--sh-accent-light / --sh-accent-dark",
              note: "Used for supportive emphasis while preserving semantic ownership.",
            },
            {
              slot: "radius",
              source: "brand kit radius",
              exportTarget: "--sh-radius-md",
              note: "Changes the surface feel without forking component APIs.",
            },
            {
              slot: "font",
              source: "brand kit font",
              exportTarget: "--sh-font-body / --sh-font-display",
              note: "Carries through docs, marketing, and admin shells.",
            },
          ]}
        />
      </WizardStepShell>
    );
  }

  if (stepId === "pages") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Choose templates and blocks"
        description="Templates now show shell, block, state, and data-contract metadata directly inside Studio."
        aside={
          <TemplateDataContractPanel
            contract={dashboardTemplate.dataContract}
          />
        }
      >
        <GridPreset preset="dashboard">
          {registry.templates.slice(0, 6).map((template) => (
            <div key={template.slug} className="lg:col-span-6">
              <TemplateCard template={template} />
            </div>
          ))}
        </GridPreset>
      </WizardStepShell>
    );
  }

  if (stepId === "features") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Enable feature depth"
        description="Installable modules, table workflows, and richer blocks now resolve through registry and entitlement truth instead of bolt-on copy."
        aside={
          <>
            <PackLimitsSummary />
            <ChecklistPanel
              title="Feature rails"
              items={registry.modules.map((module) => ({
                label: module.name,
                done: true,
                detail: module.description,
              }))}
            />
          </>
        }
      >
        <Stack gap={24}>
          <DataToolbar
            filters={[
              "Saved views",
              "Bulk actions",
              "Status filter",
              "Export ready",
            ]}
            actionLabel="Create feature bundle"
          />
          <ChartSurfaceCard
            title="Feature activation"
            description="Studio keeps lightweight analytics previews while generator, registry, and policy checks stay in the critical path."
            data={[...usageTrend]}
            valueKey="exports"
            secondaryKey="checks"
          />
        </Stack>
      </WizardStepShell>
    );
  }

  if (stepId === "export") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Choose the export path"
        description="Export logic remains Shandapha-owned, but the delivery surfaces now inherit the full adopted visual baseline."
        aside={<DoctorStatusList checks={generationPreview.doctorChecks} />}
      >
        <Stack gap={24}>
          <GridPreset preset="dashboard">
            <div className="lg:col-span-4">
              <ExportOptionCard
                title="Starter app"
                description="Generate a clean starter with shared tokens, layouts, and registry metadata."
                ctaLabel="Export starter"
                checklist={[
                  "Includes package-owned UI baseline.",
                  "Keeps registry metadata intact.",
                  "Best for greenfield work.",
                ]}
                recommended
              />
            </div>
            <div className="lg:col-span-4">
              <ExportOptionCard
                title="Patch existing project"
                description="Apply a reviewable, reversible patch into an existing codebase."
                ctaLabel="Patch project"
                checklist={[
                  "Reversible install plan.",
                  "Minimal file churn.",
                  "Best for live repos.",
                ]}
              />
            </div>
            <div className="lg:col-span-4">
              <ExportOptionCard
                title="Theme-only"
                description="Adopt the token runtime, packs, and theme ergonomics first."
                ctaLabel="Export theme"
                checklist={[
                  "Keeps current app structure.",
                  "Best for phased rollout.",
                  "Preserves future upgrade path.",
                ]}
              />
            </div>
          </GridPreset>
          <PatchDiffPreview
            lines={[
              "+ apps/web/components.json",
              "+ apps/studio/components.json",
              "+ packages/core/src/styles/index.css",
              "+ packages/registry/src/data/catalog.ts",
              "~ apps/web/src/lib/site-content.tsx",
              "~ apps/studio/src/lib/studio-content.tsx",
            ]}
          />
        </Stack>
      </WizardStepShell>
    );
  }

  if (stepId === "done") {
    return (
      <WizardStepShell
        step={currentStepLabel(stepId)}
        title="Verify the rollout"
        description="Before shipping, verify theme behavior, state completeness, registry metadata, and patch safety."
        aside={<RegistryMindsetCard />}
      >
        <Stack gap={24}>
          <ChecklistPanel
            items={generationPreview.checklist.map((item) => ({
              label: item,
              done: true,
              detail: "Included in the current rollout checklist.",
            }))}
          />
          <VerificationSteps
            steps={[
              {
                title: "Review theme output",
                description:
                  "Check light/dark, pack, density, and motion combinations.",
                status: "done",
              },
              {
                title: "Review generated surfaces",
                description:
                  "Ensure templates and shells feel native to the adopted baseline.",
                status: "current",
              },
              {
                title: "Run doctor",
                description:
                  "Validate patch safety, tokens, styles, and provider wiring.",
                status: "pending",
              },
            ]}
          />
        </Stack>
      </WizardStepShell>
    );
  }

  return (
    <WizardStepShell
      step={currentStepLabel(stepId)}
      title="Choose the delivery intent"
      description="This decision shapes export posture, template depth, and how much of the adopted system lands immediately."
      aside={
        <>
          <ChecklistPanel
            items={[
              {
                label: "Use the adopted baseline everywhere",
                done: true,
                detail:
                  "Marketing, docs, Studio, and shared packages now read as one family.",
              },
              {
                label: "Keep the architecture intact",
                done: true,
                detail:
                  "Apps, API, packs, generator, CLI, and business rules remain in place.",
              },
            ]}
          />
          <RegistryMindsetCard />
        </>
      }
    >
      <GridPreset preset="dashboard">
        <div className="lg:col-span-4">
          <ExportOptionCard
            title="New product"
            description="Generate a full starter with owned shells, blocks, and tokens."
            ctaLabel="Start new"
            checklist={[
              "Best for greenfield shipping.",
              "Pulls in the full adopted baseline.",
              "Keeps future packs open.",
            ]}
            recommended
          />
        </div>
        <div className="lg:col-span-4">
          <ExportOptionCard
            title="Existing project"
            description="Patch an existing app without flattening its current architecture."
            ctaLabel="Patch existing"
            checklist={[
              "Reversible change plan.",
              "Registry metadata still added centrally.",
              "Good for phased adoption.",
            ]}
          />
        </div>
        <div className="lg:col-span-4">
          <ExportOptionCard
            title="Preview only"
            description="Use Studio to evaluate packs, templates, and shells before touching code."
            ctaLabel="Preview"
            checklist={[
              "Great for design review.",
              "Lets teams test theme and shell choices.",
              "Same baseline, lower risk.",
            ]}
          />
        </div>
      </GridPreset>
    </WizardStepShell>
  );
}

function renderWorkspaceSection(section: string, workspaceId: string) {
  const workspaceName = titleCase(workspaceId);
  const auditEntries = [
    createAuditEntry({
      actor: "promise.feliti",
      action: "export.created",
      scope: workspaceId,
      detail:
        "Generated an existing-project patch plan for the dashboard stack.",
    }),
    createAuditEntry({
      actor: "studio-bot",
      action: "theme.saved",
      scope: workspaceId,
      detail:
        "Saved the Glass pack with compact density and reduced motion fallback.",
    }),
    createAuditEntry({
      actor: "ops-review",
      action: "policy.reviewed",
      scope: workspaceId,
      detail:
        "Validated registry metadata, export review, and pack compatibility rules.",
    }),
  ];
  const auditSummary = summarizeAuditTrail(auditEntries);
  const featuredTemplate =
    registry.templates.find((template) => template.slug === "dashboard-home") ??
    registry.templates[0];

  if (section === "themes") {
    return (
      <Stack gap={24}>
        <Inline gap={12}>
          <PackPreviewSwitcher />
          <ThemeModeToggle />
        </Inline>
        <Inline gap={12}>
          <DensityToggle />
          <MotionToggle />
        </Inline>
        <GridPreset preset="dashboard">
          {packs.map((pack) => (
            <div key={pack.id} className="lg:col-span-4">
              <ThemePackCard packId={pack.id} />
            </div>
          ))}
        </GridPreset>
        <GridPreset preset="detail" className="items-start">
          <TokenMapperTable
            rows={[
              {
                slot: "primary",
                source: "workspace brand kit",
                exportTarget: "--sh-primary-light / --sh-primary-dark",
              },
              {
                slot: "surface",
                source: "pack runtime",
                exportTarget: "--sh-surface-light / --sh-surface-dark",
              },
              {
                slot: "sidebar",
                source: "shell theme layer",
                exportTarget: "--sh-sidebar-light / --sh-sidebar-dark",
              },
            ]}
          />
          <Stack gap={16}>
            <ContrastWarningPanel />
            <FocusVisibilityPreview />
          </Stack>
        </GridPreset>
      </Stack>
    );
  }

  if (section === "templates") {
    return (
      <Stack gap={24}>
        <GridPreset preset="dashboard">
          {registry.templates.slice(0, 4).map((template) => (
            <div key={template.slug} className="lg:col-span-6">
              <Card className="h-full">
                <CardContent className="grid gap-4 pt-6">
                  <TemplateCard template={template} />
                  <Inline gap={8} className="flex-wrap">
                    <Badge variant="outline">{template.supportLevel}</Badge>
                    <Badge variant="outline">{template.trustLevel}</Badge>
                    <Badge variant="outline">{template.stability}</Badge>
                    <Badge variant="secondary">{template.visibility}</Badge>
                  </Inline>
                  <div className="text-sm text-muted-foreground">
                    {template.registryId} via {template.provenance.sourceId}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </GridPreset>
        <GridPreset preset="detail" className="items-start">
          <TemplateStateGallery states={featuredTemplate.states} />
          <Stack gap={16}>
            <TemplateDataContractPanel contract={featuredTemplate.dataContract} />
            <Card>
              <CardHeader>
                <CardTitle>Catalog approvals</CardTitle>
                <CardDescription>
                  Workspace-scoped assets and approved first-party templates resolve from the same registry truth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroup className="gap-3">
                  {catalog.approvals.slice(0, 3).map((approval) => (
                    <Item key={approval.id} variant="outline" size="sm">
                      <ItemContent>
                        <ItemDescription className="line-clamp-none">
                          {approval.registryId} · {approval.status} · {approval.scope}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
          </Stack>
        </GridPreset>
        <RelatedTemplatesStrip slugs={featuredTemplate.related} />
      </Stack>
    );
  }

  if (section === "exports") {
    return (
      <Stack gap={24}>
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <ExportOptionCard
              title="Starter export"
              description="Generate a clean starter from the current workspace defaults."
              ctaLabel="Export starter"
              checklist={[
                "Owned baseline",
                "Registry metadata",
                "Token runtime",
              ]}
              recommended
            />
          </div>
          <div className="lg:col-span-4">
            <ExportOptionCard
              title="Patch install"
              description="Apply the shared UI baseline into an existing codebase."
              ctaLabel="Patch repo"
              checklist={[
                "Reversible diff",
                "Minimal churn",
                "Reviewable files",
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <ExportOptionCard
              title="Theme package"
              description="Ship tokens and runtime first, then layer blocks later."
              ctaLabel="Export theme"
              checklist={[
                "Semantic tokens",
                "Pack-ready runtime",
                "Future-safe",
              ]}
            />
          </div>
        </GridPreset>
        <PatchDiffPreview
          lines={[
            "+ apps/web/src/styles/globals.css",
            "+ packages/core/src/foundation.tsx",
            "+ packages/registry/src/data/catalog.ts",
            "~ packages/react/src/index.tsx",
            "~ apps/studio/src/lib/studio-content.tsx",
          ]}
        />
        <DoctorStatusList checks={generationPreview.doctorChecks} />
      </Stack>
    );
  }

  if (section === "billing") {
    return (
      <Stack gap={24}>
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
                    {plan.includes.slice(0, 4).map((item) => (
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
        <PackLimitsSummary />
      </Stack>
    );
  }

  if (section === "usage") {
    return (
      <Stack gap={24}>
        <ChartSurfaceCard
          title="Workspace usage"
          description={`Usage in ${workspaceName} stays visible inside the same registry-aware workspace shell.`}
          data={[...usageTrend]}
          valueKey="exports"
          secondaryKey="checks"
        />
        <ChecklistPanel
          title="Usage posture"
          items={[
            {
              label: "Exports are active",
              done: true,
              detail:
                "Teams are using both starter exports and patch installs.",
            },
            {
              label: "Doctor checks are running",
              done: true,
              detail: "Verification remains visible before files leave Studio.",
            },
            {
              label: "Template adoption is rising",
              done: true,
              detail: "Catalog metadata is informing real workspace decisions.",
            },
          ]}
        />
      </Stack>
    );
  }

  if (section === "members") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Roles and invites now live inside the same adopted admin shell as
            exports and billing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Promise Feliti", "Owner", "Active"],
                ["Platform Ops", "Admin", "Active"],
                ["Design Systems", "Editor", "Pending invite"],
              ].map(([name, role, status]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>{status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (section === "api-keys") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API keys</CardTitle>
          <CardDescription>
            API access remains inside the Studio shell, ready for policy and
            audit linkage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-3">
            {[
              "studio_live_xxxxx1234",
              "export_worker_xxxxx5678",
              "registry_sync_xxxxx9012",
            ].map((key) => (
              <Item key={key} variant="outline" size="sm" className="font-mono">
                <ItemContent>
                  <ItemTitle className="font-mono text-xs font-normal">
                    {key}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    );
  }

  if (section === "policies") {
    return (
      <Stack gap={24}>
        <BrandSafetyNotice />
        <Card>
          <CardHeader>
            <CardTitle>Catalog policy posture</CardTitle>
            <CardDescription>
              Studio now reflects the same approval and policy evaluator used by the CLI and generator.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Inline gap={8} className="flex-wrap">
              <Badge variant="outline">{generationPolicyResult.status}</Badge>
              <Badge variant="secondary">
                {catalog.sources.length} catalog sources
              </Badge>
              <Badge variant="secondary">
                {catalog.approvals.length} approvals
              </Badge>
              <Badge variant="secondary">
                {catalog.warnings.length} warnings
              </Badge>
            </Inline>
            <ItemGroup className="gap-3">
              {generationPolicyResult.findings.length > 0 ? (
                generationPolicyResult.findings.map((finding) => (
                  <Item
                    key={`${finding.code}:${finding.registryId ?? "catalog"}`}
                    variant="outline"
                    size="sm"
                  >
                    <ItemContent>
                      <ItemDescription className="line-clamp-none">
                        [{finding.severity}] {finding.message}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))
              ) : (
                <Item variant="outline" size="sm">
                  <ItemContent>
                    <ItemDescription className="line-clamp-none">
                      Current starter selection passes catalog policy checks.
                    </ItemDescription>
                  </ItemContent>
                </Item>
              )}
            </ItemGroup>
          </CardContent>
        </Card>
        <VerificationSteps
          title="Policy checks"
          steps={[
            {
              title: "Token review",
              description:
                "Semantic token changes require approval before becoming defaults.",
              status: "done",
            },
            {
              title: "Export review",
              description:
                "Existing-project patch installs stay reviewable and reversible.",
              status: "current",
            },
            {
              title: "Audit retention",
              description:
                "Persistence rules will harden further when deeper storage lands.",
              status: "pending",
            },
          ]}
        />
      </Stack>
    );
  }

  if (section === "audit") {
    return (
      <Stack gap={24}>
        <Card>
          <CardHeader>
            <CardTitle>Audit summary</CardTitle>
            <CardDescription>
              {auditSummary.total} events across {auditSummary.actors.length}{" "}
              actors and {auditSummary.scopes.length} scopes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup className="gap-3">
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemDescription className="line-clamp-none">
                    Actors: {auditSummary.actors.join(", ")}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemDescription className="line-clamp-none">
                    Scopes: {auditSummary.scopes.join(", ")}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audit trail</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              title="audit-log.md"
              language="md"
              code={exportAuditTrailMarkdown(auditEntries)}
              maxHeightClassName="max-h-96"
            />
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap={24}>
      <GridPreset preset="dashboard">
        <div className="lg:col-span-8">
          <ChartSurfaceCard
            title="Workspace adoption"
            description={`${workspaceName} is using the adopted baseline across themes, templates, and exports.`}
            data={[...usageTrend]}
            valueKey="exports"
            secondaryKey="checks"
          />
        </div>
        <div className="lg:col-span-4">
          <ThemePackCard packId="glass" />
        </div>
      </GridPreset>
      <GridPreset preset="dashboard">
        <div className="lg:col-span-6">
          <TemplateCard template={featuredTemplate} />
        </div>
        <div className="lg:col-span-6">
          <PackLimitsSummary />
        </div>
      </GridPreset>
    </Stack>
  );
}

export function renderPublicPage(kind: "sign-in" | "sign-up") {
  return renderAuthForm(kind);
}

export function renderWizardPage(stepId: string) {
  return (
    <AdminShell
      appName="Shandapha Studio"
      workspaceLabel="Wizard"
      navGroups={studioNavGroups("wizard")}
      title="Wizard"
      eyebrow="Studio"
      summary="Guide users through packs, templates, feature bundles, and export choices using the newly adopted shared system."
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/workspaces">View workspaces</Link>
        </Button>
      }
      utility={<Badge variant="outline">shared baseline</Badge>}
    >
      {renderWizardBody(stepId)}
    </AdminShell>
  );
}

export function renderWorkspaceLandingPage() {
  return (
    <AdminShell
      appName="Shandapha Studio"
      workspaceLabel="All workspaces"
      navGroups={studioNavGroups("workspaces")}
      title="Workspaces"
      eyebrow="Studio"
      summary="Open the same adopted system from a workspace point of view: packs, templates, exports, billing, and audit-backed workspace state."
      actions={
        <Button asChild type="button">
          <Link href="/wizard">Open wizard</Link>
        </Button>
      }
      utility={<Badge variant="outline">registry-aware</Badge>}
    >
      <Section title="Workspace list">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-4">
            <WorkspaceLaunchCard
              title="Atlas Health"
              description="Dashboard-heavy workspace using Glass for operator surfaces."
              href="/workspaces/atlas-health/overview"
            />
          </div>
          <div className="lg:col-span-4">
            <WorkspaceLaunchCard
              title="Operator Cloud"
              description="Usage, billing, and team admin flows on the premium baseline."
              href="/workspaces/operator-cloud/overview"
            />
          </div>
          <div className="lg:col-span-4">
            <WorkspaceLaunchCard
              title="Docs Hub"
              description="Docs and trust-heavy workspace that still shares the same owned runtime."
              href="/workspaces/docs-hub/overview"
            />
          </div>
        </GridPreset>
      </Section>

      <Section title="Studio overview">
        <GridPreset preset="dashboard">
          <div className="lg:col-span-8">
            <ChartSurfaceCard
              title="Workspace activity"
              description="Studio surfaces now use the same card rhythm and registry-aware baseline as the public catalog."
              data={[...usageTrend]}
              valueKey="exports"
              secondaryKey="checks"
            />
          </div>
          <div className="lg:col-span-4">
            <RegistryMindsetCard />
          </div>
        </GridPreset>
      </Section>
    </AdminShell>
  );
}

export function renderWorkspacePage(section: string, workspaceId: string) {
  return (
    <AdminShell
      appName="Shandapha Studio"
      workspaceLabel={titleCase(workspaceId)}
      navGroups={workspaceNavGroups(workspaceId, section)}
      title={`${titleCase(workspaceId)} ${titleCase(section)}`}
      eyebrow="Workspace"
      summary="All workspace sections now inherit the same adopted component, shell, and registry-aware baseline."
      actions={
        <Button asChild type="button" variant="outline">
          <Link href="/wizard">Open wizard</Link>
        </Button>
      }
      utility={<EntitlementBadge planId="premium" />}
    >
      {renderWorkspaceSection(section, workspaceId)}
    </AdminShell>
  );
}

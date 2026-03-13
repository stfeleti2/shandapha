import {
  createAuditEntry,
  exportAuditTrailMarkdown,
  summarizeAuditTrail,
} from "@shandapha/business";
import { Badge, Button, StatePanel, TableBasic } from "@shandapha/core";
import { plans } from "@shandapha/entitlements";
import { createGenerationPlan } from "@shandapha/generator";
import {
  GridPreset,
  Inline,
  Section,
  Stack,
  Surface,
} from "@shandapha/layouts";
import { buildRegistry } from "@shandapha/registry";
import Link from "next/link";
import { BillingSummary } from "@/components/billing/billing-summary";
import { PolicyPanel } from "@/components/governance/policy-panel";
import { ProductShell } from "@/components/shell/product-shell";
import { UsageSummary } from "@/components/usage/usage-summary";
import { StepCard } from "@/components/wizard/step-card";

const registry = buildRegistry();
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
] as const;

function workspaceNavigation(workspaceId: string) {
  return [
    { href: `/workspaces/${workspaceId}/overview`, label: "Overview" },
    { href: `/workspaces/${workspaceId}/themes`, label: "Themes" },
    { href: `/workspaces/${workspaceId}/templates`, label: "Templates" },
    { href: `/workspaces/${workspaceId}/exports`, label: "Exports" },
    { href: `/workspaces/${workspaceId}/billing`, label: "Billing" },
    { href: `/workspaces/${workspaceId}/usage`, label: "Usage" },
    { href: `/workspaces/${workspaceId}/members`, label: "Members" },
    { href: `/workspaces/${workspaceId}/api-keys`, label: "API keys" },
    { href: `/workspaces/${workspaceId}/policies`, label: "Policies" },
    { href: `/workspaces/${workspaceId}/audit`, label: "Audit" },
  ];
}

function renderWorkspaceInsight(section: string, workspaceId: string) {
  if (section === "billing") {
    return (
      <BillingSummary
        currentPlanId="premium"
        nextInvoiceLabel="April 1, 2026"
        usageHeadline="Premium gives this workspace packs, advanced templates, and patch-install flows without forcing a governance upgrade early."
        plans={plans}
      />
    );
  }

  if (section === "usage") {
    return (
      <UsageSummary
        title="Usage footprint"
        metrics={[
          {
            label: "Starter exports",
            used: 9,
            limit: 25,
            detail:
              "Healthy runway for this month with room for launches and onboarding flows.",
          },
          {
            label: "Theme revisions",
            used: 14,
            limit: 20,
            detail:
              "Brand iteration is high but still inside the comfort band.",
          },
          {
            label: "Patch installs",
            used: 3,
            limit: 10,
            detail:
              "Existing-project adoption is active without creating drift risk.",
          },
        ]}
      />
    );
  }

  if (section === "policies") {
    return (
      <PolicyPanel
        title="Governance posture"
        rules={[
          {
            id: "tokens",
            title: "Token approvals",
            owner: "Design systems",
            status: "healthy",
            detail:
              "Semantic token changes require review before they can become pack defaults.",
          },
          {
            id: "exports",
            title: "Export review",
            owner: "Platform engineering",
            status: "healthy",
            detail:
              "Patch installs stay reversible and require checklist confirmation.",
          },
          {
            id: "retention",
            title: "Audit retention",
            owner: "Ops",
            status: "attention",
            detail:
              "Retention is documented but still needs hard DB enforcement once persistence lands.",
          },
        ]}
      />
    );
  }

  if (section === "audit") {
    const entries = [
      createAuditEntry({
        actor: "promise.feliti",
        action: "export.created",
        scope: workspaceId,
        detail: "Created a patch-install plan for the dashboard starter.",
      }),
      createAuditEntry({
        actor: "studio-bot",
        action: "theme.saved",
        scope: workspaceId,
        detail: "Saved a Glass pack variant with compact density.",
      }),
      createAuditEntry({
        actor: "ops-review",
        action: "policy.reviewed",
        scope: workspaceId,
        detail: "Validated export review and token approval defaults.",
      }),
    ];
    const summary = summarizeAuditTrail(entries);

    return (
      <Surface title="Audit timeline">
        <Stack gap={12}>
          <Badge>{summary.total} events tracked</Badge>
          <span>Actors: {summary.actors.join(", ")}</span>
          <span>Scopes: {summary.scopes.join(", ")}</span>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {exportAuditTrailMarkdown(entries)}
          </pre>
        </Stack>
      </Surface>
    );
  }

  return (
    <Surface title="Section summary">
      <Stack gap={12}>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          This workspace section already lives inside the same product shell as
          the wizard, usage, billing, and exports so the upgrade journey stays
          coherent.
        </p>
        <Badge>{section}</Badge>
        <p style={{ margin: 0, color: "rgba(226, 232, 240, 0.82)" }}>
          Registry modules available:{" "}
          {registry.modules.map((module) => module.name).join(", ")}
        </p>
      </Stack>
    </Surface>
  );
}

export function renderPublicPage(kind: "sign-in" | "sign-up") {
  return (
    <ProductShell
      title={
        kind === "sign-in" ? "Welcome back" : "Create your Studio workspace"
      }
      eyebrow="Access"
      subtitle={
        kind === "sign-in"
          ? "Resume the wizard, export plans, billing, and workspace governance from one product shell."
          : "Start with a premium-feeling default now, and grow into governance boundaries without paying for extra apps."
      }
      actions={
        <Button type="button">
          {kind === "sign-in" ? "Continue" : "Create workspace"}
        </Button>
      }
    >
      <Section title="Access">
        <GridPreset preset="form">
          <Surface title={kind === "sign-in" ? "Sign in" : "Create account"}>
            <Stack gap={16}>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                {kind === "sign-in"
                  ? "Jump back into a shared generator workflow that keeps wizard, CLI, and exports aligned."
                  : "Create a workspace that keeps saved themes, templates, usage, and billing boundaries together from the first ship."}
              </p>
              <Inline gap={10}>
                <Badge>Wizard first</Badge>
                <Badge>Patch installs</Badge>
                <Badge>Registry-backed</Badge>
              </Inline>
            </Stack>
          </Surface>
        </GridPreset>
      </Section>
    </ProductShell>
  );
}

export function renderWizardPage(stepId: string) {
  const step =
    wizardSteps.find((entry) => entry.id === stepId) ?? wizardSteps[0];
  const plan = createGenerationPlan({
    framework: stepId === "framework" ? "react-vite" : "next-app-router",
    intent: stepId === "intent" ? "preview-only" : "existing-project",
    packId: stepId === "style-pack" ? "glass" : "normal",
    planId: stepId === "features" || stepId === "export" ? "premium" : "free",
    templates: ["dashboard-home", "pricing-basic", "docs-home"],
    modules: stepId === "features" ? ["datatable"] : [],
  });

  return (
    <ProductShell
      title={step.title}
      eyebrow="Primary product surface"
      subtitle={step.description}
      actions={<Button type="button">Save step</Button>}
      utility={<Badge>{plan.selectedPack.name}</Badge>}
    >
      <Section title="Wizard">
        <Stack gap={24}>
          <GridPreset preset="detail">
            <Stack gap={12}>
              {wizardSteps.map((entry, index) => (
                <StepCard
                  key={entry.id}
                  title={entry.title}
                  description={entry.description}
                  route={entry.route}
                  status={
                    entry.id === step.id
                      ? "current"
                      : index <
                          wizardSteps.findIndex(
                            (wizardStep) => wizardStep.id === step.id,
                          )
                        ? "complete"
                        : "up-next"
                  }
                />
              ))}
            </Stack>
            <Surface title="Shared generator preview">
              <Stack gap={12}>
                <StatePanel
                  title="Selected pack"
                  body={plan.selectedPack.name}
                />
                <StatePanel
                  title="Templates"
                  body={plan.selectedTemplates
                    .map((template) => template.name)
                    .join(", ")}
                />
                <StatePanel
                  title="Doctor"
                  body={plan.doctorChecks
                    .map((check) => `${check.label}: ${check.status}`)
                    .join(" | ")}
                />
                <StatePanel
                  title="Diff report"
                  body={plan.diffReport.join(" | ")}
                />
              </Stack>
            </Surface>
          </GridPreset>
        </Stack>
      </Section>
    </ProductShell>
  );
}

export function renderWorkspaceLandingPage() {
  return (
    <ProductShell
      title="Workspaces"
      eyebrow="Control plane"
      subtitle="Saved themes, export history, usage, members, API keys, policies, and audit surfaces all stay in one app instead of being split into an ops product."
    >
      <Section title="Workspaces">
        <GridPreset preset="dashboard">
          {["Acme", "Nova", "Helio"].map((workspace) => (
            <Surface key={workspace} title={workspace}>
              <Stack gap={8}>
                <p>
                  Saved themes, export history, usage, members, API keys, and
                  policy surfaces all stay local to one workspace.
                </p>
                <Link href={`/workspaces/${workspace.toLowerCase()}/overview`}>
                  Open workspace
                </Link>
              </Stack>
            </Surface>
          ))}
        </GridPreset>
      </Section>
    </ProductShell>
  );
}

export function renderWorkspacePage(section: string, workspaceId: string) {
  const planRows = plans.map((plan) => ({
    plan: plan.name,
    price: plan.price,
    focus: plan.summary,
  }));
  return (
    <ProductShell
      title={`${workspaceId} / ${section}`}
      eyebrow="Workspace surface"
      subtitle="This is the same product shell that owns wizard progress, saved themes, exports, billing, usage, and governance boundaries."
      utility={<Badge>{workspaceId}</Badge>}
      navItems={workspaceNavigation(workspaceId)}
    >
      <Section title="Workspace">
        <Stack gap={24}>
          <GridPreset preset="detail">
            <Surface title="Navigation">
              <Stack gap={10}>
                {workspaceNavigation(workspaceId).map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Surface>
            <Stack gap={16}>
              {renderWorkspaceInsight(section, workspaceId)}
              <Surface title="Plan comparison snapshot">
                <TableBasic rows={planRows} />
              </Surface>
            </Stack>
            <Surface title="Registry and adoption notes">
              <Stack gap={12}>
                <Badge>{section}</Badge>
                <p>
                  Registry packages available:{" "}
                  {registry.modules.map((module) => module.name).join(", ")}
                </p>
                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  Existing-project patch installs stay minimal and reversible,
                  so this workspace can adopt templates and packs without
                  restructuring its app.
                </p>
              </Stack>
            </Surface>
          </GridPreset>
        </Stack>
      </Section>
    </ProductShell>
  );
}

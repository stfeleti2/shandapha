import { Badge, Button, StatePanel, TableBasic } from "@shandapha/core";
import { plans } from "@shandapha/entitlements";
import { createGenerationPlan } from "@shandapha/generator";
import {
  Container,
  GridPreset,
  Inline,
  PageHeader,
  Section,
  Stack,
  Surface,
} from "@shandapha/layouts";
import { buildRegistry } from "@shandapha/registry";
import Link from "next/link";
import type { ReactNode } from "react";

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

function StudioShell({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1524 0%, #102542 100%)",
        color: "#f8fafc",
      }}
    >
      <Container>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 0 0.75rem",
          }}
        >
          <Link
            href="/wizard"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Studio
          </Link>
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
              <p>
                {kind === "sign-in"
                  ? "Resume the wizard, exports, and workspace control plane."
                  : "Start with a premium-feeling default and grow into governance later."}
              </p>
              <Button type="button">
                {kind === "sign-in" ? "Continue" : "Create workspace"}
              </Button>
            </Stack>
          </Surface>
        </GridPreset>
      </Section>
    </StudioShell>
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
    <StudioShell>
      <Section title="Wizard">
        <Stack gap={24}>
          <PageHeader
            title={step.title}
            eyebrow="Primary product surface"
            actions={<Button type="button">Save step</Button>}
          />
          <GridPreset preset="detail">
            <Surface title="Step detail">
              <Stack gap={12}>
                <p>{step.description}</p>
                <Badge>{step.route}</Badge>
                <Inline gap={8}>
                  {wizardSteps.map((entry) => (
                    <Link
                      key={entry.id}
                      href={entry.route}
                      style={{
                        color: entry.id === step.id ? "#fdba74" : "inherit",
                      }}
                    >
                      {entry.title}
                    </Link>
                  ))}
                </Inline>
              </Stack>
            </Surface>
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
        <PageHeader
          title="Workspaces keep the wizard, exports, billing, and governance in one product app."
          eyebrow="Control plane"
        />
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
    </StudioShell>
  );
}

export function renderWorkspacePage(section: string, workspaceId: string) {
  const planRows = plans.map((plan) => ({
    plan: plan.name,
    price: plan.price,
    focus: plan.summary,
  }));
  return (
    <StudioShell>
      <Section title="Workspace">
        <Stack gap={24}>
          <PageHeader
            title={`${workspaceId} / ${section}`}
            eyebrow="Workspace surface"
          />
          <GridPreset preset="detail">
            <Surface title="Navigation">
              <Stack gap={10}>
                <Link href={`/workspaces/${workspaceId}/overview`}>
                  overview
                </Link>
                <Link href={`/workspaces/${workspaceId}/themes`}>themes</Link>
                <Link href={`/workspaces/${workspaceId}/templates`}>
                  templates
                </Link>
                <Link href={`/workspaces/${workspaceId}/exports`}>exports</Link>
                <Link href={`/workspaces/${workspaceId}/billing`}>billing</Link>
                <Link href={`/workspaces/${workspaceId}/usage`}>usage</Link>
                <Link href={`/workspaces/${workspaceId}/members`}>members</Link>
                <Link href={`/workspaces/${workspaceId}/api-keys`}>
                  api-keys
                </Link>
                <Link href={`/workspaces/${workspaceId}/policies`}>
                  policies
                </Link>
                <Link href={`/workspaces/${workspaceId}/audit`}>audit</Link>
              </Stack>
            </Surface>
            <Surface title="Section summary">
              <Stack gap={12}>
                <p>
                  This section is scaffolded inside the Studio app instead of
                  being split into a separate ops product.
                </p>
                <Badge>{section}</Badge>
                <TableBasic rows={planRows} />
                <p>
                  Registry packages available:{" "}
                  {registry.modules.map((module) => module.name).join(", ")}
                </p>
              </Stack>
            </Surface>
          </GridPreset>
        </Stack>
      </Section>
    </StudioShell>
  );
}

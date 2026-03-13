import { Badge, Button, StatePanel } from "@shandapha/core";
import { plans } from "@shandapha/entitlements";
import {
  Container,
  GridPreset,
  Inline,
  PageHeader,
  Section,
  Stack,
  Surface,
} from "@shandapha/layouts";
import { getPackBySlug, packs } from "@shandapha/packs";
import { buildRegistry, getTemplateBySlug } from "@shandapha/registry";
import Link from "next/link";
import type { ReactNode } from "react";

const registry = buildRegistry();
const docsContent = {
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
} as const;

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const marketingPages = {
  home: {
    eyebrow: "UI platform",
    title: "Two apps. One modular API. Moat in packages.",
    summary:
      "Shandapha keeps the expensive complexity centralized while the token contract, runtime, templates, packs, registry, and generator stay reusable across every surface.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Free stays shippable. Paid speeds teams up without fake blockers.",
    summary:
      "Premium monetizes polish and convenience. Business monetizes governance and confidence.",
  },
  enterprise: {
    eyebrow: "Enterprise boundaries",
    title:
      "Clear seams now, expensive splits only when traffic justifies them.",
    summary:
      "Governance, audit, and policy reporting live inside the same API until real heat demands isolation.",
  },
  changelog: {
    eyebrow: "Changelog",
    title:
      "Registry-first releases across packs, templates, and generator recipes.",
    summary:
      "The website, Studio, and CLI all read the same source-of-truth manifests.",
  },
} as const;

function Shell({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        background:
          "radial-gradient(circle at top, rgba(15,118,110,0.12), transparent 40%), linear-gradient(180deg, #f6f1e8 0%, #fcfbf8 100%)",
        color: "#0f172a",
        minHeight: "100vh",
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
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Shandapha
          </Link>
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
          <p
            style={{
              maxWidth: 720,
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "var(--sh-color-text-muted, #475569)",
            }}
          >
            {page.summary}
          </p>
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
                <span>
                  Studio wizard, exports, workspaces, billing, and usage.
                </span>
                <span>One modular API with room to split later.</span>
              </Stack>
            </Surface>
          </GridPreset>
        </Stack>
      </Section>

      <Section title="How it works">
        <GridPreset preset="dashboard">
          <Surface title="1. Preview">
            <p>
              Pick a pack, tune the brand kit, and inspect templates before
              spending engineering time.
            </p>
          </Surface>
          <Surface title="2. Brand">
            <p>
              Semantic tokens stay portable and user-owned across light/dark,
              density, and motion modes.
            </p>
          </Surface>
          <Surface title="3. Template">
            <p>
              Templates drive serious productivity: shells, blocks, auth,
              billing, docs, and list/detail flows.
            </p>
          </Surface>
          <Surface title="4. Export or patch">
            <p>
              New starter or reversible existing-project patch install, powered
              by the same generator core.
            </p>
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
                <Link href={`/packs/${pack.slug}`}>Open pack</Link>
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
                <Link href={`/templates/${template.slug}`}>Open template</Link>
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
        <PageHeader
          title="Templates are first-class, not decoration."
          eyebrow="Catalog"
        />
        <GridPreset preset="dashboard">
          {registry.templates.map((template) => (
            <Surface key={template.slug} title={template.name}>
              <Stack gap={12}>
                <span>{template.summary}</span>
                <Badge>{template.group}</Badge>
                <Link href={`/templates/${template.slug}`}>View template</Link>
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
              <StatePanel
                title="Variants"
                body={template.variants.join(", ")}
              />
            </Stack>
          </Surface>
          <Surface title="Manifest">
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(template, null, 2)}
            </pre>
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
        <PageHeader
          title="Packs transform the UI without forking components."
          eyebrow="Catalog"
        />
        <GridPreset preset="dashboard">
          {packs.map((pack) => (
            <Surface key={pack.id} title={pack.name}>
              <Stack gap={8}>
                <p>{pack.description}</p>
                <Badge>{pack.tier}</Badge>
                <Link href={`/packs/${pack.slug}`}>View pack</Link>
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
      <Section title={titleCase(kind)}>
        <PageHeader title={titleCase(kind)} eyebrow="Trust" />
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
  const doc = docsContent[key as keyof typeof docsContent] ?? docsContent.index;

  return (
    <Shell>
      <Section title={doc.category}>
        <PageHeader title={doc.title} eyebrow="Docs" />
        <Surface title="Article">
          <Stack gap={12}>
            <p>{doc.body}</p>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(doc, null, 2)}
            </pre>
          </Stack>
        </Surface>
      </Section>
    </Shell>
  );
}

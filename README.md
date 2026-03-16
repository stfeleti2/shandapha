# Shandapha

Shandapha is a UI modernization and continuity platform.

It helps teams upgrade real existing apps into premium product surfaces without rewriting the stack. The trust layer is deterministic: contracts, semantic tokens, manifests, merge-safe patches, validators, and Doctor verification stay authoritative. AI can assist, but it does not replace the trust model.

## Core Wedge

- Patch, don’t rebuild.
- Import or infer a brand system.
- Map tokens into semantic contracts.
- Install premium shells, templates, and states.
- Generate merge-safe patches and diff reports.
- Verify with Doctor.
- Scale continuity across teams and products.

## Workspace Shape

### Apps

- `apps/website`: Astro marketing site for the modernization story.
- `apps/docs`: Astro + Starlight docs.
- `apps/wizard`: Next App Router guided installer.
- `apps/control-plane`: Next App Router governance, billing, usage, and workspaces foundation.
- `apps/sandbox`: interactive preview surface for packs, templates, and states.
- `apps/demo-react`
- `apps/demo-next`
- `apps/demo-wc`
- `apps/demo-blazor`

### Packages

- `packages/contracts/*`: versioned schemas, manifests, and validators.
- `packages/tokens/*`: quick-brand, import-brand, pack overlays, CSS and JSON emitters, validation.
- `packages/runtime/*`: theme, motion, focus, layout, interaction, telemetry, performance.
- `packages/react/*` and `packages/wc/*`: first-class React DX with Web Components portability baseline.
- `packages/templates/*`: shells, blocks, pages, states, and sample data.
- `packages/modernization/*`: inspect, map, patch, doctor, diff report, codemods, uninstall.
- `packages/generator/*`: deterministic output, recipes, file ops, manifests.
- `packages/registry/*`: browser-safe client, server manifest loading, search, integrity.
- `packages/business/*`, `packages/governance/*`, `packages/content/*`, `packages/tooling/*`, `packages/ai/*`: supporting layers around the modernization loop.

### Services

- `services/platform-api`: current backend foundation for registry, workspaces, billing, exports, entitlements, audit, and telemetry. It remains the implementation seam for the future registry/control-plane API surface.

## Product Principles

- Contract-first architecture.
- Token-first theming with CSS variables as runtime truth.
- Web Components portability baseline.
- Pages and patterns as first-class value.
- Merge-safe modernization over rewrite pressure.
- Free path remains genuinely shippable.
- Governance scales after adoption, not before it.

## Getting Started

1. `cp .env.example .env`
2. `pnpm install`
3. `pnpm dev`
4. Open the surfaces you need:
   - `http://localhost:4321` for the website
   - `http://localhost:4322` for docs
   - `http://localhost:3002` for the wizard
   - `http://localhost:4000/health` for the current API

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

See [ARCHITECTURE.md](/Users/promise.feliti/cofa-tools/shandapha/ARCHITECTURE.md), [ROADMAP.md](/Users/promise.feliti/cofa-tools/shandapha/ROADMAP.md), [STATUS.md](/Users/promise.feliti/cofa-tools/shandapha/STATUS.md), and [MIGRATION_NOTES.md](/Users/promise.feliti/cofa-tools/shandapha/MIGRATION_NOTES.md) for the migration details.

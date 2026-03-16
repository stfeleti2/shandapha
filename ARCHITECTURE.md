# Architecture

## Decision

Shandapha is built as a UI modernization and continuity platform.

The system is organized around the flow:

`inspect -> map -> patch -> verify -> govern`

This repo is intentionally not positioned as a generic component library, a Tailwind-only toolkit, or an AI-only builder.

## Layer Model

1. `packages/contracts/*`
   The deterministic truth: schemas, manifests, compatibility notes, validators, and version fields.
2. `packages/tokens/*`
   Quick Brand, Import Brand, semantic mapping, Normal/Glass/Neon packs, CSS and JSON export, safety validation.
3. `packages/runtime/*`
   Theme application, reduced motion, focus visibility, layout primitives, interaction patterns, telemetry, performance.
4. `packages/wc/*` and `packages/react/*`
   Web Components portability baseline with first-class React wrappers.
5. `packages/templates/*`
   Real shells, blocks, pages, states, and typed sample data.
6. `packages/modernization/*`
   Project inspection, brand mapping, patch planning, diff report generation, Doctor verification, uninstall guidance.
7. `packages/generator/*`
   Deterministic starter and patch generation across shared recipes.
8. Product surfaces
   `apps/website`, `apps/docs`, `apps/wizard`, `apps/control-plane`, `apps/sandbox`, CLI, and demos.
9. Scale and governance
   `packages/registry/*`, `packages/business/*`, `packages/governance/*`, `services/platform-api`.

## Framework Split

- Astro for `apps/website`
- Astro + Starlight for `apps/docs`
- Next.js App Router for `apps/wizard`, `apps/control-plane`, and `apps/sandbox`
- React + TypeScript for first-class DX
- Web Components + CSS variables as the cross-stack baseline
- pnpm + Turbo for workspace orchestration

## Current Migration Shape

- Transitional packages still exist at the old top level for compatibility.
- Critical boundary work is already live:
  - `packages/registry/client` is browser-safe.
  - `packages/registry/server` owns file-backed manifest resolution.
  - `packages/generator/core` is the server-side generation core.
  - `packages/generator/manifests` is the browser-safe generation preview seam.
- Transitional apps still exist:
  - `apps/web`
  - `apps/studio`
- New end-state surfaces are now present:
  - `apps/website`
  - `apps/docs`
  - `apps/wizard`
  - `apps/control-plane`
  - `apps/sandbox`
  - demo apps

## Protected Boundaries

- Browser-facing code must not import server-only registry or generator code.
- CSS variables are runtime truth; token JSON is tooling truth.
- Templates use named layout primitives and presets rather than arbitrary grid drift.
- AI assist packages stay advisory. Contracts, validators, manifests, the patcher, and Doctor remain deterministic.

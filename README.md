# Shandapha

Shandapha is a UI platform built around enterprise boundaries and founder economics:
two apps, one modular API, and moat-heavy shared packages.

## Workspace shape

- `apps/web`: marketing site, docs, catalog, playground, changelog
- `apps/studio`: wizard, exports, workspaces, billing, usage, members
- `services/platform-api`: modular monolith backend
- `packages/*`: tokens, runtime, layouts, core, packs, templates, registry, generator, CLI, entitlements, business, SDK

## Quick start

1. `pnpm install`
2. `pnpm dev`
3. Open `http://localhost:3000`, `http://localhost:3001`, and `http://localhost:4000/health`

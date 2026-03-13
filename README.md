# Shandapha

Shandapha is a UI platform built around enterprise boundaries and founder economics:
two apps, one modular API, and moat-heavy shared packages.

## Workspace shape

- `apps/web`: marketing site, docs, catalog, playground, changelog
- `apps/studio`: wizard, exports, workspaces, billing, usage, members
- `services/platform-api`: modular monolith backend
- `packages/*`: tokens, runtime, layouts, core, packs, templates, registry, generator, CLI, entitlements, business, SDK

## Quick start

1. `cp .env.example .env`
2. `pnpm install`
3. `pnpm dev`
4. Open `http://localhost:3000`, `http://localhost:3001`, and `http://localhost:4000/health`

For visual review, run `pnpm --filter @shandapha/storybook dev` and open
`http://localhost:6006`.

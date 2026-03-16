# Launch

Shandapha launches with a simple architecture on purpose: two apps, one modular
API, and the real moat in packages. That keeps operating cost low while the
things users actually value keep compounding.

## Why this shape

The platform promise depends on shared assets:

- semantic tokens that stay portable
- packs that transform polish without forking components
- templates that speed up real product work
- one generator core shared by Studio and CLI
- registry data that powers the website, docs, Studio, and future marketplace

## What ships first

Version one optimizes for founder economics:

- `apps/web` for marketing, docs, packs, templates, and playground
- `apps/studio` for wizard, exports, workspaces, billing, and usage
- `services/platform-api` as one modular monolith
- packages for contracts, tokens, runtime, layouts, core, packs, templates,
  registry, generator, CLI, and entitlements

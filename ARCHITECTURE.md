# Architecture

## Decision

Shandapha uses a modular monolith with two product-facing apps and one backend service.
The moat stays in packages so the web site, studio, CLI, and future registry surfaces all share the same contracts.

## Why this shape

- Founder economics: one API deploy, one auth model, one billing surface
- Enterprise boundaries: internal domains stay isolated by module and package exports
- Performance: tree-shakeable packages, lean runtime, heavy modules kept opt-in
- Scale later: each backend domain can split only when heat justifies the operational cost

## Protected performance seams

- Semantic tokens and CSS variables remain the runtime source of truth
- Generator logic is centralized in `packages/generator`
- The registry is data-first so website, studio, CLI, and docs stay in sync
- Heavy capabilities live under `packages/modules/*` and are never forced into core

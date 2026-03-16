# AGENTS

## Repo Rules

- Treat Shandapha as a UI modernization and continuity platform.
- Optimize for `inspect -> map -> patch -> verify -> govern`.
- Do not reframe the repo as a generic component library.
- Keep browser-safe code out of server-only registry and generator packages.
- Keep CSS variables as runtime truth and token JSON as tooling truth.
- Prefer rehoming existing implementation into final package boundaries over rewriting from scratch.

## Migration Guidance

- `apps/web` and `apps/studio` are transitional surfaces during migration.
- The intended public surfaces are `apps/website`, `apps/docs`, `apps/wizard`, `apps/control-plane`, and `apps/sandbox`.
- The intended server-safe packages are `packages/registry/server` and `packages/generator/core`.
- The intended browser-safe packages are `packages/registry/client` and `packages/generator/manifests`.

## Quality Bar

- Keep patches deterministic and reversible.
- Favor page-and-system value over component breadth.
- Add or update migration notes when moving boundaries.

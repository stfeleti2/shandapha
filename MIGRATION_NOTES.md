# Migration Notes

## 2026-03-16

- Reframed the repo around the modernization and continuity wedge in root docs.
- Added the new app surface directories:
  - `apps/website`
  - `apps/docs`
  - `apps/wizard`
  - `apps/control-plane`
  - `apps/sandbox`
  - demo apps under `apps/demo-*`
- Added nested workspace support in `pnpm-workspace.yaml`.
- Split registry into:
  - browser-safe client package at `packages/registry/client`
  - server-side manifest loader at `packages/registry/server`
  - top-level `@shandapha/registry` compatibility wrapper
- Split generator seams into:
  - server-side generation core at `packages/generator/core`
  - browser-safe preview manifests at `packages/generator/manifests`
- Repointed Studio to browser-safe generation previews to remove Node-only imports from Next app builds.
- Repointed CLI and platform API to the new server-side registry and generator packages.
- Copied Storybook into `packages/tooling/storybook` as the new tooling home while keeping the existing app transitional during migration.
- Created the final architecture directory scaffolds for contracts, tokens, runtime, adapters, modernization, governance, content, tooling, AI, and tests.

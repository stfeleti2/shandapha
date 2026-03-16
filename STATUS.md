# Status

## Completed

- Root messaging now describes Shandapha as a UI modernization and continuity platform.
- New workspace globs support nested packages and the root `tests/*` tree.
- Registry client/server split exists and unblocks browser-safe app builds.
- Generator core/manifests split exists and unblocks browser-safe generation previews.
- `apps/web` and `apps/studio` build again after the boundary split.
- New app targets now exist for website, docs, wizard, control-plane, sandbox, and demos.
- Storybook has a new tooling home scaffold at `packages/tooling/storybook`.

## Partial

- Transitional packages still exist at the top level as compatibility layers.
- `apps/web` and `apps/studio` are still present while traffic and implementation continue moving to the new surfaces.
- The final nested package graph is scaffolded, but not every directory is yet a full standalone workspace package.
- The website and docs are live as new Astro surfaces, but content migration from the old web app is only partially complete.

## Remaining Gaps

- Finish rehoming contracts, tokens, runtime, primitives, templates, and tooling into their final nested packages.
- Finish real feature extraction from `site-content.tsx`, `site-baseline.tsx`, and `studio-content.tsx`.
- Move remaining CLI, test, and package references away from legacy compatibility packages.
- Add complete migration, integration, visual, accessibility, and performance test coverage under `tests/*`.
- Replace the transitional `apps/web` and `apps/studio` surfaces once parity is good enough.
- Harden lint and package-boundary rules around the new package graph.

## Recommended Next Steps

1. Promote the new Astro and Next app surfaces into the main dev and release flow.
2. Rehome token, runtime, and primitive implementation into the new nested packages.
3. Move template and modernization code out of the remaining giant render/helper files.
4. Expand test coverage in `tests/contract`, `tests/unit`, `tests/integration`, and `tests/migration`.
5. Remove transitional compatibility shims only after the new packages own their full public APIs.

# Contributing

## Workflow

- Use pnpm workspaces
- Keep new logic inside the relevant package before reaching for app-local duplication
- Add a changeset for user-facing package changes
- Prefer template and generator updates over one-off app behavior

## Quality gates

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

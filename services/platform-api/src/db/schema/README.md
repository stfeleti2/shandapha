# Database schema

Add table definitions here once persistence moves past in-memory scaffolding.
Keep the schema aligned to the modular monolith boundaries:

- `auth`
- `workspaces`
- `billing`
- `entitlements`
- `registry`
- `exports`
- `audit`
- `telemetry`
- `notifications`

Prefer one schema surface with module-owned tables over cross-service
fragmentation. Shared identifiers should be explicit and typed in
`@shandapha/contracts`.

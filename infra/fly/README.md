# Fly deployment notes

Use Fly when you want small-footprint regional deployments with simple process
definitions. A sensible founder setup is one app per deployable surface:

- `@shandapha/web`
- `@shandapha/studio`
- `@shandapha/platform-api`

Keep secrets in Fly-managed environment variables and pin health checks to the
real app routes rather than placeholder endpoints.

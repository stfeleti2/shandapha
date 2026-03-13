# Export build jobs

This job queue is for asynchronous export work such as starter bundle assembly,
patch diff packaging, and uninstall manifest generation. Jobs should remain
idempotent so retries do not produce duplicate outputs or drift.

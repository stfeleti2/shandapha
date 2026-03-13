# Registry sync jobs

Registry sync jobs keep the website, Studio, docs, and CLI aligned on the same
pack, template, and module metadata. Prefer snapshot generation and checksum
comparison over ad hoc mutation so downstream surfaces stay deterministic.

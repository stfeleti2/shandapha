# Migrations

Store ordered, replayable migrations in this directory once the database layer
is introduced. Each migration should be reversible where practical and scoped
to one domain concern instead of mixing billing, workspace, and audit changes
in a single file.

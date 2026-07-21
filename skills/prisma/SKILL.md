# Prisma ORM Documentation Skill

> **Prisma changes frequently — verify against the changelog and current docs before implementing.**
> Do not rely on training data for Prisma features. APIs, configuration, and conventions can change between versions.

## Metadata

- **Official Docs**: https://www.prisma.io/docs
- **LLMs Index**: https://www.prisma.io/docs/llms.txt
- **Changelog**: https://www.prisma.io/changelog.md
- **Version**: 7.x (current), 6.x (legacy)
- **Runtime**: Node.js, Bun, Deno
- **Supported Databases**: PostgreSQL, MySQL, SQLite, MongoDB, SQL Server, CockroachDB, PlanetScale, Turso (libSQL), Cloudflare D1
- **GitHub**: https://github.com/prisma/prisma

## Quick Reference

| File | Topics |
|------|--------|
| [getting-started.md](getting-started.md) | Prisma ORM overview, installation, quickstart (PostgreSQL, MySQL, SQLite, MongoDB, SQL Server, CockroachDB, PlanetScale, Prisma Postgres), prisma.config.ts, Prisma schema overview, data sources, generators, models, fields, attributes, enums, relations (1-1, 1-n, m-n, self), referential actions, indexes, views, composite types, introspection, multi-schema, environment variables, editor setup, supported databases, connection URLs, connection management, connection pooling, PgBouncer, driver adapters |
| [api.md](api.md) | Prisma Client CRUD (create, createMany, createManyAndReturn, findUnique, findFirst, findMany, update, updateMany, updateManyAndReturn, upsert, delete, deleteMany), filtering (where, OR, AND, NOT, relation filters), sorting (orderBy, case-insensitive, sort by relation, null ordering), pagination (offset, cursor), select/include, relation queries (nested reads, nested writes, fluent API, connect/disconnect, connectOrCreate), aggregation/grouping/count/distinct, transactions ($transaction array, interactive, nested writes, batch, isolation levels), raw SQL ($queryRaw, $executeRaw, $executeRawUnsafe, TypedSQL), client extensions (client, model, query, result, shared), special fields (JSON, scalar lists, composite IDs, null/undefined, omit), Prisma CLI commands (init, generate, migrate dev/deploy/status/reset/resolve/diff, db pull/push/execute/seed, format, validate, version, studio, debug), Prisma Studio, error reference |
| [guides.md](guides.md) | Deployment (Vercel, Netlify, AWS Lambda, Azure Functions, Cloudflare Workers/Pages, Deno Deploy, Fly.io, Heroku, Railway, Render, Koyeb, Sevalla, Docker, Turborepo, pnpm/bun workspaces), frameworks (Next.js, Nuxt, SvelteKit, Astro, Hono, NestJS, Elysia, SolidStart, TanStack Start, React Router 7), authentication (Auth.js, Better Auth, Clerk), integrations (AI SDK, Datadog, GitHub Actions, Permit.io, pgfence, Shopify, Vercel deployment, embedded Studio), database guides (multiple databases, schema changes in teams, data migration expand-and-contract), migrations (baselining, customizing, squashing, patching, generating down migrations, native DB functions/types, unsupported features, prototyping with db push, shadow database, troubleshooting), testing (unit, integration), best practices, comparisons (Drizzle, Mongoose, Sequelize, TypeORM), upgrade guides (v1-v7), Prisma Postgres (setup, local dev, connection pooling, backups, extensions, serverless driver, IaC with Terraform/Pulumi/Alchemy), Prisma Compute, AI tools (MCP server, Cursor, Windsurf, Copilot, Codex, ChatGPT, Tabnine, agent skills), troubleshooting (bundler issues, Next.js, Nuxt, TypeScript performance, GraphQL autocompletion, raw SQL comparisons, check constraints, many-to-many relations) |
| [prisma-next.md](prisma-next.md) | Prisma Next — next-gen ORM rewrite, data contracts, PSL and TypeScript schema authoring, fundamentals (reading/writing data, relations, transactions, advanced queries), migrations, middleware, extensions, CLI reference, framework guides, data modeling |
| [platform.md](platform.md) | Prisma Console, Management API (OAuth 2.0, service tokens, TypeScript SDK), Prisma Compute (projects, branches, apps, deployments, environment variables, GitHub integration, domain management, CLI), Query Insights (slow query analysis, AI suggestions), error codes, known limitations, FAQ |
| [orm-supplement.md](orm-supplement.md) | API patterns (REST, GraphQL, fullstack), data modeling concepts, supported databases overview, schema location (multi-file), table inheritance (STI vs MTI), external tables (Preview), unsupported database features, troubleshooting relations, read replicas, debugging, ORM releases and maturity levels, dev environment, SafeQL, Permit RBAC extension, AWS deployment caveats, shared extensions and examples |
| [postgres-ai-supplement.md](postgres-ai-supplement.md) | Prisma Postgres FAQ (pricing, operations, caching, connection pooling limits, Query Insights), troubleshooting, error reference (P6009, P6004, P6008, P5011), import from existing database, create-db CLI, best Postgres for AI apps (pooling, RAG caching, edge driver, pgvector, MCP), AI prompt for Next.js + Prisma v7, AI tutorial (TweetSmith with Ollama) |
| [prisma-next-reference-supplement.md](prisma-next-reference-supplement.md) | Prisma Next detailed reference — ORM client methods (first, all, count, select, include, where, orderBy, take, skip, cursor, variant, create, createAll, update, updateAll, delete, deleteAll, upsert, aggregate, groupBy, having), filter operators (PostgreSQL and MongoDB), field update operations, AsyncIterableResult, SQL query builder (select, joins, grouped queries, raw SQL, build, ResultType), pipeline builder (match, group, sort, lookup, replaceRoot, count, sortByCount, updateMany, out, merge, rawCommand), raw queries (PostgreSQL raw SQL, MongoDB raw commands), transactions and runtime (client lifecycle, db.transaction, withTransaction, manual control, prepared statements, execution options, telemetry), data modeling (relational, MongoDB, embed vs reference, polymorphic), contract authoring (capabilities, artifacts, content hashes), middleware (five hooks, authoring custom, built-in budgets/cache/lints), migrations (workflow, graph, rollbacks, recovery) |

## Core Concepts

- **Prisma Schema**: Single source of truth for database models, relations, and connection config (`.prisma` file)
- **Prisma Client**: Auto-generated, type-safe query builder tailored to your schema
- **Prisma Migrate**: Declarative + imperative migration system with SQL migration files
- **Prisma Studio**: GUI for viewing and editing database data
- **Driver Adapters**: Prisma 7+ requires driver adapters for database connections (e.g., `@prisma/adapter-pg`)
- **Auto-generation**: Run `prisma generate` to generate the client from your schema
- **Type Safety**: Full TypeScript types generated from schema, including relations and partial queries
- **Nested Writes**: Create/update related records atomically in a single transaction
- **Raw SQL**: Escape hatch with `$queryRaw`, `$executeRaw`, and TypedSQL for type-safe raw queries

## File Structure

```
prisma/
├── schema.prisma       # Prisma schema (models, relations, datasource, generator)
├── migrations/         # SQL migration files (from prisma migrate)
└── generated/          # Generated Prisma Client output
prisma.config.ts        # Prisma configuration (datasource URL, migrations path)
```

## Sources

### Prisma ORM Overview
- https://www.prisma.io/docs/orm
- https://www.prisma.io/docs/orm/prisma-client
- https://www.prisma.io/docs/orm/prisma-migrate
- https://www.prisma.io/docs/orm/prisma-schema/overview

### Prisma Schema
- https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources
- https://www.prisma.io/docs/orm/prisma-schema/overview/generators
- https://www.prisma.io/docs/orm/prisma-schema/data-model/models
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/relation-mode
- https://www.prisma.io/docs/orm/prisma-schema/data-model/indexes
- https://www.prisma.io/docs/orm/prisma-schema/data-model/views
- https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping
- https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema
- https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance
- https://www.prisma.io/docs/orm/prisma-schema/data-model/externally-managed-tables
- https://www.prisma.io/docs/orm/prisma-schema/introspection
- https://www.prisma.io/docs/orm/prisma-schema/postgresql-extensions

### Prisma Client
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/read-replicas
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/custom-model-and-field-names
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/error-formatting
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/database-polyfills
- https://www.prisma.io/docs/orm/prisma-client/queries/crud
- https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries
- https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
- https://www.prisma.io/docs/orm/prisma-client/queries/pagination
- https://www.prisma.io/docs/orm/prisma-client/queries/select-fields
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
- https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search
- https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
- https://www.prisma.io/docs/orm/prisma-client/queries/advanced/query-optimization-performance
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql
- https://www.prisma.io/docs/orm/prisma-client/client-extensions
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/client
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/model
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/query
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/result
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/shared-extensions
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/type-utilities
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-scalar-lists-arrays
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined
- https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/composite-types
- https://www.prisma.io/docs/orm/prisma-client/type-safety
- https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-type-system
- https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging
- https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/sql-comments
- https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/opentelemetry-tracing
- https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/debugging
- https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
- https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
- https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing

### Prisma Migrate
- https://www.prisma.io/docs/orm/prisma-migrate/getting-started
- https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model
- https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories
- https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database
- https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/squashing-migrations
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/native-database-functions
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/native-database-types
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/troubleshooting
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/unsupported-database-features

### Prisma CLI
- https://www.prisma.io/docs/cli
- https://www.prisma.io/docs/cli/init
- https://www.prisma.io/docs/cli/generate
- https://www.prisma.io/docs/cli/format
- https://www.prisma.io/docs/cli/validate
- https://www.prisma.io/docs/cli/version
- https://www.prisma.io/docs/cli/studio
- https://www.prisma.io/docs/cli/debug
- https://www.prisma.io/docs/cli/migrate
- https://www.prisma.io/docs/cli/migrate/dev
- https://www.prisma.io/docs/cli/migrate/deploy
- https://www.prisma.io/docs/cli/migrate/status
- https://www.prisma.io/docs/cli/migrate/reset
- https://www.prisma.io/docs/cli/migrate/resolve
- https://www.prisma.io/docs/cli/migrate/diff
- https://www.prisma.io/docs/cli/db
- https://www.prisma.io/docs/cli/db/pull
- https://www.prisma.io/docs/cli/db/push
- https://www.prisma.io/docs/cli/db/execute
- https://www.prisma.io/docs/cli/db/seed

### Prisma Studio
- https://www.prisma.io/docs/studio
- https://www.prisma.io/docs/studio/getting-started
- https://www.prisma.io/docs/studio/integrations/embedding
- https://www.prisma.io/docs/studio/integrations/vscode-integration

### Reference
- https://www.prisma.io/docs/orm/reference/prisma-client-reference
- https://www.prisma.io/docs/orm/reference/prisma-schema-reference
- https://www.prisma.io/docs/orm/reference/prisma-cli-reference
- https://www.prisma.io/docs/orm/reference/prisma-config-reference
- https://www.prisma.io/docs/orm/reference/connection-urls
- https://www.prisma.io/docs/orm/reference/environment-variables-reference
- https://www.prisma.io/docs/orm/reference/error-reference
- https://www.prisma.io/docs/orm/reference/errors
- https://www.prisma.io/docs/orm/reference/supported-databases
- https://www.prisma.io/docs/orm/reference/database-features
- https://www.prisma.io/docs/orm/reference/system-requirements
- https://www.prisma.io/docs/orm/reference/preview-features/cli-preview-features
- https://www.prisma.io/docs/orm/reference/preview-features/client-preview-features

### Prisma Postgres
- https://www.prisma.io/docs/postgres
- https://www.prisma.io/docs/postgres/database
- https://www.prisma.io/docs/postgres/database/connecting-to-your-database
- https://www.prisma.io/docs/postgres/database/local-development
- https://www.prisma.io/docs/postgres/database/connection-pooling
- https://www.prisma.io/docs/postgres/database/backups
- https://www.prisma.io/docs/postgres/database/postgres-extensions
- https://www.prisma.io/docs/postgres/database/serverless-driver
- https://www.prisma.io/docs/postgres/database/query-insights
- https://www.prisma.io/docs/postgres/faq
- https://www.prisma.io/docs/postgres/troubleshooting
- https://www.prisma.io/docs/postgres/error-reference

### Prisma Compute
- https://www.prisma.io/docs/prisma-compute/deploy

### Prisma Next
- https://www.prisma.io/docs/prisma-next
- https://www.prisma.io/docs/prisma-next/data-contracts
- https://www.prisma.io/docs/prisma-next/contract-authoring/psl
- https://www.prisma.io/docs/prisma-next/contract-authoring/typescript
- https://www.prisma.io/docs/prisma-next/fundamentals/reading-data
- https://www.prisma.io/docs/prisma-next/fundamentals/writing-data
- https://www.prisma.io/docs/prisma-next/fundamentals/relations
- https://www.prisma.io/docs/prisma-next/fundamentals/transactions
- https://www.prisma.io/docs/prisma-next/migrations
- https://www.prisma.io/docs/prisma-next/middleware
- https://www.prisma.io/docs/prisma-next/extensions
- https://www.prisma.io/docs/prisma-next/cli-reference

### ORM Supplement (Batch 3)
- https://www.prisma.io/docs/orm/core-concepts/api-patterns
- https://www.prisma.io/docs/orm/core-concepts/data-modeling
- https://www.prisma.io/docs/orm/core-concepts/supported-databases
- https://www.prisma.io/docs/orm/prisma-schema/overview/location
- https://www.prisma.io/docs/orm/prisma-schema/data-model/table-inheritance
- https://www.prisma.io/docs/orm/prisma-schema/data-model/externally-managed-tables
- https://www.prisma.io/docs/orm/prisma-schema/data-model/unsupported-database-features
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/troubleshooting-relations
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/read-replicas
- https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/debugging
- https://www.prisma.io/docs/orm/more/releases
- https://www.prisma.io/docs/orm/more/dev-environment
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/safeql
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/shared-extensions/permit-rbac
- https://www.prisma.io/docs/orm/prisma-client/deployment/caveats-when-deploying-to-aws-platforms
- https://www.prisma.io/docs/orm/prisma-client/client-extensions/extension-examples

### Postgres & AI Supplement (Batch 4)
- https://www.prisma.io/docs/postgres/faq
- https://www.prisma.io/docs/postgres/troubleshooting
- https://www.prisma.io/docs/postgres/error-reference
- https://www.prisma.io/docs/postgres/import-from-existing-database
- https://www.prisma.io/docs/postgres/best-postgres-for-ai-apps
- https://www.prisma.io/docs/postgres/npx-create-db
- https://www.prisma.io/docs/ai/prompts/nextjs
- https://www.prisma.io/docs/ai/tutorials/typefully-clone

### AI Tools
- https://www.prisma.io/docs/ai
- https://www.prisma.io/docs/ai/tools/mcp-server
- https://www.prisma.io/docs/ai/tools/cursor
- https://www.prisma.io/docs/ai/tools/windsurf
- https://www.prisma.io/docs/ai/tools/github-copilot
- https://www.prisma.io/docs/ai/tools/codex
- https://www.prisma.io/docs/ai/tools/chatgpt
- https://www.prisma.io/docs/ai/tools/tabnine
- https://www.prisma.io/docs/ai/tools/skills

### Guides
- https://www.prisma.io/docs/guides
- https://www.prisma.io/docs/guides/frameworks/nextjs
- https://www.prisma.io/docs/guides/frameworks/nuxt
- https://www.prisma.io/docs/guides/frameworks/sveltekit
- https://www.prisma.io/docs/guides/frameworks/astro
- https://www.prisma.io/docs/guides/frameworks/hono
- https://www.prisma.io/docs/guides/frameworks/nestjs
- https://www.prisma.io/docs/guides/frameworks/elysia
- https://www.prisma.io/docs/guides/frameworks/solid-start
- https://www.prisma.io/docs/guides/frameworks/tanstack-start
- https://www.prisma.io/docs/guides/frameworks/react-router-7
- https://www.prisma.io/docs/guides/runtimes/bun
- https://www.prisma.io/docs/guides/runtimes/deno
- https://www.prisma.io/docs/guides/deployment/docker
- https://www.prisma.io/docs/guides/deployment/turborepo
- https://www.prisma.io/docs/guides/deployment/cloudflare-workers
- https://www.prisma.io/docs/guides/deployment/cloudflare-d1
- https://www.prisma.io/docs/guides/deployment/bun-workspaces
- https://www.prisma.io/docs/guides/deployment/pnpm-workspaces
- https://www.prisma.io/docs/guides/database/data-migration
- https://www.prisma.io/docs/guides/database/multiple-databases
- https://www.prisma.io/docs/guides/database/schema-changes
- https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- https://www.prisma.io/docs/orm/more/best-practices
- https://www.prisma.io/docs/orm/more/comparisons/prisma-and-drizzle
- https://www.prisma.io/docs/orm/more/comparisons/prisma-and-mongoose
- https://www.prisma.io/docs/orm/more/comparisons/prisma-and-sequelize
- https://www.prisma.io/docs/orm/more/comparisons/prisma-and-typeorm

### Prisma Next Reference Supplement (Batch 5a)
- https://www.prisma.io/docs/orm/next/reference/orm-client
- https://www.prisma.io/docs/orm/next/reference/sql-query-builder
- https://www.prisma.io/docs/orm/next/reference/pipeline-builder
- https://www.prisma.io/docs/orm/next/reference/raw-queries
- https://www.prisma.io/docs/orm/next/reference/transactions-and-runtime
- https://www.prisma.io/docs/orm/next/data-modeling/relational-databases
- https://www.prisma.io/docs/orm/next/data-modeling/mongodb
- https://www.prisma.io/docs/orm/next/contract-authoring/capabilities
- https://www.prisma.io/docs/orm/next/contract-authoring/the-data-contract
- https://www.prisma.io/docs/orm/next/contract-authoring/the-contract-artifact
- https://www.prisma.io/docs/orm/next/middleware/how-middleware-works
- https://www.prisma.io/docs/orm/next/middleware/authoring-custom-middleware
- https://www.prisma.io/docs/orm/next/middleware/built-in-budgets
- https://www.prisma.io/docs/orm/next/middleware/built-in-cache
- https://www.prisma.io/docs/orm/next/middleware/built-in-lints
- https://www.prisma.io/docs/orm/next/migrations/how-migrations-work
- https://www.prisma.io/docs/orm/next/migrations/the-migration-graph
- https://www.prisma.io/docs/orm/next/migrations/rollbacks-and-recovery
- https://www.prisma.io/docs/orm/next/migrations/generating-a-migration
- https://www.prisma.io/docs/orm/next/migrations/editing-a-migration
- https://www.prisma.io/docs/orm/next/migrations/applying-a-migration

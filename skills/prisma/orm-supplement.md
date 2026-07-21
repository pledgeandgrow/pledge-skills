# Prisma ORM — Missing Pages (Batch 3)

## API Patterns

Prisma Client can be used in any server-side JS/TS application.

### REST APIs

Supported frameworks: Express, Fastify, hapi, koa, NestJS, Next.js API Routes.

```ts
// GET /feed
app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

// POST /post
app.post("/post", async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: { title, content, author: { connect: { email: authorEmail } } },
  });
  res.json(result);
});

// PUT /publish/:id
app.put("/publish/:id", async (req, res) => {
  const post = await prisma.post.update({
    where: { id: Number(req.params.id) },
    data: { published: true },
  });
  res.json(post);
});

// DELETE /post/:id
app.delete("/post/:id", async (req, res) => {
  const post = await prisma.post.delete({ where: { id: Number(req.params.id) } });
  res.json(post);
});
```

### GraphQL

Supported: `graphql-yoga`, `apollo-server`, `pothos`, `nexus`, `type-graphql`. Prisma ORM is used inside resolvers for queries and mutations.

### Fullstack Frameworks

Next.js, Remix, SvelteKit, Nuxt, Redwood, Wasp. Runtimes: Node.js, Bun, Deno.

```ts
// Next.js getServerSideProps
export const getServerSideProps = async () => {
  const feed = await prisma.post.findMany({ where: { published: true } });
  return { props: { feed } };
};
```

---

## Data Modeling

Data modeling = defining the shape and structure of application objects. In relational databases: tables. In MongoDB: collections.

### Without Prisma ORM

Two levels: database (SQL DDL) and application (classes/interfaces). Models represented differently due to data type mismatches, relation representation differences, database constraints.

### With ORMs

Classes carry data AND logic (storage, retrieval, serialization). Instances are not POJOs.

### With Prisma ORM

Application models defined in Prisma schema, not in programming language:

```prisma
model User {
  user_id Int     @id @default(autoincrement())
  name    String?
  email   String  @unique
  isAdmin Boolean @default(false)
}
```

Prisma Client generates TypeScript type aliases:

```ts
export type User = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
};
```

**Two workflows**:
- **Only Prisma Client**: SQL schema → `prisma db pull` (introspect) → `prisma generate`
- **Prisma Client + Migrate**: Edit schema → `prisma migrate dev` (or `prisma db push` for MongoDB)

---

## Supported Databases — Overview

### Self-hosted Versions

| Database | Version |
|----------|---------|
| PostgreSQL | 9.6+ |
| MySQL | 5.6+ |
| MariaDB | 10.0+ |
| SQL Server | 2017+ |
| SQLite | All |
| MongoDB | 4.2+ |
| CockroachDB | 21.2.4+ |

### Managed/Serverless

Neon, Supabase, PlanetScale, Turso, Cloudflare D1 (Preview), AWS Aurora, MongoDB Atlas

### Feature Matrix

**Constraints**: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, DEFAULT (all supported except FK on MongoDB)

**Data types**: Arrays (PostgreSQL, MongoDB), JSON (all), Enums (all except SQL Server)

---

## Schema Location

Default: `./prisma/schema.prisma` or `./schema.prisma`

**Lookup order**: `--schema` flag → `prisma.config.ts` `schema` property → default locations

### Multi-file Schema

```
prisma/
├── migrations
├── models/
│   ├── posts.prisma
│   └── users.prisma
└── schema.prisma  # Contains generator block
```

Configure in `prisma.config.ts`:

```ts
export default defineConfig({
  schema: "prisma/",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
```

Tips: organize by domain, use clear naming, have an obvious "main" schema file.

---

## Table Inheritance

Two approaches for modeling hierarchical entities:

### Single-Table Inheritance (STI)

Single table with optional fields and discriminator:

```prisma
model Activity {
  id       Int          @id
  url      String       @unique
  duration Int?         // video-only
  body     String?      // article-only
  type     ActivityType
  owner    User         @relation(fields: [ownerId], references: [id])
  ownerId  Int
}

enum ActivityType { Video Article }
```

Query by type: `prisma.activity.findMany({ where: { type: "Video" } })`

Define dedicated types: `type Video = Omit<Activity, "body" | "type">`

### Multi-Table Inheritance (MTI)

Separate tables linked via 1-1 relations:

```prisma
model Activity {
  id      Int          @id @default(autoincrement())
  url     String
  type    ActivityType
  video   Video?
  article Article?
  owner   User         @relation(fields: [ownerId], references: [id])
  ownerId Int
}

model Video {
  id         Int      @id @default(autoincrement())
  duration   Int
  activityId Int      @unique
  activity   Activity @relation(fields: [activityId], references: [id])
}

model Article {
  id         Int      @id @default(autoincrement())
  body       String
  activityId Int      @unique
  activity   Activity @relation(fields: [activityId], references: [id])
}
```

Query: `prisma.video.findMany({ include: { activity: true } })`

### Tradeoffs

| Aspect | STI | MTI |
|--------|-----|-----|
| Data model | Wide rows, many NULLs | Cleaner separation |
| Performance | Single table | Joins needed |
| Typings | Manual type definitions | Better generated types |
| IDs | Single ID | Dual IDs (parent + child) |

---

## External Tables (Preview)

Tables queryable via Prisma Client but ignored by Prisma Migrate.

**Use cases**: auth services (Clerk, Auth0), storage services (Supabase Storage), microservice-owned tables.

### Setup

1. Declare in `prisma.config.ts`:
```ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  experimental: { externalTables: true },
  tables: { external: ["public.users"] },
  enums: { external: ["public.role"] },
  datasource: { url: env("DATABASE_URL") },
});
```

2. Update schema: `npx prisma db pull`
3. Re-generate: `npx prisma generate`

**Relationships**: Prisma can create FKs from managed to external tables. Provide shadow DB SQL for migration creation:

```ts
migrations: {
  path: "prisma/migrations",
  initShadowDb: `CREATE TABLE public.users (id SERIAL PRIMARY KEY);`,
}
```

> Prisma does not verify structure matches. Use `prisma db pull` for safety.

---

## Unsupported Database Features (Schema)

### Native Database Functions

Use `dbgenerated()` for database-level functions:

```prisma
model User {
  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
}
```

Enable PostgreSQL extensions via customized migration: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`

### Unsupported Field Types

Use `Unsupported("type")` for types like `polygon`, `geometry`, `circle`:

```prisma
model Star {
  id       Int                    @id @default(autoincrement())
  position Unsupported("circle")? @default(dbgenerated("'<(10,4),11>'::circle"))
}
```

Fields with `Unsupported` type are not available in Prisma Client. Use `$queryRaw` for operations.

### Unsupported Features

Features like SQL views cannot be represented in PSL. Include them via custom migration SQL.

> Partial indexes now supported via `where` argument on `@@index`, `@@unique`, `@unique`.

---

## Troubleshooting Relations

### Implicit m-n Self-Relations: Field Order Matters

Renaming relation fields in implicit many-to-many self-relations can return incorrect data if alphabetic order changes. **Solution**: maintain alphabetic order (e.g., prefix with `a_` and `b_`).

### Explicit m-n: Both Sides Required

Explicit relation tables must have back relation fields on both models:

```prisma
// WRONG - missing back relations
model Post {
  categories Category[]  // should be postCategories PostCategories[]
}

// CORRECT
model Post {
  postCategories PostCategories[]
}
model Category {
  postCategories PostCategories[]
}
```

### @relation on Implicit m-n

Adding `@relation("Name")` to implicit m-n fields creates two separate 1-n relations. Remove `@relation` annotations for implicit m-n. Use `@relation` only to name the relation table.

### Enforced Primary Keys

Some providers require PKs on all tables. Implicit m-n relation tables don't have PKs. **Solution**: use explicit relation syntax with `@@id`.

---

## Read Replicas

`@prisma/extension-read-replicas` adds read-only replica support.

```bash
npm install @prisma/extension-read-replicas@latest
```

```ts
import { readReplicas } from "@prisma/extension-read-replicas";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const mainAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const mainClient = new PrismaClient({ adapter: mainAdapter });

const replicaAdapter = new PrismaPg({ connectionString: process.env.REPLICA_URL! });
const replicaClient = new PrismaClient({ adapter: replicaAdapter });

const prisma = mainClient.$extends(readReplicas({ replicas: [replicaClient] }));

// Read from replica
await prisma.post.findMany();

// Write to primary
await prisma.post.create({ data: { /* ... */ } });

// Force read from primary
await prisma.$primary().post.findMany();

// Force read from replica
await prisma.$replica().user.findFirst();
```

Multiple replicas: randomly selected. All `$transaction` queries go to primary.

---

## Debugging

Enable via `DEBUG` environment variable:

```bash
# Engine only
export DEBUG="prisma:engine"

# Client only
export DEBUG="prisma:client"

# Both
export DEBUG="prisma:client,prisma:engine"

# All Prisma
export DEBUG="prisma*"

# Everything
export DEBUG="*"

# Windows
set DEBUG="prisma*"
```

> Also see Prisma Client [logging configuration](https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging) for query logging.

---

## ORM Releases and Maturity Levels

Releases every ~2 weeks. Follows SemVer since v3.x.x.

### Maturity Levels

| Level | Meaning |
|-------|---------|
| **Early Access** | Cutting edge, may evolve, API won't change drastically |
| **Preview** | Validated, mostly stable, behind feature flag |
| **Generally Available** | Stable, production-ready, no bugs in 99% of cases |

### Versioning

- **MAJOR**: Breaking changes to GA surface
- **MINOR**: Backward compatible features; opt-in breaking changes (EA/Preview) allowed
- **PATCH**: Bug fixes, always backward compatible

> Pre-v2.28.0 did not follow SemVer strictly.

---

## Dev Environment

- [Environment variables](https://www.prisma.io/docs/orm/more/dev-environment/environment-variables)
- [Editor setup](https://www.prisma.io/docs/orm/more/dev-environment/editor-setup)

---

## SafeQL & Prisma Client

SafeQL provides ESLint-based type safety for raw SQL queries. Works with `$queryRaw` and `$executeRaw`.

**Use case**: PostGIS and other `Unsupported` field types.

1. Enable `postgresqlExtensions` preview feature, add `postgis` extension
2. Run `prisma migrate dev --name add-postgis`
3. Configure SafeQL ESLint rules
4. Use `$queryRaw` with type safety

> For most raw SQL use cases, prefer TypedSQL. Use legacy raw queries for `Unsupported` fields.

---

## Fine-Grained Authorization (Permit)

`@permitio/permit-prisma` extension for RBAC, ABAC, and ReBAC.

```bash
npm install @permitio/permit-prisma @prisma/client
```

**Models**:
- **RBAC**: Role-based (Admin, Editor, Viewer)
- **ABAC**: Attribute-based (user.department == document.department)
- **ReBAC**: Relationship-based (Owner of document-123, Viewer of document-456)

Requires Permit.io account and PDP container running.

---

## AWS Deployment Caveats

### AWS RDS Proxy

No benefit with Prisma ORM — RDS Proxy pins connections due to prepared statements.

### AWS Elastic Beanstalk

- Add `.npmrc` with `unsafe-perm=true` for `postinstall` hook
- Move `prisma` CLI to `dependencies` (Beanstalk skips devDependencies)
- Or set `NPM_USE_PRODUCTION=false`

### AWS RDS Postgres SSL

Error `P1010`: Update connection string with `sslmode=no-verify`:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=no-verify&schema=public
```

---

## Shared Extensions & Examples

### Prisma-made

| Extension | Description |
|-----------|-------------|
| `@prisma/extension-read-replicas` | Read replica support |

### Community Extensions

| Extension | Description |
|-----------|-------------|
| `prisma-extension-supabase-rls` | Supabase Row Level Security |
| `prisma-extension-bark` | Materialized Path pattern for tree structures |
| `prisma-cursorstream` | Cursor-based streaming |
| `prisma-gpt` | Natural language queries |
| `prisma-extension-caching` | Complex query caching |
| `prisma-extension-cache-manager` | cache-manager compatible caching |
| `prisma-extension-random` | Random rows |
| `prisma-paginate` | Pagination |
| `prisma-extension-streamdal` | Code-Native data pipelines |
| `prisma-rbac` | Role-based access control |
| `prisma-extension-redis` | Redis caching and invalidation |
| `prisma-extension-casl` | CASL authorization logic |
| `prisma-emitter-extension` | CRUD event emitter |

### Example Extensions

| Example | Description |
|---------|-------------|
| `audit-log-context` | Current user ID for Postgres audit triggers |
| `callback-free-itx` | Interactive transactions without callbacks |
| `computed-fields` | Virtual/computed fields |
| `input-transformation` | Transform input arguments |
| `input-validation` | Validate mutation inputs |
| `instance-methods` | Active Record-like `save()` and `delete()` |
| `json-field-types` | Strongly-typed JSON columns |
| `model-filters` | Reusable composable filters |
| `obfuscated-fields` | Hide sensitive fields from results |
| `query-logging` | Query timing and logging |
| `readonly-client` | Read-only client |
| `retry-transactions` | Retry with exponential backoff |
| `row-level-security` | Postgres RLS for multi-tenant |

---

## Sources

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

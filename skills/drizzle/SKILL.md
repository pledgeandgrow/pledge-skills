---
name: drizzle-orm
version: "0.40.x"
tags:
  - drizzle
  - orm
  - typescript
  - postgresql
  - mysql
  - sqlite
  - database
  - sql
  - migrations
  - schema
  - drizzle-kit
  - serverless
  - neon
  - supabase
  - turso
  - vercel
  - zod
  - valibot
  - typebox
  - arktype
  - effect
  - graphql
description: |
  Drizzle ORM — TypeScript SQL ORM. Schema definition, queries, migrations, transactions, RQB, extensions.
---

# Drizzle ORM

## Overview

Drizzle ORM is a lightweight, performant, TypeScript-first ORM with zero dependencies. It is headless (not a data framework), SQL-like at its core, and serverless-ready by design. Drizzle supports PostgreSQL, MySQL, SQLite, SingleStore, MSSQL, and CockroachDB.

**Key principles:**
- **Headless ORM** — a library, not a framework; build your project however you want
- **SQL-like** — if you know SQL, you know Drizzle; zero to no learning curve
- **Relational Queries API** — optional `db.query` API for nested relational data (outputs exactly 1 SQL query)
- **Serverless-ready** — 0 dependencies, dialect-specific, works with all major database drivers
- **Full TypeScript** — schema definitions, query results, and insert types are all inferred

## Skill Files

| File | Description |
|------|-------------|
| `getting-started.md` | Overview, philosophy, installation (PostgreSQL/MySQL/SQLite), schema definition, drizzle.config.ts, push & migrate workflow, CRUD basics |
| `api.md` | Full API reference: column types per dialect, SQL builder (select/insert/update/delete), joins, filter operators, relational queries (RQB), `sql` template tag, transactions, Drizzle Kit migrations, `defineRelations` |
| `guides.md` | Tutorials (platform integrations), zod/valibot schema generation, performance tips, deployment patterns |

## Quick Reference

### Define a schema (PostgreSQL)

```typescript
import { integer, pgTable, varchar, serial, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Initialize the database

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });
```

### CRUD

```typescript
import { eq } from "drizzle-orm";

// Insert
await db.insert(users).values({ name: "John", email: "john@example.com" });

// Select
const allUsers = await db.select().from(users);
const user = await db.query.users.findFirst({ where: eq(users.email, "john@example.com") });

// Update
await db.update(users).set({ name: "Jane" }).where(eq(users.id, 1));

// Delete
await db.delete(users).where(eq(users.id, 1));
```

### Relational Queries

```typescript
// Define relations
import { defineRelations } from "drizzle-orm";

export const relations = defineRelations({ users, posts }, (r) => ({
  users: { posts: r.many.posts() },
  posts: { author: r.one.users({ from: r.posts.authorId, to: r.users.id }) },
}));

// Query with nested relations (single SQL query)
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true },
});
```

### Migrations

```bash
npx drizzle-kit generate   # Generate SQL migration files
npx drizzle-kit migrate    # Apply migrations to database
npx drizzle-kit push       # Push schema directly (no migration files)
```

## Supported Databases

| Database | Driver Package | Drizzle Import |
|----------|---------------|----------------|
| PostgreSQL (node-postgres) | `pg` | `drizzle-orm/node-postgres` |
| PostgreSQL (postgres.js) | `postgres` | `drizzle-orm/postgres-js` |
| Neon (serverless) | `@neondatabase/serverless` | `drizzle-orm/neon-serverless` |
| Vercel Postgres | `@vercel/postgres` | `drizzle-orm/vercel-postgres` |
| Supabase | `@supabase/supabase-js` | `drizzle-orm/postgres-js` |
| MySQL (mysql2) | `mysql2` | `drizzle-orm/mysql2` |
| MySQL (PlanetScale) | `@planetscale/database` | `drizzle-orm/planetscale` |
| SQLite (better-sqlite3) | `better-sqlite3` | `drizzle-orm/better-sqlite3` |
| SQLite (libSQL/Turso) | `@libsql/client` | `drizzle-orm/libsql` |
| Cloudflare D1 | `@cloudflare/d1` | `drizzle-orm/d1` |
| Bun SQLite | `bun:sqlite` | `drizzle-orm/bun-sqlite` |

## Sources

- https://orm.drizzle.team/docs/overview
- https://orm.drizzle.team/docs/get-started
- https://orm.drizzle.team/docs/get-started/postgresql-new
- https://orm.drizzle.team/docs/get-started/mysql-new
- https://orm.drizzle.team/docs/get-started/sqlite-new
- https://orm.drizzle.team/docs/column-types/pg
- https://orm.drizzle.team/docs/column-types/mysql
- https://orm.drizzle.team/docs/column-types/sqlite
- https://orm.drizzle.team/docs/select
- https://orm.drizzle.team/docs/insert
- https://orm.drizzle.team/docs/update
- https://orm.drizzle.team/docs/delete
- https://orm.drizzle.team/docs/joins
- https://orm.drizzle.team/docs/operators
- https://orm.drizzle.team/docs/rqb
- https://orm.drizzle.team/docs/relations
- https://orm.drizzle.team/docs/sql
- https://orm.drizzle.team/docs/transactions
- https://orm.drizzle.team/docs/kit-overview
- https://orm.drizzle.team/docs/goodies
- https://orm.drizzle.team/docs/tutorials
- https://orm.drizzle.team/docs/zod
- https://orm.drizzle.team/docs/valibot
- https://orm.drizzle.team/docs/typebox
- https://orm.drizzle.team/docs/arktype
- https://orm.drizzle.team/docs/effect-schema
- https://orm.drizzle.team/docs/graphql
- https://orm.drizzle.team/docs/batch-api
- https://orm.drizzle.team/docs/cache
- https://orm.drizzle.team/docs/dynamic-query-building
- https://orm.drizzle.team/docs/read-replicas
- https://orm.drizzle.team/docs/custom-types
- https://orm.drizzle.team/docs/codecs
- https://orm.drizzle.team/docs/jit-mappers
- https://orm.drizzle.team/docs/views
- https://orm.drizzle.team/docs/indexes-constraints
- https://orm.drizzle.team/docs/generated-columns
- https://orm.drizzle.team/docs/set-operations
- https://orm.drizzle.team/docs/eslint-plugin

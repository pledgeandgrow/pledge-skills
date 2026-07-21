# Drizzle ORM — Getting Started

## Why Drizzle?

Drizzle is a **headless ORM** — a library, not a framework. Unlike Django or Spring-style data frameworks, Drizzle doesn't impose project structure. You define schemas in TypeScript, access data in a SQL-like or relational way, and use opt-in tools (Drizzle Kit, Studio) for DX.

### SQL-like Philosophy

If you know SQL, you know Drizzle. No double learning curve. Drizzle embraces SQL at its core:

```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10));
```

### Relational Queries API

For nested data, the `db.query` API outputs exactly 1 SQL query — safe for serverless:

```typescript
const result = await db.query.users.findMany({
  with: { posts: true },
});
```

### Serverless-ready

- 0 dependencies
- Dialect-specific (PostgreSQL, MySQL, SQLite, etc.)
- Works with all major database drivers
- No connection pooling required for serverless

## Installation

### PostgreSQL (node-postgres)

```bash
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit @types/pg tsx
```

**Step 1 — Create schema:**

```typescript
// src/db/schema.ts
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

**Step 2 — Create drizzle.config.ts:**

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Step 3 — Connect and query:**

```typescript
// src/index.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.insert(usersTable).values(user);
  const users = await db.select().from(usersTable);
  console.log(users);
}
main();
```

### MySQL (mysql2)

```bash
npm i drizzle-orm mysql2 dotenv
npm i -D drizzle-kit tsx
```

```typescript
// src/db/schema.ts
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

```typescript
// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

```typescript
// src/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
const db = drizzle(process.env.DATABASE_URL!);
```

### SQLite (libSQL / Turso)

```bash
npm i drizzle-orm @libsql/client dotenv
npm i -D drizzle-kit tsx
```

```typescript
// src/db/schema.ts
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

```typescript
// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
```

```typescript
// src/index.ts
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DB_FILE_NAME!);
```

## Database Connection

Drizzle is driver-agnostic. The import path depends on your driver:

```typescript
// PostgreSQL
import { drizzle } from 'drizzle-orm/node-postgres';    // node-postgres
import { drizzle } from 'drizzle-orm/postgres-js';       // postgres.js
import { drizzle } from 'drizzle-orm/neon-serverless';   // Neon

// MySQL
import { drizzle } from 'drizzle-orm/mysql2';            // mysql2
import { drizzle } from 'drizzle-orm/planetscale';       // PlanetScale

// SQLite
import { drizzle } from 'drizzle-orm/better-sqlite3';    // better-sqlite3
import { drizzle } from 'drizzle-orm/libsql';            // libSQL/Turso
import { drizzle } from 'drizzle-orm/d1';                // Cloudflare D1
```

Pass schema for relational queries:

```typescript
import * as schema from './schema';
const db = drizzle(process.env.DATABASE_URL!, { schema });
```

## Schema Definition

### Table definition

```typescript
import { pgTable, serial, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  age: integer(),
  verified: boolean().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Column modifiers

| Modifier | Description |
|----------|-------------|
| `.notNull()` | NOT NULL constraint |
| `.default(value)` | Static default value |
| `.default(sql\`...\`)` | SQL expression default |
| `.defaultRandom()` | Random UUID (uuid only) |
| `.unique()` | Unique constraint |
| `.$type<T>()` | Override inferred TypeScript type |
| `.$defaultFn(() => ...)` | Runtime default function (e.g., `createId()`) |
| `.$onUpdate(() => ...)` | Runtime update function (e.g., `new Date()`) |

### Foreign keys

```typescript
import { type AnyPgColumn, integer, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
  // Self-referencing foreign key
  invitedBy: integer("invited_by").references((): AnyPgColumn => users.id),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey(),
  authorId: integer("author_id").references(() => users.id),
});
```

### Composite primary keys

```typescript
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id").notNull().references(() => users.id),
    groupId: integer("group_id").notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })]
);
```

### Enums (PostgreSQL)

```typescript
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const moodEnum = pgEnum("mood", ["sad", "ok", "happy"]);

export const table = pgTable("table", {
  mood: moodEnum(),
});
```

### Type inference

```typescript
// Select type (what comes back from DB)
type User = typeof users.$inferSelect;
// { id: number; name: string; email: string; age: number | null; ... }

// Insert type (what goes into DB)
type NewUser = typeof users.$inferInsert;
// { id?: number; name: string; email: string; age?: number | null; ... }
```

## Drizzle Kit — Migrations

### Project structure

```
project root/
├── drizzle/          # Generated migrations
├── src/
│   ├── db/
│   │   └── schema.ts
│   └── index.ts
├── .env
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### Config file

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",              // Migration output folder
  dialect: "postgresql",         // "postgresql" | "mysql" | "sqlite"
  schema: "./src/schema.ts",     // Path to schema file(s)
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Optional:
  schemaFilter: "public",
  tablesFilter: ["*"],
  breakpoints: true,
  verbose: true,
});
```

### Push (rapid prototyping)

```bash
npx drizzle-kit push
```

Directly applies schema changes to the database without generating migration files. Ideal for local development and rapid iteration.

### Generate + Migrate (production)

```bash
npx drizzle-kit generate    # Generate SQL migration files
npx drizzle-kit migrate     # Apply migrations to database
```

### Multiple configs

```bash
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

## CRUD Basics

### Insert

```typescript
// Single row
await db.insert(users).values({ name: "John", email: "john@example.com" });

// Multiple rows
await db.insert(users).values([
  { name: "Andrew" },
  { name: "Dan" },
]);

// With returning (PostgreSQL)
const result = await db.insert(users)
  .values({ name: "Dan" })
  .returning();
// { id: number; name: string; ... }[]

// Partial returning
const result = await db.insert(users)
  .values({ name: "Partial Dan" })
  .returning({ insertedId: users.id });
```

### Select

```typescript
// All columns
const all = await db.select().from(users);

// Partial select
const partial = await db.select({ id: users.id, name: users.name }).from(users);

// With SQL expression
import { sql } from "drizzle-orm";
const withExpr = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);

// Distinct
await db.selectDistinct().from(users).orderBy(users.id);
```

### Update

```typescript
await db.update(users)
  .set({ age: 31 })
  .where(eq(users.email, "john@example.com"));

// With returning (PostgreSQL)
const updated = await db.update(users)
  .set({ age: 31 })
  .where(eq(users.id, 1))
  .returning();
```

### Delete

```typescript
await db.delete(users).where(eq(users.id, 1));

// With returning (PostgreSQL)
const deleted = await db.delete(users)
  .where(eq(users.id, 1))
  .returning();
```

## Sources

- https://orm.drizzle.team/docs/overview
- https://orm.drizzle.team/docs/get-started/postgresql-new
- https://orm.drizzle.team/docs/get-started/mysql-new
- https://orm.drizzle.team/docs/get-started/sqlite-new
- https://orm.drizzle.team/docs/connect-overview
- https://orm.drizzle.team/docs/kit-overview

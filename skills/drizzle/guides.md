# Drizzle ORM — Guides & Tutorials

## Platform Integration Tutorials

Drizzle provides official tutorials for integrating with various platforms and databases:

### Node.js + PostgreSQL on Railway

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/node-railway-pg
- Use `drizzle-orm/node-postgres` with `pg` driver
- Deploy on Railway with connection pooling

### Bun + PostgreSQL on Railway

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/bun-railway-pg
- Use `drizzle-orm/bun-sql` with Bun's native SQL driver
- Leverage Bun's built-in TypeScript execution

### Vercel Postgres

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-vercel
- Use `drizzle-orm/vercel-postgres` with `@vercel/postgres`
- Edge-compatible, serverless-ready

### Neon Postgres

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-neon
- Use `drizzle-orm/neon-serverless` with `@neondatabase/serverless`
- HTTP-based driver, ideal for serverless/edge

### Supabase Database

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase
- Use `drizzle-orm/postgres-js` or `drizzle-orm/neon-serverless`
- Works with Supabase connection pooler

### Supabase Edge Functions

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase-edge-functions
- Use `drizzle-orm/neon-serverless` for edge compatibility
- HTTP-based, no persistent connection needed

### Vercel Edge Functions + Neon

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-vercel-edge-functions-neon
- Combine Vercel Edge with Neon serverless Postgres
- Use `drizzle-orm/neon-serverless`

### Turso (SQLite)

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-turso
- Use `drizzle-orm/libsql` with `@libsql/client`
- Edge-deployable SQLite database

### Netlify Edge Functions + Neon

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-netlify-edge-functions-neon
- Use `drizzle-orm/neon-serverless` on Netlify Edge

### Netlify Edge + Supabase

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-netlify-edge-functions-supabase
- Edge functions with Supabase connection pooler

### Xata

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-xata
- Use Xata's Postgres-compatible API with Drizzle

### Nile Database

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-nile
- Postgres-native database with tenant isolation

### Encore

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-with-encore
- Integrate Drizzle with Encore's backend framework

### Next.js + Neon (Todo App)

- **Tutorial:** https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon
- Full-stack todo application with Next.js App Router and Neon Postgres

## Zod Schema Generation

Drizzle provides built-in zod schema generation from your table definitions.

### Installation

```bash
npm i drizzle-orm@rc zod
```

### Select schema

Validates data returned from the database (API responses):

```typescript
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-orm/zod';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull(),
});

const userSelectSchema = createSelectSchema(users);
// z.object({ id: z.number(), name: z.string(), age: z.number() })

const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema.parse(rows[0]); // Validates shape
```

Views and enums are also supported:

```typescript
import { pgEnum, pgView } from 'drizzle-orm/pg-core';

const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);
// z.enum(['admin', 'basic'])

const usersView = pgView('users_view').as((qb) =>
  qb.select().from(users).where(gt(users.age, 18))
);
const usersViewSchema = createSelectSchema(usersView);
```

### Insert schema

Validates data before inserting (API requests). Auto-generated columns are optional:

```typescript
import { createInsertSchema } from 'drizzle-orm/zod';

const userInsertSchema = createInsertSchema(users);
// z.object({ id: z.number().optional(), name: z.string(), age: z.number() })

const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema.parse(user);
await db.insert(users).values(parsed);
```

### Update schema

All fields are optional for partial updates:

```typescript
import { createUpdateSchema } from 'drizzle-orm/zod';

const userUpdateSchema = createUpdateSchema(users);
// z.object({ id: z.number().optional(), name: z.string().optional(), age: z.number().optional() })

const parsed = userUpdateSchema.parse({ age: 35 });
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements

Extend, modify, or overwrite field schemas:

```typescript
import { createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod/v4';

const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20),           // Extend: add max length
  bio: (schema) => schema.max(1000),          // Extend before nullable
  preferences: z.object({ theme: z.string() }), // Overwrite completely
});
```

### Factory functions

For advanced use cases (extended Zod instances, type coercion):

```typescript
import { createSchemaFactory } from 'drizzle-orm/zod';
import { z } from '@hono/zod-openapi';

const { createInsertSchema } = createSchemaFactory({
  zodInstance: z,  // Use extended Zod instance
});

const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.openapi({ example: 'John' }),
});
```

**Type coercion:**

```typescript
const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true },  // Coerce dates; set `true` for all types
});

const userInsertSchema = createInsertSchema(users);
// createdAt: z.coerce.date()
```

## Other Schema Validation Libraries

### Valibot

```bash
npm i drizzle-orm@rc valibot
```

```typescript
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import { parse } from 'valibot';

const userSelectSchema = createSelectSchema(users);
const parsed = parse(userSelectSchema, rows[0]);

const userInsertSchema = createInsertSchema(users);
const userUpdateSchema = createUpdateSchema(users);

// Refinements
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20),           // Extend
  preferences: object({ theme: string() }),    // Overwrite
});
```

### TypeBox

```bash
npm i drizzle-orm@rc typebox
```

```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/typebox';
import { Type } from 'typebox';
import { Value } from 'typebox/value';

const insertUserSchema = createInsertSchema(users);
const selectUserSchema = createSelectSchema(users);
const updateUserSchema = createUpdateSchema(users);

// Overriding fields
const insertUserSchema = createInsertSchema(users, {
  role: Type.String(),
});

// Refining fields
const insertUserSchema = createInsertSchema(users, {
  id: (schema) => Type.Number({ ...schema, minimum: 0 }),
  role: Type.String(),
});

// Usage
const isUserValid: boolean = Value.Check(insertUserSchema, { name: 'John', email: 'j@t.com', role: 'admin' });
```

### ArkType

```bash
npm i drizzle-orm@rc arktype
```

```typescript
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-orm/arktype';
import { ArkErrors } from 'arktype';

const userSelectSchema = createSelectSchema(users);
const parsed: ArkErrors | { id: number; name: string; age: number } = userSelectSchema(rows[0]);

// Refinements
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20),
});
```

### Effect Schema

```bash
npm i drizzle-orm@rc effect
```

```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/effect-schema';
import { Effect, Schema } from 'effect';

const UserInsert = createInsertSchema(users);
const UserUpdate = createUpdateSchema(users);
const UserSelect = createSelectSchema(users);

// Overriding fields
const UserInsert = createInsertSchema(users, {
  role: Schema.String,
});

// Refining fields
const UserInsert = createInsertSchema(users, {
  id: (schema) => schema.check(Schema.isGreaterThanOrEqualTo(0)),
  role: Schema.String,
});

// Usage
const program = Effect.gen(function*() {
  const parsedUser = yield* Schema.decodeUnknownEffect(UserInsert)({
    name: 'John Doe', email: 'j@t.com', role: 'admin',
  });
});
```

## drizzle-graphql

Auto-generate a GraphQL schema from your Drizzle schema:

```bash
npm i drizzle-orm@latest drizzle-graphql
```

### Quick start (GraphQL Yoga)

```typescript
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });
const { schema } = buildSchema(db);

const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.log('Running on http://localhost:4000/graphql'));
```

### Customizing schema

```typescript
const { entities } = buildSchema(db);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Select only wanted queries
      users: entities.queries.users,
      customer: entities.queries.customersSingle,
      // Custom query with reused types
      customUsers: {
        type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
        args: { where: { type: entities.inputs.UsersFilters } },
        resolve: async (source, args, context, info) => {
          const result = await db.select(schema.users).where()...;
          return result;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: entities.mutations,
  }),
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});
```

The `entities` object provides:
- `entities.queries` — auto-generated query resolvers
- `entities.mutations` — auto-generated mutation resolvers
- `entities.types` — GraphQL object types for each table
- `entities.inputs` — GraphQL input types (filters, inserts, updates)

## Performance Tips

### Single SQL Query Output

Drizzle's Relational Queries API always outputs exactly 1 SQL query. This is critical for:
- Serverless databases (minimize round trips)
- Connection-limited environments (Neon, Turso)
- Predictable performance

### Connection Pooling

For serverless environments, use HTTP-based drivers:
- **Neon:** `@neondatabase/serverless` (HTTP, no persistent connection)
- **Turso:** `@libsql/client` (HTTP-based)
- **Vercel Postgres:** `@vercel/postgres` (HTTP-based)

For traditional Node.js, use connection pools:
```typescript
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
```

### Use `push` for Development, `migrate` for Production

- `drizzle-kit push` — Rapid prototyping, no migration files
- `drizzle-kit generate` + `migrate` — Production, auditable migration history

### Select Only Needed Columns

```typescript
// Bad — selects all columns
const users = await db.select().from(usersTable);

// Good — selects only what's needed
const users = await db.select({ id: usersTable.id, name: usersTable.name })
  .from(usersTable);
```

### Use `.$type<T>()` for JSON Columns

```typescript
// Without $type — inferred as unknown
jsonb()

// With $type — full type safety
jsonb().$type<{ theme: string; notifications: boolean }>()
```

## ESLint Plugin

Drizzle provides an ESLint plugin to catch common mistakes:

```bash
npm i -D eslint-plugin-drizzle
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['drizzle'],
  rules: {
    'drizzle/enforce-delete-with-where': 'error',
    'drizzle/enforce-update-with-where': 'error',
  },
};
```

Prevents accidental `DELETE` or `UPDATE` without `WHERE` clauses.

## Drizzle Studio

Visual GUI for browsing and managing your database:

```bash
npx drizzle-kit studio
```

Opens a web UI at `http://localhost:4983` for:
- Browsing table data
- Running queries
- Viewing schema
- Exporting data

## Deployment Patterns

### Serverless (Vercel/Netlify Edge)

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

export async function GET() {
  const users = await db.query.users.findMany();
  return Response.json(users);
}
```

### Traditional Node.js

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

// Reuse pool across requests
```

### Bun

```typescript
import { drizzle } from 'drizzle-orm/bun-sql';
const db = drizzle(process.env.DATABASE_URL!, { schema });
```

## Sources

- https://orm.drizzle.team/docs/tutorials
- https://orm.drizzle.team/docs/zod
- https://orm.drizzle.team/docs/valibot
- https://orm.drizzle.team/docs/typebox
- https://orm.drizzle.team/docs/arktype
- https://orm.drizzle.team/docs/effect-schema
- https://orm.drizzle.team/docs/graphql
- https://orm.drizzle.team/docs/goodies
- https://orm.drizzle.team/docs/eslint-plugin
- https://orm.drizzle.team/docs/connect-overview

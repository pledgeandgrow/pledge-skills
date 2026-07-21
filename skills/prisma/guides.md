# Prisma ORM — Guides

## Deployment

### Deploy to Vercel

```bash
# Install Prisma
npm install prisma @prisma/client @prisma/adapter-pg

# Build with Prisma Client
npx prisma generate

# Deploy
vercel deploy
```

Key considerations:
- Run `prisma generate` during build step
- Use `prisma migrate deploy` in postinstall or build script
- Use driver adapters for serverless/edge
- Set `DATABASE_URL` in Vercel environment variables

### Deploy to Netlify

```bash
# Netlify build command
npx prisma generate && npx prisma migrate deploy && npm run build
```

### Deploy to AWS Lambda

Use `@prisma/adapter-pg` with connection pooling. Keep Prisma Client warm to avoid cold starts.

### Deploy to Cloudflare Workers

Use `@prisma/adapter-d1` for Cloudflare D1 or `@prisma/adapter-pg` with Prisma Postgres serverless driver.

```ts
import { PrismaD1 } from "@prisma/adapter-d1"

const adapter = new PrismaD1(env.DB)
const prisma = new PrismaClient({ adapter })
```

### Deploy to Deno Deploy

Use `@prisma/adapter-pg` with Prisma Postgres serverless driver.

### Deploy to Fly.io

```dockerfile
# Dockerfile
FROM node:22-slim
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
CMD ["node", ".output/server/index.mjs"]
```

### Deploy to Railway, Render, Koyeb, Heroku, Sevalla

Set `DATABASE_URL` environment variable and run migrations:

```bash
npx prisma migrate deploy
npx prisma generate
npm run start
```

### Deploy with Docker

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Deploy with Turborepo / Monorepo

In `turbo.json`:
```json
{
  "pipeline": {
    "prisma:generate": {
      "outputs": ["**/generated/**"]
    },
    "build": {
      "dependsOn": ["^prisma:generate"]
    }
  }
}
```

### Deploy with pnpm / Bun Workspaces

Ensure `prisma generate` runs in the package that owns the schema, and the generated client is available to dependent packages.

---

## Framework Guides

### Next.js

```bash
# Setup
npm install prisma @prisma/client @prisma/adapter-pg
npx prisma init
```

Best practices:
- Use a single Prisma Client instance (singleton pattern)
- Run `prisma generate` during build
- Use `prisma migrate deploy` for production migrations
- Use driver adapters for edge/serverless

```ts
// lib/prisma.ts
import { PrismaClient } from "../generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### Nuxt

```ts
// server/utils/prisma.ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma
```

Use in server routes:
```ts
// server/api/users.get.ts
import prisma from "~/server/utils/prisma"

export default defineEventHandler(async () => {
  return prisma.user.findMany()
})
```

### SvelteKit

```ts
// src/lib/server/prisma.ts
import { PrismaClient } from "$generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### Astro

```ts
// src/db/prisma.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export default prisma
```

### Hono

```ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const app = new Hono()
app.get("/users", async (c) => c.json(await prisma.user.findMany()))
```

### NestJS

```ts
// prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}
```

### Elysia, SolidStart, TanStack Start, React Router 7

Similar pattern: create a singleton Prisma Client instance and use it in server routes/loaders.

---

## Authentication Guides

### Auth.js (Next.js)

Use Prisma adapter for Auth.js:

```bash
npm install @auth/prisma-adapter
```

```ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [...],
})
```

### Better Auth

Use Prisma adapter for Better Auth with Astro or Next.js.

### Clerk

Use Clerk webhook to sync users to your Prisma database:

```ts
export async function POST(req: Request) {
  const evt = await req.json()
  if (evt.type === "user.created") {
    await prisma.user.create({ data: { id: evt.data.id, email: evt.data.email_addresses[0].email_address } })
  }
}
```

---

## Migration Workflows

### Development Workflow

```bash
# 1. Modify schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name add_user_field

# 3. Generate client
npx prisma generate
```

### Production Workflow

```bash
# Apply pending migrations only
npx prisma migrate deploy
```

### Prototyping with `db push`

```bash
# Push schema changes without creating migration files
npx prisma db push
```

### Baselining a Database

For existing databases with data:

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

npx prisma migrate resolve --applied 0_init
```

### Customizing Migrations

```bash
# Create migration without applying
npx prisma migrate dev --create-only --name add_column

# Edit the SQL file manually
# Then apply
npx prisma migrate dev
```

### Squashing Migrations

Reset and recreate a single migration:

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# Delete old migrations, then:
npx prisma migrate reset
```

### Generating Down Migrations

```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > down_migration.sql
```

### Seeding

```ts
// prisma/seed.ts
import { PrismaClient } from "../generated/client"
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: { email: "admin@prisma.io", role: "ADMIN" },
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

```json
// package.json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

```bash
npx prisma db seed
```

### Schema Management in Teams

- Keep migration files in version control
- Never delete applied migrations
- Use `migrate dev` for local development
- Use `migrate deploy` for production
- Communicate schema changes in PRs
- Use `migrate status` to check state

### Expand-and-Contract Migrations

For zero-downtime schema changes:

1. **Expand**: Add new column (backward compatible)
2. **Migrate**: Deploy code that writes to both old and new columns
3. **Contract**: Remove old column in a later migration

---

## Prisma Postgres

### Setup

```bash
# Create a Prisma Postgres database
bunx create-db@latest

# Or via CLI
npx prisma dev
```

### Connection Strings

- **Direct**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- **Pooled**: `prisma+postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- **Serverless driver**: For edge/serverless environments

### Local Development

```bash
# Start local Prisma Postgres
npx prisma dev

# List servers
npx prisma dev ls

# Stop
npx prisma dev stop

# Remove
npx prisma dev rm
```

### Connection Pooling

Prisma Postgres provides built-in connection pooling. Use the pooled connection string for application traffic and direct connection for migrations.

### Backups

Manage and restore database backups via Prisma Console or Management API.

### PostgreSQL Extensions

Enable standard PostgreSQL extensions:

```prisma
// In schema.prisma
// Use custom migrations to install extensions
```

```bash
npx prisma migrate dev --create-only --name enable_pgvector
```

```sql
-- migration.sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Serverless Driver

For edge environments (Cloudflare Workers, Vercel Edge):

```ts
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

### IaC (Infrastructure as Code)

- **Terraform**: Provision Prisma Postgres with Terraform provider
- **Pulumi**: Manage Prisma Postgres with Pulumi
- **Alchemy**: Provision with Alchemy

---

## Prisma Compute

Deploy TypeScript apps next to your Prisma Postgres database:

```bash
# Deploy
bunx @prisma/cli@latest app deploy
```

Features:
- Isolated preview for every branch
- CLI-first deploy workflow
- Next.js, Hono, TanStack Start, Bun apps supported

---

## AI Tools

### Prisma MCP Server

Connect AI agents to Prisma Postgres workflows:

```json
// Cursor config
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["-y", "@prisma/mcp-server"]
    }
  }
}
```

### Editor Integrations

- **Cursor**: Use Prisma MCP server and agent skills
- **Windsurf**: Use Prisma MCP server
- **GitHub Copilot**: Prisma extension for Copilot
- **Codex**: Prisma Codex plugin
- **ChatGPT**: Add Prisma MCP server to ChatGPT
- **Tabnine**: Prisma ORM integration

### Agent Skills

Installable skills for AI coding agents to get up-to-date Prisma knowledge.

---

## Best Practices

### Schema Design

- Use meaningful model and field names
- Use `@updatedAt` for tracking modifications
- Use enums for fixed value sets
- Define indexes on frequently queried fields
- Use `@db.*` for precise type control
- Use composite unique constraints where needed

### Query Optimization

- Use `select` to fetch only needed fields
- Use cursor-based pagination for large datasets
- Avoid N+1 queries with proper `include`/`select`
- Use `createMany` instead of multiple `create` calls
- Use transactions for related writes
- Monitor with logging and OpenTelemetry

### Type Safety

- Leverage generated types throughout your app
- Use `Prisma.XxxGetPayload<>` for derived types
- Use `Prisma.XxxWhereInput` for query types
- Avoid `any` — use generated types

### Security

- Never hardcode database URLs in schema
- Use environment variables for all secrets
- Use `prisma client extensions` to omit sensitive fields
- Validate input before passing to Prisma Client
- Use least-privilege database users

### Deployment

- Run `prisma generate` during build
- Use `migrate deploy` (not `migrate dev`) in production
- Use driver adapters for serverless/edge
- Keep Prisma Client warm in serverless environments
- Use connection pooling for high-traffic apps

---

## Comparisons

### Prisma vs Drizzle

- **Prisma**: Schema-first, generated client, full type safety, migrations, Studio
- **Drizzle**: SQL-like syntax, lightweight, no codegen, manual migrations

### Prisma vs Mongoose

- **Prisma**: Type-safe, schema-first, works with multiple databases
- **Mongoose**: MongoDB-specific, schema-based, rich middleware

### Prisma vs Sequelize

- **Prisma**: Type-safe, generated, declarative schema, modern API
- **Sequelize**: Model-based, decorators, Active Record pattern

### Prisma vs TypeORM

- **Prisma**: Generated client, plain objects, schema-first
- **TypeORM**: Decorator-based, Active Record/Data Mapper patterns

---

## Upgrade Guides

### Upgrade to v7

Key changes in Prisma 7:
- Driver adapters are mandatory for direct connections
- ESM-only (`"type": "module"` required in `package.json`)
- `prisma-client` generator (replaces `prisma-client-js`)
- `prisma.config.ts` for configuration
- `output` field required in generator block

```bash
npx prisma upgrade
```

### Upgrade to v6

See https://www.prisma.io/docs/guides/upgrade-prisma-orm/v6

### Upgrade to v5

See https://www.prisma.io/docs/guides/upgrade-prisma-orm/v5

---

## Troubleshooting

### Bundler Issues

If you encounter `ENOENT` errors with bundlers (vercel/pkg, etc.), ensure Prisma Client generated files are included in the bundle.

### Next.js Issues

- Use singleton pattern to avoid multiple Prisma Client instances in dev
- Run `prisma generate` in `postinstall` script
- Set `DATABASE_URL` in environment variables

### Nuxt Issues

- Place Prisma Client in server-only context
- Use `server/utils/` for Prisma Client instance
- Ensure generated client is not bundled for client-side

### TypeScript Performance

For large schemas:
- Use `previewFeatures = ["fullTextSearch"]` only when needed
- Split schema into multiple files
- Use `select` to reduce type complexity

### Many-to-Many Relations

- Implicit m-n: Prisma creates join table automatically
- Explicit m-n: You define the join model for extra fields
- Convert with `db pull` + schema adjustments

### Check Constraints

PostgreSQL CHECK constraints via custom migrations:

```bash
npx prisma migrate dev --create-only --name add_check_constraint
```

```sql
ALTER TABLE "User" ADD CONSTRAINT "age_check" CHECK (age >= 18);
```

### Raw SQL Comparisons

For comparing columns in the same table, use `$queryRaw`:

```ts
const results = await prisma.$queryRaw`
  SELECT * FROM "Product" WHERE "salePrice" < "regularPrice"
`
```

# Prisma Postgres & AI Supplement (Batch 4)

## Prisma Postgres FAQ

### General

**Can I use Prisma Postgres without Prisma ORM?** Yes — via direct connection with any tool (Drizzle, Kysely, TypeORM, raw SQL).

**Switching from GitHub to email/password login**: Use the same email address to create a new email/password account; the system auto-links your data.

**VS Code doesn't recognize `$extends`**: Restart TS server — Command Palette → `TypeScript: Restart TS server`.

**Available regions**:

| Region Code | Location |
|-------------|----------|
| `us-west-1` | San Francisco |
| `us-east-1` | North Virginia |
| `eu-west-3` | Paris |
| `eu-central-1` | Frankfurt |
| `ap-northeast-1` | Tokyo |
| `ap-southeast-1` | Singapore |

### Pricing

Operations-based billing. An operation = any Prisma ORM query or SQL query. Read and write queries cost the same. `SELECT 1` counts as a billable operation.

**Cost optimization tips**:
- Batch writes with `createMany`, `updateMany`, `deleteMany`
- Use nested-relation helpers (`connectOrCreate`, `set`)
- Prefer array transactions over interactive transactions (array = 1 operation, interactive = N operations)

```ts
// Array transaction: 1 operation
await prisma.$transaction([
  prisma.user.create({ data: { name: "Alice" } }),
  prisma.post.create({ data: { title: "Hello", authorId: 1 } }),
]);

// Interactive transaction: 2 operations
await prisma.$transaction(async (tx) => {
  await tx.user.create({ data: { name: "Alice" } });
  await tx.post.create({ data: { title: "Hello", authorId: 1 } });
});
```

**Sample workloads**:

| Workload | MAUs | Actions/day | Storage | Plan | Monthly Cost |
|----------|------|-------------|---------|------|-------------|
| Small | 500 | 10 | 0.5 GB | Starter | $10 |
| Medium | 5,000 | 40 | 6 GB | Pro | $49 |
| Large | 50,000 | 60 | 40 GB | Business | $169 |

**Cached operations**: Every request counts as an operation, whether cached or not. Flat per-operation price, no egress charges.

### Caching

- Cache layer uses Cloudflare Anycast (300+ locations)
- Invalidate via `$accelerate.invalidate` API (paid plans) or project-level invalidation (5x/day max)
- TTL max: 1 year (items may be evicted if infrequently accessed)
- Invalidate = delete cache entry; Revalidate = proactively update cache entry
- Cache best for: cross-region apps, RAG pipelines, repeated retrievals
- Cache not ideal for: single-region apps with co-located DB, data that must always be fresh

### Connection Pooling Limits

| Limit | Free | Starter | Pro | Business |
|-------|------|---------|-----|----------|
| Query timeout | 10s | 10s | 20s | 60s |
| Interactive tx timeout | 15s | 15s | 30s | 90s |
| Response size | 5 MB | 5 MB | 10 MB | 20 MB |

### Query Insights

- Built into Prisma Postgres, read-only
- Shows raw SQL by default; install `@prisma/sqlcommenter-query-insights` to see Prisma ORM queries
- Production possible but not recommended (small overhead from SQL comments)

```ts
import { prismaQueryInsights } from "@prisma/sqlcommenter-query-insights";
const prisma = new PrismaClient({
  adapter: myAdapter,
  comments: [prismaQueryInsights()],
});
```

---

## Prisma Postgres Troubleshooting

### `--db` option not recognized

**Cause**: npx caching of outdated Prisma CLI version.

**Solution**: Use `prisma@latest` explicitly:

```bash
npx prisma@latest init --db
```

### Workspace plan limit reached

**Cause**: Default workspace project limit exceeded.

**Solutions**:
- Configure a different workspace with available capacity
- Delete unused projects/databases
- Verify correct account login
- Upgrade to a plan with more projects

---

## Prisma Postgres Error Reference

### P6009 — ResponseSizeLimitExceeded

Response exceeds 5 MB limit.

**Causes & Solutions**:
- **Images/files in DB**: Move to BLOB store (S3, R2, Cloudinary), store URL in DB
- **Over-fetching**: Add proper `where` clauses, use `select`, pagination
- **ETL/bulk fetch**: Split into batches

### P6004 — QueryTimeout

Query exceeds timeout limit (includes wait for connection + network + execution).

**Causes & Solutions**:
- **High traffic, insufficient connections**: Increase `connection_limit` in connection string (default: 10)
- **Long-running queries**: Add indexes, use `select`, fetch less data
- **Database resource contention**: Monitor reads/writes/wait times, isolate analytics queries

### P6008 — ConnectionError/EngineStartError

Cannot establish connection to database.

**Causes & Solutions**:
- **Unreachable host/port**: Verify hostname/port, test with GUI tool
- **Incorrect credentials**: Verify username/password/database name

### P5011 — TooManyRequests

Request volume exceeds thresholds.

**Causes & Solutions**:
- **Aggressive retry loops**: Implement exponential backoff
- **Sudden traffic spikes**: Contact support for capacity planning
- **Prolonged high workloads**: Use batching/chunking, throttle/schedule operations

---

## Import from Existing Database

Choose source: [PostgreSQL](https://www.prisma.io/docs/prisma-postgres/import-from-existing-database-postgresql) or [MySQL](https://www.prisma.io/docs/prisma-postgres/import-from-existing-database-mysql)

**Before starting**: Create a Prisma Postgres database, gather source connection details, use direct connection.

---

## create-db

Open-source CLI for provisioning temporary Prisma Postgres databases.

```bash
npx create-db@latest                    # Quick start
npx create-db@latest --interactive       # Choose region
npx create-db@latest --region eu-west-3  # Specify region
npx create-db@latest --json              # JSON output
```

**Features**: No sign-up required, 24-hour lifetime, claim to make permanent.

**CLI options**:

| Flag | Shorthand | Description |
|------|-----------|-------------|
| `--region` | `-r` | Specify region |
| `--interactive` | `-i` | Interactive region selection |
| `--json` | `-j` | Machine-readable JSON output |
| `--help` | `-h` | Show help |

**Regions**: `ap-southeast-1`, `ap-northeast-1`, `eu-central-1`, `eu-west-3`, `us-east-1`, `us-west-1`

**Claiming**: Open claim URL from CLI output → sign in → choose workspace → authorize. Database becomes permanent.

---

## Best Postgres for AI Apps

AI apps have unique database profiles: bursty requests, repeated retrievals, edge inference, agent access.

### Built-in Connection Pooling

Serverless endpoints exhaust Postgres connections fast. Prisma Postgres includes pooling by default — no pgBouncer needed.

### Query Caching for RAG

```ts
const chunks = await prisma.documentChunk.findMany({
  where: { documentId, similarity: { gte: 0.8 } },
  cacheStrategy: { ttl: 60, swr: 30 },
});
```

### Edge-Native Connectivity

`@prisma/ppg` serverless driver connects over HTTP — works in Cloudflare Workers, Vercel Edge, Deno Deploy.

### pgvector Support

Store and query vector embeddings natively in Postgres alongside application data.

### MCP Server for Agents

AI agents can introspect schemas, run queries, apply migrations via Prisma MCP server.

### Comparison

| Feature | Prisma Postgres | Neon | Supabase |
|---------|----------------|------|----------|
| Built-in pooling | Yes (default) | Yes (PgBouncer) | Yes (Supavisor) |
| Query-level caching | Yes (Accelerate) | No | No |
| Serverless/edge driver | Yes (`@prisma/ppg`) | Yes (`@neondatabase/serverless`) | Partial |
| pgvector | Yes | Yes | Yes |
| MCP server | Yes (first-party) | Yes | Yes |
| Database branching | No | Yes | Limited |
| Free tier | Yes | Yes | Yes |

---

## AI Prompt: Next.js + Prisma

Comprehensive prompt for AI assistants to scaffold Next.js + Prisma Postgres projects (Prisma v7).

### Key Rules

- Use `provider = "prisma-client"` (not `prisma-client-js`)
- Custom output: `output = "../app/generated/prisma"`
- Import from `'../app/generated/prisma/client'` (must include `/client`)
- Use `@prisma/adapter-pg` driver adapter
- No `url` in datasource block (moved to `prisma.config.ts`)
- No `engine` property in `prisma.config.ts`
- Use `import "dotenv/config"` in `prisma.config.ts`
- Standard TCP URLs only (`postgres://...`), not `prisma+postgres://`
- Node.js 20.19+, TypeScript 5.4.0+, Prisma 7.0.0+

### Setup Workflow

```bash
# Install
npm install prisma tsx --save-dev
npm install @prisma/adapter-pg @prisma/client dotenv

# Initialize
npx prisma init --output ../app/generated/prisma
npx create-db  # Creates Prisma Postgres database
```

### prisma.config.ts

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
```

### schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### lib/prisma.ts

```typescript
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
```

### Useful Commands

```bash
npx prisma generate              # Regenerate client
npx prisma db push               # Push schema (no migrations)
npx prisma migrate dev --name X  # Create and apply migrations
npm run db:test                  # Test connection
npm run db:studio                # Open Prisma Studio
```

---

## AI Tutorial: Build a Tweet SaaS (TweetSmith)

Vibe coding tutorial: tweet polishing app with Next.js, Prisma Postgres, Ollama, UploadThing.

### Stack

- Next.js (App Router, TypeScript, Tailwind)
- Prisma ORM + Prisma Postgres
- Ollama (local LLM, `gemma3:4b` model)
- UploadThing (file uploads)
- Lucide React (icons)

### Setup Steps

1. **Install Ollama**: `ollama pull gemma3:4b` (~3.3GB, runs locally, no API keys)
2. **Create Next.js app**: `npx create-next-app@latest tweetsmith`
3. **Build UI**: Dark theme, Typefully-inspired, textarea + transform button
4. **Connect Ollama**: Helper file + API route at `/api/transform`
5. **Add temperature**: `options: { temperature: 0.7 }` for response variety
6. **Filter options**: Max chars slider (100-280), emoji mode (none/few/many)
7. **Context settings**: User voice/tone/audience saved to localStorage
8. **Add Prisma + Prisma Postgres**: Schema with Tweet model, save polished tweets
9. **Add UploadThing**: Image attachments for tweets
10. **Tweet history**: Display saved tweets from database

### Ollama Helper

```typescript
// app/lib/ollama.ts
const OLLAMA_URL = "http://localhost:11434";
const MODEL = "gemma3:4b";

export async function generateWithOllama(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.7 },
    }),
  });
  if (!response.ok) throw new Error("Ollama request failed");
  const data = await response.json();
  return data.response;
}
```

---

## Sources

- https://www.prisma.io/docs/postgres/faq
- https://www.prisma.io/docs/postgres/troubleshooting
- https://www.prisma.io/docs/postgres/error-reference
- https://www.prisma.io/docs/postgres/import-from-existing-database
- https://www.prisma.io/docs/postgres/best-postgres-for-ai-apps
- https://www.prisma.io/docs/postgres/npx-create-db
- https://www.prisma.io/docs/ai/prompts/nextjs
- https://www.prisma.io/docs/ai/tutorials/typefully-clone

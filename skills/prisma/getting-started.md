# Prisma ORM — Getting Started

## What is Prisma ORM?

Prisma ORM is an open-source, next-generation ORM for Node.js, Bun, and Deno that provides type-safe database access, migrations, and a visual data editor.

### Components

- **Prisma Client**: Auto-generated, type-safe query builder tailored to your schema
- **Prisma Migrate**: Declarative + imperative database migration system
- **Prisma Studio**: GUI to view and edit your data

### Why Prisma ORM?

- **Type-safe queries** validated at compile time with full autocompletion
- **Thinking in objects** without the complexity of mapping relational data
- **Plain JavaScript objects** returned from queries, not complex model instances
- **Single source of truth** in the Prisma schema
- **Healthy constraints** that prevent common pitfalls and anti-patterns

### When to Use Prisma

**Good fit if you:**
- Build server-side applications (REST, GraphQL, gRPC, serverless)
- Value type safety and developer experience
- Work in a team and want a clear, declarative schema
- Need migrations, querying, and data modeling in one toolkit

**Consider alternatives if you:**
- Need full control over every SQL query (use raw SQL drivers)
- Want a no-code backend (use Supabase or Firebase)
- Need an auto-generated CRUD GraphQL API (use Hasura or PostGraphile)

---

## How It Works

### 1. Define Your Schema

The Prisma schema defines your data models and database connection:

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "./generated"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

### 2. Configure Your Connection

Create a `prisma.config.ts` file in your project root:

```ts
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

### 3. Run Migrations

```bash
# Using bun
bunx prisma migrate dev

# Using pnpm
pnpm dlx prisma migrate dev

# Using yarn
yarn dlx prisma migrate dev

# Using npm
npx prisma migrate dev
```

Or introspect an existing database:

```bash
npx prisma db pull
```

### 4. Query with Prisma Client

```bash
npm install @prisma/client
npx prisma generate
```

```ts
import { PrismaClient } from "./generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const users = await prisma.user.findMany({
  include: { posts: true },
})

const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    posts: {
      create: { title: "Hello World" },
    },
  },
})
```

> **Prisma 7 Connection Requirements**: Starting with Prisma 7, providing a driver adapter is mandatory for direct database connections. Install the specific adapter package (e.g., `@prisma/adapter-pg`, `@prisma/adapter-mysql`). Your `package.json` must include `"type": "module"` for ESM compatibility.

---

## Installation & Quickstart

### Quickstart with Prisma Postgres

```bash
# Create a new project with Prisma Postgres
bunx create-db@latest
```

### Quickstart with PostgreSQL

```bash
mkdir my-app && cd my-app
npm init -y
npm install prisma @prisma/client @prisma/adapter-pg
npx prisma init
```

### Quickstart with MySQL

```bash
npx prisma init --datasource-provider mysql
```

### Quickstart with SQLite

```bash
npx prisma init --datasource-provider sqlite
```

### Quickstart with MongoDB

```bash
npx prisma init --datasource-provider mongodb
```

### Add to Existing Project

```bash
npm install prisma @prisma/client --save-dev
npx prisma init
```

---

## Prisma Schema

The Prisma schema (`schema.prisma`) is the main configuration file. It consists of:

- **Data sources**: Specify database connection details
- **Generators**: Specify what clients to generate
- **Data model definition**: Models, enums, relations, attributes

### Example (Relational Databases)

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "./generated"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role {
  USER
  ADMIN
}
```

### Example (MongoDB)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

enum Role {
  USER
  ADMIN
}
```

### Syntax

Prisma Schema Language (PSL) is used in `.prisma` files. VS Code extension provides syntax highlighting, auto-formatting, and error detection.

### Comments

- `// comment`: Reader clarity, not in AST
- `/// comment`: Attached to AST nodes as descriptions
- `/* block comment */`: Also in AST

### Environment Variables

Use `env()` function to keep secrets out of the schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Auto-formatting

Run `prisma format` or use VS Code extension. Formatting rules are fixed (no configuration options).

---

## Data Sources

Data sources enable Prisma to connect to your database:

```prisma
datasource db {
  provider = "postgresql" // postgresql, mysql, sqlite, mongodb, sqlserver
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional, for migrations
}
```

### Connection URLs

Format varies by database:

| Database | URL Format |
|----------|-----------|
| PostgreSQL | `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` |
| MySQL | `mysql://USER:PASSWORD@HOST:PORT/DATABASE` |
| SQLite | `file:./dev.db` |
| SQL Server | `sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD` |
| MongoDB | `mongodb://USER:PASSWORD@HOST:PORT/DATABASE` |

---

## Generators

Generators specify what assets are generated when `prisma generate` is invoked:

```prisma
generator client {
  provider = "prisma-client"     // or "prisma-client-js"
  output   = "./generated"
  // previewFeatures = ["relationJoins", "fullTextSearch"]
}
```

---

## Models

Models represent entities and map to tables (relational) or collections (MongoDB).

### Defining Models

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Fields

Fields consist of:
- **Name**: e.g., `email`
- **Type**: Scalar types (`String`, `Int`, `Boolean`, `DateTime`, `Json`, `Float`, `BigInt`, `Decimal`, `Bytes`) or relation types (model references)
- **Type modifiers**: `?` (optional), `[]` (list)
- **Attributes**: `@id`, `@unique`, `@default`, `@relation`, `@map`, `@updatedAt`, `@db.*`

### Native Types

Database-specific types via `@db.*` attributes:

```prisma
model Post {
  title     String  @db.VarChar(255)
  content   Bytes?
  views     Int     @db.UnsignedInt
}
```

### Attributes

**Field attributes:**
- `@id`: Primary key
- `@default(value)`: Default value (supports `autoincrement()`, `now()`, `uuid()`, `cuid()`, `auto()`)
- `@unique`: Unique constraint
- `@relation`: Relation definition
- `@map`: Map field to different column name
- `@updatedAt`: Auto-update timestamp
- `@db.*`: Native type mapping

**Block attributes:**
- `@@unique([field1, field2])`: Composite unique constraint
- `@@index([field1, field2])`: Composite index
- `@@map("table_name")`: Map model to different table name
- `@@id([field1, field2])`: Composite primary key

### Enums

```prisma
enum Role {
  USER
  ADMIN
}
```

---

## Relations

A relation is a connection between two models.

### One-to-One

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}
```

### One-to-Many

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

### Many-to-Many

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

### Self-Relations

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  manager  User?  @relation("ManagerToEmployee", fields: [managerId], references: [id])
  managerId Int?
  team     User[] @relation("ManagerToEmployee")
}
```

### Referential Actions

Define update/delete behavior of related records:

```prisma
model Post {
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  authorId Int
}
```

Options: `Cascade`, `Restrict`, `NoAction`, `SetNull`, `SetDefault`

---

## Supported Databases

| Database | Provider | Support |
|----------|----------|---------|
| PostgreSQL | `postgresql` | Full (incl. Neon, Supabase, Prisma Postgres) |
| MySQL | `mysql` | Full (incl. PlanetScale) |
| SQLite | `sqlite` | Full (incl. Turso/libSQL, Cloudflare D1) |
| MongoDB | `mongodb` | Full |
| SQL Server | `sqlserver` | Full |
| CockroachDB | `cockroachdb` | Full |

### Database Drivers

Prisma 7+ uses driver adapters for database connections:

```ts
import { PrismaPg } from "@prisma/adapter-pg"
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

Available adapters:
- `@prisma/adapter-pg` (PostgreSQL)
- `@prisma/adapter-mysql` (MySQL)
- `@prisma/adapter-d1` (Cloudflare D1)
- `@prisma/adapter-libsql` (Turso/libSQL)
- `@prisma/adapter-mssql` (SQL Server)
- `@prisma/adapter-mongo` (MongoDB)

---

## Connection Management

### Connection Pool

Prisma Client uses connection pools from the database driver or driver adapter. Configure pool size via adapter options.

### PgBouncer

When using PgBouncer or other connection poolers, set `pgbouncer=true` in the connection URL:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true&connection_limit=1
```

### Read Replicas

```ts
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: primaryUrl }),
  readReplicas: [
    new PrismaPg({ connectionString: replicaUrl }),
  ],
})
```

---

## Introspection

Pull existing database schema into Prisma schema:

```bash
npx prisma db pull
```

This generates models from your existing database tables.

---

## Environment Variables

### .env File

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
DIRECT_URL="postgresql://user:password@localhost:5432/mydb"
```

### prisma.config.ts

```ts
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
})
```

---

## Editor Setup

### VS Code

Install the [Prisma VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for:
- Syntax highlighting for `.prisma` files
- Auto-formatting
- Error detection
- Prisma Studio integration

---

## Prisma Postgres

Prisma Postgres is a fully managed PostgreSQL database with:
- Scales to zero
- Integrates with Prisma ORM and Prisma Studio
- Generous free tier
- Connection pooling
- pgvector support
- MCP server support

### Create a Database

```bash
bunx create-db@latest
```

### Local Development

```bash
# Start local Prisma Postgres
npx prisma dev

# List local servers
npx prisma dev ls

# Stop servers
npx prisma dev stop
```

### Connection Strings

- **Direct connection**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- **Pooled connection**: `prisma+postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- **Serverless driver**: Use `@prisma/adapter-pg-worker` for edge environments

---

## Prisma Studio

Prisma Studio is a visual database editor:

```bash
npx prisma studio
```

Features:
- Browse and edit data
- Filter and sort records
- Edit relations
- Available in VS Code and browser
- Can be embedded in your own applications

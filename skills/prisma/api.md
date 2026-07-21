# Prisma ORM — API Reference

## Prisma Client

Prisma Client is the generated, type-safe query builder. Generate it with `prisma generate` and import it:

```ts
import { PrismaClient } from "./generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
```

---

## CRUD Operations

### Create

#### Create a Single Record

```ts
const user = await prisma.user.create({
  data: {
    email: "elsa@prisma.io",
    name: "Elsa Prisma",
  },
})
```

#### Create Multiple Records

```ts
const result = await prisma.user.createMany({
  data: [
    { name: "Bob", email: "bob@prisma.io" },
    { name: "Yewande", email: "yewande@prisma.io" },
  ],
  skipDuplicates: true, // Skip records with duplicate unique fields
})
// Returns: { count: 2 }
```

> `skipDuplicates` is not supported on MongoDB, SQL Server, or SQLite.

#### Create and Return Multiple Records

Supported by PostgreSQL, CockroachDB, and SQLite:

```ts
const users = await prisma.user.createManyAndReturn({
  data: [
    { name: "Alice", email: "alice@prisma.io" },
    { name: "Bob", email: "bob@prisma.io" },
  ],
})
```

#### Create with Nested Relations

```ts
const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    posts: {
      create: [
        { title: "My first post" },
        { title: "How to make cookies" },
      ],
    },
  },
})
```

### Read

#### Get Record by ID or Unique Field

```ts
// By unique field
const user = await prisma.user.findUnique({
  where: { email: "elsa@prisma.io" },
})

// By ID
const user = await prisma.user.findUnique({
  where: { id: 99 },
})
```

#### Get All Records

```ts
const users = await prisma.user.findMany()
```

#### Get First Matching Record

```ts
const user = await prisma.user.findFirst({
  where: { posts: { some: { likes: { gt: 100 } } } },
  orderBy: { id: "desc" },
})
```

#### Filter Records

```ts
// Single field filter
const users = await prisma.user.findMany({
  where: { email: { endsWith: "prisma.io" } },
})

// Multiple conditions with OR/AND
const users = await prisma.user.findMany({
  where: {
    OR: [
      { name: { startsWith: "E" } },
      { AND: { profileViews: { gt: 0 }, role: "ADMIN" } },
    ],
  },
})

// Filter by related records
const users = await prisma.user.findMany({
  where: {
    email: { endsWith: "prisma.io" },
    posts: { some: { published: false } },
  },
})
```

#### Select Fields

```ts
const user = await prisma.user.findUnique({
  where: { email: "emma@prisma.io" },
  select: { email: true, name: true },
})
// Returns: { email: 'emma@prisma.io', name: "Emma" }
```

#### Include Related Records

```ts
const users = await prisma.user.findMany({
  where: { role: "ADMIN" },
  include: { posts: true },
})
```

### Update

#### Update a Single Record

```ts
const updateUser = await prisma.user.update({
  where: { email: "viola@prisma.io" },
  data: { name: "Viola the Magnificent" },
})
```

#### Update Multiple Records

```ts
const updateUsers = await prisma.user.updateMany({
  where: { email: { contains: "prisma.io" } },
  data: { role: "ADMIN" },
})
// Returns: { count: 19 }
```

#### Update and Return Multiple Records

```ts
const users = await prisma.user.updateManyAndReturn({
  where: { email: { contains: "prisma.io" } },
  data: { role: "ADMIN" },
})
```

#### Upsert (Update or Create)

```ts
const upsertUser = await prisma.user.upsert({
  where: { email: "viola@prisma.io" },
  update: { name: "Viola the Magnificent" },
  create: { email: "viola@prisma.io", name: "Viola the Magnificent" },
})
```

> To emulate `findOrCreate()`, use `upsert()` with an empty `update` parameter.

#### Atomic Number Operations

```ts
await prisma.post.updateMany({
  data: {
    views: { increment: 1 },
    likes: { increment: 1 },
  },
})
```

### Delete

#### Delete a Single Record

```ts
const deleteUser = await prisma.user.delete({
  where: { email: "bert@prisma.io" },
})
```

#### Delete Multiple Records

```ts
const deleteUsers = await prisma.user.deleteMany({
  where: { email: { contains: "prisma.io" } },
})
```

#### Delete All Records

```ts
const deleteUsers = await prisma.user.deleteMany({})
```

#### Cascading Deletes

Delete related records first in a transaction:

```ts
const deletePosts = prisma.post.deleteMany({ where: { authorId: 7 } })
const deleteUser = prisma.user.delete({ where: { id: 7 } })
const transaction = await prisma.$transaction([deletePosts, deleteUser])
```

Or configure referential actions in schema:

```prisma
model Post {
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int
}
```

#### Delete All Records from All Tables

```ts
const deletePosts = prisma.post.deleteMany()
const deleteProfile = prisma.profile.deleteMany()
const deleteUsers = prisma.user.deleteMany()
await prisma.$transaction([deleteProfile, deletePosts, deleteUsers])
```

Or with raw SQL (PostgreSQL):

```ts
const tablenames = await prisma.$queryRaw<
  Array<{ tablename: string }>
>`SELECT tablename FROM pg_tables WHERE schemaname='public'`
const tables = tablenames
  .map(({ tablename }) => tablename)
  .filter((name) => name !== "_prisma_migrations")
  .map((name) => `"public"."${name}"`)
  .join(", ")
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
```

---

## Filtering and Sorting

### Filtering with `where`

```ts
const users = await prisma.user.findMany({
  where: { email: { endsWith: "prisma.io" } },
})
```

### Combining Operators

```ts
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { endsWith: "gmail.com" } },
      { email: { endsWith: "company.com" } },
    ],
    NOT: { email: { endsWith: "admin.company.com" } },
  },
})
```

### Filter Operators

| Operator | Description |
|----------|-------------|
| `equals` | Exact match |
| `not` | Not equal |
| `in` | Value in list |
| `notIn` | Value not in list |
| `lt` | Less than |
| `lte` | Less than or equal |
| `gt` | Greater than |
| `gte` | Greater than or equal |
| `contains` | String contains |
| `startsWith` | String starts with |
| `endsWith` | String ends with |
| `mode` | `insensitive` for case-insensitive (PostgreSQL) |
| `search` | Full-text search |

### Relation Filters

| Operator | Description |
|----------|-------------|
| `some` | At least one related record matches |
| `every` | All related records match |
| `none` | No related records match |
| `is` | Related record matches |
| `isNot` | Related record does not match |

### Sorting with `orderBy`

```ts
const posts = await prisma.post.findMany({
  orderBy: { title: "asc" },
})
```

Combine filtering and sorting:

```ts
const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
})
```

Sort by relation, null ordering, and relevance (`_relevance` for PostgreSQL/MySQL) are also supported.

---

## Pagination

### Offset Pagination

```ts
const posts = await prisma.post.findMany({
  skip: 20,
  take: 10,
})
```

### Cursor-Based Pagination

```ts
const firstPage = await prisma.post.findMany({
  take: 10,
  orderBy: { id: "asc" },
})

const lastPost = firstPage[firstPage.length - 1]

const nextPage = lastPost
  ? await prisma.post.findMany({
      take: 10,
      skip: 1,
      cursor: { id: lastPost.id },
      orderBy: { id: "asc" },
    })
  : []
```

### Choosing an Approach

- **Offset pagination**: When users need to jump to numbered pages
- **Cursor-based**: When performance and consistency matter for large datasets

---

## Relation Queries

### Nested Reads

#### Include a Relation

```ts
const user = await prisma.user.findFirst({
  include: { posts: true },
})
```

#### Include Deeply Nested Relations

```ts
const user = await prisma.user.findFirst({
  include: {
    posts: {
      include: { categories: true },
    },
  },
})
```

#### Select Specific Fields of Relations

```ts
const user = await prisma.user.findFirst({
  select: {
    name: true,
    posts: { select: { title: true } },
  },
})
```

> You cannot use `select` and `include` on the same level. Use nested `select` inside `include` instead.

### Relation Count

```ts
const users = await prisma.user.findMany({
  select: {
    id: true,
    _count: { select: { posts: true } },
  },
})
```

### Nested Writes

#### Create with Related Records

```ts
const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    posts: {
      create: [{ title: "Post 1" }, { title: "Post 2" }],
    },
  },
})
```

#### Connect Existing Records

```ts
await prisma.user.update({
  where: { id: 20 },
  data: {
    posts: { connect: { id: 4 } },
  },
})
```

#### Connect or Create

```ts
await prisma.post.create({
  data: {
    title: "My first post",
    categories: {
      connectOrCreate: {
        where: { name: "Introductions" },
        create: { name: "Introductions" },
      },
    },
  },
})
```

#### Disconnect Relations

```ts
await prisma.user.update({
  where: { id: 20 },
  data: {
    posts: { disconnect: { id: 4 } },
  },
})
```

#### Set Relations (Replace All)

```ts
await prisma.user.update({
  where: { id: 20 },
  data: {
    posts: { set: [{ id: 1 }, { id: 2 }] },
  },
})
```

### Fluent API

Traverse relations programmatically:

```ts
const user = await prisma.user
  .findUnique({ where: { id: 1 } })
  .posts()
```

### Relation Load Strategies (Preview)

Enable `relationJoins` preview feature:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "./generated"
  previewFeatures = ["relationJoins"]
}
```

```ts
const users = await prisma.user.findMany({
  relationLoadStrategy: "join", // or 'query'
  include: { posts: true },
})
```

- `join` (default): LATERAL JOIN (PostgreSQL) or correlated subqueries (MySQL), single query
- `query`: Multiple queries, joined at application level

---

## Aggregation, Grouping, and Summarizing

### Count

```ts
const userCount = await prisma.user.count()
const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
```

### Aggregate

```ts
const aggregates = await prisma.user.aggregate({
  _count: { _all: true },
  _avg: { profileViews: true },
  _sum: { profileViews: true },
  _min: { profileViews: true },
  _max: { profileViews: true },
})
```

### Group By

```ts
const groupBy = await prisma.user.groupBy({
  by: ["role"],
  _count: { _all: true },
  _avg: { profileViews: true },
})
```

### Distinct

```ts
const distinctUsers = await prisma.user.findMany({
  distinct: ["name"],
  select: { name: true },
})
```

---

## Transactions

### Nested Writes

Automatically wrapped in a transaction:

```ts
const user = await prisma.user.create({
  data: {
    email: "alice@prisma.io",
    posts: {
      create: [{ title: "Post 1" }, { title: "Post 2" }],
    },
  },
})
```

### Sequential Operations (`$transaction([])`)

```ts
const [posts, totalPosts] = await prisma.$transaction([
  prisma.post.findMany({ where: { title: { contains: "prisma" } } }),
  prisma.post.count(),
])
```

With isolation level:

```ts
await prisma.$transaction(
  [prisma.resource.deleteMany({ where: { name: "name" } }), prisma.resource.createMany({ data })],
  { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
)
```

### Interactive Transactions

```ts
const result = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    data: { balance: { decrement: 100 } },
    where: { email: "alice@prisma.io" },
  })

  if (sender.balance < 0) {
    throw new Error("Insufficient funds")
  }

  return await tx.account.update({
    data: { balance: { increment: 100 } },
    where: { email: "bob@prisma.io" },
  })
})
```

With options:

```ts
await prisma.$transaction(
  async (tx) => { /* ... */ },
  {
    maxWait: 5000,       // Max wait to acquire transaction (default: 2000ms)
    timeout: 10000,      // Max transaction run time (default: 5000ms)
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  },
)
```

### Batch Operations

These bulk operations run as transactions:
- `createMany()` / `createManyAndReturn()`
- `updateMany()` / `updateManyAndReturn()`
- `deleteMany()`

### Isolation Levels

| Database | ReadUncommitted | ReadCommitted | RepeatableRead | Snapshot | Serializable |
|----------|----------------|---------------|----------------|----------|--------------|
| PostgreSQL | ✅ | ✅ | ✅ | No | ✅ |
| MySQL | ✅ | ✅ | ✅ | No | ✅ |
| SQL Server | ✅ | ✅ | ✅ | ✅ | ✅ |
| CockroachDB | No | No | No | No | ✅ |
| SQLite | No | No | No | No | ✅ |

Default isolation levels: PostgreSQL=`ReadCommitted`, MySQL=`RepeatableRead`, SQL Server=`ReadCommitted`, CockroachDB=`Serializable`, SQLite=`Serializable`

### Transaction Timing Issues

When concurrent transactions cause write conflicts at `ReadCommitted` isolation, use `Serializable` isolation with retry logic:

```ts
import { Prisma, PrismaClient } from "../prisma/generated/client"

const prisma = new PrismaClient()
const MAX_RETRIES = 5
let retries = 0

while (retries < MAX_RETRIES) {
  try {
    await prisma.$transaction(
      [prisma.user.deleteMany({ where: {} }), prisma.post.createMany({ data: {} })],
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )
    break
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      retries++
      continue
    }
    throw error
  }
}
```

---

## Raw SQL

### `$queryRaw`

Returns query results as typed objects:

```ts
const users = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email}`
```

### `$queryRawUnsafe`

For dynamic SQL (be careful with SQL injection):

```ts
const users = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE id = ${userId}`)
```

### `$executeRaw`

Execute raw SQL without returning rows:

```ts
await prisma.$executeRaw`DELETE FROM User WHERE email = ${email}`
```

### `$executeRawUnsafe`

```ts
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName}`)
```

### TypedSQL

Type-safe raw SQL queries compatible with Prisma Client:

```ts
// Define in .sql files, generate types with prisma generate
const result = await prisma.$queryRawTyped(getUserById)(1)
```

---

## Client Extensions

Extend Prisma Client functionality with extensions.

### Client Extension (add methods to Prisma Client)

```ts
const prismaWithExtension = prisma.$extends({
  client: {
    async logAllUsers() {
      const users = await this.user.findMany()
      console.log(users)
    },
  },
})
```

### Model Extension (add methods to models)

```ts
const extendedPrisma = prisma.$extends({
  model: {
    user: {
      async signUp(email: string) {
        return prisma.user.create({ data: { email } })
      },
    },
  },
})
```

### Query Extension (intercept queries)

```ts
const extendedPrisma = prisma.$extends({
  query: {
    user: {
      async findMany({ model, operation, args, query }) {
        // Add default filtering
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
})
```

### Result Extension (transform results)

```ts
const extendedPrisma = prisma.$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})
```

### Shared Extensions

```ts
// extensions/softDelete.ts
export const softDelete = Prisma.defineExtension({
  query: {
    $allOperations: {
      async handle({ model, operation, args, query }) {
        if (operation === "delete" && model) {
          return prisma[model].update({
            ...args,
            data: { deletedAt: new Date() },
          })
        }
        return query(args)
      },
    },
  },
})

// Usage
const prisma = new PrismaClient().$extends(softDelete)
```

---

## Special Fields and Types

### JSON Fields

```ts
// Create
await prisma.user.create({
  data: { email: "a@b.c", metadata: { key: "value" } },
})

// Read
const user = await prisma.user.findFirst({
  where: { metadata: { path: ["key"], equals: "value" } },
})

// Filter
const users = await prisma.user.findMany({
  where: { metadata: { path: ["nested", "key"], string_contains: "search" } },
})
```

### Scalar Lists / Arrays

```prisma
model User {
  id    Int      @id @default(autoincrement())
  tags  String[]
  nums  Int[]
}
```

```ts
await prisma.user.create({
  data: { tags: ["tag1", "tag2"], nums: [1, 2, 3] },
})

const users = await prisma.user.findMany({
  where: { tags: { has: "tag1" } },
})
```

### Composite IDs and Unique Constraints

```prisma
model User {
  firstName String
  lastName  String
  @@id([firstName, lastName])
  @@unique([firstName, lastName])
}
```

```ts
const user = await prisma.user.findUnique({
  where: { firstName_lastName: { firstName: "Alice", lastName: "Smith" } },
})
```

### Null and Undefined

- `null`: Sets the field to NULL in the database
- `undefined`: Field is ignored (not included in the query)

```ts
// Sets name to NULL
await prisma.user.update({ where: { id: 1 }, data: { name: null } })

// Leaves name unchanged
await prisma.user.update({ where: { id: 1 }, data: { name: undefined } })
```

### Omit Fields

```ts
const extendedPrisma = prisma.$extends({
  result: {
    user: {
      password: { omit: true },
    },
  },
})
```

### Composite Types (MongoDB)

```prisma
model User {
  id     String  @id @default(auto()) @map("_id") @db.ObjectId
  name   String
  address Address
}

type Address {
  street String
  city   String
  zip    String
}
```

---

## Prisma CLI Commands

### `prisma init`

Initialize a new Prisma project:

```bash
npx prisma init --datasource-provider postgresql
```

### `prisma generate`

Generate Prisma Client from schema:

```bash
npx prisma generate
```

### `prisma migrate dev`

Create and apply migrations in development:

```bash
npx prisma migrate dev --name init
```

### `prisma migrate deploy`

Apply pending migrations in production:

```bash
npx prisma migrate deploy
```

### `prisma migrate status`

Check migration status:

```bash
npx prisma migrate status
```

### `prisma migrate reset`

Reset database and apply all migrations (data loss!):

```bash
npx prisma migrate reset
```

### `prisma migrate resolve`

Resolve migration issues:

```bash
npx prisma migrate resolve --applied 20210101000000_init
```

### `prisma migrate diff`

Compare schemas between sources:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma
```

### `prisma db pull`

Introspect existing database into schema:

```bash
npx prisma db pull
```

### `prisma db push`

Push schema to database without migrations (prototyping):

```bash
npx prisma db push
```

### `prisma db execute`

Execute raw SQL commands:

```bash
npx prisma db execute --file ./script.sql --schema prisma/schema.prisma
```

### `prisma db seed`

Seed database with data:

```bash
npx prisma db seed
```

### `prisma format`

Format and validate schema:

```bash
npx prisma format
```

### `prisma validate`

Validate schema for errors:

```bash
npx prisma validate
```

### `prisma studio`

Launch Prisma Studio GUI:

```bash
npx prisma studio
```

### `prisma version`

Display version information:

```bash
npx prisma version
```

### `prisma debug`

Display debug information:

```bash
npx prisma debug
```

---

## Prisma Studio

Visual database editor for browsing and editing data.

```bash
npx prisma studio
```

Features:
- Browse records with pagination
- Filter and sort data
- Edit records inline
- View and edit relations
- Available in browser, VS Code, and embeddable

### Embed Studio

```ts
import { PrismaStudio } from "@prisma/studio"

// Embed in your own application
```

---

## Observability and Logging

### Logging

```ts
const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "stdout" },
    { level: "info", emit: "stdout" },
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ],
})
```

### Event-Based Logging

```ts
const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "event" },
  ],
})

prisma.$on("query", (e) => {
  console.log("Query: " + e.query)
  console.log("Params: " + e.params)
  console.log("Duration: " + e.duration + "ms")
})
```

### SQL Comments

Add metadata to SQL queries for observability:

```ts
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
})
// SQL comments enabled via preview feature or config
```

### OpenTelemetry Tracing

```ts
import { registerOTel } from "@prisma/instrumentation"
registerOTel({ serviceName: "my-app" })
```

---

## Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| P2002 | Unique constraint violation |
| P2003 | Foreign key constraint violation |
| P2014 | Invalid required relation |
| P2015 | Record not found |
| P2018 | Required related record not found |
| P2021 | Table does not exist |
| P2024 | Timed out acquiring transaction |
| P2025 | Record to update/delete not found |
| P2034 | Transaction write conflict / deadlock (retry) |

### Handling Errors

```ts
import { Prisma } from "@prisma/client"

try {
  await prisma.user.create({ data: { email: "existing@prisma.io" } })
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      console.log("Unique constraint violation:", e.meta?.target)
    }
  }
}
```

---

## Type Safety

### Generated Types

Prisma generates types from your schema:

```ts
import { Prisma, User, Post } from "./generated/client"

// Prisma.UserWhereInput, Prisma.UserCreateInput, etc.
// User (model type), Post (model type)
```

### Operating Against Partial Structures

```ts
import { Prisma } from "./generated/client"

type UserPayload = Prisma.UserGetPayload<{
  select: { id: true; email: true; posts: { select: { title: true } } }
}>
// { id: number; email: string; posts: { title: string }[] }
```

### PrismaPromise

All Prisma Client queries return a `PrismaPromise` that can be used in transactions:

```ts
const queries: Prisma.PrismaPromise<any>[] = [
  prisma.user.findMany(),
  prisma.post.count(),
]
const [users, count] = await prisma.$transaction(queries)
```

---

## Testing

### Unit Testing

Use `jest-mock-extended` or similar to mock Prisma Client:

```ts
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended"
import { PrismaClient } from "./generated/client"

export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()
```

### Integration Testing

Use Docker to spin up a test database:

```ts
import { exec } from "child_process"

beforeAll(async () => {
  // Start test database
  exec("docker-compose up -d test-db")
  // Run migrations
  exec("npx prisma migrate deploy")
})
```

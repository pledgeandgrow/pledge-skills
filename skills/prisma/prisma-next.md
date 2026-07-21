# Prisma Next (Early Access)

## Introduction

Prisma Next is the next major version of Prisma ORM, available in Early Access. It is a ground-up TypeScript rewrite that keeps the schema-first workflow while making it extensible, composable, and AI-agent friendly.

### Scaffold a New Project

```bash
# bun
bunx create-prisma@next

# pnpm
pnpm dlx create-prisma@next

# yarn
yarn dlx create-prisma@next

# npm
npx create-prisma@next
```

### Quickstarts

- **PostgreSQL**: Create a Prisma Next app, initialize the database, seed data, and run the first query
- **MongoDB**: Create a Prisma Next app with a local MongoDB replica set or your own MongoDB deployment
- **Add to PostgreSQL**: Add Prisma Next to an existing PostgreSQL app with `prisma-next init`
- **Add to MongoDB**: Add Prisma Next to an existing MongoDB app
- **Prisma Postgres**: Create a Prisma Next app backed by Prisma Postgres

### Supported Databases

- **PostgreSQL** (primary target, on track for GA)
- **MongoDB** (first-class support)
- **SQLite** (next SQL target on deck)
- **MySQL** (to follow)

### Why Prisma Next

Prisma's current architecture tightly couples three layers: the schema language, the generated client, and runtime execution. Prisma Next rebuilds the data layer around a contract-first model with a small, extensible core:

- **Better queries**: cleaner API with simpler nested queries, custom collection methods on models, streaming results, plus a low-level type-safe SQL query builder
- **Extensible by design**: minimal core exposed through a public SPI; everything around it (including Postgres support itself) is an extension
- **Rethought migrations**: graph-based migrations that resolve branch conflicts automatically and make partial failures safe to retry; schema and data migrations written in TypeScript and validated against your contract
- **AI-agent friendly**: schema compiles to a machine-readable contract, every query produces a structured inspectable plan, middleware adds compile-time guardrails; installers register agent skills

### How It Works

Prisma Next is contract-first:

1. **Author your schema**: define models in a Prisma schema (`.prisma`) or directly in TypeScript
2. **Emit the contract**: a lightweight build step turns the schema into a deterministic JSON contract plus TypeScript types
3. **Query with a composable DSL**: write queries inline against the typed contract; each compiles to a verifiable plan at runtime

---

## The Data Contract

The data contract is the single description of your data model and its storage layout. Everything in Prisma Next is typed, planned, and verified against it.

### Contract vs. Schema

- **Contract**: what you write in your code (models, fields, relations)
- **Schema**: your database's actual structure

Prisma Next checks that the database's schema satisfies the contract.

### How It Works

Declare one contract source in `prisma-next.config.ts`:

```typescript
import { defineConfig } from "@prisma-next/postgres/config"

export default defineConfig({
  contract: "./prisma/contract.prisma",
})
```

Emit artifacts:

```bash
npx prisma-next contract emit
```

This writes `contract.json` (canonical JSON description) and `contract.d.ts` (TypeScript types). Both are deterministic — the same source always produces byte-identical output.

### What the Contract Contains

- Models, fields, and relations, plus how they map to tables and columns
- Storage details: primary keys, unique constraints, indexes, foreign keys
- Named types, enums, and value objects
- Types and capabilities contributed by extension packs
- Content hashes that identify this exact version of the schema

It contains no rows, no credentials, and no connection details. Committing source and emitted artifacts to version control is safe and expected.

### Two Authoring Modes

- **PSL** (preferred): compact language purpose-built for describing data; what `create-prisma` scaffolds
- **TypeScript builder** (escape hatch): for cases where model definitions must be composed, generated, or shared as TypeScript modules

Both modes emit the same `contract.json`. A project declares exactly one source of truth.

---

## Contract Authoring — PSL Syntax

PSL is the preferred way to author the Prisma Next data contract. Write a Prisma schema file (usually `prisma/contract.prisma`), and `prisma-next contract emit` turns it into artifacts.

### Complete Contract Example

#### PostgreSQL

```prisma
// use prisma-next

types {
  Uuid = String @db.Uuid
}

type Address {
  street  String
  city    String
  zip     String?
  country String
}

enum Priority {
  @@type("pg/text@1")
  Low    = "low"
  High   = "high"
  Urgent = "urgent"
}

model User {
  id        Uuid     @id @default(uuid())
  email     String
  createdAt DateTime @default(now())
  address   Address?
  posts     Post[]

  @@map("user")
}

model Post {
  id        Uuid     @id @default(uuid())
  title     String
  userId    Uuid
  priority  Priority @default(Low)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("post")
}
```

#### MongoDB

```prisma
// use prisma-next

type Address {
  street  String
  city    String
  zip     String?
  country String
}

enum UserRole {
  @@type("mongo/string@1")
  Admin  = "admin"
  Author = "author"
  Reader = "reader"
}

model User {
  id      ObjectId @id @map("_id")
  name    String
  email   String
  bio     String?
  role    UserRole
  address Address?
  posts   Post[]

  @@map("users")
}

model Post {
  id        ObjectId @id @map("_id")
  title     String
  content   String
  authorId  ObjectId
  createdAt DateTime

  author User @relation(fields: [authorId], references: [id])

  @@index([authorId])
  @@map("posts")
}
```

### Models and Fields

- `@id` marks the primary key; `@@id([a, b])` declares a composite key
- `@unique` adds a unique constraint; `@@index([...])` declares a secondary index
- `@default(...)` sets a default (database function defaults become column defaults; generated defaults are applied by Prisma Next before each write)
- `@map("column_name")` sets a field's physical name; `@@map("table_name")` sets the table/collection name

### Named Types

```prisma
types {
  Uuid = String @db.Uuid
}
```

### Enums

```prisma
enum Priority {
  @@type("pg/text@1")
  Low    = "low"
  High   = "high"
  Urgent = "urgent"
}
```

`@@type` declares the storage codec. When a member has no explicit value, the member name itself is stored. The emitted contract enforces allowed values with a `CHECK` constraint.

### Value Objects

```prisma
type Address {
  street  String
  city    String
  zip     String?
  country String
}

model User {
  id      Uuid     @id @default(uuid())
  address Address?
}
```

Storage follows the database: PostgreSQL stores in a `jsonb` column; MongoDB stores as an embedded document.

### Relations

```prisma
model Post {
  userId Uuid
  user   User @relation(fields: [userId], references: [id])
}

model User {
  posts Post[]
}
```

Many-to-many through an explicit join model:

```prisma
model Post {
  tags Tag[]
}

model Tag {
  posts Post[]
}

model PostTag {
  postId Uuid
  tagId  Uuid

  post Post @relation(fields: [postId], references: [id])
  tag  Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
  @@map("post_tag")
}
```

### Base Models and Variants (Table Inheritance)

```prisma
model Task {
  id     Uuid   @id @default(uuid())
  title  String
  type   String

  @@discriminator(type)
  @@map("task")
}

model Bug {
  severity     String
  stepsToRepro String?

  @@base(Task, "bug")
  @@map("bug")
}
```

Rows with `type = "bug"` are `Bug` records. On PostgreSQL, the variant's `@@map` picks its storage layout: with its own `@@map`, fields live in their own table sharing the base's primary key; without one, they live in the base table as nullable columns. On MongoDB, variants add fields to documents in the base model's collection.

### Extension Types

```typescript
// prisma-next.config.ts
import pgvector from "@prisma-next/extension-pgvector/control"
import { defineConfig } from "@prisma-next/postgres/config"

export default defineConfig({
  contract: "./prisma/contract.prisma",
  extensions: [pgvector],
})
```

```prisma
types {
  Embedding1536 = pgvector.Vector(1536)
}

model Post {
  id        Uuid           @id @default(uuid())
  embedding Embedding1536?
}
```

### Starting from an Existing Database

```bash
npx prisma-next contract infer --db "$DATABASE_URL" --output ./prisma/contract.prisma
```

---

## Contract Authoring — TypeScript Builder

Define the contract with `defineContract` builder in `prisma/contract.ts`. Same models, same artifacts, no separate language.

### When to Choose TypeScript over PSL

Reach for it when:
- Model definitions must be split, composed, or reused across TypeScript modules
- Parts of the schema are assembled programmatically

### PostgreSQL Example

```typescript
import pgvector from "@prisma-next/extension-pgvector/pack"
import { defineContract, enumType, member, rel } from "@prisma-next/postgres/contract-builder"

const pgText = { codecId: "pg/text@1", nativeType: "text" } as const

const Priority = enumType(
  "Priority",
  pgText,
  member("Low", "low"),
  member("High", "high"),
  member("Urgent", "urgent"),
)

export const contract = defineContract(
  { extensionPacks: { pgvector } },
  ({ field, model, type }) => {
    const types = {
      Embedding1536: type.pgvector.Vector(1536),
    } as const

    const User = model("User", {
      fields: {
        id: field.id.uuidv4String(),
        email: field.text(),
        createdAt: field.temporal.createdAt(),
        updatedAt: field.temporal.updatedAt(),
        address: field.json().optional(),
      },
    })

    const Post = model("Post", {
      fields: {
        id: field.id.uuidv4String(),
        title: field.text(),
        userId: field.uuidString(),
        priority: field.namedType(Priority).default(Priority.members.Low),
        createdAt: field.temporal.createdAt(),
        updatedAt: field.temporal.updatedAt(),
        embedding: field.namedType(types.Embedding1536).optional(),
      },
    })

    return {
      enums: { Priority },
      types,
      models: {
        User: User.relations({
          posts: rel.hasMany(Post, { by: "userId" }),
        }).sql({ table: "user" }),
        Post: Post.relations({
          user: rel.belongsTo(User, { from: "userId", to: "id" }),
        }).sql(({ cols, constraints }) => ({
          table: "post",
          foreignKeys: [
            constraints.foreignKey(cols.userId, User.refs.id, {
              name: "post_userId_fkey",
            }),
          ],
        })),
      },
    }
  },
)
```

### MongoDB Example

```typescript
import { defineContract, field, model, rel } from "@prisma-next/mongo/contract-builder"

const User = model("User", {
  collection: "users",
  fields: {
    _id: field.objectId(),
    name: field.string(),
    email: field.string(),
    bio: field.string().optional(),
  },
  relations: {
    posts: rel.hasMany("Post", { from: "_id", to: "authorId" }),
  },
})

const Post = model("Post", {
  collection: "posts",
  fields: {
    _id: field.objectId(),
    authorId: field.objectId(),
    title: field.string(),
    publishedAt: field.date().optional(),
  },
  relations: {
    author: rel.belongsTo(User, { from: "authorId", to: User.ref("_id") }),
  },
})

export const contract = defineContract({ models: { User, Post } })
```

### Field Builders

- `field.text()`, `field.uuidString()`, `field.json()` for scalar fields
- `field.id.uuidv4String()` for UUID primary key with client-generated default
- `field.temporal.createdAt()` and `field.temporal.updatedAt()` for managed timestamps
- `field.namedType(x)` for enums and declared named types
- Modifiers: `.optional()`, `.default(value)`, `.defaultSql(expression)`, `.unique()`, `.id()`, `.column("name")`

### Relations

```typescript
User.relations({ posts: rel.hasMany(Post, { by: "userId" }) })
Post.relations({ user: rel.belongsTo(User, { from: "userId", to: "id" }) })
```

`rel.hasOne` and `rel.manyToMany` cover remaining shapes.

---

## Fundamentals — Reading Data

Fetch one record or many, then filter, select, sort, paginate, and stream.

### Fetch Many or One

```typescript
import { db } from "./prisma/db"

// Every published post
const posts = await db.orm.public.Post.where({ published: true }).all()

// One user, or null
const user = await db.orm.public.User.where({ email: "alice@prisma.io" }).first()
```

Models are addressed by schema namespace on PostgreSQL (`db.orm.public.User`) and by collection name on MongoDB (`db.orm.users`).

For Prisma 7 users:

```diff
- const posts = await prisma.post.findMany({ where: { published: true } })
+ const posts = await db.orm.public.Post.where({ published: true }).all()

- const user = await prisma.user.findUnique({ where: { email } })
+ const user = await db.orm.public.User.where({ email }).first()
```

### Primary Key Lookup

```typescript
// PostgreSQL
const user = await db.orm.public.User.first({ id: userId })

// MongoDB
const user = await db.orm.users.where({ _id: id }).first()
```

### Filter Records

Object form (equality):

```typescript
const drafts = await db.orm.public.Post.where({ published: false }).all()
```

Lambda form (richer comparisons, PostgreSQL only):

```typescript
const recentPosts = await db.orm.public.Post
  .where((p) => p.createdAt.gte(start))
  .where((p) => p.createdAt.lte(end))
  .all()
```

### Filter Operators (PostgreSQL)

Field proxy supports: `.eq`, `.neq`, `.lt`, `.lte`, `.gt`, `.gte`, `.like`, `.ilike`, `.in([...])`, `.isNull()`, `.isNotNull()`

```typescript
// Case-insensitive text search
const matchingPosts = await db.orm.public.Post
  .where((p) => p.title.ilike("%prisma%"))
  .all()

// One of several values
const team = await db.orm.public.User
  .where((u) => u.email.in(["alice@prisma.io", "bob@prisma.io"]))
  .all()
```

OR/NOT with helpers:

```typescript
import { or } from "@prisma-next/sql-orm-client"

const highlighted = await db.orm.public.Post
  .where((p) => or(p.title.ilike("%hello%"), p.title.ilike("%prisma%")))
  .all()
```

### Filter Operators (MongoDB)

On MongoDB, `.where(...)` does not take a lambda. Use object form or the pipeline builder's `.match(...)`:

```typescript
// Object form
const drafts = await db.orm.posts.where({ published: false }).all()

// Pipeline builder with ranges
const runtime = await db.runtime()
const plan = db.query
  .from("posts")
  .match((f) => f.createdAt.gte(new Date("2026-06-01")))
  .match((f) => f.createdAt.lte(new Date("2026-07-01")))
  .build()
const junePosts = await runtime.execute(plan)
```

### Select Fields

```typescript
// PostgreSQL
const users = await db.orm.public.User.select("id", "email").all()

// MongoDB
const users = await db.orm.users.select("_id", "email").all()
```

### Sort and Paginate

```typescript
// PostgreSQL — second page, newest first
const page = await db.orm.public.Post
  .orderBy((p) => p.createdAt.desc())
  .take(20)
  .skip(20)
  .all()

// MongoDB
const page = await db.orm.posts
  .orderBy({ createdAt: -1 })
  .take(20)
  .skip(20)
  .all()
```

Composite sort on PostgreSQL:

```typescript
const posts = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .all()
```

Cursor-based pagination (PostgreSQL):

```typescript
const page1 = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .take(20)
  .all()

const last = page1[page1.length - 1]!
const page2 = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .cursor({ createdAt: last.createdAt, id: last.id })
  .take(20)
  .all()
```

### Count Records

```typescript
const result = await db.orm.public.Post
  .where({ published: true })
  .aggregate((a) => ({ total: a.count() }))
// { total: 2 }
```

On MongoDB, count with a `$group` stage in the pipeline builder.

### Stream Large Results

Query results are both a promise and an async iterator:

```typescript
// await — buffers all records into an array
const posts = await db.orm.public.Post.all()

// for await — streams records one at a time
for await (const post of db.orm.public.Post.all()) {
  await exportToSearchIndex(post)
}
```

A streamed result can only be read once. If you need data more than once, `await` into an array.

### Common Mistakes

- Use `.first()` instead of `.all()[0]` — `.first()` fetches at most one row
- `.all()` has no limit — add `.take(n)` when you don't need every record
- Don't reuse a streamed result — store data in an array if needed twice

---

## Fundamentals — Writing Data

### Create One Record

```typescript
// PostgreSQL
const user = await db.orm.public.User.create({
  email: "jane@prisma.io",
  name: "Jane",
})
// user.id and user.createdAt are filled in

// MongoDB
const user = await db.orm.users.create({
  email: "jane@prisma.io",
  name: "Jane",
  createdAt: new Date(),
})
```

With `.select(...)` to narrow return shape:

```typescript
const account = await db.orm.public.User
  .select("id", "email")
  .create({ email: "jane@prisma.io", name: "Jane" })
```

No `data` wrapper (unlike Prisma 7):

```diff
- await prisma.user.create({ data: { email, name } })
+ await db.orm.public.User.create({ email, name })
```

### Update One Record

```typescript
const updatedUser = await db.orm.public.User
  .where({ email: "jane@prisma.io" })
  .update({ name: "Jane Doe" })
```

`.update(...)` changes **one** matching record. Use `updateAll` or `updateCount` for every match.

### Delete One Record

```typescript
const deletedUser = await db.orm.public.User
  .where({ email: "jane@prisma.io" })
  .delete()
```

### Upsert

```typescript
// PostgreSQL — matched on unique fields
await db.orm.public.User.upsert({
  create: { email: "eve@prisma.io", name: "Eve" },
  update: { name: "Eve Exists" },
})

// MongoDB — put match in .where() before .upsert()
await db.orm.users.where({ email: "eve@prisma.io" }).upsert({
  create: { email: "eve@prisma.io", name: "Eve", createdAt: new Date() },
  update: { name: "Eve Exists" },
})
```

### Write Many Records (Bulk)

| Form | Affects | Returns |
|------|---------|---------|
| `create`, `update`, `delete` | one record | the affected record |
| `createAll`, `updateAll`, `deleteAll` | every match | the affected records |
| `createCount`, `updateCount`, `deleteCount` | every match | the number affected |

```typescript
// Insert many
const newPosts = await db.orm.public.Post.createAll([
  { title: "One", content: null, published: false, authorId: user.id },
  { title: "Two", content: null, published: false, authorId: user.id },
])

// Update every match
const updatedCount = await db.orm.public.Post
  .where({ published: false })
  .updateCount({ published: true })

// Delete every match
const deletedCount = await db.orm.public.Post
  .where((p) => p.title.ilike("draft%"))
  .deleteCount()
```

### Common Mistakes

- `.update()` and `.delete()` only affect one record even when filter matches many — use bulk variants
- No `data` wrapper — pass fields directly
- `.update()` and `.delete()` require `.where()` first — no accidental "delete any record"
- Use transactions for related writes that must succeed together

---

## Fundamentals — Relations and Joins

### Include Related Records

```typescript
// PostgreSQL
const posts = await db.orm.public.Post
  .where({ published: true })
  .include("author")
  .all()
// posts[0].author is the full User record

// MongoDB
const posts = await db.orm.posts
  .where({ published: true })
  .include("author")
  .all()
```

### One-to-One

```prisma
model Profile {
  id     String @id @default(cuid(2))
  bio    String
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

```typescript
const profileWithUser = await db.orm.public.Profile
  .where({ userId: user.id })
  .include("user")
  .first()
```

### One-to-Many

```typescript
// Each user with their posts
const usersWithPosts = await db.orm.public.User.include("posts").all()

// Each post with its author
const postsWithAuthors = await db.orm.public.Post.include("author").all()
```

Shape relation returns with a callback:

```typescript
const usersWithRecentPosts = await db.orm.public.User
  .select("id", "email")
  .include("posts", (post) =>
    post
      .select("id", "title", "createdAt")
      .orderBy((p) => p.createdAt.desc())
      .take(5),
  )
  .take(10)
  .all()
```

### Many-to-Many

Model the junction explicitly:

```prisma
model Tag {
  id    String    @id @default(cuid(2))
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  id     String @id @default(cuid(2))
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id])
  tag    Tag    @relation(fields: [tagId], references: [id])
}
```

Traverse both hops:

```typescript
const postsWithTags = await db.orm.public.Post
  .where({ published: true })
  .include("tags", (postTag) => postTag.include("tag"))
  .all()
```

Connect records:

```typescript
await db.orm.public.PostTag.create({ postId: post.id, tagId: tag.id })
```

### Filter by Relation Data (PostgreSQL)

```typescript
// Users who have at least one published post
const activeAuthors = await db.orm.public.User
  .where((u) => u.posts.some((p) => p.published.eq(true)))
  .all()

// Posts that carry a specific tag
const taggedPosts = await db.orm.public.Post
  .where((p) => p.tags.some((pt) => pt.tagId.eq(tag.id)))
  .all()
```

`.some(...)`, `.none(...)`, `.every(...)` for relation filtering.

### PostgreSQL vs MongoDB

- PostgreSQL: fetches included relations with joins
- MongoDB: uses `$lookup` for reference-style relations; embedded documents come back automatically

### Current Limitations

- Implicit many-to-many not supported by `.include()` — model junction explicitly
- One-to-one relation field only on the side that holds the foreign key
- Include refinement callback tested on PostgreSQL; use pipeline builder on MongoDB

---

## Fundamentals — Transactions

### Run Writes in a Transaction

```typescript
const result = await db.transaction(async (tx) => {
  const user = await tx.orm.public.User.create({ email: "jane@prisma.io", name: "Jane" })
  const post = await tx.orm.public.Post.create({
    title: "Hello",
    content: null,
    published: false,
    authorId: user.id,
  })
  return { userId: user.id, postId: post.id }
})
```

### Roll Back on Errors

The transaction commits when the callback returns and rolls back when it throws.

```typescript
try {
  await db.transaction(async (tx) => {
    await tx.orm.public.User.create({ email: "ghost@prisma.io", name: "Ghost" })
    throw new Error("boom")
  })
} catch {
  // The user record was rolled back
}
```

### SQL Builder in a Transaction

```typescript
await db.transaction(async (tx) => {
  const plan = tx.sql.public.post
    .update({ published: false })
    .where((f, fns) => fns.lt(f.createdAt, cutoff))
    .build()
  await tx.execute(plan)
})
```

### MongoDB Transactions

Prisma Next does not support MongoDB transactions yet. Use the MongoDB driver directly with a shared `MongoClient`:

```typescript
import { client, db } from "./prisma/db"

const session = client.startSession()
try {
  await session.withTransaction(async () => {
    const database = client.db("app")
    await database.collection("users").insertOne(
      { email: "jane@prisma.io", name: "Jane", createdAt: new Date() },
      { session },
    )
    await database.collection("posts").insertOne(
      { title: "Hello", content: null, published: false, authorId: user.insertedId, createdAt: new Date() },
      { session },
    )
  })
} finally {
  await session.endSession()
}
```

### Common Mistakes

- Don't run side effects (emails, jobs) inside the transaction — run them after commit
- Use `tx.orm` not `db.orm` inside the callback
- No `$transaction([array])` — use the callback form instead

---

## Fundamentals — Advanced Queries

### PostgreSQL: SQL Query Builder

Use when the query is easier to say in SQL: joins with conditions, computed columns, set-shaped results, `RETURNING` on bulk inserts, precise aggregation control.

#### Build and Run a Plan

```typescript
const plan = db.sql.public.post
  .select("id", "title", "authorId")
  .where((f, fns) => fns.eq(f.published, true))
  .limit(10)
  .build()

const publishedPosts = await db.runtime().execute(plan)
```

#### Join Tables

```typescript
const plan = db.sql.public.post
  .as("p")
  .innerJoin(db.sql.public.user.as("u"), (f, fns) => fns.eq(f.p.authorId, f.u.id))
  .select((f) => ({
    postId: f.p.id,
    title: f.p.title,
    authorEmail: f.u.email,
  }))
  .where((f, fns) => fns.eq(f.p.published, true))
  .limit(10)
  .build()

const postsWithAuthors = await db.runtime().execute(plan)
```

Multi-hop through a junction table:

```typescript
const plan = db.sql.public.post_tag
  .as("pt")
  .innerJoin(db.sql.public.tag.as("t"), (f, fns) => fns.eq(f.pt.tagId, f.t.id))
  .innerJoin(db.sql.public.post.as("p"), (f, fns) => fns.eq(f.pt.postId, f.p.id))
  .select((f) => ({ postTitle: f.p.title, tagName: f.t.name }))
  .build()

const postTagPairs = await db.runtime().execute(plan)
```

#### Group and Rank

```typescript
const plan = db.sql.public.post
  .select((f, fns) => ({
    authorId: f.authorId,
    posts: fns.count(),
  }))
  .groupBy((f) => f.authorId)
  .orderBy((f, fns) => fns.count(), { direction: "desc" })
  .limit(5)
  .build()

const topAuthors = await db.runtime().execute(plan)
```

#### Write with RETURNING

```typescript
const plan = db.sql.public.user
  .insert([{ email: "sql@prisma.io" }])
  .returning("id", "email")
  .build()

const [insertedUser] = await db.runtime().execute(plan)
```

#### Raw SQL Fragments

```typescript
const plan = db.sql.public.user
  .select("id", "email")
  .select("upperEmail", (f, fns) => fns.raw`UPPER(${f.email})`.returns("pg/text@1"))
  .limit(10)
  .build()

const users = await db.runtime().execute(plan)
```

Interpolated values are AST nodes, not string splices — safe from injection.

### MongoDB: Pipeline Builder

Use for aggregations (counts, grouping, summaries), `$lookup` joins, multi-stage filtering, and operators the ORM `.where()` doesn't cover yet.

#### Build and Run a Pipeline

```typescript
import { acc } from "@prisma-next/mongo-query-builder"

const runtime = await db.runtime()

const plan = db.query
  .from("posts")
  .group((f) => ({
    _id: f.authorId,
    postCount: acc.count(),
  }))
  .sort({ postCount: -1 })
  .build()

const postsByAuthor = await runtime.execute(plan)
```

#### Filter and Group in Stages

```typescript
const plan = db.query
  .from("posts")
  .match((f) => f.published.eq(false))
  .group((f) => ({ _id: f.authorId, draftCount: acc.count() }))
  .build()

const draftsByAuthor = await runtime.execute(plan)
```

#### Join with $lookup

```typescript
const plan = db.query
  .from("posts")
  .match((f) => f.published.eq(true))
  .lookup((from) =>
    from("users")
      .on((local, foreign) => ({ local: local.authorId, foreign: foreign._id }))
      .as("author"),
  )
  .build()

const postsWithAuthors = await runtime.execute(plan)
```

### Choosing the Right Query API

| You need | Use |
|----------|-----|
| CRUD, filtered reads, relation traversal | ORM API |
| Joins with conditions, computed columns | SQL query builder (PostgreSQL) |
| Aggregations, multi-stage pipelines | Pipeline builder (MongoDB) |
| `RETURNING` on bulk writes | SQL query builder |
| Operators not in ORM `.where()` | Pipeline builder (MongoDB) |

---

## Migrations

### How Migrations Work

The workflow is a loop:

1. **Change your contract**: edit `.prisma`, run `prisma-next contract emit`
2. **Plan a migration**: `prisma-next migration plan --name add_user_phone`
3. **Review it**: read generated TypeScript and DDL preview; edit if needed
4. **Apply it**: `prisma-next migrate`

```bash
npx prisma-next contract emit
npx prisma-next migration plan --name add_user_phone
npx prisma-next migrate
```

### What a Migration Contains

A migration is a directory under `migrations/app/`:

```
migrations/
└── app/
    └── 20260707T1006_add_user_phone/
        ├── migration.ts         # the file you edit
        ├── ops.json             # the file Prisma runs
        ├── migration.json       # where this migration fits in history
        ├── start-contract.json  # snapshot of the contract before
        ├── end-contract.json    # snapshot of the contract after
        └── *-contract.d.ts      # types for those snapshots
```

| File | Purpose |
|------|---------|
| `migration.ts` | The file you edit — describes schema and data changes as TypeScript function calls |
| `ops.json` | The file Prisma runs — compiled migration operations as JSON |
| `migration.json` | Tracks where this migration fits in history |

`migration.ts` contains steps as ordinary TypeScript:

```ts
this.addColumn(...)
this.createTable(...)
this.dataTransform(...)
```

`ops.json` is the compiled form. Production never executes your TypeScript — it reads compiled operations.

### Every Operation Checks Itself

Each operation in `ops.json` runs in three parts:

1. **Precheck**: confirms database is in expected state before the change
2. **Execute**: the statements that make the change
3. **Postcheck**: confirms the change worked after it runs

Operation classes: **Additive** (safe), **Destructive** (can lose data), **Data** (changes rows).

### The Migration Graph

Prisma Next does not treat migrations as one timestamp-ordered list. Each migration records the schema state it starts `from` and the state it moves `to`. Those links form a graph.

#### Key Terms

| Term | Meaning |
|------|---------|
| Contract | The schema you author + `contract.json` artifact |
| Contract state | One exact shape of the schema at a point in history |
| Hash | Short fingerprint of a contract state (like a Git commit hash) |
| Node | A contract state in the graph, identified by its hash |
| Edge | A migration — moves database from one node to another |
| Marker | Record inside the database naming the node it currently matches |
| Ref | Human-readable name for a node, like `prod` |

#### How It Works

Every time you emit your contract, you get a deterministic JSON artifact. Hashing it produces an identifier. Those hashes are the nodes. A migration is an edge recording `from` and `to` hashes.

A database always sits at exactly one node. Its marker holds the hash of the contract it currently matches. Applying a migration means walking one edge and moving the marker.

#### When This Matters

- Two people (or AI agents) change the schema on separate branches and merge
- Rolling a database back to an earlier schema and then forward again
- A database is behind and has to catch up through several changes
- Pointing an environment at an exact schema state

#### Inspecting the Graph

| Question | Command | Needs DB? |
|----------|---------|-----------|
| What does the whole topology look like? | `migration graph` | No |
| Which migration directories exist? | `migration list` | No |
| Where is my database, what is pending? | `migration status` | Yes |
| What has been applied, and when? | `migration log` | Yes |

#### Name States with Refs

```bash
npx prisma-next migration ref add prod --hash f9a41d7
```

#### Rollbacks and Recovery

Rolling back is planning one more migration to a state you've already been in. Recovery is fixing the cause and re-running, safely.

---

## Middleware

Middleware runs your code before and after every query. One policy can cover your whole app.

### Registration

```typescript
import { createCacheMiddleware } from "@prisma-next/middleware-cache"
import postgres from "@prisma-next/postgres/runtime"
import { budgets, lints } from "@prisma-next/sql-runtime"

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
  middleware: [
    createCacheMiddleware({ maxEntries: 1_000 }),
    lints(),
    budgets({ maxRows: 10_000, maxLatencyMs: 1_000 }),
  ],
})
```

### The Five Hooks

| Hook | Purpose |
|------|---------|
| `beforeCompile` | Rewrite the query before it becomes SQL (SQL databases only) |
| `beforeExecute` | Validate or block after SQL is rendered, before database |
| `intercept` | Answer without the database — return `{ rows }` to short-circuit |
| `onRow` | Watch rows as they stream — count, sample, or throw to abort |
| `afterExecute` | Observe the finished query — timing, logging, latency budgets |

Registration order is execution order. If several middleware implement `intercept`, the first one that returns rows wins.

### Built-in Middleware

| Middleware | Import | What it does |
|------------|--------|-------------|
| `budgets` | `@prisma-next/sql-runtime` | Blocks queries that read too many rows; reports latency overruns |
| `lints` | `@prisma-next/sql-runtime` | Blocks or warns on risky query shapes (e.g., `DELETE` without `WHERE`) |
| `cache` | `@prisma-next/middleware-cache` | Serves repeated reads from in-memory store, opted in per query |

### Database Families

- `budgets` and `lints` declare `familyId: 'sql'` — PostgreSQL only
- `cache` declares no `familyId` — works on both PostgreSQL and MongoDB

A middleware that doesn't match the runtime fails at startup with `RUNTIME.MIDDLEWARE_FAMILY_MISMATCH`.

### Error Handling

- Middleware that throws from `beforeCompile`, `beforeExecute`, `intercept`, or `onRow` fails the query
- When the driver fails, `afterExecute` still runs with `result.completed = false`
- Errors from `afterExecute` while handling a failure are swallowed

---

## Extensions

Extensions add database capabilities like vector search, geospatial data, and full-text search.

### Adding an Extension

1. **Install the package**:

```bash
npm install @prisma-next/extension-pgvector
```

2. **Register in config** (contract/migration side):

```typescript
import pgvector from "@prisma-next/extension-pgvector/control"
import { defineConfig } from "@prisma-next/postgres/config"

export default defineConfig({
  contract: "./prisma/contract.prisma",
  extensions: [pgvector],
  db: { connection: process.env["DATABASE_URL"]! },
})
```

3. **Register on client** (runtime side):

```typescript
import pgvector from "@prisma-next/extension-pgvector/runtime"
import postgres from "@prisma-next/postgres/runtime"

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
  extensions: [pgvector],
})
```

4. **Use the new type in schema**:

```prisma
types {
  Embedding1536 = pgvector.Vector(1536)
}

model Post {
  id        String         @id @default(uuid())
  title     String
  embedding Embedding1536?
}
```

5. **Apply and query**:

```typescript
const plan = db.sql.public.post
  .select("id", "title")
  .select("distance", (f, fns) => fns.cosineDistance(f.embedding, queryVector))
  .orderBy((f, fns) => fns.cosineDistance(f.embedding, queryVector), { direction: "asc" })
  .limit(10)
  .build()

const similar = await db.runtime().execute(plan)
```

### Available Extensions

| Extension | Adds | Package |
|-----------|------|---------|
| pgvector | Vector columns and similarity search | `@prisma-next/extension-pgvector` |
| PostGIS | Geometry columns and geo queries | `@prisma-next/extension-postgis` |
| ParadeDB | BM25 full-text search indexes | `@prisma-next/extension-paradedb` |
| Supabase | Supabase auth/storage tables, role-bound clients | `@prisma-next/extension-supabase` |
| arktype-json | JSON columns validated by an arktype schema | `@prisma-next/extension-arktype-json` |

All target PostgreSQL. Community extensions can be built using the documented extension pack layout.

---

## Prisma Next CLI Reference

The CLI is exposed as `prisma-next`. Install in a Prisma Next project:

```bash
npm install -D prisma-next
```

### Common Workflows

Start an existing project:

```bash
prisma-next init --target postgres --authoring psl
prisma-next contract emit
prisma-next db init --db "$DATABASE_URL"
```

Adopt an existing database:

```bash
prisma-next contract infer --db "$DATABASE_URL" --output ./prisma/contract.prisma
prisma-next contract emit
prisma-next db sign --db "$DATABASE_URL"
prisma-next db verify --db "$DATABASE_URL"
```

Use checked-in migrations:

```bash
prisma-next contract emit
prisma-next migration plan --name add-users
prisma-next migration status --db "$DATABASE_URL"
prisma-next migration apply --db "$DATABASE_URL"
prisma-next db verify --db "$DATABASE_URL"
```

### Command Groups

| Command | Purpose |
|---------|---------|
| `prisma-next init` | Add Prisma Next files to a project |
| `prisma-next contract emit` | Emit `contract.json` and `contract.d.ts` from contract source |
| `prisma-next contract infer` | Infer a starter PSL contract from an existing database |
| `prisma-next db init` | Create missing database structures from current contract and sign |
| `prisma-next db update` | Reconcile an existing database with the current contract |
| `prisma-next db schema` | Inspect the live database schema |
| `prisma-next db sign` | Record that a database matches the current contract |
| `prisma-next db verify` | Check that a database still matches the current contract |
| `prisma-next migration plan` | Create an on-disk migration package from contract changes |
| `prisma-next migration new` | Scaffold a migration package for manual authoring |
| `prisma-next migration apply` | Apply pending on-disk migrations |
| `prisma-next migration status` | Show migration history and applied state |
| `prisma-next migration show` | Inspect a migration package |
| `prisma-next migration ref` | Manage named migration refs |

### Global Flags

| Flag | What it does |
|------|-------------|
| `--json` | Print machine-readable output (CI and scripts) |
| `-q`, `--quiet` | Suppress nonessential output |
| `-v`, `--verbose` | Print more detail |
| `--trace` | Include stack traces for failures |
| `--color` / `--no-color` | Force/disable colored output |
| `--interactive` / `--no-interactive` | Allow/disable prompts |
| `-y`, `--yes` | Accept prompts where supported |

### CLI Configuration

Configure with `prisma-next.config.ts`:

```typescript
import { defineConfig } from "@prisma-next/postgres/config"

export default defineConfig({
  contract: "./prisma/contract.prisma",
  extensions: [pgvector],
  db: { connection: process.env["DATABASE_URL"]! },
})
```

---

## Prisma Next Framework Guides

Prisma Next supports framework guides via `create-prisma@next` scaffolding:

- **Next.js**: `create-prisma@next` with Next.js template
- **Nuxt**: `create-prisma@next` with Nuxt template
- **SvelteKit**: `create-prisma@next` with SvelteKit template
- **Astro**: `create-prisma@next` with Astro template
- **Hono**: `create-prisma@next` with Hono template
- **Elysia**: `create-prisma@next` with Elysia template
- **NestJS**: `create-prisma@next` with NestJS template
- **TanStack Start**: `create-prisma@next` with TanStack Start template
- **Bun**: `create-prisma@next` with Bun runtime
- **Deno**: `create-prisma@next` with Deno runtime

Each guide covers scaffold to rendered data, including database initialization and first typed query.

---

## Prisma Next Data Modeling

### Relational Databases (PostgreSQL)

Model one-to-one, one-to-many, many-to-many, and polymorphic relations:

- **One-to-one**: foreign key with `@unique`
- **One-to-many**: child stores parent's id, parent declares list field
- **Many-to-many**: explicit junction model with composite primary key
- **Polymorphic**: base model with discriminator + variant models with `@@base`

### MongoDB

Model documents, embedded documents, and references:

- **Embed**: for data that belongs to the parent and is read together
- **Reference**: for data that is shared or queried independently
- Embedded documents come back with every read automatically (no `.include()` needed)
- Reference-style relations use `$lookup` via `.include()`

### Capabilities

Capabilities record what your database stack supports, so Prisma Next can reject unsupported features early with a clear error.

---

## Prisma Next Reference

### ORM Client Reference

- Query, mutation, filter, and aggregate methods
- Field update operations (`.set()`, `.push()`, `.pull()`)
- Filter conditions and operators
- Streaming and async iteration

### SQL Query Builder Reference

- Select, mutation, and grouped query methods
- Join operations (inner, left, right)
- Raw SQL fragments with `fns.raw`
- Extension operations (e.g., `cosineDistance`)

### Pipeline Builder Reference (MongoDB)

- Pipeline stages: `$match`, `$group`, `$sort`, `$lookup`, `$limit`, `$skip`
- Accumulators: `acc.count()`, `acc.max()`, `acc.min()`, `acc.sum()`, `acc.avg()`
- Expression helpers
- Write terminals

### Raw Queries Reference

- PostgreSQL raw SQL escape hatches
- MongoDB raw commands

### Transactions and Runtime Reference

- Client lifecycle
- Transactions (`db.transaction`)
- Prepared statements
- Execution options

---

## Prisma Next Blog Series

1. [The Next Evolution of Prisma ORM](https://www.prisma.io/blog/the-next-evolution-of-prisma-orm)
2. [Prisma Next Roadmap](https://www.prisma.io/blog/prisma-next-roadmap)
3. [Rethinking Database Migrations](https://www.prisma.io/blog/rethinking-database-migrations)
4. [TypeScript Migrations in Prisma Next](https://www.prisma.io/blog/typescript-migrations-in-prisma-next)
5. [Data Migrations in Prisma Next](https://www.prisma.io/blog/data-migrations-in-prisma-next)
6. [Prisma Next: A Call for Extension Authors](https://www.prisma.io/blog/prisma-next-call-for-extension-authors)
7. [Prisma Next: April Milestone Complete](https://www.prisma.io/blog/prisma-next-roadmap-april-milestone)
8. [Prisma Next Early Access](https://www.prisma.io/blog/prisma-next-early-access-write-your-contract-prompt-your-agent-ship-your-app)
9. [Prisma Next Performance Benchmark](https://www.prisma.io/blog/prisma-next-performance-benchmark) — ~90% as fast as raw PG

---

## Sources

- https://www.prisma.io/docs/next
- https://www.prisma.io/docs/orm/next
- https://www.prisma.io/docs/orm/next/fundamentals/reading-data
- https://www.prisma.io/docs/orm/next/fundamentals/writing-data
- https://www.prisma.io/docs/orm/next/fundamentals/relations-and-joins
- https://www.prisma.io/docs/orm/next/fundamentals/transactions
- https://www.prisma.io/docs/orm/next/fundamentals/advanced-queries
- https://www.prisma.io/docs/orm/next/contract-authoring/the-data-contract
- https://www.prisma.io/docs/orm/next/contract-authoring/psl-syntax
- https://www.prisma.io/docs/orm/next/contract-authoring/typescript-schema-builder
- https://www.prisma.io/docs/orm/next/migrations/how-migrations-work
- https://www.prisma.io/docs/orm/next/migrations/the-migration-graph
- https://www.prisma.io/docs/orm/next/middleware/how-middleware-works
- https://www.prisma.io/docs/orm/next/extensions/using-extensions
- https://www.prisma.io/docs/cli/next
- https://www.prisma.io/docs/orm/next/contract-authoring/the-contract-artifact
- https://www.prisma.io/docs/orm/next/contract-authoring/capabilities
- https://www.prisma.io/docs/orm/next/data-modeling
- https://www.prisma.io/docs/orm/next/data-modeling/relational-databases
- https://www.prisma.io/docs/orm/next/data-modeling/mongodb
- https://www.prisma.io/docs/orm/next/migrations/editing-a-migration
- https://www.prisma.io/docs/orm/next/migrations/generating-a-migration
- https://www.prisma.io/docs/orm/next/migrations/applying-a-migration
- https://www.prisma.io/docs/orm/next/migrations/rollbacks-and-recovery
- https://www.prisma.io/docs/orm/next/middleware/built-in-budgets
- https://www.prisma.io/docs/orm/next/middleware/built-in-lints
- https://www.prisma.io/docs/orm/next/middleware/built-in-cache
- https://www.prisma.io/docs/orm/next/middleware/authoring-custom-middleware
- https://www.prisma.io/docs/orm/next/reference/orm-client
- https://www.prisma.io/docs/orm/next/reference/sql-query-builder
- https://www.prisma.io/docs/orm/next/reference/pipeline-builder
- https://www.prisma.io/docs/orm/next/reference/raw-queries
- https://www.prisma.io/docs/orm/next/reference/transactions-and-runtime
- https://www.prisma.io/docs/cli/next/init
- https://www.prisma.io/docs/cli/next/contract-emit
- https://www.prisma.io/docs/cli/next/contract-infer
- https://www.prisma.io/docs/cli/next/db-init
- https://www.prisma.io/docs/cli/next/db-update
- https://www.prisma.io/docs/cli/next/db-schema
- https://www.prisma.io/docs/cli/next/db-sign
- https://www.prisma.io/docs/cli/next/db-verify
- https://www.prisma.io/docs/cli/next/migration-plan
- https://www.prisma.io/docs/cli/next/migration-new
- https://www.prisma.io/docs/cli/next/migration-apply
- https://www.prisma.io/docs/cli/next/migration-status
- https://www.prisma.io/docs/cli/next/migration-show
- https://www.prisma.io/docs/cli/next/migration-ref
- https://www.prisma.io/docs/cli/next/configuration
- https://www.prisma.io/docs/guides/next
- https://www.prisma.io/docs/guides/next/frameworks/nextjs
- https://www.prisma.io/docs/guides/next/frameworks/nuxt
- https://www.prisma.io/docs/guides/next/frameworks/sveltekit
- https://www.prisma.io/docs/guides/next/frameworks/astro
- https://www.prisma.io/docs/guides/next/frameworks/hono
- https://www.prisma.io/docs/guides/next/frameworks/elysia
- https://www.prisma.io/docs/guides/next/frameworks/nestjs
- https://www.prisma.io/docs/guides/next/frameworks/tanstack-start
- https://www.prisma.io/docs/guides/next/runtimes/bun
- https://www.prisma.io/docs/guides/next/runtimes/deno
- https://www.prisma.io/docs/next/quickstart/postgresql
- https://www.prisma.io/docs/next/quickstart/mongodb
- https://www.prisma.io/docs/next/add-to-existing-project/postgresql
- https://www.prisma.io/docs/next/add-to-existing-project/mongodb
- https://www.prisma.io/docs/next/prisma-postgres/from-the-cli
- https://www.prisma.io/docs/next/prisma-postgres/import-from-existing-database-postgresql
- https://www.prisma.io/docs/next/prisma-postgres/import-from-existing-database-mysql
- https://github.com/prisma/prisma-next

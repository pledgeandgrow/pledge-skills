# Prisma Next Reference Supplement (Batch 5a)

Detailed reference content for Prisma Next, supplementing the summary in `prisma-next.md`. Covers ORM client methods, SQL query builder, pipeline builder, raw queries, transactions/runtime, data modeling, contract authoring, middleware, and migrations.

---

## ORM Client Reference

### Entry Points

PostgreSQL:
```typescript
import postgres from '@prisma-next/postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

const db = postgres<Contract>({ contractJson, url: process.env.DATABASE_URL });
const runtime = await db.connect();
```

MongoDB:
```typescript
import mongo from '@prisma-next/mongo/runtime';

const db = mongo<Contract>({ contractJson, url: process.env.MONGODB_URL });
```

Models are addressed by schema namespace on PostgreSQL (`db.orm.public.User`) and by collection root name on MongoDB (`db.orm.users`).

### Read Methods

#### `first()`

Fetch one row or `null`.

| Form | Signature | Description |
|------|-----------|-------------|
| Primary key | `first({ id })` | Shorthand for PK lookup |
| Filtered | `.where(...).first()` | First matching row |
| With meta | `.first({ id }, (meta) => ...)` | With annotations |

```typescript
const user = await db.orm.public.User.first({ id: userId });
const alice = await db.orm.public.User.where({ email: 'alice@example.com' }).first();
```

#### `all()`

Fetch every matching row. Returns `AsyncIterableResult<Row>` — `await` for array, `for await` to stream.

```typescript
const posts = await db.orm.public.Post.where({ published: true }).all();
for await (const post of db.orm.public.Post.all()) { /* stream */ }
```

#### `count()`

Return the number of matching rows. PostgreSQL only (use pipeline builder `$group` on MongoDB).

```typescript
const total = await db.orm.public.Post.where({ published: true }).count();
```

### Query Refinement Methods

#### `select(...)`

Project specific fields. Three forms: column names, aliased expression, object of expressions.

```typescript
// Column names
const users = await db.orm.public.User.select('id', 'email').all();

// Aliased expression (PostgreSQL)
const plan = db.sql.public.user
  .select('upperEmail', (f, fns) => fns.raw`UPPER(${f.email})`.returns('pg/text@1'))
  .build();
```

#### `include(...)`

Load related records. Refine with a callback.

```typescript
const usersWithPosts = await db.orm.public.User
  .select('id', 'email')
  .include('posts', (post) => post.select('id', 'title').orderBy((p) => p.createdAt.desc()).take(5))
  .take(10)
  .all();
```

Nested connect/disconnect in updates:

```typescript
const relinked = await db.orm.public.Post.where({ id: postId }).update({
  user: (user) => user.connect({ id: carolId }),
});

const updated = await db.orm.public.Post.where({ id: postId })
  .include('tags', (tag) => tag.select('id', 'label'))
  .update({ tags: (tag) => tag.disconnect([{ id: tagId }]) });
```

#### `where(...)`

Filter records. Object form (equality) or lambda form (comparisons, PostgreSQL only).

```typescript
// Object form (both databases)
const drafts = await db.orm.public.Post.where({ published: false }).all();

// Lambda form (PostgreSQL only)
const recent = await db.orm.public.Post.where((p) => p.createdAt.gte(start)).all();
```

#### `orderBy(...)`

Sort results. PostgreSQL: lambda with `.asc()`/`.desc()`. MongoDB: object with `1`/`-1`.

```typescript
// PostgreSQL composite sort
const posts = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .all();

// MongoDB
const posts = await db.orm.posts.orderBy({ createdAt: -1 }).all();
```

#### `take(n)` and `skip(n)`

Limit and offset for pagination.

```typescript
const page = await db.orm.public.Post
  .orderBy((p) => p.createdAt.desc())
  .take(20)
  .skip(20)
  .all();
```

#### `cursor(...)`

Cursor-based pagination (PostgreSQL only).

```typescript
const page2 = await db.orm.public.Post
  .orderBy([(p) => p.createdAt.desc(), (p) => p.id.desc()])
  .cursor({ createdAt: last.createdAt, id: last.id })
  .take(20)
  .all();
```

#### `variant(...)`

Narrow to a discriminated variant (MongoDB).

```typescript
const tutorials = await db.orm.posts.variant('Tutorial').where({ difficulty: 'beginner' }).all();
```

### Write Methods

#### `create(...)`

Insert one row. No `data` wrapper (unlike Prisma 7).

```typescript
const user = await db.orm.public.User.create({ email: 'jane@prisma.io', name: 'Jane' });
```

#### `createAll([...])`

Insert many rows. Returns `AsyncIterableResult<Row>`.

```typescript
const posts = await db.orm.public.Post.createAll([
  { title: 'One', content: null, published: false, authorId: user.id },
  { title: 'Two', content: null, published: false, authorId: user.id },
]);
```

#### `createCount([...])`

Insert many rows, return count only.

#### `update(...)`

Update one matching row. Requires `where()` first on MongoDB.

```typescript
const updated = await db.orm.public.User.where({ id: bobId }).update({ displayName: 'Bob Updated' });
```

MongoDB field-operations callback:

```typescript
const updated = await db.orm.posts
  .variant('Tutorial')
  .where({ _id: tutorialId })
  .update((t) => [t.duration.inc(5), t.content.set('Updated content')]);
```

#### `updateAll(...)`

Update every matching row. Returns `AsyncIterableResult<Row>`.

- PostgreSQL: single `UPDATE ... RETURNING`, atomic
- MongoDB: **not atomic** — reads IDs, updates, re-reads

```typescript
const updated = await db.orm.public.Post.where({ userId: aliceId }).updateAll({ priority: 'urgent' });
```

#### `updateCount(...)`

Update every matching row, return count.

#### `delete(...)`

Delete one matching row, return it (or `null`).

```typescript
const deleted = await db.orm.public.Tag.where({ id: tagId }).delete();
```

#### `deleteAll(...)`

Delete every matching row, return them.

#### `deleteCount(...)`

Delete every matching row, return count.

#### `upsert(...)`

Insert if no match, otherwise update.

PostgreSQL uses `conflictOn` for the unique target:

```typescript
const tag = await db.orm.public.Tag.upsert({
  create: { id, label: 'typescript' },
  update: { label: 'typescript-renamed' },
  conflictOn: { label: 'typescript' },
});
```

MongoDB requires `where()` first; update side can be a field-operations callback:

```typescript
const user = await db.orm.users.where({ email: 'new@example.com' }).upsert({
  create: { name: 'New', email: 'new@example.com', bio: null, role: 'reader', address: null },
  update: { bio: 'set on upsert' },
});
```

> **Note:** `upsert()` is not supported on multi-table-inheritance variants (throws `Error: upsert() is not supported for MTI variant`).

### Grouped Aggregates (PostgreSQL only)

#### `aggregate(...)`

Compute aggregates over the result set.

```typescript
const stats = await db.orm.public.Order.aggregate((agg) => ({
  total: agg.count(),
  totalAmount: agg.sum('amount'),
  avgAmount: agg.avg('amount'),
  cheapest: agg.min('amount'),
  priciest: agg.max('amount'),
}));
// { total: 10, totalAmount: 1500, avgAmount: 300, cheapest: 10, priciest: 500 }
```

`sum()` and `avg()` resolve to `null` over an empty set (standard SQL behavior).

#### `groupBy(...)` and `having(...)`

Group rows by field(s), filter groups by aggregate.

```typescript
const perCustomer = await db.orm.public.Order.groupBy('customerId').aggregate((agg) => ({
  orderCount: agg.count(),
  totalAmount: agg.sum('amount'),
}));

const bigSpenders = await db.orm.public.Order.groupBy('customerId')
  .having((h) => h.sum('amount').gt(1000))
  .aggregate((agg) => ({ totalAmount: agg.sum('amount') }));
```

### Filter Conditions and Operators

#### PostgreSQL Scalar Comparisons

| Method | Description |
|--------|-------------|
| `eq(value)` / `neq(value)` | Equality / inequality |
| `gt(value)` / `lt(value)` / `gte(value)` / `lte(value)` | Ordered comparisons |
| `like(pattern)` / `ilike(pattern)` | Case-sensitive / case-insensitive pattern match |
| `in(values)` / `notIn(values)` | Membership / exclusion |
| `isNull()` / `isNotNull()` | NULL checks |

#### PostgreSQL Combinators

Standalone functions imported from `@prisma-next/sql-orm-client`:

```typescript
import { and, or, not, all } from '@prisma-next/sql-orm-client';

const both = await db.orm.public.Post.where((p) => and(p.priority.eq('low'), p.userId.eq(carolId))).all();
const either = await db.orm.public.Post.where((p) => or(p.priority.eq('urgent'), p.priority.eq('high'))).all();
const negated = await db.orm.public.Post.where((p) => not(p.priority.eq('low'))).all();
```

#### PostgreSQL Relation Filters

```typescript
const withUrgentPost = await db.orm.public.User
  .where((u) => u.posts.some((p) => p.priority.eq('urgent'))).all();
const allLowPriority = await db.orm.public.User
  .where((u) => u.posts.every((p) => p.priority.eq('low'))).all();
const noUrgentPost = await db.orm.public.User
  .where((u) => u.posts.none((p) => p.priority.eq('urgent'))).all();
```

- `some()` with no predicate: matches parents with at least one related row
- `every()` is vacuously true for a parent with zero related rows

#### MongoDB Filters (`MongoFieldFilter`)

Imported from `@prisma-next/mongo-query-ast/execution`:

| Factory | Description |
|---------|-------------|
| `eq(field, value)` / `neq(field, value)` | Equality / inequality |
| `gt` / `lt` / `gte` / `lte` `(field, value)` | Ordered comparisons |
| `in(field, values)` / `nin(field, values)` | Membership / exclusion |
| `isNull(field)` / `isNotNull(field)` | Null checks (equals-null semantics) |

```typescript
import { MongoFieldFilter, MongoOrExpr } from '@prisma-next/mongo-query-ast/execution';

const alice = await db.orm.users.where(MongoFieldFilter.eq('name', 'Alice')).first();
const both = await db.orm.users
  .where(MongoFieldFilter.eq('role', 'author').and(MongoFieldFilter.eq('name', 'Alice')))
  .all();
const either = await db.orm.users
  .where(MongoOrExpr.of([MongoFieldFilter.eq('name', 'Alice'), MongoFieldFilter.eq('name', 'Bob')]))
  .all();
const negated = await db.orm.users.where(MongoFieldFilter.eq('name', 'Alice').not()).all();
```

> **Warning:** No `.or()` instance method or `$nor` on MongoDB. Use `MongoOrExpr.of([...])` for disjunction. No `regex`, `elemMatch`, `$all`, or `$size` support.

Dot-notation into embedded objects:

```typescript
const usersInSf = await db.orm.users.where(MongoFieldFilter.eq('address.city', 'San Francisco')).all();
```

### MongoDB Field Update Operations

Available inside `update()`, `updateCount()`, and `upsert()` callbacks:

| Operation | Description |
|-----------|-------------|
| `set(value)` | Assign a field |
| `unset()` | Remove a field |
| `inc(n)` | Increment a numeric field |
| `mul(n)` | Multiply a numeric field |

```typescript
const updated = await db.orm.users.where({ _id: bobId }).update((u) => [u.bio.set('Set via field op')]);
const incremented = await db.orm.posts.variant('Tutorial').where({ _id: tutorialId }).update((t) => [t.duration.inc(10)]);
```

> **Warning:** `min()`, `max()`, `rename()`, and `currentDate()` do not exist on the field accessor. `push()`, `pull()`, `addToSet()`, and `pop()` exist but are unverified on array fields.

### AsyncIterableResult

Read terminals (`all()`, `createAll()`, `updateAll()`, `deleteAll()`) and `execute()` return `AsyncIterableResult`:

- **Buffered**: `await` the result to collect an array
- **Streaming**: `for await ... of` to iterate rows one at a time
- Re-`await`ing a buffered result is safe (returns cached array)
- **Switching modes** on a consumed result throws `RUNTIME.ITERATOR_CONSUMED`

---

## SQL Query Builder Reference

The SQL query builder gives table-level, SQL-shaped methods for typed queries. PostgreSQL only.

### Entry Points

```typescript
const db = postgres<Contract>({ contractJson, url: process.env.DATABASE_URL });
const runtime = await db.connect();

const plan = db.sql.public.user.select('id', 'email').build();
const users = await runtime.execute(plan);
```

Table accessors use the contract's mapped table names (snake_case): `db.sql.public.user`, `db.sql.public.post_tag`.

### SELECT Methods

#### `select(...)`

Three forms: column names, aliased expression, object of expressions.

```typescript
// Column names
db.sql.public.user.select('id', 'email');

// Aliased expression
db.sql.public.user.select('upperEmail', (f, fns) => fns.raw`UPPER(${f.email})`.returns('pg/text@1'));

// Object of expressions
db.sql.public.user.select((f) => ({ id: f.id, upperEmail: f.email }));
```

#### `where(...)`

Filter with a callback receiving field accessor `f` and function bag `fns`.

```typescript
db.sql.public.user.where((f, fns) => fns.eq(f.email, 'alice@example.com'));
db.sql.public.user.where((f, fns) => fns.raw`LENGTH(${f.email}) > 15`.returns('pg/bool@1'));
```

#### `orderBy(...)`, `limit()`, `offset()`, `distinctOn()`

```typescript
const plan = db.sql.public.post
  .select('id', 'userId', 'createdAt')
  .orderBy('userId', { direction: 'asc' })
  .orderBy('createdAt', { direction: 'asc' })
  .distinctOn('userId')
  .limit(10)
  .offset(5)
  .build();
```

### Joins

#### `innerJoin()`, `outerLeftJoin()`, `lateralJoin()`

```typescript
const plan = db.sql.public.post
  .as('p')
  .innerJoin(db.sql.public.user.as('u'), (f, fns) => fns.eq(f.p.authorId, f.u.id))
  .select((f) => ({ postId: f.p.id, title: f.p.title, authorEmail: f.u.email }))
  .build();
```

Subquery via `.as()`:

```typescript
const highPriorityPosts = db.sql.public.post
  .select('id', 'userId')
  .where((f, fns) => fns.eq(f.priority, 'high'))
  .as('hp');

const plan = db.sql.public.user
  .innerJoin(highPriorityPosts, (f, fns) => fns.eq(f.user.id, f.hp.userId))
  .select((f) => ({ userId: f.user.id, postId: f.hp.id }))
  .build();
```

> **Warning:** `.as()` is not for lateral joins. `lateralJoin()` callback must return the query chain directly.

### Grouped Queries

```typescript
const plan = db.sql.public.order
  .groupBy('customerId')
  .having((f, fns) => fns.gt(fns.sum('amount'), 1000))
  .aggregate((f, fns) => ({ totalAmount: fns.sum('amount'), orderCount: fns.count() }))
  .orderBy((f, fns) => fns.count(), { direction: 'desc' })
  .limit(5)
  .build();
```

### Write Methods

#### `insert([...])` with `.returning(...)`

```typescript
const plan = db.sql.public.user
  .insert([{ email: 'sql@prisma.io' }])
  .returning('id', 'email')
  .build();
const [inserted] = await runtime.execute(plan);
```

#### `update(...)` and `delete()`

```typescript
const plan = db.sql.public.post
  .update({ published: false })
  .where((f, fns) => fns.lt(f.createdAt, cutoff))
  .build();
await runtime.execute(plan);
```

### `build()` and `execute()`

`build()` takes zero arguments on every query type. Parameter values are embedded in the plan.

```typescript
const plan = db.sql.public.user.select('id', 'email').build();
const rows = await runtime.execute(plan); // Row[]
```

### `ResultType`

Recover a plan's row type:

```typescript
import type { ResultType } from '@prisma-next/framework-components/runtime';
type Row = ResultType<typeof plan>; // { id: string; email: string }
```

### Raw SQL Fragments

`fns.raw` is a tagged template inside `select()` or `where()` callbacks. Interpolated values are AST nodes, not string splices — safe from injection.

```typescript
const plan = db.sql.public.user
  .select('id')
  .select('upperEmail', (f, fns) => fns.raw`UPPER(${f.email})`.returns('pg/text@1'))
  .where((f, fns) => fns.raw`LENGTH(${f.email}) > 15`.returns('pg/bool@1'))
  .build();
```

`.returns(codecId)` is a compile-time type annotation only.

---

## Pipeline Builder Reference (MongoDB)

The pipeline builder gives a typed way to build MongoDB aggregation pipelines. MongoDB only.

### Entry Points

```typescript
const plan = db.query.from('posts').build();
const posts = await db.execute(plan);
```

`from(root)` takes a contract root name (lowercase plural collection name: `'posts'`, `'users'`).

### Stages

#### `match(...)`

Filter documents.

```typescript
const plan = db.query.from('posts').match((f) => f.published.eq(false)).build();
```

> **Warning:** `_id` equality filters do not work in `match()` due to a typed AST limitation. Use `rawCommand()` with a real `ObjectId` as the escape hatch.

#### `group(...)`

Group documents and aggregate.

```typescript
import { acc } from '@prisma-next/mongo-query-builder';

const plan = db.query
  .from('posts')
  .group((f) => ({ _id: f.authorId, postCount: acc.count(), latest: acc.max(f.createdAt) }))
  .build();
```

Accumulators: `acc.count()`, `acc.sum(field)`, `acc.avg(field)`, `acc.min(field)`, `acc.max(field)`.

#### `sort(...)`

```typescript
const plan = db.query.from('posts').sort({ createdAt: -1 }).build();
```

#### `lookup(...)`

Join with `$lookup`.

```typescript
const plan = db.query
  .from('posts')
  .match((f) => f.published.eq(true))
  .lookup((from) => from('users')
    .on((local, foreign) => ({ local: local.authorId, foreign: foreign._id }))
    .as('author'))
  .build();
```

#### `replaceRoot(...)`

Promote a computed sub-document to the top level.

```typescript
import { fn } from '@prisma-next/mongo-query-builder';

const plan = db.query
  .from('posts')
  .lookup((from) => from('users').on((l, fr) => ({ local: l.authorId, foreign: fr._id })).as('author'))
  .replaceRoot((f) => fn.arrayElemAt(f.author, fn.literal(0)))
  .build();
```

#### `count(...)`

Reduce to a single document with the count.

```typescript
const plan = db.query.from('posts').count('total').build();
const [{ total }] = await db.execute(plan);
```

#### `sortByCount(...)`

Group by expression, sort descending by group size.

```typescript
const plan = db.query.from('posts').sortByCount((f) => f.kind).build();
```

### Write Terminals

#### `updateMany(...)`

Update documents through the pipeline. Two forms: operator form and pipeline form.

```typescript
// Operator form
const plan = db.query.from('users').match((f) => f.role.eq('author'))
  .updateMany((f) => [f.bio.set('operator form')]).build();

// Pipeline form (f.stage.*)
const plan = db.query.from('users').match((f) => f.role.eq('author'))
  .updateMany((f) => [f.stage.set({ bio: f.name.node })]).build();
```

> The two forms cannot be mixed in a single updater.

#### `out(...)` and `merge(...)`

Write pipeline output to a collection.

```typescript
const plan = db.query.from('users').out('users_snapshot').build();
const plan2 = db.query.from('users').merge({ into: 'users_archive' }).build();
```

### `rawCommand(...)`

Run a raw MongoDB aggregate command, bypassing the typed AST.

```typescript
import { RawAggregateCommand } from '@prisma-next/mongo-query-ast/execution';
import { ObjectId } from 'mongodb';

const plan = db.query.rawCommand(
  new RawAggregateCommand('posts', [{ $match: { _id: new ObjectId(postId) } }])
);
const rows = await db.execute(plan);
```

---

## Raw Queries Reference

Raw queries are escape hatches for queries the typed surfaces cannot express. Results are **not codec-decoded**.

### PostgreSQL Raw SQL

Raw SQL lives inside the SQL query builder as `fns.raw` tagged template fragments. No standalone raw SQL execution.

```typescript
// In a projection
const plan = db.sql.public.user
  .select('id')
  .select('upperEmail', (f, fns) => fns.raw`UPPER(${f.email})`.returns('pg/text@1'))
  .build();

// As a where predicate
const plan = db.sql.public.user
  .where((f, fns) => fns.raw`LENGTH(${f.email}) > 15`.returns('pg/bool@1'))
  .build();
```

### MongoDB Raw Commands

#### `db.raw.collection(...)`

Access raw MongoDB collection methods.

```typescript
const plan = db.raw.collection('users')
  .findOneAndUpdate(
    { _id: new ObjectId(aliceId) },
    { $set: { bio: 'updated' } },
  )
  .build();
const [updated] = await db.execute(plan);
```

> **Warning:** `returnDocument` is never forwarded — driver default `'before'` applies. Upsert counter pattern: first call returns empty (no pre-image on insert).

#### `db.query.rawCommand(...)`

Run a raw aggregate command through the pipeline builder.

```typescript
const plan = db.query.rawCommand(new RawAggregateCommand('posts', [{ $count: 'total' }]));
const rows = await db.execute(plan);
```

---

## Transactions and Runtime Reference

### PostgreSQL Client Lifecycle

#### `postgres(options)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `contractJson` / `contract` | JSON contract or contract value | Yes | The contract. Supply exactly one. |
| `url` | `string` | One binding | PostgreSQL connection string |
| `pg` | `Pool` or `Client` | One binding | Existing `pg` instance |
| `poolOptions` | `{ connectionTimeoutMillis?, idleTimeoutMillis? }` | No | Pool timeout overrides (defaults 20000/30000) |
| `extensions` | Array of extension packs | No | Runtime extension packs |
| `middleware` | Array of middleware | No | Middleware applied to every execution |

#### `connect()`, `runtime()`, `execute()`, `close()`

```typescript
const db = postgres<Contract>({ contractJson, url: process.env.DATABASE_URL });
const runtime = await db.connect();

const plan = db.sql.public.user.select('id', 'email').build();
const rows = await runtime.execute(plan);

await db.close();
```

`await using` for automatic disposal:

```typescript
await using db = postgres<Contract>({ contractJson, url });
const runtime = await db.connect();
// db.close() fires at end of block
```

### Transactions (PostgreSQL)

#### `db.transaction(callback)`

Commits on return, rolls back on throw.

```typescript
const { user, post } = await db.transaction(async (tx) => {
  const user = await tx.orm.public.User.create({ email, displayName, kind: 'user' });
  const post = await tx.orm.public.Post.create({ title, userId: user.id });
  return { user, post };
});
```

#### `withTransaction(runtime, callback)`

Lower-level helper imported from `@prisma-next/sql-runtime`. Callback receives a bare transaction context (`execute` only, no `.orm` or `.sql`).

```typescript
import { withTransaction } from '@prisma-next/sql-runtime';

await withTransaction(runtime, async (tx) => {
  await tx.execute(db.sql.public.tag.insert([{ id: crypto.randomUUID(), label: 'wt-1' }]).build());
  await tx.execute(db.sql.public.tag.insert([{ id: crypto.randomUUID(), label: 'wt-2' }]).build());
});
```

#### Manual Connection and Transaction Control

```typescript
const runtime = await db.connect();
const connection = await runtime.connection();
const transaction = await connection.transaction();

await transaction.execute(db.sql.public.tag.insert([...]).build());
await transaction.commit(); // or transaction.rollback()
connection.release(); // return to pool
```

`connection.destroy(reason)` evicts a connection from the pool instead of reusing it.

### Prepared Statements (PostgreSQL)

```typescript
const ps = await runtime.prepare({ label: 'pg/text@1' }, (params) =>
  db.sql.public.tag
    .select('id', 'label')
    .where((f, fns) => fns.eq(f.label, params.label))
    .limit(1)
    .build(),
);

const rows = await ps.execute(runtime, { label: 'typescript' });
// Also works inside a transaction:
const inTx = await ps.execute(tx, { label: 'typescript' });
```

### Execution Options

`runtime.execute(plan, options)` accepts `RuntimeExecuteOptions`:

| Option | Type | Description |
|--------|------|-------------|
| `signal` | `AbortSignal` | Per-query cancellation signal |
| `scope` | `'runtime' \| 'connection' \| 'transaction'` | Execution scope |

```typescript
const controller = new AbortController();
controller.abort(new Error('cancelled'));
await runtime.execute(plan, { signal: controller.signal });
// rejects with RUNTIME.ABORTED
```

### `runtime.telemetry()` (PostgreSQL only)

Returns telemetry about the most recent query: `{ lane, target, fingerprint, outcome, durationMs? }`. Returns `null` before any query has run.

### MongoDB Client Lifecycle

MongoDB client has `connect()`, `runtime()`, `execute()`, `close()` only. No `connection()`, `prepare()`, or `telemetry()`.

- `runtime()` returns `Promise<MongoRuntime>` (must `await`)
- `connect()` called twice throws `Error: Mongo client already connected`
- After `close()`, any use throws `Error: Mongo client is closed`

**MongoDB does not support transactions yet.** Use the MongoDB driver directly with a shared `MongoClient` and `startSession()`.

---

## Data Modeling — Relational Databases (PostgreSQL)

### How Relations Are Declared

The model that stores the connection carries a scalar field (foreign key) and a relation field:

```prisma
model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

The side with `fields` owns the foreign key.

### One-to-Many

Foreign key on the "many" side. The list field on the parent is virtual (stores nothing).

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

### One-to-One

One-to-many with `@unique` on the foreign key. Put the key on the dependent side.

```prisma
model Profile {
  id     Int    @id @default(autoincrement())
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### Many-to-Many

Explicit junction model with composite primary key. Implicit many-to-many is not supported yet.

```prisma
model PostTag {
  postId  Int
  tagId   Int
  addedAt DateTime @default(now())
  post    Post     @relation(fields: [postId], references: [id])
  tag     Tag      @relation(fields: [tagId], references: [id])
  @@id([postId, tagId])
}
```

### Polymorphic Relations (Table Inheritance)

Base model with discriminator + variant models with `@@base`:

```prisma
model Task {
  id    Int    @id @default(autoincrement())
  title String
  type  String
  @@discriminator(type)
}

model Bug {
  severity     String
  stepsToRepro String?
  @@base(Task, "bug")
}

model Feature {
  targetRelease String?
  @@base(Task, "feature")
  @@map("features")
}
```

Storage layouts:
- **No `@@map`**: variant shares base table, extra columns must be nullable
- **With `@@map`**: variant gets its own table linked to base PK, columns keep constraints

Pass the discriminator value explicitly when creating through a variant.

---

## Data Modeling — MongoDB

### Documents and Collections

```prisma
model User {
  id    ObjectId @id @map("_id")
  name  String
  email String
  @@map("users")
}
```

### Embed or Reference

| Signal | Lean toward |
|--------|-------------|
| Always loaded with parent | Embed |
| Small and bounded | Embed |
| No meaning outside parent | Embed |
| Grows without limit | Reference |
| Queried/updated on its own | Reference |
| Shared by many parents | Reference |

### Embedded Documents

```prisma
type Address {
  street  String
  city    String
  zip     String?
  country String
}

model User {
  id      ObjectId @id @map("_id")
  address Address?
  @@map("users")
}
```

List of embedded values for one-to-many:

```prisma
type CartItem {
  productId String
  name      String
  amount    Int
}

model Cart {
  id    ObjectId   @id @map("_id")
  items CartItem[]
  @@map("carts")
}
```

> **Warning:** Embedded arrays should stay bounded. Unbounded arrays slow reads and push toward MongoDB's 16 MB limit.

### References Across Collections

```prisma
model Post {
  id       ObjectId @id @map("_id")
  authorId ObjectId
  author   User     @relation(fields: [authorId], references: [id])
  @@map("posts")
}
```

Resolved with `$lookup` aggregation when included in a query.

### Polymorphic Collections

```prisma
model Post {
  id    ObjectId @id @map("_id")
  kind  String
  @@discriminator(kind)
  @@map("posts")
}

model Article {
  summary String
  @@base(Post, "article")
}

model Tutorial {
  difficulty String
  duration   Int
  @@base(Post, "tutorial")
}
```

---

## Contract Authoring — Capabilities

Capabilities record what your database stack supports. Prisma Next checks them before using gated features.

### Where They Come From

`prisma-next contract emit` merges capability declarations from the target, adapter, driver, and extension packs:

```json
{
  "capabilities": {
    "postgres": {
      "distinctOn": true,
      "jsonAgg": true,
      "lateral": true,
      "pgvector.cosine": true,
      "returning": true
    },
    "sql": {
      "defaultInInsert": true,
      "enums": true,
      "lateral": true,
      "returning": true,
      "scalarList": true
    }
  }
}
```

### What Capabilities Gate

Checked at two points:
1. **Contract emission**: schema feature the target cannot store fails emission
2. **Query building**: method requiring a capability throws if the key is missing

Example capabilities:

| Capability | Gates |
|------------|-------|
| `sql.lateral` | Lateral joins; PostgreSQL declares it, SQLite does not |
| `sql.returning` | `RETURNING` clauses on writes |
| `sql.enums` | Enum value sets enforced in the database |
| `sql.scalarList` | Scalar list fields in the schema |
| `postgres.distinctOn` | `DISTINCT ON` queries |
| `postgres.jsonAgg` | JSON aggregation for nested reads |
| `postgres.pgvector.cosine` | Cosine distance operations (pgvector pack) |

---

## Contract Authoring — The Data Contract

The data contract is the single description of your data model and its storage layout. Everything in Prisma Next is typed, planned, and verified against it.

### Why a Contract

- Schema knowledge stays in the open as plain files (`contract.json` + `contract.d.ts`)
- Both are deterministic: same source produces byte-identical output
- Carries identity via content hashes
- `prisma-next db sign` records hashes in the database; runtime verifies before queries

### The Emitted Artifacts

| File | Contents | Consumed by |
|------|----------|-------------|
| `contract.json` | Canonical JSON: models, storage, capabilities, hashes | Runtime, migrations, verification |
| `contract.d.ts` | TypeScript declarations derived from contract | Query APIs, application code |

### Content Hashes

| Hash | Covers | Changes when |
|------|--------|--------------|
| `storageHash` | Models, fields, relations, storage layout | Any schema change |
| `executionHash` | Defaults Prisma Next applies before writes | Generated defaults change |
| `profileHash` | Target database and family | Contract targets a different database |

### Inside contract.json

- `domain` section: models, fields, relations
- `storage` section: tables, columns, keys, indexes (or collections/indexes for MongoDB)
- Each model's `storage` block bridges domain and storage
- Grouped by namespace (PostgreSQL schema, typically `public`)

---

## Middleware — How It Works

Middleware runs your code before and after every query. Register in the `middleware` option of client setup.

### The Five Hooks

| Hook | Runs | Use it to |
|------|------|-----------|
| `beforeCompile(draft, ctx)` | Before AST becomes SQL | Rewrite the query (e.g., add tenant filter) |
| `beforeExecute(plan, ctx, params?)` | After SQL rendered, before database | Validate, block, or adjust parameters |
| `intercept(plan, ctx)` | Right before the driver | Return `{ rows }` to answer without database |
| `onRow(row, plan, ctx)` | Once per streamed row | Count, sample, or throw to abort |
| `afterExecute(plan, result, ctx)` | After query finishes | Log timing, row count, outcome |

- Registration order is execution order at every hook
- If several middleware implement `intercept`, the first one that returns rows wins
- `beforeCompile` is SQL databases only

### Database Families

- `budgets` and `lints` declare `familyId: 'sql'` — PostgreSQL only
- `cache` declares no `familyId` — works on both PostgreSQL and MongoDB
- Mismatch fails at startup with `RUNTIME.MIDDLEWARE_FAMILY_MISMATCH`

### Error Handling

- Middleware that throws from `beforeCompile`, `beforeExecute`, `intercept`, or `onRow` fails the query
- When the driver fails, `afterExecute` still runs with `result.completed = false`
- Errors from `afterExecute` while handling a failure are swallowed

---

## Middleware — Authoring Custom Middleware

A custom middleware is a plain object with a `name` and hooks. No base class.

### Query Logger Example

```typescript
import type { SqlMiddleware } from "@prisma-next/sql-runtime";

export function queryLogger(options?: { thresholdMs?: number }): SqlMiddleware {
  const thresholdMs = options?.thresholdMs ?? 0;
  return {
    name: "query-logger",
    familyId: "sql",
    async afterExecute(plan, result) {
      if (result.latencyMs < thresholdMs) return;
      console.log(`[query-logger] ${result.rowCount} rows in ${Math.round(result.latencyMs)}ms · ${plan.sql}`);
    },
  };
}
```

### Rewriting Queries with `beforeCompile`

```typescript
import type { SqlMiddleware } from '@prisma-next/sql-runtime';
import { AndExpr, type BinaryExpr } from '@prisma-next/sql-relational-core/ast';

export function scopeUserSelects(predicate: BinaryExpr): SqlMiddleware {
  return {
    name: 'scope-user-selects',
    familyId: 'sql',
    async beforeCompile(draft) {
      if (draft.ast.kind !== 'select') return undefined;
      if (draft.ast.from?.kind !== 'table-source') return undefined;
      if (draft.ast.from.name !== 'user') return undefined;
      const where = draft.ast.where ? AndExpr.of([draft.ast.where, predicate]) : predicate;
      return { ...draft, ast: draft.ast.withWhere(where) };
    },
  };
}
```

Return `undefined` to pass the query through unchanged. Rewrites compose in registration order.

---

## Middleware — Built-in: Budgets

Caps row counts and makes over-latency queries visible. SQL-family only.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRows` | `number` | `10_000` | Max rows per query |
| `defaultTableRows` | `number` | `10_000` | Assumed row count for unlisted tables |
| `tableRows` | `Record<string, number>` | `{}` | Per-table row-count assumptions |
| `maxLatencyMs` | `number` | `1_000` | Latency budget per query |
| `severities.rowCount` | `'warn' \| 'error'` | `'error'` | Pre-execution violation behavior |
| `severities.latency` | `'warn' \| 'error'` | (none) | Accepted but not read in v0.14 |

### Enforcement Points

1. **Before execution**: inspects AST, unbounded `SELECT` or estimated rows > `maxRows` → `BUDGET.ROWS_EXCEEDED`
2. **While rows stream**: counts actual rows, throws `BUDGET.ROWS_EXCEEDED` if exceeded
3. **After execution**: compares `latencyMs` vs `maxLatencyMs` → `BUDGET.TIME_EXCEEDED`

---

## Middleware — Built-in: Cache

Serves repeated reads from an in-memory store. Opt-in per query. Family-agnostic (works on PostgreSQL and MongoDB).

### Registration

```typescript
import { createCacheMiddleware } from '@prisma-next/middleware-cache';

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
  middleware: [createCacheMiddleware({ maxEntries: 1_000 })],
});
```

### Opting a Query In

```typescript
import { cacheAnnotation } from '@prisma-next/middleware-cache';

// SQL query builder
const plan = db.sql.public.user
  .select('id', 'email')
  .annotate(cacheAnnotation({ ttl: 60_000 }))
  .limit(10)
  .build();

// ORM API
const user = await db.orm.public.User.first({ id }, (meta) =>
  meta.annotate(cacheAnnotation({ ttl: 60_000 })),
);
```

### Annotation Fields

| Field | Type | Description |
|-------|------|-------------|
| `ttl` | `number` | Time-to-live in milliseconds. Without it, annotation is inert |
| `skip` | `boolean` | Bypass cache for this call (force-refresh) |
| `key` | `string` | Override computed cache key |

Cache key is a content hash of the executed query + bound parameters + contract's storage hash. Schema migrations rotate the storage hash, so stale entries cannot serve new-schema queries.

---

## Middleware — Built-in: Lints

Inspects query structure before execution. Blocks or warns on risky shapes. SQL-family only.

### Rules

| Rule | Code | Default Severity | Fires when |
|------|------|-----------------|------------|
| DELETE without WHERE | `LINT.DELETE_WITHOUT_WHERE` | `error` | `DELETE` has no `WHERE` |
| UPDATE without WHERE | `LINT.UPDATE_WITHOUT_WHERE` | `error` | `UPDATE` has no `WHERE` |
| No LIMIT | `LINT.NO_LIMIT` | `warn` | `SELECT` has no `LIMIT` |
| SELECT star | `LINT.SELECT_STAR` | `warn` | Query selects all columns |

### Configuration

```typescript
lints({
  severities: {
    noLimit: 'error',
    selectStar: 'warn',
  },
  fallbackWhenAstMissing: 'raw', // or 'skip'
});
```

Raw SQL fallback: `select *` escalates to `error` for raw plans, missing `LIMIT` stays `warn`, read-only-intent mutation is `error`.

---

## Migrations — How Migrations Work

### The Workflow Loop

1. **Change contract**: edit `.prisma`, run `prisma-next contract emit`
2. **Plan migration**: `prisma-next migration plan --name add_user_phone`
3. **Review**: read generated TypeScript and DDL preview; edit if needed
4. **Apply**: `prisma-next migrate`

### Migration Directory Structure

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

### Every Operation Checks Itself

1. **Precheck**: confirms database is in expected state
2. **Execute**: the statements that make the change
3. **Postcheck**: confirms the change worked

Operation classes: **Additive** (safe), **Destructive** (can lose data), **Data** (changes rows).

---

## Migrations — The Migration Graph

Prisma Next does not treat migrations as one timestamp-ordered list. Each migration records `from` and `to` schema states, forming a graph.

### Key Terms

| Term | Meaning |
|------|---------|
| Contract | Schema you author + `contract.json` artifact |
| Contract state | One exact shape of the schema at a point in history |
| Hash | Short fingerprint of a contract state (like a Git commit hash) |
| Node | A contract state in the graph, identified by its hash |
| Edge | A migration — moves database from one node to another |
| Marker | Record inside the database naming the node it currently matches |
| Ref | Human-readable name for a node, like `prod` |

### Inspecting the Graph

| Question | Command | Needs DB? |
|----------|---------|-----------|
| What does the topology look like? | `migration graph` | No |
| Which migration directories exist? | `migration list` | No |
| Where is my database, what is pending? | `migration status` | Yes |
| What has been applied, and when? | `migration log` | Yes |

### Name States with Refs

```bash
npx prisma-next migration ref add prod --hash f9a41d7
```

---

## Migrations — Rollbacks and Recovery

### Rollback: A Migration Like Any Other

No `migrate down` command. Rolling back means planning a new edge to a previously visited state (`git revert`, not `git reset`).

```bash
npx prisma-next migration plan \
  --from 20260707T1008_add_display_name \
  --to 20260707T1008_add_display_name^ \
  --name rollback_display_name
```

Review the destructive operations, edit if needed (e.g., archive data before `DROP`), then apply:

```bash
npx prisma-next migrate --to 20260707T1008_add_display_name^
```

### Key Points

- A rollback does **not** resurrect data — edit the rollback migration to save data first
- You don't have to retrace every step — an edge can jump directly to any earlier node
- After a rollback, `migration plan` cannot pick its starting point automatically (`MIGRATION.NO_TARGET`) — plan with explicit `--from`
- Revert the contract source in the same commit as the rollback migration

### Recovery (Failed Migrations)

Recovery means fixing the cause and re-running. Re-running is safe because:
- Additive operations are idempotent
- Prechecks detect what already applied
- The ledger records partial application state

---

## Migrations — Generating a Migration

`prisma-next migration plan` turns a contract change into a reviewable migration on disk. Planning is **fully offline**: it reads your emitted contract and existing migrations, never connects to a database.

### Your First Migration

```bash
npx prisma-next contract emit
npx prisma-next migration plan --name init
```

Output:

```text
✔ Planned 2 operation(s)

│
├─ Create schema "public"
└─ Create table "user"

from:   null
to:     sha256:705b1a62f26f0913caa4bfe3f8b7cb491a1b94bd47fc43471d8711bc480bcbb5
App space → migrations/app/20260707T1005_init

DDL preview

CREATE SCHEMA IF NOT EXISTS "public";
CREATE TABLE "public"."user" (
  "email" text NOT NULL,
  "id" int4 NOT NULL,
  "name" text,
  PRIMARY KEY ("id")
);
```

- **`from: null`** means this migration starts from an empty database (root of the graph)
- **`to:`** is your contract's hash — the migration promises to deliver a database matching exactly the contract you emitted
- **`App space`** is your application's migration lane; extensions bring their own

The planned migration directory:

```text
migrations/app/20260707T1005_init/
├── migration.ts
├── ops.json
├── migration.json
└── end-contract.json  (+ end-contract.d.ts)
```

### Planning a Delta

After applying the first migration, change the contract and plan again with `--from`:

```bash
npx prisma-next contract emit
npx prisma-next migration plan --name add_user_phone --from 20260707T1005_init
```

`--from` accepts: a migration directory name, a contract hash or prefix, a ref name, or `<dir>^` (state before that migration).

### The `db` Ref (Skipping `--from`)

If a ref named `db` exists, planning starts from whatever it points at:

```bash
npx prisma-next migrate --advance-ref db
npx prisma-next migration plan --name next_change   # starts from db ref automatically
```

> **Warning:** Without `--from` or a `db` ref, plans start from empty — a full CREATE-everything migration, not a delta.

### When the Planner Needs Your Input

Adding a required field to a table with existing rows: the planner scaffolds a placeholder `dataTransform` between schema steps:

```text
⚠ Planned migration with placeholder(s) — edit migration.ts then run `node migration.ts` to self-emit
```

Fill in the placeholder, then recompile with `node migration.ts`.

### Reviewing What You Planned

```bash
npx prisma-next migration show 20260707T1006_add_user_phone  # one migration in detail
npx prisma-next migration graph                               # whole graph with new edge
npx prisma-next migration check                               # integrity check (CI-friendly)
```

`migration check` exit codes: `0` = clean, `2` = couldn't resolve, `4` = integrity failure (e.g., hand-edited `ops.json`).

> **Early Access note:** Rename inference is not built yet — renaming a field plans as drop + add column (destructive, data-loss warning). For a true rename, edit the migration and replace with `rawSql ALTER TABLE ... RENAME COLUMN`.

---

## Migrations — Editing a Migration

### The Edit-Recompile-Review Loop

1. Edit `migration.ts`, never `ops.json`
2. Recompile: `node <migration-dir>/migration.ts`
3. Review the diff of `ops.json`
4. Verify: `npx prisma-next migration check`
5. Commit `migration.ts`, `ops.json`, and `migration.json` together

### Filling In a Placeholder (Typed Backfill)

The planner scaffolds a `dataTransform` with `placeholder(...)` where your backfill query goes. Fill it in:

```typescript
import type { Contract as End } from './end-contract';
import endContractJson from './end-contract.json' with { type: 'json' };
import type { Contract as Start } from './start-contract';
import startContractJson from './start-contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma-next/postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly endContractJson = endContractJson;
  override readonly startContractJson = startContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public', table: 'user',
        column: col('displayName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-displayName', {
        check: () => db.public.user.select('id').where((f, fns) => fns.eq(f.displayName, null)).limit(1),
        run: () => db.public.user.update({ displayName: 'Anonymous' }).where((f, fns) => fns.eq(f.displayName, null)),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'displayName' }),
    ];
  }
}
```

Key details:
- Types come from the migration's own contract snapshot (`./end-contract`), not your live app contract
- The query is real application-grade TypeScript — typos in column names fail the type check
- `check` becomes both precheck (`EXISTS`: is there work?) and postcheck (`NOT EXISTS`: is it done?)
- `run` becomes a parameterized `UPDATE` — values travel in `params`, never spliced into SQL text

### Escape Hatch: `rawSql`

For anything the operation factories don't cover (enabling an extension, `CREATE INDEX CONCURRENTLY`, vendor-specific statements):

```typescript
rawSql({
  id: 'extension.pgcrypto',
  label: 'Enable extension "pgcrypto"',
  operationClass: 'additive',
  target: { id: 'postgres' },
  precheck: [
    { description: 'not yet enabled', sql: "SELECT NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')" },
  ],
  execute: [{ description: 'enable it', sql: 'CREATE EXTENSION IF NOT EXISTS pgcrypto' }],
  postcheck: [
    { description: 'now enabled', sql: "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')" },
  ],
});
```

Prechecks and postchecks are optional but make failed runs resumable and mistakes diagnosable.

### MongoDB Data Transforms

Same `check`/`run` shape, same compilation to precheck/execute/postcheck. Hand-authored Mongo transforms build queries from raw Mongo command shapes rather than the full typed builder:

```typescript
import { dataTransform, setValidation } from '@prisma-next/target-mongo/migration';

override get operations() {
  return [
    setValidation('products', productsValidator.jsonSchema, {
      validationLevel: productsValidator.validationLevel,
      validationAction: productsValidator.validationAction,
    }),
    dataTransform('backfill-product-status', {
      check: { source: () => existingProductsWithoutStatus(storageHash) },
      run: () => backfillRun(storageHash),
    }),
  ];
}
```

### Starting From a Blank Migration

For data-only migrations or fully hand-authored operations:

```bash
npx prisma-next migration new --name backfill_scores
```

Write operations in the generated `migration.ts`, then compile: `node migration.ts`.

---

## Migrations — Applying a Migration

`prisma-next migrate` walks the graph from where your database is to where you want it. It's the one step that touches a database.

```bash
npx prisma-next migrate --db $DATABASE_URL
```

> Note: it's `migrate`, not `migration apply`. The `migration ...` subcommands manage files on disk; `migrate` moves a database.

### Check Before, Preview, Then Apply

```bash
# 1. Where is the database, what's pending?
npx prisma-next migration status --db $DATABASE_URL

# 2. What exactly would run?
npx prisma-next migrate --show --db $DATABASE_URL

# 3. Run it.
npx prisma-next migrate --db $DATABASE_URL
```

`migration status` draws the path between the database's marker and the target:

```text
*   925198f  @contract
|^  20260707T1006_add_user_phone  705b1a6 -> 925198f  1 ops  > pending
*   705b1a6  @db (db)
|^  20260707T1005_init                  - -> 705b1a6  2 ops  + applied
*   -
```

`migrate --show` is the read-only dry run — nothing touches the database.

After applying, `migration log` shows the database's append-only ledger of what ran.

### Choosing a Target

`--to` accepts: a ref name, a contract hash or prefix, a migration directory name, or `<dir>^`:

```bash
npx prisma-next migrate --to prod --db $DATABASE_URL
npx prisma-next migrate --to sha256:e6b5c28 --db $DATABASE_URL
npx prisma-next migrate --to 20260707T1005_init --db $DATABASE_URL
```

Without `--to`, `migrate` advances toward your emitted contract. If the graph has branched and multiple tips are reachable, `migrate` refuses to guess and asks for explicit `--to`.

`--advance-ref` moves a named ref to the post-apply state in the same step:

```bash
npx prisma-next migrate --advance-ref db
```

### When Something Goes Wrong

The runner stops at the first failing operation:

```text
✖ Operation pgvector.install-vector-extension failed during execution: create extension "vector" (PN-RUN-3000)
  Why: extension "vector" is not available
  Fix: Fix the issue and re-run `prisma-next migrate --to <contract>` — previously applied migrations are preserved.
```

Three safety properties:
- **PostgreSQL: failed run leaves nothing behind** — entire `migrate` run executes inside one transaction, rolls back on failure
- **Error is specific** — names the operation, phase (precheck/execute/postcheck), and check that failed
- **Re-running is safe** — operations are idempotent; postcheck skips already-satisfied operations

Before any DDL, `migrate` verifies the database's marker is a state the graph knows. A database changed outside of migrations fails fast with a marker mismatch.

### Development vs. Production

**Development** — you plan, edit, and apply immediately:

```bash
npx prisma-next migration plan --name my_change && npx prisma-next migrate --advance-ref db
```

**CI/Production** — migrations arrive via your repo, already planned and merged:

```bash
npx prisma-next migration check          # files intact, graph well-formed (offline)
npx prisma-next migrate --show --db $DATABASE_URL   # log what's about to run
npx prisma-next migrate --db $DATABASE_URL
```

The runner executes only `ops.json` (plain data). `migration.ts` files are never executed with production credentials.

Concurrent deploys are safe: on PostgreSQL the whole apply runs inside a transaction guarded by an advisory lock. On MongoDB, each migration advances the marker with compare-and-swap and the runner verifies the resulting schema before committing.

### Extension Spaces

Projects using database extensions (e.g., pgvector) see multiple contract spaces. Extensions ship their own migrations in `migrations/<extension>/`. One `migrate` run walks them all (extensions first, then app):

```text
✔ Applied 2 migration(s) (20 operation(s)) across 2 contract space(s)

Extension space: pgvector
  └─ Enable extension "vector"

App space
  ├─ Create table "user"
  └─ ...
```

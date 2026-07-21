# GraphQL Best Practices

Real-world strategies for designing and operating GraphQL APIs. Covers HTTP serving, authorization, pagination, error handling, caching, security, federation, schema governance, and more.

---

## Thinking in Graphs

Shift from RESTful endpoints to graph-based thinking:

- **Model the domain**, not the data sources
- **Think in relationships** between entities, not flat resources
- **Align schema with business logic**, not database tables
- **Use business-domain language** in type and field names
- **Avoid leaking implementation details** (no `userId` foreign keys as fields — use nested objects)

```graphql
# BAD — REST-style thinking
type Query {
  userById(id: ID!): User
  postsByUserId(userId: ID!): [Post]
  commentsByPostId(postId: ID!): [Comment]
}

# GOOD — Graph thinking
type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  body: String!
  author: User!
  post: Post!
}
```

---

## Serving Over HTTP

### Endpoint

GraphQL typically uses a single endpoint (e.g., `/graphql`):

```
POST /graphql
GET  /graphql?query={me{name}}
```

### Request Format

#### POST (primary method)

```http
POST /graphql
Content-Type: application/json

{
  "query": "query HeroName { hero { name } }",
  "operationName": "HeroName",
  "variables": { "episode": "JEDI" },
  "extensions": { "persistedQuery": { "sha256Hash": "..." } }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `query` | Yes | GraphQL document source text |
| `operationName` | Only if multiple operations | Which operation to execute |
| `variables` | No | JSON object of variable values |
| `extensions` | No | Protocol extensions (e.g., persisted queries) |

#### GET (query operations only)

```
GET /graphql?query={me{name}}&variables={"episode":"JEDI"}&operationName=HeroName
```

- Only for **query** operations (not mutations)
- Useful for HTTP caching and CDN edge caching
- May hit URL length limits for complex queries
- Use **persisted queries** to work around URL length limits

### Response Format

```http
HTTP/1.1 200 OK
Content-Type: application/graphql-response+json

{
  "data": { ... },
  "errors": [ ... ],
  "extensions": { ... }
}
```

### Status Codes

| Scenario | `graphql-response+json` | `application/json` (legacy) |
|----------|------------------------|----------------------------|
| Success with data | `2xx` | `2xx` |
| Partial data + errors | `2xx` | `2xx` |
| Validation error (no data) | `400` | `2xx` or `400` |
| Server error | `4xx`/`5xx` | `2xx` (discouraged) |

**Key rule**: If `data` is present and not null, always `2xx` — even with errors.

### Where Authentication Happens

Authentication happens at the HTTP layer, not in the GraphQL schema:

```javascript
// Express + Apollo Server
app.use('/graphql', (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = verifyToken(token);
  next();
});
```

Authorization (what a user can access) happens in resolvers.

### Persisted Queries

For large queries and security:

```javascript
// Client sends a hash instead of full query
{
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "abc123..."
    }
  }
}

// Server responds with full query if not cached
// Client retries with full query + hash
{
  "query": "query { hero { name } }",
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "abc123..."
    }
  }
}
```

---

## Authorization

### Field-Level Authorization

```javascript
const resolvers = {
  User: {
    email: (parent, args, context) => {
      if (context.user?.id !== parent.id && !context.user?.isAdmin) {
        throw new Error('Not authorized to view email');
      }
      return parent.email;
    },
    ssn: (parent, args, context) => {
      if (!context.user?.isAdmin) {
        throw new Error('Admin access required');
      }
      return parent.ssn;
    },
  },
};
```

### Type-Level Authorization

```javascript
const resolvers = {
  Query: {
    adminDashboard: (parent, args, context) => {
      if (!context.user?.isAdmin) {
        throw new ForbiddenError('Admin access required');
      }
      return getAdminData();
    },
  },
};
```

### Using Directives for Authorization

```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  ADMIN
  USER
  GUEST
}

type Query {
  adminData: String @auth(requires: ADMIN)
  userProfile: User @auth(requires: USER)
  publicData: String
}
```

```javascript
// Apollo Server directive implementation
class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const requiredRole = this.args.requires;
    const originalResolver = field.resolve || defaultFieldResolver;
    field.resolve = async (parent, args, context, info) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      if (!hasRole(context.user, requiredRole)) {
        throw new ForbiddenError(`Requires ${requiredRole} role`);
      }
      return originalResolver(parent, args, context, info);
    };
  }
}
```

### Best Practices

- **Authenticate at HTTP layer**, authorize in resolvers
- **Check permissions in resolvers**, not just in schema
- **Use context** to pass authenticated user to all resolvers
- **Fail fast** — check auth before fetching data
- **Consider DataLoaders** for efficient permission checks
- **Don't expose sensitive fields** without explicit auth checks

---

## Pagination

### Simple Offset/Limit

```graphql
type Query {
  users(offset: Int = 0, limit: Int = 10): [User!]!
}
```

Simple but has issues with data changes between pages.

### Cursor-Based (Relay-Style)

The recommended approach using the Connection pattern:

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  users(
    first: Int
    after: String
    last: Int
    before: String
  ): UserConnection!
}
```

```graphql
query {
  users(first: 10, after: "YXJyYXljb25uZWN0aW9uOjEw") {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

### Connection Pattern Benefits

- **Stable pagination** — cursors don't shift when data changes
- **Bidirectional** — `first/after` (forward) and `last/before` (backward)
- **Metadata** — `totalCount`, `hasNextPage`, `hasPreviousPage`
- **Edge-level data** — can attach metadata per edge (e.g., friendship date)

### Simple Slice (for small datasets)

```graphql
type Query {
  users(limit: Int = 10, cursor: String): UserPage!
}

type UserPage {
  items: [User!]!
  nextCursor: String
  hasMore: Boolean!
}
```

---

## Error Handling

### Top-Level Errors (Default)

Errors are returned in the `errors` array:

```json
{
  "data": {
    "createUser": null
  },
  "errors": [
    {
      "message": "Email already exists",
      "path": ["createUser"],
      "extensions": {
        "code": "EMAIL_EXISTS"
      }
    }
  ]
}
```

### Errors as Data (Expected Failures)

For expected business-logic failures, return errors as data instead of throwing:

```graphql
type CreateUserPayload {
  user: User
  errors: [UserError!]
}

type UserError {
  field: String
  message: String
  code: String
}

type Mutation {
  createUser(input: UserInput!): CreateUserPayload!
}
```

```graphql
mutation {
  createUser(input: { email: "existing@example.com", name: "Alice" }) {
    user {
      id
      name
    }
    errors {
      field
      message
      code
    }
  }
}
```

### When to Use Which

| Error Type | Approach | Example |
|-----------|----------|---------|
| Expected failure | Errors as data | Validation, business rules |
| Unexpected failure | Top-level errors | Database down, bug |
| Auth failure | Top-level errors | Not authenticated |
| Partial failure | Top-level errors | Some fields error, others succeed |

### Custom Error Classes

```javascript
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.extensions = { code: 'UNAUTHENTICATED' };
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.extensions = { code: 'FORBIDDEN' };
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.extensions = { code: 'VALIDATION_ERROR', field };
  }
}
```

---

## Caching

### HTTP-Level Caching (GET requests)

```
GET /graphql?query={users{name}}
Cache-Control: max-age=60
```

- Only works with GET requests
- Limited to query operations
- CDN-friendly

### Response-Level Cache Control

```graphql
type User @cacheControl(maxAge: 60) {
  id: ID!
  name: String!
  email: String @cacheControl(maxAge: 0)
}

type Query {
  users: [User!]! @cacheControl(maxAge: 30)
  currentUser: User @cacheControl(maxAge: 0)
}
```

### Client-Side Caching (Apollo Client, urql)

```javascript
// Apollo Client — automatic cache normalization
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
    },
  },
});
```

### DataLoader for N+1 Prevention

```javascript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds) => {
  const users = await db.getUsersByIds(userIds);
  return userIds.map(id => users.find(u => u.id === id));
});

// In context
context.dataLoaders = {
  user: userLoader,
};

// In resolver
function resolvePostAuthor(parent, args, context) {
  return context.dataLoaders.user.load(parent.authorId);
}
```

### Global Object Identification

Using globally unique IDs enables better caching:

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Post implements Node {
  id: ID!
  title: String!
}

type Query {
  node(id: ID!): Node
}
```

---

## Security

### Query Depth Limiting

Prevent deeply nested queries:

```javascript
import { createComplexityRule } from 'graphql-query-complexity';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityRule({
      maximumDepth: 10,
    }),
  ],
});
```

### Query Complexity Analysis

Limit total query cost:

```javascript
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';

validationRules: [
  createComplexityRule({
    maximumComplexity: 1000,
    estimators: [simpleEstimator({ defaultComplexity: 1 })],
  }),
],
```

### Rate Limiting

```javascript
// Per-user rate limiting
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { errors: [{ message: 'Rate limit exceeded' }] },
});

app.use('/graphql', rateLimiter);
```

### Input Validation

```javascript
// Use custom scalars or validation in resolvers
const resolvers = {
  Mutation: {
    createUser: (parent, args, context) => {
      if (!isValidEmail(args.input.email)) {
        throw new ValidationError('Invalid email format', 'email');
      }
      if (args.input.password.length < 8) {
        throw new ValidationError('Password too short', 'password');
      }
      return createUser(args.input);
    },
  },
};
```

### Disable Introspection in Production

```javascript
import { NoSchemaIntrospectionCustomRule } from 'graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: process.env.NODE_ENV === 'production'
    ? [NoSchemaIntrospectionCustomRule]
    : [],
});
```

### Other Security Measures

- **Persisted queries** — only allow pre-approved queries
- **Query whitelisting** — restrict to known operations
- **Timeout** — set execution timeout
- **Max aliases** — limit alias count
- **Max query length** — limit document size
- **CORS** — configure properly
- **HTTPS only** — never serve over HTTP in production

---

## Federation

Federation enables modular, scalable APIs by composing multiple services into a unified schema.

### Architecture

```
┌─────────────────────────────────────────┐
│           Gateway / Router              │
│        (unified supergraph)             │
└───────┬───────┬───────┬────────────────┘
        │       │       │
   ┌────┴──┐ ┌─┴───┐ ┌┴─────┐
   │ Users │ │Posts│ │Reviews│
   │Subgraph│Subgraph│Subgraph│
   └───────┘ └─────┘ └──────┘
```

### Entity Definition

```graphql
# Users subgraph
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}

# Posts subgraph
type Post @key(fields: "id") {
  id: ID!
  title: String!
  author: User! @provides(fields: "name")
}

type User @key(fields: "id") @extends {
  id: ID! @external
  name: String! @external
  posts: [Post!]!
}
```

### Federation Directives

| Directive | Description |
|-----------|-------------|
| `@key(fields:)` | Primary key for an entity |
| `@external` | Field defined in another subgraph |
| `@extends` | Extends an entity from another subgraph |
| `@provides(fields:)` | Field this subgraph can provide |
| `@requires(fields:)` | Fields required from another subgraph |
| `@shareable` | Field resolvable by multiple subgraphs |

### Benefits

- **Team autonomy** — each team owns their subgraph
- **Independent deployment** — subgraphs deploy separately
- **Schema composition** — gateway composes all subgraphs
- **Entity resolution** — cross-service joins handled by the gateway

---

## Schema Governance

### Ownership Models

| Model | Description | Best For |
|-------|-------------|----------|
| **Centralized** | One team owns the entire schema | Small teams, early stage |
| **Federated** | Each team owns their subgraph | Large orgs, microservices |
| **Hybrid** | Central team governs, teams implement | Medium-to-large orgs |

### Schema Review Process

1. **Proposal** — RFC for new fields/types
2. **Review** — Check naming, types, nullability, deprecation
3. **Testing** — Verify against client needs
4. **Approval** — Schema review board approves
5. **Deployment** — Staged rollout
6. **Monitoring** — Track usage and errors

### Automated Validation

```yaml
# .graphqlrc.yml or similar
schema: schema.graphql
extensions:
  graphql-schema-linter:
    rules:
      - types-have-descriptions
      - fields-have-descriptions
      - enum-values-have-descriptions
      - input-object-values-have-descriptions
      - deprecations-have-a-reason
      - naming-convention
```

```bash
# CLI tools
graphql-schema-linter schema.graphql
graphql-inspector validate schema.graphql
```

### Schema Change Management

- **Additive changes** are safe (new fields, new types)
- **Breaking changes** require deprecation cycle:
  1. Add new field
  2. Deprecate old field with `@deprecated`
  3. Wait for clients to migrate
  4. Remove old field
- **Never change** field types in-place — add new field instead
- **Track usage** to know when deprecated fields can be removed

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Types | PascalCase | `User`, `BlogPost` |
| Fields | camelCase | `firstName`, `createdAt` |
| Enums | UPPER_SNAKE_CASE | `ACTIVE`, `PENDING_REVIEW` |
| Input types | PascalCase + `Input` suffix | `CreateUserInput` |
| Mutations | verb + noun | `createUser`, `deletePost` |
| Arguments | camelCase | `limit`, `orderBy` |
| Directives | camelCase | `@auth`, `@cacheControl` |

---

## Robust Applications

Handle schema evolution gracefully on the client:

### Unknown Enum Values

```javascript
// Server may add new enum values — handle gracefully
switch (user.status) {
  case 'ACTIVE': return <ActiveBadge />;
  case 'INACTIVE': return <InactiveBadge />;
  default: return <UnknownBadge />; // Handle unknown values
}
```

### New Union Members

```javascript
// Server may add new types to a union
{search.map(item => {
  switch (item.__typename) {
    case 'User': return <UserCard user={item} />;
    case 'Post': return <PostCard post={item} />;
    default: return <GenericCard item={item} />;
  }
})}
```

### Nullable Fields

```javascript
// Fields may become nullable in future schema versions
const name = data.user?.name ?? 'Unknown';
const email = data.user?.email ?? 'No email provided';
```

---

## File Uploads

GraphQL doesn't have a built-in file upload type. Common approaches:

### 1. Multipart Request (graphql-upload)

```graphql
type Mutation {
  uploadFile(file: Upload!): File!
  uploadFiles(files: [Upload!]!): [File!]!
}

scalar Upload
```

```javascript
// Client
const file = fileInput.files[0];
const mutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      id
      url
    }
  }
`;
// Use multipart/form-data transport
```

### 2. Presigned URL Pattern

```graphql
type Mutation {
  requestUpload(filename: String!, contentType: String!): UploadUrl!
}

type UploadUrl {
  url: String!
  fields: JSON
}
```

Client uploads directly to S3/cloud storage, then sends the URL to the server.

### 3. Base64 in Mutation (small files only)

```graphql
input AvatarInput {
  filename: String!
  base64Data: String!
}

type Mutation {
  uploadAvatar(input: AvatarInput!): User!
}
```

---

## Common HTTP Errors

### graphql-http Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 400 Bad Request | Malformed request body | Check JSON structure |
| 405 Method Not Allowed | Using GET for mutations | Use POST for mutations |
| 415 Unsupported Media Type | Missing Content-Type header | Set `application/json` |
| 401 Unauthorized | Missing auth token | Add Authorization header |
| 403 Forbidden | Insufficient permissions | Check user roles |
| 500 Internal Server Error | Resolver crash | Check resolver error handling |

---

## Performance

### Prevent N+1 Queries

```javascript
// BAD — N+1: one query per post's author
function resolvePosts(posts, args, context) {
  return posts.map(post => context.db.getUser(post.authorId));
}

// GOOD — Batch with DataLoader
function resolvePosts(posts, args, context) {
  return context.dataLoaders.user.loadMany(
    posts.map(post => post.authorId)
  );
}
```

### Monitoring

- **Apollo Studio** — tracing, error tracking, schema history
- **Datadog / New Relic** — APM integration
- **Custom tracing** via `extensions` in response
- **Field-level metrics** — track resolver performance

### Other Performance Tips

- **Use `@defer`** for streaming large responses
- **Implement persisted queries** to reduce request size
- **Use CDN caching** for GET requests
- **Batch database queries** with DataLoader
- **Set query complexity limits**
- **Use compression** (gzip/brotli)
- **Cache introspection results** on the client
- **Avoid deeply nested queries** — flatten where possible

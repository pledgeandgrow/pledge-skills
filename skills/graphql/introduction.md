# Introduction to GraphQL

GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data. It is not tied to any specific database or storage engine and is instead backed by your existing code and data.

## Key Principles

### 1. Describe Your API with a Type System

A GraphQL service is created by defining types and their fields, then writing a resolver function for each field to provide the required data.

```graphql
# Schema definition
type Query {
  me: User
}

type User {
  name: String
}
```

```javascript
// Resolver for the `me` field on the `Query` type
function resolveQueryMe(_parent, _args, context, _info) {
  return context.request.auth.user;
}

// Resolver for the `name` field on the `User` type
function resolveUserName(user, _args, context, _info) {
  return context.db.getUserFullName(user.id);
}
```

### 2. Query Exactly What You Need

Clients send queries that mirror the structure of the data they need. The server returns just that data in a single request.

```graphql
{
  me {
    name
  }
}
```

Response:

```json
{
  "data": {
    "me": {
      "name": "Luke Skywalker"
    }
  }
}
```

Key benefits:
- Get exactly the fields you request — no more, no less
- Single request for multiple related resources (no over-fetching or under-fetching)
- Result shape matches the query shape

### 3. Evolve Your API Without Versioning

GraphQL allows your API to evolve without managing multiple versions. Fields can be deprecated and new fields added without breaking existing clients.

```graphql
type User {
  fullName: String
  nickname: String
  name: String @deprecated(reason: "Use `fullName`.")
}
```

Client tooling encourages developers to use new fields and remove usage of deprecated ones. The deprecated field can be removed once it's no longer used.

## GraphQL vs REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple URL endpoints | Single endpoint (e.g., `/graphql`) |
| Data fetching | Fixed response shapes | Client specifies exact fields |
| Over-fetching | Common | Eliminated |
| Under-fetching | Common (needs multiple requests) | Eliminated (single request) |
| Versioning | URL versioning (`/v1/`, `/v2/`) | Deprecation directives |
| Real-time | WebHooks / SSE (separate) | Subscriptions (built-in) |
| Self-documenting | Requires external docs | Introspection built-in |
| Caching | HTTP caching (easy) | Client-side caching (complex) |

## Architecture Overview

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Client     │────▶│   GraphQL Server  │────▶│  Data Source │
│  (query/mut) │◀────│  (schema +        │◀────│  (DB, API,   │
│              │     │   resolvers)      │     │   microsvc)  │
└──────────────┘     └──────────────────┘     └─────────────┘
                           │
                     ┌─────┴─────┐
                     │  Schema   │
                     │  (SDL)    │
                     └───────────┘
```

### Request Lifecycle

1. **Parse**: Server parses the GraphQL document string
2. **Validate**: Server validates the document against the schema
3. **Execute**: Server executes resolvers for each field
4. **Response**: Server returns JSON with `data`, `errors`, and optionally `extensions`

## When to Use GraphQL

- **Multiple clients** with different data needs (web, mobile, etc.)
- **Deeply related data** that requires multiple REST round-trips
- **Rapid iteration** where API needs to evolve frequently
- **Real-time features** via subscriptions
- **Aggregation** of multiple backend services

## When NOT to Use GraphQL

- Simple CRUD APIs with a single client
- When HTTP caching is critical (REST has better native caching)
- When you need binary protocols or streaming uploads
- When team has no GraphQL expertise and timeline is tight

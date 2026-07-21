---
name: graphql-docs
version: "October 2025 spec"
tags:
  - graphql
  - api
  - query-language
  - schema
  - types
  - mutations
  - subscriptions
  - introspection
  - federation
  - apollo
description: >
  Use this skill whenever the user asks about GraphQL, query languages for APIs,
  schema design, types, resolvers, mutations, subscriptions, introspection,
  pagination, federation, or API best practices. Covers the full GraphQL
  specification including schemas and types, queries, mutations, subscriptions,
  validation, execution, response format, introspection, and all best practices
  (thinking in graphs, serving over HTTP, authorization, pagination, error
  handling, caching, security, federation, and schema governance). Use it for
  code generation, schema design, debugging, or any GraphQL-related task.
---

# GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with existing data. It provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need, makes it easier to evolve APIs over time, and enables powerful developer tools.

**Specification**: [spec.graphql.org/draft](https://spec.graphql.org/draft/)

---

## Quick Reference

| Topic | File |
|------|------|
| Introduction & Core Concepts (type system, queries, versionless evolution) | `introduction.md` |
| Schemas & Types (SDL, object types, scalars, enums, interfaces, unions, input types, directives) | `schema.md` |
| Queries (fields, arguments, aliases, variables, fragments, inline fragments, directives) | `queries.md` |
| Mutations (create, update, delete, input objects, serial execution) | `mutations.md` |
| Subscriptions (real-time, pub/sub, WebSocket transport, scaling) | `subscriptions.md` |
| Validation (validation rules, error detection, common invalid queries) | `validation.md` |
| Execution (resolvers, context, async, scalar coercion, list resolvers) | `execution.md` |
| Response Format (data, errors, extensions, request vs field errors, status codes) | `response.md` |
| Introspection (__schema, __type, querying the schema itself) | `introspection.md` |
| Best Practices (thinking in graphs, HTTP serving, auth, pagination, errors, caching, security, federation, schema governance) | `best-practices.md` |

---

## Core Concepts

- **Schema**: The type system that describes all available data and operations
- **Query**: Read operation that traverses fields to fetch exactly what's needed
- **Mutation**: Write operation that modifies data (executed serially)
- **Subscription**: Long-lived operation for real-time data updates
- **Resolver**: Function that provides data for each field
- **Type System**: Scalars, objects, enums, interfaces, unions, input types, lists, non-null
- **SDL**: Schema Definition Language — language-agnostic way to describe schemas
- **Introspection**: Ability to query the schema itself via `__schema` and `__type`

---

## Official Documentation

- [GraphQL Learn](https://graphql.org/learn/)
- [GraphQL Specification](https://spec.graphql.org/draft/)
- [GraphQL Code](https://graphql.org/code/)
- [GraphQL FAQ](https://graphql.org/faq/)

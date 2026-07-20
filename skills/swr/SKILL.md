---
name: swr-docs
version: 2.3.0
description: SWR — React data fetching library with built-in caching, revalidation, pagination, mutation, suspense, and middleware.
tags: [swr, react, data-fetching, caching, hooks, vercel, frontend]
---

# SWR — Complete Skill Reference

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started (installation, quick start, reusable hooks) | `getting-started.md` |
| Core Concepts (useSWR, keys, fetchers, conditional fetching) | `core-concepts.md` |
| Options (all useSWR options, SWRConfig, global configuration) | `options.md` |
| Mutation (useSWRMutation, optimistic updates, rollback, populateCache) | `mutation.md` |
| Pagination (useSWRInfinite, index/cursor pagination, parallel fetching) | `pagination.md` |
| Prefetching (preload, fallback data, RSC prefetch, HTML preload) | `prefetching.md` |
| Revalidation (focus, interval, reconnect, immutable, mount) | `revalidation.md` |
| Cache (cache providers, mutate, global mutate, cache modifiers) | `cache.md` |
| Middleware (custom middleware, logger, laggy, serialize) | `middleware.md` |
| Suspense (suspense mode, error boundaries, SSR, conditional) | `suspense.md` |
| Subscription (useSWRSubscription, WebSocket, Firestore, dedup) | `subscription.md` |
| Error Handling (status codes, retry, global error report) | `error-handling.md` |
| TypeScript (type inference, generics, Fetcher, middleware types) | `typescript.md` |
| Next.js Integration (App Router, RSC, SSG/SSR, fallback) | `nextjs.md` |
| Advanced (understanding SWR, cache providers, performance, React Native) | `advanced.md` |
| API Reference (all hooks, functions, types) | `api-reference.md` |

---

## Core Concepts

- **useSWR Hook**: The fundamental API — pass a key and fetcher, get data/error/isLoading
- **Cache Keys**: String, array, object, or function keys — automatically serialized
- **Fetcher Agnostic**: Works with fetch, Axios, GraphQL, or any Promise-returning function
- **Automatic Revalidation**: On focus, reconnect, interval — all configurable
- **Request Deduplication**: Identical requests within dedupingInterval are merged
- **Mutation**: Update cached data via bound/global mutate or useSWRMutation
- **Pagination**: useSWRInfinite for index-based or cursor-based pagination
- **Prefetching**: preload API, fallback data, or HTML `<link rel="preload">`
- **Middleware**: Wrap SWR hooks with custom logic (logging, laggy, serialization)
- **Suspense**: Full React Suspense support with error boundaries
- **Subscription**: Real-time data via useSWRSubscription (WebSocket, Firestore)
- **SSR/SSG**: Pre-fill data via fallback, prefetch in Server Components
- **TypeScript**: Full type inference and explicit generic support

## Target Version

SWR 2.3.x (latest stable, 2026)

## Common Patterns

```tsx
// Basic usage
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data, error, isLoading } = useSWR('/api/user', fetcher)

// With global config
import { SWRConfig } from 'swr'
<SWRConfig value={{ fetcher: (url) => fetch(url).then(r => r.json()) }}>
  <App />
</SWRConfig>

// Mutation
import useSWRMutation from 'swr/mutation'
const { trigger } = useSWRMutation('/api/user', updateUser)

// Pagination
import useSWRInfinite from 'swr/infinite'
const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

// Prefetching
import { preload } from 'swr'
preload('/api/user', fetcher)
```

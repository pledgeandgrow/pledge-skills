# API Reference — SWR

## useSWR

```tsx
import useSWR from 'swr'

const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher?, options?)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string \| any[] \| object \| null \| (() => Key)` | Unique key for the request |
| `fetcher` | `(key) => Promise<data>` | Promise-returning function to fetch data |
| `options` | `SWRConfiguration` | Options object |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `data` | `data \| undefined` | Data resolved by fetcher |
| `error` | `error \| undefined` | Error thrown by fetcher |
| `isLoading` | `boolean` | Ongoing request with no loaded data |
| `isValidating` | `boolean` | Any request or revalidation in flight |
| `mutate` | `(data?, options?) => Promise` | Bound mutate function |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `suspense` | `boolean` | `false` | Enable React Suspense mode |
| `fetcher` | `function` | — | Fetcher function |
| `revalidateIfStale` | `boolean` | `true` | Revalidate if data is stale |
| `revalidateOnMount` | `boolean` | `undefined` | Revalidate on mount |
| `revalidateOnFocus` | `boolean` | `true` | Revalidate on window focus |
| `revalidateOnReconnect` | `boolean` | `true` | Revalidate on network reconnect |
| `refreshInterval` | `number \| function` | `0` | Polling interval in ms |
| `refreshWhenHidden` | `boolean` | `false` | Poll when tab not visible |
| `refreshWhenOffline` | `boolean` | `false` | Poll when offline |
| `shouldRetryOnError` | `boolean` | `true` | Retry on error |
| `dedupingInterval` | `number` | `2000` | Dedupe window in ms |
| `focusThrottleInterval` | `number` | `5000` | Focus throttle in ms |
| `loadingTimeout` | `number` | `3000` | Slow loading timeout in ms |
| `errorRetryInterval` | `number` | `5000` | Error retry interval in ms |
| `errorRetryCount` | `number` | — | Max error retries |
| `fallback` | `object` | — | Multiple fallback data (SWRConfig) |
| `fallbackData` | `data` | — | Initial data (per-hook) |
| `keepPreviousData` | `boolean` | `false` | Keep previous key's data |
| `strictServerPrefetchWarning` | `boolean` | `false` | Warn on missing prefetch |
| `onLoadingSlow` | `function` | — | `(key, config) => void` |
| `onSuccess` | `function` | — | `(data, key, config) => void` |
| `onError` | `function` | — | `(err, key, config) => void` |
| `onErrorRetry` | `function` | — | `(err, key, config, revalidate, opts) => void` |
| `onDiscarded` | `function` | — | `(key) => void` |
| `compare` | `function` | `stableHash` | `(a, b) => boolean` |
| `isPaused` | `function` | `() => false` | `() => boolean` |
| `use` | `Middleware[]` | `[]` | Middleware functions |

---

## useSWRImmutable

```tsx
import useSWRImmutable from 'swr/immutable'

const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(key, fetcher?, options?)
```

Same API as `useSWR` but with `revalidateIfStale`, `revalidateOnFocus`, `revalidateOnReconnect` all set to `false`.

---

## useSWRMutation

```tsx
import useSWRMutation from 'swr/mutation'

const { data, error, trigger, reset, isMutating } = useSWRMutation(key, fetcher, options?)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `Key` | Same as useSWR's key |
| `fetcher` | `(key, { arg }) => Promise` | Async function for remote mutation |
| `options` | `object` | Options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `optimisticData` | `data \| function` | — | Data or `(current) => data` |
| `revalidate` | `boolean \| function` | `true` | Revalidate after mutation |
| `populateCache` | `boolean \| function` | `false` | Write mutation result to cache |
| `rollbackOnError` | `boolean \| function` | `true` | Rollback on error |
| `throwOnError` | `boolean` | `true` | Throw on error |
| `onSuccess` | `function` | — | `(data, key, config) => void` |
| `onError` | `function` | — | `(err, key, config) => void` |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `data` | `data \| undefined` | Data from fetcher |
| `error` | `error \| undefined` | Error from fetcher |
| `trigger` | `(arg?, options?) => Promise` | Trigger mutation |
| `reset` | `() => void` | Reset state |
| `isMutating` | `boolean` | Ongoing mutation |

---

## useSWRInfinite

```tsx
import useSWRInfinite from 'swr/infinite'

const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetcher?, options?)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `getKey` | `(index, previousPageData) => Key` | Returns key for each page |
| `fetcher` | `function` | Same as useSWR's fetcher |
| `options` | `object` | useSWR options + extra (see below) |

### Extra Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialSize` | `number` | `1` | Initial number of pages |
| `revalidateAll` | `boolean` | `false` | Revalidate all pages |
| `revalidateFirstPage` | `boolean` | `true` | Revalidate first page |
| `persistSize` | `boolean` | `false` | Don't reset size on key change |
| `parallel` | `boolean` | `false` | Fetch pages in parallel |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `data` | `data[][] \| undefined` | Array of page responses |
| `error` | `error \| undefined` | Error |
| `isLoading` | `boolean` | First load, no data |
| `isValidating` | `boolean` | Any request in flight |
| `mutate` | `function` | Bound mutate (data array) |
| `size` | `number` | Number of pages loaded |
| `setSize` | `(n) => void` | Set number of pages |

---

## useSWRSubscription

```tsx
import useSWRSubscription from 'swr/subscription'

const { data, error } = useSWRSubscription(key, subscribe)
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `Key` | Unique subscription key |
| `subscribe` | `(key, { next }) => () => void` | Subscribe function |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `data` | `data \| undefined` | Latest data |
| `error` | `error \| undefined` | Error if any |

---

## SWRConfig

```tsx
import { SWRConfig } from 'swr'

<SWRConfig value={config | (parent) => config}>
  <App />
</SWRConfig>
```

Accepts either an object or a functional configuration that receives the parent config.

---

## useSWRConfig

```tsx
import { useSWRConfig } from 'swr'

const { mutate, cache, fetcher, ...config } = useSWRConfig()
```

Returns the global configuration, `mutate`, and `cache`.

---

## mutate (global)

```tsx
import { mutate } from 'swr'
// or
const { mutate } = useSWRConfig()

mutate(key, data?, options?)
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `optimisticData` | `data \| function` | — | Optimistic update data |
| `revalidate` | `boolean \| function` | `true` | Revalidate after mutation |
| `populateCache` | `boolean \| function` | `true` | Write result to cache |
| `rollbackOnError` | `boolean \| function` | `true` | Rollback on error |
| `throwOnError` | `boolean` | `true` | Throw on error |

---

## preload

```tsx
import { preload } from 'swr'

preload(key, fetcher)
```

Prefetches data and stores it in the cache. Can be called outside of React.

---

## unstable_serialize

```tsx
import { unstable_serialize } from 'swr'
import { unstable_serialize } from 'swr/infinite'

const serializedKey = unstable_serialize(key)
```

Serializes a key for use with `fallback` or global `mutate`. Not a stable API.

---

## TypeScript Types

```tsx
import type {
  Key,
  Fetcher,
  SWRConfiguration,
  Middleware,
  SWRHook,
  SWRResponse,
} from 'swr'

import type {
  SWRInfiniteKeyLoader,
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from 'swr/infinite'

import type {
  SWRMutationConfiguration,
  SWRMutationResponse,
  Trigger,
} from 'swr/mutation'

import type {
  SWRSubscription,
  SWRSubscriptionOptions,
} from 'swr/subscription'
```

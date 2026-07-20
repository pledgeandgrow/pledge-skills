# Options — SWR

## useSWR Options

All options can be passed as the third argument to `useSWR`, or configured globally via `SWRConfig`.

### Revalidation Options

| Option | Default | Description |
|--------|---------|-------------|
| `revalidateIfStale` | `true` | Automatically revalidate even if there is stale data |
| `revalidateOnMount` | `undefined` | Enable/disable automatic revalidation when component mounts |
| `revalidateOnFocus` | `true` | Automatically revalidate when window gets focused |
| `revalidateOnReconnect` | `true` | Automatically revalidate when browser regains network connection |
| `refreshInterval` | `0` | Polling interval in ms (number or function receiving latest data) |
| `refreshWhenHidden` | `false` | Poll when window is invisible (if `refreshInterval` enabled) |
| `refreshWhenOffline` | `false` | Poll when browser is offline (determined by `navigator.onLine`) |

```tsx
useSWR('/api/data', fetcher, {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 5000,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
})
```

### Dynamic Refresh Interval

```tsx
useSWR('/api/data', fetcher, {
  refreshInterval: (data) => {
    // Poll faster when data is urgent
    if (data?.priority === 'high') return 1000
    return 10000
  }
})
```

### Retry Options

| Option | Default | Description |
|--------|---------|-------------|
| `shouldRetryOnError` | `true` | Retry when fetcher has an error |
| `errorRetryInterval` | `5000` | Error retry interval in ms |
| `errorRetryCount` | — | Max error retry count |

> Under slow networks (2G, <= 70Kbps), `errorRetryInterval` is 10s and `loadingTimeout` is 5s.

### Performance Options

| Option | Default | Description |
|--------|---------|-------------|
| `dedupingInterval` | `2000` | Dedupe requests with same key in this time span (ms) |
| `focusThrottleInterval` | `5000` | Only revalidate once during this time span (ms) |
| `loadingTimeout` | `3000` | Timeout to trigger `onLoadingSlow` event (ms) |

### Data Options

| Option | Default | Description |
|--------|---------|-------------|
| `fallbackData` | — | Initial data to be returned (per-hook) |
| `fallback` | — | Key-value object of multiple fallback data (in SWRConfig) |
| `keepPreviousData` | `false` | Return previous key's data until new data loads |
| `compare` | `stableHash` | Comparison function to detect data changes |

### Suspense

| Option | Default | Description |
|--------|---------|-------------|
| `suspense` | `false` | Enable React Suspense mode |

### Callbacks

| Option | Description |
|--------|-------------|
| `onLoadingSlow(key, config)` | Called when a request takes too long |
| `onSuccess(data, key, config)` | Called when a request finishes successfully |
| `onError(err, key, config)` | Called when a request returns an error |
| `onErrorRetry(err, key, config, revalidate, revalidateOps)` | Handler for error retry |
| `onDiscarded(key)` | Called when a request is ignored due to race conditions |

### Other Options

| Option | Default | Description |
|--------|---------|-------------|
| `fetcher(args)` | — | The fetcher function |
| `isPaused()` | `() => false` | Detect whether to pause revalidations |
| `use` | `[]` | Array of middleware functions |
| `strictServerPrefetchWarning` | `false` | Show warning when key has no pre-filled data |

## SWRConfig — Global Configuration

```tsx
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{
      fetcher: (url) => fetch(url).then(r => r.json()),
      revalidateOnFocus: false,
      refreshInterval: 3000,
      dedupingInterval: 5000,
    }}>
      <Page />
    </SWRConfig>
  )
}
```

### Nesting Configurations

SWRConfig merges configurations from parent context. Primitives override; objects merge:

```tsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{
      dedupingInterval: 100,
      refreshInterval: 100,
      fallback: { a: 1, b: 1 },
    }}>
      <SWRConfig value={{
        dedupingInterval: 200,  // overrides parent (primitive)
        fallback: { a: 2, c: 2 }, // merges with parent (object)
      }}>
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 200,
  //   refreshInterval: 100,
  //   fallback: { a: 2, b: 1, c: 2 },
  // }
}
```

### Functional Configuration

```tsx
<SWRConfig value={parent => ({
  dedupingInterval: parent.dedupingInterval * 5,
  fallback: { a: 2, c: 2 },
})}>
  <Page />
</SWRConfig>
```

### Cache Provider

```tsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Access Global Configurations

```tsx
import { useSWRConfig } from 'swr'

function Component() {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()
  // ...
}
```

## useSWRImmutable

```tsx
import useSWRImmutable from 'swr/immutable'

// Never revalidates automatically
useSWRImmutable('/api/config', fetcher)

// Equivalent to:
useSWR('/api/config', fetcher, {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
})
```

## isPaused

```tsx
useSWR('/api/data', fetcher, {
  isPaused: () => !navigator.onLine, // pause when offline
})
```

When `isPaused` returns `true`, SWR ignores fetched data and errors.

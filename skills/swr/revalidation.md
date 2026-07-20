# Automatic Revalidation — SWR

## Revalidate on Focus

When you re-focus a page or switch between tabs, SWR automatically revalidates data. Enabled by default.

```tsx
useSWR('/api/data', fetcher, { revalidateOnFocus: true }) // default
```

Useful for:
- Refreshing stale mobile tabs
- Updating data when a laptop wakes from sleep
- Syncing between browser tabs

### Focus Throttling

```tsx
useSWR('/api/data', fetcher, { focusThrottleInterval: 5000 }) // default: 5000ms
```

Only revalidate once within the throttle window.

## Revalidate on Interval

Automatically refetch data at a specified interval. Smart — only refetches when the component is on screen.

```tsx
// Fixed interval
useSWR('/api/todos', fetcher, { refreshInterval: 1000 })

// Dynamic interval based on latest data
useSWR('/api/data', fetcher, {
  refreshInterval: (data) => {
    if (data?.urgent) return 1000
    return 10000
  }
})
```

### refreshWhenHidden

```tsx
useSWR('/api/data', fetcher, {
  refreshInterval: 5000,
  refreshWhenHidden: false, // default — don't poll when tab is not visible
})
```

### refreshWhenOffline

```tsx
useSWR('/api/data', fetcher, {
  refreshInterval: 5000,
  refreshWhenOffline: false, // default — don't poll when offline
})
```

## Revalidate on Reconnect

When the user regains network connectivity, SWR automatically revalidates. Enabled by default.

```tsx
useSWR('/api/data', fetcher, { revalidateOnReconnect: true }) // default
```

Useful when:
- User unlocks computer but internet isn't connected yet
- Network drops and reconnects
- Switching between Wi-Fi networks

## Disable Automatic Revalidations

For immutable resources that will never change:

### useSWRImmutable

```tsx
import useSWRImmutable from 'swr/immutable'

useSWRImmutable('/api/config', fetcher)
```

### Manual Configuration

```tsx
useSWR('/api/config', fetcher, {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
})
// Equivalent to useSWRImmutable
```

## Revalidate on Mount

Control revalidation behavior when a component mounts.

### Default Behavior

`revalidateOnMount` defaults to `undefined`, which means:
- If `revalidateIfStale` is `true` (default), SWR revalidates only if there's stale cache data
- If there's no cache data, SWR fetches

```tsx
// Force revalidation on mount
useSWR('/api/data', fetcher, { revalidateOnMount: true })

// Disable revalidation on mount (use cached data only)
useSWR('/api/data', fetcher, { revalidateOnMount: false })

// Default — revalidate only if stale
useSWR('/api/data', fetcher, { revalidateIfStale: true })
```

### revalidateIfStale vs revalidateOnMount

| Scenario | revalidateIfStale=true | revalidateOnMount=true |
|----------|----------------------|----------------------|
| Has cache, stale | Revalidates | Revalidates |
| Has cache, fresh | No revalidation | Revalidates |
| No cache | Fetches | Fetches |

## isPaused

```tsx
useSWR('/api/data', fetcher, {
  isPaused: () => !navigator.onLine, // pause all revalidations when offline
})
```

When `isPaused` returns `true`, SWR ignores fetched data and errors. Useful for:
- Offline mode
- Pausing during form editing
- Conditional data pausing

## Manual Revalidation

```tsx
const { mutate } = useSWR('/api/data', fetcher)

// Trigger revalidation
mutate()

// Or with global mutate
import { useSWRConfig } from 'swr'
const { mutate: globalMutate } = useSWRConfig()
globalMutate('/api/data')
```

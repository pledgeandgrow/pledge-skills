# Core Concepts — SWR

## The useSWR Hook

```tsx
import useSWR from 'swr'

const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options)
```

### Parameters

- **key**: a unique key string for the request (or a function / array / null)
- **fetcher**: (optional) a Promise-returning function to fetch your data
- **options**: (optional) an object of options for this SWR hook

### Return Values

- **data**: data for the given key resolved by fetcher (or `undefined` if not loaded)
- **error**: error thrown by fetcher (or `undefined`)
- **isLoading**: `true` if there's an ongoing request and no "loaded data". Fallback data and previous data are not considered "loaded data"
- **isValidating**: `true` if there's a request or revalidation loading
- **mutate(data?, options?)**: function to mutate the cached data

> `isLoading` vs `isValidating`:
> - `isLoading` = first load, no data yet
> - `isValidating` = any request in flight (including revalidation)

## Keys

The key is a unique identifier for the data — it's used as the cache key.

### String Key

```tsx
useSWR('/api/user', fetcher)        // GET /api/user
useSWR('user-123', () => getUser()) // custom key
```

### Array Key

```tsx
useSWR(['/api/user', userId, token], ([url, id, token]) => fetchWithToken(url, id, token))
```

All elements are part of the cache key — if any changes, SWR revalidates.

### Object Key

```tsx
useSWR({ url: '/api/user', id: 123 }, ({ url, id }) => fetch(`${url}?id=${id}`))
```

Object keys are serialized automatically (since SWR 1.1.0).

### Function Key

```tsx
// Compute key dynamically
useSWR(() => `/api/user/${user.id}`, fetcher)
```

If the function throws or returns a falsy value, SWR will not start the request.

### null Key (Conditional)

```tsx
// Conditionally fetch
useSWR(shouldFetch ? '/api/data' : null, fetcher)
```

## Conditional Fetching

Use `null` or a function as the key to conditionally fetch data:

```tsx
// Conditionally fetch
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)

// Return a falsy value from a function
const { data } = useSWR(() => shouldFetch ? '/api/data' : null, fetcher)

// Throw an error when dependencies aren't ready
const { data } = useSWR(() => '/api/data?uid=' + user.id, fetcher)
```

## Dependent Fetching

Fetch data that depends on other data. SWR ensures maximum parallelism and serial fetching when needed:

```tsx
function MyProjects() {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)

  // When passing a function, SWR uses the return value as `key`.
  // If the function throws or returns falsy, SWR knows dependencies
  // aren't ready. `user.id` throws when `user` isn't loaded.

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```

## Revalidation

SWR automatically revalidates data in several scenarios:

### Revalidate on Focus

When you re-focus a page or switch between tabs, SWR revalidates data. Enabled by default.

```tsx
useSWR('/api/data', fetcher, { revalidateOnFocus: true }) // default
```

### Revalidate on Interval

```tsx
useSWR('/api/todos', fetcher, { refreshInterval: 1000 }) // poll every second

// Dynamic interval based on data
useSWR('/api/data', fetcher, {
  refreshInterval: (data) => data?.urgent ? 1000 : 5000
})
```

### Revalidate on Reconnect

When the browser regains network connection. Enabled by default.

```tsx
useSWR('/api/data', fetcher, { revalidateOnReconnect: true }) // default
```

### Disable All Automatic Revalidations

```tsx
import useSWRImmutable from 'swr/immutable'

// Equivalent to:
// useSWR(key, fetcher, {
//   revalidateIfStale: false,
//   revalidateOnFocus: false,
//   revalidateOnReconnect: false
// })
useSWRImmutable('/api/data', fetcher)
```

### Revalidate on Mount

```tsx
// Force revalidation on mount
useSWR('/api/data', fetcher, { revalidateOnMount: true })

// Disable revalidation on mount (use cached data)
useSWR('/api/data', fetcher, { revalidateOnMount: false })

// Default: revalidates if data is stale (revalidateIfStale = true)
useSWR('/api/data', fetcher, { revalidateIfStale: true })
```

## Request Deduplication

SWR deduplicates requests with the same key within a time window:

```tsx
// Default: 2000ms
useSWR('/api/data', fetcher, { dedupingInterval: 2000 })

// Disable deduplication
useSWR('/api/data', fetcher, { dedupingInterval: 0 })

// Long dedup for immutable data
useSWR('/api/config', fetcher, { dedupingInterval: 60000 })
```

## Error Handling

### Status Code and Error Object

Customize the fetcher to return more information:

```tsx
const fetcher = async (url) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

const { data, error } = useSWR('/api/user', fetcher)
// error.info === { message: "You are not authorized...", documentation_url: "..." }
// error.status === 403
```

### Error Retry

SWR uses exponential backoff by default. Override via `onErrorRetry`:

```tsx
useSWR('/api/user', fetcher, {
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (error.status === 404) return      // Never retry on 404
    if (key === '/api/user') return       // Never retry for a specific key
    if (retryCount >= 10) return          // Only retry up to 10 times
    setTimeout(() => revalidate({ retryCount }), 5000) // Retry after 5s
  }
})
```

Disable retry entirely:

```tsx
useSWR('/api/user', fetcher, { shouldRetryOnError: false })
```

### Global Error Report

```tsx
<SWRConfig value={{
  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      // Send to Sentry, show notification, etc.
    }
  }
}}>
  <MyApp />
</SWRConfig>
```

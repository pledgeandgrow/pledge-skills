# Error Handling — SWR

## Status Code and Error Object

Customize the fetcher to return status code and error info:

```tsx
const fetcher = async (url) => {
  const res = await fetch(url)

  // If status code is not 200-299, parse and throw as error
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

const { data, error } = useSWR('/api/user', fetcher)

// On 403:
// error.info === { message: "You are not authorized...", documentation_url: "..." }
// error.status === 403
```

> `data` and `error` can exist at the same time. The UI can display existing data while knowing the next request failed.

## Error Retry

SWR uses **exponential backoff** by default. Override via `onErrorRetry`:

```tsx
useSWR('/api/user', fetcher, {
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (error.status === 404) return       // Never retry on 404
    if (key === '/api/user') return        // Never retry for specific key
    if (retryCount >= 10) return           // Only retry up to 10 times
    setTimeout(() => revalidate({ retryCount }), 5000) // Retry after 5s
  }
})
```

### Disable Retry

```tsx
useSWR('/api/user', fetcher, { shouldRetryOnError: false })
```

### Via Global Configuration

```tsx
<SWRConfig value={{ shouldRetryOnError: true, errorRetryInterval: 3000 }}>
  <App />
</SWRConfig>
```

### Retry Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `shouldRetryOnError` | `true` | Enable/disable retry |
| `errorRetryInterval` | `5000` | Base retry interval in ms |
| `errorRetryCount` | — | Max retry count |

> Under slow networks (2G, <= 70Kbps), `errorRetryInterval` is 10s.

## Global Error Report

Handle errors globally for notifications, Sentry, etc.:

```tsx
<SWRConfig value={{
  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      // Send to Sentry
      Sentry.captureException(error)
      // Show toast notification
      toast.error('Something went wrong')
    }
  }
}}>
  <MyApp />
</SWRConfig>
```

## Error in Components

```tsx
function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) {
    // Access error.info and error.status from custom fetcher
    return (
      <div>
        <p>Error: {error.message}</p>
        <p>Status: {error.status}</p>
        {error.info && <p>Details: {error.info.message}</p>}
      </div>
    )
  }

  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

## Error with Suspense

In Suspense mode, errors are thrown and must be caught with error boundaries:

```tsx
<ErrorBoundary fallback={<h2>Could not fetch data.</h2>}>
  <Suspense fallback={<h1>Loading...</h1>}>
    <Profile />
  </Suspense>
</ErrorBoundary>
```

## onDiscarded

Called when a request is ignored due to race conditions:

```tsx
useSWR('/api/data', fetcher, {
  onDiscarded: (key) => {
    console.log('Request discarded for key:', key)
  }
})
```

## Error with useSWRMutation

```tsx
const { trigger, error, isMutating } = useSWRMutation('/api/user', updateUser, {
  throwOnError: true, // default
  onError: (err, key, config) => {
    console.error('Mutation failed:', err)
  }
})

// In event handler
try {
  await trigger(newData)
} catch (e) {
  // Handle mutation error
}
```

### Disable throwOnError

```tsx
const { trigger, error } = useSWRMutation('/api/user', updateUser, {
  throwOnError: false,
})

// Error is in `error` state, not thrown
```

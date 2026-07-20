# Middleware — SWR

## Usage

Middleware receive the SWR hook and can execute logic before and after running it. If there are multiple middleware, each wraps the next one. The last middleware receives the original `useSWR` hook.

```tsx
function myMiddleware(useSWRNext) {
  return (key, fetcher, config) => {
    // Before hook runs...
    const swr = useSWRNext(key, fetcher, config)
    // After hook runs...
    return swr
  }
}
```

> The function name **must not** be capitalized (e.g. `myMiddleware` not `MyMiddleware`) — React lint rules will throw "Rules of Hook" error.

## API

### Passing Middleware

```tsx
// Per-hook
useSWR(key, fetcher, { use: [myMiddleware] })

// Global via SWRConfig
<SWRConfig value={{ use: [myMiddleware] }}>
  <App />
</SWRConfig>
```

### Extend

Middleware are extended like regular options:

```tsx
function Bar() {
  useSWR(key, fetcher, { use: [c] })
}

function Foo() {
  return (
    <SWRConfig value={{ use: [a] }}>
      <SWRConfig value={{ use: [b] }}>
        <Bar />
      </SWRConfig>
    </SWRConfig>
  )
}
// Equivalent to: useSWR(key, fetcher, { use: [a, b, c] })
```

### Multiple Middleware

```tsx
useSWR(key, fetcher, { use: [a, b, c] })
```

Execution order:

```
enter a → enter b → enter c → useSWR() → exit c → exit b → exit a
```

## Examples

### Request Logger

Print all fetcher requests:

```tsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }
    return useSWRNext(key, extendedFetcher, config)
  }
}

useSWR(key, fetcher, { use: [logger] })
// Output: SWR Request: /api/user1
//         SWR Request: /api/user2
```

### Keep Previous Result (Laggy)

Return previous data even after the key changes, until new data loads:

```tsx
import { useRef, useEffect, useCallback } from 'react'

function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    const laggyDataRef = useRef()
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}

// Usage
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### Serialize Object Keys

Serialize array keys to ensure cache stability (not needed since SWR 1.1.0, but useful for older versions or custom serialization):

```tsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// Or globally
<SWRConfig value={{ use: [serialize] }}>
  <App />
</SWRConfig>
```

> Use libs like `fast-json-stable-stringify` instead of `JSON.stringify` for faster, stabler serialization.

### Custom Retry Middleware

```tsx
function retryMiddleware(useSWRNext) {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      if (swr.error && swr.error.status !== 404) {
        const timer = setTimeout(() => swr.mutate(), 5000)
        return () => clearTimeout(timer)
      }
    }, [swr.error])

    return swr
  }
}
```

### Timing Middleware

```tsx
function timingMiddleware(useSWRNext) {
  return (key, fetcher, config) => {
    const startTime = performance.now()
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      if (swr.data) {
        console.log(`SWR [${key}] took ${performance.now() - startTime}ms`)
      }
    }, [swr.data])

    return swr
  }
}
```

## TypeScript Types for Middleware

```tsx
import useSWR, { Middleware, SWRHook } from 'swr'

const swrMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
  // ...
  return useSWRNext(key, fetcher, config)
}
```

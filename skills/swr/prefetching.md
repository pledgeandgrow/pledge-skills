# Prefetching Data — SWR

## Top-Level Page Data

Use HTML `<link rel="preload">` for top-level requests — native, fast, before JavaScript loads:

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

Put it inside `<head>`. All incoming `fetch` requests with the same URL will reuse the result, including SWR.

## Programmatically Prefetch

SWR provides the `preload` API to prefetch resources and store results in the cache. `preload` accepts `key` and `fetcher` as arguments.

```tsx
import { useState } from 'react'
import useSWR, { preload } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

// Preload before rendering — prevents potential waterfalls
preload('/api/user', fetcher)

function User() {
  const { data } = useSWR('/api/user', fetcher)
  // ...
}

export default function App() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button onClick={() => setShow(true)}>Show User</button>
      {show ? <User /> : null}
    </div>
  )
}
```

`preload` can be called outside of React, or inside event handlers and effects:

```tsx
function App({ userId }) {
  const [show, setShow] = useState(false)

  // Preload in effects
  useEffect(() => {
    preload('/api/user?id=' + userId, fetcher)
  }, [userId])

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        onHover={() => preload('/api/user?id=' + userId, fetcher)}
      >
        Show User
      </button>
      {show ? <User /> : null}
    </div>
  )
}
```

### Prefetch in Suspense Mode

In Suspense mode, use `preload` to avoid waterfall problems:

```tsx
import useSWR, { preload } from 'swr'

// Call before rendering
preload('/api/user', fetcher)
preload('/api/movies', fetcher)

const Page = () => {
  // Both requests have already started via preload
  const { data: user } = useSWR('/api/user', fetcher, { suspense: true })
  const { data: movies } = useSWR('/api/movies', fetcher, { suspense: true })

  return (
    <div>
      <User user={user} />
      <Movies movies={movies} />
    </div>
  )
}
```

## Pre-fill Data

Use `fallbackData` to pre-fill existing data into the SWR cache:

```tsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

If SWR hasn't fetched the data yet, the hook returns `prefetchedData` as a fallback.

### Pre-fill Multiple Keys with SWRConfig

```tsx
<SWRConfig value={{
  fallback: {
    '/api/user': userData,
    '/api/posts': postsData,
  }
}}>
  <App />
</SWRConfig>
```

## Pre-fetch in React Server Components (RSC)

When using Next.js App Router with RSC, prefetch data on the server and pass it to client components via `SWRConfig`:

```tsx
// Server Component (Layout)
import { SWRConfig } from 'swr'

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Initiate data fetching on the server side (parallel — no await)
  const userPromise = fetchUserFromAPI()
  const postsPromise = fetchPostsFromAPI()

  return (
    <SWRConfig value={{
      fallback: {
        '/api/user': userPromise,   // Pass promises to client components
        '/api/posts': postsPromise,
      }
    }}>
      {children}
    </SWRConfig>
  )
}
```

```tsx
// Client Component
'use client'
import useSWR from 'swr'

export default function Page() {
  // SWR resolves the promises passed from server components
  // Both user and posts are ready during SSR and client hydration
  const { data: user } = useSWR('/api/user', fetcher)
  const { data: posts } = useSWR('/api/posts', fetcher)

  return (
    <div>
      <h1>{user.name}'s Posts</h1>
      <ul>
        {posts.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  )
}
```

Key benefits:
- Data fetching starts as early as possible on the server
- Only the UI boundaries that consume the data are blocked during streaming SSR
- SWR takes over on the client side after hydration

### strictServerPrefetchWarning

Enable to identify which data fetching calls could benefit from server-side prefetching:

```tsx
<SWRConfig value={{ strictServerPrefetchWarning: true }}>
  <App />
</SWRConfig>
```

Shows a warning in the console when a key has no pre-filled data provided.

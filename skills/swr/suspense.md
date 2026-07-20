# Suspense — SWR

## Basic Usage

Enable the `suspense` option to use SWR with React Suspense:

```tsx
import { Suspense } from 'react'
import useSWR from 'swr'

function Profile() {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })
  return <div>hello, {data.name}</div>
}

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Profile />
    </Suspense>
  )
}
```

> The `suspense` option cannot change during the component lifecycle.

In Suspense mode:
- `data` is always the fetch response (no need to check for `undefined`)
- Errors must be caught with an **error boundary**

## Error Boundaries

```tsx
<ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
  <Suspense fallback={<h1>Loading posts...</h1>}>
    <Profile />
  </Suspense>
</ErrorBoundary>
```

## Avoiding Waterfalls

Suspense mode suspends rendering until data is ready, which causes waterfall problems. Use `preload` to avoid this:

```tsx
import useSWR, { preload } from 'swr'

// Preload before rendering
preload('/api/user', fetcher)
preload('/api/movies', fetcher)

const Page = () => {
  // Both requests started by preload already
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

## With Conditional Fetching

Normally with Suspense, `data` is always ready on render:

```tsx
function Profile() {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })
  // `data` will never be `undefined`
}
```

However, with conditional or dependent fetching, `data` will be `undefined` if the request is paused:

```tsx
function Profile() {
  const { data } = useSWR(isReady ? '/api/user' : null, fetcher, { suspense: true })
  // `data` will be `undefined` if `isReady` is false
}
```

## Server-Side Rendering

When using Suspense mode on the server (including pre-rendering in Next.js), you **must** provide initial data via `fallbackData` or `fallback`:

```tsx
// You cannot use Suspense to fetch data on the server side
// Instead, fetch via framework-level methods (getStaticProps, getServerSideProps)
// and pass as fallback

<SWRConfig value={{
  fallback: {
    '/api/user': userData,
  }
}}>
  <Suspense fallback={<div>loading...</div>}>
    <Profile />
  </Suspense>
</SWRConfig>
```

## Combining with useSWRMutation

```tsx
import { Suspense } from 'react'
import useSWR, { preload } from 'swr'
import useSWRMutation from 'swr/mutation'

function Profile() {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })
  const { trigger } = useSWRMutation('/api/user', updateUser)

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => trigger()}>Update</button>
    </div>
  )
}
```

## keepPreviousData with Suspense

```tsx
function App() {
  const [id, setId] = useState(1)

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Profile id={id} />
    </Suspense>
  )
}

function Profile({ id }) {
  const { data } = useSWR(`/api/user/${id}`, fetcher, {
    suspense: true,
    keepPreviousData: true, // keep showing previous user while loading new one
  })

  return <div>{data.name}</div>
}
```

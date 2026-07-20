# Getting Started with SWR

## Installation

```bash
npm i swr
# or
yarn add swr
# or
pnpm add swr
```

## Quick Start

For RESTful APIs with JSON data, create a fetcher function wrapping the native `fetch`:

```tsx
const fetcher = (...args) => fetch(...args).then(res => res.json())
```

Then import `useSWR` and use it inside any function component:

```tsx
import useSWR from 'swr'

function Profile({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/user/${userId}`, fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return <div>hello {data.name}!</div>
}
```

Three possible states of a request: **loading**, **ready**, or **error**. Use `data`, `error`, and `isLoading` to determine the current state and return the corresponding UI.

> `data` and `error` can exist at the same time — the UI can display existing data while knowing the upcoming request has failed.

## Make It Reusable

Create reusable data hooks on top of SWR:

```tsx
function useUser(id) {
  const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher)
  return {
    user: data,
    isLoading,
    isError: error
  }
}
```

Use it in components:

```tsx
function Avatar({ userId }) {
  const { user, isLoading, isError } = useUser(userId)

  if (isLoading) return <Spinner />
  if (isError) return <Error />
  return <img src={user.avatar} />
}
```

This pattern is **declarative** — you specify what data the component uses, not how to fetch it.

## Global Fetcher

Avoid passing the fetcher to every hook — configure it globally:

```tsx
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{ fetcher: (url) => fetch(url).then(r => r.json()) }}>
      <Page />
    </SWRConfig>
  )
}

// Now no need to pass fetcher
function Page() {
  const { data } = useSWR('/api/data') // uses global fetcher
  return <div>{data.title}</div>
}
```

## Data Fetching Approaches

### Fetch (native)

```tsx
import fetch from 'unfetch'
const fetcher = url => fetch(url).then(r => r.json())
```

> In Next.js, `fetch` is polyfilled — no need to import.

### Axios

```tsx
import axios from 'axios'
const fetcher = url => axios.get(url).then(res => res.data)
```

### GraphQL

```tsx
import { request } from 'graphql-request'

const fetcher = query => request('/api/graphql', query)

function App() {
  const { data, error } = useSWR(
    `{ Movie(title: "Inception") { releaseDate actors { name } } }`,
    fetcher
  )
}
```

With variables — use an array key:

```tsx
const fetcher = ([query, variables]) => request('/api/graphql', query, variables)
const { data } = useSWR([QUERY, { id: 1 }], fetcher)
```

## Multiple Arguments

Pass multiple arguments to the fetcher using an array as the key:

```tsx
// ✅ Correct — token is part of the cache key
const { data: user } = useSWR(['/api/user', token], ([url, token]) => fetchWithToken(url, token))

// ❌ Incorrect — token changes won't trigger revalidation
const { data: user } = useSWR('/api/user', url => fetchWithToken(url, token))
```

### Passing Objects

Since SWR 1.1.0, object-like keys are serialized automatically:

```tsx
// Object key — serialized under the hood
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)

// Array key with object
const { data: orders } = useSWR(['/api/orders', user], fetchWithUser)
```

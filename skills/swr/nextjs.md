# Usage with Next.js — SWR

## App Router

### Server Components

In Next.js App Router, all components are React Server Components (RSC) by default. You can import these from SWR in RSC:

```tsx
import { unstable_serialize } from 'swr'                          // ✅ Available in RSC
import { unstable_serialize as infinite_unstable_serialize } from 'swr/infinite' // ✅ Available in RSC
import { SWRConfig } from 'swr'                                   // ✅ Available in RSC
```

You **cannot** import hook APIs in RSC:

```tsx
import useSWR from 'swr'           // ❌ Not available in server components
import useSWRInfinite from 'swr/infinite' // ❌ Not available in server components
import useSWRMutation from 'swr/mutation' // ❌ Not available in server components
```

### Client Components

Mark components with `'use client'` to use SWR hooks:

```tsx
'use client'

import useSWR from 'swr'

export default function Page() {
  const { data } = useSWR('/api/user', fetcher)
  return <h1>{data.name}</h1>
}
```

### Prefetch Data in Server Components

Initiate data fetching on the server and pass promises to client components:

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
        '/api/user': userPromise,
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
  // SWR resolves the promises — both are ready during SSR and hydration
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
- Only UI boundaries that consume data are blocked during streaming SSR
- SWR takes over on the client side after hydration

### strictServerPrefetchWarning

```tsx
<SWRConfig value={{ strictServerPrefetchWarning: true }}>
  <App />
</SWRConfig>
```

Shows a warning when a key has no pre-filled data — helps identify calls that could benefit from server-side prefetching.

## Client Side Data Fetching

For frequently updating data where SEO isn't needed (dashboards, user-specific pages):

```tsx
'use client'

import useSWR from 'swr'

function Dashboard() {
  const { data, isLoading } = useSWR('/api/dashboard', fetcher)

  if (isLoading) return <div>loading...</div>
  return <div>{data.stats}</div>
}
```

How it works:
1. Immediately show the page without data (with loading states)
2. Fetch data on the client side
3. Display when ready

## Pre-rendering with Default Data

### SSG (getStaticProps)

```tsx
export async function getStaticProps() {
  const article = await getArticleFromAPI()
  return {
    props: {
      fallback: {
        '/api/article': article
      }
    }
  }
}

function Article() {
  // data is always available from fallback
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

The page is pre-rendered (SEO friendly), and after hydration SWR fetches the latest data to keep it fresh.

### SSR (getServerSideProps)

```tsx
export async function getServerSideProps() {
  const article = await getArticleFromAPI()
  return {
    props: {
      fallback: {
        '/api/article': article
      }
    }
  }
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

### Complex Keys with fallback

For array or function keys, use `unstable_serialize`:

```tsx
import useSWR, { unstable_serialize } from 'swr'

export async function getStaticProps() {
  const article = await getArticleFromAPI(1)
  return {
    props: {
      fallback: {
        [unstable_serialize(['api', 'article', 1])]: article,
      }
    }
  }
}

function Article() {
  const { data } = useSWR(['api', 'article', 1], fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

## Pages Router (Legacy)

### Basic Usage

```tsx
import useSWR from 'swr'

function Page() {
  const { data, error } = useSWR('/api/data', fetcher)
  if (error) return <div>failed</div>
  if (!data) return <div>loading</div>
  return <div>{data.title}</div>
}

export default Page
```

### With Custom App

```tsx
// pages/_app.tsx
import { SWRConfig } from 'swr'

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher: (url) => fetch(url).then(r => r.json()) }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
```

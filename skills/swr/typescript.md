# TypeScript — SWR

## Basic Usage

SWR infers argument types of the fetcher from the key automatically.

### useSWR

```tsx
import useSWR from 'swr'

// key is inferred as `string`
useSWR('/api/user', key => {})

// key is inferred as { a: string; b: { c: string; d: number } }
useSWR({ a: '1', b: { c: '3', d: 2 } }, key => {})

// arg0 is string, arg1 is number
useSWR(['user', 8], ([arg0, arg1]) => {})
```

### Explicit Types

```tsx
import useSWR, { Fetcher } from 'swr'

interface User {
  id: string
  name: string
  email: string
}

const fetcher: Fetcher<User, string> = (id) => getUserById(id)
const { data } = useSWR(uid, fetcher)
// data is `User | undefined`
```

### Error Type

```tsx
const { data, error } = useSWR<User, Error>(uid, fetcher)
// data is `User | undefined`
// error is `Error | undefined`
```

### With Options

```tsx
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

const config: SWRConfiguration = {
  fallbackData: "fallback",
  revalidateOnMount: false,
  // ...
}

const { data } = useSWR<string[]>('/api/data', fetcher, config)
```

## Generics

### Specify Data Type

```tsx
// A. Use a typed fetcher — getUser returns User
const { data } = useSWR('/api/user', getUser)

// B. Specify the data type explicitly
const { data } = useSWR<User>('/api/user', fetcher)
```

### Array Key with Types

```tsx
const { data } = useSWR<User, Error>(
  ['/api/user', userId],
  ([url, id]) => fetchUser(url, id)
)
```

### Object Key with Types

```tsx
const { data } = useSWR<Data, Error>(
  { url: '/api/data', params: { page: 1 } },
  ({ url, params }) => fetchData(url, params)
)
```

## useSWRInfinite

```tsx
import useSWRInfinite from 'swr/infinite'
import type { SWRInfiniteKeyLoader } from 'swr/infinite'

const getKey: SWRInfiniteKeyLoader<User[]> = (index, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null
  return `/api/users?page=${index}`
}

const { data } = useSWRInfinite<User[]>(getKey, fetcher)
// data is `User[][] | undefined`
```

## useSWRMutation

```tsx
import useSWRMutation from 'swr/mutation'

async function updateUser(
  url: string,
  { arg }: { arg: { name: string } }
): Promise<User> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
  return res.json()
}

const { trigger, data, error } = useSWRMutation<User, Error>(
  '/api/user',
  updateUser
)

// trigger arg is typed
trigger({ name: 'John' })
```

## useSWRSubscription

### Inline with SWRSubscriptionOptions

```tsx
import useSWRSubscription from 'swr/subscription'
import type { SWRSubscriptionOptions } from 'swr/subscription'

const { data, error } = useSWRSubscription(
  'key',
  (key, { next }: SWRSubscriptionOptions<number, Error>) => {
    // key is inferred as `string`
    // data will be inferred as `number | undefined`
    // error will be inferred as `Error | undefined`
  }
)
```

### With SWRSubscription type

```tsx
import useSWRSubscription from 'swr/subscription'
import type { SWRSubscription } from 'swr/subscription'

const sub: SWRSubscription<string, number, Error> = (key, { next }) => {
  // ...
}

const { data, error } = useSWRSubscription('key', sub)
```

## Middleware Types

```tsx
import useSWR, { Middleware, SWRHook } from 'swr'

const swrMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
  // ...
  return useSWRNext(key, fetcher, config)
}
```

## SWRConfig Types

```tsx
import { SWRConfig } from 'swr'
import type { SWRConfiguration } from 'swr'

const config: SWRConfiguration = {
  fetcher: (url) => fetch(url).then(r => r.json()),
  revalidateOnFocus: true,
  dedupingInterval: 2000,
}

<SWRConfig value={config}>
  <App />
</SWRConfig>
```

## Key Types

```tsx
import type { Key } from 'swr'

// Key can be:
// - string
// - any[] (array)
// - object (serializable)
// - null
// - () => string | any[] | object | null | undefined | falsy

const key: Key = '/api/user'
const key2: Key = ['/api/user', userId]
const key3: Key = { url: '/api/user', id: userId }
```

## Fetcher Type

```tsx
import type { Fetcher } from 'swr'

// Fetcher<Data, Key>
const fetcher: Fetcher<User, string> = (url) => fetch(url).then(r => r.json())
const fetcher2: Fetcher<User[], [string, number]> = ([url, page]) => fetch(`${url}?page=${page}`).then(r => r.json())
```

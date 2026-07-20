# Subscription — SWR

## useSWRSubscription

A React hook for subscribing to real-time data sources with SWR.

```tsx
import useSWRSubscription from 'swr/subscription'

const { data, error } = useSWRSubscription(key, subscribe)
```

### API

```tsx
useSWRSubscription<Data, Error>(
  key: Key,
  subscribe: (key: Key, options: {
    next: (error?: Error | null, data: Data) => void
  }) => () => void
): { data?: Data, error?: Error }
```

#### Parameters

- **key**: A unique key that identifies the data being subscribed to (same as useSWR key)
- **subscribe**: A function that subscribes to the real-time data source
  - **key**: same key as above
  - **options.next**: A function that accepts an error and data, updates state with the latest data

The `subscribe` function returns a cleanup function that will be called when the subscription is no longer needed.

#### Return Values

- **data**: The latest data received from the real-time data source
- **error**: An Error object if an error occurred, otherwise `undefined`

When new data is received, `error` is reset to `undefined`.

## Usage

### Firestore / Firebase

```tsx
import useSWRSubscription from 'swr/subscription'

function Post({ id }) {
  const { data } = useSWRSubscription(
    ['views', id],
    ([_, postId], { next }) => {
      const ref = firebase.database().ref('views/' + postId)

      ref.on('value',
        snapshot => next(null, snapshot.data()),
        err => next(err)
      )

      return () => ref.off()
    }
  )

  return <span>Your post has {data} views!</span>
}
```

### WebSocket

```tsx
import useSWRSubscription from 'swr/subscription'

function App() {
  const { data, error } = useSWRSubscription(
    'ws://...',
    (key, { next }) => {
      const socket = new WebSocket(key)

      socket.addEventListener('message', (event) => next(null, event.data))
      socket.addEventListener('error', (event) => next(event.error))

      return () => socket.close()
    }
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data}!</div>
}
```

### Updater Function

Pass an updater function to `next` that receives the previous data:

```tsx
function subscribe(key, { next }) {
  const sub = remote.subscribe(key, (err, data) => {
    // Append new data to existing array
    next(err, prev => prev.concat(data))
  })
  return () => sub.close()
}
```

## Deduplication

`useSWRSubscription` deduplicates subscription requests with the same key. If multiple components use the same key, they share the same subscription. When the last component using the key unmounts, the subscription is closed.

```tsx
// Component A and B share the same subscription
function ComponentA() {
  const { data } = useSWRSubscription('ws://events', subscribe)
  // ...
}

function ComponentB() {
  const { data } = useSWRSubscription('ws://events', subscribe)
  // ...
}

// Only one WebSocket connection is open
// Both components receive the same data
```

## TypeScript

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

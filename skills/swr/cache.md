# Cache — SWR

## Cache Provider

SWR uses a default in-memory cache (a `Map`). You can customize the cache provider via `SWRConfig`:

```tsx
import { SWRConfig } from 'swr'

<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Custom Cache Provider

```tsx
import { SWRConfig, Cache } from 'swr'

// Custom cache with localStorage persistence
function createPersistentCache() {
  const map = new Map(
    JSON.parse(localStorage.getItem('swr-cache') || '[]')
  )

  // Persist on changes
  const originalSet = map.set.bind(map)
  map.set = (key, value) => {
    originalSet(key, value)
    localStorage.setItem('swr-cache', JSON.stringify([...map.entries()]))
    return map
  }

  return map
}

<SWRConfig value={{ provider: createPersistentCache }}>
  <App />
</SWRConfig>
```

### Multiple Cache Scopes

```tsx
<SWRConfig value={{ provider: () => new Map() }}>
  <SectionA /> {/* has its own cache scope */}
</SWRConfig>

<SWRConfig value={{ provider: () => new Map() }}>
  <SectionB /> {/* has a separate cache scope */}
</SWRConfig>
```

## Accessing the Cache

```tsx
import { useSWRConfig } from 'swr'

function Component() {
  const { cache, mutate } = useSWRConfig()

  // Read from cache
  const data = cache.get('/api/user')

  // Check if key exists
  const hasData = cache.has('/api/user')

  // Iterate over cache
  cache.forEach((value, key) => {
    console.log(key, value)
  })
}
```

## Global Mutate

The global `mutate` function can update any cache key:

```tsx
import { useSWRConfig } from 'swr'

function Component() {
  const { mutate } = useSWRConfig()

  // Update cache with static data
  mutate('/api/user', { name: 'John' })

  // Trigger revalidation
  mutate('/api/user')

  // Optimistic update
  mutate('/api/user', newUser, {
    optimisticData: current => ({ ...current, ...newUser }),
    rollbackOnError: true,
  })
}
```

### Import mutate Globally

```tsx
import { mutate } from 'swr'

mutate('/api/user', data)
```

> Global mutator only updates cache/triggers revalidation if there's a mounted SWR hook using the same key.

## Bound Mutate

Each `useSWR` hook returns a bound `mutate` that doesn't need a key:

```tsx
const { data, mutate } = useSWR('/api/user', fetcher)

// Update local data and revalidate
mutate({ ...data, name: 'New Name' })

// Just revalidate
mutate()
```

## Mutate with Filter Function

Match multiple cache keys:

```tsx
import { mutate } from 'swr'

// Revalidate all matching keys
mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)

// Match array keys
mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)

// Clear all cache
mutate(() => true, undefined, { revalidate: false })
```

## Cache Modifiers

### optimisticData

```tsx
mutate('/api/todos', addTodo(newTodo), {
  optimisticData: todos => [...todos, newTodo],
})
```

### populateCache

```tsx
mutate('/api/todos', updateTodo, {
  populateCache: (updated, current) => {
    return current.map(todo => todo.id === updated.id ? updated : todo)
  },
  revalidate: false,
})
```

### rollbackOnError

```tsx
mutate('/api/todos', addTodo(newTodo), {
  optimisticData: todos => [...todos, newTodo],
  rollbackOnError: true, // revert to previous state on error
})
```

## unstable_serialize

Serialize complex keys for use with `fallback` or global `mutate`:

```tsx
import { unstable_serialize } from 'swr'

// For array keys
const key = unstable_serialize(['api', 'user', 123])

// For function keys (useSWRInfinite)
import { unstable_serialize } from 'swr/infinite'
const infiniteKey = unstable_serialize(getKey)
```

Use in `fallback`:

```tsx
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
```

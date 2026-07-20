# Advanced — SWR

## Understanding SWR

### State Machine

`useSWR` returns `data`, `error`, `isLoading`, and `isValidating` depending on the state of the fetcher function. The state transitions through several scenarios:

**Fetch and Revalidate** — fetch data, then revalidate later.

**Key Change** — fetch data, change key, revalidate.

**Key Change + Previous Data** — with `keepPreviousData` option, previous data is retained during key change.

**Fallback** — with fallback data, the hook returns it immediately while fetching.

**Key Change + Fallback** — key change with fallback data available.

**Key Change + Previous Data + Fallback** — all three combined.

### isLoading vs isValidating

- **`isValidating`** — `true` whenever there is an ongoing request, whether data is loaded or not
- **`isLoading`** — `true` when there is an ongoing request **and** data is not loaded yet

Fallback data and previous data are **not** considered "loaded data" — when using `fallbackData` or `keepPreviousData`, you might have data to display even when `isLoading` is `true`.

```tsx
function Stock() {
  const { data, isLoading, isValidating } = useSWR(STOCK_API, fetcher, {
    refreshInterval: 3000
  })

  // Initial load — nothing to display
  if (isLoading) return <div className="skeleton" />

  // Show data + spinner for background revalidation
  return (
    <>
      <div>${data}</div>
      {isValidating ? <div className="spinner" /> : null}
    </>
  )
}
```

### keepPreviousData for Better UX

When doing data fetching based on continuous user actions (e.g. real-time search), keeping previous data improves UX:

```tsx
function Search() {
  const [search, setSearch] = React.useState('')
  const { data, isLoading } = useSWR(
    `/search?q=${search}`,
    fetcher,
    { keepPreviousData: true }
  )

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <div className={isLoading ? "loading" : ""}>
        {data?.products.map(item => (
          <Product key={item.id} name={item.name} />
        ))}
      </div>
    </div>
  )
}
```

With `keepPreviousData`, you still get the previous data even when the SWR key changes and the new data starts loading.

### Dependency Collection for Performance

SWR only triggers re-rendering when the **used** states have been updated. If you only use `data` in the component, SWR ignores updates to `isValidating` and `isLoading`:

```tsx
// Only uses data → 2 re-renders (initial + data ready)
function App() {
  const { data } = useSWR('/api', fetcher)
  console.log(data)
  return null
}

// Uses all states → 4 re-renders
function App() {
  const { data, error, isLoading, isValidating } = useSWR('/api', fetcher)
  console.log(data, error, isLoading, isValidating)
  return null
}
```

At Vercel, this optimization results in **~60% fewer re-renders**.

---

## Cache

### Cache Provider

A cache provider is a Map-like object matching this interface:

```tsx
interface Cache<Data> {
  get(key: string): Data | undefined
  set(key: string, value: Data): void
  delete(key: string): void
  keys(): IterableIterator<string>
}
```

A JavaScript `Map` instance can be directly used as the cache provider.

### Create Cache Provider

```tsx
import useSWR, { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Page />
    </SWRConfig>
  )
}
```

All SWR hooks inside `<Page/>` will read and write from that `Map` instance.

> Cache providers should be put higher in the component tree, or outside of render. When the provider component re-mounts, the cache is re-created.

> If a cache provider is used, the global `mutate` will not work for SWR hooks under that `<SWRConfig>` boundary. Use `useSWRConfig().mutate` instead.

### Access Current Cache Provider

```tsx
import { useSWRConfig } from 'swr'

function Avatar() {
  const { cache, mutate, ...extraConfig } = useSWRConfig()
  // ...
}
```

### Experimental: Extend Cache Provider

When multiple `<SWRConfig>` components are nested, the cache provider can be extended. The first argument is the upper-level cache provider:

```tsx
<SWRConfig value={{ provider: (cache) => newCache }}>
  ...
</SWRConfig>
```

### Examples

#### LocalStorage Based Persistent Cache

```tsx
function localStorageProvider() {
  // Restore from localStorage on init
  const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))

  // Write back to localStorage before unloading
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  return map
}

<SWRConfig value={{ provider: localStorageProvider }}>
  <App />
</SWRConfig>
```

> Improvement: use memory cache as a buffer, write to localStorage periodically. You can also implement layered cache with IndexedDB or WebSQL.

#### Reset Cache Between Test Cases

```tsx
describe('test suite', async () => {
  it('test case', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <App />
      </SWRConfig>
    )
  })
})
```

#### Modify the Cache Data

Do **not** write to the cache directly. Use `mutate`:

```tsx
const { mutate } = useSWRConfig()

mutate(
  key => true,          // which cache keys are updated
  undefined,            // update cache data to undefined
  { revalidate: false } // do not revalidate
)
```

---

## Performance

### Deduplication

Reuse SWR hooks everywhere without worrying about duplicated requests:

```tsx
function useUser() {
  return useSWR('/api/user', fetcher)
}

function Avatar() {
  const { data, error } = useUser()
  if (error) return <Error />
  if (!data) return <Spinner />
  return <img src={data.avatar_url} />
}

function App() {
  return (
    <>
      <Avatar />
      <Avatar />
      <Avatar />
      <Avatar />
      <Avatar />
    </>
  )
}
```

5 `<Avatar>` components each have a `useSWR` hook. Since they share the same key and render at the same time, **only 1 network request** is made.

Override the deduplication interval with `dedupingInterval`:

```tsx
useSWR('/api/data', fetcher, { dedupingInterval: 5000 }) // default: 2000ms
```

### Deep Comparison

SWR deep compares data changes by default. If the data value hasn't changed, a re-render is not triggered.

Customize the comparison function via `compare`:

```tsx
useSWR('/api/data', fetcher, {
  compare: (a, b) => a.id === b.id // only compare by id
})
```

### Dependency Collection

`useSWR` returns 4 stateful values: `data`, `error`, `isLoading`, `isValidating`. Each can be updated independently. SWR only triggers re-renders for states that are **used** by the component.

```tsx
// Worst case lifecycle (first request fails, retry succeeds):
// console.log(data, error, isLoading, isValidating)
// undefined  undefined  true   true   // → start fetching
// undefined  Error      false  false  // → end fetching, error
// undefined  Error      true   true   // → start retrying
// Data       undefined  false  false  // → end retrying, got data

// If component only uses `data`:
// console.log(data)
// undefined    // → initial render
// Data         // → got data (2 re-renders instead of 4)
```

### Tree Shaking

The SWR package is **tree-shakeable** and **side-effect free**. If you only import `useSWR`, unused APIs like `useSWRInfinite` won't be bundled in your application.

```tsx
// Only useSWR will be bundled
import useSWR from 'swr'

// useSWRInfinite would also be bundled
import useSWRInfinite from 'swr/infinite'
```

---

## React Native

### Global Setup

Wrap your app under `SWRConfig`:

```tsx
<SWRConfig value={{ /* ... */ }}>
  <App />
</SWRConfig>
```

### Customize Focus and Reconnect Events

In React Native, there's no browser `focus` or `online`/`offline` events. SWR provides `isOnline`, `isVisible`, `initFocus`, and `initReconnect` to customize these:

```tsx
import { AppState } from 'react-native'

<SWRConfig value={{
  provider: () => new Map(), // required when using initFocus/initReconnect

  isOnline() {
    // Customize network state detector
    return true
  },

  isVisible() {
    // Customize visibility state detector
    return true
  },

  initFocus(callback) {
    // Register focus listener
    let appState = AppState.currentState
    const onAppStateChange = (nextAppState) => {
      // Resuming from background/inactive to active
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        callback()
      }
      appState = nextAppState
    }

    const subscription = AppState.addEventListener('change', onAppStateChange)
    return () => subscription.remove()
  },

  initReconnect(callback) {
    // Register reconnect listener (e.g. with @react-native-netinfo/netinfo)
    // Trigger callback when network recovers from offline
  }
}}>
  <App />
</SWRConfig>
```

For `initReconnect`, use a library like [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo) to subscribe to network status changes.

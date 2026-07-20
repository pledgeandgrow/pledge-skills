# Pagination — SWR

## When to Use useSWR vs useSWRInfinite

### useSWR — Standard Pagination

For simple page-based fetching where you track the current page in state:

```tsx
import useSWR from 'swr'

function Page() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useSWR(`/api/users?page=${page}&limit=10`, fetcher)

  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  )
}
```

### useSWRInfinite — Infinite Loading

For "load more" patterns where all loaded pages are accumulated:

```tsx
import useSWRInfinite from 'swr/infinite'

function App() {
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
  // data is an array of each page's API response
  // size is the number of pages loaded
  // setSize(n) loads page n
}
```

## useSWRInfinite

```tsx
import useSWRInfinite from 'swr/infinite'

const {
  data,
  error,
  isLoading,
  isValidating,
  mutate,
  size,
  setSize
} = useSWRInfinite(getKey, fetcher?, options?)
```

### API

#### Parameters

- **getKey**: a function that accepts the index and previous page data, returns the key of a page
- **fetcher**: same as useSWR's fetcher function
- **options**: all useSWR options plus 4 extra:

| Option | Default | Description |
|--------|---------|-------------|
| `initialSize` | `1` | Number of pages to load initially |
| `revalidateAll` | `false` | Always try to revalidate all pages |
| `revalidateFirstPage` | `true` | Always try to revalidate the first page |
| `persistSize` | `false` | Don't reset page size when first page's key changes |
| `parallel` | `false` | Fetch multiple pages in parallel |

> `initialSize` cannot change during the component lifecycle.

#### Return Values

- **data**: an array of fetch response values of each page
- **error**: same as useSWR's error
- **isLoading**: same as useSWR's isLoading
- **isValidating**: same as useSWR's isValidating
- **mutate**: same as useSWR's bound mutate but manipulates the data array
- **size**: number of pages that will be fetched and returned
- **setSize**: set the number of pages to fetch

## Example 1: Index Based Paginated API

```tsx
// GET /users?page=0&limit=10
// [{ name: 'Alice', ... }, { name: 'Bob', ... }, ...]

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `/users?page=${pageIndex}&limit=10`
}

function App() {
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

  if (!data) return 'loading'

  // Calculate total users across all pages
  let totalUsers = 0
  for (let i = 0; i < data.length; i++) {
    totalUsers += data[i].length
  }

  return (
    <div>
      <p>{totalUsers} users listed</p>
      {data.map((users, index) =>
        users.map(user => <div key={user.id}>{user.name}</div>)
      )}
      <button onClick={() => setSize(size + 1)}>Load More</button>
    </div>
  )
}
```

The `data` structure is an array of arrays:

```tsx
// data looks like:
[
  [{ name: 'Alice', ... }, { name: 'Bob', ... }, ...],  // page 0
  [{ name: 'John', ... }, { name: 'Paul', ... }, ...],  // page 1
  ...
]
```

## Example 2: Cursor or Offset Based Paginated API

```tsx
// GET /users?cursor=123&limit=10
// { data: [{ name: 'Alice' }, ...], nextCursor: 456 }

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.data) return null // reached the end
  if (pageIndex === 0) return `/users?limit=10` // first page
  return `/users?cursor=${previousPageData.nextCursor}&limit=10`
}
```

## Parallel Fetching Mode

By default, `useSWRInfinite` fetches pages sequentially. Enable `parallel: true` for independent parallel fetching:

```tsx
// parallel = false (default):
// page1 ===> page2 ===> page3 ===> done

// parallel = true:
// page1 ==> done
// page2 =====> done
// page3 ===> done

const getKey = (pageIndex, previousPageData) => {
  return `/users?page=${pageIndex}&limit=10`
}

function App() {
  const { data } = useSWRInfinite(getKey, fetcher, { parallel: true })
}
```

> When `parallel` is enabled, `previousPageData` is always `null`.

## Revalidate Specific Pages

Revalidate only specific pages by passing a function to `revalidate`:

```tsx
function App() {
  const { data, mutate, size } = useSWRInfinite(
    (index) => [`/api/?page=${index + 1}`, index + 1],
    fetcher
  )

  mutate(data, {
    // Only revalidate the last page
    revalidate: (pageData, [url, page]) => page === size
  })
}
```

## Global Mutate with useSWRInfinite

Use `unstable_serialize` to revalidate `useSWRInfinite` data with the global mutate:

```tsx
import { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'

function App() {
  const { mutate } = useSWRConfig()
  mutate(unstable_serialize(getKey))
}
```

> `unstable_serialize` is not a stable API and may change in the future.

## Advanced Features

With `useSWRInfinite` you can implement:
- Loading states (isLoading, isValidating)
- Empty state UI
- Disable "Load More" when reaching the end
- Changeable data source
- Refresh the entire list

## Detecting End of List

```tsx
const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher)

// Check if we've reached the end
const isEmpty = data?.[0]?.length === 0
const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10)
const isRefreshing = isValidating && data && data.length === size

return (
  <div>
    {data?.flat().map(item => <div key={item.id}>{item.name}</div>)}
    <button
      disabled={isLoading || isReachingEnd}
      onClick={() => setSize(size + 1)}
    >
      {isReachingEnd ? 'No more data' : 'Load More'}
    </button>
  </div>
)
```

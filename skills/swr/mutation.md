# Mutation & Revalidation — SWR

## mutate

There are 2 ways to use the mutate API:
- **Global mutate** — can mutate any key
- **Bound mutate** — only mutates the data of the corresponding SWR hook

### Global Mutate

```tsx
import { useSWRConfig } from 'swr'

function App() {
  const { mutate } = useSWRConfig()
  mutate(key, data, options)
}

// Or import globally
import { mutate } from 'swr'
function App() {
  mutate(key, data, options)
}
```

> Using the global mutator with only the key parameter will not update the cache or trigger revalidation unless there is a mounted SWR hook using the same key.

### Bound Mutate

Bound mutate is the short path to mutate the current key — no key parameter needed:

```tsx
import useSWR from 'swr'

function Profile() {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        await requestUpdateUsername(newName)
        // Update local data immediately and revalidate (refetch)
        mutate({ ...data, name: newName })
      }}>
        Uppercase my name!
      </button>
    </div>
  )
}
```

### Revalidation via mutate

Call `mutate(key)` without data to trigger a revalidation (mark data as expired and refetch):

```tsx
import useSWR, { useSWRConfig } from 'swr'

function App() {
  const { mutate } = useSWRConfig()
  return (
    <div>
      <Profile />
      <button onClick={() => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        // Tell all SWRs with this key to revalidate
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

### mutate API

#### Parameters

- **key**: same as useSWR's key, but a function behaves as a filter function
- **data**: data to update the client cache, or an async function for the remote mutation
- **options**: accepts the following:

| Option | Default | Description |
|--------|---------|-------------|
| `optimisticData` | — | Data to immediately update cache, or function receiving current data |
| `revalidate` | `true` | Should cache revalidate after update resolves. Can be a function `(data, key) => boolean` |
| `populateCache` | `true` | Should mutation result be written to cache, or function `(newResult, currentResult) => result` |
| `rollbackOnError` | `true` | Should cache rollback if mutation errors. Can be function `(error) => boolean` |
| `throwOnError` | `true` | Should mutate throw the error when it fails |

#### Return Values

`mutate` returns the resolved data. If the function throws, the error is thrown:

```tsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Handle error
}
```

## useSWRMutation

A hook for remote mutations — only triggered manually, not automatically like `useSWR`.

```tsx
import useSWRMutation from 'swr/mutation'

async function updateUser(url, { arg }: { arg: string }) {
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${arg}` }
  })
}

function Profile() {
  const { trigger } = useSWRMutation('/api/user', updateUser, options)

  return (
    <button onClick={() => trigger('my_token')}>
      Update User
    </button>
  )
}
```

### useSWRMutation API

#### Parameters

- **key**: same as mutate's key
- **fetcher(key, { arg })**: an async function for remote mutation
- **options**:

| Option | Default | Description |
|--------|---------|-------------|
| `optimisticData` | — | Same as mutate's `optimisticData` |
| `revalidate` | `true` | Same as mutate's `revalidate` |
| `populateCache` | `false` | Same as mutate's, but **default is false** |
| `rollbackOnError` | `true` | Same as mutate's `rollbackOnError` |
| `throwOnError` | `true` | Same as mutate's `throwOnError` |
| `onSuccess(data, key, config)` | — | Callback on successful mutation |
| `onError(err, key, config)` | — | Callback on mutation error |

#### Return Values

- **data**: data returned from fetcher
- **error**: error thrown by fetcher (or `undefined`)
- **trigger(arg, options)**: function to trigger a remote mutation
- **reset**: function to reset state (data, error, isMutating)
- **isMutating**: `true` if there's an ongoing remote mutation

### Basic Usage

```tsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }: { arg: { username: string } }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

function App() {
  const { trigger, isMutating } = useSWRMutation('/api/user', sendRequest)

  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'johndoe' })
        } catch (e) {
          // error handling
        }
      }}
    >
      Create User
    </button>
  )
}
```

Using mutation results in rendering:

```tsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

### Defer Loading Data Until Needed

`useSWRMutation` won't start requesting until `trigger` is called:

```tsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  const { data: user, trigger } = useSWRMutation('/api/user', fetcher)

  return (
    <div>
      <button onClick={() => { trigger(); setShow(true) }}>
        Show User
      </button>
      {show && user ? <div>{user.name}</div> : null}
    </div>
  )
}
```

## Optimistic Updates

Update local data immediately while waiting for the remote mutation:

```tsx
import useSWR, { useSWRConfig } from 'swr'

function Profile() {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }

        const options = {
          optimisticData: user,
          rollbackOnError(error) {
            // If it's timeout abort error, don't rollback
            return error.name !== 'AbortError'
          },
        }

        mutate('/api/user', updateFn(user), options)
      }}>
        Uppercase my name!
      </button>
    </div>
  )
}
```

With a function for `optimisticData`:

```tsx
mutate('/api/user', updateUserName(newName), {
  optimisticData: user => ({ ...user, name: newName }),
  rollbackOnError: true
})
```

With `useSWRMutation`:

```tsx
import useSWRMutation from 'swr/mutation'

function Profile() {
  const { trigger } = useSWRMutation('/api/user', updateUserName)

  return (
    <button onClick={async () => {
      const newName = data.name.toUpperCase()
      trigger(newName, {
        optimisticData: user => ({ ...user, name: newName }),
        rollbackOnError: true
      })
    }}>
      Uppercase my name!
    </button>
  )
}
```

## Rollback on Errors

When `optimisticData` is set and the mutation fails, `rollbackOnError` reverts the cache:

```tsx
mutate('/api/user', updateFn(user), {
  optimisticData: user,
  rollbackOnError: true, // default
})
```

## Update Cache After Mutation

Use `populateCache` to update the cache with the mutation response:

```tsx
const updateTodo = () =>
  fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  revalidate: false // API already returns updated data
})
```

With `useSWRMutation`:

```tsx
useSWRMutation('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  revalidate: false
})
```

## Avoid Race Conditions

`useSWRMutation` automatically avoids race conditions with `useSWR`:

```tsx
function Profile() {
  const { data } = useSWR('/api/user', getUser, { revalidateInterval: 3000 })
  const { trigger } = useSWRMutation('/api/user', updateUser)

  return (
    <>
      {data ? data.username : null}
      <button onClick={() => trigger()}>Update User</button>
    </>
  )
}
```

After mutation, `useSWRMutation` tells `useSWR` to ditch ongoing requests and revalidate — stale data is never displayed.

## Mutate Based on Current Data

Pass an async function that receives the current cached value:

```tsx
mutate('/api/todos', async todos => {
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
}, { revalidate: false })
```

## Mutate Multiple Items

The global mutate accepts a filter function to match multiple keys:

```tsx
import { mutate } from 'swr'

// Revalidate all keys starting with '/api/item?id='
mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)

// Match array keys
useSWR(['item', 123], ...)
useSWR(['item', 124], ...)
useSWR(['item', 125], ...)

mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)
```

### Clear All Cache

```tsx
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)

// Clear cache on logout
clearCache()
```

### Filter Function Safety

```tsx
// ✅ Match array keys
mutate(key => key[0].startsWith('/api'), data)

// ✅ Match string keys
mutate(key => typeof key === 'string' && key.startsWith('/api'), data)

// ❌ ERROR: uncertain key shape
mutate(key => /\/api/.test(key.toString()), data)
```

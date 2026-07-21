# Zustand — Guides

## Updating State

### Flat updates
`set()` shallow-merges the new state with existing state. For flat state, directly pass the new values:

```ts
const usePersonStore = create((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName })),
  updateLastName: (lastName) => set(() => ({ lastName })),
}))
```

### Deeply nested objects
For nested state, you must spread each level to maintain immutability:

```ts
// Normal approach
normalInc: () => set((state) => ({
  deep: {
    ...state.deep,
    nested: {
      ...state.deep.nested,
      obj: { ...state.deep.nested.obj, count: state.deep.nested.obj.count + 1 },
    },
  },
}))
```

**With Immer** (simpler):
```ts
immerInc: () => set(produce((state: State) => { ++state.deep.nested.obj.count }))
```

**With optics-ts:**
```ts
opticsInc: () => set(O.modify(O.optic<State>().path('deep.nested.obj.count'))((c) => c + 1))
```

**With Ramda:**
```ts
ramdaInc: () => set(R.modifyPath(['deep', 'nested', 'obj', 'count'], (c) => c + 1))
```

---

## Practice with No Store Actions

State updates can be defined outside the store using `setState`:

```ts
const useStore = create(() => ({ count: 0 }))

// Update from outside the store
useStore.setState({ count: 1 })
useStore.setState((state) => ({ count: state.count + 1 }))
```

This pattern keeps the store definition minimal and colocates update logic where it's used.

---

## Slices Pattern

Split a large store into smaller, composable slices.

### Create individual slices
```ts
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

### Combine slices
```ts
import { create } from 'zustand'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

### Update multiple stores
```ts
export const createBearFishSlice = (set, get) => ({
  addBearAndFish: () => {
    get().addBear()
    get().addFish()
  },
})
```

### Adding middlewares
Wrap the combined store creator with middleware:
```ts
export const useBoundStore = create(devtools((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}), { name: 'bound-store' }))
```

### TypeScript for slices
Use `StateCreator` with mutator parameters:
```ts
const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

With middleware, add mutators:
```ts
StateCreator<MyState, [["zustand/devtools", never]], [], MySlice>
```

---

## Immutable State and Merging

### Nested objects
`set()` merges state at only one level. For nested objects, spread explicitly:

```ts
const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () => set((state) => ({
    nested: { ...state.nested, count: state.nested.count + 1 },
  })),
}))
```

### Replace flag
To disable merging and replace the entire state:
```ts
set((state) => newState, true)
```

---

## Maps and Sets Usage

### Reading
```ts
const foo = useSomeStore((state) => state.foo)
```

### Updating a Map
Always create a new Map instance:
```ts
// Update single entry
set((state) => ({ foo: new Map(state.foo).set(key, value) }))

// Delete entry
set((state) => {
  const next = new Map(state.foo)
  next.delete(key)
  return { foo: next }
})

// Clear
set({ foo: new Map() })
```

### Updating a Set
Same pattern — always create a new Set:
```ts
set((state) => ({ ids: new Set(state.ids).add(newId) }))
```

### Why new instances?
Zustand detects changes by comparing references. Mutating a Map/Set doesn't change its reference, so no re-render is triggered.

### Pitfall: Type hints for empty collections
```ts
{
  ids: new Set([] as string[]),
  users: new Map([] as [string, User][]),
}
```
Without type hints, TypeScript infers `never[]`, preventing adding items later.

---

## Prevent Rerenders with useShallow

When a selector returns a new object/array on every call, components re-render even if the content hasn't changed.

### Problem
```ts
const names = useMeals((state) => Object.keys(state))
// Re-renders even when keys haven't changed
```

### Solution
```ts
import { useShallow } from 'zustand/react/shallow'

const names = useMeals(useShallow((state) => Object.keys(state)))
```

`useShallow` wraps the selector and returns a stable reference when the shallow comparison of the output hasn't changed.

---

## TypeScript Guides

### Beginner TypeScript

**Creating a store with state & actions:**
```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  food: string
  feed: (food: string) => void
}

export const useBearStore = create<BearState>()((set) => ({
  bears: 2,
  food: 'honey',
  feed: (food) => set(() => ({ food })),
}))
```

Note: Use the curried form `create<T>()(...)` — the extra `()` is required for TypeScript to infer types correctly.

**Using the store in components:**
```tsx
function BearCounter() {
  const bears = useBearStore((s) => s.bears)
  return <h1>{bears} bears around</h1>
}
```

**Resetting the store:**
```ts
const initialState = { bears: 0, food: 'honey' }
type BearState = typeof initialState & {
  increase: (by: number) => void
  reset: () => void
}

const useBearStore = create<BearState>()((set) => ({
  ...initialState,
  increase: (by) => set((s) => ({ bears: s.bears + by })),
  reset: () => set(initialState),
}))
```

**With combine middleware:**
```ts
import { combine } from 'zustand/middleware'

export const useBearStore = create(combine(
  { bears: 0 },
  (set) => ({ increase: () => set((s) => ({ bears: s.bears + 1 })) }),
))
```

**With devtools middleware:**
```ts
import { devtools } from 'zustand/middleware'

export const useBearStore = create(devtools((set) => ({
  bears: 0,
  increase: () => set((s) => ({ bears: s.bears + 1 })),
})))
```

**With persist middleware:**
```ts
import { persist } from 'zustand/middleware'

export const useBearStore = create(persist(
  (set) => ({ bears: 0, increase: () => set((s) => ({ bears: s.bears + 1 })) }),
  { name: 'bear-storage' },
))
```

**Async actions:**
```ts
interface BearState {
  bears: number
  fetchBears: () => Promise<void>
}

export const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  fetchBears: async () => {
    const res = await fetch('/api/bears')
    const data: BearData = await res.json()
    set({ bears: data.count })
  },
}))
```

### Advanced TypeScript

**Why curried form is needed:**
The generic `T` in `create` is invariant (both covariant and contravariant) because `stateCreatorFn` both returns `T` and receives it via `get()`. TypeScript cannot infer invariant types, so you must explicitly provide them via `create<T>()(...)`.

**Using middlewares with TypeScript:**
```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useBearStore = create<BearState>()(
  devtools(persist(
    (set) => ({ bears: 0, increase: (by) => set((s) => ({ bears: s.bears + by })) }),
    { name: 'bearStore' },
  )),
)
```

**Without curried workaround (not recommended):**
```ts
const useBearStore = create<
  BearState,
  [['zustand/persist', BearState], ['zustand/devtools', never]]
>(devtools(persist((set) => ({ ... }), { name: 'bearStore' })))
```

**Slices pattern with TypeScript:**
```ts
import { create, StateCreator } from 'zustand'

interface BearSlice { bears: number; addBear: () => void; eatFish: () => void }
interface FishSlice { fishes: number; addFish: () => void }
interface SharedSlice { addBoth: () => void; getBoth: () => number }

const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createSharedSlice: StateCreator<BearSlice & FishSlice, [], [], SharedSlice> = (set, get) => ({
  addBoth: () => { get().addBear(); get().addFish() },
  getBoth: () => get().bears + get().fishes,
})

const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))
```

**Middleware mutators reference:**
- `zustand/persist` — `['zustand/persist', PersistState]`
- `zustand/devtools` — `['zustand/devtools', never]`
- `zustand/immer` — `['zustand/immer', never]`
- `zustand/redux` — `['zustand/redux', Action]`
- `zustand/subscribeWithSelector` — `['zustand/subscribeWithSelector', never]`

---

## Auto-Generating Selectors

Create a `createSelectors` utility to auto-generate typed selectors:

```ts
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}
```

**Usage:**
```ts
const useBearStore = createSelectors(useBearStoreBase)

// Auto-generated selectors
const bears = useBearStore.use.bears()
const increment = useBearStore.use.increment()
```

**Vanilla store version:**
```ts
const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => useStore(_store, (s) => s[k as keyof typeof s])
  }
  return store
}
```

---

## Connect to State with URL Hash

Sync store state with the URL hash for shareable UI state.

### URL hash storage
Create a custom `StateStorage` that reads/writes to the URL hash:

```ts
import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    const storedValue = searchParams.get(key) ?? ''
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.set(key, JSON.stringify(newValue))
    location.hash = searchParams.toString()
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.delete(key)
    location.hash = searchParams.toString()
  },
}

export const useBoundStore = create()(persist(
  (set, get) => ({
    fishes: 0,
    addAFish: () => set({ fishes: get().fishes + 1 }),
  }),
  {
    name: 'food-storage',
    storage: createJSONStorage(() => hashStorage),
  },
))
```

### URL query parameters with localStorage fallback
Conditionally connect state to URL query params while keeping localStorage as fallback:

```ts
const persistentStorage: StateStorage = {
  getItem: (key): string => {
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      return JSON.parse(searchParams.get(key) as string)
    }
    return JSON.parse(localStorage.getItem(key) as string)
  },
  setItem: (key, newValue): void => {
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      searchParams.set(key, JSON.stringify(newValue))
      window.history.replaceState(null, '', `?${searchParams.toString()}`)
    }
    localStorage.setItem(key, JSON.stringify(newValue))
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch())
    searchParams.delete(key)
    window.location.search = searchParams.toString()
  },
}
```

### Building shareable URLs
```ts
const buildShareableUrl = (params, version = 0) => {
  const searchParams = new URLSearchParams()
  const zustandStoreParams = {
    state: { typesOfFish: params.typesOfFish, numberOfBears: params.numberOfBears },
    version: version,
  }
  searchParams.set('fishAndBearsStore', JSON.stringify(zustandStoreParams))
  return `${window.location.origin}?${searchParams.toString()}`
}
```

---

## Event Handler in Pre React 18

In React 17 and earlier, `setState` called outside a React event handler is handled synchronously, which can cause the zombie-child effect. Wrap updates in `unstable_batchedUpdates`:

```ts
import { unstable_batchedUpdates } from 'react-dom' // or 'react-native'

const useFishStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 })),
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useFishStore.getState().increaseFishes()
  })
}
```

Note: React 18+ automatically batches all state updates, so this workaround is not needed for React 18 and above.

---

## Next.js Setup

### Create a store per request
Use `createStore` from `zustand/vanilla` to create a store factory:

```ts
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

export const createCounterStore = (initState: CounterState = defaultInitState) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

### Provide the store via context
```tsx
// src/providers/counter-store-provider.tsx
import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'

const CounterStoreContext = createContext<ReturnType<typeof createCounterStore> | undefined>(undefined)

export function CounterStoreProvider({ children }) {
  const [store] = useState(() => createCounterStore())
  return <CounterStoreContext.Provider value={store}>{children}</CounterStoreContext.Provider>
}

export function useCounterStore<T>(selector: (state: CounterStore) => T) {
  const store = useContext(CounterStoreContext)
  if (!store) throw new Error('useCounterStore must be used within CounterStoreProvider')
  return useStore(store, selector)
}
```

### Pages Router
```tsx
// src/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <CounterStoreProvider>
      <Component {...pageProps} />
    </CounterStoreProvider>
  )
}
```

### App Router
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  )
}

// Components must use 'use client'
```

---

## SSR and Hydration

### Server-side rendering
Render components to HTML strings on the server. Zustand stores work on the server without modification.

### Hydration
Use `hydrateRoot` to hydrate the static markup on the client. Ensure the store's initial state matches between server and client to avoid hydration mismatches.

For persisted stores, use `skipHydration: true` and manually call `rehydrate()` after mount:
```tsx
useEffect(() => { useBoundStore.persist.rehydrate() }, [])
```

---

## Initialize State with Props

Seed a store's initial state from React component props using a context provider pattern:

```tsx
import { createStore } from 'zustand'
import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'

const createCounterStore = (initialCount: number) =>
  createStore((set) => ({
    count: initialCount,
    inc: () => set((s) => ({ count: s.count + 1 })),
  }))

const StoreContext = createContext<ReturnType<typeof createCounterStore> | undefined>(undefined)

function StoreProvider({ initialCount, children }) {
  const [store] = useState(() => createCounterStore(initialCount))
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
```

**Common patterns:**
- Wrap the context provider for clean API
- Extract context logic into a custom hook
- Use memoized selectors for stable outputs
- Allow custom equality functions via `useStoreWithEqualityFn`

---

## Testing

### Test environment setup
- **Test runners**: Jest, Vitest
- **UI testing**: React Testing Library
- **Network testing**: MSW (Mock Service Worker)

### Resetting stores between tests

**Shared store creator:**
```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'
export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

**Jest mock:**
```ts
import { actual } from 'zustand'
jest.mock('zustand', () => {
  const actualZustand = jest.requireActual('zustand')
  return {
    ...actualZustand,
    create: (stateCreator) => {
      const store = actualZustand.create(stateCreator)
      const initialState = store.getState()
      store.reset = () => store.setState(initialState, true)
      return store
    },
  }
})
```

**Vitest mock:**
```ts
import { vi } from 'vitest'
vi.mock('zustand', () => {
  const actualZustand = vi.importActual('zustand')
  return {
    ...actualZustand,
    create: (stateCreator) => {
      const store = actualZustand.create(stateCreator)
      const initialState = store.getState()
      store.reset = () => store.setState(initialState, true)
      return store
    },
  }
})
```

### Testing components
```tsx
import { render, screen } from '@testing-library/react'
import { Counter } from './Counter'

test('renders count', () => {
  render(<Counter />)
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### Testing stores
Test store logic directly without React:
```ts
import { useCounterStore } from './stores/use-counter-store'

test('increment', () => {
  useCounterStore.getState().inc()
  expect(useCounterStore.getState().count).toBe(2)
})
```

For scoped stores, use the context provider pattern in tests.

---

## Flux-Inspired Practice

### Recommended patterns
- **Single store**: Keep global state in one store. Use slices for large apps.
- **Use `set` / `setState`**: Always use `set` or `setState` to update — ensures proper merging and listener notification.
- **Colocate store actions**: Define actions directly in the store:
```ts
const useBoundStore = create((set) => ({
  sliceA: ...,
  sliceB: ...,
  updateX: () => set(...),
  updateY: () => set(...),
}))
```

### Redux-like patterns
For those who prefer Redux patterns, use the `redux` middleware:
```ts
import { redux } from 'zustand/middleware'

const useStore = create(redux(reducer, initialState))
useStore.getState().dispatch({ type: 'action' })
```

---

## How to Reset State

Define initial state separately and add a reset action:

```ts
const initialState = { bears: 0 }

const useBearStore = create((set) => ({
  ...initialState,
  increase: () => set((s) => ({ bears: s.bears + 1 })),
  reset: () => set(initialState),
}))
```

Or use the replace flag:
```ts
reset: () => set(initialState, true)
```

For stores with middleware, reset may need to account for middleware state. With `persist`, clear storage first:
```ts
reset: () => {
  useBearStore.persist.clearStorage()
  set(initialState, true)
}
```

# Zustand — API Reference

## APIs

### `create(stateCreatorFn)`

Creates a store bound to React via hooks.

**Parameters:**
- `stateCreatorFn`: A function that takes `set`, `get`, and `store` as arguments. Returns an object with state and actions.

**Returns:**
A React Hook with API utilities attached: `setState`, `getState`, `getInitialState`, `subscribe`.

**Signature:**
```ts
function create<T>(): (initializer: StateCreator<T, [], []>) => UseBoundStore<StoreApi<T>>
function create<T, Mutators extends [StoreMutatorIdentifier, unknown][]>(
  initializer: StateCreator<T, [], Mutators>
): UseBoundStore<StoreApi<T>>
```

**Usage — updating state based on previous state:**
```ts
import { create } from 'zustand'

const useAgeStore = create((set) => ({
  age: 42,
  setAge: (nextAge) => set((state) => ({
    age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
  })),
}))
```

**Updating primitives:**
```ts
const useXStore = create<number>()(() => 0)
// Use setState with replace=true for primitive state
useXStore.setState(nextX, true)
```

**Updating objects:**
```ts
set((state) => ({ key: newValue }))
```

**Updating arrays:**
```ts
set((state) => ({ items: [...state.items, newItem] }))
```

**Updating state with no store actions:**
```ts
const useStore = create(() => ({ count: 0 }))
// Update externally
useStore.setState({ count: 1 })
```

**Subscribing to state updates:**
```ts
useStore.subscribe((state) => console.log(state))
```

**Troubleshooting — screen doesn't update:**
- Ensure you're creating a new object/array reference (not mutating)
- For primitives, use `setState(value, true)` with the replace flag

---

### `createStore(stateCreatorFn)`

Creates a standalone vanilla store without React binding.

**Parameters:**
- `stateCreatorFn`: Same as `create` — takes `set`, `get`, `store`.

**Returns:**
A vanilla store with `setState`, `getState`, `getInitialState`, `subscribe`.

**Usage:**
```ts
import { createStore } from 'zustand/vanilla'

const store = createStore((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

store.subscribe((state) => console.log(state))
store.getState().inc()
```

Use with React via `useStore`:
```ts
import { useStore } from 'zustand'
const Component = () => {
  const count = useStore(store, (state) => state.count)
  return <div>{count}</div>
}
```

---

### `createWithEqualityFn(stateCreatorFn, defaultEqualityFn)`

Like `create`, but with a custom equality function for selector comparison.

**Parameters:**
- `stateCreatorFn`: State creator function
- `defaultEqualityFn`: Function `(a, b) => boolean` used to compare selector outputs. Defaults to `Object.is`.

**Import:**
```ts
import { createWithEqualityFn } from 'zustand/traditional'
```

Requires `use-sync-external-store` as a peer dependency:
```bash
npm install use-sync-external-store
```

---

### `shallow(a, b)`

Shallow comparison utility. Returns `true` when `a` and `b` are equal based on a shallow comparison of their top-level properties.

**Import:**
```ts
import { shallow } from 'zustand/shallow'
```

**Comparing primitives:** Direct `===` comparison.
**Comparing objects:** Compares top-level keys with `===`.
**Comparing Sets:** Compares size and membership.
**Comparing Maps:** Compares size and entries.

**Troubleshooting:**
- Comparing objects returns `false` even if identical: `shallow` compares by reference for each property, not deeply
- Objects with different prototypes: `shallow` does not check prototype chains

---

## Hooks

### `useStore(store, selectorFn)`

Access and subscribe to a vanilla store from a React component.

**Parameters:**
- `store`: A vanilla store created with `createStore`
- `selectorFn`: `(state) => T` — selects a slice of state

**Usage — global vanilla store:**
```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

const store = createStore((set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }))

function Counter() {
  const count = useStore(store, (s) => s.count)
  return <button onClick={store.getState().inc}>{count}</button>
}
```

**Scoped (non-global) vanilla store with context:**
```tsx
const StoreContext = createContext(store)

function Component() {
  const store = useContext(StoreContext)
  const count = useStore(store, (s) => s.count)
  return <div>{count}</div>
}
```

---

### `useStoreWithEqualityFn(store, selectorFn, equalityFn)`

Like `useStore`, but with a custom equality function.

**Import:**
```ts
import { useStoreWithEqualityFn } from 'zustand/traditional'
```

---

### `useShallow(selectorFn)`

Wraps a selector to return a stable reference using shallow comparison. Prevents unnecessary re-renders when a selector returns a new object/array with the same content.

**Import:**
```ts
import { useShallow } from 'zustand/react/shallow'
```

**Usage:**
```ts
const { count, text } = useStore(useShallow((state) => ({
  count: state.count,
  text: state.text,
})))
```

**Troubleshooting — "Maximum update depth exceeded":**
This happens when a selector returns a new reference on every call. Use `useShallow` to return a stable reference, or ensure the selector returns a primitive or stable reference.

---

## Middlewares

### `persist(stateCreatorFn, persistOptions)`

Persist and rehydrate state using localStorage or a custom storage engine.

**Import:**
```ts
import { persist, createJSONStorage } from 'zustand/middleware'
```

**Usage:**
```ts
const useStore = create()(persist(
  (set, get) => ({
    bears: 0,
    addABear: () => set({ bears: get().bears + 1 }),
  }),
  {
    name: 'food-storage',
    storage: createJSONStorage(() => sessionStorage),
  },
))
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | (required) | Key used in storage; must be unique |
| `storage` | `() => StateStorage` | `createJSONStorage(() => localStorage)` | Storage engine |
| `partialize` | `(state) => Object` | `(state) => state` | Pick specific fields to persist |
| `onRehydrateStorage` | `(state) => ((state?, error?) => void) \| void` | — | Listener called on hydration |
| `version` | `number` | `0` | Version number for migrations |
| `migrate` | `(persistedState, version) => Object \| Promise<Object>` | `(s) => s` | Handle version migrations |
| `merge` | `(persistedState, currentState) => Object` | Shallow merge | Custom merge function |
| `skipHydration` | `boolean \| undefined` | `undefined` | Skip auto-hydration; call `rehydrate()` manually |

**Partialize example:**
```ts
partialize: (state) => ({ foo: state.foo })
```

**Versioning and migration:**
```ts
persist(
  (set) => ({ newField: 0 }),
  {
    version: 1,
    migrate: (persistedState, version) => {
      if (version === 0) {
        persistedState.newField = persistedState.oldField
        delete persistedState.oldField
      }
      return persistedState
    },
  },
)
```

**Custom deep merge:**
```ts
merge: (persistedState, currentState) => deepMerge(currentState, persistedState)
```

**Manual hydration:**
```ts
// Set skipHydration: true, then:
useEffect(() => { useBoundStore.persist.rehydrate() }, [])
```

**Persist API (accessed via `store.persist`):**

| Method | Type | Description |
|--------|------|-------------|
| `getOptions` | `() => Partial<PersistOptions>` | Get current options |
| `setOptions` | `(newOptions) => void` | Update options (merged) |
| `clearStorage` | `() => void` | Clear stored data |
| `rehydrate` | `() => Promise<void>` | Trigger rehydration manually |
| `hasHydrated` | `() => boolean` | Check if hydrated (non-reactive) |
| `onHydrate` | `(listener) => () => void` | Subscribe to hydration start |
| `onFinishHydration` | `(listener) => () => void` | Subscribe to hydration end |

**`createJSONStorage`:**
Helper to create a storage object compliant with `StateStorage`. Handles JSON serialization/deserialization.

**FAQ:**
- Check hydration: `useBoundStore.persist.hasHydrated()`
- Custom storage engine: pass via `storage: createJSONStorage(() => myStorage)`
- Storage event rehydration: listen to `window.addEventListener('storage', ...)`
- Map and Set: use `partialize` to convert to arrays before persisting

---

### `devtools(stateCreatorFn, devtoolsOptions)`

Connect a store to Redux DevTools for time-travel debugging.

**Import:**
```ts
import { devtools } from 'zustand/middleware'
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | — | Custom identifier in DevTools |
| `enabled` | `boolean` | `true` in dev, `false` in prod | Enable/disable DevTools |
| `anonymousActionType` | `string` | `'anonymous'` | Label for anonymous mutations |
| `store` | `string` | — | Custom store identifier |
| `actionsDenylist` | `string[]` | — | Regex patterns to filter actions |

**Usage:**
```ts
const useStore = create()(devtools(
  (set) => ({
    bears: 0,
    increase: () => set((s) => ({ bears: s.bears + 1 })),
  }),
  { name: 'bear-store' },
))
```

**Troubleshooting:**
- Only one store displayed: give each store a unique `name`
- All actions labeled 'anonymous': name your set calls or use `anonymousActionType`

---

### `redux(reducerFn, initialState)`

Use a reducer and dispatch pattern similar to Redux.

**Parameters:**
- `reducerFn`: `(state, action) => newState` — pure reducer function
- `initialState`: Initial state value (not a function)

**Usage:**
```ts
import { redux } from 'zustand/middleware'

const useStore = create(redux(
  (state, action) => {
    switch (action.type) {
      case 'increment': return { count: state.count + 1 }
      default: return state
    }
  },
  { count: 0 },
))

// Dispatch
useStore.getState().dispatch({ type: 'increment' })
```

---

### `immer(stateCreatorFn)`

Write state updates with mutable syntax using Immer.

**Import:**
```ts
import { immer } from 'zustand/middleware/immer'
```

**Installation:**
```bash
npm install immer
```

**Usage:**
```ts
const useStore = create()(immer((set) => ({
  count: 0,
  increment: (qty) => set((state) => { state.count += qty }),
})))
```

**Gotchas:**
- Subscriptions may not be called if you mutate without returning — Immer handles this internally but be aware of edge cases
- Always use `set((state) => { mutation; })` pattern

---

### `combine(initialState, additionalStateCreatorFn)`

Combine separate state slices into a single store with inferred types.

**Parameters:**
- `initialState`: Initial state value
- `additionalStateCreatorFn`: Function taking `set`, `get`, `store`

**Usage:**
```ts
import { combine } from 'zustand/middleware'

const useStore = create(combine(
  { bears: 0 },
  (set) => ({
    increase: () => set((s) => ({ bears: s.bears + 1 })),
  }),
))
```

Benefits: TypeScript automatically infers types from state and actions without interfaces.

---

### `subscribeWithSelector(stateCreatorFn)`

Subscribe to a slice of state with selector and equality support.

**Import:**
```ts
import { subscribeWithSelector } from 'zustand/middleware'
```

**Usage:**
```ts
const useStore = create(subscribeWithSelector((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
})))

// Subscribe to specific slice
useStore.subscribe(
  (state) => state.count,
  (count) => console.log('count changed:', count),
)
```

---

## Integrations

### Persisting Store Data

Detailed guide for the `persist` middleware. See the `persist` section above for full options and API reference.

Key topics:
- Simple example with localStorage/sessionStorage
- TypeScript typed persist
- All options (name, storage, partialize, onRehydrateStorage, version, migrate, merge, skipHydration)
- Full persist API (getOptions, setOptions, clearStorage, rehydrate, hasHydrated, onHydrate, onFinishHydration)
- createJSONStorage helper
- Hydration with asynchronous storages
- Usage in Next.js (skipHydration + manual rehydrate)
- FAQ: hydration checks, custom engines, storage events, Map/Set, TypeScript

### Immer Middleware

- Requires `immer` as a direct dependency
- Use `zustand/middleware/immer` import path
- Supports mutable update syntax inside `set()`
- Works with both simple and complex nested state
- Gotcha: subscriptions may not fire if Immer's proxy system doesn't detect changes

### Third-party Libraries

Zustand works with various third-party libraries. The ecosystem includes integrations with:
- Immer for immutable updates with mutable syntax
- Redux DevTools for debugging
- Various storage adapters for persistence

---

## Migrations

### Migrating to v5 from v4

**Changes in v5:**
- Dropped default exports (named exports only)
- Dropped deprecated features
- React 18 minimum required version
- `use-sync-external-store` is a peer dependency (for `createWithEqualityFn` and `useStoreWithEqualityFn` in `zustand/traditional`)
- TypeScript 4.5 minimum
- Dropped UMD/SystemJS support
- Reorganized entry points in package.json
- Dropped ES5 support
- Stricter types when `setState`'s replace flag is set
- Persist middleware behavioral change
- Other small improvements (technically breaking changes)

**Migration — custom equality functions (e.g., `shallow`):**

v4:
```ts
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

const Component = () => {
  const { count, text } = useStore(
    (state) => ({ count: state.count, text: state.text }),
    shallow,
  )
}
```

v5 (option 1 — `createWithEqualityFn`):
```ts
import { createWithEqualityFn as create } from 'zustand/traditional'
// Rest is the same as v4
```

v5 (option 2 — `useShallow`):
```ts
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

const Component = () => {
  const { count, text } = useStore(
    useShallow((state) => ({ count: state.count, text: state.text })),
  )
}
```

**Migration — stable selector outputs:**

v5 requires stable references from selectors. Returning new references causes infinite loops.

v4 (works but unstable):
```ts
const [searchValue, setSearchValue] = useStore((state) => [state.searchValue, state.setSearchValue])
```

v5 fix with `useShallow`:
```ts
import { useShallow } from 'zustand/shallow'
const [searchValue, setSearchValue] = useStore(
  useShallow((state) => [state.searchValue, state.setSearchValue]),
)
```

Or use a stable fallback:
```ts
const FALLBACK_ACTION = () => {}
const action = useStore((state) => state.action ?? FALLBACK_ACTION)
```

**Migration — stricter types for `setState` replace flag (TypeScript only):**
When `replace: true` is passed to `setState`, the type must be the full state, not a partial.

### Migrating to v4 from v3

**`create` change:**
- v3: `create<T, SetState, GetState, Store>(f)`
- v4: `create<T>()(f)` or `create<T, Mutators>(f)`
- If no type parameters: no migration needed
- For leaf middlewares (`combine`, `redux`): remove all type parameters
- Otherwise: replace `create<T, ...>(...)` with `create<T>()(...)`

**`StateCreator` change:**
- v3: `StateCreator<State, SetState, GetState, Store>`
- v4: `StateCreator<State, InMutators, OutMutators, Return>`
- For authoring middlewares or slices, see the Advanced TypeScript Guide

**`PartialState` change:**
- v3: `PartialState<T, K1, K2, K3, K4>`
- v4: `PartialState<T>` (simplified to `Partial<T> | ((state: T) => Partial<T>)`)
- Enable `exactOptionalPropertyTypes` in tsconfig.json

**Other v4 changes:**
- `useStore` — updated signature
- `UseBoundStore` — updated type
- `createContext` — deprecated, use `createStore` + `useStore` with context
- `combine`, `devtools`, `subscribeWithSelector`, `persist` — updated middleware signatures
- `redux` — updated signature

---

## Previous Versions

### `createContext` (v3)
The `createContext` export from `zustand/context` was deprecated in v4 and removed in v5. Replace with:
```ts
import { createStore } from 'zustand'
import { useStore } from 'zustand'
import { createContext, useContext } from 'react'

const StoreContext = createContext<ReturnType<typeof createStore> | undefined>(undefined)

function useMyStore<T>(selector: (state: T) => T) {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useMyStore must be used within StoreProvider')
  return useStore(store, selector)
}
```

---
name: zustand-docs
version: "latest"
tags:
  - zustand
  - react
  - state management
  - store
  - hooks
  - middleware
  - persist
  - devtools
  - immer
  - redux
  - typescript
  - nextjs
  - ssr
  - testing
description: |
  Zustand — small, fast, scalable state management for React. Store creation, hooks, middleware, TypeScript.
---

# Zustand — React State Management

## Overview
Zustand is a small, fast, and scalable state management library for React. It uses a hook-based API with no boilerplate, no providers, and no context. State lives in a store created via `create()`, and components subscribe to slices of that store using selector functions.

## Key Features
- **No providers needed** — stores are standalone hooks, no `<Provider>` wrapper required
- **Hook-based API** — `create()` returns a hook you call with selectors
- **Shallow merge by default** — `set()` shallow-merges state updates
- **Middleware support** — `persist`, `devtools`, `immer`, `redux`, `combine`, `subscribeWithSelector`
- **Vanilla stores** — `createStore()` for framework-agnostic state management
- **TypeScript-first** — curried `create<T>()(...)` pattern for full type inference
- **Performance** — selector-based subscriptions minimize re-renders; `useShallow` for shallow comparison
- **Next.js / SSR compatible** — per-request store creation with context providers

## Quick Reference

### Create a store
```ts
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### Use in a component
```tsx
function Counter() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  return <button onClick={increment}>{count}</button>
}
```

### With TypeScript (curried form)
```ts
interface BearState {
  bears: number
  increase: (by: number) => void
}
const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

### With persist middleware
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create()(persist(
  (set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }),
  { name: 'my-storage' },
))
```

### Prevent unnecessary re-renders with useShallow
```ts
import { useShallow } from 'zustand/react/shallow'

const { count, text } = useStore(useShallow((state) => ({ count: state.count, text: state.text })))
```

## Package Exports
- `zustand` — `create`, `createStore`, `createWithEqualityFn`
- `zustand/middleware` — `persist`, `devtools`, `redux`, `combine`, `subscribeWithSelector`, `createJSONStorage`, `immer` (from `zustand/middleware/immer`)
- `zustand/react/shallow` — `useShallow`
- `zustand/shallow` — `shallow` (utility function)
- `zustand/vanilla` — `createStore` (vanilla store without React)
- `zustand/traditional` — `createWithEqualityFn`, `useStoreWithEqualityFn` (requires `use-sync-external-store`)

## Documentation Structure
- **SKILL.md** — this overview
- **getting-started.md** — installation, first store, comparison with other libraries, tic-tac-toe tutorial
- **api.md** — full API reference: `create`, `createStore`, `createWithEqualityFn`, `shallow`, hooks (`useStore`, `useStoreWithEqualityFn`, `useShallow`), all middlewares, persist integration, migration guides
- **guides.md** — updating state, slices pattern, immutable merging, Maps/Sets, preventing re-renders, TypeScript guides, auto-generating selectors, Next.js setup, SSR/hydration, testing, Flux patterns, resetting state

## Source
- Official docs: https://zustand.docs.pmnd.rs/
- GitHub: https://github.com/pmndrs/zustand
- npm: https://www.npmjs.com/package/zustand

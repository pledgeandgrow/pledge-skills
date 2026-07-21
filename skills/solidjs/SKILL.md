---
name: solidjs-docs
version: "1.8+"
tags:
  - solidjs
  - solid
  - reactivity
  - signals
  - fine-grained
  - jsx
  - frontend
  - ui
  - solidstart
  - solid-router
description: |
  Comprehensive SolidJS reference covering fine-grained reactivity (signals, effects, memos,
  derived values, lifecycle), components (JSX, props, events, class/style, refs), stores
  (createStore, produce, reconcile, unwrap), control flow (Show, Switch/Match, For, Index,
  Dynamic, ErrorBoundary, Portal), context, rendering (render, hydrate), reactive utilities
  (batch, untrack, on), and ecosystem (Solid Router, SolidStart, Solid Meta). Use whenever
  the user mentions SolidJS, Solid, fine-grained reactivity, signals, or SolidStart.
---

# SolidJS Expert (1.8+)

**Official Documentation:** https://docs.solidjs.com/

## Quick Reference

| Topic | File |
|-------|------|
| Reactivity: `createSignal`, `createEffect`, `createMemo`, derived signals, `onMount`, `onCleanup` | `core-reactivity.md` |
| Components: JSX, props, event handlers, class/style, `classList`, refs | `core-components.md` |
| Stores: `createStore`, path syntax, `produce`, `reconcile`, `unwrap` | `core-stores.md` |
| Control Flow: `Show`, `Switch`/`Match`, `For`, `Index`, `Dynamic`, `ErrorBoundary`, `Portal` | `control-flow.md` |
| Context: `createContext`, `useContext`, provider patterns | `context.md` |
| Ecosystem: Solid Router, SolidStart, Solid Meta, deployment, guides | `ecosystem.md` |

## Core Philosophy

Solid is a **modern JavaScript framework** for building responsive, high-performing user interfaces. It embraces **fine-grained reactivity** — updating only the parts of the DOM that need to change when data changes, rather than re-running entire components.

### Key Advantages

- **Performant:** Fine-grained reactivity updates only what changed — no virtual DOM diffing
- **Powerful:** Less memory and processing power; flexibility over how and when updates happen
- **Pragmatic:** Freedom to choose strategies that work best for your project
- **Productive:** Clear and predictable API suitable for developers of all skill levels

### How Solid Differs

Unlike React or other frameworks that re-run component functions on every state change:

1. **Components run once** — A Solid component's body executes only once, when first rendered into the DOM
2. **Reactive system takes over** — After initial render, the reactive system monitors for state changes and updates only the relevant DOM nodes
3. **No virtual DOM** — Solid compiles JSX directly to real DOM nodes with reactive bindings
4. **Signals are primitives** — `createSignal`, `createEffect`, `createMemo` are the building blocks

## Quick Start

### Create a New Project

```bash
npm init solid
# or
pnpm create solid
# or
yarn create solid
# or
bun create solid
```

The CLI guides through project name, SolidStart vs. plain Solid, template selection (ts, ts-vitest, ts-uvu, ts-unocss, ts-tailwindcss), and TypeScript support.

### Install and Run

```bash
cd solid-project
npm install
npm run dev
```

### Minimal Example

```tsx
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <div>
      <span>Count: {count()}</span>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

## Architecture Overview

```
solid-js/
├── solid-js           Core: signals, effects, memos, context, lifecycle, control flow
├── solid-js/store     Stores: createStore, produce, reconcile, unwrap
├── solid-js/web       Rendering: render, hydrate, renderToString, renderToStream, isServer, Dynamic, Portal, Devtools
├── @solidjs/router    Router: nested routing, data loading, navigation
├── @solidjs/meta      Meta: document head management (SSR-ready)
└── solid-start        SolidStart: full-stack meta-framework (SSR/SSG/CSR)
```

## TypeScript Configuration

Solid has first-class TypeScript support. Use the Solid TypeScript template or configure `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["solid-js"]
  }
}
```

## Key Concepts at a Glance

| Concept | Description |
|---------|-------------|
| **Signals** | Reactive primitives that store values and notify subscribers on change |
| **Effects** | Side effects that re-run when tracked signals change |
| **Memos** | Memoized derived values that cache computation results |
| **Resources** | Async data fetching with `createResource` — loading/error states, `mutate`, `refetch` |
| **Suspense** | Async boundary — shows fallback while descendant resources are loading |
| **Stores** | Proxy-based reactive objects for deeply nested state |
| **Context** | Dependency injection for sharing state across component trees |
| **Control Flow** | `<Show>`, `<For>`, `<Switch>`, `<Index>`, `<Dynamic>`, `<ErrorBoundary>`, `<Portal>`, `<Suspense>` |
| **Secondary Primitives** | `createComputed`, `createRenderEffect`, `createDeferred`, `createRoot` |
| **Refs** | Direct DOM element access within JSX |
| **SSR** | `renderToString`, `renderToStream`, `hydrate`, `isServer` for server-side rendering |
| **Fine-grained reactivity** | Updates propagate only to dependent DOM nodes, not entire component trees |

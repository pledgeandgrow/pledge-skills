# Zustand — Getting Started

## Installation

```bash
npm install zustand
# or
yarn add zustand
# or
pnpm add zustand
```

## Introduction

Zustand provides a hook-based API for managing React state without providers, boilerplate, or context trees.

### Create your first store

```ts
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
```

### Bind components to the store

```tsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

Key points:
- The store is a **hook** — call it with a selector function to subscribe to specific slices
- **No providers needed** — the store works standalone
- Selectors ensure components only re-render when their subscribed slice changes

## Comparison with Other Libraries

### vs Redux
- **State model**: Redux uses a single state object with reducer-based updates; Zustand uses `set()` for direct updates
- **Render optimization**: Redux connects via `connect` HOC or `useSelector`; Zustand uses selector functions directly
- **Boilerplate**: Zustand requires significantly less boilerplate (no action types, no reducers, no dispatch)

### vs Valtio
- **State model**: Valtio uses proxy-based mutable state; Zustand uses immutable updates with `set()`
- **Render optimization**: Valtio tracks property access automatically; Zustand uses explicit selectors

### vs Jotai
- **State model**: Jotai uses atomic state (individual atoms); Zustand uses a single store object
- **Render optimization**: Jotai tracks atom dependencies; Zustand uses selector functions

### vs Recoil
- **State model**: Recoil uses atoms and selectors; Zustand uses a single store with selectors
- **Render optimization**: Recoil tracks atom dependencies; Zustand uses selector functions

## Tutorial: Tic-Tac-Toe

The official tutorial builds a complete tic-tac-toe game to teach Zustand concepts step by step:

1. **Building the board** — create a store with board state and move actions
2. **Lifting state up** — move state from components into a Zustand store
3. **Taking turns** — track current player in the store
4. **Declaring a winner or draw** — compute derived state from the store
5. **Adding time travel** — store move history for undo/redo
6. **Lifting state up, again** — refactor history into the store
7. **Showing the past moves** — render history list from the store
8. **Final cleanup** — simplify with selectors

Full tutorial: https://zustand.docs.pmnd.rs/learn/guides/tutorial-tic-tac-toe

## Learn Path

### Start here
- Introduction — Install and create your first store
- Comparison with other tools — Redux, Valtio, Jotai, Recoil
- Tutorial: Tic Tac Toe — Step-by-step game

### Core concepts
- Updating state — Primitives, objects, nested state
- Practice with no store actions — Define updates outside the store
- Slices pattern — Split a large store into composable slices
- Immutable state and merging — How `set()` merges state
- Maps and sets usage — Working with Map and Set in state

### Performance and rendering
- Prevent rerenders with useShallow — Shallow comparison for selectors
- Connect to state with URL hash — Sync store with URL
- Event handler in pre React 18 — Batching edge cases

### TypeScript path
- Beginner TypeScript — Type a basic store
- Advanced TypeScript — Slices, middleware stacks, complex patterns
- Auto-generating selectors — Generate typed selectors automatically

### Frameworks and platforms
- Next.js — Setup with SSR
- SSR and hydration — Avoid hydration mismatches
- Initialize state with props — Seed store from component props

### Testing and quality
- Testing stores and components — Test store logic and components
- Flux-inspired practice — Flux conventions with Zustand
- How to reset state — Reset store to initial state

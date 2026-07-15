---
name: React Expert
version: "19.x"
tags:
  - react
  - hooks
  - jsx
  - components
  - frontend
  - ui
description: |
  Comprehensive React 19 reference covering all built-in hooks, components, APIs,
  concurrent features, Server Components, React Compiler, and advanced patterns.
  Use whenever the user mentions React, JSX, hooks, components, state management,
  effects, Context, Suspense, transitions, forms, Server Components, or React Compiler.
---

# React Expert (v19.x)

**Official Documentation:** https://react.dev/reference

## Quick Reference

| Topic | File |
|-------|------|
| State hooks: `useState`, `useReducer` | `state-hooks.md` |
| Effect hooks: `useEffect`, `useLayoutEffect`, `useInsertionEffect` | `effect-hooks.md` |
| Context: `createContext`, `useContext`, Provider pattern | `context.md` |
| Ref hooks: `useRef`, `useImperativeHandle` | `ref-hooks.md` |
| Performance: `useMemo`, `useCallback`, `memo`, `PureComponent` | `performance.md` |
| Concurrent features: `useTransition`, `useDeferredValue`, `useActionState`, `useOptimistic` | `concurrent-features.md` |
| Other hooks: `useId`, `useSyncExternalStore`, `useDebugValue`, `use` | `other-hooks.md` |
| Suspense, `lazy`, streaming | `suspense.md` |
| Built-in components: `Fragment`, `StrictMode`, `Profiler`, `Suspense` | `components.md` |
| Forms: Actions, `useFormStatus`, progressive enhancement | `forms.md` |
| React 19 new features | `react-19.md` |
| Rules of React: purity, hooks rules, ESLint | `rules-of-react.md` |
| Advanced patterns: compound, render props, HOCs, custom hooks | `advanced-patterns.md` |
| React DOM: `createRoot`, hydration, portals, `flushSync` | `react-dom.md` |

## Core Philosophy

React is a **declarative UI library** built on three principles:

1. **Components** — Independent, reusable pieces of UI
2. **Props** — Read-only data flow from parent to child
3. **State** — Mutable data that triggers re-renders when changed

## Component Types

```tsx
// Function Component (recommended)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>
}

// With state
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Component Lifecycle

```
Mount → Render → Commit → (State Change → Re-render → Commit) → Unmount
        ↑                                          ↑
    useEffect (after paint)              useEffect cleanup → new effect
    useLayoutEffect (before paint)
```

## Hooks Rules

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — components or custom hooks
3. **Components and hooks must be pure** — same inputs → same outputs, no side effects during render

```tsx
// ✅ Correct
function Component() {
  const [state, setState] = useState(0)
  useEffect(() => { /* ... */ }, [])
  return <div />
}

// ❌ Wrong — hooks inside condition
function Component() {
  if (condition) {
    useEffect(() => {})  // ❌
  }
}

// ❌ Wrong — hooks after return
function Component() {
  const [state] = useState(0)
  if (!state) return null
  useEffect(() => {})  // ❌ — not always called
}
```

## Installation

```bash
# Modern React app (Vite)
npm create vite@latest my-app -- --template react-ts

# Next.js (includes React 19)
npx create-next-app@latest

# React only
npm install react react-dom
npm install -D @types/react @types/react-dom
```

## React 19 Quick Syntax

```tsx
// Ref as prop (no forwardRef needed)
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Context as provider
<ThemeContext value={theme}>...</ThemeContext>

// Actions with useActionState
function Form() {
  const [state, submitAction, isPending] = useActionState(async (prev, formData) => {
    await saveData(formData)
    return { success: true }
  }, null)
}

// use() API — read promises in render
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)  // Suspends until resolved
  return comments.map(c => <p key={c.id}>{c.text}</p>)
}

// Document metadata anywhere
function BlogPost({ title }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={title} />
      <article>...</article>
    </>
  )
}
```

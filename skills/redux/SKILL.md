---
name: redux-docs
version: "5.x"
tags:
  - redux
  - state management
  - redux toolkit
  - rtk
  - react-redux
  - redux store
  - reducer
  - action
  - dispatch
  - selector
  - middleware
  - thunk
  - createSlice
  - configureStore
  - createAsyncThunk
  - createEntityAdapter
  - immer
  - reselect
  - createSelector
  - redux devtools
  - flux standard action
  - combineReducers
  - applyMiddleware
  - bindActionCreators
  - compose
  - createStore
  - replaceReducer
  - undo history
  - code splitting
  - server rendering
  - typescript
  - testing
  - normalization
  - memoization
  - rtk query
  - listener middleware
  - pure functions
  - immutability
  - single source of truth
  - one-way data flow
description: |
  Redux 5.x + Redux Toolkit 2.x — store, reducers, actions, middleware, slices, async thunks, TypeScript, testing.
---

# Redux Skill

> **Redux** — A JS library for predictable and maintainable global state management.
> **Version**: Redux 5.x + Redux Toolkit 2.x | **Docs**: [redux.js.org](https://redux.js.org/)

## Quick Reference

| Topic | File | Sections |
|-------|------|----------|
| Getting Started & Concepts | `getting-started.md` | What is Redux, installation, core concepts (state, actions, reducers, store, dispatch, selectors), immutability, data flow, Redux Toolkit overview, tutorials structure, should you use Redux |
| API Reference | `api.md` | createStore, combineReducers, applyMiddleware, bindActionCreators, compose, Store API (getState, dispatch, subscribe, replaceReducer) |
| Usage Guide & Best Practices | `usage-guide.md` | Configuring store, code splitting, server rendering, isolating sub-apps, TypeScript, writing tests, troubleshooting, structuring reducers, reducing boilerplate, deriving data with selectors, implementing undo history, style guide (Priority A/B/C rules), FAQ |

## Core Concepts

- **State**: Single source of truth describing the application condition at a point in time
- **Action**: Plain object with a `type` field describing what happened
- **Reducer**: Pure function that takes previous state and an action, returns new state
- **Store**: Object that holds the application state, created from a root reducer
- **Dispatch**: Function that sends an action to the store to trigger a state update
- **Selector**: Function that extracts specific pieces of information from store state
- **Middleware**: Function that wraps the dispatch function to add custom behavior
- **Immutability**: State is never mutated directly; reducers return new state objects
- **One-way data flow**: State → UI → Action → Reducer → New State → UI re-render

## Redux Ecosystem

| Library | Description |
|---------|-------------|
| [Redux Toolkit (RTK)](https://redux-toolkit.js.org) | Official, opinionated, batteries-included toolset for efficient Redux development |
| [React-Redux](https://react-redux.js.org) | Official React bindings for Redux |
| [Redux DevTools](https://github.com/reduxjs/redux-devtools) | Time-travel debugging, action logging |
| [Reselect](https://github.com/reduxjs/reselect) | Memoized selector library |
| [Redux Thunk](https://github.com/reduxjs/redux-thunk) | Async logic middleware (included in RTK) |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | Data fetching and caching (included in RTK) |

## Redux Toolkit (RTK)

Redux Toolkit is the **official recommended approach** for writing Redux logic. It wraps around the Redux core and includes essential packages and functions.

**Key APIs**:
- `configureStore()` — Simplified store setup with devtools middleware
- `createSlice()` — Create reducers + actions together
- `createAsyncThunk()` — Handle async logic
- `createEntityAdapter()` — Normalized state management
- `createReducer()` — Reducer with Immer for immutable updates
- `createAction()` — Action creator factory
- `createListenerMiddleware()` — Side-effect middleware

## Quick Start

```bash
# Install Redux Toolkit
npm install @reduxjs/toolkit react-redux

# Create new project from template
npx tiged reduxjs/redux-templates/packages/vite-template-redux my-app
```

```javascript
// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    addBy: (state, action) => { state.value += action.payload; },
  },
});

export const { increment, decrement, addBy } = counterSlice.actions;

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
```

```jsx
// App.jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./store";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

```jsx
// main.jsx
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## Redux Core API Summary

| Function | Description |
|----------|-------------|
| `createStore(reducer, preloadedState?, enhancer?)` | Create a Redux store (deprecated — use `configureStore`) |
| `combineReducers(reducers)` | Combine multiple slice reducers into one root reducer |
| `applyMiddleware(...middlewares)` | Apply middleware to the store's dispatch function |
| `bindActionCreators(actionCreators, dispatch)` | Wrap action creators for automatic dispatch |
| `compose(...functions)` | Compose functions right-to-left |

## Store API Summary

| Method | Description |
|--------|-------------|
| `store.getState()` | Return current state |
| `store.dispatch(action)` | Dispatch an action |
| `store.subscribe(listener)` | Subscribe to state changes |
| `store.replaceReducer(nextReducer)` | Replace the root reducer (hot reloading, code splitting) |

## Three Principles

1. **Single source of truth** — The state of your whole application is stored in an object tree within a single store
2. **State is read-only** — The only way to change state is to emit an action
3. **Changes are made with pure functions** — Reducers are pure functions of (previousState, action) → newState

## Data Flow

1. Store is created with a root reducer → initial state
2. UI reads state via selectors and subscribes to changes
3. User interaction → `dispatch(action)` → store runs reducer → new state
4. Store notifies subscribers → UI re-renders with new data

## Documentation Links

### Introduction
- [Getting Started](https://redux.js.org/introduction/getting-started) | [Installation](https://redux.js.org/introduction/installation) | [Core Concepts](https://redux.js.org/introduction/core-concepts) | [Motivation](https://redux.js.org/introduction/motivation) | [Prior Art](https://redux.js.org/introduction/prior-art) | [Examples](https://redux.js.org/introduction/examples) | [Learning Resources](https://redux.js.org/introduction/learning-resources) | [Ecosystem](https://redux.js.org/introduction/ecosystem)

### Tutorials
- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) | [Part 2](https://redux.js.org/tutorials/essentials/part-2-app-structure) | [Part 3](https://redux.js.org/tutorials/essentials/part-3-data-flow) | [Part 4](https://redux.js.org/tutorials/essentials/part-4-using-data) | [Part 5](https://redux.js.org/tutorials/essentials/part-5-async-logic) | [Part 6](https://redux.js.org/tutorials/essentials/part-6-performance-normalization) | [Part 7](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics) | [Part 8](https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced) | [Part 9](https://redux.js.org/tutorials/essentials/part-9-rtk-query-typescript) | [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview) | [Part 2](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) | [Part 3](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers) | [Part 4](https://redux.js.org/tutorials/fundamentals/part-4-store) | [Part 5](https://redux.js.org/tutorials/fundamentals/part-5-ui-react) | [Part 6](https://redux.js.org/tutorials/fundamentals/part-6-async-logic-data-flow) | [Part 7](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns) | [Part 8](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux) | [Videos](https://redux.js.org/tutorials/videos)

### Understanding
- [Three Principles](https://redux.js.org/understanding/thinking-in-redux/three-principles) | [Glossary](https://redux.js.org/understanding/thinking-in-redux/glossary) | [Middleware](https://redux.js.org/understanding/history-and-design/middleware)

### Usage Guide
- [Usage Index](https://redux.js.org/usage/) | [Configuring Your Store](https://redux.js.org/usage/configuring-your-store) | [Code Splitting](https://redux.js.org/usage/code-splitting) | [Server Rendering](https://redux.js.org/usage/server-rendering) | [Isolating Redux Sub-Apps](https://redux.js.org/usage/isolating-redux-sub-apps) | [Usage with TypeScript](https://redux.js.org/usage/usage-with-typescript) | [Writing Tests](https://redux.js.org/usage/writing-tests) | [Troubleshooting](https://redux.js.org/usage/troubleshooting) | [Reducing Boilerplate](https://redux.js.org/usage/reducing-boilerplate) | [Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors) | [Implementing Undo History](https://redux.js.org/usage/implementing-undo-history)

### Structuring Reducers
- [Overview](https://redux.js.org/usage/structuring-reducers/structuring-reducers) | [Prerequisite Concepts](https://redux.js.org/usage/structuring-reducers/prerequisite-concepts) | [Basic Reducer Structure](https://redux.js.org/usage/structuring-reducers/basic-reducer-structure) | [Splitting Reducer Logic](https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic) | [Refactoring Reducers Example](https://redux.js.org/usage/structuring-reducers/refactoring-reducer-example) | [Using combineReducers](https://redux.js.org/usage/structuring-reducers/using-combinereducers) | [Beyond combineReducers](https://redux.js.org/usage/structuring-reducers/beyond-combinereducers) | [Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape) | [Updating Normalized Data](https://redux.js.org/usage/structuring-reducers/updating-normalized-data) | [Reusing Reducer Logic](https://redux.js.org/usage/structuring-reducers/reusing-reducer-logic) | [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns) | [Initializing State](https://redux.js.org/usage/structuring-reducers/initializing-state)

### API
- [API Reference](https://redux.js.org/api/api-reference) | [createStore](https://redux.js.org/api/createstore) | [combineReducers](https://redux.js.org/api/combinereducers) | [applyMiddleware](https://redux.js.org/api/applymiddleware) | [bindActionCreators](https://redux.js.org/api/bindactioncreators) | [compose](https://redux.js.org/api/compose) | [Store](https://redux.js.org/api/store)

### Best Practices & FAQ
- [Style Guide](https://redux.js.org/style-guide/) | [FAQ](https://redux.js.org/faq) | [FAQ: General](https://redux.js.org/faq/general) | [FAQ: Reducers](https://redux.js.org/faq/reducers) | [FAQ: Organizing State](https://redux.js.org/faq/organizing-state) | [FAQ: Store Setup](https://redux.js.org/faq/store-setup) | [FAQ: Actions](https://redux.js.org/faq/actions) | [FAQ: Immutable Data](https://redux.js.org/faq/immutable-data) | [FAQ: Code Structure](https://redux.js.org/faq/code-structure) | [FAQ: Performance](https://redux.js.org/faq/performance) | [FAQ: Design Decisions](https://redux.js.org/faq/design-decisions) | [FAQ: React Redux](https://redux.js.org/faq/react-redux) | [FAQ: Miscellaneous](https://redux.js.org/faq/miscellaneous)

### Related
- [React-Redux](https://react-redux.js.org) | [Redux Toolkit](https://redux-toolkit.js.org) | [Redux DevTools](https://github.com/reduxjs/redux-devtools)

**Source**: [Redux Docs](https://redux.js.org/) | [Getting Started](https://redux.js.org/introduction/getting-started) | [API Reference](https://redux.js.org/api/api-reference) | [Usage Guide](https://redux.js.org/usage/) | [Style Guide](https://redux.js.org/style-guide/) | [FAQ](https://redux.js.org/faq)

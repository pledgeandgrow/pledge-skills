# Redux — Getting Started & Concepts

## What is Redux

Redux is a JS library for predictable and maintainable global state management. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. It is tiny (2kB, including dependencies), but has a large ecosystem of addons.

**Key characteristics**:
- **Predictable**: Consistent behavior across environments, easy to test
- **Centralized**: Single source of truth enables undo/redo, state persistence
- **Debuggable**: Redux DevTools for time-travel debugging, action logging
- **Flexible**: Works with any UI layer, large addon ecosystem

## Installation

### Redux Toolkit (Recommended)

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

### Creating a New Redux Project

```bash
# Vite + TypeScript
npx tiged reduxjs/redux-templates/packages/vite-template-redux my-app

# Create React App + TypeScript
npx tiged reduxjs/redux-templates/packages/cra-template-redux-typescript my-app

# Create React App + JavaScript
npx tiged reduxjs/redux-templates/packages/cra-template-redux my-app

# Expo + TypeScript
npx tiged reduxjs/redux-templates/packages/expo-template-redux-typescript my-app

# React Native + TypeScript
npx tiged reduxjs/redux-templates/packages/react-native-template-redux-typescript my-app

# Standalone Redux Toolkit App Structure Example
npx tiged reduxjs/redux-templates/packages/rtk-app-structure-example my-app

# Next.js + Redux
npx create-next-app --example with-redux my-app
```

### Redux Core (Legacy)

```bash
# NPM
npm install redux

# Yarn
yarn add redux
```

### Complementary Packages

```bash
# React bindings
npm install react-redux

# Redux DevTools Extension
npm install @redux-devtools/extension
```

## Core Concepts

### State Management

State management is the process of maintaining and updating data in an application over time. Redux uses a **single source of truth** — all application state is stored in one object tree within a single store.

### Actions

Actions are plain JavaScript objects that describe **what happened**. They must have a `type` field, typically a string constant.

```javascript
// Action
{ type: "counter/increment" }

// Action with payload
{ type: "counter/addBy", payload: 5 }

// Action creator
const addBy = (amount) => ({ type: "counter/addBy", payload: amount });
```

### Reducers

Reducers are **pure functions** that take the previous state and an action, and return a new state. They must never mutate state directly.

```javascript
// Reducer
function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "counter/increment":
      return { ...state, value: state.value + 1 };
    case "counter/decrement":
      return { ...state, value: state.value - 1 };
    case "counter/addBy":
      return { ...state, value: state.value + action.payload };
    default:
      return state;
  }
}
```

**Rules of reducers**:
1. Must not mutate state (return new objects)
2. Must not have side effects (no API calls, no random values)
3. Must not call non-pure functions (e.g., `Date.now()`)
4. Must return the previous state for unknown actions

### Store

The store is the object that holds the application state, created from a root reducer.

```javascript
import { createStore } from "redux";

const store = createStore(counterReducer);
```

### Dispatch

Dispatch sends an action to the store to trigger a state update.

```javascript
store.dispatch({ type: "counter/increment" });
store.dispatch(addBy(5));
```

### Selectors

Selectors are functions that extract specific pieces of information from store state.

```javascript
const selectCounterValue = (state) => state.value;
const currentValue = selectCounterValue(store.getState());
```

### Immutability

Redux requires **immutable state updates**. You must never modify state directly — always return a new object.

```javascript
// ✅ Correct — immutable update
return { ...state, value: state.value + 1 };

// ❌ Wrong — mutating state
state.value += 1;
return state;
```

**Immer** (included in Redux Toolkit) allows writing "mutating" logic that produces immutable updates:

```javascript
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      // "Mutating" code is actually immutable under the hood
      state.value += 1;
    },
  },
});
```

## Redux Application Data Flow

### Initial Setup
1. A Redux store is created using a root reducer function
2. The store calls the root reducer once, saves the return value as initial state
3. UI components access current state and subscribe to future updates

### Updates
1. Something happens in the app (user interaction, async response)
2. App code dispatches an action to the store
3. The store runs the reducer with previous state + action, saves new state
4. The store notifies all subscribed UI components
5. Each component checks if its needed data changed
6. Components with changed data re-render

## Three Principles

1. **Single source of truth**: The state of your whole application is stored in an object tree within a single store
2. **State is read-only**: The only way to change state is to emit an action
3. **Changes are made with pure functions**: Reducers are pure functions of (previousState, action) → newState

## Redux Toolkit Overview

Redux Toolkit (RTK) is the official, opinionated, batteries-included toolset for efficient Redux development. It builds in suggested best practices, simplifies most Redux tasks, prevents common mistakes.

**Key APIs**:
- `configureStore()` — Simplified store setup with sensible defaults
- `createSlice()` — Create reducers + actions together in one place
- `createAsyncThunk()` — Handle async logic (API calls, etc.)
- `createEntityAdapter()` — Normalized state management for collections
- `createReducer()` — Reducer with Immer for immutable updates
- `createAction()` — Action creator factory
- `createListenerMiddleware()` — Side-effect middleware (replacement for sagas in many cases)
- `createDynamicMiddleware()` — Add middleware at runtime
- `combineSlices()` — Combine slices for code splitting

## Tutorials Structure

### Redux Essentials Tutorial

The official tutorial for learning how to use Redux the right way, using Redux Toolkit.

| Part | Topic | URL |
|------|-------|-----|
| Part 1 | Redux Overview and Concepts | [part-1-overview-concepts](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) |
| Part 2 | Redux Toolkit App Structure | [part-2-app-structure](https://redux.js.org/tutorials/essentials/part-2-app-structure) |
| Part 3 | Basic Redux Data Flow | [part-3-data-flow](https://redux.js.org/tutorials/essentials/part-3-data-flow) |
| Part 4 | Working with Async Logic | [part-4-using-data](https://redux.js.org/tutorials/essentials/part-4-using-data) |
| Part 5 | Async Logic and Data Fetching | [part-5-async-logic](https://redux.js.org/tutorials/essentials/part-5-async-logic) |
| Part 6 | Performance and Normalizing Data | [part-6-performance-normalization](https://redux.js.org/tutorials/essentials/part-6-performance-normalization) |
| Part 7 | RTK Query Basics | [part-7-rtk-query-basics](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics) |
| Part 8 | RTK Query Advanced Patterns | [part-8-rtk-query-advanced](https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced) |
| Part 9 | RTK Query and TypeScript | [part-9-rtk-query-typescript](https://redux.js.org/tutorials/essentials/part-9-rtk-query-typescript) |

### Redux Fundamentals Tutorial

Learn the fundamental Redux concepts and how they work under the hood.

| Part | Topic | URL |
|------|-------|-----|
| Part 1 | Redux Overview | [part-1-overview](https://redux.js.org/tutorials/fundamentals/part-1-overview) |
| Part 2 | Concepts and Data Flow | [part-2-concepts-data-flow](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) |
| Part 3 | State, Actions, and Reducers | [part-3-state-actions-reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers) |
| Part 4 | Store | [part-4-store](https://redux.js.org/tutorials/fundamentals/part-4-store) |
| Part 5 | UI and React | [part-5-ui-react](https://redux.js.org/tutorials/fundamentals/part-5-ui-react) |
| Part 6 | Async Logic and Data Flow | [part-6-async-logic-data-flow](https://redux.js.org/tutorials/fundamentals/part-6-async-logic-data-flow) |
| Part 7 | Standard Redux Patterns | [part-7-standard-patterns](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns) |
| Part 8 | Modern Redux with Redux Toolkit | [part-8-modern-redux](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux) |

## Should You Use Redux

**Use Redux when**:
- You have reasonable amounts of data changing over time
- You need a single source of truth for your state
- Keeping all state in a top-level component is no longer sufficient

**Don't use Redux when**:
- Your app is small with little state
- You can manage state with React's built-in hooks (useState, useReducer)
- You don't need global state management

**Resources for deciding**:
- [Redux FAQ: When should I use Redux?](https://redux.js.org/faq/general)
- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [The Tao of Redux, Part 1](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)
- [The Tao of Redux, Part 2](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)

## Help and Discussion

- [Reactiflux Discord](https://www.reactiflux.com) — #redux channel
- [Stack Overflow](https://stackoverflow.com/questions/tagged/redux) — #redux tag
- [GitHub Issues](https://github.com/reduxjs/redux) — Bug reports and feedback

## Motivation

As JavaScript single-page applications become increasingly complicated, our code must manage more state than ever before — server responses, cached data, locally created data, UI state (active routes, selected tabs, spinners, pagination). Managing this ever-changing state is hard: when models can update other models and views can update models, you lose control over the when, why, and how of state.

Redux addresses this by making state mutations predictable. The complexity comes from mixing two concepts: **mutation** and **asynchronicity**. Redux follows in the steps of Flux, CQRS, and Event Sourcing to impose restrictions on how and when updates can happen.

See: [Motivation](https://redux.js.org/introduction/motivation)

## Prior Art

Redux was created by Dan Abramov while working on his "Hot Reloading with Time Travel" talk. The goal: a state management library with minimal API but completely predictable behavior.

**Influences**:
- **Flux**: Architecture pattern for unidirectional data flow
- **Elm**: Elm Architecture (model-view-update pattern)
- **Immutable**: Immutable data structures
- **Baobab**: Tree-based state management
- **RxJS**: Reactive programming for compositional event streams

See: [Prior Art](https://redux.js.org/introduction/prior-art)

## Examples

Official Redux examples available in the [redux repo](https://github.com/reduxjs/redux/tree/master/examples):

| Example | Description |
|---------|-------------|
| [Counter Vanilla](https://github.com/reduxjs/redux/tree/master/examples/counter-vanilla) | Raw Redux API with ES5, no build system or view framework |
| [Counter](https://github.com/reduxjs/redux/tree/master/examples/counter) | Basic Redux + React, manual re-rendering |
| [Todos](https://github.com/reduxjs/redux/tree/master/examples/todos) | Deeper understanding of state updates with components |
| [Todos with Undo](https://github.com/reduxjs/redux/tree/master/examples/todos-with-undo) | Adding Undo/Redo with Redux Undo |
| [TodoMVC](https://github.com/reduxjs/redux/tree/master/examples/todomvc) | Classic TodoMVC implementation |
| [Shopping Cart](https://github.com/reduxjs/redux/tree/master/examples/shopping-cart) | Normalized entities, reducer composition, selectors, Redux Thunk |
| [Tree View](https://github.com/reduxjs/redux/tree/master/examples/tree-view) | Rendering tree structures with state |
| [Async](https://github.com/reduxjs/redux/tree/master/examples/async) | Async actions with Redux Thunk middleware |
| [Universal](https://github.com/reduxjs/redux/tree/master/examples/universal) | Server-side rendering with Redux |
| [Real World](https://github.com/reduxjs/redux/tree/master/examples/real-world) | Advanced patterns: middleware, async actions, caching |

See: [Examples](https://redux.js.org/introduction/examples)

## Learning Resources

Additional articles and resources for learning Redux, organized by topic:

- **Basic Introductions**: Getting started guides and overviews
- **Using Redux With React**: Integration patterns and best practices
- **Project-Based Tutorials**: Learn by building real apps
- **Redux Implementation**: How Redux works under the hood
- **Reducers**: Reducer patterns and techniques
- **Selectors**: Deriving data with selectors
- **Normalization**: Normalizing state shape for relational data
- **Middleware**: Understanding and writing middleware
- **Side Effects - Basics**: Thunks, sagas, and async patterns
- **Side Effects - Advanced**: Complex async flow management
- **Thinking in Redux**: Mental models and philosophy
- **Redux Architecture**: Architectural patterns and decisions
- **Apps and Examples**: Real-world applications
- **Redux Docs Translations**: Community translations
- **Books**: Published books on Redux
- **Courses**: Online courses and video tutorials

See: [Learning Resources](https://redux.js.org/introduction/learning-resources)

## Ecosystem

The Redux ecosystem includes libraries and tools across these categories:

| Category | Sub-categories |
|----------|---------------|
| **Library Integration and Bindings** | React-Redux, Angular, Ember, Glimmer, Polymer, custom elements |
| **Reducers** | Reducer Combination, Reducer Composition, Higher-Order Reducers |
| **Actions** | Action utilities and helpers |
| **Utilities** | General Redux utilities |
| **Store** | Change Subscriptions, Batching, Persistence |
| **Immutable Data** | Data Structures, Immutable Update Utilities, Immutable/Redux Interop |
| **Side Effects** | Widely Used (Thunks, Sagas, Observables), Promises |
| **Middleware** | Networks and Sockets, Async Behavior, Analytics |
| **Entities and Collections** | Normalized data management |
| **Component State and Encapsulation** | Local state management alongside Redux |
| **Dev Tools** | Debuggers and Viewers, DevTools Monitors, Logging, Mutation Detection |
| **Testing** | Testing utilities and frameworks |
| **Routing** | Route management with Redux |
| **Forms** | Form state management |
| **Higher-Level Abstractions** | Frameworks built on Redux |
| **Community Conventions** | Community standards and patterns |

See: [Ecosystem](https://redux.js.org/introduction/ecosystem)

## Understanding: Thinking in Redux

### Three Principles

1. **Single source of truth**: The state of your whole application is stored in an object tree within a single store. This makes it easy to debug, inspect, and serialize state.
2. **State is read-only**: The only way to change state is to emit an action. No view or API call can mutate state directly — every change must go through the dispatch pipeline.
3. **Changes are made with pure functions**: Reducers are pure functions of (previousState, action) → newState. They must be free of side effects, enabling hot reloading and time travel.

See: [Three Principles](https://redux.js.org/understanding/thinking-in-redux/three-principles)

### Glossary

| Term | Type | Description |
|------|------|-------------|
| **State** | `any` | Single state value managed by the store, returned by `getState()`. Entire state of a Redux application, often a nested object. Should be serializable. |
| **Action** | `Object` | Plain object representing an intention to change state. Must have a `type` field. Strings preferred over Symbols for serializability. |
| **Reducer** | `(state, action) => state` | Pure function that accepts accumulation (state) and value (action), returns new accumulation. Must be pure — same output for same inputs, no side effects. |
| **Dispatching Function** | `(action) => any` | Function that accepts an action or async action and dispatches to the store. Base dispatch synchronously sends action to reducer. Middleware wraps it. |
| **Action Creator** | `(...args) => Action` | Function that creates an action. Does not dispatch it — you must call `store.dispatch()`. Bound action creators dispatch automatically. |
| **Async Action** | `any` | Value sent to dispatch but not ready for reducer. Transformed by middleware into action(s). Often a Promise or thunk. |
| **Middleware** | `(api) => (next) => dispatch` | Higher-order function composing dispatch to return new dispatch. Turns async actions into actions. Composable via function composition. |
| **Store** | `Object` | Object holding application state tree. Has `dispatch`, `getState`, `subscribe`, `replaceReducer`. Single store per app. |
| **Store Creator** | `(reducer, preloadedState?) => Store` | Function that creates a Redux store. Base: `createStore()`. Enhancers wrap store creators. |
| **Store Enhancer** | `(StoreCreator) => StoreCreator` | Higher-order function composing store creator to return enhanced store creator. Similar to higher-order components. Enables DevTools time travel. `applyMiddleware` is itself a store enhancer. |

See: [Glossary](https://redux.js.org/understanding/thinking-in-redux/glossary)

## Understanding: History and Design — Middleware

The middleware pattern in Redux evolved through several attempts to solve logging and crash reporting:

**Problem: Logging** — Need to log every dispatched action and resulting state.

1. **Attempt #1: Logging Manually** — Call `console.log` around each `dispatch()` call. Tedious and error-prone.
2. **Attempt #2: Wrapping Dispatch** — Wrap `store.dispatch` in a function that logs. Better, but requires manual wrapping.
3. **Attempt #3: Monkeypatching Dispatch** — Replace `store.dispatch` with a logging version. Works but modifies internals.

**Problem: Crash Reporting** — Need to catch exceptions during dispatch.

4. **Attempt #4: Hiding Monkeypatching** — Extract monkeypatching into a function. Still monkeypatching.
5. **Attempt #5: Removing Monkeypatching** — Pass `next` (the original dispatch) as argument instead of patching. Now it's a function that wraps dispatch.
6. **Attempt #6: Naïvely Applying Middleware** — Apply multiple middleware by nesting. Works but verbose.

**The Final Approach**: Middleware as `store => next => action => result` curried functions, composed via `applyMiddleware`:

```javascript
const logger = store => next => action => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

const crashReporter = store => next => action => {
  try { return next(action); }
  catch (err) { console.error("Caught an exception!", err); throw err; }
};

// Apply to store
const store = createStore(
  todoApp,
  applyMiddleware(logger, crashReporter)
);
```

**Seven Examples**: The middleware docs cover 7 examples including `logger`, `crashReporter`, `timeoutScheduler`, `thunk`, `promise`, `readyStatePromise`, and `analytics`.

See: [Middleware](https://redux.js.org/understanding/history-and-design/middleware)

## Recommended Videos

- **Learn Modern Redux Livestream** — Mark Erikson's livestream covering modern Redux with RTK
- **RTK Query Basics** — Query endpoints, data flow, and TypeScript
- **Redux Toolkit Complete Tutorial** — Dave Gray's complete RTK tutorial series
- **Egghead Courses** — Jamund Ferguson's courses:
  - Modern Redux with Redux Toolkit (RTK) and TypeScript
  - Modernizing a Legacy Redux Application with React Hooks
  - Confidently Testing Redux Applications with Jest & TypeScript

See: [Videos](https://redux.js.org/tutorials/videos)

**Source**: [Getting Started](https://redux.js.org/introduction/getting-started) | [Installation](https://redux.js.org/introduction/installation) | [Core Concepts](https://redux.js.org/introduction/core-concepts) | [Motivation](https://redux.js.org/introduction/motivation) | [Prior Art](https://redux.js.org/introduction/prior-art) | [Examples](https://redux.js.org/introduction/examples) | [Learning Resources](https://redux.js.org/introduction/learning-resources) | [Ecosystem](https://redux.js.org/introduction/ecosystem) | [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) | [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview) | [Videos](https://redux.js.org/tutorials/videos) | [Three Principles](https://redux.js.org/understanding/thinking-in-redux/three-principles) | [Glossary](https://redux.js.org/understanding/thinking-in-redux/glossary) | [Middleware](https://redux.js.org/understanding/history-and-design/middleware) | [Should You Use Redux](https://redux.js.org/introduction/getting-started)

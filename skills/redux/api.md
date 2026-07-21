# Redux — API Reference

The Redux core is small — it defines a set of contracts for you to implement (such as reducers) and provides a few helper functions to tie these contracts together.

## Top-Level Exports

### createStore(reducer, preloadedState?, enhancer?)

Creates a Redux store that holds the complete state tree. The store is created from a root reducer function.

> **Deprecated**: Use `configureStore` from Redux Toolkit instead. `createStore` is still available as `legacy_createStore` for compatibility.

```javascript
import { legacy_createStore as createStore } from "redux";

// Basic
const store = createStore(rootReducer);

// With preloaded state
const store = createStore(rootReducer, { counter: { value: 0 } });

// With enhancer (e.g., middleware)
const store = createStore(rootReducer, preloadedState, enhancer);
```

**Arguments**:
- `reducer` *(Function)*: Root reducer function that returns the next state tree
- `preloadedState` *(any)*: Initial state (optional)
- `enhancer` *(Function)*: Store enhancer (optional), e.g., `applyMiddleware(...)`

**Returns**: A Redux store object with `getState()`, `dispatch()`, `subscribe()`, `replaceReducer()` methods.

**Deprecation note**: `createStore` is deprecated in favor of `configureStore` from Redux Toolkit, which provides better defaults and easier setup. The `legacy_createStore` export alias is provided for those who still need the original API.

### combineReducers(reducers)

Turns an object whose values are different reducing functions into a single reducing function you can pass to `createStore`.

```javascript
import { combineReducers, legacy_createStore as createStore } from "redux";

const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
  user: userReducer,
});

const store = createStore(rootReducer);
```

**Overview**:
- Each reducer manages a **state slice** — a key in the combined state object
- When an action is dispatched, each reducer runs with its slice of state
- The combined state is an object with the same keys as the `reducers` object

**State slices**:
```javascript
// State shape
{
  counter: counterReducer(undefined, action),
  todos: todosReducer(undefined, action),
  user: userReducer(undefined, action),
}
```

**Arguments**:
- `reducers` *(Object)*: Object whose values correspond to different reducing functions

**Returns**: A reducer that invokes every reducer inside the reducers object, and constructs a state object with the same shape.

**Notes**:
- All reducers must not return `undefined`
- If a reducer returns `undefined`, `combineReducers` will throw
- For unknown actions, each reducer should return its default state
- Each reducer is responsible for its own slice — reducers cannot access other slices

**Example**:
```javascript
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer,
});

// State: { users: {...}, posts: {...}, comments: {...} }
```

**Tips**:
- Use shorter, more readable names for state slices
- Name slices based on the stored data, not the reducer function
- Consider using `createSlice` from Redux Toolkit instead

### applyMiddleware(...middlewares)

Applies middleware to the store's dispatch function. Middleware wraps the dispatch to add custom behavior before/after actions are processed.

```javascript
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);
```

**Overview**:
Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. Multiple middleware can be combined, and they run in the order they are passed.

**Arguments**:
- `...middlewares` *(Functions)*: Functions that follow the middleware signature

**Returns**: A store enhancer that wraps the store's dispatch function.

**Middleware signature**:
```javascript
const middleware = (store) => (next) => (action) => {
  // Called when action is dispatched
  // store: { getState, dispatch }
  // next: next middleware's dispatch function
  // action: the dispatched action

  // Do something before
  const result = next(action); // Pass to next middleware/reducer
  // Do something after

  return result;
};
```

**Examples**:

Logger middleware:
```javascript
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action);
  const result = next(action);
  console.log("next state", store.getState());
  return result;
};
```

Thunk middleware (simplified):
```javascript
const thunk = ({ getState, dispatch }) => (next) => (action) => {
  if (typeof action === "function") {
    return action(dispatch, getState);
  }
  return next(action);
};
```

Crash reporter:
```javascript
const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error("Caught an exception!", err);
    throw err;
  }
};
```

**Tips**:
- Middleware only wraps the store's `dispatch` function
- Use `applyMiddleware` as the third argument to `createStore` (enhancer)
- Redux Toolkit's `configureStore` includes `applyMiddleware` automatically

### bindActionCreators(actionCreators, dispatch)

Wraps action creators in a `dispatch` call so they can be called directly.

```javascript
import { bindActionCreators } from "redux";
import * as actionCreators from "./actionCreators";

// Bind all action creators
const boundActionCreators = bindActionCreators(actionCreators, dispatch);
boundActionCreators.addTodo("Use Redux");

// Bind a single action creator
const addTodo = bindActionCreators(actionCreators.addTodo, dispatch);
addTodo("Use Redux");
```

**Overview**:
Turns an object whose values are action creators into an object with the same keys, but where every action creator is wrapped into a `dispatch` call.

**Parameters**:
- `actionCreators` *(Function or Object)*: An action creator or object whose values are action creators
- `dispatch` *(Function)*: The store's dispatch function

**Returns**:
- If `actionCreators` is a function: a function that dispatches the action
- If `actionCreators` is an object: an object with the same keys, where each value is a wrapped action creator

**Example**:
```javascript
// Without bindActionCreators
dispatch(addTodo("Use Redux"));
dispatch(completeTodo(0));

// With bindActionCreators
const bound = bindActionCreators({ addTodo, completeTodo }, dispatch);
bound.addTodo("Use Redux");
bound.completeTodo(0);
```

> **Note**: With Redux Toolkit and React-Redux hooks, `bindActionCreators` is rarely needed. `useDispatch()` and `dispatch(actionCreator())` is the modern approach.

### compose(...functions)

Composes functions from right to left. Useful for combining store enhancers.

```javascript
import { legacy_createStore as createStore, compose, applyMiddleware } from "redux";

// Compose multiple enhancers
const enhancer = compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__?.()
);

const store = createStore(rootReducer, enhancer);
```

**Overview**:
`compose` takes multiple functions and returns a function that feeds the result of each function into the next, right-to-left. This is the same as `f(g(h(x)))`.

**Arguments**:
- `...functions` *(Functions)*: Functions to compose

**Returns**: A function that composes all the given functions right-to-left.

**Example**:
```javascript
import { compose } from "redux";

// compose(f, g, h)(...args) === f(g(h(...args)))
const composed = compose(f, g, h);
composed(1, 2); // f(g(h(1, 2)))
```

**Tips**:
- `compose` is mainly used with `applyMiddleware` and devtools enhancers
- Redux Toolkit's `configureStore` handles composition automatically
- The rightmost function can accept multiple arguments; others receive one

## Store API

The store object returned by `createStore` (or `configureStore`) has four methods:

### store.getState()

Returns the current state tree of the application.

```javascript
const state = store.getState();
// { counter: { value: 0 }, todos: [...] }
```

### store.dispatch(action)

Dispatches an action, triggering a state change. This is the only way to trigger a state change.

```javascript
store.dispatch({ type: "counter/increment" });
store.dispatch({ type: "counter/addBy", payload: 5 });
```

**Parameters**:
- `action` *(Object)*: A plain object with a `type` field describing what happened

**Returns**: The dispatched action (unless middleware intercepts it).

### store.subscribe(listener)

Adds a change listener that is called whenever an action is dispatched and some part of the state tree may have changed.

```javascript
const unsubscribe = store.subscribe(() => {
  console.log("State changed:", store.getState());
});

// Later
unsubscribe();
```

**Parameters**:
- `listener` *(Function)*: Callback to be invoked on every dispatch

**Returns**: A function that unsubscribes the listener.

**Notes**:
- The listener is called after the state tree has been updated
- `subscribe()` does not pass the state or action to the listener — call `getState()` inside
- React-Redux handles subscription automatically via `useSelector` and `connect`

### store.replaceReducer(nextReducer)

Replaces the reducer currently used by the store. Useful for code splitting and hot reloading.

```javascript
store.replaceReducer(newRootReducer);
```

**Parameters**:
- `nextReducer` *(Function)*: The next reducer for the store to use

**Use cases**:
- **Hot reloading**: Replace reducer during development
- **Code splitting**: Add new reducers dynamically when loading new features

```javascript
// Code splitting example
import { newFeatureReducer } from "./newFeature";

const newRootReducer = combineReducers({
  ...existingReducers,
  newFeature: newFeatureReducer,
});

store.replaceReducer(newRootReducer);
```

## Deprecated APIs

- `createStore` — Deprecated in favor of `configureStore` from Redux Toolkit. Available as `legacy_createStore`.
- `bindActionCreators` — Rarely needed with modern Redux Toolkit and React-Redux hooks.
- `compose` — Handled automatically by `configureStore`.

**Source**: [API Reference](https://redux.js.org/api/api-reference) | [createStore](https://redux.js.org/api/createstore) | [combineReducers](https://redux.js.org/api/combinereducers) | [applyMiddleware](https://redux.js.org/api/applymiddleware) | [bindActionCreators](https://redux.js.org/api/bindactioncreators) | [compose](https://redux.js.org/api/compose) | [Store](https://redux.js.org/api/store)

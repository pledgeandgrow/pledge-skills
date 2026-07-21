# Redux — Usage Guide & Best Practices

## Usage Guides Index

### Setup and Organization

#### Configuring Your Store

```javascript
// Redux Toolkit (recommended)
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: {},
});
```

**Store configuration concerns**:
- **Creating the store**: `createStore` (legacy) or `configureStore` (RTK)
- **Extending Redux functionality**: Middleware, enhancers
- **DevTools integration**: `window.__REDUX_DEVTOOLS_EXTENSION__`
- **Hot reloading**: `replaceReducer` + HMR API
- **Simplifying with Redux Toolkit**: `configureStore` handles all of the above

**Problems with manual setup**:
- Easy to forget adding devtools
- Middleware ordering matters
- Boilerplate for enhancer composition

**Solution: `configureStore`**:
- Adds thunk middleware by default
- Sets up DevTools automatically
- Enables development checks (immutability, serializability)
- Allows customization via options

#### Code Splitting

Split Redux logic across multiple bundles loaded on-demand.

**Using `replaceReducer`**:
```javascript
// Inject a new reducer when a feature loads
store.replaceReducer(combineReducers({
  ...existingReducers,
  newFeature: newFeatureReducer,
}));
```

**Reducer injection approaches**:
1. **`injectReducer` function**: Add reducers to a combined reducer at runtime
2. **Reducer Manager**: Custom class that manages dynamic reducers
3. **`combineSlices` (RTK)**: Combine slices dynamically

**Redux Toolkit code splitting**:
```javascript
import { combineSlices } from "@reduxjs/toolkit";

// combineSlices allows adding/removing slices at runtime
const rootReducer = combineSlices(featuresSlice, userSlice);
// Later: rootReducer.with(featureXReducer)
```

**`createDynamicMiddleware` (RTK)**:
```javascript
import { createDynamicMiddleware } from "@reduxjs/toolkit";

const dynamicMiddleware = createDynamicMiddleware();
// Add middleware at runtime
dynamicMiddleware.addMiddleware(myMiddleware);
```

**Third-party libraries**: Various frameworks handle code splitting automatically.

#### Server Rendering

Server-side rendering (SSR) with Redux involves:
1. **Server side**: Create store, fetch initial data, render to HTML, send state to client
2. **Client side**: Create store with preloaded state from server, hydrate

```javascript
// Server
const store = createStore(rootReducer);
const html = renderToString(
  <Provider store={store}><App /></Provider>
);
const preloadedState = store.getState();
res.send(`<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}</script>`);

// Client
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(rootReducer, preloadedState);
delete window.__PRELOADED_STATE__;
```

**Security considerations**: Sanitize state before injecting into HTML to prevent XSS.

**Async state fetching**: Use thunks or data fetching middleware to load data before rendering.

#### Isolating Redux Sub-Apps

When embedding Redux apps inside larger Redux apps, use a separate store or scope the state to avoid conflicts.

### Code Quality

#### Usage with TypeScript

**Standard RTK + TypeScript setup**:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

// Define root state and dispatch types
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Create typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Typing `createSlice`**:
```typescript
interface CounterState { value: number; }

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => { state.value += 1; },
    addBy: (state, action: PayloadAction<number>) => { state.value += action.payload; },
  },
});
```

**Typing `createAsyncThunk`**:
```typescript
export const fetchUser = createAsyncThunk<User, string>(
  "users/fetchUser",
  async (userId, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);
```

**Typing `configureStore`**:
```typescript
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
  middleware: (getDefault) => getDefault().concat(logger),
});
```

**Typing `createEntityAdapter`**:
```typescript
interface Book { id: string; title: string; }
const booksAdapter = createEntityAdapter<Book>();
```

**Additional recommendations**:
- Use the React Redux Hooks API (`useSelector`, `useDispatch`) with typed hooks
- Avoid action type unions — RTK infers types automatically
- Use `RootState` and `AppDispatch` types throughout

#### Writing Tests

**Guiding principles**:
- Test behavior, not implementation details
- Prefer integration tests over unit tests for connected components
- Test reducers as pure functions
- Test thunks with mock dispatch

**Test runners**: Vitest, Jest
**UI testing**: React Testing Library
**Network testing**: MSW (Mock Service Worker)

**Integration testing**:
```javascript
import { renderWithProviders } from "./test-utils";

test("counter increments", async () => {
  const { getByText, user } = renderWithProviders(<Counter />);
  await user.click(getByText("+"));
  expect(getByText("1")).toBeInTheDocument();
});
```

**Unit testing reducers**:
```javascript
test("increment adds 1", () => {
  const nextState = counterReducer({ value: 0 }, increment());
  expect(nextState.value).toBe(1);
});
```

**Unit testing thunks**:
```javascript
test("fetchUser dispatches pending and fulfilled", async () => {
  const dispatch = vi.fn();
  await fetchUser("123")(dispatch, () => ({}), undefined);
  expect(dispatch).toHaveBeenCalledWith(fetchUser.pending("123"));
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
    type: fetchUser.fulfilled.type,
  }));
});
```

#### Troubleshooting

**Common issues**:
- **Nothing happens when dispatching**: Check if reducer handles the action type, check middleware
- **State not updating**: Ensure reducer returns new state (immutability), check for mutations
- **Component not re-rendering**: Verify `useSelector` returns new reference when data changes
- **Too many re-renders**: Selector returning new reference each time — use memoized selectors

### Redux Logic and Patterns

#### Structuring Reducers

**Prerequisite Concepts for Writing Reducers**:
- Reducers must be pure functions
- Reducers must not mutate state
- Reducers must return default state for unknown actions
- Understand ES6 features: spread operator, destructuring, computed property names, default arguments
- Understand array methods: map, filter, reduce, concat, slice
- Understand object spread and shallow copy vs deep copy

See: [Prerequisite Concepts](https://redux.js.org/usage/structuring-reducers/prerequisite-concepts)

**Reducer Concepts and Techniques** (sub-pages):

1. **Basic Reducer Structure** — All reducers follow `(state, action) => newState` pattern. Basic structure with `switch` statement or lookup table. Initial state via default parameter or `initialState` argument.
   See: [Basic Reducer Structure](https://redux.js.org/usage/structuring-reducers/basic-reducer-structure)

2. **Splitting Reducer Logic** — Break large reducers into smaller, focused functions. Use function composition to combine them. Patterns: splitting by action type, splitting by sub-state, using slice reducers.
   See: [Splitting Reducer Logic](https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic)

3. **Refactoring Reducers Example** — Step-by-step example of refactoring a large reducer into smaller, composable pieces. Demonstrates extracting sub-reducers, delegating to child reducers, and combining results.
   See: [Refactoring Reducers Example](https://redux.js.org/usage/structuring-reducers/refactoring-reducer-example)

4. **Using combineReducers** — How `combineReducers` works, when to use it, state slice naming, handling multiple reducers per slice, and common pitfalls.
   See: [Using combineReducers](https://redux.js.org/usage/structuring-reducers/using-combinereducers)

5. **Beyond combineReducers** — When `combineReducers` isn't enough: custom reducer composition, cross-slice logic, shared state between reducers, using `combineSlices` (RTK) for dynamic combination.
   See: [Beyond combineReducers](https://redux.js.org/usage/structuring-reducers/beyond-combinereducers)

6. **Normalizing State Shape** — Store relational data in normalized form using `byId`/`allIds` pattern. Benefits: lookups by ID, no duplication, simpler updates. Use `createEntityAdapter` (RTK) for automatic normalization.
   See: [Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)

7. **Updating Normalized Data** — Patterns for CRUD operations on normalized state: add, update, delete items by ID. Using `createEntityAdapter` methods: `addOne`, `updateOne`, `removeOne`, `upsertOne`, `setOne`, `setMany`.
   See: [Updating Normalized Data](https://redux.js.org/usage/structuring-reducers/updating-normalized-data)

8. **Reusing Reducer Logic** — Share reducer logic across slices using higher-order reducers, function composition, and action prefixing. Patterns: creating reusable reducer factories, namespacing actions.
   See: [Reusing Reducer Logic](https://redux.js.org/usage/structuring-reducers/reusing-reducer-logic)

9. **Immutable Update Patterns** — Common patterns for immutable updates: updating nested objects, updating arrays (insert/remove/update), and avoiding common mutation mistakes. Using Immer (RTK) for simpler immutable updates.
   See: [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

10. **Initializing State** — How to set initial state: default parameters, `preloadedState` in `createStore`/`configureStore`, `initialState` in `createSlice`. Precedence: `preloadedState` overrides reducer defaults.
    See: [Initializing State](https://redux.js.org/usage/structuring-reducers/initializing-state)

**Structuring techniques**:
```javascript
// Normalized state shape
{
  entities: {
    users: { byId: {}, allIds: [] },
    posts: { byId: {}, allIds: [] },
  },
}
```

#### Reducing Boilerplate

Redux allows you to choose how verbose your code is. Techniques to reduce boilerplate:

**Actions**: Use action type constants, generate action creators
**Action creators**: Use helper functions to generate action creators
**Async action creators**: Use thunks for async logic
**Reducers**: Use `createReducer` (RTK) or reducer factories

```javascript
// RTK eliminates most boilerplate
const slice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => { state.push(action.payload); },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
});
// Action creators and types are auto-generated
```

#### Deriving Data with Selectors

**Basic selector concepts**:
```javascript
// Simple selector
const selectCounter = (state) => state.counter.value;

// Composed selector
const selectCompletedTodos = (state) =>
  state.todos.filter(todo => todo.completed);
```

**Encapsulating state shape**: Selectors hide the internal state structure from components.

**Memoization with Reselect**:
```javascript
import { createSelector } from "reselect";

const selectTodos = (state) => state.todos;
const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed)
);
```

**`createSelector` behavior**:
- Memoizes results — only recalculates when input changes
- Returns cached result if inputs are the same
- Cache size of 1 (last result only)

**Reselect usage patterns and limitations**:
- Be careful with selectors that take parameters (can break memoization)
- Create unique selector instances for components that need parameterized selectors

**Alternative selector libraries**: `proxy-memoize`, `re-reselect`, `reselect-tools`, `redux-views`

**Using selectors with React-Redux**:
```javascript
// useSelector with selector
const completedTodos = useSelector(selectCompletedTodos);

// Parameterized selectors — create unique instances
const makeSelectTodoById = () => createSelector(
  [state => state.todos, (_, id) => id],
  (todos, id) => todos.find(t => t.id === id)
);
```

**Using selectors effectively**:
- Define selectors alongside reducers
- Balance selector usage — don't over-memoize simple lookups
- Reshape state as needed for components
- Globalize selectors if needed for reuse

#### Implementing Undo History

**Understanding undo history**:
- Track past, present, and future states
- Undo moves present → past, future → present
- Redo moves present → future, past → present

**State shape**:
```javascript
{
  past: [...previousStates],
  present: currentState,
  future: [...nextStates],
}
```

**Reducer enhancer approach**: Wrap any reducer to add undo/redo capability.

**Using `redux-undo`**:
```javascript
import undoable from "redux-undo";

const undoableReducer = undoable(todosReducer, {
  filter: includeFilter(["ADD_TODO", "TOGGLE_TODO"]),
  limit: false,
});
```

## Style Guide: Best Practices

### Priority A Rules: Essential (Must Follow)

1. **Do not mutate state**: Use Immer (via RTK) or spread operators
2. **Reducers must not have side effects**: No API calls, no random values, no Date.now()
3. **Do not put non-serializable values in state or actions**: No functions, promises, Symbols
4. **Only one Redux store per app**: Single store, multiple slices

### Priority B Rules: Strongly Recommended

1. **Use Redux Toolkit for writing Redux logic**: RTK is the recommended approach
2. **Use Immer for writing immutable updates**: `createSlice` and `createReducer` use Immer
3. **Structure files as feature folders with single-file logic**: Co-locate slice + component + tests
4. **Put as much logic as possible in reducers**: Reducers are pure and testable
5. **Reducers should own the state shape**: Don't spread state structure across components
6. **Name state slices based on the stored data**: `users`, `posts`, not `usersReducer`
7. **Organize state structure based on data types, not components**: Data-first, not UI-first
8. **Treat reducers as state machines**: Consider all action × state combinations
9. **Normalize complex nested/relational state**: Use `byId`/`allIds` or `createEntityAdapter`
10. **Keep state minimal and derive additional values**: Use selectors for computed data
11. **Model actions as events, not setters**: "todoAdded" not "setTodos"
12. **Write meaningful action names**: Past tense, domain/eventName format
13. **Allow many reducers to respond to the same action**: One action can update multiple slices
14. **Avoid dispatching many actions sequentially**: Batch updates, use thunks for multi-step
15. **Evaluate where each piece of state should live**: Redux vs local component state
16. **Use the React-Redux Hooks API**: `useSelector` and `useDispatch` (not `connect`)
17. **Connect more components to read data from the store**: Granular connections for performance
18. **Use the object shorthand form of `mapDispatch` with `connect`**: `{ addTodo }` not `(dispatch) => ({ addTodo: (id) => dispatch(addTodo(id)) })`
19. **Call `useSelector` multiple times in function components**: Select smaller pieces
20. **Use static typing**: TypeScript with typed hooks
21. **Use the Redux DevTools Extension for debugging**: Time-travel, action inspection
22. **Use plain JavaScript objects for state**: No Immutable.js, no custom classes

### Priority C Rules: Recommended

1. **Write action types as `domain/eventName`**: `"todos/addTodo"` not `"ADD_TODO"`
2. **Write actions using the Flux Standard Action (FSA) convention**: `{ type, payload, meta, error }`
3. **Use action creators**: Don't dispatch raw action objects
4. **Use RTK Query for data fetching**: Built-in data fetching and caching
5. **Use thunks and listeners for other async logic**: `createAsyncThunk`, `createListenerMiddleware`
6. **Move complex logic outside components**: Keep components simple
7. **Use selector functions to read from store state**: Encapsulate state access
8. **Name selector functions as `selectThing`**: Convention for clarity
9. **Avoid putting form state in Redux**: Use local state or form libraries

## FAQ

### General
- **When should I learn Redux?** When you need predictable state management for complex apps
- **When should I use Redux?** When you have complex state interactions, need a single source of truth
- **Can Redux only be used with React?** No, Redux works with any UI layer
- **Do I need a build tool?** No, but a bundler is recommended for development experience

### Reducers
- **Share state between reducers?** Use thunks or normalize state to avoid cross-slice dependencies
- **Must use switch statement?** No, use lookup tables or `createReducer` (RTK)

### Organizing State
- **Put all state in Redux?** No, use local state for UI-only concerns
- **Non-serializable items in state?** No, keep state serializable
- **Organize nested/duplicate data?** Normalize state with `byId`/`allIds`
- **Form state in store?** Generally no, use local state or form libraries

### Store Setup
- **Multiple stores?** Generally no — one store per app
- **Import store directly?** No, use React-Redux's `Provider` and hooks
- **Multiple middleware chains?** Use one chain with `applyMiddleware`
- **Subscribe to portion of state?** Use `useSelector` with selectors

### Actions
- **Why string types?** Serializability, devtools, debugging
- **One-to-one reducer/action mapping?** No, multiple reducers can respond to one action
- **Side effects / async?** Use thunks, sagas, or other middleware
- **Which async middleware?** Thunks (simple), sagas (complex), observables (reactive)
- **Dispatch multiple actions in a row?** Avoid — batch or use thunks

### Immutable Data
- **Benefits of immutability?** Predictability, time-travel debugging, performance
- **Why required by Redux?** Enables devtools, ensures reducers are pure
- **Must use Immer?** No, but recommended (included in RTK)
- **Issues with JS for immutable ops?** Verbose, error-prone — use Immer

### Code Structure
- **File structure?** Feature folders with co-located logic
- **Split logic between reducers and action creators?** Put business logic in reducers
- **Why action creators?** Consistency, testability, documentation
- **Websockets?** Use middleware or listener middleware (RTK)
- **Store in non-component files?** Pass store or use thunk's `getState`

### Performance
- **How well does Redux scale?** Well — single state tree, memoized selectors
- **All reducers for each action slow?** No — reducers are fast, only relevant ones do work
- **Deep-clone state?** No — shallow copy with spread is sufficient
- **Reduce store update events?** Batch actions, use thunks
- **Memory problems?** No — state is typically small
- **Caching remote data?** Use RTK Query for automatic caching

### Design Decisions
- **Why not pass state/action to subscribers?** Performance — subscribers call `getState()`
- **Why no classes?** Actions and reducers must be plain and serializable
- **Why currying in middleware?** Enables `store => next => action` signature
- **Why closure for dispatch in `applyMiddleware`?** Ensures middleware sees updated dispatch

### React Redux
- **Why use React-Redux?** Optimized subscriptions, prevents unnecessary re-renders
- **Component not re-rendering?** Check selector returns new reference, check `Provider`
- **Re-rendering too often?** Memoize selectors, select smaller pieces
- **Speed up `mapStateToProps`?** Use `useSelector` with memoized selectors
- **No `this.props.dispatch`?** Only available if not passing `mapDispatch`
- **Connect top or multiple components?** Connect multiple — granular is better

### Miscellaneous
- **Larger Redux projects?** Many real-world apps use Redux (Twitter, Instagram, etc.)
- **Authentication in Redux?** Store auth state in Redux, use middleware for protected routes

**Source**: [Usage Guide](https://redux.js.org/usage/) | [Configuring Your Store](https://redux.js.org/usage/configuring-your-store) | [Code Splitting](https://redux.js.org/usage/code-splitting) | [Server Rendering](https://redux.js.org/usage/server-rendering) | [Isolating Redux Sub-Apps](https://redux.js.org/usage/isolating-redux-sub-apps) | [Usage with TypeScript](https://redux.js.org/usage/usage-with-typescript) | [Writing Tests](https://redux.js.org/usage/writing-tests) | [Troubleshooting](https://redux.js.org/usage/troubleshooting) | [Structuring Reducers](https://redux.js.org/usage/structuring-reducers/structuring-reducers) | [Reducing Boilerplate](https://redux.js.org/usage/reducing-boilerplate) | [Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors) | [Implementing Undo History](https://redux.js.org/usage/implementing-undo-history) | [Style Guide](https://redux.js.org/style-guide/) | [FAQ](https://redux.js.org/faq) | [FAQ: General](https://redux.js.org/faq/general) | [FAQ: Reducers](https://redux.js.org/faq/reducers) | [FAQ: Organizing State](https://redux.js.org/faq/organizing-state) | [FAQ: Store Setup](https://redux.js.org/faq/store-setup) | [FAQ: Actions](https://redux.js.org/faq/actions) | [FAQ: Immutable Data](https://redux.js.org/faq/immutable-data) | [FAQ: Code Structure](https://redux.js.org/faq/code-structure) | [FAQ: Performance](https://redux.js.org/faq/performance) | [FAQ: Design Decisions](https://redux.js.org/faq/design-decisions) | [FAQ: React Redux](https://redux.js.org/faq/react-redux) | [FAQ: Miscellaneous](https://redux.js.org/faq/miscellaneous)

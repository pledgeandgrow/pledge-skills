# SolidJS Context

## createContext

```tsx
import { createContext } from "solid-js";
```

**Type signature:**

```typescript
interface Context<T> {
  id: symbol;
  Provider: (props: { value: T; children: any }) => any;
  defaultValue: T;
}

function createContext<T>(
  defaultValue?: undefined,
  options?: { name?: string }
): Context<T | undefined>;

function createContext<T>(
  defaultValue: T,
  options?: { name?: string }
): Context<T>;
```

**Parameters:**

- **`defaultValue`** (optional): Value used when no Provider is found in the component tree.
- **`options`** (optional): `{ name?: string }` for debugging.

**Returns:** A `Context` object with a `Provider` component and `id` symbol.

## useContext

```tsx
import { useContext } from "solid-js";
```

**Type signature:**

```typescript
function useContext<T>(context: Context<T>): T;
```

**Parameters:**

- **`context`**: The context object created by `createContext`.

**Returns:** The value provided by the nearest `Provider` in the component tree, or the default value if no Provider is found.

---

## When to Use Context

Context is designed for sharing data that is **global to a section of the application** or regularly accessed by multiple components. It avoids **prop drilling** — passing props through intermediate components that don't use them directly.

**Before reaching for context, consider:**
- **Signals** can be imported directly into components that need them — often simpler
- **Adjusting component hierarchy** may eliminate the need for context for shallow nesting
- Context is best for deeply nested trees or truly shared application state

---

## Creating Context

```tsx
import { createContext } from "solid-js";

export const MyContext = createContext();
```

## Providing Context to Children

Use the `Provider` property on the context object. The `value` prop accepts any value, including signals and stores:

```tsx
import { MyContext } from "./create";

export function Provider(props) {
  return (
    <MyContext.Provider value="new value">
      {props.children}
    </MyContext.Provider>
  );
}
```

**With multiple values (use a store):**

```tsx
import { createStore } from "solid-js/store";
import { createContext } from "solid-js";

export const AppContext = createContext();

export function AppProvider(props) {
  const [state, setState] = createStore({
    theme: "light",
    user: null,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {props.children}
    </AppContext.Provider>
  );
}
```

## Consuming Context

Access context values using `useContext`:

```tsx
import { useContext } from "solid-js";
import { MyContext } from "./create";

const Child = () => {
  const value = useContext(MyContext);
  return <span>{value}</span>;
};

export const App = () => (
  <Provider>
    <Child />
  </Provider>
);
```

---

## Common Patterns

### Context with Signals

```tsx
// context.ts
import { createContext, createSignal } from "solid-js";

export const CounterContext = createContext();

export function CounterProvider(props) {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((c) => c + 1);

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {props.children}
    </CounterContext.Provider>
  );
}

// Consumer.tsx
import { useContext } from "solid-js";
import { CounterContext } from "./context";

function Counter() {
  const { count, increment } = useContext(CounterContext);
  return (
    <button onClick={increment}>
      Count: {count()}
    </button>
  );
}
```

### Context with Store

```tsx
import { createStore } from "solid-js/store";
import { createContext, useContext } from "solid-js";

export const StoreContext = createContext();

export function StoreProvider(props) {
  const [store, setStore] = createStore({
    items: [],
    filter: "all",
  });

  const addItem = (item) =>
    setStore("items", (items) => [...items, item]);

  return (
    <StoreContext.Provider value={{ store, setStore, addItem }}>
      {props.children}
    </StoreContext.Provider>
  );
}

function ItemList() {
  const { store } = useContext(StoreContext);
  return (
    <ul>
      <For each={store.items}>
        {(item) => <li>{item.name}</li>}
      </For>
    </ul>
  );
}
```

### Throwing When Provider is Missing

```tsx
function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return ctx;
}
```

### Updating Context Values

Context values can be updated reactively when they contain signals or stores:

```tsx
function ThemeToggle() {
  const ctx = useContext(ThemeContext);
  return (
    <button onClick={() => ctx.setTheme(ctx.theme() === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  );
}
```

---

## Common Issues

### createContext Returns undefined

If `useContext` returns `undefined`, ensure:
1. The `Provider` is an ancestor of the consuming component
2. A `defaultValue` was provided to `createContext` if no Provider wraps the consumer
3. The context object imported is the same instance (not a re-created one)

### Destructuring Context Values

When using stores in context, avoid destructuring the store itself (it breaks reactivity). Destructure the setter and helper functions, but access store properties directly:

```tsx
// BAD — breaks reactivity
const { store: { items } } = useContext(StoreContext);

// GOOD — preserves reactivity
const { store } = useContext(StoreContext);
// Access as store.items in JSX
```

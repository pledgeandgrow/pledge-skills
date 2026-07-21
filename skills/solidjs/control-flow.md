# SolidJS Control Flow

## Show

```tsx
import { Show } from "solid-js";
```

**Type signature:**

```typescript
function Show<T>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: Accessor<NonNullable<T>>) => JSX.Element);
}): JSX.Element;

function Show<T>(props: {
  when: T | undefined | null | false;
  keyed: true;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
}): JSX.Element;
```

**Props:**

- **`when`**: Condition to evaluate. Renders children when truthy, fallback when falsy.
- **`fallback`**: Content to render when condition is false.
- **`keyed`** (default: `false`): When `true`, children re-render on every `when` change. When `false`, children receive an accessor for the value.
- **`children`**: JSX element or function receiving the truthy value.

Renders children when a condition is true. Similar to a ternary operator in JSX.

```tsx
import { Show } from "solid-js";

<Show when={data.loading}>
  <div>Loading...</div>
</Show>;

<Show when={!data.loading} fallback={<div>Loading...</div>}>
  <h1>Hi, I am {data().name}.</h1>
</Show>;
```

**Function child (non-keyed):** Receives an accessor for the truthy value:

```tsx
<Show when={user()}>
  {(user) => <div>Hello, {user().name}</div>}
</Show>
```

**Keyed child:** Re-creates children when `when` changes, receives value directly:

```tsx
<Show when={user()} keyed>
  {(user) => <div>Hello, {user.name}</div>}
</Show>
```

**Nested Show for multiple conditions:**

```tsx
<Show when={data.loading}>
  <div>Loading...</div>
  <Show when={data.error}>
    <div>Error: {data.error}</div>
  </Show>
</Show>
```

---

## Switch and Match

```tsx
import { Match, Switch } from "solid-js";
```

**Type signature:**

```typescript
function Switch(props: {
  fallback?: JSX.Element;
  children: JSX.Element;
}): JSX.Element;

function Match<T>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  children: JSX.Element | ((item: Accessor<NonNullable<T>>) => JSX.Element);
}): JSX.Element;
```

**Switch props:**

- **`fallback`**: Content to render when no Match condition is true.
- **`children`**: One or more `<Match>` components.

**Match props:**

- **`when`**: Condition to evaluate.
- **`keyed`** (default: `false`): Same as `Show`.
- **`children`**: Content or function receiving the truthy value.

Renders the first `<Match>` whose `when` condition is true. Falls back to `fallback` if none match.

```tsx
import { Match, Switch } from "solid-js";

function StatusMessage(props) {
  return (
    <Switch fallback={<p>Unknown status</p>}>
      <Match when={props.status === "loading"}>
        <p>Loading...</p>
      </Match>
      <Match when={props.status === "error"}>
        <p>Error: {props.error}</p>
      </Match>
      <Match when={props.status === "success"}>
        <p>Success!</p>
      </Match>
    </Switch>
  );
}
```

**With function children (non-keyed):**

```tsx
<Switch>
  <Match when={state()}>
    {(s) => <div>State is {s()}</div>}
  </Match>
</Switch>
```

---

## For

```tsx
import { For } from "solid-js";
```

**Type signature:**

```typescript
function For<T extends readonly any[], U extends JSX.Element>(props: {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: T[number], index: Accessor<number>) => U;
}): JSX.Element;
```

**Props:**

- **`each`**: Array to iterate over. Can also accept objects converted via `Object.entries` or `Object.values`.
- **`fallback`**: Content to render when `each` is empty or falsy.
- **`children`**: Callback function `(item, index) => JSX`. The `index` is a signal (accessor) and must be called as a function.

Loops over an array, rendering each item. Designed for lists where order and length may change frequently. Keyed by reference — when the array changes, `<For>` moves DOM nodes rather than re-creating them.

```tsx
import { For } from "solid-js";

<For each={data()}>
  {(item, index) => (
    <li style={{ color: index() % 2 === 0 ? "red" : "blue" }}>
      {item.name}
    </li>
  )}
</For>
```

**With fallback:**

```tsx
<For each={todos()} fallback={<p>No todos yet</p>}>
  {(todo) => <li>{todo.text}</li>}
</For>
```

**Key points:**
- `item` is the raw value (not a signal)
- `index` is a signal — call `index()` to get the number
- `<For>` is keyed by reference equality — best for arrays of objects where items may reorder

---

## Index

```tsx
import { Index } from "solid-js";
```

**Type signature:**

```typescript
function Index<T extends readonly any[], U extends JSX.Element>(props: {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: Accessor<T[number]>, index: number) => U;
}): JSX.Element;
```

**Props:**

- **`each`**: Array to iterate over.
- **`fallback`**: Content to render when `each` is empty or falsy.
- **`children`**: Callback function `(item, index) => JSX`. The `item` is a signal (accessor). The `index` is a plain number.

Loops over an array where the **index** is stable but the **content** at each index may change. Opposite of `<For>`.

```tsx
import { Index } from "solid-js";

<Index each={data()}>
  {(item, index) => (
    <li>
      {item().name} - {item().completed}
    </li>
  )}
</Index>
```

### For vs. Index

| Feature | `<For>` | `<Index>` |
|---------|---------|-----------|
| Keyed by | Reference (item identity) | Index (position) |
| `item` | Raw value | Signal (accessor) |
| `index` | Signal (accessor) | Plain number |
| Best for | Arrays where items reorder | Arrays where content changes but order is stable |
| Re-render behavior | Moves DOM nodes when items shift | Updates content at fixed positions |

**When to use `<For>`:** Lists of objects that may be sorted, filtered, or reordered.

**When to use `<Index>`:** Fixed-length lists where values at each position change frequently (e.g., cells in a row, fixed slots).

---

## Dynamic

```tsx
import { Dynamic } from "solid-js/web";
```

**Type signature:**

```typescript
type ValidComponent =
  | keyof JSX.IntrinsicElements
  | ((props: any) => JSX.Element);

type DynamicProps<T extends ValidComponent, P = ComponentProps<T>> = {
  [K in keyof P]: P[K];
} & { component: T | undefined };

function Dynamic<T extends ValidComponent>(props: DynamicProps<T>): JSX.Element;
```

**Props:**

- **`component`**: A string (native HTML element name) or component function to render.
- **All other props**: Passed through to the rendered component/element.

Renders a component or HTML element dynamically based on data. More concise than `<Switch>`/`<Match>` for dynamic component selection.

```tsx
import { createSignal, For } from "solid-js";
import { Dynamic } from "solid-js/web";

const RedDiv = () => <div style="color: red">Red</div>;
const GreenDiv = () => <div style="color: green">Green</div>;
const BlueDiv = () => <div style="color: blue">Blue</div>;

const options = { red: RedDiv, green: GreenDiv, blue: BlueDiv };

function App() {
  const [selected, setSelected] = createSignal("red");
  return (
    <>
      <select value={selected()} onInput={(e) => setSelected(e.currentTarget.value)}>
        <For each={Object.keys(options)}>
          {(color) => <option value={color}>{color}</option>}
        </For>
      </select>
      <Dynamic component={options[selected()]} />
    </>
  );
}
```

**With native HTML elements:**

```tsx
<Dynamic component="h1" class="title">
  Hello World
</Dynamic>
```

---

## ErrorBoundary

```tsx
import { ErrorBoundary } from "solid-js";
```

**Type signature:**

```typescript
function ErrorBoundary(props: {
  fallback: JSX.Element | ((err: any, reset: () => void) => JSX.Element);
  children: JSX.Element;
}): JSX.Element;
```

**Props:**

- **`fallback`**: Content or function receiving `(error, reset)` to display when an error occurs. The `reset` function re-renders children and clears the error state.
- **`children`**: Content to wrap with error catching.

Catches errors during rendering or updating of children. Does **not** catch errors in event handlers or async callbacks (like `setTimeout`).

```tsx
import { ErrorBoundary } from "solid-js";

function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Something went wrong: {error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      >
        <ErrorProne />
      </ErrorBoundary>
    </div>
  );
}
```

**Key points:**
- Catches render-time errors only (not event handler or async errors)
- The `reset` function forces re-render of children, clearing the error
- Can be nested for granular error handling

---

## Portal

```tsx
import { Portal } from "solid-js/web";
```

**Type signature:**

```typescript
function Portal(props: {
  mount?: Node;
  useShadow?: boolean;
  isSVG?: boolean;
  ref?: HTMLDivElement | SVGGElement | ((el: HTMLDivElement | SVGGElement) => void);
  children: JSX.Element;
}): Text;
```

**Props:**

- **`mount`** (Node, default: `document.body`): DOM node to portal content into.
- **`useShadow`** (boolean): Attaches content via Shadow DOM.
- **`isSVG`** (boolean): Wraps children in `<g>` instead of `<div>` for SVG contexts.
- **`ref`**: Reference to the wrapper element.
- **`children`**: Content to portal.

Renders content outside the normal document flow. Useful for modals, tooltips, and popups that might be clipped by parent `overflow` settings.

```tsx
import { Portal } from "solid-js/web";

<Portal>
  <div class="popup">...</div>
</Portal>
```

**Custom mount point:**

```tsx
<Portal mount={document.querySelector("main")}>
  <div class="popup">...</div>
</Portal>
```

**SVG support:**

```tsx
<Portal mount={document.querySelector("svg")} isSVG={true}>
  <rect fill="red" x="25" y="25" height="50" width="50" />
</Portal>
```

**Key points:**
- Content renders at the end of `document.body` by default
- Content is wrapped in a `<div>` (or `<g>` for SVG) so events propagate through the component hierarchy
- Use `isSVG` when portaling into an SVG to avoid wrapping in a `<div>`

---

## Suspense

```tsx
import { Suspense } from "solid-js";
```

**Type signature:**

```typescript
function Suspense(props: {
  fallback?: JSX.Element;
  children: JSX.Element;
}): JSX.Element;
```

**Props:**

- **`fallback`**: Content to display while async operations are in progress.
- **`children`**: Content that may contain async reads (e.g., `createResource`).

Acts as a boundary for asynchronous operations. When any descendant reads from a pending resource, the `Suspense` component shows the `fallback` until all async operations resolve. Prevents display of partially loaded content.

```tsx
import { Suspense, createResource } from "solid-js";

function App() {
  const [user] = createResource(fetchUser);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1>{user().name}</h1>
      <p>{user().email}</p>
    </Suspense>
  );
}
```

**Nested Suspense:** Only the closest ancestor `Suspense` boundary switches to fallback when a loading state is detected. Nested boundaries allow granular loading states:

```tsx
<Suspense fallback={<div>Loading app...</div>}>
  <Header />
  <Suspense fallback={<div>Loading content...</div>}>
    <Content />
  </Suspense>
  <Footer />
</Suspense>
```

**Key points:**
- Detects async reads within all descendants
- Only the nearest ancestor `Suspense` shows fallback
- Can be nested for granular loading states
- Works with `createResource` and lazy-loaded components

# SolidJS Core Reactivity

## Signals

### createSignal

```tsx
import { createSignal } from "solid-js";
```

**Type signature:**

```typescript
function createSignal<T>(): Signal<T | undefined>;
function createSignal<T>(value: T, options?: SignalOptions<T>): Signal<T>;

type Signal<T> = [get: Accessor<T>, set: Setter<T>];
type Accessor<T> = () => T;

interface SignalOptions<T> {
  name?: string;
  equals?: false | ((prev: T, next: T) => boolean);
  internal?: boolean;
}
```

**Parameters:**

- **`value`** (T, default: `undefined`): Initial value. If omitted, type extends with `undefined`.
- **`options`** (SignalOptions<T>):
  - **`name`** (string): Debug name for devtools. Dev-only, stripped from production.
  - **`equals`** (false | function): Custom equality check. Default: `===` reference equality. Set to `false` to always trigger updates.
  - **`internal`** (boolean): Marks signal as internal, hides from devtools.

**Returns:** `[get, set]` tuple — getter accessor and setter function.

**Creating a signal:**

```tsx
const [count, setCount] = createSignal(0);
//  ^ getter         ^ setter
```

**Accessing values:** Call the getter with no arguments:

```tsx
console.log(count()); // 0
```

**Updating values:** Pass a new value or a function receiving the previous value:

```tsx
setCount(5);
setCount((prev) => prev + 1);
```

**Reactivity:** When a signal's getter is called within a tracking scope (`createEffect`, `createMemo`, or JSX), it registers as a dependency. When the signal changes, all subscribers are notified.

```tsx
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);
  return (
    <div>
      <span>Count: {count()}</span>
      <button type="button" onClick={increment}>Increment</button>
    </div>
  );
}
```

**Custom equality:**

```tsx
const [user, setUser] = createSignal({ name: "Alice" }, {
  equals: (prev, next) => prev.name === next.name,
});
```

---

## Effects

### createEffect

```tsx
import { createEffect } from "solid-js";
```

**Type signature:**

```typescript
function createEffect<Next>(
  fn: EffectFunction<undefined | NoInfer<Next>, Next>
): void;
function createEffect<Next, Init = Next>(
  fn: EffectFunction<Init | Next, Next>,
  value: Init,
  options?: { name?: string }
): void;
```

**Parameters:**

- **`fn`** (function): Callback that runs when the effect is triggered. Receives the previous return value.
- **`value`** (optional): Initial value passed to the function on first run.
- **`options`** (optional): `{ name?: string }` for debugging.

**Execution timing:**

- **Initial run:** Runs once immediately upon creation, regardless of dependencies.
- **Subsequent runs:** Only re-runs when a tracked signal changes.
- **SSR:** Effects do not run on the server.

**Basic usage:**

```tsx
const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log(count()); // logs on init and every time count changes
});
```

**Managing dependencies:** Solid automatically tracks which signals are accessed inside the effect. No manual dependency arrays needed.

```tsx
createEffect(() => {
  console.log("hello"); // runs only once — no tracked signals
});

createEffect(() => {
  console.log(count()); // runs every time count changes
});
```

**Nested effects:** Effects can be nested. The inner effect's subscriber is saved and restored properly.

```tsx
createEffect(() => {
  console.log("outer", count());
  createEffect(() => {
    console.log("inner", doubled());
  });
});
```

**Important:** Avoid setting signals within effects — this can cause infinite loops. Use `createMemo` for computing derived values instead.

---

## Lifecycle Functions

### onMount

```tsx
import { onMount } from "solid-js";
```

**Type signature:**

```typescript
function onMount(fn: () => void): void;
```

Runs a function once when the component is mounted to the DOM. Equivalent to `createEffect` that runs only once. Useful for accessing DOM elements, setting up subscriptions, or one-time browser setup.

```tsx
import { onMount } from "solid-js";

function Canvas() {
  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    ctx?.fillRect(0, 0, 100, 100);
  });

  return <canvas ref={canvas} />;
}
```

### onCleanup

```tsx
import { onCleanup } from "solid-js";
```

**Type signature:**

```typescript
function onCleanup<T extends () => any>(fn: T): T;
```

Registers a cleanup function that runs when the current reactive scope is disposed. Works in effects, components, and other reactive scopes.

```tsx
import { onCleanup, createSignal } from "solid-js";

function Timer() {
  const [time, setTime] = createSignal(0);
  const interval = setInterval(() => setTime(t => t + 1), 1000);

  onCleanup(() => clearInterval(interval));

  return <div>Time: {time()}</div>;
}
```

**Inside effects:**

```tsx
createEffect(() => {
  const handler = () => console.log(count());
  window.addEventListener("resize", handler);
  onCleanup(() => window.removeEventListener("resize", handler));
});
```

---

## Derived Values

### Derived Signals

A derived signal is a plain function that reads one or more signals. It re-evaluates when accessed and its dependencies have changed. No special API needed — just a function:

```tsx
const [count, setCount] = createSignal(5);
const double = () => count() * 2;

console.log(double()); // 10
```

Derived signals work with stores too:

```tsx
const [store, setStore] = createStore({ firstName: "John", lastName: "Doe" });
const fullName = () => `${store.firstName} ${store.lastName}`;
```

**Key point:** Derived signals don't cache — they recompute on every access. For expensive computations, use `createMemo`.

### createMemo

```tsx
import { createMemo } from "solid-js";
```

**Type signature:**

```typescript
function createMemo<T>(
  fn: (v: T) => T,
  value?: T,
  options?: {
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
  }
): () => T;
```

**Parameters:**

- **`fn`** (function): Computation function. Receives previous return value.
- **`value`** (optional): Initial value.
- **`options`** (optional): `{ equals?, name? }` — same as signals.

**Returns:** Read-only accessor function (getter).

Memos cache their result and only recompute when a tracked dependency changes. They are ideal for expensive computations.

```tsx
import { createMemo, createSignal } from "solid-js";

const [count, setCount] = createSignal(0);

const isEven = createMemo(() => count() % 2 === 0);
console.log(isEven()); // true

setCount(3);
console.log(isEven()); // false
```

**Accessing previous value:**

```tsx
const sum = createMemo((prev: number = 0) => prev + count(), 0);
```

**Custom equality:**

```tsx
const filtered = createMemo(
  () => items().filter(i => i.active),
  undefined,
  { equals: (a, b) => a?.length === b?.length }
);
```

**Memo vs. Effect:**

| Feature | `createMemo` | `createEffect` |
|---------|-------------|----------------|
| Returns a value | Yes (getter) | No (void) |
| Caches result | Yes | No |
| Purpose | Computed/derived values | Side effects |
| Runs in SSR | Yes | No |

**Best practices:**
- Keep memo functions pure (no side effects)
- Use memos for expensive computations, not trivial ones
- Memos are read-only — don't set signals inside them

---

## Reactive Utilities

### batch

```tsx
import { batch } from "solid-js";
```

**Type signature:**

```typescript
function batch<T>(fn: () => T): T;
```

Batches multiple signal updates into a single notification. Effects and memos only re-run once after the batch completes.

```tsx
const [a, setA] = createSignal(1);
const [b, setB] = createSignal(2);

batch(() => {
  setA(10);
  setB(20);
  // Effects don't run yet
});
// Effects run once here
```

**Automatic batching:** Solid automatically batches updates within event handlers and effects.

### untrack

```tsx
import { untrack } from "solid-js";
```

**Type signature:**

```typescript
function untrack<T>(fn: () => T): T;
```

Executes a function without tracking any signals accessed within it. Useful for reading signals without creating dependencies.

```tsx
createEffect(() => {
  const tracked = count();        // tracked
  const untracked = untrack(() => other()); // not tracked
  console.log(tracked, untracked);
});
```

### on

```tsx
import { on } from "solid-js";
```

Wraps an effect or memo to explicitly specify dependencies, only re-running when those specific signals change.

```tsx
createEffect(on(count, () => {
  console.log("count changed to", count());
}));
```

**With `defer` option:** By default, `on` runs immediately. Set `defer: true` to skip the initial run:

```tsx
createEffect(on(count, () => {
  console.log("count changed to", count());
}, { defer: true }));
```

---

## Secondary Primitives

### createResource

```tsx
import { createResource } from "solid-js";
```

A specialized signal designed for managing asynchronous data fetching. It wraps async operations and provides reactive properties for handling loading, success, and error states. Non-blocking — the application remains responsive during data retrieval.

**Basic usage:**

```tsx
import { createSignal, createResource, Show, Switch, Match } from "solid-js";

const fetchUser = async (id) => {
  const response = await fetch(`https://swapi.dev/api/people/${id}/`);
  return response.json();
};

function App() {
  const [userId, setUserId] = createSignal();
  const [user] = createResource(userId, fetchUser);

  return (
    <div>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(e.currentTarget.value)}
      />
      <Show when={user.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={user.error}>
          <span>Error: {user.error}</span>
        </Match>
        <Match when={user()}>
          <div>{JSON.stringify(user())}</div>
        </Match>
      </Switch>
    </div>
  );
}
```

**Resource signal properties:**

| Property | Description |
|----------|-------------|
| `state` | Current status: `unresolved`, `pending`, `ready`, `refreshing`, or `errored` |
| `loading` | Boolean — operation in progress |
| `error` | Error info if the operation fails |
| `latest` | Most recent data returned |

**Dynamic data handling — `mutate` and `refetch`:**

The second return value from `createResource` provides `mutate` and `refetch`:

```tsx
const [tasks, { mutate, refetch }] = createResource(fetchTasksFromServer);
```

- **`mutate`**: Optimistic mutations — provides instant feedback without waiting for server confirmation:

```tsx
mutate((todos) => [...todos, "do new task"]);
```

- **`refetch`**: Reloads the current query regardless of source changes. Useful for real-time data:

```tsx
const timer = setInterval(() => refetch(), 1000);
onCleanup(() => clearInterval(timer));
```

**With Suspense:**

```tsx
import { Suspense } from "solid-js";

<Suspense fallback={<div>Loading...</div>}>
  <Switch>
    <Match when={user.error}>
      <span>Error: {user.error.message}</span>
    </Match>
    <Match when={user()}>
      <div>{JSON.stringify(user())}</div>
    </Match>
  </Switch>
</Suspense>
```

### createComputed

```tsx
import { createComputed } from "solid-js";
```

**Type signature:**

```typescript
function createComputed<Next>(
  fn: EffectFunction<undefined | NoInfer<Next>, Next>
): void;
function createComputed<Next, Init = Next>(
  fn: EffectFunction<Init | Next, Next>,
  value: Init,
  options?: { name?: string }
): void;
```

Like `createEffect` but runs immediately during creation (synchronously in the reactive graph), before the next render. Useful for building writable derived signals and inter-dependent reactive computations.

```tsx
import { createComputed, createSignal } from "solid-js";

const [count, setCount] = createSignal(0);
const [doubled, setDoubled] = createSignal(0);

createComputed(() => {
  setDoubled(count() * 2);
});
```

### createRenderEffect

```tsx
import { createRenderEffect } from "solid-js";
```

**Type signature:**

```typescript
function createRenderEffect<Next>(
  fn: EffectFunction<undefined | NoInfer<Next>, Next>
): void;
function createRenderEffect<Next, Init = Next>(
  fn: EffectFunction<Init | Next, Next>,
  value: Init,
  options?: { name?: string }
): void;
```

A tailored effect that initiates immediately during the rendering process. Unlike `createEffect` (which defers to after render), `createRenderEffect` runs during render — useful for ref timing and DOM measurements.

**Execution timing:**

- **Initial run:** Immediately during render (before DOM is connected)
- **Subsequent runs:** When tracked signals change
- **SSR:** Runs on the server (unlike `createEffect`)

```tsx
import { createRenderEffect } from "solid-js";

function Component() {
  let el;
  createRenderEffect(() => {
    if (el) {
      console.log("Element dimensions:", el.offsetWidth, el.offsetHeight);
    }
  });
  return <div ref={el}>Content</div>;
}
```

### createDeferred

```tsx
import { createDeferred } from "solid-js";
```

**Type signature:**

```typescript
function createDeferred<T>(
  source: Accessor<T>,
  options?: {
    timeoutMs?: number;
    equals?: false | ((prev: T, next: T) => boolean);
    name?: string;
  }
): Accessor<T>;
```

Creates a deferred read-only signal that only updates when the browser is idle. Useful for deferring non-critical updates to keep the UI responsive.

```tsx
import { createDeferred, createSignal } from "solid-js";

const [search, setSearch] = createSignal("");
const deferredSearch = createDeferred(search, { timeoutMs: 100 });

// deferredSearch() lags behind search() — updates when idle
```

### createRoot

```tsx
import { createRoot } from "solid-js";
```

**Type signature:**

```typescript
function createRoot<T>(
  fn: (dispose: () => void) => T,
  detachedOwner?: Owner
): T;
```

Creates a new reactive root that is detached from its parent. Disposing the root cleans up all reactive computations within it. Useful for creating isolated reactive scopes outside the component tree.

```tsx
import { createRoot, createSignal, createEffect } from "solid-js";

const dispose = createRoot((dispose) => {
  const [count, setCount] = createSignal(0);
  createEffect(() => console.log(count()));
  setCount(1); // logs 1
  return dispose;
});

// Later: dispose() cleans up all signals and effects
```

---

## Fine-Grained Reactivity

### How It Works

Solid's reactivity is built on two key elements: **signals** and **observers** (effects/memos).

1. **Signals** store values and maintain a set of subscribers
2. **Effects** register as the current subscriber when they run
3. When a signal's getter is called, it adds the current subscriber to its subscriber list
4. When a signal's setter is called, it notifies all subscribers

**Simplified implementation:**

```typescript
let currentSubscriber = null;

function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function getter() {
    if (currentSubscriber) {
      subscribers.add(currentSubscriber);
    }
    return value;
  }

  function setter(newValue) {
    if (value === newValue) return;
    value = newValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  }

  return [getter, setter];
}

function createEffect(fn) {
  const previousSubscriber = currentSubscriber;
  currentSubscriber = fn;
  fn();
  currentSubscriber = previousSubscriber;
}
```

### Reactive Primitives Hierarchy

| Primitive | Description |
|-----------|-------------|
| **Signals** | Core data storage with getters/setters |
| **Stores** | Proxy-based signals for nested objects/arrays |
| **Memos** | Cached derived values (like effects that return a signal) |
| **Effects** | Side effects that track signal dependencies |
| **Resources** | Async data loading wrapped in signals |
| **Render effects** | Effects that run immediately during rendering |

### Synchronous vs Asynchronous Reactivity

- **Synchronous:** Signal updates immediately notify subscribers. Effects run synchronously within `batch`.
- **Asynchronous:** Resources and async operations integrate with Solid's Suspense boundaries.

### Key Concepts

- Signals are the core elements — they store and manage data
- Signals are both readable and writable via getters and setters
- Subscribers track signal changes and update automatically
- The system is data-driven — reactivity flows from the data
- Components run once; the reactive system handles all subsequent updates

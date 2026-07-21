# SolidJS Components

## Component Basics

Solid components are functions that return JSX. Unlike React, **component bodies run only once** — when first rendered into the DOM. After that, the reactive system handles all updates.

```tsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### Component Trees

Components nest hierarchically:

```
App
├── Header
├── Sidebar
├── Content
│   ├── Post
│   │   ├── PostHeader
│   │   ├── PostContent
│   │   └── PostFooter
│   └── Post
└── Footer
```

### Component Lifecycle

1. **Initialization:** Component function runs once, sets up reactive bindings
2. **Reactive updates:** Only the specific DOM nodes tied to changed signals update
3. **Cleanup:** `onCleanup` functions run when the component is removed from the DOM

**Key difference:** No re-rendering of component functions. The component body is setup code, not render code.

### Importing and Exporting

```tsx
// Card.tsx
export function Card(props) {
  return <div class="card">{props.children}</div>;
}

// App.tsx
import { Card } from "./Card";

function App() {
  return (
    <Card>
      <p>Content inside the card</p>
    </Card>
  );
}
```

---

## Understanding JSX in Solid

Solid uses JSX to return real DOM elements directly. JSX compiles to fine-grained reactive DOM updates — no virtual DOM.

### Rules

1. **Return a single root element** — Components must return one root element (or fragment)
2. **Close all tags** — Self-closing tags are required: `<img src="..." />`
3. **Properties vs. attributes** — JSX props are different from HTML attributes

### Dynamic Expressions

Use curly braces `{}` for dynamic values:

```tsx
function Component() {
  const animal = { breed: "cat", name: "Midnight" };
  return (
    <p>I have a {animal.breed} named {animal.name}!</p>
  );
}
```

### HTML Attributes in JSX

- Event listeners: `onClick` (camelCase) or `onclick` (lowercase, both work for delegated events)
- Dynamic values: replace `"..."` with `{...}`
- Inline styles: use double braces `{{ }}` for objects

```tsx
<button class="myClass" onClick={handleClick}>
  Click me!
</button>

<button style={{ color: "red", "font-size": "2rem" }}>
  Styled button
</button>
```

---

## Props

Props are the mechanism for passing data from parent to child components. In Solid, props are **reactive** — accessing a prop within a tracking scope creates a dependency.

```tsx
function Child(props) {
  return <p>{props.message}</p>;
}

function Parent() {
  return <Child message="Hello from parent!" />;
}
```

### Props are Reactive

Props in Solid are accessed through a proxy. This means:

- Destructuring props **breaks reactivity** — always access via `props.xxx`
- Props update reactively when the parent changes them

```tsx
// BAD — breaks reactivity
function Component({ name }) {
  return <h1>{name}</h1>;
}

// GOOD — preserves reactivity
function Component(props) {
  return <h1>{props.name}</h1>;
}
```

### mergeProps

```tsx
import { mergeProps } from "solid-js";
```

**Type signature:**

```typescript
function mergeProps<T extends unknown[]>(...sources: T): MergeProps<T>;
```

Merges multiple potentially reactive objects together. Behaves like `Object.assign` but retains the reactivity of individual properties. Later sources take priority over earlier ones.

```tsx
import { mergeProps } from "solid-js";

function MyComponent(props) {
  const finalProps = mergeProps({ defaultName: "Ryan Carniato" }, props);
  return <div>Hello {finalProps.defaultName}</div>;
}
```

Useful for setting default prop values while preserving reactivity.

### splitProps

```tsx
import { splitProps } from "solid-js";
```

**Type signature:**

```typescript
function splitProps<
  T extends Record<any, any>,
  K extends [readonly (keyof T)[], ...(readonly (keyof T)[])[]],
>(props: T, ...keys: K): SplitProps<T, K>;
```

Splits a single props object into multiple groups, retaining reactivity. Returns an array of props objects corresponding to each set of keys, plus a final object with remaining keys.

```tsx
import { splitProps } from "solid-js";

function Component(props) {
  const [local, others] = splitProps(props, ["class", "style"]);
  return (
    <div class={local.class} style={local.style} {...others} />
  );
}
```

**Splitting multiple groups:**

```tsx
const [greetingProps, personalInfoProps, restProps] = splitProps(
  props,
  ["name"],
  ["age", "email"]
);
```

### children

Resolves and transforms children for consistent access:

```tsx
import { children } from "solid-js";

function List(props) {
  const resolved = children(() => props.children);
  return <ul>{resolved()}</ul>;
}
```

**Type signature:**

```typescript
function children(fn: Accessor<JSX.Element>): Accessor<ResolvedChildren> & {
  toArray: () => ResolvedJSXElement[];
};
```

---

## Event Handlers

### Using Events

Prefix event names with `on` (delegated) or `on:` (native, non-delegated):

```tsx
// Delegated event (case-insensitive)
<button onClick={handleClick}>Click me</button>
<button onclick={handleClick}>Also works</button>

// Native event (case-sensitive, not delegated)
<div on:scroll={handleScroll}>Long content...</div>

// Custom events
<button on:Custom-Event={handleCustom}>Custom</button>
```

### Delegated vs. Native Events

- **Delegated** (`onClick`): Solid attaches a single listener at the document root. Case-insensitive. More efficient for common events.
- **Native** (`on:click`): Solid attaches the listener directly to the element. Case-sensitive. Required for custom events and events that don't bubble.

### Binding Events with Data

Pass an array `[handler, data]` to bind data as the first argument (avoids closure overhead):

```tsx
const handler = (data, event) => {
  console.log("Data:", data, "Event:", event);
};

<button onClick={[handler, "Hello!"]}>Click Me</button>
```

### Event Delegation

Solid delegates common events (click, input, change, etc.) by attaching listeners at the document root. This is more efficient than individual listeners on each element.

**Delegated events include:** `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mousemove`, `mouseout`, `keydown`, `keyup`, `keypress`, `input`, `change`, `submit`, `focus`, `blur`, `scroll`, `wheel`, `load`, `error`, etc.

---

## Class and Style

### Inline Styling

Pass a string or object to the `style` attribute:

```tsx
// String
<div style="color: red;">Red div</div>

// Object — keys must be dash-case
<div style={{ color: "red", "font-size": "2rem" }}>Red div</div>
```

**style reference:**

```typescript
// Syntax
<div style="color: green" />
<div style={{ color: "green" }} />

// Value: string | CSSProperties
// - String: written as inline CSS text
// - Object: applied via element.style.setProperty, keys use dash-case
// - Nullish values remove the property
// - CSS custom properties: { "--my-color": "red" }
```

### Classes

Import CSS files and use the `class` attribute:

```tsx
import "./Card.css";

function Card() {
  return <div class="card">Content</div>;
}
```

### classList

Apply multiple conditional classes efficiently. Uses an object where keys are class names and values are booleans:

```tsx
import { createSignal } from "solid-js";

const [current, setCurrent] = createSignal("foo");

<button
  classList={{ selected: current() === "foo" }}
  onClick={() => setCurrent("foo")}
>
  foo
</button>
```

**classList reference:**

```typescript
// Syntax
<div classList={{ active: state.active }} />

// Value: Record<string, boolean | undefined>
// - Truthy values add the class, falsy values remove it
// - Keys can contain multiple space-separated class names
// - Updates are per-class, not replacing the whole class attribute
// - Works through prop spreads and <Dynamic> for intrinsic elements
// - If both class and classList are reactive, class can overwrite classList
// - SSR: merges class, className, and classList into emitted class attribute
```

**Mixing class and classList:** Set `class` to a static string and use `classList` for dynamic classes. If `class` must be reactive, place it before `classList`.

---

## Refs

### Accessing DOM Elements

Solid provides a `ref` system for direct DOM access within JSX:

```tsx
function Component() {
  let myElement;
  return (
    <div>
      <p ref={myElement}>My Element</p>
    </div>
  );
}
```

**ref reference:**

```typescript
// Syntax
<div ref={value} />

// Value: variable binding or callback function
// - Variable refs: assigned during render, before element is connected to DOM
// - Callback refs: called with the element before it's added to DOM
// - Component refs: work only when the component forwards the ref prop
```

### Callback Refs

Access the element before it's added to the DOM:

```tsx
<p ref={(el) => {
  myElement = el;
  // el is created but not yet added to the DOM
}}>
  My Element
</p>
```

### TypeScript

Use definite assignment assertion since Solid assigns the variable during render:

```tsx
let myElement!: HTMLDivElement;
```

### Forwarding Refs

Pass refs from parent to child components. The child receives the ref as a prop:

```tsx
// Parent
function ParentComponent() {
  let canvasRef;
  return (
    <div>
      <Canvas ref={canvasRef} />
      <button onClick={() => animateCanvas(canvasRef)}>Animate</button>
    </div>
  );
}

// Child
function Canvas(props) {
  return (
    <div class="canvas-container">
      <canvas ref={props.ref} />
    </div>
  );
}
```

When a child component receives a `ref` from a parent, it's always passed as a callback function, regardless of whether the parent used a variable or callback.

---

## JSX Attributes Reference

### ref

```tsx
<div ref={value} />
```

- Variable binding: assigns element to variable during render
- Callback: called with element before DOM attachment
- Component: works only when component forwards `ref` prop

### style

```tsx
<div style="color: green" />
<div style={{ color: "green", "--my-var": "value" }} />
```

- String: inline CSS text
- Object: applied via `element.style.setProperty`, keys in dash-case
- Nullish values remove properties

### classList

```tsx
<div classList={{ active: state.active, hidden: !state.visible }} />
```

- Object with boolean values controlling each class
- Per-class updates, not full attribute replacement

### prop:*

```tsx
<div prop:scrollTop={value} />
```

- Assigns value directly to the DOM property (not attribute)
- Does not produce SSR output
- Use when a DOM property must receive the value directly

### attr:*

```tsx
<my-element attr:status={value} />
```

- Writes value to the HTML attribute
- `undefined` or `null` removes the attribute
- Produces SSR output

### use:*

```tsx
<div use:myDirective={value} />
```

**Type:**

```typescript
type Accessor<T> = () => T;
function directive(element: Element, accessor?: Accessor<any>): void;
```

- **Syntax:** `use:name={value}` passes the element and an accessor for value to the directive
- Without an explicit value, the accessor returns `true`
- The directive runs during rendering in the current owner, **before** the element is connected to the DOM
- Can create effects and register cleanup within the directive
- Works only on native elements (including custom elements), not forwarded through user-defined components

```tsx
// Define a directive
function model(element, value) {
  // element: the DOM element
  // value: accessor for the bound value
  createRenderEffect(() => {
    element.value = value();
  });
}

// Register it (in a module that's imported)
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [() => any, (v: any) => void];
    }
  }
}

// Use it
<input use:model={[value, setValue]} />
```

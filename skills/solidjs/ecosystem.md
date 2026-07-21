# SolidJS Ecosystem

## Rendering API

### render

```tsx
import { render } from "solid-js/web";
```

**Type signature:**

```typescript
type MountableElement =
  | Element | Document | ShadowRoot | DocumentFragment | Node;

function render(code: () => JSX.Element, element: MountableElement): () => void;
```

**Parameters:**

- **`code`**: A function returning JSX to render.
- **`element`**: The DOM element to mount into.

**Returns:** A disposal function to unmount and clean up.

Mounts a Solid application into a DOM element:

```tsx
import { render } from "solid-js/web";
import App from "./App";

render(() => <App />, document.getElementById("root"));
```

### hydrate

```tsx
import { hydrate } from "solid-js/web";
```

**Type signature:**

```typescript
function hydrate(
  fn: () => JSX.Element,
  node: MountableElement,
  options?: { renderId?: string; owner?: unknown }
): () => void;
```

**Parameters:**

- **`fn`**: A function returning JSX to hydrate.
- **`node`**: The DOM element containing server-rendered HTML.
- **`options`** (optional): `{ renderId?, owner? }` for multi-root hydration.

Hydrates server-rendered HTML with client-side reactivity. Used in SSR applications:

```tsx
import { hydrate } from "solid-js/web";
import App from "./App";

hydrate(() => <App />, document.getElementById("root"));
```

### renderToString

```tsx
import { renderToString } from "solid-js/web";
```

**Type signature:**

```typescript
function renderToString<T>(
  fn: () => T,
  options?: { nonce?: string; renderId?: string }
): string;
```

Renders a Solid application to an HTML string on the server. Returns the complete HTML string.

```tsx
import { renderToString } from "solid-js/web";
import App from "./App";

const html = renderToString(() => <App />);
```

### renderToStream

```tsx
import { renderToStream } from "solid-js/web";
```

**Type signature:**

```typescript
function renderToStream<T>(
  fn: () => T,
  options?: {
    nonce?: string;
    renderId?: string;
    onCompleteShell?: (info: { write: (v: string) => void }) => void;
    onCompleteAll?: (info: { write: (v: string) => void }) => void;
  }
): {
  pipe: (writable: { write: (v: string) => void }) => void;
  pipeTo: (writable: WritableStream) => void;
};
```

Streams server-rendered HTML. Supports `pipe` (Node.js streams) and `pipeTo` (web streams). Useful for streaming SSR with Suspense boundaries.

```tsx
import { renderToStream } from "solid-js/web";
import App from "./App";

// Node.js
renderToStream(() => <App />).pipe(res);

// Web Streams
renderToStream(() => <App />).pipeTo(writable);
```

### isServer

```tsx
import { isServer } from "solid-js/web";
```

**Type:**

```typescript
const isServer: boolean;
```

A boolean constant — `true` on the server, `false` in the browser. Exported as a constant so bundlers can eliminate unreachable branches (tree-shaking).

```tsx
import { isServer } from "solid-js/web";

if (isServer) {
  // Server-only code — stripped from client bundle
} else {
  // Client-only code — stripped from server bundle
}
```

---

## Solid Router

**Docs:** https://docs.solidjs.com/solid-router

Solid Router is the universal router for Solid, working for both client and server rendering. Inspired by React Router and Ember Router.

### Installation

```bash
npm install @solidjs/router
```

### Basic Setup

```tsx
import { Router, Route } from "@solidjs/router";
import { render } from "solid-js/web";

import Home from "./pages/Home";
import About from "./pages/About";

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  ),
  document.getElementById("root")
);
```

### Nested Routes

```tsx
<Router>
  <Route path="/" component={Layout}>
    <Route path="/" component={Home} />
    <Route path="/users" component={Users} />
    <Route path="/users/:id" component={UserDetail} />
  </Route>
</Router>
```

### Navigation

```tsx
import { A, useNavigate } from "@solidjs/router";

// Link component
<A href="/about">About</A>

// Programmatic navigation
const navigate = useNavigate();
navigate("/users/123");
```

### Route Parameters

```tsx
import { useParams } from "@solidjs/router";

function UserDetail() {
  const params = useParams();
  return <h1>User {params.id}</h1>;
}
```

### Data Loading

```tsx
import { createResource } from "solid-js";
import { useParams } from "@solidjs/router";

function UserDetail() {
  const params = useParams();
  const [user] = createResource(() => params.id, fetchUser);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <h1>{user().name}</h1>
    </Suspense>
  );
}
```

### Key Router APIs

| API | Description |
|-----|-------------|
| `Router` | Root router component |
| `Route` | Route definition with path and component |
| `A` | Anchor link component for navigation |
| `useNavigate` | Programmatic navigation function |
| `useParams` | Access route parameters |
| `useLocation` | Access current location info |
| `useSearchParams` | Access and update URL search params |
| `NavLink` | Link with active state |

**Requirements:** Solid v1.8.4 or later for the latest router.

---

## SolidStart

**Docs:** https://docs.solidjs.com/solid-start

SolidStart is Solid's full-stack meta-framework, similar to Next.js for React. Built on Solid's fine-grained reactivity.

### Features

- **Fine-grained reactivity** — Powered by Solid
- **Isomorphic, nested routing** — Same routes on client and server
- **Multiple rendering modes** — CSR, SSR (sync/async/streaming), and SSG
- **CLI and templates** — Quick project scaffolding
- **Deployment presets** — Netlify, Vercel, AWS, Cloudflare, and more

### Creating a SolidStart Project

```bash
npm init solid
# Choose "Yes" for "Is this a SolidStart project?"
```

### Project Structure

```
src/
├── routes/          File-based routing
│   ├── index.tsx    Home page (/)
│   ├── about.tsx    About page (/about)
│   └── users/
│       ├── index.tsx    Users list (/users)
│       └── [id].tsx     User detail (/users/:id)
├── components/      Shared components
├── entry-client.tsx Client entry point
├── entry-server.tsx Server entry point
└── app.tsx          Root app component
```

### Rendering Modes

SolidStart supports multiple rendering modes configured in `app.config.ts`:

```tsx
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,    // Server-side rendering (default)
  // ssr: false, // Client-side rendering only
  // experimental: { streaming: true }, // Streaming SSR
});
```

### Server Functions

```tsx
import { serverFunction } from "@solidjs/start/server";

export const getUser = serverFunction(async (id: string) => {
  return await db.users.find(id);
});
```

### API Routes

```
src/routes/api/
├── users.ts       GET /api/users
└── users/[id].ts  GET /api/users/:id
```

```tsx
// src/routes/api/users.ts
export const GET = async (event) => {
  const users = await db.users.findAll();
  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
  });
};
```

### Deployment Presets

| Platform | Preset |
|----------|--------|
| Netlify | `netlify` |
| Vercel | `vercel` |
| Cloudflare | `cloudflare` |
| AWS | `aws` |
| Node.js | `node` |

```tsx
export default defineConfig({
  preset: "vercel",
});
```

---

## Solid Meta

**Docs:** https://docs.solidjs.com/solid-meta

Solid Meta provides asynchronous SSR-ready document head management. Define `document.head` tags at any level of the component hierarchy.

### Installation

```bash
npm install @solidjs/meta
```

### Basic Usage

```tsx
import { Title, Meta, Link } from "@solidjs/meta";

function AboutPage() {
  return (
    <>
      <Title>About Us</Title>
      <Meta name="description" content="Learn about our company" />
      <Link rel="canonical" href="https://example.com/about" />
      <main>
        <h1>About Us</h1>
      </main>
    </>
  );
}
```

### Available Components

| Component | Description |
|-----------|-------------|
| `Title` | Sets `<title>` tag |
| `Meta` | Sets `<meta>` tags |
| `Link` | Sets `<link>` tags |
| `Style` | Sets `<style>` tags |
| `Script` | Sets `<script>` tags |

---

## Deployment Options

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli
netlify deploy
```

### Cloudflare

SolidStart supports Cloudflare Pages with the `cloudflare` preset:

```tsx
export default defineConfig({
  preset: "cloudflare",
});
```

### AWS via SST

```tsx
export default defineConfig({
  preset: "aws",
});
```

---

## Styling Options

Solid works with various CSS solutions:

| Solution | Description |
|----------|-------------|
| CSS Modules | Scoped CSS with `.module.css` files |
| Tailwind CSS | Utility-first CSS framework |
| Tailwind CSS v3 | Previous version of Tailwind |
| UnoCSS | Atomic CSS engine |
| SASS | CSS preprocessor |
| LESS | CSS preprocessor |
| Macaron | CSS-in-JS solution |

### CSS Modules

```tsx
import styles from "./Card.module.css";

function Card() {
  return <div class={styles.card}>Content</div>;
}
```

### Tailwind CSS

```tsx
function Card() {
  return <div class="bg-white rounded-lg shadow p-4">Content</div>;
}
```

---

## Guides Overview

### State Management

Solid provides multiple state management primitives:

1. **Signals** — For single values and simple state
2. **Stores** — For complex, nested objects and arrays
3. **Context** — For sharing state across component trees
4. **External stores** — Solid integrates well with external state libraries

### Routing & Navigation

Use `@solidjs/router` for client-side routing with nested routes, data loading, and navigation.

### Fetching Data

Solid provides `createResource` for async data fetching integrated with the reactive system and Suspense:

```tsx
import { createResource } from "solid-js";

function UserProfile({ id }) {
  const [user] = createResource(() => id(), fetchUser);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <h1>{user()?.name}</h1>
    </Suspense>
  );
}
```

### Testing

Solid testing utilities work with Vitest and other test runners. Use `@solidjs/testing-library` for component testing.

```tsx
import { render, fireEvent } from "@solidjs/testing-library";
import { describe, it, expect } from "vitest";

describe("Counter", () => {
  it("increments", async () => {
    const { getByText } = render(() => <Counter />);
    const button = getByText("Increment");
    fireEvent.click(button);
    expect(getByText("Count: 1")).toBeTruthy();
  });
});
```

---

## TypeScript

Solid has first-class TypeScript support.

### tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["solid-js"]
  }
}
```

### Type-Safe Components

```tsx
import { Component } from "solid-js";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class={`btn btn-${props.variant ?? "primary"}`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
```

### Type-Safe Signals

```tsx
const [count, setCount] = createSignal<number>(0);
const [user, setUser] = createSignal<User | null>(null);
```

### Type-Safe Stores

```tsx
interface AppState {
  user: { id: number; name: string } | null;
  theme: "light" | "dark";
}

const [state, setState] = createStore<AppState>({
  user: null,
  theme: "light",
});
```

### Event Handler Typing

```tsx
import { JSX } from "solid-js";

const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
  event.currentTarget; // HTMLButtonElement
};
```

---

## Environment Variables

SolidStart supports environment variables via `.env` files:

```bash
# .env
DATABASE_URL=postgresql://...
API_KEY=your-api-key
```

Access in code:

```tsx
const dbUrl = import.meta.env.DATABASE_URL;
```

Server-only variables:

```tsx
// Only available on the server
const apiKey = process.env.API_KEY;
```

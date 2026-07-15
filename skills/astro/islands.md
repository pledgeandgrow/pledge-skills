# Islands Architecture

Astro's islands architecture enables selective hydration — interactive components are hydrated independently while the rest of the page stays static HTML.

---

## What is an Island?

An island is an enhanced UI component on an otherwise static page of HTML.

- **Client island** — Interactive JS component hydrated separately on the client
- **Server island** — Server-rendered component that streams its dynamic content independently

Both run expensive/slow processes independently on a per-component basis for optimized page loads.

---

## Client Islands

### How They Work

1. Astro renders the full page to static HTML on the server
2. Interactive components (islands) are hydrated separately on the client
3. Each island runs in isolation — no shared runtime between islands
4. Multiple islands can exist on the same page
5. Islands can share state via shared stores or events

### Client Directives

| Directive | When to Hydrate | Use Case |
|-----------|-----------------|----------|
| `client:load` | Immediately on page load | Critical interactive elements |
| `client:idle` | When browser is idle (requestIdleCallback) | Below-the-fold, non-critical |
| `client:visible` | When visible in viewport (IntersectionObserver) | Comments, widgets far down |
| `client:media="(max-width: 50em)"` | When media query matches | Mobile-only/desktop-only components |
| `client:only="react"` | Skip server render, render only on client | Components that depend on `window`/`document` |

```astro
---
import Counter from '../components/Counter.jsx';
import Comments from '../components/Comments.svelte';
import Sidebar from '../components/Sidebar.vue';
---
<Counter client:load />
<Comments client:visible />
<Sidebar client:idle />
```

### Benefits of Client Islands

- **Zero JS by default** — only hydrated components ship JS
- **Selective hydration** — hydrate only what needs interactivity
- **Multi-framework** — React, Vue, Svelte, SolidJS, Preact, Alpine.js on the same page
- **Independent** — each island is isolated, failure in one doesn't break others

---

## Server Islands

Server islands combine high-performance static HTML with dynamic server-rendered content. They allow parts of a static page to be server-rendered independently and streamed in.

### Server Island Components

Use `server:defer` directive to mark a component as a server island:

```astro
---
// src/components/UserProfile.astro
const { userId } = Astro.props;
const user = await fetchUser(userId);
---
<div class="profile">
  <img src={user.avatar} alt={user.name} />
  <span>{user.name}</span>
</div>
```

```astro
---
// src/pages/index.astro
import UserProfile from '../components/UserProfile.astro';
---
<html>
  <body>
    <h1>Welcome</h1>
    <UserProfile server:defer userId="123" />
  </body>
</html>
```

### Passing Props to Server Islands

```astro
<UserProfile server:defer userId={session.userId} />
```

### Server Island Fallback Content

```astro
---
import UserProfile from '../components/UserProfile.astro';
---
<UserProfile server:defer userId="123">
  <div slot="fallback">
    <p>Loading profile...</p>
  </div>
</UserProfile>
```

### How It Works

1. The static page renders immediately with fallback content
2. The server island renders asynchronously on the server
3. When ready, the island content streams in and replaces the fallback
4. The page is not blocked by slow server island rendering

### Caching

Server islands can be cached independently:

```astro
<UserProfile server:defer userId="123" cacheOptions={{ ttl: 60_000 }} />
```

### Accessing the Page URL

```astro
---
// src/components/ShareButtons.astro
const url = Astro.url;
---
```

---

## Mixing Frameworks

Astro supports multiple UI frameworks on the same page:

```astro
---
import ReactCounter from '../components/ReactCounter.jsx';
import VueComments from '../components/VueComments.vue';
import SvelteSearch from '../components/SvelteSearch.svelte';
---
<ReactCounter client:load />
<VueComments client:visible />
<SvelteSearch client:idle />
```

### When to Mix Frameworks

- Migrating from one framework to another incrementally
- Using a framework-specific library (e.g., a React-only charting library)
- Team members with different framework expertise
- Choosing the best tool per component

---

## Sharing State Between Islands

Islands run in isolation but can share state via:

### Shared Store (Nanostores)

```js
// src/store.js
import { atom } from 'nanostores';
export const cart = atom([]);

export function addToCart(item) {
  cart.set([...cart.get(), item]);
}
```

```jsx
// React island
import { useStore } from '@nanostores/react';
import { cart, addToCart } from '../store';

function CartButton() {
  const items = useStore(cart);
  return <button onClick={() => addToCart('item')}>Cart ({items.length})</button>;
}
```

```svelte
<!-- Svelte island -->
<script>
  import { cart, addToCart } from '../store';
  import { useStore } from '@nanostores/svelte';
  const items = useStore(cart);
</script>
<button on:click={() => addToCart('item')}>Cart ({$items.length})</button>
```

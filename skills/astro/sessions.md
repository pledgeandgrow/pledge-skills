# Sessions

Sessions allow sharing data between requests for on-demand rendered (SSR) pages.

---

## Configuring Sessions

Sessions require a storage driver. Node, Cloudflare, and Netlify adapters auto-configure a default driver:

```ts
import { defineConfig, sessionDrivers } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  session: {
    driver: sessionDrivers.lruCache({ max: 800 }),
  },
});
```

### Session Config Options

| Option | Type | Description |
|--------|------|-------------|
| `session.driver` | `Driver` | Storage driver |
| `session.options` | `object` | Driver-specific options |
| `session.cookie` | `object` | Cookie configuration |
| `session.ttl` | `number` | Session TTL in seconds |

### Overriding Configuration at Runtime

```ts
export default defineConfig({
  session: {
    driver: sessionDrivers.lruCache({ max: 1000 }),
    cookie: {
      name: 'my_session',
      secure: true,
      sameSite: 'lax',
    },
    ttl: 60 * 60 * 24, // 24 hours
  },
});
```

---

## Interacting with Session Data

The session object is available as `Astro.session` (in components/pages) and `context.session` (in endpoints, middleware, actions).

### Methods

| Method | Description |
|--------|-------------|
| `session.get(key)` | Get a value by key |
| `session.set(key, value)` | Set a value |
| `session.delete(key)` | Delete a value |
| `session.has(key)` | Check if key exists |
| `session.regenerate()` | Regenerate session ID |
| `session.destroy()` | Destroy the session |

### In Astro Components and Pages

```astro
---
// Read from session
const cart = await Astro.session?.get('cart') || [];
---
<p>Items in cart: {cart.length}</p>
```

```astro
---
// Write to session
await Astro.session?.set('cart', [...cart, newItem]);
return Astro.redirect('/cart');
---
```

### In API Endpoints

```ts
export const POST: APIRoute = async ({ session }) => {
  const cart = await session?.get('cart') || [];
  cart.push({ id: 1, name: 'Product' });
  await session?.set('cart', cart);
  return new Response(JSON.stringify({ success: true }));
};
```

### In Actions

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  addToCart: defineAction({
    input: z.object({ productId: z.string() }),
    handler: async (input, context) => {
      const cart = await context.session?.get('cart') || [];
      cart.push(input.productId);
      await context.session?.set('cart', cart);
      return { count: cart.length };
    },
  }),
};
```

### In Middleware

```ts
export function onRequest(context, next) {
  // Initialize session data
  if (!context.session?.has('views')) {
    context.session?.set('views', 0);
  }
  const views = context.session?.get('views') + 1;
  context.session?.set('views', views);
  return next();
}
```

---

## Session Data Types

Session data must be serializable (JSON-safe):

```ts
// Valid
await session.set('user', { id: 1, name: 'Alice' });
await session.set('count', 42);
await session.set('tags', ['a', 'b', 'c']);
await session.set('active', true);

// Invalid (not serializable)
await session.set('func', () => {}); // functions
await session.set('date', new Date()); // Date objects (use .toISOString())
```

---

## Session Regeneration

Regenerate session ID (e.g., after login to prevent fixation):

```astro
---
// After successful login
await Astro.session?.regenerate();
await Astro.session?.set('user', { id: 1, name: 'Alice' });
---
```

---

## Session Destruction

Destroy session on logout:

```astro
---
await Astro.session?.destroy();
return Astro.redirect('/login');
---
```

---

## Session Drivers

| Driver | Package | Use Case |
|--------|---------|----------|
| `lruCache` | Built-in | In-memory, development, small apps |
| `file` | Built-in | File-based persistence |
| `redis` | Community | Production, multi-instance |
| `upstash` | Community | Serverless Redis |

```ts
import { sessionDrivers } from 'astro/config';

export default defineConfig({
  session: {
    driver: sessionDrivers.lruCache({ max: 500 }),
  },
});
```

# Middleware

Middleware runs before every request, allowing you to intercept, modify, and control responses.

---

## Basic Usage

1. Create `src/middleware.ts` (or `src/middleware/index.ts`)
2. Export an `onRequest()` function

```ts
// src/middleware.ts
export function onRequest(context, next) {
  // Intercept request data
  context.locals.title = 'New title';
  context.locals.user = getUserFromCookie(context.request);

  // Return a Response or call next()
  return next();
}
```

3. Access data in `.astro` files via `Astro.locals`:

```astro
---
const { title, user } = Astro.locals;
---
<h1>{title}</h1>
{user && <p>Welcome, {user.name}</p>}
```

---

## The Context Object

Middleware receives a `context` object with:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `URL` | The request URL |
| `request` | `Request` | The Request object |
| `locals` | `object` | Mutable object for sharing data |
| `cookies` | `AstroCookies` | Cookie API |
| `redirect` | `function` | Redirect helper |
| `rewrite` | `function` | Rewrite helper |
| `site` | `URL \| undefined` | Configured site URL |
| `generator` | `string` | Astro version string |
| `params` | `object` | Route params |
| `props` | `object` | Route props |

---

## Storing Data in `context.locals`

```ts
export function onRequest(context, next) {
  context.locals.startTime = performance.now();
  context.locals.user = authenticate(context.request);
  context.locals.theme = context.cookies.get('theme')?.value || 'light';
  return next();
}
```

### TypeScript for Locals

```ts
// src/env.d.ts
declare namespace App {
  interface Locals {
    user: User | null;
    theme: 'light' | 'dark';
    startTime: number;
  }
}
```

---

## Chaining Middleware

Use `defineMiddleware` and `sequence` to chain multiple middleware:

```ts
import { defineMiddleware, sequence } from 'astro:middleware';

const authMiddleware = defineMiddleware((context, next) => {
  context.locals.user = getUser(context.request);
  return next();
});

const loggingMiddleware = defineMiddleware((context, next) => {
  console.log(`${context.request.method} ${context.url.pathname}`);
  return next();
});

export const onRequest = sequence(authMiddleware, loggingMiddleware);
```

---

## Example: Redacting Sensitive Information

```ts
export function onRequest(context, next) {
  // Check for sensitive paths
  if (context.url.pathname.startsWith('/admin')) {
    const user = context.locals.user;
    if (!user?.isAdmin) {
      return context.redirect('/login');
    }
  }
  return next();
}
```

---

## Middleware Types

```ts
import { defineMiddleware } from 'astro:middleware';

export const myMiddleware = defineMiddleware((context, next) => {
  // Typed context and next()
  return next();
});
```

---

## Rewriting

Middleware can rewrite requests to different routes:

```ts
export function onRequest(context, next) {
  // Rewrite /old-blog/* to /blog/*
  if (context.url.pathname.startsWith('/old-blog/')) {
    const newPath = context.url.pathname.replace('/old-blog/', '/blog/');
    return context.rewrite(newPath);
  }
  return next();
}
```

---

## Error Pages

Middleware can intercept errors and render custom error pages:

```ts
export function onRequest(context, next) {
  try {
    return next();
  } catch (err) {
    console.error(err);
    return context.rewrite('/500');
  }
}
```

---

## Middleware with Actions

Gate actions from middleware:

```ts
export function onRequest(context, next) {
  if (context.url.pathname.startsWith('/api/actions/')) {
    const user = context.locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  return next();
}
```

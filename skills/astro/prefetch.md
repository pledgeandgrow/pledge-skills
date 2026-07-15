# Prefetch

Prefetch links for snappier navigation between pages by loading page data before the user clicks.

---

## Enable Prefetching

```js
// astro.config.mjs
export default defineConfig({
  prefetch: true,
});
```

Or enable per-link with `data-astro-prefetch`:

```astro
<a href="/about" data-astro-prefetch>About</a>
```

---

## Prefetch Configuration

```js
export default defineConfig({
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
```

### Prefetch Strategies

| Strategy | When | Description |
|----------|------|-------------|
| `hover` | On mouse hover | Prefetch when user hovers over link (default) |
| `viewport` | On visible | Prefetch when link enters viewport |
| `tap` | On tap (mobile) | Prefetch on touch start |
| `load` | On page load | Prefetch all links immediately |

```js
export default defineConfig({
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
```

### Per-Link Strategy

```astro
<a href="/about" data-astro-prefetch="hover">About</a>
<a href="/blog" data-astro-prefetch="viewport">Blog</a>
<a href="/contact" data-astro-prefetch="tap">Contact</a>
<a href="/heavy" data-astro-prefetch="load">Heavy Page</a>
```

### Prefetch All Links by Default

```js
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
```

All links will be prefetched automatically. Opt out per-link:

```astro
<a href="/no-prefetch" data-astro-prefetch="false">No prefetch</a>
```

---

## Prefetch Programmatically

```ts
import { prefetch } from 'astro:prefetch';

// Prefetch a URL
prefetch('/about');

// With eagerness level
prefetch('/about', { eagerness: 'eager' });
```

### Eagerness Options

| Value | Description |
|-------|-------------|
| `'eager'` | Fetch immediately |
| `'moderate'` | Fetch when idle |
| `'lazy'` | Fetch when link is visible |

---

## Using with View Transitions

Prefetch works automatically with `<ClientRouter />` (view transitions):

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

When both are enabled, prefetched pages are cached and view transitions use the cached content for instant navigation.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Speculation Rules API (native) |
| Firefox | Falls back to `fetch()` |
| Safari | Falls back to `fetch()` |

### Recommendations

- Use `hover` strategy for most sites (good balance of performance vs bandwidth)
- Use `viewport` for content-heavy sites where users scroll
- Use `load` only for small sites or critical navigation
- Avoid `load` with many links — it will fetch everything at once

---

## Migrating from `@astrojs/prefetch`

The old `@astrojs/prefetch` integration is deprecated. Built-in prefetch replaces it:

1. Remove `@astrojs/prefetch` integration:

```bash
npm uninstall @astrojs/prefetch
```

2. Remove from `astro.config.mjs`:

```js
// Remove this
import prefetch from '@astrojs/prefetch';
// integrations: [prefetch()]

// Add this
export default defineConfig({
  prefetch: true,
});
```

3. Replace `data-astro-prefetch-hover` with `data-astro-prefetch="hover"`

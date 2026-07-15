# Pages & Routing

Astro uses file-based routing — files in `src/pages/` automatically become routes.

---

## Supported Page Files

| Extension | Description |
|-----------|-------------|
| `.astro` | Astro component pages |
| `.md` | Markdown pages |
| `.mdx` | MDX pages (with components) |
| `.html` | Static HTML pages |

---

## Static Routes

File paths map directly to URLs:

```
src/pages/index.astro        → mysite.com/
src/pages/about.astro        → mysite.com/about
src/pages/about/index.astro  → mysite.com/about
src/pages/about/me.astro     → mysite.com/about/me
src/pages/posts/1.md         → mysite.com/posts/1
```

No separate routing config needed — adding a file creates a route.

---

## Dynamic Routes

Use `[param]` syntax in filenames for dynamic routes:

```
src/pages/blog/[slug].astro    → /blog/:slug
src/pages/[...slug].astro      → /blog/2024/post-1 (rest params)
src/pages/[...path].astro      → catch-all route
```

### Static (SSG) Mode

Must predetermine all routes using `getStaticPaths()`:

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
const { post } = Astro.props;
---
<h1>{post.data.title}</h1>
```

### Rest Parameters

```astro
---
// src/pages/[...path].astro — matches /a/b/c
export async function getStaticPaths() {
  return [
    { params: { path: 'docs/getting-started' } },
    { params: { path: 'docs/advanced/routing' } },
  ];
}
const { path } = Astro.params; // "docs/getting-started"
---
```

### On-demand (SSR) Mode

In SSR mode, dynamic routes are generated on request — no `getStaticPaths()` needed:

```astro
---
// src/pages/products/[id].astro
const { id } = Astro.params;
const product = await fetchProduct(id);
---
<h1>{product.name}</h1>
```

---

## Redirects

### Configured Redirects

In `astro.config.mjs`:

```js
export default defineConfig({
  redirects: {
    '/old-blog': '/blog',
    '/blog/2021/': '/blog/2022/',
  },
});
```

### Dynamic Redirects

In a page or endpoint:

```astro
---
// src/pages/old-page.astro
return Astro.redirect('/new-page', 301);
---
```

In middleware:

```js
export function onRequest(context, next) {
  if (context.url.pathname === '/old') {
    return context.redirect('/new', 301);
  }
  return next();
}
```

---

## Rewrites

Rewrite serves a different route's content without changing the URL:

```astro
---
// src/pages/old-page.astro
return Astro.rewrite('/new-page');
---
```

---

## Route Priority Order

Astro resolves routes in this order:

1. **Static routes** — exact path matches (e.g., `/about`)
2. **Rest parameters** — `[...slug]` catch-all routes
3. **Dynamic parameters** — `[slug]` routes

Reserved routes (e.g., `_routes.json`, `404.astro`) are not treated as pages.

---

## Pagination

Use `[page]` in filename for automatic pagination:

```
src/pages/blog/[page].astro
```

```astro
---
// src/pages/blog/[page].astro
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts, { pageSize: 10 });
}
const { page } = Astro.props;
---
```

### The `page` Prop

| Property | Type | Description |
|----------|------|-------------|
| `page.data` | `any[]` | Array of items for current page |
| `page.start` | `number` | Index of first item (0-based) |
| `page.end` | `number` | Index of last item (0-based) |
| `page.total` | `number` | Total number of items |
| `page.currentPage` | `number` | Current page number (1-based) |
| `page.size` | `number` | Items per page |
| `page.lastPage` | `number` | Total number of pages |
| `page.url.prev` | `string \| undefined` | Previous page URL |
| `page.url.next` | `string \| undefined` | Next page URL |

### Nested Pagination

```astro
---
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  return paginate(posts, { pageSize: 10, paramName: 'page' });
}
---
{page.url.prev && <a href={page.url.prev}>Previous</a>}
{page.url.next && <a href={page.url.next}>Next</a>}
```

---

## Custom 404 Page

```astro
---
// src/pages/404.astro
---
<html>
  <body>
    <h1>404 - Page Not Found</h1>
  </body>
</html>
```

---

## Custom 500 Error Page

```astro
---
// src/pages/500.astro
const error = Astro.props.error;
---
<html>
  <body>
    <h1>500 - Server Error</h1>
    <p>{error.message}</p>
  </body>
</html>
```

---

## Page Partials

Partials render only the component content, without the full HTML document:

```astro
---
// src/pages/partial.astro
Astro.props.partial = true;
---
<div>Just this div, no <html> wrapper</div>
```

Useful for HTMX, fetch-based updates, or streaming content.

---

## Navigating Between Pages

Astro uses standard `<a>` tags — no framework-specific `<Link>` component:

```astro
<a href="/about/">About</a>
<a href="/blog/post-1">Read post</a>
```

With `base` configured in `astro.config.mjs`, Astro handles path prefixing automatically.

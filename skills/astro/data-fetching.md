# Data Fetching

Astro supports fetching data from APIs, CMSs, databases, and GraphQL endpoints using the standard `fetch()` API.

---

## `fetch()` in Astro

Use `fetch()` directly in the component frontmatter — it runs on the server at build/request time:

```astro
---
// Fetch at build time (SSG) or request time (SSR)
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();
---
<ul>
  {posts.map(post => (
    <li key={post.id}>{post.title}</li>
  ))}
</ul>
```

### Fetch in `getStaticPaths()`

```astro
---
export async function getStaticPaths() {
  const response = await fetch('https://api.example.com/posts');
  const posts = await response.json();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
const { post } = Astro.props;
---
<h1>{post.title}</h1>
```

### SSR vs SSG Behavior

| Mode | When `fetch()` Runs | Behavior |
|------|---------------------|----------|
| **SSG (static)** | Build time | Data fetched once at build |
| **SSR (server)** | Request time | Data fetched on every request |
| **Hybrid** | Per-route | `prerender = true` routes fetch at build time |

### Controlling Per-Route Rendering

```astro
---
// Force static rendering
export const prerender = true;

const data = await fetch('https://api.example.com/data').then(r => r.json());
---
```

```astro
---
// Force server rendering
export const prerender = false;

const data = await fetch('https://api.example.com/live-data').then(r => r.json());
---
```

---

## `fetch()` in Framework Components

Framework components (React, Vue, Svelte) can use `fetch()` but behavior differs:

- **SSG:** Fetch runs at build time on the server
- **SSR:** Fetch runs at request time on the server
- **Client-side:** After hydration, fetch runs in the browser

```jsx
// React component
import { useState, useEffect } from 'react';

export default function LiveComments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/comments?post=${postId}`)
      .then(r => r.json())
      .then(setComments);
  }, [postId]);

  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}
```

---

## GraphQL Queries

```astro
---
const query = `
  query {
    posts {
      id
      title
      excerpt
    }
  }
`;

const response = await fetch('https://api.example.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
const { data } = await response.json();
---
```

---

## Fetch from a Headless CMS

### Contentful

```astro
---
const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});
const entries = await client.getEntries({ content_type: 'blogPost' });
---
```

### Sanity

```astro
---
import { createClient } from '@sanity/client';
const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
const posts = await client.fetch('*[_type == "post"]');
---
```

### Strapi

```astro
---
const response = await fetch(`${import.meta.env.STRAPI_URL}/api/posts`);
const { data } = await response.json();
---
```

---

## Caching Fetch Responses

```astro
---
// Cache for 1 hour (SSR only)
const response = await fetch('https://api.example.com/data', {
  headers: {
    'Cache-Control': 'max-age=3600',
  },
});
---
```

---

## Error Handling

```astro
---
let posts = [];
try {
  const response = await fetch('https://api.example.com/posts');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  posts = await response.json();
} catch (err) {
  console.error('Failed to fetch posts:', err);
  // Use fallback data
  posts = [];
}
---
```

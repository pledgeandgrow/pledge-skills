# Content Collections

Content collections provide type-safe content management with Zod schemas and loaders.

---

## What Are Content Collections?

A content collection is a set of related, structurally identical data entries stored locally (Markdown files, JSON) or fetched from remote sources (CMS, database, API).

### Types of Collections

| Type | When to Use |
|------|-------------|
| **Build-time** | Static content fetched at build time (Markdown, local files) |
| **Live** | Dynamic content fetched on-demand at request time (CMS, database) |

### When to Create a Collection

- Blog posts with consistent frontmatter
- Product catalog from a CMS
- Author profiles
- Documentation pages

### When NOT to Create a Collection

- Single pieces of content
- Data that doesn't share a schema
- Content already managed by an integration

---

## TypeScript Configuration

Add `src/content.config.ts` (or `src/content/config.ts`) to define collections:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

---

## Build-Time Collection Loaders

### The `glob()` Loader

Loads files from the local filesystem:

```ts
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});
```

### The `file()` Loader

Loads a single file (JSON, YAML, TOML):

```ts
import { file } from 'astro/loaders';

const authors = defineCollection({
  loader: file('./src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
});
```

### Custom Build-Time Loaders

```ts
import type { Loader } from 'astro/loaders';

const customLoader: Loader = {
  name: 'custom-loader',
  load: async (store) => {
    const data = await fetchData();
    store.set({ id: 'entry-1', data: { title: 'Hello' } });
  },
};

const collection = defineCollection({
  loader: customLoader,
  schema: z.object({ title: z.string() }),
});
```

---

## Defining the Collection Schema

Use Zod for type-safe schemas:

```ts
import { z } from 'astro:content';

const schema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  author: z.string(),
  tags: z.array(z.string()).default([]),
  image: z.object({
    url: z.string(),
    alt: z.string(),
  }).optional(),
  draft: z.boolean().default(false),
});
```

### Collection References

```ts
import { reference } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: reference('authors'),
  }),
});
```

---

## Querying Build-Time Collections

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all entries
const posts = await getCollection('blog');

// Filter
const published = await getCollection('blog', (entry) => !entry.data.draft);

// Sort
const sorted = published.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

// Get single entry
const post = await getEntry('blog', 'my-first-post');
---
```

### Using Content in Templates

```astro
---
const posts = await getCollection('blog');
---
<ul>
  {posts.map(post => (
    <li>
      <a href={`/blog/${post.id}/`}>{post.data.title}</a>
      <time>{post.data.pubDate.toLocaleDateString()}</time>
    </li>
  ))}
</ul>
```

### Rendering Body Content

```astro
---
import { getEntry } from 'astro:content';
const post = await getEntry('blog', 'my-first-post');
const { Content } = await post.render();
---
<Content />
```

### Filtering Collection Queries

```astro
---
const featured = await getCollection('blog', (entry) => {
  return entry.data.tags.includes('featured') && !entry.data.draft;
});
---
```

### Accessing Referenced Data

```astro
---
import { getEntry } from 'astro:content';
const post = await getEntry('blog', 'my-first-post');
const author = await getEntry(post.data.author);
---
<p>By {author.data.name}</p>
```

---

## Generating Routes from Content

### Static Output (SSG)

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<h1>{post.data.title}</h1>
<Content />
```

### On-Demand (SSR)

```astro
---
// src/pages/blog/[slug].astro
import { getEntry } from 'astro:content';
const { slug } = Astro.params;
const post = await getEntry('blog', slug);
if (!post) return Astro.redirect('/404');
const { Content } = await post.render();
---
<h1>{post.data.title}</h1>
<Content />
```

---

## Live Content Collections

Live collections fetch data at request time for dynamic content.

### Creating a Live Loader

```ts
import type { LiveLoader } from 'astro/loaders';

const cmsLoader: LiveLoader = {
  name: 'cms-loader',
  loadCollection: async ({ filter }) => {
    const data = await fetch('https://api.cms.com/posts').then(r => r.json());
    return {
      entries: data.map(item => ({
        id: item.slug,
        data: item,
      })),
    };
  },
};

const livePosts = defineCollection({
  loader: cmsLoader,
  schema: z.object({ title: z.string() }),
});
```

### Using Zod Schemas with Live Collections

Same schema definition as build-time collections.

### Accessing Live Data

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('livePosts');
---
```

### Caching Live Data

```ts
const cachedLoader: LiveLoader = {
  name: 'cached-cms',
  loadCollection: async ({ filter, unstable_cache }) => {
    return unstable_cache(
      () => fetchFromCMS(),
      { ttl: 60_000 } // 1 minute
    );
  },
};
```

---

## Using JSON Schema Files in Your Editor

Astro generates JSON Schema files for editor autocomplete:

### In JSON Files

```json
{
  "$schema": "../../.astro/collections/blog.schema.json",
  "title": "My Post"
}
```

### In YAML Files (VS Code)

Add the schema reference in VS Code settings or the YAML file's `# yaml-language-server: $schema=...` comment.

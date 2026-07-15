# Markdown

Astro has built-in Markdown and MDX support with configurable processors, frontmatter, and rendering.

---

## Organizing Markdown Files

Markdown files can be stored anywhere in `src/`. Files in `src/pages/` automatically become pages:

```
src/
  pages/
    index.md          → /
    about.md          → /about
    blog/
      post-1.md       → /blog/post-1
  content/
    blog/             # Content collection
      post-1.md
      post-2.md
```

### File Imports vs Content Collections Queries

| Method | Syntax | Use Case |
|--------|--------|----------|
| File import | `import * as post from './post.md'` | Single file, direct access |
| Content collections | `getCollection('blog')` | Multiple files, type-safe schemas |

---

## Dynamic JSX-like Expressions

Import Markdown files and access frontmatter and compiled content in `.astro` components:

```astro
---
import * as greatPost from '../posts/great-post.md';
const posts = Object.values(import.meta.glob('./posts/*.md', { eager: true }));
---
<p>{greatPost.frontmatter.title}</p>
<p>Written by: {greatPost.frontmatter.author}</p>

<!-- Compiled HTML content -->
<Fragment set:html={greatPost.compiledContent()} />

<!-- List all posts -->
<ul>
  {posts.map((post) => (
    <li>
      <a href={post.url}>{post.frontmatter.title}</a>
    </li>
  ))}
</ul>
```

### Available Properties

| Property | Type | Description |
|----------|------|-------------|
| `frontmatter` | `object` | All frontmatter key-values |
| `url` | `string` | The page URL |
| `file` | `string` | File path |
| `compiledContent()` | `function` | Returns compiled HTML string |
| `getHeadings()` | `function` | Returns array of headings |
| `Content` | `component` | Rendered content as component |

---

## The `<Content />` Component

Import `Content` from a Markdown file to render its body:

```astro
---
import { Content as PromoBanner } from '../components/promoBanner.md';
---
<h2>Today's promo</h2>
<PromoBanner />
```

### With Content Collections

```astro
---
import { getEntry, render } from 'astro:content';
const product = await getEntry('products', 'shirt');
const { Content } = await render(product);
---
<p>Sale Ends: {product.data.saleEndDate.toDateString()}</p>
<Content />
```

---

## Heading IDs

Astro auto-generates anchor IDs for Markdown headings using `github-slugger`:

```md
## Introduction

I can link internally to [my conclusion](#conclusion) on the same page.

## Conclusion

Visit `https://example.com/page-1/#introduction` to jump to Introduction.
```

### `getHeadings()`

```astro
---
import * as post from '../posts/great-post.md';
const headings = post.getHeadings();
---
<nav>
  {headings.map(h => (
    <a href={`#${h.slug}`}>{h.text}</a>
  ))}
</nav>
```

| Property | Type | Description |
|----------|------|-------------|
| `depth` | `number` | Heading level (1-6) |
| `text` | `string` | Heading text |
| `slug` | `string` | Generated anchor ID |

### Heading IDs and Plugins

Customize heading ID generation with remark/rehype plugins:

```js
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkSlug],
    rehypePlugins: [rehypeSlug],
  },
});
```

---

## Markdown Plugins

### Choosing a Markdown Processor

Astro uses **Sätteri** by default (Astro's native Markdown/MDX pipeline). You can switch to the **unified** processor:

```js
export default defineConfig({
  markdown: {
    processor: 'unified', // or 'satteri' (default)
  },
});
```

### Using Sätteri Plugins

```js
export default defineConfig({
  markdown: {
    // Sätteri is the default processor
    // GFM and SmartyPants are enabled by default
  },
});
```

### Switching to the Unified Processor

```js
import remarkToc from 'remark-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  markdown: {
    processor: 'unified',
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeAutolinkHeadings],
  },
});
```

### Modifying Frontmatter Programmatically

Use remark/rehype plugins to modify frontmatter:

```js
import { defineConfig } from 'astro/config';

function remarkModifyFrontmatter() {
  return (tree, file) => {
    file.data.astro.frontmatter.customField = 'value';
  };
}

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkModifyFrontmatter],
  },
});
```

### Extending Markdown Config from MDX

MDX inherits Markdown config by default. Override per-MDX:

```js
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    mdx({
      extendMarkdownConfig: true,
      remarkPlugins: [], // additional MDX-only plugins
    }),
  ],
});
```

---

## Individual Markdown Pages

Markdown files in `src/pages/` become pages automatically:

```md
---
title: About Me
layout: ../layouts/BaseLayout.astro
---

# Hello!

This is my about page.
```

### Frontmatter `layout` Property

The `layout` frontmatter property wraps the Markdown content in a layout:

```md
---
layout: ../layouts/BlogPostLayout.astro
title: My First Post
pubDate: 2024-01-15
---

Content goes here.
```

The layout receives `frontmatter`, `url`, and `file` as props.

---

## Fetching Remote Markdown

Fetch and render Markdown from external sources:

```astro
---
import { marked } from 'marked';
const response = await fetch('https://api.example.com/posts/1.md');
const markdown = await response.text();
const html = marked.parse(markdown);
---
<Fragment set:html={html} />
```

---

## Markdown Configuration

```js
export default defineConfig({
  markdown: {
    syntaxHighlight: 'shiki', // 'shiki' | 'prism' | false
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
    gfm: true,         // GitHub-Flavored Markdown (default: true)
    smartypants: true,  // Smart quotes (default: true)
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
```

### Syntax Highlighting

```js
export default defineConfig({
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      langs: ['typescript', 'python', 'bash'],
      wrap: true,
    },
  },
});
```

Disable syntax highlighting:

```js
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
});
```

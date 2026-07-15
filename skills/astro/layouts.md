# Layouts

Layouts are reusable `.astro` components that wrap pages with shared structure (head, nav, footer).

---

## Sample Layout

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description = '' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
    </nav>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; 2024</p>
    </footer>
  </body>
</html>
```

### Using a Layout

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home" description="Welcome to my site">
  <h1>Welcome!</h1>
  <p>This content goes in the slot.</p>
</BaseLayout>
```

---

## TypeScript with Layouts

Use `Props` interface for type safety:

```astro
---
interface Props {
  title: string;
  pubDate: Date;
  tags?: string[];
}
const { title, pubDate, tags = [] } = Astro.props;
---
```

---

## Nesting Layouts

Layouts can import and wrap other layouts:

```astro
---
// src/layouts/BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
interface Props {
  title: string;
  pubDate: Date;
}
const { title, pubDate } = Astro.props;
---
<BaseLayout title={title}>
  <article>
    <h1>{title}</h1>
    <time datetime={pubDate.toISOString()}>{pubDate.toLocaleDateString()}</time>
    <slot />
  </article>
</BaseLayout>
```

---

## Markdown Layouts

Markdown files use the `layout` frontmatter property to specify a layout:

```md
---
layout: ../layouts/BlogPostLayout.astro
title: My First Post
pubDate: 2024-01-15
---

# Hello from Markdown

This content goes in the `<slot />` of the layout.
```

### Markdown Layout Props

The layout receives these props automatically:

| Property | Type | Description |
|----------|------|-------------|
| `frontmatter` | `object` | All markdown frontmatter values |
| `url` | `string` | The page URL |
| `file` | `string` | File path of the markdown file |

```astro
---
// src/layouts/BlogPostLayout.astro
const { frontmatter } = Astro.props;
---
<h1>{frontmatter.title}</h1>
<time>{frontmatter.pubDate}</time>
<slot />
```

### Importing Layouts Manually (MDX)

In MDX files, you can import and use layouts directly:

```mdx
---
title: My Post
---
import BlogPostLayout from '../layouts/BlogPostLayout.astro';

<BlogPostLayout title="My Post" pubDate={new Date()}>
  # Hello from MDX
</BlogPostLayout>
```

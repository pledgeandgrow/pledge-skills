# RSS Feeds

Add RSS feeds to your Astro site using the `@astrojs/rss` package.

---

## Setting Up `@astrojs/rss`

```bash
npx astro add rss
```

Or install manually:

```bash
npm install @astrojs/rss
```

Create an RSS endpoint:

```ts
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'My thoughts on web development',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

---

## Generating Items

### Using Content Collections

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'My Blog',
    description: 'My thoughts',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
        author: post.data.author,
      })),
  });
}
```

### Using Glob Imports

```ts
import rss from '@astrojs/rss';

const postImportResult = import.meta.glob('../content/blog/*.md', {
  eager: true,
});

const posts = Object.values(postImportResult);

export async function GET(context) {
  return rss({
    title: 'My Blog',
    description: 'My thoughts',
    site: context.site,
    items: posts.map((post) => ({
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.pubDate),
      description: post.frontmatter.description,
      link: `/blog/${post.url}/`,
    })),
  });
}
```

---

## Including Full Post Content

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitize from 'sanitize-html';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'My thoughts',
    site: context.site,
    items: posts.map(async (post) => {
      const { Content } = await post.render();
      // Render content to HTML string
      const html = await renderToString(Content);
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        content: sanitize(html, {
          allowedTags: sanitize.defaults.allowedTags.concat(['img']),
        }),
      };
    }),
    customData: '<language>en-us</language>',
  });
}
```

---

## RSS Item Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Item title |
| `description` | `string` | Short description/excerpt |
| `link` | `string` | URL to the full post |
| `pubDate` | `Date` | Publication date |
| `categories` | `string[]` | Categories/tags |
| `author` | `string` | Author name or email |
| `content` | `string` | Full HTML content |
| `comments` | `string` | URL to comments page |
| `enclosure` | `object` | Media attachment (audio, video) |

---

## RSS Feed Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Feed title (required) |
| `description` | `string` | Feed description |
| `site` | `URL` | Site URL (required, use `context.site`) |
| `items` | `RSSItem[]` | Feed items (required) |
| `xmlns` | `object` | Custom XML namespaces |
| `customData` | `string` | Custom XML to inject |
| `stylesheet` | `string` | XSLT stylesheet path |
| `trailingSlash` | `boolean` | Add trailing slash to URLs |

---

## Removing Trailing Slashes

```ts
return rss({
  // ...
  trailingSlash: false,
});
```

---

## Adding a Stylesheet

```ts
return rss({
  // ...
  stylesheet: '/rss/styles.xsl',
});
```

---

## Enabling RSS Feed Auto-Discovery

Add a `<link>` tag in your layout `<head>`:

```astro
---
// src/layouts/BaseLayout.astro
---
<head>
  <link
    rel="alternate"
    type="application/rss+xml"
    title="My Blog"
    href={new URL('rss.xml', Astro.site)}
  />
</head>
```

This allows RSS readers to auto-discover your feed.

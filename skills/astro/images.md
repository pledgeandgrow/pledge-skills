# Images

Astro provides built-in image optimization with `<Image />` and `<Picture />` components.

---

## Where to Store Images

| Location | Processing | Import Method |
|----------|------------|---------------|
| `src/` | Optimized (resized, converted, compressed) | `import img from './path.png'` |
| `public/` | No processing — served as-is | `src="/images/file.png"` |
| Remote | Optimized if authorized in config | `src="https://..."` |

### `src/` vs `public/`

- **`src/`** — Images are processed, optimized, and hashed at build time. Use for most images.
- **`public/`** — Images are copied as-is. Use for favicons, OG images, or when you need a stable URL.

### Remote Images

Remote images can be optimized if authorized in `astro.config.mjs`:

```js
export default defineConfig({
  image: {
    domains: ['example.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
```

---

## `<Image />` Component

Optimizes local and authorized remote images — transforms dimensions, format, and quality:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my_image.png';
---
<Image src={myImage} alt="A description of my image." />
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `src` | `ImageMetadata \| string` | Image source (required) |
| `alt` | `string` | Alt text (required) |
| `width` | `number` | Width in pixels |
| `height` | `number` | Height in pixels |
| `format` | `'webp' \| 'avif' \| 'png' \| 'jpg'` | Output format |
| `quality` | `number \| 'low' \| 'mid' \| 'high' \| 'max'` | Compression quality |
| `densities` | `number[]` | Device pixel ratios to generate |
| `widths` | `number[]` | Widths to generate |
| `sizes` | `string` | Sizes attribute for responsive |
| `class` | `string` | CSS class |
| `loading` | `'lazy' \| 'eager'` | Default: `lazy` |
| `decoding` | `'async' \| 'sync' \| 'auto'` | Default: `async` |

### Examples

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.png';
import logo from '../assets/logo.svg';
---
<!-- Basic -->
<Image src={hero} alt="Hero image" />

<!-- With dimensions -->
<Image src={hero} alt="Hero" width={800} height={600} />

<!-- With format and quality -->
<Image src={hero} alt="Hero" format="webp" quality="high" />

<!-- Responsive -->
<Image src={hero} alt="Hero" widths={[400, 800, 1200]} sizes="(max-width: 800px) 100vw, 50vw" />

<!-- Public folder (no optimization) -->
<Image src="/images/photo.jpg" alt="Photo" width={400} height={300} />

<!-- Remote (must be authorized) -->
<Image src="https://example.com/image.jpg" alt="Remote" width={400} height={300} />
```

### Output

```html
<!-- Prerendered (build time) -->
<img src="/_astro/my_image.hash.webp" width="1600" height="900" decoding="async" loading="lazy" alt="..." />

<!-- On-demand (SSR) -->
<img src="/_image?href=...&w=1600&h=900&f=webp" ... />
```

---

## `<Picture />` Component

Generates multiple formats and sizes for broad browser support:

```astro
---
import { Picture } from 'astro:assets';
import myImage from '../assets/my_image.png';
---
<Picture src={myImage} alt="Description" widths={[400, 800, 1200]} sizes="(max-width: 800px) 100vw, 50vw" />
```

Outputs `<picture>` with `<source>` tags for each format:

```html
<picture>
  <source type="image/avif" srcset="..." sizes="..." />
  <source type="image/webp" srcset="..." sizes="..." />
  <img src="..." width="..." height="..." alt="..." loading="lazy" decoding="async" />
</picture>
```

---

## Responsive Image Behavior

Use `widths` and `sizes` for responsive images:

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
---
<Image
  src={photo}
  alt="Responsive photo"
  widths={[240, 544, 800, 1200]}
  sizes="(max-width: 544px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

Or use `densities` for device pixel ratio:

```astro
<Image src={photo} alt="Photo" densities={[1, 2, 3]} />
```

---

## SVG Components

SVG files can be imported as Astro components:

```astro
---
import Logo from '../assets/logo.svg';
---
<Logo class="w-8 h-8" />
```

This inlines the SVG directly in the HTML.

---

## Images in Markdown

Standard Markdown syntax works for images in `public/`:

```md
![Alt text](/images/photo.jpg)
```

For optimized images in Markdown, use `![]()` with relative paths from `src/`:

```md
![Alt text](../assets/photo.jpg)
```

---

## Images in MDX

In MDX, use the `<Image />` component directly:

```mdx
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';

<Image src={photo} alt="Photo" />
```

---

## Images in Framework Components

Pass the imported image as a prop:

```astro
---
import { Image } from 'astro:assets';
import ReactCard from './ReactCard.jsx';
import photo from '../assets/photo.jpg';
---
<ReactCard client:visible>
  <Image src={photo} alt="Photo" />
</ReactCard>
```

---

## `getImage()` API

Generate images programmatically:

```ts
import { getImage } from 'astro:assets';
import myImage from '../assets/my_image.png';

const optimized = await getImage({
  src: myImage,
  width: 400,
  height: 300,
  format: 'webp',
});
// optimized.src → URL string
```

---

## Images in Content Collections

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';

const posts = await getCollection('blog');
---
{posts.map(post => (
  <Image src={post.data.image} alt={post.data.imageAlt} width={800} height={400} />
))}
```

---

## Using `<img>` (Unprocessed)

For images that should not be optimized:

```astro
---
import localImg from '../assets/photo.png';
---
<!-- Local image (unprocessed) -->
<img src={localImg.src} alt="Photo" />

<!-- Public folder -->
<img src="/images/photo.jpg" alt="Photo" />

<!-- Remote -->
<img src="https://example.com/photo.jpg" alt="Photo" />
```

---

## Default Image Service

Astro uses `sharp` by default. Configure a different service:

```js
export default defineConfig({
  image: {
    service: 'sharp', // default
  },
});
```

### No-op Passthrough (no optimization)

```js
export default defineConfig({
  image: {
    service: 'passthrough',
  },
});
```

---

## Asset Caching

Astro caches optimized images. Remote images can be cached:

```js
export default defineConfig({
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
});
```

Cached assets are stored in `node_modules/.astro/assets` during development and in the build output for production.

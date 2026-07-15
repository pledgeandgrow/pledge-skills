# Static Asset Handling

## Importing Asset as URL

Importing a static asset returns the resolved public URL:

```ts
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

During build, assets smaller than `assetsInlineLimit` (default 4096 bytes) are inlined as base64 data URLs.

### Explicit URL Imports

Use the `?url` suffix to always get the URL:

```ts
import imgUrl from './img.png?url'
```

### Explicit Inline Handling

Use the `?inline` suffix to always inline as base64:

```ts
import imgBase64 from './img.png?inline'
```

### Importing Asset as String

Use the `?raw` suffix to import file content as a string:

```ts
import shaderCode from './shader.glsl?raw'
```

### Importing Script as a Worker

Use the `?worker` suffix:

```ts
import MyWorker from './worker.js?worker'
const worker = new MyWorker()
```

Use the `?worker&url` suffix for a worker URL:

```ts
import WorkerUrl from './worker.js?worker&url'
const worker = new Worker(WorkerUrl)
```

---

## The public Directory

Files in the `public/` directory are served at the root path during dev and copied to the output directory during build.

- Files in `public/` are **not** processed by Vite
- No hashing, no transformation
- Reference with absolute paths: `/favicon.ico`

```html
<!-- Reference public assets with absolute paths -->
<link rel="icon" href="/favicon.ico" />
<img src="/images/logo.png" />
```

### When to Use `public/`

- `favicon.ico`
- `robots.txt`
- `manifest.json`
- Large assets that shouldn't be processed
- Files that must maintain exact filenames

### When NOT to Use `public/`

- Assets referenced in JS/CSS imports (use regular imports instead)
- Assets that need hashing for cache busting
- Assets that need optimization (compression, resizing)

---

## new URL(url, import.meta.url)

For dynamic asset URLs:

```ts
const imgUrl = new URL('./image.png', import.meta.url).href
```

This pattern is useful for:
- Dynamic asset paths
- Web Worker URLs
- Service Worker URLs

```ts
// Web Worker with dynamic URL
const worker = new Worker(
  new URL('./worker.js', import.meta.url),
  { type: 'module' }
)
```

### Caveats

- `import.meta.url` is statically replaced during build
- Cannot use variables in the path: `new URL(`./img/${name}.png`, import.meta.url)` — Vite cannot statically analyze this
- Works only with literal string paths

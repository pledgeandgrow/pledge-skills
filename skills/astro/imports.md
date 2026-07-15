# Imports & Assets

Astro supports importing various file types with built-in handling and Vite-powered bundling.

---

## Supported File Types

| Type | Import | Returns |
|------|--------|---------|
| `.js` / `.ts` | `import x from './file'` | Module export |
| `.jsx` / `.tsx` | `import x from './file'` | Module export (with React integration) |
| `.vue` | `import x from './file'` | Vue component (with Vue integration) |
| `.svelte` | `import x from './file'` | Svelte component (with Svelte integration) |
| `.css` | `import './file.css'` | Injected styles |
| `.scss` / `.sass` | `import './file.scss'` | Compiled CSS (requires `sass`) |
| `.json` | `import data from './file.json'` | Parsed JSON object |
| `.md` | `import Post from './file.md'` | Rendered content |
| `.mdx` | `import Post from './file.mdx'` | Rendered content (with MDX integration) |
| Images | `import img from './img.png'` | URL string |
| `.wasm` | `import wasm from './file.wasm'` | WebAssembly module |

---

## Files in `public/`

Files in `public/` are served as-is with no processing:

```astro
<img src="/images/logo.png" alt="Logo" />
<link rel="stylesheet" href="/styles/global.css" />
```

- No imports needed — reference by absolute path
- No optimization or transformation
- Copied directly to build output

---

## Import Statements

### JavaScript / TypeScript

```astro
---
import { myFunction } from './utils';
import type { MyType } from './types';
import Component from './Component.astro';
---
```

### NPM Packages

```astro
---
import { motion } from 'framer-motion';
import _ from 'lodash';
---
```

### JSON

```astro
---
import data from './data.json';
console.log(data.items);
---
```

### CSS

```astro
---
import './global.css';       // Injected into page
import styles from './mod.module.css';  // CSS Module
---
<div class={styles.container}>Content</div>
```

### CSS Modules

```astro
---
import styles from './Button.module.css';
---
<button class={styles.button}>Click</button>
```

### Other Assets

```astro
---
import imgUrl from './logo.png';
import svgUrl from './icon.svg';
---
<img src={imgUrl} alt="Logo" />
```

---

## Aliases

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

```astro
---
import Button from '@components/Button.astro';
import BaseLayout from '@layouts/BaseLayout.astro';
import '@styles/global.css';
---
```

---

## `import.meta.glob()`

Batch-import files matching a glob pattern:

```ts
const posts = import.meta.glob('./blog/*.md');

// Eager loading
const posts = import.meta.glob('./blog/*.md', { eager: true });

// Import as string
const rawPosts = import.meta.glob('./blog/*.md', { as: 'raw' });
```

### Supported Values

| Option | Description |
|--------|-------------|
| `eager` | Load immediately (default: lazy) |
| `query: '?raw'` | Import as raw string |
| `query: '?url'` | Import as URL |

### Import Type Utilities

```ts
// Typed glob
const posts = import.meta.glob('./blog/*.md', {
  eager: true,
}) as Record<string, { frontmatter: { title: string } }>;
```

### Glob Patterns

```ts
// All markdown files
import.meta.glob('./**/*.md')

// Multiple extensions
import.meta.glob('./content/*.{md,mdx,json}')

// Exclude
import.meta.glob('./content/*.md', { ignore: ['./content/drafts/*'] })
```

### `import.meta.glob()` vs `getCollection()`

| Feature | `import.meta.glob()` | `getCollection()` |
|---------|---------------------|-------------------|
| Type safety | Manual | Zod schema validation |
| Schema validation | No | Yes |
| Content Collections API | No | Yes |
| Use case | Quick file imports | Structured content management |

---

## WASM

```ts
import wasmModule from './module.wasm';

const instance = await WebAssembly.instantiate(wasmModule);
```

---

## Node Builtins

In SSR mode, Node.js builtins are available:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
```

In SSG mode, use with caution — they run at build time only.

---

## Extending File Type Support

Add custom Vite plugins for unsupported file types:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    plugins: [
      {
        name: 'yaml-loader',
        transform(code, id) {
          if (id.endsWith('.yaml')) {
            const data = yaml.load(code);
            return `export default ${JSON.stringify(data)}`;
          }
        },
      },
    ],
  },
});
```

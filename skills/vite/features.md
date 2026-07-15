# Features

## npm Dependency Resolving and Pre-Bundling

Vite detects bare module imports (`import { foo } from 'my-dep'`) and:
1. Pre-bundles them with Rolldown (CommonJS/UMD → ESM conversion)
2. Rewrites imports to valid URLs (`/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`)

See `dep-pre-bundling.md` for details.

---

## Hot Module Replacement (HMR)

Vite provides HMR over native ESM. Frameworks with HMR capabilities provide instant, precise updates without reloading the page or blowing away application state.

First-party HMR integrations:
- **Vue** — `@vitejs/plugin-vue` (Single File Components)
- **React** — `@vitejs/plugin-react` (React Fast Refresh)
- **React SWC** — `@vitejs/plugin-react-swc`
- **Preact** — `@prefresh/vite`

See `hmr-api.md` for the HMR API.

---

## TypeScript

Vite supports importing `.ts` files out of the box. Transpilation is handled by the Oxc transformer.

### Transpile Only

Vite does **not** perform type checking. It only transpiles TypeScript to JavaScript. Use `tsc --noEmit` or `vue-tsc` for type checking.

```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

### TypeScript Compiler Options

Some `tsconfig.json` options affect Vite's behavior:

| Option | Required Value | Notes |
|--------|---------------|-------|
| `target` | `ESNext` or lower | Vite handles transpilation |
| `module` | `ESNext` | Required for ESM |
| `moduleResolution` | `bundler` | Recommended for Vite |
| `resolveJsonModule` | `true` | Import JSON files |
| `allowImportingTsExtensions` | `true` | Optional |
| `noEmit` | `true` | Vite handles emission |
| `jsx` | `preserve` | Vite handles JSX |
| `strict` | `true` | Recommended |
| `types` | `["vite/client"]` | Import.meta types |

### Client Types

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

This provides types for:
- `import.meta.env`
- `import.meta.hot` (HMR API)
- Static asset imports (`*.vue`, `*.css`, `*.png`, etc.)

---

## HTML

`index.html` is the entry point. Vite processes it:
- `<script type="module" src>` — treated as entry points
- `<link href>` — CSS processed
- Asset URLs — resolved and rewritten during build

---

## Frameworks

Official Vite plugins:
- **Vue** — `@vitejs/plugin-vue`
- **Vue JSX** — `@vitejs/plugin-vue-jsx`
- **React** — `@vitejs/plugin-react`
- **React SWC** — `@vitejs/plugin-react-swc`
- **React RSC** — `@vitejs/plugin-rsc`

---

## JSX

`.jsx` and `.tsx` files are supported out of the box. JSX transpilation is handled by the Oxc transformer.

```ts
// vite.config.ts — custom JSX configuration
import { defineConfig } from 'vite'

export default defineConfig({
  oxc: {
    jsx: {
      importSource: 'preact',
    },
  },
})
```

### jsxInject

Auto-inject JSX helpers:

```ts
export default defineConfig({
  oxc: {
    jsxInject: `import React from 'react'`,
  },
})
```

---

## CSS

Importing `.css` files injects content via a `<style>` tag with HMR support.

### @import Inlining and Rebasing

CSS `@import` statements are inlined and rebased automatically.

### PostCSS

If a PostCSS config exists (e.g., `postcss.config.js`), Vite applies it to all CSS.

```js
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},
    'postcss-preset-env': {},
  },
}
```

### CSS Modules

Files named `*.module.css` are treated as CSS Modules:

```tsx
import styles from './Button.module.css'

function Button() {
  return <button className={styles.button}>Click</button>
}
```

### CSS Pre-processors

Sass, Less, and Stylus are supported (install the pre-processor first):

```bash
npm install -D sass
```

```scss
/* style.scss */
$color: red;
.button { color: $color; }
```

```ts
import './style.scss'
```

### Disabling CSS Injection

```ts
export default defineConfig({
  css: {
    devSourcemap: true,
  },
})
```

### Lightning CSS

Vite can use Lightning CSS as an alternative CSS processor:

```ts
export default defineConfig({
  css: {
    transformer: 'lightningcss',
  },
})
```

---

## Static Assets

See `assets.md` for full details.

```ts
import url from './image.png'     // URL string
import raw from './shader.glsl?raw'  // String content
import worker from './worker?worker'  // Web Worker
```

---

## JSON

JSON files can be imported directly:

```ts
import data from './data.json'
console.log(data.name)
```

Named imports are also supported:

```ts
import { name } from './data.json'
```

---

## Glob Import

Import multiple files using glob patterns:

```ts
// Import all modules in a directory
const modules = import.meta.glob('./dir/*.js')

// Eager imports
const modules = import.meta.glob('./dir/*.js', { eager: true })

// Multiple patterns
const modules = import.meta.glob(['./dir/*.js', './dir/*.ts'])

// Negative patterns
const modules = import.meta.glob(['./dir/*.js', '!./dir/skip.js'])
```

### Glob Import Caveats

- Patterns must be relative or absolute
- Matching is done with `tinyglobby`
- Dynamic imports return functions; eager imports return modules

---

## Dynamic Import

```ts
// Dynamic import with variables
const module = await import(`./modules/${name}.js`)
```

---

## WebAssembly

### ESM Integration

```ts
import foo from './foo.wasm'
foo() // call exported function
```

### Manual Initialization

```ts
import wasmUrl from './foo.wasm?url'

const { instance } = await WebAssembly.instantiateStreaming(
  fetch(wasmUrl)
)
```

---

## Web Workers

### Import with Constructors

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

### Import with Query Suffixes

```ts
import MyWorker from './worker?worker'
const worker = new MyWorker()
```

```ts
import WorkerUrl from './worker?worker&url'
const worker = new Worker(WorkerUrl)
```

---

## Content Security Policy (CSP)

Vite supports CSP-compliant builds. For inline scripts and styles, use nonce or hash-based CSP.

---

## Build Optimizations

### CSS Code Splitting

CSS is automatically code-split per chunk. Lazy-loaded chunks get their own CSS files.

### Preload Directives Generation

Vite automatically generates `<link rel="modulepreload">` directives for imported chunks.

### Async Chunk Loading Optimization

Vite optimizes async chunk loading with preload hints and fallback handling.

### Chunk Import Map Optimization

Vite generates an import map for optimal chunk resolution in production.

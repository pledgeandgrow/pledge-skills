# Using Plugins

## Adding a Plugin

Plugins are added in `vite.config.ts` via the `plugins` array:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### Conditional Plugins

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    // Only in dev
    command === 'serve' && visualizer(),
    // Only in production build
    command === 'build' && compression(),
  ].filter(Boolean),
}))
```

---

## Finding Plugins

### Official Plugins

| Plugin | Framework | Description |
|--------|-----------|-------------|
| `@vitejs/plugin-vue` | Vue | Vue 3 SFC support |
| `@vitejs/plugin-vue-jsx` | Vue | Vue 3 JSX support |
| `@vitejs/plugin-react` | React | React Fast Refresh |
| `@vitejs/plugin-react-swc` | React | React with SWC |
| `@vitejs/plugin-rsc` | React | React Server Components |
| `@vitejs/plugin-legacy` | All | Legacy browser support |

### Community Plugins

Browse plugins at:
- [vitejs/awesome-vite](https://github.com/vitejs/awesome-vite) — curated list
- [npm search for `vite-plugin`](https://www.npmjs.com/search?q=vite-plugin)

### Popular Community Plugins

| Plugin | Description |
|--------|-------------|
| `vite-plugin-pages` | File-based routing |
| `vite-plugin-pwa` | PWA support |
| `vite-plugin-compression` | Gzip/Brotli compression |
| `vite-plugin-svg-icons` | SVG icon sprites |
| `vite-plugin-vue-pages` | Vue file-based routing |
| `vite-plugin-checker` | TypeScript/ESLint checker |
| `vite-plugin-mkcert` | HTTPS dev certificate |
| `vite-plugin-inspect` | Inspect middleware stack |
| `unplugin-auto-import` | Auto import APIs |
| `unplugin-vue-components` | Auto import Vue components |

---

## Enforcing Plugin Ordering

Vite plugins run in a specific order. You can control ordering with `enforce` and `apply`:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      enforce: 'pre',    // Run before Vite's core plugins
      // enforce: 'post', // Run after Vite's core plugins
      // enforce: undefined, // Normal order
      apply: 'build',    // Only during build
      // apply: 'serve',  // Only during dev
      // apply: undefined, // Both dev and build
      resolveId(id) {
        // ...
      },
    },
  ],
})
```

### Plugin Order

1. `enforce: 'pre'` plugins
2. Vite core plugins
3. Normal plugins (no `enforce`)
4. Vite core plugins (post)
5. `enforce: 'post'` plugins

---

## Conditional Application

```ts
export default defineConfig(({ command, mode, isPreview }) => ({
  plugins: [
    // Only in dev server
    {
      name: 'dev-only',
      apply: 'serve',
      configureServer(server) {
        // ...
      },
    },
    // Only in build
    {
      name: 'build-only',
      apply: 'build',
      generateBundle() {
        // ...
      },
    },
  ],
}))
```

---

## Building Plugins

See `plugin-api.md` for the full Plugin API reference.

### Simple Example

```ts
import type { Plugin } from 'vite'

function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
  }
}

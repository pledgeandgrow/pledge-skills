# Server-Side Rendering (SSR)

## Overview

Vite supports SSR out of the box. You can build a server-rendered app with any framework.

---

## Example Projects

- [Vite SSR example](https://github.com/vitejs/vite/tree/main/playground/ssr)
- Framework-specific SSR starters (Nuxt, SvelteKit, Remix, etc.)

---

## Source Structure

```
├── index.html          # Client entry
├── src/
│   ├── main.ts         # Shared app entry
│   ├── entry-client.ts # Client hydration
│   └── entry-server.ts # Server render
├── server.ts           # Express/Fastify server
└── vite.config.ts
```

---

## Conditional Logic

Use `import.meta.env.SSR` to conditionally run code:

```ts
if (import.meta.env.SSR) {
  // Server-only code
} else {
  // Client-only code
}
```

---

## Setting Up the Dev Server

```ts
// vite.config.ts
export default defineConfig({
  server: {
    // Configure dev server for SSR
  },
  ssr: {
    // SSR-specific config
    noExternal: ['my-esm-package'],
  },
})
```

### SSR Middleware

```ts
// server.ts
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )
      template = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
      const appHtml = await render(url)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(3000)
}

createServer()
```

---

## Building for Production

SSR builds produce two separate bundles:

```bash
# Build client
vite build

# Build server
vite build --ssr src/entry-server.ts
```

### Config

```ts
export default defineConfig({
  build: {
    ssr: 'src/entry-server.ts',
    // or use --ssr flag
  },
})
```

### Output

```
dist/
├── client/    # Client bundle
└── server/    # Server bundle
```

---

## Generating Preload Directives

```ts
// entry-server.ts
export async function render(url, manifest) {
  // Use manifest to generate preload directives
  const preloadLinks = renderPreloadLinks(manifest)
  return { html: appHtml, preloadLinks }
}
```

---

## Pre-Rendering / SSG

Static Site Generation with Vite:

```ts
// prerender.ts
import { build } from 'vite'

await build({
  build: { ssr: 'src/entry-server.ts' },
})

// Import the server bundle and render each route
const { render } = await import('./dist/server/entry-server.js')
const routes = ['/', '/about', '/blog']

for (const route of routes) {
  const html = await render(route)
  fs.writeFileSync(`dist${route === '/' ? '/index' : route}.html`, html)
}
```

---

## SSR Externals

By default, Vite externalizes dependencies in SSR builds (they're loaded via Node.js require). Use `ssr.noExternal` to force bundling:

```ts
export default defineConfig({
  ssr: {
    noExternal: ['my-esm-only-package'],
    external: ['large-package'],
  },
})
```

---

## SSR-Specific Plugin Logic

```ts
export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      apply: 'build',
      // Only during SSR build
      options({ ssr }) {
        if (ssr) {
          // SSR-specific logic
        }
      },
    },
  ],
})
```

---

## SSR Target

```ts
export default defineConfig({
  build: {
    ssr: 'src/entry-server.ts',
    target: 'node18',  // or 'esnext'
  },
})
```

---

## SSR Bundle

```ts
export default defineConfig({
  build: {
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: {
      output: {
        format: 'esm',  // or 'cjs'
      },
    },
  },
})
```

---

## SSR Resolve Conditions

```ts
export default defineConfig({
  ssr: {
    resolve: {
      conditions: ['node', 'import'],
      externalConditions: ['node'],
    },
  },
})
```

---

## Vite CLI for SSR

```bash
# Dev with SSR
vite --ssr

# Build SSR
vite build --ssr

# Build with specific entry
vite build --ssr src/entry-server.ts
```

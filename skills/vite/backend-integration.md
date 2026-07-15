# Backend Integration

## Overview

Vite can integrate with an existing backend (e.g., Express, Django, Rails, Laravel) by serving the frontend dev server alongside the backend API.

---

## Connecting Vite Dev Server to Backend

### Option 1: Vite as Middleware

Use Vite's dev server as middleware in your backend:

```ts
// server.ts (Express example)
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const PORT = 3000
const root = process.cwd()

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  // Serve index.html for all other routes
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template = fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

createServer()
```

### Option 2: Proxy API Requests

Run Vite dev server separately and proxy API requests to your backend:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### Option 3: CORS

If your backend is on a different port, enable CORS:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    cors: true,
  },
})
```

---

## Proxy Configuration

### Basic Proxy

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
```

### With Path Rewrite

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### WebSocket Proxy

```ts
export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
```

### Multiple Proxies

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8081',
      '/ws': {
        target: 'ws://localhost:8082',
        ws: true,
      },
    },
  },
})
```

---

## Production Build Integration

### Build and Serve from Backend

1. Build the frontend:

```bash
vite build
```

2. Serve the `dist/` directory from your backend:

```ts
// Express example
app.use(express.static('dist'))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})
```

### Manifest for Asset URLs

Generate a manifest to map entry points to hashed asset URLs:

```ts
// vite.config.ts
export default defineConfig({
  build: {
    manifest: true,
  },
})
```

This generates `dist/.vite/manifest.json`:

```json
{
  "main.js": {
    "file": "assets/main-a1b2c3d4.js",
    "css": ["assets/main-a1b2c3d4.css"]
  }
}
```

Use the manifest in your backend to inject correct asset URLs:

```ts
// Express example
const manifest = JSON.parse(
  fs.readFileSync('dist/.vite/manifest.json', 'utf-8')
)

app.get('/', (req, res) => {
  const mainJs = manifest['main.js'].file
  const mainCss = manifest['main.js'].css?.[0]
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${mainCss ? `<link rel="stylesheet" href="/${mainCss}">` : ''}
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/${mainJs}"></script>
      </body>
    </html>
  `)
})
```

---

## Monorepo Integration

In a monorepo, Vite can resolve packages from workspace packages:

```ts
export default defineConfig({
  resolve: {
    // Preserve symlinks for workspace packages
    preserveSymlinks: true,
  },
  optimizeDeps: {
    include: ['@myorg/shared-components'],
  },
})
```

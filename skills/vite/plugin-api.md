# Plugin API

## Authoring a Plugin

Vite plugins extend Rollup's plugin interface with Vite-specific hooks:

```ts
import type { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    // Hooks...
  }
}
```

### Conventions

- Plugin names should be prefixed with `vite-plugin-`
- Return a factory function (not a plain object)
- Use TypeScript for type safety
- Document plugin options

### Plugins Config

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { myPlugin } from 'vite-plugin-my-plugin'

export default defineConfig({
  plugins: [
    myPlugin({ option1: true }),
  ],
})
```

---

## Simple Examples

### Transforming Custom File Types

```ts
import type { Plugin } from 'vite'

export function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    transform(code, id) {
      if (id.endsWith('.md')) {
        const html = markdownToHtml(code)
        return `export default ${JSON.stringify(html)}`
      }
    },
  }
}
```

### Importing a Virtual File

```ts
import type { Plugin } from 'vite'

export function virtualPlugin(): Plugin {
  const virtualId = 'virtual:my-module'
  const resolvedId = '\0' + virtualId

  return {
    name: 'vite-plugin-virtual',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        return `export default { hello: 'world' }`
      }
    },
  }
}
```

Usage:

```ts
import data from 'virtual:my-module'
```

---

## Universal Hooks (Rollup-Compatible)

| Hook | Description |
|------|-------------|
| `name` | Plugin name (required) |
| `options` | Manipulate options before build |
| `buildStart` | Called when build starts |
| `resolveId` | Resolve import IDs |
| `load` | Load module content |
| `transform` | Transform module content |
| `buildEnd` | Called when build ends |
| `closeBundle` | Called after bundle is written |
| `renderStart` | Called before code generation |
| `renderChunk` | Transform chunk code |
| `generateBundle` | Modify bundle before writing |
| `writeBundle` | Called after files are written |
| `close` | Called when build completes |

---

## Vite-Specific Hooks

### `config`

Modify Vite config before it's resolved:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    config(config, { command }) {
      return {
        define: {
          __MY_PLUGIN__: JSON.stringify(true),
        },
      }
    },
  }
}
```

### `configResolved`

Access the final resolved config:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    configResolved(resolvedConfig) {
      console.log(resolvedConfig.build.outDir)
    },
  }
}
```

### `configureServer`

Hook into the dev server:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Custom middleware
        next()
      })
    },
  }
}
```

### `configurePreviewServer`

Hook into the preview server:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    configurePreviewServer(server) {
      server.middlewares.use(myMiddleware)
    },
  }
}
```

### `transformIndexHtml`

Transform the `index.html` file:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    transformIndexHtml(html, ctx) {
      return html.replace(
        '</head>',
        '<meta name="my-plugin" content="active"></head>'
      )
    },
  }
}
```

Can also return an array of tag descriptors:

```ts
transformIndexHtml() {
  return [
    { tag: 'script', attrs: { src: '/custom.js' }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'generator', content: 'my-plugin' } },
  ]
}
```

### `handleHotUpdate`

Custom HMR update handling:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    handleHotUpdate(ctx) {
      const { file, server, modules } = ctx
      // Custom HMR logic
      // Return modules to invalidate, or [] to skip
    },
  }
}
```

---

## Plugin Context Meta

Access meta information in hooks:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    transform(code, id) {
      // this.getModuleInfo(id)
      // this.resolve(file, importer)
      // this.parse(code)
    },
  }
}
```

---

## Output Bundle Metadata

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          console.log(fileName, chunk.modules)
        }
      }
    },
  }
}
```

---

## Plugin Ordering

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    enforce: 'pre',   // Before Vite core plugins
    // enforce: 'post', // After Vite core plugins
    // (undefined)      // Normal order
    apply: 'serve',   // Only in dev
    // apply: 'build', // Only in build
    // (undefined)     // Both
  }
}
```

### Order Summary

1. Alias plugin
2. `enforce: 'pre'` plugins
3. Vite core plugins
4. Normal plugins
5. Vite core plugins (post)
6. `enforce: 'post'` plugins
7. Vite build HTML plugins

---

## Conditional Application

```ts
export function myPlugin(options): Plugin {
  return {
    name: 'my-plugin',
    apply: (config, { command, mode }) => {
      // Return true to apply, false to skip
      return command === 'build' && mode === 'production'
    },
  }
}
```

---

## Rolldown Plugin Compatibility

Vite plugins are compatible with Rolldown plugins. Most Rollup plugins work directly.

### Path Normalization

Vite normalizes all paths to POSIX-style (forward slashes). Use `normalizePath()` for consistency:

```ts
import { normalizePath } from 'vite'

const normalizedPath = normalizePath(import.meta.dirname)
```

### Filtering with include/exclude

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    transform: {
      filter: {
        id: { include: ['**/*.vue'], exclude: ['**/node_modules/**'] },
      },
      handler(code, id) {
        // Only called for .vue files
      },
    },
  }
}
```

---

## Client-Server Communication

### Server to Client

Send events from dev server to client:

```ts
configureServer(server) {
  server.ws.send('my-event', { data: 'hello' })
}
```

### Client to Server

Listen for events from client:

```ts
configureServer(server) {
  server.ws.on('client-event', (data, client) => {
    console.log('Received:', data)
  })
}
```

### Client-side

```ts
import.meta.hot.on('my-event', (data) => {
  console.log('Server says:', data)
})

import.meta.hot.send('client-event', { data: 'hello' })
```

### TypeScript for Custom Events

```ts
// vite-env.d.ts
interface CustomEventMap {
  'my-event': { data: string }
  'client-event': { data: string }
}
```

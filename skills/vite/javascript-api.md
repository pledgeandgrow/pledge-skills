# JavaScript API

## createServer

Create a Vite dev server programmatically:

```ts
import { createServer } from 'vite'

const server = await createServer({
  root: process.cwd(),
  server: { port: 3000 },
})

await server.listen()
console.log('Server running')
```

### InlineConfig

```ts
interface InlineConfig {
  // Same as UserConfig but with additional inline options
  configFile?: string | false
  configLoader?: 'bundle' | 'runner' | 'native'
  envFile?: boolean
  mode?: string
  force?: boolean
  logLevel?: LogLevel
  clearScreen?: boolean
  // ... all UserConfig options
}
```

### ViteDevServer

```ts
interface ViteDevServer {
  middlewares: Connect.Server
  httpServer: http.Server
  listen(): Promise<ViteDevServer>
  close(): Promise<void>
  printUrls(): void
  bindCLIShortcuts(): void
  restart(): Promise<void>
  ws: WebSocketServer
  ssrLoadModule(url: string): Promise<unknown>
  ssrFixStacktrace(e: Error): void
  transformIndexHtml(url: string, html: string): Promise<string>
  transformRequest(url: string): Promise<TransformResult | null>
  reload(fullReload?: boolean): void
}
```

### Example: Custom Server

```ts
import { createServer } from 'vite'
import express from 'express'

const app = express()
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})

app.use(vite.middlewares)
app.listen(3000)
```

---

## build

Build for production programmatically:

```ts
import { build } from 'vite'

await build({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Multiple Builds

```ts
// Build client and server
await build({ build: { outDir: 'dist/client' } })
await build({ build: { ssr: 'src/entry-server.ts', outDir: 'dist/server' } })
```

### Watch Mode

```ts
await build({
  build: {
    watch: {},
  },
})
```

---

## preview

Preview a production build programmatically:

```ts
import { preview } from 'vite'

const server = await preview({
  preview: { port: 4173 },
})

server.httpServer.listen(4173)
```

---

## resolveConfig

Resolve Vite config without starting a server:

```ts
import { resolveConfig } from 'vite'

const config = await resolveConfig({}, 'serve')
console.log(config.root, config.build.outDir)
```

---

## mergeConfig

Merge two Vite configs:

```ts
import { defineConfig, mergeConfig } from 'vite'

const baseConfig = {
  server: { port: 3000 },
}

const userConfig = defineConfig({
  server: { open: true },
})

export default mergeConfig(baseConfig, userConfig)
```

---

## searchForWorkspaceRoot

Find the workspace root directory:

```ts
import { searchForWorkspaceRoot } from 'vite'

const root = searchForWorkspaceRoot(process.cwd())
```

---

## loadEnv

Load environment variables:

```ts
import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), '')
console.log(env.VITE_API_URL)
```

```ts
// loadEnv(mode, envDir, prefixes)
// prefixes: '' loads all variables (not just VITE_ prefixed)
const env = loadEnv(mode, root, 'VITE_')
```

---

## normalizePath

Normalize path to POSIX style:

```ts
import { normalizePath } from 'vite'

// 'C:\\Users\\project\\src' → 'C:/Users/project/src'
const normalized = normalizePath(path)
```

---

## transformWithOxc

Transform JS/TS with Oxc:

```ts
import { transformWithOxc } from 'vite'

const result = await transformWithOxc(code, id, {
  jsx: { importSource: 'react' },
})
```

---

## transformWithEsbuild

Transform JS/TS with esbuild (still available for compatibility):

```ts
import { transformWithEsbuild } from 'vite'

const result = await transformWithEsbuild(code, id, {
  loader: 'ts',
})
```

---

## loadConfigFromFile

Load Vite config file programmatically:

```ts
import { loadConfigFromFile } from 'vite'

const result = await loadConfigFromFile(
  { command: 'serve', mode: 'development' },
  'vite.config.ts'
)
```

---

## preprocessCSS

Preprocess CSS with Vite's CSS pipeline:

```ts
import { preprocessCSS } from 'vite'

const result = await preprocessCSS(cssCode, 'style.scss', {
  // config
})
```

---

## Version Exports

```ts
import { version, rolldownVersion, esbuildVersion, rollupVersion } from 'vite'

console.log('Vite:', version)
console.log('Rolldown:', rolldownVersion)
console.log('esbuild:', esbuildVersion)
console.log('Rollup:', rollupVersion)
```

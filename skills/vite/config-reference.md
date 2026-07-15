# Config Reference

## Config File

Vite auto-resolves `vite.config.js` (also `.ts`, `.mjs`, `.cjs`, `.mts`, `.cts`) in the project root.

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // config options
})
```

### Conditional Config

```ts
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev-only config
    }
  } else {
    return {
      // build-only config
    }
  }
})
```

### Async Config

```ts
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFn()
  return {
    // config using data
  }
})
```

### Config Intellisense

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // TypeScript intellisense for all options
})
```

### Using Environment Variables in Config

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  }
})
```

### Config Loaders

| Loader | Description |
|--------|-------------|
| `bundle` (default) | Bundles config with Rolldown |
| `runner` | Uses module runner (no temp file) |
| `native` | Uses native runtime (e.g., `node --experimental-strip-types`) |

```bash
vite --configLoader runner
vite --configLoader native
```

---

## Shared Options

### `root`

```ts
export default defineConfig({
  root: './src',  // project root
})
```

### `base`

```ts
export default defineConfig({
  base: '/my-app/',  // public base path
})
```

### `mode`

```ts
export default defineConfig({
  mode: 'development',  // default mode
})
```

### `define`

```ts
export default defineConfig({
  define: {
    __DEV__: 'true',
    __VERSION__: JSON.stringify('1.0.0'),
  },
})
```

### `plugins`

```ts
export default defineConfig({
  plugins: [
    vue(),
    react(),
  ],
})
```

### `publicDir`

```ts
export default defineConfig({
  publicDir: 'public',  // or false to disable
})
```

Directory to serve as plain static assets. Files are served at `/` during dev and copied to outDir during build. Set to `false` to disable.

### `cacheDir`

```ts
export default defineConfig({
  cacheDir: 'node_modules/.vite',  // default
})
```

Directory to save cache files (pre-bundled deps, etc.). Use `--force` or delete to regenerate.

### `resolve` (full)

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
    // Array form: [{ find: '@', replacement: '/src' }]
    dedupe: ['vue', 'react'],
    conditions: ['module', 'browser', 'development|production'],
    mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preserveSymlinks: true,
    tsconfigPaths: false,  // use tsconfig.json paths for resolution
  },
})
```

### `html`

```ts
export default defineConfig({
  html: {
    cspNonce: 'my-nonce',  // nonce for CSP-compliant script/style tags
    additionalAssetSources: {
      'html-import': { srcAttributes: ['src'] },
      'img': { srcAttributes: ['data-src-dark', 'data-src-light'] },
      'my-picture': { srcsetAttributes: ['data-srcset'] },
    },
  },
})
```

### `css` (full)

```ts
export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: 'local',  // or 'global'
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
    preprocessorMaxWorkers: true,  // or number
    postcss: {
      plugins: [require('autoprefixer')],
    },
    transformer: 'lightningcss',  // or 'postcss' (default)
    devSourcemap: true,
    lightningcss: {
      targets: { chrome: 111 },
    },
  },
})
```

### `json`

```ts
export default defineConfig({
  json: {
    namedExports: true,
    stringify: false,  // stringify JSON when importing
  },
})
```

### `esbuild`

```ts
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
})
```

### `oxc`

```ts
export default defineConfig({
  oxc: {
    jsx: {
      importSource: 'react',
      jsxFactory: 'jsx',
      jsxFragment: 'Fragment',
    },
    jsxInject: `import React from 'react'`,
    target: 'es2020',
  },
})
```

### `assetsInclude`

```ts
export default defineConfig({
  assetsInclude: ['**/*.gltf'],  // treat as static assets
})
```

### `logLevel`

```ts
export default defineConfig({
  logLevel: 'info',  // 'info' | 'warn' | 'error' | 'silent'
})
```

### `customLogger`

```ts
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn
logger.warn = (msg, options) => {
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

### `clearScreen`

```ts
export default defineConfig({
  clearScreen: true,  // false to prevent terminal clearing
})
```

### `envDir`

```ts
export default defineConfig({
  envDir: './env',  // or false to disable .env loading
})
```

### `envPrefix`

```ts
export default defineConfig({
  envPrefix: ['VITE_', 'APP_'],  // expose env vars with these prefixes
})
```

**Security**: Never set to `''` — it exposes all env variables.

### `appType`

```ts
export default defineConfig({
  appType: 'spa',  // 'spa' | 'mpa' | 'custom'
})
```

- `'spa'` — include HTML middlewares + SPA fallback (default)
- `'mpa'` — include HTML middlewares, no SPA fallback
- `'custom'` — don't include HTML middlewares (SSR/frameworks)

### `devtools`

```ts
export default defineConfig({
  devtools: true,  // experimental, requires @vitejs/devtools
})
```

### `future`

```ts
export default defineConfig({
  future: {
    // Enable future breaking changes for migration preparation
    // See https://vite.dev/changes/ for available options
  },
})
```

---

## Server Options

### Full Example

```ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.example.com'],
    port: 3000,
    strictPort: false,
    open: true,
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    cors: true,
    headers: {
      'X-Custom-Header': 'value',
    },
    hmr: {
      overlay: true,
    },
    ws: {
      protocol: 'ws',
      host: 'localhost',
      port: 3001,
      clientPort: 3001,
    },
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ['warn', 'error'],
    },
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
    middlewareMode: false,
    fs: {
      strict: true,
      allow: [searchForWorkspaceRoot(process.cwd())],
      deny: ['.env', '.env.*', '*.pem', '*.key'],
    },
    origin: 'http://localhost:3000',
    warmup: {
      clientFiles: ['/src/main.ts', './src/components/*.vue'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
    sourcemapIgnoreList: /^\/[\w-/.]+(node_modules|src\/)/,
  },
})
```

### Server Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | `string \| boolean` | `'localhost'` | IP addresses to listen on. `true` or `0.0.0.0` for all |
| `allowedHosts` | `string[] \| true` | `[]` | Allowed hostnames. `true` allows any (dangerous) |
| `port` | `number` | `5173` | Server port. Auto-increments if in use |
| `strictPort` | `boolean` | `false` | Exit if port is in use |
| `https` | `https.ServerOptions` | — | Enable TLS + HTTP/2 |
| `open` | `boolean \| string` | `false` | Open app in browser on startup |
| `proxy` | `Record<string, ProxyOptions>` | — | Custom proxy rules |
| `cors` | `boolean \| CorsOptions` | localhost only | CORS configuration |
| `headers` | `OutgoingHttpHeaders` | — | Server response headers |
| `hmr` | `boolean \| { overlay?: boolean }` | `{ overlay: true }` | HMR configuration. WS options deprecated, use `server.ws` |
| `ws` | `false \| WSOptions` | — | WebSocket connection options (protocol, host, port, path, clientPort, timeout) |
| `forwardConsole` | `boolean \| { unhandledErrors?: boolean, logLevels?: string[] }` | auto | Forward browser console events to server terminal |
| `watch` | `object \| null` | — | File system watcher options (chokidar) |
| `middlewareMode` | `boolean` | `false` | Create server in middleware mode |
| `fs.strict` | `boolean` | `true` | Restrict serving files outside workspace root |
| `fs.allow` | `string[]` | workspace root | Allowed file serving directories |
| `fs.deny` | `string[]` | `['.env', '.env.*', '*.pem', '*.key']` | Blocked file patterns |
| `origin` | `string` | — | Origin for generated asset URLs |
| `warmup.clientFiles` | `string[]` | — | Files to warm up for client |
| `warmup.ssrFiles` | `string[]` | — | Files to warm up for SSR |
| `sourcemapIgnoreList` | `RegExp \| false` | default | Ignore list for sourcemap x_google_ignoreList |

---

## Build Options

### Full Example

```ts
export default defineConfig({
  build: {
    target: 'baseline-widely-available',
    modulePreload: { polyfill: true },
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    cssTarget: 'chrome89',
    cssMinify: 'lightningcss',  // or 'esbuild' or false
    sourcemap: false,  // or 'inline' or 'hidden'
    minify: 'oxc',  // or 'terser' or 'esbuild' or false
    terserOptions: {},
    chunkImportMap: false,  // experimental
    rolldownOptions: {
      input: {},
      output: {},
      external: [],
    },
    rollupOptions: {},  // deprecated alias of rolldownOptions
    dynamicImportVarsOptions: {},
    lib: {
      entry: '',
      name: '',
      fileName: '',
      cssFileName: '',
      formats: ['es', 'umd'],
    },
    license: false,  // or true or { fileName?: string }
    manifest: false,
    ssrManifest: false,
    ssr: false,
    emitAssets: false,
    ssrEmitAssets: false,
    write: true,
    emptyOutDir: true,
    copyPublicDir: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    watch: null,
  },
})
```

### Build Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `string \| string[]` | `'baseline-widely-available'` | Browser compatibility target |
| `modulePreload` | `boolean \| { polyfill?: boolean, resolveDependencies?: fn }` | `{ polyfill: true }` | Module preload polyfill |
| `polyfillModulePreload` | `boolean` | `true` | Deprecated. Use `modulePreload.polyfill` |
| `outDir` | `string` | `'dist'` | Output directory |
| `assetsDir` | `string` | `'assets'` | Assets subdirectory |
| `assetsInlineLimit` | `number` | `4096` | Inline assets below this size (bytes) |
| `cssCodeSplit` | `boolean` | `true` | Split CSS per chunk |
| `cssTarget` | `string \| string[]` | — | CSS target for minification |
| `cssMinify` | `boolean \| 'lightningcss' \| 'esbuild'` | `'lightningcss'` | CSS minifier |
| `sourcemap` | `boolean \| 'inline' \| 'hidden'` | `false` | Generate sourcemaps |
| `minify` | `boolean \| 'oxc' \| 'terser' \| 'esbuild'` | `'oxc'` (client), `false` (SSR) | JS minifier. `esbuild` deprecated |
| `terserOptions` | `TerserOptions` | — | Options for Terser (includes `maxWorkers`) |
| `chunkImportMap` | `boolean` | `false` | Experimental. Use import maps for chunk caching |
| `rolldownOptions` | `RolldownOptions` | — | Direct Rolldown bundle customization |
| `rollupOptions` | `RolldownOptions` | — | Deprecated alias of `rolldownOptions` |
| `dynamicImportVarsOptions` | `{ include?, exclude? }` | — | Transform dynamic imports with variables |
| `lib` | `LibOptions` | — | Library mode build |
| `lib.entry` | `string \| string[] \| Record<string, string>` | — | Library entry point(s) |
| `lib.name` | `string` | — | Exposed global variable (required for umd/iife) |
| `lib.formats` | `('es' \| 'cjs' \| 'umd' \| 'iife')[]` | `['es','umd']` | Output formats |
| `lib.fileName` | `string \| fn` | package.json name | Output file name |
| `lib.cssFileName` | `string` | same as fileName | CSS output file name |
| `license` | `boolean \| { fileName?: string }` | `false` | Generate license file for bundled deps |
| `manifest` | `boolean \| string` | `false` | Generate build manifest (`.vite/manifest.json`) |
| `ssrManifest` | `boolean \| string` | `false` | Generate SSR manifest |
| `ssr` | `boolean \| string` | `false` | SSR-oriented build |
| `emitAssets` | `boolean` | `false` | Force emitting assets in non-client builds |
| `ssrEmitAssets` | `boolean` | `false` | Emit assets in SSR build (replaced by `emitAssets`) |
| `write` | `boolean` | `true` | Write bundle to disk |
| `emptyOutDir` | `boolean` | `true` (if inside root) | Empty outDir before build |
| `copyPublicDir` | `boolean` | `true` | Copy publicDir to outDir |
| `reportCompressedSize` | `boolean` | `true` | Report gzip-compressed sizes |
| `chunkSizeWarningLimit` | `number` | `500` | Chunk size warning limit (kB) |
| `watch` | `WatcherOptions \| null` | `null` | Watch mode for build |

---

## Preview Options

```ts
export default defineConfig({
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.example.com'],
    port: 4173,
    strictPort: false,
    open: true,
    https: {},
    proxy: {},
    cors: true,
    headers: {},
  },
})
```

### Preview Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | `string \| boolean` | `server.host` | IP addresses to listen on |
| `allowedHosts` | `string[] \| true` | `server.allowedHosts` | Allowed hostnames |
| `port` | `number` | `4173` | Server port |
| `strictPort` | `boolean` | `server.strictPort` | Exit if port in use |
| `https` | `https.ServerOptions` | `server.https` | Enable TLS + HTTP/2 |
| `open` | `boolean \| string` | `server.open` | Open app in browser on startup |
| `proxy` | `Record<string, string \| ProxyOptions>` | `server.proxy` | Custom proxy rules |
| `cors` | `boolean \| CorsOptions` | `server.cors` | CORS configuration |
| `headers` | `OutgoingHttpHeaders` | — | Server response headers |

---

## OptimizeDeps Options

```ts
export default defineConfig({
  optimizeDeps: {
    entries: ['src/main.ts'],
    include: ['lodash-es', 'esm-dep > cjs-dep'],
    exclude: ['my-package'],
    rolldownOptions: {},
    esbuildOptions: {},  // deprecated, use rolldownOptions
    force: false,
    noDiscovery: false,
    holdUntilCrawlEnd: true,  // experimental
    disabled: 'build',  // deprecated
    needsInterop: [],  // experimental
  },
})
```

### OptimizeDeps Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entries` | `string \| string[]` | auto (html files) | Custom entry points for dep scanning |
| `include` | `string[]` | — | Force pre-bundling of linked packages. Supports glob patterns (`my-lib/**/*.vue`) |
| `exclude` | `string[]` | — | Dependencies to exclude from pre-bundling |
| `rolldownOptions` | `RolldownOptions` | — | Options for Rolldown during dep scanning/optimization |
| `esbuildOptions` | `EsbuildBuildOptions` | — | Deprecated. Use `rolldownOptions` instead |
| `force` | `boolean` | `false` | Force re-bundling, ignore cache |
| `noDiscovery` | `boolean` | `false` | Disable auto discovery, only use `include` list |
| `holdUntilCrawlEnd` | `boolean` | `true` | Hold first results until crawl completes (experimental) |
| `disabled` | `boolean \| 'build' \| 'dev'` | `'build'` | Deprecated. Disable optimizer |
| `needsInterop` | `string[]` | — | Force ESM interop for specific deps (experimental) |

---

## SSR Options

```ts
export default defineConfig({
  ssr: {
    external: ['large-package'],  // or true to externalize all
    noExternal: ['my-esm-package'],  // or true to bundle all
    target: 'node',  // or 'webworker'
    resolve: {
      conditions: ['module', 'node', 'development|production'],
      externalConditions: ['node', 'module-sync'],
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  },
})
```

### SSR Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `external` | `string[] \| true` | linked deps | Externalize deps for SSR. `true` externalizes all |
| `noExternal` | `string \| RegExp \| (string\|RegExp)[] \| true` | linked deps | Prevent externalizing deps. `true` bundles all |
| `target` | `'node' \| 'webworker'` | `'node'` | Build target for SSR server |
| `resolve.conditions` | `string[]` | `['module','node','development\|production']` | Conditions for plugin pipeline (non-externalized) |
| `resolve.externalConditions` | `string[]` | `['node', 'module-sync']` | Conditions for externalized imports |
| `resolve.mainFields` | `string[]` | `['module', 'jsnext:main', 'jsnext']` | package.json fields for entry point resolution |

**Note**: `ssr.external` (string[]) takes priority over `ssr.noExternal`. If both are `true`, `noExternal` wins.

---

## Worker Options

```ts
export default defineConfig({
  worker: {
    format: 'iife',  // 'es' | 'iife' (default: 'iife')
    plugins: () => [],
    rolldownOptions: {},  // Rolldown options for worker bundle
    rollupOptions: {},  // deprecated alias of rolldownOptions
  },
})
```

### Worker Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `'es' \| 'iife'` | `'iife'` | Output format for worker bundle |
| `plugins` | `() => (Plugin \| Plugin[])[]` | — | Vite plugins for worker bundles (must return new instances) |
| `rolldownOptions` | `RolldownOptions` | — | Rolldown options for worker build |
| `rollupOptions` | `RolldownOptions` | — | Deprecated. Use `rolldownOptions` |

---

## EnvironmentOptions

```ts
export default defineConfig({
  environments: {
    client: {
      // client environment config
    },
    ssr: {
      // SSR environment config
    },
  },
})
```

---

## Experimental Options

```ts
export default defineConfig({
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      // Custom asset URL rendering
    },
    hmrPartialAccept: false,
  },
})
```

---

## Legacy Options

```ts
export default defineConfig({
  legacy: {
    // Legacy options for backward compatibility
  },
})
```

---

## Runtime Config via CLI

All config options can be overridden via CLI flags:

```bash
vite --port 3000 --host 0.0.0.0 --base /my-app/
vite build --outDir build --sourcemap --minify terser
```

---


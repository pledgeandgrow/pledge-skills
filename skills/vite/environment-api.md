# Environment API

## Introduction

The Environment API (introduced in Vite 6, refined in Vite 8) formalizes the concept of multiple runtime environments within a single Vite instance. This enables support for:
- Client (browser)
- SSR (Node.js)
- Web Workers
- Custom runtimes (e.g., Cloudflare Workers, Deno)

### Benefits

- **Multi-runtime support**: Run code in multiple environments simultaneously
- **Consistent dev/build**: Same module resolution in dev and build
- **Custom runtimes**: Define your own environment (e.g., edge workers)
- **Plugin isolation**: Plugins can target specific environments

### Closing the Gap Between Build and Dev

Before the Environment API, Vite had hardcoded "client" and "ssr" concepts. The Environment API makes these first-class configurable objects, aligning the plugin pipeline and module resolution between dev and build.

---

## Environments Configuration

```ts
// vite.config.ts
export default defineConfig({
  environments: {
    client: {
      define: { 'import.meta.env.CLIENT': 'true' },
    },
    ssr: {
      define: { 'import.meta.env.SSR': 'true' },
    },
    worker: {
      define: { 'import.meta.env.WORKER': 'true' },
    },
  },
})
```

### Default Environments

Vite creates two default environments:
- **`client`** — browser environment (module runner via `/@vite/client`)
- **`ssr`** — Node.js SSR environment (runs in same process as Vite server)

An empty object `{}` is enough to register an environment with default values.

---

## Environment Instances

### DevEnvironment Class

During dev, each environment is an instance of `DevEnvironment`:

```ts
class DevEnvironment {
  name: string
  hot: NormalizedHotChannel
  moduleGraph: EnvironmentModuleGraph
  plugins: Plugin[]
  pluginContainer: EnvironmentPluginContainer
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(name: string, config: ResolvedConfig, context: DevEnvironmentContext)

  async transformRequest(url: string): Promise<TransformResult | null>
  async warmupRequest(url: string): Promise<void>
  async fetchModule(id: string, importer?: string, options?: FetchFunctionOptions): Promise<FetchResult>
}

interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: { inlineSourceMap?: boolean }
  depsOptimizer?: DepsOptimizer
}
```

### Accessing Environments

```ts
// In a plugin
configureServer(server) {
  const clientEnv = server.environments.client
  const ssrEnv = server.environments.ssr

  // Transform a module in a specific environment
  const result = await clientEnv.transformRequest('/src/main.ts')
}
```

### Separate Module Graphs

Each environment has its own module graph. A single file may map to multiple served modules (e.g., Vue SFCs have separate template/script/style blocks).

```ts
// Each environment has its own module graph
const clientModules = server.environments.client.moduleGraph
const ssrModules = server.environments.ssr.moduleGraph
```

### FetchResult

The `fetchModule` method returns a `FetchResult` that the module runner understands. This is called internally by the module runner — not meant to be called manually.

---

## Environment API for Plugins

### Accessing the Current Environment in Hooks

Plugin hooks now expose `this.environment` in their context:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    transform(code, id) {
      console.log(this.environment.config.resolve.conditions)
    },
  }
}
```

The Vite server has a shared plugin pipeline, but module processing is always done in the context of a given environment.

### Registering New Environments Using Hooks

Plugins can add new environments in the `config` hook:

```ts
export function rscPlugin(): Plugin {
  return {
    name: 'rsc-plugin',
    config(config) {
      return {
        environments: {
          rsc: {
            resolve: {
              conditions: ['react-server', ...defaultServerConditions],
            },
          },
        },
      }
    },
  }
}
```

### Configuring Environment Using Hooks

The `configEnvironment` hook is called for each environment with partially resolved config:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    configEnvironment(name, options) {
      if (name === 'rsc') {
        return {
          resolve: { conditions: ['workerd'] },
        }
      }
    },
  }
}
```

### The hotUpdate Hook

Custom HMR update handling per environment:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

The hook can:
- **Filter** and narrow down the affected module list
- **Return empty array** + full reload:

```ts
hotUpdate({ modules, timestamp }) {
  if (this.environment.name !== 'client') return

  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod, invalidatedModules, timestamp, true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

- **Return empty array** + custom HMR events:

```ts
hotUpdate() {
  if (this.environment.name !== 'client') return
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```

Client code registers the handler:

```ts
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // perform custom update
  })
}
```

### Per-environment State in Plugins

The same plugin instance is used for different environments. Key state by `this.environment`:

```ts
function PerEnvironmentCountPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    },
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

Flags:
- `perEnvironmentStartEndDuringDev: true` — call `buildStart`/`buildEnd` per environment
- `perEnvironmentWatchChangeDuringDev: true` — call `watchChange` per environment

### Per-environment Plugins

Plugins can be scoped to specific environments:

```ts
export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    environment: 'ssr',
    transform(code, id) {
      // Only called for SSR modules
    },
  }
}
```

### Environment in Build Hooks

Build hooks (`renderChunk`, `generateBundle`, etc.) also receive the environment instance, replacing the `ssr` boolean.

### Shared Plugins During Build

Before Vite 6, plugins were isolated per environment during build (separate processes). Now all environments build in a single process.

Opt-in to shared plugin instances across environments:

```ts
function myPlugin() {
  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },
    sharedDuringBuild: true,  // single instance for all environments
  }
}
```

Or globally via config:

```ts
export default defineConfig({
  builder: {
    sharedConfigBuild: true,
  },
})
```

---

## Environment API for Frameworks

### DevEnvironment Communication Levels

Since environments may run in different runtimes, communication constraints vary. Three communication levels:

#### RunnableDevEnvironment

The environment's module runner runs in the same process as the Vite server. Values can cross the boundary in-process. This is the default for the `ssr` environment.

```ts
import { createServer, isRunnableDevEnvironment } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

const ssrEnv = server.environments.ssr
if (isRunnableDevEnvironment(ssrEnv)) {
  const mod = await ssrEnv.runner.import('/src/entry-server.ts')
}
```

#### FetchableDevEnvironment

Communicates with its runtime via the Fetch API. Recommended for runtimes that can't run Vite directly (e.g., Cloudflare Workers).

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})

if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('http://example.com/request-to-handle'),
  )
}
```

**Warning**: `dispatchFetch` validates that the request is a `Request` instance and response is a `Response` instance. Throws `TypeError` otherwise.

#### Raw DevEnvironment

The base `DevEnvironment` class. Frameworks can extend it for custom communication patterns.

### Environments During Build

#### builder.buildApp

Control how environments are built:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      await Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
})
```

#### buildApp Plugin Hook

Plugins can define a `buildApp` hook. Execution order:
1. Hooks with `order: 'pre'` or `null`
2. Configured `builder.buildApp`
3. Hooks with `order: 'post'`

Use `environment.isBuilt` to avoid building twice.

#### createBuilder

Programmatic app build (equivalent of `vite build --app`):

```ts
import { createBuilder } from 'vite'

const builder = await createBuilder()
await builder.buildApp()

// Or build a single environment
// await builder.build(builder.environments.client)
```

`createBuilder` supersedes the standalone `build` function for environment-aware builds. The legacy `build` still works for client-only and ssr-only builds.

### Environment Agnostic Code

Frameworks should write code that works across all communication levels. Use the highest available level:
1. Try `isRunnableDevEnvironment` first (most powerful)
2. Fall back to `isFetchableDevEnvironment` (most portable)
3. Use raw `DevEnvironment` APIs as last resort

---

## Environment API for Runtimes

### Environment Factory

Create custom environment factories for non-standard runtimes:

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext,
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  return new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
}
```

### skipFsCheck

By default, `HotChannel` transports have `server.fs` restrictions. For non-network transports (worker threads, in-process calls), bypass with:

```ts
const transport: HotChannel = {
  skipFsCheck: true,
  send: (data) => worker.postMessage(data),
  on: (event, handler) => { /* ... */ },
}
```

### ModuleRunner

A module runner executes code in the target runtime. Imported from `vite/module-runner`:

```ts
import { ModuleRunner, ESModulesEvaluator, createNodeImportMeta } from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
    createImportMeta: createNodeImportMeta,
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}

  async import<T = any>(url: string): Promise<T>
  clearCache(): void
  async close(): Promise<void>
  isClosed(): boolean
}
```

When Vite triggers a full-reload HMR event, all affected modules are re-executed. The `exports` object is overridden — re-run `import` or get from `evaluatedModules` for latest exports.

### ModuleRunnerOptions

```ts
interface ModuleRunnerOptions {
  transport: ModuleRunnerTransport
  sourcemapInterceptor?: false | 'node' | 'prepareStackTrace' | InterceptorOptions
  hmr?: boolean | ModuleRunnerHmr  // default: true
  evaluatedModules?: EvaluatedModules
}
```

### ModuleEvaluator

```ts
export interface ModuleEvaluator {
  startOffset?: number
  runInlinedModule(context: ModuleRunnerContext, code: string, id: string): Promise<any>
  runExternalModule(file: string): Promise<any>
}
```

`ESModulesEvaluator` uses `new AsyncFunction` to evaluate code. Custom evaluators can be provided for runtimes that don't support unsafe evaluation.

### ModuleRunnerTransport

```ts
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

If `invoke` is not implemented, `send` and `connect` are required — Vite constructs `invoke` internally.

### Worker Thread Example

Server side:

```ts
import { createServer, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const workerHotChannel = {
    skipFsCheck: true,
    send: (data) => worker.postMessage(data),
    on: (event, handler) => { /* ... */ },
    off: (event, handler) => { /* ... */ },
  }
  return new DevEnvironment(name, config, { transport: workerHotChannel })
}

await createServer({
  environments: {
    worker: {
      dev: { createEnvironment: createWorkerEnvironment },
    },
  },
})
```

Worker side:

```ts
import { parentPort } from 'node:worker_threads'
import { ESModulesEvaluator, ModuleRunner, createNodeImportMeta } from 'vite/module-runner'

const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) { parentPort.postMessage(data) },
}

const runner = new ModuleRunner(
  { transport, createImportMeta: createNodeImportMeta },
  new ESModulesEvaluator(),
)
```

---

## Backward Compatibility

The Environment API is backward compatible:
- `server.ssrLoadModule()` still works (uses the `ssr` environment)
- `server.ssrFixStacktrace()` still works
- Existing plugins continue to work

### Migration Path

```ts
// Before (still works)
const mod = await server.ssrLoadModule('/src/entry-server.ts')

// After (explicit environment)
const mod = await server.environments.ssr.transformRequest('/src/entry-server.ts')
```

### API Changes

| Before | After |
|--------|-------|
| `server.moduleGraph.getModuleByUrl(url, { ssr })` | `environment.moduleGraph.getModuleByUrl(url)` |
| `ssr` boolean in hook options | `this.environment` in plugin context |
| `server.ssrLoadModule(url)` | `server.environments.ssr.runner.import(url)` |

---

## Target Users

The Environment API is designed for:
- **Framework authors** — building SSR/SSG/edge solutions on Vite
- **Tooling authors** — creating custom build pipelines (e.g., Vitest)
- **Advanced users** — with multi-runtime requirements

Most application developers don't need to interact with the Environment API directly — their framework handles it.

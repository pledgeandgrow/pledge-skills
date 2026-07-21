# Nuxt 4.x Guides & Advanced

## Rendering Modes

### Universal Rendering (SSR)

Default mode. Server renders HTML, client hydrates it:

- Server runs Vue.js code, returns fully rendered HTML
- Browser downloads HTML, Vue.js takes control (hydration)
- Benefits: fast page load, SEO-friendly, accessible
- Downsides: development constraints (isomorphic code), server cost

```vue
<script setup lang="ts">
const counter = ref(0) // Executes in server and client
const handleClick = () => {
  counter.value++ // Executes only in client
}
</script>
```

### Client-Side Rendering (CSR)

Disable SSR globally:

```ts
export default defineNuxtConfig({
  ssr: false,
})
```

- No server rendering, content appears after hydration
- Good for admin panels, authenticated apps
- Deploy as static SPA with `200.html` fallback

### Hybrid Rendering

Per-route rendering modes using `routeRules`:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // SSG at build time
    '/products': { swr: true },          // Stale-while-revalidate
    '/products/**': { swr: 3600 },       // SWR with 1hr TTL
    '/blog': { isr: 3600 },              // ISR with 1hr TTL
    '/blog/**': { isr: true },           // ISR until next deploy
    '/admin/**': { ssr: false },         // CSR only
    '/api/**': { cors: true },           // CORS headers
    '/old-page': { redirect: '/new-page' }, // Redirects
  },
})
```

**Route rules options:**
- `prerender: true` — Pre-render at build time
- `swr: boolean | number` — Stale-while-revalidate (cache + background revalidation)
- `isr: boolean | number` — Incremental Static Regeneration (cache on CDN)
- `ssr: boolean` — Enable/disable SSR for route
- `cors: boolean` — Add CORS headers
- `redirect: string` — Redirect to another route
- `headers: object` — Custom response headers

### Edge-Side Rendering

Deploy to edge workers (Cloudflare Workers, Vercel Edge, Deno Deploy) for low-latency rendering close to users.

## Nitro Server Engine

Nuxt is powered by Nitro, which provides:

### API Layer

- Powered by [h3](https://github.com/h3js/h3)
- Handlers can return objects/arrays (auto JSON response)
- Handlers can return promises (auto-awaited)
- Helper functions for body, cookies, redirects, headers

### Direct API Calls

`$fetch` directly calls server functions when run on server (no HTTP roundtrip):

```ts
// On server: directly calls the handler function
// On client: makes an HTTP request
const data = await $fetch('/api/data')
```

### Typed API Routes

Nitro generates typings for API routes when returning values (not using `res.end()`). Types are accessible in `$fetch()` and `useFetch()`.

### Standalone Server

Nitro produces a standalone server dist independent of `node_modules`:

```bash
nuxt build
# Output in .output/ directory
# Run: node .output/server/index.mjs
```

Supports deployment to any environment including serverless and service workers.

## Auto-imports

### Built-in Auto-imports

Nuxt auto-imports Vue and Nuxt composables/utilities without explicit imports:

- Vue: `ref`, `computed`, `watch`, `reactive`, `readonly`, `shallowRef`, etc.
- Nuxt: `useFetch`, `useAsyncData`, `useState`, `useRoute`, `useRouter`, `useRuntimeConfig`, `useHead`, `useSeoMeta`, `navigateTo`, `definePageMeta`, `defineNuxtRouteMiddleware`, `defineNuxtPlugin`, `callOnce`, `createError`, `showError`, `clearError`, `$fetch`, etc.

**Important**: Composables must be called in the right context (setup function, plugin, middleware). Cannot use `await` before calling a composable (except in `<script setup>`, `defineNuxtComponent`, `defineNuxtPlugin`, `defineNuxtRouteMiddleware`).

### Directory-based Auto-imports

| Directory | Auto-imported |
|-----------|---------------|
| `app/components/` | Vue components |
| `app/composables/` | Vue composables |
| `app/utils/` | Helper functions |

### Disabling Auto-imports

```ts
export default defineNuxtConfig({
  imports: { dirs: [] }, // Disable composables auto-import
  components: false,     // Disable components auto-import
})
```

## Modules

### Using Modules

```ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-analytics', { ua: 'X1234567' }],
  ],
})
```

### Creating Modules

Use the official starter template:

```bash
npx nuxi module init my-module
```

Modules can:
- Register hooks
- Add composables
- Add components
- Configure build
- Extend runtime config
- Add server routes
- Register plugins

### Module Hooks

```ts
export default defineNuxtModule({
  meta: { name: 'my-module' },
  setup(options, nuxt) {
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({ path: resolve('./runtime/components') })
    })
  },
})
```

## Layers

Layers allow organizing and sharing reusable code:

```ts
export default defineNuxtConfig({
  extends: [
    'github:nuxt-themes/elements',
    '../shared-layer',
    'github:my-org/my-theme#main',
  ],
})
```

Layers can provide: components, composables, pages, layouts, middleware, plugins, server routes, modules, and configuration.

## Prerendering

### Crawl-based Pre-rendering

```bash
nuxt generate
```

Builds and pre-renders using the Nitro crawler:

1. Loads HTML of root route `/` and non-dynamic pages
2. Saves HTML and `_payload.json` to `.output/public/`
3. Finds all `<a href="...">` tags
4. Repeats for each anchor until no more found

**Important**: Pages not linked from discoverable pages won't be pre-rendered.

### Selective Pre-rendering

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/about', '/sitemap.xml'],
      crawlLinks: true,  // Default true
      ignore: ['/admin'],
    },
  },
})
```

### Runtime Prerender Configuration

```ts
// In a server route or plugin
prerenderRoutes(['/special-page', '/another-page'])
```

### Payload Extraction

Pre-rendered pages extract payload data to `_payload.json`, reducing client-side data fetching.

## Testing

### Installation

```bash
npm i --save-dev @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```

### Unit Testing

Configure Vitest with Nuxt environment:

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
  },
})
```

### Built-in Helpers

#### mountSuspended

Mount Vue components within Nuxt environment:

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { SomeComponent } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(SomeComponent)
  expect(component.text()).toMatchInlineSnapshot('"This is an auto-imported component"')
})
```

Options: `route` (initial route, default `/`), plus all `@vue/test-utils` mount options.

#### renderSuspended

Render with Testing Library:

```ts
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'

it('can render some component', async () => {
  await renderSuspended(SomeComponent)
  expect(screen.getByText('Some text')).toBeDefined()
})
```

#### Other Helpers

- `mockNuxtImport` — Mock Nuxt auto-imports
- `mountSuspended` — Mount with async setup and Nuxt injections
- `renderSuspended` — Render with Testing Library

### End-to-End Testing

Supports Vitest, Jest, Cucumber, and Playwright:

```ts
import { setup, $fetch } from '@nuxt/test-utils/e2e'

await setup({ browser: true })

test('homepage', async () => {
  const html = await $fetch('/')
  expect(html).toContain('My App')
})
```

## Experimental Features

Enable in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  experimental: {
    // Enable specific features
    asyncContext: true,
    componentIslands: true,
    viewTransition: true,
    lazyHydration: true,
  },
})
```

### Key Experimental Features

| Feature | Default | Description |
|---------|---------|-------------|
| `alwaysRunFetchOnKeyChange` | `false` | Run useFetch on key change even with immediate:false |
| `appManifest` | `true` | Use app manifests for route rules on client |
| `asyncContext` | `false` | Native async context for nested composables |
| `asyncEntry` | `false` | Async entry point for module federation |
| `externalVue` | `true` | Externalize vue, @vue/*, vue-router in build |
| `extractAsyncDataHandlers` | `false` | Extract handlers into separate chunks |
| `emitRouteChunkError` | `true` | Handle chunk loading errors with reload |
| `payloadExtraction` | `true` | Extract payload for pre-rendered pages |
| `viewTransition` | `false` | Enable View Transitions API |
| `componentIslands` | `false` | Server-only island components |
| `typedPages` | `false` | Type-safe routing |
| `sharedPrerenderData` | `false` | Share data between pre-rendered routes |
| `clientNodeCompat` | `false` | Node.js compatibility on client |
| `lazyHydration` | `false` | Lazy hydration of components |
| `ssrStreaming` | `false` | SSR streaming responses |
| `decorators` | `false` | TypeScript decorators support |
| `buildCache` | `false` | Cache build artifacts |
| `pendingWhenIdle` | `true` | Status is pending when idle |
| `granularCachedData` | `false` | Granular cached data control |
| `headNext` | `false` | Use next-gen Unhead |
| `normalizeComponentNames` | `false` | Normalize component names |
| `prefetchPreloadTags` | `true` | Add preload tags for prefetched links |
| `purgeCachedData` | `true` | Purge cached data on navigation |
| `scanPageMeta` | `true` | Scan page meta at build time |
| `typescriptPlugin` | `true` | Use TypeScript plugin for type checking |
| `viteEnvironmentApi` | `false` | Use Vite Environment API |

## Deployment

### Node.js Server

```bash
nuxt build
node .output/server/index.mjs
```

With PM2:

```bash
pm2 start .output/server/index.mjs
```

### Static Hosting

```bash
nuxt generate
# Deploy .output/public/ to any static host
```

### Presets

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel', // or 'netlify', 'cloudflare', 'deno', etc.
  },
})
```

Or via env:

```bash
NITRO_PRESET=cloudflare nuxt build
```

### Supported Presets

- `node-server` — Node.js server (default)
- `vercel` — Vercel
- `vercel-edge` — Vercel Edge Functions
- `netlify` — Netlify
- `cloudflare` — Cloudflare Workers/Pages
- `cloudflare-pages` — Cloudflare Pages
- `deno` — Deno Deploy
- `static` — Static hosting
- `service-worker` — Browser service worker

### CDN Proxy Considerations

Disable Cloudflare:
1. Speed > Settings > Content Optimization > Disable "Rocket Loader"
2. Security > Settings > Disable "Email Address Obfuscation"

## Nuxt 4 Migration Notes

### Key Changes from Nuxt 3

- **`srcDir` default**: Changed from `.` (root) to `app/`
- **Directory structure**: Application code moved to `app/` directory
- **Data fetching**: `useAsyncData` handler signature changed to `(nuxtApp, ctx) => ...`
- **Shared directory**: New `shared/` directory for code used in both app and server
- **Server alias**: `#server` alias for server imports
- **Route groups**: Folder-based route groups support
- **`compatibilityDate`**: New config for controlling preset behavior
- **Builder options**: Support for Rspack builder

## Lifecycle Hooks

### App Hooks (Runtime)

Available in plugins via `nuxtApp.hook()`:

| Hook | Payload | Description |
|------|---------|-------------|
| `app:created` | `vueApp` | Vue app created |
| `app:error` | `err` | Error occurred |
| `app:error:cleared` | `{ redirect? }` | Error cleared |
| `vue:setup` | — | Vue setup called |
| `vue:error` | `err, target, info` | Vue error |
| `app:rendered` | `renderContext` | App rendered (SSR) |
| `app:redirected` | — | App redirected |
| `app:beforeMount` | `vueApp` | Before mount |
| `app:mounted` | `vueApp` | App mounted |
| `app:suspense:resolve` | `appComponent` | Suspense resolved |
| `app:manifest:update` | `{ id, timestamp }` | Manifest updated |
| `app:data:refresh` | `keys?` | Data refreshed |
| `link:prefetch` | `to` | Link prefetching |
| `page:start` | `pageComponent?` | Page navigation start |
| `page:finish` | `pageComponent?` | Page navigation finish |
| `page:loading:start` | — | Loading indicator start |
| `page:loading:end` | — | Loading indicator end |
| `page:transition:finish` | `pageComponent?` | Page transition end |
| `dev:ssr-logs` | `logs` | SSR logs in dev |
| `page:view-transition:start` | `transition` | View transition start |

Usage:

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    console.log('Page navigation started')
  })
})
```

### Nuxt Hooks (Build Time)

Available in `nuxt.config.ts` or modules:

| Hook | Payload | Description |
|------|---------|-------------|
| `ready` | `nuxt` | Nuxt initialized |
| `close` | `nuxt` | Nuxt closing |
| `restart` | `{ hard?: boolean }` | Restart Nuxt |
| `modules:before` | — | Before modules install |
| `modules:done` | — | After modules install |
| `build:before` | — | Before build |
| `build:done` | — | After build |
| `build:manifest` | `manifest` | Build manifest |
| `pages:extend` | `pages` | Extend page routes |
| `pages:resolved` | `pages` | Pages resolved |
| `imports:sources` | `presets` | Import sources |
| `imports:extend` | `imports` | Extend imports |
| `components:dirs` | `dirs` | Component directories |
| `components:extend` | `components` | Extend components |
| `nitro:config` | `nitroConfig` | Nitro config |
| `nitro:init` | `nitro` | Nitro initialized |
| `nitro:build:before` | `nitro` | Before Nitro build |
| `prerender:routes` | `ctx` | Prerender routes |
| `build:error` | `error` | Build error |
| `vite:extend` | `viteBuildContext` | Extend Vite |
| `vite:extendConfig` | `viteInlineConfig, env` | Vite config |
| `vite:serverCreated` | `viteServer, env` | Vite server created |
| `vite:compiled` | — | Vite compiled |
| `webpack:config` | `webpackConfigs` | Webpack config |

Usage in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      pages.push({ name: 'profile', path: '/profile', file: '~/extra-pages/profile.vue' })
    },
  },
})
```

### Server Hooks (Runtime)

Available in Nitro plugins:

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    html.bodyAppend.push('<hr>Appended by custom plugin')
  })
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    // Modify response
  })
})
```

### Adding Custom Hooks

```ts
import type { HookResult } from '@nuxt/schema'
declare module '#app' {
  interface RuntimeNuxtHooks {
    'my-runtime-hook': () => HookResult
  }
  interface NuxtHooks {
    'my-build-hook': () => HookResult
  }
}
declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'my-nitro-hook': () => void
  }
}
```

## Runtime Config

### Exposing Config

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // overridden by NUXT_API_SECRET
    public: {
      apiBase: '', // overridden by NUXT_PUBLIC_API_BASE
    },
  },
})
```

### Environment Variables

- Must be defined in `nuxt.config.ts` to be exposed
- Override with `NUXT_` prefix, `_` separates keys
- Values parsed with `destr` (JSON-aware)

```bash
NUXT_API_SECRET=api_secret_token
NUXT_PUBLIC_API_BASE=https://nuxtjs.org
```

### Serialization

Runtime config is serialized before passing to Nitro. Functions, Sets, Maps cannot be serialized — use plugins or middleware instead.

### Reading Config

In Vue app:

```ts
const config = useRuntimeConfig()
config.public.apiBase
config.apiSecret // Server-only (not in client bundle)
```

In server routes:

```ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return { base: config.public.apiBase }
})
```

In plugins:

```ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  // Access config
})
```

### Typing Runtime Config

```ts
declare module '@nuxt/schema' {
  interface RuntimeConfig {
    apiSecret: string
  }
  interface PublicRuntimeConfig {
    apiBase: string
  }
}
```

## Custom Routing

### Router Config

Override routes in `app/router.options.ts`:

```ts
import type { RouterConfig } from '@nuxt/schema'
export default {
  routes: _routes => [
    { name: 'home', path: '/', component: () => import('~/pages/home.vue') },
  ],
} satisfies RouterConfig
```

### Pages Hook

Add/modify/remove routes via `pages:extend`:

```ts
export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      // Add route
      pages.push({ name: 'profile', path: '/profile', file: '~/extra-pages/profile.vue' })
      // Remove routes matching pattern
      function removePagesMatching(pattern, pages = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (page.file && pattern.test(page.file)) pagesToRemove.push(page)
          else removePagesMatching(pattern, page.children)
        }
        for (const page of pagesToRemove) pages.splice(pages.indexOf(page), 1)
      }
      removePagesMatching(/\.ts$/, pages)
    },
  },
})
```

### Nuxt Module

Use Kit utilities for module-level route management:

```ts
import { extendPages, extendRouteRules } from '@nuxt/kit'
extendPages((pages) => { pages.push({ /* ... */ }) })
extendRouteRules('/custom', { cors: true })
```

### Router Options

Customize scroll behavior, hash mode:

```ts
// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'
export default {
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, top: 100, behavior: 'smooth' }
    return savedPosition || { top: 0 }
  },
} satisfies RouterConfig
```

Hash mode (SPA):

```ts
export default defineNuxtConfig({
  router: { options: { hashMode: true } },
})
```

## NuxtApp

### The Nuxt Context

Available in: plugins, Nuxt hooks, Nuxt middleware (wrapped in `defineNuxtRouteMiddleware`), and `setup()` functions.

If context unavailable, error: "A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function."

Use `nuxtApp.runWithContext()` to call functions within context.

### Accessing NuxtApp

```ts
export function useMyComposable() {
  const nuxtApp = useNuxtApp()
  // Access runtime nuxt app instance
}
```

`tryUseNuxtApp()` returns `null` instead of throwing.

### Providing Helpers

```ts
const nuxtApp = useNuxtApp()
nuxtApp.provide('hello', name => `Hello ${name}!`)
console.log(nuxtApp.$hello('name'))
```

## How Nuxt Works

### The Nuxt Interface (Builder Core)

Created during `nuxt dev` or `nuxt build`. Holds normalized options merged with `nuxt.config`, internal state, and hooking system. Globally available via Nuxt Kit. Only one instance per process.

### The NuxtApp Interface (Runtime Core)

Created when rendering a page. Keeps Vue instance, runtime hooks, and internal states (`ssrContext`, `payload` for hydration).

```ts
interface NuxtApp {
  vueApp       // Vue application
  versions     // Nuxt and Vue versions
  hooks, hook, callHook // Runtime hooks
  ssrContext   // Server-only: { url, req, res, runtimeConfig, noSSR }
  payload      // { serverRendered, data, state }
  provide      // (name, value) => void
}
```

### Runtime vs Build Context

- **Build context**: `nuxt` instance, available in modules, `nuxt.config` hooks
- **Runtime context**: `nuxtApp` instance, available in plugins, composables, middleware

## Debugging

### Sourcemaps

```ts
export default defineNuxtConfig({
  sourcemap: { server: true, client: true },
})
```

### Node Inspector

```bash
nuxt dev --inspect
```

Opens Chrome DevTools with debugger.

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [{
    "type": "node",
    "request": "launch",
    "name": "Nuxt: Dev",
    "program": "${workspaceFolder}/node_modules/nuxt/bin/nuxt.mjs",
    "args": ["dev"],
    "cwd": "${workspaceFolder}"
  }]
}
```

## Sessions and Authentication

### Using nuxt-auth-utils

```bash
npx nuxt module add auth-utils
```

Set encryption key:

```bash
NUXT_SESSION_PASSWORD=a-random-password-with-at-least-32-characters
```

Login API route:

```ts
import { z } from 'zod'
const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})
export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)
  if (email === 'admin@admin.com' && password === 'iamtheadmin') {
    await setUserSession(event, { user: { name: 'John Doe' } })
    return {}
  }
  throw createError({ status: 401, message: 'Bad credentials' })
})
```

Login page:

```vue
<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession()
const credentials = reactive({ email: '', password: '' })
async function login() {
  try {
    await $fetch('/api/login', { method: 'POST', body: credentials })
    await refreshSession()
    await navigateTo('/')
  } catch { alert('Bad credentials') }
}
</script>
```

Protect API routes:

```ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) throw createError({ status: 401, message: 'Unauthorized' })
  return { user: session.user }
})
```

Protect app routes (middleware):

```ts
export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

## Using Vite Plugins

### In Nuxt Modules

```ts
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import yaml from '@rollup/plugin-yaml'
export default defineNuxtModule({
  setup() {
    addVitePlugin(yaml())
  },
})
```

Environment-specific (Nuxt 5+):

```ts
addVitePlugin(() => ({
  name: 'my-client-plugin',
  applyToEnvironment(environment) {
    return environment.name === 'client'
  },
}))
```

### Via Vite Hooks

```ts
export default defineNuxtConfig({
  hooks: {
    'vite:extendConfig'(config, { isClient, isServer }) {
      config.plugins.push(myPlugin())
    },
  },
})
```

## Authoring Nuxt Layers

### Basic Example

```
project/
  app.vue
  nuxt.config.ts  (extends: ['./base'])
  base/
    app.vue
    components/BaseComponent.vue
    nuxt.config.ts
```

```ts
export default defineNuxtConfig({
  extends: ['./base'],
})
```

### Layer Priority

From highest to lowest:
1. Your project files
2. Auto-scanned `~/layers/` (alphabetical, Z > A)
3. `extends` config (first > second)

### Publishing Layers

**Git repository:**

```ts
export default defineNuxtConfig({
  extends: ['github:my-themes/awesome#v1'],
})
```

**npm package:**

```ts
export default defineNuxtConfig({
  extends: ['@my-themes/awesome'],
})
```

**Starter template:**

```bash
npx nuxi init layer-name -t layer
```

### Named Layer Aliases

Auto-created: `#layers/test` -> `~/layers/test`

### Disabling Modules from Layers (v4.3)

```ts
export default defineNuxtConfig({
  extends: ['../base'],
  // Disable specific modules from layers
  modules: ['!nuxt-icon'],
})
```

## Nuxt Kit

`@nuxt/kit` provides utilities for module authors:

```ts
import { defineNuxtModule, addVitePlugin, extendPages } from '@nuxt/kit'
```

Key utilities:
- `defineNuxtModule` — Define a module
- `addVitePlugin` / `addWebpackPlugin` — Add build plugins
- `extendPages` — Modify page routes
- `extendRouteRules` — Add route rules
- `addComponent` — Register components
- `addImports` / `addImportsDir` — Register auto-imports
- `addPlugin` / `addPluginTemplate` — Register plugins
- `addServerHandler` / `addServerPlugin` — Register server handlers
- `useNuxt` / `tryUseNuxt` — Access Nuxt instance
- `createResolver` — Resolve paths in modules

## Nightly Release Channel

### Opting In

```bash
npm install -D nuxt@nightly
```

### Opting Out

```bash
npm install -D nuxt@latest
```

### Using Nightly CLI

```bash
npx nuxi@nightly dev
```

---

## Nuxt Lifecycle

### Server Lifecycle

For every initial request:
1. **Server plugins once**: Nitro plugins initialize
2. **Server middleware**: Run in order, can modify event
3. **App plugins**: Vue plugins registered
4. **Route validation**: `definePageMeta` validator
5. **App middleware**: Route middleware runs
6. **Page and components**: Vue renders to HTML
7. **HTML output**: `render:html` hook, `render:response` hook

### Client Lifecycle

1. **App plugins**: Client-side plugins registered
2. **Route validation**: Validator runs
3. **App middleware**: Route middleware runs
4. **Mount Vue app and hydrate**: SSR payload hydrated
5. **Vue lifecycle**: `setup()`, `onMounted`, etc.

---

## TypeScript

### Type-checking

Nuxt doesn't type-check during `nuxt dev` or `nuxt build` by default. Enable with:

```bash
npm install --save-dev vue-tsc typescript
```

```ts
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
})
```

Or run manually: `npx nuxt typecheck`

### Auto-generated Types

Types stored in `.nuxt/` directory, generated by dev server, build, or `nuxt prepare`. Include auto-imports, API route types, path aliases (`#imports`, `~/file`, `#build/file`).

### Project References

Nuxt uses TypeScript project references for improved type-checking performance and IDE support. Codebase split into smaller, manageable pieces with separate tsconfig files.

### Strict Checks

Enable strict TypeScript checks via `typescript.strict` in `nuxt.config.ts`.

---

## Code Style (ESLint)

Recommended approach: `@nuxt/eslint` module.

```bash
npx nuxt module add eslint
```

Generates `eslint.config.mjs` (flat config format). Uses `@nuxt/eslint-config` for project-aware configuration.

---

## Best Practices: Nuxt and Hydration

### Why Fix Hydration Issues

- **Performance**: Mismatched DOM requires re-rendering, degrading UX
- **Functionality**: Interactive components may not attach properly

### Common Causes

- **Browser-only APIs in server context**: `window`, `document` not available on server
- **Inconsistent data**: Different data on server vs client
- **Conditional rendering based on client state**: `import.meta.client` checks
- **Third-party libraries with side effects**: Modifying DOM during import
- **Dynamic content based on time**: `Date.now()` differs server vs client

### Detection

Development console warnings show hydration mismatches.

---

## Best Practices: Nuxt Performance

### Built-in Features

- **Links**: `<NuxtLink>` with prefetching
- **Hybrid Rendering**: `routeRules` for per-route optimization
- **Lazy Loading Components**: `Lazy` prefix for components
- **Lazy Hydration**: `@nuxt/scripts` for deferred hydration
- **Fetching data**: `useFetch`/`useAsyncData` with proper keys and deduplication

### Core Nuxt Modules

- **Images**: `@nuxt/image` for optimization
- **Fonts**: `@nuxt/fonts` for font optimization
- **Scripts**: `@nuxt/scripts` for third-party script loading

### Profiling Tools

- `nuxi analyze` — build analysis
- Nuxt DevTools — runtime inspection
- Chrome DevTools — performance profiling
- PageSpeed Insights — Lighthouse metrics
- Web Page Test — detailed performance

### Common Problems

- Overusing plugins (run during hydration, block rendering)
- Unused code/dependencies
- Not using Vue performance tips (`v-memo`, `shallowRef`)
- Not following patterns (data fetching composables)
- Loading everything at the same time

---

## Best Practices: Nuxt Plugins

- **Avoid costly plugin setup**: Plugins run during hydration, expensive setups block rendering
- **Use composition whenever possible**: Many utilities work without plugins
- **If async, enable parallel**: `parallel: true` allows concurrent plugin loading

---

## Working with AI: MCP Server

Nuxt provides an MCP server for AI assistants (Claude Code, Cursor, Windsurf, etc.) to access documentation directly.

### Resources

- `resource://nuxt-com/documentation-pages`: Browse all docs pages
- `resource://nuxt-com/blog-posts`: Browse blog posts
- `resource://nuxt-com/deploy-providers`: Browse deployment providers

### Tools

Documentation, blog, and deployment tools for structured access to Nuxt content.

### Setup

Configure MCP server URL in your AI tool's MCP settings. Supports ChatGPT, Claude Code, Claude Desktop, Cursor, Windsurf, VS Code, GitHub Copilot Agent, Zed, and more.

---

## Working with AI: LLMs.txt

Structured documentation format for LLMs.

### Available Routes

- `/llms.txt`: Structured overview of all docs pages (~5K tokens)
- `/llms-full.txt`: Comprehensive docs including guides, API refs, blog, deployment (~1M+ tokens)

### Usage with AI Tools

Reference in Cursor rules, Windsurf instructions, or other AI tool configs for Nuxt-aware assistance.

---

## Creating Custom Events

Nuxt's event system powered by `hookable`.

### Creating Events and Listeners

```ts
// Listen
const nuxtApp = useNuxtApp()
nuxtApp.hook('app:user:registered', (payload) => {
  console.log('A new user has registered!', payload)
})

// Emit
await nuxtApp.callHook('app:user:registered', { id: 1, name: 'John Doe' })
```

Two-way communication via payload object (passed by reference):

```ts
nuxtApp.hook('app:user:registered', (payload) => {
  payload.message = 'Welcome to our app!'
})
const payload = { id: 1, name: 'John Doe' }
await nuxtApp.callHook('app:user:registered', payload)
// payload.message === 'Welcome to our app!'
```

---

## Features

### `features` config

Optional Nuxt features to enable/disable:

- **`devLogs`**: Control dev server logs
- **`inlineStyles`**: Inline critical CSS
- **`noScripts`**: Disable script rendering

### `future` config

Early opt-in to features becoming default in future versions:

- **`compatibilityVersion`**: Opt into Nuxt 5 compatibility
- **`multiApp`**: Multi-app support
- **`typescriptBundlerResolution`**: Use bundler resolution in TypeScript

---

## Module Author Guide

### Create Your First Module

Use the official starter template:

```bash
npm create nuxt -- -t module my-module
```

Steps:
1. Open `my-module` in IDE
2. Install dependencies
3. Run `npm run dev:prepare`
4. Develop, test, build, and publish

### Understand Module Structure

Module definition in `src/module.ts` — entry point loaded by Nuxt:

```ts
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@nuxtjs/example',
    configKey: 'sample',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {},
  hooks: {},
  setup(moduleOptions, nuxt) {
    // Module logic
  },
})
```

### Add Plugins, Components & More

**Modify Nuxt config:**
```ts
setup(options, nuxt) {
  nuxt.options.experimental ||= {}
  nuxt.options.experimental.componentIslands = true
}
```

**Expose options to runtime** via `runtimeConfig`:
```ts
nuxt.options.runtimeConfig.public.myModule = defu(
  nuxt.options.runtimeConfig.public.myModule,
  { foo: options.foo }
)
```

**Add plugins:**
```ts
import { addPlugin, createResolver } from '@nuxt/kit'
const resolver = createResolver(import.meta.url)
addPlugin(resolver.resolve('./runtime/plugin'))
```

**Add components:** `addComponent()` from `@nuxt/kit`
**Add composables:** `addImports()` from `@nuxt/kit`
**Add route middleware:** `addRouteMiddleware()`
**Add server routes:** `addServerRoute()`

### Module Dependencies

Declare dependencies on other modules with version constraints:

```ts
export default defineNuxtModule({
  moduleDependencies: {
    '@nuxtjs/tailwindcss': {
      version: '>=6',
      overrides: { exposeConfig: true },
      defaults: { config: { darkMode: 'class' } },
    },
  },
})
```

Supports local modules via file paths or Nuxt aliases (`~`, `@`).

### Use Hooks & Extend Types

**Lifecycle hooks** via `hooks` map or programmatic:

```ts
export default defineNuxtModule({
  hooks: {
    'app:error': (err) => console.info(`Error: ${err}`),
  },
  setup(options, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      console.info(`Discovered ${pages.length} pages`)
    })
  },
})
```

**Add virtual files**, **add type declarations**, **extend TypeScript config**, and **augment types** via Nuxt Kit utilities.

### Test Your Module

**E2E tests** with `@nuxt/test-utils`:

```ts
import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({ rootDir: fileURLToPath(new URL('./fixtures/ssr', import.meta.url)) })
  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>ssr</div>')
  })
})
```

### Follow Best Practices

- **Handle async setup**: Avoid blocking; defer to hooks
- **Prefix exports**: Use module name prefix (e.g., `FooButton`, `useFooData`, `/api/_foo/track`)
- **Use lifecycle hooks**: Prefer hooks over setup logic
- **Be TypeScript friendly**: Provide types for all options
- **Use ESM syntax**: `import.meta.url`, `createResolver`
- **Document your module**: README, configuration docs
- **Provide a demo**: Example app
- **Stay version agnostic**: Support range of Nuxt versions
- **Follow starter conventions**: Use official template structure

### Publish & Share Your Module

**Module types:**
- **Official**: `@nuxt/` scope (e.g., `@nuxt/content`) — maintained by Nuxt team
- **Community**: `@nuxtjs/` scope (e.g., `@nuxtjs/tailwindcss`) — proven community modules
- **Third-party**: `nuxt-` prefix — anyone can publish
- **Private**: Company-scoped (e.g., `@my-company/nuxt-auth`)

**Listing**: Open issue in `nuxt/modules` repository to be listed on module list.

**Join nuxt-modules**: Transfer module to `nuxt-modules` org for community maintenance, get `@nuxtjs/` scope and subdomain.

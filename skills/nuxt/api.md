# Nuxt 4.x API Reference

## Nuxt Configuration (`nuxt.config.ts`)

### alias

Define additional aliases for custom directories:

```ts
export default defineNuxtConfig({
  alias: {
    'images': fileURLToPath(new URL('./assets/images', import.meta.url)),
    'style': fileURLToPath(new URL('./assets/style', import.meta.url)),
  },
})
```

Default aliases: `~` -> `app/`, `@` -> `app/`, `~~` -> root, `@@` -> root, `#shared` -> `shared/`, `#server` -> `server/`, `assets` -> `app/assets/`, `public` -> `public/`, `#build` -> `.nuxt/`

### app

Nuxt App configuration:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `baseURL` | string | `"/"` | Base URL of the app |
| `buildAssetsDir` | string | `"/_nuxt/"` | Build assets directory |
| `cdnURL` | string | `""` | CDN URL for assets |
| `head` | object | `{}` | Default head config |
| `keepalive` | boolean | `true` | Keepalive for pages |
| `layoutTransition` | boolean/object | `true` | Layout transition config |
| `pageTransition` | boolean/object | `true` | Page transition config |
| `rootAttrs` | object | `{}` | Root element attributes |
| `rootId` | string | `"__nuxt"` | Root element ID |
| `rootTag` | string | `"div"` | Root element tag |
| `spaLoaderAttrs` | object | - | SPA loader attributes |
| `spaLoaderTag` | string | - | SPA loader tag |
| `teleportAttrs` | object | - | Teleport element attributes |
| `teleportId` | string | `"teleports"` | Teleport element ID |
| `teleportTag` | string | `"div"` | Teleport element tag |
| `viewTransition` | boolean | `false` | Enable View Transitions |

### buildDir

Directory for built Nuxt files. Default: `"/<rootDir>/.nuxt"`

### builder

Builder for bundling the Vue part: `'vite'` (default), `'webpack'`, `'rspack'`, or custom:

```ts
export default defineNuxtConfig({
  builder: 'rspack', // requires @nuxt/rspack-builder
})
```

### compatibilityDate

Controls behavior of Nitro presets and other modules without major version bumps.

### components

Configure component auto-registration:

```ts
export default defineNuxtConfig({
  components: {
    dirs: [
      { path: '~/components/global', global: true },
      '~/components',
    ],
  },
})
```

### css

Array of CSS files to include:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css', '~/assets/css/variables.css'],
})
```

### devServer

| Property | Type | Default |
|----------|------|---------|
| `cors` | boolean | - |
| `host` | string | - |
| `https` | boolean/object | `false` |
| `loadingTemplate` | string | - |
| `port` | number | `3000` |
| `url` | string | - |

### dir

Customize directory names:

| Property | Default |
|----------|---------|
| `app` | `"app"` |
| `assets` | `"assets"` |
| `layouts` | `"layouts"` |
| `middleware` | `"middleware"` |
| `modules` | `"modules"` |
| `pages` | `"pages"` |
| `plugins` | `"plugins"` |
| `public` | `"public"` |
| `shared` | `"shared"` |

### experimental

Enable experimental features (see guides.md for details):

```ts
export default defineNuxtConfig({
  experimental: {
    asyncContext: true,
    componentIslands: true,
    viewTransition: true,
  },
})
```

### extends

Extend from layers (local or remote):

```ts
export default defineNuxtConfig({
  extends: ['github:nuxt-themes/elements', '../shared-layer'],
})
```

### modules

Register Nuxt modules:

```ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    ['@nuxtjs/google-analytics', { ua: 'X1234567' }],
    function () {}, // inline
  ],
})
```

### nitro

Configuration for Nitro server engine (see https://nitro.build/config):

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',
    routeRules: {
      '/': { prerender: true },
    },
  },
})
```

### pages

Enable pages directory. Default: `true` if `app/pages/` exists.

### runtimeConfig

Runtime configuration with env variable override:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiKey: '', // Private, server-only, overridden by NUXT_API_KEY
    public: {
      baseURL: '', // Exposed to client, overridden by NUXT_PUBLIC_BASE_URL
    },
  },
})
```

### routeRules

Per-route rendering and caching rules:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // Static at build time
    '/products': { swr: true },          // Stale-while-revalidate
    '/products/**': { swr: 3600 },       // SWR with 1hr cache
    '/blog': { isr: 3600 },              // ISR with 1hr cache
    '/blog/**': { isr: true },           // ISR until next deploy
    '/admin/**': { ssr: false },         // Client-side only
    '/api/**': { cors: true },           // CORS headers
    '/old-page': { redirect: '/new-page' }, // Redirects
  },
})
```

### ssr

Enable/disable SSR. Default: `true`. Set to `false` for SPA mode.

### srcDir

Source directory. Default: `"app"` (Nuxt 4).

### typescript

TypeScript integration:

| Property | Type | Default |
|----------|------|---------|
| `builder` | string | - |
| `hoist` | string[] | - |
| `includeWorkspace` | boolean | - |
| `shim` | boolean | - |
| `strict` | boolean | `true` |
| `tsConfig` | object | - |
| `typeCheck` | boolean/string | `false` |

### vite

Vite configuration (see https://vite.dev/config):

```ts
export default defineNuxtConfig({
  vite: {
    define: { MY_GLOBAL: 'value' },
    optimizeDeps: { include: ['my-package'] },
  },
})
```

### vue

Vue configuration:

```ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: { /* ... */ },
    runtimeCompiler: false,
  },
})
```

## Composables

### useFetch

SSR-safe data fetching wrapper around `$fetch` and `useAsyncData`:

```ts
const { data, error, status, refresh, execute, clear } = await useFetch('/api/data')
```

**Parameters:**
- `URL`: string | Request | Ref<string | Request> | (() => string | Request)
- `options`: Extends ofetch options + AsyncDataOptions
  - `key`, `method` (default 'GET'), `query`/`params`, `body`, `headers`, `baseURL`
  - `server` (default true), `lazy` (default false), `immediate` (default true)
  - `default`, `transform`, `getCachedData`, `pick`, `watch`, `deep`, `dedupe`, `timeout`, `enabled`

**Return values:** `data`, `refresh`/`execute`, `error`, `status`, `clear`

### useAsyncData

SSR-safe async logic wrapper:

```ts
const { data, error, status, refresh, execute, clear } = await useAsyncData(
  key: string,
  handler: (nuxtApp, ctx) => Promise<DataT>,
  options?: AsyncDataOptions,
)
```

**Parameters:**
- `key`: Unique key for de-duplication (auto-generated if not provided)
- `handler`: Async function returning truthy value (side-effect free)
- `options`:
  - `server` (boolean, default true) — Run on server
  - `lazy` (boolean, default false) — Don't block navigation
  - `immediate` (boolean, default true) — Execute immediately
  - `default` (() => DataT) — Default value
  - `transform` ((input) => DataT | Promise<DataT>) — Transform result
  - `getCachedData` ((key, nuxtApp, ctx) => DataT | undefined) — Cache lookup
  - `pick` (string[]) — Pick specific fields
  - `watch` (MultiWatchSources | false) — Watch sources to refetch
  - `deep` (boolean, default false) — Deep watch
  - `dedupe` ('cancel' | 'defer', default 'cancel') — Deduplication strategy
  - `timeout` (number) — Request timeout

**Status values:** `"idle"`, `"pending"`, `"success"`, `"error"`

### useState

SSR-friendly shared state:

```ts
export function useState<T>(init?: () => T | Ref<T>): Ref<T>
export function useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>
```

```ts
const count = useState('counter', () => 0)
const shallowState = useState('shallow', () => shallowRef({ big: 'object' }))
```

### useRuntimeConfig

Access runtime configuration:

```ts
// In Vue components
const config = useRuntimeConfig()
// config.public.apiBase — public, accessible on client and server
// config.apiSecret — private, server-only

// In server routes
const config = useRuntimeConfig(event)
```

Environment variables override with `NUXT_` prefix:
- `NUXT_API_KEY` -> `runtimeConfig.apiKey`
- `NUXT_PUBLIC_BASE_URL` -> `runtimeConfig.public.baseURL`

### useRoute

Returns the current route:

```ts
const route = useRoute()
route.params.id    // Route params
route.query.q      // Query params
route.path         // Current path
route.fullPath     // Full path with query
```

### useHead

Programmatic head management:

```ts
useHead({
  title: 'My Page',
  titleTemplate: '%s - My App',
  meta: [{ name: 'description', content: 'Page description' }],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  script: [{ src: 'https://example.com/script.js', defer: true }],
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: 'dark-mode' },
})
```

### useSeoMeta

Type-safe SEO meta tags:

```ts
useSeoMeta({
  title: 'My Page',
  ogTitle: 'My Page',
  description: 'Page description',
  ogDescription: 'Page description',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
})
```

### useAppConfig

Access app configuration (build-time):

```ts
const appConfig = useAppConfig()
// appConfig.theme.dark
// appConfig.title
```

### useNuxtApp

Access the Nuxt app instance:

```ts
const nuxtApp = useNuxtApp()
nuxtApp.payload        // Payload data
nuxtApp.isHydrating    // Boolean
nuxtApp.hook('page:start', () => {})
```

## Components

### NuxtLink

Navigation component rendering `<a>` tag with client-side routing:

```vue
<NuxtLink to="/about">About</NuxtLink>
<NuxtLink to="/posts/1" prefetch>Post 1</NuxtLink>
<NuxtLink to="https://nuxt.com" external>Nuxt</NuxtLink>
<NuxtLink to="/" :prefetch="false">Home (no prefetch)</NuxtLink>
```

**Props:**
- `to`: Route location (string, object)
- `href`: Alias for `to`
- `target`: `_blank`, `_self`, etc.
- `rel`: Relationship attribute (`noopener`, `noreferrer`, etc.)
- `noRel`: Disable rel attribute
- `prefetch`: Enable/disable prefetch (default true for internal links)
- `noPrefetch`: Disable prefetch
- `external`: Force external link
- `replace`: Replace current history entry
- `activeClass`, `exactActiveClass`: Active link classes
- `custom`: Custom rendering (v-slot)

### NuxtPage

Renders the matched page component:

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

Props: `pageKey`, `transition`, `keepalive`

### NuxtLayout

Renders the active layout:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### NuxtErrorBoundary

Catches errors in its children:

```vue
<NuxtErrorBoundary @error="handleError">
  <template #error="{ error, clearError }">
    <p>An error occurred: {{ error.message }}</p>
    <button @click="clearError">Clear</button>
  </template>
  <!-- content -->
</NuxtErrorBoundary>
```

### Head Components

`<Title>`, `<Base>`, `<NoScript>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>`, `<Head>`

## Utilities

### $fetch

HTTP client (ofetch-based) for non-SSR-safe requests:

```ts
const data = await $fetch('/api/data')
const post = await $fetch('/api/posts/1', { method: 'POST', body: { title: 'New' } })
```

### definePageMeta

Define page metadata:

```ts
definePageMeta({
  name: 'my-page',
  path: '/:postId(\\d+)-:postSlug', // Custom regex
  props: true,
  alias: '/p/:id',
  keepalive: { exclude: ['modal'] },
  key: route => route.fullPath,
  layout: 'admin',              // or false to disable
  layoutTransition: true,
  middleware: 'auth',           // or function, or array
  pageTransition: true,
  viewTransition: true,
  redirect: '/new-path',
  validate: route => /^\d+$/.test(route.params.id),
  scrollToTop: true,
  // Custom metadata
  pageType: 'Checkout',
})
```

### createError

Create error with metadata:

```ts
throw createError({
  status: 404,
  statusText: 'Page Not Found',
  message: 'Item not found',
  fatal: true, // Triggers full-screen error on client
})
```

### showError

Trigger full-screen error page:

```ts
showError({ statusCode: 500, statusMessage: 'Server Error' })
```

### clearError

Clear current error:

```ts
await clearError({ redirect: '/' })
```

### navigateTo

Programmatic navigation:

```ts
await navigateTo('/dashboard')
await navigateTo({ path: '/users', query: { page: 2 } })
await navigateTo('https://example.com', { external: true })
```

### useError

Get global Nuxt error:

```ts
const error = useError()
// error.value.statusCode, error.value.message
```

### callOnce

Run function only once:

```ts
await callOnce(async () => {
  const data = await $fetch('/api/init')
  useState('init', () => data)
})
```

### defineNuxtRouteMiddleware

Define route middleware:

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (!isAuthenticated()) {
    return navigateTo('/login')
  }
})
```

### defineNuxtPlugin

Define Nuxt plugin:

```ts
export default defineNuxtPlugin((nuxtApp) => {
  // Plugin logic
  nuxtApp.provide('myPlugin', { hello: 'world' })
})
```

## Server Routes

### API Routes

Files in `server/api/` are prefixed with `/api`:

```ts
// server/api/hello.ts
export default defineEventHandler(() => 'Hello World!')
// Accessible at /api/hello
```

### Server Routes (no /api prefix)

Files in `server/routes/`:

```ts
// server/routes/hello.ts
export default defineEventHandler(() => 'Hello World!')
// Accessible at /hello
```

### Route Parameters

```ts
// server/api/hello/[name].ts
export default defineEventHandler((event) => {
  const name = getRouterParam(event, 'name')
  return `Hello, ${name}!`
})
```

### Matching HTTP Method

```ts
// server/api/test.get.ts — GET only
export default defineEventHandler(() => 'Test get handler')

// server/api/test.post.ts — POST only
export default defineEventHandler(() => 'Test post handler')
```

### Catch-all Route

```ts
// server/api/foo/[...slug].ts
export default defineEventHandler((event) => {
  // event.context.params.slug -> 'bar/baz'
  return `Default foo handler`
})
```

### Body Handling

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { body }
})
```

### Query Parameters

```ts
export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { page: query.page }
})
```

### Server Middleware

Runs before any server route:

```ts
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  event.context.auth = { user: 123 }
})
```

### Server Plugins

Nitro plugins for lifecycle hooks:

```ts
// server/plugins/myPlugin.ts
export default defineNitroPlugin((nitroApp) => {
  console.log('Nitro plugin registered')
})
```

### Server Utilities

Custom helpers in `server/utils/`:

```ts
// server/utils/formatUser.ts
export const formatUser = (user: User) => ({
  id: user.id,
  name: user.name,
})
```

Use `#server` alias (v4.3+):

```ts
import { formatUser } from '#server/utils/formatUser'
```

### Runtime Config in Server

```ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const result = await $fetch('/test', {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${config.apiSecret}` },
  })
  return result
})
```

### Custom useFetch (createUseFetch)

Create a custom fetcher with auth and error handling:

```ts
export const useAPI = createUseFetch({
  baseURL: 'https://api.nuxt.com',
  onRequest({ options }) {
    const { session } = useUserSession()
    if (session.value?.token) {
      options.headers.set('Authorization', `Bearer ${session.value.token}`)
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      await navigateTo('/login')
    }
  },
})

// Usage
const { data: profile } = await useAPI('/me')
```

### Custom $fetch Instance via Plugin

```ts
export default defineNuxtPlugin((nuxtApp) => {
  const { session } = useUserSession()
  const api = $fetch.create({
    baseURL: 'https://api.nuxt.com',
    onRequest({ options }) {
      if (session.value?.token) {
        options.headers.set('Authorization', `Bearer ${session.value?.token}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })
  return { provide: { api } }
})
```

Usage:

```ts
const { $api } = useNuxtApp()
const { data: modules } = await useAsyncData('modules', () => $api('/modules'))
```

## Additional Composables

### useCookie

SSR-friendly cookie reading/writing. Returns a `Ref<T>`:

```ts
const cookie = useCookie('name', { maxAge: 60 * 60, sameSite: 'strict' })
cookie.value = 'my-value'
```

Options include: `decode`, `encode`, `default`, `watch`, `readonly`, `refresh`, `maxAge`, `expires`, `httpOnly`, `secure`, `partitioned`, `domain`, `path`, `sameSite`.

Type:

```ts
export function useCookie<T = string | null | undefined>(
  name: string,
  options?: CookieOptions<T>,
): CookieRef<T>
```

Refreshing cookies:

```ts
const cookie = useCookie('test', { refresh: true })
// Or manually:
refreshCookie('test')
```

### useRequestHeaders

Access incoming request headers during SSR:

```ts
const { data } = await useFetch('/api/confidential', {
  headers: useRequestHeaders(['authorization']),
})
```

### useRequestFetch

Forward request context and headers for server-side fetch:

```ts
const fetch = useRequestFetch()
```

### useRequestEvent

Access the incoming request event:

```ts
const event = useRequestEvent()
```

### useRequestURL

Access the incoming request URL:

```ts
const url = useRequestURL()
console.log(url.href)     // full URL
console.log(url.origin)   // origin
console.log(url.pathname) // path
```

### useResponseHeader

Set server response headers per-page or in middleware:

```ts
// pages/test.vue
const header = useResponseHeader('X-My-Header')
header.value = 'my-value'
```

In middleware:

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const header = useResponseHeader('X-My-Always-Header')
  header.value = `I'm Always here!`
})
```

### useRouter

Returns the router instance with methods: `addRoute()`, `removeRoute()`, `getRoutes()`, `hasRoute()`, `resolve()`, `back()`, `forward()`, `go()`, `push()`, `replace()`, `isReady()`, `onError()`, `beforeEach()`, `afterEach()`, `beforeResolve()`.

```ts
const router = useRouter()
router.push('/home')
router.back()
```

Use `navigateTo()` instead of `router.push()` for Nuxt-specific navigation.

### useLoadingIndicator

Access the loading state of the page:

```ts
const {
  isLoading,  // Ref<boolean>
  error,      // Ref<Error | null>
  progress,   // Ref<number>
  start,      // () => void
  set,        // (progress: number, estimatedProgress?: number) => void
  finish,     // () => void
  clear,      // () => void
} = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
  estimatedProgress: (duration, elapsed) => Math.min(100, (elapsed / duration) * 100),
})
```

### usePreviewMode

Check and control preview mode:

```ts
const { enabled, enable, disable } = usePreviewMode()
```

Options:
- `enable`: Custom enable check function
- `disableOnLoad`: Modify default state
- `onEnable` / `onDisable`: Custom callbacks

### useServerSeoMeta

Server-only SEO meta tags with full TypeScript support:

```ts
useServerSeoMeta({
  ogTitle: 'My Title',
  ogDescription: 'My Description',
  ogImage: 'https://example.com/image.png',
})
```

### useHeadSafe

Safe wrapper around `useHead` for user input (prevents XSS):

```ts
export function useHeadSafe(input: MaybeComputedRef<HeadSafe>): void
```

Restricts dangerous attributes like `innerHTML`, `http-equiv`. Recommended for user-generated content.

### useAppConfig

Access build-time app configuration:

```ts
const appConfig = useAppConfig()
console.log(appConfig.theme)
```

### useNuxtApp

Access the NuxtApp runtime instance:

```ts
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:start', () => { /* ... */ })
nuxtApp.$hello('world') // Access plugin injections
nuxtApp.runWithContext(() => { /* run with Nuxt context */ })
```

Properties: `vueApp`, `versions`, `hooks`, `hook`, `callHook`, `ssrContext`, `payload`, `provide`.

`tryUseNuxtApp()` returns `null` instead of throwing when context is unavailable.

## Additional Components

### ClientOnly

Render components only on client-side:

```vue
<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <Comment />
  </ClientOnly>
</template>
```

With fallback slot:

```vue
<ClientOnly fallback-tag="span">
  <Comments />
  <template #fallback>
    <p>Loading comments...</p>
  </template>
</ClientOnly>
```

Props: `placeholderTag` / `fallbackTag`, `placeholder` / `fallback`.
Slots: `#fallback`.

### NuxtIsland

Render server components (islands) without client JS:

```vue
<NuxtIsland name="MyIsland" :props="{ markdown: '# Headline' }" />
```

Props:
- `name` (string, required): Component name
- `lazy` (boolean, default false): Non-blocking render
- `props` (Record<string, any>): Props to send
- `source` (string): Remote source URL
- `dangerouslyLoadClientComponents` (boolean, default false)

Requires `experimental.componentIslands` enabled.

### NuxtLoadingIndicator

Displays a progress bar at top of page:

```vue
<template>
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
```

Props: `color`, `height`, `duration`, `throttle`, `estimatedProgress`.

### NuxtRouteAnnouncer

Accessibility component for route changes:

```vue
<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
```

### NuxtErrorBoundary

Catch errors in child components:

```vue
<NuxtErrorBoundary @error="onError">
  <template #error="{ error, clearError }">
    <p>An error occurred: {{ error.message }}</p>
    <button @click="clearError">Clear</button>
  </template>
  <MyComponent />
</NuxtErrorBoundary>
```

## Additional Utils

### refreshNuxtData

Refresh all or specific asyncData instances:

```ts
// Refresh all
await refreshNuxtData()

// Refresh specific keys
await refreshNuxtData('myKey')
await refreshNuxtData(['key1', 'key2'])
```

### reloadNuxtApp

Hard reload the page:

```ts
reloadNuxtApp({
  ttl?: number,       // Time to live (ms)
  force?: boolean,    // Force reload
  path?: string,      // URL to reload
  persistState?: boolean, // Keep state
})
```

### abortNavigation

Stop navigation in middleware:

```ts
abortNavigation()              // Stop without error
abortNavigation('Not found')   // Stop with string error
abortNavigation(new Error('Not found')) // Stop with Error object
```

Returns `false`.

### setPageLayout

Dynamically change page layout:

```ts
setPageLayout('admin')
setPageLayout('custom', { title: 'My Page' }) // With props (v4.3+)
```

### onNuxtReady

Run callback after app initialization:

```ts
onNuxtReady(() => {
  console.log('App is ready')
})
```

### preloadRouteComponents

Manually preload route components:

```ts
preloadRouteComponents('/dashboard')
const submit = async () => {
  const results = await $fetch('/api/authentication')
  if (results.token) {
    await navigateTo('/dashboard')
  }
}
```

### addRouteMiddleware

Dynamically add middleware:

```ts
// Named middleware
addRouteMiddleware('my-middleware', (to, from) => {
  console.log('Middleware running')
})

// Global middleware
addRouteMiddleware('global-middleware', () => {
  console.log('Runs on every route')
}, { global: true })
```

### preloadComponents

Preload components by name:

```ts
await preloadComponents('MyComponent')
```

### prerenderRoutes

Hint Nitro to prerender additional routes:

```ts
prerenderRoutes('/about')
prerenderRoutes(['/about', '/contact'])
```

### defineNuxtComponent

Define components using Options API (alternative to `<script setup>`):

```ts
export default defineNuxtComponent({
  props: { count: { type: Number, default: 0 } },
  data() { return { doubled: this.count * 2 } },
  async asyncData() { return { data: await $fetch('/api/data') } },
})
```

### isHydrating

Check if the app is currently hydrating:

```ts
const nuxtApp = useNuxtApp()
if (nuxtApp.isHydrating) {
  // SSR content is being hydrated
}
```

### callOnce

Ensure a function runs only once:

```ts
await callOnce('my-key', async () => {
  // Runs only once
  const data = await $fetch('/api/init')
  useState('init', () => data)
})
```

---

## Additional Components

### `<DevOnly>`

Renders content only during development. Not included in production builds.

```vue
<template>
  <div>
    <Sidebar />
    <DevOnly>
      <LazyDebugBar />
      <template #fallback>
        <div></div>
      </template>
    </DevOnly>
  </div>
</template>
```

### `<NuxtClientFallback>`

Renders content on the client if children trigger SSR errors.

**Props:**
- `fallbackTag` / `placeholderTag`: Fallback tag (default `div`)
- `fallback` / `placeholder`: Fallback content string
- `keepFallback`: Keep fallback if SSR failed (default `false`)

**Events:** `@ssr-error` — emitted when child triggers error in SSR

**Slots:** `#fallback` — content displayed server-side if default slot fails

```vue
<template>
  <NuxtClientFallback fallback-tag="span" fallback="Hello world">
    <BrokeInSSR />
    <template #fallback>
      <p>Hello world</p>
    </template>
  </NuxtClientFallback>
</template>
```

### `<NuxtPicture>`

Automatic image optimization (requires `@nuxt/image` module). Outputs `<picture>` tag with multiple formats.

```bash
npx nuxt module add image
```

### `<NuxtImg>`

Outputs native `<img>` tag with automatic optimization (requires `@nuxt/image` module).

```bash
npx nuxt module add image
```

```vue
<NuxtImg src="/nuxt-icon.png" />
<!-- Results in: <img src="/nuxt-icon.png" /> -->
```

### `<Teleport>`

Teleports component to different DOM location. SSR-safe.

```vue
<!-- Body teleport -->
<template>
  <Teleport to="#teleports">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
    </div>
  </Teleport>
</template>

<!-- Client-side only teleport -->
<template>
  <ClientOnly>
    <Teleport to="#some-selector">
      <!-- content -->
    </Teleport>
  </ClientOnly>
</template>
```

### `<NuxtTime>`

Displays time in locale-friendly format with server-client consistency.

```vue
<template>
  <NuxtTime :datetime="Date.now()" />
</template>
```

**Props:** `datetime`, `locale`, formatting props (`year`, `month`, `day`, `hour`, `minute`, `second`), `relative` for relative time formatting.

### `<NuxtAnnouncer>`

Announces dynamic content changes to screen readers. Use with `useAnnouncer` composable.

```vue
<!-- app.vue -->
<template>
  <NuxtAnnouncer />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**Props:**
- `atomic`: Full content readouts on updates (default `true`)
- `politeness`: `off`, `polite` (default), or `assertive`

### `<NuxtWelcome>`

Welcome screen for new projects from starter template.

```vue
<template>
  <NuxtWelcome />
</template>
```

---

## Additional Composables

### `createUseAsyncData`

Factory function to create custom `useAsyncData` with pre-defined default options.

```ts
export const useCachedData = createUseAsyncData({
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  },
})
```

```ts
// Usage
const { data } = await useCachedData('mountains', () => $fetch('https://api.nuxtjs.dev/mountains'))
```

Supports two modes: **default** (plain object options) and **override** (function receiving caller options).

### `createUseFetch`

Same factory pattern as `createUseAsyncData` but for `useFetch`.

### `onPrehydrate`

Runs callback on client immediately before Nuxt hydrates. Call in `<script setup>` — stripped from client build, serialized into HTML.

```ts
export function onPrehydrate(callback: (el: HTMLElement) => void): void
export function onPrehydrate(callback: string | ((el: HTMLElement) => void), key?: string): undefined | string
```

### `useAnnouncer`

Manual control over screen reader announcements. Unlike `useRouteAnnouncer` (automatic route changes), `useAnnouncer` is for in-page updates.

```ts
const { polite, assertive } = useAnnouncer()

async function submitForm() {
  try {
    await $fetch('/api/contact', { method: 'POST', body: formData })
    polite('Message sent successfully')
  } catch (error) {
    assertive('Error: Failed to send message')
  }
}
```

**Parameters:** `politeness` — `off`, `polite` (default), or `assertive`

**Methods:** `set(message, politeness)`, `polite(message)`, `assertive(message)`

### `useError`

Returns the global Nuxt error reactive state.

```ts
interface NuxtError<DataT = unknown> {
  status: number
  statusText?: string
  message: string
  data?: DataT
  cause?: unknown
  fatal: boolean
}

const error = useError()
if (error.value) {
  console.error('Nuxt error:', error.value)
}
```

### `useHydration`

Full control of hydration cycle — set and receive data from server.

```ts
export function useHydration<T>(key: string, get: () => T, set: (value: T) => void): void
```

```ts
export default defineNuxtPlugin((nuxtApp) => {
  const myStore = new MyStore()
  useHydration('myStoreState', () => myStore.getState(), data => myStore.setState(data))
})
```

### `useLayout`

Returns computed ref with layout resolved for current route (same chain as `<NuxtLayout>`): page's layout meta → `appLayout` from route rules → `'default'`.

```ts
const layout = useLayout()
// Use in template: <CommandPalette v-if="layout !== 'minimal'" />
```

### `useLazyAsyncData`

Wrapper around `useAsyncData` with `lazy: true` — navigation continues while data fetches.

```ts
const { status, data: posts } = await useLazyAsyncData('posts', () => $fetch('/api/posts'))
```

Check `status === 'pending'` and `status === 'error'` in template before using data.

### `useLazyFetch`

Wrapper around `useFetch` with `lazy: true` — navigation continues while data fetches.

```ts
const { status, data: posts } = await useLazyFetch('/api/posts')
```

Same return values as `useFetch`: `data`, `refresh`, `execute`, `error`, `status`, `clear`.

### `useNuxtData`

Access cached value of data-fetching composables by key.

```ts
export function useNuxtData<DataT = any>(key: string): { data: Ref<DataT | undefined> }
```

```ts
// Access cached data from parent route
const { data: posts } = useNuxtData('posts')
const { data } = useLazyFetch(`/api/posts/${route.params.id}`, {
  key: `post-${route.params.id}`,
  default() {
    return posts.value.find(post => post.id === route.params.id)
  },
})
```

Useful for optimistic updates and cascading data.

### `useRequestHeader`

Access a single incoming request header (singular version of `useRequestHeaders`).

```ts
const authorization = useRequestHeader('authorization')
```

### `useRuntimeHook`

Registers a runtime hook with automatic cleanup when scope is destroyed.

```ts
useRuntimeHook('page:start', () => {
  console.log('Page started')
})
```

**Parameters:** `name` (hook name), `fn` (callback). Auto-unregisters on scope destroy.

---

## `useRouteAnnouncer`

Observes page title changes and updates the announcer message accordingly. Used by `<NuxtRouteAnnouncer>` and controllable. Hooks into Unhead's `dom:rendered` hook to read the page's title and set it as the announcer message.

**Parameters:**
- `politeness`: `off`, `polite` (default), or `assertive`

**Properties:**
- `message`: `Ref<string>` — current announcer message
- `politeness`: `Ref<'off' | 'polite' | 'assertive'>` — current politeness level

**Methods:**
- `set(message, politeness = 'polite')`
- `polite(message)`
- `assertive(message)`

---

## `updateAppConfig`

Update the App Config at runtime.

```ts
import { updateAppConfig, useAppConfig } from '#imports'

const appConfig = useAppConfig() // { foo: 'bar' }
const newAppConfig = { foo: 'baz' }
updateAppConfig(newAppConfig)
console.log(appConfig) // { foo: 'baz' }
```

---

## Nuxt CLI Commands

### `nuxt dev`

Starts development server with HMR at `http://localhost:3000`.

```bash
npx nuxt dev
```

**Options:** `--cwd`, `--logLevel`, `--dotenv`, `--envName`, `--extends`, `--clear`, `--no-fork`, `-p/--port`, `-h/--host`, `--clipboard`, `-o/--open`, `--https`, `--publicURL`, `--qr`, `--public`, `--tunnel`, `--profile`, `--sslCert`, `--sslKey`

Sets `process.env.NODE_ENV` to `development`.

### `nuxt build`

Builds your Nuxt application for production.

```bash
npx nuxt build
```

**Options:** `--cwd`, `--logLevel`, `--prerender`, `--preset=<preset>`, `--dotenv`, `--envName`, `--extends`, `--profile`

Sets `process.env.NODE_ENV` to `production`.

### `nuxt generate`

Pre-renders every route and stores results in HTML files.

```bash
npx nuxt generate
```

**Options:** `--cwd`, `--logLevel`, `--preset`, `--dotenv`, `--envName`, `--extends`, `--profile`

### `nuxt preview`

Starts a server to preview your application after build.

```bash
npx nuxt preview
```

**Options:** `--cwd`, `--logLevel`, `--envName`, `--extends`, `-p/--port`, `--dotenv`

Sets `process.env.NODE_ENV` to `production`.

### `nuxt typecheck`

Runs `vue-tsc` to check types throughout your app.

```bash
npx nuxt typecheck
```

**Options:** `--cwd`, `--logLevel`, `--dotenv`, `--extends`

### `nuxt prepare`

Creates `.nuxt` directory and generates types.

```bash
npx nuxt prepare
```

**Options:** `--dotenv`, `--cwd`, `--logLevel`, `--envName`, `--extends`

### `nuxt analyze`

Analyzes the production bundle of your Nuxt application.

```bash
npx nuxt analyze
```

**Options:** `--cwd`, `--logLevel`, `--dotenv`, `--extends`, `--name=<name>`, `--no-serve`

### `nuxt info`

Logs information about the current or specified Nuxt project.

```bash
npx nuxt info
```

**Options:** `--cwd`

### `nuxt upgrade`

Upgrades Nuxt to the latest version.

```bash
npx nuxt upgrade
```

**Options:** `--cwd`, `--logLevel`, `--dedupe`, `-f/--force`, `-ch/--channel=<stable|nightly|v3|v4|v4-nightly|v3-nightly>`

### `nuxt cleanup`

Removes common generated Nuxt files and caches.

```bash
npx nuxt cleanup
```

**Options:** `--cwd`

### `nuxt devtools`

Enables or disables Nuxt DevTools on a per-project basis.

```bash
npx nuxt devtools [enable|disable]
```

**Arguments:** `COMMAND` (enable/disable), `ROOTDIR`

**Options:** `--cwd`

### `nuxt build-module`

Builds your Nuxt module before publishing. Uses `@nuxt/module-builder`.

```bash
npx nuxt build-module
```

**Options:** `--cwd`, `--logLevel`, `--build`, `--stub`, `--sourcemap`, `--prepare`

### `nuxt test`

Runs tests using `@nuxt/test-utils`.

```bash
npx nuxt test
```

**Options:** `--cwd`, `--logLevel`, `--dev`, `--watch`

Sets `process.env.NODE_ENV` to `test`.

### `nuxt module`

Search and add modules to your Nuxt application.

```bash
# Add a module
npx nuxt module add <MODULENAME> [--skipInstall] [--skipConfig] [--dev]

# Search modules
npx nuxt module search <QUERY> [--nuxtVersion=<2|3>]
```

Example: `npx nuxt module add pinia`

### `nuxt add`

Scaffolds an entity into your Nuxt application.

```bash
npx nuxt add <TEMPLATE> <NAME> [--force]
```

**Templates and examples:**
- `nuxt add component TheHeader` → `app/components/TheHeader.vue`
- `nuxt add composable foo` → `app/composables/foo.ts`
- `nuxt add layout custom` → `app/layouts/custom.vue`
- `nuxt add plugin analytics` → `app/plugins/analytics.ts`
- `nuxt add page about` → `app/pages/about.vue`
- `nuxt add page "category/[id]"` → `app/pages/category/[id].vue`
- `nuxt add middleware auth` → `app/middleware/auth.ts`
- `nuxt add api hello` → `server/api/hello.ts`
- `nuxt add layer subscribe` → `layers/subscribe/nuxt.config.ts`

**Modifiers:** `--client`, `--server`, `--global`, `--get`, `--post`, etc.

### `create nuxt`

Initializes a fresh Nuxt project.

```bash
npx create nuxt [DIR] [--template] [--force] [--offline] [--no-install] [--gitInit] [--packageManager] [--modules] [--nightly]
```

**Environment Variables:** `NUXI_INIT_REGISTRY` — custom template registry

---

## Nuxt Kit API

Nuxt Kit provides utilities for module authors via `@nuxt/kit`.

### Modules

#### `defineNuxtModule`

Defines a Nuxt module with auto-merged defaults, hooks, and setup function.

```ts
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'my-module', configKey: 'myModule' },
  defaults: { enabled: true },
  setup(options) {
    if (options.enabled) {
      console.log('My Nuxt module is enabled!')
    }
  },
})
```

**Definition properties:** `meta` (ModuleMeta), `defaults` (options or function), `schema`, `hooks` (Partial<NuxtHooks>), `moduleDependencies`, `setup` (resolved options + nuxt → void | false | install result)

#### `installModule`

Installs a Nuxt module programmatically. Useful when your module depends on other modules.

```ts
import { defineNuxtModule, installModule } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(options, nuxt) {
    await installModule('@nuxtjs/tailwindcss', { exposeConfig: true })
  },
})
```

### Plugins

#### `addPlugin`

Registers a Nuxt plugin and adds it to the plugins array.

```ts
import { addPlugin, createResolver } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)
addPlugin(resolver.resolve('./runtime/plugin'))
```

#### `addPluginTemplate`

Adds a template and registers it as a Nuxt plugin. Useful for plugins that generate code at build time.

### Components

#### `addComponent`

Registers a component to be automatically imported.

```ts
import { addComponent } from '@nuxt/kit'

addComponent({
  name: 'MyComponent',
  filePath: resolver.resolve('./runtime/MyComponent.vue'),
})
```

#### `addComponentsDir`

Registers a directory to be scanned for components. Components are imported only when used unless `global: true` is specified.

### Nitro

#### `addServerHandler`

Adds a Nitro server handler for server middleware or custom routes.

```ts
import { addServerHandler } from '@nuxt/kit'

addServerHandler({
  route: '/api/my-route',
  handler: resolver.resolve('./runtime/my-handler'),
})
```

#### `addDevServerHandler`

Adds a Nitro server handler only for development mode. Excluded from production build.

#### `useNitro`

Returns the Nitro instance. Must be called after Nitro is `ready`.

#### `addServerPlugin`

Adds a plugin to extend Nitro's runtime behavior. Uses `defineNitroPlugin` from `nitropack/runtime`.

#### `addPrerenderRoutes`

Adds routes to be prerendered to Nitro.

```ts
import { addPrerenderRoutes } from '@nuxt/kit'

addPrerenderRoutes('/about')
```

#### `addServerImports`

Adds imports to the server, making them available in Nitro without manual imports.

#### `addServerImportsDir`

Adds a directory to be scanned for auto-imports by Nitro.

#### `addServerScanDir`

Adds directories to be scanned by Nitro. Checks for subdirectories (`api`, `routes`, `middleware`, `utils`) like the `~/server` folder.

### Context

#### `useNuxt`

Gets the Nuxt instance from context. Throws an error if Nuxt is not available.

```ts
import { useNuxt } from '@nuxt/kit'

const nuxt = useNuxt()
```

#### `tryUseNuxt`

Gets the Nuxt instance from context. Returns `null` if Nuxt is not available (instead of throwing).

### Pages

#### `extendPages`

Extends and alters the pages configuration. Customize routes beyond what file-based routing generates.

```ts
import { extendPages } from '@nuxt/kit'

extendPages((pages) => {
  pages.push({
    name: 'my-page',
    path: '/my-page',
    file: resolver.resolve('./runtime/MyPage.vue'),
  })
})
```

#### `extendRouteRules`

Extends Nitro route rules for redirects, proxying, caching, and headers.

#### `addRouteMiddleware`

Registers route middlewares available for all routes or specific routes.

```ts
import { addRouteMiddleware } from '@nuxt/kit'

addRouteMiddleware({
  name: 'auth',
  path: resolver.resolve('./runtime/middleware/auth'),
  global: true,
})
```

### Layers

#### `getLayerDirectories`

Gets resolved directory paths for all layers in a Nuxt application. Provides structured access without directly accessing `nuxt.options._layers`.

```ts
import { getLayerDirectories } from '@nuxt/kit'

const layerDirs = getLayerDirectories(nuxt)
// Returns: string[] of resolved layer root directories
```

### Auto-imports

#### `addImports`

Adds imports to the Nuxt application, making them available without manual imports.

```ts
import { addImports } from '@nuxt/kit'

addImports([
  { name: 'useComposable', from: resolver.resolve('./runtime/composables') },
])
```

#### `addImportsDir`

Adds all imports from a directory to the Nuxt application. Automatically imports all files from the directory.

```ts
import { addImportsDir } from '@nuxt/kit'

addImportsDir(resolver.resolve('./runtime/composables'))
```

#### `addImportsSources`

Adds listed imports from a source to the Nuxt application.

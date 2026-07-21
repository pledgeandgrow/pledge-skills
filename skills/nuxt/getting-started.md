# Nuxt 4.x Getting Started

## Introduction

Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js.

### Automation and Conventions

Nuxt uses conventions and an opinionated directory structure to automate repetitive tasks:

- **File-based routing**: Routes defined by the structure of your `app/pages/` directory
- **Code splitting**: Automatic code splitting for reduced initial load time
- **Server-side rendering**: Built-in SSR capabilities without separate server setup
- **Auto-imports**: Vue composables and components auto-imported with tree-shaking
- **Data-fetching utilities**: SSR-compatible data fetching composables
- **Zero-config TypeScript**: Auto-generated types and `tsconfig.json`
- **Configured build tools**: Vite by default with HMR and production bundling

### Server-Side Rendering

Nuxt comes with built-in SSR by default, providing:

- Faster initial page load (fully rendered HTML sent to browser)
- Improved SEO (search engines can index HTML content immediately)
- Better performance on low-powered devices
- Better accessibility (content available on initial load)
- Easier caching (server-side page caching)

Nuxt supports `nuxt generate` for static hosting, `ssr: false` for CSR-only, and hybrid rendering via `routeRules`.

## Installation

### Prerequisites

- **Node.js**: 22.x or newer (active LTS recommended)
- **Text editor**: VS Code with Vue extension (Volar) or WebStorm
- **Terminal**: For running Nuxt commands

### Create a New Project

```bash
# npm
npm create nuxt@latest <project-name>

# yarn
yarn create nuxt <project-name>

# pnpm
pnpm create nuxt@latest <project-name>

# bun
bun create nuxt@latest <project-name>

# deno
deno -A npm:create-nuxt@latest <project-name>
```

### Development Server

```bash
npm run dev -- -o
# or
yarn dev --open
# or
pnpm dev -o
# or
bun run dev -o
```

Opens at `http://localhost:3000` (use `127.0.0.1:3000` on Windows for faster loading).

## Configuration

### Nuxt Configuration (`nuxt.config.ts`)

Located at the root of the project. Uses `defineNuxtConfig` (globally available):

```ts
export default defineNuxtConfig({
  // My Nuxt config
})
```

### App Configuration (`app.config.ts`)

Located in the `app/` directory. Exposes public variables determined at build time (cannot be overridden by env vars):

```ts
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: { primary: '#ff0000' },
  },
})
```

Accessed via `useAppConfig()`:

```vue
<script setup lang="ts">
const appConfig = useAppConfig()
</script>
```

### runtimeConfig vs. app.config

| Feature | `runtimeConfig` | `app.config` |
|---------|-----------------|--------------|
| When | Runtime (after build) | Build time |
| Env override | Yes (NUXT_ prefix) | No |
| Use case | Private/public tokens, API keys | Theme, title, non-sensitive config |

### External Configuration Files

Nuxt uses `nuxt.config.ts` as the single source of truth. External configs are managed within:

| Tool | External file | Nuxt config key |
|------|---------------|-----------------|
| Nitro | `nitro.config.ts` | `nitro` |
| PostCSS | `postcss.config.js` | `postcss` |
| Vite | `vite.config.ts` | `vite` |
| webpack | `webpack.config.ts` | `webpack` |
| TypeScript | `tsconfig.json` | `typescript` |
| ESLint | `eslint.config.js` | - |
| Vitest | `vitest.config.ts` | - |

## Directory Structure

### Root Directory

Contains `nuxt.config.ts` and is the project root.

### App Directory (`app/`)

Main application directory with subdirectories:

| Directory | Purpose |
|-----------|---------|
| `app/assets/` | Assets processed by build tool (Vite/webpack) |
| `app/components/` | Vue components (auto-imported) |
| `app/composables/` | Vue composables (auto-imported) |
| `app/layouts/` | Layout components wrapping pages |
| `app/middleware/` | Route middleware |
| `app/pages/` | File-based routing |
| `app/plugins/` | Vue plugins |
| `app/utils/` | Utility functions (auto-imported) |

Special files in `app/`:
- `app.config.ts` — Reactive app configuration
- `app.vue` — Root component
- `error.vue` — Error page

### Public Directory (`public/`)

Public files served at root, not modified by build (e.g., `robots.txt`, `favicon.ico`).

### Server Directory (`server/`)

Server-side code:

| Subdirectory | Purpose |
|--------------|---------|
| `server/api/` | API routes (prefixed with `/api`) |
| `server/routes/` | Server routes (no `/api` prefix) |
| `server/middleware/` | Server middleware (runs before routes) |
| `server/plugins/` | Nitro plugins |
| `server/utils/` | Server utilities |

### Other Directories

- `shared/` — Code shared between app and server
- `content/` — Nuxt Content module (file-based CMS)
- `modules/` — Local modules
- `layers/` — Reusable code layers (auto-registered)

### Nuxt Files

- `nuxt.config.ts` — Main configuration
- `.nuxtrc` — Alternative config syntax
- `.nuxtignore` — Files to ignore during build

## Routing

### Pages

Nuxt routing is based on vue-router, generating routes from `app/pages/` directory:

```
app/pages/
  about.vue       -> /about
  index.vue       -> /
  posts/
    [id].vue      -> /posts/:id
```

### Navigation

Use `<NuxtLink>` for client-side navigation (renders `<a>` tag, prefetches on viewport):

```vue
<template>
  <nav>
    <NuxtLink to="/about">About</NuxtLink>
    <NuxtLink to="/posts/1">Post 1</NuxtLink>
  </nav>
</template>
```

### Route Parameters

Access route details with `useRoute()`:

```vue
<script setup lang="ts">
const route = useRoute()
// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id)
</script>
```

### Route Middleware

Three kinds of route middleware:

1. **Anonymous (inline)**: Defined directly in pages
2. **Named**: Placed in `app/middleware/`, loaded via async import
3. **Global**: Placed in `app/middleware/` with `.global` suffix, runs on every route change

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (isAuthenticated() === false) {
    return navigateTo('/login')
  }
})
```

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

### Route Validation

Validate routes via `validate` in `definePageMeta()`:

```vue
<script setup lang="ts">
definePageMeta({
  validate(route) {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>
```

## Data Fetching

### The Need for useFetch and useAsyncData

Nuxt runs isomorphic code in both server and client. Using `$fetch` directly in setup can cause double-fetching (server for HTML render, client for hydration). `useFetch` and `useAsyncData` solve this by forwarding server data to client in the payload.

### useFetch

Wrapper around `useAsyncData` and `$fetch` for SSR-safe network calls:

```vue
<script setup lang="ts">
const { data: count } = await useFetch('/api/count')
</script>
<template>
  <p>Page visits: {{ count }}</p>
</template>
```

### useAsyncData

Wraps async logic for SSR compatibility. Use when you have a custom query layer:

```vue
<script setup lang="ts">
const { data, error } = await useAsyncData('users', () => myGetFunction('users'))
// Also possible without explicit key:
// const { data, error } = await useAsyncData(() => myGetFunction('users'))
</script>
```

Parallel requests:

```vue
<script setup lang="ts">
const { data: discounts, status } = await useAsyncData('cart-discount', async (_nuxtApp, { signal }) => {
  const [coupons, offers] = await Promise.all([
    $fetch('/cart/coupons', { signal }),
    $fetch('/cart/offers', { signal }),
  ])
  return { coupons, offers }
})
</script>
```

### Return Values

Both `useFetch` and `useAsyncData` return:

- `data`: Result of the async function
- `refresh`/`execute`: Function to refresh data
- `clear`: Sets data to undefined, error to undefined, status to idle
- `error`: Error object if fetching failed
- `status`: `"idle"`, `"pending"`, `"success"`, `"error"`

### Options

#### Lazy

By default, composables wait for resolution before navigating (via Vue's Suspense). Use `lazy: true` to skip this:

```vue
<script setup lang="ts">
const { status, data: posts } = useFetch('/api/posts', { lazy: true })
</script>
<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else>
    <div v-for="post in posts">{{ post }}</div>
  </div>
</template>
```

Convenience methods: `useLazyFetch` and `useLazyAsyncData`.

#### Client-only Fetching

```ts
const { status, data: comments } = useFetch('/api/comments', {
  lazy: true,
  server: false, // Only fetch on client-side
})
```

#### Minimize Payload Size

```ts
// Pick specific fields
const { data: mountain } = await useFetch('/api/mountains/everest', {
  pick: ['title', 'description'],
})

// Transform results
const { data: mountains } = await useFetch('/api/mountains', {
  transform: (mountains) => mountains.map(m => ({ title: m.title, description: m.description })),
})
```

### Caching and Refetching

#### Keys

- `useFetch` generates a key from URL, fetch options, and source location
- `useAsyncData` uses its first argument as key (or auto-generates from source location)
- Share data between components by using the same explicit key

#### Shared State and Option Consistency

When multiple components use the same key, they share `data`, `error`, and `status` refs. These options must be consistent: `handler`, `deep`, `transform`, `pick`, `getCachedData`, `default`.

Options that can safely differ: `server`, `lazy`, `immediate`, `dedupe`, `watch`.

#### Reactive Keys

```ts
const userId = ref('123')
const { data: user } = useAsyncData(
  computed(() => `user-${userId.value}`),
  () => fetchUser(userId.value),
)
// Data automatically refetches when userId changes
```

### $fetch

For client-only requests (event handlers, non-setup code):

```ts
async function handleFormSubmit() {
  const res = await $fetch('/api/submit', {
    method: 'POST',
    body: { /* form data */ },
  })
}
```

## State Management

### useState Composable

SSR-friendly shared state:

```vue
<script setup lang="ts">
const counter = useState('counter', () => Math.round(Math.random() * 1000))
</script>
<template>
  <div>
    Counter: {{ counter }}
    <button @click="counter++">+</button>
    <button @click="counter--">-</button>
  </div>
</template>
```

### Initializing State

Use `callOnce` with `app.vue` for async initialization:

```vue
<script setup lang="ts">
const websiteConfig = useState('config')
await callOnce(async () => {
  websiteConfig.value = await $fetch('https://my-cms.com/api/website-config')
})
</script>
```

### Using shallowRef

For large objects/arrays where deep reactivity is not needed:

```ts
const state = useState('my-shallow-state', () => shallowRef({ deep: 'not reactive' }))
```

### Usage with Pinia

```bash
npx nuxt module add pinia
```

```ts
export const useWebsiteStore = defineStore('websiteStore', {
  state: () => ({ name: '', description: '' }),
  actions: {
    async fetch() {
      const infos = await $fetch('https://api.nuxt.com/modules/pinia')
      this.name = infos.name
      this.description = infos.description
    },
  },
})
```

```vue
<script setup lang="ts">
const website = useWebsiteStore()
await callOnce(website.fetch)
</script>
```

### Third-Party Libraries

- **Pinia** — Official Vue recommendation
- **Harlem** — Immutable global state management
- **XState** — State machine approach

## Styling

### Local Stylesheets

Place in `app/assets/` directory. Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
})
```

### SFC Styling

Vue Single File Components support `<style>` blocks with scoped styles, CSS modules, and `v-bind` for dynamic styles:

```vue
<style scoped>
.title { color: red; }
</style>
```

### Using PostCSS

Nuxt has PostCSS built-in with pre-configured plugins (postcss-import, postcss-url, autoprefixer, cssnano):

```ts
export default defineNuxtConfig({
  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-media': {},
    },
  },
})
```

### Using Preprocessors

```vue
<style lang="scss">
/* Write SCSS here */
</style>
```

### Third-Party Libraries and Modules

- **UnoCSS** — Instant on-demand atomic CSS engine
- **Tailwind CSS** — Utility-first CSS framework
- **Fontaine** — Font metric fallback
- **Nuxt UI** — UI Library for modern web apps
- **Panda CSS** — CSS-in-JS engine generating atomic CSS at build time

## SEO and Meta

### Nuxt Config

Default tags in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'My App',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'description', content: 'My amazing site.' }],
    },
  },
})
```

### useHead

Programmatic head management with reactive input:

```vue
<script setup lang="ts">
useHead({
  title: 'My App',
  meta: [{ name: 'description', content: 'My amazing site.' }],
  bodyAttrs: { class: 'test' },
  script: [{ innerHTML: "console.log('Hello world')" }],
})
</script>
```

### useSeoMeta

Type-safe SEO meta tags:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site.',
  ogDescription: 'This is my amazing site.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
```

### Components

Head components: `<Title>`, `<Base>`, `<NoScript>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>`, `<Head>`:

```vue
<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
    </Head>
    <h1>{{ title }}</h1>
  </div>
</template>
```

### MetaObject Type

```ts
interface MetaObject {
  title?: string
  titleTemplate?: string | ((title?: string) => string)
  templateParams?: Record<string, string | Record<string, string>>
  base?: Base
  link?: Link[]
  meta?: Meta[]
  style?: Style[]
  script?: Script[]
  noscript?: Noscript[]
  htmlAttrs?: HtmlAttributes
  bodyAttrs?: BodyAttributes
}
```

## Error Handling

### Vue Errors

Hook into Vue errors with `onErrorCaptured` or `vue:error` hook:

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // handle error
  }
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // handle error
  })
})
```

### Startup Errors

`app:error` hook fires for errors during startup (plugins, SSR rendering, mounting).

### Error Utils

```ts
// useError - get global Nuxt error
const error = useError()

// createError - create error with metadata
throw createError({
  status: 404,
  statusText: 'Page Not Found',
})

// showError - trigger full-screen error page
showError('Something went wrong')

// clearError - clear current error
await clearError({ redirect: '/' })
```

### Error Page

Create `app/error.vue` for custom error page rendering.

## Deployment

### Node.js Server

Default output format. Loads only required chunks for optimal cold start:

```bash
nuxt build
node .output/server/index.mjs
```

Supports PM2 and cluster mode.

### Static Hosting

```bash
nuxt generate
```

Outputs to `.output/public/` for any static hosting. Emits `200.html` and `404.html` SPA fallbacks.

### Hosting Providers and Presets

```ts
export default defineNuxtConfig({
  nitro: { preset: 'node-server' },
})
```

Or via environment variable:

```bash
NITRO_PRESET=node-server nuxt build
```

Supported presets include Vercel, Netlify, Cloudflare, Vercel Edge, Deno, and more.

### CDN Proxy

Disable Cloudflare Rocket Loader and Email Address Obfuscation to prevent hydration errors.

## Components

### Auto-imported Components

Components in `app/components/` are auto-imported. Component names are based on path + filename with duplicate segments removed:

```
app/components/base/foo/Button.vue -> <BaseFooButton />
```

Set `pathPrefix: false` to use filename only:

```ts
export default defineNuxtConfig({
  components: [{ path: '~/components', pathPrefix: false }],
})
```

### Dynamic Components

Use `resolveComponent` or import from `#components`:

```vue
<script setup lang="ts">
import { SomeComponent } from '#components'
const MyButton = resolveComponent('MyButton')
</script>
<template>
  <component :is="clickable ? MyButton : 'div'" />
  <component :is="SomeComponent" />
</template>
```

### Dynamic Imports (Lazy Components)

Prefix with `Lazy` for code-splitting:

```vue
<LazyMountainsList v-if="show" />
```

### Delayed (Lazy) Hydration

Control when components become interactive using hydration strategies:
- `idle` — Hydrate when browser is idle
- `visible` — Hydrate when visible in viewport
- `media` — Hydrate based on media query

```vue
<LazyMyComponent hydrate-on-visible />
<LazyMyComponent hydrate-on-idle />
<LazyMyComponent hydrate-on-media="(max-width: 768px)" />
```

### Client Components

Add `.client` suffix for client-only rendering:

```
app/components/Comments.client.vue
```

### Server Components (Islands)

Add `.server` suffix for server-only rendering (requires `experimental.componentIslands`):

```ts
export default defineNuxtConfig({
  experimental: { componentIslands: true },
})
```

```vue
<HighlightedMarkdown markdown="# Headline" />
```

Server components support `nuxt-client` attribute for partial hydration:

```vue
<HighlightedMarkdown markdown="# Headline" />
<Counter nuxt-client :count="5" />
```

### Global Components

Place in `~/components/global/` or use `.global.vue` suffix. Each renders in a separate chunk.

### Component Extensions

Restrict file extensions:

```ts
export default defineNuxtConfig({
  components: [{ path: '~/components', extensions: ['.vue'] }],
})
```

## Composables

### Auto-imported Composables

Composables in `app/composables/` are auto-imported. Two export styles:

```ts
// Method 1: Named export
export const useFoo = () => useState('foo', () => 'bar')

// Method 2: Default export (name = camelCase of filename)
export default function () { return useState('foo', () => 'bar') }
```

Usage:

```vue
<script setup lang="ts">
const foo = useFoo()
</script>
```

Types are auto-generated in `.nuxt/imports.d.ts`. Run `nuxt prepare` to regenerate.

### Nested Composables

Composables can use other auto-imported composables. Access plugin injections via `useNuxtApp()`.

## Plugins

### Creating Plugins

```ts
export default defineNuxtPlugin((nuxtApp) => {
  // Plugin logic
})
```

### Registration Order

Prefix with numbers for ordering:

```
plugins/
  01.myPlugin.ts    // runs first
  02.myOtherPlugin.ts // runs second, can access 01's injections
```

### Object Syntax Plugins

```ts
export default defineNuxtPlugin({
  name: 'hello',
  setup() {
    return {
      provide: {
        hello: (msg: string) => `Hello ${msg}!`,
      },
    }
  },
})
```

### Providing Helpers

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  }
})
```

Usage in components:

```vue
<script setup lang="ts">
const { $hello } = useNuxtApp()
</script>
<template>
  <div>{{ $hello('world') }}</div>
</template>
```

### Typing Plugins

```ts
declare module '#app' {
  interface NuxtApp { $hello(msg: string): string }
}
declare module 'vue' {
  interface ComponentCustomProperties { $hello(msg: string): string }
}
export {}
```

### Vue Plugins

```ts
import VueGtag from 'vue-gtag-next'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, { property: { id: 'GA_MEASUREMENT_ID' } })
})
```

### Vue Directives

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) { el.focus() },
  })
})
```

### Loading Strategy

- **Parallel plugins**: Plugins without dependencies run in parallel
- **Plugins with dependencies**: Use numbered prefixes to ensure order

### Plugin Environments

Control where plugins run:

```ts
export default defineNuxtPlugin({
  name: 'my-plugin',
  setup() { /* ... */ },
  env: { islands: false }, // Skip in island components
})
```

## Pages

### Dynamic Routes

Square brackets create dynamic params. Double brackets for optional:

```
pages/users-[group]/[id].vue  -> /users-admins/123
pages/[[slug]].vue            -> / and /test
```

### Catch-all Routes

```
pages/[...slug].vue -> /hello/world (slug = ["hello", "world"])
```

### Nested Routes

```
pages/parent.vue
pages/parent/child.vue
```

Parent uses `<NuxtPage>` to render child:

```vue
<template>
  <div>
    <h1>Parent view</h1>
    <NuxtPage :foobar="123" />
  </div>
</template>
```

### Named Views (v4.5)

Use `name@view.vue` convention:

```
pages/parent/child.vue
pages/parent/child@sidebar.vue
```

```vue
<template>
  <div>
    <NuxtPage />
    <aside><NuxtPage name="sidebar" /></aside>
  </div>
</template>
```

### Route Groups

Folders in parentheses don't affect URL:

```
pages/(marketing)/about.vue  -> /about
pages/(marketing)/contact.vue -> /contact
```

### Page Metadata

```ts
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  keepalive: true,
  transition: true,
})
```

### Client-Only and Server-Only Pages

```
pages/admin.client.vue  // Client-only page
pages/report.server.vue // Server-only page
```

### Custom Routing

Override routes via `router.options.ts`:

```ts
import type { RouterConfig } from '@nuxt/schema'
export default {
  routes: _routes => [
    { name: 'home', path: '/', component: () => import('~/pages/home.vue') },
  ],
} satisfies RouterConfig
```

Or via `pages:extend` hook in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      pages.push({ name: 'profile', path: '/profile', file: '~/extra-pages/profile.vue' })
    },
  },
})
```

## Layouts

### Enabling Layouts

Add `<NuxtLayout>` to `app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### Default Layout

`app/layouts/default.vue`:

```vue
<template>
  <div>
    <p>Shared layout content</p>
    <slot />
  </div>
</template>
```

### Named Layouts

```vue
<script setup lang="ts">
definePageMeta({ layout: 'custom' })
</script>
```

Or dynamically:

```vue
<NuxtLayout :name="layout">
  <NuxtPage />
</NuxtLayout>
```

### Changing Layout Dynamically

```ts
function enableCustomLayout() {
  setPageLayout('custom')
}
definePageMeta({ layout: false })
```

### Layouts via Route Rules (v4.3)

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin': { appLayout: 'admin' },
    '/dashboard/**': { appLayout: 'dashboard' },
    '/landing': { appLayout: false },
  },
})
```

### Passing Props to Layouts (v4.4)

Via `definePageMeta`:

```ts
definePageMeta({
  layout: 'custom',
  layoutProps: { title: 'My Page' },
})
```

Via `setPageLayout`:

```ts
setPageLayout('custom', { title: 'My Page' })
```

## Middleware

### Route Middleware Types

1. **Anonymous (inline)**: Defined directly in `definePageMeta`
2. **Named**: Placed in `app/middleware/`, loaded via async import
3. **Global**: `.global.ts` suffix, runs on every route change

### Usage

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === '1') {
    return abortNavigation()
  }
  if (to.path !== '/') {
    return navigateTo('/')
  }
})
```

Return values:
- Nothing — continues navigation
- `navigateTo('/')` — redirects (302)
- `navigateTo('/', { redirectCode: 301 })` — permanent redirect
- `abortNavigation()` — stops navigation
- `abortNavigation(error)` — stops with error

### Middleware Order

1. Global middleware (alphabetical)
2. Page-defined middleware (array order)

### When Middleware Runs

On SSR/SSG, middleware runs on server then again on client. Skip with:

```ts
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return  // Skip on server
  if (import.meta.client) return  // Skip on client
  // Skip on initial client load
  const nuxtApp = useNuxtApp()
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
})
```

### Accessing Route in Middleware

Always use `to` and `from` parameters. **Never** use `useRoute()` in middleware.

### Adding Middleware Dynamically

```ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-test', () => {
    console.log('runs on every route change')
  }, { global: true })
  
  addRouteMiddleware('named-test', () => {
    console.log('named middleware')
  })
})
```

## Assets

### Public Directory

Files in `public/` served at root, not processed by build tool:

```
public/img/nuxt.png -> /img/nuxt.png
```

### Assets Directory

Files in `app/assets/` processed by Vite/webpack. Reference via `~/assets/`:

```vue
<template>
  <img src="~/assets/img/nuxt.png">
</template>
```

### Static vs Dynamic src

Static paths are rewritten by build tool (baseURL applied, hashed):

```vue
<!-- These work: build tool rewrites them -->
<img src="/img/nuxt.png">
<img src="~/assets/img/nuxt.png">
```

Dynamic paths are NOT rewritten:

```vue
<!-- This does NOT work: path built at runtime -->
<img :src="`~/assets/img/${name}.png`">
```

For dynamic bundled assets with Vite:

```ts
async function getImageUrl(name: string) {
  const image = await import(`./assets/img/${name}.png?url`)
  return image.default
}
```

For public assets, use computed:

```ts
const imageUrl = computed(() => `/img/${props.name}.png`)
```

## Shared Directory

Code shared between Vue app and Nitro server. Auto-imported in both contexts:

```ts
// shared/utils/capitalize.ts
export const capitalize = (input: string) => {
  return input[0] ? input[0].toUpperCase() + input.slice(1) : ''
}
```

Usage in app:

```vue
<script setup lang="ts">
const hello = capitalize('hello')
</script>
```

Usage in server:

```ts
export default defineEventHandler((event) => {
  return { hello: capitalize('hello') }
})
```

### Why Shared Code Can't Mix

Vue app code has access to browser APIs (DOM, window). Nitro server code has access to Node.js APIs (fs, process). The `shared/` directory is compiled separately for each environment.

## app.vue

The root component of your Nuxt application:

### Minimal Usage

```vue
<template>
  <NuxtPage />
</template>
```

### With Layouts

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### With Global Config

```vue
<script setup lang="ts">
useHead({ titleTemplate: '%s - My App' })
useSeoMeta({ ogType: 'website' })
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Layers

### Use Cases

- Share reusable configuration presets across projects
- Create component/composable libraries
- Create Nuxt module presets
- Share standard setup across projects
- Create Nuxt themes
- Implement modular architecture (DDD pattern)

### Usage

Auto-registered from `~/layers/` directory. Or via `extends` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    '../base',                          // Local layer
    '@my-themes/awesome',               // NPM package
    'github:my-themes/awesome#v1',      // Git repository
    ['github:my-themes/private', { auth: process.env.GITHUB_TOKEN }],
  ],
})
```

### Layer Priority

From highest to lowest:
1. Your project files (always highest)
2. Auto-scanned layers from `~/layers/` (alphabetical, Z > A)
3. Layers in `extends` config (first entry > second)

Control priority with numbered prefixes:

```
layers/
  1.base/       # Lowest priority
  2.features/   # Medium
  3.admin/      # Highest (among layers)
```

Or via `extends` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    '~~/layers/admin',    // highest
    '~~/layers/features',
    '~~/layers/base',     // lowest
  ],
})
```

### Named Layer Aliases

Auto-created for each layer: `#layers/test` -> `~/layers/test`

### Publishing Layers

Via git repository or npm package. Use starter template:

```bash
npx nuxi init layer-name -t layer
```

---

## Views

### app.vue

By default, Nuxt treats `app/app.vue` as the entrypoint and renders its content for every route.

```vue
<template>
  <div>
    <h1>Welcome to the homepage</h1>
  </div>
</template>
```

### Components

Components in `app/components/` are auto-imported — no explicit import needed.

```vue
<!-- app/components/AppAlert.vue -->
<template>
  <span><slot /></span>
</template>

<!-- Usage in any page/component -->
<template>
  <AppAlert>This is an auto-imported component.</AppAlert>
</template>
```

### Pages

Pages represent views for each specific route. Every file in `app/pages/` represents a different route. To use pages, create `app/pages/index.vue` and add `<NuxtPage />` to `app/app.vue`.

```vue
<!-- app/app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

### Layouts

Layouts are wrappers around pages with common UI (header, footer). `app/layouts/default.vue` is used by default. Custom layouts set via page metadata.

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
```

### Advanced: Extending the HTML Template

Use a Nitro plugin with `render:html` hook to mutate HTML before sending to client:

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    html.head.push(`<meta name="description" content="My custom description" />`)
  })
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    // Intercept the response
  })
})
```

---

## Transitions

### Page Transitions

Enable globally in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
```

Add CSS in `app.vue`:

```vue
<template>
  <NuxtPage />
</template>
<style>
.page-enter-active, .page-leave-active { transition: all 0.4s; }
.page-enter-from, .page-leave-to { opacity: 0; filter: blur(1rem); }
</style>
```

Per-page transition via `definePageMeta`:

```ts
definePageMeta({
  pageTransition: { name: 'rotate' },
})
```

### Layout Transitions

```ts
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
```

### Disable Transitions

Per route:

```ts
definePageMeta({
  pageTransition: false,
  layoutTransition: false,
})
```

Globally:

```ts
export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false,
  },
})
```

### JavaScript Hooks

For advanced transitions with animation libraries (e.g. GSAP):

```ts
definePageMeta({
  pageTransition: {
    name: 'custom-flip',
    mode: 'out-in',
    onBeforeEnter: (el) => console.log('Before enter...'),
    onEnter: (el, done) => {},
    onAfterEnter: (el) => {},
  },
})
```

### Dynamic Transitions

Use inline middleware for conditional transition names:

```ts
definePageMeta({
  pageTransition: { name: 'slide-right', mode: 'out-in' },
  middleware(to, from) {
    if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') {
      to.meta.pageTransition.name = +to.params.id > +from.params.id ? 'slide-left' : 'slide-right'
    }
  },
})
```

### Transition with NuxtPage

Configure transitions via `NuxtPage` prop:

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'bounce', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>
```

### View Transitions API (Experimental)

Enable native browser View Transitions:

```ts
export default defineNuxtConfig({
  experimental: {
    viewTransition: true, // or 'always' to ignore prefers-reduced-motion
  },
})
```

Override per page:

```ts
definePageMeta({
  viewTransition: false,
})
```

Disable globally and opt-in per page:

```ts
export default defineNuxtConfig({
  app: {
    viewTransition: false,
  },
})
```

---

## Server (Nitro)

### Powered by Nitro

Nuxt's server is Nitro — originally created for Nuxt, now part of UnJS. Built on h3 (minimal HTTP framework). Provides:
- Full control of server-side part of your app
- Universal deployment on any provider (many zero-config)
- Hybrid rendering

### Server Endpoints & Middleware

```ts
export default defineEventHandler(async (event) => {
  // Return text, json, html, or stream
  return { message: 'Hello' }
})
```

Supports HMR and auto-import like other Nuxt parts.

### Universal Deployment

Nitro offers 15+ presets for different providers:
- Cloudflare Workers
- Netlify Functions
- Vercel Cloud
- Deno, Bun runtimes

### Hybrid Rendering

`routeRules` for per-route rendering customization:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // Build-time prerender for SEO
    '/api/*': { cache: { maxAge: 60 * 60 } },  // Cache 1 hour
    '/old-page': { redirect: { to: '/new-page', statusCode: 302 } },
  },
})
```

Nuxt-specific route rules: `ssr`, `appMiddleware`, `noScripts`. Some rules (`appMiddleware`, `redirect`, `prerender`) also affect client-side behavior.

---

## Upgrade Guide

### Upgrading to Nuxt 4

```bash
npm install nuxt@^4.0.0
# or: yarn add nuxt@^4.0.0 / pnpm add nuxt@^4.0.0 / bun add nuxt@^4.0.0 / deno add npm:nuxt@^4.0.0
```

### New Directory Structure

Nuxt 4 defaults to a new `app/` directory structure:
- `srcDir` defaults to `app/`
- `serverDir` defaults to `<rootDir>/server`
- `layers/`, `modules/`, `public/` resolved relative to `<rootDir>`
- New `shared/` directory for code shared between Vue app and Nitro server

Migration steps:
1. Create `app/` directory
2. Move `assets/`, `components/`, `composables/`, `layouts/`, `middleware/`, `pages/`, `plugins/`, `utils/`, `app.vue`, `error.vue`, `app.config.ts` under `app/`
3. Keep `nuxt.config.ts`, `content/`, `layers/`, `modules/`, `public/`, `shared/`, `server/` in project root
4. Update third-party config files (tailwindcss, eslint) as needed

Automated migration:

```bash
npx codemod@latest nuxt/4/file-structure
```

### Key Nuxt 4 Changes

- **Singleton data fetching layer**: `useAsyncData`/`useFetch` share a single instance per key
- **Corrected module loading order in layers**
- **Normalized component names**: Dashed-case for `<NuxtLink>` etc.
- **Unhead v2**: Updated head management
- **New DOM location for SPA loading screen**
- **Parsed `error.data`**: Error data is now parsed
- **More granular inline styles**
- **Scan page meta after resolution**
- **Shared prerender data**
- **Default data and error values** in `useAsyncData`/`useFetch`
- **Shallow data reactivity** in `useAsyncData`/`useFetch`
- **Removal of `window.__NUXT__` object**
- **TypeScript configuration splitting**: Separate tsconfig files for app, server, shared
- **Removal of experimental features** now stable
- **Removal of top-level `generate` configuration**

### Testing Nuxt 5 (Opt-in)

Nuxt 5 features available via `future` config:

```ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5,
  },
})
```

Includes Vite Environment API migration, non-async `callHook`, client-only comment placeholders, stricter side-effect imports.

---

## `.env` File

Specifies build/dev-time environment variables. Automatically loaded at dev, build, and generate time.

```env
# .env
MY_ENV_VARIABLE=hello
```

### Dev, Build and Generate Time

Nuxt CLI has built-in dotenv support. If a `.env` file exists in the project root, it's automatically loaded. Variables are accessible within `nuxt.config` and modules.

### Custom File

Use a different env file via `--dotenv` flag:

```bash
npx nuxt dev --dotenv .env.local
```

When updating `.env` in development mode, Nuxt automatically restarts to apply new values.

### Production

After your server is built, `.env` files are **not** read. You must set environment variables explicitly:

```bash
NODE_ENV=production DATABASE_HOST=mydatabaseconnectionstring node .output/server/index.mjs
```

This ensures compatibility with serverless platforms and edge networks that may not have a traditional file system. Use `runtimeConfig` with `NUXT_` prefixed environment variables for production configuration.

---

## `package.json`

Contains all dependencies and scripts for your application. Nuxt uses the `nuxt` script command and respects standard npm/yarn/pnpm fields.

Key fields:
- **`scripts`**: Custom npm scripts (e.g., `"build": "nuxt build"`, `"dev": "nuxt dev"`)
- **`dependencies`**: Runtime dependencies including `nuxt` itself
- **`devDependencies`**: Build-time and development dependencies
- **`type`**: Set to `"module"` for ESM support

---

## `nuxt.config.ts` (Directory Structure)

The main configuration file for your Nuxt application. Uses `defineNuxtConfig` for type-safe configuration.

```ts
export default defineNuxtConfig({
  // All configuration options
})
```

Can also be `nuxt.config.js` or `nuxt.config.mjs`. The config file is auto-loaded from the project root directory.

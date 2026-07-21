# SvelteKit 2.x — Full Framework Guide

> Source: [Introduction](https://svelte.dev/docs/kit/introduction) | [Routing](https://svelte.dev/docs/kit/routing) | [Loading Data](https://svelte.dev/docs/kit/loading-data) | [Form Actions](https://svelte.dev/docs/kit/form-actions) | [Adapters](https://svelte.dev/docs/kit/adapters) | [Hooks](https://svelte.dev/docs/kit/hooks) | [Glossary](https://svelte.dev/docs/kit/glossary)

## Introduction

SvelteKit is a framework for building web apps with Svelte, powered by Vite. Similar to Next.js (React) or Nuxt (Vue).

- **Svelte** renders UI components
- **SvelteKit** adds routing, SSR, data loading, forms, adapters, and more

See: [Introduction](https://svelte.dev/docs/kit/introduction)

## Creating a Project

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

Editor setup: Svelte VS Code extension.

See: [Creating a Project](https://svelte.dev/docs/kit/creating-a-project)

## Project Types

SvelteKit can build: default SSR/SSG, static sites, SPAs, multi-page apps, serverless, custom servers, containers, libraries, offline apps, mobile apps, desktop apps, browser extensions, embedded devices.

See: [Project Types](https://svelte.dev/docs/kit/project-types)

## Project Structure

```
myapp/
├── src/
│   ├── routes/          # Filesystem-based routes
│   │   ├── +page.svelte
│   │   ├── +page.js
│   │   ├── +page.server.js
│   │   ├── +layout.svelte
│   │   ├── +layout.server.js
│   │   ├── +error.svelte
│   │   └── +server.js
│   ├── lib/             # Internal library ($lib alias)
│   ├── app.html         # HTML template
│   └── app.d.ts         # Type declarations
├── static/              # Static assets
├── tests/               # Test files
├── package.json
├── svelte.config.js     # SvelteKit config
├── tsconfig.json
└── vite.config.js
```

See: [Project Structure](https://svelte.dev/docs/kit/project-structure)

## Web Standards

SvelteKit uses standard Web APIs: `Request`, `Response`, `Headers`, `FormData`, `URL`, `URLSearchParams`, Streams, Web Crypto.

See: [Web Standards](https://svelte.dev/docs/kit/web-standards)

## Routing

Filesystem-based router in `src/routes/`:

- `src/routes/` → `/`
- `src/routes/about` → `/about`
- `src/routes/blog/[slug]` → `/blog/:slug`

### Route Files

| File | Description |
|------|-------------|
| `+page.svelte` | Page component |
| `+page.js` | Universal load function (client + server) |
| `+page.server.js` | Server-only load function + form actions |
| `+layout.svelte` | Layout component (wraps child pages) |
| `+layout.js` | Universal layout load |
| `+layout.server.js` | Server layout load |
| `+error.svelte` | Error page for this route |
| `+server.js` | API endpoint (GET, POST, etc.) |

Rules:
- All files can run on server
- All files run on client except `+server`
- `+layout` and `+error` apply to subdirectories

See: [Routing](https://svelte.dev/docs/kit/routing)

## Loading Data

`load` functions run before page render to fetch data.

### Universal vs Server

- `+page.js` (universal): Runs on both client and server
- `+page.server.js` (server): Runs only on server (can access secrets, DB)

```js
// +page.server.js
export async function load({ params, fetch, cookies }) {
	const res = await fetch(`/api/posts/${params.slug}`);
	const post = await res.json();
	return { post };
}
```

### Using URL Data

`load` receives: `url`, `route`, `params`, `fetch`, `cookies`, `headers`, `parent`, `depends`, `untrack`, `server`.

### Streaming with Promises

```js
export async function load({ fetch }) {
	const slowData = fetch('/api/slow').then(r => r.json());
	const fastData = await fetch('/api/fast').then(r => r.json());
	return { slowData, fastData }; // slowData streams
}
```

### Parallel Loading

Universal `load` functions run in parallel.

### Rerunning Load Functions

- Automatic: when URL params change or `invalidate()` is called
- `untrack(fn)`: Don't track dependencies
- `invalidate(url)` / `invalidateAll()`: Manually trigger reload

See: [Loading Data](https://svelte.dev/docs/kit/loading-data)

## Form Actions

POST data to server using `<form>`:

```js
// +page.server.js
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		// validate, save, etc.
		return { success: true };
	},
	login: async ({ request }) => {
		// named action: ?/login
	}
};
```

### Progressive Enhancement

```svelte
<form method="POST" use:enhance>
	<input name="name" />
	<button>Submit</button>
</form>
```

`use:enhance` from `$app/forms` adds progressive enhancement. Customizable with callback.

See: [Form Actions](https://svelte.dev/docs/kit/form-actions)

## Page Options

Export from `+page.js` or `+page.server.js`:

| Option | Description |
|--------|-------------|
| `prerender` | Pre-render at build time (`true`/`false`/`'auto'`) |
| `entries` | Prerender specific entries |
| `ssr` | Server-side rendering (`true`/`false`) |
| `csr` | Client-side rendering (`true`/`false`) |
| `trailingSlash` | `'always'`/`'never'`/`'ignore'` |
| `config` | Custom config for adapters |

See: [Page Options](https://svelte.dev/docs/kit/page-options)

## State Management

- Avoid shared state on server (shared across requests)
- Use context + stores/runes for component state
- `page.state` for page-level state
- Store state in URL (searchParams)
- Snapshots for ephemeral state (preserved on navigation)

See: [State Management](https://svelte.dev/docs/kit/state-management)

## Remote Functions (Experimental, 2.27+)

Type-safe client-server communication. Run on server, callable from client.

### query

```js
// +server.ts
import { query } from '$app/server';
export const getUser = query(async (id) => {
	return await db.users.find(id);
});
```

```svelte
<script>
	import { getUser } from './+page';
	let data = await getUser(userId);
</script>
```

- `query.batch`: Batch multiple queries
- `query.live`: Live queries with real-time updates

### form

Server-validated forms with type-safe fields.

### command

Mutations with single-flight pattern.

### Single-Flight Mutations

Prevents duplicate submissions. Server-driven and client-requested refreshes.

See: [Remote Functions](https://svelte.dev/docs/kit/remote-functions)

## Environment Variables

### Explicit (2.20+)

- `$env/static/private` — Build-time, server-only
- `$env/static/public` — Build-time, client + server
- `$env/dynamic/private` — Runtime, server-only
- `$env/dynamic/public` — Runtime, client + server

See: [Environment Variables](https://svelte.dev/docs/kit/environment-variables)

## Building Your App

```bash
npm run build
```

Two stages: Vite builds optimized production code, then adapter tunes for target.

See: [Building](https://svelte.dev/docs/kit/building-your-app)

## Adapters

| Adapter | Description |
|---------|-------------|
| `@sveltejs/adapter-auto` | Auto-detect platform (default) |
| `@sveltejs/adapter-node` | Node.js server |
| `@sveltejs/adapter-static` | Static site generation |
| `@sveltejs/adapter-spa` | Single-page app |
| `@sveltejs/adapter-cloudflare` | Cloudflare Pages/Workers |
| `@sveltejs/adapter-cloudflare-workers` | Cloudflare Workers |
| `@sveltejs/adapter-netlify` | Netlify |
| `@sveltejs/adapter-vercel` | Vercel |

### Zero-Config Deployments

`adapter-auto` detects platform from environment.

### Node Servers

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
export default { kit: { adapter: adapter() } };
```

Environment variables: `PORT`, `HOST`, `SOCKET_PATH`, `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT`, `SHUTDOWN_TIMEOUT`, `IDLE_TIMEOUT`, `KEEP_ALIVE_TIMEOUT`, `HEADERS_TIMEOUT`.

### Static Site Generation

```js
import adapter from '@sveltejs/adapter-static';
export default { kit: { adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined, precompress: false, strict: true }) } };
```

### Single-Page Apps

```js
import adapter from '@sveltejs/adapter-spa';
```

### Cloudflare

Options: `config`, `platformProxy`, `fallback`, `routes`. Runtime APIs, testing locally, headers/redirects, troubleshooting.

### Netlify

Options: Node version, Edge Functions, `_headers`/`_redirects`, Netlify Forms/Functions.

### Vercel

Options: deployment configuration, Image Optimization, ISR (expiration, bypassToken, allowQuery), environment variables, skew protection.

### Writing Adapters

Custom adapter implementing `adapt()` method.

See: [Adapters](https://svelte.dev/docs/kit/adapters) | [Node](https://svelte.dev/docs/kit/adapter-node) | [Static](https://svelte.dev/docs/kit/adapter-static) | [SPA](https://svelte.dev/docs/kit/adapter-spa) | [Cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare) | [Netlify](https://svelte.dev/docs/kit/adapter-netlify) | [Vercel](https://svelte.dev/docs/kit/adapter-vercel) | [Writing Adapters](https://svelte.dev/docs/kit/writing-adapters)

## Advanced Routing

- **Rest parameters**: `[...file]` captures multiple segments
- **Optional parameters**: `[[slug]]`
- **Matching**: `[param=matcher]` with custom matchers in `src/params/`
- **Sorting**: Routes sorted by specificity
- **Encoding**: URL encoding handling
- **Group layouts**: `(group)` directories don't affect URL
- **Breaking out of layouts**: `+page@(layout)` resets layout

See: [Advanced Routing](https://svelte.dev/docs/kit/advanced-routing)

## Hooks

Three optional files:
- `src/hooks.server.js` — Server hooks
- `src/hooks.client.js` — Client hooks
- `src/hooks.js` — Universal hooks

### Server Hooks

| Hook | Description |
|------|-------------|
| `handle({ event, resolve })` | Intercept every request, modify response |
| `handleFetch({ event, request, fetch })` | Intercept server-side fetch |
| `handleValidationError(event)` | Handle form validation errors |

### Shared Hooks

| Hook | Description |
|------|-------------|
| `handleError({ event, error })` | Handle unexpected errors |
| `init()` | Run when app starts |

### Universal Hooks

| Hook | Description |
|------|-------------|
| `reroute({ url })` | Rewrite URLs before routing |
| `transport({ request })` | Transport data across SSR boundary |

See: [Hooks](https://svelte.dev/docs/kit/hooks)

## Errors

- **Expected errors**: `error(status, message)` — e.g. 404
- **Unexpected errors**: Caught by `handleError`
- **Error objects**: `HttpError`, `Redirect`
- **Rendering errors**: `+error.svelte` page
- **Type safety**: `App.Error` interface

See: [Errors](https://svelte.dev/docs/kit/errors)

## Link Options

| Attribute | Description |
|-----------|-------------|
| `data-sveltekit-preload-data` | Preload data on hover/tap |
| `data-sveltekit-preload-code` | Preload code only |
| `data-sveltekit-reload` | Full page reload |
| `data-sveltekit-replacestate` | Replace history entry |
| `data-sveltekit-keepfocus` | Keep focus after navigation |
| `data-sveltekit-noscroll` | Don't scroll to top |

See: [Link Options](https://svelte.dev/docs/kit/link-options)

## Service Workers

`src/service-worker.js` or `src/service-worker.ts`. Manual registration available.

See: [Service Workers](https://svelte.dev/docs/kit/service-workers)

## Server-Only Modules

- `$env/static/private` / `$env/dynamic/private`
- `$lib/server` — Server-only utilities
- `$app/server` — Server functions

See: [Server-Only Modules](https://svelte.dev/docs/kit/server-only-modules)

## Snapshots

Preserve ephemeral state across navigations:

```js
// +page.svelte
export const snapshot = {
	collapsed: () => collapsed,
	restore: (value) => collapsed = value
};
```

See: [Snapshots](https://svelte.dev/docs/kit/snapshots)

## Shallow Routing

Update URL without full navigation. `pushState()` / `replaceState()` from `$app/navigation`.

See: [Shallow Routing](https://svelte.dev/docs/kit/shallow-routing)

## Observability

OpenTelemetry integration for tracing. Augment built-in tracing, `@opentelemetry/api`.

See: [Observability](https://svelte.dev/docs/kit/observability)

## Packaging

Build component libraries with `@sveltejs/package`:

```bash
npx sv-package
```

- `package.json`: name, license, files, exports, svelte, sideEffects
- TypeScript support, source maps
- Options: `dist`, `types`, `exports`

See: [Packaging](https://svelte.dev/docs/kit/packaging)

## Auth

- Sessions vs tokens
- Integration points: hooks, load functions, form actions
- Libraries: Lucia, Auth.js, Better Auth
- Guides for common patterns

See: [Auth](https://svelte.dev/docs/kit/auth)

## Performance

Out of the box: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

### Optimizing

- **Images**: Vite built-in handling, `@sveltejs/enhanced-img`, CDN loading
- **Videos**: Proper formats, lazy loading
- **Fonts**: `font-display: swap`, preload
- **Code size**: Svelte version, packages, external scripts, selective loading
- **Navigation**: Preloading, non-essential data, preventing waterfalls
- **Hosting**: CDN, edge

See: [Performance](https://svelte.dev/docs/kit/performance)

## Icons

CSS-based and Svelte-based icon approaches.

See: [Icons](https://svelte.dev/docs/kit/icons)

## Images

- Vite's built-in handling
- `@sveltejs/enhanced-img`: Setup, basic usage, dynamic choosing, `srcset`/`sizes`, per-image transforms
- CDN loading
- Best practices

See: [Images](https://svelte.dev/docs/kit/images)

## Accessibility

- Route announcements on navigation
- Focus management
- `lang` attribute
- Svelte's compile-time a11y checks

See: [Accessibility](https://svelte.dev/docs/kit/accessibility)

## SEO

- Out of the box: SSR, performance, normalized URLs
- Manual: `<title>`/`<meta>`, sitemaps, AMP

See: [SEO](https://svelte.dev/docs/kit/seo)

## FAQ

Common questions: what to build, package.json details, view transitions, database setup, client-side libraries, different backend, middleware, Yarn support, HMR.

See: [FAQ](https://svelte.dev/docs/kit/faq)

## Integrations

- `vitePreprocess`: Preprocess `<style>` and `<script>` tags
- Add-ons: `npx sv add` for ESLint, Prettier, TailwindCSS, etc.
- `svelte-preprocess` (legacy)
- Vite plugins
- Integration FAQs

See: [Integrations](https://svelte.dev/docs/kit/integrations)

## Breakpoint Debugging

VS Code launch config, Chrome/Edge DevTools, other editors.

See: [Breakpoint Debugging](https://svelte.dev/docs/kit/breakpoint-debugging)

## Migrating to SvelteKit v2

Key changes: `redirect`/`error` no longer thrown, cookie path required, top-level promises not awaited, `goto()` changes, relative paths, server fetches not trackable, `preloadCode` needs base prefix, `resolvePath` removed, improved error handling, dynamic env vars in prerendering, `use:enhance` callback changes, multipart form data for file inputs, stricter tsconfig, `vitePreprocess` moved, `$app/stores` deprecated (2.12+).

```bash
npx sv migrate sveltekit-2
```

See: [SvelteKit v2 Migration](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)

## Migrating from Sapper

package.json changes, project files, pages/layouts, endpoints, integrations.

See: [Sapper Migration](https://svelte.dev/docs/kit/migrating-from-sapper)

## Glossary

| Term | Description |
|------|-------------|
| CSR | Client-side rendering |
| Edge | Edge computing (near user) |
| Hybrid app | Mix of SSR and CSR |
| Hydration | Making SSR HTML interactive |
| ISR | Incremental Static Regeneration |
| MPA | Multi-page app |
| Prerendering | Generate static HTML at build time |
| PWA | Progressive Web App |
| Routing | URL-to-page mapping |
| SPA | Single-page app |
| SSG | Static Site Generation |
| SSR | Server-side rendering |

See: [Glossary](https://svelte.dev/docs/kit/glossary)

**Source**: [Introduction](https://svelte.dev/docs/kit/introduction) | [Creating a Project](https://svelte.dev/docs/kit/creating-a-project) | [Project Types](https://svelte.dev/docs/kit/project-types) | [Project Structure](https://svelte.dev/docs/kit/project-structure) | [Web Standards](https://svelte.dev/docs/kit/web-standards) | [Routing](https://svelte.dev/docs/kit/routing) | [Loading Data](https://svelte.dev/docs/kit/loading-data) | [Form Actions](https://svelte.dev/docs/kit/form-actions) | [Page Options](https://svelte.dev/docs/kit/page-options) | [State Management](https://svelte.dev/docs/kit/state-management) | [Remote Functions](https://svelte.dev/docs/kit/remote-functions) | [Environment Variables](https://svelte.dev/docs/kit/environment-variables) | [Building](https://svelte.dev/docs/kit/building-your-app) | [Adapters](https://svelte.dev/docs/kit/adapters) | [Node](https://svelte.dev/docs/kit/adapter-node) | [Static](https://svelte.dev/docs/kit/adapter-static) | [SPA](https://svelte.dev/docs/kit/adapter-spa) | [Cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare) | [Cloudflare Workers](https://svelte.dev/docs/kit/adapter-cloudflare-workers) | [Netlify](https://svelte.dev/docs/kit/adapter-netlify) | [Vercel](https://svelte.dev/docs/kit/adapter-vercel) | [Writing Adapters](https://svelte.dev/docs/kit/writing-adapters) | [Advanced Routing](https://svelte.dev/docs/kit/advanced-routing) | [Hooks](https://svelte.dev/docs/kit/hooks) | [Errors](https://svelte.dev/docs/kit/errors) | [Link Options](https://svelte.dev/docs/kit/link-options) | [Service Workers](https://svelte.dev/docs/kit/service-workers) | [Server-Only Modules](https://svelte.dev/docs/kit/server-only-modules) | [Snapshots](https://svelte.dev/docs/kit/snapshots) | [Shallow Routing](https://svelte.dev/docs/kit/shallow-routing) | [Observability](https://svelte.dev/docs/kit/observability) | [Packaging](https://svelte.dev/docs/kit/packaging) | [Auth](https://svelte.dev/docs/kit/auth) | [Performance](https://svelte.dev/docs/kit/performance) | [Icons](https://svelte.dev/docs/kit/icons) | [Images](https://svelte.dev/docs/kit/images) | [Accessibility](https://svelte.dev/docs/kit/accessibility) | [SEO](https://svelte.dev/docs/kit/seo) | [FAQ](https://svelte.dev/docs/kit/faq) | [Integrations](https://svelte.dev/docs/kit/integrations) | [Breakpoint Debugging](https://svelte.dev/docs/kit/breakpoint-debugging) | [SvelteKit v2 Migration](https://svelte.dev/docs/kit/migrating-to-sveltekit-2) | [Sapper Migration](https://svelte.dev/docs/kit/migrating-from-sapper) | [Glossary](https://svelte.dev/docs/kit/glossary)

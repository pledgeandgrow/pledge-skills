# SvelteKit 2.x — API Reference, sv CLI & AI Tools

> Source: [@sveltejs/kit](https://svelte.dev/docs/kit/@sveltejs-kit) | [@sveltejs/kit/hooks](https://svelte.dev/docs/kit/@sveltejs-kit-hooks) | [@sveltejs/kit/node](https://svelte.dev/docs/kit/@sveltejs-kit-node) | [@sveltejs/kit/vite](https://svelte.dev/docs/kit/@sveltejs-kit-vite) | [$app/*](https://svelte.dev/docs/kit/$app-environment) | [$env/*](https://svelte.dev/docs/kit/$env-dynamic-private) | [$lib](https://svelte.dev/docs/kit/$lib) | [$service-worker](https://svelte.dev/docs/kit/$service-worker) | [Configuration](https://svelte.dev/docs/kit/configuration) | [CLI](https://svelte.dev/docs/kit/cli) | [Types](https://svelte.dev/docs/kit/types) | [sv CLI](https://svelte.dev/docs/cli/overview) | [AI Tools](https://svelte.dev/docs/ai/overview)

## @sveltejs/kit

### Functions

| Export | Description |
|--------|-------------|
| `error(status, body)` | Throw an HttpError with status and body |
| `fail(status, data)` | Return an ActionFailure (form action validation error) |
| `redirect(status, location)` | Throw a Redirect (300-308) |
| `json(data, init)` | Return JSON response |
| `text(data, init)` | Return text response |
| `isActionFailure(value)` | Check if value is an ActionFailure |
| `isHttpError(value)` | Check if value is an HttpError |
| `isRedirect(value)` | Check if value is a Redirect |
| `isValidationError(value)` | Check if value is a validation error |
| `normalizeUrl(url)` | Normalize a URL |
| `VERSION` | Current SvelteKit version |

### Types

`Server`, `Adapter`, `Action`, `ActionFailure`, `ActionResult`, `Actions`, `AfterNavigate`, `AwaitedActions`, `BeforeNavigate`, `Builder`, `ClientInit`, `Config`, `Cookies`, `Emulator`, `EnvVarConfig`, `Handle`, `HandleClientError`, `HandleFetch`, `HandleServerError`, `HandleValidationError`, `HttpError`, `InvalidField`, `KitConfig`, `LessThan`, `LiveQueryRequestedResult`, `LiveRequestedEntry`, `Load`, `LoadEvent`, `LoadProperties`, `Logger`, `MaybePromise`, `Navigation`, `NavigationBase`, `NavigationEnter`, `NavigationEvent`, `NavigationExternal`, `NavigationFormSubmit`, `NavigationGoto`, `NavigationLeave`, `NavigationLink`, `NavigationPopState`, `NavigationTarget`, `NavigationType`, `NumericRange`, `OnNavigate`, `Page`, `ParamMatcher`, `PrerenderOption`, `QueryRequestedResult`, `Redirect`, `RemoteCommand`, `RemoteForm`, `RemoteFormEnhanceCallback`, `RemoteFormEnhanceInstance`, `RemoteFormField`, `RemoteFormFieldType`, `RemoteFormFieldValue`, `RemoteFormFields`, `RemoteFormInput`, `RemoteFormIssue`, `RemoteLiveQuery`, `RemoteLiveQueryFunction`, `RemotePrerenderFunction`, `RemoteQuery`, `RemoteQueryFunction`, `RemoteQueryOverride`, `RemoteQueryUpdate`, `RemoteResource`, `RequestEvent`, `RequestHandler`, `RequestedEntry`, `RequestedResult`, `Reroute`, `ResolveOptions`, `RouteDefinition`, `SSRManifest`, `ServerInit`, `ServerInitOptions`, `ServerLoad`, `ServerLoadEvent`, `Snapshot`, `SubmitFunction`, `Transport`, `Transporter`, `ValidationError`, `Csp`, `CspDirectives`, `DeepPartial`, `HttpMethod`, `Prerendered`, `RequestOptions`, `RouteSegment`, `TrailingSlash`

See: [@sveltejs/kit](https://svelte.dev/docs/kit/@sveltejs-kit)

## @sveltejs/kit/hooks

| Export | Description |
|--------|-------------|
| `sequence(...handlers)` | Chain multiple `handle` hooks |
| `defineEnvVars(config)` | Define explicit environment variables |

See: [@sveltejs/kit/hooks](https://svelte.dev/docs/kit/@sveltejs-kit-hooks)

## @sveltejs/kit/node

| Export | Description |
|--------|-------------|
| `getRequest(event)` | Convert web Request to Node request |
| `setResponse(event, response)` | Set response from web Response |
| `createReadableStream(stream)` | Create a readable stream |

## @sveltejs/kit/node/polyfills

| Export | Description |
|--------|-------------|
| `installPolyfills()` | Install Node.js polyfills for edge environments |

See: [@sveltejs/kit/node](https://svelte.dev/docs/kit/@sveltejs-kit-node)

## @sveltejs/kit/vite

| Export | Description |
|--------|-------------|
| `sveltekit(options)` | Vite plugin for SvelteKit |

See: [@sveltejs/kit/vite](https://svelte.dev/docs/kit/@sveltejs-kit-vite)

## $app/environment

| Export | Description |
|--------|-------------|
| `browser` | `true` in browser, `false` on server |
| `building` | `true` during build |
| `dev` | `true` in development |
| `version` | App version from config |

See: [$app/environment](https://svelte.dev/docs/kit/$app-environment) | [$app/env](https://svelte.dev/docs/kit/$app-env)

## $app/env/private & $app/env/public

Explicit environment variable aliases (when enabled).

See: [$app/env/private](https://svelte.dev/docs/kit/$app-env-private) | [$app/env/public](https://svelte.dev/docs/kit/$app-env-public)

## $app/forms

| Export | Description |
|--------|-------------|
| `applyAction(result)` | Apply an ActionResult to the page |
| `deserialize(data)` | Deserialize form action response |
| `enhance(form, submitFunction?)` | Progressive enhancement for forms |

See: [$app/forms](https://svelte.dev/docs/kit/$app-forms)

## $app/navigation

| Export | Description |
|--------|-------------|
| `afterNavigate(callback)` | Run after navigation completes |
| `beforeNavigate(callback)` | Run before navigation starts |
| `disableScrollHandling()` | Disable automatic scroll |
| `goto(url, options?)` | Programmatic navigation |
| `invalidate(url)` | Invalidate specific dependency |
| `invalidateAll()` | Invalidate all dependencies |
| `onNavigate(callback)` | Run on every navigation |
| `preloadCode(path)` | Preload code for a route |
| `preloadData(path)` | Preload data for a route |
| `pushState(state, url)` | Shallow routing — push state |
| `refreshAll()` | Refresh all data |
| `replaceState(state, url)` | Shallow routing — replace state |

See: [$app/navigation](https://svelte.dev/docs/kit/$app-navigation)

## $app/paths

| Export | Description |
|--------|-------------|
| `base` | Base path |
| `assets` | Assets directory |
| `asset(path)` | Resolve asset path |
| `match(routeId)` | Match route |
| `resolve(path)` | Resolve path |
| `resolveRoute(routeId, params)` | Resolve route with params |

See: [$app/paths](https://svelte.dev/docs/kit/$app-paths)

## $app/server

| Export | Description |
|--------|-------------|
| `command(name)` | Define a remote command |
| `form(schema)` | Define a remote form |
| `query(fn)` | Define a remote query |
| `prerender(fn)` | Define prerender function |
| `read(path)` | Read file (server-only) |
| `requested(fn)` | Define requested function |
| `getRequestEvent()` | Get current request event |

See: [$app/server](https://svelte.dev/docs/kit/$app-server)

## $app/state

| Export | Description |
|--------|-------------|
| `navigating` | Current navigation state (from/to/type) |
| `page` | Current page state (url/params/data/status/error) |
| `updated` | `true` if service worker has updated |

See: [$app/state](https://svelte.dev/docs/kit/$app-state)

## $app/stores

> Deprecated since 2.12 — use `$app/state` instead.

| Export | Description |
|--------|-------------|
| `page` | Readable store with page info |
| `navigating` | Readable store with navigation info |
| `updated` | Readable store for SW updates |
| `getStores()` | Get all stores |

See: [$app/stores](https://svelte.dev/docs/kit/$app-stores)

## $app/types

Generated types: `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams`, `LayoutParams`

See: [$app/types](https://svelte.dev/docs/kit/$app-types)

## $env/dynamic/private & $env/dynamic/public

Runtime environment variables (read at request time).

See: [$env/dynamic/private](https://svelte.dev/docs/kit/$env-dynamic-private) | [$env/dynamic/public](https://svelte.dev/docs/kit/$env-dynamic-public)

## $env/static/private & $env/static/public

Build-time environment variables (baked into the build).

See: [$env/static/private](https://svelte.dev/docs/kit/$env-static-private) | [$env/static/public](https://svelte.dev/docs/kit/$env-static-public)

## $lib

Alias for `src/lib` directory.

See: [$lib](https://svelte.dev/docs/kit/$lib)

## $service-worker

| Export | Description |
|--------|-------------|
| `base` | Base path |
| `build` | Build output directory |
| `files` | Static files |
| `prerendered` | Prerendered pages |
| `version` | App version |

See: [$service-worker](https://svelte.dev/docs/kit/$service-worker)

## Configuration

`svelte.config.js` or via `sveltekit()` Vite plugin:

```js
import adapter from '@sveltejs/adapter-auto';
const config = {
	kit: {
		adapter: adapter(),
		alias: {},
		appDir: '_app',
		csp: {},
		csrf: {},
		embedded: false,
		env: {},
		experimental: {},
		files: {},
		inlineStyleThreshold: 0,
		moduleExtensions: [],
		outDir: '.svelte-kit',
		output: {},
		paths: {},
		prerender: {},
		router: true,
		serviceWorker: {},
		typescript: {},
		version: {}
	}
};
export default config;
```

See: [Configuration](https://svelte.dev/docs/kit/configuration)

## CLI

### svelte-kit sync

Generates `tsconfig.json` and types. Run automatically, but can be invoked manually:

```bash
npx svelte-kit sync
```

See: [CLI](https://svelte.dev/docs/kit/cli)

## Types

### Generated Types

Auto-generated in `.svelte-kit/`. Default `tsconfig.json` extends `./.svelte-kit/tsconfig.json`.

### app.d.ts

```ts
declare global {
	namespace App {
		interface Error {}
		interface Locals {}
		interface PageData {}
		interface PageState {}
		interface Platform {}
	}
}
```

### $lib

`$lib` → `src/lib`. `$lib/server` → `src/lib/server` (server-only).

See: [Types](https://svelte.dev/docs/kit/types)

## sv CLI

The `sv` CLI is a toolkit for creating and maintaining Svelte applications.

### sv create

```bash
npx sv create myapp
```

Options: `--template`, `--types`, `--add`, `--no-add-ons`, `--install`, `--no-install`, `--no-dir-check`, `--from-playground`

See: [sv create](https://svelte.dev/docs/cli/sv-create)

### sv add

```bash
npx sv add tailwindcss
```

Options: `-C/--cwd`, `--no-git-check`, `--no-download-check`, `--install`, `--no-install`

**Official add-ons**: better-auth, drizzle, eslint, experimental, mcp, mdsvex, paraglide, playwright, prettier, storybook, sveltekit-adapter, tailwindcss, vitest

**Community add-ons**: Listed via `npx sv add`

See: [sv add](https://svelte.dev/docs/cli/sv-add)

### sv check

```bash
npx sv check
```

Options: `--workspace`, `--output`, `--watch`, `--tsconfig`, `--no-tsconfig`, `--ignore`, `--fail-on-warnings`, `--compiler-warnings`, `--threshold`

See: [sv check](https://svelte.dev/docs/cli/sv-check)

### sv migrate

```bash
npx sv migrate svelte-5
```

Migrations: `app-state`, `svelte-5`, `self-closing-tags`, `svelte-4`, `sveltekit-2`, `package`, `routes`

See: [sv migrate](https://svelte.dev/docs/cli/sv-migrate)

### Add-on Details

| Add-on | Description |
|--------|-------------|
| **better-auth** | Framework-agnostic auth library. Options: `demo` |
| **drizzle** | ORM for TypeScript. Options: `database`, `client`, `docker` |
| **eslint** | Linting with eslint-plugin-svelte |
| **experimental** | Enable experimental Svelte features. Options: `versions`, `features` |
| **mcp** | MCP server for AI tools. Options: `ide`, `setup` |
| **mdsvex** | Markdown in Svelte components |
| **paraglide** | i18n with Paraglide. Options: `languageTags`, `demo` |
| **playwright** | E2E testing with Playwright |
| **prettier** | Code formatting with prettier-plugin-svelte |
| **storybook** | Component development with Storybook |
| **sveltekit-adapter** | Configure deployment adapter. Options: `adapter`, `cloudflare target` |
| **tailwindcss** | Utility-first CSS. Options: `plugins` |
| **vitest** | Unit testing with Vitest. Options: `usages` |

See: [better-auth](https://svelte.dev/docs/cli/better-auth) | [drizzle](https://svelte.dev/docs/cli/drizzle) | [eslint](https://svelte.dev/docs/cli/eslint) | [experimental](https://svelte.dev/docs/cli/experimental) | [mcp](https://svelte.dev/docs/cli/mcp) | [mdsvex](https://svelte.dev/docs/cli/mdsvex) | [paraglide](https://svelte.dev/docs/cli/paraglide) | [playwright](https://svelte.dev/docs/cli/playwright) | [prettier](https://svelte.dev/docs/cli/prettier) | [storybook](https://svelte.dev/docs/cli/storybook) | [sveltekit-adapter](https://svelte.dev/docs/cli/sveltekit-adapter) | [tailwindcss](https://svelte.dev/docs/cli/tailwindcss) | [vitest](https://svelte.dev/docs/cli/vitest)

### Create Your Own Add-on

- Quick start, project structure, development, testing
- Publishing: bundling, `package.json`, entry points, npm publish
- `defineAddon()`, `defineAddonOptions()`, `create()`, `add()`
- sv-utils: `transforms.script`, `transforms.svelte`, `transforms.svelteScript`, `transforms.css`, `transforms.json`, `transforms.yaml`/`transforms.toml`, `transforms.text`
- `svelteConfig.edit`/`svelteConfig.find`/`svelteConfig.read`
- Package manager helpers

See: [Create Your Own](https://svelte.dev/docs/cli/create-your-own) | [sv](https://svelte.dev/docs/cli/sv) | [sv-utils](https://svelte.dev/docs/cli/sv-utils)

## AI Tools

Official AI tools from the Svelte team:

- **Instructions**: Small prompt injected into AI sessions
- **MCP Server**: Tools, prompts, resources from official Svelte docs
- **Skills**: Lazy-loaded best-practice descriptions
- **Subagents**: Focused agents for atomic operations

### MCP Server

Tools: `list-sections`, `get-documentation`, `svelte-autofixer`, `playground-link`

### CLI

```bash
npx @sveltejs/mcp list-sections
npx @sveltejs/mcp get-documentation
npx @sveltejs/mcp svelte-autofixer
```

### Code Writer

`svelte-code-writer` — analyzes inline code, analyzes files, targets Svelte 4/5 best practices.

### Client Setup

- **Claude Code**: Installation instructions
- **OpenCode**: Installation + configuration
- **Cursor**: Installation
- **GitHub Copilot CLI**: Installation
- **Codex CLI**: Installation

See: [AI Tools Overview](https://svelte.dev/docs/ai/overview) | [Instructions](https://svelte.dev/docs/ai/instructions) | [MCP](https://svelte.dev/docs/ai/mcp) | [Skills](https://svelte.dev/docs/ai/skills) | [Subagents](https://svelte.dev/docs/ai/subagent) | [CLI](https://svelte.dev/docs/ai/cli) | [Code Writer](https://svelte.dev/docs/ai/code-writer) | [Claude Code](https://svelte.dev/docs/ai/claude-code) | [OpenCode](https://svelte.dev/docs/ai/opencode) | [Cursor](https://svelte.dev/docs/ai/cursor) | [GitHub Copilot CLI](https://svelte.dev/docs/ai/github-copilot-cli) | [Codex CLI](https://svelte.dev/docs/ai/codex-cli)

**Source**: [@sveltejs/kit](https://svelte.dev/docs/kit/@sveltejs-kit) | [@sveltejs/kit/hooks](https://svelte.dev/docs/kit/@sveltejs-kit-hooks) | [@sveltejs/kit/node](https://svelte.dev/docs/kit/@sveltejs-kit-node) | [@sveltejs/kit/node/polyfills](https://svelte.dev/docs/kit/@sveltejs-kit-node-polyfills) | [@sveltejs/kit/vite](https://svelte.dev/docs/kit/@sveltejs-kit-vite) | [$app/environment](https://svelte.dev/docs/kit/$app-environment) | [$app/env](https://svelte.dev/docs/kit/$app-env) | [$app/env/private](https://svelte.dev/docs/kit/$app-env-private) | [$app/env/public](https://svelte.dev/docs/kit/$app-env-public) | [$app/forms](https://svelte.dev/docs/kit/$app-forms) | [$app/navigation](https://svelte.dev/docs/kit/$app-navigation) | [$app/paths](https://svelte.dev/docs/kit/$app-paths) | [$app/server](https://svelte.dev/docs/kit/$app-server) | [$app/state](https://svelte.dev/docs/kit/$app-state) | [$app/stores](https://svelte.dev/docs/kit/$app-stores) | [$app/types](https://svelte.dev/docs/kit/$app-types) | [$env/dynamic/private](https://svelte.dev/docs/kit/$env-dynamic-private) | [$env/dynamic/public](https://svelte.dev/docs/kit/$env-dynamic-public) | [$env/static/private](https://svelte.dev/docs/kit/$env-static-private) | [$env/static/public](https://svelte.dev/docs/kit/$env-static-public) | [$lib](https://svelte.dev/docs/kit/$lib) | [$service-worker](https://svelte.dev/docs/kit/$service-worker) | [Configuration](https://svelte.dev/docs/kit/configuration) | [CLI](https://svelte.dev/docs/kit/cli) | [Types](https://svelte.dev/docs/kit/types) | [sv CLI](https://svelte.dev/docs/cli/overview) | [sv create](https://svelte.dev/docs/cli/sv-create) | [sv add](https://svelte.dev/docs/cli/sv-add) | [sv check](https://svelte.dev/docs/cli/sv-check) | [sv migrate](https://svelte.dev/docs/cli/sv-migrate) | [better-auth](https://svelte.dev/docs/cli/better-auth) | [drizzle](https://svelte.dev/docs/cli/drizzle) | [eslint](https://svelte.dev/docs/cli/eslint) | [experimental](https://svelte.dev/docs/cli/experimental) | [mcp](https://svelte.dev/docs/cli/mcp) | [mdsvex](https://svelte.dev/docs/cli/mdsvex) | [paraglide](https://svelte.dev/docs/cli/paraglide) | [playwright](https://svelte.dev/docs/cli/playwright) | [prettier](https://svelte.dev/docs/cli/prettier) | [storybook](https://svelte.dev/docs/cli/storybook) | [sveltekit-adapter](https://svelte.dev/docs/cli/sveltekit-adapter) | [tailwindcss](https://svelte.dev/docs/cli/tailwindcss) | [vitest](https://svelte.dev/docs/cli/vitest) | [create-your-own](https://svelte.dev/docs/cli/create-your-own) | [sv](https://svelte.dev/docs/cli/sv) | [sv-utils](https://svelte.dev/docs/cli/sv-utils) | [AI Overview](https://svelte.dev/docs/ai/overview) | [Instructions](https://svelte.dev/docs/ai/instructions) | [MCP](https://svelte.dev/docs/ai/mcp) | [Skills](https://svelte.dev/docs/ai/skills) | [Subagents](https://svelte.dev/docs/ai/subagent) | [CLI](https://svelte.dev/docs/ai/cli) | [Code Writer](https://svelte.dev/docs/ai/code-writer) | [Claude Code](https://svelte.dev/docs/ai/claude-code) | [OpenCode](https://svelte.dev/docs/ai/opencode) | [Cursor](https://svelte.dev/docs/ai/cursor) | [GitHub Copilot CLI](https://svelte.dev/docs/ai/github-copilot-cli) | [Codex CLI](https://svelte.dev/docs/ai/codex-cli)

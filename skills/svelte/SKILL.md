---
name: svelte-docs
version: "5.x"
tags:
  - svelte
  - svelte 5
  - sveltekit
  - sveltekit 2
  - runes
  - $state
  - $derived
  - $effect
  - $props
  - $bindable
  - $inspect
  - $host
  - compiler
  - svelte component
  - svelte file
  - .svelte
  - reactive state
  - computed
  - snippet
  - render tag
  - transition
  - animation
  - store
  - writable
  - readable
  - derived store
  - context
  - lifecycle
  - onMount
  - onDestroy
  - tick
  - mount
  - unmount
  - hydrate
  - custom elements
  - typeScript
  - testing
  - vitest
  - playwright
  - storybook
  - sv
  - sv create
  - sv add
  - sv check
  - sv migrate
  - adapter
  - routing
  - load function
  - form actions
  - page options
  - ssr
  - ssg
  - spa
  - prerender
  - hooks
  - error handling
  - service worker
  - packaging
  - auth
  - performance
  - accessibility
  - seo
  - images
  - vite
  - vitePreprocess
  - tailwindcss
  - eslint
  - prettier
  - mdsvex
  - paraglide
  - drizzle
  - better-auth
  - mcp
  - ai tools
  - flip
  - fade
  - fly
  - slide
  - blur
  - scale
  - draw
  - crossfade
  - easing
  - spring
  - tweened
  - svelte/reactivity
  - SvelteMap
  - SvelteSet
  - SvelteDate
  - MediaQuery
  - createSubscriber
  - createContext
  - setContext
  - getContext
  - bind:
  - use:
  - animate:
  - style:
  - class:
  - await expressions
  - svelte:boundary
  - svelte:window
  - svelte:document
  - svelte:body
  - svelte:head
  - svelte:element
  - svelte:options
  - error boundary
  - progressive enhancement
  - use:enhance
  - goto
  - invalidate
  - invalidateAll
  - pushState
  - replaceState
  - afterNavigate
  - beforeNavigate
  - preloadData
  - preloadCode
  - $app/environment
  - $app/forms
  - $app/navigation
  - $app/paths
  - $app/server
  - $app/state
  - $app/stores
  - $env
  - $lib
  - $service-worker
  - svelte.config.js
  - svelte-kit sync
  - app.d.ts
  - remote functions
  - query
  - command
  - form
  - single-flight mutations
  - shallow routing
  - snapshots
  - observability
  - opentelemetry
  - svelte 4 migration
  - svelte 5 migration
  - sveltekit v2 migration
  - sapper migration
  - glossary
  - compiler errors
  - compiler warnings
  - runtime errors
  - runtime warnings
  - svelte/easing
  - svelte/motion
  - svelte/transition
  - svelte/store
  - svelte/server
  - svelte/compiler
  - svelte/events
  - svelte/action
  - svelte/animate
  - svelte/attachments
  - svelte/legacy
  - svelte/reactivity
  - createRawSnippet
  - flushSync
  - fork
  - untrack
  - getAbortSignal
  - settled
description: |
  Svelte 5.x + SvelteKit 2.x — runes, components, stores, transitions, SSR, routing, TypeScript.
---

# Svelte 5 + SvelteKit — Skill Documentation

> **Source**: [svelte.dev/docs](https://svelte.dev/docs) | [svelte.dev/docs/kit](https://svelte.dev/docs/kit)
> **Version**: Svelte 5.x, SvelteKit 2.x, sv CLI

## What is Svelte?

Svelte is a UI framework that uses a compiler to turn declarative components (HTML, CSS, JS) into lean, optimized JavaScript. Unlike React/Vue which use a virtual DOM, Svelte compiles away at build time — no runtime framework overhead.

## What is SvelteKit?

SvelteKit is the official application framework for Svelte, powered by Vite. It provides routing, SSR/SSG, data loading, form actions, adapters for deployment, and more. Similar to Next.js (React) or Nuxt (Vue).

## Quick Start

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

## Core Concepts

- **Runes**: Compiler keywords (`$state`, `$derived`, `$effect`, `$props`, `$bindable`, `$inspect`, `$host`) that control reactivity
- **Single-File Components**: `.svelte` files with `<script>`, `<template>` (markup), `<style>`
- **Reactive State**: `$state()` for reactive variables, `$derived()` for computed values
- **Effects**: `$effect()` for side-effects that track dependencies
- **Props**: `$props()` rune for component inputs
- **Snippets**: Reusable markup chunks (replaced slots from Svelte 4)
- **Stores**: `svelte/store` for reactive state across components (writable, readable, derived)
- **Context**: `createContext()` / `setContext()` / `getContext()` for parent-child data sharing
- **Filesystem Routing**: `src/routes/` directory defines routes with `+page.svelte`, `+layout.svelte`, etc.
- **Load Functions**: `+page.js` / `+page.server.js` for data loading
- **Form Actions**: `+page.server.js` exports for POST handling with progressive enhancement
- **Adapters**: Deploy to Node, static, Cloudflare, Netlify, Vercel, and more

## File Index

| File | Topics | Lines |
|------|--------|-------|
| [getting-started.md](getting-started.md) | Overview, .svelte files, runes ($state/$derived/$effect/$props/$bindable/$inspect/$host), basic markup, control flow, snippets, @render, @html, @attach, @const/@debug, declaration tags, bind:, use:, transition:, animate:, style:, class:, await expressions, styling (scoped/global/custom properties), special elements | ~650 |
| [components.md](components.md) | svelte:boundary, svelte:window/document/body/head/element/options, stores (writable/readable/derived/readonly/get/store contract), context (createContext/setContext/getContext), lifecycle (onMount/onDestroy/tick/beforeUpdate/afterUpdate), imperative API (mount/unmount/render/hydrate), hydratable data, best practices, testing (Vitest/Storybook/Playwright), TypeScript, custom elements, browser support, Svelte 4 migration, Svelte 5 migration, FAQ | ~600 |
| [api-reference.md](api-reference.md) | svelte (SvelteComponent/mount/unmount/onMount/onDestroy/createContext/createEventDispatcher/flushSync/fork/getAbortSignal/tick/untrack/Component/Snippet), svelte/action, svelte/animate (flip), svelte/attachments, svelte/compiler (compile/parse/preprocess/migrate/walk), svelte/easing (30 functions), svelte/events (on), svelte/legacy, svelte/motion (spring/tweened/prefersReducedMotion), svelte/reactivity (MediaQuery/SvelteDate/SvelteMap/SvelteSet/SvelteURL/createSubscriber), svelte/server (render), svelte/store (writable/readable/derived/readonly/get/fromStore/toStore), svelte/transition (fade/fly/slide/blur/draw/scale/crossfade), compiler errors, compiler warnings, runtime errors, runtime warnings | ~550 |
| [sveltekit.md](sveltekit.md) | Introduction, creating a project, project types, project structure, web standards, routing (+page/+layout/+error/+server), loading data (universal vs server/load events/cookies/streaming/parallel), form actions (default/named/progressive enhancement), page options (prerender/ssr/csr/trailingSlash), state management, remote functions (query/form/command), environment variables, building, adapters (Node/SSG/SPA/Cloudflare/Netlify/Vercel), advanced routing (rest params/matching/sorting/group layouts), hooks (handle/handleFetch/handleError/init/reroute/transport), errors, link options, service workers, server-only modules, snapshots, shallow routing, observability, packaging, auth, performance, images, accessibility, SEO, FAQ, integrations, breakpoint debugging, migration (SvelteKit v2/Sapper), glossary | ~700 |
| [sveltekit-api.md](sveltekit-api.md) | @sveltejs/kit (Server/error/fail/redirect/json/text/isHttpError/isRedirect/isActionFailure/VERSION), @sveltejs/kit/hooks (sequence/defineEnvVars), @sveltejs/kit/node (getRequest/setResponse/createReadableStream), @sveltejs/kit/node/polyfills (installPolyfills), @sveltejs/kit/vite (sveltekit), $app/environment (browser/building/dev/version), $app/forms (applyAction/deserialize/enhance), $app/navigation (goto/invalidate/invalidateAll/preloadCode/preloadData/pushState/replaceState/afterNavigate/beforeNavigate/onNavigate/disableScrollHandling/refreshAll), $app/paths (base/assets/asset/match/resolve/resolveRoute), $app/server (command/form/query/prerender/read/requested/getRequestEvent), $app/state (navigating/page/updated), $app/stores (page/navigating/updated/getStores), $app/types, $env/dynamic/private, $env/dynamic/public, $env/static/private, $env/static/public, $lib, $service-worker, configuration (Config/KitConfig), CLI (svelte-kit sync), types (app.d.ts/Generated types/$lib), sv CLI (create/add/check/migrate), add-ons (better-auth/drizzle/eslint/experimental/mcp/mdsvex/paraglide/playwright/prettier/storybook/sveltekit-adapter/tailwindcss/vitest), create your own add-on, sv-utils, MCP server, AI tools | ~600 |

## Documentation Links

### Svelte
- [Overview](https://svelte.dev/docs/svelte/overview)
- [Getting Started](https://svelte.dev/docs/svelte/getting-started)
- [.svelte Files](https://svelte.dev/docs/svelte/svelte-files)
- [.svelte.js/.svelte.ts Files](https://svelte.dev/docs/svelte/svelte-js-files)
- [Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [$state](https://svelte.dev/docs/svelte/$state) | [$derived](https://svelte.dev/docs/svelte/$derived) | [$effect](https://svelte.dev/docs/svelte/$effect)
- [$props](https://svelte.dev/docs/svelte/$props) | [$bindable](https://svelte.dev/docs/svelte/$bindable) | [$inspect](https://svelte.dev/docs/svelte/$inspect) | [$host](https://svelte.dev/docs/svelte/$host)
- [Basic Markup](https://svelte.dev/docs/svelte/basic-markup)
- [Control Flow](https://svelte.dev/docs/svelte/if) | [Each](https://svelte.dev/docs/svelte/each) | [Key](https://svelte.dev/docs/svelte/key) | [Await](https://svelte.dev/docs/svelte/await)
- [Snippets](https://svelte.dev/docs/svelte/snippet) | [@render](https://svelte.dev/docs/svelte/@render) | [@html](https://svelte.dev/docs/svelte/@html) | [@attach](https://svelte.dev/docs/svelte/@attach)
- [bind:](https://svelte.dev/docs/svelte/bind) | [use:](https://svelte.dev/docs/svelte/use) | [transition:](https://svelte.dev/docs/svelte/transition) | [animate:](https://svelte.dev/docs/svelte/animate)
- [style:](https://svelte.dev/docs/svelte/style) | [class:](https://svelte.dev/docs/svelte/class)
- [Await Expressions](https://svelte.dev/docs/svelte/await-expressions)
- [Styling](https://svelte.dev/docs/svelte/styling)
- [Special Elements](https://svelte.dev/docs/svelte/svelte-boundary)
- [Stores](https://svelte.dev/docs/svelte/stores) | [Context](https://svelte.dev/docs/svelte/context)
- [Lifecycle](https://svelte.dev/docs/svelte/lifecycle) | [Imperative API](https://svelte.dev/docs/svelte/imperative-component-api)
- [Best Practices](https://svelte.dev/docs/svelte/best-practices) | [Testing](https://svelte.dev/docs/svelte/testing)
- [TypeScript](https://svelte.dev/docs/svelte/typescript) | [Custom Elements](https://svelte.dev/docs/svelte/custom-elements)
- [Browser Support](https://svelte.dev/docs/svelte/browser-support)
- [Svelte 4 Migration](https://svelte.dev/docs/svelte/v4-migration-guide) | [Svelte 5 Migration](https://svelte.dev/docs/svelte/v5-migration-guide)
- [FAQ](https://svelte.dev/docs/svelte/faq)
- [API: svelte](https://svelte.dev/docs/svelte/svelte) | [svelte/action](https://svelte.dev/docs/svelte/svelte-action) | [svelte/animate](https://svelte.dev/docs/svelte/svelte-animate)
- [API: svelte/attachments](https://svelte.dev/docs/svelte/svelte-attachments) | [svelte/compiler](https://svelte.dev/docs/svelte/svelte-compiler)
- [API: svelte/easing](https://svelte.dev/docs/svelte/svelte-easing) | [svelte/events](https://svelte.dev/docs/svelte/svelte-events)
- [API: svelte/legacy](https://svelte.dev/docs/svelte/svelte-legacy) | [svelte/motion](https://svelte.dev/docs/svelte/svelte-motion)
- [API: svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity) | [svelte/server](https://svelte.dev/docs/svelte/svelte-server)
- [API: svelte/store](https://svelte.dev/docs/svelte/svelte-store) | [svelte/transition](https://svelte.dev/docs/svelte/svelte-transition)
- [Compiler Errors](https://svelte.dev/docs/svelte/compiler-errors) | [Compiler Warnings](https://svelte.dev/docs/svelte/compiler-warnings)
- [Runtime Errors](https://svelte.dev/docs/svelte/runtime-errors) | [Runtime Warnings](https://svelte.dev/docs/svelte/runtime-warnings)

### SvelteKit
- [Introduction](https://svelte.dev/docs/kit/introduction) | [Creating a Project](https://svelte.dev/docs/kit/creating-a-project)
- [Project Types](https://svelte.dev/docs/kit/project-types) | [Project Structure](https://svelte.dev/docs/kit/project-structure)
- [Web Standards](https://svelte.dev/docs/kit/web-standards) | [Routing](https://svelte.dev/docs/kit/routing)
- [Loading Data](https://svelte.dev/docs/kit/loading-data) | [Form Actions](https://svelte.dev/docs/kit/form-actions)
- [Page Options](https://svelte.dev/docs/kit/page-options) | [State Management](https://svelte.dev/docs/kit/state-management)
- [Remote Functions](https://svelte.dev/docs/kit/remote-functions) | [Environment Variables](https://svelte.dev/docs/kit/environment-variables)
- [Building](https://svelte.dev/docs/kit/building-your-app) | [Adapters](https://svelte.dev/docs/kit/adapters)
- [Node Servers](https://svelte.dev/docs/kit/adapter-node) | [Static Site Generation](https://svelte.dev/docs/kit/adapter-static)
- [Single-Page Apps](https://svelte.dev/docs/kit/adapter-spa) | [Cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare)
- [Cloudflare Workers](https://svelte.dev/docs/kit/adapter-cloudflare-workers) | [Netlify](https://svelte.dev/docs/kit/adapter-netlify) | [Vercel](https://svelte.dev/docs/kit/adapter-vercel)
- [Writing Adapters](https://svelte.dev/docs/kit/writing-adapters)
- [Advanced Routing](https://svelte.dev/docs/kit/advanced-routing) | [Hooks](https://svelte.dev/docs/kit/hooks)
- [Errors](https://svelte.dev/docs/kit/errors) | [Link Options](https://svelte.dev/docs/kit/link-options)
- [Service Workers](https://svelte.dev/docs/kit/service-workers) | [Server-Only Modules](https://svelte.dev/docs/kit/server-only-modules)
- [Snapshots](https://svelte.dev/docs/kit/snapshots) | [Shallow Routing](https://svelte.dev/docs/kit/shallow-routing)
- [Observability](https://svelte.dev/docs/kit/observability) | [Packaging](https://svelte.dev/docs/kit/packaging)
- [Auth](https://svelte.dev/docs/kit/auth) | [Performance](https://svelte.dev/docs/kit/performance)
- [Icons](https://svelte.dev/docs/kit/icons) | [Images](https://svelte.dev/docs/kit/images)
- [Accessibility](https://svelte.dev/docs/kit/accessibility) | [SEO](https://svelte.dev/docs/kit/seo)
- [FAQ](https://svelte.dev/docs/kit/faq) | [Integrations](https://svelte.dev/docs/kit/integrations)
- [Breakpoint Debugging](https://svelte.dev/docs/kit/breakpoint-debugging)
- [SvelteKit v2 Migration](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)
- [Sapper Migration](https://svelte.dev/docs/kit/migrating-from-sapper)
- [Glossary](https://svelte.dev/docs/kit/glossary)

### SvelteKit API
- [@sveltejs/kit](https://svelte.dev/docs/kit/@sveltejs-kit)
- [@sveltejs/kit/hooks](https://svelte.dev/docs/kit/@sveltejs-kit-hooks)
- [@sveltejs/kit/node](https://svelte.dev/docs/kit/@sveltejs-kit-node) | [@sveltejs/kit/node/polyfills](https://svelte.dev/docs/kit/@sveltejs-kit-node-polyfills)
- [@sveltejs/kit/vite](https://svelte.dev/docs/kit/@sveltejs-kit-vite)
- [$app/environment](https://svelte.dev/docs/kit/$app-environment) | [$app/forms](https://svelte.dev/docs/kit/$app-forms)
- [$app/navigation](https://svelte.dev/docs/kit/$app-navigation) | [$app/paths](https://svelte.dev/docs/kit/$app-paths)
- [$app/server](https://svelte.dev/docs/kit/$app-server) | [$app/state](https://svelte.dev/docs/kit/$app-state)
- [$app/stores](https://svelte.dev/docs/kit/$app-stores) | [$app/types](https://svelte.dev/docs/kit/$app-types)
- [$env/dynamic/private](https://svelte.dev/docs/kit/$env-dynamic-private) | [$env/dynamic/public](https://svelte.dev/docs/kit/$env-dynamic-public)
- [$env/static/private](https://svelte.dev/docs/kit/$env-static-private) | [$env/static/public](https://svelte.dev/docs/kit/$env-static-public)
- [$lib](https://svelte.dev/docs/kit/$lib) | [$service-worker](https://svelte.dev/docs/kit/$service-worker)
- [Configuration](https://svelte.dev/docs/kit/configuration) | [CLI](https://svelte.dev/docs/kit/cli) | [Types](https://svelte.dev/docs/kit/types)

### sv CLI
- [Overview](https://svelte.dev/docs/cli/overview)
- [sv create](https://svelte.dev/docs/cli/sv-create) | [sv add](https://svelte.dev/docs/cli/sv-add)
- [sv check](https://svelte.dev/docs/cli/sv-check) | [sv migrate](https://svelte.dev/docs/cli/sv-migrate)
- [Add-ons: better-auth](https://svelte.dev/docs/cli/better-auth) | [drizzle](https://svelte.dev/docs/cli/drizzle) | [eslint](https://svelte.dev/docs/cli/eslint)
- [Add-ons: experimental](https://svelte.dev/docs/cli/experimental) | [mcp](https://svelte.dev/docs/cli/mcp) | [mdsvex](https://svelte.dev/docs/cli/mdsvex)
- [Add-ons: paraglide](https://svelte.dev/docs/cli/paraglide) | [playwright](https://svelte.dev/docs/cli/playwright) | [prettier](https://svelte.dev/docs/cli/prettier)
- [Add-ons: storybook](https://svelte.dev/docs/cli/storybook) | [sveltekit-adapter](https://svelte.dev/docs/cli/sveltekit-adapter)
- [Add-ons: tailwindcss](https://svelte.dev/docs/cli/tailwindcss) | [vitest](https://svelte.dev/docs/cli/vitest)
- [Create your own add-on](https://svelte.dev/docs/cli/create-your-own) | [sv](https://svelte.dev/docs/cli/sv) | [sv-utils](https://svelte.dev/docs/cli/sv-utils)

### AI Tools
- [AI Tools Overview](https://svelte.dev/docs/ai/overview) | [Instructions](https://svelte.dev/docs/ai/instructions)
- [MCP Server](https://svelte.dev/docs/ai/mcp) | [Skills](https://svelte.dev/docs/ai/skills) | [Subagents](https://svelte.dev/docs/ai/subagent)
- [CLI](https://svelte.dev/docs/ai/cli) | [Code Writer](https://svelte.dev/docs/ai/code-writer)
- [Claude Code](https://svelte.dev/docs/ai/claude-code) | [OpenCode](https://svelte.dev/docs/ai/opencode)
- [Cursor](https://svelte.dev/docs/ai/cursor) | [GitHub Copilot CLI](https://svelte.dev/docs/ai/github-copilot-cli) | [Codex CLI](https://svelte.dev/docs/ai/codex-cli)

### Additional Resources
- [Interactive Tutorial](https://svelte.dev/tutorial) | [SvelteKit Tutorial](https://svelte.dev/tutorial/kit)
- [Playground](https://svelte.dev/playground) | [Examples](https://svelte.dev/examples)
- [Discord](https://svelte.dev/chat) | [GitHub](https://github.com/sveltejs)
- [Svelte Society](https://sveltesociety.dev/) | [Svelte Summit](https://sveltesummit.com/)

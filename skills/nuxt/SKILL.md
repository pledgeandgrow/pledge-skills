---
name: nuxt-docs
version: "4.x"
tags:
  - nuxt
  - nuxt 4
  - vue
  - vue 3
  - ssr
  - server-side rendering
  - full-stack
  - nitro
  - vite
  - file-based routing
  - auto-imports
  - useFetch
  - useAsyncData
  - useState
  - useRuntimeConfig
  - useHead
  - useSeoMeta
  - NuxtLink
  - definePageMeta
  - createError
  - navigateTo
  - $fetch
  - routeRules
  - hybrid rendering
  - prerendering
  - pinia
  - nuxt config
  - nuxt.config.ts
  - app.config.ts
  - server routes
  - api routes
  - nuxt modules
  - nuxt layers
  - nuxt testing
  - nuxt deployment
  - nuxt experimental
  - h3
  - ofetch
  - unhead
  - nuxt generate
  - nuxt build
  - nuxt dev
  - composition api
  - script setup
  - typescript
  - eslint
  - devonly
  - nuxtclientfallback
  - nuxtpicture
  - nuxtimg
  - teleport
  - nuxttime
  - nuxtannouncer
  - nuxtwelcome
  - createuseasyncdata
  - onprehydrate
  - useannouncer
  - useerror
  - usehydration
  - uselayout
  - uselazyasyncdata
  - uselazyfetch
  - usenuxtdata
  - userequestheader
  - useruntimehook
  - nuxt lifecycle
  - nuxt transitions
  - nuxt views
  - nuxt upgrade
  - nuxt mcp
  - nuxt llms.txt
  - nuxt module authoring
  - nuxt custom events
  - nuxt features config
  - nuxt hydration
  - nuxt performance
  - nuxt code style
  - nuxt cli
  - nuxt commands
  - nuxt kit
  - defineNuxtModule
  - installModule
  - addPlugin
  - addComponent
  - addServerHandler
  - useNitro
  - useNuxt
  - extendPages
  - extendRouteRules
  - getLayerDirectories
  - useRouteAnnouncer
  - updateAppConfig
  - nuxt preview
  - nuxt typecheck
  - nuxt prepare
  - nuxt analyze
  - nuxt cleanup
  - nuxt devtools
  - nuxt build-module
  - nuxt test
  - nuxt module add
  - nuxt add
  - create nuxt
  - nuxt .env
  - nuxt package.json
description: |
  Nuxt 4.x — full-stack Vue.js framework. File-based routing, auto-imports, SSR, Nitro, layers, modules.
---

# Nuxt 4.x Skill

## Overview

Nuxt is a free and open-source framework for creating type-safe, performant, and production-grade full-stack web applications with Vue.js. It provides an intuitive and extendable way to build SSR (Server-Side Rendering) applications with conventions and automation that let developers focus on features.

- **Official Docs**: https://nuxt.com/docs/4.x
- **Version**: 4.x
- **Runtime**: Node.js 22.x+, Bun, Deno
- **Build Tool**: Vite (default), Webpack, Rspack
- **Server Engine**: Nitro (h3-based)

## Quick Reference

| File | Topics |
|------|--------|
| [getting-started.md](getting-started.md) | Installation, configuration, directory structure, routing, data fetching, state management, styling, SEO/meta, error handling, deployment, components, composables, plugins, pages, layouts, middleware, assets, shared directory, app.vue, layers, views, transitions, server (Nitro), upgrade guide, .env file, package.json, nuxt.config.ts |
| [api.md](api.md) | nuxt.config.ts options, composables (useFetch, useAsyncData, useState, useRuntimeConfig, useRoute, useHead, useSeoMeta, useCookie, useRequestHeaders, useRequestFetch, useRequestEvent, useRequestURL, useResponseHeader, useRouter, useLoadingIndicator, usePreviewMode, useServerSeoMeta, useHeadSafe, useAppConfig, useNuxtApp, createUseAsyncData, createUseFetch, onPrehydrate, useAnnouncer, useError, useHydration, useLayout, useLazyAsyncData, useLazyFetch, useNuxtData, useRequestHeader, useRuntimeHook, useRouteAnnouncer), components (NuxtLink, NuxtPage, NuxtLayout, ClientOnly, NuxtIsland, NuxtLoadingIndicator, NuxtRouteAnnouncer, NuxtErrorBoundary, DevOnly, NuxtClientFallback, NuxtPicture, NuxtImg, Teleport, NuxtTime, NuxtAnnouncer, NuxtWelcome), utils ($fetch, definePageMeta, createError, showError, clearError, navigateTo, callOnce, updateAppConfig, defineNuxtRouteMiddleware, defineNuxtPlugin, defineNitroPlugin, refreshNuxtData, reloadNuxtApp, abortNavigation, setPageLayout, onNuxtReady, preloadRouteComponents, addRouteMiddleware, preloadComponents, prerenderRoutes, defineNuxtComponent, isHydrating), CLI commands (dev, build, generate, preview, typecheck, prepare, analyze, info, upgrade, cleanup, devtools, build-module, test, module, add, init), Nuxt Kit API (defineNuxtModule, installModule, addPlugin, addPluginTemplate, addComponent, addComponentsDir, addServerHandler, addDevServerHandler, useNitro, addServerPlugin, addPrerenderRoutes, addServerImports, addServerImportsDir, addServerScanDir, useNuxt, tryUseNuxt, extendPages, extendRouteRules, addRouteMiddleware, getLayerDirectories), server routes, custom $fetch |
| [guides.md](guides.md) | Rendering modes (SSR/CSR/hybrid/edge), Nitro server engine, auto-imports, modules, layers authoring, prerendering, error handling, deployment, testing, experimental features, lifecycle hooks (app/build/server), runtime config, custom routing, NuxtApp context, Nuxt internals, debugging, sessions & authentication, Vite plugins, Nuxt Kit, nightly release channel, Nuxt lifecycle (server/client), TypeScript, code style (ESLint), hydration best practices, performance best practices, plugin best practices, AI integration (MCP server, LLMs.txt), custom events, features config, module author guide (getting started, anatomy, recipes, dependencies, hooks/types, testing, best practices, ecosystem) |

## Core Concepts

- **File-based Routing**: Routes generated from `app/pages/` directory structure with dynamic, nested, catch-all, and route groups
- **Auto-imports**: Components, composables, and utils auto-imported from their directories
- **Server-Side Rendering**: Built-in SSR with hydration, configurable per-route via `routeRules`
- **Data Fetching**: `useFetch` and `useAsyncData` composables for SSR-safe data fetching
- **State Management**: `useState` composable for SSR-friendly shared state; Pinia integration
- **Nitro Server Engine**: Standalone server with API routes, middleware, plugins, and storage
- **Hybrid Rendering**: Per-route rendering modes (SSR, SSG, SWR, ISR, CSR) via `routeRules`
- **Convention over Configuration**: Opinionated directory structure with sensible defaults
- **TypeScript First**: Zero-config TypeScript with auto-generated types and tsconfig.json
- **Module System**: Extensible architecture with Nuxt modules for integrations
- **Layers**: Composable project structure for sharing components, composables, configs across projects
- **Plugin System**: Vue plugins, custom helpers, directives via `app/plugins/` directory
- **Middleware**: Route-level middleware (anonymous, named, global) for navigation guards
- **Layouts**: Reusable page layouts with dynamic switching and props
- **Shared Directory**: Code shared between Vue app and Nitro server with auto-imports
- **Server Components (Islands)**: Non-interactive components rendered without client JS
- **Lifecycle Hooks**: Build-time and runtime hooks for extending Nuxt behavior
- **Runtime Config**: Environment-based configuration with public/private separation
- **Nuxt Kit**: Utilities for module authors (`@nuxt/kit`)
- **Custom Routing**: Override routes via router options, pages hook, or Nuxt modules
- **Transitions**: Page and layout transitions with CSS or JS hooks, View Transitions API
- **Server (Nitro)**: Universal deployment, hybrid rendering, server endpoints and middleware
- **Upgrade Guide**: Nuxt 3→4 migration, new directory structure, key breaking changes
- **TypeScript**: Auto-generated types, project references, strict checks, type-checking
- **ESLint**: Project-aware linting via @nuxt/eslint module
- **AI Integration**: MCP server and LLMs.txt for AI assistant support
- **Module Authoring**: defineNuxtModule, Kit utilities, testing, publishing ecosystem
- **Custom Events**: hookable event system with hook/callHook for two-way communication
- **Features Config**: Optional features (devLogs, inlineStyles, noScripts) and future opt-ins

## Ecosystem

- **Vue.js 3**: The progressive JavaScript framework (Composition API, `<script setup>`)
- **Nitro**: Server engine powering Nuxt (h3, standalone server, multi-provider deployment)
- **Vite**: Default build tool with HMR
- **Pinia**: Official state management (via `@pinia/nuxt` module)
- **Vue Router**: File-based routing with dynamic and nested routes
- **unhead**: Head management (`useHead`, `useSeoMeta`)
- **ofetch**: HTTP client (`$fetch`)
- **Nuxt UI**: UI component library for Nuxt apps
- **Nuxt Content**: File-based CMS using Markdown
- **Nuxt Image**: Optimized image handling
- **Nuxt Test Utils**: Testing utilities (`@nuxt/test-utils`)

## Common Patterns

```ts
// nuxt.config.ts - Main configuration
export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    apiKey: '', // Private, server-only
    public: { apiBase: '/api' }, // Exposed to client
  },
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { isr: 3600 },
    '/admin/**': { ssr: false },
  },
})
```

```vue
<!-- app/pages/index.vue - File-based routing with data fetching -->
<script setup lang="ts">
const { data: posts, status } = await useFetch('/api/posts')
useSeoMeta({
  title: 'My Blog',
  description: 'Latest posts',
})
</script>

<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else>
    <h1>Posts</h1>
    <NuxtLink v-for="post in posts" :key="post.id" :to="`/posts/${post.id}`">
      {{ post.title }}
    </NuxtLink>
  </div>
</template>
```

```ts
// server/api/hello.ts - Server API route
export default defineEventHandler((event) => {
  const name = getRouterParam(event, 'name')
  return { message: `Hello, ${name}!` }
})
```

## Sources

### Getting Started
- https://nuxt.com/docs/4.x/getting-started/introduction
- https://nuxt.com/docs/4.x/getting-started/installation
- https://nuxt.com/docs/4.x/getting-started/configuration
- https://nuxt.com/docs/4.x/getting-started/directory-structure
- https://nuxt.com/docs/4.x/getting-started/routing
- https://nuxt.com/docs/4.x/getting-started/data-fetching
- https://nuxt.com/docs/4.x/getting-started/state-management
- https://nuxt.com/docs/4.x/getting-started/styling
- https://nuxt.com/docs/4.x/getting-started/seo-meta
- https://nuxt.com/docs/4.x/getting-started/error-handling
- https://nuxt.com/docs/4.x/getting-started/deployment
- https://nuxt.com/docs/4.x/getting-started/testing
- https://nuxt.com/docs/4.x/getting-started/prerendering
- https://nuxt.com/docs/4.x/getting-started/layers
- https://nuxt.com/docs/4.x/getting-started/assets

### Directory Structure
- https://nuxt.com/docs/4.x/directory-structure/app
- https://nuxt.com/docs/4.x/directory-structure/app/components
- https://nuxt.com/docs/4.x/directory-structure/app/composables
- https://nuxt.com/docs/4.x/directory-structure/app/layouts
- https://nuxt.com/docs/4.x/directory-structure/app/middleware
- https://nuxt.com/docs/4.x/directory-structure/app/pages
- https://nuxt.com/docs/4.x/directory-structure/app/plugins
- https://nuxt.com/docs/4.x/directory-structure/app/utils
- https://nuxt.com/docs/4.x/directory-structure/app/assets
- https://nuxt.com/docs/4.x/directory-structure/shared
- https://nuxt.com/docs/4.x/directory-structure/public
- https://nuxt.com/docs/4.x/directory-structure/server

### API Reference
- https://nuxt.com/docs/4.x/api/nuxt-config
- https://nuxt.com/docs/4.x/api/composables/use-async-data
- https://nuxt.com/docs/4.x/api/composables/use-fetch
- https://nuxt.com/docs/4.x/api/composables/use-state
- https://nuxt.com/docs/4.x/api/composables/use-runtime-config
- https://nuxt.com/docs/4.x/api/composables/use-route
- https://nuxt.com/docs/4.x/api/composables/use-cookie
- https://nuxt.com/docs/4.x/api/composables/use-request-headers
- https://nuxt.com/docs/4.x/api/composables/use-request-fetch
- https://nuxt.com/docs/4.x/api/composables/use-request-event
- https://nuxt.com/docs/4.x/api/composables/use-response-header
- https://nuxt.com/docs/4.x/api/composables/use-router
- https://nuxt.com/docs/4.x/api/composables/use-loading-indicator
- https://nuxt.com/docs/4.x/api/composables/use-preview-mode
- https://nuxt.com/docs/4.x/api/composables/use-server-seo-meta
- https://nuxt.com/docs/4.x/api/composables/use-head-safe
- https://nuxt.com/docs/4.x/api/components/nuxt-link
- https://nuxt.com/docs/4.x/api/components/client-only
- https://nuxt.com/docs/4.x/api/components/nuxt-island
- https://nuxt.com/docs/4.x/api/utils/dollarfetch
- https://nuxt.com/docs/4.x/api/utils/define-page-meta
- https://nuxt.com/docs/4.x/api/utils/refresh-nuxt-data
- https://nuxt.com/docs/4.x/api/utils/reload-nuxt-app
- https://nuxt.com/docs/4.x/api/utils/abort-navigation
- https://nuxt.com/docs/4.x/api/utils/set-page-layout
- https://nuxt.com/docs/4.x/api/utils/on-nuxt-ready
- https://nuxt.com/docs/4.x/api/utils/preload-route-components
- https://nuxt.com/docs/4.x/api/utils/add-route-middleware
- https://nuxt.com/docs/4.x/api/advanced/hooks

### Getting Started (Additional)
- https://nuxt.com/docs/4.x/getting-started/views
- https://nuxt.com/docs/4.x/getting-started/transitions
- https://nuxt.com/docs/4.x/getting-started/server
- https://nuxt.com/docs/4.x/getting-started/upgrade

### API Reference (Additional)
- https://nuxt.com/docs/4.x/api/composables/create-use-async-data
- https://nuxt.com/docs/4.x/api/composables/on-prehydrate
- https://nuxt.com/docs/4.x/api/composables/use-announcer
- https://nuxt.com/docs/4.x/api/composables/use-error
- https://nuxt.com/docs/4.x/api/composables/use-hydration
- https://nuxt.com/docs/4.x/api/composables/use-layout
- https://nuxt.com/docs/4.x/api/composables/use-lazy-async-data
- https://nuxt.com/docs/4.x/api/composables/use-lazy-fetch
- https://nuxt.com/docs/4.x/api/composables/use-nuxt-data
- https://nuxt.com/docs/4.x/api/composables/use-request-header
- https://nuxt.com/docs/4.x/api/composables/use-runtime-hook
- https://nuxt.com/docs/4.x/api/components/dev-only
- https://nuxt.com/docs/4.x/api/components/nuxt-client-fallback
- https://nuxt.com/docs/4.x/api/components/nuxt-picture
- https://nuxt.com/docs/4.x/api/components/nuxt-img
- https://nuxt.com/docs/4.x/api/components/teleports
- https://nuxt.com/docs/4.x/api/components/nuxt-time
- https://nuxt.com/docs/4.x/api/components/nuxt-announcer
- https://nuxt.com/docs/4.x/api/components/nuxt-welcome

### Guides & Recipes
- https://nuxt.com/docs/4.x/guide/concepts/rendering
- https://nuxt.com/docs/4.x/guide/concepts/server-engine
- https://nuxt.com/docs/4.x/guide/concepts/auto-imports
- https://nuxt.com/docs/4.x/guide/concepts/modules
- https://nuxt.com/docs/4.x/guide/concepts/nuxt-lifecycle
- https://nuxt.com/docs/4.x/guide/concepts/typescript
- https://nuxt.com/docs/4.x/guide/concepts/code-style
- https://nuxt.com/docs/4.x/guide/best-practices/devcontainers
- https://nuxt.com/docs/4.x/guide/best-practices/hydration
- https://nuxt.com/docs/4.x/guide/best-practices/performance
- https://nuxt.com/docs/4.x/guide/best-practices/plugins
- https://nuxt.com/docs/4.x/guide/ai/mcp
- https://nuxt.com/docs/4.x/guide/ai/llms-txt
- https://nuxt.com/docs/4.x/guide/going-further/experimental-features
- https://nuxt.com/docs/4.x/guide/going-further/hooks
- https://nuxt.com/docs/4.x/guide/going-further/runtime-config
- https://nuxt.com/docs/4.x/guide/going-further/nuxt-app
- https://nuxt.com/docs/4.x/guide/going-further/internals
- https://nuxt.com/docs/4.x/guide/going-further/debugging
- https://nuxt.com/docs/4.x/guide/going-further/kit
- https://nuxt.com/docs/4.x/guide/going-further/layers
- https://nuxt.com/docs/4.x/guide/going-further/events
- https://nuxt.com/docs/4.x/guide/going-further/features
- https://nuxt.com/docs/4.x/guide/going-further/nightly-release-channel
- https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch
- https://nuxt.com/docs/4.x/guide/recipes/custom-routing
- https://nuxt.com/docs/4.x/guide/recipes/sessions-and-authentication
- https://nuxt.com/docs/4.x/guide/recipes/vite-plugin

### Module Author Guide
- https://nuxt.com/docs/4.x/guide/modules/getting-started
- https://nuxt.com/docs/4.x/guide/modules/module-anatomy
- https://nuxt.com/docs/4.x/guide/modules/recipes-basics
- https://nuxt.com/docs/4.x/guide/modules/recipes-advanced
- https://nuxt.com/docs/4.x/guide/modules/module-dependencies
- https://nuxt.com/docs/4.x/guide/modules/testing
- https://nuxt.com/docs/4.x/guide/modules/best-practices
- https://nuxt.com/docs/4.x/guide/modules/ecosystem

### Nuxt CLI Commands
- https://nuxt.com/docs/4.x/api/commands/dev
- https://nuxt.com/docs/4.x/api/commands/build
- https://nuxt.com/docs/4.x/api/commands/generate
- https://nuxt.com/docs/4.x/api/commands/preview
- https://nuxt.com/docs/4.x/api/commands/typecheck
- https://nuxt.com/docs/4.x/api/commands/prepare
- https://nuxt.com/docs/4.x/api/commands/analyze
- https://nuxt.com/docs/4.x/api/commands/info
- https://nuxt.com/docs/4.x/api/commands/upgrade
- https://nuxt.com/docs/4.x/api/commands/cleanup
- https://nuxt.com/docs/4.x/api/commands/devtools
- https://nuxt.com/docs/4.x/api/commands/build-module
- https://nuxt.com/docs/4.x/api/commands/test
- https://nuxt.com/docs/4.x/api/commands/module
- https://nuxt.com/docs/4.x/api/commands/add
- https://nuxt.com/docs/4.x/api/commands/init

### Nuxt Kit API
- https://nuxt.com/docs/4.x/api/kit/modules
- https://nuxt.com/docs/4.x/api/kit/plugins
- https://nuxt.com/docs/4.x/api/kit/components
- https://nuxt.com/docs/4.x/api/kit/nitro
- https://nuxt.com/docs/4.x/api/kit/context
- https://nuxt.com/docs/4.x/api/kit/pages
- https://nuxt.com/docs/4.x/api/kit/layers
- https://nuxt.com/docs/4.x/api/kit/autoimports

### Additional Directory Structure
- https://nuxt.com/docs/4.x/directory-structure/env
- https://nuxt.com/docs/4.x/directory-structure/package
- https://nuxt.com/docs/4.x/directory-structure/nuxt-config
- https://nuxt.com/docs/4.x/directory-structure/nuxt
- https://nuxt.com/docs/4.x/directory-structure/tsconfig

### Additional API Reference
- https://nuxt.com/docs/4.x/api/composables/use-route-announcer
- https://nuxt.com/docs/4.x/api/utils/update-app-config

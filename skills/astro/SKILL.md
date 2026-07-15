---
name: Astro Expert
version: "5.x"
tags:
  - astro
  - web-framework
  - static-site-generator
  - islands-architecture
  - content-driven
  - react
  - vue
  - svelte
  - markdown
description: |
  Comprehensive Astro framework reference covering components, pages, layouts, routing,
  styling, markdown, content collections, islands architecture, server islands, actions,
  middleware, endpoints, data fetching, view transitions, integrations, deployment, environment
  variables, imports, images, fonts, i18n, sessions, RSS, prefetch, testing, troubleshooting,
  CLI, dev toolbar, migration, and configuration. Use whenever the user mentions Astro,
  content-driven websites, islands architecture, MDX, or needs help building fast static or
  hybrid sites.
---

# Astro Expert (v5.x)

**Official Documentation:** https://docs.astro.build/
**GitHub:** https://github.com/withastro/astro

## What is Astro?

Astro is a web framework for content-driven websites. It renders HTML on the server with zero JavaScript by default, using islands architecture for selective hydration of interactive components. Supports React, Vue, Svelte, Preact, SolidJS, and Alpine.js integrations.

## Quick Reference

| Topic | File |
|------|------|
| Components (`.astro` syntax, props, slots, fragments) | `components.md` |
| Pages & Routing (file-based, dynamic, redirects, pagination) | `routing.md` |
| Layouts (nesting, markdown layouts, TypeScript) | `layouts.md` |
| Styling (scoped CSS, Tailwind, preprocessors, global styles) | `styling.md` |
| Content Collections (loaders, schemas, querying, live collections) | `content-collections.md` |
| Islands Architecture (client islands, server islands, hydration) | `islands.md` |
| Actions (type-safe server functions, forms, validation) | `actions.md` |
| Middleware (onRequest, context.locals, chaining, rewriting) | `middleware.md` |
| Endpoints & API Routes (static/server endpoints, HTTP methods) | `endpoints.md` |
| Data Fetching (fetch API, GraphQL, CMS, SSR vs SSG) | `data-fetching.md` |
| View Transitions (ClientRouter, directives, lifecycle events) | `view-transitions.md` |
| Integrations (React, Vue, Svelte, MDX, adapters, building) | `integrations.md` |
| Configuration & Environment Variables | `config-env.md` |
| Imports & Assets (file types, aliases, glob, WASM) | `imports.md` |
| Deployment (adapters, build output, hosting providers) | `deployment.md` |
| Images (`<Image />`, `<Picture />`, optimization, formats) | `images.md` |
| Fonts (Google, Fontsource, local, providers, CSS variables) | `fonts.md` |
| Internationalization (i18n routing, locales, translations) | `i18n.md` |
| Sessions (SSR state, drivers, session data) | `sessions.md` |
| RSS Feeds (`@astrojs/rss`, content collections, auto-discovery) | `rss.md` |
| Prefetch (strategies, viewport, hover, tap, programmatic) | `prefetch.md` |
| Testing (Vitest, Playwright, Cypress, NightwatchJS) | `testing.md` |
| Troubleshooting (debugging, common errors, gotchas) | `troubleshooting.md` |
| Template Syntax & API (JSX expressions, Astro global, slots, self) | `template-syntax.md` |
| Markdown (frontmatter, Content component, plugins, syntax highlighting) | `markdown.md` |
| CLI Commands (dev, build, check, sync, add, preview, info) | `cli.md` |
| Dev Toolbar (inspect, audit, settings, extending) | `dev-toolbar.md` |
| Migration Guides (from CRA, Next.js, Gatsby, Jekyll, Hugo, WordPress) | `migration.md` |

## Hello World

```astro
---
// src/pages/index.astro
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Astro Site</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

## Project Structure

```
src/
  pages/          # File-based routing (.astro, .md, .mdx)
  components/     # Reusable .astro components
  layouts/        # Page layout wrappers
  content/        # Content collections
  styles/         # Global stylesheets
  middleware.ts   # Middleware (optional)
  actions/        # Server actions (optional)
public/           # Static assets served as-is
astro.config.mjs  # Astro configuration
```

## Key Concepts

- **Zero JS by default** — Astro renders HTML on the server, ships no JS unless explicitly hydrated
- **Islands Architecture** — Interactive components are hydrated independently (selective hydration)
- **Multi-framework** — Use React, Vue, Svelte, Preact, SolidJS, or Alpine.js in the same project
- **Content Collections** — Type-safe content management with Zod schemas and loaders
- **Server Islands** — Server-rendered components that stream independently of the page
- **Actions** — Type-safe server functions callable from client, forms, or components
- **View Transitions** — SPA-like navigation with `<ClientRouter />` and transition directives
- **Output Modes** — Static (SSG), Server (SSR), or Hybrid (per-route prerender)

## Prerequisites

- HTML, CSS, JavaScript fundamentals
- TypeScript helpful but not required
- React/Vue/Svelte knowledge optional (only if using framework integrations)

## Installation

```bash
# Create a new project
npm create astro@latest

# With specific template
npm create astro@latest -- --template basics

# With integrations
npx astro add react
npx astro add tailwind
npx astro add mdx
```

## References

- [Astro Docs](https://docs.astro.build/)
- [Astro GitHub](https://github.com/withastro/astro)
- [Astro Integrations](https://docs.astro.build/en/guides/integrations-guide/)
- [Astro Discord](https://astro.build/chat)
- [Awesome Astro](https://github.com/awesome-scripts/awesome-astro)

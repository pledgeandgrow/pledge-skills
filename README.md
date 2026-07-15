# Pledge Skills — Installable Agent Skill Library

[![skills.sh](https://skills.sh/b/mehdi-berel/pledge-skills)](https://www.skills.sh/mehdi-berel/pledge-skills)

A comprehensive, production-ready collection of agent skills covering Next.js 16.2.7, React 19.x, TypeScript 5.x, Tailwind CSS v4, and Zig 0.16.0. Built from official documentation — every API, hook, component, type, utility class, and language feature.

```bash
npx pledge-skills add all
```

## Stats

- **34 Next.js modular reference files** (6,892+ lines)
- **16 TypeScript modular reference files** (2,371+ lines)
- **17 Tailwind CSS modular reference files** (3,092+ lines)
- **15 React modular reference files** (2,744+ lines)
- **22 Zig modular reference files** (5,600+ lines)
- Every official docs page analyzed and covered

## Skills

| Skill | Files | Description |
|-------|-------|-------------|
| `nextjs/` | 34 | Next.js 16.2.7 — App Router, Server Components, caching, deployment |
| `typescript/` | 16 | TypeScript 5.x — types, generics, narrowing, TSConfig, JSX, migration |
| `tailwindcss/` | 17 | Tailwind CSS v4 — utility classes, responsive, customization, v4 CSS-first config |
| `zig/` | 22 | Zig 0.16.0 — types, pointers, structs, enums, unions, control flow, comptime, builtins, memory, C interop, assembly, std library |

## Install

### Install all skills

```bash
npx pledge-skills add all
```

### Install specific skills

```bash
npx pledge-skills add nextjs
npx pledge-skills add react
npx pledge-skills add typescript
npx pledge-skills add tailwindcss
npx pledge-skills add zig
```

### List available skills

```bash
npx pledge-skills list
```

### Manual install (copy folders)

Copy individual skill folders (`nextjs/`, `typescript/`, `tailwindcss/`, `react/`, `zig/`) into your agent's skills directory (`.claude/skills/` or `.agents/skills/`).

## Skill Index

| File | Topic |
|------|-------|
| `SKILL.md` | Main index — quick reference and file map |
| `project-structure.md` | File conventions, routing, layouts, dynamic routes, parallel/intercepted routes |
| `server-client-components.md` | Server Components, Client Components, `'use client'`, composition, serialization |
| `data-fetching.md` | Fetching in Server Components, `async` pages, `generateStaticParams` |
| `server-functions.md` | Server Actions, Server Functions, `'use server'`, progressive enhancement |
| `caching.md` | `'use cache'`, `cacheLife`, `cacheTag`, `cacheComponents`, revalidation internals |
| `streaming.md` | `<Suspense>`, `loading.js`, `use()` promise, streaming Route Handlers |
| `error-handling.md` | `error.js`, `not-found.js`, `forbidden()`, `unauthorized()`, `global-error.tsx` |
| `forms-validation.md` | Server Actions forms, `useActionState`, `useFormStatus`, optimistic updates |
| `styling.md` | Tailwind CSS v4, CSS Modules, Global CSS, Sass |
| `css-in-js.md` | styled-components, styled-jsx, Emotion status |
| `image-font-optimization.md` | `next/image`, `next/font`, `getImageProps`, config, browser bugs |
| `metadata-seo.md` | `generateMetadata`, `generateViewport`, OG images, sitemap, robots |
| `navigation-hooks.md` | `useRouter`, `usePathname`, `useSearchParams`, `useLinkStatus` |
| `redirecting.md` | `redirect()`, `permanentRedirect()`, `NextResponse.redirect`, bulk redirects |
| `components-next.md` | `Form`, `Script`, `Link` (onNavigate, transitionTypes), `ViewTransition` |
| `prefetching-ppr.md` | `<Link>` prefetching, manual prefetch, Partial Prerendering (PPR) |
| `preserving-ui-state.md` | React `<Activity>`, state preservation across navigations |
| `authentication-security.md` | Sessions, OAuth, JWT, middleware auth, CSP, tainting, rate limiting |
| `environment-variables.md` | `.env` files, `NEXT_PUBLIC_`, runtime variables, load order |
| `advanced-apis.md` | `after`, `connection`, `cacheTag`, `draftMode`, `cacheLife` |
| `lazy-loading.md` | `next/dynamic`, `React.lazy()`, `ssr: false`, magic comments |
| `custom-server.md` | Express integration, custom routing, existing backend proxy |
| `internationalization.md` | i18n routing, dictionaries, RTL, locale detection |
| `mdx.md` | MDX setup, custom components, frontmatter, remark/rehype plugins |
| `testing.md` | Vitest, Playwright, Cypress, Jest — unit, component, E2E |
| `advanced-deployment.md` | Multi-tenant, multi-zones, bundle analyzer, PWA, video |
| `static-exports.md` | `output: 'export'`, Docker self-hosting, production checklist |
| `third-party-backend.md` | `@next/third-parties`, BFF, Route Handlers, webhooks, rate limiting |
| `debugging-memory.md` | VS Code debugger, DevTools, heap profiles, memory optimization |
| `edge-runtime.md` | Edge Runtime APIs, `proxy.ts`, `NextRequest`/`NextResponse`, Adapters |
| `turbopack-config.md` | Turbopack, React Compiler, `next.config.ts`, all config options, CLI |
| `instrumentation-mcp.md` | `instrumentation.ts`, OpenTelemetry, Speed Insights, Analytics |
| `breaking-changes.md` | Full migration guide from Next.js 15 to 16.2.7 |

## Target Versions

- **Next.js**: 16.2.7
- **React**: 19.2 (Canary)
- **Tailwind CSS**: v4 (default in new projects)
- **Zig**: 0.16.0

## Usage

Point your AI agent to `nextjs/SKILL.md` as the entry point. It contains a condensed index with links to all modular files.

```
Agent: "I need to know about Next.js caching"
→ Read nextjs/caching.md

Agent: "How do I set up OpenTelemetry?"
→ Read nextjs/instrumentation-mcp.md

Agent: "What's the difference between Server and Client Components?"
→ Read nextjs/server-client-components.md
```

## License

MIT

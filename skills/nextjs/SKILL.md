---
name: Next.js Expert
version: "16.2.7"
tags:
  - nextjs
  - react
  - app-router
  - server-components
  - full-stack
  - framework
description: >
  Use this skill whenever the user asks about Next.js, React full-stack development,
  App Router, Server Components, or building web applications with Next.js.
  This skill covers Next.js 16.2.7 with React 19.2, App Router, Cache Components,
  Turbopack, and all modern patterns. Use it for code generation, architecture decisions,
  debugging, migration from older versions, or any Next.js-related task.
  Make sure to use this skill whenever the user mentions Next.js, App Router,
  Server Components, React 19, Turbopack, or modern React framework patterns,
  even if they don't explicitly ask for Next.js 16.
compatibility:
  - Node.js >= 20.9
  - React 19.2
  - TypeScript 5.7+
---

# Next.js 16.2.7 Reference Skill

**Official Documentation:** https://nextjs.org/docs

This skill ensures Claude always uses the latest Next.js 16.2.7 patterns, APIs, and best practices.

## Version Context

- **Next.js**: 16.2.7
- **React**: 19.2 (Canary in App Router)
- **Bundler**: Turbopack (stable, default)
- **Router**: App Router (default for all new projects)
- **Node.js**: >= 20.9 (minimum)
- **Browsers**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project creation:** `npx create-next-app@latest my-app` — includes AGENTS.md and CLAUDE.md by default. Options: TypeScript, ESLint, Tailwind CSS v4, App Router, Turbopack, `@/*` alias.

## Quick Reference

For detailed deep-dives on each topic, read the bundled reference files:

| File | Topic |
|------|-------|
| `project-structure.md` | App Router file conventions, dynamic routes, route groups, parallel routes, intercepted routes |
| `server-client-components.md` | Server vs Client Components, interleaving patterns, context providers, bundle optimization |
| `data-fetching.md` | Server Component fetching, streaming, parallel/sequential fetching, client fetching, mutations |
| `caching.md` | Cache Components (`"use cache"`), `cacheLife` profiles, `updateTag`, `refresh`, invalidation |
| `error-handling.md` | Expected errors (`useActionState`), error boundaries (`error.tsx`), `notFound()`, `unstable_catchError` |
| `server-functions.md` | Server Functions vs Server Actions, auth verification, progressive enhancement, passing actions as props |
| `forms-validation.md` | Form validation with Zod, `useActionState`, `useFormStatus`, optimistic updates with `useOptimistic` |
| `styling.md` | Tailwind CSS v4, CSS Modules, Global CSS |
| `image-font-optimization.md` | `next/image` (local/remote), `next/font/google`, `next/font/local` |
| `metadata-seo.md` | Static/dynamic metadata, `generateMetadata`, `ImageResponse` for OG images, file-based metadata |
| `turbopack-config.md` | Turbopack, React Compiler, `proxy.ts`, `next.config.ts`, self-hosting, instrumentation |
| `authentication-security.md` | Session management, authorization (DAL pattern), CSP, tainting, rate limiting |
| `navigation-hooks.md` | `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `useLinkStatus`, `redirect`, `notFound`, `forbidden`, `unauthorized` |
| `advanced-apis.md` | `after()`, `connection()`, `cacheTag()`, `draftMode()`, `generateSitemaps()`, JSON-LD |
| `components-next.md` | `<Form>`, `<Script>`, `<ViewTransition>`, `<Suspense>`, `loading.js` vs `<Suspense>` |
| `static-exports.md` | `output: 'export'`, Docker self-hosting, production checklist, multi-server deployments |
| `instrumentation-mcp.md` | `instrumentation.ts`, `instrumentation-client.ts`, MCP server, OpenTelemetry, Speed Insights |
| `internationalization.md` | i18n routing, dictionaries, `proxy.ts` locale detection, RTL, `Intl` formatting |
| `mdx.md` | MDX setup, custom components, frontmatter, remark/rehype plugins, Tailwind typography |
| `testing.md` | Unit, component, E2E testing with Vitest, Playwright, Cypress, Jest |
| `advanced-deployment.md` | Multi-tenant, multi-zones, bundle analyzer, PWA, sitemap, robots, video |
| `prefetching-ppr.md` | `<Link>` prefetching, manual prefetch, Partial Prerendering (PPR), rendering philosophy |
| `preserving-ui-state.md` | React `<Activity>`, state preservation across navigations, form state, testing |
| `environment-variables.md` | `.env` files, `NEXT_PUBLIC_`, runtime variables, load order, TypeScript types |
| `css-in-js.md` | styled-components, styled-jsx, emotion status, Tailwind hybrid, CSS Modules comparison |
| `lazy-loading.md` | `next/dynamic`, `React.lazy()`, `ssr: false`, magic comments, Server Component code-split |
| `custom-server.md` | Express integration, custom routing, when to avoid, existing backend proxy |
| `third-party-backend.md` | `@next/third-parties`, BFF pattern, Route Handlers, webhooks, rate limiting |
| `streaming.md` | Streaming architecture, `<Suspense>`, `loading.js`, `use()` promise, Route Handler streams, Web Vitals |
| `redirecting.md` | `redirect()`, `permanentRedirect()`, `NextResponse.redirect`, bulk redirects at scale |
| `debugging-memory.md` | VS Code debugger, DevTools server-side, React DevTools, heap profiles, memory optimization |
| `edge-runtime.md` | Edge Runtime APIs, `proxy.ts`, `NextRequest`/`NextResponse`, Adapters, `@next/routing` |
| `breaking-changes.md` | Full migration guide from Next.js 15 to 16.2.7 |

## Core Patterns

### Async Params and SearchParams

```tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const filters = (await searchParams).filters
}
```

### Async Dynamic APIs

```tsx
import { cookies, headers, draftMode } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const { isEnabled } = await draftMode()
}
```

### Route Props Helpers

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
}

export default function Layout(props: LayoutProps<'/dashboard'>) {
  return <section>{props.children}</section>
}
```

### Server Components vs Client Components

**Server Components** (default): Run on server, can be async, access DB directly, zero client JS.
**Client Components** (`"use client"`): Run in browser, use hooks/events, JS sent to client.

**Best practice:** Keep as much as possible in Server Components.

### Caching (Explicit Opt-In)

```tsx
'use cache'
import { cacheLife } from 'next/cache'

export default async function BlogPage() {
  cacheLife('days')
  const posts = await getBlogPosts()
  return <div>{/* ... */}</div>
}
```

### Server Functions

```tsx
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  await db.posts.create({ title })
  revalidateTag('posts', 'max')
}
```

### proxy.ts (Replaces middleware.ts)

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/old')) {
    return NextResponse.redirect(new URL('/new', request.url))
  }
  return NextResponse.next()
}
```

### Image Optimization

```tsx
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture"
      placeholder="blur"
      priority
    />
  )
}
```

### Font Optimization

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Metadata

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}
```

### Error Handling

```tsx
// app/blog/error.tsx
'use client'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  )
}
```

## Key Patterns to Remember

1. **Always await params/searchParams** in pages and layouts
2. **Use `"use cache"` + `cacheLife`** for explicit caching, not implicit
3. **Use `proxy.ts`** instead of `middleware.ts`
4. **Use `next/navigation`** (not `next/router`) in App Router
5. **Server Components are default** — only add `"use client"` for interactivity
6. **Use `updateTag()`** for read-your-writes, `refresh()` for uncached data
7. **Turbopack is default** — no need to configure
8. **Use `PageProps`/`LayoutProps`** for typed routes
9. **Model expected errors as return values** — don't throw in Server Actions
10. **Always verify auth inside Server Functions** — they are reachable via direct POST
11. **Import images statically** for auto width/height/blur placeholder
12. **Use `next/font`** for self-hosted fonts with zero layout shift
13. **Memoize shared data fetches** with React `cache()` for metadata + page

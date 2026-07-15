# Migration Guides

Migrate existing projects from other frameworks and platforms to Astro.

---

## Why Migrate to Astro?

- **Better performance** — Zero JS by default, islands architecture
- **Content-first** — Built for blogs, docs, marketing, e-commerce
- **Multi-framework** — Keep existing React/Vue/Svelte components
- **Simpler architecture** — No complex state management needed
- **Faster builds** — Vite-powered dev server and builds

---

## Migration Guides

Official migration guides are available for:

| Framework | Guide |
|-----------|-------|
| Create React App | [From CRA](https://docs.astro.build/en/guides/migrate-to-astro/from-create-react-app/) |
| Docusaurus | [From Docusaurus](https://docs.astro.build/en/guides/migrate-to-astro/from-docusaurus/) |
| Eleventy (11ty) | [From Eleventy](https://docs.astro.build/en/guides/migrate-to-astro/from-eleventy/) |
| Gatsby | [From Gatsby](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/) |
| GitBook | [From GitBook](https://docs.astro.build/en/guides/migrate-to-astro/from-gitbook/) |
| Gridsome | [From Gridsome](https://docs.astro.build/en/guides/migrate-to-astro/from-gridsome/) |
| Hugo | [From Hugo](https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/) |
| Jekyll | [From Jekyll](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) |
| Next.js | [From Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/) |
| NuxtJS | [From NuxtJS](https://docs.astro.build/en/guides/migrate-to-astro/from-nuxtjs/) |
| Pelican | [From Pelican](https://docs.astro.build/en/guides/migrate-to-astro/from-pelican/) |
| SvelteKit | [From SvelteKit](https://docs.astro.build/en/guides/migrate-to-astro/from-sveltekit/) |
| VuePress | [From VuePress](https://docs.astro.build/en/guides/migrate-to-astro/from-vuepress/) |
| WordPress | [From WordPress](https://docs.astro.build/en/guides/migrate-to-astro/from-wordpress/) |

---

## General Migration Steps

### 1. Create a New Astro Project

```bash
npm create astro@latest
```

### 2. Install Framework Integrations

Keep your existing components by installing the appropriate integration:

```bash
# React components
npx astro add react

# Vue components
npx astro add vue

# Svelte components
npx astro add svelte
```

### 3. Move Content

- Move Markdown files to `src/pages/` or `src/content/`
- Set up content collections for type-safe content management
- Move static assets to `public/`

### 4. Move Components

- Copy framework components (`.jsx`, `.vue`, `.svelte`) to `src/components/`
- Add `client:` directives for interactive components
- Convert framework-specific routing to Astro's file-based routing

### 5. Replace Routing

| Framework | Old Pattern | Astro Equivalent |
|-----------|------------|------------------|
| Next.js | `pages/about.tsx` | `src/pages/about.astro` |
| Next.js (App) | `app/about/page.tsx` | `src/pages/about.astro` |
| Nuxt | `pages/about.vue` | `src/pages/about.astro` |
| SvelteKit | `src/routes/about/+page.svelte` | `src/pages/about.astro` |
| Gatsby | `src/pages/about.js` | `src/pages/about.astro` |

### 6. Replace Data Fetching

| Framework | Old Pattern | Astro Equivalent |
|-----------|------------|------------------|
| Next.js (SSG) | `getStaticProps` | Frontmatter `fetch()` |
| Next.js (SSR) | `getServerSideProps` | Frontmatter `fetch()` (SSR mode) |
| Next.js (paths) | `getStaticPaths` | `getStaticPaths()` export |
| Gatsby | `graphql` queries | `fetch()` or content collections |
| Nuxt | `useAsyncData` | Frontmatter `fetch()` |

### 7. Replace Styling

- Move global CSS to `src/styles/` and import in layout
- Convert CSS modules — Astro supports them natively
- Add Tailwind with `npx astro add tailwind`

### 8. Replace Layouts

| Framework | Old Pattern | Astro Equivalent |
|-----------|------------|------------------|
| Next.js | `_app.tsx` / `_document.tsx` | `src/layouts/BaseLayout.astro` |
| Nuxt | `layouts/default.vue` | `src/layouts/BaseLayout.astro` |
| SvelteKit | `+layout.svelte` | `src/layouts/BaseLayout.astro` |

---

## From Create React App

1. Create new Astro project with React integration
2. Move React components to `src/components/`
3. Add `client:` directives to interactive components
4. Replace `react-router` with Astro file-based routing
5. Move `public/` assets directly
6. Replace `process.env` with `import.meta.env`

## From Next.js

1. Create new Astro project
2. Install React integration if keeping React components
3. Convert `pages/` directory to Astro pages or keep React pages
4. Replace `getStaticProps`/`getStaticPaths` with Astro frontmatter and `getStaticPaths()`
5. Replace `next/link` with standard `<a>` tags
6. Replace `next/image` with Astro `<Image />`
7. Move API routes to `src/pages/api/`

## From Gatsby

1. Create new Astro project
2. Convert GraphQL queries to `fetch()` or content collections
3. Move Markdown content to `src/content/` with content collections
4. Replace `gatsby-image` with Astro `<Image />`
5. Move components to `src/components/`

## From Jekyll/Hugo/Eleventy

1. Create new Astro project
2. Move Markdown files to `src/pages/` or `src/content/`
3. Replace Liquid/Go templates with `.astro` components
4. Set up content collections for type-safe frontmatter
5. Move static assets to `public/`

## From WordPress

1. Use WordPress as a headless CMS
2. Create Astro project with SSR output
3. Fetch content via WordPress REST API or WPGraphQL
4. Create content collections or fetch in frontmatter
5. Deploy Astro site separately from WordPress backend

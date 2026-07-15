# Integrations

Astro integrations add framework support, adapters, and additional functionality.

---

## Official Integrations

### Front-end Frameworks

| Integration | Package | Install |
|-------------|---------|---------|
| Alpine.js | `@astrojs/alpinejs` | `npx astro add alpinejs` |
| Preact | `@astrojs/preact` | `npx astro add preact` |
| React | `@astrojs/react` | `npx astro add react` |
| SolidJS | `@astrojs/solid-js` | `npx astro add solid-js` |
| Svelte | `@astrojs/svelte` | `npx astro add svelte` |
| Vue | `@astrojs/vue` | `npx astro add vue` |

### Adapters (for SSR)

| Adapter | Package | Install |
|---------|---------|---------|
| Cloudflare | `@astrojs/cloudflare` | `npx astro add cloudflare` |
| Netlify | `@astrojs/netlify` | `npx astro add netlify` |
| Node | `@astrojs/node` | `npx astro add node` |
| Vercel | `@astrojs/vercel` | `npx astro add vercel` |

### Other Integrations

| Integration | Package | Purpose |
|-------------|---------|---------|
| Markdoc | `@astrojs/markdoc` | Markdoc content support |
| MDX | `@astrojs/mdx` | MDX content support |
| Partytown | `@astrojs/partytown` | Offload third-party scripts to web workers |
| Sitemap | `@astrojs/sitemap` | Auto-generate sitemap.xml |

---

## Automatic Integration Setup

```bash
# Interactive setup
npx astro add react

# Multiple at once
npx astro add react tailwind mdx
```

This automatically:
1. Installs the npm package
2. Updates `astro.config.mjs`
3. Updates `tsconfig.json` if needed

### Manual Installation

```bash
npm install @astrojs/react react react-dom
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

### Custom Options

```js
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      include: ['**/components/react/**'],
    }),
  ],
});
```

### Toggle an Integration

```js
const enableReact = true;

export default defineConfig({
  integrations: [
    enableReact && react(),
  ].filter(Boolean),
});
```

---

## React Integration

```js
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

```astro
---
import Counter from '../components/Counter.jsx';
---
<Counter client:visible />
```

## Vue Integration

```js
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
});
```

```astro
---
import VueCounter from '../components/VueCounter.vue';
---
<VueCounter client:visible />
```

## Svelte Integration

```js
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [svelte()],
});
```

```astro
---
import SvelteSearch from '../components/SvelteSearch.svelte';
---
<SvelteSearch client:load />
```

---

## MDX Integration

```bash
npx astro add mdx
```

```js
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
});
```

Use `.mdx` files in `src/pages/` or content collections:

```mdx
---
title: My MDX Post
---
import Chart from '../components/Chart.jsx';

# Hello from MDX

<Chart client:visible data={data} />
```

---

## Adapters (SSR)

Adapters enable server-side rendering:

```bash
npx astro add node
```

```js
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // or 'hybrid'
  adapter: node({
    mode: 'standalone',
  }),
});
```

### Output Modes

| Mode | Description |
|------|-------------|
| `static` | Default — all pages prerendered to HTML |
| `server` | All pages rendered on demand (SSR) |
| `hybrid` | Static by default, opt-in SSR per route |

---

## Building Your Own Integration

```ts
import type { AstroIntegration } from 'astro';

const myIntegration: AstroIntegration = {
  name: 'my-integration',
  hooks: {
    'astro:config:setup': ({ config, updateConfig, addRenderer }) => {
      // Modify config, add renderers, etc.
    },
    'astro:build:setup': ({ vite, target }) => {
      // Modify Vite config
    },
    'astro:build:done': ({ pages, dir }) => {
      // Post-build tasks
    },
  },
};

export default myIntegration;
```

### Available Hooks

| Hook | When | Use Case |
|------|------|----------|
| `astro:config:setup` | Config initialization | Add renderers, update config, inject scripts |
| `astro:config:done` | Config finalized | Read final config |
| `astro:server:setup` | Dev server setup | Add middleware, configure server |
| `astro:server:start` | Dev server starting | Last-minute setup |
| `astro:server:done` | Dev server stopped | Cleanup |
| `astro:build:setup` | Build starting | Modify Vite config |
| `astro:build:start` | Build started | Pre-build tasks |
| `astro:build:done` | Build complete | Post-build tasks, generate files |

---

## Publishing Your Integration

1. Create a package with `astro-integration` keyword on npm
2. Export the integration as default
3. Document config options
4. Test with `astro add` flow

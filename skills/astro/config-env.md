# Configuration & Environment Variables

---

## The Astro Config File

`astro.config.mjs` (or `.ts`, `.js`, `.cjs`) at the project root:

```ts
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Site URL (used for sitemaps, canonical URLs)
  site: 'https://example.com',

  // Base path for deployment under a subpath
  base: '/docs',

  // Output mode: 'static' | 'server' | 'hybrid'
  output: 'static',

  // Server config (dev & SSR)
  server: {
    host: true,
    port: 4321,
  },

  // Integrations
  integrations: [react(), mdx()],

  // Adapter (for SSR)
  adapter: undefined,

  // Vite config overrides
  vite: {
    // Custom Vite options
  },

  // Build options
  build: {
    format: 'directory', // 'directory' | 'file'
    inlineStylesheets: 'auto', // 'always' | 'auto' | 'never'
  },

  // Image service
  image: {
    service: 'passthrough', // or custom
  },

  // Redirects
  redirects: {
    '/old': '/new',
  },

  // Prefetch
  prefetch: true,

  // i18n
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es'],
  },
});
```

### Key Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `site` | `string` | — | Canonical URL |
| `base` | `string` | `/` | Base path for deployment |
| `output` | `string` | `static` | Rendering mode |
| `trailingSlash` | `string` | `ignore` | `ignore` \| `always` \| `never` |
| `build.format` | `string` | `directory` | `directory` \| `file` |
| `build.inlineStylesheets` | `string` | `auto` | CSS inlining strategy |
| `redirects` | `object` | `{}` | Route redirects |
| `prefetch` | `boolean` | `false` | Enable link prefetching |
| `i18n` | `object` | — | Internationalization config |

---

## TypeScript Config

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

Available presets:
- `astro/tsconfigs/base` — minimal
- `astro/tsconfigs/strict` — recommended, strict
- `astro/tsconfigs/strictest` — maximum strictness

---

## Environment Variables

### Vite's Built-in Support

```env
# .env
PUBLIC_API_URL=https://api.example.com
SECRET_API_KEY=secret123
```

- Variables prefixed with `PUBLIC_` are available in client-side code
- All other variables are server-only

```astro
---
// Server-side (all env vars)
const apiKey = import.meta.env.SECRET_API_KEY;
---

<script>
// Client-side (PUBLIC_ vars only)
console.log(import.meta.env.PUBLIC_API_URL);
</script>
```

### TypeScript IntelliSense

```ts
// src/env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly SECRET_API_KEY: string;
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Default Environment Variables

| Variable | Description |
|----------|-------------|
| `import.meta.env.MODE` | `development` or `production` |
| `import.meta.env.PROD` | `true` in production |
| `import.meta.env.DEV` | `true` in development |
| `import.meta.env.BASE_URL` | Configured base path |
| `import.meta.env.SITE` | Configured site URL |

### Setting Environment Variables

#### `.env` Files

```env
# .env (all environments)
PUBLIC_API_URL=https://api.example.com

# .env.production
PUBLIC_ANALYTICS_ID=UA-XXXXX

# .env.development
PUBLIC_DEBUG=true
```

#### In Astro Config

```js
// astro.config.mjs
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');
export default defineConfig({
  site: env.SITE_URL,
});
```

#### Using the CLI

```bash
PUBLIC_API_URL=https://api.example.com astro build
```

---

## Type-Safe Environment Variables

```ts
// src/env.ts
import { z } from 'astro/zod';

const envSchema = z.object({
  PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  SECRET_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(import.meta.env);
```

### Variable Types

```ts
const env = {
  // String
  PUBLIC_API_URL: z.string(),
  // Number
  PORT: z.coerce.number().default(4321),
  // Boolean
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  // URL
  DATABASE_URL: z.string().url(),
};
```

### Retrieving Secrets Dynamically

```ts
const secret = await astro.session?.get('secret');
```

### Limitations

- `import.meta.env` is statically replaced at build time
- Dynamic key access (`import.meta.env[varName]`) does not work
- Use `process.env` for runtime-only access in SSR

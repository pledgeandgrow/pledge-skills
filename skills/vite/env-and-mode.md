# Environment Variables and Modes

## Built-in Constants

Vite exposes env variables via `import.meta.env`:

| Variable | Description |
|----------|-------------|
| `import.meta.env.MODE` | The mode the app is running in (e.g., `development`, `production`) |
| `import.meta.env.BASE_URL` | The base URL the app is served from |
| `import.meta.env.PROD` | `true` in production |
| `import.meta.env.DEV` | `true` in development |
| `import.meta.env.SSR` | `true` when building for SSR |

```ts
if (import.meta.env.DEV) {
  console.log('Running in dev mode')
}
```

---

## Env Variables

Vite exposes env variables prefixed with `VITE_` to your client code:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

```ts
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_APP_TITLE)
```

### Type Definition

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## .env Files

Vite loads `.env` files based on the mode:

| File | Loaded When |
|------|-------------|
| `.env` | Always |
| `.env.local` | Always (ignored by git) |
| `.env.[mode]` | Only in specified mode |
| `.env.[mode].local` | Only in specified mode (ignored by git) |

### Example

```
.env                # default values
.env.development    # dev-specific
.env.production     # prod-specific
.env.development.local  # local dev overrides (gitignored)
```

### Priority

Later files override earlier ones:
1. `.env`
2. `.env.[mode]`
3. `.env.local`
4. `.env.[mode].local`

### Rules

- Only variables prefixed with `VITE_` are exposed to client code
- Variables without the prefix are only available in `vite.config.ts`
- `.env.*.local` files should be gitignored

### Expanding Variables

```bash
# .env
VITE_BASE_URL=https://api.example.com
VITE_API_URL=${VITE_BASE_URL}/v1
```

---

## Modes

Modes determine which `.env` files are loaded and the value of `import.meta.env.MODE`.

### Default Modes

- **`development`** — `vite` / `vite dev` / `vite serve`
- **`production`** — `vite build`
- **`staging`** — `vite build --mode staging`

### Custom Modes

```bash
# Build with custom mode
vite build --mode staging
```

```bash
# .env.staging
VITE_API_URL=https://staging-api.example.com
```

### Using Modes in Config

```ts
export default defineConfig(({ mode }) => {
  if (mode === 'staging') {
    return {
      build: { outDir: 'dist-staging' },
    }
  }
  return {}
})
```

---

## NODE_ENV and Modes

`NODE_ENV` and mode are separate concepts:

| Command | Mode | NODE_ENV |
|---------|------|----------|
| `vite` | `development` | `development` |
| `vite build` | `production` | `production` |
| `vite build --mode staging` | `staging` | `production` |

`NODE_ENV` determines React/Vue devtools behavior. Mode determines which `.env` files are loaded.

### Overriding NODE_ENV

```bash
# Set NODE_ENV explicitly
NODE_ENV=development vite build
```

---

## HTML Constant Replacement

Vite replaces env variables in HTML files:

```html
<title>%VITE_APP_TITLE%</title>
<link rel="icon" href="%VITE_FAVICON_URL%" />
```

---

## Using Env Variables in Config

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
  }
})
```

---

## IntelliSense for TypeScript

```ts
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

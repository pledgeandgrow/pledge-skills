# Deployment

Astro sites can be deployed to any static host or SSR-compatible platform.

---

## Output Modes & Deployment

| Mode | Config | Deployment |
|------|--------|------------|
| `static` (default) | `output: 'static'` | Any static host (CDN, GitHub Pages, Netlify, Vercel) |
| `server` | `output: 'server'` + adapter | Node server, Cloudflare Workers, Vercel, Netlify |
| `hybrid` | `output: 'hybrid'` + adapter | Mostly static, some SSR routes |

---

## Building Your Site Locally

```bash
# Build for production
astro build

# Output in ./dist/
```

### Build Output

```
dist/
  index.html
  about/
    index.html
  blog/
    post-1/
      index.html
  _astro/
    *.js
    *.css
    *.png
  assets/
    ...
```

### `build.format` Options

| Format | Output | Example |
|--------|--------|---------|
| `directory` (default) | `about/index.html` | `/about/` |
| `file` | `about.html` | `/about.html` |

---

## Adding an Adapter for SSR

```bash
# Node.js adapter
npx astro add node

# Cloudflare
npx astro add cloudflare

# Netlify
npx astro add netlify

# Vercel
npx astro add vercel
```

```js
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

---

## Quick Deploy Options

### Website UI

| Provider | Method |
|----------|--------|
| Netlify | Drag `dist/` folder to Netlify Drop |
| Vercel | Import Git repo in Vercel dashboard |
| Cloudflare Pages | Connect repo in Cloudflare dashboard |

### CLI Deployment

#### Vercel

```bash
npm i -g vercel
vercel
```

#### Netlify

```bash
npm i -g netlify-cli
netlify deploy
netlify deploy --prod  # production
```

#### Cloudflare Pages

```bash
npm i -g wrangler
wrangler pages deploy dist
```

---

## Deployment Guides

### GitHub Pages

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repo-name/',
});
```

```bash
npm run build
# Push dist/ to gh-pages branch
```

### Netlify

```toml
# netlify.toml
[build]
  command = "astro build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

Astro is auto-detected by Vercel. No config needed for static sites.

For SSR:
```bash
npx astro add vercel
```

### Cloudflare

```bash
npx astro add cloudflare
```

```js
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
```

### Node.js (Self-hosted)

```bash
npx astro add node
```

```js
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

```bash
npm run build
node ./dist/server/entry.mjs
```

### Docker

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

```bash
docker build -t my-astro-site .
docker run -p 4321:4321 my-astro-site
```

---

## Environment Variables in Production

Set environment variables on your hosting platform:

| Provider | Method |
|----------|--------|
| Vercel | Dashboard → Settings → Environment Variables |
| Netlify | Dashboard → Site settings → Environment variables |
| Cloudflare | `wrangler secret put VAR_NAME` |
| Node.js | `VAR=value node ./dist/server/entry.mjs` |

---

## Prefetching

Enable link prefetching for faster navigation:

```js
export default defineConfig({
  prefetch: true,
});
```

Or per-link:

```astro
<a href="/about" data-astro-prefetch>About</a>
```

---

## Custom 404 in Production

- **Static:** `src/pages/404.astro` is built as `404.html`
- **SSR:** Configure error handling in adapter or middleware

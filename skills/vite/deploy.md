# Deploying a Static Site

## Building the App

```bash
npm run build
```

Output goes to `dist/` by default. Configure via `build.outDir`.

### Testing the App Locally

```bash
npm run preview
```

Preview the production build locally before deploying.

---

## GitHub Pages

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Base Path for GitHub Pages

```ts
// vite.config.ts
export default defineConfig({
  base: '/my-repo-name/',
})
```

---

## GitLab Pages and GitLab CI

```yaml
# .gitlab-ci.yml
pages:
  image: node:20
  stage: deploy
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist
  publish: dist
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

```ts
// vite.config.ts
export default defineConfig({
  base: '/',
})
```

---

## Netlify

### Netlify CLI

```bash
npm install -D netlify-cli
netlify deploy
netlify deploy --prod  # production deploy
```

### Netlify with Git

Configure in Netlify dashboard:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Vercel

### Vercel CLI

```bash
npm install -D vercel
vercel
vercel --prod  # production deploy
```

### Vercel with Git

Configure in Vercel dashboard:
- **Framework Preset**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`

### vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Cloudflare

### Cloudflare Workers

```bash
npm create cloudflare@latest my-app -- --framework=vite
```

### Cloudflare Pages

1. Connect repository in Cloudflare Pages dashboard
2. **Build command**: `npm run build`
3. **Build output directory**: `dist`

```bash
# Wrangler CLI
npx wrangler pages deploy dist
```

---

## Google Firebase

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

```bash
npm run build
firebase deploy
```

---

## Surge

```bash
npm install -g surge
npm run build
surge dist my-project.surge.sh
```

---

## Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: /
          app_artifact_location: dist
```

---

## Render

```yaml
# render.yaml
services:
  - type: web
    name: my-vite-app
    env: static
    buildCommand: npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## SPA Fallback

For Single Page Applications, configure redirects/rewrites so all routes serve `index.html`:

| Platform | Method |
|----------|--------|
| Netlify | `[[redirects]]` in `netlify.toml` |
| Vercel | `rewrites` in `vercel.json` |
| Cloudflare | `_redirects` file |
| Firebase | `rewrites` in `firebase.json` |
| Nginx | `try_files` directive |
| Apache | `.htaccess` mod_rewrite |

# Vite

Vite is a next-generation frontend build tool that provides a fast development server and optimized production builds. It uses native ES modules for dev and Rolldown for production bundling.

**Version**: Vite 8.x (Rolldown-based, Oxc transformer)

---

## Quick Reference

| Topic | File |
|------|------|
| Getting Started (scaffolding, CLI, project root) | `getting-started.md` |
| Philosophy (why Vite, design principles) | `philosophy.md` |
| Features (HMR, CSS, TypeScript, JSX, Web Workers, WASM) | `features.md` |
| CLI (commands, options, flags) | `cli.md` |
| Using Plugins (adding, finding, ordering) | `plugins.md` |
| Dependency Pre-Bundling (caching, customization) | `dep-pre-bundling.md` |
| Static Asset Handling (imports, public dir, URL) | `assets.md` |
| Building for Production (chunking, multi-page, library mode) | `build.md` |
| Deploying a Static Site (GitHub Pages, Netlify, Vercel, Cloudflare) | `deploy.md` |
| Env Variables and Modes (.env files, NODE_ENV) | `env-and-mode.md` |
| Server-Side Rendering (SSR config, SSG) | `ssr.md` |
| Backend Integration (API proxying, monorepo) | `backend-integration.md` |
| Troubleshooting (common issues, fixes) | `troubleshooting.md` |
| Performance (optimization, tuning) | `performance.md` |
| Migration from v7 (breaking changes, Rolldown) | `migration.md` |
| Plugin API (hooks, authoring plugins) | `plugin-api.md` |
| HMR API (hot.accept, hot.dispose, hot.invalidate) | `hmr-api.md` |
| JavaScript API (createServer, build, transform) | `javascript-api.md` |
| Config Reference (vite.config.ts full reference) | `config-reference.md` |
| Environment API (instances, plugins, runtimes) | `environment-api.md` |

---

## Core Concepts

- **Dev Server**: Native ESM-based dev server with instant server start and HMR
- **Build**: Rolldown-based production bundling with code splitting and tree-shaking
- **HMR**: Hot Module Replacement over native ESM — precise updates without page reload
- **Plugins**: Rollup-compatible plugin system with Vite-specific hooks
- **Dependency Pre-Bundling**: Pre-bundles dependencies with Rolldown for fast cold starts
- **Environment API**: Multi-environment support (client, SSR, worker, custom runtimes)

---

## First Project

```bash
# Scaffold a new project
npm create vite@latest my-app -- --template react-ts

cd my-app
npm install
npm run dev
```

---

## Architecture at a Glance

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Dev server | Native ESM + Rolldown | Fast HMR, no bundling during dev |
| Dependency optimizer | Rolldown | Pre-bundle deps for fast cold start |
| JS/TS transpiler | Oxc | TypeScript + JSX transformation |
| Production bundler | Rolldown | Code splitting, tree-shaking, minification |
| CSS | PostCSS / Lightning CSS | CSS processing and minification |
| Plugin system | Rollup-compatible | Extensible build pipeline |

---

## Official Documentation

- [Vite Docs](https://vite.dev/guide/)
- [Config Reference](https://vite.dev/config/)
- [Plugin API](https://vite.dev/guide/api-plugin)
- [Vite GitHub](https://github.com/vitejs/vite)

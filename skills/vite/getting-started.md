# Getting Started

## Overview

Vite (French for "fast") is a build tool that provides a fast development server and optimized production builds. It uses native ES modules during development and Rolldown for production bundling.

### Browser Support

- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

### Try Vite Online

- [StackBlitz](https://vite.new/) — React template
- [vite.new/vue](https://vite.new/vue) — Vue template
- [vite.new/svelte](https://vite.new/svelte) — Svelte template

---

## Scaffolding Your First Vite Project

```bash
# npm
npm create vite@latest my-app -- --template react-ts

# yarn
yarn create vite my-app --template react-ts

# pnpm
pnpm create vite my-app --template react-ts

# bun
bun create vite my-app --template react-ts
```

### Supported Templates

| Template | Flag |
|----------|------|
| Vanilla | `vanilla` |
| Vue | `vue` |
| React | `react` |
| React + SWC | `react-swc` |
| Preact | `preact` |
| Lit | `lit` |
| Svelte | `svelte` |
| Solid | `solid` |
| Qwik | `qwik` |
| Vanilla TS | `vanilla-ts` |
| Vue TS | `vue-ts` |
| React TS | `react-ts` |
| React + SWC TS | `react-swc-ts` |
| Preact TS | `preact-ts` |
| Lit TS | `lit-ts` |
| Svelte TS | `svelte-ts` |
| Solid TS | `solid-ts` |
| Qwik TS | `qwik-ts` |

### Community Templates

```bash
# Browse community templates
npm create vite@latest -- --template roose
```

---

## Manual Installation

```bash
npm install -D vite
```

```html
<!-- index.html -->
<div id="app"></div>
<script type="module" src="/main.js"></script>
```

```js
// main.js
document.querySelector('#app').innerHTML = '<h1>Hello Vite!</h1>'
```

```bash
npx vite
```

---

## index.html and Project Root

Vite treats `index.html` as the entry point and source of truth for the project. The project root is the directory containing `index.html`.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- `<script type="module">` — treated as JS entry points
- Absolute paths (`/src/main.ts`) are resolved from project root
- Relative paths (`./main.ts`) are resolved from the HTML file location

### Specifying a Different Root

```bash
vite serve ./my-root/
# or
vite --root ./my-root/
```

---

## Command Line Interface

```bash
# Development
npm run dev          # or: npx vite

# Build for production
npm run build        # or: npx vite build

# Preview production build
npm run preview      # or: npx vite preview
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

See `cli.md` for full CLI reference.

---

## Using Unreleased Commits

If you want to test the latest unreleased Vite version:

```bash
# Clone the repo
git clone https://github.com/vitejs/vite.git
cd vite

# Build
pnpm install
pnpm build

# Link locally
cd packages/vite
pnpm link --global

# Use in your project
pnpm link --global vite
```

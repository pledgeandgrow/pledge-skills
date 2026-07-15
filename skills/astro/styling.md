# Styling

Astro has built-in CSS support with scoped styles, global styles, and integrations for Tailwind, Sass, and more.

---

## Scoped Styles

`<style>` tags inside `.astro` components are **scoped by default** — styles only apply to that component:

```astro
---
// Button.astro
---
<button class="btn">Click me</button>
<style>
  .btn {
    background: blue;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
</style>
```

Astro automatically adds a unique `data-astro-cid-*` attribute to scope styles.

---

## Global Styles

Use `is:global` directive for unscoped styles:

```astro
<style is:global>
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
```

Or import a global stylesheet in a layout:

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
```

---

## Combining Classes with `class:list`

```astro
---
const isActive = true;
---
<button class:list={[
  'btn',
  { active: isActive, disabled: !isActive },
  'primary'
]}>Click</button>
```

---

## CSS Variables

CSS variables defined in scoped styles can be used by child components:

```astro
---
// Parent.astro
---
<div class="parent">
  <Child />
</div>
<style>
  .parent {
    --card-bg: #f0f0f0;
    --card-padding: 1rem;
  }
</style>
```

```astro
---
// Child.astro
---
<div class="card">Content</div>
<style>
  .card {
    background: var(--card-bg);
    padding: var(--card-padding);
  }
</style>
```

---

## Passing a Class to a Child Component

```astro
---
// Card.astro
const { class: className } = Astro.props;
---
<div class={`card ${className}`}>
  <slot />
</div>
```

```astro
<Card class="featured">Content</Card>
```

---

## Inline Styles

```astro
<div style="background: red; padding: 1rem;">Box</div>

<!-- Dynamic -->
<div style={`background: ${color};`}>Box</div>

<!-- Object syntax -->
<div style={{ backgroundColor: 'red', padding: '1rem' }}>Box</div>
```

---

## External Styles

### Import a Local Stylesheet

```astro
---
import '../styles/global.css';
import './Button.css';
---
```

### Import from npm Package

```astro
---
import 'normalize.css';
import '@fontsource/inter';
---
```

### Link Tags

```astro
<link rel="stylesheet" href="/styles/global.css" />
```

---

## Cascading Order

1. **Scoped styles** in component `<style>` tags
2. **Imported stylesheets** (via `import` in frontmatter)
3. **Link tags** in `<head>`

Later styles override earlier ones. Scoped styles have higher specificity due to attribute selectors.

---

## Tailwind CSS

### Tailwind 4

```bash
npx astro add tailwind
```

This installs `@tailwindcss/vite` and adds it to `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Add an `@import` to your global CSS:

```css
/* src/styles/global.css */
@import "tailwindcss";
```

### Upgrade from Tailwind 3

Remove `@astrojs/tailwind` integration and the `tailwind.config.mjs` file, then follow the Tailwind 4 setup above.

---

## CSS Preprocessors

### Sass / SCSS

```astro
<style lang="scss">
  $primary: #007bff;
  .btn {
    background: $primary;
    &:hover {
      background: darken($primary, 10%);
    }
  }
</style>
```

```bash
npm install sass
```

### Stylus / Less

```astro
<style lang="stylus">
  .btn
    background blue
</style>

<style lang="less">
  @primary: blue;
  .btn { background: @primary; }
</style>
```

### LightningCSS

```js
// astro.config.mjs
export default defineConfig({
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
});
```

---

## PostCSS

Astro processes all CSS through PostCSS by default. Add a `postcss.config.cjs`:

```js
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
```

---

## Framework Component Styling

Framework components (React, Vue, Svelte) use their own styling approach:

- **React/Preact:** CSS modules, styled-components, Tailwind classes
- **Vue:** `<style scoped>` in SFC
- **Svelte:** `<style>` in Svelte components

---

## Production

### Bundle Control

```js
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto', // 'always' | 'auto' | 'never'
  },
});
```

---

## Advanced

### Raw CSS Imports

```astro
---
import rawCss from './styles.css?raw';
---
```

### URL CSS Imports

```astro
---
import cssUrl from './styles.css?url';
---
<link rel="stylesheet" href={cssUrl} />
```

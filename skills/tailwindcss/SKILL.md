---
name: tailwindcss-docs
version: "4.x"
tags:
  - tailwindcss
  - css
  - styling
  - responsive
  - design
  - utility-classes
description: |
  Comprehensive Tailwind CSS v4 reference covering installation, all utility classes,
  responsive design, dark mode, customization, and advanced patterns. Use whenever the
  user mentions Tailwind CSS, utility classes, styling components, responsive layouts,
  custom themes, or needs help with any Tailwind-specific code, configuration, or design.
---

# Tailwind CSS Expert (v4.x)

**Official Documentation:** https://tailwindcss.com/docs

## Quick Reference

| Topic | File |
|-------|------|
| Installation, setup, configuration | `installation-setup.md` |
| Core concepts: utility-first, states, arbitrary values | `core-concepts.md` |
| Layout: display, position, z-index, overflow | `layout.md` |
| Flexbox: direction, wrap, justify, align, grow, shrink | `flexbox.md` |
| Grid: template, columns, rows, gap, span, auto-flow | `grid.md` |
| Spacing: margin, padding, gap, space-between | `spacing.md` |
| Sizing: width, height, min/max, aspect ratio | `sizing.md` |
| Colors: palette, opacity, dark mode, CSS variables | `colors.md` |
| Typography: font size, weight, family, line-height, color | `typography.md` |
| Backgrounds: color, gradient, image, size, position | `backgrounds.md` |
| Borders: radius, width, color, style, outline, ring | `borders.md` |
| Effects: shadow, opacity, blend modes, filters | `effects.md` |
| Transitions & Animation: duration, easing, keyframes | `transitions-animation.md` |
| Transforms: scale, rotate, translate, skew, origin | `transforms.md` |
| Interactivity: cursor, pointer-events, user-select, scroll | `interactivity.md` |
| Responsive design: breakpoints, container queries | `responsive-design.md` |
| Customization: theme, plugins, @theme, CSS-first config | `customization.md` |

## Tailwind CSS v4 Key Changes

Tailwind CSS v4 is a **CSS-first** framework:

- **No JavaScript config** — configuration is done in CSS via `@theme`
- **No `tailwind.config.js`** — use `@import "tailwindcss"` and `@theme` blocks in CSS
- **Zero runtime** — pure CSS output, no JavaScript needed in production
- **Vite plugin** — built-in integration with Vite for instant HMR
- **PostCSS plugin** — traditional build pipeline support

```css
/* v4: CSS-first configuration */
@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
  --font-sans: "Inter", system-ui, sans-serif;
  --spacing-*: initial;
  --spacing-xs: 0.5rem;
}
```

## Installation

### With Vite (Recommended)

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### With PostCSS

```bash
npm install tailwindcss postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

```css
/* src/index.css */
@import "tailwindcss";
```

### With Tailwind CLI

```bash
npx tailwindcss -i src/input.css -o dist/output.css --watch
```

### Play CDN (Prototyping)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Utility-First Philosophy

```html
<!-- Traditional CSS -->
<style>
  .chat-notification {
    display: flex;
    max-width: 24rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
</style>
<div class="chat-notification">...</div>

<!-- Tailwind -->
<div class="flex max-w-sm mx-auto p-6 rounded-lg bg-white shadow-xl">
  ...
</div>
```

## Core Syntax

| Pattern | Example | Result |
|---------|---------|--------|
| Basic utility | `p-4` | `padding: 1rem` |
| State prefix | `hover:bg-blue-500` | Apply on hover |
| Responsive prefix | `md:p-4` | Apply at `md` breakpoint and up |
| Dark mode | `dark:bg-black` | Apply in dark mode |
| Arbitrary value | `w-[100px]` | Custom width |
| Arbitrary property | `[mask-type:luminance]` | Custom CSS property |
| Modifier stack | `md:hover:dark:bg-red-500` | Combined |
| Important | `!p-4` | `padding: 1rem !important` |
| Negative | `-m-4` | `margin: -1rem` |

## Breakpoints (Mobile-First)

| Name | CSS | px | rem |
|------|-----|----|-----|
| `sm` | `@media (min-width: 640px)` | 640 | 40 |
| `md` | `@media (min-width: 768px)` | 768 | 48 |
| `lg` | `@media (min-width: 1024px)` | 1024 | 64 |
| `xl` | `@media (min-width: 1280px)` | 1280 | 80 |
| `2xl` | `@media (min-width: 1536px)` | 1536 | 96 |

**Mobile-first:** Utilities without prefix apply everywhere. Prefixed utilities override at their breakpoint and up.

```html
<div class="text-sm md:text-base lg:text-lg">
  <!-- small on mobile, base at md, large at lg -->
</div>
```

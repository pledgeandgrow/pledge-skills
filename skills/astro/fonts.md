# Fonts

Astro provides built-in font management through the `fonts` config option with support for popular providers.

---

## Configuring Custom Fonts

Register fonts in `astro.config.mjs`:

```ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
    },
    {
      name: 'Roboto Mono',
      cssVariable: '--font-mono',
      provider: 'google',
    },
  ],
});
```

### Font Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Font family name |
| `cssVariable` | `string` | CSS custom property name |
| `provider` | `string` | Font provider (see below) |
| `weights` | `number[]` | Font weights to load |
| `styles` | `string[]` | Styles (`normal`, `italic`) |
| `subsets` | `string[]` | Language subsets |
| `fallbacks` | `string[]` | Fallback font families |
| `display` | `string` | `swap`, `block`, `fallback`, `optional` |
| `preload` | `boolean` | Preload font files (default: `true`) |
| `optimizedFallbacks` | `boolean` | Use metric-optimized fallbacks |

---

## Built-in Font Providers

| Provider | Description |
|----------|-------------|
| `google` | Google Fonts |
| `fontsource` | Fontsource (npm packages) |
| `adobe` | Adobe Fonts |
| `bunny` | Bunny Fonts (privacy-friendly Google Fonts mirror) |
| `fontshare` | Fontshare by Indian Type Foundry |
| `google-icons` | Google Material Icons |
| `local` | Local font files |

---

## Using a Local Font File

```ts
export default defineConfig({
  fonts: [
    {
      name: 'MyCustomFont',
      cssVariable: '--font-custom',
      provider: 'local',
      src: ['./src/fonts/MyCustomFont.woff2'],
    },
  ],
});
```

---

## Using Fontsource

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'fontsource',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
    },
  ],
});
```

---

## Using Google Fonts

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  ],
});
```

---

## Applying Custom Fonts

Use the CSS variable in your styles:

```astro
<style>
  body {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
  code {
    font-family: var(--font-mono), monospace;
  }
</style>
```

---

## Preloading Fonts

Astro automatically preloads font files for performance. Disable with:

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
      preload: false,
    },
  ],
});
```

---

## Register Fonts in Tailwind

Use the CSS variable in your Tailwind config:

```css
/* Tailwind 4 (CSS-first config) */
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-mono), monospace;
}
```

---

## Variable Fonts

Variable fonts are supported — specify the weight range:

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
      weights: ['100 900'], // variable font range
    },
  ],
});
```

---

## Customizing Font Fallbacks

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
      fallbacks: ['system-ui', 'Arial', 'sans-serif'],
      optimizedFallbacks: true, // metric-optimized fallbacks
    },
  ],
});
```

---

## Accessing Font Data Programmatically

```ts
import { getFontConfig } from 'astro:fonts';

const fonts = getFontConfig();
```

---

## Granular Font Configuration

```ts
export default defineConfig({
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: 'google',
      // Fine-grained control
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext', 'cyrillic'],
      display: 'swap',
      preload: true,
      formats: ['woff2', 'woff'],
      unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153',
      featureSettings: '"liga" 1, "kern" 1',
      variationSettings: '"wght" 400',
    },
  ],
});
```

---

## Caching

Font files are cached during development. In production, fonts are bundled and served with content hashing for long-term caching.

# Building for Production

## Basic Build

```bash
vite build
```

By default, uses `<root>/index.html` as the build entry point and produces a bundle suitable for static hosting.

---

## Browser Compatibility

Default targets (Baseline Widely Available):
- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

Customize via `build.target`:

```ts
export default defineConfig({
  build: {
    target: 'es2015',  // or ['es2020', 'edge88', 'firefox78']
  },
})
```

Minimum required (relies on native ESM dynamic import + `import.meta`):
- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

### Legacy Browser Support

```bash
npm install -D @vitejs/plugin-legacy
```

```ts
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

---

## Public Base Path

```bash
# CLI flag
vite build --base=/my/public/path/

# Config
export default defineConfig({
  base: '/my/public/path/',
})
```

All asset paths (JS, CSS, HTML) are automatically rewritten. Use `import.meta.env.BASE_URL` for dynamic URL construction.

### Relative Base

```ts
export default defineConfig({
  base: './',  // relative paths
})
```

---

## Customizing the Build

### Rolldown Options

```ts
export default defineConfig({
  build: {
    rolldownOptions: {
      // https://rolldown.rs/reference/
    },
  },
})
```

### Chunking Strategy

```ts
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Configure chunk splitting
        },
      },
    },
  },
})
```

---

## Load Error Handling

Vite emits `vite:preloadError` when dynamic imports fail to load:

```ts
window.addEventListener('vite:preloadError', (event) => {
  // Reload page to load fresh assets
  window.location.reload()
})
```

Set `Cache-Control: no-cache` on HTML files to prevent stale asset references.

---

## Rebuild on Files Changes

```bash
# Watch mode
vite build --watch
```

```ts
export default defineConfig({
  build: {
    watch: {
      // WatcherOptions
    },
  },
})
```

---

## Multi-Page App

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
      },
    },
  },
})
```

During dev, navigate to `/nested/` — works like a normal static file server.

---

## Library Mode

### Single Entry

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      fileName: 'my-lib',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

### Multiple Entries

```ts
export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

### Output Formats

- Single entry: `es` and `umd`
- Multiple entries: `es` and `cjs`
- Configurable via `build.lib.formats`

```ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      formats: ['es', 'cjs', 'umd'],
    },
  },
})
```

### Recommended package.json

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

### CSS Support

Library mode outputs CSS alongside JS. Consumers import it:

```ts
import 'my-lib/dist/my-lib.css'
```

---

## Advanced Base Options

Experimental feature for independent asset paths:

```ts
export default defineConfig({
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      if (type === 'public') {
        return 'https://www.domain.com/' + filename
      } else if (hostType === 'js') {
        return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
      } else {
        return 'https://cdn.domain.com/assets/' + filename
      }
    },
  },
})
```

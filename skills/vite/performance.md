# Performance

## Review Your Browser Setup

- Disable browser extensions during development (ad blockers, etc.)
- Use Chrome/Edge for best dev server performance
- Ensure hardware acceleration is enabled
- Close unnecessary browser tabs

---

## Audit Configured Vite Plugins

Each plugin adds overhead. Audit your plugins:

```ts
// Check what plugins are active
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // Only load plugins when needed
    mode === 'development' && devOnlyPlugin(),
    mode === 'production' && prodOnlyPlugin(),
  ].filter(Boolean),
})
```

### Tips

- Remove unused plugins
- Use `apply: 'serve'` or `apply: 'build'` to limit plugin scope
- Avoid plugins that transform every file
- Use `enforce: 'pre'` sparingly

---

## Reduce Resolve Operations

### Alias Common Imports

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
})
```

### Avoid Deep Imports

```ts
// Slow: resolves through many directories
import { foo } from 'deeply/nested/path/to/module'

// Fast: use alias
import { foo } from '@mod'
```

---

## Avoid Barrel Files

Barrel files (`index.ts` that re-exports everything) can slow down dev server and builds:

```ts
// ❌ Avoid: barrel file
export * from './Button'
export * from './Input'
export * from './Modal'
export * from './Select'
// ... 50 more

// ✅ Better: direct imports
import Button from './Button'
import Input from './Input'
```

### Why Barrel Files Are Slow

- Each `export *` creates a new module to resolve
- Vite must process all re-exported modules even if only one is used
- Can cause cascading module resolution

---

## Warm Up Frequently Used Files

Vite can pre-transform frequently used files to speed up cold starts:

```ts
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        '/src/main.ts',
        '/src/App.tsx',
        '/src/components/**/*.tsx',
      ],
    },
  },
})
```

---

## Use Lesser or Native Tooling

### Oxc Transformer (Default in Vite 8)

Vite uses Oxc (Rust-based) for TypeScript and JSX transformation. This is faster than esbuild.

### Rolldown (Default in Vite 8)

Vite uses Rolldown (Rust-based) for bundling. This is faster than Rollup.

### Oxc Minifier

```ts
export default defineConfig({
  build: {
    minify: 'oxc',  // default
  },
})
```

### Lightning CSS

```ts
export default defineConfig({
  css: {
    transformer: 'lightningcss',
  },
})
```

---

## Server-Side Performance

### Disable Unnecessary Features

```ts
export default defineConfig({
  server: {
    // Disable if not needed
    hmr: false,
    // Reduce watch overhead
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
```

### Use SWC for React

```ts
// Faster than Babel for React
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
})
```

---

## Build Performance

### Parallel Processing

```ts
export default defineConfig({
  build: {
    // Increase parallelism
    rollupOptions: {
      maxParallelFileOps: 4,
    },
  },
})
```

### Disable Sourcemaps in Production

```ts
export default defineConfig({
  build: {
    sourcemap: false,  // or 'hidden' for error tracking only
  },
})
```

### Chunk Size Warnings

```ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,  // KB
  },
})
```

---

## Profiling

### CPU Profile

```bash
vite --profile
```

### Debug Logs

```bash
vite --debug
vite --debug hmr
vite --debug deps
```

### Inspect Plugin Pipeline

```bash
npx vite-plugin-inspect
```

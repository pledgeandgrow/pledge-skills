# Dependency Pre-Bundling

## The Why

Native ES imports don't support bare module imports (`import { foo } from 'my-dep'`). Vite pre-bundles dependencies to:

1. **Convert** CommonJS/UMD to ESM
2. **Improve page loading speed** — combine multiple internal files into a single module
3. **Reduce requests** — pre-bundled deps are served as single files

Pre-bundling is performed by Rolldown, making Vite's cold start time significantly faster than JavaScript-based bundlers.

---

## Automatic Dependency Discovery

Vite automatically discovers dependencies by scanning source files for bare imports during startup. Found dependencies are pre-bundled and cached.

---

## Monorepos and Linked Dependencies

Vite handles linked dependencies (e.g., via `npm link` or workspace packages) automatically. Linked deps are pre-bundled unless they are in the `optimizeDeps.exclude` list.

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['my-workspace-package'],
    exclude: ['local-only-package'],
  },
})
```

---

## Customizing the Behavior

### `optimizeDeps.include`

Force pre-bundling of specific dependencies:

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'axios'],
  },
})
```

### `optimizeDeps.exclude`

Exclude dependencies from pre-bundling:

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['my-local-package'],
  },
})
```

### `optimizeDeps.esbuildOptions`

Pass options to the pre-bundle process:

```ts
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015',
      define: { global: 'globalThis' },
    },
  },
})
```

### `optimizeDeps.onFileChange`

```ts
export default defineConfig({
  optimizeDeps: {
    onFileChange: (file) => {
      console.log('File changed:', file)
    },
  },
})
```

---

## Caching

### File System Cache

Pre-bundled dependencies are cached in `node_modules/.vite/deps/`. The cache is invalidated when:
- The `vite` version changes
- The lockfile changes (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
- The `optimizeDeps` config changes

To force re-optimization:

```bash
# Via CLI
vite --force

# Or delete cache
rm -rf node_modules/.vite
```

### Browser Cache

Pre-bundled deps are served with strong cache headers (`max-age=31536000, immutable`). The cache is busted via version hash in the URL query string.

---

## Disabling Pre-Bundling

```ts
export default defineConfig({
  optimizeDeps: {
    disabled: true,
  },
})
```

This is not recommended for most projects.

# Migration from v7

Vite 8 introduces Rolldown as the default bundler, Oxc as the JS/TS transformer and minifier, and Lightning CSS for CSS minification.

---

## Default Browser Target Change

The default browser target changed to `baseline-widely-available`:
- Chrome >=111
- Edge >=111
- Firefox >=114
- Safari >=16.4

If you need older browser support, set `build.target` explicitly:

```ts
export default defineConfig({
  build: {
    target: 'es2015',
  },
})
```

---

## Rolldown

Vite 8 uses Rolldown (Rust-based) as the default bundler, replacing Rollup.

### Gradual Migration

Rolldown is highly compatible with Rollup. Most `rollupOptions` work as-is. Some differences:

- `build.rollupOptions` → `build.rolldownOptions`
- Most Rollup plugins work with Rolldown
- Some edge cases may require adjustments

### Dependency Optimizer Now Uses Rolldown

The dependency pre-bundling step now uses Rolldown instead of esbuild. This should be transparent for most projects.

### JavaScript Transforms by Oxc

TypeScript and JSX transformation is now handled by Oxc instead of esbuild:

- `esbuild` config options → `oxc` config options
- `esbuild.target` → `build.target` or `oxc.target`
- `esbuild.jsxFactory` → `oxc.jsx.jsxFactory`

```ts
// Before (Vite 7)
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})

// After (Vite 8)
export default defineConfig({
  oxc: {
    jsx: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  },
})
```

### JavaScript Minification by Oxc

Default minifier changed from esbuild to Oxc:

```ts
// Before (Vite 7)
export default defineConfig({
  build: {
    minify: 'esbuild',
  },
})

// After (Vite 8) — Oxc is default
export default defineConfig({
  build: {
    minify: 'oxc',  // or 'terser' or 'esbuild' (still supported)
  },
})
```

### CSS Minification by Lightning CSS

CSS minification now uses Lightning CSS by default:

```ts
export default defineConfig({
  build: {
    cssMinify: 'lightningcss',  // default
    // cssMinify: 'esbuild',    // still supported
  },
})
```

---

## Consistent CommonJS Interop

Rolldown has more consistent CJS interop semantics. If you encounter issues with default imports from CJS packages:

```ts
// May need to use named imports instead
import { named } from 'cjs-package'
// instead of
import named from 'cjs-package'
```

---

## Removed Module Resolution Using Format Sniffing

Vite no longer guesses module format from file content. Ensure your packages have correct `package.json` fields (`module`, `exports`).

---

## Require Calls For Externalized Modules

In SSR builds, `require()` calls for externalized modules are now handled differently. Use `import` instead of `require` in SSR code.

---

## import.meta.url in UMD / IIFE

`import.meta.url` is no longer available in UMD/IIFE builds. Use a different approach for asset URL resolution.

---

## Removed build.rollupOptions.watch.chokidar option

Use the standard watch options instead:

```ts
export default defineConfig({
  build: {
    watch: {
      // Rolldown watch options
    },
  },
})
```

---

## Removed object form build.rollupOptions.output.manualChunks

The object form of `manualChunks` is removed. Use the function form or Rolldown's `output.codeSplitting`:

```ts
// Before (Vite 7)
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})

// After (Vite 8) — use function form or codeSplitting
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

## build() Throws BundleError

The `build()` JavaScript API now throws `BundleError` instead of generic errors. Update error handling:

```ts
try {
  await build(config)
} catch (e) {
  if (e instanceof BundleError) {
    // Handle bundle error
  }
}
```

---

## Module Type Support and Auto Detection

Rolldown has stricter module type detection. Ensure `package.json` has `"type": "module"` for ESM projects.

---

## Removed Deprecated Features

All features deprecated in Vite 7 are removed in Vite 8. Check the Vite 7 migration guide for any deprecated APIs you may be using.

---

## Migration Steps

1. **Update Vite**: `npm install vite@latest`
2. **Update plugins**: Ensure all plugins are compatible with Vite 8
3. **Rename config options**: `esbuild` → `oxc`, `rollupOptions` → `rolldownOptions`
4. **Test build**: Run `vite build` and check for errors
5. **Test dev server**: Run `vite` and verify HMR works
6. **Check browser target**: Update `build.target` if needed
7. **Update minifier**: Default is now Oxc (verify build output)
8. **Check CJS interop**: Verify default imports from CJS packages

---

## Migration from v6

If migrating from Vite 6, also review the Vite 7 migration guide for intermediate breaking changes.

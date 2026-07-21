# Rolldown — In-Depth

> Source: [Why Bundlers](https://rolldown.rs/in-depth/why-bundlers) | [Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs) | [Manual Code Splitting](https://rolldown.rs/in-depth/manual-code-splitting) | [Module Types](https://rolldown.rs/in-depth/module-types) | [External Modules](https://rolldown.rs/in-depth/external-modules) | [Why Plugin Hook Filters](https://rolldown.rs/in-depth/why-plugin-hook-filter)

## Why Do We Still Need Bundlers?

With native ES modules and HTTP/2 in modern browsers, some advocate for an unbundled approach even in production. While this works for smaller apps, bundling is still necessary for anything non-trivial.

### Skipping the Build Step is Impractical

Even in an unbundled deployment model, a build step is often unavoidable (e.g., Rails 8's import-map-based approach still fingerprints assets and generates import maps via importmap-rails and Propshaft).

The unbundled approach hits limits when you:
- Require modern JS features like ES6+, TypeScript, or JSX
- Need bundler-specific optimizations like tree-shaking, code splitting, or minification
- Utilize libraries or frameworks that depend on a build step
- Utilize NPM dependencies that ship unbundled source code (too many requests)

### The Case for Bundlers

Bundlers exist because web applications must be delivered over the network on-demand. They improve performance in three ways:

1. **Reduce network requests and waterfalls**
2. **Reduce total bytes sent over the network**
3. **Improve JavaScript execution performance**

### Reduce Network Requests and Waterfalls

HTTP/2 doesn't eliminate the need to care about request count. Most browsers/servers limit concurrent streams (~100 per connection). Every request has fixed overhead (header processing, TLS, multiplexing). Thousands of unbundled modules create network bottlenecks even under HTTP/2.

Deep import chains cause network waterfalls — multiple roundtrips to fetch the module graph. `modulepreload` directives help but require tooling support and bloating HTML with thousands of directives is itself a performance issue.

Bundling combines thousands of modules into optimal chunks, flattens import chain depth, and moves module graph combination work to build phase instead of runtime cost per visitor.

### Reduce Total Bytes Sent

- **Tree-shaking**: Eliminate dead code — only include used exports
- **Minification**: Remove whitespace, shorten variable names, eliminate unreachable code
- **Compression**: Bundlers can optimize for better gzip/brotli compression

### Improve JavaScript Execution Performance

- **Scope hoisting**: Flatten module scope, reducing function call overhead
- **Optimized module format**: Convert to optimal format for target environment
- **Dead code elimination**: Remove unused code paths at build time

## Bundling CJS

Rolldown supports mixed ESM / CJS module graphs natively, without `@rollup/plugin-commonjs`.

### Key Features

**Native CJS Support**: Rolldown natively understands CommonJS modules (`module.exports`, `require`, `exports`, `__dirname`, `__filename`).

**On-demand Execution**: CJS modules are executed on-demand, similar to ESM. Only modules that are actually imported are executed.

**ESM/CJS Interoperability**: ESM modules can import from CJS modules and vice versa. Default imports from CJS modules resolve to `module.exports`. Named imports from CJS modules are statically analyzed.

### Caveats

**`require` external modules**: When requiring external modules (marked as external), the require call is preserved in the output. This means the external module must be available at runtime via Node.js `require`.

**Ambiguous default import from CJS modules**: When importing a CJS module that has both `module.exports = foo` and `exports.bar = baz`, the default import will be `foo` and named imports will be from `exports`. This follows esbuild's semantics.

**Strict Mode Applied to `.js` files**: CJS modules in `.js` files are converted to ESM-like code, which means strict mode is applied. This may cause issues with code that relies on non-strict mode behavior.

### Future Plans

- Improved CJS detection and handling
- Better support for dynamic `require`
- Enhanced interop edge case handling

See: [Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs)

## Manual Code Splitting

### Why Use Manual Code Splitting?

Automatic code splitting doesn't consider loading performance or cache invalidation. It groups modules based on static imports, which can lead to suboptimal chunking — large chunks that aren't performant for loading or cause cache invalidation on every deployment.

### How to Use Manual Code Splitting

Configure via `output.codeSplitting` option:

```javascript
export default defineConfig({
  input: 'src/main.js',
  output: {
    codeSplitting: {
      groups: [
        {
          name: 'vendor-react',
          test: /node_modules\/react/,
          minSize: 30000,
        },
        {
          name: 'vendor-ui',
          test: /node_modules\/ui-lib/,
          minSize: 30000,
        },
      ],
    },
  },
});
```

### Benefits

**Reduce cache invalidation**: Split vendor code into separate chunks that change less frequently. When application code changes, vendor chunks remain cached.

**Improve loading performance**: Split code into smaller chunks that can be loaded in parallel. Prioritize critical chunks for initial load.

### Limitations

**Why there's always a `runtime.js` chunk**: Rolldown generates a runtime chunk containing the module loading and execution infrastructure. This is necessary for code splitting to work — the runtime provides the `import()` and chunk loading logic.

**Why does the group contain modules that don't satisfy the constraints?**: Rolldown may include shared dependencies in a group to avoid duplicating them across chunks. A module that is shared between multiple groups may be placed in the group that best matches the constraints.

**Why is the chunk bigger than `maxSize`?**: `maxSize` is a hint, not a hard limit. Rolldown tries to respect it but may exceed it to avoid creating very small chunks or splitting modules that can't be split.

See: [Manual Code Splitting](https://rolldown.rs/in-depth/manual-code-splitting)

## Module Types

Module types are an experimental concept similar to esbuild's `loader` option. They allow associating file extensions with built-in module types.

### How Module Types Affect Users

End users usually don't need to concern themselves with module types — Rolldown automatically recognizes and handles known types based on file extensions.

By default, Rolldown determines module type from file extension. For custom extensions, use `moduleTypes`:

```javascript
export default {
  moduleTypes: {
    '.data': 'json',
  },
};
```

### Module Types and Plugins

Plugins can specify module type via `load` and `transform` hooks:

```javascript
const myPlugin = {
  load(id) {
    if (id.endsWith('.data')) {
      return {
        code: '...',
        moduleType: 'json',
      };
    }
  },
};
```

**Benefits**: Provides a central convention for supported types, making it easier to chain multiple plugins that need to operate on the same module type. For example, `@vitejs/plugin-vue` can specify `moduleType: 'css'` for virtual CSS modules, and other plugins (like PostCSS) can process them without being aware of the Vue plugin.

See: [Module Types](https://rolldown.rs/in-depth/module-types)

## External Modules

### How a Module Becomes External

A module becomes external when:
1. It matches the `external` option in the config
2. A plugin's `resolveId` hook returns `{ external: true }` or `{ external: 'absolute' }`
3. It cannot be resolved by the internal resolver (with `shimMissingExports` disabled)

### The Full Resolution Flow

1. **First external check**: Check if the import specifier matches the `external` option
2. **Plugin `resolveId`**: Plugins can resolve or mark modules as external
3. **Internal resolver**: oxc-resolver resolves the module (respecting tsconfig paths, node_modules, etc.)
4. **Second external check**: If resolution fails and `shimMissingExports` is false, mark as external
5. **Output path determination**: External modules are referenced by their specifier in the output

### Special Cases

**Data URLs**: `import data from 'data:application/json,...'` — treated as inline modules, not external.

**HTTP URLs**: `import pkg from 'https://example.com/pkg.js'` — treated as external by default.

### Unused Imports Are Removed

If an external module is imported but none of its bindings are used, the import statement is removed during tree-shaking.

See: [External Modules](https://rolldown.rs/in-depth/external-modules)

## Why Plugin Hook Filters?

### The Problem

JavaScript plugins run on the JS-Rust boundary. Every plugin hook invocation crosses this boundary, which adds overhead. When multiple plugins are registered, each hook is called for every module, even if the plugin only cares about specific files.

**Real-world impact**: A typical Vite project has 5-15 plugins. Each module triggers ~10 hook calls per plugin. With 10,000 modules and 10 plugins, that's 1,000,000 JS-Rust boundary crossings — most of which are no-ops.

### Without Filter (Traditional Approach)

```javascript
const myPlugin = {
  name: 'my-plugin',
  transform(code, id) {
    // This runs for EVERY module, even if we only care about .svg files
    if (!id.endsWith('.svg')) return null;
    // ... actual work
  },
};
```

### The Solution: Plugin Hook Filters

Hook filters allow plugins to declare which modules they care about. Rolldown checks the filter in Rust before crossing the JS boundary, skipping unnecessary plugin hook calls entirely.

**With Filter (Optimized)**:

```javascript
import { defineConfig } from 'rolldown';

const myPlugin = {
  name: 'my-plugin',
  transform: {
    filter: {
      moduleType: 'asset/svg',
    },
    handler(code, id) {
      // Only runs for SVG modules — filter checked in Rust
    },
  },
};
```

### Performance Comparison

| Approach | Boundary Crossings | Overhead |
|----------|-------------------|----------|
| Without filter | N modules × M plugins × K hooks | Full JS-Rust crossing per call |
| With filter | Only matching modules | Rust-side filter check, no JS crossing |

### How It Works Under the Hood

1. **Without JS plugins**: Pure Rust pipeline, no boundary crossing at all
2. **With JS plugins (no filter)**: Every hook call crosses JS-Rust boundary
3. **With filters (optimized)**: Rust checks filter first, only crosses boundary when filter matches

### When to Use Filters

Use hook filters when:
- Your plugin only handles specific file types (e.g., `.css`, `.svg`, `.json`)
- Your plugin only cares about specific module paths
- You want to reduce overhead in large builds

### Quick Reference

Filter properties: `id`, `moduleType`, `code`, `importerId`, `include`, `exclude`, `query`, `queries`

Composable filter functions: `and()`, `or()`, `not()`, `include()`, `exclude()`, `prefixRegex()`, `exactRegex()`, `code()`, `id()`, `moduleType()`, `importerId()`, `query()`, `queries()`

See: [Why Plugin Hook Filters](https://rolldown.rs/in-depth/why-plugin-hook-filter)

**Source**: [Why Bundlers](https://rolldown.rs/in-depth/why-bundlers) | [Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs) | [Manual Code Splitting](https://rolldown.rs/in-depth/manual-code-splitting) | [Module Types](https://rolldown.rs/in-depth/module-types) | [External Modules](https://rolldown.rs/in-depth/external-modules) | [Why Plugin Hook Filters](https://rolldown.rs/in-depth/why-plugin-hook-filter)

# Rolldown — Getting Started

> Source: [Introduction](https://rolldown.rs/guide/introduction) | [Getting Started](https://rolldown.rs/guide/getting-started) | [Notable Features](https://rolldown.rs/guide/notable-features) | [Troubleshooting](https://rolldown.rs/guide/troubleshooting)

## What is a Bundler

In JavaScript development, a bundler compiles small pieces of code (ESM or CommonJS modules) into something larger and more complex, such as a library or application. For web applications, this makes your application load and run significantly faster (even with HTTP/2). For libraries, this can avoid your consuming application having to bundle the source again, and can also improve runtime execution performance.

## Why Rolldown

Rolldown is primarily designed to serve as the underlying bundler in Vite, with the goal to replace esbuild and Rollup (currently used in Vite as dependencies) with one unified build tool.

- **Performance**: Written in Rust. On the same performance level as esbuild and 10-30x faster than Rollup. WASM build is significantly faster than esbuild's (due to Go's sub-optimal WASM compilation).
- **Ecosystem Compatibility**: Supports the same plugin API as Rollup / Vite, ensuring compatibility with Vite's existing ecosystem.
- **Additional Features**: Provides important features needed in Vite but unlikely to be implemented by esbuild and Rollup.

Although designed for Vite, Rolldown is also fully capable of being used as a standalone, general-purpose bundler. It can serve as a drop-in replacement for Rollup in most cases, and can also be used as an esbuild alternative when better chunking control is needed.

## Rolldown's Feature Scope

- Rollup-compatible APIs (especially plugin interface) with similar treeshaking capabilities
- esbuild-like additional features as built-in: platform presets, TypeScript/JSX/syntax lowering transforms, Node.js module resolution, ESM/CJS interop, define, inject, minification
- Concepts close to esbuild but not in Rollup: Module Types (experimental), Plugin hook filters
- Features that neither esbuild nor Rollup implement: Manual code splitting, HMR support (WIP)

## Installation

```bash
# Using various package managers
npm install -D rolldown
pnpm add -D rolldown
yarn add -D rolldown
bun add -D rolldown
```

### Supported Platforms

Prebuilt binaries are distributed for:

**Tier 1** (full support):
- Linux x64 glibc (`x86_64-unknown-linux-gnu`)
- Linux arm64 glibc (`aarch64-unknown-linux-gnu`)
- Windows x64 (`x86_64-pc-windows-msvc`)
- Apple x64 (`x86_64-apple-darwin`)
- Apple arm64 (`aarch64-apple-darwin`)

**Tier 2**:
- Windows arm64 (`aarch64-pc-windows-msvc`)
- Linux s390x glibc (`s390x-unknown-linux-gnu`)
- Linux ppc64le glibc (`powerpc64le-unknown-linux-gnu`)

**Experimental**:
- Linux x64 musl, Linux armv7, FreeBSD x64, OpenHarmony arm64
- Linux arm64 musl, Android arm64, Wasm + Wasi (`wasm32-wasip1-threads`)

### Fallback for Unsupported Platforms

Use the Wasm build:
```bash
# For npm
npm install --cpu wasm32 --os wasip1-threads

# For yarn/pnpm, add to .yarnrc.yaml or pnpm-workspace.yaml:
# supportedArchitectures:
#   os:
#     - wasip1-threads
#   cpu:
#     - wasm32
```

If the prebuilt binary is not available, Rolldown will fallback to the Wasm binary automatically. To force Wasm: set `NAPI_RS_FORCE_WASI=error` environment variable.

## Using the CLI

```bash
# Verify installation
./node_modules/.bin/rolldown --version

# Check CLI options
./node_modules/.bin/rolldown --help

# Bundle a file
rolldown src/main.js -o bundle.js
```

## Using the Config File

Config files can be written in `.js`, `.cjs`, `.mjs`, `.ts`, `.mts`, or `.cts` formats:

```javascript
// rolldown.config.ts
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
  },
});
```

Use `defineConfig` for intellisense and auto-completion. While exporting a plain object also works, `defineConfig` is recommended.

### Multiple Builds in the Same Config

```javascript
import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: 'src/main.js',
    output: { file: 'dist/main.cjs', format: 'cjs' },
  },
  {
    input: 'src/main.js',
    output: { file: 'dist/main.mjs', format: 'esm' },
  },
]);
```

### Running with Config

```json
{
  "name": "my-rolldown-project",
  "type": "module",
  "scripts": {
    "build": "rolldown -c"
  },
  "devDependencies": {
    "rolldown": "^1.0.0"
  }
}
```

## Using Plugins

Rolldown's plugin API is identical to Rollup's, so you can reuse most existing Rollup plugins. Rolldown also provides many built-in features that make plugins unnecessary for common cases.

- **Builtin Plugins**: See [Builtin Plugins](https://rolldown.rs/builtin-plugins/) for Rust-implemented plugins
- **Community Plugins**: Listed in [Vite Plugin Registry](https://registry.vite.dev/plugins)

## Using the API

### rolldown() — Rollup-compatible API

```javascript
import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: 'src/main.js',
});

// Generate bundles in memory with different output options
await bundle.generate({ format: 'esm' });
await bundle.generate({ format: 'cjs' });

// Or directly write to disk
await bundle.write({ file: 'bundle.js' });
```

### build() — Simplified API (Experimental)

```javascript
import { build } from 'rolldown';

// build writes to disk by default
await build({
  input: 'src/main.js',
  output: { file: 'bundle.js' },
});
```

### watch() — Watch Mode

```javascript
import { watch } from 'rolldown';

const watcher = watch({ /* options */ });
// or watch([ /* multiple options */ ]);

watcher.on('event', () => {});
await watcher.close(); // Returns a promise (different from Rollup)
```

## Notable Features

### Platform Presets

- Configurable via `platform` option: `browser` | `node` | `neutral`
- Default: `'node'` for CJS output, `'browser'` otherwise
- Similar to esbuild's platform option
- Default output format is always `esm` regardless of platform
- Rolldown does not polyfill Node built-ins when targeting browser. Use `rolldown-plugin-node-polyfills` to opt-in.

### Built-in Transforms

Powered by Oxc, configurable via `transform` option:

- **TypeScript**: Configures based on tsconfig.json. Supports legacy decorators and decorator metadata.
- **JSX**: Built-in JSX transform.
- **Syntax lowering**: Automatically transforms modern syntax. Supports down to ES2015.

### CJS Support

Mixed ESM / CJS module graphs out of the box, without `@rollup/plugin-commonjs`. Follows esbuild's semantics and passes all esbuild ESM/CJS interop tests.

### Module Resolution

- Configurable via `resolve` option
- Powered by oxc-resolver, aligned with webpack's enhanced-resolve
- Resolves based on TypeScript and Node.js behavior by default
- Respects `compilerOptions.paths` in tsconfig.json when `tsconfig` option is provided

### Define

- Configurable via `transform.define`
- Replace global identifiers with constant expressions
- AST-based (differs from `@rollup/plugin-replace`)
- Use builtin `replacePlugin` for string-based replacement

### Inject

- Configurable via `transform.inject`
- Shim global variables with values exported from a module
- Equivalent to `@rollup/plugin-inject`

### Manual Code Splitting

- Configurable via `output.codeSplitting`
- Granular chunking control, similar to webpack's `optimization.splitChunks`

### Module Types (Experimental)

- Similar to esbuild's `loader` option
- Associate file extensions to built-in module types via `moduleTypes`
- Specify module type of specific modules in plugin hooks

### Minification

- Configurable via `output.minify`
- Powered by Oxc Minifier

## Troubleshooting

### Performance

Build performance is affected by the environment and plugins used, not just Rolldown itself.

**Environment factors**:
- Node.js version and configuration
- System resources (CPU, memory, disk I/O)
- File system characteristics (network drives, virtual filesystems)

**Plugin factors**:
- JavaScript plugins add overhead due to JS-Rust boundary crossing
- Use hook filters to reduce unnecessary plugin hook invocations
- Avoid heavy computation in plugin hooks
- Prefer builtin features over plugins when possible

### Avoiding Direct `eval`

Direct `eval` prevents scope hoisting and treeshaking optimization. Use indirect eval `(0, eval)(code)` or `Function` constructor instead.

### Avoid Relying on `this` in Exported Functions

When scope hoisting is enabled, the `this` context of exported functions may differ from what you expect. Avoid relying on `this` in exported functions.

### Avoid Relying on Temporal Dead Zone (TDZ) Errors

Rolldown may reorder declarations during scope hoisting. Don't rely on TDZ errors for correctness.

### Warning: "Sourcemap is likely to be incorrect"

This warning occurs when:
- Source maps reference files that don't exist
- Plugin transformations don't generate proper source maps
- Code is transformed after source map generation

**Source**: [Introduction](https://rolldown.rs/guide/introduction) | [Getting Started](https://rolldown.rs/guide/getting-started) | [Notable Features](https://rolldown.rs/guide/notable-features) | [Troubleshooting](https://rolldown.rs/guide/troubleshooting)

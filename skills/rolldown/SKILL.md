# Rolldown

> Blazing fast Rust-based bundler for JavaScript with Rollup-compatible API and esbuild feature parity.
> Designed as the unified bundler powering Vite 8+.

**Website**: [https://rolldown.rs](https://rolldown.rs) | **GitHub**: [https://github.com/rolldown/rolldown](https://github.com/rolldown/rolldown) | **Discord**: [https://chat.rolldown.rs](https://chat.rolldown.rs) | **REPL**: [https://repl.rolldown.rs](https://repl.rolldown.rs)

## What is Rolldown

Rolldown is a JavaScript bundler written in Rust. It is primarily designed to serve as the underlying bundler in Vite, replacing esbuild and Rollup with one unified build tool. It can also be used standalone as a general-purpose bundler — a drop-in replacement for Rollup, or an esbuild alternative when better chunking control is needed.

### Key Properties

- **Speed of Rust**: Handles tens of thousands of modules without breaking a sweat. On par with esbuild, 10-30x faster than Rollup. WASM build is also significantly faster than esbuild's.
- **Rollup Compatible**: Familiar API & options with a rich plugin ecosystem. Same plugin API as Rollup / Vite.
- **Esbuild Feature Parity**: Built-in transforms, define, inject, minify & more.
- **Designed for Vite**: The unified bundler powering Vite 8+.

### Benchmark

Bundling 19k modules (10k React JSX components + 9k iconify JS files, with minification and source maps):

| Bundler | Time |
|---------|------|
| Rolldown | 1.61s |
| esbuild | 1.70s |
| rspack | 4.07s |
| Rollup + esbuild | 40.10s |

### Why Rolldown

1. **Performance**: Written in Rust, same performance level as esbuild, 10-30x faster than Rollup.
2. **Ecosystem Compatibility**: Same plugin API as Rollup / Vite, ensuring compatibility with existing ecosystem.
3. **Additional Features**: Important features needed in Vite but unlikely to be implemented by esbuild and Rollup.

### Feature Scope

- Rollup-compatible APIs (especially plugin interface) with similar treeshaking capabilities
- esbuild-like feature scope: platform presets, TypeScript/JSX/syntax lowering transforms, Node.js module resolution, ESM/CJS interop, define, inject, minification
- Unique features: manual code splitting, HMR support (WIP), module types (experimental), plugin hook filters

### Credits

Rolldown wouldn't exist without lessons learned from esbuild, Rollup, webpack, and Parcel.

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | Introduction, installation, CLI, config files, plugins, API, watcher, notable features, troubleshooting |
| `in-depth.md` | Why bundlers, bundling CJS, manual code splitting, module types, external modules, plugin hook filters |
| `api-reference.md` | Input/output options, programmatic APIs, plugin API, hook filters, CLI, builtin plugins, Rust crates, config, utilities |
| `contribution.md` | Contribution guide, team, acknowledgements |

## Core Concepts

### Bundler

A bundler compiles small pieces of code (ESM or CommonJS modules) into something larger — a library or application. For web apps, this makes applications load and run faster. For libraries, it avoids consumers having to bundle source again.

### Platform Presets

Configurable via `platform` option: `browser` | `node` | `neutral`. Default: `'node'` for CJS output, `'browser'` otherwise. Similar to esbuild's platform option. Default output format is always `esm` regardless of platform.

### Built-in Transforms

Powered by Oxc:
- **TypeScript**: Configures based on tsconfig.json, supports legacy decorators and decorator metadata
- **JSX**: Built-in JSX transform
- **Syntax lowering**: Automatically transforms modern syntax down to ES2015

### CJS Support

Mixed ESM / CJS module graphs out of the box, without `@rollup/plugin-commonjs`. Follows esbuild's semantics and passes all esbuild ESM/CJS interop tests.

### Module Resolution

Powered by oxc-resolver, aligned with webpack's enhanced-resolve. Resolves based on TypeScript and Node.js behavior by default, without `@rollup/plugin-node-resolve`. Respects `compilerOptions.paths` in tsconfig.json.

### Define

Replace global identifiers with constant expressions via `transform.define`. AST-based (differs from `@rollup/plugin-replace`). Use `replacePlugin` for string-based replacement.

### Inject

Shim global variables with values exported from a module via `transform.inject`. Equivalent to `@rollup/plugin-inject`.

### Manual Code Splitting

Control chunking behavior granularly via `output.codeSplitting`, similar to webpack's `optimization.splitChunks`.

### Module Types (Experimental)

Associate file extensions to built-in module types via `moduleTypes`. Similar to esbuild's `loader` option.

### Minification

Powered by Oxc Minifier, configurable via `output.minify`.

## Quick Start

```bash
# Install
npm install -D rolldown

# CLI
rolldown --version
rolldown --help
rolldown src/main.js -o bundle.js

# Config file (rolldown.config.ts)
import { defineConfig } from 'rolldown';
export default defineConfig({
  input: 'src/main.js',
  output: { file: 'bundle.js' },
});

# package.json
{ "scripts": { "build": "rolldown -c" } }
```

### JavaScript API

```javascript
import { rolldown } from 'rolldown';
const bundle = await rolldown({ input: 'src/main.js' });
await bundle.write({ format: 'esm' });
await bundle.close();

// Or use the simpler build() API
import { build } from 'rolldown';
await build({ input: 'src/main.js', output: { file: 'bundle.js' } });
```

## Documentation Links

### Guide
- [Introduction](https://rolldown.rs/guide/introduction) | [Getting Started](https://rolldown.rs/guide/getting-started) | [Notable Features](https://rolldown.rs/guide/notable-features) | [Troubleshooting](https://rolldown.rs/guide/troubleshooting)

### In-Depth
- [Why Bundlers](https://rolldown.rs/in-depth/why-bundlers) | [Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs) | [Manual Code Splitting](https://rolldown.rs/in-depth/manual-code-splitting) | [Module Types](https://rolldown.rs/in-depth/module-types) | [External Modules](https://rolldown.rs/in-depth/external-modules) | [Why Plugin Hook Filters](https://rolldown.rs/in-depth/why-plugin-hook-filter)

### API
- [Bundler API](https://rolldown.rs/apis/bundler-api) | [Plugin API](https://rolldown.rs/apis/plugin-api) | [Hook Filters](https://rolldown.rs/apis/plugin-api/hook-filters) | [File URLs](https://rolldown.rs/apis/plugin-api/file-urls) | [Source Code Transformations](https://rolldown.rs/apis/plugin-api/transformations) | [Inter-plugin Communication](https://rolldown.rs/apis/plugin-api/inter-plugin-communication) | [CLI](https://rolldown.rs/apis/cli) | [Rust Crates](https://rolldown.rs/apis/rust-crates)

### Reference
- [Options & APIs Reference](https://rolldown.rs/reference)

### Builtin Plugins
- [Overview](https://rolldown.rs/builtin-plugins/) | [bundle-analyzer](https://rolldown.rs/builtin-plugins/bundle-analyzer) | [esm-external-require](https://rolldown.rs/builtin-plugins/esm-external-require) | [replace](https://rolldown.rs/builtin-plugins/replace)

### Community
- [Team](https://rolldown.rs/team) | [Acknowledgements](https://rolldown.rs/acknowledgements) | [Contribution Guide](https://rolldown.rs/contribution-guide/) | [Roadmap](https://github.com/rolldown/rolldown/discussions/153)

### Related
- [Vite](https://vite.dev) | [Oxc](https://oxc.rs) | [Rollup](https://rollupjs.org) | [esbuild](https://esbuild.github.io)

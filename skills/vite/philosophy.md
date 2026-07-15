# Philosophy and Why Vite

## Project Philosophy

### Lean Extendable Core

Vite's core is intentionally minimal. It provides:
- A dev server with HMR
- A build command with bundling
- A plugin system for extensibility

Most framework-specific features are provided by plugins maintained by framework teams.

### Pushing the Modern Web

Vite embraces modern web standards:
- Native ES modules in dev (no bundling)
- Native ESM dynamic import
- `import.meta` for environment info
- Modern browser targets (Baseline Widely Available)

### A Pragmatic Approach to Performance

- **Dev**: Fast server start, instant HMR via native ESM
- **Build**: Rolldown (Rust-based) for fast production builds
- **Dependencies**: Pre-bundled with Rolldown for fast cold starts
- **Transpilation**: Oxc (Rust-based) for TypeScript and JSX

### Building Frameworks on Top of Vite

Vite is designed as a foundation for framework tooling:
- Frameworks ship their own starter templates
- Framework-specific plugins handle SFCs, JSX, etc.
- Environment API enables multi-runtime support

### An Active Ecosystem

- 80,000+ GitHub stars
- 80M+ weekly npm downloads
- Official plugins for Vue, React, Preact, Lit, Svelte, Solid, Qwik
- Rich community plugin ecosystem

---

## Why Vite

### The Origins

Before Vite, frontend dev tools bundled the entire app on every file change. As projects grew, dev servers took minutes to start and HMR updates took seconds.

Vite's approach:
1. **Dev server**: Serve source files as native ESM — no bundling needed
2. **Dependencies**: Pre-bundle with Rolldown once (CommonJS → ESM conversion)
3. **HMR**: Only invalidate the changed module — instant updates

### Growing with the Ecosystem

Vite has evolved through major versions:
- **Vite 1**: Vue-focused, esbuild-based
- **Vite 2**: Framework-agnostic, Rollup-based
- **Vite 3**: Improved HMR, CSS handling
- **Vite 4**: Improved CSS, web worker support
- **Vite 5**: Rollup 4, CommonJS in config
- **Vite 6**: Environment API introduction
- **Vite 7**: Rolldown integration begins
- **Vite 8**: Rolldown as default bundler, Oxc transformer

### A Unified Toolchain

Vite aims to unify the JavaScript toolchain:
- **esbuild** → **Oxc** (Rust-based JS/TS transformer)
- **Rollup** → **Rolldown** (Rust-based bundler)
- **terser** → **Oxc minifier** (Rust-based minifier)
- All powered by Rust-based tools for maximum performance

### Where Vite is Heading

- **Rolldown**: Complete Rust-based bundler replacing Rollup
- **Environment API**: First-class multi-environment support
- **Oxc**: Complete JS/TS tooling in Rust
- **Performance**: Sub-millisecond HMR, instant cold starts

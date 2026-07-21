# SWC (Speedy Web Compiler)

> SWC (Speedy Web Compiler) is an extensible Rust-based platform for the next generation of fast developer tools. It's used by tools like Next.js, Parcel, and Deno, as well as companies like Vercel, ByteDance, Tencent, Shopify, Trip.com, and more.

## When to Use This Skill

- Transpiling TypeScript/JavaScript/JSX with SWC
- Configuring `.swcrc` for compilation, modules, minification
- Using SWC with Jest, webpack, or as a standalone CLI
- Migrating from Babel or tsc to SWC
- Writing SWC plugins in Rust (Wasm)
- Using SWC for HTML minification
- Configuring target browsers and polyfills with SWC's env/preset-env equivalent

## Skill Files

- **`getting-started.md`** — Installation (npm, yarn, pnpm, bun, deno), supported binaries (platforms), basic usage
- **`usage.md`** — @swc/cli (flags, options, watch mode), @swc/core (transform, transformSync, transformFile, bundle, minify APIs), Flow support, @swc/wasm (browser WASM), @swc/jest (Jest integration), swc-loader (webpack), @swc/html (HTML minification), bundling (spack/swcpack), @swc/wasm-typescript (browser TS transform), benchmarks
- **`configuration.md`** — .swcrc file structure, compilation defaults, env/preset-env (targets, mode, coreJs, skip, include, exclude), modules (CommonJS, ES6, AMD, UMD, shared options), minification (compress, mangle, format, assumptions), supported browsers (browserslist integration), bundling config (spack.config.js, mode, entry, output, options)
- **`plugins.md`** — Selecting swc_core version (compatibility table), plugin getting started (Rust, wasm32-wasip1, swc_cli), API changes (chain! to tuples, Fold to Pass), plugin cheatsheet (JsWord, Ident, Box<T> matching, AST injection, limitations), compatibility (rkyv serialization, v1.15.0+ compat), publishing (wasm build, npm package, binary size optimization), registering plugins (plugins.swc.rs, YAML config), contributing (string management, variable management, profiling, debugging Next.js, debugging size)
- **`migration.md`** — Migrating from Babel (drop-in replacement), migrating from tsc (isolatedModules, importsNotUsedAsValues, esModuleInterop, verbatimModuleSyntax, useDefineForClassFields, known issues), @swc-node vs @swc

## Key Concepts

- **SWC**: Rust-based JavaScript/TypeScript compiler — fast, extensible, used by Next.js/Parcel/Deno
- **@swc/core**: Core SWC APIs for programmatic use (transform, minify, bundle)
- **@swc/cli**: Command-line interface for transpiling files
- **.swcrc**: JSON configuration file for SWC (like .babelrc for Babel)
- **jsc**: JavaScript/TypeScript compilation config (parser, transform, target, loose, externalHelpers, keepClassNames)
- **env**: SWC's preset-env equivalent — target browsers, mode (usage/entry), coreJs, polyfills
- **module**: Module system config (commonjs, es6, amd, umd)
- **minify**: SWC's Rust-based minifier (compress, mangle, format)
- **swc-loader**: Webpack loader for SWC
- **@swc/jest**: Jest transformer using SWC (drop-in replacement for ts-jest)
- **swc_core**: Rust crate for writing SWC plugins (Wasm-based)
- **spack/swcpack**: SWC's native bundler (deprecated in v2, use Parcel/Turbopack/Rspack instead)

## Common Patterns

- Install `@swc/cli @swc/core` as dev dependencies
- Configure `.swcrc` for parser syntax (ecmascript/typescript/flow), JSX, target
- Use `env` with `browserslist` for automatic polyfill injection
- Use `@swc/jest` for faster Jest test transpilation
- Use `swc-loader` with webpack for fast transpilation
- SWC is a drop-in replacement for Babel CLI (`npx swc` instead of `npx babel`)
- SWC does not perform type checking — use `tsc` for type checking alongside SWC

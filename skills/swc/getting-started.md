# SWC Getting Started

## What is SWC?

SWC (Speedy Web Compiler) is an extensible Rust-based platform for the next generation of fast developer tools. It can compile, minify, and bundle JavaScript and TypeScript. It's used by:
- Next.js (built-in SWC compiler)
- Parcel (bundler)
- Deno (TypeScript transpilation)
- Companies: Vercel, ByteDance, Tencent, Shopify, Trip.com

## Installation

The easiest way to try SWC is using the [Playground](https://swc.rs/playground/).

Install via package manager:

```bash
# npm
npm install -D @swc/cli @swc/core

# yarn
yarn add -D @swc/cli @swc/core

# pnpm
pnpm add -D @swc/cli @swc/core

# bun
bun add -D @swc/cli @swc/core

# deno
deno add -D npm:@swc/cli npm:@swc/core
```

## Basic Usage

Transpile a file and emit to stdout:

```bash
npx swc ./file.js
```

Transpile a file and write to output:

```bash
npx swc ./file.js -o output.js
```

Transpile a directory:

```bash
npx swc ./my-dir -d output
```

## Supported Binaries

SWC provides pre-built binaries for:
- Mac (Apple Silicon)
- Mac (x64)
- Linux (x86_64)
- Linux (aarch64)
- Linux (armv7)
- Alpine Linux (also install `@swc/core-linux-musl`)
- Android (aarch64)
- Windows (win32-x64)
- Windows (ia32)

## Packages Overview

| Package | Description |
|---------|-------------|
| `@swc/core` | Core SWC APIs for programmatic use |
| `@swc/cli` | Command-line interface for transpiling files |
| `@swc/wasm` | WASM-based SWC for browser usage |
| `@swc/jest` | Jest transformer using SWC |
| `swc-loader` | Webpack loader for SWC |
| `@swc/html` | HTML minification |
| `@swc/core-linux-musl` | Alpine Linux binary support |

---
name: bun-docs
version: "1.2"
tags:
  - bun
  - javascript
  - typescript
  - runtime
  - bundler
  - package-manager
  - test-runner
  - sqlite
  - websockets
  - javascriptcore
description: |
  Bun 1.2 — runtime, package manager, HTTP server, SQLite, test runner, bundler, TypeScript, FFI, shell API.
---

# Bun — Skill Documentation

## Metadata

- **Target Version**: Bun 1.2.x
- **Source**: [bun.sh/docs](https://bun.sh/docs)
- **Files**: 9
- **Lines**: ~4,350

---

## Quick Reference

| Topic | File | Description |
|-------|------|-------------|
| Getting Started (installation, quickstart, TypeScript, bun init) | `getting-started.md` | Install Bun, create projects, run TS/JSX |
| Runtime (execution, watch mode, REPL, bunfig, modules, plugins) | `runtime.md` | `bun run`, file types, module resolution, auto-install |
| Package Manager (bun install, add, remove, update, publish, outdated, why, audit, info, link, patch, workspaces, catalogs, filter, scopes, npmrc, security scanner, global cache, isolated installs) | `package-manager.md` | Full PM: install, update, publish, audit, patch, catalogs, isolated installs |
| HTTP Server (Bun.serve, routing, HTML imports, WebSockets, TLS) | `http-server.md` | Built-in HTTP server, file-system routing, hot reload |
| APIs (File I/O, SQLite, Streams, Fetch, Workers, Shell, Utils, Globals, Web APIs, Bun APIs reference) | `apis.md` | `Bun.file`, `Bun.write`, `bun:sqlite`, `Bun.spawn`, Workers, utils, compression, globals |
| Advanced APIs (SQL, S3, Redis, TCP/UDP, Cron, FFI, Image, Archive, WebView, Cookies, CSRF, JSON5, Transpiler, Node.js compat) | `advanced-apis.md` | PostgreSQL/MySQL, S3 storage, Redis, TCP/UDP sockets, cron jobs, FFI, image processing, tar archives |
| Testing (bun test, assertions, mocks, snapshots, watch mode) | `testing.md` | Jest-compatible test runner, TypeScript-first |
| Bundler (bun build, targets, plugins, executables, HTML imports) | `bundler.md` | Native bundler for browser/bun/node, single-file executables |

---

## What is Bun?

Bun is an all-in-one toolkit for developing modern JavaScript/TypeScript applications:

- **Runtime**: Execute JS/TS files with near-zero overhead (JavaScriptCore engine)
- **Package Manager**: Fast installs with `bun install` — replacement for npm/yarn/pnpm
- **Test Runner**: Jest-compatible, TypeScript-first tests with `bun test`
- **Bundler**: Native bundling for JS/TS/JSX with `bun build`

```bash
bun run index.tsx    # TS and JSX supported by default
bun run start        # run the `start` script
bun install <pkg>    # install a package
bun build ./index.tsx # bundle a project for browsers
bun test             # run tests
bunx cowsay 'Hello'  # execute a package
```

## Design Goals

- **Speed**: Bun processes start 4x faster than Node.js
- **TypeScript & JSX**: Directly execute `.ts`, `.tsx`, `.jsx` files
- **ESM & CommonJS**: Recommends ES modules, supports CommonJS
- **Web-standard APIs**: `fetch`, `WebSocket`, `ReadableStream`, `Headers`, `URL`
- **Node.js compatibility**: Built-in globals (`process`, `Buffer`) and modules (`path`, `fs`, `http`)

---

## Common Patterns

### Create a new project

```bash
bun init my-app
cd my-app
bun run index.ts
```

### Start an HTTP server

```typescript
const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response("Bun!"),
    "/users/:id": req => new Response(`Hello User ${req.params.id}!`),
  },
});
console.log(`Listening on ${server.url}`);
```

### Read and write files

```typescript
const file = Bun.file("input.txt");
const text = await file.text();

await Bun.write("output.txt", "Hello, world!");
```

### Use SQLite

```typescript
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite");
const query = db.query("SELECT * FROM users WHERE id = ?");
const user = query.get(1);
```

### Write and run tests

```typescript
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

```bash
bun test
```

### Bundle for production

```bash
bun build ./index.tsx --outdir ./out
```

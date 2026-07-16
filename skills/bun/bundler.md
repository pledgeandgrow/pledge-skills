# Bun Bundler

Bun includes a fast native bundler for JavaScript, TypeScript, JSX, and more.

## Why Bundle?

- **Reduce HTTP requests**: Convert hundreds of `node_modules` files into a single bundle
- **Code transforms**: TypeScript, JSX, CSS modules → plain JS and CSS
- **Framework features**: File-system routing, server components, code co-location
- **Full-stack applications**: Bundle server and client code in a single command

## Basic Example

### CLI

```bash
bun build ./index.tsx --outdir ./out
```

### API

```typescript
const result = await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
});

if (!result.success) {
  for (const log of result.logs) {
    console.error(log);
  }
}
```

### Output

```
. ├── index.tsx ├── Component.tsx └── out └── index.js
```

## Watch Mode

```bash
bun build ./index.tsx --outdir ./out --watch
```

## Content Types

Supported file types in bundles:

| Extension | Loader |
|-----------|--------|
| `.js`, `.jsx`, `.cjs`, `.mjs`, `.mts`, `.cts` | JS |
| `.ts`, `.tsx` | TS |
| `.json` | JSON (importable) |
| `.jsonc` | JSON with comments |
| `.toml` | TOML |
| `.yaml`, `.yml` | YAML |
| `.txt` | Text (string) |
| `.html` | HTML |
| `.css` | CSS |
| `.node` | Native addon |
| `.wasm` | WebAssembly |

## Build Targets

### Browser (default)

```bash
bun build ./index.tsx --outdir ./out --target=browser
```

### Bun

```bash
bun build ./index.tsx --outdir ./out --target=bun
```

### Node

```bash
bun build ./index.tsx --outdir ./out --target=node
```

## API Options

### entrypoints

```typescript
await Bun.build({
  entrypoints: ["./index.tsx", "./admin.tsx"],
  outdir: "./out",
});
```

### outdir

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
});
```

### format

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  format: "esm",  // "esm" | "cjs" | "iife"
});
```

### splitting (code splitting)

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  splitting: true,
});
```

### minify

```bash
bun build ./index.tsx --outdir ./out --minify
```

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  minify: true,
});
```

### sourcemap

```bash
bun build ./index.tsx --outdir ./out --sourcemap
```

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  sourcemap: "external",  // "inline" | "external" | true
});
```

### external

Mark packages as external (not bundled):

```bash
bun build ./index.tsx --outdir ./out --external react --external react-dom
```

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  external: ["react", "react-dom"],
});
```

### define (global constants)

```bash
bun build ./index.tsx --outdir ./out --define VERSION='"1.0.0"'
```

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  define: {
    "process.env.NODE_ENV": '"production"',
    "VERSION": '"1.0.0"',
  },
});
```

### naming

```bash
bun build ./index.tsx --outdir ./out --asset-naming '[name]-[hash].[ext]'
```

### root

```typescript
await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./out",
  root: "./src",
});
```

### publicPath

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  publicPath: "https://cdn.example.com/",
});
```

### banner and footer

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  banner: "// My App v1.0",
  footer: "// End of bundle",
});
```

### drop

Remove function calls:

```bash
bun build ./index.tsx --outdir ./out --drop console
```

### env

Inline environment variables:

```bash
bun build ./index.tsx --outdir ./out --env NODE_ENV
```

### optimizeImports

```typescript
await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  optimizeImports: true,
});
```

### metafile

```typescript
const result = await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  metafile: true,
});

console.log(result.metafile);  // bundle metadata
```

## Plugins

```typescript
import { plugin } from "bun";

plugin({
  name: "my-plugin",
  setup(build) {
    build.onLoad({ filter: /\.custom$/ }, async (args) => {
      const content = await Bun.file(args.path).text();
      return {
        exports: `export default ${JSON.stringify(content)}`,
        loader: "js",
      };
    });
  },
});

await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
  plugins: [myPlugin],
});
```

## HTML Imports

Import HTML files as entry points — Bun processes referenced JS, CSS, and assets:

```typescript
await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./out",
});
```

This bundles the HTML and all referenced assets into the output directory.

## Single-File Executables

Bundle your app into a standalone executable:

```bash
bun build ./index.tsx --compile --outfile myapp
```

Run the executable:

```bash
./myapp
```

### With embedded assets

```bash
bun build ./index.tsx --compile --outfile myapp --asset-naming '[name].[ext]'
```

### Cross-compile

```bash
bun build ./index.tsx --compile --target=bun-linux-x64 --outfile myapp-linux
bun build ./index.tsx --compile --target=bun-darwin-arm64 --outfile myapp-macos
bun build ./index.tsx --compile --target=bun-windows-x64 --outfile myapp.exe
```

## Bytecode

Pre-compile JavaScript to bytecode for faster startup:

```bash
bun build ./index.tsx --outdir ./out --bytecode
```

## CLI Usage

```bash
# Basic
bun build ./index.tsx --outdir ./out

# Watch mode
bun build ./index.tsx --outdir ./out --watch

# Minified production build
bun build ./index.tsx --outdir ./out --minify --sourcemap

# Single-file executable
bun build ./index.tsx --compile --outfile myapp

# With code splitting
bun build ./index.tsx ./admin.tsx --outdir ./out --splitting

# Target Bun runtime
bun build ./server.ts --outdir ./out --target=bun

# External dependencies
bun build ./index.tsx --outdir ./out --external react --external react-dom
```

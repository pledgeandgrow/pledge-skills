# Bun Runtime

## Running Files

```bash
bun run index.ts
bun run index.tsx    # JSX supported
bun run index.jsx    # JSX supported
```

### --watch (Watch Mode)

Automatically restarts on file changes:

```bash
bun run --watch index.ts
```

### --hot (Hot Reload)

Reloads code without restarting the process (preserves state):

```bash
bun run --hot index.ts
```

### Pipe from stdin

```bash
echo "console.log('Hello')" | bun run -
```

### --smol (Reduce memory)

```bash
bun run --smol index.ts
```

## Run a package.json script

```bash
bun run start
bun run build
```

### --bun (Force Bun runtime)

Force scripts to run with Bun instead of Node:

```bash
bun run --bun start
```

### Filtering

```bash
bun run --filter "pkg-*" build
```

## Resolution Order

When you run `bun run <name>`, Bun checks in order:
1. A script in `package.json` named `<name>`
2. A file at `./<name>` (with extension auto-detected)
3. An executable in `node_modules/.bin/<name>`

## File Types

Bun natively supports:

| Extension | Support |
|-----------|---------|
| `.js` | JavaScript |
| `.jsx` | JavaScript + JSX |
| `.ts` | TypeScript |
| `.tsx` | TypeScript + JSX |
| `.mjs` | ES Module |
| `.cjs` | CommonJS |
| `.mts` | ES Module TypeScript |
| `.cts` | CommonJS TypeScript |
| `.json` | JSON (importable) |
| `.jsonc` | JSON with comments |
| `.toml` | TOML (importable) |
| `.yaml`/`.yml` | YAML (importable) |
| `.txt` | Text (importable as string) |
| `.html` | HTML (importable) |
| `.css` | CSS (importable) |
| `.node` | Native addon |
| `.wasm` | WebAssembly |
| `.json5` | JSON5 (importable) |
| `.jsonl` | JSONL (importable) |

## JSX

Bun natively supports JSX in `.jsx` and `.tsx` files. Configure via `tsconfig.json`:

### jsx

Controls how JSX is transpiled:

```json
{ "jsx": "react" }       // React.createElement
{ "jsx": "react-jsx" }   // automatic runtime (import { jsx })
{ "jsx": "react-jsxdev" } // automatic dev runtime (import { jsxDEV })
```

```tsx
// jsx: "react"
React.createElement(Box, { width: 5 }, "Hello");

// jsx: "react-jsx"
import { jsx } from "react/jsx-runtime";
jsx("Box", { width: 5, children: "Hello" });
```

### jsxFactory

Override the factory function (default: `React.createElement`):

```json
{ "jsx": "react", "jsxFactory": "h" }
```

```tsx
// <Box width={5}>Hello</Box>
h(Box, { width: 5 }, "Hello");
```

### jsxFragmentFactory

Override the fragment factory (default: `React.Fragment`):

```json
{ "jsx": "react", "jsxFactory": "myjsx", "jsxFragmentFactory": "MyFragment" }
```

```tsx
// <>Hello</>
myjsx(MyFragment, null, "Hello");
```

### jsxImportSource

Set the import source for automatic runtime (default: `"react"`):

```json
{ "jsx": "react-jsx", "jsxImportSource": "preact" }
```

```tsx
import { jsx } from "preact/jsx-runtime";
jsx("Box", { width: 5, children: "Hello" });
```

### JSX pragma (per-file overrides)

```tsx
// @jsx h
// @jsxFrag MyFragment
// @jsxImportSource preact
```

### Prop punning

```tsx
// Shorthand for <Component active={active} />
<Component {active} />
```

## Module Resolution

### ESM (recommended)

```typescript
import { foo } from "./foo";
export const bar = 42;
```

### CommonJS (supported)

```javascript
const { foo } = require("./foo");
module.exports = { bar: 42 };
```

### Import from node_modules

```typescript
import { z } from "zod";
import _ from "lodash";
```

### Import from URL

```typescript
import { camelCase } from "https://esm.sh/lodash/camelCase";
```

### Path aliases (from tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

```typescript
import { Button } from "@components/Button";
```

## Auto-install

Bun can automatically install missing dependencies:

```bash
bun run --auto-install index.ts
```

Or in `bunfig.toml`:

```toml
[install]
auto = "auto"
```

## bunfig.toml

Configuration file for Bun, loaded from:
1. `$XDG_CONFIG_HOME/.bunfig.toml` or `$HOME/.bunfig.toml` (global)
2. `./bunfig.toml` (project-level)

```toml
[install]
# whether to install optionalDependencies
optional = true
# whether to install devDependencies
dev = true
# whether to install peerDependencies
peer = true
# equivalent to `--production` flag
production = false
# equivalent to `--frozen-lockfile` flag
frozenLockfile = false
# equivalent to `--dry-run` flag
dryRun = false
# installation strategy: "hoisted" or "isolated"
linker = "hoisted"
# minimum release age (seconds)
minimumReleaseAge = 259200
```

## REPL

```bash
bun repl
```

Interactive JavaScript/TypeScript REPL with:
- Multi-line support
- Top-level await
- Tab completion
- `.await` command for wrapping code in async

## Debugging

### Built-in debugger

```bash
bun run --debug index.ts
bun run --debug-brk index.ts
```

Connect Chrome DevTools or VS Code to the debugger.

### Inspect with console

```typescript
console.log("value:", value);
console.table(data);
console.trace();
```

## Environment Variables

```bash
bun run index.ts  # reads from .env automatically
```

```typescript
const apiKey = process.env.API_KEY;
const port = Bun.env.PORT;  // Bun-specific alias
```

### Setting env vars

```bash
PORT=3000 bun run index.ts
```

### .env file

```bash
# .env
DATABASE_URL=sqlite://mydb.sqlite
PORT=3000
```

Loaded automatically by Bun.

## Plugins

Plugins extend Bun's bundler and runtime:

```typescript
// plugin.ts
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
```

```bash
bun run --plugin ./plugin.ts index.ts
```

## File System Router

Bun supports a file-system router for `Bun.serve`:

```
routes/
  index.ts        → /
  users/
    [id].ts       → /users/:id
    index.ts      → /users
```

```typescript
import { fileSystemRouter } from "bun";

const server = Bun.serve({
  routes: fileSystemRouter("./routes"),
});
```

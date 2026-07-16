# Getting Started with Bun

## Installation

### macOS & Linux

```bash
curl -fsSL https://bun.com/install | bash
```

### Windows

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Package Managers

```bash
npm install -g bun          # the last `npm` command you'll ever need
brew install oven-sh/bun/bun  # macOS Homebrew
scoop install bun            # Windows Scoop
```

### Docker

```bash
docker pull oven/bun
docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```

### Verify Installation

```bash
bun --version
bun --revision
```

### Upgrading

```bash
bun upgrade
```

---

## Quickstart

### Step 1: Create a project

```bash
bun init my-app
```

Templates available: **Blank**, **React**, **Library**

```
✓ Select a project template: Blank
  + .gitignore
  + index.ts
  + tsconfig.json
  + README.md
```

### Step 2: Run a file

```bash
cd my-app
bun run index.ts
```

### Step 3: Start an HTTP server

```typescript
// index.ts
const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response('Bun!'),
  },
});
console.log(`Listening on ${server.url}`);
```

```bash
bun run index.ts
# Listening on http://localhost:3000/
```

### Step 4: Install dependencies

```bash
bun add figlet
bun add -d @types/figlet  # TypeScript types
```

```typescript
import figlet from 'figlet';

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response('Bun!'),
    "/figlet": () => {
      const body = figlet.textSync('Bun!');
      return new Response(body);
    },
  },
});
```

### Step 5: HTML imports

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bun</title>
</head>
<body>
  <h1>Bun!</h1>
</body>
</html>
```

```typescript
import figlet from 'figlet';
import index from './index.html';

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/figlet": () => new Response(figlet.textSync('Bun!')),
  },
});
```

### Run a package.json script

```json
{
  "name": "my-app",
  "module": "index.ts",
  "type": "module",
  "scripts": {
    "start": "bun run index.ts"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

```bash
bun run start
```

---

## TypeScript

Bun natively supports TypeScript — no configuration needed.

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true
  }
}
```

### Install Bun types

```bash
bun add -d @types/bun
```

### TypeScript features

- **Direct execution**: Run `.ts` and `.tsx` files without compilation
- **Path aliases**: Resolved from `tsconfig.json` `paths`
- **JSX**: Supported by default, configurable via `tsconfig.json`
- **Type checking**: Bun does NOT type-check at runtime — use `tsc --noEmit` or IDE

### Path aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
import { foo } from "@/utils";  // resolves to ./src/utils.ts
```

### TypeScript 6 and 7

TypeScript 6.0 and 7.0 no longer auto-discover `@types/*` packages. You must explicitly add `"types": ["bun"]` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["bun"]
  }
}
```

To include additional type packages:

```json
{
  "compilerOptions": {
    "types": ["bun", "react"]
  }
}
```

Or install `@types/bun` as a dev dependency:

```bash
bun add -d @types/bun
```

#### Full recommended tsconfig.json (TypeScript 6+)

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "types": ["bun"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

This applies to both TypeScript 6 and 7.

---

## bun init

Create new projects from templates:

```bash
bun init              # interactive in current directory
bun init my-app       # create in new directory
```

Options:
- `--help` — show help
- `--no-install` — skip installing dependencies

## bun create

Create projects from templates or GitHub repos:

```bash
bun create ./my-app
bun create github:user/repo
```

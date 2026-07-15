# CLI Commands

Astro CLI commands for development, building, testing, and project management.

---

## `astro` Commands

| Command | Description |
|---------|-------------|
| `astro dev` | Start development server |
| `astro build` | Build project for production |
| `astro preview` | Preview built site locally |
| `astro check` | Check project for TypeScript/diagnostic errors |
| `astro sync` | Generate TypeScript types for Astro modules |
| `astro add` | Add an integration |
| `astro docs` | Open documentation in browser |
| `astro info` | List info about current Astro setup |
| `astro preferences` | Configure user preferences |
| `astro telemetry` | Configure telemetry settings |
| `astro create-key` | Create a cryptography key |

### `package.json` Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "sync": "astro sync"
  }
}
```

---

## `astro dev`

Starts the development server with hot module replacement:

```bash
npx astro dev
```

### Flags

| Flag | Description |
|------|-------------|
| `--port <number>` | Port to run on (default: 4321) |
| `--host [address]` | Listen on all addresses or specific IP |
| `--open` | Open browser automatically |
| `--mode <string>` | Mode (default: `development`) |
| `--force` | Clear content layer cache, full rebuild |
| `--background` | Start as background process |
| `--allowed-hosts` | Comma-separated allowed hosts |

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `astro dev stop` | Stop a running background dev server |
| `astro dev status` | Check if dev server is running |
| `astro dev logs [--follow]` | View logs from background dev server |

```bash
# Background mode
npx astro dev --background
npx astro dev status
npx astro dev stop
npx astro dev logs --follow
```

---

## `astro build`

Builds the project for production:

```bash
npx astro build
```

### Flags

| Flag | Description |
|------|-------------|
| `--mode <string>` | Mode (default: `production`) |
| `--outDir <path>` | Output directory (default: `./dist/`) |
| `--force <string>` | Clear cache for specific content |
| `--site <url>` | Set the site URL |
| `--base <pathname>` | Set the base path |

```bash
npx astro build --mode staging
npx astro build --outDir ./build
```

---

## `astro preview`

Previews the built site locally:

```bash
npx astro preview
```

### Flags

| Flag | Description |
|------|-------------|
| `--port <number>` | Port (default: 4321) |
| `--host [address]` | Listen on all addresses |
| `--open` | Open browser |

---

## `astro check`

Checks for TypeScript and diagnostic errors:

```bash
npx astro check
```

### Flags

| Flag | Description |
|------|-------------|
| `--watch` | Watch for changes and re-check |
| `--tsconfig <path>` | Path to tsconfig.json |
| `--minimumSeverity <level>` | `error`, `warning`, `hint` |

```bash
npx astro check --watch
```

---

## `astro sync`

Generates TypeScript types for all Astro modules (content collections, etc.):

```bash
npx astro sync
```

Run this after adding or modifying content collection schemas.

---

## `astro add`

Adds an integration to the project:

```bash
npx astro add react
npx astro add tailwind mdx
```

Automatically installs packages and updates config files.

---

## `astro docs`

Opens Astro documentation in the browser:

```bash
npx astro docs
```

---

## `astro info`

Displays info about the current Astro setup:

```bash
npx astro info
```

Outputs Astro version, integrations, adapters, Node version, OS, etc. Useful for bug reports.

---

## `astro preferences`

Configure user preferences:

```bash
npx astro preferences list
npx astro preferences enable devToolbar
npx astro preferences disable devToolbar
```

### Available Preferences

| Preference | Description |
|------------|-------------|
| `devToolbar` | Enable/disable dev toolbar |
| `updateNotice` | Show update notifications |

---

## `astro telemetry`

Configure anonymous telemetry:

```bash
npx astro telemetry enable
npx astro telemetry disable
npx astro telemetry reset
```

---

## `astro create-key`

Creates a cryptography key for sessions:

```bash
npx astro create-key
```

---

## Common Flags

All commands accept these flags:

| Flag | Description |
|------|-------------|
| `--root <path>` | Project root folder |
| `--config <path>` | Config file path |
| `--site <url>` | Site URL |
| `--base <pathname>` | Base path |
| `--port <number>` | Port number |
| `--host [address]` | Host address |
| `--allowed-hosts` | Allowed hostnames |
| `--verbose` | Verbose logging |
| `--silent` | Disable all logging |
| `--open` | Open browser |
| `--json` | JSON logging output |
| `--mode <string>` | Environment mode |

## Global Flags

| Flag | Description |
|------|-------------|
| `--version` | Show version number |
| `--help` | Show help message |

```bash
npx astro --version
npx astro --help
npx astro dev --help
```

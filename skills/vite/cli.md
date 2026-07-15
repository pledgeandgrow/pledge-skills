# Command Line Interface

## Dev Server

### `vite`

Start Vite dev server in the current directory. `vite dev` and `vite serve` are aliases.

#### Usage

```bash
vite [root]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--host [host]` | string | | Specify which IP addresses the server should listen on |
| `--port <port>` | number | 5173 | Specify port |
| `--open [path]` | boolean \| string | false | Open app in browser on startup |
| `--cors` | boolean | true | Enable CORS |
| `--strictPort` | boolean | false | Exit if port is already in use |
| `--force` | boolean | false | Force re-optimization of dependencies |
| `-c, --config <file>` | string | | Path to config file |
| `--base <path>` | string | `/` | Public base path |
| `-l, --logLevel <level>` | string | info | Log level (info, warn, error, silent) |
| `--clearScreen` | boolean | true | Clear screen on file changes |
| `--configLoader <loader>` | string | bundle | Config loader (bundle, runner, native) |
| `--profile` | | | Profile performance bottlenecks |
| `-d, --debug [feat]` | string \| boolean | | Show debug logs |
| `-f, --filter <filter>` | string | | Filter debug logs |
| `-m, --mode <mode>` | string | | Set env mode |
| `-h, --help` | | | Show help |
| `-v, --version` | | | Show version |

#### Examples

```bash
# Start dev server
vite

# Start on specific host and port
vite --host 0.0.0.0 --port 3000

# Force re-optimization
vite --force

# Open in browser
vite --open

# Use specific config
vite --config vite.config.ts

# Specify mode
vite --mode development
```

---

## Build

### `vite build`

Build for production.

#### Usage

```bash
vite build [root]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--target <target>` | string | `baseline-widely-available` | Build target |
| `--outDir <dir>` | string | `dist` | Output directory |
| `--assetsDir <dir>` | string | `assets` | Assets subdirectory |
| `--assetsInlineLimit <number>` | number | 4096 | Inline assets below this size (bytes) |
| `--ssr [entry]` | string | | Build SSR entry |
| `--sourcemap [output]` | boolean \| `inline` \| `hidden` | false | Generate sourcemaps |
| `--minify [minifier]` | boolean \| `oxc` \| `terser` \| `esbuild` | `oxc` | Minify output |
| `--manifest [name]` | boolean \| string | false | Generate build manifest |
| `--ssrManifest [name]` | boolean \| string | false | Generate SSR manifest |
| `--emptyOutDir` | boolean | true | Empty outDir before build |
| `-w, --watch` | boolean | false | Watch for changes and rebuild |
| `-c, --config <file>` | string | | Path to config file |
| `--base <path>` | string | `/` | Public base path |
| `-l, --logLevel <level>` | string | info | Log level |
| `--clearScreen` | boolean | true | Clear screen |
| `--configLoader <loader>` | string | bundle | Config loader |
| `--profile` | | | Profile performance |
| `-d, --debug [feat]` | string \| boolean | | Debug logs |
| `-f, --filter <filter>` | string | | Filter debug logs |
| `-m, --mode <mode>` | string | production | Set env mode |
| `--app` | boolean | | Use app builder |

#### Examples

```bash
# Basic build
vite build

# Build with sourcemaps
vite build --sourcemap

# Build with specific output
vite build --outDir ./build

# Build in watch mode
vite build --watch

# Disable minification
vite build --minify false

# Build for older browsers
vite build --target es2015

# Build SSR
vite build --ssr src/entry-server.ts
```

---

## Others

### `vite optimize`

Pre-bundle dependencies. **Deprecated** — the pre-bundle process runs automatically.

#### Usage

```bash
vite optimize [root]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--force` | boolean | Force re-optimization |
| `-c, --config <file>` | string | Path to config file |
| `--base <path>` | string | Public base path |
| `-l, --logLevel <level>` | string | Log level |
| `--clearScreen` | boolean | Clear screen |
| `--configLoader <loader>` | string | Config loader |
| `-d, --debug [feat]` | string \| boolean | Debug logs |
| `-f, --filter <filter>` | string | Filter debug logs |
| `-m, --mode <mode>` | string | Set env mode |
| `-h, --help` | | Show help |

### `vite preview`

Locally preview the production build. **Not designed for production use.**

#### Usage

```bash
vite preview [root]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--host [host]` | string | | Listen on specific host |
| `--port <port>` | number | 4173 | Specify port |
| `--strictPort` | boolean | false | Exit if port is in use |
| `--open [path]` | boolean \| string | false | Open in browser |
| `--outDir <dir>` | string | dist | Preview from directory |
| `-c, --config <file>` | string | | Path to config file |
| `--base <path>` | string | `/` | Public base path |
| `-l, --logLevel <level>` | string | info | Log level |
| `--clearScreen` | boolean | true | Clear screen |
| `--configLoader <loader>` | string | bundle | Config loader |
| `-d, --debug [feat]` | string \| boolean | | Debug logs |
| `-f, --filter <filter>` | string | | Filter debug logs |
| `-m, --mode <mode>` | string | | Set env mode |
| `-h, --help` | | | Show help |

#### Examples

```bash
# Preview production build
vite build && vite preview

# Preview on specific port
vite preview --port 8080

# Preview and open browser
vite preview --open
```

# Biome — Getting Started & Guides

> **Source**: [Getting Started](https://biomejs.dev/guides/getting-started/) | [Manual Installation](https://biomejs.dev/guides/manual-installation/) | [Configure Biome](https://biomejs.dev/guides/configure-biome/) | [Big Projects](https://biomejs.dev/guides/big-projects/) | [VCS Integration](https://biomejs.dev/guides/integrate-in-vcs/) | [Investigate Slowness](https://biomejs.dev/guides/investigate-slowness/) | [Migrate from ESLint and Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/) | [Language Support](https://biomejs.dev/internals/language-support/) | [Versioning](https://biomejs.dev/internals/versioning/)

## Getting Started

### Installation

Biome is best installed as a development dependency:

```bash
# npm
npm i -D -E @biomejs/biome

# pnpm
pnpm add -D -E @biomejs/biome

# bun
bun add -D -E @biomejs/biome

# deno
deno add -D npm:@biomejs/biome

# yarn
yarn add -D -E @biomejs/biome
```

> **Version pinning**: `-E` ensures the package manager pins the version. See [versioning](https://biomejs.dev/internals/versioning/) for why pinning is important.

### Configuration

Biome can run with zero configuration. To generate a `biome.json`:

```bash
npx @biomejs/biome init
# or: pnpx @biomejs/biome init
# or: bunx --bun @biomejs/biome init
# or: deno run -A npm:@biomejs/biome init
# or: yarn exec biome -- init
```

### Usage — Command-line Interface

```bash
# Format all files
npx @biomejs/biome format --write

# Format specific files
npx @biomejs/biome format --write <files>

# Lint files and apply safe fixes
npx @biomejs/biome lint --write

# Format, lint, and organize imports (all-in-one)
npx @biomejs/biome check --write

# Format, lint, and organize imports for specific files
npx @biomejs/biome check --write <files>
```

### Editor Integrations

First-party extensions available for:
- [VS Code](https://biomejs.dev/editors/first-party-extensions/)
- [IntelliJ](https://biomejs.dev/editors/first-party-extensions/)
- [Zed](https://biomejs.dev/editors/first-party-extensions/)

Community extensions for Vim, Neovim, Sublime Text, and more: [third-party extensions](https://biomejs.dev/editors/third-party-extensions/)

### Continuous Integration

```bash
# CI mode — works like check but optimized for CI
biome ci
```

See [CI recipes](https://biomejs.dev/recipes/continuous-integration/) for GitHub Actions and GitLab CI examples.

### Next Steps

- [Migrate from ESLint and Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [Configure Biome](https://biomejs.dev/guides/configure-biome/)
- [Formatter](https://biomejs.dev/formatter/)
- [Linter](https://biomejs.dev/linter/)
- [CLI commands and options](https://biomejs.dev/reference/cli/)
- [Configuration options](https://biomejs.dev/reference/configuration/)

## Manual Installation

See: [Manual installation](https://biomejs.dev/guides/manual-installation/)

Biome is also available as a standalone executable that doesn't require Node.js.

### Supported Platforms

- Linux x86_64, aarch64
- macOS x86_64, aarch64 (Apple Silicon)
- Windows x86_64

### Installation Methods

- **Homebrew**: `brew install biomejs/biome/biome`
- **Winget** (Windows): `winget install Biome.Biome`
- **Arch Linux**: AUR package
- **Docker**: `docker run --rm -v $(pwd):/app ghcr.io/biomejs/biome:latest`
- **Published binary**: Download from [GitHub releases](https://github.com/biomejs/biome/releases)

## Configure Biome

See: [Configure Biome](https://biomejs.dev/guides/configure-biome/)

### Configuration File Structure

A Biome configuration file is named `biome.json` or `biome.jsonc`, usually placed in the project root next to `package.json`.

Biome provides three tools: **formatter**, **linter**, and **assist**. All are enabled by default:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.13/schema.json",
  "formatter": { "enabled": false },
  "linter": { "enabled": false },
  "assist": { "enabled": false }
}
```

Language-specific options go under `<language>.<tool>`:

```json
{
  "formatter": {
    "indentStyle": "space",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "lineWidth": 120
    }
  },
  "json": {
    "formatter": {
      "enabled": false
    }
  }
}
```

> **Note**: Biome refers to all variants of JavaScript (TypeScript, JSX, TSX) as `javascript`.

### Configuration File Resolution

Biome discovers configuration files in this order:
1. `biome.json`
2. `biome.jsonc`
3. `.biome.json`
4. `.biome.jsonc`

Search order:
1. Current working directory
2. Parent folders (recursively)
3. Home directory:
   - Linux: `$XDG_CONFIG_HOME` or `$HOME/.config/biome`
   - macOS: `/Users/$USER/Library/Application Support/biome`
   - Windows: `C:\Users\$USER\AppData\Roaming\biome\config`

If no configuration is found, Biome's default configuration is used.

### Specifying Files to Process

**Include files via CLI**:
```bash
biome format file1.js src/
```

> **Caution**: Glob patterns on the command line are expanded by your shell, not Biome. Some shells don't support `**`.

**Control files via configuration**:

Use `files.includes` with glob patterns. Negated patterns with `!` exclude files:

```json
{
  "files": {
    "includes": ["src/**/*.js", "test/**/*.js", "!**/*.min.js"]
  },
  "linter": {
    "includes": ["**", "!test/**"]
  }
}
```

Use `!!` to exclude files from any project-related operation (module graph, type inference):

```json
{
  "files": {
    "includes": ["**", "!**/*.generated.js", "!!**/dist"]
  }
}
```

**Control files via VCS**: See [VCS integration](https://biomejs.dev/guides/integrate-in-vcs/).

### Protected Files

Biome always ignores these files:
- `composer.lock`
- `npm-shrinkwrap.json`
- `package-lock.json`
- `yarn.lock`

### Well-known Files

Biome treats certain files specially based on their names rather than extensions:

**Parsed as strict JSON** (no comments, no trailing commas):
`.all-contributorsrc`, `.arcconfig`, `.auto-changelog`, `.bowerrc`, `.c8rc`, `.htmlhintrc`, `.imgbotconfig`, `.jslintrc`, `.nycrc`, `.tern-config`, `.tern-project`, `.vuerc`, `.watchmanconfig`, `mcmod.info`

**Parsed as JSON with comments** (no trailing commas):
`.ember-cli`, `.eslintrc.json`, `.jscsrc`, `.jshintrc`, `tslint.json`, `turbo.json`

**Parsed as JSON with comments and trailing commas**:
`.babelrc`, `.babelrc.json`, `.devcontainer.json`, `.hintrc`, `.oxlintrc.json`, `.swcrc`, `babel.config.json`, `deno.json`, `devcontainer.json`, `dprint.json`, `jsconfig.json`, `jsr.json`, `nx.json`, `project.json`, `tsconfig.json`, `typedoc.json`, `typescript.json`, all `.json` under `.vscode/`, `.zed/`, `.cursor/`

## Use Biome in Big Projects

See: [Big Projects guide](https://biomejs.dev/guides/big-projects/)

### Use Multiple Configuration Files

Biome supports nested `biome.json` files. A nested configuration must set `"root": false`:

```json
{
  "root": false
}
```

Biome resolves configuration from the current directory up to parent folders.

### Monorepo

Use the `"extends": ["//"]` syntax to share a root configuration across packages:

```json
{
  "extends": ["//"],
  "linter": {
    "rules": {
      "style": { "useConst": "error" }
    }
  }
}
```

`"//"` is a special value that tells Biome to extend from the root configuration.

### Exporting a Biome Configuration from an NPM Package

You can publish a package that exports a Biome configuration:

```json
{
  "extends": ["@my-org/biome-config"]
}
```

## Integrate Biome with VCS

See: [VCS Integration](https://biomejs.dev/guides/integrate-in-vcs/)

### Use the Ignore File

Enable VCS integration to respect `.gitignore` files:

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  }
}
```

### Process Only Changed Files

```bash
biome check --changed --since=main
```

### Process Only Staged Files

```bash
biome check --staged
```

## Investigate Slowness

See: [Investigate Slowness](https://biomejs.dev/guides/investigate-slowness/)

### First Things First

- Check if the Scanner is triggered (project domain rules like `noFloatingPromises`, `noUnresolvedImports`, `noImportCycles`)
- The Scanner crawls files and creates module graph + inferred types
- Scanner is opt-in, triggered only when a project domain rule is enabled

### Tracing

Use `--log-level=debug` or `--log-kind=json` to get timing information:

```bash
biome check --log-level=debug
```

## Migrate from ESLint and Prettier

See: [Migration Guide](https://biomejs.dev/guides/migrate-eslint-prettier/)

### Quick Migration

```bash
biome migrate eslint --write
biome migrate prettier --write
```

### Migrate from ESLint

`biome migrate eslint` reads your ESLint configuration and ports settings to `biome.json`:
- Handles both legacy and flat configuration files
- Supports `extends` field and loads shared/plugin configurations
- Migrates `.eslintignore`
- Does not support YAML configuration

```bash
# Basic migration
npx @biomejs/biome migrate eslint --write

# Include inspired rules
npx @biomejs/biome migrate eslint --write --include-inspired
```

After migration, suppress new violations:

```bash
biome lint --suppress --reason "suppressed due to migration"
```

### Migrate from Prettier

`biome migrate prettier` reads your Prettier configuration and ports settings to `biome.json`:

```bash
npx @biomejs/biome migrate prettier --write
```

Does not support JSON5, TOML, or YAML configuration. Requires Node.js for `.prettierrc.js` files.

## Language Support

See: [Language Support](https://biomejs.dev/internals/language-support/)

### Supported Languages

| Language | Format | Lint | Assist |
|----------|--------|------|--------|
| JavaScript (ES2024) | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |
| JSX | ✅ | ✅ | ✅ |
| TSX | ✅ | ✅ | ✅ |
| JSON | ✅ | ✅ | ✅ |
| JSONC | ✅ | ✅ | ✅ |
| CSS | ✅ | ✅ | ✅ |
| GraphQL | ✅ | ✅ | ✅ |
| Grit | ✅ | ✅ | — |
| HTML | 🟡 | 🟡 | 🟡 |
| Vue | 🟡 | 🟡 | — |
| Svelte | 🟡 | 🟡 | — |
| Astro | 🟡 | 🟡 | — |
| YAML | 🚫 | 🚫 | 🚫 |
| Markdown | 🚫 | 🚫 | 🚫 |

Legend: ✅ Supported | 🚫 Not in progress | ⏳ In progress | 🟡 Experimental

### JavaScript Support

- Biome supports ES2024
- Only official syntax (Stage 3+ proposals)
- Embedded languages support (experimental)

### TypeScript Support

- Full TypeScript syntax support
- Type-aware lint rules (via Scanner, opt-in)

## Versioning

See: [Versioning](https://biomejs.dev/internals/versioning/)

Biome follows [Semantic Versioning](https://semver.org/):

### Patch Release
- Fixing false positives in lint rules
- Fixing incorrect code suggestions
- Fixing formatting that produces invalid code
- Documentation improvements
- Internal refactors, performance improvements

### Minor Release
- Adding a new non-recommended rule
- Adding linting/formatting support for new language features
- Removal of recommended rules
- Deprecation of existing rules
- New optional configuration options

### Major Release
- Configuration changes that result in different formatting or more lint errors
- Changes to Biome's public API
- Promotion of new features requiring spotlight

### VS Code Extension

The VS Code extension follows its own versioning. It is recommended to pin both Biome and the extension.

### Why Pinning is Important

Biome updates may include new lint rules or formatting changes. Pinning ensures consistent behavior across environments and CI.

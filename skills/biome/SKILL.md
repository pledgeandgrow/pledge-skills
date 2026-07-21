# Biome — Skill Overview

> **Source**: [biomejs.dev](https://biomejs.dev/) | [Getting Started](https://biomejs.dev/guides/getting-started/) | [Formatter](https://biomejs.dev/formatter/) | [Linter](https://biomejs.dev/linter/) | [CLI](https://biomejs.dev/reference/cli/) | [Configuration](https://biomejs.dev/reference/configuration/)

## What is Biome?

Biome is a fast, all-in-one toolchain for web projects — it **formats**, **lints**, and **assists** your code in a fraction of a second. It is designed to replace Prettier and ESLint with a single, opinionated tool written in Rust.

### Key Benefits

- **Fast**: Written in Rust, formats and lints in milliseconds
- **All-in-one**: Formatter + linter + import organizer in one tool
- **Opinionated**: Few options, no bike-shedding — like Prettier's philosophy
- **Multi-language**: JavaScript, TypeScript, JSX, TSX, JSON, CSS, GraphQL, Grit, HTML (experimental)
- **Zero config**: Works out of the box with sensible defaults
- **Editor integration**: First-party extensions for VS Code, IntelliJ, Zed
- **CI ready**: `biome ci` command optimized for CI pipelines
- **Migration tools**: `biome migrate eslint` and `biome migrate prettier` commands
- **Plugin system**: GritQL-based linter plugins for custom rules

## File Index

| File | Coverage |
|------|----------|
| [getting-started.md](getting-started.md) | Installation, getting started, configure Biome, manual installation, big projects, VCS integration, investigate slowness, language support, versioning |
| [formatter.md](formatter.md) | Formatter usage, CLI, options, ignore code, differences with Prettier, option philosophy |
| [linter.md](linter.md) | Linter usage, rules, safe/unsafe fixes, rule pillars, configure linter, suppressions, domains, plugins, rules sources, linter groups, FAQ |
| [reference.md](reference.md) | CLI reference (all commands), configuration reference (all options), diagnostics, GritQL reference |

## Quick Start

```bash
# Install
npm i -D -E @biomejs/biome
# or: pnpm add -D -E @biomejs/biome
# or: bun add -D -E @biomejs/biome
# or: deno add -D npm:@biomejs/biome
# or: yarn add -D -E @biomejs/biome

# Initialize configuration
npx @biomejs/biome init

# Format all files
npx @biomejs/biome format --write

# Lint and apply safe fixes
npx @biomejs/biome lint --write

# Format + lint + organize imports (all-in-one)
npx @biomejs/biome check --write

# CI mode (optimized for CI environments)
npx @biomejs/biome ci
```

## Documentation Links

### Guides
- [Getting Started](https://biomejs.dev/guides/getting-started/)
- [Manual Installation](https://biomejs.dev/guides/manual-installation/)
- [Configure Biome](https://biomejs.dev/guides/configure-biome/)
- [Use Biome in Big Projects](https://biomejs.dev/guides/big-projects/)
- [Integrate Biome with VCS](https://biomejs.dev/guides/integrate-in-vcs/)
- [Investigate Slowness](https://biomejs.dev/guides/investigate-slowness/)
- [Migrate from ESLint and Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/)

### Formatter
- [Formatter](https://biomejs.dev/formatter/)
- [Differences with Prettier](https://biomejs.dev/formatter/differences-with-prettier/)
- [Formatter Option Philosophy](https://biomejs.dev/formatter/option-philosophy/)

### Linter
- [Linter](https://biomejs.dev/linter/)
- [Domains](https://biomejs.dev/linter/domains/)
- [Linter Plugins](https://biomejs.dev/linter/plugins/)
- [Rules Sources](https://biomejs.dev/linter/rules-sources/)
- [JavaScript Rules](https://biomejs.dev/linter/javascript/rules/)
- [CSS Rules](https://biomejs.dev/linter/css/rules/)
- [GraphQL Rules](https://biomejs.dev/linter/graphql/rules/)

### Analyzer
- [Suppressions](https://biomejs.dev/analyzer/suppressions/)

### Reference
- [CLI](https://biomejs.dev/reference/cli/)
- [Configuration](https://biomejs.dev/reference/configuration/)
- [Diagnostics](https://biomejs.dev/reference/diagnostics/)
- [GritQL](https://biomejs.dev/reference/gritql/)

### Editors
- [First-party Extensions](https://biomejs.dev/editors/first-party-extensions/)
- [Third-party Extensions](https://biomejs.dev/editors/third-party-extensions/)

### Recipes
- [Continuous Integration](https://biomejs.dev/recipes/continuous-integration/)

### Internals
- [Language Support](https://biomejs.dev/internals/language-support/)
- [Versioning](https://biomejs.dev/internals/versioning/)

### Community
- [Discord](https://biomejs.dev/chat)
- [GitHub](https://github.com/biomejs/biome)
- [Blog](https://biomejs.dev/blog/)

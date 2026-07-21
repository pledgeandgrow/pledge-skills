# ESLint — Getting Started & Core Concepts

> ESLint is a configurable JavaScript linter that helps you find and fix problems in your JavaScript code. Problems can be anything from potential runtime bugs, to not following best practices, to styling issues.

**Documentation**: [eslint.org/docs/latest](https://eslint.org/docs/latest/)  
**Version**: ESLint 10.x (latest)  

## Prerequisites

- Node.js `^20.19.0`, `^22.13.0`, or `>=24` with SSL and ICU support
- TypeScript 5.3+ (if using TypeScript type definitions)

## Quick Start

Install and configure ESLint using the initialization wizard:

```bash
# npm
npm init @eslint/js@latest

# yarn
yarn create @eslint/js

# pnpm
pnpm create @eslint/js

# bun
bun create @eslint/js
```

This creates an `eslint.config.js` (flat config) file in your project root.

## Manual Setup

```bash
# Install ESLint
npm install eslint --save-dev

# Run the config wizard
npx eslint --init

# Lint files
npx eslint .
```

### Global Install (Not Recommended)

```bash
npm install -g eslint
eslint .
```

Global installs are not recommended because they can lead to version conflicts and don't lock versions per project.

## Configuration

ESLint uses a flat config file (`eslint.config.js`) by default:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "semi": ["error", "always"],
    },
  },
]);
```

### CommonJS Format

If your project uses `"type": "commonjs"` in `package.json`:

```js
// eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
]);
```

## Next Steps

- [Core Concepts](#core-concepts) — understand the main components
- [Configure ESLint](configure.md) — adjust configuration for your project
- [CLI Reference](cli-and-formatters.md) — command line flags
- [Rules Reference](rules-reference.md) — all built-in rules

## Core Concepts

### What is ESLint?

ESLint is a configurable JavaScript linter. It helps you find and fix problems in your JavaScript code:
- Potential runtime bugs
- Not following best practices
- Styling issues

ESLint is completely pluggable — every single rule is a plugin and you can add more at runtime.

### Rules

Rules are the core building block of ESLint. A rule validates if your code meets a certain expectation and what to do if it does not meet it. Rules can also contain additional configuration options.

Example: the `semi` rule lets you specify whether JavaScript statements should end with a semicolon.

```js
// Enable rule
"semi": ["error", "always"]  // Require semicolons
"semi": ["error", "never"]   // Disallow semicolons
```

#### Rule Fixes

Some rules can automatically fix problems:
- `--fix` flag applies fixes to the file system
- `--fix-dry-run` shows what would be fixed without saving
- `--fix-type` filters fix types: `directive`, `problem`, `suggestion`, `layout`

#### Rule Suggestions

Some rules provide suggestions that users can manually apply:
- Suggestions are not automatically applied
- Available in editor integrations as quick fixes

### Configuration Files

ESLint uses flat config files (`eslint.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`):
- Placed in the root directory
- Export an array of configuration objects
- Supports `defineConfig()` helper

### Shareable Configurations

Shareable configs are npm packages that export a configuration array:
- Installed via npm
- Referenced in `extends` key
- Convention: `eslint-config-*`

### Plugins

Plugins are npm packages that contain:
- Custom rules
- Custom configurations
- Custom processors
- Custom languages

Convention: `eslint-plugin-*`

### Parsers

Custom parsers allow ESLint to understand different syntax:
- Default parser: `espree`
- Custom parsers for TypeScript, JSX, etc.

### Custom Processors

Processors allow ESLint to lint code embedded in other files:
- Markdown code blocks
- HTML inline scripts
- Extract code → lint → map results back

### Formatters

Formatters control the appearance of linting results:
- Built-in: `stylish` (default), `json`, `json-with-metadata`, `html`
- Custom formatters via npm packages

### Integrations

ESLint integrates with:
- **Editors**: VS Code, JetBrains IDEs, Vim/Neovim, Sublime Text, Emacs, etc.
- **Build tools**: Webpack, Rollup, Vite, Gulp, Grunt
- **CLI tools**: npm scripts, Husky, lint-staged
- **Source control**: GitHub Actions, GitLab CI, pre-commit hooks

### CLI & Node.js API

- **CLI**: `npx eslint [options] file.js [file.js] [dir]`
- **Node.js API**: `const { ESLint } = require("eslint");`

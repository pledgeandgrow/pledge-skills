# Biome — Linter

> **Source**: [Linter](https://biomejs.dev/linter/) | [Domains](https://biomejs.dev/linter/domains/) | [Plugins](https://biomejs.dev/linter/plugins/) | [Rules Sources](https://biomejs.dev/linter/rules-sources/) | [Suppressions](https://biomejs.dev/analyzer/suppressions/)

## Overview

Biome's linter statically analyzes your code to find and fix common errors and help you write better, modern code. It supports multiple languages and provides 510+ rules.

### CLI Usage

```bash
# Lint all files
npx @biomejs/biome lint

# Lint specific folders
npx @biomejs/biome lint ./src ./public

# Lint and apply safe fixes
npx @biomejs/biome lint --write ./src

# Lint and apply safe + unsafe fixes
npx @biomejs/biome lint --write --unsafe ./src
```

> **Caution**: Biome doesn't support globs on the CLI. Use `includes` configuration instead.

## Rules

### Naming Convention

- Rules starting with `use*` enforce/suggest something
- Rules starting with `no*` deny something

Example: `noDebugger` denies the use of `debugger` statements.

### Recommended Rules

Biome ships with a set of recommended rules that vary based on language, enabled by default with the default configuration.

### Rule Pillars

1. **Explain the error** — the diagnostic message
2. **Explain why the error is triggered** — an additional note
3. **Tell the user what to do** — a code action

### Safe Fixes

Safe fixes are guaranteed to not change the semantics of your code. They can be applied without explicit review.

```bash
# Apply safe fixes
biome lint --write ./src
```

From an LSP-compatible editor, use the `source.fixAll.biome` code action to apply safe fixes on save.

### Unsafe Fixes

Unsafe fixes may change the semantics of your program. Manual review is advised.

```bash
# Apply safe + unsafe fixes
biome lint --write --unsafe ./src
```

From an editor, unsafe fixes cannot be applied on save — you must review and apply each fix individually.

## Configure the Linter

### Disable a Rule

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noDebugger": "off"
      }
    }
  }
}
```

### Disable Recommended Rules

```json
{
  "linter": {
    "rules": {
      "recommended": false
    }
  }
}
```

### Change Rule Severity

Severity options: `"error"`, `"warn"`, `"info"`, `"on"` (use default severity):

```json
{
  "linter": {
    "rules": {
      "style": {
        "noShoutyConstants": "on"
      }
    }
  }
}
```

- `"error"` — causes CLI to exit with error code (blocks CI)
- `"warn"` — doesn't cause error exit unless `--error-on-warnings` is used
- `"info"` — never affects exit status

### Change Group Severity

```json
{
  "linter": {
    "rules": {
      "a11y": "off"
    }
  }
}
```

### Configure the Code Fix

Use the `fix` option: `"none"`, `"safe"`, or `"unsafe"`:

```json
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": {
          "level": "error",
          "fix": "none"
        }
      },
      "style": {
        "useConst": {
          "level": "warn",
          "fix": "unsafe"
        },
        "useTemplate": {
          "level": "warn",
          "fix": "safe"
        }
      }
    }
  }
}
```

### Skip a Rule or Group (CLI)

```bash
biome lint --skip=style --skip=suspicious/noExplicitAny
```

### Run Only a Rule or Group (CLI)

```bash
biome lint --only=style/useNamingConvention --only=style/noInferrableTypes --only=a11y
```

### Rule Options

Some rules accept options:

```json
{
  "linter": {
    "rules": {
      "style": {
        "useNamingConvention": {
          "level": "error",
          "options": {
            "strictCase": false
          }
        }
      }
    }
  }
}
```

## Domains

See: [Domains](https://biomejs.dev/linter/domains/)

Domains group rules by technology. A domain:
- Has its own set of recommended rules
- Can be automatically enabled when Biome detects certain dependencies in `package.json`
- Can define additional global variables

### Available Domains

| Domain | Auto-activated by | Description |
|--------|-------------------|-------------|
| `react` | `react` dependency | React rules |
| `solid` | `solid-js` dependency | Solid.js rules |
| `test` | `mocha`, `vitest`, etc. | Test framework rules |
| `next` | `next` dependency | Next.js rules |
| `qwik` | `@builder.io/qwik` | Qwik rules |
| `svelte` | `svelte` dependency | Svelte rules |
| `vue` | `vue` dependency | Vue rules |
| `reactNative` | `react-native` | React Native rules |
| `playwright` | `@playwright/test` | Playwright rules |
| `turborepo` | `turbo` dependency | Turborepo rules |
| `drizzle` | `drizzle-orm` | Drizzle ORM rules |
| `project` | Manual | Project-level rules (Scanner-based) |
| `types` | Manual | Type-aware rules |

### Configure Domains

```json
{
  "linter": {
    "domains": {
      "test": "recommended"
    }
  }
}
```

Values: `"recommended"`, `"all"`, `"off"`.

### Project Domain

The `project` domain requires the Scanner, which crawls files to build a module graph and infer types. Rules like `noFloatingPromises`, `noUnresolvedImports`, and `noImportCycles` belong to this domain.

The Scanner may impact performance and memory usage.

## Suppress Lint Rules

See: [Suppressions](https://biomejs.dev/analyzer/suppressions/)

### Suppression Syntax

```
// biome-ignore lint: <explanation>
// biome-ignore lint/suspicious: <explanation>
// biome-ignore lint/suspicious/noDebugger: <explanation>
// biome-ignore lint/suspicious/noDebugger(foo): <explanation>
// biome-ignore lint/plugin: <explanation>
// biome-ignore lint/plugin/<plugin-name>: <explanation>
// biome-ignore-all lint: <explanation>
// biome-ignore-start lint: <explanation>
// biome-ignore-end lint: <explanation>
```

Categories: `lint`, `assist`, `syntax`.

### Inline Suppressions

Disable a rule for the next line:

```javascript
// biome-ignore lint/suspicious/noDebugger: reason
debugger;
debugger; // this one still raises a diagnostic
```

### Top-level Suppressions

Disable a rule for an entire file (must be at the top):

```javascript
// biome-ignore-all lint/suspicious/noDebugger: reason
debugger;
debugger;
```

### Range Suppressions

Disable a rule for a range of lines:

```javascript
// biome-ignore-start lint/suspicious/noDoubleEquals: reason
a == b;
c == d;
// biome-ignore-end lint/suspicious/noDoubleEquals: reason
f == g; // this raises a diagnostic
```

Range suppressions can overlap and must have matching `biome-ignore-end` comments.

### Plugin Suppressions

```javascript
// biome-ignore lint/plugin/preferObjectSpread: reason
Object.assign({}, foo);

// Suppress all plugins
// biome-ignore lint/plugin: reason
```

## Integration with Editors

### Apply Actions on Save

**VS Code**:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit"
  }
}
```

**Zed**:
```json
{
  "code_actions_on_format": {
    "source.fixAll.biome": true
  }
}
```

### Editor Suppressions

Control suppression code actions:

```json
// VS Code
{
  "editor.codeActionsOnSave": {
    "source.suppressRule.inline.biome": "never",
    "source.suppressRule.topLevel.biome": "never"
  }
}
```

## Linter Plugins

See: [Linter Plugins](https://biomejs.dev/linter/plugins/)

Biome supports [GritQL](https://biomejs.dev/reference/gritql/) plugins for custom lint rules.

### Example Plugin

Create a `.grit` file:

```grit
`$fn($args)` where {
  $fn <: `Object.assign`,
  register_diagnostic(
    span = $fn,
    message = "Prefer object spread instead of `Object.assign()`"
  )
}
```

Enable in configuration:

```json
{
  "plugins": ["./path-to-plugin.grit"]
}
```

### Restricting Plugins to Specific Files

```json
{
  "plugins": [
    {
      "path": "./react-plugin.grit",
      "includes": ["src/components/**"]
    },
    {
      "path": "./ts-only-plugin.grit",
      "includes": ["src/**/*.ts", "!src/**/*.test.ts"]
    }
  ]
}
```

### Target Languages

Specify a target language in the GritQL snippet:

```grit
language css;

`$selector { $props }` where {
  $props <: contains `color: $color` as $rule,
  not $selector <: r"\.color-.*",
  register_diagnostic(
    span = $rule,
    message = "Don't set explicit colors. Use `.color-*` classes instead."
  )
}
```

Supported target languages: JavaScript, CSS, JSON.

### Plugin API

#### `register_diagnostic()`

Registers a diagnostic when a pattern matches:

- `span` (required): The syntax node to attach the diagnostic to
- `message` (required): The diagnostic message
- `severity`: `hint`, `info`, `warn`, `error` (default: `error`)
- `fix_kind`: `safe` or `unsafe` (default: `unsafe`)

### Code Rewrites

Plugins can suggest rewrites using the `=>` operator:

```grit
`console.log($msg)` as $call where {
  register_diagnostic(
    span = $call,
    message = "Use console.info instead of console.log.",
    severity = "warn",
    fix_kind = "safe"
  ),
  $call => `console.info($msg)`
}
```

Rewrite behavior:
- Without `--write`: rewrites shown as suggestions, not applied
- With `--write`: safe rewrites applied
- With `--write --unsafe`: unsafe rewrites also applied
- If `fix_kind` is omitted, rewrite is treated as unsafe

## Migrate from Other Linters

See: [Rules Sources](https://biomejs.dev/linter/rules-sources/)

Many Biome lint rules are inspired from other linters:

- ESLint
- typescript-eslint
- @next/eslint-plugin-next
- eslint-plugin-jsx-a11y
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-plugin-solid
- eslint-plugin-sonarjs
- eslint-plugin-stylistic
- eslint-plugin-unicorn
- eslint-plugin-import
- eslint-plugin-jest
- eslint-plugin-n
- eslint-plugin-no-secrets
- eslint-plugin-unused-imports
- eslint-plugin-barrel-files
- @mysticatea/eslint-plugin
- Clippy
- GraphQL-ESLint
- Stylelint

Use `biome migrate eslint` to port ESLint configurations:

```bash
biome migrate eslint --write
```

## Linter Groups

| Group | Description |
|-------|-------------|
| **Accessibility** | Rules focused on preventing accessibility problems |
| **Complexity** | Rules that inspect complex code that could be simplified |
| **Correctness** | Rules that detect code guaranteed to be incorrect or useless |
| **Nursery** | New rules still under development (not subject to semver, require explicit opt-in on stable) |
| **Performance** | Rules catching ways code could run faster |
| **Security** | Rules that detect potential security flaws |
| **Style** | Rules enforcing consistent, idiomatic code (warnings by default) |
| **Suspicious** | Rules that detect code likely to be incorrect or useless |

## FAQ

### Why does rule X have an unsafe fix?

Reasons a fix may be marked unsafe:
- The rule is still under heavy development
- The fix can change program semantics
- The fix can deteriorate DX while typing/saving (e.g., `noUnusedVariables` adds `_` to names)

### Why is Biome linter so slow compared to v1?

Since Biome v2, the Scanner crawls project files to build module graph and inferred types. This is needed for project domain rules (`noFloatingPromises`, `noUnresolvedImports`, `noImportCycles`). The Scanner is opt-in.

See [Investigate Slowness guide](https://biomejs.dev/guides/investigate-slowness/) for mitigation advice.

### Why is Biome using so much memory?

If you enable project domain rules, Biome scans `.d.ts` files inside `node_modules`, including transitive dependencies. This is intentional because libraries can export types from their dependencies.

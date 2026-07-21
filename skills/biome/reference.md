# Biome — Reference

> **Source**: [CLI](https://biomejs.dev/reference/cli/) | [Configuration](https://biomejs.dev/reference/configuration/) | [Diagnostics](https://biomejs.dev/reference/diagnostics/) | [GritQL](https://biomejs.dev/reference/gritql/)

## CLI Reference

See: [CLI](https://biomejs.dev/reference/cli/)

### Command Summary

| Command | Description |
|---------|-------------|
| `biome` | Default command (runs `check`) |
| `biome version` | Print Biome version |
| `biome upgrade` | Upgrade Biome to latest version |
| `biome rage` | Print diagnostics information for bug reports |
| `biome start` | Start the LSP daemon |
| `biome stop` | Stop the LSP daemon |
| `biome check` | Format, lint, and organize imports |
| `biome lint` | Lint files |
| `biome format` | Format files |
| `biome ci` | Run in CI mode (like check, optimized for CI) |
| `biome init` | Initialize a `biome.json` configuration file |
| `biome lsp-proxy` | Run as LSP proxy |
| `biome migrate` | Migrate configuration from other tools |
| `biome migrate prettier` | Migrate Prettier configuration |
| `biome migrate eslint` | Migrate ESLint configuration |
| `biome search` | Search for code patterns using GritQL |
| `biome explain` | Explain a diagnostic |
| `biome clean` | Clean Biome cache |

### `biome check`

Runs formatter, linter, and import organizer. The all-in-one command.

```bash
biome check [PATHS...]
biome check --write [PATHS...]
biome check --write --unsafe [PATHS...]
```

Key options:
- `--write` — apply safe fixes
- `--unsafe` — also apply unsafe fixes
- `--apply` — alias for `--write`
- `--apply-unsafe` — alias for `--write --unsafe`
- `--staged` — process only staged files (git)
- `--changed` — process only changed files
- `--since=<REF>` — base ref for `--changed`
- `--formatter-enabled` — enable/disable formatter
- `--linter-enabled` — enable/disable linter
- `--assist-enabled` — enable/disable assist
- `--skip=<RULE>` — skip a rule or group
- `--only=<RULE>` — run only a rule or group
- `--suppress` — suppress diagnostics with inline comments
- `--reason=<REASON>` — reason for suppression
- `--error-on-warnings` — exit with error code on warnings
- `--reporter=<FORMAT>` — output format (`default`, `json`, `github`, `junit`, `summary`, `migrate`)
- `--max-diagnostics=<N>` — max diagnostics to show
- `--max-file-size=<N>` — max file size to process
- `--no-errors-on-unmatched` — don't error on unmatched files
- `--files-ignore-unknown` — ignore unknown file types
- `--config-path=<PATH>` — path to configuration file

### `biome lint`

Runs only the linter.

```bash
biome lint [PATHS...]
biome lint --write [PATHS...]
biome lint --write --unsafe [PATHS...]
```

Same key options as `check` (minus formatter-specific ones).

### `biome format`

Runs only the formatter.

```bash
biome format [PATHS...]
biome format --write [PATHS...]
```

Key options:
- `--write` — write formatted output to files
- `--indent-style=<STYLE>` — `tab` or `space`
- `--indent-width=<N>` — indent width
- `--line-width=<N>` — line width
- `--line-ending=<ENDING>` — `lf`, `crlf`, `cr`
- `--quote-style=<STYLE>` — `single` or `double` (JavaScript)
- `--semicolons=<STYLE>` — `always` or `asNeeded` (JavaScript)

### `biome ci`

Optimized for CI environments. Works like `check` but:
- Never writes to files
- Exits with error code on any diagnostic
- Optimized for performance

```bash
biome ci [PATHS...]
```

Key options: same as `check` plus:
- `--reporter=<FORMAT>` — `default`, `github`, `gitlab`, `json`, `junit`, `summary`

### `biome init`

Creates a `biome.json` configuration file:

```bash
biome init
```

### `biome migrate`

```bash
# Migrate ESLint configuration
biome migrate eslint --write

# Migrate Prettier configuration
biome migrate prettier --write

# Include inspired rules
biome migrate eslint --write --include-inspired
```

### `biome search`

Search for code patterns using GritQL:

```bash
biome search '`console.log($msg)`'
```

### `biome explain`

Explain a diagnostic:

```bash
biome explain <DIAGNOSTIC_NAME>
```

### `biome clean`

Clean Biome cache:

```bash
biome clean
```

### Global Options

- `--config-path=<PATH>` — path to configuration file
- `--config-path=<PATH>` — override configuration file location
- `--log-level=<LEVEL>` — `none`, `error`, `warn`, `info`, `debug`, `trace`
- `--log-kind=<KIND>` — `text`, `json`
- `--diagnostic-level=<LEVEL>` — filter diagnostics by level
- `--skip-rest` — skip remaining checks after first error

## Configuration Reference

See: [Configuration](https://biomejs.dev/reference/configuration/)

### Top-Level Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `$schema` | string | — | Path to JSON schema file |
| `extends` | string[] | — | Paths to other Biome configurations to extend |
| `root` | boolean | `true` | Whether this is a root configuration |
| `plugins` | (string\|object)[] | — | GritQL plugin paths |
| `files` | object | — | File processing options |
| `vcs` | object | — | VCS integration options |
| `formatter` | object | — | Formatter options |
| `linter` | object | — | Linter options |
| `assist` | object | — | Assist options |
| `javascript` | object | — | JavaScript-specific options |
| `json` | object | — | JSON-specific options |
| `css` | object | — | CSS-specific options |
| `graphql` | object | — | GraphQL-specific options |
| `grit` | object | — | Grit-specific options |
| `html` | object | — | HTML-specific options |
| `overrides` | object[] | — | Per-file overrides |

### `plugins`

Each entry can be a string path or an object:

```json
{
  "plugins": [
    "./my-plugin.grit",
    {
      "path": "./react-plugin.grit",
      "includes": ["src/components/**"]
    }
  ]
}
```

### `files`

| Option | Type | Description |
|--------|------|-------------|
| `files.includes` | string[] | Glob patterns to include/exclude |
| `files.ignoreUnknown` | boolean | Ignore unknown file types |
| `files.maxSize` | number | Max file size to process |
| `files.experimentalScannerIgnores` | string[] | Files to ignore for Scanner |

### `vcs`

| Option | Type | Description |
|--------|------|-------------|
| `vcs.enabled` | boolean | Enable VCS integration |
| `vcs.clientKind` | string | `"git"`, `"svn"`, etc. |
| `vcs.useIgnoreFile` | boolean | Use `.gitignore` |
| `vcs.root` | string | VCS root directory |
| `vcs.defaultBranch` | string | Default branch name |

### `linter`

| Option | Type | Description |
|--------|------|-------------|
| `linter.enabled` | boolean | Enable linter |
| `linter.includes` | string[] | Files to lint |
| `linter.rules.recommended` | boolean | Enable recommended rules |
| `linter.rules.preset` | string | Rule preset |
| `linter.rules.[group]` | string\|object | Group-level configuration |
| `linter.domains` | object | Domain configuration |

### `assist`

| Option | Type | Description |
|--------|------|-------------|
| `assist.enabled` | boolean | Enable assist |
| `assist.includes` | string[] | Files to assist |
| `assist.actions.recommended` | boolean | Enable recommended actions |
| `assist.actions.[group]` | string\|object | Group-level actions |

### `formatter`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `formatter.enabled` | boolean | `true` | Enable formatter |
| `formatter.includes` | string[] | — | Files to format |
| `formatter.formatWithErrors` | boolean | `false` | Format even with syntax errors |
| `formatter.indentStyle` | string | `"tab"` | `"tab"` or `"space"` |
| `formatter.indentWidth` | number | `2` | Indent width |
| `formatter.lineEnding` | string | `"lf"` | `"lf"`, `"crlf"`, `"cr"` |
| `formatter.lineWidth` | number | `80` | Line width |
| `formatter.attributePosition` | string | `"auto"` | Attribute position |
| `formatter.bracketSpacing` | boolean | `true` | Bracket spacing |
| `formatter.delimiterSpacing` | boolean | `false` | Delimiter spacing |
| `formatter.expand` | string | — | Expand/collapse |
| `formatter.trailingNewline` | string | — | Trailing newline |
| `formatter.useEditorconfig` | boolean | — | Load `.editorconfig` |

### `javascript`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `javascript.parser.unsafeParameterDecoratorsEnabled` | boolean | — | Parameter decorators |
| `javascript.parser.jsxEverywhere` | boolean | — | JSX in any file |
| `javascript.formatter.quoteStyle` | string | `"double"` | `"single"` or `"double"` |
| `javascript.formatter.jsxQuoteStyle` | string | `"double"` | JSX quote style |
| `javascript.formatter.quoteProperties` | string | `"asNeeded"` | Quote object properties |
| `javascript.formatter.trailingCommas` | string | `"all"` | Trailing commas |
| `javascript.formatter.semicolons` | string | `"always"` | `"always"` or `"asNeeded"` |
| `javascript.formatter.arrowParentheses` | string | `"always"` | Arrow function parens |
| `javascript.formatter.bracketSameLine` | boolean | `false` | JSX bracket same line |
| `javascript.formatter.bracketSpacing` | boolean | `true` | Bracket spacing |
| `javascript.formatter.delimiterSpacing` | boolean | `false` | Delimiter spacing |
| `javascript.formatter.attributePosition` | string | `"auto"` | Attribute position |
| `javascript.formatter.expand` | string | — | Expand/collapse |
| `javascript.formatter.operatorLinebreak` | string | — | Operator line breaking |
| `javascript.formatter.trailingNewline` | string | — | Trailing newline |
| `javascript.globals` | string[] | — | Global variables |
| `javascript.jsxRuntime` | string | — | `"reactClassic"` or transparent |
| `javascript.linter.enabled` | boolean | `true` | JS linter |
| `javascript.assist.enabled` | boolean | `true` | JS assist |
| `javascript.experimentalEmbeddedSnippetsEnabled` | boolean | — | Embedded snippets |

### `json`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `json.parser.allowComments` | boolean | — | Allow comments |
| `json.parser.allowTrailingCommas` | boolean | — | Allow trailing commas |
| `json.formatter.enabled` | boolean | `true` | Enable JSON formatter |
| `json.formatter.trailingCommas` | string | `"none"` | Trailing commas |
| `json.formatter.expand` | string | — | Expand/collapse |
| `json.formatter.trailingNewline` | string | — | Trailing newline |
| `json.linter.enabled` | boolean | `true` | JSON linter |
| `json.assist.enabled` | boolean | `true` | JSON assist |

### `css`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `css.parser.cssModules` | boolean | — | CSS Modules support |
| `css.parser.tailwindDirectives` | boolean | — | Tailwind directives |
| `css.formatter.enabled` | boolean | `true` | Enable CSS formatter |
| `css.formatter.quoteStyle` | string | `"double"` | Quote style |
| `css.formatter.trailingNewline` | string | — | Trailing newline |
| `css.linter.enabled` | boolean | `true` | CSS linter |
| `css.assist.enabled` | boolean | `true` | CSS assist |

### `graphql`

| Option | Type | Description |
|--------|------|-------------|
| `graphql.formatter.enabled` | boolean | Enable GraphQL formatter |
| `graphql.formatter.quoteStyle` | string | Quote style |
| `graphql.formatter.trailingNewline` | string | Trailing newline |
| `graphql.linter.enabled` | boolean | GraphQL linter |
| `graphql.assist.enabled` | boolean | GraphQL assist |

### `grit`

| Option | Type | Description |
|--------|------|-------------|
| `grit.formatter.enabled` | boolean | Enable Grit formatter |
| `grit.formatter.quoteStyle` | string | Quote style |
| `grit.formatter.trailingNewline` | string | Trailing newline |
| `grit.linter.enabled` | boolean | Grit linter |
| `grit.assist.enabled` | boolean | Grit assist |

### `html` (Experimental)

| Option | Type | Description |
|--------|------|-------------|
| `html.experimentalFullSupportEnabled` | boolean | Enable full HTML support |
| `html.parser.interpolation` | boolean | Interpolation support |
| `html.parser.vue` | boolean | Vue template support |
| `html.formatter.enabled` | boolean | Enable HTML formatter |
| `html.formatter.attributePosition` | string | Attribute position |
| `html.formatter.bracketSameLine` | boolean | Bracket same line |
| `html.formatter.whitespaceSensitivity` | string | Whitespace sensitivity |
| `html.formatter.indentScriptAndStyle` | boolean | Indent script/style |
| `html.formatter.selfCloseVoidElements` | string | Self-close void elements |
| `html.formatter.trailingNewline` | string | Trailing newline |
| `html.linter.enabled` | boolean | HTML linter |
| `html.assist.enabled` | boolean | HTML assist |

### `overrides`

Apply different settings to specific files:

```json
{
  "overrides": [
    {
      "includes": ["tests/**"],
      "formatter": { "lineWidth": 120 },
      "linter": { "rules": { "suspicious": { "noDoubleEquals": "off" } } },
      "javascript": { "formatter": { "quoteStyle": "single" } }
    }
  ]
}
```

### Glob Syntax Reference

- `*` — matches any sequence of non-separator characters
- `**` — matches any sequence of characters including separators
- `?` — matches any single non-separator character
- `[abc]` — matches any character in the set
- `[!abc]` — matches any character not in the set
- `{a,b}` — alternation
- `!` — negates a pattern (excludes from processing)
- `!!` — excludes from any project-related operation (module graph, type inference)

## Diagnostics

See: [Diagnostics](https://biomejs.dev/reference/diagnostics/)

### Diagnostic Severity

| Severity | Description |
|----------|-------------|
| **Fatal** | Biome can't complete the operation |
| **Error** | Causes CLI to exit with error code |
| **Warning** | Doesn't cause error exit (unless `--error-on-warnings`) |
| **Information** | Never affects exit status |

### Diagnostic Tags

| Tag | Description |
|-----|-------------|
| **Verbose** | Extra information available |
| **Internal** | Internal diagnostic |
| **Fixable** | Has a code fix available |
| **Deprecated** | Related to deprecated feature |

### Diagnostic Category

Categories follow the format `tool/group/ruleName`:
- `lint/suspicious/noDebugger`
- `assist/source/useSortedKeys`
- `format`
- `syntax`
- `lint/plugin/<plugin-name>`

### Diagnostic Location

- File path
- Source code span
- Line and column numbers

### Diagnostic Advices

Diagnostics can include:
- Code fixes (safe or unsafe)
- Notes explaining the issue
- Documentation links

## GritQL Reference

See: [GritQL](https://biomejs.dev/reference/gritql/)

GritQL is a pattern-matching language used for Biome linter plugins and the `biome search` command.

### Supported Languages

JavaScript, CSS, JSON.

### Patterns

Match code patterns using backtick syntax:

```grit
`console.log($msg)`
```

### Variables

Variables start with `$`:

```grit
`$fn($args)` where { $fn <: `Object.assign` }
```

### Conditions

Use `where` clauses with `and`, `or`, `not`:

```grit
`$selector { $props }` where {
  $props <: contains `color: $color` as $rule,
  not $selector <: r"\.color-.*"
}
```

### Matching Biome Syntax Nodes

GritQL can match against Biome's syntax tree. Use `language` to specify target language:

```grit
language css;
```

### JSON Patterns

```grit
language json;
```

### Integration Status

GritQL is used in:
- Linter plugins (`.grit` files)
- `biome search` command
- Pattern matching for custom diagnostics

# ESLint — Command Line Interface & Formatters

## CLI Reference

### Basic Usage

```bash
npx eslint [options] file.js [file.js] [dir]
```

### Options

#### Basic Configuration

| Flag | Description |
|------|-------------|
| `--no-config-lookup` | Disable look up for `eslint.config.js` |
| `-c, --config <path>` | Use this configuration instead of `eslint.config.js` |
| `--inspect-config` | Open the config inspector with the current configuration |
| `--ext [String]` | Specify additional file extensions to lint |
| `--global [String]` | Define global variables |
| `--parser <String>` | Specify the parser to be used |
| `--parser-options <Object>` | Specify parser options |

#### Specify Rules and Plugins

| Flag | Description |
|------|-------------|
| `--plugin [String]` | Specify plugins |
| `--rule <Object>` | Specify rules |

#### Fix Problems

| Flag | Description |
|------|-------------|
| `--fix` | Automatically fix problems |
| `--fix-dry-run` | Fix problems without saving changes |
| `--fix-type <Array>` | Types of fixes to apply: `directive`, `problem`, `suggestion`, `layout` |

#### Ignore Files

| Flag | Description |
|------|-------------|
| `--no-ignore` | Disable use of ignore files and patterns |
| `--ignore-pattern [String]` | Patterns of files to ignore |

#### Use stdin

| Flag | Description |
|------|-------------|
| `--stdin` | Lint code provided on STDIN |
| `--stdin-filename <String>` | Specify filename to process STDIN as |

#### Handle Warnings

| Flag | Description |
|------|-------------|
| `--quiet` | Report errors only |
| `--max-warnings <Int>` | Number of warnings to trigger nonzero exit code (default: -1) |

#### Output

| Flag | Description |
|------|-------------|
| `-o, --output-file <path>` | Specify file to write report to |
| `-f, --format <String>` | Use a specific output format (default: stylish) |
| `--color` / `--no-color` | Force enabling/disabling of color |

#### Inline Configuration Comments

| Flag | Description |
|------|-------------|
| `--no-inline-config` | Prevent comments from changing config or rules |
| `--report-unused-disable-directives` | Add errors for unused eslint-disable directives |
| `--report-unused-disable-directives-severity <String>` | Severity: `off`, `warn`, `error`, `0`, `1`, `2` |
| `--report-unused-inline-configs <String>` | Report unused inline config comments |

#### Caching

| Flag | Description |
|------|-------------|
| `--cache` | Only check changed files |
| `--cache-file <path>` | Path to cache file (deprecated, use `--cache-location`) |
| `--cache-location <path>` | Path to cache file or directory |
| `--cache-strategy <String>` | Strategy: `metadata` or `content` (default: metadata) |

#### Suppressing Violations

| Flag | Description |
|------|-------------|
| `--suppress-all` | Suppress all violations |
| `--suppress-rule [String]` | Suppress specific rules |
| `--suppressions-location <path>` | Location of suppressions file |
| `--prune-suppressions` | Prune unused suppressions |
| `--pass-on-unpruned-suppressions` | Ignore unused suppressions |

#### Miscellaneous

| Flag | Description |
|------|-------------|
| `--init` | Run config initialization wizard |
| `--env-info` | Output execution environment information |
| `--no-error-on-unmatched-pattern` | Prevent errors when pattern is unmatched |
| `--exit-on-fatal-error` | Exit with code 2 on fatal error |
| `--no-warn-ignored` | Suppress warnings for ignored files |
| `--pass-on-no-patterns` | Exit with code 0 if no file patterns passed |
| `--debug` | Output debugging information |
| `-h, --help` | Show help |
| `-v, --version` | Output version number |
| `--print-config <path>` | Print configuration for the given file |
| `--stats` | Add statistics to the lint report |
| `--flag [String]` | Enable a feature flag |
| `--mcp` | Start the ESLint MCP server |
| `--concurrency <Int\|String>` | Number of linting threads, `auto` for automatic, `off` for none (default: off) |

### Pass Multiple Values

```bash
npx eslint --ext .js --ext .jsx --ext .ts src/
npx eslint --global foo --global bar src/
```

### Exit Codes

- `0` — no linting errors
- `1` — linting errors (or warnings exceeding `--max-warnings`)
- `2` — fatal error (with `--exit-on-fatal-error`)

### Common Examples

```bash
# Lint all JS files
npx eslint .

# Lint specific files
npx eslint src/index.js src/utils.js

# Lint with auto-fix
npx eslint --fix .

# Lint with specific format
npx eslint --format json .

# Lint stdin
echo "var foo = 1;" | npx eslint --stdin --stdin-filename test.js

# Print config for a file
npx eslint --print-config src/index.js

# Use custom config file
npx eslint -c custom-eslint.config.js .

# Lint with concurrency
npx eslint --concurrency auto .

# Start MCP server
npx eslint --mcp
```

## Formatters Reference

ESLint comes with several built-in formatters. Specify with `--format` or `-f`:

```bash
npx eslint --format json .
npx eslint -f html . -o report.html
```

### Built-In Formatter Options

#### stylish (default)

Human-readable format with colorized output:

```
src/index.js
  10:3  error  'foo' is not defined  no-undef
  15:7  warning  Unexpected console statement  no-console

✖ 2 problems (1 error, 1 warning)
```

#### json

Machine-readable JSON array of results:

```json
[
  {
    "filePath": "/path/to/file.js",
    "messages": [
      {
        "ruleId": "no-undef",
        "severity": 2,
        "message": "'foo' is not defined",
        "line": 10,
        "column": 3,
        "nodeType": "Identifier"
      }
    ],
    "errorCount": 1,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "..."
  }
]
```

#### json-with-metadata

JSON output with additional metadata about the ESLint run:

```json
{
  "metadata": {
    "cwd": "/path/to/project",
    "ruleOptions": { ... },
    "rulesMeta": { ... }
  },
  "results": [ ... ]
}
```

#### html

HTML report for browser viewing:

```bash
npx eslint --format html . -o eslint-report.html
```

### Third-Party Formatters

Install and use third-party formatters:

```bash
npm install --save-dev eslint-formatter-pretty
npx eslint --format pretty .
```

### Custom Formatters

```js
// formatter.js
module.exports = function (results, context) {
  // results: array of LintResult objects
  // context: { cwd, maxWarnings, fix, rulesMeta }
  return "formatted output";
};
```

```bash
npx eslint --format ./formatter.js .
```

## Integrations

### Editors

- **VS Code**: [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- **JetBrains IDEs**: WebStorm, IntelliJ IDEA, PhpStorm, PyCharm, RubyMine — built-in ESLint support
- **Vim**: [ALE](https://github.com/dense-analysis/ale), [Syntastic](https://github.com/vim-syntastic/syntastic)
- **Neovim**: [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig), [nvim-lint](https://github.com/mfussenegger/nvim-lint)
- **Emacs**: [Flycheck](http://www.flycheck.org/) with `javascript-eslint` checker
- **Sublime Text**: [SublimeLinter-eslint](https://github.com/SublimeLinter/SublimeLinter-eslint)
- **TextMate 2**: [eslint.tmbundle](https://github.com/ryanfitzer/eslint.tmbundle)
- **Visual Studio**: [Linting JavaScript in VS](https://learn.microsoft.com/en-us/visualstudio/javascript/linting-javascript)
- **Brackets**: [Brackets ESLint](https://github.com/brackets-userland/brackets-eslint)
- **Eclipse IDE**: [Tern ESLint linter](https://github.com/angelozerr/tern.java/wiki/Tern-Linter-ESLint)

### Build Tools

- Webpack: `eslint-webpack-plugin`
- Rollup: `rollup-plugin-eslint`
- Vite: `vite-plugin-eslint`
- Gulp: `gulp-eslint`
- Grunt: `grunt-eslint`

### Command Line Tools

- npm scripts: `"lint": "eslint ."`
- Husky + lint-staged: pre-commit hooks
- GitHub Actions: `eslint/github-action`

### Source Control

- GitHub Actions: ESLint check on PR
- GitLab CI: ESLint job
- pre-commit hooks via Husky

## Rule Deprecation

The ESLint team follows a deprecation policy for rules:
- Deprecated rules are replaced by newer rules or moved to external packages
- Stylistic rules were moved to [@stylistic/eslint-plugin](https://eslint.style)
- Node.js-specific rules were moved to [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
- Deprecated rules remain in ESLint but are marked in the docs

## Migrating

Migration guides for each major version:
- [Migrate to 10.x](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Migrate to 9.x](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [Migrate to 8.0.0](https://eslint.org/docs/latest/use/migrate-to-8.0.0)
- [Migrating to 7.0.0](https://eslint.org/docs/latest/use/migrating-to-7.0.0)
- [Migrating to 6.0.0](https://eslint.org/docs/latest/use/migrating-to-6.0.0)
- [Migrating to 5.0.0](https://eslint.org/docs/latest/use/migrating-to-5.0.0)
- [Migrating to 4.0.0](https://eslint.org/docs/latest/use/migrating-to-4.0.0)
- [Migrating to 3.0.0](https://eslint.org/docs/latest/use/migrating-to-3.0.0)
- [Migrating to 2.0.0](https://eslint.org/docs/latest/use/migrating-to-2.0.0)
- [Migrating to 1.0.0](https://eslint.org/docs/latest/use/migrating-to-1.0.0)

### Key Migration: v8 → v9 (Flat Config)

- `.eslintrc.*` files replaced by `eslint.config.js` (flat config)
- `--ext` flag deprecated — use `files` in config
- `env` key removed — use `languageOptions.globals`
- `plugins` array format changed to object format
- `extends` string format changed to array of strings/objects
- `ignorePatterns` replaced by `ignores` in config
- `.eslintignore` removed — use `ignores` in config

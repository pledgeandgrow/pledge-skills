# Ruff — Guides

## Editor Integration

### Language Server Protocol

Ruff's editor integration is powered by the built-in language server (`ruff server`), which implements the Language Server Protocol (LSP). The server is written in Rust and is available as part of the `ruff` CLI via `ruff server`. It is a direct replacement for `ruff-lsp` (the previous Python-based language server).

The server supports:
- Surfacing Ruff diagnostics
- Code Actions to fix violations
- Code formatting using Ruff's built-in formatter
- Import organization

The Ruff Language Server was introduced in v0.4.5 (beta) and stabilized in v0.5.3. It is designed to be used alongside another Python Language Server (e.g., Pyright, pyright, jedi-language-server) for features like navigation and autocompletion.

> **Note**: It is recommended to disable `ruff-lsp` to prevent conflicts when using `ruff server`.

### VS Code

1. Install the Ruff extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff).
2. Extension version 2024.32.0 or later is recommended for the best experience with the Ruff Language Server.

The extension automatically:
- Lints Python files on open/save
- Provides code actions for fixes
- Formats code on save (if configured)
- Organizes imports

**Settings** (`.vscode/settings.json`):
```json
{
  "ruff.lint.enable": true,
  "ruff.format.enable": true,
  "ruff.lint.select": ["E", "F", "I", "B"],
  "ruff.lint.ignore": ["E501"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.ruff": "explicit",
    "source.organizeImports.ruff": "explicit"
  }
}
```

### Neovim

#### Using `vim.lsp.config` (Neovim 0.11+)

Store in `nvim/lsp/ruff.lua` or `nvim/after/lsp/ruff.lua`:

```lua
---@type vim.lsp.Config
return {
  cmd = { 'ruff', 'server' },
  filetypes = { 'python' },
  root_markers = { 'pyproject.toml', 'ruff.toml', '.ruff.toml', '.git' },
  init_options = {
    settings = {
      -- Ruff language server settings go here
    }
  }
}
```

Enable in `init.lua`:

```lua
vim.lsp.enable('ruff')
```

#### Using `nvim-lspconfig` (Neovim 0.10 and earlier)

```lua
require('lspconfig').ruff.setup({
  init_options = {
    settings = {
      -- Ruff language server settings go here
    }
  }
})
```

#### Disabling hover in favor of Pyright

```lua
vim.api.nvim_create_autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup('lsp_attach_disable_ruff_hover', { clear = true }),
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if client == nil then return end
    if client.name == 'ruff' then
      client.server_capabilities.hoverProvider = false
    end
  end,
  desc = 'LSP: Disable hover capability from Ruff',
})
```

#### Using Ruff exclusively for linting/formatting alongside Pyright

```lua
vim.lsp.config('pyright', {
  settings = {
    pyright = {
      disableOrganizeImports = true,
    },
    python = {
      analysis = {
        ignore = { '*' },
      },
    },
  },
})
```

### Vim

Use [ALE](https://github.com/dense-analysis/ale) or [vim-lsp](https://github.com/prabirshrestha/vim-lsp):

```vim
" ALE configuration
let g:ale_linters = {'python': ['ruff']}
let g:ale_fixers = {'python': ['ruff']}
let g:ale_python_ruff_options = '--select F,E,I,B'
```

### Helix

Add to `~/.config/helix/languages.toml`:

```toml
[language-server.ruff]
command = "ruff"
args = ["server"]

[[language]]
name = "python"
language-servers = ["pyright", "ruff"]
```

### Emacs

Use `eglot` (built-in) or `lsp-mode`:

```elisp
;; eglot
(add-hook 'python-mode-hook 'eglot-ensure)

;; For lsp-mode
(add-hook 'python-mode-hook 'lsp)
(setq lsp-ruff-server-command '("ruff" "server"))
```

### PyCharm

#### Via External Tool

1. Go to **Settings → Tools → External Tools → Add**
2. Name: `Ruff Check`
3. Program: `ruff`
4. Arguments: `check --fix "$FilePath$"`
5. Working directory: `$ProjectFileDir$`

#### Via Third-Party Plugin

Install the [Ruff plugin](https://plugins.jetbrains.com/plugin/20547-ruff) from the JetBrains Marketplace.

### Sublime Text

Use [LSP](https://github.com/sublimelsp/LSP) package with Ruff:

```json
{
  "clients": {
    "ruff": {
      "command": ["ruff", "server"],
      "selector": "source.python",
      "enabled": true
    }
  }
}
```

### Zed

Add to `~/.config/zed/settings.json`:

```json
{
  "language_servers": ["pyright", "ruff"],
  "languages": {
    "Python": {
      "language_servers": ["pyright", "ruff"]
    }
  }
}
```

### Kate

Configure via **Settings → Configure Kate → Plugins → LSP Client**.

### TextMate

Use a bundle command to run `ruff check` on the current file.

### Language Server Features

The Ruff Language Server provides the following features:

- **Diagnostic Highlighting**: Real-time diagnostics for Python code in the editor.
- **Dynamic Configuration**: Automatically refreshes diagnostics when `pyproject.toml`, `ruff.toml`, or `.ruff.toml` changes in the workspace (relies on editor file-watching capabilities).
- **Formatting**: Format entire documents or specific line ranges. VS Code provides `Ruff: Format Document` and `Format Selection` commands.
- **Markdown Code Blocks** (preview): Formats Python code blocks in Markdown files. Enable with `ruff.format.preview = true` in VS Code settings.
- **Code Actions**:
  - Apply a quick fix for a diagnostic (e.g., removing an unused import)
  - Ignore a diagnostic with a `# noqa` comment
  - Apply all quick fixes in the document (`source.fixAll.ruff`)
  - Organize imports (`source.organizeImports.ruff`)
- **Fix Safety**: "Fix all" only applies safe fixes by default. Unsafe fixes can be applied via "Quick fix" individually. Enable unsafe fixes in "Fix all" with `unsafe-fixes = true` in config.
- **Hover**: Shows rule documentation when hovering over a `# noqa` rule code.
- **Jupyter Notebook**: Full support for `.ipynb` files with all capabilities available to Python files (since v0.6.0).

#### VS Code On-Save Actions

```json
{
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  }
}
```

#### VS Code Markdown Formatting (Preview)

```json
{
  "ruff.format.preview": true,
  "[markdown]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "file"
  }
}
```

### Language Server Settings

The Ruff Language Server supports the following settings, configured via editor initialization options:

#### Top-Level Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `configuration` | `string \| object` | `null` | Path to config file or inline JSON config (added v0.9.8) |
| `configurationPreference` | `"editorFirst" \| "filesystemFirst" \| "editorOnly"` | `"editorFirst"` | Strategy for resolving editor vs filesystem config |
| `exclude` | `string[]` | `null` | File patterns to exclude from linting/formatting |
| `lineLength` | `int` | `null` | Line length for linter and formatter |
| `fixAll` | `bool` | `true` | Register `source.fixAll` code action capability |
| `organizeImports` | `bool` | `true` | Register `source.organizeImports` code action capability |
| `showSyntaxErrors` | `bool` | `true` | Show syntax error diagnostics (added v0.5.0) |
| `logLevel` | `"trace" \| "debug" \| "info" \| "warn" \| "error"` | `"info"` | Server log level |
| `logFile` | `string` | `null` | Path to server log file (default: stderr) |

#### Configuration Resolution Order

In an editor, Ruff resolves configuration from three sources (highest to lowest priority):

1. **Specific settings**: Individual settings like `lineLength` or `lint.select` defined in the editor
2. **`configuration`**: Settings provided via the `configuration` field (file path or inline JSON)
3. **Configuration file**: Settings from `ruff.toml` or `pyproject.toml` in the project directory

#### `configurationPreference` Options

- **`editorFirst`** (default): Editor settings take priority over config files
- **`filesystemFirst`**: Config files take priority over editor settings
- **`editorOnly`**: Ignore config files entirely, use only editor settings

#### Inline Configuration Example

```json
{
  "ruff.configuration": {
    "lint": {
      "unfixable": ["F401"],
      "extend-select": ["TID251"],
      "flake8-tidy-imports": {
        "banned-api": {
          "typing.TypedDict": { "msg": "Use `typing_extensions.TypedDict` instead" }
        }
      }
    },
    "format": { "quote-style": "single" }
  }
}
```

#### codeAction Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `codeAction.disableRuleComment.enable` | `bool` | `true` | Show Quick Fix to disable rules via `# noqa` |
| `codeAction.fixViolation.enable` | `bool` | `true` | Show Quick Fix to autofix violations |

#### Lint Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `lint.enable` | `bool` | `true` | Enable linting (set `false` for formatter-only) |
| `lint.preview` | `bool` | `null` | Enable preview mode for linting |
| `lint.select` | `string[]` | `null` | Rules to enable |
| `lint.extendSelect` | `string[]` | `null` | Additional rules to enable |
| `lint.ignore` | `string[]` | `null` | Rules to disable |

#### Format Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `format.preview` | `bool` | `null` | Enable preview mode for formatting |
| `format.backend` | `"internal" \| "uv"` | `"internal"` | Formatting backend (`uv` requires uv >= 0.8.13) |

#### VS Code Extension-Specific Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enable` | `bool` | `true` | Enable Ruff extension (requires restart) |
| `importStrategy` | `"fromEnvironment" \| "useBundled"` | `"fromEnvironment"` | How to load ruff executable |
| `interpreter` | `string[]` | `[]` | Python interpreter paths (first one used) |
| `nativeServer` | `"on" \| "off" \| "auto" \| true \| false` | `"auto"` | Use native server or ruff-lsp |
| `path` | `string[]` | `[]` | Custom ruff executable paths (first existing used) |
| `trace.server` | `"off" \| "messages" \| "verbose"` | `"off"` | LSP trace level |

**Deprecated VS Code settings** (only used by ruff-lsp, not native server):
- `lint.args` — Use `lint.select` + `configuration` instead
- `lint.run` — Native server runs on every keystroke
- `format.args` — Use `lineLength` + `configuration` instead
- `ignoreStandardLibrary` — Not used by native server
- `showNotifications` — Not used by native server

### Migrating from ruff-lsp to ruff server

The native language server (`ruff server`) replaces the deprecated `ruff-lsp`. To migrate:

#### Unsupported Settings (not used by native server)

- `lint.run` — Native server runs on every keystroke by default
- `lint.args`, `format.args` — Replaced by granular settings (`lint.select`, `format.preview`, etc.) and the `configuration` setting

#### Removed Settings

- `ignoreStandardLibrary` — Remove from config
- `showNotifications` — Remove from config

#### New Settings (not in ruff-lsp)

- `configuration`, `configurationPreference`, `exclude`, `format.preview`, `lineLength`, `lint.select`, `lint.extendSelect`, `lint.ignore`, `lint.preview`

#### Migration Examples

**Config file path** — Before:
```json
{ "ruff.lint.args": "--config ~/.config/custom_ruff_config.toml",
  "ruff.format.args": "--config ~/.config/custom_ruff_config.toml" }
```
After:
```json
{ "ruff.configuration": "~/.config/custom_ruff_config.toml" }
```

**Lint args** — Before:
```json
{ "ruff.lint.args": "--select=E,F --unfixable=F401 --unsafe-fixes" }
```
After:
```json
{ "ruff.lint.select": ["E", "F"],
  "ruff.configuration": { "unsafe-fixes": true, "lint": { "unfixable": ["F401"] } } }
```

**Format args** — Before:
```json
{ "ruff.format.args": "--line-length 80 --config='format.quote-style=double'" }
```
After:
```json
{ "ruff.lineLength": 80,
  "ruff.configuration": { "format": { "quote-style": "double" } } }
```

Settings that can be set directly in editor: `lint.select`, `lint.extendSelect`, `lint.ignore`, `lint.preview`, `lineLength`, `format.preview`. All other options go through the `configuration` setting.

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint

on: [push, pull_request]

jobs:
  ruff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/ruff-action@v3
        with:
          args: check --output-format=github
      - uses: astral-sh/ruff-action@v3
        with:
          args: format --check
```

The `github` output format produces annotations that show up directly in GitHub PR diffs.

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.15.22
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

With Jupyter Notebook support:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.15.22
    hooks:
      - id: ruff
        args: [--fix]
        types_or: [python, pyi, jupyter]
      - id: ruff-format
        types_or: [python, pyi, jupyter]
```

With Markdown support (preview):

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.15.22
    hooks:
      - id: ruff-format
        types_or: [python, pyi, jupyter, markdown]
```

### GitLab CI

```yaml
ruff:
  image: python:3.12
  script:
    - pip install ruff
    - ruff check --output-format=gitlab
    - ruff format --check
```

The `gitlab` output format produces a Code Quality report artifact.

### Generic CI

```bash
# Lint check (exit non-zero on violations)
ruff check

# Format check (exit non-zero if files would change)
ruff format --check

# With fixes applied
ruff check --fix
ruff format
```

### tox

```ini
[testenv:lint]
skip_install = true
deps = ruff
commands =
  ruff check
  ruff format --check
```

### nox

```python
import nox

@nox.session
def lint(session):
    session.install("ruff")
    session.run("ruff", "check")
    session.run("ruff", "format", "--check")
```

---

## Migration Guides

### Migrate from Flake8

Ruff is a drop-in replacement for Flake8. To migrate:

1. **Install Ruff**: `pip install ruff` (or `uv add --dev ruff`)
2. **Convert configuration**: Move Flake8 settings to `pyproject.toml`:

```toml
# Before: .flake8 or setup.cfg
[flake8]
max-line-length = 88
extend-select = B950
ignore = E203, E501, W503
exclude = .git, __pycache__, build, dist

# After: pyproject.toml
[tool.ruff]
line-length = 88
extend-exclude = ["__pycache__", "build", "dist"]

[tool.ruff.lint]
select = ["E", "W", "F", "B"]
ignore = ["E203", "E501", "W503"]
```

3. **Map plugins to rule prefixes**:
   - `flake8-bugbear` → `B`
   - `flake8-comprehensions` → `C4`
   - `flake8-simplify` → `SIM`
   - `flake8-print` → `T20`
   - `flake8-docstrings` → `D`
   - `flake8-isort` → `I`
   - `flake8-bandit` → `S`
   - `pep8-naming` → `N`
   - `mccabe` → `C90`

4. **Replace commands**:
   - `flake8 .` → `ruff check .`
   - `flake8 --fix` → `ruff check --fix` (Ruff has built-in fix support)

5. **Remove Flake8 from dependencies**: Uninstall `flake8` and all plugins.

### Migrate from Black

Ruff's formatter is a drop-in replacement for Black:

1. **Install Ruff**: `pip install ruff`
2. **Replace command**:
   - `black .` → `ruff format .`
   - `black --check .` → `ruff format --check .`
   - `black --diff .` → `ruff format --diff .`

3. **Configuration**: Move Black settings to `pyproject.toml`:

```toml
# Before: [tool.black]
# line-length = 88
# target-version = ["py310"]

# After: [tool.ruff]
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.format]
# Black-compatible by default
quote-style = "double"
indent-style = "space"
```

4. **Remove Black**: Uninstall `black` from dependencies.

5. **Known differences**: The formatter has a few intentional deviations from Black (mainly around end-of-line comments). See [Known Deviations](https://docs.astral.sh/ruff/formatter/black/) for details.

### Migrate from isort

Ruff includes isort as the `I` rule category:

1. **Enable isort rules**:

```toml
[tool.ruff.lint]
select = ["I"]
```

2. **Convert isort settings**:

```toml
# Before: [tool.isort]
# profile = "black"
# known_first_party = ["my_package"]
# force_single_line = true

# After: [tool.ruff.lint.isort]
[tool.ruff.lint.isort]
known-first-party = ["my_package"]
# Note: force-single-line is incompatible with the formatter
```

3. **Organize imports**:

```bash
ruff check --select I --fix
```

### Migrate from pyupgrade

Ruff includes most pyupgrade rules as the `UP` category:

```toml
[tool.ruff.lint]
select = ["UP"]
```

```bash
ruff check --select UP --fix
```

### Migrate from ruff-lsp to ruff server

If you were using the old `ruff-lsp` language server:

1. Update to Ruff v0.5.3 or later.
2. Uninstall `ruff-lsp`: `pip uninstall ruff-lsp`
3. Remove `ruff-lsp` from editor LSP configuration.
4. Configure editor to use `ruff server` instead (see editor setup above).
5. Review changed settings — see the [migration guide](https://docs.astral.sh/ruff/editors/migration/).

---

## Best Practices

### Recommended Rule Sets

#### Minimal (Beginner)

```toml
[tool.ruff.lint]
select = ["E4", "E7", "E9", "F"]
```

#### Standard (Recommended)

```toml
[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # Pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "UP",  # pyupgrade
]
ignore = ["E501"]  # Line length handled by formatter
```

#### Strict

```toml
[tool.ruff.lint]
select = [
    "E", "W",  # pycodestyle
    "F",       # Pyflakes
    "I",       # isort
    "B",       # flake8-bugbear
    "C4",      # flake8-comprehensions
    "SIM",     # flake8-simplify
    "N",       # pep8-naming
    "UP",      # pyupgrade
    "S",       # flake8-bandit (security)
    "D",       # pydocstyle
    "PT",      # flake8-pytest-style
    "PTH",     # flake8-use-pathlib
    "RUF",     # Ruff-specific
    "C90",     # mccabe complexity
]
ignore = ["E501", "D100", "D104"]
```

### Using Ruff with a Formatter

When using `ruff format` (or Black), avoid enabling lint rules that conflict with the formatter. The formatter handles:
- Indentation style and width
- Quote style
- Trailing commas
- Line wrapping (best-effort)
- Blank lines

Recommended: Disable `Q` (flake8-quotes), `COM` (flake8-commas), and indentation-related `E`/`W` rules when using the formatter.

### Using `noqa` Effectively

```python
# Specific rule suppression
import os  # noqa: F401

# Multiple rules
x = 1  # noqa: E501, F841

# All rules (use sparingly)
# noqa

# File-level suppression (first line of file)
# ruff: noqa: F401
```

Use `ruff check --add-noqa` to automatically add `# noqa` comments to all failing lines.

### Unsafe Fixes

Some fixes may not retain the original intent of the code. Ruff classifies these as "unsafe":

```bash
# Apply only safe fixes (default)
ruff check --fix

# Apply safe and unsafe fixes
ruff check --fix --unsafe-fixes

# See what unsafe fixes would do without applying
ruff check --fix --unsafe-fixes --diff
```

### Cache Management

```bash
# Default cache location: .ruff_cache/
# Custom cache directory
ruff check --cache-dir ~/.cache/ruff

# Disable cache
ruff check --no-cache

# Clear all caches
ruff clean

# Environment variable
export RUFF_CACHE_DIR=~/.cache/ruff
```

### Performance Tips

- **Use caching**: Enabled by default, stores results in `.ruff_cache/`.
- **Avoid `--select ALL` in CI**: Selecting all rules can be slow and noisy. Use a curated set.
- **Use `--fix-only` for auto-fix pipelines**: Skips reporting on leftover violations.
- **Run formatter and linter together**: `ruff check --fix && ruff format` is fast and comprehensive.
- **Use `--silent` in CI**: Reduces output while still exiting non-zero on violations.

### Project Configuration Patterns

#### Monorepo with Shared Config

```toml
# Root: pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py311"
src = ["packages/*/src"]

[tool.ruff.lint]
select = ["E", "W", "F", "I", "B", "UP"]

# Package: packages/myapp/pyproject.toml
[tool.ruff]
extend = "../../pyproject.toml"
src = ["src"]
```

#### Library with Strict Docstrings

```toml
[tool.ruff.lint]
select = ["D", "E", "W", "F", "I"]
[tool.ruff.lint.pydocstyle]
convention = "google"
```

#### Test-Specific Configuration

```toml
[tool.ruff.lint.per-file-ignores]
"tests/**" = [
    "S101",    # assert is fine in tests
    "PLR2004", # magic values in tests
    "D",       # docstrings not required in tests
]
```

### Jupyter Notebook Best Practices

```toml
# Enable notebook linting (default since v0.6.0)
[tool.ruff]
# .ipynb files are included by default

# Ignore specific rules in notebooks
[tool.ruff.lint.per-file-ignores]
"*.ipynb" = ["T20"]  # Allow print statements in notebooks

# Exclude notebooks from formatting only
[tool.ruff.format]
exclude = ["*.ipynb"]

# Or exclude notebooks from linting only
[tool.ruff.lint]
exclude = ["*.ipynb"]

# Or completely disable notebook support
[tool.ruff]
extend-exclude = ["*.ipynb"]
```

Some rules behave differently in Jupyter Notebooks. For example, `E402` (module-import-not-at-top-of-file) checks imports at the top of each cell rather than the top of the file.

### Preview Mode Best Practices

```toml
# Enable preview for lint only
[tool.ruff.lint]
preview = true

# Enable preview for format only
[tool.ruff.format]
preview = true

# Enable preview globally
[tool.ruff]
preview = true
```

Preview mode includes:
- Unstable rules (marked 🧪 in the rules reference)
- Unstable formatting styles
- Expanded default rule set (B, UP, RUF in addition to defaults)

Preview rules can change or be removed between versions. Use `explicit-preview-rules = true` to opt into individual preview rules rather than enabling all of them.

---

## FAQ

### Is the Ruff linter compatible with Black?

Yes. The Ruff linter is compatible with Black out-of-the-box, as long as the `line-length` setting is consistent. Ruff defers implementing stylistic rules that are obviated by automated formatting.

Note: Ruff's linter will flag `E501` (line-too-long) for any line exceeding `line-length`, while Black and `ruff format` make best-effort attempts and may not wrap some lines (e.g., comments).

### How does Ruff's formatter compare to Black?

The Ruff formatter is designed as a drop-in replacement for Black. When run over Black-formatted projects like Django and Zulip, >99.9% of lines are formatted identically. Minor differences exist mainly around end-of-line comments.

### Do I have to use Ruff's linter and formatter together?

No. Ruff's linter and formatter can be used independently. You can use Ruff as a formatter but not a linter, or vice versa.

### What versions of Python does Ruff support?

Ruff can lint code for Python 3.7 through 3.14. Ruff does not support Python 2. Ruff is installable under any Python version from 3.7 onwards.

### Do I need to install Rust to use Ruff?

No. Ruff is available as `ruff` on PyPI with pre-built wheels for all major platforms. Install with `uv`, `pip`, `pipx`, or standalone installers.

### Can I write my own linter plugins for Ruff?

Not yet. A plugin system is within-scope for the project (see [GitHub issue #283](https://github.com/astral-sh/ruff/issues/283)).

### How does Ruff's import sorting compare to isort?

Ruff's import sorting is intended to be near-equivalent to isort's when using `profile = "black"`. There are minor differences in how aliased imports and inline comments are handled. Ruff also correctly classifies some standard-library modules that isort doesn't (e.g., `_string`, `idlelib`).

### How does Ruff determine first-party vs third-party imports?

Ruff uses the `src` setting to determine first-party imports. It iterates over `src` directories looking for matching Python modules. If `src` is omitted, Ruff defaults to the project root plus a `src` subdirectory.

### Does Ruff support Jupyter Notebooks?

Yes. Since v0.6.0, Ruff lints and formats `.ipynb` files by default.

### Does Ruff support NumPy- or Google-style docstrings?

Yes. Use the `pydocstyle.convention` setting:

```toml
[tool.ruff.lint.pydocstyle]
convention = "google"  # or "numpy" or "pep257"
```

### What is "preview"?

Preview mode enables unstable rules and formatting styles. Enable with `--preview` on the CLI or `preview = true` in config. Preview features may change between versions.

### How can I tell what settings Ruff is using?

```bash
ruff check --show-settings
```

### I don't want to use pyproject.toml. What are my options?

Use `ruff.toml` or `.ruff.toml` instead. These don't require the `[tool.ruff]` prefix.

### Ruff tried to fix something but it broke my code. What's going on?

Some fixes are classified as "unsafe" because they may not retain the original intent. Use `--fix` (safe fixes only) without `--unsafe-fixes`. Review unsafe fixes with `--diff` before applying.

### How can I disable/force Ruff's color output?

```bash
ruff check --color never    # Disable colors
ruff check --color always   # Force colors
ruff check --color auto     # Auto-detect (default)
```

---

## Sources

- [Ruff Documentation Home](https://docs.astral.sh/ruff/)
- [Installation Guide](https://docs.astral.sh/ruff/installation/)
- [Configuration Guide](https://docs.astral.sh/ruff/configuration/)
- [The Ruff Linter](https://docs.astral.sh/ruff/linter/)
- [Rules Reference](https://docs.astral.sh/ruff/rules/)
- [Settings Reference](https://docs.astral.sh/ruff/settings/)
- [Formatter Guide](https://docs.astral.sh/ruff/formatter/)
- [Known Deviations from Black](https://docs.astral.sh/ruff/formatter/black/)
- [Editor Integration](https://docs.astral.sh/ruff/editors/)
- [Editor Setup](https://docs.astral.sh/ruff/editors/setup/)
- [Editor Settings](https://docs.astral.sh/ruff/editors/settings/)
- [Editor Features](https://docs.astral.sh/ruff/editors/features/)
- [ruff-lsp Migration Guide](https://docs.astral.sh/ruff/editors/migration/)
- [Preview Mode](https://docs.astral.sh/ruff/preview/)
- [FAQ](https://docs.astral.sh/ruff/faq/)
- [ruff-pre-commit](https://github.com/astral-sh/ruff-pre-commit)
- [ruff-vscode](https://github.com/astral-sh/ruff-vscode)

# ty Guides

## Editor Integration

### VS Code

Install the [ty extension](https://marketplace.visualstudio.com/items?itemName=astral-sh.ty) from the VS Code Marketplace.

The extension automatically disables the Python extension's language server by setting `python.languageServer` to `"None"`.

To use ty only for type checking and another LS for other features:
```json
{
  "python.languageServer": "Pylance",
  "ty.disableLanguageServices": true
}
```

### Neovim

Using `nvim-lspconfig` (Neovim >=0.11):
```lua
-- Optional: Only required if you need to update the language server settings
vim.lsp.config('ty', {
  settings = {
    ty = {
      -- ty language server settings go here
    }
  }
})
-- Required: Enable the language server
vim.lsp.enable('ty')
```

Neovim <0.11:
```lua
require('lspconfig').ty.setup({
  settings = {
    ty = {
      -- ty language server settings go here
    }
  }
})
```

### Zed

ty is included with Zed out of the box. Enable it and disable basedpyright:
```json
{
  "languages": {
    "Python": {
      "language_servers": ["ty", "ruff"]
    }
  }
}
```

Override the ty executable:
```json
{
  "lsp": {
    "ty": {
      "binary": {
        "path": "/home/user/.local/bin/ty",
        "arguments": ["server"]
      }
    }
  }
}
```

### PyCharm

Starting with version 2025.3:
1. Go to **Python | Tools | ty** in Settings
2. Select **Enable**
3. Choose execution mode: **Interpreter mode** (searches interpreter) or **Path mode** (searches `$PATH`)
4. Select which options should be enabled

### Emacs

Using built-in Eglot (Emacs 29+):
```elisp
(with-eval-after-load 'eglot
  (add-to-list 'eglot-server-programs
    '((python-base-mode :language-id "python") . ("ty" "server"))))
(add-hook 'python-base-mode-hook 'eglot-ensure)
```

For Flycheck integration, use [flycheck-eglot](https://github.com/flycheck/flycheck-eglot).

### Other Editors

ty supports any LSP-compatible editor:
```bash
ty server
```

Refer to your editor's documentation for connecting to an LSP server.

---

## Editor Settings Reference

### General Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `configuration` | `object` | `null` | Inline ty configuration overrides (takes precedence over config files) |
| `configurationFile` | `string` | `null` | Path to a `ty.toml` configuration file |
| `disableLanguageServices` | `boolean` | `false` | Disable language services (completions, hover, go-to-definition, etc.) |
| `diagnosticMode` | `"off" \| "workspace" \| "openFilesOnly"` | `"openFilesOnly"` | Scope of diagnostics |
| `showSyntaxErrors` | `bool` | `true` | Whether to show syntax error diagnostics |

### Inlay Hints (`inlayHints`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `variableTypes` | `boolean` | `true` | Show variable types as inline hints |
| `callArgumentNames` | `boolean` | `true` | Show argument names in call expressions |

### Completions (`completions`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `autoImport` | `boolean` | `true` | Include auto-import suggestions in completions |
| `completeFunctionParentheses` | `boolean` | `false` | Insert parentheses and place cursor inside on function completion |

### VS Code Specific

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `importStrategy` | `"fromEnvironment" \| "useBundled"` | `"fromEnvironment"` | Strategy for loading ty executable |
| `interpreter` | `string[]` | `[]` | Paths to Python interpreters (first one used) |
| `path` | `string[]` | `[]` | Paths to ty executables (first existing used, takes precedence over `importStrategy`) |
| `trace.server` | `"off" \| "messages" \| "verbose"` | `"off"` | LSP message logging detail |

### Initialization Options (static, require editor restart)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `logFile` | `string` | `null` | Path to log file (default: stderr) |
| `logLevel` | `"trace" \| "debug" \| "info" \| "warn" \| "error"` | `"info"` | Log level for language server |

**Neovim initialization options example:**
```lua
-- Neovim >=0.11
vim.lsp.config('ty', {
  init_options = {
    logFile = '/path/to/ty.log',
    logLevel = 'debug',
  },
})
-- Neovim <0.11
require('lspconfig').ty.setup({
  init_options = {
    logFile = '/path/to/ty.log',
    logLevel = 'debug',
  },
})
```

**Zed initialization options:**
```json
{
  "lsp": {
    "ty": {
      "initialization_options": {
        "logFile": "/path/to/ty.log",
        "logLevel": "debug"
      }
    }
  }
}
```

---

## Language Server Features

### Diagnostics
- Type errors and other diagnostics updated as you type
- Supports both "pull" and "push" diagnostic models
- `diagnosticMode` setting controls scope: `openFilesOnly` (default) or `workspace`

### Code Navigation
- **Go to Definition**: Jump to where a symbol is defined
- **Go to Declaration**: Navigate to declaration site (may differ from definition, e.g., stub files)
- **Go to Type Definition**: Navigate to the type of a symbol
- **Find All References**: Find every usage across the workspace
- **Document and Workspace Symbols**: Outline of symbols in current file or search across workspace

### Code Completions
- Intelligent completions for variables, functions, classes, and modules in scope
- Auto-import suggestions for symbols not yet imported

### Code Actions and Refactorings
- Add import: Automatically add missing import statements
- Quick fixes: Some diagnostics come with quick fix suggestions
- Rename symbol: Safely rename symbols across the entire codebase
- Selection range: Expand/shrink selection based on Python syntax

### Contextual Information
- **Hover**: Type, documentation, function signatures, variance of type parameters
- **Inlay hints**: Inline type hints for variables/parameters; click to insert annotations; click parts for go-to-definition
- **Signature help**: Function parameters and types when calling functions
- **Document highlight**: Highlights all occurrences of a symbol
- **Semantic highlighting**: Syntax highlighting based on semantics and types

### Code Folding
- Python-specific code folding ranges
- Tags docstrings as comments for "fold all comment blocks"

### Notebook Support
- Jupyter notebooks (`.ipynb`) with language server features
- Each cell analyzed in context; diagnostics, completions, and features work across cells

### Fine-grained Incrementality
- Updates only affected parts of the codebase on changes
- Down to individual definitions level
- Millisecond-latency updates, even on large projects
- Skips irrelevant 3rd-party dependency analysis

### LSP Feature Reference

ty implements these LSP methods:
- `callHierarchy/*`
- `notebookDocument/*`
- `textDocument/codeAction`
- `textDocument/codeLens`
- `textDocument/completion`
- `textDocument/declaration`
- `textDocument/definition`
- `textDocument/diagnostic`
- `textDocument/documentColor`
- `textDocument/documentHighlight`
- `textDocument/documentLink`
- `textDocument/documentSymbol`
- `textDocument/foldingRange`
- `textDocument/formatting` (via Ruff)
- `textDocument/hover`
- `textDocument/implementation`
- `textDocument/inlayHint`
- `textDocument/onTypeFormatting` (via Ruff)
- `textDocument/prepareRename`
- `textDocument/rangeFormatting` (via Ruff)
- `textDocument/references`
- `textDocument/rename`
- `textDocument/selectionRange`
- `textDocument/semanticTokens`
- `textDocument/signatureHelp`
- `textDocument/typeDefinition`
- `typeHierarchy/*`
- `workspace/diagnostic`
- `workspace/symbol`
- `workspace/willRenameFiles`

### LSP Extensions

**Full diagnostic output:**
- Experimental client capability: `{ "fullDiagnosticOutput": boolean }`
- When true, includes a human-readable multiline rendering with ANSI SGR styles in the diagnostic's `data` field
- Also includes `diagnostic_id` (e.g., `invalid-argument-type`)

---

## Migration from mypy or pyright

### Suppression comment mapping

| Tool | Inline suppression | Config-level disable |
|------|-------------------|---------------------|
| mypy | `# type: ignore[code]` | `disable_error_code = [...]` |
| pyright | `# pyright: ignore[reportXyz]` | `reportXyz = "none"` |
| ty | `# ty: ignore[rule]` | `<rule> = "ignore"` in `[tool.ty.rules]` |

### Severity mapping

| Tool | Severities |
|------|-----------|
| ty | `ignore`, `warn`, `error` |
| pyright | `"none"` → `ignore`, `"information"`/`"hint"` → `warn`, `"error"` → `error` |
| mypy | disabled → `ignore`, note/warning → `warn`, error → `error` |

### Key differences

- ty checks bodies of unannotated functions unconditionally (no equivalent of mypy's `check_untyped_defs`)
- ty is stricter by default than mypy or pyright in many ways
- ty does not have `--check-untyped-defs` or `strictListInference` flags (these are default behavior)
- Nearly all ty rules are enabled by default

### Recommended strict configuration

```toml
[tool.ty.rules]
missing-type-argument = "error"
possibly-unresolved-reference = "warn"

[tool.ruff.lint]
extend-select = ["ANN", "PYI"]
preview = true
```

This configuration:
- Ensures ty exits non-zero on warning-level diagnostics
- Enables `missing-type-argument` and `possibly-unresolved-reference` rules
- Extends Ruff with ANN and PYI rule categories for type annotation enforcement
- Enables Ruff preview mode so PYI033 also checks `.py` files

### mypy/pyright to ty/Ruff rule mapping

A detailed rule mapping table is available in the [official migration guide](https://docs.astral.sh/ty/coming-from-mypy-or-pyright/). Some mypy/pyright checks are not yet implemented in ty and may be covered by Ruff rules instead.

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install ty
  run: uv tool install ty@latest

- name: Type check
  run: ty check --output-format github
```

### GitLab CI

```yaml
type-check:
  script:
    - uv tool install ty@latest
    - ty check --output-format gitlab
```

### pre-commit

```yaml
repos:
  - repo: https://github.com/astral-sh/ty-pre-commit
    rev: v0.0.61
    hooks:
      - id: ty
```

---

## Best Practices

- **Add ty as a dev dependency**: `uv add --dev ty` ensures all developers use the same version
- **Use `ty.toml` for standalone config**: Avoids conflicts with `pyproject.toml` tool sections
- **Set `python-version` explicitly**: Ensures consistent type checking across environments
- **Use per-file overrides**: Relax rules in test files without affecting production code
- **Prefer `ty: ignore[rule]` over blanket `type: ignore`**: Avoids accidentally suppressing other errors
- **Enable `unused-ignore-comment`**: Catches stale suppression comments
- **Use `--watch` during development**: Fine-grained incrementality provides instant feedback
- **Pair with Ruff**: Use Ruff's ANN rules for missing type annotation enforcement (ty does not report unannotated symbols)

---

## Sources

- [Editor integration](https://docs.astral.sh/ty/editors/)
- [Editor settings](https://docs.astral.sh/ty/reference/editor-settings/)
- [Language server](https://docs.astral.sh/ty/features/language-server/)
- [Coming from mypy or pyright](https://docs.astral.sh/ty/coming-from-mypy-or-pyright/)
- [Suppression](https://docs.astral.sh/ty/suppression/)
- [Type system](https://docs.astral.sh/ty/features/type-system/)
- [Diagnostics](https://docs.astral.sh/ty/features/diagnostics/)

# ty — Python Type Checker and Language Server

## Overview

**ty** is an extremely fast Python type checker and language server written in Rust, developed by Astral (the creators of uv and Ruff). It provides 10x–100x faster type checking than mypy and Pyright, with comprehensive diagnostics, configurable rule levels, per-file overrides, suppression comments, and first-class project support.

## Key Features

- **Speed**: 10x–100x faster than mypy and Pyright
- **Comprehensive diagnostics** with rich contextual information
- **Configurable rule levels** (error, warn, ignore) with per-file overrides
- **Suppression comments**: `# ty: ignore[rule]`, `# type: ignore`, `# type: ignore[ty:rule]`
- **Designed for adoption**: supports redeclarations and partially typed code
- **Language server** with code navigation, completions, code actions, auto-import, inlay hints, hover, signature help, semantic highlighting, code folding, notebook support
- **Fine-grained incremental analysis** for fast IDE updates (milliseconds, even on large projects)
- **Editor integrations**: VS Code, Neovim, Zed, PyCharm, Emacs, and any LSP-compatible editor
- **Advanced typing features**: first-class intersection types, advanced type narrowing, sophisticated reachability analysis
- **Jupyter Notebook support** (.ipynb files)
- **Online playground** at [play.ty.dev](https://play.ty.dev)

## Quick Reference

| Command | Description |
|---------|-------------|
| `ty check` | Type-check a project |
| `ty check --watch` | Watch mode (incremental rechecking) |
| `ty check --fix` | Apply fixes to resolve errors |
| `ty server` | Start the language server |
| `ty version` | Display version |
| `ty explain rule [RULE]` | Explain a rule (or all rules) |
| `ty generate-shell-completion <SHELL>` | Generate shell completions |

## Configuration

ty supports configuration via `pyproject.toml` (`[tool.ty]` table) or `ty.toml` files. Configuration is discovered hierarchically from the current directory upward. User-level config is at `~/.config/ty/ty.toml` (Linux/macOS) or `%APPDATA%\ty\ty.toml` (Windows).

```toml
# pyproject.toml
[tool.ty.rules]
possibly-unresolved-reference = "warn"
division-by-zero = "ignore"

[tool.ty.environment]
python-version = "3.12"
python-platform = "linux"
```

```toml
# ty.toml (omits [tool.ty] prefix)
[rules]
possibly-unresolved-reference = "warn"

[environment]
python-version = "3.12"
```

## Rule Levels

- **error**: Violations reported as errors; ty exits with code 1
- **warn**: Violations reported as warnings; exit code depends on `error-on-warning` setting
- **ignore**: Rule is turned off

Configure via CLI (`--error`, `--warn`, `--ignore`) or configuration file (`[tool.ty.rules]`).

## Python Version Support

ty officially supports type checking code targeting Python 3.10+. Python 3.7–3.9 can be selected but may produce false positives/negatives. Default target version is `3.14`.

## Sources

- [Introduction](https://docs.astral.sh/ty/)
- [Installation](https://docs.astral.sh/ty/installation/)
- [Type checking](https://docs.astral.sh/ty/type-checking/)
- [Editor integration](https://docs.astral.sh/ty/editors/)
- [Configuration](https://docs.astral.sh/ty/configuration/)
- [Configuration reference](https://docs.astral.sh/ty/reference/configuration/)
- [Rules](https://docs.astral.sh/ty/rules/)
- [Rules reference](https://docs.astral.sh/ty/reference/rules/)
- [Suppression](https://docs.astral.sh/ty/suppression/)
- [Type system](https://docs.astral.sh/ty/features/type-system/)
- [Diagnostics](https://docs.astral.sh/ty/features/diagnostics/)
- [Language server](https://docs.astral.sh/ty/features/language-server/)
- [CLI reference](https://docs.astral.sh/ty/reference/cli/)
- [Exit codes](https://docs.astral.sh/ty/reference/exit-codes/)
- [Environment variables](https://docs.astral.sh/ty/reference/environment/)
- [Editor settings](https://docs.astral.sh/ty/reference/editor-settings/)
- [Typing FAQ](https://docs.astral.sh/ty/reference/typing-faq/)
- [Coming from mypy or pyright](https://docs.astral.sh/ty/coming-from-mypy-or-pyright/)

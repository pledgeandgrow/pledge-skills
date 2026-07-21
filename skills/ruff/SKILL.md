# Ruff — Extremely Fast Python Linter & Formatter

## Overview

Ruff is an extremely fast Python linter and code formatter written in Rust. It is designed as a drop-in replacement for Flake8, isort, Black, and many Flake8 plugins — all reimplemented in Rust as first-party features. Ruff supports Python 3.7 through 3.14, ships with 900+ built-in rules, includes an automatic fix mode, built-in caching, Jupyter Notebook support, and a built-in language server for editor integration.

## Key Features

- **Speed**: 10–100x faster than Flake8 and comparable linters, written in Rust.
- **Unified toolchain**: Linter, formatter, import sorter, and language server in a single binary.
- **900+ rules**: Re-implementations of popular Flake8 plugins (flake8-bugbear, flake8-comprehensions, flake8-simplify, pydocstyle, isort, pyupgrade, and many more).
- **Formatter**: Drop-in replacement for Black with configurable quote style, indent style, line endings, and docstring code formatting.
- **Automatic fixes**: Many rules are auto-fixable via `--fix`; unsafe fixes available via `--unsafe-fixes`.
- **Configuration**: Supports `pyproject.toml`, `ruff.toml`, and `.ruff.toml` with hierarchical discovery and config inheritance via `extend`.
- **Jupyter Notebooks**: Built-in linting and formatting of `.ipynb` files (v0.6.0+).
- **Editor integrations**: Built-in language server (`ruff server`), VS Code extension, Neovim, Vim, Helix, Emacs, PyCharm, Sublime Text, Zed, and more.
- **Preview mode**: Opt-in to unstable rules and formatting styles before they become stable.
- **Shell autocompletion**: bash, zsh, fish, elvish, powershell, fig.
- **No Rust required**: Ships as a standalone binary; installable via `uv`, `pip`, `pipx`, or standalone installers.

## Skill File Structure

| File | Contents |
|------|----------|
| `SKILL.md` | This file — overview, quick reference, feature summary |
| `getting-started.md` | Installation, first run, basic configuration, project setup |
| `api.md` | Full reference: CLI commands, configuration options, rules by category, linters, settings |
| `guides.md` | Editor setup, CI/CD integration, migration from Flake8/Black/isort, best practices, FAQ |

## Quick Reference

### Install

```bash
# With uv (recommended)
uv tool install ruff@latest
# Or add to project
uv add --dev ruff
# With pip
pip install ruff
# With pipx
pipx install ruff
# Standalone installer (macOS/Linux)
curl -LsSf https://astral.sh/ruff/install.sh | sh
# Standalone installer (Windows)
powershell -c "irm https://astral.sh/ruff/install.ps1 | iex"
```

### Lint

```bash
ruff check                    # Lint all files in current directory
ruff check path/to/code/      # Lint a specific directory
ruff check --fix              # Lint and auto-fix violations
ruff check --select F401,F403 # Lint with specific rules
ruff check --select ALL       # Enable all rules
ruff check --statistics       # Show violation counts per rule
```

### Format

```bash
ruff format                   # Format all files in current directory
ruff format path/to/code/     # Format a specific directory
ruff format --check           # Check formatting without writing (CI mode)
ruff format --diff            # Show diff of what would change
```

### Minimal Configuration (`pyproject.toml`)

```toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = ["E4", "E7", "E9", "F"]
ignore = []

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

### Rule Selection

```toml
[tool.ruff.lint]
# Enable specific rule sets
select = ["E4", "E7", "E9", "F", "B", "I", "UP"]
# Ignore specific rules
ignore = ["E501"]
# Per-file ignores
[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["E402"]
"**/{tests,docs,tools}/*" = ["E402"]
```

### Inline Suppression

```python
import os  # noqa: F401  # Ignore unused import on this line
# noqa: E501  # Ignore all rules on this line
# ruff: noqa: E501  # Ruff-specific noqa syntax
```

### Format Suppression

```python
# fmt: off
not_formatted = 3
also_not_formatted = 4
# fmt: on

x = [1, 2, 3]  # fmt: skip  # Skip formatting for this statement
```

## Tool Replacement

Ruff can replace the following tools:

- **Flake8** (with 40+ plugins including flake8-bugbear, flake8-comprehensions, flake8-simplify, flake8-pytest-style, flake8-quotes, flake8-tidy-imports, flake8-type-checking, and more)
- **isort** (import sorting)
- **Black** (formatting)
- **pyupgrade** (most rules)
- **yesqa**, **eradicate**, **mccabe**, **pep8-naming**, **pydocstyle**, **pandas-vet**, **tryceratops**, **perflint**, **flynt**

## Python Version Support

Ruff can lint code for any Python version from 3.7 onwards, including Python 3.14. Ruff does not support Python 2. Ruff is installable under any Python version from 3.7 onwards.

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
- [ruff-lsp Migration](https://docs.astral.sh/ruff/editors/migration/)
- [Preview Mode](https://docs.astral.sh/ruff/preview/)
- [FAQ](https://docs.astral.sh/ruff/faq/)

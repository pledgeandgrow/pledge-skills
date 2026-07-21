# Ruff — Getting Started

## Installation

### With uv (Recommended)

```bash
# Install Ruff globally
uv tool install ruff@latest

# Or add Ruff to your project
uv add --dev ruff
```

### With pip

```bash
pip install ruff
```

### With pipx

```bash
pipx install ruff
```

### Standalone Installers

```bash
# macOS and Linux
curl -LsSf https://astral.sh/ruff/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/ruff/install.ps1 | iex"

# Specific version
curl -LsSf https://astral.sh/ruff/0.5.0/install.sh | sh
powershell -c "irm https://astral.sh/ruff/0.5.0/install.ps1 | iex"
```

Ruff ships with wheels for all major platforms, so `uv`, `pip`, and other tools can install Ruff without a Rust toolchain.

### Run Without Installing (uvx)

```bash
uvx ruff check    # Lint all files in the current directory
uvx ruff format   # Format all files in the current directory
```

### Homebrew (macOS/Linux)

```bash
brew install ruff
```

### Conda (conda-forge)

```bash
conda install -c conda-forge ruff
```

### pkgx

```bash
pkgx install ruff
```

### Arch Linux

```bash
pacman -S ruff
```

### Alpine Linux

```bash
apk add ruff
```

### openSUSE Tumbleweed

```bash
sudo zypper install python3-ruff
```

### Docker

```bash
docker run -v .:/io --rm ghcr.io/astral-sh/ruff check
docker run -v .:/io --rm ghcr.io/astral-sh/ruff:0.3.0 check
# Podman on SELinux:
docker run -v .:/io:Z --rm ghcr.io/astral-sh/ruff check
```

### Verify Installation

```bash
ruff version
ruff --help
```

## First Run

### Linting

```bash
# Lint all Python files in the current directory
ruff check

# Lint a specific path
ruff check path/to/code/

# Lint a single file
ruff check path/to/file.py

# Lint and automatically fix violations
ruff check --fix

# Lint with verbose output
ruff check --verbose

# Lint with specific rules
ruff check --select F401 --select F403

# Show statistics (violation counts per rule)
ruff check --statistics
```

### Formatting

```bash
# Format all Python files in the current directory
ruff format

# Format a specific path
ruff format path/to/code/

# Format a single file
ruff format path/to/file.py

# Check formatting without writing (useful for CI)
ruff format --check

# Show a diff of what would change
ruff format --diff
```

## Configuration Basics

### Config File Discovery

Ruff discovers configuration files in the following order of priority:

1. `.ruff.toml`
2. `ruff.toml`
3. `pyproject.toml` (under `[tool.ruff]`)

Ruff searches up the directory tree from the file being checked, using the closest configuration file found. This enables hierarchical configuration — different directories can have different settings.

### Minimal `pyproject.toml`

```toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = ["E4", "E7", "E9", "F"]

[tool.ruff.format]
quote-style = "double"
```

### Minimal `ruff.toml`

```toml
line-length = 88
target-version = "py310"

[lint]
select = ["E4", "E7", "E9", "F"]

[format]
quote-style = "double"
```

### Default Settings

Ruff ships with sensible defaults:

- **Default excluded directories**: `.bzr`, `.direnv`, `.eggs`, `.git`, `.git-rewrite`, `.hg`, `.mypy_cache`, `.nox`, `.pants.d`, `.pytype`, `.ruff_cache`, `.svn`, `.tox`, `.venv`, `__pypackages__`, `_build`, `buck-out`, `dist`, `node_modules`, `venv`
- **Default included files**: `*.py`, `*.pyi`, `*.ipynb`, `pyproject.toml` (and `*.pyw` in preview mode)
- **Default line length**: 88
- **Default indent width**: 4
- **Default target version**: `py310` (inferred from `requires-python` if not specified)
- **Default lint rules**: `E4`, `E7`, `E9`, `F` (Pyflakes + subset of pycodestyle)
- **Default quote style**: `double`
- **Default indent style**: `space`
- **Default line ending**: `auto`
- **Respects `.gitignore`**: Yes (via `respect-gitignore` setting)

### Python Version Inference

When no `target-version` is specified, Ruff attempts to infer it from the `requires-python` field in a nearby `pyproject.toml`:

1. If a config file is passed directly via `--config`, no inference is attempted.
2. If a config file is found in the filesystem hierarchy, Ruff infers from `requires-python` in the same directory's `pyproject.toml`.
3. If using a user-level config (`${config_dir}/ruff/pyproject.toml`), the first `pyproject.toml` in an ancestor of the working directory takes precedence.
4. If no config files are found, Ruff infers from the first `pyproject.toml` in an ancestor of the working directory.

## Project Setup Example

### Project Structure

```
my_project
├── pyproject.toml
├── src
│   └── my_package
│       ├── __init__.py
│       └── core.py
└── tests
    └── test_core.py
```

### Recommended `pyproject.toml`

```toml
[project]
name = "my_project"
version = "0.1.0"
requires-python = ">=3.10"

[tool.ruff]
line-length = 88
target-version = "py310"
src = ["src"]

[tool.ruff.lint]
select = [
    "E4", "E7", "E9", "F",  # Defaults
    "B",   # flake8-bugbear
    "I",   # isort
    "UP",  # pyupgrade
]
ignore = ["E501"]  # line too long (handled by formatter)

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["E402"]  # module import not at top of file
"**/{tests,docs,tools}/*" = ["E402"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
docstring-code-format = false
```

### First-Party Import Detection

Ruff uses the `src` setting to determine which imports are first-party. For a project with `src/my_package/`, set:

```toml
[tool.ruff]
src = ["src"]
```

When Ruff sees `import my_package`, it checks the `src` directories for a matching module. If `src` is omitted, Ruff defaults to the project root plus a `src` subdirectory.

### Config Inheritance

A child config can extend a parent config using the `extend` field:

```toml
# tests/pyproject.toml
[tool.ruff]
extend = "../pyproject.toml"
src = ["../src"]
```

Rule selection merging behavior:
- If the child specifies `lint.select`, it establishes a new baseline and the parent's `lint.ignore` is discarded.
- If the child omits `lint.select`, the parent's rule selection is inherited and both parent and child `lint.ignore` rules are accumulated.

## Running Ruff in Watch Mode

```bash
# Re-run linting whenever files change
ruff check --watch
```

## Output Formats

Ruff supports multiple output formats for linting:

```bash
ruff check --output-format json
ruff check --output-format junit
ruff check --output-format github
ruff check --output-format gitlab
ruff check --output-format sarif
ruff check --output-format concise
ruff check --output-format grouped
ruff check --output-format pylint
ruff check --output-format azure
ruff check --output-format rdjson
ruff check --output-format json-lines
```

## Shell Autocompletion

```bash
# bash
echo 'eval "$(ruff generate-shell-completion bash)"' >> ~/.bashrc

# zsh
echo 'eval "$(ruff generate-shell-completion zsh)"' >> ~/.zshrc

# fish
echo 'ruff generate-shell-completion fish | source' > ~/.config/fish/completions/ruff.fish

# powershell
Add-Content -Path $PROFILE -Value '(& ruff generate-shell-completion powershell) | Out-String | Invoke-Expression'

# elvish
echo 'eval (ruff generate-shell-completion elvish | slurp)' >> ~/.elvish/rc.elv
```

## Argfile Support

Ruff supports reading command-line arguments from a file, useful for large file lists:

```bash
ruff check @path/to/args.txt
```

Where `args.txt` contains:
```
--select F401
--quiet
path/to/code1/
path/to/code2/
```

## Cache

Ruff caches results in `.ruff_cache` by default. Control caching with:

```bash
ruff check --no-cache           # Disable cache
ruff check --cache-dir ~/.cache/ruff  # Custom cache directory
ruff clean                      # Clear all caches
```

The `RUFF_CACHE_DIR` environment variable can also set the cache directory.

## Next Steps

- See `api.md` for the full CLI reference, configuration options, rules catalog, and settings.
- See `guides.md` for editor setup, CI/CD integration, migration guides, and best practices.

## Sources

- [Ruff Documentation Home](https://docs.astral.sh/ruff/)
- [Installation Guide](https://docs.astral.sh/ruff/installation/)
- [Configuration Guide](https://docs.astral.sh/ruff/configuration/)
- [The Ruff Linter](https://docs.astral.sh/ruff/linter/)
- [Preview Mode](https://docs.astral.sh/ruff/preview/)
- [FAQ](https://docs.astral.sh/ruff/faq/)

# Getting Started with ty

## Installation

### Running without installation

```bash
uvx ty check
```

### Adding ty to your project

```bash
uv add --dev ty
uv run ty check
```

Update with:
```bash
uv lock --upgrade-package ty
```

### Installing globally with uv

```bash
uv tool install ty@latest
uv tool upgrade ty
```

### Installing with the standalone installer

**Linux/macOS:**
```bash
curl -LsSf https://astral.sh/ty/install.sh | sh
# Specific version:
curl -LsSf https://astral.sh/ty/0.0.61/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/ty/install.ps1 | iex"
# Specific version:
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/ty/0.0.61/install.ps1 | iex"
```

**wget alternative:**
```bash
wget -qO- https://astral.sh/ty/install.sh | sh
```

### Installing from GitHub Releases

Download binaries from [GitHub Releases](https://github.com/astral-sh/ty/releases).

### Installing globally with pipx

```bash
pipx install ty
pipx upgrade ty
```

### Installing with pip

```bash
pip install ty
```

### Installing globally with mise

```bash
mise install ty
mise use --global ty
```

### Installing in Docker

```dockerfile
COPY --from=ghcr.io/astral-sh/ty:latest /ty /bin/
```

Available tags:
- `ghcr.io/astral-sh/ty:latest`
- `ghcr.io/astral-sh/ty:{major}.{minor}.{patch}` (e.g., `0.0.61`)
- `ghcr.io/astral-sh/ty:{major}.{minor}` (e.g., `0.0`)

### Using ty with Bazel

[aspect_rules_lint](https://registry.bazel.build/docs/aspect_rules_lint) provides a Bazel lint aspect for ty.

## First Run

```bash
# Check all Python files in the current directory
ty check

# Check specific files
ty check example.py

# Watch mode (incremental rechecking)
ty check --watch

# Apply fixes
ty check --fix
```

ty will check all Python files in the working directory (including subdirectories, recursively). If used from a project, ty will run on all Python files in the project (starting in the directory with the `pyproject.toml`).

## Environment Discovery

ty discovers installed packages via:
1. Active virtual environment (`VIRTUAL_ENV` env var)
2. `.venv` directory in project root or working directory
3. `python3` or `python` binary in `PATH`
4. `--python` flag for explicit specification

## Configuration Basics

ty searches for `pyproject.toml` or `ty.toml` in the current directory or nearest parent directory.

**pyproject.toml:**
```toml
[tool.ty]
[tool.ty.rules]
possibly-unresolved-reference = "warn"
division-by-zero = "ignore"
```

**ty.toml** (omits `[tool.ty]` prefix):
```toml
[rules]
possibly-unresolved-reference = "warn"
division-by-zero = "ignore"
```

> **Note:** `ty.toml` takes precedence over `pyproject.toml` if both are present in the same directory.

User-level config: `~/.config/ty/ty.toml` (Linux/macOS), `%APPDATA%\ty\ty.toml` (Windows).

## Output Formats

```bash
ty check --output-format full      # Default: verbose with context and hints
ty check --output-format concise   # One diagnostic per line
ty check --output-format github    # GitHub Actions error annotations
ty check --output-format gitlab    # GitLab Code Quality JSON
ty check --output-format junit     # JUnit-style XML report
```

## Shell Autocompletion

```bash
# Bash
echo 'eval "$(ty generate-shell-completion bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(ty generate-shell-completion zsh)"' >> ~/.zshrc

# Fish
echo 'ty generate-shell-completion fish | source' > ~/.config/fish/completions/ty.fish

# Elvish
echo 'eval (ty generate-shell-completion elvish | slurp)' >> ~/.elvish/rc.elv

# PowerShell
Add-Content -Path $PROFILE -Value '(& ty generate-shell-completion powershell) | Out-String | Invoke-Expression'
```

## Playground

Try ty online at [play.ty.dev](https://play.ty.dev) — useful for sharing snippets and bug reports.

## Sources

- [Installation](https://docs.astral.sh/ty/installation/)
- [Type checking](https://docs.astral.sh/ty/type-checking/)
- [Configuration](https://docs.astral.sh/ty/configuration/)

# Getting Started with uv

> **Source:** [https://docs.astral.sh/uv/getting-started/](https://docs.astral.sh/uv/getting-started/)

## Installation

### Standalone Installer

uv provides a standalone installer for macOS, Linux, and Windows.

**macOS / Linux:**

```bash
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

If your system doesn't have curl, use wget:

```bash
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Request a specific version by including it in the URL:

```bash
$ curl -LsSf https://astral.sh/uv/0.11.30/install.sh | sh
```

**Windows (PowerShell):**

```powershell
PS> powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Request a specific version:

```powershell
PS> powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.11.30/install.ps1 | iex"
```

The installation script can be inspected before use:

```bash
$ curl -LsSf https://astral.sh/uv/install.sh | less
```

### PyPI

uv is published to PyPI. Install into an isolated environment with pipx:

```bash
$ pipx install uv
```

Or with pip directly:

```bash
$ pip install uv
```

uv ships with prebuilt wheels for many platforms. If a wheel is not available, uv will be built from source, which requires a Rust toolchain.

### Homebrew

```bash
$ brew install uv
```

### MacPorts

```bash
$ sudo port install uv
```

### WinGet

```bash
$ winget install --id=astral-sh.uv -e
```

### Scoop

```bash
$ scoop install main/uv
```

### Docker

uv provides a Docker image at `ghcr.io/astral-sh/uv`.

```bash
$ docker run --rm -it ghcr.io/astral-sh/uv:debian uv --help
```

### GitHub Releases

Release artifacts can be downloaded directly from [GitHub Releases](https://github.com/astral-sh/uv/releases). Each release includes binaries for all supported platforms.

### Cargo

uv is available via crates.io:

```bash
$ cargo install --locked uv
```

This method builds uv from source and requires a compatible Rust toolchain.

## Upgrading uv

When installed via the standalone installer, uv can self-update:

```bash
$ uv self update
```

Updating uv will re-run the installer and can modify your shell profiles. To disable this behavior, set `UV_NO_MODIFY_PATH=1`.

When using another installation method, use the package manager's upgrade method instead:

```bash
$ pip install --upgrade uv
```

## Shell Autocompletion

Determine your shell with `echo $SHELL`, then enable autocompletion:

**Bash:**

```bash
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc
```

**Zsh:**

```bash
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
```

**Fish:**

```bash
echo 'uv generate-shell-completion fish | source' > ~/.config/fish/completions/uv.fish
```

**Elvish:**

```bash
echo 'eval (uv generate-shell-completion elvish | slurp)' >> ~/.elvish/rc.elv
```

**PowerShell:**

```powershell
if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
Add-Content -Path $PROFILE -Value '(& uv generate-shell-completion powershell) | Out-String | Invoke-Expression'
```

For `uvx` autocompletion, use `uvx --generate-shell-completion <shell>` instead.

## Uninstallation

1. Clean up stored data (optional):

```bash
$ uv cache clean
$ rm -r "$(uv python dir)"
$ rm -r "$(uv tool dir)"
```

2. Remove the uv and uvx binaries:

**macOS / Linux:**

```bash
$ rm ~/.local/bin/uv ~/.local/bin/uvx
```

**Windows:**

```powershell
PS> rm $HOME\.local\bin\uv.exe
PS> rm $HOME\.local\bin\uvx.exe
PS> rm $HOME\.local\bin\uvw.exe
```

Prior to 0.5.0, uv was installed into `~/.cargo/bin`. The binaries can be removed from there to uninstall.

## First Steps

After installing, verify uv is available:

```bash
$ uv
An extremely fast Python package manager.
Usage: uv [OPTIONS] <COMMAND> ...
```

You should see a help menu listing the available commands.

## Features Overview

### Python Versions

- `uv python install` — Install Python versions
- `uv python list` — View available Python versions
- `uv python find` — Find an installed Python version
- `uv python pin` — Pin the current project to a specific Python version
- `uv python uninstall` — Uninstall a Python version

### Scripts

- `uv run` — Run a script
- `uv add --script` — Add a dependency to a script
- `uv remove --script` — Remove a dependency from a script

### Projects

- `uv init` — Create a new Python project
- `uv add` — Add a dependency to the project
- `uv remove` — Remove a dependency from the project
- `uv sync` — Sync the project's dependencies with the environment
- `uv lock` — Create a lockfile for the project's dependencies
- `uv run` — Run a command in the project environment
- `uv tree` — View the dependency tree for the project
- `uv build` — Build the project into distribution archives
- `uv publish` — Publish the project to a package index

### Tools

- `uvx` / `uv tool run` — Run a tool in a temporary environment
- `uv tool install` — Install a tool user-wide
- `uv tool uninstall` — Uninstall a tool
- `uv tool list` — List installed tools
- `uv tool update-shell` — Update the shell to include tool executables

### The pip Interface

Creating virtual environments (replacing venv and virtualenv):

- `uv venv` — Create a new virtual environment

Managing packages (replacing pip and pipdeptree):

- `uv pip install` — Install packages into the current environment
- `uv pip show` — Show details about an installed package
- `uv pip freeze` — List installed packages and their versions
- `uv pip check` — Check that the current environment has compatible packages
- `uv pip list` — List installed packages
- `uv pip uninstall` — Uninstall packages
- `uv pip tree` — View the dependency tree for the environment

Locking packages (replacing pip-tools):

- `uv pip compile` — Compile requirements into a lockfile
- `uv pip sync` — Sync an environment with a lockfile

### Utility

- `uv cache clean` — Remove cache entries
- `uv cache prune` — Remove outdated cache entries and all centralized project environments
- `uv cache dir` — Show the uv cache directory path
- `uv tool dir` — Show the uv tool directory path
- `uv python dir` — Show the uv installed Python versions path
- `uv self update` — Update uv to the latest version

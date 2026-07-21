# CLI Reference — Commands and Flags

> **Source:** [https://docs.astral.sh/uv/reference/cli/](https://docs.astral.sh/uv/reference/cli/)

## Top-Level Usage

```
uv [OPTIONS] <COMMAND>
```

## Commands Overview

| Command | Description |
|---------|-------------|
| `uv auth` | Manage authentication |
| `uv run` | Run a command or script |
| `uv init` | Create a new project |
| `uv add` | Add dependencies to the project |
| `uv remove` | Remove dependencies from the project |
| `uv version` | Read or update the project's version |
| `uv sync` | Update the project's environment |
| `uv lock` | Update the project's lockfile |
| `uv export` | Export the project's lockfile to an alternate format |
| `uv tree` | Display the project's dependency tree |
| `uv format` | Format Python code in the project |
| `uv check` | Run checks on the project |
| `uv audit` | Audit the project's dependencies |
| `uv tool` | Run and install commands provided by Python packages |
| `uv python` | Manage Python versions and installations |
| `uv pip` | Manage Python packages with a pip-compatible interface |
| `uv venv` | Create a virtual environment |
| `uv build` | Build Python packages into source distributions and wheels |
| `uv publish` | Upload distributions to an index |
| `uv workspace` | Inspect uv workspaces |
| `uv cache` | Manage uv's cache |
| `uv self` | Manage the uv executable |
| `uv generate-shell-completion` | Generate shell completion |
| `uv help` | Display documentation for a command |

## uv auth

Manage authentication credentials.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv auth login` | Log in to an index |
| `uv auth logout` | Log out from an index |
| `uv auth token` | Get a token for an index |
| `uv auth dir` | Show the credentials directory |

## uv run

Run a command or script in the project environment.

```
uv run [OPTIONS] [COMMAND]...
```

Key options: `--with`, `--no-project`, `--isolated`, `--extra`, `--group`, `--no-sync`, `--frozen`, `--locked`, `--python`, `--package`, `--no-env-file`.

## uv init

Create a new project.

```
uv init [OPTIONS] [PATH]
```

Key options: `--name`, `--package`, `--lib`, `--app`, `--script`, `--bare`, `--build-backend`, `--python`, `--no-readme`, `--no-pin-python`, `--vcs`.

## uv add

Add dependencies to the project.

```
uv add [OPTIONS] [REQUIREMENTS]...
```

Key options: `--dev`, `--group`, `--optional`, `--editable`, `--rev`, `--tag`, `--branch`, `--index`, `--raw`, `--script`, `--frozen`, `--no-sync`.

## uv remove

Remove dependencies from the project.

```
uv remove [OPTIONS] [REQUIREMENTS]...
```

Key options: `--dev`, `--group`, `--optional`, `--package`, `--frozen`, `--no-sync`.

## uv version

Read or update the project's version.

```
uv version [OPTIONS] [VERSION]
```

Key options: `--short`, `--bump`, `--get`, `--frozen`, `--no-sync`.

## uv sync

Update the project's environment.

```
uv sync [OPTIONS]
```

Key options: `--frozen`, `--locked`, `--extra`, `--all-extras`, `--group`, `--all-groups`, `--no-group`, `--no-default-groups`, `--dev`, `--no-dev`, `--editable`, `--no-editable`, `--no-install-project`, `--no-install-workspace`, `--no-install-local`, `--reinstall`, `--reinstall-package`.

## uv lock

Update the project's lockfile.

```
uv lock [OPTIONS]
```

Key options: `--frozen`, `--upgrade`, `--upgrade-package`, `--universal`, `--python-platform`, `--python-version`.

## uv export

Export the lockfile to an alternate format (e.g., `requirements.txt`).

```
uv export [OPTIONS]
```

Key options: `--format`, `--extra`, `--all-extras`, `--group`, `--all-groups`, `--no-dev`, `--no-emit-project`, `--no-emit-workspace`, `--output-file`, `--prerelease`.

## uv tree

Display the project's dependency tree.

```
uv tree [OPTIONS]
```

Key options: `--depth`, `--prune`, `--package`, `--invert`, `--frozen`, `--no-dev`, `--no-groups`.

## uv tool

Run and install commands provided by Python packages.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv tool run` / `uvx` | Run a tool in an isolated environment |
| `uv tool install` | Install a tool |
| `uv tool upgrade` | Upgrade installed tools |
| `uv tool list` | List installed tools |
| `uv tool uninstall` | Uninstall a tool |
| `uv tool update-shell` | Update shell PATH for tool executables |
| `uv tool dir` | Show tool directories |

## uv python

Manage Python versions and installations.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv python list` | List available Python versions |
| `uv python install` | Install Python versions |
| `uv python upgrade` | Upgrade managed Python versions |
| `uv python find` | Find a Python interpreter |
| `uv python pin` | Pin the project's Python version |
| `uv python dir` | Show Python directories |
| `uv python uninstall` | Uninstall Python versions |
| `uv python update-shell` | Update shell PATH for Python executables |

## uv pip

Manage Python packages with a pip-compatible interface.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv pip compile` | Compile requirements into a lockfile |
| `uv pip sync` | Sync environment with requirements |
| `uv pip install` | Install packages |
| `uv pip uninstall` | Uninstall packages |
| `uv pip freeze` | List installed packages in requirements format |
| `uv pip list` | List installed packages |
| `uv pip show` | Show package information |
| `uv pip tree` | Show dependency tree |
| `uv pip check` | Verify environment for conflicts |

## uv venv

Create a virtual environment.

```
uv venv [OPTIONS] [PATH]
```

Key options: `--python`, `--seed`, `--clear`, `--relocatable`, `--prompt`, `--link-mode`.

## uv build

Build Python packages into source distributions and wheels.

```
uv build [OPTIONS] [SOURCE]
```

Key options: `--wheel`, `--sdist`, `--out-dir`, `--build-constraint`, `--no-build-isolation`, `--package`.

## uv publish

Upload distributions to an index.

```
uv publish [OPTIONS] [FILES]...
```

Key options: `--token`, `--username`, `--password`, `--publish-url`, `--index`, `--check-url`, `--no-attestations`, `--trusted-publishing`.

## uv workspace

Inspect uv workspaces.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv workspace metadata` | Show workspace metadata |
| `uv workspace dir` | Show workspace root directory |
| `uv workspace list` | List workspace members |

## uv cache

Manage uv's cache.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv cache clean` | Remove all cache entries |
| `uv cache prune` | Prune cache entries (use `--ci` for CI optimization) |
| `uv cache dir` | Show cache directory |
| `uv cache size` | Show cache size |

## uv self

Manage the uv executable.

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `uv self update` | Update uv to the latest version |
| `uv self version` | Show uv version |

## Global Options

These options are available on all commands:

| Option | Description |
|--------|-------------|
| `--cache-dir` | Path to cache directory |
| `--no-cache` | Avoid reading from or writing to the cache |
| `--config-file` | Path to config file |
| `--no-config` | Don't read config files |
| `--directory` | Change to directory before running |
| `--project` | Path to project directory |
| `--python` | Python interpreter to use |
| `--python-platform` | Platform to resolve for |
| `--python-version` | Python version to resolve for |
| `--offline` | Disable network access |
| `--no-progress` | Hide progress indicators |
| `--preview` | Enable preview features |
| `--quiet` / `-q` | Reduce verbosity |
| `--verbose` / `-v` | Increase verbosity |
| `--color` | Color output (`auto`/`always`/`never`) |
| `--no-color` | Disable colored output |
| `--native-tls` | Use platform TLS (deprecated, use `--system-certs`) |
| `--system-certs` | Use platform certificate store |
| `--allow-insecure-host` | Allow insecure connections to host |

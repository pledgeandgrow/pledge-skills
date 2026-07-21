# The pip Interface — Environments, Packages, and Locking

> **Source:** [https://docs.astral.sh/uv/pip/](https://docs.astral.sh/uv/pip/)

uv provides a drop-in replacement for common pip, pip-tools, and virtualenv commands. It extends their interfaces with advanced features like dependency version overrides, platform-independent resolutions, reproducible resolutions, and alternative resolution strategies.

## Using Python Environments

### Creating a Virtual Environment

```bash
$ uv venv
```

Specify a name or path:

```bash
$ uv venv my-name
```

Request a specific Python version:

```bash
$ uv venv --python 3.11
```

### Using a Virtual Environment

When using the default name (`.venv`), uv automatically finds and uses it:

```bash
$ uv venv
$ uv pip install ruff
```

Activate the virtual environment:

```bash
$ source .venv/bin/activate
```

```powershell
PS> .venv\Scripts\activate
```

Additional activation scripts for alternative shells:

```bash
$ source .venv/bin/activate.fish
$ source .venv/bin/activate.csh
```

```powershell
$ use .venv\Scripts\activate.nu
```

### Deactivating

```bash
$ deactivate
```

### Using Arbitrary Python Environments

Set `VIRTUAL_ENV` to install into a specific virtual environment:

```bash
$ VIRTUAL_ENV=/path/to/venv uv pip install ruff
```

Install into an arbitrary interpreter with `--python`:

```bash
$ uv pip install --python /path/to/python
```

Install into the system Python with `--system`:

```bash
$ uv pip install --system ruff
```

`--system` is appropriate in CI and containerized environments. Without `--system`, uv ignores interpreters not in virtual environments.

### Discovery of Python Environments

When running commands that mutate an environment (`uv pip sync`, `uv pip install`), uv searches for a virtual environment in this order:

1. An activated virtual environment (`VIRTUAL_ENV` environment variable)
2. An activated Conda environment (`CONDA_PREFIX` environment variable)
3. A virtual environment at `.venv` in the current or nearest parent directory

If no virtual environment is found, uv prompts to create one.

## Managing Packages

### Installing a Package

```bash
$ uv pip install flask
```

With optional dependencies (extras):

```bash
$ uv pip install "flask[dotenv]"
```

Multiple packages:

```bash
$ uv pip install flask ruff
```

With version constraints:

```bash
$ uv pip install 'ruff>=0.2.0'
$ uv pip install 'ruff==0.3.0'
```

From local disk:

```bash
$ uv pip install "ruff @ ./projects/ruff"
```

From GitHub:

```bash
$ uv pip install "git+https://github.com/astral-sh/ruff"
```

From GitHub at a specific reference:

```bash
$ uv pip install "git+https://github.com/astral-sh/ruff@v0.3.0"  # tag
$ uv pip install "git+https://github.com/astral-sh/ruff@1fadefa67b26508cc59cf38e6130bde2243c929d"  # commit
$ uv pip install "git+https://github.com/astral-sh/ruff@main"  # branch
```

### Editable Packages

Install the current project as editable:

```bash
$ uv pip install -e .
```

Install a project in another directory as editable:

```bash
$ uv pip install -e "ruff @ ./project/ruff"
```

### Installing From Files

From `requirements.txt`:

```bash
$ uv pip install -r requirements.txt
```

From `pyproject.toml`:

```bash
$ uv pip install -r pyproject.toml
```

With extras:

```bash
$ uv pip install -r pyproject.toml --extra foo
$ uv pip install -r pyproject.toml --all-extras
```

From dependency groups:

```bash
$ uv pip install --group foo
$ uv pip install --project some/path/ --group foo --group bar
$ uv pip install --group some/path/pyproject.toml:foo
```

### Uninstalling a Package

```bash
$ uv pip uninstall flask
$ uv pip uninstall flask ruff
```

## Locking Environments

### Locking Requirements

Compile dependencies into a `requirements.txt`:

```bash
$ uv pip compile pyproject.toml -o requirements.txt
$ uv pip compile requirements.in -o requirements.txt
```

Multiple files:

```bash
$ uv pip compile pyproject.toml requirements-dev.in -o requirements-dev.txt
```

Legacy `setup.py`:

```bash
$ uv pip compile setup.py -o requirements.txt
```

From stdin:

```bash
$ echo "ruff" | uv pip compile -
```

With extras:

```bash
$ uv pip compile pyproject.toml --extra foo
$ uv pip compile pyproject.toml --all-extras
```

With dependency groups:

```bash
$ uv pip compile --group foo
$ uv pip compile --project some/path/ --group foo --group bar
```

Platform-independent resolution:

```bash
$ uv pip compile requirements.in --universal --output-file requirements.txt
```

### Upgrading Requirements

When using an output file, uv considers versions pinned in the existing file. To upgrade:

```bash
$ uv pip compile - -o requirements.txt --upgrade-package ruff
```

Upgrade all dependencies:

```bash
$ uv pip compile - -o requirements.txt --upgrade
```

### Syncing an Environment

`uv pip install` does not remove extraneous packages. To ensure the environment exactly matches the lockfile, use `uv pip sync`:

```bash
$ uv pip sync requirements.txt
```

Sync with a PEP 751 `pylock.toml` file:

```bash
$ uv pip sync pylock.toml
```

### Adding Constraints

Constraints files control the version of a requirement without triggering installation:

```bash
$ uv pip compile requirements.in --constraint constraints.txt
```

uv also reads `constraint-dependencies` from the `pyproject.toml` at the workspace root.

### Adding Build Constraints

Build constraints control build-time dependency versions:

```bash
$ uv pip compile requirements.in --build-constraint build-constraints.txt
```

uv also reads `build-constraint-dependencies` from the `pyproject.toml` at the workspace root.

### Overriding Dependency Versions

Overrides force a specific version regardless of declared requirements:

```bash
$ uv pip compile requirements.in --override overrides.txt
```

While constraints are additive (combined with package requirements), overrides are absolute (completely replace package requirements). Useful for removing upper bounds from transitive dependencies.

## Compatibility with pip

uv is designed as a drop-in replacement for common pip and pip-tools workflows. Swapping `pip install` for `uv pip install` should "just work" in most cases.

However, uv is not an exact clone of pip. Key differences:

- **Configuration files and environment variables** — uv supports both pip-style config and its own settings
- **Pre-release compatibility** — uv follows PEP 440 pre-release handling
- **Packages on multiple indexes** — uv uses first-index strategy by default to prevent dependency confusion attacks
- **PEP 517 build isolation** — uv uses build isolation by default
- **Virtual environments by default** — uv requires a virtual environment unless `--system` is provided
- **Resolution strategy** — uv uses a different resolution algorithm
- **`pip check`** — uv has `uv pip check` with similar behavior
- **`--user` installs** — not supported; use `--system` instead
- **Bytecode compilation** — uv compiles bytecode by default (can be disabled with `--no-compile-bytecode`)
- **Strictness and spec enforcement** — uv is generally stricter than pip
- **Registry authentication** — uv supports netrc and keyring
- **Build constraints** — uv-specific feature for constraining build-time dependencies
- **`pip compile` defaults** — uv pip compile has some different defaults than pip-tools
- **`requires-python` upper bounds** — uv enforces requires-python more strictly

## Inspecting Environments

> **Source:** [https://docs.astral.sh/uv/pip/inspection/](https://docs.astral.sh/uv/pip/inspection/)

### Listing Installed Packages

```bash
$ uv pip list
```

List in JSON format:

```bash
$ uv pip list --format json
```

List in `requirements.txt` format (frozen):

```bash
$ uv pip freeze
```

### Inspecting a Package

Show information about an installed package:

```bash
$ uv pip show numpy
```

Multiple packages can be inspected at once:

```bash
$ uv pip show numpy pandas scipy
```

### Verifying an Environment

Check for conflicts or missing dependencies (useful when packages were installed in multiple steps):

```bash
$ uv pip check
```

### Viewing the Dependency Tree

Display the dependency tree of installed packages:

```bash
$ uv pip tree
```

## Declaring Dependencies

> **Source:** [https://docs.astral.sh/uv/pip/dependencies/](https://docs.astral.sh/uv/pip/dependencies/)

### Using pyproject.toml

Define project dependencies:

```toml
[project]
dependencies = [
  "httpx",
  "ruff>=0.3.0"
]
```

Define optional dependencies (extras):

```toml
[project.optional-dependencies]
cli = [
  "rich",
  "click",
]
```

Install extras with `--extra` or `--all-extras` flags or `package[<extra>]` syntax.

### Using requirements.in

Lightweight requirements file format, one requirement per line:

```
httpx
ruff>=0.3.0
```

Optional dependency groups are not supported in this format.

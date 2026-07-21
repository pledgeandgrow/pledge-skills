# Python Versions — Installing and Managing

> **Source:** [https://docs.astral.sh/uv/concepts/python-versions/](https://docs.astral.sh/uv/concepts/python-versions/), [https://docs.astral.sh/uv/guides/install-python/](https://docs.astral.sh/uv/guides/install-python/)

## Managed and System Python Installations

uv distinguishes between:

- **Managed Python installations** — Python versions installed by uv
- **System Python installations** — all other Python installations (including those managed by pyenv, operating system, etc.)

uv does not distinguish between OS-installed Python and Python installed by other tools.

## Installing Python

Install the latest Python version:

```bash
$ uv python install
```

Install a specific version:

```bash
$ uv python install 3.12
```

Install multiple versions:

```bash
$ uv python install 3.11 3.12
```

Install an alternative implementation (PyPy):

```bash
$ uv python install pypy@3.10
```

Once installed, uv adds the versioned executable to your PATH:

```bash
$ python3.13
```

To install `python` and `python3` executables (not just versioned ones), use `--default`:

```bash
$ uv python install --default
```

### Reinstalling Python

```bash
$ uv python install --reinstall
```

This reinstalls all previously installed Python versions. Improvements are constantly added to the distributions, so reinstalling may resolve bugs.

### Upgrading Python Versions

Upgrade a Python version to the latest supported patch release:

```bash
$ uv python upgrade 3.12
```

Upgrade all uv-managed Python versions:

```bash
$ uv python upgrade
```

## Requesting a Version

A specific Python version can be requested with `--python`:

```bash
$ uv venv --python 3.11.6
```

uv will ensure the version is available — downloading and installing if necessary.

### Supported Request Formats

- `<version>` — e.g., `3`, `3.12`, `3.12.3`
- `<version-specifier>` — e.g., `>=3.12,<3.13`
- `<version><short-variant>` — e.g., `3.13t` (free-threaded), `3.12.0d` (debug)
- `<version>+<variant>` — e.g., `3.13+freethreaded`, `3.12.0+debug`, `3.14+gil`
- `<implementation>` — e.g., `cpython` or `cp`
- `<implementation>@<version>` — e.g., `cpython@3.12`
- `<implementation><version>` — e.g., `cpython3.12` or `cp312`
- `<implementation><version-specifier>` — e.g., `cpython>=3.12,<3.13`
- `<implementation>-<version>-<os>-<arch>-<libc>` — e.g., `cpython-3.12.3-macos-aarch64-none`

System Python interpreters can also be requested:

- `<executable-path>` — e.g., `/opt/homebrew/bin/python3`
- `<executable-name>` — e.g., `mypython3`
- `<install-dir>` — e.g., `/some/environment/`

### Python Version Files

Pin a Python version for the current directory:

```bash
$ uv python pin 3.11
Pinned `.python-version` to `3.11`
```

## Viewing Available Python Versions

```bash
$ uv python list
```

Filter by version:

```bash
$ uv python list 3.13
$ uv python list pypy
```

View all versions (including other platforms and old patches):

```bash
$ uv python list --all-versions
$ uv python list --all-platforms
```

Only show installed versions:

```bash
$ uv python list --only-installed
```

## Finding a Python Executable

```bash
$ uv python find
```

With a version request:

```bash
$ uv python find '>=3.11'
```

By default, `uv python find` includes Python from virtual environments. If a `.venv` directory is found in the working directory or parent directories, or `VIRTUAL_ENV` is set, it takes precedence over PATH.

To ignore virtual environments:

```bash
$ uv python find --system
```

## Automatic Python Downloads

Python does not need to be explicitly installed. By default, uv automatically downloads Python versions when required:

```bash
$ uvx python@3.12 -c "print('hello world')"
```

Even without a specific version request, uv will download the latest version on demand if no Python is installed:

```bash
$ uv venv
```

Automatic downloads can be disabled for more control.

## Using Existing Python Versions

uv uses existing Python installations if present. No configuration is needed — uv will use the system Python if it satisfies requirements.

To force uv to use system Python only:

```bash
--no-managed-python
```

## Discovery of Python Versions

When searching for a Python version, uv checks:

1. Managed Python installations in `UV_PYTHON_INSTALL_DIR`
2. Python interpreters on the PATH (`python`, `python3`, `python3.x` on macOS/Linux; `python.exe` on Windows)
3. On Windows: Python interpreters in the Windows registry and Microsoft Store (via `py --list-paths`)

Virtual environment interpreters are checked for compatibility before searching for installations.

When searching for managed Python, uv prefers newer versions first. For system Python, uv uses the first compatible version (not necessarily the newest).

If a Python version cannot be found on the system, uv checks for a compatible managed Python download.

## Project Python Versions

uv respects `requires-python` in `pyproject.toml` during project command invocations. The first compatible Python version is used unless overridden by a `.python-version` file or `--python` flag.

## Python Implementation Support

uv supports:

- **CPython** — from the Astral python-build-standalone project
- **PyPy** — from the PyPy project
- **Pyodide** — for WebAssembly environments

## Free-Threaded Python

Free-threaded Python (PEP 703) is available with the `t` variant suffix:

```bash
$ uv python install 3.13t
$ uv venv --python 3.13+freethreaded
```

## Debug Python Variants

Debug builds are available with the `d` variant suffix:

```bash
$ uv python install 3.12.0d
$ uv venv --python 3.12.0+debug
```

## Disabling Automatic Python Downloads

Set `python-downloads = "never"` or use `--no-python-downloads`:

```toml
[tool.uv]
python-downloads = "never"
```

## Requiring or Disabling Managed Python

- `--managed-python` — require uv-managed Python only
- `--no-managed-python` — disallow uv-managed Python, use system only

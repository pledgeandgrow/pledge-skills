# Using Tools with uv

> **Source:** [https://docs.astral.sh/uv/guides/tools/](https://docs.astral.sh/uv/guides/tools/)

uv executes and installs command-line tools provided by Python packages, similar to pipx.

## Running Tools

The `uvx` command invokes a tool without installing it (alias for `uv tool run`):

```bash
$ uvx ruff
```

Arguments can be provided after the tool name:

```bash
$ uvx pycowsay hello from uv
```

Tools are installed into temporary, isolated environments when using `uvx`.

If running a tool in a project and the tool requires the project to be installed (e.g., pytest, mypy), use `uv run` instead of `uvx`. Otherwise, the tool runs in an environment isolated from your project.

If your project has a flat structure (no `src` directory), the project doesn't need to be installed and `uvx` is fine. Use `uv run` only if you want to pin the tool version in project dependencies.

## Commands With Different Package Names

When the package and command names differ, use `--from` to specify the package:

```bash
$ uvx --from httpie http
```

## Requesting Specific Versions

Run a tool at a specific version with `command@<version>`:

```bash
$ uvx ruff@0.3.0 check
```

Run at the latest version:

```bash
$ uvx ruff@latest check
```

The `--from` option can also specify versions:

```bash
$ uvx --from 'ruff==0.3.0' ruff check
$ uvx --from 'ruff>0.2.0,<0.3.0' ruff check
```

The `@` syntax only supports exact versions.

## Requesting Extras

Run a tool with extras using `--from`:

```bash
$ uvx --from 'mypy[faster-cache,reports]' mypy --xml-report mypy_report
```

Combine with version selection:

```bash
$ uvx --from 'mypy[faster-cache,reports]==1.13.0' mypy --xml-report mypy_report
```

## Requesting Different Sources

Install from alternative sources with `--from`:

From git:

```bash
$ uvx --from git+https://github.com/httpie/cli httpie
```

From a specific branch:

```bash
$ uvx --from git+https://github.com/httpie/cli@master httpie
```

From a specific tag:

```bash
$ uvx --from git+https://github.com/httpie/cli@v3.2.0 httpie
```

From a specific commit:

```bash
$ uvx --from git+https://github.com/httpie/cli@2843b87 httpie
```

With Git LFS support:

```bash
$ uvx --lfs --from git+https://github.com/astral-sh/lfs-cowsay lfs-cowsay
```

## Commands With Plugins

Include additional dependencies with `--with`:

```bash
$ uvx --with mkdocs-material mkdocs --help
```

## Installing Tools

For frequently used tools, install to a persistent environment:

```bash
$ uv tool install ruff
```

When installed, executables are placed in a bin directory on the PATH. If not on PATH, use `uv tool update-shell` to add it.

```bash
$ ruff --version
ruff 0.5.4
```

Unlike `uv pip install`, installing a tool does not make its modules available in the current environment. This isolation reduces conflicts between dependencies of tools, scripts, and projects.

Unlike `uvx`, `uv tool install` operates on a package and installs all executables provided by the tool:

```bash
$ uv tool install httpie  # installs http, https, and httpie executables
```

Package versions can be included without `--from`:

```bash
$ uv tool install 'httpie>0.1.0'
```

From git:

```bash
$ uv tool install git+https://github.com/httpie/cli
```

With Git LFS:

```bash
$ uv tool install --lfs git+https://github.com/astral-sh/lfs-cowsay
```

With additional packages:

```bash
$ uv tool install mkdocs --with mkdocs-material
```

Install executables from multiple related packages together:

```bash
$ uv tool install --with-executables-from ansible-core,ansible-lint ansible
```

## Upgrading Tools

```bash
$ uv tool upgrade ruff
```

Tool upgrades respect version constraints provided when installing. To replace constraints, re-install:

```bash
$ uv tool install ruff>=0.4
```

Upgrade all tools:

```bash
$ uv tool upgrade --all
```

## Requesting Python Versions

Specify the Python interpreter with `--python`:

```bash
$ uvx --python 3.10 ruff
$ uv tool install --python 3.10 ruff
$ uv tool upgrade --python 3.10 ruff
```

## Legacy Windows Scripts

Tools support running legacy setuptools scripts with `.ps1`, `.cmd`, and `.bat` extensions:

```bash
$ uv tool run --from nuitka==2.6.7 nuitka.cmd --version
```

The extension can be omitted — uvx will automatically look for `.ps1`, `.cmd`, and `.bat` in that order:

```bash
$ uv tool run --from nuitka==2.6.7 nuitka --version
```

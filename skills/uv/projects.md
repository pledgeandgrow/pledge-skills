# Projects — Creating, Managing, and Publishing

> **Source:** [https://docs.astral.sh/uv/guides/projects/](https://docs.astral.sh/uv/guides/projects/), [https://docs.astral.sh/uv/concepts/projects/](https://docs.astral.sh/uv/concepts/projects/)

## Creating a New Project

Create a new Python project with `uv init`:

```bash
$ uv init hello-world
$ cd hello-world
```

Or initialize a project in the working directory:

```bash
$ mkdir hello-world
$ cd hello-world
$ uv init
```

uv creates the following files:

```
├── .git/
├── .gitignore
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

Run the default program:

```bash
$ uv run main.py
Hello from hello-world!
```

## Project Structure

A complete project listing after running a project command:

```
.
├── .git/
├── .venv/
│   ├── bin
│   ├── lib
│   └── pyvenv.cfg
├── .gitignore
├── .python-version
├── README.md
├── main.py
├── pyproject.toml
└── uv.lock
```

### pyproject.toml

The `pyproject.toml` contains metadata about your project:

```toml
[project]
name = "hello-world"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
dependencies = []
```

Use this file to specify dependencies, description, license, and uv configuration options in a `[[tool.uv]]` section. You can edit it manually or use `uv add` and `uv remove`.

### .python-version

Contains the project's default Python version. Tells uv which Python to use when creating the project's virtual environment.

### .venv

The project's virtual environment, isolated from the rest of the system. uv installs project dependencies here. It is automatically excluded from git with an internal `.gitignore` file.

### uv.lock

A cross-platform lockfile with exact resolved versions of your project's dependencies. Unlike `pyproject.toml` (broad requirements), the lockfile contains exact versions installed in the project environment. Should be checked into version control for consistent, reproducible installations across machines.

`uv.lock` is a human-readable TOML file but is managed by uv and should not be edited manually. The lockfile is automatically created and updated during `uv sync` and `uv run`, or explicitly with `uv lock`.

## Managing Dependencies

### Adding Dependencies

```bash
$ uv add requests
```

This adds an entry to `project.dependencies` and updates the lockfile and environment:

```toml
[project]
name = "example"
version = "0.1.0"
dependencies = ["httpx>=0.27.2"]
```

Specify version constraints or alternative sources:

```bash
$ uv add 'requests==2.31.0'
$ uv add git+https://github.com/psf/requests
```

When adding from a source other than a registry, uv adds an entry in `tool.uv.sources`:

```toml
[project]
name = "example"
version = "0.1.0"
dependencies = ["httpx"]

[tool.uv.sources]
httpx = { git = "https://github.com/encode/httpx" }
```

Import dependencies from a requirements file:

```bash
$ uv add -r requirements.txt -c constraints.txt
```

### Removing Dependencies

```bash
$ uv remove requests
```

### Upgrading a Package

```bash
$ uv lock --upgrade-package requests
```

The `--upgrade-package` flag updates the specified package to the latest compatible version while keeping the rest of the lockfile intact.

### Dependency Fields

Dependencies are defined in several fields:

- `project.dependencies` — Published dependencies
- `project.optional-dependencies` — Published optional dependencies ("extras")
- `dependency-groups` — Local dependencies for development (PEP 735)
- `tool.uv.sources` — Alternative sources for dependencies during development

### Optional Dependencies (Extras)

```toml
[project]
name = "pandas"
version = "1.0.0"

[project.optional-dependencies]
plot = ["matplotlib>=3.6.3"]
excel = ["odfpy>=1.4.1", "openpyxl>=3.1.0", "python-calamine>=0.1.7"]
```

Add an optional dependency:

```bash
$ uv add httpx --optional network
```

Sources can be declared for specific extras, e.g., pulling torch from different indexes:

```toml
[project.optional-dependencies]
cpu = ["torch"]
gpu = ["torch"]

[tool.uv.sources]
torch = [
  { index = "torch-cpu", extra = "cpu" },
  { index = "torch-gpu", extra = "gpu" },
]

[[tool.uv.index]]
name = "torch-cpu"
url = "https://download.pytorch.org/whl/cpu"

[[tool.uv.index]]
name = "torch-gpu"
url = "https://download.pytorch.org/whl/cu130"
```

### Development Dependencies

Development dependencies are local-only and not included when published.

Add with `--dev`:

```bash
$ uv add --dev pytest
```

Results in:

```toml
[dependency-groups]
dev = ["pytest >=8.1.1,<9"]
```

The `dev` group is special-cased with `--dev`, `--only-dev`, and `--no-dev` flags. It is synced by default.

### Dependency Groups

Divide development dependencies into multiple groups:

```bash
$ uv add --group lint ruff
```

```toml
[dependency-groups]
dev = ["pytest"]
lint = ["ruff"]
```

Group inclusion/exclusion flags: `--all-groups`, `--no-default-groups`, `--group`, `--only-group`, `--no-group`.

The `--dev`, `--only-dev`, and `--no-dev` flags are equivalent to `--group dev`, `--only-group dev`, and `--no-group dev`.

uv requires all dependency groups to be compatible with each other and resolves all groups together when creating the lockfile.

### Nesting Groups

```toml
[dependency-groups]
dev = [{include-group = "lint"}, {include-group = "test"}]
lint = ["ruff"]
test = ["pytest"]
```

### Default Groups

By default, the `dev` group is included in the environment. Change with:

```toml
[tool.uv]
default-groups = ["dev", "foo"]
```

Or enable all groups:

```toml
[tool.uv]
default-groups = "all"
```

### Group requires-python

Specify a different Python version range for a group:

```toml
[project]
requires-python = ">=3.10"

[dependency-groups]
dev = ["pytest"]

[tool.uv.dependency-groups]
dev = {requires-python = ">=3.12"}
```

### Legacy dev-dependencies

Before `dependency-groups` was standardized, uv used `tool.uv.dev-dependencies`:

```toml
[tool.uv]
dev-dependencies = ["pytest"]
```

Dependencies in this section are combined with `dependency-groups.dev`. This field will eventually be deprecated.

### Dependency Sources

The `tool.uv.sources` table extends standard dependency tables with alternative sources used during development:

```toml
[project]
dependencies = ["foo"]

[tool.uv.sources]
foo = { path = "./packages/foo" }
```

Supported source types:

- **Index** — A package resolved from a specific package index
- **Git** — A Git repository
- **URL** — A remote wheel or source distribution
- **Path** — A local wheel, source distribution, or project directory
- **Workspace** — A member of the current workspace

Sources are only respected by uv. Other tools will use only the standard `project` tables.

### Build Dependencies

Build dependencies are specified in `[build-system]` under `build-system.requires` (PEP 518):

```toml
[project]
name = "pandas"
version = "0.1.0"

[build-system]
requires = ["setuptools>=42"]
build-backend = "setuptools.build_meta"
```

uv respects `tool.uv.sources` when resolving build dependencies. When publishing, run `uv build --no-sources` to ensure the package builds correctly without uv-specific sources.

### Editable Dependencies

Editable installations add a link to the project within the virtual environment (a `.pth` file), so the interpreter uses source files directly. uv uses editable installation for workspace packages by default.

```bash
$ uv add --editable ./path/foo
```

Opt out of editable in a workspace:

```bash
$ uv add --no-editable ./path/foo
```

## Viewing Your Version

```bash
$ uv version
hello-world 0.7.0

$ uv version --short
0.7.0

$ uv version --output-format json
{"package_name": "hello-world", "version": "0.7.0", "commit_info": null}
```

## Running Commands

`uv run` runs arbitrary scripts or commands in the project environment. Prior to every invocation, uv verifies the lockfile is up-to-date with `pyproject.toml` and the environment is up-to-date with the lockfile.

```bash
$ uv add flask
$ uv run -- flask run -p 3000
```

Or run a script:

```bash
$ uv run example.py
```

Alternatively, use `uv sync` then activate the environment:

```bash
$ uv sync
$ source .venv/bin/activate
$ flask run -p 3000
```

```powershell
PS> uv sync
PS> .venv\Scripts\activate
PS> flask run -p 3000
```

The virtual environment must be active to run scripts without `uv run`.

## Project Configuration

### Python Version Requirement

```toml
[project]
name = "example"
version = "0.1.0"
requires-python = ">=3.12"
```

The Python version requirement determines allowed Python syntax and affects dependency version selection.

### Entry Points

Entry points advertise interfaces: command-line interfaces, graphical user interfaces, and plugin entry points. Using entry point tables requires a build system to be defined.

### Build Systems

A build system determines how the project should be packaged and installed:

```toml
[build-system]
requires = ["uv_build>=0.11.30,<0.12"]
build-backend = "uv_build"
```

uv uses the presence of a build system to determine if a project should be installed in the project virtual environment. Without a build system, uv will not build or install the project itself, just its dependencies.

### Project Packaging

Set `tool.uv.package` to override packaging behavior:

```toml
[tool.uv]
package = true  # Force building and installing
```

```toml
[tool.uv]
package = false  # Force not building
```

### Managed Mode

To disable automatic locking and syncing:

```toml
[tool.uv]
managed = false
```

### Centralized Project Environments

With the `centralized-project-envs` preview feature, uv stores the default project environment in its cache instead of `.venv`. uv attempts to maintain a `.venv` directory link to the cached environment.

## Workspaces

### Creating a Workspace

Add a `tool.uv.workspace` table to `pyproject.toml`:

```toml
[project]
name = "albatross"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = ["bird-feeder", "tqdm>=4,<5"]

[tool.uv.sources]
bird-feeder = { workspace = true }

[tool.uv.workspace]
members = ["packages/*"]
exclude = ["packages/seeds"]
```

Every directory included by `members` globs (and not excluded by `exclude` globs) must contain a `pyproject.toml` file. Workspace members can be applications or libraries.

### Workspace Sources

Dependencies on workspace members use `tool.uv.sources`:

```toml
[tool.uv.sources]
bird-feeder = { workspace = true }
```

The `workspace = true` key indicates the dependency should be provided by the workspace. Dependencies between workspace members are editable.

`tool.uv.sources` definitions in the workspace root apply to all members unless overridden in a specific member's `tool.uv.sources`.

### Workspace Layout

```
albatross
├── packages
│   ├── bird-feeder
│   │   ├── pyproject.toml
│   │   └── src
│   │       └── bird_feeder
│   │           ├── __init__.py
│   │           └── foo.py
│   └── seeds
│       ├── pyproject.toml
│       └── src
│           └── seeds
│               ├── __init__.py
│               └── bar.py
├── pyproject.toml
├── README.md
├── uv.lock
└── src
    └── albatross
        └── main.py
```

By default, `uv run` and `uv sync` operate on the workspace root. Use `--package` to target a specific member:

```bash
$ uv run --package bird-feeder test
```

## Building Distributions

```bash
$ uv build
$ ls dist/
hello-world-0.1.0-py3-none-any.whl
hello-world-0.1.0.tar.gz
```

`uv build <SRC>` builds the package in the specified directory. `uv build --package <PACKAGE>` builds the specified workspace member.

When publishing, run `uv build --no-sources` to ensure the package builds correctly when `tool.uv.sources` is disabled.

## Publishing Your Package

```bash
$ uv publish
```

Set a PyPI token with `--token` or `UV_PUBLISH_TOKEN`, or set username/password with `--username`/`UV_PUBLISH_USERNAME` and `--password`/`UV_PUBLISH_PASSWORD`.

For trusted publishing from GitHub Actions, add a trusted publisher to the PyPI project — no credentials needed.

Custom index with publish URL:

```toml
[[tool.uv.index]]
name = "testpypi"
url = "https://test.pypi.org/simple/"
publish-url = "https://test.pypi.org/legacy/"
explicit = true
```

```bash
$ uv publish --index testpypi
```

PyPI does not support publishing with username and password anymore — use a token. Using a token is equivalent to `--username __token__` with the token as password.

If publishing fails partway through, retry the same command — PyPI ignores identical files. For other registries, use `--check-url <index url>` to skip uploading files that already match.

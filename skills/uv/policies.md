# Policies — Versioning and Project Layout

> **Sources:** [Versioning](https://docs.astral.sh/uv/reference/policies/versioning/) | [Project layout](https://docs.astral.sh/uv/concepts/projects/layout/)

## Versioning

### Crate Versioning

uv's crates are published to [crates.io](https://crates.io). The following crates follow the normal uv versioning policy:
- `uv`
- `uv-build`
- `uv-version`

The `uv` and `uv-build` crates are versioned by the binary CLI. The Rust interface does not follow semantic versioning.

All other crates provide no stability guarantees — the Rust interface is internal and unstable. They are versioned as `0.0.x`, with the patch version incremented on every release.

### Cache Versioning

Cache versions are internal to uv and may change in minor or patch releases. See [caching.md](caching.md) for details.

### Lockfile Versioning

The `uv.lock` schema version is part of the public API and only incremented in a minor release as a breaking change.

## Project Structure and Files

### The pyproject.toml

Python project metadata is defined in `pyproject.toml`. uv requires this file to identify the project root. A minimal definition:

```toml
[project]
name = "example"
version = "0.1.0"
```

Additional metadata includes Python version requirements, dependencies, build system, and entry points.

### The Project Environment

uv creates a virtual environment in `.venv` next to `pyproject.toml`. It's stored inside the project for editor discovery (completions, type hints) and automatically excluded from git via an internal `.gitignore`.

Use `uv run` to run commands in the project environment, or activate it manually. `uv run` creates or updates the environment as needed. `uv sync` explicitly creates/updates it.

Avoid modifying the environment manually with `uv pip install` — use `uv add` for project deps or `uv run --with` for one-off requirements.

Disable automatic environment management:

```toml
[tool.uv]
managed = false
```

#### Centralized Project Environments (Preview)

With `centralized-project-envs` preview feature, uv stores the project environment in its cache and maintains a `.venv` symlink. If symlink creation fails, uv uses the cached environment directly. Explicit `UV_PROJECT_ENVIRONMENT` paths and `--active` selections are not centralized. Has no effect with `--no-cache`.

### The Lockfile

`uv.lock` is created next to `pyproject.toml`. It's a universal, cross-platform lockfile capturing exact resolved versions across all Python markers (OS, architecture, Python version).

The lockfile should be checked into version control for reproducible installations. It's automatically created/updated during `uv sync` and `uv run`, or explicitly with `uv lock`.

`uv.lock` is a human-readable TOML file managed by uv — do not edit manually. The format is uv-specific and not usable by other tools.

#### Relationship to pylock.toml

[PEP 751](https://peps.python.org/pep-0751/) standardized `pylock.toml` as a tool-agnostic lockfile format. uv supports it as an export target and in the pip CLI:

```bash
# Export uv.lock to pylock.toml
$ uv export -o pylock.toml

# Generate pylock.toml from requirements
$ uv pip compile requirements.in -o pylock.toml

# Install from pylock.toml
$ uv pip sync pylock.toml
$ uv pip install -r pylock.toml
```

uv continues to use `uv.lock` within the project interface since some functionality cannot be expressed in `pylock.toml` format.

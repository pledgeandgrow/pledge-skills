# Resolution — Dependency Resolution Concepts

> **Source:** [https://docs.astral.sh/uv/concepts/resolution/](https://docs.astral.sh/uv/concepts/resolution/)

## Dependencies

- **Direct dependencies** — defined by the current project
- **Transitive dependencies** — added by each dependency of the current project

The resolver finds a set of package versions that satisfies all project requirements, including transitive dependencies.

## Platform Markers

Markers attach conditions to requirements, e.g., `bar ; python_version < "3.9"` installs `bar` only on Python 3.8 and earlier. Markers can adjust dependencies by OS, architecture, Python version, implementation, and more.

## Platform-Specific Resolution

`uv pip compile` produces platform-specific resolutions by default (like pip-tools). Use `--python-platform` and `--python-version` to resolve for alternate platforms:

```bash
$ uv pip compile --python-platform linux --python-version 3.10 requirements.in
```

During platform-specific resolution, `--python-version` is the exact version, not a lower bound.

## Universal Resolution

`uv.lock` uses universal resolution — portable across OS, architecture, and Python version. Created by `uv lock`, `uv sync`, `uv add`.

Also available in pip interface with `--universal`:

```bash
$ uv pip compile --universal requirements.in -o requirements.txt
```

Key behaviors:
- A package may appear multiple times with different versions for different platforms (markers determine which is used)
- All packages must be compatible with the entire `requires-python` range
- uv selects the latest compatible version for each supported Python version
- Only lower bounds of `requires-python` are considered (upper bounds ignored, e.g., `>=3.8, <4` treated as `>=3.8`)

### Limited Resolution Environments

Constrain the lockfile to specific platforms:

```toml
[tool.uv]
environments = [
  "sys_platform == 'darwin'",
  "sys_platform == 'linux'",
]
```

Or restrict to CPython only:

```toml
[tool.uv]
environments = ["implementation_name == 'cpython'"]
```

Entries must be disjoint (no overlap).

### Required Environments

Force the lockfile to support specific environments:

```toml
[tool.uv]
required-environments = ["py3.12"]
```

## Dependency Preferences

uv prefers versions from existing lockfiles (`uv.lock` or `requirements.txt`) or already-installed packages. Versions won't change unless incompatible or `--upgrade` is used.

## Resolution Strategy

- `"highest"` (default) — Latest compatible version
- `"lowest"` — Lowest compatible version for all deps
- `"lowest-direct"` — Lowest for direct deps, highest for transitive

```bash
$ uv pip compile --resolution lowest requirements.in -o requirements.txt
```

Recommended: run tests with `--resolution lowest` or `--resolution lowest-direct` in CI to verify lower-bound compatibility.

## Pre-release Handling

Pre-releases are accepted when:
1. The package is a direct dependency with a pre-release specifier (e.g., `flask>=2.0.0rc1`)
2. All published versions of a package are pre-releases

Use `--prerelease allow` to allow pre-releases for all dependencies.

## Multi-Version Resolution

During universal resolution, a package may appear multiple times. The `--fork-strategy` setting controls the tradeoff:

- `"requires-python"` (default) — Optimize for latest version per Python version, minimizing total versions
- `"fewest"` — Minimize number of selected versions, preferring wider compatibility

Example with `numpy` and `requires-python >= 3.8`:

Default (`requires-python`):
```
numpy==1.24.4 ; python_version == "3.8"
numpy==2.0.2  ; python_version == "3.9"
numpy==2.2.0  ; python_version >= "3.10"
```

With `fewest`:
```
numpy==1.24.4  # for all Python versions
```

## Dependency Constraints

Constraint files (`--constraint constraints.txt`) narrow acceptable versions without adding the package to the resolution. Constraints only apply if the package is already a direct or transitive dependency.

## Dependency Overrides

Override versions force a specific version regardless of requirements:

```toml
[tool.uv]
override-dependencies = ["pytz==2024.1"]
```

## Dependency Exclusions

Exclude packages from the lockfile entirely:

```toml
[tool.uv]
exclude-dependencies = ["unnecessary-pkg"]
```

## Reproducible Resolutions

Use `--exclude-newer` to limit resolution to distributions uploaded before a date:

```bash
$ uv pip compile --exclude-newer 2024-01-01 requirements.in
```

```toml
[tool.uv]
exclude-newer = "2024-01-01T00:00:00Z"
```

Per-package overrides:

```toml
[tool.uv]
exclude-newer-package = { setuptools = "2024-01-01" }
```

Per-index overrides:

```toml
[[tool.uv.index]]
name = "internal"
url = "https://internal.example.com/simple"
exclude-newer = false
```

The package index must support the `upload-time` field (PEP 700). PyPI provides this for all packages. To disable: `--exclude-newer false` or `UV_EXCLUDE_NEWER=false`.

Only applies to registry packages (not Git dependencies). With `uv pip`, use `--reinstall` to force a new resolution.

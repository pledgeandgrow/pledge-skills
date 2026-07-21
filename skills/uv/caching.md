# Caching — Cache Management and CI

> **Source:** [https://docs.astral.sh/uv/concepts/cache/](https://docs.astral.sh/uv/concepts/cache/)

uv uses aggressive caching to avoid re-downloading and re-building dependencies that have already been accessed in prior runs. This is a key factor in uv's 10-100x speedup over pip.

## Dependency Caching Semantics

Caching behavior varies based on dependency type:

- **Registry dependencies (e.g., PyPI)** — uv respects HTTP caching headers
- **Direct URL dependencies** — uv respects HTTP caching headers and also caches based on the URL itself
- **Git dependencies** — uv caches based on the fully-resolved Git commit hash. `uv pip compile` pins Git dependencies to a specific commit hash
- **Local dependencies** — uv caches based on the last-modified time of the source archive (`.whl` or `.tar.gz`). For directories, caches based on the last-modified time of `pyproject.toml`, `setup.py`, or `setup.cfg`
- **Flat indexes (`--find-links`)** — uv assumes contents are immutable, caching each file by name. Replacing a file with new contents under the same name will not be picked up until the cache is refreshed

## Cache Safety

It's safe to run multiple uv commands concurrently, even against the same virtual environment. uv's cache is:

- **Thread-safe** — designed for concurrent readers and writers
- **Append-only** — entries are added, not modified in place
- **File-locked** — uv applies a file-based lock to the target virtual environment when installing

It's never safe to modify the cache directly (e.g., by removing a file or directory).

## Clearing the Cache

### Clean All Cache Entries

```bash
$ uv cache clean
```

### Clean Cache for a Specific Package

```bash
$ uv cache clean ruff
```

### Prune Unused Entries

```bash
$ uv cache prune
```

Removes all unused cache entries and all centralized project environments. Safe to run periodically to keep the cache directory clean.

uv blocks cache-modifying operations while other uv commands are running. By default, `uv cache` commands have a 5-minute timeout waiting for other uv processes to terminate. This timeout can be changed with `UV_LOCK_TIMEOUT`. Use `--force` to ignore the lock when no other uv processes are running.

## Caching in Continuous Integration

It's common to cache package installation artifacts in CI to speed up subsequent runs. By default, uv caches both:

- Pre-built wheels downloaded directly from registries
- Wheels built from source distributions

In CI environments, it's often faster to omit pre-built wheels from the cache (re-download them each run) while caching wheels built from source (since building is expensive).

Use `uv cache prune --ci` to remove pre-built wheels and unzipped source distributions while retaining built-from-source wheels:

```bash
$ uv cache prune --ci
```

Run this at the end of CI jobs for maximum cache efficiency.

## Cache Directory

uv determines the cache directory in order:

1. A temporary cache directory, if `--no-cache` was requested
2. The directory specified via `--cache-dir`, `UV_CACHE_DIR`, or `tool.uv.cache-dir` in `pyproject.toml`
3. A system-appropriate default:
   - Unix: `$XDG_CACHE_HOME/uv` or `$HOME/.cache/uv`
   - Windows: `%LOCALAPPDATA%\uv\cache`

uv always requires a cache directory. When `--no-cache` is requested, uv still uses a temporary cache for sharing data within that single invocation.

In most cases, `--refresh` should be used instead of `--no-cache` — it updates the cache for subsequent operations but does not read from the cache.

### Performance Note

The cache directory should be on the same file system as the Python environment uv operates on. Otherwise, uv cannot link files from the cache into the environment and must fall back to slow copy operations.

## Forcing Revalidation

- **`--refresh`** — Force revalidation of cached data for all dependencies
- **`--refresh-package <name>`** — Force revalidation for a specific dependency
- **`--reinstall`** — Force reinstalling all packages (consider running `uv cache clean <package>` first)

```bash
$ uv sync --refresh
$ uv pip install --refresh-package ruff
$ uv sync --reinstall
```

As a special case, uv always rebuilds and reinstalls local directory dependencies passed explicitly on the command line (e.g., `uv pip install .`).

# Package Indexes — Configuration and Authentication

> **Source:** [https://docs.astral.sh/uv/concepts/indexes/](https://docs.astral.sh/uv/concepts/indexes/)

## Defining an Index

Add an additional index by including a `[[tool.uv.index]]` entry in `pyproject.toml`:

```toml
[[tool.uv.index]]
# Optional name for the index.
name = "pytorch"
# Required URL for the index.
url = "https://download.pytorch.org/whl/cpu"
```

Indexes are prioritized in the order they're defined — the first index listed is the first consulted when resolving dependencies. Command-line indexes take precedence over configuration file indexes.

### Default Index

By default, PyPI is included as the "default" index (used when a package is not found on any other index). To exclude PyPI, set `default = true` on another index:

```toml
[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
default = true
```

The default index is always treated as lowest priority, regardless of its position in the list.

### Index Names

Index names may only contain alphanumeric characters, dashes, underscores, and periods, and must be valid ASCII.

### Command-Line and Environment Variable Indexes

When providing an index on the command line or through environment variables, names are optional but can be included using `<name>=<url>` syntax:

```bash
# On the command line
$ uv lock --index pytorch=https://download.pytorch.org/whl/cpu

# Via an environment variable
$ UV_INDEX=pytorch=https://download.pytorch.org/whl/cpu uv lock
```

## Pinning a Package to an Index

Pin a specific package to a specific index using `tool.uv.sources`:

```toml
[tool.uv.sources]
torch = { index = "pytorch" }
```

## Searching Across Multiple Indexes

By default, uv uses the `first-index` strategy: it stops at the first index on which a package is available, and limits resolutions to versions present on that index. This prevents "dependency confusion" attacks.

To opt in to alternate behaviors, use `--index-strategy` or `UV_INDEX_STRATEGY`:

- **`first-index` (default)** — Search for each package across all indexes, limiting candidate versions to those present in the first index that contains the package.
- **`unsafe-first-match`** — Search across all indexes, but prefer the first index with a compatible version, even if newer versions exist on other indexes.
- **`unsafe-best-match`** — Search across all indexes and select the best version from the combined set. Closest to pip's behavior, but exposes users to dependency confusion attacks.

```bash
$ uv pip install --index-strategy unsafe-best-match ruff
```

## Authentication

Most private package indexes require authentication via username and password (or access token).

### Providing Credentials Directly

Include credentials in the index URL:

```toml
[[tool.uv.index]]
url = "https://user:password@example.com/simple"
```

Or use environment variables:

```bash
$ UV_INDEX_USERNAME=user UV_INDEX_PASSWORD=pass uv pip install ruff
```

For per-index credentials, prefix the environment variable with the index name (uppercased):

```bash
$ UV_INDEX_PYTORCH_USERNAME=user UV_INDEX_PYTORCH_PASSWORD=pass uv pip install torch
```

### Using Credential Providers

uv supports `netrc` files and the `keyring` library for credential management.

#### netrc

uv reads `~/.netrc` (or `%USERPROFILE%\_netrc` on Windows) for credentials:

```
machine example.com
login user
password pass
```

#### keyring

If `keyring` is installed in the environment, uv will use it to look up credentials for index URLs.

### Disabling Authentication

To disable authentication for an index:

```toml
[[tool.uv.index]]
name = "internal"
url = "https://example.com/simple"
authenticate = false
```

### Ignoring Error Codes

To ignore specific HTTP error codes during authentication:

```bash
$ uv pip install --index-strategy unsafe-best-match --ignore-errors 401 ruff
```

### Customizing Cache Control Headers

uv respects HTTP cache headers from indexes. For indexes that don't send proper cache headers, you can customize cache behavior:

```bash
$ UV_HTTP_TIMEOUT=30 uv pip install ruff
```

### Configuring exclude-newer for an Index

Limit an index to only considering distributions released before a specific date:

```toml
[[tool.uv.index]]
name = "internal"
url = "https://example.com/simple"
exclude-newer = "2024-01-01T00:00:00Z"
```

## Flat Indexes

Flat indexes (via `--find-links`) are directories or URLs containing direct links to package files. uv assumes flat index contents are immutable, caching each file by name. Replacing a file with new contents under the same name will not be picked up until the cache is refreshed.

```bash
$ uv pip install --find-links ./wheels/ ruff
```

## --index-url and --extra-index-url

For pip compatibility, uv supports `--index-url` and `--extra-index-url`:

```bash
$ uv pip install --index-url https://example.com/simple ruff
$ uv pip install --extra-index-url https://example.com/simple ruff
```

`--index-url` replaces the default index (PyPI). `--extra-index-url` adds an additional index alongside PyPI.

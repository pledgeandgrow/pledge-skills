# Reference — Settings, Environment Variables, and Resolver Options

> **Source:** [https://docs.astral.sh/uv/reference/settings/](https://docs.astral.sh/uv/reference/settings/) | [https://docs.astral.sh/uv/reference/environment/](https://docs.astral.sh/uv/reference/environment/)

## Configuration Hierarchy

uv reads configuration in order of precedence (highest to lowest):

1. **Command-line arguments** — e.g., `--cache-dir /tmp/cache`
2. **Environment variables** — e.g., `UV_CACHE_DIR=/tmp/cache`
3. **Project configuration** — `tool.uv` in `pyproject.toml`
4. **User configuration** — `uv.toml` or `pyproject.toml` in the user's config directory
5. **System configuration** — `uv.toml` in system directories

## Project Metadata Settings

### build-constraint-dependencies

Constraints for build dependencies of all packages:

```toml
[tool.uv]
build-constraint-dependencies = ["setuptools>=70"]
```

### conflicts

Declare conflicting groups/extras that cannot be activated together:

```toml
[tool.uv]
conflicts = [[{ extra = "asyncio" }, { extra = "trio" }]]
```

### constraint-dependencies

Constraints applied to all dependencies:

```toml
[tool.uv]
constraint-dependencies = ["pytz>=2024"]
```

### default-groups

Default groups to install when running `uv sync` without `--only-group` or `--no-default-groups`:

```toml
[tool.uv]
default-groups = ["dev", "test"]
```

### dependency-groups

PEP 735 dependency groups for development dependencies:

```toml
[tool.uv]
dependency-groups = { dev = ["pytest", "ruff"] }
```

### dev-dependencies

Legacy development dependencies (prefer `dependency-groups` instead):

```toml
[tool.uv]
dev-dependencies = ["pytest", "ruff"]
```

### environments

Environments for which the lockfile should be resolved:

```toml
[tool.uv]
environments = ["py3.10", "py3.11", "py3.12"]
```

### exclude-dependencies

Packages excluded from the lockfile:

```toml
[tool.uv]
exclude-dependencies = ["unnecessary-pkg"]
```

### index

Define additional package indexes:

```toml
[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
```

### managed

Whether the project is managed by uv (default: `true` for `uv init`):

```toml
[tool.uv]
managed = false
```

### override-dependencies

Override versions for dependencies:

```toml
[tool.uv]
override-dependencies = ["pytz==2024.1"]
```

### package

Whether the project should be built and installed as a package (default: `true`):

```toml
[tool.uv]
package = false
```

### required-environments

Environments that the lockfile must support:

```toml
[tool.uv]
required-environments = ["py3.12"]
```

### sources

Override source locations for dependencies:

```toml
[tool.uv.sources]
torch = { index = "pytorch" }
my-pkg = { path = "../my-pkg", editable = true }
```

### workspace

Define workspace membership:

```toml
[tool.uv.workspace]
members = ["packages/*"]
exclude = ["packages/legacy"]
```

## Configuration Settings

### add-bounds

Default version specifier when adding a dependency:

- `"lower"` (default) — e.g., `>=1.2.3`
- `"major"` — e.g., `>=1.2.3, <2.0.0`
- `"minor"` — e.g., `>=1.2.3, <1.3.0`
- `"exact"` — e.g., `==1.2.3`

```toml
[tool.uv]
add-bounds = "major"
```

### allow-insecure-host

Allow insecure connections to specified hosts (bypasses SSL verification):

```toml
[tool.uv]
allow-insecure-host = ["localhost:8080"]
```

### cache-dir

Path to the cache directory. Defaults to `$XDG_CACHE_HOME/uv` or `$HOME/.cache/uv` on Linux/macOS, `%LOCALAPPDATA%\uv\cache` on Windows:

```toml
[tool.uv]
cache-dir = "./.uv_cache"
```

### compile-bytecode

Compile Python files to bytecode after installation. Trades longer install times for faster start times:

```toml
[tool.uv]
compile-bytecode = true
```

### concurrent-builds

Max number of source distributions built concurrently (default: CPU cores):

```toml
[tool.uv]
concurrent-builds = 4
```

### concurrent-downloads

Max in-flight concurrent downloads (default: 50):

```toml
[tool.uv]
concurrent-downloads = 4
```

### concurrent-installs

Number of threads for installing and unzipping packages (default: CPU cores):

```toml
[tool.uv]
concurrent-installs = 4
```

### config-settings

Settings passed to PEP 517 build backends:

```toml
[tool.uv]
config-settings = { editable_mode = "compat" }
```

### config-settings-package

Per-package build backend settings:

```toml
[tool.uv]
config-settings-package = { numpy = { editable_mode = "compat" } }
```

### exclude-newer

Limit dependencies to those released before a date:

```toml
[tool.uv]
exclude-newer = "2024-01-01T00:00:00Z"
```

### exclude-newer-package

Per-package date limit:

```toml
[tool.uv]
exclude-newer-package = [{ package = "ruff", date = "2024-06-01" }]
```

### index-strategy

Strategy for resolving across multiple indexes:

- `"first-index"` (default) — Use first index that has the package
- `"unsafe-first-match"` — Search all indexes, prefer first with compatible version
- `"unsafe-best-match"` — Search all indexes, select best version (closest to pip behavior)

```toml
[tool.uv]
index-strategy = "unsafe-best-match"
```

### index-url

URL of the Python package index (default: `https://pypi.org/simple`). Deprecated, use `index` instead:

```toml
[tool.uv]
index-url = "https://test.pypi.org/simple"
```

### keyring-provider

Use keyring for index URL authentication:

```toml
[tool.uv]
keyring-provider = "subprocess"
```

### link-mode

Method for installing packages from cache:

- `"clone"` (default macOS/Linux) — Copy-on-Write
- `"copy"` — Full copy
- `"hardlink"` (default Windows) — Hard link
- `"symlink"` — Symbolic link (discouraged)

```toml
[tool.uv]
link-mode = "copy"
```

### native-tls

Deprecated. Use `system-certs` instead. Load TLS certificates from platform's native store:

```toml
[tool.uv]
native-tls = true
```

### no-binary

Don't install pre-built wheels. Build from source instead:

```toml
[tool.uv]
no-binary = true
```

### no-binary-package

Don't install pre-built wheels for specific packages:

```toml
[tool.uv]
no-binary-package = ["ruff"]
```

### no-build

Don't build source distributions. Reuse cached wheels only:

```toml
[tool.uv]
no-build = true
```

### no-build-isolation

Disable isolation when building source distributions. Assumes build deps are already installed:

```toml
[tool.uv]
no-build-isolation = true
```

### no-build-isolation-package

Disable build isolation for specific packages:

```toml
[tool.uv]
no-build-isolation-package = ["package1", "package2"]
```

### no-build-package

Don't build source distributions for specific packages:

```toml
[tool.uv]
no-build-package = ["ruff"]
```

### no-cache

Avoid reading from or writing to the cache:

```toml
[tool.uv]
no-cache = true
```

### no-index

Ignore all registry indexes, rely on direct URLs and `--find-links`:

```toml
[tool.uv]
no-index = true
```

### no-sources

Ignore the `tool.uv.sources` table when resolving:

```toml
[tool.uv]
no-sources = true
```

### python-downloads

Whether uv should allow Python downloads:

- `"automatic"` (default) — Allow automatic downloads
- `"manual"` — Only download when explicitly requested
- `"never"` — Never download

```toml
[tool.uv]
python-downloads = "manual"
```

### python-preference

Preference for managed vs system Python:

- `"managed"` — Prefer managed Python installations
- `"system"` — Prefer system Python installations
- `"only-managed"` — Only use managed Python
- `"only-system"` — Only use system Python

```toml
[tool.uv]
python-preference = "managed"
```

### required-version

Enforce a version requirement on uv itself:

```toml
[tool.uv]
required-version = ">=0.5.0"
```

### resolution

Strategy for selecting compatible versions:

- `"highest"` (default) — Latest compatible version
- `"lowest"` — Lowest compatible version
- `"lowest-direct"` — Lowest for direct deps, highest for transitive

```toml
[tool.uv]
resolution = "lowest-direct"
```

### system-certs

Load TLS certificates from platform's native certificate store instead of bundled Mozilla certs:

```toml
[tool.uv]
system-certs = true
```

### torch-backend

Backend for fetching PyTorch ecosystem packages:

- `"cpu"` — CPU-only index
- `"cu126"` — CUDA 12.6 index
- `"auto"` — Detect based on installed CUDA drivers

```toml
[tool.uv]
torch-backend = "auto"
```

### trusted-publishing

Configure trusted publishing for CI environments:

- `"automatic"` (default) — Check for trusted publishing in supported environments
- `"always"` — Always use trusted publishing
- `"never"` — Never use trusted publishing

```toml
[tool.uv]
trusted-publishing = "always"
```

### upgrade

Allow package upgrades, ignoring pinned versions:

```toml
[tool.uv]
upgrade = true
```

### upgrade-package

Allow upgrades for specific packages:

```toml
[tool.uv]
upgrade-package = ["ruff"]
```

### check-url

Check an index URL for existing files to skip duplicate uploads:

```toml
[tool.uv]
check-url = "https://test.pypi.org/simple"
```

### publish-url

URL of the upload endpoint for publishing:

```toml
[tool.uv]
publish-url = "https://upload.pypi.org/legacy/"
```

## Environment Variables

uv respects the following environment variables. Each corresponds to a command-line flag or setting.

### Cache and Performance

| Variable | Description |
|----------|-------------|
| `UV_CACHE_DIR` | Path to cache directory (`--cache-dir`) |
| `UV_COMPILE_BYTECODE` | Compile Python files to bytecode (`--compile-bytecode`) |
| `UV_COMPILE_BYTECODE_TIMEOUT` | Timeout (seconds) for bytecode compilation |
| `UV_CONCURRENT_BUILDS` | Max concurrent source distribution builds |
| `UV_CONCURRENT_CACHE_READS` | Threads for reading cached HTTP responses |
| `UV_CONCURRENT_DOWNLOADS` | Max in-flight concurrent downloads |
| `UV_CONCURRENT_INSTALLS` | Threads for installing and unzipping packages |
| `UV_NO_CACHE` | Avoid reading from or writing to the cache (`--no-cache`) |
| `UV_OFFLINE` | Disable network access (`--offline`) |

### Python Management

| Variable | Description |
|----------|-------------|
| `UV_PYTHON` | Python interpreter to use (`--python`) |
| `UV_PYTHON_BIN_DIR` | Directory for managed Python executable links |
| `UV_PYTHON_CACHE_DIR` | Directory for caching managed Python archives |
| `UV_PYTHON_CPYTHON_BUILD` | Pin CPython to a specific build version (e.g., `"20250814"`) |
| `UV_PYTHON_DOWNLOADS` | Allow Python downloads (`automatic`/`manual`/`never`) |
| `UV_PYTHON_DOWNLOADS_JSON_URL` | Override hardcoded Python installations list |
| `UV_PYTHON_GRAALPY_BUILD` | Pin GraalPy to a specific build version |
| `UV_PYTHON_INSTALL_BIN` | Whether to install Python executable into bin dir |
| `UV_PYTHON_INSTALL_DIR` | Directory for storing managed Python installations |
| `UV_PYTHON_INSTALL_MIRROR` | Mirror URL for CPython downloads |
| `UV_PYTHON_PREFERENCE` | Preference for managed vs system Python |
| `UV_PYPY_INSTALL_MIRROR` | Mirror URL for PyPy downloads |

### Project and Environment

| Variable | Description |
|----------|-------------|
| `UV_PROJECT` | Path to project directory (`--project`) |
| `UV_PROJECT_ENVIRONMENT` | Path to project virtual environment |
| `UV_NO_PROJECT` | Ignore project (`--no-project`) |
| `UV_NO_SYNC` | Skip updating the environment (`--no-sync`) |
| `UV_SYSTEM_PYTHON` | Use system Python (`--system`) |
| `UV_BREAK_SYSTEM_PACKAGES` | Allow conflicting with system packages |
| `UV_VENV_CLEAR` | Remove existing venv files (`--clear`) |
| `UV_VENV_RELOCATABLE` | Create relocatable venv (`--relocatable`) |
| `UV_VENV_SEED` | Install seed packages (pip, setuptools, wheel) |
| `UV_FROZEN` | Use frozen lockfile (`--frozen`) |
| `UV_LOCKED` | Assert lockfile is up to date (`--locked`) |

### Indexes and Authentication

| Variable | Description |
|----------|-------------|
| `UV_INDEX` | Additional index URL (supports `name=url` format) |
| `UV_INDEX_STRATEGY` | Search strategy (`first-index`/`unsafe-first-match`/`unsafe-best-match`) |
| `UV_INDEX_URL` | Primary index URL (`--index-url`) |
| `UV_EXTRA_INDEX_URL` | Extra index URL (`--extra-index-url`) |
| `UV_DEFAULT_INDEX` | Default index URL |
| `UV_INDEX_{name}_USERNAME` | Per-index username (uppercased index name) |
| `UV_INDEX_{name}_PASSWORD` | Per-index password (uppercased index name) |
| `UV_KEYRING_PROVIDER` | Use keyring for authentication (`subprocess`/`disabled`) |
| `UV_FIND_LINKS` | Flat index locations (`--find-links`) |
| `UV_NO_INDEX` | Ignore all registry indexes |

### Dependencies and Resolution

| Variable | Description |
|----------|-------------|
| `UV_CONSTRAINT` | Constraints file (`--constraints`) |
| `UV_OVERRIDE` | Overrides file (`--overrides`) |
| `UV_BUILD_CONSTRAINT` | Build constraints file (`--build-constraints`) |
| `UV_PRERELEASE` | Allow pre-release versions (`--prerelease`) |
| `UV_RESOLUTION` | Resolution strategy (`highest`/`lowest`/`lowest-direct`) |
| `UV_NO_SOURCES` | Ignore `tool.uv.sources` table (`--no-sources`) |
| `UV_NO_SOURCES_PACKAGE` | Ignore sources for specific packages |
| `UV_NO_VERIFY_HASHES` | Disable hash verification |
| `UV_REQUIRE_HASHES` | Require hash verification |

### Publishing

| Variable | Description |
|----------|-------------|
| `UV_PUBLISH_TOKEN` | Token for publishing (`--token`) |
| `UV_PUBLISH_USERNAME` | Username for publishing (`--username`) |
| `UV_PUBLISH_PASSWORD` | Password for publishing (`--password`) |
| `UV_PUBLISH_URL` | Upload endpoint URL (`--publish-url`) |
| `UV_PUBLISH_INDEX` | Named index for publishing (`--index`) |
| `UV_PUBLISH_CHECK_URL` | Check for existing files before upload (`--check-url`) |
| `UV_PUBLISH_NO_ATTESTATIONS` | Skip uploading attestations |
| `UV_TRUSTED_PUBLISHING` | Trusted publishing mode (`automatic`/`always`/`never`) |

### Tools

| Variable | Description |
|----------|-------------|
| `UV_TOOL_DIR` | Directory for managed tools |
| `UV_TOOL_BIN_DIR` | Bin directory for tool executables |

### Network and TLS

| Variable | Description |
|----------|-------------|
| `UV_HTTP_TIMEOUT` | HTTP request timeout |
| `UV_HTTP_CONNECT_TIMEOUT` | HTTP connect timeout |
| `UV_HTTP_RETRIES` | HTTP retry count |
| `UV_REQUEST_TIMEOUT` | General request timeout |
| `UV_UPLOAD_HTTP_TIMEOUT` | Upload HTTP timeout (default: 900s) |
| `UV_NATIVE_TLS` | Use platform TLS certificates (deprecated, use `UV_SYSTEM_CERTS`) |
| `UV_SYSTEM_CERTS` | Load TLS certs from platform's native store |
| `UV_INSECURE_HOST` | Allow insecure connections to hosts |
| `UV_HTTP_PROXY` | HTTP proxy URL |
| `UV_HTTPS_PROXY` | HTTPS proxy URL |
| `UV_NO_PROXY` | Hosts to exclude from proxying |

### Configuration and Misc

| Variable | Description |
|----------|-------------|
| `UV_CONFIG_FILE` | Path to `uv.toml` config file |
| `UV_NO_SYSTEM_CONFIG` | Don't read system-level config files |
| `UV_NO_MODIFY_PATH` | Don't modify shell PATH |
| `UV_REQUIRED_VERSION` | Enforce uv version requirement |
| `UV_PREVIEW` | Enable preview mode |
| `UV_PREVIEW_FEATURES` | Enable specific preview features |
| `UV_LOCK_TIMEOUT` | Timeout for lock file operations (default: 5 min) |
| `UV_NO_WRAP` | Disable line wrapping for diagnostics |
| `UV_STACK_SIZE` | Stack size in bytes (default: 4MB) |
| `UV_WORKING_DIR` | Working directory (`--directory`) |
| `UV_INSTALL_DIR` | Installation directory for uv itself |
| `UV_UNMANAGED_INSTALL` | Install uv without modifying shell profiles |
| `UV_TORCH_BACKEND` | PyTorch backend (`cpu`/`cu126`/`auto`) |
| `UV_GIT_LFS` | Enable Git LFS for Git dependencies |
| `UV_GITHUB_TOKEN` | GitHub token for authentication |

### Externally Defined Variables

uv also respects standard environment variables from the system and other tools:

- `PATH` — System path for discovering Python interpreters
- `HOME` / `USERPROFILE` — User home directory
- `VIRTUAL_ENV` — Active virtual environment path
- `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` / `NO_PROXY` — Proxy settings
- `SSL_CERT_FILE` / `SSL_CERT_DIR` / `SSL_CLIENT_CERT` — TLS certificates
- `NETRC` — Path to netrc file for credentials
- `XDG_CACHE_HOME` / `XDG_CONFIG_HOME` / `XDG_DATA_HOME` — XDG directories
- `LOCALAPPDATA` — Windows local app data directory
- `NO_COLOR` / `FORCE_COLOR` / `CLICOLOR_FORCE` — Color output control
- `PAGER` — Pager for output
- `RUST_LOG` / `RUST_BACKTRACE` — Rust logging and backtraces

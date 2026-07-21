# uv — Extremely Fast Python Package & Project Manager

> **Version:** uv 0.11.x | **Source:** [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

uv is an extremely fast Python package and project manager, written in Rust. It serves as a single tool to replace pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv, and more. It provides comprehensive project management with a universal lockfile, runs scripts with inline dependency metadata, installs and manages Python versions, runs and installs CLI tools, includes a pip-compatible interface, supports Cargo-style workspaces, and is disk-space efficient with a global cache for dependency deduplication.

## Key Benefits

- **10-100x faster** than pip — written in Rust
- **Single tool** — replaces pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv
- **Universal lockfile** — cross-platform `uv.lock` for reproducible installations
- **Project management** — `uv init`, `uv add`, `uv sync`, `uv lock`, `uv run`, `uv build`, `uv publish`
- **Script execution** — inline dependency metadata (PEP 723), `uv run` with `--with` for ephemeral deps
- **Python version management** — install, pin, and switch between Python versions
- **Tool management** — `uvx` / `uv tool run` for ephemeral tools, `uv tool install` for persistent
- **Pip-compatible interface** — drop-in replacement for `pip install`, `pip compile`, `pip sync`
- **Workspaces** — Cargo-style workspaces for scalable multi-package projects
- **Global cache** — deduplication of dependencies across projects
- **Cross-platform** — macOS, Linux, and Windows
- **No Rust or Python required** — installable via curl or pip

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | Installation (standalone, PyPI, Homebrew, WinGet, Scoop, Docker, Cargo), first steps, features overview, upgrading, shell autocompletion, uninstallation |
| `projects.md` | Creating projects, project structure (pyproject.toml, .python-version, .venv, uv.lock), managing dependencies (standard, optional, dev groups, sources, editable, build deps), project config (requires-python, entry points, build systems, packaging), workspaces, building and publishing |
| `scripts.md` | Running scripts without/with dependencies, inline script metadata (PEP 723), declaring script deps with uv add --script, shebang executables, alternative indexes, locking script deps, reproducibility with exclude-newer, Python versions, GUI scripts (.pyw) |
| `tools.md` | Running tools with uvx, --from for package name differences, version selection (@version, --from), extras, alternative sources (git, branches, tags, commits), plugins with --with, installing tools, upgrading tools, Python versions, legacy Windows scripts |
| `python-versions.md` | Managed vs system Python, requesting versions (--python, version formats), installing Python, viewing and finding Python, automatic downloads, discovery rules, project Python versions, pinning, upgrading, pre-releases, free-threaded Python, PyPy, distributions |
| `pip-interface.md` | Creating virtual environments, using arbitrary environments, environment discovery, installing packages (PyPI, git, local, editable), installing from files (requirements.txt, pyproject.toml, extras, groups), uninstalling, locking with uv pip compile, syncing with uv pip sync, constraints, build constraints, overrides, inspecting environments (list, show, check, tree, freeze), declaring dependencies (pyproject.toml, requirements.in), pip compatibility differences |
| `indexes.md` | Defining indexes ([[tool.uv.index]]), index priority, default index, pinning packages to indexes, search strategies (first-index, unsafe-first-match, unsafe-best-match), authentication (credentials, providers), flat indexes, --index-url and --extra-index-url |
| `caching.md` | Dependency caching semantics (registry, URL, git, local, flat indexes), cache safety, clearing cache (clean, prune, prune --ci), caching in CI, cache directory location, --refresh and --reinstall |
| `docker.md` | Available images (distroless, debian, alpine), installing uv in Docker (copy binary, installer), installing projects, using the environment, bytecode compilation, cache mounts, intermediate layers, non-editable installs, pip interface in Docker, image provenance |
| `ci-integrations.md` | GitHub Actions (setup-uv, Python setup, matrix, syncing, caching, uv pip, private repos, trusted publishing), GitLab CI/CD |
| `git-auth.md` | SSH authentication, HTTP authentication, persistence of credentials, --raw option, Git credential helpers, gh CLI |
| `reference.md` | Configuration hierarchy, project metadata settings, configuration settings (add-bounds, cache-dir, compile-bytecode, concurrent-*, index-strategy, link-mode, no-binary, no-build, python-downloads, resolution, system-certs, torch-backend, trusted-publishing, upgrade), environment variables reference (cache, Python, project, indexes, deps, publishing, tools, network, config) |
| `integrations.md` | Jupyter (within project, kernels, standalone, non-project, VS Code), marimo (standalone, inline script metadata, within project, non-project, running as scripts) |
| `authentication.md` | HTTP credentials (netrc, uv credentials store, native storage preview, keyring providers, persistence), TLS certificates (rustls backend, system certs, custom certs with SSL_CERT_FILE/SSL_CERT_DIR/SSL_CLIENT_CERT, insecure hosts), uv auth CLI (login, logout, token, helper, storage backend), third-party services (Azure, Google, AWS, JFrog, Hugging Face HF_TOKEN) |
| `resolution.md` | Dependency resolution concepts (direct vs transitive, platform markers, platform-specific vs universal resolution, limited/required environments, dependency preferences, resolution strategies, pre-release handling, multi-version resolution with fork-strategy, constraints, overrides, exclusions, reproducible resolutions with exclude-newer) |
| `cli-reference.md` | Full CLI reference (uv auth, run, init, add, remove, version, sync, lock, export, tree, format, check, audit, tool, python, pip, venv, build, publish, workspace, cache, self, help, global options) |
| `preview.md` | Preview features (enabling with --preview/UV_PREVIEW/--preview-features, available features list including add-bounds, centralized-project-envs, json-output, pylock, native-auth, auth-helper, malware-check, etc., disabling with --no-preview) |
| `policies.md` | Versioning policies (crate versioning, cache versioning, lockfile versioning), project structure and files (pyproject.toml, project environment .venv, centralized environments preview, uv.lock lockfile, pylock.toml PEP 751 relationship) |

## Quick Start

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a new project
uv init example
cd example
uv add ruff
uv run ruff check

# Run a script with dependencies
uv run --with rich example.py

# Run a tool
uvx pycowsay 'hello world!'

# Install Python versions
uv python install 3.10 3.11 3.12

# Use the pip interface
uv venv
uv pip install flask
uv pip compile requirements.in -o requirements.txt
uv pip sync requirements.txt
```

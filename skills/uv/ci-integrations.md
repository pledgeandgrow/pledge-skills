# CI Integrations — GitHub Actions and GitLab CI/CD

> **Source:** [https://docs.astral.sh/uv/guides/integration/github/](https://docs.astral.sh/uv/guides/integration/github/)

## GitHub Actions

### Installation

Use the official [astral-sh/setup-uv](https://github.com/astral-sh/setup-uv) action to install uv, add it to PATH, and optionally persist the cache:

```yaml
name: Example
jobs:
  uv-example:
    name: python
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Install uv
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
```

Pin to a specific uv version:

```yaml
      - name: Install uv
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
        with:
          version: "0.11.30"
```

### Setting up Python

Install Python via uv (respects the project's pinned version):

```yaml
      - name: Set up Python
        run: uv python install
```

Or use the official `setup-python` action (faster, GitHub caches Python versions):

```yaml
      - name: "Set up Python"
        uses: actions/setup-python@v6
        with:
          python-version-file: ".python-version"
      - name: Install uv
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
```

Use `pyproject.toml` instead of `.python-version` to use the latest compatible version:

```yaml
      - name: "Set up Python"
        uses: actions/setup-python@v6
        with:
          python-version-file: "pyproject.toml"
```

### Multiple Python Versions

Use a matrix strategy with `setup-uv`'s `python-version` input:

```yaml
jobs:
  build:
    name: continuous-integration
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v7
      - name: Install uv and set the Python version
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
        with:
          python-version: ${{ matrix.python-version }}
```

Without `setup-uv`, set `UV_PYTHON`:

```yaml
    env:
      UV_PYTHON: ${{ matrix.python-version }}
```

### Syncing and Running

```yaml
      - name: Install the project
        run: uv sync --locked --all-extras --dev
      - name: Run tests
        run: uv run pytest tests
```

Use `UV_PROJECT_ENVIRONMENT` to install to the system Python instead of creating a virtual environment.

### Caching

**Built-in caching via setup-uv:**

```yaml
      - name: Enable caching
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
        with:
          enable-cache: true
```

**Manual caching with actions/cache:**

```yaml
jobs:
  install_job:
    env:
      UV_CACHE_DIR: /tmp/.uv-cache
    steps:
      # ... setup Python and uv ...
      - name: Restore uv cache
        uses: actions/cache@v6
        with:
          path: /tmp/.uv-cache
          key: uv-${{ runner.os }}-${{ hashFiles('uv.lock') }}
          restore-keys: |
            uv-${{ runner.os }}-${{ hashFiles('uv.lock') }}
            uv-${{ runner.os }}
      # ... install packages, run tests, etc ...
      - name: Minimize uv cache
        run: uv cache prune --ci
```

Use `requirements.txt` instead of `uv.lock` in the cache key when using `uv pip`.

**Self-hosted runners:** Move cache inside the GitHub Workspace to avoid unbounded growth:

```yaml
    env:
      UV_CACHE_DIR: ${{ github.workspace }}/.cache/uv
```

Clean up with a post-job hook script (`uv cache clean`).

### Using uv pip

uv requires a virtual environment by default. Use `--system` or `UV_SYSTEM_PYTHON` to install into the system environment:

```yaml
# Opt-in for the entire workflow
env:
  UV_SYSTEM_PYTHON: 1

# Opt-in for a specific job
jobs:
  install_job:
    env:
      UV_SYSTEM_PYTHON: 1

# Opt-in for a specific step
steps:
  - name: Install requirements
    run: uv pip install -r requirements.txt
    env:
      UV_SYSTEM_PYTHON: 1
```

Use `--no-system` to opt out for individual invocations.

### Private Repositories

Configure a personal access token (PAT) for private GitHub dependencies:

```yaml
steps:
  - name: Register the personal access token
    run: echo "${{ secrets.MY_PAT }}" | gh auth login --with-token
  - name: Configure the Git credential helper
    run: gh auth setup-git
```

### Publishing to PyPI

Use trusted publishing (no credentials needed):

```yaml
name: "Publish release to PyPI"
on:
  push:
    tags:
      - v*
jobs:
  run:
    runs-on: ubuntu-latest
    environment: name: pypi
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install uv
        uses: astral-sh/setup-uv@08807647e7069bb48b6ef5acd8ec9567f424441b # v8.1.0
      - name: Install Python 3.13
        run: uv python install 3.13
      - name: Build
        run: uv build
      - name: Smoke test (wheel)
        run: uv run --isolated --no-project --with dist/*.whl tests/smoke_test.py
      - name: Smoke test (source distribution)
        run: uv run --isolated --no-project --with dist/*.tar.gz tests/smoke_test.py
      - name: Publish
        run: uv publish
```

Create the `pypi` environment in GitHub repository settings, then add a trusted publisher on PyPI. Tag a release:

```bash
$ git tag -a v0.1.0 -m v0.1.0
$ git push --tags
```

## GitLab CI/CD

uv supports trusted publishing in GitLab CI/CD. Key environment variables:

- `UV_PUBLISH_TOKEN` — Token for publishing
- `UV_TRUSTED_PUBLISHING` — Set to `always` to force trusted publishing

Use uv in `.gitlab-ci.yml`:

```yaml
stages:
  - test

test:
  image: ghcr.io/astral-sh/uv:python
  script:
    - uv sync --locked --all-extras --dev
    - uv run pytest tests
```

Cache the uv cache directory:

```yaml
test:
  cache:
    key: uv-${CI_COMMIT_REF_SLUG}
    paths:
      - .uv-cache
  variables:
    UV_CACHE_DIR: .uv-cache
  script:
    - uv sync --locked
    - uv run pytest tests
    - uv cache prune --ci
```

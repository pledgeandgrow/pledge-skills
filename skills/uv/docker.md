# Using uv in Docker

> **Source:** [https://docs.astral.sh/uv/guides/integration/docker/](https://docs.astral.sh/uv/guides/integration/docker/)

uv provides both distroless Docker images (useful for copying uv binaries into your own builds) and images derived from popular base images (useful for running uv in a container).

## Available Images

- **Distroless:** `ghcr.io/astral-sh/uv:latest` — contains only uv binaries
- **Debian:** `ghcr.io/astral-sh/uv:debian` — Debian-based with uv pre-installed
- **Alpine:** `ghcr.io/astral-sh/uv:alpine` — Alpine-based with uv pre-installed
- **Python:** `ghcr.io/astral-sh/uv:python` — Python base with uv pre-installed

Run uv in a container:

```bash
$ docker run --rm -it ghcr.io/astral-sh/uv:debian uv --help
```

## Installing uv in Docker

### Copy Binary from Distroless Image

```dockerfile
FROM python:3.12-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
```

Pin to a specific version:

```dockerfile
COPY --from=ghcr.io/astral-sh/uv:0.11.30 /uv /uvx /bin/
```

Pin to a specific SHA256 (best practice for reproducible builds):

```dockerfile
COPY --from=ghcr.io/astral-sh/uv@sha256:2381d6aa60c326b71fd40023f921a0a3b8f91b14d5db6b90402e65a635053709 /uv /uvx /bin/
```

### Install via Installer Script

```dockerfile
FROM python:3.12-slim-trixie

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh

ENV PATH="/root/.local/bin/:$PATH"
```

Pin to a specific version:

```dockerfile
ADD https://astral.sh/uv/0.11.30/install.sh /uv-installer.sh
```

## Installing a Project

```dockerfile
# Copy the project into the image
COPY . /app

# Disable development dependencies
ENV UV_NO_DEV=1

# Sync the project into a new environment, asserting the lockfile is up to date
WORKDIR /app
RUN uv sync --locked
```

Add `.venv` to a `.dockerignore` file to prevent the local virtual environment from being included in image builds.

Start the application:

```dockerfile
CMD ["uv", "run", "my_app"]
```

## Using the Environment

Activate the project virtual environment by placing its binary directory at the front of the path:

```dockerfile
ENV PATH="/app/.venv/bin:$PATH"
```

Or use `uv run` for commands that require the environment:

```dockerfile
RUN uv run some_script.py
```

Alternatively, set `UV_PROJECT_ENVIRONMENT` to install to the system Python environment and skip activation:

```dockerfile
ENV UV_PROJECT_ENVIRONMENT=/usr/local
RUN uv sync --locked
```

## Optimizations

### Compiling Bytecode

Bytecode compilation improves startup time at the cost of increased installation time and image size:

```dockerfile
RUN uv python install --compile-bytecode
RUN uv sync --compile-bytecode
```

Or set the environment variable for all commands:

```dockerfile
ENV UV_COMPILE_BYTECODE=1
```

### Caching

Use a cache mount to improve performance across builds:

```dockerfile
ENV UV_LINK_MODE=copy
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync
```

`UV_LINK_MODE=copy` silences warnings about not being able to link files since the cache and sync target are on separate file systems.

Cache managed Python installations:

```dockerfile
ENV UV_PYTHON_CACHE_DIR=/root/.cache/uv/python
RUN --mount=type=cache,target=/root/.cache/uv \
    uv python install
```

Set a constant cache directory:

```dockerfile
ENV UV_CACHE_DIR=/opt/uv-cache/
```

If not mounting the cache, reduce image size with `--no-cache`:

```dockerfile
ENV UV_NO_CACHE=1
```

### Intermediate Layers

Separate dependency installation from the project itself to improve Docker build times:

```dockerfile
# Install dependencies first (cached layer)
COPY uv.lock pyproject.toml ./
RUN uv sync --locked --no-install-project

# Then copy the project and install it
COPY . .
RUN uv sync --locked
```

### Non-Editable Installs

Use non-editable installs in Docker for reproducibility:

```dockerfile
RUN uv sync --locked --no-editable
```

### Using uv Temporarily

If you only need uv for the build and not in the final image, use a multi-stage build:

```dockerfile
FROM ghcr.io/astral-sh/uv:latest AS uv

FROM python:3.12-slim-trixie
COPY --from=uv /uv /uvx /bin/
# ... build steps ...
# uv binary can be removed in final stage if not needed
```

## Using the pip Interface in Docker

### Installing a Package

```dockerfile
RUN uv pip install --system flask
```

### Installing Requirements

```dockerfile
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt
```

### Installing a Project

```dockerfile
COPY . /app
WORKDIR /app
RUN uv pip install --system .
```

## Verifying Image Provenance

uv's Docker images are signed and can be verified using cosign. Check the Astral documentation for current verification instructions.

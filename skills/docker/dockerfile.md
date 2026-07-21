# Dockerfile Reference

## Basic Structure

```dockerfile
# Comment
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

## Instructions

### FROM — Base Image

```dockerfile
# Official image
FROM node:22
FROM node:22-alpine
FROM node:22-slim
FROM ubuntu:24.04

# Specific digest (reproducible)
FROM node:22-alpine@sha256:abc123...

# Multi-stage build (named builder)
FROM node:22-alpine AS builder

# Scratch — empty image for static binaries
FROM scratch
COPY myapp /myapp
ENTRYPOINT ["/myapp"]
```

### Image Variants

| Variant | Size | Use Case |
|---------|------|----------|
| `full` (default) | ~1GB | Full OS, all tools |
| `slim` | ~200MB | Minimal Debian, no docs |
| `alpine` | ~50-80MB | Alpine Linux, musl libc |
| `scratch` | 0MB | Empty, for static binaries |

### WORKDIR — Working Directory

```dockerfile
WORKDIR /app
# Creates /app if it doesn't exist
# All subsequent commands run in /app
# Can be relative (from previous WORKDIR)
WORKDIR src
# Now in /app/src
```

### COPY — Copy Files

```dockerfile
# Copy a file
COPY package.json ./

# Copy multiple files
COPY package.json package-lock.json ./

# Copy a directory
COPY src/ ./src/

# Copy with ownership
COPY --chown=node:node . .

# Copy from a URL (deprecated, use RUN curl instead)
# COPY from another stage
COPY --from=builder /app/dist ./dist

# Copy from a named stage
COPY --from=builder /app/build /app/build

# Copy with --link (layer optimization, doesn't depend on previous layers)
COPY --link . .

# Copy with --chmod (set permissions at copy time)
COPY --chmod=755 ./entrypoint.sh /entrypoint.sh

# Copy with --parents (preserve directory structure)
COPY --parents ./x/a.txt ./y/a.txt /dest/
# Result: /dest/x/a.txt, /dest/y/a.txt (not /dest/a.txt)

# Copy with --exclude (skip matching files)
COPY --exclude=*.txt --exclude=*.md ./src/ ./dest/

# Copy with --parents and wildcard
COPY --parents ./src/**/*.txt /dest/
# Preserves full directory tree for matched files
```

### ADD — Copy with Features

```dockerfile
# ADD can extract tarballs and fetch URLs
# Prefer COPY for simple file copying

# Extract a tarball
ADD archive.tar.gz /opt/

# Fetch from URL (use RUN curl instead for better caching)
ADD https://example.com/file.txt /tmp/

# ADD with --chown
ADD --chown=node:node src/ ./src/

# ADD from Git repository (BuildKit)
ADD https://github.com/user/repo.git#main /app

# ADD with --keep-git-dir (preserve .git directory)
ADD --keep-git-dir=true https://github.com/user/repo.git#v1.0 /app

# ADD with --checksum (verify integrity)
ADD --checksum=sha256:24454f830cdb571e2c4ad15481119c43b3cafd48dd869a9b2945d1036d1dc68d \
    https://example.com/file.tar.gz /opt/

# ADD with --unpack (extract without tar)
ADD --unpack=true archive.tar.gz /opt/

# ADD with --chmod and --chown
ADD --chmod=755 --chown=node:node script.sh /usr/local/bin/
```

### RUN — Execute Commands

```dockerfile
# Shell form
RUN apt-get update && apt-get install -y curl git

# Exec form (preferred for predictable behavior)
RUN ["apt-get", "install", "-y", "curl"]

# Chain commands to reduce layers
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git vim \
    && rm -rf /var/lib/apt/lists/*

# Use --mount=type=cache for build caching (BuildKit)
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y curl

# Use --mount=type=bind for temporary files
RUN --mount=type=bind,source=package.json,target=/tmp/package.json \
    cat /tmp/package.json

# Secret mount (not stored in image layers)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci

# SSH mount (for private repos)
RUN --mount=type=ssh \
    git clone git@github.com:user/repo.git

# tmpfs mount (temporary filesystem in RAM)
RUN --mount=type=tmpfs,target=/tmp \
    ./build.sh

# RUN --network (control network during build)
RUN --network=none npm ci          # no network (reproducible)
RUN --network=default npm ci       # default network
RUN --network=host npm ci          # host network

# RUN --security (run in sandbox)
RUN --security=insecure cat /proc/self/status  # full privileges
RUN --security=sandbox cat /proc/self/status   # sandboxed

# RUN --device (access devices during build)
RUN --device=nvidia.com/gpu=all ./train_model.sh
```

### Here-Documents (BuildKit)

```dockerfile
# syntax=docker/dockerfile:1

# Multi-line script with here-doc
RUN <<EOT bash
set -ex
apt-get update
apt-get install -y vim
EOT

# Default shell (no interpreter specified)
RUN <<EOT
mkdir -p foo/bar
EOT

# With shebang (custom interpreter)
RUN <<EOT
#!/usr/bin/env python
print("hello world")
EOT

# Create inline files with COPY + here-doc
COPY <<EOF greeting.txt
hello world
EOF

# With variable expansion
ARG FOO=bar
COPY <<-EOT /script.sh
echo "hello ${FOO}"
EOT

# Quoted delimiter (no expansion — deferred to runtime)
COPY <<"EOT" /script.sh
echo "hello ${FOO}"
EOT
# docker run -e FOO=world myapp → "hello world"

# Multiple here-docs in one RUN
RUN <<FILE1 cat > file1 && <<FILE2 cat > file2
I am first
FILE1
I am second
FILE2
```

### CMD — Default Command

```dockerfile
# Exec form (preferred)
CMD ["node", "server.js"]
CMD ["node", "server.js", "--port", "3000"]

# Shell form (runs in /bin/sh -c)
CMD node server.js

# As parameters for ENTRYPOINT
ENTRYPOINT ["node"]
CMD ["server.js"]
# docker run myapp → node server.js
# docker run myapp --inspect → node server.js --inspect
```

### ENTRYPOINT — Fixed Command

```dockerfile
# Exec form (preferred)
ENTRYPOINT ["node", "server.js"]

# Shell form (signal handling issues)
ENTRYPOINT node server.js

# With CMD as arguments
ENTRYPOINT ["node"]
CMD ["server.js"]

# Override entrypoint at runtime
docker run --entrypoint sh myapp
```

### EXPOSE — Document Port

```dockerfile
# Document which ports the container listens on
EXPOSE 3000
EXPOSE 80 443

# Note: EXPOSE does NOT publish the port
# Use -p at runtime or ports in Compose
docker run -p 3000:3000 myapp
```

### ENV — Environment Variables

```dockerfile
# Set environment variable
ENV NODE_ENV=production
ENV API_URL=https://api.example.com

# Multiple in one line
ENV NODE_ENV=production PORT=3000

# Persist in image and container
# Available during build and runtime

# ARG vs ENV:
# ARG — build-time only, not in final image
# ENV — build-time and runtime
```

### ARG — Build-Time Variables

```dockerfile
# Define build argument
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine

ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}

# Use at build time
# docker build --build-arg APP_VERSION=2.0.0 -t myapp .

# Predefined ARGs
ARG HTTP_PROXY
ARG HTTPS_PROXY
```

### VOLUME — Declare Mount Points

```dockerfile
# Declare anonymous volume mount points
VOLUME /data
VOLUME ["/data", "/logs"]

# At runtime, Docker creates anonymous volumes
# Better: use named volumes in Compose
```

### USER — Run as Non-Root

```dockerfile
# Create and switch to non-root user
RUN groupadd -r app && useradd -r -g app app
USER app

# With UID/GID (more portable)
RUN addgroup -S app && adduser -S -G app app
USER 1001:1001

# Node.js images often have a 'node' user
FROM node:22-alpine
USER node
```

### HEALTHCHECK — Container Health

```dockerfile
# Basic health check
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1

# With options
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Disable health check from base image
HEALTHCHECK NONE

# Exit codes:
# 0 = healthy, 1 = unhealthy, 2 = reserved
```

### LABEL — Metadata

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0.0"
LABEL description="My web application"
LABEL org.opencontainers.image.source="https://github.com/user/repo"
LABEL org.opencontainers.image.licenses="MIT"

# View labels
docker inspect --format='{{json .Config.Labels}}' myapp
```

### STOPSIGNAL — Stop Signal

```dockerfile
# Default is SIGTERM
STOPSIGNAL SIGQUIT

# Useful for apps that handle specific signals
```

### SHELL — Default Shell

```dockerfile
# Change default shell for RUN (shell form)
SHELL ["/bin/bash", "-c"]

# Windows example
SHELL ["powershell", "-Command"]
```

### ONBUILD — Trigger Instructions (Deprecated)

```dockerfile
# Runs when image is used as base for another build
# Avoid using — deprecated in newer Docker versions
ONBUILD COPY . /app
ONBUILD RUN npm install
```

## Multi-Stage Builds

### Basic Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Multiple Stages

```dockerfile
# Stage 1: Build frontend
FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/ .
RUN npm ci && npm run build

# Stage 2: Build backend
FROM golang:1.23-alpine AS backend
WORKDIR /app
COPY backend/ .
RUN go build -o server

# Stage 3: Final image
FROM alpine:3.20
COPY --from=backend /app/server /usr/local/bin/
COPY --from=frontend /app/dist /var/www/html
RUN adduser -D app
USER app
EXPOSE 8080
CMD ["server"]
```

### Named Stage Selection

```dockershell
# Build only up to a specific stage
docker build --target builder -t myapp:builder .

# Use in Dockerfile
FROM myapp:builder AS test
RUN npm test
```

### Multi-Platform Builds

```dockerfile
# Dockerfile that works on multiple architectures
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH
RUN echo "Building on $BUILDPLATFORM for $TARGETPLATFORM"

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

## BuildKit Features

```dockerfile
# syntax directive (must be first line)
# syntax=docker/dockerfile:1.7

# Cache mounts (persist package manager cache)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update && apt-get install -y curl

# Cache mount for npm
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Cache mount for pip
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Secret mounts (no leaked secrets in layers)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci

# SSH mounts (for private repos)
RUN --mount=type=ssh \
    git clone git@github.com:org/repo.git

# Bind mount (read-only, no copy to layer)
RUN --mount=type=bind,source=.,target=/src \
    cp /src/config.json /app/config.json
```

## Build Args and ENV Patterns

```dockerfile
# Pattern: configurable base image
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine

# Pattern: configurable environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Pattern: version embedding
ARG GIT_COMMIT=unknown
ARG BUILD_DATE=unknown
LABEL git-commit=${GIT_COMMIT} build-date=${BUILD_DATE}
ENV GIT_COMMIT=${GIT_COMMIT}
```

```bash
# Build with args
docker build \
  --build-arg NODE_VERSION=20 \
  --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
  -t myapp:latest .
```

## .dockerignore

```
# Version control
.git
.gitignore

# Dependencies (will be copied separately)
node_modules

# Build artifacts
dist
build
*.o
*.so

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode
.idea
*.swp

# Logs
*.log
logs/

# Documentation
*.md
docs/

# Test files
test
tests
coverage
__tests__

# Docker files
Dockerfile
docker-compose*.yml
.dockerignore
```

## Common Dockerfile Patterns

### Node.js Application

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget --spider -q http://localhost:3000/health
CMD ["node", "server.js"]
```

### Python Application

```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m app
USER app
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

### Go Application (Multi-Stage)

```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server -ldflags="-s -w" .

FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/server"]
```

### Rust Application (Multi-Stage)

```dockerfile
FROM rust:1.82 AS builder
WORKDIR /app
COPY Cargo.* ./
RUN cargo build --release || true
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/myapp /usr/local/bin/
CMD ["myapp"]
```

### Java / Spring Boot

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre-alpine
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

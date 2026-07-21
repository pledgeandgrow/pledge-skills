# Docker Best Practices

## Image Optimization

### Use Small Base Images

```dockerfile
# Bad — full image (~1GB)
FROM node:22

# Better — slim (~200MB)
FROM node:22-slim

# Best — alpine (~80MB)
FROM node:22-alpine

# Smallest — distroless (~50MB)
FROM gcr.io/distroless/nodejs22

# Absolute smallest — scratch (for static binaries)
FROM scratch
COPY myapp /myapp
ENTRYPOINT ["/myapp"]
```

### Multi-Stage Builds

```dockerfile
# Stage 1: Build (large, has build tools)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (small, only runtime)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# No build tools, no source code, no node_modules
```

### Layer Caching

```dockerfile
# Bad — copy everything first (cache busts on any change)
COPY . .
RUN npm ci
RUN npm run build

# Good — copy dependencies first (cached unless deps change)
COPY package*.json ./
RUN npm ci          # cached if package.json unchanged
COPY . .            # only this layer busts on code change
RUN npm run build
```

### Combine RUN Commands

```dockerfile
# Bad — multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# Good — single layer
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git \
    && rm -rf /var/lib/apt/lists/*

# Each RUN creates a layer; combining reduces layers and image size
```

### Clean Up in Same Layer

```dockerfile
# Bad — package cache remains in layer
RUN apt-get update && apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*  # doesn't reduce image size (previous layer has it)

# Good — clean in same RUN
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Good — pip cache
RUN pip install --no-cache-dir -r requirements.txt

# Good — npm cache
RUN npm ci --production && npm cache clean --force

# Good — apk cache (Alpine)
RUN apk add --no-cache curl git
```

### Use BuildKit Cache Mounts

```dockerfile
# syntax=docker/dockerfile:1.7

# Cache apt packages across builds
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update && apt-get install -y curl

# Cache npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Cache pip packages
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Cache Go modules
RUN --mount=type=cache,target=/go/pkg/mod \
    go build -o server .
```

### .dockerignore

```
# Always use .dockerignore to exclude unnecessary files
# This reduces build context and speeds up builds

node_modules
.git
.env
*.md
test
coverage
dist
build
.vscode
.idea
*.log
Dockerfile*
docker-compose*
```

## Security

### Run as Non-Root

```dockerfile
# Create non-root user
FROM node:22-alpine
RUN addgroup -S app && adduser -S -G app app
WORKDIR /app
COPY --chown=app:app . .
USER app
CMD ["node", "server.js"]

# Or use existing non-root user in base image
FROM node:22-alpine
USER node  # node:22-alpine has 'node' user (UID 1000)
```

### Drop Capabilities

```bash
# Drop all capabilities, add only needed ones
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx

# Read-only filesystem
docker run --read-only --tmpfs /tmp nginx

# No new privileges
docker run --security-opt no-new-privileges nginx

# Limit resources
docker run -m 512m --cpus 1.0 --pids-limit 100 nginx
```

### Use Docker Secrets

```dockerfile
# Don't bake secrets into images
# Bad:
ENV API_KEY=supersecret  # visible in image layers!

# Good: use BuildKit secrets (not in final image)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
```

```bash
# Pass secret at build time
docker build --secret id=npmrc,src=$HOME/.npmrc -t myapp .

# Runtime secrets via Compose
```

```yaml
services:
  web:
    image: myapp
    secrets:
      - api_key

secrets:
  api_key:
    file: ./secrets/api_key.txt
```

### Scan for Vulnerabilities

```bash
# Docker Scout
docker scout quickview myapp:latest
docker scout cves myapp:latest
docker scout recommendations myapp:latest

# Trivy (third-party)
trivy image myapp:latest

# Snyk
snyk container test myapp:latest

# Grype
grype myapp:latest
```

### Pin Base Image Versions

```dockerfile
# Bad — floating tag
FROM node:latest          # unpredictable, may change

# Better — version tag
FROM node:22              # more specific

# Best — digest (immutable)
FROM node:22-alpine@sha256:abc123def456...

# Get digest
docker inspect --format='{{index .RepoDigests 0}}' node:22-alpine
```

### Minimize Attack Surface

```dockerfile
# Use distroless images (no shell, no package manager)
FROM gcr.io/distroless/nodejs22-debian12
COPY --from=builder /app /app
WORKDIR /app
CMD ["server.js"]
# No shell = harder to exploit

# Or use scratch for Go/Rust static binaries
FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/server"]
```

## Performance

### Image Size Optimization

```dockerfile
# Use --no-install-recommends (Debian/Ubuntu)
RUN apt-get install -y --no-install-recommends curl

# Use --no-cache (Alpine)
RUN apk add --no-cache curl

# Remove build dependencies after build
FROM gcc:13 AS builder
COPY . .
RUN gcc -o myapp main.c

FROM alpine:3.20
COPY --from=builder /tmp/myapp /usr/local/bin/
# gcc not in final image

# Strip binaries
RUN go build -ldflags="-s -w" -o server .
# -s: strip symbol table, -w: strip debug info
```

### Build Performance

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1
# Or in daemon.json:
# { "features": { "buildkit": true } }

# Parallel builds in multi-stage
# BuildKit builds independent stages in parallel automatically

# Remote cache
docker buildx build \
  --cache-from type=registry,ref=myapp:cache \
  --cache-to type=registry,ref=myapp:cache,mode=max \
  -t myapp:latest .
```

### Runtime Performance

```bash
# Use --init for proper signal handling
docker run --init myapp

# Set memory swappiness
docker run --memory-swappiness=0 myapp

# Use host network for max performance (no isolation)
docker run --network host myapp

# Disable logging if not needed
docker run --log-driver none myapp

# Use tmpfs for temporary files
docker run --tmpfs /tmp myapp
```

## Dockerfile Linting

```bash
# hadolint — Dockerfile linter
hadolint Dockerfile

# Common hadolint rules:
# DL3006: Always tag base images explicitly
# DL3008: Pin versions in apt-get install
# DL3018: Pin versions in apk add
# DL3022: COPY --chown after USER
# DL3059: Multiple consecutive RUN instructions
# DL3007: Use latest tag is discouraged

# Fix common issues:
# Pin versions:
RUN apt-get install -y curl=7.88.1*
# Combine RUN:
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

## Tagging Strategy

```bash
# Semantic versioning
docker tag myapp:1.2.3 myapp:latest
docker tag myapp:1.2.3 myapp:1.2
docker tag myapp:1.2.3 myapp:1

# Git SHA tagging (CI/CD)
docker tag myapp:latest myapp:$(git rev-parse --short HEAD)

# Environment tagging
docker tag myapp:latest myapp:staging
docker tag myapp:latest myapp:production

# Date tagging
docker tag myapp:latest myapp:$(date +%Y%m%d)
```

## Health Checks

```dockerfile
# Always define health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# For apps without curl
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget --spider -q http://localhost:3000/health || exit 1

# For Node.js
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# For Python
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:3000/health')" || exit 1
```

## Signal Handling

```dockerfile
# Use exec form for CMD/ENTRYPOINT (proper PID 1 signal handling)
CMD ["node", "server.js"]        # Good — node receives SIGTERM
CMD node server.js               # Bad — runs in /bin/sh -c, shell gets SIGTERM

# For shell scripts, use exec
#!/bin/sh
echo "Starting..."
exec node server.js  # exec replaces shell, node becomes PID 1

# Use --init for apps that don't handle signals
docker run --init myapp  # tini as PID 1, forwards signals
```

## Summary Checklist

- [ ] Use small base images (alpine, slim, distroless)
- [ ] Multi-stage builds to remove build dependencies
- [ ] Order instructions for optimal layer caching
- [ ] Combine RUN commands and clean up in same layer
- [ ] Use .dockerignore
- [ ] Run as non-root user
- [ ] Drop capabilities and use --security-opt
- [ ] Pin base image versions or digests
- [ ] Define health checks
- [ ] Use exec form for CMD/ENTRYPOINT
- [ ] Scan images for vulnerabilities
- [ ] Use BuildKit cache mounts
- [ ] Tag images with semantic versions

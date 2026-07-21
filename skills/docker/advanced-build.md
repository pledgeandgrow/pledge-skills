# Advanced Build Features

## Docker Bake

Bake is a high-level build orchestration tool that lets you define multiple build targets in a single file (HCL or JSON), similar to Make.

### bake.hcl

```hcl
# Define variables
variable "TAG" {
  default = "latest"
}

variable "REGISTRY" {
  default = "docker.io"
}

# Group — build multiple targets at once
group "default" {
  targets = ["app", "api"]
}

# Target — a single build
target "app" {
  context = "./frontend"
  dockerfile = "Dockerfile"
  tags = ["${REGISTRY}/myapp:${TAG}"]
  platforms = ["linux/amd64", "linux/arm64"]
}

target "api" {
  context = "./backend"
  dockerfile = "Dockerfile"
  tags = ["${REGISTRY}/myapi:${TAG}"]
  target = "production"
}

target "dev" {
  inherits = ["app"]
  tags = ["${REGISTRY}/myapp:dev"]
  target = "dev"
}

# Matrix build — multiple variants
target "multi-arch" {
  platforms = ["linux/amd64", "linux/arm64", "linux/arm/v7"]
}
```

### bake.json (JSON format)

```json
{
  "group": {
    "default": {
      "targets": ["app", "api"]
    }
  },
  "target": {
    "app": {
      "context": "./frontend",
      "dockerfile": "Dockerfile",
      "tags": ["myapp:latest"],
      "platforms": ["linux/amd64", "linux/arm64"]
    },
    "api": {
      "context": "./backend",
      "dockerfile": "Dockerfile",
      "tags": ["myapi:latest"],
      "target": "production"
    }
  }
}
```

### Bake Commands

```bash
# Build all targets in default group
docker buildx bake

# Build specific target
docker buildx bake app

# Build specific group
docker buildx bake default

# With variables
docker buildx bake --set TAG=v1.0.0

# Print resolved config (without building)
docker buildx bake --print

# Push after build
docker buildx bake --push

# Load into local Docker (single target only)
docker buildx bake --load app

# No cache
docker buildx bake --no-cache

# Use a specific file
docker buildx bake -f docker-bake.hcl
docker buildx bake -f docker-bake.json
```

## Build Drivers

Drivers determine where and how builds are executed.

| Driver | Description | Use Case |
|--------|-------------|----------|
| `docker` | Default, uses Docker daemon | Simple local builds |
| `docker-container` | BuildKit in a container | Multi-platform, cache export |
| `remote` | Remote BuildKit instance | CI/CD, shared builders |
| `kubernetes` | BuildKit pods in K8s | Kubernetes-native builds |
| `cloud` | Docker Build Cloud | Cloud-based builds |

```bash
# List builders
docker buildx ls

# Create a builder with specific driver
docker buildx create --name mybuilder --driver docker-container
docker buildx create --name remote-builder --driver remote --platform linux/amd64,linux/arm64

# Use a builder
docker buildx use mybuilder

# Bootstrap builder (start BuildKit container)
docker buildx inspect --bootstrap mybuilder

# Remove a builder
docker buildx rm mybuilder

# Docker Build Cloud (requires subscription)
docker buildx create --name cloud --driver cloud --provider docker
docker buildx use cloud
```

## Build Exporters

Exporters determine where the build output goes.

```bash
# --output type=docker (default) — load into Docker daemon
docker buildx build -t myapp:latest --load .

# --output type=image — push to registry
docker buildx build -t myapp:latest --push .

# --output type=oci — export as OCI tarball
docker buildx build -o type=oci,dest=image.tar .

# --output type=docker — export as Docker tarball
docker buildx build -o type=docker,dest=image.tar .

# --output type=local — export filesystem to directory
docker buildx build -o type=local,dest=./out .

# --output type=tar — export filesystem as tar
docker buildx build -o type=tar,dest=fs.tar .

# --output type=registry — push to registry (like --push)
docker buildx build -o type=registry -t myapp:latest .

# --output type=cacheonly — only populate cache, no output
docker buildx build -o type=cacheonly .

# Multiple outputs
docker buildx build \
  -o type=image,push=true,name=myapp:latest \
  -o type=local,dest=./out \
  .
```

## Image Attestations

```bash
# Build with SBOM (Software Bill of Materials)
docker buildx build \
  --sbom=true \
  -t myapp:latest \
  --push .

# Build with provenance (build metadata)
docker buildx build \
  --provenance=true \
  -t myapp:latest \
  --push .

# Build with both
docker buildx build \
  --sbom=true \
  --provenance=true \
  --provenance-mode=max \
  -t myapp:latest \
  --push .

# View attestation
docker buildx imagetools inspect myapp:latest

# Attestations are stored as OCI manifests
# Can be verified with cosign or notation
```

## Build Cache Types

```bash
# Local cache
docker buildx build \
  --cache-from type=local,src=/tmp/.buildx-cache \
  --cache-to type=local,dest=/tmp/.buildx-cache-new \
  -t myapp:latest .

# Registry cache
docker buildx build \
  --cache-from type=registry,ref=myapp:cache \
  --cache-to type=registry,ref=myapp:cache,mode=max \
  -t myapp:latest --push .

# GitHub Actions cache
docker buildx build \
  --cache-from type=gha \
  --cache-to type=gha,mode=max \
  -t myapp:latest .

# Inline cache (embedded in image)
docker buildx build \
  --cache-from type=inline \
  --cache-to type=inline \
  -t myapp:latest --push .

# S3 cache
docker buildx build \
  --cache-from type=s3,ref=s3://my-bucket/cache \
  --cache-to type=s3,ref=s3://my-bucket/cache,mode=max \
  -t myapp:latest .
```

## Multi-Platform Builds

```bash
# List available platforms
docker buildx ls

# Enable QEMU for cross-platform
docker run --privileged --rm tonistiigi/binfmt --install all

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t myapp:latest \
  --push .

# Build for specific platform (without pushing)
docker buildx build \
  --platform linux/arm64 \
  -t myapp:arm64 \
  --load .

# Inspect multi-platform manifest
docker buildx imagetools inspect myapp:latest
docker buildx imagetools inspect --raw myapp:latest
```

# Registry and Image Management

## Docker Hub

### Public Images

```bash
# Search
docker search nginx
docker search --filter stars=100 --filter is-official=true node

# Pull official images
docker pull nginx:latest
docker pull node:22-alpine
docker pull postgres:17

# Pull user images
docker pull username/myapp:1.0

# Push to Docker Hub
docker login
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0

# Push all tags
docker push --all-tags username/myapp
```

### Docker Hub Account

```bash
# Login
docker login -u username -p password
docker login -u username    # prompt for password (recommended)

# Using access tokens (recommended over password)
# Docker Hub → Account Settings → Security → New Access Token
docker login -u username -d-XXXXX  # use token as password

# Logout
docker logout
```

### Official Images

Official images are curated and maintained by Docker:

| Image | Repository |
|-------|-----------|
| `nginx` | nginxinc/docker-nginx |
| `node` | nodejs/docker-node |
| `python` | docker-library/python |
| `postgres` | docker-library/postgres |
| `redis` | redis/docker |
| `alpine` | alpinelinux/docker-alpine |
| `ubuntu` | tianon/docker-brew-ubuntu |

### Image Tags and Variants

```bash
# Full tag (version + OS)
node:22              # Debian-based, full
node:22-bookworm     # Debian 12 Bookworm
node:22-bullseye     # Debian 11 Bullseye
node:22-slim         # Debian minimal
node:22-alpine       # Alpine Linux
node:22-alpine3.20   # Alpine 3.20 specific
node:22-bullseye-slim
node:22-bookworm-slim

# Latest tag
node:latest          # latest major version (unpredictable)

# Digest (immutable)
node:22-alpine@sha256:abc123...
```

## Private Registry

### Running a Local Registry

```bash
# Start a local registry
docker run -d -p 5000:5000 --name registry registry:2

# Push to local registry
docker tag myapp:1.0 localhost:5000/myapp:1.0
docker push localhost:5000/myapp:1.0

# Pull from local registry
docker pull localhost:5000/myapp:1.0

# With persistent storage
docker run -d -p 5000:5000 --name registry \
  -v registrydata:/var/lib/registry \
  registry:2

# With authentication
mkdir -p auth
docker run --rm httpd:2 htpasswd -Bbn user password > auth/htpasswd

docker run -d -p 5000:5000 --name registry \
  -v $(pwd)/auth:/auth \
  -e REGISTRY_AUTH=htpasswd \
  -e REGISTRY_AUTH_HTPASSWD_REALM=Registry \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry:2

# Login to private registry
docker login localhost:5000
```

### Registry with TLS

```bash
# Generate self-signed certificate
mkdir -p certs
openssl req -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
  -x509 -days 365 -out certs/domain.crt \
  -subj "/CN=registry.example.com"

# Run registry with TLS
docker run -d -p 5000:5000 --name registry \
  -v $(pwd)/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2

# For self-signed certs, configure Docker daemon
# /etc/docker/daemon.json:
{
  "insecure-registries": ["registry.example.com:5000"]
}
# Restart Docker
sudo systemctl restart docker
```

### Registry as a Service

| Provider | Service |
|----------|---------|
| Docker | Docker Hub (public/private) |
| AWS | ECR (Elastic Container Registry) |
| Google | GCR / Artifact Registry |
| Azure | ACR (Azure Container Registry) |
| GitHub | GHCR (GitHub Container Registry) |
| GitLab | GitLab Container Registry |
| JFrog | Artifactory |
| Quay | Quay.io / Red Hat Quay |

### AWS ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name myapp

# Tag and push
docker tag myapp:1.0 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0
```

### GitHub Container Registry (GHCR)

```bash
# Login with GitHub token
echo $GITHUB_TOKEN | docker login ghcr.io -u username --password-stdin

# Tag and push
docker tag myapp:1.0 ghcr.io/username/myapp:1.0
docker push ghcr.io/username/myapp:1.0
```

### Google Artifact Registry

```bash
# Configure Docker auth
gcloud auth configure-docker us-docker.pkg.dev

# Tag and push
docker tag myapp:1.0 us-docker.pkg.dev/my-project/my-repo/myapp:1.0
docker push us-docker.pkg.dev/my-project/my-repo/myapp:1.0
```

## Image Tagging Strategy

```bash
# Semantic versioning
docker tag myapp:v1.2.3 myapp:1.2.3
docker tag myapp:v1.2.3 myapp:1.2
docker tag myapp:v1.2.3 myapp:1
docker tag myapp:v1.2.3 myapp:latest

# Git-based tagging
docker tag myapp:latest myapp:$(git rev-parse --short HEAD)
docker tag myapp:latest myapp:branch-$(git branch --show-current)

# Environment-based tagging
docker tag myapp:latest myapp:staging
docker tag myapp:latest myapp:production

# Date-based tagging
docker tag myapp:latest myapp:$(date +%Y%m%d-%H%M%S)

# Multi-arch manifest
docker buildx build --platform linux/amd64,linux/arm64 \
  -t myapp:latest --push .
```

## Image Management

### Inspecting Images

```bash
# Inspect image metadata
docker image inspect myapp:1.0
docker image inspect --format '{{.Architecture}}' myapp:1.0
docker image inspect --format '{{.Os}}' myapp:1.0
docker image inspect --format '{{json .Config.Env}}' myapp:1.0
docker image inspect --format '{{json .Config.Labels}}' myapp:1.0

# View image layers
docker history myapp:1.0
docker history --no-trunc myapp:1.0
docker history --format "{{.CreatedBy}}" myapp:1.0

# Image size
docker image inspect --format '{{.Size}}' myapp:1.0
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Saving and Loading Images

```bash
# Save image to tar file
docker save -o myapp.tar myapp:1.0
docker save myapp:1.0 | gzip > myapp.tar.gz

# Save multiple images
docker save -o all.tar myapp:1.0 nginx:latest postgres:17

# Load from tar file
docker load -i myapp.tar
docker load < myapp.tar.gz

# Transfer image to another host
docker save myapp:1.0 | ssh user@host docker load

# Export container filesystem (not an image)
docker export container_id > filesystem.tar
docker import filesystem.tar myapp:imported
```

### Cleaning Up Images

```bash
# Remove unused images
docker image prune
docker image prune -a  # all not used by containers

# Remove dangling images (untagged)
docker image prune --filter dangling=true

# Remove by age
docker image prune --filter "until=48h"

# Remove by label
docker image prune --filter "label=environment=test"

# Remove specific images
docker rmi myapp:1.0 myapp:1.1
docker rmi $(docker images -q --filter "dangling=true")

# Full cleanup
docker system prune -a
```

### Image Manifest and Multi-Arch

```bash
# Inspect manifest
docker manifest inspect nginx:latest
docker manifest inspect --verbose nginx:latest

# Create multi-arch manifest
docker manifest create myapp:latest \
  myapp:amd64 \
  myapp:arm64 \
  myapp:arm-v7

# Annotate
docker manifest annotate --arch arm64 --variant v8 myapp:latest myapp:arm64

# Push manifest
docker manifest push myapp:latest

# Buildx for multi-platform (preferred)
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t myapp:latest \
  --push .
```

## Registry API

```bash
# List repositories (v2 API)
curl -X GET http://localhost:5000/v2/_catalog

# List tags for a repository
curl -X GET http://localhost:5000/v2/myapp/tags/list

# Get manifest
curl -X GET http://localhost:5000/v2/myapp/manifests/latest \
  -H "Accept: application/vnd.docker.distribution.manifest.v2+json"

# Delete a tag (if delete enabled)
curl -X DELETE http://localhost:5000/v2/myapp/manifests/sha256:abc123...
```

## Garbage Collection

```bash
# Registry garbage collection (run offline)
docker stop registry
docker run --rm -v registrydata:/var/lib/registry registry:2 \
  garbage-collect /etc/docker/registry/config.yml

# With --delete-untagged
docker run --rm -v registrydata:/var/lib/registry registry:2 \
  garbage-collect --delete-untagged /etc/docker/registry/config.yml

docker start registry
```

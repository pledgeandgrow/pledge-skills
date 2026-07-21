# Getting Started

## What is Docker?

Docker is a containerization platform that packages applications and their dependencies into lightweight, portable containers. Containers share the host OS kernel but run in isolated user spaces.

### Containers vs Virtual Machines

| Feature | Container | VM |
|---------|-----------|-----|
| OS | Shares host kernel | Full guest OS |
| Size | MB (10-100s) | GB (10s) |
| Boot time | Seconds | Minutes |
| Isolation | Process-level | Hardware-level |
| Resource usage | Low | High |
| Portability | Excellent | Limited |

### Docker Architecture

```
┌─────────────────────────────────────┐
│           Docker Host               │
│  ┌─────────┐  ┌─────────┐          │
│  │Container│  │Container│  ...     │
│  └────┬────┘  └────┬────┘          │
│       │             │               │
│  ┌────┴─────────────┴────┐         │
│  │   Docker Daemon       │         │
│  │   (dockerd)           │         │
│  └───────────┬───────────┘         │
└──────────────┼─────────────────────┘
               │
  ┌────────────┴────────────┐
  │   Docker Client (CLI)   │
  └────────────┬────────────┘
               │
  ┌────────────┴────────────┐
  │   Docker Registry       │
  │   (Docker Hub, etc.)    │
  └─────────────────────────┘
```

## Installation

### Linux (Ubuntu/Debian)

```bash
# Official method
curl -fsSL https://get.docker.com | sudo sh

# Add user to docker group (avoid sudo)
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect

# Verify
docker --version
docker run hello-world
```

### macOS

```bash
# Download Docker Desktop
# https://docs.docker.com/desktop/install/mac-install/

# Or via Homebrew
brew install --cask docker

# Launch Docker Desktop app, then verify
docker --version
```

### Windows

```powershell
# Download Docker Desktop
# https://docs.docker.com/desktop/install/windows-install/

# Or via winget
winget install Docker.DockerDesktop

# WSL2 backend required
wsl --install
wsl --set-default-version 2

# Verify
docker --version
docker run hello-world
```

### Post-Install Configuration

```bash
# Configure Docker to start on boot (Linux)
sudo systemctl enable docker

# Install Docker Compose v2 (usually included)
docker compose version

# Configure DNS (if needed)
sudo mkdir -p /etc/docker
echo '{"dns": ["8.8.8.8", "8.8.4.4"]}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

## Core Concepts

### Images

```bash
# Pull an image
docker pull nginx:latest
docker pull node:22-alpine
docker pull python:3.13-slim

# List images
docker images
docker image ls

# Remove an image
docker rmi nginx:latest
docker image rm nginx:latest

# Inspect an image
docker image inspect nginx:latest

# Show image history (layers)
docker history nginx:latest
```

### Containers

```bash
# Run a container
docker run nginx:latest

# Run with options
docker run \
  --name myapp \          # name the container
  -d \                    # detached (background)
  -p 8080:80 \            # port mapping (host:container)
  -e ENV_VAR=value \      # environment variable
  -v /host/path:/container/path \  # volume mount
  --restart unless-stopped \       # restart policy
  nginx:latest

# List containers
docker ps              # running only
docker ps -a           # all (including stopped)

# Container lifecycle
docker start myapp
docker stop myapp      # graceful stop (SIGTERM, then SIGKILL after 10s)
docker stop -t 30 myapp  # wait 30s before SIGKILL
docker kill myapp      # immediate (SIGKILL)
docker restart myapp
docker pause myapp     # freeze processes
docker unpause myapp

# Remove containers
docker rm myapp
docker rm -f myapp     # force (stop + remove)
docker container prune # remove all stopped
```

### Running Interactive Containers

```bash
# Interactive shell
docker run -it ubuntu:24.04 bash

# Run a command in a running container
docker exec -it myapp bash
docker exec -it myapp sh      # Alpine (no bash)

# Attach to a running container
docker attach myapp
# Detach with Ctrl+P, Ctrl+Q
```

## Building Your First Image

### Project Structure

```
myapp/
├── Dockerfile
├── package.json
├── src/
│   └── index.js
└── .dockerignore
```

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

### .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
*.md
test
coverage
```

### Build and Run

```bash
# Build an image
docker build -t myapp:1.0 .
docker build -t myapp:1.0 -f Dockerfile .

# Build with build arg
docker build --build-arg NODE_ENV=production -t myapp:1.0 .

# Run the built image
docker run -d -p 3000:3000 --name myapp myapp:1.0

# Check logs
docker logs myapp
docker logs -f myapp          # follow
docker logs --tail 50 myapp   # last 50 lines
docker logs -t myapp          # with timestamps
```

## Docker Hub and Registries

```bash
# Search for images
docker search nginx
docker search node

# Login to Docker Hub
docker login

# Login to private registry
docker login registry.example.com

# Tag an image
docker tag myapp:1.0 myapp:latest
docker tag myapp:1.0 username/myapp:1.0

# Push to registry
docker push username/myapp:1.0

# Pull from registry
docker pull username/myapp:1.0
```

## Environment Variables

```bash
# Pass environment variables
docker run -e API_KEY=secret myapp
docker run -e API_KEY myapp              # pass from host env
docker run --env-file .env myapp         # from file

# .env file format
API_KEY=secret
DB_HOST=db.example.com
DB_PORT=5432
DEBUG=true
```

## Resource Limits

```bash
# Memory limit
docker run -m 512m myapp
docker run --memory-reservation 256m myapp

# CPU limit
docker run --cpus 2.0 myapp
docker run --cpuset-cpus 0,1 myapp  # specific cores

# Combined
docker run -d \
  --name myapp \
  -m 512m \
  --cpus 1.5 \
  -p 3000:3000 \
  myapp:1.0
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune
docker image prune -a   # all images not used by containers

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything not in use
docker system prune
docker system prune -a --volumes  # also unused images and volumes

# Show disk usage
docker system df
docker system df -v  # verbose
```

## Docker Desktop Features

```bash
# Docker Desktop dashboard (GUI)
# - View and manage containers
# - View images and volumes
# - Compose application management
# - Dev Environments
# - Extensions marketplace

# Resource settings (Docker Desktop)
# Settings → Resources:
#   - CPUs, Memory, Swap, Disk image size
#   - File sharing (bind mount performance)
#   - Network: DNS, proxy
#   - WSL2 integration (Windows)
```

## Next Steps

- **Dockerfile**: Learn all instructions and multi-stage builds → `dockerfile.md`
- **Docker Compose**: Multi-container applications → `compose.md`
- **CLI Commands**: Full command reference → `commands.md`
- **Best Practices**: Optimize images and secure containers → `best-practices.md`

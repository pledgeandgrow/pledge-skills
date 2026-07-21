# Volumes and Storage

## Storage Types

| Type | Description | Persistence | Performance |
|------|-------------|-------------|-------------|
| **Named Volume** | Docker-managed storage | Survives container removal | Best (native) |
| **Bind Mount** | Host directory mapped | Survives container removal | Varies (OS-dependent) |
| **tmpfs** | RAM-backed filesystem | Lost on container stop | Fastest (memory) |
| **Image Layer** | Read-only filesystem | Part of image | Good |

## Named Volumes

```bash
# Create a named volume
docker volume create mydata
docker volume create --driver local --name mydata
docker volume create --opt type=nfs --opt device=:/path mydata

# List volumes
docker volume ls
docker volume ls --filter name=mydata

# Inspect
docker volume inspect mydata
# Shows mountpoint: /var/lib/docker/volumes/mydata/_data

# Remove
docker volume rm mydata
docker volume prune          # remove unused
docker volume prune -a       # remove all not in use

# Use with docker run
docker run -v mydata:/data nginx
docker run --mount type=volume,source=mydata,target=/data nginx

# Use with docker run (read-only)
docker run -v mydata:/data:ro nginx
```

### Named Volume with Compose

```yaml
services:
  db:
    image: postgres:17
    volumes:
      - dbdata:/var/lib/postgresql/data
      - config:/etc/postgresql/conf.d:ro

volumes:
  dbdata:
    # Default driver (local)
  config:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /home/user/pgconfig
  nfs_data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=10.0.0.1,rw
      device: ":/shared/data"
```

### Volume Lifecycle

```bash
# Volumes persist after container removal
docker run -v mydata:/data --name app nginx
docker rm app
# mydata still exists with its data

docker run -v mydata:/data --name app2 nginx
# app2 sees the same data

# Backup a volume
docker run --rm -v mydata:/data -v $(pwd):/backup alpine \
  tar czf /backup/mydata.tar.gz -C /data .

# Restore a volume
docker volume create mydata_restored
docker run --rm -v mydata_restored:/data -v $(pwd):/backup alpine \
  tar xzf /backup/mydata.tar.gz -C /data

# Migrate volume to new location
docker run --rm -v oldvol:/from -v newvol:/to alpine \
  cp -a /from/. /to/
```

## Bind Mounts

```bash
# Bind mount a host directory
docker run -v /host/path:/container/path nginx
docker run -v $(pwd)/src:/app/src nginx

# Read-only bind mount
docker run -v /host/path:/container/path:ro nginx

# Long syntax
docker run --mount type=bind,source=/host/path,target=/container/path nginx
docker run --mount type=bind,source=/host/path,target=/container/path,readonly nginx

# Consistency (macOS only)
docker run -v /host:/container:consistent nginx   # default (full sync)
docker run -v /host:/container:cached nginx        # host is source of truth
docker run -v /host:/container:delegated nginx     # container is source of truth
```

### Bind Mounts with Compose

```yaml
services:
  web:
    volumes:
      - ./src:/app/src
      - ./public:/app/public:ro
      - /app/node_modules  # anonymous volume (prevent override)
    
    # Long syntax
    volumes:
      - type: bind
        source: ./src
        target: /app/src
        consistency: cached
      - type: bind
        source: ./config
        target: /app/config
        read_only: true
```

### Bind Mount Use Cases

- **Development**: Hot reload source code into container
- **Configuration**: Mount config files from host
- **Log forwarding**: Mount log directory
- **CI/CD**: Mount build artifacts

### Bind Mount Caveats

- **macOS performance**: File system sync is slow; use `:cached` or `:delegated`
- **Windows paths**: Use forward slashes or `//c/Users/...` format
- **Permissions**: UID/GID mismatch between host and container
- **Overwrites contents**: Bind mount hides container directory contents

## tmpfs Mounts

```bash
# tmpfs — in-memory filesystem
docker run --tmpfs /tmp nginx
docker run --tmpfs /tmp:rw,size=100m,mode=1777 nginx

# Long syntax
docker run --mount type=tmpfs,target=/tmp nginx
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m,tmpfs-mode=1777 nginx
```

### tmpfs with Compose

```yaml
services:
  web:
    tmpfs:
      - /tmp
      - /run
    
    # Long syntax
    volumes:
      - type: tmpfs
        target: /tmp
        tmpfs:
          size: 100000000  # 100MB in bytes
          mode: 1777
```

### tmpfs Use Cases

- **Security**: Sensitive data that should never touch disk
- **Performance**: Fast temporary storage (caches, sessions)
- **Compliance**: No persistent storage for certain data

## Volume Drivers

```bash
# Local driver (default)
docker volume create --driver local mydata

# NFS
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=10.0.0.1,rw \
  --opt device=:/shared/data \
  nfs_data

# iSCSI
docker volume create --driver local \
  --opt type=iscsi \
  --opt device=/dev/sda1 \
  iscsi_data

# Third-party plugins
docker plugin install rexray/ebs
docker volume create --driver rexray/ebs --opt size=20 ebs_vol
```

## Storage in Dockerfile

```dockerfile
# VOLUME instruction creates anonymous volume mountpoint
VOLUME /data
VOLUME ["/data", "/logs"]

# At runtime, Docker creates an anonymous volume
# This data is NOT part of the image layers

# Best practice: use named volumes in Compose instead
# VOLUME in Dockerfile is mainly for documentation
```

## Image Layers and Storage

```
# Docker images are made of read-only layers
# Each instruction creates a new layer

FROM node:22-alpine       # Layer 1 (base)
WORKDIR /app              # Layer 2 (metadata only)
COPY package*.json ./     # Layer 3
RUN npm ci                # Layer 4
COPY . .                  # Layer 5

# Container adds a writable layer on top
# Copy-on-write: modified files copied to container layer

# View layers
docker history myapp:latest

# Inspect storage driver
docker info --format '{{.Driver}}'
# overlay2 (default), aufs (legacy), devicemapper, btrfs, zfs
```

## Managing Disk Space

```bash
# Check disk usage
docker system df
docker system df -v  # verbose (per-image, per-container, per-volume)

# Clean up
docker system prune              # unused containers, networks, dangling images
docker system prune -a           # also unused images
docker system prune --volumes    # also unused volumes
docker system prune -a --volumes # everything not in use

# Remove specific items
docker image prune -a            # unused images
docker container prune           # stopped containers
docker volume prune -a           # unused volumes
docker network prune             # unused networks

# Remove by age
docker container prune --filter "until=24h"
docker image prune --filter "until=48h"

# Remove builder cache
docker builder prune
docker builder prune -a
```

## Backup and Migration

```bash
# Backup a named volume
docker run --rm -v mydata:/data -v $(pwd):/backup alpine \
  tar czf /backup/mydata-$(date +%Y%m%d).tar.gz -C /data .

# Restore to a new volume
docker volume create mydata_new
docker run --rm -v mydata_new:/data -v $(pwd):/backup alpine \
  tar xzf /backup/mydata-20240115.tar.gz -C /data

# Copy data between volumes
docker run --rm -v source_vol:/from -v dest_vol:/to alpine \
  cp -a /from/. /to/

# Backup all volumes for a Compose project
docker compose run --rm -v $(pwd):/backup backup-service \
  tar czf /backup/all-volumes.tar.gz /data /logs
```

## Permissions and Ownership

```bash
# Common issue: UID mismatch between host and container

# Fix: match UID in Dockerfile
FROM node:22-alpine
RUN addgroup -S app && adduser -S -G app -u 1001 app
USER 1001

# Or at runtime
docker run -u 1001:1001 -v mydata:/data nginx

# Fix bind mount permissions (Linux)
sudo chown -R 1001:1001 /host/path

# Fix with entrypoint script
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
```

```bash
#!/bin/sh
# entrypoint.sh — fix permissions then exec
chown -R app:app /data
exec "$@"
```

## Named Pipes (Windows)

```powershell
# Named pipes for host-container communication (Windows)
# Mount the Docker Engine named pipe into a container
docker run -v \\.\pipe\docker_engine:\\.\pipe\docker_engine myapp

# Use case: run Docker CLI inside a container to control host Docker
docker run --rm -v \\.\pipe\docker_engine:\\.\pipe\docker_engine docker:cli version

# In Compose
services:
  docker-cli:
    image: docker:cli
    volumes:
      - type: npipe
        source: \\.\pipe\docker_engine
        target: \\.\pipe\docker_engine
```

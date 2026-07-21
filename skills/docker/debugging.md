# Debugging Docker Containers

## Viewing Logs

```bash
# View logs
docker logs CONTAINER
docker logs -f CONTAINER              # follow (like tail -f)
docker logs --tail 100 CONTAINER      # last 100 lines
docker logs --since 30m CONTAINER     # since 30 minutes ago
docker logs --since 2024-01-15T10:00:00 CONTAINER
docker logs --until 1h CONTAINER      # until 1 hour ago
docker logs -t CONTAINER              # with timestamps
docker logs --details CONTAINER       # extra metadata

# Compose logs
docker compose logs
docker compose logs -f web
docker compose logs --tail 50 web db
docker compose logs --since 5m
```

## Executing Commands in Running Containers

```bash
# Interactive shell
docker exec -it CONTAINER bash
docker exec -it CONTAINER sh         # Alpine

# Run a command
docker exec CONTAINER ls -la /app
docker exec CONTAINER cat /etc/os-release
docker exec CONTAINER ps aux
docker exec CONTAINER env             # show environment variables

# As root (if container runs as non-root)
docker exec -u 0 -it CONTAINER bash

# In a specific directory
docker exec -w /tmp CONTAINER ls

# With additional env vars
docker exec -e DEBUG=true CONTAINER command
```

## Inspecting Containers

```bash
# Full inspect
docker inspect CONTAINER

# Specific fields
docker inspect --format '{{.State.Status}}' CONTAINER
docker inspect --format '{{.State.ExitCode}}' CONTAINER
docker inspect --format '{{.State.Error}}' CONTAINER
docker inspect --format '{{.NetworkSettings.IPAddress}}' CONTAINER
docker inspect --format '{{json .Config.Env}}' CONTAINER
docker inspect --format '{{json .Mounts}}' CONTAINER
docker inspect --format '{{json .NetworkSettings.Networks}}' CONTAINER

# Health status
docker inspect --format '{{.State.Health.Status}}' CONTAINER
docker inspect --format '{{json .State.Health}}' CONTAINER

# Restart count
docker inspect --format '{{.RestartCount}}' CONTAINER

# PID
docker inspect --format '{{.State.Pid}}' CONTAINER
```

## Process and Resource Monitoring

```bash
# Live resource usage
docker stats
docker stats CONTAINER
docker stats --no-stream

# Processes in container
docker top CONTAINER
docker top CONTAINER aux

# Filesystem changes
docker diff CONTAINER
# A = added, C = changed, D = deleted

# Port mappings
docker port CONTAINER
```

## Debugging Build Issues

```bash
# Build with no cache
docker build --no-cache -t myapp .

# Build with progress=plain (full output)
docker build --progress=plain -t myapp .

# Build specific stage
docker build --target builder -t myapp:builder .

# Inspect intermediate layers
docker history --no-trunc myapp:latest

# Run intermediate image
docker run -it <IMAGE_ID> bash

# Debug with BuildKit output
DOCKER_BUILDKIT=1 docker build --progress=plain -t myapp . 2>&1 | tee build.log
```

## Debugging Networking

```bash
# Check container IP
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER

# Check DNS resolution
docker exec CONTAINER nslookup db
docker exec CONTAINER getent hosts db

# Test connectivity
docker exec CONTAINER ping -c 3 db
docker exec CONTAINER curl -v http://db:5432
docker exec CONTAINER wget -qO- http://api:3000/health

# Check open ports
docker exec CONTAINER ss -tlnp
docker exec CONTAINER netstat -tlnp

# Network namespace
docker run --rm --net=container:TARGET nicolaka/netshoot ss -tlnp

# Packet capture
docker run --rm --net=host --cap-add=NET_ADMIN nicolaka/netshoot \
  tcpdump -i any port 80 -nn

# Inspect network
docker network inspect mynet
docker network inspect --format '{{json .Containers}}' mynet | jq
```

## Debugging with Netshoot

```bash
# nicolaka/netshoot — network debugging toolkit
docker run --rm -it nicolaka/netshoot

# Contains: nslookup, dig, curl, wget, ping, tcpdump, ss, netstat,
#   iperf3, mtr, traceroute, telnet, nmap, strace, dtrace, and more

# Debug a container's network
docker run --rm -it --net=container:TARGET nicolaka/netshoot

# Debug a network
docker run --rm -it --network mynet nicolaka/netshoot
```

## Common Issues and Solutions

### Container Exits Immediately

```bash
# Check exit code
docker inspect --format '{{.State.ExitCode}}' CONTAINER

# Check logs
docker logs CONTAINER

# Common causes:
# 1. CMD/ENTRYPOINT fails — check logs for error
# 2. App expects TTY — add -it flag
# 3. Wrong working directory — check WORKDIR
# 4. Missing file — check COPY paths
# 5. Permission denied — check USER and file permissions

# Debug: override entrypoint
docker run -it --entrypoint sh myapp
docker run -it --entrypoint sh myapp -c "ls -la /app"
```

### Container Won't Start

```bash
# Check if image exists
docker images | grep myapp

# Check for port conflicts
docker ps -a --filter "publish=80"
sudo lsof -i :80

# Check container state
docker inspect --format '{{.State.Status}}: {{.State.Error}}' CONTAINER

# Check resource limits
docker inspect --format '{{.HostConfig.Memory}}' CONTAINER
```

### Permission Denied

```bash
# Check current user
docker exec CONTAINER id

# Check file ownership
docker exec CONTAINER ls -la /app

# Fix: run as root and chown
docker exec -u 0 CONTAINER chown -R app:app /data

# Fix: in Dockerfile
RUN chown -R app:app /data
USER app

# Fix: match UID with host
docker run -u $(id -u):$(id -g) myapp
```

### Out of Disk Space

```bash
# Check disk usage
docker system df
docker system df -v

# Clean up
docker system prune -a --volumes

# Check Docker data directory
docker info --format '{{.DockerRootDir}}'
df -h /var/lib/docker

# Move Docker data directory
# /etc/docker/daemon.json:
{
  "data-root": "/new/path/docker"
}
# Restart Docker
sudo systemctl restart docker
```

### Cannot Connect to Service

```bash
# 1. Check if container is running
docker ps | grep web

# 2. Check port mapping
docker port web

# 3. Check if service is listening inside container
docker exec web ss -tlnp

# 4. Check network
docker inspect --format '{{json .NetworkSettings.Networks}}' web

# 5. Test from another container
docker run --rm --network mynet curlimages/curl http://web:3000

# 6. Check firewall
sudo iptables -L -n
```

### OOM Killed

```bash
# Check if container was OOM killed
docker inspect --format '{{.State.OOMKilled}}' CONTAINER

# Check memory limit
docker inspect --format '{{.HostConfig.Memory}}' CONTAINER

# Increase memory limit
docker run -m 1g myapp

# Check host memory
free -h

# Check container memory usage
docker stats CONTAINER
```

### Image Build Fails

```bash
# Build with progress=plain for full output
docker build --progress=plain --no-cache -t myapp . 2>&1 | tee build.log

# Common issues:
# 1. Base image not found — check image name and tag
# 2. Package not found — update package index (apt-get update)
# 3. COPY fails — check file paths, .dockerignore
# 4. RUN fails — run command manually in base image
# 5. Out of space — docker system prune

# Debug: run failing command interactively
docker run -it base-image bash
# Then run the failing command manually
```

## Debugging Docker Compose

```bash
# Validate compose file
docker compose config -q

# Show merged config
docker compose config

# List services
docker compose config --services

# Start single service
docker compose up -d db

# Check service status
docker compose ps

# View service logs
docker compose logs web
docker compose logs -f web db

# Execute in service
docker compose exec web bash

# Rebuild and restart
docker compose up -d --build web

# Check service dependencies
docker compose config | grep -A5 depends_on
```

## Health Check Debugging

```bash
# Check health status
docker inspect --format '{{.State.Health.Status}}' CONTAINER

# View health check log
docker inspect --format '{{json .State.Health.Log}}' CONTAINER | jq

# Run health check command manually
docker exec CONTAINER curl -f http://localhost:3000/health

# Disable health check temporarily
docker update --no-healthcheck CONTAINER
```

## Debugging with strace

```bash
# strace a running container's process
docker exec -it CONTAINER strace -p 1

# strace with timing
docker exec -it CONTAINER strace -T -p 1

# If strace not in container, use host
sudo strace -p $(docker inspect --format '{{.State.Pid}}' CONTAINER)

# Trace specific syscalls
docker exec -it CONTAINER strace -e trace=network -p 1
```

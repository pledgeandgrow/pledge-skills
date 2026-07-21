# Docker CLI Command Reference

## Container Commands

### Run

```bash
# Basic run
docker run IMAGE
docker run nginx

# Common flags
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# Naming and detaching
docker run -d --name myapp nginx

# Interactive
docker run -it ubuntu bash
docker run -it --rm alpine sh  # remove after exit

# Port mapping
docker run -p 8080:80 nginx          # host:container
docker run -p 8080:80/tcp nginx      # explicit protocol
docker run -P nginx                   # random host ports
docker run -p 127.0.0.1:8080:80 nginx # bind to localhost

# Environment
docker run -e KEY=value nginx
docker run -e KEY nginx               # from host env
docker run --env-file .env nginx

# Volumes
docker run -v /host:/container nginx
docker run -v /host:/container:ro nginx  # read-only
docker run -v namedvol:/container nginx
docker run --mount type=bind,source=/host,target=/container nginx
docker run --mount type=volume,source=data,target=/data nginx
docker run --mount type=tmpfs,target=/tmp nginx

# Networking
docker run --network mynet nginx
docker run --network-alias web nginx
docker run --add-host host.docker.internal:host-gateway nginx
docker run --dns 8.8.8.8 nginx

# Resource limits
docker run -m 512m --cpus 1.0 nginx
docker run --memory-reservation 256m nginx
docker run --cpuset-cpus 0,1 nginx
docker run --cpu-shares 512 nginx
docker run --pids-limit 100 nginx
docker run --ulimit nofile=65536:65536 nginx

# Restart policy
docker run --restart no nginx
docker run --restart always nginx
docker run --restart on-failure:5 nginx
docker run --restart unless-stopped nginx

# User and privileges
docker run -u 1001:1001 nginx
docker run --user node node:22
docker run --privileged nginx          # full host access (dangerous)
docker run --cap-add NET_ADMIN nginx
docker run --cap-drop ALL nginx
docker run --read-only nginx
docker run --tmpfs /tmp nginx

# Workdir and entrypoint
docker run -w /app nginx
docker run --entrypoint sh nginx

# Labels
docker run -l environment=prod nginx
docker run --label version=1.0 nginx

# Logging
docker run --log-driver json-file nginx
docker run --log-driver syslog nginx
docker run --log-opt max-size=10m --log-opt max-file=3 nginx

# Health check override
docker run --health-cmd "curl -f http://localhost/" nginx
docker run --no-healthcheck nginx
```

### Manage Containers

```bash
# List
docker ps                       # running
docker ps -a                    # all
docker ps -q                    # IDs only
docker ps --filter name=myapp   # by name
docker ps --filter status=running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Start / Stop / Restart
docker start CONTAINER
docker start -i CONTAINER       # attach interactive
docker stop CONTAINER
docker stop -t 30 CONTAINER     # timeout
docker kill CONTAINER           # SIGKILL
docker kill -s SIGINT CONTAINER # custom signal
docker restart CONTAINER
docker pause CONTAINER
docker unpause CONTAINER

# Remove
docker rm CONTAINER
docker rm -f CONTAINER          # force stop + remove
docker rm $(docker ps -aq)      # remove all stopped
docker container prune
docker container prune --filter "until=24h"

# Execute
docker exec CONTAINER COMMAND
docker exec -it CONTAINER bash
docker exec -it CONTAINER sh -c "ls -la && cat /etc/os-release"
docker exec -u root CONTAINER apt-get install -y vim
docker exec -w /tmp CONTAINER ls

# Attach / Detach
docker attach CONTAINER
# Detach: Ctrl+P, Ctrl+Q

# Logs
docker logs CONTAINER
docker logs -f CONTAINER
docker logs --tail 100 CONTAINER
docker logs --since 30m CONTAINER
docker logs --until 1h CONTAINER
docker logs -t CONTAINER        # timestamps
docker logs --details CONTAINER

# Inspect
docker inspect CONTAINER
docker inspect --format '{{.State.Status}}' CONTAINER
docker inspect --format '{{json .NetworkSettings}}' CONTAINER
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER

# Stats
docker stats
docker stats CONTAINER
docker stats --no-stream

# Top (processes)
docker top CONTAINER
docker top CONTAINER aux

# Events
docker events
docker events --filter type=container
docker events --filter container=myapp

# Diff (filesystem changes)
docker diff CONTAINER

# Export / Import
docker export CONTAINER > image.tar
docker export CONTAINER | docker import - myimage:latest
cat image.tar | docker import - myimage:latest

# Commit (create image from container)
docker commit CONTAINER myimage:latest
docker commit -m "Added vim" -a "me" CONTAINER myimage:1.0

# Rename
docker rename old_name new_name

# Update (change config of running container)
docker update --cpus 2 CONTAINER
docker update -m 1g CONTAINER
docker update --restart always CONTAINER

# Wait (block until container stops)
docker wait CONTAINER
```

## Image Commands

```bash
# Build
docker build PATH
docker build .
docker build -t myapp:1.0 .
docker build -t myapp:1.0 -f Dockerfile.prod .
docker build --build-arg NODE_ENV=production .
docker build --no-cache .
docker build --target builder .
docker build --platform linux/arm64 .

# Buildx (multi-platform, advanced)
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest . --push
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap

# Pull / Push
docker pull IMAGE
docker pull nginx:latest
docker pull nginx@sha256:abc123...
docker pull --all-tags nginx
docker push myapp:1.0
docker push --all-tags myapp

# List
docker images
docker image ls
docker images -a                # all (including intermediate)
docker images --filter dangling=true
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Remove
docker rmi IMAGE
docker rmi -f IMAGE              # force (even if used)
docker image prune              # dangling
docker image prune -a           # all unused
docker rmi $(docker images -q --filter dangling=true)

# Inspect
docker image inspect IMAGE
docker image inspect --format '{{.Size}}' IMAGE

# History
docker history IMAGE
docker history --no-trunc IMAGE

# Tag
docker tag SOURCE TARGET
docker tag myapp:1.0 myapp:latest
docker tag myapp:1.0 registry.com/myapp:1.0

# Save / Load
docker save -o image.tar myapp:1.0
docker save myapp:1.0 | gzip > image.tar.gz
docker load -i image.tar
docker load < image.tar.gz

# Import / Export
docker import image.tar myimage:latest

# Search
docker search nginx
docker search --filter stars=100 nginx
docker search --filter is-official=true nginx
```

## Volume Commands

```bash
# Create
docker volume create
docker volume create --driver local --name mydata
docker volume create --opt type=nfs --opt device=:/path mydata

# List
docker volume ls
docker volume ls --filter name=mydata

# Inspect
docker volume inspect mydata

# Remove
docker volume rm mydata
docker volume prune
docker volume prune --filter "until=24h"

# Remove all unused
docker volume prune -a
```

## Network Commands

```bash
# Create
docker network create mynet
docker network create --driver bridge mynet
docker network create --driver overlay mynet  # Swarm
docker network create --internal mynet        # no external access
docker network create --subnet 10.0.0.0/24 --gateway 10.0.0.1 mynet
docker network create --attachable mynet      # standalone containers can join

# List
docker network ls
docker network ls --filter driver=bridge

# Inspect
docker network inspect mynet
docker network inspect --format '{{json .Containers}}' mynet

# Connect / Disconnect
docker network connect mynet CONTAINER
docker network connect --alias web mynet CONTAINER
docker network disconnect mynet CONTAINER

# Remove
docker network rm mynet
docker network prune
```

## System Commands

```bash
# Info
docker info
docker info --format '{{.Driver}}'

# Version
docker version
docker version --format '{{.Server.Version}}'

# Disk usage
docker system df
docker system df -v

# Prune (cleanup)
docker system prune
docker system prune -a              # also unused images
docker system prune --volumes       # also volumes
docker system prune -a --volumes    # everything not in use
docker system prune --filter "until=24h"

# Events
docker system events
docker system events --filter type=image

# Login / Logout
docker login
docker login -u user -p pass
docker login registry.example.com
docker logout
docker logout registry.example.com
```

## Context Commands

```bash
# List contexts
docker context ls

# Create context (e.g., remote Docker)
docker context create remote --docker "host=ssh://user@server"
docker context create --docker host=unix:///var/run/docker.sock local

# Use context
docker context use remote

# Show current
docker context show

# Remove
docker context rm remote
```

## Compose Commands (v2)

```bash
# Up / Down
docker compose up [OPTIONS] [SERVICE...]
docker compose up -d
docker compose up --build
docker compose up --scale worker=3
docker compose up --force-recreate
docker compose up --remove-orphans

docker compose down [OPTIONS]
docker compose down -v               # remove volumes
docker compose down --rmi all        # remove images
docker compose down --remove-orphans

# Build
docker compose build [SERVICE...]
docker compose build --no-cache
docker compose build --pull

# Logs
docker compose logs [SERVICE...]
docker compose logs -f
docker compose logs --tail 50 web

# Exec / Run
docker compose exec SERVICE COMMAND
docker compose exec web bash
docker compose run --rm web npm test
docker compose run --rm -e DEBUG=true web npm test

# Start / Stop / Restart
docker compose start [SERVICE...]
docker compose stop [SERVICE...]
docker compose restart [SERVICE...]
docker compose pause [SERVICE...]
docker compose unpause [SERVICE...]

# Ps / Top
docker compose ps
docker compose ps --format json
docker compose top [SERVICE]

# Config
docker compose config
docker compose config --services    # list service names
docker compose config --volumes     # list volume names
docker compose config -q            # validate only

# Pull / Push
docker compose pull [SERVICE...]
docker compose push [SERVICE...]

# Images
docker compose images

# Events
docker compose events

# Convert (to Kubernetes manifest)
docker compose convert
```

## Swarm Commands

```bash
# Initialize swarm
docker swarm init
docker swarm init --advertise-addr 10.0.0.1

# Join swarm
docker swarm join --token TOKEN MANAGER_IP:2377

# Tokens
docker swarm join-token worker
docker swarm join-token manager

# Leave
docker swarm leave
docker swarm leave --force  # manager

# Services
docker service create --name web --replicas 3 -p 80:80 nginx
docker service ls
docker service ps web
docker service inspect web
docker service scale web=5
docker service update --image nginx:1.27 web
docker service rm web

# Stack (deploy Compose file to swarm)
docker stack deploy -c docker-compose.yml mystack
docker stack ls
docker stack ps mystack
docker stack services mystack
docker stack rm mystack
```

## Manifest Commands

```bash
# Inspect multi-platform manifest
docker manifest inspect IMAGE
docker manifest inspect nginx:latest
docker manifest inspect --verbose nginx:latest

# Create manifest list
docker manifest create myapp:latest myapp:amd64 myapp:arm64

# Push manifest
docker manifest push myapp:latest

# Annotate
docker manifest annotate --arch arm64 myapp:latest myapp:arm64
```

## Trust / Notary

```bash
# Enable content trust
export DOCKER_CONTENT_TRUST=1

# Sign image on push
docker push myapp:1.0

# Inspect trust data
docker trust inspect myapp:1.0

# Key management
docker trust key generate me
docker trust signer add me myapp
docker trust revoke myapp:1.0
```

## Plugin Management

```bash
# List plugins
docker plugin ls

# Install / Enable / Disable / Remove
docker plugin install PLUGIN
docker plugin enable PLUGIN
docker plugin disable PLUGIN
docker plugin rm PLUGIN
```

## Scouting / Scout

```bash
# Analyze image for vulnerabilities
docker scout quickview IMAGE
docker scout cves IMAGE
docker scout recommendations IMAGE
docker scout sbom IMAGE
```

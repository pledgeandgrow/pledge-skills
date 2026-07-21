# Docker Swarm

Docker Swarm is Docker's native container orchestration system, built directly into Docker Engine.

## Swarm Architecture

```
┌─────────────────────────────────────────┐
│           Swarm Cluster                  │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Manager  │  │ Manager  │  │Worker  ││
│  │ (leader) │  │          │  │        ││
│  └────┬─────┘  └────┬─────┘  └────────┘│
│       │              │                   │
│  ┌────┴──────────────┴─────────────┐    │
│  │     Raft Consensus              │    │
│  │     (state replication)         │    │
│  └─────────────────────────────────┘    │
│                                          │
│  Services → Tasks → Containers          │
└─────────────────────────────────────────┘
```

## Initialize Swarm

```bash
# Initialize on first manager
docker swarm init --advertise-addr 10.0.0.1

# With specific listen address
docker swarm init --advertise-addr eth0:2377 --listen-addr eth0:2377

# Specify data path port (for multi-network setups)
docker swarm init --data-path-port 7890

# Get join tokens
docker swarm join-token worker
docker swarm join-token manager

# Rotate tokens (security)
docker swarm join-token --rotate worker
docker swarm join-token --rotate manager
```

## Join Swarm

```bash
# Join as worker
docker swarm join --token SWMTKN-1-xxx 10.0.0.1:2377

# Join as manager
docker swarm join --token SWMTKN-1-xxx-yyy 10.0.0.1:2377

# With specific advertise address
docker swarm join --token TOKEN --advertise-addr 10.0.0.2 10.0.0.1:2377

# Leave swarm
docker swarm leave        # worker
docker swarm leave --force  # manager (last manager)

# Remove a node from manager
docker node rm NODE_ID
```

## Node Management

```bash
# List nodes
docker node ls
docker node ls --filter role=manager

# Inspect node
docker node inspect NODE_ID --pretty

# Update node
docker node update --label-add region=east node-1
docker node update --label-add disk=ssd node-1
docker node update --availability drain node-1    # stop scheduling
docker node update --availability active node-1   # resume scheduling
docker node update --availability pause node-1    # no new tasks

# Promote/demote
docker node promote node-1   # worker → manager
docker node demote node-1    # manager → worker

# View tasks on node
docker node ps node-1
docker node ps --filter desired-state=running node-1
```

## Services

### Create Services

```bash
# Basic service
docker service create --name web -p 80:80 nginx

# With replicas
docker service create --name web --replicas 3 -p 80:80 nginx

# With constraints (node labels)
docker service create \
  --name web \
  --replicas 3 \
  --constraint node.labels.region==east \
  nginx

# With placement preferences
docker service create \
  --name web \
  --replicas 6 \
  --placement-pref spread=node.labels.region \
  nginx

# With resource limits
docker service create \
  --name api \
  --replicas 3 \
  --limit-cpu 0.5 \
  --limit-memory 512m \
  --reserve-cpu 0.25 \
  --reserve-memory 256m \
  myapi

# With environment variables
docker service create \
  --name api \
  --env NODE_ENV=production \
  --env DB_HOST=db \
  myapi

# With health check
docker service create \
  --name web \
  --health-cmd="curl -f http://localhost/ || exit 1" \
  --health-interval=10s \
  --health-retries=3 \
  nginx

# Global service (one per node)
docker service create --name monitor --mode global mymonitor

# With update config
docker service create \
  --name web \
  --replicas 10 \
  --update-parallelism 2 \
  --update-delay 30s \
  --update-failure-action rollback \
  nginx

# With rollback config
docker service create \
  --name web \
  --replicas 10 \
  --rollback-parallelism 1 \
  --rollback-delay 10s \
  --rollback-monitor 60s \
  --rollback-failure-action continue \
  nginx
```

### Manage Services

```bash
# List services
docker service ls
docker service ls --filter name=web

# Inspect
docker service inspect web --pretty

# View tasks (containers)
docker service ps web
docker service ps --filter desired-state=running web
docker service ps --filter desired-state=failed web

# Scale
docker service scale web=5
docker service scale web=5 api=3

# Update image
docker service update --image nginx:1.27 web

# Update environment
docker service update --env-rm NODE_ENV --env-add NODE_ENV=staging web

# Update ports
docker service update --publish-rm 80:80 --publish-add 8080:80 web

# Add/remove labels
docker service update --label-add version=2.0 web
docker service update --label-rm version web

# Force update (recreate all tasks)
docker service update --force web

# Rollback to previous version
docker service rollback web

# Remove
docker service rm web
```

### Service Logs

```bash
# View logs (all tasks)
docker service logs web

# Follow logs
docker service logs -f web

# Specific task
docker service logs web.1

# Last N lines
docker service logs --tail 100 web

# Since time
docker service logs --since 30m web

# Details (with timestamps)
docker service logs --details --timestamps web
```

## Stack (Compose on Swarm)

### Deploy Stack

```bash
# Deploy from Compose file
docker stack deploy -c docker-compose.yml mystack

# With multiple files
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml mystack

# With environment file
docker stack deploy -c docker-compose.yml --env-file .env.prod mystack

# With compose file that uses build (must pre-build and push)
# Swarm pulls from registry, cannot build locally
docker stack deploy -c docker-compose.yml mystack --with-registry-auth
```

### Compose File for Swarm

```yaml
# docker-compose.yml (Swarm-compatible)
services:
  web:
    image: myregistry.com/myapp:latest  # must be in registry
    deploy:
      replicas: 3
      update_config:
        parallelism: 2
        delay: 30s
        failure_action: rollback
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
        window: 120s
      placement:
        constraints:
          - node.labels.region == east
        preferences:
          - spread: node.labels.zone
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
      labels:
        - "com.example.stack=mystack"
    ports:
      - "80:80"
    networks:
      - frontend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 10s
      timeout: 5s
      retries: 3

  db:
    image: postgres:17
    deploy:
      placement:
        constraints:
          - node.role == manager
    volumes:
      - dbdata:/var/lib/postgresql/data
    networks:
      - backend

networks:
  frontend:
    driver: overlay
  backend:
    driver: overlay
    internal: true  # no external access

volumes:
  dbdata:
    driver: local
```

### Manage Stacks

```bash
# List stacks
docker stack ls

# List services in stack
docker stack services mystack

# List tasks in stack
docker stack ps mystack
docker stack ps --filter desired-state=running mystack

# Remove stack
docker stack rm mystack
```

## Secrets in Swarm

```bash
# Create secret from file
echo "mysecret" | docker secret create db_password -
docker secret create tls_cert ./cert.pem

# List secrets
docker secret ls

# Use in service
docker service create \
  --name api \
  --secret db_password \
  --secret source=tls_cert,target=/certs/cert.pem \
  myapi

# Update secret (create new, update service, remove old)
echo "newsecret" | docker secret create db_password_v2 -
docker service update --secret-rm db_password --secret-add source=db_password_v2,target=db_password api
docker secret rm db_password

# Remove secret
docker secret rm db_password
```

## Configs in Swarm

```bash
# Create config from file
docker config create nginx_conf ./nginx.conf

# List configs
docker config ls

# Use in service
docker service create \
  --name web \
  --config source=nginx_conf,target=/etc/nginx/nginx.conf \
  nginx

# Remove
docker config rm nginx_conf
```

## Networking in Swarm

```bash
# Overlay network (cross-host)
docker network create --driver overlay myoverlay
docker network create --driver overlay --subnet 10.0.0.0/24 myoverlay

# Internal network (no external access)
docker network create --driver overlay --internal myinternal

# Attachable overlay (standalone containers can join)
docker network create --driver overlay --attachable myattachable

# Ingress network (routing mesh)
# Default ingress network handles published ports
# All nodes route to any container with that port

# Custom ingress
docker network create --driver overlay --ingress myingress
```

### Routing Mesh

```
# Published ports are available on ALL swarm nodes
# Even if the container isn't on that node

# External request → any node → routing mesh → container
# Load balancing is built-in (IPVS)

# Bypass routing mesh (host mode)
docker service create --name web --mode host -p 80:80 nginx
# Only on nodes where the container runs
```

## Visualizer and Monitoring

```bash
# Run Swarm Visualizer
docker service create \
  --name viz \
  --publish 8080:8080 \
  --constraint node.role==manager \
  --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  dockersamples/visualizer

# Portainer for Swarm
docker service create \
  --name portainer \
  --publish 9000:9000 \
  --constraint node.role==manager \
  --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  --mount type=volume,src=portainer_data,dst=/data \
  portainer/portainer-ce
```

## Backup and Restore

```bash
# Backup swarm manager state
# On manager node:
docker swarm unlock-key  # save this
sudo tar czf swarm-backup.tar.gz /var/lib/docker/swarm

# Restore (on new manager)
sudo systemctl stop docker
sudo rm -rf /var/lib/docker/swarm
sudo tar xzf swarm-backup.tar.gz -C /
sudo systemctl start docker
docker swarm init --force-new-cluster

# Unlock swarm (if auto-lock is enabled)
docker swarm unlock
```

## Auto-Lock

```bash
# Enable auto-lock (encrypt raft logs at rest)
docker swarm update --autolock=true

# Get unlock key
docker swarm unlock-key

# Rotate unlock key
docker swarm unlock-key --rotate

# Unlock after manager restart
docker swarm unlock
# Enter the unlock key
```

## Production Tips

```bash
# 3 or 5 managers for quorum (odd number)
# Managers should be dedicated (no user workloads)
# Workers run application containers

# Drain a node for maintenance
docker node update --availability drain node-1

# After maintenance
docker node update --availability active node-1

# Monitor cluster health
docker node ls
docker service ls
docker info --format '{{.Swarm}}'

# Clean up unused services
docker service rm $(docker service ls -q)

# Prune
docker system prune -a  # on each node
```

# Compose Advanced Features

## Configs

Configs are similar to secrets but designed for non-sensitive data. They are mounted as read-only files.

```yaml
services:
  web:
    image: nginx:latest
    configs:
      - source: nginx_config
        target: /etc/nginx/conf.d/default.conf
        uid: "1000"
        gid: "1000"
        mode: 0440

configs:
  # From file
  nginx_config:
    file: ./nginx/default.conf
  
  # From environment variable
  app_config:
    environment: APP_CONFIG_JSON
  
  # From external source
  external_config:
    external: true
    name: my_external_config
  
  # With labels (Swarm only)
  labeled_config:
    file: ./app.conf
    labels:
      - "com.example.config=app"
```

## Secrets

Secrets are for sensitive data (passwords, keys, certificates). They are mounted as read-only files.

```yaml
services:
  db:
    image: postgres:17
    secrets:
      - source: db_password
        target: /run/secrets/db_password
        uid: "999"  # postgres user
        gid: "999"
        mode: 0440
  
  web:
    image: myapp
    secrets:
      - api_key
      - source: tls_cert
        target: /app/certs/server.crt

secrets:
  # From file
  db_password:
    file: ./secrets/db_password.txt
  
  api_key:
    file: ./secrets/api_key.txt
  
  # From environment variable
  jwt_secret:
    environment: JWT_SECRET
  
  # External (pre-created in Swarm)
  tls_cert:
    external: true
    name: tls_certificate
  
  # With labels
  db_cert:
    file: ./secrets/db.pem
    labels:
      - "com.example.secret=db"
```

```bash
# Create secret in Swarm
echo "mysecret" | docker secret create db_password -
docker secret ls
docker secret inspect db_password
docker secret rm db_password
```

## Watch Mode (Compose Watch)

Automatically syncs files from host to container when they change.

```yaml
services:
  web:
    build: .
    develop:
      watch:
        # Sync on file change
        - action: sync
          path: ./src
          target: /app/src
          ignore:
            - node_modules/
        
        # Rebuild image on Dockerfile change
        - action: rebuild
          path: ./Dockerfile
        
        - action: rebuild
          path: ./package.json
        
        # Sync + restart container
        - action: sync+restart
          path: ./config
          target: /app/config
```

```bash
# Start with watch mode
docker compose watch

# Watch specific service
docker compose watch web

# Up + watch together
docker compose up --watch
```

## GPU Support

```yaml
services:
  ml:
    image: pytorch/pytorch:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
            # Or specific GPU
            - driver: nvidia
              device_ids: ['0', '1']
              capabilities: [gpu, compute, utility]
    
    # Alternative: runtime
    runtime: nvidia
    environment:
      NVIDIA_VISIBLE_DEVICES: all
      NVIDIA_DRIVER_CAPABILITIES: compute,utility
```

```bash
# Run with GPU
docker run --gpus all pytorch/pytorch:latest
docker run --gpus 2 pytorch/pytorch:latest
docker run --gpus '"device=0,1"' pytorch/pytorch:latest
docker run --gpus all --runtime nvidia pytorch/pytorch:latest
```

## Capabilities

```yaml
services:
  web:
    cap_add:
      - NET_ADMIN      # network administration
      - SYS_PTRACE     # process tracing
      - NET_BIND_SERVICE  # bind to ports < 1024
    
    cap_drop:
      - ALL             # drop all, then add specific
    
    # Or drop all and add only needed
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

```bash
# CLI equivalent
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

## Security Options

```yaml
services:
  web:
    security_opt:
      - no-new-privileges:true
      - label:user:USER     # SELinux
      - label:type:TYPE
      - apparmor:docker-default  # AppArmor profile
      - seccomp:unconfined  # or custom profile path
```

## Sysctls

```yaml
services:
  web:
    sysctls:
      net.core.somaxconn: 1024
      net.ipv4.tcp_syncookies: 1
      # Using string format
      - net.ipv4.ip_forward=1
```

## Ulimits

```yaml
services:
  web:
    ulimits:
      nproc: 65535
      nofile:
        soft: 20000
        hard: 40000
      memlock:
        soft: -1
        hard: -1
```

## Shared Memory and IPC

```yaml
services:
  web:
    shm_size: 256m           # /dev/shm size
    ipc: host                # share host IPC namespace
    # or
    ipc: shareable           # container's IPC is shareable
    
  db:
    ipc: "service:web"       # share IPC with web service
    shm_size: 1g
```

## PID and UTS Namespace

```yaml
services:
  web:
    pid: host                # share host PID namespace
    # or
    pid: "service:db"        # share PID with db service
  
    uts: host                # share host UTS (hostname) namespace
```

## Device Mappings

```yaml
services:
  iot:
    image: myapp
    devices:
      - /dev/ttyUSB0
      - /dev/sda:/dev/xvda
      - /dev/usb/bus/001/002:/dev/usb/device
    # With permissions
    device_requests:
      - driver: nvidia
        count: 1
        capabilities:
          - [gpu, compute]
```

## Init

```yaml
services:
  web:
    init: true    # run tini as PID 1 for proper signal handling
    # or
    init: /usr/bin/tini
```

## Extra Hosts

```yaml
services:
  web:
    extra_hosts:
      - "host.docker.internal:host-gateway"
      - "api.example.com:10.0.0.5"
      - "db.local:192.168.1.100"
```

## Annotations

```yaml
services:
  web:
    annotations:
      - "com.example.description=Web service"
      - "com.example.team=backend"
    # Also per-platform
    annotations:
      com.example.description: "Web service"
```

## Pull Policy

```yaml
services:
  web:
    image: myapp:latest
    pull_policy: always      # always, missing, never, build, if_not_present
```

## Compose Bridge

Compose Bridge transforms Compose files to Kubernetes manifests.

```bash
# Install Compose Bridge
docker extension install docker/compose-bridge-extension

# Convert Compose to Kubernetes
docker compose bridge --output kubernetes

# Convert to specific platform
docker compose bridge --target kubernetes -f docker-compose.yml

# Convert to Helm chart
docker compose bridge --target helm -f docker-compose.yml

# Convert to CloudFormation
docker compose bridge --target cloudformation -f docker-compose.yml
```

## Compose File Validation

```bash
# Validate compose file
docker compose config -q

# Show merged config (including overrides)
docker compose config

# List services
docker compose config --services

# List volumes
docker compose config --volumes

# List networks
docker compose config --networks

# Show as JSON
docker compose config --format json
```

## Compose Environment Interpolation

```yaml
# .env file
POSTGRES_USER=myuser
POSTGRES_PASSWORD=secret
COMPOSE_PROJECT_NAME=myapp

# docker-compose.yml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-default_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?required}
      POSTGRES_DB: ${POSTGRES_DB:-${POSTGRES_USER}_db}
    
    # Use $$ to escape (literal $)
    command: ["postgres", "-c", "log_statement=$$${LOG_LEVEL:-none}"]
```

```bash
# Override .env file
docker compose --env-file .env.production up -d

# Set variable inline
POSTGRES_PASSWORD=secret docker compose up -d

# Project name (affects container names and network names)
docker compose -p myproject up -d
# Container: myproject-web-1
# Network: myproject_default
```

## Multiple Compose Files

```bash
# Files are merged in order (later overrides earlier)
docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.prod.yml up

# Common patterns:
# docker-compose.yml          — base config
# docker-compose.override.yml — dev overrides (auto-loaded)
# docker-compose.prod.yml     — production overrides
# docker-compose.test.yml     — test overrides
```

```yaml
# docker-compose.yml (base)
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production

# docker-compose.override.yml (dev — auto-loaded)
services:
  web:
    environment:
      NODE_ENV: development
      DEBUG: "true"
    volumes:
      - ./src:/app/src
    command: npm run dev

# docker-compose.prod.yml (production)
services:
  web:
    environment:
      NODE_ENV: production
    volumes: !reset []  # clear volumes from base
    restart: unless-stopped
    deploy:
      replicas: 3
```

## Compose Profiles (Advanced)

```yaml
services:
  web:
    image: myapp
    profiles: ["default", "dev"]
  
  debug:
    image: myapp:debug
    profiles: ["debug"]
    depends_on: [web]
  
  test:
    image: myapp:test
    profiles: ["test"]
  
  db:
    image: postgres:17
    # No profile = always started
  
  cache:
    image: redis:8
    profiles: ["dev", "prod"]

# Start default (web + db)
docker compose up

# Start with profile
docker compose --profile debug up
docker compose --profile prod up

# Start specific profile service
docker compose --profile test run test

# Multiple profiles
docker compose --profile debug --profile prod up
```

# Docker Compose Reference

## Basic Structure

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
  
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

## Commands

```bash
# Start services (foreground)
docker compose up

# Start in background
docker compose up -d

# Build and start
docker compose up --build

# Start specific services
docker compose up web db

# Stop and remove containers
docker compose down

# Stop and remove with volumes
docker compose down -v

# Stop without removing
docker compose stop

# Restart services
docker compose restart

# Rebuild images
docker compose build
docker compose build --no-cache

# Pull latest images
docker compose pull

# View logs
docker compose logs
docker compose logs -f web
docker compose logs --tail 50 web

# Run a one-off command
docker compose exec web bash
docker compose run --rm web npm test

# Scale services (limited — use deploy.replicas for Swarm)
docker compose up --scale worker=3

# List services
docker compose ps

# Show config (merged and validated)
docker compose config

# Validate without showing
docker compose config -q
```

## Service Configuration

### Build

```yaml
services:
  web:
    # Build from current directory
    build: .
    
    # Build with options
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
      target: production  # multi-stage target
      cache_from:
        - myapp:cache
      labels:
        - "com.myapp.version=1.0"
    
    # Use pre-built image
    image: myapp:1.0
    
    # Pull policy
    pull_policy: always  # always, missing, never, build
```

### Ports

```yaml
services:
  web:
    # Short syntax
    ports:
      - "3000:3000"        # host:container
      - "80:80"
      - "443:443"
      - "3000"             # random host port → container 3000
    
    # Long syntax
    ports:
      - target: 3000
        published: "3000"
        protocol: tcp
        mode: host
      - target: 80
        published: "8080"
        protocol: tcp
```

### Environment Variables

```yaml
services:
  web:
    # List syntax
    environment:
      - NODE_ENV=production
      - API_KEY=secret
    
    # Map syntax (preferred)
    environment:
      NODE_ENV: production
      API_KEY: secret
      DB_URL: postgres://user:pass@db:5432/mydb
    
    # From file
    env_file:
      - .env
      - .env.production
    
    # Single env file
    env_file: .env
```

### .env File

```bash
# .env file (same directory as docker-compose.yml)
POSTGRES_USER=myuser
POSTGRES_PASSWORD=secret
POSTGRES_DB=mydb
PORT=3000
```

```yaml
# Use in compose file with variable interpolation
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
  
  web:
    ports:
      - "${PORT}:3000"
```

### Volumes

```yaml
services:
  web:
    volumes:
      # Named volume
      - data:/app/data
      
      # Bind mount (host path)
      - ./src:/app/src
      - ./config:/app/config:ro  # read-only
      
      # Anonymous volume
      - /app/tmp
      
      # Long syntax
      - type: volume
        source: data
        target: /app/data
        read_only: false
      - type: bind
        source: ./src
        target: /app/src
        consistency: cached  # cached (macOS), consistent, delegated

volumes:
  data:
    # Named volume with driver
    driver: local
  data_nfs:
    driver: local
    driver_opts:
      type: nfs
      o: addr=10.0.0.1,rw
      device: ":/path/to/dir"
```

### Networks

```yaml
services:
  web:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend
  
  redis:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # no external access
  existing:
    name: my-existing-network
    external: true
```

### depends_on

```yaml
services:
  web:
    depends_on:
      - db
      - redis
  
  # With conditions (Compose spec)
  web:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
  
  db:
    image: postgres:17
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
```

### Health Checks

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      start_period: 10s
      retries: 3
    
    # Disable health check
    healthcheck:
      disable: true
```

### Restart Policies

```yaml
services:
  web:
    restart: no           # default — never restart
    restart: always       # always restart
    restart: on-failure   # restart on non-zero exit
    restart: on-failure:5 # max 5 restarts
    restart: unless-stopped  # always except manual stop
```

### Resource Limits

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Profiles

```yaml
services:
  web:
    image: myapp
    profiles:
      - default
  
  debug:
    image: myapp:debug
    profiles:
      - debug
  
  test:
    image: myapp:test
    profiles:
      - test

# Start default profile
docker compose up

# Start with debug profile
docker compose --profile debug up

# Start specific profile
docker compose --profile test up test
```

### extends

```yaml
# base.yml
services:
  web:
    image: myapp
    environment:
      NODE_ENV: production

# docker-compose.yml
services:
  web:
    extends:
      file: base.yml
      service: web
    environment:
      DEBUG: "true"  # adds to/overrides base
```

### override

```yaml
# docker-compose.yml (base)
services:
  web:
    image: myapp
    ports:
      - "3000:3000"

# docker-compose.override.yml (auto-loaded)
services:
  web:
    environment:
      DEBUG: "true"
    volumes:
      - ./src:/app/src  # hot reload for dev

# docker compose up automatically merges both files
# Explicit override files
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Full Application Example

```yaml
services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      target: production
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - frontend

  # Backend API
  backend:
    build:
      context: ./backend
      args:
        NODE_ENV: production
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:${DB_PASSWORD}@db:5432/appdb
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    restart: unless-stopped
    networks:
      - frontend
      - backend
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G

  # Database
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: appdb
    volumes:
      - dbdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    networks:
      - backend

  # Cache
  redis:
    image: redis:8-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    restart: unless-stopped
    networks:
      - backend

  # Worker (background jobs)
  worker:
    build:
      context: ./backend
      target: worker
    environment:
      DATABASE_URL: postgres://app:${DB_PASSWORD}@db:5432/appdb
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    networks:
      - backend
    deploy:
      replicas: 2

volumes:
  dbdata:
  redisdata:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

## Development vs Production

### docker-compose.yml (base / development)

```yaml
services:
  web:
    build:
      context: .
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules  # anonymous volume to prevent host override
    environment:
      NODE_ENV: development
      DEBUG: "true"
    command: npm run dev  # hot reload
```

### docker-compose.prod.yml (production override)

```yaml
services:
  web:
    build:
      target: production
    ports:
      - "80:3000"
    volumes: []  # remove bind mounts
    environment:
      NODE_ENV: production
    command: ["node", "server.js"]
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G

# Usage
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Compose File Versions

```yaml
# No version needed in modern Docker Compose v2
# The 'version' field is deprecated and ignored

# Just start with:
services:
  # ...

# Old format (deprecated):
# version: "3.8"
# services:
#   # ...
```

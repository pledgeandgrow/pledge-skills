---
name: docker-docs
version: "28.x"
tags:
  - docker
  - containers
  - devops
  - dockerfile
  - docker-compose
  - containerization
  - ci-cd
  - orchestration
description: >
  Comprehensive Docker 28.x reference covering all features: installation, Dockerfile
  instructions, multi-stage builds, Docker Compose, networking, volumes, CLI commands,
  image management, registries, security best practices, CI/CD integration, debugging,
  and Kubernetes migration. Use whenever the user mentions Docker, containers,
  Dockerfile, docker-compose, containerization, or needs help with any Docker-related
  task including building images, orchestrating services, or debugging containers.
---

# Docker

Docker is a platform for developing, shipping, and running applications in containers. Containers package code with all dependencies, ensuring consistent behavior across environments.

**Version**: Docker 28.x (Engine) / Docker Compose v2

---

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started (install, first container, concepts) | `getting-started.md` |
| Dockerfile (instructions, multi-stage, build args, best practices) | `dockerfile.md` |
| Docker Compose (services, networks, volumes, profiles) | `compose.md` |
| CLI Commands (full command reference) | `commands.md` |
| Networking (bridge, host, overlay, DNS, port mapping) | `networking.md` |
| Volumes & Storage (named volumes, bind mounts, tmpfs) | `volumes.md` |
| Best Practices (image optimization, security, layer caching) | `best-practices.md` |
| Registry & Images (Docker Hub, private registry, tagging) | `registry.md` |
| CI/CD & Automation (GitHub Actions, GitLab CI, caching) | `cicd.md` |
| Debugging (logs, exec, inspect, health checks, troubleshooting) | `debugging.md` |
| Kubernetes (Docker + K8s, Compose to K8s migration) | `kubernetes.md` |
| Advanced Build (Bake, drivers, exporters, attestation, cache types) | `advanced-build.md` |
| Daemon & Logging (daemon.json, logging drivers, rootless, remote API) | `daemon-logging.md` |
| Scout, Desktop & Ecosystem (Scout, Desktop, Engine API, Testcontainers, Sandboxes, Gordon, Docker Agent) | `scout-desktop.md` |
| Compose Advanced (configs, secrets, watch, GPU, capabilities, sysctls) | `compose-advanced.md` |
| Security Deep Dive (namespaces, cgroups, capabilities, seccomp, AppArmor, SELinux, DCT) | `security.md` |
| Docker Hub Management (organizations, teams, permissions, API, SSO, audit logs) | `hub-management.md` |
| Docker Swarm (services, stacks, secrets, configs, routing mesh, auto-lock) | `swarm.md` |

---

## Core Concepts

- **Image**: Read-only template with code, libraries, and dependencies
- **Container**: Running instance of an image with its own filesystem, network, and process space
- **Dockerfile**: Text file with instructions to build an image
- **Docker Compose**: Tool for defining multi-container applications
- **Registry**: Storage for images (Docker Hub, private registries)
- **Volume**: Persistent storage that survives container removal
- **Network**: Virtual network for container communication
- **BuildKit**: Modern build backend with caching, parallelism, and multi-platform support

---

## First Container

```bash
# Pull and run an image
docker run hello-world

# Run an interactive container
docker run -it ubuntu:24.04 bash

# Run a web server
docker run -d -p 8080:80 --name web nginx:latest

# List running containers
docker ps

# Stop and remove
docker stop web
docker rm web
```

---

## Dockerfile at a Glance

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Docker Compose at a Glance

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

---

## Official Documentation

- [Docker Docs](https://docs.docker.com/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Hub](https://hub.docker.com/)

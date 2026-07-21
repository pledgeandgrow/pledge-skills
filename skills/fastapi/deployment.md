# FastAPI — Deployment

## About FastAPI Versions

FastAPI follows semantic versioning. Check the current version:

```bash
pip show fastapi
```

Upgrade:

```bash
pip install --upgrade fastapi
```

**Source**: [versions](https://fastapi.tiangolo.com/deployment/versions/)

---

## FastAPI Cloud

FastAPI Cloud is the official deployment platform. Deploy directly from your repository with automatic HTTPS, CI/CD, and monitoring.

**Source**: [fastapicloud](https://fastapi.tiangolo.com/deployment/fastapicloud/)

---

## About HTTPS

HTTPS is essential for production. Options:
- Use a reverse proxy (Nginx, Traefik, Caddy) that handles TLS
- Use a cloud provider that handles HTTPS automatically
- Use Let's Encrypt with Certbot for free certificates

Key concepts:
- **TLS/SSL certificate**: proves server identity
- **Domain name**: required for trusted certificates
- **Port 443**: default HTTPS port

**Source**: [https](https://fastapi.tiangolo.com/deployment/https/)

---

## Run a Server Manually

```bash
fastapi run main.py --host 0.0.0.0 --port 80
```

Or with Uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 80
```

For production, use `fastapi run` (no reload) or `uvicorn` with `--workers`.

**Source**: [manually](https://fastapi.tiangolo.com/deployment/manually/)

---

## Deployments Concepts

### Server programs

- **Uvicorn**: ASGI server, runs the FastAPI app
- **Gunicorn**: process manager, can manage Uvicorn workers
- **fastapi run**: CLI command that uses Uvicorn underneath

### Workers

```bash
fastapi run --workers 4
# or
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Load balancing

Multiple workers behind a load balancer (Nginx, HAProxy, cloud LB) for:
- High availability
- Horizontal scaling
- Zero-downtime deployments

### Memory and CPU

- Each worker is a separate process with its own memory
- CPU-bound tasks block the event loop — use `def` (sync) path operations or separate workers
- Memory-intensive operations should be offloaded to background task systems

**Source**: [concepts](https://fastapi.tiangolo.com/deployment/concepts/)

---

## Deploy FastAPI on Cloud Providers

Supported cloud providers:
- **AWS** (ECS, EKS, EC2, Lambda + API Gateway)
- **Google Cloud** (Cloud Run, GKE, Compute Engine)
- **Azure** (Container Apps, AKS, App Service)
- **DigitalOcean** (App Platform, Droplets)
- **Render**, **Railway**, **Fly.io**

General pattern:
1. Containerize the app (Docker)
2. Push to container registry
3. Deploy to cloud service
4. Configure environment variables
5. Set up custom domain + HTTPS

**Source**: [cloud](https://fastapi.tiangolo.com/deployment/cloud/)

---

## Server Workers — Uvicorn with Workers

```bash
# Using fastapi CLI
fastapi run --workers 4

# Using Uvicorn directly
uvicorn main:app --workers 4

# Using Gunicorn with Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

- Each worker is a separate process
- Recommended: `(2 x $num_cores) + 1` workers
- Workers share the same port via pre-forking

**Source**: [server-workers](https://fastapi.tiangolo.com/deployment/server-workers/)

---

## FastAPI in Containers — Docker

### Project structure

```
.
├── app/
│   ├── __init__.py
│   └── main.py
├── requirements.txt
└── Dockerfile
```

### Dockerfile

```dockerfile
FROM python:3.14

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--port", "80"]
```

### Build and run

```bash
docker build -t myfastapi .
docker run -d --name mycontainer -p 80:80 myfastapi
```

### Docker Image with uv

```dockerfile
FROM python:3.14

WORKDIR /code

COPY pyproject.toml /code/pyproject.toml

RUN pip install uv && uv sync

COPY ./app /code/app

CMD ["uv", "run", "fastapi", "run", "app/main.py", "--port", "80"]
```

### Replication — Number of Processes

- **One process per container**: simplest, scale by running multiple containers
- **Multiple processes per container**: use `--workers` flag, but one container = one scaling unit
- **Load balancer**: distribute traffic across containers

### Best practices

- Copy `requirements.txt` before code for Docker cache optimization
- Use `--no-cache-dir` with pip to keep image small
- Use multi-stage builds for smaller images
- Run as non-root user
- Use `.dockerignore` to exclude unnecessary files

**Source**: [docker](https://fastapi.tiangolo.com/deployment/docker/)

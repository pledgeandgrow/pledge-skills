# Deployment — Django 6.0

## WSGI Deployment

```python
# myproject/wsgi.py
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
application = get_wsgi_application()
```

### Gunicorn

```bash
# Install
pip install gunicorn

# Basic
gunicorn myproject.wsgi:application

# Production
gunicorn myproject.wsgi:application \
    --workers 4 \
    --bind 0.0.0.0:8000 \
    --access-logfile - \
    --error-logfile - \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50

# With Uvicorn worker (async support)
gunicorn myproject.asgi:application \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
```

## ASGI Deployment

```python
# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
application = get_asgi_application()
```

### Uvicorn

```bash
# Install
pip install uvicorn

# Development
uvicorn myproject.asgi:application --reload --host 0.0.0.0 --port 8000

# Production
uvicorn myproject.asgi:application \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 4 \
    --proxy-headers \
    --forwarded-allow-ips="*"
```

### Daphne

```bash
pip install daphne
daphne myproject.asgi:application --port 8000 --bind 0.0.0.0
```

## Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

```yaml
# docker-compose.yml
version: "3.9"

services:
  web:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./staticfiles:/app/staticfiles
    depends_on:
      - web

volumes:
  postgres_data:
```

```nginx
# nginx.conf
upstream django {
    server web:8000;
}

server {
    listen 80;
    server_name example.com;
    charset utf-8;

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

## Static Files in Production

```bash
# Collect static files
python manage.py collectstatic --noinput

# Using WhiteNoise (serves static files via Django)
pip install whitenoise

# settings.py
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # After SecurityMiddleware
    # ...
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

## Environment Variables

```python
# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}
```

```bash
# .env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_ALLOWED_HOSTS=example.com,www.example.com
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
```

## Deployment Checklist

```bash
python manage.py check --deploy
```

**Must-have for production:**
- `DEBUG = False`
- `SECRET_KEY` from environment variable
- `ALLOWED_HOSTS` set correctly
- `SECURE_SSL_REDIRECT = True`
- `SESSION_COOKIE_SECURE = True`
- `CSRF_COOKIE_SECURE = True`
- `SECURE_HSTS_SECONDS = 31536000`
- `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
- `SECURE_CONTENT_TYPE_NOSNIFF = True`
- `X_FRAME_OPTIONS = "DENY"`
- Static files collected (`collectstatic`)
- Database connection pooling configured
- Logging configured
- Error monitoring (Sentry, etc.)

## Database Connection Pooling

```python
# Using django-db-connection-pool
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mydb",
        "USER": "myuser",
        "PASSWORD": "...",
        "HOST": "localhost",
        "PORT": "5432",
        "CONN_MAX_AGE": 60,
        "CONN_HEALTH_CHECKS": True,
        "OPTIONS": {
            "pool": {
                "min_size": 5,
                "max_size": 20,
                "timeout": 30,
            },
        },
    }
}
```

## Health Checks

```python
# urls.py
from django.http import JsonResponse

def health_check(request):
    checks = {
        "database": "ok",
        "cache": "ok",
    }
    try:
        from django.db import connection
        connection.ensure_connection()
    except Exception:
        checks["database"] = "error"
    try:
        from django.core.cache import cache
        cache.set("health", "check", timeout=10)
    except Exception:
        checks["cache"] = "error"

    status = 200 if all(v == "ok" for v in checks.values()) else 503
    return JsonResponse(checks, status=status)

urlpatterns = [
    path("health/", health_check),
]
```

## CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install -r requirements.txt
      - run: python manage.py test
      - run: python manage.py check --deploy

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        run: |
          ssh user@server "cd /app && git pull && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput && sudo systemctl restart gunicorn"
```

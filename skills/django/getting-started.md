# Getting Started — Django 6.0

## Installation

```bash
# Using pip
pip install django

# Using pip with specific version
pip install django==6.0

# Verify installation
python -m django --version
```

## Project Structure

```bash
# Create project
django-admin startproject myproject

# Resulting structure:
myproject/
    manage.py
    myproject/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

### Create an App

```bash
python manage.py startapp myapp

# Resulting structure:
myapp/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

### Register App

```python
# myproject/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "myapp",  # Add your app
]
```

## Settings Overview

Key settings in `settings.py`:

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-change-me-in-production"

DEBUG = True  # Set to False in production

ALLOWED_HOSTS = []  # Add your domain in production

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mydb",
        "USER": "myuser",
        "PASSWORD": "mypassword",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# SQLite (default)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

## Management Commands

```bash
# Run development server
python manage.py runserver
python manage.py runserver 0.0.0.0:8000

# Database
python manage.py makemigrations
python manage.py migrate
python manage.py sqlmigrate myapp 0001
python manage.py showmigrations

# Superuser and admin
python manage.py createsuperuser
python manage.py changepassword <username>

# Shell
python manage.py shell
python manage.py dbshell

# Testing
python manage.py test
python manage.py test myapp.tests.TestClass.test_method

# Static files
python manage.py collectstatic

# Check
python manage.py check
python manage.py check --deploy
```

## Django Version History

| Version | Python Support | Key Features |
|---------|---------------|--------------|
| 6.0 | 3.12, 3.13, 3.14 | Async ORM, tasks framework, composite PKs, CSP |
| 5.2 | 3.10+ | Async ORM improvements, generated fields |
| 5.1 | 3.10+ | GeneratedField, db_default, JavaScript i18n |
| 5.0 | 3.10+ | Database defaults, async ORM (partial), field choices |
| 4.2 | 3.8+ | Async views, psycogp3, view-level caching |

## Requirements

- **Python**: 3.12, 3.13, or 3.14
- **Database**: PostgreSQL 14+, MySQL 8.0.11+, MariaDB 10.4+, SQLite 3.27+
- **ASGI server** (async): Uvicorn, Daphne, Hypercorn

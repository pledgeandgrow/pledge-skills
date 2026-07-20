---
name: django-docs
version: "6.0"
tags:
  - django
  - python
  - web-framework
  - orm
  - mvt
  - backend
  - full-stack
  - admin
  - forms
  - authentication
description: >
  Use this skill whenever the user asks about Django, Python web development,
  ORM models, migrations, views, templates, forms, admin, authentication,
  middleware, testing, caching, security, REST APIs, or deployment. Covers
  Django 6.0 including the model layer (fields, QuerySets, relationships,
  migrations, managers, transactions, aggregation), view layer (URLconfs,
  function-based views, class-based views, middleware, async views, file
  uploads), template layer (DTL syntax, tags, filters, custom templates),
  forms (Form, ModelForm, formsets, validation, widgets), admin site
  customization, authentication and authorization, caching (Redis, Memcached,
  database, file), security (CSRF, XSS, SQL injection, clickjacking, CSP),
  testing (TestCase, Client, fixtures), internationalization, performance
  optimization, GeoDjango, signals, sessions, pagination, email, logging,
  and deployment (WSGI, ASGI, static files, checklist). Use it for code
  generation, architecture decisions, debugging, migration from older
  versions, or any Django-related task.
---

# Django 6.0 Reference Skill

**Official Documentation:** https://docs.djangoproject.com/en/6.0/

This skill ensures Claude always uses the latest Django 6.0 patterns, APIs, and best practices.

---

## Quick Reference

| Topic | File |
|------|------|
| Getting Started (install, project structure, settings) | `getting-started.md` |
| Models (fields, relationships, Meta options, inheritance) | `models.md` |
| Model Field Reference (all field types, options, validators) | `model-fields.md` |
| QuerySets (filtering, Q objects, aggregation, F expressions, raw SQL) | `querysets.md` |
| Migrations (makemigrations, migrate, operations, data migrations) | `migrations.md` |
| Views (function-based, class-based, decorators, shortcuts) | `views.md` |
| URL Routing (URLconfs, path converters, reverse, namespaces) | `urls.md` |
| Templates (DTL syntax, tags, filters, inheritance, custom tags) | `templates.md` |
| Forms (Form, ModelForm, formsets, validation, widgets) | `forms.md` |
| Admin Site (registration, ModelAdmin, actions, customization) | `admin.md` |
| Authentication (users, groups, permissions, backends, password management) | `authentication.md` |
| Middleware (built-in, custom, order, async) | `middleware.md` |
| Security (CSRF, XSS, SQL injection, clickjacking, CSP, SSL/HTTPS) | `security.md` |
| Testing (TestCase, Client, fixtures, mocking, async testing) | `testing.md` |
| Caching (Redis, Memcached, database, file, per-view, low-level API) | `caching.md` |
| Settings Reference (core settings, database, middleware, apps) | `settings.md` |
| Deployment (WSGI, ASGI, static files, checklist, Docker) | `deployment.md` |
| Internationalization (i18n, localization, time zones, formatting) | `i18n.md` |
| Async Support (async views, ORM, middleware, testing) | `async.md` |
| Signals (built-in signals, custom signals, receivers) | `signals.md` |
| Performance and Optimization (database, caching, profiling) | `performance.md` |
| Class-Based Views (generic views, mixins, flattened index) | `class-based-views.md` |
| File Uploads and Storage (FileField, ImageField, storage API) | `file-uploads.md` |
| Sessions, Messages, Pagination (session backends, messages framework) | `sessions-messages.md` |
| REST API Patterns (DRF integration, serialization, API design) | `rest-api.md` |
| Breaking Changes (migration guide from Django 5.x to 6.0) | `breaking-changes.md` |
| Background Tasks (new Django 6.0 tasks framework) | `django-tasks.md` |
| PostgreSQL Extensions (ArrayField, HStore, Range, full-text search) | `postgres.md` |
| Email Framework (send_mail, EmailMessage, backends, attachments) | `email.md` |
| Multiple Databases (routers, primary/replica, manual selection) | `multiple-databases.md` |
| Contrib Packages (contenttypes, sitemaps, syndication, sites, flatpages) | `contrib-packages.md` |
| GeoDjango (GIS, spatial fields, spatial queries, GEOS API) | `geodjango.md` |
| Database Functions (Cast, Extract, Trunc, Concat, Window functions) | `database-functions.md` |
| Custom Management Commands (BaseCommand, arguments, testing) | `management-commands.md` |
| Serialization (JSON, XML, YAML, GeoJSON, natural keys, fixtures) | `serialization.md` |
| Validators & Exceptions (built-in/custom validators, exception hierarchy) | `validators-exceptions.md` |
| Apps API & System Checks (AppConfig, app registry, custom checks) | `apps-api.md` |
| Advanced ORM (Conditional Expressions, Custom Fields, Custom Lookups) | `advanced-orm.md` |
| Advanced Views (TemplateResponse, CSV, PDF, Conditional Processing) | `advanced-views.md` |
| Advanced Templates (Custom backends, Jinja2, template API) | `advanced-templates.md` |
| Logging (loggers, handlers, formatters, AdminEmailHandler) | `logging.md` |
| Misc (Cryptographic signing, Unicode, Admin docs, Composite PKs) | `misc.md` |
| Django Utils (cache, dateparse, encoding, html, http, text, timezone, translation) | `django-utils.md` |
| Composite Primary Keys (Meta.primary_key, migration, relations, forms, admin) | `composite-pk.md` |

---

## Core Concepts

- **MVT Architecture**: Model-View-Template — Django's variant of MVC where views are controllers and templates are views
- **ORM**: Full-featured ORM mapping Python classes to database tables with migrations
- **Admin**: Auto-generated admin interface for CRUD operations on models
- **Forms**: Server-side form handling with validation, CSRF protection, and model integration
- **Authentication**: Built-in user model, groups, permissions, password hashing, session-based auth
- **Middleware**: Request/response processing pipeline with built-in security, sessions, auth, CSRF
- **Async**: Async views, ORM, middleware for high-concurrency workloads (Django 6.0)
- **Security**: Built-in CSRF, XSS, SQL injection, clickjacking, CSP, and HSTS protections
- **Batteries Included**: Auth, admin, forms, sessions, caching, logging, testing, i18n, sitemaps, syndication

---

## First Project

```bash
# Install Django
pip install django

# Create project
django-admin startproject myproject
cd myproject

# Create app
python manage.py startapp myapp

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run dev server
python manage.py runserver
```

---

## Architecture at a Glance

| Component | Technology | Purpose |
|-----------|-----------|---------|
| ORM | Django ORM | Database abstraction, models, QuerySets |
| Templates | Django Template Language (DTL) | Server-side HTML rendering |
| Forms | Django Forms | Input validation, rendering, CSRF |
| Admin | Django Admin | Auto CRUD interface |
| Auth | django.contrib.auth | Users, groups, permissions |
| Middleware | Middleware pipeline | Request/response processing |
| URL Routing | URLconf | URL pattern → view mapping |
| Testing | django.test | TestCase, Client, fixtures |
| Cache | Cache framework | Redis, Memcached, DB, file, memory |
| Async | ASGI + async/await | Async views, ORM, middleware |

---

## Official Documentation

- **Docs**: https://docs.djangoproject.com/en/6.0/
- **Tutorial**: https://docs.djangoproject.com/en/6.0/intro/
- **Reference**: https://docs.djangoproject.com/en/6.0/ref/
- **Topics**: https://docs.djangoproject.com/en/6.0/topics/
- **How-to guides**: https://docs.djangoproject.com/en/6.0/howto/
- **Release notes**: https://docs.djangoproject.com/en/6.0/releases/6.0/

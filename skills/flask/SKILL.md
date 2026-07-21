---
name: flask-docs
version: "3.1.x"
tags:
  - flask
  - python
  - web-framework
  - wsgi
  - jinja2
  - routing
  - templates
  - blueprints
  - sessions
  - cookies
  - rest-api
  - middleware
  - testing
  - pytest
  - error-handling
  - signals
  - class-based-views
  - cli
  - click
  - security
  - async
  - debugging
  - logging
  - configuration
  - context
  - werkzeug
  - tutorial
  - extensions
  - development-server
  - shell
  - patterns
  - deploying
  - gevent
  - celery
  - sqlalchemy
  - sqlite
  - mongodb
  - wtforms
  - file-uploads
  - caching
  - streaming
  - spa
description: |
  Flask 3.1.x — routing, templates (Jinja2), blueprints, testing, contexts, signals, CLI, security, deployment.
---

# Flask Skill

Flask is a lightweight WSGI web application framework for Python. It provides configuration and conventions with sensible defaults to get started quickly. This skill covers the Flask 3.1.x User Guide.

## When to Use

- Building Python web applications with minimal boilerplate
- Creating REST APIs or JSON services
- Server-rendered HTML applications with Jinja2 templates
- Microservices and small-to-medium web projects
- Applications requiring async view support

## Skill Files

- **`quickstart.md`** — Minimal application, debug mode, HTML escaping, routing, variable rules, URL building, HTTP methods, static files, rendering templates, accessing request data (form, args, files, cookies), redirects, errors, responses, JSON APIs, sessions, message flashing, logging, WSGI middleware, extensions
- **`installation.md`** — Python version, dependencies (Werkzeug, Jinja, MarkupSafe, ItsDangerous, Click, Blinker), optional dependencies, virtual environments, installing Flask
- **`config.md`** — Configuration basics, debug mode, builtin configuration values, configuring from Python files, data files, environment variables, best practices, development/production configs, instance folders
- **`templates.md`** — Jinja setup, standard context (config, request, session, g, url_for, get_flashed_messages), controlling autoescaping, registering filters, context processors, streaming templates
- **`blueprints.md`** — Why blueprints, concept, creating blueprints, registering, nesting, blueprint resources (resource folder, static files, templates), building URLs, blueprint error handlers
- **`testing.md`** — Identifying tests, pytest fixtures, test client (requests, form data, JSON data), following redirects, accessing/modifying session, CLI runner, tests with active contexts
- **`error-handling.md`** — Error logging tools (Sentry), error handlers (registering, handling, generic handlers, unhandled exceptions), custom error pages, blueprint error handlers, returning API errors as JSON, custom exception classes
- **`contexts.md`** — Application context (purpose, lifetime, manual push, storing data with g, events/signals), request context (purpose, lifetime, manual push, how context works, callbacks and errors, teardown callbacks, signals, notes on proxies), application structure and lifecycle (setup, serving, middleware, request handling steps)
- **`signals.md`** — Core signals, subscribing to signals, creating signals with blinker Namespace, sending signals, signals and request context, decorator-based subscriptions with connect_via
- **`class-based-views.md`** — Basic reusable View, URL variables, view lifetime and self, init_every_request, view decorators, method hints, MethodView for APIs, REST API pattern
- **`cli.md`** — Application discovery (--app), run dev server, debug mode, reloader options, shell, dotenv support (.env, .flaskenv), env vars from virtualenv, custom commands, blueprint commands, application context, plugins, custom scripts, PyCharm integration
- **`security.md`** — Resource use (DoS prevention), XSS prevention, CSRF, JSON security, security headers (HSTS, CSP, X-Content-Type-Options, X-Frame-Options), Set-Cookie options (Secure, HttpOnly, SameSite), host header validation, copy/paste to terminal
- **`async.md`** — async/await performance characteristics, background tasks limitations, when to use Quart instead, extension async support with ensure_sync, other event loops
- **`debugging-logging.md`** — In production debugging, built-in Werkzeug debugger, external debuggers, logging basic configuration, default handler, removing default handler, emailing errors to admins, injecting request info into logs, other libraries
- **`tutorial.md`** — Flask tutorial (Flaskr blog app): project layout, application factory, SQLite database, authentication blueprint (register, login, logout, login_required), templates (base layout, inheritance), static files, blog blueprint (index, create, update, delete), making project installable (pyproject.toml), test coverage (pytest fixtures, auth actions, parameterized tests, coverage), deploying to production (build wheel, Waitress)
- **`extensions.md`** — Finding extensions on PyPI, naming conventions (Flask-Foo), deferred initialization pattern (init_app), common extensions (Flask-SQLAlchemy, Flask-Login, Flask-WTF, Flask-Mail, Flask-Caching), building custom extensions
- **`development-server.md`** — Command line (flask run, --app, --debug), address already in use (OSError, port conflicts, macOS AirPlay), deferred errors on reload, in code (app.run, main block)
- **`shell.md`** — Flask shell command (automatic app context), creating request context (test_request_context, push/pop), firing before/after request (preprocess_request, process_response, teardown_request), improving shell experience (shelltools module)
- **`patterns.md`** — Large applications as packages, application factories, application dispatching (DispatcherMiddleware, subdomain, path), URL processors (internationalized URLs, blueprint URL processors), SQLite 3 (connect on demand, easy querying, initial schemas), SQLAlchemy (Flask-SQLAlchemy, declarative, manual ORM, SQL abstraction), file uploads (secure_filename, MAX_CONTENT_LENGTH), caching (Flask-Caching), view decorators (login_required, cached, templated, endpoint), WTForms (forms, views, templates), template inheritance (base/child), message flashing (simple, categories, filtering), JavaScript/fetch/JSON (tojson, generating URLs, fetch requests, redirects, returning/receiving JSON), lazy loading views (LazyView), MongoDB with MongoEngine, favicon, streaming contents (basic, templates, stream_with_context), deferred request callbacks, HTTP method overrides, request content checksums, Celery background tasks (integration, factory, shared_task, calling, results, passing data), subclassing Flask, single-page applications
- **`deploying.md`** — Self-hosted WSGI servers (Gunicorn, Waitress, mod_wsgi, uWSGI, gevent, ASGI), reverse proxies (ProxyFix, nginx, Apache httpd), hosting platforms (PythonAnywhere, Google App Engine, Google Cloud Run, AWS Elastic Beanstalk, Microsoft Azure)
- **`gevent.md`** — Enabling gevent (monkey.patch_all, production deployment with Gunicorn/uWSGI), concurrent tasks (gevent.spawn, context access with stream_with_context/copy_current_request_context), combining with async/await (overriding async_to_sync, asyncio event loop in gevent), libuv support (gevent.config.loop)

## Key Concepts

- **WSGI**: Flask is a WSGI application; the Flask object is the WSGI callable
- **Routing**: URL rules via `@app.route()`, variable rules with converters, URL building with `url_for()`
- **Request/Response**: `request` global proxy for request data; return values auto-converted to response objects
- **Templates**: Jinja2 integration with autoescaping, context processors, filters
- **Blueprints**: Modular application components with their own routes, templates, static files
- **Contexts**: Application context (`current_app`, `g`) and request context (`request`, `session`) as context locals
- **Configuration**: Dict-based config with multiple loading strategies (files, env vars, objects)
- **Testing**: Test client for requests without running a server, CLI runner for commands
- **Signals**: Blinker-based event system for decoupled notifications
- **CLI**: Click-based `flask` command with custom commands, dotenv support

## Common Patterns

```python
from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = b'your-secret-key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user/<username>')
def profile(username):
    return f'User: {username}'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        flash('Logged in successfully')
        return redirect(url_for('index'))
    return render_template('login.html')
```

## Version

Flask 3.1.x — requires Python 3.9+

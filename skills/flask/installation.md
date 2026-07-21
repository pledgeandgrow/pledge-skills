# Flask Installation

## Python Version

Flask 3.1.x supports **Python 3.9+**.

## Dependencies

### Core Dependencies

- **Werkzeug** — WSGI toolkit, implements request/response objects and development server
- **Jinja** — template engine
- **MarkupSafe** — HTML escaping
- **ItsDangerous** — cryptographically signed cookies for sessions
- **Click** — CLI framework for `flask` command
- **Blinker** — signal support

### Optional Dependencies

- **python-dotenv** — `.env` file support for `flask run`
- **Watchdog** — faster reloader for development

### greenlet

**greenlet** is required for async with Gevent. It is installed automatically when:
- Using `pip install flask[async]`
- Using Gevent or eventlet

## Virtual Environments

Virtual environments keep project dependencies separate from system Python packages.

### Create an Environment

```bash
$ python3 -m venv .venv
```

### Activate the Environment

**Linux/macOS (Bash):**
```bash
$ . .venv/bin/activate
```

**Linux/macOS (Fish):**
```bash
$ . .venv/bin/activate.fish
```

**Windows (CMD):**
```cmd
> .venv\Scripts\activate
```

**Windows (PowerShell):**
```powershell
> .venv\Scripts\Activate.ps1
```

Activate before installing packages or running the application. The shell prompt changes to show the active environment.

## Install Flask

```bash
$ pip install Flask
```

For async support:
```bash
$ pip install flask[async]
```

For development (includes testing dependencies):
```bash
$ pip install -e ".[dev]"
```

# Flask Command Line Interface

The `flask` command is implemented using **Click**. It provides application discovery, development server, shell, and custom commands.

## Application Discovery

The `--app` option tells Flask where to find your application:

```bash
$ flask --app hello run
```

### Typical `--app` Values

| Value | Behavior |
|-------|----------|
| (not set) | Imports `app.py` or `wsgi.py`, auto-detects `app`/`application` or `create_app`/`make_app` |
| `hello` | Imports `hello`, auto-detects app instance or factory |
| `src/hello` | Sets cwd to `src`, then imports `hello` |
| `hello:app2` | Uses `app2` Flask instance from `hello` |
| `hello:create_app("dev")` | Calls `create_app` factory with `"dev"` argument |

Auto-detection order within the import:
1. Application instance named `app` or `application`
2. Any application instance
3. Factory function named `create_app` or `make_app`

If parentheses follow the factory name, contents are parsed as Python literals (strings must be quoted).

## Run the Development Server

```bash
$ flask --app hello run
 * Serving Flask app "hello"
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

**Warning**: Never use the development server in production. It is not secure, stable, or efficient.

If port 5000 is in use: `OSError: [Errno 98]` (Linux) or `OSError: [WinError 10013]` (Windows).

### Debug Mode

```bash
$ flask --app hello run --debug
```

Enables interactive debugger and reloader by default. Can also be passed at the top level:

```bash
$ flask --app hello --debug run
```

### Watch and Ignore Files with the Reloader

Watch additional files:
```bash
$ flask run --extra-files file1:dirA/file2:dirB/
```

Ignore files with fnmatch patterns:
```bash
$ flask run --exclude-patterns "*.pyc:__pycache__"
```

Separate paths/patterns with `:` (Unix) or `;` (Windows).

## Open a Shell

```bash
$ flask shell
```

An application context is active, and the app instance is imported. Use `shell_context_processor()` to add automatic imports:

```python
@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Post=Post)
```

## Environment Variables From dotenv

If **python-dotenv** is installed, Flask loads environment variables from `.env` and `.flaskenv`:

- `.flaskenv` — public variables (e.g., `FLASK_APP`), can be committed to repo
- `.env` — private variables, should not be committed

Priority: command line > `.env` > `.flaskenv`

Files are scanned upwards from the directory you call `flask` from.

### Setting Command Options

Use `FLASK_COMMAND_OPTION` pattern:

```bash
# Instead of: flask run --port 8000
$ export FLASK_RUN_PORT=8000
$ flask run
```

Add to `.flaskenv` for persistent defaults.

### Disable dotenv

```bash
$ export FLASK_SKIP_DOTENV=1
$ flask run
```

## Environment Variables From virtualenv

Add export statements to the virtualenv's activate script:

| Shell | File |
|-------|------|
| Bash | `.venv/bin/activate` |
| Fish | `.venv/bin/activate.fish` |
| Windows CMD | `.venv\Scripts\activate.bat` |
| PowerShell | `.venv\Scripts\activate.ps1` |

```bash
# Add to activate script:
export FLASK_APP=hello
```

Prefer dotenv over this approach.

## Custom Commands

```python
import click
from flask import Flask

app = Flask(__name__)

@app.cli.command("create-user")
@click.argument("name")
def create_user(name):
    ...
```

```bash
$ flask create-user admin
```

### Grouped Commands

```python
from flask.cli import AppGroup

user_cli = AppGroup('user')

@user_cli.command('create')
@click.argument('name')
def create_user(name):
    ...

app.cli.add_command(user_cli)
```

```bash
$ flask user create demo
```

### Registering Commands with Blueprints

```python
bp = Blueprint('students', __name__)

@bp.cli.command('create')
@click.argument('name')
def create(name):
    ...

app.register_blueprint(bp)
```

```bash
$ flask students create alice
```

Customize the group name:
```python
bp = Blueprint('students', __name__, cli_group='other')
# or: app.register_blueprint(bp, cli_group='other')
```

Remove nesting (merge to app level):
```python
bp = Blueprint('students', __name__, cli_group=None)
```

### Application Context

Commands added via `@app.cli.command()` or `FlaskGroup` run with an application context. Use `with_appcontext()` decorator for commands added other ways:

```python
from flask.cli import with_appcontext

@click.command()
@with_appcontext
def do_work():
    ...

app.cli.add_command(do_work)
```

## Plugins

Flask auto-loads commands from the `flask.commands` entry point in `pyproject.toml`:

```toml
[project.entry-points."flask.commands"]
my-command = "my_extension.commands:cli"
```

```python
# my_extension/commands.py
import click

@click.command()
def cli():
    ...
```

## Custom Scripts

For app factory pattern, create a custom Click script:

```python
import click
from flask import Flask
from flask.cli import FlaskGroup

def create_app():
    app = Flask('wiki')
    # other setup
    return app

@click.group(cls=FlaskGroup, create_app=create_app)
def cli():
    """Management script for the Wiki application."""
```

```toml
[project.scripts]
wiki = "wiki:cli"
```

```bash
$ pip install -e .
$ wiki run
```

**Note**: The `flask` command is recommended over custom scripts — it's separate from your code and more resilient to module-level errors.

## PyCharm Integration

Create a Python run configuration:
1. Set **Module name** to `flask`
2. Set **Parameters** to `--app hello run --debug`
3. Uncheck PYTHONPATH options if project is installed as a package

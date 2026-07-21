# Flask Configuration Handling

## Configuration Basics

`app.config` is a dictionary-like object. Configuration should be set up before the application starts serving requests.

```python
app = Flask(__name__)
app.config['TESTING'] = True
```

Multiple keys at once:
```python
app.config.update(
    TESTING=True,
    SECRET_KEY=b'your-secret-key'
)
```

## Debug Mode

The recommended way to enable debug mode is via the CLI:

```bash
$ flask --app hello run --debug
```

This enables the debugger and reloader. Avoid setting `DEBUG` in config directly in production code.

## Builtin Configuration Values

### Core Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `DEBUG` | `False` | Enable debug mode (use `--debug` instead) |
| `TESTING` | `False` | Enable testing mode; exceptions propagated, no error catching |
| `PROPAGATE_EXCEPTIONS` | `None` | Explicitly enable/disable exception propagation |
| `TRAP_BAD_REQUEST_ERRORS` | `False` | Treat bad request errors as 500 for debugging |
| `SECRET_KEY` | `None` | Secret key for sessions (required for sessions) |
| `SECRET_KEY_FALLBACKS` | `None` | List of old secret keys for rotation |

### Session Cookie Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `SESSION_COOKIE_NAME` | `session` | Name of the session cookie |
| `SESSION_COOKIE_DOMAIN` | `None` | Domain for the session cookie |
| `SESSION_COOKIE_PATH` | `None` | Path for the session cookie |
| `SESSION_COOKIE_HTTPONLY` | `True` | Prevent JavaScript access to cookie |
| `SESSION_COOKIE_SECURE` | `False` | Restrict cookie to HTTPS |
| `SESSION_COOKIE_SAMESITE` | `None` | SameSite attribute: `'Lax'`, `'Strict'`, or `None` |
| `PERMANENT_SESSION_LIFETIME` | `timedelta(days=31)` | Lifetime of permanent session |
| `SESSION_REFRESH_EACH_REQUEST` | `True` | Send cookie on each response |

### File and Content Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `MAX_CONTENT_LENGTH` | `None` | Max request body size in bytes |
| `MAX_FORM_MEMORY_PARTS` | 500 | Max non-file form parts |
| `MAX_FORM_PARTS` | 1000 | Max multipart form parts |

### URL and Template Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `SERVER_NAME` | `None` | Host and port for URL building |
| `APPLICATION_ROOT` | `"/"` | Application root path |
| `PREFERRED_URL_SCHEME` | `"http"` | URL scheme for external URL building |
| `TEMPLATES_AUTO_RELOAD` | `False` | Reload templates on change (debug enables this) |
| `EXPLAIN_TEMPLATE_LOADING` | `False` | Log template loading process |
| `MAX_COOKIE_SIZE` | 4093 | Max cookie size warning threshold |
| `PROVIDE_AUTOMATIC_OPTIONS` | `True` | Automatically handle OPTIONS |
| `SEND_FILE_MAX_AGE_DEFAULT` | `timedelta(hours=12)` | Cache control max age for static files |

## Configuring from Python Files

### `from_object()`

```python
app.config.from_object('yourapplication.default_settings')
app.config.from_envvar('YOURAPPLICATION_SETTINGS')
```

Configuration as a class:
```python
class Config:
    TESTING = False
    SECRET_KEY = b'secret'

class ProductionConfig(Config):
    DATABASE_URI = 'mysql://user@localhost/production'

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URI = 'sqlite:///development.db'

class TestingConfig(Config):
    TESTING = True
    DATABASE_URI = 'sqlite:///:memory:'
```

### `from_envvar()`

```python
# Set env var: YOURAPPLICATION_SETTINGS=/path/to/settings.py
app.config.from_envvar('YOURAPPLICATION_SETTINGS')
```

## Configuring from Data Files

Use `from_file()` to load TOML, JSON, or other formats:

```python
import tomllib

app.config.from_file("config.toml", load=tomllib.load, text=False)
```

```python
import json

app.config.from_file("config.json", load=json.load)
```

The file path is relative to the application root or instance path.

## Configuring from Environment Variables

Use `from_prefixed_env()` to load from `FLASK_` prefixed environment variables:

```bash
$ export FLASK_SECRET_KEY="5f352379324c22463451387a6aec5d2d"
$ export FLASK_TESTING=True
$ export FLASK_OPTION="value"
```

```python
app.config.from_prefixed_env()
```

- Prefix `FLASK_` is stripped
- Values are parsed with `json.loads()` (falls back to string)
- Nested keys use `__` separator: `FLASK_DATABASE__URI` → `config['DATABASE']['URI']`

## Configuration Best Practices

1. **Use application factories** — create and configure the app in a function
2. **Load configuration early** — before serving requests
3. **Access config in request handlers via `current_app.config`** — not by importing the app object
4. **Don't modify config during requests** — all setup must happen before serving

### Application Factory Pattern

```python
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config.from_prefixed_env()

    from flask_parcel import db
    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app
```

## Development / Production

Use class inheritance for environment-specific configs:

```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
```

Select config:
```python
app = Flask(__name__)
app.config.from_object(ProductionConfig)
```

## Instance Folders

Flask has a per-deployment instance folder for non-version-controlled files:

- Default location: `/instance` (next to the package/module)
- Installed apps: `$PREFIX/var/myapp-instance`

```python
app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.py', silent=True)
```

Access instance files:
```python
with app.open_instance_resource('application.cfg') as f:
    config = f.read()
```

Use the instance folder for:
- Configuration that changes between deployments
- Secrets that should not be version controlled
- SQLite databases

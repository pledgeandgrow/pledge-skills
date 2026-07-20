# Apps API & System Checks — Django 6.0

## AppConfig

```python
# myapp/apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp"           # Full Python path to the app
    label = "myapp"          # Short label (default: last part of name)
    verbose_name = "My App"  # Human-readable name
    path = "/custom/path"    # Filesystem path (auto-detected by default)

    def ready(self):
        """Called when the app registry is fully populated."""
        # Import signals, register checks, etc.
        from . import signals  # noqa
```

### Registering AppConfig

```python
# settings.py
INSTALLED_APPS = [
    "myapp.apps.MyAppConfig",  # Explicit app config
    # or just "myapp" (uses default_app_config)
]

# myapp/__init__.py
default_app_config = "myapp.apps.MyAppConfig"
```

## App Registry

```python
from django.apps import apps

# Get app config by label
app_config = apps.get_app_config("myapp")
print(app_config.name)          # "myapp"
print(app_config.label)         # "myapp"
print(app_config.verbose_name)  # "My App"
print(app_config.path)          # "/path/to/myapp"
print(app_config.models_module) # models.py module

# Get model by app_label and model_name
Article = apps.get_model("myapp", "Article")
Article = apps.get_model("myapp.Article")  # Alternative

# List all installed apps
for app_config in apps.get_app_configs():
    print(app_config.label)

# List all models
for model in apps.get_models():
    print(model._meta.label)

# List models for a specific app
for model in apps.get_app_config("myapp").get_models():
    print(model.__name__)

# Check if app is installed
apps.is_installed("django.contrib.auth")

# Get model by name (searches all apps)
try:
    model = apps.get_model(label="Article")
except LookupError:
    pass
```

## AppConfig Attributes

```python
class MyAppConfig(AppConfig):
    # Required
    name = "myapp"  # Full Python path

    # Optional
    default_auto_field = "django.db.models.BigAutoField"
    label = "myapp"           # Must be unique across project
    verbose_name = "My App"
    path = "/abs/path/to/app"  # Auto-detected if not set

    # Methods
    def ready(self):
        """Called after all apps are loaded."""
        pass

    def get_models(self, include_auto_created=False, include_swapped=False):
        """Return iterators of models in this app."""
        return super().get_models(include_auto_created, include_swapped)
```

## System Check Framework

### Running Checks

```bash
# Run all checks
python manage.py check

# Run specific tag
python manage.py check --tag models
python manage.py check --tag security

# Deployment checks
python manage.py check --deploy

# List all tags
python manage.py check --list-tags
```

### Writing Custom Checks

```python
# myapp/checks.py
from django.core.checks import Error, Warning, Info, register

@register()
def check_my_setting(app_configs, **kwargs):
    errors = []
    from django.conf import settings
    if not hasattr(settings, "MY_REQUIRED_SETTING"):
        errors.append(
            Error(
                "MY_REQUIRED_SETTING is not defined",
                hint="Add MY_REQUIRED_SETTING to settings.py",
                id="myapp.E001",
                obj=None,
            )
        )
    return errors

# Tagged check
@register("security")
def check_https_setting(app_configs, **kwargs):
    errors = []
    from django.conf import settings
    if settings.DEBUG and getattr(settings, "SECURE_SSL_REDIRECT", False):
        errors.append(
            Warning(
                "SECURE_SSL_REDIRECT with DEBUG=True may cause redirect loops",
                id="myapp.W001",
            )
        )
    return errors
```

### Check Message Classes

```python
from django.core.checks import Error, Warning, Info, Debug

# Error — must be fixed
Error(
    msg="Description of the problem",
    hint="How to fix it",
    id="app_label.E001",  # Convention: app_label + E/W/I/D + number
    obj=model_or_field,   # Optional: related object
)

# Warning — should be reviewed
Warning(msg="...", hint="...", id="app_label.W001")

# Info — informational
Info(msg="...", id="app_label.I001")

# Debug — debug-level info
Debug(msg="...", id="app_label.D001")
```

### Registering Checks

```python
# In checks.py
from django.core.checks import register, Tags

# Register with no tag
@register()
def check_something(app_configs, **kwargs):
    ...

# Register with tag
@register(Tags.models)
def check_models(app_configs, **kwargs):
    ...

@register(Tags.security)
def check_security(app_configs, **kwargs):
    ...

@register(Tags.compatibility)
def check_compat(app_configs, **kwargs):
    ...

# Register with multiple tags
@register(Tags.models, Tags.database)
def check_model_db(app_configs, **kwargs):
    ...
```

### Built-in Check Tags

| Tag | Description |
|-----|-------------|
| `admin` | Admin site checks |
| `async_support` | Async compatibility |
| `caches` | Cache configuration |
| `compatibility` | Backward compatibility |
| `database` | Database configuration |
| `files` | File handling |
| `models` | Model field/relationship checks |
| `security` | Security configuration |
| `sites` | Sites framework |
| `staticfiles` | Static files |
| `templates` | Template configuration |
| `translation` | i18n/l10n |
| `urls` | URL configuration |

### Loading Checks in AppConfig

```python
class MyAppConfig(AppConfig):
    name = "myapp"

    def ready(self):
        from . import checks  # noqa: F401
```

### Silencing Checks

```python
# settings.py
SILENCED_SYSTEM_CHECKS = [
    "security.W001",  # SSL redirect warning
    "myapp.W001",     # Custom warning
]
```

### Deployment Checks

```bash
python manage.py check --deploy
```

Common deployment checks:
- `DEBUG` must be `False`
- `SECRET_KEY` must not be hardcoded
- `ALLOWED_HOSTS` must be set
- `SECURE_SSL_REDIRECT` should be `True`
- `SESSION_COOKIE_SECURE` should be `True`
- `CSRF_COOKIE_SECURE` should be `True`
- `SECURE_HSTS_SECONDS` should be set
- `SECURE_CONTENT_TYPE_NOSNIFF` should be `True`
- `X_FRAME_OPTIONS` should be set

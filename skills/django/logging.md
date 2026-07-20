# Logging — Django 6.0

## Overview

Django uses Python's built-in `logging` module. The cast of players:

- **Loggers** — Entry points for logging messages
- **Handlers** — Where messages go (console, file, email)
- **Filters** — Additional control over which messages are handled
- **Formatters** — How messages are displayed

## Log Levels

| Level | Numeric Value | Usage |
|-------|--------------|-------|
| `CRITICAL` | 50 | System-critical errors |
| `ERROR` | 40 | Errors that should be investigated |
| `WARNING` | 30 | Something unexpected, but not fatal |
| `INFO` | 20 | Confirmation that things work as expected |
| `DEBUG` | 10 | Detailed information for debugging |

## Basic Configuration

### Console Logging

```python
# settings.py
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}
```

### File Logging

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": "/path/to/django/debug.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
}
```

### Rotating File Handler

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "/path/to/django/debug.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
    },
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "INFO",
            "propagate": True,
        },
    },
}
```

## Complex Configuration

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "filters": {
        "require_debug_true": {
            "()": "django.utils.log.RequireDebugTrue",
        },
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "filters": ["require_debug_true"],
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "/var/log/django/debug.log",
            "maxBytes": 1024 * 1024 * 5,
            "backupCount": 5,
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["mail_admins", "file"],
            "level": "ERROR",
            "propagate": False,
        },
        "myapp": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
```

## Using Logging in Your Code

```python
import logging

logger = logging.getLogger(__name__)

def my_view(request):
    logger.debug("Debug message with user=%s", request.user)
    logger.info("User %s accessed view", request.user)
    logger.warning("Unexpected condition for user %s", request.user)
    logger.error("Error processing request for user %s", request.user)
    logger.critical("Critical failure in system")
```

### Logging Exceptions

```python
try:
    risky_operation()
except Exception:
    logger.exception("An error occurred during risky_operation")
    # logger.exception() automatically includes traceback
```

### Logging with Extra Context

```python
logger.info(
    "User logged in",
    extra={
        "user_id": user.id,
        "ip_address": request.META.get("REMOTE_ADDR"),
    },
)
```

## Django's Built-in Loggers

| Logger | Purpose |
|--------|---------|
| `django` | Catch-all logger for all Django messages |
| `django.request` | Log messages related to request handling |
| `django.server` | Messages from runserver command |
| `django.template` | Template rendering messages |
| `django.db.backends` | Database query logging |
| `django.security.*` | Security-related events (CSRF, disallowed hosts, etc.) |
| `django.db.backends.schema` | Schema migration SQL |

### Logging SQL Queries

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django.db.backends": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
# All SQL queries will be logged at DEBUG level
```

## AdminEmailHandler

```python
LOGGING = {
    # ...
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "include_html": True,  # Send HTML email with traceback
        },
    },
    "loggers": {
        "django.request": {
            "handlers": ["mail_admins"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}
```

### Custom AdminEmailHandler Filtering

```python
class SkipNoiseFilter(logging.Filter):
    def filter(self, record):
        if "favicon.ico" in record.getMessage():
            return False
        return True

LOGGING = {
    # ...
    "filters": {
        "skip_noise": {"()": "myapp.logging.SkipNoiseFilter"},
    },
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "filters": ["skip_noise"],
        },
    },
}
```

## Custom Logging Configuration

```python
# settings.py
LOGGING_CONFIG = None  # Disable Django's automatic config

import logging.config
logging.config.dictConfig({
    # Your custom config
})
```

## Disabling Logging Configuration

```python
# If you use a third-party logging framework (e.g., structlog)
LOGGING_CONFIG = None
```

## Security Implications

- **Don't log sensitive data**: Passwords, tokens, credit card numbers
- **AdminEmailHandler sends to ADMINS**: Ensure email is secure
- **Log files can contain user data**: Protect file permissions
- **SQL query logs may contain user input**: Be cautious in production

```python
# settings.py
ADMINS = [("Admin", "admin@example.com")]
MANAGERS = ADMINS
```

## Third-Party Integrations

### structlog

```python
# pip install structlog
import structlog
logger = structlog.get_logger()

def my_view(request):
    logger.info("user_login", user_id=request.user.id, ip=request.META["REMOTE_ADDR"])
```

### Sentry

```python
# pip install sentry-sdk
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://your-dsn@sentry.io/project",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
)
```
